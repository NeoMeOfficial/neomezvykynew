import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight } from 'lucide-react';
import { useUniversalFavorites } from '../../../hooks/useUniversalFavorites';

export default function FavoritesShortcut() {
  const { getFavoriteCounts } = useUniversalFavorites();
  const navigate = useNavigate();
  const counts = getFavoriteCounts();

  if (counts.total === 0) {
    return null; // Don't show if no favorites
  }

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4">
      <button
        onClick={() => navigate('/oblubene')}
        className="w-full flex items-center gap-3 text-left"
      >
        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-red-500" fill="currentColor" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[#6B4C3B] font-semibold text-sm">Obľúbené</h3>
          <p className="text-[#8B7560] text-xs">
            {counts.total} uložených položiek
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick count breakdown */}
          <div className="flex gap-1">
            {counts.recipe > 0 && (
              <span className="text-[10px] bg-[#B8864A]/20 text-[#B8864A] px-1.5 py-0.5 rounded-full">
                {counts.recipe}R
              </span>
            )}
            {counts.workout > 0 && (
              <span className="text-[10px] bg-[#7A9E78]/20 text-[#7A9E78] px-1.5 py-0.5 rounded-full">
                {counts.workout}C
              </span>
            )}
            {counts.meditation > 0 && (
              <span className="text-[10px] bg-[#A8848B]/20 text-[#A8848B] px-1.5 py-0.5 rounded-full">
                {counts.meditation}M
              </span>
            )}
          </div>
          <ChevronRight size={16} className="text-[#8B7560]" />
        </div>
      </button>
    </div>
  );
}