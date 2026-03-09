import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameAudio, sfxHover, sfxClick } from '@/lib/sounds';

const WORLD_THEMES: Record<string, { bg: string; accent: string; icon: string }> = {
    forest: { bg: 'linear-gradient(135deg, #0d1f0d 0%, #1a3a1a 50%, #0d1f0d 100%)', accent: '#00d4aa', icon: '🌲' },
    village: { bg: 'linear-gradient(135deg, #1f140d 0%, #3a2a1a 50%, #1f140d 100%)', accent: '#ff6b35', icon: '🏰' },
    tower: { bg: 'linear-gradient(135deg, #0d0d1f 0%, #1a1a3a 50%, #0d0d1f 100%)', accent: '#9b5de5', icon: '🔮' },
    vault: { bg: 'linear-gradient(135deg, #1a0f0a 0%, #2a1a10 50%, #1a0f0a 100%)', accent: '#ffd700', icon: '🏺' },
    inferno: { bg: 'linear-gradient(135deg, #1f0a0a 0%, #3a0d0d 50%, #1f0a0a 100%)', accent: '#ff4757', icon: '🌋' },
    shadow: { bg: 'linear-gradient(135deg, #050510 0%, #0a0a20 50%, #050510 100%)', accent: '#a855f7', icon: '👁️' },
};

interface HUDProps {
    worldTheme?: string;
    levelTitle?: string;
    levelConcept?: string;
    onTrophies?: () => void;
}

export default function HUD({ worldTheme = 'forest', levelTitle = '', levelConcept = '', onTrophies }: HUDProps) {
    const { health, maxHealth, xp, gems, streak, currentWorld, currentLevel } = useGameStore();
    const theme = WORLD_THEMES[worldTheme] || WORLD_THEMES.forest;

    // Guard against SSR/client hydration mismatch:
    // localStorage values differ between server (defaults) and client (saved).
    // Render static fallbacks until after first client paint.
    const [mounted, setMounted] = useState(false);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('codequest-muted');
        const isMuted = saved === 'true';
        setMuted(isMuted);
        GameAudio.isMuted = isMuted;
        if (!isMuted) GameAudio.startBGM();
    }, []);

    // Use safe fallbacks before mount so SSR HTML matches initial client render
    const safeXP = mounted ? xp : 0;
    const safeGems = mounted ? gems : 0;
    const safeStreak = mounted ? streak : 0;
    const safeWorld = mounted ? currentWorld : 1;
    const safeLevel = mounted ? currentLevel : 1;
    const safeHealth = mounted ? health : 100;

    const xpForNextLevel = 500;
    const xpPercent = Math.min(100, (safeXP % xpForNextLevel) / xpForNextLevel * 100);
    const playerLevel = Math.floor(safeXP / xpForNextLevel) + 1;
    const hearts = Math.ceil((safeHealth / maxHealth) * 5);

    const toggleMute = () => {
        const next = GameAudio.toggleMute();
        setMuted(next);
        localStorage.setItem('codequest-muted', String(next));
    };

    return (
        <div style={{
            background: 'rgba(10,10,20,0.95)',
            borderBottom: `2px solid ${theme.accent}33`,
            padding: '0 16px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px' }}>
                <span style={{ fontSize: '18px' }}>⚔️</span>
                <span style={{ fontFamily: "'Press Start 2P'", fontSize: '9px', color: theme.accent, letterSpacing: '1px' }}>
                    CodeQuest
                </span>
            </div>

            {/* World & Level */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.05)', borderRadius: '8px',
                padding: '4px 12px', border: `1px solid ${theme.accent}33`,
            }}>
                <span style={{ fontSize: '14px' }}>{theme.icon}</span>
                <div>
                    <div style={{ fontSize: '9px', color: '#666', fontFamily: 'JetBrains Mono' }}>W{safeWorld} · L{safeLevel}</div>
                    <div style={{ fontSize: '11px', color: theme.accent, fontWeight: 600 }}>{levelTitle || 'Loading...'}</div>
                </div>
            </div>

            {/* Concept badge */}
            {levelConcept && (
                <div style={{
                    background: `${theme.accent}15`,
                    border: `1px solid ${theme.accent}44`,
                    borderRadius: '6px', padding: '3px 10px',
                    fontSize: '10px', color: theme.accent, fontFamily: 'JetBrains Mono',
                }}>
                    🧠 {levelConcept}
                </div>
            )}

            <div style={{ flex: 1 }} />

            {/* Hearts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ fontSize: '14px', opacity: i < hearts ? 1 : 0.2, transition: 'opacity 0.3s' }}>❤️</span>
                ))}
            </div>

            {/* XP Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
                <div style={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap' }}>Lv.{playerLevel}</div>
                <div style={{ flex: 1, height: '8px', background: '#1a1a2e', borderRadius: '4px', overflow: 'hidden', minWidth: '80px' }}>
                    <div style={{
                        height: '100%', width: `${xpPercent}%`,
                        background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}88)`,
                        borderRadius: '4px', transition: 'width 0.5s ease',
                    }} />
                </div>
                <div style={{ fontSize: '10px', color: '#888', whiteSpace: 'nowrap' }}>{safeXP} XP</div>
            </div>

            {/* Gems */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(255,215,0,0.1)', borderRadius: '8px', padding: '4px 10px',
                border: '1px solid rgba(255,215,0,0.2)',
            }}>
                <span style={{ fontSize: '14px' }}>💎</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffd700' }}>{safeGems}</span>
            </div>

            {/* Streak */}
            {safeStreak > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'rgba(255,107,53,0.1)', borderRadius: '8px', padding: '4px 10px',
                    border: '1px solid rgba(255,107,53,0.2)',
                }}>
                    <span style={{ fontSize: '14px' }}>🔥</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff6b35' }}>{safeStreak}d</span>
                </div>
            )}

            {/* Sound toggle */}
            <button
                id="mute-btn"
                onClick={() => {
                    sfxClick();
                    toggleMute();
                }}
                onMouseEnter={sfxHover}
                title={muted ? 'Unmute sounds' : 'Mute sounds'}
                style={{
                    background: muted ? 'rgba(255,71,87,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${muted ? 'rgba(255,71,87,0.3)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '8px', padding: '4px 10px', cursor: 'pointer',
                    fontSize: '14px', transition: 'all 0.2s',
                }}
            >
                {muted ? '🔇' : '🔊'}
            </button>

            {/* Trophy Room */}
            {onTrophies && (
                <button
                    id="trophy-btn"
                    onClick={() => {
                        sfxClick();
                        onTrophies();
                    }}
                    onMouseEnter={e => {
                        sfxHover();
                        e.currentTarget.style.background = 'rgba(255,215,0,0.18)';
                    }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.08)'; }}
                    title="Trophy Room"
                    style={{
                        background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)',
                        borderRadius: '8px', padding: '4px 10px', cursor: 'pointer',
                        fontSize: '14px', transition: 'all 0.2s',
                    }}
                >
                    🏆
                </button>
            )}
        </div>
    );
}
