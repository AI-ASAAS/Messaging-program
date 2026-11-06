---
name: email-comms-platform
description: Design, generate, preview, and dispatch official corporate internal emails matching ASAAS AI visual identity using natural language chat, 12 smart templates, and live Gmail/Outlook rendering. Use when creating or modifying official internal email communications, templates, recipient management, or brand guidelines.
---

# Email Communications Platform

## Goal

Provide an enterprise-grade AI-powered communication platform that turns conversational team prompts (in Arabic or English) into official, brand-compliant corporate emails, with live Gmail and Outlook preview, authenticated recipient selection, and real email dispatch.

## Start With Context

1. Inspect the brand tokens defined in `src/app/globals.css` and `src/asaas-ui/styles/tokens.css` (Gold `#ba9555`, Ink `#221f1f`, Sand `#d3c6b4`, Paper `#fcf9f5`).
2. Review the registered team members in `src/lib/db.ts` across executive, engineering, HR, finance, and product departments.
3. Review the 12 email templates defined in [skills-main/skills-main/ai/email-comms-platform/references/templates-reference.md](skills-main/skills-main/ai/email-comms-platform/references/templates-reference.md).
4. Review the visual identity guidelines in [skills-main/skills-main/ai/email-comms-platform/references/brand-guidelines.md](skills-main/skills-main/ai/email-comms-platform/references/brand-guidelines.md).

## Architecture & Responsibilities

| Layer | Responsibility | Implementation |
| --- | --- | --- |
| **Authentication & Session Lifecycle** | Google / Gmail Sign-in with automatic onboarding, account switching, and secure logout with confirmation dialog. | `LoginModal.tsx` + `Sidebar.tsx` + `/api/auth` |
| **Conversational Studio** | Dual split-screen with natural language chat on one side and live email preview on the other. | `ChatWorkspace.tsx` + `LiveEmailPreview.tsx` |
| **Custom Template Builder** | Create, customize, and manage new corporate templates with custom icons, colors, and schemas. | `CreateTemplateModal.tsx` + `/api/templates` |
| **Intelligence Engine** | Intent classification, template selection, bilingual generation, missing-field detection, and multi-turn edits. | `src/lib/ai-engine.ts` (Gemini API + rule-based fallback) |
| **Email Rendering** | Generates inline-styled, Outlook/Gmail compliant responsive HTML email templates with MSO wrappers. | `src/lib/email-renderer.ts` |
| **Recipient Management** | To, CC, and BCC picker with direct team directory search, "Select All" button, and custom external emails. | `src/components/RecipientSelector.tsx` |
| **Delivery Engine** | Multi-provider email dispatch (Test simulation, Resend API, SMTP) with audit logging. | `src/lib/email-sender.ts` |
| **Persistent Data Store** | Atomic file-persisted JSON database with CRUD for members, emails, brand assets, and logs. | `src/lib/db.ts` |

## The 12 Smart Templates

The platform automatically classifies incoming natural-language prompts into one of 12 corporate templates:

1. `announcement`: Official Announcement (تعميم إداري رسمي معتمد)
2. `meeting_invitation`: Meeting Invitation (دعوة اجتماع رسمي مع بطاقة تقويم)
3. `meeting_followup`: Meeting Follow-up & Minutes (محضر اجتماع ومتابعة قرارات)
4. `project_update`: Project Progress Update (تحديث تقدم المشروع ومؤشر الإنجاز)
5. `task_assignment`: Task Assignment (تكليف بمهام ومسؤوليات رسمية)
6. `internal_notification`: Internal Notification (إشعار إداري داخلي وتنبيه عاجل)
7. `employee_appreciation`: Employee Appreciation (رسالة شكر وتقدير ووسام تميز)
8. `welcome_email`: New Team Member Welcome (ترحيب بانضمام موظف جديد)
9. `request_approval`: Formal Approval Request (طلب اعتماد وموافقة تنفيذية)
10. `weekly_report`: Weekly Status Report (التقرير الأسبوعي ومؤشرات الأداء)
11. `important_reminder`: Important Deadline Reminder (تذكير عاجل وهام بموعد حاسم)
12. `business_correspondence`: Executive Business Letter (مراسلة إدارية عامة)

## Workflow

1. **Intake & Intent Analysis**:
   - User types a prompt (e.g. *"أريد إرسال دعوة اجتماع للفريق يوم الأحد الساعة 10 صباحاً"*).
   - The AI detects language (`ar` or `en`), direction (`rtl` or `ltr`), urgency level, and matches the optimal template.
   - Structured JSON is generated containing formal subject, headline, summary, structured sections (tables, bullet points, callouts), and call-to-action button.

2. **Contextual Refinements**:
   - User can iterate conversationally (e.g. *"اجعل النبرة أكثر رسمية"*, *"أضف ملاحظة بضرورة إحضار اللابتوب"*, *"غير الموعد للأربعاء"*).
   - Previous conversation context is preserved to update the draft in place.

3. **Live Rendering & Verification**:
   - The preview updates instantly side-by-side with Desktop (640px) and Mobile (375px) views.
   - User can preview in Gmail style or Outlook style, or enter direct edit mode to modify text inline.

4. **Recipient Selection & Confirmation**:
   - Choose recipients from the company directory, click "Select All" for company-wide directives, or input external emails.
   - A mandatory security confirmation modal reviews the final recipient count and subject before sending.

5. **Dispatch & Archival**:
   - Dispatches via active provider (Resend, SMTP, or Simulation mode).
   - Generates unique Message-ID, logs transaction in audit history, and saves record to Sent Emails.

## Constraints & Security

- Never dispatch an email without explicit user confirmation in the UI.
- Never expose provider API keys (Resend / SMTP / Gemini) to client bundles; all provider interactions run in Next.js backend API routes.
- Enforce strict HTML sanitization and safe-link protocols (`http`, `https`, `mailto`, `tel`).
- All email layouts must include the official confidentiality disclaimer and company contact details.
