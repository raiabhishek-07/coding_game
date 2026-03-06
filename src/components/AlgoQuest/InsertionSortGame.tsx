'use client';
import React, { useState, useEffect } from 'react';

function shuffle(arr: number[]): number[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const genArray = () => shuffle([15, 38, 7, 24, 62, 11, 45, 29]);

interface Props { onScore: (pts: number) => void; }

export default function InsertionSortGame({ onScore }: Props) {
    const [arr, setArr] = useState<number[]>([]);
    const [sortedRegion, setSortedRegion] = useState(1); // indices 0 to sortedRegion-1 are "sorted"
    const [pos, setPos] = useState(1); // current position of the element being inserted
    const [comps, setComps] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [violations, setViolations] = useState(0);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err' | 'info'>('info');
    const [done, setDone] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setArr(genArray());
        setMounted(true);
    }, []);

    const n = arr.length;

    const handleSwapLeft = () => {
        if (done) return;
        if (pos === 0) {
            setMsg('❌ Violation: Element is already at the beginning of the array!');
            setMsgType('err'); setViolations(v => v + 1); return;
        }

        const leftVal = arr[pos - 1];
        const currentVal = arr[pos];

        if (leftVal <= currentVal) {
            // Should NOT swap! It's already in the correct relative sorted position.
            setMsg(`❌ Violation: ${leftVal} ≤ ${currentVal}. You shouldn't swap it further left!`);
            setMsgType('err'); setViolations(v => v + 1); return;
        }

        // Correct swap
        const newArr = [...arr];
        [newArr[pos - 1], newArr[pos]] = [newArr[pos], newArr[pos - 1]];
        setArr(newArr);
        setPos(pos - 1);
        setComps(c => c + 1);
        setSwaps(s => s + 1);
        setMsg(`✓ Swapped ${currentVal} left. Compare it with ${newArr[pos - 2] ?? '(Start)'}`);
        setMsgType('ok');
    };

    const handleLeaveHere = () => {
        if (done) return;
        // The user says "It belongs here". Is that correct?
        // It's correct IF pos === 0 OR arr[pos-1] <= arr[pos]
        if (pos > 0 && arr[pos - 1] > arr[pos]) {
            setMsg(`❌ Violation: ${arr[pos - 1]} > ${arr[pos]}. It's not fully inserted! Keep swapping left.`);
            setMsgType('err'); setViolations(v => v + 1); return;
        }

        // Correct! It belongs here.
        setComps(c => c + 1); // Checked the left element

        if (sortedRegion === n - 1) {
            setDone(true);
            setMsg('🎉 Array sorted! You executed Insertion Sort perfectly!');
            setMsgType('ok');
            onScore(120 + Math.max(0, 50 - violations * 5));
        } else {
            const nextRegion = sortedRegion + 1;
            setSortedRegion(nextRegion);
            setPos(nextRegion);
            setMsg(`✅ Placed! Next element to insert is ${arr[nextRegion]}.`);
            setMsgType('ok');
        }
    };

    const reset = () => {
        setArr(genArray()); setSortedRegion(1); setPos(1);
        setComps(0); setSwaps(0); setViolations(0);
        setDone(false); setMsg(''); setMsgType('info');
    };

    if (!mounted) return <div style={{ textAlign: 'center', padding: '100px', color: '#8aa' }}>Generating array...</div>;

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#00c8ff', marginBottom: '8px' }}>
                🃏 Insertion Sort
            </h1>
            <p style={{ fontSize: '13px', color: '#4a8aaa', lineHeight: 1.6, marginBottom: '16px' }}>
                Like sorting playing cards. The left side (green) is your sorted hand. Take the next unsorted card (orange) and <strong style={{ color: '#ff6b35' }}>swap it left</strong> until it's in the right spot!
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', marginBottom: '20px' }}>
                {[
                    { label: 'Cards Sorted', value: `${sortedRegion} / ${n}` },
                    { label: 'Comparisons', value: comps },
                    { label: 'Swaps', value: swaps },
                    { label: 'Violations', value: violations, bad: violations > 0 },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.15)',
                        borderRadius: '8px', padding: '6px 14px', textAlign: 'center',
                    }}>
                        <div style={{ color: '#3a6a8a', fontSize: '10px' }}>{s.label}</div>
                        <div style={{ color: (s as any).bad ? '#ff4757' : '#00c8ff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Array visualization */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
                {arr.map((v, i) => {
                    const isSortedRegion = i < sortedRegion || done;
                    const isActive = i === pos && !done;
                    const isLeftCompare = i === pos - 1 && !done;

                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            {isActive && <div style={{ fontSize: '12px', color: '#ff6b35', animation: 'pulse 1s infinite' }}>▼</div>}
                            <div style={{
                                width: '64px', height: `${30 + v * 1.5}px`,
                                background: done ? '#00d4aa' : isActive ? 'rgba(255,107,53,0.9)' : isSortedRegion ? '#00d4aa44' : '#1a3a5a',
                                border: isActive ? '2px solid #ff6b35' : isLeftCompare ? '2px dashed #00c8ff' : isSortedRegion ? '1px solid #00d4aa22' : '1px solid rgba(0,200,255,0.2)',
                                borderRadius: '6px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#fff',
                                transition: 'all 0.3s ease',
                                boxShadow: isActive ? '0 0 16px #ff6b3566' : isLeftCompare ? '0 0 12px #00c8ff44' : 'none',
                            }}>
                                {v}
                            </div>
                            <div style={{ fontSize: '10px', color: isSortedRegion ? '#00d4aa' : '#3a6a8a' }}>
                                {isSortedRegion && !isActive ? '✓' : `[${i}]`}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action buttons */}
            {!done && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                    <button onClick={handleSwapLeft} style={{
                        background: 'linear-gradient(135deg, #ff6b35, #ff4757)',
                        border: 'none', borderRadius: '10px', padding: '12px 28px',
                        color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    }}>
                        ◀ SWAP Left
                    </button>
                    <button onClick={handleLeaveHere} style={{
                        background: 'linear-gradient(135deg, #00d4aa, #0080aa)',
                        border: 'none', borderRadius: '10px', padding: '12px 28px',
                        color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    }}>
                        ✓ Belongs Here
                    </button>
                </div>
            )}

            {/* Message */}
            {msg && (
                <div style={{
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
                    background: msgType === 'err' ? 'rgba(255,71,87,0.1)' : 'rgba(0,200,255,0.08)',
                    border: `1px solid ${msgType === 'err' ? '#ff475744' : '#00c8ff33'}`,
                    color: msgType === 'err' ? '#ff4757' : '#00d4aa',
                    fontSize: '13px', animation: 'slideIn 0.3s ease',
                }}>
                    {msg}
                </div>
            )}

            {/* Algo tip */}
            <div style={{
                background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.1)',
                borderRadius: '10px', padding: '16px', fontSize: '12px', color: '#3a7a9a', lineHeight: 1.7,
            }}>
                <strong style={{ color: '#00c8ff', display: 'block', marginBottom: '6px' }}>📚 Algorithm Rules</strong>
                1. Take the first unsorted element.<br />
                2. Compare it to the element on its left.<br />
                3. If it is smaller, swap them. Repeat until it's larger than the left element (or at the start).<br />
                <strong style={{ color: '#ffd700' }}>Time: O(n²) &nbsp; Space: O(1) &nbsp; Stable: Yes</strong>
            </div>

            <button onClick={reset} style={{
                marginTop: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: '12px',
            }}>🔄 New Array</button>
        </div>
    );
}
