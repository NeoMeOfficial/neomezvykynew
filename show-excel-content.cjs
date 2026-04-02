// Show Excel content in readable format
const XLSX = require('xlsx');
const fs = require('fs');

function showExcelContent() {
  try {
    // Read Excel file
    const workbook = XLSX.readFile('spoonacular-recipes-2026-03-25.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📊 EXCEL OBSAH - ${jsonData.length} receptov:\n`);
    
    // Show first 5 recipes with key info
    jsonData.slice(0, 8).forEach((row, index) => {
      console.log(`${index + 1}. 🍳 RECEPT:`);
      console.log(`   📝 Original: ${row['Original Title (EN)'] || 'N/A'}`);
      console.log(`   🇸🇰 Slovak: ${row['Translated Title (SK)'] || 'N/A'}`);
      console.log(`   📂 Category: ${row['Category'] || 'N/A'}`);
      console.log(`   ⏱️ Time: ${row['Prep Time (min)'] || 'N/A'} min`);
      console.log(`   🔥 Calories: ${row['Calories'] || 'N/A'} kcal`);
      console.log(`   🥕 Ingredients (first 3): ${(row['Ingredients (EN)'] || '').split(';').slice(0, 3).join('; ')}`);
      console.log(`   🇸🇰 Ingredients SK: ${(row['Ingredients (SK)'] || '').split(';').slice(0, 2).join('; ')}`);
      console.log('   ---');
    });
    
    // Create CSV for easy import
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    fs.writeFileSync('spoonacular-recipes-2026-03-25.csv', csv);
    
    console.log(`\n💾 Vytvorený CSV súbor: spoonacular-recipes-2026-03-25.csv`);
    console.log(`📋 Total ${jsonData.length} receptov v tabuľke`);
    
    // Show statistics
    const categories = {};
    jsonData.forEach(row => {
      const cat = row['Category'] || 'unknown';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log('\n📊 ŠTATISTIKY:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} receptov`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Chyba:', error.message);
    return false;
  }
}

if (require.main === module) {
  showExcelContent();
}

module.exports = { showExcelContent };