# Technical Handoff Guide - NeoMe Project

*Complete guide for any developer/AI to understand the codebase principles, patterns, and reasoning behind every technical decision.*

---

## 🏗️ **Architecture Philosophy**

### Core Principles (Established through 6 months of development)
1. **Mobile-First Everything** - 90%+ users on mobile, design mobile → scale up
2. **Quality Over Quantity** - 23 perfect recipes > 108 error-prone ones  
3. **Simplicity Over Features** - 6 symptoms > complex medical forms
4. **Visual Hierarchy** - Warm colors create emotional safety for mothers
5. **API-First Content** - Spoonacular > custom database maintenance

---

## 🎨 **Design System - "Warm Dusk"**

### Color Psychology & Implementation
```typescript
// Core color system (born from Feb 20 design conversation)
export const COLORS = {
  // Section-specific colors
  telo: '#6B4C3B',      // Brown - Body/Exercise (earthy, grounding)
  strava: '#7A9E78',    // Green - Nutrition (natural, healthy)  
  mysel: '#A8848B',     // Mauve - Mind (calming, introspective)
  periodka: '#C27A6E',  // Coral - Period tracking (warm, feminine)
  accent: '#B8864A',    // Gold - Highlights (premium, attention)
  
  // Typography hierarchy
  primary: '#2E2218',   // Dark brown for headings
  body: '#8B7560',      // Medium brown for body text
  secondary: '#A0907E', // Light brown for secondary text
};

// Why these colors? Sam's requirement: "warm, earthy, calming colours — NOT purple/cyan/pink"
// Target user: Slovak mothers need emotional safety in wellness journey
```

### Glassmorphism Formula
```css
/* Standard card pattern used throughout app */
.glass-card {
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(40px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.20);
}

/* Why glassmorphism? Creates premium feel without overwhelming busy mothers */
```

### Typography Hierarchy
```css
/* Font sizes established through user testing feedback */
.heading-xl { font-size: 18px; }  /* Section headers */
.heading-lg { font-size: 16px; }  /* Card titles */
.body-text { font-size: 14px; }   /* Main content */
.caption { font-size: 12px; }     /* Secondary info */

/* Font: Lufga family - clean, modern, readable on mobile */
```

---

## 📱 **Component Architecture**

### Universal Patterns

#### 1. Filter System Pattern
```jsx
// Used in: Recipes, Exercises, Programs, Meditations
const [activeFilter, setActiveFilter] = useState('Všetko');
const filteredItems = items.filter(item => 
  activeFilter === 'Všetko' || item.category === activeFilter
);

// Why this pattern? Consistent UX across all content browsing
```

#### 2. Glassmorphism Card Template  
```jsx
// Used everywhere for visual consistency
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 p-4 ${className}`}>
    {children}
  </div>
);
```

#### 3. Paywall Integration Pattern
```jsx
// Flexible paywall for different content types
const { showContentPaywall } = usePaywall('recipes'); // or 'exercises', 'habits'

const handleItemClick = (item, index) => {
  if (showContentPaywall(index)) {
    // Show subscription modal
    return;
  }
  // Navigate to content
};

// Why this pattern? Different free limits for different content types
```

#### 4. Loading State Pattern
```jsx
// Consistent loading experience across app
const [loading, setLoading] = useState(true);

return (
  <div className="min-h-screen pb-20">
    {loading ? (
      <LoadingSpinner />
    ) : (
      <ContentComponent />
    )}
  </div>
);
```

---

## 🧮 **Complex Business Logic**

### Period Tracking Calculations
```typescript
// utils/periodCalculations.ts - Core menstrual cycle mathematics
export function getPhaseByDay(day: number, cycleLength: number, periodLength: number) {
  const ranges = getPhaseRanges(cycleLength, periodLength);
  return ranges.find(range => day >= range.start && day <= range.end)?.phase || 'menstrual';
}

export function getPhaseRanges(cycleLength: number, periodLength: number) {
  // Medical algorithm: 
  // 1. Menstrual phase: Days 1-periodLength
  // 2. Follicular phase: Day after period ends until ovulation
  // 3. Ovulation: ~Day 14 (adjusted for cycle length)  
  // 4. Luteal phase: Post-ovulation until next cycle
  
  const ovulationDay = Math.round(cycleLength - 14); // Standard 14-day luteal phase
  const follicularEnd = ovulationDay - 2;
  const ovulationEnd = ovulationDay + 2;
  
  return [
    { phase: 'menstrual', start: 1, end: periodLength },
    { phase: 'follicular', start: periodLength + 1, end: follicularEnd },
    { phase: 'ovulation', start: follicularEnd + 1, end: ovulationEnd },
    { phase: 'luteal', start: ovulationEnd + 1, end: cycleLength }
  ];
}

// Why this complexity? Medical accuracy hidden behind simple UI
// Users see: beautiful cycle wheel + phase descriptions
// App uses: precise calculations for exercise/nutrition recommendations
```

### Exercise Program Progression Logic
```typescript
// Business logic: 4-tier progression system
export const PROGRAM_TIERS = {
  1: {
    name: 'Postpartum',
    duration: 8, // weeks (longer for recovery)
    equipment: ['Karimatka', 'Pilates ball', 'Rezistenčné gumy'],
    target: 'Post-birth recovery, core activation, diastáza safe'
  },
  2: {
    name: 'BodyForming', 
    duration: 6,
    equipment: ['Karimatka'],
    target: 'Entry level body shaping, form building'
  },
  3: {
    name: 'ElasticBands',
    duration: 6, 
    equipment: ['Karimatka', 'Krátka guma', 'Dlhá guma'],
    target: 'Intermediate resistance training'
  },
  4: {
    name: 'Strong&Sexy',
    duration: 6,
    equipment: ['Karimatka', 'Jednoručky 1-2kg/3-5kg', 'Dlhá guma'],
    target: 'Advanced strength and muscle definition'
  }
};

// Why this structure? Natural progression path for busy mothers:
// Recovery → Basics → Resistance → Strength
// Equipment scaling: Mat → Bands → Dumbbells (investment grows with commitment)
```

---

## 🗄️ **Data Architecture**

### State Management Philosophy
```typescript
// No Redux - Context + localStorage for MVP simplicity
// Why? Most state is user-specific and needs offline persistence

// Pattern used throughout:
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });
  
  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  
  return [value, setStoredValue];
};
```

### Recipe Database Evolution
```typescript
// Evolution path captured in conversations:

// Phase 1: Custom OCR Database (FAILED)
const ocrRecipes = {
  count: 108,
  errors: {
    emptyAmounts: 387,
    ocrArtifacts: 66,
    dinnerRecipes: 0
  }
  // Problem: Unsustainable to maintain quality
};

// Phase 2: Manual Cleanup (TEMPORARY)
const cleanedRecipes = {
  count: 23,
  errors: 0,
  quality: 'Perfect but limited'
  // Problem: Can't scale content creation
};

// Phase 3: Spoonacular API (CURRENT)
const spoonacularIntegration = {
  database: '5000+ recipes',
  quality: 'Professional-grade',
  mealPlanning: 'Built-in',
  cost: '$50-100/month for 300 users',
  maintenance: 'Zero - handled by Spoonacular'
  // Solution: Scales with user growth, professional quality
};
```

---

## 🎯 **User Experience Patterns**

### Progressive Disclosure
```jsx
// Pattern: Show essential info first, details on demand
const ExerciseCard = ({ exercise }) => (
  <GlassCard>
    {/* Always visible */}
    <h3>{exercise.name}</h3>
    <PlayButton />
    <Duration>{exercise.duration}</Duration>
    
    {/* Show on tap/hover */}
    <ExpandableDetails>
      <Equipment>{exercise.equipment}</Equipment>
      <DiastasisSafe>{exercise.isDiastasisSafe}</DiastasisSafe>
      <Difficulty>{exercise.level}</Difficulty>
    </ExpandableDetails>
  </GlassCard>
);

// Why? Busy mothers need quick scanning, details when needed
```

### Error Handling Philosophy
```jsx
// Pattern: Graceful degradation with helpful fallbacks
const RecipeComponent = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <GlassCard>
        <h3>Niečo sa pokazilo</h3>
        <p>Skús to znovu alebo kontaktuj podporu</p>
        <RetryButton onClick={fetchRecipes} />
      </GlassCard>
    );
  }
  
  // Why? Clear messaging in Slovak, actionable next steps
};
```

---

## 🔧 **Development Patterns**

### File Structure Logic
```
src/
├── components/v2/        # Nordic design components (current)
├── components/v1/        # Legacy components (keep for reference)
├── pages/v2/            # Page-level components
├── data/                # Static content
│   ├── recipes.ts       # Recipe data (being replaced by Spoonacular)
│   ├── exercises.ts     # Exercise library
│   ├── meditations.ts   # Meditation content
│   └── programs.ts      # Program structures
├── utils/               # Business logic
│   ├── periodCalculations.ts  # Menstrual cycle algorithms
│   ├── dateHelpers.ts         # Date manipulation
│   └── formatters.ts          # Text/number formatting
├── hooks/               # Reusable React logic
│   ├── usePaywall.ts    # Subscription gate logic
│   ├── useAuth.ts       # Authentication (demo mode)
│   └── useFavorites.ts  # Universal favorites system
└── main.tsx → AppV2.tsx # Entry point (NOT App.tsx)

// Why v2? Complete redesign with Nordic system, v1 kept for reference
```

### Component Naming Conventions
```typescript
// Pattern: Section prefix + descriptive name
TeloPrograms.tsx         // Telo section - Programs page
StravaRecepty.tsx        // Strava section - Recipes page  
MyselMeditacie.tsx       // Mysel section - Meditations page
PeriodkaSettings.tsx     // Periodka section - Settings page

// Why? Clear organization by app section, easier to find files
```

### Responsive Design Pattern
```css
/* Mobile-first approach used throughout */
.component {
  /* Mobile styles (default) */
  padding: 1rem;
  font-size: 14px;
}

@media (min-width: 640px) {
  .component {
    /* Tablet adjustments */
    padding: 1.5rem;
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop enhancements */
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Why mobile-first? 90%+ users on mobile, better performance */
```

---

## 🚀 **API Integration Patterns**

### Spoonacular Integration (Future)
```typescript
// Planned API wrapper patterns
class SpoonacularService {
  private apiKey = process.env.VITE_SPOONACULAR_API_KEY;
  private baseUrl = 'https://api.spoonacular.com';
  
  async searchRecipes(query: string, diet?: string[], cuisine?: string[]) {
    // Cache frequently searched recipes
    const cacheKey = `recipes_${query}_${diet?.join(',')}_${cuisine?.join(',')}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    
    const response = await fetch(`${this.baseUrl}/recipes/complexSearch`, {
      headers: { 'X-API-Key': this.apiKey },
      // ... query params
    });
    
    const data = await response.json();
    this.saveToCache(cacheKey, data);
    return data;
  }
  
  async generateMealPlan(preferences: UserPreferences) {
    // User preferences → personalized meal plan
    return await fetch(`${this.baseUrl}/mealplanner/generate`, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timeFrame: 'week',
        targetCalories: preferences.calories,
        diet: preferences.dietaryRestrictions,
        exclude: preferences.allergies
      })
    });
  }
}

// Why this pattern? Caching reduces API costs, consistent error handling
```

---

## 🧪 **Testing Philosophy**

### Manual Testing Patterns
```typescript
// Key user flows to test (from TESTING_GUIDE.md):
const criticalFlows = [
  'Homepage → Telo → Program Selection → Program Detail',
  'Homepage → Strava → Recipe Category → Recipe Detail', 
  'Homepage → Periodka → Cycle Tracking → Settings',
  'Homepage → Myseľ → Meditation → Play',
  'Paywall trigger → Subscription modal → Upgrade flow'
];

// Why manual testing? MVP stage, focus on user experience over unit tests
```

---

## 💡 **Key Success Patterns**

### 1. User-Centric Decision Making
```
Every decision validated against: "Will this help a busy Slovak mother?"
Examples:
- 15-minute workouts → Fits into tight schedules
- 6-symptom tracking → Simple enough to use daily  
- Warm color palette → Creates emotional safety
- Glassmorphism → Premium feel builds trust
```

### 2. Technical Pragmatism
```
Choose proven solutions over custom complexity:
- Spoonacular API > Custom recipe database
- localStorage > Complex state management  
- React Context > Redux for MVP
- Tailwind classes > Custom CSS
```

### 3. Quality Over Features
```
Better to do fewer things excellently:
- 23 perfect recipes > 108 error-prone ones
- 4 well-designed programs > 10 generic ones
- 17 targeted meditations > 50 generic ones
```

### 4. Iterative Refinement
```
Every feature went through multiple conversations:
Period Tracker: Complex form → 6 symptoms → Visual wheel → Phase awareness
Homepage: Onboarding cards → Clean layout → Nordic design → Glassmorphism
Programs: Generic levels → 4-tier progression → Equipment scaling → Personalization
```

---

## 🔄 **Migration Paths**

### From localStorage to Backend
```typescript
// Current pattern (MVP):
const [habits, setHabits] = useLocalStorage('user_habits', []);

// Future pattern (Production):
const { habits, updateHabits } = useUserData(); // API-backed

// Migration strategy: Keep localStorage as fallback, sync when online
```

### From Demo Auth to Real Auth
```typescript
// Current: Demo mode with bypass
const isAuthenticated = true; // Always authenticated

// Future: Real authentication flow  
const { user, login, logout } = useSupabaseAuth();
```

---

## 📚 **Documentation References**

### Essential Files for Understanding
1. **PROJECT_CONTEXT.md** - Complete business logic and technical decisions
2. **DEVELOPMENT_TIMELINE.md** - Conversation-driven development history  
3. **KEY_CONVERSATIONS.md** - Actual dialogue that led to major decisions
4. **HEARTBEAT.md** - 96KB changelog of all completed features
5. **MEMORY.md** - High-level project context and learnings

### Key Code Files
1. **AppV2.tsx** - Main app router and layout
2. **utils/periodCalculations.ts** - Complex menstrual cycle mathematics
3. **hooks/usePaywall.ts** - Subscription and monetization logic  
4. **data/** folder - All content structure and patterns
5. **components/v2/** - Nordic design system implementation

---

*This guide captures 6+ months of development wisdom. Every pattern here was battle-tested through real user feedback and iterative conversations. Use it as your roadmap for understanding not just HOW the code works, but WHY every decision was made.*