import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-neome-bg via-neome-peach/30 to-neome-lavender/20">
      {/* Decorative circles */}
      <div className="absolute top-[-10%] right-[-15%] w-72 h-72 rounded-full bg-neome-peach/30 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-15%] w-96 h-96 rounded-full bg-neome-lavender/20 blur-3xl" />
      <div className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full bg-neome-sage/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        {/* Logo */}
        <div className="w-24 h-24 rounded-3xl bg-neome-primary flex items-center justify-center shadow-neome-lg">
          <span className="text-white text-3xl font-lufga font-bold">N</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-mobile-3xl font-lufga font-bold text-neome-primary tracking-tight">
            NeoMe
          </h1>
          <p className="text-mobile-lg text-neome-primary/60 font-lufga font-light max-w-xs leading-relaxed">
            Tvoja cesta k lepšiemu ja
          </p>
        </div>

        <div className="flex items-center gap-2 text-neome-primary/40 text-mobile-sm">
          <Sparkles size={14} />
          <span className="font-lufga">Wellness • Výživa • Myseľ</span>
          <Sparkles size={14} />
        </div>

        <button
          onClick={() => navigate("/moja-zona")}
          className="mt-8 px-12 py-4 bg-neome-primary text-white rounded-2xl font-lufga font-semibold text-mobile-base shadow-neome-lg hover:shadow-neome transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Začať
        </button>

        <p className="text-mobile-xs text-neome-primary/30 font-lufga mt-4">
          Verzia 2.0 • Vytvorené s láskou 🤎
        </p>
      </div>
    </div>
  );
}
