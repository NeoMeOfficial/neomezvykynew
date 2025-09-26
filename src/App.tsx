import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
import MenstrualCalendar from "./pages/MenstrualCalendar"; // Remove lazy loading for core component
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized loading component
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center space-y-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-400 mx-auto" />
      <div className="text-sm text-gray-500">Loading...</div>
    </div>
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
            <Route path="/" element={<Index />} />
            <Route path="/menstrual-calendar" element={<MenstrualCalendar />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
