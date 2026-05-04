import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { useCycleData, calculateAverageCycleLength } from '@/features/cycle/useCycleData';
import { PHASE_LABELS } from '@/features/cycle/insights';
import { getNextPeriodDate } from '@/features/cycle/utils';
import { TrendingUp, Calendar, Activity } from 'lucide-react';

const PHASE_COLORS: Record<string, string> = {
  menstrual:  '#C1856A',
  follicular: '#8B9E88',
  ovulation:  '#B8864A',
  luteal:     '#A8848B',
};

const PHASE_DURATIONS: Record<string, number> = {
  menstrual: 5,
  follicular: 9,
  ovulation: 3,
  luteal: 11,
};

const SK_MONTHS = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}. ${SK_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export default function CyklusInsights() {
  const navigate = useNavigate();
  const { cycleData } = useCycleData();
  const { lastPeriodStart, cycleLength, history = [] } = cycleData;

  const avgResult = calculateAverageCycleLength(history);
  const avgLength = avgResult?.average ?? cycleLength;
  const cycleCount = avgResult?.cycleCount ?? 0;

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const nextPeriod = lastPeriodStart
    ? getNextPeriodDate(lastPeriodStart, cycleLength)
    : null;

  const daysUntilNext = nextPeriod
    ? Math.max(0, Math.round((nextPeriod.getTime() - Date.now()) / 86_400_000))
    : null;

  const recentCycleLengths = sortedHistory
    .slice(0, -1)
    .map((entry, i, arr) => {
      const next = arr[i + 1];
      if (!next) return null;
      return daysBetween(next.date, entry.date);
    })
    .filter((n): n is number => n !== null && n >= 20 && n <= 45)
    .slice(0, 6);

  const minCycle = recentCycleLengths.length ? Math.min(...recentCycleLengths) : null;
  const maxCycle = recentCycleLengths.length ? Math.max(...recentCycleLengths) : null;

  const hasData = !!lastPeriodStart;

  return (
    <div className="min-h-screen bg-cream pb-28">
      <TopBar title="Prehľad cyklu" onBack={() => navigate(-1)} />

      <div className="px-5 pt-2 flex flex-col gap-4">

        {!hasData ? (
          <div className="rounded-card bg-white border border-ink/[0.08] p-8 text-center">
            <Activity className="size-8 text-ink/30 mx-auto mb-3" strokeWidth={1.5} />
            <SerifHeader as="h3" size="h3" className="mb-1">Zatiaľ žiadne dáta</SerifHeader>
            <BodyText tone="muted" size="sm">
              Zaznamenaj svoju prvú menštruáciu, aby si tu videla štatistiky.
            </BodyText>
            <button
              onClick={() => navigate('/kniznica/periodka')}
              className="mt-4 px-5 py-2.5 rounded-full bg-mauve text-white font-sans text-sm font-medium"
            >
              Zaznamenať cyklus
            </button>
          </div>
        ) : (
          <>
            {/* Key stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Priem. dĺžka', value: `${Math.round(avgLength)}d`, sub: cycleCount > 0 ? `${cycleCount} cyklov` : 'nastavené' },
                { label: 'Najkratší', value: minCycle ? `${minCycle}d` : '—', sub: 'za posledné' },
                { label: 'Najdlhší', value: maxCycle ? `${maxCycle}d` : '—', sub: 'za posledné' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-card bg-white border border-ink/[0.08] p-3 text-center">
                  <Eyebrow tone="muted" className="mb-1">{label}</Eyebrow>
                  <div className="font-serif text-h2 text-ink">{value}</div>
                  <Eyebrow tone="muted" className="mt-0.5">{sub}</Eyebrow>
                </div>
              ))}
            </div>

            {/* Next period */}
            {nextPeriod && (
              <div className="rounded-card bg-white border border-ink/[0.08] p-4 flex items-center gap-4">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(193,133,106,0.12)' }}
                >
                  <Calendar className="size-5" style={{ color: '#C1856A' }} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <Eyebrow tone="muted" className="mb-0.5">Ďalšia menštruácia</Eyebrow>
                  <BodyText size="sm" className="font-medium">
                    {daysUntilNext === 0
                      ? 'Dnes'
                      : daysUntilNext === 1
                      ? 'Zajtra'
                      : `O ${daysUntilNext} dní`}
                  </BodyText>
                  <Eyebrow tone="muted">{fmtDate(nextPeriod.toISOString())}</Eyebrow>
                </div>
              </div>
            )}

            {/* Phase breakdown */}
            <div className="rounded-card bg-white border border-ink/[0.08] p-5">
              <Eyebrow className="mb-4">Rozloženie fáz</Eyebrow>
              <div className="flex flex-col gap-3">
                {(Object.entries(PHASE_LABELS) as [string, string][]).map(([key, label]) => {
                  const days = PHASE_DURATIONS[key] ?? 7;
                  const pct = Math.round((days / avgLength) * 100);
                  const color = PHASE_COLORS[key] ?? '#8B9E88';
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                          <BodyText size="sm">{label}</BodyText>
                        </div>
                        <Eyebrow tone="muted">~{days} dní</Eyebrow>
                      </div>
                      <div className="h-1.5 rounded-full bg-ink/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cycle history */}
            {sortedHistory.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eyebrow>História cyklov</Eyebrow>
                  <TrendingUp className="size-3.5 text-ink/40" strokeWidth={1.5} />
                </div>
                <div className="rounded-card bg-white border border-ink/[0.08] overflow-hidden">
                  {sortedHistory.slice(0, 8).map((entry, i, arr) => {
                    const prev = arr[i + 1];
                    const length = prev ? daysBetween(prev.date, entry.date) : null;
                    const valid = length !== null && length >= 20 && length <= 45;
                    return (
                      <div
                        key={entry.date}
                        className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(61,41,33,0.06)' : 'none' }}
                      >
                        <div>
                          <BodyText size="sm" className="font-medium">{fmtDate(entry.date)}</BodyText>
                          <Eyebrow tone="muted">Začiatok menštruácie</Eyebrow>
                        </div>
                        {valid && (
                          <div
                            className="px-2.5 py-1 rounded-full font-sans text-xs font-medium"
                            style={{
                              background: 'rgba(193,133,106,0.10)',
                              color: '#C1856A',
                            }}
                          >
                            {length}d
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
