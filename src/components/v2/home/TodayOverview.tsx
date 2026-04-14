import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell, UtensilsCrossed, Brain, Heart, ChevronRight, Play, Sparkles, Airplay,
} from 'lucide-react';
import GlassCard from '../GlassCard';
import { colors, innerGlass, iconContainer, sectionLabel as sectionLabelStyle } from '../../../theme/warmDusk';
import { useMealPlan } from '../../../features/nutrition/useMealPlan';
import { recipes as recipesData } from '../../../data/recipes';
import { useCycleData } from '../../../features/cycle/useCycleData';
import { getPhaseRanges, getPhaseByDay, getCurrentCycleDay, getNextPeriodDate } from '../../../features/cycle/utils';
import { suggestForDay } from '../../../features/cycle/suggestions';
import { differenceInDays } from 'date-fns';
import type { PhaseKey } from '../../../features/cycle/types';
import { useUserProgram, usePromotionalOffers } from '../../../hooks/useUserProgram';
import { PromotionalBanner } from './PromotionalBanner';
import { getRecommendedExercise } from '../../../data/exercises';

const PHASE_NAMES: Record<PhaseKey, string> = {
  menstrual: 'Menštruácia', follicular: 'Folikulárna fáza', ovulation: 'Ovulácia', luteal: 'Luteálna fáza',
};
const PHASE_EMOJI: Record<PhaseKey, string> = {
  menstrual: '🌸', follicular: '🌱', ovulation: '✨', luteal: '🌙',
};
const PHASE_COLORS: Record<PhaseKey, string> = {
  menstrual: colors.periodka, follicular: colors.strava, ovulation: colors.mysel, luteal: colors.accent,
};
const PHASE_MESSAGES: Record<PhaseKey, string> = {
  menstrual: 'Tvoje telo regeneruje — dopraj si pokoj a teplo',
  follicular: 'Energia rastie — skvelý čas na nové výzvy!',
  ovulation: 'Si na vrchole energie — využi to naplno!',
  luteal: 'Spomaľ a počúvaj svoje telo — zaslúžiš si starostlivosť',
};

// Phase descriptions for better user guidance
const PHASE_DESCRIPTIONS: Record<PhaseKey, string> = {
  menstrual: 'Nízka intenzita — tvoje telo regeneruje',
  follicular: 'Energia rastie — čas na výzvy!',
  ovulation: 'Si na vrchole — daj do toho maximum!',
  luteal: 'Spomaľ a počúvaj svoje telo',
};

/* ── Section icon + label header ──────────── */
function SectionHeader({ icon: Icon, label, color }: { icon: typeof Dumbbell; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={iconContainer(color)}>
        <Icon size={16} style={{ color }} strokeWidth={2} />
      </div>
      <h3 className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>{label}</h3>
    </div>
  );
}

/* ── CTA link ─────────────────────────────── */
function CtaLink({ label, color, onClick }: { label: string; color: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <div className="flex justify-end mt-3">
      <button onClick={onClick} className="text-[12px] font-medium flex items-center gap-1" style={{ color }}>
        {label} <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ── Telo ─────────────────────────────────── */
function TeloSection({ showPromoBanner }: { showPromoBanner: boolean }) {
  const navigate = useNavigate();
  const { userProgram, hasProgram } = useUserProgram();
  const { activeOffer } = usePromotionalOffers();
  const { cycleData } = useCycleData();
  
  const cycleLength = cycleData.cycleLength || 28;
  const periodLength = cycleData.periodLength || 5;
  const today = new Date();
  const currentDay = cycleData.lastPeriodStart ? getCurrentCycleDay(cycleData.lastPeriodStart, today, cycleLength) : 18;
  const ranges = getPhaseRanges(cycleLength, periodLength);
  const phase = getPhaseByDay(currentDay, ranges, cycleLength);
  
  // Get smart exercise recommendation based on cycle phase
  const recommendedExercise = getRecommendedExercise(phase.key);

  const handleCardClick = () => {
    if (hasProgram && userProgram?.todaysExercise) {
      // Navigate to today's program exercise
      navigate('/exercise/today', { state: { exercise: userProgram.todaysExercise } });
    } else {
      // Navigate directly to the recommended exercise video
      navigate(recommendedExercise.route, { 
        state: { 
          exercise: recommendedExercise,
          fromRecommendation: true 
        } 
      });
    }
  };

  const handleCtaClick = () => {
    if (hasProgram) {
      // Go to program library
      navigate('/program/dashboard');
    } else {
      // Go to Telo library  
      navigate('/kniznica/telo');
    }
  };

  const handleAirPlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger AirPlay for video streaming
    if (userProgram?.todaysExercise?.videoUrl) {
      // In real app, this would trigger native AirPlay
      console.log('AirPlay requested for:', userProgram.todaysExercise.videoUrl);
      alert('AirPlay aktivovaný pre Apple TV');
    } else if (recommendedExercise) {
      console.log('AirPlay requested for recommended exercise:', recommendedExercise.name);
      alert('AirPlay aktivovaný pre Apple TV');
    }
  };

  const handlePromoClick = () => {
    if (activeOffer) {
      // Navigate to programs with discount code applied
      navigate('/kniznica/telo/programy', { 
        state: { 
          discountCode: activeOffer.discountCode,
          applied: true 
        } 
      });
      
      // Show notification that code was applied
      alert(`Kód ${activeOffer.discountCode} bol automaticky aplikovaný!`);
    }
  };

  // Smart display logic: program exercise vs recommended exercise
  const displayImage = hasProgram && userProgram?.todaysExercise ? 
    userProgram.todaysExercise.thumbnail : recommendedExercise.thumb;
  const displayTitle = hasProgram && userProgram ? userProgram.name : recommendedExercise.name;
  const displayDuration = hasProgram && userProgram?.todaysExercise ? 
    userProgram.todaysExercise.duration : recommendedExercise.duration;
  const displayDescription = PHASE_DESCRIPTIONS[phase.key];

  return (
    <>
      <GlassCard className="!p-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={handleCardClick}>
        <SectionHeader icon={Dumbbell} label="Telo" color={colors.telo} />
        
        <div className="relative rounded-2xl overflow-hidden mb-3">
          <img src={displayImage} alt={displayTitle} className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Play size={20} style={{ color: colors.telo, marginLeft: 2 }} fill={colors.telo} />
            </div>
          </div>
          
          {/* AirPlay button for both program users and recommended exercises */}
          <button
            onClick={handleAirPlayClick}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <Airplay size={14} className="text-white" />
          </button>
          
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {displayDuration}
          </div>
        </div>

        {/* Program info for enrolled users - moved under video */}
        {hasProgram && userProgram && (
          <div className="flex gap-4 mb-2">
            <span className="text-[13px] font-medium" style={{ color: colors.textPrimary }}>
              Týždeň {userProgram.week}
            </span>
            <span className="text-[13px] font-medium" style={{ color: colors.textPrimary }}>
              Deň {userProgram.day}
            </span>
          </div>
        )}

        <p className="text-[14px] font-medium" style={{ color: colors.textPrimary }}>
          {hasProgram && userProgram?.todaysExercise ? userProgram.todaysExercise.title : displayTitle}
        </p>
        {!hasProgram && (
          <p className="text-[12px] mt-0.5" style={{ color: colors.textTertiary }}>
            {displayDescription}
          </p>
        )}
        
        {/* Show exercise category/intensity tags for recommended exercises */}
        {!hasProgram && recommendedExercise && (
          <div className="flex items-center gap-2 mt-2">
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ 
                backgroundColor: `${colors.telo}15`,
                color: colors.telo,
              }}
            >
              {recommendedExercise.category === 'stretch' ? 'Strečing' : 'Posilňovanie'}
            </span>
            <span 
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${colors.accent}15`,
                color: colors.accent,
              }}
            >
              {recommendedExercise.equip}
            </span>
          </div>
        )}
        
        <CtaLink 
          label="Viac v knižnici" 
          color={colors.telo} 
          onClick={(e) => {
            e.stopPropagation();
            handleCtaClick();
          }} 
        />
      </GlassCard>

      {/* Promotional banner for non-enrolled users */}
      {!hasProgram && showPromoBanner && activeOffer && (
        <PromotionalBanner
          title={activeOffer.title}
          description={activeOffer.bannerText}
          discountCode={activeOffer.discountCode}
          discountValue={activeOffer.discountValue}
          onClaim={handlePromoClick}
          type="program"
        />
      )}
    </>
  );
}

/* ── Strava ────────────────────────────────── */
function StravaSection() {
  const navigate = useNavigate();
  const { todayPlan } = useMealPlan();
  const hasRealPlan = todayPlan && todayPlan.meals.length > 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const seed = todayStr.split('-').reduce((acc, p) => acc + parseInt(p, 10), 0);
  const sampleRecipe = recipesData[seed % recipesData.length];

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/jedalnicek');
  };

  return (
    <GlassCard className="!p-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/jedalnicek')}>
      <SectionHeader icon={UtensilsCrossed} label="Strava" color={colors.strava} />

      {hasRealPlan && (
        <>
          <p className="text-[11px] font-medium mb-2" style={{ color: colors.textTertiary }}>Dnešný jedálniček</p>
          <div className="space-y-2 mb-3">
            {todayPlan!.meals.map((meal) => {
              const recipe = recipesData.find((r) => r.id === meal.options[meal.selected]);
              if (!recipe) return null;
              const adjustedCal = Math.round(recipe.calories * meal.portionMultiplier);
              return (
                <div
                  key={meal.type}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={innerGlass}
                >
                  <img src={recipe.image} alt={recipe.title} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium" style={{ color: colors.textTertiary }}>{meal.label}</p>
                    <p className="text-[13px] font-medium truncate" style={{ color: colors.textPrimary }}>{recipe.title}</p>
                  </div>
                  <span className="text-[11px] shrink-0" style={{ color: colors.textTertiary }}>{adjustedCal} kcal</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {sampleRecipe && (
        <>
          <p className="text-[11px] font-medium mb-2" style={{ color: colors.textTertiary }}>Recept dňa</p>
          <div className="flex items-center gap-3 p-3 rounded-2xl" style={innerGlass}>
            <img src={sampleRecipe.image} alt={sampleRecipe.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate" style={{ color: colors.textPrimary }}>{sampleRecipe.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: colors.textTertiary }}>
                {sampleRecipe.calories} kcal · {sampleRecipe.prepTime} min
              </p>
            </div>
          </div>
        </>
      )}

      <CtaLink label="Jedálniček" color={colors.strava} onClick={handleCtaClick} />
    </GlassCard>
  );
}

/* ── Daily meditations that change each day ─── */
const DAILY_MEDITATIONS = [
  { title: 'Ranné prebúdzanie', duration: '8 min', category: 'energia', audioUrl: '/audio/morning-awakening.mp3' },
  { title: 'Večerné uvoľnenie', duration: '12 min', category: 'relax', audioUrl: '/audio/evening-relaxation.mp3' },
  { title: 'Stres-relief pause', duration: '6 min', category: 'stres', audioUrl: '/audio/stress-relief.mp3' },
  { title: 'Meditácia vďačnosti', duration: '10 min', category: 'pozitivita', audioUrl: '/audio/gratitude.mp3' },
  { title: 'Mindful breathing', duration: '5 min', category: 'dýchanie', audioUrl: '/audio/mindful-breathing.mp3' },
  { title: 'Body scan relaxation', duration: '15 min', category: 'telo', audioUrl: '/audio/body-scan.mp3' },
  { title: 'Koncentrácia a focus', duration: '9 min', category: 'produktivita', audioUrl: '/audio/focus.mp3' },
];

function getDailyMeditation() {
  const dayOfWeek = new Date().getDay();
  return DAILY_MEDITATIONS[dayOfWeek % DAILY_MEDITATIONS.length];
}

/* ── Myseľ ─────────────────────────────────── */
function MyselSection() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const dailyMeditation = getDailyMeditation();

  const handleCardClick = () => {
    // Start the daily meditation audio player
    setIsPlaying(!isPlaying);
    
    // In real app, this would trigger audio playback
    if (!isPlaying) {
      console.log('Starting meditation audio:', dailyMeditation.audioUrl);
      alert(`Spúšťa sa ${dailyMeditation.title} - ${dailyMeditation.duration}`);
    } else {
      console.log('Pausing meditation audio');
      alert('Meditácia pozastavená');
    }
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/meditacie');
  };

  return (
    <GlassCard className="!p-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={handleCardClick}>
      <SectionHeader icon={Brain} label="Myseľ" color={colors.mysel} />
      <div className="flex items-center gap-3 p-3 rounded-2xl" style={innerGlass}>
        <div 
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isPlaying ? 'scale-110' : ''}`} 
          style={{
            ...iconContainer(colors.mysel),
            backgroundColor: isPlaying ? `${colors.mysel}30` : iconContainer(colors.mysel).backgroundColor,
          }}
        >
          <Play 
            size={16} 
            style={{ color: colors.mysel }} 
            fill={isPlaying ? colors.mysel : 'none'} 
          />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium" style={{ color: colors.textPrimary }}>
            {dailyMeditation.title}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: colors.textTertiary }}>
            {dailyMeditation.duration} · {dailyMeditation.category}
          </p>
        </div>
        {isPlaying && (
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.mysel }} />
        )}
      </div>
      <CtaLink label="Viac meditácií" color={colors.mysel} onClick={handleCtaClick} />
    </GlassCard>
  );
}

/* ── Periodka ──────────────────────────────── */
function PeriodkaSection() {
  const navigate = useNavigate();
  const { cycleData } = useCycleData();
  const cycleLength = cycleData.cycleLength || 28;
  const periodLength = cycleData.periodLength || 5;
  const today = new Date();
  const hasData = !!cycleData.lastPeriodStart;
  const currentDay = hasData ? getCurrentCycleDay(cycleData.lastPeriodStart!, today, cycleLength) : 14;
  const ranges = getPhaseRanges(cycleLength, periodLength);
  const phase = getPhaseByDay(currentDay, ranges, cycleLength);
  const suggestion = suggestForDay(currentDay, ranges, cycleLength);
  const phaseColor = PHASE_COLORS[phase.key];
  const daysUntilPeriod = hasData
    ? Math.max(0, differenceInDays(getNextPeriodDate(cycleData.lastPeriodStart!, cycleLength), today))
    : cycleLength - currentDay;

  const handleClick = () => {
    navigate('/kniznica/periodka');
  };

  return (
    <GlassCard className="!p-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={handleClick}>
      <SectionHeader icon={Heart} label="Periodka" color={colors.periodka} />

      {!hasData ? (
        /* ── Empty state: no cycle data entered yet ── */
        <div className="rounded-2xl p-4 text-center space-y-3" style={innerGlass}>
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: `${colors.periodka}18` }}>
            <Heart size={22} style={{ color: colors.periodka }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[14px] font-semibold mb-1" style={{ color: colors.textPrimary }}>Nastav si cyklus</p>
            <p className="text-[12px] leading-relaxed" style={{ color: colors.textSecondary }}>
              Zadaj dátum poslednej menštruácie a my ti povieme, v akej fáze si práve teraz.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium"
            style={{ background: `${colors.periodka}18`, color: colors.periodka }}
          >
            <Sparkles size={12} />
            Nastaviť teraz
          </div>
        </div>
      ) : (
        /* ── Active state: cycle data exists ── */
        <div className="rounded-2xl p-3" style={innerGlass}>
          {/* Phase name + message */}
          <p className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>{PHASE_NAMES[phase.key]}</p>
          <p className="text-[12px] mt-0.5 mb-2" style={{ color: colors.textSecondary }}>{PHASE_MESSAGES[phase.key]}</p>

          {/* Energy + days until period */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[11px] font-medium" style={{ color: colors.textSecondary }}>Energia</span>
              <div className="flex-1 h-1.5 rounded-full bg-black/5 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${suggestion.energy}%`, background: phaseColor }} />
              </div>
              <span className="text-[11px] font-medium" style={{ color: colors.textSecondary }}>{suggestion.energy}%</span>
            </div>
            <p className="text-[11px] ml-4" style={{ color: colors.textSecondary }}>
              Ďalšia o <span className="font-bold" style={{ color: colors.textPrimary }}>{daysUntilPeriod} dní</span>
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ── Main ──────────────────────────────────── */
export default function TodayOverview() {
  const shouldShowProgramBanner = false;

  return (
    <div className="space-y-3">
      <TeloSection showPromoBanner={shouldShowProgramBanner} />
      <StravaSection />
      <MyselSection />
      <PeriodkaSection />
    </div>
  );
}
