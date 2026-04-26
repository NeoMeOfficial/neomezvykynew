import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

const categories = [
  { label: 'Programy', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop', path: '/kniznica/telo/programy' },
  { label: 'Extra cvičenia', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop', path: '/kniznica/telo/extra' },
  { label: 'Extra strečingy', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop', path: '/kniznica/telo/strecing' },
];

export default function Telo() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Nordic Header */}
      <div className="p-4" style={glassCard}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/kniznica')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Dumbbell className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[22px] font-medium leading-tight" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Telo</h1>
          </div>
        </div>
      </div>

      {/* Hero Section Removed */}

      {/* Content Cards */}
      <div className="space-y-4">
        {categories.map((c) => (
          <div key={c.label} className="overflow-hidden" style={{...glassCard, borderRadius: 16}}>
            <button
              onClick={() => navigate(c.path)}
              className="relative w-full h-44 block"
            >
              <img
                src={c.image}
                alt={c.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <span className="text-[26px] font-medium text-white" style={{ fontFamily: '"Bodoni Moda", Georgia, serif' }}>{c.label}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
