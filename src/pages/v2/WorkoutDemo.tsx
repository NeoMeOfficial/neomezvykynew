import { useState } from 'react';
import { ArrowLeft, Trophy, Target, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DemoWorkoutCard from '../../components/v2/workouts/DemoWorkoutCard';
import WorkoutStatsWidget from '../../components/v2/workouts/WorkoutStatsWidget';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { colors, glassCard } from '../../theme/warmDusk';

export default function WorkoutDemo() {
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(0);
  const { stats } = useWorkoutHistory();

  const workoutTypes = [
    { index: 0, label: 'Ranné cvičenie', emoji: '🌅' },
    { index: 1, label: 'Strečing', emoji: '🤸‍♀️' },
    { index: 2, label: 'Večerná relaxácia', emoji: '🌙' }
  ];

  return (
    <div className="min-h-screen space-y-6" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/domov')}
          className="p-2 rounded-xl bg-white/30 backdrop-blur-[20px] border border-white/20"
        >
          <ArrowLeft size={20} className="text-[#6B4C3B]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#6B4C3B]">Demo cvičenia</h1>
          <p className="text-[#8B7560] text-sm">Vyskúšaj si sledovanie pokroku</p>
        </div>
      </div>

      {/* Quick Stats */}
      {stats.totalWorkouts > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-xl p-4 text-center">
            <div className="text-[#7A9E78] font-bold text-2xl">{stats.totalWorkouts}</div>
            <div className="text-[#6B4C3B] text-sm">Dokončených</div>
          </div>
          <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-xl p-4 text-center">
            <div className="text-[#B8864A] font-bold text-2xl">{stats.currentStreak}</div>
            <div className="text-[#6B4C3B] text-sm">Aktuálna séria</div>
          </div>
          <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-xl p-4 text-center">
            <div className="text-[#A8848B] font-bold text-2xl">{Math.round(stats.totalMinutes / 60)}</div>
            <div className="text-[#6B4C3B] text-sm">Hodín celkovo</div>
          </div>
        </div>
      )}

      {/* Workout Selection */}
      <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4">
        <h3 className="text-[#6B4C3B] font-semibold text-lg mb-4">Vyber si typ cvičenia</h3>
        <div className="grid grid-cols-3 gap-2">
          {workoutTypes.map((workout) => (
            <button
              key={workout.index}
              onClick={() => setSelectedWorkout(workout.index)}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedWorkout === workout.index
                  ? 'bg-[#7A9E78] text-white shadow-md'
                  : 'bg-white/20 text-[#6B4C3B] hover:bg-white/30'
              }`}
            >
              <div className="text-2xl mb-1">{workout.emoji}</div>
              <div className="text-xs font-medium">{workout.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Workout */}
      <DemoWorkoutCard workoutIndex={selectedWorkout} />

      {/* Motivation Message */}
      <div className="bg-gradient-to-r from-[#7A9E78]/20 to-[#B8864A]/20 border border-white/30 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy size={24} className="text-[#B8864A]" />
          <h3 className="text-[#6B4C3B] font-bold text-lg">Začni svoju cestu</h3>
        </div>
        <p className="text-[#8B7560] text-sm max-w-sm mx-auto">
          Každé dokončené cvičenie ťa posúva bližšie k tvojim cieľom. 
          Začni dnes a sleduj svoj pokrok!
        </p>
        
        {stats.totalWorkouts === 0 ? (
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#A68B5B]">
            <div className="flex items-center gap-1">
              <Target size={12} />
              <span>Prvé cvičenie = 15 bodov</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame size={12} />
              <span>Začni svoju sériu</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-[#7A9E78] text-sm font-medium">
            🎉 Gratulujem! Už máš {stats.totalWorkouts} dokončených cvičení!
          </div>
        )}
      </div>

      {/* Link to Full History */}
      {stats.totalWorkouts > 0 && (
        <div className="text-center">
          <button
            onClick={() => navigate('/workout-history')}
            className="text-[#B8864A] text-sm font-medium hover:underline"
          >
            Zobraziť úplnú históriu cvičení →
          </button>
        </div>
      )}
    </div>
  );
}