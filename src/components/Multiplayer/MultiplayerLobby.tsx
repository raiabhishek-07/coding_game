'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ALL_LEVELS } from '@/lib/levels';
import { LevelConfig } from '@/lib/levels/types';

interface MultiplayerLobbyProps {
    socket: Socket;
    onJoinRoom: (socket: Socket, roomID: string, role: 'host' | 'guest') => void;
}

export default function MultiplayerLobby({ socket, onJoinRoom }: MultiplayerLobbyProps) {
    const [roomInput, setRoomInput] = useState('');
    const [hostedRoomID, setHostedRoomID] = useState<string | null>(null);
    const [status, setStatus] = useState(socket.connected ? 'Connected' : 'Disconnected');
    const [category, setCategory] = useState('Basics');
    const [copied, setCopied] = useState(false);

    const CATEGORIES = [
        { name: 'Basics', icon: '🐣', concepts: ['console', 'Variables', 'Data Types', 'Arithmetic'] },
        { name: 'Logic', icon: '🧠', concepts: ['Comparison', 'If', 'Else', 'Switch'] },
        { name: 'Loops', icon: '♻️', concepts: ['While', 'For'] },
        { name: 'Functions', icon: '⚡', concepts: ['Function', 'Return', 'Arrow', 'Scope', 'Closures'] },
        { name: 'Arrays', icon: '📦', concepts: ['Array', 'Methods', 'Destructuring', 'Spread'] },
        { name: 'Objects', icon: '💎', concepts: ['Object', 'this', 'Destructuring'] },
        { name: 'DSA Strings', icon: '🧵', concepts: ['DSA Strings'] },
        { name: 'DSA Arrays', icon: '📊', concepts: ['DSA Arrays'] },
        { name: 'DSA Logic', icon: '🔢', concepts: ['DSA Logic'] },
        { name: 'DSA Lists', icon: '🔗', concepts: ['DSA Lists'] },
    ];

    useEffect(() => {
        const handleConnect = () => setStatus('Connected');
        const handleDisconnect = () => setStatus('Disconnected');
        const handleRoomCreated = (id: string) => setHostedRoomID(id);
        const handleError = (msg: string) => alert(msg);

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('room-created', handleRoomCreated);
        socket.on('error', handleError);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('room-created', handleRoomCreated);
            socket.off('error', handleError);
        };
    }, [socket]);

    const handleHost = () => {
        if (!socket) return;

        // Pick 5 random challenges from the chosen category
        const cats = CATEGORIES.find(c => c.name === category)?.concepts || [];
        const pool = ALL_LEVELS
            .map((lvl: LevelConfig, idx: number) => ({ idx, lvl }))
            .filter((item: { idx: number; lvl: LevelConfig }) => cats.some(c => item.lvl.concept.toLowerCase().includes(c.toLowerCase())));

        // Shuffle pool and take 5
        const shuffled = pool.sort(() => 0.5 - Math.random());
        const selectedIndices = shuffled.slice(0, 5).map((s: { idx: number; lvl: LevelConfig }) => s.idx);

        // If not enough in category, fill with ALL_LEVELS
        while (selectedIndices.length < 5) {
            const r = Math.floor(Math.random() * ALL_LEVELS.length);
            if (!selectedIndices.includes(r)) selectedIndices.push(r);
        }

        const roomID = Math.random().toString(36).substring(7).toUpperCase();
        socket.emit('create-room', { roomID, challenges: selectedIndices, category });
        socket.emit('join-room', roomID); // IMPORTANT: Host must join the room too!
        onJoinRoom(socket, roomID, 'host');
    };

    const handleJoin = () => {
        if (!socket || !roomInput) return;
        socket.emit('join-room', roomInput);
        onJoinRoom(socket, roomInput, 'guest');
    };

    const handleCopy = () => {
        if (!hostedRoomID) return;
        navigator.clipboard.writeText(hostedRoomID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (hostedRoomID) {
        return (
            <div style={{
                maxWidth: '450px', margin: '80px auto', padding: '50px 40px',
                background: 'rgba(5,13,38,0.9)', border: '1px solid #00c8ff',
                borderRadius: '24px', textAlign: 'center', color: '#fff',
                backdropFilter: 'blur(20px)', boxShadow: '0 0 50px rgba(0,200,255,0.2)'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'float 3s infinite' }}>🛰️</div>
                <h2 style={{ fontFamily: "'Press Start 2P'", fontSize: '18px', marginBottom: '10px', color: '#00c8ff', letterSpacing: '2px' }}>ROOM READY</h2>
                <p style={{ fontSize: '12px', color: '#55a', marginBottom: '30px' }}>Category: {category}</p>

                <div
                    onClick={handleCopy}
                    style={{
                        padding: '30px', background: 'rgba(0,200,255,0.05)', borderRadius: '16px',
                        border: '1px dashed #00c8ff44', marginBottom: '25px', cursor: 'pointer',
                        position: 'relative', transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,200,255,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,200,255,0.05)'}
                >
                    <p style={{ fontSize: '10px', color: '#888', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Friend joins with this ID (Click to copy):</p>
                    <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '12px', margin: 0, color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>{hostedRoomID}</h1>
                    {copied && (
                        <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            fontSize: '10px', color: '#00c8ff', fontWeight: 'bold',
                            animation: 'bounce 0.4s ease infinite alternate'
                        }}>COPIED!</div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#00c8ff', borderRadius: '50%', animation: 'ping 1.5s infinite' }} />
                    <p style={{ fontSize: '14px', color: '#00c8ff', margin: 0 }}>WAITING FOR CHALLENGER...</p>
                </div>

                <style jsx>{`
                    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
                    @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '500px', margin: '60px auto', padding: '40px',
            background: 'rgba(5,13,38,0.85)', border: '1px solid rgba(0,200,255,0.3)',
            borderRadius: '24px', color: '#fff', backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.3s ease'
        }}>
            <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '20px', textAlign: 'center', marginBottom: '40px', color: '#00c8ff', textShadow: '0 0 20px rgba(0,200,255,0.5)' }}>CODE DUEL</h1>

            {/* Host Section */}
            <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>1. Select Challenge Tier</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '25px' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => setCategory(cat.name)}
                            style={{
                                padding: '15px 10px', background: category === cat.name ? '#00c8ff' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${category === cat.name ? '#00c8ff' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '12px', color: category === cat.name ? '#000' : '#fff',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '5px'
                            }}>
                            <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                            <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{cat.name}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleHost}
                    style={{
                        width: '100%', padding: '20px', background: '#00c8ff', color: '#000',
                        border: 'none', borderRadius: '12px', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '16px', boxShadow: '0 10px 20px rgba(0,200,255,0.3)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    🚀 LAUNCH HOST SERVER
                </button>
            </div>

            {/* Join Section */}
            <div>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>2. Or Join Active Duel</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="ENTER ROOM ID"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                        style={{
                            flex: 1, padding: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px', color: '#fff', fontSize: '16px', letterSpacing: '2px', outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleJoin}
                        style={{
                            padding: '0 30px', background: 'transparent', color: '#00c8ff',
                            border: '2px solid #00c8ff', borderRadius: '12px', cursor: 'pointer',
                            fontWeight: 'bold', fontSize: '14px'
                        }}>
                        JOIN
                    </button>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <span style={{ fontSize: '10px', color: status === 'Connected' ? '#00c8ff' : '#ff4757', opacity: 0.6 }}>
                    ● NETWORK {status.toUpperCase()}
                </span>
            </div>
        </div>
    );
}
