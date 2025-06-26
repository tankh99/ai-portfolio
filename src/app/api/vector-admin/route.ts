// Vector DB CRUD API scaffold
import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import {v4 as uuidv4} from 'uuid';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'ai-portfolio';
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || 'resume';
const VECTOR_DIMENSION = 1024; // Adjust if your embedding model uses a different dimension

// Get all entries
export async function GET(req: NextRequest) {
  try {
    const index = pinecone.index(PINECONE_INDEX_NAME);
    const namespace = PINECONE_NAMESPACE;
    // Workaround: similarity search with zero vector and high topK to get all entries
    const zeroVector = Array(VECTOR_DIMENSION).fill(0);
    const stats = await index.describeIndexStats();
    const count = stats.namespaces?.[namespace]?.recordCount || 100;
    const topK = Math.max(100, count);
    const queryResponse = await index.namespace(namespace).query({
      topK,
      vector: zeroVector,
      includeMetadata: true,
      includeValues: false,
      filter: {
        created_at: {
          $lte: Date.now()
        }
      }
    });
    const entries = (queryResponse.matches || []).map((match: any) => ({
      id: match.id,
      content: match.metadata?.content || '',
      createdAt: match.metadata?.createdAt || 0,
    }));
    // Sort by createdAt descending (latest first)
    entries.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ entries });
  } catch (error: any) {
    console.error('[VectorAdmin GET Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch entries.' }, { status: 500 });
  }
}

// Add a new entry
export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid content.' }, { status: 400 });
    }
    const index = pinecone.index(PINECONE_INDEX_NAME);
    const namespace = PINECONE_NAMESPACE;
    const id = uuidv4();
    const now = Date.now();
    // Upsert a new vector with metadata only (vector is ones for now)
    await index.namespace(namespace).upsert([
      {
        id,
        values: Array(VECTOR_DIMENSION).fill(1),
        metadata: {
          content,
          created_at: now,
        },
      },
    ]);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('[VectorAdmin POST Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to add entry.' }, { status: 500 });
  }
}

// Update an entry
export async function PUT(req: NextRequest) {
  try {
    const { id, content } = await req.json();
    if (!id || typeof id !== 'string' || !content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid id/content.' }, { status: 400 });
    }
    const index = pinecone.index(PINECONE_INDEX_NAME);
    const namespace = PINECONE_NAMESPACE;

    const fetchResp = await index.namespace(namespace).fetch([id]);
    const existing = fetchResp.records?.[id];
    const created_at = existing?.metadata?.created_at || Date.now();

    // Upsert with the same id, new content, and updatedAt timestamp
    await index.namespace(namespace).upsert([
      {
        id,
        values: Array(VECTOR_DIMENSION).fill(1), // Keep as ones for now
        metadata: {
          content,
          created_at,
          updated_at: Date.now(),
        },
      },
    ]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[VectorAdmin PUT Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to update entry.' }, { status: 500 });
  }
}

// Delete an entry
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid id.' }, { status: 400 });
    }
    const index = pinecone.index(PINECONE_INDEX_NAME);
    const namespace = PINECONE_NAMESPACE;
    await index.namespace(namespace).deleteOne(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[VectorAdmin DELETE Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to delete entry.' }, { status: 500 });
  }
} 