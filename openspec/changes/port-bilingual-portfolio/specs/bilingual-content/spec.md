# Spec: bilingual-content

## Purpose

Defines the i18n content layer for the bilingual portfolio: two locales (Spanish as default, English as alternate), a flat translation table per locale, a `t(lang, key)` helper, and a plain `<a>`-based language toggle. This capability replaces the source HTML's hand-rolled `lang-es` / `lang-en` span toggling with real, statically generated routes — one per locale — that share an identical structure and differ only in string content and `<html lang>`.

## Requirements

### Requirement: Two locales with Spanish as default

The system MUST support exactly two locales: `es` (Spanish, the default) and `en` (English). The Astro `i18n` config MUST declare `defaultLocale: 'es'`, `locales: ['es', 'en']`, and `prefixDefaultLocale: false` so that the ES page is served at `/` and the EN page at `/en/`. No additional locales SHALL be introduced in this change; adding a third locale is a separate future change.

#### Scenario: ES page renders at the root path

- GIVEN a clean build
- WHEN the user requests `/`
- THEN the static output contains `dist/index.html`
- AND the rendered `<html lang="es">` matches the Spanish locale

#### Scenario: EN page renders at the prefixed path

- GIVEN a clean build
- WHEN the user requests `/en/`
- THEN the static output contains `dist/en/index.html`
- AND the rendered `<html lang="en">` matches the English locale

### Requirement: `Translations` type and `t(lang, key)` helper

The system MUST export a `Locale` type as the union `'es' | 'en'`, a `Translations` type as `Record<string, string>`, and a `t(lang: Locale, key: keyof Translations): string` helper from `src/i18n/index.ts`. The helper MUST return the value from the matching locale module for the given key, MUST be a pure function with no I/O, and MUST throw a descriptive error if a key is missing from a locale (no silent fallbacks). Adding a third locale SHALL be a matter of adding a new locale file and extending the `Locale` union — the call sites MUST NOT need changes.

#### Scenario: t() returns the localized string for a known key

- GIVEN `es.ts` exports `{ nav_specialties: 'Especialidades' }` and `en.ts` exports `{ nav_specialties: 'Specialties' }`
- WHEN a component calls `t('es', 'nav_specialties')`
- THEN it receives the string `'Especialidades'`
- AND when called with `t('en', 'nav_specialties')` it receives `'Specialties'`

#### Scenario: t() throws on a missing key

- GIVEN `es.ts` exports `{ hero_title: '...' }` but `en.ts` does NOT
- WHEN a component calls `t('en', 'hero_title')`
- THEN the helper throws an error whose message names the missing key and the locale

### Requirement: Flat key→string translation shape

The system MUST organize translations as a flat `Record<string, string>` per locale — no nested objects, no pluralization helpers, no JSX fragments. Each visible string in the rendered output MUST be a single key, and that key MUST appear in both `src/i18n/es.ts` and `src/i18n/en.ts` with the same value type (string). Namespacing by prefix (e.g. `nav_`, `hero_`, `case_conectaplay_`) is REQUIRED for grep-ability.

#### Scenario: Both locale files declare the same keys

- GIVEN the `Translations` type in `src/i18n/index.ts`
- WHEN TypeScript checks `src/i18n/es.ts` and `src/i18n/en.ts`
- THEN both files MUST satisfy the `Translations` type
- AND `npx astro check` reports zero errors

#### Scenario: A new string is added in one locale only

- GIVEN a developer adds `case_conectaplay_tagline: 'New tagline'` to `es.ts` but forgets `en.ts`
- WHEN `npx astro check` runs
- THEN it reports a type error on the `en.ts` export
- AND the PR fails CI

### Requirement: `LanguageToggle` is a plain anchor link

The system MUST render `LanguageToggle.astro` as a plain `<a href="/en/">` (when on the ES page) or `<a href="/">` (when on the EN page). The toggle MUST NOT use JavaScript, MUST NOT swap the `lang` attribute in place, MUST NOT read or write `localStorage`, and MUST NOT call any client-side router. The toggle's label MUST show the destination locale code (e.g. "EN" on the ES page, "ES" on the EN page). Both pages MUST render a visible toggle in the Nav — auto-hiding on the EN page is NOT permitted in this change.

#### Scenario: ES page toggle points to EN

- GIVEN a user is viewing the ES page at `/`
- WHEN the Nav renders
- THEN it contains an `<a href="/en/">` whose visible label is "EN"

#### Scenario: EN page toggle points to ES

- GIVEN a user is viewing the EN page at `/en/`
- WHEN the Nav renders
- THEN it contains an `<a href="/">` whose visible label is "ES"

### Requirement: `hreflang` alternate links in the document head

The system MUST emit `<link rel="alternate" hreflang="es" href="...">` and `<link rel="alternate" hreflang="en" href="...">` tags in the `<head>` of every page, plus a `<link rel="alternate" hreflang="x-default" href="/">`. The href values MUST be the absolute canonical URLs of the corresponding locale page. The `BaseLayout.astro` component MUST own the emission of these tags so they appear on every route that uses the layout.

#### Scenario: ES page advertises both locales

- GIVEN a user is viewing the ES page at `/`
- WHEN the page is rendered
- THEN the `<head>` contains exactly one `hreflang="es"` link pointing to `/`
- AND exactly one `hreflang="en"` link pointing to `/en/`
- AND exactly one `hreflang="x-default"` link pointing to `/`

#### Scenario: EN page advertises both locales

- GIVEN a user is viewing the EN page at `/en/`
- WHEN the page is rendered
- THEN the `<head>` contains the same three `hreflang` tags as the ES page (self-reference included)

### Requirement: Trust chips and case-study features are translated (not span-toggled)

The system MUST translate Hero trust chips (the five "5+ años de experiencia / Web & mobile apps / E-commerce / Custom platforms / Responsive design" pills) and the `features` arrays of the four case studies (ConectaPlay, DeTour, Fuera del Molde, La Locura Bar) via the `t()` helper, NOT via `<span class="lang-es">` / `<span class="lang-en">` toggling. The source HTML hard-coded these strings in Spanish with no English counterpart; this port fixes that gap by adding proper keys to both `es.ts` and `en.ts`.

#### Scenario: Trust chips render in the active locale only

- GIVEN the trust chip keys exist in both `es.ts` and `en.ts`
- WHEN a user views the ES page
- THEN each chip shows its Spanish string
- AND no English chip text is visible in the DOM

#### Scenario: Case-study features are an array of translated strings

- GIVEN `CaseStudyCard.astro` receives a `features` prop as an array of `keyof Translations`
- WHEN the component renders a ConectaPlay card on the EN page
- THEN the three feature bullets display their English strings
- AND the same card on the ES page displays the Spanish strings
