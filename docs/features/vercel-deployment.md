# Feature: Protected Vercel preview deployment

Date: 2026-10-18 (Asia/Manila)
Branch: `feature/vercel-deployment`, from `develop` at `3b5660d`
QA status: PASS for deployment/rendering and local regression checks; BLOCKED for live Supabase integration.

## Acceptance criteria and behavior

- Deploy the coffee app to an existing Vercel project as a Preview, using Next.js and Node 22.
- Verify the actual cloud page on desktop/mobile, including menu rendering and keyboard access.
- Exercise live menu loading and document the actual result without treating stored environment variables as proof of database connectivity.

The protected [preview](https://repo-test-epqsjv6hg-francis-s-projects1.vercel.app) is READY and renders the demo menu. Vercel SSO remains enabled; normal access requires Vercel sign-in. This is not a public production release. Live menu reads fail DNS resolution and correctly fall back to the demo; database readiness remains blocked.

## Implementation

`package.json` and `package-lock.json` now specify Node `22.x` instead of `>=22`, matching the Vercel project and CI baseline. No application source changed. `tests/e2e/menu.spec.ts` now intercepts PostgREST menu requests with HTTP 400 before navigation for a deterministic fallback regression. Runtime blank environment values do not undo Next.js public values embedded at build time; the regression test does not require real database access.

The existing Vercel project `repo-test` in `francis-s-projects1` was already connected to the GitHub repository with production branch `main`. Remote settings changed Node 24 to `22.x` and the unset framework to Next.js. The local CLI link lives in ignored `.vercel/`. Existing Preview/Production public Supabase variables were preserved, not replaced. CLI linking added an OIDC token to ignored `.env.local` while preserving public variables. Protection tokens, cookies, and artifacts stay ignored and must never be committed.

`.github/workflows/pipeline.yml` now submits remote source builds using `vercel deploy --yes --target=preview` and `vercel deploy --yes --prod`. The prior pull/local-build/prebuilt path would embed `[SENSITIVE]` placeholders observed when pulling the project’s Secret environment values. Hosted builds use the actual Preview/Production project values. Quality dependencies, enablement, branch gates, and secret names remain unchanged.

No database migration changed or ran. Existing `supabase/migrations/20261018000100_menu.sql` and optional `supabase/seed.sql` still require reviewed application and live RLS validation.

## QA evidence

| Check | Observed result |
| --- | --- |
| `npm run check` | PASS: lint, strict types, 2 unit tests, production webpack build; local host Node 24.14.0 |
| `npm run test:e2e` | PASS: 4/4 browser tests in 3 seconds |
| Final lint/type checks | PASS after browser tests |
| Deployment workflow amendment | PASS: YAML parsed, Vercel CLI 64.5 flags verified; quality dependency, enabled variable, push-only develop/main gates, and environment secrets preserved |
| Cloud build | npm install, Next.js 16.4.2 webpack build and type check passed in approximately 58 seconds; deployment READY |
| Authenticated cloud HTTP | HTTP 200; SSR coffee heading/menu, Latte, and $4.50 verified |
| Actual cloud browser | HTTP 200 at desktop 1440×1000 and Pixel 7; correct headings/menu, no horizontal overflow, Tab/Enter usable, no page errors; screenshots inspected clean |
| Actual live menu | FAILED on both viewports: four retry attempts reported `net::ERR_NAME_NOT_RESOLVED`; demo fallback appeared and button re-enabled |
| Independent DNS | Local resolution failed; Google DNS returned Status 3 (NXDOMAIN) for the configured Supabase hostname |

Deployment: `dpl_5WPUeKp6rn9kcwiEFGmXSbY2tgkR` ([inspector](https://vercel.com/francis-s-projects1/repo-test/5WPUeKp6rn9kcwiEFGmXSbY2tgkR)). Cloud checks used supported authorized protection access; SSO was not disabled. Screenshots are local ignored `.pipeline/vercel-desktop.png` and `.pipeline/vercel-mobile.png`. The deterministic regression suite is separate from these actual cloud integration observations. No new dependency audit was performed for this deployment.

## Configuration and deployment

See [the pipeline guide](../PIPELINE.md) for commands and rollback. This Preview used manual Vercel CLI remote source deployment after local QA. The final workflow amendment received separate QA review; application/regression code was unchanged by that amendment. Native Git deployment remains disabled by `vercel.json`. GitHub Actions execution and `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` configuration remain unverified; automatic deployment has not been enabled/verified. No merge to `main` or production deployment occurred.

Confirm the exact Project URL in the active Supabase project's Settings → Data API. Update `NEXT_PUBLIC_SUPABASE_URL` in ignored `.env.local` and Vercel Preview/Production, verify its matching `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then rebuild/redeploy because public values are compiled into the client. Re-run actual live menu and isolated migration/RLS tests. Do not expose database passwords, secret keys, service-role keys, CLI OIDC tokens, bypass tokens, or cookies.

For application rollback, restore a known-good prior Vercel deployment and revert package/test changes through reviewed feature QA if needed. No schema changes were introduced here; existing database work should use reviewed forward fixes. Production promotion still requires an explicit release request.

## Known limitations

- Supabase connectivity is blocked by NXDOMAIN; user confirmation of the correct active Project URL is pending. Environment-variable presence is not successful integration.
- Successful database reads, SQL migration/seed execution, and RLS enforcement remain unverified. No ordering, payments, authentication, or admin feature was added.
- The preview requires Vercel sign-in; no public production URL was released.
- Remote GitHub Actions/protection, automatic deployment credentials/enablement, production rollout, and rollback execution remain unverified.
- Local QA ran on Node 24.14.0; the deployment project uses Node 22. Existing tooling audit findings are historical, not a newly measured result.
