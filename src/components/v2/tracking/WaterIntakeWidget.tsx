import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useAchievements } from '../../../hooks/useAchievements';
import { useBuddySystem } from '../../../hooks/useBuddySystem';

interface WaterIntakeData {
  date: string;
  glasses: number;
  goal: number;
}

export default function WaterIntakeWidget() {
  const { user } = useAuthContext();
  const { addActivity } = useAchievements();
  const { notifyBuddy } = useBuddySystem();
  const [waterData, setWaterData] = useState<WaterIntakeData>({
    date: new Date().toISOString().split('T')[0],
    glasses: 0,
    goal: 8
  });

  const [isLoading, setIsLoading] = useState(false);
  const [goalMetToday, setGoalMetToday] = useState(false);

  // Load today's water intake data
  useEffect(() => {
    if (!user?.id) return;
    
    const loadWaterData = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // For now, use localStorage until backend is ready
      const storageKey = `water_intake_${user.id}_${today}`;
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const parsedData = JSON.parse(saved);
        setWaterData(parsedData);
        setGoalMetToday(parsedData.glasses >= parsedData.goal);
      } else {
        setWaterData({
          date: today,
          glasses: 0,
          goal: 8
        });
        setGoalMetToday(false);
      }
    };

    loadWaterData();
  }, [user?.id]);

  const addGlasses = async (count: number) => {
    if (!user?.id || isLoading) return;
    
    setIsLoading(true);
    const prevGlasses = waterData.glasses;
    const newGlasses = Math.max(0, waterData.glasses + count);
    const newData = { ...waterData, glasses: newGlasses };
    
    // Save to localStorage (replace with API call later)
    const storageKey = `water_intake_${user.id}_${waterData.date}`;
    localStorage.setItem(storageKey, JSON.stringify(newData));
    
    setWaterData(newData);

    // Check if user just reached their goal for the first time today
    const reachedGoal = newGlasses >= waterData.goal;
    const wasUnderGoal = prevGlasses < waterData.goal;
    
    if (reachedGoal && wasUnderGoal && !goalMetToday) {
      setGoalMetToday(true);
      // Award achievement points for reaching daily water goal
      await addActivity('water_goal_met', { 
        glasses: newGlasses, 
        goal: waterData.goal,
        date: waterData.date
      });

      // Notify buddies about water goal achievement
      await notifyBuddy(
        'water_goal',
        `dosiahla denný cieľ pitného režimu (${newGlasses} pohárov)! 💧`,
        { glasses: newGlasses, goal: waterData.goal }
      );
    }
    
    setIsLoading(false);
  };

  const progressPercentage = Math.min(100, (waterData.glasses / waterData.goal) * 100);
  const isGoalMet = waterData.glasses >= waterData.goal;

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#6B4C3B] text-lg font-semibold mb-1">Pitný režim</h3>
          <p className="text-[#8B7560] text-sm">
            {waterData.glasses} z {waterData.goal} pohárov (250ml)
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
          disabled={isLoading || waterData.glasses === 0}
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
        <p>Dnes si vypila {(waterData.glasses * 250)}ml vody</p>
        {waterData.glasses < waterData.goal && (
          <p>Zostáva ešte {(waterData.goal - waterData.glasses) * 250}ml</p>
        )}
      </div>
    </div>
  );
}