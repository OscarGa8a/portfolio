# Portfolio — Testing Capabilities

**Strict TDD Mode**: disabled
**Detected**: 2026-06-16
**Reason**: No test runner, linter, formatter, or coverage tool is configured in this project. Strict TDD is set to `false` per the sdd-init no-runner fallback.

## Test Runner

- Command: `—` (none configured)
- Framework: `—`

## Test Layers

| Layer       | Available | Tool |
| ----------- | --------- | ---- |
| Unit        | ❌        | —    |
| Integration | ❌        | —    |
| E2E         | ❌        | —    |

## Coverage

- Available: ❌
- Command: `—`

## Quality Tools

| Tool         | Available | Command              |
| ------------ | --------- | -------------------- |
| Linter       | ❌        | —                    |
| Type checker | ✅        | `npx astro check`    |
| Formatter    | ❌        | —                    |

## Notes

- This is a static Astro site (SSG by default). The dominant verification surface is `astro check` (type + Astro diagnostics) and the production build.
- When future work introduces logic worth testing, add Vitest (`npx astro add vitest`) and flip `strict_tdd` in `openspec/config.yaml` accordingly.
- Visual parity with `docs/index.html` is verified by hand for now; consider Playwright screenshot diff when the portfolio is ported to Astro.
