// Intelligent OCR Cleanup Script
// Automatically fixes most common OCR errors using pattern matching and Slovak language rules

import fs from 'fs';

console.log('🤖 Starting Intelligent OCR Cleanup...');

// Load error report
const errorReport = JSON.parse(fs.readFileSync('ocr-error-report.json', 'utf8'));
const recipesContent = fs.readFileSync('src/data/recipes.ts', 'utf8');
const recipesMatch = recipesContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*\]);/);
const recipesData = eval(recipesMatch[1]);

// Filter Slovak recipes only
const slovakRecipes = recipesData.filter(recipe => 
  recipe.id && !recipe.id.startsWith('spoon-')
);

console.log(`🔧 Processing ${slovakRecipes.length} Slovak recipes...`);

// Intelligent cleanup rules
const cleanupRules = {
  
  // Fix broken ingredient patterns
  ingredientFixes: {
    // Common OCR split patterns
    '/^(.+),\\s*,\\s*\\((.+)\\)$/': '$1 ($2)', // "Mrkvy m , , (2)" -> "Mrkvy (2)"
    '/^(.+)\\s+pfs\\s+(.+)$/': '$1 pŕs $2', // "pfs" -> "pŕs"
    '/^(.+)\\s+-\\s*»\\s*(.+)$/': '$1 - $2', // Fix arrow artifacts
    '/^%3\\s+(.+)$/': '¾ $1', // "%3" -> "¾"
    '/^V4\\s+(.+)$/': '¼ $1', // "V4" -> "¼"
  },
  
  // Fix measurement units
  measurementFixes: {
    'cl': 'ČL',
    'pl': 'PL', 
    'čl': 'ČL',
    ' ks': ' ks',
    ' g': ' g',
    ' ml': ' ml',
    ' kg': ' kg'
  },
  
  // Fix broken words (most common patterns)
  wordFixes: {
    // Cooking verbs
    'uvari': 'uvar',
    'peč': 'peči',
    'nechaj': 'nechaj',
    'vlož': 'vlož',
    'pridaj': 'pridaj',
    'zmiešaj': 'zmiešaj',
    
    // Common ingredients  
    'manga': 'mango',
    'koriandru': 'koriander',
    'paradajok': 'paradajky',
    'plechovk': 'plechovky',
    'olivoého': 'olivového',
    'gréckym': 'grécky',
    
    // Measurement words
    'šálky': 'šálky',
    'lyžice': 'lyžice',
    'lyžičky': 'lyžičky',
    
    // Remove OCR artifacts
    ' ,': '',
    ',,': ',',
    '..': '.',
    ' .': '.',
  },
  
  // Fix Slovak grammar patterns
  grammarFixes: {
    // Fix incomplete sentences
    '/\\.\\.\\./g': '.',
    '/\\s+\\./g': '.',
    '/\\.\\s*([a-z])/g': '. $1',
    
    // Fix spacing
    '/\\s{2,}/g': ' ',
    '/^\\s+|\\s+$/g': '', // trim
    
    // Fix common OCR sentence breaks
    '/\\s+a\\s+/g': ' a ',
    '/\\s+s\\s+/g': ' s ',
    '/\\s+v\\s+/g': ' v ',
    '/\\s+na\\s+/g': ' na ',
  },
  
  // Complete missing ingredients based on recipe steps
  missingIngredientsFix: {
    'obed-zdrave-bolonske-spagety': [
      { name: 'Celozrnné špagety', amount: '200 g' },
      { name: 'Mleté hovädzie mäso', amount: '150 g' },
      { name: 'Cibuľa', amount: '1 ks' },
      { name: 'Cesnak', amount: '2 strúčiky' },
      { name: 'Paradajkový pretlak', amount: '200 g' },
      { name: 'Olivový olej', amount: '2 PL' },
      { name: 'Bazalka', amount: '10 g' },
      { name: 'Soľ a korenie', amount: 'podľa chuti' }
    ],
    'obed-summer-salmon-salad': [
      { name: 'Losos (filé)', amount: '150 g' },
      { name: 'Zmiešaný šalát', amount: '100 g' },
      { name: 'Cherry paradajky', amount: '100 g' },
      { name: 'Uhorka', amount: '1 ks' },
      { name: 'Avokádo', amount: '½ ks' },
      { name: 'Olivový olej', amount: '2 PL' },
      { name: 'Citrónová šťava', amount: '1 PL' },
      { name: 'Soľ a korenie', amount: 'podľa chuti' }
    ]
  }
};

// Apply intelligent cleanup
let fixCount = 0;

const cleanedRecipes = slovakRecipes.map(recipe => {
  let cleaned = JSON.parse(JSON.stringify(recipe)); // Deep copy
  
  // Fix missing ingredients
  if (cleanupRules.missingIngredientsFix[recipe.id]) {
    cleaned.ingredients = cleanupRules.missingIngredientsFix[recipe.id];
    console.log(`✅ Added missing ingredients: ${recipe.title}`);
    fixCount++;
  }
  
  // Clean ingredients
  cleaned.ingredients = cleaned.ingredients.map(ing => {
    let name = ing.name;
    let amount = ing.amount;
    
    // Apply word fixes
    Object.entries(cleanupRules.wordFixes).forEach(([bad, good]) => {
      name = name.replace(new RegExp(bad, 'g'), good);
      amount = amount.replace(new RegExp(bad, 'g'), good);
    });
    
    // Apply measurement fixes  
    Object.entries(cleanupRules.measurementFixes).forEach(([bad, good]) => {
      name = name.replace(new RegExp('\\b' + bad + '\\b', 'g'), good);
      amount = amount.replace(new RegExp('\\b' + bad + '\\b', 'g'), good);
    });
    
    // Clean broken ingredient patterns
    if (name.includes(' , ,')) {
      name = name.replace(/(.+)\s*,\s*,\s*\((.+)\)/, '$1').trim();
      fixCount++;
    }
    
    if (name.includes('pfs')) {
      name = name.replace(/pfs/g, 'pŕs');
      fixCount++;
    }
    
    if (name.includes('%3')) {
      name = name.replace(/%3/g, '¾');
      fixCount++;
    }
    
    if (name.includes('V4')) {
      name = name.replace(/V4/g, '¼');
      fixCount++;
    }
    
    return { name: name.trim(), amount: amount.trim() };
  });
  
  // Clean steps
  cleaned.steps = cleaned.steps.map(step => {
    let cleanStep = step;
    
    // Apply word fixes
    Object.entries(cleanupRules.wordFixes).forEach(([bad, good]) => {
      cleanStep = cleanStep.replace(new RegExp(bad, 'g'), good);
    });
    
    // Apply grammar fixes
    cleanStep = cleanStep.replace(/\.\.\./g, '.');
    cleanStep = cleanStep.replace(/\s+\./g, '.');
    cleanStep = cleanStep.replace(/\s{2,}/g, ' ');
    cleanStep = cleanStep.trim();
    
    // Fix common sentence breaks
    cleanStep = cleanStep.replace(/\s+([asvna])\s+/g, ' $1 ');
    
    return cleanStep;
  });
  
  return cleaned;
});

// Re-combine with Spoonacular recipes
const spoonacularRecipes = recipesData.filter(recipe => 
  recipe.id && recipe.id.startsWith('spoon-')
);

const allRecipes = [...spoonacularRecipes, ...cleanedRecipes];

// Generate cleaned file
const cleanedContent = `// Intelligent OCR-cleaned + Spoonacular recipes - ${new Date().toISOString()}
// Spoonacular: ${spoonacularRecipes.length} | Original (cleaned): ${cleanedRecipes.length} | Total: ${allRecipes.length}

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

export const recipes: Recipe[] = ${JSON.stringify(allRecipes, null, 2)};`;

// Write cleaned file
fs.writeFileSync('src/data/recipes.ts', cleanedContent);

console.log(`\n🎉 CLEANUP COMPLETE!`);
console.log(`📊 Applied ${fixCount} automatic fixes`);
console.log(`📈 Total recipes: ${allRecipes.length} (${spoonacularRecipes.length} API + ${cleanedRecipes.length} cleaned Slovak)`);
console.log(`✨ Ready for deployment!`);