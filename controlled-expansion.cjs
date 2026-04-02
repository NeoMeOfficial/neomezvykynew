// Controlled Spoonacular Expansion - Test Run
const fs = require('fs');
const path = require('path');

const SPOONACULAR_API_KEY = 'a1702279d5a144b88af0e35214379fdf';
const API_BASE = 'https://api.spoonacular.com';

// Quick ingredient translations
const translations = {
  'chicken': 'kurča', 'beef': 'hovädzie', 'pork': 'bravčové',
  'eggs': 'vajcia', 'milk': 'mlieko', 'cheese': 'syr',
  'rice': 'ryža', 'pasta': 'cestoviny', 'potato': 'zemiak',
  'onion': 'cibuľa', 'garlic': 'cesnak', 'tomato': 'rajčina',
  'salt': 'soľ', 'pepper': 'korenie', 'oil': 'olej'
};

function quickTranslate(text) {
  let result = text;
  for (const [en, sk] of Object.entries(translations)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, 'gi'), sk);
  }
  return result;
}

async function fetchTestRecipes(type, count = 10) {
  try {
    const url = `${API_BASE}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&type=${type}&number=${count}&addRecipeNutrition=true&sort=popularity&maxReadyTime=45&minCalories=150&maxCalories=600`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} ${type} recipes`);
    return data.results || [];
  } catch (error) {
    console.error(`❌ Failed to fetch ${type}:`, error.message);
    return [];
  }
}

async function getRecipeDetails(recipeId) {
  try {
    const url = `${API_BASE}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
}

async function convertRecipe(spoonRecipe, category) {
  console.log(`🔄 Converting: ${spoonRecipe.title}`);
  
  const details = await getRecipeDetails(spoonRecipe.id);
  if (!details) return null;

  // Get nutrition
  const getNutrient = (name) => {
    const nutrient = details.nutrition?.nutrients?.find(n => 
      n.name.toLowerCase().includes(name.toLowerCase())
    );
    return Math.round(nutrient?.amount || 0);
  };

  // Quick ingredient processing
  const ingredients = details.extendedIngredients?.slice(0, 10).map(ing => ({
    name: quickTranslate(ing.name),
    amount: ing.amount && ing.unit ? `${Math.round(ing.amount * 100)/100} ${ing.unit}` : 'na chuť'
  })) || [];

  // Basic steps
  const steps = details.instructions ? 
    [
      'Pripravte si ingrediencie podľa zoznamu.',
      quickTranslate(details.instructions.replace(/<[^>]*>/g, '').substring(0, 200)),
      'Servírujte podľa chuti.'
    ] : 
    [
      'Pripravte si všetky ingrediencie.',
      'Postupujte podľa tradičného receptu.',
      'Servírujte teplé.'
    ];

  const categoryMap = {
    'breakfast': 'ranajky',
    'lunch': 'obed', 
    'dinner': 'vecera',
    'snack': 'snack'
  };

  const recipe = {
    id: `spoon-${details.id}`,
    title: quickTranslate(details.title),
    category: categoryMap[category] || 'snack',
    description: quickTranslate(details.summary?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Chutný recept zo Spoonacular'),
    prepTime: details.readyInMinutes || 30,
    servings: details.servings || 2,
    calories: getNutrient('Calories'),
    protein: getNutrient('Protein'),
    carbs: getNutrient('Carbohydrates'), 
    fat: getNutrient('Fat'),
    fiber: getNutrient('Fiber'),
    ingredients,
    steps,
    allergens: [],
    dietary: details.diets || [],
    tags: details.cuisines || [],
    image: details.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=500&fit=crop',
    difficulty: details.readyInMinutes <= 30 ? 'easy' : 'medium'
  };

  console.log(`   ✅ ${recipe.title} (${recipe.calories} kcal)`);
  return recipe;
}

async function controlledExpansion() {
  console.log('🧪 CONTROLLED EXPANSION TEST...\n');
  
  const categories = [
    { type: 'breakfast', count: 8 },
    { type: 'lunch', count: 6 }, 
    { type: 'dinner', count: 6 },
    { type: 'snack', count: 5 }
  ];

  const allRecipes = [];

  for (const { type, count } of categories) {
    console.log(`\n📥 Processing ${type}...`);
    const spoonRecipes = await fetchTestRecipes(type, count);
    
    for (const spoonRecipe of spoonRecipes) {
      const converted = await convertRecipe(spoonRecipe, type);
      if (converted) {
        allRecipes.push(converted);
      }
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n✅ Expansion complete: ${allRecipes.length} new recipes`);

  // Merge with existing
  const recipesPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  let existingRecipes = [];

  if (fs.existsSync(recipesPath)) {
    const content = fs.readFileSync(recipesPath, 'utf8');
    const match = content.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]
          .replace(/\/\/.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//g, '') 
          .replace(/,(\s*[}\]])/g, '$1'));
        existingRecipes = parsed.filter(r => !r.id.startsWith('spoon-'));
        console.log(`📚 Keeping ${existingRecipes.length} existing recipes`);
      } catch (error) {
        console.warn('Could not parse existing recipes');
      }
    }
  }

  const finalRecipes = [...allRecipes, ...existingRecipes];
  
  // Write updated database
  const content = `// CONTROLLED EXPANSION - ${new Date().toISOString()}
// Spoonacular: ${allRecipes.length} | Original: ${existingRecipes.length} | Total: ${finalRecipes.length}

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

export const recipes: Recipe[] = ${JSON.stringify(finalRecipes, null, 2)};
`;

  // Backup and save
  const backupPath = path.join(__dirname, 'src', 'data', `recipes-pre-controlled-${Date.now()}.ts`);
  if (fs.existsSync(recipesPath)) {
    fs.copyFileSync(recipesPath, backupPath);
    console.log(`💾 Backup: ${backupPath}`);
  }

  fs.writeFileSync(recipesPath, content);

  console.log(`\n🎉 SUCCESS!`);
  console.log(`📄 Updated: ${recipesPath}`);
  console.log(`📊 Total recipes: ${finalRecipes.length}`);
  
  const summary = {};
  finalRecipes.forEach(r => {
    summary[r.category] = (summary[r.category] || 0) + 1;
  });
  
  Object.entries(summary).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} recipes`);
  });

  return finalRecipes;
}

controlledExpansion().catch(console.error);