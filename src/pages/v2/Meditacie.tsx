import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { SectionHeader } from '@/components/ui/section-header';
import { useMeditations, DbMeditation } from '../../hooks/useMeditations';

// Categories match the prod meditations.category values (free-form Slovak
// labels set by Gabi in the admin / SQL editor): 'Mindfulness', 'Spánok',
// 'Stres', 'Materstvo', 'Emócie', 'Ja'. Filter list is hand-picked from
// what's currently in the table.
const CATEGORIES: { label: string; filter: string | null }[] = [
  { label: 'Všetko',      filter: null },
  { label: 'Mindfulness', filter: 'Mindfulness' },
  { label: 'Spánok',      filter: 'Spánok' },
  { label: 'Stres',       filter: 'Stres' },
  { label: 'Materstvo',   filter: 'Materstvo' },
  { label: 'Emócie',      filter: 'Emócie' },
];

export default function Meditacie() {
  const navigate = useNavigate();
  const { meditations, loading } = useMeditations();
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const featured = meditations[0] ?? null;
  const list = meditations.slice(1).filter((s) => activeCat === null || s.category === activeCat);

  const goTo = (s: DbMeditation) => navigate(`/meditacia/${s.id}`);
  const minutesOf = (s: DbMeditation) => Math.round(s.duration_sec / 60);

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Meditácie" backHref="/kniznica/mysel" />

      {/* Featured */}
      {featured && (
      <div className="px-5 mb-6">
        <SectionHeader eyebrow="Odporúčané" className="mb-3" />
        <button
          onClick={() => goTo(featured)}
          className="w-full text-left rounded-card p-5 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-4 transition-all active:scale-[0.99]"
        >
          <div className="h-14 w-14 rounded-xl bg-pillar-mysel/15 flex items-center justify-center flex-shrink-0">
            <Play className="size-5 text-pillar-mysel fill-pillar-mysel" />
          </div>
          <div className="flex-1 min-w-0">
            <Eyebrow tone="muted" className="mb-0.5">
              {featured.category} · {minutesOf(featured)} min
            </Eyebrow>
            <div className="font-serif text-h3 text-ink leading-snug truncate">{featured.title}</div>
            {featured.subtitle && (
              <BodyText size="sm" tone="secondary" className="mt-0.5 line-clamp-1">{featured.subtitle}</BodyText>
            )}
          </div>
          <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
        </button>
      </div>
      )}

      {/* Category filter */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {CATEGORIES.map(c => (
            <button
              key={c.label}
              onClick={() => setActiveCat(c.filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-sans text-sm font-medium transition-all ${
                activeCat === c.filter
                  ? 'bg-pillar-mysel text-white'
                  : 'bg-white border border-ink/[0.08] text-ink/72'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meditation list */}
      <div className="px-5 flex flex-col gap-2">
        {loading ? (
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-8 text-center">
            <BodyText tone="secondary">Načítavam…</BodyText>
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-8 text-center">
            <BodyText tone="secondary">Žiadne meditácie pre túto kategóriu.</BodyText>
          </div>
        ) : (
          list.map(session => (
            <button
              key={session.id}
              onClick={() => goTo(session)}
              className="w-full text-left rounded-card p-4 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-4 transition-all active:scale-[0.99]"
            >
              <div className="h-10 w-10 rounded-full bg-pillar-mysel/15 flex items-center justify-center flex-shrink-0">
                <Play className="size-4 text-pillar-mysel fill-pillar-mysel" />
              </div>
              <div className="flex-1 min-w-0">
                <Eyebrow tone="muted" className="mb-0.5">
                  {session.category} · {minutesOf(session)} min
                </Eyebrow>
                <div className="font-serif text-h3 text-ink leading-snug">{session.title}</div>
              </div>
              <FavoriteButton
                itemId={session.id}
                type="meditation"
                title={session.title}
                duration={`${minutesOf(session)} min`}
                category={session.category}
                metadata={{ instructor: session.instructor }}
                size="sm"
                variant="minimal"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
