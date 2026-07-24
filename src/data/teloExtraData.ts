// Static exercise data — mirrors the real recorded catalog seeded by
// supabase/migrations/20260724150000_exercise_placeholders_real_catalog.sql.
// Used by ExercisesTab in Admin.tsx for (re)seeding Supabase; upserts the
// same cv-* ids, so re-importing never duplicates or resurrects old demo
// rows. Level is intentionally null everywhere — the library taxonomy has
// no difficulty level (see src/features/telo/exerciseTaxonomy.ts).

export const TeloExtraStaticData = [
  // 15 min · Core & brucho · bez pomôcok (č. 1 = diastáza-safe = free)
  { id: 'cv-core-bez-15-1', name: 'Core 15min bez pomôcok #1 (diastáza)', duration: '15 min', category: '15min', body: 'Core/Abs', equip: 'Bez pomôcok', level: null, diastasis_safe: true,  thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Jemné posilnenie stredu tela. Bezpečné aj pri diastáze.' },
  { id: 'cv-core-bez-15-2', name: 'Core 15min bez pomôcok #2',            duration: '15 min', category: '15min', body: 'Core/Abs', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Posilnenie stredu tela bez pomôcok.' },
  { id: 'cv-core-bez-15-3', name: 'Core 15min bez pomôcok #3',            duration: '15 min', category: '15min', body: 'Core/Abs', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Posilnenie stredu tela bez pomôcok.' },
  { id: 'cv-core-bez-15-4', name: 'Core 15min bez pomôcok #4',            duration: '15 min', category: '15min', body: 'Core/Abs', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Posilnenie stredu tela bez pomôcok.' },
  // 15 min · Core & brucho · s gumou (diastáza-safe)
  { id: 'cv-core-guma-15-1', name: 'Core 15min s gumou #1 (diastáza)', duration: '15 min', category: '15min', body: 'Core/Abs', equip: 'S gumou', level: null, diastasis_safe: true, thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Posilnenie stredu tela s gumou. Bezpečné aj pri diastáze.' },
  // 15 min · Celé telo
  { id: 'cv-full-cinky-15-1', name: 'Celé telo 15min s jednoručkami #1', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S činkami',   level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Komplexný tréning celého tela s jednoručkami.' },
  { id: 'cv-full-guma-15-1',  name: 'Celé telo 15min s gumou #1',        duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S gumou',     level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Komplexný tréning celého tela s gumou.' },
  { id: 'cv-full-guma-15-2',  name: 'Celé telo 15min s gumou #2',        duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S gumou',     level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Komplexný tréning celého tela s gumou.' },
  { id: 'cv-full-bez-15-1',   name: 'Celé telo 15min bez pomôcok #1',    duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Komplexný tréning celého tela bez pomôcok.' },
  { id: 'cv-full-bez-15-2',   name: 'Celé telo 15min bez pomôcok #2',    duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Komplexný tréning celého tela bez pomôcok.' },
  // 5 min dopaľovačky · Core & brucho
  { id: 'cv-core-bez-5-1', name: 'Core 5min dopaľovačka #1', duration: '5 min', category: 'dopalovacka', body: 'Core/Abs', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Krátka dopaľovačka na stred tela.' },
  { id: 'cv-core-bez-5-2', name: 'Core 5min dopaľovačka #2', duration: '5 min', category: 'dopalovacka', body: 'Core/Abs', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Krátka dopaľovačka na stred tela.' },
  { id: 'cv-core-bez-5-3', name: 'Core 5min dopaľovačka #3', duration: '5 min', category: 'dopalovacka', body: 'Core/Abs', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-core-workout.jpg', description: 'Krátka dopaľovačka na stred tela.' },
  // 5 min dopaľovačky · Celé telo
  { id: 'cv-full-bez-5-1', name: 'Celé telo 5min dopaľovačka #1', duration: '5 min', category: 'dopalovacka', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Krátka dopaľovačka na celé telo.' },
  { id: 'cv-full-bez-5-2', name: 'Celé telo 5min dopaľovačka #2', duration: '5 min', category: 'dopalovacka', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Krátka dopaľovačka na celé telo.' },
  { id: 'cv-full-bez-5-3', name: 'Celé telo 5min dopaľovačka #3', duration: '5 min', category: 'dopalovacka', body: 'Celé telo', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/program-body-forming.jpg', description: 'Krátka dopaľovačka na celé telo.' },
  // 5 min dopaľovačky · Nohy & zadok
  { id: 'cv-legs-bez-5-1', name: 'Nohy/zadok 5min dopaľovačka #1', duration: '5 min', category: 'dopalovacka', body: 'Nohy/Zadok', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-yoga-pose.jpg', description: 'Krátka dopaľovačka na nohy a zadok.' },
  { id: 'cv-legs-bez-5-2', name: 'Nohy/zadok 5min dopaľovačka #2', duration: '5 min', category: 'dopalovacka', body: 'Nohy/Zadok', equip: 'Bez pomôcok', level: null, diastasis_safe: false, thumb: '/images/r9/lifestyle-yoga-pose.jpg', description: 'Krátka dopaľovačka na nohy a zadok.' },
];
