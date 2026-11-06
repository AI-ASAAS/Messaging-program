import { NextRequest, NextResponse } from 'next/server';
import { getBrand } from '@/lib/db';
import { sendEmailDispatcher } from '@/lib/email-sender';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subject,
      headline,
      templateId,
      language = 'ar',
      senderName,
      senderEmail,
      to,
      cc = [],
      bcc = [],
      content,
    } = body;

    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json({ error: 'At least one recipient (To) is required.' }, { status: 400 });
    }

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and Content are required.' }, { status: 400 });
    }

    const brand = getBrand();

    const dispatchResult = await sendEmailDispatcher({
      emailRecord: {
        subject,
        headline: headline || subject,
        templateId: templateId || content.templateId || 'announcement',
        language,
        senderName: senderName || brand.officialSignature.signerNameAr,
        senderEmail: senderEmail || brand.supportEmail,
        to,
        cc,
        bcc,
        content,
      },
      brand,
    });

    return NextResponse.json(dispatchResult);
  } catch (error: any) {
    console.error('API /api/emails/send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to dispatch email' },
      { status: 500 }
    );
  }
}
