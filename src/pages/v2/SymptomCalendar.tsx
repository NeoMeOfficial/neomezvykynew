import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { colors, glassCard } from '../../theme/warmDusk';

interface SymptomEntry {
  date: string;
  symptom: string;
  intensity: number;
  timestamp: string;
}

const WEEKDAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function SymptomCalendar() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const entries = useMemo((): SymptomEntry[] => {
    try {
      const raw = localStorage.getItem('neome-symptom-log');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

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
    // Monday-based week
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const days: (string | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push(dateStr);
    }
    return days;
  }, [month]);

  const monthLabel = month.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' });

  const selectedEntries = selectedDate ? (byDate[selectedDate] || []) : [];

  return (
    <div className="min-h-screen space-y-4 pb-8" style={{ background: colors.bgGradient }}>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/kniznica')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#2E2218]">Symptómy</h1>
      </div>

      <GlassCard>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))} className="p-1">
            <ChevronLeft className="w-5 h-5 text-[#6B4C3B]" />
          </button>
          <span className="text-[14px] font-medium text-[#2E2218] capitalize">{monthLabel}</span>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))} className="p-1">
            <ChevronRight className="w-5 h-5 text-[#6B4C3B]" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(w => (
            <div key={w} className="text-center text-[12px] text-[#A0907E] font-medium py-1">{w}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {calDays.map((dateStr, i) => {
            if (!dateStr) return <div key={i} />;
            const dayNum = parseInt(dateStr.slice(8));
            const dayEntries = byDate[dateStr] || [];
            const isSelected = selectedDate === dateStr;
            const today = new Date().toISOString().slice(0, 10);
            const isToday = dateStr === today;

            // Get unique symptoms for dots (max 3)
            const uniqueSymptoms = [...new Set(dayEntries.map(e => e.symptom))].slice(0, 3);
            const maxIntensity = dayEntries.length > 0 ? Math.max(...dayEntries.map(e => e.intensity)) : 0;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className="aspect-square flex flex-col items-center justify-center rounded-lg relative"
                style={{
                  background: isSelected ? '#6B4C3B' : dayEntries.length > 0 ? `rgba(196, 149, 106, ${0.1 + maxIntensity * 0.08})` : 'transparent',
                  border: isToday && !isSelected ? '1.5px solid #6B4C3B' : '1.5px solid transparent',
                }}
              >
                <span className="text-[13px]" style={{
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
                        <div
                          key={di}
                          className="w-1.5 h-1.5 rounded-full"
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
      </GlassCard>

      {/* Selected day detail */}
      {selectedDate && (
        <GlassCard>
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
                        <div
                          key={level}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: level <= e.intensity ? '#B8864A' : '#F0EBE6',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] text-[#888]">
                      {e.intensity === 1 ? 'Mierna' : e.intensity === 3 ? 'Stredná' : e.intensity === 5 ? 'Silná' : `${e.intensity}/5`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
