import React, { useEffect, useState } from 'react';
import { sfxLevelComplete, sfxStars, sfxClick, sfxHover } from '@/lib/sounds';

interface LevelCompleteModalProps {
    visible: boolean;
    stars: number;
    xpEarned: number;
    gemsEarned: number;
    levelTitle: string;
    onNext: () => void;
    onReplay: () => void;
    onHome: () => void;
    accentColor: string;
}

export default function LevelCompleteModal({
    visible, stars, xpEarned, gemsEarned, levelTitle,
    onNext, onReplay, onHome, accentColor,
}: LevelCompleteModalProps) {
    const [showStars, setShowStars] = useState(0);

    useEffect(() => {
        if (!visible) { setShowStars(0); return; }
        sfxLevelComplete();
        // Animate stars one by one
        const timers = [1, 2, 3].map((n, i) =>
            setTimeout(() => {
                if (n <= stars) {
                    setShowStars(n);
                    sfxStars(1);
                }
            }, 600 + i * 400)
        );
        return () => timers.forEach(clearTimeout);
    }, [visible, stars]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease',
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #0d0d1f, #141428)',
                border: `2px solid ${accentColor}66`,
                borderRadius: '20px', padding: '40px 48px',
                textAlign: 'center', minWidth: '380px',
                boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 60px ${accentColor}22`,
                animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Confetti shimmer */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at 50% 0%, ${accentColor}15, transparent 60%)`,
                    pointerEvents: 'none',
                }} />

                {/* Party icon */}
                <div style={{ fontSize: '52px', marginBottom: '8px', animation: 'bounce 0.6s ease' }}>🎉</div>

                {/* Title */}
                <h2 style={{
                    fontFamily: "'Press Start 2P'", fontSize: '14px',
                    color: accentColor, marginBottom: '4px', lineHeight: 1.5,
                }}>
                    LEVEL CLEAR!
                </h2>
                <p style={{ fontSize: '13px', color: '#999', marginBottom: '24px' }}>
                    {levelTitle}
                </p>

                {/* Stars */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            fontSize: '40px',
                            transform: s <= showStars ? 'scale(1.2)' : 'scale(0.8)',
                            opacity: s <= showStars ? 1 : 0.15,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            filter: s <= showStars ? `drop-shadow(0 0 12px #ffd700)` : 'none',
                        }}>
                            ⭐
                        </div>
                    ))}
                </div>

                {/* Rewards */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px',
                    background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px' }}>⭐</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#9b5de5' }}>+{xpEarned}</div>
                        <div style={{ fontSize: '10px', color: '#555' }}>XP</div>
                    </div>
                    <div style={{ width: '1px', background: '#1a1a2e' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px' }}>💎</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffd700' }}>+{gemsEarned}</div>
                        <div style={{ fontSize: '10px', color: '#555' }}>Gems</div>
                    </div>
                    <div style={{ width: '1px', background: '#1a1a2e' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px' }}>⭐</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffd700' }}>{stars}/3</div>
                        <div style={{ fontSize: '10px', color: '#555' }}>Stars</div>
                    </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        id="next-level-btn"
                        onClick={() => { sfxClick(); onNext(); }}
                        style={{
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                            border: 'none', borderRadius: '10px',
                            padding: '14px 0', color: '#fff',
                            cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                            fontFamily: 'Inter', width: '100%',
                            boxShadow: `0 4px 20px ${accentColor}44`,
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => { sfxHover(); e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                    >
                        Next Level →
                    </button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => { sfxClick(); onReplay(); }}
                            onMouseEnter={sfxHover}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px', padding: '10px',
                                color: '#888', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter',
                            }}
                        >
                            🔄 Replay
                        </button>
                        <button
                            onClick={() => { sfxClick(); onHome(); }}
                            onMouseEnter={sfxHover}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px', padding: '10px',
                                color: '#888', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter',
                            }}
                        >
                            🏠 Map
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
