# Feature: Production release

Date: 2026-10-18 (Asia/Manila)
Branch: `feature/production-release`
QA status: PASS for the production release, public desktop/mobile access, and actual live menu reads.

## Acceptance criteria and behavior

- Diagnose the reported `NEXT_NO_VERSION` deployment failure using its actual source.
- Deploy the current released app to Production after quality checks.
- Verify the public alias without authentication and load actual Supabase menu data on desktop/mobile.

The public [production app](https://repo-test-wine.vercel.app) is READY and loads three live drinks without Vercel sign-in. The screenshot selected an old failed deployment from initial commit `72d1007`, before the Next.js app existed. Redeploying that old deployment would retain its source. Current `main` already had Next.js 16.4.2 and correct root/framework/Node settings; no application dependency fix was necessary.

## Implementation and source

The user's PR #1 had already merged `develop` into remote `main` at `e89735bfa14bc58339a2f7d70beb27b7be679b24`, with the same application tree as `develop` at `065d371`. The Git agent selected clean, fast-forwarded local `main` before deployment. Project root remained the repository root (`rootDirectory=null`), framework Next.js, Node `22.x`.

No application, dependency, environment, or database changes were made for this release. Existing migration/seed and read-only security metadata evidence remain documented in [the connection report](supabase-vercel-connection.md). This feature adds release documentation after QA; the documentation branch follows the normal integration lifecycle.

## QA evidence

| Check | Observed result |
| --- | --- |
| Fresh root `npm run check` | PASS: lint, strict types, 2 unit tests, webpack production build |
| `npm run test:e2e` | PASS: 4/4 browser tests in 1.8 seconds |
| Remote source quality | `Quality gate` SUCCESS for main `e89735b`; [GitHub Actions evidence](https://github.com/francisfifth-dotcom/repo-test/actions/runs/39113225109/job/117633579486) |
| Remote deployment/documentation jobs | Deployment SKIPPED because enablement is off; documentation SKIPPED on push |
| Production cloud build | Detected Next.js 16.4.2; install/build/types PASS in approximately 48 seconds; READY |
| Public HTTP | Production alias HTTP 200 without authentication or redirect; coffee heading/menu verified |
| Actual public browser | Desktop 1440×1000 and Pixel 7, without cookies/authentication headers: HTTP 200, Tab/Enter loads live status, actual Supabase REST 200, three cards/correct prices, no overflow or JavaScript errors; screenshots inspected clean |
| Actual live rows | Cold Brew 500, Espresso 300, Latte 450 integer cents |

Deployment: `dpl_9i5Gn6wGiHL3LFWCRPuVv7CF5HYH` ([inspector](https://vercel.com/francis-s-projects1/repo-test/9i5Gn6wGiHL3LFWCRPuVv7CF5HYH)); unique URL: [deployment](https://repo-test-dhvexiz9e-francis-s-projects1.vercel.app). Screenshots remain ignored at `.pipeline/production-desktop.png` and `.pipeline/production-mobile.png`. SSO was not changed; unique/Preview URLs may remain protected even though the production alias is public.

## Deployment and rollback

After local and remote quality checks, current main was released using:

```sh
npx --no-install vercel deploy --yes --prod --scope francis-s-projects1
```

Vercel used existing Production `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; no values changed. Hosted source builds preserve correct handling of the existing Secret key. Native Git deployment stays disabled by `vercel.json`; automatic GitHub deployment is not enabled, and its credentials remain unverified. See [the pipeline guide](../PIPELINE.md) for current source selection and future releases.

For rollback, select a known-good compatible Production deployment through Vercel, then verify public rendering and live reads. Preserve database schema/data and the corrected URL; do not restore the invalid hostname or old initial source. Apply any code/configuration correction through reviewed feature QA. Rollback execution was not tested in this release.

## Known limitations

- Isolated database migration and negative API permission tests remain unperformed; this release verified live reads, not a new database security test suite.
- Automatic deployment credentials/enablement, remote branch protection, and rollback execution remain unverified.
- No ordering, checkout, payments, authentication, or administration was added. USD remains the demo display currency; confirm business currency before transactions.
