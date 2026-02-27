import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

type Filter = string;

const timeFilters = ['15 min', '5 min'];
const bodyFilters = ['Celé telo', 'Core/Abs', 'Nohy/Zadok', 'Diastáza friendly'];
const equipFilters = ['Bez pomôcok', 'S gumou', 'S jednoručkami'];

const exercises = [
  { name: 'Full Body Burn', duration: '15 min', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop' },
  { name: 'Core Ignite', duration: '15 min', body: 'Core/Abs', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop' },
  { name: 'Booty Builder', duration: '15 min', body: 'Nohy/Zadok', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop' },
  { name: 'Abs & Core – Diastáza OK', duration: '15 min', body: 'Diastáza friendly', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop' },
  { name: 'Quick Burn – Celé telo', duration: '5 min', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop' },
  { name: 'Dopaľovačka – Nohy', duration: '5 min', body: 'Nohy/Zadok', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop' },
  { name: 'Upper Body Sculpt', duration: '15 min', body: 'Celé telo', equip: 'S jednoručkami', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop' },
  { name: 'Core Dopaľovačka', duration: '5 min', body: 'Core/Abs', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop' },
];

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
        active 
          ? 'bg-[#6B4C3B] text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

export default function TeloExtra() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Set<Filter>>(new Set());

  const toggle = (f: Filter) => {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const filtered = exercises.filter((e) => {
    if (active.size === 0) return true;
    const matchTime = timeFilters.some((f) => active.has(f)) ? active.has(e.duration) : true;
    const matchBody = bodyFilters.some((f) => active.has(f)) ? active.has(e.body) : true;
    const matchEquip = equipFilters.some((f) => active.has(f)) ? active.has(e.equip) : true;
    return matchTime && matchBody && matchEquip;
  });

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica/telo')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <Zap className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Extra cvičenia</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Pridaj si niečo extra k svojmu cvičeniu
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <p className="text-[13px] leading-relaxed" style={{ color: '#6B4C3B' }}>
          Ak máš extra chvíľku alebo extra energiu a chceš si pridať niečo navyše, vyber si extra 15-minútové cvičenie alebo rýchlu 5-minútovú dopaľovačku.
        </p>
      </div>

      {/* 3D Filter Buttons - clean horizontal scroll */}
      <div className="relative">
        <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1" style={{ scrollSnapType: 'x mandatory' }}>
            {[...timeFilters, ...bodyFilters, ...equipFilters].map((f) => (
              <div key={f} style={{ scrollSnapAlign: 'start' }}>
                <Pill label={f} active={active.has(f)} onClick={() => toggle(f)} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Subtle fade indicators - only show when content overflows */}
        <div className="absolute left-0 top-0 bottom-1 w-4 bg-gradient-to-r from-[#F0E6DA] via-[#F0E6DA] to-transparent pointer-events-none opacity-60" />
        <div className="absolute right-0 top-0 bottom-1 w-4 bg-gradient-to-l from-[#F0E6DA] via-[#F0E6DA] to-transparent pointer-events-none opacity-60" />
      </div>

      <div className="space-y-3">
        {filtered.map((e, i) => (
          <GlassCard 
            key={i} 
            className="!p-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => navigate(`/exercise/extra/${i}`)}
          >
            <div className="relative h-36">
              <img src={e.thumb} alt={e.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <Play 
                    className="w-5 h-5 ml-0.5" 
                    style={{ color: colors.telo }} 
                    fill={colors.telo} 
                    strokeWidth={0} 
                  />
                </div>
              </div>
            </div>
            
            {/* White background for better readability */}
            <div 
              className="p-4"
              style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <p className="text-[15px] font-semibold" style={{ color: colors.textPrimary }}>
                {e.name}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[12px] flex items-center gap-1" style={{ color: colors.textTertiary }}>
                  <Clock className="w-3 h-3" strokeWidth={1.5} />{e.duration}
                </span>
                <span 
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{ 
                    backgroundColor: `${colors.telo}15`,
                    color: colors.telo,
                  }}
                >
                  {e.body}
                </span>
                <span 
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${colors.accent}15`,
                    color: colors.accent,
                  }}
                >
                  {e.equip}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
