import { useNavigate } from "react-router-dom";
import { Clock, Star, ArrowLeft, Play } from "lucide-react";
import { useState } from "react";

const filters = ["Všetky", "Telo", "Strava", "Myseľ"];

const programs = [
  {
    id: "1",
    title: "28-dňová výzva",
    duration: "4 týždne",
    difficulty: "Stredná",
    category: "Telo",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop",
  },
  {
    id: "2",
    title: "Joga pre začiatočníčky",
    duration: "3 týždne",
    difficulty: "Ľahká",
    category: "Telo",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=500&fit=crop",
  },
  {
    id: "3",
    title: "Zdravé stravovacie návyky",
    duration: "2 týždne",
    difficulty: "Ľahká",
    category: "Strava",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=500&fit=crop",
  },
  {
    id: "4",
    title: "Mindfulness program",
    duration: "3 týždne",
    difficulty: "Ľahká",
    category: "Myseľ",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=500&fit=crop",
  },
  {
    id: "5",
    title: "Silné jadro",
    duration: "4 týždne",
    difficulty: "Pokročilá",
    category: "Telo",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop",
  },
  {
    id: "6",
    title: "Detox & Reset",
    duration: "1 týždeň",
    difficulty: "Stredná",
    category: "Strava",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=500&fit=crop",
  },
];

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Ľahká: { bg: 'rgba(122, 158, 120, 0.14)', text: '#7A9E78' },
  Stredná: { bg: 'rgba(184, 134, 74, 0.14)', text: '#B8864A' },
  Pokročilá: { bg: 'rgba(194, 122, 110, 0.14)', text: '#C27A6E' },
};

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(107, 76, 59, 0.08), 0 6px 24px rgba(107, 76, 59, 0.04), 0 3px 12px rgba(107, 76, 59, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function Programy() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Všetky");
  const filtered = active === "Všetky" ? programs : programs.filter((p) => p.category === active);

  return (
    <div 
      className="w-full min-h-screen px-3 py-6 pb-28 space-y-6"
      style={{ 
        background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)', 
        minHeight: '100vh' 
      }}
    >
      {/* Nordic Header */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Play className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Programy</h1>
          </div>
        </div>
      </NordicCard>

      {/* Nordic Featured Program */}
      <NordicCard onClick={() => navigate("/program/1")} className="overflow-hidden">
        <div className="relative h-48">
          <img
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop"
            alt="Featured"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            {/* Top Badge */}
            <div className="flex justify-start">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-2xl">
                <span className="text-[11px] font-medium text-white">⭐ Odporúčané</span>
              </div>
            </div>
            
            {/* Bottom Content */}
            <div>
              <h3 className="text-[18px] font-semibold text-white mb-1">28-dňová výzva</h3>
              <p className="text-[12px] text-white/80">4 týždne • Stredná obtiažnosť</p>
            </div>
          </div>
        </div>
      </NordicCard>

      {/* Nordic Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-medium whitespace-nowrap transition-all ${
              active === filter 
                ? "text-white shadow-md" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            style={{ 
              backgroundColor: active === filter ? '#6B4C3B' : '',
              boxShadow: active === filter ? '0 4px 16px rgba(107, 76, 59, 0.2)' : ''
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Nordic Program Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((program) => (
          <NordicCard key={program.id} onClick={() => navigate(`/program/${program.id}`)} className="overflow-hidden">
            <div className="h-32">
              <img src={program.image} alt={program.title} className="w-full h-full object-cover rounded-t-3xl" />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="text-[13px] font-semibold leading-tight" style={{ color: '#2E2218' }}>
                {program.title}
              </h3>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" style={{ color: '#A89B8C' }} />
                <span className="text-[11px]" style={{ color: '#A89B8C' }}>{program.duration}</span>
              </div>
              <div className="inline-flex">
                <span 
                  className="px-2 py-1 rounded-xl text-[10px] font-medium"
                  style={{ 
                    backgroundColor: difficultyColors[program.difficulty]?.bg || 'rgba(107, 76, 59, 0.14)',
                    color: difficultyColors[program.difficulty]?.text || '#6B4C3B'
                  }}
                >
                  {program.difficulty}
                </span>
              </div>
            </div>
          </NordicCard>
        ))}
      </div>
    </div>
  );
}
