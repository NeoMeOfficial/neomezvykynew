import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dumbbell } from 'lucide-react';

const categories = [
  { label: 'Programy', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop', path: '/kniznica/telo/programy' },
  { label: 'Extra cvičenia', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=600&fit=crop', path: '/kniznica/telo/extra' },
  { label: 'Strečing', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop', path: '/kniznica/telo/strecing' },
];

export default function Telo() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Dumbbell className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Telo</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Tréningy pre tvoje zdravie a silu
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="relative h-64">
          <img
            src="/images/telo-hero.jpg"
            alt="NeoMe Telo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30" />
          <div className="absolute bottom-6 left-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Formuj svoje telo
            </h2>
            <p className="text-white/90 text-sm">
              Personalizované tréningy pre každú ženu
            </p>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        {categories.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
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
                <span className="text-2xl font-bold text-white">{c.label}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
