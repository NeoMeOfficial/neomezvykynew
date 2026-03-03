import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Zap, Shield, Filter } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface Exercise {
  id: string;
  name: string;
  duration: '15 min' | '5 min';
  category: '15min' | 'dopalovacka';
  body: 'Celé telo' | 'Core/Abs' | 'Nohy/Zadok';
  equip: 'Bez pomôcok' | 'S gumou' | 'S činkami';
  level: 1 | 2 | 3 | 4;
  diastasisSafe: boolean;
  thumb: string;
  description?: string;
}

// Level colors - subtle but helpful
const LEVEL_COLORS = {
  1: '#7A9E78', // Green
  2: '#B8864A', // Amber  
  3: '#C27A6E', // Orange
  4: '#8B7D6B', // Brown
};

type FilterState = {
  level: number | null;
  duration: string | null;
  equip: string | null;
  diastasis: boolean | null;
};

const exercises: Exercise[] = [
  // Celé telo exercises - unique images for each workout type
  { id: 'ct-1', name: 'Celé telo', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'Bez pomôcok', level: 1, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1506629905496-f43367ee050d?w=400&h=225&fit=crop', description: 'Komplexné posilnenie celého tela pre začiatočníčky' },
  { id: 'ct-2', name: 'Celé telo', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S činkami', level: 3, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop', description: 'Pokročilé posilnenie s činkami' },
  { id: 'ct-3', name: 'Celé telo', duration: '15 min', category: '15min', body: 'Celé telo', equip: 'S gumou', level: 2, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&h=225&fit=crop', description: 'Stredne náročné cvičenie s gumou' },
  { id: 'ct-4', name: 'Celé telo', duration: '5 min', category: 'dopalovacka', body: 'Celé telo', equip: 'Bez pomôcok', level: 1, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&h=225&fit=crop', description: 'Jemná aktivácia celého tela' },
  { id: 'ct-5', name: 'Celé telo', duration: '5 min', category: 'dopalovacka', body: 'Celé telo', equip: 'S činkami', level: 4, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=225&fit=crop', description: 'Intenzívna dopaľovačka s činkami' },
  { id: 'ct-6', name: 'Celé telo', duration: '5 min', category: 'dopalovacka', body: 'Celé telo', equip: 'S gumou', level: 2, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=225&fit=crop', description: 'Stredná dopaľovačka s gumou' },
  
  // Core/Abs exercises - unique ab/core focused images
  { id: 'core-1', name: 'Core/Abs', duration: '15 min', category: '15min', body: 'Core/Abs', equip: 'Bez pomôcok', level: 3, diastasisSafe: false, thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop', description: 'Pokročilé posilnenie brušných svalov' },
  { id: 'core-2', name: 'Core/Abs', duration: '15 min', category: '15min', body: 'Core/Abs', equip: 'Bez pomôcok', level: 1, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop', description: 'Jemné posilnenie core pre diastázu' },
  { id: 'core-3', name: 'Core/Abs', duration: '5 min', category: 'dopalovacka', body: 'Core/Abs', equip: 'Bez pomôcok', level: 4, diastasisSafe: false, thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop', description: 'Intenzívna aktivácia brucha' },
  { id: 'core-4', name: 'Core/Abs', duration: '5 min', category: 'dopalovacka', body: 'Core/Abs', equip: 'Bez pomôcok', level: 1, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1593080358201-8c69903ac8fe?w=400&h=225&fit=crop', description: 'Jemná aktivácia pre diastázu' },
  
  // Nohy/Zadok exercises - unique lower body focused images
  { id: 'legs-1', name: 'Nohy/Zadok', duration: '15 min', category: '15min', body: 'Nohy/Zadok', equip: 'S gumou', level: 2, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=225&fit=crop', description: 'Stredné posilnenie nôh a zadku' },
  { id: 'legs-2', name: 'Nohy/Zadok', duration: '15 min', category: '15min', body: 'Nohy/Zadok', equip: 'Bez pomôcok', level: 1, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1616279969856-759f316a32d4?w=400&h=225&fit=crop', description: 'Základné posilnenie bez pomôcok' },
  { id: 'legs-3', name: 'Nohy/Zadok', duration: '5 min', category: 'dopalovacka', body: 'Nohy/Zadok', equip: 'S gumou', level: 3, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=225&fit=crop', description: 'Pokročilá aktivácia s gumou' },
  { id: 'legs-4', name: 'Nohy/Zadok', duration: '5 min', category: 'dopalovacka', body: 'Nohy/Zadok', equip: 'Bez pomôcok', level: 2, diastasisSafe: true, thumb: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=225&fit=crop', description: 'Stredná aktivácia bez pomôcok' },
];

const glassCard = {
  backgroundColor: 'rgba(255,255,255,0.35)',
  backdropFilter: 'blur(40px)',
  border: '1px solid rgba(255,255,255,0.8)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
};

// Compact exercise card for slider
function SliderExerciseCard({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) {
  const levelColor = LEVEL_COLORS[exercise.level];
  
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
        <img src={exercise.thumb} alt={exercise.name} className="w-full h-full object-cover" />
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
        {/* First row: Level + Duration */}
        <div className="flex items-center gap-1.5">
          {/* Level tag */}
          <span 
            className="text-[9px] px-1.5 py-0.5 rounded-full font-bold text-white"
            style={{ backgroundColor: levelColor }}
          >
            L{exercise.level}
          </span>
          
          {/* Duration tag */}
          <span 
            className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-[#6B4C3B]/10"
            style={{ color: colors.telo }}
          >
            {exercise.duration}
          </span>
        </div>
        
        {/* Second row: Equipment + Diastasis + Category */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Equipment tag */}
          <span 
            className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: `${colors.accent}15`,
              color: colors.accent,
            }}
          >
            {exercise.equip}
          </span>
          
          {/* Diastasis safe tag */}
          {exercise.diastasisSafe && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-green-500/10 text-green-600 flex items-center gap-0.5">
              <Shield className="w-2 h-2" strokeWidth={2} />
              Diastáza safe
            </span>
          )}
          
          {/* Dopalovacka tag */}
          {exercise.category === 'dopalovacka' && (
            <span 
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-[#7A9E78]/10"
              style={{ color: colors.strava }}
            >
              Dopaľovačka
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

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

// Category section with horizontal slider and filters
function CategorySection({ title, exercises, icon: Icon, color, allExercises }: {
  title: string;
  exercises: Exercise[];
  icon: React.ElementType;
  color: string;
  allExercises: Exercise[];
}) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    level: null,
    duration: null,
    equip: null,
    diastasis: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterToggle = (type: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  const clearFilters = () => {
    setFilters({ level: null, duration: null, equip: null, diastasis: null });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== null);

  // Apply filters
  const filteredExercises = exercises.filter((exercise) => {
    if (filters.level && exercise.level !== filters.level) return false;
    if (filters.duration && exercise.duration !== filters.duration) return false;
    if (filters.equip && exercise.equip !== filters.equip) return false;
    if (filters.diastasis !== null && exercise.diastasisSafe !== filters.diastasis) return false;
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
          {/* Náročnosť */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-[#8B7560] uppercase tracking-wide">Náročnosť</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((level) => (
                <FilterButton
                  key={level}
                  label={`Level ${level}`}
                  active={filters.level === level}
                  onClick={() => handleFilterToggle('level', level)}
                  color={LEVEL_COLORS[level as keyof typeof LEVEL_COLORS]}
                />
              ))}
            </div>
          </div>

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
            <div className="flex gap-2 flex-wrap">
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
              <FilterButton
                label="S činkami"
                active={filters.equip === 'S činkami'}
                onClick={() => handleFilterToggle('equip', 'S činkami')}
                color={color}
              />
            </div>
          </div>

          {/* Bezpečnosť */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-[#8B7560] uppercase tracking-wide">Bezpečnosť</p>
            <div className="flex gap-2">
              <FilterButton
                label="Diastáza safe"
                active={filters.diastasis === true}
                onClick={() => handleFilterToggle('diastasis', true)}
                color="#10b981"
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
        {filteredExercises.length > 0 ? (
          <>
            <div className="-mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                {filteredExercises.map((exercise, i) => (
                  <div key={exercise.id} style={{ scrollSnapAlign: 'start' }}>
                    <SliderExerciseCard 
                      exercise={exercise} 
                      onClick={() => navigate(`/exercise/extra/${allExercises.findIndex(e => e.id === exercise.id)}`)}
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
            <p className="text-[12px] text-[#8B7560]">Žiadne cvičenia nevyhovujú filtrom</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeloExtra() {
  const navigate = useNavigate();
  
  // Store all exercises for index reference
  const allExercises = exercises;
  
  // Group exercises by body part
  const exercisesByBodyPart = {
    'Celé telo': exercises.filter(e => e.body === 'Celé telo'),
    'Core/Abs': exercises.filter(e => e.body === 'Core/Abs'),
    'Nohy/Zadok': exercises.filter(e => e.body === 'Nohy/Zadok'),
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

      {/* Description */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <p className="text-[13px] leading-relaxed" style={{ color: '#6B4C3B' }}>
          Vyber si cvičenie podľa zamerania. Každá kategória obsahuje <strong>15-minútové cvičenia</strong> aj <strong>5-minútové dopaľovačky</strong>. Posuň doprava pre viac možností.
        </p>
      </div>

      {/* Category Sections with Horizontal Sliders */}
      <div className="space-y-5">
        {/* Celé telo */}
        <CategorySection
          title="Celé telo" 
          exercises={exercisesByBodyPart['Celé telo']}
          icon={Zap}
          color={colors.telo}
          allExercises={allExercises}
        />
        
        {/* Core/Abs */}
        <CategorySection
          title="Core/Abs" 
          exercises={exercisesByBodyPart['Core/Abs']}
          icon={Zap}
          color={colors.strava}
          allExercises={allExercises}
        />
        
        {/* Nohy/Zadok */}
        <CategorySection
          title="Nohy/Zadok" 
          exercises={exercisesByBodyPart['Nohy/Zadok']}
          icon={Zap}
          color={colors.accent}
          allExercises={allExercises}
        />
      </div>

      {/* Stats summary */}
      <div className="text-center pt-4">
        <p className="text-[12px] text-[#8B7560]">
          {exercises.length} cvičení celkom • Swipe doprava pre viac
        </p>
      </div>
    </div>
  );
}
