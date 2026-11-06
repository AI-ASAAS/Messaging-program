import { NextRequest, NextResponse } from 'next/server';
import { deleteEmailRecord, getEmailById, getEmails, saveEmailRecord } from '@/lib/db';
import { EmailRecord } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q')?.toLowerCase();

    let emails = getEmails();

    if (status) {
      emails = emails.filter((e) => e.status === status);
    }

    if (q) {
      emails = emails.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.senderName.toLowerCase().includes(q) ||
          e.to.some((recipient) => recipient.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ emails });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const record: EmailRecord = {
      ...body,
      id: body.id || `em-${Date.now()}`,
      status: body.status || 'draft',
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = saveEmailRecord(record);
    return NextResponse.json({ email: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Email ID is required' }, { status: 400 });
    }
    const success = deleteEmailRecord(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
