import { Pinecone } from "@pinecone-database/pinecone"

import { NextResponse } from "next/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText, streamText } from "ai";

import { wrapAISDKModel } from "langsmith/wrappers/vercel";

import { initializeOTEL } from "langsmith/experimental/otel/setup";

const { DEFAULT_LANGSMITH_SPAN_PROCESSOR } = initializeOTEL();

if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set");
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'ai-portfolio'; // Replace or use env var
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'resume'; // Your single namespace

async function generateStreamingAnswer(question: string, context: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    const name = "Khang Hou"
    const systemPrompt = `
    You are ${name}'s helpful and highly skilled AI butler, specializing in providing context and information about his resume and portfolio to potential clients. 
    Your goal is to answer questions based *only* on the provided context on behalf of ${name}. This information belongs to him, and not you. Do not try to impersonate Khang Hou 
    
    If the answer is not found in the context, clearly state that the information is not available in the provided documents. 
    
    Be concise and conversational and also provide follow-up suggestions on other topics that may interest the user's needs. 
    
    For example, if the user asks for ${name}'s resume and projects, he/she may be a recruiter and may be interested in knowing more of my skills, experiences and projects.`;

    const userMessage = `Based on the following context, please answer the question and format it in markdown.

Context:
---
${context}
---

Question: ${question}`;

    try {
        // const client = new InferenceClient(process.env.HUGGINGFACE_ACCESS_TOKEN)
        const { textStream } = await streamText({
            model: wrapAISDKModel(openrouter('z-ai/glm-4.5-air:free')),
            system: systemPrompt,
            prompt: userMessage,
            experimental_telemetry: {
                isEnabled: true
            }
        });

        
        for await (const r of textStream) {
            // yield the generated token
            const encoder = new TextEncoder();
            const chunk = encoder.encode(`data: ${r}\t\t`)
            controller.enqueue(chunk);
        }

    } catch (error) {
        console.error("Error generating streaming answer:", error);
        const encoder = new TextEncoder();
        const errorChunk = encoder.encode(`data: ${JSON.stringify({ error: `Failed to generate answer: ${error instanceof Error ? error.message : String(error)}` })}\n\n`);
        controller.enqueue(errorChunk);
    } finally {
        await DEFAULT_LANGSMITH_SPAN_PROCESSOR.shutdown();
        controller.close();
    }
}

export async function POST(request: Request) {
    try {
        const { question } = await request.json();

        if (!question || typeof question !== 'string') {
            return NextResponse.json({ error: 'Question is required and must be a string.' }, { status: 400 });
        }

        const index = pinecone.index(PINECONE_INDEX_NAME);
        // const namespace = await getRoutedNamespace(question);
        const namespace = PINECONE_NAMESPACE
        const queryResponse = await index.namespace(namespace).searchRecords({
            query: {
                inputs: {
                    text: question,
                },
                topK: 4
            }
        })

        const context = queryResponse.result.hits
            .map((hit: any) => hit.fields["content"] as string)
            .join("\n---\n"); // Join context snippets clearly

        // Check if streaming is requested
        // const stream = createStreamableValue();

        const stream = new ReadableStream({
            async start(controller) {
                await generateStreamingAnswer(question, context, controller);
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
        console.error('[RAG API Error]', error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}