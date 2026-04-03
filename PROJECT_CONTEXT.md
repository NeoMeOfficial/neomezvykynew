# NeoMe Project Context & Documentation

## 🎯 Project Overview
Slovak women's fitness/wellness platform targeting mothers and working women. Built with React + TypeScript + Tailwind, designed for mobile-first experience with warm, calming aesthetic.

## 👥 Stakeholders
- **Founder:** Gabi (gabi@neome.com.au) - ~300 existing clients
- **Target Users:** Slovak mothers, working women seeking wellness balance
- **Developer:** Sam + Murph (AI assistant)

## 🎨 Design Philosophy

### Color System (Warm Dusk Theme)
```typescript
const colors = {
  telo: '#6B4C3B',      // Brown - Body/Exercise
  strava: '#7A9E78',    // Green - Nutrition  
  mysel: '#A8848B',     // Mauve - Mind/Meditation
  periodka: '#C27A6E',  // Coral - Period tracking
  accent: '#B8864A'     // Gold - Accents
};
```

### UI Principles
- **Glassmorphism:** `rgba(255,255,255,0.28)` + `blur(40px)`
- **Mobile-first:** All designs start mobile, scale up
- **Minimal text:** "Less is more" - remove fluff, focus on action
- **Warm tones:** NO purple/cyan/pink gradients (Sam's strong preference)
- **Font:** Lufga family throughout

## 🏗️ Architecture

### Core App Structure
```
src/
├── components/v2/        # Main app components (Nordic design)
├── pages/v2/            # Page components  
├── data/                # Static data (recipes, exercises, meditations)
├── utils/               # Helper functions, calculations
├── hooks/               # Custom React hooks
└── main.tsx → AppV2.tsx # Entry point (NOT App.tsx)
```

### Key Routes
- `/` - Welcome screen → `/domov-new` (Nordic home)
- `/kniznica/telo/*` - Exercise section
- `/kniznica/strava/*` - Nutrition section  
- `/kniznica/mysel/*` - Meditation section
- `/kniznica/periodka/*` - Period tracking
- `/admin` - Content management

## 💡 Core Features & Business Logic

### 1. Period Tracking (Periodka)
**Complex menstrual cycle calculations with simple UI**

#### Cycle Calculation Logic
```typescript
// Core algorithm in utils/periodCalculations.ts
function calculatePhases(cycleLength: number, periodLength: number) {
  // Menstrual: Days 1-periodLength
  // Follicular: Day after period ends until ovulation
  // Ovulation: ~Day 14 (adjusted for cycle length)  
  // Luteal: Post-ovulation until next cycle
}
```

#### Key Components:
- **DailyOverview.tsx** - Beautiful cycle visualization + phase descriptions
- **SimplePeriodkaTracker.tsx** - 6 core symptoms (1-5 scale)
- **PeriodkaSettings.tsx** - Cycle settings + overview

#### Design Decisions:
- **Simplified tracking:** Only 6 symptoms vs complex medical forms
- **Phase-aware content:** Exercise/nutrition recommendations based on cycle phase  
- **Visual feedback:** Cycle circle shows current position
- **localStorage:** All data local (no backend required for MVP)

### 2. Exercise Programs (Telo)
**4-tier progressive fitness system**

#### Program Structure:
1. **Postpartum (L1)** - 8 weeks, core/diastáza focus
2. **BodyForming (L2)** - 6 weeks, body shaping entry level  
3. **ElasticBands (L3)** - 6 weeks, resistance bands intermediate
4. **Strong&Sexy (L4)** - 6 weeks, advanced with dumbbells

#### Key Components:
- **TeloPrograms.tsx** - Program selection with auto-navigation
- **PostpartumInfo.tsx** - Unified program detail template
- **TeloExtra.tsx / TeloStrecing.tsx** - Additional exercises/stretches

#### Business Logic:
- **Level progression:** Users naturally graduate L1→L2→L3→L4
- **Equipment scaling:** Mat only → Bands → Dumbbells  
- **Duration strategy:** 8 weeks for L1 (recovery), 6 weeks for others
- **Purchase integration:** All equipment links to SharpShape affiliate

### 3. Recipe Database (Strava)  
**Curated nutrition with zero-error guarantee**

#### Data Strategy:
- **Quality over quantity:** 23 perfect Spoonacular API recipes
- **Zero OCR errors:** Removed all 116 Slovak recipes to prevent trust issues
- **Expansion plan:** Add 20-30 professional recipes weekly
- **Categories:** Raňajky (8), Hlavné jedlá (10), Snacky (5)

#### Key Components:
- **Recepty.tsx** - Recipe grid with category filtering
- **RecipeDetail.tsx** - Full recipe view with nutrition data
- **PDF integration:** Toggle between app view and original PDF

### 4. Meditation System (Myseľ)
**17 targeted meditations for women/mothers**

#### Content Focus:
- **Mother-specific:** Parenting patience, finding peace in chaos
- **Work-life balance:** Stress management, saying no without guilt  
- **Self-care:** Inner confidence, emotional balance
- **Duration:** All 5 minutes (busy mom constraint)

#### Design Decisions:
- **Nature imagery:** Pure nature scenes (no people) for meditation atmosphere
- **Simplified cards:** Title + play button only (removed overwhelming descriptions)
- **No paywall:** All meditations free (removed subscription barriers)

## 🔧 Technical Implementation

### State Management
- **localStorage:** Period data, user preferences, favorites
- **Context APIs:** Subscription status, favorites, paywall
- **No Redux:** Keeping complexity minimal for MVP

### Key Utilities

#### Period Calculations (`utils/periodCalculations.ts`)
```typescript
export function getPhaseByDay(day: number, cycleLength: number, periodLength: number) {
  const ranges = getPhaseRanges(cycleLength, periodLength);
  return ranges.find(range => day >= range.start && day <= range.end)?.phase || 'menstrual';
}
```

#### Paywall System (`hooks/usePaywall.ts`)
```typescript
// Flexible paywall for different content types
export function usePaywall(type: 'recipes' | 'exercises' | 'habits') {
  const showContentPaywall = (itemIndex: number) => {
    const freeLimit = limits[type];
    return itemIndex >= freeLimit && !isSubscribed;
  };
}
```

### Component Patterns

#### Glassmorphism Card Template:
```jsx
<div className="bg-white/40 backdrop-blur-lg rounded-xl border border-white/20 p-4">
  {content}
</div>
```

#### Filter System:
```jsx
const [activeFilter, setActiveFilter] = useState('Všetko');
const filteredItems = items.filter(item => 
  activeFilter === 'Všetko' || item.category === activeFilter
);
```

## 🚀 Deployment & Environment

### Live URLs:
- **Production:** https://neome-wellness-app.netlify.app
- **Admin Panel:** https://neome-wellness-app.netlify.app/admin
- **Local Mobile:** http://192.168.1.146:8000/ (Python server)

### Build Process:
```bash
cd projects/neome/neomezvykynew
npm run build
npm run deploy  # Netlify auto-deployment
```

### Environment Notes:
- **Vite + React:** Fast development, optimized builds
- **File watching limit:** 316 files (optimized to prevent crashes)
- **Mobile testing:** Python HTTP server more stable than Node.js

## 📊 Business Model

### Monetization Strategy:
- **Free tier:** Limited content access
- **Subscription:** €14.90/month (suggested, awaiting Gabi approval)
- **Referral system:** €14 credits per successful referral
- **Partner discounts:** Community engagement rewards

### User Engagement:
- **Gamification:** Achievement badges, community points
- **Buddy system:** Unique codes for motivation partners
- **Streak tracking:** Daily habits, workout consistency
- **Social features:** Community posts, likes, comments

## 🎯 Launch Readiness

### Phase 3 Complete (All 6 Features):
✅ Water Intake Tracking (250ml glasses)
✅ Mood & Energy Tracking (1-5 scale with emojis)  
✅ Universal Favorites System
✅ Achievement Badges & Community Engagement
✅ Workout History & Stats
✅ Buddy System with Unique Codes

### Ready for Production:
- ✅ Zero build errors
- ✅ Mobile responsive design
- ✅ Error boundaries implemented
- ✅ Authentication bypass (demo mode)
- ✅ All features tested and functional

## 🔮 Future Roadmap

### Immediate (Post-Launch):
- Backend API integration (replace localStorage)
- Real authentication system
- Payment processing (Stripe)
- Push notifications

### Medium-term:
- Recipe database expansion (target: 100+ recipes)  
- Video content integration (YouTube/Vimeo)
- Advanced analytics dashboard
- Multi-language support (Czech, English)

### Long-term:
- Mobile app (React Native)
- Wearable device integration
- AI-powered recommendations
- International expansion

## 🧠 Key Learnings & Decisions

### What Worked:
- **Nordic design system:** Consistent, calming, professional
- **Mobile-first approach:** Better user experience on primary device
- **Quality over quantity:** 23 perfect recipes > 116 error-prone ones
- **Simplified UX:** Users prefer fewer options done well

### What We Avoided:
- **Complex auth flows:** Simplified to demo mode for MVP
- **Over-engineering:** No Redux, no complex state management
- **Feature creep:** Focused on core wellness pillars (Body/Nutrition/Mind/Period)

### Critical Success Factors:
1. **Trust through quality:** Zero errors more important than quantity
2. **Mobile experience:** 90%+ users on mobile devices
3. **Emotional design:** Warm colors create safe, welcoming space
4. **Clear value prop:** Busy moms need simple, effective tools

## 🔧 Developer Handoff

### Getting Started:
```bash
git clone git@github.com:NeoMeOfficial/neomezvykynew.git
cd neomezvykynew
npm install
npm run dev
```

### Key Files to Understand:
1. **AppV2.tsx** - Main app router and layout
2. **utils/periodCalculations.ts** - Core menstrual cycle logic
3. **data/** - All content (recipes, exercises, meditations)
4. **hooks/usePaywall.ts** - Monetization logic
5. **components/v2/** - All UI components

### Code Conventions:
- **TypeScript:** Strict typing for all components
- **Tailwind classes:** Prefer utility classes over custom CSS
- **Component naming:** Descriptive, prefixed by section (e.g., `TeloPrograms`)
- **File structure:** Group by feature, not by type

---

This documentation contains 6+ months of accumulated knowledge, design decisions, and business logic. Use it to understand not just WHAT the code does, but WHY it was built this way.