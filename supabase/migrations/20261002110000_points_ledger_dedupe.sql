-- Points fix (audit C4, Sam 2026-10-02): earning now goes exclusively
-- through the award-points Netlify function. Its dedupe is
-- check-then-insert, so two simultaneous requests could both pass the
-- check — this unique index makes the database the final referee
-- (the function treats error 23505 as "already awarded").

-- Clean any historical duplicates first, keeping the oldest row.
DELETE FROM public.points_ledger a
USING public.points_ledger b
WHERE a.ref_id IS NOT NULL
  AND a.user_id = b.user_id
  AND a.event_type = b.event_type
  AND a.ref_id = b.ref_id
  AND a.created_at > b.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS points_ledger_user_event_ref_uidx
  ON public.points_ledger (user_id, event_type, ref_id)
  WHERE ref_id IS NOT NULL;
