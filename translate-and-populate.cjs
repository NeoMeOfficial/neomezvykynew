// Complete Spoonacular Database Population with Slovak Translation
const fs = require('fs');
const path = require('path');

const SPOONACULAR_API_KEY = 'a1702279d5a144b88af0e35214379fdf';
const API_BASE = 'https://api.spoonacular.com';

// Free translation using MyMemory API
async function translateText(text, targetLang = 'sk') {
  if (!text || text.length < 2) return text;
  
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 500))}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text;
  } catch (error) {
    console.warn('Translation failed:', error.message);
    return text;
  }
}

// Batch translate ingredients with Slovak cooking terms
const ingredientTranslations = {
  'chicken breast': 'kuracie prsia',
  'ground beef': 'mleté hovädzie mäso', 
  'olive oil': 'olivový olej',
  'garlic': 'cesnak',
  'onion': 'cibuľa',
  'tomato': 'rajčina',
  'salt': 'soľ',
  'pepper': 'korenie',
  'egg': 'vajce',
  'milk': 'mlieko',
  'flour': 'múka',
  'sugar': 'cukor',
  'butter': 'maslo',
  'cheese': 'syr',
  'potato': 'zemiak',
  'carrot': 'mrkva',
  'rice': 'ryža',
  'pasta': 'cestoviny'
};

function quickTranslateIngredient(ingredient) {
  const lower = ingredient.toLowerCase();
  for (const [en, sk] of Object.entries(ingredientTranslations)) {
    if (lower.includes(en)) {
      return ingredient.replace(new RegExp(en, 'gi'), sk);
    }
  }
  return ingredient;
}

// Fetch recipes by category
async function fetchCategoryRecipes(category, count = 15) {
  try {
    const url = `${API_BASE}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&type=${category}&number=${count}&addRecipeNutrition=true&sort=popularity`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} ${category} recipes`);
    return data.results || [];
  } catch (error) {
    console.error(`❌ Failed to fetch ${category}:`, error.message);
    return [];
  }
}

// Get detailed recipe info
async function getRecipeDetails(recipeId) {
  try {
    const url = `${API_BASE}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    const response = await fetch(url);
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn(`Failed to get details for recipe ${recipeId}`);
    return null;
  }
}

// Convert recipe to Slovak format
async function convertRecipe(spoonRecipe, category) {
  try {
    console.log(`🔄 Converting: ${spoonRecipe.title}`);
    
    // Get detailed data
    const details = await getRecipeDetails(spoonRecipe.id);
    if (!details) return null;

    // Extract nutrition
    const getNutrient = (name) => {
      const nutrient = details.nutrition?.nutrients?.find(n => 
        n.name.toLowerCase().includes(name.toLowerCase())
      );
      return Math.round(nutrient?.amount || 0);
    };

    // Translate title
    const translatedTitle = await translateText(details.title);
    
    // Process ingredients (limited translation for speed)
    const ingredients = [];
    if (details.extendedIngredients) {
      for (const ing of details.extendedIngredients.slice(0, 8)) {
        const quickTranslated = quickTranslateIngredient(ing.name);
        ingredients.push({
          name: quickTranslated,
          amount: `${ing.amount} ${ing.unit}`.trim() || ing.original
        });
      }
    }

    // Simple instruction processing
    let steps = ['Návod na prípravu dostupný v originálnom recepte.'];
    if (details.instructions) {
      const instructionText = details.instructions.replace(/<[^>]*>/g, '');
      if (instructionText.length > 50) {
        const translated = await translateText(instructionText.substring(0, 200));
        steps = [translated];
      }
    }

    // Map categories
    const categoryMap = {
      'breakfast': 'ranajky',
      'lunch': 'obed',
      'dinner': 'vecera', 
      'snack': 'snack',
      'dessert': 'snack'
    };

    return {
      id: `spoon-${details.id}`,
      title: translatedTitle,
      category: categoryMap[category] || 'snack',
      description: await translateText(details.summary?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Profesionálny recept zo Spoonacular'),
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
      dietary: details.diets?.map(d => quickTranslateIngredient(d)) || [],
      tags: details.cuisines || [],
      image: details.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop',
      difficulty: details.readyInMinutes <= 30 ? 'easy' : 'medium'
    };

  } catch (error) {
    console.error(`Error converting ${spoonRecipe.title}:`, error.message);
    return null;
  }
}

// Main population function
async function populateWithTranslation() {
  console.log('🚀 Populating database with translated Spoonacular recipes...\n');
  
  const categories = [
    { type: 'breakfast', count: 20 },
    { type: 'lunch', count: 15 },
    { type: 'dinner', count: 15 },
    { type: 'snack', count: 10 }
  ];

  const allRecipes = [];

  for (const { type, count } of categories) {
    console.log(`\n📥 Processing ${type} recipes...`);
    
    const spoonRecipes = await fetchCategoryRecipes(type, count);
    
    for (const recipe of spoonRecipes.slice(0, 5)) { // Limit to 5 per category for speed
      const converted = await convertRecipe(recipe, type);
      if (converted) {
        allRecipes.push(converted);
        console.log(`   ✅ Added: ${converted.title}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Read existing recipes to preserve them
  const recipesPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  let existingRecipes = [];
  
  try {
    const currentContent = fs.readFileSync(recipesPath, 'utf8');
    const recipesMatch = currentContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/);
    if (recipesMatch) {
      existingRecipes = JSON.parse(recipesMatch[1]).filter(r => !r.id.startsWith('spoon-'));
    }
  } catch (error) {
    console.warn('Could not read existing recipes, starting fresh');
  }

  // Combine Spoonacular + existing recipes
  const finalRecipes = [...allRecipes, ...existingRecipes];

  // Generate new file
  const fileContent = `// Enhanced with Spoonacular recipes - ${new Date().toISOString()}
// Total recipes: ${finalRecipes.length} (${allRecipes.length} Spoonacular + ${existingRecipes.length} original)

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

  // Backup and write
  const backupPath = path.join(__dirname, 'src', 'data', `recipes-full-backup-${Date.now()}.ts`);
  if (fs.existsSync(recipesPath)) {
    fs.copyFileSync(recipesPath, backupPath);
  }
  
  fs.writeFileSync(recipesPath, fileContent);

  console.log(`\n🎉 SUCCESS! Created enhanced database with ${finalRecipes.length} recipes`);
  console.log(`📊 Spoonacular: ${allRecipes.length} | Original: ${existingRecipes.length}`);
  console.log(`💾 Backup: ${backupPath}`);
  
  // Summary
  const summary = {};
  finalRecipes.forEach(r => {
    summary[r.category] = (summary[r.category] || 0) + 1;
  });
  
  console.log('\n📊 Final Recipe Counts:');
  Object.entries(summary).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} recipes`);
  });

  console.log('\n✨ Your database now has professional translated recipes!');
  console.log('🔄 Restart dev server to see all changes');
}

// Run if called directly
if (require.main === module) {
  populateWithTranslation().catch(console.error);
}

module.exports = { populateWithTranslation };