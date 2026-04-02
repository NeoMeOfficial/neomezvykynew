// Export Spoonacular Recipes to Excel for Analysis
const fs = require('fs');
const ExcelJS = require('exceljs');

const SPOONACULAR_API_KEY = 'a1702279d5a144b88af0e35214379fdf';
const API_BASE = 'https://api.spoonacular.com';

// Basic translation dictionary
const translations = {
  'chicken': 'kurča', 'beef': 'hovädzie', 'pork': 'bravčové',
  'eggs': 'vajcia', 'milk': 'mlieko', 'cheese': 'syr',
  'rice': 'ryža', 'pasta': 'cestoviny', 'potato': 'zemiak',
  'onion': 'cibuľa', 'garlic': 'cesnak', 'tomato': 'rajčina',
  'salt': 'soľ', 'pepper': 'korenie', 'oil': 'olej',
  'butter': 'maslo', 'flour': 'múka', 'sugar': 'cukor'
};

function quickTranslate(text) {
  let result = text;
  for (const [en, sk] of Object.entries(translations)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, 'gi'), sk);
  }
  return result;
}

// Fetch recipes by type
async function fetchRecipes(type, count = 20) {
  try {
    console.log(`📥 Fetching ${count} ${type} recipes...`);
    
    const url = `${API_BASE}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&type=${type}&number=${count}&addRecipeNutrition=true&sort=popularity&maxReadyTime=60&minCalories=100&maxCalories=800`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Got ${data.results?.length || 0} ${type} recipes`);
    return data.results || [];
  } catch (error) {
    console.error(`❌ Failed to fetch ${type}:`, error.message);
    return [];
  }
}

// Get detailed recipe info
async function getRecipeDetails(recipeId) {
  try {
    const url = `${API_BASE}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    const response = await fetch(url);
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.warn(`Failed to get details for recipe ${recipeId}`);
    return null;
  }
}

// Process recipe for Excel
async function processRecipe(recipe, category) {
  console.log(`🔄 Processing: ${recipe.title}`);
  
  const details = await getRecipeDetails(recipe.id);
  if (!details) return null;

  // Get nutrition
  const getNutrient = (name) => {
    const nutrient = details.nutrition?.nutrients?.find(n => 
      n.name.toLowerCase().includes(name.toLowerCase())
    );
    return Math.round(nutrient?.amount || 0);
  };

  // Process ingredients
  const ingredients = details.extendedIngredients?.slice(0, 8).map(ing => ({
    original: ing.original,
    name: ing.name,
    amount: ing.amount,
    unit: ing.unit,
    translated: quickTranslate(ing.name)
  })) || [];

  return {
    id: details.id,
    originalTitle: details.title,
    translatedTitle: quickTranslate(details.title),
    category: category,
    description: details.summary?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
    prepTime: details.readyInMinutes || 0,
    servings: details.servings || 0,
    calories: getNutrient('Calories'),
    protein: getNutrient('Protein'),
    carbs: getNutrient('Carbohydrates'),
    fat: getNutrient('Fat'),
    fiber: getNutrient('Fiber'),
    image: details.image || '',
    sourceUrl: details.sourceUrl || '',
    ingredients: ingredients.map(i => i.original).join('; '),
    ingredientsTranslated: ingredients.map(i => `${i.translated} (${i.amount} ${i.unit})`).join('; '),
    instructions: details.instructions?.replace(/<[^>]*>/g, '').substring(0, 500) || '',
    diets: details.diets?.join(', ') || '',
    cuisines: details.cuisines?.join(', ') || '',
    dishTypes: details.dishTypes?.join(', ') || ''
  };
}

// Create Excel file
async function createExcelFile(recipes) {
  console.log(`📊 Creating Excel file with ${recipes.length} recipes...`);
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Spoonacular Recipes');

  // Add headers
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Original Title (EN)', key: 'originalTitle', width: 40 },
    { header: 'Translated Title (SK)', key: 'translatedTitle', width: 40 },
    { header: 'Quality Score (1-10)', key: 'qualityScore', width: 15 },
    { header: 'Manual Fix Needed?', key: 'needsFix', width: 15 },
    { header: 'Better Translation', key: 'betterTranslation', width: 40 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Prep Time (min)', key: 'prepTime', width: 15 },
    { header: 'Servings', key: 'servings', width: 10 },
    { header: 'Calories', key: 'calories', width: 10 },
    { header: 'Protein (g)', key: 'protein', width: 12 },
    { header: 'Carbs (g)', key: 'carbs', width: 12 },
    { header: 'Fat (g)', key: 'fat', width: 12 },
    { header: 'Fiber (g)', key: 'fiber', width: 12 },
    { header: 'Ingredients (EN)', key: 'ingredients', width: 50 },
    { header: 'Ingredients (SK)', key: 'ingredientsTranslated', width: 50 },
    { header: 'Instructions', key: 'instructions', width: 60 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Diets', key: 'diets', width: 20 },
    { header: 'Cuisines', key: 'cuisines', width: 20 },
    { header: 'Dish Types', key: 'dishTypes', width: 20 },
    { header: 'Image URL', key: 'image', width: 30 },
    { header: 'Source URL', key: 'sourceUrl', width: 30 }
  ];

  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F2FF' }
  };

  // Add data rows
  recipes.forEach((recipe, index) => {
    const row = worksheet.addRow({
      ...recipe,
      qualityScore: '', // Empty for manual filling
      needsFix: '', // Empty for manual filling  
      betterTranslation: '' // Empty for manual filling
    });

    // Highlight rows that definitely need translation fixes
    if (recipe.translatedTitle.includes('toho, čo jem') || 
        recipe.translatedTitle.includes('sporak') ||
        recipe.translatedTitle.length > 80) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFE6E6' } // Light red
      };
      worksheet.getCell(`E${row.number}`).value = 'YES - URGENT';
    }
  });

  // Add auto filter
  worksheet.autoFilter = {
    from: 'A1',
    to: `W${recipes.length + 1}`
  };

  // Freeze first row
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  // Save file
  const fileName = `spoonacular-recipes-${new Date().toISOString().split('T')[0]}.xlsx`;
  await workbook.xlsx.writeFile(fileName);
  
  console.log(`✅ Excel file created: ${fileName}`);
  return fileName;
}

// Main export function
async function exportRecipesToExcel() {
  console.log('🚀 Starting Spoonacular Recipe Export to Excel...\n');
  
  try {
    const allRecipes = [];
    
    // Fetch different categories
    const categories = [
      { name: 'breakfast', label: 'ranajky', count: 15 },
      { name: 'lunch', label: 'obed', count: 15 }, 
      { name: 'dinner', label: 'vecera', count: 15 },
      { name: 'snack', label: 'snack', count: 10 }
    ];

    for (const category of categories) {
      console.log(`\n📂 Processing ${category.name} category...`);
      
      const recipes = await fetchRecipes(category.name, category.count);
      
      for (const recipe of recipes) {
        const processed = await processRecipe(recipe, category.label);
        if (processed) {
          allRecipes.push(processed);
        }
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(`\n📊 Total recipes processed: ${allRecipes.length}`);
    
    // Create Excel file
    const fileName = await createExcelFile(allRecipes);
    
    console.log(`\n🎉 Export complete! File: ${fileName}`);
    console.log(`📝 Manual review columns added for quality assessment`);
    console.log(`🔴 Red rows = urgent translation fixes needed`);
    
    return fileName;
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  }
}

// Install ExcelJS if not present
async function checkDependencies() {
  try {
    require('exceljs');
  } catch (error) {
    console.log('📦 Installing ExcelJS...');
    const { execSync } = require('child_process');
    execSync('npm install exceljs', { stdio: 'inherit' });
    console.log('✅ ExcelJS installed');
  }
}

// Run export
if (require.main === module) {
  checkDependencies().then(() => {
    exportRecipesToExcel();
  });
}

module.exports = { exportRecipesToExcel };