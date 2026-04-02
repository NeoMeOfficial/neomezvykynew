// Debug script to check Strava category click handlers
// This will help identify if the issue is with the click handlers or navigation

console.log('Debugging Strava category clicks...');

// Test navigation URLs
const categories = [
  'Raňajky',
  'Hlavné jedlá a polievky', 
  'Snacky'
];

categories.forEach(category => {
  const encodedCategory = encodeURIComponent(category);
  const url = `/recepty?category=${encodedCategory}`;
  console.log(`${category} -> ${url}`);
});

console.log('\nTesting URL encoding:');
console.log('Raňajky:', encodeURIComponent('Raňajky'));
console.log('Hlavné jedlá a polievky:', encodeURIComponent('Hlavné jedlá a polievky'));
console.log('Snacky:', encodeURIComponent('Snacky'));