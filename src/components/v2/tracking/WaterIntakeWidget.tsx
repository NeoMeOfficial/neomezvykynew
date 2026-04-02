import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../../../contexts/SupabaseAuthContext';
import { useUserHabits } from '../../../hooks/useUserData';
import { useAchievements } from '../../../hooks/useAchievements';
import { useBuddySystem } from '../../../hooks/useBuddySystem';
import { colors, glassCard } from '../../theme/warmDusk';

interface WaterIntakeData {
  date: string;
  glasses: number;
  goal: number;
}

export default function WaterIntakeWidget() {
  const { user } = useSupabaseAuth();
  const { habits, updateHabitProgress, loading: habitsLoading } = useUserHabits();
  const { addActivity } = useAchievements();
  const { notifyBuddy } = useBuddySystem();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [goalMetToday, setGoalMetToday] = useState(false);

  // Get today's water habit
  const waterHabit = habits.find(h => h.habit_type === 'water');
  const glasses = waterHabit?.current_count || 0;
  const goal = waterHabit?.target_count || 8;
  const isGoalMet = glasses >= goal;

  // Check if goal was just met
  useEffect(() => {
    if (waterHabit?.completed && !goalMetToday) {
      setGoalMetToday(true);
    }
  }, [waterHabit?.completed]);

  const addGlasses = async (count: number) => {
    if (!user?.id || isUpdating || habitsLoading) return;
    
    setIsUpdating(true);
    const prevGlasses = glasses;
    const success = await updateHabitProgress('water', count);
    
    if (success) {
      const newGlasses = Math.max(0, prevGlasses + count);
      
      // Check if user just reached their goal for the first time today
      const reachedGoal = newGlasses >= goal;
      const wasUnderGoal = prevGlasses < goal;
      
      if (reachedGoal && wasUnderGoal && !goalMetToday) {
        setGoalMetToday(true);
        // Award achievement points for reaching daily water goal
        await addActivity('water_goal_met', { 
          glasses: newGlasses, 
          goal: goal,
          date: new Date().toISOString().split('T')[0]
        });

        // Notify buddies about water goal achievement
        await notifyBuddy(
          'water_goal',
          `dosiahla denný cieľ pitného režimu (${newGlasses} pohárov)! 💧`,
          { glasses: newGlasses, goal: goal }
        );
      }
    }
    
    setIsUpdating(false);
  };

  const progressPercentage = Math.min(100, (glasses / goal) * 100);
  const isLoading = isUpdating || habitsLoading;

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#6B4C3B] text-lg font-semibold mb-1">Pitný režim</h3>
          <p className="text-[#8B7560] text-sm">
            {glasses} z {goal} pohárov (250ml)
          </p>
        </div>
        <div className="relative w-16 h-16">
          {/* Progress Ring */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              stroke="#E5D4C7" 
              strokeWidth="4" 
              fill="none"
            />
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              stroke={isGoalMet ? "#7A9E78" : "#B8864A"}
              strokeWidth="4" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${176 * (progressPercentage / 100)} 176`}
              className="transition-all duration-500"
            />
          </svg>
          {/* Water Drop Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className={`w-6 h-6 ${isGoalMet ? 'text-[#7A9E78]' : 'text-[#B8864A]'}`} 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2c-.5 0-1 .5-1 1 0 1.5-3 6-3 8.5C8 14 10 16 12 16s4-2 4-4.5c0-2.5-3-7-3-8.5 0-.5-.5-1-1-1z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Progress Bar Alternative */}
      <div className="w-full bg-[#E5D4C7] rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            isGoalMet ? 'bg-[#7A9E78]' : 'bg-[#B8864A]'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => addGlasses(1)}
          disabled={isLoading}
          className="flex-1 bg-[#B8864A] text-white rounded-xl py-2 px-3 font-medium text-sm hover:bg-[#A67B42] transition-colors disabled:opacity-50"
        >
          +1 pohár
        </button>
        <button
          onClick={() => addGlasses(2)}
          disabled={isLoading}
          className="flex-1 bg-[#B8864A] text-white rounded-xl py-2 px-3 font-medium text-sm hover:bg-[#A67B42] transition-colors disabled:opacity-50"
        >
          +2 poháre
        </button>
        <button
          onClick={() => addGlasses(-1)}
          disabled={isLoading || glasses === 0}
          className="bg-[#8B7560] text-white rounded-xl py-2 px-3 font-medium text-sm hover:bg-[#7A6451] transition-colors disabled:opacity-50"
        >
          -1
        </button>
      </div>

      {/* Achievement Message */}
      {isGoalMet && (
        <div className="bg-[#7A9E78]/20 border border-[#7A9E78]/30 rounded-xl p-3 text-center">
          <p className="text-[#6B4C3B] font-medium text-sm">
            🎉 Gratulujeme! Dosiahla si denný cieľ!
          </p>
        </div>
      )}

      {/* Daily Summary */}
      <div className="text-center text-xs text-[#8B7560] space-y-1">
        <p>Dnes si vypila {(glasses * 250)}ml vody</p>
        {glasses < goal && (
          <p>Zostáva ešte {(goal - glasses) * 250}ml</p>
        )}
      </div>
    </div>
  );
}