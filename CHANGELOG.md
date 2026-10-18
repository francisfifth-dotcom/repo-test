# Changelog

## Unreleased — 2026-10-18

- Added a Next.js App Router menu starter with strict TypeScript, Tailwind CSS, integer-cent demo prices, and Supabase live-read configuration/fallback.
- Added a Supabase migration with RLS and read-only public access plus optional demo seed; database validation remains pending.
- Added QA, documentation, and Git workflow session agents for tested features branching from `develop` and release-only promotion to `main`.
- Added npm checks, unit tests, desktop/mobile browser tests, a PR documentation gate, and opt-in quality-gated Vercel deployments.
- Documented setup, QA evidence, deployment, rollback, and external setup gaps. Local QA passed; live database, remote CI/settings, and deployment remain unverified.

### Vercel preview deployment

- Pinned package and Vercel Node versions to `22.x` and configured the existing project as Next.js.
- Deployed and checked a protected Vercel Preview on desktop/mobile; production remains unchanged.
- Changed workflow deployments to Vercel-hosted source builds so Secret environment values are resolved remotely instead of embedding pulled placeholders.
- Made the fallback browser regression deterministic with an intercepted PostgREST error, accounting for build-time public variables.
- Recorded the live Supabase blocker: the configured hostname returns NXDOMAIN. Correct project settings and repeat live integration QA before claiming database readiness.

### Supabase connection correction

- Corrected the configured hosted project URL suffix to `.supabase.co`, preserving the matching key, and rebuilt the protected Preview.
- Applied the existing menu migration and seed through the SQL editor; verified three live menu rows and inspected RLS/grant metadata.
- Verified actual desktop/mobile cloud live reads and local regression checks. Isolated database/negative API tests and production rollout remain unverified.
