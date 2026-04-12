// Spoonacular Recipe Database Population Script
// Fetches recipes from Spoonacular, translates to Slovak, and updates local database

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const SPOONACULAR_API_KEY = process.env.VITE_SPOONACULAR_API_KEY || process.env.SPOONACULAR_API_KEY;
const DEEPL_API_KEY = process.env.VITE_DEEPL_API_KEY || process.env.DEEPL_API_KEY;

if (!SPOONACULAR_API_KEY) {
  console.error('❌ VITE_SPOONACULAR_API_KEY not found in .env.local');
  process.exit(1);
}
if (!DEEPL_API_KEY) {
  console.error('❌ VITE_DEEPL_API_KEY not found in .env.local');
  process.exit(1);
}
const API_BASE = 'https://api.spoonacular.com';
const DEEPL_BASE = 'https://api-free.deepl.com/v2/translate';

async function translateText(text, targetLang = 'SK') {
  if (!text || !text.trim()) return text;
  try {
    const response = await fetch(DEEPL_BASE, {
      method: 'POST',
      headers: { 'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: [text], target_lang: targetLang, source_lang: 'EN' }),
    });
    if (!response.ok) throw new Error(`DeepL ${response.status}`);
    const data = await response.json();
    return data.translations?.[0]?.text || text;
  } catch (error) {
    console.warn('Translation failed:', text.substring(0, 50), error.message);
    return text;
  }
}

// Fetch recipes from Spoonacular
async function fetchSpoonacularRecipes(type, number = 20) {
  try {
    const url = `${API_BASE}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&type=${type}&number=${number}&addRecipeNutrition=true&addRecipeInstructions=true&fillIngredients=true&sort=popularity`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} ${type} recipes`);
    return data.results || [];
  } catch (error) {
    console.error(`❌ Failed to fetch ${type} recipes:`, error.message);
    return [];
  }
}

// Get detailed recipe information
async function getRecipeDetails(recipeId) {
  try {
    const url = `${API_BASE}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`❌ Failed to get details for recipe ${recipeId}:`, error.message);
    return null;
  }
}

// Convert Spoonacular recipe to your format
async function convertToLocalFormat(spoonacularRecipe, category) {
  try {
    console.log(`🔄 Converting: ${spoonacularRecipe.title}`);
    
    // Get detailed recipe data
    const detailedRecipe = await getRecipeDetails(spoonacularRecipe.id);
    if (!detailedRecipe) return null;

    // Extract nutrition values
    const getNutrient = (name) => {
      const nutrient = detailedRecipe.nutrition?.nutrients?.find(n => 
        n.name.toLowerCase().includes(name.toLowerCase())
      );
      return Math.round(nutrient?.amount || 0);
    };

    // Translate basic info
    const translatedTitle = await translateText(spoonacularRecipe.title);
    console.log(`   📝 Translated title: ${translatedTitle}`);
    
    // Process ingredients
    const ingredients = [];
    if (detailedRecipe.extendedIngredients) {
      for (const ing of detailedRecipe.extendedIngredients.slice(0, 10)) { // Limit to 10 ingredients
        const translatedName = await translateText(ing.name);
        ingredients.push({
          name: translatedName,
          amount: `${ing.amount} ${ing.unit}`.trim()
        });
        // Small delay to avoid hitting translation API limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Process instructions — prefer structured analyzedInstructions
    let steps = [];
    const rawSteps = [];
    if (detailedRecipe.analyzedInstructions?.length > 0) {
      detailedRecipe.analyzedInstructions[0].steps?.forEach(s => {
        if (s.step?.trim().length > 10) rawSteps.push(s.step.trim());
      });
    } else if (detailedRecipe.instructions) {
      detailedRecipe.instructions
        .replace(/<[^>]*>/g, '')
        .split(/(?:\d+\.\s+|\n+)/)
        .map(s => s.trim())
        .filter(s => s.length > 20)
        .forEach(s => rawSteps.push(s));
    }
    for (const step of rawSteps.slice(0, 6)) {
      const translated = await translateText(step);
      if (translated.trim().length > 10) steps.push(translated);
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    // Extract dietary info
    const allergens = [];
    const dietary = [];
    
    if (detailedRecipe.diets) {
      for (const diet of detailedRecipe.diets) {
        const translatedDiet = await translateText(diet);
        dietary.push(translatedDiet);
      }
    }

    // Map categories
    const categoryMap = {
      'breakfast': 'ranajky',
      'lunch': 'obed', 
      'dinner': 'vecera',
      'snack': 'snack',
      'dessert': 'snack',
      'beverage': 'smoothie'
    };

    return {
      id: `spoon-${detailedRecipe.id}`,
      title: translatedTitle,
      category: categoryMap[category] || 'snack',
      description: await translateText(detailedRecipe.summary?.replace(/<[^>]*>/g, '').substring(0, 100) || ''),
      prepTime: detailedRecipe.readyInMinutes || 30,
      servings: detailedRecipe.servings || 2,
      calories: getNutrient('Calories'),
      protein: getNutrient('Protein'),
      carbs: getNutrient('Carbohydrates'),
      fat: getNutrient('Fat'),
      fiber: getNutrient('Fiber'),
      ingredients,
      steps: steps.length > 0 ? steps : ['Postup prípravy nie je k dispozícii.'],
      allergens,
      dietary,
      tags: detailedRecipe.cuisines || [],
      image: detailedRecipe.image || `https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop`,
      difficulty: detailedRecipe.readyInMinutes <= 30 ? 'easy' : 'medium'
    };

  } catch (error) {
    console.error(`❌ Error converting recipe ${spoonacularRecipe.title}:`, error.message);
    return null;
  }
}

// Main function to populate database
async function populateDatabase() {
  console.log('🚀 Starting Spoonacular recipe population...\n');
  
  const allRecipes = [];
  
  // Fill gaps for 6-week plan: need ~30 dinners, ~15 smoothies
  const categories = [
    { type: 'dinner', count: 30 },
    { type: 'beverage', count: 15 },
  ];

  // Fetch and convert recipes for each category
  for (const { type, count } of categories) {
    console.log(`\n📥 Fetching ${type} recipes...`);
    
    const spoonacularRecipes = await fetchSpoonacularRecipes(type, count);
    
    for (const recipe of spoonacularRecipes) {
      const convertedRecipe = await convertToLocalFormat(recipe, type);
      if (convertedRecipe) {
        allRecipes.push(convertedRecipe);
        console.log(`   ✅ Added: ${convertedRecipe.title}`);
      }
      
      // Rate limiting - 150 calls per day on free tier
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`📊 ${type} complete: ${allRecipes.filter(r => r.category === (type === 'breakfast' ? 'ranajky' : type === 'lunch' ? 'obed' : type === 'dinner' ? 'vecera' : type === 'beverage' ? 'smoothie' : 'snack')).length} recipes`);
  }

  // Load existing recipes and merge (avoid duplicates by id)
  const recipesPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  const backupPath = path.join(__dirname, 'src', 'data', `recipes-backup-${Date.now()}.ts`);

  let existingRecipes = [];
  if (fs.existsSync(recipesPath)) {
    fs.copyFileSync(recipesPath, backupPath);
    console.log(`\n💾 Backed up existing recipes to: ${backupPath}`);
    const existingContent = fs.readFileSync(recipesPath, 'utf8');
    const existingMatch = existingContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]+\]);/);
    if (existingMatch) existingRecipes = JSON.parse(existingMatch[1]);
  }

  const existingIds = new Set(existingRecipes.map(r => r.id));
  const newUnique = allRecipes.filter(r => !existingIds.has(r.id));
  const merged = [...existingRecipes, ...newUnique];
  console.log(`\n📦 Existing: ${existingRecipes.length} | New: ${newUnique.length} | Total: ${merged.length}`);

  const recipesFileContent = `// Expanded recipe database — last updated ${new Date().toISOString()}
// Total recipes: ${merged.length}

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

export const recipes: Recipe[] = ${JSON.stringify(merged, null, 2)};
`;

  // Write merged file
  fs.writeFileSync(recipesPath, recipesFileContent);
  
  console.log(`\n🎉 SUCCESS! Database now has ${merged.length} recipes`);
  console.log(`📄 File: ${recipesPath}`);

  const summary = {};
  merged.forEach(r => { summary[r.category] = (summary[r.category] || 0) + 1; });
  console.log('\n📊 Recipe Summary:');
  Object.entries(summary).forEach(([cat, n]) => console.log(`   ${cat}: ${n}`));
}

// Run the script
if (require.main === module) {
  populateDatabase().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { populateDatabase };