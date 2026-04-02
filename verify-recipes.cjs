// Recipe Database Verification & Quality Control System
const fs = require('fs');
const path = require('path');

// Quality checks for recipes
class RecipeValidator {
  constructor() {
    this.issues = [];
    this.suspiciousPatterns = [
      // OCR artifacts
      /[0O]CR|OCR/i,                    // OCR mentions
      /\d+[a-zA-Z]{2,}/,                // Numbers stuck to letters (OCR error)
      /[a-zA-Z]\d+[a-zA-Z]/,           // Letter-number-letter patterns
      /\s+\d+\s*[a-zA-Z]\s*\d+/,       // Spaced number-letter-number
      
      // Measurement nonsense
      /\d+\s*ks\s*ks/i,                // Duplicated "ks"
      /\d+\s*ml\s*ml/i,                // Duplicated "ml"
      /\d+\s*g\s*g/i,                  // Duplicated "g"
      /\d+\.\d+\.\d+/,                 // Multiple decimals
      /\d+\s*,\s*\d+\s*,\s*\d+/,      // Multiple commas in numbers
      
      // Nonsense measurements
      /\d+\s*(pieces?|kusov|kus)\s*ml/i, // "pieces ml"
      /\d+\s*ml\s*(kusov|kus)/i,         // "ml pieces"
      /\d+\s*kg\s*ml/i,                  // "kg ml"
      /\d+\s*l\s*g/i,                    // "l g"
      
      // Empty or invalid amounts
      /^\s*$|^undefined$|^null$/,       // Empty amounts
      /^\d+\s*$|^\s*\d+$/,             // Numbers without units
      /[^\w\s.,\-]/,                    // Special characters
      
      // Suspicious ingredients
      /lorem ipsum/i,                   // Placeholder text
      /test|debug|sample/i,             // Test data
      /xxx|yyy|zzz/i,                   // Placeholder variables
      /\d{3,}/,                        // Long numbers (possibly IDs)
    ];

    this.validUnits = [
      'g', 'kg', 'ml', 'l', 'dl', 'cl',
      'ks', 'kus', 'kusov', 'kusy',
      'lyžica', 'lyžice', 'lyžíc',
      'pohár', 'poháre', 'pohárov',
      'šálka', 'šálky', 'šálok',
      'štipka', 'štipky', 'štipiek',
      'balíček', 'balíčky', 'balíčkov',
      'na chuť', 'podľa chuti'
    ];

    this.commonIngredients = [
      'múka', 'cukor', 'maslo', 'vajce', 'mlieko', 'soľ', 'korenie',
      'olivový olej', 'cesnak', 'cibuľa', 'rajčina', 'syr', 'šunka',
      'kuracie mäso', 'hovädzie mäso', 'bravčové mäso', 'ryba',
      'ryža', 'cestoviny', 'zemiaky', 'mrkva', 'paprika', 'uhorka'
    ];
  }

  // Check individual recipe
  validateRecipe(recipe, index) {
    const recipeIssues = [];

    // Check basic fields
    if (!recipe.title || recipe.title.trim().length < 3) {
      recipeIssues.push('Missing or too short title');
    }

    if (!recipe.id || recipe.id.trim().length < 3) {
      recipeIssues.push('Missing or invalid ID');
    }

    // Check nutrition values
    if (recipe.calories <= 0 || recipe.calories > 2000) {
      recipeIssues.push(`Suspicious calories: ${recipe.calories}`);
    }

    if (recipe.prepTime <= 0 || recipe.prepTime > 300) {
      recipeIssues.push(`Suspicious prep time: ${recipe.prepTime} minutes`);
    }

    if (recipe.servings <= 0 || recipe.servings > 20) {
      recipeIssues.push(`Suspicious servings: ${recipe.servings}`);
    }

    // Check ingredients
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      recipeIssues.push('No ingredients found');
    } else {
      recipe.ingredients.forEach((ing, i) => {
        // Check for empty ingredients
        if (!ing.name || ing.name.trim().length < 2) {
          recipeIssues.push(`Empty ingredient #${i + 1}`);
        }

        // Check for suspicious patterns in ingredient names
        this.suspiciousPatterns.forEach(pattern => {
          if (pattern.test(ing.name)) {
            recipeIssues.push(`Suspicious ingredient pattern: "${ing.name}"`);
          }
        });

        // Check amounts
        if (!ing.amount || ing.amount.trim().length === 0) {
          recipeIssues.push(`Missing amount for ingredient: "${ing.name}"`);
        } else {
          // Check for OCR artifacts in amounts
          this.suspiciousPatterns.forEach(pattern => {
            if (pattern.test(ing.amount)) {
              recipeIssues.push(`Suspicious amount pattern: "${ing.amount}" for "${ing.name}"`);
            }
          });

          // Check for valid units
          const hasValidUnit = this.validUnits.some(unit => 
            ing.amount.toLowerCase().includes(unit.toLowerCase())
          );
          
          if (!hasValidUnit && !ing.amount.match(/na chuť|podľa chuti/i)) {
            recipeIssues.push(`No valid unit in amount: "${ing.amount}" for "${ing.name}"`);
          }
        }
      });
    }

    // Check steps
    if (!recipe.steps || recipe.steps.length === 0) {
      recipeIssues.push('No preparation steps found');
    } else {
      recipe.steps.forEach((step, i) => {
        if (!step || step.trim().length < 10) {
          recipeIssues.push(`Step #${i + 1} is too short or empty`);
        }

        // Check for OCR artifacts in steps
        this.suspiciousPatterns.forEach(pattern => {
          if (pattern.test(step)) {
            recipeIssues.push(`Suspicious pattern in step #${i + 1}: "${step.substring(0, 50)}..."`);
          }
        });
      });
    }

    // Check image URL
    if (!recipe.image || !recipe.image.startsWith('http')) {
      recipeIssues.push('Invalid or missing image URL');
    }

    return {
      recipeIndex: index,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      category: recipe.category,
      issueCount: recipeIssues.length,
      issues: recipeIssues,
      isSpoonacular: recipe.id?.startsWith('spoon-'),
      severity: this.calculateSeverity(recipeIssues)
    };
  }

  calculateSeverity(issues) {
    const criticalKeywords = ['Missing', 'No ingredients', 'No preparation', 'Empty', 'Suspicious calories'];
    const critical = issues.some(issue => 
      criticalKeywords.some(keyword => issue.includes(keyword))
    );
    
    if (critical || issues.length >= 5) return 'CRITICAL';
    if (issues.length >= 3) return 'HIGH';
    if (issues.length >= 1) return 'MEDIUM';
    return 'LOW';
  }

  // Generate fixes for common issues
  suggestFixes(issueReport) {
    const fixes = [];

    issueReport.issues.forEach(issue => {
      if (issue.includes('Missing amount')) {
        fixes.push('Add proper measurement units (g, ml, ks, lyžica, etc.)');
      }
      if (issue.includes('Suspicious amount pattern')) {
        fixes.push('Review and correct measurement formatting');
      }
      if (issue.includes('No valid unit')) {
        fixes.push('Add proper Slovak measurement units');
      }
      if (issue.includes('Suspicious calories')) {
        fixes.push('Recalculate nutrition values based on ingredients');
      }
      if (issue.includes('too short')) {
        fixes.push('Expand recipe steps with more detail');
      }
    });

    return [...new Set(fixes)]; // Remove duplicates
  }
}

// Load and analyze recipes
function analyzeRecipeDatabase() {
  const recipesPath = path.join(__dirname, 'src', 'data', 'recipes.ts');
  
  if (!fs.existsSync(recipesPath)) {
    console.error('❌ recipes.ts file not found');
    return;
  }

  console.log('🔍 Analyzing recipe database quality...\n');

  // Read and parse recipes (handling TypeScript format)
  const content = fs.readFileSync(recipesPath, 'utf8');
  const recipesMatch = content.match(/export const recipes: Recipe\[\] = (\[[\s\S]*?\]);/);
  
  if (!recipesMatch) {
    console.error('❌ Could not parse recipes from file');
    return;
  }

  // Remove comments and parse JSON
  let recipesJson = recipesMatch[1]
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

  const recipes = JSON.parse(recipesJson);
  console.log(`📊 Found ${recipes.length} recipes to analyze\n`);

  const validator = new RecipeValidator();
  const allIssues = [];

  // Analyze each recipe
  recipes.forEach((recipe, index) => {
    const report = validator.validateRecipe(recipe, index);
    if (report.issueCount > 0) {
      allIssues.push(report);
    }
  });

  // Generate summary report
  const summary = {
    totalRecipes: recipes.length,
    recipesWithIssues: allIssues.length,
    healthyRecipes: recipes.length - allIssues.length,
    spoonacularCount: recipes.filter(r => r.id?.startsWith('spoon-')).length,
    originalCount: recipes.filter(r => !r.id?.startsWith('spoon-')).length,
    severityBreakdown: {
      CRITICAL: allIssues.filter(r => r.severity === 'CRITICAL').length,
      HIGH: allIssues.filter(r => r.severity === 'HIGH').length,
      MEDIUM: allIssues.filter(r => r.severity === 'MEDIUM').length,
      LOW: allIssues.filter(r => r.severity === 'LOW').length
    }
  };

  // Print summary
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Recipes: ${summary.totalRecipes}`);
  console.log(`✅ Healthy Recipes: ${summary.healthyRecipes} (${Math.round(summary.healthyRecipes/summary.totalRecipes*100)}%)`);
  console.log(`⚠️ Recipes with Issues: ${summary.recipesWithIssues} (${Math.round(summary.recipesWithIssues/summary.totalRecipes*100)}%)`);
  console.log(`🆕 Spoonacular Recipes: ${summary.spoonacularCount}`);
  console.log(`📚 Original Recipes: ${summary.originalCount}`);
  
  console.log('\n🚨 ISSUE SEVERITY BREAKDOWN:');
  console.log(`🔴 CRITICAL: ${summary.severityBreakdown.CRITICAL} recipes`);
  console.log(`🟠 HIGH: ${summary.severityBreakdown.HIGH} recipes`);
  console.log(`🟡 MEDIUM: ${summary.severityBreakdown.MEDIUM} recipes`);
  console.log(`🟢 LOW: ${summary.severityBreakdown.LOW} recipes`);

  // Show worst recipes
  console.log('\n🔴 RECIPES NEEDING IMMEDIATE ATTENTION:');
  const criticalIssues = allIssues
    .filter(r => r.severity === 'CRITICAL')
    .sort((a, b) => b.issueCount - a.issueCount)
    .slice(0, 10);

  criticalIssues.forEach((report, i) => {
    console.log(`\n${i + 1}. "${report.recipeTitle}" (${report.recipeId})`);
    console.log(`   Category: ${report.category} | Issues: ${report.issueCount}`);
    report.issues.slice(0, 3).forEach(issue => {
      console.log(`   ❌ ${issue}`);
    });
    
    const fixes = validator.suggestFixes(report);
    if (fixes.length > 0) {
      console.log(`   💡 Suggested fixes: ${fixes.slice(0, 2).join(', ')}`);
    }
  });

  // Save detailed report
  const reportPath = path.join(__dirname, `recipe-quality-report-${Date.now()}.json`);
  const detailedReport = {
    summary,
    allIssues,
    analyzedAt: new Date().toISOString(),
    recommendations: generateRecommendations(summary, allIssues)
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
  console.log(`\n📄 Detailed report saved: ${reportPath}`);

  return detailedReport;
}

function generateRecommendations(summary, issues) {
  const recommendations = [];
  
  if (summary.severityBreakdown.CRITICAL > 0) {
    recommendations.push(`🔴 URGENT: Fix ${summary.severityBreakdown.CRITICAL} critical recipes immediately`);
  }
  
  if (summary.recipesWithIssues > summary.totalRecipes * 0.3) {
    recommendations.push('📚 Consider replacing OCR recipes with more Spoonacular data');
  }
  
  const measurementIssues = issues.filter(r => 
    r.issues.some(issue => issue.includes('amount') || issue.includes('unit'))
  ).length;
  
  if (measurementIssues > 10) {
    recommendations.push(`⚖️ ${measurementIssues} recipes have measurement issues - create standardization script`);
  }

  recommendations.push('✅ Add more Spoonacular recipes to improve overall quality');
  recommendations.push('🔧 Create automated fix scripts for common OCR issues');

  return recommendations;
}

// Run analysis
if (require.main === module) {
  analyzeRecipeDatabase();
}

module.exports = { analyzeRecipeDatabase, RecipeValidator };