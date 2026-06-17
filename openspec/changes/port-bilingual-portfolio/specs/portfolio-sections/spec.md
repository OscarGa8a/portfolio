# Spec: portfolio-sections

## Purpose

Defines the 12-section structure of the portfolio as composable `.astro` components, ordered exactly as the source HTML, and the routing that ties them to the two locales. This capability owns the presentational layer: every section that the user scrolls through is a single `.astro` file under `src/components/`, and the two root pages are thin compositions that import and render the full stack in order. Sections that share a wrapper (`<section id="...">`, `class="reveal"`, container width) go through `Section.astro` so the boilerplate lives in one place.

## Requirements

### Requirement: Twelve sections in source order

The system MUST render the following twelve sections, in this exact order, on every page: (1) `Nav`, (2) `Hero` (with trust chips and dashboard/mobile mockup), (3) `TrustMetrics`, (4) `Services`, (5) `CaseStudies` (with the four case studies), (6) `SecondaryProjects`, (7) `ProcessTimeline`, (8) `About`, (9) `FinalCta`, (10) `Footer`. The order MUST match `docs/index.html` lines 129–785 exactly. Each section MUST be implemented as a `.astro` file under `src/components/`, named after the section in PascalCase.

#### Scenario: Page composition renders all twelve sections in order

- GIVEN a clean build of the ES page
- WHEN a user requests `/`
- THEN the rendered DOM contains the twelve section markers (`<nav>`, `<section>` with `id="especialidades"`, `id="casos"`, `id="proceso"`, `id="sobre-mi"`, `id="contacto"`, `<footer>`) in the order listed
- AND no extra sections appear before, between, or after them

#### Scenario: EN page matches ES page structure

- GIVEN a clean build of the EN page
- WHEN a user requests `/en/`
- THEN the same twelve section markers appear in the same order
- AND the only difference from the ES page is string content and `<html lang>`

### Requirement: Section wrapper component for shared boilerplate

The system MUST provide a `Section.astro` wrapper component that accepts an `id` prop and an optional `class` prop and emits `<section id={id} class={className}>` with the standard container (`max-w-7xl mx-auto px-6 lg:px-8`) and the `reveal` class on every section that needs scroll-reveal. Section components that have a `py-*` padding and a standard container MUST delegate to `Section.astro` for the outer tag rather than re-implementing the wrapper.

#### Scenario: Hero renders inside a Section wrapper

- GIVEN `Hero.astro` is composed
- WHEN it renders
- THEN the outermost element of the hero copy column is wrapped in a Section or a div that carries the same `class="reveal"` behavior defined in the design-tokens spec

#### Scenario: Sections share the container width

- GIVEN a section uses `Section.astro`
- WHEN it renders
- THEN the content is constrained to `max-w-7xl mx-auto px-6 lg:px-8`
- AND the visual layout matches the source `docs/index.html` at the same breakpoints

### Requirement: CaseStudyCard driven by data, four instances

The system MUST provide a single `CaseStudyCard.astro` component that accepts the case study data as props (title, category key, description key, `features: Array<keyof Translations>`, problem/solution/result blocks, CTA label + href, and a `variant: 'image-left' | 'image-right'` for layout direction) and renders the case study card markup. The four case studies (ConectaPlay, DeTour, Fuera del Molde, La Locura Bar) MUST be data-only — the same component instance is rendered four times with different props in `src/pages/index.astro` and `src/pages/en/index.astro`. A mockup slot MUST accept a `<slot name="mockup">` so the four different mockups (dashboard, mobile, e-commerce, bar) can be passed as JSX without forking the card component.

#### Scenario: Four case studies render via the same component

- GIVEN `CaseStudyCard.astro` exists
- WHEN `src/pages/index.astro` is composed
- THEN it renders the component four times
- AND the four titles in the rendered DOM are `ConectaPlay`, `DeTour`, `Fuera del Molde`, `La Locura Bar` (in that order)

#### Scenario: Mockup variants are passed via slot, not forked component

- GIVEN the four case studies have visually different mockups
- WHEN the card is rendered for ConectaPlay
- THEN the dashboard mockup is passed via `<CaseStudyCard ... ><div slot="mockup">...</div></CaseStudyCard>`
- AND the same pattern applies for the DeTour mobile mockup, Fuera del Molde e-commerce mockup, and La Locura Bar profile mockup

### Requirement: Full-fidelity case-study mockups (deferred improvement noted)

The system MUST reproduce the four case-study mockups at full visual fidelity in this change — gradients, layered divs, fake browser chrome, animated avatar, and yellow CTA button. The fidelity will be revisited in a later change using the `frontend-design` skill and TDD discipline, but the current PR MUST NOT ship visibly simpler mockups than the source. A `NOTE` comment in each mockup block SHOULD reference the upcoming fidelity improvement so future readers understand the intent.

#### Scenario: Mockups reproduce the source visually

- GIVEN the source `docs/index.html` lines 213–254 (Hero), 404–452 (ConectaPlay), 455–495 (DeTour), 498–540 (Fuera del Molde), 543–587 (La Locura Bar)
- WHEN a reviewer opens the rendered EN page at `/en/` and the source side-by-side
- THEN each mockup has the same layered structure, same gradient directions, and same color treatment as the source

#### Scenario: Future improvement is signposted

- GIVEN a mockup block in a case study
- WHEN a developer reads the file
- THEN a `NOTE` or `TODO(fidelity)` comment references the deferred improvement change

### Requirement: Dynamic year in Footer is build-time

The system MUST render the copyright year in `Footer.astro` from `new Date().getFullYear()` evaluated at build time in the component's frontmatter. The year MUST appear as a literal string in the static HTML output — no JavaScript at runtime, no `<script>` tag setting `textContent`, no placeholder span. The `<span id="year">` pattern from the source HTML MUST NOT be carried into the Astro port.

#### Scenario: Year is computed at build time, not at runtime

- GIVEN `Footer.astro` reads `const year = new Date().getFullYear()` in its frontmatter
- WHEN `npm run build` runs
- THEN `dist/index.html` and `dist/en/index.html` both contain the literal four-digit year as a static string in the footer

#### Scenario: No client-side year script ships in the output

- GIVEN the Footer component is fully static
- WHEN `grep -r "getElementById('year')" dist/` runs
- THEN it returns zero matches

### Requirement: LanguageToggle visible in both ES and EN navs

The system MUST render `LanguageToggle.astro` inside the `Nav.astro` component on both the ES and EN pages. The toggle's destination MUST be the other locale's URL (`/en/` from `/`, `/` from `/en/`), and the toggle MUST be visible at all viewport widths (no auto-hide on the EN page). The toggle's outer `<a>` MUST carry the `glass-nav` styling already defined in the design-tokens spec so it sits visually with the rest of the Nav actions.

#### Scenario: ES page shows EN toggle

- GIVEN the ES page is rendered
- WHEN the Nav appears
- THEN `LanguageToggle` is present, points to `/en/`, and shows "EN" as its label

#### Scenario: EN page shows ES toggle

- GIVEN the EN page is rendered
- WHEN the Nav appears
- THEN `LanguageToggle` is present, points to `/`, and shows "ES" as its label
