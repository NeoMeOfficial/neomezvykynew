// Script to update all breakfast recipes with PDF paths
const fs = require('fs');
const path = require('path');

// PDF filename to recipe title mapping
const pdfMappings = {
  'Acai miska.pdf': 'Acai miska',
  'Avokádový toast s fetou.pdf': 'Avokádový toast s fetou', 
  'Banánovo ovsené lievance.pdf': 'Banánovo ovsené lievance',
  'Banánový chlieb.pdf': 'Banánový chlieb',
  'Bylinkové vajíčka s kyslou kapustou.pdf': 'Bylinkové vajíčka s kyslou kapustou',
  'Čili stratené vajíčka.pdf': 'Čili stratené vajíčka',
  'Čokoládová raňajková miska.pdf': 'Čokoládová raňajková miska', 
  'Jahodový chia puding.pdf': 'Jahodový chia puding',
  'Kokosovo pohánková overnight kaša.pdf': 'Kokosovo pohánková overnight kaša',
  'Omeleta s kyslou kapustou.pdf': 'Omeleta s kyslou kapustou',
  'Ovsená mrkvová kaša.pdf': 'Ovsená mrkvová kaša',
  'Ovsený chia puding.pdf': 'Ovsený chia puding',
  'Ovsený overnight s čučoriedkami.pdf': 'Ovsený overnight s čučoriedkami',
  'Praženica s kozím syrom.pdf': 'Praženica s kozím syrom',
  'Praženica z tofu.pdf': 'Raňajková praženica z tofu', // Note: Different title in DB
  'Proteínová kaša s čučoriedkami.pdf': 'Proteínová kaša s čučoriedkami',
  'Sezamový losos na ražnom chlebe.pdf': 'Sezamový losos na ražnom chlebe',
  'Sladká krémová kaša s quinoou.pdf': 'Sladká krémová kaša s quinoou',
  'Slaná palacinka s rukolou a šunkou.pdf': 'Slaná palacinka s rukolou a šunkou',
  'Špaldová placka s ricottou.pdf': 'Špaldová placka s ricottou',
  'Toasty s vajíčkom, hubami a avokádom.pdf': 'Toasty s vajíčkom, hubami a avokádom',
  'Vegánske palacinky.pdf': 'Vegánske palacinky'
};

const recipesFile = './src/data/recipes.ts';

try {
  let content = fs.readFileSync(recipesFile, 'utf8');
  
  // For each PDF mapping, find the recipe and add PDF path
  Object.entries(pdfMappings).forEach(([pdfName, recipeTitle]) => {
    const pdfPath = `/assets/recipes/ranajky/${encodeURIComponent(pdfName)}`;
    
    // Find recipe by title and add/update pdfPath
    const titlePattern = new RegExp(`title: '${recipeTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?difficulty: '(?:easy|medium)',`, 'g');
    
    content = content.replace(titlePattern, (match) => {
      // Check if pdfPath already exists
      if (match.includes('pdfPath:')) {
        // Update existing pdfPath
        return match.replace(/pdfPath: '[^']*',?/g, `pdfPath: '${pdfPath}',`);
      } else {
        // Add new pdfPath before the closing brace
        return match.replace(/difficulty: '(easy|medium)',/, `difficulty: '$1',\n    pdfPath: '${pdfPath}',`);
      }
    });
  });
  
  fs.writeFileSync(recipesFile, content, 'utf8');
  console.log('✅ Successfully updated all breakfast recipes with PDF paths!');
  console.log(`📄 Updated ${Object.keys(pdfMappings).length} recipes`);
  
} catch (error) {
  console.error('❌ Error updating recipes:', error);
}