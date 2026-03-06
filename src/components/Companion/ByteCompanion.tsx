'use client';
import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

interface ByteMessage {
    text: string;
    emoji: string;
}

const IDLE_MESSAGES: ByteMessage[] = [
    { emoji: '⚡', text: 'I\'m Byte! Your coding companion!' },
    { emoji: '💡', text: 'Write your code and press ▶ Run!' },
    { emoji: '🧠', text: 'Read the Mission Briefing carefully...' },
    { emoji: '🔍', text: 'Stuck? Try the Show Hint button!' },
];

const SUCCESS_MESSAGES: ByteMessage[] = [
    { emoji: '🎉', text: 'AMAZING! Clean code!' },
    { emoji: '⭐', text: 'You\'re a natural coder!' },
    { emoji: '🔥', text: 'That was PERFECT!' },
    { emoji: '🏆', text: 'Warrior, you\'re unstoppable!' },
];

const RETRY_MESSAGES: ByteMessage[] = [
    { emoji: '🤔', text: 'Hmm... check the objective again?' },
    { emoji: '💪', text: 'Don\'t give up! Try a hint!' },
    { emoji: '🔎', text: 'Look at the console output...' },
    { emoji: '📖', text: 'Re-read the mission briefing!' },
];

const RUNNING_MESSAGES: ByteMessage[] = [
    { emoji: '⚙️', text: 'Processing your code...' },
    { emoji: '🌀', text: 'Running the simulation...' },
    { emoji: '💻', text: 'Executing spell...' },
];

export default function ByteCompanion() {
    const { gamePhase } = useGameStore();

    // Always start at index 0 so SSR and initial client render match exactly.
    // After mount, pick a random index — completely client-side, no SSR mismatch.
    const [msgIdx, setMsgIdx] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setMsgIdx(Math.floor(Math.random() * 4));
    }, []);

    // Also pick a fresh random message whenever the game phase changes
    useEffect(() => {
        if (mounted) setMsgIdx(Math.floor(Math.random() * 4));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gamePhase]);

    let pool: ByteMessage[];
    switch (gamePhase) {
        case 'success': pool = SUCCESS_MESSAGES; break;
        case 'retry': pool = RETRY_MESSAGES; break;
        case 'running': pool = RUNNING_MESSAGES; break;
        default: pool = IDLE_MESSAGES;
    }

    const msg = pool[msgIdx % pool.length];


    const orbColors: Record<string, string> = {
        idle: '#4f8fff',
        running: '#00d4aa',
        success: '#ffd700',
        retry: '#ff4757',
    };
    const orbColor = orbColors[gamePhase] || '#4f8fff';

    return (
        <div style={{
            position: 'absolute',
            bottom: '100px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            zIndex: 50,
            pointerEvents: 'none',
        }}>
            {/* Speech bubble */}
            <div style={{
                background: 'rgba(10,10,20,0.92)',
                border: `1px solid ${orbColor}44`,
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '11px',
                color: '#e8e8ff',
                maxWidth: '160px',
                textAlign: 'right',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 16px ${orbColor}22`,
                animation: 'fadeIn 0.4s ease',
                lineHeight: 1.5,
            }}>
                <span style={{ marginRight: '4px' }}>{msg.emoji}</span>
                {msg.text}
                {/* Bubble tail */}
                <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '22px',
                    width: '10px',
                    height: '10px',
                    background: 'rgba(10,10,20,0.92)',
                    borderRight: `1px solid ${orbColor}44`,
                    borderBottom: `1px solid ${orbColor}44`,
                    transform: 'rotate(45deg)',
                }} />
            </div>

            {/* Byte orb */}
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${orbColor}cc, ${orbColor}44)`,
                border: `2px solid ${orbColor}`,
                boxShadow: `0 0 20px ${orbColor}66, 0 0 40px ${orbColor}22`,
                animation: 'float 2s ease-in-out infinite',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.5s ease',
            }}>
                {gamePhase === 'running' ? (
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span>
                ) : '✦'}
            </div>
        </div>
    );
}
