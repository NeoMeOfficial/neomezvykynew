import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Users, Heart, Plus, Check, FileText, Eye, Loader2 } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { RecipePromoBanner } from '../../components/v2/RecipePromoBanner';
import { colors } from '../../theme/warmDusk';
import { useFavorites } from '../../hooks/useFavorites';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { recipes as recipeDatabase } from '../../data/recipes';
import { useRecipeDetails } from '../../hooks/useSpoonacular';
import { mapSpoonacularToLocal } from '../../components/SpoonacularRecipeGrid';
import { Document, Page } from 'react-pdf';

// Helper function to get local recipe by ID
const getLocalRecipeById = (recipeId: string) => {
  return recipeDatabase.find(recipe => recipe.id === recipeId);
};

// Fallback recipe if none found
const fallbackRecipe = {
  id: 'fallback',
  title: 'Recept nenájdený',
  image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=500&fit=crop',
  prepTime: 15,
  calories: 320,
  servings: 1,
  category: 'ranajky',
  description: 'Recept sa nenašiel v databáze.',
  ingredients: [{ name: 'Recept nenájdený', amount: '' }],
  steps: ['Recept sa nenašiel.'],
  allergens: [],
  dietary: [],
  tags: [],
  difficulty: 'easy' as const,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0
};

export default function RecipeDetailSpoonacular() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { canUseMealPlanner } = useSubscription();
  
  // Determine if this is a Spoonacular ID (numeric) or local ID (string)
  const isSpoonacularId = id && /^\d+$/.test(id);
  const spoonacularId = isSpoonacularId ? parseInt(id!, 10) : 0;
  
  // Load Spoonacular recipe if numeric ID
  const { 
    data: spoonacularRecipe, 
    isLoading, 
    error 
  } = useRecipeDetails(spoonacularId, isSpoonacularId);
  
  // Get the final recipe (either Spoonacular or local)
  const recipe = (() => {
    if (isSpoonacularId && spoonacularRecipe) {
      return mapSpoonacularToLocal(spoonacularRecipe);
    } else if (!isSpoonacularId) {
      return getLocalRecipeById(id || '') || fallbackRecipe;
    }
    return fallbackRecipe;
  })();

  const [checked, setChecked] = useState<boolean[]>(new Array(recipe.ingredients.length).fill(false));
  const [addedToMealPlan, setAddedToMealPlan] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);
  const [viewPdf, setViewPdf] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Update checked array when recipe changes
  useEffect(() => {
    setChecked(new Array(recipe.ingredients.length).fill(false));
  }, [recipe.ingredients.length]);

  const handleToggleIngredient = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  const handleAddToMealPlan = () => {
    if (!canUseMealPlanner) {
      setShowPromoBanner(true);
      return;
    }
    setAddedToMealPlan(true);
    setTimeout(() => setAddedToMealPlan(false), 2000);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  // Show loading state for Spoonacular recipes
  if (isSpoonacularId && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Načítavam recept...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isSpoonacularId && error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">Chyba pri načítaní receptu</p>
          <button
            onClick={() => navigate('/recepty')}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Späť na recepty
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/recepty')}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-800 text-center flex-1 mx-4 truncate">
            {recipe.title}
          </h1>
          
          <button
            onClick={() => toggleFavorite(`recipe-${recipe.id}`)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite(`recipe-${recipe.id}`) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
            />
          </button>
        </div>

        {/* Source indicator */}
        {isSpoonacularId && (
          <div className="px-4 pb-2">
            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
              🆕 Powered by Spoonacular
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Hero Image */}
        <div className="h-64 relative overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Recipe Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {recipe.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    <span>{recipe.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} porcie</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Recipe Description */}
          {recipe.description && (
            <GlassCard>
              <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
            </GlassCard>
          )}

          {/* Nutrition & Allergens */}
          <div className="grid grid-cols-2 gap-4">
            <GlassCard>
              <h3 className="font-semibold text-gray-800 mb-3">Výživové hodnoty</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Proteíny:</span>
                  <span className="font-medium">{recipe.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sacharidy:</span>
                  <span className="font-medium">{recipe.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuky:</span>
                  <span className="font-medium">{recipe.fat}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vláknina:</span>
                  <span className="font-medium">{recipe.fiber}g</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-semibold text-gray-800 mb-3">Diéta a alergény</h3>
              <div className="flex flex-wrap gap-1">
                {[...recipe.allergens, ...recipe.dietary].map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToMealPlan}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors
                ${addedToMealPlan
                  ? 'bg-green-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
                }
              `}
              disabled={addedToMealPlan}
            >
              {addedToMealPlan ? (
                <>
                  <Check className="h-4 w-4" />
                  Pridané!
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Pridať do plánu
                </>
              )}
            </button>

            {/* PDF Toggle - only for local recipes with PDF */}
            {!isSpoonacularId && recipe.pdfPath && (
              <button
                onClick={() => setViewPdf(!viewPdf)}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2
                  ${viewPdf 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/20 text-gray-700 hover:bg-white/30'
                  }
                `}
              >
                {viewPdf ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                {viewPdf ? 'Databáza' : 'PDF'}
              </button>
            )}
          </div>

          {/* PDF Viewer for local recipes */}
          {!isSpoonacularId && viewPdf && recipe.pdfPath && (
            <GlassCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">PDF recept</h3>
                {numPages && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      ←
                    </button>
                    <span className="text-sm">{currentPage} / {numPages}</span>
                    <button
                      onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage >= numPages}
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden">
                <Document
                  file={recipe.pdfPath}
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex justify-center"
                >
                  <Page 
                    pageNumber={currentPage} 
                    width={300}
                    className="shadow-md"
                  />
                </Document>
              </div>
            </GlassCard>
          )}

          {/* Database view (ingredients and steps) */}
          {!viewPdf && (
            <>
              {/* Ingredients */}
              <GlassCard>
                <h3 className="font-semibold text-gray-800 mb-4">Ingrediencie</h3>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <label 
                      key={index} 
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={checked[index]}
                        onChange={() => handleToggleIngredient(index)}
                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                      />
                      <span className={`
                        flex-1 transition-all duration-200
                        ${checked[index] 
                          ? 'line-through text-gray-400' 
                          : 'text-gray-700 group-hover:text-gray-900'
                        }
                      `}>
                        <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
                      </span>
                    </label>
                  ))}
                </div>
              </GlassCard>

              {/* Instructions */}
              <GlassCard>
                <h3 className="font-semibold text-gray-800 mb-4">Postup</h3>
                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </div>

        {/* Promo Banner */}
        {showPromoBanner && (
          <RecipePromoBanner 
            isVisible={showPromoBanner} 
            onClose={() => setShowPromoBanner(false)} 
          />
        )}
      </div>
    </div>
  );
}