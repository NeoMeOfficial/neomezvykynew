import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { useCycleSymptoms } from '@/hooks/useDailyRituals';

interface SymptomEntry {
  date: string;
  symptom: string;
  intensity: number;
}

// Mirrors SYMPTOM_DEFS in Periodka.tsx — the canonical symptom store is
// cycle_symptoms (english keys), chips are labelled in Slovak.
const KEY_LABELS: Record<string, string> = {
  energetic: 'Energická',
  focused: 'Sústredená',
  creative: 'Kreatívna',
  social: 'Spoločenská',
  headache: 'Bolesti hlavy',
  breast_tenderness: 'Citlivé prsia',
  bloating: 'Nafúknutá',
  fatigue: 'Únava',
};

const WEEKDAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function SymptomCalendar() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // Canonical source: cycle_symptoms via useCycleSymptoms (this page
  // previously read a legacy localStorage key nothing writes anymore).
  const { days, customDefs } = useCycleSymptoms();

  const entries = useMemo((): SymptomEntry[] => {
    const customLabels: Record<string, string> = {};
    for (const def of customDefs) customLabels[def.k] = def.l;
    return days.flatMap((d) =>
      Object.keys(d.symptoms).map((key) => ({
        date: d.date,
        symptom: KEY_LABELS[key] ?? customLabels[key] ?? key,
        intensity: 1,
      })),
    );
  }, [days, customDefs]);

  const byDate = useMemo(() => {
    const map: Record<string, SymptomEntry[]> = {};
    for (const e of entries) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [entries]);

  const calDays = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
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
  }, [month]);

  const monthLabel = month.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().slice(0, 10);
  const selectedEntries = selectedDate ? (byDate[selectedDate] || []) : [];

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Symptómy" backHref="/kniznica/periodka" />

      <div className="px-5 pt-2 flex flex-col gap-4">
        {/* Calendar card */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
              className="h-8 w-8 rounded-full border border-ink/[0.08] flex items-center justify-center"
            >
              <ChevronLeft className="size-4 text-ink/60" />
            </button>
            <span className="font-sans text-sm font-medium text-ink capitalize">{monthLabel}</span>
            <button
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
              className="h-8 w-8 rounded-full border border-ink/[0.08] flex items-center justify-center"
            >
              <ChevronRight className="size-4 text-ink/60" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map(w => (
              <div key={w} className="text-center font-sans text-[10px] uppercase tracking-[0.12em] text-ink/40 py-1">{w}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {calDays.map((dateStr, i) => {
              if (!dateStr) return <div key={i} />;
              const dayNum = parseInt(dateStr.slice(8));
              const dayEntries = byDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === today;
              const hasEntries = dayEntries.length > 0;
              const maxIntensity = hasEntries ? Math.max(...dayEntries.map(e => e.intensity)) : 0;
              const dots = [...new Set(dayEntries.map(e => e.symptom))].slice(0, 3);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
                    isSelected
                      ? 'bg-pillar-cyklus text-white'
                      : hasEntries
                        ? 'bg-pillar-cyklus/[0.08]'
                        : ''
                  } ${isToday && !isSelected ? 'ring-1 ring-pillar-cyklus' : ''}`}
                >
                  <span className={`font-sans text-[13px] ${isSelected ? 'text-white font-semibold' : isToday ? 'font-semibold text-ink' : 'text-ink/72'}`}>
                    {dayNum}
                  </span>
                  {dots.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dots.map((_, di) => (
                        <div
                          key={di}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-pillar-cyklus'}`}
                          style={{ opacity: isSelected ? 1 : 0.4 + maxIntensity * 0.12 }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        {selectedDate && (
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
            <Eyebrow tone="muted" className="mb-3">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Eyebrow>

            {selectedEntries.length === 0 ? (
              <BodyText tone="secondary">Žiadne symptómy v tento deň.</BodyText>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEntries.map((e, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <BodyText size="sm">{e.symptom}</BodyText>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${level <= e.intensity ? 'bg-pillar-cyklus' : 'bg-cream-200'}`}
                          />
                        ))}
                      </div>
                      <Eyebrow tone="muted">
                        {e.intensity <= 2 ? 'Mierna' : e.intensity <= 3 ? 'Stredná' : 'Silná'}
                      </Eyebrow>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
