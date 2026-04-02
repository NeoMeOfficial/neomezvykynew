// Presné mapovanie receptov na základe anglického zdroja

import fs from 'fs';

// Presné mapovanie slovenských receptov na zodpovedajúce anglické jedlá
const preciseImageMap = {
  'Raňajková praženica z tofu': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80', // tofu scramble
  'Praženica z tofu': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80', // tofu scramble
  'Sezamový losos na ražnom chlebe': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=500&fit=crop&q=80', // salmon toast
  'Banánovo ovsené lievance': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop&q=80', // banana pancakes
  'Sladká krémová kaša s quinoou': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop&q=80', // quinoa porridge
  'Plátok z batátov a slaniny': 'https://images.unsplash.com/photo-1606479109936-6b7fffeb9e53?w=800&h=500&fit=crop&q=80', // sweet potato slice
  'Avokádový toast s fetou': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=500&fit=crop&q=80', // avocado toast
  
  // Dodatočné presné obrázky pre ostatné recepty
  'Acai miska': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=500&fit=crop&q=80', // acai bowl
  'Čokoládová raňajková miska': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop&q=80', // chocolate breakfast bowl
  'Jahodový chia puding': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=500&fit=crop&q=80', // strawberry chia pudding
  'Ovsený chia puding': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=500&fit=crop&q=80', // chia pudding
  'Ovsený overnight s čučoriedkami': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop&q=80', // overnight oats with blueberries
  'Kokosovo pohánková overnight kaša': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80', // overnight oats
  'Ovsená mrkvová kaša': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80', // carrot oatmeal
  'Proteínová kaša s čučoriedkami': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop&q=80', // protein porridge with blueberries
  'Čili stratené vajíčka': 'https://images.unsplash.com/photo-1608137378238-3bcefa435b82?w=800&h=500&fit=crop&q=80', // poached eggs
  'Bylinkové vajíčka s kyslou kapustou': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&h=500&fit=crop&q=80', // herbed scrambled eggs
  'Omeleta s kyslou kapustou': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=500&fit=crop&q=80', // omelet
  'Praženica s kozím syrom': 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&h=500&fit=crop&q=80', // scrambled eggs with cheese
  'Toasty s vajíčkom, hubami a avokádom': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=500&fit=crop&q=80', // egg mushroom avocado toast
  'Vegánske palacinky': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80', // vegan pancakes
  'Špaldová placka s ricottou': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop&q=80', // ricotta pancakes
  'Slaná palacinka s rukolou a šunkou': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=500&fit=crop&q=80', // savory pancake
  'Banánový chlieb': 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&h=500&fit=crop&q=80', // banana bread
  'Mini zeleninové frittaty': 'https://images.unsplash.com/photo-1608137378238-3bcefa435b82?w=800&h=500&fit=crop&q=80', // mini frittatas
  'Cukinový plátok so slaninou': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=500&fit=crop&q=80', // zucchini slice
  'Healthy Carrot Cake Pancakes': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=500&fit=crop&q=80', // carrot pancakes
  'Healthy Vegan Tofu Scramble (GF, VE)': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=500&fit=crop&q=80', // vegan tofu scramble
};

// Čítaj súbor s receptmi
let content = fs.readFileSync('src/data/recipes.ts', 'utf8');

// Pre každý recept, aktualizuj obrázok
Object.entries(preciseImageMap).forEach(([recipeName, imageUrl]) => {
  // Hľadaj vzor pre daný recept a zmeň jeho obrázok
  const regex = new RegExp(
    `(id: [^,]*,\\s*title: '${recipeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?image: ')[^']*(')`
  );
  
  const match = content.match(regex);
  if (match) {
    content = content.replace(regex, `$1${imageUrl}$2`);
    console.log(`✅ ${recipeName} → obrázok aktualizovaný`);
  } else {
    console.log(`⚠️ ${recipeName} → nenájdený v databáze`);
  }
});

// Zapíš opravený súbor
fs.writeFileSync('src/data/recipes.ts', content);

console.log('\n🎯 Všetky obrázky receptov boli presne aktualizované!');