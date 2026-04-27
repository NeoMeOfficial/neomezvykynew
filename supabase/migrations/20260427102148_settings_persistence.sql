-- ============================================================
-- Workstream A · Settings persistence
-- ============================================================
-- Adds profile fields the redesign's Settings screens save:
--   F-009 SettingsProfile      → bio
--   F-028 SettingsNotifications → notification_prefs JSONB
--   F-029 SettingsPrivacy       → privacy_prefs JSONB
--   F-032 SettingsPrivacy       → last_data_export_at (rate limit)
-- F-030 Avatar uploads use a Supabase storage bucket (created below);
-- the URL is stored in the existing profiles.avatar_url column.
-- ============================================================

-- ── 1. profiles columns ─────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio                  TEXT,
  ADD COLUMN IF NOT EXISTS notification_prefs   JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS privacy_prefs        JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_data_export_at  TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.bio IS 'Free-form bio shown on Profil. F-009.';
COMMENT ON COLUMN public.profiles.notification_prefs IS 'Per-channel notification toggles. Keys: daily_reminder, community_replies, weekly_summary, cycle_alerts, plus_offers. Bool values. F-028.';
COMMENT ON COLUMN public.profiles.privacy_prefs IS 'Privacy toggles. Keys: community_visible, dm_open, share_streak. Bool values. F-029.';
COMMENT ON COLUMN public.profiles.last_data_export_at IS 'Timestamp of last successful GDPR export. Used to rate-limit to one per 24h. F-032.';

-- ── 2. avatars storage bucket ───────────────────────────────
-- Idempotent insert via ON CONFLICT. The bucket is public-read so
-- avatar URLs render without signed-URL gymnastics.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (Supabase auto-creates the storage.objects table)
-- Read: any user (public bucket).
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
CREATE POLICY "Avatars public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Write: users can upload to their own folder (avatars/<user_id>/...).
DROP POLICY IF EXISTS "Avatars insert own" ON storage.objects;
CREATE POLICY "Avatars insert own" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Avatars update own" ON storage.objects;
CREATE POLICY "Avatars update own" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Avatars delete own" ON storage.objects;
CREATE POLICY "Avatars delete own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
