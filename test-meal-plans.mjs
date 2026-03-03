/**
 * Stress test meal plan generation for 3 different user profiles.
 * Runs the same logic as mealPlanGenerator.ts but in Node.js.
 */
import { readFileSync } from 'fs';

// Load recipes from the data file
const recipesFile = readFileSync('src/data/recipes.ts', 'utf-8');
// Extract the array - find the main export
const arrayMatch = recipesFile.match(/export const recipes[^=]*=\s*(\[[\s\S]*\]);/);
if (!arrayMatch) { console.error('Could not parse recipes'); process.exit(1); }

// We need to eval this carefully - the TS file uses typed objects
// Let's parse it as JS by removing type annotations
let recipesJs = arrayMatch[1];
// Remove 'as const' etc
recipesJs = recipesJs.replace(/as\s+const/g, '');
const recipes = eval(recipesJs);

console.log(`Loaded ${recipes.length} recipes\n`);

// Category breakdown
const cats = {};
recipes.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
console.log('Recipe categories:', cats);

// Nutrition profile types (matching the app)
const ACTIVITY_MULTIPLIERS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
const GOAL_ADJUSTMENTS = { lose: -300, maintain: 0, gain: 250 };

function calculateDailyTargets(weight, height, age, activityLevel, goal) {
  const bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const dailyCalories = Math.round(tdee + GOAL_ADJUSTMENTS[goal]);
  const dailyProtein = Math.round((dailyCalories * 0.3) / 4);
  const dailyCarbs = Math.round((dailyCalories * 0.4) / 4);
  const dailyFat = Math.round((dailyCalories * 0.3) / 9);
  return { dailyCalories, dailyProtein, dailyCarbs, dailyFat };
}

const MEAL_DISTRIBUTIONS = {
  3: [
    { type: 'ranajky', label: 'Raňajky', pct: 0.3 },
    { type: 'obed', label: 'Obed', pct: 0.4 },
    { type: 'vecera', label: 'Večera', pct: 0.3 },
  ],
  4: [
    { type: 'ranajky', label: 'Raňajky', pct: 0.25 },
    { type: 'desiata', label: 'Desiata', pct: 0.1 },
    { type: 'obed', label: 'Obed', pct: 0.35 },
    { type: 'vecera', label: 'Večera', pct: 0.3 },
  ],
  5: [
    { type: 'ranajky', label: 'Raňajky', pct: 0.2 },
    { type: 'desiata', label: 'Desiata', pct: 0.1 },
    { type: 'obed', label: 'Obed', pct: 0.3 },
    { type: 'olovrant', label: 'Olovrant', pct: 0.1 },
    { type: 'vecera', label: 'Večera', pct: 0.3 },
  ],
};

const CATEGORY_MAP = {
  ranajky: ['ranajky'],
  desiata: ['snack'],
  obed: ['obed'],
  olovrant: ['snack', 'smoothie'],
  vecera: ['vecera', 'obed'],
};

function filterRecipes(allRecipes, categories, allergies, dietType) {
  return allRecipes.filter(r => {
    if (!categories.includes(r.category)) return false;
    if (allergies.length > 0) {
      const recipeAllergens = r.allergens || [];
      if (recipeAllergens.length > 0) {
        for (const a of allergies) {
          if (recipeAllergens.includes(a.toLowerCase())) return false;
        }
      } else {
        const ingredientStr = (r.ingredients || []).map(ing => typeof ing === 'string' ? ing : ing.name).join(' ').toLowerCase();
        for (const a of allergies) {
          if (ingredientStr.includes(a.toLowerCase())) return false;
        }
      }
    }
    const dietary = r.dietary || [];
    const tags = (r.tags || []).map(t => t.toLowerCase());
    if (dietType === 'vegan') {
      if (!dietary.includes('vegánske') && !tags.includes('vegan') && !tags.includes('vegánske')) return false;
    }
    if (dietType === 'vegetarian') {
      if (!dietary.includes('vegetariánske') && !dietary.includes('vegánske')
        && !tags.includes('vegetarian') && !tags.includes('vegan')) return false;
    }
    return true;
  });
}

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateAndReport(profile, label) {
  const targets = calculateDailyTargets(profile.weight, profile.height, profile.age, profile.activityLevel, profile.goal);
  const fullProfile = { ...profile, ...targets };
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`👩 ${label}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Age: ${profile.age} | Weight: ${profile.weight}kg | Height: ${profile.height}cm`);
  console.log(`Activity: ${profile.activityLevel} | Goal: ${profile.goal} | Diet: ${profile.dietType || 'standard'}`);
  console.log(`Meals/day: ${profile.mealsPerDay} | Allergies: ${profile.allergies.length ? profile.allergies.join(', ') : 'none'}`);
  console.log(`\nCALCULATED TARGETS:`);
  console.log(`  Calories: ${targets.dailyCalories} kcal`);
  console.log(`  Protein: ${targets.dailyProtein}g | Carbs: ${targets.dailyCarbs}g | Fat: ${targets.dailyFat}g`);
  
  // Check recipe availability per slot
  const distribution = MEAL_DISTRIBUTIONS[profile.mealsPerDay];
  console.log(`\nRECIPE AVAILABILITY:`);
  for (const slot of distribution) {
    const cats = CATEGORY_MAP[slot.type];
    const available = filterRecipes(recipes, cats, profile.allergies, profile.dietType);
    const status = available.length === 0 ? '❌ NONE' : available.length < 3 ? '⚠️ LOW' : '✅';
    console.log(`  ${slot.label} (${slot.type}): ${available.length} recipes ${status}`);
  }
  
  // Generate 7-day plan
  const days = [];
  const usedRecipeIds = new Set();
  let totalWeekCal = 0;
  const issues = [];
  
  for (let d = 0; d < 7; d++) {
    const dayMeals = [];
    let dayCal = 0, dayPro = 0, dayCarb = 0, dayFat = 0;
    
    for (const slot of distribution) {
      const targetCal = fullProfile.dailyCalories * slot.pct;
      const cats = CATEGORY_MAP[slot.type];
      const compatible = filterRecipes(recipes, cats, profile.allergies, profile.dietType);
      
      if (compatible.length === 0) {
        dayMeals.push({ slot: slot.label, recipe: 'NO RECIPE AVAILABLE', cal: 0, portion: 0 });
        issues.push(`Day ${d+1}: No recipes for ${slot.label}`);
        continue;
      }
      
      const picked = pickRandom(compatible, 2);
      const recipe = picked[0];
      const portion = Math.round((targetCal / recipe.calories) * 100) / 100;
      const actualCal = Math.round(recipe.calories * portion);
      
      usedRecipeIds.add(recipe.id);
      dayCal += actualCal;
      dayPro += Math.round((recipe.protein || 0) * portion);
      dayCarb += Math.round((recipe.carbs || 0) * portion);
      dayFat += Math.round((recipe.fat || 0) * portion);
      
      // Check for extreme portions
      if (portion < 0.3) issues.push(`Day ${d+1} ${slot.label}: Tiny portion ${portion}x of "${recipe.name}" (${recipe.calories}cal recipe for ${Math.round(targetCal)}cal target)`);
      if (portion > 3.0) issues.push(`Day ${d+1} ${slot.label}: Huge portion ${portion}x of "${recipe.name}" (${recipe.calories}cal recipe for ${Math.round(targetCal)}cal target)`);
      
      dayMeals.push({ slot: slot.label, recipe: recipe.name, cal: actualCal, portion, category: recipe.category });
    }
    
    totalWeekCal += dayCal;
    
    // Check daily calorie deviation
    const deviation = Math.abs(dayCal - fullProfile.dailyCalories);
    if (deviation > 50) {
      issues.push(`Day ${d+1}: Daily total ${dayCal}cal deviates ${deviation}cal from target ${fullProfile.dailyCalories}cal`);
    }
    
    days.push({ day: d+1, meals: dayMeals, totalCal: dayCal, totalPro: dayPro, totalCarb: dayCarb, totalFat: dayFat });
  }
  
  // Print sample day (Day 1)
  console.log(`\nSAMPLE DAY (Day 1):`);
  for (const m of days[0].meals) {
    console.log(`  ${m.slot}: ${m.recipe} (${m.cal}cal, ${m.portion}x portion)`);
  }
  console.log(`  TOTAL: ${days[0].totalCal}cal | P:${days[0].totalPro}g C:${days[0].totalCarb}g F:${days[0].totalFat}g`);
  
  // Weekly summary
  console.log(`\nWEEKLY SUMMARY:`);
  console.log(`  Avg daily calories: ${Math.round(totalWeekCal / 7)} (target: ${fullProfile.dailyCalories})`);
  console.log(`  Unique recipes used: ${usedRecipeIds.size}`);
  console.log(`  Recipe variety: ${usedRecipeIds.size >= profile.mealsPerDay * 3 ? '✅ Good' : '⚠️ Low variety'}`);
  
  // Print all 7 days briefly
  console.log(`\n  7-DAY CALORIE LOG:`);
  for (const day of days) {
    const bar = '█'.repeat(Math.round(day.totalCal / 50));
    console.log(`    Day ${day.day}: ${day.totalCal}cal ${bar}`);
  }
  
  // Issues
  if (issues.length > 0) {
    console.log(`\n⚠️  ISSUES (${issues.length}):`);
    issues.forEach(i => console.log(`  - ${i}`));
  } else {
    console.log(`\n✅ No issues found!`);
  }
  
  return { profile: fullProfile, days, issues, uniqueRecipes: usedRecipeIds.size };
}

// ═══════════════════════════════════════════════════════════
// THREE TEST PROFILES
// ═══════════════════════════════════════════════════════════

// Profile 1: Young active woman, weight loss, no restrictions
const profile1 = {
  age: 24, weight: 68, height: 168,
  activityLevel: 'active', goal: 'lose',
  mealsPerDay: 5, allergies: [], dietType: 'standard',
};

// Profile 2: Mid-30s moderate activity, maintain, gluten-free vegetarian
const profile2 = {
  age: 35, weight: 62, height: 165,
  activityLevel: 'moderate', goal: 'maintain',
  mealsPerDay: 3, allergies: ['lepok', 'gluten'],
  dietType: 'vegetarian',
};

// Profile 3: 45+ sedentary, weight loss, vegan, lactose + nut allergies
const profile3 = {
  age: 48, weight: 75, height: 160,
  activityLevel: 'sedentary', goal: 'lose',
  mealsPerDay: 4, allergies: ['laktóza', 'orechy', 'milk', 'nuts'],
  dietType: 'vegan',
};

const r1 = generateAndReport(profile1, 'PROFILE 1: Katka (24) — Active, Weight Loss, 5 meals, No restrictions');
const r2 = generateAndReport(profile2, 'PROFILE 2: Zuzana (35) — Moderate, Maintain, 3 meals, Gluten-free Vegetarian');
const r3 = generateAndReport(profile3, 'PROFILE 3: Marta (48) — Sedentary, Weight Loss, 4 meals, Vegan + Allergies');

// Final summary
console.log(`\n${'='.repeat(70)}`);
console.log('OVERALL STRESS TEST SUMMARY');
console.log(`${'='.repeat(70)}`);
const totalIssues = r1.issues.length + r2.issues.length + r3.issues.length;
console.log(`Total issues: ${totalIssues}`);
console.log(`Profile 1 (Katka): ${r1.issues.length} issues, ${r1.uniqueRecipes} unique recipes`);
console.log(`Profile 2 (Zuzana): ${r2.issues.length} issues, ${r2.uniqueRecipes} unique recipes`);
console.log(`Profile 3 (Marta): ${r3.issues.length} issues, ${r3.uniqueRecipes} unique recipes`);
console.log(`\nVerdict: ${totalIssues === 0 ? '✅ ALL CLEAR' : totalIssues < 5 ? '⚠️ MINOR ISSUES' : '❌ NEEDS ATTENTION'}`);
