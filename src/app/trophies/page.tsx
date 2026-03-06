'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { ALL_LEVELS } from '@/lib/levels/index';

interface Achievement {
    id: string;
    icon: string;
    title: string;
    desc: string;
    condition: (state: ReturnType<typeof useGameStore.getState>) => boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_blood', icon: '⚔️', title: 'First Blood', desc: 'Complete your first level', rarity: 'common', condition: s => Object.values(s.levelProgress).some(p => p.completed) },
    { id: 'no_hints_1', icon: '🧠', title: 'Big Brain', desc: 'Complete a level without any hints', rarity: 'common', condition: s => Object.values(s.levelProgress).some(p => p.completed && p.hintsUsed === 0) },
    { id: 'three_stars', icon: '⭐', title: 'Perfectionist', desc: 'Earn 3 stars on any level', rarity: 'rare', condition: s => Object.values(s.levelProgress).some(p => p.stars === 3) },
    { id: 'world1_done', icon: '🌲', title: 'Forest Cleared', desc: 'Complete all of World 1', rarity: 'rare', condition: s => ALL_LEVELS.filter(l => l.world === 1).every(l => s.levelProgress[l.id]?.completed) },
    { id: 'world2_done', icon: '🏰', title: 'Logic Master', desc: 'Complete all of World 2', rarity: 'rare', condition: s => ALL_LEVELS.filter(l => l.world === 2).every(l => s.levelProgress[l.id]?.completed) },
    { id: 'world3_done', icon: '🔮', title: 'Spell Weaver', desc: 'Complete all of World 3', rarity: 'epic', condition: s => ALL_LEVELS.filter(l => l.world === 3).every(l => s.levelProgress[l.id]?.completed) },
    { id: 'world4_done', icon: '🏺', title: 'Vault Raider', desc: 'Complete all of World 4', rarity: 'epic', condition: s => ALL_LEVELS.filter(l => l.world === 4).every(l => s.levelProgress[l.id]?.completed) },
    { id: 'world5_done', icon: '🌋', title: 'Inferno Walker', desc: 'Complete all of World 5', rarity: 'epic', condition: s => ALL_LEVELS.filter(l => l.world === 5).every(l => s.levelProgress[l.id]?.completed) },
    { id: 'champion', icon: '🏆', title: 'JS Champion', desc: 'Complete all 30 levels!', rarity: 'legendary', condition: s => ALL_LEVELS.every(l => s.levelProgress[l.id]?.completed) },
    { id: 'streak_3', icon: '🔥', title: 'On Fire', desc: 'Maintain a 3-day streak', rarity: 'common', condition: s => s.streak >= 3 },
    { id: 'streak_7', icon: '💎', title: 'Diamond Habit', desc: 'Maintain a 7-day streak', rarity: 'epic', condition: s => s.streak >= 7 },
    { id: 'xp_500', icon: '✨', title: 'XP Farmer', desc: 'Earn 500 XP', rarity: 'common', condition: s => s.xp >= 500 },
    { id: 'xp_2000', icon: '🌟', title: 'XP Legend', desc: 'Earn 2000 XP', rarity: 'rare', condition: s => s.xp >= 2000 },
    { id: 'gems_10', icon: '💍', title: 'Gem Collector', desc: 'Collect 10 gems', rarity: 'common', condition: s => s.gems >= 10 },
    { id: 'speed_run', icon: '⚡', title: 'Speed Coder', desc: 'Complete a level in under 30 seconds', rarity: 'rare', condition: s => Object.values(s.levelProgress).some(p => p.bestTime !== undefined && p.bestTime < 30) },
    { id: 'all_stars', icon: '🌠', title: 'Star Gazer', desc: 'Earn 3 stars on 5 levels', rarity: 'legendary', condition: s => Object.values(s.levelProgress).filter(p => p.stars === 3).length >= 5 },
];

const RARITY_COLORS = {
    common: { bg: '#1a2a1a', border: '#3a5a3a', text: '#7aba7a', glow: '#3a5a3a' },
    rare: { bg: '#0d1a2e', border: '#2a5090', text: '#6aaaff', glow: '#2a5090' },
    epic: { bg: '#1a0d2e', border: '#7a3aad', text: '#c07aff', glow: '#7a3aad' },
    legendary: { bg: '#2e1a00', border: '#b8860b', text: '#ffd700', glow: '#b8860b' },
};

export default function TrophyPage() {
    const router = useRouter();
    const state = useGameStore();
    const [mounted, setMounted] = useState(false);
    const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all');

    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    const earned = ACHIEVEMENTS.filter(a => a.condition(state));
    const earnedIds = new Set(earned.map(a => a.id));
    const totalCompleted = Object.values(state.levelProgress).filter(p => p.completed).length;

    const displayed = ACHIEVEMENTS.filter(a => {
        if (filter === 'earned') return earnedIds.has(a.id);
        if (filter === 'locked') return !earnedIds.has(a.id);
        return true;
    });

    return (
        <div style={{
            minHeight: '100vh', background: '#080810',
            color: '#e8e8ff', fontFamily: 'Inter, sans-serif',
            overflowY: 'auto',
        }}>
            {/* Animated bg */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.06) 0%, transparent 60%)',
                pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', padding: '8px 16px', color: '#888',
                            cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter',
                        }}
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 style={{
                            fontFamily: "'Press Start 2P'", fontSize: '18px',
                            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            marginBottom: '4px',
                        }}>
                            🏆 Trophy Room
                        </h1>
                        <p style={{ fontSize: '12px', color: '#666' }}>
                            {earned.length} / {ACHIEVEMENTS.length} achievements unlocked
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div style={{ flex: 1, marginLeft: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', color: '#555' }}>
                            <span>Achievement Progress</span>
                            <span style={{ color: '#ffd700' }}>{Math.round((earned.length / ACHIEVEMENTS.length) * 100)}%</span>
                        </div>
                        <div style={{ height: '8px', background: '#1a1a2e', borderRadius: '4px' }}>
                            <div style={{
                                height: '100%', borderRadius: '4px',
                                width: `${(earned.length / ACHIEVEMENTS.length) * 100}%`,
                                background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
                                transition: 'width 1s ease',
                                boxShadow: '0 0 10px rgba(255,215,0,0.4)',
                            }} />
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px',
                }}>
                    {[
                        { label: 'Levels Done', value: `${totalCompleted}/30`, icon: '🗺️', color: '#00d4aa' },
                        { label: 'Total XP', value: state.xp, icon: '⭐', color: '#9b5de5' },
                        { label: 'Gems', value: state.gems, icon: '💎', color: '#ffd700' },
                        { label: 'Day Streak', value: `${state.streak}d`, icon: '🔥', color: '#ff6b35' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '12px', padding: '16px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.icon}</div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '11px', color: '#555' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {(['all', 'earned', 'locked'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            background: filter === f ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${filter === f ? '#ffd70044' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '8px', padding: '7px 18px',
                            color: filter === f ? '#ffd700' : '#666',
                            cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter',
                            transition: 'all 0.2s', textTransform: 'capitalize',
                        }}>
                            {f === 'all' ? `All (${ACHIEVEMENTS.length})` : f === 'earned' ? `Earned (${earned.length})` : `Locked (${ACHIEVEMENTS.length - earned.length})`}
                        </button>
                    ))}
                </div>

                {/* Trophy grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {displayed.map(a => {
                        const isEarned = earnedIds.has(a.id);
                        const c = RARITY_COLORS[a.rarity];

                        return (
                            <div key={a.id} style={{
                                background: isEarned ? c.bg : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isEarned ? c.border : '#1a1a2e'}`,
                                borderRadius: '14px', padding: '20px',
                                display: 'flex', gap: '16px', alignItems: 'center',
                                transition: 'all 0.3s',
                                boxShadow: isEarned ? `0 0 20px ${c.glow}22` : 'none',
                                opacity: isEarned ? 1 : 0.45,
                                filter: isEarned ? 'none' : 'grayscale(80%)',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                {/* Earned shimmer */}
                                {isEarned && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                                        background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.06), transparent)',
                                        animation: 'shimmer 3s infinite',
                                    }} />
                                )}

                                {/* Icon */}
                                <div style={{
                                    fontSize: '36px', width: '56px', height: '56px', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isEarned ? `${c.border}33` : 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    boxShadow: isEarned ? `0 0 14px ${c.glow}44` : 'none',
                                }}>
                                    {isEarned ? a.icon : '🔒'}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: isEarned ? c.text : '#444' }}>
                                            {a.title}
                                        </span>
                                        <span style={{
                                            fontSize: '9px', fontFamily: "'Press Start 2P'",
                                            color: c.text, opacity: isEarned ? 1 : 0.5,
                                            textTransform: 'uppercase',
                                        }}>
                                            {a.rarity}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: isEarned ? '#999' : '#333', lineHeight: 1.5 }}>
                                        {a.desc}
                                    </div>
                                </div>

                                {isEarned && (
                                    <div style={{ fontSize: '18px', flexShrink: 0 }}>✅</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom spacing */}
                <div style={{ height: '40px' }} />
            </div>
        </div>
    );
}
