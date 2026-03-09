'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface GameScreenProps {
    worldTheme: string;
    levelTitle: string;
    theme: { accent: string; bg: string };
    onNextLevel?: () => void;
    timeLimit?: number; // seconds — default 300 (5 min)
    onDefeated?: () => void;
    isPaused?: boolean;
}

const WORLD_SCENES: Record<string, {
    sky: string; ground: string; trees: string[];
    enemy: string; treasure: string;
    projectile: string; enemyProjectile: string;
}> = {
    forest: {
        sky: 'linear-gradient(180deg, #0d1f2d 0%, #1a3d2a 60%, #2a5a2a 100%)',
        ground: '#1a3a10', trees: ['🌲', '🌳', '🌲'],
        enemy: '👺', treasure: '📦',
        projectile: '🗡️', enemyProjectile: '🪨',
    },
    village: {
        sky: 'linear-gradient(180deg, #1f1020 0%, #3a1a1a 60%, #4a2a10 100%)',
        ground: '#3a2510', trees: ['🏰', '🏠', '⚔️'],
        enemy: '🧟', treasure: '💰',
        projectile: '⚔️', enemyProjectile: '💀',
    },
    tower: {
        sky: 'linear-gradient(180deg, #050515 0%, #0d0a2a 60%, #1a0d3a 100%)',
        ground: '#0d0a20', trees: ['🔮', '⭐', '🌟'],
        enemy: '🧙', treasure: '📜',
        projectile: '✨', enemyProjectile: '🌀',
    },
    vault: {
        sky: 'linear-gradient(180deg, #1a0f0a 0%, #2a1a10 60%, #3a2215 100%)',
        ground: '#2a1a0a', trees: ['🏺', '💀', '🗿'],
        enemy: '🐉', treasure: '🏅',
        projectile: '🔥', enemyProjectile: '🦴',
    },
    inferno: {
        sky: 'linear-gradient(180deg, #1a0505 0%, #3a0808 60%, #5a1010 100%)',
        ground: '#3a0a0a', trees: ['🌋', '🔥', '💥'],
        enemy: '👹', treasure: '🔑',
        projectile: '⚡', enemyProjectile: '💢',
    },
    shadow: {
        sky: 'linear-gradient(180deg, #020208 0%, #080818 60%, #0d0d28 100%)',
        ground: '#080820', trees: ['👁️', '⚡', '🌑'],
        enemy: '👑', treasure: '👑',
        projectile: '⚡', enemyProjectile: '🌑',
    },
};

type WarriorState = 'idle' | 'walk' | 'attack' | 'celebrate' | 'magic' | 'hurt' | 'wake';

function WarriorSVG({ state }: { state: WarriorState }) {
    const animations: Record<WarriorState, React.CSSProperties> = {
        idle: { animation: 'float 3s ease-in-out infinite' },
        walk: { animation: 'float 0.5s ease-in-out infinite' },
        attack: { animation: 'levelUp 0.3s ease infinite' },
        celebrate: { animation: 'float 1s ease-in-out infinite' },
        magic: { animation: 'spin 2s linear infinite', filter: 'hue-rotate(90deg)' },
        hurt: { animation: 'levelUp 0.2s ease 3', filter: 'brightness(2) saturate(0)' },
        wake: { animation: 'slideInLeft 0.8s ease' },
    };
    return (
        <div style={{ fontSize: '48px', position: 'relative', ...animations[state], display: 'inline-block', userSelect: 'none' }}>
            🧙‍♂️
            {state === 'magic' && (
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '16px', animation: 'float 0.6s ease-in-out infinite' }}>✨</div>
            )}
            {state === 'attack' && (
                <div style={{ position: 'absolute', top: '-5px', right: '-20px', fontSize: '20px', animation: 'slideInRight 0.2s ease' }}>⚔️</div>
            )}
        </div>
    );
}

interface Projectile {
    id: number;
    x: number;
    fromWarrior: boolean;
    emoji: string;
}

export default function GameScreen({ worldTheme, theme, onNextLevel, timeLimit = 300, onDefeated, isPaused = false }: GameScreenProps) {
    const { gamePhase, warriorAction } = useGameStore();
    const [warriorState, setWarriorState] = useState<WarriorState>('idle');
    const [warriorX, setWarriorX] = useState(15);
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
    const [showVictoryBanner, setShowVictoryBanner] = useState(false);
    const [enemyVisible, setEnemyVisible] = useState(true);
    const [enemyHealth, setEnemyHealth] = useState(100);
    const [treasureGlow, setTreasureGlow] = useState(false);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [defeated, setDefeated] = useState(false);
    const [showDefeatBanner, setShowDefeatBanner] = useState(false);
    const [enemyAttackFlash, setEnemyAttackFlash] = useState(false);
    const particleIdRef = useRef(0);
    const projIdRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const enemyFireRef = useRef<NodeJS.Timeout | null>(null);
    const scene = WORLD_SCENES[worldTheme] || WORLD_SCENES.forest;

    // Warrior health = time remaining percentage (100% → 0% as timer counts down)
    const warriorHealth = Math.round((timeLeft / timeLimit) * 100);

    // Timer display variables
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timerColor = timeLeft <= 30 ? '#ff4757' : timeLeft <= 60 ? '#ffbd2e' : '#00d4aa';
    const timerPulse = timeLeft <= 30;

    // ── Add particles ─────────────────────────────────────────────────────────
    const addParticles = useCallback((emojis: string[]) => {
        const newParticles = emojis.map((emoji) => ({
            id: particleIdRef.current++,
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 40,
            emoji,
        }));
        setParticles(prev => [...prev, ...newParticles]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 2000);
    }, []);

    // ── Fire a projectile from warrior → enemy ────────────────────────────────
    const fireWarriorProjectile = useCallback(() => {
        const id = projIdRef.current++;
        setProjectiles(prev => [...prev, { id, x: 25, fromWarrior: true, emoji: scene.projectile }]);
        setTimeout(() => setProjectiles(prev => prev.filter(p => p.id !== id)), 800);
    }, [scene.projectile]);

    // ── Fire a projectile from enemy → warrior ────────────────────────────────
    const fireEnemyProjectile = useCallback(() => {
        const id = projIdRef.current++;
        setProjectiles(prev => [...prev, { id, x: 75, fromWarrior: false, emoji: scene.enemyProjectile }]);
        setEnemyAttackFlash(true);
        setTimeout(() => setEnemyAttackFlash(false), 200);
        setTimeout(() => setProjectiles(prev => prev.filter(p => p.id !== id)), 700);
    }, [scene.enemyProjectile]);

    // ── Countdown timer — starts immediately on level load ────────────────────
    // Resets whenever timeLimit changes (= new level navigated to)
    useEffect(() => {
        setTimeLeft(timeLimit);
        setDefeated(false);
        setShowDefeatBanner(false);
        setEnemyHealth(100);
        setEnemyVisible(true);

        // Start ticking right away — always, regardless of gamePhase, unless paused
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            if (isPaused) return;
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    // Defer all side-effect state calls out of the functional updater
                    // so React doesn't try to update GamePage while rendering GameScreen
                    setTimeout(() => {
                        setDefeated(true);
                        setShowDefeatBanner(true);
                        setWarriorState('hurt');
                        onDefeated?.();
                    }, 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLimit]); // timeLimit changes = new level

    // Stop timer on success
    useEffect(() => {
        if (gamePhase === 'success') {
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [gamePhase]);

    // ── ALWAYS-ON enemy fire: fires from mount until success/defeat ──────────
    useEffect(() => {
        if (enemyFireRef.current) clearInterval(enemyFireRef.current);
        if (defeated || gamePhase === 'success' || isPaused) return;

        // Enemy fires faster when player is running (battle heats up)
        const fireDelay = gamePhase === 'running' ? 1000 : 1800;
        enemyFireRef.current = setInterval(() => {
            fireEnemyProjectile();
        }, fireDelay);

        return () => { if (enemyFireRef.current) clearInterval(enemyFireRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gamePhase, defeated, isPaused, fireEnemyProjectile]);

    // ── ALWAYS-ON warrior fire: fires from mount until success/defeat ─────────
    useEffect(() => {
        if (defeated || gamePhase === 'success' || isPaused) return;

        // Warrior fires slower in idle (defending), faster when actively running
        const fireDelay = gamePhase === 'running' ? 850 : 2200;
        const warriorFire = setInterval(() => {
            fireWarriorProjectile();
            // Warrior chip-damages enemy continuously; big hits on manual fight calls
            if (gamePhase === 'running') {
                setEnemyHealth(prev => Math.max(15, prev - 2));
            }
        }, fireDelay);

        return () => clearInterval(warriorFire);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gamePhase, defeated, isPaused, fireWarriorProjectile]);
    // ── Phase reactions ───────────────────────────────────────────────────────
    useEffect(() => {
        if (gamePhase === 'running') {
            setDefeated(false);
            setShowDefeatBanner(false);
            // Walk warrior toward enemy
            const walk = setInterval(() => {
                setWarriorX(prev => {
                    if (prev >= 40) { clearInterval(walk); setWarriorState('attack'); return 40; }
                    return prev + 2;
                });
            }, 60);
            setWarriorState('walk');
            return () => clearInterval(walk);
        }
        if (gamePhase === 'success') {
            setWarriorState('celebrate');
            setTreasureGlow(true);
            setWarriorX(60);
            setShowVictoryBanner(true);
            setEnemyHealth(0);
            setEnemyVisible(false);
            addParticles(['⭐', '💎', '✨', '🌟', '⭐', '🎉', '✨', '💫']);
            setProjectiles([]);
        }
        if (gamePhase === 'retry') {
            setWarriorState('hurt');
            setWarriorX(15);
            setTimeout(() => setWarriorState('idle'), 800);
        }
        if (gamePhase === 'idle') {
            // Keep warrior at position, reset enemy
            setWarriorX(15);
            setWarriorState('idle');
            setShowVictoryBanner(false);
            setEnemyVisible(true);
            setEnemyHealth(100);
            setTreasureGlow(false);
            setParticles([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gamePhase]);

    useEffect(() => {
        if (warriorAction === 'fight' && gamePhase === 'running') {
            setWarriorState('attack');
            fireWarriorProjectile();
            setEnemyHealth(prev => Math.max(0, prev - 20));
        }
        if (warriorAction === 'magic') {
            setWarriorState('magic');
            fireWarriorProjectile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [warriorAction]);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden', background: scene.sky, display: 'flex', flexDirection: 'column' }}>
            {/* Header bar */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '6px 16px',
                display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
            }}>
                <span style={{ fontSize: '14px' }}>🎮</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Game World
                </span>
                <div style={{ flex: 1 }} />

                {/* ── Countdown Timer — always visible ── */}
                {!defeated && gamePhase !== 'success' && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: `${timerColor}15`,
                        border: `1px solid ${timerColor}44`,
                        borderRadius: '8px', padding: '3px 10px',
                        animation: timerPulse ? 'pulse-glow 0.7s ease-in-out infinite' : 'none',
                        transition: 'background 0.5s, border-color 0.5s',
                    }}>
                        <span style={{ fontSize: '12px' }}>⏱️</span>
                        <span style={{
                            fontFamily: 'JetBrains Mono', fontSize: '13px',
                            fontWeight: 700, color: timerColor,
                            minWidth: '42px', textAlign: 'center',
                            transition: 'color 0.5s',
                        }}>
                            {mins}:{secs.toString().padStart(2, '0')}
                        </span>
                    </div>
                )}

                {/* Status dot */}
                <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: defeated ? '#ff4757' : gamePhase === 'running' ? '#00d4aa' : gamePhase === 'success' ? '#ffd700' : '#555',
                    boxShadow: gamePhase !== 'idle' ? `0 0 8px ${defeated ? '#ff4757' : gamePhase === 'success' ? '#ffd700' : '#00d4aa'}` : 'none',
                    transition: 'all 0.3s',
                }} />
            </div>

            {/* Game World canvas */}
            <div style={{ flex: 1, position: 'relative' }}>

                {/* Background elements */}
                <div style={{ position: 'absolute', bottom: '30%', left: 0, right: 0, display: 'flex', justifyContent: 'space-around', fontSize: '28px', opacity: 0.6, padding: '0 10px' }}>
                    {scene.trees.map((t, i) => (
                        <span key={i} style={{ transform: `scale(${0.8 + i * 0.1})` }}>{t}</span>
                    ))}
                </div>

                {/* ── Projectiles ── */}
                {projectiles.map(proj => (
                    <div key={proj.id} style={{
                        position: 'absolute',
                        bottom: 'calc(30% + 24px)',
                        left: `${proj.x}%`,
                        fontSize: '18px',
                        animation: proj.fromWarrior
                            ? 'shoot-right 0.8s cubic-bezier(0.2,0.8,0.8,1) forwards'
                            : 'shoot-left 0.7s cubic-bezier(0.2,0.8,0.8,1) forwards',
                        pointerEvents: 'none',
                        zIndex: 10,
                    }}>
                        {proj.emoji}
                    </div>
                ))}

                {/* ── Warrior ── */}
                <div style={{
                    position: 'absolute', bottom: 'calc(28% + 4px)',
                    left: `${warriorX}%`,
                    transition: 'left 0.12s linear',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    opacity: defeated ? 0.4 : 1,
                    filter: defeated ? 'grayscale(1)' : 'none',
                } as React.CSSProperties}>
                    {/* Warrior health bar */}
                    {gamePhase !== 'idle' && (
                        <div style={{ width: '48px', height: '5px', background: '#333', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                            <div style={{
                                height: '100%',
                                width: `${warriorHealth}%`,
                                background: warriorHealth > 50 ? '#00d4aa' : warriorHealth > 25 ? '#ffbd2e' : '#ff4757',
                                transition: 'width 0.3s, background 0.3s',
                            }} />
                        </div>
                    )}
                    <WarriorSVG state={warriorState} />
                    <div style={{
                        background: 'rgba(0,0,0,0.6)', borderRadius: '4px',
                        padding: '2px 6px', fontSize: '9px', color: theme.accent,
                        fontFamily: 'JetBrains Mono', marginTop: '2px',
                        border: `1px solid ${theme.accent}44`,
                    }}>
                        YOU
                    </div>
                </div>

                {/* ── Enemy ── */}
                {scene.enemy && enemyVisible && (
                    <div style={{
                        position: 'absolute', bottom: 'calc(28% + 4px)', right: '12%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        animation: enemyAttackFlash ? 'levelUp 0.15s ease' : 'float 2s ease-in-out infinite',
                        opacity: gamePhase === 'success' ? 0 : 1,
                        transition: 'opacity 0.5s',
                        filter: enemyAttackFlash ? 'brightness(2)' : 'none',
                    }}>
                        {/* Enemy health bar */}
                        <div style={{ width: '50px', height: '5px', background: '#333', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                            <div style={{
                                height: '100%', width: `${enemyHealth}%`,
                                background: enemyHealth > 50 ? '#ff4757' : '#ff8c00',
                                transition: 'width 0.3s',
                            }} />
                        </div>
                        <div style={{
                            fontSize: '36px',
                            animation: gamePhase !== 'idle' && !defeated ? 'enemy-shake 0.5s ease-in-out infinite' : 'float 2s ease-in-out infinite',
                        }}>
                            {scene.enemy}
                        </div>
                        <div style={{
                            background: 'rgba(0,0,0,0.6)', borderRadius: '4px',
                            padding: '2px 6px', fontSize: '9px', color: '#ff4757',
                            fontFamily: 'JetBrains Mono', marginTop: '2px',
                            border: '1px solid rgba(255,71,87,0.4)',
                        }}>
                            ENEMY
                        </div>
                    </div>
                )}

                {/* Treasure */}
                <div style={{
                    position: 'absolute', bottom: 'calc(28% + 2px)', right: '5%',
                    fontSize: '30px',
                    filter: treasureGlow ? `drop-shadow(0 0 12px ${theme.accent})` : 'none',
                    transition: 'filter 0.5s',
                    animation: treasureGlow ? 'pulse-glow 1s infinite' : 'float 3s ease-in-out infinite',
                }}>
                    {scene.treasure}
                </div>

                {/* Ground */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: `linear-gradient(180deg, ${scene.ground} 0%, black 100%)`, borderTop: '2px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', paddingTop: '4px', paddingLeft: '8px', gap: '4px', opacity: 0.3 }}>
                        {[...Array(20)].map((_, i) => (
                            <div key={i} style={{ width: '30px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', flexShrink: 0 }} />
                        ))}
                    </div>
                </div>

                {/* Particles */}
                {particles.map(p => (
                    <div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, fontSize: '18px', animation: 'float 2s ease-out forwards, fadeIn 0.2s ease', pointerEvents: 'none' }}>
                        {p.emoji}
                    </div>
                ))}

                {/* Victory Banner */}
                {showVictoryBanner && (
                    <div style={{
                        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(0,212,170,0.15))',
                        border: '2px solid rgba(255,215,0,0.4)',
                        borderRadius: '12px', padding: '12px 24px',
                        textAlign: 'center', animation: 'fadeIn 0.5s ease',
                        backdropFilter: 'blur(10px)',
                    }}>
                        <div style={{ fontSize: '22px', marginBottom: '4px' }}>🎉</div>
                        <div style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#ffd700' }}>LEVEL CLEAR!</div>
                        {onNextLevel && (
                            <button id="next-level-btn" onClick={onNextLevel} style={{
                                marginTop: '10px',
                                background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                                border: 'none', borderRadius: '6px',
                                padding: '7px 16px', color: '#000',
                                cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Inter',
                            }}>
                                Next Level →
                            </button>
                        )}
                    </div>
                )}

                {/* ── DEFEAT Banner ── */}
                {showDefeatBanner && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.75)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.5s ease',
                        backdropFilter: 'blur(4px)',
                        zIndex: 50,
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px', animation: 'float 2s ease-in-out infinite' }}>💀</div>
                        <div style={{
                            fontFamily: "'Press Start 2P'", fontSize: '14px',
                            color: '#ff4757', marginBottom: '8px',
                            textShadow: '0 0 20px #ff475788',
                            animation: 'pulse-glow 1s ease-in-out infinite',
                        }}>
                            TIME&apos;S UP!
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '20px', fontFamily: 'Inter' }}>
                            The enemy defeated you!
                        </div>
                        <div style={{ fontSize: '11px', color: '#555', fontFamily: 'JetBrains Mono' }}>
                            Fix your code and run again to retry ↓
                        </div>
                    </div>
                )}

                {/* Phase indicator */}
                <div style={{
                    position: 'absolute', top: '8px', left: '8px',
                    background: 'rgba(0,0,0,0.5)', borderRadius: '6px', padding: '4px 8px',
                    fontSize: '10px', fontFamily: 'JetBrains Mono',
                    color: defeated ? '#ff4757' : gamePhase === 'success' ? '#ffd700' : gamePhase === 'running' ? '#00d4aa' : gamePhase === 'retry' ? '#ff4757' : '#555',
                }}>
                    {defeated && '☠️ Defeated!'}
                    {!defeated && gamePhase === 'idle' && '● Waiting for code...'}
                    {!defeated && gamePhase === 'running' && '⚔️ Battle in progress!'}
                    {!defeated && gamePhase === 'success' && '✔ Mission Complete!'}
                    {!defeated && gamePhase === 'retry' && '✖ Try Again'}
                </div>

                {/* Keyframe styles */}
                <style>{`
                    @keyframes shoot-right {
                        0%   { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
                        80%  { transform: translateX(280px) translateY(-10px) scale(1.2); opacity: 1; }
                        100% { transform: translateX(320px) translateY(0) scale(0.5); opacity: 0; }
                    }
                    @keyframes shoot-left {
                        0%   { transform: translateX(0) translateY(0) scale(1); opacity: 1; }
                        80%  { transform: translateX(-260px) translateY(-8px) scale(1.2); opacity: 1; }
                        100% { transform: translateX(-300px) translateY(0) scale(0.5); opacity: 0; }
                    }
                    @keyframes enemy-shake {
                        0%   { transform: translate(0,0) rotate(0deg); }
                        20%  { transform: translate(-3px,1px) rotate(-3deg); }
                        40%  { transform: translate(3px,-1px) rotate(3deg); }
                        60%  { transform: translate(-2px,2px) rotate(-2deg); }
                        80%  { transform: translate(2px,-2px) rotate(2deg); }
                        100% { transform: translate(0,0) rotate(0deg); }
                    }
                    @keyframes pulse-glow {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50%      { opacity: 0.7; transform: scale(1.05); }
                    }
                `}</style>
            </div>
        </div>
    );
}
