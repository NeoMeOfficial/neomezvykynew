import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useAchievements } from '../../../hooks/useAchievements';

interface MoodEnergyData {
  date: string;
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
}

const moodEmojis = {
  1: { emoji: '😢', label: 'Veľmi zlá' },
  2: { emoji: '😔', label: 'Zlá' },
  3: { emoji: '😐', label: 'Neutrálna' },
  4: { emoji: '😊', label: 'Dobrá' },
  5: { emoji: '😁', label: 'Výborná' }
};

const energyEmojis = {
  1: { emoji: '🔋', label: 'Veľmi nízka', color: 'text-red-500' },
  2: { emoji: '🔋', label: 'Nízka', color: 'text-orange-500' },
  3: { emoji: '🔋', label: 'Stredná', color: 'text-yellow-500' },
  4: { emoji: '🔋', label: 'Vysoká', color: 'text-lime-500' },
  5: { emoji: '🔋', label: 'Maximálna', color: 'text-green-500' }
};

export default function MoodEnergyTracker() {
  const { user } = useAuthContext();
  const { addActivity } = useAchievements();
  const [data, setData] = useState<MoodEnergyData>({
    date: new Date().toISOString().split('T')[0],
    mood: 3,
    energy: 3
  });
  const [hasTrackedToday, setHasTrackedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load today's data
  useEffect(() => {
    if (!user?.id) {
      // Show demo state for unauthenticated users
      setData({
        date: new Date().toISOString().split('T')[0],
        mood: 3,
        energy: 3
      });
      return;
    }
    
    const loadTodayData = () => {
      const today = new Date().toISOString().split('T')[0];
      const storageKey = `mood_energy_${user.id}_${today}`;
      const saved = localStorage.getItem(storageKey);
      
      if (saved) {
        const parsedData = JSON.parse(saved);
        setData(parsedData);
        setHasTrackedToday(true);
      } else {
        setData({
          date: today,
          mood: 3,
          energy: 3
        });
        setHasTrackedToday(false);
      }
    };

    loadTodayData();
  }, [user?.id]);

  const saveData = async (newData: MoodEnergyData) => {
    if (isLoading) return;
    if (!user?.id) {
      // Demo mode - just update local state
      setData(newData);
      setHasTrackedToday(true);
      return;
    }
    
    setIsLoading(true);
    
    // Save to localStorage (replace with API call later)
    const storageKey = `mood_energy_${user.id}_${newData.date}`;
    localStorage.setItem(storageKey, JSON.stringify(newData));
    
    setData(newData);
    
    // Award points for tracking mood/energy (only first time today)
    if (!hasTrackedToday) {
      await addActivity('mood_track', {
        mood: newData.mood,
        energy: newData.energy,
        date: newData.date
      });
    }
    
    setHasTrackedToday(true);
    setIsLoading(false);
  };

  const updateMood = (mood: number) => {
    const newData = { ...data, mood };
    saveData(newData);
  };

  const updateEnergy = (energy: number) => {
    const newData = { ...data, energy };
    saveData(newData);
  };

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4 space-y-4">
      <div>
        <h3 className="text-[#6B4C3B] text-lg font-semibold mb-1">Nálada a energia</h3>
        <p className="text-[#8B7560] text-sm">Ako sa dnes cítiš?</p>
      </div>

      {/* Mood Tracking */}
      <div className="space-y-3">
        <div>
          <h4 className="text-[#6B4C3B] font-medium text-sm mb-2 flex items-center gap-2">
            Nálada {moodEmojis[data.mood as keyof typeof moodEmojis].emoji}
            <span className="text-xs text-[#8B7560]">
              ({moodEmojis[data.mood as keyof typeof moodEmojis].label})
            </span>
          </h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => updateMood(value)}
                disabled={isLoading}
                className={`flex-1 p-2 rounded-xl text-xl transition-all ${
                  data.mood === value
                    ? 'bg-[#A8848B] text-white shadow-md scale-105'
                    : 'bg-white/50 hover:bg-white/70 text-[#6B4C3B]'
                } disabled:opacity-50`}
              >
                {moodEmojis[value as keyof typeof moodEmojis].emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Tracking */}
        <div>
          <h4 className="text-[#6B4C3B] font-medium text-sm mb-2 flex items-center gap-2">
            Energia 
            <span className={`text-xs ${energyEmojis[data.energy as keyof typeof energyEmojis].color}`}>
              {energyEmojis[data.energy as keyof typeof energyEmojis].emoji}
            </span>
            <span className="text-xs text-[#8B7560]">
              ({energyEmojis[data.energy as keyof typeof energyEmojis].label})
            </span>
          </h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => updateEnergy(value)}
                disabled={isLoading}
                className={`flex-1 p-2 rounded-xl transition-all ${
                  data.energy === value
                    ? 'bg-[#7A9E78] text-white shadow-md scale-105'
                    : 'bg-white/50 hover:bg-white/70'
                } disabled:opacity-50`}
              >
                <div className={`text-lg ${
                  data.energy === value 
                    ? 'text-white' 
                    : energyEmojis[value as keyof typeof energyEmojis].color
                }`}>
                  🔋
                </div>
                <div className={`text-[10px] font-medium ${
                  data.energy === value ? 'text-white' : 'text-[#6B4C3B]'
                }`}>
                  {value}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Message */}
      {hasTrackedToday ? (
        <div className="bg-[#7A9E78]/20 border border-[#7A9E78]/30 rounded-xl p-3 text-center">
          <p className="text-[#6B4C3B] font-medium text-sm">
            ✅ Dnes si už zaznamenala náladu a energiu
          </p>
          <p className="text-[#8B7560] text-xs mt-1">
            Môžeš hodnoty kedykoľvek upraviť
          </p>
        </div>
      ) : (
        <div className="bg-[#B8864A]/20 border border-[#B8864A]/30 rounded-xl p-3 text-center">
          <p className="text-[#6B4C3B] font-medium text-sm">
            💭 Zaznamenaj si dnes náladu a energiu
          </p>
        </div>
      )}

      {/* Weekly Summary Hint */}
      <div className="text-center text-xs text-[#8B7560]">
        <p>Pravidelné sledovanie ti pomôže rozoznať vzorce v nálade a energii</p>
      </div>
    </div>
  );
}