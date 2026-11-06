// Rebuilds ~/.claude/skills/asaas-ui/template from the Asaas fund web app (C:/ayoub/asaas accounting).
//   node assemble-from-fund.cjs
const fs = require('fs');
const path = require('path');

const WEB = 'C:/ayoub/asaas accounting/apps/web';
const SKILL = 'C:/Users/Ayoub/.claude/skills/asaas-ui';
const KIT = `${SKILL}/template/src/asaas-ui`;

const read = (p) => fs.readFileSync(`${WEB}/${p}`, 'utf8');
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s.replace(/\r\n/g, '\n'));
};
const copyDir = (from, to) => fs.cpSync(from, to, { recursive: true });
const must = (s, a, b) => {
  if (!s.includes(a)) throw new Error(`missing: ${a.slice(0, 60)}`);
  return s.replace(a, b);
};

// Rebuilt from the fund each time; assistant/ and index.ts are the kit's own and are kept.
for (const dir of ['styles', 'ui', 'lib', 'fonts', 'assets']) fs.rmSync(`${KIT}/${dir}`, { recursive: true, force: true });
fs.rmSync(`${SKILL}/template/public`, { recursive: true, force: true });

/* ── fonts + images ── */
copyDir(`${WEB}/src/assets/fonts/thmanyah`, `${KIT}/fonts/thmanyah`);
copyDir(`${WEB}/src/assets/assistant`, `${KIT}/assets/assistant`);
for (const f of ['favicon.png', 'logo-dark.png', 'logo-light.png']) {
  fs.mkdirSync(`${SKILL}/template/public`, { recursive: true });
  fs.copyFileSync(`${WEB}/public/${f}`, `${SKILL}/template/public/${f}`);
}

/* ── styles ── */
const styles = `${KIT}/styles`;
write(`${styles}/tokens.css`, read('src/shared/styles/tokens.css'));
write(
  `${styles}/fonts.css`,
  read('src/shared/styles/fonts.css')
    .replaceAll("url('../../assets/fonts/thmanyah/", "url('../fonts/thmanyah/")
    .replace("see assets/fonts/thmanyah/LICENSE.pdf", 'see ../fonts/thmanyah/LICENSE.pdf')
    .replace('so the\n * files live in src/ and are bundled', 'so the\n * files live in src/ (never public/) and are bundled'),
);
write(`${styles}/base.css`, read('src/shared/styles/base.css'));
write(`${styles}/glass.css`, read('src/shared/styles/glass.css'));
write(`${styles}/components.css`, read('src/shared/styles/components.css'));

// Layout: only the page primitives and the logo mark (the app shell stays with each site).
const layout = read('src/shared/styles/layout.css').replace(/\r\n/g, '\n');
const between = (start, end) => {
  const i = layout.indexOf(start);
  const j = end ? layout.indexOf(end, i + 1) : layout.length;
  if (i < 0 || j < 0) throw new Error(`layout section ${start}`);
  return layout.slice(i, j);
};
write(
  `${styles}/layout.css`,
  [
    '/* Page primitives from the Asaas apps. The app shell (sidebar, top bar, tab bar) is per site. */\n',
    between('.brand {', '.nav {'),
    between('.page {', '/* ───────── Signed-in user'),
    between('/* ───────── Grids', '/* ───────── Mobile tab bar'),
    '@media (max-width: 1080px) {\n  .grid--main,\n  .grid--halves {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n\n',
    '@media (max-width: 900px) {\n  :root { --gutter: 14px; }\n\n  .hide-mobile {\n    display: none !important;\n  }\n}\n\n',
    between('/* Phones: stat tiles'),
  ].join(''),
);
// Assistant styles (the fund's .proposal cards included: a site can reuse them for its own cards).
const assistant = read('src/shared/styles/assistant.css').replace(/\r\n/g, '\n');
write(`${styles}/assistant.css`, assistant);
write(
  `${styles}/index.css`,
  ["@import './fonts.css';", "@import './tokens.css';", "@import './base.css';", "@import './glass.css';", "@import './components.css';", "@import './layout.css';", "@import './assistant.css';", ''].join('\n'),
);

/* ── lib ── */
const lib = `${KIT}/lib`;
write(`${lib}/cx.ts`, read('src/shared/lib/cx.ts'));
write(`${lib}/passwordStrength.ts`, read('src/shared/lib/passwordStrength.ts'));
let format = read('src/shared/lib/format.ts').replace(/\r\n/g, '\n');
format = must(format, "import type { FundKind, ExpenseCategory, PaymentMethod } from '@asaas/contracts';\n\n", '');
format = format.slice(0, format.indexOf('export const FUND_LABELS')) + format.slice(format.indexOf('/** First letters'));
format = must(format, "export const CURRENCY = 'ر.ي';", "/** Change for a site that is not in Yemeni rials. */\nexport const CURRENCY = 'ر.ي';");
write(`${lib}/format.ts`, format);
let theme = read('src/shared/lib/useTheme.ts').replace(/\r\n/g, '\n');
theme = must(theme, "import { syncStatusBar } from './nativeApp';\n", '');
theme = must(theme, '    syncStatusBar(theme);\n', '');
write(`${lib}/useTheme.ts`, theme);
let period = read('src/shared/lib/period.ts').replace(/\r\n/g, '\n');
period = must(period, "import { useSearchParams } from 'react-router';\n\n", '');
period = period.slice(0, period.indexOf('/** The selected accounting month'));
write(`${lib}/period.ts`, period.trimEnd() + '\n');

/* ── ui ── */
const ui = `${KIT}/ui`;
for (const f of ['Button', 'ConfirmDialog', 'Feedback', 'Field', 'Glass', 'Icon', 'Modal', 'MonthSwitcher', 'PasswordInput', 'Segmented', 'Stat', 'Toast', 'Typography']) {
  write(`${ui}/${f}.tsx`, read(`src/shared/ui/${f}.tsx`));
}
let status = read('src/shared/ui/Status.tsx').replace(/\r\n/g, '\n');
status = must(status, "import type { ContributionStatus } from '@asaas/contracts';\n", '');
status = must(status, "import { Icon, type IconName } from './Icon';\n", "import { Icon, type IconName } from './Icon';\n\n/** Paid / partly paid / not paid: the three states the status colours are for. */\nexport type ContributionStatus = 'paid' | 'partial' | 'unpaid';\n");
write(`${ui}/Status.tsx`, status);
write(`${ui}/Ambient.tsx`, read('src/app/Ambient.tsx'));

console.log('assembled', KIT);
