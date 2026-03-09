'use client';
import React, { useState, useRef, useEffect } from 'react';

import { useGameStore } from '@/store/gameStore';

interface AIChatProps {
    levelId: string;
    levelTitle: string;
    levelDescription: string;
    levelConcept?: string;
    levelHints?: string[];
}

export default function AIChat({ levelId, levelTitle, levelDescription, levelConcept, levelHints }: AIChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const { language } = useGameStore();

    // Auto-scroll on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Initialize Web Speech API for Speech-to-Text
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onstart = () => setIsRecording(true);
                recognitionRef.current.onend = () => setIsRecording(false);
                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    if (event.error === 'not-allowed') {
                        setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: '🛑 Microphone access was denied. Please allow microphone permissions in your browser settings to use Speech-to-Text.'
                        }]);
                    }
                    setIsRecording(false);
                };
                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(prev => prev ? `${prev} ${transcript}` : transcript);
                };
            }
        }
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        // Remove markdown backticks and asterisks for cleaner reading
        const cleanText = text.replace(/```[\s\S]*?```/g, "Code block provided.").replace(/[*_~`#=-]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        const buildContext = () => {
            let ctx = `Game Context - The user is playing CodeQuest.\n`;
            ctx += `Level ID: ${levelId} - ${levelTitle}.\n`;
            if (levelConcept) ctx += `Learning Concept: ${levelConcept}\n`;
            ctx += `Objective/Win Condition: ${levelDescription}\n`;
            if (levelHints && levelHints.length > 0) ctx += `Official Level Hints (for your reference): ${levelHints.join(' | ')}\n`;
            ctx += `User's Current Language: ${language.toUpperCase()}.\n`;
            ctx += `\nCRITICAL INSTRUCTION: Analyze the user's issue and explain the programming concepts. ALWAYS answer and write any code snippets specifically in ${language.toUpperCase()}. Help them beat exactly this objective.`;
            return ctx;
        };

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages,
                    context: buildContext()
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Connection failed.');
            }

            // Create a placeholder for the assistant message
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedReply = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedReply += chunk;

                    setMessages(prev => {
                        const next = [...prev];
                        if (next.length > 0) {
                            next[next.length - 1] = {
                                ...next[next.length - 1],
                                content: accumulatedReply
                            };
                        }
                        return next;
                    });
                }
                if (autoSpeak) speak(accumulatedReply);
            }
        } catch (err: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ ${err.message || 'Connection error. Ensure Ollama is running on localhost:11434 with qwen2.5-coder:3b'}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {isOpen && (
                <div style={{
                    width: '380px', height: '500px', background: 'rgba(5,10,20,0.95)',
                    border: '1px solid #00c8ff', borderRadius: '12px', marginBottom: '16px',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    backdropFilter: 'blur(10px)', boxShadow: '0 0 20px rgba(0,200,255,0.2)'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'rgba(0,200,255,0.1)', padding: '14px 16px',
                        borderBottom: '1px solid rgba(0,200,255,0.2)', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '18px' }}>🤖</span>
                            <span style={{ fontFamily: "'Press Start 2P'", fontSize: '10px', color: '#00c8ff', marginTop: '2px' }}>Byte AI</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button onClick={() => {
                                setAutoSpeak(!autoSpeak);
                                if (autoSpeak) window.speechSynthesis.cancel();
                            }} style={{
                                background: autoSpeak ? 'rgba(0,200,255,0.2)' : 'rgba(255,255,255,0.1)',
                                border: `1px solid ${autoSpeak ? '#00c8ff' : '#666'}`, borderRadius: '6px',
                                padding: '4px 8px', color: autoSpeak ? '#00c8ff' : '#aaa', fontSize: '10px',
                                cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600, transition: 'all 0.2s'
                            }}>
                                🔊 Voice {autoSpeak ? 'ON' : 'OFF'}
                            </button>
                            <button onClick={() => setIsOpen(false)} style={{
                                background: 'none', border: 'none', color: '#8aa',
                                cursor: 'pointer', fontSize: '16px', padding: '0', display: 'flex', alignItems: 'center'
                            }}>✖</button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,200,255,0.05)', padding: '10px', borderRadius: '8px', fontSize: '13px', color: '#00d4aa', lineHeight: 1.5 }}>
                            Hello! I'm <strong>Byte</strong>, running locally on your computer via Ollama. How can I help you with <em>{levelTitle}</em>?
                        </div>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                background: m.role === 'user' ? '#00c8ff22' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${m.role === 'user' ? '#00c8ff55' : 'rgba(255,255,255,0.1)'}`,
                                padding: '10px 14px', borderRadius: '10px', maxWidth: '85%',
                                fontSize: '13px', color: m.role === 'user' ? '#fff' : '#cce0ff',
                                whiteSpace: 'pre-wrap', lineHeight: 1.5,
                                borderBottomRightRadius: m.role === 'user' ? '2px' : '10px',
                                borderBottomLeftRadius: m.role === 'assistant' ? '2px' : '10px',
                            }}>
                                {m.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', color: '#888', fontSize: '12px', padding: '8px 4px', animation: 'pulse 1.5s infinite' }}>
                                Byte is computing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '12px', borderTop: '1px solid rgba(0,200,255,0.2)', display: 'flex', gap: '8px', background: 'rgba(5,10,20,1)' }}>
                        <button onClick={toggleRecording} title={isRecording ? "Stop recording" : "Speech to text"} style={{
                            background: isRecording ? '#ff4757' : 'rgba(255,255,255,0.1)',
                            border: `1px solid ${isRecording ? '#ff4757' : 'rgba(255,255,255,0.2)'}`,
                            borderRadius: '8px', padding: '0 12px', color: '#fff', fontSize: '16px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            animation: isRecording ? 'pulse 1.5s infinite' : 'none', transition: 'all 0.2s'
                        }}>
                            {isRecording ? '🛑' : '🎤'}
                        </button>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSend();
                            }}
                            placeholder="Ask for hints or syntax..."
                            style={{
                                flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,200,255,0.3)',
                                borderRadius: '8px', padding: '10px 14px', color: '#fff',
                                fontSize: '13px', fontFamily: 'Inter', outline: 'none'
                            }}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} style={{
                            background: isLoading || !input.trim() ? '#222' : '#00c8ff',
                            border: 'none', borderRadius: '8px', padding: '0 16px',
                            color: isLoading || !input.trim() ? '#555' : '#000',
                            fontWeight: 700, cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
                        }}>
                            ↑
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '56px', height: '56px', borderRadius: '28px',
                        background: 'linear-gradient(135deg, #00c8ff, #9b5de5)',
                        border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '24px', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(0,200,255,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s', paddingBottom: '2px'
                    }}
                >
                    🤖
                </button>
            )}

            <style>{`
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
            `}</style>
        </div>
    );
}
