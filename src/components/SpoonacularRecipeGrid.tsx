import React, { useState } from 'react';
import { useRecipeSearch, useRandomRecipes } from '../hooks/useSpoonacular';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Clock, Users, Utensils } from 'lucide-react';

interface SpoonacularRecipeGridProps {
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onRecipeSelect?: (recipeId: number) => void;
}

// Map Spoonacular data to your existing Recipe interface format
export function mapSpoonacularToLocal(spoonacularRecipe: any) {
  return {
    id: spoonacularRecipe.id.toString(),
    title: spoonacularRecipe.title,
    category: getCategoryFromDishTypes(spoonacularRecipe.dishTypes) as any,
    description: spoonacularRecipe.summary?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || '',
    prepTime: spoonacularRecipe.readyInMinutes,
    servings: spoonacularRecipe.servings,
    calories: getNutrientValue(spoonacularRecipe, 'Calories'),
    protein: getNutrientValue(spoonacularRecipe, 'Protein'),
    carbs: getNutrientValue(spoonacularRecipe, 'Carbohydrates'),
    fat: getNutrientValue(spoonacularRecipe, 'Fat'),
    fiber: getNutrientValue(spoonacularRecipe, 'Fiber'),
    ingredients: spoonacularRecipe.extendedIngredients?.map((ing: any) => ({
      name: ing.name,
      amount: `${ing.amount} ${ing.unit}`
    })) || [],
    steps: spoonacularRecipe.instructions?.split('.').filter((s: string) => s.trim()) || [],
    allergens: extractAllergens(spoonacularRecipe.diets),
    dietary: spoonacularRecipe.diets || [],
    tags: [...(spoonacularRecipe.cuisines || []), ...(spoonacularRecipe.dishTypes || [])],
    image: spoonacularRecipe.image,
    difficulty: spoonacularRecipe.readyInMinutes <= 30 ? 'easy' as const : 'medium' as const,
  };
}

function getCategoryFromDishTypes(dishTypes: string[] = []): string {
  const dishType = dishTypes[0]?.toLowerCase();
  if (dishType?.includes('breakfast')) return 'ranajky';
  if (dishType?.includes('lunch')) return 'obed';
  if (dishType?.includes('dinner')) return 'vecera';
  return 'snack';
}

function getNutrientValue(recipe: any, nutrientName: string): number {
  const nutrient = recipe.nutrition?.nutrients?.find((n: any) => 
    n.name.toLowerCase().includes(nutrientName.toLowerCase())
  );
  return Math.round(nutrient?.amount || 0);
}

function extractAllergens(diets: string[] = []): string[] {
  const allergenMap: Record<string, string> = {
    'gluten free': 'bezlepkové',
    'dairy free': 'bez mlieka',
    'vegetarian': 'vegetariánske',
    'vegan': 'vegánske',
    'nut free': 'bez orechov'
  };
  
  return diets.map(diet => allergenMap[diet.toLowerCase()] || diet).filter(Boolean);
}

export function SpoonacularRecipeGrid({ category, onRecipeSelect }: SpoonacularRecipeGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<string>('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Get random recipes for initial display
  const { 
    data: randomRecipes, 
    isLoading: isLoadingRandom 
  } = useRandomRecipes(category, !searchTriggered);

  // Search recipes when user searches
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    refetch: triggerSearch
  } = useRecipeSearch({
    query: searchQuery,
    type: category,
    diet: selectedDiet || undefined,
    number: 12
  }, searchTriggered);

  const handleSearch = () => {
    if (searchQuery.trim() || selectedDiet) {
      setSearchTriggered(true);
      triggerSearch();
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDiet('');
    setSearchTriggered(false);
  };

  const recipes = searchTriggered ? searchResults?.results : randomRecipes?.recipes;
  const isLoading = searchTriggered ? isLoadingSearch : isLoadingRandom;

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Hľadať recepty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Select value={selectedDiet} onValueChange={setSelectedDiet}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Diétne obmedzenia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Všetko</SelectItem>
              <SelectItem value="vegetarian">Vegetariánske</SelectItem>
              <SelectItem value="vegan">Vegánske</SelectItem>
              <SelectItem value="gluten free">Bezlepkové</SelectItem>
              <SelectItem value="dairy free">Bez mlieka</SelectItem>
              <SelectItem value="ketogenic">Ketogénne</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hľadať
          </Button>
          
          {searchTriggered && (
            <Button variant="outline" onClick={handleReset}>
              Resetovať
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recipes && recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onRecipeSelect?.(recipe.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2">
                  {recipe.diets?.map((diet) => (
                    <Badge key={diet} variant="secondary" className="mb-1">
                      {diet}
                    </Badge>
                  ))}
                </div>
              </div>

              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2 line-clamp-2">
                  {recipe.title}
                </CardTitle>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.readyInMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} porcie</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Utensils className="h-4 w-4" />
                    <span>{getNutrientValue(recipe, 'Calories')} kcal</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2">
                  {recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTriggered ? 'Žiadne recepty nenájdené. Skúste iné kritériá.' : 'Načítavajú sa recepty...'}
          </p>
        </div>
      )}
    </div>
  );
}

export default SpoonacularRecipeGrid;