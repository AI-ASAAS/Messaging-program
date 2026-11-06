import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateMemberByEmail, getMembers } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar, provider = 'google', department } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
    }

    const { member, isNew } = findOrCreateMemberByEmail({
      email,
      name,
      avatar,
      provider,
      department,
    });

    return NextResponse.json({
      success: true,
      member,
      isNew,
      message: isNew
        ? `أهلاً بك يا ${member.name}! تم تسجيل دخولك بنجاح وإدراجك تلقائياً في دليل أعضاء الفريق.`
        : `مرحباً بعودتك يا ${member.name}! تم تسجيل الدخول بنجاح.`,
    });
  } catch (error: any) {
    console.error('API /api/auth error:', error);
    return NextResponse.json(
      { error: error.message || 'فشلت عملية المصادقة' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email query parameter is required' }, { status: 400 });
    }

    const member = getMembers().find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
