import { useNavigate } from 'react-router-dom';
import { PaywallCompare } from './Paywall';

/**
 * /onboarding/plan — first screen of the new-user onboarding.
 *
 * Reuses the round-11 "Compare plans" screen from Paywall.tsx but with
 * onboarding-specific handlers: the choice is captured in localStorage
 * BEFORE signup, and after the user creates an account they're routed
 * to either Stripe checkout (Plus) or /domov-new (Free).
 *
 * Public route — no auth required. Welcome's "Začať cestu" button
 * lands here.
 */

const POST_SIGNUP_ROUTE_KEY = 'post_signup_route';
const INTENDED_PLAN_KEY = 'intended_plan';

export default function OnboardingPlan() {
  const navigate = useNavigate();

  const goToSignup = (intendedPlan: 'free' | 'plus') => {
    // Both values live in localStorage so AuthReal can read them after
    // the async email-confirmation round-trip.
    localStorage.setItem(INTENDED_PLAN_KEY, intendedPlan);
    localStorage.setItem(
      POST_SIGNUP_ROUTE_KEY,
      intendedPlan === 'plus' ? '/checkout' : '/domov-new',
    );
    navigate('/auth?mode=register');
  };

  return (
    <PaywallCompare
      onContinueFree={() => goToSignup('free')}
      onActivate={() => goToSignup('plus')}
      onClose={() => navigate('/')}
    />
  );
}
