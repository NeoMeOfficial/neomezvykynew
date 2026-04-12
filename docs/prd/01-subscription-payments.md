# PRD: Subscription & Payments System

## Problem Statement

NeoMe currently has no real subscription enforcement. The subscription context is hardcoded to `tier: 'premium'` for every user, all paywall checks return `true`, and the meal planner purchase flow shows a browser `alert()`. There is no differentiation between free and paid users in the app today.

Before Stripe can go live, the app needs a coherent three-tier access model that works with dummy data now and can be swapped to real Stripe + Supabase with minimal code changes.

---

## Solution

Implement a three-tier subscription system:

1. **Free** — permanent baseline, limited content, no data persistence
2. **Subscriber** — full app access, unlimited content, data saved, monthly or annual billing via Stripe
3. **Subscriber + Meal Planner** — everything in Subscriber, plus one generated meal plan per €79 purchase

Build this with a ports & adapters architecture so the payment backend (localStorage today, Stripe + Supabase later) is swappable without changing any component code.

---

## Pricing (Confirmed)

| Plan | Price |
|------|-------|
| Monthly subscription | €24.90/month |
| Annual subscription | €199/year (~33% saving, effectively 4 months free) |
| Meal planner (one plan) | €79 one-off (requires active subscription) |
| Meal planner with discount code | €49 |

---

## User Stories

### Free User
- As a free user, I can browse up to **10 recipes** without subscribing
- As a free user, I can access **1 full workout program** out of 4
- As a free user, I can access **5 meditations** out of 17
- As a free user, I can use the period tracker but my data is not saved between sessions
- As a free user, I can read the general community forum but cannot access sub-forums
- As a free user, I cannot send a direct message to Gabi — I can only contact her by email
- As a free user, I see clear CTAs explaining what I unlock by subscribing
- As a free user, when I hit a content limit I see a paywall prompt — not a broken or empty screen

### Subscriber
- As a subscriber, I can access all recipes, workouts, and meditations without limits
- As a subscriber, all my data is saved (period tracking, habits, mood, workouts)
- As a subscriber, I can access all community forums
- As a subscriber, I can send direct messages to Gabi
- As a subscriber, I can choose monthly (€24.90) or annual (€199) billing at checkout
- As a subscriber, I can cancel my subscription at any time
- As a subscriber who has cancelled, I retain access until the end of my current billing period, then revert to free
- As a subscriber, I can see my subscription status and next billing date in my profile
- As a former subscriber whose data is stored, my data is retained for **6 months** after cancellation, then permanently deleted
- As a former subscriber returning within 6 months, my data is restored when I resubscribe

### Subscriber purchasing the Meal Planner
- As a subscriber, I can purchase a personalised 6-week meal plan for €79
- As a subscriber, I cannot purchase the meal planner without an active subscription
- As a subscriber, each €79 purchase generates one plan — a new plan requires a new purchase
- As a subscriber who cancels their subscription, I lose access to my meal planner immediately
- As a subscriber, I can apply a discount code to reduce the meal planner price to €49
- As a subscriber, after purchasing I am taken directly to the meal plan onboarding questionnaire

---

## Implementation Decisions

### Architecture: Ports & Adapters

The subscription system must use a ports & adapters pattern. The `SubscriptionPort` interface is the contract all components depend on. Adapters implement it. The provider picks one adapter — swapping from localStorage to Stripe is a one-line change in the provider.

```
SubscriptionPort (interface)
  ├── LocalStorageAdapter  ← active today (dummy payments)
  ├── StripeAdapter        ← active in production (real payments)
  └── SupabaseAdapter      ← reads entitlements post-payment
```

### The Port Interface

```typescript
type SubscriptionTier = 'free' | 'subscriber' | 'subscriber_meal_planner';

interface PurchaseResult {
  success: boolean;
  error?: string;
}

interface SubscriptionPort {
  tier: SubscriptionTier;
  loading: boolean;
  canUseMealPlanner: boolean;
  subscribe: (billingPeriod: 'monthly' | 'annual') => Promise<PurchaseResult>;
  purchaseMealPlanner: (discountCode?: string) => Promise<PurchaseResult>;
  cancelSubscription: () => Promise<void>;
  refresh: () => Promise<void>;
}
```

### Content Limits (Free Tier)

| Content | Total | Free limit |
|---------|-------|------------|
| Recipes | 178 | 10 |
| Workout programs | 4 | 1 |
| Meditations | 17 | 5 |
| Community forums | All | General forum only |
| Period tracker | Full | Full access, no data save |
| Data saving | — | Disabled |

### Data Retention on Cancellation

- Subscriber data is retained for **6 months** after cancellation
- At 6 months, all personal data is permanently deleted
- If user resubscribes within 6 months, data is restored
- Free users have no saved data (nothing to retain)

### Meal Planner Gating

The meal planner (`/jedalnicek`) must check two conditions in sequence:
1. Is the user an active subscriber? → if not, show subscription paywall
2. Have they purchased a meal planner token? → if not, show meal planner purchase CTA (€79)

### Billing Periods

Monthly (€24.90) and annual (€199) at launch. Quarterly can be added in a future iteration.

### Discount Codes

Handled client-side for the dummy flow. In production, Stripe promotion codes handle this natively — validation must be server-side, never client-side.

---

## Files to Create or Modify

### New
- `src/features/subscription/port.ts` — the SubscriptionPort interface and types
- `src/features/subscription/adapters/localStorageAdapter.ts`
- `src/features/subscription/adapters/stripeAdapter.ts`
- `src/features/subscription/adapters/supabaseAdapter.ts`
- `src/features/subscription/SubscriptionProvider.tsx`
- `src/hooks/useMealAccess.ts` — facade for meal planner gating + modal choreography
- `src/components/v2/paywall/DummyCheckoutModal.tsx`

### Modify
- `src/AppV2.tsx` — swap `SimpleSubscriptionProvider` for new `SubscriptionProvider`
- `src/hooks/usePaywall.ts` — strip access-check logic, keep only modal UI state
- `src/pages/v2/JedalnicekPlanner.tsx` — use `useMealAccess`
- `src/pages/v2/Strava.tsx` — use `useMealAccess`
- `src/components/v2/paywall/PaywallModal.tsx` — update pricing to reflect 3-tier model
- `src/components/v2/paywall/MealPlannerBanner.tsx` — update price to €79

### Delete
- `src/contexts/SubscriptionContext.tsx` — conflicting Stripe-coupled context
- `src/contexts/SimpleSubscriptionContext.tsx` — replaced by new SubscriptionProvider

---

## Testing Strategy

### New tests to write (once vitest is set up)
- `localStorageAdapter`: tier starts as `free` → `subscriber` after subscribe() → `subscriber_meal_planner` after purchaseMealPlanner() → resets on cancelSubscription()
- `useMealAccess`: modal sequencing (paywall → checkout → success), isPurchasing state
- Content limit enforcement: free users see correct limited counts
- Data retention: verify 6-month retention logic

### Not in scope for this PRD
- End-to-end Stripe checkout (requires Stripe test mode keys)
- Supabase webhook testing

---

## Out of Scope

- Quarterly billing (future iteration)
- Family or team plans
- Referral-based free access
- Admin subscription management UI (separate PRD)

---

## Resolved Decisions

- **Discount code**: NEOME30 is a real code — must be created in Stripe when payments go live
- **GDPR**: Users must be explicitly informed at cancellation that their data will be deleted after 6 months. A confirmation email must be sent. This is a legal requirement for the Slovak/EU market.
- **Annual renewal**: Auto-renews annually. Users can cancel at any time before the renewal date.
