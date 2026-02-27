import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import AppLayout from "./layouts/AppLayout";
import Welcome from "./pages/Welcome";

const Domov = lazy(() => import("./pages/Domov"));
const Programy = lazy(() => import("./pages/Programy"));
const ProgramDetail = lazy(() => import("./pages/ProgramDetail"));
const Workout = lazy(() => import("./pages/Workout"));
const Kniznica = lazy(() => import("./pages/Kniznica"));
const Recepty = lazy(() => import("./pages/Recepty"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const Meditacie = lazy(() => import("./pages/Meditacie"));
const JedalnicekPlanner = lazy(() => import("./pages/JedalnicekPlanner"));
const NavykyTracker = lazy(() => import("./pages/NavykyTracker"));
const Cyklus = lazy(() => import("./pages/Cyklus"));
const Komunita = lazy(() => import("./pages/Komunita"));
const Profil = lazy(() => import("./pages/Profil"));
const Telo = lazy(() => import("./pages/Telo"));
const Strava = lazy(() => import("./pages/Strava"));
const Mysel = lazy(() => import("./pages/Mysel"));
const MojaZona = lazy(() => import("./pages/MojaZona"));

// Legacy
import MenstrualCalendar from "./pages/MenstrualCalendar";
const Index = lazy(() => import("./pages/Index"));
const Checkout = lazy(() => import("./pages/Checkout"));
const SharedCalendar = lazy(() => import("./pages/SharedCalendar"));
const AdminCycleTips = lazy(() => import("./pages/AdminCycleTips"));
const CycleTipsDebug = lazy(() => import("./pages/CycleTipsDebug"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-neome-bg">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neome-primary" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route element={<AppLayout />}>
              <Route path="/domov" element={<Domov />} />
              <Route path="/moja-zona" element={<MojaZona />} />
              <Route path="/telo" element={<Telo />} />
              <Route path="/strava" element={<Strava />} />
              <Route path="/mysel" element={<Mysel />} />
              <Route path="/programy" element={<Programy />} />
              <Route path="/program/:id" element={<ProgramDetail />} />
              <Route path="/workout/:id" element={<Workout />} />
              <Route path="/kniznica" element={<Kniznica />} />
              <Route path="/recepty" element={<Recepty />} />
              <Route path="/recept/:id" element={<RecipeDetail />} />
              <Route path="/meditacie" element={<Meditacie />} />
              <Route path="/jedalnicek" element={<JedalnicekPlanner />} />
              <Route path="/navyky" element={<NavykyTracker />} />
              <Route path="/cyklus" element={<Cyklus />} />
              <Route path="/komunita" element={<Komunita />} />
              <Route path="/profil" element={<Profil />} />
            </Route>
            {/* Legacy */}
            <Route path="/legacy" element={<Index />} />
            <Route path="/menstrual-calendar" element={<MenstrualCalendar />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/shared/:shareCode" element={<SharedCalendar />} />
            <Route path="/admin/cycle-tips" element={<AdminCycleTips />} />
            <Route path="/debug/cycle-tips" element={<CycleTipsDebug />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
