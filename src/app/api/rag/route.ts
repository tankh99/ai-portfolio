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
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'default'; // Your single namespace


async function generateAnswer(question: string, context: string) {
    const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;
    try {

        const client = new InferenceClient(process.env.HUGGINGFACE_ACCESS_TOKEN)
        const response = await client.questionAnswering({
            provider: "hf-inference",
            model: "deepset/roberta-base-squad2",
            inputs: {
                question: question,
                context: context,
            },
        })
        return response.answer;
    } catch (error) {
        console.error("Error generating answer from @huggingface/inference:", error);
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
        const queryResponse = await index.namespace(PINECONE_NAMESPACE).searchRecords({
            query: {
                inputs: {
                    text: question, 
                },
                topK: 4
            }
        })

        const context = queryResponse.result.hits
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((hit: any) => hit.fields["content"] as string)

        const answer = await generateAnswer(question, context.join("\n"));
        return NextResponse.json({answer: answer})
    } catch (error: any) {
        console.error('[RAG API Error]', error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}