# Recepty — 142-receptová knižnica (Nutriadapt export, 2026-08-28)

Nahrádza Planeat 225 (archív v `../planeat/`). V appke sa nachádza **výhradne**
týchto 142, ďalšie sa doplnia neskôr.

- `NEOME_APP_142_receptov.json` — zdrojová tabuľka od Gabi (xlsx verzia je len
  rozpísaná kópia toho istého).
- `import_142.py` — konverzia do SQL: 6 kategórií (`categories`), hlavný
  plánovačový `slot`, porcie, bezmäsité, `source_id` (idempotentný upsert).
- `seed_142.sql` — výsledok. Postup nasadenia (Supabase SQL editor):
  1. `supabase/migrations/20260828100000_recipes_categories_servings.sql`
  2. `seed_142.sql` — v jednej transakcii deaktivuje všetko staré a vloží 142.

Rozhodnutia (Gabi 2026-08-28): makrá bez hodnôt ostávajú NULL (UI ukáže „—"),
opravené kcal: Krevetové cestoviny 2176→544, Letné cestoviny 0→316; fotky
sa zatiaľ neriešia (stock obrázky podľa kategórie); porcie sa zobrazujú ako
„Recept na N porcií" s množstvami na celú dávku.
