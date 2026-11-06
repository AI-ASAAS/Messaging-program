# Frontend patterns

Short, copyable patterns for the decisions that come up in most ASAAS front ends. They come from the ASAAS company site; adapt names to the project.

## Contents

- Starting a project
- Routes and pages
- API client and data loading
- Language and direction
- Theme and start-up script
- Safe links
- Visitor tracking (only when asked for)
- Build and delivery

## Starting a project

1. `npm create vite@latest <name> -- --template react-ts`, then `npm install`.
2. Install the kit with the `asaas-ui` skill's `scripts/install.mjs`. It copies `src/asaas-ui/` and `public/` and wires the styles into `main.tsx`.
3. Wrap the app in the kit's providers (`ToastProvider`, and the language provider when bilingual) and render `<Ambient />` once behind the content.
4. Delete Vite's demo files, then add `components/`, `pages/`, `content/`, `lib/` and `styles/` as needed.

## Routes and pages

Keep `App.tsx` to routes. Lazy-load every page except the home page, and give the suspense fallback a skeleton so layout does not jump.

```tsx
const Projects = lazy(() => import('./pages/Projects'));

<Suspense fallback={<div className="page"><Skeleton count={3} height={140} /></div>}>
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="projects" element={<Projects />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</Suspense>
```

- A page that should be reachable by link only (a hidden page) is simply left out of the navigation list; add `noindex` to it and to the server's response header too.
- The server must return the app's `index.html` for unknown paths and a real 404 status for paths that are not pages.

## API client and data loading

One small module owns `fetch`. It adds shared headers (such as the language), turns failures into a typed error with a readable message, and offers a hook that loads once and can retry.

```ts
export class ApiError extends Error { status: number; /* ... */ }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('X-Lang', getLang());
  const response = await fetch(`/api${path}`, { ...init, headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(body?.message ?? t('api.error'), response.status);
  return body as T;
}

export function useApi<T>(path: string): { data?: T; error: unknown; loading: boolean; reload: () => void } { /* ... */ }
```

Render the three states every time: loading (skeleton), error (message plus a retry button), and data (or an empty state that says what to do next). Guard against setting state after unmount or after the path changed.

Site-wide content that rarely changes (settings, copy edited from a dashboard) is loaded once near the root and shared through a context hook such as `useSite()`.

## Language and direction

Arabic is the default and right-to-left; English is left-to-right.

- A `LangProvider` holds the language, saves the choice, sets `lang` and `dir` on `<html>`, and remounts the tree when the language changes so every component re-reads its text.
- `t('key')` returns fixed interface text from two dictionaries typed with the same keys, so a missing translation fails the type check.
- `getLang()` and a small `pick(ar, en)` helper serve code that is not a hook.
- Text that comes from the API is translated by the server, chosen by the `X-Lang` request header.
- Write CSS with logical properties so most of the layout flips by itself. Put the few real overrides in one block at the end of the stylesheet, guarded by `:root[dir='ltr']`.
- Icons that point forward or back must flip with the direction.

## Theme and start-up script

Set the theme, language and direction before first paint so the page never flashes. With a strict Content Security Policy, do it from an external file, not an inline script:

```html
<!-- index.html -->
<script src="/theme-init.js"></script>
```

```js
// public/theme-init.js: light by default, dark only if the visitor chose it
(function () {
  var theme = 'light';
  var lang = 'ar';
  try {
    if (localStorage.getItem('asaas-theme') === 'dark') theme = 'dark';
    if (localStorage.getItem('asaas-lang') === 'en') lang = 'en';
  } catch (e) {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
})();
```

Because this file is not fingerprinted, the server must serve it with `Cache-Control: no-cache`.

## Safe links

Anything that arrives as data and becomes an `href` goes through a check first:

```ts
export const safeHref = (value: string) =>
  /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i.test(value) ? value : '#';
```

External links also get `target="_blank"` with `rel="noopener noreferrer"`.

## Visitor tracking (only when asked for)

When the team wants visitor statistics, send one small request per page view from a tiny helper, and keep it privacy-friendly:

- No cookies and no stored IP address or user agent; the server derives an anonymous daily identifier.
- Skip visits when `navigator.doNotTrack` is on and on admin pages.
- Never let tracking block rendering or show an error to the visitor.

## Build and delivery

- `npm run build` runs `tsc -b` first, so a type error stops the build.
- Vite fingerprints files under `assets/`; serve those with a long immutable cache. Serve `index.html` and any non-fingerprinted script or stylesheet with `no-cache`.
- When the backend serves the built files, it returns `index.html` for page routes and sets security headers (Content Security Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Keep fonts under `src/` so Vite bundles them with hashed names, and check the font licence allows embedding.

## Layout lessons

- `min-height` combined with `aspect-ratio` can make an element wider than its container on phones; give it a fixed height there instead.
- A row of chips or tags must be allowed to wrap, or it overflows the screen.
- Check for horizontal scroll by comparing `document.documentElement.scrollWidth` with the window width at 375px.
