-- NeoMe: Gabi ↔ User inbox
-- Every conversation is between one user and Gabi (the admin).
-- There is no user-to-user messaging.
--
-- To run: paste this into Supabase SQL Editor and execute.

CREATE TABLE IF NOT EXISTS public.messages (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body          text        NOT NULL,
  is_from_admin boolean     NOT NULL DEFAULT false,
  -- sender_name is stored for display convenience (e.g. 'Gabi' for admin messages)
  sender_name   text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  -- read_at: set when the recipient opens the thread
  read_at       timestamptz
);

-- Fast lookups per user and time order
CREATE INDEX IF NOT EXISTS messages_user_id_idx   ON public.messages (user_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages (created_at DESC);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies before recreating
DROP POLICY IF EXISTS "Users can read own messages"  ON public.messages;
DROP POLICY IF EXISTS "Users can send messages"      ON public.messages;
DROP POLICY IF EXISTS "Admin full access"            ON public.messages;

-- Users can read all messages in their own thread
CREATE POLICY "Users can read own messages" ON public.messages
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own (non-admin) messages
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND is_from_admin = false
  );

-- Admin (Gabi) can read and write all messages.
-- Set app_metadata: { "role": "admin" } on Gabi's Supabase user account via:
--   Dashboard → Authentication → Users → [Gabi] → Edit → app_metadata
-- Then this policy kicks in automatically.
CREATE POLICY "Admin full access" ON public.messages
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ── Seed: welcome message from Gabi ──────────────────────────────────────────
-- This is optional — you can also send the welcome message from the admin panel.
-- If you want every new user to see a welcome message, use a Supabase trigger instead.
-- Leave commented out for now; send welcome messages manually per user from the admin panel.
--
-- INSERT INTO public.messages (user_id, body, is_from_admin, sender_name)
-- VALUES ('<user-uuid>', 'Vitaj v NeoMe! Som tu pre teba. 💌', true, 'Gabi');
