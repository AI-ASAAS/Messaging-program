import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { BrandIdentity, EmailRecord } from '@/types';
import { getSettings, getTemplates, saveEmailRecord } from './db';
import { renderEmailHtml } from './email-renderer';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  provider: 'resend' | 'smtp' | 'test';
  timestamp: string;
  error?: string;
}

export async function sendEmailDispatcher(params: {
  emailRecord: Omit<EmailRecord, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'renderedHtml' | 'provider'>;
  brand: BrandIdentity;
}): Promise<{ record: EmailRecord; result: SendEmailResult }> {
  const { emailRecord, brand } = params;

  if (!emailRecord.to || emailRecord.to.length === 0) {
    throw new Error('At least one primary recipient (To) is required.');
  }

  const settings = getSettings().email;
  const renderedHtml = renderEmailHtml(emailRecord.content, brand, getTemplates());

  const emailId = `em-${Date.now()}`;
  const now = new Date().toISOString();

  let result: SendEmailResult;

  // 1. Resend Provider
  if (settings.activeProvider === 'resend' && settings.resendApiKey && !settings.testMode) {
    try {
      const resend = new Resend(settings.resendApiKey);
      const res = await resend.emails.send({
        from: `${settings.senderName || brand.companyNameEn} <${settings.senderAddress || 'onboarding@resend.dev'}>`,
        to: emailRecord.to,
        cc: emailRecord.cc.length > 0 ? emailRecord.cc : undefined,
        bcc: emailRecord.bcc.length > 0 ? emailRecord.bcc : undefined,
        subject: emailRecord.subject,
        html: renderedHtml,
      });

      if (res.error) {
        throw new Error(res.error.message);
      }

      result = {
        success: true,
        messageId: res.data?.id || `resend-${Date.now()}`,
        provider: 'resend',
        timestamp: now,
      };
    } catch (err: any) {
      result = {
        success: false,
        provider: 'resend',
        timestamp: now,
        error: err.message || 'Resend delivery failed',
      };
    }
  }
  // 2. SMTP Provider
  else if (
    settings.activeProvider === 'smtp' &&
    settings.smtpHost &&
    settings.smtpPort &&
    !settings.testMode
  ) {
    try {
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpSecure ?? false,
        auth: settings.smtpUser
          ? {
              user: settings.smtpUser,
              pass: settings.smtpPass || '',
            }
          : undefined,
      });

      const info = await transporter.sendMail({
        from: `"${settings.senderName || brand.companyNameEn}" <${settings.senderAddress}>`,
        to: emailRecord.to.join(', '),
        cc: emailRecord.cc.join(', '),
        bcc: emailRecord.bcc.join(', '),
        subject: emailRecord.subject,
        html: renderedHtml,
      });

      result = {
        success: true,
        messageId: info.messageId,
        provider: 'smtp',
        timestamp: now,
      };
    } catch (err: any) {
      result = {
        success: false,
        provider: 'smtp',
        timestamp: now,
        error: err.message || 'SMTP delivery failed',
      };
    }
  }
  // 3. Test / Simulation Engine (Default out-of-the-box mode)
  else {
    // Simulate real enterprise network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 600));

    result = {
      success: true,
      messageId: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      provider: 'test',
      timestamp: now,
    };
  }

  const finalRecord: EmailRecord = {
    ...emailRecord,
    id: emailId,
    renderedHtml,
    status: result.success ? 'sent' : 'failed',
    sentAt: result.success ? now : undefined,
    createdAt: now,
    updatedAt: now,
    provider: result.provider,
    providerResponse: result,
    errorMessage: result.error,
  };

  saveEmailRecord(finalRecord);

  return { record: finalRecord, result };
}
