'use server';

import fs from 'fs/promises';
import path from 'path';

const MATCHES_FILE = path.join(process.cwd(), 'src', 'data', 'matches.json');
const QUESTIONS_FILE = path.join(process.cwd(), 'src', 'data', 'questions.json');

// Global mutex to prevent file write concurrency issues in stateless Next.js actions
const globalAny = global as any;
globalAny.pvpWriteLock = globalAny.pvpWriteLock || Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
    const previous = globalAny.pvpWriteLock;
    let resolveLock!: () => void;
    globalAny.pvpWriteLock = new Promise<void>((r) => { resolveLock = r; });

    await previous;
    try {
        return await fn();
    } finally {
        resolveLock();
    }
}

// Helper to reliably read/write
async function getMatches() {
    try {
        const data = await fs.readFile(MATCHES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        // If file doesn't exist, return empty obj
        return {};
    }
}

async function saveMatches(data: any) {
    await fs.writeFile(MATCHES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function getRandomQuestions(count: number = 10) {
    const data = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    const allQs = JSON.parse(data);
    // Shuffle and pick
    return allQs.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Garbage collection: clear old matches > 10 mins
async function cleanOldMatches(matches: any) {
    const now = Date.now();
    let madeChanges = false;
    for (const [id, match] of Object.entries<any>(matches)) {
        if (now - match.createdAt > 10 * 60 * 1000) {
            delete matches[id];
            madeChanges = true;
        }
    }
    return madeChanges;
}

export async function findMatch(roomCode?: string) {
    return withLock(async () => {
        const matches = await getMatches();
        await cleanOldMatches(matches);

        // If searching for a specific room or public
        let foundId = null;
        for (const [id, match] of Object.entries<any>(matches)) {
            if (match.state === 'waiting' && !match.player2) {
                if (roomCode) {
                    if (match.code === roomCode) {
                        foundId = id;
                        break;
                    }
                } else if (!match.code) { // Public game
                    foundId = id;
                    break;
                }
            }
        }

        if (foundId) {
            // Join existing match
            matches[foundId].player2 = { score: 0, finished: false };
            matches[foundId].state = 'active';
            matches[foundId].startedAt = Date.now();
            await saveMatches(matches);
            return { matchId: foundId, role: 'player2', questions: matches[foundId].questions };
        } else {
            // Create new match
            const newId = Math.random().toString(36).substring(2, 9);
            const code = roomCode || null;
            const questions = await getRandomQuestions(10);

            matches[newId] = {
                id: newId,
                code,
                state: 'waiting',
                createdAt: Date.now(),
                questions,
                player1: { score: 0, finished: false }
            };
            await saveMatches(matches);
            return { matchId: newId, role: 'player1', questions };
        }
    });
}

export async function checkMatchState(matchId: string) {
    const matches = await getMatches();
    return matches[matchId] || null;
}

export async function submitScore(matchId: string, role: 'player1' | 'player2', increment: number) {
    return withLock(async () => {
        const matches = await getMatches();
        if (matches[matchId] && matches[matchId][role]) {
            matches[matchId][role].score += increment;
            await saveMatches(matches);
        }
        return true;
    });
}

export async function finishPlayer(matchId: string, role: 'player1' | 'player2') {
    return withLock(async () => {
        const matches = await getMatches();
        if (!matches[matchId]) return null;

        if (matches[matchId][role]) {
            matches[matchId][role].finished = true;
        }

        // Check if both finished
        if (matches[matchId].player1?.finished && matches[matchId].player2?.finished) {
            matches[matchId].state = 'finished';
        } else if (matches[matchId].state === 'waiting' && role === 'player1') {
            // Host quit early
            matches[matchId].state = 'finished';
        }

        await saveMatches(matches);
        return matches[matchId];
    });
}
