import { readFileSync, writeFileSync } from 'fs';

// 1. Cap portion multiplier at 2.5x in mealPlanGenerator.ts
const genPath = 'src/features/nutrition/mealPlanGenerator.ts';
let gen = readFileSync(genPath, 'utf-8');

gen = gen.replace(
  `const portionMultiplier = selectedRecipe
        ? Math.round((targetCalories / selectedRecipe.calories) * 100) / 100
        : 1;`,
  `const rawMultiplier = selectedRecipe
        ? Math.round((targetCalories / selectedRecipe.calories) * 100) / 100
        : 1;
      const portionMultiplier = Math.min(rawMultiplier, 2.5); // Cap at 2.5x`
);

writeFileSync(genPath, gen);
console.log('✅ Capped portion multiplier at 2.5x');

// 2. Add vegan/allergy-friendly snack recipes to recipes.ts
const recipePath = 'src/data/recipes.ts';
let recipes = readFileSync(recipePath, 'utf-8');

const newSnacks = `
  {
    id: 'snack-hummus-zelenina',
    title: 'Hummus so zeleninou',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové',
    prepTime: 10,
    servings: 2,
    calories: 185,
    protein: 8,
    carbs: 20,
    fat: 9,
    fiber: 6,
    ingredients: [
      { name: 'Cíceru (konzervovaný)', amount: '200 g' },
      { name: 'Tahini', amount: '1 PL' },
      { name: 'Citrónovej šťavy', amount: '1 PL' },
      { name: 'Cesnaku', amount: '1 strúčik' },
      { name: 'Mrkvy', amount: '1 ks' },
      { name: 'Uhorky', amount: '½ ks' },
      { name: 'Papriky', amount: '½ ks' },
    ],
    steps: [
      'Cícer scediť a vložiť do mixéra s tahini, citrónom a cesnakom.',
      'Rozmixovať do hladka, podávať s nakrájanou zeleninou.',
    ],
    allergens: ['sesame'],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'rýchle', 'vysoký obsah bielkovín'],
    image: '/images/recipes/snack-hummus-zelenina.jpg',
    difficulty: 'easy',
  },
  {
    id: 'snack-edamame-morska-sol',
    title: 'Edamame s morskou soľou',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové',
    prepTime: 5,
    servings: 2,
    calories: 190,
    protein: 17,
    carbs: 14,
    fat: 8,
    fiber: 5,
    ingredients: [
      { name: 'Mrazených edamame bôbov', amount: '200 g' },
      { name: 'Morskej soli', amount: '½ ČL' },
      { name: 'Citrónovej šťavy', amount: '1 ČL' },
    ],
    steps: [
      'Edamame uvariť v osolenej vode 3-5 minút.',
      'Scediť, posypať morskou soľou a pokvapkať citrónom.',
    ],
    allergens: ['soy'],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'rýchle', 'vysoký obsah bielkovín'],
    image: '/images/recipes/snack-edamame.jpg',
    difficulty: 'easy',
  },
  {
    id: 'snack-ovocny-chia-puding',
    title: 'Ovocný chia puding',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové',
    prepTime: 10,
    servings: 2,
    calories: 175,
    protein: 6,
    carbs: 22,
    fat: 7,
    fiber: 8,
    ingredients: [
      { name: 'Chia semienok', amount: '30 g' },
      { name: 'Kokosového mlieka', amount: '200 ml' },
      { name: 'Čerstvých malín', amount: '80 g' },
      { name: 'Agávového sirupu', amount: '1 ČL' },
    ],
    steps: [
      'Chia semienka zmiešať s kokosovým mliekom a agávovým sirupom.',
      'Nechať v chladničke aspoň 2 hodiny alebo cez noc.',
      'Podávať s čerstvými malinami.',
    ],
    allergens: [],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'príprava vopred'],
    image: '/images/recipes/snack-chia-puding.jpg',
    difficulty: 'easy',
  },
  {
    id: 'snack-pecene-cícerove-chrumky',
    title: 'Pečené cícerové chrumky',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové',
    prepTime: 30,
    servings: 4,
    calories: 165,
    protein: 9,
    carbs: 24,
    fat: 4,
    fiber: 7,
    ingredients: [
      { name: 'Cíceru (konzervovaný, scedený)', amount: '400 g' },
      { name: 'Olivového oleja', amount: '1 PL' },
      { name: 'Sladkej papriky', amount: '1 ČL' },
      { name: 'Rasce', amount: '½ ČL' },
      { name: 'Soli', amount: 'štipka' },
    ],
    steps: [
      'Rúru predhriať na 200°C.',
      'Cícer osušiť, zmiešať s olejom a korením.',
      'Pečiť 25-30 minút, kým nebudú chrumkavé.',
    ],
    allergens: [],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'vysoký obsah bielkovín'],
    image: '/images/recipes/snack-cicerove-chrumky.jpg',
    difficulty: 'easy',
  },
  {
    id: 'snack-ryžove-kolace-avokado',
    title: 'Ryžové koláče s avokádom',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové',
    prepTime: 5,
    servings: 2,
    calories: 195,
    protein: 4,
    carbs: 18,
    fat: 12,
    fiber: 5,
    ingredients: [
      { name: 'Ryžových koláčov', amount: '4 ks' },
      { name: 'Zrelého avokáda', amount: '1 ks' },
      { name: 'Cherry paradajok', amount: '6 ks' },
      { name: 'Citrónovej šťavy', amount: '1 ČL' },
      { name: 'Soli a čierneho korenia', amount: 'podľa chuti' },
    ],
    steps: [
      'Avokádo rozmiačkať vidličkou s citrónom, soľou a korením.',
      'Natrieť na ryžové koláče a ozdobiť paradajkami.',
    ],
    allergens: [],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'rýchle'],
    image: '/images/recipes/snack-ryzove-kolace-avokado.jpg',
    difficulty: 'easy',
  },
  {
    id: 'snack-ovocny-sorbet',
    title: 'Domáci ovocný sorbet',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové',
    prepTime: 5,
    servings: 2,
    calories: 120,
    protein: 2,
    carbs: 28,
    fat: 1,
    fiber: 4,
    ingredients: [
      { name: 'Mrazených banánov', amount: '2 ks' },
      { name: 'Mrazených jahôd', amount: '100 g' },
      { name: 'Kokosovej vody', amount: '50 ml' },
    ],
    steps: [
      'Všetky prísady vložiť do mixéra.',
      'Mixovať 2-3 minúty do krémovej konzistencie.',
      'Ihneď podávať.',
    ],
    allergens: [],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'rýchle', 'nízkokalorické'],
    image: '/images/recipes/snack-ovocny-sorbet.jpg',
    difficulty: 'easy',
  },
  {
    id: 'snack-slnecnicove-gule',
    title: 'Slnečnicové energetické guľky',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové, bez orechov',
    prepTime: 15,
    servings: 6,
    calories: 155,
    protein: 5,
    carbs: 18,
    fat: 8,
    fiber: 3,
    ingredients: [
      { name: 'Slnečnicových semienok', amount: '100 g' },
      { name: 'Datlí medjool', amount: '6 ks' },
      { name: 'Kakaa', amount: '1 PL' },
      { name: 'Kokosových lupienkov', amount: '2 PL' },
      { name: 'Štipky soli', amount: '1' },
    ],
    steps: [
      'Slnečnicové semienka rozmixovať na jemno.',
      'Pridať datle, kakao a soľ, mixovať do lepkavej hmoty.',
      'Tvarovať guľky, obaľovať v kokose. Schladiť 30 min.',
    ],
    allergens: [],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'bez orechov', 'príprava vopred'],
    image: '/images/recipes/snack-slnecnicove-gule.jpg',
    difficulty: 'easy',
  },
  {
    id: 'snack-tekvicove-semienka-mix',
    title: 'Pražené tekvicové semienka s korením',
    category: 'snack',
    description: 'Zdravý snack - vhodné pre vegánov, bezlepkové, bez orechov',
    prepTime: 15,
    servings: 4,
    calories: 170,
    protein: 9,
    carbs: 5,
    fat: 14,
    fiber: 2,
    ingredients: [
      { name: 'Tekvicových semienok', amount: '150 g' },
      { name: 'Olivového oleja', amount: '1 ČL' },
      { name: 'Sladkej papriky', amount: '1 ČL' },
      { name: 'Cesnakového prášku', amount: '½ ČL' },
      { name: 'Morskej soli', amount: '½ ČL' },
    ],
    steps: [
      'Rúru predhriať na 180°C.',
      'Semienka zmiešať s olejom a korením.',
      'Pražiť 10-12 minút, nechať vychladnúť.',
    ],
    allergens: [],
    dietary: ['vegánske', 'bezlepkové'],
    tags: ['vegánske', 'bezlepkové', 'bez orechov', 'vysoký obsah bielkovín'],
    image: '/images/recipes/snack-tekvicove-semienka.jpg',
    difficulty: 'easy',
  },`;

// Insert before the closing ]; of the recipes array
const closingBracket = recipes.lastIndexOf('];');
if (closingBracket === -1) {
  console.error('Could not find closing ]; in recipes.ts');
  process.exit(1);
}

recipes = recipes.slice(0, closingBracket) + newSnacks + '\n' + recipes.slice(closingBracket);
writeFileSync(recipePath, recipes);
console.log('✅ Added 8 new vegan/allergy-friendly snack recipes');

// Count totals
const snackCount = (recipes.match(/category: 'snack'/g) || []).length;
const totalCount = (recipes.match(/^\s+id: '/gm) || []).length;
console.log('Total snacks: ' + snackCount + ' | Total recipes: ' + totalCount);
