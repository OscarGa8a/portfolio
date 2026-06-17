# Tasks: Port Bilingual Portfolio

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Low

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1001 (295 + 320 + 386) |
| 400-line budget risk | Low (all 3 PRs under 400) |
| Chained PRs recommended | Yes |
| Suggested split | PR1 Foundation → PR2 Story → PR3 Work+Reveal |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

---

## PR1 — Foundation (~295 LoC)

### Task 1.1: Scaffold + Tailwind v4 wiring
**Files**: `package.json`, `astro.config.mjs`, `tsconfig.json`
**Depends on**: —
**Acceptance criteria**:
- [ ] `package.json` adds `@tailwindcss/vite` and `@astrojs/check` as devDependencies
- [ ] `astro.config.mjs` imports and wires `@tailwindcss/vite` plugin via `vite.plugins`
- [ ] `astro.config.mjs` sets `i18n: { defaultLocale: 'es', locales: ['es','en'], prefixDefaultLocale: false }`
- [ ] `tsconfig.json` adds `"compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }`
- [ ] `pnpm install` succeeds
- [ ] `npx astro check` passes

**Estimated LoC**: ~20

### Task 1.2: Delete stale files
**Files**: `nul`, `package-lock.json`, `src/components/Welcome.astro`, `src/layouts/Layout.astro`, `src/assets/background.svg`, `src/assets/astro.svg`
**Depends on**: —
**Acceptance criteria**:
- [ ] All 6 listed files deleted from the repository
- [ ] `src/assets/` directory is empty or removed
- [ ] `pnpm install` still succeeds after deletions

**Estimated LoC**: ~5 (deletions)

### Task 1.3: Design tokens in global.css
**Files**: `src/styles/global.css`
**Depends on**: 1.1
**Acceptance criteria**:
- [ ] File starts with `@import "tailwindcss"`
- [ ] `@theme` block declares 8 brand colors: `--color-bg-main`, `--color-bg-sec`, `--color-card-bg`, `--color-text-main`, `--color-text-sec`, `--color-acc-blue`, `--color-acc-violet`, `--color-acc-cyan`
- [ ] `@theme` block declares `--font-sora` and `--font-inter`
- [ ] `@theme` block declares `--animate-float`, `--animate-float-delayed`, `--animate-pulse-glow`
- [ ] `@keyframes slideDown` defined outside `@theme` for details accordion
- [ ] `@layer components` defines: `.glass-nav`, `.premium-card` (+ hover lift), `.text-gradient`, `.bg-gradient-primary`, `.reveal`, `.reveal.visible`, `details > summary` reset, `details[open] summary ~ *` slideDown
- [ ] `@media (prefers-reduced-motion: reduce)` disables all animations and forces `.reveal` to visible state

**Estimated LoC**: ~100

### Task 1.4: BaseLayout
**Files**: `src/layouts/BaseLayout.astro`
**Depends on**: 1.3
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en'; title: string; description: string }`
- [ ] `<html lang>` matches locale prop, includes `class="scroll-smooth"`
- [ ] `<head>` contains preconnect links to `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin)
- [ ] `<head>` contains Google Fonts stylesheet with `display=swap`
- [ ] `<head>` contains `hreflang` tags: `es`, `en`, `x-default` with correct absolute URLs
- [ ] Imports and applies `src/styles/global.css`
- [ ] Body includes two ambient glow divs (violet + blue, `animate-pulse-glow`)
- [ ] `<slot />` renders page content

**Estimated LoC**: ~35

### Task 1.5: i18n modules (infrastructure + Nav/Footer keys)
**Files**: `src/i18n/index.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`
**Depends on**: 1.1
**Acceptance criteria**:
- [ ] `index.ts` exports `Locale` type (`'es' | 'en'`), `Translations` type (`typeof es`), `TranslationKey` type
- [ ] `index.ts` exports `t(lang, key)` that throws descriptive error on missing key
- [ ] `es.ts` exports ~7 Spanish keys: `nav_*` (5) + `footer_tagline`, `footer_rights`
- [ ] `en.ts` exports same keys with English values
- [ ] `npx astro check` reports zero errors

**Estimated LoC**: ~30

### Task 1.6: LanguageToggle component
**Files**: `src/components/LanguageToggle.astro`
**Depends on**: 1.5
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] When locale is `es`, renders `<a href="/en/">EN</a>`
- [ ] When locale is `en`, renders `<a href="/">ES</a>`
- [ ] No JavaScript, no `localStorage`, no client-side routing
- [ ] Styled with `bg-white/5 border border-white/10 px-3 py-1.5 rounded-md` (consistent with Nav)

**Estimated LoC**: ~15

### Task 1.7: Nav component
**Files**: `src/components/Nav.astro`
**Depends on**: 1.5, 1.6
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] Fixed `<nav>` with `glass-nav` class, brand link with JD gradient logo
- [ ] Desktop nav links use `t(locale, key)` for all 4 section anchors
- [ ] Renders `LanguageToggle` component with locale prop
- [ ] CTA button links to `#contacto` with `t(locale, 'nav_cta')` text
- [ ] No `client:` directive — fully static HTML

**Estimated LoC**: ~40

### Task 1.8: Footer component
**Files**: `src/components/Footer.astro`
**Depends on**: 1.5
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] Renders `<footer>` with brand, section links, social icons (LinkedIn + GitHub SVGs)
- [ ] Copyright year from `new Date().getFullYear()` in frontmatter — literal string in HTML output
- [ ] No `<script>` tag, no `getElementById`, no runtime JS
- [ ] Tagline and rights text use `t(locale, key)`

**Estimated LoC**: ~35

### Task 1.9: Minimal ES + EN pages
**Files**: `src/pages/index.astro`, `src/pages/en/index.astro`
**Depends on**: 1.4, 1.7, 1.8
**Acceptance criteria**:
- [ ] `src/pages/index.astro` uses `BaseLayout locale="es"`, renders Nav + Footer
- [ ] `src/pages/en/index.astro` uses `BaseLayout locale="en"`, renders Nav + Footer
- [ ] `npm run build` produces `dist/index.html` and `dist/en/index.html`
- [ ] `dist/index.html` has `<html lang="es">` and correct hreflang tags
- [ ] `dist/en/index.html` has `<html lang="en">` and correct hreflang tags
- [ ] No Tailwind CDN script tag in rendered HTML

**Estimated LoC**: ~15

---

## PR2 — Story sections (~320 LoC)

### Task 2.1: Section wrapper component
**Files**: `src/components/Section.astro`
**Depends on**: —
**Acceptance criteria**:
- [ ] Props: `{ id?: string; className?: string; reveal?: boolean (default true); padding?: string (default 'py-24'); container?: boolean (default true) }`
- [ ] When `reveal=true`, outer `<section>` carries `class="reveal"`
- [ ] When `container=true`, inner `<div>` has `max-w-7xl mx-auto px-6 lg:px-8`
- [ ] Renders `<slot />` for section content

**Estimated LoC**: ~15

### Task 2.2: Extend i18n with Hero, Trust, Process, About keys
**Files**: `src/i18n/es.ts`, `src/i18n/en.ts`
**Depends on**: —
**Acceptance criteria**:
- [ ] `es.ts` adds ~38 keys: `hero_*` (11 incl. 5 trust chips), `trust_*` (8), `process_*` (12), `about_*` (7)
- [ ] `en.ts` adds same 38 keys with English translations
- [ ] Trust chip keys (`hero_chip_1`–`hero_chip_5`) have proper English values (not empty/duplicate)
- [ ] `npx astro check` passes — TypeScript enforces key parity

**Estimated LoC**: ~80

### Task 2.3: Hero component
**Files**: `src/components/Hero.astro`
**Depends on**: 2.1, 2.2
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] Badge, headline (with text-gradient span), paragraph, supporting line, dual CTAs — all via `t(locale, key)`
- [ ] 5 trust chips rendered via `t(locale, 'hero_chip_1')` through `hero_chip_5`
- [ ] Right column: dashboard mockup (`animate-float`) + mobile mockup (`animate-float-delayed`) — full fidelity from source lines 213–254
- [ ] Left content div carries `class="reveal"`, right mockup div carries `class="reveal"`

**Estimated LoC**: ~80

### Task 2.4: TrustMetrics component
**Files**: `src/components/TrustMetrics.astro`
**Depends on**: 2.1, 2.2
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] 4-column grid with colored left borders (accBlue, accViolet, accCyan, white/20)
- [ ] All labels and descriptions use `t(locale, key)`
- [ ] Outer section carries `class="reveal"`
- [ ] Layout matches source lines 258–298

**Estimated LoC**: ~30

### Task 2.5: ProcessTimeline component
**Files**: `src/components/ProcessTimeline.astro`
**Depends on**: 2.1, 2.2
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] 5-step vertical timeline with numbered circles and connecting line
- [ ] Steps alternate left/right on desktop; left-aligned on mobile
- [ ] Each step title and description uses `t(locale, key)`
- [ ] Each circle has unique accent (white, accBlue, accViolet, accCyan, green-400)
- [ ] Section carries `class="reveal"`; matches source lines 615–683

**Estimated LoC**: ~45

### Task 2.6: About component
**Files**: `src/components/About.astro`
**Depends on**: 2.1, 2.2
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] Profile placeholder card: JD gradient avatar, "Juan David Studio", LinkedIn + GitHub icons, hover rotate transition
- [ ] Bio paragraph uses `t(locale, 'about_paragraph')`
- [ ] 5 skill tags use `t(locale, 'about_tag_1')` through `about_tag_5`
- [ ] Section carries `class="reveal"`

**Estimated LoC**: ~40

### Task 2.7: Wire PR2 sections into pages
**Files**: `src/pages/index.astro`, `src/pages/en/index.astro`
**Depends on**: 2.3, 2.4, 2.5, 2.6
**Acceptance criteria**:
- [ ] ES page composes: Nav → Hero → TrustMetrics → ProcessTimeline → About → Footer
- [ ] EN page composes identical structure with `locale="en"`
- [ ] `npm run build` produces both pages with all PR2 sections rendered
- [ ] No extra or missing sections between Nav and Footer

**Estimated LoC**: ~30

---

## PR3 — Work + Reveal (~386 LoC)

### Task 3.1: Extend i18n with Services, Case Studies, Secondary, CTA keys
**Files**: `src/i18n/es.ts`, `src/i18n/en.ts`
**Depends on**: —
**Acceptance criteria**:
- [ ] `es.ts` adds ~68 keys: `services_*` (22), `case_*` (39), `secondary_*` (3), `cta_*` (4)
- [ ] `en.ts` adds same 68 keys with English translations
- [ ] Case-study feature keys have proper English values (not empty or Spanish duplicates)
- [ ] `npx astro check` passes — key parity enforced

**Estimated LoC**: ~136

### Task 3.2: Case studies data file
**Files**: `src/data/caseStudies.ts`
**Depends on**: 3.1
**Acceptance criteria**:
- [ ] Exports `CaseStudy` interface with typed fields: `id`, `title`, `categoryKey: TranslationKey`, `descriptionKey: TranslationKey`, `features: [TranslationKey, TranslationKey, TranslationKey]`, `problemKey`, `solutionKey`, `resultKey`, `ctaKey`, `ctaHref`, `variant`, `accentColor`
- [ ] Exports `caseStudies: CaseStudy[]` with 4 entries: ConectaPlay, DeTour, Fuera del Molde, La Locura Bar
- [ ] All key references resolve against the `Translations` type (no orphan keys)
- [ ] `variant` alternates: `image-left`, `image-right`, `image-left`, `image-right`

**Estimated LoC**: ~35

### Task 3.3: Services component
**Files**: `src/components/Services.astro`
**Depends on**: 3.1
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] Title and subtitle via `t(locale, key)`
- [ ] 4-card grid: Websites, E-commerce, Apps, Custom Platforms — each with icon SVG, title, description, 3 features via `t()`
- [ ] Each card uses `premium-card` class with correct accent color
- [ ] Section carries `class="reveal"`; matches source lines 300–387

**Estimated LoC**: ~40

### Task 3.4: CaseStudyCard component
**Files**: `src/components/CaseStudyCard.astro`
**Depends on**: 3.2
**Acceptance criteria**:
- [ ] Props: `{ study: CaseStudy; locale: 'es' | 'en' }`
- [ ] Renders category, title, description via `t(locale, key)` from study data
- [ ] 3 feature bullets via `t(locale, study.features[n])`
- [ ] `<details>` accordion with problem/solution/result blocks via `t()`
- [ ] CTA button with `study.ctaHref` and `t(locale, study.ctaKey)` label
- [ ] `<slot name="mockup" />` for the visual mockup
- [ ] Layout respects `study.variant` (image-left vs image-right)

**Estimated LoC**: ~35

### Task 3.5: CaseStudyMockups
**Files**: `src/components/CaseStudyMockups.astro`
**Depends on**: —
**Acceptance criteria**:
- [ ] Exports 4 mockup fragments: ConectaPlay (dashboard), DeTour (mobile), Fuera del Molde (e-commerce), La Locura Bar (bar profile)
- [ ] Each mockup reproduces source mockup HTML at full fidelity (gradients, layered divs, fake browser chrome)
- [ ] Each mockup block includes `<!-- NOTE(fidelity): deferred improvement — see frontend-design skill -->` comment
- [ ] ConectaPlay: browser chrome + sidebar + dashboard grid (source lines 406–416)
- [ ] DeTour: mobile frame + notch + gradient content (source lines 457–460)
- [ ] Fuera del Molde: e-commerce header + product grid (source lines 500–505)
- [ ] La Locura Bar: avatar circle + CTA button + yellow gradient (source lines 545–552)

**Estimated LoC**: ~55

### Task 3.6: SecondaryProjects component
**Files**: `src/components/SecondaryProjects.astro`
**Depends on**: 3.1
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] Title via `t(locale, 'secondary_title')`
- [ ] 2-card grid: CIA Vial del Llano + DeTour Cundinamarca Web with descriptions via `t()`
- [ ] External link icons with correct accent colors (accBlue, accViolet)
- [ ] Matches source lines 590–611

**Estimated LoC**: ~20

### Task 3.7: FinalCta component
**Files**: `src/components/FinalCta.astro`
**Depends on**: 3.1
**Acceptance criteria**:
- [ ] Props: `{ locale: 'es' | 'en' }`
- [ ] Premium card with title, subtitle via `t(locale, key)`
- [ ] WhatsApp CTA button with SVG icon and `t(locale, 'cta_whatsapp')` label
- [ ] Email CTA button with SVG icon and `t(locale, 'cta_email')` label
- [ ] Section carries `class="reveal"`; matches source lines 727–751

**Estimated LoC**: ~20

### Task 3.8: RevealObserver island
**Files**: `src/components/RevealObserver.astro`, `src/layouts/BaseLayout.astro`
**Depends on**: —
**Acceptance criteria**:
- [ ] Component uses `client:load` directive
- [ ] Inlined script (~15 lines): creates one `IntersectionObserver` with `{ root: null, rootMargin: '0px', threshold: 0.15 }`
- [ ] Adds `.visible` class to `.reveal` elements and calls `observer.unobserve(entry.target)` after first intersection
- [ ] Checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` once at init — if true, adds `.visible` to all `.reveal` elements synchronously and skips observer
- [ ] `<noscript>` block injects `<style>.reveal{opacity:1!important;transform:none!important}</style>`
- [ ] Mounted in `BaseLayout.astro` with `<RevealObserver client:load />`

**Estimated LoC**: ~20

### Task 3.9: Wire all sections + finalize pages
**Files**: `src/pages/index.astro`, `src/pages/en/index.astro`
**Depends on**: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8
**Acceptance criteria**:
- [ ] ES page composes all 12 sections: Nav → Hero → TrustMetrics → Services → 4× CaseStudyCard (with mockups via slot) → SecondaryProjects → ProcessTimeline → About → FinalCta → Footer
- [ ] EN page composes identical structure with `locale="en"`
- [ ] Each CaseStudyCard iterates over `caseStudies` array with mockup slot from CaseStudyMockups
- [ ] `npm run build` produces complete `dist/index.html` and `dist/en/index.html`
- [ ] `npx astro check` passes with zero errors and zero warnings
- [ ] All `.reveal` elements in source are present with `class="reveal"` in rendered output (≥ 8 targets)
- [ ] No Tailwind CDN script tag in rendered output

**Estimated LoC**: ~25

---

## Task dependency graph

```
PR1:
  1.1 (scaffold) ──→ 1.3 (tokens) ──→ 1.4 (BaseLayout) ──┐
  1.2 (cleanup)                                              │
  1.1 ──→ 1.5 (i18n) ──→ 1.6 (LanguageToggle) ──→ 1.7 (Nav) ──→ 1.9 (pages)
              │                                               │              ↑
              └──→ 1.8 (Footer) ─────────────────────────────┘──────────────┘

PR2:
  2.1 (Section) ──┐
  2.2 (i18n ext) ─┼──→ 2.3 (Hero) ──────┐
                   ├──→ 2.4 (Trust) ─────┤
                   ├──→ 2.5 (Process) ───┼──→ 2.7 (wire pages)
                   └──→ 2.6 (About) ─────┘

PR3:
  3.1 (i18n ext) ──→ 3.2 (data) ──→ 3.4 (CaseStudyCard) ──┐
       │                3.5 (Mockups) ─────────────────────┤
       ├──→ 3.3 (Services) ────────────────────────────────┤
       ├──→ 3.6 (Secondary) ───────────────────────────────┼──→ 3.9 (wire all)
       ├──→ 3.7 (FinalCta) ────────────────────────────────┤
       └──→ 3.8 (RevealObserver) ──────────────────────────┘
```

## Spec coverage matrix

| Spec requirement | Task(s) |
|------------------|---------|
| **bilingual-content** | |
| Two locales with Spanish as default | 1.1, 1.9 |
| Translations type and t() helper | 1.5 |
| Flat key→string translation shape | 1.5, 2.2, 3.1 |
| LanguageToggle is a plain anchor link | 1.6, 1.7 |
| hreflang alternate links in head | 1.4 |
| Trust chips and case-study features translated | 2.2, 2.3, 3.1, 3.4 |
| **portfolio-sections** | |
| Twelve sections in source order | 1.9, 2.7, 3.9 |
| Section wrapper component | 2.1 |
| CaseStudyCard driven by data, four instances | 3.2, 3.4, 3.9 |
| Full-fidelity case-study mockups | 3.5 |
| Dynamic year in Footer is build-time | 1.8 |
| LanguageToggle visible in both navs | 1.6, 1.7, 1.9 |
| **design-tokens** | |
| Single @theme block in global.css | 1.3 |
| Two font families with preconnect + display=swap | 1.3, 1.4 |
| Four keyframe animations | 1.3 |
| Reusable component classes in @layer components | 1.3 |
| prefers-reduced-motion disables animations and reveals | 1.3 |
| **scroll-reveal** | |
| One RevealObserver island with client:load | 3.8 |
| Unobserve after first reveal | 3.8 |
| No-JS fallback (noscript block) | 3.8 |
| Respects prefers-reduced-motion | 3.8 |
| All class="reveal" elements wired | 2.3, 2.4, 2.5, 2.6, 3.3, 3.4, 3.7, 3.9 |

## Review workload forecast

| PR | Estimated LoC | Changed files | Within 400-line budget? |
|----|---------------|---------------|-------------------------|
| PR1 | ~295 | 14 (6 new, 3 modified, 6 deleted) | ✅ Yes |
| PR2 | ~320 | 8 (6 new, 2 modified) | ✅ Yes |
| PR3 | ~386 | 10 (8 new, 2 modified) | ✅ Yes |

**Chained PRs recommended**: Yes (3 PRs, feature branch chain)
**400-line budget risk**: Low (all under budget with margin)
**Decision needed before apply**: No
