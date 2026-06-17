# Proposal: Port Bilingual Portfolio (`docs/index.html` → Astro + Tailwind v4)

## Intent

The current portfolio lives in a single 829-line `docs/index.html` that depends on the Tailwind CDN script, hand-rolled `lang-es` / `lang-en` span toggling, and per-string bilingual copy duplicated in the markup. We are porting it into this Astro 6.4.7 + TypeScript-strict project so that:

- Copy is sourced from real i18n modules keyed by locale (`es`, `en`), not from manual span toggles.
- Two real routes exist (`/` for Spanish, `/en/` for English) with correct `<html lang>` and `hreflang` for SEO.
- Design tokens live in a single Tailwind v4 `@theme` block in `src/styles/global.css` (no CDN, no JIT script tag).
- Each section becomes a reusable `.astro` component, so future case studies, services, or hero variants are composable, not a copy-paste of HTML.
- The output is a static `dist/` (zero JS hydration on most sections; one small `RevealObserver` island).

## Scope

### In Scope
- 12 sections of `docs/index.html` recreated as Astro components: Nav, Hero (with trust chips + mockup), Trust Metrics strip, Services grid, Case Studies (ConectaPlay, DeTour, Fuera del Molde, La Locura Bar) with mockups + features, Secondary projects row, Process timeline, About, Final CTA, Footer.
- Bilingual i18n: two pages (`src/pages/index.astro`, `src/pages/en/index.astro`) + `src/i18n/{es,en,index}.ts` with a `t(lang, key)` helper.
- Design system: Tailwind v4 `@theme` block with the 8 brand color tokens, 2 font families, and 4 keyframe animations extracted from the source HTML.
- Component classes (`.glass-nav`, `.premium-card`, `.text-gradient`, `.bg-gradient-primary`, `.reveal`) defined in `@layer components` inside `global.css`.
- Scroll-reveal: a single `RevealObserver.astro` island (`client:load`) using `IntersectionObserver`, respecting `prefers-reduced-motion`.
- `LanguageToggle.astro` rendered as a plain `<a href="/en/" />` (or `/`) — no client-side language switching.
- Dynamic year in Footer via build-time `Date()` in frontmatter.
- Trust chips in the Hero and `features` arrays in case studies translated properly (they were NOT bilingual in the source — that gap is fixed in this port).

### Out of Scope
- Real images / photography. All "mockups" stay as pure CSS+HTML boxes.
- Cloudinary integration or `<CldImage>` — deferred to a later change.
- Blog / CMS / dynamic content.
- Contact form backend, email delivery, anti-spam.
- Analytics (Plausible / GA / Fathom).
- `sitemap.xml`, `robots.txt`, OpenGraph images beyond what Astro emits by default.
- Linter, formatter, test runner — none currently configured; `astro check` remains the only quality gate.

## Capabilities

### New Capabilities
- `bilingual-content`: i18n content modules and `t()` helper for ES/EN copy, including trust chips and case-study features.
- `portfolio-sections`: the 12-section structure (Nav, Hero, Trust Metrics, Services, Case Studies, Secondary Projects, Process, About, Final CTA, Footer) as composable Astro components.
- `design-tokens`: Tailwind v4 `@theme` block with brand colors, fonts, and keyframe animations, plus reusable component classes in `@layer components`.
- `scroll-reveal`: a single client island using `IntersectionObserver` with `prefers-reduced-motion` support.

### Modified Capabilities
- None — there are no pre-existing `openspec/specs/` files beyond `testing-capabilities.md` (not a domain spec).

## Approach

### File Layout

```
src/
├── pages/
│   ├── index.astro            # ES root
│   └── en/
│       └── index.astro        # EN root
├── layouts/
│   └── BaseLayout.astro       # <html lang>, head meta, global.css, slot
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── TrustMetrics.astro
│   ├── Services.astro
│   ├── CaseStudyCard.astro
│   ├── ProcessTimeline.astro
│   ├── About.astro
│   ├── FinalCta.astro
│   ├── Section.astro          # generic <section> wrapper with id + classes
│   ├── LanguageToggle.astro   # plain <a> to the other locale
│   └── RevealObserver.astro   # client:load island, ~15 lines
├── i18n/
│   ├── es.ts
│   ├── en.ts
│   └── index.ts               # Translations type, t(lang, key) helper, Locale type
└── styles/
    └── global.css             # Tailwind v4 @import + @theme + @layer components
```

`astro.config.mjs` gets `i18n: { defaultLocale: 'es', locales: ['es','en'], prefixDefaultLocale: false }` and the `tailwindcss` Vite plugin (or `@tailwindcss/vite` for v4) wired in.

### Design Tokens (Tailwind v4 `@theme`)

Brand colors, fonts, and keyframes extracted from the source HTML:

```css
@theme {
  --color-bg-main: #060B18;
  --color-bg-sec:  #0E1628;
  --color-card-bg: #101A30;
  --color-text-main: #F8FAFC;
  --color-text-sec:  #94A3B8;
  --color-acc-blue:   #38BDF8;
  --color-acc-violet: #8B5CF6;
  --color-acc-cyan:   #22D3EE;
  --font-sora:  "Sora", system-ui, sans-serif;
  --font-inter: "Inter", system-ui, sans-serif;
  --animate-float: float 6s ease-in-out infinite;
  --animate-float-delayed: float 6s ease-in-out 2s infinite;
  --animate-pulse-glow: pulse-glow 3s ease-in-out infinite;
  --animate-slide-down: slideDown 0.5s ease-out;
}
```

Reusable classes (`.glass-nav`, `.premium-card`, `.text-gradient`, `.bg-gradient-primary`, `details/summary` reset, `.reveal`, `.reveal.visible`) go in `@layer components` in the same `global.css`. `prefers-reduced-motion: reduce` disables animations and reveals in one block.

### i18n Shape

```ts
// src/i18n/index.ts
export type Locale = 'es' | 'en';
export type Translations = Record<string, string>;
export function t(lang: Locale, key: keyof Translations): string { ... }
```

`es.ts` and `en.ts` export a flat `Translations` object (one entry per visible string). Adding a third locale later = add a new file + extend the `Locale` union.

### Component Patterns

- **Presentational, no `client:`** for Nav, Hero, TrustMetrics, Services, CaseStudyCard, ProcessTimeline, About, FinalCta, Footer, Section, LanguageToggle. Static HTML, scoped `<style>` only.
- **One client island**: `RevealObserver.astro` with `client:load` — toggles a `.visible` class on `.reveal` elements via `IntersectionObserver`. ~15 lines of JS, inlined.
- **Language toggle** is a plain `<a>` link. No JS, no `localStorage`, no `lang` attribute swapping. The router takes care of locale switching.
- **Dynamic year** in Footer comes from build-time `new Date().getFullYear()` in the component's frontmatter (no JS, no flicker).

## PR Slices (Chained, Review Workload Guard)

Total estimated diff ~1,000 lines across 3 PRs; each PR stays under the 400-line review budget.

| PR | Scope | Files touched (est.) | Key components | Depends on |
|----|-------|----------------------|----------------|------------|
| **PR1 — Foundation** | Clean scaffold, Tailwind v4 wiring, design tokens, base layout, i18n config + helpers, Nav, Footer, LanguageToggle. | ~12 files, ~280 LoC | `BaseLayout`, `Nav`, `Footer`, `LanguageToggle`, `global.css`, `i18n/{es,en,index}.ts`, `astro.config.mjs`, `tsconfig.json` path alias `@/*` | — |
| **PR2 — Story sections** | Hero, TrustMetrics, ProcessTimeline, About. | ~6 files, ~330 LoC | `Hero`, `TrustMetrics`, `ProcessTimeline`, `About`, `Section` | PR1 |
| **PR3 — Work + reveal** | Services, CaseStudyCard + 4 cases, Secondary projects row, FinalCta, `RevealObserver` island, dynamic year integration, README pointer to `docs/index.html`. | ~9 files, ~390 LoC | `Services`, `CaseStudyCard`, `FinalCta`, `RevealObserver` | PR2 |

Branch strategy: feature branch chain. PR1 targets `main`; PR2 targets `pr1/foundation`; PR3 targets `pr2/story`. Final merge to `main` happens after PR3 passes review.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modified | Add i18n config + Tailwind v4 Vite plugin. |
| `src/layouts/BaseLayout.astro` | New | Page shell, head meta, global.css import, slot. |
| `src/components/*` | New | 12 components listed in the file layout. |
| `src/pages/index.astro` | New | ES root page composing all sections. |
| `src/pages/en/index.astro` | New | EN root page. |
| `src/i18n/{es,en,index}.ts` | New | Translation tables + helper. |
| `src/styles/global.css` | New | Tailwind v4 `@theme` + `@layer components`. |
| `package.json` | Modified | Add `@tailwindcss/vite` (or `tailwindcss` v4) and `@astrojs/check` if not present. |
| `nul` | Removed | Stray null-byte file in repo root; PR1 deletes it. |
| `package-lock.json` | Removed | Project uses pnpm; npm lockfile is a duplicate. PR1 deletes it. |
| `docs/index.html` | Untouched | Preserved as historical source-of-truth (per `openspec/config.yaml` archive rules). |
| `openspec/specs/portfolio/{sections,i18n,design-tokens,scroll-reveal}/spec.md` | New (in sdd-spec phase) | Delta specs — not part of this proposal. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Chained-PR drift — PR2 or PR3 forgets to rebase onto the previous slice branch. | Medium | PR2 targets `pr1/foundation`, PR3 targets `pr2/story`; CI lint step on OpenSpec rules. Orchestrator rebases before each review. |
| Stale `nul` file + dual lockfile (`package-lock.json` + `pnpm-lock.yaml`) confuse pnpm installs. | Medium | PR1 deletes `nul` and `package-lock.json` in the same commit; `pnpm-workspace.yaml` already exists. |
| Scroll-reveal flash: elements with `.reveal` stay `opacity: 0` until JS runs, breaking SSR/SSG. | Medium | Default state in CSS is `opacity: 0; transform: translateY(20px)`; `RevealObserver` runs on `DOMContentLoaded` and marks them `.visible`. `prefers-reduced-motion` forces `opacity: 1` and skips the transform, so the page is always accessible even if JS fails. |
| Font-loading FOUC and `font-display` strategy. | Low | Use `font-display: swap` via `<link rel="preconnect">` to Google Fonts and `font-display: swap` in the `font-family` declaration; Astro's `<link rel="preload">` for the critical subset. |
| Component scope creep — case-study "ConectaPlay", "DeTour", "Fuera del Molde", "La Locura Bar" each could absorb 100+ lines of mockup HTML. | Medium | Each case is a single `.astro` file with inline data; no sub-components per case in this PR slice. If a case needs more than 80 LoC of mockup, it gets promoted to its own component. |

## Rollback Plan

- **PR1** is additive: reverts cleanly by deleting the new `src/` files, reverting `astro.config.mjs` and `package.json`, and restoring `nul` / `package-lock.json` from git. The default Astro scaffold remains untouched, so `npm run dev` still works.
- **PR2 / PR3** are pure additions on top of PR1. Reverting PR3 keeps the foundation + story sections live. Reverting PR2 keeps foundation only. No destructive deletes after PR1.
- The Astro build is fully static; the rollback target is "the previous `main` commit", not a runtime feature flag.

## Dependencies

- `@tailwindcss/vite` (Tailwind v4) — must be installed in PR1; check `pnpm` registry for the latest v4 minor.
- `@astrojs/check` and `typescript` — required for `npx astro check`; install in PR1.
- No backend, no DB, no third-party API.
- Google Fonts CDN is the only network dependency at runtime; switch to self-hosted later if needed.

## Open Questions

1. **Branch chain model**: should PR2/PR3 each target `main` (stack of feature branches merged sequentially) or chain off the previous slice (`pr1/foundation` → `pr2/story` → `pr3/work`)? The proposal currently assumes the chain model. Confirm before PR1 lands.
2. **Language toggle placement**: the source has the toggle in the Nav. Should the EN page's Nav still show a toggle pointing back to ES, or auto-hide since EN is the "alternate" view? Proposal currently keeps it visible on both — confirm.
3. **Case-study mockup fidelity**: the source uses fairly rich CSS mockups (gradients, layered divs, fake browser chrome). Do we reproduce them at 1:1 fidelity in this port, or accept a simplified mockup to keep PR3 under the 400-line budget? Proposal currently assumes simplified unless a case needs more.

## Success Criteria

- [ ] `npx astro check` passes with zero errors and zero warnings.
- [ ] `npm run build` produces `dist/index.html` (ES) and `dist/en/index.html` (EN) with all 12 sections rendered.
- [ ] Both pages serve identical content structure; the only difference is string content + `<html lang>`.
- [ ] Visual diff vs `docs/index.html` (ES only) is at most minor (font rendering / sub-pixel). No structural or color regressions.
- [ ] No Tailwind CDN script tag in the rendered HTML; all styles inlined by Astro's build.
- [ ] Lighthouse SEO score ≥ 95 on both pages.
- [ ] `prefers-reduced-motion: reduce` disables all keyframe animations and reveals.
- [ ] Total `dist/` weight ≤ 50 KB gzipped HTML+CSS (no images).
- [ ] `nul` and `package-lock.json` are gone; `pnpm install` is the only supported install path.

## Next Step

Once approved, proceed to `/sdd-spec` to write the detailed delta specs (one per new capability: `bilingual-content`, `portfolio-sections`, `design-tokens`, `scroll-reveal`).
