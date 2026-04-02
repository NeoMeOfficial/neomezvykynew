// EXAMPLE: Better Slovak Recipe Translations
// Comparison of current vs. improved translations

const translationExamples = [
  {
    original: "What Am I Eating: Peanut Butter, Banana, Oatmeal Breakfast Cookies with Cranberries",
    currentBad: "Sledovanie toho, čo jem: arašidové maslo, banán, ovsené raňajky, sušienky so svätojánskym chrobákom",
    improvedGood: "Ovsené raňajkové sušienky s arašidovým maslom a brusnicami",
    category: "ranajky"
  },
  {
    original: "Strawberry Ricotta Chocolate Chip Pancakes", 
    currentBad: "Jahodový tvarohový koláč Čokoládové palacinky",
    improvedGood: "Jahodové palacinky s tvarohom a čokoládovými kúskami",
    category: "ranajky"
  },
  {
    original: "Slow Cooker Spicy Hot Wings",
    currentBad: "pomaly sporak pikantne horuce kridla", 
    improvedGood: "Pikantné kuracie krídelka z pomalého hrnca",
    category: "obed"
  },
  {
    original: "Shrimp and Asparagus Foil Packets with Garlic Lemon Butter Sauce",
    currentBad: "balenia kreviet a sparglovej folie s cesnakovou citronovou maslovou omackou",
    improvedGood: "Krevety so šparglou v alobale s cesnakovým citrónovým maslom", 
    category: "vecera"
  }
];

// Better ingredient translations
const ingredientDictionary = {
  // Proteins
  "chicken breast": "kuracie prsia",
  "ground beef": "mleté hovädzie mäso",
  "salmon fillet": "lososový filet", 
  "shrimp": "krevety",
  "eggs": "vajcia",
  
  // Dairy
  "greek yogurt": "grécky jogurt",
  "ricotta cheese": "ricotta syr",
  "cream cheese": "krémový syr",
  "heavy cream": "smotana na šľahanie",
  "butter": "maslo",
  
  // Vegetables  
  "bell pepper": "paprika",
  "red onion": "červená cibuľa",
  "cherry tomatoes": "cherry paradajky",
  "asparagus": "špargľa",
  "spinach": "špenát",
  
  // Grains & Starches
  "quinoa": "quinoa",
  "brown rice": "hnedá ryža", 
  "whole wheat pasta": "celozrnné cestoviny",
  "oats": "ovos",
  "sweet potato": "sladký zemiak",
  
  // Seasonings
  "garlic powder": "cesnakový prášok",
  "italian seasoning": "talianske korenie",
  "paprika": "paprika", 
  "cumin": "rasca",
  "oregano": "oregano",
  
  // Cooking terms
  "sauté": "opražiť",
  "simmer": "povariť na miernom ohni",
  "bake": "piecť",
  "grill": "grilovať",
  "steam": "pariť"
};

// Slovak cooking method translations
const cookingMethods = {
  "slow cooker": "pomalý hrniec",
  "air fryer": "vzdušná fritéza", 
  "instant pot": "tlakový hrniec",
  "sheet pan": "plech",
  "skillet": "panvica",
  "dutch oven": "liatinový hrniec"
};

console.log('📝 TRANSLATION QUALITY COMPARISON:');
console.log('=====================================');

translationExamples.forEach((example, index) => {
  console.log(`\n${index + 1}. ${example.category.toUpperCase()}`);
  console.log(`Original: ${example.original}`);
  console.log(`❌ Current: ${example.currentBad}`);
  console.log(`✅ Better:  ${example.improvedGood}`);
  console.log('---');
});

module.exports = { translationExamples, ingredientDictionary, cookingMethods };