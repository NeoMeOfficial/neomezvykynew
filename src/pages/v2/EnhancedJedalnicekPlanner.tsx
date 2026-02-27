import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, ChefHat, Clock, Utensils, Coffee, Cookie } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import ProgressRing from '../../components/v2/ProgressRing';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';
import { usePaywall } from '../../hooks/usePaywall';
import { MealPlannerBanner } from '../../components/v2/paywall/MealPlannerBanner';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';
import { colors } from '../../theme/warmDusk';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
const DAYS_FULL = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  image: string;
  tags: string[];
}

interface DayMeals {
  [key: string]: Meal | null;
}

interface WeekPlan {
  [day: number]: DayMeals;
}

// Sample meal database with real recipes
const mealDatabase: Meal[] = [
  // Breakfast options
  {
    id: 'b1',
    type: 'breakfast',
    title: 'Proteínová kaša s ovocím',
    kcal: 320,
    protein: 18,
    carbs: 42,
    fats: 8,
    prepTime: 10,
    difficulty: 'easy',
    ingredients: ['60g ovosných vločiek', '1 banán', '1 PL mandlového masla', '200ml rastlinné mlieko', '1 PL chia semienok', 'med na dochutenie'],
    instructions: [
      'Ovosné vločky zalej teplým rastlinným mliekom',
      'Pridaj narezaný banán a chia semienka',
      'Zamieš mandlové maslo',
      'Dochuť medom podľa chuti',
      'Nechaj 5 minút odležať'
    ],
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop',
    tags: ['healthy', 'protein', 'fiber']
  },
  {
    id: 'b2', 
    type: 'breakfast',
    title: 'Vajíčková omeleta so zeleninou',
    kcal: 285,
    protein: 22,
    carbs: 8,
    fats: 18,
    prepTime: 15,
    difficulty: 'medium',
    ingredients: ['3 vajcia', '1 paprika', '1 rajčina', '50g špenátu', '30g syra', 'olivový olej', 'soľ, korenie'],
    instructions: [
      'Rozšľahaj vajcia so soľou a korením',
      'Na oleji opraž nakrájanú papriku',
      'Pridaj rajčinu a špenát',
      'Nalej vajcia a nechaj stuhhnúť',
      'Posyp syrom a preloš na polovicu'
    ],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    tags: ['protein', 'vegetables', 'keto-friendly']
  },
  // Lunch options
  {
    id: 'l1',
    type: 'lunch', 
    title: 'Grécky šalát s kuracím',
    kcal: 450,
    protein: 35,
    carbs: 12,
    fats: 28,
    prepTime: 20,
    difficulty: 'easy',
    ingredients: ['200g kuracích pŕs', '1 uhorka', '2 rajčiny', '100g feta syra', 'čierne olivy', 'červená cibuľa', 'olivový olej', 'oregano'],
    instructions: [
      'Kuracím prsá ochúť a opraž do zlatista',
      'Nakrájaj uhorky a rajčiny na kocky',
      'Pridaj nakrájanú cibuľu a olivy',
      'Rozdroň feta syr',
      'Zalej olivovým olejom a posyp oreganom',
      'Pridaj nakrájané kurča'
    ],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    tags: ['mediterranean', 'protein', 'fresh']
  },
  {
    id: 'l2',
    type: 'lunch',
    title: 'Quinoa bowl s pečenou zeleninou',
    kcal: 390,
    protein: 16,
    carbs: 58,
    fats: 12,
    prepTime: 35,
    difficulty: 'medium',
    ingredients: ['100g quinoa', '1 batát', '1 cuketa', '1 paprika', 'cherry rajčiny', 'avokádo', 'tahini', 'citrón'],
    instructions: [
      'Quinoa uvarej podľa návodu',
      'Zeleninu nakrájaj a peč 25 minút na 200°C',
      'Priprav tahini dresing s citrónom',
      'Do misky daj quinoa, zeleninu a avokádo',
      'Polej dresingom'
    ],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    tags: ['vegan', 'fiber', 'wholesome']
  },
  // Dinner options
  {
    id: 'd1',
    type: 'dinner',
    title: 'Losos s pečenou brokolicou',
    kcal: 380,
    protein: 42,
    carbs: 15,
    fats: 18,
    prepTime: 25,
    difficulty: 'easy',
    ingredients: ['180g lososa', '300g brokolice', 'olivový olej', 'cesnak', 'citrón', 'soľ, korenie'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    instructions: [
      'Losos ochúť a peč 15 minút na 180°C',
      'Brokolicu rozdelím na ružičky',
      'Zmieša s olejom a cesnakom',
      'Peč spolu s lososom posledných 10 minút',
      'Polej citrónovou šťavou'
    ],
    tags: ['omega-3', 'protein', 'healthy']
  },
  // Snack options  
  {
    id: 's1',
    type: 'snack',
    title: 'Proteínová tyčinka domáca',
    kcal: 180,
    protein: 12,
    carbs: 18,
    fats: 8,
    prepTime: 15,
    difficulty: 'easy',
    ingredients: ['30g proteínového prášku', '2 PL mandlového masla', '1 PL medu', 'ovosné vločky', 'chia semienka'],
    instructions: [
      'Zmieša proteínový prášok s mandlovým maslom',
      'Pridaj med a ovosné vločky',
      'Vytvaruj tyčinky a vychlaď'
    ],
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
    tags: ['protein', 'homemade', 'energy']
  }
];

export default function EnhancedJedalnicekPlanner() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(2);
  const [weekPlan, setWeekPlan] = useState<WeekPlan>({});
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const { canUseMealPlanner } = useSubscription();
  const { paywallState, showMealPlannerPaywall, closePaywall, handleUpgrade } = usePaywall();

  // Initialize with some meals
  useEffect(() => {
    const initialPlan: WeekPlan = {};
    for (let day = 0; day < 7; day++) {
      initialPlan[day] = {
        breakfast: day < 3 ? mealDatabase.find(m => m.type === 'breakfast') || null : null,
        lunch: day < 2 ? mealDatabase.find(m => m.type === 'lunch') || null : null,
        dinner: day === 0 ? mealDatabase.find(m => m.type === 'dinner') || null : null,
        snack: day < 4 ? mealDatabase.find(m => m.type === 'snack') || null : null,
      };
    }
    setWeekPlan(initialPlan);
  }, []);

  const getCurrentDayMeals = () => weekPlan[activeDay] || {};

  const getTotalCalories = () => {
    const meals = getCurrentDayMeals();
    return Object.values(meals).reduce((total, meal) => total + (meal?.kcal || 0), 0);
  };

  const getTotalMacros = () => {
    const meals = getCurrentDayMeals();
    return Object.values(meals).reduce((total, meal) => ({
      protein: total.protein + (meal?.protein || 0),
      carbs: total.carbs + (meal?.carbs || 0),
      fats: total.fats + (meal?.fats || 0),
    }), { protein: 0, carbs: 0, fats: 0 });
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Coffee className="w-5 h-5" />;
      case 'lunch': return <Utensils className="w-5 h-5" />;
      case 'dinner': return <ChefHat className="w-5 h-5" />;
      case 'snack': return <Cookie className="w-5 h-5" />;
      default: return <Utensils className="w-5 h-5" />;
    }
  };

  const getMealTypeName = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Raňajky';
      case 'lunch': return 'Obed';
      case 'dinner': return 'Večera';
      case 'snack': return 'Snack';
      default: return type;
    }
  };

  const addMealToDay = (meal: Meal) => {
    if (!selectedMealType) return;
    
    setWeekPlan(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        [selectedMealType]: meal
      }
    }));
    
    setShowMealSelector(false);
    setSelectedMealType(null);
  };

  const removeMeal = (mealType: string) => {
    setWeekPlan(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        [mealType]: null
      }
    }));
  };

  const openMealSelector = (mealType: string) => {
    if (!canUseMealPlanner) {
      showMealPlannerPaywall();
      return;
    }
    
    setSelectedMealType(mealType);
    setShowMealSelector(true);
  };

  const macros = getTotalMacros();
  const totalCalories = getTotalCalories();

  if (showMealSelector && selectedMealType) {
    const availableMeals = mealDatabase.filter(meal => meal.type === selectedMealType);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMealSelector(false)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-semibold text-[#2E2218]">
            Vyber {getMealTypeName(selectedMealType)}
          </h1>
        </div>

        <div className="grid gap-4">
          {availableMeals.map((meal) => (
            <GlassCard key={meal.id} className="p-4 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => addMealToDay(meal)}>
              <div className="flex gap-4">
                <img src={meal.image} alt={meal.title} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2E2218] mb-1">{meal.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#6B4C3B] mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {meal.prepTime} min
                    </span>
                    <span>{meal.kcal} kcal</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-white/20">
                      {meal.difficulty === 'easy' ? 'Ľahké' : meal.difficulty === 'medium' ? 'Stredné' : 'Náročné'}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span>P: {meal.protein}g</span>
                    <span>C: {meal.carbs}g</span>
                    <span>F: {meal.fats}g</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#2E2218]">Jedálniček</h1>
      </div>

      {/* Show paywall for free users */}
      {!canUseMealPlanner && (
        <MealPlannerBanner onPurchase={showMealPlannerPaywall} />
      )}

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS.map((day, index) => (
          <button
            key={day}
            onClick={() => setActiveDay(index)}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl font-medium transition-all ${
              activeDay === index
                ? 'text-white shadow-lg'
                : 'text-[#6B4C3B] hover:bg-white/10'
            }`}
            style={activeDay === index ? {
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.mysel} 100%)`
            } : {}}
          >
            <div className="text-center">
              <div className="text-sm">{day}</div>
              <div className="text-xs opacity-80">{new Date().getDate() + index - activeDay}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Daily Overview */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#2E2218]">
            {DAYS_FULL[activeDay]}
          </h2>
          <div className="text-right text-sm text-[#6B4C3B]">
            <div className="font-semibold">{totalCalories} kcal</div>
            <div>z 2000 kcal</div>
          </div>
        </div>

        {/* Macros Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <ProgressRing progress={(macros.protein / 120) * 100} size={60} strokeWidth={6} />
            <div className="mt-2 text-sm">
              <div className="font-semibold text-[#2E2218]">{macros.protein}g</div>
              <div className="text-[#6B4C3B]">Proteíny</div>
            </div>
          </div>
          <div className="text-center">
            <ProgressRing progress={(macros.carbs / 250) * 100} size={60} strokeWidth={6} />
            <div className="mt-2 text-sm">
              <div className="font-semibold text-[#2E2218]">{macros.carbs}g</div>
              <div className="text-[#6B4C3B]">Sacharidy</div>
            </div>
          </div>
          <div className="text-center">
            <ProgressRing progress={(macros.fats / 70) * 100} size={60} strokeWidth={6} />
            <div className="mt-2 text-sm">
              <div className="font-semibold text-[#2E2218]">{macros.fats}g</div>
              <div className="text-[#6B4C3B]">Tuky</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Meals */}
      <div className="space-y-4">
        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
          const meal = getCurrentDayMeals()[mealType];
          
          return (
            <GlassCard key={mealType} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-[#6B4C3B]">
                    {getMealTypeIcon(mealType)}
                  </div>
                  <h3 className="font-semibold text-[#2E2218]">
                    {getMealTypeName(mealType)}
                  </h3>
                </div>
                
                {meal ? (
                  <button
                    onClick={() => removeMeal(mealType)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Odstrániť
                  </button>
                ) : (
                  <button
                    onClick={() => openMealSelector(mealType)}
                    className="flex items-center gap-1 text-[#6B4C3B] hover:text-[#2E2218] text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Pridať
                  </button>
                )}
              </div>

              {meal ? (
                <div className="flex gap-3">
                  <img src={meal.image} alt={meal.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-medium text-[#2E2218] mb-1">{meal.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-[#6B4C3B]">
                      <span>{meal.kcal} kcal</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.prepTime} min
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-[#6B4C3B] mt-1">
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fats}g</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition-colors"
                  style={{ opacity: canUseMealPlanner ? 1 : 0.5 }}
                  onClick={() => openMealSelector(mealType)}
                >
                  <Plus className="w-8 h-8 text-[#6B4C3B] mx-auto mb-2" />
                  <p className="text-[#6B4C3B] text-sm">
                    {canUseMealPlanner ? `Pridať ${getMealTypeName(mealType).toLowerCase()}` : 'Potrebné predplatné'}
                  </p>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallState.isVisible}
        onClose={closePaywall}
        onUpgrade={handleUpgrade}
        feature="meal-planner"
      />
    </div>
  );
}