'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BubbleSortGame from '@/components/AlgoQuest/BubbleSortGame';
import SelectionSortGame from '@/components/AlgoQuest/SelectionSortGame';
import BinarySearchGame from '@/components/AlgoQuest/BinarySearchGame';
import BFSGame from '@/components/AlgoQuest/BFSGame';
import InsertionSortGame from '@/components/AlgoQuest/InsertionSortGame';
import TwoPointersGame from '@/components/AlgoQuest/TwoPointersGame';
import DFSGame from '@/components/AlgoQuest/DFSGame';

const ALGOS = [
    { id: 'bubble', label: 'Bubble Sort', icon: '🫧', category: 'Sorting', desc: 'Compare & swap adjacent elements' },
    { id: 'selection', label: 'Selection Sort', icon: '🎯', category: 'Sorting', desc: 'Find minimum, place at front' },
    { id: 'insertion', label: 'Insertion Sort', icon: '🃏', category: 'Sorting', desc: 'Insert element into sorted area' },
    { id: 'binary', label: 'Binary Search', icon: '🔍', category: 'Searching', desc: 'Eliminate half the array each step' },
    { id: 'twopointers', label: 'Two Pointers', icon: '↔️', category: 'Searching', desc: 'Find target sum efficiently' },
    { id: 'bfs', label: 'BFS', icon: '🌊', category: 'Graph', desc: 'Visit nodes level by level' },
    { id: 'dfs', label: 'DFS Maze', icon: '🕸️', category: 'Graph', desc: 'Plunge deep, then backtrack' },
];

export default function AlgoQuestPage() {
    const router = useRouter();
    const [selected, setSelected] = useState('bubble');
    const [score, setScore] = useState(0);

    const categories = [...new Set(ALGOS.map(a => a.category))];

    return (
        <div style={{
            minHeight: '100vh', background: '#04070f', color: '#e0f0ff',
            fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column',
        }}>
            {/* Top Bar */}
            <div style={{
                height: '52px', background: 'rgba(0,20,40,0.95)',
                borderBottom: '1px solid rgba(0,200,255,0.15)',
                display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px',
                backdropFilter: 'blur(10px)', flexShrink: 0,
            }}>
                <button onClick={() => router.push('/')} style={{
                    background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px', padding: '4px 10px', color: '#888',
                    cursor: 'pointer', fontSize: '12px',
                }}>← Back</button>
                <span style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#00c8ff' }}>
                    AlgoQuest
                </span>
                <span style={{ fontSize: '11px', color: '#4a7a9b' }}>Algorithm Training Grounds</span>
                <div style={{ flex: 1 }} />
                <div style={{
                    background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)',
                    borderRadius: '8px', padding: '4px 12px', fontSize: '12px', color: '#00c8ff',
                }}>⭐ Score: {score}</div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{
                    width: '220px', background: 'rgba(0,15,30,0.8)',
                    borderRight: '1px solid rgba(0,200,255,0.1)',
                    padding: '16px 0', flexShrink: 0, overflowY: 'auto',
                }}>
                    {categories.map(cat => (
                        <div key={cat}>
                            <div style={{
                                fontSize: '9px', fontWeight: 700, color: '#2a5a7a',
                                padding: '8px 16px 4px', letterSpacing: '2px', textTransform: 'uppercase',
                            }}>{cat}</div>
                            {ALGOS.filter(a => a.category === cat).map(algo => (
                                <button
                                    key={algo.id}
                                    onClick={() => setSelected(algo.id)}
                                    style={{
                                        width: '100%', background: selected === algo.id
                                            ? 'rgba(0,200,255,0.12)' : 'transparent',
                                        border: 'none',
                                        borderLeft: selected === algo.id ? '3px solid #00c8ff' : '3px solid transparent',
                                        padding: '10px 16px', cursor: 'pointer',
                                        textAlign: 'left', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                    }}
                                >
                                    <span style={{ fontSize: '18px' }}>{algo.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: selected === algo.id ? '#00c8ff' : '#8ab' }}>{algo.label}</div>
                                        <div style={{ fontSize: '9px', color: '#3a6a8a', marginTop: '2px' }}>{algo.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Main Game Area */}
                <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                    {selected === 'bubble' && <BubbleSortGame onScore={pts => setScore(s => s + pts)} />}
                    {selected === 'selection' && <SelectionSortGame onScore={pts => setScore(s => s + pts)} />}
                    {selected === 'insertion' && <InsertionSortGame onScore={pts => setScore(s => s + pts)} />}
                    {selected === 'binary' && <BinarySearchGame onScore={pts => setScore(s => s + pts)} />}
                    {selected === 'twopointers' && <TwoPointersGame onScore={pts => setScore(s => s + pts)} />}
                    {selected === 'bfs' && <BFSGame onScore={pts => setScore(s => s + pts)} />}
                    {selected === 'dfs' && <DFSGame onScore={pts => setScore(s => s + pts)} />}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes slideIn { from { transform:translateY(-10px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 8px #00c8ff44} 50%{box-shadow:0 0 24px #00c8ffaa} }
      `}</style>
        </div>
    );
}
