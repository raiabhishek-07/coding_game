'use client';

import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import ConsolePanel from '@/components/ConsolePanel/ConsolePanel';
import { ALL_LEVELS } from '@/lib/levels';

interface MultiplayerArenaProps {
    socket: Socket;
    roomID: string;
    role: 'host' | 'guest';
    initialPlayers: any[];
    challenges: number[];
    category?: string;
}

export default function MultiplayerArena({ socket, roomID, role, initialPlayers, challenges, category = 'General' }: MultiplayerArenaProps) {
    const [players, setPlayers] = useState(initialPlayers);
    const [showBriefing, setShowBriefing] = useState(true);
    const [shake, setShake] = useState(false);
    const [lastOpponentRound, setLastOpponentRound] = useState(1);
    const [consoleWidth, setConsoleWidth] = useState(400);
    const [isDragging, setIsDragging] = useState(false);

    const me = players.find(p => p.id === socket.id);
    const opponent = players.find(p => p.id !== socket.id);

    const currentRound = me?.round || 1;
    const oppRound = opponent?.round || 1;
    const challengeIndex = challenges[currentRound - 1] ?? challenges[0];
    const level = ALL_LEVELS[challengeIndex];
    const theme = { accent: '#00e5ff' };

    useEffect(() => {
        socket.on('progress-update', (updatedPlayers: any[]) => {
            const newOpponent = updatedPlayers.find(p => p.id !== socket.id);
            if (newOpponent && newOpponent.round > lastOpponentRound) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
                setLastOpponentRound(newOpponent.round);
            }
            setPlayers(updatedPlayers);
        });

        return () => {
            socket.off('progress-update');
        };
    }, [socket, lastOpponentRound]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const newWidth = window.innerWidth - e.clientX;
            // Limit width between 250px and 70% of screen
            if (newWidth > 250 && newWidth < window.innerWidth * 0.7) {
                setConsoleWidth(newWidth);
            }
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleSuccess = () => {
        socket.emit('challenge-complete', { roomID });
    };

    return (
        <div style={{
            display: 'grid', gridTemplateRows: '200px auto 1fr', height: '100vh',
            background: '#02040a', overflow: 'hidden', color: '#fff',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* AMBIENT GLOWS */}
            <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(255,71,87,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* 1. SPRINT TRACK (PREMIUM HUB) */}
            <div className={shake ? 'shake-anim' : ''} style={{
                background: 'rgba(10, 15, 30, 0.6)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                padding: '20px 40px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '25px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid #00e5ff44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚔️</div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 800, letterSpacing: '2px', color: '#00e5ff' }}>BATTLE ARENA</h2>
                            <p style={{ margin: 0, fontSize: '10px', color: '#556', fontWeight: 'bold' }}>CATEGORY: {category.toUpperCase()}</p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#889', marginBottom: '4px', letterSpacing: '1px' }}>MATCH PROGRESS</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00e5ff' }}>{currentRound}</div>
                            <div style={{ width: '1px', height: '15px', background: '#334' }} />
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#445' }}>5</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', textAlign: 'right' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 800, letterSpacing: '2px', color: '#ff4757' }}>OPPONENT</h2>
                            <p style={{ margin: 0, fontSize: '10px', color: '#556', fontWeight: 'bold' }}>{opponent ? 'CONNECTED' : 'WAITING...'}</p>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,71,87,0.1)', border: '1px solid #ff475744', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🛡️</div>
                    </div>
                </div>

                <div style={{ position: 'relative', height: '60px', width: '90%', margin: '0 auto' }}>
                    {/* Track Line */}
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.05)', transform: 'translateY(-50%)' }} />
                    <div style={{
                        position: 'absolute', top: '50%', left: 0,
                        width: `${Math.max((currentRound - 1) * 25, (oppRound - 1) * 25)}%`,
                        height: '2px', background: 'linear-gradient(to right, #00e5ff44, transparent)',
                        transform: 'translateY(-50%)'
                    }} />

                    {/* Round Markers */}
                    {[1, 2, 3, 4, 5].map(step => (
                        <div key={step} style={{
                            position: 'absolute',
                            left: `${(step - 1) * 25}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '40px', height: '40px',
                            background: currentRound >= step ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${currentRound >= step ? '#00e5ff44' : 'rgba(255,255,255,0.05)'}`,
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 'bold', color: currentRound >= step ? '#00e5ff' : '#334',
                            zIndex: 1, backdropFilter: 'blur(5px)', transition: 'all 0.5s'
                        }}>
                            {step}
                        </div>
                    ))}

                    {/* Me Avatar */}
                    <div style={{
                        position: 'absolute',
                        left: `${(currentRound - 1) * 25}%`,
                        top: '50%',
                        transform: 'translate(-50%, -110%)',
                        fontSize: '32px',
                        transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        zIndex: 10,
                        filter: 'drop-shadow(0 0 15px rgba(0,229,255,0.6))',
                        animation: 'bob 2s infinite ease-in-out'
                    }}>
                        🐱‍💻
                        <div style={{ width: '4px', height: '4px', background: '#00e5ff', borderRadius: '50%', margin: '4px auto 0', boxShadow: '0 0 10px #00e5ff' }} />
                    </div>

                    {/* Opponent Avatar */}
                    <div style={{
                        position: 'absolute',
                        left: `${(oppRound - 1) * 25}%`,
                        top: '50%',
                        transform: 'translate(-50%, 10%)',
                        fontSize: '32px',
                        transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        zIndex: 9,
                        opacity: 0.6,
                        filter: 'grayscale(0.4) drop-shadow(0 0 10px rgba(255,71,87,0.3))',
                        animation: 'bob 2s infinite ease-in-out reverse'
                    }}>
                        👤
                        <div style={{ width: '4px', height: '4px', background: '#ff4757', borderRadius: '50%', margin: '4px auto 0', boxShadow: '0 0 10px #ff4757' }} />
                    </div>
                </div>
            </div>

            {/* 2. MISSION CONTROL (GLASSMORPHISM) */}
            <div style={{
                padding: '10px 25px',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                position: 'relative',
                zIndex: 5
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px',
                    padding: showBriefing ? '15px 25px' : '10px 25px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showBriefing ? '12px' : '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                                background: 'linear-gradient(45deg, #00e5ff, #0081ff)',
                                color: '#000', padding: '3px 10px', borderRadius: '6px',
                                fontSize: '10px', fontWeight: 900, textTransform: 'uppercase'
                            }}>MISSION 0{currentRound}</div>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>{level.title}</h3>
                        </div>
                        <button
                            onClick={() => setShowBriefing(!showBriefing)}
                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#667', cursor: 'pointer', padding: '5px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = '#667'}
                        >
                            {showBriefing ? 'MINIMIZE BRIEF' : 'EXPAND BRIEF'}
                        </button>
                    </div>

                    {showBriefing && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', animation: 'slideDown 0.4s ease' }}>
                            <div>
                                <h4 style={{ color: '#00e5ff', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Analysis</h4>
                                <p style={{ color: '#889', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>{level.story}</p>
                            </div>
                            <div style={{ background: 'rgba(0, 229, 255, 0.03)', border: '1px solid #00e5ff11', borderRadius: '12px', padding: '12px 20px' }}>
                                <h4 style={{ color: '#00e5ff', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>System Goal</h4>
                                <p style={{ color: '#fff', fontSize: '13px', margin: 0, fontWeight: 500 }}>{level.objective}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. TERMINAL VIEW (EDITOR + CONSOLE) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `1fr auto ${consoleWidth}px`,
                background: 'rgba(255,255,255,0.03)',

                overflow: 'hidden',
                flex: 1
            }}>
                <div style={{ background: '#02040a', display: 'flex', flexDirection: 'column', minWidth: '300px' }}>
                    <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                        </div>
                        <span style={{ fontSize: '10px', color: '#445', fontWeight: 'bold', letterSpacing: '1px', marginLeft: '10px' }}>MAIN_ENGINE.JS</span>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <CodeEditor
                            key={currentRound}
                            level={level}
                            theme={theme}
                            onSuccess={handleSuccess}
                            onRetry={() => { }}
                        />
                    </div>
                </div>

                {/* Resizable Divider */}
                <div
                    onMouseDown={() => setIsDragging(true)}
                    style={{
                        width: '6px',
                        cursor: 'col-resize',
                        background: isDragging ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.03)',
                        borderRight: '1px solid rgba(0, 0, 0, 0.2)',
                        transition: 'background 0.2s',
                        zIndex: 20,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        width: '2px', height: '40px',
                        background: isDragging ? '#00e5ff' : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '2px',
                        boxShadow: isDragging ? '0 0 10px #00e5ff' : 'none'
                    }} />
                </div>

                <div style={{ background: '#02040a', borderLeft: '1px solid rgba(255,255,255,0.03)', width: consoleWidth, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '10px', color: '#445', fontWeight: 'bold', letterSpacing: '1px' }}>SYSTEM_OUTPUT</span>
                    </div>
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <ConsolePanel />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes bob { 0%, 100% { transform: translate(-50%, -110%); } 50% { transform: translate(-50%, -120%); } }
                .shake-anim { animation: shake 0.5s ease-in-out; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                :global(body) { user-select: ${isDragging ? 'none' : 'auto'}; }
            `}</style>
        </div >
    );
}
