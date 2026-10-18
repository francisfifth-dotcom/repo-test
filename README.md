# Coffee shop app

A coffee menu starter and delivery pipeline using **Next.js App Router, strict TypeScript, Tailwind CSS, Supabase PostgreSQL, GitHub/GitHub Actions, and Vercel**. Use npm, commit `package-lock.json`, and use Node 22 for CI/deployment (`.nvmrc`).

The starter displays a responsive demo menu with integer-cent prices. “Load live menu” reads available Supabase menu items when configured; otherwise it retains the demo and reports the failure. USD is a demo display choice; confirm business currency before implementing transactions. Ordering, checkout, payments, authentication, and administration are not implemented.

## Local setup

```sh
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Empty environment variables support the demo. For live reads, configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then apply the reviewed database migration. Never expose database passwords, secret keys, or service-role keys with a `NEXT_PUBLIC_` prefix.

## Verification

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

`check` runs lint, strict type checks, unit tests, and the production build. Browser tests start that build on port 3107 and cover desktop Chromium and Pixel 7 emulation.

## Feature delivery

The primary agent coordinates three project agents: `git_workflow` branches from current `develop`; implementation completes acceptance criteria; `qa` tests the feature; `documentation` records actual behavior and evidence after QA; then `git_workflow` reviews, commits, pushes, and integrates into `develop`. Only `git_workflow` changes Git state. Promotion to production `main` requires a release request.

Definitions live in `AGENTS.md`, `.codex/config.toml`, and `.codex/agents/*.toml`. These are Codex session agents, not unattended GitHub bots. Custom-agent discovery may require a session restart; clients without custom-agent loading must spawn agents with the corresponding TOML instructions explicitly. GitHub Actions runs deterministic checks and optional deployments.

A protected [Vercel preview](https://repo-test-npuvdebe0-francis-s-projects1.vercel.app) is deployed and verified on desktop/mobile; Vercel sign-in is required. This is a preview, not a production release. Live menu loading now reads three drinks from Supabase after correction of the project URL and application of the existing migration/seed.

See [pipeline setup and rollout](docs/PIPELINE.md), [live Supabase connection QA](docs/features/supabase-vercel-connection.md), [initial scaffold evidence](docs/features/coffee-shop-pipeline.md), and [the changelog](CHANGELOG.md). GitHub Actions deployment credentials/enablement, branch protection, isolated database/negative-permission tests, and production rollout remain pending or unverified.
