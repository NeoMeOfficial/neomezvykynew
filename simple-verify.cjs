// Simple Recipe Database Verification
const fs = require('fs');
const path = require('path');

// Import recipes by requiring the compiled data
async function analyzeRecipes() {
  try {
    console.log('🔍 Analyzing recipe database...\n');
    
    // Import recipes directly (will work with TypeScript compiled to JS)
    const recipesModule = require('./src/data/recipes.ts');
    const recipes = recipesModule.recipes || [];
    
    console.log(`📊 Found ${recipes.length} total recipes\n`);
    
    // Quick quality analysis
    const analysis = {
      total: recipes.length,
      spoonacular: 0,
      original: 0,
      issues: {
        emptyIngredients: 0,
        noImages: 0,
        lowCalories: 0,
        highCalories: 0,
        noSteps: 0,
        shortSteps: 0,
        badMeasurements: 0
      },
      categories: {}
    };

    // Common OCR error patterns
    const ocrPatterns = [
      /\d+[a-zA-Z]+\d+/, // Numbers mixed with letters
      /\s+\d+\s*[a-zA-Z]\s*\d+/, // Spaced patterns
      /OCR|0CR/i, // OCR mentions
      /^\s*$/, // Empty strings
    ];

    // Common nonsense measurements
    const badMeasurements = [
      /\d+\s*ks\s*ks/i, // Double "ks"
      /\d+\s*ml\s*ml/i, // Double "ml"
      /\d+\s*g\s*g/i,   // Double "g"
      /\d+\.\d+\.\d+/,  // Multiple decimals
    ];

    recipes.forEach((recipe, index) => {
      // Count categories
      analysis.categories[recipe.category] = (analysis.categories[recipe.category] || 0) + 1;
      
      // Count Spoonacular vs original
      if (recipe.id?.startsWith('spoon-')) {
        analysis.spoonacular++;
      } else {
        analysis.original++;
      }

      // Check for issues
      if (!recipe.ingredients || recipe.ingredients.length === 0) {
        analysis.issues.emptyIngredients++;
      }

      if (!recipe.image || !recipe.image.startsWith('http')) {
        analysis.issues.noImages++;
      }

      if (recipe.calories < 50 || recipe.calories === 0) {
        analysis.issues.lowCalories++;
      }

      if (recipe.calories > 1500) {
        analysis.issues.highCalories++;
      }

      if (!recipe.steps || recipe.steps.length === 0) {
        analysis.issues.noSteps++;
      }

      if (recipe.steps && recipe.steps.some(step => step.length < 20)) {
        analysis.issues.shortSteps++;
      }

      // Check ingredient measurements for OCR artifacts
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          if (!ing.amount || ocrPatterns.some(pattern => pattern.test(ing.amount))) {
            analysis.issues.badMeasurements++;
          }
          
          if (badMeasurements.some(pattern => pattern.test(ing.amount))) {
            analysis.issues.badMeasurements++;
          }
        });
      }
    });

    // Print analysis
    console.log('📊 DATABASE ANALYSIS RESULTS');
    console.log('='.repeat(40));
    console.log(`Total Recipes: ${analysis.total}`);
    console.log(`🆕 Spoonacular: ${analysis.spoonacular} (${Math.round(analysis.spoonacular/analysis.total*100)}%)`);
    console.log(`📚 Original OCR: ${analysis.original} (${Math.round(analysis.original/analysis.total*100)}%)`);
    
    console.log('\n📊 BY CATEGORY:');
    Object.entries(analysis.categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} recipes`);
    });

    console.log('\n⚠️ QUALITY ISSUES FOUND:');
    const totalIssues = Object.values(analysis.issues).reduce((sum, count) => sum + count, 0);
    console.log(`   Total Issues: ${totalIssues}`);
    console.log(`   📝 Empty ingredients: ${analysis.issues.emptyIngredients}`);
    console.log(`   🖼️ Missing images: ${analysis.issues.noImages}`);
    console.log(`   🔢 Low calories (<50): ${analysis.issues.lowCalories}`);
    console.log(`   🔢 High calories (>1500): ${analysis.issues.highCalories}`);
    console.log(`   📋 No preparation steps: ${analysis.issues.noSteps}`);
    console.log(`   📝 Short steps (<20 chars): ${analysis.issues.shortSteps}`);
    console.log(`   ⚖️ Bad measurements: ${analysis.issues.badMeasurements}`);

    // Quality score
    const qualityScore = Math.round(((analysis.total - totalIssues) / analysis.total) * 100);
    console.log(`\n🎯 QUALITY SCORE: ${qualityScore}%`);
    
    if (qualityScore >= 80) {
      console.log('✅ Database quality is GOOD');
    } else if (qualityScore >= 60) {
      console.log('⚠️ Database quality is FAIR - consider improvements');
    } else {
      console.log('❌ Database quality is POOR - needs significant cleanup');
    }

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (analysis.issues.badMeasurements > 10) {
      console.log(`   🔧 Fix ${analysis.issues.badMeasurements} measurement formatting issues`);
    }
    
    if (analysis.issues.emptyIngredients > 5) {
      console.log(`   📝 Add missing ingredients to ${analysis.issues.emptyIngredients} recipes`);
    }
    
    if (analysis.original > analysis.spoonacular) {
      console.log(`   🆕 Add more Spoonacular recipes to improve quality`);
    }
    
    if (analysis.issues.noSteps > 0) {
      console.log(`   📋 Add preparation steps to ${analysis.issues.noSteps} recipes`);
    }

    console.log('\n✨ Continue adding Spoonacular recipes for best quality!');

    return analysis;

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    
    // Fallback: simple file check
    const recipesPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
    if (fs.existsSync(recipesPath)) {
      const content = fs.readFileSync(recipesPath, 'utf8');
      const spoonacularCount = (content.match(/spoon-/g) || []).length;
      const recipeCount = (content.match(/{\s*id:/g) || []).length;
      
      console.log(`📊 Fallback analysis:`);
      console.log(`   Total recipe objects: ~${recipeCount}`);
      console.log(`   Spoonacular recipes: ~${spoonacularCount}`);
      console.log(`   Original recipes: ~${recipeCount - spoonacularCount}`);
    }
  }
}

// Show problematic recipes for manual review
function showProblematicRecipes() {
  console.log('\n🔍 FINDING PROBLEMATIC RECIPES FOR MANUAL REVIEW...\n');
  
  try {
    const recipesModule = require('./src/data/recipes.ts');
    const recipes = recipesModule.recipes || [];
    
    const problematic = [];

    recipes.forEach((recipe, index) => {
      const issues = [];
      
      // Check for major issues
      if (!recipe.ingredients || recipe.ingredients.length === 0) {
        issues.push('No ingredients');
      }
      
      if (!recipe.steps || recipe.steps.length === 0) {
        issues.push('No steps');
      }
      
      if (recipe.calories === 0 || recipe.calories > 1200) {
        issues.push(`Calories: ${recipe.calories}`);
      }
      
      // Check for OCR artifacts in ingredients
      if (recipe.ingredients) {
        const badIngredients = recipe.ingredients.filter(ing => 
          !ing.amount || ing.amount.length < 2 || /\d+[a-zA-Z]+\d+/.test(ing.amount)
        );
        if (badIngredients.length > 0) {
          issues.push(`${badIngredients.length} bad ingredients`);
        }
      }

      if (issues.length >= 2) { // 2+ issues = problematic
        problematic.push({
          index,
          id: recipe.id,
          title: recipe.title,
          category: recipe.category,
          issues: issues.join(', ')
        });
      }
    });

    // Show worst 10
    console.log(`🚨 Found ${problematic.length} problematic recipes (showing worst 10):\n`);
    
    problematic
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 10)
      .forEach((recipe, i) => {
        console.log(`${i + 1}. "${recipe.title}"`);
        console.log(`   ID: ${recipe.id} | Category: ${recipe.category}`);
        console.log(`   Issues: ${recipe.issues}\n`);
      });

    return problematic;

  } catch (error) {
    console.error('Could not analyze problematic recipes:', error.message);
  }
}

// Run analysis
analyzeRecipes().then(() => {
  showProblematicRecipes();
});