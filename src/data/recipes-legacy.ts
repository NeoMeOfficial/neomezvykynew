// LEGACY recipe database (Spoonacular + old NeoMe CSV) — archived 2026-04-13
// Not used in production. Kept for review.
// Original: — last updated 2026-04-08T12:34:38.439Z
// Total recipes: 261
// Sources: Spoonacular API + NeoMe CSV database

export interface Recipe {
  id: string;
  title: string;
  category: 'ranajky' | 'obed' | 'vecera' | 'snack' | 'smoothie';
  description: string;
  prepTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: { name: string; amount: string }[];
  steps: string[];
  allergens: string[];
  dietary: string[];
  tags: string[];
  image: string;
  difficulty: 'easy' | 'medium';
  pdfPath?: string;
}

export const legacyRecipes: Recipe[] = [
  {
    "id": "spoon-945221",
    "title": "Ovsené sušienky s arašidovým maslom a banánom",
    "category": "ranajky",
    "description": "Ak chcete do svojho repertoáru pridať viac bezlepkových a bezmliečnych receptov, Sledujte, čo jem:",
    "prepTime": 45,
    "servings": 16,
    "calories": 103,
    "protein": 4,
    "carbs": 11,
    "fat": 5,
    "fiber": 1,
    "ingredients": [
      {
        "name": "banány",
        "amount": "2"
      },
      {
        "name": "skrátenie maslovej príchute",
        "amount": "1 tsp"
      },
      {
        "name": "Lupienky čiernej čokolády",
        "amount": "0.25 cup"
      },
      {
        "name": "2 polievkové lyžice krémového arašidového masla",
        "amount": "0.33333334 cup"
      },
      {
        "name": "orechy",
        "amount": "0.25 cup"
      },
      {
        "name": "ovsené vločky",
        "amount": "1.5 cups"
      },
      {
        "name": "nesladená jablková omáčka",
        "amount": "0.6666667 cup"
      },
      {
        "name": "Vanilkový extrakt",
        "amount": "1 tsp"
      },
      {
        "name": "vanilkový proteínový prášok",
        "amount": "1 scoop"
      }
    ],
    "steps": [
      "Predhrej rúru na 175 °C. Plech vystel papierom na pečenie.",
      "V miske roztlač banány vidličkou na hladkú kašu. Pridaj arašidové maslo, jablkovú omáčku a vanilkový extrakt — dobre premiešaj.",
      "Vsyp ovsené vločky, proteínový prášok a orechy. Rukami alebo lyžicou spoj do tuhého cesta.",
      "Pridaj čokoládové lupienky a jemne premiešaj. Z cesta tvaruj malé guľôčky (cca 16 ks) a ukladaj na plech — ľahko splošti.",
      "Peč 12–15 minút, kým okraje nezhnednú. Nechaj vychladnúť na plechu 5 minút, potom preložiť na mriežku."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/945221-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715569",
    "title": "Jahodový tvarohový koláč Čokoládové palacinky",
    "category": "ranajky",
    "description": "Potrebujete lakto ovo vegetariánske raňajky? Jahodový tvarohový koláč Čokoládové palacinky by mohli byť vynikajúcim",
    "prepTime": 40,
    "servings": 4,
    "calories": 618,
    "protein": 16,
    "carbs": 56,
    "fat": 38,
    "fiber": 4,
    "ingredients": [
      {
        "name": "smotanový syr",
        "amount": "8 oz"
      },
      {
        "name": "jahody,",
        "amount": "1.25 cup"
      },
      {
        "name": "Vanilkový extrakt",
        "amount": "1 tsp"
      },
      {
        "name": "citrónová šťava",
        "amount": "1 tsp"
      },
      {
        "name": "Sacharóza",
        "amount": "2 tbsp"
      },
      {
        "name": "múka",
        "amount": "1.5 cups"
      },
      {
        "name": "kakaový prášok",
        "amount": "0.25 cup"
      },
      {
        "name": "kóšer soľ",
        "amount": "0.125 tsp"
      },
      {
        "name": "vajce",
        "amount": "3"
      },
      {
        "name": "mlieka",
        "amount": "1.25 cups"
      }
    ],
    "steps": [
      "Ako si vyrobiť jahodovú krémovú syrovú náplň",
      "Do stredne veľkej miešacej misy pridajte smotanový syr, jahody, vanilkový extrakt, citrónovú šťavu a granulovaný cukor.",
      "Na miešanie ingrediencií použite ručný mixér, drevenú lyžicu alebo špachtľu.",
      "Ako rozmixovať čokoládové palacinky Ingrediencie",
      "Múku, cukor, kakaový prášok, soľ a vajcia zmiešajte do kuchynského robota alebo mixéra.",
      "Ak používate kuchynský robot, nechajte ho bežať, keď pridávate mlieko a vodu. Pokračujte v pulzovaní dobre premiešanej zmesi."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [
      "Mediterranean",
      "French",
      "European"
    ],
    "image": "https://img.spoonacular.com/recipes/715569-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-775666",
    "title": "Jablkové lívance s práškovým cukrom",
    "category": "ranajky",
    "description": "Jednoduché domáce jablkové lívance môžu byť práve raňajkami, ktoré hľadáte. Jedna časť tohto",
    "prepTime": 30,
    "servings": 12,
    "calories": 148,
    "protein": 2,
    "carbs": 34,
    "fat": 1,
    "fiber": 1,
    "ingredients": [
      {
        "name": "viacúčelová múka",
        "amount": "1 cup"
      },
      {
        "name": "jablko",
        "amount": "1 cup"
      },
      {
        "name": "kypriaci prášok",
        "amount": "1.5 teaspoons"
      },
      {
        "name": "škorica",
        "amount": "1 teaspoon"
      },
      {
        "name": "vajce",
        "amount": "1"
      },
      {
        "name": "mlieka",
        "amount": "0.33333334 cup"
      },
      {
        "name": "mlieka",
        "amount": "1.5 tablespoons"
      },
      {
        "name": "práškový cukor",
        "amount": "2 cups"
      },
      {
        "name": "Soli",
        "amount": "0.75 teaspoon"
      },
      {
        "name": "cukor",
        "amount": "0.25 cup"
      }
    ],
    "steps": [
      "V miske zmiešaj múku, kypriaci prášok, škoricu, soľ a cukor.",
      "V druhej miske rozšľahaj vajce s mliekom. Vmiešaj do suchých surovín len toľko, aby zmizli hrudky — nemiešaj príliš.",
      "Jablko olúp a nakrájaj nadrobno, primiešaj do cesta.",
      "Na panvici rozohrej maslo na strednom ohni. Nakladaj lyžicou porcie cesta, peč 2–3 minúty z každej strany, kým sa neobjaví bubliny a okraje nestuhtnú.",
      "Hotové lívance posyp práškovým cukrom a podávaj teplé."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/775666-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-640275",
    "title": "Krabie koláče - Vajcia Benedikt",
    "category": "ranajky",
    "description": "Krabie koláče Vajcia Benedikt trvá približne 30 minút od začiatku do konca. Jedna porcia tohto pokrmu c",
    "prepTime": 30,
    "servings": 3,
    "calories": 899,
    "protein": 42,
    "carbs": 42,
    "fat": 59,
    "fiber": 3,
    "ingredients": [
      {
        "name": "zeler",
        "amount": "0.5 cup"
      },
      {
        "name": "Strúhanka",
        "amount": "0.33333334 cup"
      },
      {
        "name": "vajce",
        "amount": "4"
      },
      {
        "name": "Mafiny",
        "amount": "3"
      },
      {
        "name": "knorr holandská omáčková zmes",
        "amount": "1 package"
      },
      {
        "name": "horúca omáčka",
        "amount": "3 drops"
      },
      {
        "name": "kusové krabie mäso",
        "amount": "1 pound"
      },
      {
        "name": "Majonéza",
        "amount": "0.5 cup"
      },
      {
        "name": "cibuľa",
        "amount": "0.5 cup"
      },
      {
        "name": "petržlen",
        "amount": "2 tablespoons"
      }
    ],
    "steps": [
      "Krabie mäso zmiešaj s majonézou, nasekanou cibuľou, zelerom, petržlenom a strúhankou. Ochutaj, pridaj kvapky tabaska. Vytvaruj 6 malých koláčikov.",
      "Koláčiky opekaj na rozohriateho masla 3–4 minúty z každej strany, kým nezezlatejú. Udržuj ich v teple v rúre pri 80 °C.",
      "Podľa návodu na obale priprav holandskú omáčku Knorr.",
      "Mafiny prepoľ a opekaj narezanou stranou nadol na suchej panvici do zlatista.",
      "Vajcia varí v miernom vriacom osolenej vode 3–4 minúty (vajcia pošíruj). Na každú halvicu mafiny uložiť krabí koláčik, pošírované vajce a polej holandskou omáčkou. Podávaj ihneď."
    ],
    "allergens": [],
    "dietary": [
      "pescatariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/640275-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-716432",
    "title": "Frittata muffiny",
    "category": "ranajky",
    "description": "Potraviny na prsty: Frittata Muffiny môžu byť dobrým receptom na rozšírenie vášho raňajkového repertoáru. Toto odporúčanie",
    "prepTime": 45,
    "servings": 1,
    "calories": 655,
    "protein": 49,
    "carbs": 13,
    "fat": 45,
    "fiber": 4,
    "ingredients": [
      {
        "name": "brokolica",
        "amount": "0.75 cup"
      },
      {
        "name": "pažítka,",
        "amount": "2 T"
      },
      {
        "name": "t krém",
        "amount": "1"
      },
      {
        "name": "vajce",
        "amount": "6"
      },
      {
        "name": "pomarančová paprika",
        "amount": "0.33333334 cup"
      },
      {
        "name": "soľ a korenie",
        "amount": "1 serving"
      },
      {
        "name": "Syr Cheddar",
        "amount": "0.5 cup"
      },
      {
        "name": "paradajka",
        "amount": "0.33333334 cup"
      }
    ],
    "steps": [
      "Predhrej rúru na 180 °C. Muffinový plech vymas maslom alebo vlož papierové košíčky.",
      "Brokolicu, papriku a paradajky nakrájaj nadrobno. Na panvici ich 2 minúty podus na tuku, ochuť soľou a korením.",
      "Vajcia rozšľahaj so smotanou. Primiešaj zeleninu, pažítku a strúhaný cheddar.",
      "Zmes rozvieš do muffinových jamiek (do ¾ výšky). Posyp zvyšným syrom.",
      "Peč 18–20 minút, kým vrch nezazlatí a stred nestuhne. Podávaj teplé alebo studené."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "lakto-ovo vegetariánske",
      "ketogénne"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716432-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-639637",
    "title": "Klasické maslové koláčiky",
    "category": "ranajky",
    "description": "Nikdy nemôžete mať príliš veľa európskych receptov, takže vyskúšajte klasické koláčiky. Táto raňajky má 398 c",
    "prepTime": 45,
    "servings": 4,
    "calories": 398,
    "protein": 9,
    "carbs": 61,
    "fat": 13,
    "fiber": 2,
    "ingredients": [
      {
        "name": "mlieka",
        "amount": "0.75 cup"
      },
      {
        "name": "Múka s prísadou kypriaceho prášku",
        "amount": "2 cups"
      },
      {
        "name": "jahodový džem a smotana",
        "amount": "4 servings"
      },
      {
        "name": "maslo",
        "amount": "50 g"
      }
    ],
    "steps": [
      "Predhrej rúru na 200 °C. Múku, kypriaci prášok a štipku soli preosej do misy.",
      "Studené maslo nakrájaj na kocky a vtrieraj do múky prstami, kým zmes nepripomína hrubú strúhanku.",
      "Pridaj mlieko a rýchlo spoj na mäkké, mierne lepivé cesto — príliš nemiešaj.",
      "Cesto vyvaľkaj na 2 cm hrúbku, vykrajuj kolieska alebo štvorce. Ukladaj na vymastaný plech.",
      "Peč 12–15 minút do zlatista. Podávaj so smotanou a džemom."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [
      "English",
      "British",
      "Scottish",
      "European"
    ],
    "image": "https://img.spoonacular.com/recipes/639637-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716276",
    "title": "Domáce drožďové šišky",
    "category": "ranajky",
    "description": "Ak máte približne 45 minút na strávenie v kuchyni, šišky môžu byť úžasnou lakto ovo vegetou",
    "prepTime": 45,
    "servings": 2,
    "calories": 430,
    "protein": 11,
    "carbs": 91,
    "fat": 2,
    "fiber": 3,
    "ingredients": [
      {
        "name": "múka",
        "amount": "1.5 cups"
      },
      {
        "name": "med",
        "amount": "30 ml"
      },
      {
        "name": "sušené mlieko",
        "amount": "1 tablespoon"
      },
      {
        "name": "Soli",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "teplá voda",
        "amount": "150 ml"
      },
      {
        "name": "droždie",
        "amount": "1 teaspoon"
      }
    ],
    "steps": [
      "Droždie rozmiešaj v teplej vode s medom. Nechaj 10 minút aktivovať, kým nezačne peniť.",
      "Múku so soľou a sušeným mliekom presej do misy. Vpracuj kvások a miešaj, kým vznikne hladké cesto.",
      "Prikry utierkou a nechaj kysnúť na teplom mieste 45–60 minút, kým nezdvojnásobí objem.",
      "Cesto vyvaľkaj na 1,5 cm, vykrajuj kolieska. Nechaj 15 minút odpočinúť.",
      "Šišky vysmažuj v oleji rozohriateho na 170 °C, 1–2 minúty z každej strany do zlatohnedej farby. Osuš na papieri a posyp práškovým cukrom."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716276-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716417",
    "title": "Jahodový koláč s vanilkovým krémom",
    "category": "ranajky",
    "description": "Jahodový koláč s mini jahodovými koláčikmi trvá približne 45 minút od začiatku do konca. Tento",
    "prepTime": 45,
    "servings": 4,
    "calories": 306,
    "protein": 4,
    "carbs": 45,
    "fat": 13,
    "fiber": 4,
    "ingredients": [
      {
        "name": "šálka ťažkej smotany na šľahanie",
        "amount": "1 Tbs"
      },
      {
        "name": "koláčové kôrkové cesto",
        "amount": "1"
      },
      {
        "name": "morská soľ",
        "amount": "1 pinch"
      },
      {
        "name": "jahody,",
        "amount": "1 lb"
      },
      {
        "name": "Jahodový džem",
        "amount": "0.25 cup"
      },
      {
        "name": "Vanilkový cukor",
        "amount": "1 tsp"
      }
    ],
    "steps": [
      "Predhrej rúru na 190 °C. Koláčové cesto rozvaľkaj a ulož do formy, okraje pritlač.",
      "Jahody umyj, osušiť a nakrájaj na plátky. V miske ich zmiešaj s džemom a vanilkovým cukrom.",
      "Šľahačkovú smotanu vyšľahaj s trochou vanilkového cukru do tuhej peny.",
      "Cesto zaslepo pečie 12 minút (s fazuľkami), potom stiahni závaží a dopeč 5 minút do zlatista.",
      "Vychladnutý základ potrieť džemom, rozložiť jahodovú zmes a na vrch uložiť šľahačku. Posyp morskou soľou a podávaj ihneď."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716417-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-632928",
    "title": "Špargľové vajcia Benedikt s holandskou omáčkou",
    "category": "ranajky",
    "description": "Špargľové vajcia Benedikt trvá približne 30 minút od začiatku do konca. Tento recept robí 2 se",
    "prepTime": 30,
    "servings": 2,
    "calories": 780,
    "protein": 35,
    "carbs": 31,
    "fat": 57,
    "fiber": 3,
    "ingredients": [
      {
        "name": "špargľové výhonky",
        "amount": "4 ounces"
      },
      {
        "name": "maslo",
        "amount": "0.33333334 cup"
      },
      {
        "name": "Kajenské korenie",
        "amount": "1 pinch"
      },
      {
        "name": "Vaječné žĺtky",
        "amount": "3 large"
      },
      {
        "name": "vajce",
        "amount": "4 large"
      },
      {
        "name": "Mafiny",
        "amount": "2"
      },
      {
        "name": "Šunka",
        "amount": "4 slices"
      },
      {
        "name": "citrónová šťava",
        "amount": "1 tablespoon"
      },
      {
        "name": "Soli",
        "amount": "0.25 teaspoon"
      }
    ],
    "steps": [
      "Špargliu blanšíruj v osolenej vriacej vode 2–3 minúty, potom stiahni do ľadovej vody. Osuš.",
      "Holandskú omáčku priprav: žĺtky s citrónovou šťavou šľahaj nad parou, kým nezhustnú. Po trochách vlievaj rozpustené maslo a šľahaj do hladka. Ochuť soľou a kajenským korením.",
      "Mafiny prepoľ a opekaj narezanou stranou nadol do zlatista. Šunku opekaj na panvici 1 minútu.",
      "Vajcia pošíruj v miernom vriacom osolenej vody 3–4 minúty.",
      "Na každú halvicu mafiny uložiť šunku, špargliu, pošírované vajce a polej holandskou omáčkou. Podávaj ihneď."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/632928-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-794350",
    "title": "Smoothie s čerešňovým kokosovým mliekom",
    "category": "ranajky",
    "description": "Cherry Coconut Milk Smoothie je bezlepkové, bez mliečnych výrobkov, paleolitické a lakto ovo vegetariánske rec",
    "prepTime": 45,
    "servings": 2,
    "calories": 305,
    "protein": 4,
    "carbs": 38,
    "fat": 17,
    "fiber": 5,
    "ingredients": [
      {
        "name": "banán",
        "amount": "1"
      },
      {
        "name": "čerešne",
        "amount": "2 cups"
      },
      {
        "name": "kokosové mlieko",
        "amount": "0.6666667 cup"
      },
      {
        "name": "konopné mlieko",
        "amount": "0.33333334 cup"
      },
      {
        "name": "vanilka",
        "amount": "1 teaspoon"
      }
    ],
    "steps": [
      "Zmiešajte všetky ingrediencie v mixéri a spracujte do hladka. Pridajte trochu viac mandľového alebo konopného mlieka, ak je zmes príliš hustá. Tip: Ak chcete zmraziť banány na smoothies, ošúpte banán a nakrájajte na plátky. Plátky položíme na plech vyložený pergamenovým papierom a zmrazíme. Po zmrazení preneste do nádoby alebo vrecka vhodného do mrazničky. Banány dobre zamrznú až na 4 až 6 mesiacov."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka",
      "paleo",
      "lakto-ovo vegetariánske",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/794350-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716407",
    "title": "Jednoduché celozrnné palacinky",
    "category": "ranajky",
    "description": "Jednoduché celozrnné palacinky môžu byť práve raňajkami, ktoré hľadáte. Tento recept robí 4 ser",
    "prepTime": 45,
    "servings": 4,
    "calories": 272,
    "protein": 10,
    "carbs": 27,
    "fat": 14,
    "fiber": 3,
    "ingredients": [
      {
        "name": "maslo",
        "amount": "3 Tablespoons"
      },
      {
        "name": "vajce",
        "amount": "3"
      },
      {
        "name": "javorový sirup",
        "amount": "1 Tablespoon"
      },
      {
        "name": "mlieka",
        "amount": "1 cup"
      },
      {
        "name": "morská soľ",
        "amount": "1 pinch"
      },
      {
        "name": "múka",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Všetky ingrediencie vložte do mixéra a mixujte do hladka. Cesto by malo byť tenké. Nechajte ho aspoň 30 minút - alebo dokonca cez noc. Keď príde čas na varenie vašich krepov, môžete to urobiť tradičným spôsobom, na krepovej panvici, alebo môžete použiť elektrický krepovač."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [
      "Mediterranean",
      "French",
      "European"
    ],
    "image": "https://img.spoonacular.com/recipes/716407-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716379",
    "title": "Čokoládovo-kokosový banánový chlieb",
    "category": "ranajky",
    "description": "Čokoládový kokosový banánový chlieb môže byť práve raňajkami, ktoré hľadáte. Tento recept",
    "prepTime": 45,
    "servings": 20,
    "calories": 320,
    "protein": 4,
    "carbs": 58,
    "fat": 9,
    "fiber": 2,
    "ingredients": [
      {
        "name": "viacúčelová múka",
        "amount": "2.6666667 cups"
      },
      {
        "name": "kypriaci prášok",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "sóda bikarbóna",
        "amount": "0.25 teaspoon"
      },
      {
        "name": "banány",
        "amount": "4"
      },
      {
        "name": "maslo",
        "amount": "9 tablespoon"
      },
      {
        "name": "kokosové vločky",
        "amount": "0.5 cup"
      },
      {
        "name": "vajce",
        "amount": "4"
      },
      {
        "name": "Soli",
        "amount": "1 pinch"
      },
      {
        "name": "polosladké čokoládové lupienky",
        "amount": "0.5 cup"
      },
      {
        "name": "cukor",
        "amount": "3.6666667 cups"
      }
    ],
    "steps": [
      "Mokré ingrediencie zmiešajte v miske. Suché ingrediencie zmiešajte v samostatnej miske okrem kokosových vločiek a čokoládových lupienkov. Rúru predhrejte na teplotu 375 °C. Zmiešajte mokré aj suché ingrediencie a vyšľahajte, kým zmes nebude hladká. Pekáče vymastite trochou oleja a zmes nalejte do pekáčov (tento recept postačí na dva bochníky). Pridajte čokoládové lupienky a kokosové vločky. Vložte do rúry a pečte 30-35 minút. Podávajte teplé s čajom alebo kávou."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716379-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-639594",
    "title": "Klasické vajcia Benedikt",
    "category": "ranajky",
    "description": "Klasické vajcia Benedikt môže byť práve raňajkami, ktoré hľadáte. Tento recept slúži 4. Pre 8",
    "prepTime": 45,
    "servings": 4,
    "calories": 198,
    "protein": 14,
    "carbs": 14,
    "fat": 9,
    "fiber": 1,
    "ingredients": [
      {
        "name": "knorr holandská omáčka",
        "amount": "1 package"
      },
      {
        "name": "kanadská slanina",
        "amount": "4 Slices"
      },
      {
        "name": "Mafiny",
        "amount": "2"
      },
      {
        "name": "ocot",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "vajce",
        "amount": "4"
      }
    ],
    "steps": [
      "Pripravte si holandskú omáčku Knorr podľa pokynov na obale.",
      "Hnedá kanadská slanina na panvici a opečené anglické muffiny. Kým sa slanina varí, uvarte vajíčka.",
      "Naplňte stredne veľkú panvicu do polovice vodou. Pridajte 1/2 čajovej lyžičky bieleho octu (toto je voliteľné, ale ocot pomáha držať vajce pohromade). Priveďte do mierneho varu a opatrne pridajte vajcia (najlepšie 1-2 naraz). Vajcia varte 2-3 minúty alebo kým sa žĺtok neupraví podľa vašich preferencií. Odstráňte vajcia po jednom pomocou štrbinovej lyžice.",
      "Vrstvové ingrediencie nasledovne: anglický muffin, kanadská slanina, vajcia, holandská omáčka."
    ],
    "allergens": [],
    "dietary": [
      "bez mlieka"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/639594-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-649777",
    "title": "Polentové palacinky s čučoriedkovým sirupom",
    "category": "ranajky",
    "description": "Polentové palacinky s citrónovou vôňou a čučoriedkovým tymiánovým sirupom trvajú približne 45 minút od začiatku do konca",
    "prepTime": 45,
    "servings": 12,
    "calories": 316,
    "protein": 3,
    "carbs": 38,
    "fat": 17,
    "fiber": 2,
    "ingredients": [
      {
        "name": "viacúčelová múka",
        "amount": "1 cup"
      },
      {
        "name": "kypriaci prášok",
        "amount": "1 teaspoon"
      },
      {
        "name": "čučoriedky",
        "amount": "2 cups"
      },
      {
        "name": "maslo",
        "amount": "1 cup"
      },
      {
        "name": "Kukuričná múka",
        "amount": "0.5 cup"
      },
      {
        "name": "vajce",
        "amount": "1"
      },
      {
        "name": "tymián",
        "amount": "3 sprigs"
      },
      {
        "name": "med",
        "amount": "1.5 tablespoons"
      },
      {
        "name": "citrónová kôra",
        "amount": "1"
      },
      {
        "name": "javorový sirup",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Priprav sirup: čučoriedky, javorový sirup a tymián prevariť v hrnci 5 minút na miernom ohni, kým čučoriedky nepraskú. Odlož.",
      "Zmiešaj múku, kukuričnú múku, kypriaci prášok a soľ. V druhej miske rozšľahaj vajce s rozpusteným maslom, medom a citrónovou kôrou.",
      "Spoj suché a mokré suroviny, miešaj len do spojenia — hrudky sú v poriadku.",
      "Na panvici s maslom pečie porcie cesta na strednom ohni 2–3 minúty z každej strany do zlatista.",
      "Podávaj palacinky teplé preliaty čučoriedkovým sirupom."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/649777-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-756814",
    "title": "Silný mandľový Matcha Superfood Smoothie",
    "category": "ranajky",
    "description": "Powerhouse Almond Matcha Superfood Smoothie sú raňajky, ktoré slúžia 2. Jedna porcia obsahuje 289 c",
    "prepTime": 10,
    "servings": 2,
    "calories": 281,
    "protein": 10,
    "carbs": 34,
    "fat": 13,
    "fiber": 7,
    "ingredients": [
      {
        "name": "prírodné mandľové maslo",
        "amount": "2 tablespoons"
      },
      {
        "name": "mandľové mlieko",
        "amount": "1.5 cups"
      },
      {
        "name": "banán",
        "amount": "1 medium"
      },
      {
        "name": "chia semienka",
        "amount": "2 teaspoons"
      },
      {
        "name": "baby kapusta",
        "amount": "1 cup"
      },
      {
        "name": "kúsky manga",
        "amount": "0.5 cup"
      },
      {
        "name": "čajový prášok matcha",
        "amount": "1 tablespoon"
      },
      {
        "name": "Ananás",
        "amount": "0.75 cup"
      },
      {
        "name": "Vanilkový extrakt",
        "amount": "0.5 teaspoon"
      }
    ],
    "steps": [
      "Zmiešajte všetky ingrediencie v mixéri. Rozmixujte do hladka. Okamžite podávajte."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/756814-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-660368",
    "title": "Vajcia Benedikt s údeným lososom a kôprovým Hollandaise",
    "category": "ranajky",
    "description": "Údené lososové vajcia Benedikt s citrónovým kôprom Hollandaise by mohli byť len pescatariánskym receptom, ktorý ste",
    "prepTime": 45,
    "servings": 2,
    "calories": 540,
    "protein": 41,
    "carbs": 21,
    "fat": 33,
    "fiber": 4,
    "ingredients": [
      {
        "name": "detská rukola",
        "amount": "1 cup"
      },
      {
        "name": "baby špenát",
        "amount": "1 cup"
      },
      {
        "name": "maslo",
        "amount": "2 tablespoons"
      },
      {
        "name": "Vaječné žĺtky",
        "amount": "3 large"
      },
      {
        "name": "vajce",
        "amount": "4"
      },
      {
        "name": "kôpor",
        "amount": "1 tablespoon"
      },
      {
        "name": "citrón",
        "amount": "1"
      },
      {
        "name": "viaczrnný chlieb",
        "amount": "2 slices"
      },
      {
        "name": "soľ a korenie",
        "amount": "2 servings"
      },
      {
        "name": "Lososovácolor",
        "amount": "8 ounces"
      }
    ],
    "steps": [
      "Hollandaise: žĺtky šľahaj s citrónovou šťavou nad parou, až kým nezdvojnásobia objem. Odlož z tepla, po trochách vmieša rozpustené maslo. Ochuť kôprom, soľou a korením.",
      "Chlieb opekaj v tostovači alebo na grile do zlatista.",
      "Vajcia pošíruj v miernom vriacom osolenej vody 3 minúty.",
      "Na krajec chleba uložiť hrstičku rukoly a špenátu, na vrch plátky údeného lososa.",
      "Pridaj pošírované vajce, polej kôprovým Hollandaise a podávaj ihneď s kolieskami citróna."
    ],
    "allergens": [],
    "dietary": [
      "pescatariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/660368-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-652651",
    "title": "Palacinky z húb so smotanovou omáčkou",
    "category": "ranajky",
    "description": "Nikdy nemôžete mať príliš veľa receptov na raňajky, takže vyskúšajte hubové palacinky s vegetariánskou omáčkou.",
    "prepTime": 45,
    "servings": 8,
    "calories": 184,
    "protein": 7,
    "carbs": 24,
    "fat": 6,
    "fiber": 4,
    "ingredients": [
      {
        "name": "kukurica",
        "amount": "0.5 cup"
      },
      {
        "name": "pažítka,",
        "amount": "1 tbsp"
      },
      {
        "name": "kôpor",
        "amount": "0.5 cup"
      },
      {
        "name": "vajce",
        "amount": "2"
      },
      {
        "name": "3 strúčiky cesnaku",
        "amount": "2"
      },
      {
        "name": "Cesnak v prášku",
        "amount": "1 tsp"
      },
      {
        "name": "mletý koriander",
        "amount": "0.5 tsp"
      },
      {
        "name": "mletá paprika",
        "amount": "0.33333334 tsp"
      },
      {
        "name": "sérum",
        "amount": "0.5 cup"
      },
      {
        "name": "huby",
        "amount": "300 g"
      }
    ],
    "steps": [
      "Huby nakrájaj nadrobno. Na panvici ich opekaj s cesnakom na oleji 5 minút, kým sa odparí voda. Ochuť soľou, korením, koriandrom a paprikou.",
      "Do misy nasypaj kukuricu a kôpor, pridaj vajcia a srvátku. Vsyp hubovú zmes a premiešaj.",
      "Na panvici rozohrieť olej. Lyžicou nakladaj porcie zmesi, peč 3 minúty z každej strany do pevných okrajov.",
      "Na omáčku zahrej srvátku s trochou cesnaku a pažítky, prípadne zahustí lyžičkou múky. Ochuť soľou.",
      "Palacinky poukladaj na tanier a polej teplou smotanovou omáčkou."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [
      "Mediterranean",
      "French",
      "European"
    ],
    "image": "https://img.spoonacular.com/recipes/652651-556x370.",
    "difficulty": "medium"
  },
  {
    "id": "spoon-657917",
    "title": "Malinový kávový koláč s ovsou",
    "category": "ranajky",
    "description": "Malinový orechový kávový koláč môže byť práve raňajkami, ktoré hľadáte. Jedna porcia obsahuje",
    "prepTime": 35,
    "servings": 6,
    "calories": 190,
    "protein": 2,
    "carbs": 29,
    "fat": 7,
    "fiber": 2,
    "ingredients": [
      {
        "name": "mandľové mlieko",
        "amount": "1.25 cups"
      },
      {
        "name": "sóda bikarbóna",
        "amount": "1 tablespoon"
      },
      {
        "name": "škorica",
        "amount": "1 teaspoon"
      },
      {
        "name": "Ľanové semienko",
        "amount": "0.5 tablespoon"
      },
      {
        "name": "javorový sirup",
        "amount": "0.25 cup"
      },
      {
        "name": "ovsená múka",
        "amount": "0.25 cup"
      },
      {
        "name": "olej",
        "amount": "1 tablespoon"
      },
      {
        "name": "Malinový džem",
        "amount": "0.25 cup"
      },
      {
        "name": "Ovsené vločky",
        "amount": "0.25 cup"
      },
      {
        "name": "Soli",
        "amount": "0.5 teaspoon"
      }
    ],
    "steps": [
      "Predhrej rúru na 180 °C. Okrúhlu formu (20 cm) vymas olejom.",
      "V miske zmiešaj ovsenú múku, ovsené vločky, sódu, soľ a škoricu.",
      "V druhej miske vyšľahaj ľanové semienko s 1,5 PL vody (náhrada vajca). Pridaj mandľové mlieko, javorový sirup a olej.",
      "Spoj mokré a suché suroviny do hladkého cesta. Prelej do formy.",
      "Na povrch poukladaj lyžičky malinového džemu a vidličkou ich jemne prevíri do cesta. Peč 25–30 minút, kým špajdľa nevychádza čistá."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka",
      "fodmap"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/657917-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-645530",
    "title": "Smoothie so zeleným čajom a ovocím",
    "category": "ranajky",
    "description": "Green Tea Fruit Medley Smoothie je bezlepkový, lakto ovo vegetariánsky a prvotný recept so 4 ser",
    "prepTime": 45,
    "servings": 4,
    "calories": 45,
    "protein": 2,
    "carbs": 9,
    "fat": 1,
    "fiber": 1,
    "ingredients": [
      {
        "name": "vody",
        "amount": "1 cup"
      },
      {
        "name": "Čajové vrecúška",
        "amount": "3"
      },
      {
        "name": "lesné plody",
        "amount": "1 cup"
      },
      {
        "name": "Ananásová šťava",
        "amount": "0.25 cup"
      },
      {
        "name": "vanilkový jogurt",
        "amount": "0.5 cup"
      },
      {
        "name": "kocky ľadu",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Pripravte čaj ponorením 3 vrecúšok zeleného čaju Bigelow do 1 šálky vriacej vody počas 5 minút. Vytlačte vrecká a zlikvidujte ich.",
      "V mixéri zmiešajte čaj a zvyšné ingrediencie a rozmixujte do hladka."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "lakto-ovo vegetariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/645530-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-643859",
    "title": "Frittata s hubami, tymiánom a parmezánom",
    "category": "ranajky",
    "description": "Ak chcete do svojej receptovej škatule pridať viac bezlepkových receptov, Frittata s hubami, tymiánom a",
    "prepTime": 45,
    "servings": 8,
    "calories": 190,
    "protein": 21,
    "carbs": 9,
    "fat": 8,
    "fiber": 1,
    "ingredients": [
      {
        "name": "výmena vajec",
        "amount": "0.75 cup"
      },
      {
        "name": "vajce",
        "amount": "3 jumbo"
      },
      {
        "name": "huby",
        "amount": "16 ounces"
      },
      {
        "name": "Tymián, bobkové listy",
        "amount": "1.5 tablespoons"
      },
      {
        "name": "jarná cibuľka",
        "amount": "6"
      },
      {
        "name": "mletá paprika",
        "amount": "8 servings"
      },
      {
        "name": "pol a pol",
        "amount": "0.25 cup"
      },
      {
        "name": "syr parmigiano",
        "amount": "0.5 cup"
      },
      {
        "name": "Soli",
        "amount": "8 servings"
      }
    ],
    "steps": [
      "Predhrej rúru na 190 °C. Huby nakrájaj na plátky, jarné cibuľky nakrájaj.",
      "Na rúrou bezpečnej panvici rozohrei olej, opekaj huby 5 minút na silnom ohni, kým sa odparí šťava. Pridaj tymián a ochuť soľou a korením.",
      "Vajcia rozšľahaj so smotanou a vajcovým náhradníkom. Vmiešaj ¾ parmezánu.",
      "Zmes vajec prelej na huby. Varu na sporáku 3 minúty, kým okraje nestuhtnú.",
      "Posyp zvyšným parmezánom a presuň do rúry. Peč 10–12 minút do tuhého stredu. Podávaj priamo z panvice nakrájanú na kliny."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/643859-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-655235",
    "title": "Arašidové maslo a želé smoothie",
    "category": "ranajky",
    "description": "Arašidové maslo a želé smoothie môžu byť dobrým receptom na rozšírenie vášho raňajkového repertoáru. Watchin",
    "prepTime": 45,
    "servings": 2,
    "calories": 779,
    "protein": 20,
    "carbs": 104,
    "fat": 36,
    "fiber": 8,
    "ingredients": [
      {
        "name": "mandľové mlieko",
        "amount": "1 cup"
      },
      {
        "name": "banány",
        "amount": "2"
      },
      {
        "name": "arašidové maslo",
        "amount": "0.5 cup"
      },
      {
        "name": "jahody,",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Prísady umiestnite do vysokorýchlostného mixéra, ako je Blendtec, pre super hladkú textúru, rozmixujte na vysokej úrovni. Ak používate bežný mixér, vložte mlieko a jahody do zmesi. Potom pridajte banánové kúsky a arašidové maslo, spracujte do hladka. Ozdobte rozdrvenými arašidmi a podávajte."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka",
      "fodmap"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/655235-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-641651",
    "title": "Šišky so sušeným ovocím a zázvorom",
    "category": "ranajky",
    "description": "Sušené ovocie a zázvorové šišky sú európske raňajky. Tento recept obsahuje 8 porcií s 273 kalóriami",
    "prepTime": 45,
    "servings": 8,
    "calories": 273,
    "protein": 5,
    "carbs": 39,
    "fat": 11,
    "fiber": 1,
    "ingredients": [
      {
        "name": "kypriaci prášok",
        "amount": "1 tbsp"
      },
      {
        "name": "maslo",
        "amount": "5 tbsp"
      },
      {
        "name": "koláčová múka",
        "amount": "1 cup"
      },
      {
        "name": "kandizovaný zázvor",
        "amount": "0.25 cup"
      },
      {
        "name": "jablko",
        "amount": "0.25 cup"
      },
      {
        "name": "Brusnice",
        "amount": "0.25 cup"
      },
      {
        "name": "múka",
        "amount": "1 cup"
      },
      {
        "name": "Smotana",
        "amount": "0.25 cup"
      },
      {
        "name": "Soli",
        "amount": "0.5 tsp"
      },
      {
        "name": "cukor turbinado",
        "amount": "4 tbsp"
      }
    ],
    "steps": [
      "Predhrej rúru na 200 °C. Zmiešaj obe múky, kypriaci prášok, soľ a 2 PL cukru.",
      "Studené maslo nakrájaj na kocky a vtrieraj do múky prstami do hrubej strúhanky. Pridaj kandizovaný zázvor, nakrájané jablko a brusnice.",
      "Vlej smotanu a rýchlo spoj na cesto. Na pomúčenej doske vyvaľkaj na 2,5 cm hrúbku.",
      "Vykrajuj kolieska alebo kliny. Ukladaj na plech vystlaný papierom.",
      "Potrieť smotanou a posyp zvyšným cukrom turbinado. Peč 18–22 minút do zlatista."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [
      "English",
      "British",
      "Scottish",
      "European"
    ],
    "image": "https://img.spoonacular.com/recipes/641651-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-634318",
    "title": "Grilované krevety s krupicou a syrom",
    "category": "ranajky",
    "description": "Grilované krevety a krupica si vyžadujú približne 45 minút od začiatku do konca. Tento recept slúži 6 a c",
    "prepTime": 45,
    "servings": 6,
    "calories": 613,
    "protein": 36,
    "carbs": 46,
    "fat": 31,
    "fiber": 1,
    "ingredients": [
      {
        "name": "slanina",
        "amount": "8 strips"
      },
      {
        "name": "Barbecue omáčka",
        "amount": "6 servings"
      },
      {
        "name": "maslo",
        "amount": "0.5 stick"
      },
      {
        "name": "3 strúčiky cesnaku",
        "amount": "3"
      },
      {
        "name": "krupica",
        "amount": "2 cups"
      },
      {
        "name": "krevety rodu <i>Pandalus</i>",
        "amount": "2 lb"
      },
      {
        "name": "Soli",
        "amount": "0.25 teaspoon"
      },
      {
        "name": "jarná cibuľka",
        "amount": "0.75 cup"
      },
      {
        "name": "ostrý syr čedar",
        "amount": "1.5 cup"
      },
      {
        "name": "vody",
        "amount": "1 tablespoon"
      }
    ],
    "steps": [
      "Krupicu uvariť podľa návodu (zvyčajne 4 šálky vody : 1 šálka krupice). Na konci vmieša maslo, cheddar, ochuť soľou.",
      "Slaninu opekaj na panvici do chrumkava. Vyndaj, odlož. V slaninových výpekoch opekaj cesnak 30 sekúnd.",
      "Krevety na grile alebo panvici opekaj 1–2 minúty z každej strany, kým nezhružnovorovú. Ochuť soľou a trochou BBQ omáčky.",
      "Do krupice vmieša jarné cibuľky a pokrájané krevety.",
      "Podávaj krupicu v hlbokom tanieri, na vrch uložiť krevety, posypať slaninkou a jarnou cibuľkou."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku"
    ],
    "tags": [
      "Southern"
    ],
    "image": "https://img.spoonacular.com/recipes/634318-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716211",
    "title": "Čerešňovo-čučoriedkové muffiny",
    "category": "ranajky",
    "description": "Čerešňové čučoriedkové muffiny môžu byť práve raňajkami, ktoré hľadáte. Jedna porcia tohto jedla",
    "prepTime": 45,
    "servings": 12,
    "calories": 170,
    "protein": 6,
    "carbs": 22,
    "fat": 7,
    "fiber": 2,
    "ingredients": [
      {
        "name": "mandľové maslo",
        "amount": "4 tablespoons"
      },
      {
        "name": "mandľová múka",
        "amount": "0.5 cup"
      },
      {
        "name": "kypriaci prášok",
        "amount": "2 teaspoons"
      },
      {
        "name": "sóda bikarbóna",
        "amount": "0.125 teaspoon"
      },
      {
        "name": "čučoriedky",
        "amount": "0.5 cup"
      },
      {
        "name": "čerešne",
        "amount": "1 cup"
      },
      {
        "name": "vajce",
        "amount": "2"
      },
      {
        "name": "citrónová šťava",
        "amount": "1 tablespoon"
      },
      {
        "name": "citrónová kôra",
        "amount": "2 teaspoons"
      },
      {
        "name": "morská soľ",
        "amount": "0.5 teaspoon"
      }
    ],
    "steps": [
      "Predhrej rúru na 175 °C. Muffinový plech vysteli košíčkami alebo vymas.",
      "V miske zmiešaj mandľovú múku, kypriaci prášok, sódu a morskú soľ.",
      "V druhej miske rozšľahaj vajcia s mandľovým maslom, citrónovou kôrou a šťavou.",
      "Spoj mokré a suché suroviny. Jemne primiešaj čučoriedky a čerešne (čerešne nakrájaj na polovice).",
      "Zmes rozdeliť do košíčkov (do ¾). Peč 20–23 minút, kým špajdľa nevychádza čistá. Nechaj vychladnúť 5 minút pred vyberaním."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716211-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-651765",
    "title": "Palacinky Ricotta s citrónovou kôrou a ostružinami",
    "category": "ranajky",
    "description": "Ak chcete do svojej receptovej škatule pridať viac lakto ovo vegetariánskych receptov, Meyer Lemon Ricotta Palacinka",
    "prepTime": 45,
    "servings": 2,
    "calories": 616,
    "protein": 30,
    "carbs": 61,
    "fat": 28,
    "fiber": 6,
    "ingredients": [
      {
        "name": "viacúčelová múka",
        "amount": "0.75 cup"
      },
      {
        "name": "ostružiny",
        "amount": "6 ounce"
      },
      {
        "name": "maslo",
        "amount": "2 servings"
      },
      {
        "name": "vajce",
        "amount": "3 large"
      },
      {
        "name": "Sacharóza",
        "amount": "0.5 tablespoon"
      },
      {
        "name": "Sacharóza",
        "amount": "1.5 tablespoons"
      },
      {
        "name": "citrónová kôra",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "citrónová kôra",
        "amount": "1"
      },
      {
        "name": "citrónová šťava meyer",
        "amount": "2 tablespoons"
      },
      {
        "name": "Ricotta",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Ostružiny s 1 PL cukru povariť v hrnci 5 minút na miernom ohni na hustý kompot. Odlož.",
      "V miske zmiešaj múku so štipkou soli a 0,5 PL cukru. V druhej miske rozšľahaj vajcia s ricottou, citrónovou šťavou a kôrou.",
      "Spoj suché a mokré ingrediencie – cesto bude mierne hrudkovité, to je správne.",
      "Na panvici rozohrei maslo na strednom ohni. Nakladaj porcie cesta (2–3 PL), peč 2–3 min z každej strany do zlatohnedej.",
      "Podávaj palacinky teplé s ostružinovým kompotom a prípadne s kopčekom ricotty."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovo vegetariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/651765-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-776505",
    "title": "Klobásovo-pepperoni stromboli",
    "category": "obed",
    "description": "Klobása & Pepperoni Stromboli trvá približne 28 minút od začiatku do konca. Tento recept slúži 6. Na",
    "prepTime": 28,
    "servings": 6,
    "calories": 692,
    "protein": 32,
    "carbs": 37,
    "fat": 46,
    "fiber": 2,
    "ingredients": [
      {
        "name": "vajce",
        "amount": "1"
      },
      {
        "name": "Klobása",
        "amount": "1 lb"
      },
      {
        "name": "Syr Parmerán",
        "amount": "1 cup"
      },
      {
        "name": "Feferóny",
        "amount": "1 package"
      },
      {
        "name": "rolka cesta na pizzu",
        "amount": "1 ball"
      },
      {
        "name": "omáčka na pizzu",
        "amount": "2 cups"
      },
      {
        "name": "Syr Mozzarela",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Predhrej rúru na 200 °C. Cesto na pizzu vyvaľkaj na obdĺžnik (cca 30×40 cm).",
      "Potrieť časťou pizzovej omáčky, ponechaj 2 cm okraje voľné. Poukladaj plátky klobásy, pepperoni, posyp mozzarellou a parmezánom.",
      "Cesto zrolovať pozdĺžne do rolky, okraje pevne pritlač prstami. Uložiť na plech vystlaný papierom na pečenie, spájanou stranou nadol.",
      "Potrieť rozšľahaným vajcom. Nožnicami alebo ostrým nožom urob na vrchu 4–5 zárezov.",
      "Peč 20–25 minút do zlatohnedej. Nechaj 5 minút pred krájaním. Podávaj so zvyšnou pizzovou omáčkou na namáčanie."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/776505-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-715467",
    "title": "Morčací koláč",
    "category": "obed",
    "description": "Nikdy nemôžete mať príliš veľa receptov na hlavné jedlo, takže vyskúšajte Turecko Pot Pie. Tento recept slúži 8",
    "prepTime": 45,
    "servings": 8,
    "calories": 728,
    "protein": 23,
    "carbs": 66,
    "fat": 42,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Korenie",
        "amount": "1 tsp"
      },
      {
        "name": "maslo",
        "amount": "0.6666667 cup"
      },
      {
        "name": "zeler",
        "amount": "1 cup"
      },
      {
        "name": "Semená zeleru",
        "amount": "0.5 tsp"
      },
      {
        "name": "Kurací vývar",
        "amount": "1.75 cups"
      },
      {
        "name": "múka",
        "amount": "0.6666667 cups"
      },
      {
        "name": "Cesnak v prášku",
        "amount": "0.5 tsp"
      },
      {
        "name": "zelená fazuľka",
        "amount": "20 oz"
      },
      {
        "name": "korenie",
        "amount": "0.5 tsp"
      },
      {
        "name": "mlieka",
        "amount": "1.3333334 cups"
      }
    ],
    "steps": [
      "Predhrej rúru na 200 °C. Maslo rozpustiť v hrnci, opekaj cibuľu a zeler 5 minút. Vmieša múku a varíme 1 minútu.",
      "Postupne vlievaj kurací vývar a mlieko za stáleho miešania. Vari na miernom ohni, kým omáčka nezahustí. Ochuť soľou, korením a cesnakovým práškom.",
      "Pridaj zelené fazuľky a morčacie mäso. Premiešaj.",
      "Zmes prelej do zapekacej formy. Prikry vrchným koláčovým cestom, okraje pritlač a urob zárezy na paru.",
      "Peč 30–35 minút, kým kôrka nie je zlatohnedá. Nechaj 10 minút pred podávaním."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715467-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715419",
    "title": "Kuracie krídla zo slow cookera - pikantné",
    "category": "obed",
    "description": "Pomalý sporák Spicy Hot Wings môže byť dobrým receptom na rozšírenie vašej krabice s receptami hor d'oeuvre. Tento recept",
    "prepTime": 14,
    "servings": 4,
    "calories": 384,
    "protein": 23,
    "carbs": 28,
    "fat": 20,
    "fiber": 0,
    "ingredients": [
      {
        "name": "hnedý cukor.",
        "amount": "0.5 cup"
      },
      {
        "name": "Kajenské korenie",
        "amount": "1 tsp"
      },
      {
        "name": "pravidelné kuracie krídelká",
        "amount": "2 pounds"
      },
      {
        "name": "cesnak",
        "amount": "1 Tbsp"
      },
      {
        "name": "horúca omáčka louisiana",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Krídelká osuš papierovou utierkou. V miske zmiešaj horúcu omáčku, hnedý cukor, cesnak a kajenské korenie.",
      "Krídelká uložiť do slow cookera a polej marinádou. Dobre premiešaj.",
      "Varias na LOW 6–7 hodín alebo HIGH 3–4 hodiny, kým mäso nezmäkne.",
      "Krídelká premiestnit na plech a griluj pod grilom v rúre 5 minút z každej strany do chrumkavého povrchu.",
      "Podávaj s dip omáčkou a zelerovými tyčinkami."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka"
    ],
    "tags": [
      "American"
    ],
    "image": "https://img.spoonacular.com/recipes/715419-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-997285",
    "title": "Balenia kreviet a špargľovej fólie s cesnakovou citrónovo-maslovou ...",
    "category": "obed",
    "description": "Krevety a špargľové fóliové balenia s cesnakovou citrónovou maslovou omáčkou sú hlavným chodom, ktorý slúži 4. Jeden s",
    "prepTime": 45,
    "servings": 4,
    "calories": 327,
    "protein": 37,
    "carbs": 6,
    "fat": 18,
    "fiber": 3,
    "ingredients": [
      {
        "name": "vii)STOPKOVÉ ZELENINY 0,02",
        "amount": "1 lb"
      },
      {
        "name": "maslo",
        "amount": "6 Tbsp"
      },
      {
        "name": "Kurací vývar",
        "amount": "3 Tbsp"
      },
      {
        "name": "čerstvá petržlenová vňať",
        "amount": "2 Tbsp"
      },
      {
        "name": "cesnak",
        "amount": "4 tsp"
      },
      {
        "name": "citrónová šťava",
        "amount": "1.5 Tbsp"
      },
      {
        "name": "citrónová kôra",
        "amount": "2 tsp"
      },
      {
        "name": "soľ a korenie",
        "amount": "4 servings"
      },
      {
        "name": "krevety rodu <i>Pandalus</i>",
        "amount": "1.5 lbs"
      }
    ],
    "steps": [
      "Predhrejte gril na stredne vysokú teplotu (asi 400 - 425 stupňov). Odrežte 4 listy 14 x 12 palcov silnej hliníkovej fólie a potom položte každý kus samostatne na dosku.",
      "Rozdeľte krevety medzi balíčky v blízkosti stredu a potom umiestnite špargľu na jednu stranu kreviet (idúc dlhým smerom fólie). Nalejte 1/2 polievkovej lyžice bieleho vína. Posypeme cesnakom (1 lyžička na balenie) a citrónovou kôrou, potom dochutíme soľou a korením. Rozdeľte kúsky masla rovnomerne medzi balíčky, ktoré ich vrstvia na krevety a špargľu. Zabaľte balíky a zvlňte okraje dohromady a potom ich zabaľte (nezabaľujte príliš tesne - ponechajte vo vnútri trochu viac priestoru na cirkuláciu tepla).",
      "Grilujte zapečatenou stranou smerom nahor, kým krevety neprepečú, asi 9 - 10 minút. Opatrne rozbaľte, potom pokvapkajte citrónovou šťavou (alebo len podávajte s citrónovými klinmi na postriekanie) a posypte petržlenovou vňaťou.",
      "Zdroj receptu: Varenie Elegantné"
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "pescatariánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/997285-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715421",
    "title": "Quinoa zapekačka s kuracím mäsom a enchilada omáčkou",
    "category": "obed",
    "description": "Cheesy Chicken Enchilada Quinoa Casserole môže byť práve ten mexický recept, ktorý hľadáte. Na",
    "prepTime": 30,
    "servings": 4,
    "calories": 594,
    "protein": 34,
    "carbs": 68,
    "fat": 24,
    "fiber": 18,
    "ingredients": [
      {
        "name": "avokádo",
        "amount": "1 small"
      },
      {
        "name": "Korenie",
        "amount": "0.5 tsp"
      },
      {
        "name": "Čierne fazule",
        "amount": "15 oz"
      },
      {
        "name": "Konzervované paradajky",
        "amount": "10 oz"
      },
      {
        "name": "čili prášok",
        "amount": "0.5 tsp"
      },
      {
        "name": "quinoa",
        "amount": "1 cup"
      },
      {
        "name": "rasca",
        "amount": "0.5 tsp"
      },
      {
        "name": "omáčka verde enchilada",
        "amount": "10 oz"
      },
      {
        "name": "Koriander",
        "amount": "2 Tbsp"
      },
      {
        "name": "zelená cibuľka",
        "amount": "4 servings"
      }
    ],
    "steps": [
      "Predhrej rúru na 190 °C. Quinoa uvariť podľa návodu a odlož.",
      "V miske zmiešaj uvarenej quinoy, konzervované paradajky, čierne fazuľky (scedené), enchilada verde omáčku, čili prášok, rascu a korenie.",
      "Zmes prelej do vymastenej zapekacej formy. Posyp syrom.",
      "Peč 25 minút, kým syr nezabublá a nezazlatí.",
      "Podávaj posypané korianderom, nakrájaným avokádom a zelenou cibuľkou."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku"
    ],
    "tags": [
      "Mexican"
    ],
    "image": "https://img.spoonacular.com/recipes/715421-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-715437",
    "title": "Kuracie kastról King Ranch",
    "category": "obed",
    "description": "Domáce kuracie kastról King Ranch je hlavným jedlom, ktoré slúži 6. Jedna porcia obsahuje 554 kalórií",
    "prepTime": 65,
    "servings": 6,
    "calories": 554,
    "protein": 36,
    "carbs": 37,
    "fat": 29,
    "fiber": 3,
    "ingredients": [
      {
        "name": "maslo",
        "amount": "0.25 cup"
      },
      {
        "name": "Kuracie prsia",
        "amount": "2"
      },
      {
        "name": "krém z kuracej polievky",
        "amount": "10.5 oz"
      },
      {
        "name": "krém z hubovej polievky",
        "amount": "10.5 oz"
      },
      {
        "name": "paradajky a čili",
        "amount": "20 oz"
      },
      {
        "name": "tortilly z múky",
        "amount": "10"
      },
      {
        "name": "mexický cheddar jack syr",
        "amount": "2 cup"
      },
      {
        "name": "cibuľa",
        "amount": "1 medium"
      }
    ],
    "steps": [
      "Predhrej rúru na 180 °C. Kuracie prsia uvariť, nechaj vychladnúť a roztrhnúť na vlákna.",
      "Cibuľu opekaj na masle 5 minút. Pridaj krém z kuracej aj hubovej polievky, paradajky s čili a premiešaj.",
      "Na dno zapekacej formy uložiť vrstvu tortíl natrhaných na kusy. Pridaj vrstvu kuracieho mäsa, prelej omáčkou a posyp syrom.",
      "Opakuj vrstvy: tortily → kura → omáčka → syr. Uzatvoriť vrstvou syra.",
      "Peč 35–40 minút, kým povrch nezazlatí a okraje nebublajú."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715437-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715394",
    "title": "Kuracie kastról Enchilada",
    "category": "obed",
    "description": "Kuracie kastról Enchilada môže byť len hlavným chodom, ktorý hľadáte. Tento recept obsahuje 8",
    "prepTime": 45,
    "servings": 8,
    "calories": 325,
    "protein": 26,
    "carbs": 26,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "name": "omáčka verde enchilada",
        "amount": "20 oz"
      },
      {
        "name": "syr",
        "amount": "2 cups"
      },
      {
        "name": "kurča pre",
        "amount": "1 lb"
      },
      {
        "name": "Konzervované paradajky",
        "amount": "10 oz"
      },
      {
        "name": "vyprážaná fazuľa",
        "amount": "15 oz"
      },
      {
        "name": "tortilly z múky roztrhané na kúsky veľkosti uhryznutia",
        "amount": "6"
      },
      {
        "name": "zelené cibuľové dosky voliteľné",
        "amount": "8 servings"
      }
    ],
    "steps": [
      "Pripravte si pekáč s rozmermi 9 x 13 cm a začnite tým, že na dno misky položíte vrstvu tortilly.",
      "Potom pridajte vrstvu kuracieho mäsa a 1/4 šálky strúhaného syra.",
      "Pridajte polovicu plechovky paradajok a zelenej čili papričky a jednu plechovku omáčky verde enchilada.",
      "Dokončite vrstvu polovicou plechovky fazule.",
      "Potom prikryte ďalšou vrstvou kúskov tortilly z múky a znova začnite s procesom vrstvenia.",
      "Po dokončení vrstvenia prikryte vrch zvyšným strúhaným syrom."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [
      "Mexican"
    ],
    "image": "https://img.spoonacular.com/recipes/715394-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715544",
    "title": "Sladké zemiaky plnené s kozím syrom a slaninou",
    "category": "obed",
    "description": "Recept na hneďé maslo dvakrát pečené sladké zemiaky je možné pripraviť asi za 1 hodinu a 35 minút. Sledujte",
    "prepTime": 95,
    "servings": 4,
    "calories": 677,
    "protein": 19,
    "carbs": 56,
    "fat": 44,
    "fiber": 14,
    "ingredients": [
      {
        "name": "avokáda",
        "amount": "2"
      },
      {
        "name": "cmar",
        "amount": "2 tablespoons"
      },
      {
        "name": "slanina",
        "amount": "4 strips"
      },
      {
        "name": "petržlen",
        "amount": "0.25 cup"
      },
      {
        "name": "kozí syr",
        "amount": "6 ounces"
      },
      {
        "name": "soľ a korenie",
        "amount": "4 servings"
      },
      {
        "name": "sérum",
        "amount": "0.5 cup"
      },
      {
        "name": "Sladké zemiaky",
        "amount": "4 medium"
      },
      {
        "name": "maslo",
        "amount": "6 tablespoons"
      }
    ],
    "steps": [
      "Predhrej rúru na 200 °C. Sladké zemiaky popichaj vidličkou a peč 45–60 minút, kým nie sú mäkké.",
      "Slaninu opekaj na panvici do chrumkava. Odlož na papier.",
      "Zemiaky pozdĺžne prepoľ, dužinu vyberieš lyžicou do misy (šupky zachovaj).",
      "Dužinu rozmiešaj s maslom, cmarom, srvátkou, kozím syrom, soľou a korením. Ochutaj.",
      "Naplň šupky zmesou. Posyp slaninou, petržlenom a zvyšným kozím syrom. Vráť do rúry na 15 minút. Podávaj s nakrájaným avokádom."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715544-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715562",
    "title": "Krémová polievka z pečených zemiakov",
    "category": "obed",
    "description": "Naložená pečená zemiaková polievka môže byť len hlavným chodom, ktorý hľadáte. Tento recept slúži 8.",
    "prepTime": 60,
    "servings": 8,
    "calories": 624,
    "protein": 21,
    "carbs": 59,
    "fat": 35,
    "fiber": 3,
    "ingredients": [
      {
        "name": "slaninové kúsky",
        "amount": "8 servings"
      },
      {
        "name": "Pečené zemiaky",
        "amount": "8 medium"
      },
      {
        "name": "maslo",
        "amount": "0.5 cup"
      },
      {
        "name": "múka",
        "amount": "0.5 cup"
      },
      {
        "name": "mlieka",
        "amount": "8 cups"
      },
      {
        "name": "soľ a korenie",
        "amount": "8 servings"
      },
      {
        "name": "Syr Cheddar",
        "amount": "2 cups"
      },
      {
        "name": "sérum",
        "amount": "8 oz"
      },
      {
        "name": "cibuľa",
        "amount": "0.5 medium"
      }
    ],
    "steps": [
      "Zemiaky umyj, popichaj vidličkou a peč pri 200 °C 60 minút. Nechaj vychladnúť, dužinu vyberieš lyžicou.",
      "V hrnci rozohrei maslo, osmažuj cibuľu 3 minúty. Vmieša múku a varíme 1 minútu.",
      "Postupne vlievaj mlieko za miešania. Varíme na miernom ohni 10 minút, kým omáčka nezahustí.",
      "Pridaj zemiakové dužinu a rozmiešaj. Ochuť soľou a korením. Na záver vmieša cheddar a srvátku.",
      "Podávaj posypanú slaninkovými kúskami, kolvínom syra a nakrájanou cibuľou."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715562-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715521",
    "title": "Morčací BLT šalát s avokádom",
    "category": "obed",
    "description": "Potrebujete bezlepkové, bez mliečnych výrobkov, paleolitické a primárne hlavné jedlo? Morčací avokádový BLT šalát by mohol",
    "prepTime": 45,
    "servings": 2,
    "calories": 383,
    "protein": 20,
    "carbs": 12,
    "fat": 30,
    "fiber": 7,
    "ingredients": [
      {
        "name": "avokádo",
        "amount": "1 small"
      },
      {
        "name": "Koriander",
        "amount": "1 tsp"
      },
      {
        "name": "rímska paradajka",
        "amount": "1 small"
      },
      {
        "name": "Šalátové listy",
        "amount": "2 servings"
      },
      {
        "name": "stredovo rezaná slanina",
        "amount": "2"
      },
      {
        "name": "morčacie prsia",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Slaninu opekaj na panvici do chrumkava. Nechaj vychladnúť, pokrájaj na kúsky.",
      "Paradajku nakrájaj na kliny, avokádo na kocky. Morčacie prsia nakrájaj na prúžky.",
      "Šalátové listy rozlož na tanier. Rozmiestni morčacie prsia, paradajku, avokádo a slaninu.",
      "Posyp korianderom. Pokvapkaj olivovým olejom a citrónovou šťavou alebo dresingom podľa výberu.",
      "Podávaj ihneď."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka",
      "paleo",
      "whole30",
      "ketogénne"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715521-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715391",
    "title": "Pomalý športák kuracie taco polievka",
    "category": "obed",
    "description": "Zabudnite sa ísť najesť alebo si objednať jedlo so sebou zakaždým, keď túžite po mexickom jedle. Vyskúšajte pomalé varenie",
    "prepTime": 485,
    "servings": 6,
    "calories": 312,
    "protein": 24,
    "carbs": 49,
    "fat": 4,
    "fiber": 12,
    "ingredients": [
      {
        "name": "Čierne fazule",
        "amount": "15 oz"
      },
      {
        "name": "paradajky",
        "amount": "20 oz"
      },
      {
        "name": "Konzervované paradajky",
        "amount": "15 oz"
      },
      {
        "name": "čili fazuľa",
        "amount": "15 oz"
      },
      {
        "name": "zrnitá kukurica",
        "amount": "15 oz"
      },
      {
        "name": "cibuľa",
        "amount": "1 large"
      },
      {
        "name": "Kuracie prsia",
        "amount": "3"
      }
    ],
    "steps": [
      "Akonáhle pridáte všetky ingrediencie, nechajte ho variť celý deň 8 hodín pri nízkej teplote. Ak to chcete urobiť trochu rýchlejšie, zapnite ho vysoko a varte 4 hodiny. Keď je kuracia polievka Taco pripravená na servírovanie, pridajte rozdrvené tortilla škrupiny, strúhaný syr čedar a trochu kyslej smotany."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka"
    ],
    "tags": [
      "Mexican"
    ],
    "image": "https://img.spoonacular.com/recipes/715391-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715545",
    "title": "Ako urobiť najlepšie kurča Jambalaya",
    "category": "obed",
    "description": "Nikdy nemôžete mať príliš veľa receptov Cajun, takže vyskúšajte How to Make the Best Chicken Jambalayan.",
    "prepTime": 55,
    "servings": 8,
    "calories": 450,
    "protein": 26,
    "carbs": 38,
    "fat": 21,
    "fiber": 3,
    "ingredients": [
      {
        "name": "maslo",
        "amount": "2 tbsp"
      },
      {
        "name": "Klobása",
        "amount": "1 lb"
      },
      {
        "name": "Kuracie prsia",
        "amount": "1 lb"
      },
      {
        "name": "cibuľa",
        "amount": "1 cup"
      },
      {
        "name": "Zeler",
        "amount": "1 cup"
      },
      {
        "name": "Kapia",
        "amount": "0.5 cup"
      },
      {
        "name": "cesnak",
        "amount": "1 tbsp"
      },
      {
        "name": "paradajková omáčka",
        "amount": "1 cup"
      },
      {
        "name": "paradajky",
        "amount": "14.5 oz"
      },
      {
        "name": "▢ kuracie vývar",
        "amount": "2.5 cups"
      }
    ],
    "steps": [
      "V malej miske zmiešajte kreolské koreniny a odložte ich nabok.",
      "Maslo roztopte vo veľkej holandskej rúre na stredne vysokom ohni.",
      "Pridajte klobásu, kým nezačne hnednúť, asi 3 minúty.",
      "Pridajte kuracie mäso a varte až do hnednutia, asi 3-5 minút. Často miešajte.",
      "Otočte sporák nadol na stredné teplo.",
      "Rúru predhrejte na 350 stupňov."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku"
    ],
    "tags": [
      "Cajun",
      "Creole"
    ],
    "image": "https://img.spoonacular.com/recipes/715545-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715415",
    "title": "Polievka z červenej šošovice s kuracím mäsom",
    "category": "obed",
    "description": "Červená šošovicová polievka s kuracím mäsom a okrúhlicou môže byť dobrým receptom na rozšírenie repertoáru hlavného chodu",
    "prepTime": 55,
    "servings": 8,
    "calories": 477,
    "protein": 27,
    "carbs": 52,
    "fat": 20,
    "fiber": 24,
    "ingredients": [
      {
        "name": "prídavné polevy: avokádo",
        "amount": "8 servings"
      },
      {
        "name": "mrkva",
        "amount": "3 medium"
      },
      {
        "name": "zeler stopkový;",
        "amount": "3"
      },
      {
        "name": "Kuracie prsia",
        "amount": "2 cups"
      },
      {
        "name": "petržlenová vňať s plochým listom",
        "amount": "0.5 cup"
      },
      {
        "name": "cesnak",
        "amount": "6 cloves"
      },
      {
        "name": "olivový olej",
        "amount": "2 tablespoons"
      },
      {
        "name": "Konzervované paradajky",
        "amount": "28 ounce"
      },
      {
        "name": "Šošovica",
        "amount": "2 cups"
      },
      {
        "name": "soľ a korenie",
        "amount": "8 servings"
      }
    ],
    "steps": [
      "Na olivovom oleji opekaj nakrájané mrkvy, zeler a cesnak 5 minút na strednom ohni.",
      "Pridaj konzervované paradajky a šošovicu. Premiešaj a varíme 2 minúty.",
      "Vlej toľko vody alebo kuracieho vývaru, aby pokrylo suroviny o 5 cm. Priveď do varu, znervózni na simmer.",
      "Varíme 25–30 minút, kým šošovica nezmäkne. Pridaj uvarené kuracie mäso a petržlen, ochuť soľou a korením.",
      "Podávaj s nakrájaným avokádom a chlebom."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715415-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715392",
    "title": "Kuracia tortilová polievka s ľahkým pomalým športom",
    "category": "obed",
    "description": "Easy Slow Cooker kuracia tortilla polievka trvá približne 6 hodín a 10 minút od začiatku do",
    "prepTime": 370,
    "servings": 8,
    "calories": 283,
    "protein": 32,
    "carbs": 30,
    "fat": 4,
    "fiber": 8,
    "ingredients": [
      {
        "name": "Kuracie prsia",
        "amount": "2 pounds"
      },
      {
        "name": "cibuľa",
        "amount": "1 medium"
      },
      {
        "name": "čili prášok",
        "amount": "2 teaspoon"
      },
      {
        "name": "paradajky",
        "amount": "28 ounces"
      },
      {
        "name": "Kurací vývar",
        "amount": "24 ounces"
      },
      {
        "name": "jadrová kukurica",
        "amount": "15 ounces"
      },
      {
        "name": "čili",
        "amount": "4 ounces"
      },
      {
        "name": "Čierne fazule",
        "amount": "15 ounces"
      },
      {
        "name": "Koriander",
        "amount": "0.25 cup"
      }
    ],
    "steps": [
      "Pridajte všetky ingrediencie do pomalého hrnca a potom varte pri nízkej teplote 6 hodín.",
      "Po dokončení varenia naberajte do servírovacích misiek a podávajte s tortillovými lupienkami, kyslou smotanou, syrom, avokádom alebo niektorou z vašich obľúbených zálievok."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "bez mlieka"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715392-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715397",
    "title": "Zapekačka s kuracím mäsom, ryžou a syrom",
    "category": "obed",
    "description": "Cheesy kuracie mäso a ryža kastról môže byť len hlavným chodom, ktorý hľadáte. Tento recept m",
    "prepTime": 60,
    "servings": 6,
    "calories": 464,
    "protein": 31,
    "carbs": 21,
    "fat": 28,
    "fiber": 1,
    "ingredients": [
      {
        "name": "grilované kuracie prsia",
        "amount": "2"
      },
      {
        "name": "dusená ryža",
        "amount": "2 cups"
      },
      {
        "name": "smotanový syr",
        "amount": "8 oz"
      },
      {
        "name": "krém z hubovej polievky",
        "amount": "10 oz"
      },
      {
        "name": "Kapia",
        "amount": "1 medium"
      },
      {
        "name": "syr monterrey jack",
        "amount": "1.5 cup"
      },
      {
        "name": "cibuľa",
        "amount": "0.5"
      },
      {
        "name": "soľ a korenie",
        "amount": "6 servings"
      },
      {
        "name": "country crock maslová nátierka",
        "amount": "2 Tbsp"
      }
    ],
    "steps": [
      "Predhrej rúru na 180 °C. Kapia a cibuľa nakrájaj nadrobno, opekaj na masle 5 minút.",
      "V miske zmiešaj uvarenú ryžu, grilované kuracie prsia (nakrájané), krém z hubovej polievky, smotanový syr, opečenú zeleninu a polovicu syra. Ochuť soľou a korením.",
      "Zmes prelej do vymastenej zapekacej formy.",
      "Posyp zvyšným Monterrey Jack syrom.",
      "Peč 30–35 minút, kým povrch nezabublá a nezazlatí. Podávaj priamo z formy."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715397-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715523",
    "title": "Paprika plnená chorizom a hovädzím mäsom Quinoa",
    "category": "vecera",
    "description": "Paprika plnená chorizom a hovädzím mäsom s quinoou je bezlepkový hlavný chod. Jedna porcia tohto jedla obsahuje",
    "prepTime": 30,
    "servings": 4,
    "calories": 685,
    "protein": 51,
    "carbs": 33,
    "fat": 37,
    "fiber": 5,
    "ingredients": [
      {
        "name": "papriky",
        "amount": "4 servings"
      },
      {
        "name": "kajenské korenie",
        "amount": "0.5 tsp"
      },
      {
        "name": "čili prášok",
        "amount": "0.25 tsp"
      },
      {
        "name": "chorizo",
        "amount": "1 pound"
      },
      {
        "name": "rasca",
        "amount": "0.25 tsp"
      },
      {
        "name": "vrcholky zelenej cibule",
        "amount": "4 servings"
      },
      {
        "name": "syr monterrey jack a čedar",
        "amount": "0.25 cup"
      },
      {
        "name": "mleté hovädzie mäso",
        "amount": "1 pound"
      },
      {
        "name": "quinoa",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Najprv si zohrejte rúru na 350 stupňov, uvarte vodu na quinou a na samostatnej panvici spolu opečte hovädzie mäso a chorizo.",
      "Mäsovú zmes dobre sceďte a potom ju vložte do stredne veľkej misy.Keď je quinoa úplne uvarená, pridajte ju do misy.",
      "Pridajte zelené cibuľky, rascu, kajenské korenie, chilli a syry monterrey jack a čedar.",
      "Z papriky odrežte vrcholky a vydlabte zvyšné semienka.Potom vezmite mäsovú zmes a začnite plniť papriky, kým nebudú plné.",
      "Posypte trochou syra a potom pečte v rúre asi 10 minút, kým paprika nezmäkne.",
      "Podávajte ihneď."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715523-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-735820",
    "title": "Crock-Pot: Rebierka na ázijský spôsob s cesnakovou omáčkou z čierne...",
    "category": "vecera",
    "description": "Crock-Pot: Ázijský štýl Country Ribs s čiernou fazuľovou cesnakovou omáčkou by mohol byť práve bezmliečny a ke",
    "prepTime": 45,
    "servings": 4,
    "calories": 732,
    "protein": 39,
    "carbs": 11,
    "fat": 58,
    "fiber": 1,
    "ingredients": [
      {
        "name": "cesnaková omáčka z čiernych fazúľ zo zaváraninového pohára",
        "amount": "3 tablespoons"
      },
      {
        "name": "kurací vývar",
        "amount": "0.25 cup"
      },
      {
        "name": "kukuričný škrob",
        "amount": "1 tablespoon"
      },
      {
        "name": "krajina",
        "amount": "4 servings"
      },
      {
        "name": "sezamový olej",
        "amount": "2 teaspoons"
      },
      {
        "name": "cesnak",
        "amount": "1 tablespoon"
      },
      {
        "name": "koreň zázvoru",
        "amount": "1 tablespoon"
      },
      {
        "name": "med",
        "amount": "1 tablespoon"
      },
      {
        "name": "hrubo rozdrvené korenie",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "bravčové rebrá",
        "amount": "3 pounds"
      }
    ],
    "steps": [
      "Toto jedlo v hrnci je naozaj veľmi dobré. Príprava trvá 10 minút, je pripravená z ľahko dostupných surovín a je výhodná, ak vezmete do úvahy počet porcií.  Jedno upozornenie - ak to budete variť dlhšie ako 5 až 6 hodín, budete mať kašu s ázijskou príchuťou. Recept je upravený z publikácie \"Slow Cooker Recipes for All Occasions\" (Recepty pre pomalé varenie na všetky príležitosti), ktorú vydala spoločnosť Rival Crock-Pot.",
      "Podávajte ich s ryžou a snehovým hráškom, a tak máte pred sebou menšiu hostinu, ktorú budete často opakovať. Moja rodina toto jedlo miluje. Myslím, že aj tá vaša bude. Mimochodom, toto je skvelý recept pre začínajúcich kuchárov. Ak máte ochotného tínedžera, nechajte ho, nech sa do toho pustí. rebierka na ázijský spôsob s čiernou fazuľovou cesnakovou omáčkou"
    ],
    "allergens": [],
    "dietary": [
      "bez mliečnych výrobkov",
      "ketogénne"
    ],
    "tags": [
      "Asian"
    ],
    "image": "https://img.spoonacular.com/recipes/735820-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715428",
    "title": "Pečená zemiaková polievka",
    "category": "vecera",
    "description": "Pečená zemiaková polievka trvá od začiatku do konca približne 45 minút. Tento recept slúži pre 6 osôb. Jeden",
    "prepTime": 45,
    "servings": 6,
    "calories": 840,
    "protein": 24,
    "carbs": 70,
    "fat": 53,
    "fiber": 6,
    "ingredients": [
      {
        "name": "slanina",
        "amount": "6 slices"
      },
      {
        "name": "korenie",
        "amount": "1 tsp"
      },
      {
        "name": "maslo",
        "amount": "0.6666667 cup"
      },
      {
        "name": "múka",
        "amount": "0.6666667 cup"
      },
      {
        "name": "zelená cibuľa",
        "amount": "4"
      },
      {
        "name": "mlieko",
        "amount": "7 cups"
      },
      {
        "name": "zemiaky",
        "amount": "4 large"
      },
      {
        "name": "soľ",
        "amount": "1 tsp"
      },
      {
        "name": "syr čedar",
        "amount": "1 cup"
      },
      {
        "name": "krém",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715428-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716430",
    "title": "Šalát z pečenej kapusty s jogurtovým gorgonzolovým dresingom",
    "category": "vecera",
    "description": "Receptov na hlavné jedlá nie je nikdy dosť, preto si dajte šalát z pečenej kapusty s jogurtom Gor",
    "prepTime": 45,
    "servings": 4,
    "calories": 201,
    "protein": 13,
    "carbs": 11,
    "fat": 12,
    "fiber": 3,
    "ingredients": [
      {
        "name": "slanina",
        "amount": "2 strips"
      },
      {
        "name": "cesnak",
        "amount": "1 clove"
      },
      {
        "name": "gorgonzola",
        "amount": "0.6666667 c"
      },
      {
        "name": "hroznové paradajky",
        "amount": "0.5 cup"
      },
      {
        "name": "hroznový olej",
        "amount": "1 tsp"
      },
      {
        "name": "kapusta",
        "amount": "0.5 head"
      },
      {
        "name": "šťava z citróna",
        "amount": "0.5"
      },
      {
        "name": "grécky jogurt",
        "amount": "1 cup"
      },
      {
        "name": "soľ a korenie",
        "amount": "4 servings"
      },
      {
        "name": "šupiny",
        "amount": "1 T"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "primal"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716430-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716627",
    "title": "Jednoduchá domáca ryža a fazuľa",
    "category": "vecera",
    "description": "Jednoduchá domáca ryža s fazuľou je hlavný chod, ktorý slúži pre 2 osoby. Jedna porcia obsahuje 446 kalórií, 19 g",
    "prepTime": 35,
    "servings": 2,
    "calories": 446,
    "protein": 19,
    "carbs": 86,
    "fat": 4,
    "fiber": 19,
    "ingredients": [
      {
        "name": "čierna fazuľa",
        "amount": "15 ounce"
      },
      {
        "name": "konzervované paradajky",
        "amount": "10 ounce"
      },
      {
        "name": "čili prášok",
        "amount": "2 tsp"
      },
      {
        "name": "rasca",
        "amount": "0.5 tsp"
      },
      {
        "name": "mleté korenie",
        "amount": "0.25 tsp"
      },
      {
        "name": "voliteľné: horúcej omáčky",
        "amount": "4 dashes"
      },
      {
        "name": "olivový olej",
        "amount": "1 tsp"
      },
      {
        "name": "cibuľa",
        "amount": "0.25 cup"
      },
      {
        "name": "ryža",
        "amount": "0.5 cup"
      },
      {
        "name": "voda",
        "amount": "3 Tbsp"
      }
    ],
    "steps": [
      "Vo veľkom hrnci na miernom ohni zohrejte olivový olej.",
      "Pridajte cibuľu a smažte ju do mäkka alebo približne 5 minút.",
      "Pridajte všetky ostatné prísady a premiešajte ich. Zvýšte teplotu na stredne vysokú a priveďte do varu. Prikryte a znížte teplotu na stredne nízku, aby sa zmes varila. Varte 15 - 20 minút, alebo kým ryža nie je nadýchaná a tekutina sa nevstrebe.*",
      "Podávajte so salsou, syrom a kyslou smotanou."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "lakto-ovovegetarián",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716627-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-775585",
    "title": "Fazuľa \"Refried\" v hrnci",
    "category": "snack",
    "description": "Recept Crockpot \"Refried\" Fazuľa môže byť pripravený približne za 45 minút. Tento recept slúži pre 16 ľudí. Watchin",
    "prepTime": 45,
    "servings": 16,
    "calories": 89,
    "protein": 5,
    "carbs": 17,
    "fat": 0,
    "fiber": 5,
    "ingredients": [
      {
        "name": "korenie",
        "amount": "1 tsp"
      },
      {
        "name": "rasca",
        "amount": "2 tsp"
      },
      {
        "name": "cesnak",
        "amount": "4 Tbsp"
      },
      {
        "name": "cibuľa",
        "amount": "1 large"
      },
      {
        "name": "fazuľa pinto",
        "amount": "2 lbs"
      },
      {
        "name": "hore soľ",
        "amount": "1 Tbsp"
      },
      {
        "name": "voda",
        "amount": "10 cups"
      }
    ],
    "steps": [
      "Fazuľu prepláchnite v cedníku. Vyberte všetky zlé fazule.",
      "Všetky prísady zmiešajte v hrnci.",
      "Odstráňte všetky plávajúce fazule. Prikryte a varte 4 hodiny na HIGH a 2 hodiny na LOW.Odokryte a odstráňte prebytočnú tekutinu. Nechajte dostatok tekutiny, aby ste dosiahli požadovanú konzistenciu, keď sa fazuľa roztlačí. (My máme radi fazuľu niekde medzi veľmi tekutou reštauračnou fazuľou a konzervovanou verziou vyprážanej fazule.) Fazuľu roztlačte škrabkou na zemiaky na požadovanú konzistenciu.",
      "Podávajte teplé. Uchovávajte vo vzduchotesných nádobách v chladničke a spotrebujte do 2 týždňov, alebo zamrazte vo vreckách so zipsom na neskoršie použitie."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "lakto-ovovegetarián",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/775585-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716426",
    "title": "Karfiol, hneďá ryža a zeleninová vyprážaná ryža",
    "category": "snack",
    "description": "Recept Karfiol, hneďá ryža a zeleninová vyprážaná ryža je horúci za približne 30 minút a je de",
    "prepTime": 30,
    "servings": 8,
    "calories": 248,
    "protein": 7,
    "carbs": 29,
    "fat": 13,
    "fiber": 6,
    "ingredients": [
      {
        "name": "hroznový olej",
        "amount": "2 tablespoons"
      },
      {
        "name": "kokosový olej",
        "amount": "2 tablespoons"
      },
      {
        "name": "šupiny",
        "amount": "7"
      },
      {
        "name": "cesnak",
        "amount": "5 cloves"
      },
      {
        "name": "karfiol",
        "amount": "1 head"
      },
      {
        "name": "hnedá ryža",
        "amount": "3 cups"
      },
      {
        "name": "brokolica",
        "amount": "2 cups"
      },
      {
        "name": "hrášok",
        "amount": "1 cup"
      },
      {
        "name": "sójová omáčka",
        "amount": "3 T"
      },
      {
        "name": "sezamový olej",
        "amount": "2 teaspoons"
      }
    ],
    "steps": [
      "Odstráňte tvrdú stonku karfiolu a nechajte si ju na ďalšie použitie. Pomocou kuchynského robota rozmixujte ružičky karfiolu, kým sa nebudú podobať ryži alebo kuskusu. Mali by ste získať približne štyri šálky \"karfiolovej ryže\".",
      "Vo veľkej panvici na strednom ohni rozohrejte 1T masla a 1T oleja.",
      "Pridajte cesnak a biele a svetlozelené kúsky šalotky. Restujte asi minútu.",
      "Do panvice pridajte karfiol. Premiešajte, aby sa obalil olejom, potom ho rozložte na panvicu a nechajte odstáť; chcete, aby sa trochu uvaril a skaramelizoval (trochu zhnedol), čo zvýrazní jeho sladkosť. Po niekoľkých minútach premiešajte a znova rozložte.",
      "Pridajte studenú ryžu (ľahko sa oddelí, aby sa počas varenia nezhrnula) a ďalší hroznový a kokosový olej alebo maslo. Zvýšte teplotu na stredne vysokú. Všetko spolu premiešajte a opäť zmes rozotrite po celej panvici a trochu pritlačte na dno.",
      "Nechajte ju asi dve minúty odstáť, aby sa ryža opiekla a bola trochu chrumkavá."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "lakto-ovovegetarián",
      "vegánske"
    ],
    "tags": [
      "Chinese",
      "Asian"
    ],
    "image": "https://img.spoonacular.com/recipes/716426-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-716431",
    "title": "Jablkové pyré v hrnci",
    "category": "snack",
    "description": "Ak máte približne 45 minút na to, aby ste strávili v kuchyni, Crockpot Applesauce môže byť veľkolepým",
    "prepTime": 45,
    "servings": 3,
    "calories": 412,
    "protein": 2,
    "carbs": 107,
    "fat": 1,
    "fiber": 18,
    "ingredients": [
      {
        "name": "jablká",
        "amount": "15 small"
      },
      {
        "name": "škorica",
        "amount": "0.5 t"
      },
      {
        "name": "šťava z citróna",
        "amount": "1"
      },
      {
        "name": "pomarančový džús",
        "amount": "0.25 c"
      },
      {
        "name": "vanilka",
        "amount": "1 T"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "paleolit",
      "lakto-ovo vegetariánske",
      "primal",
      "celých 30",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716431-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715543",
    "title": "Domáce guacamole",
    "category": "snack",
    "description": "Ak chcete pridať viac bezlepkových, bezmliečnych, paleolitických a lakto-ovegetariánskych receptov",
    "prepTime": 45,
    "servings": 4,
    "calories": 170,
    "protein": 2,
    "carbs": 11,
    "fat": 15,
    "fiber": 7,
    "ingredients": [
      {
        "name": "avokádo",
        "amount": "2"
      },
      {
        "name": "koriander",
        "amount": "1.5 Tbsp"
      },
      {
        "name": "šťava z limetky",
        "amount": "1"
      },
      {
        "name": "korenie",
        "amount": "0.5 tsp"
      },
      {
        "name": "cibuľa",
        "amount": "0.25 cup"
      },
      {
        "name": "rímske paradajky",
        "amount": "1"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "paleolit",
      "lakto-ovovegetarián",
      "primal",
      "celých 30",
      "vegánske"
    ],
    "tags": [
      "Mexican"
    ],
    "image": "https://img.spoonacular.com/recipes/715543-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716412",
    "title": "Crostini s pečenými brusnicami, ricottou a medom",
    "category": "snack",
    "description": "Stredomorských receptov nie je nikdy dosť, preto si dajte pečené brusnice, ricottu a med Cros",
    "prepTime": 45,
    "servings": 1,
    "calories": 290,
    "protein": 9,
    "carbs": 47,
    "fat": 8,
    "fiber": 2,
    "ingredients": [
      {
        "name": "roľnícky chlieb",
        "amount": "1 slice"
      },
      {
        "name": "čerstvo mleté korenie",
        "amount": "1 serving"
      },
      {
        "name": "med",
        "amount": "1 serving"
      },
      {
        "name": "ricotta",
        "amount": "1 serving"
      },
      {
        "name": "ricotta",
        "amount": "1 serving"
      },
      {
        "name": "morská soľ",
        "amount": "1 serving"
      },
      {
        "name": "pečená brusnicová omáčka",
        "amount": "1 serving"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [
      "Mediterranean",
      "Italian",
      "European"
    ],
    "image": "https://img.spoonacular.com/recipes/716412-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715432",
    "title": "Buffalo Ranch Chicken Dip",
    "category": "snack",
    "description": "Buffalo Ranch Chicken Dip je bezlepkový a ketogénny hor d'oeuvre. Z tohto receptu je 7 porcií",
    "prepTime": 45,
    "servings": 7,
    "calories": 799,
    "protein": 40,
    "carbs": 11,
    "fat": 66,
    "fiber": 1,
    "ingredients": [
      {
        "name": "Kuracie prsia",
        "amount": "4"
      },
      {
        "name": "smotanový syr",
        "amount": "16 oz"
      },
      {
        "name": "zelená cibuľa",
        "amount": "0.5 cup"
      },
      {
        "name": "louisiana horúca omáčka",
        "amount": "12 oz"
      },
      {
        "name": "Paul prudhommes korenie na hydinu",
        "amount": "7 servings"
      },
      {
        "name": "rančový dresing",
        "amount": "16 oz"
      },
      {
        "name": "ostrý syr čedar",
        "amount": "8 oz"
      }
    ],
    "steps": [
      "Vezmite kuracie prsia, jemne ich potrite korením Poultry Magic a potom ich potrite sprejom na varenie Pam. (Pam zabráni vysušeniu kurčaťa počas pečenia.) Ugrilujte kuracie prsia a potom ich nechajte mierne vychladnúť.Predhrejte rúru na 350 stupňov. Kuracie prsia nakrájajte na kúsky a potom ich spojte v sklenenej zapekacej miske s rozmermi 13 x 9 palcov s horúcou omáčkou Louisiana.",
      "Krémový syr a dresing dajte do hrnca na stredný oheň, až kým nebude konzistencia hladká.",
      "Touto zmesou zalejte kuracie mäso a zmes horúcej omáčky v miske. Navrch nasypte syr čedar a zelenú cibuľku.",
      "Pečte bez pokrievky 30 minút, kým sa nevytvoria bublinky.",
      "Nechajte odstáť, kým mierne nevychladne, a potom podávajte s tortillovými lupienkami podľa vlastného výberu!"
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "ketogénne"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715432-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716406",
    "title": "Špargľová a hrášková polievka: Skutočná pohodlná potravina",
    "category": "snack",
    "description": "Špargľová a hrášková polievka: Na prípravu tejto polievky je potrebných približne 20 minút od začiatku do konca.",
    "prepTime": 20,
    "servings": 2,
    "calories": 217,
    "protein": 11,
    "carbs": 29,
    "fat": 8,
    "fiber": 11,
    "ingredients": [
      {
        "name": "špargľa",
        "amount": "1 bag"
      },
      {
        "name": "evoo",
        "amount": "1 T"
      },
      {
        "name": "cesnak",
        "amount": "2 cloves"
      },
      {
        "name": "cibuľa",
        "amount": "0.5"
      },
      {
        "name": "hrášok",
        "amount": "2 c"
      },
      {
        "name": "zeleninový vývar",
        "amount": "1 box"
      }
    ],
    "steps": [
      "Nakrájajte cesnak a cibuľu.",
      "Na EVOO orestujte cibuľu a po niekoľkých minútach pridajte cesnak; varte, kým cibuľa nie je priesvitná.",
      "Pridajte celé vrecko špargle a všetko zalejte vývarom. Dochuťte soľou, korením a štipkou vločiek červenej papriky, ak ich používate.Varte, kým špargľa nie je jasne zelená a mäkká (ak ste špargľu rozmrazili, bude to trvať len pár minút). Vypnite oheň a ponorným mixérom rozmixujte na pyré.",
      "Pridajte hrášok (teplo polievky ho rýchlo rozmrazí) a pyré rozmixujte do hladka; pridávajte, kým nedosiahnete požadovanú hustotu.Na vrch dajte pažítku a malú lyžičku creme fraiche alebo kyslej smotany či gréckeho jogurtu."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "paleolit",
      "lakto-ovovegetarián",
      "primal",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716406-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-716437",
    "title": "Chladená uhorkovo avokádová polievka s jogurtom a kefírom",
    "category": "snack",
    "description": "Chladená uhorková avokádová polievka s jogurtom a kefírom je bezlepková, lakto-ovegetariánska a prim",
    "prepTime": 45,
    "servings": 3,
    "calories": 189,
    "protein": 9,
    "carbs": 24,
    "fat": 7,
    "fiber": 7,
    "ingredients": [
      {
        "name": "avokádo",
        "amount": "0.5"
      },
      {
        "name": "perzské uhorky",
        "amount": "5"
      },
      {
        "name": "hrozno",
        "amount": "1 small handful"
      },
      {
        "name": "šťava z citróna",
        "amount": "1"
      },
      {
        "name": "kefír",
        "amount": "0.5 cup"
      },
      {
        "name": "grécky jogurt",
        "amount": "0.5 cup"
      },
      {
        "name": "cibuľa",
        "amount": "0.25 cup"
      },
      {
        "name": "soľ a korenie",
        "amount": "3 servings"
      },
      {
        "name": "šupiny",
        "amount": "4"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [
      "bez lepku",
      "lakto-ovovegetarián",
      "primal"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716437-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-769754",
    "title": "Hovädzie dusené mrkvou",
    "category": "snack",
    "description": "Hovädzie dusené mrkvou môže byť práve bezlepkový, bezmliečny a celý 30 recept, ktorý ste hľadali",
    "prepTime": 45,
    "servings": 1,
    "calories": 87,
    "protein": 3,
    "carbs": 11,
    "fat": 4,
    "fiber": 2,
    "ingredients": [
      {
        "name": "vôňa listov",
        "amount": "1 tablespoon"
      },
      {
        "name": "hovädzie mäso",
        "amount": "8 Pieces"
      },
      {
        "name": "mrkva",
        "amount": "7 medium pieces"
      },
      {
        "name": "kari",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "cesnak",
        "amount": "1 clove"
      },
      {
        "name": "zázvor",
        "amount": "1 teaspoon"
      },
      {
        "name": "kocky na koreni",
        "amount": "1 serving"
      },
      {
        "name": "cibuľa",
        "amount": "1 small"
      },
      {
        "name": "lyžice na varenie zmiešanej zmesi tataše a korenia",
        "amount": "2"
      },
      {
        "name": "lyžice rastlinného oleja na varenie",
        "amount": "2"
      }
    ],
    "steps": [
      "Mrkvu oškrabte, umyte a uvarte do mäkka.",
      "Dajte ich do mixéra bez vody a pomeľte, kým sa úplne nerozdrvia.V hrnci rozohrejte olej a orestujte na ňom cibuľu, cesnak a zázvor.",
      "Vlejte zmes papriky Tatashe a hovädzieho mäsa a nechajte dusiť na miernom ohni asi 10-15 minút.Dochuťte kari, kockami korenia a všetkým, čo chcete pridať.",
      "Vsypte mrkvu, premiešajte a nechajte variť na miernom ohni ďalších 3-5 minút.",
      "Pridajte nasekané lístky vône, premiešajte a podávajte horúce s ryžou, batátmi, plantainom, cestovinami alebo inou prílohou podľa vlastného výberu."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "celých 30"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/769754-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716195",
    "title": "Pikantný hummus indického štýlu",
    "category": "snack",
    "description": "Stredovýchodných receptov nie je nikdy dosť, preto vyskúšajte pikantný hummus indického typu. Pre 44 c",
    "prepTime": 45,
    "servings": 12,
    "calories": 134,
    "protein": 5,
    "carbs": 15,
    "fat": 6,
    "fiber": 4,
    "ingredients": [
      {
        "name": "asafetida",
        "amount": "1 pinch"
      },
      {
        "name": "kajenské korenie",
        "amount": "0.25 teaspoon"
      },
      {
        "name": "cícer",
        "amount": "1.25 cups"
      },
      {
        "name": "pažítka",
        "amount": "0.25 cup"
      },
      {
        "name": "zázvor",
        "amount": "1 inch"
      },
      {
        "name": "petržlenová vňať",
        "amount": "0.5 cup"
      },
      {
        "name": "cesnak",
        "amount": "2 cloves"
      },
      {
        "name": "mletý koriander",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "mletá rasca",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "mleté korenie",
        "amount": "12 servings"
      }
    ],
    "steps": [
      "Cizrnu opláchnite a namočte na 8 hodín alebo na noc do niekoľkých centimetrov vody s trochou jogurtovej srvátky alebo citrónovej šťavy.",
      "Potom ich sceďte a opláchnite, prelejte do veľkého hrnca, zalejte niekoľkými centimetrami čerstvej vody, priveďte do varu, znížte teplotu na stredne nízku a prikryte.  Varte 1 až 1,5 hodiny alebo kým fazuľa nie je maslovo mäkká.",
      "Nechajte odkvapkať.V kuchynskom robote skombinujte všetky prísady a spracujte ich, kým nevznikne hustá a hladká pasta. Ak chcete redšiu pastu, možno budete musieť pridať viac olivového oleja alebo trochu vody. Na prípravu 3 šálok, výživové údaje sú založené na 1/4 šálky."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "lakto-ovovegetarián",
      "vegánske"
    ],
    "tags": [
      "Middle Eastern"
    ],
    "image": "https://img.spoonacular.com/recipes/716195-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-633330",
    "title": "Chlebové tyčinky zabalené v slanine",
    "category": "snack",
    "description": "Chlebové tyčinky v slanine by mohli byť práve tou hor d'oeuvre, ktorú hľadáte. Z tohto receptu pripravíte 4",
    "prepTime": 45,
    "servings": 4,
    "calories": 264,
    "protein": 14,
    "carbs": 7,
    "fat": 20,
    "fiber": 0,
    "ingredients": [
      {
        "name": "slanina",
        "amount": "6 slices"
      },
      {
        "name": "kajenské korenie",
        "amount": "1 teaspoon"
      },
      {
        "name": "cesnaková soľ",
        "amount": "2 teaspoons"
      },
      {
        "name": "dlhé tyčinky",
        "amount": "24"
      },
      {
        "name": "muškátový oriešok",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "parmezán",
        "amount": "1 cup"
      },
      {
        "name": "budete tiež potrebovať: pergamenový papier",
        "amount": "4 servings"
      }
    ],
    "steps": [
      "Predhrejte rúru na 350Preložte plech pergamenovým papierom.V stredne veľkej miske zmiešajte parmezán, cesnakovú soľ, kajenské korenie a muškátový oriešok.Jemne zabaľte každú tyčinku plátkom slaniny (aby sa tyčinky nelámali), potom položte zabalené tyčinky na plech vyložený pergamenovým papierom. Ak sa vám niektorá zlomí, slaninu jednoducho nakrájajte a pridajte na plech. Nikomu nebude vadiť, ak budú kúsky malé.",
      "Pečte 15 minút alebo kým nie je slanina upečená podľa vašich predstáv.Potom tyčinky obaľte v syre a korení. Urobte to, kým sú slanina a tyčinky ešte teplé, potom ich odložte a nechajte vychladnúť. (Peter túto časť miluje!)Môžeme pripraviť deň vopred a chutia výborne aj studené (hej, je to slanina)!"
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/633330-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-641461",
    "title": "Deviled Eggs with Crab",
    "category": "snack",
    "description": "Deviled Eggs With Crab vyžaduje približne 45 minút od začiatku do konca. Jedna porcia obsahuje 120 ca",
    "prepTime": 45,
    "servings": 6,
    "calories": 120,
    "protein": 10,
    "carbs": 1,
    "fat": 8,
    "fiber": 0,
    "ingredients": [
      {
        "name": "zeler",
        "amount": "0.5 stick"
      },
      {
        "name": "dijónska horčica",
        "amount": "1 tablespoon"
      },
      {
        "name": "vajcia uvarené natvrdo",
        "amount": "6"
      },
      {
        "name": "pažítka",
        "amount": "3 tablespoons"
      },
      {
        "name": "citrónová šťava",
        "amount": "1 tablespoon"
      },
      {
        "name": "hrudkové krabie mäso",
        "amount": "4 ounces"
      },
      {
        "name": "majonéza",
        "amount": "1 tablespoon"
      },
      {
        "name": "soľ a korenie",
        "amount": "6 servings"
      },
      {
        "name": "krém",
        "amount": "2 tablespoons"
      }
    ],
    "steps": [
      "V stredne veľkej miske zmiešajte krabie mäso, zeler, kyslú smotanu, majonézu, dijonskú horčicu, citrónovú šťavu a pažítku. Premiešajte, kým sa zmes dobre nespojí.Podľa chuti ju dochuťte soľou a korením.Krabie zmesi vložte do polovičiek vajec.",
      "Podávajte ihneď alebo vychladené, kým nie je hotové."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "pescatariánske",
      "ketogénne"
    ],
    "tags": [
      "American"
    ],
    "image": "https://img.spoonacular.com/recipes/641461-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716351",
    "title": "Banánový mliečny kokteil Milo",
    "category": "smoothie",
    "description": "Banánový mliečny koktail vyžaduje približne 45 minút od začiatku do konca. Jedna porcia obsahuje 284 kalórií",
    "prepTime": 45,
    "servings": 1,
    "calories": 284,
    "protein": 4,
    "carbs": 51,
    "fat": 9,
    "fiber": 6,
    "ingredients": [
      {
        "name": "mandľové mlieko",
        "amount": "0.5 cup"
      },
      {
        "name": "banán",
        "amount": "1 large"
      },
      {
        "name": "Milo čokoládový slad v prášku",
        "amount": "1 tablespoon"
      },
      {
        "name": "jahody",
        "amount": "1 Handful"
      },
      {
        "name": "vanilková zmrzlina",
        "amount": "2 tablespoons"
      },
      {
        "name": "šľahačka",
        "amount": "0.25 cup"
      }
    ],
    "steps": [
      "Do mixéra nalejte mlieko, mlieko, banán a zmrzlinu a rozmixujte do hladka.",
      "Nalejte do pohára, na vrch nastriekajte šľahačku a posypte nakrájanými jahodami.",
      "Podávajte chladné.    Pre tých, ktorí sa pýtajú, tu je odkaz na prípravu šľahačky."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716351-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716301",
    "title": "Medový zázvorový citrónový ľadový čaj",
    "category": "smoothie",
    "description": "Honey Ginger Lemon Iced Tean je nápoj, ktorý sa podáva 1. Jedna porcia obsahuje 145 kalórií, 0 g p",
    "prepTime": 45,
    "servings": 1,
    "calories": 145,
    "protein": 0,
    "carbs": 39,
    "fat": 0,
    "fiber": 1,
    "ingredients": [
      {
        "name": "zázvor",
        "amount": "1 small piece"
      },
      {
        "name": "čajové vrecúško",
        "amount": "1"
      },
      {
        "name": "med",
        "amount": "2 tablespoons"
      },
      {
        "name": "citrónová šťava",
        "amount": "3 tablespoons"
      },
      {
        "name": "lístky mäty",
        "amount": "2"
      }
    ],
    "steps": [
      "Prevarte 1-2 šálky vody a uvarte si čaj.",
      "Čaj vložte do chladničky, aby sa ochladil.Zázvor rozmixujte a prepasírujte cez sitko, aby ste získali len šťavu.V džbáne s ľadom zmiešajte čaj, zázvorovú šťavu, citrónovú šťavu a med.",
      "Pridajte lístky mäty a podávajte studené."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "paleolit",
      "lakto-ovovegetarián",
      "primal"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716301-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716252",
    "title": "Mliečny melónový nápoj",
    "category": "smoothie",
    "description": "Mliečny melónový nápoj by mohol byť dobrým receptom na rozšírenie vašej škatuľky s receptami na nápoje. Jedna porcia tohto",
    "prepTime": 45,
    "servings": 1,
    "calories": 193,
    "protein": 8,
    "carbs": 24,
    "fat": 8,
    "fiber": 1,
    "ingredients": [
      {
        "name": "dátumy",
        "amount": "2 pieces"
      },
      {
        "name": "odparené mlieko",
        "amount": "7 tablespoons"
      },
      {
        "name": "zázvor",
        "amount": "0.25 teaspoon"
      },
      {
        "name": "ľad",
        "amount": "0.25 cup"
      },
      {
        "name": "rozmixovaný melón",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Všetky ingrediencie rozmixujte do hladka a podávajte vychladené.P:S - Ak vás zaujíma, kde kúpiť datle, pozrite sa do supermarketov alebo k hauským obchodníkom na trhu. Je pravdepodobnejšie, že budú mať datle. Viete niekto, ako sa datle nazývajú v jazyku hausa? Zanechajte komentár a pomôžte ostatným."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "lakto-ovovegetarián"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716252-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715595",
    "title": "Ako pripraviť najsyrovejší Mac and Cheese s motýlikmi",
    "category": "vecera",
    "description": "Ako si pripraviť najsyrovejší Mac and Cheese môže byť práve tým hlavným chodom, ktorý hľadáte.",
    "prepTime": 35,
    "servings": 4,
    "calories": 780,
    "protein": 28,
    "carbs": 86,
    "fat": 35,
    "fiber": 4,
    "ingredients": [
      {
        "name": "cestoviny bowtie variť podľa pokynov",
        "amount": "1 package"
      },
      {
        "name": "extra ostrý syr čedar",
        "amount": "1 cup"
      },
      {
        "name": "extra ostrý syr čedar",
        "amount": "1 cup"
      },
      {
        "name": "soľ a korenie",
        "amount": "1 tsp"
      },
      {
        "name": "krém",
        "amount": "0.25 cup"
      },
      {
        "name": "maslo",
        "amount": "0.25 cup"
      },
      {
        "name": "petržlenová vňať",
        "amount": "4 servings"
      }
    ],
    "steps": [
      "Rozohrejte rúru na 350 stupňov Fahrenheita a potom uvarte cestoviny podľa návodu.",
      "Syr rozdrvte.",
      "Do stredne veľkej misy pridajte uvarené rezance, syr, kyslú smotanu, soľ, korenie a maslo a premiešajte.",
      "Pridáme do pripravenej zapekacej misy 9 x 13, podľa potreby posypeme ďalším syrom a pečieme 20 minút.",
      "Vyberte z rúry a podávajte horúce."
    ],
    "allergens": [],
    "dietary": [
      "lakto-ovovegetarián"
    ],
    "tags": [
      "American"
    ],
    "image": "https://img.spoonacular.com/recipes/715595-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715420",
    "title": "Grilované kuracie karfiolové misky s kuskusom",
    "category": "vecera",
    "description": "Grilované kuracie misy s karfiolom a kuskusom potrebujú od začiatku do konca asi 45 minút. Za 1,8 dolára",
    "prepTime": 45,
    "servings": 4,
    "calories": 381,
    "protein": 20,
    "carbs": 28,
    "fat": 22,
    "fiber": 4,
    "ingredients": [
      {
        "name": "pražené a mandle",
        "amount": "0.5 cup"
      },
      {
        "name": "barbecue omáčka",
        "amount": "0.5 cup"
      },
      {
        "name": "karfiol",
        "amount": "1 small head"
      },
      {
        "name": "koriander",
        "amount": "2 tablespoons"
      },
      {
        "name": "cesnak",
        "amount": "4 cloves"
      },
      {
        "name": "cesnakový prášok",
        "amount": "1 teaspoon"
      },
      {
        "name": "olivový olej",
        "amount": "2 tablespoons"
      },
      {
        "name": "pomarančový džús",
        "amount": "0.33333334 cup"
      },
      {
        "name": "syr pecorino romano",
        "amount": "0.25 cup"
      },
      {
        "name": "morská soľ a korenie",
        "amount": "4 servings"
      }
    ],
    "steps": [
      "V plytkej miske zmiešajte grilovací dresing, pomarančovú šťavu a sójovú omáčku.",
      "Pridajte kuracie prsia a premiešajte, aby sa úplne obalilo. Odstavte, aby sa marinovali, kým si pripravíte ostatné prísady.",
      "Do misky kuchynského robota vložte ružičky karfiolu. Pulzujte 5-6-krát, kým karfiol nezíska štruktúru kuskusu. Odstavte.",
      "Vo veľkej panvici na strednom ohni rozohrejte maslo.",
      "Pridajte cibuľu a varte ju, kým nezmäkne, približne 5-6 minút.",
      "Pridajte karfiol, cesnakový prášok a soľ a čierne korenie podľa chuti. Premiešajte. Varte ďalších 5 minút."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bbq",
      "Barbecue"
    ],
    "image": "https://img.spoonacular.com/recipes/715420-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716408",
    "title": "Pečené ryby na grécky spôsob: Svieža, jednoduchá a chutná",
    "category": "vecera",
    "description": "Pečené ryby na grécky spôsob: Môže to byť práve ten stredomorský recept, ktorý hľadáte: svieži, jednoduchý a chutný",
    "prepTime": 30,
    "servings": 4,
    "calories": 344,
    "protein": 28,
    "carbs": 28,
    "fat": 12,
    "fiber": 2,
    "ingredients": [
      {
        "name": "paprika",
        "amount": "1"
      },
      {
        "name": "ryža",
        "amount": "4 servings"
      },
      {
        "name": "bazalka",
        "amount": "1 tsp"
      },
      {
        "name": "syr feta",
        "amount": "2 oz"
      },
      {
        "name": "rybie filé",
        "amount": "1 lb"
      },
      {
        "name": "olivový olej",
        "amount": "2 Tablespoons"
      },
      {
        "name": "oregano",
        "amount": "1 tsp"
      },
      {
        "name": "korenie",
        "amount": "4 servings"
      },
      {
        "name": "cibuľa",
        "amount": "0.5"
      },
      {
        "name": "soľ a korenie",
        "amount": "4 servings"
      }
    ],
    "steps": [
      "Predhrejte rúru na 450 stupňov F. Vyberte si nádobu na pečenie, do ktorej sa ryba zmestí bez toho, aby sa prekrývala, a postriekajte ju sprejom na pečenie.",
      "Rybie filé položte do pekáča v jednej vrstve, osoľte a okoreňte, potom rybu obložte červenou cibuľou a paprikou.",
      "Posypte sušenou bazalkou a oreganom, paradajkami a syrom feta, potom pokvapkajte bielym vínom a olivovým olejom. Navrch nastrúhajte trochu čerstvého korenia.",
      "Pečte odkryté asi 12 - 15 minút alebo kým sa ryba ľahko odlupuje vidličkou. Na upečenú rybu vytlačte plátky citróna, ozdobte čerstvou bazalkou a/alebo oreganom a podávajte s horúcou varenou ryžou."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "pescatarian"
    ],
    "tags": [
      "Mediterranean",
      "European",
      "Greek"
    ],
    "image": "https://img.spoonacular.com/recipes/716408-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-715493",
    "title": "Červená fazuľa a ryža v pomalom variči",
    "category": "vecera",
    "description": "Červená fazuľa s ryžou v pomalom hrnci by mohla byť práve tým bezlepkovým receptom, ktorý ste hľadali. Tento re",
    "prepTime": 45,
    "servings": 5,
    "calories": 639,
    "protein": 29,
    "carbs": 63,
    "fat": 31,
    "fiber": 12,
    "ingredients": [
      {
        "name": "Ancho chilli prášok",
        "amount": "1 tsp"
      },
      {
        "name": "bobkové listy",
        "amount": "3"
      },
      {
        "name": "maslo",
        "amount": "1 Tbsp"
      },
      {
        "name": "fazuľa",
        "amount": "30 oz"
      },
      {
        "name": "konzervované paradajky",
        "amount": "15 oz"
      },
      {
        "name": "kajenské korenie",
        "amount": "1 tsp"
      },
      {
        "name": "cibuľa",
        "amount": "0.5"
      },
      {
        "name": "ryža",
        "amount": "1 cup"
      },
      {
        "name": "klobása",
        "amount": "18 oz"
      },
      {
        "name": "voda",
        "amount": "2.5 cups"
      }
    ],
    "steps": [
      "Všetky ingrediencie vložte do pomalého hrnca a premiešajte, aby sa všetko dobre premiešalo. Nechajte variť celý deň na nízkom stupni 6 hodín (ak je s ryžou) alebo dlhšie, ak je to potrebné bez ryže.",
      "Podávajte s kukuričným chlebom a pochutnajte si! (Ja si rada vezmem celý kus a poriadne ho premiešam, MŇAM!)"
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715493-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716297",
    "title": "Predjedlo z kreviet v chlebe a pikantnej majonézy",
    "category": "vecera",
    "description": "Krevety v chlebe a pikantné majonéza Predjedlo môže byť dobrým receptom na rozšírenie vášho hlavného chodu recept box",
    "prepTime": 20,
    "servings": 4,
    "calories": 258,
    "protein": 13,
    "carbs": 33,
    "fat": 8,
    "fiber": 2,
    "ingredients": [
      {
        "name": "univerzálna múka",
        "amount": "0.75 cup"
      },
      {
        "name": "strúhanka",
        "amount": "0.75 cup"
      },
      {
        "name": "čili prášok",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "vajcia",
        "amount": "1"
      },
      {
        "name": "cesnakový prášok",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "majonéza",
        "amount": "2 tablespoon"
      },
      {
        "name": "cibuľový prášok",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "korenie suya",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "soľ",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "krevety",
        "amount": "12 jumbo"
      }
    ],
    "steps": [
      "Krevety olúpte a zbavte ich jadier. Ak chcete, môžete krevetám ponechať chvost. Ochuťte korením suya a odložte bokom.",
      "Rozšľahajte vajce a odložte ho bokom.V miske s múkou zmiešajte cibuľový prášok, cesnakový prášok, soľ, chilli a odložte.Vezmite ochutené krevety a potrite ich v ochutenej múke, namočte ich do vaječnej zmesi a obalte v strúhanke.",
      "Rozpáľte olej na vyprážanie a krevety opečte z oboch strán dozlatista.Na pikantnú majonézu,",
      "Zmiešajte 2 polievkové lyžice majonézy s jednou polievkovou lyžicou omáčky sriracha, kým sa poriadne nepremieša.",
      "Podávajte ho s krevetami obalenými v pečive."
    ],
    "allergens": [],
    "dietary": [
      "bez mliečnych výrobkov",
      "pescatarian"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716297-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-716296",
    "title": "Kuracie mäso Peri Peri a pikantná ryža",
    "category": "vecera",
    "description": "Recept Peri Peri kuracie mäso a pikantná ryža pripravíte za približne 45 minút. Za 1,43 dolára za porciu",
    "prepTime": 45,
    "servings": 6,
    "calories": 395,
    "protein": 30,
    "carbs": 7,
    "fat": 27,
    "fiber": 3,
    "ingredients": [
      {
        "name": "paprika",
        "amount": "1"
      },
      {
        "name": "chilli papričky vtáčie oko",
        "amount": "5"
      },
      {
        "name": "korenie",
        "amount": "1 teaspoon"
      },
      {
        "name": "kuracie kúsky",
        "amount": "8"
      },
      {
        "name": "chilli v prášku",
        "amount": "0.5 teaspoon"
      },
      {
        "name": "cesnak",
        "amount": "5 cloves"
      },
      {
        "name": "zázvor",
        "amount": "0.5 inch"
      },
      {
        "name": "kocka korenia",
        "amount": "1"
      },
      {
        "name": "citrón",
        "amount": "1"
      },
      {
        "name": "cibuľa",
        "amount": "0.5"
      }
    ],
    "steps": [
      "Umyte kurča a odložte ho bokom.Zmiešajte všetky ingrediencie a podľa potreby ich nalejte na kurča. Votrite ju do kurčaťa a nechajte marinovať približne 3 - 5 hodín.Ak máte gril, rozohrejte ho a položte naň kurča. Ak nemáte a používate rúru, najprv nastavte rúru na grilovanie/pečenie a nechajte kurča opekať z oboch strán, potom rúru prepnite na pečenie pri teplote 370 F a pečte kurča, kým nie je upečené. ak vám zostane omáčka zo zmesi, zohrejte ju s trochou vody a podávajte s kuracím mäsom peri peri. Pikantná ryža",
      "Ingrediencie2 šálky ryže1/2 cibule1/4 libry kapusty1 šálka nakrájanej mrkvy1 vajce1 šálka rozpusteného masla",
      "Korenie na kuracie mäso1 čajová lyžička karišpetka tymiánu Ryžu umyte a varte 10 minút.",
      "V hrnci rozohrejte maslo, nasypte doň nakrájanú cibuľu, mrkvu a kapustu a premiešajte.Do zmesi zeleniny rozbite vajce a premiešajte.",
      "Pridajte korenie a vsypte parenú ryžu.",
      "Zalejte 1 šálkou vody a varte na miernom ohni, kým ryža nezmäkne. Premiešajte a podávajte s kuracím mäsom."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "celých 30",
      "ketogénne"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716296-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716311",
    "title": "Mango vyprážaná ryža",
    "category": "vecera",
    "description": "Mango Fried Rice je čínske hlavné jedlo. Z tohto receptu sa pripravujú 2 porcie s obsahom 486 kalórií, 16 g",
    "prepTime": 45,
    "servings": 2,
    "calories": 486,
    "protein": 16,
    "carbs": 95,
    "fat": 4,
    "fiber": 5,
    "ingredients": [
      {
        "name": "kurací vývar",
        "amount": "2 cups"
      },
      {
        "name": "kocky korenia",
        "amount": "2 servings"
      },
      {
        "name": "mango",
        "amount": "3 slices"
      },
      {
        "name": "ryža",
        "amount": "1 cup"
      },
      {
        "name": "zelenina",
        "amount": "1 cup"
      },
      {
        "name": "škótske čierne korenie",
        "amount": "1"
      }
    ],
    "steps": [
      "Umyte ryžu a priveďte ju do varu na strednom ohni s malým množstvom vody, pretože ju budete variť v kuracom vývare.Keď je ryža mierne mäkká a počiatočná voda vyschne, znížte teplotu a prilejte kurací vývar a varte, kým sa všetok kurací vývar nevstrebe a nevysuší. Ak je kurací vývar čerstvo pripravený, bude obsahovať trochu oleja z kurčaťa, takže ryža nepotrebuje olej. zvýšte teplotu a vmiešajte nakrájanú zeleninu a korenie.",
      "Nakoniec vmiešajte na kocky nakrájané mango a podávajte teplé s ľubovoľnou bielkovinou podľa vlastného výberu. Ja by som povedal, že s kuracím mäsom, ale je to na vás."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov"
    ],
    "tags": [
      "Chinese",
      "Asian"
    ],
    "image": "https://img.spoonacular.com/recipes/716311-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716421",
    "title": "Grilovaná broskyňa Melba s vanilkovým mrazeným jogurtom",
    "category": "vecera",
    "description": "Ak máte v kuchyni približne 45 minút, Grilovaná broskyňa Melba s vanilkovými zrnkami",
    "prepTime": 45,
    "servings": 4,
    "calories": 377,
    "protein": 17,
    "carbs": 49,
    "fat": 15,
    "fiber": 4,
    "ingredients": [
      {
        "name": "kokosový olej",
        "amount": "4 servings"
      },
      {
        "name": "med",
        "amount": "0.25 cup"
      },
      {
        "name": "med",
        "amount": "2 T"
      },
      {
        "name": "broskyne",
        "amount": "2 large"
      },
      {
        "name": "grécky jogurt",
        "amount": "3 cups"
      },
      {
        "name": "maliny",
        "amount": "1.5 cups"
      },
      {
        "name": "malinová ovocná nátierka",
        "amount": "2 tsp"
      },
      {
        "name": "vanilkové zrnko",
        "amount": "1"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "lakto-ovovegetarián"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716421-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715573",
    "title": "Jednoduché lasagne v panvici",
    "category": "vecera",
    "description": "Stredomorských receptov nie je nikdy dosť, preto vyskúšajte jednoduchú panvicu Lasagnan. Za 2,67 dolára",
    "prepTime": 35,
    "servings": 5,
    "calories": 761,
    "protein": 31,
    "carbs": 58,
    "fat": 46,
    "fiber": 6,
    "ingredients": [
      {
        "name": "bazalka a vetvička bazalky",
        "amount": "1 leaves"
      },
      {
        "name": "paradajky",
        "amount": "56 oz"
      },
      {
        "name": "cesnak",
        "amount": "3 cloves"
      },
      {
        "name": "klobása",
        "amount": "1.5 lbs"
      },
      {
        "name": "m syr zarella",
        "amount": "1 oz"
      },
      {
        "name": "cibuľa",
        "amount": "1 small"
      },
      {
        "name": "oreganové vločky",
        "amount": "5 servings"
      },
      {
        "name": "rezance na lasagne bez varenia",
        "amount": "5 servings"
      },
      {
        "name": "vločky korenia",
        "amount": "0.5 tsp"
      },
      {
        "name": "syr ricotta",
        "amount": "5 servings"
      }
    ],
    "steps": [
      "Vo veľkej panvici rozohrejte olej na vysokú teplotu.",
      "Pridajte klobásu a varte, kým nezhnedne, približne 3-5 minút.",
      "Presuňte ju do vedľajšej misky a odložte.Znížte teplotu na stredne nízku a pridajte cibuľu, cesnak a vločky korenia. Varte, kým cibuľa nezmäkne, približne 8 minút.",
      "Pridajte oregano, paradajky a ich šťavu (ak chcete, rozdrvte celé paradajky rukami alebo mixérom), vetvičku bazalky a uvarenú klobásu.",
      "Osolíme, okoreníme a dusíme asi 5 minút.Polovicu rezancov lasagní rozlomíme na polovicu a vložíme do mäsovej zmesi pod klobásu. Rovnomerne ich rozdeľte po celej ploche. Vezmite druhú polovicu rezancov a pomocou lyžice ich ponorte do panvice. na lasagne naneste Ricottu a premiešajte ju s omáčkou. Navrch nasypte Mozzarellu a pečte v rúre na 325 stupňov 15 minút. Posypte bazalkou, potom odstráňte z ohňa a pred podávaním nechajte vychladnúť."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [
      "Mediterranean",
      "Italian",
      "European"
    ],
    "image": "https://img.spoonacular.com/recipes/715573-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716429",
    "title": "Cestoviny s cesnakom, šupinami, karfiolom a strúhankou",
    "category": "vecera",
    "description": "Receptov na hlavné jedlá nie je nikdy dosť, preto si dajte cestoviny s cesnakom, šupinami, karfiolom a",
    "prepTime": 45,
    "servings": 2,
    "calories": 543,
    "protein": 17,
    "carbs": 84,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "maslo",
        "amount": "1 tbsp"
      },
      {
        "name": "ružičky karfiolu",
        "amount": "2 cups"
      },
      {
        "name": "syr",
        "amount": "2 tbsp"
      },
      {
        "name": "extra panenský olivový olej",
        "amount": "1 tbsp"
      },
      {
        "name": "cesnak",
        "amount": "5 cloves"
      },
      {
        "name": "cestoviny",
        "amount": "6 ounces"
      },
      {
        "name": "pár vločiek korenia",
        "amount": "2 pinches"
      },
      {
        "name": "soľ a korenie",
        "amount": "2 servings"
      },
      {
        "name": "šupiny",
        "amount": "3"
      },
      {
        "name": "biele víno",
        "amount": "2 tbsp"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716429-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-640383",
    "title": "Brusnicová margarita",
    "category": "smoothie",
    "description": "Brusnicová margarita trvá od začiatku do konca približne 1 hodinu. Jedna porcia tohto jedla obsahuje približne",
    "prepTime": 60,
    "servings": 6,
    "calories": 379,
    "protein": 1,
    "carbs": 67,
    "fat": 0,
    "fiber": 3,
    "ingredients": [
      {
        "name": "brusnice",
        "amount": "16 ounces"
      },
      {
        "name": "grand marnier",
        "amount": "3 ounces"
      },
      {
        "name": "pomarančový džús",
        "amount": "1 cup"
      },
      {
        "name": "sirup karo",
        "amount": "6 servings"
      },
      {
        "name": "cukor",
        "amount": "1 cup"
      },
      {
        "name": "tequila",
        "amount": "9 ounce"
      }
    ],
    "steps": [
      "V hrnci na miernom ohni rozpustite šálku cukru v pomarančovej šťave.",
      "Pridajte brusnice, časť si nechajte na špízy, a varte na miernom ohni 10 minút. Odstavte a nechajte vychladnúť. Brusnice rozmixujte v mixéri a potom ich preceďte na pyré.",
      "Do šejkra pridajte rozdrvený ľad, 1 a pol unce tequily, 1/2 unce Grand Marnier, 2 unce brusnicového pyré a pretrepte.Na 10 špízových tyčiniek napichnite niekoľko brusníc, ale na jednom konci nechajte špíz dostatočne odhalený. Každý brusnicový špíz zľahka potrite sirupom Karo a potom brusnicové špízy posypte ďalším cukrom.",
      "Brusnicové tyčinky položte na voskový papier a vložte do mrazničky, aby stuhli.",
      "Nalejte nápoj do pohára na martini s cukrovou obrubou.",
      "Na ozdobu pridajte brusnicovú tyčinku.Poznámka: výživové údaje nezahŕňajú cukor na okraji."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "lakto-ovovegetarián",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/640383-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-798956",
    "title": "Mango banánové kokosové smoothie",
    "category": "smoothie",
    "description": "Mango Banana Coconut Smoothie je bezlepkové, bezmliečne, paleolitické a lakto-ovovegetariánske br",
    "prepTime": 45,
    "servings": 4,
    "calories": 138,
    "protein": 2,
    "carbs": 17,
    "fat": 8,
    "fiber": 2,
    "ingredients": [
      {
        "name": "banán",
        "amount": "0.6666667 cup"
      },
      {
        "name": "kokosové mlieko",
        "amount": "0.6666667 cup"
      },
      {
        "name": "dátumy",
        "amount": "3"
      },
      {
        "name": "kúsky manga",
        "amount": "1 cup"
      },
      {
        "name": "kurkuma",
        "amount": "1 teaspoon"
      },
      {
        "name": "voda",
        "amount": "1.5 cups"
      }
    ],
    "steps": [
      "Banán si pripravte večer predtým. Banán ošúpeme, nakrájame na plátky a položíme na malý pergamenom vystlaný plech. To isté môžete urobiť aj s mangom, ale ja som pre väčšie pohodlie použila mrazené kúsky manga. všetky prísady vhoďte do mixéra a rozmixujte do hladka, v prípade potreby pridajte viac vody. Ak chcete, pridajte trochu čerstvo vylisovanej pomarančovej šťavy pre citrusovú chuť.",
      "Podávajte studené."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bez mliečnych výrobkov",
      "paleolit",
      "lakto-ovovegetarián",
      "primal",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/798956-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-639749",
    "title": "Vegánsky mliečny kokteil s kokosovým krémom",
    "category": "smoothie",
    "description": "Kokosový koláč Vegánsky mliečny kokteil môže byť práve ten nápoj, ktorý hľadáte. Tento recept sa",
    "prepTime": 45,
    "servings": 3,
    "calories": 268,
    "protein": 2,
    "carbs": 21,
    "fat": 20,
    "fiber": 4,
    "ingredients": [
      {
        "name": "kokosové mäso",
        "amount": "1 cup"
      },
      {
        "name": "citrónová šťava",
        "amount": "1 tablespoon"
      },
      {
        "name": "kokosový olej",
        "amount": "1 tablespoon"
      },
      {
        "name": "kokosové mlieko",
        "amount": "1 cup"
      },
      {
        "name": "banán",
        "amount": "1"
      },
      {
        "name": "vanilkový extrakt",
        "amount": "1 teaspoon"
      },
      {
        "name": "omrvinky z grahamových sušienok",
        "amount": "2 tablespoons"
      },
      {
        "name": "kokosové vločky",
        "amount": "1 tablespoon"
      },
      {
        "name": "kocky ľadu",
        "amount": "3 servings"
      }
    ],
    "steps": [
      "V mixéri zmiešajte kokosové mäso, citrónovú šťavu, kokosový olej, kokosové mlieko, banán, vanilku, agávový nektár (voliteľne) a grahamové sušienky; rozmixujte do hladka.",
      "Navrch dajte sójovú alebo mliečnu šľahačku, posypte ďalšími grahamovými sušienkami a ozdobte opraženými kokosovými vločkami."
    ],
    "allergens": [],
    "dietary": [
      "bez mliečnych výrobkov",
      "lakto-ovovegetarián",
      "vegánske"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/639749-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-bbg-kura-s-mango-salsou",
    "title": "BBG kura s mango salsou",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Manga, očistené a nakrájané",
        "amount": "50 g"
      },
      {
        "name": "Kukuric",
        "amount": "50g"
      },
      {
        "name": "Limetkovej šťavy",
        "amount": "1 ČL"
      },
      {
        "name": "Cherry rajčín",
        "amount": "80g"
      },
      {
        "name": "Olivového oleja",
        "amount": "10 ml"
      },
      {
        "name": "Červenej cibul",
        "amount": "15 g"
      },
      {
        "name": "Sójovej omáčky",
        "amount": "10 ml"
      },
      {
        "name": "Červenej papriky",
        "amount": "40 g"
      },
      {
        "name": "Cesnaku, pretlačeného",
        "amount": "3g"
      },
      {
        "name": "Avokáda",
        "amount": "30g"
      },
      {
        "name": "Sriracha omáčky",
        "amount": "½ ČL"
      },
      {
        "name": "kurkumy",
        "amount": "½ ČL"
      },
      {
        "name": "Čerstvého koriandru",
        "amount": "½ šálky"
      }
    ],
    "steps": [
      "Medzitým si priprav šalát: kukuricu uvar podľa inštrukcií na obale a nechaj",
      "Keď sa kuracie mäso domarínovalo, upeč ho na BBG alebo na nepriľnavej panvici. Servíruj so šalátom a kura prelej zvyškom mangovej omáčky."
    ],
    "allergens": [
      "dairy",
      "soy"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-bata-tovy-kola-c-z-mlete-ho-ma-sa",
    "title": "Batátový koláč z mletého mäsa",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Paradajkovej pasty",
        "amount": "2 ks"
      },
      {
        "name": "Mletého hovädzieho mäsa",
        "amount": "500 g"
      },
      {
        "name": "na postriekanie Olivový olej v spreji",
        "amount": ""
      },
      {
        "name": "Paradajok v plechovk",
        "amount": "400 g"
      },
      {
        "name": "Sladkých zemiakov",
        "amount": "400 g"
      },
      {
        "name": "Šošovice v plechovk",
        "amount": "400 g"
      },
      {
        "name": "podľa chuti Soľ, korenie a petržlen",
        "amount": ""
      },
      {
        "name": "P L Čerstvá vňať na ozdobu",
        "amount": "1"
      },
      {
        "name": "+ 1 cibuľa zahradny salat",
        "amount": "1 ks"
      },
      {
        "name": "Mrkvy m , ,",
        "amount": "2"
      },
      {
        "name": "Šálka špenátu",
        "amount": "1"
      },
      {
        "name": "Stonky zeleru",
        "amount": "2"
      },
      {
        "name": "Cesnaku",
        "amount": "2 strúčiky"
      }
    ],
    "steps": [
      "Sladké zemiaky nakrájaj na stredne veľké kúsky a uvar ich v pare, kým nezmäknú. Potom ich roztlač na kašu a odlož bokom.",
      "Rúru predohrej na 180 stupňov. Na veľkej nepriľnavej panvici zohrej olivový olej. Cibuľu, zeler a mrkvu nakrájaj na kocky a 2 - 4 minúty orestuj. Pridaj cesnak a restuj ďalšie 2 minúty. Do panvice pridaj mleté mäso a za stáleho miešania ho nechaj 3 - 4 minúty zhnednúť. Pridaj zvyšok ingrediencií a priveď do varu. stlm na mierny oheň a dochuť podľa chuti.",
      "Veľkú zapekaciu misu vylož papierom na pečenie alebo potri trochou olivoého oleja. Na dno navrstvi zmes z panvice a potom naň rovnomerne rozotri zemiakovú kašu. Posyp parmezánom alebo lahôdkovým droždím. Peč v rúre 15 - 20 minút dozlatista.",
      "Záhradný šalát - do misy daj špenát, nakrájané paradajky, nakrájanú mrkvu, nakrájanú uhorku, nakrájanú červenú cibuľu a koriander, premiešaj s balzamikovým octom a limetkovou šťavou a podávaj spolu s kúskom koláča."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-bata-tovy-s-ala-t-s-ryz-ou-a-s-os-ovicou",
    "title": "Batátový šalát s ryžou a šošovicou",
    "category": "vecera",
    "description": "Ľahká večera - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Batáty, ošúpané",
        "amount": "150 g"
      },
      {
        "name": "Nakrájaných",
        "amount": "100 g"
      },
      {
        "name": "dijónskej horčic",
        "amount": "1 Cl"
      },
      {
        "name": "P L Hnedej šošovice .",
        "amount": "1"
      },
      {
        "name": "medu",
        "amount": "cl"
      },
      {
        "name": "Šálka špenátu . shire",
        "amount": "1"
      },
      {
        "name": "Brokolice, nakrájanej * soľ a čierne koreni",
        "amount": "½"
      },
      {
        "name": "Šálka rukoly",
        "amount": "1"
      },
      {
        "name": "sušených brusníc",
        "amount": "½ Hrste"
      },
      {
        "name": "Tekvicových semiačok",
        "amount": "10g"
      },
      {
        "name": "P L Gréckeho jogurtu alebo",
        "amount": "1"
      }
    ],
    "steps": [
      "Rúru zohrej na 200 stupňov. Batáty poukladaj na veľký plech, pokrop olivovým olejom a peč 45 minút, alebo domäkka.",
      "Medzitým si uvar ryžu a šošovicu vo vriacej, osolenej vode asi 20 minút.",
      "Na posledné štyri minúty pridaj brokolicu a nechaj dovariť. Dobre sceď a pridaj špenát, rukolu, brusnice a tekvicové semiačka s trochou korenia (napríklad soli a čierneho korenia).",
      "Nakoniec primiešaj upečené batáty a polej gréckym jogurtom alebo pripraveným dressingom."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-falafel-wrap",
    "title": "Falafelový zábal",
    "category": "vecera",
    "description": "Ľahká večera - vegetariánske",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Špaldový wrap",
        "amount": "1 ks"
      },
      {
        "name": "P L Hummusu",
        "amount": "1"
      },
      {
        "name": "Falafel guličiek",
        "amount": "150 g"
      },
      {
        "name": "Rajčiny",
        "amount": "1 ks"
      },
      {
        "name": "% uhorky",
        "amount": "½ ks"
      },
      {
        "name": "Nízkotučného syra alebo syrovej náhrady",
        "amount": "15g"
      },
      {
        "name": "Špenátu",
        "amount": "2 hrste"
      },
      {
        "name": "P L Tabouli",
        "amount": "1,5"
      },
      {
        "name": "Pl tzatziki alebo gréckeho jogurtu",
        "amount": "150 g"
      },
      {
        "name": "Limetkovej šťavy",
        "amount": "½ ks"
      }
    ],
    "steps": [
      "Na wrap si rovnomerne potri hummus a naukladaj naň falafel. Pridajte zvyšné"
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-grilovany-mexicky-s-ala-t",
    "title": "Grilovaný mexický šalát",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Olúpaných surových kreviet",
        "amount": "300 g"
      },
      {
        "name": "1/4 červenej cibul",
        "amount": "1 ks"
      },
      {
        "name": "(alebo ryby/ kuracie mäso)",
        "amount": "½ ks"
      },
      {
        "name": "Šálka varenej hnedej ryž",
        "amount": "1"
      },
      {
        "name": "P L nasekaného 1/2 zväzku koriandra",
        "amount": "1"
      },
      {
        "name": "Kukurica",
        "amount": "1"
      },
      {
        "name": "Lyžička mletej papriky",
        "amount": "1"
      },
      {
        "name": "Čiernej fazule z plechovky",
        "amount": "200 g"
      },
      {
        "name": "Cherry paradajok",
        "amount": "120 g"
      },
      {
        "name": "Malá uhorka",
        "amount": "1"
      },
      {
        "name": "Polievková lyžica sladkej",
        "amount": "1"
      },
      {
        "name": "1/2 manga chilli omáčky",
        "amount": "100 g"
      }
    ],
    "steps": [
      "Suchú ryžu prepláchni a daj variť na 20 - 25 minút do dvojnásobného množstva vody.",
      "Rozohrej nepriľnavú panvicu na stredne silnom ohni. Kukuricu potri olivovým olejom a 6 - 8 minút ju opekaj. Po upečení ju nechaj vychladnúť, až potom z nej nakrájaj opečené zrná. Potom vlož krevety do misky s 1 PL sladkej chilli omáčky a opekaj na panvici, kým nie sú opečené.",
      "V samostatnej miske zmiešaj zvyšný olivový olej, soľ, korenie a papriku.",
      "Zmes vlej do panvice s krevetami a griluj z každej strany 1 - 2 minúty alebo kým nie sú prepečené.",
      "Fazuľu sceď a opláchni, potom ju zmiešaj s nakrájanou uhorkou, paradajkami, cibuľou nakrájanou na kocky, kukuricou, mangom nakrájaným na kocky, nasekaným koriandrom, ryžou, limetkovou šťavou, soľou a korením. Servíruj s grilovanými krevetami a korandrom na ozdobu."
    ],
    "allergens": [
      "crustaceans"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-grilovany-sendvic-s-hova-dzi-m-ma-som",
    "title": "Grilovaný sendvič s hovädzím mäsom",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Nakrájaného hovädzieho mäsa (upečeného)",
        "amount": "80 g"
      },
      {
        "name": "Kváskového chleba",
        "amount": "2 plátky"
      },
      {
        "name": "Vá avokáda",
        "amount": "½ ks"
      },
      {
        "name": "Nízkotučného syra",
        "amount": "20 g"
      },
      {
        "name": "Hrsť špenátu",
        "amount": "1"
      },
      {
        "name": "Rajčiny",
        "amount": "½ ks"
      },
      {
        "name": "Ananásový krúžok",
        "amount": "1"
      },
      {
        "name": "Cvikly",
        "amount": "2 plátky"
      },
      {
        "name": "Kyslé uhorky",
        "amount": "2"
      },
      {
        "name": "P L Nízkotučnej majonézy",
        "amount": "½"
      }
    ],
    "steps": [
      "Trochu avokáda si rozotri na jednu polku chleba a majonézu na druhý.",
      "Nakrájaj paradajku na plátky a postrúhaj syr. Sendvič naservíruj podľa vlastných predstáv, ale syr poukladaj na hovädzom mäse. Potom sendvič opeč do zlata a servíruj."
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-hova-dzie-na-zelenine",
    "title": "Hovädzie na zelenine",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "kg Hovädzieho mäsa",
        "amount": "1"
      },
      {
        "name": "Červeného vína",
        "amount": "250 ml"
      },
      {
        "name": "Kuracieho vývaru",
        "amount": "500 ml"
      },
      {
        "name": "Rajčinového pretlaku",
        "amount": "100 g"
      },
      {
        "name": "Sójovej omáčky",
        "amount": "60 ml"
      },
      {
        "name": "Hladkej múky",
        "amount": "30g"
      },
      {
        "name": "Strúčky cesnaku",
        "amount": "2"
      }
    ],
    "steps": [
      "350 g mkrvy, nasekanej na",
      "500 g bielych zemiakov, nasekaných na hrubo",
      "200 g šampiňónov, nasekaných",
      "1 - 2 PL tymiánu, sušeného alebo čerstvého",
      "Opeč mäso na panvici 2 - 3 minúty a potom ho prelož do pomalého variča.",
      "Na panvicu pridaj červené víno, priveď ho k varu a pridáj vývar, rajčinový pretlak a sójovú omáčku.",
      "Preosej múku a zmiešaj ju s omáčkou dohladka. Pridaj omáčku do pomalého variča s cesnakom, mrkvou, zemiakmi, hubami a tymiánom.",
      "Var 8 - 10 hodín na nízkom móde alebo 6 - 8 hodín pri vysokom."
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-hova-dzie-s-tekvicovou-kas-ou",
    "title": "Hovädzie s tekvicovou kašou",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Extra chudého mletého",
        "amount": "500 g"
      },
      {
        "name": "Tekvic",
        "amount": "700 g"
      },
      {
        "name": "Hovädzieho mäsa",
        "amount": "200 g"
      },
      {
        "name": "P L Medu",
        "amount": "1"
      },
      {
        "name": "Mrkva, nastrúhaná",
        "amount": "1"
      },
      {
        "name": "Hlavy brokolic",
        "amount": "1,5"
      },
      {
        "name": "Cibuľa, nakrájaná na drobno",
        "amount": "1"
      },
      {
        "name": "Zelenej fazuľky",
        "amount": "2,5 šálky"
      },
      {
        "name": "Rozšľahané vajce",
        "amount": "1"
      },
      {
        "name": "strúhanky",
        "amount": "1/4 šálky"
      },
      {
        "name": "Lyžica paradajkovej omáčky soli alebo paradajkové čatní na",
        "amount": "1"
      },
      {
        "name": "Lyžica barbecue omáčky podávani",
        "amount": "1"
      },
      {
        "name": "Lyžica kari korenia",
        "amount": "1"
      },
      {
        "name": "Lyžica sušených byliniek",
        "amount": "1"
      }
    ],
    "steps": [
      "Nakrájaj tekvicu na kocky a položte ju na plech, potri ju medom, soľou, korením a olivovým olejom. Peč na 200 stupňoch 35 minút alebo kým nie je upečená. Supku nechaj a roztlač ju.",
      "Medzitým si priprav parný hrniec, nakrájaj ružičky brokolice a fazuľky a nechaj ich variť v pare 6 - 8 minút.",
      "Rozdeľte na 4 porcie a podávaj s čatní alebo omáčkou."
    ],
    "allergens": [
      "eggs"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-kuracia-sezamova-panvic-ka",
    "title": "Kuracia sezamová panvička",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Kuracích pfs bez kože,",
        "amount": "200 g"
      },
      {
        "name": "Cesnak",
        "amount": "2 strúčiky"
      },
      {
        "name": "Nakrájaných na kocky",
        "amount": "100 g"
      },
      {
        "name": "Čerstvého zázvoru",
        "amount": "1 cm"
      },
      {
        "name": "Šálka hnedej ryž",
        "amount": "1"
      },
      {
        "name": "P L nasekaného 1/4 zväzku koriandra",
        "amount": "1"
      },
      {
        "name": "sezamového oleja",
        "amount": "1/2 pl"
      },
      {
        "name": "sójovej omáčky",
        "amount": "1 pl"
      },
      {
        "name": "1/4 zväzku brokolic",
        "amount": "150 g"
      },
      {
        "name": "2/3 limetky",
        "amount": "½ ks"
      },
      {
        "name": "1/2 mrkvy",
        "amount": "1 ks"
      },
      {
        "name": "1/4 limetkovej kôry",
        "amount": "½ ks"
      },
      {
        "name": "Fazule edamam",
        "amount": "100 g"
      },
      {
        "name": "P L Medu",
        "amount": "1"
      },
      {
        "name": "1/2 červenej papriky",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Priprav si ryžu podľa návodu.",
      "Na nepriľnavej panvici zohrej sezamový olej a opraž kuracie mäso asi 4 - 5",
      "Nakrájaj brokolicu, mrkvu, papriku a červenú cibuľu. Do panvice pridaj cesnak, zázvor, nakrájanú zeleninu a zalej ju limetkovou šťavou a sójovou",
      "Pridaj fazuľky edamame, soľ a korenie. Neustále miešaj 3 minúty a potom pridaj trochu medu. Odstav z ohňa. Kľúčom k úspechu je zachovať zeleninu",
      "Ryžu naservíruj do malej misky a na vrch nalož kuraciu zmes z panvice. Na ozdobu pridaj fazuľové výhonky, limetkovú kôru, koriander a sezamové"
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-mexicke-tortilly",
    "title": "Mexické tortilly",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Chudého hovädzieho mäsa/",
        "amount": "125 g"
      },
      {
        "name": "Kuracieho mäsa cibuľa, avokádo a kyslá",
        "amount": "1 ks"
      },
      {
        "name": "Obľúbená fazuľa z plechovky smotana - alebo čokoľvek,",
        "amount": "100 g"
      },
      {
        "name": "podľa chuti Taco korenie na tortilly . na čo máš chuť",
        "amount": ""
      },
      {
        "name": "Vody",
        "amount": "250 ml"
      },
      {
        "name": "Listy maslového šalátu/celozrnné",
        "amount": "20 g"
      },
      {
        "name": "Tortilly",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Na veľkej panvici opeč mäso, pridaj taco korenie, fazuľu a vodu. Var, kým sa tekutina nevstrebe.",
      "Mäso poukladaj do šalátových listov alebo celozrnných tortíll a oblož ich zvolenými prílohami. Zlož a podávaj."
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-placky-s-ricottou-cukinou-a-bata-tmi",
    "title": "Placky s ricottou, cukinou a batátmi",
    "category": "obed",
    "description": "Výživný obed - vegetariánske",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Menší sladký zemiak, postrúhaný",
        "amount": "1"
      },
      {
        "name": "Cukiny, nastrúhané",
        "amount": "2"
      },
      {
        "name": "Cibule, nasekanej najemno",
        "amount": "1 ks"
      },
      {
        "name": "Hrsť nasekanej bazalky a petržlenovej vňat",
        "amount": "1"
      },
      {
        "name": "Vajíčka",
        "amount": "2"
      },
      {
        "name": "Šálka ricotty",
        "amount": "1"
      },
      {
        "name": "Špaldovej múky",
        "amount": "1,5 šálky"
      }
    ],
    "steps": [
      "Postrúhanú zeleninu posyp soľou a nechaj 5 minút postáť. Potom zo zeleniny vytlač čo najviac vody a vráť ich späť do misy. Pridaj cibuľu, bylinky, vajíčka, ricottu, múku a trochu čierneho korenia. Dobre sa premiešaj.",
      "Rozpáľ veľkú panvicu a pokrop ju trochou olivového oleja. Nalej približne",
      "Y3 šálky cesta na panvicu do tvaru lievanca. Peč 2 - 3 minúty alebo do hneda a chrumkava. Servíruj s jednoduchým šalátom."
    ],
    "allergens": [
      "eggs",
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-plnene-sladke-zemiaky",
    "title": "Plnené sladké zemiaky",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Mletých morčacích pís",
        "amount": "150 g"
      },
      {
        "name": "Gréckeho jogurtu",
        "amount": "150 g"
      },
      {
        "name": "Gsladkých zemiakov",
        "amount": "200"
      },
      {
        "name": "lyžičky rasc",
        "amount": "1/2"
      },
      {
        "name": "Paradajky nakrájané na kocky",
        "amount": "2"
      },
      {
        "name": "P L nasekaného 1/4 zväzku bazalky",
        "amount": "1"
      },
      {
        "name": "Cibuľa",
        "amount": "1 ks"
      },
      {
        "name": "Lyžička čili prášku",
        "amount": "1"
      },
      {
        "name": "Šálka špenátu",
        "amount": "1"
      },
      {
        "name": "na postriekanie 1/2 mrkvy * olivový olej v spreji",
        "amount": ""
      },
      {
        "name": "podľa chuti 1/3 šálky hrášku",
        "amount": ""
      },
      {
        "name": "kukuričných zfn",
        "amount": "1/4 šálky"
      }
    ],
    "steps": [
      "Rúru predhrej na 200 stupňov. Sladké zemiaky vlož do hrnca s vriacou vodou a var 10 minút na vysokej teplote. Následne ich peč v rúre 15 - 20 minút alebo kým nezmäknú, pričom ich potri olejom a ochuť soľou a korením. Paradajky nakrájaj na štvrtiny, cesnak na polovicu a pridaj ich do toho istého plechu na pečenie.",
      "Rozohrej olej na nepriľnavej panvici na strednom ohni. Pridaj 1/2 cibule, kukuricu, hrášok, mrkvu nakrájanú na kocky, cesnak, rascu a chilli. Var približne 1 minútu, potom odlož bokom.",
      "Panvicu znovu zohrej a postriekaj olejom. Nakrájaj zvyšnú cibuľu na kocky a pridaj ju na panvicu, potom pridaj mleté morčacie mäso a nechaj ho 4 minúty opekať dohneda. Premiešaj zeleninovú zmes a pridaj špenát, ktorý nechaj mierne zvädnúť. Dochuť soľou, korením a chilli. Odstav.",
      "Vyberte plech z rúry a daj paradajky, cesnak a bazalku do mixéra a rozmixujte na omáčku. Tú pridaj k mäsovej a zeleninovej zmesi. Medzitým vydlab vnútro sladkých zemiakov, aby sa vytvoril priestor na náplň. Naplň zemiaky zmesou a podávaj s jogurtom a extra bazalkou."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-poke-miska-s-kuraci-m-ma-som",
    "title": "Poke miska s kuracím mäsom",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Pečeného kuracieho mäsa",
        "amount": "150 g"
      },
      {
        "name": "edamame alebo",
        "amount": "3/4 šálky"
      },
      {
        "name": "Šálka hnedej ryže hnedej fazule/ hrášku/ špargle)",
        "amount": "1"
      },
      {
        "name": "Strúhanej mrkvy",
        "amount": "4 šálky"
      },
      {
        "name": "Natenko nakrájanej uhorky omáčka na ryžu",
        "amount": "4 šálky"
      },
      {
        "name": "Nakrájanej kapusty",
        "amount": "4 šálky"
      },
      {
        "name": "P L nasekaného V4 hrste čerstvého koriandru",
        "amount": "1"
      },
      {
        "name": "P L Medu",
        "amount": "1"
      },
      {
        "name": "P L Sójovej omáčky",
        "amount": "1"
      },
      {
        "name": "Sezamové semienka",
        "amount": "20 g"
      }
    ],
    "steps": [
      "Hnedú ryžu uvar podľa inštrukcií na balení. Kuracie mäso si nechaj v zmesi sójovej omáčky a medu v chladničke aspoň na 10 minút (najlepšie",
      "Na panvici zľahka opeč mäso a pridaj edamame fazuľu (prípadne inú) a opekaj nad stredným ohňom, kým je mäsko dobre prepečené. Na záver pridaj sezamové semienka.",
      "Nakrájaj všetku šalátovú zeleninu a bylinky.",
      "Do misy si pridaj ryžu, kuracie mäso, edamame fazuľu (prípadne inú) a šalátovú zeleninu. Poke misku polej sladkou alebo klasickou sójovou omáčkou, limetkovou šťavou a servíruj."
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-slany-kola-c-z-bata-tov-a-slaniny",
    "title": "Slaný koláč z batátov a slaniny",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Stredne veľký sladký zemiak,",
        "amount": "1"
      },
      {
        "name": "Šálka nízkotučného syru,",
        "amount": "1"
      },
      {
        "name": "Nastrúhaný nastrúhaného",
        "amount": "30 g"
      },
      {
        "name": "cukina, nastrúhaná a zbavená",
        "amount": "1 ks"
      },
      {
        "name": "cesnaku",
        "amount": "1 Cl"
      },
      {
        "name": "Vody",
        "amount": "250 ml"
      },
      {
        "name": "P L Pažítky",
        "amount": "1"
      },
      {
        "name": "Slaniny, nakrájané na malé - » čierne korenie (podla chuti)",
        "amount": "4 plátky"
      },
      {
        "name": "Kúsky",
        "amount": "½ ks"
      },
      {
        "name": "Cibuľa, nasekaná špenát, mrva, paprika) ako príloha",
        "amount": "1"
      },
      {
        "name": "Vajíčka podla preferenci",
        "amount": "4"
      },
      {
        "name": "Šálka hladkej múky",
        "amount": "1"
      },
      {
        "name": "štipka prášku do pečiva",
        "amount": "1 ČL"
      }
    ],
    "steps": [
      "Plech vymasti alebo vystli papierom na pečenie. Môžeš použiť aj silikónovú",
      "Peč pri 220 stupňoch Celzia 40 - 50 minút. Nakrájaj si zeleninu a servíruj s chutney a šalátom."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-slany-kola-c-z-tekvice-a-fety",
    "title": "Slaný koláč z tekvice a fety",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Vajíčok",
        "amount": "6"
      },
      {
        "name": "Hrsť rukoly",
        "amount": "1"
      },
      {
        "name": "Cibul",
        "amount": "2"
      },
      {
        "name": "Hrsť špenátu",
        "amount": "1"
      },
      {
        "name": "Tekvice, nakrájanej na",
        "amount": "2 šálky"
      },
      {
        "name": "Pokrájaných cherry rajčín",
        "amount": "5"
      },
      {
        "name": "Tofu alebo syr, na kocky",
        "amount": "100 g"
      },
      {
        "name": "Šálka špenátu",
        "amount": "1"
      },
      {
        "name": "Nasekané vlašské orechy",
        "amount": "3"
      },
      {
        "name": "Feta syru",
        "amount": "30 g"
      },
      {
        "name": "Nastrúhaného parmezánu",
        "amount": "15g"
      },
      {
        "name": "P L Balzamikového octu",
        "amount": "1"
      },
      {
        "name": "Sušených rajčín, bez oleja",
        "amount": "4 šálky"
      },
      {
        "name": "Hrsť tymiánu",
        "amount": "1"
      },
      {
        "name": "%3 šálky mlieka ,",
        "amount": "200 ml"
      }
    ],
    "steps": [
      "Rúru zohrej na 190°C, plech vysteľ papierom na pečenie a poukladaj naň",
      "Tekvicu. Pokrop ju olivovým olejom, Posyp soľou, čiernym korením, trochou tymiánu a peč 30 minút, alebo domäkka.",
      "Medzitým si na panvici zohrej olivový olej a opeč nadrobno nakrájanú cibuľu dohneda. Pridaj balzamikový ocot a smaž ďalšiu 1 - 2 minúty. Nechaj na strane a vsamostatnej mise si zmiešaj vajíčka, mlieko, soľ a čierne korenie.",
      "Obdížnikový plech vystli papierom na pečenie alebo vymasti olivovým olejom. Na spodok daj upečenú tekvicu, pridaj tymián, sušené rajčiny, upečenú cibuľu, špenát a prelej to vajíčkovou zmesou. Plech trochu pobúchaj po kuchynskej linke a zatras ním, aby sa zmes rozliala po celom plechu. Kúsky feta syru daj navrch a posyp zvyšnými bolinkami.",
      "Plech vložte do rúry a znížte teplotu na 180 %C. Peč 20 - 30 minút, alebo"
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-steak-s-pec-enou-zeleninou",
    "title": "Steak s pečenou zeleninou",
    "category": "obed",
    "description": "Výživný obed - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Steaky",
        "amount": "2"
      },
      {
        "name": "Uhorka",
        "amount": "1"
      },
      {
        "name": "Tekvice",
        "amount": "400 g"
      },
      {
        "name": "P L Niekoľko baby zemiakov",
        "amount": "1"
      },
      {
        "name": "Veľká mrkva",
        "amount": "1"
      },
      {
        "name": "Paštrnák",
        "amount": "1"
      },
      {
        "name": "Cuketa",
        "amount": "1"
      },
      {
        "name": "Listy šalátu, nakrájané na kúsky",
        "amount": "2 ks"
      },
      {
        "name": "Cherry paradajok",
        "amount": "4"
      },
      {
        "name": "Malá červená paprika",
        "amount": "1"
      }
    ],
    "steps": [
      "Rúru predohrej na 200 stupňov. Baby zemiaky spolu s mrkvou, tekvicou, paštrnákom a cuketou vlož do olejom vymastenej zapekacej misy. Peč asi 25 minút, kým zelenina nezmäkne.",
      "Kým sa zelenina opeká, posyp steaky z oboch strán soľou, korením a bolinkami.",
      "Do uzatvárateľnej nádoby pridajte trochu červeného vínneho octu s rovnakým objemom extra panenského olivového oleja a poriadne posyp soľou a korením. Niekoľko sekúnd intenzívne pretrepávaj, kým sa všetko dobre nespojí. Jednu alebo dve polievkové lyžice tohto dresingu spojte so šalátom, paradajkami, paprikou a uhorkou. Rozdeľ na dve časti a servíruj.",
      "Steaky opeč na panvici 3 - 4 minúty z oboch strán alebo kým nie sú pekne prepečené. Pečenú zeleninu rozdeľ na taniere a podávaj so šalátom"
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-s-ala-t-z-tekvice-fety-a-c-ervenej-repy",
    "title": "Šalát z tekvice, fety a červenej repy",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Šálka červenej repy",
        "amount": "1"
      },
      {
        "name": "balzamikového octu",
        "amount": "1/5 pl"
      },
      {
        "name": "Malej červenej cibule + % citróna",
        "amount": "1 ks"
      },
      {
        "name": "podľa chuti mrkva",
        "amount": ""
      },
      {
        "name": "Šálka baby špenátu",
        "amount": "1"
      },
      {
        "name": "Tety",
        "amount": "20 g"
      },
      {
        "name": "Vlašských orechov",
        "amount": "15 g"
      },
      {
        "name": "Vetvičky mäty",
        "amount": "2"
      },
      {
        "name": "na postriekanie Olivový olej v spreji",
        "amount": ""
      }
    ],
    "steps": [
      "Rúru predhrej na 180 °C a plech vystli papierom na pečenie. Nakrájaj červenú repu, cuketu, tekvicu a červenú cibuľu a poukladaj na plech.",
      "Zeleninu postriekaj olivovým olejom a dochuť soľou a korením. Peč 25 - 30 minút, alebo kým nie je repa uvarená.",
      "Naplň hrniec vodou a uvar kuskus podľa návodu na obale.",
      "V miske zmiešaj prísady na dresing. Vyšľahaj javorový sirup, balzamikový ocot, olivový olej a citrónovú šťavu.",
      "V miske zmiešaj pečenú zeleninu, špenát, kuskus a dresing. Na vrch daj tetu, vlašské orechy a mätu."
    ],
    "allergens": [
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-s-pena-tovo-brokolicove-cestoviny-s-pestom",
    "title": "Špenátovo brokolicové cestoviny s pestom",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Parmezánu",
        "amount": "10 g"
      },
      {
        "name": "Baby špenátu",
        "amount": "2 hrste"
      },
      {
        "name": "Brokolica",
        "amount": "150 g"
      },
      {
        "name": "⅛ zväzku Kapusta",
        "amount": ""
      },
      {
        "name": "P L nasekaného 1/4 zväzku čerstvej bazalky",
        "amount": "1"
      },
      {
        "name": "Makadamových orechov",
        "amount": "15 g"
      },
      {
        "name": "Cherry paradajok",
        "amount": "6"
      },
      {
        "name": "Parmezán na ozdobu",
        "amount": "30 g"
      },
      {
        "name": "1/4 cesnaku",
        "amount": "2 strúčiky"
      },
      {
        "name": "P L Olivového oleja",
        "amount": "1"
      },
      {
        "name": "1/8 citróna",
        "amount": "½ ks"
      }
    ],
    "steps": [
      "V hrnci nechaj variť osolenú vodu. Brokolicu aj listy kapusty nakrájaj nahrubo. Brokolicu blanšíruj 2 minúty a potom na 30 sekúnd pridaj kapustu.",
      "Vyber ich a odstav bokom.",
      "Cestoviny vlož do vriacej vody a var podľa návodu na obale.",
      "Citrón, parmezán, orechy, olej a cesnak vlož do mixéra. Na dosiahnutie správnej konzistencie použi trochu vody z cestovín, pričom začni po",
      "Omáčku premiešaj s horúcimi cestovinami, pridaj brokolicu, kapustu, na polovice nakrájané paradajky a posyp parmezánom a lístkami čerstvej"
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-tofu-buddha-bowl",
    "title": "Miska Tofu Buddha",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Prírodného tofu",
        "amount": "125 g"
      },
      {
        "name": "1/2 avokáda (nakrájaného na",
        "amount": "½ ks"
      },
      {
        "name": "Nakrájanej tekvice kocky)",
        "amount": "2 šálky"
      },
      {
        "name": "Šálka quinoy",
        "amount": "1"
      },
      {
        "name": "Hfstka špenátu",
        "amount": "2 hrste"
      },
      {
        "name": "Kukurica (z mini plechoviek alebo",
        "amount": "1 ks"
      },
      {
        "name": "P L Čerstvá) olivoý olej",
        "amount": "1"
      },
      {
        "name": "Paradajka (nakrájaná na kocky)",
        "amount": "2 ks"
      },
      {
        "name": "1/2 uhorky",
        "amount": "½ ks"
      },
      {
        "name": "Cibuľu",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Predhrej rúru na 180 stupňov a nakrájaj tekvicu na malé kúsky. Polož ju na plech vystlaný papierom na pečenie, postriekaj olivovým olejom a môžeš pridať aj trochu škorice.",
      "Tekvicu peč 30 - 40 minút dozlatista. Quinou vlož do hrnca a var počas posledných 20 minút pečenia tekvice.",
      "Nakrájaj tofu, marinuj ho v mede a sójovej omáčke a potom ho opeč na panvici dozlatista. V poslednej minúte varenia pridaj sezamové semienka."
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-u-dena-ryba-s-letnou-zeleninou",
    "title": "Údená ryba s letnou zeleninou",
    "category": "obed",
    "description": "Výživný obed - vhodné pre vegánov, bezlepkové",
    "prepTime": 25,
    "servings": 2,
    "calories": 440,
    "protein": 32,
    "carbs": 35,
    "fat": 18,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Filetov z bielej ryby",
        "amount": "400 g"
      },
      {
        "name": "Tekvicových semienok",
        "amount": "20 g"
      },
      {
        "name": "Zelenej fazuľky nakrájanej * 190 ml vody",
        "amount": "120 g"
      },
      {
        "name": "Opláchnutej hneďej ryže + 2 lyžičky olivového oleja",
        "amount": "65 g"
      },
      {
        "name": "Divokej ryže, opláchnutej + 1/2 citrónu nakrájaného na",
        "amount": "30 g"
      },
      {
        "name": "(alebo len extra hneďej ryže) mesiačiky",
        "amount": "80 g"
      },
      {
        "name": "Baby špenátu",
        "amount": "80 g"
      },
      {
        "name": "lyžičky soli",
        "amount": "1/2"
      },
      {
        "name": "Mletej papriky",
        "amount": "1 ks"
      },
      {
        "name": "podľa chuti Soľ a korenie podľa chuti",
        "amount": ""
      }
    ],
    "steps": [
      "Predhrej rúru na 190 °C a plech vystri papier na pečenie.",
      "V hrnci daj variť ryžu na mierny oheň a prikrytú ju var 30 minút. Odstav z ohňa a nechaj 5 minút odstáť, potom ryžu popuč vidličkou.",
      "Kým sa ryža varí, osuš rybu, potri ju polovicou olivového oleja a okoreň y y IU Pp",
      "paprikou, soľou a korením. Polož na plech a peč 15 - 20 minút alebo kým ryba nie je upečená.",
      "Keď je ryba takmer hotová, pridaj na panvicu zvyšný olej a cesnak a opraž asi 30 sekúnd až minútu. Dochuť soľou a korením a restuj ďalšiu minútu.",
      "Pridaj na panvicu fazuľu, špenát a tekvicové semienka a peč, kým sa semienka neopečú a fazuľa nezmäkne a nezíska jasnú zelenú farbu, približne",
      "5 - 7 minút. Ak je panvica príliš suchá, pridaj trochu vody. Odstav z ohňa, dokoreň. Hotové jedlo podávaj pokvapkané citrónom."
    ],
    "allergens": [
      "fish"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-vega-nsky-burger-z-bata-tov",
    "title": "Vegánsky burger z batátov",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "batátov",
        "amount": "150 G"
      },
      {
        "name": "Špaldová burger žemla",
        "amount": "1"
      },
      {
        "name": "Fazule mungo",
        "amount": "50g"
      },
      {
        "name": "P L nasekaného V, pl mletej rasce",
        "amount": "1"
      },
      {
        "name": "P L Mletého koriandru",
        "amount": "½"
      },
      {
        "name": "podľa chuti Soľ a čierne koreni",
        "amount": ""
      },
      {
        "name": "rajčinového chutney",
        "amount": "2/3 pl"
      },
      {
        "name": "P L olivový olej",
        "amount": "1"
      },
      {
        "name": "Rajčiny",
        "amount": "2 plátky"
      },
      {
        "name": "Špenátových lístkov",
        "amount": "5"
      },
      {
        "name": "% červenej cibul",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Zohrej rúru na 180°. Batáty umy, nakrájaj na kocky a poukladaj na plech vystlaný papierom na pečenie. Pokrop ich olivovým olejom a peč 20 - 25 minút domäkka. Nechaj vychladnúť.",
      "V hrnci si nechaj zovrieť vodu, pridaj mungo fazuľu a var 3 minúty domäkka. Fazuľu sceď a nechaj vysušiť.",
      "V mise zmiešaj batáty, mungo fazuľu, rascu, mletý koriander, soľ a čierne korenie. Zo zmesi si vymodeluj fašírku a peč v rúre 10 minút pri teplote",
      "160°C, alebo až kým nie sú okraje zlatohnedé.",
      "Medzitým si rozpuč časť avokáda, pridaj limetkovú šťavu a nasekaný čerstvý koriander. Túto zmes natri na jednu stranu žemle a na druhú natri rajčinové chutney. Pridaj nakrájanú rajčinu, plátok avokáda a červenú cibuľu.",
      "Pridaj upečenú fašírku, rajčinu a špenát. Podávaj teplé jedlo."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-vega-nsky-s-ala-t-s-ryz-ovy-mi-rezancami",
    "title": "Vegánsky šalát s ryžovými rezancami",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Ryžových rezancov",
        "amount": "150 g"
      },
      {
        "name": "Sezamových semienok",
        "amount": "20 g"
      },
      {
        "name": "Veľká mrkva 1 čl javorového sirupu",
        "amount": "1"
      },
      {
        "name": "Vw uhorky * 1 čl sezamového oleja",
        "amount": "½ ks"
      },
      {
        "name": "Šálka červenej kapusty",
        "amount": "1"
      },
      {
        "name": "Neutrálneho oleja",
        "amount": "1 ČL"
      },
      {
        "name": "Malé jarné cibuľky, nakrájané",
        "amount": "2"
      },
      {
        "name": "P L Citrónovej šťavy",
        "amount": "1"
      },
      {
        "name": "Nakladaného zázvoru,",
        "amount": "10g"
      },
      {
        "name": "Nakrájaného na tenké plátky",
        "amount": "100 g"
      },
      {
        "name": "štipľavej čili pasty",
        "amount": "1 Čl"
      },
      {
        "name": "Čierne sezamové semienka",
        "amount": "20 g"
      }
    ],
    "steps": [
      "Priprav ryžové rezance podľa návodu na obale a nechaj na strane. Nastrúhaj všetku zeleninu na tenko.",
      "Zľahka si opraž sezamové semienka na suchej panvici. Neustále ich miešaj, aby sa nepripálili. Keď sa starbia do zlatohneda, odstav ich z ohňa.",
      "Pomocou mažiara (alebo výkonného mixéra) si rozdrv sezamové semienka",
      "Rezance daj do veľkej misy, pridaj všetku zeleninu, dressing a dobre premiešaj. Nakoniec môžeš pridať nasekané arašidy a koriander podľa"
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-vega-nsky-wrap-s-bata-tmi-a-humusom",
    "title": "Vegánsky zábal s batátmi a humusom",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Špenátu",
        "amount": "2 hrste"
      },
      {
        "name": "Polievková lyžica hummusu + 1/4 červenej papriky",
        "amount": "1"
      },
      {
        "name": "1/3 mrkvy",
        "amount": "1 ks"
      },
      {
        "name": "1/4 jarnej cibuľky",
        "amount": "1 ks"
      },
      {
        "name": "Slnečnicových semienok",
        "amount": "20 g"
      },
      {
        "name": "podľa chuti Sol a koreni",
        "amount": ""
      },
      {
        "name": "Celozrnný wrap",
        "amount": "1"
      },
      {
        "name": "červenej kapusty",
        "amount": "1/2 šálky"
      },
      {
        "name": "pečených sladkých",
        "amount": "1/2 šálky"
      },
      {
        "name": "Zemiakov",
        "amount": "200 g"
      }
    ],
    "steps": [
      "Rúru rozohrej na 200 stupňov. Sladké zemiaky nakrájaj na kocky a poukladaj Na plech vystlaný papierom na pečenie. Peč, kým zemiaky nezmäknú a nezhnednú na okrajoch (asi 20 - 25 minút).",
      "Medzitým nakrájaj jarnú cibuľku nadrobno a zmiešaj ju s humusom v malej",
      "Papriku nakrájaj na kolieska, mrkvu nastrúhaj a kapustu nakrájaj na kúsky.",
      "Do stredu wrapu rozotri humus, pridaj pečené sladké zemiaky, papriku, špenát, mrkvu, kapustu a slnečnicové semienka a ozdob soľou a korením.",
      "Zroluj obal a upevni ho špáradlom. Nechaj ho stuhnúť v chladničke (približne 20 minút). Nakrájaj na kolieska a podávaj."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-zdrave-bolon-ske-s-pagety",
    "title": "Zdravé boloňské špagety",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 480,
    "protein": 34,
    "carbs": 40,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Cibule, nasekané najemno",
        "amount": "2"
      },
      {
        "name": "Cuketa, nastrúhaná najemno",
        "amount": "1"
      },
      {
        "name": "Mrkvy, očistené a nakrájané",
        "amount": "2"
      },
      {
        "name": "P L Nadrobno",
        "amount": "2"
      },
      {
        "name": "Bobkové listy",
        "amount": "2"
      },
      {
        "name": "Cesnaku, pretlačné",
        "amount": "2 strúčiky"
      },
      {
        "name": "Parmezánu",
        "amount": "25 g"
      },
      {
        "name": "Chudé mleté hovädzie mäso",
        "amount": "500 g"
      },
      {
        "name": "Nasekaných rajčín z plechovky cestoviny",
        "amount": "800 g"
      },
      {
        "name": "Baklažán, nakrájaný na 1 cm kocky",
        "amount": "1"
      }
    ],
    "steps": [
      "Rozpáľ olej na panvici na slabom plameni. Pridaj cibuľu, cuketu, mrkvu, cesnak a pomaly opekaj 10 minút (domäkka).",
      "Zvýš teplotu, pridaj mleté mäso a miešaj, kým sa mäso neupečie dohneda (okolo 10 minút). Pridaj korenie, rajčiny a baklažán. Var aspoň hodinu (aj 2, ak máš čas)",
      "Podávaj s cestovinami alebo cuketovými rezancami. Servíruj s nastrúhaným parmezánom."
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-zdrave-zeleninove-muffiny",
    "title": "Zdravé zeleninové muffiny",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 420,
    "protein": 18,
    "carbs": 45,
    "fat": 16,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Sladkého zemiaku, postrúhaného",
        "amount": "2 šálky"
      },
      {
        "name": "Vajíčka a 3 bielky",
        "amount": "4"
      },
      {
        "name": "Červenej papriky, nakrájanej na plátky",
        "amount": "½"
      },
      {
        "name": "Šálka baby špenátu, nahrubo nasekaného",
        "amount": "1"
      },
      {
        "name": "Výhonok bazalky, nasekanej na jemno",
        "amount": "1"
      },
      {
        "name": "Va šálky feta syru - rozdrobeného",
        "amount": "30 g"
      },
      {
        "name": "P L Xtra panenský olivový olej",
        "amount": "1"
      },
      {
        "name": "podľa chuti Soľ a čierne koreni",
        "amount": ""
      }
    ],
    "steps": [
      "Predhrej rúru na 180 stupňov. Potri plech na muffiny (recept vyjde na 6 muffinov) extra panenským olivovým olejom alebo vysteľ papierom na",
      "Na stredne veľkej panvici opeč sladký zemiak do mäkka a do hneda. Vtlač ho na spodok plechu na muffiny. Potom pridaj na panvicu červenú papriku a nechaj ju zmäknúť. Hotovú papriku pridaj na vrch sladkého zemiaku",
      "V miske zmiešaj vajcia, korenie, bazalku, špenát a rozdrobený feta syr. Zmes prelej cez papriku a sladký zemiak, prípadne pridaj trochu extra špenátu a fety na vrch.",
      "Peč 20-25 minút alebo do zlata.",
      "TIP: Servíruj spolu so šalátom zo špenátu, cherry paradajok, uhorky a balzamikového octu."
    ],
    "allergens": [
      "dairy",
      "eggs"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-zelene-kari-s-krevetami",
    "title": "Zelené kari s krevetami",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 25,
    "servings": 2,
    "calories": 440,
    "protein": 32,
    "carbs": 35,
    "fat": 18,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Kreviet",
        "amount": "300 g"
      },
      {
        "name": "Cesnaku",
        "amount": "1 strúčik"
      },
      {
        "name": "Šálka varenej hnedej ryž",
        "amount": "1"
      },
      {
        "name": "Kúsok zázvoru",
        "amount": "1"
      },
      {
        "name": "Gkokosového mlieka",
        "amount": "200"
      },
      {
        "name": "Polievková lyžica zelenej kari",
        "amount": "1"
      },
      {
        "name": "Cuketa pasty",
        "amount": "1"
      },
      {
        "name": "Mrkva",
        "amount": "1"
      },
      {
        "name": "sezamového oleja",
        "amount": "1/2 pl"
      },
      {
        "name": "Šálka hrášku",
        "amount": "1"
      },
      {
        "name": "P L nasekaného 1/2 zväzku koriandra",
        "amount": "1"
      },
      {
        "name": "1/2 papriky",
        "amount": "1 ks"
      },
      {
        "name": "Limetka",
        "amount": "1"
      }
    ],
    "steps": [
      "Pripravte si ryžu podľa návodu.",
      "Nakrájaj cuketu, mrkvu a papriku.",
      "Vo woku si na strednom ohni rozohrej olej, pridaj cesnak, zázvor, karí pastu a var, kým všetko nerozvonia. Potom pridaj všetku zeleninu a var 5 minút, kým nezmäkne, ale zostane chrumkavá.",
      "Pridaj krevety a smaž 2 - 3 minúty, kým nie sú takmer uvarené.",
      "Nakoniec pridaj kokosové mlieko a var ďalších 5 minút.",
      "Hotové kari podávaj ozdobené lístkami koriandra a limetkou."
    ],
    "allergens": [
      "crustaceans"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-hubova-polievka",
    "title": "Hubová polievka",
    "category": "vecera",
    "description": "Výživná polievka - vegetariánske",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Hnedej cibul",
        "amount": "55 g"
      },
      {
        "name": "Zeleninového vývaru",
        "amount": "500 ml"
      },
      {
        "name": "Mrkvy nakrájanej nahrubo",
        "amount": "60g"
      },
      {
        "name": "lyžičky sušeného tymiánu",
        "amount": "1/2"
      },
      {
        "name": "Hub",
        "amount": "95 g"
      },
      {
        "name": "Bobkový list",
        "amount": "1"
      },
      {
        "name": "Zeleru nasekaného nahrubo + 1/2 lyžičky sušeného rozmarínu",
        "amount": "55 g"
      },
      {
        "name": "Cesnaku nakrájaného na",
        "amount": "6 g"
      },
      {
        "name": "Mandľového mlieka",
        "amount": "160 ml"
      },
      {
        "name": "Drobné kocky",
        "amount": "100 g"
      },
      {
        "name": "Kukuričnej múky",
        "amount": "15 g"
      },
      {
        "name": "° 30 g čiernej ryž",
        "amount": "80 g"
      },
      {
        "name": "Tazule cannellini",
        "amount": "55 g"
      }
    ],
    "steps": [
      "Do tlakového hrnca vložte cibuľu, mrkvu, zeler, cesnak, huby, fazuľu, ryžu, zeleninový vývar a bylinky. Zapni tlakový hrniec alebo manuálne nastav vysoký tlak a var 45 minút.",
      "Po dokončení odstráň pokrievku a vyber bobkový list.",
      "V samostatnej miske zmiešaj kukuričnú múku a mandľové mlieko.",
      "Na instantnom hrnci zvoľ nastavenie restovania, akonáhle začne poľievka vrieť, pridaj rozmiešanú kukuričnú múku. Var 5 minút alebo kým polievka"
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-kuracia-polievka-na-mexicky-s-ty-l",
    "title": "Kuracia polievka na mexický štýl",
    "category": "obed",
    "description": "Výživná polievka - bezlepkové",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Kuracieho mäsa zo stehna",
        "amount": "135 g"
      },
      {
        "name": "Žltej papriky, nasekanej 1 čl mletej papriky",
        "amount": "80 g"
      },
      {
        "name": "Cibule, nasekanej * 1 čl mletej rasce",
        "amount": "70 g"
      },
      {
        "name": "Mrkva * čl sušeného oregána",
        "amount": "1"
      },
      {
        "name": "Nasekaných rajčín z plechovky",
        "amount": "250 g"
      },
      {
        "name": "Cesnakového korenia",
        "amount": "2 strúčiky"
      },
      {
        "name": "Taco omáčky",
        "amount": "100 ml"
      },
      {
        "name": "Kuracieho vývaru",
        "amount": "330 ml"
      },
      {
        "name": "Kukuric",
        "amount": "10g"
      },
      {
        "name": "Čiernej fazule",
        "amount": "100 g"
      },
      {
        "name": "P L nasekaného Koriandra",
        "amount": "1"
      },
      {
        "name": "P L Gréckeho jogurtu",
        "amount": "1"
      },
      {
        "name": "Kuracieho mäsa. zatvor sáčok a poriadne ním zatras, aby sa mäso obalilo v",
        "amount": "200 g"
      }
    ],
    "steps": [
      "Do pomalého variča pridajte kuracie mäso, papriku, cibuľu, mrkvu, rajčiny, kukuricu, čiernu fazuľu, taco omáčku a vývar. Premiešaj a var na nízkom móde 6 - 8 hodín a na vysokom 3 - 4 hodiny.",
      "Keď sa polievka dovarí, vyberie kuracie mäso a nakrájaj ho na kúsky. Vráť kúsky mäsa do polievky a premiešaj. Na vrch pridaj jogurt a čerstvý koriander (prípadne aj kukuričné tortilla chipsy)."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-kuracia-polievka-na-s-ty-l-pho",
    "title": "Kuracia polievka na štýl pho",
    "category": "obed",
    "description": "Výživná polievka",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Kuracích pís",
        "amount": "300 g"
      },
      {
        "name": "Rezancov",
        "amount": "180 g"
      },
      {
        "name": "Pór",
        "amount": "1"
      },
      {
        "name": "Mrazeného hrášku",
        "amount": "1,5 šálky"
      },
      {
        "name": "Stonky zeleru",
        "amount": "3"
      },
      {
        "name": "Zväzok čínskej kapusty",
        "amount": "1"
      },
      {
        "name": "Kocka kuracieho bujónu",
        "amount": "200 g"
      },
      {
        "name": "Zelené šalotky",
        "amount": "3"
      },
      {
        "name": "Malá plechovka kukurice",
        "amount": "1"
      },
      {
        "name": "Cesnaku 1 pl sezamového oleja",
        "amount": "1 strúčik"
      }
    ],
    "steps": [
      "Vo veľkom hrnci na miernom ohni rozohrej olej a podus na ňom pór a zeler asi 5 minút. Pridaj cesnak a za stáleho miešanie dus ďalšiu minútu.",
      "Pridaj kurací bujón, 5 šálok vody a nechaj prevrieť. Potom pridaj kuracie mäso a kukuricu, zníž oheň na minimum a var 10 minút. Medzitým uvar rezance podľa návodu na obale.",
      "Uvarené kuracie prsia vyber z polievky, nechaj ich trochu vychladnúť a nakrájaj ho na malé kúsky. Potom ho daj do polievky aj s mrazeným hráškom a var 2 - 3 minúty.",
      "Pridaj čínsku kapustu a var, kým nezvädne. Rezance rozdeľ do dvoch misiek, zalej horúcou polievkou a ozdob šalotkou a čili."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-miso-polievka-s-jac-men-om",
    "title": "Miso polievka s jačmeňom",
    "category": "vecera",
    "description": "Výživná polievka - vhodné pre vegánov",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Jačmeňa",
        "amount": "110 g"
      },
      {
        "name": "Mrkvy, nakrájanej na",
        "amount": "140g"
      },
      {
        "name": "P L Miso pasty kocky",
        "amount": "1,5"
      },
      {
        "name": "Sójovej omáčky",
        "amount": "5 ml"
      },
      {
        "name": "Zeleru, nakrájaného",
        "amount": "140 g"
      },
      {
        "name": "pl čerstvého zázvoru, na kocky",
        "amount": "1 cm"
      },
      {
        "name": "Edamam",
        "amount": "100 g"
      },
      {
        "name": "Nastrúhaného",
        "amount": "30 g"
      },
      {
        "name": "Červená cibuľa a mangold",
        "amount": "60 g"
      },
      {
        "name": "Zelenina, nakrájaná nahrubo",
        "amount": "100 g"
      }
    ],
    "steps": [
      "Na poslednú polhodinu varenia pridajte edamame a mangold.",
      "Podávaj s celozrnným pečivom."
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-paradajkova-polievka-s-fazul-ou",
    "title": "Paradajková polievka s fazuľou",
    "category": "vecera",
    "description": "Výživná polievka - bezlepkové",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Pasírovaných rajčín",
        "amount": "150 g"
      },
      {
        "name": "Nasekaných rajčín z plechovky",
        "amount": "100 g"
      },
      {
        "name": "Mix fazule z plechovky",
        "amount": "50g"
      },
      {
        "name": "porcie Coleslaw šalátu",
        "amount": "¼"
      },
      {
        "name": "Zeleninovéhu vývaru",
        "amount": "4 šálky"
      },
      {
        "name": "Kuracích stehien, nakrájaných na menšie kúsky",
        "amount": "90g"
      }
    ],
    "steps": [
      "Mäso upeč na neprilňavej panvici dohneda. Nechaj na strane.",
      "V strednom kastróliku si zmiešaj pasírované rajčiny, nasekané rajčiny a vývar.",
      "Nechaj prevrieť.",
      "Pridaj fazuľu, kuracie mäso a var asi 5 minút. Nakoniec Pridaj coleslaw a var ďalšie 2 minúty."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-polievka-z-tekvice-a-bata-tov",
    "title": "Polievka z tekvice a batátov",
    "category": "vecera",
    "description": "Výživná polievka - vegetariánske, bezlepkové",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "na postriekanie Olivový olej v spreji",
        "amount": ""
      },
      {
        "name": "Cibuľa nakrájaná na kocky",
        "amount": "1"
      },
      {
        "name": "Prelisovaný strúčik cesnaku",
        "amount": "1"
      },
      {
        "name": "Lyžička kari korenia",
        "amount": "1"
      },
      {
        "name": "Tekvice nakrájanej na kocky",
        "amount": "400 g"
      },
      {
        "name": "Mrkva",
        "amount": "1"
      },
      {
        "name": "Ošúpaných sladkých zemiakov nakrájaných na kocky",
        "amount": "200 g"
      },
      {
        "name": "Zeleninového vývaru",
        "amount": "1"
      },
      {
        "name": "P L Medu",
        "amount": "1"
      },
      {
        "name": "podľa chuti štipka soli a korenia podľa chuti",
        "amount": ""
      },
      {
        "name": "P L Gréckeho jogurtu na podávani",
        "amount": "2"
      }
    ],
    "steps": [
      "Nakrájaj tekvicu, sladký zemiak a mrkvu na podobné veľké kocky a polož ich na plech na pečenie. Zeleninu osoľ, okoreň, postriekaj olejom a pokvapkaj medom. Peč 35 minút na 200 stupňoch.",
      "Vo veľkom hrnci rozohrej olej a opeč na ňom cibuľu, kým nie je priehľadná.",
      "Pridaj cesnak, kari korenie, premiešaj a smažte ďalšiu minútu.",
      "Pridaj do hrnca upečenú zeleninu, vývar a var prikryté asi 20 minút.",
      "Nechaj polievku trochu vychladnúť a rozmixuj ju tyčovým mixérom dohladka.",
      "Podávaj s lyžicou gréckeho jogurtu a opraženými semienkami podľa chuti."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-s-os-ovicova-kari-polievka",
    "title": "Šošovicová kari polievka",
    "category": "vecera",
    "description": "Výživná polievka - bezlepkové",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Mrkvy, nakrájanej na plátky",
        "amount": "100g"
      },
      {
        "name": "Kari prášku",
        "amount": "1 ČL"
      },
      {
        "name": "Zeleru, nakrájaného na plátky",
        "amount": "90 g"
      },
      {
        "name": "Cibuľa, nasekaná najemno",
        "amount": "1 ks"
      },
      {
        "name": "Mletý koriander",
        "amount": "1 ČL"
      },
      {
        "name": "Cesnaku, nasekaného najemno",
        "amount": "3 g"
      },
      {
        "name": "Nízkotučného",
        "amount": "135 ml"
      },
      {
        "name": "Červenej šošovice kokosového mlieka",
        "amount": "90 g"
      },
      {
        "name": "Nasekaných rajčín",
        "amount": "270 g"
      },
      {
        "name": "Zeleninového vývaru",
        "amount": "330 ml"
      },
      {
        "name": "Konzervovaná zelenina",
        "amount": "400 g"
      },
      {
        "name": "sójovej omáčky",
        "amount": "1 Cl"
      }
    ],
    "steps": [
      "Do hrnca pridaj mrkvu, zeler, cibuľu a cesnak s trochou vody (aby sa zelenina nelepila). Var nad stredným ohňom 5 - 6 minút, vodu pridaj podľa",
      "Pridaj korenie a var 1 - 2 minúty.",
      "Potom pridajte Šošovicu, nasekané rajčiny, kokosové mlieko a vývar. Priveď k varu a nechaj variť ďalších 20 - 25 minút. Občas premiešaj, aby sa polievka nepripálila.",
      "Nakoniec primiešaj sójovú omáčku a podávaj."
    ],
    "allergens": [
      "dairy",
      "nuts",
      "soy"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-vega-nska-s-os-ovicova-polievka",
    "title": "Vegánska šošovicová polievka",
    "category": "vecera",
    "description": "Výživná polievka - vhodné pre vegánov, bezlepkové",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "V4 šálky hnedej alebo zelenej šošovice + šálka šalátovej zeleniny (kel,",
        "amount": "2 hrste"
      },
      {
        "name": "Mrkva, nakrájaná na plátky kapusta, zelená cibuľka)",
        "amount": "1"
      },
      {
        "name": "Zeler, nakrájaný na plátky",
        "amount": "1"
      },
      {
        "name": "Veľké nasekané šampiňóny",
        "amount": "4"
      },
      {
        "name": "Cesnaku, pretlačeného",
        "amount": "2 strúčiky"
      },
      {
        "name": "Zeleninový vývar",
        "amount": "250 ml"
      },
      {
        "name": "Výhonky rozmarínu alebo",
        "amount": "1"
      },
      {
        "name": "nasekaných baby zemiakov tymiánu",
        "amount": "2/3 šálky"
      },
      {
        "name": "Trochu citrónovej šťavy",
        "amount": "½ ks"
      }
    ],
    "steps": [
      "Do stredného hrnca si pridaj trochu vody, cibuľu, cesnak, mrkvu, zeler a hríby. Dochuf soľou a čiernym korením, premiešaj a restuj 4 - 5 minút alebo do zlatohneda.",
      "Nakrájaj zemiaky a dochuť ich soľou a čiernym korením. Potom ich pridaj do hrnca. Miešaj a var 2 minúty.",
      "Nakrájaj rozmarín a tymián a pridaj do hrnca, prilej zeleninový vývar a zvýš oheň na vysoký. Pridaj šošovicu a pomiešaj. Keď zmes začne bublať, zníž oheň a nechaj variť 15 - 20 minút, alebo kým sú zemiaky a šošovica mäkké.",
      "Umy šalátovú zeleninu a pridaj do hrnca. zamiešaj a prikry. Var ďalšie 3 - 4 minúty, kým zelenina nezmäkne. Dochuť podľa potreby, pridaj soľ a čierne korenie, citrónovú šťavu a viac byliniek. Podávaj s ryžou alebo karfiolovou"
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-vy-var-na-a-zijsky-s-ty-l",
    "title": "Vývar na ázijský štýl",
    "category": "vecera",
    "description": "Výživná polievka",
    "prepTime": 35,
    "servings": 4,
    "calories": 280,
    "protein": 16,
    "carbs": 32,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Šálka domáceho vývaru z kostí ° 35 g fazuľových klíčkov",
        "amount": "1"
      },
      {
        "name": "Šálka vody",
        "amount": "1"
      },
      {
        "name": "Čínskej kapusty napa",
        "amount": "100 g"
      },
      {
        "name": "Hovädzí bujón",
        "amount": "1"
      },
      {
        "name": "Tvrdého tofu,",
        "amount": "80 g"
      },
      {
        "name": "Soba rezancov nakrájaného na kocky",
        "amount": "65 g"
      },
      {
        "name": "Sójovej omáčky ° 10g jarnej cibuľky",
        "amount": "30 ml"
      },
      {
        "name": "Lyžička sezamového oleja + čerstvý koriander",
        "amount": "1"
      },
      {
        "name": "Mirinu (ryžového vína) čili vločky",
        "amount": "15 ml"
      },
      {
        "name": "Húb nakrájaných na plátky",
        "amount": "70 g"
      },
      {
        "name": "Mrkvy alebo nakladaný",
        "amount": "50 g"
      }
    ],
    "steps": [
      "Do hrnca pridaj vývar z kostí, bujón a 1 šálku vody a priveď k varu.",
      "Medzitým opeč huby na olivovom oleji. Pridaj mrkvu a zľahka podus. Keď huby zhnednú, pridaj tofu a opekaj 3 - 4 minúty alebo kým nebude pekne",
      "Uvar soba rezance podľa návodu na obale a potom ich odlož bokom.",
      "Do vývaru pridaj sójovú omáčku, sezamový olej a mirin a potom ním zalej",
      "Na vrch polož huby, mrkvu, fazuľové klíčky, čínsku kapustu a tofu. Ozdob čerstvým zázvorom, koriandrom, chilli vločkami a jarnou cibuľkou."
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "polievka"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-ranajky-acai-miska",
    "title": "Acai miska",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 1,
    "calories": 310,
    "protein": 12,
    "carbs": 42,
    "fat": 11,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Banán",
        "amount": "1"
      },
      {
        "name": "Nakrájaný na plátky a zmrazený)",
        "amount": "1 ks"
      },
      {
        "name": "Mrazeného pyré acai",
        "amount": "100 g"
      },
      {
        "name": "Čučoriedok (jedno balenie)",
        "amount": "4 šálky"
      },
      {
        "name": "% šálky jahôd",
        "amount": "80 g"
      },
      {
        "name": "Nesladeného mandľového kokos a lyžica semienok na",
        "amount": "20 g"
      },
      {
        "name": "Mlieka ozdobu",
        "amount": "200 ml"
      }
    ],
    "steps": [
      "Všetky prísady vložte do mixéra a pridajte mlieko a jogurt. Mixuj, kým nebude hladké a rovnomerne rozmixované. V prípade potreby pridajte viac mlieka.",
      "Zmes nalej do misky a ozdob ju ovocím, semienkami, kokosom či kúskami"
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-avoka-dovy-toast-s-fetou",
    "title": "Avokádový prípitok s fetou",
    "category": "ranajky",
    "description": "Chutné raňajky - vhodné pre vegánov",
    "prepTime": 25,
    "servings": 2,
    "calories": 440,
    "protein": 32,
    "carbs": 35,
    "fat": 18,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Kváskový chlieb",
        "amount": "2 plátky"
      },
      {
        "name": "Avokáda",
        "amount": "½ ks"
      },
      {
        "name": "Tety",
        "amount": "25 g"
      },
      {
        "name": "Prekrojené cherry rajčiny",
        "amount": "3"
      },
      {
        "name": "Lístky bazalky",
        "amount": "2"
      },
      {
        "name": "Citrónová šťava",
        "amount": "½ ks"
      },
      {
        "name": "podľa chuti Čierne koreni",
        "amount": ""
      }
    ],
    "steps": [
      "Chlieb si opeč v hriankovači, prípadne na panvici. Rozotri naň avokádo a rozdrob na vrch fetu a bazalku. Vytlač na toast citrónovú šťavu a popráš čiernym korením. Podávaj s čerešňovými rajčinami.",
      "Veľmi rada robím nátierku z avokáda, fety, tuniaka a citrónovej šťavy.",
      "Používam ju keď mám náročný deň alebo keď viem, že deti majú veľa",
      "Tuniak v konzerve je veľmi rýchly spôsob, ako si dopriať potrebné bielkoviny a zdravé tuky."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-ranajky-bana-novo-ovsene-lievance",
    "title": "Banánovo ovsené lievance",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 285,
    "protein": 10,
    "carbs": 38,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Banánov",
        "amount": "100 g"
      },
      {
        "name": "Ovsených vločiek",
        "amount": "70 g"
      },
      {
        "name": "Mandľového alebo nízkotučného mlieka",
        "amount": "4 šálky"
      },
      {
        "name": "Vajíčko",
        "amount": "1"
      },
      {
        "name": "Škoric",
        "amount": "1 ČL"
      },
      {
        "name": "Prášku do pečiva",
        "amount": "1 ČL"
      },
      {
        "name": "Ovoci",
        "amount": "100 g"
      },
      {
        "name": "Orechové maslo",
        "amount": "20 g"
      },
      {
        "name": "P L Javorový sirup",
        "amount": "1"
      }
    ],
    "steps": [
      "Servíruj s ovocím, orechovým maslom či trochou javorového sirupu."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-bana-novy-chlieb",
    "title": "Banánový chlieb",
    "category": "ranajky",
    "description": "Chutné raňajky - vhodné pre vegánov",
    "prepTime": 15,
    "servings": 1,
    "calories": 420,
    "protein": 18,
    "carbs": 48,
    "fat": 16,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Ľanových semienok zmiešaných",
        "amount": "15 g"
      },
      {
        "name": "So 6 lyžicami vody",
        "amount": "250 ml"
      },
      {
        "name": "Celozrnnej hladkej múky",
        "amount": "290 g"
      },
      {
        "name": "Lyžička prášku do pečiva",
        "amount": "1 ČL"
      },
      {
        "name": "lyžičky sódy bikarbóny",
        "amount": "1/2"
      },
      {
        "name": "lyžičky škoric",
        "amount": "1/2"
      },
      {
        "name": "Datlí nasekaných nadrobno",
        "amount": "55 g"
      },
      {
        "name": "Popučených banánov",
        "amount": "500 g"
      }
    ],
    "steps": [
      "Predhrej rúru na 150 stupňov. Ľanové semienka zmiešaj s vodou a nechaj odstáť, kým sa nezlepia.",
      "Do misky pridaj múku, sódu bikarbónu, prášok do pečiva, škoricu a premiéru. Na záver pridaj datle, popučené banány, ľanové semienka a dôklade premiešaj celú zmes.",
      "Obdlžnikovú tortovú formu vylož papierom na pečenie a nalej do nej rovnomerne pripravené cesto. Peč v rúre 50 - 60 minút. Po vychladnutí",
      "Chlieb je skvelý s mandľovým maslom alebo s kokosovým jogurtom, čerstvými figami, pistáciami a kvapkou čistého javorového sirupu."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-bylinkove-vaji-c-ka-s-kyslou-kapustou",
    "title": "Bylinkové vajíčka s kyslou kapustou",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 350,
    "protein": 14,
    "carbs": 44,
    "fat": 13,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Kváskového chleba",
        "amount": "2 plátky"
      },
      {
        "name": "Vw avokáda",
        "amount": "½ ks"
      },
      {
        "name": "Citrónová šťava",
        "amount": "½ ks"
      },
      {
        "name": "Sezamových semienok,",
        "amount": "1 ČL"
      },
      {
        "name": "Opražených",
        "amount": "20 g"
      },
      {
        "name": "Kyslej kapusty",
        "amount": "60g"
      },
      {
        "name": "Veľké vajíčka",
        "amount": "4"
      },
      {
        "name": "Olivového oleja",
        "amount": "1 ČL"
      },
      {
        "name": "Kôprové výhonky",
        "amount": "4"
      },
      {
        "name": "Pažítky",
        "amount": "20 g"
      },
      {
        "name": "Výhonkov petržlenovej vňat",
        "amount": "8"
      },
      {
        "name": "podľa chuti Soľ a čierne korenie podľa chuti",
        "amount": ""
      }
    ],
    "steps": [
      "Na nepriľnavej panvici si zohrej olej a pridaj nahrubo nasekané bylinky. Peč",
      "1 minútu a pridaj vajíčka. Urob si z nich praženicu alebo ich nechaj piecť",
      "Chlieb najprv opeč v toastovači, potom ho natri avokádom a posyp sezamovými semienkami. Polej trochou citrónovej šťavy.",
      "Vajíčka polož navrch avokáda a servíruj s kyslou kapustou. dochuť zvyšnými bolinkami, citrónovou šťavou a soľou."
    ],
    "allergens": [
      "eggs",
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-c-ili-stratene-vaji-c-ka",
    "title": "Čili stratené vajíčka",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 395,
    "protein": 16,
    "carbs": 50,
    "fat": 14,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Veľké vajcia",
        "amount": "2"
      },
      {
        "name": "Baby špenátu",
        "amount": "30 g"
      },
      {
        "name": "lyžičky chilli vločiek",
        "amount": "1/2"
      },
      {
        "name": "Šampiňónov, nakrájaných",
        "amount": "40 g"
      },
      {
        "name": "plátok Plátok kváskového chleba, opečený",
        "amount": "1"
      },
      {
        "name": "Rozdrvený strúčik cesnaku",
        "amount": "2 strúčiky"
      },
      {
        "name": "lyžice strúhaného parmezánu",
        "amount": "1/2"
      },
      {
        "name": "P L nasekaného Vetvička nasekanej petržlenovej vňat",
        "amount": "1"
      }
    ],
    "steps": [
      "Malý hrniec naplň do polovice vodou, priveď do varu, zníž na mierny ohrev a pridaj ocot. Krúživým pohybom vytvor vír. Do vody opatrne vlož vajcia a var 3 - 4 minúty. Ak chceš vajcia vybrať, použi lyžicu a polož ich na papierovú utierku alebo ich osuš.",
      "Nepriľnavú panvicu daj na stredný oheň a pridaj olej. Keď sa olej rozvonia, pridaj špenát, cesnak, huby, chilli vločky, petržlenovú vňať, soľ a korenie.",
      "Restuj 2 - 3 minúty alebo kým zelenina nezmäkne.",
      "Zeleninovú zmes z panvice poukladaj na toasty a posyp parmezánom a ozdob strateným vajíčkom."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-c-okola-dova-ran-ajkova-miska",
    "title": "Čokoládová raňajková miska",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 1,
    "calories": 330,
    "protein": 11,
    "carbs": 46,
    "fat": 11,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Mrazený banán",
        "amount": "1 ks"
      },
      {
        "name": "% šálky nesladeného mandľového",
        "amount": "1 ks"
      },
      {
        "name": "Mlieka",
        "amount": "20 g"
      },
      {
        "name": "Odmerka proteínu okvapkani",
        "amount": "30 g"
      },
      {
        "name": "Polievková lyžica kakaa",
        "amount": "1 ČL"
      },
      {
        "name": "Polievková lyžica chia semienok",
        "amount": "20 g"
      },
      {
        "name": "Malá hrsť špenátu",
        "amount": "2 hrste"
      }
    ],
    "steps": [
      "V mixéri zmiešaj banán, mandľové mlieko, proteínový prášok, kakao, chia semienka, ľad a špenát. Rozmixuj do úplne hladkej zmesi - mrazený banán a ľad vytvoria hustú zmes. V prípade potreby pridaj malé množstvo tekutiny.",
      "Prenes do misky a podľa chuti pridaj banán (alebo iné ovocie) a arašidové"
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-jahodovy-chia-puding",
    "title": "Jahodový chia puding",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 1,
    "calories": 275,
    "protein": 9,
    "carbs": 36,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Čerstvých jahôd",
        "amount": "80 g"
      },
      {
        "name": "1/2 banánu",
        "amount": "1 ks"
      },
      {
        "name": "Mandľového mlieka",
        "amount": "200 ml"
      },
      {
        "name": "čokoládového",
        "amount": "1 Odmerka"
      },
      {
        "name": "Proteínového prášku",
        "amount": "30 g"
      },
      {
        "name": "Chia semienok",
        "amount": "20 g"
      },
      {
        "name": "Lyžička javorového sirupu",
        "amount": "1"
      },
      {
        "name": "Mandľového mlieka",
        "amount": "200 ml"
      }
    ],
    "steps": [
      "Najskôr nasyp do nádoby chia semienka, potom prilej mandľové mlieko, javorový sirup a zľahka premiešaj.",
      "Prísady na jahodovú vrstvu vlož do mixéra a rozmixuj dohladka. Hotovú zmes nalej na vrstvu chia semienok a mandľového mlieka. Nechaj stuhnúť v chladničke aspoň pár hodín. Ak chceš dosiahnuť hustý puding, nechaj ho odležať cez noc."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-kokosovo-poha-nkova-overnight-kas-a",
    "title": "Kokosovo pohánková cez noc kaša",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 440,
    "protein": 20,
    "carbs": 52,
    "fat": 17,
    "fiber": 6,
    "ingredients": [
      {
        "name": "pohánkovej krupice (nie",
        "amount": "1/2 šálky"
      },
      {
        "name": "Kaše)",
        "amount": "100 g"
      },
      {
        "name": "1/4 čajovej lyžičky škoric",
        "amount": "½ ČL"
      },
      {
        "name": "štipka štipka soli",
        "amount": ""
      },
      {
        "name": "Ovocia",
        "amount": "100 g"
      },
      {
        "name": "P L Strúhaného kokosu",
        "amount": "1"
      },
      {
        "name": "Chia semienok",
        "amount": "20 g"
      },
      {
        "name": "(30 g) Lyžička vegánskeho proteínu",
        "amount": "1 odmerka"
      },
      {
        "name": "Kokosové mlieko",
        "amount": "200 ml"
      },
      {
        "name": "Mlieka (alebo iného) (voliteľné)",
        "amount": "200 ml"
      },
      {
        "name": "Šálka nesladeného mandľového chia/ orechy/ kúsky čokolády",
        "amount": "20 g"
      },
      {
        "name": "Mlieka na ozdobu",
        "amount": "200 ml"
      },
      {
        "name": "Šálka vody",
        "amount": "250 ml"
      }
    ],
    "steps": [
      "V miske zmiešaj pohánkovú krupicu, chia semienka, mlieko, vodu, vanilkový extrakt, škoricu a soľ. Prikryte ju fóliou a nechajte cez noc v chladničke.",
      "Ráno ju vlož do hrnca a za občasného miešania var 10-12 minút alebo kým nedosiahne požadovanú hustotu.",
      "Ozdobte ho ovocím, kokosom a orechmi. Podávajte.",
      "Ozdob ju ovocím, kokosom a orechmi."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-omeleta-s-kyslou-kapustou",
    "title": "Omeleta s kyslou kapustou",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 365,
    "protein": 15,
    "carbs": 40,
    "fat": 15,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Veľké vajcia",
        "amount": "4"
      },
      {
        "name": "Vetvičiek petržlenovej vňat",
        "amount": "8"
      },
      {
        "name": "Kváskového chleba + citrónová šťava",
        "amount": "2 plátky"
      },
      {
        "name": "P L ° 60g nakrájanej kyslej kapusty",
        "amount": "1"
      },
      {
        "name": "Čajová lyžička opražených",
        "amount": "2 ČL"
      },
      {
        "name": "Vetvičky kôpru sezamových semienok",
        "amount": "4"
      },
      {
        "name": "Pažítky",
        "amount": "20 g"
      }
    ],
    "steps": [
      "Na nepriľnavej panvici rozohrej olej. Bylinky nahrubo nakrájaj a 1 minútu opekaj. Na panvicu s bylinkami rozbi vajcia a buď ich rozmiešaj, alebo",
      "Chlieb opeč v hriankovači, natri naň avokádo, posyp sezamovými semienkami a pokvapkaj citrónovou šťavou.",
      "Na avokádo naservíruj vajcia, bokom polož kyslú kapustu a dochuť zvyšnými bolinkami, citrónovou šťavou a soľou."
    ],
    "allergens": [
      "eggs",
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-ovsena-mrkvova-kas-a",
    "title": "Ovsená mrkvová kaša",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 305,
    "protein": 13,
    "carbs": 35,
    "fat": 12,
    "fiber": 6,
    "ingredients": [
      {
        "name": "P L Zlatých hrozienok",
        "amount": "1"
      },
      {
        "name": "Škoric",
        "amount": "1 ČL"
      },
      {
        "name": "P L Gréckeho bieleho jogurtu",
        "amount": "2"
      },
      {
        "name": "Medu",
        "amount": "1 ČL"
      },
      {
        "name": "vanilkového wpi",
        "amount": "1 Odmerka"
      },
      {
        "name": "Prášku (whey protein izolát)",
        "amount": "30 g"
      },
      {
        "name": "Kokosových lupienkov",
        "amount": "1 ČL"
      },
      {
        "name": "malá mrkva, očistená a",
        "amount": "1 ks"
      },
      {
        "name": "Nastrúhaná",
        "amount": "1 ks"
      },
      {
        "name": "Ovsených vločiek (ženská",
        "amount": "½ šálky"
      },
      {
        "name": "Porcia) alebo 1 šálka ovsených",
        "amount": "50 g"
      },
      {
        "name": "Vločiek (mužská porcia)",
        "amount": "50 g"
      },
      {
        "name": "Čučoriedok",
        "amount": "½ šálky"
      }
    ],
    "steps": [
      "Do stredne veľkého kastrólika pridaj 3 šálky vody, prisyp ovsené vločky a nechaj zovrieť.",
      "Medzičasom postrúhaj mrku a nakrájaj hrozienka na menšie kúsky.",
      "Keď zmes v kastróliku zovrie, zníž oheň a nechaj vločky variť ešte 10 - 12 minút. Pridaj strúhanú mrkvu, čučoriedky, hrozienka a škoricu.",
      "Keď je kaša Úplne uvarená, nalej ju do stredne veľkej misky a primiešaj vanilkový proteínový prášok. Ak sa ti kaša zdá hustá, pridaj viac vody alebo nízkotučného mlieka.",
      "Pridaj dve lyžice gréckeho jogurtu na vrch kaše, doslaď 1 ČL medu a posyp kokosovými lupienkami."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-ovseny-chia-puding",
    "title": "Ovsený chia puding",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 380,
    "protein": 14,
    "carbs": 48,
    "fat": 13,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Šálka nesladeného mandľového",
        "amount": "1"
      },
      {
        "name": "Mlieka (alebo iného)",
        "amount": "200 ml"
      },
      {
        "name": "(30 g) proteínového",
        "amount": "1 Odmerka"
      },
      {
        "name": "Proteínový prášok",
        "amount": "30 g"
      },
      {
        "name": "Mrazených čučoriedok",
        "amount": "80 g"
      },
      {
        "name": "Alebo jahôd, prípadne orechy",
        "amount": "20 g"
      },
      {
        "name": "ovsených vločiek",
        "amount": "1/2 šálky"
      },
      {
        "name": "P L Chia semienok",
        "amount": "2"
      }
    ],
    "steps": [
      "Do proteínového šejkra alebo mixéra pridajte mlieko a potom proteínový prášok a pretrep, kým sa prášok nerozpustí.",
      "Do samostatnej nádoby pridajte ovsené vločky, chia semienka, ovocie alebo orechy a zalej ich proteínovým mliekom. Nechaj v chladničke cez noc."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-ovseny-overnight-s-c-uc-oriedkami",
    "title": "Ovsený cez noc s čučoriedkami",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 345,
    "protein": 12,
    "carbs": 44,
    "fat": 12,
    "fiber": 6,
    "ingredients": [
      {
        "name": "ovsených vločiek",
        "amount": "1/2 šálky"
      },
      {
        "name": "štipka štipka soli",
        "amount": ""
      },
      {
        "name": "Nízkotučného alebo mandľového mlieka",
        "amount": "200 ml"
      },
      {
        "name": "Gréckeho vanilkového jogurtu",
        "amount": "150 g"
      },
      {
        "name": "Čerstvých čučoriedok (alebo rozmrazených bobúľ)",
        "amount": "80 g"
      },
      {
        "name": "P L Lyžica medu",
        "amount": "1"
      },
      {
        "name": "Odmerka proteínu (voliteľné)",
        "amount": "30 g"
      },
      {
        "name": "Mandle/pekanové orechy (voliteľné)",
        "amount": "20 g"
      },
      {
        "name": "Štipka soli",
        "amount": "200 ml"
      }
    ],
    "steps": [
      "Nechaj v chladničke na celú noc (alebo minimálne na 4 hodiny).",
      "Ak podávaš ovsené vločky studené: premiešaj ich a pridaj čerstvé čučoriedky, nasekané orechy (mandle/pekanové orechy) a med.",
      "Ak podávaš ovsené vločky horúce: premiešaj ovsené vločky a ohrej ich v mikrovlnnej rúre v 30-sekundových intervaloch, pričom medzi jednotlivými intervalmi ich vždy pomiešaj. Na vrch daj grécky jogurt, čučoriedky a nasekané orechy."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-praz-enica-s-kozi-m-syrom",
    "title": "Praženica s kozím syrom",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 290,
    "protein": 10,
    "carbs": 38,
    "fat": 11,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Vajcia",
        "amount": "2"
      },
      {
        "name": "Listov baby špenátu",
        "amount": "2 hrste"
      },
      {
        "name": "Húb",
        "amount": "40g"
      },
      {
        "name": "Kozieho syra",
        "amount": "25 g"
      },
      {
        "name": "na postriekanie Xtra panenský olivový olej v spreji",
        "amount": ""
      },
      {
        "name": "Lyžička kajenského korenia na dochuteni",
        "amount": "1"
      },
      {
        "name": "plátok Plátok celozrnného chleba",
        "amount": "1"
      }
    ],
    "steps": [
      "V malej miske si rozšľahaj vajíčka, kým nebude zmes jednotná a",
      "Panvicu s nepriľnavým povrchom postriekaj olivovým olejom a daj na stredný oheň. Huby nakrájaj na kocky, pridaj na panvicu a smaž približne 4 minúty alebo kým nie sú opečené. Pridaj špenát a pravidelne miešaj.",
      "Keď je špenát opečený, pridaj vajcia a pravidelne ich miešaj aby boli ľahké a nadýchané. Nakoniec praženicu ochuf soľou, korením, kajenským korením a na vrch rozdrob kozí syr.",
      "Opeč chlieb, navrstvi naň praženicu a podávaj teplé."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-praz-enica-z-tofu",
    "title": "Praženica z tofu",
    "category": "ranajky",
    "description": "Chutné raňajky - vhodné pre vegánov",
    "prepTime": 15,
    "servings": 1,
    "calories": 410,
    "protein": 17,
    "carbs": 46,
    "fat": 16,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Tofu . ½ čl morskej soli",
        "amount": "150 g"
      },
      {
        "name": "Olivového oleja . > cl cesnakového prášku",
        "amount": "1 ČL"
      },
      {
        "name": "1/4 červenej cibule . a cl mletej rasc",
        "amount": "1 ks"
      },
      {
        "name": "Červenej papriky . / cl chili prášku",
        "amount": "½"
      },
      {
        "name": "Šálka špenátu (nasekaného) . ½ cl kurkumy",
        "amount": "1"
      },
      {
        "name": "podľa chuti Soľ (ideálne čierna) a čierne korenie",
        "amount": ""
      },
      {
        "name": "Vs avokáda",
        "amount": "½ ks"
      },
      {
        "name": "Rajčín (nakrájaných)",
        "amount": "½ šálky"
      },
      {
        "name": "Plátok špaldového/celozrnného",
        "amount": "1"
      },
      {
        "name": "Toastu",
        "amount": "2 plátky"
      }
    ],
    "steps": [
      "Zbav tofu čo najviac vody a nadrob ho na malé kúsky.",
      "Priprav si omáčku - všetky koreniny pridaj do menšej misky a zalej takým množstvom vody, aby sa ti vytvorila zmes, ktorá sa leje. Nechaj na strane.",
      "Na panvici zohrej olivový olej a pridaj nakrájanú cibuľu a červenú papriku.",
      "Dochuť štipkou soli a čierneho korenia, pomiešaj a opekaj domäkka.",
      "Pridaj špenát, prikry pokrievkou a nechaj dusiť asi 2 minúty.",
      "Pomocou varešky si posuň zeleninu na jednu časť panvice a na druhú pridaj tofu. Peč asi 2 minúty a potom tofu polej pripravenou omáčkou (trochu nalej aj na zeleninu), zamiešaj a peč ďalších 5 - 7 minút, alebo kým tofu zľahka nezhnedne. Hotovú praženicu môžeš zmiešať so zeleninou na panvici, alebo podávať oddelene spolu s toastom, avokádom a rajčinami."
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-protei-nova-kas-a-s-c-uc-oriedkami",
    "title": "Proteínová kaša s čučoriedkami",
    "category": "ranajky",
    "description": "Chutné raňajky - vhodné pre vegánov, bezlepkové",
    "prepTime": 15,
    "servings": 1,
    "calories": 325,
    "protein": 11,
    "carbs": 42,
    "fat": 12,
    "fiber": 6,
    "ingredients": [],
    "steps": [
      "Ovsené vločky, vodu a škoricu vlož do mikrovlnnej rúry na 3 minúty alebo kým nenabobtnajú. Voda musí pokryť suché ovsené vločky. Potom vmiešaj jednu odmerku proteínového prášku.",
      "Kým sa ovsené vločky varia v mikrovlnnej rúre, vlož čučoriedky, javorový sirup a citrónovú šťavu do malej panvice a priveď ich k varu, nechaj ich variť asi 3 minúty na vysokej teplote alebo kým čučoriedky nepopukajú a mierne sa nerozpadnú. Prípadne ich môžeš vložiť do mikrovlnnej rúry na",
      "1,5 minúty po tom, čo sú ovsené vločky hotové. (lo im umožní vychladnúť).",
      "Keď kaša trochu vychladne, zmiešaj ju s mliekom, jogurtom a hotovým čučoriedkovým džemom. Podávaj s hrozienkami, vlašskými orechmi a ozdob napríklad čučoriedkami alebo javorovým sirupom či medom."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-sezamovy-losos-na-raz-nom-chlebe",
    "title": "Sezamový losos na ražnom chlebe",
    "category": "ranajky",
    "description": "Chutné raňajky",
    "prepTime": 25,
    "servings": 2,
    "calories": 440,
    "protein": 32,
    "carbs": 35,
    "fat": 18,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Údeného lososa",
        "amount": "150 g"
      },
      {
        "name": "V> avokáda",
        "amount": "½ ks"
      },
      {
        "name": "Ražného chleba",
        "amount": "2 plátky"
      },
      {
        "name": "Pl citrónovej šťavy",
        "amount": "½ ks"
      },
      {
        "name": "P L Čerstvý kôpor (môže byť aj sušený)",
        "amount": "1"
      },
      {
        "name": "V, červenej cibul",
        "amount": "1 ks"
      },
      {
        "name": "Sezamových semienok",
        "amount": "1 ČL"
      },
      {
        "name": "podľa chuti Soľ",
        "amount": ""
      },
      {
        "name": "podľa chuti Čierne koreni",
        "amount": ""
      }
    ],
    "steps": [
      "V menšej miske si zmiešaj avokádo, kôpor, citrónovú šťavu, soľ a čierne korenie dohladka.",
      "Opeč ražný chlieb v toatovači a potri ho avokádovou zmesou.",
      "Pridaj údeného lososa a najemno nakrájanú cibuľu. Chlieb posyp sezamovými semienkami podľa chuti."
    ],
    "allergens": [
      "fish",
      "gluten"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-ranajky-sladka-kre-mova-kas-a-s-quinoou",
    "title": "Sladká krémová kaša s quinoou",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 1,
    "calories": 370,
    "protein": 15,
    "carbs": 40,
    "fat": 15,
    "fiber": 6,
    "ingredients": [
      {
        "name": "P L Javorového sirupu",
        "amount": "½"
      },
      {
        "name": "P L Tahini",
        "amount": "½"
      },
      {
        "name": "Tekvicových semiačok",
        "amount": "10 g"
      },
      {
        "name": "Hrozienok",
        "amount": "10 g"
      },
      {
        "name": "Nesladeného mandľového mlieka 2 veľké nasekané vlašské orechy",
        "amount": "200 ml"
      },
      {
        "name": "Ys šálky vody (poprípade trochu 2 pl gréckeho jogurtu",
        "amount": "250 ml"
      },
      {
        "name": "Viac mlieka alebo vody ak chcete",
        "amount": "250 ml"
      },
      {
        "name": "Quinoa vločiek",
        "amount": "4 šálky"
      },
      {
        "name": "P L Mletých ľanových semiačok",
        "amount": "1"
      },
      {
        "name": "Štipka kurkumy",
        "amount": "1"
      },
      {
        "name": "Nízkotučného alebo",
        "amount": "4 šálky"
      }
    ],
    "steps": [
      "Do stredne veľkého kastrólika daj guinoa vločky, ľanové semiačka, mlieko a % šálky vody a pomiešaj.",
      "Var kašu na strednom plameni a jemne miešaj. V priebehu dvoch minút by kaša mala začať bublať a hustnúť. Ak buble príliš, zníž teplotu a",
      "Neprestávaj miešať. Nevar kašu viac ako 3 minúty. Pridaj trochu mlieka alebo vody ak kaša počas varenia príliš hustne.",
      "Kašu nechaj chvíľu vychladnúť. Servíruj ju stále horúcu s trochou javorového sirupu a s orechami, jogurtom, hrozienkami a tahini. Nakoniec pridaj podľa chuti škoricu a muškátový orech."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-slana-palacinka-s-rukolou-a-s-unkou",
    "title": "Slaná palacinka s rukolou a šunkou",
    "category": "ranajky",
    "description": "Chutné raňajky",
    "prepTime": 15,
    "servings": 1,
    "calories": 300,
    "protein": 10,
    "carbs": 40,
    "fat": 11,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Vajc",
        "amount": "2 ks"
      },
      {
        "name": "Šunky",
        "amount": "50 g"
      },
      {
        "name": "Hladkej múky (alebo pohánkovej múky)",
        "amount": "20 g"
      },
      {
        "name": "Syra",
        "amount": "25 g"
      },
      {
        "name": "Rukoly",
        "amount": "½ šálky"
      },
      {
        "name": "Lyžička dijonskej horčic",
        "amount": "1 ČL"
      },
      {
        "name": "Nízkotučného mlieka (alebo rastlinného)",
        "amount": "½ šálky"
      },
      {
        "name": "podľa chuti Sol a koreni",
        "amount": ""
      },
      {
        "name": "na postriekanie Xtra panenský olivový olej v spreji",
        "amount": ""
      }
    ],
    "steps": [
      "V malej miske vyšľahaj vajce, múku a mlieko do nadýchanej peny. Pridaj trochu soli a korenia.",
      "Nepriľnavú panvicu postav na stredný oheň a postriekaj ju olivovým olejom.",
      "Nechaj panvicu zohriať, potom na panvicu vylej odmerku cesta a rovnomerne ju rozlej. Peč 1 - 2 minúty a potom obráť a peč ďalších niekoľko minút na druhej strane. Hotovú palacinku prelož na tanier.",
      "Stred palacinky potri horčicou, potom do stredu polož šunku, syr, nakrájanú paradajku a rukolu a palacinku prelož na polovicu. Znovu zohrejte nepriľnavú panvicu a vráťte palacinku na 1 - 2 minúty alebo kým sa syr nezačne v strede rozpúšťať. Po upečení ju položte na tanier a podávajte s ďalšou rukolou.",
      "Znovu zohrej panvicu a vráť palacinku na 1 - 2 minúty alebo kým sa syr nezačne v strede rozpúšťať. Po upečení ju polož na tanier a podávaj s ďalšou rukolou."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-s-paldova-placka-s-ricottou",
    "title": "Špaldová placka s ricottou",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 455,
    "protein": 22,
    "carbs": 50,
    "fat": 18,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Špaldová placka",
        "amount": "1"
      },
      {
        "name": "Vajíčko",
        "amount": "1"
      },
      {
        "name": "Nízkotučnej ricotty",
        "amount": "70 g"
      },
      {
        "name": "Hrsť špenátu",
        "amount": "1"
      },
      {
        "name": "Cherry rajčiny",
        "amount": "4"
      },
      {
        "name": "Červená cibuľa",
        "amount": "1 ks"
      },
      {
        "name": "Čili",
        "amount": "½ ČL"
      },
      {
        "name": "P L Limetkovej šťavy",
        "amount": "1"
      },
      {
        "name": "P L nasekaného 1/8 hrsť koriandra",
        "amount": "1"
      },
      {
        "name": "P L Olivový olej",
        "amount": "1"
      }
    ],
    "steps": [
      "Na stredne veľkej panvici si rozpáľ olivový olej, pridaj vajíčka a priprav si ich podľa vlastnej preferencie.",
      "Predohrej toastovač, priprav si placku a potri ju ricottou na jednej polke. Na vrch polož špenát a prelož na polovicu. Takto pripravenú placku polož do toastovača, pokrop zľahka olivovým olejom a nechaj zapiecť.",
      "V samostatnej miske si zmiešaj nasekané rajčiny, cibuľu, čili, koriander a limetkovú šťavu.",
      "Hotové placky naplň vajíčkom, nakrájaj ich na štvrtiny a podávaj spolu s rajčinovou salsou."
    ],
    "allergens": [
      "eggs",
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-toasty-s-vaji-c-kom-hubami-a-avoka-dom",
    "title": "Toasty s vajíčkom, hubami a avokádom",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 340,
    "protein": 13,
    "carbs": 43,
    "fat": 12,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Vajcia",
        "amount": "2"
      },
      {
        "name": "Šampiňónov, nakrájaných",
        "amount": "2 šálky"
      },
      {
        "name": "Krajec chleba",
        "amount": "1"
      },
      {
        "name": "Chlieb, ľubovoľný",
        "amount": "2 plátky"
      },
      {
        "name": "1/2 avokáda",
        "amount": "½ ks"
      },
      {
        "name": "- 4 strúčiky cesnaku, nahrubo",
        "amount": "2"
      },
      {
        "name": "P L Nasekaných",
        "amount": "2"
      },
      {
        "name": "P L pl balzamikového alebo",
        "amount": "1"
      },
      {
        "name": "P L Jablčného octu",
        "amount": "1"
      }
    ],
    "steps": [
      "Na panvici si zohrej olej a priprav vajíčka podľa vlastnej chuti. Hotové vajíčka odložia bokom.",
      "Na rovnakej panvici zohrej olej a pridaj cesnak. Asi po minúte pridaj huby, premiešaj, Prikry panvicu pokrievkou a nechaj huby variť 1 - 3 minúty, kým nezmäknú a nezhnednú.",
      "Zníž teplotu na minimum, pridaj soľ, korenie, ocot a premiešaj. Znovu zvýš teplotu na maximum a nechaj vypariť prebytočnú tekutinu. Huby by už mali byť mierne zhnednuté a výrazne zmenšené. Hotovú zmes odstav z tepla a nechaj bokom.",
      "Opeč chlieb, roztlač naň avokádo a pokrop ho citrónom. Na záver toast oblož pripravenými vajíčkami a hubami."
    ],
    "allergens": [
      "eggs",
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-vega-nske-palacinky",
    "title": "Vegánske palacinky",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 385,
    "protein": 16,
    "carbs": 45,
    "fat": 14,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Pohánkovej múky",
        "amount": "120 g"
      },
      {
        "name": "Mandľovej múky",
        "amount": "60 g"
      },
      {
        "name": "P L Oleja",
        "amount": "2"
      },
      {
        "name": "1čajová lyžička prášku do pečiva  ] čl vanilkového extraktu",
        "amount": "1 ČL"
      },
      {
        "name": "Čajovej lyžičky sódy bikarbóny",
        "amount": "½ ČL"
      },
      {
        "name": "Čajovej lyžičky mletej škorice nahrubo nasekaných",
        "amount": "½"
      },
      {
        "name": "Čajovej lyžičky kuchynskej soli",
        "amount": "½"
      },
      {
        "name": "Lyžice ľanového semienka (náhrada nahrubo nasekaných",
        "amount": "2"
      },
      {
        "name": "P L Vajíčka)",
        "amount": "1"
      },
      {
        "name": "P L Javorového sirupu",
        "amount": "1"
      }
    ],
    "steps": [
      "Predhrej rúru na 200 stupňov. Plech na pečenie vyystli papierom na pečenie. Odložte ho bokom.",
      "Do misky preosej pohánkovú a mandľovú múku. Pridaj prášok do pečiva, sódu bikarbónu, škoricu, soľ, ľanové semienka, javorový sirup, jogut a olej.",
      "Miešaj, kým sa cesto nespojí. Pridaj nasekané orechy a brusnice.",
      "Rozohrej panvicu s nepriľnavým povrchom na stredne silnom ohni. Potri ju olejom. Pomocou naberačky nalievaj rovnomerne cesto na panvicu a nechaj ich piecť 2 - 3 minúty (alebo kým sa na palacinkách neobjavia bublinky). Otoč a peč ďalšiu minútu alebo kým sa okraje nezlepia. Hotové palacinky udržiavajte teplé v rúre.",
      "Keď sú pripravené na podávanie, ozdob ich pekanovými orechmi a pokvapkaj javorovým sirupom."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-smoothie-bana-novo-medove-smoothie",
    "title": "Banánovo medové smoothie",
    "category": "smoothie",
    "description": "Osviežujúce smoothie - vegetariánske",
    "prepTime": 5,
    "servings": 1,
    "calories": 195,
    "protein": 6,
    "carbs": 32,
    "fat": 5,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Ovsených vločiek",
        "amount": "1,5 šálky"
      },
      {
        "name": "Vody",
        "amount": "250 ml"
      },
      {
        "name": "Nízkotučného mlieka",
        "amount": "200 ml"
      },
      {
        "name": "Vanilkového proteínu",
        "amount": "30 g"
      },
      {
        "name": "1/2 mrazeného banánu",
        "amount": "1 ks"
      },
      {
        "name": "P L Lyžička medu",
        "amount": "1"
      },
      {
        "name": "lyžičky škoric",
        "amount": "1/2"
      },
      {
        "name": "Vlašských orechov",
        "amount": "20 g"
      },
      {
        "name": "šálka Ľad",
        "amount": "1"
      }
    ],
    "steps": [
      "Všetky prísady rozmixuj v mixéri do hladka."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-smoothie-c-okola-dove-smoothie",
    "title": "Čokoládové smoothie",
    "category": "smoothie",
    "description": "Osviežujúce smoothie - vegetariánske",
    "prepTime": 5,
    "servings": 1,
    "calories": 220,
    "protein": 8,
    "carbs": 36,
    "fat": 6,
    "fiber": 4,
    "ingredients": [
      {
        "name": "čokoládového proteínu (alebo",
        "amount": "1 Odmerka"
      },
      {
        "name": "Vanilkového + odmerka kakaa)",
        "amount": "1 ČL"
      },
      {
        "name": "> mrazeného banánu",
        "amount": "1 ks"
      },
      {
        "name": "Hrsť špenátu",
        "amount": "2 hrste"
      },
      {
        "name": "Šálka mlieka",
        "amount": "1"
      },
      {
        "name": "šálka Ľad",
        "amount": "1"
      },
      {
        "name": "ovsených vločiek",
        "amount": "1/3 šálky"
      }
    ],
    "steps": [
      "Všetky prísady rozmixuj v mixéri do hladka."
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-smoothie-kokosovo-c-uc-oriedkovy-smoothie-s-datlami",
    "title": "Kokosovo čučoriedkový smoothie s datlami",
    "category": "smoothie",
    "description": "Osviežujúce smoothie - vhodné pre vegánov, bezlepkové",
    "prepTime": 5,
    "servings": 1,
    "calories": 175,
    "protein": 5,
    "carbs": 28,
    "fat": 5,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Wpi (whey proteín izolát) alebo",
        "amount": "30 g"
      },
      {
        "name": "Vegánskeho proteínového prášku",
        "amount": "30 g"
      },
      {
        "name": "Kokosovej vody",
        "amount": "250 ml"
      },
      {
        "name": "W% stredného mrazeného banánu",
        "amount": "1 ks"
      },
      {
        "name": "V4 šálky mrazených čučoriedok",
        "amount": "80 g"
      },
      {
        "name": "Odkôstkovaná mediool datľa",
        "amount": "1"
      },
      {
        "name": "Mandlí",
        "amount": "8"
      },
      {
        "name": "3-4 kocky Ľad",
        "amount": ""
      },
      {
        "name": "Aby bol výsledok čo najviac krémový, banán musí byť poriadne zmrazený",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-smoothie-kokosovo-ovocny-protei-novy-smoothie",
    "title": "Kokosovo ovocný proteínový kokteil",
    "category": "smoothie",
    "description": "Osviežujúce smoothie - vegetariánske",
    "prepTime": 5,
    "servings": 1,
    "calories": 250,
    "protein": 10,
    "carbs": 38,
    "fat": 7,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Mrazený banán",
        "amount": "1"
      },
      {
        "name": "proteínového prášku",
        "amount": "1 Odmerka"
      },
      {
        "name": "Šálka mrazeného bobuľového",
        "amount": "1"
      },
      {
        "name": "Ovocia",
        "amount": "100 g"
      },
      {
        "name": "Nízkotučného mlieka",
        "amount": "200 ml"
      },
      {
        "name": "Mandlí",
        "amount": "10g"
      },
      {
        "name": "Lyžička chia semienok",
        "amount": "1"
      },
      {
        "name": "Ovsených vločiek",
        "amount": "10g"
      },
      {
        "name": "Strúhaného kokosu",
        "amount": "10g"
      },
      {
        "name": "Jahôd",
        "amount": "30 g"
      }
    ],
    "steps": [
      "Banán daj zamraziť na noc do mrazničky. Kaša tak získa správnu krémovú konzistenciu.",
      "Mrazený banán, proteínový prášok, mrazené bobuľové ovocie a mlieko vložené do mixéra a rozmixuj dohladka. V závislosti od konzistencie môžeš pridať o niečo viac mlieka.",
      "Hotovú zmes nalej do misky a ozdob mandľami, jahodami, chia semienkami a kokosom."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-smoothie-snickers-smoothie",
    "title": "Snickers smoothie",
    "category": "smoothie",
    "description": "Osviežujúce smoothie - vegetariánske, bezlepkové",
    "prepTime": 5,
    "servings": 1,
    "calories": 185,
    "protein": 7,
    "carbs": 30,
    "fat": 5,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Ľadu",
        "amount": "1½ šálky"
      },
      {
        "name": "Nízkotučného mlieka",
        "amount": "½ šálky"
      },
      {
        "name": "Vody",
        "amount": "½ šálky"
      },
      {
        "name": "(30g) wpi (whey proteín izolát)",
        "amount": "1 Odmerka"
      },
      {
        "name": "Proteínového prášku",
        "amount": "30 g"
      },
      {
        "name": "P L Arašidového masla",
        "amount": "1"
      },
      {
        "name": "Javorového sirupu",
        "amount": "2½ čl"
      },
      {
        "name": "čl kakaa",
        "amount": "1 ČL"
      },
      {
        "name": "Chia semiačok",
        "amount": "1 ČL"
      },
      {
        "name": "Himalájskej ružovej soli",
        "amount": "½ ČL"
      },
      {
        "name": "Datle medjool",
        "amount": "250 ml"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-smoothie-tropicky-smoothie",
    "title": "Tropický koktail",
    "category": "smoothie",
    "description": "Osviežujúce smoothie - vegetariánske, bezlepkové",
    "prepTime": 5,
    "servings": 1,
    "calories": 210,
    "protein": 8,
    "carbs": 34,
    "fat": 5,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Mandľového mlieka",
        "amount": "125 ml"
      },
      {
        "name": "Proteínového prášku",
        "amount": "30 g"
      },
      {
        "name": "Kokosového jogurtu",
        "amount": "40 g"
      },
      {
        "name": "Celá marakuja",
        "amount": "1"
      },
      {
        "name": "Čerstvého alebo mrazeného manga",
        "amount": "60 g"
      },
      {
        "name": "1/2 stredne veľkého mrazeného banánu",
        "amount": "1 ks"
      },
      {
        "name": "Lyžička javorového sirupu",
        "amount": "1"
      },
      {
        "name": "Polievková lyžica opražených misli",
        "amount": "1"
      },
      {
        "name": "Lyžička kokosových vločiek",
        "amount": "1"
      }
    ],
    "steps": [
      "Mlieko, proteínový prášok, jogurt, %4 marakuje, banán a med daj do mixéra a rozmixuj dohladka.",
      "Nalej zmes do misky a posyp granolou, zvyšnou marakujou a kokosovými"
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-smoothie-zelene-smoothie-s-protei-nom",
    "title": "Zelené smoothie s proteínom",
    "category": "smoothie",
    "description": "Osviežujúce smoothie - vegetariánske",
    "prepTime": 5,
    "servings": 1,
    "calories": 240,
    "protein": 9,
    "carbs": 36,
    "fat": 7,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Vody",
        "amount": "250 ml"
      },
      {
        "name": "Odmerka proteínu",
        "amount": "30 g"
      },
      {
        "name": "Odmerka zeleného prášku",
        "amount": "1 odmerka"
      },
      {
        "name": "Šálka špenátu",
        "amount": "2 hrste"
      },
      {
        "name": "Mrazený banán",
        "amount": "1 ks"
      },
      {
        "name": "P L Lyžička medu",
        "amount": "1"
      },
      {
        "name": "Ovsených vločiek",
        "amount": "80 g"
      },
      {
        "name": "Rastlinného alebo nízkotučného mlieka",
        "amount": "200 ml"
      },
      {
        "name": "Kociek ľadu",
        "amount": "½ šálky"
      },
      {
        "name": "Vlašské orechy",
        "amount": "3"
      }
    ],
    "steps": [
      "Všetky prísady vložte do mixéra a rozmixuj do hladka."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-bana-novo-ovsene-lievance",
    "title": "Banánovo ovsené lievance",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske",
    "prepTime": 15,
    "servings": 6,
    "calories": 145,
    "protein": 5,
    "carbs": 18,
    "fat": 6,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Banánov",
        "amount": "100 g"
      },
      {
        "name": "Ovsených vločiek",
        "amount": "70 g"
      },
      {
        "name": "Mandľového alebo nízkotučného mlieka",
        "amount": "4 šálky"
      },
      {
        "name": "Vajíčko",
        "amount": "1"
      },
      {
        "name": "Škoric",
        "amount": "1 ČL"
      },
      {
        "name": "Prášku do pečiva",
        "amount": "1 ČL"
      },
      {
        "name": "Ovoci",
        "amount": "100 g"
      },
      {
        "name": "Orechové maslo",
        "amount": "20 g"
      },
      {
        "name": "P L Javorový sirup",
        "amount": "1"
      }
    ],
    "steps": [
      "Servíruj s ovocím, orechovým maslom či trochou javorového sirupu."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-bana-novy-chlieb",
    "title": "Banánový chlieb",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov",
    "prepTime": 15,
    "servings": 6,
    "calories": 195,
    "protein": 8,
    "carbs": 22,
    "fat": 8,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Ľanových semienok zmiešaných",
        "amount": "15 g"
      },
      {
        "name": "So 6 lyžicami vody",
        "amount": "250 ml"
      },
      {
        "name": "Celozrnnej hladkej múky",
        "amount": "290 g"
      },
      {
        "name": "Lyžička prášku do pečiva",
        "amount": "1 ČL"
      },
      {
        "name": "lyžičky sódy bikarbóny",
        "amount": "1/2"
      },
      {
        "name": "lyžičky škoric",
        "amount": "1/2"
      },
      {
        "name": "Datlí nasekaných nadrobno",
        "amount": "55 g"
      },
      {
        "name": "Popučených banánov",
        "amount": "500 g"
      }
    ],
    "steps": [
      "Predhrej rúru na 150 stupňov. Ľanové semienka zmiešaj s vodou a nechaj odstáť, kým sa nezlepia.",
      "Do misky pridaj múku, sódu bikarbónu, prášok do pečiva, škoricu a premiéru. Na záver pridaj datle, popučené banány, ľanové semienka a dôklade premiešaj celú zmes.",
      "Obdlžnikovú tortovú formu vylož papierom na pečenie a nalej do nej rovnomerne pripravené cesto. Peč v rúre 50 - 60 minút. Po vychladnutí",
      "Chlieb je skvelý s mandľovým maslom alebo s kokosovým jogurtom, čerstvými figami, pistáciami a kvapkou čistého javorového sirupu."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-citro-novo-kokosove-gulic-ky",
    "title": "Citrónovo kokosové guličky",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 15,
    "servings": 6,
    "calories": 160,
    "protein": 6,
    "carbs": 20,
    "fat": 7,
    "fiber": 3,
    "ingredients": [
      {
        "name": "/2 šálky celých mandlí",
        "amount": "20 g"
      },
      {
        "name": "Strúhaného kokosu",
        "amount": "2 šálky"
      },
      {
        "name": "Citrón (postrúhaná kôra a všetka šťava)",
        "amount": "1"
      },
      {
        "name": "P L Kokosového oleja",
        "amount": "2"
      },
      {
        "name": "medu",
        "amount": "2 Pl"
      },
      {
        "name": "Vanilkového extraktu",
        "amount": "1 ČL"
      },
      {
        "name": "P L Strúhaný kokos na obaleni",
        "amount": "2"
      }
    ],
    "steps": [
      "Rozmixovanú zmes rozdeľ na menšie časti (malo by vyjsť 15 guličiek) a vytvaruj z nich guličky.",
      "Hotové guličky obaľ v strúhanom kokose. Niektoré môžeš obaliť aj v štipke kurkumy. Guličky poukladaj na tanier a nechaj ich stuhnúť v chladničke."
    ],
    "allergens": [
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-c-okola-dove-snickers-datle",
    "title": "Čokoládové snickers datle",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 6,
    "calories": 220,
    "protein": 10,
    "carbs": 24,
    "fat": 9,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Medjool datlí",
        "amount": "10"
      },
      {
        "name": "Nasekaných kešu orechov",
        "amount": "½ šálky"
      },
      {
        "name": "Kúskov horkej čokolády",
        "amount": "4 šálky"
      },
      {
        "name": "Plarašidového masla",
        "amount": "2"
      },
      {
        "name": "Kokosového oleja",
        "amount": "1 ČL"
      }
    ],
    "steps": [
      "Datle odkôstkuj - narež ich na strane a vyber kôstku tak, aby ti v datli ostala dierka. Namiesto kôstky vlož do datlí asi V2 lyžičky arašidového masla. Pridajte nasekané kešu orechy.",
      "Kúsky čokolády s lyžičkou kokosového oleja roztop v mikrovlnke alebo v hrnci nad parou. Za pomoci špáratka namoč celú datľu v roztopenej čokoláde. Poukladaj hotové datle na tanier a nechaj stuhnúť v chladničke."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-datlovy-kola-c-z-pracli-kov",
    "title": "Datlový koláč z praclíkov",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske",
    "prepTime": 15,
    "servings": 6,
    "calories": 130,
    "protein": 4,
    "carbs": 16,
    "fat": 6,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Praclíkov (použila som špaldové",
        "amount": "70 g"
      },
      {
        "name": "P L Praclíky bez pridaného cukru)",
        "amount": "1"
      },
      {
        "name": "Ovsa",
        "amount": "80 g"
      },
      {
        "name": "Datle medjool, bez kôstok",
        "amount": "150 g"
      },
      {
        "name": "P L Nahrubo nasekaných",
        "amount": "2"
      },
      {
        "name": "Mandľového masla",
        "amount": "100 g"
      },
      {
        "name": "Čistého javorového sirupu",
        "amount": "40 ml"
      },
      {
        "name": "Mandľového mlieka",
        "amount": "30 ml"
      },
      {
        "name": "mavých čokoládových",
        "amount": "175"
      },
      {
        "name": "Lupienkov",
        "amount": "20 g"
      },
      {
        "name": "Lyžička kokosového oleja",
        "amount": "1"
      }
    ],
    "steps": [
      "Plech na pečenie vystli papierom na pečenie. V kuchynskom robote rozmixuj praclíky a ovsené vločky úplne na múku. Potom pridaj datle, mandľové maslo, mandľové mlieko a javorový sirup a mixuj, kým nevznikne cesto.",
      "Potom ho rovnomerne vylej na pleach a nechaj bokom.",
      "Do malého hrnca pridaj čokoládové lupienky a kokosový olej a za stáleho miešania ich roztop nad slabým plameňom. Čokoládu nalej na zmes v plechu a opäť ju rovnomerne rozotri. Na vrch daj niekoľko ďalších hnedých praclíkov na ozdobu a vložte do chladničky stuhnúť.",
      "Po stuhnutí čokolády vyber koláč z chladničky a pred krájaním ho nechaj niekoľko minút odstáť pri izbovej teplote. Uchovávaj vo vzduchotesnej nádobe v chladničke."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-doma-ca-c-okola-dova-zmrzlina",
    "title": "Domáca čokoládová zmrzlina",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 6,
    "calories": 175,
    "protein": 7,
    "carbs": 19,
    "fat": 7,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Mrazený banán",
        "amount": "1"
      },
      {
        "name": "Mandľového mlieka",
        "amount": "30 ml"
      },
      {
        "name": "Lyžička nesladeného kakaa",
        "amount": "1"
      },
      {
        "name": "Proteínového prášku",
        "amount": "15 g"
      },
      {
        "name": "Čokoládových lupienkov",
        "amount": "10g"
      }
    ],
    "steps": [
      "Zmrzlinu vyber aspoň 5 minút pred podávaním, aby sa dala pekne servírovať."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-jahodovy-chia-puding",
    "title": "Jahodový chia puding",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 6,
    "calories": 210,
    "protein": 9,
    "carbs": 23,
    "fat": 8,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Čerstvých jahôd",
        "amount": "80 g"
      },
      {
        "name": "1/2 banánu",
        "amount": "1 ks"
      },
      {
        "name": "Mandľového mlieka",
        "amount": "200 ml"
      },
      {
        "name": "čokoládového",
        "amount": "1 Odmerka"
      },
      {
        "name": "Proteínového prášku",
        "amount": "30 g"
      },
      {
        "name": "Chia semienok",
        "amount": "20 g"
      },
      {
        "name": "Lyžička javorového sirupu",
        "amount": "1"
      },
      {
        "name": "Mandľového mlieka",
        "amount": "200 ml"
      }
    ],
    "steps": [
      "Najskôr nasyp do nádoby chia semienka, potom prilej mandľové mlieko, javorový sirup a zľahka premiešaj.",
      "Prísady na jahodovú vrstvu vlož do mixéra a rozmixuj dohladka. Hotovú zmes nalej na vrstvu chia semienok a mandľového mlieka. Nechaj stuhnúť v chladničke aspoň pár hodín. Ak chceš dosiahnuť hustý puding, nechaj ho odležať cez noc."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-mrkvove-muffiny-so-semienkami",
    "title": "Mrkvové muffiny so semienkami",
    "category": "snack",
    "description": "Zdravý snack",
    "prepTime": 15,
    "servings": 6,
    "calories": 155,
    "protein": 6,
    "carbs": 17,
    "fat": 7,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Celozrnnej špaldovej múky",
        "amount": "200 g"
      },
      {
        "name": "Lyžička vanilkového extraktu",
        "amount": "1"
      },
      {
        "name": "Masla",
        "amount": "20 g"
      },
      {
        "name": "Veľké vajcia",
        "amount": "3"
      },
      {
        "name": "lyžice slnečnicových",
        "amount": "2/3"
      },
      {
        "name": "Mrkvy, stredne veľké",
        "amount": "2"
      },
      {
        "name": "Nastrúhané",
        "amount": "30 g"
      },
      {
        "name": "Lyžičky sezamových semienok",
        "amount": "2"
      },
      {
        "name": "Gréckeho jogurtu",
        "amount": "60 g"
      },
      {
        "name": "Mletého zázvoru",
        "amount": "1 cm"
      },
      {
        "name": "Lyžička prášku do pečiva",
        "amount": "1"
      },
      {
        "name": "Medu (alebo javorového sirupu)",
        "amount": "50 g"
      }
    ],
    "steps": [
      "Predhrej rúru na 180 °C a vylož formu na muffiny s 12 otvormi košíčkami na",
      "V stredne veľkej miske zmiešaj múku, prášok do pečiva a zázvor. Potom zohrej maslo a med v malom hrnci alebo v miske v mikrovlnnej rúre, kým sa nerozpustia.",
      "Vo ďalšej miske vyšľahaj vajcia, jogurt a vanilku dohladka. Pridaj roztopené maslo s medom a premiešaj. Tekutú zmes pridaj k takým prísadám a dobre premiešaj, aby sa spojili. Do zmesi pomaly vmiešaj strúhanú mrkvu a potom ju lyžicou vlož do pripravených formičiek na muffiny.",
      "Zmiešaj všetky semienka a posyp nimi muffiny. Peč v rúre 20 - 25 minút, alebo kým nie sú upečené. Môžeš to otestovať tak, že skontroluješ, či zapichnutá špajľa vyjde čistá. Pred vybratím a prenesením na mriežku nechaj muffiny niekoľko minút vychladnúť."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-ovsene-gulic-ky-s-aras-idovy-m-maslom",
    "title": "Ovsené guličky s arašidovým maslom",
    "category": "snack",
    "description": "Zdravý snack",
    "prepTime": 15,
    "servings": 6,
    "calories": 240,
    "protein": 11,
    "carbs": 26,
    "fat": 10,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Arašidového masla",
        "amount": "160 g"
      },
      {
        "name": "Ovsených vločiek",
        "amount": "120g"
      },
      {
        "name": "Kokosového oleja",
        "amount": "45 g"
      },
      {
        "name": "Mletého ľanového semienka",
        "amount": "15g"
      },
      {
        "name": "Datle medjool, bez kôstok",
        "amount": "135 g"
      },
      {
        "name": "Polievková lyžica chia semienok",
        "amount": "1"
      },
      {
        "name": "Javorového sirupu",
        "amount": "25 g"
      }
    ],
    "steps": [
      "Všetky prísady rozmixuj v kuchynskom robote, kým nevznikne cesto.",
      "Rozdeľ cesto a rovnomerne rozvaľkaj na 20 guľôčok. Skladuj v chldničke."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [],
    "tags": [
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-ovsene-sus-ienky-s-jablkovy-m-pyre",
    "title": "Ovsené sušienky s jablkovým pyré",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske",
    "prepTime": 15,
    "servings": 6,
    "calories": 185,
    "protein": 7,
    "carbs": 21,
    "fat": 8,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Jablkového pyré",
        "amount": "70 g"
      },
      {
        "name": "Špaldovej múky .",
        "amount": "40 g"
      },
      {
        "name": "vajíčko",
        "amount": ""
      },
      {
        "name": "Prášku do pečiva",
        "amount": "12 ČL"
      },
      {
        "name": "vanilkového extraktu",
        "amount": "1 Cl"
      },
      {
        "name": "H 4 čl škoric",
        "amount": "½ ČL"
      },
      {
        "name": "Medu",
        "amount": "100 g"
      },
      {
        "name": "Arašidového masla",
        "amount": "120 g"
      },
      {
        "name": "Ovsených vločiek",
        "amount": "10g"
      },
      {
        "name": "O g masla",
        "amount": "20 g"
      },
      {
        "name": "Arašidového masla)",
        "amount": "20 g"
      }
    ],
    "steps": [
      "Cesto si rozdeľ na 24 guličiek, vytvaruj z nich malé placky a pridaj 5 g arašidového masla do stredu. Okraje okolo arašidového masla uzatvor. Ak je tvoje arašidové maslo príliš tekuté, rozporcuj si ho na 5g a nechaj stuhnúť v chladničke.",
      "Pripravené sušienky poukladaj na plech vystlaný papierom na pečenie a peč približne 10 minút alebo dohneda."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-ovseny-chia-puding",
    "title": "Ovsený chia puding",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske",
    "prepTime": 15,
    "servings": 6,
    "calories": 140,
    "protein": 5,
    "carbs": 16,
    "fat": 6,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Šálka nesladeného mandľového",
        "amount": "1"
      },
      {
        "name": "Mlieka (alebo iného)",
        "amount": "200 ml"
      },
      {
        "name": "(30 g) proteínového",
        "amount": "1 Odmerka"
      },
      {
        "name": "Proteínový prášok",
        "amount": "30 g"
      },
      {
        "name": "Mrazených čučoriedok",
        "amount": "80 g"
      },
      {
        "name": "Alebo jahôd, prípadne orechy",
        "amount": "20 g"
      },
      {
        "name": "ovsených vločiek",
        "amount": "1/2 šálky"
      },
      {
        "name": "P L Chia semienok",
        "amount": "2"
      }
    ],
    "steps": [
      "Do proteínového šejkra alebo mixéra pridajte mlieko a potom proteínový prášok a pretrep, kým sa prášok nerozpustí.",
      "Do samostatnej nádoby pridajte ovsené vločky, chia semienka, ovocie alebo orechy a zalej ich proteínovým mliekom. Nechaj v chladničke cez noc."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-palacinky-s-lesny-mi-plodmi",
    "title": "Palacinky s lesnými plodmi",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske",
    "prepTime": 15,
    "servings": 6,
    "calories": 200,
    "protein": 8,
    "carbs": 22,
    "fat": 8,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Zrelý stredne veľký banán ° 1/2 čl škoric",
        "amount": "1 ks"
      },
      {
        "name": "nízkotučného alebo + štipka soli",
        "amount": "1/3 šálky"
      },
      {
        "name": "na postriekanie Mandľového mlieka",
        "amount": ""
      },
      {
        "name": "Vajc",
        "amount": "1"
      },
      {
        "name": "Drvené vlašské orechy na",
        "amount": "2"
      },
      {
        "name": "Múky ozdobu",
        "amount": "60g"
      },
      {
        "name": "Miešaných bobúľ, plus ďalšie + lyžica javorového sirupu",
        "amount": "25 g"
      },
      {
        "name": "P L Na posypanie alebo medu na ozdobu",
        "amount": "1"
      },
      {
        "name": "pl gréckeho jogurtu",
        "amount": "150 g"
      },
      {
        "name": "vanilky javorového sirupu + malá",
        "amount": "1 čl"
      },
      {
        "name": "prášku do pečiva štipka soli",
        "amount": "1/2 čl"
      }
    ],
    "steps": [
      "Vajcia, mlieko, banán a vanilku vložte do kuchynského robota a mixuj",
      "V druhej miske zmiešaj všetky takéto prísady. Potom do nich pomaly prilievaj zmes z mixéra a dôkladne premiešaj. Pridaj čučoriedky a premiešaj.",
      "Zohrej rúru na 160 stupňov. Panvicu postriekaj olejom a nechaj ju zohriať.",
      "Potom naber zmes na panvicu a nechajte ju piecť. Keď sa na palacinke objavia bublinky, obráťte ju a peč ďalších 60 sekúnd. Každú palacinku vlož do rúry, aby sa udržala teplá, kým budeš piecť zvyšok.",
      "Do malej misky pridaj niekoľko bobúľ. Vlož ich na 30 sekúnd do mikrovlnnej rúry, kým sa nezačnú zohrievať. Palacinky podávaj s bobuľovým ovocím, omáčkou, javorovým sirupom a jogurtom."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-protei-novo-datlove-gulic-ky",
    "title": "Proteínovo datlové guličky",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske",
    "prepTime": 15,
    "servings": 6,
    "calories": 165,
    "protein": 6,
    "carbs": 18,
    "fat": 7,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Datle medjool, bez kôstok",
        "amount": "1,5 šálky"
      },
      {
        "name": "Šálka ovsených vločiek",
        "amount": "1"
      },
      {
        "name": "Šálka mandľovej múčky",
        "amount": "1"
      },
      {
        "name": "Proteínového prášku",
        "amount": "100 g"
      },
      {
        "name": "Lyžice prírodného orechového masla",
        "amount": "3"
      },
      {
        "name": "Lyžičky medu",
        "amount": "2"
      },
      {
        "name": "Himalájskej ružovej soli",
        "amount": "1 ČL"
      },
      {
        "name": "P L Kokos, sezam, kakao a pod. na obaleni",
        "amount": "2"
      }
    ],
    "steps": [
      "Datle rozmixuj pri vysokej rýchlosti v kuchynskom robote, kým nevznikne hladká hmota.",
      "Pridaj pomleté ovsené vločky, mandľovú múčku, orechové maslo, med, proteínový prášok, soľ a mixuj, kým sa všetko nespojf.",
      "Zo zmesi vyvaľkaj 20 guľôčok a obaľ ich vkokose, sezame alebo kakau.",
      "Nechaj ich hodinu stuhnúť v chladničke a potom ich preložte do nádoby, ktorú môžeš skladovať v chladničke až týždeň alebo v mrazničke mesiac."
    ],
    "allergens": [
      "dairy",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-zdrave-ma-tove-gulic-ky",
    "title": "Zdravé mätové guličky",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 15,
    "servings": 6,
    "calories": 230,
    "protein": 10,
    "carbs": 25,
    "fat": 9,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Datle medjool, bez kôstok",
        "amount": "60g"
      },
      {
        "name": "Mandlí",
        "amount": "50 g"
      },
      {
        "name": "Kakaového prášku",
        "amount": "10 g"
      },
      {
        "name": "Kakaových bôbov",
        "amount": "12 g"
      },
      {
        "name": "P L Vody",
        "amount": "1"
      },
      {
        "name": "štipka štipka mätovej esenci",
        "amount": ""
      },
      {
        "name": "Strúhaného kokosu",
        "amount": "5 g"
      },
      {
        "name": "Lyžička kokosového oleja",
        "amount": "1"
      }
    ],
    "steps": [
      "Datle bez kôstok nahrubo nasekaj, potom všetky prísady vlož do kuchynského robota a rozmixuj dohladka.",
      "Jednotlivo rozvaľkaj na 6 guľôčok a obaľ v kakau alebo kokose."
    ],
    "allergens": [
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-snack-zdrave-mrkvove-lievance",
    "title": "Zdravé mrkvové lievance",
    "category": "snack",
    "description": "Zdravý snack - vegetariánske",
    "prepTime": 15,
    "servings": 6,
    "calories": 150,
    "protein": 5,
    "carbs": 17,
    "fat": 7,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Mlieka",
        "amount": "80 ml"
      },
      {
        "name": "P L Gréckeho jogurtu",
        "amount": "1"
      },
      {
        "name": "Veľké vajíčko * 1 čl medu (alebo",
        "amount": "1"
      },
      {
        "name": "> mrkvy (stredne veľkej), javorového sirupu)",
        "amount": "1 ks"
      },
      {
        "name": "Postrúhanej",
        "amount": "20 g"
      },
      {
        "name": "Gvanilkového proteínu opražených a nasekaných",
        "amount": "20"
      },
      {
        "name": "Celozrnnej špaldovej múky",
        "amount": "23 g"
      },
      {
        "name": "Cl mletej škoric",
        "amount": "½ ČL"
      },
      {
        "name": "V, cl prášku do pečiva",
        "amount": "1 ČL"
      }
    ],
    "steps": [
      "V miske si zmiešaj mlieko a vajíčko. Následne pridaj mkrvu, proteínový prášok, múku, škoricu, prášok do pečica a miešaj, kým ti vznikne celistvá",
      "Na strednom plameni zohrej nepriľnavú panvicu.",
      "Pripravenú zmes dávkuj pomocou naberačky alebo odmerky na panvicu a peč 1 - 2 minúty, alebo kým sa neobjavia bublinky. Obráť a peč na druhej strane ďalšiu minútu. Upečené lievance dáme na stranu.",
      "Lievance podávaj s jogurtom, medom a vlašskými orechami. Servíruj teplé."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten",
      "nuts"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-platok-z-batatov-a-slaniny",
    "title": "Plátok z batátov a slaniny",
    "category": "ranajky",
    "description": "Chutné raňajky",
    "prepTime": 15,
    "servings": 1,
    "calories": 220,
    "protein": 14,
    "carbs": 25,
    "fat": 7,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Medium sladké zemiaky, 1 cukina, 4 bacon rashers, 1 cibuľa, 4 vajcia, 1 cup sr múka, 1 cup light syr",
        "amount": "1"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-mini-zeleninove-frittaty",
    "title": "Mini zeleninové frittaty",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske, bezlepkové",
    "prepTime": 15,
    "servings": 1,
    "calories": 345,
    "protein": 22,
    "carbs": 39,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "name": "šálkas Sladké zemiaky, 4 vajcia + 2-3 vajce whites, 1/2 red paprika, špenát, basil, feta",
        "amount": "2"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "eggs"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-ranajky-cukinovy-platok-so-slaninou",
    "title": "Cukinový plátok so slaninou",
    "category": "ranajky",
    "description": "Chutné raňajky",
    "prepTime": 15,
    "servings": 1,
    "calories": 194,
    "protein": 12,
    "carbs": 22,
    "fat": 6,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Cukina, 1 mrkva, 2 bacon rashers, 5 vajcia, 1/4 cup mlieko, 1 cup sr múka, 1.25 cup light syr",
        "amount": "2"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-obed-strawberry-chia-protein-pudding",
    "title": "Jahodový proteínový puding s chia",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "chia semienka, 1 lyžička javorového sirupu, 1/4 šálky mandľového mlieka",
        "amount": "1/4 šálky"
      },
      {
        "name": "Top: 1/2 šálky jahody, 1/2 banánu, 1/2 šálky mandľového mlieka, 1 odmerka vegánskeho čokoládového proteínu",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-ranajky-healthy-carrot-cake-pancakes",
    "title": "Zdravé mrkvové palacinky",
    "category": "ranajky",
    "description": "Chutné raňajky - vegetariánske",
    "prepTime": 15,
    "servings": 1,
    "calories": 345,
    "protein": 22,
    "carbs": 39,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "name": "cup mlieko, 1 vajce, 1/2 mrkva, proteínový prášok, spelt múka, škorica, baking powder",
        "amount": "1 /3"
      },
      {
        "name": "P L Top: jogurt, med, walnuts",
        "amount": "1"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "easy"
  },
  {
    "id": "csv-obed-wraps-rye-mountain-bread-turkey",
    "title": "Obaly - Žitný horský chlieb (morčacie mäso)",
    "category": "obed",
    "description": "Výživný obed - vegetariánske",
    "prepTime": 30,
    "servings": 2,
    "calories": 417,
    "protein": 26,
    "carbs": 47,
    "fat": 14,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Rye mountain chlieb (turkey)",
        "amount": "2 plátky"
      },
      {
        "name": "Sliced turkey, 2 mountain chlieb wraps, 20g syr, 1/4 avokádo, paradajka, špenát, mayo",
        "amount": "100g"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-sweet-potato-fibre-salad",
    "title": "Sladký zemiakový šalát s vlákninou",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 482,
    "protein": 30,
    "carbs": 54,
    "fat": 16,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Sladké zemiaky, 1/2 cup wild/brown ryža, 1/2 cup brown šošovica, brokolica, špenát, rocket, cranberries, tekvica seeds",
        "amount": "150g"
      },
      {
        "name": "P L Dressing: olivový olej, dijon, tahini, med, citrón",
        "amount": "1"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-wraps-rye-mountain-bread-ham",
    "title": "Obaly - Žitný horský chlieb (šunka)",
    "category": "obed",
    "description": "Výživný obed - vegetariánske",
    "prepTime": 30,
    "servings": 2,
    "calories": 462,
    "protein": 29,
    "carbs": 52,
    "fat": 15,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Rye mountain chlieb (ham)",
        "amount": "2 plátky"
      },
      {
        "name": "Ham, 2 wraps, syr, avokádo, pineapple, paradajka, špenát, mayo",
        "amount": "100g"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [
      "vegetariánske"
    ],
    "tags": [
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-wraps-rye-mountain-bread-chicken",
    "title": "Obaly - Žitný horský chlieb (kuracie mäso)",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 402,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Rye mountain chlieb (kuracie mäso)",
        "amount": "200 g"
      },
      {
        "name": "Kuracie mäso, 2 wraps, syr, avokádo, beetroot, paradajka, špenát, mayo",
        "amount": "80g"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-vegan-rice-noodle-salad",
    "title": "Vegánsky šalát s ryžovými rezancami",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Ryža noodles, mrkva, uhorka, red cabbage, spring onions, zázvor",
        "amount": "150g"
      },
      {
        "name": "Dressing: sesame seeds, javorový sirup, sesame olej, ryža vinegar, tamari, chilli paste",
        "amount": "80 g"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-zdrave-bolonske-spagety",
    "title": "Zdravé boloňské špagety",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 510,
    "protein": 32,
    "carbs": 57,
    "fat": 17,
    "fiber": 5,
    "ingredients": [],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "eggs"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-hovadzie-bourguignon",
    "title": "Hovädzie bourguignon",
    "category": "obed",
    "description": "Výživný obed",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 38,
    "carbs": 47,
    "fat": 10,
    "fiber": 5,
    "ingredients": [
      {
        "name": "1kg Diced hovädzie mäso, red wine, kuracie mäso vývar, paradajka paste, sójová omáčka, múka, carrots, potatoes, šampiňóny, thyme",
        "amount": ""
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "dietary": [
      "bezlaktózové"
    ],
    "tags": [
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-vegan-rice-paper-rolls",
    "title": "Vegánske rolky z ryžového papiera",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Ryža papers, ryža noodles, lettuce, avokádo, mrkva, uhorka, mango, mint",
        "amount": "1 ks"
      },
      {
        "name": "Peanut sauce: arašidové maslo, javorový sirup, limetka, sójová omáčka",
        "amount": "20 g"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "nuts",
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-deconstructed-burger-bowl-v1",
    "title": "Dekonštruovaná miska na hamburgery (v1)",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 415,
    "protein": 26,
    "carbs": 47,
    "fat": 14,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Hovädzie mäso mince, 1 vajce, 300g potatoes, cos lettuce, paradajka, pineapple, beetroot, avokádo, pickles",
        "amount": "220g"
      },
      {
        "name": "P L Dressing: dijon, olivový olej, apple cider vinegar, med",
        "amount": "1"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "eggs"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-chicken-teriyaki-soba-noodle-salad",
    "title": "Kurací šalát soba s rezancami Teriyaki",
    "category": "obed",
    "description": "Výživný obed - vhodné pre vegánov",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Soba noodles, kale, šampiňóny, edamame, broccolini, paprika",
        "amount": "1 ks"
      },
      {
        "name": "Teriyaki: sójová omáčka, sesame olej, mirin, cesnak, med",
        "amount": "2 strúčiky"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-summer-salmon-salad",
    "title": "Letný lososový šalát",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-tamari-tempeh-tacos",
    "title": "Tamari Tempeh Tacos",
    "category": "obed",
    "description": "Výživný obed - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 503,
    "protein": 31,
    "carbs": 57,
    "fat": 17,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Taco shells, 100g tempeh, asian slaw (cabbage, mrkva, špenát), avokádo, paradajka",
        "amount": "1 ks"
      },
      {
        "name": "Tamari marinade + dressing (apple cider vinegar, sesame olej, limetka, mustard, sriracha)",
        "amount": "½ ks"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-zucchini-vegan-vegetable-fritters-and-salad",
    "title": "Cuketové zeleninové placky a šalát",
    "category": "obed",
    "description": "Výživný obed - vhodné pre vegánov",
    "prepTime": 30,
    "servings": 2,
    "calories": 445,
    "protein": 28,
    "carbs": 50,
    "fat": 15,
    "fiber": 5,
    "ingredients": [
      {
        "name": "šálka Grated cukina, múka, nutritional yeast, spring cibuľa, peas, kukurica",
        "amount": "1"
      },
      {
        "name": "Salad: špenát, paradajka, uhorka, mrkva, olives, avokádo",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-healthy-superfood-fibre-bowl",
    "title": "Zdravá miska so superpotravinami a vlákninou",
    "category": "vecera",
    "description": "Ľahká večera - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 395,
    "protein": 25,
    "carbs": 44,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Cukina, tekvica, cos lettuce, paprika, avokádo, spring cibuľa, coriander, mint, macadamias, cherry paradajky, feta",
        "amount": "1 ks"
      },
      {
        "name": "Dressing: zázvor, limetka, med, kokos mlieko",
        "amount": "1 cm"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-crunchy-vegan-tofu-salad",
    "title": "Chrumkavý vegánsky šalát z tofu",
    "category": "vecera",
    "description": "Ľahká večera - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 485,
    "protein": 30,
    "carbs": 55,
    "fat": 16,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Firm tofu, wild/brown ryža, bean shoots, rocket/špenát, uhorka, mandarin/mango, cibuľa, peanuts",
        "amount": "150g"
      },
      {
        "name": "Dressing: cesnak, zázvor, lemongrass, tamari, ryba sauce, citrón, javorový sirup",
        "amount": "2 strúčiky"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "fish",
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-sweet-potato-and-hummus-roll-ups-ve",
    "title": "Rolky zo sladkých zemiakov a humusu (VE)",
    "category": "vecera",
    "description": "Ľahká večera - vhodné pre vegánov",
    "prepTime": 30,
    "servings": 2,
    "calories": 416,
    "protein": 26,
    "carbs": 47,
    "fat": 14,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Wholegrain wrap, hummus, sladké zemiaky, mrkva, cabbage, špenát, paprika, sunflower seeds",
        "amount": "1 ks"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "gluten"
    ],
    "dietary": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-grilled-pork-with-mexican-style-corn-cobs",
    "title": "Grilované bravčové mäso s kukuričnými klasmi mexického štýlu",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Avokádo-sour smotana-chilli sauce, kukurica cobs, brokolica",
        "amount": "½ ks"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-marinated-asian-garlic-tofu-stir-fry",
    "title": "Marinované ázijsko-česnakové tofu Stir Fry",
    "category": "obed",
    "description": "Výživný obed - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 412,
    "protein": 26,
    "carbs": 46,
    "fat": 14,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Cesnak tofu stir fry",
        "amount": "2 strúčiky"
      },
      {
        "name": "Firm tofu, hoisin sauce, sójová omáčka, med, zázvor, chilli, cesnak, sesame olej",
        "amount": "2 strúčiky"
      },
      {
        "name": "Brokolica, fazule, carrots, cukina, brown ryža",
        "amount": "80 g"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-veggie-burgers-and-salad-with-tahini",
    "title": "Zeleninové hamburgery a šalát s tahini",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 536,
    "protein": 34,
    "carbs": 60,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Čierna fazuľa, hnedá ryža, vlašské orechy, rasca, paprika, BBQ omáčka, strúhanka",
        "amount": "1 ks"
      },
      {
        "name": "Tahini dressing: tahini, cesnak, jablčný ocot, mandľové mlieko",
        "amount": "2 strúčiky"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-pumpkin-feta-and-beetroot-salad-v",
    "title": "Šalát z tekvice, fety a červenej repy (V)",
    "category": "vecera",
    "description": "Ľahká večera - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Israeli couscous, beetroot, tekvica, cibuľa, mrkva, špenát, feta, walnuts, mint",
        "amount": "1 ks"
      },
      {
        "name": "P L Dressing: javorový sirup, balsamic, olivový olej, citrón",
        "amount": "1"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "csv-obed-choc-snickers-date",
    "title": "Choc-Snickers-Date",
    "category": "obed",
    "description": "Výživný obed - vegetariánske, bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 145,
    "protein": 9,
    "carbs": 16,
    "fat": 5,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Medjool dates, peanuts, dark chocolate, arašidové maslo, kokos olej",
        "amount": "20 g"
      }
    ],
    "steps": [
      "Postup prípravy nie je k dispozícii."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové",
      "vegetariánske"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske"
    ],
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
    "difficulty": "medium"
  },
  {
    "id": "neome-1",
    "title": "Greek Yogurt Parfait with Granola & Berries",
    "category": "ranajky",
    "description": "Zero cooking, 3 minutes. Protein-rich yogurt layered with crunchy granola and antioxidant-packed berries.",
    "prepTime": 3,
    "servings": 1,
    "calories": 380,
    "protein": 22,
    "carbs": 38,
    "fat": 13,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "200g",
        "name": "full-fat Greek yogurt"
      },
      {
        "amount": "40g",
        "name": "low-sugar granola"
      },
      {
        "amount": "80g",
        "name": "mixed berries"
      },
      {
        "amount": "1 tbsp",
        "name": "chia seeds"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "1 tbsp",
        "name": "flaked almonds"
      }
    ],
    "steps": [
      "Layer yogurt.",
      "Top with granola then berries.",
      "Sprinkle chia and almonds. Drizzle honey."
    ],
    "allergens": [],
    "dietary": [
      "no-cook",
      "batch-friendly",
      "high-protein"
    ],
    "tags": [
      "no-cook",
      "batch-friendly",
      "high-protein"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/70033242-bc81-47db-ac59-2ff3b91d5218.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-2",
    "title": "Spinach & Feta Egg Muffins",
    "category": "ranajky",
    "description": "Batch-bake Sunday, grab and reheat in 90 seconds all week. Protein-packed and freezer-friendly.",
    "prepTime": 30,
    "servings": 12,
    "calories": 80,
    "protein": 6,
    "carbs": 1,
    "fat": 5,
    "fiber": 0.5,
    "ingredients": [
      {
        "amount": "8 large",
        "name": "eggs"
      },
      {
        "amount": "80g",
        "name": "baby spinach"
      },
      {
        "amount": "60g",
        "name": "feta cheese"
      },
      {
        "amount": "1",
        "name": "red capsicum"
      },
      {
        "amount": "60ml",
        "name": "milk"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      },
      {
        "amount": "",
        "name": "olive oil spray"
      }
    ],
    "steps": [
      "Preheat oven 180C.",
      "Whisk eggs with milk and seasoning.",
      "Fill muffin tin with spinach, feta, capsicum.",
      "Pour egg mix and bake 18-20 min."
    ],
    "allergens": [],
    "dietary": [
      "batch-cook",
      "high-protein",
      "freezer-friendly"
    ],
    "tags": [
      "batch-cook",
      "high-protein",
      "freezer-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/4a13ad3b-bee1-4fda-bf47-661cbe18e481.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-3",
    "title": "Overnight Oats with Almond Butter & Banana",
    "category": "ranajky",
    "description": "Zero morning effort. Bircher-style, creamy and sustaining for hours. Assemble the night before.",
    "prepTime": 5,
    "servings": 1,
    "calories": 430,
    "protein": 20,
    "carbs": 52,
    "fat": 13,
    "fiber": 8,
    "ingredients": [
      {
        "amount": "60g",
        "name": "rolled oats"
      },
      {
        "amount": "180ml",
        "name": "milk"
      },
      {
        "amount": "80g",
        "name": "Greek yogurt"
      },
      {
        "amount": "1 tbsp",
        "name": "almond butter"
      },
      {
        "amount": "1 tbsp",
        "name": "chia seeds"
      },
      {
        "amount": "0.5",
        "name": "banana"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "0.25 tsp",
        "name": "cinnamon"
      }
    ],
    "steps": [
      "Mix oats, milk, yogurt, almond butter, chia, honey and cinnamon in a jar.",
      "Refrigerate overnight.",
      "Top with banana."
    ],
    "allergens": [],
    "dietary": [
      "no-cook",
      "batch-friendly",
      "high-fibre"
    ],
    "tags": [
      "no-cook",
      "batch-friendly",
      "high-fibre"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/bebab42c-cb6b-4461-bed9-c299563efe7a.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-4",
    "title": "Smashed Avocado & Poached Egg on Sourdough",
    "category": "ranajky",
    "description": "Cafe favourite in under 8 minutes. Perfect macro balance of healthy fats, protein and slow-release carbs.",
    "prepTime": 8,
    "servings": 1,
    "calories": 480,
    "protein": 22,
    "carbs": 42,
    "fat": 24,
    "fiber": 8,
    "ingredients": [
      {
        "amount": "2 thick",
        "name": "sourdough slices"
      },
      {
        "amount": "1 ripe",
        "name": "avocado"
      },
      {
        "amount": "2 large",
        "name": "eggs"
      },
      {
        "amount": "1 tsp",
        "name": "white vinegar"
      },
      {
        "amount": "0.5 tsp",
        "name": "lemon juice"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Toast sourdough.",
      "Mash avocado with lemon and salt.",
      "Poach eggs 3 min.",
      "Assemble with chilli flakes."
    ],
    "allergens": [],
    "dietary": [
      "quick",
      "high-protein",
      "vegetarian"
    ],
    "tags": [
      "quick",
      "high-protein",
      "vegetarian"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/5763a18f-e4dd-4dbe-b59e-d2e565c2c249.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-5",
    "title": "Cottage Cheese Oat Pancakes",
    "category": "ranajky",
    "description": "Fluffy, golden, high-protein. Tastes like a treat, eats like a power breakfast.",
    "prepTime": 11,
    "servings": 1,
    "calories": 420,
    "protein": 30,
    "carbs": 38,
    "fat": 14,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "120g",
        "name": "cottage cheese"
      },
      {
        "amount": "2",
        "name": "eggs"
      },
      {
        "amount": "40g",
        "name": "rolled oats"
      },
      {
        "amount": "0.5 tsp",
        "name": "vanilla"
      },
      {
        "amount": "0.25 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "1 tsp",
        "name": "baking powder"
      },
      {
        "amount": "",
        "name": "butter"
      },
      {
        "amount": "",
        "name": "berries"
      },
      {
        "amount": "",
        "name": "maple syrup"
      }
    ],
    "steps": [
      "Blend all ingredients until smooth.",
      "Cook small rounds in buttered pan 2-3 min per side.",
      "Stack and top with berries and maple syrup."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "family-friendly"
    ],
    "tags": [
      "high-protein",
      "family-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/24e17ac7-60e8-4d78-b0f2-4b88b648eba0.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-6",
    "title": "Savoury Oat Porridge with Poached Egg & Parmesan",
    "category": "ranajky",
    "description": "Italian-inspired savoury porridge cooked in stock with a jammy poached egg and shaved parmesan.",
    "prepTime": 11,
    "servings": 1,
    "calories": 380,
    "protein": 20,
    "carbs": 42,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "80g",
        "name": "rolled oats"
      },
      {
        "amount": "300ml",
        "name": "stock"
      },
      {
        "amount": "1",
        "name": "egg"
      },
      {
        "amount": "1 tsp",
        "name": "vinegar"
      },
      {
        "amount": "20g",
        "name": "parmesan"
      },
      {
        "amount": "1 tsp",
        "name": "butter"
      },
      {
        "amount": "",
        "name": "thyme"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "spinach"
      }
    ],
    "steps": [
      "Simmer oats in stock 4-5 min.",
      "Poach egg 3 min.",
      "Bowl porridge, top with egg, parmesan and chilli."
    ],
    "allergens": [],
    "dietary": [
      "savoury",
      "high-protein",
      "warming"
    ],
    "tags": [
      "savoury",
      "high-protein",
      "warming"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/5309562e-d53e-47a7-9ad1-baad3e34ecea.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-7",
    "title": "Lemon Ricotta Waffles with Fresh Berries",
    "category": "ranajky",
    "description": "Light golden waffles with cloud-like texture from ricotta. The lemon zest makes them sing.",
    "prepTime": 18,
    "servings": 4,
    "calories": 380,
    "protein": 16,
    "carbs": 50,
    "fat": 12,
    "fiber": 3,
    "ingredients": [
      {
        "amount": "200g",
        "name": "flour"
      },
      {
        "amount": "200g",
        "name": "ricotta"
      },
      {
        "amount": "2",
        "name": "eggs separated"
      },
      {
        "amount": "150ml",
        "name": "milk"
      },
      {
        "amount": "1",
        "name": "lemon zested"
      },
      {
        "amount": "1 tsp",
        "name": "baking powder"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "berries"
      },
      {
        "amount": "",
        "name": "maple syrup"
      }
    ],
    "steps": [
      "Whisk ricotta, yolks, milk, zest, vanilla, honey.",
      "Fold in flour.",
      "Fold in whipped whites.",
      "Cook in waffle iron 3-4 min.",
      "Top with berries and maple syrup."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "family-friendly"
    ],
    "tags": [
      "vegetarian",
      "family-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c98aee08-cefb-483e-8d5f-45d8cafae207.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-8",
    "title": "Homemade Seed & Oat Breakfast Bars",
    "category": "ranajky",
    "description": "Chewy, naturally sweetened and packed with seeds, oats and dried fruit. Batch-baked Sunday sorted for a fortnight.",
    "prepTime": 35,
    "servings": 12,
    "calories": 210,
    "protein": 7,
    "carbs": 26,
    "fat": 10,
    "fiber": 3,
    "ingredients": [
      {
        "amount": "250g",
        "name": "rolled oats"
      },
      {
        "amount": "80g",
        "name": "almond butter"
      },
      {
        "amount": "80g",
        "name": "honey"
      },
      {
        "amount": "40g",
        "name": "pumpkin seeds"
      },
      {
        "amount": "30g",
        "name": "sunflower seeds"
      },
      {
        "amount": "40g",
        "name": "dried cranberries"
      },
      {
        "amount": "30g",
        "name": "dark chocolate chips"
      },
      {
        "amount": "2",
        "name": "eggs"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Preheat oven 170C.",
      "Melt almond butter and honey.",
      "Mix with oats, seeds, fruit, chocolate, eggs.",
      "Press into tin and bake 22-25 min.",
      "Cool and slice."
    ],
    "allergens": [],
    "dietary": [
      "batch-cook",
      "freezer-friendly",
      "high-fibre"
    ],
    "tags": [
      "batch-cook",
      "freezer-friendly",
      "high-fibre"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/9dafc2c4-6fe3-4a6a-a095-d3bbac6a5d0b.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-9",
    "title": "Smoked Trout & Horseradish Cream on Rye",
    "category": "ranajky",
    "description": "Scandinavian open sandwich with hot-smoked trout, sharp horseradish cream and peppery watercress. No cooking, five minutes.",
    "prepTime": 5,
    "servings": 2,
    "calories": 400,
    "protein": 28,
    "carbs": 28,
    "fat": 18,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "4",
        "name": "rye bread slices"
      },
      {
        "amount": "150g",
        "name": "hot-smoked trout"
      },
      {
        "amount": "80g",
        "name": "creme fraiche"
      },
      {
        "amount": "1.5 tsp",
        "name": "horseradish"
      },
      {
        "amount": "1 tsp",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "watercress"
      },
      {
        "amount": "",
        "name": "capers"
      },
      {
        "amount": "",
        "name": "cucumber"
      },
      {
        "amount": "",
        "name": "dill"
      },
      {
        "amount": "",
        "name": "black pepper"
      }
    ],
    "steps": [
      "Mix creme fraiche with horseradish, lemon and pepper.",
      "Layer cucumber on bread, spread horseradish cream.",
      "Top with trout, watercress, capers and dill."
    ],
    "allergens": [],
    "dietary": [
      "no-cook",
      "high-protein",
      "omega-3"
    ],
    "tags": [
      "no-cook",
      "high-protein",
      "omega-3"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/72fb6b05-95e2-4913-88a5-a20165116256.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-10",
    "title": "Pearl Barley Porridge with Honey-Poached Plums",
    "category": "ranajky",
    "description": "Barley has lower GI than oats and twice the fibre. Nutty, chewy and deeply warming with honey-poached plums.",
    "prepTime": 30,
    "servings": 1,
    "calories": 430,
    "protein": 14,
    "carbs": 68,
    "fat": 12,
    "fiber": 8,
    "ingredients": [
      {
        "amount": "70g",
        "name": "pearl barley"
      },
      {
        "amount": "300ml",
        "name": "oat milk"
      },
      {
        "amount": "150ml",
        "name": "water"
      },
      {
        "amount": "2",
        "name": "plums"
      },
      {
        "amount": "1.5 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "cinnamon stick"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "walnuts"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Poach plums with honey and cinnamon 8 min.",
      "Simmer barley in milk and water 20-25 min.",
      "Bowl with plums, yogurt, walnuts."
    ],
    "allergens": [],
    "dietary": [
      "batch-friendly",
      "high-fibre",
      "warming"
    ],
    "tags": [
      "batch-friendly",
      "high-fibre",
      "warming"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/96f2ae35-7b54-43be-bf94-ac0f92129b4f.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-11",
    "title": "Golden Turmeric Scrambled Eggs on Wholegrain Toast",
    "category": "ranajky",
    "description": "Turmeric gives scrambled eggs a gorgeous golden colour. Anti-inflammatory, high-protein, on the table in 8 minutes.",
    "prepTime": 8,
    "servings": 1,
    "calories": 370,
    "protein": 24,
    "carbs": 28,
    "fat": 18,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "3",
        "name": "eggs"
      },
      {
        "amount": "0.5 tsp",
        "name": "turmeric"
      },
      {
        "amount": "0.25 tsp",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "black pepper"
      },
      {
        "amount": "",
        "name": "butter"
      },
      {
        "amount": "",
        "name": "spinach"
      },
      {
        "amount": "",
        "name": "cherry tomatoes"
      },
      {
        "amount": "",
        "name": "wholegrain toast"
      },
      {
        "amount": "",
        "name": "coriander"
      },
      {
        "amount": "",
        "name": "lemon"
      }
    ],
    "steps": [
      "Whisk eggs with turmeric, cumin and pepper.",
      "Cook tomatoes and spinach.",
      "Scramble eggs slowly, remove while underdone.",
      "Pile on toast with herbs."
    ],
    "allergens": [],
    "dietary": [
      "anti-inflammatory",
      "high-protein",
      "quick"
    ],
    "tags": [
      "anti-inflammatory",
      "high-protein",
      "quick"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/aba24b60-5382-4cc2-8462-82863e332841.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-12",
    "title": "Warm Puy Lentils with Poached Eggs & Spinach",
    "category": "ranajky",
    "description": "High-protein, high-fibre. A classic French bistro breakfast of warm lentils, wilted spinach and poached eggs.",
    "prepTime": 11,
    "servings": 1,
    "calories": 380,
    "protein": 28,
    "carbs": 30,
    "fat": 14,
    "fiber": 10,
    "ingredients": [
      {
        "amount": "100g",
        "name": "Puy lentils cooked"
      },
      {
        "amount": "2",
        "name": "eggs"
      },
      {
        "amount": "1 tsp",
        "name": "vinegar"
      },
      {
        "amount": "40g",
        "name": "spinach"
      },
      {
        "amount": "1",
        "name": "garlic clove"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      }
    ],
    "steps": [
      "Warm lentils with garlic, spinach, mustard and lemon.",
      "Poach eggs 3 min.",
      "Bowl lentils, top with eggs and parsley."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "high-fibre",
      "french-inspired"
    ],
    "tags": [
      "high-protein",
      "high-fibre",
      "french-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/46136b96-c987-48bc-8c78-dfb064a1e5df.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-13",
    "title": "Baked Zucchini & Carrot Rosti",
    "category": "ranajky",
    "description": "Swiss-inspired baked rosti loaded with vegetables. Lighter than fried. Batch-bake and reheat in the toaster in 3 minutes.",
    "prepTime": 38,
    "servings": 2,
    "calories": 300,
    "protein": 20,
    "carbs": 24,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "2",
        "name": "zucchini grated"
      },
      {
        "amount": "2",
        "name": "carrots grated"
      },
      {
        "amount": "2",
        "name": "eggs"
      },
      {
        "amount": "2",
        "name": "spring onions"
      },
      {
        "amount": "40g",
        "name": "oat flour"
      },
      {
        "amount": "30g",
        "name": "parmesan"
      },
      {
        "amount": "",
        "name": "garlic powder"
      },
      {
        "amount": "",
        "name": "salt"
      },
      {
        "amount": "",
        "name": "pepper"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      },
      {
        "amount": "",
        "name": "dill"
      }
    ],
    "steps": [
      "Preheat oven 200C.",
      "Squeeze all liquid from grated veg.",
      "Mix with eggs, flour, parmesan, garlic.",
      "Shape into rounds and bake 25-28 min, flipping halfway."
    ],
    "allergens": [],
    "dietary": [
      "batch-cook",
      "vegetarian",
      "high-protein"
    ],
    "tags": [
      "batch-cook",
      "vegetarian",
      "high-protein"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/f15b17a7-d112-4066-a590-a1154cf19c8b.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-14",
    "title": "Quinoa Porridge with Berries & Almond Milk",
    "category": "ranajky",
    "description": "Quinoa has more protein than oats. Cooked in almond milk with warm spices and topped with berries.",
    "prepTime": 18,
    "servings": 1,
    "calories": 420,
    "protein": 18,
    "carbs": 58,
    "fat": 12,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "80g",
        "name": "quinoa"
      },
      {
        "amount": "250ml",
        "name": "almond milk"
      },
      {
        "amount": "100ml",
        "name": "water"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "mixed berries"
      },
      {
        "amount": "",
        "name": "flaked almonds"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Rinse quinoa.",
      "Simmer in almond milk and water 12-15 min.",
      "Stir in cinnamon, vanilla, honey.",
      "Top with berries, almonds, yogurt."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "gluten-free",
      "batch-friendly"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "batch-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/bcbf20ad-8cf0-4395-82d6-a890854a512a.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-15",
    "title": "White Bean & Egg Breakfast Hash",
    "category": "ranajky",
    "description": "Hearty savoury one-pan breakfast. Cannellini beans with vegetables and eggs — one of the most nourishing breakfasts possible.",
    "prepTime": 17,
    "servings": 2,
    "calories": 360,
    "protein": 22,
    "carbs": 36,
    "fat": 12,
    "fiber": 12,
    "ingredients": [
      {
        "amount": "400g",
        "name": "cannellini beans"
      },
      {
        "amount": "3",
        "name": "eggs"
      },
      {
        "amount": "1",
        "name": "red capsicum"
      },
      {
        "amount": "80g",
        "name": "cherry tomatoes"
      },
      {
        "amount": "40g",
        "name": "spinach"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "salt"
      },
      {
        "amount": "",
        "name": "parsley"
      }
    ],
    "steps": [
      "Cook capsicum and garlic.",
      "Add tomatoes, paprika, beans, spinach.",
      "Make wells, crack in eggs.",
      "Cover and cook 4-5 min."
    ],
    "allergens": [],
    "dietary": [
      "one-pan",
      "high-protein",
      "high-fibre"
    ],
    "tags": [
      "one-pan",
      "high-protein",
      "high-fibre"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/1e2d277e-a7f2-44cf-ac41-1e37a4505aaf.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-16",
    "title": "Kefir Smoothie Bowl with Berries & Granola",
    "category": "ranajky",
    "description": "Kefir blended with frozen banana and berries into a thick spoonable bowl. One of the most nutritionally complete breakfasts in 3 minutes.",
    "prepTime": 3,
    "servings": 1,
    "calories": 350,
    "protein": 14,
    "carbs": 52,
    "fat": 8,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "200ml",
        "name": "kefir"
      },
      {
        "amount": "1",
        "name": "frozen banana"
      },
      {
        "amount": "80g",
        "name": "frozen berries"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "granola"
      },
      {
        "amount": "",
        "name": "fresh fruit"
      },
      {
        "amount": "",
        "name": "chia seeds"
      },
      {
        "amount": "",
        "name": "hemp seeds"
      }
    ],
    "steps": [
      "Blend kefir, banana, berries, honey and vanilla until thick.",
      "Pour into bowl and top with granola, fresh fruit and seeds."
    ],
    "allergens": [],
    "dietary": [
      "probiotic",
      "gut-health",
      "quick"
    ],
    "tags": [
      "probiotic",
      "gut-health",
      "quick"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/f0e40b61-b6ab-422f-9af0-fdf3bed6a178.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-17",
    "title": "Prosciutto Egg Cups with Spinach & Goat Cheese",
    "category": "ranajky",
    "description": "Prosciutto-lined muffin cups baked around a spinach and egg filling. Elegant, low-carb, the prosciutto crisps into a delicious cup.",
    "prepTime": 23,
    "servings": 6,
    "calories": 120,
    "protein": 11,
    "carbs": 1,
    "fat": 8,
    "fiber": 0.3,
    "ingredients": [
      {
        "amount": "6",
        "name": "prosciutto slices"
      },
      {
        "amount": "6",
        "name": "eggs"
      },
      {
        "amount": "40g",
        "name": "spinach"
      },
      {
        "amount": "40g",
        "name": "goat cheese"
      },
      {
        "amount": "6",
        "name": "cherry tomatoes"
      },
      {
        "amount": "",
        "name": "black pepper"
      },
      {
        "amount": "",
        "name": "olive oil spray"
      },
      {
        "amount": "",
        "name": "chives"
      }
    ],
    "steps": [
      "Line muffin tin with prosciutto.",
      "Fill with spinach, tomato, goat cheese.",
      "Crack in egg.",
      "Bake 190C 12-15 min.",
      "Rest 2 min before removing."
    ],
    "allergens": [],
    "dietary": [
      "low-carb",
      "high-protein",
      "batch-cook"
    ],
    "tags": [
      "low-carb",
      "high-protein",
      "batch-cook"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c8ce2f3e-10b2-4586-a4a1-fe10c1287418.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-18",
    "title": "Poached Eggs on White Bean Smash Toast",
    "category": "ranajky",
    "description": "White bean smash is creamier and higher in fibre than avocado. Topped with a runny poached egg.",
    "prepTime": 13,
    "servings": 1,
    "calories": 460,
    "protein": 28,
    "carbs": 50,
    "fat": 14,
    "fiber": 14,
    "ingredients": [
      {
        "amount": "200g",
        "name": "cannellini beans"
      },
      {
        "amount": "2",
        "name": "eggs"
      },
      {
        "amount": "1 tsp",
        "name": "vinegar"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "rosemary or thyme"
      },
      {
        "amount": "",
        "name": "sourdough"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      }
    ],
    "steps": [
      "Warm oil with garlic and herbs.",
      "Add beans and lemon, mash.",
      "Toast sourdough, poach eggs 3 min.",
      "Spread bean smash, top with eggs and chilli."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "high-fibre",
      "vegetarian"
    ],
    "tags": [
      "high-protein",
      "high-fibre",
      "vegetarian"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/f8baf936-1476-495a-97a6-c79d0615e212.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-19",
    "title": "Green Blended Spinach Omelette with Feta",
    "category": "ranajky",
    "description": "Spinach blended into the eggs turns the omelette vibrant green. No spinach flavour — just extra iron, folate and nutrients.",
    "prepTime": 8,
    "servings": 1,
    "calories": 330,
    "protein": 26,
    "carbs": 5,
    "fat": 23,
    "fiber": 2,
    "ingredients": [
      {
        "amount": "3",
        "name": "eggs"
      },
      {
        "amount": "40g",
        "name": "spinach"
      },
      {
        "amount": "1",
        "name": "garlic clove"
      },
      {
        "amount": "30g",
        "name": "feta"
      },
      {
        "amount": "4",
        "name": "cherry tomatoes"
      },
      {
        "amount": "",
        "name": "butter"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      },
      {
        "amount": "",
        "name": "chives or dill"
      }
    ],
    "steps": [
      "Blend eggs, spinach and garlic until bright green.",
      "Cook in buttered pan 2 min until edges set.",
      "Fill with feta and tomatoes, fold and serve."
    ],
    "allergens": [],
    "dietary": [
      "low-carb",
      "high-protein",
      "vegetarian"
    ],
    "tags": [
      "low-carb",
      "high-protein",
      "vegetarian"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/458bba01-1226-439b-8fe6-f450fd715560.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-20",
    "title": "Teff Porridge with Cardamom, Pistachios & Berries",
    "category": "ranajky",
    "description": "Teff is an ancient Ethiopian grain with more calcium than milk. A porridge that genuinely stands apart.",
    "prepTime": 13,
    "servings": 1,
    "calories": 400,
    "protein": 14,
    "carbs": 64,
    "fat": 10,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "60g",
        "name": "teff"
      },
      {
        "amount": "280ml",
        "name": "milk"
      },
      {
        "amount": "1 tbsp",
        "name": "honey"
      },
      {
        "amount": "0.5 tsp",
        "name": "cardamom"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "pistachios"
      },
      {
        "amount": "",
        "name": "berries"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Simmer teff in milk 8-10 min stirring until thick.",
      "Stir in honey, cardamom, cinnamon, vanilla.",
      "Top with pistachios, berries, yogurt."
    ],
    "allergens": [],
    "dietary": [
      "ancient-grain",
      "gluten-free",
      "high-iron"
    ],
    "tags": [
      "ancient-grain",
      "gluten-free",
      "high-iron"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/5c6c6eeb-9fa2-4d5b-a3e6-2687dff4c597.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-21",
    "title": "Cottage Cheese & Berry Power Jar",
    "category": "ranajky",
    "description": "All the satisfaction of a parfait with double the protein. Ready in 2 minutes.",
    "prepTime": 2,
    "servings": 1,
    "calories": 300,
    "protein": 26,
    "carbs": 24,
    "fat": 8,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "180g",
        "name": "cottage cheese"
      },
      {
        "amount": "80g",
        "name": "mixed berries"
      },
      {
        "amount": "",
        "name": "chia seeds"
      },
      {
        "amount": "",
        "name": "pumpkin seeds"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "granola optional"
      }
    ],
    "steps": [
      "Stir vanilla through cottage cheese.",
      "Layer cottage cheese and berries in a jar.",
      "Top with seeds, granola and honey."
    ],
    "allergens": [],
    "dietary": [
      "no-cook",
      "high-protein",
      "grab-and-go"
    ],
    "tags": [
      "no-cook",
      "high-protein",
      "grab-and-go"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/86cc5fc7-4cac-49b5-8a21-f3c7839c2665.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-22",
    "title": "Millet Porridge with Roasted Stone Fruit & Almonds",
    "category": "ranajky",
    "description": "Millet is a mild, gluten-free ancient grain. Roasted stone fruit makes this a completely different porridge experience.",
    "prepTime": 25,
    "servings": 4,
    "calories": 390,
    "protein": 13,
    "carbs": 62,
    "fat": 10,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "160g",
        "name": "millet"
      },
      {
        "amount": "600ml",
        "name": "oat milk"
      },
      {
        "amount": "200ml",
        "name": "water"
      },
      {
        "amount": "2",
        "name": "peaches"
      },
      {
        "amount": "1 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "cardamom"
      },
      {
        "amount": "",
        "name": "flaked almonds"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Roast peaches with honey at 200C 18-20 min.",
      "Simmer millet in milk and water 15-18 min.",
      "Top with roasted fruit, almonds, yogurt."
    ],
    "allergens": [],
    "dietary": [
      "gluten-free",
      "ancient-grain",
      "batch-friendly"
    ],
    "tags": [
      "gluten-free",
      "ancient-grain",
      "batch-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/f609468d-ccbd-4101-aaf3-5d7dc17deeeb.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-23",
    "title": "Smoked Salmon Soft Scrambled Eggs on Rye",
    "category": "ranajky",
    "description": "Slow-scrambled silky eggs with smoked salmon folded through at the last moment. High in omega-3. Makes mornings feel worth getting up for.",
    "prepTime": 8,
    "servings": 1,
    "calories": 430,
    "protein": 34,
    "carbs": 22,
    "fat": 22,
    "fiber": 3,
    "ingredients": [
      {
        "amount": "3",
        "name": "eggs"
      },
      {
        "amount": "60g",
        "name": "smoked salmon"
      },
      {
        "amount": "1 tsp",
        "name": "butter"
      },
      {
        "amount": "1 tbsp",
        "name": "creme fraiche"
      },
      {
        "amount": "",
        "name": "dill"
      },
      {
        "amount": "1 tsp",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "black pepper"
      },
      {
        "amount": "2",
        "name": "rye toast slices"
      },
      {
        "amount": "",
        "name": "capers optional"
      }
    ],
    "steps": [
      "Whisk eggs.",
      "Slow-scramble on lowest heat.",
      "Stir in creme fraiche off heat.",
      "Fold in salmon.",
      "Serve on rye with dill and capers."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "omega-3",
      "scandinavian"
    ],
    "tags": [
      "high-protein",
      "omega-3",
      "scandinavian"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/b1ce14c8-507a-48ed-82e4-304d29c762dd.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-24",
    "title": "Cottage Cheese & Smoked Salmon Rye Crispbreads",
    "category": "ranajky",
    "description": "A Scandinavian staple eaten daily across Denmark and Sweden. High-protein, zero cooking, assembled in two minutes.",
    "prepTime": 2,
    "servings": 1,
    "calories": 320,
    "protein": 30,
    "carbs": 22,
    "fat": 8,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "3",
        "name": "rye crispbreads"
      },
      {
        "amount": "100g",
        "name": "cottage cheese"
      },
      {
        "amount": "60g",
        "name": "smoked salmon"
      },
      {
        "amount": "0.25",
        "name": "cucumber"
      },
      {
        "amount": "",
        "name": "fresh dill"
      },
      {
        "amount": "1 tsp",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "black pepper"
      },
      {
        "amount": "4",
        "name": "radishes"
      }
    ],
    "steps": [
      "Spread cottage cheese over crispbreads.",
      "Layer cucumber and radish.",
      "Drape salmon over.",
      "Scatter dill, squeeze lemon, grind pepper."
    ],
    "allergens": [],
    "dietary": [
      "no-cook",
      "high-protein",
      "omega-3"
    ],
    "tags": [
      "no-cook",
      "high-protein",
      "omega-3"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/e52689a5-7701-4aff-a740-5cd35aa61167.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-25",
    "title": "Buckwheat Groats Breakfast Bowl with Strawberries",
    "category": "ranajky",
    "description": "Buckwheat groats cook quickly and eat like warm nutty cereal. Naturally gluten-free, high in magnesium and protein.",
    "prepTime": 15,
    "servings": 1,
    "calories": 410,
    "protein": 16,
    "carbs": 64,
    "fat": 10,
    "fiber": 7,
    "ingredients": [
      {
        "amount": "70g",
        "name": "raw buckwheat groats"
      },
      {
        "amount": "250ml",
        "name": "oat milk"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "80g",
        "name": "strawberries"
      },
      {
        "amount": "",
        "name": "pumpkin seeds"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      },
      {
        "amount": "",
        "name": "flaxseed"
      }
    ],
    "steps": [
      "Rinse buckwheat.",
      "Simmer in milk 10-12 min.",
      "Stir in cinnamon, honey, vanilla.",
      "Top with strawberries, seeds, yogurt."
    ],
    "allergens": [],
    "dietary": [
      "gluten-free",
      "ancient-grain",
      "batch-friendly"
    ],
    "tags": [
      "gluten-free",
      "ancient-grain",
      "batch-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/9345fb38-a181-4bf8-af54-9564351fca7f.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-26",
    "title": "Two-Ingredient Banana Protein Pancakes",
    "category": "ranajky",
    "description": "Just banana and egg as the base. Naturally gluten-free, high-protein and sweet without added sugar. Kids love these.",
    "prepTime": 9,
    "servings": 1,
    "calories": 320,
    "protein": 22,
    "carbs": 32,
    "fat": 10,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "1",
        "name": "very ripe banana"
      },
      {
        "amount": "2",
        "name": "eggs"
      },
      {
        "amount": "1 tbsp",
        "name": "vanilla protein powder optional"
      },
      {
        "amount": "0.5 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "0.5 tsp",
        "name": "baking powder"
      },
      {
        "amount": "",
        "name": "coconut oil"
      },
      {
        "amount": "",
        "name": "berries"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Mash banana.",
      "Whisk in eggs, protein powder, cinnamon, baking powder.",
      "Cook small rounds on medium-low 2 min, flip, 1-2 min more.",
      "Top with berries and yogurt."
    ],
    "allergens": [],
    "dietary": [
      "gluten-free",
      "high-protein",
      "family-friendly"
    ],
    "tags": [
      "gluten-free",
      "high-protein",
      "family-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/8016d26d-39fa-4f89-9b01-3ee6ee0448f1.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-27",
    "title": "Baked Lemon Cod on Puy Lentils with Salsa Verde",
    "category": "obed",
    "description": "Cod baked on a bed of Puy lentils with a vibrant Italian salsa verde. Lean protein, high fibre and huge flavour.",
    "prepTime": 40,
    "servings": 4,
    "calories": 420,
    "protein": 46,
    "carbs": 34,
    "fat": 10,
    "fiber": 14,
    "ingredients": [
      {
        "amount": "4",
        "name": "cod fillets"
      },
      {
        "amount": "300g",
        "name": "Puy lentils"
      },
      {
        "amount": "800ml",
        "name": "stock"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "onion"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "flat-leaf parsley"
      },
      {
        "amount": "",
        "name": "basil"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "capers"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      }
    ],
    "steps": [
      "Simmer lentils with stock, onion and garlic 20-25 min.",
      "Blend salsa verde ingredients.",
      "Roast cod on lentils at 200C 14-16 min.",
      "Spoon salsa verde over."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "high-fibre",
      "omega-3"
    ],
    "tags": [
      "high-protein",
      "high-fibre",
      "omega-3"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/8c8baba1-384c-4eb4-ac66-a75d4c0a4376.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-28",
    "title": "Turkey & Feta Stuffed Zucchini Boats",
    "category": "obed",
    "description": "Turkey mince hollowed into zucchini boats with Mediterranean herbs, baked until golden. Lean, high-protein, family-friendly.",
    "prepTime": 40,
    "servings": 4,
    "calories": 290,
    "protein": 32,
    "carbs": 14,
    "fat": 10,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "4 large",
        "name": "zucchini"
      },
      {
        "amount": "400g",
        "name": "turkey mince"
      },
      {
        "amount": "400g",
        "name": "crushed tomatoes"
      },
      {
        "amount": "",
        "name": "onion"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "dried oregano"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "40g",
        "name": "feta"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      }
    ],
    "steps": [
      "Preheat oven 190C. Scoop zucchini, chop flesh.",
      "Cook onion, garlic, turkey, tomatoes and spices.",
      "Fill boats with turkey mix, top with feta.",
      "Bake 22-25 min."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "gluten-free",
      "mediterranean"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "mediterranean"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/ebd0a5a7-ea95-438d-8feb-f5960087f45a.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-29",
    "title": "French Poached Chicken with Vegetables & Herb Broth",
    "category": "obed",
    "description": "Classic French technique — gently poaching chicken keeps it moist and lean while the broth becomes deeply nourishing.",
    "prepTime": 40,
    "servings": 4,
    "calories": 310,
    "protein": 38,
    "carbs": 16,
    "fat": 8,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "4",
        "name": "bone-in chicken thighs skinless"
      },
      {
        "amount": "1.2l",
        "name": "stock"
      },
      {
        "amount": "3",
        "name": "carrots"
      },
      {
        "amount": "3",
        "name": "celery stalks"
      },
      {
        "amount": "2",
        "name": "leeks"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "thyme"
      },
      {
        "amount": "",
        "name": "bay leaves"
      },
      {
        "amount": "",
        "name": "green beans"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      }
    ],
    "steps": [
      "Poach chicken in stock with aromatics — never boil.",
      "Add carrots, celery and leeks after 5 min.",
      "Add green beans last 4 min.",
      "Serve in deep bowls with broth."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "gluten-free",
      "french-inspired"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "french-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/0c35ef00-e0a8-4373-af58-68941d2ed7fb.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-30",
    "title": "Sardine, Tomato & Olive Wholegrain Pasta",
    "category": "obed",
    "description": "Sardines are one of the most nutrient-dense sustainable fish. Tossed with wholegrain pasta, tomato and olives in 15 minutes.",
    "prepTime": 20,
    "servings": 2,
    "calories": 540,
    "protein": 36,
    "carbs": 68,
    "fat": 12,
    "fiber": 9,
    "ingredients": [
      {
        "amount": "200g",
        "name": "wholegrain spaghetti"
      },
      {
        "amount": "2",
        "name": "cans sardines in olive oil"
      },
      {
        "amount": "400g",
        "name": "cherry tomatoes"
      },
      {
        "amount": "3",
        "name": "garlic cloves"
      },
      {
        "amount": "40g",
        "name": "kalamata olives"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "capers"
      }
    ],
    "steps": [
      "Cook spaghetti, reserve pasta water.",
      "Fry garlic and chilli, add tomatoes and capers 5 min.",
      "Add sardines and olives, fold in pasta."
    ],
    "allergens": [],
    "dietary": [
      "omega-3",
      "high-protein",
      "pantry-staple"
    ],
    "tags": [
      "omega-3",
      "high-protein",
      "pantry-staple"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/1777ea39-e632-4287-8ac9-b66a27b92eef.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-31",
    "title": "Steamed Salmon with Green Beans, Potatoes & Dijon",
    "category": "obed",
    "description": "Steaming preserves every nutrient. A sharp Dijon and lemon dressing ties it together. Elegant and ready in under 20 minutes.",
    "prepTime": 18,
    "servings": 2,
    "calories": 460,
    "protein": 40,
    "carbs": 30,
    "fat": 18,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "2",
        "name": "salmon fillets"
      },
      {
        "amount": "200g",
        "name": "green beans"
      },
      {
        "amount": "300g",
        "name": "baby potatoes"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "dill"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "lemon juice"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      }
    ],
    "steps": [
      "Steam potatoes 12 min, add green beans last 4 min.",
      "Steam salmon with lemon and dill 8-9 min.",
      "Whisk Dijon dressing.",
      "Plate and spoon dressing over."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "omega-3",
      "gluten-free"
    ],
    "tags": [
      "high-protein",
      "omega-3",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/0831e22a-8b75-407e-adc4-933d1f06d591.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-32",
    "title": "Roasted Cauliflower & Chickpea Traybake with Tahini",
    "category": "obed",
    "description": "Cauliflower and chickpeas roasted until caramelised and crispy, finished with a tahini-lemon drizzle. Entirely plant-based.",
    "prepTime": 43,
    "servings": 4,
    "calories": 340,
    "protein": 14,
    "carbs": 40,
    "fat": 13,
    "fiber": 12,
    "ingredients": [
      {
        "amount": "1",
        "name": "cauliflower"
      },
      {
        "amount": "400g",
        "name": "chickpeas"
      },
      {
        "amount": "1",
        "name": "red onion"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "",
        "name": "turmeric"
      },
      {
        "amount": "",
        "name": "tahini"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "water"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "coriander"
      },
      {
        "amount": "",
        "name": "pomegranate seeds"
      }
    ],
    "steps": [
      "Toss cauliflower, chickpeas and onion with oil and spices.",
      "Roast at 210C 30-35 min.",
      "Whisk tahini dressing.",
      "Arrange on platter, drizzle dressing, scatter herbs."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "high-fibre",
      "gluten-free"
    ],
    "tags": [
      "vegan",
      "high-fibre",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/268c42bd-a987-4964-b603-ab268c6efd03.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-33",
    "title": "Lentil & Roasted Vegetable Bowl with Lemon Tahini",
    "category": "obed",
    "description": "A complete meal in a bowl — Puy lentils, roasted seasonal vegetables and a lemon-tahini dressing. The highest-fibre dinner in this collection.",
    "prepTime": 45,
    "servings": 4,
    "calories": 420,
    "protein": 18,
    "carbs": 56,
    "fat": 14,
    "fiber": 16,
    "ingredients": [
      {
        "amount": "250g",
        "name": "Puy lentils"
      },
      {
        "amount": "700g",
        "name": "mixed veg sweet potato beetroot carrot"
      },
      {
        "amount": "1",
        "name": "red onion"
      },
      {
        "amount": "80g",
        "name": "spinach"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "tahini"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "water"
      },
      {
        "amount": "",
        "name": "pumpkin seeds"
      },
      {
        "amount": "",
        "name": "parsley"
      }
    ],
    "steps": [
      "Roast veg with oil and cumin at 200C 30-35 min.",
      "Cook lentils 20-25 min.",
      "Whisk tahini dressing.",
      "Build bowls with lentils, spinach, veg, dressing."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "high-fibre",
      "batch-cook"
    ],
    "tags": [
      "vegan",
      "high-fibre",
      "batch-cook"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/975a4547-ba26-428a-98ce-f7ed6c3e5c8f.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-34",
    "title": "Loaded Sweet Potato with White Beans & Spinach",
    "category": "obed",
    "description": "A baked sweet potato becomes a complete meal loaded with warm white beans, wilted spinach and Greek yogurt. Exceptional fibre.",
    "prepTime": 55,
    "servings": 4,
    "calories": 380,
    "protein": 16,
    "carbs": 64,
    "fat": 5,
    "fiber": 14,
    "ingredients": [
      {
        "amount": "4 medium",
        "name": "sweet potatoes"
      },
      {
        "amount": "400g",
        "name": "cannellini beans"
      },
      {
        "amount": "100g",
        "name": "spinach"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Bake sweet potatoes at 200C 45-50 min.",
      "Warm beans with garlic, paprika, lemon, spinach.",
      "Split potatoes, pile bean mix inside, top with yogurt and chilli."
    ],
    "allergens": [],
    "dietary": [
      "high-fibre",
      "batch-cook",
      "gluten-free"
    ],
    "tags": [
      "high-fibre",
      "batch-cook",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/f4451b71-f594-454e-9888-a1db9fe4b4fb.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-35",
    "title": "Tuscan Ribollita — Kale, Bean & Bread Soup",
    "category": "obed",
    "description": "Tuscany's ancient peasant bread soup. Thick, deeply nourishing, built on vegetables, beans and wholegrain bread. The most fibre-rich meal in European cuisine.",
    "prepTime": 45,
    "servings": 4,
    "calories": 360,
    "protein": 16,
    "carbs": 52,
    "fat": 8,
    "fiber": 15,
    "ingredients": [
      {
        "amount": "400g",
        "name": "cannellini beans"
      },
      {
        "amount": "200g",
        "name": "cavolo nero or kale"
      },
      {
        "amount": "400g",
        "name": "crushed tomatoes"
      },
      {
        "amount": "1l",
        "name": "stock"
      },
      {
        "amount": "2",
        "name": "carrots"
      },
      {
        "amount": "2",
        "name": "celery"
      },
      {
        "amount": "1",
        "name": "onion"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "2",
        "name": "sourdough slices"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "rosemary"
      },
      {
        "amount": "",
        "name": "parmesan rind optional"
      }
    ],
    "steps": [
      "Cook onion, carrots, celery.",
      "Add tomatoes, stock, beans and parmesan rind. Simmer 20 min.",
      "Add kale 8 min.",
      "Stir in torn bread to thicken."
    ],
    "allergens": [],
    "dietary": [
      "vegan-optional",
      "high-fibre",
      "batch-cook"
    ],
    "tags": [
      "vegan-optional",
      "high-fibre",
      "batch-cook"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/99ae4b39-7e86-4d62-a42f-a90958129249.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-36",
    "title": "Farro Salad with Roasted Vegetables & Feta",
    "category": "obed",
    "description": "Colourful protein-rich grain bowl built on nutty farro, roasted vegetables and a light lemon dressing.",
    "prepTime": 40,
    "servings": 4,
    "calories": 450,
    "protein": 14,
    "carbs": 64,
    "fat": 16,
    "fiber": 10,
    "ingredients": [
      {
        "amount": "240g",
        "name": "farro"
      },
      {
        "amount": "700g",
        "name": "mixed veg zucchini capsicum eggplant"
      },
      {
        "amount": "60g",
        "name": "feta"
      },
      {
        "amount": "60g",
        "name": "kalamata olives"
      },
      {
        "amount": "80g",
        "name": "rocket"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "2",
        "name": "lemons"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "oregano"
      },
      {
        "amount": "",
        "name": "pine nuts"
      },
      {
        "amount": "",
        "name": "basil"
      }
    ],
    "steps": [
      "Cook farro 25-30 min.",
      "Roast veg at 200C 25 min.",
      "Whisk dressing.",
      "Toss farro with dressing and rocket, top with veg, feta, olives."
    ],
    "allergens": [],
    "dietary": [
      "ancient-grain",
      "high-fibre",
      "vegetarian"
    ],
    "tags": [
      "ancient-grain",
      "high-fibre",
      "vegetarian"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/10e1d218-c364-4bcf-abf3-aa1952fb3dfd.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-37",
    "title": "Chicken & Barley Soup",
    "category": "obed",
    "description": "Scotland's most beloved soup. Barley, chicken, leek and carrot in a light but deeply nourishing broth. Beta-glucan from barley lowers cholesterol.",
    "prepTime": 50,
    "servings": 6,
    "calories": 320,
    "protein": 30,
    "carbs": 32,
    "fat": 6,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "600g",
        "name": "chicken thighs boneless"
      },
      {
        "amount": "120g",
        "name": "pearl barley"
      },
      {
        "amount": "1.5l",
        "name": "chicken stock"
      },
      {
        "amount": "3",
        "name": "carrots"
      },
      {
        "amount": "3",
        "name": "leeks"
      },
      {
        "amount": "3",
        "name": "celery"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "thyme"
      },
      {
        "amount": "",
        "name": "bay leaves"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      }
    ],
    "steps": [
      "Sweat leeks, carrots, celery with garlic and herbs.",
      "Add chicken, barley and stock. Simmer 30 min.",
      "Shred chicken and return.",
      "Ladle into bowls with parsley."
    ],
    "allergens": [],
    "dietary": [
      "batch-cook",
      "freezer-friendly",
      "high-protein"
    ],
    "tags": [
      "batch-cook",
      "freezer-friendly",
      "high-protein"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/d0e81493-a055-4c72-b7b5-3cf605a765fc.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-38",
    "title": "Spanish Lentil Soup with a Touch of Chorizo",
    "category": "obed",
    "description": "Spain's most famous hearty soup — lentils and vegetables with a small amount of chorizo for enormous smoky flavour.",
    "prepTime": 38,
    "servings": 6,
    "calories": 300,
    "protein": 18,
    "carbs": 40,
    "fat": 6,
    "fiber": 13,
    "ingredients": [
      {
        "amount": "300g",
        "name": "red or green lentils"
      },
      {
        "amount": "60g",
        "name": "cooking chorizo"
      },
      {
        "amount": "1.2l",
        "name": "stock"
      },
      {
        "amount": "400g",
        "name": "crushed tomatoes"
      },
      {
        "amount": "3",
        "name": "carrots"
      },
      {
        "amount": "1",
        "name": "onion"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "100g",
        "name": "spinach"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "olive oil"
      }
    ],
    "steps": [
      "Render chorizo, add onion and carrots.",
      "Add garlic, spices, lentils, tomatoes, stock. Simmer 25 min.",
      "Blend one third for creaminess.",
      "Stir in spinach and lemon."
    ],
    "allergens": [],
    "dietary": [
      "batch-cook",
      "high-fibre",
      "spanish-inspired"
    ],
    "tags": [
      "batch-cook",
      "high-fibre",
      "spanish-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/3e426bd8-b60c-493f-b2be-2684ba88c7aa.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-39",
    "title": "Moroccan-Spiced Chickpea & Sweet Potato Stew",
    "category": "obed",
    "description": "Moroccan-spiced stew fragrant with cumin, coriander and preserved lemon. Plant-based, extraordinarily high in fibre. Ready in 30 minutes.",
    "prepTime": 30,
    "servings": 4,
    "calories": 380,
    "protein": 18,
    "carbs": 58,
    "fat": 6,
    "fiber": 18,
    "ingredients": [
      {
        "amount": "800g",
        "name": "chickpeas"
      },
      {
        "amount": "400g",
        "name": "crushed tomatoes"
      },
      {
        "amount": "500ml",
        "name": "stock"
      },
      {
        "amount": "1 large",
        "name": "sweet potato"
      },
      {
        "amount": "150g",
        "name": "kale or spinach"
      },
      {
        "amount": "",
        "name": "onion"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "coriander"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "turmeric"
      },
      {
        "amount": "",
        "name": "preserved lemon"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "coriander to serve"
      }
    ],
    "steps": [
      "Cook onion with spices.",
      "Add chickpeas, tomatoes, stock, sweet potato and preserved lemon. Simmer 20 min.",
      "Stir in kale 3 min."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "high-fibre",
      "batch-cook"
    ],
    "tags": [
      "vegan",
      "high-fibre",
      "batch-cook"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/f8a67555-22a9-4d7e-b897-91db0e90cf9d.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-40",
    "title": "Provencal Fish Stew with Fennel & Saffron",
    "category": "obed",
    "description": "A light yet deeply flavoured Provencal fish stew built on tomatoes, fennel and saffron. Far simpler than bouillabaisse but with all the soul.",
    "prepTime": 30,
    "servings": 4,
    "calories": 320,
    "protein": 38,
    "carbs": 16,
    "fat": 8,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "600g",
        "name": "mixed white fish"
      },
      {
        "amount": "400g",
        "name": "crushed tomatoes"
      },
      {
        "amount": "500ml",
        "name": "stock"
      },
      {
        "amount": "1",
        "name": "fennel bulb"
      },
      {
        "amount": "1",
        "name": "onion"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "pinch saffron"
      },
      {
        "amount": "",
        "name": "orange zest"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "white wine"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "cherry tomatoes"
      }
    ],
    "steps": [
      "Soften onion and fennel.",
      "Add wine, tomatoes, stock, saffron and orange zest. Simmer 15 min.",
      "Nestle fish in and cook 5-7 min."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "omega-3",
      "french-inspired"
    ],
    "tags": [
      "high-protein",
      "omega-3",
      "french-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/3198ae4c-76a4-4389-a044-bedd0e460ee0.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-41",
    "title": "Roasted Tomato & White Bean Soup with Pesto",
    "category": "obed",
    "description": "Roasting concentrates tomato sweetness. Blended with white beans for creaminess and protein, finished with basil pesto.",
    "prepTime": 55,
    "servings": 6,
    "calories": 220,
    "protein": 10,
    "carbs": 30,
    "fat": 7,
    "fiber": 9,
    "ingredients": [
      {
        "amount": "1kg",
        "name": "tomatoes"
      },
      {
        "amount": "400g",
        "name": "cannellini beans"
      },
      {
        "amount": "600ml",
        "name": "stock"
      },
      {
        "amount": "1",
        "name": "garlic bulb"
      },
      {
        "amount": "1",
        "name": "onion"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "dried oregano"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "basil pesto to serve"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      }
    ],
    "steps": [
      "Roast tomatoes, onion and garlic at 200C 35-40 min.",
      "Squeeze garlic, add to pot with beans and stock. Simmer 10 min.",
      "Blend smooth.",
      "Swirl pesto over each bowl."
    ],
    "allergens": [],
    "dietary": [
      "vegan-optional",
      "high-fibre",
      "batch-cook"
    ],
    "tags": [
      "vegan-optional",
      "high-fibre",
      "batch-cook"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/8ca7c5cb-90ea-48d9-a885-33e7f23c2d94.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-42",
    "title": "Chicken & Herb Bulgur Wheat Pilaf",
    "category": "obed",
    "description": "Bulgur wheat is pre-cooked, high in fibre and ready in 15 minutes. Combined with shredded chicken, herbs and pine nuts — a complete dinner effortlessly.",
    "prepTime": 20,
    "servings": 4,
    "calories": 460,
    "protein": 38,
    "carbs": 52,
    "fat": 10,
    "fiber": 9,
    "ingredients": [
      {
        "amount": "280g",
        "name": "bulgur wheat"
      },
      {
        "amount": "500ml",
        "name": "hot chicken stock"
      },
      {
        "amount": "500g",
        "name": "chicken breast cooked and shredded"
      },
      {
        "amount": "1",
        "name": "red onion"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "pine nuts"
      },
      {
        "amount": "",
        "name": "dried apricots"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "parsley and mint"
      },
      {
        "amount": "",
        "name": "spinach"
      }
    ],
    "steps": [
      "Pour hot stock over bulgur, cover 15 min.",
      "Cook onion with cinnamon and cumin.",
      "Fluff bulgur, toss with chicken, apricots, herbs, spinach and lemon.",
      "Scatter pine nuts."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "high-fibre",
      "batch-cook"
    ],
    "tags": [
      "high-protein",
      "high-fibre",
      "batch-cook"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/3c839e47-bb0b-426b-8d92-f2af5b07d2fe.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-43",
    "title": "Puy Lentil & Roasted Beetroot Salad with Goat Cheese",
    "category": "obed",
    "description": "A stunning French-inspired salad of earthy Puy lentils, sweet roasted beetroot and creamy goat cheese. Rich in iron and folate.",
    "prepTime": 30,
    "servings": 4,
    "calories": 420,
    "protein": 22,
    "carbs": 44,
    "fat": 16,
    "fiber": 14,
    "ingredients": [
      {
        "amount": "300g",
        "name": "Puy lentils"
      },
      {
        "amount": "500g",
        "name": "beetroot cooked"
      },
      {
        "amount": "100g",
        "name": "soft goat cheese"
      },
      {
        "amount": "80g",
        "name": "rocket"
      },
      {
        "amount": "30g",
        "name": "walnuts toasted"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "red wine vinegar"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "thyme"
      },
      {
        "amount": "",
        "name": "salt and pepper"
      }
    ],
    "steps": [
      "Cook lentils 20-25 min, season while warm.",
      "Whisk dressing.",
      "Toss lentils with dressing.",
      "Layer rocket, beetroot, lentils, goat cheese and walnuts."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "high-protein",
      "iron-rich"
    ],
    "tags": [
      "vegetarian",
      "high-protein",
      "iron-rich"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/ef69096b-6c10-4502-ba5c-9b8d0b0b9454.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-44",
    "title": "Freekeh Bowl with Roasted Vegetables & Chickpeas",
    "category": "obed",
    "description": "Freekeh is a roasted green wheat with three times the fibre of regular wheat. Its smoky nutty flavour pairs beautifully with roasted vegetables.",
    "prepTime": 38,
    "servings": 4,
    "calories": 440,
    "protein": 16,
    "carbs": 70,
    "fat": 12,
    "fiber": 14,
    "ingredients": [
      {
        "amount": "240g",
        "name": "freekeh"
      },
      {
        "amount": "600ml",
        "name": "stock"
      },
      {
        "amount": "600g",
        "name": "mixed veg eggplant capsicum zucchini"
      },
      {
        "amount": "1",
        "name": "red onion"
      },
      {
        "amount": "400g",
        "name": "chickpeas"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "parsley and mint"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "toasted almonds"
      }
    ],
    "steps": [
      "Cook freekeh in stock 20-25 min.",
      "Roast veg and chickpeas with spices at 200C 25 min.",
      "Toss freekeh with lemon and herbs.",
      "Build bowls with almonds on top."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "ancient-grain",
      "high-fibre"
    ],
    "tags": [
      "vegan",
      "ancient-grain",
      "high-fibre"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/59774de1-4c51-4dd0-b6e8-5e9ca80dc5a5.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-45",
    "title": "Spelt Pasta with Roasted Vegetables & Lemon Ricotta",
    "category": "obed",
    "description": "Spelt pasta has more fibre and protein than regular pasta. Tossed with roasted vegetables and light ricotta.",
    "prepTime": 30,
    "servings": 4,
    "calories": 480,
    "protein": 20,
    "carbs": 68,
    "fat": 14,
    "fiber": 10,
    "ingredients": [
      {
        "amount": "320g",
        "name": "spelt pasta"
      },
      {
        "amount": "600g",
        "name": "mixed veg cherry tomatoes zucchini capsicum"
      },
      {
        "amount": "200g",
        "name": "ricotta"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "fresh basil"
      },
      {
        "amount": "",
        "name": "parmesan"
      },
      {
        "amount": "",
        "name": "pine nuts toasted"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Roast veg at 210C 25 min.",
      "Cook pasta, reserve pasta water.",
      "Mix ricotta with lemon and garlic.",
      "Toss pasta into ricotta with pasta water and veg."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "high-fibre",
      "italian-inspired"
    ],
    "tags": [
      "vegetarian",
      "high-fibre",
      "italian-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/19fa1539-bb81-4576-a02d-ed3684f8fbff.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-46",
    "title": "Warm Quinoa Bowl with Seared Salmon & Massaged Kale",
    "category": "obed",
    "description": "A nourishing grain bowl covering every macro base. Fluffy quinoa, omega-3 salmon, dark leafy greens and a sharp lemon dressing.",
    "prepTime": 30,
    "servings": 4,
    "calories": 520,
    "protein": 42,
    "carbs": 42,
    "fat": 20,
    "fiber": 8,
    "ingredients": [
      {
        "amount": "240g",
        "name": "quinoa"
      },
      {
        "amount": "500ml",
        "name": "stock"
      },
      {
        "amount": "4",
        "name": "salmon fillets"
      },
      {
        "amount": "120g",
        "name": "kale"
      },
      {
        "amount": "1",
        "name": "avocado"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "pumpkin seeds"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Cook quinoa in stock.",
      "Massage kale with lemon and oil.",
      "Sear salmon 3-4 min per side.",
      "Build bowls with quinoa, kale, avocado, flaked salmon, seeds."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "omega-3",
      "gluten-free"
    ],
    "tags": [
      "high-protein",
      "omega-3",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c6c2466d-e63f-4416-9f12-95123042c1a5.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-47",
    "title": "Za'atar Chicken Thighs with Cauliflower & Chickpeas",
    "category": "obed",
    "description": "Za'atar-marinated chicken thighs roasted over cauliflower and chickpeas on one tray in 35 minutes. Za'atar makes everything extraordinary.",
    "prepTime": 45,
    "servings": 4,
    "calories": 420,
    "protein": 42,
    "carbs": 26,
    "fat": 14,
    "fiber": 8,
    "ingredients": [
      {
        "amount": "8",
        "name": "chicken thighs boneless"
      },
      {
        "amount": "400g",
        "name": "chickpeas"
      },
      {
        "amount": "0.5",
        "name": "cauliflower"
      },
      {
        "amount": "1",
        "name": "red onion"
      },
      {
        "amount": "3 tbsp",
        "name": "za'atar"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "salt"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      },
      {
        "amount": "",
        "name": "parsley"
      }
    ],
    "steps": [
      "Coat chicken in za'atar, oil, lemon, garlic. Marinate 15 min minimum.",
      "Spread cauliflower, chickpeas and onion on tray, nestle chicken on top.",
      "Roast at 210C 30-35 min."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "gluten-free",
      "one-pan"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "one-pan"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/3aab1d5e-3e78-4f52-ac57-30f1f5fd8bea.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-48",
    "title": "Whole Baked Trout with Fennel, Orange & Potatoes",
    "category": "obed",
    "description": "Trout baked whole with fennel, orange and fresh herbs. Takes 20 minutes and looks completely spectacular on the table.",
    "prepTime": 40,
    "servings": 4,
    "calories": 380,
    "protein": 38,
    "carbs": 22,
    "fat": 14,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "2",
        "name": "whole trout gutted"
      },
      {
        "amount": "1",
        "name": "fennel bulb"
      },
      {
        "amount": "1",
        "name": "orange"
      },
      {
        "amount": "1",
        "name": "lemon"
      },
      {
        "amount": "4",
        "name": "garlic cloves"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "thyme"
      },
      {
        "amount": "",
        "name": "dill"
      },
      {
        "amount": "",
        "name": "salt and white pepper"
      },
      {
        "amount": "300g",
        "name": "baby potatoes par-boiled"
      }
    ],
    "steps": [
      "Roast fennel and potatoes 10 min.",
      "Score trout, stuff with orange, lemon, garlic, herbs.",
      "Place on veg, squeeze orange juice over.",
      "Roast 18-20 min."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "omega-3",
      "one-pan"
    ],
    "tags": [
      "high-protein",
      "omega-3",
      "one-pan"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/df7902f1-8c68-4259-ae62-dd8fbe971772.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-49",
    "title": "Baked Turkey Meatballs with Tomatoes & Zucchini",
    "category": "obed",
    "description": "Light turkey meatballs baked on a tray with cherry tomatoes and zucchini. Everything roasts together creating a natural sauce.",
    "prepTime": 40,
    "servings": 4,
    "calories": 340,
    "protein": 36,
    "carbs": 18,
    "fat": 12,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "500g",
        "name": "turkey mince"
      },
      {
        "amount": "1",
        "name": "egg"
      },
      {
        "amount": "40g",
        "name": "wholegrain breadcrumbs"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "dried oregano"
      },
      {
        "amount": "300g",
        "name": "cherry tomatoes"
      },
      {
        "amount": "3",
        "name": "zucchini"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "fresh basil"
      },
      {
        "amount": "",
        "name": "parmesan"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Combine turkey, egg, breadcrumbs, garlic, oregano, parmesan, chilli. Roll into 20 balls.",
      "Nestle between tomatoes and zucchini on tray.",
      "Roast at 200C 22-25 min."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "low-fat",
      "family-friendly"
    ],
    "tags": [
      "high-protein",
      "low-fat",
      "family-friendly"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/37843fd1-5803-496c-bb4e-5db291b49e68.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-50",
    "title": "Baked Aubergine with Chickpeas, Tomatoes & Feta",
    "category": "obed",
    "description": "Aubergine roasted until silky and collapsing, topped with chickpeas, tomatoes and crumbled feta. Middle Eastern and Greek-inspired.",
    "prepTime": 38,
    "servings": 4,
    "calories": 320,
    "protein": 14,
    "carbs": 34,
    "fat": 14,
    "fiber": 12,
    "ingredients": [
      {
        "amount": "2 large",
        "name": "eggplants"
      },
      {
        "amount": "400g",
        "name": "chickpeas"
      },
      {
        "amount": "400g",
        "name": "cherry tomatoes"
      },
      {
        "amount": "80g",
        "name": "feta"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "mint and parsley"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Roast eggplant rounds at 210C 30 min.",
      "Roast chickpeas and tomatoes with spices 20 min.",
      "Arrange on platter, spoon chickpeas over eggplant, crumble feta, scatter herbs."
    ],
    "allergens": [],
    "dietary": [
      "vegan-optional",
      "high-fibre",
      "vegetarian"
    ],
    "tags": [
      "vegan-optional",
      "high-fibre",
      "vegetarian"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/55064132-c43c-4665-a2a5-cfc99dcbef63.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-51",
    "title": "Mediterranean One-Tray Roasted White Fish & Vegetables",
    "category": "obed",
    "description": "White fish on Mediterranean vegetables roasted together. A complete dinner in under 30 minutes.",
    "prepTime": 35,
    "servings": 4,
    "calories": 340,
    "protein": 38,
    "carbs": 16,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "4",
        "name": "white fish fillets"
      },
      {
        "amount": "300g",
        "name": "cherry tomatoes"
      },
      {
        "amount": "2",
        "name": "zucchini"
      },
      {
        "amount": "1",
        "name": "red capsicum"
      },
      {
        "amount": "1",
        "name": "yellow capsicum"
      },
      {
        "amount": "1",
        "name": "red onion"
      },
      {
        "amount": "",
        "name": "kalamata olives"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "dried oregano"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "parsley and basil"
      },
      {
        "amount": "",
        "name": "garlic"
      }
    ],
    "steps": [
      "Toss veg with oil and oregano, roast 15 min.",
      "Lay fish on veg, add lemon slices, roast 12-15 min more."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "gluten-free",
      "low-fat"
    ],
    "tags": [
      "high-protein",
      "gluten-free",
      "low-fat"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/8820f0de-a74f-4798-907e-b3404577007a.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-52",
    "title": "Smoked Mackerel, Beetroot & Lentil Salad with Horseradish",
    "category": "obed",
    "description": "A Scandinavian classic — smoky mackerel with sweet beetroot, peppery watercress and a sharp horseradish dressing. Zero cooking, 8 minutes.",
    "prepTime": 8,
    "servings": 2,
    "calories": 480,
    "protein": 38,
    "carbs": 30,
    "fat": 22,
    "fiber": 10,
    "ingredients": [
      {
        "amount": "2",
        "name": "smoked mackerel fillets"
      },
      {
        "amount": "300g",
        "name": "cooked beetroot"
      },
      {
        "amount": "60g",
        "name": "watercress"
      },
      {
        "amount": "200g",
        "name": "Puy lentils cooked"
      },
      {
        "amount": "1",
        "name": "apple"
      },
      {
        "amount": "3 tbsp",
        "name": "creme fraiche"
      },
      {
        "amount": "1.5 tsp",
        "name": "horseradish"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "dill"
      },
      {
        "amount": "",
        "name": "pumpkin seeds"
      }
    ],
    "steps": [
      "Whisk horseradish dressing.",
      "Arrange watercress with lentils, beetroot and apple.",
      "Flake mackerel over, scatter dill and seeds.",
      "Spoon dressing over."
    ],
    "allergens": [],
    "dietary": [
      "no-cook",
      "high-protein",
      "omega-3"
    ],
    "tags": [
      "no-cook",
      "high-protein",
      "omega-3"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c2a55f7b-11c2-4de0-a2bc-1448881c8fb0.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-53",
    "title": "Tuna, Lentil & Roasted Pepper Salad",
    "category": "obed",
    "description": "Spanish-inspired pantry combination of tuna, lentils and roasted peppers. Protein and fibre powerhouse in 5 minutes.",
    "prepTime": 5,
    "servings": 2,
    "calories": 420,
    "protein": 50,
    "carbs": 28,
    "fat": 10,
    "fiber": 12,
    "ingredients": [
      {
        "amount": "2",
        "name": "cans tuna in water"
      },
      {
        "amount": "300g",
        "name": "Puy lentils cooked"
      },
      {
        "amount": "150g",
        "name": "roasted red peppers jarred"
      },
      {
        "amount": "0.5",
        "name": "red onion"
      },
      {
        "amount": "2",
        "name": "celery stalks"
      },
      {
        "amount": "40g",
        "name": "kalamata olives"
      },
      {
        "amount": "",
        "name": "sherry vinegar"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "60g",
        "name": "rocket"
      }
    ],
    "steps": [
      "Whisk vinegar, oil and mustard.",
      "Toss lentils, peppers, onion, celery, olives with dressing.",
      "Fold in tuna in large flakes.",
      "Serve over rocket with parsley."
    ],
    "allergens": [],
    "dietary": [
      "no-cook",
      "high-protein",
      "pantry-staple"
    ],
    "tags": [
      "no-cook",
      "high-protein",
      "pantry-staple"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/181b67f8-213f-49a4-b744-16192a43660c.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-54",
    "title": "Prawn & White Bean Stew",
    "category": "obed",
    "description": "Prawns cook in 3 minutes and pair beautifully with white beans in a garlicky tomato broth. An Italian coastal classic.",
    "prepTime": 20,
    "servings": 4,
    "calories": 360,
    "protein": 38,
    "carbs": 32,
    "fat": 7,
    "fiber": 12,
    "ingredients": [
      {
        "amount": "500g",
        "name": "raw prawns peeled"
      },
      {
        "amount": "800g",
        "name": "cannellini beans"
      },
      {
        "amount": "400g",
        "name": "crushed tomatoes"
      },
      {
        "amount": "200ml",
        "name": "stock"
      },
      {
        "amount": "4",
        "name": "garlic cloves"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "100g",
        "name": "spinach"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Fry garlic and chilli gently 1-2 min.",
      "Add tomatoes, stock and beans. Simmer 10 min.",
      "Add prawns 2-3 min until pink.",
      "Stir in spinach and lemon."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "high-fibre",
      "italian-inspired"
    ],
    "tags": [
      "high-protein",
      "high-fibre",
      "italian-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c3ad7bcb-d846-4fa3-8e51-a8b97545b7b5.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-55",
    "title": "Spiced Chicken Lettuce Cups with Herb Yogurt",
    "category": "obed",
    "description": "Crisp butter lettuce cups filled with warm spiced chicken and a herbed yogurt sauce. Light, fresh and interactive — ready in 20 minutes.",
    "prepTime": 20,
    "servings": 2,
    "calories": 420,
    "protein": 44,
    "carbs": 16,
    "fat": 20,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "400g",
        "name": "chicken mince"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "red onion"
      },
      {
        "amount": "",
        "name": "cumin"
      },
      {
        "amount": "",
        "name": "coriander"
      },
      {
        "amount": "",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "butter lettuce"
      },
      {
        "amount": "150g",
        "name": "Greek yogurt"
      },
      {
        "amount": "",
        "name": "mint and parsley"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "cucumber"
      },
      {
        "amount": "",
        "name": "pine nuts toasted"
      }
    ],
    "steps": [
      "Cook onion, garlic and spices, add chicken mince.",
      "Mix yogurt with garlic, herbs and lemon.",
      "Fill lettuce cups with chicken, cucumber, yogurt, pine nuts."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "low-carb",
      "gluten-free"
    ],
    "tags": [
      "high-protein",
      "low-carb",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/40656ace-137e-4a9c-9ce0-8e74d62ea16b.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-56",
    "title": "Warm Lentil & Greens Bowl with Poached Eggs",
    "category": "obed",
    "description": "The fastest complete dinner in this collection. Warm lentils, wilted greens and two poached eggs on the table in 12 minutes.",
    "prepTime": 12,
    "servings": 2,
    "calories": 400,
    "protein": 30,
    "carbs": 32,
    "fat": 16,
    "fiber": 12,
    "ingredients": [
      {
        "amount": "300g",
        "name": "Puy lentils cooked"
      },
      {
        "amount": "4",
        "name": "eggs"
      },
      {
        "amount": "100g",
        "name": "spinach or kale"
      },
      {
        "amount": "1 tsp",
        "name": "vinegar"
      },
      {
        "amount": "",
        "name": "garlic"
      },
      {
        "amount": "",
        "name": "olive oil"
      },
      {
        "amount": "",
        "name": "Dijon mustard"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "smoked paprika"
      },
      {
        "amount": "",
        "name": "parsley"
      },
      {
        "amount": "",
        "name": "chilli flakes"
      },
      {
        "amount": "",
        "name": "salt"
      }
    ],
    "steps": [
      "Warm lentils with garlic, mustard, lemon, paprika.",
      "Add spinach 1 min.",
      "Poach eggs 3 min.",
      "Divide into bowls, top with 2 eggs, scatter parsley."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "high-fibre",
      "vegetarian"
    ],
    "tags": [
      "high-protein",
      "high-fibre",
      "vegetarian"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c76eaa03-106b-4fae-8dfd-63e2f22d9972.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-57",
    "title": "Golden Milk Banana Smoothie",
    "category": "smoothie",
    "description": "Anti-inflammatory turmeric, warming ginger and creamy banana in coconut milk. Golden milk meets breakfast smoothie.",
    "prepTime": 3,
    "servings": 1,
    "calories": 220,
    "protein": 3,
    "carbs": 38,
    "fat": 8,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "1",
        "name": "frozen banana"
      },
      {
        "amount": "250ml",
        "name": "light coconut milk"
      },
      {
        "amount": "1 tsp",
        "name": "turmeric"
      },
      {
        "amount": "0.5 tsp",
        "name": "fresh ginger"
      },
      {
        "amount": "0.25 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "pinch black pepper"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until completely smooth.",
      "Pour into glass, dust with cinnamon. Drink immediately."
    ],
    "allergens": [],
    "dietary": [
      "anti-inflammatory",
      "vegan",
      "dairy-free"
    ],
    "tags": [
      "anti-inflammatory",
      "vegan",
      "dairy-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/6d301f8d-4f1a-4aa3-9909-83a9168f821a.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-58",
    "title": "Pomegranate, Raspberry & Beetroot Smoothie",
    "category": "smoothie",
    "description": "Pomegranate and raspberries are two of the most antioxidant-dense fruits on earth. Together with beetroot, a smoothie of extraordinary colour.",
    "prepTime": 3,
    "servings": 1,
    "calories": 280,
    "protein": 10,
    "carbs": 50,
    "fat": 4,
    "fiber": 8,
    "ingredients": [
      {
        "amount": "100g",
        "name": "frozen raspberries"
      },
      {
        "amount": "100ml",
        "name": "pomegranate juice"
      },
      {
        "amount": "80g",
        "name": "cooked beetroot"
      },
      {
        "amount": "80g",
        "name": "Greek yogurt"
      },
      {
        "amount": "0.5",
        "name": "frozen banana"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "chia seeds"
      },
      {
        "amount": "100ml",
        "name": "coconut water"
      }
    ],
    "steps": [
      "Blend all ingredients until completely smooth.",
      "Pour into glass. The colour will be a stunning deep ruby."
    ],
    "allergens": [],
    "dietary": [
      "antioxidant-rich",
      "high-fibre",
      "gluten-free"
    ],
    "tags": [
      "antioxidant-rich",
      "high-fibre",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c0170fb2-fd27-469f-8559-d013ceb1aaec.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-59",
    "title": "Matcha Green Tea & Banana Smoothie",
    "category": "smoothie",
    "description": "Matcha delivers sustained caffeine release — no spike, no crash. Blended with banana and almond milk into a jade-green smoothie.",
    "prepTime": 4,
    "servings": 1,
    "calories": 280,
    "protein": 12,
    "carbs": 42,
    "fat": 7,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "1",
        "name": "frozen banana"
      },
      {
        "amount": "1 tsp",
        "name": "matcha powder"
      },
      {
        "amount": "250ml",
        "name": "almond milk"
      },
      {
        "amount": "80g",
        "name": "Greek yogurt"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "hemp seeds"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Whisk matcha in 2 tbsp hot water until dissolved.",
      "Blend with all other ingredients until vibrant green.",
      "Dust with extra matcha to serve."
    ],
    "allergens": [],
    "dietary": [
      "energising",
      "antioxidant-rich",
      "gluten-free"
    ],
    "tags": [
      "energising",
      "antioxidant-rich",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/c4f86240-458e-410b-b224-966ea78f7920.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-60",
    "title": "Blackcurrant & Kefir Smoothie",
    "category": "smoothie",
    "description": "Blackcurrants are one of Europe's most powerful berries — extraordinarily high in vitamin C. Blended with probiotic kefir.",
    "prepTime": 3,
    "servings": 1,
    "calories": 240,
    "protein": 10,
    "carbs": 38,
    "fat": 4,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "100g",
        "name": "frozen blackcurrants"
      },
      {
        "amount": "180ml",
        "name": "plain kefir"
      },
      {
        "amount": "0.5",
        "name": "frozen banana"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "flaxseed"
      },
      {
        "amount": "80ml",
        "name": "water"
      }
    ],
    "steps": [
      "Blend all ingredients until smooth.",
      "Pour into glass. The colour will be a deep gorgeous violet."
    ],
    "allergens": [],
    "dietary": [
      "probiotic",
      "gut-health",
      "vitamin-c"
    ],
    "tags": [
      "probiotic",
      "gut-health",
      "vitamin-c"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/09a2fdee-ec29-4102-91bc-9d708d715bd6.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-61",
    "title": "Apricot, Almond & Cardamom Smoothie",
    "category": "smoothie",
    "description": "Apricots are a staple of Southern European summer — rich in beta-carotene. Blended with almond milk and cardamom they become quietly extraordinary.",
    "prepTime": 3,
    "servings": 1,
    "calories": 280,
    "protein": 10,
    "carbs": 34,
    "fat": 12,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "150g",
        "name": "frozen or tinned apricots"
      },
      {
        "amount": "200ml",
        "name": "almond milk"
      },
      {
        "amount": "60g",
        "name": "Greek yogurt"
      },
      {
        "amount": "1 tbsp",
        "name": "almond butter"
      },
      {
        "amount": "0.5 tsp",
        "name": "cardamom"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until completely smooth.",
      "Pour into tall glass. Warm peachy gold colour."
    ],
    "allergens": [],
    "dietary": [
      "beta-carotene",
      "vitamin-c",
      "gluten-free"
    ],
    "tags": [
      "beta-carotene",
      "vitamin-c",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/2414f807-170d-410c-83f0-4b69a8dae5e0.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-62",
    "title": "Red Grape & Blueberry Antioxidant Smoothie",
    "category": "smoothie",
    "description": "Red grapes and blueberries are among the richest sources of resveratrol and anthocyanins — the polyphenols associated with heart health.",
    "prepTime": 3,
    "servings": 1,
    "calories": 260,
    "protein": 8,
    "carbs": 48,
    "fat": 4,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "100g",
        "name": "frozen red grapes"
      },
      {
        "amount": "80g",
        "name": "frozen blueberries"
      },
      {
        "amount": "80g",
        "name": "Greek yogurt"
      },
      {
        "amount": "150ml",
        "name": "pomegranate juice"
      },
      {
        "amount": "",
        "name": "chia seeds"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until completely smooth.",
      "Pour into glass. Deep indigo-purple colour."
    ],
    "allergens": [],
    "dietary": [
      "antioxidant-rich",
      "heart-healthy",
      "resveratrol"
    ],
    "tags": [
      "antioxidant-rich",
      "heart-healthy",
      "resveratrol"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/6ba61569-7351-45be-9c87-f61587567ce8.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-63",
    "title": "Mango & Coconut Lassi Smoothie",
    "category": "smoothie",
    "description": "A dairy-free mango lassi inspired by the Indian classic. Digestive, cooling and deeply tropical.",
    "prepTime": 3,
    "servings": 1,
    "calories": 250,
    "protein": 4,
    "carbs": 46,
    "fat": 6,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "150g",
        "name": "frozen mango"
      },
      {
        "amount": "120g",
        "name": "coconut yogurt"
      },
      {
        "amount": "150ml",
        "name": "coconut water"
      },
      {
        "amount": "1",
        "name": "lime juiced"
      },
      {
        "amount": "0.25 tsp",
        "name": "cardamom"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "fresh ginger"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until completely smooth.",
      "Pour into tall glass. Garnish with cardamom and lime."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "tags": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/2f217f54-a9d1-47c3-8757-702fbb64cee0.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-64",
    "title": "Acai & Mixed Berry Smoothie Bowl",
    "category": "smoothie",
    "description": "Acai is one of the most nutrient-dense berries — rich in omega-3, antioxidants and iron. Blended into a thick spoonable bowl.",
    "prepTime": 3,
    "servings": 1,
    "calories": 340,
    "protein": 8,
    "carbs": 54,
    "fat": 10,
    "fiber": 9,
    "ingredients": [
      {
        "amount": "100g",
        "name": "frozen acai pulp"
      },
      {
        "amount": "100g",
        "name": "frozen mixed berries"
      },
      {
        "amount": "0.5",
        "name": "frozen banana"
      },
      {
        "amount": "30g",
        "name": "rolled oats"
      },
      {
        "amount": "150ml",
        "name": "almond milk"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "granola"
      },
      {
        "amount": "",
        "name": "fresh berries"
      },
      {
        "amount": "",
        "name": "chia seeds"
      }
    ],
    "steps": [
      "Blend acai, berries, banana, oats, milk and honey until thick — barely pourable.",
      "Top with granola, fresh berries and chia seeds."
    ],
    "allergens": [],
    "dietary": [
      "omega-3",
      "antioxidant-rich",
      "high-fibre"
    ],
    "tags": [
      "omega-3",
      "antioxidant-rich",
      "high-fibre"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/17184900-8a43-412a-96de-953ac873bd50.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-65",
    "title": "Nectarine, Honey & Cardamom Smoothie",
    "category": "smoothie",
    "description": "Nectarines are a summer stone fruit staple across France, Italy and Spain. Blended with cardamom, yogurt and honey they become quietly extraordinary.",
    "prepTime": 3,
    "servings": 1,
    "calories": 260,
    "protein": 12,
    "carbs": 40,
    "fat": 5,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "2 ripe",
        "name": "nectarines or frozen"
      },
      {
        "amount": "100g",
        "name": "Greek yogurt"
      },
      {
        "amount": "150ml",
        "name": "oat milk"
      },
      {
        "amount": "0.5 tsp",
        "name": "cardamom"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "0.5 tsp",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until smooth and silky.",
      "Pour into glass. Dust with extra cardamom."
    ],
    "allergens": [],
    "dietary": [
      "vitamin-c",
      "beta-carotene",
      "high-protein"
    ],
    "tags": [
      "vitamin-c",
      "beta-carotene",
      "high-protein"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/01a8fc68-906a-4216-96ee-2269d075f40b.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-66",
    "title": "Lemon, Ginger & Turmeric Immune Booster Smoothie",
    "category": "smoothie",
    "description": "A sharp, intensely refreshing immune-boosting smoothie. Lemon, ginger and turmeric are three of the most evidence-backed anti-inflammatory ingredients.",
    "prepTime": 3,
    "servings": 1,
    "calories": 160,
    "protein": 2,
    "carbs": 36,
    "fat": 0,
    "fiber": 2,
    "ingredients": [
      {
        "amount": "2",
        "name": "lemons juiced"
      },
      {
        "amount": "2 tsp",
        "name": "fresh ginger"
      },
      {
        "amount": "0.5 tsp",
        "name": "turmeric"
      },
      {
        "amount": "0.5",
        "name": "frozen banana"
      },
      {
        "amount": "200ml",
        "name": "coconut water"
      },
      {
        "amount": "1 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "pinch black pepper"
      },
      {
        "amount": "",
        "name": "apple cider vinegar optional"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until smooth.",
      "Taste, adjust honey and ginger. Pour and drink immediately."
    ],
    "allergens": [],
    "dietary": [
      "immune-boosting",
      "anti-inflammatory",
      "vegan"
    ],
    "tags": [
      "immune-boosting",
      "anti-inflammatory",
      "vegan"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/df978bab-b88a-4424-8195-57c09d2e9ba2.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-67",
    "title": "Swiss Chard, Apple & Lemon Green Smoothie",
    "category": "smoothie",
    "description": "Swiss chard is a powerhouse leafy green used across Mediterranean Europe but almost never blended. One of the most nutrient-dense green smoothies possible.",
    "prepTime": 3,
    "servings": 1,
    "calories": 160,
    "protein": 3,
    "carbs": 36,
    "fat": 1,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "50g",
        "name": "Swiss chard stems removed"
      },
      {
        "amount": "1",
        "name": "green apple"
      },
      {
        "amount": "0.5",
        "name": "frozen banana"
      },
      {
        "amount": "1",
        "name": "lemon juiced"
      },
      {
        "amount": "1 tsp",
        "name": "fresh ginger"
      },
      {
        "amount": "250ml",
        "name": "coconut water"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend chard with coconut water first until completely smooth.",
      "Add apple, banana, ginger, lemon, honey, ice. Blend again.",
      "Drink immediately."
    ],
    "allergens": [],
    "dietary": [
      "iron-rich",
      "vitamin-k",
      "vegan"
    ],
    "tags": [
      "iron-rich",
      "vitamin-k",
      "vegan"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/572546b7-07fa-4b8f-be49-d4d57d4eebcf.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-68",
    "title": "Black Cherry, Vanilla & Oat Milk Smoothie",
    "category": "smoothie",
    "description": "Morello cherries are deeply pigmented and extraordinarily rich in melatonin. Tastes like liquid Black Forest cake. A sleep-supportive evening smoothie.",
    "prepTime": 3,
    "servings": 1,
    "calories": 270,
    "protein": 9,
    "carbs": 46,
    "fat": 5,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "150g",
        "name": "frozen dark cherries"
      },
      {
        "amount": "250ml",
        "name": "oat milk"
      },
      {
        "amount": "60g",
        "name": "Greek yogurt"
      },
      {
        "amount": "1 tsp",
        "name": "vanilla"
      },
      {
        "amount": "0.5 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "1 tsp",
        "name": "honey"
      },
      {
        "amount": "1 tsp",
        "name": "cocoa powder optional"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until completely smooth.",
      "Pour into glass. Deep gorgeous burgundy colour."
    ],
    "allergens": [],
    "dietary": [
      "melatonin-rich",
      "sleep-supportive",
      "antioxidant-rich"
    ],
    "tags": [
      "melatonin-rich",
      "sleep-supportive",
      "antioxidant-rich"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/b377d9ee-449a-424d-be54-b592848444d8.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-69",
    "title": "Passion Fruit & Mango Tropical Smoothie",
    "category": "smoothie",
    "description": "Passion fruit is intensely fragrant and tart — combined with mango and lime it creates an extraordinarily tropical, naturally sweetened smoothie.",
    "prepTime": 3,
    "servings": 1,
    "calories": 280,
    "protein": 8,
    "carbs": 54,
    "fat": 3,
    "fiber": 6,
    "ingredients": [
      {
        "amount": "150g",
        "name": "frozen mango"
      },
      {
        "amount": "2",
        "name": "passion fruits pulp scooped"
      },
      {
        "amount": "0.5",
        "name": "frozen banana"
      },
      {
        "amount": "1",
        "name": "lime juiced"
      },
      {
        "amount": "200ml",
        "name": "coconut water"
      },
      {
        "amount": "60g",
        "name": "Greek yogurt"
      },
      {
        "amount": "1 tsp",
        "name": "honey if needed"
      },
      {
        "amount": "",
        "name": "ice"
      }
    ],
    "steps": [
      "Blend all ingredients until completely smooth.",
      "Pour into glass. Vibrant sunny orange-gold colour."
    ],
    "allergens": [],
    "dietary": [
      "vitamin-c",
      "tropical",
      "gluten-free"
    ],
    "tags": [
      "vitamin-c",
      "tropical",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/3cbeefd1-ad76-42e5-bb69-540969e5b54b.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-70",
    "title": "Greek Yogurt Panna Cotta with Berry Compote",
    "category": "snack",
    "description": "Classic Italian panna cotta made with Greek yogurt instead of cream — all the silky elegance, a fraction of the fat, double the protein.",
    "prepTime": 20,
    "servings": 4,
    "calories": 180,
    "protein": 12,
    "carbs": 22,
    "fat": 5,
    "fiber": 2,
    "ingredients": [
      {
        "amount": "400g",
        "name": "full-fat Greek yogurt"
      },
      {
        "amount": "150ml",
        "name": "milk"
      },
      {
        "amount": "2",
        "name": "gelatine sheets"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "200g",
        "name": "mixed berries"
      },
      {
        "amount": "1 tbsp",
        "name": "honey for compote"
      },
      {
        "amount": "1 tsp",
        "name": "lemon juice"
      }
    ],
    "steps": [
      "Bloom gelatine in cold water.",
      "Dissolve in warmed milk.",
      "Stir into yogurt with honey and vanilla.",
      "Set in ramekins 4+ hrs.",
      "Simmer berry compote 5 min."
    ],
    "allergens": [],
    "dietary": [
      "high-protein",
      "low-fat",
      "italian-inspired"
    ],
    "tags": [
      "high-protein",
      "low-fat",
      "italian-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/61cc0222-f1d4-4439-b299-4f115275eca9.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-71",
    "title": "Baked Pears with Honey, Walnuts & Cinnamon",
    "category": "snack",
    "description": "Halved pears baked until golden and caramelised, filled with walnuts, cinnamon and honey. A classic European autumn dessert in five minutes of effort.",
    "prepTime": 33,
    "servings": 4,
    "calories": 200,
    "protein": 5,
    "carbs": 30,
    "fat": 9,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "4 ripe",
        "name": "pears halved and cored"
      },
      {
        "amount": "40g",
        "name": "walnuts"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "1 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "lemon"
      },
      {
        "amount": "",
        "name": "butter"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      },
      {
        "amount": "",
        "name": "cardamom optional"
      }
    ],
    "steps": [
      "Fill pear cavities with walnut-honey-cinnamon mixture.",
      "Add butter sliver to each.",
      "Bake at 190C 25-28 min until golden.",
      "Serve warm with yogurt."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "gluten-free",
      "high-fibre"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-fibre"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/e28c324e-8c47-416e-95ad-dff8b7a1ab09.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-72",
    "title": "Dark Chocolate & Avocado Mousse",
    "category": "snack",
    "description": "Silky, intensely chocolatey mousse made with ripe avocado instead of cream. The avocado is completely undetectable. High in healthy fats, dairy-free.",
    "prepTime": 5,
    "servings": 4,
    "calories": 220,
    "protein": 3,
    "carbs": 22,
    "fat": 16,
    "fiber": 8,
    "ingredients": [
      {
        "amount": "2",
        "name": "very ripe avocados"
      },
      {
        "amount": "4 tbsp",
        "name": "cocoa powder"
      },
      {
        "amount": "3 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "4 tbsp",
        "name": "almond milk"
      },
      {
        "amount": "0.25 tsp",
        "name": "salt"
      },
      {
        "amount": "",
        "name": "dark chocolate chips"
      },
      {
        "amount": "",
        "name": "fresh raspberries"
      }
    ],
    "steps": [
      "Blend avocados, cocoa, honey, vanilla, milk and salt until silky.",
      "Spoon into glasses.",
      "Refrigerate 30 min.",
      "Top with chocolate chips and raspberries."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "tags": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/50593cd6-9db6-453f-97e8-e2d48a5eb0fb.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-73",
    "title": "Italian Baked Peaches with Almond Filling",
    "category": "snack",
    "description": "Pesche ripiene — an Italian grandmother's summer classic. Peaches baked until yielding and fragrant, filled with an almond and honey paste.",
    "prepTime": 35,
    "servings": 4,
    "calories": 190,
    "protein": 6,
    "carbs": 24,
    "fat": 9,
    "fiber": 3,
    "ingredients": [
      {
        "amount": "4 ripe",
        "name": "peaches halved and stoned"
      },
      {
        "amount": "40g",
        "name": "ground almonds"
      },
      {
        "amount": "1",
        "name": "egg yolk"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "almond extract"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "80ml",
        "name": "dry white wine"
      },
      {
        "amount": "",
        "name": "flaked almonds"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Scoop flesh from peach cavities, chop.",
      "Mix with ground almonds, yolk, honey, extracts.",
      "Fill peaches in baking dish, pour wine in base.",
      "Bake at 180C 22-25 min."
    ],
    "allergens": [],
    "dietary": [
      "gluten-free",
      "italian-inspired",
      "elegant"
    ],
    "tags": [
      "gluten-free",
      "italian-inspired",
      "elegant"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/cee00187-942a-4321-94cc-5973c4cb34f5.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-74",
    "title": "Blueberry & Lemon Clafoutis",
    "category": "snack",
    "description": "A French classic — fruit baked in a light custard batter. Made lighter with oat milk and just two eggs. Soft, custardy, lightly sweet.",
    "prepTime": 40,
    "servings": 4,
    "calories": 200,
    "protein": 7,
    "carbs": 34,
    "fat": 5,
    "fiber": 3,
    "ingredients": [
      {
        "amount": "250g",
        "name": "blueberries"
      },
      {
        "amount": "2",
        "name": "eggs"
      },
      {
        "amount": "200ml",
        "name": "oat milk"
      },
      {
        "amount": "60g",
        "name": "flour"
      },
      {
        "amount": "3 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "0.5 tsp",
        "name": "lemon zest"
      },
      {
        "amount": "",
        "name": "butter for dish"
      },
      {
        "amount": "",
        "name": "icing sugar to dust"
      },
      {
        "amount": "",
        "name": "Greek yogurt to serve"
      }
    ],
    "steps": [
      "Butter dish, spread blueberries across base.",
      "Whisk eggs, milk, flour, honey, vanilla, lemon zest to smooth batter.",
      "Pour over blueberries.",
      "Bake 180C 28-32 min."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "low-fat",
      "french-inspired"
    ],
    "tags": [
      "vegetarian",
      "low-fat",
      "french-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/e3b07c3b-36c1-4fd8-88f9-15befb68a22d.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-75",
    "title": "Spiced Red Wine Poached Pears",
    "category": "snack",
    "description": "Pears gently poached in spiced red wine until silky and deeply crimson. Elegant, showstopping, almost zero effort.",
    "prepTime": 40,
    "servings": 4,
    "calories": 180,
    "protein": 3,
    "carbs": 36,
    "fat": 1,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "4",
        "name": "firm pears peeled with stems"
      },
      {
        "amount": "400ml",
        "name": "red wine"
      },
      {
        "amount": "200ml",
        "name": "water"
      },
      {
        "amount": "3 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "cinnamon stick"
      },
      {
        "amount": "2",
        "name": "star anise"
      },
      {
        "amount": "3",
        "name": "cloves"
      },
      {
        "amount": "",
        "name": "orange zest"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Simmer wine, water, honey and spices.",
      "Poach pears upright 20-25 min turning occasionally.",
      "Remove pears, reduce syrup 8-10 min.",
      "Serve pears upright with crimson syrup."
    ],
    "allergens": [],
    "dietary": [
      "vegan-optional",
      "gluten-free",
      "elegant"
    ],
    "tags": [
      "vegan-optional",
      "gluten-free",
      "elegant"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/6bf86ac0-494a-43f0-8ee4-10697591799e.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-76",
    "title": "Orange & Almond Flourless Cake",
    "category": "snack",
    "description": "A classic Spanish and Portuguese almond cake — no flour, no butter, just ground almonds, eggs and orange. Dense, moist, deeply fragrant.",
    "prepTime": 50,
    "servings": 8,
    "calories": 240,
    "protein": 9,
    "carbs": 20,
    "fat": 15,
    "fiber": 3,
    "ingredients": [
      {
        "amount": "200g",
        "name": "ground almonds"
      },
      {
        "amount": "4",
        "name": "eggs"
      },
      {
        "amount": "120g",
        "name": "honey"
      },
      {
        "amount": "2",
        "name": "oranges zested and juiced"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "0.5 tsp",
        "name": "baking powder"
      },
      {
        "amount": "0.25 tsp",
        "name": "salt"
      },
      {
        "amount": "",
        "name": "icing sugar"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      }
    ],
    "steps": [
      "Beat eggs and honey 3 min.",
      "Add orange zest and juice, vanilla.",
      "Fold in ground almonds, baking powder, salt.",
      "Bake at 170C 35-40 min."
    ],
    "allergens": [],
    "dietary": [
      "gluten-free",
      "dairy-free",
      "spanish-inspired"
    ],
    "tags": [
      "gluten-free",
      "dairy-free",
      "spanish-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/7cb33773-12e0-42e4-9bd9-93e5d2061071.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-77",
    "title": "Dark Chocolate Chia Pots with Raspberries",
    "category": "snack",
    "description": "All the indulgence of a chocolate pudding. Chia seeds set into a silky, intensely chocolatey pot overnight. High in omega-3 and fibre.",
    "prepTime": 8,
    "servings": 4,
    "calories": 190,
    "protein": 6,
    "carbs": 24,
    "fat": 9,
    "fiber": 11,
    "ingredients": [
      {
        "amount": "60g",
        "name": "chia seeds"
      },
      {
        "amount": "400ml",
        "name": "oat milk"
      },
      {
        "amount": "3 tbsp",
        "name": "cocoa powder"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "0.25 tsp",
        "name": "salt"
      },
      {
        "amount": "120g",
        "name": "raspberries"
      },
      {
        "amount": "20g",
        "name": "dark chocolate grated"
      }
    ],
    "steps": [
      "Whisk cocoa, honey, vanilla and salt into milk.",
      "Stir in chia seeds.",
      "Stir again after 10 min.",
      "Refrigerate overnight.",
      "Top with raspberries and grated chocolate."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "tags": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/30530232-27f9-44f7-99f3-d8b9bce849f5.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-78",
    "title": "Baked Cinnamon Apples with Oat & Walnut Crumble",
    "category": "snack",
    "description": "Individual baked apples filled with an oat, walnut and cinnamon crumble. A lighter naturally sweetened version of the British and French classic.",
    "prepTime": 45,
    "servings": 4,
    "calories": 240,
    "protein": 5,
    "carbs": 38,
    "fat": 10,
    "fiber": 5,
    "ingredients": [
      {
        "amount": "4 large",
        "name": "cooking apples"
      },
      {
        "amount": "50g",
        "name": "rolled oats"
      },
      {
        "amount": "30g",
        "name": "walnuts or pecans"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "1 tbsp",
        "name": "butter melted"
      },
      {
        "amount": "1.5 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "",
        "name": "nutmeg"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "Greek yogurt"
      },
      {
        "amount": "",
        "name": "honey to serve"
      }
    ],
    "steps": [
      "Core apples, score skin around middle.",
      "Mix oat crumble.",
      "Press into cavities, mounding above top.",
      "Bake at 190C 35-40 min."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "high-fibre",
      "warming"
    ],
    "tags": [
      "vegetarian",
      "high-fibre",
      "warming"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/dfeedce3-9a73-4d95-9b51-b8f456c7a5d6.png",
    "difficulty": "medium"
  },
  {
    "id": "neome-79",
    "title": "Strawberry & Lemon Granita",
    "category": "snack",
    "description": "A Sicilian frozen dessert — nothing more than fruit, honey and water. The purest, most elegant healthy dessert in existence. Just 60 calories.",
    "prepTime": 5,
    "servings": 6,
    "calories": 60,
    "protein": 1,
    "carbs": 14,
    "fat": 0,
    "fiber": 2,
    "ingredients": [
      {
        "amount": "600g",
        "name": "ripe strawberries"
      },
      {
        "amount": "2",
        "name": "lemons juiced"
      },
      {
        "amount": "3 tbsp",
        "name": "honey"
      },
      {
        "amount": "100ml",
        "name": "water"
      },
      {
        "amount": "",
        "name": "mint leaves"
      },
      {
        "amount": "",
        "name": "lemon zest"
      }
    ],
    "steps": [
      "Blend strawberries, lemon, honey, water and zest.",
      "Freeze 1 hour.",
      "Fork through vigorously.",
      "Repeat every 30 min 3-4 times until light and granular.",
      "Serve in chilled glasses."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "tags": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/a8233951-4e76-4568-8f15-ea054ec5fe84.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-80",
    "title": "Lemon Ricotta Cheesecake Jars",
    "category": "snack",
    "description": "Individual no-bake cheesecake jars with bright lemony ricotta cream over a walnut and date base. Light, creamy and genuinely protein-rich.",
    "prepTime": 15,
    "servings": 4,
    "calories": 310,
    "protein": 12,
    "carbs": 34,
    "fat": 14,
    "fiber": 3,
    "ingredients": [
      {
        "amount": "8",
        "name": "medjool dates pitted"
      },
      {
        "amount": "80g",
        "name": "walnuts"
      },
      {
        "amount": "0.5 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "250g",
        "name": "ricotta"
      },
      {
        "amount": "150g",
        "name": "Greek yogurt"
      },
      {
        "amount": "2",
        "name": "lemons zested and juiced"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "",
        "name": "mixed berries"
      },
      {
        "amount": "",
        "name": "honey to drizzle"
      }
    ],
    "steps": [
      "Pulse dates, walnuts and cinnamon to sticky dough.",
      "Press into jar bases.",
      "Beat ricotta, yogurt, lemon, honey, vanilla smooth.",
      "Spoon over bases.",
      "Chill 1 hr. Top with berries."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "gluten-free",
      "high-protein"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "high-protein"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/2bd1f518-513f-4e22-b5af-2251cc547f94.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-81",
    "title": "Lighter Tiramisu Cups with Greek Yogurt & Ricotta",
    "category": "snack",
    "description": "Tiramisu reimagined with Greek yogurt and ricotta instead of mascarpone. Dramatically lower in fat, still unmistakably, gloriously tiramisu.",
    "prepTime": 15,
    "servings": 6,
    "calories": 220,
    "protein": 10,
    "carbs": 26,
    "fat": 8,
    "fiber": 1,
    "ingredients": [
      {
        "amount": "300g",
        "name": "full-fat Greek yogurt"
      },
      {
        "amount": "200g",
        "name": "ricotta"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "200ml",
        "name": "strong espresso cooled"
      },
      {
        "amount": "12",
        "name": "savoiardi sponge fingers"
      },
      {
        "amount": "2 tbsp",
        "name": "cocoa powder"
      },
      {
        "amount": "",
        "name": "dark chocolate grated"
      },
      {
        "amount": "",
        "name": "coffee liqueur optional"
      }
    ],
    "steps": [
      "Beat yogurt, ricotta, honey and vanilla smooth.",
      "Dip sponge fingers in espresso 1 second per side.",
      "Layer in cups with cream.",
      "Refrigerate overnight.",
      "Dust with cocoa before serving."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "lower-fat",
      "italian-inspired"
    ],
    "tags": [
      "vegetarian",
      "lower-fat",
      "italian-inspired"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/e0b4b005-5d52-4d70-8e3a-80b3fda1dc6e.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-82",
    "title": "Dark Chocolate & Hazelnut Date Truffles",
    "category": "snack",
    "description": "Intensely chocolatey, made entirely from dates, hazelnuts and cocoa with no refined sugar. The experience of fine European dark chocolate confectionery.",
    "prepTime": 10,
    "servings": 16,
    "calories": 80,
    "protein": 1.5,
    "carbs": 10,
    "fat": 4,
    "fiber": 2,
    "ingredients": [
      {
        "amount": "200g",
        "name": "medjool dates pitted"
      },
      {
        "amount": "100g",
        "name": "roasted hazelnuts"
      },
      {
        "amount": "4 tbsp",
        "name": "cocoa powder"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "2 tsp",
        "name": "coconut oil"
      },
      {
        "amount": "0.25 tsp",
        "name": "salt"
      },
      {
        "amount": "",
        "name": "cocoa powder or crushed hazelnuts to roll in"
      },
      {
        "amount": "20g",
        "name": "dark chocolate melted optional"
      }
    ],
    "steps": [
      "Process hazelnuts until ground.",
      "Add dates, cocoa, vanilla, coconut oil, salt. Process to sticky dough.",
      "Roll into 16 balls.",
      "Roll in cocoa or hazelnuts.",
      "Refrigerate 30 min."
    ],
    "allergens": [],
    "dietary": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "tags": [
      "vegan",
      "dairy-free",
      "gluten-free"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/f545d8cd-fc59-4445-824e-a29e986eaf8e.png",
    "difficulty": "easy"
  },
  {
    "id": "neome-83",
    "title": "Fig & Honey Tart with Almond Date Base",
    "category": "snack",
    "description": "A no-bake tart built on an almond and date base, filled with whipped honey ricotta cream and topped with fresh figs. No refined sugar.",
    "prepTime": 20,
    "servings": 8,
    "calories": 260,
    "protein": 9,
    "carbs": 24,
    "fat": 15,
    "fiber": 4,
    "ingredients": [
      {
        "amount": "150g",
        "name": "raw almonds"
      },
      {
        "amount": "120g",
        "name": "medjool dates pitted"
      },
      {
        "amount": "2 tsp",
        "name": "coconut oil"
      },
      {
        "amount": "0.5 tsp",
        "name": "cinnamon"
      },
      {
        "amount": "300g",
        "name": "ricotta"
      },
      {
        "amount": "100g",
        "name": "Greek yogurt"
      },
      {
        "amount": "2 tbsp",
        "name": "honey"
      },
      {
        "amount": "",
        "name": "vanilla"
      },
      {
        "amount": "6",
        "name": "fresh figs quartered"
      },
      {
        "amount": "",
        "name": "honey to drizzle"
      },
      {
        "amount": "",
        "name": "pistachios"
      }
    ],
    "steps": [
      "Process almonds until ground.",
      "Add dates, coconut oil, cinnamon — process to sticky dough.",
      "Press into 22cm tart tin. Chill.",
      "Beat ricotta, yogurt, honey, vanilla smooth.",
      "Spread over base.",
      "Chill 1 hr. Top with figs, honey, pistachios."
    ],
    "allergens": [],
    "dietary": [
      "vegetarian",
      "gluten-free",
      "no-refined-sugar"
    ],
    "tags": [
      "vegetarian",
      "gluten-free",
      "no-refined-sugar"
    ],
    "image": "https://d3u0tzju9qaucj.cloudfront.net/73bce504-8aa2-46c1-809f-5adb3e5ee811/471e5d22-9876-4bae-a40e-cd618a9dfad0.png",
    "difficulty": "easy"
  }
];