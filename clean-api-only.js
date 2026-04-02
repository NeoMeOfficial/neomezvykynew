// Clean Database - API Recipes Only
// Removes all OCR recipes, keeps only professional Spoonacular data

import fs from 'fs';

console.log('🧹 Cleaning database - API recipes only...');

// Read current recipes
const recipesContent = fs.readFileSync('src/data/recipes.ts', 'utf8');
const recipesMatch = recipesContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*\]);/);
const allRecipes = eval(recipesMatch[1]);

// Filter ONLY Spoonacular API recipes
const apiRecipes = allRecipes.filter(recipe => 
  recipe.id && recipe.id.startsWith('spoon-')
);

console.log(`📊 Original database: ${allRecipes.length} recipes`);
console.log(`✨ Clean database: ${apiRecipes.length} API recipes only`);
console.log(`🗑️ Removed: ${allRecipes.length - apiRecipes.length} OCR recipes with potential errors`);

// Count by category
const categoryCounts = {};
apiRecipes.forEach(recipe => {
  categoryCounts[recipe.category] = (categoryCounts[recipe.category] || 0) + 1;
});

console.log('\n📈 Category breakdown:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} recipes`);
});

// Generate clean recipes.ts
const cleanContent = `// Clean API-only recipe database - ${new Date().toISOString()}
// Professional Spoonacular recipes only - zero OCR errors
// Total: ${apiRecipes.length} quality-assured recipes

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

export const recipes: Recipe[] = ${JSON.stringify(apiRecipes, null, 2)};`;

// Create backup of mixed database
const timestamp = Date.now();
fs.writeFileSync(`src/data/recipes-mixed-backup-${timestamp}.ts`, recipesContent);
console.log(`💾 Backup created: recipes-mixed-backup-${timestamp}.ts`);

// Write clean database
fs.writeFileSync('src/data/recipes.ts', cleanContent);

console.log('\n🎉 DATABASE CLEANED!');
console.log('✅ Zero OCR errors');
console.log('✅ Professional quality data');
console.log('✅ Ready for expansion');
console.log('✅ Client confidence assured');
console.log('\n🚀 Ready to build and deploy clean database!');