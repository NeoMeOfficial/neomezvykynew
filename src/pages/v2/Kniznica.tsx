import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { BottomNav } from '@/components/v2/bottom-nav';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { PlusTag } from '@/components/ui/plus-tag';
import { ChevronRight } from 'lucide-react';

interface PillarItem {
  id: string;
  name: string;
  sub: string;
  color: string;
  path: string;
  num: string;
}

const PILLARS: PillarItem[] = [
  { id: 'telo',     name: 'Telo',     sub: 'Pohyb a sila',          color: 'bg-pillar-telo/10 border-pillar-telo/20',     path: '/kniznica/telo',     num: '01' },
  { id: 'strava',   name: 'Strava',   sub: 'Jedálniček a recepty',  color: 'bg-pillar-strava/10 border-pillar-strava/20', path: '/kniznica/strava',   num: '02' },
  { id: 'mysel',    name: 'Myseľ',    sub: 'Meditácie a dýchanie',  color: 'bg-pillar-mysel/10 border-pillar-mysel/20',   path: '/kniznica/mysel',    num: '03' },
  { id: 'cyklus',   name: 'Cyklus',   sub: 'Periodka a fázy',       color: 'bg-pillar-cyklus/10 border-pillar-cyklus/20', path: '/kniznica/periodka', num: '04' },
  { id: 'dennik',   name: 'Denník',   sub: 'Reflexia a nálady',     color: 'bg-ink/[0.04] border-ink/[0.08]',             path: '/kniznica/dennik',   num: '05' },
  { id: 'blog',     name: 'Blog',     sub: 'Články od Gabi',        color: 'bg-gold/[0.08] border-gold/20',               path: '/kniznica/blog',     num: '06' },
  { id: 'komunita', name: 'Komunita', sub: 'Ženy v pohybe',         color: 'bg-ink/[0.04] border-ink/[0.08]',             path: '/komunita',          num: '07' },
];

const DOT_COLOR: Record<string, string> = {
  telo: 'bg-pillar-telo', strava: 'bg-pillar-strava', mysel: 'bg-pillar-mysel',
  cyklus: 'bg-pillar-cyklus', dennik: 'bg-ink/40', blog: 'bg-gold', komunita: 'bg-ink/40',
};

export default function Kniznica() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();

  return (
    <div className="min-h-screen bg-cream pb-28">
      <div className="pt-14 px-5 pb-4">
        <div className="flex items-center justify-between">
          <Eyebrow tone="muted">
            KNIŽNICA{isPremium && <span className="ml-2 text-gold">· Plus</span>}
          </Eyebrow>
        </div>
        <SerifHeader as="h1" size="hero" className="mt-2">
          Všetko, čo{' '}
          <em className="text-terra not-italic font-serif italic">potrebuješ</em>.
        </SerifHeader>
      </div>

      <div className="px-5 mt-2 flex flex-col gap-2">
        {PILLARS.map(p => (
          <button
            key={p.id}
            onClick={() => navigate(p.path)}
            className={`w-full text-left rounded-card p-4 flex items-center gap-4 border ${p.color} transition-all duration-150 active:scale-[0.99]`}
          >
            <div className={`h-10 w-10 rounded-full ${DOT_COLOR[p.id]} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <Eyebrow tone="muted" className="mb-0.5">Oblasť · {p.num}</Eyebrow>
              <div className="font-serif text-h3 text-ink leading-snug">{p.name}</div>
              <div className="font-sans text-sm text-ink/56 mt-0.5">{p.sub}</div>
            </div>
            {!isPremium && (p.id === 'telo' || p.id === 'strava') && <PlusTag />}
            <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
          </button>
        ))}
      </div>

      <BottomNav active="kniznica" />
    </div>
  );
}
