import { useNavigate } from 'react-router-dom';
import { Dumbbell, Play, ChevronRight } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

export default function WorkoutDemoShortcut() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4">
      <button
        onClick={() => navigate('/workout-demo')}
        className="w-full flex items-center gap-3 text-left group"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#7A9E78]/20 to-[#7A9E78]/30 rounded-xl flex items-center justify-center">
          <Dumbbell size={20} className="text-[#7A9E78]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[#6B4C3B] font-semibold text-sm mb-1">Workout Demo</h3>
          <p className="text-[#8B7560] text-xs">
            Skús interaktívne cvičenia a získaj +15 bodov
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs bg-[#7A9E78]/20 text-[#7A9E78] px-3 py-1 rounded-full font-medium">
            <Play size={12} />
            Cvičiť
          </div>
          <ChevronRight size={16} className="text-[#8B7560] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </button>
    </div>
  );
}