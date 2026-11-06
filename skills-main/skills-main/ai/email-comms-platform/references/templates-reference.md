# Smart Templates Reference

This reference documents the 12 corporate email templates implemented in the platform, their categories, layout components, and data schemas.

## Template Matrix

| ID | Name (AR) | Name (EN) | Category | Distinctive UI Elements |
| --- | --- | --- | --- | --- |
| `announcement` | تعميم إداري رسمي | Official Announcement | Announcements | Executive seal header, numbered directives, corporate governance bar |
| `meeting_invitation` | دعوة اجتماع رسمي | Meeting Invitation | Meetings | Calendar card with date/time, agenda items, Teams dial-in CTA button |
| `meeting_followup` | محضر ومتابعة اجتماع | Meeting Follow-up & Minutes | Meetings | Summary of discussions, action items table (Task, Owner, Deadline) |
| `project_update` | تحديث تقدم المشروع | Project Progress Update | Projects | KPI scorecard, milestone completion percentage, blocker alert |
| `task_assignment` | تكليف بمهام ومسؤوليات | Task Assignment | Projects | Priority badge (Urgent/High/Normal), deliverables scope, due date |
| `internal_notification` | إشعار إداري داخلي | Internal Notification | Announcements | High-visibility attention card, affected departments, effective date |
| `employee_appreciation` | شكر وتقدير لموظف/فريق | Employee Appreciation | HR | Gold laurel award medallion, employee spotlight, leadership quote |
| `welcome_email` | ترحيب بعضو جديد بالفريق | New Team Member Welcome | HR | Welcome header banner, employee intro profile, onboarding checklist |
| `request_approval` | طلب موافقة واعتماد رسمي | Formal Approval Request | Approvals | Request justification, cost/budget table, approve/reject buttons |
| `weekly_report` | التقرير الأسبوعي للإنجازات | Weekly Status Report | Projects | Executive highlights, department KPI table, priorities ahead |
| `important_reminder` | تذكير عاجل وهام | Important Deadline Reminder | Announcements | Red urgency alert banner, deadline countdown notice, required actions |
| `business_correspondence` | مراسلة إدارية عامة | Executive Business Letter | General | Corporate letterhead, protocol salutation, structured paragraphs |

## Section Data Schemas

Each template renders an array of `sections` defined by `EmailSection`:

```ts
export interface EmailSection {
  title?: string;
  content: string;
  type: 'paragraph' | 'key_value' | 'bullet_list' | 'callout' | 'table';
  data?: Record<string, string> | Array<Record<string, string>> | string[];
}
```

### 1. `key_value`
Renders a high-contrast corporate metadata table:
```json
{
  "title": "تفاصيل الموعد والمكان",
  "content": "بيانات انعقاد الاجتماع الرسمي",
  "type": "key_value",
  "data": {
    "اليوم والتاريخ": "الأحد، 10 نوفمبر 2026",
    "التوقيت": "10:00 ص - 11:00 ص (بتوقيت مكة المكرمة)",
    "الموقع": "قاعة الاجتماعات الرئيسية (برج أساس) ورابط Teams"
  }
}
```

### 2. `bullet_list`
Renders bullet items styled with the primary brand color square:
```json
{
  "title": "جدول الأعمال الرئيسي",
  "content": "المحاور الأساسية للنقاش",
  "type": "bullet_list",
  "data": [
    "مراجعة الإنجازات المحققة خلال الأسبوع المنصرم ومناقشة مؤشرات الأداء.",
    "استعراض خطة الإطلاق للمرحلة القادمة وجدول التسليم الزمني.",
    "مناقشة التحديات التقنية واللوجستية وتوزيع أدوار الدعم."
  ]
}
```

### 3. `callout`
Renders a highlighted alert block with left/right brand border accent:
```json
{
  "title": "إرشادات التحضير المسبق",
  "content": "يرجى من كافة الزملاء الحضور قبل الموعد بـ 5 دقائق وتجهيز تقارير الإدارات.",
  "type": "callout"
}
```
