import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { BottomNav } from '@/components/v2/bottom-nav';
import { SlidersHorizontal, ChevronRight, Salad, Dumbbell, Brain, BookOpen } from 'lucide-react';
import { recipes } from '@/data/recipes';
import { programList } from '@/data/programs';

const DEEP     = '#3D2921';
const CREAM    = '#F8F5F0';
const WHITE    = '#FFFFFF';
const CREAM2   = '#F1ECE3';
const DEEP2    = '#2A1A14';
const GOLD     = '#B8864A';
const HAIR     = 'rgba(61,41,33,0.08)';
const HAIR2    = 'rgba(61,41,33,0.16)';
const TERTIARY = 'rgba(61,41,33,0.42)';
const MUTED    = 'rgba(61,41,33,0.72)';
const SERIF    = "'Gilda Display', Georgia, serif";
const SANS     = "'DM Sans', system-ui, sans-serif";

const IMG = (name: string) => `/images/r9/${name}`;

// ─── Search logic (mirrors Search.tsx) ────────────────────────────────────────

const MEDITATIONS = [
  { id: '1', title: 'Ranná meditácia',       category: 'Ráno'   },
  { id: '2', title: 'Hlboký spánok',          category: 'Spánok' },
  { id: '3', title: 'Zvládanie stresu',       category: 'Stres'  },
  { id: '4', title: 'Fokus a koncentrácia',   category: 'Fokus'  },
  { id: '5', title: 'Večerné uvoľnenie',      category: 'Spánok' },
  { id: '6', title: 'Dýchanie 4-7-8',         category: 'Stres'  },
  { id: '7', title: 'Upokojenie úzkosti',     category: 'Stres'  },
  { id: '8', title: 'Prijatie tela',          category: 'Ráno'   },
];

const CAT_LABELS: Record<string, string> = {
  ranajky: 'Raňajky', obed: 'Obed', vecera: 'Večera', snack: 'Snack', smoothie: 'Smoothie',
};

type ResultType = 'recipe' | 'program' | 'meditation';
interface Result { id: string; type: ResultType; title: string; subtitle: string; path: string; }

const TYPE_LABEL: Record<ResultType, string> = { recipe: 'Recept', program: 'Program', meditation: 'Meditácia' };
const TYPE_COLOR: Record<ResultType, string> = { recipe: '#8B9E88', program: '#C1856A', meditation: '#A8848B' };

const SHORTCUTS = [
  { label: 'Recepty',   icon: Salad,    accent: '#8B9E88', path: '/recepty'               },
  { label: 'Programy',  icon: Dumbbell, accent: '#C1856A', path: '/kniznica/telo/programy' },
  { label: 'Meditácie', icon: Brain,    accent: '#A8848B', path: '/meditacie'              },
  { label: 'Knižnica',  icon: BookOpen, accent: '#B8864A', path: '/kniznica'               },
];

function runSearch(q: string): Result[] {
  const term = q.toLowerCase().trim();
  if (!term) return [];
  const out: Result[] = [];
  recipes.forEach((r) => {
    if (r.title.toLowerCase().includes(term) || r.description?.toLowerCase().includes(term) ||
        r.tags?.some((t) => t.toLowerCase().includes(term)) || CAT_LABELS[r.category]?.toLowerCase().includes(term))
      out.push({ id: r.id, type: 'recipe', title: r.title, subtitle: CAT_LABELS[r.category] ?? r.category, path: `/recept/${r.id}` });
  });
  programList.forEach((p) => {
    if (p.name.toLowerCase().includes(term) || (p as any).tagline?.toLowerCase().includes(term))
      out.push({ id: (p as any).slug ?? p.name, type: 'program', title: p.name, subtitle: 'Program', path: `/program/${(p as any).slug ?? p.name}/info` });
  });
  MEDITATIONS.forEach((m) => {
    if (m.title.toLowerCase().includes(term) || m.category.toLowerCase().includes(term))
      out.push({ id: m.id, type: 'meditation', title: m.title, subtitle: `Meditácia · ${m.category}`, path: `/meditacia/${m.id}` });
  });
  return out.slice(0, 30);
}

// ─── Search sheet ──────────────────────────────────────────────────────────────
function SearchSheet({ onClose }: { onClose: () => void }) {
  const navigate   = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [bottomOffset, setBottomOffset] = useState(0);
  const [maxH, setMaxH] = useState('92dvh');

  const results = runSearch(query);
  const grouped = results.reduce<Record<ResultType, Result[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {} as Record<ResultType, Result[]>);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const overlay = overlayRef.current;
    const blockScroll = (e: TouchEvent) => e.preventDefault();
    overlay?.addEventListener('touchmove', blockScroll, { passive: false });

    // Shift sheet up when keyboard opens
    const vv = window.visualViewport;
    const onVVChange = () => {
      if (!vv) return;
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setBottomOffset(kb);
      setMaxH(`${Math.round(vv.height * 0.96)}px`);
    };
    vv?.addEventListener('resize', onVVChange);
    vv?.addEventListener('scroll', onVVChange);

    // Auto-focus the input once the sheet has animated in
    setTimeout(() => inputRef.current?.focus(), 180);

    return () => {
      document.body.style.overflow = prev;
      overlay?.removeEventListener('touchmove', blockScroll);
      vv?.removeEventListener('resize', onVVChange);
      vv?.removeEventListener('scroll', onVVChange);
    };
  }, []);

  const goTo = (path: string) => { onClose(); navigate(path); };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div
        ref={overlayRef}
        style={{ position: 'absolute', inset: 0, background: 'rgba(42,26,20,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'absolute', bottom: bottomOffset, left: 0, right: 0,
          background: CREAM, borderRadius: '24px 24px 0 0',
          display: 'flex', flexDirection: 'column',
          maxHeight: maxH, overflow: 'hidden',
          transition: 'bottom 0.22s ease, max-height 0.22s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row — always visible at top */}
        <div style={{ flexShrink: 0, padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 14px', background: WHITE, borderRadius: 999,
            border: `1px solid ${HAIR2}`,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hľadaj recepty, programy, meditácie…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: SANS, fontSize: 14, color: DEEP }}
            />
            {query.length > 0 && (
              <button
                onClick={() => setQuery('')}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: SANS, fontSize: 13, color: MUTED, whiteSpace: 'nowrap', padding: '0 2px' }}
          >
            Zrušiť
          </button>
        </div>

        {/* Scrollable results */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, overscrollBehavior: 'contain', padding: '0 16px 32px' }}>

          {/* Empty state — shortcuts */}
          {query.length === 0 && (
            <>
              <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: TERTIARY, fontWeight: 500, marginBottom: 12 }}>Rýchly prístup</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {SHORTCUTS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      onClick={() => goTo(s.path)}
                      style={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', padding: '14px 14px', background: WHITE, borderRadius: 16, border: `1px solid ${HAIR}`, display: 'flex', alignItems: 'center', gap: 10 }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={16} color={s.accent} strokeWidth={1.6} />
                      </div>
                      <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: DEEP }}>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* No results */}
          {query.length > 0 && results.length === 0 && (
            <div style={{ paddingTop: 40, textAlign: 'center' }}>
              <div style={{ fontFamily: SANS, fontSize: 14, color: MUTED }}>Žiadne výsledky pre „{query}"</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: TERTIARY, marginTop: 4 }}>Skús iný výraz</div>
            </div>
          )}

          {/* Grouped results */}
          {results.length > 0 && (Object.entries(grouped) as [ResultType, Result[]][]).map(([type, items]) => (
            <div key={type} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: TYPE_COLOR[type], fontWeight: 500 }}>{TYPE_LABEL[type]}y</div>
                <div style={{ padding: '1px 7px', borderRadius: 999, background: `${TYPE_COLOR[type]}18`, fontFamily: SANS, fontSize: 10, fontWeight: 500, color: TYPE_COLOR[type] }}>{items.length}</div>
              </div>
              <div style={{ background: WHITE, borderRadius: 16, overflow: 'hidden', border: `1px solid ${HAIR}` }}>
                {items.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => goTo(r.path)}
                    style={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < items.length - 1 ? `1px solid ${HAIR}` : 'none' }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${TYPE_COLOR[r.type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 999, background: TYPE_COLOR[r.type] }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: DEEP, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                      <div style={{ fontFamily: SANS, fontSize: 10.5, color: TERTIARY, marginTop: 1 }}>{r.subtitle}</div>
                    </div>
                    <ChevronRight size={14} color={MUTED} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Pillar grid ───────────────────────────────────────────────────────────────

interface Pillar { id: string; name: string; sub: string; img: string; path: string; }

const PILLARS: Pillar[] = [
  { id: 'telo',     name: 'Telo',     sub: 'Pohyb a sila',          img: 'section-body.jpg',      path: '/kniznica/telo'      },
  { id: 'strava',   name: 'Strava',   sub: 'Jedálniček a recepty',  img: 'section-nutrition.jpg', path: '/kniznica/strava'    },
  { id: 'mysel',    name: 'Myseľ',    sub: 'Meditácie a dýchanie',  img: 'section-mind.jpg',      path: '/kniznica/mysel'     },
  { id: 'periodka', name: 'Periodka', sub: 'Periodka a fázy',       img: 'section-period.jpg',    path: '/kniznica/periodka'  },
  { id: 'dennik',   name: 'Denník',   sub: 'Reflexia a nálady',     img: 'section-diary.jpg',     path: '/kniznica/dennik'    },
  { id: 'komunita', name: 'Komunita', sub: 'Ženy v pohybe',         img: 'section-community.jpg', path: '/komunita'           },
];

const BLOG: Pillar = {
  id: 'blog', name: 'Blog', sub: 'Články od Gabi',
  img: 'blog-cycle-training.jpg', path: '/kniznica/blog',
};

const GRADIENT = 'linear-gradient(180deg, rgba(42,26,20,0) 35%, rgba(42,26,20,0.82) 100%)';

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Kniznica() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div style={{ background: '#F8F5F0', minHeight: '100vh', paddingBottom: 120 }}>

      {/* Header */}
      <div style={{ padding: '60px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(61,41,33,0.55)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            Knižnica
            {isPremium && <>
              <span style={{ color: TERTIARY }}>·</span>
              <span style={{ color: GOLD }}>Plus</span>
            </>}
          </div>
        </div>
        <div style={{ marginTop: 8, fontFamily: 'Gilda Display, serif', fontSize: 34, fontWeight: 500, color: DEEP, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          Všetko, čo{' '}
          <em style={{ color: '#C1856A', fontStyle: 'italic', fontWeight: 500 }}>potrebuješ</em>.
        </div>
      </div>

      {/* Search bar — tapping opens the sheet */}
      <div style={{ margin: '0 20px 0' }}>
        <button
          onClick={() => setShowSearch(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
            padding: '13px 16px', background: '#fff', borderRadius: 999,
            border: `1px solid ${HAIR}`, boxShadow: '0 2px 12px rgba(61,41,33,0.04)', cursor: 'text',
            boxSizing: 'border-box',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
          </svg>
          <span style={{ flex: 1, fontFamily: 'DM Sans, system-ui', fontSize: 13, color: TERTIARY, fontWeight: 400 }}>
            Hľadaj v knižnici…
          </span>
        </button>
      </div>

      {/* Oblasti label */}
      <div style={{ margin: '34px 20px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(61,41,33,0.55)', fontWeight: 500 }}>Oblasti</div>
        <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: TERTIARY, fontWeight: 500 }}>7 celkom</div>
      </div>

      {/* 2-col photo grid */}
      <div style={{ margin: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {PILLARS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => navigate(p.path)}
            style={{
              borderRadius: 18, overflow: 'hidden', position: 'relative',
              aspectRatio: '1 / 1.05',
              backgroundImage: `url(${IMG(p.img)})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: 'none', cursor: 'pointer', display: 'block',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, color: '#fff', textAlign: 'left' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)', fontWeight: 500, marginBottom: 4 }}>
                Oblasť · 0{i + 1}
              </div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.1 }}>{p.name}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, fontWeight: 400 }}>{p.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Blog — full-width wide tile */}
      <div style={{ margin: '10px 20px 0' }}>
        <button
          onClick={() => navigate(BLOG.path)}
          style={{
            borderRadius: 18, overflow: 'hidden', position: 'relative',
            aspectRatio: '2.1 / 1', width: '100%',
            backgroundImage: `url(${IMG(BLOG.img)})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            border: 'none', cursor: 'pointer', display: 'block',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />
          <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18, color: '#fff', textAlign: 'left' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)', fontWeight: 500, marginBottom: 4 }}>
              Oblasť · 07
            </div>
            <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.005em' }}>{BLOG.name}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10.5, color: 'rgba(255,255,255,0.7)', marginTop: 3, fontWeight: 400 }}>{BLOG.sub}</div>
          </div>
        </button>
      </div>

      {/* Upgrade banner — free only */}
      {!isPremium && (
        <div style={{ margin: '36px 20px 0' }}>
          <div style={{
            position: 'relative', borderRadius: 24, overflow: 'hidden',
            background: `linear-gradient(135deg, ${DEEP2} 0%, ${DEEP} 100%)`,
            color: '#fff', padding: '24px 22px',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 180, height: 180,
              borderRadius: 999, background: `radial-gradient(circle, ${GOLD}48, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 12 }}>NeoMe Plus</div>
              <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, fontWeight: 500, color: '#fff', lineHeight: 1.15 }}>
                Odomkni celú<br />
                <em style={{ color: GOLD, fontStyle: 'italic', fontWeight: 500 }}>knižnicu.</em>
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12.5, color: 'rgba(255,255,255,0.72)', marginTop: 12, lineHeight: 1.55 }}>
                Všetky programy, celý jedálniček, pokročilý cyklus a plný archív meditácií.
              </div>
              <button
                onClick={() => navigate('/paywall')}
                style={{
                  marginTop: 18, width: '100%', padding: '13px 20px',
                  background: GOLD, color: '#fff', border: 'none', borderRadius: 999,
                  fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', cursor: 'pointer',
                }}
              >
                Aktivovať Plus
              </button>
              <div style={{ textAlign: 'center', marginTop: 10, fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                Zrušíš kedykoľvek
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="kniznica" />

      {showSearch && <SearchSheet onClose={() => setShowSearch(false)} />}
    </div>
  );
}
