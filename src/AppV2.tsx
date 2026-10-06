import { lazy, Suspense, useEffect, useState } from 'react';
import { captureAffiliateRef } from './lib/affiliate';
import LoadingScreen from './components/v2/LoadingScreen';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseAuthProvider, useSupabaseAuth } from './contexts/SupabaseAuthContext';
import { supabase } from './lib/supabase';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ConsentGuardProvider } from './contexts/ConsentGuardContext';
import AppLayout from './layouts/v2/AppLayout';
import ErrorBoundary from './components/v2/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import CookieBanner from './components/v2/CookieBanner';
import InstallPrompt from './components/v2/InstallPrompt';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 min — content rarely changes
      gcTime: 30 * 60 * 1000,           // 30 min — keep cached entries reasonably long
      refetchOnWindowFocus: true,
      refetchOnMount: 'always',
      retry: 1,
    },
  },
});

const AuthReal = lazy(() => import('./pages/v2/AuthReal'));
const ResetPassword = lazy(() => import('./pages/v2/ResetPassword'));
const AuthDemo = lazy(() => import('./pages/v2/AuthDemo'));
const Welcome = lazy(() => import('./pages/v2/Welcome'));
const Onboarding = lazy(() => import('./pages/v2/Onboarding'));
const OnboardingWelcome = lazy(() => import('./pages/v2/OnboardingWelcome'));
const OnboardingPlan = lazy(() => import('./pages/v2/OnboardingPlan'));
const CheckoutLauncher = lazy(() => import('./pages/v2/CheckoutLauncher'));
const CheckoutPlus = lazy(() => import('./pages/v2/CheckoutPlus'));
const OnboardingCycle = lazy(() => import('./pages/v2/OnboardingCycle'));
const OnboardingPrograms = lazy(() => import('./pages/v2/OnboardingPrograms'));
const OnboardingNotifications = lazy(() => import('./pages/v2/OnboardingNotifications'));
const DomovNew = lazy(() => import('./pages/v2/DomovNew'));
const Kniznica = lazy(() => import('./pages/v2/Kniznica'));
const PostpartumLanding = lazy(() => import('./pages/v2/PostpartumLanding'));
const Paywall = lazy(() => import('./pages/v2/Paywall'));
const CompletionWorkout = lazy(() => import('./pages/v2/CompletionWorkout'));
const CompletionProgram = lazy(() => import('./pages/v2/CompletionProgram'));
const ReflectionEntry = lazy(() => import('./pages/v2/ReflectionEntry'));
const CyklusLog = lazy(() => import('./pages/v2/CyklusLog'));
const AffiliateDashboard = lazy(() => import('./pages/v2/AffiliateDashboard'));
const OdporucPage = lazy(() => import('./pages/v2/OdporucPage'));
const KomunitaPostDetail = lazy(() => import('./pages/v2/KomunitaPostDetail'));
const KomunitaCompose = lazy(() => import('./pages/v2/KomunitaCompose'));
const SpravyThread = lazy(() => import('./pages/v2/SpravyThread'));
const CancelArc = lazy(() => import('./pages/v2/CancelArc'));
const SettingsProfile = lazy(() => import('./pages/v2/SettingsProfile'));
const SettingsNotificationsV2 = lazy(() => import('./pages/v2/SettingsNotifications'));
const SettingsPrivacy = lazy(() => import('./pages/v2/SettingsPrivacy'));
const SettingsDelete = lazy(() => import('./pages/v2/SettingsDelete'));
const SettingsHub = lazy(() => import('./pages/v2/SettingsHub'));
const PointsSummary = lazy(() => import('./pages/v2/PointsSummary'));
const PointsRewards = lazy(() => import('./pages/v2/PointsRewards'));
const BlogArticle = lazy(() => import('./pages/v2/BlogArticle'));
const Telo = lazy(() => import('./pages/v2/Telo'));
const Strava = lazy(() => import('./pages/v2/Strava'));
const MyselNew = lazy(() => import('./pages/v2/MyselNew'));
const Periodka = lazy(() => import('./pages/v2/Periodka'));
const PeriodkaSettings = lazy(() => import('./components/v2/periodka/PeriodkaSettings'));
const PeriodkaTestingConsole = lazy(() => import('./components/v2/periodka/PeriodkaTestingConsole'));
const Komunita = lazy(() => import('./pages/v2/Komunita'));
const Spravy = lazy(() => import('./pages/v2/Spravy'));
const Profil = lazy(() => import('./pages/v2/Profil'));
const Recepty = lazy(() => import('./pages/v2/Recepty'));
const RecipeDetail = lazy(() => import('./pages/v2/RecipeDetail'));
const Meditacie = lazy(() => import('./pages/v2/Meditacie'));
const MeditationPlayer = lazy(() => import('./pages/v2/MeditationPlayer'));
const ExercisePlayer = lazy(() => import('./pages/v2/ExercisePlayer'));
const JedalnicekPlanner = lazy(() => import('./pages/v2/JedalnicekPlanner'));
const JedalnicekPromo = lazy(() => import('./pages/v2/JedalnicekPromo'));
const JedalnicekOnboarding = lazy(() => import('./pages/v2/JedalnicekOnboarding'));
const NavykyTracker = lazy(() => import('./pages/v2/NavykyTracker'));
const TeloPrograms = lazy(() => import('./pages/v2/TeloPrograms'));
const ProgramDetail = lazy(() => import('./pages/v2/ProgramDetail'));
const PostpartumInfo = lazy(() => import('./pages/v2/PostpartumInfo'));
const Admin = lazy(() => import('./pages/v2/Admin'));
const AdminLogin = lazy(() => import('./pages/v2/AdminLogin'));
const TeloExtra = lazy(() => import('./pages/v2/TeloExtra'));
const TeloStrecing = lazy(() => import('./pages/v2/TeloStrecing'));
const SymptomCalendar = lazy(() => import('./pages/v2/SymptomCalendar'));
const Oblubene = lazy(() => import('./pages/v2/Oblubene'));
const WorkoutHistory = lazy(() => import('./pages/v2/WorkoutHistory'));
const Blog = lazy(() => import('./pages/v2/Blog'));
const PrivacyPolicy = lazy(() => import('./pages/v2/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/v2/TermsOfUse'));
import { TosConsentGate } from './components/v2/TosConsentGate';
const SubscriptionManagement = lazy(() => import('./pages/v2/SubscriptionManagement'));
const CheckoutSuccess = lazy(() => import('./pages/v2/CheckoutSuccess'));
const CheckoutCanceled = lazy(() => import('./pages/v2/CheckoutCanceled'));
const PlusProgramPrompt = lazy(() => import('./pages/v2/onboardingPlus/ProgramPrompt'));
const PlusProgramSelect = lazy(() => import('./pages/v2/onboardingPlus/ProgramSelect'));
const PlusCycleInfo = lazy(() => import('./pages/v2/onboardingPlus/CycleInfo'));
const PlusNutritionPrompt = lazy(() => import('./pages/v2/onboardingPlus/NutritionPrompt'));
const PlusNutritionTimePrompt = lazy(() => import('./pages/v2/onboardingPlus/NutritionTimePrompt'));
const PlusNutritionMemo = lazy(() => import('./pages/v2/onboardingPlus/NutritionMemo'));
const PlusFinal = lazy(() => import('./pages/v2/onboardingPlus/Final'));
const Search = lazy(() => import('./pages/v2/Search'));
const CyklusInsights = lazy(() => import('./pages/v2/CyklusInsights'));
const Odznaky = lazy(() => import('./pages/v2/Odznaky'));


/* Auth guard — redirects to /auth if no Supabase session. */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabaseAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

/* Admin guard — RequireAuth + profiles.role check.
   Reads profiles.role directly (canonical source) so a fresh promotion
   takes effect on the next route navigation, not next login. Falls
   back to JWT app_metadata.role to allow non-DB role grants and to
   short-circuit the profile query when the JWT already has the claim.
   Unauthenticated visitors land on the minimal /admin/login. */
/**
 * SPA route changes keep the previous scroll offset, so a page opened from
 * mid-scroll rendered "somewhere in the middle". Reset to top on every
 * pathname change (browser back/forward keeps native restoration).
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabaseAuth();
  const { pathname, search } = useLocation();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { setChecking(false); return; }
    // Fast path: JWT app_metadata already says admin.
    const jwtRole = (user.app_metadata as Record<string, unknown> | null)?.role;
    if (jwtRole === 'admin' || jwtRole === 'support') {
      setAllowed(true);
      setChecking(false);
      return;
    }
    // Slow path: query profiles.role. Single source of truth.
    let cancelled = false;
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setAllowed(data?.role === 'admin' || data?.role === 'support');
        setChecking(false);
      });
    return () => { cancelled = true; };
  }, [user, loading]);

  if (loading || checking) return <LoadingScreen />;
  if (!user) {
    const next = encodeURIComponent(pathname + search);
    return <Navigate to={`/admin/login?next=${next}`} replace />;
  }
  if (!allowed) return <Navigate to="/domov-new" replace />;
  return <>{children}</>;
}

export default function AppV2() {
  // Affiliate links point anywhere in the app with ?ref=KOD — stash the
  // code before routing so it survives signup + email confirmation.
  captureAffiliateRef();

  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
    <SubscriptionProvider>
    <ConsentGuardProvider>
      <Toaster />
      <BrowserRouter>
        <ScrollToTop />
        <CookieBanner />
        <InstallPrompt />
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
            {/* Public routes */}
            <Route path="/auth-demo" element={<AuthDemo />} />
            <Route path="/auth-real" element={<AuthReal />} />
            {/* Landing page for the Supabase password-recovery email —
                must stay public (the user arrives signed-out). */}
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* /auth, /register, /login on the admin subdomain bounce to
                the minimal admin sign-in. On the main domain they render
                the regular consumer auth screen. */}
            <Route
              path="/auth"
              element={
                typeof window !== 'undefined' && window.location.hostname === 'admin.neome.com.au'
                  ? <Navigate to="/admin/login" replace />
                  : <AuthReal />
              }
            />
            <Route
              path="/register"
              element={
                typeof window !== 'undefined' && window.location.hostname === 'admin.neome.com.au'
                  ? <Navigate to="/admin/login" replace />
                  : <AuthReal />
              }
            />
            <Route
              path="/login"
              element={
                typeof window !== 'undefined' && window.location.hostname === 'admin.neome.com.au'
                  ? <Navigate to="/admin/login" replace />
                  : <AuthReal />
              }
            />
            {/* Minimal internal admin sign-in — used when RequireAdmin
                bounces an unauthenticated visitor (typically the
                admin.neome.com.au subdomain). */}
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* Root path — admin subdomain bounces straight to /admin,
                main domain renders the Welcome screen. Done client-side
                because Netlify's host-conditional redirect in
                netlify.toml didn't reliably fire on admin.neome.com.au. */}
            <Route
              path="/"
              element={
                typeof window !== 'undefined' && window.location.hostname === 'admin.neome.com.au'
                  ? <Navigate to="/admin" replace />
                  : <Welcome />
              }
            />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/onboarding" element={<OnboardingWelcome />} />
            <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
            <Route path="/onboarding/plan" element={<OnboardingPlan />} />
            <Route path="/onboarding/cycle" element={<OnboardingCycle />} />
            <Route path="/onboarding/programs" element={<OnboardingPrograms />} />
            <Route path="/onboarding/notifications" element={<OnboardingNotifications />} />
            <Route path="/onboarding/legacy" element={<Onboarding />} />
            {/* Public legal pages — must be reachable without auth so
                Google's OAuth verification crawler can fetch them. */}
            <Route path="/zasady-ochrany-osobnych-udajov" element={<PrivacyPolicy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/podmienky-pouzivania" element={<TermsOfUse />} />
            <Route path="/terms" element={<TermsOfUse />} />

            {/* Full-screen protected routes — no BottomNav */}
            {/* Guest-reachable: pay first, account after (Sam 2026-10-06).
                CheckoutPlus serves both guests (email field) and logged-in
                users; CheckoutSuccess claims the account post-payment. */}
            <Route path="/checkout/plus" element={<CheckoutPlus />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route element={<RequireAuth><TosConsentGate><Outlet /></TosConsentGate></RequireAuth>}>
              <Route path="/paywall" element={<Paywall />} />
              <Route path="/checkout" element={<CheckoutLauncher />} />
              <Route path="/checkout/canceled" element={<CheckoutCanceled />} />
            </Route>

            {/* Post-subscription onboarding — public so design QA can
                preview each screen without signing in. Real users enter
                via /checkout/success which validates the subscription
                server-side first. The actions inside (purchase meal
                plan, save cycle data) require auth and will fail
                gracefully for unauthenticated visitors — they can still
                see the UI. */}
            <Route path="/onboarding-plus/program" element={<PlusProgramPrompt />} />
            <Route path="/onboarding-plus/program-select" element={<PlusProgramSelect />} />
            <Route path="/onboarding-plus/cyklus" element={<PlusCycleInfo />} />
            <Route path="/onboarding-plus/jedalnicek" element={<PlusNutritionPrompt />} />
            <Route path="/onboarding-plus/jedalnicek-cas" element={<PlusNutritionTimePrompt />} />
            <Route path="/onboarding-plus/jedalnicek-memo" element={<PlusNutritionMemo />} />
            <Route path="/onboarding-plus/hotovo" element={<PlusFinal />} />

            {/* Protected routes */}
            <Route element={<RequireAuth><TosConsentGate><AppLayout /></TosConsentGate></RequireAuth>}>
              <Route path="/domov" element={<Navigate to="/domov-new" replace />} />
              <Route path="/domov-new" element={<DomovNew />} />
              <Route path="/new-home" element={<DomovNew />} />
              <Route path="/kniznica" element={<Kniznica />} />
              <Route path="/completion/workout" element={<CompletionWorkout />} />
              <Route path="/completion/program" element={<CompletionProgram />} />
              <Route path="/dennik/new" element={<ReflectionEntry />} />
              <Route path="/kniznica/periodka/log" element={<CyklusLog />} />
              <Route path="/komunita/new" element={<KomunitaCompose />} />
              <Route path="/komunita/:id" element={<KomunitaPostDetail />} />
              <Route path="/spravy/:threadId" element={<SpravyThread />} />
              <Route path="/settings" element={<SettingsHub />} />
              <Route path="/settings/profile" element={<SettingsProfile />} />
              <Route path="/settings/notifications" element={<SettingsNotificationsV2 />} />
              <Route path="/settings/privacy" element={<SettingsPrivacy />} />
              <Route path="/settings/delete" element={<SettingsDelete />} />
              <Route path="/settings/cancel" element={<CancelArc />} />
              <Route path="/body" element={<PointsSummary />} />
              <Route path="/body/odmeny" element={<PointsRewards />} />
              <Route path="/body/odznaky" element={<Odznaky />} />
              <Route path="/hladat" element={<Search />} />
              <Route path="/kniznica/periodka/insights" element={<CyklusInsights />} />
              <Route path="/blog/:id" element={<BlogArticle />} />
              <Route path="/kniznica/telo" element={<Telo />} />
              <Route path="/kniznica/telo/programy" element={<TeloPrograms />} />
              <Route path="/kniznica/telo/extra" element={<TeloExtra />} />
              <Route path="/kniznica/telo/strecing" element={<TeloStrecing />} />
              <Route path="/kniznica/strava" element={<Strava />} />
              <Route path="/kniznica/mysel" element={<MyselNew />} />
              <Route path="/kniznica/blog" element={<Blog />} />
              <Route path="/kniznica/periodka" element={<Periodka />} />
              <Route path="/kniznica/periodka/nastavenia" element={<PeriodkaSettings />} />
              {/* Dev/QA harness — never ships to production users. */}
              {import.meta.env.DEV && (
                <Route path="/kniznica/periodka/testing" element={<PeriodkaTestingConsole />} />
              )}
              <Route path="/kniznica/dennik" element={<ReflectionEntry />} />
              <Route path="/kniznica/navyky" element={<NavykyTracker />} />
              <Route path="/kniznica/symptomy" element={<SymptomCalendar />} />
              <Route path="/program/:programId/info" element={<PostpartumInfo />} />
              {/* Per-program purchase removed — single NeoMe Plus
                  subscription replaces it. Any stale link gracefully
                  funnels to the paywall. */}
              <Route path="/program/:id/buy" element={<Navigate to="/paywall" replace />} />
              <Route path="/program/:programId" element={<ProgramDetail />} />
              <Route path="/komunita" element={<Komunita />} />
              <Route path="/spravy" element={<Spravy />} />
              <Route path="/oblubene" element={<Oblubene />} />
              <Route path="/workout-history" element={<WorkoutHistory />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/profil/predplatne" element={<SubscriptionManagement />} />
              <Route path="/partner" element={<AffiliateDashboard />} />
              <Route path="/odporuc" element={<OdporucPage />} />
              <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
              <Route path="/admin-new" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/recepty" element={<Recepty />} />
              <Route path="/recept/:id" element={<RecipeDetail />} />
              <Route path="/meditacie" element={<Meditacie />} />
              <Route path="/meditacia/:meditationId" element={<MeditationPlayer />} />
              <Route path="/exercise-player" element={<ExercisePlayer />} />
              <Route path="/stretch/:id" element={<ExercisePlayer />} />
              <Route path="/exercise/extra/:id" element={<ExercisePlayer />} />
              <Route path="/exercise/today" element={<ExercisePlayer />} />
              <Route path="/jedalnicek" element={<JedalnicekPlanner />} />
              <Route path="/jedalnicek-promo" element={<JedalnicekPromo />} />
              <Route path="/navyky" element={<NavykyTracker />} />
              <Route path="/postpartum" element={<PostpartumLanding />} />
            </Route>

            {/* Meal-plan onboarding questionnaire — public for design QA.
                Same rationale as /onboarding-plus/*: the form renders
                without auth so it can be previewed. Saving the result
                (saveProfile + generatePlan) requires auth and will fail
                gracefully if not signed in. */}
            <Route path="/jedalnicek/onboarding" element={<JedalnicekOnboarding />} />
            
            {/* Catch-all route for unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
      </BrowserRouter>
    </ConsentGuardProvider>
    </SubscriptionProvider>
    </SupabaseAuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}
