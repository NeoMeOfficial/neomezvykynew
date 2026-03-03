import { useNavigate } from 'react-router-dom';
import { Dumbbell, Flame, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { useWorkoutHistory } from '../../../hooks/useWorkoutHistory';
import { colors, glassCard } from '../../theme/warmDusk';

interface WorkoutStatsWidgetProps {
  variant?: 'compact' | 'full';
}

export default function WorkoutStatsWidget({ variant = 'compact' }: WorkoutStatsWidgetProps) {
  const { stats, streak } = useWorkoutHistory();
  const navigate = useNavigate();

  const workoutTypeLabels = {
    telo: 'Telo',
    strava: 'Strava', 
    mysel: 'Myseľ'
  };

  const workoutTypeColors = {
    telo: '#6B4C3B',
    strava: '#7A9E78',
    mysel: '#A8848B'
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4">
        <button
          onClick={() => navigate('/profil?tab=workouts')}
          className="w-full flex items-center gap-3 text-left"
        >
          <div className="w-12 h-12 bg-[#7A9E78]/20 rounded-xl flex items-center justify-center">
            <Dumbbell size={20} className="text-[#7A9E78]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[#6B4C3B] font-semibold text-sm">Cvičenia</h3>
              {streak.current > 0 && (
                <span className="text-xs bg-[#7A9E78] text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Flame size={10} />
                  {streak.current}
                </span>
              )}
            </div>
            <p className="text-[#8B7560] text-xs">
              {stats.totalWorkouts} dokončených • {stats.thisWeek} tento týždeň
            </p>
          </div>

          <div className="flex items-center gap-1">
            {/* Recent workout type indicators */}
            {Object.entries(stats.workoutsByType).slice(0, 2).map(([type, count]) => (
              <div
                key={type}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                style={{ backgroundColor: workoutTypeColors[type as keyof typeof workoutTypeColors] }}
                title={`${workoutTypeLabels[type as keyof typeof workoutTypeLabels]}: ${count}`}
              >
                {workoutTypeLabels[type as keyof typeof workoutTypeLabels]?.[0] || type[0].toUpperCase()}
              </div>
            ))}
            <ChevronRight size={16} className="text-[#8B7560] ml-1" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-[#7A9E78]/20 rounded-xl flex items-center justify-center">
            <Dumbbell size={24} className="text-[#7A9E78]" />
          </div>
          <div>
            <h3 className="text-[#6B4C3B] font-bold text-lg">Cvičebná história</h3>
            <p className="text-[#8B7560] text-sm">{stats.totalWorkouts} dokončených cvičení</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/profil?tab=workouts')}
          className="text-[#B8864A] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          Zobraziť všetko
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Current streak highlight */}
      {streak.current > 0 && (
        <div className="bg-[#7A9E78]/20 border border-[#7A9E78]/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame size={20} className="text-[#7A9E78]" />
            <span className="text-[#6B4C3B] font-bold text-lg">{streak.current}</span>
            <span className="text-[#6B4C3B] font-medium">
              {streak.current === 1 ? 'deň' : streak.current < 5 ? 'dni' : 'dní'}
            </span>
          </div>
          <p className="text-[#7A9E78] text-sm font-medium">
            Aktuálna séria • Najdlhšia: {streak.longest}
          </p>
        </div>
      )}

      {/* Quick stats grid */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/20">
        <div className="text-center">
          <div className="text-[#6B4C3B] font-bold text-lg">{stats.thisWeek}</div>
          <div className="text-[#8B7560] text-xs">Tento týždeň</div>
        </div>
        <div className="text-center">
          <div className="text-[#6B4C3B] font-bold text-lg">{Math.round(stats.totalMinutes / 60)}h</div>
          <div className="text-[#8B7560] text-xs">Celkovo</div>
        </div>
        <div className="text-center">
          <div className="text-[#6B4C3B] font-bold text-lg">{Math.round(stats.averageWorkoutsPerWeek * 10) / 10}</div>
          <div className="text-[#8B7560] text-xs">Týždenne</div>
        </div>
      </div>

      {/* Workout types breakdown */}
      {Object.keys(stats.workoutsByType).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[#6B4C3B] font-semibold text-sm flex items-center gap-2">
            <TrendingUp size={16} />
            Typy cvičení
          </h4>
          <div className="space-y-2">
            {Object.entries(stats.workoutsByType)
              .sort(([,a], [,b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: workoutTypeColors[type as keyof typeof workoutTypeColors] }}
                    />
                    <span className="text-[#6B4C3B] text-sm font-medium">
                      {workoutTypeLabels[type as keyof typeof workoutTypeLabels] || type}
                    </span>
                  </div>
                  <span className="text-[#8B7560] text-sm">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {stats.recentSessions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[#6B4C3B] font-semibold text-sm flex items-center gap-2">
            <Calendar size={16} />
            Posledné aktivity
          </h4>
          <div className="space-y-2">
            {stats.recentSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between">
                <div>
                  <div className="text-[#6B4C3B] text-sm font-medium line-clamp-1">
                    {session.workoutTitle}
                  </div>
                  <div className="text-[#8B7560] text-xs">
                    {new Date(session.completedAt).toLocaleDateString('sk-SK')} • {session.duration} min
                  </div>
                </div>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                  style={{ backgroundColor: workoutTypeColors[session.workoutType as keyof typeof workoutTypeColors] }}
                >
                  {workoutTypeLabels[session.workoutType as keyof typeof workoutTypeLabels]?.[0] || session.workoutType[0].toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}