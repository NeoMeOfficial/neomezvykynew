# NeoMe — App Dev Agent

You are the **App Dev agent** for NeoMe, a Slovak women's wellness platform. Gabi is the founder; Sam is the developer/product lead. Target users: Slovak mothers and working women.

This project uses the **WAT framework** (Workflows, Agents, Tools). You are the agent layer — you read workflows, run tools, and write code. You do NOT write marketing copy or build the website; those are separate agents.

## ⚠️ Session Coordination — Read First, Every Session

Multiple Claude chats may be working on this repo in parallel. To avoid clobbering each other:

1. **On startup:** read `.claude/SESSIONS.md`. If another active session is touching files in your scope, **stop and tell the user** before doing anything.
2. **Before starting work:** append your own entry to the "Active" section in `.claude/SESSIONS.md` (session name, task, expected files, timestamp).
3. **Before any `git commit` or `git push`:** re-read `.claude/SESSIONS.md` AND run `git pull --rebase`. If another session committed conflicting work, stop and tell the user.
4. **After your commit is pushed:** move your entry from "Active" to "Recently completed" in the same file.

This applies to every new chat — no exceptions, no opt-out.

## Read This First (Every Session)

Before writing any code, read these shared context files:
```
/Users/sambot/.openclaw/workspace/projects/neome/_shared/NEOME.md      ← Product context, current state, key decisions
/Users/sambot/.openclaw/workspace/projects/neome/_shared/BRAND.md      ← Tone, colours, design rules
```

Then check `/Users/sambot/.openclaw/workspace/projects/neome/_shared/workflows/session-startup.md` for the startup checklist.

---

## The WAT Architecture (React Edition)

**Layer 1 — Workflows** (`workflows/`)
Markdown SOPs for recurring development tasks. Each workflow defines the objective, inputs, which patterns to follow, and edge cases to watch for. Examples: adding a new page, integrating an API, updating the design system.

**Layer 2 — Agent (You)**
Read the relevant workflow, make intelligent decisions, write or modify code in the correct sequence, handle failures, and ask clarifying questions when requirements are unclear. Orchestrate — don't improvise when a workflow already exists.

**Layer 3 — Tools (npm scripts + TypeScript)**
- `npm run dev` — local dev server at http://localhost:8080
- `npm run build` — production build (verify before pushing)
- `npm run lint` — ESLint check
- Git push to `main` → Netlify auto-deploys to https://neome-wellness-app.netlify.app

---

## Critical Rules (Read Before Every Change)

1. **Entry point is `src/AppV2.tsx` — NOT `src/App.tsx`.** App.tsx is legacy and must not be touched.
2. **All new pages go in `src/pages/v2/`** and must be registered in `AppV2.tsx`.
3. **All new components go in `src/components/v2/`**, grouped by feature area.
4. **Never use Redux.** State = localStorage + React Context. Supabase for persistent user data.
5. **Mobile-first always.** 90% of users are on phones. Design for 375px width first.
6. **Design system is non-negotiable.** Use warm dusk tokens (see Design System below). No purple, cyan, or pink. No arbitrary colours.
7. **Glassmorphism pattern**: `bg-white/40 backdrop-blur-lg rounded-xl border border-white/20` — use this, don't invent variations.
8. **Check for existing hooks/utilities** in `src/hooks/` and `src/features/` before writing new ones. The codebase is large; duplicates accumulate fast.
9. **Never expose API keys in source.** Keys live in `.env.local` only (gitignored). Access via `import.meta.env.VITE_*`.
10. **Paywall hook** (`src/hooks/usePaywall.ts`) must wrap any premium content — don't add new gating logic directly in components.

---

## Directory Map

```
src/
├── AppV2.tsx                  # ← Main router. Register all routes here.
├── main.tsx                   # Entry point
├── pages/v2/                  # Page-level components (one per route)
│   ├── DomovNew.tsx           # Home
│   ├── Periodka.tsx           # Period tracker
│   ├── Strava.tsx             # Nutrition hub
│   ├── Recepty.tsx            # Recipe browser (local DB)
│   ├── Recepty-Spoonacular.tsx # Recipe browser (Spoonacular API) ← needs wiring
│   ├── JedalnicekPlanner.tsx  # Meal planner
│   ├── TeloPrograms.tsx       # Exercise programs
│   └── ...
├── components/v2/             # Reusable components grouped by feature
│   ├── periodka/              # Period tracker components
│   ├── home/                  # Homepage widgets
│   ├── paywall/               # Paywall + subscription modals
│   ├── ui/                    # shadcn/ui base components (don't modify)
│   └── ...
├── features/                  # Self-contained feature modules
│   ├── cycle/                 # Period cycle logic (useCycleData, utils, types)
│   └── nutrition/             # Meal planning (useMealPlan, mealPlanGenerator)
├── hooks/                     # Shared React hooks
│   ├── usePaywall.ts          # Subscription gating
│   ├── useSpoonacular.ts      # Spoonacular API (scaffolded, not yet wired)
│   ├── useAuth.ts             # Demo-mode auth
│   └── ...
├── services/
│   └── spoonacular.ts         # Spoonacular API client (scaffolded, not yet wired)
├── data/
│   └── recipes.ts             # 23 static recipes (Spoonacular export, March 2026)
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── stripe.ts             # Stripe client
└── utils/
    └── periodCalculations.ts  # Cycle math (legacy; prefer features/cycle/utils.ts)
```

**Environment variables** (`.env.local` — never commit):
```
VITE_SPOONACULAR_API_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## Design System — Warm Dusk

```typescript
// Section colours
telo:     '#6B4C3B'   // Brown    — Exercise
strava:   '#7A9E78'   // Green    — Nutrition
mysel:    '#A8848B'   // Mauve    — Mind / Meditation
periodka: '#C27A6E'   // Coral    — Period tracking
accent:   '#B8864A'   // Copper   — Highlights, CTAs

// Text hierarchy
textPrimary:   '#2E2218'   // Headings
textBody:      '#8B7560'   // Body copy
textSecondary: '#A0907E'   // Labels, meta

// Background
background: '#F0E6DA'      // Warm cream

// Glassmorphism
glassBg:     'rgba(255,255,255,0.28)'
glassBorder: 'rgba(255,255,255,0.20)'
glassBlur:   'blur(40px)'
```

**Standard card:**
```jsx
<div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 p-4">
```

**Standard filter pill:**
```jsx
<button className={activeFilter === id
  ? 'bg-[#6B4C3B] text-white px-4 py-2 rounded-full'
  : 'bg-white/30 text-[#8B7560] px-4 py-2 rounded-full border border-white/40'
}>
```

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Period tracker (Periodka) | ✅ ~90% | Settings route missing; orphaned Supabase hook |
| Symptom tracking | ✅ Complete | localStorage, custom symptoms, phase-aware |
| Exercise programs | ✅ Complete | 4-tier progression, paywall gated |
| Meditation player | ✅ Complete | 17 meditations, 5 min each |
| Recipe browser (local) | ✅ Complete | 23 static recipes |
| Meal planner (local) | ✅ Complete | 7-day plans, macro targeting |
| Community / Komunita | ✅ Complete | Posts, likes, comments |
| Habit tracker | ✅ Complete | Custom habits, streaks |
| Referral system | ✅ Demo mode | localStorage only |
| Freemium paywall | ✅ Complete | usePaywall hook + modals |
| **Spoonacular integration** | ⚠️ Scaffolded | Service + hooks exist, no UI wiring, no API key |
| **Real auth (Supabase)** | ⚠️ Demo mode | SupabaseAuthContext exists, RequireAuth bypassed |
| **Stripe payments** | ⚠️ Scaffolded | lib/stripe.ts exists, no live checkout |
| Video player | ❌ Missing | Exercise program videos not integrated |
| Admin panel (full UI) | ⚠️ Partial | Structure exists, not completed |

---

## Workflows

Detailed SOPs live in `workflows/`. Before starting a task, check if a workflow exists.

| Workflow | File | When to use |
|----------|------|-------------|
| Add a new page | `workflows/add-page.md` | Any new route |
| Add a new component | `workflows/add-component.md` | Reusable UI element |
| Integrate an API | `workflows/api-integration.md` | New external service |
| Update design tokens | `workflows/design-update.md` | Colour or spacing changes |
| Deploy to production | `workflows/deploy.md` | Pushing to Netlify |

*(Create these workflow files as patterns are established.)*

---

## How to Operate

**1. Look for existing implementations first**
Before writing new code, search `src/hooks/`, `src/features/`, and `src/components/v2/`. There are 151 components and 30+ hooks — check what exists.

**2. Read the relevant workflow**
If a workflow exists for the task, follow it. If it doesn't and the pattern is worth repeating, create one after completing the task.

**3. When things break**
- Read the full error, check the browser console and terminal
- Fix the specific issue — don't refactor surrounding code
- If a fix reveals a recurring pattern problem, update the relevant workflow

**4. Context management**
- Large tasks: read only the files you need, not the whole codebase
- Check `src/features/cycle/` for period logic (not `src/utils/periodCalculations.ts` — that's legacy)
- Check `src/features/nutrition/` for meal planning logic

---

## Shared Workflows & Tools

All workflows live in `/Users/sambot/.openclaw/workspace/projects/neome/_shared/workflows/`:

| Task | Workflow |
|------|----------|
| Add more recipes | `expand-recipe-database.md` |
| Improve translations | `retranslate-recipes.md` |
| Fix broken recipe steps | `patch-recipe-steps.md` |
| Deploy to Netlify | `deploy.md` |
| Complete meal planner | `build-meal-planner.md` |

Tool docs (for the `.cjs` scripts) live in `/Users/sambot/.openclaw/workspace/projects/neome/_shared/tools/`.

## Current Priorities (as of 2026-04-07)

1. Top up `vecera` (dinner) recipes to ~20 — currently only 5
2. Top up `smoothie` recipes to ~10 — currently only 3
3. PDF export for JedalnicekPlanner (jsPDF already installed)
4. Stripe checkout for €79 meal plan purchase + €30 discount code UI
5. Period tracker settings route + clean up orphaned Supabase hook
6. Real Supabase auth (post-MVP)
7. Stripe live payments (post-MVP)
