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

export default function BFSGame({ onScore }: Props) {
    const cells = buildGrid();
    const [visited, setVisited] = useState<number[]>([START]);
    const [queue, setQueue] = useState<number[]>([START]);
    const [order, setOrder] = useState<number[]>([]);    // BFS visit order
    const [steps, setSteps] = useState(0);
    const [violations, setViolations] = useState(0);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err' | 'info'>('info');
    const [done, setDone] = useState(false);

    const frontOfQueue = queue[0];
    // Which nodes can be legally visited next?
    // BFS: dequeue front, visit all its unvisited neighbours in any order
    // We simplify: the player must click an unvisited neighbour of frontOfQueue
    const validNextCells = neighbors(frontOfQueue).filter(n => !visited.includes(n));

    const handleClick = (id: number) => {
        if (done) return;
        // Is it a valid next BFS cell?
        if (visited.includes(id)) {
            setMsg(`Already visited node ${id}!`); setMsgType('err'); return;
        }
        if (!validNextCells.includes(id)) {
            setMsg(`❌ BFS violation! Node ${id} is not adjacent to the current front-of-queue (node ${frontOfQueue}). BFS expands one node at a time from the queue.`);
            setMsgType('err'); setViolations(v => v + 1); return;
        }

        const newVisited = [...visited, id];
        const newOrder = [...order, id];
        const newQueue = [...queue.slice(1), ...neighbors(id).filter(n => !newVisited.includes(n) && !queue.slice(1).includes(n))];
        // Wait — we need to handle the "advance queue front" properly
        // When validNextCells is exhausted for current front, dequeue and move on
        const remainingNeighbours = validNextCells.filter(n => n !== id);

        let finalQueue: number[];
        if (remainingNeighbours.length === 0) {
            // All neighbours of frontOfQueue visited → dequeue
            finalQueue = [...queue.slice(1), id];
            // actually add id first then dequeue remaining with their neighbours
            finalQueue = queue.slice(1).filter(n => !newVisited.includes(n));
            // add unvisited neighbours of id that aren't in queue
            const idNbrs = neighbors(id).filter(n => !newVisited.includes(n) && !finalQueue.includes(n));
            finalQueue = [...finalQueue, ...idNbrs];
        } else {
            finalQueue = [...queue]; // keep front, just added id to visited
            const idNbrs = neighbors(id).filter(n => !newVisited.includes(n) && !finalQueue.includes(n));
            finalQueue = [...finalQueue, ...idNbrs];
        }

        setVisited(newVisited);
        setOrder(newOrder);
        setQueue(finalQueue);
        setSteps(s => s + 1);

        if (newVisited.length === ROWS * COLS) {
            setDone(true);
            setMsg(`🎉 BFS complete! Visited all ${ROWS * COLS} nodes in BFS order.`);
            setMsgType('ok');
            onScore(150 + Math.max(0, 50 - violations * 10));
        } else if (finalQueue.length === 0) {
            setDone(true);
            setMsg('BFS complete — all reachable nodes visited!');
            setMsgType('ok');
            onScore(120);
        } else {
            setMsg(`✓ Visited node ${id}. Queue: [${finalQueue.join(' → ')}]. Next: expand node ${finalQueue[0]}'s neighbours.`);
            setMsgType('ok');
        }
    };

    const reset = () => {
        setVisited([START]); setQueue([START]); setOrder([]);
        setSteps(0); setViolations(0); setDone(false);
        setMsg(''); setMsgType('info');
    };

    const cellColor = (id: number) => {
        if (id === START) return '#ffd700';
        if (id === frontOfQueue && !visited.slice(1).includes(id)) return '#ff6b35';
        if (visited.includes(id)) return '#00d4aa';
        if (queue.includes(id)) return '#9b5de5';
        return '#0d2035';
    };

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#00c8ff', marginBottom: '8px' }}>
                🌊 Breadth-First Search (BFS)
            </h1>
            <p style={{ fontSize: '13px', color: '#4a8aaa', lineHeight: 1.6, marginBottom: '16px' }}>
                Click nodes to visit them. <strong style={{ color: '#ff6b35' }}>Rule:</strong> You can only click
                unvisited neighbours of the <span style={{ color: '#ff6b35', fontWeight: 700 }}>front-of-queue</span> node.
                BFS explores level by level!
            </p>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', fontSize: '11px' }}>
                {[
                    { color: '#ffd700', label: 'Start (0)' },
                    { color: '#ff6b35', label: 'Queue front' },
                    { color: '#00d4aa', label: 'Visited' },
                    { color: '#9b5de5', label: 'In queue' },
                    { color: '#0d2035', label: 'Unvisited' },
                ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '12px', height: '12px', background: l.color, borderRadius: '3px' }} />
                        <span style={{ color: '#4a7a9a' }}>{l.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Grid */}
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 52px)`, gap: '6px' }}>
                        {cells.map(cell => (
                            <div
                                key={cell.id}
                                onClick={() => handleClick(cell.id)}
                                style={{
                                    width: '52px', height: '52px', borderRadius: '8px',
                                    background: cellColor(cell.id),
                                    border: validNextCells.includes(cell.id)
                                        ? '2px solid #00c8ff'
                                        : visited.includes(cell.id) ? '1px solid #00d4aa44' : '1px solid rgba(0,200,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: !visited.includes(cell.id) ? 'pointer' : 'default',
                                    fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono',
                                    color: cellColor(cell.id) === '#0d2035' ? '#3a6a8a' : '#fff',
                                    transition: 'all 0.2s',
                                    boxShadow: validNextCells.includes(cell.id) ? '0 0 12px #00c8ff66' : 'none',
                                    animation: validNextCells.includes(cell.id) ? 'glow 1.5s ease-in-out infinite' : 'none',
                                }}
                            >
                                {cell.id}
                            </div>
                        ))}
                    </div>
                    <div style={{ fontSize: '11px', color: '#2a5a7a', marginTop: '8px', textAlign: 'center' }}>
                        Click glowing nodes to visit them
                    </div>
                </div>

                {/* Queue + Stats */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        background: 'rgba(0,15,30,0.8)', border: '1px solid rgba(0,200,255,0.15)',
                        borderRadius: '10px', padding: '14px', marginBottom: '12px',
                    }}>
                        <div style={{ fontSize: '11px', color: '#3a6a8a', marginBottom: '8px', fontWeight: 700 }}>QUEUE (FIFO)</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', minHeight: '36px' }}>
                            {queue.map((id, qi) => (
                                <div key={qi} style={{
                                    width: '32px', height: '32px', borderRadius: '6px',
                                    background: qi === 0 ? '#ff6b3533' : 'rgba(155,93,229,0.15)',
                                    border: qi === 0 ? '1px solid #ff6b35' : '1px solid #9b5de544',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: 700, color: qi === 0 ? '#ff6b35' : '#9b5de5',
                                    fontFamily: 'JetBrains Mono',
                                }}>{id}</div>
                            ))}
                            {queue.length === 0 && <span style={{ color: '#2a5a7a', fontSize: '12px' }}>Empty</span>}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(0,15,30,0.8)', border: '1px solid rgba(0,200,255,0.15)',
                        borderRadius: '10px', padding: '14px', marginBottom: '12px',
                    }}>
                        <div style={{ fontSize: '11px', color: '#3a6a8a', marginBottom: '8px', fontWeight: 700 }}>VISIT ORDER</div>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#00d4aa' }}>
                            {[START, ...order].join(' → ') || 'Start: 0'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                        {[
                            { label: 'Visited', value: `${visited.length}/${ROWS * COLS}` },
                            { label: 'Steps', value: steps },
                            { label: 'Violations', value: violations, bad: violations > 0 },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.15)',
                                borderRadius: '8px', padding: '6px 12px', textAlign: 'center',
                            }}>
                                <div style={{ color: '#3a6a8a', fontSize: '10px' }}>{s.label}</div>
                                <div style={{ color: (s as { bad?: boolean }).bad ? '#ff4757' : '#00c8ff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {msg && (
                <div style={{
                    padding: '12px 16px', borderRadius: '8px', margin: '16px 0',
                    background: msgType === 'err' ? 'rgba(255,71,87,0.1)' : 'rgba(0,200,255,0.08)',
                    border: `1px solid ${msgType === 'err' ? '#ff475744' : '#00c8ff33'}`,
                    color: msgType === 'err' ? '#ff4757' : '#00d4aa', fontSize: '13px',
                }}>{msg}</div>
            )}

            <div style={{
                background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.1)',
                borderRadius: '10px', padding: '14px', fontSize: '12px', color: '#3a7a9a', lineHeight: 1.7, marginTop: '8px',
            }}>
                <strong style={{ color: '#00c8ff', display: 'block', marginBottom: '4px' }}>📚 Algorithm Rules</strong>
                1. Enqueue start node. Mark as visited.<br />
                2. Dequeue front node. Visit all its unvisited neighbours, enqueue them.<br />
                3. Repeat until queue is empty.<br />
                <strong style={{ color: '#ffd700' }}>Time: O(V+E) &nbsp; Space: O(V) &nbsp; Finds shortest path</strong>
            </div>
            <button onClick={reset} style={{
                marginTop: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: '12px',
            }}>🔄 Reset</button>
        </div>
    );
}
