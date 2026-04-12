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

  // ── Period started today button ──────────────────────────────────────────
  const periodAlreadyLoggedToday = cycleData.lastPeriodStart === todayStr;
  const [periodJustLogged, setPeriodJustLogged] = useState(false);
  const [showFixIt, setShowFixIt] = useState(false);
  const [fixItDate, setFixItDate] = useState('');

  // 48-hour fix-it window
  const canFixIt = useMemo(() => {
    const ts = localStorage.getItem('neome-period-logged-at');
    return ts ? (Date.now() - parseInt(ts)) < 48 * 60 * 60 * 1000 : false;
  }, [periodJustLogged, periodAlreadyLoggedToday]);

  const handleLogPeriodToday = useCallback(() => {
    addPeriodToHistory(todayStr);
    updateCycleData({ lastPeriodStart: todayStr });
    localStorage.setItem('neome-period-logged-at', Date.now().toString());
    setPeriodJustLogged(true);
    setTimeout(() => setPeriodJustLogged(false), 3000);
  }, [todayStr, updateCycleData, addPeriodToHistory]);

  const handleFixDate = useCallback(() => {
    if (!fixItDate) return;
    // Update history: replace the most recent entry with the corrected date
    const history = [...(cycleData.history || [])];
    if (history.length > 0) {
      history[0] = { ...history[0], startDate: fixItDate };
    } else {
      history.push({ startDate: fixItDate });
    }
    updateCycleData({ lastPeriodStart: fixItDate, history });
    setShowFixIt(false);
    setFixItDate('');
  }, [fixItDate, cycleData.history, updateCycleData]);

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
  const customSymptomsKey = `neome-custom-symptoms-${todayStr}`;
  
  // Custom symptoms state
  const [customSymptoms, setCustomSymptoms] = useState<Array<{label: string, intensity: number, active: boolean}>>(() => {
    try {
      const stored = localStorage.getItem(customSymptomsKey);
      return stored ? JSON.parse(stored) : [];
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
      console.log('✅ Showing slider for active symptom');
      setExpandedSymptom(idx);
      return;
    }

    // If symptom is inactive, activate it and show slider
    console.log('✅ Activating symptom and showing slider');
    setActiveSymptoms(prev => {
      const next = [...prev];
      next[idx] = true; // Always activate, never deactivate on click
      localStorage.setItem(symptomKey, JSON.stringify(next));
      
      setExpandedSymptom(idx);
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
    
    const newSymptom = {
      label: customSymptomText.trim(),
      intensity: 3,
      active: true
    };
    
    const updatedCustomSymptoms = [...customSymptoms, newSymptom];
    setCustomSymptoms(updatedCustomSymptoms);
    localStorage.setItem(customSymptomsKey, JSON.stringify(updatedCustomSymptoms));
    
    saveSymptomToLog(newSymptom.label, newSymptom.intensity, true);
    setCustomSymptomText('');
  }, [customSymptomText, customSymptoms, customSymptomsKey, saveSymptomToLog]);

  const updateCustomSymptom = useCallback((idx: number, intensity: number) => {
    const updatedSymptoms = [...customSymptoms];
    if (intensity === 0) {
      // Deactivate custom symptom when intensity is set to 0
      updatedSymptoms[idx].active = false;
      updatedSymptoms[idx].intensity = 3; // Reset to default for next activation
      saveSymptomToLog(updatedSymptoms[idx].label, 0, false);
    } else {
      // Activate custom symptom and set intensity
      updatedSymptoms[idx].active = true;
      updatedSymptoms[idx].intensity = intensity;
      saveSymptomToLog(updatedSymptoms[idx].label, intensity, true);
    }
    setCustomSymptoms(updatedSymptoms);
    localStorage.setItem(customSymptomsKey, JSON.stringify(updatedSymptoms));
  }, [customSymptoms, customSymptomsKey, saveSymptomToLog]);

  const toggleCustomSymptom = useCallback((idx: number) => {
    const updatedSymptoms = [...customSymptoms];
    updatedSymptoms[idx].active = !updatedSymptoms[idx].active;
    setCustomSymptoms(updatedSymptoms);
    localStorage.setItem(customSymptomsKey, JSON.stringify(updatedSymptoms));
    
    if (updatedSymptoms[idx].active) {
      saveSymptomToLog(updatedSymptoms[idx].label, updatedSymptoms[idx].intensity, true);
    }
  }, [customSymptoms, customSymptomsKey, saveSymptomToLog]);

  const removeCustomSymptom = useCallback((idx: number) => {
    const updatedSymptoms = customSymptoms.filter((_, i) => i !== idx);
    setCustomSymptoms(updatedSymptoms);
    localStorage.setItem(customSymptomsKey, JSON.stringify(updatedSymptoms));
  }, [customSymptoms, customSymptomsKey]);

  const deactivateSymptom = useCallback((idx: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the main button click
    
    setActiveSymptoms(prev => {
      const next = [...prev];
      next[idx] = false;
      localStorage.setItem(symptomKey, JSON.stringify(next));
      
      saveSymptomToLog(SYMPTOMS[idx].label, 0, false);
      setExpandedSymptom(null); // Close slider if open
      
      return next;
    });
  }, [symptomKey, saveSymptomToLog]);

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
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
            <h1 className="text-2xl font-bold" style={{ color: colors.periodka }}>
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
              : `menštruácia sa očakáva o ${prediction.daysUntil} dni`}
          </p>
          <p className="text-xs text-center mt-0.5" style={{ color: colors.textSecondary }}>
            {prediction.usingHistory
              ? `Na základe tvojich posledných ${prediction.cycleCount} cyklov`
              : 'Na základe tebou zadanej dĺžky cyklu'}
          </p>
        </div>
      )}

      {/* Late period notice */}
      {prediction && !periodAlreadyLoggedToday && prediction.daysUntil < 0 && (
        <div
          className="w-full rounded-2xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.3)', border: `1px solid ${colors.periodka}20` }}
        >
          <p className="text-sm text-center" style={{ color: colors.textSecondary }}>
            Orientačne — menštruácia sa očakávala pred {Math.abs(prediction.daysUntil)} dňami
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

          {/* Fix-it link — 48h window */}
          {canFixIt && !showFixIt && (
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

      {/* Symptom Check-in - moved higher for better UX */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-1">
          <span className="text-xl">📝</span>
          <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            Zaznač si, ako sa dnes naozaj cítiš
          </h2>
        </div>

        <GlassCard>
          <div className="flex flex-col gap-2">
            {/* Combine predefined and custom symptoms for sorting */}
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
                emoji: '📝'
              }))
            ]
              .sort((a, b) => {
                // Active symptoms first, sorted by intensity (highest first)
                if (a.active && b.active) {
                  return b.intensity - a.intensity;
                }
                if (a.active && !b.active) return -1;
                if (!a.active && b.active) return 1;
                
                // Inactive symptoms: custom first, then original order
                if (!a.active && !b.active) {
                  if (a.isCustom && !b.isCustom) return -1;
                  if (!a.isCustom && b.isCustom) return 1;
                  return a.idx - b.idx;
                }
                return 0;
              })
              .map((item) => (
                <button
                  key={`${item.isCustom ? 'custom' : 'predefined'}-${item.idx}`}
                  onClick={() => {
                    // Always open slider immediately when clicking any symptom
                    setExpandedSymptom({
                      type: item.isCustom ? 'custom' : 'predefined',
                      idx: item.idx
                    });
                  }}
                  className={`p-2 rounded-lg text-left transition-all ${
                    item.active
                      ? 'bg-[#C27A6E]/20 border-2 border-[#C27A6E]/30'
                      : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <div>
                        <p className="text-xs font-medium text-gray-800 leading-tight">{item.label}</p>
                        {item.active && (
                          <p className="text-xs text-gray-500 leading-tight">
                            {item.isCustom 
                              ? `Intenzita ${item.intensity}/5`
                              : (INTENSITY_LABELS[item.type as keyof typeof INTENSITY_LABELS]?.[item.intensity - 1] || 'Normálne')
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.active && level <= item.intensity ? 'bg-[#C27A6E]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {/* Expandable additional symptoms */}
          <details className="mt-3">
            <summary className="text-xs text-gray-500 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              + Zadaj vlastný príznak
            </summary>
            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSymptomText}
                  onChange={(e) => setCustomSymptomText(e.target.value)}
                  placeholder="Napíš svoj príznak..."
                  className="flex-1 p-2 border border-gray-200 rounded-lg text-xs"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addCustomSymptom();
                    }
                  }}
                />
                <button
                  onClick={addCustomSymptom}
                  disabled={!customSymptomText.trim()}
                  className="px-3 py-2 bg-[#C27A6E] text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#B8694A] transition-colors"
                >
                  Pridať
                </button>
              </div>
            </div>
          </details>
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