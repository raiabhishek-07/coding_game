'use client';
import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

const MILESTONES = [
    { days: 3, icon: '🔥', title: '3-Day Streak!', msg: 'You\'re on fire! Keep it up warrior!', color: '#ff6b35', gem: 2 },
    { days: 7, icon: '💎', title: '7-Day Streak!', msg: 'Diamond Warrior! Unlock: Crystal Armor skin!', color: '#4f8fff', gem: 5 },
    { days: 14, icon: '🌟', title: '14-Day Streak!', msg: 'Legendary! You\'re unstoppable!', color: '#ffd700', gem: 10 },
    { days: 30, icon: '👑', title: '30-Day Streak!', msg: 'The Ultimate Warrior! Crown of Code awarded!', color: '#a855f7', gem: 20 },
];

export default function StreakCelebration() {
    const { streak, gems, addGems } = useGameStore();
    const [active, setActive] = useState<typeof MILESTONES[0] | null>(null);
    const [dismissed, setDismissed] = useState<Set<number>>(new Set());

    useEffect(() => {
        const milestone = MILESTONES.find(m => m.days === streak && !dismissed.has(m.days));
        if (milestone) {
            setActive(milestone);
            addGems(milestone.gem);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [streak]);

    if (!active) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.4s ease',
        }}>
            {/* Fireworks particles */}
            {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: `${10 + Math.random() * 80}%`,
                    left: `${5 + Math.random() * 90}%`,
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: ['#ffd700', '#ff4757', '#00d4aa', '#9b5de5', '#ff6b35'][i % 5],
                    animation: `firework-${i} 1.5s ease forwards`,
                    opacity: 0,
                }} />
            ))}

            <div style={{
                background: 'linear-gradient(135deg, #0d0d1f, #141428)',
                border: `2px solid ${active.color}66`,
                borderRadius: '24px', padding: '48px 56px',
                textAlign: 'center', maxWidth: '440px',
                boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 80px ${active.color}22`,
                animation: 'slideUp 0.5s cubic-bezier(0.175,0.885,0.32,1.275)',
                position: 'relative',
            }}>
                {/* Radial glow */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '24px',
                    background: `radial-gradient(circle at 50% 0%, ${active.color}18, transparent 60%)`,
                    pointerEvents: 'none',
                }} />

                <div style={{ fontSize: '72px', marginBottom: '16px', animation: 'bounce 0.8s ease' }}>
                    {active.icon}
                </div>

                <h2 style={{
                    fontFamily: "'Press Start 2P'", fontSize: '16px',
                    color: active.color, marginBottom: '12px', lineHeight: 1.5,
                }}>
                    {active.title}
                </h2>

                <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '24px', lineHeight: 1.7 }}>
                    {active.msg}
                </p>

                {/* Bonus gems */}
                <div style={{
                    background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
                    borderRadius: '12px', padding: '14px', marginBottom: '28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                }}>
                    <span style={{ fontSize: '28px' }}>💎</span>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffd700' }}>+{active.gem} Gems</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>Streak bonus reward!</div>
                    </div>
                </div>

                <button
                    onClick={() => { setDismissed(prev => new Set([...prev, active.days])); setActive(null); }}
                    style={{
                        background: `linear-gradient(135deg, ${active.color}, ${active.color}aa)`,
                        border: 'none', borderRadius: '12px', padding: '14px 48px',
                        color: '#fff', cursor: 'pointer', fontSize: '14px',
                        fontWeight: 700, fontFamily: 'Inter', width: '100%',
                        boxShadow: `0 4px 20px ${active.color}44`,
                    }}
                >
                    🔥 Keep the Streak!
                </button>
            </div>
        </div>
    );
}
