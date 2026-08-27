# Planeat recepty — archív (2026-08-27)

Pôvodná knižnica 225 receptov ("Planeat recepty"), ktorá bežala v appke
od importu 21. 5. 2026 do výmeny za novú 142-receptovú knižnicu.

- `planeat_recipes_export_2026-08-27.json` — plný export produkčnej
  tabuľky `recipes` (vrátane id, usage_count) v deň archivácie.
- `planeat_recipes.csv` — ten istý obsah v šablónovom formáte importu
  (name, slot, prep_minutes, instructions, ingredients, makrá) — pripravené
  na budúce úpravy a prípadný spätný import.

Riadky v produkcii NEBOLI zmazané, len deaktivované (`active=false`) —
obľúbené položky a jedálničky, ktoré na ne odkazujú, tak neosirejú.
Zdrojové CSV kariet + pipeline ostávajú v `../source/` a `../*.py`.
