---
name: mobile
description: Design, create, extend, or review maintainable ASAAS mobile applications for Android and iOS using Flutter and Dart with modular Clean Architecture, in Arabic RTL with an optional English version. Use for new mobile apps, feature modules, domain/data/presentation layers, screens, widgets, navigation, API integration, local storage, theming with Asaas brand tokens and Thmanyah fonts, liquid-glass surfaces, localization, accessibility, or mobile architecture and security reviews.
---

# Mobile Foundation

## Goal

Build fast, accessible, maintainable Android and iOS applications in Flutter organized around cohesive feature modules and pragmatic Clean Architecture boundaries (`domain`, `data`, `presentation`), reading naturally in right-to-left Arabic (and in English when required), protecting on-device data, and staying simple enough for any developer or AI agent to extend.

## Start With Context

Before proposing or changing code:

1. Read the repository instructions and existing documentation.
2. Inspect `pubspec.yaml`, the folder layout under `lib/`, module and layer boundaries, platform configurations (`android/` and `ios/`), routing, and representative features.
3. Preserve established conventions, state management, and architecture when working in an existing project unless the user explicitly asks to refactor them.
4. Confirm the scope before adding a new third-party package, native plugin, state-management library, or background service.

For a new project, use the defaults in this skill.

## New Project Intake

Before scaffolding a new mobile application, make sure the user has described what the app does. Establish:

- Target users, supported platforms (Android, iOS, or both), and supported languages (Arabic RTL by default, English LTR when requested).
- Core business capabilities (modules), screens, user flows, and the primary action on each screen.
- Where data comes from: an ASAAS FastAPI backend, external APIs, or offline local storage.
- Authentication, session persistence, biometric unlock, push notifications, deep links, or camera/file permissions.
- Distribution target (internal testing, Google Play, Apple App Store, or enterprise build).

Ask focused questions only when missing details materially affect the architecture, permissions, offline behavior, or scope. For a small prototype, state reasonable assumptions clearly and keep them easy to change.

## Default Stack

- Flutter (latest stable channel) with sound null-safe Dart.
- Built-in Flutter primitives (`ValueNotifier`, `ChangeNotifier`, `AnimatedBuilder`) or `flutter_riverpod` for dependency injection and reactive state across Clean Architecture layers. Do not introduce heavy code-generation boilerplate when plain Dart classes suffice.
- `go_router` for declarative routing, deep linking, and auth redirects, or standard `Navigator` for small single-flow tools.
- One small typed HTTP client (`http` or `dio`) in `core/network/` with centralized headers (`X-Lang`, auth token), timeouts, and structured error mapping.
- `flutter_secure_storage` for tokens, credentials, and sensitive session state; `shared_preferences` or `sqflite` only for non-sensitive preferences and local caches.
- `flutter_localizations` with typed dictionary lookups (`t('key')`) defaulting to `Locale('ar')` (`TextDirection.rtl`).
- Custom `ThemeExtension<AsaasTokens>` carrying the Asaas ink, gold, and sand palette, Thmanyah fonts (`ThmanyahSans`, `ThmanyahSerifDisplay`, `ThmanyahSerifText`), and liquid-glass surface styles for light and dark themes.
- `flutter analyze` and `dart format` for static checks and formatting.

## Modular Design And Clean Architecture

Organize application code by **feature module** under `lib/features/`, where each module encapsulates one cohesive business capability (such as `auth`, `transactions`, `dashboard`) and follows **Clean Architecture** inward dependency rules:

```text
lib/
|-- ui/                        Shared Asaas design kit: theme tokens, Thmanyah text, glass cards, buttons, inputs, status pills.
|-- core/                      Cross-cutting technical infrastructure: network client, secure storage, localization, formatters, errors.
|-- features/                  Independent feature modules organized by business capability.
|   `-- <feature>/
|       |-- domain/            Pure Dart business layer (zero Flutter UI or HTTP/DB imports):
|       |   |-- entities.dart      Immutable domain entities and value objects.
|       |   |-- repository.dart    Abstract repository contract (interface) for the module.
|       |   `-- use_cases.dart     Business rules and multi-step orchestration (optional for simple pass-through reads).
|       |-- data/              Infrastructure & persistence implementation:
|       |   |-- dto.dart           Data Transfer Objects (JSON serialization) and mappers to/from domain entities.
|       |   `-- repository_impl.dart Concrete repository calling core API client and local cache.
|       `-- presentation/      UI & state layer:
|           |-- controller.dart    Notifier / Riverpod controller calling domain use cases or repository contracts.
|           |-- <feature>_screen.dart Screen widget rendering loading, error, empty, and data states.
|           `-- widgets/           Feature-private sub-widgets (created only when a screen has multiple sub-components).
|-- app.dart                   MaterialApp, theme, locale/RTL binding, DI wiring, and router configuration.
`-- main.dart                  Startup initialization and runApp call.
```

### Dependency And Modularity Rules

- **Strict inward dependency rule (`Presentation -> Domain <- Data`).** `domain/` is the stable core of each feature: it contains pure Dart only and must never import `package:flutter/material.dart`, HTTP clients, SQLite, or DTOs. Both `presentation/` and `data/` depend on `domain/` contracts.
- **Pragmatic sizing (no empty ceremony).** Scale a module to its complexity. A complex workflow (`transactions`, `checkout`) uses `domain/`, `data/`, and `presentation/` directories; a small read-only or CRUD feature may flatten them into 4 files (`domain.dart`, `data.dart`, `controller.dart`, `<feature>_screen.dart`) while preserving the exact same dependency direction. Omit `use_cases.dart` when it would only forward a single repository method call without business rules.
- **Module isolation (no cross-feature reach-in).** One feature module must never import internal `data/` or `presentation/` files from another feature. If two features share a domain concept or service (such as current user session or currency settings), either communicate through `domain/` interfaces injected at the composition root (`app.dart`) or promote genuinely shared domain contracts to `core/`.
- **Shared layers stay domain-agnostic.** `ui/` and `core/` never import from `features/`.

Read [references/asaas-theme-and-ui.md](references/asaas-theme-and-ui.md) when setting up the Asaas visual identity, colors, dark mode, Thmanyah fonts, liquid-glass surfaces (`Ambient`, `Glass`, `Card`), or Arabic number and currency formatting (`ر.ي`).

Read [references/architecture-and-security.md](references/architecture-and-security.md) when designing feature modules, Clean Architecture layers (`domain`, `data`, `presentation`), the typed API client, offline storage, deep links, or reviewing mobile security against OWASP MASVS.

## Implementation Rules

- **Tokens, never raw hex values in widgets.** Pull colors, radii, and spacing from `AsaasTokens` on `Theme.of(context)` so light (`#ece5d7` warm cream) and dark (`#141111` warm near-black) themes stay consistent.
- **RTL first, with directional Flutter APIs.** Default to `Locale('ar')`. Always use `EdgeInsetsDirectional`, `AlignmentDirectional`, `BorderRadiusDirectional`, and `PositionedDirectional` instead of `left` and `right`. Forward chevrons point left in Arabic; set `matchTextDirection: true` on directional icons or flip them with `Directionality.of(context)`.
- **Three Thmanyah cuts, each with a clear role.** Use `ThmanyahSans` for interface controls, buttons, inputs, and **every number**. Use `ThmanyahSerifDisplay` (weight 700) for screen titles and headings. Use `ThmanyahSerifText` for long paragraphs and empty-state descriptions.
- **Numbers read correctly in Arabic.** Format numbers and money through `core/format.dart` using Latin digits (`0-9`) with thousands separators wrapped in Unicode LTR isolates (`\u2066...\u2069`) so `+` and `−` signs stay attached in RTL text, followed by the currency (`150,000 ر.ي`).
- **Liquid-glass surfaces.** Render `<Ambient />` (`AsaasAmbientBackground`) once behind screen content inside the root scaffold so `BackdropFilter` glass surfaces (`AsaasGlass`, `AsaasCard`) have warm orbs and patterns to refract. Avoid stacking multiple expensive `BackdropFilter` layers inside long scrolling lists; use tinted translucent containers with rim borders for list rows.
- **Clean data boundaries.** DTOs (`fromJson`/`toJson`) stay inside `data/` and map to immutable `domain/` entities before reaching `presentation/`. Screens and controllers never parse raw JSON maps or call HTTP directly. Every data view must explicitly handle four states: `loading` (shimmer skeleton), `error` (clear Arabic message with a retry button), `empty` (what is missing and the next action), and `data`.
- **Forms and inputs.** Use labeled fields, keyboard actions (`TextInputAction.next` / `done`), appropriate keyboard types (`TextInputType.number`, `emailAddress`), domain-level validation, a disabled and loading primary button while submitting, and `FocusScope.of(context).unfocus()` on tap outside.
- **Safe external links and WebViews.** Validate any URL arriving from an API before passing it to `url_launcher` (allow only `https`, `http`, `mailto`, `tel`). Avoid embedded WebViews unless required; if used, disable JavaScript or restrict navigation to trusted origins and never expose broad native bridges.
- **Secure local state.** Never store access tokens, refresh tokens, PINs, or personal financial data in plain `SharedPreferences`, unencrypted SQLite files, or application logs. Use `flutter_secure_storage` (Keychain on iOS, EncryptedSharedPreferences/Keystore on Android).
- **Guard mounted state.** After any `await` in a widget, check `if (!context.mounted) return;` before navigating, showing a toast/snackbar, or reading `BuildContext`.

## Accessibility And Responsiveness

- Respect safe areas (`SafeArea`, `MediaQuery.viewPaddingOf(context)`) and keyboard insets (`viewInsetsOf(context)`) so bottom buttons and forms never hide behind the notch, home indicator, or on-screen keyboard.
- Test layouts on narrow phone screens (**360x640** and **375x812**) and tablet widths without RenderFlex overflow in either Arabic or English, or when system font scaling (`TextScaler`) is increased.
- Ensure every interactive tap target is at least **48x48 dp** with `Semantics` labels on icon-only buttons.
- Never convey transaction or account status (`paid`, `partial`, `unpaid`) by color alone; always pair the reserved state color with an icon and an Arabic text label (`AsaasStatusPill`).
- Respect `MediaQuery.disableAnimationsOf(context)` by shortening or skipping decorative transitions when reduced motion is enabled.

## Testing And Verification

Pick the smallest check that proves the change works cleanly:

1. `flutter analyze` passes with zero errors or warnings, and `dart format --output=none --set-exit-if-changed .` succeeds.
2. Verify architectural boundaries: `domain/` contains no Flutter UI or HTTP imports, and features do not import each other's internal `data/` or `presentation/` files.
3. Run unit and widget tests (`flutter test`) for domain use cases, DTO-to-entity mappers, formatters, controllers, and critical screens.
4. Verify the screen in both light and dark themes, in Arabic RTL (and English LTR when bilingual), and with the soft keyboard open on form screens.
5. Exercise the main action, offline/timeout error recovery (retry button), and empty state.
6. When modifying native configurations (`AndroidManifest.xml`, `build.gradle`, `Info.plist`, `Podfile`), verify that platform permissions, deep-link schemes, and exported components are minimal and justified.

## Workflow

1. Establish the requested behavior and identify which feature modules, Clean Architecture layers (`domain`, `data`, `presentation`), and shared UI components it touches.
2. Inspect existing project patterns before choosing names, packages, or state holders; reuse existing `ui/` components before creating new ones.
3. Implement from the domain outward: define `domain/` entities, repository contracts, and business rules first; implement `data/` DTOs and repository adapters second; build `presentation/` controllers, screens, and route wiring last.
4. Add Arabic copy (and English copy when bilingual) simultaneously in the localization dictionary using concise, friendly Modern Standard Arabic (imperative verbs on buttons like «حفظ», «تسجيل دفعة»).
5. Verify static analysis, layer boundaries, layout overflow, theme switching, and failure paths, then update project documentation for any new setup or native requirements.

## Boundaries

- Do not violate Clean Architecture direction by importing UI widgets, `BuildContext`, or HTTP responses into `domain/`.
- Do not create 1-line pass-through files or empty boilerplate folders when a compact module layout satisfies the feature cleanly.
- Do not add heavy architecture generators, ORMs, or third-party UI kits that clash with the Asaas visual identity without an explicit requirement.
- Do not request Android permissions (`AndroidManifest.xml`) or iOS usage descriptions (`Info.plist`) that the current feature does not actively use.
- Do not hardcode API secrets, signing keys, or private credentials in Dart source code or committed build configs; everything compiled into the client binary can be extracted.
- Do not reorganize a working repository merely to match this default structure.
- Do not publish to app stores, alter signing certificates, or modify external production systems unless explicitly authorized.
