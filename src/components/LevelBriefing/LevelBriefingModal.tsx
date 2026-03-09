import React, { useEffect, useState, useRef } from 'react';
import { LevelConfig } from '@/lib/levels/types';
import { sfxClick, sfxHover } from '@/lib/sounds';

interface LevelBriefingModalProps {
    level: LevelConfig;
    theme: { accent: string; bg: string };
    onReady: () => void;
    onExit: () => void;
}

export default function LevelBriefingModal({ level, theme, onReady, onExit }: LevelBriefingModalProps) {
    const [autoSpeak, setAutoSpeak] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Prepare the script to read out loud
    const getBriefingScript = () => {
        return `Welcome to Level ${level.level}: ${level.title}. ${level.objective}. ${level.story} Let's get ready for an adventure!`;
    };

    useEffect(() => {
        // We use a small delay to ensure TTS has time to initialize
        let timeoutId: NodeJS.Timeout;

        const speakBriefing = () => {
            if (!('speechSynthesis' in window) || !autoSpeak) return;

            window.speechSynthesis.cancel();
            const textToSpeak = getBriefingScript().replace(/[*_`]/g, ''); // strip markdown
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.rate = 1.05;
            utterance.pitch = 1.1;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            speechRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        };

        if (autoSpeak) {
            timeoutId = setTimeout(speakBriefing, 500);
        }

        return () => {
            clearTimeout(timeoutId);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level.id, autoSpeak]);

    const handleReady = () => {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        sfxClick();
        onReady();
    };

    const toggleVoice = () => {
        sfxClick();
        if (isSpeaking || autoSpeak) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
        setAutoSpeak(!autoSpeak);
    };

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {/* Cyberpunk/Holographic Dark Container */}
            <div style={{
                position: 'relative',
                width: '850px', maxWidth: '95%',
                background: `linear-gradient(135deg, rgba(15,20,35,0.95), rgba(5,10,20,0.98))`,
                borderRadius: '16px', border: `2px solid ${theme.accent}`,
                boxShadow: `0 0 40px ${theme.accent}44, inset 0 0 20px rgba(0,0,0,0.5)`,
                display: 'flex', overflow: 'hidden'
            }}>
                {/* Character Panel (Left) */}
                <div style={{
                    width: '30%', background: 'rgba(0,0,0,0.4)', borderRight: `2px solid ${theme.accent}33`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '24px', position: 'relative'
                }}>
                    {/* Hologram base effect */}
                    <div style={{
                        position: 'absolute', bottom: '15%', left: '10%', right: '10%', height: '40px',
                        background: `radial-gradient(ellipse at center, ${theme.accent}66 0%, transparent 70%)`,
                        filter: 'blur(10px)', opacity: 0.8
                    }} />

                    {/* Hologram Avatar */}
                    <div style={{
                        fontSize: '120px',
                        animation: isSpeaking ? 'pulse 1s infinite alternate' : 'floatAvatar 3s ease-in-out infinite',
                        filter: `drop-shadow(0 0 20px ${theme.accent}aa)`, marginBottom: '20px', zIndex: 2
                    }}>
                        🧙‍♂️
                    </div>

                    {/* Character Tag */}
                    <div style={{
                        textAlign: 'center', color: theme.accent, fontSize: '18px',
                        fontWeight: 'bold', fontFamily: "'Press Start 2P', system-ui",
                        textShadow: `0 0 10px ${theme.accent}`, zIndex: 2,
                        background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px',
                        border: `1px solid ${theme.accent}44`
                    }}>
                        GUIDE
                    </div>
                </div>

                {/* Content Panel (Right) */}
                <div style={{ flex: 1, padding: '32px 40px', display: 'flex', flexDirection: 'column' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{
                            margin: '0 0 12px 0', fontSize: '22px', color: theme.accent,
                            fontFamily: "'Press Start 2P', system-ui", textShadow: `0 0 15px ${theme.accent}aa`,
                            lineHeight: 1.4
                        }}>
                            Welcome to Level {level.level}:<br />{level.title}!
                        </h2>
                    </div>

                    <p style={{
                        fontSize: '18px', color: '#e0f0ff', marginBottom: '24px', textAlign: 'center'
                    }}>
                        In this level, you'll learn about <strong>{level.concept}</strong>!
                    </p>

                    {/* Bullet Points Container */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${theme.accent}44`,
                        borderRadius: '12px', padding: '20px',
                        display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px',
                        boxShadow: `inset 0 0 20px ${theme.accent}22`
                    }}>
                        {/* Objective */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{
                                minWidth: '40px', height: '40px', background: 'rgba(0,0,0,0.6)',
                                border: `2px solid ${theme.accent}66`, borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '20px', boxShadow: `0 0 10px ${theme.accent}33`
                            }}>🎯</div>
                            <span style={{ fontSize: '16px', color: '#b0d0e6', lineHeight: 1.6, paddingTop: '6px' }}>
                                {level.objective}
                            </span>
                        </div>
                        {/* Story */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{
                                minWidth: '40px', height: '40px', background: 'rgba(0,0,0,0.6)',
                                border: `2px solid ${theme.accent}66`, borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '20px', boxShadow: `0 0 10px ${theme.accent}33`
                            }}>📜</div>
                            <span style={{ fontSize: '16px', color: '#b0d0e6', lineHeight: 1.6, paddingTop: '6px' }}>
                                {level.story}
                            </span>
                        </div>
                    </div>

                    {/* Footer Controls & Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', width: '100%' }}>

                        {/* Audio Bar */}
                        <button
                            onClick={toggleVoice}
                            onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = `0 0 15px ${theme.accent}44`; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.boxShadow = 'none'; }}
                            title={autoSpeak ? "Mute Guide" : "Unmute Guide"}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(0,0,0,0.6)', padding: '0 16px', height: '48px',
                                borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
                                border: `1px solid ${theme.accent}44`, borderLeft: `4px solid ${theme.accent}`,
                                outline: 'none'
                            }}
                        >
                            <span style={{ fontSize: '20px', opacity: autoSpeak ? 1 : 0.5, filter: autoSpeak ? `drop-shadow(0 0 5px ${theme.accent})` : 'none' }}>
                                {autoSpeak ? '🔊' : '🔇'}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: theme.accent, fontStyle: 'italic', letterSpacing: '0.5px' }}>
                                Auto-Speech
                            </span>
                        </button>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={() => { sfxClick(); onExit(); }} style={{
                                background: 'rgba(255,71,87,0.05)', height: '48px',
                                border: '2px solid #ff4757', borderRadius: '8px', padding: '0 28px',
                                color: '#ff4757', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                                textTransform: 'uppercase', transition: 'all 0.2s ease',
                                fontFamily: "'Press Start 2P', system-ui", outline: 'none'
                            }}
                                onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.background = 'rgba(255,71,87,0.15)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(255,71,87,0.3)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,71,87,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                EXIT
                            </button>

                            <button onClick={handleReady} style={{
                                background: theme.accent, height: '48px',
                                border: `2px solid ${theme.accent}`, borderRadius: '8px', padding: '0 32px',
                                color: '#000', fontSize: '14px', fontWeight: '900', cursor: 'pointer',
                                textTransform: 'uppercase', transition: 'all 0.2s ease',
                                boxShadow: `0 0 20px ${theme.accent}66`,
                                fontFamily: "'Press Start 2P', system-ui", outline: 'none'
                            }}
                                onMouseEnter={(e) => { sfxHover(); e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = `0 0 30px ${theme.accent}aa`; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 0 20px ${theme.accent}66`; }}
                            >
                                READY
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 10px ${theme.accent}33); }
                    100% { transform: scale(1.05) translateY(-5px); filter: drop-shadow(0 0 30px ${theme.accent}aa); }
                }
                @keyframes floatAvatar {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
}
