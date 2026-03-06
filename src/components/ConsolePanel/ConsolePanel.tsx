'use client';
import React, { useRef, useEffect } from 'react';
import { useGameStore, ConsoleMessage } from '@/store/gameStore';

function MessageLine({ msg }: { msg: ConsoleMessage }) {
    const colors: Record<ConsoleMessage['type'], string> = {
        log: '#e8e8ff',
        error: '#ff4757',
        success: '#00d4aa',
        info: '#4f8fff',
        warn: '#ffd700',
    };
    const icons: Record<ConsoleMessage['type'], string> = {
        log: '>',
        error: '✖',
        success: '✔',
        info: 'ℹ',
        warn: '⚠',
    };

    return (
        <div style={{
            display: 'flex', gap: '8px', padding: '3px 0',
            borderBottom: '1px solid rgba(255,255,255,0.03)',
            animation: 'fadeIn 0.2s ease',
        }}>
            <span style={{ color: colors[msg.type], opacity: 0.6, fontSize: '11px', minWidth: '12px', fontFamily: 'JetBrains Mono' }}>
                {icons[msg.type]}
            </span>
            <span style={{
                color: colors[msg.type], fontSize: '12px',
                fontFamily: 'JetBrains Mono', lineHeight: 1.6, wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
            }}>
                {msg.text}
            </span>
        </div>
    );
}

export default function ConsolePanel() {
    const { consoleMessages, clearConsole, isRunning } = useGameStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [consoleMessages]);

    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: '#080810', overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '10px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: isRunning ? '#00d4aa' : '#555',
                        boxShadow: isRunning ? '0 0 10px #00d4aa' : 'none',
                        transition: 'all 0.3s',
                        animation: isRunning ? 'pulse-glow 1s infinite' : 'none',
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Console / Output
                    </span>
                </div>
                <button
                    id="clear-console-btn"
                    onClick={clearConsole}
                    style={{
                        background: 'transparent', border: '1px solid #333',
                        borderRadius: '5px', padding: '3px 10px',
                        color: '#666', cursor: 'pointer', fontSize: '10px', fontFamily: 'Inter',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#aaa')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                >
                    Clear
                </button>
            </div>

            {/* Output Area */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '12px 16px',
                display: 'flex', flexDirection: 'column',
            }}>
                {consoleMessages.length === 0 ? (
                    <div style={{
                        flex: 1, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        <div style={{ fontSize: '28px', opacity: 0.2 }}>🖥️</div>
                        <div style={{ fontSize: '11px', color: '#333', fontFamily: 'JetBrains Mono' }}>
                            Run your code to see output here
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ fontSize: '10px', color: '#333', fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
                            — output —
                        </div>
                        {consoleMessages.map((msg) => (
                            <MessageLine key={msg.id} msg={msg} />
                        ))}
                    </>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Blinking cursor */}
            <div style={{
                padding: '8px 16px',
                borderTop: '1px solid rgba(255,255,255,0.03)',
                flexShrink: 0,
            }}>
                <span style={{
                    fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#00d4aa',
                }}>
                    {'>'}{' '}
                    <span style={{ animation: 'console-blink 1s infinite' }}>█</span>
                </span>
            </div>
        </div>
    );
}
