import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message, history, context } = await req.json();

        const systemPrompt = `You are Byte, an AI coding assistant for a game called CodeQuest. 
The player is a JavaScript warrior trying to solve level programming challenges.
Keep your answers concise, encouraging, and focused on JavaScript coding.
Current Level Context: ${context}`;

        const formattedHistory = history.map((h: any) => ({
            role: h.role, // 'user' | 'assistant'
            content: h.content,
        }));

        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen2.5-coder:3b',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...formattedHistory,
                    { role: 'user', content: message }
                ],
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ reply: data.message.content });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to connect to local AI' }, { status: 500 });
    }
}
