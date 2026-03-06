'use client';
import React, { useState } from 'react';

function shuffle(arr: number[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
const genArray = () => shuffle([8, 33, 17, 52, 4, 28, 61, 19]);

interface Props { onScore: (pts: number) => void }

export default function SelectionSortGame({ onScore }: Props) {
    const [arr, setArr] = useState<number[]>([]);
    const [sortedCount, setSortedCount] = useState(0);       // how many are sorted at front
    const [minIdx, setMinIdx] = useState<number | null>(null); // user-selected min so far
    const [scanned, setScanned] = useState<number[]>([]);    // which positions user has clicked
    const [phase, setPhase] = useState<'scan' | 'place'>('scan'); // scan = find min; place = click to swap
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err' | 'info'>('info');
    const [done, setDone] = useState(false);
    const [comps, setComps] = useState(0);
    const [violations, setViolations] = useState(0);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setArr(genArray());
        setMounted(true);
    }, []);

    const n = arr.length;

    const reset = () => {
        setArr(genArray()); setSortedCount(0); setMinIdx(null);
        setScanned([]); setPhase('scan'); setDone(false);
        setMsg(''); setMsgType('info'); setComps(0); setViolations(0);
    };

    // User clicks a box in scan phase → advancing their "current minimum" candidate
    const handleScan = (i: number) => {
        if (done || phase !== 'scan') return;
        if (scanned.includes(i)) {
            setMsg('Already scanned this position!'); setMsgType('err'); return;
        }
        const newScanned = [...scanned, i];
        setScanned(newScanned);
        setComps(c => c + 1);

        // Update minimum candidate
        const newMin = minIdx === null ? i : (arr[i] < arr[minIdx] ? i : minIdx);
        setMinIdx(newMin);

        // Have they scanned all unsorted positions?
        const unsortedPositions = Array.from({ length: n - sortedCount }, (_, k) => sortedCount + k);
        const allScanned = unsortedPositions.every(p => newScanned.includes(p));

        if (allScanned) {
            setPhase('place');
            setMsg(`✅ Found minimum: ${arr[newMin]} at position ${newMin}. Now click position ${sortedCount} to place it there.`);
            setMsgType('ok');
        } else {
            const remaining = unsortedPositions.filter(p => !newScanned.includes(p));
            setMsg(`Scanning… current min = ${arr[newMin]}. ${remaining.length} more positions to check.`);
            setMsgType('info');
        }
    };

    // User clicks a box in place phase → must click sortedCount position
    const handlePlace = (i: number) => {
        if (done || phase !== 'place') return;
        if (i !== sortedCount) {
            setMsg(`❌ Wrong! Selection Sort places the minimum at position ${sortedCount} (the next unsorted slot).`);
            setMsgType('err'); setViolations(v => v + 1); return;
        }
        // Swap min to front
        const newArr = [...arr];
        [newArr[sortedCount], newArr[minIdx!]] = [newArr[minIdx!], newArr[sortedCount]];
        setArr(newArr);
        const newSorted = sortedCount + 1;
        setSortedCount(newSorted);
        setMinIdx(null);
        setScanned([]);
        setPhase('scan');

        if (newSorted >= n - 1) {
            setDone(true);
            setMsg('🎉 Sorted! You executed Selection Sort correctly!');
            setMsgType('ok');
            onScore(100 + Math.max(0, 50 - violations * 5));
        } else {
            setMsg(`↕ Swapped! ${arr[minIdx!]} is now in place. Round ${newSorted + 1}: find the minimum in positions ${newSorted}–${n - 1}.`);
            setMsgType('ok');
        }
    };

    const handleClick = (i: number) => {
        if (i < sortedCount) {
            setMsg('That position is already sorted!'); setMsgType('err'); return;
        }
        if (phase === 'scan') handleScan(i);
        else handlePlace(i);
    };

    const boxBorder = (i: number) => {
        if (i < sortedCount) return '2px solid #00d4aa';
        if (phase === 'place' && i === sortedCount) return '2px solid #ffd700';
        if (i === minIdx) return '2px solid #ff6b35';
        if (scanned.includes(i)) return '1px solid rgba(0,200,255,0.3)';
        return '1px solid rgba(0,200,255,0.1)';
    };
    const boxBg = (i: number) => {
        if (i < sortedCount) return '#00d4aa22';
        if (phase === 'place' && i === sortedCount) return 'rgba(255,215,0,0.12)';
        if (i === minIdx) return 'rgba(255,107,53,0.15)';
        if (scanned.includes(i)) return 'rgba(0,200,255,0.08)';
        return '#0d2035';
    };

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {!mounted ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#8aa' }}>Generating array...</div>
            ) : (
                <>
                    <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#00c8ff', marginBottom: '8px' }}>
                        🎯 Selection Sort
                    </h1>
                    <p style={{ fontSize: '13px', color: '#4a8aaa', lineHeight: 1.6, marginBottom: '12px' }}>
                        <strong style={{ color: '#00c8ff' }}>Phase 1:</strong> Click every unsorted box to scan it and track the minimum.
                        <strong style={{ color: '#ffd700' }}> Phase 2:</strong> Click the target slot to place the minimum there.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', marginBottom: '20px' }}>
                        {[
                            { label: 'Round', value: `${sortedCount + 1} / ${n}` },
                            { label: 'Phase', value: phase === 'scan' ? '🔍 Scan' : '📍 Place' },
                            { label: 'Comparisons', value: comps },
                            { label: 'Violations', value: violations, bad: violations > 0 },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.15)',
                                borderRadius: '8px', padding: '6px 14px', textAlign: 'center',
                            }}>
                                <div style={{ color: '#3a6a8a', fontSize: '10px' }}>{s.label}</div>
                                <div style={{ color: (s as { bad?: boolean }).bad ? '#ff4757' : '#00c8ff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{s.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '11px' }}>
                        {[
                            { color: '#00d4aa', label: 'Sorted' },
                            { color: '#ff6b35', label: 'Current Min' },
                            { color: '#00c8ff', label: 'Scanned' },
                            { color: '#ffd700', label: 'Target slot' },
                        ].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '12px', height: '12px', background: l.color, borderRadius: '3px' }} />
                                <span style={{ color: '#4a7a9a' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Array */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {arr.map((v, i) => (
                            <div
                                key={i}
                                onClick={() => handleClick(i)}
                                style={{
                                    width: '68px', height: '68px',
                                    background: boxBg(i),
                                    border: boxBorder(i),
                                    borderRadius: '10px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    cursor: i >= sortedCount ? 'pointer' : 'default',
                                    transition: 'all 0.2s', fontSize: '20px', fontWeight: 700,
                                    fontFamily: 'JetBrains Mono', color: '#e0f0ff',
                                }}
                            >
                                {v}
                                <div style={{ fontSize: '9px', color: '#3a6a8a', marginTop: '2px' }}>pos {i}</div>
                            </div>
                        ))}
                    </div>

                    {/* Message */}
                    {msg && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
                            background: msgType === 'err' ? 'rgba(255,71,87,0.1)' : msgType === 'ok' ? 'rgba(0,200,255,0.08)' : 'rgba(255,215,0,0.06)',
                            border: `1px solid ${msgType === 'err' ? '#ff475744' : msgType === 'ok' ? '#00c8ff33' : '#ffd70033'}`,
                            color: msgType === 'err' ? '#ff4757' : msgType === 'ok' ? '#00d4aa' : '#ffd700',
                            fontSize: '13px',
                        }}>{msg}</div>
                    )}

                    <div style={{
                        background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.1)',
                        borderRadius: '10px', padding: '14px', fontSize: '12px', color: '#3a7a9a', lineHeight: 1.7,
                    }}>
                        <strong style={{ color: '#00c8ff', display: 'block', marginBottom: '4px' }}>📚 Algorithm Rules</strong>
                        Each round: scan ALL unsorted positions to find the minimum → swap minimum to the front of unsorted region.<br />
                        <strong style={{ color: '#ffd700' }}>Time: O(n²) &nbsp; Space: O(1) &nbsp; Stable: No &nbsp; Swaps: O(n)</strong>
                    </div>
                    <button onClick={reset} style={{
                        marginTop: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: '12px',
                    }}>🔄 New Array</button>
                </>
            )}
        </div>
    );
}
