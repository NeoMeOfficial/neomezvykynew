// Simple merge of Spoonacular + Original recipes
const fs = require('fs');
const path = require('path');

function simpleMerge() {
  console.log('🔄 Simple merge: Adding original recipes to Spoonacular database...\n');

  // Read original backup file (should be valid TypeScript)
  const backupPath = path.join(__dirname, 'src', 'data', 'recipes-backup-1774331317413.ts');
  const backupContent = fs.readFileSync(backupPath, 'utf8');
  
  // Read current Spoonacular file
  const currentPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  const currentContent = fs.readFileSync(currentPath, 'utf8');

  // Extract just the Spoonacular recipe objects from current file
  const spoonacularMatch = currentContent.match(/(\{[\s\S]*?id: 'spoon-[\s\S]*?\})/g);
  console.log(`✅ Found ${spoonacularMatch?.length || 0} Spoonacular recipes`);

  // Extract original recipe objects from backup
  const originalMatch = backupContent.match(/(\{[\s\S]*?id: '(?!spoon-)[\s\S]*?\})/g);
  console.log(`✅ Found ${originalMatch?.length || 0} original recipes`);

  if (!spoonacularMatch || !originalMatch) {
    console.error('❌ Could not extract recipes properly');
    return;
  }

  // Create new file content with proper TypeScript format
  const newContent = `// Enhanced Recipe Database - Professional Spoonacular + Original
// Generated: ${new Date().toISOString()}
// Spoonacular: ${spoonacularMatch.length} | Original: ${originalMatch.length} | Total: ${spoonacularMatch.length + originalMatch.length}

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

export const recipes: Recipe[] = [
  // 🆕 SPOONACULAR RECIPES (Professional quality, Slovak translated)
${spoonacularMatch.map(recipe => '  ' + recipe).join(',\n')},

  // 📚 ORIGINAL RECIPES (Your existing database)
${originalMatch.map(recipe => '  ' + recipe).join(',\n')}
];`;

  // Create backup of current
  const backupCurrentPath = path.join(__dirname, 'src', 'data', `recipes-current-backup-${Date.now()}.ts`);
  fs.copyFileSync(currentPath, backupCurrentPath);
  console.log(`💾 Current backup: ${backupCurrentPath}`);

  // Write merged content
  fs.writeFileSync(currentPath, newContent);

  console.log(`\n🎉 MERGE COMPLETE!`);
  console.log(`   📄 New database: ${currentPath}`);
  console.log(`   🆕 Spoonacular recipes: ${spoonacularMatch.length}`);
  console.log(`   📚 Original recipes: ${originalMatch.length}`);
  console.log(`   📊 Total recipes: ${spoonacularMatch.length + originalMatch.length}`);

  console.log('\n✨ Your app now has the best of both worlds:');
  console.log('   ✅ Professional Spoonacular recipes (100% quality)');
  console.log('   ✅ Your original content (for variety)');
  console.log('   ✅ Perfect foundation for meal planning');

  console.log('\n🔄 Restart dev server to see all recipes!');
}

simpleMerge();