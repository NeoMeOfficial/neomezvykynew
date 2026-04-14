import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUniversalFavorites, ContentType } from '../../hooks/useUniversalFavorites';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { Heart, ChefHat, Dumbbell, Brain, FileText, Target, ArrowLeft } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

const contentTypeIcons = {
  recipe: ChefHat,
  workout: Dumbbell,
  meditation: Brain,
  article: FileText,
  program: Target
};

const contentTypeLabels = {
  recipe: 'Recepty',
  workout: 'Cvičenia',
  meditation: 'Meditácie',
  article: 'Články',
  program: 'Programy'
};

export default function Oblubene() {
  const navigate = useNavigate();
  const { favorites, getFavoritesByType, getFavoriteCounts } = useUniversalFavorites();
  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  
  const counts = getFavoriteCounts();
  
  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : getFavoritesByType(activeTab);

  const tabs = [
    { key: 'all' as const, label: 'Všetky', count: counts.total, icon: Heart },
    { key: 'recipe' as const, label: 'Recepty', count: counts.recipe, icon: ChefHat },
    { key: 'workout' as const, label: 'Cvičenia', count: counts.workout, icon: Dumbbell },
    { key: 'meditation' as const, label: 'Meditácie', count: counts.meditation, icon: Brain },
    { key: 'article' as const, label: 'Články', count: counts.article, icon: FileText },
    { key: 'program' as const, label: 'Programy', count: counts.program, icon: Target },
  ].filter(tab => tab.key === 'all' || tab.count > 0);

  if (favorites.length === 0) {
    return (
      <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
        {/* Nordic Header */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/domov')} className="p-1">
              <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(194, 122, 110, 0.14)` }}>
                <Heart className="w-4 h-4" style={{ color: '#C27A6E' }} />
              </div>
              <h1 className="text-[22px] font-medium leading-tight" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Obľúbené</h1>
            </div>
          </div>

          {/* Sub-header */}
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
              Tvoje uložené recepty, cvičenia a ďalší obsah
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-white/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: `rgba(194, 122, 110, 0.14)` }}>
            <Heart size={32} style={{ color: '#C27A6E' }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#2E2218' }}>
              Zatiaľ nemáš žiadne obľúbené
            </h3>
            <p className="text-sm max-w-sm mx-auto" style={{ color: '#6B4C3B' }}>
              Keď nájdeš recept, cvičenie alebo meditáciu, ktoré sa ti páčia, 
              klikni na srdiečko a nájdeš ich tu.
            </p>
          </div>
          <div className="pt-2">
            <p className="text-xs italic" style={{ color: '#6B4C3B' }}>
              💡 Tip: Vyhľadaj si srdiečka v receptoch, cvičeniach a meditáciách
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/domov')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(194, 122, 110, 0.14)` }}>
              <Heart className="w-4 h-4" style={{ color: '#C27A6E' }} />
            </div>
            <h1 className="text-[22px] font-medium leading-tight" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Obľúbené</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            {counts.total} uložených položiek
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="grid grid-cols-3 gap-1">
          {tabs.slice(0, 6).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`p-3 rounded-xl text-xs font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#B8864A] text-white shadow-md'
                    : 'text-[#6B4C3B] hover:bg-white/30'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key 
                        ? 'bg-white/30' 
                        : 'bg-[#B8864A]/20 text-[#B8864A]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-4">
        {filteredFavorites.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6 text-center">
            <p className="text-[#8B7560]">
              Žiadne obľúbené v kategórii "{contentTypeLabels[activeTab as ContentType] || 'Všetky'}"
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredFavorites.map((item) => {
              const Icon = contentTypeIcons[item.type];
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Image or Icon */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#B8864A]/20 flex items-center justify-center">
                          <Icon size={24} className="text-[#B8864A]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-[#6B4C3B] text-sm line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-xs text-[#8B7560] mb-2">
                            <span className="flex items-center gap-1">
                              <Icon size={12} />
                              {contentTypeLabels[item.type]}
                            </span>
                            
                            {item.duration && (
                              <span>{item.duration}</span>
                            )}
                            
                            {item.kcal && (
                              <span>{item.kcal} kcal</span>
                            )}
                          </div>
                          
                          {(item.category || item.program) && (
                            <div className="flex gap-2">
                              {item.category && (
                                <span className="text-[10px] bg-[#B8864A]/20 text-[#B8864A] px-2 py-1 rounded-full">
                                  {item.category}
                                </span>
                              )}
                              {item.program && (
                                <span className="text-[10px] bg-[#7A9E78]/20 text-[#7A9E78] px-2 py-1 rounded-full">
                                  {item.program}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <FavoriteButton
                          itemId={item.id}
                          type={item.type}
                          title={item.title}
                          image={item.image}
                          duration={item.duration}
                          kcal={item.kcal}
                          category={item.category}
                          program={item.program}
                          metadata={item.metadata}
                          size="sm"
                          variant="minimal"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}