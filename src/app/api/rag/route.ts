import {Pinecone} from "@pinecone-database/pinecone"
import {InferenceClient} from '@huggingface/inference'
import { NextResponse } from "next/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText, streamText } from "ai";
import { Message } from "@/app/types";

if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set");
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'ai-portfolio'; // Replace or use env var
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'resume'; // Your single namespace

/**
 * Uses a smaller LLM to decide which namespace to query pineconeDB
 */
async function getRoutedNamespace(question: string) {
    const systemPrompt = `You are an intelligent routing assistant. Your task is to determine the most relevant knowledge domain for the user's question.
            Available domains and their descriptions:
            - 'github': For questions specifically about greater details of Khang's GitHub projects and URLs .
            - 'resume': For questions about Khang Hou's professional experience, skills, projects, qualifications, leadership/volunteering experience listed in a resume or portfolio.
            - 'linkedin-data': For questions about Khang's LinkedIn profile, experience, skills, projects, qualifications, leadership/volunteering experience.
            - '_default_': For all other general questions.

            User Question: ${question}

            Based on the user's question, which domain is most appropriate? Respond with only the domain name (e.g., 'commit-history').`;

    const userMessage = `Based on the following question, please decide which namespace to query pineconeDB.

Question: ${question}`;
    
    const client = new InferenceClient(process.env.HUGGINGFACE_ACCESS_TOKEN)
    const response = await client.chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        provider: "auto",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: userMessage
            }

        ]
    });

    const knownNamespaces = ['github', 'resume', 'linkedin-data', '_default_'];

    if (response.choices && response.choices[0].message && response.choices[0].message.content) {
        const chosenNamespace = response.choices[0].message.content.trim();
        if (knownNamespaces.includes(chosenNamespace)) {
            return chosenNamespace;
        }
        console.warn(`Router LLM returned an unknown namespace: ${chosenNamespace}. Falling back to default.`);
    }
    return '_default_';
}

// TODO: remove this
async function generateAnswer(question: string, context: string) {
    const systemPrompt = `
    You are Khang Hou's helpful and highly skilled AI assistant, specializing in his resume and portfolio. 
    Your goal is to answer questions based *only* on the provided context. 
    If the answer is not found in the context, clearly state that the information is not available in the provided documents. 
    Be concise and conversational and also provide follow-up suggestions on other topics that may interest the user's needs. 
    
    For example, if the user asks for my resume and projects, he/she may be a recruiter and may be interested in knowing more of my skills, experiences and projects.`;
    
    const userMessage = `Based on the following context, please answer the question.

Context:
---
${context}
---

Question: ${question}`;

    try {
        const client = new InferenceClient(process.env.HUGGINGFACE_ACCESS_TOKEN)
        const response = await client.chatCompletion({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            provider: "auto",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });
        
        if (response.choices && Array.isArray(response.choices) && response.choices.length > 0 && 
            response.choices[0].message && typeof response.choices[0].message.content === 'string') {
            return response.choices[0].message.content.trim();
        } else {
            console.error("Unexpected response structure from chatCompletion:", response);
            throw new Error("Invalid response structure from chatCompletion");
        }

    } catch (error) {
        console.error("Error generating answer from @huggingface/inference (chatCompletion):", error);
        throw new Error(`Failed to generate answer: ${error instanceof Error ? error.message : String(error)}`);
    }

}

async function generateStreamingAnswer(question: string, context: string, controller: ReadableStreamDefaultController<Uint8Array>) {
    const systemPrompt = `
    You are Khang Hou's helpful and highly skilled AI butler, specializing in providing context and information about his resume and portfolio to potential clients. 
    Your goal is to answer questions based *only* on the provided context on behalf of Khang Hou. This information belongs to him, and not you. Do not try to impersonate Khang Hou 
    
    If the answer is not found in the context, clearly state that the information is not available in the provided documents. 
    
    Be concise and conversational and also provide follow-up suggestions on other topics that may interest the user's needs. 

    Output only valid markdown WITHOUT backticks
    
    For example, if the user asks for Khang Hou's resume and projects, he/she may be a recruiter and may be interested in knowing more of my skills, experiences and projects.`;
    
    const userMessage = `Based on the following context, please answer the question and format it in markdown.

Context:
---
${context}
---

Question: ${question}`;

    try {
        // const client = new InferenceClient(process.env.HUGGINGFACE_ACCESS_TOKEN)
        const {textStream} = await streamText({
            model: openrouter('deepseek/deepseek-chat-v3-0324:free'),
            system: systemPrompt,
            prompt: userMessage
      });
      
        for await (const r of textStream) {
            // yield the generated token

            const encoder = new TextEncoder();
            const chunk = encoder.encode(`data: ${r}\t\t`)
            controller.enqueue(chunk);
        }

    } catch (error) {
        console.error("Error generating streaming answer from @huggingface/inference (chatCompletion):", error);
        const encoder = new TextEncoder();
        const errorChunk = encoder.encode(`data: ${JSON.stringify({ error: `Failed to generate answer: ${error instanceof Error ? error.message : String(error)}` })}\n\n`);
        controller.enqueue(errorChunk);
    } finally {
        controller.close();
    }
}

type ChatRequest = {
    messages: Message[],
    stream: boolean
}

export async function POST(request: Request) {
    try {
        const {messages, stream: shouldStream = false}: ChatRequest = await request.json();

        if (!messages) {
            return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
        }

        const question = messages[messages.length - 1]
        const index = pinecone.index(PINECONE_INDEX_NAME);
        // const namespace = await getRoutedNamespace(question);
        const namespace = PINECONE_NAMESPACE
        console.log(`Routing to namespace: ${namespace}`);
        const queryResponse = await index.namespace(namespace).searchRecords({
            query: {
                inputs: {
                    text: question.text, 
                },
                topK: 4
            }
        })

        
        const context = queryResponse.result.hits
            .map((hit: any) => hit.fields["content"] as string)
            .join("\n---\n"); // Join context snippets clearly

        // Check if streaming is requested
        // const formattedMessages = 
        const formattedPrompt = messages.reduce((acc, message) => {
            return acc + `${message.sender}: ${message.text}`
        }, "")
        if (shouldStream) {
            const stream = new ReadableStream({
                start(controller) {
                    generateStreamingAnswer(formattedPrompt, context, controller);
                }
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        } else {
            // Regular non-streaming response
            const answer = await generateAnswer(formattedPrompt, context);
            return NextResponse.json({answer: answer})
        }
    } catch (error: any) {
        console.error('[RAG API Error]', error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}