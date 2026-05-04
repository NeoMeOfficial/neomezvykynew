import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { SectionHeader } from '@/components/ui/section-header';

const CATEGORIES = [
  { label: 'Všetko', filter: null },
  { label: 'Spánok', filter: 'sleep' },
  { label: 'Fokus', filter: 'focus' },
  { label: 'Stres', filter: 'stress' },
  { label: 'Ráno', filter: 'morning' },
];

interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  instructor: string;
  category: string;
  audioUrl: string;
  description: string;
  thumbnail: string;
  featured: boolean;
}

const CAT_LABEL: Record<string, string> = {
  sleep: 'Spánok', focus: 'Fokus', stress: 'Stres', morning: 'Ráno',
};

const sessions: MeditationSession[] = [
  {
    id: '1', title: 'Ranná meditácia', duration: 10, instructor: 'Gabi',
    category: 'morning', audioUrl: '/audio/morning-meditation.mp3',
    description: 'Začni deň s jasnou mysľou a pozitívnou energiou', thumbnail: '', featured: true,
  },
  {
    id: '2', title: 'Hlboký spánok', duration: 20, instructor: 'Gabi',
    category: 'sleep', audioUrl: '/audio/deep-sleep.mp3',
    description: 'Uvoľni sa a priprav sa na regeneračný spánok', thumbnail: '', featured: false,
  },
  {
    id: '3', title: 'Zvládanie stresu', duration: 15, instructor: 'Gabi',
    category: 'stress', audioUrl: '/audio/stress-relief.mp3',
    description: 'Techniky na zvládnutie každodenného stresu', thumbnail: '', featured: false,
  },
  {
    id: '4', title: 'Fokus a koncentrácia', duration: 12, instructor: 'Gabi',
    category: 'focus', audioUrl: '/audio/focus-concentration.mp3',
    description: 'Zlepši svoju koncentráciu a produktivitu', thumbnail: '', featured: false,
  },
  {
    id: '5', title: 'Večerné uvoľnenie', duration: 18, instructor: 'Gabi',
    category: 'sleep', audioUrl: '/audio/evening-relaxation.mp3',
    description: 'Ukončí deň s pokojom a vďačnosťou', thumbnail: '', featured: false,
  },
  {
    id: '6', title: 'Dýchanie 4-7-8', duration: 8, instructor: 'Gabi',
    category: 'stress', audioUrl: '/audio/breathing-4-7-8.mp3',
    description: 'Efektívna technika pre okamžité upokojenie', thumbnail: '', featured: false,
  },
  {
    id: '7', title: 'Upokojenie úzkosti', duration: 12, instructor: 'Gabi',
    category: 'stress', audioUrl: '/audio/anxiety-relief.mp3',
    description: 'Jemné vedené dýchanie pre chvíle úzkosti', thumbnail: '', featured: false,
  },
  {
    id: '8', title: 'Prijatie tela', duration: 8, instructor: 'Gabi',
    category: 'morning', audioUrl: '/audio/body-acceptance.mp3',
    description: 'Meditácia o láskyplnom vzťahu k vlastnému telu', thumbnail: '', featured: false,
  },
];

export default function Meditacie() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const featured = sessions.find(s => s.featured) || sessions[0];
  const list = sessions.filter(s => !s.featured && (activeCat === null || s.category === activeCat));

  const goTo = (s: MeditationSession) => navigate(`/meditacia/${s.id}`);

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Meditácie" backHref="/kniznica/mysel" />

      {/* Featured */}
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
              {CAT_LABEL[featured.category] ?? featured.category} · {featured.duration} min
            </Eyebrow>
            <div className="font-serif text-h3 text-ink leading-snug truncate">{featured.title}</div>
            <BodyText size="sm" tone="secondary" className="mt-0.5 line-clamp-1">{featured.description}</BodyText>
          </div>
          <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
        </button>
      </div>

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
        {list.length === 0 ? (
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
                  {CAT_LABEL[session.category] ?? session.category} · {session.duration} min
                </Eyebrow>
                <div className="font-serif text-h3 text-ink leading-snug">{session.title}</div>
              </div>
              <FavoriteButton
                itemId={session.id}
                type="meditation"
                title={session.title}
                duration={`${session.duration} min`}
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
