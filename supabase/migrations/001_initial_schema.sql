-- ============================================
-- NeoMe Database Schema — Initial Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── User Profiles ──────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  language text default 'sk',
  date_of_birth date,
  role text default 'user' check (role in ('user', 'admin', 'coach')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Subscriptions ──────────────────────────
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier text default 'free' check (tier in ('free', 'plus', 'program')),
  status text default 'active' check (status in ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- ── Program Purchases (one-time) ───────────
create table public.program_purchases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  program_id text not null,
  stripe_payment_id text,
  purchased_at timestamptz default now(),
  expires_at timestamptz, -- null = lifetime
  unique(user_id, program_id)
);

-- ── Nutrition Profiles ─────────────────────
create table public.nutrition_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  goal text,
  weight numeric,
  height numeric,
  age integer,
  activity_level text,
  meals_per_day integer,
  diet_type text default 'standard',
  allergies text[] default '{}',
  daily_calories integer,
  daily_protein integer,
  daily_carbs integer,
  daily_fat integer,
  updated_at timestamptz default now(),
  unique(user_id)
);

-- ── Habits ─────────────────────────────────
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  duration_days integer default 30,
  unit text default 'krát',
  target_per_day integer default 1,
  start_date date default current_date,
  created_at timestamptz default now()
);

create table public.habit_completions (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  count integer default 1,
  unique(habit_id, date)
);

-- ── Cycle Data ─────────────────────────────
create table public.cycle_data (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  last_period_start date,
  cycle_length integer default 28,
  period_length integer default 5,
  updated_at timestamptz default now(),
  unique(user_id)
);

create table public.cycle_symptoms (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  symptoms jsonb default '{}', -- { "headache": 3, "bloating": 2, ... }
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- ── Diary / Reflections ────────────────────
create table public.diary_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  date date default current_date,
  created_at timestamptz default now()
);

-- ── Meal Plans ─────────────────────────────
create table public.meal_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_data jsonb not null, -- full weekly plan
  generated_at timestamptz default now(),
  week_start date not null
);

-- ── Recipes ────────────────────────────────
create table public.recipes (
  id text primary key, -- slug-style ID
  title text not null,
  description text,
  category text not null,
  image text,
  prep_time integer, -- minutes
  calories integer,
  protein numeric,
  carbs numeric,
  fat numeric,
  ingredients jsonb default '[]', -- [{name, amount}]
  steps text[] default '{}',
  allergens text[] default '{}',
  dietary text[] default '{}',
  tags text[] default '{}',
  is_free boolean default false, -- available to free users
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Recipe Favorites ───────────────────────
create table public.recipe_favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  recipe_id text references public.recipes(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, recipe_id)
);

-- ── Programs ───────────────────────────────
create table public.programs (
  id text primary key,
  name text not null,
  description text,
  tagline text,
  image text,
  weeks integer,
  per_week integer,
  price_cents integer, -- in EUR cents
  stripe_price_id text,
  published boolean default true,
  created_at timestamptz default now()
);

create table public.program_exercises (
  id uuid default uuid_generate_v4() primary key,
  program_id text references public.programs(id) on delete cascade not null,
  week integer not null,
  day integer not null,
  title text not null,
  description text,
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  sort_order integer default 0
);

create table public.program_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  program_id text references public.programs(id) on delete cascade not null,
  exercise_id uuid references public.program_exercises(id) on delete cascade not null,
  completed_at timestamptz default now(),
  unique(user_id, exercise_id)
);

-- ── Meditations ────────────────────────────
create table public.meditations (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text,
  audio_url text,
  duration_seconds integer,
  is_free boolean default false,
  published boolean default true,
  created_at timestamptz default now()
);

-- ── Community Posts ────────────────────────
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text default 'general',
  content text not null,
  image_url text,
  pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.community_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

create table public.community_reactions (
  post_id uuid references public.community_posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  emoji text not null default '❤️',
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- ── Messaging ──────────────────────────────
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now()
);

create table public.conversation_members (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  last_read_at timestamptz default now(),
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

-- ── Blog ───────────────────────────────────
create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  content text not null,
  excerpt text,
  image_url text,
  author_id uuid references public.profiles(id),
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── App Settings (admin-configurable) ──────
create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Insert default settings
insert into app_settings (key, value) values
  ('stripe', '{"publishable_key": "", "secret_key": "", "webhook_secret": "", "configured": false}'::jsonb),
  ('subscription_prices', '{"plus_monthly": 1490, "plus_yearly": 14900}'::jsonb),
  ('free_tier_limits', '{"recipes": 10, "reflections_per_week": 3, "meditations": 1}'::jsonb),
  ('video_provider', '{"provider": "bunny", "api_key": "", "library_id": "", "configured": false}'::jsonb);

-- ── GDPR Consent Tracking ──────────────────
create table public.user_consents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  consent_type text not null, -- 'terms', 'privacy', 'health_data', 'marketing'
  granted boolean not null,
  ip_address text,
  granted_at timestamptz default now()
);

-- ── Notifications ──────────────────────────
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null, -- 'message', 'community', 'reminder', 'system'
  title text not null,
  body text,
  data jsonb default '{}',
  read boolean default false,
  created_at timestamptz default now()
);

-- ── Row Level Security ─────────────────────
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.program_purchases enable row level security;
alter table public.nutrition_profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.cycle_data enable row level security;
alter table public.cycle_symptoms enable row level security;
alter table public.diary_entries enable row level security;
alter table public.meal_plans enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_favorites enable row level security;
alter table public.programs enable row level security;
alter table public.program_exercises enable row level security;
alter table public.program_progress enable row level security;
alter table public.meditations enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_reactions enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.blog_posts enable row level security;
alter table public.app_settings enable row level security;
alter table public.user_consents enable row level security;
alter table public.notifications enable row level security;

-- ── RLS Policies ───────────────────────────

-- Profiles: users see own, admins see all
create policy "Users view own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'coach'))
);

-- Subscriptions: own only
create policy "Users view own subscription" on subscriptions for select using (auth.uid() = user_id);

-- Habits: own only
create policy "Users manage own habits" on habits for all using (auth.uid() = user_id);
create policy "Users manage own completions" on habit_completions for all using (auth.uid() = user_id);

-- Cycle: own only
create policy "Users manage own cycle" on cycle_data for all using (auth.uid() = user_id);
create policy "Users manage own symptoms" on cycle_symptoms for all using (auth.uid() = user_id);

-- Diary: own only
create policy "Users manage own diary" on diary_entries for all using (auth.uid() = user_id);

-- Nutrition: own only
create policy "Users manage own nutrition" on nutrition_profiles for all using (auth.uid() = user_id);

-- Meal plans: own only
create policy "Users manage own meal plans" on meal_plans for all using (auth.uid() = user_id);

-- Recipes: everyone can read published
create policy "Anyone reads published recipes" on recipes for select using (published = true);
create policy "Admins manage recipes" on recipes for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Recipe favorites: own only
create policy "Users manage own favorites" on recipe_favorites for all using (auth.uid() = user_id);

-- Programs: everyone reads published
create policy "Anyone reads published programs" on programs for select using (published = true);
create policy "Admins manage programs" on programs for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Program exercises: read if program published
create policy "Read exercises of published programs" on program_exercises for select using (
  exists (select 1 from programs where id = program_id and published = true)
);

-- Program progress: own only
create policy "Users manage own progress" on program_progress for all using (auth.uid() = user_id);

-- Meditations: read published
create policy "Anyone reads published meditations" on meditations for select using (published = true);

-- Community: read all, write own
create policy "Anyone reads posts" on community_posts for select using (true);
create policy "Users create posts" on community_posts for insert with check (auth.uid() = user_id);
create policy "Users edit own posts" on community_posts for update using (auth.uid() = user_id);
create policy "Users delete own posts" on community_posts for delete using (auth.uid() = user_id);

create policy "Anyone reads comments" on community_comments for select using (true);
create policy "Users create comments" on community_comments for insert with check (auth.uid() = user_id);
create policy "Users delete own comments" on community_comments for delete using (auth.uid() = user_id);

create policy "Anyone reads reactions" on community_reactions for select using (true);
create policy "Users manage own reactions" on community_reactions for all using (auth.uid() = user_id);

-- Conversations & messages: members only
create policy "Members view conversations" on conversations for select using (
  exists (select 1 from conversation_members where conversation_id = id and user_id = auth.uid())
);
create policy "Members view membership" on conversation_members for select using (auth.uid() = user_id);
create policy "Members read messages" on messages for select using (
  exists (select 1 from conversation_members where conversation_id = messages.conversation_id and user_id = auth.uid())
);
create policy "Members send messages" on messages for insert with check (
  auth.uid() = user_id and
  exists (select 1 from conversation_members where conversation_id = messages.conversation_id and user_id = auth.uid())
);

-- Blog: read published, admins manage
create policy "Anyone reads published blog" on blog_posts for select using (published = true);
create policy "Admins manage blog" on blog_posts for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- App settings: admins only
create policy "Admins manage settings" on app_settings for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Consents: own only
create policy "Users manage own consents" on user_consents for all using (auth.uid() = user_id);

-- Notifications: own only
create policy "Users view own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on notifications for update using (auth.uid() = user_id);

-- Program purchases: own only
create policy "Users view own purchases" on program_purchases for select using (auth.uid() = user_id);

-- ── Indexes ────────────────────────────────
create index idx_habits_user on habits(user_id);
create index idx_habit_completions_habit_date on habit_completions(habit_id, date);
create index idx_diary_user_date on diary_entries(user_id, date);
create index idx_cycle_symptoms_user_date on cycle_symptoms(user_id, date);
create index idx_community_posts_created on community_posts(created_at desc);
create index idx_messages_conversation on messages(conversation_id, created_at);
create index idx_notifications_user on notifications(user_id, read, created_at desc);
create index idx_recipes_category on recipes(category);
create index idx_program_exercises_program on program_exercises(program_id, week, day);

-- ── Done! ──────────────────────────────────
