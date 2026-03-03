import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Zap, Filter } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface Stretch {
  id: string;
  name: string;
  duration: '15 min' | '5 min';
  category: '15min' | 'quickstretch';
  body: 'Celé telo' | 'Vršok/Stred tela' | 'Dolná časť tela';
  equip: 'Bez pomôcok' | 'S gumou';
  thumb: string;
  description?: string;
}

type FilterState = {
  duration: string | null;
  equip: string | null;
};

const stretches: Stretch[] = [
  // Celé telo stretches - unique full body stretch images
  { id: 'ct-1', name: 'Celé telo', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=225&fit=crop', description: 'Komplexné uvoľnenie celého tela' },
  { id: 'ct-2', name: 'Celé telo', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?w=400&h=225&fit=crop', description: 'Večerné uvoľnenie s pomocou gumy' },
  { id: 'ct-3', name: 'Celé telo', duration: '5 min', category: 'quickstretch', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=400&h=225&fit=crop', description: 'Rýchla úľava pre celé telo' },
  
  // Vršok/Stred tela stretches - unique upper body stretch images
  { id: 'vs-1', name: 'Vršok/Stred tela', duration: '15 min', category: '15min', body: 'Vršok/Stred tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1591027858406-a9a20dd3c95c?w=400&h=225&fit=crop', description: 'Uvoľnenie ramien a chrbtice' },
  { id: 'vs-2', name: 'Vršok/Stred tela', duration: '15 min', category: '15min', body: 'Vršok/Stred tela', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop', description: 'Mobilita chrbtice s gumou' },
  { id: 'vs-3', name: 'Vršok/Stred tela', duration: '5 min', category: 'quickstretch', body: 'Vršok/Stred tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1529693662653-9d480530b6da?w=400&h=225&fit=crop', description: 'Rýchle uvoľnenie ramien' },
  
  // Dolná časť tela stretches - unique lower body stretch images  
  { id: 'dc-1', name: 'Dolná časť tela', duration: '15 min', category: '15min', body: 'Dolná časť tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1506629905496-f43367ee050d?w=400&h=225&fit=crop', description: 'Strečing nôh a bedier' },
  { id: 'dc-2', name: 'Dolná časť tela', duration: '15 min', category: '15min', body: 'Dolná časť tela', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop', description: 'Hlboký strečing s gumou' },
  { id: 'dc-3', name: 'Dolná časť tela', duration: '5 min', category: 'quickstretch', body: 'Dolná časť tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1518804727470-b52654d69120?w=400&h=225&fit=crop', description: 'Rýchly strečing nôh' },
];

const glassCard = {
  backgroundColor: 'rgba(255,255,255,0.35)',
  backdropFilter: 'blur(40px)',
  border: '1px solid rgba(255,255,255,0.8)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
};

// Filter button component
function FilterButton({ label, active, onClick, color }: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all active:scale-95 ${
        active 
          ? 'text-white shadow-sm' 
          : 'bg-white/50 text-[#8B7560] hover:bg-white/70 border border-white/40'
      }`}
      style={active ? { backgroundColor: color || colors.telo } : {}}
    >
      {label}
    </button>
  );
}

// Compact stretch card for slider
function SliderStretchCard({ stretch, onClick }: { stretch: Stretch; onClick: () => void }) {
  return (
    <div 
      className="w-52 flex-shrink-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200"
      style={{
        ...glassCard,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
      }}
      onClick={onClick}
    >
      <div className="relative h-28">
        <img src={stretch.thumb} alt={stretch.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Play 
              className="w-3.5 h-3.5 ml-0.5" 
              style={{ color: colors.telo }} 
              fill={colors.telo} 
              strokeWidth={0} 
            />
          </div>
        </div>
      </div>
      
      <div className="p-2.5 space-y-1.5">
        {/* First row: Duration */}
        <div className="flex items-center gap-1.5">
          {/* Duration tag */}
          <span 
            className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-[#6B4C3B]/10"
            style={{ color: colors.telo }}
          >
            {stretch.duration}
          </span>
        </div>
        
        {/* Second row: Equipment + Category */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Equipment tag */}
          <span 
            className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: `${colors.accent}15`,
              color: colors.accent,
            }}
          >
            {stretch.equip}
          </span>
          
          {/* Quick stretch tag */}
          {stretch.category === 'quickstretch' && (
            <span 
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-[#7A9E78]/10"
              style={{ color: colors.strava }}
            >
              Rýchly strečing
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Category section with horizontal slider and filters
function CategorySection({ title, stretches, icon: Icon, color, allStretches }: {
  title: string;
  stretches: Stretch[];
  icon: React.ElementType;
  color: string;
  allStretches: Stretch[];
}) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    duration: null,
    equip: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterToggle = (type: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  const clearFilters = () => {
    setFilters({ duration: null, equip: null });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== null);

  // Apply filters
  const filteredStretches = stretches.filter((stretch) => {
    if (filters.duration && stretch.duration !== filters.duration) return false;
    if (filters.equip && stretch.equip !== filters.equip) return false;
    return true;
  });
  
  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
      {/* Category header with filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}14` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="text-[16px] font-semibold text-[#2E2218]">{title}</h3>
        <div className="flex-1" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-1.5 rounded-lg transition-all active:scale-95 ${
            showFilters || hasActiveFilters
              ? 'text-white shadow-sm' 
              : 'bg-white/40 text-[#8B7560] hover:bg-white/60'
          }`}
          style={showFilters || hasActiveFilters ? { backgroundColor: color } : {}}
        >
          <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Organized filters */}
      {showFilters && (
        <div className="mb-4 space-y-3">
          {/* Dĺžka */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-[#8B7560] uppercase tracking-wide">Dĺžka</p>
            <div className="flex gap-2">
              <FilterButton
                label="15 min"
                active={filters.duration === '15 min'}
                onClick={() => handleFilterToggle('duration', '15 min')}
                color={color}
              />
              <FilterButton
                label="5 min"
                active={filters.duration === '5 min'}
                onClick={() => handleFilterToggle('duration', '5 min')}
                color={color}
              />
            </div>
          </div>

          {/* Pomôcky */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-[#8B7560] uppercase tracking-wide">Pomôcky</p>
            <div className="flex gap-2">
              <FilterButton
                label="Bez pomôcok"
                active={filters.equip === 'Bez pomôcok'}
                onClick={() => handleFilterToggle('equip', 'Bez pomôcok')}
                color={color}
              />
              <FilterButton
                label="S gumou"
                active={filters.equip === 'S gumou'}
                onClick={() => handleFilterToggle('equip', 'S gumou')}
                color={color}
              />
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[10px] text-[#8B7560] hover:text-[#6B4C3B] underline"
            >
              Vymazať filtre
            </button>
          )}
        </div>
      )}
      
      {/* Horizontal slider */}
      <div className="relative">
        {filteredStretches.length > 0 ? (
          <>
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                {filteredStretches.map((stretch, i) => (
                  <div key={stretch.id} style={{ scrollSnapAlign: 'start' }}>
                    <SliderStretchCard 
                      stretch={stretch} 
                      onClick={() => navigate(`/stretch/${allStretches.findIndex(s => s.id === stretch.id)}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Fade indicators */}
            <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-[12px] text-[#8B7560]">Žiadne strečingy nevyhovujú filtrom</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeloStrecing() {
  const navigate = useNavigate();
  
  // Store all stretches for index reference
  const allStretches = stretches;
  
  // Group stretches by body part
  const stretchesByBodyPart = {
    'Celé telo': stretches.filter(s => s.body === 'Celé telo'),
    'Vršok/Stred tela': stretches.filter(s => s.body === 'Vršok/Stred tela'),
    'Dolná časť tela': stretches.filter(s => s.body === 'Dolná časť tela'),
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica/telo')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(168, 132, 139, 0.14)` }}>
              <Zap className="w-4 h-4" style={{ color: '#A8848B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Extra strečingy</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Uvoľni napätie a zlepši flexibilitu
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <p className="text-[13px] leading-relaxed" style={{ color: '#6B4C3B' }}>
          Vyber si strečing podľa oblasti tela. Každá kategória obsahuje <strong>15-minútové strečingy</strong> aj <strong>5-minútové rýchle úľavy</strong>. Posuň doprava pre viac možností.
        </p>
      </div>

      {/* Category Sections with Horizontal Sliders */}
      <div className="space-y-5">
        {/* Celé telo */}
        <CategorySection
          title="Celé telo" 
          stretches={stretchesByBodyPart['Celé telo']}
          icon={Zap}
          color={colors.mysel}
          allStretches={allStretches}
        />
        
        {/* Vršok/Stred tela */}
        <CategorySection
          title="Vršok/Stred tela" 
          stretches={stretchesByBodyPart['Vršok/Stred tela']}
          icon={Zap}
          color={colors.strava}
          allStretches={allStretches}
        />
        
        {/* Dolná časť tela */}
        <CategorySection
          title="Dolná časť tela" 
          stretches={stretchesByBodyPart['Dolná časť tela']}
          icon={Zap}
          color={colors.accent}
          allStretches={allStretches}
        />
      </div>

      {/* Stats summary */}
      <div className="text-center pt-4">
        <p className="text-[12px] text-[#8B7560]">
          {stretches.length} strečingov celkom • Swipe doprava pre viac
        </p>
      </div>
    </div>
  );
}
