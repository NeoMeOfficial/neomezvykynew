#!/usr/bin/env python3
"""
NeoMe recipe importer — Phase 2: macro computation.

Loads parsed_recipes.json, computes kcal + macros for every recipe from the
food database, and writes recipes_with_macros.json.

  - normal ingredient → food_db.match() × grams
  - sub-component line (is_sub_component) → batch macros scaled to its grams
  - coverage_pct = matched grams ÷ total grams  (confidence of the estimate)
"""
import json
from pathlib import Path
from collections import Counter
import food_db

HERE = Path(__file__).parent
IN = HERE / "parsed_recipes.json"
OUT = HERE / "recipes_with_macros.json"

MACROS = ("kcal", "p", "c", "f", "fiber")


def ingredient_macros(ing):
    """(macro-dict, matched?) for one ingredient at its gram weight."""
    grams = ing.get("grams") or 0
    food = food_db.match(ing["name"], ing.get("raw", ""))
    if food is None:
        return {k: 0 for k in MACROS}, False, grams
    factor = grams / 100.0
    return ({k: food[k] * factor for k in MACROS},
            True, grams)


def batch_macros(sub):
    """Total macros + total grams of a sub-recipe's full batch."""
    tot = {k: 0.0 for k in MACROS}
    matched_g = 0.0
    total_g = 0.0
    for ing in sub["ingredients"]:
        m, ok, g = ingredient_macros(ing)
        total_g += g
        if ok:
            matched_g += g
            for k in MACROS:
                tot[k] += m[k]
    return tot, total_g, matched_g


def main():
    recipes = json.loads(IN.read_text(encoding="utf-8"))
    unmatched = Counter()
    out = []

    for r in recipes:
        # pre-compute the batch profile (per-100g of the batch) if present
        sub_per100 = None
        sub_warn = None
        if r.get("sub_recipe"):
            bt, bg, bmg = batch_macros(r["sub_recipe"])
            if bg > 0:
                sub_per100 = {k: bt[k] / bg * 100 for k in MACROS}
                if bg > 0 and bmg / bg < 0.85:
                    sub_warn = round(bmg / bg * 100)
            for ing in r["sub_recipe"]["ingredients"]:
                if food_db.match(ing["name"], ing.get("raw", "")) is None:
                    unmatched[ing["name"]] += 1

        total = {k: 0.0 for k in MACROS}
        total_g = 0.0
        matched_g = 0.0

        for ing in r["ingredients"]:
            grams = ing.get("grams") or 0
            total_g += grams
            if ing.get("is_sub_component") and sub_per100 is not None:
                # scale the batch profile to this portion
                factor = grams / 100.0
                for k in MACROS:
                    total[k] += sub_per100[k] * factor
                matched_g += grams
            else:
                m, ok, g = ingredient_macros(ing)
                if ok:
                    matched_g += grams
                    for k in MACROS:
                        total[k] += m[k]
                else:
                    unmatched[ing["name"]] += 1

        coverage = round(matched_g / total_g * 100) if total_g else 0

        out.append({
            "src_num": r["src_num"],
            "slot": r["slot"],
            "name": r["name"],
            "prep_minutes": r["prep_minutes"],
            "instructions": r["instructions"],
            "ingredients": [
                {"raw": i["raw"], "name": i["name"], "grams": i["grams"]}
                for i in r["ingredients"]
            ],
            "kcal": round(total["kcal"]),
            "protein": round(total["p"], 1),
            "carbs": round(total["c"], 1),
            "fat": round(total["f"], 1),
            "fiber": round(total["fiber"], 1),
            "coverage_pct": coverage,
            "is_batch": r["is_batch"],
            "has_alternatives": r["has_alternatives"],
        })

    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    # ── report ──
    print(f"=== MACRO COMPUTATION — {len(out)} recipes ===")
    cov = [r["coverage_pct"] for r in out]
    print(f"  coverage avg: {sum(cov)/len(cov):.1f}%   min: {min(cov)}%")
    buckets = Counter()
    for c in cov:
        buckets["100%" if c == 100 else
                "90-99%" if c >= 90 else
                "70-89%" if c >= 70 else "<70%"] += 1
    for b in ("100%", "90-99%", "70-89%", "<70%"):
        print(f"    {b:8s}: {buckets[b]}")
    low = [r for r in out if r["coverage_pct"] < 90]
    if low:
        print(f"\n  recipes below 90% coverage ({len(low)}):")
        for r in sorted(low, key=lambda x: x["coverage_pct"]):
            print(f"    {r['coverage_pct']:3d}%  {r['slot']} #{r['src_num']}  {r['name']}")

    if unmatched:
        print(f"\n  UNMATCHED ingredients ({len(unmatched)}):")
        for name, cnt in unmatched.most_common():
            print(f"    ×{cnt:2d}  {name!r}")

    # kcal sanity — flag implausible values
    print("\n  kcal sanity (per recipe, full recipe as parsed):")
    odd = [r for r in out if r["kcal"] < 80 or r["kcal"] > 1400]
    for r in sorted(odd, key=lambda x: x["kcal"]):
        print(f"    {r['kcal']:5d} kcal  {r['slot']} #{r['src_num']}  {r['name']}")
    print(f"    (total flagged: {len(odd)})")


if __name__ == "__main__":
    main()
