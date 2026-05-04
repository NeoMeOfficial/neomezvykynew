import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Check, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';

const DEEP = '#3D2921';
const GOLD = '#B8864A';
const TERRA = '#C1856A';

interface Phase { weeks: string; title: string; desc: string }
interface DayRow { day: string; type: string; dur: string; focus: string }
interface Testimonial { name: string; text: string }
interface FaqItem { q: string; a: string }

interface ProgramDef {
  name: string;
  tagline: string;
  desc: string;
  weeks: number;
  perWeek: number;
  duration: string;
  price: string;
  heroImg: string;
  social: string;
  features: string[];
  phases: Phase[];
  schedule: DayRow[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
}

const PROGRAMS: Record<string, ProgramDef> = {
  postpartum: {
    name: 'Postpartum',
    tagline: 'Obnov svoju silu po pôrode',
    desc: '15-minútové online cvičenia na posilnenie vnútorných brušných svalov a panvového dna oslabených počas tehotenstva a pôrodu. Bezpečný a progresívny program navrhnutý špeciálne pre maminy — či už si týždeň alebo roky po pôrode.',
    weeks: 8, perWeek: 4, duration: '15–20 min',
    price: '39,90 €',
    heroImg: '/images/r9/lifestyle-mother-baby.jpg',
    social: '500+ mamín',
    features: [
      '24 bezpečných posilňovacích cvičení',
      '16 strečingových cvičení pre uvoľnenie napätia',
      '16 meditácií pre prinavrátenie vnútorného balansu',
      'Progresívny 8-týždňový plán',
      'Cvičenia vhodné aj roky po pôrode',
      'Bezpečné po sekcii (po 3 mesiacoch)',
    ],
    phases: [
      { weeks: '1 – 2', title: 'Pevné základy core', desc: 'Bránicové dýchanie, aktivácia panvového dna, hlboké brušné svaly (TVA)' },
      { weeks: '3 – 5', title: 'Progresívne posilnenie', desc: 'Cvičenia s pilates ball a elastickými gumami, posilnenie brušného korzetu' },
      { weeks: '6 – 8', title: 'Komplexné prepojenie', desc: 'Rotácie, protitlak, strečing a meditácie pre celkový balance' },
    ],
    schedule: [
      { day: 'Po', type: 'Posilňovanie', dur: '15 min', focus: 'Core aktivácia + panvové dno' },
      { day: 'Ut', type: 'Posilňovanie', dur: '15 min', focus: 'Brušný korzet + stabilita' },
      { day: 'St', type: 'Strečing & Meditácia', dur: '20 min', focus: 'Uvoľnenie + mindfulness' },
      { day: 'Št', type: 'Posilňovanie', dur: '15 min', focus: 'Komplexné posilnenie' },
      { day: 'Pi', type: 'Strečing & Meditácia', dur: '20 min', focus: 'Regenerácia + sebaláska' },
    ],
    testimonials: [
      { name: 'Zuzana M.', text: 'Po 6 mesiacoch som konečne cítila, že sa môj život vracia do normálu. Brucho je pevné a nemám už bolesť chrbta.' },
      { name: 'Petra K.', text: 'Program mi pomohol nielen fyzicky, ale aj psychicky. Cítim sa opäť ako ja — silná a sebavedomá mama.' },
      { name: 'Martina L.', text: 'Začala som 2 roky po pôrode a funguje to perfektne. Nikdy nie je neskoro!' },
    ],
    faqs: [
      { q: 'Už som roky po pôrode — je program pre mňa?', a: 'Áno. Je jedno, ako dlho si po pôrode. Postpartum program je bezpečná vstupenka do aktívneho života bez ohľadu na to, kedy si porodila.' },
      { q: 'Kedy môžem začať? (Prirodzený pôrod)', a: 'Cviky sú bezpečné a môžeš ich začať robiť už v prvých dňoch po pôrode, ak si mala bezrizikové tehotenstvo a pôrod. Záleží od toho, kedy sa na to budeš psychicky cítiť.' },
      { q: 'Kedy môžem začať? (Sekcia)', a: 'Po sekcii odporúčam minimálne 3 mesiace regenerácie a konzultáciu s lekárom alebo fyzioterapeutom.' },
      { q: 'Čo môžem očakávať?', a: 'Pri pravidelnom cvičení posilníš panvové dno a hlboké brušné svaly, odstrániš diastázu, zlepšíš držanie tela a eliminuješ bolesť chrbta.' },
      { q: 'Môžem program pozastaviť?', a: 'Áno, kedykoľvek. Prístup zostáva trvalý — pokračuješ, keď si ty pripravená.' },
    ],
  },

  bodyforming: {
    name: 'BodyForming',
    tagline: 'Formuj svoju postavu bez diéty',
    desc: 'Kombinácia silového tréningu a funkčného pohybu, ktorá formuje postavu, zlepšuje držanie tela a dodáva energiu. Program pre ženy, ktoré chcú výsledky bez extrémov — cvičenia doma, bez posilňovne.',
    weeks: 6, perWeek: 5, duration: '20–25 min',
    price: '29,90 €',
    heroImg: '/images/r9/program-body-forming.jpg',
    social: '350+ žien',
    features: [
      '30 formovacích silových cvičení',
      'Kombinácia HIIT a pilates prvkov',
      'Progresívny 6-týždňový plán',
      'Cvičenia doma — žiadna posilňovňa',
      'Každodenné motivačné správy od Gabi',
      'Prístup do NeoMe komunity',
    ],
    phases: [
      { weeks: '1 – 2', title: 'Aktivácia a základy', desc: 'Správna technika, aktivácia svalov, budovanie pohybových návykov' },
      { weeks: '3 – 4', title: 'Progresívne formovanie', desc: 'Vyššia intenzita, silové variácie, cielené tvarovanie partií' },
      { weeks: '5 – 6', title: 'Sila a tvar', desc: 'Komplexné cvičenia, kardio kombinácie, maximálny efekt' },
    ],
    schedule: [
      { day: 'Po', type: 'Silový tréning', dur: '25 min', focus: 'Nohy + zadok' },
      { day: 'Ut', type: 'Silový tréning', dur: '25 min', focus: 'Core + ramená' },
      { day: 'St', type: 'Aktívna regenerácia', dur: '20 min', focus: 'Strečing + mobilita' },
      { day: 'Št', type: 'Silový tréning', dur: '25 min', focus: 'Celé telo' },
      { day: 'Pi', type: 'HIIT', dur: '20 min', focus: 'Výbušnosť + spaľovanie' },
    ],
    testimonials: [
      { name: 'Monika S.', text: 'Za 6 týždňov som stratila 4 kg a brucho je konečne pevné. Cvičenia sú ťažké, ale zvládnuteľné.' },
      { name: 'Jana K.', text: 'Program som robila ráno pred prácou. Perfektne do 30 minút a cítim sa celý deň skvele.' },
    ],
    faqs: [
      { q: 'Potrebujem nejaké vybavenie?', a: 'Karimatka, voliteľne jednoručky (2–5 kg). Väčšinu cvičení zvládneš s vlastnou váhou.' },
      { q: 'Je program vhodný pre začiatočníčky?', a: 'Áno. Každé cvičenie má základnú a pokročilú verziu — volíš podľa svojich schopností.' },
      { q: 'Kedy uvidím výsledky?', a: 'Prvé zmeny zvyčajne cítiš do 2 týždňov — viac energie, pevnejšie svaly. Vizuálne výsledky prichádzajú okolo 4. týždňa.' },
      { q: 'Môžem program robiť počas menštruácie?', a: 'Áno. V aplikácii máš možnosť voliť ľahšiu verziu tréningov v prvé dni cyklu.' },
    ],
  },

  'elastic-bands': {
    name: 'Elastic Bands',
    tagline: 'Tréning s gumami — kdekoľvek',
    desc: 'Kompletný silový program s odporovými gumami. Jedna guma, stovky možností — doma, vonku alebo na dovolenke. Progresívny plán, ktorý buduje silu bez posilňovne a bez zbytočne zložitého vybavenia.',
    weeks: 6, perWeek: 4, duration: '15–25 min',
    price: '24,90 €',
    heroImg: '/images/r9/lifestyle-core-workout.jpg',
    social: '280+ žien',
    features: [
      '28 cvičení s odporovými gumami',
      'Tréning kdekoľvek — doma, park, hotel',
      'Stačí jedna odporová guma',
      'Progresívna záťaž týždeň po týždni',
      'Ranné aj večerné varianty tréningov',
      'Sprievodný slovník techniky pre bezpečný pohyb',
    ],
    phases: [
      { weeks: '1 – 2', title: 'Základy práce s gumou', desc: 'Správne uchopenie, napätie gumy, aktivácia svalov, bezpečná technika' },
      { weeks: '3 – 4', title: 'Silová progresia', desc: 'Vyšší odpor, kombinácie pohybov, zaťaženie viacerých svalových skupín' },
      { weeks: '5 – 6', title: 'Kompletný tréning', desc: 'Celotelovésekvenie, dynamické kombinácie, maximálna efektivita' },
    ],
    schedule: [
      { day: 'Po', type: 'Silový tréning', dur: '25 min', focus: 'Nohy + zadok' },
      { day: 'Ut', type: 'Silový tréning', dur: '20 min', focus: 'Horná časť tela' },
      { day: 'St', type: 'Voľno / Strečing', dur: '15 min', focus: 'Regenerácia' },
      { day: 'Št', type: 'Silový tréning', dur: '25 min', focus: 'Celé telo + core' },
      { day: 'Pi', type: 'Silový tréning', dur: '20 min', focus: 'Funkčný pohyb' },
    ],
    testimonials: [
      { name: 'Katarína R.', text: 'Brala som si gumy na dovolenku a nikdy som necvičila pravidelnejšie. Program je jasný a výsledky vidieť.' },
      { name: 'Lucia B.', text: 'Myslela som, že gumou toho veľa nevyrobím. Mýlila som sa — je to náročnejšie ako si myslíte.' },
    ],
    faqs: [
      { q: 'Akú gumy potrebujem?', a: 'Začiatočníčky — ľahký odpor (10–15 kg). Pokročilé — stredný odpor (15–25 kg). V programe nájdeš aj odporúčania podľa cvičenia.' },
      { q: 'Je program vhodný pre úplné začiatočníčky?', a: 'Áno. Program začína od úplných základov a postupne pridáva záťaž.' },
      { q: 'Môžem cvičiť v byte?', a: 'Áno. Všetky cvičenia sú navrhnuté pre malý priestor — stačí karimatka.' },
    ],
  },

  'strong-sexy': {
    name: 'Strong&Sexy',
    tagline: 'Sila, sebavedomie, výsledky',
    desc: 'Pokročilý silový program pre ženy, ktoré chcú posunúť hranice. Intenzívne tréningy 5× týždenne budujú skutočnú silu, formujú postavu a budujú sebavedomie, ktoré cítiš každý deň.',
    weeks: 6, perWeek: 5, duration: '30–40 min',
    price: '49,90 €',
    heroImg: '/images/r9/lifestyle-yoga-pose.jpg',
    social: '420+ žien',
    features: [
      '35 pokročilých silových cvičení',
      'Progresívna záťaž s jednoručkami a vlastnou váhou',
      'Kompletné zahrievanie a ochladenie',
      '5 tréningov týždenne — intenzívny plán',
      'Motivačné správy od Gabi každý deň',
      'Komunita silných žien v NeoMe',
    ],
    phases: [
      { weeks: '1 – 2', title: 'Silové základy', desc: 'Správna technika ťažších zdvihov, aktivácia hlavných svalových skupín, budovanie bázy' },
      { weeks: '3 – 4', title: 'Maximálna záťaž', desc: 'Vyšší objem tréningov, kombinácia silového a funkčného pohybu, výzvy' },
      { weeks: '5 – 6', title: 'Power & Control', desc: 'Výbušná sila, plná kontrola pohybu, komplexné sekvencie pre maximálny efekt' },
    ],
    schedule: [
      { day: 'Po', type: 'Silový tréning', dur: '40 min', focus: 'Nohy + zadok (ťažké)' },
      { day: 'Ut', type: 'Silový tréning', dur: '35 min', focus: 'Chrbát + ramená' },
      { day: 'St', type: 'Core & Funkčný pohyb', dur: '30 min', focus: 'Jadro tela + stabilita' },
      { day: 'Št', type: 'Silový tréning', dur: '40 min', focus: 'Celé telo — komplexné zdvihy' },
      { day: 'Pi', type: 'HIIT + Flexibilita', dur: '35 min', focus: 'Výbušnosť + mobilita' },
    ],
    testimonials: [
      { name: 'Zuzka N.', text: 'Robila som rôzne programy, ale toto je prvý, kde skutočne cítim silu. Výsledky po 3 týždňoch boli viditeľné.' },
      { name: 'Barbora M.', text: 'Myslela som, že pre mňa ako pre pokročilú bude program ľahký. Nebude. Dokonalá výzva.' },
      { name: 'Eva S.', text: 'Program mi dal sebavedomie, o ktorom som ani nevedela, že mi chýba. Dôsledne odporúčam.' },
    ],
    faqs: [
      { q: 'Aký level skúseností potrebujem?', a: 'Program je navrhnutý pre ženy s aspoň 3 mesiacmi pravidelného cvičenia. Ak si začiatočníčka, odporúčame najskôr BodyForming.' },
      { q: 'Čo potrebujem za vybavenie?', a: 'Karimatka, jednoručky (4–10 kg), voliteľne odporová guma. Niektoré cvičenia využívajú stoličku alebo stôl.' },
      { q: 'Je program bezpečný pri bolestiach kĺbov?', a: 'Ak máš chronické ťažkosti, odporúčame konzultáciu s fyzioterapeutom pred začatím programu.' },
      { q: 'Môžem program absolvovať opakovane?', a: 'Áno. Po dokončení môžeš program opakovať s vyššou záťažou — každé kolo prinesie nové výsledky.' },
    ],
  },
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-card bg-white border border-ink/[0.08] overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
      >
        <BodyText size="sm" className="font-medium">{q}</BodyText>
        {open
          ? <ChevronUp className="size-4 text-ink/40 flex-shrink-0" strokeWidth={1.5} />
          : <ChevronDown className="size-4 text-ink/40 flex-shrink-0" strokeWidth={1.5} />
        }
      </button>
      {open && (
        <div className="px-5 pb-4">
          <BodyText size="sm" tone="secondary" className="leading-relaxed">{a}</BodyText>
        </div>
      )}
    </div>
  );
}

export default function ProgramSales() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const programId = (id && PROGRAMS[id]) ? id : 'postpartum';
  const p = PROGRAMS[programId];

  const totalWorkouts = p.weeks * p.perWeek;

  return (
    <div className="min-h-screen bg-cream pb-28">
      <TopBar title={p.name} onBack={() => navigate(-1)} />

      {/* Hero */}
      <div
        style={{
          height: 260, position: 'relative',
          backgroundImage: `url(${p.heroImg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(61,41,33,0.1) 30%, rgba(61,41,33,0.78) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 24px' }}>
          <SerifHeader as="h1" size="h1" className="text-white mb-1">{p.name}</SerifHeader>
          <BodyText size="sm" className="text-white/80 mb-3">{p.tagline}</BodyText>
          <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.62)', letterSpacing: '0.06em' }}>
            {p.social} absolvovalo tento program
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-5 mt-5">

        {/* Stats */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4">
          <div className="flex justify-around">
            {[
              { value: `${p.weeks}`, label: 'týždňov' },
              { value: `${p.perWeek}×`, label: 'tréningov/týždeň' },
              { value: p.duration, label: 'trvanie' },
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
          <BodyText tone="secondary" className="leading-relaxed">{p.desc}</BodyText>
        </div>

        {/* Phases */}
        <div>
          <Eyebrow className="mb-3 px-1">Čo ťa čaká</Eyebrow>
          <div className="flex flex-col gap-2.5">
            {p.phases.map((ph, i) => (
              <div key={i} className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5 flex gap-4">
                <div className="flex-shrink-0 pt-0.5">
                  <div
                    className="h-7 px-2.5 rounded-full flex items-center justify-center"
                    style={{ background: DEEP }}
                  >
                    <span style={{ fontFamily: 'DM Sans', fontSize: 9, color: '#fff', letterSpacing: '0.1em', fontWeight: 500 }}>
                      TŽ {ph.weeks}
                    </span>
                  </div>
                </div>
                <div>
                  <BodyText className="font-medium mb-0.5">{ph.title}</BodyText>
                  <BodyText size="sm" tone="secondary">{ph.desc}</BodyText>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly schedule */}
        <div>
          <Eyebrow className="mb-3 px-1">Bežný týždeň</Eyebrow>
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
            {p.schedule.map((row, i, arr) => (
              <div
                key={i}
                className={`px-5 py-3.5 flex items-center gap-4 ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}
              >
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: DEEP }}
                >
                  <span style={{ fontFamily: 'Gilda Display, serif', fontSize: 10, color: '#fff', fontWeight: 500 }}>{row.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <BodyText size="sm" className="font-medium leading-tight">{row.type}</BodyText>
                  <Eyebrow tone="muted">{row.focus}</Eyebrow>
                </div>
                <Eyebrow tone="muted">{row.dur}</Eyebrow>
              </div>
            ))}
          </div>
        </div>

        {/* Locked sample */}
        <div>
          <Eyebrow className="mb-3 px-1">Ukážka tréningov</Eyebrow>
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
            {[
              `Deň 1 — ${p.phases[0].title}`,
              `Deň 2 — Pokročilá séria`,
            ].map((w, i, arr) => (
              <div
                key={w}
                className={`px-5 py-4 flex items-center gap-4 ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}
              >
                <div className="h-10 w-10 rounded-xl bg-cream-200 flex items-center justify-center flex-shrink-0">
                  <Dumbbell className="size-4 text-ink/30" strokeWidth={1.5} />
                </div>
                <div className="flex-1 select-none">
                  <BodyText size="sm" className="blur-[3px] pointer-events-none font-medium">{w}</BodyText>
                  <Eyebrow tone="muted" className="blur-[3px] pointer-events-none">{p.duration} · Stredná intenzita</Eyebrow>
                </div>
                <Lock className="size-4 text-ink/25 flex-shrink-0" strokeWidth={1.5} />
              </div>
            ))}
          </div>
        </div>

        {/* What's included */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-3">Čo je zahrnuté ({totalWorkouts} tréningov)</Eyebrow>
          <div className="flex flex-col gap-2.5">
            {p.features.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-pillar-strava/[0.10] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="size-3 text-pillar-strava" strokeWidth={2.5} />
                </div>
                <BodyText size="sm">{item}</BodyText>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <Eyebrow className="mb-3 px-1">Skúsenosti žien</Eyebrow>
          <div className="flex flex-col gap-2.5">
            {p.testimonials.map((t) => (
              <div key={t.name} className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(193,133,106,0.15)' }}
                  >
                    <span style={{ fontFamily: 'Gilda Display, serif', fontSize: 14, color: TERRA, fontWeight: 500 }}>
                      {t.name[0]}
                    </span>
                  </div>
                  <BodyText size="sm" className="font-medium">{t.name}</BodyText>
                </div>
                <BodyText size="sm" tone="secondary" className="italic leading-relaxed">
                  „{t.text}"
                </BodyText>
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
                „Každý program som vytvorila s láskou a rokmi skúseností. Verím, že ti prinesie výsledky, ktoré si zaslúžiš — a pocit, že si silná."
              </BodyText>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <Eyebrow className="mb-3 px-1">Časté otázky</Eyebrow>
          <div className="flex flex-col gap-2">
            {p.faqs.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-5 pb-8 pt-4 bg-cream border-t border-ink/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <SerifHeader as="div" size="h2">{p.price}</SerifHeader>
          <Eyebrow tone="muted">Jednorazová platba · trvalý prístup</Eyebrow>
        </div>
        <button
          onClick={() => navigate('/paywall')}
          className="w-full py-4 rounded-full bg-ink text-cream font-sans font-semibold tracking-[-0.01em] transition-all active:scale-[0.98]"
        >
          Kúpiť {p.name}
        </button>
      </div>
    </div>
  );
}
