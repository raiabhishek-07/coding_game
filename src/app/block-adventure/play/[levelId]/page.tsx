'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { sfxSuccess, sfxError, sfxRun, sfxClick } from '@/lib/sounds';
import { ALL_BLOCK_LEVELS } from '@/data/block-levels';
import { BlockProgrammingEditor } from '@/components/BlockProgramming/BlockProgrammingEditor';

const PhaserEngine = dynamic(() => import('../../GameEngine'), { ssr: false });

export default function PlayLevelPage({ params }: { params: Promise<{ levelId: string }> }) {
    const router = useRouter();
    const resolvedParams = React.use(params);

    const initialLevelId = parseInt(resolvedParams.levelId, 10);
    const initialLevelIndex = ALL_BLOCK_LEVELS.findIndex(l => l.id === initialLevelId);

    if (initialLevelIndex === -1) return notFound();

    const [currentLevelIndex, setCurrentLevelIndex] = useState(initialLevelIndex);
    const level = ALL_BLOCK_LEVELS[currentLevelIndex];

    const [blockCommands, setBlockCommands] = useState<any[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [runTrigger, setRunTrigger] = useState(0);
    const [stopTrigger, setStopTrigger] = useState(0);
    const [gemsCollected, setGemsCollected] = useState(0);

    // Sidebar Dynamic Controls
    const [sidebarWidth, setSidebarWidth] = useState(550);
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = React.useCallback((e: React.MouseEvent) => {
        setIsResizing(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = e.clientX;
            if (newWidth > 300 && newWidth < 1000) {
                setSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    const getAllowedCategories = (id: number): any[] => {
        if (id <= 7) return ['movement', 'action'];
        if (id <= 14) return ['movement', 'action', 'control', 'logic'];
        return ['movement', 'action', 'control', 'logic', 'algorithm'];
    };

    const onExecuteBlocks = (commands: any[]) => {
        const expanded: string[] = [];
        for (const cmd of commands) {
            if (typeof cmd === 'string') expanded.push(cmd);
            else if (typeof cmd === 'object') {
                if (['wait', 'algorithm', 'condition', 'character'].includes(cmd.type)) expanded.push(cmd as any);
                else if (cmd.type === 'sound') {
                    if (cmd.sound === 'success') sfxSuccess();
                    else if (cmd.sound === 'error') sfxError();
                } else expanded.push(cmd as any);
            }
        }
        sfxRun();
        setBlockCommands(expanded);
        setRunTrigger(Date.now());
        setIsPlaying(true);
    };

    const handleStop = () => {
        setStopTrigger(Date.now());
        setIsPlaying(false);
    };

    const onFinishSequence = (success: boolean) => {
        setIsPlaying(false);
        if (success) {
            sfxSuccess();
            // Auto-next logic or celebratory UI could go here
        } else {
            sfxError();
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            background: '#0a0a0f', color: '#fff', fontFamily: "'Outfit', sans-serif",
            overflow: 'hidden'
        }}>
            {/* Premium Header HUD */}
            <header style={{
                height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 32px', background: 'rgba(5, 5, 8, 0.95)', backdropFilter: 'blur(34px)',
                borderBottom: '2px solid rgba(102, 126, 234, 0.2)', zIndex: 100,
                position: 'relative', flexShrink: 0
            }}>
                {/* Decorative scanning line on header */}
                <div style={{
                    position: 'absolute', bottom: -1, left: 0, width: '100%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                    opacity: 0.6
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => { sfxClick(); router.push('/block-adventure'); }}
                        className="map-tab-btn"
                        style={{ height: '40px', padding: '0 16px', borderRadius: '12px', fontSize: '11px' }}
                    >
                        <span style={{ fontSize: '14px' }}>🗺️</span>
                        <span>WORLD MAP</span>
                    </button>

                    <div style={{ height: '24px', width: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '-2px' }}>
                            <div className="pulse-circle" style={{ background: '#667eea', width: '6px', height: '6px' }}></div>
                            <span style={{ fontSize: '9px', color: '#667eea', fontWeight: 900, letterSpacing: '3px' }}>SECTOR_0{Math.floor(level.id / 7) + 1}</span>
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '1px', color: '#fff' }}>
                            {level.title.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {/* Level Progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', opacity: 0.8 }}>
                        <div style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>LEVEL PROGRESS</div>
                        <div style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ width: `${(currentLevelIndex / ALL_BLOCK_LEVELS.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', boxShadow: '0 0 10px #667eea' }}></div>
                        </div>
                    </div>

                    <div className="gems-stat-panel" style={{ padding: '6px 16px' }}>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '1px' }}>FRAGMENTS</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#f1c40f' }}>{gemsCollected}</span>
                            <span style={{ fontSize: '12px', fontWeight: 900, opacity: 0.2 }}>/</span>
                            <span style={{ fontSize: '14px', fontWeight: 900, opacity: 0.5 }}>{level.gems.length}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                            disabled={currentLevelIndex === 0}
                            onClick={() => { sfxClick(); setCurrentLevelIndex(i => i - 1); setGemsCollected(0); setBlockCommands([]); }}
                            className="nav-arrow-btn"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        <button
                            disabled={currentLevelIndex === ALL_BLOCK_LEVELS.length - 1}
                            onClick={() => { sfxClick(); setCurrentLevelIndex(i => i + 1); setGemsCollected(0); setBlockCommands([]); }}
                            className="nav-arrow-btn"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* 1. LAYER: Game Engine (Full Window) */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                background: 'radial-gradient(circle at 50% 50%, #1a1a24 0%, #050510 100%)'
            }}>
                <PhaserEngine
                    blocks={blockCommands}
                    level={level}
                    runTrigger={runTrigger}
                    stopTrigger={stopTrigger}
                    onFinish={onFinishSequence}
                    onGemsUpdate={setGemsCollected}
                />
            </div>

            {/* Mission Objective Overlay (Top Right over Game) */}
            <div style={{
                position: 'absolute', top: '100px', right: '32px', zIndex: 10,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                padding: '16px 24px', borderRadius: '16px', borderLeft: '4px solid #667eea',
                pointerEvents: 'none', maxWidth: '300px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ fontSize: '10px', color: '#667eea', fontWeight: 900, letterSpacing: '2px', marginBottom: '4px' }}>MISSION OBJECTIVE</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                    {level.description || 'Navigate to the crystal and collect all fragments.'}
                </div>
            </div>

            {/* Sidebar Toggle Button */}
            <button
                onClick={() => { sfxClick(); setIsSidebarOpen(!isSidebarOpen); }}
                style={{
                    position: 'absolute', left: isSidebarOpen ? `${sidebarWidth}px` : '0px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 20, width: '32px', height: '64px', background: 'rgba(10, 10, 15, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none',
                    borderRadius: '0 12px 12px 0', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', transition: isResizing ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    backdropFilter: 'blur(10px)', boxShadow: '10px 0 20px rgba(0,0,0,0.3)'
                }}
            >
                <span style={{ fontSize: '14px', color: '#fff', opacity: 0.8 }}>{isSidebarOpen ? '◀' : '▶'}</span>
            </button>

            {/* Left Sidebar: Logic Editor */}
            <aside style={{
                position: 'absolute', top: '70px', bottom: '0', left: 0,
                width: `${sidebarWidth}px`, background: 'rgba(10, 10, 15, 0.85)',
                borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 15,
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: isResizing ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: isSidebarOpen ? '20px 0 50px rgba(0,0,0,0.5)' : 'none',
                backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column'
            }}>
                {/* Resize Handle */}
                <div
                    onMouseDown={startResizing}
                    style={{
                        position: 'absolute', right: '-4px', top: 0, bottom: 0, width: '8px',
                        cursor: 'col-resize', zIndex: 100, background: isResizing ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
                        transition: 'background 0.2s'
                    }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <BlockProgrammingEditor
                        onExecute={onExecuteBlocks}
                        isExecuting={isPlaying}
                        onStop={handleStop}
                        levelId={level.id}
                        allowedCategories={getAllowedCategories(level.id)}
                        autoSave={true}
                        sidebarWidth={sidebarWidth}
                    />
                </div>

                {/* Console / Status HUD */}
                <div style={{
                    padding: '24px', background: 'rgba(0,0,0,0.3)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: isPlaying ? '#f19066' : '#55efc4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', boxShadow: isPlaying ? '0 0 20px #f1906644' : '0 0 20px #55efc444',
                        animation: isPlaying ? 'pulse-btn 1.5s infinite' : 'none'
                    }}>
                        {isPlaying ? '⚡' : '📡'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '1px' }}>SYSTEM_CORE_STATUS</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: isPlaying ? '#f19066' : '#55efc4', letterSpacing: '0.5px' }}>
                            {isPlaying ? 'EXECUTING COMMANDS...' : 'SYSTEM READY'}
                        </div>
                    </div>
                </div>
            </aside>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
                
                .map-tab-btn {
                    background: rgba(102, 126, 234, 0.1);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    color: #fff; height: 50px; padding: 0 24px; borderRadius: 16px;
                    fontWeight: 900; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex; align-items: center; gap: 12px; fontSize: 13px; letter-spacing: 2px;
                }
                .map-tab-btn:hover {
                    background: #667eea;
                    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
                    transform: translateY(-2px);
                }

                .nav-arrow-btn {
                    width: 50px; height: 50px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #fff; border-radius: 16px;
                    cursor: pointer; transition: all 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                .nav-arrow-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.08);
                    border-color: rgba(255,255,255,0.2);
                    transform: scale(1.05);
                }
                .nav-arrow-btn:disabled { opacity: 0.1; cursor: not-allowed; }

                .gems-stat-panel {
                    border: 1px solid rgba(255,255,255,0.05);
                    background: rgba(255,255,255,0.02);
                    padding: 8px 24px; border-radius: 20px;
                    text-align: center;
                }

                .pulse-circle {
                    width: 8px; height: 8px; border-radius: 50%;
                    animation: pulse-ring 2s infinite;
                }
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
                }

                .terminal-corner {
                    position: absolute; width: 30px; height: 30px;
                    border-color: #667eea; border-style: solid;
                    z-index: 10; pointer-events: none; opacity: 0.5;
                }
                .terminal-corner.tl { top: 20px; left: 20px; border-width: 3px 0 0 3px; border-top-left-radius: 12px; }
                .terminal-corner.tr { top: 20px; right: 20px; border-width: 3px 3px 0 0; border-top-right-radius: 12px; }
                .terminal-corner.bl { bottom: 20px; left: 20px; border-width: 0 0 3px 3px; border-bottom-left-radius: 12px; }
                .terminal-corner.br { bottom: 20px; right: 20px; border-width: 0 3px 3px 0; border-bottom-right-radius: 12px; }
            `}} />
        </div>
    );
}
