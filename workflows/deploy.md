# Workflow: Deploy to Production

## Objective
Build the app and deploy to https://neome-wellness-app.netlify.app

## Required Inputs
- Clean working tree (no uncommitted breaking changes)
- Netlify CLI installed and authenticated

## Steps

1. **Type-check first — never skip this:**
   ```bash
   cd /Users/sambot/.openclaw/workspace/projects/neome/neome_app
   npx tsc --noEmit
   ```
   Fix all errors before proceeding.

2. **Build:**
   ```bash
   npm run build
   ```
   Watch for any build errors. Bundle sizes to watch:
   - Main app: ~467KB (~137KB gzipped) — normal
   - If significantly larger, investigate before deploying

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Verify live app** at https://neome-wellness-app.netlify.app — check the page that was changed.

## Expected Output
- Netlify deploy URL printed in console
- Live app updated within ~30 seconds

## Edge Cases

| Error | Action |
|-------|--------|
| TypeScript errors | Fix them. Never use `// @ts-ignore` unless Sam explicitly approves. |
| Build fails (import errors, missing modules) | Read the full error. Usually a missing export or wrong import path. |
| Netlify CLI not authenticated | Run `netlify login` first |
| Deploy succeeds but changes not visible | Hard-refresh browser (Cmd+Shift+R). CDN cache clears within minutes. |

## Key files that affect the build
- `AppV2.tsx` — main router. Wrong import here breaks the entire app.
- `src/data/recipes.ts` — must be valid TypeScript. After script runs, `npx tsc --noEmit` catches any issues.
- `.env.local` — Vite env vars. Only `VITE_` prefixed vars are available in the browser bundle.
