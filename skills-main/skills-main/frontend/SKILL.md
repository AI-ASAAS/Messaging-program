---
name: frontend
description: Design, create, or extend maintainable ASAAS front ends with React, Vite and TypeScript, in Arabic RTL with an optional English version. Use for new websites, web apps, dashboards or admin panels, new pages and components, styling, forms, data loading, translation, accessibility, or front-end structure reviews. Pair it with the asaas-ui task skill for the visual kit.
---

# Frontend Foundation

## Goal

Build fast, accessible, easy-to-change front ends that look like ASAAS, read correctly in Arabic (and in English when asked for), and stay simple enough for any developer or AI agent to continue.

## Start With Context

Before proposing or changing code:

1. Read the repository instructions and existing documentation.
2. Inspect `package.json`, the folder layout, the routes, and a couple of representative pages and components.
3. Preserve established conventions when working in an existing project unless the user explicitly asks to change them.
4. Confirm the scope before adding a new library, a state manager, a CSS framework, or a testing setup.

For a new project, use the defaults in this skill.

## New Project Intake

Before scaffolding, make sure the user has described what the site or app is for. Establish:

- Who uses it, on which devices (assume phones first), and in which languages.
- The pages or screens and the main action on each one.
- Where the content comes from: written in code, loaded from an API, or edited by the team in a dashboard.
- Whether it needs sign-in, forms, or a chat or assistant widget.
- Hosting, and whether the backend serves the built files.

Ask focused questions only for what would change the structure. For a small prototype, state your assumptions and keep them easy to change.

## Default Stack

- React with TypeScript, built with Vite.
- `react-router-dom` for routes; pages are lazy-loaded.
- The `asaas-ui` kit (task skill `asaas-ui`) for tokens, fonts, glass components, icons, toasts and the assistant widget. It is copied into the project as source, so the project owns it.
- Plain CSS with design tokens: one stylesheet per concern. No CSS framework unless the project already has one.
- `fetch` through one small typed API client, and local state plus React context. Add a data library (such as TanStack Query) only when caching or mutations become hard to manage by hand.
- `tsc` for types and `oxlint` (or the project's linter) for style.

## Structure

```text
src/
|-- asaas-ui/      The kit (tokens, fonts, components). Edit freely; it belongs to the project.
|-- components/    Shared site components: header, footer, cards, page blocks.
|-- pages/         One file per route. Lazy-loaded from App.tsx.
|-- content/       Fixed interface text and default copy (the dictionary for each language).
|-- lib/           API client, data hooks, small helpers.
|-- styles/        Site-level CSS layered on top of the kit.
|-- App.tsx        Routes only.
`-- main.tsx       Providers and the render call.
```

Dependencies flow one way: pages use components, components use the kit and `lib`, and nothing in `asaas-ui` imports from the site. Read [references/patterns.md](references/patterns.md) when creating a project, deciding where something belongs, or wiring data, language or tracking.

## Implementation Rules

- **Tokens, not hex values.** Colours, radii and spacing come from CSS variables so dark mode and the brand stay consistent.
- **RTL first, with logical CSS.** Use `margin-inline`, `padding-inline`, `inset-inline`, and `text-align: start`; avoid `left` and `right` for layout. A "next" chevron points left in Arabic, so use the kit's `Icon`, which mirrors itself in English.
- **No text in components when it can be avoided.** Fixed interface words go through the dictionary function (`t('key')`); content that the team edits comes from the API. Never leave an Arabic-only string in a page that has an English version.
- **One place for data access.** Components call the shared API client or hook, never `fetch` directly. Show a loading state, an error state with a retry, and an empty state.
- **Forms.** Controlled fields with real labels, native validation attributes, a disabled and labelled submit while sending, a visible server error, and a hidden honeypot field on public forms.
- **Links from data are untrusted.** Pass any URL that came from the API or a dashboard through a safe-link check (only `http`, `https`, `mailto`, `tel` and same-site paths) before rendering it.
- **No `dangerouslySetInnerHTML`** with content that is not fixed in the code.
- **Content Security Policy friendly.** Do not add inline `<script>` tags or load scripts from other origins. Put start-up code (such as setting the theme and direction before first paint) in a small file under `public/` and load it from `index.html`. Inline `style` attributes for CSS variables are fine.
- **Small, focused components.** Split a file when it holds more than one idea, not before. Keep a component's props simple and typed; no `any`.
- **Performance.** Lazy-load routes and heavy widgets, give images width and height, use modern formats, and do not ship large assets that a page does not show.

## Accessibility And Responsiveness

- Use the right element: `button` for actions, `a` for navigation, headings in order, one `h1` per page.
- Every control is reachable and visible with the keyboard, with a clear focus style. Modals trap focus and close with Escape.
- Text and icons keep enough contrast in both themes. State is never shown by colour alone.
- Respect `prefers-reduced-motion`: turn animations off or make them instant.
- Test every page at **375px** with no horizontal scroll, and at tablet and desktop widths. Tap targets are at least 40px.
- Set `lang` and `dir` on the document, and update them when the language changes.

## Testing And Verification

Pick the smallest check that proves the change:

1. `tsc -b` and the linter pass, and `npm run build` succeeds.
2. Open the page in a browser and check it in light and dark themes, at phone width, and in each language.
3. Look at the browser console for errors, especially Content Security Policy violations.
4. Exercise the main action (submit the form, open the modal, switch the language) and one failure path.
5. Add automated tests when the project already has a test runner or the logic is easy to get wrong (formatters, validators, data mapping). Do not introduce a test framework for a static page.

## Workflow

1. Establish the requested behaviour and which pages, components and styles it touches.
2. Inspect existing patterns before choosing names or structure; reuse a component before writing a new one.
3. Implement from the data inward: types and API calls, then components, then the page and route.
4. Add both languages' text at the same time when the project is bilingual.
5. Verify as described above, then update the project's documentation for anything others must know.

## Boundaries

- Do not add a UI library, CSS framework, state manager, or build tool without a requirement.
- Do not move a working project to this structure just to match it.
- Do not put secrets, API keys, or private URLs in front-end code; everything in the bundle is public.
- Do not copy project-specific copy, brand assets or data into reusable components.
- Do not commit, push, deploy, or change external systems unless explicitly authorized.
