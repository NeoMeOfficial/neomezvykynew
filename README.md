# NeoMe Wellness App

Slovak women's fitness & wellness platform built with React + TypeScript + Tailwind.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📱 Live Demo
- **Production:** https://neome-wellness-app.netlify.app
- **Admin Panel:** https://neome-wellness-app.netlify.app/admin

## 🏗️ Architecture

**Entry Point:** `src/main.tsx` → `AppV2.tsx` (NOT App.tsx)

**Core Sections:**
- **Telo** - 4-tier exercise programs (Postpartum → BodyForming → ElasticBands → Strong&Sexy)
- **Strava** - 23 curated recipes with zero-error guarantee  
- **Myseľ** - 17 targeted meditations for women/mothers
- **Periodka** - Smart menstrual cycle tracking with phase-aware recommendations

## 🎨 Design System

**Colors (Warm Dusk Theme):**
```typescript
telo: '#6B4C3B'      // Brown - Exercise
strava: '#7A9E78'    // Green - Nutrition  
mysel: '#A8848B'     // Mauve - Meditation
periodka: '#C27A6E'  // Coral - Period tracking
accent: '#B8864A'    // Gold - Accents
```

**UI Patterns:**
- Glassmorphism: `bg-white/40 backdrop-blur-lg`
- Mobile-first responsive design
- Nordic minimalism - "less is more"

## 💡 Key Features (Phase 3 Complete)

✅ **Smart Period Tracking** - 6 core symptoms, cycle visualization, phase-aware content
✅ **Progressive Exercise Programs** - 4 levels with equipment scaling  
✅ **Zero-Error Recipe Database** - 23 professional recipes (Spoonacular API)
✅ **Targeted Meditations** - 17 mother-focused 5-minute sessions
✅ **Gamified Engagement** - Streaks, badges, buddy system, favorites
✅ **Flexible Paywall** - Content limits with subscription upsells

## 🔧 Technical Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Glassmorphism
- **State:** React Context + localStorage (no Redux)
- **Deployment:** Netlify auto-deploy
- **Auth:** Demo mode (production auth TBD)

## 📁 Key Files

- **`AppV2.tsx`** - Main app router and layout
- **`utils/periodCalculations.ts`** - Menstrual cycle algorithms  
- **`data/`** - All content (recipes, exercises, meditations)
- **`hooks/usePaywall.ts`** - Monetization logic
- **`components/v2/`** - Nordic design system components

## 🎯 Business Model

- **Free Tier:** Limited content access
- **Subscription:** €14.90/month (pending approval)
- **Referral System:** €14 credits per successful referral
- **Target Users:** Slovak mothers & working women

## 📚 Full Context

For complete business logic, design decisions, and 6 months of development insights, see **`PROJECT_CONTEXT.md`** in parent directory.

---

**Status:** Production ready, awaiting backend integration