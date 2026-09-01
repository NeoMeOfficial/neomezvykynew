import { recipeCategoryLabel, recipeImage, type SupabaseRecipe } from '@/hooks/useRecipes';
import { Eye, NM } from './neome';

interface Props {
  recipe: SupabaseRecipe;
  fav: boolean;
  onOpen: () => void;
  onToggleFav: () => void;
}

/** List card for a recipe — shared by Recepty and Obľúbené so both look identical. */
export function RecipeListCard({ recipe: r, fav, onOpen, onToggleFav }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpen(); }}
      style={{ cursor: 'pointer', display: 'flex', gap: 14, width: '100%' }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: 92, height: 92, borderRadius: 14, flexShrink: 0 }}>
        <div
          style={{
            width: '100%', height: '100%', borderRadius: 14,
            backgroundImage: `url(${recipeImage(r)})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
        <Eye size={9} style={{ marginBottom: 5 }}>
          {recipeCategoryLabel(r)}{r.prep_minutes ? ` · ${r.prep_minutes} min` : ''}
          {r.kcal ? ` · ${r.kcal} kcal` : ''}
        </Eye>
        <div style={{
          fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500,
          color: NM.DEEP,
          letterSpacing: '-0.008em', lineHeight: 1.25, marginBottom: 6,
        }}>
          {r.name}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          aria-label={fav ? `Odstrániť ${r.name} z obľúbených` : `Pridať ${r.name} do obľúbených`}
          style={{
            all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
            fontFamily: NM.SANS, fontSize: 11, fontWeight: 500, letterSpacing: '0.02em',
            color: fav ? NM.TERRA : NM.SAGE, alignSelf: 'flex-start', padding: '2px 0',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={fav ? NM.TERRA : 'none'} stroke={fav ? NM.TERRA : NM.SAGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {fav ? 'V obľúbených' : 'Pridať do obľúbených'}
        </button>
      </div>
    </div>
  );
}
