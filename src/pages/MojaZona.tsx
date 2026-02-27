import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const sections = [
  {
    to: "/telo",
    title: "Telo",
    subtitle: "Pohyb & fitness",
    icon: "💪",
    color: "#6B4C3B",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
  },
  {
    to: "/strava",
    title: "Strava",
    subtitle: "Výživa & recepty",
    icon: "🥗",
    color: "#7A9E78",
    img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80",
  },
  {
    to: "/mysel",
    title: "Myseľ",
    subtitle: "Duševná pohoda",
    icon: "🧘‍♀️",
    color: "#A8848B",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  },
  {
    to: "/cyklus",
    title: "Cyklus",
    subtitle: "Sledovanie cyklu",
    icon: "🌸",
    color: "#C27A6E",
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
  },
];

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] cursor-pointer ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(107, 76, 59, 0.08), 0 6px 24px rgba(107, 76, 59, 0.04), 0 3px 12px rgba(107, 76, 59, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function MojaZona() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Welcome Header */}
      <NordicCard className="p-6 text-center">
        <h1 className="text-[20px] font-semibold mb-2" style={{ color: '#2E2218' }}>
          Ahoj, krásna! 👋
        </h1>
        <p className="text-[13px]" style={{ color: '#A89B8C' }}>
          Čo dnes urobíme pre seba?
        </p>
      </NordicCard>

      {/* Nordic Section Cards */}
      <div className="space-y-3">
        {sections.map((section) => (
          <NordicCard key={section.to} onClick={() => navigate(section.to)} className="overflow-hidden">
            <div className="relative h-40">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={section.img} 
                  alt={section.title} 
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.8)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                {/* Top Icon */}
                <div className="flex justify-start">
                  <div className="text-2xl bg-white/20 backdrop-blur-md rounded-2xl w-12 h-12 flex items-center justify-center">
                    {section.icon}
                  </div>
                </div>
                
                {/* Bottom Content */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: section.color }} />
                      <h3 className="text-[18px] font-semibold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-[12px] text-white/80">
                      {section.subtitle}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </NordicCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <NordicCard onClick={() => navigate('/kniznica')} className="p-4">
          <div className="text-center">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="text-[12px] font-medium" style={{ color: '#2E2218' }}>
              Knižnica
            </h3>
            <p className="text-[10px]" style={{ color: '#A89B8C' }}>
              Všetok obsah
            </p>
          </div>
        </NordicCard>

        <NordicCard onClick={() => navigate('/profil')} className="p-4">
          <div className="text-center">
            <div className="text-2xl mb-2">👤</div>
            <h3 className="text-[12px] font-medium" style={{ color: '#2E2218' }}>
              Profil
            </h3>
            <p className="text-[10px]" style={{ color: '#A89B8C' }}>
              Nastavenia
            </p>
          </div>
        </NordicCard>
      </div>
    </div>
  );
}
