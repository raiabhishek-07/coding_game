'use client';
import React, { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/gameStore';
import { runCode } from '@/lib/sandbox';
import { LevelConfig } from '@/lib/levels/types';
import { sfxRun, sfxSuccess, sfxError, sfxHint } from '@/lib/sounds';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodeEditorProps {
    level: LevelConfig;
    theme: { accent: string };
    onSuccess: (stars: number) => void;
    onRetry: () => void;
}

function calcStars(elapsedSec: number, hintsUsed: number): number {
    if (hintsUsed === 0 && elapsedSec < 90) return 3;
    if (hintsUsed <= 1 && elapsedSec < 180) return 2;
    return 1;
}

/** Analyze code quality and return 0–100 score + tips */
function gradeCode(code: string): { score: number; tips: string[] } {
    const tips: string[] = [];
    let score = 100;

    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'));
    const hasVar = /\bvar\b/.test(code);
    const hasConsoleError = /console\.error/.test(code);
    const hasLongLines = lines.some(l => l.length > 100);
    const commentCount = (code.match(/\/\/.+/g) || []).length;
    const unusedLines = lines.filter(l => l.trim() === ';' || l.trim() === '{}').length;

    if (hasVar) { score -= 15; tips.push('💡 Replace var with let or const for safer scope'); }
    if (hasConsoleError) { score -= 10; tips.push('⚠️ Remove console.error from production code'); }
    if (hasLongLines) { score -= 10; tips.push('📏 Keep lines under 100 chars for readability'); }
    if (commentCount === 0 && lines.length > 5) { score -= 10; tips.push('📝 Add comments to explain your logic'); }
    if (unusedLines > 0) { score -= 5; tips.push('🧹 Remove empty unnecessary lines'); }
    if (lines.length < 3) { score -= 5; tips.push('✍️ Great! Very concise solution'); }

    return { score: Math.max(0, score), tips };
}

export default function CodeEditor({ level, theme, onSuccess, onRetry }: CodeEditorProps) {
    const {
        code, setCode, isRunning, setIsRunning,
        addConsoleMessage, clearConsole, setGamePhase,
        addXP, addGems, completeLevel, hintsUsed,
        showHint, toggleHint, currentHintIndex, nextHint,
    } = useGameStore();
    const startTimeRef = useRef<number>(0);
    const [hintPeek, setHintPeek] = useState(false);
    const [qualityGrade, setQualityGrade] = useState<{ score: number; tips: string[] } | null>(null);

    const handleRun = useCallback(async () => {
        if (isRunning) return;
        sfxRun();
        clearConsole();
        setIsRunning(true);
        setGamePhase('running');
        setQualityGrade(null);
        startTimeRef.current = Date.now();

        addConsoleMessage({ type: 'info', text: '▶ Running your code...' });

        const result = await runCode(code);

        for (const log of result.logs) {
            if (log.startsWith('[ERROR]')) {
                addConsoleMessage({ type: 'error', text: log.replace('[ERROR] ', '') });
            } else if (log.startsWith('[WARN]')) {
                addConsoleMessage({ type: 'warn', text: log.replace('[WARN] ', '') });
            } else {
                addConsoleMessage({ type: 'log', text: log });
            }
        }

        if (result.error) {
            addConsoleMessage({ type: 'error', text: '🔴 ' + result.error });
        }

        const passed = level.validate(result.logs, result.returnValue);
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);

        if (passed) {
            const stars = calcStars(elapsed, hintsUsed);
            const grade = gradeCode(code);
            setQualityGrade(grade);
            sfxSuccess();
            addConsoleMessage({ type: 'success', text: `✅ ${level.winMessage}` });
            addConsoleMessage({ type: 'success', text: `🌟 +${level.xpReward} XP  💎 +${level.gemReward} Gems  ${'⭐'.repeat(stars)} (${elapsed}s)` });
            addConsoleMessage({ type: 'info', text: `📊 Code Quality: ${grade.score}%${grade.tips.length ? ' — ' + grade.tips[0] : ''}` });
            addXP(level.xpReward);
            addGems(level.gemReward);
            completeLevel(stars, elapsed);
            setGamePhase('success');
            onSuccess(stars);
        } else {
            sfxError();
            addConsoleMessage({ type: 'error', text: '❌ Not quite! Check the mission objective and try again.' });
            setGamePhase('retry');
            onRetry();
        }

        setIsRunning(false);
    }, [code, level, isRunning, hintsUsed, clearConsole, setIsRunning, addConsoleMessage, setGamePhase, addXP, addGems, completeLevel, onSuccess, onRetry]);

    const handleReset = () => {
        setCode(level.starterCode);
        clearConsole();
        setGamePhase('idle');
        setQualityGrade(null);
    };

    const handleHint = () => {
        sfxHint();
        if (!showHint) {
            toggleHint();
            setHintPeek(true);
        } else if (currentHintIndex < level.hints.length - 1) {
            nextHint();
        } else {
            toggleHint();
            setHintPeek(false);
        }
    };

    React.useEffect(() => {
        setCode(level.starterCode);
        setHintPeek(false);
        setQualityGrade(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level.id]);

    const currentHint = level.hints[currentHintIndex] || level.hints[0];
    const qualityColor = qualityGrade
        ? qualityGrade.score >= 80 ? '#00d4aa' : qualityGrade.score >= 60 ? '#ffbd2e' : '#ff4757'
        : '#4f8fff';

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d16' }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: '10px',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    💻 Code Editor
                </span>
                <div style={{ flex: 1 }} />
                {/* Quality badge */}
                {qualityGrade && (
                    <div style={{
                        fontSize: '10px', fontWeight: 700, color: qualityColor,
                        background: `${qualityColor}15`, borderRadius: '4px',
                        padding: '2px 8px', border: `1px solid ${qualityColor}33`,
                        animation: 'fadeIn 0.4s ease',
                    }}>
                        📊 {qualityGrade.score}%
                    </div>
                )}
                {hintsUsed > 0 && (
                    <div style={{ fontSize: '10px', color: '#ffbd2e', opacity: 0.8 }}>
                        💡 {hintsUsed} hint{hintsUsed > 1 ? 's' : ''}
                    </div>
                )}
                <div style={{
                    fontSize: '10px', color: '#555', fontFamily: 'JetBrains Mono',
                    background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '2px 8px',
                }}>
                    JavaScript
                </div>
            </div>

            {/* Hint banner */}
            {showHint && hintPeek && (
                <div style={{
                    background: 'rgba(255,189,46,0.08)', borderBottom: '1px solid rgba(255,189,46,0.2)',
                    padding: '10px 16px', flexShrink: 0,
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', color: '#ffbd2e', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Hint {currentHintIndex + 1} / {level.hints.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#e8c870', lineHeight: 1.5 }}>
                            {currentHint}
                        </div>
                    </div>
                    <button onClick={handleHint} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                </div>
            )}

            {/* Code quality tips banner */}
            {qualityGrade && qualityGrade.tips.length > 0 && (
                <div style={{
                    background: `${qualityColor}0d`, borderBottom: `1px solid ${qualityColor}22`,
                    padding: '8px 14px', flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: '8px',
                    animation: 'fadeIn 0.4s ease',
                }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: qualityColor }}>
                        CODE QUALITY: {qualityGrade.score}%
                    </span>
                    <span style={{ fontSize: '10px', color: '#888' }}>
                        {qualityGrade.tips[0]}
                    </span>
                </div>
            )}

            {/* Monaco Editor */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <MonacoEditor
                    height="100%"
                    language="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        automaticLayout: true,
                        tabSize: 2,
                        renderLineHighlight: 'gutter',
                        cursorStyle: 'line',
                        smoothScrolling: true,
                        padding: { top: 10, bottom: 10 },
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div style={{
                padding: '8px 12px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', gap: '8px', flexShrink: 0,
                background: 'rgba(0,0,0,0.3)',
            }}>
                <button
                    id="run-code-btn"
                    onClick={handleRun}
                    disabled={isRunning}
                    style={{
                        flex: 1,
                        background: isRunning
                            ? 'rgba(79,143,255,0.2)'
                            : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}bb)`,
                        border: 'none', borderRadius: '8px',
                        padding: '10px 0', color: '#fff',
                        cursor: isRunning ? 'not-allowed' : 'pointer',
                        fontSize: '13px', fontWeight: 700, fontFamily: 'Inter',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'all 0.2s', boxShadow: isRunning ? 'none' : `0 4px 15px ${theme.accent}44`,
                    }}
                    onMouseEnter={e => { if (!isRunning) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    {isRunning
                        ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⚙️</span> Running...</>
                        : <>▶ Run Code</>}
                </button>

                <button
                    id="show-hint-btn" onClick={handleHint}
                    style={{
                        background: showHint ? 'rgba(255,189,46,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${showHint ? 'rgba(255,189,46,0.3)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '8px', padding: '10px 12px',
                        color: showHint ? '#ffbd2e' : '#888',
                        cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter', transition: 'all 0.2s',
                    }}
                >
                    💡 Hint
                </button>

                <button
                    id="reset-code-btn" onClick={handleReset}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', padding: '10px 12px',
                        color: '#888', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#ccc'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#888'; }}
                >
                    🔄
                </button>
            </div>
        </div>
    );
}
