# Feature: Live Supabase menu connection

Date: 2026-10-18 (Asia/Manila)
Branch: `feature/supabase-vercel-connection`, from `develop` at `b0c5622`
QA status: PASS for corrected connection, actual Preview live reads, and local regression checks. Isolated database and full negative API validation remain outside this PASS scope.

## Acceptance criteria and behavior

- Correct the existing project's URL while preserving the matching publishable key.
- Apply the repository's existing menu migration and seed to the project.
- Rebuild the hosted Preview and verify actual live menu loading on desktop/mobile.

The protected [Preview](https://repo-test-npuvdebe0-francis-s-projects1.vercel.app) is READY. “Load live menu” now displays “Live menu · prices in USD” and three Supabase-backed drinks. This resolves the DNS blocker recorded in [the historical deployment report](vercel-deployment.md). Vercel sign-in is still required; no production release occurred.

## Implementation

The configured hostname had `.supabase.com` instead of the same project's `.supabase.co`. The corrected endpoint accepted the existing publishable key (`/auth/v1/settings` HTTP 200). The URL was updated in ignored `.env.local` and Vercel Preview/Production; the key and local OIDC configuration were preserved. The Vercel URL now uses Config type because the CLI rejects new Secret values named `NEXT_PUBLIC_`; the existing key remains Secret.

Only `.env.example` source configuration changed: comments explain the hosted URL suffix and matching project key, while defaults remain empty. No application source or new SQL migration was authored.

The existing `supabase/migrations/20261018000100_menu.sql` was executed successfully in the authenticated Supabase SQL editor, followed by the exact separate `supabase/seed.sql` query. Initially REST returned PGRST205/404 for the absent table; afterwards it returned HTTP 200 with three rows. Do not rerun the nonrepeatable CREATE migration on this project. Reconcile its manually applied baseline before using CLI migration tracking.

## QA evidence

| Check | Observed result |
| --- | --- |
| `npm run check` with corrected local configuration | PASS: lint, strict types, 2 unit tests, production build |
| `npm run test:e2e` | PASS: 4/4 tests in 2.1 seconds; deterministic fallback coverage remains separate from live integration |
| Hosted build | PASS: build/types in approximately 58 seconds; deployment READY |
| Actual unmocked cloud browser | Desktop 1440×1000 and Pixel 7 HTTP 200; Tab/Enter loads live status; REST HTTP 200; three correct cards/prices; no overflow or page errors; screenshots inspected clean |
| Actual live rows | Cold Brew 500, Espresso 300, Latte 450 integer cents |
| Read-only SQL security metadata | RLS enabled; anon/authenticated SELECT granted; INSERT/UPDATE/DELETE denied; sole SELECT policy qualification `available = true` |

Deployment: `dpl_GQjLMgRyY2gqJQZAiWbXtf1VDA8K` ([inspector](https://vercel.com/francis-s-projects1/repo-test/GQjLMgRyY2gqJQZAiWbXtf1VDA8K)). Screenshots remain ignored at `.pipeline/vercel-live-desktop.png` and `.pipeline/vercel-live-mobile.png`. Security metadata inspection is not a substitute for isolated database tests or full negative API semantics. No secrets or environment values are included here.

## Configuration and deployment

Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the same active project's Data API settings. Corrected URL values are present in both Vercel environments; only Preview was rebuilt/deployed in this feature. Public variables are compiled at build time, so future updates require a rebuild. Keep `.env.local`, OIDC credentials, protection tokens, cookies, and `.vercel/` out of Git.

The [pipeline guide](../PIPELINE.md) describes remote source deployment and setup. Native Git deployment remains disabled. GitHub Actions execution, deployment credentials/enablement, and remote branch protection remain unverified. `main` was not changed; production promotion requires a release request.

For rollback, retain database schema/data. Review configuration changes and redeploy a verified configuration; do not restore the known-invalid hostname. Use reviewed forward database fixes if needed and verify reads after deployment. Do not rerun CREATE or drop the table to undo this connection correction.

## Known limitations

- Isolated migration tests, unavailable-row negative API tests, and write-attempt authorization tests were not run; reported security evidence is read-only metadata inspection.
- Production deployment, remote GitHub CI, automatic deployment enablement, and rollback execution remain unverified.
- Preview SSO remains enabled; this is not an anonymous public deployment.
- No ordering, checkout, payments, authentication, or admin feature was added. USD remains the demo display currency; clarify business currency before real transactions.
