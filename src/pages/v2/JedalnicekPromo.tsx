import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, ShieldCheck } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';
import { FaqAccordion } from '@/components/v2/neome/FaqAccordion';
import { useSubscription } from '@/contexts/SubscriptionContext';

const COMPARISON = [
  { diet: 'Zákaz jedál', neome: 'Žiadne zákazy' },
  { diet: 'Počítanie každého jedla', neome: 'Automatické makrá' },
  { diet: 'Jeden plán pre všetkých', neome: 'Tvoje ciele & preferencie' },
  { diet: 'Krátke výsledky', neome: 'Trvalá zmena' },
];

const STEPS = [
  { num: '1', title: 'Vyplň profil', desc: 'Vek, váha, výška, cieľ a aktivita' },
  { num: '2', title: 'Nastav preferencie', desc: 'Diéta, alergény, počet jedál denne' },
  { num: '3', title: 'Získaj plán', desc: '6-týždňový jedálniček ihneď na obrazovke' },
  { num: '4', title: 'Jedz a dosahuj', desc: 'Recepty, nákupný zoznam, pokrok' },
];

const INCLUDED = [
  '6-týždňový personalizovaný jedálniček',
  'Makrá a kalórie pre každý deň',
  'Recepty pre každé jedlo',
  'Nákupný zoznam automaticky',
  'Vegetariánske, vegánske, bezlepkové varianty',
  'Vychádza z tvojho BMR a aktivity',
];

const TESTIMONIALS = [
  { name: 'Katka N.', text: 'Konečne nemusím premýšľať, čo variť. Ušetrím hodiny týždenne!', stars: 5 },
  { name: 'Jana V.', text: 'Po 2 týždňoch s jedálničkom som schudla 2 kg bez toho, aby som mala hlad.', stars: 5 },
  { name: 'Eva S.', text: 'Ako vegánka som mala problém s bielkovinami. Jedálniček to vyriešil.', stars: 5 },
];

const GOALS = [
  { id: 'lose', label: 'Schudnúť', hint: 'Deficit −300 kcal, plné jedlá' },
  { id: 'maintain', label: 'Udržať váhu', hint: 'Udržiavacia kalorická hodnota' },
  { id: 'gain', label: 'Nabrať svalovú hmotu', hint: 'Prebytok +250 kcal, viac bielkovín' },
];

const FAQS = [
  { q: 'Je jedálniček personalizovaný pre mňa?', a: 'Áno — vychádza z tvojho veku, váhy, výšky, cieľa a úrovne aktivity. Každý plán je iný.' },
  { q: 'Môžem mať vegetariánsky alebo vegánsky plán?', a: 'Samozrejme. Pri nastavovaní preferencií si vyberieš typ stravovania, alergény a počet jedál za deň.' },
  { q: 'Koľkokrát za mesiac môžem vygenerovať nový plán?', a: 'Jedálniček si môžeš vygenerovať kedykoľvek. Ak sa tvoje ciele zmenia, stačí zmeniť profil a vygenerovať znova.' },
  { q: 'Sú zahrnuté recepty?', a: 'Áno — ku každému jedlu je priradený recept z knižnice NeoMe s presným zložením a postupom.' },
];

const SAMPLE_DAY = [
  { time: 'Raňajky', meal: 'Proteínová kaša s ovocím', cal: '320 kcal' },
  { time: 'Obed', meal: 'Grilovaný losos so zeleninou', cal: '480 kcal' },
  { time: 'Snack', meal: 'Hummus so zeleninou', cal: '185 kcal' },
  { time: 'Večera', meal: 'Quinoa šalát s avokádom', cal: '420 kcal' },
];

export default function JedalnicekPromo() {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { hasMealPlanner, purchaseMealPlanner } = useSubscription();
  const [buying, setBuying] = useState(false);

  const onPrimary = async () => {
    if (hasMealPlanner) {
      navigate('/jedalnicek');
      return;
    }
    setBuying(true);
    try {
      await purchaseMealPlanner();
    } catch (err) {
      console.error('[jedalnicek-promo] checkout failed', err);
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 205px)' }}>
      <TopBar title="Jedálniček na mieru" onBack={() => navigate(-1)} />

      <div className="px-5 pt-2 flex flex-col gap-4">
        {/* Hero photo card — gradient underlay keeps the card presentable
            while the photo loads or if it ever fails. */}
        <div
          className="rounded-card overflow-hidden relative"
          style={{ height: 240, background: 'linear-gradient(135deg, #7A9E78 0%, #5F7E5D 100%)' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/strava-hero.jpg)' }}
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <Eyebrow className="text-white/70 mb-1">STRAVA</Eyebrow>
            <SerifHeader as="h2" size="h2" className="text-white mb-1">Jedálniček na mieru</SerifHeader>
            <BodyText size="sm" className="text-white/80">
              Personalizovaný výživový plán vytvorený presne pre teba.
            </BodyText>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4">
          <div className="flex justify-around">
            {[
              { value: '350+', label: 'žien používa' },
              { value: '120+', label: 'receptov' },
              { value: '4.9', label: 'hodnotenie' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-h2 text-ink">{value}</div>
                <Eyebrow tone="muted">{label}</Eyebrow>
              </div>
            ))}
          </div>
        </div>

        {/* "Toto nie je diéta" */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <SerifHeader as="h3" size="h3" className="mb-1">Toto nie je diéta</SerifHeader>
          <BodyText tone="secondary" className="mb-4">Je to inteligentný plán, ktorý funguje dlhodobo.</BodyText>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 text-center">
              <Eyebrow tone="muted">Bežná diéta</Eyebrow>
            </div>
            <div className="flex-1 text-center">
              <Eyebrow className="text-pillar-strava">NeoMe</Eyebrow>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {COMPARISON.map((row, i) => (
              <div key={i} className="flex items-stretch gap-2">
                <div className="flex-1 rounded-xl bg-cream-200 px-3 py-3 flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-ink/[0.06] flex items-center justify-center flex-shrink-0">
                    <X className="size-3 text-ink/40" strokeWidth={2.5} />
                  </div>
                  <BodyText size="sm" tone="muted">{row.diet}</BodyText>
                </div>
                <div className="flex-1 rounded-xl bg-pillar-strava/[0.08] px-3 py-3 flex items-center gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-pillar-strava flex items-center justify-center flex-shrink-0">
                    <Check className="size-3 text-white" strokeWidth={2.5} />
                  </div>
                  <BodyText size="sm" className="text-pillar-strava font-medium">{row.neome}</BodyText>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive goal selector */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-3">Aký je tvoj cieľ?</Eyebrow>
          <div className="flex flex-col gap-2">
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className={`w-full p-3.5 rounded-xl text-left transition-all border-2 ${
                  selectedGoal === g.id
                    ? 'border-pillar-strava bg-pillar-strava/[0.06]'
                    : 'border-ink/[0.08] bg-cream-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <BodyText size="sm" className={`font-medium ${selectedGoal === g.id ? 'text-pillar-strava' : ''}`}>
                    {g.label}
                  </BodyText>
                  {selectedGoal === g.id && (
                    <div className="h-5 w-5 rounded-full bg-pillar-strava flex items-center justify-center">
                      <Check className="size-3 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
                {selectedGoal === g.id && (
                  <BodyText size="sm" className="text-pillar-strava mt-0.5">{g.hint}</BodyText>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <SerifHeader as="h3" size="h3" className="mb-4">Ako to funguje</SerifHeader>
          <div className="flex flex-col gap-4">
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-pillar-strava flex items-center justify-center font-sans text-xs font-bold text-white flex-shrink-0">
                  {num}
                </div>
                <div>
                  <BodyText size="sm" className="font-medium">{title}</BodyText>
                  <BodyText size="sm" tone="muted">{desc}</BodyText>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample day */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-ink/[0.06]">
            <Eyebrow>Ukážka dňa</Eyebrow>
          </div>
          {SAMPLE_DAY.map((m, i, arr) => (
            <div key={i} className={`px-5 py-3 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}>
              <div>
                <Eyebrow tone="muted">{m.time}</Eyebrow>
                <BodyText size="sm">{m.meal}</BodyText>
              </div>
              <Eyebrow className="text-pillar-strava">{m.cal}</Eyebrow>
            </div>
          ))}
          <div className="px-5 py-3 bg-cream-200 flex items-center justify-between">
            <BodyText size="sm" className="font-medium">Celkom</BodyText>
            <BodyText size="sm" className="font-semibold text-pillar-strava">1 405 kcal</BodyText>
          </div>
        </div>

        {/* What's included checklist */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-3">Čo dostaneš</Eyebrow>
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

        {/* Testimonials */}
        <div>
          <Eyebrow className="mb-3 px-1">Čo hovoria naše členky</Eyebrow>
          <div className="flex flex-col gap-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="size-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <BodyText size="sm" tone="secondary" className="italic mb-2">„{t.text}"</BodyText>
                <Eyebrow tone="muted">— {t.name}</Eyebrow>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <Eyebrow className="mb-2 px-1">Časté otázky</Eyebrow>
          <FaqAccordion items={FAQS} accent="#8B9E88" />
        </div>

        {/* Guarantee */}
        <div className="rounded-card bg-pillar-strava/[0.06] border border-pillar-strava/20 p-4 flex items-center gap-3">
          <ShieldCheck className="size-5 text-pillar-strava flex-shrink-0" />
          <BodyText size="sm" className="text-pillar-strava">
            100% spokojnosť alebo zmena plánu kedykoľvek.
          </BodyText>
        </div>
      </div>

      {/* Sticky CTA — sits above the floating BottomNav pill (fixed at
          safe-area + 10px, ~64px tall) so the button is never covered. */}
      <div
        className="fixed left-0 right-0 z-40 px-5 pb-3 pt-3 bg-cream/95 backdrop-blur-md border-t border-ink/[0.08]"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)' }}
      >
        <button
          onClick={onPrimary}
          disabled={buying}
          className="w-full py-4 rounded-full bg-pillar-strava text-white font-sans font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {hasMealPlanner
            ? 'Vytvoriť môj jedálniček'
            : buying
              ? 'Otváram platbu…'
              : 'Pridať Jedálniček · 57 €'}
        </button>
        <BodyText size="sm" tone="muted" className="text-center mt-2">
          {hasMealPlanner
            ? 'Jedálniček máš odomknutý'
            : 'Jednorazový poplatok · navždy tvoj'}
        </BodyText>
      </div>
    </div>
  );
}
