#!/usr/bin/env node
// Installs the Asaas UI kit into a React + Vite project.
//   node install.mjs <project-dir> [--force]
// - copies src/asaas-ui (styles, Thmanyah fonts, components, assistant) and the brand files in public/
// - makes index.html Arabic + RTL, with the theme applied before first paint
// - imports the styles at the top of src/main.tsx (and drops Vite's starter index.css)
// Existing files are kept unless --force is given; every step is reported.
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const force = args.includes('--force');
const project = resolve(args.find((a) => !a.startsWith('--')) ?? '.');
const template = join(dirname(fileURLToPath(import.meta.url)), '..', 'template');
const log = (msg) => console.log(`asaas-ui: ${msg}`);

if (!existsSync(join(project, 'package.json'))) {
  console.error(`No package.json in ${project}. Point at a React + Vite project (npm create vite@latest -- --template react-ts).`);
  process.exit(1);
}

// 1. The kit itself.
const kit = join(project, 'src', 'asaas-ui');
if (existsSync(kit) && !force) log('src/asaas-ui already exists, kept (use --force to replace)');
else {
  cpSync(join(template, 'src', 'asaas-ui'), kit, { recursive: true, force: true });
  log('copied src/asaas-ui');
}

// 2. Brand files served as-is (logo marks referenced by the CSS, favicon).
mkdirSync(join(project, 'public'), { recursive: true });
for (const file of readdirSync(join(template, 'public'))) {
  const target = join(project, 'public', file);
  if (existsSync(target) && !force) continue;
  copyFileSync(join(template, 'public', file), target);
  log(`copied public/${file}`);
}

// 3. index.html: Arabic, right-to-left, theme before first paint, brand favicon.
const THEME_SCRIPT = [
  '<script>',
  '  // Apply the theme before first paint: light by default, dark only if the user chose it.',
  "  let theme = 'light';",
  '  try {',
  "    if (localStorage.getItem('asaas-theme') === 'dark') theme = 'dark';",
  '  } catch {}',
  '  document.documentElement.dataset.theme = theme;',
  '</script>',
];
const indexPath = join(project, 'index.html');
if (existsSync(indexPath)) {
  let html = readFileSync(indexPath, 'utf8');
  /** Adds lines just before </head>, indented one level inside the head. */
  const beforeHead = (lines) => {
    html = html.replace(/([ \t]*)<\/head>/, (_, indent) => {
      const inner = `${indent}  `;
      return `${lines.map((line) => inner + line).join('\n')}\n${indent}</head>`;
    });
  };
  html = html.replace(/<html[^>]*>/, '<html lang="ar" dir="rtl">');
  html = html.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" type="image/png" href="/favicon.png" />');
  if (!html.includes('name="theme-color"')) beforeHead(['<meta name="theme-color" content="#ece5d7" />']);
  if (!html.includes('dataset.theme')) beforeHead(THEME_SCRIPT);
  writeFileSync(indexPath, html);
  log('index.html: lang="ar" dir="rtl", theme script, favicon');
}

// 4. Styles imported first in main.tsx (fonts, tokens, base, glass, components, layout, assistant).
const mainPath = ['src/main.tsx', 'src/main.jsx'].map((p) => join(project, p)).find(existsSync);
if (mainPath) {
  let main = readFileSync(mainPath, 'utf8');
  if (!main.includes('asaas-ui/styles/index.css')) {
    // Vite's starter CSS (dark background, centred root) fights the kit's base styles.
    main = main.replace(/^import ['"]\.\/index\.css['"];?\r?\n/m, '');
    main = `import './asaas-ui/styles/index.css';\n${main}`;
    writeFileSync(mainPath, main);
    log(`${relative(project, mainPath)}: imports asaas-ui/styles/index.css (Vite's index.css import removed)`);
  }
}

log('done. Next: wrap the app in <ToastProvider>, put <Ambient /> behind the content, and see SKILL.md.');
