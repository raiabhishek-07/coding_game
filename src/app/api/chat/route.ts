import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message, history, context } = await req.json();

        const systemPrompt = `You are Byte, an AI coding assistant for a game called CodeQuest. 
The player is a JavaScript warrior trying to solve level programming challenges.
Keep your answers concise, encouraging, and focused on JavaScript coding.
Current Level Context: ${context}`;

        const formattedHistory = history.map((h: any) => ({
            role: h.role,
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
                stream: true,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        // Create a transform stream to parse Ollama's JSON chunks
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n').filter(l => l.trim());

                        for (const line of lines) {
                            try {
                                const json = JSON.parse(line);
                                if (json.message?.content) {
                                    controller.enqueue(encoder.encode(json.message.content));
                                }
                                if (json.done) {
                                    controller.close();
                                    return;
                                }
                            } catch (e) {
                                console.error("Error parsing Ollama stream chunk:", e);
                            }
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to connect to local AI' }, { status: 500 });
    }
}
