// OCR Error Diagnostic Script
// Systematically identifies common OCR errors in Slovak recipes

import fs from 'fs';

console.log('🔍 Starting OCR Error Diagnosis...');

// Read current recipes
const recipesContent = fs.readFileSync('src/data/recipes.ts', 'utf8');
const recipesMatch = recipesContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*\]);/);
const recipesData = eval(recipesMatch[1]);

// Filter Slovak recipes only
const slovakRecipes = recipesData.filter(recipe => 
  recipe.id && !recipe.id.startsWith('spoon-')
);

console.log(`📊 Analyzing ${slovakRecipes.length} Slovak recipes for OCR errors...`);

const errors = {
  missingIngredients: [],
  incompleteIngredients: [],
  brokenWords: [],
  measurementErrors: [],
  grammarErrors: [],
  contentErrors: []
};

// Diagnostic patterns
const patterns = {
  // Missing or incomplete ingredients
  emptyIngredients: recipe => recipe.ingredients.length === 0,
  incompleteIngredient: ing => 
    ing.name.length < 3 || 
    ing.name.endsWith('(') || 
    ing.name.endsWith(',') ||
    ing.name.endsWith('.') ||
    ing.amount === '' ||
    ing.amount === 'undefined',
    
  // Broken words from OCR
  brokenWords: text => {
    const broken = [
      /\b[a-záčďéíľňóšťúýž]{1,2}\s+[a-záčďéíľňóšťúýž]/g, // Split words
      /[a-záčďéíľňóšťúýž]+\s*\.\s*[a-záčďéíľňóšťúýž]+/g, // Words split by dots
      /\b(nie|pre|nad|pod|pri|bez|cez)\s*\???\s*/g, // Common prepositions with ???
    ];
    return broken.some(pattern => pattern.test(text));
  },
  
  // Measurement unit errors
  measurementErrors: text => {
    const errors = [
      /\d+\s*cl\b/g, // should be ČL
      /\d+\s*pl\b/g, // should be PL  
      /\d+\s*čl\b/g, // should be ČL
      /\d+\s*ml\b/g, // OK
      /\d+\s*g\b/g,  // OK
      /\?\?\?/g,      // OCR failure
    ];
    return text.includes('???') || /\bcl\b|\bpl\b|\bčl\b/.test(text);
  },
  
  // Grammar errors
  grammarErrors: text => {
    const errors = [
      /\b(var|peč|op|nech|vlož)\b/g, // Incomplete verbs
      /\s+(a|i|o|u|y)\s+/g, // Single letters (OCR artifacts)
      /[.]{2,}/g, // Multiple dots
    ];
    return errors.some(pattern => pattern.test(text));
  }
};

// Analyze each recipe
slovakRecipes.forEach(recipe => {
  // Check for missing ingredients
  if (patterns.emptyIngredients(recipe)) {
    errors.missingIngredients.push({
      id: recipe.id,
      title: recipe.title,
      issue: 'No ingredients found'
    });
  }
  
  // Check each ingredient
  recipe.ingredients.forEach((ing, index) => {
    if (patterns.incompleteIngredient(ing)) {
      errors.incompleteIngredients.push({
        id: recipe.id,
        title: recipe.title,
        ingredient: `${ing.name} (${ing.amount})`,
        index: index
      });
    }
    
    // Check for broken words in ingredient names
    if (patterns.brokenWords(ing.name)) {
      errors.brokenWords.push({
        id: recipe.id,
        title: recipe.title,
        text: ing.name,
        type: 'ingredient'
      });
    }
    
    // Check for measurement errors
    if (patterns.measurementErrors(`${ing.name} ${ing.amount}`)) {
      errors.measurementErrors.push({
        id: recipe.id,
        title: recipe.title,
        text: `${ing.name} ${ing.amount}`,
        type: 'ingredient'
      });
    }
  });
  
  // Check steps for errors
  recipe.steps.forEach((step, index) => {
    if (patterns.brokenWords(step)) {
      errors.brokenWords.push({
        id: recipe.id,
        title: recipe.title,
        text: step.substring(0, 100) + '...',
        type: 'step',
        stepIndex: index
      });
    }
    
    if (patterns.grammarErrors(step)) {
      errors.grammarErrors.push({
        id: recipe.id,
        title: recipe.title,
        text: step.substring(0, 100) + '...',
        type: 'step',
        stepIndex: index
      });
    }
    
    if (patterns.measurementErrors(step)) {
      errors.measurementErrors.push({
        id: recipe.id,
        title: recipe.title,
        text: step.substring(0, 100) + '...',
        type: 'step',
        stepIndex: index
      });
    }
  });
});

// Report findings
console.log('\n📋 OCR ERROR DIAGNOSIS REPORT');
console.log('=' .repeat(50));

console.log(`\n❌ MISSING INGREDIENTS (${errors.missingIngredients.length}):`);
errors.missingIngredients.forEach(error => {
  console.log(`   • ${error.title} (${error.id}): ${error.issue}`);
});

console.log(`\n⚠️  INCOMPLETE INGREDIENTS (${errors.incompleteIngredients.length}):`);
errors.incompleteIngredients.slice(0, 10).forEach(error => {
  console.log(`   • ${error.title}: "${error.ingredient}"`);
});
if (errors.incompleteIngredients.length > 10) {
  console.log(`   ... and ${errors.incompleteIngredients.length - 10} more`);
}

console.log(`\n🔤 BROKEN WORDS (${errors.brokenWords.length}):`);
errors.brokenWords.slice(0, 10).forEach(error => {
  console.log(`   • ${error.title} (${error.type}): "${error.text}"`);
});
if (errors.brokenWords.length > 10) {
  console.log(`   ... and ${errors.brokenWords.length - 10} more`);
}

console.log(`\n📏 MEASUREMENT ERRORS (${errors.measurementErrors.length}):`);
errors.measurementErrors.slice(0, 10).forEach(error => {
  console.log(`   • ${error.title} (${error.type}): "${error.text}"`);
});
if (errors.measurementErrors.length > 10) {
  console.log(`   ... and ${errors.measurementErrors.length - 10} more`);
}

console.log(`\n📝 GRAMMAR ERRORS (${errors.grammarErrors.length}):`);
errors.grammarErrors.slice(0, 10).forEach(error => {
  console.log(`   • ${error.title} (${error.type}): "${error.text}"`);
});
if (errors.grammarErrors.length > 10) {
  console.log(`   ... and ${errors.grammarErrors.length - 10} more`);
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  totalRecipes: slovakRecipes.length,
  summary: {
    missingIngredients: errors.missingIngredients.length,
    incompleteIngredients: errors.incompleteIngredients.length,
    brokenWords: errors.brokenWords.length,
    measurementErrors: errors.measurementErrors.length,
    grammarErrors: errors.grammarErrors.length
  },
  details: errors
};

fs.writeFileSync('ocr-error-report.json', JSON.stringify(report, null, 2));

console.log(`\n💾 Detailed report saved to: ocr-error-report.json`);
console.log(`\n📊 SUMMARY:`);
console.log(`   Total Slovak recipes analyzed: ${slovakRecipes.length}`);
console.log(`   Recipes with issues: ${new Set([
  ...errors.missingIngredients.map(e => e.id),
  ...errors.incompleteIngredients.map(e => e.id),
  ...errors.brokenWords.map(e => e.id),
  ...errors.measurementErrors.map(e => e.id),
  ...errors.grammarErrors.map(e => e.id)
]).size}`);
console.log(`   Total errors found: ${Object.values(errors).reduce((sum, arr) => sum + arr.length, 0)}`);