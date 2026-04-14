import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, X, Droplets, Check, Pencil } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import GlassCard from '../GlassCard';
import DailyOverview, { HowToFeelBetterSection } from './DailyOverview';
import { useCycleData, calculateAverageCycleLength } from '../../../features/cycle/useCycleData';
import { getPhaseRanges, getPhaseByDay, getCurrentCycleDay, getSubphase } from '../../../features/cycle/utils';
import { colors } from '../../../theme/warmDusk';

const SYMPTOMS = [
  { emoji: '⚡', label: 'Energia', type: 'energy' },
  { emoji: '🩸', label: 'Krvácanie', type: 'flow' },
  { emoji: '💧', label: 'Výtok', type: 'spotting' },
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
  custom: ['Žiadne', 'Slabé', 'Mierné', 'Normálne', 'Silné', 'Veľmi silné'],
};

interface SymptomSliderProps {
  symptom: typeof SYMPTOMS[0];
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
  onDelete?: () => void; // Optional delete function for custom symptoms
}

function SymptomSlider({ symptom, value, onChange, onClose, onDelete }: SymptomSliderProps) {
  console.log('🎯 SymptomSlider rendering:', symptom.label, value);
  const labels = INTENSITY_LABELS[symptom.type as keyof typeof INTENSITY_LABELS] || 
                 INTENSITY_LABELS.mood;
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-4">
      <GlassCard className="w-full max-w-sm relative">
        {/* X button in top right corner for custom symptoms */}
        {onDelete && (
          <button
            onClick={() => {
              if (window.confirm('Praješ si tento príznak vymazať?')) {
                onDelete();
                onClose();
              }
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">{symptom.emoji}</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{symptom.label}</h3>
          <p className="text-sm text-gray-600">{labels[value]}</p>
        </div>

        {/* Intensity slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => {
                  onChange(level);
                  // Auto-close slider after short delay for better UX
                  setTimeout(() => onClose(), 800);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  value === level
                    ? 'bg-[#C27A6E] text-white scale-110'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          
          {/* Visual intensity bar */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`flex-1 h-2 rounded-full transition-all ${
                  level <= value ? 'bg-[#C27A6E]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#C27A6E] text-white rounded-xl font-semibold"
        >
          Hotovo
        </button>
      </GlassCard>
    </div>
  );
}

export default function SimplePeriodkaTracker() {
  const navigate = useNavigate();
  const { cycleData, updateCycleData, addPeriodToHistory } = useCycleData();
  // Removed paywall for daily engagement - basic symptom tracking should be free

  const today = useMemo(() => new Date(), []);
  const todayStr = format(today, 'yyyy-MM-dd');

  // ── Prediction engine ────────────────────────────────────────────────────
  const prediction = useMemo(() => {
    if (!cycleData.lastPeriodStart) return null;

    const history = cycleData.history || [];
    const avg = calculateAverageCycleLength(history);
    // Use learned average only after ≥3 complete cycles
    const usingHistory = avg !== null && avg.cycleCount >= 3;
    const effectiveLength = usingHistory ? avg!.average : (cycleData.cycleLength || 28);

    const anchor = new Date(cycleData.lastPeriodStart + 'T00:00:00');
    const nextDate = addDays(anchor, effectiveLength);
    const daysUntil = differenceInDays(nextDate, today);

    return { nextDate, daysUntil, usingHistory, cycleCount: avg?.cycleCount ?? 0 };
  }, [cycleData.lastPeriodStart, cycleData.history, cycleData.cycleLength, today]);

  // ── First-run setup (no period logged yet) ────────────────────────────────
  const isFirstRun = !cycleData.lastPeriodStart;
  const [setupDate, setSetupDate] = useState(() => format(addDays(today, -14), 'yyyy-MM-dd'));
  const [setupCycleLength, setSetupCycleLength] = useState(28);

  const handleFirstRunSetup = useCallback(() => {
    if (!setupDate) return;
    addPeriodToHistory(setupDate);
    updateCycleData({ lastPeriodStart: setupDate, cycleLength: setupCycleLength });
    localStorage.setItem('neome-period-logged-at', Date.now().toString());
  }, [setupDate, setupCycleLength, addPeriodToHistory, updateCycleData]);

  // ── Period started today button ──────────────────────────────────────────
  const periodAlreadyLoggedToday = cycleData.lastPeriodStart === todayStr;
  const [periodJustLogged, setPeriodJustLogged] = useState(false);
  const [showFixIt, setShowFixIt] = useState(false);
  const [fixItDate, setFixItDate] = useState('');

  // ── Late period banner snooze ──────────────────────────────────────────
  const [bannerSnoozed, setBannerSnoozed] = useState(() => {
    const until = localStorage.getItem('neome-period-prompt-snoozed-until');
    return until ? Date.now() < parseInt(until) : false;
  });
  const [bannerShowDatePicker, setBannerShowDatePicker] = useState(false);
  const [bannerDate, setBannerDate] = useState('');

  // Show late period banner: overdue, not logged, not snoozed, max 14 days
  const showLatePeriodBanner = !!(
    prediction &&
    !periodAlreadyLoggedToday &&
    prediction.daysUntil < 0 &&
    Math.abs(prediction.daysUntil) <= 14 &&
    !bannerSnoozed
  );

  const handleSnoozeBanner = useCallback(() => {
    const until = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('neome-period-prompt-snoozed-until', until.toString());
    setBannerSnoozed(true);
    setBannerShowDatePicker(false);
  }, []);

  // Clear snooze when a new day arrives (so the banner reappears tomorrow)
  const handleLogPeriodDate = useCallback((dateStr: string) => {
    addPeriodToHistory(dateStr);
    updateCycleData({ lastPeriodStart: dateStr });
    localStorage.removeItem('neome-period-prompt-snoozed-until');
    setBannerSnoozed(false);
    setBannerShowDatePicker(false);
    setPeriodJustLogged(true);
    setTimeout(() => setPeriodJustLogged(false), 3000);
  }, [updateCycleData, addPeriodToHistory]);

  const handleLogPeriodToday = useCallback(() => {
    handleLogPeriodDate(todayStr);
  }, [todayStr, handleLogPeriodDate]);

  const handleFixDate = useCallback(() => {
    if (!fixItDate) return;
    const history = [...(cycleData.history || [])];
    if (history.length > 0) {
      history[0] = { ...history[0], startDate: fixItDate };
    } else {
      history.push({ startDate: fixItDate });
    }
    // Run auto-calibration on corrected history too
    const avgResult = calculateAverageCycleLength(history);
    const learnedCycleLength = (avgResult && avgResult.cycleCount >= 3)
      ? avgResult.average
      : cycleData.cycleLength;
    updateCycleData({ lastPeriodStart: fixItDate, history, cycleLength: learnedCycleLength });
    setShowFixIt(false);
    setFixItDate('');
  }, [fixItDate, cycleData.history, cycleData.cycleLength, updateCycleData]);

  // Get cycle data for HowToFeelBetterSection
  const lastPeriodStart = cycleData.lastPeriodStart 
    ? new Date(cycleData.lastPeriodStart + 'T00:00:00') 
    : null;
    
  // Calculate current phase, day, subphase and ranges for "How to Feel Better" section
  const { currentPhase, currentDay, subphase, phaseRanges } = useMemo(() => {
    if (!lastPeriodStart) {
      return { currentPhase: { key: 'follicular' as const }, currentDay: 1, subphase: null, phaseRanges: [] };
    }
    try {
      const ranges = getPhaseRanges(cycleData.cycleLength || 28, cycleData.periodLength || 5);
      const day = getCurrentCycleDay(cycleData.lastPeriodStart!, today, cycleData.cycleLength || 28);
      const phase = getPhaseByDay(day, ranges, cycleData.cycleLength || 28);
      const { subphase: sub } = getSubphase(day, cycleData.cycleLength || 28, cycleData.periodLength || 5);
      return { currentPhase: phase, currentDay: day, subphase: sub, phaseRanges: ranges };
    } catch {
      return { currentPhase: { key: 'follicular' as const }, currentDay: 1, subphase: null, phaseRanges: [] };
    }
  }, [lastPeriodStart, cycleData, today]);
  
  // Symptom tracking with intensity
  const symptomKey = `neome-symptoms-${todayStr}`;
  // Custom symptom storage: permanent list of labels + daily active state
  const CUSTOM_SYMPTOMS_DEFS_KEY = 'neome-custom-symptoms';
  const customSymptomsActiveKey = `neome-custom-symptoms-active-${todayStr}`;

  // Persist custom symptom definitions (permanent) and daily active state (per-day)
  const saveCustomSymptoms = (symptoms: Array<{label: string, intensity: number, active: boolean}>) => {
    localStorage.setItem(CUSTOM_SYMPTOMS_DEFS_KEY, JSON.stringify(symptoms.map(s => ({ label: s.label }))));
    localStorage.setItem(customSymptomsActiveKey, JSON.stringify(
      symptoms.filter(s => s.active).map(s => ({ label: s.label, intensity: s.intensity }))
    ));
  };

  // Custom symptoms state — load permanent list, overlay today's active state
  const [customSymptoms, setCustomSymptoms] = useState<Array<{label: string, intensity: number, active: boolean}>>(() => {
    try {
      const defs: {label: string}[] = JSON.parse(localStorage.getItem(CUSTOM_SYMPTOMS_DEFS_KEY) || '[]');
      const active: {label: string, intensity: number}[] = JSON.parse(localStorage.getItem(customSymptomsActiveKey) || '[]');
      return defs.map(({ label }) => {
        const found = active.find(a => a.label === label);
        return { label, intensity: found?.intensity ?? 3, active: !!found };
      });
    } catch { return []; }
  });
  
  const [activeSymptoms, setActiveSymptoms] = useState<boolean[]>(() => {
    try {
      const stored = localStorage.getItem(symptomKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        while (parsed.length < SYMPTOMS.length) parsed.push(false);
        return parsed;
      }
      return Array(SYMPTOMS.length).fill(false);
    } catch { return Array(SYMPTOMS.length).fill(false); }
  });

  const [symptomIntensities, setSymptomIntensities] = useState<number[]>(() => {
    try {
      const log: { date: string; symptom: string; intensity: number }[] = 
        JSON.parse(localStorage.getItem('neome-symptom-log') || '[]');
      return SYMPTOMS.map(s => {
        const entry = log.find(e => e.date === todayStr && e.symptom === s.label);
        return entry ? entry.intensity : 3;
      });
    } catch { return Array(SYMPTOMS.length).fill(3); }
  });

  const [expandedSymptom, setExpandedSymptom] = useState<{type: 'predefined' | 'custom', idx: number} | null>(null);
  const [customSymptomText, setCustomSymptomText] = useState('');

  const saveSymptomToLog = useCallback((symptomLabel: string, intensity: number, active: boolean) => {
    try {
      const log: { date: string; symptom: string; intensity: number; timestamp: string }[] = 
        JSON.parse(localStorage.getItem('neome-symptom-log') || '[]');
      const filtered = log.filter(e => !(e.date === todayStr && e.symptom === symptomLabel));
      
      if (active) {
        filtered.push({ 
          date: todayStr, 
          symptom: symptomLabel, 
          intensity, 
          timestamp: new Date().toISOString() 
        });
      }
      
      localStorage.setItem('neome-symptom-log', JSON.stringify(filtered));
    } catch { /* ignore */ }
  }, [todayStr]);

  const toggleSymptom = useCallback((idx: number) => {
    console.log('🔥 toggleSymptom called:', { idx, symptom: SYMPTOMS[idx].label, isActive: activeSymptoms[idx] });
    
    // TEMPORARILY DISABLE PAYWALL FOR BASIC SYMPTOM TRACKING
    // Daily engagement should be free for user retention
    console.log('✅ Bypassing paywall for daily engagement feature');

    // If symptom is already active, just show slider - don't deactivate
    if (activeSymptoms[idx]) {
      setExpandedSymptom({ type: 'predefined', idx });
      return;
    }

    // If symptom is inactive, activate it and show slider
    setActiveSymptoms(prev => {
      const next = [...prev];
      next[idx] = true;
      localStorage.setItem(symptomKey, JSON.stringify(next));
      setExpandedSymptom({ type: 'predefined', idx });
      saveSymptomToLog(SYMPTOMS[idx].label, symptomIntensities[idx], true);
      return next;
    });
  }, [symptomKey, saveSymptomToLog, symptomIntensities, activeSymptoms]);

  const updateSymptomIntensity = useCallback((idx: number, intensity: number) => {
    if (intensity === 0) {
      // Deactivate symptom when intensity is set to 0
      setActiveSymptoms(prev => {
        const next = [...prev];
        next[idx] = false;
        localStorage.setItem(symptomKey, JSON.stringify(next));
        return next;
      });
      saveSymptomToLog(SYMPTOMS[idx].label, 0, false);
    } else {
      // Activate symptom and set intensity
      setActiveSymptoms(prev => {
        const next = [...prev];
        next[idx] = true;
        localStorage.setItem(symptomKey, JSON.stringify(next));
        return next;
      });
      setSymptomIntensities(prev => {
        const next = [...prev];
        next[idx] = intensity;
        return next;
      });
      saveSymptomToLog(SYMPTOMS[idx].label, intensity, true);
    }
  }, [symptomKey, saveSymptomToLog]);

  // Custom symptom functions
  const addCustomSymptom = useCallback(() => {
    if (!customSymptomText.trim()) return;
    const newSymptom = { label: customSymptomText.trim(), intensity: 3, active: true };
    const updated = [...customSymptoms, newSymptom];
    setCustomSymptoms(updated);
    saveCustomSymptoms(updated);
    saveSymptomToLog(newSymptom.label, newSymptom.intensity, true);
    setCustomSymptomText('');
  }, [customSymptomText, customSymptoms, saveSymptomToLog]);

  const updateCustomSymptom = useCallback((idx: number, intensity: number) => {
    const updated = customSymptoms.map((s, i) => i !== idx ? s : {
      ...s,
      active: intensity > 0,
      intensity: intensity > 0 ? intensity : 3,
    });
    saveSymptomToLog(updated[idx].label, intensity, intensity > 0);
    setCustomSymptoms(updated);
    saveCustomSymptoms(updated);
  }, [customSymptoms, saveSymptomToLog]);

  const removeCustomSymptom = useCallback((idx: number) => {
    const updated = customSymptoms.filter((_, i) => i !== idx);
    setCustomSymptoms(updated);
    saveCustomSymptoms(updated);
  }, [customSymptoms]);

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="rounded-[20px] p-4" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.30)', boxShadow: '0 4px 24px rgba(46,34,24,0.07)' }}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/domov-new')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" style={{ color: colors.periodka }} />
          </button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.periodka}20` }}
            >
              <div className="text-lg">🌸</div>
            </div>
            <h1 className="text-[26px] font-medium leading-tight" style={{ color: colors.periodka, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
              Periodka
            </h1>
          </div>

          <button
            onClick={() => navigate('/kniznica/periodka/nastavenia')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Settings className="h-5 w-5" style={{ color: colors.periodka }} />
          </button>
        </div>
      </div>

      {/* ── First-run setup card — only when no period ever logged ── */}
      {isFirstRun && (
        <div
          className="w-full rounded-2xl px-4 py-5 space-y-4"
          style={{ background: `linear-gradient(135deg, ${colors.periodka}12 0%, ${colors.periodka}06 100%)`, border: `1.5px solid ${colors.periodka}30` }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: colors.periodka }}>Kedy ti naposledy začala menštruácia?</p>
            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>Stačí odhadom — kedykoľvek to môžeš upraviť.</p>
          </div>

          <input
            type="date"
            value={setupDate}
            onChange={(e) => setSetupDate(e.target.value)}
            max={todayStr}
            min={format(addDays(today, -90), 'yyyy-MM-dd')}
            className="w-full p-3 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.7)', color: colors.textPrimary, border: `1px solid ${colors.periodka}25` }}
          />

          <div>
            <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>Aká je zvyčajne dĺžka tvojho cyklu?</p>
            <div className="flex gap-1.5 flex-wrap">
              {[24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map((v) => (
                <button
                  key={v}
                  onClick={() => setSetupCycleLength(v)}
                  className="w-9 h-9 rounded-lg text-xs font-medium transition-all active:scale-95"
                  style={{
                    background: setupCycleLength === v ? colors.periodka : 'rgba(255,255,255,0.6)',
                    color: setupCycleLength === v ? 'white' : colors.textSecondary,
                    border: `1px solid ${setupCycleLength === v ? colors.periodka : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFirstRunSetup}
            disabled={!setupDate}
            className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all active:scale-[0.98]"
            style={{ background: colors.periodka, color: 'white' }}
          >
            Začať sledovať cyklus
          </button>
        </div>
      )}

      {/* ── Predictive banner ── */}
      {prediction && !periodAlreadyLoggedToday && prediction.daysUntil >= 0 && prediction.daysUntil <= 7 && (
        <div
          className="w-full rounded-2xl px-4 py-3"
          style={{
            background: prediction.daysUntil <= 2
              ? `linear-gradient(135deg, ${colors.periodka}18 0%, ${colors.periodka}08 100%)`
              : 'rgba(255,255,255,0.3)',
            border: `1px solid ${colors.periodka}${prediction.daysUntil <= 2 ? '40' : '20'}`,
          }}
        >
          <p className="text-sm text-center font-medium" style={{ color: colors.periodka }}>
            🌸 Orientačne —{' '}
            {prediction.daysUntil === 0
              ? 'menštruácia sa očakáva dnes'
              : prediction.daysUntil === 1
              ? 'menštruácia sa očakáva zajtra'
              : `menštruácia sa očakáva o ${prediction.daysUntil} ${prediction.daysUntil <= 4 ? 'dni' : 'dní'}`}
          </p>
          <p className="text-xs text-center mt-0.5" style={{ color: colors.textSecondary }}>
            {prediction.usingHistory
              ? `Na základe tvojich posledných ${prediction.cycleCount} cyklov`
              : 'Na základe tebou zadanej dĺžky cyklu'}
          </p>
        </div>
      )}

      {/* Late period — actionable banner */}
      {showLatePeriodBanner && (
        <div
          className="w-full rounded-2xl px-4 py-4 space-y-3"
          style={{ background: `linear-gradient(135deg, ${colors.periodka}14 0%, ${colors.periodka}07 100%)`, border: `1.5px solid ${colors.periodka}35` }}
        >
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: colors.periodka }}>
              Menštruácia sa očakávala pred {Math.abs(prediction!.daysUntil)} {Math.abs(prediction!.daysUntil) === 1 ? 'dňom' : 'dňami'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
              Začala ti už menštruácia?
            </p>
          </div>

          {!bannerShowDatePicker ? (
            <div className="flex gap-2">
              <button
                onClick={handleLogPeriodToday}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: colors.periodka, color: 'white' }}
              >
                Áno, dnes
              </button>
              <button
                onClick={handleSnoozeBanner}
                className="flex-1 py-2.5 rounded-xl text-sm transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.55)', color: colors.textSecondary, border: `1px solid rgba(0,0,0,0.08)` }}
              >
                Nie, ešte nie
              </button>
            </div>
          ) : null}

          <button
            onClick={() => { setBannerShowDatePicker(p => !p); setBannerDate(todayStr); }}
            className="w-full text-xs text-center underline"
            style={{ color: colors.textSecondary }}
          >
            {bannerShowDatePicker ? 'Zrušiť' : 'Začala skôr? Zadaj dátum'}
          </button>

          {bannerShowDatePicker && (
            <div className="space-y-2">
              <input
                type="date"
                value={bannerDate}
                onChange={(e) => setBannerDate(e.target.value)}
                max={todayStr}
                min={format(addDays(today, -14), 'yyyy-MM-dd')}
                className="w-full p-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.7)', color: colors.textPrimary }}
              />
              <button
                onClick={() => { if (bannerDate) handleLogPeriodDate(bannerDate); }}
                disabled={!bannerDate}
                className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: colors.periodka, color: 'white' }}
              >
                Uložiť dátum
              </button>
            </div>
          )}
        </div>
      )}

      {/* Late period — past snooze limit, silent notice */}
      {prediction && !periodAlreadyLoggedToday && prediction.daysUntil < 0 && !showLatePeriodBanner && (
        <div
          className="w-full rounded-2xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.3)', border: `1px solid ${colors.periodka}20` }}
        >
          <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
            Orientačne — menštruácia sa očakávala pred {Math.abs(prediction.daysUntil)} {Math.abs(prediction.daysUntil) === 1 ? 'dňom' : 'dňami'}
          </p>
        </div>
      )}

      {/* ── One-tap log button ── */}
      {!periodAlreadyLoggedToday && (
        <div className="space-y-2">
          <button
            onClick={handleLogPeriodToday}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all active:scale-[0.98]"
            style={{
              background: periodJustLogged
                ? 'rgba(122,158,120,0.15)'
                : `linear-gradient(135deg, ${colors.periodka}22 0%, ${colors.periodka}11 100%)`,
              border: `1.5px solid ${periodJustLogged ? '#7A9E78' : colors.periodka}55`,
            }}
          >
            {periodJustLogged ? (
              <>
                <Check className="w-5 h-5" style={{ color: '#7A9E78' }} />
                <span className="font-semibold text-sm" style={{ color: '#7A9E78' }}>
                  Zaznamenaná! Cyklus sledujeme ďalej 🌸
                </span>
              </>
            ) : (
              <>
                <Droplets className="w-5 h-5" style={{ color: colors.periodka }} />
                <span className="font-semibold text-sm" style={{ color: colors.periodka }}>
                  Dnes mi začala menštruácia
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Already logged today ── */}
      {periodAlreadyLoggedToday && (
        <div className="space-y-2">
          <div
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl"
            style={{ background: 'rgba(194,122,110,0.08)', border: '1px solid rgba(194,122,110,0.2)' }}
          >
            <Check className="w-4 h-4" style={{ color: colors.periodka }} />
            <span className="text-sm font-medium" style={{ color: colors.periodka }}>
              Menštruácia zaznamenaná na dnes
            </span>
          </div>

          {/* Fix-it link — always available */}
          {!showFixIt && (
            <button
              onClick={() => { setShowFixIt(true); setFixItDate(cycleData.lastPeriodStart || todayStr); }}
              className="w-full flex items-center justify-center gap-1.5 py-2"
            >
              <Pencil className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} />
              <span className="text-xs underline" style={{ color: colors.textSecondary }}>
                Nebol to presne dnes? Opraviť dátum
              </span>
            </button>
          )}

          {/* Fix-it inline date picker */}
          {showFixIt && (
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(194,122,110,0.2)' }}
            >
              <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                Kedy skutočne začala menštruácia?
              </p>
              <input
                type="date"
                value={fixItDate}
                onChange={(e) => setFixItDate(e.target.value)}
                max={todayStr}
                min={format(addDays(today, -14), 'yyyy-MM-dd')}
                className="w-full p-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.7)', color: colors.textPrimary }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleFixDate}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: colors.periodka, color: 'white' }}
                >
                  Uložiť
                </button>
                <button
                  onClick={() => setShowFixIt(false)}
                  className="px-4 py-2.5 rounded-xl text-sm"
                  style={{ background: 'rgba(0,0,0,0.06)', color: colors.textSecondary }}
                >
                  Zrušiť
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Daily Overview */}
      <DailyOverview />

      {/* Symptom Check-in */}
      <div className="space-y-3">
        <div className="px-1">
          <h2 className="text-[15px] font-medium" style={{ color: colors.textPrimary, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            Ako sa dnes cítiš?
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: colors.textSecondary }}>Zaznač si príznaky jedným ťuknutím</p>
        </div>

        <GlassCard>
          <div className="grid grid-cols-3 gap-2">
            {[
              ...SYMPTOMS.map((symptom, idx) => ({
                ...symptom,
                idx,
                isCustom: false,
                active: activeSymptoms[idx],
                intensity: symptomIntensities[idx],
                emoji: symptom.emoji
              })),
              ...customSymptoms.map((symptom, idx) => ({
                label: symptom.label,
                type: 'custom',
                idx,
                isCustom: true,
                active: symptom.active,
                intensity: symptom.intensity,
                emoji: '✦'
              }))
            ]
              .sort((a, b) => {
                if (a.active && b.active) return b.intensity - a.intensity;
                if (a.active && !b.active) return -1;
                if (!a.active && b.active) return 1;
                if (a.isCustom && !b.isCustom) return -1;
                if (!a.isCustom && b.isCustom) return 1;
                return a.idx - b.idx;
              })
              .map((item) => (
                <button
                  key={`${item.isCustom ? 'custom' : 'predefined'}-${item.idx}`}
                  onClick={() => setExpandedSymptom({ type: item.isCustom ? 'custom' : 'predefined', idx: item.idx })}
                  className="flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 rounded-xl transition-all active:scale-95"
                  style={{
                    background: item.active
                      ? 'rgba(194,122,110,0.12)'
                      : 'rgba(255,255,255,0.35)',
                    border: item.active
                      ? '1.5px solid rgba(194,122,110,0.30)'
                      : '1.5px solid rgba(255,255,255,0.50)',
                  }}
                >
                  <span className="text-xl leading-none">{item.emoji}</span>
                  <span className="text-[10px] font-medium leading-tight text-center mt-0.5" style={{ color: item.active ? colors.periodka : colors.textPrimary }}>{item.label}</span>
                  {item.active && (
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="w-1 h-1 rounded-full"
                          style={{ background: level <= item.intensity ? colors.periodka : 'rgba(46,34,24,0.12)' }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
          </div>

          {/* Custom symptom input */}
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.40)' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSymptomText}
                onChange={(e) => setCustomSymptomText(e.target.value)}
                placeholder="Vlastný príznak..."
                className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
                style={{ background: 'rgba(255,255,255,0.50)', color: colors.textPrimary, border: '1px solid rgba(255,255,255,0.60)' }}
                onKeyDown={(e) => { if (e.key === 'Enter') addCustomSymptom(); }}
              />
              <button
                onClick={addCustomSymptom}
                disabled={!customSymptomText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-colors disabled:opacity-40"
                style={{ background: colors.periodka, color: 'white' }}
              >
                Pridať
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* How to Feel Better Section - moved here for better UX flow */}
      <HowToFeelBetterSection
        phase={currentPhase}
        lastPeriodStart={lastPeriodStart}
        currentDay={currentDay}
        subphase={subphase}
        phaseRanges={phaseRanges}
      />

      {/* Symptom Intensity Slider */}
      {expandedSymptom !== null && (
        <>
          {expandedSymptom.type === 'predefined' ? (
            <SymptomSlider
              symptom={SYMPTOMS[expandedSymptom.idx]}
              value={activeSymptoms[expandedSymptom.idx] ? symptomIntensities[expandedSymptom.idx] : 0}
              onChange={(value) => updateSymptomIntensity(expandedSymptom.idx, value)}
              onClose={() => setExpandedSymptom(null)}
            />
          ) : (
            <SymptomSlider
              symptom={{
                emoji: '📝',
                label: customSymptoms[expandedSymptom.idx]?.label || 'Vlastný príznak',
                type: 'custom'
              }}
              value={customSymptoms[expandedSymptom.idx]?.active 
                ? customSymptoms[expandedSymptom.idx]?.intensity || 3
                : 0
              }
              onChange={(value) => updateCustomSymptom(expandedSymptom.idx, value)}
              onClose={() => setExpandedSymptom(null)}
              onDelete={() => removeCustomSymptom(expandedSymptom.idx)}
            />
          )}
        </>
      )}

    </div>
  );
}