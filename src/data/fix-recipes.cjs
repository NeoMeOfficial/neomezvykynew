const fs = require('fs');
let src = fs.readFileSync('recipes.ts', 'utf8');

// ============================================================
// TASK 1: Recategorize ~18 obed recipes as vecera
// Pick lighter dishes: soups, salads, lighter protein, wraps
// ============================================================
const toVecera = [
  // All 9 soups - perfect dinner
  'Hubová polievka',
  'Kuracia polievka na mexický štýl',
  'Kuracia polievka na štýl pho',
  'Miso polievka s jačmeňom',
  'Paradajková polievka s fazuľou',
  'Polievka z tekvice a batátov',
  'Šošovicová kari polievka',
  'Vegánska šošovicová polievka',
  'Vývar na ázijský štýl',
  // Salads
  'Šalát z tekvice, fety a červenej repy',
  'Vegánsky šalát s ryžovými rezancami',
  'Grilovaný mexický šalát',
  'Batátový šalát s ryžou a šošovicou',
  'Summer Salmon Salad',
  'Crunchy Vegan Tofu Salad',
  'Pumpkin, Feta and Beetroot Salad (V)',
  // Light wraps
  'Vegánsky wrap s batátmi a humusom',
  'Falafel wrap',
];

// For each vecera recipe, change category and description
toVecera.forEach(title => {
  // Escape special regex chars in title
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const titleRegex = new RegExp(`(title: '${escaped}',\\s*\\n\\s*category: )'obed'`);
  if (!titleRegex.test(src)) {
    console.log('WARNING: Could not find obed category for:', title);
    return;
  }
  src = src.replace(titleRegex, "$1'vecera'");
  
  // Update description - match various description patterns
  const descRegex = new RegExp(`(title: '${escaped}',\\s*\\n\\s*category: 'vecera',\\s*\\n\\s*description: ')[^']*'`);
  src = src.replace(descRegex, (match, prefix) => {
    return prefix + "Ľahká večera'";
  });
});

// ============================================================
// TASK 2: Fix fake macro values
// ============================================================

// Helper: given target macros, format replacement
function macroReplace(title, cal, protein, carbs, fat, fiber) {
  // Verify cal ≈ p*4 + c*4 + f*9
  const computed = protein*4 + carbs*4 + fat*9;
  const ratio = cal / computed;
  if (ratio < 0.9 || ratio > 1.1) {
    console.log(`WARNING: ${title} cal=${cal} computed=${computed} ratio=${ratio.toFixed(2)}`);
  }
  return { cal, protein, carbs, fat, fiber };
}

// Define realistic macros for each recipe
const macroFixes = {
  // === OBED (lunch) recipes with fake 480/34/40/18 or 420/18/45/16 ===
  'BBG kura s mango salsou': macroReplace('BBG kura s mango salsou', 520, 38, 42, 20, 6),
  'Batátový koláč z mletého mäsa': macroReplace('Batátový koláč z mletého mäsa', 580, 36, 52, 22, 8),
  'Batátový šalát s ryžou a šošovicou': macroReplace('Batátový šalát s ryžou a šošovicou', 440, 18, 62, 12, 9),
  'Falafel wrap': macroReplace('Falafel wrap', 460, 16, 52, 20, 7),
  'Grilovaný mexický šalát': macroReplace('Grilovaný mexický šalát', 390, 28, 32, 16, 8),
  'Grilovaný sendvič s hovädzím mäsom': macroReplace('Grilovaný sendvič s hovädzím mäsom', 550, 38, 40, 24, 4),
  'Hovädzie na zelenine': macroReplace('Hovädzie na zelenine', 490, 40, 28, 22, 6),
  'Hovädzie s tekvicovou kašou': macroReplace('Hovädzie s tekvicovou kašou', 530, 42, 38, 20, 7),
  'Kuracia sezamová panvička': macroReplace('Kuracia sezamová panvička', 510, 36, 44, 20, 5),
  'Mexické tortilly': macroReplace('Mexické tortilly', 520, 30, 48, 22, 6),
  'Placky s ricottou, cukinou a batátmi': macroReplace('Placky s ricottou, cukinou a batátmi', 420, 20, 48, 16, 5),
  'Plnené sladké zemiaky': macroReplace('Plnené sladké zemiaky', 450, 22, 56, 16, 8),
  'Poke miska s kuracím mäsom': macroReplace('Poke miska s kuracím mäsom', 500, 34, 48, 18, 5),
  'Slaný koláč z batátov a slaniny': macroReplace('Slaný koláč z batátov a slaniny', 540, 28, 42, 28, 5),
  'Slaný koláč z tekvice a fety': macroReplace('Slaný koláč z tekvice a fety', 430, 18, 40, 22, 4),
  'Steak s pečenou zeleninou': macroReplace('Steak s pečenou zeleninou', 520, 42, 24, 28, 6),
  'Šalát z tekvice, fety a červenej repy': macroReplace('Šalát z tekvice, fety a červenej repy', 380, 14, 38, 20, 7),
  'Špenátovo brokolicové cestoviny s pestom': macroReplace('Špenátovo brokolicové cestoviny s pestom', 480, 18, 56, 20, 6),
  'Tofu Buddha bowl': macroReplace('Tofu Buddha bowl', 440, 22, 48, 18, 8),
  'Údená ryba s letnou zeleninou': macroReplace('Údená ryba s letnou zeleninou', 420, 32, 28, 20, 5),
  'Vegánsky burger z batátov': macroReplace('Vegánsky burger z batátov', 470, 16, 58, 20, 9),
  'Vegánsky šalát s ryžovými rezancami': macroReplace('Vegánsky šalát s ryžovými rezancami', 360, 12, 52, 12, 6),
  'Vegánsky wrap s batátmi a humusom': macroReplace('Vegánsky wrap s batátmi a humusom', 420, 14, 54, 16, 8),
  'Zdravé boloňské špagety': macroReplace('Zdravé boloňské špagety', 540, 34, 52, 20, 7),
  'Zdravé zeleninové muffiny': macroReplace('Zdravé zeleninové muffiny', 350, 14, 38, 16, 5),
  'Zelené kari s krevetami': macroReplace('Zelené kari s krevetami', 460, 32, 34, 20, 6),

  // === Soups with fake 280/16/32/10 ===
  'Hubová polievka': macroReplace('Hubová polievka', 220, 8, 26, 10, 4),
  'Kuracia polievka na mexický štýl': macroReplace('Kuracia polievka na mexický štýl', 320, 24, 28, 12, 5),
  'Kuracia polievka na štýl pho': macroReplace('Kuracia polievka na štýl pho', 310, 26, 30, 10, 3),
  'Miso polievka s jačmeňom': macroReplace('Miso polievka s jačmeňom', 260, 12, 38, 6, 6),
  'Paradajková polievka s fazuľou': macroReplace('Paradajková polievka s fazuľou', 290, 14, 42, 6, 8),
  'Polievka z tekvice a batátov': macroReplace('Polievka z tekvice a batátov', 250, 6, 40, 8, 6),
  'Šošovicová kari polievka': macroReplace('Šošovicová kari polievka', 340, 20, 42, 10, 9),
  'Vegánska šošovicová polievka': macroReplace('Vegánska šošovicová polievka', 300, 18, 40, 6, 10),
  'Vývar na ázijský štýl': macroReplace('Vývar na ázijský štýl', 180, 12, 18, 6, 2),

  // === RANAJKY (breakfast) with fake 380 calories ===
  'Acai miska': macroReplace('Acai miska', 340, 8, 52, 12, 8),
  'Avokádový toast s fetou': macroReplace('Avokádový toast s fetou', 420, 14, 34, 26, 6),
  'Banánovo ovsené lievance': macroReplace('Banánovo ovsené lievance', 350, 12, 52, 10, 4),
  'Banánový chlieb': macroReplace('Banánový chlieb', 320, 8, 48, 12, 3),
  'Bylinkové vajíčka s kyslou kapustou': macroReplace('Bylinkové vajíčka s kyslou kapustou', 290, 20, 12, 18, 3),
  'Čili stratené vajíčka': macroReplace('Čili stratené vajíčka', 310, 22, 18, 16, 4),
  'Čokoládová raňajková miska': macroReplace('Čokoládová raňajková miska', 380, 14, 48, 16, 6),
  'Jahodový chia puding': macroReplace('Jahodový chia puding', 280, 10, 32, 14, 10),
  'Kokosovo pohánková overnight kaša': macroReplace('Kokosovo pohánková overnight kaša', 360, 10, 48, 14, 5),
  'Omeleta s kyslou kapustou': macroReplace('Omeleta s kyslou kapustou', 320, 24, 8, 22, 2),
  'Ovsená mrkvová kaša': macroReplace('Ovsená mrkvová kaša', 340, 10, 52, 10, 6),
  'Ovsený chia puding': macroReplace('Ovsený chia puding', 300, 12, 38, 12, 8),
  'Ovsený overnight s čučoriedkami': macroReplace('Ovsený overnight s čučoriedkami', 330, 12, 48, 10, 6),
  'Praženica s kozím syrom': macroReplace('Praženica s kozím syrom', 350, 26, 6, 26, 1),
  'Praženica z tofu': macroReplace('Praženica z tofu', 280, 22, 14, 16, 4),
  'Proteínová kaša s čučoriedkami': macroReplace('Proteínová kaša s čučoriedkami', 360, 28, 40, 10, 5),
  'Sezamový losos na ražnom chlebe': macroReplace('Sezamový losos na ražnom chlebe', 450, 30, 32, 22, 4),
  'Sladká krémová kaša s quinoou': macroReplace('Sladká krémová kaša s quinoou', 370, 14, 54, 10, 5),
  'Slaná palacinka s rukolou a šunkou': macroReplace('Slaná palacinka s rukolou a šunkou', 390, 24, 34, 18, 3),
  'Špaldová placka s ricottou': macroReplace('Špaldová placka s ricottou', 370, 18, 42, 14, 4),
  'Toasty s vajíčkom, hubami a avokádom': macroReplace('Toasty s vajíčkom, hubami a avokádom', 410, 20, 30, 24, 5),
  'Vegánske palacinky': macroReplace('Vegánske palacinky', 340, 10, 50, 12, 4),

  // === SMOOTHIE with fake 360 calories ===
  'Banánovo medové smoothie': macroReplace('Banánovo medové smoothie', 280, 8, 50, 6, 3),
  'Čokoládové smoothie': macroReplace('Čokoládové smoothie', 320, 18, 38, 12, 4),
  'Kokosovo čučoriedkový smoothie s datlami': macroReplace('Kokosovo čučoriedkový smoothie s datlami', 290, 6, 42, 12, 5),
  'Kokosovo ovocný proteínový smoothie': macroReplace('Kokosovo ovocný proteínový smoothie', 310, 22, 34, 10, 4),
  'Snickers smoothie': macroReplace('Snickers smoothie', 350, 16, 38, 14, 3),
  'Tropický smoothie': macroReplace('Tropický smoothie', 240, 6, 44, 6, 4),
  'Zelené smoothie s proteínom': macroReplace('Zelené smoothie s proteínom', 260, 20, 30, 8, 5),

  // === SNACK with fake 180 calories ===
  // Note: some snack titles duplicate breakfast titles - we handle by position
  'Citrónovo kokosové guličky': macroReplace('Citrónovo kokosové guličky', 160, 4, 18, 8, 2),
  'Čokoládové snickers datle': macroReplace('Čokoládové snickers datle', 200, 6, 28, 8, 3),
  'Datlový koláč z praclíkov': macroReplace('Datlový koláč z praclíkov', 230, 6, 36, 8, 2),
  'Domáca čokoládová zmrzlina': macroReplace('Domáca čokoládová zmrzlina', 210, 4, 30, 10, 2),
  'Mrkvové muffiny so semienkami': macroReplace('Mrkvové muffiny so semienkami', 190, 6, 22, 10, 3),
  'Ovsené guličky s arašidovým maslom': macroReplace('Ovsené guličky s arašidovým maslom', 220, 8, 22, 12, 3),
  'Ovsené sušienky s jablkovým pyré': macroReplace('Ovsené sušienky s jablkovým pyré', 170, 4, 28, 6, 3),
  'Palacinky s lesnými plodmi': macroReplace('Palacinky s lesnými plodmi', 250, 8, 36, 8, 3),
  'Proteínovo datlové guličky': macroReplace('Proteínovo datlové guličky', 200, 12, 24, 8, 2),
  'Zdravé mätové guličky': macroReplace('Zdravé mätové guličky', 150, 4, 18, 8, 2),
  'Zdravé mrkvové lievance': macroReplace('Zdravé mrkvové lievance', 240, 8, 34, 8, 4),
};

// For snacks with duplicate names (same title as breakfast), we need positional replacement
// The snack section starts after smoothies. Let's handle all macro replacements.

// Strategy: find each recipe by title + category combo and replace its macro block
const lines = src.split('\n');

function findAndReplaceMacros(title, macros, category) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Find all occurrences of this title
  const pattern = new RegExp(`title: '${escaped}'`);
  let startIdx = 0;
  let found = false;
  
  while (true) {
    const idx = src.indexOf(`title: '${title}'`, startIdx);
    if (idx === -1) break;
    
    // Check if the category matches (look within next 200 chars)
    const snippet = src.substring(idx, idx + 300);
    const catMatch = snippet.match(/category: '(\w+)'/);
    if (catMatch && category && catMatch[1] !== category) {
      startIdx = idx + 1;
      continue;
    }
    
    // Find the calories/protein/carbs/fat/fiber block near this title
    const calIdx = src.indexOf('calories:', idx);
    if (calIdx === -1 || calIdx - idx > 500) { startIdx = idx + 1; continue; }
    
    // Extract the macro block
    const blockStart = calIdx;
    const fiberEnd = src.indexOf('\n', src.indexOf('fiber:', blockStart)) + 1;
    const oldBlock = src.substring(blockStart, fiberEnd);
    
    const newBlock = oldBlock
      .replace(/calories: \d+/, `calories: ${macros.cal}`)
      .replace(/protein: \d+/, `protein: ${macros.protein}`)
      .replace(/carbs: \d+/, `carbs: ${macros.carbs}`)
      .replace(/fat: \d+/, `fat: ${macros.fat}`)
      .replace(/fiber: \d+/, `fiber: ${macros.fiber}`);
    
    src = src.substring(0, blockStart) + newBlock + src.substring(fiberEnd);
    found = true;
    startIdx = idx + 1;
    if (!category) break; // If no category filter, just do first match
  }
  
  return found;
}

// Apply macro fixes - need to handle duplicates carefully
// First, handle recipes that exist in only one category
const snackDuplicates = ['Banánovo ovsené lievance', 'Banánový chlieb', 'Jahodový chia puding', 'Ovsený chia puding'];

// Process all non-duplicate macro fixes
for (const [title, macros] of Object.entries(macroFixes)) {
  // Determine expected category
  let cat = null;
  if (['Hubová polievka','Kuracia polievka na mexický štýl','Kuracia polievka na štýl pho','Miso polievka s jačmeňom','Paradajková polievka s fazuľou','Polievka z tekvice a batátov','Šošovicová kari polievka','Vegánska šošovicová polievka','Vývar na ázijský štýl'].includes(title)) {
    cat = 'vecera'; // already changed to vecera above
  }
  // Check if it might be in obed that was moved to vecera
  if (toVecera.includes(title) && !cat) cat = 'vecera';
  
  findAndReplaceMacros(title, macros, cat);
}

// Now handle snack duplicates - these have same title but category 'snack'
// For snacks, we need to find the second occurrence (snack version)
const snackMacros = {
  'Banánovo ovsené lievance': macroReplace('Banánovo ovsené lievance (snack)', 180, 6, 26, 6, 2),
  'Banánový chlieb': macroReplace('Banánový chlieb (snack)', 190, 6, 28, 6, 2),
  'Jahodový chia puding': macroReplace('Jahodový chia puding (snack)', 160, 6, 20, 8, 6),
  'Ovsený chia puding': macroReplace('Ovsený chia puding (snack)', 170, 6, 22, 8, 5),
};

for (const [title, macros] of Object.entries(snackMacros)) {
  findAndReplaceMacros(title, macros, 'snack');
}

// Verify results
const verifyLines = src.split('\n');
const counts = { obed: 0, vecera: 0, ranajky: 0, snack: 0, smoothie: 0 };
const cal380 = [];
const cal180 = [];
const cal480 = [];

for (let i = 0; i < verifyLines.length; i++) {
  const cm = verifyLines[i].match(/^\s*category: '(\w+)'/);
  if (cm) counts[cm[1]]++;
  
  const calM = verifyLines[i].match(/^\s*calories: (\d+)/);
  if (calM) {
    const v = parseInt(calM[1]);
    if (v === 380) cal380.push(i);
    if (v === 180) cal180.push(i);
    if (v === 480) cal480.push(i);
  }
}

console.log('\n=== VERIFICATION ===');
console.log('Categories:', counts);
console.log('Recipes with 380 cal:', cal380.length);
console.log('Recipes with 180 cal:', cal180.length);  
console.log('Recipes with 480 cal:', cal480.length);

fs.writeFileSync('recipes.ts', src);
console.log('\nFile written successfully!');
