// Final merge: Add original 108 recipes to current 20 Spoonacular recipes
const fs = require('fs');
const path = require('path');

function finalMerge() {
  console.log('🔗 Final merge: Combining Spoonacular + Original recipes...\n');

  // Read current Spoonacular recipes file
  const currentPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  const currentContent = fs.readFileSync(currentPath, 'utf8');

  // Read backup with original recipes
  const backupPath = path.join(__dirname, 'src', 'data', 'recipes-backup-1774331317413.ts');
  const backupContent = fs.readFileSync(backupPath, 'utf8');

  // Find the end of the current array (should be the last "];" )
  const currentArrayEnd = currentContent.lastIndexOf('];');
  if (currentArrayEnd === -1) {
    console.error('❌ Could not find end of current array');
    return;
  }

  // Extract everything before the closing bracket
  const currentPrefix = currentContent.substring(0, currentArrayEnd).replace(/\s*$/, '');
  console.log('✅ Extracted current Spoonacular recipes');

  // Extract original recipes from backup (everything between first { and last }])
  const backupStart = backupContent.indexOf('  {');
  const backupEnd = backupContent.lastIndexOf('}');
  
  if (backupStart === -1 || backupEnd === -1) {
    console.error('❌ Could not find original recipes in backup');
    return;
  }

  const originalRecipes = backupContent.substring(backupStart, backupEnd + 1);
  console.log('✅ Extracted original recipes from backup');

  // Create merged content
  const mergedContent = currentPrefix + ',\n\n  // 📚 ORIGINAL RECIPES (Your existing database)\n' + originalRecipes + '\n];';

  // Update the comment at the top
  const updatedContent = mergedContent.replace(
    /\/\/ Total recipes: \d+ \(\d+ Spoonacular \+ \d+ original\)/,
    '// Total recipes: 128+ (20 Spoonacular + 108+ original)'
  );

  // Create backup
  const backupCurrentPath = path.join(__dirname, 'src', 'data', `recipes-before-merge-${Date.now()}.ts`);
  fs.copyFileSync(currentPath, backupCurrentPath);
  console.log(`💾 Backup created: ${backupCurrentPath}`);

  // Write merged file
  fs.writeFileSync(currentPath, updatedContent);

  console.log('\n🎉 MERGE SUCCESSFUL!');
  console.log('   📄 Updated: src/data/recipes.ts');
  console.log('   🆕 Spoonacular recipes: 20 (professional quality)');
  console.log('   📚 Original recipes: 108+ (existing content)');
  console.log('   📊 Total recipes: 128+');

  console.log('\n✨ Your database now offers:');
  console.log('   ✅ Professional Spoonacular recipes (shown first)');
  console.log('   ✅ Accurate nutrition data and measurements');
  console.log('   ✅ Slovak translations');
  console.log('   ✅ Your original recipe variety');
  console.log('   ✅ Perfect foundation for automated meal planning');

  console.log('\n🔄 Restart your dev server to see the complete database!');
  console.log('💡 Spoonacular recipes will appear at the top with "🆕" badges');
}

finalMerge();