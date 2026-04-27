export interface Exercise {
  id: string;
  name: string;
  duration: string;
  body: string;
  equip: string;
  thumb: string;
  category: 'stretch' | 'strength';
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'all';
  intensity: 'low' | 'medium' | 'high';
  route: string;
  /** Video ID. All-digit string (e.g. "1186819320") is treated as a Vimeo ID; otherwise YouTube ID (e.g. "v7AYKMP6rOE"). When set, renders an embedded player. */
  videoUrl?: string;
}

// Stretching exercises - ideal for luteal/menstrual phases
// videoUrl: YouTube video ID — replace with licensed content before production launch
const stretchExercises: Exercise[] = [
  {
    id: 'stretch-1',
    name: 'Ranný strečing – Celé telo',
    duration: '15 min',
    body: 'Celé telo',
    equip: 'Bez pomôcok',
    thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop',
    category: 'stretch',
    phase: 'all',
    intensity: 'low',
    route: '/stretch/0',
    videoUrl: 'jZ6ZQXB1F7g',
  },
  {
    id: 'stretch-2',
    name: 'Uvoľnenie hornej časti',
    duration: '15 min',
    body: 'Vršok/Stred tela',
    equip: 'Bez pomôcok',
    thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop',
    category: 'stretch',
    phase: 'luteal',
    intensity: 'low',
    route: '/stretch/1',
    videoUrl: 'jZ6ZQXB1F7g',
  },
  {
    id: 'stretch-3',
    name: 'Večerné uvoľnenie',
    duration: '15 min',
    body: 'Celé telo',
    equip: 'S gumou',
    thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop',
    category: 'stretch',
    phase: 'menstrual',
    intensity: 'low',
    route: '/stretch/4',
    videoUrl: 'jZ6ZQXB1F7g',
  },
  {
    id: 'stretch-4',
    name: 'Rýchla úľava – Celé telo',
    duration: '5 min',
    body: 'Celé telo',
    equip: 'Bez pomôcok',
    thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop',
    category: 'stretch',
    phase: 'all',
    intensity: 'low',
    route: '/stretch/3',
    videoUrl: 'jZ6ZQXB1F7g',
  }
];

// Strengthening exercises - ideal for follicular/ovulation phases
const strengthExercises: Exercise[] = [
  {
    id: 'strength-1',
    name: 'BodyForming · Deň 1, Týždeň 1',
    duration: '15 min',
    body: 'Celé telo',
    equip: 'Bez pomôcok',
    thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop',
    category: 'strength',
    phase: 'follicular',
    intensity: 'high',
    route: '/exercise/extra/0',
    videoUrl: '1186819320',
  },
  {
    id: 'strength-2',
    name: 'Core Ignite',
    duration: '15 min',
    body: 'Core/Abs',
    equip: 'Bez pomôcok',
    thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop',
    category: 'strength',
    phase: 'ovulation',
    intensity: 'high',
    route: '/exercise/extra/1',
    videoUrl: 'jZ6ZQXB1F7g',
  },
  {
    id: 'strength-3',
    name: 'Booty Builder',
    duration: '15 min',
    body: 'Nohy/Zadok',
    equip: 'S gumou',
    thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop',
    category: 'strength',
    phase: 'follicular',
    intensity: 'medium',
    route: '/exercise/extra/2',
    videoUrl: 'jZ6ZQXB1F7g',
  },
  {
    id: 'strength-4',
    name: 'Quick Burn – Celé telo',
    duration: '5 min',
    body: 'Celé telo',
    equip: 'Bez pomôcok',
    thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop',
    category: 'strength',
    phase: 'ovulation',
    intensity: 'medium',
    route: '/exercise/extra/4',
    videoUrl: 'jZ6ZQXB1F7g',
  },
  {
    id: 'strength-5',
    name: 'Upper Body Sculpt',
    duration: '15 min',
    body: 'Celé telo',
    equip: 'S jednoručkami',
    thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop',
    category: 'strength',
    phase: 'follicular',
    intensity: 'high',
    route: '/exercise/extra/6',
    videoUrl: 'jZ6ZQXB1F7g',
  }
];

export const exercises: Exercise[] = [...stretchExercises, ...strengthExercises];

// Smart recommendation function based on cycle phase
export function getRecommendedExercise(phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal'): Exercise {
  let filteredExercises: Exercise[] = [];
  
  switch (phase) {
    case 'menstrual':
      // During menstruation: gentle stretching, low intensity
      filteredExercises = exercises.filter(e => 
        e.category === 'stretch' && 
        (e.phase === 'menstrual' || e.phase === 'all') && 
        e.intensity === 'low'
      );
      break;
    
    case 'follicular':
      // Follicular phase: building energy, strength training
      filteredExercises = exercises.filter(e => 
        e.category === 'strength' && 
        (e.phase === 'follicular' || e.phase === 'all')
      );
      break;
    
    case 'ovulation':
      // Ovulation: peak energy, high intensity
      filteredExercises = exercises.filter(e => 
        e.category === 'strength' && 
        (e.phase === 'ovulation' || e.phase === 'all') &&
        (e.intensity === 'high' || e.intensity === 'medium')
      );
      break;
    
    case 'luteal':
      // Luteal phase: moderate intensity, stretching preferred
      filteredExercises = exercises.filter(e => 
        (e.category === 'stretch' || (e.category === 'strength' && e.intensity !== 'high')) && 
        (e.phase === 'luteal' || e.phase === 'all')
      );
      break;
  }
  
  // If no specific exercises found, return a default based on phase preference
  if (filteredExercises.length === 0) {
    filteredExercises = phase === 'menstrual' || phase === 'luteal' 
      ? stretchExercises 
      : strengthExercises;
  }
  
  // Return a random exercise from the filtered list
  const randomIndex = Math.floor(Math.random() * filteredExercises.length);
  return filteredExercises[randomIndex];
}

// Alternative: get exercise by specific preference
export function getExerciseByCategory(category: 'stretch' | 'strength'): Exercise {
  const filteredExercises = exercises.filter(e => e.category === category);
  const randomIndex = Math.floor(Math.random() * filteredExercises.length);
  return filteredExercises[randomIndex];
}

// Get all exercises of a specific category
export function getExercisesByCategory(category: 'stretch' | 'strength'): Exercise[] {
  return exercises.filter(e => e.category === category);
}