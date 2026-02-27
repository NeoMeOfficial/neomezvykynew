import { useNavigate } from 'react-router-dom';
import { Book, ArrowRight } from 'lucide-react';

const sections = [
  { 
    label: 'Telo', 
    color: '#6B4C3B', 
    icon: '💪',
    desc: 'Cvičenie a pohyb',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop', 
    path: '/telo' 
  },
  { 
    label: 'Strava', 
    color: '#7A9E78', 
    icon: '🥗',
    desc: 'Recepty a jedálniček',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop', 
    path: '/strava' 
  },
  { 
    label: 'Myseľ', 
    color: '#A8848B', 
    icon: '🧘‍♀️',
    desc: 'Meditácia a wellness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop', 
    path: '/mysel' 
  },
  { 
    label: 'Periodka', 
    color: '#C27A6E', 
    icon: '🌸',
    desc: 'Sledovanie cyklu',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop', 
    path: '/cyklus' 
  },
  { 
    label: 'Osobný denník', 
    color: '#A8848B', 
    icon: '📝',
    desc: 'Reflexia a myšlienky',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop', 
    path: '/v2/dennik-history' 
  },
  { 
    label: 'Návyky', 
    color: '#B8864A', 
    icon: '🎯',
    desc: 'Denné rutiny',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop', 
    path: '/v2/navyky-history' 
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

export default function Kniznica() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Book className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Knižnica</h1>
        </div>
        <p className="text-[13px] mt-2 ml-11" style={{ color: '#A89B8C' }}>
          Všetko na jednom mieste
        </p>
      </NordicCard>

      {/* Nordic Section Cards */}
      <div className="space-y-3">
        {sections.map((section) => (
          <NordicCard key={section.label} onClick={() => navigate(section.path)} className="overflow-hidden">
            <div className="relative h-40">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={section.image} 
                  alt={section.label} 
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
                        {section.label}
                      </h3>
                    </div>
                    <p className="text-[12px] text-white/80">
                      {section.desc}
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
    </div>
  );
}
