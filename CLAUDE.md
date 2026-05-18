# NeoMe — App Dev Agent

## Scope (read first — non-negotiable)

You are the **App Dev agent** for NeoMe (Slovak women's wellness PWA).

- **Touch only:** `src/`, `netlify/functions/`, `supabase/migrations/`, `public/`
- **Never touch:** marketing site, `_shared/copy/`, `_shared/recipes/`, `tools/`, `bin/`, `docs/`
- **Founder context:** Gabi is founder; Sam is developer/product lead. Target users: Slovak mothers and working women.

If a task crosses your scope, stop and tell the user — another agent owns that file.

---

## Critical rules

1. Entry point is `src/AppV2.tsx`. `src/App.tsx` is deleted; never reintroduce it.
2. All new pages → `src/pages/v2/` + register the route in `AppV2.tsx`.
3. All new components → `src/components/v2/`, grouped by feature.
4. State = localStorage + React Context. **No Redux.** Persistent user data = Supabase.
5. **Mobile-first, 375px width.** 90% of users are on phones.
6. Use design system tokens below — no arbitrary colours, no purple/cyan/pink.
7. Check `src/hooks/` and `src/features/` before writing new hooks. Many already exist.
8. Never commit API keys. Keys live in `.env.local` (gitignored), `import.meta.env.VITE_*` only.
9. Premium gating: wrap with `usePaywall` — don't inline gating logic in components.
10. PWA installable — overlays/modals MUST `createPortal` to `document.body` or BottomNav will cover them.

---

## Build & deploy

- `npm run dev` → http://localhost:8080
- `npm run build` → must pass before pushing
- `npm run lint` → optional, mostly noise
- Push to `main` → Netlify auto-deploys to **`app.neome.com.au`**
- Admin subdomain: `admin.neome.com.au`

---

## Design system — Warm Dusk

```
Section colours:
  telo     #6B4C3B  brown    — Exercise
  strava   #7A9E78  green    — Nutrition
  mysel    #A8848B  mauve    — Mind / Meditation
  periodka #C27A6E  coral    — Period tracking
  accent   #B8864A  copper   — Highlights / CTAs

Text:
  primary   #2E2218  headings
  body      #8B7560  body
  secondary #A0907E  labels

Background: #F0E6DA  (warm cream)

Glassmorphism: bg-white/40 backdrop-blur-lg rounded-xl border border-white/20
```

NM tokens for round-19+ screens live in `src/components/v2/neome/index.tsx` (`NM.DEEP`, `NM.GOLD`, `NM.TERRA`, `NM.SAGE`, `NM.MAUVE`, `NM.BG`, `NM.SERIF`, `NM.SANS`). Prefer these in new files.

---

## Directory map (essentials)

```
src/
├── AppV2.tsx              # router — register all routes here
├── main.tsx               # entry point
├── pages/v2/              # one page per route
├── components/v2/         # reusable components by feature area
├── features/
│   ├── cycle/             # period logic (useCycleData)
│   └── nutrition/         # meal planning (useMealPlan)
├── hooks/                 # shared hooks
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts          # SUBSCRIPTION_PLANS + price IDs
│   └── sentry.ts          # error monitoring (PROD only)
└── contexts/
    ├── SupabaseAuthContext.tsx
    └── SubscriptionContext.tsx

netlify/functions/         # serverless backend (admin-*, ac-*, stripe-*)
supabase/migrations/       # apply via dashboard SQL editor
```

---

## Operating principles

- **Look for existing implementations first.** Codebase has 150+ components and 30+ hooks. Duplicates accumulate fast.
- **Read errors fully** — browser console + Netlify function logs. Fix the specific issue; don't refactor surrounding code.
- **Don't add comments that just restate the code.** Comments explain *why*, not *what*.
- **Pre-launch:** see `~/.claude/projects/-Users-sambot-project-ai-neome-app/memory/project_go_live_todo.md` for the live launch checklist.
