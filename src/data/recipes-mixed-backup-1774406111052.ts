// Safe OCR-cleaned + Spoonacular recipes - 2026-03-25T02:26:24.048Z
// Spoonacular: 20 | Original (safe-cleaned): 116 | Total: 136

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
    "id": "spoon-945221",
    "title": "Sledovanie toho, čo jem: arašidové maslo, banán, ovsené raňajky, sušienky so svätojánskym chrobákom/ čokoládovými lupienkami",
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
        "name": "bananas",
        "amount": "2"
      },
      {
        "name": "maslo flavor shortening",
        "amount": "1 tsp"
      },
      {
        "name": "chocolate chips",
        "amount": "0.25 cup"
      },
      {
        "name": "creamy peanut maslo",
        "amount": "0.33333334 cup"
      },
      {
        "name": "nuts",
        "amount": "0.25 cup"
      },
      {
        "name": "oatmeal",
        "amount": "1.5 cups"
      },
      {
        "name": "unsweetened applesauce",
        "amount": "0.6666667 cup"
      },
      {
        "name": "vanilla extract",
        "amount": "1 tsp"
      }
    ],
    "steps": [
      "Predhrejte rúru na 350 stupňov. Vo veľkej miske premiešajte banánovú kašu a arašidové maslo, kým sa úplne nezmiešajú, potom pridajte jablkovú omáčku, vanilkový proteínový prášok a extrakt(y) ~ znova premiešajte, kým sa všetko"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free"
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
        "name": "cream syr",
        "amount": "8 oz"
      },
      {
        "name": "strawberries",
        "amount": "1.25 cup"
      },
      {
        "name": "vanilla extract",
        "amount": "1 tsp"
      },
      {
        "name": "lemon juice",
        "amount": "1 tsp"
      },
      {
        "name": "granulated cukor",
        "amount": "2 tbsp"
      },
      {
        "name": "múka",
        "amount": "1.5 cups"
      },
      {
        "name": "cocoa powder",
        "amount": "0.25 cup"
      },
      {
        "name": "kosher soľ",
        "amount": "0.125 tsp"
      }
    ],
    "steps": [
      "Pokyny\n\nAko si vyrobiť jahodovú krémovú syrovú náplň\n\nDo stredne veľkej miešacej misy pridajte smotanový syr, jahody, vanilkový extrakt, citrónovú šťavu a granulovaný cukor.\n\nPoužite ručný mixér, drevený"
    ],
    "allergens": [],
    "dietary": [
      "lacto ovo vegetarian"
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
    "title": "Jednoduché domáce jablkové lívance",
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
        "name": "all purpose múka",
        "amount": "1 cup"
      },
      {
        "name": "apple",
        "amount": "1 cup"
      },
      {
        "name": "baking powder",
        "amount": "1.5 teaspoons"
      },
      {
        "name": "cinnamon",
        "amount": "1 teaspoon"
      },
      {
        "name": "vajce",
        "amount": "1"
      },
      {
        "name": "mlieko",
        "amount": "0.33333334 cup"
      },
      {
        "name": "mlieko",
        "amount": "1.5 tablespoons"
      },
      {
        "name": "powdered cukor",
        "amount": "2 cups"
      }
    ],
    "steps": [
      "Zmiešajte múku, cukor, soľ, prášok do pečiva, škoricu. Miešajte mlieko a vajcia, až kým sa nespoja. Zložte do jablka. Nalejte olej do panvice tak, aby bola približne 1 1/2 hlboká. Zahrievajte olej na vysokej úrovni. Olej je rea"
    ],
    "allergens": [],
    "dietary": [
      "lacto ovo vegetarian"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/775666-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-640275",
    "title": "Krabie koláče Vajcia Benedikt",
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
        "name": "celery",
        "amount": "0.5 cup"
      },
      {
        "name": "bread crumbs",
        "amount": "0.33333334 cup"
      },
      {
        "name": "vajces",
        "amount": "4"
      },
      {
        "name": "muffins",
        "amount": "3"
      },
      {
        "name": "knorr hollandaise sauce mix",
        "amount": "1 package"
      },
      {
        "name": "hot sauce",
        "amount": "3 drops"
      },
      {
        "name": "lump crab meat",
        "amount": "1 pound"
      },
      {
        "name": "mayonnaise",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Pripravte si krabie koláče: Cibuľu a zeler uvarte v 4 polievkových lyžiciach masla na miernom ohni, kým nezmäknú a preneste do misy. Vmiešajte kraby a drobky chleba.V malej miske zmiešajte majonézu"
    ],
    "allergens": [],
    "dietary": [
      "pescatarian"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/640275-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-716432",
    "title": "Finger Foods: Frittata Muffiny",
    "category": "ranajky",
    "description": "Finger Foods: Frittata Muffiny môžu byť dobrým receptom na rozšírenie vášho raňajkového repertoáru. Toto odporúčanie",
    "prepTime": 45,
    "servings": 1,
    "calories": 655,
    "protein": 49,
    "carbs": 13,
    "fat": 45,
    "fiber": 4,
    "ingredients": [
      {
        "name": "broccoli",
        "amount": "0.75 cup"
      },
      {
        "name": "chives",
        "amount": "2 T"
      },
      {
        "name": "t cream",
        "amount": "1"
      },
      {
        "name": "vajces",
        "amount": "6"
      },
      {
        "name": "orange korenie",
        "amount": "0.33333334 cup"
      },
      {
        "name": "soľ and pepper",
        "amount": "1 serving"
      },
      {
        "name": "cheddar syr",
        "amount": "0.5 cup"
      },
      {
        "name": "rajčina",
        "amount": "0.33333334 cup"
      }
    ],
    "steps": [
      "Návod na prípravu dostupný v originálnom recepte."
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "lacto ovo vegetarian",
      "primal",
      "ketogenic"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716432-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-776505",
    "title": "Klobása & Pepperoni Stromboli",
    "category": "obed",
    "description": "Klobása & Pepperoni Stromboli trvá približne 28 minút od začiatku do konca. Tento recept slúži 6. On",
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
        "name": "sausage",
        "amount": "1 lb"
      },
      {
        "name": "parmesan syr",
        "amount": "1 cup"
      },
      {
        "name": "korenieoni",
        "amount": "1 package"
      },
      {
        "name": "roll of pizza dough",
        "amount": "1 ball"
      },
      {
        "name": "pizza sauce",
        "amount": "2 cups"
      },
      {
        "name": "mozzarella syr",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Taliansku klobásu uvaríme na strednej panvici až do zapečenia. Sceďte na papierové utierky a rozdrobte na malé kúsky. Rúru zohrejte na 450 stupňov. Papier na pečenie položte na plech a jemne premiešajte. Cesto rozvaľkajte"
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
        "name": "korenie",
        "amount": "1 tsp"
      },
      {
        "name": "maslo",
        "amount": "0.6666667 cup"
      },
      {
        "name": "celery",
        "amount": "1 cup"
      },
      {
        "name": "celery seed",
        "amount": "0.5 tsp"
      },
      {
        "name": "chicken broth",
        "amount": "1.75 cups"
      },
      {
        "name": "múka",
        "amount": "0.6666667 cups"
      },
      {
        "name": "cesnak powder",
        "amount": "0.5 tsp"
      },
      {
        "name": "green beans",
        "amount": "20 oz"
      }
    ],
    "steps": [
      "Krok 1: Rúru predhrejte na 425 stupňov. Roztopte maslo a pridajte zeler a cibuľu do stredného hrnca a osmažte na strednom ohni asi 8 minút.Krok 2: Vmiešajte 2/3 šálky múky, soľ a korenie, zeler s"
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715467-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715419",
    "title": "Pomalý sporák Pikantné horúce krídla",
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
        "name": "brown cukor",
        "amount": "0.5 cup"
      },
      {
        "name": "cayenne korenie",
        "amount": "1 tsp"
      },
      {
        "name": "regular chicken wings",
        "amount": "2 pounds"
      },
      {
        "name": "cesnak",
        "amount": "1 Tbsp"
      },
      {
        "name": "louisiana hot sauce",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Áno, tieto sa z nejakého dôvodu nazývajú PIKANTNÉ horúce krídla. Rád pridávam hnedý cukor, aby som im dodal trochu sladšiu chuť, ale je to zďaleka vynikajúci korenistý recept viac ako čokoľvek iné. Ak chcete začať, premiešajte"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free"
    ],
    "tags": [
      "American"
    ],
    "image": "https://img.spoonacular.com/recipes/715419-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-997285",
    "title": "Balenia kreviet a špargľovej fólie s cesnakovou citrónovo-maslovou omáčkou",
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
        "name": "asparagus",
        "amount": "1 lb"
      },
      {
        "name": "maslo",
        "amount": "6 Tbsp"
      },
      {
        "name": "chicken broth",
        "amount": "3 Tbsp"
      },
      {
        "name": "fresh parsley",
        "amount": "2 Tbsp"
      },
      {
        "name": "cesnak",
        "amount": "4 tsp"
      },
      {
        "name": "lemon juice",
        "amount": "1.5 Tbsp"
      },
      {
        "name": "lemon zest",
        "amount": "2 tsp"
      },
      {
        "name": "soľ and pepper",
        "amount": "4 servings"
      }
    ],
    "steps": [
      "Predhrejte gril na stredne vysokú teplotu (asi 400 - 425 stupňov). Odrežte 4 listy 14 x 12 palcov silnej hliníkovej fólie a potom položte každý kus samostatne na dosku.\nRozdeľte krevety medzi balíčky v blízkosti cen"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "primal",
      "pescatarian"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/997285-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715421",
    "title": "Syrové kurča Enchilada Quinoa Casserole",
    "category": "obed",
    "description": "Cheesy Chicken Enchilada Quinoa Casserole môže byť práve ten mexický recept, ktorý hľadáte. On",
    "prepTime": 30,
    "servings": 4,
    "calories": 594,
    "protein": 34,
    "carbs": 68,
    "fat": 24,
    "fiber": 18,
    "ingredients": [
      {
        "name": "avocado",
        "amount": "1 small"
      },
      {
        "name": "korenie",
        "amount": "0.5 tsp"
      },
      {
        "name": "black beans",
        "amount": "15 oz"
      },
      {
        "name": "canned rajčinaes",
        "amount": "10 oz"
      },
      {
        "name": "chili powder",
        "amount": "0.5 tsp"
      },
      {
        "name": "quinoa",
        "amount": "1 cup"
      },
      {
        "name": "cumin",
        "amount": "0.5 tsp"
      },
      {
        "name": "verde enchilada sauce",
        "amount": "10 oz"
      }
    ],
    "steps": [
      "Ak chcete začať, ohrejte rúru na 350 a pripravte si plech na pečenie 8x8. Quinou uvaríme podľa návodu. Ak ste tak ešte neurobili, uvarte a nastrúhajte kuracie prsia. Pri stredne veľkom miešaní"
    ],
    "allergens": [],
    "dietary": [
      "gluten free"
    ],
    "tags": [
      "Mexican"
    ],
    "image": "https://img.spoonacular.com/recipes/715421-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-776505",
    "title": "Klobása & Pepperoni Stromboli",
    "category": "vecera",
    "description": "Klobása & Pepperoni Stromboli trvá približne 28 minút od začiatku do konca. Tento recept slúži 6. On",
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
        "name": "sausage",
        "amount": "1 lb"
      },
      {
        "name": "parmesan syr",
        "amount": "1 cup"
      },
      {
        "name": "korenieoni",
        "amount": "1 package"
      },
      {
        "name": "roll of pizza dough",
        "amount": "1 ball"
      },
      {
        "name": "pizza sauce",
        "amount": "2 cups"
      },
      {
        "name": "mozzarella syr",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Taliansku klobásu uvaríme na strednej panvici až do zapečenia. Sceďte na papierové utierky a rozdrobte na malé kúsky. Rúru zohrejte na 450 stupňov. Papier na pečenie položte na plech a jemne premiešajte. Cesto rozvaľkajte"
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
    "category": "vecera",
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
        "name": "korenie",
        "amount": "1 tsp"
      },
      {
        "name": "maslo",
        "amount": "0.6666667 cup"
      },
      {
        "name": "celery",
        "amount": "1 cup"
      },
      {
        "name": "celery seed",
        "amount": "0.5 tsp"
      },
      {
        "name": "chicken broth",
        "amount": "1.75 cups"
      },
      {
        "name": "múka",
        "amount": "0.6666667 cups"
      },
      {
        "name": "cesnak powder",
        "amount": "0.5 tsp"
      },
      {
        "name": "green beans",
        "amount": "20 oz"
      }
    ],
    "steps": [
      "Krok 1: Rúru predhrejte na 425 stupňov. Roztopte maslo a pridajte zeler a cibuľu do stredného hrnca a osmažte na strednom ohni asi 8 minút.Krok 2: Vmiešajte 2/3 šálky múky, soľ a korenie, zeler s"
    ],
    "allergens": [],
    "dietary": [],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/715467-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715419",
    "title": "Pomalý sporák Pikantné horúce krídla",
    "category": "vecera",
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
        "name": "brown cukor",
        "amount": "0.5 cup"
      },
      {
        "name": "cayenne korenie",
        "amount": "1 tsp"
      },
      {
        "name": "regular chicken wings",
        "amount": "2 pounds"
      },
      {
        "name": "cesnak",
        "amount": "1 Tbsp"
      },
      {
        "name": "louisiana hot sauce",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Áno, tieto sa z nejakého dôvodu nazývajú PIKANTNÉ horúce krídla. Rád pridávam hnedý cukor, aby som im dodal trochu sladšiu chuť, ale je to zďaleka vynikajúci korenistý recept viac ako čokoľvek iné. Ak chcete začať, premiešajte"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free"
    ],
    "tags": [
      "American"
    ],
    "image": "https://img.spoonacular.com/recipes/715419-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-997285",
    "title": "Balenia kreviet a špargľovej fólie s cesnakovou citrónovo-maslovou omáčkou",
    "category": "vecera",
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
        "name": "asparagus",
        "amount": "1 lb"
      },
      {
        "name": "maslo",
        "amount": "6 Tbsp"
      },
      {
        "name": "chicken broth",
        "amount": "3 Tbsp"
      },
      {
        "name": "fresh parsley",
        "amount": "2 Tbsp"
      },
      {
        "name": "cesnak",
        "amount": "4 tsp"
      },
      {
        "name": "lemon juice",
        "amount": "1.5 Tbsp"
      },
      {
        "name": "lemon zest",
        "amount": "2 tsp"
      },
      {
        "name": "soľ and pepper",
        "amount": "4 servings"
      }
    ],
    "steps": [
      "Predhrejte gril na stredne vysokú teplotu (asi 400 - 425 stupňov). Odrežte 4 listy 14 x 12 palcov silnej hliníkovej fólie a potom položte každý kus samostatne na dosku.\nRozdeľte krevety medzi balíčky v blízkosti cen"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "primal",
      "pescatarian"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/997285-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715421",
    "title": "Syrové kurča Enchilada Quinoa Casserole",
    "category": "vecera",
    "description": "Cheesy Chicken Enchilada Quinoa Casserole môže byť práve ten mexický recept, ktorý hľadáte. On",
    "prepTime": 30,
    "servings": 4,
    "calories": 594,
    "protein": 34,
    "carbs": 68,
    "fat": 24,
    "fiber": 18,
    "ingredients": [
      {
        "name": "avocado",
        "amount": "1 small"
      },
      {
        "name": "korenie",
        "amount": "0.5 tsp"
      },
      {
        "name": "black beans",
        "amount": "15 oz"
      },
      {
        "name": "canned rajčinaes",
        "amount": "10 oz"
      },
      {
        "name": "chili powder",
        "amount": "0.5 tsp"
      },
      {
        "name": "quinoa",
        "amount": "1 cup"
      },
      {
        "name": "cumin",
        "amount": "0.5 tsp"
      },
      {
        "name": "verde enchilada sauce",
        "amount": "10 oz"
      }
    ],
    "steps": [
      "Ak chcete začať, ohrejte rúru na 350 a pripravte si plech na pečenie 8x8. Quinou uvaríme podľa návodu. Ak ste tak ešte neurobili, uvarte a nastrúhajte kuracie prsia. Pri stredne veľkom miešaní"
    ],
    "allergens": [],
    "dietary": [
      "gluten free"
    ],
    "tags": [
      "Mexican"
    ],
    "image": "https://img.spoonacular.com/recipes/715421-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-715419",
    "title": "Pomalý sporák Pikantné horúce krídla",
    "category": "snack",
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
        "name": "brown cukor",
        "amount": "0.5 cup"
      },
      {
        "name": "cayenne korenie",
        "amount": "1 tsp"
      },
      {
        "name": "regular chicken wings",
        "amount": "2 pounds"
      },
      {
        "name": "cesnak",
        "amount": "1 Tbsp"
      },
      {
        "name": "louisiana hot sauce",
        "amount": "0.5 cup"
      }
    ],
    "steps": [
      "Áno, tieto sa z nejakého dôvodu nazývajú PIKANTNÉ horúce krídla. Rád pridávam hnedý cukor, aby som im dodal trochu sladšiu chuť, ale je to zďaleka vynikajúci korenistý recept viac ako čokoľvek iné. Ak chcete začať, premiešajte"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free"
    ],
    "tags": [
      "American"
    ],
    "image": "https://img.spoonacular.com/recipes/715419-556x370.jpg",
    "difficulty": "easy"
  },
  {
    "id": "spoon-775585",
    "title": "Crockpot „vyprážaná“ fazuľa",
    "category": "snack",
    "description": "Recept Crockpot „Refried“ Beans sa dá pripraviť približne za 45 minút. Tento recept slúži 16. Watchin",
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
        "name": "cumin",
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
        "name": "pinto beans",
        "amount": "2 lbs"
      },
      {
        "name": "up soľ",
        "amount": "1 Tbsp"
      },
      {
        "name": "water",
        "amount": "10 cups"
      }
    ],
    "steps": [
      "Fazuľu opláchnite v cedníku. Vyberte si všetky zlé fazule. Zmiešajte všetky ingrediencie v hrnci. Odstráňte všetky plávajúce fazule. Zakryte a varte pri VYSOKEJ teplote 4 hodiny a pri NÍZKEJ TEPLOTE 2 hodiny. Objavte a znova"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free",
      "lacto ovo vegetarian",
      "vegan"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/775585-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-716426",
    "title": "Karfiol, hnedá ryža a zeleninová vyprážaná ryža",
    "category": "snack",
    "description": "Recept na karfiol, hnedú ryžu a zeleninovú vyprážanú ryžu je pripravený približne za 30 minút a je de",
    "prepTime": 30,
    "servings": 8,
    "calories": 248,
    "protein": 7,
    "carbs": 29,
    "fat": 13,
    "fiber": 6,
    "ingredients": [
      {
        "name": "grapeseed oil",
        "amount": "2 tablespoons"
      },
      {
        "name": "coconut oil",
        "amount": "2 tablespoons"
      },
      {
        "name": "scallions",
        "amount": "7"
      },
      {
        "name": "cesnak",
        "amount": "5 cloves"
      },
      {
        "name": "cauliflower",
        "amount": "1 head"
      },
      {
        "name": "brown ryža",
        "amount": "3 cups"
      },
      {
        "name": "broccoli",
        "amount": "2 cups"
      },
      {
        "name": "peas",
        "amount": "1 cup"
      }
    ],
    "steps": [
      "Odstráňte tvrdú stopku karfiolu a rezervujte na iné použitie. Pomocou kuchynského robota lúpajte karfiolové ružičky, až kým sa nepodobajú ryži alebo kuskusu. Mali by ste skončiť s približne štyrmi šálkami „cau"
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free",
      "lacto ovo vegetarian",
      "vegan"
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
    "title": "Jablková omáčka Crockpot",
    "category": "snack",
    "description": "Ak máte približne 45 minút na strávenie v kuchyni, jablková omáčka Crockpot môže byť veľkolepá",
    "prepTime": 45,
    "servings": 3,
    "calories": 412,
    "protein": 2,
    "carbs": 107,
    "fat": 1,
    "fiber": 18,
    "ingredients": [
      {
        "name": "apples",
        "amount": "15 small"
      },
      {
        "name": "cinnamon",
        "amount": "0.5 t"
      },
      {
        "name": "juice of lemon",
        "amount": "1"
      },
      {
        "name": "orange juice",
        "amount": "0.25 c"
      },
      {
        "name": "vanilla",
        "amount": "1 T"
      }
    ],
    "steps": [
      "Návod na prípravu dostupný v originálnom recepte."
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free",
      "paleolithic",
      "lacto ovo vegetarian",
      "primal",
      "whole 30",
      "vegan"
    ],
    "tags": [],
    "image": "https://img.spoonacular.com/recipes/716431-556x370.jpg",
    "difficulty": "medium"
  },
  {
    "id": "spoon-715543",
    "title": "Domáce guacamole",
    "category": "snack",
    "description": "Ak chcete pridať viac bezlepkových, bezmliečnych, paleolitických a lakto ovo vegetariánskych receptov",
    "prepTime": 45,
    "servings": 4,
    "calories": 170,
    "protein": 2,
    "carbs": 11,
    "fat": 15,
    "fiber": 7,
    "ingredients": [
      {
        "name": "avocados",
        "amount": "2"
      },
      {
        "name": "cilantro",
        "amount": "1.5 Tbsp"
      },
      {
        "name": "juice of lime",
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
        "name": "roma rajčina",
        "amount": "1"
      }
    ],
    "steps": [
      "Návod na prípravu dostupný v originálnom recepte."
    ],
    "allergens": [],
    "dietary": [
      "gluten free",
      "dairy free",
      "paleolithic",
      "lacto ovo vegetarian",
      "primal",
      "whole 30",
      "vegan"
    ],
    "tags": [
      "Mexican"
    ],
    "image": "https://img.spoonacular.com/recipes/715543-556x370.jpg",
    "difficulty": "medium"
  },
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
        "name": "Turmeriku tuku",
        "amount": "½ ČL"
      },
      {
        "name": "Čerstvého koriandru",
        "amount": "½ šálky"
      }
    ],
    "steps": [
      "Medzitým si priprav šalát: kukuricu uvar podľa inštrukcií na obale a nechaj",
      "Keď sa kuracie mäso domarinovalo, upeč ho na BBG alebo na nepriľnavej panvici. Servíruj so šalátom a kura prelej zvyškom mangovej omáčky."
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
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "/images/recipes/obed-bbg-kura-s-mango-salsou.jpg",
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
        "name": "Paradajkovej pasty",
        "amount": "2 ks"
      },
      {
        "name": "Mletého hovädzieho mäsa",
        "amount": "500 g"
      },
      {
        "name": "Olivový olej v spreji",
        "amount": "na postriekanie"
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
        "name": "Soľ, korenie a petržlen",
        "amount": "podľa chuti"
      },
      {
        "name": "Čerstvá vňať na ozdobu",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-bata-tovy-kola-c-z-mlete-ho-ma-sa.jpg",
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
        "name": "Batáty, ošúpané",
        "amount": "150 g"
      },
      {
        "name": "Nakrájaných",
        "amount": "100 g"
      },
      {
        "name": "Cl dijónskej horčic",
        "amount": "1"
      },
      {
        "name": "Hnedej šošovice . | cl medu",
        "amount": "1 PL"
      },
      {
        "name": "Šálka špenátu . shire |",
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
        "name": "Hrste sušených brusníc",
        "amount": "½"
      },
      {
        "name": "Tekvicových semiačok",
        "amount": "10g"
      },
      {
        "name": "Gréckeho jogurtu alebo",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-bata-tovy-s-ala-t-s-ryz-ou-a-s-os-ovicou.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-falafel-wrap",
    "title": "Falafel wrap",
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
        "name": "Hummusu",
        "amount": "1 PL"
      },
      {
        "name": "Falafel guličiek",
        "amount": "150 g"
      },
      {
        "name": "Rajčina",
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
        "name": "Tabouli",
        "amount": "1,5 PL"
      },
      {
        "name": "Pl tzatziki alebo gréckeho jogurtu",
        "amount": "150 g"
      },
      {
        "name": "Limetková šťava",
        "amount": "½ ks"
      }
    ],
    "steps": [
      "Na wrap si rovnomerne potri hummus a naukladaj naň falafel. Pridaj zvyšné"
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
    "image": "/images/recipes/obed-falafel-wrap.jpg",
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
        "name": "1/2 zväzku koriandra",
        "amount": "1 PL nasekaného"
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
    "image": "/images/recipes/obed-grilovany-mexicky-s-ala-t.jpg",
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
        "name": "Nízkotučnej majonézy",
        "amount": "½ PL"
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
    "image": "/images/recipes/obed-grilovany-sendvic-s-hova-dzi-m-ma-som.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-hova-dzie-na-zelenine",
    "title": "Hovädzie na zelenine",
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
        "name": "Hovädzieho mäsa",
        "amount": "1 kg"
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
    "image": "/images/recipes/obed-hova-dzie-na-zelenine.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-hova-dzie-s-tekvicovou-kas-ou",
    "title": "Hovädzie s tekvicovou kašou",
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
        "name": "Medu",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-hova-dzie-s-tekvicovou-kas-ou.jpg",
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
        "name": "1/4 zväzku koriandra",
        "amount": "1 PL nasekaného"
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
        "name": "Medu",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-kuracia-sezamova-panvic-ka.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-mexicke-tortilly",
    "title": "Mexické tortilly",
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
        "name": "Taco korenie na tortilly . na čo máš chuť",
        "amount": "podľa chuti"
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
    "image": "/images/recipes/obed-mexicke-tortilly.jpg",
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
      "Postrúhanú zeleninu posyp soľou a nechaj 5 minút postáť. Potom zo zeleniny vytlač čo najviac vody a vráť ich späť do misy. Pridaj cibuľu, bylinky, vajíčka, ricottu, múku a trochu čierneho korenia. Dobre premiešaj.",
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
    "image": "/images/recipes/obed-placky-s-ricottou-cukinou-a-bata-tmi.jpg",
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
        "name": "rasc",
        "amount": "1/2 lyžičky"
      },
      {
        "name": "Paradajky nakrájané na kocky",
        "amount": "2"
      },
      {
        "name": "1/4 zväzku bazalky",
        "amount": "1 PL nasekaného"
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
        "name": "1/2 mrkvy * olivový olej v spreji",
        "amount": "na postriekanie"
      },
      {
        "name": "1/3 šálky hrášku",
        "amount": "podľa chuti"
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
    "image": "/images/recipes/obed-plnene-sladke-zemiaky.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-poke-miska-s-kuraci-m-ma-som",
    "title": "Poke miska s kuracím mäsom",
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
        "name": "V4 hrste čerstvého koriandru",
        "amount": "1 PL nasekaného"
      },
      {
        "name": "Medu",
        "amount": "1 PL"
      },
      {
        "name": "Sójovej omáčky",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-poke-miska-s-kuraci-m-ma-som.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-slany-kola-c-z-bata-tov-a-slaniny",
    "title": "Slaný koláč z batátov a slaniny",
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
        "name": "Cl cesnaku",
        "amount": "1"
      },
      {
        "name": "Vody",
        "amount": "250 ml"
      },
      {
        "name": "Pažítky",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-slany-kola-c-z-bata-tov-a-slaniny.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-slany-kola-c-z-tekvice-a-fety",
    "title": "Slaný koláč z tekvice a fety",
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
        "name": "Balzamikového octu",
        "amount": "1 PL"
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
      "Tekvicu. Pokrop ju olivovým olejom, Posyp soľou, čierným korením, trochou tymiánu a peč 30 minút, alebo domäkka.",
      "Medzitým si na panvici zohrej olivový olej a opeč nadrobno nakrájanú cibuľu dohneda. Pridaj balzamikový ocot a smaž ďalšiu 1 - 2 minúty. Nechaj na strane a vsamostatnej mise si zmiešaj vajíčka, mlieko, soľ a čierne korenie.",
      "Obdížnikový plech vystli papierom na pečenie alebo vymasti olivovým olejom. Na spodok daj upečenú tekvicu, pridaj tymián, sušené rajčiny, upečenú cibuľu, špenát a prelej to vajíčkovou zmesou. Plech trochu pobúchaj po kuchynskej linke a zatras ním, aby sa zmes rozliala po celom plechu. Kúsky feta syru daj navrch a posyp zvyšnými bylinkami.",
      "Plech vlož do rúry a zníž teplotu na 180%C. Peč 20 - 30 minút, alebo"
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
    "image": "/images/recipes/obed-slany-kola-c-z-tekvice-a-fety.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-steak-s-pec-enou-zeleninou",
    "title": "Steak s pečenou zeleninou",
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
        "name": "Niekoľko baby zemiakov",
        "amount": "1 PL"
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
      "Kým sa zelenina opeká, posyp steaky z oboch strán soľou, korením a bylinkami.",
      "Do uzatvárateľnej nádoby pridaj trochu červeného vínneho octu s rovnakým objemom extra panenského olivového oleja a poriadne posyp soľou a korením. Niekoľko sekúnd intenzívne pretrepávaj, kým sa všetko dobre nespojí. Jednu alebo dve polievkové lyžice tohto dresingu spoj so šalátom, paradajkami, paprikou a uhorkou. Rozdeľ na dve časti a servíruj.",
      "Steaky opeč na panvici 3 - 4 minúty z oboch strán alebo kým nie sú pekne prepečené. Pečenú zeleninu rozdeľ na taniere a podávaj so šalátom"
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
      "vegetariánske"
    ],
    "image": "/images/recipes/obed-steak-s-pec-enou-zeleninou.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-s-ala-t-z-tekvice-fety-a-c-ervenej-repy",
    "title": "Šalát z tekvice, fety a červenej repy",
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
        "name": "1 žálka take",
        "amount": "0"
      },
      {
        "name": "Malej červenej cibule + % citróna",
        "amount": "1 ks"
      },
      {
        "name": "mrkva",
        "amount": "podľa chuti"
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
        "name": "Olivový olej v spreji",
        "amount": "na postriekanie"
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
    "image": "/images/recipes/obed-s-ala-t-z-tekvice-fety-a-c-ervenej-repy.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-s-pena-tovo-brokolicove-cestoviny-s-pestom",
    "title": "Špenátovo brokolicové cestoviny s pestom",
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
        "name": "Kapusta",
        "amount": "⅛ zväzku"
      },
      {
        "name": "1/4 zväzku čerstvej bazalky",
        "amount": "1 PL nasekaného"
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
        "name": "Olivového oleja",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-s-pena-tovo-brokolicove-cestoviny-s-pestom.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-tofu-buddha-bowl",
    "title": "Tofu Buddha bowl",
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
        "name": "Čerstvá) olivoý olej",
        "amount": "1 PL"
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
      "Predhrej rúru na 180 stupňov a nakrájaj tekvicu na malé kúsky. Polož ju na plech vystlaný papierom na pečenie, postriekaj olivovým olejom a môžeš pridať i trochu škorice.",
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
    "image": "/images/recipes/obed-tofu-buddha-bowl.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-u-dena-ryba-s-letnou-zeleninou",
    "title": "Údená ryba s letnou zeleninou",
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
        "name": "Opláchnutej hnedej ryže + 2 lyžičky olivového oleja",
        "amount": "65 g"
      },
      {
        "name": "Divokej ryže, opláchnutej + 1/2 citrón nakrájaný na",
        "amount": "30 g"
      },
      {
        "name": "(alebo len extra hnedej ryže) mesiačiky",
        "amount": "80 g"
      },
      {
        "name": "Baby špenátu",
        "amount": "80 g"
      },
      {
        "name": "soli",
        "amount": "1/2 lyžička"
      },
      {
        "name": "Mletej papriky",
        "amount": "1 ks"
      },
      {
        "name": "Soľ a korenie podľa chuti",
        "amount": "podľa chuti"
      }
    ],
    "steps": [
      "Predhrej rúru na 190°C a plech vystli papierom na pečenie.",
      "V hrnci daj variť ryžu na mierny oheň a prikrytú ju var 30 minút. Odstav z ohňa a nechaj 5 minút odstáť, potom ryžu popuč vidličkou.",
      "Kým sa ryža varí, osuš rybu, potri ju polovicou olivového oleja a okoreň y y y IU Pp | paprikou, soľou a korením. Polož na plech a peč 15 - 20 minút alebo kým ryba nie je upečená.",
      "Keď je ryba takmer hotová, pridaj na panvicu zvyšný olej a cesnak a opraž asi 30 sekúnd až minútu. Dochuť soľou a korením a restuj ďalšiu minútu.",
      "Pridaj na panvicu fazuľu, špenát a tekvicové semienka a peč, kým sa semienka neopečú a fazuľa nezmäkne a nezíska jasne zelenú farbu, približne",
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
      "vegánske",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "/images/recipes/obed-u-dena-ryba-s-letnou-zeleninou.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-vega-nsky-burger-z-bata-tov",
    "title": "Vegánsky burger z batátov",
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
        "name": "G batátov",
        "amount": "150"
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
        "name": "V, pl mletej rasce",
        "amount": "1 PL nasekaného"
      },
      {
        "name": "Mletého koriandru",
        "amount": "½ PL"
      },
      {
        "name": "Soľ a čierne koreni",
        "amount": "podľa chuti"
      },
      {
        "name": "rajčinového chutney",
        "amount": "2/3 pl"
      },
      {
        "name": "olivový olej",
        "amount": "1 PL"
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
      "Pridaj upečenú fašírku, rajčinu a špenát. Podávaj teplé."
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
    "image": "/images/recipes/obed-vega-nsky-burger-z-bata-tov.jpg",
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
        "name": "Citrónovej šťavy",
        "amount": "1 PL"
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
        "name": "Čl štipľavej čili pasty",
        "amount": "1"
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
    "image": "/images/recipes/obed-vega-nsky-s-ala-t-s-ryz-ovy-mi-rezancami.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-vega-nsky-wrap-s-bata-tmi-a-humusom",
    "title": "Vegánsky wrap s batátmi a humusom",
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
        "name": "Sol a koreni",
        "amount": "podľa chuti"
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
      "Do stredu wrapu rozotri hummus, pridaj pečené sladké zemiaky, papriku, špenát, mrkvu, kapustu a slnečnicové semienka a ozdob soľou a korením.",
      "Zroluj wrap a upevni ho špáradlom. Nechaj ho stuhnúť v chladničke (približne 20 minút). Nakrájaj na kolieska a podávaj."
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
    "image": "/images/recipes/obed-vega-nsky-wrap-s-bata-tmi-a-humusom.jpg",
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
        "name": "Nadrobno",
        "amount": "2 PL"
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
    "image": "/images/recipes/obed-zdrave-bolon-ske-s-pagety.jpg",
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
        "name": "Xtra panenský olivový olej",
        "amount": "1 PL"
      },
      {
        "name": "Soľ a čierne koreni",
        "amount": "podľa chuti"
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
    "image": "/images/recipes/obed-zdrave-zeleninove-muffiny.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-zelene-kari-s-krevetami",
    "title": "Zelené kari s krevetami",
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
        "name": "1/2 zväzku koriandra",
        "amount": "1 PL nasekaného"
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
      "Priprav si ryžu podľa návodu.",
      "Nakrájaj cuketu, mrkvu a papriku.",
      "Vo woku si na strednom ohni rozohrej olej, pridaj cesnak, zázvor, karí pastu a var, kým všetko nerozvonia. Potom pridaj všetku zeleninu a var 5 minút, kým nezmäkne, ale zostane chrumkavá.",
      "Pridaj krevety a smaž 2 - 3 minúty, kým nie sú takmer uvarené.",
      "Nakoniec pridaj kokosové mlieko a var ďalších 5 minút.",
      "Hotové kari podávaj ozdobené lístkami koriandra a limetkou."
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "vegetariánske",
      "vysoký proteín"
    ],
    "image": "/images/recipes/obed-zelene-kari-s-krevetami.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-hubova-polievka",
    "title": "Hubová polievka",
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
        "name": "sušeného tymiánu",
        "amount": "1/2 lyžičky"
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
      "Do tlakového hrnca vlož cibuľu, mrkvu, zeler, cesnak, huby, fazuľu, ryžu, zeleninový vývar a bylinky. Zapni tlakový hrniec alebo manuálne nastav vysoký tlak a var 45 minút.",
      "Po dokončení odstráň pokrievku a vyber bobkový list.",
      "V samostatnej miske zmiešaj kukuričnú múku a mandľové mlieko.",
      "Na instantnom hrnci zvoľ nastavenie restovania, akonáhle začne polievka vrieť, pridaj rozmiešanú kukuričnú múku. Var 5 minút alebo kým polievka"
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
    "image": "/images/recipes/obed-hubova-polievka.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-kuracia-polievka-na-mexicky-s-ty-l",
    "title": "Kuracia polievka na mexický štýl",
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
        "name": "Cibule, nasekanej * 1 čl mletej rasc",
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
        "name": "Čiernej fazul",
        "amount": "100 g"
      },
      {
        "name": "Koriander",
        "amount": "1 PL nasekaného"
      },
      {
        "name": "Gréckeho jogurtu",
        "amount": "1 PL"
      },
      {
        "name": "Kuracie mäso. zatvor sáčok a poriadne ním zatras, aby sa mäso obalilo v",
        "amount": "200 g"
      }
    ],
    "steps": [
      "Do pomalého variča pridaj kuracie mäso, papriku, cibuľu, mrkvu, rajčiny, kukuricu, čiernu fazuľu, taco omáčku a vývar. Premiešaj a var na nízkom móde 6 - 8 hodín a na vysokom 3 - 4 hodiny.",
      "Keď sa polievka dovarí, vyber kuracie mäso a nakrájaj ho na kúsky. Vráť kúsky mäsa do polievky a premiešaj. Na vrch pridaj jogurt a čerstvý koriander (prípadne aj kukuričné tortilla chipsy)."
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
    "image": "/images/recipes/obed-kuracia-polievka-na-mexicky-s-ty-l.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-kuracia-polievka-na-s-ty-l-pho",
    "title": "Kuracia polievka na štýl pho",
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
    "image": "/images/recipes/obed-kuracia-polievka-na-s-ty-l-pho.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-miso-polievka-s-jac-men-om",
    "title": "Miso polievka s jačmeňom",
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
        "name": "Miso pasty kocky",
        "amount": "1,5 PL"
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
      "Na poslednú polhodinu varenia pridaj edamame a mangold.",
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
    "image": "/images/recipes/obed-miso-polievka-s-jac-men-om.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-paradajkova-polievka-s-fazul-ou",
    "title": "Paradajková polievka s fazuľou",
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
        "name": "Coleslaw šalátu",
        "amount": "¼ porcie"
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
    "allergens": [],
    "dietary": [
      "bezlepkové",
      "bezlaktózové"
    ],
    "tags": [
      "bezlepkové",
      "bezlaktózové",
      "polievka"
    ],
    "image": "/images/recipes/obed-paradajkova-polievka-s-fazul-ou.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-polievka-z-tekvice-a-bata-tov",
    "title": "Polievka z tekvice a batátov",
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
        "name": "Olivový olej v spreji",
        "amount": "na postriekanie"
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
        "name": "Medu",
        "amount": "1 PL"
      },
      {
        "name": "štipka soli a korenia podľa chuti",
        "amount": "podľa chuti"
      },
      {
        "name": "Gréckeho jogurtu na podávani",
        "amount": "2 PL"
      }
    ],
    "steps": [
      "Nakrájaj tekvicu, sladký zemiak a mrkvu na podobne veľké kocky a polož ich na plech na pečenie. Zeleninu osoľ, okoreň, postriekaj olejom a pokvapkaj medom. Peč 35 minút na 200 stupňoch.",
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
    "image": "/images/recipes/obed-polievka-z-tekvice-a-bata-tov.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-s-os-ovicova-kari-polievka",
    "title": "Šošovicová kari polievka",
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
        "name": "Cl sójovej omáčky",
        "amount": "1"
      }
    ],
    "steps": [
      "Do hrnca pridaj mrkvu, zeler, cibuľu a cesnak s trochou vody (aby sa zelenina nelepila). Var nad stredným ohňom 5 - 6 minút, vodu pridaj podľa",
      "Pridaj korenie a var 1 - 2 minúty.",
      "Potom pridaj Šošovicu, nasekané rajčiny, kokosové mlieko a vývar. Priveď k varu a nechaj variť ďalších 20 - 25 minút. Občas premiešaj, aby sa polievka nepripálila.",
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
    "image": "/images/recipes/obed-s-os-ovicova-kari-polievka.jpg",
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
    "image": "/images/recipes/obed-vega-nska-s-os-ovicova-polievka.jpg",
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
    "image": "/images/recipes/obed-vy-var-na-a-zijsky-s-ty-l.jpg",
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
      "Všetky prísady vlož do mixéra a pridaj mlieko a jogurt. Mixuj, kým nebude hladké a rovnomerne rozmixované. V prípade potreby pridaj viac mlieka.",
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
    "image": "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy",
    "pdfPath": "/assets/recipes/ranajky/Acai%20miska.pdf"
  },
  {
    "id": "ranajky-avoka-dovy-toast-s-fetou",
    "title": "Avokádový toast s fetou",
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
        "name": "Čierne koreni",
        "amount": "podľa chuti"
      }
    ],
    "steps": [
      "Chlieb si opeč v hriankovači, prípadne na panvici. Rozotri naň avokádo a rozdrob na vrch fetu a bazalku. Vytlač na toast citrónovú šťavu a popráš čiernym korením. Podávaj s cherry rajčinami.",
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
    "image": "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=500&fit=crop&q=80",
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
        "name": "Javorový sirup",
        "amount": "1 PL"
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
    "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-bana-novy-chlieb",
    "title": "Banánový chlieb",
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
        "name": "sódy bikarbóny",
        "amount": "1/2 lyžičky"
      },
      {
        "name": "škoric",
        "amount": "1/2 lyžičky"
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
      "Do misky pridaj múku, sódu bikarbónu, prášok do pečiva, škoricu a premiešaj. Na záver pridaj datle, popučené banány, ľanové semienka a dôklade premiešaj celú zmes.",
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
    "image": "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-bylinkove-vaji-c-ka-s-kyslou-kapustou",
    "title": "Bylinkové vajíčka s kyslou kapustou",
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
        "name": "Soľ a čierne korenie podľa chuti",
        "amount": "podľa chuti"
      }
    ],
    "steps": [
      "Na nepriľnavej panvici si zohrej olej a pridaj nahrubo nasekané bylinky. Peč",
      "1 minútu a pridaj vajíčka. Urob si z nich praženicu alebo ich nechaj piecť",
      "Chlieb najprv opeč v toastovači, potom ho natri avokádom a posyp sezamovými semienkami. Polej trochou citrónovej šťavy.",
      "Vajíčka polož navrch avokáda a servíruj s kyslou kapustou. dochuť zvyšnými bylinkami, citrónovou šťavou a soľou."
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
    "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80",
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
        "name": "Veľké vajcia",
        "amount": "2"
      },
      {
        "name": "Baby špenátu",
        "amount": "30 g"
      },
      {
        "name": "chilli vločiek",
        "amount": "1/2 lyžičky"
      },
      {
        "name": "Šampiňónov, nakrájaných",
        "amount": "40 g"
      },
      {
        "name": "Plátok kváskového chleba, opečený",
        "amount": "1 plátok"
      },
      {
        "name": "Rozdrvený strúčik cesnaku",
        "amount": "2 strúčiky"
      },
      {
        "name": "strúhaného parmezánu",
        "amount": "1/2 lyžice"
      },
      {
        "name": "Vetvička nasekanej petržlenovej vňat",
        "amount": "1 PL nasekaného"
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
    "image": "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&h=500&fit=crop&q=80",
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
    "image": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-jahodovy-chia-puding",
    "title": "Jahodový chia puding",
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
      },
      {
        "name": "1 odmerka čokoládového proteínového prášku",
        "amount": "30 g"
      }
    ],
    "steps": [
      "Najskôr nasyp do nádoby chia semienka, Potom prilej mandľové mlieko, javorový sirup a zľahka premiešaj.",
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
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-kokosovo-poha-nkova-overnight-kas-a",
    "title": "Kokosovo pohánková overnight kaša",
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
        "name": "1/4 čajovej lyžičky škoric",
        "amount": "½ ČL"
      },
      {
        "name": "štipka soli",
        "amount": "štipka"
      },
      {
        "name": "Ovocia",
        "amount": "100 g"
      },
      {
        "name": "Strúhaného kokosu",
        "amount": "1 PL"
      },
      {
        "name": "Chia semienok",
        "amount": "20 g"
      },
      {
        "name": "Lyžička vegánskeho proteínu",
        "amount": "1 odmerka (30 g)"
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
      },
      {
        "name": "Pohánková krupica (nie kaša)",
        "amount": "½ šálky (100 g)"
      }
    ],
    "steps": [
      "V miske zmiešaj pohánkovú krupicu, chia semienka, mlieko, vodu, vanilkový extrakt, škoricu a soľ. Prikryte ju fóliou a nechaj cez noc v chladničke.",
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
    "image": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80",
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
        "name": "° 60g nakrájanej kyslej kapusty",
        "amount": "1 PL"
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
      "Na avokádo naservíruj vajcia, bokom polož kyslú kapustu a dochuť zvyšnými bylinkami, citrónovou šťavou a soľou."
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
    "image": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy",
    "pdfPath": "/assets/recipes/ranajky/Omeleta%20s%20kyslou%20kapustou.pdf"
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
        "name": "Zlatých hrozienok",
        "amount": "1 PL"
      },
      {
        "name": "Škoric",
        "amount": "1 ČL"
      },
      {
        "name": "Gréckeho bieleho jogurtu",
        "amount": "2 PL"
      },
      {
        "name": "Medu",
        "amount": "1 ČL"
      },
      {
        "name": "Odmerka vanilkového wpi",
        "amount": "1"
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
    "image": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-ovseny-chia-puding",
    "title": "Ovsený chia puding",
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
        "name": "Odmerka (30 g) proteínového",
        "amount": "1"
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
        "name": "Chia semienok",
        "amount": "2 PL"
      }
    ],
    "steps": [
      "Do proteínového šejkra alebo mixéra pridaj mlieko a potom proteínový prášok a pretrep, kým sa prášok nerozpustí.",
      "Do samostatnej nádoby pridaj ovsené vločky, chia semienka, ovocie alebo orechy a zalej ich proteínovým mliekom. Nechaj v chladničke cez noc."
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
    "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-ovseny-overnight-s-c-uc-oriedkami",
    "title": "Ovsený overnight s čučoriedkami",
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
        "name": "štipka soli",
        "amount": "štipka"
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
        "name": "Lyžica medu",
        "amount": "1 PL"
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
    "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-praz-enica-s-kozi-m-syrom",
    "title": "Praženica s kozím syrom",
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
        "name": "Xtra panenský olivový olej v spreji",
        "amount": "na postriekanie"
      },
      {
        "name": "Lyžička kajenského korenia na dochuteni",
        "amount": "1"
      },
      {
        "name": "Plátok celozrnného chleba",
        "amount": "1 plátok"
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
    "image": "https://images.unsplash.com/photo-1606479109936-6b7fffeb9e53?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-praz-enica-z-tofu",
    "title": "Praženica z tofu",
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
        "name": "Soľ (ideálne čierna) a čierne korenie",
        "amount": "podľa chuti"
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
    "image": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80",
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
    "ingredients": [
      {
        "name": "Ovsené vločky",
        "amount": "½ šálky"
      },
      {
        "name": "Voda",
        "amount": "250 ml"
      },
      {
        "name": "Škorica",
        "amount": "½ ČL"
      },
      {
        "name": "Proteínový prášok",
        "amount": "1 odmerka (30 g)"
      },
      {
        "name": "Čerstvé čučoriedky",
        "amount": "100 g"
      },
      {
        "name": "Javorový sirup",
        "amount": "1 PL"
      },
      {
        "name": "Citrónová šťava",
        "amount": "½ ČL"
      },
      {
        "name": "Rastlinné mlieko",
        "amount": "100 ml"
      },
      {
        "name": "Rastlinný jogurt",
        "amount": "2 PL"
      },
      {
        "name": "Hrozienka",
        "amount": "1 PL"
      },
      {
        "name": "Vlašské orechy",
        "amount": "10 g"
      }
    ],
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
    "image": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-sezamovy-losos-na-raz-nom-chlebe",
    "title": "Sezamový losos na ražnom chlebe",
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
        "name": "Čerstvý kôpor (môže byť aj sušený)",
        "amount": "1 PL"
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
        "name": "Soľ",
        "amount": "podľa chuti"
      },
      {
        "name": "Čierne koreni",
        "amount": "podľa chuti"
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
    "image": "https://images.unsplash.com/photo-1616279969856-759f316a32d4?w=800&h=500&fit=crop&q=80",
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
        "name": "Javorového sirupu",
        "amount": "½ PL"
      },
      {
        "name": "Tahini",
        "amount": "½ PL"
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
        "name": "Mletých ľanových semiačok",
        "amount": "1 PL"
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
    "image": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-slana-palacinka-s-rukolou-a-s-unkou",
    "title": "Slaná palacinka s rukolou a šunkou",
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
        "name": "Sol a koreni",
        "amount": "podľa chuti"
      },
      {
        "name": "Xtra panenský olivový olej v spreji",
        "amount": "na postriekanie"
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
    "image": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-s-paldova-placka-s-ricottou",
    "title": "Špaldová placka s ricottou",
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
        "name": "Limetkovej šťavy",
        "amount": "1 PL"
      },
      {
        "name": "1/8 hrsť koriandra",
        "amount": "1 PL nasekaného"
      },
      {
        "name": "Olivový olej",
        "amount": "1 PL"
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
    "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-toasty-s-vaji-c-kom-hubami-a-avoka-dom",
    "title": "Toasty s vajíčkom, hubami a avokádom",
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
        "name": "Nasekaných",
        "amount": "2 PL"
      },
      {
        "name": "pl balzamikového alebo",
        "amount": "1 PL"
      },
      {
        "name": "Jablčného octu",
        "amount": "1 PL"
      }
    ],
    "steps": [
      "Na panvici si zohrej olej a priprav vajíčka podľa vlastnej chuti. Hotové vajíčka odlož bokom.",
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
    "image": "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-vega-nske-palacinky",
    "title": "Vegánske palacinky",
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
        "name": "Oleja",
        "amount": "2 PL"
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
        "name": "Vajíčka)",
        "amount": "1 PL"
      },
      {
        "name": "Javorového sirupu",
        "amount": "1 PL"
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
    "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80",
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
        "name": "Ovsených vločiek",
        "amount": "153 šálky"
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
        "name": "Lyžička medu",
        "amount": "1 PL"
      },
      {
        "name": "škoric",
        "amount": "1/2 lyžičky"
      },
      {
        "name": "Vlašských orechov",
        "amount": "20 g"
      },
      {
        "name": "Ľad",
        "amount": "1 šálka"
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
    "image": "/images/recipes/smoothie-bana-novo-medove-smoothie.jpg",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-c-okola-dove-smoothie",
    "title": "Čokoládové smoothie",
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
        "name": "Odmerka čokoládového proteínu (alebo",
        "amount": "1"
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
        "name": "Ľad",
        "amount": "1 šálka"
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
    "image": "/images/recipes/smoothie-c-okola-dove-smoothie.jpg",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-kokosovo-c-uc-oriedkovy-smoothie-s-datlami",
    "title": "Kokosovo čučoriedkový smoothie s datlami",
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
        "name": "Ľad",
        "amount": "3-4 kocky"
      },
      {
        "name": "Aby bol výsledok čo najviac krémový, banán musí byť poriadne zmrazený",
        "amount": "1 ks"
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
    "image": "/images/recipes/smoothie-kokosovo-c-uc-oriedkovy-smoothie-s-datlami.jpg",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-kokosovo-ovocny-protei-novy-smoothie",
    "title": "Kokosovo ovocný proteínový smoothie",
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
        "name": "Odmerka proteínového prášku",
        "amount": "1"
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
      "Mrazený banán, proteínový prášok, mrazené bobuľové ovocie a mlieko vlož do mixéra a rozmixuj dohladka. V závislosti od konzistencie môžeš pridať o niečo viac mlieka.",
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
    "image": "/images/recipes/smoothie-kokosovo-ovocny-protei-novy-smoothie.jpg",
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
        "name": "Odmerka (30g) wpi (whey proteín izolát)",
        "amount": "1"
      },
      {
        "name": "Proteínového prášku",
        "amount": "30 g"
      },
      {
        "name": "Arašidového masla",
        "amount": "1 PL"
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
    "image": "/images/recipes/smoothie-snickers-smoothie.jpg",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-tropicky-smoothie",
    "title": "Tropický smoothie",
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
    "image": "/images/recipes/smoothie-tropicky-smoothie.jpg",
    "difficulty": "easy"
  },
  {
    "id": "smoothie-zelene-smoothie-s-protei-nom",
    "title": "Zelené smoothie s proteínom",
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
        "name": "Lyžička medu",
        "amount": "1 PL"
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
      "Všetky prísady vlož do mixéra a rozmixuj do hladka."
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
    "image": "/images/recipes/smoothie-zelene-smoothie-s-protei-nom.jpg",
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
        "name": "Javorový sirup",
        "amount": "1 PL"
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
    "image": "/images/recipes/snack-bana-novo-ovsene-lievance.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-bana-novy-chlieb",
    "title": "Banánový chlieb",
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
        "name": "sódy bikarbóny",
        "amount": "1/2 lyžičky"
      },
      {
        "name": "škoric",
        "amount": "1/2 lyžičky"
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
      "Do misky pridaj múku, sódu bikarbónu, prášok do pečiva, škoricu a premiešaj. Na záver pridaj datle, popučené banány, ľanové semienka a dôklade premiešaj celú zmes.",
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
    "image": "/images/recipes/snack-bana-novy-chlieb.jpg",
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
        "name": "Kokosového oleja",
        "amount": "2 PL"
      },
      {
        "name": "Pl medu",
        "amount": "2"
      },
      {
        "name": "Vanilkového extraktu",
        "amount": "1 ČL"
      },
      {
        "name": "Strúhaný kokos na obaleni",
        "amount": "2 PL"
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
    "image": "/images/recipes/snack-citro-novo-kokosove-gulic-ky.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-c-okola-dove-snickers-datle",
    "title": "Čokoládové snickers datle",
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
      "Datle odkôstkuj - narež ich na strane a vyber kôstku tak, aby ti v datli ostala dierka. Namiesto kôstky vlož do datlí asi V2 lyžičky arašidového masla. Pridaj nasekané kešu orechy.",
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
    "image": "/images/recipes/snack-c-okola-dove-snickers-datle.jpg",
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
        "name": "Praclíkov (použila som špaldové",
        "amount": "70 g"
      },
      {
        "name": "Praclíky bez pridaného cukru)",
        "amount": "1 PL"
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
        "name": "Nahrubo nasekaných",
        "amount": "2 PL"
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
    "image": "/images/recipes/snack-datlovy-kola-c-z-pracli-kov.jpg",
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
    "image": "/images/recipes/snack-doma-ca-c-okola-dova-zmrzlina.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-jahodovy-chia-puding",
    "title": "Jahodový chia puding",
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
        "name": "Odmerka čokoládového",
        "amount": "1"
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
      "Najskôr nasyp do nádoby chia semienka, Potom prilej mandľové mlieko, javorový sirup a zľahka premiešaj.",
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
    "image": "/images/recipes/snack-jahodovy-chia-puding.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-mrkvove-muffiny-so-semienkami",
    "title": "Mrkvové muffiny so semienkami",
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
        "name": "slnečnicových",
        "amount": "2/3 lyžice"
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
      "Vo ďalšej miske vyšľahaj vajcia, jogurt a vanilku dohladka. Pridaj roztopené maslo s medom a premiešaj. Tekutú zmes pridaj k suchým prísadám a dobre premiešaj, aby sa spojili. Do zmesi pomaly vmiešaj strúhanú mrkvu a potom ju lyžicou vlož do pripravených formičiek na muffiny.",
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
    "image": "/images/recipes/snack-mrkvove-muffiny-so-semienkami.jpg",
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
    "image": "/images/recipes/snack-ovsene-gulic-ky-s-aras-idovy-m-maslom.jpg",
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
        "name": "Jablkového pyré",
        "amount": "70 g"
      },
      {
        "name": "Špaldovej múky . | vajíčko",
        "amount": "40 g"
      },
      {
        "name": "Prášku do pečiva",
        "amount": "12 ČL"
      },
      {
        "name": "Cl vanilkového extraktu",
        "amount": "1"
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
    "image": "/images/recipes/snack-ovsene-sus-ienky-s-jablkovy-m-pyre.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-ovseny-chia-puding",
    "title": "Ovsený chia puding",
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
        "name": "Odmerka (30 g) proteínového",
        "amount": "1"
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
        "name": "Chia semienok",
        "amount": "2 PL"
      }
    ],
    "steps": [
      "Do proteínového šejkra alebo mixéra pridaj mlieko a potom proteínový prášok a pretrep, kým sa prášok nerozpustí.",
      "Do samostatnej nádoby pridaj ovsené vločky, chia semienka, ovocie alebo orechy a zalej ich proteínovým mliekom. Nechaj v chladničke cez noc."
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
    "image": "/images/recipes/snack-ovseny-chia-puding.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-palacinky-s-lesny-mi-plodmi",
    "title": "Palacinky s lesnými plodmi",
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
        "name": "Mandľového mlieka",
        "amount": "na postriekanie"
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
        "name": "Na posypanie alebo medu na ozdobu",
        "amount": "1 PL"
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
      "Vajcia, mlieko, banán a vanilku vlož do kuchynského robota a mixuj",
      "V druhej miske zmiešaj všetky suché prísady. Potom do nich pomaly prilievaj zmes z mixéra a dôkladne premiešaj. Pridaj čučoriedky a premiešaj.",
      "Zohrej rúru na 160 stupňov. Panvicu postriekaj olejom a nechaj ju zohriať.",
      "Potom naber zmes na panvicu a nechajte ju piecť. Keď sa na palacinke objavia bublinky, obráť ju a peč ďalších 60 sekúnd. Každú palacinku vlož do rúry, aby sa udržala teplá, kým budeš piecť zvyšok.",
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
    "image": "/images/recipes/snack-palacinky-s-lesny-mi-plodmi.jpg",
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
        "name": "Kokos, sezam, kakao a pod. na obaleni",
        "amount": "2 PL"
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
    "image": "/images/recipes/snack-protei-novo-datlove-gulic-ky.jpg",
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
        "name": "Vody",
        "amount": "1 PL"
      },
      {
        "name": "štipka mätovej esenci",
        "amount": "štipka"
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
    "image": "/images/recipes/snack-zdrave-ma-tove-gulic-ky.jpg",
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
        "name": "Mlieka",
        "amount": "80 ml"
      },
      {
        "name": "Gréckeho jogurtu",
        "amount": "1 PL"
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
    "image": "/images/recipes/snack-zdrave-mrkvove-lievance.jpg",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-ranajkova-prazenica-z-tofu",
    "title": "Raňajková praženica z tofu",
    "category": "ranajky",
    "description": "Chutné raňajky - vhodné pre vegánov",
    "prepTime": 15,
    "servings": 1,
    "calories": 375,
    "protein": 23,
    "carbs": 42,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Extra-firm tofu, 1 tsp olivový olej, 1/4 red cibuľa, 1/4 red paprika, 1 cup špenát",
        "amount": "150g"
      },
      {
        "name": "Sauce: 1/2 tsp sea soľ, 1/2 tsp cesnak powder, 1/2 tsp cumin, 1/4 tsp chili powder, 1/4 tsp turmeric",
        "amount": "podľa chuti"
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
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy",
    "pdfPath": "/assets/recipes/ranajky/Pra%C5%BEenica%20z%20tofu.pdf"
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
        "name": "Medium sladké zemiaky, 1 cukina, 4 bacon rashers, 1 cibuľa, 4 vajcia, 1 cup sr múka, 1 cup light syr",
        "amount": "1"
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
    "image": "https://images.unsplash.com/photo-1606479109936-6b7fffeb9e53?w=800&h=500&fit=crop&q=80",
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
        "name": "Sladké zemiaky, 4 vajcia + 2-3 vajce whites, 1/2 red paprika, špenát, basil, feta",
        "amount": "2 šálkas"
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
    "image": "https://images.unsplash.com/photo-1608137378238-3bcefa435b82?w=800&h=500&fit=crop&q=80",
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
        "name": "Cukina, 1 mrkva, 2 bacon rashers, 5 vajcia, 1/4 cup mlieko, 1 cup sr múka, 1.25 cup light syr",
        "amount": "2"
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
    "image": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "obed-strawberry-chia-protein-pudding",
    "title": "Strawberry Chia Protein Pudding",
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
        "name": "/4 cup chia semienka, 1 tsp javorový sirup, 1/4 cup mandle mlieko",
        "amount": "1"
      },
      {
        "name": "Top: 1/2 cup jahody, 1/2 banán, 1/2 cup mandle mlieko, 1 scoop vegan choc protein",
        "amount": "1 ks"
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
    "image": "/images/recipes/obed-strawberry-chia-protein-pudding.jpg",
    "difficulty": "medium"
  },
  {
    "id": "ranajky-healthy-carrot-cake-pancakes",
    "title": "Healthy Carrot Cake Pancakes",
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
        "name": "/3 cup mlieko, 1 vajce, 1/2 mrkva, proteínový prášok, spelt múka, škorica, baking powder",
        "amount": "1"
      },
      {
        "name": "Top: jogurt, med, walnuts",
        "amount": "1 PL"
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
    "image": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "ranajky-healthy-vegan-tofu-scramble-gf-ve",
    "title": "Healthy Vegan Tofu Scramble (GF, VE)",
    "category": "ranajky",
    "description": "Chutné raňajky - vhodné pre vegánov",
    "prepTime": 15,
    "servings": 1,
    "calories": 375,
    "protein": 23,
    "carbs": 42,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Extra-firm tofu, 1/2 tbsp olivový olej, 1/4 red cibuľa, 1/2 paprika, špenát, šampiňóny, kale",
        "amount": "150g"
      },
      {
        "name": "Sauce: sea soľ, cesnak powder, cumin, chili powder, turmeric",
        "amount": "podľa chuti"
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
      "rýchle"
    ],
    "image": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80",
    "difficulty": "easy"
  },
  {
    "id": "obed-wraps-rye-mountain-bread-turkey",
    "title": "Wraps - Rye Mountain Bread (Turkey)",
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
    "image": "/images/recipes/obed-wraps-rye-mountain-bread-turkey.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-sweet-potato-fibre-salad",
    "title": "Sweet Potato Fibre Salad",
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
        "name": "Dressing: olivový olej, dijon, tahini, med, citrón",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-sweet-potato-fibre-salad.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-wraps-rye-mountain-bread-ham",
    "title": "Wraps - Rye Mountain Bread (Ham)",
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
    "image": "/images/recipes/obed-wraps-rye-mountain-bread-ham.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-wraps-rye-mountain-bread-chicken",
    "title": "Wraps - Rye Mountain Bread (Chicken)",
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
    "steps": [],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "dietary": [],
    "tags": [
      "vysoký proteín"
    ],
    "image": "/images/recipes/obed-wraps-rye-mountain-bread-chicken.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-vegan-rice-noodle-salad",
    "title": "Vegan Rice Noodle Salad",
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
    "image": "/images/recipes/obed-vegan-rice-noodle-salad.jpg",
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
    "ingredients": [
      {
        "name": "Celozrnné špagety",
        "amount": "200 g"
      },
      {
        "name": "Mleté hovädzie mäso",
        "amount": "150 g"
      },
      {
        "name": "Cibuľa",
        "amount": "1 ks"
      },
      {
        "name": "Cesnak",
        "amount": "2 strúčiky"
      },
      {
        "name": "Paradajkový pretlak",
        "amount": "200 g"
      },
      {
        "name": "Olivový olej",
        "amount": "2 PL"
      },
      {
        "name": "Bazalka",
        "amount": "10 g"
      },
      {
        "name": "Soľ a korenie",
        "amount": "podľa chuti"
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
    "image": "/images/recipes/obed-zdrave-bolonske-spagety.jpg",
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
        "name": "Diced hovädzie mäso, red wine, kuracie mäso vývar, paradajka paste, sójová omáčka, múka, carrots, potatoes, šampiňóny, thyme",
        "amount": "1kg"
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
    "image": "/images/recipes/obed-hovadzie-bourguignon.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-vegan-rice-paper-rolls",
    "title": "Vegan Rice Paper Rolls",
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
    "image": "/images/recipes/obed-vegan-rice-paper-rolls.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-deconstructed-burger-bowl-v1",
    "title": "Deconstructed Burger Bowl (v1)",
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
        "name": "Dressing: dijon, olivový olej, apple cider vinegar, med",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-deconstructed-burger-bowl-v1.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-chicken-teriyaki-soba-noodle-salad",
    "title": "Chicken Teriyaki Soba Noodle Salad",
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
    "image": "/images/recipes/obed-chicken-teriyaki-soba-noodle-salad.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-summer-salmon-salad",
    "title": "Summer Salmon Salad",
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
        "name": "Losos (filé)",
        "amount": "150 g"
      },
      {
        "name": "Zmiešaný šalát",
        "amount": "100 g"
      },
      {
        "name": "Cherry paradajky",
        "amount": "100 g"
      },
      {
        "name": "Uhorka",
        "amount": "1 ks"
      },
      {
        "name": "Avokádo",
        "amount": "½ ks"
      },
      {
        "name": "Olivový olej",
        "amount": "2 PL"
      },
      {
        "name": "Citrónová šťava",
        "amount": "1 PL"
      },
      {
        "name": "Soľ a korenie",
        "amount": "podľa chuti"
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
    "image": "/images/recipes/obed-summer-salmon-salad.jpg",
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
        "name": "Taco shells, 100g tempeh, asian slaw (cabbage, mrkva, špenát), avokádo, paradajka",
        "amount": "1 ks"
      },
      {
        "name": "Tamari marinade + dressing (apple cider vinegar, sesame olej, limetka, mustard, sriracha)",
        "amount": "½ ks"
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
    "image": "/images/recipes/obed-tamari-tempeh-tacos.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-zucchini-vegan-vegetable-fritters-and-salad",
    "title": "Zucchini Vegan Vegetable Fritters and Salad",
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
        "name": "Grated cukina, múka, nutritional yeast, spring cibuľa, peas, kukurica",
        "amount": "1 šálka"
      },
      {
        "name": "Salad: špenát, paradajka, uhorka, mrkva, olives, avokádo",
        "amount": "1 ks"
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
    "image": "/images/recipes/obed-zucchini-vegan-vegetable-fritters-and-salad.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-healthy-superfood-fibre-bowl",
    "title": "Healthy Superfood Fibre Bowl",
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
    "image": "/images/recipes/obed-healthy-superfood-fibre-bowl.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-crunchy-vegan-tofu-salad",
    "title": "Crunchy Vegan Tofu Salad",
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
    "image": "/images/recipes/obed-crunchy-vegan-tofu-salad.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-sweet-potato-and-hummus-roll-ups-ve",
    "title": "Sweet Potato and Hummus Roll-Ups (VE)",
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
    "image": "/images/recipes/obed-sweet-potato-and-hummus-roll-ups-ve.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-grilled-pork-with-mexican-style-corn-cobs",
    "title": "Grilled Pork with Mexican-Style Corn Cobs",
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
    "image": "/images/recipes/obed-grilled-pork-with-mexican-style-corn-cobs.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-marinated-asian-garlic-tofu-stir-fry",
    "title": "Marinated Asian-Garlic Tofu Stir Fry",
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
    "image": "/images/recipes/obed-marinated-asian-garlic-tofu-stir-fry.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-veggie-burgers-and-salad-with-tahini",
    "title": "Veggie Burgers and Salad with Tahini",
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
        "name": "Black fazule, brown ryža, walnuts, cumin, paprika, bbq sauce, breadcrumbs",
        "amount": "1 ks"
      },
      {
        "name": "Tahini dressing: tahini, cesnak, apple cider vinegar, mandle mlieko",
        "amount": "2 strúčiky"
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
    "image": "/images/recipes/obed-veggie-burgers-and-salad-with-tahini.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-pumpkin-feta-and-beetroot-salad-v",
    "title": "Pumpkin, Feta and Beetroot Salad (V)",
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
        "name": "Dressing: javorový sirup, balsamic, olivový olej, citrón",
        "amount": "1 PL"
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
    "image": "/images/recipes/obed-pumpkin-feta-and-beetroot-salad-v.jpg",
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
        "name": "Medjool dates, peanuts, dark chocolate, arašidové maslo, kokos olej",
        "amount": "20 g"
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
    "image": "/images/recipes/obed-choc-snickers-date.jpg",
    "difficulty": "medium"
  },
  {
    "id": "obed-quick-snack-ideas-list",
    "title": "Quick Snack Ideas List:",
    "category": "obed",
    "description": "Výživný obed - bezlepkové",
    "prepTime": 30,
    "servings": 2,
    "calories": 400,
    "protein": 25,
    "carbs": 45,
    "fat": 13,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Hummus + raw veg sticks: 247 cal",
        "amount": "3 PL"
      },
      {
        "name": "Unsalted mixed nuts & seeds: 164 cal",
        "amount": "30g"
      },
      {
        "name": "Kukurica thins + 95g tuniak: 203 cal",
        "amount": "2"
      },
      {
        "name": "Banán + 1 tbsp nut maslo: 200 cal",
        "amount": "1"
      },
      {
        "name": "Medium fruit + 2 squares dark choc: 100 cal",
        "amount": "1"
      },
      {
        "name": "Medium fruit + 160g low fat jogurt: 197 cal",
        "amount": "1"
      },
      {
        "name": "Kukurica thins + 1 tbsp nut maslo + uhorka: 182 cal",
        "amount": "2"
      },
      {
        "name": "Medium piece fruit: 80 cal",
        "amount": "1"
      },
      {
        "name": "Punnet berries: 80 cal",
        "amount": "1"
      },
      {
        "name": "Wpi protein shake: 114 cal",
        "amount": "1"
      },
      {
        "name": "/4 avokádo + 2 kukurica thins: 112 cal",
        "amount": "1"
      },
      {
        "name": "Medjool dates: 133 cal",
        "amount": "2"
      }
    ],
    "steps": [],
    "allergens": [
      "dairy",
      "fish"
    ],
    "dietary": [
      "bezlepkové"
    ],
    "tags": [
      "bezlepkové",
      "vysoký proteín"
    ],
    "image": "/images/recipes/obed-quick-snack-ideas-list.jpg",
    "difficulty": "medium"
  },
  {
    "id": "snack-hummus-zelenina",
    "title": "Hummus so zeleninou",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 10,
    "servings": 2,
    "calories": 185,
    "protein": 8,
    "carbs": 20,
    "fat": 9,
    "fiber": 6,
    "ingredients": [
      {
        "name": "Cíceru (konzervovaný)",
        "amount": "200 g"
      },
      {
        "name": "Tahini",
        "amount": "1 PL"
      },
      {
        "name": "Citrónovej šťavy",
        "amount": "1 PL"
      },
      {
        "name": "Cesnaku",
        "amount": "1 strúčik"
      },
      {
        "name": "Mrkvy",
        "amount": "1 ks"
      },
      {
        "name": "Uhorky",
        "amount": "½ ks"
      },
      {
        "name": "Papriky",
        "amount": "½ ks"
      }
    ],
    "steps": [
      "Cícer scediť a vložiť do mixéra s tahini, citrónom a cesnakom.",
      "Rozmixovať do hladka, podávať s nakrájanou zeleninou."
    ],
    "allergens": [
      "sesame"
    ],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "rýchle",
      "vysoký obsah bielkovín"
    ],
    "image": "/images/recipes/snack-hummus-zelenina.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-edamame-morska-sol",
    "title": "Edamame s morskou soľou",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 5,
    "servings": 2,
    "calories": 190,
    "protein": 17,
    "carbs": 14,
    "fat": 8,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Mrazených edamame bôbov",
        "amount": "200 g"
      },
      {
        "name": "Morskej soli",
        "amount": "½ ČL"
      },
      {
        "name": "Citrónovej šťavy",
        "amount": "1 ČL"
      }
    ],
    "steps": [
      "Edamame uvariť v osolenej vode 3-5 minút.",
      "Scediť, posypať morskou soľou a pokvapkať citrónom."
    ],
    "allergens": [
      "soy"
    ],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "rýchle",
      "vysoký obsah bielkovín"
    ],
    "image": "/images/recipes/snack-edamame.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-ovocny-chia-puding",
    "title": "Ovocný chia puding",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 10,
    "servings": 2,
    "calories": 175,
    "protein": 6,
    "carbs": 22,
    "fat": 7,
    "fiber": 8,
    "ingredients": [
      {
        "name": "Chia semienok",
        "amount": "30 g"
      },
      {
        "name": "Kokosového mlieka",
        "amount": "200 ml"
      },
      {
        "name": "Čerstvých malín",
        "amount": "80 g"
      },
      {
        "name": "Agávového sirupu",
        "amount": "1 ČL"
      }
    ],
    "steps": [
      "Chia semienka zmiešať s kokosovým mliekom a agávovým sirupom.",
      "Nechať v chladničke aspoň 2 hodiny alebo cez noc.",
      "Podávať s čerstvými malinami."
    ],
    "allergens": [],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "príprava vopred"
    ],
    "image": "/images/recipes/snack-chia-puding.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-pecene-cícerove-chrumky",
    "title": "Pečené cícerové chrumky",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 30,
    "servings": 4,
    "calories": 165,
    "protein": 9,
    "carbs": 24,
    "fat": 4,
    "fiber": 7,
    "ingredients": [
      {
        "name": "Cíceru (konzervovaný, scedený)",
        "amount": "400 g"
      },
      {
        "name": "Olivového oleja",
        "amount": "1 PL"
      },
      {
        "name": "Sladkej papriky",
        "amount": "1 ČL"
      },
      {
        "name": "Rasce",
        "amount": "½ ČL"
      },
      {
        "name": "Soli",
        "amount": "štipka"
      }
    ],
    "steps": [
      "Rúru predhriať na 200°C.",
      "Cícer osušiť, zmiešať s olejom a korením.",
      "Pečiť 25-30 minút, kým nebudú chrumkavé."
    ],
    "allergens": [],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "vysoký obsah bielkovín"
    ],
    "image": "/images/recipes/snack-cicerove-chrumky.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-ryžove-kolace-avokado",
    "title": "Ryžové koláče s avokádom",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 5,
    "servings": 2,
    "calories": 195,
    "protein": 4,
    "carbs": 18,
    "fat": 12,
    "fiber": 5,
    "ingredients": [
      {
        "name": "Ryžových koláčov",
        "amount": "4 ks"
      },
      {
        "name": "Zrelého avokáda",
        "amount": "1 ks"
      },
      {
        "name": "Cherry paradajok",
        "amount": "6 ks"
      },
      {
        "name": "Citrónovej šťavy",
        "amount": "1 ČL"
      },
      {
        "name": "Soli a čierneho korenia",
        "amount": "podľa chuti"
      }
    ],
    "steps": [
      "Avokádo rozmiačkať vidličkou s citrónom, soľou a korením.",
      "Natrieť na ryžové koláče a ozdobiť paradajkami."
    ],
    "allergens": [],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "rýchle"
    ],
    "image": "/images/recipes/snack-ryzove-kolace-avokado.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-ovocny-sorbet",
    "title": "Domáci ovocný sorbet",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové",
    "prepTime": 5,
    "servings": 2,
    "calories": 120,
    "protein": 2,
    "carbs": 28,
    "fat": 1,
    "fiber": 4,
    "ingredients": [
      {
        "name": "Mrazených banánov",
        "amount": "2 ks"
      },
      {
        "name": "Mrazených jahôd",
        "amount": "100 g"
      },
      {
        "name": "Kokosovej vody",
        "amount": "50 ml"
      }
    ],
    "steps": [
      "Všetky prísady vložiť do mixéra.",
      "Mixovať 2-3 minúty do krémovej konzistencie.",
      "Ihneď podávať."
    ],
    "allergens": [],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "rýchle",
      "nízkokalorické"
    ],
    "image": "/images/recipes/snack-ovocny-sorbet.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-slnecnicove-gule",
    "title": "Slnečnicové energetické guľky",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové, bez orechov",
    "prepTime": 15,
    "servings": 6,
    "calories": 155,
    "protein": 5,
    "carbs": 18,
    "fat": 8,
    "fiber": 3,
    "ingredients": [
      {
        "name": "Slnečnicových semienok",
        "amount": "100 g"
      },
      {
        "name": "Datlí medjool",
        "amount": "6 ks"
      },
      {
        "name": "Kakaa",
        "amount": "1 PL"
      },
      {
        "name": "Kokosových lupienkov",
        "amount": "2 PL"
      },
      {
        "name": "Štipky soli",
        "amount": "1"
      }
    ],
    "steps": [
      "Slnečnicové semienka rozmixovať na jemno.",
      "Pridať datle, kakao a soľ, mixovať do lepkavej hmoty.",
      "Tvarovať guľky, obaľovať v kokose. Schladiť 30 min."
    ],
    "allergens": [],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "bez orechov",
      "príprava vopred"
    ],
    "image": "/images/recipes/snack-slnecnicove-gule.jpg",
    "difficulty": "easy"
  },
  {
    "id": "snack-tekvicove-semienka-mix",
    "title": "Pražené tekvicové semienka s korením",
    "category": "snack",
    "description": "Zdravý snack - vhodné pre vegánov, bezlepkové, bez orechov",
    "prepTime": 15,
    "servings": 4,
    "calories": 170,
    "protein": 9,
    "carbs": 5,
    "fat": 14,
    "fiber": 2,
    "ingredients": [
      {
        "name": "Tekvicových semienok",
        "amount": "150 g"
      },
      {
        "name": "Olivového oleja",
        "amount": "1 ČL"
      },
      {
        "name": "Sladkej papriky",
        "amount": "1 ČL"
      },
      {
        "name": "Cesnakového prášku",
        "amount": "½ ČL"
      },
      {
        "name": "Morskej soli",
        "amount": "½ ČL"
      }
    ],
    "steps": [
      "Rúru predhriať na 180°C.",
      "Semienka zmiešať s olejom a korením.",
      "Pražiť 10-12 minút, nechať vychladnúť."
    ],
    "allergens": [],
    "dietary": [
      "vegánske",
      "bezlepkové"
    ],
    "tags": [
      "vegánske",
      "bezlepkové",
      "bez orechov",
      "vysoký obsah bielkovín"
    ],
    "image": "/images/recipes/snack-tekvicove-semienka.jpg",
    "difficulty": "easy"
  }
];