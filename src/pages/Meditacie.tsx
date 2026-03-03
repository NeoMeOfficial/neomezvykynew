import { useState } from "react";
import { Play, Clock, Moon, Brain, Sun, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { label: "Všetky", icon: null },
  { label: "Spánok", icon: Moon },
  { label: "Stres", icon: Zap },
  { label: "Fokus", icon: Brain },
  { label: "Ráno", icon: Sun },
];

const sessions = [
  { title: "Pokojné zaspávanie", duration: "20 min", cat: "Spánok", color: "#A8848B" },
  { title: "Uvoľnenie stresu", duration: "15 min", cat: "Stres", color: "#C27A6E" },
  { title: "Hlboké sústredenie", duration: "10 min", cat: "Fokus", color: "#7A9E78" },
  { title: "Ranné prebudenie", duration: "10 min", cat: "Ráno", color: "#B8864A" },
  { title: "Body scan relaxácia", duration: "25 min", cat: "Stres", color: "#A8848B" },
  { title: "Vďačnosť pred spaním", duration: "15 min", cat: "Spánok", color: "#A8848B" },
  { title: "Dychové cvičenie 4-7-8", duration: "8 min", cat: "Fokus", color: "#7A9E78" },
  { title: "Pozitívne afirmácie", duration: "12 min", cat: "Ráno", color: "#B8864A" },
];

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:scale-[1.01]' : ''} ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(168, 132, 139, 0.08), 0 6px 24px rgba(168, 132, 139, 0.04), 0 3px 12px rgba(168, 132, 139, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function Meditacie() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Všetky");
  const filtered = active === "Všetky" ? sessions : sessions.filter((s) => s.cat === active);

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
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(168, 132, 139, 0.14)` }}>
              <Brain className="w-4 h-4" style={{ color: '#A8848B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Meditácie</h1>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[13px]" style={{ color: '#A89B8C' }}>
            Nájdi svoj vnútorný pokoj
          </p>
        </div>
      </NordicCard>

      {/* Nordic Daily Meditation */}
      <NordicCard className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-2xl mb-3" style={{ backgroundColor: 'rgba(168, 132, 139, 0.14)' }}>
              <span className="text-[11px] font-medium" style={{ color: '#A8848B' }}>✨ Denná meditácia</span>
            </div>
            <h3 className="text-[15px] font-semibold mb-2" style={{ color: '#2E2218' }}>Pokojná myseľ</h3>
            <p className="text-[12px] mb-3" style={{ color: '#A89B8C' }}>
              Upokojte svoju myseľ s dnešnou vedenou meditáciou
            </p>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: '#A89B8C' }} />
              <span className="text-[11px]" style={{ color: '#A89B8C' }}>15 min</span>
            </div>
          </div>
          <button 
            className="w-12 h-12 rounded-full flex items-center justify-center ml-4"
            style={{ backgroundColor: '#A8848B' }}
          >
            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
          </button>
        </div>
      </NordicCard>

      {/* Nordic Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
        {categories.map((category) => (
          <button
            key={category.label}
            onClick={() => setActive(category.label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[12px] font-medium whitespace-nowrap transition-all ${
              active === category.label 
                ? "text-white shadow-md" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            style={{ 
              backgroundColor: active === category.label ? '#A8848B' : '',
              boxShadow: active === category.label ? '0 4px 16px rgba(168, 132, 139, 0.2)' : ''
            }}
          >
            {category.icon && <category.icon size={12} />}
            {category.label}
          </button>
        ))}
      </div>

      {/* Nordic Sessions */}
      <div className="space-y-3">
        {filtered.map((session, i) => (
          <NordicCard key={i} onClick={() => {}} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold mb-1" style={{ color: '#2E2218' }}>
                  {session.title}
                </h3>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" style={{ color: '#A89B8C' }} />
                  <span className="text-[11px]" style={{ color: '#A89B8C' }}>{session.duration}</span>
                </div>
              </div>
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center ml-4"
                style={{ backgroundColor: `${session.color}14` }}
              >
                <Play className="w-4 h-4 ml-0.5" style={{ color: session.color }} fill="currentColor" />
              </button>
            </div>
          </NordicCard>
        ))}
      </div>
    </div>
  );
}
