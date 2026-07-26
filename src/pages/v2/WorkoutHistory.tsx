import { useState } from 'react';
import { Calendar, BarChart3, Award, TrendingUp, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkoutStatsWidget from '../../components/v2/workouts/WorkoutStatsWidget';
import WorkoutCalendar from '../../components/v2/workouts/WorkoutCalendar';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { useSmartBack } from '../../hooks/useSmartBack';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';

export default function WorkoutHistory() {
  const navigate = useNavigate();
  const smartBack = useSmartBack('/profil');
  const [activeTab, setActiveTab] = useState<'stats' | 'calendar'>('stats');
  const { stats } = useWorkoutHistory() as { stats: { totalWorkouts: number; currentStreak: number; longestStreak: number; recentSessions: Array<{ id: string; workoutTitle: string; workoutType: string; completedAt: string; duration: number; program?: string }> } };

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Cvičebná história" onBack={smartBack} />

      <div className="px-5 pt-2 flex flex-col gap-4">
        {/* Tab toggle */}
        <div className="flex gap-2 p-1 bg-cream-200 rounded-xl">
          {([['stats', 'Štatistiky', BarChart3], ['calendar', 'Kalendár', Calendar]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-sans text-sm font-medium transition-all ${
                activeTab === key ? 'bg-white shadow-nm-sm text-ink' : 'text-ink/56'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <>
            <WorkoutStatsWidget variant="full" />

            {(stats?.currentStreak > 0 || stats?.longestStreak > 0) && (
              <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="size-4 text-gold" />
                  <SerifHeader as="h3" size="h3">Tvoje úspechy</SerifHeader>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl bg-pillar-strava/10 py-4 px-3 text-center">
                    <div className="font-serif text-h1 text-pillar-strava leading-none">{stats.currentStreak}</div>
                    <BodyText size="sm" tone="secondary" className="mt-1">Aktuálna séria</BodyText>
                  </div>
                  <div className="flex-1 rounded-xl bg-terra/10 py-4 px-3 text-center">
                    <div className="font-serif text-h1 text-terra leading-none">{stats.longestStreak}</div>
                    <BodyText size="sm" tone="secondary" className="mt-1">Osobný rekord</BodyText>
                  </div>
                </div>
              </div>
            )}

            {stats?.recentSessions?.length > 0 && (
              <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-ink/[0.06] flex items-center gap-2">
                  <TrendingUp className="size-4 text-ink/40" />
                  <Eyebrow>Posledné cvičenia</Eyebrow>
                </div>
                {stats.recentSessions.slice(0, 5).map((s, i, arr) => (
                  <div key={s.id} className={`px-5 py-4 flex items-center gap-3 ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}>
                    <div className="h-9 w-9 rounded-lg bg-pillar-strava/15 flex items-center justify-center flex-shrink-0">
                      <span className="font-sans text-xs font-bold text-pillar-strava">
                        {s.workoutType === 'telo' ? 'T' : s.workoutType === 'strava' ? 'S' : 'M'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm font-medium text-ink truncate">{s.workoutTitle}</div>
                      <Eyebrow tone="muted">
                        {new Date(s.completedAt).toLocaleDateString('sk-SK')} · {s.duration} min
                        {s.program && ` · ${s.program}`}
                      </Eyebrow>
                    </div>
                    <Check className="size-4 text-pillar-strava flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {stats?.totalWorkouts === 0 && (
              <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-pillar-strava/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="size-7 text-pillar-strava" />
                </div>
                <SerifHeader as="h3" size="h3" className="mb-2">Žiadne cvičenia zatiaľ</SerifHeader>
                <BodyText tone="secondary" className="max-w-xs mx-auto">
                  Keď dokončíš svoje prvé cvičenie, tu uvidíš štatistiky a pokrok.
                </BodyText>
              </div>
            )}
          </>
        )}

        {activeTab === 'calendar' && (
          <>
            <WorkoutCalendar />
            {stats?.totalWorkouts === 0 && (
              <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-pillar-strava/10 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="size-7 text-pillar-strava" />
                </div>
                <SerifHeader as="h3" size="h3" className="mb-2">Kalendár bude plný po prvom cvičení</SerifHeader>
                <BodyText tone="secondary" className="max-w-xs mx-auto">
                  Každé dokončené cvičenie sa zobrazí v kalendári.
                </BodyText>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
