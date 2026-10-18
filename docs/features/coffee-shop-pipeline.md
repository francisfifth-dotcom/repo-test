# Feature: Coffee shop starter and delivery pipeline

Date: 2026-10-18 (Asia/Manila)
Branch: `feature/coffee-shop-pipeline`, created from `develop`
QA status: PASS for the local scaffold and deterministic checks. Live Supabase, remote CI/settings, and Vercel deployment remain unverified; this is not a production-readiness claim.

## Acceptance criteria and behavior

- Provide Next.js App Router, strict TypeScript, Tailwind CSS, Supabase PostgreSQL configuration/migration, GitHub Actions, and quality-gated Vercel configuration.
- Define three requested session agents: QA after implementation, documentation after QA, and Git ownership for branching from/integrating into `develop` after successful validation.
- Provide a responsive, keyboard-usable demo coffee menu as a smoke-test feature. Display three drinks, store money in integer cents, label demo prices USD, and retain the demo with a status message when live loading is unavailable.
- Provide reproducible npm commands, unit/browser coverage, PR documentation enforcement, and setup/rollback instructions.

These local criteria passed. Successful database reads and RLS enforcement require separate integration validation. Ordering, checkout, payments, authentication, and administration are outside this scaffold. Confirm currency before implementing transactions.

## Implementation

`src/app/` provides the App Router page, layout, and Tailwind styles. `src/components/menu.tsx` renders the menu and loading/fallback status. `src/lib/menu.ts` defines menu data and USD formatting; `src/lib/supabase.ts` constructs the public client on request and rejects missing configuration. The client reads available `menu_items` rows ordered by name.

`supabase/migrations/20261018000100_menu.sql` creates the table with nonnegative integer prices, enables RLS, and permits anonymous/authenticated SELECT only for available rows. It grants no public writes. `supabase/seed.sql` optionally inserts three fixed-ID demo rows. Neither SQL file was applied during this work.

`tests/unit/menu.test.ts` covers menu price/format behavior. `tests/e2e/menu.spec.ts` covers demo rendering and missing-configuration fallback on desktop Chromium and Pixel 7 emulation. `playwright.config.ts` starts the production server on port 3107 with blank Supabase variables.

`.codex/agents/*.toml`, `.codex/config.toml`, and `AGENTS.md` define the agent lifecycle. `.github/workflows/pipeline.yml` defines quality, PR documentation, and opt-in Vercel jobs. `scripts/check-docs.mjs` requires a nondeleted changed feature report for covered implementation changes. `vercel.json` disables native Git deployments. The lockfile includes the deployment CLI and a patched `tar` override.

## QA evidence

The QA agent reported these completed checks before final documentation:

| Check | Observed result |
| --- | --- |
| `npm ci` | PASS |
| `npm run check` | PASS: lint with zero warnings, strict types, 2 unit tests, optimized Next.js build using webpack |
| `npm run test:e2e` | PASS: 4/4 tests in 5.2 seconds across desktop Chromium and Pixel 7 emulation |
| Interaction and visual review | Tab/Enter fallback usable; no horizontal overflow or page/console errors; screenshots inspected clean |
| TOML/YAML parsing | PASS |
| Documentation gate fixtures | Code without report rejected; code plus report accepted; deleted report rejected; README-only accepted |
| `npm audit --omit=dev` | Zero runtime advisories at verification |
| Full dependency audit | 34 development-tooling advisories remain: 9 moderate, 25 high; patched tar override removed the critical advisory |

The host ran Node 24.14.0. `.nvmrc` and CI specify Node 22, but Node 22 execution and remote CI were not observed. Vitest emitted a nonblocking future config-loader warning. Browser tests used port 3107 because an unrelated process occupied port 3000.

The tested package state was identified by SHA-256:

```text
package.json:      f3b885cfffabf2d1fb8154ee76073b7614cdbb08e74834d1866468d609eab333
package-lock.json: b6ca3e8265b4c5a090230bdb8e1a807fcef08c425b81d5ddbe11b250ac1256fe
```

No application/test changes followed that QA before documentation. Git integration must repeat QA if application/tests change or newer `develop` alters the tested integration. Fixture results do not imply remote CI success.

## Configuration and deployment

Copy `.env.example` to `.env.local`; configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Keep secret/service-role keys server-only. Apply the reviewed migration first, optional seed second in isolated staging, and verify reads/denied writes before a dependent release.

Follow [the pipeline guide](../PIPELINE.md) for setup. Vercel requires a Node 22 project with production branch `main`, Preview/Production public Supabase variables, and GitHub secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. Set repository variable `VERCEL_DEPLOY_ENABLED=true` only after setup. Successful push quality checks gate Preview from `develop` and Production from `main`; only a release request authorizes promotion to `main`.

Configure GitHub protection requiring PRs and `Quality gate`/`Documentation gate` on `develop` and `main`. Settings, credentials, and remote runs remain unverified. Roll back application deployment using a known-good prior Vercel deployment, then revert through the feature lifecycle; prefer reviewed forward database fixes. No automatic migration job exists.

## Known limitations

- Live Supabase reads, SQL execution, RLS behavior, Vercel project/deployments, GitHub rules, and remote CI remain unverified. Docker was unavailable for local database testing.
- Demo/fallback tests do not validate successful live reads, live empty/loading states, or database security. Database-dependent features require integration QA before readiness claims.
- Remaining development-tooling advisories need follow-up; audit results may change as vulnerability data updates.
- Custom-agent discovery may require a session restart; clients without it must explicitly spawn agents with the TOML instructions. Agents are session-scoped, not unattended bots.
- The documentation gate verifies report presence, not accuracy or QA order.
- This report records local evidence before Git handoff. Commit/push/integration and remote results must be reported from the Git agent's observed outcome.
