import { NextRequest, NextResponse } from 'next/server';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

export async function POST(req: NextRequest) {
  try {
    const { raw } = await req.json();
    if (!raw || typeof raw !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid raw input.' }, { status: 400 });
    }

    const response = await generateText({
      model: openrouter('openai/gpt-4o-mini'),
      system: 'You are a helpful assistant that reformats user-provided project or experience details into a single, concise, resume-style bullet point. Use professional language and focus on impact and results.',
      prompt: raw,
      maxTokens: 128,
});

    if (!response.text) {
      return NextResponse.json({ error: 'No text returned from LLM.' }, { status: 500 });
    }

    return NextResponse.json({ resumePoint: response.text.trim() });
  } catch (error: any) {
    console.error('[Reformat API Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to reformat.' }, { status: 500 });
  }
} 