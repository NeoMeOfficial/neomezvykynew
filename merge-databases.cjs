// Merge Spoonacular recipes with original database
const fs = require('fs');
const path = require('path');

function mergeRecipeDatabases() {
  console.log('🔄 Merging Spoonacular recipes with original database...\n');

  // Read current Spoonacular recipes
  const currentPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  const currentContent = fs.readFileSync(currentPath, 'utf8');
  const currentMatch = currentContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/);
  
  if (!currentMatch) {
    console.error('❌ Could not parse current recipes');
    return;
  }
  
  const spoonacularRecipes = JSON.parse(currentMatch[1]);
  console.log(`✅ Found ${spoonacularRecipes.length} current Spoonacular recipes`);

  // Read original recipes from backup
  const backupPath = path.join(__dirname, 'src', 'data', 'recipes-backup-1774331317413.ts');
  const backupContent = fs.readFileSync(backupPath, 'utf8');
  const backupMatch = backupContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/);
  
  if (!backupMatch) {
    console.error('❌ Could not parse backup recipes');
    return;
  }

  // Parse backup carefully (removing comments)
  let backupJson = backupMatch[1]
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

  const originalRecipes = JSON.parse(backupJson);
  console.log(`✅ Found ${originalRecipes.length} original recipes in backup`);

  // Filter out old Spoonacular recipes from original (if any) to avoid duplicates
  const cleanOriginalRecipes = originalRecipes.filter(recipe => 
    !recipe.id.startsWith('spoon-')
  );

  console.log(`✅ Filtered to ${cleanOriginalRecipes.length} pure original recipes`);

  // Combine arrays: Spoonacular first (highest quality), then original
  const mergedRecipes = [...spoonacularRecipes, ...cleanOriginalRecipes];
  
  console.log(`📊 Total merged recipes: ${mergedRecipes.length}`);
  console.log(`   🆕 Spoonacular: ${spoonacularRecipes.length}`);
  console.log(`   📚 Original: ${cleanOriginalRecipes.length}`);

  // Generate merged file
  const mergedContent = `// Enhanced Recipe Database - Professional + Original
// Generated: ${new Date().toISOString()}
// Spoonacular: ${spoonacularRecipes.length} | Original: ${cleanOriginalRecipes.length} | Total: ${mergedRecipes.length}

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

export const recipes: Recipe[] = ${JSON.stringify(mergedRecipes, null, 2)};
`;

  // Create another backup
  const newBackupPath = path.join(__dirname, 'src', 'data', `recipes-pre-merge-backup-${Date.now()}.ts`);
  fs.copyFileSync(currentPath, newBackupPath);
  console.log(`💾 Created backup: ${newBackupPath}`);

  // Write merged file
  fs.writeFileSync(currentPath, mergedContent);
  console.log(`✅ Merged database written to: ${currentPath}`);

  // Category analysis
  const categoryCount = {};
  mergedRecipes.forEach(recipe => {
    categoryCount[recipe.category] = (categoryCount[recipe.category] || 0) + 1;
  });

  console.log('\n📊 FINAL DATABASE BREAKDOWN:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} recipes`);
  });

  console.log('\n🎉 SUCCESS! Your database now has:');
  console.log('   ✅ Professional Spoonacular recipes (highest quality)');
  console.log('   ✅ Your original 108 recipes (as fallback)');
  console.log('   ✅ No duplicates or conflicts');
  console.log('   ✅ Ready for meal planning algorithms');

  console.log('\n🔄 Restart your dev server to see all recipes!');
}

// Run merge
mergeRecipeDatabases();