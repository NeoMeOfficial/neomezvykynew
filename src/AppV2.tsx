import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SimpleSubscriptionContext';
import AppLayout from './layouts/v2/AppLayout';

const Auth = lazy(() => import('./pages/v2/Auth'));
const Welcome = lazy(() => import('./pages/v2/Welcome'));
const Onboarding = lazy(() => import('./pages/v2/Onboarding'));
const Domov = lazy(() => import('./pages/v2/Domov'));
const Kniznica = lazy(() => import('./pages/v2/Kniznica'));
const Telo = lazy(() => import('./pages/v2/Telo'));
const Strava = lazy(() => import('./pages/v2/Strava'));
const Mysel = lazy(() => import('./pages/v2/Mysel'));
const Periodka = lazy(() => import('./pages/v2/Periodka'));
const ProgramSales = lazy(() => import('./pages/v2/ProgramSales'));
const ProgramDashboard = lazy(() => import('./pages/v2/ProgramDashboard'));
const Komunita = lazy(() => import('./pages/v2/Komunita'));
const Spravy = lazy(() => import('./pages/v2/Spravy'));
const Profil = lazy(() => import('./pages/v2/Profil'));
const Recepty = lazy(() => import('./pages/v2/Recepty'));
const RecipeDetail = lazy(() => import('./pages/v2/RecipeDetail'));
const Meditacie = lazy(() => import('./pages/v2/Meditacie'));
// Temporarily comment out new components to test basic loading
// const MeditationPlayer = lazy(() => import('./pages/v2/MeditationPlayer'));
// const ExercisePlayer = lazy(() => import('./pages/v2/ExercisePlayer'));
const JedalnicekPlanner = lazy(() => import('./pages/v2/JedalnicekPlanner'));
const NavykyTracker = lazy(() => import('./pages/v2/NavykyTracker'));
const TeloPrograms = lazy(() => import('./pages/v2/TeloPrograms'));
const ProgramDetail = lazy(() => import('./pages/v2/ProgramDetail'));
const PostpartumInfo = lazy(() => import('./pages/v2/PostpartumInfo'));
const MealPlanBannerShowcase = lazy(() => import('./pages/v2/MealPlanBannerShowcase'));
const ReferralLanding = lazy(() => import('./pages/v2/ReferralLanding'));
const ReferralCenter = lazy(() => import('./components/v2/referral/ReferralCenter'));
// const AdminDashboard = lazy(() => import('./pages/v2/AdminDashboard'));
// const SubscriptionSales = lazy(() => import('./pages/v2/SubscriptionSales'));
const TeloExtra = lazy(() => import('./pages/v2/TeloExtra'));
const TeloStrecing = lazy(() => import('./pages/v2/TeloStrecing'));
const DennikHistory = lazy(() => import('./pages/v2/DennikHistory'));
const NavykyHistory = lazy(() => import('./pages/v2/NavykyHistory'));
const SymptomCalendar = lazy(() => import('./pages/v2/SymptomCalendar'));
const Oblubene = lazy(() => import('./pages/v2/Oblubene'));
const WorkoutHistory = lazy(() => import('./pages/v2/WorkoutHistory'));
const WorkoutDemo = lazy(() => import('./pages/v2/WorkoutDemo'));
const BuddySystem = lazy(() => import('./pages/v2/BuddySystem'));
const DesignShowcase = lazy(() => import('./pages/v2/DesignShowcase'));
const DesignShowcase2 = lazy(() => import('./pages/v2/DesignShowcase2'));
const DesignShowcase3 = lazy(() => import('./pages/v2/DesignShowcase3'));
const HomepageDesign1 = lazy(() => import('./pages/v2/HomepageDesign1'));
const HomepageDesign2 = lazy(() => import('./pages/v2/HomepageDesign2'));
const HomepageDesign3 = lazy(() => import('./pages/v2/HomepageDesign3'));
const HomepageDesign4 = lazy(() => import('./pages/v2/HomepageDesign4'));
const CalmDesign1 = lazy(() => import('./pages/v2/CalmDesign1'));
const CalmDesign2 = lazy(() => import('./pages/v2/CalmDesign2'));
const CalmDesign3 = lazy(() => import('./pages/v2/CalmDesign3'));
const CalmDesign4 = lazy(() => import('./pages/v2/CalmDesign4'));
const DomovNew = lazy(() => import('./pages/v2/DomovNew'));

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

/* Route guard — redirects to /auth if not logged in */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  
  // Add timeout to prevent infinite loading
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout reached - proceeding without auth');
        setTimeoutReached(true);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  if (loading && !timeoutReached) return <LoadingSpinner />;
  if (!user && !timeoutReached) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
}

export default function AppV2() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/design" element={<DesignShowcase />} />
            <Route path="/design2" element={<DesignShowcase2 />} />
            <Route path="/design3" element={<DesignShowcase3 />} />
            <Route path="/homepage1" element={<HomepageDesign1 />} />
            <Route path="/homepage2" element={<HomepageDesign2 />} />
            <Route path="/homepage3" element={<HomepageDesign3 />} />
            <Route path="/homepage4" element={<HomepageDesign4 />} />
            <Route path="/calm1" element={<CalmDesign1 />} />
            <Route path="/calm2" element={<CalmDesign2 />} />
            <Route path="/calm3" element={<CalmDesign3 />} />
            <Route path="/calm4" element={<CalmDesign4 />} />
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/showcase/meal-plan-banners" element={<MealPlanBannerShowcase />} />
            <Route path="/ref/:code" element={<ReferralLanding />} />
            {/* <Route path="/subscribe" element={<SubscriptionSales />} /> */}

            {/* Protected routes */}
            <Route element={<RequireAuth><SubscriptionProvider><AppLayout /></SubscriptionProvider></RequireAuth>}>
              <Route path="/domov" element={<Domov />} />
              <Route path="/domov-new" element={<DomovNew />} />
              <Route path="/new-home" element={<DomovNew />} />
              <Route path="/kniznica" element={<Kniznica />} />
              <Route path="/kniznica/telo" element={<Telo />} />
              <Route path="/kniznica/telo/programy" element={<TeloPrograms />} />
              <Route path="/kniznica/telo/extra" element={<TeloExtra />} />
              <Route path="/kniznica/telo/strecing" element={<TeloStrecing />} />
              <Route path="/kniznica/strava" element={<Strava />} />
              <Route path="/kniznica/mysel" element={<Mysel />} />
              <Route path="/kniznica/periodka" element={<Periodka />} />
              <Route path="/kniznica/dennik" element={<DennikHistory />} />
              <Route path="/kniznica/navyky" element={<NavykyHistory />} />
              <Route path="/kniznica/symptomy" element={<SymptomCalendar />} />
              <Route path="/program/postpartum" element={<PostpartumInfo />} />
              <Route path="/program/:id/buy" element={<ProgramSales />} />
              <Route path="/program/:id" element={<ProgramDetail />} />
              <Route path="/komunita" element={<Komunita />} />
              <Route path="/spravy" element={<Spravy />} />
              <Route path="/oblubene" element={<Oblubene />} />
              <Route path="/workout-history" element={<WorkoutHistory />} />
              <Route path="/workout-demo" element={<WorkoutDemo />} />
              <Route path="/buddy-system" element={<BuddySystem />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/referral" element={<ReferralCenter />} />
              {/* <Route path="/admin" element={<AdminDashboard />} /> */}
              <Route path="/recepty" element={<Recepty />} />
              <Route path="/recept/:id" element={<RecipeDetail />} />
              <Route path="/meditacie" element={<Meditacie />} />
              {/* <Route path="/meditation-player" element={<MeditationPlayer />} />
              <Route path="/exercise-player" element={<ExercisePlayer />} /> */}
              <Route path="/jedalnicek" element={<JedalnicekPlanner />} />
              <Route path="/navyky" element={<NavykyTracker />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
