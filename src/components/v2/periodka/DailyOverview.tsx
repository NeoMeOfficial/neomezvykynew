import { useMemo, useState } from 'react';
import { Clock, Utensils, Activity, Brain, ChevronLeft, ChevronRight, X, Wind, BookOpen, Sparkles } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, subDays, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { sk } from 'date-fns/locale';
import GlassCard from '../GlassCard';
import { useCycleData } from '../../../features/cycle/useCycleData';
import {
  getPhaseRanges, getPhaseByDay, getCurrentCycleDay, isFertilityDate, getSubphase
} from '../../../features/cycle/utils';
import type { PhaseKey, PhaseRange } from '../../../features/cycle/types';
import { generateNutrition, generateMovement } from '../../../lib/cycleTipsGenerator';
import { generateMindset } from '../../../lib/myselGenerator';
import { colors } from '../../../theme/warmDusk';

// Symptom interfaces and data
interface DaySymptoms {
  date: string;
  symptom: string;
  intensity: number;
  timestamp: string;
}

const SYMPTOMS = [
  { emoji: '⚡', label: 'Energia', type: 'energy' },
  { emoji: '🩸', label: 'Krvácanie', type: 'flow' },
  { emoji: '🩸', label: 'Výtok', type: 'spotting' },
  { emoji: '🤕', label: 'Kŕče', type: 'pain' },
  { emoji: '😊', label: 'Nálada', type: 'mood' },
  { emoji: '😴', label: 'Spánok', type: 'sleep' },
  { emoji: '🤕', label: 'Bolesť hlavy', type: 'headache' },
  { emoji: '🫃', label: 'Nafúknutie', type: 'bloating' },
  { emoji: '🍫', label: 'Apetít', type: 'appetite' },
  { emoji: '✨', label: 'Pleť', type: 'skin' },
];

const INTENSITY_LABELS = {
  energy: ['Žiadna', 'Slabá', 'Mierná', 'Normálna', 'Silná', 'Veľmi silná'],
  flow: ['Žiadne', 'Slabé', 'Mierné', 'Normálne', 'Silné', 'Veľmi silné'],
  spotting: ['Žiadne', 'Slabé', 'Mierné', 'Normálne', 'Silné', 'Veľmi silné'],
  pain: ['Žiadna', 'Slabá', 'Mierná', 'Normálna', 'Silná', 'Veľmi silná'],
  headache: ['Žiadna', 'Slabá', 'Mierná', 'Normálna', 'Silná', 'Veľmi silná'],
  mood: ['Žiadna', 'Slabá', 'Mierná', 'Normálna', 'Silná', 'Veľmi silná'],
  sleep: ['Žiadny', 'Slabý', 'Mierny', 'Normálny', 'Silný', 'Veľmi silný'],
  bloating: ['Žiadne', 'Slabé', 'Mierné', 'Normálne', 'Silné', 'Veľmi silné'],
  appetite: ['Žiadny', 'Slabý', 'Mierny', 'Normálny', 'Silný', 'Veľmi silný'],
  skin: ['Žiadne', 'Slabé', 'Mierné', 'Normálne', 'Silné', 'Veľmi silné'],
};

// Load symptom data from localStorage
const getSymptomData = (): DaySymptoms[] => {
  try {
    const log: DaySymptoms[] = JSON.parse(localStorage.getItem('neome-symptom-log') || '[]');
    return log;
  } catch {
    return [];
  }
};

// Get symptoms for a specific date
const getSymptomsForDate = (date: string): DaySymptoms[] => {
  const symptomData = getSymptomData();
  return symptomData.filter(item => item.date === date);
};

const PHASE_COLORS: Record<PhaseKey | 'fertility', string> = {
  menstrual: '#C27A6E',
  follicular: '#7A9E78', 
  ovulation: '#8B5FBF',  // Changed to more visible purple-pink
  luteal: '#B8864A',
  fertility: '#E91E63',  // Pink color for fertility days
};

const PHASE_NAMES: Record<PhaseKey | 'fertility', string> = {
  menstrual: 'Menštruácia',
  follicular: 'Folikulárna fáza',
  ovulation: 'Ovulácia', 
  luteal: 'Luteálna fáza',
  fertility: 'Plodné dni',
};

const PHASE_DESCRIPTIONS: Record<PhaseKey, string> = {
  menstrual: 'Tvoje telo sa regeneruje a obnovuje. Hladiny estrogénu a progesterónu sú nízke, čo môže spôsobiť únavu a potrebu odpočinku.',
  follicular: 'Energia sa postupne vracia! Estrogén stúpa, čo zlepšuje náladu a motiváciu. Ideálny čas na nové výzvy a projekty.',
  ovulation: 'Vrchol energie a sebavedomia. Estrogén je na maximum, telo uvoľňuje vajíčko. Cítiš sa sociálnejšia, komunikatívnejšia a plná sily.',
  luteal: 'Telo sa pripravuje na ďalší cyklus. Progesterón stúpa, môžeš cítiť potrebu spomalenia a starostlivosti o seba.',
};

// Subphase-specific descriptions for luteal phase
const LUTEAL_DESCRIPTIONS: Record<'early' | 'late', { short: string; long: string; name: string }> = {
  early: {
    name: 'Skorá luteálna fáza',
    short: 'Progesterón stúpa a telo sa upokojuje. Cítiš sa vyrovnanejšie, môže sa zlepšiť spánok aj trávenie.',
    long: 'Žlté teliesko (corpus luteum) produkuje progesterón, ktorý dosahuje vrchol zhruba 7 dní po ovulácii. Telo sa pripravuje na možné tehotenstvo — môžeš sa cítiť pokojnejšie a introvertnejšie. Ideálny čas na starostlivosť o seba, oddych a príjemné rutiny.',
  },
  late: {
    name: 'Neskorá luteálna fáza',
    short: 'Progesterón aj estrogén klesajú. Môžeš pociťovať podráždenosť, únavu alebo nafúknutie — typické príznaky PMS.',
    long: 'Ak nedošlo k oplodneniu, žlté teliesko sa rozpadá a hladiny progesterónu aj estrogénu rýchlo klesajú. Telo sa pripravuje na menštruáciu. Podráždenosť, plačlivosť, nafúknutie alebo chuť na sladké sú normálna reakcia na hormonálny pokles — nie slabosť.',
  },
};

// Short phase explanations for legend clicks with important hormone names
const PHASE_EXPLANATIONS: Record<PhaseKey | 'fertility', string> = {
  menstrual: 'Estrogén a progesterón sú na najnižšej úrovni, preto máš menštruáciu. Tvoje telo začína pripravovať nové vajíčko na ďalší cyklus. Dopraj si oddych a jemné pohyby.',
  follicular: 'Estrogén postupne rastie a dodáva ti energiu. Vajíčko dozrieva a ty sa cítiš čoraz lepšie. Ideálny čas na nové projekty a aktívny pohyb.',
  ovulation: 'Estrogén dosiahol najvyšší bod a telo uvoľňuje vajíčko. LH hormón prudko stúpne a spustí ovuláciu — zvyčajne okolo 14. dňa cyklu. Môžeš si všimnúť zmenu výtoku (priezračnejší, elastickejší) a zvýšenú telesnú teplotu. Toto je tvoje prirodzené okno najvyššej energie.',
  luteal: 'Progesterón je na vzostupe a telo sa pripravuje na ďalší cyklus. Môžeš pociťovať zmeny nálady, chute alebo únavu — to je normálne. Dbaj na dostatok spánku a výživu bohatú na horčík.',
  fertility: 'Plodné dni začínajú 5 dní pred ovuláciou a trvajú až deň po nej. Šanca na otehotnenie je najvyššia. Spermie môžu v tele prežiť až 5 dní, vajíčko 24 hodín.',
};

const NUTRITION_TIPS: Record<PhaseKey, string[]> = {
  menstrual: [
    'Dopraj si železo z listovej zeleniny a červeného mäsa',
    'Omega-3 z rýb zmierňuje kŕče a zápal',
    'Teplé nápoje a polievky ukľudňujú',
  ],
  follicular: [
    'Čerstvé ovocie a zelenina podporujú rastúcu energiu',
    'Celozrnné potraviny pre stabilnú hladinu cukru',
    'Ľahké proteíny ako kuracie mäso a ryby',
  ],
  ovulation: [
    'Antioxidanty z bobúľ chránia pred zápalmi',
    'Vláknina podporuje trávenie v tomto období',
    'Zdravé tuky z orechov a avokáda',
  ],
  luteal: [
    'Zložité sacharidy stabilizujú náladu',
    'Vápnik a horčík z orechodov a semienok',
    'Limituj kofeín a alkohol pre lepší spánok',
  ],
};

const MOVEMENT_TIPS: Record<PhaseKey, string[]> = {
  menstrual: [
    'Jemná jóga a strečing uvoľňujú napätie',
    'Prechádzky na čerstvom vzduchu',
    'Dychové cvičenia pre relaxáciu',
  ],
  follicular: [
    'Silový tréning pre rastúcu energiu',
    'Kardio cvičenia podporujú dobrú náladu',
    'Nové športové aktivity',
  ],
  ovulation: [
    'Intenzívne HIIT tréningy',
    'Výzvy a súťaživé športy',
    'Tanec a dynamické pohyby',
  ],
  luteal: [
    'Pilates pre posilnenie jadra',
    'Jemné cvičenia s odporom',
    'Relaxačné aktivity ako plavanie',
  ],
};

const MINDSET_TIPS: Record<PhaseKey, string[]> = {
  menstrual: [
    'Dopraj si odpočinok bez pocitu viny',
    'Meditácia a mindfulness praktiky',
    'Žurnálovanie pocitov a myšlienok',
  ],
  follicular: [
    'Plánovanie nových projektov a cieľov',
    'Sociálne aktivity s priateľkami',
    'Kreativita a učenie sa nového',
  ],
  ovulation: [
    'Dôležité rozhovory a prezentácie',
    'Networking a nové kontakty',
    'Sebavedomé rozhodnutia',
  ],
  luteal: [
    'Sústredenie na seba a sebapéču',
    'Dokončovanie rozpracovaných úloh',
    'Príprava na ďalší cyklus',
  ],
};

// Day Detail Modal Component
interface DayDetailModalProps {
  date: Date;
  phaseInfo: { phase: PhaseKey; isFertile: boolean };
  symptoms: DaySymptoms[];
  onClose: () => void;
  cycleData?: { lastPeriodStart: string | null; cycleLength: number; periodLength: number; ranges: any };
}

function DayDetailModal({ date, phaseInfo, symptoms, onClose, cycleData }: DayDetailModalProps) {
  const { phase, isFertile } = phaseInfo || { phase: 'follicular' as PhaseKey, isFertile: false };

  // Luteal subphase for this specific date
  const modalLutealSubphase = useMemo((): 'early' | 'late' => {
    if (phase !== 'luteal' || !cycleData?.lastPeriodStart) return 'early';
    try {
      const dayForDate = getCurrentCycleDay(cycleData.lastPeriodStart, date, cycleData.cycleLength || 28);
      const { subphase } = getSubphase(dayForDate, cycleData.cycleLength || 28, cycleData.periodLength || 5);
      return subphase === 'late' ? 'late' : 'early';
    } catch { return 'early'; }
  }, [phase, date, cycleData]);

  const modalPhaseName = phase === 'luteal'
    ? LUTEAL_DESCRIPTIONS[modalLutealSubphase].name
    : (PHASE_NAMES[phase] || 'Neznáma fáza');

  const modalPhaseExplanation = phase === 'luteal'
    ? LUTEAL_DESCRIPTIONS[modalLutealSubphase].long
    : PHASE_EXPLANATIONS[phase];

  // Calculate cycle day for this specific date
  const { cycleDay, phaseName } = useMemo(() => {
    if (!cycleData?.lastPeriodStart) {
      return { cycleDay: null, phaseName: null };
    }
    try {
      const calculatedCycleDay = getCurrentCycleDay(cycleData.lastPeriodStart, date, cycleData.cycleLength || 28);
      let currentPhaseName = '';
      if (phase === 'menstrual') {
        currentPhaseName = `${calculatedCycleDay}. deň menštruácie`;
      } else if (phase === 'follicular') {
        currentPhaseName = `Folikulárna fáza`;
      } else if (phase === 'ovulation') {
        currentPhaseName = `Ovulácia`;
      } else if (phase === 'luteal') {
        currentPhaseName = `Luteálna fáza`;
      }
      return { cycleDay: calculatedCycleDay, phaseName: currentPhaseName };
    } catch {
      return { cycleDay: null, phaseName: null };
    }
  }, [date, cycleData, phase]);

  const formattedDate = format(date, 'EEEE, d. MMMM yyyy', { locale: sk });
  
  try { // render guard — does not wrap any hooks
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60"
      onClick={onClose}
    >
      <div className="absolute inset-2 sm:inset-8">
        <div
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full h-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-100 rounded-t-2xl bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 pr-4">
                {formattedDate}
              </h3>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow-sm"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
          
          {/* Full Content - no scrolling needed */}
          <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center flex-wrap gap-3 mb-3">
              <div 
                className="w-5 h-5 rounded-full flex-shrink-0" 
                style={{ backgroundColor: PHASE_COLORS[phase] }}
              />
              <div className="flex flex-col">
                <h4 className="font-semibold text-gray-800 text-base">{modalPhaseName}</h4>
                {phaseName && (
                  <p className="text-sm text-gray-600 font-medium">
                    {phaseName}
                    {cycleDay && cycleDay > 0 && (
                      <span className="text-gray-500 ml-2">• {cycleDay}. deň cyklu</span>
                    )}
                  </p>
                )}
              </div>
              {isFertile && phase !== 'ovulation' && (
                <div className="flex items-center gap-1 text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Plodné dni</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {modalPhaseExplanation}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-base">Príznaky</h4>
            {symptoms.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">😌</div>
                <p className="text-gray-500 text-sm">
                  Žiadne príznaky neboli zaznamenané
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {symptoms.map((symptom, idx) => {
                  console.log('🔍 Processing symptom:', symptom);
                  const symptomDef = SYMPTOMS.find(s => s.label === symptom.symptom);
                  const intensityLabels = INTENSITY_LABELS[symptomDef?.type as keyof typeof INTENSITY_LABELS] || INTENSITY_LABELS.mood;
                  console.log('✅ Symptom def:', symptomDef, 'Labels:', intensityLabels);
                  
                  return (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-2xl flex-shrink-0">{symptomDef?.emoji || '💫'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{symptom.symptom}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {intensityLabels[symptom.intensity] || 'Neznáme'}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              symptom.intensity >= level ? 'bg-[#C27A6E]' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
  } catch (error) {
    console.error('Error in DayDetailModal:', error);
    
    // Fallback UI when there's an error
    return (
      <div 
        className="fixed inset-0 z-[9999] bg-black/60"
        onClick={onClose}
      >
        <div className="absolute inset-2 sm:inset-8">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-4xl mb-4">😅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Niečo sa pokazilo
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
              Nastala chyba pri zobrazovaní detailov dňa. Skús to znovu.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#C27A6E] text-white rounded-xl font-semibold hover:bg-[#B86A5E] transition-colors"
            >
              Zavrieť
            </button>
          </div>
        </div>
      </div>
    );
  }
}

interface CycleCalendarProps {
  currentDay: number;
  cycleLength: number;
  periodLength: number;  // Added periodLength
  phase: { key: PhaseKey; name: string };
  lastPeriodStart: Date | null;  // Can be null if no data
  ranges: ReturnType<typeof getPhaseRanges>;
  today: Date;
}

function CycleCalendar({ currentDay, cycleLength, periodLength, phase, lastPeriodStart, ranges, today }: CycleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedPhase, setSelectedPhase] = useState<PhaseKey | 'fertility' | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Safety check for required props
  if (!today || !ranges || !phase) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Načítava kalendár...</p>
      </div>
    );
  }
  
  // Show message if no period data
  if (!lastPeriodStart) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 mb-4">Pre zobrazenie kalendára pridaj dátum svojej poslednej menštruácie</p>
        <p className="text-xs text-gray-400">Choď do Nastavení a zadaj začiatok cyklu</p>
      </div>
    );
  }
  
  // Helper function to get phase info including fertility overlap
  const getPhaseInfo = (date: Date): { phase: PhaseKey; isFertile: boolean } => {
    try {
      if (!lastPeriodStart) {
        return { phase: 'follicular', isFertile: false };
      }
      
      // lastPeriodStart is already a Date object
      const periodStartDate = lastPeriodStart;
      
      // Calculate days difference from period start
      const daysDiff = Math.floor((date.getTime() - periodStartDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate cycle day (1-based, handles past and future dates)
      let cycleDay;
      if (daysDiff >= 0) {
        cycleDay = (daysDiff % cycleLength) + 1;
      } else {
        const absDaysDiff = Math.abs(daysDiff);
        const remainder = absDaysDiff % cycleLength;
        cycleDay = remainder === 0 ? cycleLength : cycleLength - remainder + 1;
      }
      
      // Get basic phase for this cycle day
      const phaseResult = getPhaseByDay(cycleDay, ranges, cycleLength);
      const basicPhase = phaseResult?.key || 'follicular';
      
      // Check if this day is fertile
      const lastPeriodStartString = format(lastPeriodStart, 'yyyy-MM-dd');
      const isFertile = isFertilityDate(date, lastPeriodStartString, cycleLength);
      
      return {
        phase: basicPhase,
        isFertile: isFertile
      };
    } catch (error) {
      console.error('Error in getPhaseInfo:', error);
      return { phase: 'follicular', isFertile: false };
    }
  };

  // Calendar setup with error handling
  let calendarDays: Date[] = [];
  try {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start week on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  } catch (error) {
    console.error('Error setting up calendar:', error);
    // Fallback to current month only
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      calendarDays.push(new Date(d));
    }
  }
  
  // Week days in Slovak
  const weekDays = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  const getPhaseStyles = (phaseInfo: { phase: PhaseKey; isFertile: boolean }, isToday: boolean, isCurrentMonth: boolean) => {
    const { phase, isFertile } = phaseInfo;
    const baseColor = PHASE_COLORS[phase];
    const fertilityColor = PHASE_COLORS.fertility;
    
    // Check if this phase is selected for highlighting
    const isHighlighted = selectedPhase === phase || (selectedPhase === 'fertility' && isFertile);
    
    // Create background - gradient if fertile + another phase, solid if just one
    let backgroundColor;
    if (isFertile && phase !== 'ovulation') {
      // Kombinovaná farba - diagonal gradient
      backgroundColor = `linear-gradient(45deg, ${baseColor}40 0%, ${baseColor}40 45%, ${fertilityColor}40 55%, ${fertilityColor}40 100%)`;
    } else {
      // Solid farba pre čistú fázu
      backgroundColor = `${baseColor}40`;
    }
    
    if (isToday) {
      return {
        background: backgroundColor,
        color: '#374151',
        fontWeight: '700',  
        fontSize: '0.875rem',  
        border: `2px solid ${baseColor}`,  
        boxShadow: isHighlighted ? `0 0 0 4px ${baseColor}60, 0 0 12px ${baseColor}40` : '0 0 0 1px white inset',
        transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
        zIndex: isHighlighted ? 10 : 1,
      };
    }
    
    if (!isCurrentMonth) {
      // Use correct color for highlighting - fertility color if fertility is selected and day is fertile
      const highlightColor = (selectedPhase === 'fertility' && isFertile) ? fertilityColor : baseColor;
      
      // For highlighted days in non-current month, show more visible styling
      if (isHighlighted) {
        return {
          backgroundColor: `${highlightColor}40`, // More visible than 25%
          color: '#555', // Darker text for better contrast
          fontSize: '0.75rem', 
          transform: 'scale(1.06)', // Slightly larger
          border: `2px solid ${highlightColor}70`, // Stronger border
          boxShadow: `0 0 0 2px ${highlightColor}50, 0 0 6px ${highlightColor}30`, // Double glow
          zIndex: 8,
          borderRadius: '4px', // Rounded for visibility
        };
      }
      
      return {
        backgroundColor: 'rgba(0,0,0,0.02)',  
        color: '#ccc',  
        fontSize: '0.75rem', 
        transform: 'scale(1)',
        border: 'none',
        boxShadow: 'none',
        zIndex: 1,
      };
    }
    
    // Normal days in current month
    return {
      background: backgroundColor,
      color: '#374151',
      border: isHighlighted ? `2px solid ${baseColor}` : `1px solid ${baseColor}60`,
      transform: isHighlighted ? 'scale(1.08)' : 'scale(1)',
      boxShadow: isHighlighted ? `0 0 0 3px ${baseColor}60, 0 0 8px ${baseColor}35` : 'none',
      zIndex: isHighlighted ? 10 : 1,
      position: 'relative',
    };
  };

  return (
    <div className="py-6">
      {/* Calendar Header - redesigned layout */}
      <div className="relative mb-4 px-2">
        {/* Month/Year in top right corner */}
        <div className="absolute top-0 right-0 text-xs text-gray-400">
          {format(currentMonth, 'MMMM yyyy', { locale: sk })}
        </div>
        
        {/* Main phase info centered */}
        <div className="text-center pt-4">
          <div className="text-sm font-medium text-gray-700 mb-4">
            {!lastPeriodStart ? (
              'Pridaj dátum svojej menštruácie'
            ) : phase.key === 'menstrual' ? (
              `Menštruácia ${currentDay} z ${periodLength} dní`
            ) : (
              `${displayPhaseName} · ${currentDay}. deň cyklu`
            )}
          </div>
          
          {/* Phase Description right after header */}
          {lastPeriodStart && (
            <div className="px-4 pb-2">
              <p className="text-sm text-gray-700 leading-relaxed text-center">
                {displayPhaseDescription}
              </p>
            </div>
          )}
        </div>
        
        {/* Navigation arrows */}
        <div className="flex justify-between items-center absolute top-0 left-0 right-0">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Week day headers - subtle */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-xs font-medium text-gray-400 text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - smaller, cleaner */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((date, index) => {
          try {
            const isToday = isSameDay(date, today);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const phaseInfo = getPhaseInfo(date);
            const dayNumber = format(date, 'd');
            
            // Get symptoms for this day
            const dayStr = format(date, 'yyyy-MM-dd');
            const daySymptoms = getSymptomsForDate(dayStr);
            const hasSymptoms = daySymptoms.length > 0;
            
            return (
              <button
                key={`${date.toISOString()}-${index}`}
                onClick={() => setSelectedDate(date)}
                className="relative w-full h-8 flex items-center justify-center text-xs rounded-md transition-all duration-300 ease-out cursor-pointer hover:scale-105"
                style={getPhaseStyles(phaseInfo, isToday, isCurrentMonth)}
              >
                {dayNumber}
                
                {/* Today indicator */}
                {isToday && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-white rounded-full shadow-sm" />
                  </div>
                )}
                
                {/* Symptom indicators */}
                {hasSymptoms && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {daySymptoms.slice(0, 3).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1 h-1 rounded-full ${
                          isToday ? 'bg-white' : 'bg-gray-800'
                        }`}
                      />
                    ))}
                    {daySymptoms.length > 3 && (
                      <span className={`text-[6px] ml-0.5 ${isToday ? 'text-white' : 'text-gray-800'}`}>
                        +{daySymptoms.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          } catch (error) {
            console.error('Error rendering calendar day:', error, date);
            return (
              <div
                key={`error-${index}`}
                className="w-full aspect-square flex items-center justify-center text-sm rounded-lg bg-gray-100"
              >
                ?
              </div>
            );
          }
        })}
      </div>

      {/* Phase legend - clickable */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 px-2">
        {Object.entries(PHASE_NAMES).map(([key, name]) => {
          const phaseKey = key as PhaseKey | 'fertility';
          const isSelected = selectedPhase === phaseKey;
          return (
            <button
              key={key}
              onClick={() => setSelectedPhase(isSelected ? null : phaseKey)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                isSelected 
                  ? 'bg-gray-100 shadow-sm' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: PHASE_COLORS[phaseKey] }}
              />
              <span className={`text-xs ${isSelected ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                {name}
              </span>
            </button>
          );
        })}
        
        {/* Symptoms legend item */}
        <div className="flex items-center gap-1 px-2 py-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-800" />
            <div className="w-1 h-1 rounded-full bg-gray-800" />
            <div className="w-1 h-1 rounded-full bg-gray-800" />
          </div>
          <span className="text-xs text-gray-500">
            Príznaky
          </span>
        </div>
      </div>

      {/* Phase explanation - shows when phase is selected */}
      {selectedPhase && (
        <div className="mt-3 px-4 py-3 bg-gray-50 rounded-lg mx-2">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: PHASE_COLORS[selectedPhase] }}
            />
            <span className="text-sm font-medium text-gray-700">
              {PHASE_NAMES[selectedPhase]}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {PHASE_EXPLANATIONS[selectedPhase]}
          </p>
        </div>
      )}
      
      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          phaseInfo={getPhaseInfo(selectedDate)}
          symptoms={getSymptomsForDate(format(selectedDate, 'yyyy-MM-dd'))}
          onClose={() => setSelectedDate(null)}
          cycleData={lastPeriodStart && ranges ? { 
            lastPeriodStart: format(lastPeriodStart, 'yyyy-MM-dd'), 
            cycleLength: cycleLength || 28, 
            periodLength: periodLength || 5,
            ranges 
          } : undefined}
        />
      )}
    </div>
  );
}

function DailyOverview() {
    const { cycleData } = useCycleData();
    const { lastPeriodStart: lastPeriodStartString, cycleLength, periodLength } = cycleData;
    
    // Convert string to Date (lastPeriodStart is stored as 'yyyy-MM-dd' string)
    // Use explicit parsing to avoid timezone issues
    const lastPeriodStart = lastPeriodStartString 
      ? new Date(lastPeriodStartString + 'T00:00:00') 
      : null;
    
    // Period start parsing complete
    
    const today = useMemo(() => new Date(), []);
    const ranges = useMemo(() => {
      try {
        return getPhaseRanges(cycleLength || 28, periodLength || 5);
      } catch (error) {
        console.error('Error getting phase ranges:', error);
        return { menstrual: [1, 5], follicular: [6, 13], ovulation: [14, 16], luteal: [17, 28] };
      }
    }, [cycleLength, periodLength]);
    
    const currentDay = useMemo(() => {
      try {
        // getCurrentCycleDay expects string, not Date object
        const day = lastPeriodStart && lastPeriodStartString 
          ? getCurrentCycleDay(lastPeriodStartString, today, cycleLength || 28) 
          : 1;
        
        return day;
      } catch (error) {
        console.error('Error getting current day:', error);
        return 1;
      }
    }, [lastPeriodStartString, today, cycleLength]);
    
    const phase = useMemo(() => {
      try {
        return getPhaseByDay(currentDay, ranges, cycleLength || 28);
      } catch (error) {
        console.error('Error getting phase:', error);
        return { key: 'follicular' as PhaseKey, name: 'Folikulárna fáza' };
      }
    }, [currentDay, ranges, cycleLength]);

    // Luteal subphase: early+mid = skorá, late = neskorá
    const lutealSubphase = useMemo((): 'early' | 'late' => {
      if (phase.key !== 'luteal') return 'early';
      try {
        const { subphase } = getSubphase(currentDay, cycleLength || 28, periodLength || 5);
        return subphase === 'late' ? 'late' : 'early';
      } catch {
        return 'early';
      }
    }, [phase.key, currentDay, cycleLength, periodLength]);

    const phaseColor = PHASE_COLORS[phase.key] || PHASE_COLORS.follicular;

    // Display name and short description (subphase-aware for luteal)
    const displayPhaseName = phase.key === 'luteal'
      ? LUTEAL_DESCRIPTIONS[lutealSubphase].name
      : PHASE_NAMES[phase.key];

    const displayPhaseDescription = phase.key === 'luteal'
      ? LUTEAL_DESCRIPTIONS[lutealSubphase].short
      : PHASE_DESCRIPTIONS[phase.key];

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <Clock className="w-6 h-6" style={{ color: phaseColor }} />
        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          Tvoj dnešný prehľad
        </h2>
      </div>

      {/* Main Calendar Card */}
      <GlassCard className="overflow-hidden">
        <CycleCalendar 
          currentDay={currentDay} 
          cycleLength={cycleLength}
          periodLength={periodLength}
          phase={phase}
          lastPeriodStart={lastPeriodStart}
          ranges={ranges}
          today={today}
        />
      </GlassCard>
    </div>
  );
}

// How to Feel Better Section - driven by generators for daily variation
interface HowToFeelBetterProps {
  phase: { key: PhaseKey };
  lastPeriodStart: Date | null;
  currentDay?: number;
  subphase?: string | null;
  phaseRanges?: PhaseRange[];
}

function HowToFeelBetterSection({ phase, lastPeriodStart, currentDay = 1, subphase = null, phaseRanges = [] }: HowToFeelBetterProps) {
  const [breathingOpen, setBreathingOpen] = useState(false);

  const nutrition = useMemo(
    () => generateNutrition(currentDay, phase.key, subphase),
    [currentDay, phase.key, subphase]
  );
  const movement = useMemo(
    () => generateMovement(currentDay, phase.key, subphase, phaseRanges),
    [currentDay, phase.key, subphase, phaseRanges]
  );
  const mindset = useMemo(
    () => generateMindset(currentDay, phase.key, subphase),
    [currentDay, phase.key, subphase]
  );

  if (!lastPeriodStart) return null;

  // Parse movement bullet lines
  const movementLines = movement
    .split('\n')
    .filter(Boolean)
    .map(l => l.replace(/^- /, ''));

  // Parse nutrition paragraphs
  const nutritionParagraphs = nutrition.split('\n\n').filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <span className="text-2xl">✨</span>
          <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Ako sa môžeš cítiť lepšie?
          </h2>
        </div>

        {/* Strava (Nutrition) */}
        <GlassCard>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${colors.strava}20` }}
            >
              <Utensils className="w-6 h-6" style={{ color: colors.strava }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-3" style={{ color: colors.strava }}>
                Strava
              </h3>
              <div className="space-y-2">
                {nutritionParagraphs.map((para, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Pohyb (Movement) */}
        <GlassCard>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${colors.telo}20` }}
            >
              <Activity className="w-6 h-6" style={{ color: colors.telo }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-3" style={{ color: colors.telo }}>
                Pohyb
              </h3>
              <div className="space-y-2">
                {movementLines.map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: colors.telo }} />
                    <p className="text-sm text-gray-700 leading-relaxed">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Myseľ (Mindset) */}
        <GlassCard>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${colors.mysel}20` }}
            >
              <Brain className="w-6 h-6" style={{ color: colors.mysel }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-3" style={{ color: colors.mysel }}>
                Myseľ
              </h3>

              {/* Affirmation */}
              <div className="mb-3 p-3 rounded-xl" style={{ backgroundColor: `${colors.mysel}15` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: colors.mysel }} />
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: colors.mysel }}>Mantra dňa</span>
                </div>
                <p className="text-sm font-medium italic leading-relaxed" style={{ color: colors.textPrimary }}>
                  „{mindset.affirmation}"
                </p>
              </div>

              {/* Reframe */}
              <div className="mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">{mindset.reframe}</p>
              </div>

              {/* Journal prompt */}
              <div className="flex items-start gap-2 mb-3">
                <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.mysel }} />
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide block mb-0.5" style={{ color: colors.mysel }}>Žurnál</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{mindset.journalPrompt}</p>
                </div>
              </div>

              {/* Breathing — collapsible */}
              <button
                onClick={() => setBreathingOpen(o => !o)}
                className="flex items-center gap-2 w-full text-left"
              >
                <Wind className="w-4 h-4 flex-shrink-0" style={{ color: colors.mysel }} />
                <span className="text-xs font-medium uppercase tracking-wide" style={{ color: colors.mysel }}>
                  {mindset.breathing.name}
                </span>
                <span className="ml-auto text-xs" style={{ color: colors.textSecondary }}>
                  {breathingOpen ? '▲' : '▼'}
                </span>
              </button>
              {breathingOpen && (
                <div className="mt-2 pl-6">
                  <p className="text-sm text-gray-600 leading-relaxed">{mindset.breathing.steps}</p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// Export both components
export { HowToFeelBetterSection };
export default DailyOverview;