'use client';
import React, { useState } from 'react';

function genSorted(): number[] {
    const s = new Set<number>();
    while (s.size < 10) s.add(Math.floor(Math.random() * 95) + 3);
    return [...s].sort((a, b) => a - b);
}

interface Props { onScore: (pts: number) => void }

export default function BinarySearchGame({ onScore }: Props) {
    const [arr, setArr] = useState<number[]>([]);
    const [target, setTarget] = useState(0);
    const [lo, setLo] = useState(0);
    const [hi, setHi] = useState(9);
    const [steps, setSteps] = useState(0);
    const [violations, setViolations] = useState(0);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err' | 'info'>('info');
    const [done, setDone] = useState(false);
    const [foundAt, setFoundAt] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        const a = genSorted();
        setArr(a);
        setTarget(a[Math.floor(Math.random() * a.length)]);
        setMounted(true);
    }, []);


    const mid = Math.floor((lo + hi) / 2);

    const reset = () => {
        const a = genSorted();
        const t = a[Math.floor(Math.random() * a.length)];
        setArr(a); setTarget(t); setLo(0); setHi(9);
        setSteps(0); setViolations(0); setDone(false);
        setFoundAt(null); setMsg(''); setMsgType('info');
    };

    const handleChoice = (choice: 'left' | 'mid' | 'right') => {
        if (done) return;
        const midVal = arr[mid];
        const newSteps = steps + 1;
        setSteps(newSteps);

        if (midVal === target) {
            if (choice === 'mid') {
                setFoundAt(mid);
                setDone(true);
                setMsg(`🎉 Found ${target} at index ${mid} in ${newSteps} steps!`);
                setMsgType('ok');
                onScore(100 + (10 - newSteps) * 10);
            } else {
                setMsg(`❌ The middle element IS ${target}! Click "Middle = Target" when you found it.`);
                setMsgType('err'); setViolations(v => v + 1);
            }
            return;
        }

        if (choice === 'mid') {
            setMsg(`❌ arr[mid] = ${midVal} ≠ ${target}. It's not the middle element!`);
            setMsgType('err'); setViolations(v => v + 1); return;
        }

        if (target < midVal) {
            // Correct choice: go left
            if (choice === 'left') {
                const newHi = mid - 1;
                setHi(newHi);
                if (newHi < lo) { setDone(true); setMsg(`Target ${target} not in array!`); setMsgType('err'); return; }
                setMsg(`✓ ${target} < ${midVal} → search LEFT half [${lo}…${newHi}]. New mid = ${Math.floor((lo + newHi) / 2)}`);
                setMsgType('ok');
            } else {
                setMsg(`❌ Wrong! ${target} < ${midVal} → you must go LEFT, not right!`);
                setMsgType('err'); setViolations(v => v + 1);
            }
        } else {
            // Correct choice: go right
            if (choice === 'right') {
                const newLo = mid + 1;
                setLo(newLo);
                if (newLo > hi) { setDone(true); setMsg(`Target ${target} not in array!`); setMsgType('err'); return; }
                setMsg(`✓ ${target} > ${midVal} → search RIGHT half [${newLo}…${hi}]. New mid = ${Math.floor((newLo + hi) / 2)}`);
                setMsgType('ok');
            } else {
                setMsg(`❌ Wrong! ${target} > ${midVal} → you must go RIGHT, not left!`);
                setMsgType('err'); setViolations(v => v + 1);
            }
        }
    };

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {!mounted ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#8aa' }}>Generating array...</div>
            ) : (
                <>
                    <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#00c8ff', marginBottom: '8px' }}>
                        🔍 Binary Search
                    </h1>
                    <p style={{ fontSize: '13px', color: '#4a8aaa', lineHeight: 1.6, marginBottom: '16px' }}>
                        Find <span style={{ color: '#ffd700', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: '16px' }}>
                            {target}
                        </span> in the sorted array. Each step: look at the <strong style={{ color: '#ff6b35' }}>middle</strong>,
                        eliminate the wrong half. O(log n) = at most {Math.ceil(Math.log2(arr.length))} steps!
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', fontSize: '11px' }}>
                        {[
                            { label: 'Target', value: target, color: '#ffd700' },
                            { label: 'Steps', value: steps },
                            { label: 'Search range', value: `[${lo}…${hi}]` },
                            { label: 'Middle idx', value: mid, color: '#ff6b35' },
                            { label: 'Violations', value: violations, bad: violations > 0 },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.15)',
                                borderRadius: '8px', padding: '6px 14px', textAlign: 'center',
                            }}>
                                <div style={{ color: '#3a6a8a', fontSize: '10px' }}>{s.label}</div>
                                <div style={{ color: (s as { bad?: boolean; color?: string }).bad ? '#ff4757' : (s as { color?: string }).color || '#00c8ff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{s.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Array display */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        {arr.map((v, i) => {
                            const isActive = i >= lo && i <= hi;
                            const isMid = i === mid && !done;
                            const isFound = i === foundAt;
                            return (
                                <div key={i} style={{
                                    width: '58px', textAlign: 'center',
                                    opacity: isActive ? 1 : 0.25,
                                    transition: 'all 0.4s',
                                }}>
                                    <div style={{
                                        height: '48px', borderRadius: '8px',
                                        background: isFound ? '#00d4aa22' : isMid ? 'rgba(255,107,53,0.2)' : isActive ? 'rgba(0,200,255,0.08)' : '#0d2035',
                                        border: isFound ? '2px solid #00d4aa' : isMid ? '2px solid #ff6b35' : isActive ? '1px solid rgba(0,200,255,0.3)' : '1px solid transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: '15px',
                                        color: isFound ? '#00d4aa' : isMid ? '#ff6b35' : '#e0f0ff',
                                        boxShadow: isMid ? '0 0 14px #ff6b3566' : 'none',
                                    }}>{v}</div>
                                    <div style={{ fontSize: '9px', color: isMid ? '#ff6b35' : '#2a5a7a', marginTop: '3px' }}>
                                        {isMid ? '▲ mid' : `[${i}]`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Decision buttons */}
                    {!done && (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '13px', color: '#4a8aaa' }}>
                                Middle element is <span style={{ color: '#ff6b35', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{arr[mid]}</span>.
                                Your target is <span style={{ color: '#ffd700', fontWeight: 700 }}>{target}</span>.
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                                <button onClick={() => handleChoice('left')} style={{
                                    background: 'linear-gradient(135deg, #9b5de5, #6a1aaa)',
                                    border: 'none', borderRadius: '10px', padding: '12px 20px',
                                    color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px',
                                }}>◀ Go LEFT half<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>target &lt; middle</span></button>
                                <button onClick={() => handleChoice('mid')} style={{
                                    background: 'linear-gradient(135deg, #00d4aa, #007a55)',
                                    border: 'none', borderRadius: '10px', padding: '12px 20px',
                                    color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px',
                                }}>✓ Found it!<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>middle = target</span></button>
                                <button onClick={() => handleChoice('right')} style={{
                                    background: 'linear-gradient(135deg, #ff6b35, #cc3300)',
                                    border: 'none', borderRadius: '10px', padding: '12px 20px',
                                    color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px',
                                }}>Go RIGHT half ▶<br /><span style={{ fontSize: '10px', opacity: 0.8 }}>target &gt; middle</span></button>
                            </div>
                        </>
                    )}

                    {msg && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
                            background: msgType === 'err' ? 'rgba(255,71,87,0.1)' : 'rgba(0,200,255,0.08)',
                            border: `1px solid ${msgType === 'err' ? '#ff475744' : '#00c8ff33'}`,
                            color: msgType === 'err' ? '#ff4757' : '#00d4aa', fontSize: '13px',
                        }}>{msg}</div>
                    )}

                    <div style={{
                        background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.1)',
                        borderRadius: '10px', padding: '14px', fontSize: '12px', color: '#3a7a9a', lineHeight: 1.7,
                    }}>
                        <strong style={{ color: '#00c8ff', display: 'block', marginBottom: '4px' }}>📚 Algorithm Rules</strong>
                        1. Find mid = ⌊(lo + hi) / 2⌋<br />
                        2. If arr[mid] == target → FOUND!<br />
                        3. If target &lt; arr[mid] → hi = mid - 1 (search left)<br />
                        4. If target &gt; arr[mid] → lo = mid + 1 (search right)<br />
                        <strong style={{ color: '#ffd700' }}>Time: O(log n) &nbsp; Space: O(1) &nbsp; Requires sorted array</strong>
                    </div>
                    <button onClick={reset} style={{
                        marginTop: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: '12px',
                    }}>🔄 New Game</button>
                </>
            )}
        </div>
    );
}
