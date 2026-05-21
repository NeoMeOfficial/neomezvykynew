#!/usr/bin/env python3
"""
NeoMe recipe importer — Phase 1: parser.

Reads the 3 source CSVs (ranajky / hlavne / snacky), splits them into
individual recipes, and emits a structured intermediate JSON.

Source layout per recipe:
  - col[0] holds a running number (page/internal — ignored for content)
  - col[1] holds: title, "<n> min", "Postup prípravy:", postup lines,
    "INGREDIENCIE", ingredient lines, optional "ďalšie ingrediencie:",
    optional "INGREDIENCIE - <sub>" + "Postup prípravy - <sub>:" blocks,
    optional "NÁPOJE" section.
  - recipes are separated by 3 blank rows.

Left-column noise (page numbers, client names) is never read.
"""
import csv, re, json, sys
from pathlib import Path
from difflib import SequenceMatcher

SRC = Path(__file__).parent / "source"
OUT = Path(__file__).parent / "parsed_recipes.json"

CARDS = [
    ("ranajky.csv", "ranajky"),
    ("hlavne.csv", "hlavne"),
    ("snacky.csv", "snack"),
]

# ── Recipes to drop (canonical dedup — keep lower number) ──────────────────
DROP = {
    "ranajky": set(),          # brownies #51 dropped below by title, see DROP_TITLE
    "hlavne": {31, 38, 62, 101, 111},
    "snack": set(),
}
# ranajky #51 "Batátové nepečené brownies" — kept only as snack
DROP_RANAJKY_NUM = {51}

# ── Fraction glyphs → decimal ─────────────────────────────────────────────
FRACTIONS = {
    "½": 0.5, "⅓": 1/3, "⅔": 2/3, "¼": 0.25, "¾": 0.75,
    "1⁄2": 0.5, "1⁄3": 1/3, "2⁄3": 2/3, "1⁄4": 0.25, "3⁄4": 0.75,
}

TIME_RE = re.compile(r"(\d+)\s*min", re.IGNORECASE)
TIME_ONLY_RE = re.compile(r"^\d+\s*min\.?\s*$", re.IGNORECASE)
# lenient — covers 'prípravy', 'prírpavy', 'prirpavy', 'pripravy'
_POSTUP = r"(postup|spôsob|potup)\s+pr\w*av\w*"
POSTUP_RE = re.compile(r"^" + _POSTUP + r"\s*:?\.?\s*$", re.IGNORECASE)
SUB_POSTUP_RE = re.compile(r"^" + _POSTUP + r"\s*[-–]\s*(.+?):?\s*$", re.IGNORECASE)
ING_RE = re.compile(r"^INGREDIENCIE\s*$", re.IGNORECASE)
ALT_ING_RE = re.compile(r"^INGREDIENCIE\s*[-–]\s*ALTERNAT[IÍ]?VA\s*(\d*)\s*$", re.IGNORECASE)
SUB_ING_RE = re.compile(r"^INGREDIENCIE\s*[-–]\s*(.+)$", re.IGNORECASE)
MARINADE_ING_RE = re.compile(r"^INGREDIENCIE\s+MARIN[ÁA]DA\s*$", re.IGNORECASE)
EXTRA_RE = re.compile(r"^ďalšie\s+ingrediencie\s*:?\s*(.*)$", re.IGNORECASE)
NAPOJE_RE = re.compile(r"^NÁPOJE\s*$", re.IGNORECASE)


def read_card(path):
    """Return list of rows, each row a list of cell strings."""
    with open(path, encoding="utf-8") as f:
        return [row for row in csv.reader(f)]


def split_recipes(rows):
    """Yield (number, [content-lines]) — content-lines = col[1..] joined per row."""
    recipes = []
    i = 0
    n = len(rows)
    while i < n:
        row = rows[i]
        c0 = row[0].strip() if row else ""
        m = re.match(r"^(\d+)\.?\s*$", c0)
        if not m:
            i += 1
            continue
        num = int(m.group(1))
        # collect content cells: col[1] is primary; col[2+] noise except time
        block = []
        # title row itself: col[1]
        title_cell = row[1] if len(row) > 1 else ""
        # later columns on the title row may hold the time (e.g. ",Beata,20 min")
        title_extra = [c for c in row[2:] if c.strip()]
        block.append(("title", title_cell, title_extra))
        i += 1
        # consume until next numbered row
        while i < n:
            r = rows[i]
            c0n = r[0].strip() if r else ""
            if re.match(r"^(\d+)\.?\s*$", c0n):
                break
            cell = r[1] if len(r) > 1 else ""
            extra = [c for c in r[2:] if c.strip()]
            block.append(("row", cell, extra))
            i += 1
        recipes.append((num, block))
    return recipes


def clean_title(cell):
    """First line of the title cell only — drop embedded client/author names."""
    return cell.split("\n")[0].strip()


def parse_qty(text):
    """Parse a leading quantity like '2 a 1⁄2', '1⁄2', '10 a 1⁄2' → float or None."""
    t = text.strip()
    # normalise "a 1⁄2" combos
    total = 0.0
    found = False
    # whole + 'a' + fraction  e.g. "2 a 1⁄2"
    m = re.match(r"^(\d+)\s+a\s+([½⅓⅔¼¾]|\d⁄\d)", t)
    if m:
        total += int(m.group(1))
        total += FRACTIONS.get(m.group(2), 0)
        return total
    # standalone fraction
    for glyph, val in FRACTIONS.items():
        if t.startswith(glyph):
            return val
    # plain integer/decimal
    m = re.match(r"^(\d+(?:[.,]\d+)?)", t)
    if m:
        return float(m.group(1).replace(",", "."))
    return None


def parse_grams(line):
    """
    Extract gram weight from an ingredient line.
      '... (360 g)'            → 360
      '150 g cottage cheese'   → 150
      '150 x g cottage cheese' → 150
      '260 g tekvica Hokkaido' → 260
    Returns float or None.
    """
    # 1) weight in trailing parentheses: (360 g) / (37.5 g) / (1500 g)
    paren = re.findall(r"\(([^)]*?)\)", line)
    for p in reversed(paren):
        m = re.search(r"(\d+(?:[.,]\d+)?)\s*g\b", p)
        if m:
            return float(m.group(1).replace(",", "."))
    # 2) inline 'NNN g' or 'NNN x g' at the start
    m = re.search(r"\b(\d+(?:[.,]\d+)?)\s*x?\s*g\b", line)
    if m:
        return float(m.group(1).replace(",", "."))
    # 3) millilitres treated 1:1 as grams
    for p in reversed(paren):
        m = re.search(r"(\d+(?:[.,]\d+)?)\s*ml\b", p)
        if m:
            return float(m.group(1).replace(",", "."))
    m = re.search(r"\b(\d+(?:[.,]\d+)?)\s*ml\b", line)
    if m:
        return float(m.group(1).replace(",", "."))
    return None


_NUM = r"[\d.,/⁄½⅓⅔¼¾]"
# a leading quantity: digits, fractions, joined by 'a' (and-a-half) or 'x'
_QTY = r"(?:" + _NUM + r"+(?:\s*[axA×]\s*" + _NUM + r"+)*)"

def clean_name(line):
    """Strip quantity prefix, units, brand ('napr. X'), parentheses → food noun."""
    s = line
    # drop everything in parentheses
    s = re.sub(r"\([^)]*\)", "", s)
    # drop brand suffix
    s = re.sub(r"\bnapr\.?\s.*$", "", s, flags=re.IGNORECASE)
    # drop inline size descriptors ('priemer 14,5 cm', '40 cm dĺžka')
    s = re.sub(r"\bpriemer\s*[\d.,]+\s*cm\b", "", s, flags=re.IGNORECASE)
    s = re.sub(r"\b[\d.,]+\s*cm\b(\s*(dĺžka|dlžka|obvod))?", "", s, flags=re.IGNORECASE)
    units = (r"(PL|ČL|dcl|dl|ml|g|kg|ks|kus|kusov|krajec|krajce|balenie|miska|"
             r"misky|porcia|porcie|štipka|naberačka|väčšia|plátok|plátkov|"
             r"strúčik|strúčiky|polovica|stredný|stredná|stredne|menší|väčší|"
             r"priemerný|priemerná|veľká|veľký|veľkosť|malý|malá|hrnček|šálka|"
             r"kocka|polievková|čajová|lyžica|lyžička|košík|pásik|koliesko|"
             r"trojuholník|palacinka|guľka|gulička|bobúľ|bobuľa|hrsť|tyčinka|"
             r"objem|zarovnaná|zarovnané|listov|hrniec|hrnce|x)")
    # repeatedly peel a leading quantity then a unit word
    prev = None
    while prev != s:
        prev = s
        s = re.sub(r"^\s*" + _QTY + r"?\s*", "", s)
        s = re.sub(r"^\s*\bx\b\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"^\s*\ba\b\s*(?=" + _NUM + r")", "", s, flags=re.IGNORECASE)
        s = re.sub(r"^\s*" + units + r"\b\.?\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"^[\s\-–]+", "", s)
    return re.sub(r"\s+", " ", s).strip(" ,-–")


def parse_ingredient(line):
    line = line.strip()
    return {
        "raw": line,
        "name": clean_name(line),
        "grams": parse_grams(line),
        "qty": parse_qty(line),
    }


_UNIT_WORD_RE = re.compile(
    r"^\s*(PL|ČL|dcl|dl|ml|ks|kus|krajec|balenie|miska|porcia|plátok|strúčik|"
    r"kocka|naberačka|hrnček|šálka|trojuholník|palacinka|guľka|gulička|"
    r"tyčinka|lyžica|lyžička)\b", re.IGNORECASE)

def is_ingredient_start(line):
    """
    True if a line starts a new ingredient: leading quantity, OR a leading
    unit word (e.g. 'ks syr mozzarella' — count dropped but still its own item).
    A line with neither (e.g. 'chocolate (20 g)') is a wrapped continuation.
    """
    return bool(re.match(r"^\s*[\d½⅓⅔¼¾]", line)) or bool(_UNIT_WORD_RE.match(line))


def join_continuations(lines):
    """Merge wrapped ingredient lines (continuation = no qty prefix)."""
    out = []
    for ln in lines:
        if out and not is_ingredient_start(ln):
            out[-1] = (out[-1] + " " + ln).strip()
        else:
            out.append(ln)
    return out


def parse_recipe(num, block, slot):
    """Turn one raw recipe block into a structured dict."""
    title = clean_title(block[0][1])
    title_extra = block[0][2]
    warnings = []

    # ── find prep time (title-row extras first) ──
    prep = None
    for ex in title_extra:
        m = TIME_RE.search(ex)
        if m:
            prep = int(m.group(1)); break

    SECTIONS = {
        "main_postup": [], "main_ing": [], "extra_ing": [],
        "sub_postup": [], "sub_ing": [], "napoje": [], "marinade_ing": [],
    }
    alts = []          # list of [lines] — one per ALTERNATÍVA block
    sub_postup_name = None
    sub_ing_name = None
    state = None
    for kind, cell, extra in block[1:]:
        line = cell.strip()
        if not line:
            continue
        # prep time on its own row
        if prep is None and TIME_ONLY_RE.match(line):
            prep = int(TIME_RE.search(line).group(1)); continue
        # ── headers ──
        m = SUB_POSTUP_RE.match(line)
        if m:
            state = "sub_postup"; sub_postup_name = m.group(2).strip(); continue
        if POSTUP_RE.match(line):
            state = "main_postup"; continue
        if MARINADE_ING_RE.match(line):
            state = "marinade_ing"; continue
        m = ALT_ING_RE.match(line)
        if m:
            alts.append([]); state = "alt"; continue
        m = SUB_ING_RE.match(line)
        if m:
            state = "sub_ing"; sub_ing_name = m.group(1).strip(); continue
        if ING_RE.match(line):
            state = "main_ing"; continue
        m = EXTRA_RE.match(line)
        if m:
            state = "extra_ing"
            if m.group(1).strip():            # inline content after the colon
                SECTIONS["extra_ing"].append(m.group(1).strip())
            continue
        if NAPOJE_RE.match(line):
            state = "napoje"; continue
        # ── body ──
        if state == "alt":
            alts[-1].append(line)
        elif state in SECTIONS:
            SECTIONS[state].append(line)

    is_batch = bool(SECTIONS["sub_ing"])
    has_alts = len(alts) > 0
    outer = join_continuations(SECTIONS["main_ing"])

    # ── ingredients = what the client actually eats ──
    if is_batch:
        # outer block = the eaten portion. If absent (#6 Muffiny), the recipe
        # IS the bare batch, so fall back to the batch list.
        ing_lines = outer if outer else join_continuations(SECTIONS["sub_ing"])
    elif has_alts:
        ing_lines = join_continuations(alts[0])                  # alternative 1
    else:
        ing_lines = list(outer)
    for x in SECTIONS["marinade_ing"]:                           # marinade folds in
        ing_lines.append(x)
    ingredients = [parse_ingredient(x) for x in ing_lines]

    # ── sub-recipe (full batch) kept separately for macro scaling ──
    sub_recipe = None
    if is_batch:
        batch_ings = [parse_ingredient(x)
                      for x in join_continuations(SECTIONS["sub_ing"])]
        batch_total = sum(i["grams"] or 0 for i in batch_ings)
        sub_recipe = {
            "name": sub_ing_name or title,
            "ingredients": batch_ings,
            "total_grams": batch_total,
            "method": " ".join(SECTIONS["sub_postup"]) or None,
        }
        # mark the outer ingredient line(s) that reference the sub-component.
        # fuzzy: significant-word overlap (tolerates typos like dresing/dressing
        # only partially — main lever is shared 4+ char words)
        def sig_words(s):
            return {w for w in re.findall(r"\w{4,}", s.lower())}
        sub_words = sig_words(sub_ing_name or title) | sig_words(title)
        sub_clean = clean_name(sub_ing_name or title).lower()
        for ing in ingredients:
            nm_words = sig_words(ing["raw"])
            overlap = sub_words & nm_words
            fuzzy = SequenceMatcher(None, sub_clean,
                                    clean_name(ing["raw"]).lower()).ratio()
            if (re.search(r"\bporci[ae]\b", ing["raw"], re.IGNORECASE)
                    or len(overlap) >= 2
                    or fuzzy >= 0.6
                    or (sub_words and overlap == sub_words)):
                ing["is_sub_component"] = True

    # ── instructions ──
    parts = []
    if SECTIONS["main_postup"]:
        parts.append(" ".join(SECTIONS["main_postup"]))
    if sub_recipe and sub_recipe["method"]:
        parts.append(f"Príprava — {sub_recipe['name']}: {sub_recipe['method']}")
    if sub_recipe and sub_recipe["ingredients"]:
        batch_list = "; ".join(i["raw"] for i in sub_recipe["ingredients"])
        parts.append(f"Na celú várku ({sub_recipe['name']}) potrebuješ: {batch_list}")
    if has_alts and len(alts) > 1:
        for i, a in enumerate(alts[1:], start=2):
            parts.append(f"Alternatíva {i}: " + "; ".join(join_continuations(a)))
    if SECTIONS["napoje"]:
        parts.append("Nápoj: " + "; ".join(SECTIONS["napoje"]))
    if SECTIONS["extra_ing"]:
        parts.append("Ďalšie ingrediencie: " + " ".join(SECTIONS["extra_ing"]))
    instructions = "\n\n".join(p for p in parts if p.strip())

    return {
        "src_num": num,
        "slot": slot,
        "name": title,
        "prep_minutes": prep,
        "instructions": instructions,
        "ingredients": ingredients,
        "is_batch": is_batch,
        "has_alternatives": has_alts,
        "sub_recipe": sub_recipe,
        "extra_ingredients": " ".join(SECTIONS["extra_ing"]) or None,
        "_warnings": warnings,
    }


# ── data-error patches applied to raw blocks before parsing ───────────────
def patch_block(slot, num, block):
    """Fix the 3 known data errors in-place. Returns patched block."""
    out = []
    for kind, cell, extra in block:
        line = cell.strip()
        # hlavne #110 — truncated cesnak line
        if slot == "hlavne" and num == 110 and line.startswith("2 strúčik cesnak (6"):
            cell = "2 strúčik cesnak (6 g)"
        # hlavne #122 — truncated jarná cibuľka line
        if slot == "hlavne" and num == 122 and "jarná cibuľka (22" in line and not line.rstrip().endswith(")"):
            cell = "1⁄2 x kus (40 cm) jarná cibuľka (22 g)"
        out.append((kind, cell, extra))
    # ranajky #30 — two ingredients merged on one line
    if slot == "ranajky" and num == 30:
        fixed = []
        for kind, cell, extra in out:
            if "syr eidam, 30 % t. v s. 1⁄2 dl mlieko" in cell:
                fixed.append((kind, "30 g syr eidam, 30 % t. v s.", extra))
                fixed.append((kind, "1⁄2 dl mlieko polotučné (50 g)", extra))
            else:
                fixed.append((kind, cell, extra))
        out = fixed
    # hlavne #48 — missing INGREDIENCIE header: inject before first ingredient row
    if slot == "hlavne" and num == 48:
        fixed = []
        injected = False
        seen_postup = False
        for idx, (kind, cell, extra) in enumerate(out):
            line = cell.strip()
            if POSTUP_RE.match(line):
                seen_postup = True
            # first ingredient-looking row after postup, not a header
            if (not injected and seen_postup and line
                    and re.match(r"^\d", line)
                    and parse_grams(line) is not None
                    and not POSTUP_RE.match(line)):
                fixed.append(("row", "INGREDIENCIE", []))
                injected = True
            fixed.append((kind, cell, extra))
        out = fixed
    return out


def main():
    all_recipes = []
    stats = {}
    for fname, slot in CARDS:
        rows = read_card(SRC / fname)
        raw = split_recipes(rows)
        kept = 0
        for num, block in raw:
            if num in DROP[slot]:
                continue
            if slot == "ranajky" and num in DROP_RANAJKY_NUM:
                continue
            block = patch_block(slot, num, block)
            rec = parse_recipe(num, block, slot)
            all_recipes.append(rec)
            kept += 1
        stats[slot] = {"raw": len(raw), "kept": kept}

    OUT.write_text(json.dumps(all_recipes, ensure_ascii=False, indent=2), encoding="utf-8")

    print("=== PARSE SUMMARY ===")
    for slot, s in stats.items():
        print(f"  {slot:9s}  raw={s['raw']:4d}  kept={s['kept']:4d}")
    print(f"  TOTAL kept: {len(all_recipes)}")

    # sanity checks
    print("\n=== SANITY CHECKS ===")
    no_prep = [r for r in all_recipes if r["prep_minutes"] is None]
    print(f"  recipes with no prep_minutes: {len(no_prep)}  {[(r['slot'],r['src_num'],r['name']) for r in no_prep]}")
    no_instr = [r for r in all_recipes if not r["instructions"].strip()]
    print(f"  recipes with empty instructions: {len(no_instr)}  {[(r['slot'],r['src_num']) for r in no_instr]}")
    no_ing = [r for r in all_recipes if not r["ingredients"]]
    print(f"  recipes with no ingredients: {len(no_ing)}  {[(r['slot'],r['src_num']) for r in no_ing]}")
    no_grams = []
    for r in all_recipes:
        miss = [i["raw"] for i in r["ingredients"] if i["grams"] is None]
        if miss:
            no_grams.append((r["slot"], r["src_num"], miss))
    print(f"  recipes with ingredient(s) missing grams: {len(no_grams)}")
    for slot, num, miss in no_grams:
        print(f"    {slot} #{num}: {miss}")
    batch = [r for r in all_recipes if r["is_batch"]]
    print(f"  batch (bábovka) recipes: {len(batch)}")
    no_subcomp = [(r['slot'], r['src_num'], r['name']) for r in batch
                  if not any(i.get("is_sub_component") for i in r["ingredients"])]
    print(f"  batch recipes where sub-component line not matched: {len(no_subcomp)}")
    for x in no_subcomp:
        print(f"    {x}")
    bad_batch = [(r['slot'], r['src_num']) for r in batch
                 if r['sub_recipe'] and r['sub_recipe']['total_grams'] == 0]
    print(f"  batch recipes with 0-gram batch total: {len(bad_batch)}  {bad_batch}")
    alt = [r for r in all_recipes if r["has_alternatives"]]
    print(f"  recipes with alternatives: {len(alt)}  {[(r['slot'],r['src_num']) for r in alt]}")


if __name__ == "__main__":
    main()
