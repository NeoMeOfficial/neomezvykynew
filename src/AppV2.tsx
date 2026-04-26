import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import AppLayout from './layouts/v2/AppLayout';
import ErrorBoundary from './components/v2/ErrorBoundary';

const AuthReal = lazy(() => import('./pages/v2/AuthReal'));
const AuthDemo = lazy(() => import('./pages/v2/AuthDemo'));
const Welcome = lazy(() => import('./pages/v2/Welcome'));
const Onboarding = lazy(() => import('./pages/v2/Onboarding'));
const DomovNew = lazy(() => import('./pages/v2/DomovNew'));
const Kniznica = lazy(() => import('./pages/v2/Kniznica'));
const KniznicaPreview = lazy(() => import('./pages/v2/KniznicaPreview'));
const Paywall = lazy(() => import('./pages/v2/Paywall'));
const Telo = lazy(() => import('./pages/v2/Telo'));
const Strava = lazy(() => import('./pages/v2/Strava'));
const MyselNew = lazy(() => import('./pages/v2/MyselNew'));
const Periodka = lazy(() => import('./pages/v2/Periodka'));
const PeriodkaSettings = lazy(() => import('./components/v2/periodka/PeriodkaSettings'));
const PeriodkaTestingConsole = lazy(() => import('./components/v2/periodka/PeriodkaTestingConsole'));
const ProgramSales = lazy(() => import('./pages/v2/ProgramSales'));
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
const NavykyTracker = lazy(() => import('./pages/v2/NavykyTracker'));
const TeloPrograms = lazy(() => import('./pages/v2/TeloPrograms'));
const ProgramDetail = lazy(() => import('./pages/v2/ProgramDetail'));
const PostpartumInfo = lazy(() => import('./pages/v2/PostpartumInfo'));
const ReferralLanding = lazy(() => import('./pages/v2/ReferralLanding'));
const ReferralCenter = lazy(() => import('./components/v2/referral/ReferralCenter'));
const ReferralPage = lazy(() => import('./pages/v2/ReferralPage'));
const AdminDashboard = lazy(() => import('./pages/v2/AdminDashboard'));
const AdminNew = lazy(() => import('./pages/v2/AdminNew'));
const AdminReferrals = lazy(() => import('./pages/v2/AdminReferrals'));
const TeloExtra = lazy(() => import('./pages/v2/TeloExtra'));
const TeloStrecing = lazy(() => import('./pages/v2/TeloStrecing'));
const DennikHistory = lazy(() => import('./pages/v2/DennikHistory'));
const NavykyHistory = lazy(() => import('./pages/v2/NavykyHistory'));
const SymptomCalendar = lazy(() => import('./pages/v2/SymptomCalendar'));
const Oblubene = lazy(() => import('./pages/v2/Oblubene'));
const WorkoutHistory = lazy(() => import('./pages/v2/WorkoutHistory'));
const WorkoutDemo = lazy(() => import('./pages/v2/WorkoutDemo'));
const BuddySystem = lazy(() => import('./pages/v2/BuddySystem'));
const Blog = lazy(() => import('./pages/v2/Blog'));
const SubscriptionManagement = lazy(() => import('./pages/v2/SubscriptionManagement'));

function LoadingSpinner() {
  const [loadingText, setLoadingText] = useState('Načítavam...');
  
  useEffect(() => {
    const messages = [
      'Načítavam...',
      'Pripájam sa k serveru...',
      'Takmer hotovo...',
      'Ešte chvíľu...'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoadingText(messages[index]);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#F0E6DA' }}>
      <div className="flex gap-1.5 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#B8864A', animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-[#8B7560] animate-pulse">{loadingText}</p>
    </div>
  );
}

/* Auth guard — enforces login when Supabase is configured, open in demo mode */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const supabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  if (!supabaseConfigured) {
    return <>{children}</>;
  }
  const hasSession = !!localStorage.getItem('sb-' + new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0] + '-auth-token');
  if (!hasSession) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

export default function AppV2() {
  return (
    <ErrorBoundary>
    <SupabaseAuthProvider>
    <SubscriptionProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            {/* Public routes */}
            <Route path="/auth-demo" element={<AuthDemo />} />
            <Route path="/auth-real" element={<AuthReal />} />
            <Route path="/auth" element={<AuthReal />} />
            <Route path="/register" element={<AuthReal />} />
            <Route path="/login" element={<AuthReal />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/ref/:code" element={<ReferralLanding />} />
            <Route path="/admin-new" element={<RequireAuth><AdminNew /></RequireAuth>} />

            {/* Protected routes */}
            <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route path="/domov" element={<Navigate to="/domov-new" replace />} />
              <Route path="/domov-new" element={<DomovNew />} />
              <Route path="/new-home" element={<DomovNew />} />
              <Route path="/kniznica" element={<Kniznica />} />
              <Route path="/kniznica/preview" element={<KniznicaPreview />} />
              <Route path="/paywall" element={<Paywall />} />
              <Route path="/kniznica/telo" element={<Telo />} />
              <Route path="/kniznica/telo/programy" element={<TeloPrograms />} />
              <Route path="/kniznica/telo/extra" element={<TeloExtra />} />
              <Route path="/kniznica/telo/strecing" element={<TeloStrecing />} />
              <Route path="/kniznica/strava" element={<Strava />} />
              <Route path="/kniznica/mysel" element={<MyselNew />} />
              <Route path="/kniznica/blog" element={<Blog />} />
              <Route path="/kniznica/periodka" element={<Periodka />} />
              <Route path="/kniznica/periodka/nastavenia" element={<PeriodkaSettings />} />
              <Route path="/kniznica/periodka/testing" element={<PeriodkaTestingConsole />} />
              <Route path="/kniznica/dennik" element={<DennikHistory />} />
              <Route path="/kniznica/navyky" element={<NavykyHistory />} />
              <Route path="/kniznica/symptomy" element={<SymptomCalendar />} />
              <Route path="/program/:programId/info" element={<PostpartumInfo />} />
              <Route path="/program/:id/buy" element={<ProgramSales />} />
              <Route path="/program/:programId" element={<ProgramDetail />} />
              <Route path="/komunita" element={<Komunita />} />
              <Route path="/spravy" element={<Spravy />} />
              <Route path="/oblubene" element={<Oblubene />} />
              <Route path="/workout-history" element={<WorkoutHistory />} />
              <Route path="/workout-demo" element={<WorkoutDemo />} />
              <Route path="/buddy-system" element={<BuddySystem />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/profil/predplatne" element={<SubscriptionManagement />} />
              <Route path="/referral" element={<ReferralPage />} />
              <Route path="/referral-center" element={<ReferralCenter />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/referrals" element={<AdminReferrals />} />
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
            </Route>
            
            {/* Catch-all route for unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
      </BrowserRouter>
    </SubscriptionProvider>
    </SupabaseAuthProvider>
    </ErrorBoundary>
  );
}
