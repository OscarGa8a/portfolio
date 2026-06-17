# Design: Port Bilingual Portfolio

## Technical Approach

Port the 829-line `docs/index.html` into an Astro 6.4.7 static site with real `/` (ES) and `/en/` (EN) routes, replacing hand-rolled `lang-es`/`lang-en` span toggling with a typed `t()` helper over flat translation modules. Each of the 12 source sections becomes a composable `.astro` component; a single `RevealObserver` island (~15 lines JS, `client:load`) handles scroll-reveal. Design tokens migrate from an inline `tailwind.config` script to a Tailwind v4 `@theme` block in `global.css`, built via `@tailwindcss/vite`. The output is fully static — zero hydration except the observer island.

## Architecture Decisions

| # | Decision | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Scroll-reveal no-JS fallback | **(a) `<noscript>` block** in `RevealObserver.astro` injecting `<style>.reveal{opacity:1!important;transform:none!important}</style>` | More reliable than `@media (scripting: none)` which has inconsistent browser support (notably absent in Firefox). `<noscript>` is universally honored. Keeps the fallback co-located with the observer code, matching the "single mechanism" spec requirement. |
| 2 | CaseStudyCard prop shapes | See §Interfaces below | Typed interfaces enforce key-safety at build time; `features: Array<keyof Translations>` ensures only valid translation keys pass through. Named slot `mockup` avoids forking the component per case. |
| 3 | i18n file structure | Flat `Record<string, string>` per locale; `t(lang, key)` pure function; Astro's `getRelativeLocaleUrl` for `LanguageToggle` | Flat keys (no nesting) match the spec's grep-ability requirement. Using Astro's built-in `getRelativeLocaleUrl` avoids reinventing URL generation and respects `prefixDefaultLocale: false` automatically. |
| 4 | Section.astro wrapper | Props: `id: string`, `className?: string`, `reveal?: boolean` (default `true`), `padding?: string` (default `'py-24'`), `container?: boolean` (default `true`). Used by: Hero, TrustMetrics, Services, CaseStudies, SecondaryProjects (inner), ProcessTimeline, About, FinalCta | Centralizes the `max-w-7xl mx-auto px-6 lg:px-8` container and `reveal` class so sections don't repeat boilerplate. Nav and Footer opt out (they have unique layout needs). |
| 5 | Component file layout | See §Architecture below | `BaseLayout` owns `<html lang>`, head meta, global.css, slot. Pages are thin compositions. Each component is presentational (no `client:`) except `RevealObserver`. |
| 6 | Tailwind v4 integration | **(b) `@tailwindcss/vite`** Vite plugin | Tailwind v4 is CSS-first and ships its own Vite plugin. `@astrojs/tailwind` wraps v3 patterns and adds PostCSS overhead. The Vite plugin is the officially recommended path for v4 + Astro, requires no `tailwind.config.js`, and reads the `@theme` block directly from CSS. |
| 7 | Path aliases | Add `"@/*": ["./src/*"]` to `tsconfig.json` `compilerOptions.paths` | Shorter imports (`@/components/Nav` vs `../../components/Nav`), especially valuable when pages import 10+ components. Standard Astro convention. |
| 8 | Case study data flow | **(b) Single `src/data/caseStudies.ts`** with i18n keys + non-translatable data | Centralizes the four case studies so both locale pages iterate over the same array. Translatable strings are stored as `keyof Translations` references (not values), keeping the data file locale-agnostic. Inline frontmatter would duplicate the array across pages. |
| 9 | Font loading | Preconnect to `fonts.googleapis.com` + `fonts.gstatic.com` (crossorigin), stylesheet with `display=swap`. No `<link rel="preload">` | Preconnect + `display=swap` is the sweet spot: fonts load in parallel, text renders with fallback immediately. Preload would block the critical path for a font file and is overkill for two families. |
| 10 | Dynamic year | Build-time `new Date().getFullYear()` in `Footer.astro` frontmatter, rendered as literal string | Zero runtime JS, no `<script>` tag, no `<span id="year">`. Matches the spec requirement exactly. |

## Architecture

### File Layout

```
src/
├── pages/
│   ├── index.astro              # ES root — composes all sections, passes locale='es'
│   └── en/
│       └── index.astro          # EN root — identical composition, locale='en'
├── layouts/
│   └── BaseLayout.astro         # <html lang>, <head>, global.css, slot, RevealObserver
├── components/
│   ├── Nav.astro                # Fixed glass-nav, brand, links, LanguageToggle, CTA
│   ├── Hero.astro               # Badge, headline, paragraph, CTAs, trust chips, mockups
│   ├── TrustMetrics.astro       # 4-column metrics strip
│   ├── Services.astro           # 4-card services grid
│   ├── CaseStudyCard.astro      # Reusable card (accepts mockup slot, features keys)
│   ├── CaseStudyMockups.astro   # 4 named mockup fragments (dashboard, mobile, ecommerce, bar)
│   ├── SecondaryProjects.astro  # 2-card "More projects" row
│   ├── ProcessTimeline.astro    # 5-step vertical timeline
│   ├── About.astro              # Profile card + bio + skill tags
│   ├── FinalCta.astro           # CTA card with WhatsApp + email
│   ├── Footer.astro             # Brand, links, social, copyright with dynamic year
│   ├── Section.astro            # Generic <section> wrapper (id, className, reveal, padding)
│   ├── LanguageToggle.astro     # Plain <a> to the other locale
│   └── RevealObserver.astro     # client:load island — IntersectionObserver + noscript fallback
├── data/
│   └── caseStudies.ts           # Array of CaseStudy objects with i18n key references
├── i18n/
│   ├── index.ts                 # Locale type, Translations type, t() helper, dictionaries
│   ├── es.ts                    # ~113 Spanish string values
│   └── en.ts                    # ~113 English string values (same keys)
└── styles/
    └── global.css               # @import "tailwindcss" + @theme + @layer components + a11y media queries
```

### Component Responsibility Table

| Component | Responsibility | PR |
|-----------|---------------|-----|
| `BaseLayout.astro` | HTML shell, lang attr, head meta (hreflang, fonts, SEO), global.css import, slot, RevealObserver mount | PR1 |
| `Nav.astro` | Fixed nav bar with glass-nav styling, brand link, section anchors, LanguageToggle, CTA button | PR1 |
| `LanguageToggle.astro` | Plain `<a>` pointing to the other locale URL with locale code label | PR1 |
| `Footer.astro` | Brand, section links, social icons, copyright with build-time year | PR1 |
| `Section.astro` | Shared `<section>` wrapper: id, container, reveal class, padding | PR2 |
| `Hero.astro` | Badge, headline, paragraph, supporting line, dual CTAs, trust chips, dashboard+mobile mockups | PR2 |
| `TrustMetrics.astro` | 4-column metrics strip with colored borders | PR2 |
| `ProcessTimeline.astro` | 5-step vertical timeline with numbered circles and connecting line | PR2 |
| `About.astro` | Profile placeholder card, bio paragraph, skill tags | PR2 |
| `Services.astro` | 4-card grid with icons, descriptions, feature lists | PR3 |
| `CaseStudyCard.astro` | Data-driven card: category, title, description, features, details accordion, CTA. Named slot for mockup | PR3 |
| `CaseStudyMockups.astro` | 4 exported mockup fragments (ConectaPlay dashboard, DeTour mobile, Fuera e-commerce, Locura bar profile) | PR3 |
| `SecondaryProjects.astro` | 2-card row for CIA Vial del Llano and DeTour Web | PR3 |
| `FinalCta.astro` | Premium card with WhatsApp + email CTAs | PR3 |
| `RevealObserver.astro` | IntersectionObserver island, prefers-reduced-motion, noscript fallback | PR3 |

### Data Flow

```
src/i18n/es.ts ──┐
                  ├──→ src/i18n/index.ts (Locale, Translations, t())
src/i18n/en.ts ──┘          │
                            ▼
src/pages/index.astro ──→ locale = 'es'
src/pages/en/index.astro ─→ locale = 'en'
         │                        │
         ▼                        ▼
   ┌─────────────────────────────────┐
   │  BaseLayout.astro (lang, head)  │
   ├─────────────────────────────────┤
   │  Nav → Hero → TrustMetrics →    │
   │  Services → CaseStudyCard(×4) → │
   │  SecondaryProjects →            │
   │  ProcessTimeline → About →      │
   │  FinalCta → Footer              │
   └─────────────────────────────────┘
         │
         ▼
   src/data/caseStudies.ts (array of CaseStudy)
         │
         ▼
   t(locale, study.categoryKey)  → "Plataforma de gestión deportiva"
   t(locale, study.features[0])  → "Reservas en tiempo real"
```

### i18n Key Inventory (~113 keys)

| Category | Prefix | Count | Examples |
|----------|--------|-------|---------|
| Nav | `nav_` | 5 | `nav_specialties`, `nav_case_studies` |
| Hero | `hero_` | 11 | `hero_badge`, `hero_title`, `hero_chip_1`–`hero_chip_5` |
| Trust Metrics | `trust_` | 8 | `trust_years_label`, `trust_years_desc` |
| Services | `services_` | 22 | `services_web_title`, `services_web_feat_1` (4 services × 5 keys + 2 shared) |
| Case Studies | `case_` | 39 | `case_conectaplay_category`, `case_problem_label`, `case_visit_site` |
| Secondary | `secondary_` | 3 | `secondary_title`, `secondary_cia_desc` |
| Process | `process_` | 12 | `process_step_1_title`, `process_step_1_desc` (5 steps × 2 + 2 shared) |
| About | `about_` | 7 | `about_title`, `about_paragraph`, `about_tag_1`–`about_tag_5` |
| Final CTA | `cta_` | 4 | `cta_title`, `cta_whatsapp` |
| Footer | `footer_` | 2 | `footer_tagline`, `footer_rights` |
| **Total** | | **113** | |

### PR Slice Mapping

| PR | Scope | New Files | Modified Files | Est. LoC |
|----|-------|-----------|----------------|----------|
| **PR1 — Foundation** | Tailwind v4 wiring, design tokens, BaseLayout, i18n config + helpers, Nav, Footer, LanguageToggle, path aliases, cleanup | `BaseLayout.astro`, `Nav.astro`, `Footer.astro`, `LanguageToggle.astro`, `global.css`, `i18n/{es,en,index}.ts` (6 new) | `astro.config.mjs`, `tsconfig.json`, `package.json`, delete `nul` + `package-lock.json`, delete `Welcome.astro` + `Layout.astro` (5 modified/deleted) | ~280 |
| **PR2 — Story sections** | Hero, TrustMetrics, ProcessTimeline, About, Section wrapper | `Hero.astro`, `TrustMetrics.astro`, `ProcessTimeline.astro`, `About.astro`, `Section.astro`, `pages/index.astro` (partial), `pages/en/index.astro` (7 new) | `pages/index.astro` (rewrite), `pages/en/index.astro` (new) | ~330 |
| **PR3 — Work + reveal** | Services, CaseStudyCard + mockups, SecondaryProjects, FinalCta, RevealObserver, data file | `Services.astro`, `CaseStudyCard.astro`, `CaseStudyMockups.astro`, `SecondaryProjects.astro`, `FinalCta.astro`, `RevealObserver.astro`, `data/caseStudies.ts` (7 new) | `pages/index.astro`, `pages/en/index.astro` (wire remaining sections) | ~390 |
| **Total** | | **20 new** | **5 modified/deleted** | **~1000** |

## Interfaces / Contracts

```typescript
// src/i18n/index.ts
export type Locale = 'es' | 'en';

import es from './es';
import en from './en';

const dictionaries: Record<Locale, typeof es> = { es, en };
export type Translations = typeof es;
export type TranslationKey = keyof Translations;

export function t(lang: Locale, key: TranslationKey): string {
  const dict = dictionaries[lang];
  if (!(key in dict)) {
    throw new Error(`Missing translation key "${key}" for locale "${lang}"`);
  }
  return dict[key];
}
```

```typescript
// src/data/caseStudies.ts
import type { TranslationKey } from '@/i18n';

export interface CaseStudy {
  id: string;                                    // 'conectaplay' | 'detour' | 'fuera-del-molde' | 'la-locura-bar'
  title: string;                                 // Non-translatable proper noun
  categoryKey: TranslationKey;                   // e.g. 'case_conectaplay_category'
  descriptionKey: TranslationKey;
  features: [TranslationKey, TranslationKey, TranslationKey]; // Exactly 3 feature keys
  problemKey: TranslationKey;
  solutionKey: TranslationKey;
  resultKey: TranslationKey;
  ctaKey: TranslationKey;                        // e.g. 'case_visit_site' or 'case_detour_cta'
  ctaHref: string;                               // '#', real URL, or Play Store link
  variant: 'image-left' | 'image-right';
  accentColor: string;                           // Tailwind color: 'accCyan' | 'accViolet' | 'pink-400' | 'yellow-400'
}

export const caseStudies: CaseStudy[] = [ /* 4 entries */ ];
```

```astro
---
// CaseStudyCard.astro props
import type { CaseStudy } from '@/data/caseStudies';
import type { Locale, TranslationKey } from '@/i18n';

interface Props {
  study: CaseStudy;
  locale: Locale;
}
---
<!-- Uses <slot name="mockup" /> for the visual mockup -->
```

```astro
---
// Section.astro props
interface Props {
  id?: string;
  className?: string;
  reveal?: boolean;    // default: true
  padding?: string;    // default: 'py-24'
  container?: boolean; // default: true (max-w-7xl mx-auto px-6 lg:px-8)
}
---
```

```astro
---
// BaseLayout.astro props
interface Props {
  locale: 'es' | 'en';
  title: string;
  description: string;
}
---
```

## Cross-Cutting Concerns

### Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Type check | i18n key parity, prop types, component imports | `npx astro check` (zero errors/warnings gate) |
| Build | Static output correctness | `npm run build` produces `dist/index.html` + `dist/en/index.html` |
| Visual | Source fidelity | Manual diff: `docs/index.html` vs rendered output side-by-side |
| Accessibility | `prefers-reduced-motion`, no-JS fallback, `hreflang` | Manual browser check + Lighthouse SEO ≥ 95 |

No test runner configured per `openspec/config.yaml` `tdd: false`. Quality gate is `astro check` + build + visual diff.

### Accessibility

- `prefers-reduced-motion: reduce` disables all keyframe animations and forces `.reveal` visible (CSS + JS short-circuit)
- `<noscript>` block ensures no-JS users see full content
- `<html lang>` matches locale on every page
- `hreflang` alternates + `x-default` in head for SEO
- Semantic HTML: `<nav>`, `<section>`, `<footer>`, `<details>/<summary>` preserved from source

### Performance

- Static HTML output, zero JS hydration except ~15-line RevealObserver island
- No Tailwind CDN script — all CSS compiled at build time
- Google Fonts via preconnect + `display=swap` (no FOIT)
- Target: ≤ 50 KB gzipped HTML+CSS per page

### SEO

- Canonical URLs via `hreflang` tags on both pages
- `<html lang>` correct per locale
- Semantic heading hierarchy (h1 → h2 → h3) preserved from source
- Lighthouse SEO target: ≥ 95

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| i18n key drift — a key added to `es.ts` but forgotten in `en.ts` | Medium | TypeScript enforces key parity: both files typed as `Translations`, `astro check` catches mismatches at build time |
| PR3 mockup fidelity exceeds 400-line budget | Medium | Mockups live in `CaseStudyMockups.astro` (separate file), keeping `CaseStudyCard.astro` lean. If combined diff exceeds budget, split mockups into a 4th commit within PR3 |
| Tailwind v4 `@theme` syntax changes in minor versions | Low | Pin `@tailwindcss/vite` to exact version in PR1; verify with `astro check` before each PR |
| `getRelativeLocaleUrl` behavior with `prefixDefaultLocale: false` | Low | Test in PR1 dev server: ES toggle should resolve `/en/`, EN toggle should resolve `/`. Fallback: hardcode paths |

## Open Questions

- [ ] **Case study accent color typing**: Should `accentColor` be a union of known Tailwind color names (`'accCyan' | 'accViolet' | 'pink-400' | 'yellow-400'`) or a freeform string? Recommendation: union type for safety.
- [ ] **Ambient background glows**: The source has two fixed `div` glows (violet + blue, `animate-pulse-glow`). Should these live in `BaseLayout.astro` (shared across all pages) or in each page? Recommendation: `BaseLayout` — they're decorative and locale-independent.

## Chain-Merge Workflow for Review

This section explains how the three PRs land on `main` using a **feature branch chain**.

### What "feature branch chain" means

Each PR is developed on its own branch, but instead of all branches forking from `main`, they form a chain: PR2's branch forks from PR1's branch, and PR3's branch forks from PR2's branch. When each PR passes review, it gets merged into `main`, and the next branch is rebased onto the updated `main`.

### Why all three PRs end up on main

The merge target is always `main`. "Branching off previous" is just the development source — it lets you build incrementally without waiting for the previous PR to merge. But the final destination for all three is `main`, not dangling feature branches.

### The exact git workflow

**PR1 — Foundation:**
```bash
git checkout main
git checkout -b pr1/foundation
# ... implement PR1 changes ...
git push -u origin pr1/foundation
gh pr create --base main --title "PR1: Foundation — scaffold, design tokens, i18n, Nav, Footer"
# Review → merge to main
```

**PR2 — Story sections:**
```bash
git checkout pr1/foundation   # branch from PR1's work
git checkout -b pr2/story
# ... implement PR2 changes ...
git push -u origin pr2/story
gh pr create --base main --title "PR2: Story sections — Hero, TrustMetrics, Process, About"
# If PR1 merged first:
git fetch origin && git rebase origin/main   # rebase onto current main
git push --force-with-lease
# Review → merge to main
```

**PR3 — Work + reveal:**
```bash
git checkout pr2/story        # branch from PR2's work
git checkout -b pr3/work
# ... implement PR3 changes ...
git push -u origin pr3/work
gh pr create --base main --title "PR3: Services, case studies, reveal observer"
# After PR2 merges:
git fetch origin && git rebase origin/main
git push --force-with-lease
# Review → merge to main
```

### Key distinction

- **"Targeting main"** = the merge target (where the PR lands). Always `main`.
- **"Branching off previous"** = the development source (where you start coding). Previous PR's branch.

After each merge, the next branch rebases onto `main` so the GitHub diff shows only that PR's changes — not the previous PR's commits.

## Next Step

Ready for tasks (`sdd-tasks`).
