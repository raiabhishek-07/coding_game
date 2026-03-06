'use client';
import React, { useState, useCallback } from 'react';

function shuffle(arr: number[]): number[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function genArray() { return shuffle([15, 38, 7, 24, 62, 11, 45, 29]); }

interface Props { onScore: (pts: number) => void; }

export default function BubbleSortGame({ onScore }: Props) {
    const [arr, setArr] = useState<number[]>([]);
    const [pass, setPass] = useState(0);           // current pass index
    const [pos, setPos] = useState(0);             // current compare position in pass
    const [comps, setComps] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState<'ok' | 'err' | 'info'>('info');
    const [done, setDone] = useState(false);
    const [sortedUpTo, setSortedUpTo] = useState(0); // how many from the right are sorted
    const [violations, setViolations] = useState(0);

    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setArr(genArray());
        setMounted(true);
    }, []);

    const n = arr.length;
    const maxPass = Math.max(0, n - 1);

    // Advance the comparison window; detect if this pass is done or all sorted
    const advance = useCallback((newArr: number[], swapHappened: boolean, c: number, s: number) => {
        const nextPos = pos + 1;
        const sortedCount = sortedUpTo + (pass === maxPass - 1 - sortedUpTo ? 0 : 0);

        // End of this pass
        if (nextPos >= n - 1 - sortedUpTo) {
            const newSorted = sortedUpTo + 1;
            setSortedUpTo(newSorted);
            setPass(p => p + 1);
            setPos(0);
            // Check fully sorted
            const isSorted = newArr.every((v, i, a) => i === 0 || a[i - 1] <= v);
            if (isSorted) {
                setDone(true);
                setMsg('🎉 Array sorted! You executed Bubble Sort perfectly!');
                setMsgType('ok');
                onScore(100 + Math.max(0, 50 - violations * 5));
            } else {
                setMsg(`✅ Pass ${pass + 1} complete! Starting pass ${pass + 2}…`);
                setMsgType('ok');
            }
        } else {
            setPos(nextPos);
            const a = newArr[nextPos], b = newArr[nextPos + 1];
            setMsg(swapHappened
                ? `↕ Swapped ${swapHappened ? arr[pos] : ''} ↔ ${swapHappened ? arr[pos + 1] : ''}. Now compare [${a}] vs [${b}]`
                : `✓ No swap needed. Now compare [${a}] vs [${b}]`);
            setMsgType('ok');
        }
        setComps(c);
        setSwaps(s);
        setArr(newArr);
    }, [arr, pass, pos, sortedUpTo, n, maxPass, violations, onScore]);

    const handleSwap = () => {
        if (done) return;
        const a = arr[pos], b = arr[pos + 1];
        if (a > b) {
            // Correct swap
            const newArr = [...arr];
            [newArr[pos], newArr[pos + 1]] = [newArr[pos + 1], newArr[pos]];
            advance(newArr, true, comps + 1, swaps + 1);
        } else {
            // Wrong — shouldn't swap
            setMsg(`❌ Swap violation! ${a} ≤ ${b} — no swap needed here. Bubble Sort only swaps when left > right.`);
            setMsgType('err');
            setViolations(v => v + 1);
        }
    };

    const handleNoSwap = () => {
        if (done) return;
        const a = arr[pos], b = arr[pos + 1];
        if (a <= b) {
            // Correct — no swap
            advance(arr, false, comps + 1, swaps);
        } else {
            // Wrong — should swap
            setMsg(`❌ Mistake! ${a} > ${b} — you MUST swap these! (Bubble Sort moves larger values right)`);
            setMsgType('err');
            setViolations(v => v + 1);
        }
    };

    const reset = () => {
        setArr(genArray());
        setPass(0); setPos(0); setComps(0); setSwaps(0);
        setSortedUpTo(0); setViolations(0); setDone(false);
        setMsg(''); setMsgType('info');
    };

    const boxColor = (i: number) => {
        if (done) return '#00d4aa';
        if (i >= n - sortedUpTo) return '#00d4aa44';       // sorted region
        if (i === pos || i === pos + 1) return '#00c8ff';  // active comparison
        return '#1a3a5a';
    };

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {!mounted ? (
                <div style={{ textAlign: 'center', padding: '100px', color: '#8aa' }}>Generating array...</div>
            ) : (
                <>
                    {/* Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <h1 style={{ fontFamily: "'Press Start 2P'", fontSize: '14px', color: '#00c8ff', marginBottom: '8px' }}>
                            🫧 Bubble Sort
                        </h1>
                        <p style={{ fontSize: '13px', color: '#4a8aaa', lineHeight: 1.6, marginBottom: '12px' }}>
                            <strong style={{ color: '#00c8ff' }}>Rule:</strong> Compare the two highlighted (blue) adjacent boxes.
                            Decide <em>Swap</em> or <em>No Swap</em>. Wrong choice = rule violation!
                            Larger values "bubble" to the right each pass.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                            {[
                                { label: 'Pass', value: `${pass + 1} / ${maxPass}` },
                                { label: 'Comparisons', value: comps },
                                { label: 'Swaps', value: swaps },
                                { label: 'Violations', value: violations, bad: violations > 0 },
                            ].map(s => (
                                <div key={s.label} style={{
                                    background: 'rgba(0,200,255,0.06)', border: '1px solid rgba(0,200,255,0.15)',
                                    borderRadius: '8px', padding: '6px 14px', textAlign: 'center',
                                }}>
                                    <div style={{ color: '#3a6a8a', fontSize: '10px' }}>{s.label}</div>
                                    <div style={{ color: (s as { bad?: boolean }).bad ? '#ff4757' : '#00c8ff', fontWeight: 700, fontSize: '16px', fontFamily: 'JetBrains Mono' }}>{s.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Array visualization */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                        {arr.map((v, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                {/* Comparison arrow */}
                                {(i === pos || i === pos + 1) && !done && (
                                    <div style={{ fontSize: '12px', color: '#00c8ff', animation: 'pulse 1s infinite' }}>▼</div>
                                )}
                                {/* Box */}
                                <div style={{
                                    width: '64px', height: `${30 + v * 1.5}px`,
                                    background: boxColor(i),
                                    border: (i === pos || i === pos + 1) && !done ? '2px solid #00c8ff' : '1px solid rgba(0,200,255,0.2)',
                                    borderRadius: '6px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', fontWeight: 700, fontFamily: 'JetBrains Mono',
                                    color: '#fff',
                                    transition: 'all 0.3s ease',
                                    boxShadow: (i === pos || i === pos + 1) && !done ? '0 0 16px #00c8ff66' : 'none',
                                    animation: (i === pos || i === pos + 1) && !done ? 'glow 1.5s ease-in-out infinite' : 'none',
                                }}>
                                    {v}
                                </div>
                                {/* Sorted indicator */}
                                {i >= n - sortedUpTo && (
                                    <div style={{ fontSize: '10px', color: '#00d4aa' }}>✓</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* VS label */}
                    {!done && (
                        <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '13px', color: '#4a8aaa' }}>
                            Comparing <span style={{ color: '#00c8ff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>[{arr[pos]}]</span>
                            {' vs '}
                            <span style={{ color: '#00c8ff', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>[{arr[pos + 1]}]</span>
                            {' — which is larger?'}
                        </div>
                    )}

                    {/* Action buttons */}
                    {!done && (
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
                            <button onClick={handleSwap} style={{
                                background: 'linear-gradient(135deg, #ff6b35, #ff4757)',
                                border: 'none', borderRadius: '10px', padding: '12px 28px',
                                color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                            }}>
                                ↕ SWAP them
                            </button>
                            <button onClick={handleNoSwap} style={{
                                background: 'linear-gradient(135deg, #00c8ff, #0080aa)',
                                border: 'none', borderRadius: '10px', padding: '12px 28px',
                                color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                            }}>
                                ✓ No Swap needed
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

                    {/* Algo tip box */}
                    <div style={{
                        background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.1)',
                        borderRadius: '10px', padding: '16px', fontSize: '12px', color: '#3a7a9a', lineHeight: 1.7,
                    }}>
                        <strong style={{ color: '#00c8ff', display: 'block', marginBottom: '6px' }}>📚 Algorithm Rules</strong>
                        1. Move a pointer from left to right through unsorted region<br />
                        2. Compare each adjacent pair [i] and [i+1]<br />
                        3. If arr[i] &gt; arr[i+1] → SWAP, otherwise → No Swap<br />
                        4. Repeat for n-1 passes. Largest elements "bubble" right.<br />
                        <strong style={{ color: '#ffd700' }}>Time: O(n²) &nbsp; Space: O(1) &nbsp; Stable: Yes</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button onClick={reset} style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: '12px',
                        }}>🔄 New Array</button>
                    </div>
                </>
            )}
        </div>
    );
}
