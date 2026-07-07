import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, ChevronRight, BookOpen, Dumbbell, Salad, Brain } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { useRecipes, SLOT_LABEL, type SupabaseRecipe } from '@/hooks/useRecipes';
import { programList } from '@/data/programs';

// ids = meditations table slugs — numeric ids used to 404 in /meditacia/:id
const MEDITATIONS = [
  { id: 'ranna-meditacia',   title: 'Ranná meditácia',       category: 'Ráno'   },
  { id: 'hlboky-spanok',     title: 'Hlboký spánok',          category: 'Spánok' },
  { id: 'zvladanie-stresu',  title: 'Zvládanie stresu',       category: 'Stres'  },
  { id: 'fokus',             title: 'Fokus a koncentrácia',   category: 'Fokus'  },
  { id: 'vecerne-uvolnenie', title: 'Večerné uvoľnenie',      category: 'Spánok' },
  { id: 'dychanie-4-7-8',    title: 'Dýchanie 4-7-8',         category: 'Stres'  },
  { id: 'upokojenie-uzkosti', title: 'Upokojenie úzkosti',    category: 'Stres'  },
  { id: 'prijatie-tela',     title: 'Prijatie tela',          category: 'Ráno'   },
];

const SHORTCUTS = [
  { label: 'Recepty', icon: Salad,    accent: '#8B9E88', path: '/recepty' },
  { label: 'Programy', icon: Dumbbell, accent: '#C1856A', path: '/kniznica/telo/programy' },
  { label: 'Meditácie', icon: Brain,  accent: '#A8848B', path: '/meditacie' },
  { label: 'Knižnica', icon: BookOpen, accent: '#B8864A', path: '/kniznica' },
];

type ResultType = 'recipe' | 'program' | 'meditation';

interface Result {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  path: string;
}

function search(q: string, recipes: SupabaseRecipe[]): Result[] {
  const term = q.toLowerCase().trim();
  if (!term) return [];

  const results: Result[] = [];

  recipes.forEach((r) => {
    if (
      r.name.toLowerCase().includes(term) ||
      SLOT_LABEL[r.slot]?.toLowerCase().includes(term)
    ) {
      results.push({
        id: r.id,
        type: 'recipe',
        title: r.name,
        subtitle: SLOT_LABEL[r.slot] ?? r.slot,
        path: `/recept/${r.id}`,
      });
    }
  });

  programList.forEach((p) => {
    if (
      p.name.toLowerCase().includes(term) ||
      (p as any).tagline?.toLowerCase().includes(term)
    ) {
      results.push({
        id: (p as any).slug ?? p.name,
        type: 'program',
        title: p.name,
        subtitle: 'Program',
        path: `/program/${(p as any).slug ?? p.name}/info`,
      });
    }
  });

  MEDITATIONS.forEach((m) => {
    if (m.title.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)) {
      results.push({
        id: m.id,
        type: 'meditation',
        title: m.title,
        subtitle: `Meditácia · ${m.category}`,
        path: `/meditacia/${m.id}`,
      });
    }
  });

  return results.slice(0, 30);
}

const TYPE_LABEL: Record<ResultType, string> = {
  recipe: 'Recept',
  program: 'Program',
  meditation: 'Meditácia',
};

const TYPE_COLOR: Record<ResultType, string> = {
  recipe: '#8B9E88',
  program: '#C1856A',
  meditation: '#A8848B',
};

const DEEP   = '#3D2921';
const MUTED  = 'rgba(61,41,33,0.72)';
const HAIR   = 'rgba(61,41,33,0.08)';
const CREAM2 = '#F1ECE3';
const CREAM  = '#F8F5F0';
const SANS   = '"DM Sans", system-ui, sans-serif';

export default function Search() {
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = search(query, recipes);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const grouped = results.reduce<Record<ResultType, Result[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {} as Record<ResultType, Result[]>);

  return (
    <div className="min-h-screen bg-cream pb-28">
      <TopBar title="Hľadať" onBack={() => navigate(-1)} />

      {/* Search input */}
      <div className="px-5 pt-3 pb-4">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white"
          style={{ border: `1px solid ${HAIR}` }}
        >
          <SearchIcon size={16} style={{ color: MUTED, flexShrink: 0 }} strokeWidth={1.8} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hľadaj recepty, programy, meditácie…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: SANS,
              fontSize: 14,
              color: DEEP,
            }}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} style={{ color: MUTED }} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {/* Empty state — shortcuts */}
      {query.length === 0 && (
        <div className="px-5">
          <Eyebrow className="mb-3">Rýchly prístup</Eyebrow>
          <div className="grid grid-cols-2 gap-3">
            {SHORTCUTS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => navigate(s.path)}
                  className="rounded-card bg-white p-4 text-left flex items-center gap-3 transition-all active:scale-[0.98]"
                  style={{ border: `1px solid ${HAIR}` }}
                >
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${s.accent}18` }}
                  >
                    <Icon size={17} style={{ color: s.accent }} strokeWidth={1.6} />
                  </div>
                  <BodyText size="sm" className="font-medium">{s.label}</BodyText>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No results */}
      {query.length > 0 && results.length === 0 && (
        <div className="px-5 pt-8 text-center">
          <BodyText tone="muted">Žiadne výsledky pre „{query}"</BodyText>
          <BodyText size="sm" tone="muted" className="mt-1">Skús iný výraz</BodyText>
        </div>
      )}

      {/* Results grouped by type */}
      {results.length > 0 && (
        <div className="px-5 flex flex-col gap-5">
          {(Object.entries(grouped) as [ResultType, Result[]][]).map(([type, items]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-2">
                <Eyebrow style={{ color: TYPE_COLOR[type] }}>{TYPE_LABEL[type]}y</Eyebrow>
                <span
                  className="font-sans text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: `${TYPE_COLOR[type]}18`, color: TYPE_COLOR[type] }}
                >
                  {items.length}
                </span>
              </div>
              <div className="rounded-card bg-white overflow-hidden" style={{ border: `1px solid ${HAIR}` }}>
                {items.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => navigate(r.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors active:bg-cream-200"
                    style={{ borderBottom: i < items.length - 1 ? `1px solid ${HAIR}` : 'none' }}
                  >
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${TYPE_COLOR[r.type]}18` }}
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ background: TYPE_COLOR[r.type] }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <BodyText size="sm" className="font-medium truncate">{r.title}</BodyText>
                      <Eyebrow tone="muted" className="truncate">{r.subtitle}</Eyebrow>
                    </div>
                    <ChevronRight size={14} style={{ color: MUTED, flexShrink: 0 }} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
