import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)', 
        minHeight: '100vh' 
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-10%] right-[-15%] w-72 h-72 rounded-full bg-neome-peach/30 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-15%] w-96 h-96 rounded-full bg-neome-lavender/20 blur-3xl" />
      <div className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full bg-neome-sage/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        {/* Simple NEOME Logo */}
        <div className="space-y-3">
          <h1 className="text-5xl font-lufga font-bold tracking-tight" style={{ color: '#6B4C3B' }}>
            NEOME
          </h1>
          <p className="text-mobile-lg font-lufga font-light max-w-xs leading-relaxed" style={{ color: '#8B7560' }}>
            Tvoja cesta k lepšiemu ja
          </p>
        </div>

        <div className="flex items-center gap-2 text-mobile-sm" style={{ color: '#A0907E' }}>
          <Sparkles size={14} />
          <span className="font-lufga">Wellness • Výživa • Myseľ</span>
          <Sparkles size={14} />
        </div>

        <button
          onClick={() => navigate("/moja-zona")}
          className="mt-8 px-12 py-4 text-white rounded-2xl font-lufga font-semibold text-mobile-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: '#6B4C3B', boxShadow: '0 8px 32px rgba(107, 76, 59, 0.25)' }}
        >
          Začať
        </button>

        <p className="text-mobile-xs font-lufga mt-4" style={{ color: '#A0907E' }}>
          Verzia 2.0 • Vytvorené s láskou 🤎
        </p>
      </div>
    </div>
  );
}
