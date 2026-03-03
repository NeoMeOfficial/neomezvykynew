import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Lock, Heart } from 'lucide-react';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';
import { usePaywall } from '../../hooks/usePaywall';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';
import { useUniversalFavorites } from '../../hooks/useUniversalFavorites';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { colors } from '../../theme/warmDusk';

const categoryNames = ['Raňajky', 'Hlavné jedlá a polievky', 'Dobrotky', 'Smoothie & Nápoje', 'Snacky'];
const FAVORITES_KEY = 'Obľúbené';

const recipes: Record<string, { id: number; title: string; time: string; kcal: number; img: string }[]> = {
  'Raňajky': [
    { id: 1, title: 'Proteínová kaša s ovocím', time: '15 min', kcal: 320, img: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop' },
    { id: 2, title: 'Avokádový toast s vajíčkom', time: '10 min', kcal: 280, img: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=500&fit=crop' },
    { id: 6, title: 'Lievance s čučoriedkami', time: '20 min', kcal: 350, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop' },
  ],
  'Hlavné jedlá a polievky': [
    { id: 3, title: 'Grécky šalát s fetou', time: '15 min', kcal: 250, img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=500&fit=crop' },
    { id: 4, title: 'Lososové filé s quinoou', time: '25 min', kcal: 450, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=500&fit=crop' },
    { id: 7, title: 'Krémová brokolicová polievka', time: '30 min', kcal: 210, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=500&fit=crop' },
  ],
  'Dobrotky': [
    { id: 8, title: 'Proteínové guľky', time: '15 min', kcal: 180, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=500&fit=crop' },
    { id: 9, title: 'Banánový chlieb', time: '45 min', kcal: 290, img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&h=500&fit=crop' },
  ],
  'Smoothie & Nápoje': [
    { id: 5, title: 'Zelené smoothie', time: '5 min', kcal: 180, img: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800&h=500&fit=crop' },
    { id: 10, title: 'Tropical mango smoothie', time: '5 min', kcal: 210, img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&h=500&fit=crop' },
  ],
  'Snacky': [
    { id: 11, title: 'Hummus s mrkvou', time: '10 min', kcal: 150, img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&h=500&fit=crop' },
    { id: 12, title: 'Ořechový mix s brusnicami', time: '2 min', kcal: 200, img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&h=500&fit=crop' },
  ],
};

export default function Recepty() {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || categoryNames[0];
  
  // Check if showing favorites
  const showingFavorites = catParam === FAVORITES_KEY;
  const defaultActive = showingFavorites ? -1 : Math.max(0, categoryNames.indexOf(catParam));
  
  const [active, setActive] = useState(defaultActive);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { getRemainingCount, limits } = useSubscription();
  const { paywallState, showContentPaywall, closePaywall, handleUpgrade, getContentWarning } = usePaywall();
  const { getFavoritesByType } = useUniversalFavorites();

  // Get recipes based on active tab
  const favRecipes = getFavoritesByType('recipe');
  const allRecipes = showingFavorites ? 
    favRecipes.map(f => ({ id: f.id, title: f.title, time: f.duration || '15 min', kcal: f.kcal || 250, img: f.image || '' })) :
    recipes[categoryNames[active]] || [];
  
  // Apply content limits for free users (but not for favorites)
  const currentRecipes = useMemo(() => {
    if (showingFavorites) return allRecipes; // No limits on favorites
    const maxRecipes = limits.maxRecipes;
    if (maxRecipes === -1) return allRecipes; // unlimited
    return allRecipes.slice(0, maxRecipes);
  }, [allRecipes, limits.maxRecipes, showingFavorites]);

  const hasMoreRecipes = !showingFavorites && (allRecipes.length > currentRecipes.length);

  // Load warning message asynchronously
  useEffect(() => {
    const loadWarning = async () => {
      const warning = await getContentWarning('recipes');
      setWarningMessage(warning);
    };
    loadWarning();
  }, [getContentWarning]);

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/strava')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <Clock className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Recepty</h1>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {/* Favorites pill */}
          <button
            onClick={() => {
              setActive(-1);
              navigate(`?cat=${encodeURIComponent(FAVORITES_KEY)}`);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              showingFavorites
                ? 'bg-[#C27A6E] text-white'
                : 'bg-white/25 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart size={14} fill={showingFavorites ? 'white' : 'none'} />
            {FAVORITES_KEY} ({favRecipes.length})
          </button>
          
          {categoryNames.map((c, i) => (
            <button
              key={c}
              onClick={() => {
                setActive(i);
                navigate(`?cat=${encodeURIComponent(c)}`);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                active === i && !showingFavorites
                  ? 'bg-[#6B4C3B] text-white'
                  : 'bg-white/25 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Warning banner */}
      {warningMessage && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <p className="text-sm font-medium text-orange-700 flex items-center gap-2">
            ⚠️ {warningMessage}
          </p>
        </div>
      )}

      {/* Recipe Cards */}
      <div className="space-y-4">
        {currentRecipes.map((r) => {
          const currentCategory = showingFavorites ? favRecipes.find(f => f.id === r.id)?.category || categoryNames[0] : categoryNames[active];
          
          return (
            <div key={r.id} className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden">
              <button
                onClick={() => navigate(`/recept/${r.id}`)}
                className="relative w-full h-52 block active:scale-[0.98] transition-transform text-left"
              >
                <img src={r.img} alt={r.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-lg font-bold leading-tight drop-shadow-lg">{r.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />{r.time}
                    </span>
                    <span className="text-white/80 text-xs flex items-center gap-1">
                      <Flame className="w-3 h-3" />{r.kcal} kcal
                    </span>
                  </div>
                </div>
              </button>
              
              {/* Favorite button overlay */}
              <div className="absolute top-3 right-3">
                <FavoriteButton
                  itemId={r.id}
                  type="recipe"
                  title={r.title}
                  image={r.img}
                  duration={r.time}
                  kcal={r.kcal}
                  category={currentCategory}
                  size="md"
                  className="bg-black/60 backdrop-blur-[10px] text-white hover:bg-black/70"
                />
              </div>
            </div>
          );
        })}

        {/* Locked recipes for free users */}
        {hasMoreRecipes && allRecipes.slice(currentRecipes.length).map((r) => (
          <div key={`locked-${r.id}`} className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden opacity-75">
            <button
              onClick={() => showContentPaywall('recipes')}
              className="relative w-full h-52 block active:scale-[0.98] transition-transform text-left"
            >
              <img src={r.img} alt={r.title} className="absolute inset-0 w-full h-full object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#B8864A]/90 flex items-center justify-center">
                  <Lock size={24} className="text-white" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-lg font-bold leading-tight drop-shadow-lg">{r.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-white/70 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
                  <span className="text-white/70 text-xs flex items-center gap-1"><Flame className="w-3 h-3" />{r.kcal} kcal</span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Jedálniček na mieru promo banner */}
      {!localStorage.getItem('neome-meal-plan') && (
        <button
          onClick={() => navigate('/jedalnicek-promo')}
          className="w-full rounded-2xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform"
          style={{ background: `linear-gradient(135deg, ${colors.strava}, #5A8A58)` }}
        >
          <div className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🥗</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm">Jedálniček na mieru</p>
              <p className="text-white/80 text-xs mt-0.5">Personalizovaný 7-dňový plán na základe tvojich cieľov a preferencií</p>
            </div>
            <div className="text-white/80 text-lg">→</div>
          </div>
        </button>
      )}

      {/* Paywall modal */}
      <PaywallModal
        isOpen={paywallState.isOpen}
        onClose={closePaywall}
        title={paywallState.title}
        message={paywallState.message}
        limitType={paywallState.limitType}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
