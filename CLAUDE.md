# Oscar García Dev — Portfolio

Astro + Tailwind v4 + TypeScript portfolio. Static site, two locales (ES/EN).

## Stack

- **Framework**: Astro 5 (static, no SSR)
- **Styles**: Tailwind v4 — CSS-first, no `tailwind.config.js`
- **i18n**: Custom (`src/i18n/es.ts` + `src/i18n/en.ts`) — routes: `/` → ES, `/en/` → EN
- **Fonts**: Bricolage Grotesque Variable (`font-display`, headings), Geist Variable (`font-body`, body) — self-hosted via Fontsource

## Design System

### @theme tokens (`src/styles/global.css`)

Always use these instead of raw hex or arbitrary values:

| Token | Class | Use |
|---|---|---|
| `--color-bg-main` | `bg-bg-main` | Page background |
| `--color-bg-sec` | `bg-bg-sec` | Secondary surfaces |
| `--color-card-bg` | `bg-card-bg` | Cards and panels |
| `--color-text-main` | `text-text-main` | Primary text |
| `--color-text-sec` | `text-text-sec` | Secondary/muted text |
| `--color-accent` | `text-accent` / `bg-accent` | Single locked accent (warm amber) |
| `--color-accent-strong` | `text-accent-strong` / `bg-accent-strong` | Accent hover / brighter amber |
| `--font-display` | `font-display` | Bricolage Grotesque — headings |
| `--font-body` | `font-body` | Geist — body |
| `--animate-float` | `animate-float` | Floating card animation |
| `--animate-float-delayed` | `animate-float-delayed` | Float with 3s delay |

> Design system is **single-accent** (warm amber). There is no blue/violet/cyan and no rainbow gradient — one accent across the whole page.

### Component classes (`@layer components` in `global.css`)

Prefer these over raw utility combinations:

| Class | Purpose |
|---|---|
| `glass-nav` | Navbar: dark bg + backdrop blur + bottom border |
| `premium-card` | Card: `card-bg` + border + hover lift |
| `text-gradient` | Single-hue amber highlight text (`accent-strong` → `accent`) |
| `bg-gradient-primary` | Amber accent gradient background |
| `shadow-white-glow` | White glow — primary CTA buttons |
| `reveal` | Scroll reveal base state (JS adds `.visible`) |

## Code Rules

### No arbitrary bracket values when a standard equivalent exists

Before writing `class-[value]`, check:
1. Is there a standard Tailwind utility? → use it
2. Is there a `@theme` token for this project? → use it
3. Is this value used 2+ times? → add a token or component class to `global.css`
4. None of the above → arbitrary bracket value is acceptable

**Examples:**

```
❌ text-[14px]          ✅ text-sm
❌ w-[200px]            ✅ w-48  (close enough)
❌ bg-[#161518]         ✅ bg-card-bg
❌ text-[#E5A23E]       ✅ text-accent
❌ shadow-[0_0_20px_rgba(255,255,255,0.1)]  ✅ shadow-white-glow
```

**Acceptable arbitrary values (no standard equivalent):**

```
min-h-[90vh]           — no min-h-screen equivalent at 90%
h-[420px]              — Tailwind spacing scale stops at h-96 (384px)
left-[2%] top-[6%]    — percentage positioning
shadow-[...brand-color...]  — one-off colored glows per project
```

### Shadows

- Use standard Tailwind (`shadow-sm` → `shadow-2xl`) when the default dark shadow fits
- Use `shadow-white-glow` for white-glow CTAs
- For brand-colored glows used once per element: arbitrary `shadow-[...]` is fine
- If a colored shadow appears on 2+ elements: create a named class in `global.css`

### i18n

Every user-visible string goes through `t(lang, 'key')`. Add the key to **both** `es.ts` and `en.ts` or the build throws. Decorative non-copy labels (e.g. project names in image captions) can be hardcoded.

### Component conventions

- Props typed via `interface Props` in the frontmatter
- Lang always passed as `lang: Locale` — never read from URL inside components
- Animations use the CSS classes from `@theme` (`animate-float`, etc.), not inline styles
