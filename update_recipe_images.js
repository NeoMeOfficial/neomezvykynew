// Script to update recipe images with thematic Unsplash URLs
const fs = require('fs');

// Read the recipes file
const recipesPath = './src/data/recipes.ts';
let content = fs.readFileSync(recipesPath, 'utf8');

// Thematic Unsplash images for breakfast recipes
const breakfastImages = {
  'Acai miska': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=500&fit=crop&q=80',
  'Avokádový toast s fetou': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=500&fit=crop&q=80',
  'Banánovo ovsené lievance': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop&q=80',
  'Banánový chlieb': 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&h=500&fit=crop&q=80',
  'Chia puding s mangom': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=500&fit=crop&q=80',
  'Granola s jogurtom': 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800&h=500&fit=crop&q=80',
  'Ovesná kaša': 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80',
  'Proteínová kaša': 'https://images.unsplash.com/photo-1571197119282-7c4b999a5b91?w=800&h=500&fit=crop&q=80',
  'Quinoa bowl': 'https://images.unsplash.com/photo-1511690658391-c3ab1a9b5d7b?w=800&h=500&fit=crop&q=80',
  'Smoothie bowl': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=500&fit=crop&q=80',
  'Vajíčka Benedict': 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&h=500&fit=crop&q=80',
  'Francúzsky toast': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=500&fit=crop&q=80',
  'Muesli': 'https://images.unsplash.com/photo-1571197119282-7c4b999a5b91?w=800&h=500&fit=crop&q=80',
  'Zapečené ovesné vločky': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=500&fit=crop&q=80'
};

// Function to find best matching image for a recipe title
function findBestImage(title) {
  // Direct match first
  if (breakfastImages[title]) {
    return breakfastImages[title];
  }
  
  // Partial matches
  const titleLower = title.toLowerCase();
  if (titleLower.includes('acai')) return breakfastImages['Acai miska'];
  if (titleLower.includes('avokádo') || titleLower.includes('toast')) return breakfastImages['Avokádový toast s fetou'];
  if (titleLower.includes('banán') && titleLower.includes('lievance')) return breakfastImages['Banánovo ovsené lievance'];
  if (titleLower.includes('banán') && titleLower.includes('chlieb')) return breakfastImages['Banánový chlieb'];
  if (titleLower.includes('chia')) return breakfastImages['Chia puding s mangom'];
  if (titleLower.includes('granola')) return breakfastImages['Granola s jogurtom'];
  if (titleLower.includes('ovesn') || titleLower.includes('ovos')) return breakfastImages['Ovesná kaša'];
  if (titleLower.includes('proteín')) return breakfastImages['Proteínová kaša'];
  if (titleLower.includes('quinoa')) return breakfastImages['Quinoa bowl'];
  if (titleLower.includes('smoothie') && titleLower.includes('bowl')) return breakfastImages['Smoothie bowl'];
  if (titleLower.includes('vajíčk') || titleLower.includes('benedict')) return breakfastImages['Vajíčka Benedict'];
  if (titleLower.includes('francúz') && titleLower.includes('toast')) return breakfastImages['Francúzsky toast'];
  if (titleLower.includes('muesli')) return breakfastImages['Muesli'];
  if (titleLower.includes('zapečen')) return breakfastImages['Zapečené ovesné vločky'];
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop&q=80';
}

// Regular expression to find and replace image paths for breakfast recipes
const breakfastRecipePattern = /(\{[^}]*id: '[^']*ranajky[^}]*title: '([^']*)'[^}]*image: ')[^']*('[^}]*\})/g;

content = content.replace(breakfastRecipePattern, (match, prefix, title, suffix) => {
  const newImage = findBestImage(title);
  console.log(`Updating ${title}: ${newImage}`);
  return prefix + newImage + suffix;
});

// Write updated content back to file
fs.writeFileSync(recipesPath, content, 'utf8');
console.log('Recipe images updated successfully!');