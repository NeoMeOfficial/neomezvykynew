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
  // Celé telo stretches - black and white, women doing full body stretches
  { id: 'ct-1', name: 'Celé telo', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Komplexné uvoľnenie celého tela' },
  { id: 'ct-2', name: 'Celé telo', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Večerné uvoľnenie s pomocou gumy' },
  { id: 'ct-3', name: 'Celé telo', duration: '5 min', category: 'quickstretch', body: 'Celé telo', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Rýchla úľava pre celé telo' },
  
  // Vršok/Stred tela stretches - black and white, women doing upper body stretches
  { id: 'vs-1', name: 'Vršok/Stred tela', duration: '15 min', category: '15min', body: 'Vršok/Stred tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1591027858406-a9a20dd3c95c?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Uvoľnenie ramien a chrbtice' },
  { id: 'vs-2', name: 'Vršok/Stred tela', duration: '15 min', category: '15min', body: 'Vršok/Stred tela', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Mobilita chrbtice s gumou' },
  { id: 'vs-3', name: 'Vršok/Stred tela', duration: '5 min', category: 'quickstretch', body: 'Vršok/Stred tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Rýchle uvoľnenie ramien' },
  
  // Dolná časť tela stretches - black and white, women doing lower body stretches
  { id: 'dc-1', name: 'Dolná časť tela', duration: '15 min', category: '15min', body: 'Dolná časť tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Strečing nôh a bedier' },
  { id: 'dc-2', name: 'Dolná časť tela', duration: '15 min', category: '15min', body: 'Dolná časť tela', equip: 'S gumou', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Hlboký strečing s gumou' },
  { id: 'dc-3', name: 'Dolná časť tela', duration: '5 min', category: 'quickstretch', body: 'Dolná časť tela', equip: 'Bez pomôcok', thumb: 'https://images.unsplash.com/photo-1616279969856-759f316a32d4?w=400&h=225&fit=crop&q=80&cs=tinysrgb&mono', description: 'Rýchky strečing nôh' },
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
      className="w-80 flex-shrink-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200"
      style={{
        ...glassCard,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
      }}
      onClick={onClick}
    >
      <div className="relative h-40">
        <img src={stretch.thumb} alt={stretch.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.95)',
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
      
      <div className="p-4 space-y-2">
        {/* Stretch name */}
        <h4 className="text-[15px] font-semibold text-[#2E2218] mb-2">
          {stretch.name}
        </h4>
        
        {/* First row: Duration */}
        <div className="flex items-center gap-2">
          {/* Duration tag */}
          <span 
            className="text-[11px] px-2 py-1 rounded-full font-medium bg-[#6B4C3B]/10"
            style={{ color: colors.telo }}
          >
            {stretch.duration}
          </span>
        </div>
        
        {/* Second row: Equipment + Category */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Equipment tag */}
          <span 
            className="text-[11px] px-2 py-1 rounded-full font-medium"
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
              className="text-[11px] px-2 py-1 rounded-full font-medium bg-[#7A9E78]/10"
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
      <div className="mb-4 space-y-3">
        {/* Category title */}
        <h3 className="text-[16px] font-semibold text-[#2E2218]">{title}</h3>
        
        {/* Filter and swipe row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'text-white shadow-md' 
                : 'bg-white/50 text-[#8B7560] hover:bg-white/70 border border-white/40'
            }`}
            style={showFilters || hasActiveFilters ? { backgroundColor: color } : {}}
          >
            <Filter className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-[13px] font-medium">Nájdi si vhodný strečing</span>
          </button>
          
          {/* Swipe indicator */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50">
            <span className="text-[10px] font-medium text-[#8B7560]">Swipe</span>
            <ArrowLeft className="w-3 h-3 text-[#8B7560] transform rotate-180" strokeWidth={2} />
          </div>
        </div>
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
            <div className="-mx-0.5 px-0.5 overflow-x-auto scrollbar-hide">
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
    <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
      <div className="p-5 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pt-8">
          <button onClick={() => navigate('/kniznica/telo')} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="text-[22px] font-medium leading-tight" style={{ color: colors.textPrimary, fontFamily: '"Bodoni Moda", Georgia, serif' }}>Extra strečingy</h1>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <div className="text-center mb-6">
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Pocíťuješ napätie a stuhnutosť?
              <br />
              Dopraj si rýchlu úľavu a vyber si express strečing zameraný na to, čo potrebuješ.
            </p>
          </div>
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
    </div>
  );
}
