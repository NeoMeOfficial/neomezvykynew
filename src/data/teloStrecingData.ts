// Static stretch data — mirrors Gabi's real recorded stretch catalog
// (2026-07-25). Used by ExercisesTab in Admin.tsx for (re)seeding
// Supabase; upserts stable cvs-* ids, so re-importing never duplicates.
// The admin import archives every non-cv*/cvs* row first, so the old
// demo stretches (ct-*, vs-*, dc-*) retire automatically.
//
// Recorded inventory this mirrors:
//   15 min: celé telo bez pomôcok ×4, celé telo s gumou ×1
//   5 min rýchla úľava: celé telo bez pomôcok ×3, vršok/stred ×2

export const TeloStrecingStaticData = [
  // 15 min strečingy · Celé telo
  { id: 'cvs-full-bez-15-1', name: 'Strečing celé telo 15min bez pomôcok #1', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Uvoľnenie celého tela bez pomôcok.' },
  { id: 'cvs-full-bez-15-2', name: 'Strečing celé telo 15min bez pomôcok #2', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Uvoľnenie celého tela bez pomôcok.' },
  { id: 'cvs-full-bez-15-3', name: 'Strečing celé telo 15min bez pomôcok #3', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Uvoľnenie celého tela bez pomôcok.' },
  { id: 'cvs-full-bez-15-4', name: 'Strečing celé telo 15min bez pomôcok #4', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Uvoľnenie celého tela bez pomôcok.' },
  { id: 'cvs-full-guma-15-1', name: 'Strečing celé telo 15min s gumou #1', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S gumou', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Hlbšie uvoľnenie celého tela s gumou.' },
  // 5 min rýchla úľava · Celé telo
  { id: 'cvs-full-bez-5-1', name: 'Rýchla úľava celé telo #1', duration: '5 min', category: 'quickstretch', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Krátka úľava pre celé telo.' },
  { id: 'cvs-full-bez-5-2', name: 'Rýchla úľava celé telo #2', duration: '5 min', category: 'quickstretch', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Krátka úľava pre celé telo.' },
  { id: 'cvs-full-bez-5-3', name: 'Rýchla úľava celé telo #3', duration: '5 min', category: 'quickstretch', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/hero-yoga.jpg', description: 'Krátka úľava pre celé telo.' },
  // 5 min rýchla úľava · Vršok & stred tela
  { id: 'cvs-upper-bez-5-1', name: 'Rýchla úľava vršok/stred tela #1', duration: '5 min', category: 'quickstretch', body: 'Vršok/Stred tela', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/lifestyle-yoga-pose.jpg', description: 'Krátke uvoľnenie ramien, krku a chrbtice.' },
  { id: 'cvs-upper-bez-5-2', name: 'Rýchla úľava vršok/stred tela #2', duration: '5 min', category: 'quickstretch', body: 'Vršok/Stred tela', equip: 'Bez pomôcok', level: null, diastasis_safe: true, thumb: '/images/r9/lifestyle-yoga-pose.jpg', description: 'Krátke uvoľnenie ramien, krku a chrbtice.' },
];
