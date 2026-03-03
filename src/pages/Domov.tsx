import { useNavigate } from "react-router-dom";
import { Sun, Moon, Smile, Heart, Droplets, Apple, Brain, ChevronRight, Flame, Home } from "lucide-react";
import { useState } from "react";

const moods = [
  { icon: Sun, label: "Skvelá", color: { bg: 'rgba(251, 191, 36, 0.14)', text: '#F59E0B' } },
  { icon: Smile, label: "Dobre", color: { bg: 'rgba(122, 158, 120, 0.14)', text: '#7A9E78' } },
  { icon: Heart, label: "Neutrálne", color: { bg: 'rgba(168, 132, 139, 0.14)', text: '#A8848B' } },
  { icon: Moon, label: "Unavená", color: { bg: 'rgba(139, 139, 157, 0.14)', text: '#8B8B9D' } },
];

const quickAccess = [
  { label: "Cyklus", icon: Droplets, to: "/cyklus", color: "#C27A6E" },
  { label: "Návyky", icon: Flame, to: "/navyky", color: "#B8864A" },
  { label: "Jedálniček", icon: Apple, to: "/jedalnicek", color: "#7A9E78" },
];

const recommendations = [
  {
    title: "Ranná joga flow",
    subtitle: "20 min • Energia",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    to: "/workout/1",
    pill: "Cvičenie",
  },
  {
    title: "Smoothie bowl s ovocím",
    subtitle: "10 min • Raňajky",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    to: "/recepty",
    pill: "Recept",
  },
  {
    title: "Pokojná myseľ",
    subtitle: "15 min • Meditácia",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    to: "/meditacie",
    pill: "Meditácia",
  },
];

// Nordic Card Component
function NordicCard({ children, className = "", priority = "standard" }) {
  const shadows = {
    priority: "0 16px 64px rgba(107, 76, 59, 0.12), 0 8px 32px rgba(107, 76, 59, 0.08), 0 4px 16px rgba(107, 76, 59, 0.04)",
    standard: "0 12px 48px rgba(107, 76, 59, 0.08), 0 6px 24px rgba(107, 76, 59, 0.04), 0 3px 12px rgba(107, 76, 59, 0.02)",
    subtle: "0 8px 32px rgba(107, 76, 59, 0.06), 0 4px 16px rgba(107, 76, 59, 0.03), 0 2px 8px rgba(107, 76, 59, 0.01)"
  };

  return (
    <div 
      className={`bg-white rounded-3xl transition-all duration-300 ${className}`}
      style={{ 
        boxShadow: shadows[priority],
        backdropFilter: 'blur(20px)',
        border: 'none'
      }}
    >
      {children}
    </div>
  );
}

export default function Domov() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const today = new Date().toLocaleDateString("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Home className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <div>
            <p className="text-[11px] capitalize" style={{ color: '#A89B8C' }}>{today}</p>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>
              Ahoj, krásna 👋
            </h1>
          </div>
        </div>
      </NordicCard>

      {/* Nordic Mood Check-in */}
      <NordicCard className="p-5" priority="priority">
        <p className="text-[14px] font-medium mb-4" style={{ color: '#2E2218' }}>
          Ako sa dnes cítiš?
        </p>
        <div className="flex gap-2">
          {moods.map((mood, i) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedMood(i)}
                className={`flex flex-col items-center gap-2 flex-1 py-3 rounded-2xl transition-all duration-200 ${
                  isSelected ? 'scale-105 shadow-md' : 'hover:scale-102'
                }`}
                style={{
                  backgroundColor: isSelected ? mood.color.bg : 'rgba(107, 76, 59, 0.04)',
                  color: isSelected ? mood.color.text : '#A89B8C'
                }}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </NordicCard>

      {/* Nordic Quick Access */}
      <div className="grid grid-cols-3 gap-3">
        {quickAccess.map((item) => {
          const Icon = item.icon;
          return (
            <NordicCard
              key={item.label}
              className="p-4 cursor-pointer hover:-translate-y-1 hover:scale-[1.02]"
              onClick={() => navigate(item.to)}
            >
              <div className="text-center">
                <div className="w-10 h-10 rounded-2xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${item.color}14` }}>
                  <Icon size={16} style={{ color: item.color }} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: '#2E2218' }}>
                  {item.label}
                </span>
              </div>
            </NordicCard>
          );
        })}
      </div>

      {/* Nordic Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-[15px] font-semibold" style={{ color: '#2E2218' }}>
            Dnes pre teba
          </h2>
          <button className="text-[12px] flex items-center gap-1" style={{ color: '#A89B8C' }}>
            Všetko <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          {recommendations.map((rec, i) => (
            <NordicCard
              key={i}
              className="flex-shrink-0 w-40 overflow-hidden cursor-pointer hover:-translate-y-1 hover:scale-[1.02]"
              onClick={() => navigate(rec.to)}
            >
              <div className="relative h-24 overflow-hidden">
                <img src={rec.image} alt={rec.title} className="w-full h-full object-cover rounded-t-3xl" />
                <div className="absolute top-2 left-2">
                  <span 
                    className="px-2 py-1 rounded-xl text-[9px] font-medium text-white"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                  >
                    {rec.pill}
                  </span>
                </div>
              </div>
              <div className="p-3 text-left">
                <p className="text-[12px] font-medium leading-tight mb-1" style={{ color: '#2E2218' }}>
                  {rec.title}
                </p>
                <p className="text-[10px]" style={{ color: '#A89B8C' }}>
                  {rec.subtitle}
                </p>
              </div>
            </NordicCard>
          ))}
        </div>
      </div>

      {/* Nordic Inspirational Quote */}
      <NordicCard className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(168, 132, 139, 0.14)' }}>
            <Brain size={14} style={{ color: '#A8848B' }} />
          </div>
          <div>
            <p className="text-[13px] leading-relaxed italic mb-2" style={{ color: '#2E2218' }}>
              „Najlepšia investícia, akú môžeš urobiť, je investícia do seba samej."
            </p>
            <p className="text-[10px]" style={{ color: '#A89B8C' }}>— Warren Buffett</p>
          </div>
        </div>
      </NordicCard>
    </div>
  );
}
