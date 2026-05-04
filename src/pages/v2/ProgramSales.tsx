import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Users, Check, Dumbbell } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';
import { FaqAccordion } from '@/components/v2/neome/FaqAccordion';

const programData: Record<string, {
  name: string; tagline: string; weeks: number; perWeek: number;
  price: string; originalPrice?: string; discount?: string;
  heroImg: string; accentClass: string;
}> = {
  postpartum: {
    name: 'Postpartum',
    tagline: 'Obnov svoju silu po pôrode',
    weeks: 8, perWeek: 4,
    price: '39,90 €',
    heroImg: '/images/program-postpartum.jpg',
    accentClass: 'text-terra',
  },
  bodyforming: {
    name: 'BodyForming',
    tagline: 'Formuj svoju postavu',
    weeks: 6, perWeek: 5,
    price: '29,90 €',
    heroImg: '/images/program-bodyforming.jpg',
    accentClass: 'text-terra',
  },
  'elastic-bands': {
    name: 'Elastic Bands',
    tagline: 'Tréning s gumami kdekoľvek',
    weeks: 6, perWeek: 4,
    price: '24,90 €',
    heroImg: '/images/program-elastic.jpg',
    accentClass: 'text-terra',
  },
  'strong-sexy': {
    name: 'Strong&Sexy',
    tagline: 'Sila a sebavedomie',
    weeks: 6, perWeek: 5,
    price: '49,90 €',
    heroImg: '/images/program-strongsexy.jpg',
    accentClass: 'text-terra',
  },
};

const FAQS = [
  { q: 'Koľko trvá program?', a: 'Program je progresívny a je rozdelený na týždenné bloky s postupne rastúcou náročnosťou.' },
  { q: 'Potrebujem vybavenie?', a: 'Väčšinu cvičení zvládneš doma s minimálnym vybavením — karimatka a gumy alebo jednoručky podľa programu.' },
  { q: 'Môžem program pozastaviť?', a: 'Áno, kedykoľvek môžeš program pozastaviť a pokračovať neskôr. Prístup zostáva trvalý.' },
  { q: 'Je program vhodný po cisárskom reze?', a: 'Postpartum program je vhodný po sekcii, odporúčam minimálne 3 mesiace po reze a konzultáciu s fyzioterapeutom.' },
];

export default function ProgramSales() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const p = programData[id || ''] || programData.postpartum;
  const programId = id || 'postpartum';

  const SAMPLE_WORKOUTS = [
    `Deň 1 — ${p.perWeek >= 5 ? 'Celé telo' : 'Core & základy'}`,
    `Deň 2 — ${p.perWeek >= 5 ? 'Core & stabilita' : 'Panvové dno'}`,
  ];

  const INCLUDED = [
    `${p.weeks * p.perWeek} tréningov`,
    'Progresívny plán týždeň po týždni',
    'Správy od Gabi každý deň',
    'Podpora NeoMe komunity',
    'Prístup k receptom a jedálníčku',
  ];

  return (
    <div className="min-h-screen bg-cream pb-24">
      <TopBar title={p.name} onBack={() => navigate(-1)} />

      {/* Hero photo */}
      <div className="relative mx-5 rounded-card overflow-hidden mb-4" style={{ height: 220 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${p.heroImg})` }}
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <SerifHeader as="h2" size="h2" className="text-white mb-0.5">{p.name}</SerifHeader>
          <BodyText size="sm" className="text-white/80">{p.tagline}</BodyText>
          <div className="flex items-center gap-1.5 mt-2">
            <Users className="size-3.5 text-white/60" strokeWidth={1.5} />
            <span className="font-sans text-xs text-white/60">127 žien práve robí tento program</span>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Stats strip */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4">
          <div className="flex justify-around">
            {[
              { value: `${p.weeks}`, label: 'týždňov' },
              { value: `${p.perWeek}×`, label: 'tréningov/týždeň' },
              { value: '15–20', label: 'min/tréning' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-h2 text-ink">{value}</div>
                <Eyebrow tone="muted">{label}</Eyebrow>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-2">O programe</Eyebrow>
          <BodyText tone="secondary" className="leading-relaxed">
            Komplexný program navrhnutý špeciálne pre ženy, ktoré chcú dosiahnuť reálne výsledky.
            Kombinácia silového tréningu, flexibility a regenerácie — všetko s podporou Gabi.
          </BodyText>
        </div>

        {/* Locked sample */}
        <div>
          <Eyebrow className="mb-2 px-1">Ukážka tréningov</Eyebrow>
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
            {SAMPLE_WORKOUTS.map((w, i, arr) => (
              <div
                key={w}
                className={`px-4 py-3.5 flex items-center gap-3 relative overflow-hidden ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}
              >
                <div className="h-9 w-9 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="size-4 text-ink/30" strokeWidth={1.5} />
                </div>
                <div className="flex-1 select-none">
                  <BodyText size="sm" className="blur-[3px] pointer-events-none">{w}</BodyText>
                  <Eyebrow tone="muted" className="blur-[3px] pointer-events-none">20 min · Stredná intenzita</Eyebrow>
                </div>
                <Lock className="size-4 text-ink/25" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>

        {/* What's included */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-3">Čo je zahrnuté</Eyebrow>
          <div className="flex flex-col gap-2.5">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-pillar-strava/[0.10] flex items-center justify-center flex-shrink-0">
                  <Check className="size-3 text-pillar-strava" strokeWidth={2.5} />
                </div>
                <BodyText size="sm">{item}</BodyText>
              </div>
            ))}
          </div>
        </div>

        {/* Gabi quote */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-cream-200 flex-shrink-0 overflow-hidden">
              <img src="/images/gabi-avatar.jpg" alt="Gabi" className="w-full h-full object-cover" />
            </div>
            <div>
              <BodyText size="sm" className="font-medium mb-1">Gabi</BodyText>
              <BodyText size="sm" tone="secondary" className="italic leading-relaxed">
                „Tento program som vytvorila s láskou a skúsenosťami. Verím, že ti prinesie výsledky, ktoré si zaslúžiš."
              </BodyText>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <Eyebrow className="mb-2 px-1">Časté otázky</Eyebrow>
          <FaqAccordion items={FAQS} accent="#C1856A" />
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-5 pb-8 pt-4 bg-cream border-t border-ink/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <SerifHeader as="div" size="h2">{p.price}</SerifHeader>
          <Eyebrow tone="muted">Jednorazová platba</Eyebrow>
        </div>
        <button
          onClick={() => navigate(`/program/${programId}`)}
          className="w-full py-4 rounded-full bg-ink text-cream font-sans font-semibold transition-all active:scale-[0.98]"
        >
          Kúpiť program
        </button>
      </div>
    </div>
  );
}
