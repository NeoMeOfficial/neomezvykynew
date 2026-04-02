// OCR Recipe Cleanup Script
// Fixes systematic OCR errors in original Slovak recipes

import fs from 'fs';
import path from 'path';

const BACKUP_FILE = 'src/data/recipes-pre-controlled-1774332372557.ts';

console.log('🔧 Starting OCR Recipe Cleanup...');

// Read the backup file with original recipes
const backupContent = fs.readFileSync(BACKUP_FILE, 'utf8');

// Extract recipes array from the TypeScript file
const recipesMatch = backupContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*\]);/);
if (!recipesMatch) {
  console.error('❌ Could not parse recipes from backup file');
  process.exit(1);
}

const recipesData = eval(recipesMatch[1]);
console.log(`📊 Found ${recipesData.length} total recipes`);

// Filter for original Slovak recipes only (not Spoonacular)
const originalRecipes = recipesData.filter(recipe => 
  recipe.id && !recipe.id.startsWith('spoon-')
);

console.log(`🇸🇰 Processing ${originalRecipes.length} original Slovak recipes`);

// Common OCR fixes
const fixes = {
  // Ingredient fixes
  ingredientFixes: [
    // Fix "Proteínová kaša s čučoriedkami" - add missing ingredients based on steps
    {
      id: 'ranajky-protei-nova-kas-a-s-c-uc-oriedkami',
      ingredients: [
        { name: 'Ovsené vločky', amount: '½ šálky' },
        { name: 'Voda', amount: '250 ml' },
        { name: 'Škorica', amount: '½ ČL' },
        { name: 'Proteínový prášok', amount: '1 odmerka (30 g)' },
        { name: 'Čerstvé čučoriedky', amount: '100 g' },
        { name: 'Javorový sirup', amount: '1 PL' },
        { name: 'Citrónová šťava', amount: '½ ČL' },
        { name: 'Rastlinné mlieko', amount: '100 ml' },
        { name: 'Rastlinný jogurt', amount: '2 PL' },
        { name: 'Hrozienka', amount: '1 PL' },
        { name: 'Vlašské orechy', amount: '10 g' }
      ]
    },
    // Fix "Jahodový chia puding" - merge split ingredient
    {
      id: 'ranajky-jahodovy-chia-puding',
      mergeIngredients: [
        { find: ['Odmerka čokoládového', 'Proteínového prášku'], 
          replace: { name: '1 odmerka čokoládového proteínového prášku', amount: '30 g' } }
      ]
    },
    // Fix "Kokosovo pohánková overnight kaša" - merge split ingredient
    {
      id: 'ranajky-kokosovo-poha-nkova-overnight-kas-a',
      mergeIngredients: [
        { find: ['pohánkovej krupice (nie', 'Kaše)'], 
          replace: { name: 'Pohánková krupica (nie kaša)', amount: '½ šálky (100 g)' } }
      ]
    }
  ],

  // Text cleanup patterns
  textCleanup: [
    // Fix broken sentences
    { from: /\. \(lo /g, to: '. (To ' },
    { from: /\. >/, to: '. >' },
    { from: /\. ½ cl/g, to: ', ½ ČL' },
    { from: /\. \/ cl/g, to: ', ¼ ČL' },
    { from: /\. a cl/g, to: ', ¼ ČL' },
    { from: /rasc/g, to: 'rasca' },
    
    // Fix measurement units
    { from: /cl /g, to: 'ČL ' },
    { from: /PL /g, to: 'PL ' },
    { from: /ks /g, to: 'ks ' },
    
    // Fix Slovak typography
    { from: /čl /g, to: 'ČL ' },
    { from: /pl /g, to: 'PL ' },
    
    // Fix cooking terms
    { from: /var /g, to: 'vari ' },
    { from: /omáčka /g, to: 'omáčku ' },
    { from: /panvica /g, to: 'panvicu ' }
  ]
};

// Apply fixes
let fixedCount = 0;
const fixedRecipes = originalRecipes.map(recipe => {
  let fixed = { ...recipe };
  
  // Apply ingredient fixes
  const ingredientFix = fixes.ingredientFixes.find(fix => fix.id === recipe.id);
  if (ingredientFix) {
    if (ingredientFix.ingredients) {
      fixed.ingredients = ingredientFix.ingredients;
      console.log(`✅ Fixed ingredients for: ${recipe.title}`);
      fixedCount++;
    }
    
    if (ingredientFix.mergeIngredients) {
      ingredientFix.mergeIngredients.forEach(merge => {
        const indicesToRemove = [];
        merge.find.forEach(searchText => {
          const index = fixed.ingredients.findIndex(ing => 
            ing.name.includes(searchText)
          );
          if (index !== -1) indicesToRemove.push(index);
        });
        
        // Remove old ingredients and add merged one
        indicesToRemove.sort((a, b) => b - a); // Remove from end first
        indicesToRemove.forEach(index => fixed.ingredients.splice(index, 1));
        fixed.ingredients.push(merge.replace);
        
        console.log(`✅ Merged ingredients for: ${recipe.title}`);
        fixedCount++;
      });
    }
  }
  
  // Apply text cleanup to steps and ingredient names
  fixes.textCleanup.forEach(cleanup => {
    fixed.steps = fixed.steps.map(step => step.replace(cleanup.from, cleanup.to));
    fixed.ingredients = fixed.ingredients.map(ing => ({
      ...ing,
      name: ing.name.replace(cleanup.from, cleanup.to)
    }));
  });
  
  return fixed;
});

console.log(`🎉 Applied fixes to ${fixedCount} recipes`);

// Combine with Spoonacular recipes
const spoonacularRecipes = recipesData.filter(recipe => 
  recipe.id && recipe.id.startsWith('spoon-')
);

const allRecipes = [...spoonacularRecipes, ...fixedRecipes];

// Generate new recipes.ts file
const newContent = `// OCR-cleaned + Spoonacular recipes - ${new Date().toISOString()}
// Spoonacular: ${spoonacularRecipes.length} | Original (cleaned): ${fixedRecipes.length} | Total: ${allRecipes.length}

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

// Write the new file
fs.writeFileSync('src/data/recipes.ts', newContent);

console.log(`🚀 Generated new recipes.ts with ${allRecipes.length} total recipes`);
console.log(`📈 Breakdown: ${spoonacularRecipes.length} Spoonacular + ${fixedRecipes.length} cleaned Slovak recipes`);
console.log('✨ Ready for deployment!');