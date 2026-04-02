// Safe Recipe Cleanup - Fixes only specific identified issues
// Step-by-step approach to avoid data corruption

import fs from 'fs';

console.log('🔧 Starting Safe Recipe Cleanup...');

// Read backup file
const backupContent = fs.readFileSync('src/data/recipes-pre-controlled-1774332372557.ts', 'utf8');
const recipesMatch = backupContent.match(/export const recipes: Recipe\[\] = (\[[\s\S]*\]);/);
const recipesData = eval(recipesMatch[1]);

// Filter Slovak recipes
const slovakRecipes = recipesData.filter(recipe => 
  recipe.id && !recipe.id.startsWith('spoon-')
);

const spoonacularRecipes = recipesData.filter(recipe => 
  recipe.id && recipe.id.startsWith('spoon-')
);

console.log(`📊 Processing ${slovakRecipes.length} Slovak recipes...`);

// Specific fixes for known issues
const specificFixes = {
  // Already fixed in first script
  'ranajky-protei-nova-kas-a-s-c-uc-oriedkami': {
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
  
  'obed-zdrave-bolonske-spagety': {
    ingredients: [
      { name: 'Celozrnné špagety', amount: '200 g' },
      { name: 'Mleté hovädzie mäso', amount: '150 g' },
      { name: 'Cibuľa', amount: '1 ks' },
      { name: 'Cesnak', amount: '2 strúčiky' },
      { name: 'Paradajkový pretlak', amount: '200 g' },
      { name: 'Olivový olej', amount: '2 PL' },
      { name: 'Bazalka', amount: '10 g' },
      { name: 'Soľ a korenie', amount: 'podľa chuti' }
    ]
  },
  
  'obed-summer-salmon-salad': {
    ingredients: [
      { name: 'Losos (filé)', amount: '150 g' },
      { name: 'Zmiešaný šalát', amount: '100 g' },
      { name: 'Cherry paradajky', amount: '100 g' },
      { name: 'Uhorka', amount: '1 ks' },
      { name: 'Avokádo', amount: '½ ks' },
      { name: 'Olivový olej', amount: '2 PL' },
      { name: 'Citrónová šťava', amount: '1 PL' },
      { name: 'Soľ a korenie', amount: 'podľa chuti' }
    ]
  }
};

// Individual ingredient fixes (merge split ingredients)
const ingredientMerges = [
  // Jahodový chia puding - already done in first script
  {
    recipeId: 'ranajky-jahodovy-chia-puding',
    merges: [
      {
        findNames: ['Odmerka čokoládového', 'Proteínového prášku'],
        replaceWith: { name: '1 odmerka čokoládového proteínového prášku', amount: '30 g' }
      }
    ]
  },
  
  // Kokosovo pohánková overnight kaša - already done in first script  
  {
    recipeId: 'ranajky-kokosovo-poha-nkova-overnight-kas-a',
    merges: [
      {
        findNames: ['pohánkovej krupice (nie', 'Kaše)'],
        replaceWith: { name: 'Pohánková krupica (nie kaša)', amount: '½ šálky (100 g)' }
      }
    ]
  }
];

// Apply fixes safely
let fixedCount = 0;
const fixedRecipes = slovakRecipes.map(recipe => {
  let fixed = { ...recipe };
  
  // Apply specific ingredient replacements
  if (specificFixes[recipe.id]) {
    if (specificFixes[recipe.id].ingredients) {
      fixed.ingredients = specificFixes[recipe.id].ingredients;
      console.log(`✅ Fixed ingredients for: ${recipe.title}`);
      fixedCount++;
    }
  }
  
  // Apply ingredient merges
  const mergeFix = ingredientMerges.find(fix => fix.recipeId === recipe.id);
  if (mergeFix) {
    mergeFix.merges.forEach(merge => {
      const indicesToRemove = [];
      
      merge.findNames.forEach(searchName => {
        const index = fixed.ingredients.findIndex(ing => 
          ing.name.includes(searchName)
        );
        if (index !== -1) {
          indicesToRemove.push(index);
        }
      });
      
      if (indicesToRemove.length > 0) {
        // Remove found ingredients (in reverse order)
        indicesToRemove.sort((a, b) => b - a).forEach(index => {
          fixed.ingredients.splice(index, 1);
        });
        
        // Add merged ingredient
        fixed.ingredients.push(merge.replaceWith);
        
        console.log(`✅ Merged ingredients for: ${recipe.title}`);
        fixedCount++;
      }
    });
  }
  
  return fixed;
});

// Combine all recipes
const allRecipes = [...spoonacularRecipes, ...fixedRecipes];

// Create new file
const newContent = `// Safe OCR-cleaned + Spoonacular recipes - ${new Date().toISOString()}
// Spoonacular: ${spoonacularRecipes.length} | Original (safe-cleaned): ${fixedRecipes.length} | Total: ${allRecipes.length}

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

fs.writeFileSync('src/data/recipes.ts', newContent);

console.log(`\n🎉 SAFE CLEANUP COMPLETE!`);
console.log(`✅ Applied ${fixedCount} specific fixes`);  
console.log(`📈 Total recipes: ${allRecipes.length} (${spoonacularRecipes.length} API + ${fixedRecipes.length} Slovak)`);
console.log(`🚀 Ready for build and deployment!`);