import { BrandIdentity, ChatMessage, EmailContent, TeamMember } from '@/types';
import { getTemplates } from './db';
import { EMAIL_TEMPLATES } from './templates-data';

export interface AIParsedResult {
  email: EmailContent;
  chatResponse: string;
  suggestedRecipients: string[];
  clarifyingQuestions?: string[];
}

export async function processAIChatRequest(params: {
  prompt: string;
  conversationHistory: ChatMessage[];
  currentEmail?: EmailContent | null;
  brand: BrandIdentity;
  members: TeamMember[];
  apiKey?: string;
  model?: string;
}): Promise<AIParsedResult> {
  const { prompt, conversationHistory, currentEmail, brand, members, apiKey, model } = params;

  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (effectiveApiKey) {
    try {
      return await callGeminiLLM({
        prompt,
        conversationHistory,
        currentEmail,
        brand,
        members,
        apiKey: effectiveApiKey,
        model: model || 'gemini-2.5-flash',
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, gracefully falling back to rule-based intelligence engine:', err.message);
    }
  }

  // Graceful rule-based intelligence engine
  return ruleBasedAIEngine({
    prompt,
    conversationHistory,
    currentEmail,
    brand,
    members,
  });
}

async function callGeminiLLM(params: {
  prompt: string;
  conversationHistory: ChatMessage[];
  currentEmail?: EmailContent | null;
  brand: BrandIdentity;
  members: TeamMember[];
  apiKey: string;
  model: string;
}): Promise<AIParsedResult> {
  const { prompt, conversationHistory, currentEmail, brand, members, apiKey, model } = params;

  const membersContext = members
    .map((m) => `- ${m.name} (${m.nameEn}) | Email: ${m.email} | Dept: ${m.department} | Role: ${m.role}`)
    .join('\n');

  const allTemplates = getTemplates();
  const templatesContext = allTemplates.map((t) => `- ID: "${t.id}" | Name: ${t.nameAr} / ${t.nameEn} | Desc: ${t.descriptionAr}`).join('\n');

  const systemInstruction = `
You are the Enterprise Internal Communications AI Assistant for "${brand.companyNameAr}" (${brand.companyNameEn}).
Your job is to convert natural language requests into official, highly polished, formal corporate emails and refine them interactively.

AVAILABLE TEMPLATE IDS:
${templatesContext}

REGISTERED TEAM MEMBERS DIRECTORY:
${membersContext}

GUIDELINES:
1. Detect whether the user is writing in Arabic or English. Respond in the same language.
2. If the user asks for a refinement (e.g. "make it more formal", "add a note about laptops", "change time to 2 PM"), update the existing email structure accordingly while preserving existing good content.
3. Automatically pick the most appropriate templateId among the 12 templates.
4. Format sections nicely: use 'paragraph', 'bullet_list', 'key_value', or 'callout' where suitable (e.g. key_value for meeting date/time/place or approval costs).
5. Suggest realistic recipients from the provided registered team members directory (match by department or name if mentioned), but do NOT automatically force-add them.
6. If critical information is missing (e.g., date of meeting, recipient department, due date), suggest clarifying questions.
7. Always provide an engaging, polite conversational response (chatResponse) explaining what you drafted and what options the user has to refine.

YOU MUST RESPOND WITH PURE JSON matching this schema:
{
  "email": {
    "subject": "string",
    "headline": "string",
    "summary": "string",
    "templateId": "one of the 12 template ids",
    "language": "ar" or "en",
    "urgency": "normal" | "high" | "urgent",
    "sections": [
      {
        "title": "optional string",
        "content": "string text",
        "type": "paragraph" | "bullet_list" | "key_value" | "callout",
        "data": null or array of strings (for bullet_list) or object of key-value pairs (for key_value)
      }
    ],
    "callToAction": {
      "text": "string button text",
      "url": "string url",
      "style": "primary"
    }
  },
  "chatResponse": "Conversational friendly reply to user in Arabic/English",
  "suggestedRecipients": ["email1@ai-asaas.com", "email2@ai-asaas.com"],
  "clarifyingQuestions": ["Question 1", "Question 2"]
}
`;

  const previousContext = conversationHistory
    .slice(-6)
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  const currentEmailContext = currentEmail
    ? `\nCURRENT EXISTING DRAFT:\n${JSON.stringify(currentEmail, null, 2)}\n`
    : '';

  const fullPrompt = `${systemInstruction}

CONVERSATION HISTORY:
${previousContext || 'No previous history.'}
${currentEmailContext}

NEW USER REQUEST:
${prompt}

Respond ONLY with valid JSON. No markdown backticks, no markdown code fence, just the raw JSON object.`;

  // Call Gemini REST endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(cleaned) as AIParsedResult;

  return parsed;
}

function ruleBasedAIEngine(params: {
  prompt: string;
  conversationHistory: ChatMessage[];
  currentEmail?: EmailContent | null;
  brand: BrandIdentity;
  members: TeamMember[];
}): AIParsedResult {
  const { prompt, currentEmail, brand, members } = params;
  const pLower = prompt.toLowerCase();

  const isArabic = /[\u0600-\u06FF]/.test(prompt);
  const lang: 'ar' | 'en' = isArabic ? 'ar' : 'en';

  // Determine intent / template
  let templateId = 'announcement';
  let urgency: 'normal' | 'high' | 'urgent' = 'normal';

  if (pLower.includes('عاجل') || pLower.includes('urgent') || pLower.includes('طارئ') || pLower.includes('مهم جدا')) {
    urgency = 'urgent';
  } else if (pLower.includes('مهم') || pLower.includes('أولوية') || pLower.includes('priority')) {
    urgency = 'high';
  }

  const allTemplates = getTemplates();
  // Check if prompt specifically targets a custom template
  for (const tmpl of allTemplates) {
    if (tmpl.isCustom && (prompt.includes(tmpl.nameAr) || pLower.includes(tmpl.nameEn.toLowerCase()) || pLower.includes(tmpl.slug))) {
      templateId = tmpl.id;
      break;
    }
  }

  if (pLower.includes('اجتماع') || pLower.includes('meeting') || pLower.includes('دعوة') || pLower.includes('لقاء') || pLower.includes('ورشة')) {
    if (pLower.includes('محضر') || pLower.includes('متابعة') || pLower.includes('follow-up') || pLower.includes('minutes') || pLower.includes('مخرجات')) {
      templateId = 'meeting_followup';
    } else {
      templateId = 'meeting_invitation';
    }
  } else if (pLower.includes('مشروع') || pLower.includes('project') || pLower.includes('تقدم') || pLower.includes('إنجاز')) {
    templateId = 'project_update';
  } else if (pLower.includes('تكليف') || pLower.includes('مهمة') || pLower.includes('task') || pLower.includes('مسؤولية')) {
    templateId = 'task_assignment';
  } else if (pLower.includes('شكر') || pLower.includes('تقدير') || pLower.includes('appreciation') || pLower.includes('thanks') || pLower.includes('تهنئة')) {
    templateId = 'employee_appreciation';
  } else if (pLower.includes('ترحيب') || pLower.includes('welcome') || pLower.includes('انضمام') || pLower.includes('عضو جديد')) {
    templateId = 'welcome_email';
  } else if (pLower.includes('اعتماد') || pLower.includes('موافقة') || pLower.includes('طلب') || pLower.includes('approval') || pLower.includes('شراء')) {
    templateId = 'request_approval';
  } else if (pLower.includes('أسبوعي') || pLower.includes('weekly') || pLower.includes('تقرير')) {
    templateId = 'weekly_report';
  } else if (pLower.includes('تذكير') || pLower.includes('reminder') || pLower.includes('موعد نهائي') || pLower.includes('deadline')) {
    templateId = 'important_reminder';
  } else if (pLower.includes('إشعار') || pLower.includes('notification') || pLower.includes('تنبيه') || pLower.includes('تأجيل') || pLower.includes('تغيير')) {
    templateId = 'internal_notification';
  } else if (pLower.includes('تعميم') || pLower.includes('announcement') || pLower.includes('قرار')) {
    templateId = 'announcement';
  } else {
    templateId = currentEmail?.templateId || 'business_correspondence';
  }

  // Check if user is asking to modify existing email
  const isModification = !!currentEmail && (
    pLower.includes('رسمي') ||
    pLower.includes('formal') ||
    pLower.includes('أضف') ||
    pLower.includes('احذف') ||
    pLower.includes('غير') ||
    pLower.includes('change') ||
    pLower.includes('عدل') ||
    pLower.includes('اختصر') ||
    pLower.includes('shorten')
  );

  // Suggested recipients matching
  const suggestedRecipients: string[] = [];
  if (pLower.includes('فريق') || pLower.includes('الكل') || pLower.includes('team') || pLower.includes('all') || templateId === 'announcement') {
    suggestedRecipients.push(...members.slice(0, 5).map((m) => m.email));
  } else {
    for (const m of members) {
      if (prompt.includes(m.name) || pLower.includes(m.nameEn.toLowerCase()) || prompt.includes(m.department)) {
        suggestedRecipients.push(m.email);
      }
    }
    if (suggestedRecipients.length === 0) {
      suggestedRecipients.push(members[0].email, members[1].email);
    }
  }

  // Build the email structure based on template
  let email: EmailContent;

  if (templateId === 'meeting_invitation') {
    const isTuesday = pLower.includes('الثلاثاء') || pLower.includes('tuesday');
    const isSunday = pLower.includes('الأحد') || pLower.includes('sunday');
    const dayText = isTuesday ? 'الثلاثاء' : isSunday ? 'الأحد' : 'الأحد القادم';
    const dayTextEn = isTuesday ? 'Tuesday' : isSunday ? 'Sunday' : 'Next Sunday';

    email = {
      subject: isArabic
        ? `دعوة لاجتماع الفريق: مناقشة مستجدات العمل - يوم ${dayText} 10:00 صباحاً`
        : `Meeting Invitation: Team Synchronization - ${dayTextEn} at 10:00 AM`,
      headline: isArabic
        ? `دعوة رسمية لحضور اجتماع الفريق الدوري`
        : `Official Team Synchronization Meeting`,
      summary: isArabic
        ? `يسعدنا دعوتكم لحضور اجتماع الفريق المقرر لمراجعة سير العمل ومناقشة الأولويات والخطط القادمة لضمان المواءمة المستمرة بين كافة الإدارات.`
        : `You are cordially invited to attend the scheduled team meeting to review operational progress and align on upcoming priorities.`,
      templateId: 'meeting_invitation',
      language: lang,
      urgency,
      sections: [
        {
          title: isArabic ? 'تفاصيل الموعد والمكان' : 'Session Schedule & Dial-in',
          content: isArabic ? 'بيانات انعقاد الاجتماع الرسمي' : 'Logistical details for attendance',
          type: 'key_value',
          data: isArabic
            ? {
                'اليوم والتاريخ': `${dayText}، الموافق 10 نوفمبر 2026`,
                'التوقيت': '10:00 ص - 11:00 ص (بتوقيت مكة المكرمة)',
                'الموقع': 'قاعة الاجتماعات الرئيسية (برج أساس) ورابط الاتصال المرئي',
                'المنسق': 'إدارة العمليات والتحول الرقمي',
              }
            : {
                Date: `${dayTextEn}, November 10, 2026`,
                Time: '10:00 AM - 11:00 AM (AST)',
                Location: 'Main Boardroom (Asaas Tower) & Microsoft Teams',
                Organizer: 'Digital Operations & Transformation',
              },
        },
        {
          title: isArabic ? 'جدول الأعمال الرئيسي' : 'Meeting Agenda',
          content: isArabic ? 'المحاور الأساسية للنقاش' : 'Key topics to be covered',
          type: 'bullet_list',
          data: isArabic
            ? [
                'مراجعة الإنجازات المحققة خلال الأسبوع المنصرم ومناقشة مؤشرات الأداء.',
                'استعراض خطة الإطلاق للمرحلة القادمة وجدول التسليم الزمني.',
                'مناقشة التحديات التقنية واللوجستية وتوزيع أدوار الدعم.',
                'فتح باب الأسئلة والمقترحات المفتوحة لكافة أعضاء الفريق.',
              ]
            : [
                'Review of milestone accomplishments and KPI deliverables.',
                'Walkthrough of the upcoming deployment roadmap and timeline.',
                'Open discussion on dependencies, blockers, and resource allocation.',
                'Q&A and open floor for team feedback.',
              ],
        },
        {
          title: isArabic ? 'إرشادات التحضير المسبق' : 'Required Preparation',
          content: isArabic
            ? 'يرجى من كافة الزملاء الحضور قبل الموعد بـ 5 دقائق، والتأكد من تحديث المهام على منصة المشاريع الداخلية قبل الاجتماع.'
            : 'Please join 5 minutes prior to start time and ensure your assigned board tasks are up to date.',
          type: 'callout',
        },
      ],
      callToAction: {
        text: isArabic ? 'الانضمام للاجتماع الافتراضي عبر Teams' : 'Join Virtual Meeting on Teams',
        url: 'https://teams.microsoft.com/l/meetup-join/asaas-comms',
        style: 'primary',
      },
    };
  } else if (templateId === 'internal_notification') {
    email = {
      subject: isArabic
        ? `إشعار إداري داخلي: تحديث تنظيمي بخصوص مواعيد العمل والتنسيق الداخلي`
        : `Internal Notification: Schedule Adjustment & Operational Notice`,
      headline: isArabic ? `إشعار إداري رسمي لمنسوبي الشركة` : `Internal Operational Notice`,
      summary: isArabic
        ? `نحيطكم علماً بصدور التحديث الإداري الموضح أدناه، ونرجو من جميع الزملاء التكرم بالإحاطة ومراعاة الترتيبات الجديدة.`
        : `Please be notified of the following organizational update. All team members are requested to take note.`,
      templateId: 'internal_notification',
      language: lang,
      urgency: urgency === 'normal' ? 'high' : urgency,
      sections: [
        {
          title: isArabic ? 'بيانات التحديث الإداري' : 'Notice Highlights',
          content: isArabic ? 'تفاصيل القرار والتنفيذ' : 'Summary of changes',
          type: 'key_value',
          data: isArabic
            ? {
                'موضوع الإشعار': prompt.slice(0, 60),
                'الفئات المشمولة': 'كافة الإدارات وفرق العمل',
                'تاريخ السريان': 'فوري ابتداءً من تاريخ هذا البريد',
                'جهة المتابعة': 'الموارد البشرية والشؤون الإدارية',
              }
            : {
                Subject: prompt.slice(0, 60),
                AppliesTo: 'All Departments & Personnel',
                EffectiveDate: 'Immediate',
                Contact: 'HR & Administrative Office',
              },
        },
        {
          title: isArabic ? 'التوجيهات والإجراء المطلوب' : 'Required Actions',
          content: isArabic
            ? 'يُرجى من مدراء الفرق التنسيق مع أعضاء فرقهم لضمان انسيابية العمل وعدم تأثر الجداول التشغيلية.'
            : 'Team managers are kindly requested to coordinate with their respective teams to ensure business continuity.',
          type: 'paragraph',
        },
      ],
      callToAction: {
        text: isArabic ? 'الاطلاع على وثيقة الإجراءات في البوابة الداخلية' : 'View Full Policy in Internal Portal',
        url: 'https://ai-asaas.com/portal/policies',
        style: 'primary',
      },
    };
  } else if (templateId === 'employee_appreciation') {
    email = {
      subject: isArabic
        ? `رسالة شكر وتقدير: إشادة بجهود الزملاء المتميزة والمساهمات الاستثنائية`
        : `Recognition & Appreciation: Celebrating Outstanding Team Contributions`,
      headline: isArabic ? `وسام التميز والتقدير المؤسسي` : `Corporate Recognition of Excellence`,
      summary: isArabic
        ? `تتقدم الإدارة التنفيذية بجزيل الشكر والامتنان للجهود المميزة والتفاني المستمر في تحقيق مستهدفات الشركة وإنجاز الأعمال بأعلى معايير الإتقان.`
        : `Executive leadership expresses sincere gratitude and appreciation for the outstanding dedication and craftsmanship demonstrated by our colleagues.`,
      templateId: 'employee_appreciation',
      language: lang,
      urgency: 'normal',
      sections: [
        {
          title: isArabic ? 'أبرز الإنجازات المشاد بها' : 'Key Commendations',
          content: isArabic ? 'المساهمات ذات الأثر الملموس' : 'Notable impacts and achievements',
          type: 'bullet_list',
          data: isArabic
            ? [
                'الالتزام الاستثنائي وسرعة الاستجابة في تسليم مخرجات العمل الحيوية.',
                'روح التعاون العالية والعمل الجماعي المثمر بين مختلف الأقسام.',
                'تقديم حلول إبداعية مبتكرة ساهمت في تجاوز التحديات بنجاح.',
              ]
            : [
                'Exceptional dedication and agility in delivering core deliverables.',
                'Exemplary collaborative teamwork across cross-functional departments.',
                'Innovative creative problem-solving that drove remarkable project success.',
              ],
        },
        {
          title: isArabic ? 'كلمة الإدارة' : 'Leadership Quote',
          content: isArabic
            ? '«إن رأس مال شركة أساس الحقيقي هو هذه الكفاءات الوطنية المبدعة التي تصنع الفارق يومياً. شكراً لكل من وضع بصمته وألهم من حوله.»'
            : '"The true cornerstone of ASAAS AI Enterprise is our exceptional talent whose dedication redefines excellence every single day."',
          type: 'callout',
        },
      ],
    };
  } else if (templateId === 'project_update') {
    email = {
      subject: isArabic
        ? `تقرير تقدم المشروع: ملخص المنجزات والمراحل القادمة`
        : `Project Status Report: Milestone Progress & Upcoming Deliverables`,
      headline: isArabic ? `تحديث رسمي حول سير تقدم المشروع` : `Official Project Progress Briefing`,
      summary: isArabic
        ? `يسعدنا مشاركتكم هذا التحديث الدوري حول تقدم أعمال المشروع، مستعرضين أهم المعالم المكتملة ونسب الإنجاز العامة والخطوات المستقبلية.`
        : `We are pleased to share this status update on our project roadmap, highlighting accomplished milestones, completion rates, and next steps.`,
      templateId: 'project_update',
      language: lang,
      urgency,
      sections: [
        {
          title: isArabic ? 'مؤشرات الإنجاز العامة' : 'Milestone KPI Scorecard',
          content: isArabic ? 'نظرة سريعة على حالة المشروع' : 'Project health at a glance',
          type: 'key_value',
          data: isArabic
            ? {
                'نسبة الإنجاز الإجمالية': '88% (متقدم عن الجدول الزمني)',
                'المرحلة الحالية': 'المرحلة الثالثة: الاختبارات النهائية والاعتماد',
                'الموعد المستهدف للإطلاق': 'نهاية الشهر الجاري 2026',
                'مستوى المخاطر': 'منخفض — كافة المعالم تسير وفق الخطة',
              }
            : {
                OverallProgress: '88% (Ahead of schedule)',
                CurrentPhase: 'Phase 3: Integration & User Acceptance Testing',
                TargetLaunch: 'End of November 2026',
                RiskLevel: 'Low — all dependencies cleared',
              },
        },
        {
          title: isArabic ? 'أبرز الإنجازات المكتملة' : 'Completed Milestones',
          content: isArabic ? 'تم بحمد الله إتمام ما يلي' : 'The following initiatives have been finalized',
          type: 'bullet_list',
          data: isArabic
            ? [
                'اكتمال ربط واجهات برمجة التطبيقات بنجاح واجتياز اختبارات الأمان.',
                'الانتهاء من صياغة وتصميم القوالب المؤسسية الرسمية الـ 12.',
                'مواءمة الهوية البصرية والخطوط الطباعية الرسمية (Thmanyah).',
              ]
            : [
                'Full backend API contract validation and security compliance passed.',
                'Completed design and responsive rendering for all 12 smart email templates.',
                'Incorporated brand identity tokens and authentic Thmanyah typography.',
              ],
        },
      ],
      callToAction: {
        text: isArabic ? 'فتح لوحة متابعة المشروع' : 'View Project Dashboard',
        url: 'https://ai-asaas.com/pmo/tracker',
        style: 'primary',
      },
    };
  } else {
    // General Announcement / Correspondence
    email = {
      subject: isArabic
        ? `تعميم إداري رسمي: ${prompt.slice(0, 45)}`
        : `Executive Directive: ${prompt.slice(0, 45)}`,
      headline: isArabic ? `تعميم إداري رسمي معتمد` : `Official Corporate Communication`,
      summary: isArabic
        ? `بناءً على توجيهات الإدارة وحرصاً على تعزيز كفاءة العمل والتنسيق المشترك، نود إحاطتكم بما ورد في هذا الخطاب الرسمي.`
        : `In accordance with corporate directives and to enhance organizational agility, please review the following formal communication.`,
      templateId,
      language: lang,
      urgency,
      sections: [
        {
          title: isArabic ? 'البيان والتفاصيل' : 'Statement & Details',
          content: prompt,
          type: 'paragraph',
        },
        {
          title: isArabic ? 'التوجيهات والقرارات المنفذة' : 'Directives & Instructions',
          content: isArabic ? 'يرجى الالتزام بالبنود التالية' : 'Please observe the following guidelines',
          type: 'bullet_list',
          data: isArabic
            ? [
                'العمل بما ورد في هذا التعميم اعتباراً من تاريخ صدوره.',
                'مراعاة التنسيق مع رؤساء الأقسام المعنية لتنفيذ الإجراءات بسلاسة.',
                'الرجوع للإدارة العامة في حال وجود أي استفسارات أو متطلبات إضافية.',
              ]
            : [
                'Observe and implement the directives effective immediately.',
                'Coordinate with respective department heads for seamless execution.',
                'Contact executive administration for any clarifications.',
              ],
        },
      ],
      callToAction: {
        text: isArabic ? 'تأكيد الاطلاع وتوثيق الاستلام' : 'Acknowledge Receipt',
        url: 'https://ai-asaas.com/comms/ack',
        style: 'primary',
      },
    };
  }

  const templateName = EMAIL_TEMPLATES.find((t) => t.id === templateId)?.nameAr || 'البريد الرسمي';

  const chatResponse = isArabic
    ? `لقد قمت بتحليل طلبك وصياغة بريد إلكتروني رسمي متكامل باستخدام قالب **«${templateName}»** وفق الهوية البصرية المعتمدة لشركة أساس.

✨ **ما تم إنجازه تلقائياً:**
- اختيار القالب الأنسب لطبيعة رسالتك (${templateName}).
- صياغة عنوان رسمي جذاب ومحتوى متكامل مدعوم بالجداول والبنود المنظمة.
- تطبيق ألوان وهوية الشركة الرسمية والشعار والتوقيع المعتمد.
- اقتراح المستلمين المعنيين من دليل أعضاء الفريق (${suggestedRecipients.length} مستلم).

تستطيع مراجعة شكل الإيميل فوراً في **المعاينة المباشرة** بجانب المحادثة، أو طلب أي تعديل (مثل: "اجعله أكثر رسمية"، "أضف ملاحظة"، "غير الموعد").`
    : `I have analyzed your request and crafted a comprehensive corporate email using the **"${EMAIL_TEMPLATES.find((t) => t.id === templateId)?.nameEn || 'Corporate'}"** template matching ASAAS AI Enterprise brand guidelines.

✨ **What was generated:**
- Selected optimal template based on your intent.
- Drafted executive subject line, formatted structured sections, and actionable next steps.
- Applied company visual identity, Thmanyah typography, and certified signature.
- Suggested ${suggestedRecipients.length} relevant team member recipients.

You can inspect the instant result in the **Live Preview** pane, switch between Desktop/Mobile, or ask me for any refinements!`;

  return {
    email,
    chatResponse,
    suggestedRecipients,
    clarifyingQuestions:
      templateId === 'meeting_invitation'
        ? [
            isArabic ? 'هل تود إضافة رابط مكالمة Teams أو Zoom محدد؟' : 'Would you like to provide a specific Teams or Zoom link?',
            isArabic ? 'هل هناك ملفات أو عروض تقديمية ترغب بإرفاقها مسبقاً؟' : 'Are there any pre-read decks to attach?',
          ]
        : undefined,
  };
}
