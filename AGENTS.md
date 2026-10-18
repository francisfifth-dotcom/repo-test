# Coffee shop app working agreement

## Stack

Next.js App Router, TypeScript (strict), Tailwind CSS, Supabase PostgreSQL, GitHub and GitHub Actions, Vercel. Use npm and commit package-lock.json. Node 22 is the CI/deployment baseline.

## Required feature lifecycle

The primary agent coordinates these agents **for every completed feature**. Delegate to the project agents below; if the current client cannot load custom agents, spawn agents with the corresponding TOML instructions explicitly. These are Codex session agents, not unattended GitHub bots.

1. `git_workflow` creates `feature/<slug>` from current `develop` before implementation. Only this agent owns Git mutations. Coordinate branch switches with all writers.
2. The primary/implementation agent defines acceptance criteria and implements one feature with appropriate tests.
3. `qa` runs lint, strict type checks, unit tests, production build and browser tests. Fix failures and repeat QA. Integration-dependent features also require integration validation. Never substitute skipped checks for PASS.
4. `documentation` documents the actual implementation **after QA**, including evidence, migrations, environment names, limitations, deployment and rollback.
5. `git_workflow` reviews the diff, commits and pushes the tested feature, and integrates into `develop` using the procedure in its instructions. Re-run QA if application or test code changes after QA or if a newer develop changes the tested integration.
6. `main` is production. Merge `develop` into `main` only on a release request. Vercel deploys only after the workflow's quality job succeeds and deployment has been enabled.

Do not claim that agents run automatically outside Codex sessions. GitHub Actions runs deterministic checks on pushes and PRs; it does not run these AI agents.

## Definition of done

- Acceptance criteria met, QA passed, and actual evidence documented in `docs/features/<slug>.md`.
- No unresolved feature-blocking defects; external setup gaps explicitly recorded.
- No secrets committed. The Supabase URL and publishable key may use a `NEXT_PUBLIC_` prefix; database passwords, secret keys and service-role keys must remain server-only.
- Use integer cents for money; clarify currency before implementing real transactions.
- Supabase tables enable RLS, grant only required access, and include migrations. Never trust browser-supplied prices or grant anonymous order/admin writes.
- Keep mobile layouts and keyboard access usable. Do not claim ordering, checkout or payments exist until implemented and tested.

## Commands

`npm ci`, `npm run dev`, `npm run check`, `npx playwright install chromium`, `npm run test:e2e`.

See `docs/PIPELINE.md` for branch protection, deployment credentials, database setup and rollout.
