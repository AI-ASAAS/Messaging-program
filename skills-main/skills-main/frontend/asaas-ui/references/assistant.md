# The Asaas robot assistant

The floating robot at the bottom of the page opens a small glass chat window, which takes the
full screen on phones. The full waving robot is the launcher and welcomes the user. Inside the
chat only its face shows, in four moods: `smile` in the header, `happy` on replies,
`waiting` while typing, and `celebrate` when a reply carries attachments. The greeting uses
the first name: «مساء الخير يا أيوب».

The kit has the **interface only**. The site provides an `ask` function that calls its own
server.

## Mount it

```tsx
import { AssistantWidget, type AssistantMessage } from './asaas-ui';

<AssistantWidget
  user={{ id: me.id, displayName: me.displayName }}
  ask={(messages: AssistantMessage[]) => api.post('/assistant', { messages })} // → { reply, attachments? }
  title="مساعد أساس"
  subtitle="اسأل عن بياناتك"
  suggestions={['كم الرصيد الآن؟', 'من لم يدفع هذا الشهر؟']}
  intro="اسأل عن أي شيء في الموقع وسأجيبك من بياناته."
  disclaimer="يجيب من بيانات الموقع فقط وقد يخطئ."
  renderAttachment={(a) => <MyConfirmCard proposal={a} />} // optional
/>
```

- Mount it once, inside the signed-in layout, so `user` is known. The chat is kept in
  `sessionStorage` per user id. Clear `sessionStorage` on sign-out so the next person on the
  same browser doesn't see it.
- Only the **last 8 messages** are sent. Long threads made smaller models drift into earlier
  answers.
- Errors thrown by `ask` show inline with «إعادة المحاولة» (retry). Throw an `Error` with a
  readable Arabic message.
- Show the widget only when the server has the assistant switched on (for example, a
  `GET /assistant/status`). Otherwise the robot leads nowhere.

## Server side: what worked in Asaas

The fund's implementation lives in `C:\ayoub\asaas accounting\apps\server\src`:
`application/assistant/AskAssistant.ts`, `interfaces/assistant/tools.ts` and
`infrastructure/ai/OpenRouterChatModel.ts`. Reuse its design:

- **One endpoint**, `POST /api/assistant { messages }` → `{ reply, attachments }`, behind the
  normal session check, with a per-user rate limit (60 per hour).
- **The model reads through tools, not the database.** Each tool wraps the same use cases as
  the HTTP API, and results are trimmed to what the question needs. Don't send personal
  details the model doesn't need, such as phone numbers.
- **Writes are proposals, never actions.** Write tools only validate and return a card. The
  user presses «تأكيد», and that goes through the site's normal endpoint with its normal
  permission checks. The assistant itself can never save, edit or delete.
- **Filter tools by role on the server.** Users who can only view are never offered write
  tools.
- **Force a data lookup on the first step of every question** (`tool_choice: 'required'`).
  Without it, models sometimes answered later questions from memory and invented names.
- **Use a short system prompt with a glossary** of the site's terms, and add a reminder
  before the last message to answer that message only and re-fetch the numbers.
- **Scope:** refuse anything outside the site with one fixed sentence.
- **Privacy:** with OpenRouter, send `provider: { data_collection: 'deny' }`.
