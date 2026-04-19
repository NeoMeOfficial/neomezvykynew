/**
 * Local seed script — run once to push static data into Supabase.
 * Uses the service role key from .env.local (bypasses RLS).
 *
 * Usage:  node_modules/.bin/jiti scripts/seed-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env and .env.local ──────────────────────────────────────────────────
function parseEnvFile(path: string) {
  try {
    const raw = readFileSync(resolve(process.cwd(), path), 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* file may not exist */ }
}
parseEnvFile('.env');
parseEnvFile('.env.local');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Import static data ────────────────────────────────────────────────────────
import { recipes } from '../src/data/recipes';
import { TeloExtraStaticData } from '../src/data/teloExtraData';
import { TeloStrecingStaticData } from '../src/data/teloStrecingData';

// ── Seed helpers ──────────────────────────────────────────────────────────────
async function seedTable(table: string, rows: Record<string, unknown>[]) {
  console.log(`\nSeeding ${table} (${rows.length} rows)...`);
  const chunkSize = 50;
  let total = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`  ✗ chunk ${i}–${i + chunk.length}: ${error.message}`);
    } else {
      total += chunk.length;
      process.stdout.write(`  ✓ ${total}/${rows.length}\r`);
    }
  }
  console.log(`  Done: ${total} rows seeded into ${table}`);
}

// ── Prepare payloads ──────────────────────────────────────────────────────────
const recipeRows = recipes.map(r => ({
  id: r.id,
  title: r.title,
  category: r.category,
  description: r.description ?? '',
  prep_time: r.prepTime,
  servings: r.servings,
  calories: r.calories,
  protein: r.protein,
  carbs: r.carbs,
  fat: r.fat,
  fiber: r.fiber,
  ingredients: r.ingredients ?? [],
  steps: r.steps ?? [],
  allergens: r.allergens ?? [],
  dietary: r.dietary ?? [],
  tags: r.tags ?? [],
  image: r.image ?? '',
  difficulty: r.difficulty ?? 'easy',
  pdf_path: (r as any).pdfPath ?? '',
  active: true,
}));

const exerciseRows = [
  ...TeloExtraStaticData.map((e: any) => ({ ...e, content_type: 'exercise' })),
  ...TeloStrecingStaticData.map((s: any) => ({ ...s, content_type: 'stretch' })),
];

// ── Run ───────────────────────────────────────────────────────────────────────
(async () => {
  console.log('NeoMe Supabase seeder');
  console.log('URL:', SUPABASE_URL);

  await seedTable('recipes', recipeRows as any);
  await seedTable('exercises', exerciseRows as any);

  console.log('\n✅ Seeding complete.');
})();
