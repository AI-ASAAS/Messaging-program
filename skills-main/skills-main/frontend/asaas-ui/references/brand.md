# Asaas brand: colours, type, voice

## Colours

These come from the Asaas brand guideline. All are defined as CSS variables in
`styles/tokens.css`, with a light default and `:root[data-theme='dark']`.

| Brand colour | Hex | Used for |
| --- | --- | --- |
| Ink | `#221f1f` | Text, the dark logo |
| Gold | `#ba9555` | Primary buttons, accents, the progress ring |
| Sand | `#d3c6b4` | Soft surfaces |
| Clay | `#c3ad8d` | Secondary accents |
| Cream | `#ede7da` | The page background family |
| Paper | `#fcf9f5` | The lightest surface, icon background |

**Semantic tokens.** Use these in components; they flip with the theme:

- **Page:** `--bg`, plus `--orb-1/2/3` and `--pattern` for the Ambient background.
- **Text:** `--text` (primary), `--text-2` (secondary), `--text-3` (tertiary/meta).
- **Lines:** `--hairline` for dividers.
- **Glass:** `--glass-tint`, `--glass-tint-strong`, `--glass-rim`, `--glass-rim-low`,
  `--glass-sheen`, `--glass-shadow`, `--glass-inset`, and `--overlay` behind modals.
- **Accent:** `--accent` (gold text and icons), `--accent-fill` (the gold button fill),
  `--accent-glow`, and `--on-accent` (text on gold).
- **State, reserved:** `--paid`, `--partial` and `--unpaid` with their `-bg` variants. Each
  always comes with an icon and a label.
- **Charts:** `--chart-in` (gold) and `--chart-out` (teal) are a validated pair for
  money-in and money-out series. `--chart-grid` is for grid lines.
- **Shape and motion:** `--radius-xl` 30, `--radius-lg` 22, `--radius-md` 16,
  `--radius-sm` 12 and `--radius-pill` (all px); `--ease-out` and `--ease-spring` for
  easing; `--gutter` 20px (14px on phones).

The dark theme isn't an automatic inversion. It has its own values (warm near-black
`#141111`, gold `#d8b36f` for accents), so check both themes when adding colour.

## Type: Thmanyah

| Family | Variable | Role |
| --- | --- | --- |
| Thmanyah Sans | `--font` | Interface, buttons, inputs, **all numbers**, body default |
| Thmanyah Serif Display | `--font-display` | Headings `h1`–`h3` (weight 700) |
| Thmanyah Serif Text | `--font-text` | Paragraphs, descriptions, empty-state text |

- **Weights:** 300, 400, 500, 700 and 900 for all three families (`woff2`,
  `font-display: swap`).
- **Base text:** 15px with line-height 1.6.
- **Headings:** 26px, 19px and 16px.

**Calligraphic features.** These follow the font's aesthetics guide:

- **Swash** (`font-feature-settings: 'swsh'`, the `.swash` class or `<Swash>`) goes on the
  final letter of a heading's last word only, once per heading, never on neighbouring
  words. Letters with swash forms: ئ ب ت ث س ش ص ض ف ق ك م ن ى ي. If a word ends in ء
  (as in «شيء»), the swash goes on the letter before it.
- **Extended fatha** (`<Stretch>`) is a fatha over 1 to 5 kashidas, drawn by stylistic
  set `ss0(N + 2)`: 1 kashida uses `ss03` and 3 kashidas use `ss05`. Keep it to one
  expressive word, like the greeting «صبَــاح الخير» / «مسَــاء الخير».

## Logo

`public/logo-dark.png` is the ink mark for light backgrounds, and `public/logo-light.png` is
the cream mark for dark backgrounds. `.brand__mark` switches between them with the theme, and
the Ambient watermark uses them too. `public/favicon.png` is the icon on a paper background.

## Voice (Arabic copy)

- Write Modern Standard Arabic with a light, friendly tone. Gulf/Yemeni colloquial is fine
  in casual helper text, but keep labels standard.
- **Buttons** are imperative verbs: «حفظ», «إلغاء», «تسجيل دفعة», «إرسال تذكير».
- **Titles** are short nouns: «لوحة التحكم», «سجل النشاط».
- **Greetings** use the first name: «مساء الخير يا أيوب».
- **Empty states** say what's missing and the next step: «لا توجد مصروفات لهذه الفترة» plus
  an action.
- **Errors** say what happened and how to recover: «تعذّر الحفظ، تأكد من الاتصال وحاول
  مرة أخرى». Never show raw codes.
- **Confirmations of destructive actions** name the thing and the consequence: «سيتم حذف
  حساب أحمد وتسجيل خروجه من كل الأجهزة».
- **Numbers** use Latin digits with separators and the currency after the number:
  «150,000 ر.ي». Months are written in Arabic: «أكتوبر 2026».
