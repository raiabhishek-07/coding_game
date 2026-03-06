'use client';
import React from 'react';
import { LevelConfig } from '@/lib/levels/types';
import { useGameStore } from '@/store/gameStore';

interface ExplanationPanelProps {
    level: LevelConfig;
    theme: { accent: string; bg: string; icon: string };
}

export default function ExplanationPanel({ level, theme }: ExplanationPanelProps) {
    const { showHint, currentHintIndex, toggleHint, nextHint, hintsUsed, gamePhase } = useGameStore();

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(12,12,22,0.95)',
            overflow: 'hidden',
        }}>
            {/* Panel Header */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: `1px solid ${theme.accent}33`,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
            }}>
                <span style={{ fontSize: '14px' }}>📖</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Mission Briefing
                </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {/* Mission title */}
                <div style={{
                    background: `linear-gradient(135deg, ${theme.accent}15, transparent)`,
                    border: `1px solid ${theme.accent}33`,
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '14px',
                }}>
                    <div style={{ fontSize: '10px', color: theme.accent, fontFamily: 'JetBrains Mono', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {level.worldName} · Level {level.level}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                        {level.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.6 }}>
                        {level.story}
                    </div>
                </div>

                {/* Concept Box */}
                <div style={{
                    background: 'rgba(155,93,229,0.08)',
                    border: '1px solid rgba(155,93,229,0.25)',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '14px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px' }}>🧠</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#9b5de5', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            JS Concept
                        </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#c89dff', marginBottom: '6px' }}>
                        {level.concept}
                    </div>
                </div>

                {/* Objective */}
                <div style={{
                    background: `${theme.accent}0a`,
                    border: `1px solid ${theme.accent}22`,
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '14px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px' }}>🎯</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: theme.accent, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Objective
                        </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#ddd', lineHeight: 1.6 }}>
                        {level.objective}
                    </div>
                </div>

                {/* Rewards */}
                <div style={{
                    display: 'flex', gap: '8px', marginBottom: '14px',
                }}>
                    <div style={{
                        flex: 1, background: 'rgba(79,143,255,0.08)', border: '1px solid rgba(79,143,255,0.2)',
                        borderRadius: '8px', padding: '10px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '18px' }}>⭐</div>
                        <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>XP Reward</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#4f8fff' }}>+{level.xpReward}</div>
                    </div>
                    <div style={{
                        flex: 1, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)',
                        borderRadius: '8px', padding: '10px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '18px' }}>💎</div>
                        <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>Gems</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffd700' }}>+{level.gemReward}</div>
                    </div>
                    <div style={{
                        flex: 1, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
                        borderRadius: '8px', padding: '10px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '18px' }}>🏆</div>
                        <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>Hints Left</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#00d4aa' }}>{3 - hintsUsed}</div>
                    </div>
                </div>

                {/* Hint System */}
                <div style={{ marginBottom: '14px' }}>
                    <button
                        id="hint-button"
                        onClick={toggleHint}
                        style={{
                            width: '100%',
                            background: showHint ? `${theme.accent}20` : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${showHint ? theme.accent : '#333'}`,
                            borderRadius: '8px', padding: '10px 16px',
                            color: showHint ? theme.accent : '#888',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            transition: 'all 0.2s', fontFamily: 'Inter',
                        }}
                    >
                        <span>💡</span>
                        {showHint ? 'Hide Hint' : `Show Hint (${3 - hintsUsed} remaining)`}
                    </button>

                    {showHint && (
                        <div style={{
                            marginTop: '8px',
                            background: 'rgba(255,215,0,0.07)',
                            border: '1px solid rgba(255,215,0,0.25)',
                            borderRadius: '8px', padding: '12px',
                            animation: 'fadeIn 0.3s ease',
                        }}>
                            <div style={{ fontSize: '12px', color: '#ffd700', lineHeight: 1.7 }}>
                                {level.hints[Math.min(currentHintIndex, level.hints.length - 1)]}
                            </div>
                            {currentHintIndex < level.hints.length - 1 && (
                                <button
                                    onClick={nextHint}
                                    style={{
                                        marginTop: '8px', background: 'rgba(255,215,0,0.15)',
                                        border: '1px solid rgba(255,215,0,0.3)', borderRadius: '6px',
                                        padding: '5px 12px', color: '#ffd700', cursor: 'pointer',
                                        fontSize: '11px', fontFamily: 'Inter',
                                    }}
                                >
                                    Next hint →
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Success / Retry message */}
                {gamePhase === 'success' && (
                    <div style={{
                        background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.4)',
                        borderRadius: '10px', padding: '12px', textAlign: 'center',
                        animation: 'fadeIn 0.4s ease',
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>🎉</div>
                        <div style={{ fontSize: '13px', color: '#00d4aa', fontWeight: 600 }}>
                            {level.winMessage}
                        </div>
                    </div>
                )}

                {gamePhase === 'retry' && (
                    <div style={{
                        background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.4)',
                        borderRadius: '10px', padding: '12px', textAlign: 'center',
                        animation: 'fadeIn 0.4s ease',
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>🔄</div>
                        <div style={{ fontSize: '13px', color: '#ff4757', fontWeight: 600 }}>
                            Not quite! Check the console for clues and try again.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
