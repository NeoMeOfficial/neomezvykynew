# 🚀 Spoonacular Integration - Implementation Guide

## 📋 **IMMEDIATE STEPS (Do This Now)**

### 1. **Get Spoonacular API Key** ⚡
```bash
# 1. Visit: https://spoonacular.com/food-api
# 2. Sign up for free account
# 3. Get your API key from dashboard
# 4. Update .env file with real key:
VITE_SPOONACULAR_API_KEY=your_real_api_key_here
```

### 2. **Install New Dependencies** 
```bash
cd projects/neome/neomezvykynew
npm install  # (no new deps needed - using existing React Query)
```

### 3. **Test Integration**
Replace your existing recipe pages with the new Spoonacular components:

```tsx
// In your Recepty page or wherever you show recipes:
import { SpoonacularRecipeGrid } from '../components/SpoonacularRecipeGrid';

// Replace old recipe display with:
<SpoonacularRecipeGrid 
  category="breakfast"  // or "lunch", "dinner", "snack" 
  onRecipeSelect={(recipeId) => {
    // Navigate to recipe detail with Spoonacular ID
    navigate(`/recepty/${recipeId}`);
  }}
/>
```

## 🎯 **PHASE 2: Enhanced Features (Week 2)**

### **Meal Plan Generator Component**
```tsx
// Create src/components/MealPlanGenerator.tsx
import { useGenerateMealPlan } from '../hooks/useSpoonacular';

function MealPlanGenerator() {
  const generatePlan = useGenerateMealPlan();
  
  const handleGenerate = () => {
    generatePlan.mutate({
      timeFrame: 'week',
      targetCalories: 2000,
      diet: 'vegetarian'
    });
  };
  
  return (
    <div>
      <Button onClick={handleGenerate}>
        Generovať týždenný plán
      </Button>
      
      {generatePlan.data && (
        <div>
          {generatePlan.data.meals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### **Shopping List Component**
```tsx
// Create src/components/ShoppingList.tsx
import { useShoppingList } from '../hooks/useSpoonacular';

function ShoppingList({ selectedRecipes }) {
  const generateList = useShoppingList();
  
  const handleGenerateList = () => {
    generateList.mutate(selectedRecipes.map(r => r.id));
  };
  
  return (
    <div>
      <Button onClick={handleGenerateList}>
        Generovať nákupný zoznam
      </Button>
      
      {generateList.data && (
        <ul>
          {generateList.data.map(item => (
            <li key={item.id}>
              {item.name} - {item.amount} {item.unit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 🌍 **PHASE 3: Slovak Localization (Week 3)**

### **Translation Service**
```tsx
// Create src/services/translation.ts
export async function translateRecipe(recipe: SpoonacularRecipe) {
  // Use Google Translate API or similar
  const translatedTitle = await translateText(recipe.title, 'sk');
  const translatedIngredients = await Promise.all(
    recipe.extendedIngredients.map(ing => 
      translateText(ing.name, 'sk')
    )
  );
  
  return {
    ...recipe,
    title: translatedTitle,
    extendedIngredients: recipe.extendedIngredients.map((ing, i) => ({
      ...ing,
      name: translatedIngredients[i]
    }))
  };
}
```

## 💰 **PHASE 4: Cost Optimization (Week 4)**

### **Caching Strategy**
```tsx
// Update src/hooks/useSpoonacular.ts
export function useRecipeSearch(params: RecipeSearchParams = {}, enabled: boolean = true) {
  return useQuery({
    queryKey: SPOONACULAR_KEYS.search(params),
    queryFn: () => spoonacularService.searchRecipes(params),
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache longer
  });
}
```

### **Popular Recipe Preloading**
```tsx
// Cache popular recipes on app start
const popularRecipeIds = [123, 456, 789]; // Your most viewed recipes
popularRecipeIds.forEach(id => {
  queryClient.prefetchQuery({
    queryKey: SPOONACULAR_KEYS.recipe(id),
    queryFn: () => spoonacularService.getRecipeDetails(id)
  });
});
```

## 🔧 **Migration from Current System**

### **Replace Current Recipe Data**
1. **Keep existing Recipe interface** - the mapping function handles conversion
2. **Update RecipeDetail.tsx** to use Spoonacular IDs
3. **Replace recipe database calls** with Spoonacular hooks
4. **Migrate favorite recipes** to use Spoonacular IDs

### **Backwards Compatibility**
```tsx
// Create adapter for existing code
export function adaptRecipeData(recipe: any) {
  // If it's a Spoonacular recipe, convert it
  if (typeof recipe.id === 'number') {
    return mapSpoonacularToLocal(recipe);
  }
  // If it's old format, return as-is
  return recipe;
}
```

## 📊 **Expected Costs (300 users)**

- **Recipe searches**: ~2000 calls/month = $20
- **Recipe details**: ~1500 calls/month = $15  
- **Meal plans**: ~1200 calls/month = $12
- **Random recipes**: ~500 calls/month = $5

**Total: ~$52/month** (vs $0 now, but saves weeks of content creation)

## ✅ **Success Metrics**

- [ ] API key configured and working
- [ ] Recipe search replacing old database
- [ ] Meal plan generator functional
- [ ] Shopping list generation working
- [ ] Slovak translation implemented
- [ ] Caching reducing API calls by 60%+

---

## 🚨 **NEXT ACTIONS:**

1. **Get API key** - do this first!
2. **Test SpoonacularRecipeGrid** component
3. **Replace one recipe page** as proof of concept
4. **Show Sam the working demo**
5. **Plan meal planning UI integration**

This integration will give you **professional recipe data** without the maintenance burden of your current OCR-based system!