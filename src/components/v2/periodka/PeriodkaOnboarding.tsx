import { useState, useMemo } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameDay, isSameMonth,
  isAfter, isBefore, subDays, format,
} from 'date-fns';
import { sk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../GlassCard';
import { useCycleData } from '../../../features/cycle/useCycleData';

const WEEKDAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function PeriodkaOnboarding() {
  const { setLastPeriodStart, setCycleLength, setPeriodLength } = useCycleData();
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [cycleLenVal, setCycleLenVal] = useState(28);
  const [periodLenVal, setPeriodLenVal] = useState(5);
  const [calMonth, setCalMonth] = useState(new Date());

  const today = useMemo(() => new Date(), []);
  const minDate = useMemo(() => subDays(today, 90), [today]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(calMonth);
    const monthEnd = endOfMonth(calMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days: Date[] = [];
    let d = gridStart;
    while (!isAfter(d, gridEnd)) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  }, [calMonth]);

  const canNext = step === 0 ? !!selectedDate : true;

  const handleFinish = () => {
    if (!selectedDate) return;
    setLastPeriodStart(selectedDate);
    setCycleLength(cycleLenVal);
    setPeriodLength(periodLenVal);
  };

  return (
    <div className="h-[100dvh] flex flex-col items-center px-5 pt-8" style={{ background: '#F5F3F0' }}>
      {/* Step dots */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-colors"
            style={{ background: i === step ? '#6B4C3B' : '#D0BCA8' }}
          />
        ))}
      </div>

      {/* Navigation — always visible at top */}
      <div className="w-full max-w-md mb-4 space-y-2 flex-shrink-0">
        <button
          disabled={!canNext}
          onClick={() => step < 2 ? setStep(step + 1) : handleFinish()}
          className="w-full py-3 rounded-2xl text-[14px] font-semibold text-white transition-opacity"
          style={{ background: '#6B4C3B', opacity: canNext ? 1 : 0.4 }}
        >
          {step < 2 ? 'Ďalej' : 'Dokončiť'}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-2 text-[14px] text-[#6B4C3B] font-medium"
          >
            Späť
          </button>
        )}
      </div>

      <GlassCard className="w-full max-w-md flex-1 overflow-y-auto">
        {step === 0 && (
          <div>
            <h2 className="text-[15px] font-semibold text-[#2E2218] text-center mb-4">
              Kedy začala tvoja posledná menštruácia?
            </h2>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="p-1">
                <ChevronLeft className="w-5 h-5 text-[#6B4C3B]" />
              </button>
              <span className="text-[14px] font-medium text-[#2E2218] capitalize">
                {format(calMonth, 'LLLL yyyy', { locale: sk })}
              </span>
              <button
                onClick={() => {
                  if (isBefore(startOfMonth(addMonths(calMonth, 1)), today)) {
                    setCalMonth(addMonths(calMonth, 1));
                  }
                }}
                className="p-1"
              >
                <ChevronRight className="w-5 h-5 text-[#6B4C3B]" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-[12px] text-[#A0907E] font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const inMonth = isSameMonth(day, calMonth);
                const isToday = isSameDay(day, today);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const disabled = isAfter(day, today) || isBefore(day, minDate) || !inMonth;

                return (
                  <button
                    key={idx}
                    disabled={disabled}
                    onClick={() => !disabled && setSelectedDate(day)}
                    className="aspect-square flex items-center justify-center text-[13px] rounded-full m-0.5 transition-colors"
                    style={{
                      color: disabled ? '#ccc' : isSelected ? '#fff' : '#2E2218',
                      background: isSelected ? '#6B4C3B' : 'transparent',
                      border: isToday && !isSelected ? '1.5px solid #6B4C3B' : '1.5px solid transparent',
                      fontWeight: isSelected || isToday ? 600 : 400,
                    }}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <p className="text-center text-[13px] text-[#8B7560] mt-3">
                Vybrané: <span className="font-medium text-[#2E2218]">{format(selectedDate, 'd.M.yyyy')}</span>
              </p>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-[15px] font-semibold text-[#2E2218] text-center mb-2">
              Aký dlhý je tvoj cyklus?
            </h2>
            <p className="text-[13px] text-[#8B7560] text-center mb-6">Priemerný cyklus trvá 28 dní</p>

            <div className="text-center mb-4">
              <span className="text-4xl font-semibold text-[#6B4C3B]">{cycleLenVal}</span>
              <span className="text-[14px] text-[#A0907E] ml-1">dní</span>
            </div>

            <input
              type="range"
              min={21}
              max={45}
              value={cycleLenVal}
              onChange={e => setCycleLenVal(Number(e.target.value))}
              className="w-full accent-[#6B4C3B]"
            />
            <div className="flex justify-between text-[12px] text-[#A0907E] mt-1">
              <span>21</span><span>45</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-[15px] font-semibold text-[#2E2218] text-center mb-2">
              Koľko dní trvá tvoja menštruácia?
            </h2>
            <p className="text-[13px] text-[#8B7560] text-center mb-6">Priemerne 4–6 dní</p>

            <div className="text-center mb-4">
              <span className="text-4xl font-semibold text-[#6B4C3B]">{periodLenVal}</span>
              <span className="text-[14px] text-[#A0907E] ml-1">dní</span>
            </div>

            <input
              type="range"
              min={2}
              max={10}
              value={periodLenVal}
              onChange={e => setPeriodLenVal(Number(e.target.value))}
              className="w-full accent-[#6B4C3B]"
            />
            <div className="flex justify-between text-[12px] text-[#A0907E] mt-1">
              <span>2</span><span>10</span>
            </div>
          </div>
        )}
      </GlassCard>

    </div>
  );
}
