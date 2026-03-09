'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ALL_BLOCK_LEVELS } from '@/data/block-levels';
import { sfxClick } from '@/lib/sounds';

const WORLDS = [
    { name: 'BEGINNER BAY', range: [1, 7], color: '#4caf50', accent: '#a5d6a7', icon: '🏝️', desc: 'Island Basics' },
    { name: 'LOGIC LAKES', range: [8, 14], color: '#2196f3', accent: '#90caf9', icon: '💧', desc: 'Control Flow' },
    { name: 'ALGO ABYSS', range: [15, 21], color: '#9c27b0', accent: '#ce93d8', icon: '🌌', desc: 'Core Algorithms' }
];

export default function BlockAdventureMap() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const viewportRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = (e: any) => setScrolled(e.target.scrollLeft > 50);
        const el = viewportRef.current;
        el?.addEventListener('scroll', handleScroll);

        // Redirect vertical wheel to horizontal scroll
        const handleWheel = (e: WheelEvent) => {
            if (el && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };
        el?.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            el?.removeEventListener('scroll', handleScroll);
            el?.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const scrollToWorld = (worldIdx: number) => {
        sfxClick();
        if (viewportRef.current) {
            const targetX = worldIdx * 1500;
            viewportRef.current.scrollTo({ left: targetX, behavior: 'smooth' });
        }
    };

    const getLevelWorld = (id: number) => {
        return WORLDS.find(w => id >= w.range[0] && id <= w.range[1]) || WORLDS[0];
    };

    const renderPath = () => {
        const lines: any[] = [];
        const nodes: any[] = [];
        const levels = ALL_BLOCK_LEVELS;

        let currX = 200;
        let currY = 450; // Centered vertically

        for (let i = 0; i < levels.length; i++) {
            const world = getLevelWorld(levels[i].id);

            nodes.push({
                id: levels[i].id,
                title: levels[i].title,
                x: currX,
                y: currY,
                world,
                isMajor: levels[i].id % 7 === 0
            });

            if (i < levels.length - 1) {
                let nextX = currX + 220;
                let nextY = currY;

                const phase = Math.floor(i / 3);
                if (phase % 2 === 0) nextY += (i % 3) * 60;
                else nextY -= (i % 3) * 60;

                nextY = Math.max(300, Math.min(600, nextY));

                const midX = (currX + nextX) / 2;
                const midY = (currY + nextY) / 2 + (i % 2 === 0 ? 40 : -40);
                const pathData = `M ${currX} ${currY} Q ${midX} ${midY} ${nextX} ${nextY}`;

                lines.push(
                    <g key={`path-group-${i}`}>
                        <path d={pathData} stroke={world.color} strokeWidth="14" fill="none" opacity="0.1" style={{ filter: 'blur(10px)' }} />
                        <path
                            d={pathData}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="4"
                            strokeDasharray="1, 15"
                            strokeLinecap="round"
                            fill="none"
                            className="pulsating-path"
                        />
                    </g>
                );

                currX = nextX;
                currY = nextY;
            }
        }

        return { lines, nodes };
    };

    const { lines, nodes } = renderPath();

    return (
        <div
            id="map-viewport"
            ref={viewportRef}
            style={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                background: '#05050a',
                overflowX: 'auto',
                overflowY: 'hidden',
                fontFamily: "'Outfit', sans-serif",
                scrollBehavior: 'smooth'
            }}
        >
            {/* 1. LAYER: Deep Background (Parallax) */}
            <div style={{
                position: 'fixed', inset: 0,
                backgroundImage: 'url(/assets/world_map.png)',
                backgroundSize: '150% 150%',
                backgroundPosition: 'center',
                opacity: 0.15,
                filter: 'saturate(0.5) blur(1px)',
                zIndex: 0
            }} />

            {/* Premium Header HUD */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                padding: '24px 48px',
                background: scrolled ? 'rgba(5,5,10,0.9)' : 'linear-gradient(to bottom, rgba(5,5,10,0.8), transparent)',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div className="logo-box" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>🌍</div>
                    <div>
                        <h1 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px' }}>
                            World Explorer
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="status-dot"></div>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 900, letterSpacing: '2px' }}>SYSTEM ONLINE</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="stat-pill">COMPLETED: <span style={{ color: '#667eea' }}>0 / 21</span></div>
                </div>
            </header>

            {/* WORLD NAVIGATOR (Floating Footer) */}
            <nav style={{
                position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000, display: 'flex', gap: '12px', padding: '12px',
                background: 'rgba(15, 15, 20, 0.6)', backdropFilter: 'blur(30px)',
                borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                {WORLDS.map((w, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToWorld(i)}
                        className="world-nav-btn"
                        style={{ '--world-color': w.color } as any}
                    >
                        <span style={{ fontSize: '18px' }}>{w.icon}</span>
                        <div className="nav-label">{w.name}</div>
                    </button>
                ))}
            </nav>

            {/* Bio Labels & Section Indicators */}
            <div className="world-labels">
                {WORLDS.map((w, idx) => (
                    <div key={idx} style={{
                        position: 'absolute',
                        left: `${150 + idx * 1500}px`,
                        top: '180px',
                        zIndex: 5,
                        pointerEvents: 'none'
                    }}>
                        <div style={{ fontSize: '12px', color: w.color, fontWeight: 900, letterSpacing: '6px' }}>SEC_00{idx + 1}</div>
                        <h2 style={{ fontSize: '64px', color: '#fff', margin: '8px 0', opacity: 0.9 }}>{w.name}</h2>
                        <div style={{ background: w.color, height: '4px', width: '80px', margin: '16px 0' }} />
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 600, letterSpacing: '1px' }}>{w.desc}</p>
                    </div>
                ))}
            </div>

            {/* Horizontal Map Extension */}
            <div style={{
                position: 'relative',
                width: '5200px',
                height: '100vh',
                padding: '0 200px',
                display: 'flex',
                alignItems: 'center',
                zIndex: 10
            }}>
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
                    {lines}
                </svg>

                {/* Level Nodes */}
                {nodes.map((node) => (
                    <Link
                        href={`/block-adventure/play/${node.id}`}
                        key={node.id}
                        onClick={() => { sfxClick(); }}
                        style={{
                            position: 'absolute',
                            left: `${node.x}px`,
                            top: `${node.y}px`,
                            transform: 'translate(-50%, -50%)',
                            textDecoration: 'none'
                        }}
                    >
                        <div className={`level-node ${node.isMajor ? 'major' : ''}`} style={{
                            '--node-color': node.world.color,
                        } as any}>
                            <div className="node-glow"></div>
                            <div className="node-content">
                                <div className="node-icon">{node.isMajor ? '👑' : node.world.icon}</div>
                                <div className="node-id">{node.id}</div>
                            </div>

                            <div className="node-tooltip">
                                <div style={{ fontSize: '10px', color: node.world.color, fontWeight: 900, letterSpacing: '2px' }}>LEVEL {node.id}</div>
                                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>{node.title}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

                #map-viewport::-webkit-scrollbar {
                    height: 6px;
                }
                #map-viewport::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.2);
                }
                #map-viewport::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    transition: background 0.3s;
                }
                #map-viewport::-webkit-scrollbar-thumb:hover {
                    background: rgba(102, 126, 234, 0.4);
                }

                .status-dot {
                    width: 6px; height: 6px; background: #667eea; border-radius: 50%;
                    box-shadow: 0 0 10px #667eea;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .logo-box {
                    width: 48px; height: 48px; 
                    background: #15151a;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 24px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .logo-box:hover {
                    transform: translateY(-2px) rotate(15deg);
                    border-color: #667eea;
                }

                .stat-pill {
                    background: #15151a;
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 10px 24px; border-radius: 14px;
                    font-size: 11px; font-weight: 900; letter-spacing: 2px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                }

                .world-nav-btn {
                    padding: 8px 24px; 
                    background: transparent; border: none;
                    color: rgba(255,255,255,0.3);
                    display: flex; align-items: center; gap: 12px;
                    cursor: pointer; position: relative;
                    transition: all 0.3s; border-radius: 16px;
                }
                .world-nav-btn:hover {
                    color: #fff;
                    background: rgba(255,255,255,0.05);
                }
                .nav-label {
                    font-size: 10px; font-weight: 900; letter-spacing: 2px;
                    text-transform: uppercase;
                }

                .level-node {
                    width: 70px; height: 70px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .node-content {
                    width: 100%; height: 100%;
                    background: rgba(15, 15, 20, 0.95);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    position: relative; z-index: 2;
                }
                .node-glow {
                    position: absolute; inset: -4px;
                    background: var(--node-color);
                    border-radius: 24px; filter: blur(15px);
                    opacity: 0.1; transition: opacity 0.5s;
                }
                .level-node:hover .node-glow { opacity: 0.4; }
                .level-node:hover { transform: translateY(-10px) scale(1.1); }
                .level-node:hover .node-content { border-color: var(--node-color); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

                .level-node.major { width: 90px; height: 90px; }
                .level-node.major .node-content { border-width: 2px; background: linear-gradient(135deg, #1a1a24, #0a0a0f); }

                .node-icon { font-size: 18px; margin-bottom: 2px; }
                .node-id { font-size: 20px; font-weight: 900; color: #fff; line-height: 1; }

                .node-tooltip {
                    position: absolute; bottom: -60px; left: 50%;
                    transform: translateX(-50%) translateY(10px);
                    background: rgba(10,10,15,0.95);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 10px 20px; border-radius: 12px;
                    opacity: 0; pointer-events: none;
                    transition: all 0.3s;
                    white-space: nowrap; z-index: 100;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
                }
                .level-node:hover .node-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }

                .pulsating-path {
                    animation: dash 30s linear infinite;
                }
                @keyframes dash { to { stroke-dashoffset: -1000; } }
            `}} />
        </div>
    );
}

