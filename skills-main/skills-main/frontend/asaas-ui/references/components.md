# Components and helpers

Everything below is exported from `src/asaas-ui` (`import { Card, Button } from './asaas-ui'`).

## Contents
- Surfaces: Ambient, Glass, Card
- Actions: Button
- Forms: Field, TextInput, TextArea, Select, MoneyInput, PasswordInput, PasswordStrength, FormError, Segmented
- Overlays: Modal, ConfirmDialog, Toast
- Data display: Stat, ProgressBar, ProgressRing, StatusPill, Avatar, MonthSwitcher, lists, tables, pills, chips
- Feedback: EmptyState, ErrorState, Skeleton
- Typography: Swash, Stretch
- Icons
- Helpers: format, period, useTheme, cx
- Page layout classes

---

## Surfaces

**`<Ambient />`** is the brand background (gold orbs, a pattern, a faint logo watermark).
Mount it once, behind everything. The glass refracts it.

**`<Glass as? thick? pill? className? …>`** is a liquid-glass surface. Pass `as="header"`,
`"section"` or `"nav"` for semantics, `thick` for floating chrome (bars, panels, dialogs), and
`pill` for capsules. Every other HTML attribute passes through.

**`<Card title? icon? actions? className?>`** is a glass card with an optional header: a title,
an icon from the icon set, and actions on the far side.
```tsx
<Card title="آخر الحركات" icon="list" actions={<Button size="sm" variant="ghost">الكل</Button>}>
  …
</Card>
```

## Actions

**`<Button variant? size? icon? label? loading? …button attrs>`**
- `variant`: `'glass'` (default) · `'primary'` (gold, one per view) · `'ghost'` · `'danger'`
- `size`: `'md'` (default) · `'sm'`
- `icon` + children gives an icon with text. `icon` + `label` and no children gives an
  icon-only button, where `label` is the accessible name and the tooltip.
- `loading` shows a spinner and disables the button.
```tsx
<Button variant="primary" icon="plus" onClick={add}>تسجيل مصروف</Button>
<Button variant="ghost" size="sm" icon="trash" label="حذف" onClick={remove} />
```
Links styled as buttons: `<a className="btn btn--primary">…</a>` (classes `btn`,
`btn--primary|glass|ghost|danger`, `btn--sm`).

## Forms

Wrap a form in `<form className="form">`. Put two fields side by side with
`<div className="form__row">`; they stack on phones.

**`<Field label hint?>{(id) => <TextInput id={id} … />}</Field>`**. The child is a function
that receives the generated `id`, so the label is always linked to its input. `hint` can be a
string or a node.

- **`TextInput`, `TextArea`, `Select`** are the native elements, styled.
- **`MoneyInput value onChange`** takes integer amounts, shows thousands separators, and
  calls `onChange(number | null)`.
- **`PasswordInput`** has a show/hide toggle. **`PasswordStrength password`** is a 4-step
  meter you can put in `hint`.
- **`FormError error`** shows an error's message (an `Error` or any value), or nothing.
- **`Segmented label value options onChange`** is a sliding segmented control.
  `options: { value, label, count? }[]`.

```tsx
<form className="form" onSubmit={submit}>
  <div className="form__row">
    <Field label="الاسم">{(id) => <TextInput id={id} value={name} onChange={(e) => setName(e.target.value)} />}</Field>
    <Field label="المبلغ" hint="بالريال">{(id) => <MoneyInput id={id} value={amount} onChange={setAmount} />}</Field>
  </div>
  <FormError error={save.error} />
  <Button type="submit" variant="primary" icon="check" loading={save.isPending}>حفظ</Button>
</form>
```

## Overlays

**`<Modal title onClose footer? wide?>`** is a glass dialog in a portal. It locks page scroll,
closes on Escape and on the close button, and gives a string `title` its swash form. Put the
actions in `footer`, primary first. To submit a form from the footer, give the form an `id`
and use `<Button type="submit" form="that-id">`.

**`<ConfirmDialog title onConfirm onClose pending? error? confirmLabel?>children</ConfirmDialog>`**
asks before a destructive action.

**Toasts:** `const notify = useToast(); notify('تم الحفظ'); notify('تعذر الحفظ', 'error');`
This needs `<ToastProvider>` at the root.

## Data display

- **`<Stat label icon amount foot? tone?>`** is a headline number tile. `amount` is in the
  site currency. Use `tone="negative"` to show it in red. Lay several out in
  `<div className="grid grid--stats">`.
- **`<ProgressBar value max />`** and **`<ProgressRing value max size? >{centre}</ProgressRing>`**
  show progress, with a gold gradient on the ring.
- **`<StatusPill status />`** shows `'paid' | 'partial' | 'unpaid'` with an icon and a label,
  using the reserved state colours. Edit `STATUS_META` in `ui/Status.tsx` for other domains,
  but keep three states at most.
- **`<Avatar name status? size? />`** shows initials (skipping «ال»). A `status` adds a
  coloured ring.
- **`<MonthSwitcher value onChange />`** moves between months for `YYYY-MM` values, and has a
  "this month" shortcut.

Classes for lists and tables:
- **Lists:** `div.list > div.row` (add `row--stack` to stack on phones). Inside a row:
  `.row__main` with `.row__title` and `.row__meta`, then `.row__amount` and `.row__actions`.
  `.kind-icon` with `--in`, `--out` or `--gold` is a round icon at the start.
- **Tables:** `div.table-wrap > table.table`.
- **Pills:** `span.pill` with `--paid`, `--partial`, `--unpaid`, `--neutral`, `--in` or `--out`.
- **Chips:** `button.chip` with `aria-pressed` makes filter chips, inside `div.chips`.
- **Text:** `.muted` (secondary text), `.subtle` (smaller tertiary text), `.num` (numbers in
  Sans, bidi-isolated).

## Feedback

- **`<EmptyState icon? title>{children}</EmptyState>`** says what is missing and what to do.
- **`<ErrorState error onRetry? />`** shows a load failure with a retry button.
- **`<Skeleton height? count? />`** shows shimmering placeholders while loading.

## Typography

- **`<Swash>{title}</Swash>`** puts a swash on the last letter, when that letter has one
  (ئ ب ت ث س ش ص ض ف ق ك م ن ى ي). Use it once per heading.
- **`<Stretch before="صب" after="اح" length={3} />`** renders «صبَــاح» with the extended
  fatha. It uses font feature `ss0(length + 2)`, and `length` can be 1 to 5.
- Headings `h1`–`h3` use Serif Display automatically. Long copy uses `.prose` or
  `var(--font-text)`.

## Icons

`<Icon name="…" />` draws 24px stroke icons in `currentColor`. The available names are:
`dashboard collect users receipt briefcase vault plus chevronLeft chevronRight sun moon trash
edit close check checkCircle clock alert arrowDown arrowUp wallet trend grid list phone
calendar search pause eye eyeOff logout file sparkle send`.

To add one, put its SVG paths into the `paths` map in `ui/Icon.tsx` (24×24 viewBox,
stroke-based, no fill).

## Helpers

- **`lib/format`:**
  - Numbers: `formatNumber(n)`, `formatMoney(n)`, `formatSigned(n, 'in' | 'out')`,
    `formatCompact(n)`.
  - Dates and months: `formatDate('YYYY-MM-DD')`, `formatPeriod('YYYY-MM')` («أكتوبر 2026»),
    `formatMonthShort`.
  - Names: `firstName(name)`, `initials(name)`.
  - Currency: `CURRENCY`.
  - Output uses Latin digits and Arabic month names.
- **`lib/period`:** `today()`, `currentPeriod()`, `shiftPeriod(p, ±n)`, `periodBounds(p)`
  (`{ from, to }`).
- **`useTheme()`** returns `[theme, toggle]`. It saves the choice to `localStorage`
  (`asaas-theme`) and updates `<html data-theme>` and the `theme-color` meta. A typical
  toggle button is `<Button icon={theme === 'dark' ? 'sun' : 'moon'} label="الوضع" onClick={toggle} />`.
- **`cx(...classes)`** joins class names and skips falsy ones.

## Page layout classes

- **`div.page`:** the page column, with a gap and an entry animation.
- **`div.toolbar`:** a title row with actions on the far side. On phones its buttons go full
  width.
- **Grids:** `div.grid` (one column), `.grid--stats` (auto tiles, two columns on phones),
  `.grid--main` (wide + narrow) and `.grid--halves`. The last two become one column under
  1080px.
- **`.brand` / `.brand__mark` / `.brand__name` / `.brand__tag`:** the logo lockup. The mark
  switches between `/logo-dark.png` and `/logo-light.png` with the theme.
- **`.hide-mobile`:** hidden under 900px, where the gutter also narrows to 14px.
