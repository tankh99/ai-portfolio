import {Pinecone} from "@pinecone-database/pinecone"
import {InferenceClient} from '@huggingface/inference'
import { NextResponse } from "next/server";

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

async function generateAnswer(question: string, context: string) {
    const systemPrompt = "You are Khang Hou's helpful and highly skilled AI assistant, specializing in his resume and portfolio. Your goal is to answer questions based *only* on the provided context. If the answer is not found in the context, clearly state that the information is not available in the provided documents. Be concise and professional.";
    
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
            ],
            parameters: {
                max_new_tokens: 512, 
                temperature: 0.7,    
            }
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

export async function POST(request: Request) {
    try {
        const {question} = await request.json();

        if (!question || typeof question !== 'string') {
            return NextResponse.json({ error: 'Question is required and must be a string.' }, { status: 400 });
        }

        const index = pinecone.index(PINECONE_INDEX_NAME);
        // const namespace = await getRoutedNamespace(question);
        const namespace = PINECONE_NAMESPACE
        console.log(`Routing to namespace: ${namespace}`);
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

        const answer = await generateAnswer(question, context);
        return NextResponse.json({answer: answer})
    } catch (error: any) {
        console.error('[RAG API Error]', error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}