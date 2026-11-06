import { NextResponse } from 'next/server';
import { getEmails, getMembers, getTemplates } from '@/lib/db';

export async function GET() {
  try {
    const emails = getEmails();
    const members = getMembers();
    const templates = getTemplates();

    const sentEmails = emails.filter((e) => e.status === 'sent');
    const draftEmails = emails.filter((e) => e.status === 'draft');

    // Template usage count
    const templateUsage: Record<string, number> = {};
    emails.forEach((e) => {
      templateUsage[e.templateId] = (templateUsage[e.templateId] || 0) + 1;
    });

    // Department breakdown
    const departmentCounts: Record<string, number> = {};
    members.forEach((m) => {
      departmentCounts[m.department] = (departmentCounts[m.department] || 0) + 1;
    });

    return NextResponse.json({
      stats: {
        totalEmails: emails.length,
        sentCount: sentEmails.length,
        draftCount: draftEmails.length,
        membersCount: members.length,
        templatesCount: templates.length,
      },
      templateUsage,
      departmentCounts,
      recentEmails: emails.slice(0, 5),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
