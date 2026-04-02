// Spoonacular Recipe Database Population Script
// Fetches recipes from Spoonacular, translates to Slovak, and updates local database

const fs = require('fs');
const path = require('path');

// Your Spoonacular API key
const SPOONACULAR_API_KEY = 'a1702279d5a144b88af0e35214379fdf';
const API_BASE = 'https://api.spoonacular.com';

// Google Translate API (free alternative: use MyMemory API)
async function translateText(text, targetLang = 'sk') {
  try {
    // Using MyMemory API (free translation service)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.warn('Translation failed for:', text.substring(0, 50), error.message);
    return text; // Return original if translation fails
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

    // Process instructions
    let steps = [];
    if (detailedRecipe.instructions) {
      // Extract steps from instructions text
      const instructionText = detailedRecipe.instructions
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .split(/\d+\.|\n/) // Split by numbers or newlines
        .filter(step => step.trim().length > 20) // Filter meaningful steps
        .slice(0, 6); // Limit to 6 steps

      for (const step of instructionText) {
        const translatedStep = await translateText(step.trim());
        if (translatedStep.trim().length > 10) {
          steps.push(translatedStep);
        }
        await new Promise(resolve => setTimeout(resolve, 150));
      }
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
  
  // Define categories to fetch
  const categories = [
    { type: 'breakfast', count: 25 },
    { type: 'lunch', count: 20 },
    { type: 'dinner', count: 20 },
    { type: 'snack', count: 15 },
    { type: 'dessert', count: 10 },
    { type: 'beverage', count: 10 }
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

  // Generate the new recipes.ts file
  const recipesFileContent = `// Auto-generated recipes from Spoonacular API
// Generated on: ${new Date().toISOString()}
// Total recipes: ${allRecipes.length}

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
}

export const recipes: Recipe[] = ${JSON.stringify(allRecipes, null, 2)};
`;

  // Backup existing recipes
  const recipesPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  const backupPath = path.join(__dirname, 'src', 'data', `recipes-backup-${Date.now()}.ts`);
  
  if (fs.existsSync(recipesPath)) {
    fs.copyFileSync(recipesPath, backupPath);
    console.log(`\n💾 Backed up existing recipes to: ${backupPath}`);
  }

  // Write new recipes file
  fs.writeFileSync(recipesPath, recipesFileContent);
  
  console.log(`\n🎉 SUCCESS! Generated ${allRecipes.length} recipes`);
  console.log(`📄 New recipes file: ${recipesPath}`);
  console.log(`💾 Backup file: ${backupPath}`);
  
  // Summary by category
  const summary = {};
  allRecipes.forEach(recipe => {
    summary[recipe.category] = (summary[recipe.category] || 0) + 1;
  });
  
  console.log('\n📊 Recipe Summary:');
  Object.entries(summary).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} recipes`);
  });

  console.log('\n✨ Your local database is now populated with professional Spoonacular recipes!');
}

// Run the script
if (require.main === module) {
  populateDatabase().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { populateDatabase };