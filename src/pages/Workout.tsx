import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Clock, Flame, Zap, Timer } from "lucide-react";

const exercises = [
  { name: "Zahrievanie — krúženie ramien", reps: "30s", sets: "" },
  { name: "Výpady s otočením trupu", reps: "12×", sets: "3 série" },
  { name: "Plank hold", reps: "45s", sets: "3 série" },
  { name: "Mostík (glute bridge)", reps: "15×", sets: "3 série" },
  { name: "Mountain climbers", reps: "20×", sets: "3 série" },
  { name: "Drepy s výskokom", reps: "10×", sets: "3 série" },
  { name: "Strechovanie — child's pose", reps: "60s", sets: "" },
];

export default function Workout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neome-bg">
      {/* Video placeholder */}
      <div className="relative mx-5 mt-14 rounded-3xl overflow-hidden shadow-neome-lg aspect-video bg-neome-primary/10">
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop"
          alt="Workout"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-neome-lg">
            <Play size={28} className="text-neome-primary ml-1" fill="currentColor" />
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-neome-primary" />
        </button>
      </div>

      <div className="px-5 mt-5 space-y-5">
        <div>
          <h1 className="text-mobile-xl font-lufga font-bold text-neome-primary">Dynamická joga flow</h1>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-mobile-sm text-neome-primary/50 font-lufga">
              <Clock size={14} /> 25 min
            </span>
            <span className="flex items-center gap-1 text-mobile-sm text-neome-primary/50 font-lufga">
              <Flame size={14} /> 180 kcal
            </span>
            <span className="flex items-center gap-1 text-mobile-sm text-neome-primary/50 font-lufga">
              <Zap size={14} /> Stredná
            </span>
          </div>
        </div>

        {/* Timer placeholder */}
        <div className="bg-gradient-to-br from-neome-peach/30 to-neome-lavender/20 rounded-2xl p-5 flex items-center justify-center gap-3 shadow-neome">
          <Timer size={24} className="text-neome-primary/50" />
          <span className="text-mobile-2xl font-lufga font-bold text-neome-primary tracking-wider">00:00</span>
        </div>

        {/* Exercises */}
        <div className="space-y-2">
          <h2 className="text-mobile-base font-lufga font-semibold text-neome-primary">Cviky</h2>
          {exercises.map((ex, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-neome"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-neome-peach/30 flex items-center justify-center text-mobile-xs font-lufga font-bold text-neome-primary">
                  {i + 1}
                </span>
                <span className="text-mobile-sm font-lufga font-medium text-neome-primary">{ex.name}</span>
              </div>
              <div className="text-right">
                <span className="text-mobile-sm font-lufga font-semibold text-neome-primary">{ex.reps}</span>
                {ex.sets && <p className="text-[10px] font-lufga text-neome-primary/40">{ex.sets}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
