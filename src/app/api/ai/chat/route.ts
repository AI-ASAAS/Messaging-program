import { NextRequest, NextResponse } from 'next/server';
import { processAIChatRequest } from '@/lib/ai-engine';
import { getBrand, getMembers, getSettings } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, conversationHistory = [], currentEmail = null } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const brand = getBrand();
    const members = getMembers();
    const settings = getSettings();

    const result = await processAIChatRequest({
      prompt,
      conversationHistory,
      currentEmail,
      brand,
      members,
      apiKey: settings.ai.apiKey,
      model: settings.ai.model,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/ai/chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing AI chat' },
      { status: 500 }
    );
  }
}
