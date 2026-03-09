'use client';

import React, { useState, useEffect, useRef } from 'react';
import { findMatch, checkMatchState, submitScore, finishPlayer } from '@/app/actions/pvpActions';
import { sfxRun, sfxSuccess, sfxError, sfxClick } from '@/lib/sounds';

type MatchStatus = 'idle' | 'waiting' | 'battle' | 'results';

export default function PvpClient() {
    const [status, setStatus] = useState<MatchStatus>('idle');
    const [roomCode, setRoomCode] = useState('');
    const [matchId, setMatchId] = useState<string | null>(null);
    const [role, setRole] = useState<'player1' | 'player2'>('player1');
    const [questions, setQuestions] = useState<any[]>([]);

    // Gameplay states
    const [qIndex, setQIndex] = useState(0);
    const [myScore, setMyScore] = useState(0);
    const [theirScore, setTheirScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [winner, setWinner] = useState<string | null>(null);
    const [waitingFinish, setWaitingFinish] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    const pollRef = useRef<NodeJS.Timeout | null>(null);

    const handleFindMatch = async (isPrivate: boolean = false) => {
        sfxClick();
        setStatus('waiting');
        const code = isPrivate ? roomCode : undefined;
        const result = await findMatch(code);

        setMatchId(result.matchId);
        setRole(result.role as 'player1' | 'player2');
        setQuestions(result.questions);
        setMyScore(0);
        setTheirScore(0);
        setQIndex(0);
        setTimeLeft(60);
        setWaitingFinish(false);
        setWinner(null);
        setStartTime(null);

        if (result.role === 'player2') {
            // Instantly joined! Wait for the polling loop to catch up and set to battle
        }
    };

    // The Synchronization Engine
    useEffect(() => {
        if (!matchId) return;

        pollRef.current = setInterval(async () => {
            const state = await checkMatchState(matchId);
            if (!state) return;

            // Opponent joined! Start battle
            if (state.state === 'active' && status === 'waiting') {
                setStatus('battle');
                setStartTime(state.startedAt);
                sfxRun();
            }

            // Sync scores
            if (state.state === 'active' || state.state === 'finished') {
                const theirData = role === 'player1' ? state.player2 : state.player1;
                if (theirData) setTheirScore(theirData.score);
            }

            // Game over logic triggered by opponent completing or both finishing
            if (state.state === 'finished' && status !== 'results') {
                setStatus('results');
                // Determine winner locally (could also be returned from server)
                const me = state[role];
                const them = role === 'player1' ? state.player2 : state.player1;
                if (me && them) {
                    if (me.score > them.score) setWinner('YOU WON! 🎉');
                    else if (them.score > me.score) setWinner('OPPONENT WON 💀');
                    else setWinner('TIE!');
                }
            }
        }, 2000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [matchId, status, role]);

    // The Match Timer
    useEffect(() => {
        if (status === 'battle' && !waitingFinish && startTime) {
            const timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const remaining = Math.max(0, 60 - elapsed);
                setTimeLeft(remaining);
                if (remaining <= 0) {
                    handleFinish();
                    clearInterval(timer);
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status, waitingFinish, startTime]);

    const handleAnswer = async (index: number) => {
        if (waitingFinish) return;

        const currentQ = questions[qIndex];
        if (index === currentQ.correctIndex) {
            sfxSuccess();
            setMyScore((s) => s + 100);
            await submitScore(matchId!, role, 100);
        } else {
            sfxError();
            setMyScore((s) => Math.max(0, s - 20)); // minor penalty
            await submitScore(matchId!, role, -20);
        }

        if (qIndex + 1 < questions.length) {
            setQIndex(qIndex + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        setWaitingFinish(true);
        if (matchId) {
            await finishPlayer(matchId, role);
        }
    };

    if (status === 'idle') {
        return (
            <div style={{ maxWidth: '500px', margin: '60px auto', padding: '40px', background: 'rgba(5,13,38,0.85)', borderRadius: '24px', border: '1px solid rgba(0,200,255,0.3)', color: '#fff', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
                <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '20px', color: '#00c8ff', marginBottom: '40px' }}>MCQ PVP ARENA</h1>

                <div style={{ marginBottom: '30px' }}>
                    <button
                        onClick={() => handleFindMatch(false)}
                        style={{ width: '100%', padding: '20px', background: '#00c8ff', color: '#000', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,200,255,0.3)' }}>
                        ⚔️ SEARCH PUBLIC MATCH
                    </button>
                </div>

                <p style={{ color: '#888', marginBottom: '20px' }}>— OR PRIVATE MATCH —</p>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        placeholder="ENTER ROOM CODE..."
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        style={{ flex: 1, padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    />
                    <button
                        onClick={() => handleFindMatch(true)}
                        style={{ padding: '0 30px', background: 'transparent', border: '2px solid #00c8ff', color: '#00c8ff', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                        JOIN
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'waiting') {
        return (
            <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Press Start 2P'", textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>📡</div>
                <h2 style={{ color: '#00c8ff', fontSize: '18px', marginBottom: '20px' }}>WAITING FOR OPPONENT...</h2>
                {role === 'player1' && roomCode && (
                    <div style={{ background: 'rgba(0,200,255,0.1)', padding: '20px', borderRadius: '12px', border: '1px dashed #00c8ff' }}>
                        <p style={{ fontSize: '10px', color: '#888', marginBottom: '10px' }}>ROOM CODE (SHARE THIS):</p>
                        <h1 style={{ fontSize: '36px', color: '#fff', margin: 0 }}>{roomCode}</h1>
                    </div>
                )}
                <style jsx>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }`}</style>
            </div>
        );
    }

    if (status === 'battle') {
        const currentQ = questions[qIndex];

        return (
            <div style={{ maxWidth: '800px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '20px', color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,13,38,0.8)', padding: '20px 30px', borderRadius: '16px', border: '1px solid rgba(0,200,255,0.2)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '10px', color: '#00e5ff', fontWeight: 'bold', letterSpacing: '2px' }}>YOU</p>
                        <h2 style={{ margin: 0, fontSize: '32px', fontFamily: "'Press Start 2P'", color: '#00e5ff' }}>{myScore}</h2>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: timeLeft <= 10 ? '#ff4757' : '#fff' }}>00:{timeLeft.toString().padStart(2, '0')}</div>
                        <div style={{ fontSize: '10px', color: '#667', marginTop: '5px' }}>QUESTION {qIndex + 1}/{questions.length}</div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '10px', color: '#ff4757', fontWeight: 'bold', letterSpacing: '2px' }}>OPPONENT</p>
                        <h2 style={{ margin: 0, fontSize: '32px', fontFamily: "'Press Start 2P'", color: '#ff4757' }}>{theirScore}</h2>
                    </div>
                </div>

                {waitingFinish ? (
                    <div style={{ padding: '60px', textAlign: 'center', background: 'rgba(5,13,38,0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ color: '#00e5ff', fontFamily: "'Press Start 2P'", fontSize: '16px' }}>FINISHED!</h2>
                        <p style={{ color: '#888' }}>Waiting for opponent to finish their questions or time to expire...</p>
                    </div>
                ) : (
                    <div style={{ background: 'rgba(5,13,38,0.8)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ fontSize: '20px', marginBottom: '30px', lineHeight: '1.5' }}>{currentQ?.question}</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            {currentQ?.options.map((opt: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    style={{
                                        padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px', color: '#fff', fontSize: '16px', cursor: 'pointer',
                                        transition: 'all 0.2s', textAlign: 'left'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    {['A', 'B', 'C', 'D'][i]}. {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (status === 'results') {
        const isWin = winner === 'YOU WON! 🎉';
        const isTie = winner === 'TIE!';
        const color = isWin ? '#00e5ff' : isTie ? '#f1c40f' : '#ff4757';

        return (
            <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', fontFamily: "'Press Start 2P'" }}>
                <h1 style={{ fontSize: '48px', color, marginBottom: '20px', textShadow: `0 0 20px ${color}88` }}>{winner}</h1>
                <div style={{ display: 'flex', gap: '50px', margin: '40px 0', fontSize: '24px' }}>
                    <div style={{ color: '#00e5ff' }}>YOU: {myScore}</div>
                    <div style={{ color: '#ff4757' }}>VS: {theirScore}</div>
                </div>
                <button
                    onClick={() => setStatus('idle')}
                    style={{ padding: '20px 40px', background: color, color: '#000', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    PLAY AGAIN
                </button>
            </div>
        );
    }

    return null;
}
