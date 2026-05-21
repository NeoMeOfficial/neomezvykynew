#!/usr/bin/env python3
"""
NeoMe food database — per-100g macros for macro computation.

Values are per 100 g of the ingredient AS USED in the recipe (raw weight,
since the source CSVs give raw-state grams). Sources: standard EU/SK food
composition tables, rounded.

  kcal, p (protein g), c (carbs g), f (fat g), fiber (g)

match(name, raw) → (food_dict | None). Matching is keyword-substring based;
the longest matching keyword wins. `raw` is consulted to pick cooked vs raw
variants for rice / pasta / pulses.
"""
import re, unicodedata

# ── food table — list of (keywords, kcal, p, c, f, fiber) ─────────────────
# keywords are lowercase, accent-insensitive substrings; order does not
# matter (longest match wins).
FOODS = [
    # ── oils & fats ──
    (["olivovy olej", "olej olivovy"], 884, 0, 0, 100, 0),
    (["repkovy olej"], 884, 0, 0, 100, 0),
    (["sezamovy olej"], 884, 0, 0, 100, 0),
    (["lanovy olej"], 884, 0, 0, 100, 0),
    (["tekvicovy olej", "olej tekvicovy"], 884, 0, 0, 100, 0),
    (["kokosovy olej"], 892, 0, 0, 100, 0),
    (["zivocisne maslo"], 717, 0.9, 0.7, 81, 0),
    (["ghee maslo"], 900, 0, 0, 100, 0),
    (["bravcova mast"], 900, 0, 0, 100, 0),

    # ── dairy & eggs ──
    (["jogurt bielkovinovy", "skyr"], 63, 11, 4, 0.2, 0),
    (["jogurt sojovy"], 50, 4, 2, 2.5, 0.5),
    (["jogurt kozi"], 70, 3.6, 4.5, 4, 0),
    (["jogurt gazdovsky", "jogurt cucoriedkovy"], 92, 3, 13, 3, 0),
    (["grecky jogurt"], 80, 6, 4, 4, 0),
    (["jogurt biely zivy"], 61, 4, 5, 3, 0),
    (["jogurt biely", "jogurt"], 60, 4.5, 5.5, 1.8, 0),
    (["tvaroh tucny"], 160, 11, 3, 11, 0),
    (["tvaroh"], 100, 12, 3.5, 4.5, 0),
    (["cottage cheese", "cottage"], 98, 11, 3.4, 4.3, 0),
    (["mlieko polotucne", "mlieko polotucne 1"], 47, 3.4, 4.8, 1.5, 0),
    (["mlieko plnotucne"], 64, 3.3, 4.7, 3.6, 0),
    (["mandlove mlieko"], 15, 0.5, 0.6, 1.1, 0.3),
    (["sojove mlieko"], 33, 3.3, 1.2, 1.8, 0.5),
    (["kokosove mlieko", "kokosovy napoj", "kokosovy krem"], 73, 0.7, 2, 7, 0),
    (["acidko", "kyslomliecny napoj"], 42, 3.3, 4.6, 1, 0),
    (["smotana 33", "slahacka"], 337, 2.3, 3.3, 33, 0),
    (["smotana kysla"], 140, 2.6, 4, 12, 0),
    (["sojova smotana"], 60, 1.5, 1.5, 5.5, 0),
    (["smotana"], 127, 2.8, 4, 12, 0),
    (["parmezan"], 392, 36, 3.2, 26, 0),
    (["mozzarella"], 250, 18, 2.2, 19, 0),
    (["balkansky syr"], 260, 14, 1, 22, 0),
    (["feta"], 264, 14, 4, 21, 0),
    (["bryndza", "ovcia bryndza"], 200, 16, 2, 14, 0),
    (["kozi syr makky"], 290, 19, 2, 23, 0),
    (["kozi syr tvrdy", "kozi syr"], 360, 22, 1, 30, 0),
    (["syr encian", "hermelin", "camembert"], 300, 20, 1, 24, 0),
    (["halloumi"], 330, 22, 2, 26, 0),
    (["eidam hranol udeny", "eidam udeny"], 280, 26, 1, 19, 0),
    (["syr eidam", "eidam"], 280, 26, 1, 18, 0),
    (["tvrdy syr"], 260, 30, 0, 15, 0),
    (["lucina skyr"], 130, 9, 4, 8, 0),
    (["cream cheese spread"], 130, 9, 5, 8, 0),
    (["makky nezrejuci syr", "lucina"], 230, 6, 3, 22, 0),
    (["niva"], 350, 21, 0, 29, 0),
    (["slepaci bielok", "vajecny bielok"], 52, 11, 0.7, 0.2, 0),
    (["vajce na tvrdo", "slepacie vajce", "vajce", "vajicko"], 143, 13, 1.1, 9.5, 0),

    # ── meat & fish ──
    (["kuracie prsia"], 110, 23, 0, 1.5, 0),
    (["morcacie prsia"], 105, 24, 0, 1, 0),
    (["morcacie stehno"], 130, 20, 0, 5, 0),
    (["kuracie stehno", "kuracie stehna"], 180, 18, 0, 12, 0),
    (["morcacia sunka"], 110, 18, 1.5, 3, 0),
    (["hydinova sunka"], 110, 17, 2, 3.5, 0),
    (["bravcova sunka"], 110, 18, 1, 4, 0),
    (["bravcova panenska", "bravcova svieckovica"], 143, 21, 0, 6, 0),
    (["hovadzia svieckovica"], 130, 21, 0, 5, 0),
    (["hovadzie maso mlete"], 200, 18, 0, 14, 0),
    (["losos peceny"], 230, 25, 0, 14, 0),
    (["losos"], 208, 20, 0, 13, 0),
    (["pstruh"], 140, 20, 0, 6, 0),
    (["sumcek", "sumec"], 105, 16, 0, 4, 0),
    (["tuniak"], 110, 25, 0, 1, 0),
    (["sardinky"], 180, 22, 0, 10, 0),
    (["krevety"], 99, 21, 0.2, 1.4, 0),
    # bone-in stewing hen (carcass weight) — ~50 % edible yield, so per 100 g
    # of the half-hen the usable meat contributes far less than pure meat
    (["sliepka domaca"], 105, 10, 0, 7.5, 0),

    # ── plant proteins ──
    (["sojovy syr tofu", "tofu"], 120, 12, 1.5, 7, 1),
    (["seitan"], 140, 25, 4, 2, 1),
    (["smakoun"], 75, 14, 1, 1.5, 0),
    (["hrachovy protein", "konopny protein", "vegansky protein",
      "protein v prasku", "protein"], 375, 73, 9, 6, 3),
    (["lahodkove drozdie"], 350, 50, 35, 5, 20),
    (["drozdie"], 105, 8, 12, 2, 7),

    # ── vegetables ──
    (["cesnak"], 149, 6, 30, 0.5, 2),
    (["jarna cibulka", "jarna cibula"], 32, 1.8, 7, 0.2, 2.6),
    (["cervena cibula"], 40, 1.1, 9, 0.1, 1.7),
    (["cibula"], 40, 1.1, 9, 0.1, 1.7),
    (["cherry paradajky", "rajciny", "paradajky", "rajciny/paradajky"],
     18, 0.9, 3.9, 0.2, 1.2),
    (["paprika"], 31, 1, 6, 0.3, 2.1),
    (["sterilizovana mrkva"], 25, 0.7, 5, 0.2, 2),
    (["mrkva"], 41, 0.9, 10, 0.2, 2.8),
    (["uhorky zavarane", "uhorky kysle"], 11, 0.3, 2.3, 0.2, 1),
    (["uhorky", "uhorka"], 15, 0.7, 3.6, 0.1, 0.5),
    (["baby spenat", "spenat listovy", "spenat"], 23, 2.9, 3.6, 0.4, 2.2),
    (["ladovy salat", "salat hlavkovy"], 14, 0.9, 3, 0.1, 1.2),
    (["rukola"], 25, 2.6, 3.7, 0.7, 1.6),
    (["polnicek"], 21, 2, 3.6, 0.4, 1.8),
    (["redkovka"], 16, 0.7, 3.4, 0.1, 1.6),
    (["cuketa", "cukina"], 17, 1.2, 3.1, 0.3, 1),
    (["tekvica hokkaido", "tekvica"], 40, 1, 9, 0.1, 2.5),
    (["baklazan"], 25, 1, 6, 0.2, 3),
    (["brokolica"], 34, 2.8, 7, 0.4, 2.6),
    (["karfiol"], 25, 1.9, 5, 0.3, 2),
    (["kel"], 35, 2.5, 6, 0.5, 3),
    (["kapusta hlavkova cervena", "kapusta cervena"], 31, 1.4, 7, 0.2, 2.1),
    (["kapusta cinska"], 13, 1.2, 2.2, 0.2, 1.2),
    (["kvasena", "kysla kapusta"], 19, 0.9, 4, 0.1, 2.9),
    (["kalerab"], 27, 1.7, 6, 0.1, 3.6),
    (["zeler"], 42, 1.5, 9, 0.3, 1.8),
    (["petrzlen"], 36, 3, 6, 0.8, 3.3),
    (["por"], 61, 1.5, 14, 0.3, 1.8),
    (["spargla"], 20, 2.2, 3.9, 0.1, 2.1),
    (["sampinony", "peciarka", "hrib"], 22, 3, 3.3, 0.3, 1),
    (["hliva"], 33, 3.3, 6, 0.4, 2.3),
    (["bataty", "sladke zemiaky", "batat"], 86, 1.6, 20, 0.1, 3),
    (["zemiaky", "zemiak"], 77, 2, 17, 0.1, 2.2),
    (["kukurica"], 86, 3, 19, 1.2, 2.7),
    (["zeleninova zmes", "zeleninova zmes mrazena"], 60, 3, 11, 0.5, 3),
    (["cervena repa", "cvikla"], 43, 1.6, 10, 0.2, 2.8),
    (["chilli", "chili"], 40, 2, 9, 0.4, 1.5),
    (["olivy"], 145, 1, 4, 15, 3),
    (["medvedi cesnak"], 30, 2.4, 3, 0.3, 2),
    (["zazvor", "dumbier"], 80, 1.8, 18, 0.8, 2),

    # ── legumes ──
    (["biela fazula v rajcinovej", "fazula v rajcinovej"], 85, 5, 13, 0.5, 4),
    (["cervene fazulky v konzerve", "cervene fazulky"], 100, 7, 17, 0.5, 6),
    (["fazula biela", "biela fazula"], 280, 21, 50, 1.5, 15),
    (["fazulky edamame", "edamame"], 121, 12, 9, 5, 5),
    (["fazulka"], 35, 2, 7, 0.2, 3),
    (["cicer"], 130, 7, 22, 2, 6),
    (["sosovica"], 340, 24, 58, 1.5, 11),
    (["hrach suseny"], 340, 23, 60, 1.2, 22),
    (["hrach", "hrasok"], 81, 5, 14, 0.4, 5),

    # ── fruit ──
    (["banany", "banan"], 89, 1.1, 23, 0.3, 2.6),
    (["susene jablka"], 240, 1, 57, 0.3, 8),
    (["jablka", "jablko"], 52, 0.3, 14, 0.2, 2.4),
    (["mrazene jahody", "jahody", "jahoda"], 32, 0.7, 7.7, 0.3, 2),
    (["mrazene cucoriedky", "cucoriedky"], 57, 0.7, 14, 0.3, 2.4),
    (["mrazene maliny", "maliny"], 52, 1.2, 12, 0.7, 6.5),
    (["broskyne", "broskyna"], 39, 0.9, 10, 0.3, 1.5),
    (["hrusky", "hruska"], 57, 0.4, 15, 0.1, 3.1),
    (["limetka"], 30, 0.7, 11, 0.2, 2.8),
    (["citrony", "citron"], 29, 1, 9, 0.3, 2.8),
    (["pomarance", "pomaranc"], 47, 0.9, 12, 0.1, 2.4),
    (["mango"], 60, 0.8, 15, 0.4, 1.6),
    (["ananas"], 50, 0.5, 13, 0.1, 1.4),
    (["kiwi"], 61, 1.1, 15, 0.5, 3),
    (["melon"], 30, 0.6, 8, 0.2, 0.4),
    (["hrozno"], 69, 0.7, 18, 0.2, 0.9),
    (["mandarinky"], 53, 0.8, 13, 0.3, 1.8),
    (["hrozienka"], 299, 3, 79, 0.5, 3.7),
    (["datle"], 282, 2.5, 75, 0.4, 8),
    (["susene figy", "figy"], 249, 3, 64, 0.9, 10),
    (["susene hrusky"], 262, 1.9, 70, 0.6, 7),
    (["susene marhule"], 241, 3.4, 63, 0.5, 7),
    (["susene brusnice", "brusnice"], 308, 0.1, 82, 1.4, 5),
    (["marhule", "marhula"], 48, 1.4, 11, 0.4, 2),
    (["goji", "kustovnica"], 349, 14, 77, 0.4, 13),
    (["avokado"], 160, 2, 9, 15, 7),

    # ── nuts & seeds ──
    (["orechy vlasske"], 654, 15, 14, 65, 6.7),
    (["orechy lieskove"], 628, 15, 17, 61, 10),
    (["orechy kesu"], 553, 18, 30, 44, 3.3),
    (["orechy para"], 656, 14, 12, 66, 8),
    (["mandle"], 579, 21, 22, 50, 12.5),
    (["arasidy"], 567, 26, 16, 49, 8.5),
    (["pistacie"], 562, 20, 28, 45, 10),
    (["sezamove semena", "sezamove semienka"], 573, 18, 23, 50, 12),
    (["slnecnicove semena", "slnecnicove semienka"], 584, 21, 20, 51, 9),
    (["lanove semena", "lanove semienka"], 534, 18, 29, 42, 27),
    (["konopne semienka", "konopne semena"], 553, 32, 8, 49, 4),
    (["chia"], 486, 17, 42, 31, 34),
    (["tekvicove semena", "tekvicove semienka"], 559, 30, 11, 49, 6),
    (["mak"], 525, 18, 28, 42, 20),
    (["ovos, klicky", "ovos klicky", "klicky"], 380, 13, 66, 7, 10),

    # ── nut butters & spreads ──
    (["arasidove maslo"], 588, 25, 20, 50, 6),
    (["mandlove maslo"], 614, 21, 19, 56, 10),
    (["sezamove maslo", "tahini"], 595, 17, 21, 54, 9),
    (["pesto"], 450, 5, 6, 45, 2),
    (["hummus", "rastlinna natierka"], 230, 7, 14, 17, 6),
    (["kokos"], 660, 7, 24, 65, 16),

    # ── grains, flour, pasta, bread ──
    (["ovsene vlocky"], 370, 13, 60, 7, 10),
    (["kukuricne vlocky"], 357, 7, 84, 0.9, 3),
    (["ryzove vlocky"], 360, 7, 80, 1, 2),
    (["pohankove vlocky"], 350, 12, 65, 3, 8),
    (["quinoa vlocky", "quinoa"], 368, 14, 64, 6, 7),
    (["amarantove perlicky", "amarant"], 371, 14, 65, 7, 7),
    (["pseno"], 378, 11, 73, 4, 9),
    (["pohanka"], 343, 13, 72, 3.4, 10),
    (["ryzove rezance varene", "ryzove rezance"], 110, 1.8, 25, 0.2, 1),
    (["ryza"], 360, 7, 79, 0.6, 1.3),       # raw; cooked variant via raw-str
    (["cestoviny sosovicove"], 350, 25, 50, 2, 8),
    (["cestoviny grahamove", "cestoviny celozrnne", "makarony", "spagety"],
     340, 13, 64, 2.5, 8),
    (["kukuricne cestoviny", "cestoviny"], 357, 7, 79, 1.5, 2),
    (["kuskus"], 376, 13, 77, 0.6, 5),
    (["bulgur"], 342, 12, 76, 1.3, 18),
    (["tarhona"], 360, 12, 72, 2, 3),
    (["spaldova krupica", "pohankova krupica", "krupica"], 340, 11, 70, 2, 6),
    (["psenicna muka", "muka psenicna"], 364, 10, 76, 1, 2.7),
    (["spaldova", "spaldova muka"], 360, 13, 70, 2, 8),
    (["pohankova muka"], 335, 13, 71, 3, 10),
    (["kukuricna muka", "polenta"], 360, 7, 79, 1.5, 4),
    (["kokosova muka"], 400, 18, 22, 14, 38),
    (["gastanova muka", "muka gastanova", "gastanova"], 370, 6, 76, 4, 10),
    (["cicerova muka"], 387, 22, 58, 7, 11),
    (["panko struhanka", "struhanka"], 350, 12, 70, 4, 4),
    (["rozky grahamove"], 270, 9, 50, 4, 5),
    (["zemla viaczrnna", "zemla hamburgerova"], 280, 9, 48, 6, 4),
    (["knackebrot"], 350, 10, 68, 2, 16),
    (["bezkvasove pecivo", "maces"], 380, 11, 78, 1.5, 3),
    (["strudlove cesto"], 270, 7, 45, 7, 2),
    (["tortilla"], 300, 8, 50, 7, 4),
    (["chlieb zemiakovy"], 250, 7, 50, 2, 4),
    (["chlieb pohankovy"], 240, 8, 45, 3, 6),
    (["chlieb rascovy"], 250, 8, 48, 3, 5),
    (["chlieb kukuricny"], 230, 5, 45, 3, 3),
    (["chlieb celozrnny", "chlieb celozrnny psenicny",
      "chlieb celozrnny razny", "chlieb celozrnny graham", "chlieb celozrnny psenicny graham"],
     240, 9, 42, 3.5, 7),
    (["otruby ovsene"], 246, 17, 50, 7, 15),

    # ── sweeteners, cocoa, chocolate ──
    (["med"], 304, 0.3, 82, 0, 0.2),
    (["javorovy sirup"], 260, 0, 67, 0, 0),
    (["cakankovy sirup"], 180, 1, 65, 0, 25),
    (["trstinovy cukor", "kokosovy cukor", "vanilkovy cukor", "cukor"],
     385, 0, 98, 0, 0),
    (["karob", "rohovnik"], 222, 5, 88, 0.7, 40),
    (["kakaovy prasok, 12", "kakaovy prasok 12"], 350, 22, 50, 12, 25),
    (["kakaovy prasok", "kakao"], 228, 20, 58, 14, 33),
    (["cokolada"], 550, 8, 30, 42, 10),
    (["dzem"], 200, 0.5, 50, 0.1, 1),
    (["kremovy prasok", "zlaty klas"], 340, 0.5, 85, 0.5, 0),

    # ── condiments & misc ──
    (["sojova omacka"], 60, 8, 6, 0, 1),
    (["rybacia omacka"], 60, 8, 6, 0, 0),
    (["massaman kari pasta", "kari pasta"], 150, 3, 15, 8, 3),
    (["horcica"], 95, 5, 8, 5, 3),
    (["kecup bez cukru"], 50, 1.5, 9, 0.1, 1),
    (["kecup"], 110, 1, 26, 0.1, 0.4),
    (["paradajkovy pretlak", "pretlak"], 82, 4, 16, 0.5, 3),
    (["balsamico", "balzamiko"], 88, 0.5, 17, 0, 0),
    (["vinny ocot", "ocot"], 20, 0, 1, 0, 0),
    (["cmar"], 40, 3.3, 4.8, 0.9, 0),
    (["kukuricny skrob", "skrob"], 381, 0.3, 91, 0.1, 0.9),
    (["bezlepkova hraska", "hraska"], 350, 1, 85, 0.5, 1),
    (["kypriaci prasok", "prasok do peciva", "soda bikarbona", "jedla soda"],
     80, 0, 28, 0, 0),
    (["kava"], 2, 0.1, 0, 0, 0),
    (["skorica"], 247, 4, 81, 1.2, 53),
    (["kurkuma"], 312, 10, 67, 3, 22),
    (["korenie kari", "kari"], 325, 14, 56, 14, 33),
    (["susene paradajky"], 258, 14, 56, 3, 12),
    (["voda"], 0, 0, 0, 0, 0),
]

# spice / herb names that legitimately contribute ~0 macros (tiny amounts) —
# treated as "matched, zero" so they don't drag coverage_pct down.
ZERO_FOODS = [
    "soľ", "sol", "korenie", "bylinky", "bazalka", "oregano", "majoran",
    "tymian", "rasca", "pazitka", "vnat", "stevia", "vanilka", "vanilkovy struk",
    "badian", "klincek", "fenikel", "bobkovy list", "muskat", "garam masala",
    "novedrevo", "nove korenie", "gyros", "provensalske", "talianske",
    "grilovacie korenie", "papriková soľ", "morska sol", "himalajska",
    "zeleninova sol", "vegeta", "nori", "morske riasy", "medovka", "mata",
    "koriander", "petrzlenova vnat", "zerucha",
]


def _norm(s):
    """Lowercase + strip diacritics for accent-insensitive matching."""
    s = s.lower()
    s = "".join(c for c in unicodedata.normalize("NFD", s)
                if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", s).strip()


# pre-normalise keywords
_FOOD_INDEX = []
for kws, kcal, p, c, f, fiber in FOODS:
    for kw in kws:
        _FOOD_INDEX.append((_norm(kw), {"kcal": kcal, "p": p, "c": c,
                                        "f": f, "fiber": fiber}))
# longest keyword first → specific beats generic
_FOOD_INDEX.sort(key=lambda x: -len(x[0]))
_ZERO_NORM = [_norm(z) for z in ZERO_FOODS]


def match(name, raw=""):
    """
    Return per-100g macro dict for an ingredient, or None if unmatched.
    `raw` is consulted to switch rice/pasta/pulses to cooked values.
    """
    n = _norm(name)
    rawn = _norm(raw)
    if not n:
        return None
    # zero-macro spices/herbs
    for z in _ZERO_NORM:
        if z in n:
            return {"kcal": 0, "p": 0, "c": 0, "f": 0, "fiber": 0, "zero": True}
    # plain white yogurt — fat content varies per recipe; read it from `raw`
    if "jogurt" in n and not any(k in n for k in (
            "bielkov", "skyr", "grecky", "sojov", "kozi",
            "gazdovsk", "cucoriedk")):
        if "0,3" in rawn or "0.3" in rawn or "0,5" in rawn:
            return {"kcal": 38, "p": 4.5, "c": 5.8, "f": 0.3, "fiber": 0}
        if "3,5" in rawn or "3.5" in rawn:
            return {"kcal": 61, "p": 3.5, "c": 4.7, "f": 3.5, "fiber": 0}
        return {"kcal": 56, "p": 5.0, "c": 5.5, "f": 1.5, "fiber": 0}
    for kw, macro in _FOOD_INDEX:
        if kw in n:
            m = dict(macro)
            # cooked rice / pasta / pulses → ~⅓ the raw density
            cooked = ("varen" in rawn or "varen" in n) and "neuvaren" not in rawn
            is_grain = any(k in kw for k in ("ryza", "cestoviny", "makarony",
                                             "spagety", "kuskus", "bulgur",
                                             "sosovica", "tarhona", "krupy"))
            if cooked and is_grain and "rezance" not in kw:
                for k in ("kcal", "p", "c", "f", "fiber"):
                    m[k] = round(m[k] / 3.0, 2)
            return m
    return None
