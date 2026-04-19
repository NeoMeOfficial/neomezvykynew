import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Lock, Heart } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { usePaywall } from '../../hooks/usePaywall';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';
import { useUniversalFavorites } from '../../hooks/useUniversalFavorites';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { recipes as recipeDatabase } from '../../data/recipes';
import { colors } from '../../theme/warmDusk';

// Map UI categories to database categories
const categoryMapping: Record<string, string> = {
  'Raňajky': 'ranajky',
  'Hlavné jedlá a polievky': 'obed', // and vecera
  'Snacky': 'snack',
};

const categoryNames = ['Raňajky', 'Hlavné jedlá a polievky', 'Snacky'];

export default function ReceptySpoonacular() {
  const navigate = useNavigate();
  const { isPremium: isSubscribed } = useSubscription();
  const { showContentPaywall, paywallState, closePaywall, handleUpgrade } = usePaywall();
  const { favorites, toggleFavorite, isFavorite } = useUniversalFavorites();
  const [searchParams] = useSearchParams();
  
  // Get selected category from URL params or default to first
  const selectedCategoryParam = searchParams.get('category');
  
  // Debug logging
  console.log('🔍 RECEPTY DEBUG:', {
    url: window.location.href,
    searchParams: Object.fromEntries(searchParams.entries()),
    selectedCategoryParam,
    categoryNames,
    categoryNamesIncludes: selectedCategoryParam ? categoryNames.includes(selectedCategoryParam) : 'N/A'
  });
  
  const initialCategory = selectedCategoryParam && categoryNames.includes(selectedCategoryParam) 
    ? selectedCategoryParam 
    : categoryNames[0];
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  console.log('📂 Selected category:', selectedCategory);

  // Add favorites as a category option
  const allCategories = ['Obľúbené', ...categoryNames];

  const handleRecipeSelect = (recipeId: string) => {
    if (!isSubscribed) {
      showContentPaywall('recipes');
      return;
    }
    
    // Navigate to recipe detail with recipe ID
    navigate(`/recepty/${recipeId}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (category !== categoryNames[0]) {
      newSearchParams.set('category', category);
    } else {
      newSearchParams.delete('category');
    }
    navigate({ search: newSearchParams.toString() }, { replace: true });
  };

  // Get recipes by category
  const getRecipesByCategory = (uiCategory: string) => {
    if (uiCategory === 'Obľúbené') {
      return []; // Empty for now - favorites will be implemented later
    }
    
    if (uiCategory === 'Hlavné jedlá a polievky') {
      return recipeDatabase.filter(r => r.category === 'obed' || r.category === 'vecera');
    }
    
    const dbCategory = categoryMapping[uiCategory];
    if (!dbCategory) return [];
    
    return recipeDatabase.filter(r => r.category === dbCategory);
  };

  // Convert to UI format
  const rawRecipes = getRecipesByCategory(selectedCategory);
  const currentRecipes = rawRecipes.map((recipe, index) => ({
    id: recipe.id,
    title: recipe.title,
    time: `${recipe.prepTime} min`,
    kcal: recipe.calories,
    img: recipe.image,
    originalId: recipe.id,
    isSpoonacular: recipe.id.startsWith('spoon-')
  }));
  
  console.log('🍳 Recipe data:', {
    selectedCategory,
    rawRecipesCount: rawRecipes.length,
    currentRecipesCount: currentRecipes.length,
    recipeIds: currentRecipes.map(r => r.id),
    totalInDatabase: recipeDatabase.length
  });

  // Render content
  const renderContent = () => {
    if (selectedCategory === 'Obľúbené') {
      return (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">Zatiaľ nemáte žiadne obľúbené recepty</p>
          <p className="text-gray-400 text-sm mt-2">Kliknite na srdce pri recepte pre pridanie do obľúbených</p>
        </div>
      );
    }

    if (currentRecipes.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Žiadne recepty v tejto kategórii</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 gap-3">
        {currentRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleRecipeSelect(recipe.id)}
            className="bg-white/30 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer hover:bg-white/40 transition-all duration-200 hover:scale-[1.02]"
          >
            {/* Recipe Image */}
            <div className="h-32 relative overflow-hidden">
              <img 
                src={recipe.img} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              {recipe.isSpoonacular && (
                <div className="absolute top-2 left-2">
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    🆕 Spoonacular
                  </div>
                </div>
              )}
              
              {/* Heart Icon for favorites */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(`recipe-${recipe.id}`);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white/90 transition-colors"
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite(`recipe-${recipe.id}`) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>

            {/* Recipe Info */}
            <div className="p-3">
              <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 leading-tight">
                {recipe.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{recipe.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  <span>{recipe.kcal} kcal</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Error handling wrapper  
  try {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* DEBUG INFO */}
      <div className="bg-yellow-100 p-2 text-xs border-b sticky top-0 z-50">
        <strong>🔍 DEBUG:</strong> Category: "{selectedCategory}" | 
        Recipes: {currentRecipes.length} | 
        URL: {window.location.href} |
        Params: {JSON.stringify(Object.fromEntries(searchParams.entries()))}
      </div>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800">Recepty</h1>
          
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Category Pills */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {allCategories.map((category) => {
              const isSelected = selectedCategory === category;
              const isLocked = category !== 'Obľúbené' && !isSubscribed;

              return (
                <button
                  key={category}
                  onClick={() => {
                    if (isLocked) {
                      showContentPaywall('recipes');
                    } else {
                      handleCategoryChange(category);
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-white text-gray-800 shadow-md'
                      : isLocked
                      ? 'bg-white/10 text-gray-500'
                      : 'bg-white/20 text-gray-700 hover:bg-white/30'
                    }
                  `}
                >
                  {category}
                  {isLocked && <Lock className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>🆕 Powered by Spoonacular:</strong> Teraz máte prístup k tisícom profesionálnych receptov s presnou výživovou hodnotou!
          </p>
        </div>

        {renderContent()}
      </div>

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
  } catch (error) {
    console.error('❌ RECEPTY ERROR:', error);
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-red-600 mb-2">Chyba pri načítaní receptov</h2>
          <p className="text-gray-600 mb-4">Niečo sa pokazilo. Skúste znova.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Obnoviť stránku
          </button>
          <div className="mt-4 p-2 bg-red-50 rounded text-xs text-left">
            <strong>Debug info:</strong><br/>
            Error: {error?.message || 'Unknown error'}<br/>
            Category: {selectedCategory}<br/>
            URL: {window.location.href}
          </div>
        </div>
      </div>
    );
  }
}