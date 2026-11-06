---
name: asaas-ui
description: Ayoub's Asaas front-end kit for React + Vite sites, in Arabic RTL. It brings the Thmanyah typeface (Sans, Serif Display, Serif Text, with swash and extended-fatha features), the Asaas ink, gold and sand brand tokens with light and dark themes, liquid-glass components (cards, buttons, fields, modals, toasts, stat tiles, segmented control, pills, icons) and the floating Asaas-robot AI assistant chat widget. Use it whenever Ayoub (or anyone in this account) starts or restyles a website, web app, dashboard, landing page, admin panel or internal tool. Use it too when they ask for "نفس تصميم أساس", "نفس ستايل صندوق أساس", خط ثمانية, glass design, an Arabic/RTL interface or the Asaas assistant robot, even if they don't name the kit. Prefer it over generic styling for any new Asaas-branded front end.
---

# Asaas UI kit

The look of «صندوق أساس» (fund.ai-asaas.com), packaged so any new React + Vite site gets
the same identity in minutes: Thmanyah type, Asaas brand colours, liquid-glass surfaces,
right-to-left Arabic, light/dark themes, and the Asaas robot assistant.

Everything ships as source under `template/`. The install script copies it into the
project (`src/asaas-ui/`), where it belongs to that site and can be edited freely. There is
no package to version or publish.

## Set up a project

1. **Have a React + Vite + TypeScript project.** For a new one:
   `npm create vite@latest <name> -- --template react-ts` then `npm install`.
2. **Install the kit** (keeps existing files; add `--force` to overwrite):
   ```bash
   node "<this skill dir>/scripts/install.mjs" <project-dir>
   ```
   It copies `src/asaas-ui/` and `public/` (logo marks and favicon). It makes `index.html`
   `lang="ar" dir="rtl"` with the theme applied before first paint. It imports
   `asaas-ui/styles/index.css` at the top of `main.tsx` and drops Vite's starter CSS.
3. **Wrap the app:** `<ToastProvider>` around everything, and `<Ambient />` once behind the
   content. Glass needs something to refract: without Ambient the surfaces look flat.
   ```tsx
   import { Ambient, ToastProvider } from './asaas-ui';
   createRoot(root).render(
     <StrictMode>
       <ToastProvider>
         <Ambient />
         <App />
       </ToastProvider>
     </StrictMode>,
   );
   ```
4. **Delete Vite's demo** (`App.css`, the counter, `src/assets/react.svg`), then build pages
   from the kit. Check the page renders in the browser, in both themes and at phone width
   (375px).

Everything is exported from `src/asaas-ui/index.ts`. Read `references/components.md` for each
component's props and copy-ready snippets. Read `references/brand.md` before choosing colours,
type or wording. Read `references/assistant.md` before adding the AI assistant.

## Ground rules (why the kit looks the way it does)

- **RTL first.** The whole document is `dir="rtl"`. Use logical CSS (`margin-inline-start`,
  `padding-inline`, `inset-inline-end`), never `left`/`right` for layout. Forward and next
  point left: `chevronLeft` means "next" or "details".
- **Three Thmanyah cuts, each with a job.** Sans is for the interface and **every number**.
  Serif Display is for headings (`h1`–`h3`, weight 700). Serif Text is for paragraphs and
  descriptions (`.prose` or `var(--font-text)`). Numbers stay in Sans even inside a heading:
  wrap them in `<span className="num">`.
- **Swash on titles, sparingly.** `<Swash>` gives the last letter of a title its swash form.
  Use it once per heading (page title, brand name, modal title) and never on two
  neighbouring words. `<Stretch>` draws the extended fatha («صبَــاح الخير»). It is for one
  greeting or hero word, not for body text.
- **Colour comes from tokens.** Use `var(--accent)`, `var(--text-2)`, `var(--paid)` and the
  other tokens, never hex values in components. That way dark mode works for free.
  `--paid`, `--partial` and `--unpaid` are reserved for state, and always come with an icon
  and a label (`<StatusPill>`), never colour alone.
- **Glass is the surface.** Group content in `<Card>` or `<Glass>`, on top of `<Ambient />`.
  Use `thick` for floating chrome (bars, panels) and `pill` for capsules.
- **Numbers read correctly in Arabic.** Use `formatNumber`, `formatMoney` and
  `formatSigned` from the kit. They use Latin digits with thousands separators, wrapped in
  bidi isolates so signs stay attached. The currency defaults to `ر.ي` (`CURRENCY` in
  `lib/format.ts`).
- **Arabic copy is short, warm and direct.** Write button labels as verbs («حفظ», «تسجيل
  مصروف»). Empty states say what to do next. Errors say what happened and how to fix it.
  Greet with the first name only (`firstName`, `greeting`).
- **Phones are first-class.** Check every page at 375px with no horizontal scroll. Grids
  collapse: `grid--main` and `grid--halves` go to one column under 1080px, and `grid--stats`
  goes to two columns on phones.
  Tap targets stay at least 40px.

## Fonts licence

Thmanyah is licensed for embedding inside a packaged product (see
`src/asaas-ui/fonts/thmanyah/LICENSE-ar.pdf`). Keep the font files under `src/`, where Vite
bundles them with hashed names. Never move them to `public/`, which would serve them as
plain downloads. Before using the kit for someone else's site, make sure the licence covers
that site.

## What is not in the kit

- **The app shell** (sidebar, top bar, mobile tab bar) and auth screens. Each site lays these
  out for its own navigation. Build them from `Glass thick pill` and the `.page` /
  `.toolbar` / `.grid` primitives in `styles/layout.css`.
- **Data fetching.** Use whatever the site needs (TanStack Query worked well in Asaas). The
  components only take props.
- **The assistant's server side.** It is described in `references/assistant.md`.

## Keeping the kit in sync

The kit was extracted from `C:\ayoub\asaas accounting\apps\web` (the Asaas fund). If that app's
look improves and the skill should follow, run `node scripts/assemble-from-fund.cjs`. It
rebuilds `template/` from the fund's files and strips what is specific to the fund.
`template/src/asaas-ui/assistant/` is the general version written for the kit, so the script
leaves it alone. Re-apply your own edits to it by hand.
