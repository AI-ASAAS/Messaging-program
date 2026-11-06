---
name: react-native
description: Design, create, extend, or review maintainable ASAAS mobile applications for Android and iOS using React Native and TypeScript (supporting both Expo and React Native CLI workflows) with modular Clean Architecture, in Arabic RTL with an optional English version. Use for new React Native apps, feature modules, domain/data/presentation layers, screens, components, navigation (Expo Router or React Navigation), API integration, secure storage, theming with Asaas brand tokens and Thmanyah fonts, liquid-glass surfaces, localization, accessibility, or React Native architecture and security reviews.
---

# React Native Foundation

## Goal

Build fast, accessible, maintainable Android and iOS applications in React Native and TypeScript organized around self-contained feature modules and pragmatic Clean Architecture boundaries (`domain`, `data`, `presentation`), reading naturally in right-to-left Arabic (and in English when required), protecting on-device data, and staying simple enough for any developer or AI agent to extend across both Expo and bare React Native CLI projects.

## Start With Context

Before proposing or changing code:

1. Read the repository instructions and existing documentation.
2. Inspect `package.json`, `tsconfig.json`, `app.json` or `app.config.ts` (for Expo), `android/` and `ios/` directories (for bare React Native CLI or prebuild), module boundaries, navigation setup, and representative features.
3. Preserve established conventions, workflow type (Expo managed, Expo prebuild/CNG, or React Native CLI), navigation library, and state management when working in an existing project unless the user explicitly asks to refactor them.
4. Confirm the scope before adding a native module, state-management library, UI kit, or build plugin.

For a new project, use the defaults in this skill.

## New Project Intake

Before scaffolding a new React Native application, make sure the user has described what the app does. Establish:

- Target users, supported platforms (Android, iOS, or both), and supported languages (Arabic RTL by default, English LTR when requested).
- Whether the project should use **Expo** (default for rapid cross-platform delivery) or **React Native CLI** (when custom native C++/Kotlin/Swift modules or existing native host apps require direct native project management).
- Core business capabilities (feature modules), screens, user flows, and the primary action on each screen.
- Where data comes from: an ASAAS FastAPI backend, external APIs, or offline local storage.
- Authentication, session persistence, biometric unlock, push notifications, deep links, or camera/file permissions.
- Distribution target (internal testing, EAS / Fastlane, Google Play, or Apple App Store).

Ask focused questions only when missing details materially affect the workflow choice (Expo vs CLI), permissions, offline behavior, or scope. For a small prototype, state reasonable assumptions clearly and keep them easy to change.

## Default Stack

Support both **Expo** and **React Native CLI** while keeping shared TypeScript, modular Clean Architecture, UI, and security boundaries:

- **Framework & Language:** React Native with strict TypeScript (`strict: true`), New Architecture (Fabric / TurboModules) and Hermes enabled.
  - **Expo workflow (Default for new apps):** Expo SDK with `expo-router` (thin route wrappers in `app/`) or `@react-navigation/native`, `expo-font`, `expo-localization`, `expo-blur`, and `expo-secure-store`.
  - **React Native CLI workflow (Bare native control):** `@react-native-community/cli` with `@react-navigation/native` (`native-stack` / `bottom-tabs`), linked Thmanyah font assets in `react-native.config.js`, `@react-native-community/blur`, and `react-native-keychain`.
- **Styling:** Standard React Native `StyleSheet.create` backed by a typed `useAsaasTheme()` hook and design tokens (`tokens.ts`). Avoid heavy third-party component libraries that conflict with the Asaas visual identity.
- **Data & State:** One small typed `fetch` API client (`src/core/api.ts`) injected into feature repositories, with React state/hooks (`use<Feature>Controller`) in the presentation layer. Add `@tanstack/react-query` or `zustand` only when cross-screen caching, optimistic mutations, or complex shared state justify it.
- **Localization & RTL:** `I18nManager.allowRTL(true)` and `I18nManager.forceRTL(true)` for Arabic by default, paired with a typed dictionary helper (`t('key')`).
- **Quality Checks:** `tsc --noEmit` for type checking and ESLint / `oxlint` for linting.

## Modular Design And Clean Architecture

Organize application code under `src/` by **cohesive feature module** alongside shared `ui/` and `core/` foundations. Each feature encapsulates one business domain (e.g., `auth`, `dashboard`, `transactions`) and follows **Clean Architecture** inward dependency rules (`presentation -> domain <- data`):

```text
src/
|-- ui/                        Shared Asaas mobile kit: theme tokens, Thmanyah Text, Glass, Card, Button, Input, StatusPill.
|-- core/                      Cross-cutting technical adapters: HTTP client, secure storage wrapper, i18n/RTL, Arabic formatters.
|-- features/                  Self-contained feature modules organized by business capability.
|   `-- <feature>/
|       |-- domain/            Pure TypeScript business layer (zero React, React Native, or fetch imports):
|       |   |-- entities.ts        Domain entity interfaces, value types, and repository contracts.
|       |   `-- useCases.ts        Pure business rules, validations, and workflow orchestration.
|       |-- data/              Infrastructure & data mapping layer:
|       |   |-- dto.ts             API payload types (snake_case DTOs) and pure mapper functions to/from domain entities.
|       |   `-- repository.ts      Concrete repository implementing the domain contract via src/core/api.ts and local storage.
|       |-- presentation/      React Native UI & view-model layer:
|       |   |-- use<Feature>.ts    Presentation hook/controller binding domain use cases/repositories to UI state.
|       |   |-- <Feature>Screen.tsx Screen component handling loading, error, empty, and data states.
|       |   `-- components/        Feature-private subcomponents (created only when a screen needs multiple subviews).
|       `-- index.ts           Public barrel exporting only the screen, public domain types, or hooks meant for other modules.
|-- navigation/                React Navigation stacks/tabs and deep-link wiring (or thin route files under app/ for Expo Router).
`-- App.tsx                    Composition root: providers (Theme, Lang, SafeArea, Toast), dependency wiring, and navigation root.
```

### Dependency And Modularity Rules

- **Strict inward dependency rule (`Presentation -> Domain <- Data`).** `domain/` contains pure TypeScript interfaces and business functions with zero imports from `react`, `react-native`, `expo-*`, or `src/core/api.ts`. `data/` implements `domain/` contracts and maps raw API DTOs to clean `camelCase` domain entities. `presentation/` consumes `domain/` entities and use cases/contracts.
- **Pragmatic sizing (avoid empty ceremony).** Scale a module to its actual complexity. A feature with rich business rules uses `domain/`, `data/`, and `presentation/` folders; a simple feature may flatten them into `domain.ts`, `repository.ts`, `use<Feature>.ts`, and `<Feature>Screen.tsx` inside `src/features/<feature>/` while keeping the exact same separation of concerns. Omit `useCases.ts` when a method would only forward a repository call unchanged.
- **Module encapsulation (`index.ts` boundary).** Features must never import internal `data/` or private `presentation/` files from another feature. Expose only what outside callers (such as the router) need via `src/features/<feature>/index.ts`. Shared cross-feature contracts (like current authenticated user or active period) live in `src/core/` or `src/features/auth/domain/`.
- **Workflow independence.** Keep Expo vs React Native CLI differences isolated inside `src/core/` (e.g., `secureStorage.ts`) and `src/ui/` (e.g., `Glass.tsx`) so `src/features/` remains 100% portable across both workflows.

Read [references/asaas-theme-and-ui.md](references/asaas-theme-and-ui.md) when setting up the Asaas visual identity, light/dark tokens, Thmanyah fonts (`ThmanyahSans`, `ThmanyahSerifDisplay`, `ThmanyahSerifText`), liquid-glass surfaces (`Ambient`, `Glass`, `Card`), or Arabic number and currency formatting (`ر.ي`).

Read [references/architecture-and-security.md](references/architecture-and-security.md) when designing feature modules and Clean Architecture layers, configuring Expo vs React Native CLI native settings, wiring the typed API client, configuring Arabic RTL with `I18nManager`, storing tokens securely, or reviewing mobile security against OWASP MASVS.

## Implementation Rules

- **Tokens, never raw hex strings in screens.** Read colors, radii, and spacing from `useAsaasTheme()` (`src/ui/tokens.ts`) so light (`#ece5d7` warm cream) and dark (`#141111` warm near-black) themes stay consistent across every component.
- **RTL first, with logical Flexbox properties.** Default to Arabic (`ar`, RTL). Always use `paddingHorizontal`, `marginStart`, `marginEnd`, `paddingStart`, `paddingEnd`, `start`, `end`, and `textAlign: 'auto'` (or `'left'` under forced RTL where React Native mirrors start/end automatically) instead of `left` and `right`. Flip directional icons (`chevronLeft` / `chevronRight`) using `I18nManager.isRTL`.
- **Three Thmanyah cuts via custom `<AsaasText>` primitives.** In React Native, `fontWeight` on custom fonts requires mapping to the exact postscript/file name (e.g., `ThmanyahSans-Regular`, `ThmanyahSans-Medium`, `ThmanyahSans-Bold`, `ThmanyahSerifDisplay-Bold`, `ThmanyahSerifText-Regular`) unless variable fonts are used. Centralize font selection inside `<AsaasText>` so screens never pass mismatched `fontFamily` + `fontWeight` pairs. Use `ThmanyahSans` for UI and **all numbers**, `ThmanyahSerifDisplay` for headings, and `ThmanyahSerifText` for body paragraphs.
- **Numbers read correctly in Arabic.** Format all numbers and money with `formatNumber`, `formatMoney`, and `formatSigned` from `src/core/format.ts` using Latin digits (`0-9`) with thousands separators wrapped in Unicode LTR isolates (`\u2066...\u2069`) and the currency `ر.ي` (`150,000 ر.ي`).
- **Liquid-glass surfaces.** Mount `<Ambient />` once behind screen content so translucent glass cards (`<Glass>`, `<Card>`) refract the warm gold/sand orbs. Use `BlurView` (`expo-blur` or `@react-native-community/blur`) on floating headers, tab bars, modals, and hero cards, with a crisp 1px rim border (`tokens.glassRim`). Inside `FlatList` or `SectionList`, avoid mounting heavy `BlurView` instances on every row; use translucent `tokens.glassInset` fills for list items to keep 60/120fps scrolling smooth.
- **Clean data boundaries.** API DTOs stay inside `data/` and map to typed `domain/` entities before reaching hooks or screens. Screens never call `fetch` directly or read raw snake_case backend payloads. Every data screen must render four explicit states: `loading` (shimmer skeleton), `error` (friendly Arabic message + retry button), `empty` (clear message + next action), and `data`.
- **Forms and keyboard handling.** Wrap forms in `KeyboardAvoidingView` (`behavior="padding"` on iOS) and dismiss the keyboard on background tap. Validate inputs in the domain layer, use labeled `<Field>` components, appropriate `keyboardType` and `returnKeyType`, disabled/loading submit buttons while saving, and visible server error banners.
- **Safe external links and WebViews.** Validate every dynamic URL from an API with `isSafeUrl()` (`https:`, `http:`, `mailto:`, `tel:`) before calling `Linking.openURL()`. Avoid `react-native-webview` for untrusted content; if required, restrict `originWhitelist`, disable arbitrary file access, and validate any `onMessage` bridge payload.
- **Secure local storage.** Store session tokens, refresh tokens, and sensitive credentials exclusively in `expo-secure-store` (Expo) or `react-native-keychain` (CLI) - never in plain `@react-native-async-storage/async-storage` or `MMKV` without hardware-backed encryption.

## Accessibility And Responsiveness

- Wrap root screens with `SafeAreaProvider` and use `useSafeAreaInsets()` so headers, floating bars, and bottom action buttons clear the notch, Dynamic Island, and home indicator.
- Test layouts on narrow phone viewports (**360x640** and **375x812**) and tablets in both Arabic RTL and English LTR, and respect font scaling (`allowFontScaling`, capping `maxFontSizeMultiplier` only on compact badges/chrome where layout cannot wrap).
- Keep all pressable targets at least **48x48 dp** (using `hitSlop` on small icons) and set `accessibilityRole="button"` and `accessibilityLabel` on every icon button.
- Never show status (`paid`, `partial`, `unpaid`) by color alone; always use `<StatusPill>` with its reserved color, icon, and Arabic label.
- Check `AccessibilityInfo.isReduceMotionEnabled()` (or `useReducedMotion()`) to skip or shorten non-essential animations.

## Testing And Verification

Pick the smallest check that proves the change works cleanly:

1. `npx tsc --noEmit` and the project linter pass with zero errors.
2. Check architectural boundaries: `domain/` has zero React Native or network imports, and features only import other features through their public `index.ts` or shared `core/` contracts.
3. Run unit or component tests (`jest` / `@testing-library/react-native`) for domain use cases, DTO mappers, formatters, hooks, and critical flows when a test runner is present.
4. Verify the screen on Android and iOS (or simulator/Expo Go) in both light and dark themes, in Arabic RTL (and English LTR when bilingual), and with the software keyboard open.
5. Exercise the main action, network failure/retry state, and empty state.
6. When changing `app.json`, `AndroidManifest.xml`, `build.gradle`, `Info.plist`, or `Podfile`, confirm that permissions, deep-link schemes, and exported components are minimal and justified.

## Workflow

1. Establish the requested behavior, whether the project uses Expo or React Native CLI, and which feature modules, Clean Architecture layers (`domain`, `data`, `presentation`), and shared UI components are affected.
2. Inspect existing project patterns before choosing filenames or libraries; reuse `src/ui/` components before writing new ones.
3. Implement from the domain outward: define `domain/` entities, repository contracts, and business rules first; implement `data/` DTO mappers and repository adapters second; build `presentation/` hooks, screens, and navigation routes last.
4. Add Arabic copy (and English copy when bilingual) simultaneously in the localization dictionary using concise, warm Modern Standard Arabic (imperative verbs on buttons like «حفظ», «تسجيل مصروف»).
5. Verify TypeScript compilation, layer boundaries, layout responsiveness, theme switching, and error recovery, then update project documentation for any new native dependencies or build steps.

## Boundaries

- Do not leak React Native UI imports, navigation props, or raw backend DTO shapes into `domain/`.
- Do not create redundant boilerplate files when a compact 4-file feature module preserves the same Clean Architecture boundaries.
- Do not add heavy UI frameworks, state managers, or native dependencies without a clear product requirement.
- Do not switch an existing Expo project to bare CLI (or vice versa) unless the user explicitly asks for it.
- Do not request Android permissions or iOS `Info.plist` usage descriptions that the app does not actively use.
- Do not embed private API keys, signing secrets, or service credentials in JavaScript/TypeScript code or `.env` variables prefixed with `EXPO_PUBLIC_` / bundled into the JS archive; everything in the client bundle is public.
- Do not commit, push, run store deployments (EAS Submit / Fastlane), or modify external systems unless explicitly authorized.
