// Massive Spoonacular Recipe Expansion with Slovak Translation
const fs = require('fs');
const path = require('path');

const SPOONACULAR_API_KEY = 'a1702279d5a144b88af0e35214379fdf';
const API_BASE = 'https://api.spoonacular.com';

// Enhanced ingredient translation dictionary
const ingredientTranslations = {
  // Proteins
  'chicken breast': 'kuracie prsia',
  'chicken thigh': 'kuracie stehná',
  'ground beef': 'mleté hovädzie mäso',
  'ground turkey': 'mleté morčacie mäso',
  'salmon': 'losos',
  'tuna': 'tuniak',
  'shrimp': 'krevety',
  'eggs': 'vajcia',
  'egg whites': 'bielka',
  'cottage cheese': 'tvaroh',
  'greek yogurt': 'grécky jogurt',
  'tofu': 'tofu',
  
  // Carbs & Grains
  'brown rice': 'hnedá ryža',
  'white rice': 'biela ryža',
  'quinoa': 'quinoa',
  'oats': 'ovos',
  'oatmeal': 'ovsená kaša',
  'pasta': 'cestoviny',
  'whole wheat bread': 'celozrnný chlieb',
  'sweet potato': 'sladký zemiak',
  'potato': 'zemiak',
  'potatoes': 'zemiaky',
  
  // Vegetables
  'broccoli': 'brokolica',
  'spinach': 'špenát',
  'kale': 'kale',
  'carrots': 'mrkva',
  'bell pepper': 'paprika',
  'tomatoes': 'rajčiny',
  'cucumber': 'uhorka',
  'onion': 'cibuľa',
  'garlic': 'cesnak',
  'mushrooms': 'huby',
  'zucchini': 'cuketa',
  'asparagus': 'špargľa',
  
  // Fruits
  'banana': 'banán',
  'apple': 'jablko',
  'berries': 'bobule',
  'strawberries': 'jahody',
  'blueberries': 'čučoriedky',
  'avocado': 'avokádo',
  'lemon': 'citrón',
  'lime': 'limetka',
  'orange': 'pomaranč',
  
  // Fats & Oils
  'olive oil': 'olivový olej',
  'coconut oil': 'kokosový olej',
  'butter': 'maslo',
  'nuts': 'orechy',
  'almonds': 'mandle',
  'walnuts': 'vlašské orechy',
  'peanut butter': 'arašidové maslo',
  'almond butter': 'mandľové maslo',
  
  // Dairy
  'milk': 'mlieko',
  'almond milk': 'mandľové mlieko',
  'coconut milk': 'kokosové mlieko',
  'cheese': 'syr',
  'mozzarella': 'mozzarella',
  'parmesan': 'parmezán',
  'yogurt': 'jogurt',
  
  // Seasonings & Spices
  'salt': 'soľ',
  'pepper': 'čierne korenie',
  'paprika': 'paprika',
  'cumin': 'rasca',
  'oregano': 'oregano',
  'basil': 'bazalka',
  'thyme': 'tymián',
  'rosemary': 'rozmarín',
  'ginger': 'zázvor',
  'cinnamon': 'škorica',
  
  // Cooking terms
  'tablespoon': 'lyžica',
  'teaspoon': 'lyžička',
  'cup': 'šálka',
  'ounce': 'unca',
  'pound': 'libra',
  'clove': 'strúčik',
  'to taste': 'na chuť',
  'pinch': 'štipka'
};

// Translation with fallback
async function translateText(text, targetLang = 'sk') {
  if (!text || text.length < 2) return text;
  
  // First try quick translation with dictionary
  let quickTranslated = text;
  for (const [en, sk] of Object.entries(ingredientTranslations)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    quickTranslated = quickTranslated.replace(regex, sk);
  }
  
  // If we made changes, return quick version
  if (quickTranslated !== text) {
    return quickTranslated;
  }
  
  // Otherwise try API translation
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 400))}&langpair=en|${targetLang}`
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

// Fetch recipes by type with better parameters
async function fetchRecipes(type, offset = 0, number = 20) {
  try {
    const cuisines = ['european', 'mediterranean', 'american', 'italian', 'french', 'german'];
    const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    
    const url = `${API_BASE}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&type=${type}&number=${number}&offset=${offset}&addRecipeNutrition=true&sort=popularity&cuisine=${randomCuisine}&maxReadyTime=60&minCalories=200&maxCalories=800`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.results?.length || 0} ${type} recipes (${randomCuisine} cuisine)`);
    return data.results || [];
  } catch (error) {
    console.error(`❌ Failed to fetch ${type}:`, error.message);
    return [];
  }
}

// Get detailed recipe with better error handling
async function getDetailedRecipe(recipeId) {
  try {
    const url = `${API_BASE}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`⚠️ Failed to get details for recipe ${recipeId}: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.warn(`❌ Error getting recipe details ${recipeId}:`, error.message);
    return null;
  }
}

// Validate recipe nutrition makes sense
function validateNutrition(recipe) {
  const issues = [];
  
  if (recipe.calories < 50 || recipe.calories > 1200) {
    issues.push(`Suspicious calories: ${recipe.calories}`);
  }
  
  if (recipe.protein < 1 || recipe.protein > 100) {
    issues.push(`Suspicious protein: ${recipe.protein}g`);
  }
  
  if (recipe.carbs < 0 || recipe.carbs > 150) {
    issues.push(`Suspicious carbs: ${recipe.carbs}g`);
  }
  
  if (recipe.fat < 1 || recipe.fat > 80) {
    issues.push(`Suspicious fat: ${recipe.fat}g`);
  }
  
  // Check macro ratios make sense
  const totalMacros = (recipe.protein * 4) + (recipe.carbs * 4) + (recipe.fat * 9);
  const calorieDifference = Math.abs(totalMacros - recipe.calories);
  
  if (calorieDifference > recipe.calories * 0.3) {
    issues.push(`Macro/calorie mismatch: ${totalMacros} vs ${recipe.calories}`);
  }
  
  return issues;
}

// Convert with enhanced validation
async function convertToLocalRecipe(spoonRecipe, category) {
  try {
    console.log(`🔄 Converting: ${spoonRecipe.title}`);
    
    const details = await getDetailedRecipe(spoonRecipe.id);
    if (!details) return null;

    // Skip recipes that are too complex or have issues
    if (details.extendedIngredients?.length > 15) {
      console.log(`   ⚠️ Skipped: Too many ingredients (${details.extendedIngredients.length})`);
      return null;
    }
    
    if (details.readyInMinutes > 90) {
      console.log(`   ⚠️ Skipped: Too long preparation (${details.readyInMinutes} min)`);
      return null;
    }

    // Extract nutrition
    const getNutrient = (name) => {
      const nutrient = details.nutrition?.nutrients?.find(n => 
        n.name.toLowerCase().includes(name.toLowerCase())
      );
      return Math.round(nutrient?.amount || 0);
    };

    const nutrition = {
      calories: getNutrient('Calories'),
      protein: getNutrient('Protein'),
      carbs: getNutrient('Carbohydrates'),
      fat: getNutrient('Fat'),
      fiber: getNutrient('Fiber')
    };

    // Validate nutrition makes sense
    const nutritionIssues = validateNutrition(nutrition);
    if (nutritionIssues.length > 1) {
      console.log(`   ⚠️ Skipped: Nutrition issues - ${nutritionIssues.join(', ')}`);
      return null;
    }

    // Translate title and description
    const translatedTitle = await translateText(details.title);
    await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    
    // Process ingredients with translation
    const ingredients = [];
    if (details.extendedIngredients) {
      for (const ing of details.extendedIngredients.slice(0, 12)) {
        const translatedName = await translateText(ing.name);
        const amount = ing.amount && ing.unit ? 
          `${Math.round(ing.amount * 100) / 100} ${ing.unit}` : 
          ing.original?.split(' ').slice(0, 2).join(' ') || 'na chuť';
        
        ingredients.push({
          name: translatedName,
          amount: amount
        });
        
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      }
    }

    // Process instructions
    let steps = [];
    if (details.instructions) {
      const cleanInstructions = details.instructions
        .replace(/<[^>]*>/g, '') // Remove HTML
        .replace(/\d+\./g, '\n') // Split by numbers
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 20 && s.length < 200); // Reasonable step length

      // Take first 6 meaningful steps and translate
      for (const step of cleanInstructions.slice(0, 6)) {
        const translatedStep = await translateText(step);
        steps.push(translatedStep);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }

    // If no good steps, create basic ones
    if (steps.length < 2) {
      steps = [
        'Pripravte si všetky ingrediencie podľa zoznamu.',
        'Postupujte podľa tradičného spôsobu prípravy tohto jedla.',
        'Servírujte teplé alebo podľa receptu.'
      ];
    }

    // Map categories properly
    const categoryMap = {
      'breakfast': 'ranajky',
      'lunch': 'obed',
      'dinner': 'vecera',
      'snack': 'snack',
      'dessert': 'snack',
      'appetizer': 'snack'
    };

    const translatedDescription = await translateText(
      details.summary?.replace(/<[^>]*>/g, '').substring(0, 150) || 
      'Chutný a výživný recept zo Spoonacular databázy.'
    );

    const recipe = {
      id: `spoon-${details.id}`,
      title: translatedTitle,
      category: categoryMap[category] || 'snack',
      description: translatedDescription,
      prepTime: details.readyInMinutes || 30,
      servings: details.servings || 2,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
      ingredients,
      steps,
      allergens: [],
      dietary: details.diets?.map(diet => translateText(diet)) || [],
      tags: details.cuisines || [],
      image: details.image || `https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop`,
      difficulty: details.readyInMinutes <= 30 ? 'easy' : 'medium'
    };

    console.log(`   ✅ Added: ${recipe.title} (${recipe.calories} kcal)`);
    return recipe;

  } catch (error) {
    console.error(`❌ Error converting ${spoonRecipe.title}:`, error.message);
    return null;
  }
}

// Main expansion function
async function massiveExpansion() {
  console.log('🚀 MASSIVE SPOONACULAR EXPANSION STARTING...\n');
  
  const categories = [
    { type: 'breakfast', batches: 3, perBatch: 15 }, // 45 recipes
    { type: 'lunch', batches: 3, perBatch: 15 },     // 45 recipes  
    { type: 'dinner', batches: 3, perBatch: 15 },    // 45 recipes
    { type: 'snack', batches: 2, perBatch: 15 },     // 30 recipes
  ];

  const allRecipes = [];
  let totalProcessed = 0;
  let totalSuccessful = 0;

  for (const { type, batches, perBatch } of categories) {
    console.log(`\n📥 PROCESSING ${type.toUpperCase()} RECIPES...`);
    
    for (let batch = 0; batch < batches; batch++) {
      console.log(`\n   Batch ${batch + 1}/${batches} for ${type}...`);
      
      const offset = batch * perBatch;
      const spoonRecipes = await fetchRecipes(type, offset, perBatch);
      
      for (const spoonRecipe of spoonRecipes) {
        totalProcessed++;
        const converted = await convertToLocalRecipe(spoonRecipe, type);
        
        if (converted) {
          allRecipes.push(converted);
          totalSuccessful++;
        }
        
        // Rate limiting - Spoonacular free tier allows 150 calls/day
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds between calls
      }
      
      // Longer break between batches
      if (batch < batches - 1) {
        console.log(`   💤 Batch break (30 seconds)...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
    
    console.log(`📊 ${type} complete: ${allRecipes.filter(r => {
      const categoryMap = { breakfast: 'ranajky', lunch: 'obed', dinner: 'vecera', snack: 'snack' };
      return r.category === categoryMap[type];
    }).length} recipes`);
  }

  console.log(`\n🎉 EXPANSION COMPLETE!`);
  console.log(`   📊 Processed: ${totalProcessed} recipes`);
  console.log(`   ✅ Successful: ${totalSuccessful} recipes`);
  console.log(`   ❌ Filtered out: ${totalProcessed - totalSuccessful} recipes`);
  
  // Merge with existing
  const currentPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  let existingRecipes = [];
  
  if (fs.existsSync(currentPath)) {
    const currentContent = fs.readFileSync(currentPath, 'utf8');
    const match = currentContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1].replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/,(\s*[}\]])/g, '$1'));
        existingRecipes = parsed.filter(r => !r.id.startsWith('spoon-')); // Keep only non-Spoonacular
        console.log(`📚 Preserved ${existingRecipes.length} existing recipes`);
      } catch (error) {
        console.warn('Could not parse existing recipes, starting fresh');
      }
    }
  }

  const finalRecipes = [...allRecipes, ...existingRecipes];
  
  // Generate file
  const fileContent = `// MASSIVE SPOONACULAR EXPANSION - ${new Date().toISOString()}
// Professional Spoonacular: ${allRecipes.length} | Original: ${existingRecipes.length} | Total: ${finalRecipes.length}

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
  const backupPath = path.join(__dirname, 'src', 'data', `recipes-pre-expansion-${Date.now()}.ts`);
  if (fs.existsSync(currentPath)) {
    fs.copyFileSync(currentPath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);
  }
  
  fs.writeFileSync(currentPath, fileContent);

  // Final summary
  const summary = {};
  finalRecipes.forEach(r => {
    summary[r.category] = (summary[r.category] || 0) + 1;
  });

  console.log(`\n📊 FINAL DATABASE:`)
  console.log(`   📄 File: ${currentPath}`);
  console.log(`   📊 Total recipes: ${finalRecipes.length}`);
  Object.entries(summary).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} recipes`);
  });

  console.log('\n🎉 SUCCESS! Your database now has massive professional content!');
  console.log('🔄 Ready for quality verification and meal planning algorithms!');
  
  return finalRecipes;
}

// Run expansion
if (require.main === module) {
  massiveExpansion().catch(error => {
    console.error('❌ Expansion failed:', error);
    process.exit(1);
  });
}

module.exports = { massiveExpansion };