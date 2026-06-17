# Spec: design-tokens

## Purpose

Defines the single source of truth for visual design — brand colors, font families, keyframe animations, and reusable component classes — as a Tailwind v4 `@theme` block plus an `@layer components` block in `src/styles/global.css`. This capability replaces the source HTML's inline `tailwind.config = { ... }` script and hand-rolled `<style>` block with a build-time, type-checked design system that all components import. No Tailwind CDN script tag, no inline `<style>` block, no per-component design drift.

## Requirements

### Requirement: Single Tailwind v4 `@theme` block in global.css

The system MUST declare all design tokens (brand colors, font families, keyframe animations) inside a single `@theme { ... }` block in `src/styles/global.css`. The block MUST be imported by `BaseLayout.astro` so every page receives the tokens. The eight brand colors from the source HTML — `bgMain` (`#060B18`), `bgSec` (`#0E1628`), `cardBg` (`#101A30`), `textMain` (`#F8FAFC`), `textSec` (`#94A3B8`), `accBlue` (`#38BDF8`), `accViolet` (`#8B5CF6`), `accCyan` (`#22D3EE`) — MUST be exposed as Tailwind v4 `--color-*` custom properties.

#### Scenario: Brand colors are defined exactly once

- GIVEN `src/styles/global.css`
- WHEN the file is parsed
- THEN it contains exactly one `@theme` block
- AND that block declares all eight brand colors as `--color-bg-main`, `--color-bg-sec`, `--color-card-bg`, `--color-text-main`, `--color-text-sec`, `--color-acc-blue`, `--color-acc-violet`, `--color-acc-cyan`
- AND no other CSS file declares a brand color literal

#### Scenario: Utility classes resolve against the theme

- GIVEN the `@theme` block is loaded
- WHEN a component uses `class="bg-bg-main"` or `text-acc-blue`
- THEN the corresponding utility resolves to the brand color value at build time
- AND the rendered HTML/CSS does NOT contain a Tailwind CDN script tag

### Requirement: Two font families loaded with preconnect and font-display swap

The system MUST define two font families in the `@theme` block: `--font-sora` (`"Sora", system-ui, sans-serif`) for headings and `--font-inter` (`"Inter", system-ui, sans-serif`) for body copy. The fonts MUST be loaded from Google Fonts via `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com` (with `crossorigin`), and the stylesheet link MUST be `?display=swap` so text renders with a fallback before Sora/Inter arrive. The `<link>` tags MUST live in `BaseLayout.astro`.

#### Scenario: Sora is used for headings, Inter for body

- GIVEN the `@theme` block declares both families
- WHEN a component uses `class="font-sora"` on an `<h2>` and `font-inter` on the body
- THEN the rendered CSS applies Sora to the heading and Inter to body text

#### Scenario: Fonts load with font-display swap

- GIVEN `BaseLayout.astro` includes the Google Fonts link
- WHEN the page is rendered
- THEN the `<head>` contains `<link rel="preconnect" href="https://fonts.googleapis.com">`
- AND `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- AND the stylesheet href includes `display=swap`

### Requirement: Four keyframe animations

The system MUST define four keyframe animations in the `@theme` block: `float` (6s ease-in-out infinite, `translateY(0 → -15px → 0)`), `float-delayed` (same curve, 2s delay), `pulse-glow` (3s ease-in-out infinite, `opacity 0.4 → 0.7`, `scale 1 → 1.05`), and `slideDown` (0.5s ease-out, `opacity 0 → 1` and `translateY(-10px → 0)`). The first three MUST be exposed as `--animate-float`, `--animate-float-delayed`, `--animate-pulse-glow` so Tailwind v4 generates the `animate-float`, `animate-float-delayed`, `animate-pulse-glow` utility classes. `slideDown` MUST be available as a raw keyframe for the case-study `<details>` open animation.

#### Scenario: Animated elements receive the right utility class

- GIVEN a component uses `class="animate-float"` on a hero mockup
- WHEN the page renders
- THEN the element receives a CSS animation referencing the `float` keyframes
- AND the visual behavior matches the source `docs/index.html` (gentle up-and-down bob)

#### Scenario: Accordion details animate with slideDown

- GIVEN a case study uses `<details>` to expand a case study
- WHEN the user opens it
- THEN the children animate with `slideDown` keyframes (opacity + translateY)

### Requirement: Reusable component classes in `@layer components`

The system MUST define the following classes inside an `@layer components { ... }` block in `src/styles/global.css`: `.glass-nav` (translucent dark background with backdrop blur for the Nav), `.premium-card` (card background, subtle border, hover lift), `.text-gradient` (blue→violet→cyan text gradient via `background-clip: text`), `.bg-gradient-primary` (blue→violet solid gradient), `.reveal` (initial `opacity: 0; transform: translateY(20px)`), and `.reveal.visible` (final `opacity: 1; transform: translateY(0)`). The `details > summary` reset (no marker, hover background) and the `details[open] summary ~ * { animation: slideDown }` rule MUST also live in this layer.

#### Scenario: glass-nav styles the Nav correctly

- GIVEN `.glass-nav` is defined with `background: rgba(6,11,24,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05);`
- WHEN `Nav.astro` renders with `class="glass-nav"`
- THEN the Nav appears translucent with backdrop blur over the hero, matching the source

#### Scenario: premium-card lifts on hover

- GIVEN `.premium-card` defines `transition: all 0.3s ease`
- AND `.premium-card:hover` defines `transform: translateY(-4px); box-shadow: ...`
- WHEN a user hovers a case-study card
- THEN the card lifts 4px and gains the cyan-tinted shadow

#### Scenario: Reveal classes support the scroll-reveal island

- GIVEN `.reveal` is `opacity: 0; transform: translateY(20px)`
- AND `.reveal.visible` is `opacity: 1; transform: translateY(0)`
- WHEN the `RevealObserver` island adds the `.visible` class to an element on scroll
- THEN the element fades and slides in over the transition duration

### Requirement: `prefers-reduced-motion` disables animations and reveals

The system MUST include a `@media (prefers-reduced-motion: reduce)` block in `src/styles/global.css` that (1) sets `animation: none !important;` on every animated element, and (2) forces `.reveal` to its final visible state (`opacity: 1 !important; transform: none !important;`) so the scroll-reveal island has nothing to hide. This block MUST live alongside the `@theme` and `@layer components` blocks in the same file.

#### Scenario: Reduced-motion users see no animation

- GIVEN the OS-level `prefers-reduced-motion: reduce` is set
- WHEN the page renders
- THEN no keyframe animation runs (the ambient glows, hero mockup float, pulse-glow are all stopped)
- AND every `.reveal` element is already in its final state, so the observer has no work to do

#### Scenario: No-content-flash fallback for users with motion + no JS

- GIVEN `prefers-reduced-motion: reduce` is set AND JavaScript is disabled
- WHEN the page renders
- THEN every section is fully visible (no `opacity: 0` left behind)
- AND the page is accessible and complete
