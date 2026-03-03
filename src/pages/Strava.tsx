import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, ArrowRight } from 'lucide-react';

const cards = [
  {
    title: "Raňajky",
    desc: "Energetický štart do dňa",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
    icon: "🌅",
    path: "/recepty?category=ranajky"
  },
  {
    title: "Hlavné jedlá a polievky",
    desc: "Sýte a chutné pokrmy",
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
    icon: "🍲",
    path: "/recepty?category=hlavne"
  },
  {
    title: "Dobrotky",
    desc: "Zdravé sladkosti a dezerty",
    img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    icon: "🍰",
    path: "/recepty?category=dobrotky"
  },
];

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(122, 158, 120, 0.08), 0 6px 24px rgba(122, 158, 120, 0.04), 0 3px 12px rgba(122, 158, 120, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function Strava() {
  const navigate = useNavigate();

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
          <button onClick={() => navigate('/moja-zona')} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <ChefHat className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Strava</h1>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[13px]" style={{ color: '#A89B8C' }}>
            Jedlá, ktoré ti robia dobre
          </p>
        </div>
      </NordicCard>

      {/* Recipe Categories */}
      <div className="space-y-3">
        {cards.map((card, index) => (
          <NordicCard key={card.title} onClick={() => navigate(card.path)} className="overflow-hidden">
            <div className="relative h-48">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={card.img} 
                  alt={card.title} 
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.9)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                {/* Top Icon */}
                <div className="flex justify-start">
                  <div className="text-2xl bg-white/20 backdrop-blur-md rounded-2xl w-12 h-12 flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
                
                {/* Bottom Content */}
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-[16px] font-semibold text-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-[12px] text-white/80">
                      {card.desc}
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

      {/* Quick Planner Access */}
      <NordicCard className="p-5" onClick={() => navigate('/jedalnicek')}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-medium mb-1" style={{ color: '#2E2218' }}>
              Plánovač jedálničku
            </h3>
            <p className="text-[11px]" style={{ color: '#A89B8C' }}>
              Napláuj si celý týždeň
            </p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(122, 158, 120, 0.14)' }}>
            <ChefHat className="w-4 h-4" style={{ color: '#7A9E78' }} />
          </div>
        </div>
      </NordicCard>
    </div>
  );
}
