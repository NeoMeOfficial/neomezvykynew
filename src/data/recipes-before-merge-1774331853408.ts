// Enhanced with Spoonacular recipes - 2026-03-24T05:55:27.087Z
// Total recipes: 20 (20 Spoonacular + 0 original)

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
  }
];
