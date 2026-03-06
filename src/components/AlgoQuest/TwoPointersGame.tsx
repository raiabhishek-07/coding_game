'use client';
import React, { useState, useEffect } from 'react';

function genSortedArray(): number[] {
    const s = new Set<number>();
    while (s.size < 12) s.add(Math.floor(Math.random() * 50) + 1);
    return [...s].sort((a, b) => a - b);
}

interface Props { onScore: (pts: number) => void; }

export default function TwoPointersGame({ onScore }: Props) {
    const [arr, setArr] = useState<number[]>([]);
    const [target, setTarget] = useState(0);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(11); // arr.length - 1
    const [violations, setViolations] = useState(0);
    const [steps, setSteps] = useState(0);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err' | 'info'>('info');
    const [done, setDone] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const newArr = genSortedArray();
        setArr(newArr);

        // Pick a guaranteed valid target for demonstration purposes
        const randL = Math.floor(Math.random() * 5);
        const randR = Math.floor(Math.random() * 5) + 6;
        setTarget(newArr[randL] + newArr[randR]);
        setMounted(true);
    }, []);

    const n = arr.length;
    const currentSum = arr[left] + arr[right] || 0;

    const handleMoveLeftPointer = () => {
        if (done) return;
        if (currentSum > target) {
            setMsg(`❌ Violation: Sum (${currentSum}) > Target (${target}). You should decrease the sum by moving the RIGHT pointer leftward.`);
            setMsgType('err'); setViolations(v => v + 1); return; // Wrong move!
        }

        // Correct Move
        setLeft(l => l + 1);
        setSteps(s => s + 1);
        setMsg(`✓ Moved left pointer right to increase sum. (Old sum: ${currentSum})`);
        setMsgType('ok');
    };

    const handleMoveRightPointer = () => {
        if (done) return;
        if (currentSum < target) {
            setMsg(`❌ Violation: Sum (${currentSum}) < Target (${target}). You should increase the sum by moving the LEFT pointer rightward.`);
            setMsgType('err'); setViolations(v => v + 1); return; // Wrong move!
        }

        // Correct Move
        setRight(r => r - 1);
        setSteps(s => s + 1);
        setMsg(`✓ Moved right pointer left to decrease sum. (Old sum: ${currentSum})`);
        setMsgType('ok');
    };

    const handleCheckMatch = () => {
        if (done) return;
        if (currentSum === target) {
            setDone(true);
            setMsg(`🎉 Found target sum: ${arr[left]} + ${arr[right]} = ${target}! Executed perfectly.`);
            setMsgType('ok');
            onScore(150 + Math.max(0, 50 - violations * 10));
        } else {
            setMsg(`❌ Violation: Doesn't match! The sum is ${currentSum}, target is ${target}. Keep moving pointers.`);
            setMsgType('err'); setViolations(v => v + 1);
        }
    };

    const reset = () => {
        const newArr = genSortedArray();
        setArr(newArr);
        const randL = Math.floor(Math.random() * 5);
        const randR = Math.floor(Math.random() * 5) + 6;
        setTarget(newArr[randL] + newArr[randR]);

        setLeft(0); setRight(11);
        setViolations(0); setSteps(0);
        setDone(false); setMsg(''); setMsgType('info');
    };

    if (!mounted) return <div style={{ textAlign: 'center', padding: '100px', color: '#8aa' }}>Generating array...</div>;

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#00c8ff', marginBottom: '8px' }}>
                ↔️ Two Pointers (Target Sum)
            </h1>
            <p style={{ fontSize: '13px', color: '#4a8aaa', lineHeight: 1.6, marginBottom: '16px' }}>
                You have a SORTED array. Find the two numbers that add up to the <strong style={{ color: '#ffd700' }}>Target</strong>.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', marginBottom: '20px' }}>
                {[
                    { label: 'Target Sum', value: target, color: '#ffd700' },
                    { label: 'Current Sum', value: currentSum, color: currentSum === target ? '#00d4aa' : '#e0f0ff' },
                    { label: 'Steps', value: steps },
                    { label: 'Violations', value: violations, bad: violations > 0 },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.15)',
                        borderRadius: '8px', padding: '6px 14px', textAlign: 'center',
                    }}>
                        <div style={{ color: '#3a6a8a', fontSize: '10px' }}>{s.label}</div>
                        <div style={{ color: (s as any).bad ? '#ff4757' : (s as any).color || '#00c8ff', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: '14px' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Array visualization */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {arr.map((v, i) => {
                    const isLeft = i === left;
                    const isRight = i === right;
                    const inRange = i > left && i < right;
                    const isDoneMatch = done && (isLeft || isRight);

                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ fontSize: '12px', color: isLeft ? '#ff6b35' : isRight ? '#9b5de5' : 'transparent', fontWeight: 700, minHeight: '16px' }}>
                                {isLeft ? 'L ▼' : isRight ? 'R ▼' : ''}
                            </div>
                            <div style={{
                                width: '50px', height: '50px',
                                background: isDoneMatch ? '#00d4aa22' : isLeft ? 'rgba(255,107,53,0.15)' : isRight ? 'rgba(155,93,229,0.15)' : inRange ? 'transparent' : 'rgba(255,255,255,0.02)',
                                border: isDoneMatch ? '2px solid #00d4aa' : isLeft ? '2px solid #ff6b35' : isRight ? '2px solid #9b5de5' : inRange ? '1px solid rgba(0,200,255,0.2)' : '1px solid transparent',
                                borderRadius: '6px', opacity: inRange || isLeft || isRight ? 1 : 0.3,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '16px', fontWeight: 700, fontFamily: 'JetBrains Mono',
                                color: isDoneMatch ? '#00d4aa' : isLeft ? '#ff6b35' : isRight ? '#9b5de5' : '#e0f0ff',
                                transition: 'all 0.3s ease',
                                boxShadow: isLeft ? '0 0 12px #ff6b3544' : isRight ? '0 0 12px #9b5de544' : 'none',
                            }}>
                                {v}
                            </div>
                            <div style={{ fontSize: '9px', color: '#3a6a8a' }}>[{i}]</div>
                        </div>
                    );
                })}
            </div>

            {/* Action buttons */}
            {!done && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                    <button onClick={handleMoveLeftPointer} disabled={left >= right - 1} style={{
                        background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,107,53,0.1))',
                        border: '1px solid #ff6b35', borderRadius: '10px', padding: '12px 20px',
                        color: '#ff6b35', fontSize: '13px', fontWeight: 700, cursor: left >= right - 1 ? 'not-allowed' : 'pointer', opacity: left >= right - 1 ? 0.4 : 1, transition: 'all 0.2s',
                    }}>
                        Push <strong>L</strong> right ▶<br /><span style={{ fontSize: '10px', color: '#a64b25', fontWeight: 400 }}>(increase sum)</span>
                    </button>

                    <button onClick={handleCheckMatch} style={{
                        background: 'linear-gradient(135deg, #00d4aa, #0080aa)',
                        border: 'none', borderRadius: '10px', padding: '12px 32px',
                        color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                        transform: currentSum === target ? 'scale(1.05)' : 'none',
                        boxShadow: currentSum === target ? '0 0 16px #00d4aa66' : 'none',
                    }}>
                        ✓ SUM MATCHES!
                    </button>

                    <button onClick={handleMoveRightPointer} disabled={left >= right - 1} style={{
                        background: 'linear-gradient(135deg, rgba(155,93,229,0.2), rgba(155,93,229,0.1))',
                        border: '1px solid #9b5de5', borderRadius: '10px', padding: '12px 20px',
                        color: '#c49aee', fontSize: '13px', fontWeight: 700, cursor: left >= right - 1 ? 'not-allowed' : 'pointer', opacity: left >= right - 1 ? 0.4 : 1, transition: 'all 0.2s',
                    }}>
                        ◀ Push <strong>R</strong> left<br /><span style={{ fontSize: '10px', color: '#884ecb', fontWeight: 400 }}>(decrease sum)</span>
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
                1. Set left pointer at start = array[0], right pointer at end = array[n-1].<br />
                2. Calculate `sum = left.value + right.value`.<br />
                3. If <strong>sum &gt; target</strong>, move right pointer left to decrease the sum.<br />
                4. If <strong>sum &lt; target</strong>, move left pointer right to increase the sum.<br />
                <strong style={{ color: '#ffd700' }}>Time: O(n) &nbsp; Space: O(1) &nbsp; Requires sorted array</strong>
            </div>

            <button onClick={reset} style={{
                marginTop: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: '12px',
            }}>🔄 New Array</button>
        </div>
    );
}
