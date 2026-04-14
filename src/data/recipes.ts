// NeoMe recipe database — 105 recipes from NeoMe-Recepty-Database-FIXED.csv
// Generated 2026-04-13. Categories: ranajky(26) obed(37) vecera(20) snack(15) smoothie(7)
// Previous 261 recipes archived in recipes-legacy.ts

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

export const recipes: Recipe[] = [
  {
    "id": "obed-bbg-kura-s-mango-salsou",
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
        "amount": "50 g",
        "name": "Manga, očistené a nakrájané"
      },
      {
        "amount": "50g",
        "name": "Kukuric"
      },
      {
        "amount": "1 ČL",
        "name": "Limetkovej šťavy"
      },
      {
        "amount": "80g",
        "name": "Cherry rajčín"
      },
      {
        "amount": "10 ml",
        "name": "Olivového oleja"
      },
      {
        "amount": "15 g",
        "name": "Červenej cibul"
      },
      {
        "amount": "10 ml",
        "name": "Sójovej omáčky"
      },
      {
        "amount": "40 g",
        "name": "Červenej papriky"
      },
      {
        "amount": "3g",
        "name": "Cesnaku, pretlačeného"
      },
      {
        "amount": "30g",
        "name": "Avokáda"
      },
      {
        "amount": "½ ČL",
        "name": "Sriracha omáčky"
      },
      {
        "amount": "½ ČL",
        "name": "kurkumy"
      },
      {
        "amount": "½ šálky",
        "name": "Čerstvého koriandru"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-bata-tovy-kola-c-z-mlete-ho-ma-sa",
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
        "amount": "2 ks",
        "name": "Paradajkovej pasty"
      },
      {
        "amount": "500 g",
        "name": "Mletého hovädzieho mäsa"
      },
      {
        "amount": "",
        "name": "na postriekanie Olivový olej v spreji"
      },
      {
        "amount": "400 g",
        "name": "Paradajok v plechovk"
      },
      {
        "amount": "400 g",
        "name": "Sladkých zemiakov"
      },
      {
        "amount": "400 g",
        "name": "Šošovice v plechovk"
      },
      {
        "amount": "",
        "name": "podľa chuti Soľ, korenie a petržlen"
      },
      {
        "amount": "",
        "name": "1 P L Čerstvá vňať na ozdobu"
      },
      {
        "amount": "1 ks",
        "name": "+ 1 cibuľa zahradny salat"
      },
      {
        "amount": "",
        "name": "2 Mrkvy m , ,"
      },
      {
        "amount": "1 Šálka",
        "name": "špenátu"
      },
      {
        "amount": "",
        "name": "2 Stonky zeleru"
      },
      {
        "amount": "2 strúčiky",
        "name": "Cesnaku"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-bata-tovy-s-ala-t-s-ryz-ou-a-s-os-ovicou",
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
        "amount": "150 g",
        "name": "Batáty, ošúpané"
      },
      {
        "amount": "100 g",
        "name": "Nakrájaných"
      },
      {
        "amount": "1 Cl",
        "name": "dijónskej horčic"
      },
      {
        "amount": "",
        "name": "1 P L Hnedej šošovice ."
      },
      {
        "amount": "cl",
        "name": "medu"
      },
      {
        "amount": "1 Šálka",
        "name": "špenátu . shire"
      },
      {
        "amount": "",
        "name": "½ Brokolice, nakrájanej * soľ a čierne koreni"
      },
      {
        "amount": "1 Šálka",
        "name": "rukoly"
      },
      {
        "amount": "",
        "name": "½ Hrste sušených brusníc"
      },
      {
        "amount": "10g",
        "name": "Tekvicových semiačok"
      },
      {
        "amount": "",
        "name": "1 P L Gréckeho jogurtu alebo"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-falafel-wrap",
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
        "amount": "1 ks",
        "name": "Špaldový wrap"
      },
      {
        "amount": "",
        "name": "1 P L Hummusu"
      },
      {
        "amount": "150 g",
        "name": "Falafel guličiek"
      },
      {
        "amount": "1 ks",
        "name": "Rajčiny"
      },
      {
        "amount": "½ ks",
        "name": "% uhorky"
      },
      {
        "amount": "15g",
        "name": "Nízkotučného syra alebo syrovej náhrady"
      },
      {
        "amount": "",
        "name": "2 hrste Špenátu"
      },
      {
        "amount": "",
        "name": "1,5 P L Tabouli"
      },
      {
        "amount": "150 g",
        "name": "Pl tzatziki alebo gréckeho jogurtu"
      },
      {
        "amount": "½ ks",
        "name": "Limetkovej šťavy"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-grilovany-mexicky-s-ala-t",
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
        "amount": "300 g",
        "name": "Olúpaných surových kreviet"
      },
      {
        "amount": "1 ks",
        "name": "1/4 červenej cibul"
      },
      {
        "amount": "½ ks",
        "name": "(alebo ryby/ kuracie mäso)"
      },
      {
        "amount": "1 Šálka",
        "name": "varenej hnedej ryž"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného 1/2 zväzku koriandra"
      },
      {
        "amount": "",
        "name": "1 Kukurica"
      },
      {
        "amount": "1 Lyžička",
        "name": "mletej papriky"
      },
      {
        "amount": "200 g",
        "name": "Čiernej fazule z plechovky"
      },
      {
        "amount": "120 g",
        "name": "Cherry paradajok"
      },
      {
        "amount": "",
        "name": "1 Malá uhorka"
      },
      {
        "amount": "",
        "name": "1 Polievková lyžica sladkej"
      },
      {
        "amount": "100 g",
        "name": "1/2 manga chilli omáčky"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-grilovany-sendvic-s-hova-dzi-m-ma-som",
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
        "amount": "80 g",
        "name": "Nakrájaného hovädzieho mäsa (upečeného)"
      },
      {
        "amount": "2 plátky",
        "name": "Kváskového chleba"
      },
      {
        "amount": "½ ks",
        "name": "Vá avokáda"
      },
      {
        "amount": "20 g",
        "name": "Nízkotučného syra"
      },
      {
        "amount": "",
        "name": "1 Hrsť špenátu"
      },
      {
        "amount": "½ ks",
        "name": "Rajčiny"
      },
      {
        "amount": "",
        "name": "1 Ananásový krúžok"
      },
      {
        "amount": "2 plátky",
        "name": "Cvikly"
      },
      {
        "amount": "",
        "name": "2 Kyslé uhorky"
      },
      {
        "amount": "",
        "name": "½ P L Nízkotučnej majonézy"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-hova-dzie-na-zelenine",
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
        "amount": "1 kg",
        "name": "Hovädzieho mäsa"
      },
      {
        "amount": "250 ml",
        "name": "Červeného vína"
      },
      {
        "amount": "500 ml",
        "name": "Kuracieho vývaru"
      },
      {
        "amount": "100 g",
        "name": "Rajčinového pretlaku"
      },
      {
        "amount": "60 ml",
        "name": "Sójovej omáčky"
      },
      {
        "amount": "30g",
        "name": "Hladkej múky"
      },
      {
        "amount": "",
        "name": "2 Strúčky cesnaku"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-hova-dzie-s-tekvicovou-kas-ou",
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
        "amount": "500 g",
        "name": "Extra chudého mletého"
      },
      {
        "amount": "700 g",
        "name": "Tekvic"
      },
      {
        "amount": "200 g",
        "name": "Hovädzieho mäsa"
      },
      {
        "amount": "",
        "name": "1 P L Medu"
      },
      {
        "amount": "",
        "name": "1 Mrkva, nastrúhaná"
      },
      {
        "amount": "",
        "name": "1,5 Hlavy brokolic"
      },
      {
        "amount": "",
        "name": "1 Cibuľa, nakrájaná na drobno"
      },
      {
        "amount": "2,5 šálky",
        "name": "Zelenej fazuľky"
      },
      {
        "amount": "",
        "name": "1 Rozšľahané vajce"
      },
      {
        "amount": "1/4 šálky",
        "name": "strúhanky"
      },
      {
        "amount": "1 Lyžica",
        "name": "paradajkovej omáčky soli alebo paradajkové čatní na"
      },
      {
        "amount": "1 Lyžica",
        "name": "barbecue omáčky podávani"
      },
      {
        "amount": "1 Lyžica",
        "name": "kari korenia"
      },
      {
        "amount": "1 Lyžica",
        "name": "sušených byliniek"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-kuracia-sezamova-panvic-ka",
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
        "amount": "200 g",
        "name": "Kuracích pfs bez kože,"
      },
      {
        "amount": "2 strúčiky",
        "name": "Cesnak"
      },
      {
        "amount": "100 g",
        "name": "Nakrájaných na kocky"
      },
      {
        "amount": "",
        "name": "1 cm Čerstvého zázvoru"
      },
      {
        "amount": "1 Šálka",
        "name": "hnedej ryž"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného 1/4 zväzku koriandra"
      },
      {
        "amount": "1/2 pl",
        "name": "sezamového oleja"
      },
      {
        "amount": "1 pl",
        "name": "sójovej omáčky"
      },
      {
        "amount": "150 g",
        "name": "1/4 zväzku brokolic"
      },
      {
        "amount": "½ ks",
        "name": "2/3 limetky"
      },
      {
        "amount": "1 ks",
        "name": "1/2 mrkvy"
      },
      {
        "amount": "½ ks",
        "name": "1/4 limetkovej kôry"
      },
      {
        "amount": "100 g",
        "name": "Fazule edamam"
      },
      {
        "amount": "",
        "name": "1 P L Medu"
      },
      {
        "amount": "1 ks",
        "name": "1/2 červenej papriky"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-mexicke-tortilly",
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
        "amount": "125 g",
        "name": "Chudého hovädzieho mäsa/"
      },
      {
        "amount": "1 ks",
        "name": "Kuracieho mäsa cibuľa, avokádo a kyslá"
      },
      {
        "amount": "100 g",
        "name": "Obľúbená fazuľa z plechovky smotana - alebo čokoľvek,"
      },
      {
        "amount": "",
        "name": "podľa chuti Taco korenie na tortilly . na čo máš chuť"
      },
      {
        "amount": "250 ml",
        "name": "Vody"
      },
      {
        "amount": "20 g",
        "name": "Listy maslového šalátu/celozrnné"
      },
      {
        "amount": "1 ks",
        "name": "Tortilly"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-placky-s-ricottou-cukinou-a-bata-tmi",
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
        "amount": "",
        "name": "1 Menší sladký zemiak, postrúhaný"
      },
      {
        "amount": "",
        "name": "2 Cukiny, nastrúhané"
      },
      {
        "amount": "1 ks",
        "name": "Cibule, nasekanej najemno"
      },
      {
        "amount": "",
        "name": "1 Hrsť nasekanej bazalky a petržlenovej vňat"
      },
      {
        "amount": "",
        "name": "2 Vajíčka"
      },
      {
        "amount": "1 Šálka",
        "name": "ricotty"
      },
      {
        "amount": "1,5 šálky",
        "name": "Špaldovej múky"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-plnene-sladke-zemiaky",
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
        "amount": "150 g",
        "name": "Mletých morčacích pís"
      },
      {
        "amount": "150 g",
        "name": "Gréckeho jogurtu"
      },
      {
        "amount": "",
        "name": "200 Gsladkých zemiakov"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky rasc"
      },
      {
        "amount": "",
        "name": "2 Paradajky nakrájané na kocky"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného 1/4 zväzku bazalky"
      },
      {
        "amount": "1 ks",
        "name": "Cibuľa"
      },
      {
        "amount": "1 Lyžička",
        "name": "čili prášku"
      },
      {
        "amount": "1 Šálka",
        "name": "špenátu"
      },
      {
        "amount": "",
        "name": "na postriekanie 1/2 mrkvy * olivový olej v spreji"
      },
      {
        "amount": "",
        "name": "podľa chuti 1/3 šálky hrášku"
      },
      {
        "amount": "1/4 šálky",
        "name": "kukuričných zfn"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-poke-miska-s-kuraci-m-ma-som",
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
        "amount": "150 g",
        "name": "Pečeného kuracieho mäsa"
      },
      {
        "amount": "3/4 šálky",
        "name": "edamame alebo"
      },
      {
        "amount": "1 Šálka",
        "name": "hnedej ryže hnedej fazule/ hrášku/ špargle)"
      },
      {
        "amount": "4 šálky",
        "name": "Strúhanej mrkvy"
      },
      {
        "amount": "4 šálky",
        "name": "Natenko nakrájanej uhorky omáčka na ryžu"
      },
      {
        "amount": "4 šálky",
        "name": "Nakrájanej kapusty"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného V4 hrste čerstvého koriandru"
      },
      {
        "amount": "",
        "name": "1 P L Medu"
      },
      {
        "amount": "",
        "name": "1 P L Sójovej omáčky"
      },
      {
        "amount": "20 g",
        "name": "Sezamové semienka"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-slany-kola-c-z-bata-tov-a-slaniny",
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
        "amount": "",
        "name": "1 Stredne veľký sladký zemiak,"
      },
      {
        "amount": "1 Šálka",
        "name": "nízkotučného syru,"
      },
      {
        "amount": "30 g",
        "name": "Nastrúhaný nastrúhaného"
      },
      {
        "amount": "1 ks",
        "name": "cukina, nastrúhaná a zbavená"
      },
      {
        "amount": "1 Cl",
        "name": "cesnaku"
      },
      {
        "amount": "250 ml",
        "name": "Vody"
      },
      {
        "amount": "",
        "name": "1 P L Pažítky"
      },
      {
        "amount": "4 plátky",
        "name": "Slaniny, nakrájané na malé - » čierne korenie (podla chuti)"
      },
      {
        "amount": "½ ks",
        "name": "Kúsky"
      },
      {
        "amount": "",
        "name": "1 Cibuľa, nasekaná špenát, mrva, paprika) ako príloha"
      },
      {
        "amount": "",
        "name": "4 Vajíčka podla preferenci"
      },
      {
        "amount": "1 Šálka",
        "name": "hladkej múky"
      },
      {
        "amount": "1 ČL",
        "name": "štipka prášku do pečiva"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-slany-kola-c-z-tekvice-a-fety",
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
        "amount": "",
        "name": "6 Vajíčok"
      },
      {
        "amount": "",
        "name": "1 Hrsť rukoly"
      },
      {
        "amount": "",
        "name": "2 Cibul"
      },
      {
        "amount": "",
        "name": "1 Hrsť špenátu"
      },
      {
        "amount": "2 šálky",
        "name": "Tekvice, nakrájanej na"
      },
      {
        "amount": "",
        "name": "5 Pokrájaných cherry rajčín"
      },
      {
        "amount": "100 g",
        "name": "Tofu alebo syr, na kocky"
      },
      {
        "amount": "1 Šálka",
        "name": "špenátu"
      },
      {
        "amount": "",
        "name": "3 Nasekané vlašské orechy"
      },
      {
        "amount": "30 g",
        "name": "Feta syru"
      },
      {
        "amount": "15g",
        "name": "Nastrúhaného parmezánu"
      },
      {
        "amount": "",
        "name": "1 P L Balzamikového octu"
      },
      {
        "amount": "4 šálky",
        "name": "Sušených rajčín, bez oleja"
      },
      {
        "amount": "",
        "name": "1 Hrsť tymiánu"
      },
      {
        "amount": "200 ml",
        "name": "%3 šálky mlieka ,"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-steak-s-pec-enou-zeleninou",
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
        "amount": "",
        "name": "2 Steaky"
      },
      {
        "amount": "",
        "name": "1 Uhorka"
      },
      {
        "amount": "400 g",
        "name": "Tekvice"
      },
      {
        "amount": "",
        "name": "1 P L Niekoľko baby zemiakov"
      },
      {
        "amount": "",
        "name": "1 Veľká mrkva"
      },
      {
        "amount": "",
        "name": "1 Paštrnák"
      },
      {
        "amount": "",
        "name": "1 Cuketa"
      },
      {
        "amount": "2 ks",
        "name": "Listy šalátu, nakrájané na kúsky"
      },
      {
        "amount": "",
        "name": "4 Cherry paradajok"
      },
      {
        "amount": "",
        "name": "1 Malá červená paprika"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-s-ala-t-z-tekvice-fety-a-c-ervenej-repy",
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
        "amount": "1 Šálka",
        "name": "červenej repy"
      },
      {
        "amount": "1/5 pl",
        "name": "balzamikového octu"
      },
      {
        "amount": "1 ks",
        "name": "Malej červenej cibule + % citróna"
      },
      {
        "amount": "",
        "name": "podľa chuti mrkva"
      },
      {
        "amount": "1 Šálka",
        "name": "baby špenátu"
      },
      {
        "amount": "20 g",
        "name": "Tety"
      },
      {
        "amount": "15 g",
        "name": "Vlašských orechov"
      },
      {
        "amount": "",
        "name": "2 Vetvičky mäty"
      },
      {
        "amount": "",
        "name": "na postriekanie Olivový olej v spreji"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-s-pena-tovo-brokolicove-cestoviny-s-pestom",
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
        "amount": "10 g",
        "name": "Parmezánu"
      },
      {
        "amount": "",
        "name": "2 hrste Baby špenátu"
      },
      {
        "amount": "150 g",
        "name": "Brokolica"
      },
      {
        "amount": "",
        "name": "⅛ zväzku Kapusta"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného 1/4 zväzku čerstvej bazalky"
      },
      {
        "amount": "15 g",
        "name": "Makadamových orechov"
      },
      {
        "amount": "",
        "name": "6 Cherry paradajok"
      },
      {
        "amount": "30 g",
        "name": "Parmezán na ozdobu"
      },
      {
        "amount": "2 strúčiky",
        "name": "1/4 cesnaku"
      },
      {
        "amount": "",
        "name": "1 P L Olivového oleja"
      },
      {
        "amount": "½ ks",
        "name": "1/8 citróna"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-tofu-buddha-bowl",
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
        "amount": "125 g",
        "name": "Prírodného tofu"
      },
      {
        "amount": "½ ks",
        "name": "1/2 avokáda (nakrájaného na"
      },
      {
        "amount": "2 šálky",
        "name": "Nakrájanej tekvice kocky)"
      },
      {
        "amount": "1 Šálka",
        "name": "quinoy"
      },
      {
        "amount": "",
        "name": "2 hrste Hfstka špenátu"
      },
      {
        "amount": "1 ks",
        "name": "Kukurica (z mini plechoviek alebo"
      },
      {
        "amount": "",
        "name": "1 P L Čerstvá) olivoý olej"
      },
      {
        "amount": "2 ks",
        "name": "Paradajka (nakrájaná na kocky)"
      },
      {
        "amount": "½ ks",
        "name": "1/2 uhorky"
      },
      {
        "amount": "1 ks",
        "name": "Cibuľu"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-u-dena-ryba-s-letnou-zeleninou",
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
        "amount": "400 g",
        "name": "Filetov z bielej ryby"
      },
      {
        "amount": "20 g",
        "name": "Tekvicových semienok"
      },
      {
        "amount": "120 g",
        "name": "Zelenej fazuľky nakrájanej * 190 ml vody"
      },
      {
        "amount": "65 g",
        "name": "Opláchnutej hneďej ryže + 2 lyžičky olivového oleja"
      },
      {
        "amount": "30 g",
        "name": "Divokej ryže, opláchnutej + 1/2 citrónu nakrájaného na"
      },
      {
        "amount": "80 g",
        "name": "(alebo len extra hneďej ryže) mesiačiky"
      },
      {
        "amount": "80 g",
        "name": "Baby špenátu"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky soli"
      },
      {
        "amount": "1 ks",
        "name": "Mletej papriky"
      },
      {
        "amount": "",
        "name": "podľa chuti Soľ a korenie podľa chuti"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-vega-nsky-burger-z-bata-tov",
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
        "amount": "150 G",
        "name": "batátov"
      },
      {
        "amount": "",
        "name": "1 Špaldová burger žemla"
      },
      {
        "amount": "50g",
        "name": "Fazule mungo"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného V, pl mletej rasce"
      },
      {
        "amount": "",
        "name": "½ P L Mletého koriandru"
      },
      {
        "amount": "",
        "name": "podľa chuti Soľ a čierne koreni"
      },
      {
        "amount": "2/3 pl",
        "name": "rajčinového chutney"
      },
      {
        "amount": "",
        "name": "1 P L olivový olej"
      },
      {
        "amount": "2 plátky",
        "name": "Rajčiny"
      },
      {
        "amount": "",
        "name": "5 Špenátových lístkov"
      },
      {
        "amount": "1 ks",
        "name": "% červenej cibul"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-vega-nsky-s-ala-t-s-ryz-ovy-mi-rezancami",
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
        "amount": "150 g",
        "name": "Ryžových rezancov"
      },
      {
        "amount": "20 g",
        "name": "Sezamových semienok"
      },
      {
        "amount": "",
        "name": "1 Veľká mrkva 1 čl javorového sirupu"
      },
      {
        "amount": "½ ks",
        "name": "Vw uhorky * 1 čl sezamového oleja"
      },
      {
        "amount": "1 Šálka",
        "name": "červenej kapusty"
      },
      {
        "amount": "1 ČL",
        "name": "Neutrálneho oleja"
      },
      {
        "amount": "",
        "name": "2 Malé jarné cibuľky, nakrájané"
      },
      {
        "amount": "",
        "name": "1 P L Citrónovej šťavy"
      },
      {
        "amount": "10g",
        "name": "Nakladaného zázvoru,"
      },
      {
        "amount": "100 g",
        "name": "Nakrájaného na tenké plátky"
      },
      {
        "amount": "1 Čl",
        "name": "štipľavej čili pasty"
      },
      {
        "amount": "20 g",
        "name": "Čierne sezamové semienka"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-vega-nsky-wrap-s-bata-tmi-a-humusom",
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
        "amount": "",
        "name": "2 hrste Špenátu"
      },
      {
        "amount": "",
        "name": "1 Polievková lyžica hummusu + 1/4 červenej papriky"
      },
      {
        "amount": "1 ks",
        "name": "1/3 mrkvy"
      },
      {
        "amount": "1 ks",
        "name": "1/4 jarnej cibuľky"
      },
      {
        "amount": "20 g",
        "name": "Slnečnicových semienok"
      },
      {
        "amount": "",
        "name": "podľa chuti Sol a koreni"
      },
      {
        "amount": "",
        "name": "1 Celozrnný wrap"
      },
      {
        "amount": "1/2 šálky",
        "name": "červenej kapusty"
      },
      {
        "amount": "1/2 šálky",
        "name": "pečených sladkých"
      },
      {
        "amount": "200 g",
        "name": "Zemiakov"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-zdrave-bolon-ske-s-pagety",
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
        "amount": "",
        "name": "2 Cibule, nasekané najemno"
      },
      {
        "amount": "",
        "name": "1 Cuketa, nastrúhaná najemno"
      },
      {
        "amount": "",
        "name": "2 Mrkvy, očistené a nakrájané"
      },
      {
        "amount": "",
        "name": "2 P L Nadrobno"
      },
      {
        "amount": "",
        "name": "2 Bobkové listy"
      },
      {
        "amount": "2 strúčiky",
        "name": "Cesnaku, pretlačné"
      },
      {
        "amount": "25 g",
        "name": "Parmezánu"
      },
      {
        "amount": "500 g",
        "name": "Chudé mleté hovädzie mäso"
      },
      {
        "amount": "800 g",
        "name": "Nasekaných rajčín z plechovky cestoviny"
      },
      {
        "amount": "",
        "name": "1 Baklažán, nakrájaný na 1 cm kocky"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-zdrave-zeleninove-muffiny",
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
        "amount": "2 šálky",
        "name": "Sladkého zemiaku, postrúhaného"
      },
      {
        "amount": "",
        "name": "4 Vajíčka a 3 bielky"
      },
      {
        "amount": "",
        "name": "½ Červenej papriky, nakrájanej na plátky"
      },
      {
        "amount": "1 Šálka",
        "name": "baby špenátu, nahrubo nasekaného"
      },
      {
        "amount": "",
        "name": "1 Výhonok bazalky, nasekanej na jemno"
      },
      {
        "amount": "30 g",
        "name": "Va šálky feta syru - rozdrobeného"
      },
      {
        "amount": "",
        "name": "1 P L Xtra panenský olivový olej"
      },
      {
        "amount": "",
        "name": "podľa chuti Soľ a čierne koreni"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-zelene-kari-s-krevetami",
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
        "amount": "300 g",
        "name": "Kreviet"
      },
      {
        "amount": "1 strúčik",
        "name": "Cesnaku"
      },
      {
        "amount": "1 Šálka",
        "name": "varenej hnedej ryž"
      },
      {
        "amount": "",
        "name": "1 Kúsok zázvoru"
      },
      {
        "amount": "",
        "name": "200 Gkokosového mlieka"
      },
      {
        "amount": "",
        "name": "1 Polievková lyžica zelenej kari"
      },
      {
        "amount": "",
        "name": "1 Cuketa pasty"
      },
      {
        "amount": "",
        "name": "1 Mrkva"
      },
      {
        "amount": "1/2 pl",
        "name": "sezamového oleja"
      },
      {
        "amount": "1 Šálka",
        "name": "hrášku"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného 1/2 zväzku koriandra"
      },
      {
        "amount": "1 ks",
        "name": "1/2 papriky"
      },
      {
        "amount": "",
        "name": "1 Limetka"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-hubova-polievka",
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
        "amount": "55 g",
        "name": "Hnedej cibul"
      },
      {
        "amount": "500 ml",
        "name": "Zeleninového vývaru"
      },
      {
        "amount": "60g",
        "name": "Mrkvy nakrájanej nahrubo"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky sušeného tymiánu"
      },
      {
        "amount": "95 g",
        "name": "Hub"
      },
      {
        "amount": "",
        "name": "1 Bobkový list"
      },
      {
        "amount": "55 g",
        "name": "Zeleru nasekaného nahrubo + 1/2 lyžičky sušeného rozmarínu"
      },
      {
        "amount": "6 g",
        "name": "Cesnaku nakrájaného na"
      },
      {
        "amount": "160 ml",
        "name": "Mandľového mlieka"
      },
      {
        "amount": "100 g",
        "name": "Drobné kocky"
      },
      {
        "amount": "15 g",
        "name": "Kukuričnej múky"
      },
      {
        "amount": "80 g",
        "name": "° 30 g čiernej ryž"
      },
      {
        "amount": "55 g",
        "name": "Tazule cannellini"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-kuracia-polievka-na-mexicky-s-ty-l",
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
        "amount": "135 g",
        "name": "Kuracieho mäsa zo stehna"
      },
      {
        "amount": "80 g",
        "name": "Žltej papriky, nasekanej 1 čl mletej papriky"
      },
      {
        "amount": "70 g",
        "name": "Cibule, nasekanej * 1 čl mletej rasce"
      },
      {
        "amount": "",
        "name": "1 Mrkva * čl sušeného oregána"
      },
      {
        "amount": "250 g",
        "name": "Nasekaných rajčín z plechovky"
      },
      {
        "amount": "2 strúčiky",
        "name": "Cesnakového korenia"
      },
      {
        "amount": "100 ml",
        "name": "Taco omáčky"
      },
      {
        "amount": "330 ml",
        "name": "Kuracieho vývaru"
      },
      {
        "amount": "10g",
        "name": "Kukuric"
      },
      {
        "amount": "100 g",
        "name": "Čiernej fazule"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného Koriandra"
      },
      {
        "amount": "",
        "name": "1 P L Gréckeho jogurtu"
      },
      {
        "amount": "200 g",
        "name": "Kuracieho mäsa. zatvor sáčok a poriadne ním zatras, aby sa mäso obalilo v"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-kuracia-polievka-na-s-ty-l-pho",
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
        "amount": "300 g",
        "name": "Kuracích pís"
      },
      {
        "amount": "180 g",
        "name": "Rezancov"
      },
      {
        "amount": "",
        "name": "1 Pór"
      },
      {
        "amount": "1,5 šálky",
        "name": "Mrazeného hrášku"
      },
      {
        "amount": "",
        "name": "3 Stonky zeleru"
      },
      {
        "amount": "1 Zväzok",
        "name": "čínskej kapusty"
      },
      {
        "amount": "200 g",
        "name": "Kocka kuracieho bujónu"
      },
      {
        "amount": "",
        "name": "3 Zelené šalotky"
      },
      {
        "amount": "",
        "name": "1 Malá plechovka kukurice"
      },
      {
        "amount": "1 strúčik",
        "name": "Cesnaku 1 pl sezamového oleja"
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-miso-polievka-s-jac-men-om",
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
        "amount": "110 g",
        "name": "Jačmeňa"
      },
      {
        "amount": "140g",
        "name": "Mrkvy, nakrájanej na"
      },
      {
        "amount": "",
        "name": "1,5 P L Miso pasty kocky"
      },
      {
        "amount": "5 ml",
        "name": "Sójovej omáčky"
      },
      {
        "amount": "140 g",
        "name": "Zeleru, nakrájaného"
      },
      {
        "amount": "",
        "name": "1 cm pl čerstvého zázvoru, na kocky"
      },
      {
        "amount": "100 g",
        "name": "Edamam"
      },
      {
        "amount": "30 g",
        "name": "Nastrúhaného"
      },
      {
        "amount": "60 g",
        "name": "Červená cibuľa a mangold"
      },
      {
        "amount": "100 g",
        "name": "Zelenina, nakrájaná nahrubo"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-paradajkova-polievka-s-fazul-ou",
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
        "amount": "150 g",
        "name": "Pasírovaných rajčín"
      },
      {
        "amount": "100 g",
        "name": "Nasekaných rajčín z plechovky"
      },
      {
        "amount": "50g",
        "name": "Mix fazule z plechovky"
      },
      {
        "amount": "",
        "name": "¼ porcie Coleslaw šalátu"
      },
      {
        "amount": "4 šálky",
        "name": "Zeleninovéhu vývaru"
      },
      {
        "amount": "90g",
        "name": "Kuracích stehien, nakrájaných na menšie kúsky"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-polievka-z-tekvice-a-bata-tov",
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
        "amount": "",
        "name": "na postriekanie Olivový olej v spreji"
      },
      {
        "amount": "",
        "name": "1 Cibuľa nakrájaná na kocky"
      },
      {
        "amount": "",
        "name": "1 Prelisovaný strúčik cesnaku"
      },
      {
        "amount": "1 Lyžička",
        "name": "kari korenia"
      },
      {
        "amount": "400 g",
        "name": "Tekvice nakrájanej na kocky"
      },
      {
        "amount": "",
        "name": "1 Mrkva"
      },
      {
        "amount": "200 g",
        "name": "Ošúpaných sladkých zemiakov nakrájaných na kocky"
      },
      {
        "amount": "",
        "name": "1 Zeleninového vývaru"
      },
      {
        "amount": "",
        "name": "1 P L Medu"
      },
      {
        "amount": "",
        "name": "podľa chuti štipka soli a korenia podľa chuti"
      },
      {
        "amount": "",
        "name": "2 P L Gréckeho jogurtu na podávani"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-s-os-ovicova-kari-polievka",
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
        "amount": "100g",
        "name": "Mrkvy, nakrájanej na plátky"
      },
      {
        "amount": "1 ČL",
        "name": "Kari prášku"
      },
      {
        "amount": "90 g",
        "name": "Zeleru, nakrájaného na plátky"
      },
      {
        "amount": "1 ks",
        "name": "Cibuľa, nasekaná najemno"
      },
      {
        "amount": "1 ČL",
        "name": "Mletý koriander"
      },
      {
        "amount": "3 g",
        "name": "Cesnaku, nasekaného najemno"
      },
      {
        "amount": "135 ml",
        "name": "Nízkotučného"
      },
      {
        "amount": "90 g",
        "name": "Červenej šošovice kokosového mlieka"
      },
      {
        "amount": "270 g",
        "name": "Nasekaných rajčín"
      },
      {
        "amount": "330 ml",
        "name": "Zeleninového vývaru"
      },
      {
        "amount": "400 g",
        "name": "Konzervovaná zelenina"
      },
      {
        "amount": "1 Cl",
        "name": "sójovej omáčky"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-vega-nska-s-os-ovicova-polievka",
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
        "amount": "",
        "name": "2 hrste V4 šálky hnedej alebo zelenej šošovice + šálka šalátovej zeleniny (kel,"
      },
      {
        "amount": "",
        "name": "1 Mrkva, nakrájaná na plátky kapusta, zelená cibuľka)"
      },
      {
        "amount": "",
        "name": "1 Zeler, nakrájaný na plátky"
      },
      {
        "amount": "",
        "name": "4 Veľké nasekané šampiňóny"
      },
      {
        "amount": "2 strúčiky",
        "name": "Cesnaku, pretlačeného"
      },
      {
        "amount": "250 ml",
        "name": "Zeleninový vývar"
      },
      {
        "amount": "",
        "name": "1 Výhonky rozmarínu alebo"
      },
      {
        "amount": "2/3 šálky",
        "name": "nasekaných baby zemiakov tymiánu"
      },
      {
        "amount": "½ ks",
        "name": "Trochu citrónovej šťavy"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-vy-var-na-a-zijsky-s-ty-l",
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
        "amount": "1 Šálka",
        "name": "domáceho vývaru z kostí ° 35 g fazuľových klíčkov"
      },
      {
        "amount": "1 Šálka",
        "name": "vody"
      },
      {
        "amount": "100 g",
        "name": "Čínskej kapusty napa"
      },
      {
        "amount": "",
        "name": "1 Hovädzí bujón"
      },
      {
        "amount": "80 g",
        "name": "Tvrdého tofu,"
      },
      {
        "amount": "65 g",
        "name": "Soba rezancov nakrájaného na kocky"
      },
      {
        "amount": "30 ml",
        "name": "Sójovej omáčky ° 10g jarnej cibuľky"
      },
      {
        "amount": "1 Lyžička",
        "name": "sezamového oleja + čerstvý koriander"
      },
      {
        "amount": "15 ml",
        "name": "Mirinu (ryžového vína) čili vločky"
      },
      {
        "amount": "70 g",
        "name": "Húb nakrájaných na plátky"
      },
      {
        "amount": "50 g",
        "name": "Mrkvy alebo nakladaný"
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "ranajky-acai-miska",
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
        "amount": "",
        "name": "1 Banán"
      },
      {
        "amount": "1 ks",
        "name": "Nakrájaný na plátky a zmrazený)"
      },
      {
        "amount": "100 g",
        "name": "Mrazeného pyré acai"
      },
      {
        "amount": "4 šálky",
        "name": "Čučoriedok (jedno balenie)"
      },
      {
        "amount": "80 g",
        "name": "% šálky jahôd"
      },
      {
        "amount": "20 g",
        "name": "Nesladeného mandľového kokos a lyžica semienok na"
      },
      {
        "amount": "200 ml",
        "name": "Mlieka ozdobu"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-avoka-dovy-toast-s-fetou",
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
        "amount": "2 plátky",
        "name": "Kváskový chlieb"
      },
      {
        "amount": "½ ks",
        "name": "Avokáda"
      },
      {
        "amount": "25 g",
        "name": "Tety"
      },
      {
        "amount": "",
        "name": "3 Prekrojené cherry rajčiny"
      },
      {
        "amount": "",
        "name": "2 Lístky bazalky"
      },
      {
        "amount": "½ ks",
        "name": "Citrónová šťava"
      },
      {
        "amount": "",
        "name": "podľa chuti Čierne koreni"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "ranajky-bana-novo-ovsene-lievance",
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
        "amount": "100 g",
        "name": "Banánov"
      },
      {
        "amount": "70 g",
        "name": "Ovsených vločiek"
      },
      {
        "amount": "4 šálky",
        "name": "Mandľového alebo nízkotučného mlieka"
      },
      {
        "amount": "",
        "name": "1 Vajíčko"
      },
      {
        "amount": "1 ČL",
        "name": "Škoric"
      },
      {
        "amount": "1 ČL",
        "name": "Prášku do pečiva"
      },
      {
        "amount": "100 g",
        "name": "Ovoci"
      },
      {
        "amount": "20 g",
        "name": "Orechové maslo"
      },
      {
        "amount": "",
        "name": "1 P L Javorový sirup"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-bana-novy-chlieb",
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
        "amount": "15 g",
        "name": "Ľanových semienok zmiešaných"
      },
      {
        "amount": "250 ml",
        "name": "So 6 lyžicami vody"
      },
      {
        "amount": "290 g",
        "name": "Celozrnnej hladkej múky"
      },
      {
        "amount": "1 ČL",
        "name": "Lyžička prášku do pečiva"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky sódy bikarbóny"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky škoric"
      },
      {
        "amount": "55 g",
        "name": "Datlí nasekaných nadrobno"
      },
      {
        "amount": "500 g",
        "name": "Popučených banánov"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-bylinkove-vaji-c-ka-s-kyslou-kapustou",
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
        "amount": "2 plátky",
        "name": "Kváskového chleba"
      },
      {
        "amount": "½ ks",
        "name": "Vw avokáda"
      },
      {
        "amount": "½ ks",
        "name": "Citrónová šťava"
      },
      {
        "amount": "1 ČL",
        "name": "Sezamových semienok,"
      },
      {
        "amount": "20 g",
        "name": "Opražených"
      },
      {
        "amount": "60g",
        "name": "Kyslej kapusty"
      },
      {
        "amount": "",
        "name": "4 Veľké vajíčka"
      },
      {
        "amount": "1 ČL",
        "name": "Olivového oleja"
      },
      {
        "amount": "",
        "name": "4 Kôprové výhonky"
      },
      {
        "amount": "20 g",
        "name": "Pažítky"
      },
      {
        "amount": "",
        "name": "8 Výhonkov petržlenovej vňat"
      },
      {
        "amount": "",
        "name": "podľa chuti Soľ a čierne korenie podľa chuti"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-c-ili-stratene-vaji-c-ka",
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
        "amount": "",
        "name": "2 Veľké vajcia"
      },
      {
        "amount": "30 g",
        "name": "Baby špenátu"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky chilli vločiek"
      },
      {
        "amount": "40 g",
        "name": "Šampiňónov, nakrájaných"
      },
      {
        "amount": "1 plátok",
        "name": "Plátok kváskového chleba, opečený"
      },
      {
        "amount": "2 strúčiky",
        "name": "Rozdrvený strúčik cesnaku"
      },
      {
        "amount": "1/2 lyžice",
        "name": "strúhaného parmezánu"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného Vetvička nasekanej petržlenovej vňat"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-c-okola-dova-ran-ajkova-miska",
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
        "amount": "1 ks",
        "name": "Mrazený banán"
      },
      {
        "amount": "1 ks",
        "name": "% šálky nesladeného mandľového"
      },
      {
        "amount": "20 g",
        "name": "Mlieka"
      },
      {
        "amount": "30 g",
        "name": "Odmerka proteínu okvapkani"
      },
      {
        "amount": "1 ČL",
        "name": "Polievková lyžica kakaa"
      },
      {
        "amount": "20 g",
        "name": "Polievková lyžica chia semienok"
      },
      {
        "amount": "",
        "name": "2 hrste Malá hrsť špenátu"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-jahodovy-chia-puding",
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
        "amount": "80 g",
        "name": "Čerstvých jahôd"
      },
      {
        "amount": "1 ks",
        "name": "1/2 banánu"
      },
      {
        "amount": "200 ml",
        "name": "Mandľového mlieka"
      },
      {
        "amount": "",
        "name": "1 Odmerka čokoládového"
      },
      {
        "amount": "30 g",
        "name": "Proteínového prášku"
      },
      {
        "amount": "20 g",
        "name": "Chia semienok"
      },
      {
        "amount": "1 Lyžička",
        "name": "javorového sirupu"
      },
      {
        "amount": "200 ml",
        "name": "Mandľového mlieka"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-kokosovo-poha-nkova-overnight-kas-a",
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
        "amount": "1/2 šálky",
        "name": "pohánkovej krupice (nie"
      },
      {
        "amount": "100 g",
        "name": "Kaše)"
      },
      {
        "amount": "½ ČL",
        "name": "1/4 čajovej lyžičky škoric"
      },
      {
        "amount": "štipka",
        "name": "štipka soli"
      },
      {
        "amount": "100 g",
        "name": "Ovocia"
      },
      {
        "amount": "",
        "name": "1 P L Strúhaného kokosu"
      },
      {
        "amount": "20 g",
        "name": "Chia semienok"
      },
      {
        "amount": "",
        "name": "1 odmerka (30 g) Lyžička vegánskeho proteínu"
      },
      {
        "amount": "200 ml",
        "name": "Kokosové mlieko"
      },
      {
        "amount": "200 ml",
        "name": "Mlieka (alebo iného) (voliteľné)"
      },
      {
        "amount": "20 g",
        "name": "Šálka nesladeného mandľového chia/ orechy/ kúsky čokolády"
      },
      {
        "amount": "200 ml",
        "name": "Mlieka na ozdobu"
      },
      {
        "amount": "250 ml",
        "name": "Šálka vody"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-omeleta-s-kyslou-kapustou",
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
        "amount": "",
        "name": "4 Veľké vajcia"
      },
      {
        "amount": "",
        "name": "8 Vetvičiek petržlenovej vňat"
      },
      {
        "amount": "2 plátky",
        "name": "Kváskového chleba + citrónová šťava"
      },
      {
        "amount": "",
        "name": "1 P L ° 60g nakrájanej kyslej kapusty"
      },
      {
        "amount": "2 ČL",
        "name": "Čajová lyžička opražených"
      },
      {
        "amount": "",
        "name": "4 Vetvičky kôpru sezamových semienok"
      },
      {
        "amount": "20 g",
        "name": "Pažítky"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-ovsena-mrkvova-kas-a",
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
        "amount": "",
        "name": "1 P L Zlatých hrozienok"
      },
      {
        "amount": "1 ČL",
        "name": "Škoric"
      },
      {
        "amount": "",
        "name": "2 P L Gréckeho bieleho jogurtu"
      },
      {
        "amount": "1 ČL",
        "name": "Medu"
      },
      {
        "amount": "",
        "name": "1 Odmerka vanilkového wpi"
      },
      {
        "amount": "30 g",
        "name": "Prášku (whey protein izolát)"
      },
      {
        "amount": "1 ČL",
        "name": "Kokosových lupienkov"
      },
      {
        "amount": "1 ks",
        "name": "malá mrkva, očistená a"
      },
      {
        "amount": "1 ks",
        "name": "Nastrúhaná"
      },
      {
        "amount": "½ šálky",
        "name": "Ovsených vločiek (ženská"
      },
      {
        "amount": "50 g",
        "name": "Porcia) alebo 1 šálka ovsených"
      },
      {
        "amount": "50 g",
        "name": "Vločiek (mužská porcia)"
      },
      {
        "amount": "½ šálky",
        "name": "Čučoriedok"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-ovseny-chia-puding",
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
        "amount": "1 Šálka",
        "name": "nesladeného mandľového"
      },
      {
        "amount": "200 ml",
        "name": "Mlieka (alebo iného)"
      },
      {
        "amount": "",
        "name": "1 Odmerka (30 g) proteínového"
      },
      {
        "amount": "30 g",
        "name": "Proteínový prášok"
      },
      {
        "amount": "80 g",
        "name": "Mrazených čučoriedok"
      },
      {
        "amount": "20 g",
        "name": "Alebo jahôd, prípadne orechy"
      },
      {
        "amount": "1/2 šálky",
        "name": "ovsených vločiek"
      },
      {
        "amount": "",
        "name": "2 P L Chia semienok"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-ovseny-overnight-s-c-uc-oriedkami",
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
        "amount": "1/2 šálky",
        "name": "ovsených vločiek"
      },
      {
        "amount": "štipka",
        "name": "štipka soli"
      },
      {
        "amount": "200 ml",
        "name": "Nízkotučného alebo mandľového mlieka"
      },
      {
        "amount": "150 g",
        "name": "Gréckeho vanilkového jogurtu"
      },
      {
        "amount": "80 g",
        "name": "Čerstvých čučoriedok (alebo rozmrazených bobúľ)"
      },
      {
        "amount": "",
        "name": "1 P L Lyžica medu"
      },
      {
        "amount": "30 g",
        "name": "Odmerka proteínu (voliteľné)"
      },
      {
        "amount": "20 g",
        "name": "Mandle/pekanové orechy (voliteľné)"
      },
      {
        "amount": "200 ml",
        "name": "Štipka soli"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-praz-enica-s-kozi-m-syrom",
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
        "amount": "",
        "name": "2 Vajcia"
      },
      {
        "amount": "",
        "name": "2 hrste Listov baby špenátu"
      },
      {
        "amount": "40g",
        "name": "Húb"
      },
      {
        "amount": "25 g",
        "name": "Kozieho syra"
      },
      {
        "amount": "",
        "name": "na postriekanie Xtra panenský olivový olej v spreji"
      },
      {
        "amount": "1 Lyžička",
        "name": "kajenského korenia na dochuteni"
      },
      {
        "amount": "1 plátok",
        "name": "Plátok celozrnného chleba"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-praz-enica-z-tofu",
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
        "amount": "150 g",
        "name": "Tofu . ½ čl morskej soli"
      },
      {
        "amount": "1 ČL",
        "name": "Olivového oleja . > cl cesnakového prášku"
      },
      {
        "amount": "1 ks",
        "name": "1/4 červenej cibule . a cl mletej rasc"
      },
      {
        "amount": "",
        "name": "½ Červenej papriky . / cl chili prášku"
      },
      {
        "amount": "1 Šálka",
        "name": "špenátu (nasekaného) . ½ cl kurkumy"
      },
      {
        "amount": "",
        "name": "podľa chuti Soľ (ideálne čierna) a čierne korenie"
      },
      {
        "amount": "½ ks",
        "name": "Vs avokáda"
      },
      {
        "amount": "½ šálky",
        "name": "Rajčín (nakrájaných)"
      },
      {
        "amount": "1 Plátok",
        "name": "špaldového/celozrnného"
      },
      {
        "amount": "2 plátky",
        "name": "Toastu"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-protei-nova-kas-a-s-c-uc-oriedkami",
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-sezamovy-losos-na-raz-nom-chlebe",
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
        "amount": "150 g",
        "name": "Údeného lososa"
      },
      {
        "amount": "½ ks",
        "name": "V> avokáda"
      },
      {
        "amount": "2 plátky",
        "name": "Ražného chleba"
      },
      {
        "amount": "½ ks",
        "name": "Pl citrónovej šťavy"
      },
      {
        "amount": "",
        "name": "1 P L Čerstvý kôpor (môže byť aj sušený)"
      },
      {
        "amount": "1 ks",
        "name": "V, červenej cibul"
      },
      {
        "amount": "1 ČL",
        "name": "Sezamových semienok"
      },
      {
        "amount": "",
        "name": "podľa chuti Soľ"
      },
      {
        "amount": "",
        "name": "podľa chuti Čierne koreni"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "ranajky-sladka-kre-mova-kas-a-s-quinoou",
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
        "amount": "",
        "name": "½ P L Javorového sirupu"
      },
      {
        "amount": "",
        "name": "½ P L Tahini"
      },
      {
        "amount": "10 g",
        "name": "Tekvicových semiačok"
      },
      {
        "amount": "10 g",
        "name": "Hrozienok"
      },
      {
        "amount": "200 ml",
        "name": "Nesladeného mandľového mlieka 2 veľké nasekané vlašské orechy"
      },
      {
        "amount": "250 ml",
        "name": "Ys šálky vody (poprípade trochu 2 pl gréckeho jogurtu"
      },
      {
        "amount": "250 ml",
        "name": "Viac mlieka alebo vody ak chcete"
      },
      {
        "amount": "4 šálky",
        "name": "Quinoa vločiek"
      },
      {
        "amount": "",
        "name": "1 P L Mletých ľanových semiačok"
      },
      {
        "amount": "1 Štipka",
        "name": "kurkumy"
      },
      {
        "amount": "4 šálky",
        "name": "Nízkotučného alebo"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-slana-palacinka-s-rukolou-a-s-unkou",
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
        "amount": "2 ks",
        "name": "Vajc"
      },
      {
        "amount": "50 g",
        "name": "Šunky"
      },
      {
        "amount": "20 g",
        "name": "Hladkej múky (alebo pohánkovej múky)"
      },
      {
        "amount": "25 g",
        "name": "Syra"
      },
      {
        "amount": "½ šálky",
        "name": "Rukoly"
      },
      {
        "amount": "1 ČL",
        "name": "Lyžička dijonskej horčic"
      },
      {
        "amount": "½ šálky",
        "name": "Nízkotučného mlieka (alebo rastlinného)"
      },
      {
        "amount": "",
        "name": "podľa chuti Sol a koreni"
      },
      {
        "amount": "",
        "name": "na postriekanie Xtra panenský olivový olej v spreji"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-s-paldova-placka-s-ricottou",
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
        "amount": "",
        "name": "1 Špaldová placka"
      },
      {
        "amount": "",
        "name": "1 Vajíčko"
      },
      {
        "amount": "70 g",
        "name": "Nízkotučnej ricotty"
      },
      {
        "amount": "",
        "name": "1 Hrsť špenátu"
      },
      {
        "amount": "",
        "name": "4 Cherry rajčiny"
      },
      {
        "amount": "1 ks",
        "name": "Červená cibuľa"
      },
      {
        "amount": "½ ČL",
        "name": "Čili"
      },
      {
        "amount": "",
        "name": "1 P L Limetkovej šťavy"
      },
      {
        "amount": "",
        "name": "1 P L nasekaného 1/8 hrsť koriandra"
      },
      {
        "amount": "",
        "name": "1 P L Olivový olej"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-toasty-s-vaji-c-kom-hubami-a-avoka-dom",
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
        "amount": "",
        "name": "2 Vajcia"
      },
      {
        "amount": "2 šálky",
        "name": "Šampiňónov, nakrájaných"
      },
      {
        "amount": "",
        "name": "1 Krajec chleba"
      },
      {
        "amount": "2 plátky",
        "name": "Chlieb, ľubovoľný"
      },
      {
        "amount": "½ ks",
        "name": "1/2 avokáda"
      },
      {
        "amount": "2 - 4 strúčiky",
        "name": "cesnaku, nahrubo"
      },
      {
        "amount": "",
        "name": "2 P L Nasekaných"
      },
      {
        "amount": "",
        "name": "1 P L pl balzamikového alebo"
      },
      {
        "amount": "",
        "name": "1 P L Jablčného octu"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-vega-nske-palacinky",
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
        "amount": "120 g",
        "name": "Pohánkovej múky"
      },
      {
        "amount": "60 g",
        "name": "Mandľovej múky"
      },
      {
        "amount": "",
        "name": "2 P L Oleja"
      },
      {
        "amount": "1 ČL",
        "name": "1čajová lyžička prášku do pečiva  ] čl vanilkového extraktu"
      },
      {
        "amount": "½ ČL",
        "name": "Čajovej lyžičky sódy bikarbóny"
      },
      {
        "amount": "",
        "name": "½ Čajovej lyžičky mletej škorice nahrubo nasekaných"
      },
      {
        "amount": "",
        "name": "½ Čajovej lyžičky kuchynskej soli"
      },
      {
        "amount": "2 Lyžice",
        "name": "ľanového semienka (náhrada nahrubo nasekaných"
      },
      {
        "amount": "",
        "name": "1 P L Vajíčka)"
      },
      {
        "amount": "",
        "name": "1 P L Javorového sirupu"
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-bana-novo-medove-smoothie",
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
        "amount": "1,5 šálky",
        "name": "Ovsených vločiek"
      },
      {
        "amount": "250 ml",
        "name": "Vody"
      },
      {
        "amount": "200 ml",
        "name": "Nízkotučného mlieka"
      },
      {
        "amount": "30 g",
        "name": "Vanilkového proteínu"
      },
      {
        "amount": "1 ks",
        "name": "1/2 mrazeného banánu"
      },
      {
        "amount": "",
        "name": "1 P L Lyžička medu"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky škoric"
      },
      {
        "amount": "20 g",
        "name": "Vlašských orechov"
      },
      {
        "amount": "1 šálka",
        "name": "Ľad"
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
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-c-okola-dove-smoothie",
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
        "amount": "",
        "name": "1 Odmerka čokoládového proteínu (alebo"
      },
      {
        "amount": "1 ČL",
        "name": "Vanilkového + odmerka kakaa)"
      },
      {
        "amount": "1 ks",
        "name": "> mrazeného banánu"
      },
      {
        "amount": "",
        "name": "2 hrste Hrsť špenátu"
      },
      {
        "amount": "1 Šálka",
        "name": "mlieka"
      },
      {
        "amount": "1 šálka",
        "name": "Ľad"
      },
      {
        "amount": "1/3 šálky",
        "name": "ovsených vločiek"
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
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-kokosovo-c-uc-oriedkovy-smoothie-s-datlami",
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
        "amount": "30 g",
        "name": "Wpi (whey proteín izolát) alebo"
      },
      {
        "amount": "30 g",
        "name": "Vegánskeho proteínového prášku"
      },
      {
        "amount": "250 ml",
        "name": "Kokosovej vody"
      },
      {
        "amount": "1 ks",
        "name": "W% stredného mrazeného banánu"
      },
      {
        "amount": "80 g",
        "name": "V4 šálky mrazených čučoriedok"
      },
      {
        "amount": "",
        "name": "1 Odkôstkovaná mediool datľa"
      },
      {
        "amount": "",
        "name": "8 Mandlí"
      },
      {
        "amount": "",
        "name": "3-4 kocky Ľad"
      },
      {
        "amount": "1 ks",
        "name": "Aby bol výsledok čo najviac krémový, banán musí byť poriadne zmrazený"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-kokosovo-ovocny-protei-novy-smoothie",
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
        "amount": "",
        "name": "1 Mrazený banán"
      },
      {
        "amount": "",
        "name": "1 Odmerka proteínového prášku"
      },
      {
        "amount": "1 Šálka",
        "name": "mrazeného bobuľového"
      },
      {
        "amount": "100 g",
        "name": "Ovocia"
      },
      {
        "amount": "200 ml",
        "name": "Nízkotučného mlieka"
      },
      {
        "amount": "10g",
        "name": "Mandlí"
      },
      {
        "amount": "1 Lyžička",
        "name": "chia semienok"
      },
      {
        "amount": "10g",
        "name": "Ovsených vločiek"
      },
      {
        "amount": "10g",
        "name": "Strúhaného kokosu"
      },
      {
        "amount": "30 g",
        "name": "Jahôd"
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
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-snickers-smoothie",
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
        "amount": "1½ šálky",
        "name": "Ľadu"
      },
      {
        "amount": "½ šálky",
        "name": "Nízkotučného mlieka"
      },
      {
        "amount": "½ šálky",
        "name": "Vody"
      },
      {
        "amount": "",
        "name": "1 Odmerka (30g) wpi (whey proteín izolát)"
      },
      {
        "amount": "30 g",
        "name": "Proteínového prášku"
      },
      {
        "amount": "",
        "name": "1 P L Arašidového masla"
      },
      {
        "amount": "2½ čl",
        "name": "Javorového sirupu"
      },
      {
        "amount": "1 ČL",
        "name": "čl kakaa"
      },
      {
        "amount": "1 ČL",
        "name": "Chia semiačok"
      },
      {
        "amount": "½ ČL",
        "name": "Himalájskej ružovej soli"
      },
      {
        "amount": "250 ml",
        "name": "Datle medjool"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-tropicky-smoothie",
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
        "amount": "125 ml",
        "name": "Mandľového mlieka"
      },
      {
        "amount": "30 g",
        "name": "Proteínového prášku"
      },
      {
        "amount": "40 g",
        "name": "Kokosového jogurtu"
      },
      {
        "amount": "",
        "name": "1 Celá marakuja"
      },
      {
        "amount": "60 g",
        "name": "Čerstvého alebo mrazeného manga"
      },
      {
        "amount": "1 ks",
        "name": "1/2 stredne veľkého mrazeného banánu"
      },
      {
        "amount": "1 Lyžička",
        "name": "javorového sirupu"
      },
      {
        "amount": "",
        "name": "1 Polievková lyžica opražených misli"
      },
      {
        "amount": "1 Lyžička",
        "name": "kokosových vločiek"
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
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-zelene-smoothie-s-protei-nom",
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
        "amount": "250 ml",
        "name": "Vody"
      },
      {
        "amount": "30 g",
        "name": "Odmerka proteínu"
      },
      {
        "amount": "",
        "name": "1 odmerka Odmerka zeleného prášku"
      },
      {
        "amount": "",
        "name": "2 hrste Šálka špenátu"
      },
      {
        "amount": "1 ks",
        "name": "Mrazený banán"
      },
      {
        "amount": "",
        "name": "1 P L Lyžička medu"
      },
      {
        "amount": "80 g",
        "name": "Ovsených vločiek"
      },
      {
        "amount": "200 ml",
        "name": "Rastlinného alebo nízkotučného mlieka"
      },
      {
        "amount": "½ šálky",
        "name": "Kociek ľadu"
      },
      {
        "amount": "",
        "name": "3 Vlašské orechy"
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
    "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-bana-novo-ovsene-lievance",
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
        "amount": "100 g",
        "name": "Banánov"
      },
      {
        "amount": "70 g",
        "name": "Ovsených vločiek"
      },
      {
        "amount": "4 šálky",
        "name": "Mandľového alebo nízkotučného mlieka"
      },
      {
        "amount": "",
        "name": "1 Vajíčko"
      },
      {
        "amount": "1 ČL",
        "name": "Škoric"
      },
      {
        "amount": "1 ČL",
        "name": "Prášku do pečiva"
      },
      {
        "amount": "100 g",
        "name": "Ovoci"
      },
      {
        "amount": "20 g",
        "name": "Orechové maslo"
      },
      {
        "amount": "",
        "name": "1 P L Javorový sirup"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-bana-novy-chlieb",
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
        "amount": "15 g",
        "name": "Ľanových semienok zmiešaných"
      },
      {
        "amount": "250 ml",
        "name": "So 6 lyžicami vody"
      },
      {
        "amount": "290 g",
        "name": "Celozrnnej hladkej múky"
      },
      {
        "amount": "1 ČL",
        "name": "Lyžička prášku do pečiva"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky sódy bikarbóny"
      },
      {
        "amount": "",
        "name": "1/2 lyžičky škoric"
      },
      {
        "amount": "55 g",
        "name": "Datlí nasekaných nadrobno"
      },
      {
        "amount": "500 g",
        "name": "Popučených banánov"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-citro-novo-kokosove-gulic-ky",
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
        "amount": "20 g",
        "name": "/2 šálky celých mandlí"
      },
      {
        "amount": "2 šálky",
        "name": "Strúhaného kokosu"
      },
      {
        "amount": "",
        "name": "1 Citrón (postrúhaná kôra a všetka šťava)"
      },
      {
        "amount": "",
        "name": "2 P L Kokosového oleja"
      },
      {
        "amount": "2 Pl",
        "name": "medu"
      },
      {
        "amount": "1 ČL",
        "name": "Vanilkového extraktu"
      },
      {
        "amount": "",
        "name": "2 P L Strúhaný kokos na obaleni"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-c-okola-dove-snickers-datle",
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
        "amount": "",
        "name": "10 Medjool datlí"
      },
      {
        "amount": "½ šálky",
        "name": "Nasekaných kešu orechov"
      },
      {
        "amount": "4 šálky",
        "name": "Kúskov horkej čokolády"
      },
      {
        "amount": "",
        "name": "2 Plarašidového masla"
      },
      {
        "amount": "1 ČL",
        "name": "Kokosového oleja"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-datlovy-kola-c-z-pracli-kov",
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
        "amount": "70 g",
        "name": "Praclíkov (použila som špaldové"
      },
      {
        "amount": "",
        "name": "1 P L Praclíky bez pridaného cukru)"
      },
      {
        "amount": "80 g",
        "name": "Ovsa"
      },
      {
        "amount": "150 g",
        "name": "Datle medjool, bez kôstok"
      },
      {
        "amount": "",
        "name": "2 P L Nahrubo nasekaných"
      },
      {
        "amount": "100 g",
        "name": "Mandľového masla"
      },
      {
        "amount": "40 ml",
        "name": "Čistého javorového sirupu"
      },
      {
        "amount": "30 ml",
        "name": "Mandľového mlieka"
      },
      {
        "amount": "",
        "name": "175 mavých čokoládových"
      },
      {
        "amount": "20 g",
        "name": "Lupienkov"
      },
      {
        "amount": "1 Lyžička",
        "name": "kokosového oleja"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-doma-ca-c-okola-dova-zmrzlina",
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
        "amount": "",
        "name": "1 Mrazený banán"
      },
      {
        "amount": "30 ml",
        "name": "Mandľového mlieka"
      },
      {
        "amount": "1 Lyžička",
        "name": "nesladeného kakaa"
      },
      {
        "amount": "15 g",
        "name": "Proteínového prášku"
      },
      {
        "amount": "10g",
        "name": "Čokoládových lupienkov"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-jahodovy-chia-puding",
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
        "amount": "80 g",
        "name": "Čerstvých jahôd"
      },
      {
        "amount": "1 ks",
        "name": "1/2 banánu"
      },
      {
        "amount": "200 ml",
        "name": "Mandľového mlieka"
      },
      {
        "amount": "",
        "name": "1 Odmerka čokoládového"
      },
      {
        "amount": "30 g",
        "name": "Proteínového prášku"
      },
      {
        "amount": "20 g",
        "name": "Chia semienok"
      },
      {
        "amount": "1 Lyžička",
        "name": "javorového sirupu"
      },
      {
        "amount": "200 ml",
        "name": "Mandľového mlieka"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-mrkvove-muffiny-so-semienkami",
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
        "amount": "200 g",
        "name": "Celozrnnej špaldovej múky"
      },
      {
        "amount": "1 Lyžička",
        "name": "vanilkového extraktu"
      },
      {
        "amount": "20 g",
        "name": "Masla"
      },
      {
        "amount": "",
        "name": "3 Veľké vajcia"
      },
      {
        "amount": "2/3 lyžice",
        "name": "slnečnicových"
      },
      {
        "amount": "",
        "name": "2 Mrkvy, stredne veľké"
      },
      {
        "amount": "30 g",
        "name": "Nastrúhané"
      },
      {
        "amount": "",
        "name": "2 Lyžičky sezamových semienok"
      },
      {
        "amount": "60 g",
        "name": "Gréckeho jogurtu"
      },
      {
        "amount": "",
        "name": "1 cm Mletého zázvoru"
      },
      {
        "amount": "1 Lyžička",
        "name": "prášku do pečiva"
      },
      {
        "amount": "50 g",
        "name": "Medu (alebo javorového sirupu)"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-ovsene-gulic-ky-s-aras-idovy-m-maslom",
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
        "amount": "160 g",
        "name": "Arašidového masla"
      },
      {
        "amount": "120g",
        "name": "Ovsených vločiek"
      },
      {
        "amount": "45 g",
        "name": "Kokosového oleja"
      },
      {
        "amount": "15g",
        "name": "Mletého ľanového semienka"
      },
      {
        "amount": "135 g",
        "name": "Datle medjool, bez kôstok"
      },
      {
        "amount": "",
        "name": "1 Polievková lyžica chia semienok"
      },
      {
        "amount": "25 g",
        "name": "Javorového sirupu"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-ovsene-sus-ienky-s-jablkovy-m-pyre",
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
        "amount": "70 g",
        "name": "Jablkového pyré"
      },
      {
        "amount": "40 g",
        "name": "Špaldovej múky ."
      },
      {
        "amount": "",
        "name": "vajíčko"
      },
      {
        "amount": "12 ČL",
        "name": "Prášku do pečiva"
      },
      {
        "amount": "1 Cl",
        "name": "vanilkového extraktu"
      },
      {
        "amount": "½ ČL",
        "name": "H 4 čl škoric"
      },
      {
        "amount": "100 g",
        "name": "Medu"
      },
      {
        "amount": "120 g",
        "name": "Arašidového masla"
      },
      {
        "amount": "10g",
        "name": "Ovsených vločiek"
      },
      {
        "amount": "20 g",
        "name": "O g masla"
      },
      {
        "amount": "20 g",
        "name": "Arašidového masla)"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-ovseny-chia-puding",
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
        "amount": "1 Šálka",
        "name": "nesladeného mandľového"
      },
      {
        "amount": "200 ml",
        "name": "Mlieka (alebo iného)"
      },
      {
        "amount": "",
        "name": "1 Odmerka (30 g) proteínového"
      },
      {
        "amount": "30 g",
        "name": "Proteínový prášok"
      },
      {
        "amount": "80 g",
        "name": "Mrazených čučoriedok"
      },
      {
        "amount": "20 g",
        "name": "Alebo jahôd, prípadne orechy"
      },
      {
        "amount": "1/2 šálky",
        "name": "ovsených vločiek"
      },
      {
        "amount": "",
        "name": "2 P L Chia semienok"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-palacinky-s-lesny-mi-plodmi",
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
        "amount": "1 ks",
        "name": "Zrelý stredne veľký banán ° 1/2 čl škoric"
      },
      {
        "amount": "1/3 šálky",
        "name": "nízkotučného alebo + štipka soli"
      },
      {
        "amount": "",
        "name": "na postriekanie Mandľového mlieka"
      },
      {
        "amount": "",
        "name": "1 Vajc"
      },
      {
        "amount": "",
        "name": "2 Drvené vlašské orechy na"
      },
      {
        "amount": "60g",
        "name": "Múky ozdobu"
      },
      {
        "amount": "25 g",
        "name": "Miešaných bobúľ, plus ďalšie + lyžica javorového sirupu"
      },
      {
        "amount": "",
        "name": "1 P L Na posypanie alebo medu na ozdobu"
      },
      {
        "amount": "150 g",
        "name": "pl gréckeho jogurtu"
      },
      {
        "amount": "1 čl",
        "name": "vanilky javorového sirupu + malá"
      },
      {
        "amount": "1/2 čl",
        "name": "prášku do pečiva štipka soli"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-protei-novo-datlove-gulic-ky",
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
        "amount": "1,5 šálky",
        "name": "Datle medjool, bez kôstok"
      },
      {
        "amount": "1 Šálka",
        "name": "ovsených vločiek"
      },
      {
        "amount": "1 Šálka",
        "name": "mandľovej múčky"
      },
      {
        "amount": "100 g",
        "name": "Proteínového prášku"
      },
      {
        "amount": "3 Lyžice",
        "name": "prírodného orechového masla"
      },
      {
        "amount": "",
        "name": "2 Lyžičky medu"
      },
      {
        "amount": "1 ČL",
        "name": "Himalájskej ružovej soli"
      },
      {
        "amount": "",
        "name": "2 P L Kokos, sezam, kakao a pod. na obaleni"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-zdrave-ma-tove-gulic-ky",
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
        "amount": "60g",
        "name": "Datle medjool, bez kôstok"
      },
      {
        "amount": "50 g",
        "name": "Mandlí"
      },
      {
        "amount": "10 g",
        "name": "Kakaového prášku"
      },
      {
        "amount": "12 g",
        "name": "Kakaových bôbov"
      },
      {
        "amount": "",
        "name": "1 P L Vody"
      },
      {
        "amount": "štipka",
        "name": "štipka mätovej esenci"
      },
      {
        "amount": "5 g",
        "name": "Strúhaného kokosu"
      },
      {
        "amount": "1 Lyžička",
        "name": "kokosového oleja"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "snack-zdrave-mrkvove-lievance",
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
        "amount": "80 ml",
        "name": "Mlieka"
      },
      {
        "amount": "",
        "name": "1 P L Gréckeho jogurtu"
      },
      {
        "amount": "",
        "name": "1 Veľké vajíčko * 1 čl medu (alebo"
      },
      {
        "amount": "1 ks",
        "name": "> mrkvy (stredne veľkej), javorového sirupu)"
      },
      {
        "amount": "20 g",
        "name": "Postrúhanej"
      },
      {
        "amount": "",
        "name": "20 Gvanilkového proteínu opražených a nasekaných"
      },
      {
        "amount": "23 g",
        "name": "Celozrnnej špaldovej múky"
      },
      {
        "amount": "½ ČL",
        "name": "Cl mletej škoric"
      },
      {
        "amount": "1 ČL",
        "name": "V, cl prášku do pečiva"
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
    "image": "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-platok-z-batatov-a-slaniny",
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
        "amount": "",
        "name": "1 Medium sladké zemiaky, 1 cukina, 4 bacon rashers, 1 cibuľa, 4 vajcia, 1 cup sr múka, 1 cup light syr"
      }
    ],
    "steps": [],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-mini-zeleninove-frittaty",
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
        "amount": "",
        "name": "2 šálkas Sladké zemiaky, 4 vajcia + 2-3 vajce whites, 1/2 red paprika, špenát, basil, feta"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-cukinovy-platok-so-slaninou",
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
        "amount": "",
        "name": "2 Cukina, 1 mrkva, 2 bacon rashers, 5 vajcia, 1/4 cup mlieko, 1 cup sr múka, 1.25 cup light syr"
      }
    ],
    "steps": [],
    "allergens": [
      "dairy",
      "eggs",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "obed-strawberry-chia-protein-pudding",
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
        "amount": "1/4 šálky",
        "name": "chia semienka, 1 lyžička javorového sirupu, 1/4 šálky mandľového mlieka"
      },
      {
        "amount": "1 ks",
        "name": "Top: 1/2 šálky jahody, 1/2 banánu, 1/2 šálky mandľového mlieka, 1 odmerka vegánskeho čokoládového proteínu"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "ranajky-healthy-carrot-cake-pancakes",
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
        "amount": "1 /3 cup",
        "name": "mlieko, 1 vajce, 1/2 mrkva, proteínový prášok, spelt múka, škorica, baking powder"
      },
      {
        "amount": "",
        "name": "1 P L Top: jogurt, med, walnuts"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    "difficulty": "easy"
  },
  {
    "id": "obed-wraps-rye-mountain-bread-turkey",
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
        "amount": "2 plátky",
        "name": "Rye mountain chlieb (turkey)"
      },
      {
        "amount": "100g",
        "name": "Sliced turkey, 2 mountain chlieb wraps, 20g syr, 1/4 avokádo, paradajka, špenát, mayo"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-sweet-potato-fibre-salad",
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
        "amount": "150g",
        "name": "Sladké zemiaky, 1/2 cup wild/brown ryža, 1/2 cup brown šošovica, brokolica, špenát, rocket, cranberries, tekvica seeds"
      },
      {
        "amount": "",
        "name": "1 P L Dressing: olivový olej, dijon, tahini, med, citrón"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-wraps-rye-mountain-bread-ham",
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
        "amount": "2 plátky",
        "name": "Rye mountain chlieb (ham)"
      },
      {
        "amount": "100g",
        "name": "Ham, 2 wraps, syr, avokádo, pineapple, paradajka, špenát, mayo"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-wraps-rye-mountain-bread-chicken",
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
        "amount": "200 g",
        "name": "Rye mountain chlieb (kuracie mäso)"
      },
      {
        "amount": "80g",
        "name": "Kuracie mäso, 2 wraps, syr, avokádo, beetroot, paradajka, špenát, mayo"
      }
    ],
    "steps": [],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "vysoký proteín"
    ],
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-vegan-rice-noodle-salad",
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
        "amount": "150g",
        "name": "Ryža noodles, mrkva, uhorka, red cabbage, spring onions, zázvor"
      },
      {
        "amount": "80 g",
        "name": "Dressing: sesame seeds, javorový sirup, sesame olej, ryža vinegar, tamari, chilli paste"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-zdrave-bolonske-spagety",
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
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-hovadzie-bourguignon",
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
        "amount": "1kg",
        "name": "Diced hovädzie mäso, red wine, kuracie mäso vývar, paradajka paste, sójová omáčka, múka, carrots, potatoes, šampiňóny, thyme"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-vegan-rice-paper-rolls",
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
        "amount": "1 ks",
        "name": "Ryža papers, ryža noodles, lettuce, avokádo, mrkva, uhorka, mango, mint"
      },
      {
        "amount": "20 g",
        "name": "Peanut sauce: arašidové maslo, javorový sirup, limetka, sójová omáčka"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-deconstructed-burger-bowl-v1",
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
        "amount": "220g",
        "name": "Hovädzie mäso mince, 1 vajce, 300g potatoes, cos lettuce, paradajka, pineapple, beetroot, avokádo, pickles"
      },
      {
        "amount": "",
        "name": "1 P L Dressing: dijon, olivový olej, apple cider vinegar, med"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-chicken-teriyaki-soba-noodle-salad",
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
        "amount": "1 ks",
        "name": "Soba noodles, kale, šampiňóny, edamame, broccolini, paprika"
      },
      {
        "amount": "2 strúčiky",
        "name": "Teriyaki: sójová omáčka, sesame olej, mirin, cesnak, med"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-summer-salmon-salad",
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
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-tamari-tempeh-tacos",
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
        "amount": "1 ks",
        "name": "Taco shells, 100g tempeh, asian slaw (cabbage, mrkva, špenát), avokádo, paradajka"
      },
      {
        "amount": "½ ks",
        "name": "Tamari marinade + dressing (apple cider vinegar, sesame olej, limetka, mustard, sriracha)"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-zucchini-vegan-vegetable-fritters-and-salad",
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
        "amount": "1 šálka",
        "name": "Grated cukina, múka, nutritional yeast, spring cibuľa, peas, kukurica"
      },
      {
        "amount": "1 ks",
        "name": "Salad: špenát, paradajka, uhorka, mrkva, olives, avokádo"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-healthy-superfood-fibre-bowl",
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
        "amount": "1 ks",
        "name": "Cukina, tekvica, cos lettuce, paprika, avokádo, spring cibuľa, coriander, mint, macadamias, cherry paradajky, feta"
      },
      {
        "amount": "",
        "name": "1 cm Dressing: zázvor, limetka, med, kokos mlieko"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-crunchy-vegan-tofu-salad",
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
        "amount": "150g",
        "name": "Firm tofu, wild/brown ryža, bean shoots, rocket/špenát, uhorka, mandarin/mango, cibuľa, peanuts"
      },
      {
        "amount": "2 strúčiky",
        "name": "Dressing: cesnak, zázvor, lemongrass, tamari, ryba sauce, citrón, javorový sirup"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-sweet-potato-and-hummus-roll-ups-ve",
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
        "amount": "1 ks",
        "name": "Wholegrain wrap, hummus, sladké zemiaky, mrkva, cabbage, špenát, paprika, sunflower seeds"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-grilled-pork-with-mexican-style-corn-cobs",
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
        "amount": "½ ks",
        "name": "Avokádo-sour smotana-chilli sauce, kukurica cobs, brokolica"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-marinated-asian-garlic-tofu-stir-fry",
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
        "amount": "2 strúčiky",
        "name": "Cesnak tofu stir fry"
      },
      {
        "amount": "2 strúčiky",
        "name": "Firm tofu, hoisin sauce, sójová omáčka, med, zázvor, chilli, cesnak, sesame olej"
      },
      {
        "amount": "80 g",
        "name": "Brokolica, fazule, carrots, cukina, brown ryža"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-veggie-burgers-and-salad-with-tahini",
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
        "amount": "1 ks",
        "name": "Čierna fazuľa, hnedá ryža, vlašské orechy, rasca, paprika, BBQ omáčka, strúhanka"
      },
      {
        "amount": "2 strúčiky",
        "name": "Tahini dressing: tahini, cesnak, jablčný ocot, mandľové mlieko"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-pumpkin-feta-and-beetroot-salad-v",
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
        "amount": "1 ks",
        "name": "Israeli couscous, beetroot, tekvica, cibuľa, mrkva, špenát, feta, walnuts, mint"
      },
      {
        "amount": "",
        "name": "1 P L Dressing: javorový sirup, balsamic, olivový olej, citrón"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "difficulty": "medium"
  },
  {
    "id": "obed-choc-snickers-date",
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
        "amount": "20 g",
        "name": "Medjool dates, peanuts, dark chocolate, arašidové maslo, kokos olej"
      }
    ],
    "steps": [],
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
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    "difficulty": "medium"
  }
];
