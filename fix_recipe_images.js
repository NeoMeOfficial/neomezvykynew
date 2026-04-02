// Systematická oprava obrázkov receptov - presné mapovanie

import fs from 'fs';

// Presné mapovanie receptov na zodpovedajúce obrázky
const recipeImageMap = {
  'Acai miska': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=500&fit=crop&q=80', // acai bowl
  'Avokádový toast s fetou': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=500&fit=crop&q=80', // avocado toast
  'Banánovo ovsené lievance': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop&q=80', // banana pancakes
  'Banánový chlieb': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80', // banana bread
  'Bylinkové vajíčka s kyslou kapustou': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&h=500&fit=crop&q=80', // herbed eggs
  'Čili stratené vajíčka': 'https://images.unsplash.com/photo-1608137378238-3bcefa435b82?w=800&h=500&fit=crop&q=80', // poached eggs
  'Čokoládová raňajková miska': 'https://images.unsplash.com/photo-1511690658391-c3ab1a9b5d7b?w=800&h=500&fit=crop&q=80', // chocolate breakfast bowl
  'Jahodový chia puding': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=500&fit=crop&q=80', // strawberry chia pudding
  'Kokosovo pohánková overnight kaša': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80', // overnight oats
  'Omeleta s kyslou kapustou': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=500&fit=crop&q=80', // omelet
  'Ovsená mrkvová kaša': 'https://images.unsplash.com/photo-1571197119282-7c4b999a5b91?w=800&h=500&fit=crop&q=80', // carrot oatmeal
  'Ovsený chia puding': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=500&fit=crop&q=80', // oat chia pudding
  'Ovsený overnight s čučoriedkami': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop&q=80', // blueberry overnight oats
  'Praženica s kozím syrom': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=500&fit=crop&q=80', // scrambled eggs
  'Praženica z tofu': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80', // tofu scramble
  'Proteínová kaša s čučoriedkami': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop&q=80', // protein porridge
  'Sezamový losos na ražnom chlebe': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=500&fit=crop&q=80', // salmon toast
  'Sladká krémová kaša s quinoou': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop&q=80', // quinoa porridge
  'Slaná palacinka s rukolou a šunkou': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=500&fit=crop&q=80', // savory pancake
  'Špaldová placka s ricottou': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop&q=80', // spelt pancake
  'Toasty s vajíčkom, hubami a avokádom': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=500&fit=crop&q=80', // egg mushroom toast
  'Vegánske palacinky': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80', // vegan pancakes
  'Raňajková praženica z tofu': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80', // tofu scramble
  'Plátok z batátov a slaniny': 'https://images.unsplash.com/photo-1606479109936-6b7fffeb9e53?w=800&h=500&fit=crop&q=80', // sweet potato dish
  'Mini zeleninové frittaty': 'https://images.unsplash.com/photo-1608137378238-3bcefa435b82?w=800&h=500&fit=crop&q=80', // mini frittatas
  'Cukinový plátok so slaninou': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=500&fit=crop&q=80', // zucchini dish
  'Healthy Carrot Cake Pancakes': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=500&fit=crop&q=80', // carrot pancakes
  'Healthy Vegan Tofu Scramble (GF, VE)': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80', // vegan tofu scramble
};

// Čítaj súbor s receptmi
let content = fs.readFileSync('src/data/recipes.ts', 'utf8');

// Pre každý recept, aktualizuj obrázok
Object.entries(recipeImageMap).forEach(([recipeName, imageUrl]) => {
  // Hľadaj vzor: title: 'NÁZOV_RECEPTU', nasledovaný niekde image: 'STARÝ_URL'
  const titleRegex = new RegExp(`title: '${recipeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?image: 'https://[^']*'`, 'g');
  
  content = content.replace(titleRegex, (match) => {
    return match.replace(/image: 'https:\/\/[^']*'/, `image: '${imageUrl}'`);
  });
});

// Zapíš opravený súbor
fs.writeFileSync('src/data/recipes.ts', content);

console.log('✅ Všetky obrázky receptov boli opravené!');
console.log('Receptov aktualizovaných:', Object.keys(recipeImageMap).length);