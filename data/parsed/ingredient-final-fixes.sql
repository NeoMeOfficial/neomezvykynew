-- Ingredient final fixes — verified against live Supabase data 2026-05-07
-- 9 ingredient fixes + 1 recipe name fix across 9 recipes
-- All arrays built from current live state; safe to run even if partially applied.
-- Paste into Supabase SQL editor and click Run.

BEGIN;

-- 1. Baklažánové pyré so zeleninovými hranolčekmi
--    "paprika biela" — no such thing; "biela" leaked from "tofu biele" above it
UPDATE recipes SET ingredients = $$[{"raw":"1 x balenie tofu biele","name":"tofu biele","grams":180},{"raw":"1 porcia baklažánové pyré","name":"baklažánové pyré","grams":100},{"raw":"1 ks kaleráb","name":"kaleráb","grams":270},{"raw":"2 ks mrkva","name":"mrkva","grams":170},{"raw":"½ ks paprika","name":"paprika","grams":29}]$$::jsonb WHERE id = '030b086f-d281-4847-afaa-289e3c658c31';

-- 2. Rybacie raňajky
--    Last entry is a garbled merge of "rožky grahamové" (already in entry 1) + cibuľa
UPDATE recipes SET ingredients = $$[{"raw":"1 a ½ x kus rožky grahamové","name":"rožky grahamové","grams":63},{"raw":"1 a ½ x malá konzerva tuniak vo vlastnej šťave","name":"konzerva tuniak vo vlastnej šťave","grams":84},{"raw":"½ PL ghee maslo","name":"ghee maslo","grams":8.5},{"raw":"2 ks rajčiny","name":"rajčiny","grams":150},{"raw":"½ x stredne veľká cibuľa","name":"cibuľa","grams":37.5}]$$::jsonb WHERE id = '2c1f3450-982d-4e03-a44f-ab9c80d84916';

-- 3. Chia puding s ovocím
--    Last entry "NÁPOJE 2 a ½ dl mandľové mlieko" is a duplicate of entry 1
UPDATE recipes SET ingredients = $$[{"raw":"2 a ½ dl mandľové mlieko","name":"mandľové mlieko","grams":250},{"raw":"1 stredný kus banány","name":"banány","grams":90},{"raw":"4 PL jogurt bielkovinový napr. Skyr Pilos","name":"jogurt bielkovinový","grams":80},{"raw":"11 ks mandle","name":"mandle","grams":11},{"raw":"2 ČL chia semienka","name":"chia semienka","grams":6},{"raw":"½ PL čakankový sirup","name":"čakankový sirup","grams":9}]$$::jsonb WHERE id = '01c2b7ee-0bb8-4f2f-8c03-38f8a19bc44e';

-- 4. Amarantová kaša s ovocím
--    Entry 4 is a garbled merge; yogurt and perličky are already in entries 1+2.
--    The only new ingredient is "½ koliesko ananás" — recovered and given its own entry (40g).
UPDATE recipes SET ingredients = $$[{"raw":"1 balenie jogurt bielkovinový napr. Skyr Pilos","name":"jogurt bielkovinový","grams":140},{"raw":"5 PL amarantové perličky napr. Mariana","name":"amarantové perličky","grams":35},{"raw":"2 ČL konopné semienka lúpané napr. Bio Nebio","name":"konopné semienka lúpané","grams":7},{"raw":"½ koliesko ananás","name":"ananás","grams":40},{"raw":"½ ks kiwi","name":"kiwi","grams":44.5}]$$::jsonb WHERE id = '9d916491-dfc5-4d95-996b-2ec6e3975d84';

-- 5. Tvarohová pochúťka s kokosom
--    "2 ČL kokos mletý" is an exact duplicate (entries 3 and 6); remove one.
UPDATE recipes SET ingredients = $$[{"raw":"12 a ½ PL tvaroh jemný hrudkový 2,5 % napr. Pilos","name":"tvaroh jemný hrudkový","grams":212.5},{"raw":"18 x 5 bobúľ čučoriedky","name":"čučoriedky","grams":162},{"raw":"2 ČL kokos mletý","name":"kokos mletý","grams":10},{"raw":"1 PL med","name":"med","grams":18},{"raw":"7 PL maliny","name":"maliny","grams":147},{"raw":"4 ČL javorový sirup","name":"javorový sirup","grams":16}]$$::jsonb WHERE id = 'e9ef321e-3cc1-46f0-b69a-1e5d47a47ddc';

-- 5b. Fix garbled recipe name (pochúÉka → pochúťka)
UPDATE recipes SET name = $$Tvarohová pochúťka s kokosom$$ WHERE id = 'e9ef321e-3cc1-46f0-b69a-1e5d47a47ddc';

-- 6. Sladká omeleta s ovocím
--    čučoriedky split across two entries (153g + 27g); merged into one (180g).
UPDATE recipes SET ingredients = $$[{"raw":"2 ks slepačie vajce","name":"slepačie vajce","grams":110},{"raw":"3 PL špaldová múka hladká","name":"špaldová múka hladká","grams":36},{"raw":"8 a ½ x 10 bobúľ čučoriedky","name":"čučoriedky","grams":180},{"raw":"½ dl mlieko polotučné 1,5 %","name":"mlieko polotučné","grams":50},{"raw":"2 ČL sezamové semená","name":"sezamové semená","grams":6},{"raw":"2 PL tvaroh jemný hrudkový 2,5 % napr. Pilos","name":"tvaroh jemný hrudkový","grams":34}]$$::jsonb WHERE id = '3e4a86a7-1633-477a-849f-712cc8becd16';

-- 7. Praženica so zeleninou
--    rukola split across two entries (34g + 17g); merged into one (51g).
UPDATE recipes SET ingredients = $$[{"raw":"1 a ½ x krajec chlieb zemiakový","name":"chlieb zemiakový","grams":75},{"raw":"2 ks slepačie vajce","name":"slepačie vajce","grams":110},{"raw":"½ ČL olivový olej","name":"olivový olej","grams":2.5},{"raw":"3 x miska rukola","name":"rukola","grams":51},{"raw":"16 ks mandle","name":"mandle","grams":16},{"raw":"3 ks rajčiny","name":"rajčiny","grams":225}]$$::jsonb WHERE id = '1eb6e376-1b3b-40b8-bb3c-22e489154dbf';

-- 8. Hruškový dezert
--    Last entry is a garbled merge; mandle+jogurt already in entries 1+2.
--    The new ingredient recovered from the merge: "figy" (dried figs, 25g).
UPDATE recipes SET ingredients = $$[{"raw":"11 ks mandle","name":"mandle","grams":11},{"raw":"3 a ½ PL jogurt bielkovinový napr. Skyr Pilos","name":"jogurt bielkovinový","grams":70},{"raw":"½ ks hrušky","name":"hrušky","grams":67.5},{"raw":"25 g figy","name":"figy","grams":25}]$$::jsonb WHERE id = 'a997cf62-1fa5-4f97-b774-1079d86c07cd';

-- 9. Nadýchané ovsené vločky s višňami, skyrom a kokosom
--    Protein powder name parsed as "% whey protein scitec nutrition" — fixed to generic Slovak term.
UPDATE recipes SET ingredients = $$[{"raw":"6 PL ovsené vločky","name":"ovsené vločky","grams":66},{"raw":"4 ČL kokos mletý","name":"kokos mletý","grams":20},{"raw":"2 PL 100% Whey Protein Scitec Nutrition","name":"srvátkový proteín","grams":20},{"raw":"4 PL jogurt bielkovinový napr. Skyr Pilos","name":"jogurt bielkovinový","grams":80}]$$::jsonb WHERE id = '41317b8d-a232-427f-a3ae-8341811e83b7';

COMMIT;
