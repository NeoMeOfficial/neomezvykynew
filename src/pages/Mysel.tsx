import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Play } from 'lucide-react';

const cards = [
  { 
    title: "Meditácia", 
    desc: "Pokoj mysle", 
    icon: "🧘‍♀️",
    path: "/meditacie"
  },
  { 
    title: "Dýchanie", 
    desc: "Dychové cvičenia", 
    icon: "🫁",
    path: "/dychanie"
  },
  { 
    title: "Denník", 
    desc: "Reflexia & vďačnosť", 
    icon: "📝",
    path: "/navyky?category=dennik"
  },
  { 
    title: "Spánok", 
    desc: "Lepší odpočinok", 
    icon: "🌙",
    path: "/spanok"
  },
];

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(168, 132, 139, 0.08), 0 6px 24px rgba(168, 132, 139, 0.04), 0 3px 12px rgba(168, 132, 139, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function Mysel() {
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
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(168, 132, 139, 0.14)` }}>
              <Brain className="w-4 h-4" style={{ color: '#A8848B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Myseľ</h1>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[13px]" style={{ color: '#A89B8C' }}>
            Starostlivosť o duševnú pohodu
          </p>
        </div>
      </NordicCard>

      {/* Nordic Wellness Categories Grid */}
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

      {/* Quick Meditation Access */}
      <NordicCard className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-medium mb-1" style={{ color: '#2E2218' }}>
              Rýchla meditácia
            </h3>
            <p className="text-[11px]" style={{ color: '#A89B8C' }}>
              5 minút pre pokoj mysle
            </p>
          </div>
          <button 
            onClick={() => navigate('/meditation-quick')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(168, 132, 139, 0.14)' }}
          >
            <Play className="w-4 h-4" style={{ color: '#A8848B' }} />
          </button>
        </div>
      </NordicCard>
    </div>
  );
}
