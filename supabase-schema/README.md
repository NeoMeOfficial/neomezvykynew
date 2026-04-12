# NeoMe Supabase Database Schema

Complete database schema for the NeoMe wellness app with freemium subscription model.

## Schema Overview

### Core Tables
- **profiles** - User profiles (extends auth.users)
- **subscriptions** - User subscription tiers and Stripe integration
- **meal_planner_tokens** - Standalone meal planner token purchases
- **habits** - User habit tracking
- **habit_completions** - Daily habit completion records
- **user_preferences** - User onboarding data, goals, allergens, cycle data
- **content_usage** - Track content access for free tier limits

### Subscription Tiers
- **free** - 10 items each (recipes, exercises, meditations, stretches), no data persistence
- **neome_plus** - €14.90/month, unlimited content + data saving + programs
- **program_bundle** - €49.90 one-time, everything + meal planner

## Setup Instructions

### 1. Apply Schema (Supabase Dashboard)
Go to your Supabase project → **SQL Editor** → **New query**, then run each file in order:

1. `01_profiles.sql` - User profiles and auth triggers
2. `02_subscriptions.sql` - Subscription system
3. `03_habits.sql` - Habits and user data
4. `04_functions.sql` - Helper functions
5. `05_indexes.sql` - Performance indexes

### 2. Enable RLS (Row Level Security)
All tables have RLS enabled. Users can only access their own data.

### 3. Test Functions
After setup, test with:

```sql
-- Get subscription limits for a user
SELECT * FROM get_user_subscription_limits('your-user-uuid');

-- Check content access
SELECT * FROM check_content_access('your-user-uuid', 'recipes');

-- Track content usage
SELECT track_content_usage('your-user-uuid', 'recipes', 'recipe-1');
```

### 4. Stripe Integration
When integrating Stripe:
- Store `stripe_customer_id` in subscriptions table
- Store `stripe_subscription_id` for recurring subscriptions
- Store `stripe_payment_intent_id` for one-time purchases (meal tokens)

## Next Steps
1. Apply schema to Supabase
2. Update React app to use Supabase instead of localStorage
3. Integrate real subscription checking
4. Connect Stripe for payments

## GDPR Compliance
- **Article 9 data**: Cycle/period data in `user_preferences.cycle_data`
- **Encryption**: Store sensitive health data encrypted
- **Data residency**: Ensure Supabase project is in EU region
- **DPIA**: Required for health data processing