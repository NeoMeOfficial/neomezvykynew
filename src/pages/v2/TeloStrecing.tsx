import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { colors } from '../../theme/warmDusk';

type Filter = string;

const timeFilters = ['15 min', '5 min'];
const bodyFilters = ['Celé telo', 'Vršok/Stred tela', 'Dolná časť tela'];
const equipFilters = ['Bez pomôcok', 'S gumou'];

const stretches = [
  { name: 'Ranný strečing – Celé telo', duration: '15 min', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop' },
  { name: 'Uvoľnenie hornej časti', duration: '15 min', body: 'Vršok/Stred tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop' },
  { name: 'Strečing nôh a bedier', duration: '15 min', body: 'Dolná časť tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop' },
  { name: 'Rýchla úľava – Celé telo', duration: '5 min', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop' },
  { name: 'Večerné uvoľnenie', duration: '15 min', body: 'Celé telo', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop' },
  { name: 'Quick stretch – Dolná časť', duration: '5 min', body: 'Dolná časť tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop' },
  { name: 'Mobilita chrbtice', duration: '15 min', body: 'Vršok/Stred tela', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop' },
];

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
        active ? 'text-white' : ''
      }`}
      style={active ? {
        backgroundColor: colors.telo,
        boxShadow: `0 6px 20px ${colors.telo}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
      } : {
        backgroundColor: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.3)',
        color: colors.textSecondary,
      }}
    >
      {label}
    </button>
  );
}

export default function TeloStrecing() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Set<Filter>>(new Set());

  const toggle = (f: Filter) => {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });
  };

  const filtered = stretches.filter((e) => {
    if (active.size === 0) return true;
    const matchTime = timeFilters.some((f) => active.has(f)) ? active.has(e.duration) : true;
    const matchBody = bodyFilters.some((f) => active.has(f)) ? active.has(e.body) : true;
    const matchEquip = equipFilters.some((f) => active.has(f)) ? active.has(e.equip) : true;
    return matchTime && matchBody && matchEquip;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/kniznica/telo')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#2E2218]">Strečing</h1>
      </div>

      <GlassCard 
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(40px)',
        }}
      >
        <p className="text-[13px] leading-relaxed" style={{ color: colors.textSecondary }}>
          Ak pocítiš extra stuhnutosť alebo máš len extra pretlak, dopraj si extra 15-minútový strečing alebo rýchlu 5-minútovú úľavu, ktorá ti pomôžu uvoľniť telo aj myseľ a zmierniť napätie.
        </p>
      </GlassCard>

      {/* 3D Filter Buttons with swipe indicators */}
      <div className="relative">
        <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1">
            {[...timeFilters, ...bodyFilters, ...equipFilters].map((f) => (
              <Pill key={f} label={f} active={active.has(f)} onClick={() => toggle(f)} />
            ))}
          </div>
        </div>
        
        {/* Swipe indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F0E6DA] to-transparent flex items-center justify-start pl-1 pointer-events-none">
          <ChevronLeft size={16} style={{ color: colors.textTertiary }} />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F0E6DA] to-transparent flex items-center justify-end pr-1 pointer-events-none">
          <ChevronRight size={16} style={{ color: colors.textTertiary }} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((e, i) => (
          <GlassCard 
            key={i} 
            className="!p-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => navigate(`/stretch/${i}`)}
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
