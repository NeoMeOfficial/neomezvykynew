# Phase 0 — resume checklist (Edge Function deploy + Storage bucket)

**Status as of 2026-05-01 (when Sam stepped away):**

- ✅ All Phase 0 code shipped (migrations, Edge Function source, helpers, route move, AdminDashboard deletion)
- ✅ SQL migrations applied to Supabase (`20260501100000_status_enum.sql`, `20260501100100_admin_write_rls.sql`)
- ✅ Build green (`npm run build`)
- ✅ Supabase CLI installed (`supabase --version` → `2.95.4`)
- ⏸ **Edge Function `set-admin-role` not yet deployed**
- ⏸ **Storage bucket `content-images` not yet created**
- ⚠️ **Project-ID mismatch unresolved** — must confirm before deploying anything

---

## ⚠️ First: resolve the project-ID mismatch

The repo has two different Supabase project IDs:

| Source | Project ID |
|---|---|
| `.env` (`VITE_SUPABASE_URL`) — what the app actually uses | `lczfxbghlsqkieatxouy` |
| `supabase/config.toml` (CLI default) | `xqihoxgwxgiwwbybztbp` |

Whichever project is "live" (the one the app reads from at runtime) is where the Edge Function has to be deployed.

### Step 1 — log into Supabase CLI

```bash
supabase login
```

(Opens browser, asks you to sign in.)

### Step 2 — list your projects

```bash
supabase projects list
```

You'll see something like:

```
LINKED  ORG ID         REFERENCE ID            NAME              REGION              CREATED AT (UTC)
        XXXXXXXXXXXX   lczfxbghlsqkieatxouy    NeoMe (live?)     ap-southeast-2     2024-...
        XXXXXXXXXXXX   xqihoxgwxgiwwbybztbp    NeoMe (old?)      eu-central-1       2024-...
```

### Step 3 — decide which is the active one

The project that contains the existing tables (`messages`, `recipes`, `exercises`, `programmes`, etc.) — and where the Phase 0 SQL migrations were already applied — is the live one. If you applied the migrations, you know which project Studio was open on at the time. **That's the live one.**

### Step 4 — make `.env` and `config.toml` agree

Pick whichever is correct and update the other one to match.

**If `lczfxbghlsqkieatxouy` is correct** (most likely, since `.env` has it and the app uses `.env`):

```bash
# Edit supabase/config.toml — change line 1:
project_id = "lczfxbghlsqkieatxouy"
```

**If `xqihoxgwxgiwwbybztbp` is correct**:

```bash
# Edit .env — change VITE_SUPABASE_URL accordingly. WARNING: this means the app
# has been pointing at the wrong project; check whether the migrations actually
# landed in the correct place, and re-run them on the correct project if not.
```

---

## Deploy the Edge Function

Once the project ID is settled:

### Step 1 — link the project

```bash
supabase link --project-ref <THE_CORRECT_PROJECT_REF>
# e.g. supabase link --project-ref lczfxbghlsqkieatxouy
```

It may ask for a database password (the one you set when the project was created). If you don't have it, reset it in Supabase Studio → Project Settings → Database → Reset password.

### Step 2 — deploy

```bash
supabase functions deploy set-admin-role
```

Takes ~30 seconds. Output should end with `Deployed Function set-admin-role`.

### Step 3 — verify

Open Supabase Studio → **Edge Functions** → `set-admin-role` should appear with status "Active".

Smoke test by signing into the app with `samuelgrecner@gmail.com`. Open browser devtools → Network tab → look for a `set-admin-role` request to the functions endpoint. Then in Studio → **Authentication → Users → samuelgrecner@gmail.com → User Metadata**, confirm `app_metadata` contains `{"role": "admin"}`.

If you can then visit `/admin` in the app without being redirected to `/domov-new`, the whole auth chain is working.

---

## Set up Storage bucket

Separately from the Edge Function, follow [storage-setup.md](storage-setup.md). Five-minute task in Supabase Studio. Doesn't depend on CLI.

---

## When all three are done

Phase 0 is fully landed. Update `tracker.data.js`:

- Mark Phase 0 status as `shipped`
- Remove the "Phase 0 deploy" blocker
- Add a one-liner to `recentDecisions` with the date

Then we're ready to start Phase 1 (blog posts block editor + vertical slice).

---

## If something breaks during deploy

Common failures:

- **`Error: Project not linked`** — re-run `supabase link --project-ref ...`
- **`Error: Authentication failed`** — re-run `supabase login`
- **`Error: function failed to deploy`** — check the function code in `supabase/functions/set-admin-role/index.ts` is syntactically valid (usually it is; redeploy attempt sometimes fixes transient issues)
- **App calls function and gets 401** — verify `[functions.set-admin-role]` block in `config.toml` has `verify_jwt = true`
- **App calls function and gets 500** — check Supabase Studio → Edge Functions → set-admin-role → **Logs** for the actual error. Common: missing `SUPABASE_SERVICE_ROLE_KEY` env var (should be auto-injected, but verify in **Project Settings → Edge Functions → Secrets**)

If stuck, re-engage Claude with: *"resume Phase 0 deploy, here's the error: ..."*
