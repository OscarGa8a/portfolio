# Spec: scroll-reveal

## Purpose

Defines the single client-side island that toggles a `.visible` class on `.reveal` elements as they enter the viewport. This capability owns the only piece of client-side JavaScript in the entire portfolio — `RevealObserver.astro` uses `IntersectionObserver` with a `0.15` threshold, unobserves each element after its first reveal, respects `prefers-reduced-motion`, and degrades gracefully to "always visible" when JavaScript is disabled. Every section in the source HTML that has `class="reveal"` MUST be wired up to this island; the observer is shared, not per-section.

## Requirements

### Requirement: One `RevealObserver` island with `client:load`

The system MUST provide a single `RevealObserver.astro` component that mounts with `client:load` in `BaseLayout.astro` (or in each root page). The component MUST inline a small script (target: ~15 lines of JavaScript) that uses `IntersectionObserver` to add a `.visible` class to every element with the `reveal` class as it enters the viewport. The threshold MUST be `0.15`, the root MUST be `null` (viewport), and the root margin MUST be `0px` to match the source behavior. No other `client:` directive is permitted in the entire portfolio.

#### Scenario: Single observer, multiple sections

- GIVEN ten `.reveal` elements across the page (Hero copy, Hero mockup, TrustMetrics, Services, CaseStudies, ProcessTimeline, About, FinalCta, etc.)
- WHEN the page loads
- THEN exactly one `IntersectionObserver` is created
- AND all ten elements are observed by it

#### Scenario: Threshold and root match the source

- GIVEN `RevealObserver.astro` initializes the observer
- WHEN the script runs
- THEN the observer options are `{ root: null, rootMargin: '0px', threshold: 0.15 }`

### Requirement: Unobserve after first reveal

The observer MUST call `observer.unobserve(entry.target)` for every element that fires `isIntersecting === true`, so each element animates exactly once. An element that scrolls out and back in MUST NOT re-trigger the animation — the `.visible` class stays on the element permanently.

#### Scenario: Element animates once and stays revealed

- GIVEN a `.reveal` element is below the fold
- WHEN the user scrolls it into view
- THEN it gains `.visible` and the observer stops watching it
- AND scrolling it out and back in does NOT remove `.visible`

### Requirement: Fallback to immediate visible state when JavaScript is disabled

The system MUST ensure that, when JavaScript is disabled (or fails to load), every `.reveal` element is rendered in its final visible state — not in the initial hidden state. The mechanism MUST be one of: (a) a `<noscript>` block in `RevealObserver.astro` (or in `BaseLayout.astro`) that sets every `.reveal` element's `style.opacity = '1'; style.transform = 'none';`, OR (b) a `@media (scripting: none) { .reveal { opacity: 1; transform: none; } }` rule in `src/styles/global.css`. The mechanism chosen MUST apply to every `.reveal` element on the page, not per section.

#### Scenario: No-JS user sees the full page immediately

- GIVEN JavaScript is disabled in the browser
- WHEN the page renders
- THEN no `.reveal` element is stuck at `opacity: 0`
- AND every section is fully visible and readable

#### Scenario: No-JS fallback is a single mechanism

- GIVEN the no-JS handling
- WHEN the codebase is searched
- THEN the handling lives in exactly one file (either `RevealObserver.astro` via `<noscript>` or `global.css` via `@media (scripting: none)`)
- AND no per-section duplicates exist

### Requirement: Respects `prefers-reduced-motion`

The system MUST detect `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at observer initialization. When that media query matches, the observer MUST short-circuit: skip observing entirely, and force every `.reveal` element into its final state by adding `.visible` immediately. The detection MUST happen once at init, not per element. (Note: the design-tokens spec already neutralizes the visual transition via CSS; this requirement ensures the observer also has no work to do.)

#### Scenario: Reduced-motion users get no observer work

- GIVEN `prefers-reduced-motion: reduce` is set
- WHEN the page loads
- THEN the observer does not run `observe()` on any element
- AND every `.reveal` element receives `.visible` synchronously at init

#### Scenario: Detection happens once

- GIVEN the reduced-motion check
- WHEN the script executes
- THEN `matchMedia` is called exactly once during initialization

### Requirement: All `class="reveal"` elements in the source are wired

Every `<section>` and per-section content block in `docs/index.html` that has `class="reveal"` MUST be reproduced with the same class in the Astro port, so the `RevealObserver` has the same targets as the source. The count of `.reveal` elements in the rendered HTML MUST equal (or exceed, by design choice) the count in the source: at minimum, the Hero copy column, the Hero mockup column, the TrustMetrics strip, the Services section, the CaseStudies section, the ProcessTimeline section, the About section, and the FinalCta section — each MUST carry `class="reveal"` on its outer wrapper.

#### Scenario: Source-faithful reveal targets

- GIVEN `docs/index.html` has nine `class="reveal"` markers (Hero copy, Hero mockup, TrustMetrics, Services, CaseStudies, ProcessTimeline, About, FinalCta — at minimum)
- WHEN the rendered ES page is inspected
- THEN the same nine elements (or more) carry `class="reveal"`
- AND the observer finds all of them at init

#### Scenario: No unobserved reveal elements remain after scroll

- GIVEN a user scrolls to the bottom of the page
- WHEN the final section animates in
- THEN every `.reveal` element in the DOM has the `.visible` class
