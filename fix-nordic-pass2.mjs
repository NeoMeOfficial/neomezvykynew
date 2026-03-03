import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

// Find ALL .tsx files in src/pages/v2/ and src/components/v2/
const files = execSync("find src/pages/v2 src/components/v2 -name '*.tsx'", { encoding: 'utf-8' })
  .trim().split('\n').filter(Boolean);

const SKIP_PREFIXES = ['CalmDesign', 'DesignShowcase', 'HomepageDesign', 'MealPlanBannerShowcase'];

let fixed = 0;

for (const file of files) {
  const basename = file.split('/').pop().replace('.tsx', '');
  if (SKIP_PREFIXES.some(p => basename.startsWith(p))) continue;

  let code = readFileSync(file, 'utf-8');
  const original = code;

  // 1. Add warmDusk import if missing
  if (!code.includes('warmDusk')) {
    const lines = code.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^import /)) lastImportIdx = i;
    }
    if (lastImportIdx >= 0) {
      // Determine relative path depth
      const depth = file.split('/').length - 2; // src/ is root
      let rel = '';
      for (let i = 0; i < depth - 1; i++) rel += '../';
      if (!rel) rel = './';
      lines.splice(lastImportIdx + 1, 0, `import { colors, glassCard } from '${rel}theme/warmDusk';`);
      code = lines.join('\n');
    }
  }

  // 2. Replace bg-white on cards (rounded-2xl, rounded-3xl) with frosted glass
  code = code.replace(
    /className="([^"]*?)bg-white (rounded-(?:2xl|3xl)[^"]*?)shadow-sm border border-gray-(?:50|100)"/g,
    (match, before, after) => `className="${before}bg-white/30 backdrop-blur-xl ${after}border border-white/30"`
  );
  // Also: "bg-white rounded-Xyl ... border border-gray-100"
  code = code.replace(
    /className="bg-white (rounded-(?:2xl|3xl)[^"]*?)shadow-sm border border-gray-(?:50|100)"/g,
    (match, after) => `className="bg-white/30 backdrop-blur-xl ${after}border border-white/30"`
  );
  // Simpler pattern: "bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
  code = code.replace(
    /bg-white (rounded-(?:2xl|3xl) [^"]*?)border border-gray-100/g,
    'bg-white/30 backdrop-blur-xl $1border border-white/30'
  );
  // Just "bg-white rounded-2xl" without border
  code = code.replace(
    /className="([^"]*?)bg-white (rounded-(?:2xl|3xl))([^"]*?)"/g,
    (match, before, rounded, after) => {
      if (match.includes('backdrop-blur') || match.includes('bg-white/')) return match;
      return `className="${before}bg-white/30 backdrop-blur-xl ${rounded}${after}"`;
    }
  );

  // 3. Fix remaining gray bg/border/text
  code = code.replace(/bg-gray-50(?!\d)/g, 'bg-white/20');
  code = code.replace(/bg-gray-100(?!\d)/g, 'bg-white/25');
  code = code.replace(/border-gray-50(?!\d)/g, 'border-white/20');
  code = code.replace(/border-gray-100(?!\d)/g, 'border-white/30');
  code = code.replace(/border-gray-200(?!\d)/g, 'border-white/35');
  
  // 4. Fix backgrounds on outer containers that still use old bg
  // "linear-gradient(to bottom, #FAF7F2, #F5F1E8)" → colors.bgGradient
  code = code.replace(
    /background: 'linear-gradient\(to bottom, #FAF7F2, #F5F1E8\)'/g,
    'background: colors.bgGradient'
  );

  if (code !== original) {
    writeFileSync(file, code);
    fixed++;
    console.log('✅ Fixed: ' + file);
  }
}

console.log('\nDone! Fixed ' + fixed + ' files');
