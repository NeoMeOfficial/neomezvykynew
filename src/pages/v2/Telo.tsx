import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { TopBar } from '@/components/v2/top-bar';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { PlusTag } from '@/components/ui/plus-tag';
import { ChevronRight } from 'lucide-react';

const CARDS = [
  {
    id: 'programy',
    eyebrow: 'Telo · 01',
    name: 'Programy',
    sub: 'Niekoľkotýždenná cesta',
    meta: '4 programy',
    path: '/kniznica/telo/programy',
    requiresPlus: true,
    dotColor: 'bg-pillar-telo',
  },
  {
    id: 'cvicenia',
    eyebrow: 'Telo · 02',
    name: 'Cvičenia',
    sub: 'Jednotlivé tréningy',
    meta: '32 cvičení · 5–30 min',
    path: '/kniznica/telo/extra',
    requiresPlus: false,
    dotColor: 'bg-pillar-telo/60',
  },
  {
    id: 'strecing',
    eyebrow: 'Telo · 03',
    name: 'Strečing',
    sub: 'Uvoľnenie a mobilita',
    meta: '18 zostáv · 5–20 min',
    path: '/kniznica/telo/strecing',
    requiresPlus: false,
    dotColor: 'bg-pillar-telo/40',
  },
];

export default function Telo() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Telo" backHref="/kniznica" />

      <div className="px-5 pb-6">
        <SerifHeader as="h1" size="h1">
          Pohyb a <em className="text-terra not-italic font-serif italic">sila</em>.
        </SerifHeader>
        <BodyText tone="secondary" className="mt-2 max-w-[320px]">
          Programy pre dlhodobú premenu, jednotlivé cvičenia pre dnešný deň a strečing na každú chvíľu.
        </BodyText>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {CARDS.map(c => (
          <button
            key={c.id}
            onClick={() => navigate(c.path)}
            className="w-full text-left rounded-card p-5 flex items-center gap-4 bg-white border border-ink/[0.08] shadow-nm-sm transition-all duration-150 active:scale-[0.99]"
          >
            <div className={`h-12 w-1 rounded-full flex-shrink-0 ${c.dotColor}`} />
            <div className="flex-1 min-w-0">
              <Eyebrow tone="muted" className="mb-0.5">{c.eyebrow}</Eyebrow>
              <div className="font-serif text-h3 text-ink leading-snug">{c.name}</div>
              <BodyText size="sm" tone="muted" className="mt-0.5">{c.sub}</BodyText>
              <div className="font-sans text-[10px] uppercase tracking-[0.12em] text-ink/40 mt-1">{c.meta}</div>
            </div>
            {c.requiresPlus && !isPremium && <PlusTag />}
            <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
