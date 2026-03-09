'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import MultiplayerLobby from '@/components/Multiplayer/MultiplayerLobby';
import MultiplayerArena from '@/components/Multiplayer/MultiplayerArena';

interface MultiplayerModuleProps {
    // No longer needs initialRoomID prop for routing
}

export default function MultiplayerModule({ }: MultiplayerModuleProps) {
    const router = useRouter();
    const [gameState, setGameState] = useState<'lobby' | 'battle' | 'gameOver'>('lobby');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [roomID, setRoomID] = useState<string>('');
    const [role, setRole] = useState<'host' | 'guest'>('host');
    const [players, setPlayers] = useState<any[]>([]);
    const [challenges, setChallenges] = useState<number[]>([]);
    const [category, setCategory] = useState<string>('General');
    const [winner, setWinner] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Establish socket connection once
    useEffect(() => {
        const s = io('http://localhost:3001');
        setSocket(s);

        s.on('waiting', (data: any) => {
            // Lobby handles this UI, we just update local state if needed
            setRoomID(data.roomID);
        });

        s.on('game-start', (data: any) => {
            setPlayers(data.players);
            setChallenges(data.challenges);
            setCategory(data.category || 'General');
            setGameState('battle');
        });

        s.on('game-over', (data: any) => {
            setWinner(data.winner);
            setGameState('gameOver');
        });

        s.on('error', (msg: string) => {
            setError(msg);
            setGameState('lobby');
            alert(msg);
        });

        // No auto-join from URL logic needed here

        return () => {
            s.disconnect();
        };
    }, []);

    const handleJoinRoom = (connectedSocket: Socket, id: string, userRole: 'host' | 'guest') => {
        setRoomID(id);
        setRole(userRole);
        // Only internal state changes, no URL updates.
    };

    // We removed the global connecting/waiting states to allow the Lobby's custom UI to shine

    return (
        <main style={{ minHeight: '100vh', background: '#050a18' }}>
            {gameState === 'lobby' && socket && (
                <MultiplayerLobby socket={socket} onJoinRoom={handleJoinRoom} />
            )}

            {gameState === 'battle' && socket && (
                <MultiplayerArena
                    socket={socket}
                    roomID={roomID}
                    role={role}
                    initialPlayers={players}
                    challenges={challenges}
                    category={category}
                />
            )}

            {gameState === 'gameOver' && (
                <div style={{
                    height: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', color: '#fff',
                    fontFamily: "'Press Start 2P'", background: '#02040a'
                }}>
                    <h1 style={{ fontSize: '48px', color: winner === socket?.id ? '#00ffcc' : '#ff4757', marginBottom: '20px' }}>
                        {winner === socket?.id ? 'VICTORY!' : 'DEFEAT'}
                    </h1>
                    <button
                        onClick={() => setGameState('lobby')}
                        style={{ padding: '15px 30px', background: '#00c8ff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#000' }}>
                        BACK TO LOBBY
                    </button>
                </div>
            )}
        </main>
    );
}
