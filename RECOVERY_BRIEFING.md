# NeoMe Recovery Briefing — May 14, 2026

## Context
On May 13, 2026, the entire NeoMe project workspace at `~/.openclaw/workspace/projects/neome/` was accidentally deleted via `rm -rf ~/.openclaw`. The last GitHub push was May 6 (commit `f6dd55b`). Six days of unpushed work (May 7–12) needed to be recovered.

## Current state of this folder
- This folder (`~/project_ai/neome-app/`) is a fresh clone of `github.com/NeoMeOfficial/neomezvykynew` at commit `f6dd55b` (May 6, 2026).
- It represents the **May 6 baseline** — pre-deletion, pre-recovery.
- The May 7–12 work needs to be layered on top of this baseline.

## Where the recovered code lives
**Primary recovery (use this):**
`~/recovery-backup/clean-v2/neome-app/neome_app/` — 597 files, 6.8 MB total. Two-pass extraction from Claude Code session transcripts (v2 selected longest valid version of each file).

**Reference / fallback recovery:**
- `~/recovery-backup/clean-v2/NeoMe-WEB/` — the marketing website project (separate from this app)
- `~/recovery-backup/clean-v2/neome-app-design/` — design system work
- `~/recovery-backup/clean-v2/neome-marketing/` — Slovak FB/IG ad campaign material
- `~/Documents/NeoMe-CLAUDE-md-RECOVERED.md` — the full 219-line recovered CLAUDE.md
- `~/Documents/NeoMe-AppV2-RECOVERED.tsx` — the recovered 251-line AppV2.tsx

**Live production build (last known-good deployed artifact):**
`~/recovery-backup/netlify-deploy-zip/deploy-contents/` — the May 12 production deploy as deployed to Netlify. Contains compiled JS bundles, the May 12 manifest.webmanifest, favicon-source.svg, and partial recipe PDFs (some Slovak filenames had encoding issues; re-extract via Python zipfile if needed from the parent zip).

**Timeline analysis:**
`~/recovery-backup/timeline-may7-12.txt` — day-by-day breakdown of every file written/edited May 7–12 with timestamps and the user's actual prompts in Slovak/English.

## What needs to be layered in (priority order)

### Highest priority — new files that didn't exist May 6
1. `scripts/*.cjs` (13 files from May 7) — recipe pipeline:
   `apply-nutrition.cjs`, `authoring-gate.cjs`, `import-recipes.cjs`, `dedup-recipes.cjs`, `build-review-html.cjs`, `build-final-tables.cjs`, `fix-recipes.cjs`, `fix-recipes-apply.cjs`, `fix-recipes-contextual.cjs`, `build-review-interactive.cjs`, `fix-e4-extended.cjs`, `fix-split-and-clean.cjs`, `generate-recipe-sql.cjs`, `recipe-crossref-fix.cjs`, `build-recipe-template.cjs` (May 11)
2. `supabase/migrations/20260507100000_recipes_library.sql` — recipe library migration
3. `data/parsed/*.json/*.csv/*.html/*.sql` — recipe pipeline output files
4. `public/favicon-source.svg` — new May 12 favicon
5. `src/assets/brand/neome-wordmark-cream.svg` and `neome-wordmark-brown.svg` — these belong to NeoMe-WEB, not this app, but worth noting

### High priority — files that need significant updates
1. `src/AppV2.tsx` — 251 lines, replaces the May 6 24-line stub. Adds lazy routes, ErrorBoundary, full route map.
2. `src/pages/v2/DomovNew.tsx` — 37 edits across May 7 (home page card visual refactor)
3. `vite.config.ts` — needs `vite-plugin-pwa` integration
4. `index.html` — needs PWA manifest link, new fonts (Bodoni Moda + DM Sans + Gilda Display), Apple Web App metadata, OG tags
5. `src/lib/stripe.ts` — 3 edits May 12, live Stripe wiring
6. `netlify/functions/stripe-webhook.ts` — 3 edits May 12
7. `netlify/functions/create-checkout-session.ts` — 2 edits May 12
8. `src/contexts/SubscriptionContext.tsx` — 2 edits May 12
9. Stripe-related: `src/hooks/usePaywall.ts`, `src/components/v2/subscription/SubscriptionPromoBanner.tsx`, `src/components/v2/subscription/PaywallModal.tsx`, `src/pages/v2/Paywall.tsx`, `src/pages/v2/SubscriptionManagement.tsx`, `src/data/subscription.ts`

### New dependencies added May 12
- `vite-plugin-pwa` (run `bun add vite-plugin-pwa` after layering)

## Key business facts (preserve these)
- Stripe nutrition plan upsell price ID: `price_1TW8SeEpPqBqxo4mOwzTetog` (€57 one-time)
- Supabase migration applied directly to live DB on May 12: `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nutrition_plan_purchased BOOLEAN DEFAULT FALSE, ADD COLUMN IF NOT EXISTS ...` (full statement in `~/recovery-backup/timeline-may7-12.txt` around line 380)
- Recipe categories: `ranajky` (breakfast), `hlavne_jedla` (mains), `snacky` (snacks) — decided May 11
- 263 recipes graded as "pass" out of 257 total before recategorization (May 7 work)
- App name: "NeoMe — Wellness pre ženy", lang: `sk`, start URL: `/domov-new`, theme color: `#F0E6DA`

## Netlify deployment situation
- **`neomeapp` site** (`gabi@neome.com.au` account) — GitHub-connected to `neomezvykynew`, has all env vars configured, custom domain `app.neome.com.au` (primary). Build: `bun run build`, publish: `dist`. Currently serving May 6 baseline. **THIS IS THE INTENDED LONG-TERM HOME.**
- **`neome-wellness-app` site** (`murphbot9@gmail.com` account) — was the accidental CLI deploy target on May 12. Serves the latest code at `neome-wellness-app.netlify.app`. No GitHub connection. No env vars in Netlify (values were baked into bundle at build time from a local `.env.local` that no longer exists). **TO BE RETIRED after consolidation.**
- Both Netlify accounts are owned by the same person. CLI on this Mac is logged in as `murphbot9@gmail.com`.

## Recovery workflow remaining
1. Create `.env.local` with real values from Supabase/Stripe/Spoonacular dashboards (DO NOT commit — already in .gitignore)
2. Run `bun install` to install dependencies
3. Verify baseline: `bun run dev` — confirm May 6 version loads at localhost
4. Layer in recovered files folder-by-folder, committing each chunk as separate git commit (reversible checkpoints)
5. Each commit: build and run dev to verify nothing broke
6. After all layers in, push to GitHub `main`
7. Watch Netlify `neomeapp` auto-build and deploy
8. Verify at `app.neome.com.au` — should now show May 12 work
9. Eventually delete `neome-wellness-app` Netlify site (once stability confirmed)

## Prevention (mandatory before continuing development)
- Set up Time Machine
- Add `alias rm='rm -i'` to `~/.zshrc`
- Commit and push every 30 minutes or per logical feature

