// API Recipe Expansion - Add quality Slovak recipes
// Expands clean database with professional Spoonacular recipes

import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY = 'a1702279d5a144b88af0e35214379fdf';
const BASE_URL = 'https://api.spoonacular.com/recipes';

console.log('🚀 Expanding API recipe database...');

// Slovak translation dictionary for common ingredients
const ingredientTranslations = {
  // Proteins
  'chicken breast': 'kuracie prsia',
  'chicken': 'kuracie mäso', 
  'salmon': 'losos',
  'beef': 'hovädzie mäso',
  'eggs': 'vajcia',
  'egg': 'vajce',
  
  // Vegetables
  'onion': 'cibuľa',
  'garlic': 'cesnak',
  'tomatoes': 'paradajky',
  'tomato': 'paradajka',
  'bell pepper': 'paprika',
  'spinach': 'špenát',
  'broccoli': 'brokolica',
  'carrot': 'mrkva',
  'cucumber': 'uhorka',
  'avocado': 'avokádo',
  
  // Grains & Carbs
  'rice': 'ryža',
  'pasta': 'cestoviny',
  'bread': 'chlieb',
  'quinoa': 'quinoa',
  'oats': 'ovos',
  'flour': 'múka',
  
  // Dairy
  'cheese': 'syr',
  'milk': 'mlieko',
  'yogurt': 'jogurt',
  'butter': 'maslo',
  
  // Seasonings
  'salt': 'soľ',
  'pepper': 'korenie',
  'olive oil': 'olivový olej',
  'lemon': 'citrón',
  'herbs': 'bylinky',
  
  // Units
  'cup': 'šálka',
  'tablespoon': 'polievková lyžica',
  'teaspoon': 'čajová lyžička',
  'ounce': 'unca',
  'pound': 'libra',
  'gram': 'g',
  'ml': 'ml',
  'kg': 'kg'
};

// Recipe search queries for balanced nutrition
const searchQueries = [
  // Breakfast
  { query: 'healthy breakfast protein', type: 'ranajky', count: 10 },
  { query: 'oatmeal smoothie bowl', type: 'ranajky', count: 5 },
  
  // Lunch  
  { query: 'healthy lunch salad protein', type: 'obed', count: 10 },
  { query: 'soup vegetarian healthy', type: 'obed', count: 5 },
  
  // Dinner
  { query: 'healthy dinner chicken fish', type: 'vecera', count: 10 },
  { query: 'vegetarian dinner protein', type: 'vecera', count: 5 },
  
  // Snacks
  { query: 'healthy snack protein', type: 'snack', count: 10 },
  
  // Smoothies
  { query: 'protein smoothie healthy', type: 'smoothie', count: 5 }
];

// Translate ingredient name
function translateIngredient(name) {
  const lowerName = name.toLowerCase();
  for (const [en, sk] of Object.entries(ingredientTranslations)) {
    if (lowerName.includes(en)) {
      return lowerName.replace(en, sk);
    }
  }
  return name; // Return original if no translation found
}

// Translate recipe text using MyMemory API
async function translateText(text) {
  if (!text || text.length < 3) return text;
  
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|sk`);
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
  } catch (error) {
    console.warn('Translation failed:', error.message);
  }
  
  return text; // Return original on failure
}

// Fetch recipe details
async function getRecipeDetails(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
    const recipe = await response.json();
    
    if (response.status === 402) {
      console.warn('❌ API quota exceeded');
      return null;
    }
    
    if (!recipe.id) return null;
    
    // Extract and translate ingredients
    const ingredients = [];
    if (recipe.extendedIngredients) {
      for (const ing of recipe.extendedIngredients) {
        const translatedName = translateIngredient(ing.name || ing.original);
        ingredients.push({
          name: translatedName,
          amount: `${ing.amount || ''} ${ing.unit || ''}`.trim() || 'podľa chuti'
        });
      }
    }
    
    // Translate steps
    const steps = [];
    if (recipe.instructions) {
      for (const instruction of recipe.instructions) {
        if (instruction.steps) {
          for (const step of instruction.steps) {
            const translatedStep = await translateText(step.step);
            steps.push(translatedStep);
          }
        }
      }
    }
    
    return {
      id: `spoon-${recipe.id}`,
      title: await translateText(recipe.title),
      category: 'ranajky', // Will be updated based on search
      description: await translateText(recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 100)) || 'Chutný a zdravý recept',
      prepTime: recipe.readyInMinutes || 30,
      servings: recipe.servings || 2,
      calories: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 300),
      protein: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 15),
      carbs: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 30),
      fat: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 10),
      fiber: Math.round(recipe.nutrition?.nutrients?.find(n => n.name === 'Fiber')?.amount || 5),
      ingredients,
      steps,
      allergens: recipe.allergens || [],
      dietary: recipe.diets || [],
      tags: recipe.dishTypes || [],
      image: recipe.image || `https://img.spoonacular.com/recipes/${recipe.id}-556x370.jpg`,
      difficulty: recipe.readyInMinutes > 45 ? 'medium' : 'easy'
    };
    
  } catch (error) {
    console.error('Error fetching recipe:', error.message);
    return null;
  }
}

// Search recipes
async function searchRecipes(query, count = 10) {
  try {
    const response = await fetch(`${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=${count}&addRecipeInformation=true&addRecipeNutrition=true`);
    const data = await response.json();
    
    if (response.status === 402) {
      console.warn('❌ API quota exceeded');
      return [];
    }
    
    return data.results || [];
  } catch (error) {
    console.error('Search failed:', error.message);
    return [];
  }
}

// Main expansion function
async function expandRecipeDatabase() {
  // Read current clean database
  const recipesContent = fs.readFileSync('src/data/recipes.ts', 'utf8');
  const recipesMatch = recipesContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*\]);/);
  const currentRecipes = eval(recipesMatch[1]);
  
  console.log(`📊 Current database: ${currentRecipes.length} recipes`);
  
  const newRecipes = [];
  let quotaExceeded = false;
  
  // Expand each category
  for (const searchConfig of searchQueries) {
    if (quotaExceeded) break;
    
    console.log(`🔍 Searching: ${searchConfig.query} (${searchConfig.type})`);
    
    const searchResults = await searchRecipes(searchConfig.query, searchConfig.count);
    
    if (searchResults.length === 0) {
      quotaExceeded = true;
      break;
    }
    
    // Process each result
    for (const result of searchResults.slice(0, 3)) { // Limit to 3 per search to preserve quota
      const detailedRecipe = await getRecipeDetails(result.id);
      
      if (detailedRecipe) {
        detailedRecipe.category = searchConfig.type;
        newRecipes.push(detailedRecipe);
        console.log(`✅ Added: ${detailedRecipe.title}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // Combine with existing recipes
  const allRecipes = [...currentRecipes, ...newRecipes];
  
  // Generate updated file
  const updatedContent = `// Expanded API recipe database - ${new Date().toISOString()}
// Professional Spoonacular recipes - ${allRecipes.length} total
// Recent expansion: +${newRecipes.length} new recipes

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

  fs.writeFileSync('src/data/recipes.ts', updatedContent);
  
  console.log(`\n🎉 EXPANSION COMPLETE!`);
  console.log(`📈 Database expanded: ${currentRecipes.length} → ${allRecipes.length} (+${newRecipes.length})`);
  console.log(`✨ All recipes: Professional API quality`);
  
  if (quotaExceeded) {
    console.log(`⚠️  API quota reached - continue expansion tomorrow`);
  }
}

// Run expansion
expandRecipeDatabase();