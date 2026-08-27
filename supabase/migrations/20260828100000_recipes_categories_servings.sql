-- 142-recipe library swap (2026-08-28): recipes now belong to up to
-- several of 6 browsing categories, carry a servings count (amounts are
-- per whole batch, kcal per portion), a vegetarian flag and a stable
-- source_id for idempotent re-imports. `slot` stays 3-valued for the
-- meal planner (primary slot derived from the first category).
-- Apply via the Supabase dashboard SQL editor.
alter table public.recipes
  add column if not exists categories text[] not null default '{}',
  add column if not exists servings   int,
  add column if not exists vegetarian boolean,
  add column if not exists source_id  text,
  add column if not exists image_url  text;

create unique index if not exists recipes_source_id_key
  on public.recipes (source_id) where source_id is not null;
create index if not exists recipes_categories_idx
  on public.recipes using gin (categories) where active = true;
