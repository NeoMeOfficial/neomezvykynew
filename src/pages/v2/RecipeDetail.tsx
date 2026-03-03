import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Users, Heart, Plus, Check } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { RecipePromoBanner } from '../../components/v2/RecipePromoBanner';
import { colors } from '../../theme/warmDusk';
import { useFavorites } from '../../hooks/useFavorites';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';

const ingredients = [
  'Ovsené vločky 80g',
  'Proteínový prášok 30g',
  'Banán 1ks',
  'Čučoriedky 50g',
  'Mandľové mlieko 200ml',
  'Med 1 lyžička',
  'Chia semienka 10g',
];

const steps = [
  'Ovsené vločky zalejte mandľovým mliekom a nechajte 5 minút.',
  'Pridajte proteínový prášok a dobre premiešajte.',
  'Nakrájajte banán na kolieska.',
  'Ozdobte čučoriedkami, banánom a chia semienkami.',
  'Pokvapkajte medom a podávajte.',
];

// Mock recipe data - in real app this would come from API
const mockRecipe = {
  id: 1,
  title: 'Proteínová kaša s ovocím',
  image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop',
  time: '15 min',
  kcal: 320,
  servings: 1,
  category: 'Raňajky',
  description: 'Výživná ranná kaša s vysokým obsahom bielkovín.',
};

export default function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { canUseMealPlanner } = useSubscription();
  const [checked, setChecked] = useState<boolean[]>(new Array(ingredients.length).fill(false));
  const [addedToMealPlan, setAddedToMealPlan] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);

  const recipe = mockRecipe; // In real app, fetch by ID
  const isRecipeFavorite = isFavorite(recipe.id);

  // Track recipe views and show banner every 10th view
  useEffect(() => {
    const viewKey = `recipe-views-${id || 'default'}`;
    const currentViews = parseInt(localStorage.getItem(viewKey) || '0', 10);
    const newViewCount = currentViews + 1;
    localStorage.setItem(viewKey, newViewCount.toString());

    // Show banner every 10th view
    if (newViewCount % 10 === 0) {
      setShowPromoBanner(true);
    }
  }, [id]);

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      time: recipe.time,
      kcal: recipe.kcal,
      category: recipe.category,
    });
  };

  const handleAddToMealPlan = () => {
    if (!canUseMealPlanner) {
      // Redirect to meal planner purchase
      navigate('/jedalnicek');
      return;
    }

    // In real app, this would integrate with the meal planner system
    // For now, just show success state
    setAddedToMealPlan(true);

    // Show success message
    alert(`"${recipe.title}" bolo pridané do jedálnička!`);

    // Reset after 3 seconds
    setTimeout(() => {
      setAddedToMealPlan(false);
    }, 3000);
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>
              {recipe.title}
            </h1>
            <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
              {recipe.category} • {recipe.time} • {recipe.kcal} kcal
            </p>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className="p-1 hover:bg-white/25 rounded-lg transition-colors"
          >
            <Heart
              className="w-5 h-5"
              strokeWidth={1.5}
              fill={isRecipeFavorite ? colors.periodka : 'none'}
              style={{ color: isRecipeFavorite ? colors.periodka : '#6B4C3B' }}
            />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop"
          alt="Recipe"
          className="w-full h-56 object-cover"
        />
      </div>
      {/* Recipe Info */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B4C3B' }}>
          {recipe.description}
        </p>

        {isRecipeFavorite && (
          <p className="text-sm mb-4 flex items-center gap-1.5" style={{ color: colors.periodka }}>
            <Heart size={14} fill={colors.periodka} />
            V obľúbených
          </p>
        )}

        {/* Meta pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { icon: Clock, label: recipe.time },
            { icon: Flame, label: `${recipe.kcal} kcal` },
            { icon: Users, label: `${recipe.servings} porcia` },
          ].map((m) => (
            <span
              key={m.label}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white/20 text-gray-600"
            >
              <m.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Add to Meal Plan Button */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <button
          onClick={handleAddToMealPlan}
          disabled={addedToMealPlan}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            addedToMealPlan
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-[#7A9E78] text-white hover:bg-[#6B8A69] active:scale-[0.98]'
          }`}
        >
          {addedToMealPlan ? (
            <>
              <Check size={16} />
              Pridané do jedálnička
            </>
          ) : (
            <>
              <Plus size={16} />
              {canUseMealPlanner ? 'Pridať do jedálnička' : 'Získať jedálniček'}
            </>
          )}
        </button>
      </div>

      {/* Ingredients */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
            <Users className="w-4 h-4" style={{ color: '#7A9E78' }} />
          </div>
          <h2 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Ingrediencie</h2>
        </div>

        <div className="space-y-3">
          {ingredients.map((ing, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer p-2 -m-2 rounded-xl hover:bg-white/20" onClick={() => toggle(i)}>
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
                style={{
                  backgroundColor: checked[i] ? colors.telo : 'transparent',
                  borderColor: checked[i] ? colors.telo : `${colors.telo}60`,
                }}
              >
                {checked[i] && <span className="text-xs font-bold text-white">✓</span>}
              </div>
              <span className={`text-sm ${checked[i] ? 'line-through' : ''}`} style={{ color: checked[i] ? colors.textTertiary : colors.textPrimary }}>
                {ing}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Clock className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h2 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Postup</h2>
        </div>
        
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#6B4C3B] text-white text-xs flex items-center justify-center flex-shrink-0 font-semibold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed flex-1 text-gray-700">
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
            <Flame className="w-4 h-4" style={{ color: '#B8864A' }} />
          </div>
          <h2 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Výživové hodnoty</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Bielkoviny', value: '28g' },
            { label: 'Sacharidy', value: '42g' },
            { label: 'Tuky', value: '8g' },
          ].map((n) => (
            <div 
              key={n.label} 
              className="p-3 bg-white/20 rounded-xl text-center"
            >
              <span className="text-lg font-bold block" style={{ color: '#2E2218' }}>
                {n.value}
              </span>
              <span className="text-xs text-gray-600">
                {n.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Promo Banner - appears every 10th recipe view */}
      {showPromoBanner && (
        <RecipePromoBanner
          onDismiss={() => setShowPromoBanner(false)}
          onViewMore={() => {
            setShowPromoBanner(false);
            navigate('/recepty');
          }}
        />
      )}
    </div>
  );
}
