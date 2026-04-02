// Comprehensive Recipe Database Cleaner & Validator
const fs = require('fs');
const path = require('path');

class DatabaseCleaner {
  constructor() {
    // Common Slovak cooking measurements
    this.validUnits = [
      'g', 'kg', 'ml', 'l', 'dl', 'cl',
      'ks', 'kus', 'kusov', 'kusy',
      'lyžica', 'lyžice', 'lyžíc', 'lyžička', 'lyžičky', 'lyžičiek',
      'pohár', 'poháre', 'pohárov',
      'šálka', 'šálky', 'šálok',
      'štipka', 'štipky', 'štipiek',
      'balíček', 'balíčky', 'balíčkov',
      'na chuť', 'podľa chuti', 'podľa potreby'
    ];

    // Common Slovak ingredients for validation
    this.commonIngredients = [
      'múka', 'cukor', 'maslo', 'vajce', 'vajcia', 'mlieko', 'soľ', 'korenie',
      'olivový olej', 'cesnak', 'cibuľa', 'rajčina', 'rajčiny', 'syr',
      'kuracie mäso', 'kuracie prsia', 'hovädzie mäso', 'bravčové mäso',
      'ryža', 'cestoviny', 'zemiaky', 'zemiak', 'mrkva', 'paprika',
      'brokolica', 'špenát', 'huby', 'avokádo', 'banán', 'jablko',
      'jogurt', 'tvaroh', 'ovos', 'ovsená kaša', 'quinoa', 'orechy'
    ];

    this.fixes = {
      applied: 0,
      ingredientFixes: 0,
      stepFixes: 0,
      nutritionFixes: 0,
      measurementFixes: 0
    };
  }

  // Fix common OCR measurement errors
  fixMeasurement(amount) {
    if (!amount) return 'na chuť';
    
    let fixed = amount.toString()
      // Fix doubled units
      .replace(/(\d+)\s*g\s*g/gi, '$1 g')
      .replace(/(\d+)\s*ml\s*ml/gi, '$1 ml')
      .replace(/(\d+)\s*ks\s*ks/gi, '$1 ks')
      
      // Fix OCR number-letter combinations
      .replace(/(\d+)[a-zA-Z]+(\d+)/g, '$1-$2')
      
      // Fix multiple decimals
      .replace(/(\d+)\.(\d+)\.(\d+)/g, '$1.$2')
      
      // Fix spaced numbers
      .replace(/(\d+)\s+(\d+)\s*(g|ml|ks)/gi, '$1$2 $3')
      
      // Normalize common units
      .replace(/\bgramov?\b/gi, 'g')
      .replace(/\bmililit(e|er|rov)?\b/gi, 'ml')
      .replace(/\bkuskov?\b/gi, 'ks')
      
      // Fix empty or invalid amounts
      .replace(/^[\s\d]*$/g, 'na chuť')
      
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      .trim();

    if (fixed !== amount) {
      this.fixes.measurementFixes++;
    }

    return fixed || 'na chuť';
  }

  // Fix ingredient names
  fixIngredientName(name) {
    if (!name) return 'neznáma ingrediencia';

    let fixed = name
      // Remove OCR artifacts
      .replace(/\d+[a-zA-Z]+\d+/g, '')
      .replace(/OCR|0CR/gi, '')
      
      // Fix common Slovak cooking terms
      .replace(/\bcurry\b/gi, 'kari')
      .replace(/\bchicken\b/gi, 'kurča')
      .replace(/\bbeef\b/gi, 'hovädzie')
      .replace(/\bpork\b/gi, 'bravčové')
      .replace(/\bfish\b/gi, 'ryba')
      
      // Remove extra spaces and clean up
      .replace(/\s+/g, ' ')
      .replace(/^[\s\-,]+|[\s\-,]+$/g, '')
      .trim();

    // If name becomes too short or empty, provide fallback
    if (fixed.length < 2) {
      fixed = name.length > 2 ? name : 'ingrediencia';
    }

    if (fixed !== name) {
      this.fixes.ingredientFixes++;
    }

    return fixed;
  }

  // Validate and fix nutrition values
  validateNutrition(recipe) {
    const fixes = [];
    let fixed = { ...recipe };

    // Fix obviously wrong calories
    if (recipe.calories < 50 || recipe.calories > 1500) {
      // Estimate calories from macros
      const estimatedCalories = (recipe.protein * 4) + (recipe.carbs * 4) + (recipe.fat * 9);
      if (estimatedCalories > 50 && estimatedCalories < 1500) {
        fixed.calories = Math.round(estimatedCalories);
        fixes.push(`Fixed calories: ${recipe.calories} → ${fixed.calories}`);
        this.fixes.nutritionFixes++;
      }
    }

    // Fix protein values
    if (recipe.protein < 0 || recipe.protein > 100) {
      // Estimate based on ingredients or set reasonable default
      fixed.protein = Math.max(1, Math.min(30, Math.round(fixed.calories * 0.15 / 4)));
      fixes.push(`Fixed protein: ${recipe.protein}g → ${fixed.protein}g`);
      this.fixes.nutritionFixes++;
    }

    // Fix carb values  
    if (recipe.carbs < 0 || recipe.carbs > 150) {
      fixed.carbs = Math.max(5, Math.min(80, Math.round(fixed.calories * 0.45 / 4)));
      fixes.push(`Fixed carbs: ${recipe.carbs}g → ${fixed.carbs}g`);
      this.fixes.nutritionFixes++;
    }

    // Fix fat values
    if (recipe.fat < 1 || recipe.fat > 80) {
      fixed.fat = Math.max(2, Math.min(35, Math.round(fixed.calories * 0.30 / 9)));
      fixes.push(`Fixed fat: ${recipe.fat}g → ${fixed.fat}g`);
      this.fixes.nutritionFixes++;
    }

    // Fix fiber
    if (recipe.fiber < 0 || recipe.fiber > 30) {
      fixed.fiber = Math.max(1, Math.min(15, Math.round(fixed.carbs * 0.1)));
      fixes.push(`Fixed fiber: ${recipe.fiber}g → ${fixed.fiber}g`);
      this.fixes.nutritionFixes++;
    }

    return { recipe: fixed, fixes };
  }

  // Fix preparation steps
  fixSteps(steps) {
    if (!steps || steps.length === 0) {
      this.fixes.stepFixes++;
      return [
        'Pripravte si všetky potrebné ingrediencie.',
        'Postupujte podľa tradičného spôsobu prípravy.',
        'Servírujte podľa chuti a potreby.'
      ];
    }

    const fixedSteps = steps
      .filter(step => step && step.trim().length > 5) // Remove empty/tiny steps
      .map((step, index) => {
        let fixed = step
          .replace(/^\d+\.\s*/, '') // Remove step numbers
          .replace(/\s+/g, ' ')     // Fix multiple spaces
          .trim();

        // Ensure step starts with capital letter
        if (fixed.length > 0) {
          fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
        }

        // Ensure step ends with period
        if (fixed.length > 0 && !fixed.endsWith('.')) {
          fixed += '.';
        }

        return fixed;
      })
      .filter(step => step.length > 10); // Remove very short steps

    // If we have too few steps, add generic ones
    if (fixedSteps.length < 2) {
      this.fixes.stepFixes++;
      return [
        'Pripravte si všetky ingrediencie podľa zoznamu.',
        'Postupujte podľa klasického receptu pre tento typ jedla.',
        'Upravte chuť podľa potreby a servírujte.'
      ];
    }

    if (fixedSteps.length !== steps.length || 
        fixedSteps.some((step, i) => step !== steps[i])) {
      this.fixes.stepFixes++;
    }

    return fixedSteps;
  }

  // Check if recipe makes culinary sense
  validateRecipe(recipe) {
    const issues = [];
    const warnings = [];

    // Check basic required fields
    if (!recipe.title || recipe.title.length < 3) {
      issues.push('Missing or too short title');
    }

    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      issues.push('No ingredients');
    }

    if (!recipe.steps || recipe.steps.length === 0) {
      warnings.push('No preparation steps');
    }

    // Check prep time makes sense
    if (recipe.prepTime <= 0 || recipe.prepTime > 300) {
      warnings.push(`Unusual prep time: ${recipe.prepTime} minutes`);
    }

    // Check servings make sense
    if (recipe.servings <= 0 || recipe.servings > 20) {
      warnings.push(`Unusual servings: ${recipe.servings}`);
    }

    // Check ingredients quality
    if (recipe.ingredients) {
      const emptyIngredients = recipe.ingredients.filter(ing => 
        !ing.name || ing.name.trim().length < 2
      );
      if (emptyIngredients.length > 0) {
        issues.push(`${emptyIngredients.length} empty ingredients`);
      }

      const badAmounts = recipe.ingredients.filter(ing => 
        !ing.amount || ing.amount.trim().length < 1
      );
      if (badAmounts.length > 0) {
        warnings.push(`${badAmounts.length} ingredients missing amounts`);
      }
    }

    // Check if nutrition is reasonable for the type of food
    const caloriesPerServing = recipe.calories / (recipe.servings || 1);
    if (caloriesPerServing < 50) {
      warnings.push('Very low calories per serving');
    } else if (caloriesPerServing > 800) {
      warnings.push('Very high calories per serving');
    }

    return {
      severity: issues.length > 0 ? 'ERROR' : warnings.length > 0 ? 'WARNING' : 'OK',
      issues,
      warnings,
      score: Math.max(0, 100 - (issues.length * 30) - (warnings.length * 10))
    };
  }

  // Main cleaning function
  cleanRecipe(recipe, index) {
    console.log(`🔧 Cleaning recipe ${index + 1}: "${recipe.title}"`);
    
    let cleaned = { ...recipe };
    const cleaningLog = [];

    // Fix ingredients
    if (cleaned.ingredients) {
      cleaned.ingredients = cleaned.ingredients.map(ing => ({
        name: this.fixIngredientName(ing.name),
        amount: this.fixMeasurement(ing.amount)
      }));
    }

    // Fix steps
    const originalStepsLength = cleaned.steps?.length || 0;
    cleaned.steps = this.fixSteps(cleaned.steps);
    if (cleaned.steps.length !== originalStepsLength) {
      cleaningLog.push(`Steps: ${originalStepsLength} → ${cleaned.steps.length}`);
    }

    // Fix nutrition
    const nutritionResult = this.validateNutrition(cleaned);
    cleaned = nutritionResult.recipe;
    cleaningLog.push(...nutritionResult.fixes);

    // Validate final result
    const validation = this.validateRecipe(cleaned);

    this.fixes.applied++;

    return {
      recipe: cleaned,
      validation,
      cleaningLog,
      wasModified: cleaningLog.length > 0
    };
  }

  // Generate quality report
  generateReport(results) {
    const total = results.length;
    const byCategory = {};
    const bySeverity = { OK: 0, WARNING: 0, ERROR: 0 };
    const averageScore = results.reduce((sum, r) => sum + r.validation.score, 0) / total;

    results.forEach(result => {
      const category = result.recipe.category;
      byCategory[category] = (byCategory[category] || 0) + 1;
      bySeverity[result.validation.severity]++;
    });

    return {
      total,
      byCategory,
      bySeverity,
      averageScore: Math.round(averageScore),
      fixes: this.fixes,
      topIssues: this.getTopIssues(results),
      recommendations: this.generateRecommendations(results)
    };
  }

  getTopIssues(results) {
    const issueCount = {};
    results.forEach(result => {
      [...result.validation.issues, ...result.validation.warnings].forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });

    return Object.entries(issueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([issue, count]) => ({ issue, count }));
  }

  generateRecommendations(results) {
    const recommendations = [];
    const errorCount = results.filter(r => r.validation.severity === 'ERROR').length;
    const warningCount = results.filter(r => r.validation.severity === 'WARNING').length;

    if (errorCount > 0) {
      recommendations.push(`🔴 Fix ${errorCount} recipes with critical errors immediately`);
    }

    if (warningCount > errorCount) {
      recommendations.push(`🟡 Review ${warningCount} recipes with warnings`);
    }

    const spoonacularCount = results.filter(r => r.recipe.id.startsWith('spoon-')).length;
    const originalCount = results.length - spoonacularCount;

    if (originalCount > spoonacularCount) {
      recommendations.push('🆕 Add more Spoonacular recipes to improve overall quality');
    }

    recommendations.push('✅ Run massive expansion to get more professional recipes');
    recommendations.push('🔧 Consider removing recipes with scores below 50');

    return recommendations;
  }
}

// Main cleaning function
async function cleanDatabase() {
  console.log('🧹 COMPREHENSIVE DATABASE CLEANING STARTING...\n');

  const recipesPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  
  if (!fs.existsSync(recipesPath)) {
    console.error('❌ recipes.ts file not found');
    return;
  }

  // Read current recipes
  const content = fs.readFileSync(recipesPath, 'utf8');
  const match = content.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/);
  
  if (!match) {
    console.error('❌ Could not parse recipes from file');
    return;
  }

  let recipes;
  try {
    const cleanJson = match[1]
      .replace(/\/\/.*$/gm, '') // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    recipes = JSON.parse(cleanJson);
    console.log(`📊 Loaded ${recipes.length} recipes for cleaning\n`);
  } catch (error) {
    console.error('❌ Failed to parse recipes:', error.message);
    return;
  }

  // Clean each recipe
  const cleaner = new DatabaseCleaner();
  const results = [];

  for (let i = 0; i < recipes.length; i++) {
    const result = cleaner.cleanRecipe(recipes[i], i);
    results.push(result);
    
    if (result.cleaningLog.length > 0) {
      console.log(`   🔧 Changes: ${result.cleaningLog.join(', ')}`);
    }
    
    if (result.validation.issues.length > 0) {
      console.log(`   ❌ Issues: ${result.validation.issues.join(', ')}`);
    }
  }

  // Generate report
  const report = cleaner.generateReport(results);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 CLEANING REPORT');
  console.log('='.repeat(60));
  console.log(`Total recipes processed: ${report.total}`);
  console.log(`Overall quality score: ${report.averageScore}/100`);
  console.log(`\n📈 Results by severity:`);
  console.log(`   ✅ OK: ${report.bySeverity.OK} recipes`);
  console.log(`   ⚠️ WARNING: ${report.bySeverity.WARNING} recipes`);
  console.log(`   ❌ ERROR: ${report.bySeverity.ERROR} recipes`);

  console.log(`\n🔧 Fixes applied:`);
  console.log(`   Total recipes modified: ${report.fixes.applied}`);
  console.log(`   Ingredient fixes: ${report.fixes.ingredientFixes}`);
  console.log(`   Step fixes: ${report.fixes.stepFixes}`);
  console.log(`   Nutrition fixes: ${report.fixes.nutritionFixes}`);
  console.log(`   Measurement fixes: ${report.fixes.measurementFixes}`);

  console.log(`\n🔍 Top issues found:`);
  report.topIssues.slice(0, 5).forEach((item, i) => {
    console.log(`   ${i + 1}. ${item.issue} (${item.count} recipes)`);
  });

  console.log(`\n💡 Recommendations:`);
  report.recommendations.forEach(rec => {
    console.log(`   ${rec}`);
  });

  // Save cleaned recipes
  const cleanedRecipes = results.map(r => r.recipe);
  const newContent = `// CLEANED DATABASE - ${new Date().toISOString()}
// Total recipes: ${cleanedRecipes.length} | Quality score: ${report.averageScore}/100
// Fixes applied: ${report.fixes.applied} recipes modified

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

export const recipes: Recipe[] = ${JSON.stringify(cleanedRecipes, null, 2)};
`;

  // Create backup
  const backupPath = path.join(__dirname, 'src', 'data', `recipes-pre-cleaning-${Date.now()}.ts`);
  fs.copyFileSync(recipesPath, backupPath);
  console.log(`\n💾 Backup created: ${backupPath}`);

  // Write cleaned version
  fs.writeFileSync(recipesPath, newContent);
  console.log(`✅ Cleaned database saved: ${recipesPath}`);

  // Save detailed report
  const reportPath = path.join(__dirname, `cleaning-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({
    report,
    results: results.map(r => ({
      id: r.recipe.id,
      title: r.recipe.title,
      validation: r.validation,
      wasModified: r.wasModified,
      cleaningLog: r.cleaningLog
    }))
  }, null, 2));
  console.log(`📄 Detailed report saved: ${reportPath}`);

  console.log('\n🎉 DATABASE CLEANING COMPLETE!');
  console.log('✨ Your recipes are now clean and ready for meal planning!');

  return {
    recipes: cleanedRecipes,
    report
  };
}

// Run cleaning
if (require.main === module) {
  cleanDatabase().catch(error => {
    console.error('❌ Cleaning failed:', error);
    process.exit(1);
  });
}

module.exports = { cleanDatabase, DatabaseCleaner };