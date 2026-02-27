import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Play } from 'lucide-react';

const cards = [
  { 
    title: "Jóga", 
    desc: "Flexibilita & pokoj", 
    icon: "🧘‍♀️",
    path: "/programy/joga"
  },
  { 
    title: "Kardio", 
    desc: "Energia & výdrž", 
    icon: "💪",
    path: "/programy/kardio"
  },
  { 
    title: "Sila", 
    desc: "Pevnosť & tvar", 
    icon: "🏋️‍♀️",
    path: "/programy/sila"
  },
  { 
    title: "Strečing", 
    desc: "Uvoľnenie & regenerácia", 
    icon: "🤸‍♀️",
    path: "/programy/strecing"
  },
];

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(107, 76, 59, 0.08), 0 6px 24px rgba(107, 76, 59, 0.04), 0 3px 12px rgba(107, 76, 59, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function Telo() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/moja-zona')} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Dumbbell className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Telo</h1>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[13px]" style={{ color: '#A89B8C' }}>
            Pohyb, ktorý ti vyhovuje
          </p>
        </div>
      </NordicCard>

      {/* Nordic Exercise Categories Grid */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, index) => (
          <NordicCard key={card.title} onClick={() => navigate(card.path)}>
            <div className="flex flex-col items-start space-y-3 h-32">
              <div className="text-2xl">{card.icon}</div>
              <div className="flex-1 flex flex-col justify-end">
                <h3 className="text-[14px] font-medium mb-1" style={{ color: '#2E2218' }}>
                  {card.title}
                </h3>
                <p className="text-[11px] leading-relaxed" style={{ color: '#A89B8C' }}>
                  {card.desc}
                </p>
              </div>
            </div>
          </NordicCard>
        ))}
      </div>

      {/* Quick Access */}
      <NordicCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-medium mb-1" style={{ color: '#2E2218' }}>
              Rýchly štart
            </h3>
            <p className="text-[11px]" style={{ color: '#A89B8C' }}>
              Začni cvičiť hneď teraz
            </p>
          </div>
          <button 
            onClick={() => navigate('/workout-demo')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(107, 76, 59, 0.14)' }}
          >
            <Play className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </button>
        </div>
      </NordicCard>
    </div>
  );
}
