import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format, isSameDay, isSameMonth, isAfter, isBefore,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, subDays,
} from 'date-fns';
import { sk } from 'date-fns/locale';
import GlassCard from '../GlassCard';
import { useCycleData } from '../../../features/cycle/useCycleData';
import PeriodOverview from './PeriodOverview';
import {
  getPhaseRanges, getPhaseByDay, getCurrentCycleDay,
  getNextPeriodDate, getFertilityDates, getOvulationDate, formatDateSk,
} from '../../../features/cycle/utils';
import { suggestForDay, getMoodEmoji } from '../../../features/cycle/suggestions';
import type { PhaseKey } from '../../../features/cycle/types';
import { usePaywall } from '../../../hooks/useSubscriptionStatus';
import PaywallModal from '../subscription/PaywallModal';

const PHASE_COLORS: Record<PhaseKey, string> = {
  menstrual: '#C27A6E',
  follicular: '#7A9E78',
  ovulation: '#A8848B',
  luteal: '#B8864A',
};

const PHASE_NAMES: Record<PhaseKey, string> = {
  menstrual: 'Menštruácia',
  follicular: 'Folikulárna fáza',
  ovulation: 'Ovulácia',
  luteal: 'Luteálna fáza',
};

const PHASE_MESSAGES: Record<PhaseKey, string> = {
  menstrual: 'Tvoje telo regeneruje — dopraj si pokoj a teplo 🌸',
  follicular: 'Energia rastie — skvelý čas na nové výzvy! 🌱',
  ovulation: 'Si na vrchole energie — využi to naplno! ✨',
  luteal: 'Spomaľ a počúvaj svoje telo — zaslúžiš si starostlivosť 🌙',
};

const EXERCISE_REC: Record<PhaseKey, string> = {
  menstrual: 'Jemná joga alebo strečing',
  follicular: 'Silový tréning, HIIT',
  ovulation: 'Najvyšší výkon — intenzívne cvičenie',
  luteal: 'Pilates, jemný pohyb',
};

const SYMPTOMS = [
  { emoji: '😊', label: 'Nálada' },
  { emoji: '⚡', label: 'Energia' },
  { emoji: '🩸', label: 'Kŕče' },
  { emoji: '😴', label: 'Spánok' },
  { emoji: '🫄', label: 'Nadúvanie' },
  { emoji: '🤕', label: 'Bolesť hlavy' },
  { emoji: '😰', label: 'Úzkosť' },
  { emoji: '🍫', label: 'Chuť na sladké' },
  { emoji: '😢', label: 'Plačlivosť' },
  { emoji: '🔥', label: 'Akné' },
  { emoji: '💧', label: 'Opuchy' },
  { emoji: '😤', label: 'Podráždenosť' },
];

const WEEKDAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

function MiniCalendar({ onSelect, onClose }: { onSelect: (d: Date) => void; onClose: () => void }) {
  const today = useMemo(() => new Date(), []);
  const minDate = useMemo(() => subDays(today, 90), [today]);
  const [month, setMonth] = useState(today);
  const [selected, setSelected] = useState<Date | null>(null);

  const days = useMemo(() => {
    const ms = startOfMonth(month);
    const me = endOfMonth(month);
    const gs = startOfWeek(ms, { weekStartsOn: 1 });
    const ge = endOfWeek(me, { weekStartsOn: 1 });
    const arr: Date[] = [];
    let d = gs;
    while (!isAfter(d, ge)) { arr.push(d); d = addDays(d, 1); }
    return arr;
  }, [month]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5" onClick={onClose}>
      <GlassCard className="w-full max-w-sm" onClick={e => (e as any).stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(subMonths(month, 1))} className="p-2 bg-white rounded-full shadow-sm border border-gray-100"><ChevronLeft className="w-5 h-5 text-[#6B4C3B]" /></button>
          <span className="text-[14px] font-medium text-[#2E2218] capitalize">{format(month, 'LLLL yyyy', { locale: sk })}</span>
          <button onClick={() => { if (isBefore(startOfMonth(addMonths(month, 1)), today)) setMonth(addMonths(month, 1)); }} className="p-2 bg-white rounded-full shadow-sm border border-gray-100"><ChevronRight className="w-5 h-5 text-[#6B4C3B]" /></button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(w => <div key={w} className="text-center text-[12px] text-[#A0907E] font-medium py-1">{w}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const inMonth = isSameMonth(day, month);
            const isT = isSameDay(day, today);
            const isSel = selected && isSameDay(day, selected);
            const dis = isAfter(day, today) || isBefore(day, minDate) || !inMonth;
            return (
              <button key={i} disabled={dis} onClick={() => setSelected(day)}
                className="aspect-square flex items-center justify-center text-[13px] rounded-full m-0.5"
                style={{ color: dis ? '#ccc' : isSel ? '#fff' : '#2E2218', background: isSel ? '#6B4C3B' : 'transparent', border: isT && !isSel ? '1.5px solid #6B4C3B' : '1.5px solid transparent', fontWeight: isSel || isT ? 600 : 400 }}
              >{format(day, 'd')}</button>
            );
          })}
        </div>
        <button
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className="w-full mt-3 py-2.5 rounded-2xl text-[14px] font-semibold text-white"
          style={{ background: '#6B4C3B', opacity: selected ? 1 : 0.4 }}
        >Uložiť</button>
      </GlassCard>
    </div>
  );
}

export default function PeriodkaTracker() {
  const navigate = useNavigate();
  const {
    cycleData, setLastPeriodStart, setCycleLength, setPeriodLength, updateCycleData,
  } = useCycleData();

  const [showSettings, setShowSettings] = useState(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const { showPaywall, isOpen: paywallOpen, closePaywall, feature: paywallFeature, title: paywallTitle } = usePaywall();

  const today = useMemo(() => new Date(), []);
  const { cycleLength, periodLength, lastPeriodStart } = cycleData;

  const ranges = useMemo(() => getPhaseRanges(cycleLength, periodLength), [cycleLength, periodLength]);
  const currentDay = useMemo(() => lastPeriodStart ? getCurrentCycleDay(lastPeriodStart, today, cycleLength) : 1, [lastPeriodStart, today, cycleLength]);
  const displayDay = Math.min(currentDay, cycleLength);
  const phase = useMemo(() => getPhaseByDay(currentDay, ranges, cycleLength), [currentDay, ranges, cycleLength]);
  const suggestion = useMemo(() => suggestForDay(currentDay, ranges, cycleLength), [currentDay, ranges, cycleLength]);

  const phaseColor = PHASE_COLORS[phase.key];
  const progressPct = Math.min(100, ((displayDay - 1) / (cycleLength - 1)) * 100);

  // Key dates
  const nextPeriod = lastPeriodStart ? getNextPeriodDate(lastPeriodStart, cycleLength) : null;
  const fertility = lastPeriodStart ? getFertilityDates(lastPeriodStart, cycleLength) : null;
  const ovulation = lastPeriodStart ? getOvulationDate(lastPeriodStart, cycleLength) : null;

  // Symptom log with intensity
  const todayStr = format(today, 'yyyy-MM-dd');
  const symptomKey = `neome-symptoms-${todayStr}`;
  const [activeSymptoms, setActiveSymptoms] = useState<boolean[]>(() => {
    try {
      const stored = localStorage.getItem(symptomKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Extend if symptoms were added
        while (parsed.length < SYMPTOMS.length) parsed.push(false);
        return parsed;
      }
      return Array(SYMPTOMS.length).fill(false);
    } catch { return Array(SYMPTOMS.length).fill(false); }
  });
  const [symptomIntensities, setSymptomIntensities] = useState<number[]>(() => {
    try {
      const log: { date: string; symptom: string; intensity: number }[] = JSON.parse(localStorage.getItem('neome-symptom-log') || '[]');
      return SYMPTOMS.map(s => {
        const entry = log.find(e => e.date === format(new Date(), 'yyyy-MM-dd') && e.symptom === s.label);
        return entry ? entry.intensity : 3;
      });
    } catch { return Array(SYMPTOMS.length).fill(3); }
  });
  const [expandedSymptom, setExpandedSymptom] = useState<number | null>(null);

  const saveSymptomToLog = useCallback((symptomLabel: string, intensity: number, active: boolean) => {
    try {
      const log: { date: string; symptom: string; intensity: number; timestamp: string }[] = JSON.parse(localStorage.getItem('neome-symptom-log') || '[]');
      const filtered = log.filter(e => !(e.date === todayStr && e.symptom === symptomLabel));
      if (active) {
        filtered.push({ date: todayStr, symptom: symptomLabel, intensity, timestamp: new Date().toISOString() });
      }
      localStorage.setItem('neome-symptom-log', JSON.stringify(filtered));
    } catch { /* ignore */ }
  }, [todayStr]);

  const toggleSymptom = useCallback((idx: number) => {
    // Check if paywall should be shown for period tracker
    if (showPaywall('period_tracker', 'Ukladanie symptómov')) {
      return; // Paywall shown, block the action
    }

    setActiveSymptoms(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      localStorage.setItem(symptomKey, JSON.stringify(next));
      if (next[idx]) {
        setExpandedSymptom(idx);
        saveSymptomToLog(SYMPTOMS[idx].label, symptomIntensities[idx], true);
      } else {
        setExpandedSymptom(null);
        saveSymptomToLog(SYMPTOMS[idx].label, 0, false);
      }
      return next;
    });
  }, [symptomKey, symptomIntensities, saveSymptomToLog, showPaywall]);

  const updateIntensity = useCallback((idx: number, value: number) => {
    setSymptomIntensities(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    saveSymptomToLog(SYMPTOMS[idx].label, value, true);
  }, [saveSymptomToLog]);

  // Settings state
  const [settingsCycle, setSettingsCycle] = useState(cycleLength);
  const [settingsPeriod, setSettingsPeriod] = useState(periodLength);

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/kniznica')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-semibold text-[#2E2218]">Periodka</h1>
        </div>
        <button onClick={() => { setSettingsCycle(cycleLength); setSettingsPeriod(periodLength); setShowSettings(true); }} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
          <Settings className="w-5 h-5 text-[#A0907E]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Period Tracking Overview */}
      <PeriodOverview />

      {/* Hero Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-[14px] font-semibold" style={{ color: phaseColor }}>
          {PHASE_NAMES[phase.key]}
        </p>
        <p className="text-[13px] text-[#8B7560] mt-1 leading-snug">
          {PHASE_MESSAGES[phase.key]}
        </p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-semibold text-[#2E2218]">Deň {displayDay}</span>
          <span className="text-[14px] text-[#A0907E]">/ {cycleLength}</span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-black/5 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: phaseColor }} />
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-[12px] text-[#A0907E] mb-2">Fázy cyklu</p>
        <div className="flex h-3 rounded-full overflow-hidden">
          {ranges.map(r => {
            const len = r.end - r.start + 1;
            const pct = (len / cycleLength) * 100;
            return <div key={r.key} style={{ width: `${pct}%`, background: PHASE_COLORS[r.key] }} />;
          })}
        </div>
        {/* Marker */}
        <div className="relative h-3 mt-0.5">
          <div
            className="absolute w-0 h-0"
            style={{
              left: `${progressPct}%`,
              transform: 'translateX(-50%)',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: `6px solid ${phaseColor}`,
            }}
          />
        </div>
        {/* Labels */}
        <div className="flex mt-1">
          {ranges.map(r => {
            const len = r.end - r.start + 1;
            const pct = (len / cycleLength) * 100;
            return (
              <div key={r.key} className="text-center" style={{ width: `${pct}%` }}>
                <span className="text-[10px] text-[#A0907E]">{r.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Dates */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-[15px] font-semibold text-[#2E2218] mb-3">Dôležité dátumy</p>
        <div className="space-y-2.5">
          {nextPeriod && (
            <DateRow color={PHASE_COLORS.menstrual} label="Ďalšia menštruácia" value={formatDateSk(nextPeriod)} />
          )}
          {fertility && (
            <DateRow color={PHASE_COLORS.ovulation} label="Plodné okno" value={`${formatDateSk(fertility.startDate)} – ${formatDateSk(fertility.endDate)}`} />
          )}
          {ovulation && (
            <DateRow color={PHASE_COLORS.ovulation} label="Ovulácia" value={formatDateSk(ovulation)} />
          )}
        </div>
      </div>

      {/* Today's Insights */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-[15px] font-semibold text-[#2E2218] mb-3">Čo môžeš dnes očakávať</p>

        {/* Energy */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[13px] text-[#8B7560] w-16">Energia</span>
          <div className="flex-1 h-2 rounded-full bg-black/5 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${suggestion.energy}%`, background: phaseColor }} />
          </div>
          <span className="text-[12px] text-[#A0907E] w-10 text-right">{suggestion.energy}%</span>
        </div>

        {/* Mood */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#8B7560] w-16">Nálada</span>
          <span className="text-lg">{getMoodEmoji(suggestion.mood)}</span>
          <span className="text-[12px] text-[#A0907E]">{suggestion.mood.toFixed(1)} / 5</span>
        </div>
      </div>

      {/* Quick Symptom Log */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-[15px] font-semibold text-[#2E2218] mb-3">Ako sa dnes naozaj cítiš?</p>
        {/* Horizontal scroll with fade cue */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1" style={{ scrollSnapType: 'x mandatory' }}>
            {SYMPTOMS.map((s, i) => (
              <button
                key={i}
                onClick={() => toggleSymptom(i)}
                className="flex flex-col items-center gap-1 flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all"
                  style={{
                    background: activeSymptoms[i] ? phaseColor : '#F0F0F0',
                    color: activeSymptoms[i] ? '#fff' : '#2E2218',
                    boxShadow: activeSymptoms[i] ? `0 2px 8px ${phaseColor}44` : 'none',
                    transform: activeSymptoms[i] ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {s.emoji}
                </div>
                <span className="text-[10px] text-[#A0907E] w-14 text-center leading-tight">{s.label}</span>
              </button>
            ))}
          </div>
          {/* Fade cue on right */}
          <div className="absolute right-0 top-0 bottom-1 w-8 pointer-events-none" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.9))' }} />
        </div>

        {/* Intensity Slider — shows for tapped symptom */}
        {expandedSymptom !== null && activeSymptoms[expandedSymptom] && (
          <div className="mt-4 pt-3 border-t border-[#D0BCA8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-[#8B7560]">
                {SYMPTOMS[expandedSymptom].emoji} {SYMPTOMS[expandedSymptom].label} — intenzita
              </span>
              <span className="text-[12px] font-medium" style={{ color: '#B8864A' }}>
                {symptomIntensities[expandedSymptom]}/5
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={symptomIntensities[expandedSymptom]}
              onChange={e => updateIntensity(expandedSymptom, Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #B8864A 0%, #B8864A ${(symptomIntensities[expandedSymptom] - 1) * 25}%, #D0BCA8 ${(symptomIntensities[expandedSymptom] - 1) * 25}%, #D0BCA8 100%)`,
                accentColor: '#B8864A',
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[12px] text-[#888]">Mierna</span>
              <span className="text-[12px] text-[#888]">Stredná</span>
              <span className="text-[12px] text-[#888]">Silná</span>
            </div>
          </div>
        )}
      </div>

      {/* Period Date Picker Modal */}
      {showPeriodPicker && (
        <MiniCalendar
          onSelect={d => { setLastPeriodStart(d); setShowPeriodPicker(false); }}
          onClose={() => setShowPeriodPicker(false)}
        />
      )}

      {/* Symptom Calendar */}
      <SymptomCalendarSection />

      {/* Log New Period — under calendar */}
      <button
        onClick={() => setShowPeriodPicker(true)}
        className="w-full py-3.5 rounded-2xl text-[14px] font-semibold text-white"
        style={{ background: '#6B4C3B' }}
      >
        Zaznamenať novú menštruáciu
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5" onClick={() => setShowSettings(false)}>
          <GlassCard className="w-full max-w-sm" onClick={e => (e as any).stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[#2E2218]">Nastavenia</h3>
              <button onClick={() => setShowSettings(false)}><X className="w-5 h-5 text-[#A0907E]" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-[#8B7560] block mb-1">Posledná menštruácia</label>
                <p className="text-[14px] font-medium text-[#2E2218]">{lastPeriodStart ? formatDateSk(new Date(lastPeriodStart + 'T00:00:00')) : '—'}</p>
              </div>

              <div>
                <label className="text-[13px] text-[#8B7560] block mb-1">Dĺžka cyklu: {settingsCycle} dní</label>
                <input type="range" min={25} max={35} value={settingsCycle} onChange={e => setSettingsCycle(Number(e.target.value))} className="w-full accent-[#6B4C3B]" />
              </div>

              <div>
                <label className="text-[13px] text-[#8B7560] block mb-1">Dĺžka menštruácie: {settingsPeriod} dní</label>
                <input type="range" min={2} max={10} value={settingsPeriod} onChange={e => setSettingsPeriod(Number(e.target.value))} className="w-full accent-[#6B4C3B]" />
              </div>

              <button
                onClick={() => { setCycleLength(settingsCycle); setPeriodLength(settingsPeriod); setShowSettings(false); }}
                className="w-full py-2.5 rounded-2xl text-[14px] font-semibold text-white"
                style={{ background: '#6B4C3B' }}
              >Uložiť</button>

              <button
                onClick={() => { updateCycleData({ lastPeriodStart: null }); setShowSettings(false); }}
                className="w-full py-2 text-[13px] text-[#E8A0A0] font-medium"
              >Resetovať</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={closePaywall}
        feature={paywallFeature}
        title={paywallTitle}
      />
    </div>
  );
}

function SymptomCalendarSection() {
  const [calMonth, setCalMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entries = useMemo((): { date: string; symptom: string; intensity: number; timestamp: string }[] => {
    try {
      return JSON.parse(localStorage.getItem('neome-symptom-log') || '[]');
    } catch { return []; }
  }, []);

  const byDate = useMemo(() => {
    const map: Record<string, typeof entries> = {};
    for (const e of entries) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [entries]);

  const calDays = useMemo(() => {
    const y = calMonth.getFullYear();
    const m = calMonth.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;
    const days: (string | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(`${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    }
    return days;
  }, [calMonth]);

  const monthLabel = calMonth.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' });
  const selectedEntries = selectedDate ? (byDate[selectedDate] || []) : [];

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-[13px] font-semibold text-[#2E2218] mb-2">Kalendár symptómov</p>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1))} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
            <ChevronLeft className="w-4 h-4 text-[#6B4C3B]" />
          </button>
          <span className="text-[13px] font-medium text-[#2E2218] capitalize">{monthLabel}</span>
          <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1))} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
            <ChevronRight className="w-4 h-4 text-[#6B4C3B]" />
          </button>
        </div>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-0.5">
          {WEEKDAYS.map(w => (
            <div key={w} className="text-center text-[10px] text-[#A0907E] font-medium py-0.5">{w}</div>
          ))}
        </div>
        {/* Day cells — compact */}
        <div className="grid grid-cols-7 gap-0.5">
          {calDays.map((dateStr, i) => {
            if (!dateStr) return <div key={i} />;
            const dayNum = parseInt(dateStr.slice(8));
            const dayEntries = byDate[dateStr] || [];
            const isSelected = selectedDate === dateStr;
            const todayDate = new Date().toISOString().slice(0, 10);
            const isToday = dateStr === todayDate;
            const uniqueSymptoms = [...new Set(dayEntries.map(e => e.symptom))].slice(0, 3);
            const maxIntensity = dayEntries.length > 0 ? Math.max(...dayEntries.map(e => e.intensity)) : 0;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className="flex flex-col items-center justify-center rounded-md py-1.5"
                style={{
                  background: isSelected ? '#6B4C3B' : dayEntries.length > 0 ? `rgba(196, 149, 106, ${0.1 + maxIntensity * 0.08})` : 'transparent',
                  border: isToday && !isSelected ? '1.5px solid #6B4C3B' : '1.5px solid transparent',
                }}
              >
                <span className="text-[11px]" style={{
                  color: isSelected ? '#fff' : '#2E2218',
                  fontWeight: isToday || isSelected ? 600 : 400,
                }}>{dayNum}</span>
                {uniqueSymptoms.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {uniqueSymptoms.map((_, di) => {
                      const entry = dayEntries.find(e => e.symptom === uniqueSymptoms[di]);
                      const intensity = entry?.intensity || 1;
                      const opacity = 0.2 + (intensity - 1) * 0.2;
                      return (
                        <div key={di} className="w-1 h-1 rounded-full"
                          style={{ background: `rgba(196, 149, 106, ${isSelected ? 1 : opacity})` }}
                        />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDate && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-[15px] font-semibold text-[#2E2218] mb-3">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {selectedEntries.length === 0 ? (
            <p className="text-[13px] text-[#888]">Žiadne symptómy v tento deň.</p>
          ) : (
            <div className="space-y-2">
              {selectedEntries.map((e, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[13px] text-[#8B7560]">{e.symptom}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div key={level} className="w-2 h-2 rounded-full"
                          style={{ background: level <= e.intensity ? '#B8864A' : '#F0EBE6' }}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] text-[#888]">
                      {e.intensity <= 1 ? 'Mierna' : e.intensity === 3 ? 'Stredná' : e.intensity >= 5 ? 'Silná' : `${e.intensity}/5`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function DateRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
      <div className="flex-1">
        <span className="text-[13px] text-[#8B7560]">{label}</span>
      </div>
      <span className="text-[13px] font-medium text-[#2E2218]">{value}</span>
    </div>
  );
}
