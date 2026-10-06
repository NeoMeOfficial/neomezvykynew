-- SECURITY (pentest finding, 2026-10-06): a logged-in user could write
-- directly to points_ledger (INSERT/UPDATE/DELETE their own rows) and
-- mint unlimited points, which redeem for real rewards. The app only
-- ever READS points_ledger on the client; all earning goes through the
-- award-points Netlify function (service role, bypasses RLS with caps +
-- dedupe). So the client needs SELECT-own only — no write policy.
--
-- Also: content_views was fully writable, letting a user DELETE their
-- view history to reset the free-tier quota. The client logView() must
-- still INSERT its own views, but UPDATE/DELETE are never legitimate.
--
-- Verified with a real attacker JWT before and after.

-- ── points_ledger: read own, no client writes ──────────────────────
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'points_ledger'
  loop
    execute format('drop policy %I on public.points_ledger', p.policyname);
  end loop;
end $$;

alter table public.points_ledger enable row level security;

create policy "points_ledger read own"
  on public.points_ledger for select
  using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policy → authenticated/anon cannot write.
-- award-points uses the service role, which bypasses RLS.
revoke insert, update, delete on public.points_ledger from anon, authenticated;

-- ── content_views: read + insert own, never update/delete ──────────
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'content_views'
  loop
    execute format('drop policy %I on public.content_views', p.policyname);
  end loop;
end $$;

alter table public.content_views enable row level security;

create policy "content_views read own"
  on public.content_views for select
  using (auth.uid() = user_id);

-- logView() legitimately records a view for the current user.
create policy "content_views insert own"
  on public.content_views for insert
  with check (auth.uid() = user_id);

-- Deleting/altering view history would reset the free quota.
revoke update, delete on public.content_views from anon, authenticated;

-- ── Clean up the pentest's forged rows + attacker account ──────────
-- (cascades remove the attacker's profile / subscription / points.)
delete from auth.users where email = 'pentest-attacker-0210@mailinator.com';
