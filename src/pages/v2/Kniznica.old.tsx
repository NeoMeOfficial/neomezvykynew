import { useNavigate } from 'react-router-dom';
import { colors, sectionLabel as sectionLabelStyle } from '../../theme/warmDusk';

const sections = [
  { label: 'Telo', color: colors.telo, image: '/images/category-telo.jpg', path: '/kniznica/telo' },
  { label: 'Strava', color: colors.strava, image: '/images/category-strava.jpg', path: '/kniznica/strava' },
  { label: 'Myseľ', color: colors.mysel, image: '/images/category-mysel.jpg', path: '/kniznica/mysel' },
  { label: 'Periodka', color: colors.periodka, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop', path: '/kniznica/periodka' },
  { label: 'Osobný denník', color: colors.mysel, image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop', path: '/kniznica/dennik' },
  { label: 'Návyky', color: colors.accent, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop', path: '/kniznica/navyky' },
  { label: 'Blog', color: colors.textSecondary, image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&h=600&fit=crop', path: '/kniznica/blog' },
];

export default function Kniznica() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 text-center">
        <h1 className="text-[28px] font-medium leading-tight mb-2" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Knižnica</h1>
        <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
          Výber kategórií pre tvoju cestu k lepšiemu zdraviu
        </p>
      </div>

      {/* Nordic Cards */}
      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.label} className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden">
            <button
              onClick={() => navigate(s.path)}
              className="relative w-full h-48 block hover:opacity-95 active:scale-[0.99] transition-all"
            >
              <img src={s.image} alt={s.label} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-2">
                <div className="w-1 h-8 rounded-full" style={{ background: s.color }} />
                <span className="text-[26px] font-medium text-white" style={{ fontFamily: '"Bodoni Moda", Georgia, serif' }}>{s.label}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
