# Clean-slate procedure (pre-launch only)

**⚠️ Destructive. Only run before public launch. Do not run on a Supabase project with real users.**

This wipes all user data and leaves only the admin bootstrap accounts. Use it once before launch to clear test data accumulated during development.

After this runs, the only humans who can sign in are the bootstrap emails listed in `src/config/admin-emails.ts`. New users sign up normally and start clean.

## Pre-flight check

Confirm none of these are true:

- [ ] Any real user has signed up and we'd lose their data
- [ ] We're operating against the production Supabase project AND there's any chance someone used it for real
- [ ] Anyone other than Sam or Gabi has logged in recently

If any of those is true → **stop**. The wipe is wrong. Migrate users instead (a different procedure not documented here).

## What this wipes

All rows from user-data tables. **Schema is preserved.** Bootstrap admins keep their auth records.

```
profiles                       → all rows (cascades to most other user-data tables via FK)
auth.users                     → all rows EXCEPT bootstrap admin emails
messages                       → all rows
cycle_symptoms                 → all rows
diary_entries                  → all rows
reflections                    → all rows
habits / habit_entries / habit_completions → all rows
user_active_programs           → all rows
user_app_data                  → all rows
user_credits                   → all rows
user_favorites                 → all rows
user_progress                  → all rows
user_habits                    → all rows
user_badges                    → all rows
points_ledger                  → all rows
credit_transactions            → all rows
referrals                      → all rows
community_posts / community_likes → all rows
```

What's preserved (content tables — Gabi's editorial work):

```
recipes / exercises / meditations / programmes / blog_posts → kept
phase_advice / phase_tips / cycle_tips                       → kept
referral_codes (admin-curated codes)                         → kept
```

## SQL

Run from Supabase Studio → SQL Editor as the **service role** (not anon). Read each block before clicking "Run."

```sql
-- ============================================================
-- BLOCK 1 — User-data tables (cascades take care of most FKs)
-- ============================================================
TRUNCATE TABLE
  public.profiles,
  public.messages,
  public.cycle_symptoms,
  public.diary_entries,
  public.reflections,
  public.habits,
  public.habit_entries,
  public.habit_completions,
  public.user_active_programs,
  public.user_app_data,
  public.user_credits,
  public.user_favorites,
  public.user_progress,
  public.user_habits,
  public.user_badges,
  public.points_ledger,
  public.credit_transactions,
  public.referrals,
  public.community_posts,
  public.community_likes
CASCADE;
```

```sql
-- ============================================================
-- BLOCK 2 — Auth users (keep bootstrap admins only)
-- ============================================================
-- IMPORTANT: edit this list to match src/config/admin-emails.ts
-- before running.

DELETE FROM auth.users
WHERE email NOT IN (
  'samuelgrecner@gmail.com',
  'gabi@neome.com.au'
);
```

## Post-wipe verification

```sql
SELECT COUNT(*) AS remaining_users FROM auth.users;
-- expected: 2 (or however many bootstrap admins are listed)

SELECT COUNT(*) AS remaining_profiles FROM public.profiles;
-- expected: 0 (admins haven't created profiles yet — they will on next login)

SELECT email FROM auth.users ORDER BY email;
-- should show only the bootstrap admin emails
```

## Re-bootstrapping

After the wipe, when an admin logs in next:
1. Supabase auth recognises them
2. `set-admin-role` Edge Function fires (their email is in the bootstrap list)
3. JWT gets `app_metadata.role='admin'`
4. They land on `/admin`
5. A `profiles` row is auto-created (or created via `loadUserProfile` in `SupabaseAuthContext`)

No additional steps. The first admin to log in after the wipe seeds their own profile.

## Known limitations

- **Storage objects are NOT wiped** by this SQL. If Gabi uploaded test images during dev, they remain in `content-images`. Manual cleanup via Supabase Studio → Storage → bulk select + delete.
- **Stripe customers/subscriptions are NOT wiped.** If you've connected real Stripe data during dev, deal with it separately. Test-mode Stripe is automatically reset when you switch keys.
