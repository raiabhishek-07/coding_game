'use client';
import React, { useState } from 'react';

// Small 5×5 grid graph adjacency
const ROWS = 5, COLS = 5;
const START = 0;

type Cell = { id: number; row: number; col: number };

function buildGrid(): Cell[] {
    return Array.from({ length: ROWS * COLS }, (_, i) => ({
        id: i, row: Math.floor(i / COLS), col: i % COLS,
    }));
}

function neighbors(id: number): number[] {
    const row = Math.floor(id / COLS), col = id % COLS;
    const nbrs: number[] = [];
    if (row > 0) nbrs.push((row - 1) * COLS + col);
    if (row < ROWS - 1) nbrs.push((row + 1) * COLS + col);
    if (col > 0) nbrs.push(row * COLS + col - 1);
    if (col < COLS - 1) nbrs.push(row * COLS + col + 1);
    return nbrs;
}

interface Props { onScore: (pts: number) => void }

export default function DFSGame({ onScore }: Props) {
    const cells = buildGrid();
    const [visited, setVisited] = useState<number[]>([START]);
    const [stack, setStack] = useState<number[]>([START]);
    const [order, setOrder] = useState<number[]>([]);    // DFS visit order
    const [steps, setSteps] = useState(0);
    const [violations, setViolations] = useState(0);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err' | 'info'>('info');
    const [done, setDone] = useState(false);

    const topOfStack = stack[stack.length - 1]; // Current node we are at

    // DFS Valid Moves: Must select an UNVISITED neighbor of the current node (topOfStack).
    const validNextCells = topOfStack !== undefined
        ? neighbors(topOfStack).filter(n => !visited.includes(n))
        : [];

    const handleBacktrack = () => {
        if (done) return;
        if (stack.length <= 1) {
            setMsg(`❌ Cannot backtrack from the start node!`); setMsgType('err'); return;
        }

        // Check if we ACTUALLY need to backtrack (are there unvisited neighbors?)
        if (validNextCells.length > 0) {
            setMsg(`❌ DFSViolation: Node ${topOfStack} still has unvisited neighbors! You must plunge deeper before backtracking.`);
            setMsgType('err'); setViolations(v => v + 1); return;
        }

        // Correct Backtrack
        const popped = stack[stack.length - 1];
        setStack(stack.slice(0, -1));
        setSteps(s => s + 1);
        setMsg(`✓ Dead end reached! Backtracked from ${popped} to node ${stack[stack.length - 2]}.`);
        setMsgType('info');
    };

    const handleClickNode = (id: number) => {
        if (done) return;

        if (visited.includes(id)) {
            setMsg(`Already visited node ${id}!`); setMsgType('err'); return;
        }

        // Cannot click a node if it is not a direct neighbor of the top of the stack
        if (!validNextCells.includes(id)) {
            setMsg(`❌ DFS violation! Node ${id} is not an unvisited neighbor of current node (${topOfStack}). DFS explores paths deeply.`);
            setMsgType('err'); setViolations(v => v + 1); return;
        }

        const newVisited = [...visited, id];
        const newOrder = [...order, id];
        const newStack = [...stack, id];

        setVisited(newVisited);
        setOrder(newOrder);
        setStack(newStack);
        setSteps(s => s + 1);

        if (newVisited.length === ROWS * COLS) {
            setDone(true);
            setMsg(`🎉 DFS complete! Visited all ${ROWS * COLS} nodes in DFS order.`);
            setMsgType('ok');
            onScore(150 + Math.max(0, 50 - violations * 10));
        } else {
            setMsg(`✓ Visited node ${id}. Deepened the search. (Stack Size: ${newStack.length})`);
            setMsgType('ok');
        }
    };

    const reset = () => {
        setVisited([START]); setStack([START]); setOrder([]);
        setSteps(0); setViolations(0); setDone(false);
        setMsg(''); setMsgType('info');
    };

    const cellColor = (id: number) => {
        if (id === START) return '#ffd700'; // Target/Start
        if (id === topOfStack) return '#ff1a75'; // Current pos
        if (stack.includes(id) && id !== topOfStack) return '#d4006c'; // Backtrack path
        if (visited.includes(id)) return '#444'; // Dead ends
        return '#0d2035'; // Unvisited
    };

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#ff1a75', marginBottom: '8px' }}>
                🕸️ Depth-First Search (DFS)
            </h1>
            <p style={{ fontSize: '13px', color: '#8a6a7a', lineHeight: 1.6, marginBottom: '16px' }}>
                Plunge deeply into the maze! Click an unvisited adjoining node to go <strong>deeper</strong>. If you hit a dead end, you must <strong style={{ color: '#d4006c' }}>Backtrack</strong> using the button.
            </p>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', fontSize: '11px' }}>
                {[
                    { color: '#ffd700', label: 'Start (0)' },
                    { color: '#ff1a75', label: 'Current Node' },
                    { color: '#d4006c', label: 'Call Stack' },
                    { color: '#444', label: 'Dead Path (Visited)' },
                    { color: '#0d2035', label: 'Unvisited' },
                ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '12px', height: '12px', background: l.color, borderRadius: '3px' }} />
                        <span style={{ color: '#7a5a6a' }}>{l.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Grid Area */}
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 52px)`, gap: '6px' }}>
                        {cells.map(cell => (
                            <div
                                key={cell.id}
                                onClick={() => handleClickNode(cell.id)}
                                style={{
                                    width: '52px', height: '52px', borderRadius: '8px',
                                    background: cellColor(cell.id),
                                    border: validNextCells.includes(cell.id)
                                        ? '2px solid #ff1a75'
                                        : visited.includes(cell.id) ? '1px solid #5a3a4a' : '1px solid rgba(255,26,117,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: validNextCells.includes(cell.id) ? 'pointer' : 'default',
                                    fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono',
                                    color: cellColor(cell.id) === '#0d2035' ? '#5a2a4a' : '#fff',
                                    transition: 'all 0.2s',
                                    boxShadow: validNextCells.includes(cell.id) ? '0 0 12px #ff1a7588' : 'none',
                                    animation: validNextCells.includes(cell.id) ? 'glowDFS 1.5s ease-in-out infinite' : 'none',
                                }}
                            >
                                {cell.id}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                        <button onClick={handleBacktrack} disabled={done || validNextCells.length > 0 || stack.length <= 1} style={{
                            background: 'rgba(212,0,108,0.1)', border: '1px solid #d4006c', borderRadius: '8px',
                            padding: '10px 24px', color: '#ff1a75', fontSize: '13px', fontWeight: 700, cursor: (done || validNextCells.length > 0 || stack.length <= 1) ? 'not-allowed' : 'pointer',
                            opacity: (done || validNextCells.length > 0 || stack.length <= 1) ? 0.3 : 1, transition: 'all 0.2s'
                        }}>
                            ↩️ Backtrack (Pop Stack)
                        </button>
                    </div>
                </div>

                {/* Call Stack + Stats */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        background: 'rgba(20,5,10,0.8)', border: '1px solid rgba(255,26,117,0.15)',
                        borderRadius: '10px', padding: '14px', marginBottom: '12px',
                    }}>
                        <div style={{ fontSize: '11px', color: '#b46a8a', marginBottom: '8px', fontWeight: 700 }}>CALL STACK (FILO)</div>
                        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                            {stack.map((id, qi) => (
                                <div key={qi} style={{
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: qi === stack.length - 1 ? 'rgba(255,26,117,0.2)' : 'rgba(212,0,108,0.1)',
                                    border: qi === stack.length - 1 ? '1px solid #ff1a75' : '1px solid rgba(212,0,108,0.2)',
                                    fontSize: '12px', fontWeight: qi === stack.length - 1 ? 700 : 500, color: qi === stack.length - 1 ? '#ff1a75' : '#c46a8a',
                                    fontFamily: 'JetBrains Mono', display: 'flex', justifyContent: 'space-between',
                                }}>
                                    <span>Node {id}</span>
                                    {qi === stack.length - 1 && <span style={{ fontSize: '10px' }}>&lt;-- TOP</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Visited', value: `${visited.length}/${ROWS * COLS}` },
                            { label: 'Steps', value: steps },
                            { label: 'Violations', value: violations, bad: violations > 0 },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'rgba(255,26,117,0.06)', border: '1px solid rgba(255,26,117,0.15)',
                                borderRadius: '8px', padding: '6px 12px', textAlign: 'center', flex: 1, minWidth: '60px'
                            }}>
                                <div style={{ color: '#b46a8a', fontSize: '10px' }}>{s.label}</div>
                                <div style={{ color: (s as { bad?: boolean }).bad ? '#ff4757' : '#ff1a75', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {msg && (
                <div style={{
                    padding: '12px 16px', borderRadius: '8px', margin: '16px 0',
                    background: msgType === 'err' ? 'rgba(255,71,87,0.1)' : 'rgba(255,26,117,0.08)',
                    border: `1px solid ${msgType === 'err' ? '#ff475744' : '#ff1a7533'}`,
                    color: msgType === 'err' ? '#ff4757' : '#ff1a75', fontSize: '13px',
                }}>{msg}</div>
            )}

            <div style={{
                background: 'rgba(255,26,117,0.04)', border: '1px solid rgba(255,26,117,0.1)',
                borderRadius: '10px', padding: '14px', fontSize: '12px', color: '#b46a8a', lineHeight: 1.7, marginTop: '8px',
            }}>
                <strong style={{ color: '#ff1a75', display: 'block', marginBottom: '4px' }}>📚 Algorithm Rules</strong>
                1. Push start node to Call Stack.<br />
                2. Pick any unvisited neighbor, push it to stack, mark visited. Go deeper!<br />
                3. If no unvisited neighbors (dead end), <strong>Backtrack</strong> (pop stack) until an unvisited neighbor exists.<br />
                <strong style={{ color: '#ffd700' }}>Time: O(V+E) &nbsp; Space: O(V)</strong>
            </div>

            <button onClick={reset} style={{
                marginTop: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: '12px',
            }}>🔄 Reset</button>

            <style>{`
        @keyframes glowDFS { 0%,100%{box-shadow:0 0 12px #ff1a7566} 50%{box-shadow:0 0 24px #ff1a75bb} }
      `}</style>
        </div>
    );
}
