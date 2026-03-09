import { create } from 'zustand';

export interface ConsoleMessage {
    id: string;
    type: 'log' | 'error' | 'success' | 'info' | 'warn';
    text: string;
    timestamp: number;
}

export interface LevelProgress {
    stars: number;
    completed: boolean;
    hintsUsed: number;
    bestTime?: number;
}

interface GameState {
    // Player
    playerName: string;
    health: number;
    maxHealth: number;
    xp: number;
    gems: number;
    streak: number;
    lastPlayed: string | null;

    // Level
    currentWorld: number;
    currentLevel: number;
    levelProgress: Record<string, LevelProgress>;

    // Code editor
    code: string;
    isRunning: boolean;
    consoleMessages: ConsoleMessage[];

    // Game screen
    gamePhase: 'idle' | 'running' | 'success' | 'retry';
    warriorAction: string | null;
    language: string;

    // Hints
    hintsUsed: number;
    showHint: boolean;
    currentHintIndex: number;

    // Actions
    setCode: (code: string) => void;
    runCode: () => void;
    addConsoleMessage: (msg: Omit<ConsoleMessage, 'id' | 'timestamp'>) => void;
    clearConsole: () => void;
    setGamePhase: (phase: GameState['gamePhase']) => void;
    setWarriorAction: (action: string | null) => void;
    setLanguage: (lang: string) => void;
    toggleHint: () => void;
    nextHint: () => void;
    setLevel: (world: number, level: number) => void;
    completeLevel: (stars: number, time: number) => void;
    addXP: (amount: number) => void;
    addGems: (amount: number) => void;
    takeDamage: (amount: number) => void;
    updateStreak: () => void;
    setIsRunning: (v: boolean) => void;
}

const loadFromStorage = () => {
    if (typeof window === 'undefined') return {};
    try {
        const saved = localStorage.getItem('codequest-save');
        return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
};

const saveToStorage = (state: Partial<GameState>) => {
    if (typeof window === 'undefined') return;
    const toSave = {
        playerName: state.playerName,
        xp: state.xp,
        gems: state.gems,
        streak: state.streak,
        lastPlayed: state.lastPlayed,
        currentWorld: state.currentWorld,
        currentLevel: state.currentLevel,
        levelProgress: state.levelProgress,
    };
    localStorage.setItem('codequest-save', JSON.stringify(toSave));
};

export const useGameStore = create<GameState>((set, get) => {
    const saved = loadFromStorage();

    return {
        // --- Player ---
        playerName: saved.playerName || 'Warrior',
        health: 100,
        maxHealth: 100,
        xp: saved.xp || 0,
        gems: saved.gems || 0,
        streak: saved.streak || 0,
        lastPlayed: saved.lastPlayed || null,

        // --- Level ---
        currentWorld: saved.currentWorld || 1,
        currentLevel: saved.currentLevel || 1,
        levelProgress: saved.levelProgress || {},

        // --- Code ---
        code: '',
        isRunning: false,
        consoleMessages: [],

        // --- Game ---
        gamePhase: 'idle',
        warriorAction: null,
        language: 'javascript',

        // --- Hints ---
        hintsUsed: 0,
        showHint: false,
        currentHintIndex: 0,

        // --- Actions ---
        setCode: (code) => set({ code }),

        setIsRunning: (v) => set({ isRunning: v }),

        runCode: () => {
            set({ isRunning: true, consoleMessages: [], gamePhase: 'running' });
        },

        addConsoleMessage: (msg) => set((state) => ({
            consoleMessages: [
                ...state.consoleMessages,
                { ...msg, id: Math.random().toString(36).slice(2), timestamp: Date.now() }
            ]
        })),

        clearConsole: () => set({ consoleMessages: [] }),

        setGamePhase: (phase) => set({ gamePhase: phase }),

        setWarriorAction: (action) => set({ warriorAction: action }),

        setLanguage: (language) => set({ language }),

        toggleHint: () => set((state) => ({
            showHint: !state.showHint,
            hintsUsed: !state.showHint ? state.hintsUsed + 1 : state.hintsUsed,
        })),

        nextHint: () => set((state) => ({
            currentHintIndex: state.currentHintIndex + 1,
        })),

        setLevel: (world, level) => {
            set({ currentWorld: world, currentLevel: level, gamePhase: 'idle', consoleMessages: [], hintsUsed: 0, showHint: false, currentHintIndex: 0 });
        },

        completeLevel: (stars, time) => {
            const state = get();
            const key = `${state.currentWorld}-${state.currentLevel}`;
            const prev = state.levelProgress[key];
            const newProgress = {
                stars: Math.max(stars, prev?.stars || 0),
                completed: true,
                hintsUsed: state.hintsUsed,
                bestTime: prev?.bestTime ? Math.min(time, prev.bestTime) : time,
            };
            const levelProgress = { ...state.levelProgress, [key]: newProgress };
            set({ levelProgress, gamePhase: 'success' });
            saveToStorage({ ...state, levelProgress });
        },

        addXP: (amount) => set((state) => {
            const xp = state.xp + amount;
            saveToStorage({ ...state, xp });
            return { xp };
        }),

        addGems: (amount) => set((state) => {
            const gems = state.gems + amount;
            saveToStorage({ ...state, gems });
            return { gems };
        }),

        takeDamage: (amount) => set((state) => ({
            health: Math.max(0, state.health - amount)
        })),

        updateStreak: () => {
            const state = get();
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            let streak = 1;
            if (state.lastPlayed === yesterday) streak = state.streak + 1;
            else if (state.lastPlayed === today) streak = state.streak;
            saveToStorage({ ...state, streak, lastPlayed: today });
            set({ streak, lastPlayed: today });
        },
    };
});
