'use server'

import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY!})
const INDEX_NAME = "ai-portfolio-saas"

export async function upsertData(userId: string, data: any) {
    const index = pc.index(INDEX_NAME).namespace(userId);
    await index.upsertRecords(data);
}

export async function queryData(userId: string, query:string) {
    const index = pc.index(INDEX_NAME).namespace(userId);
    const results = await index.searchRecords({
        query: {
            topK: 10,
            inputs: {
                text: query
            }
        }
    })
    return results
}