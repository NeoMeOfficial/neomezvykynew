import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Play } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';
import { FaqAccordion } from '@/components/v2/neome/FaqAccordion';
import { useUserProgram } from '../../hooks/useUserProgram';

interface ProgramData {
  name: string;
  level: number;
  weeks: number;
  description: string;
  features: string[];
  schedule: Array<{ day: string; type: string; duration: string }>;
  phases?: Array<{ weeks: string; title: string }>;
  equipment: string[];
  faqs: Array<{ q: string; a: string }>;
}

const programsData: Record<string, ProgramData> = {
  postpartum: {
    name: 'Postpartum',
    level: 1,
    weeks: 8,
    description: 'Program je vhodný pre ženy, ktoré potrebujú spevniť brušný korzet, vyriešiť diastázu či inkontinenciu, mesiace aj roky po pôrode.',
    features: [
      '24 bezpečných posilňovacích cvičení',
      '16 strečingových cvičení pre uvoľnenie napätia',
      '16 meditácií pre prinavrátenie si vnútorného balansu',
      'Progresívny 8-týždňový plán',
      'Cvičenia vhodné aj roky po pôrode',
      'Bezpečné cvičenia po sekcii (po 3 mesiacoch)',
    ],
    schedule: [
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Streda', type: 'Strečing & Meditácia', duration: '15–20 min' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Piatok', type: 'Strečing & Meditácia', duration: '15–20 min' },
    ],
    phases: [
      { weeks: 'Týždeň 1', title: 'Budujeme základy' },
      { weeks: 'Týždeň 2', title: 'Aktivácia panvového dna' },
      { weeks: 'Týždeň 3', title: 'Hlboké brušné svaly TVA' },
      { weeks: 'Týždeň 4', title: 'Čo s bolesťou chrbta' },
      { weeks: 'Týždeň 5', title: 'Posilňovanie s gumou' },
      { weeks: 'Týždeň 6', title: 'Viac než len sixpack' },
      { weeks: 'Týždeň 7', title: 'Tvoje telo pracuje ako celok' },
      { weeks: 'Týždeň 8', title: 'Prepojenie komplexnejších cvikov s dychom' },
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/overball-25cm-modry-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Pilates ball</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Dlhá rezistenčná guma</a>',
      '<a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Krátka rezistenčná guma</a>',
    ],
    faqs: [
      { q: 'Pre koho je program vhodný?', a: 'Postpartum program má intenzitu level 1 a je vhodný pre ženy, ktoré potrebujú spevniť brušný korzet, vyriešiť diastázu či inkontinenciu, mesiace aj roky po pôrode. Program je zameraný na obnovu core, posilnenie oslabeného panvového dna a bezpečný návrat k aktívnemu životu.' },
      { q: 'Ako mi tento program môže pomôcť?', a: 'Program ti pomôže obnoviť silu v core oblasti, vyriešiť problémy s diastázou a inkontinenciou. Posilníš oslabené partie z tehotenstva a pôrodu — hlboké brušné svaly a svaly panvového dna. Zlepší sa ti držanie tela, zmiernia sa bolesti chrbta a získaš sebadôveru pri návrate k pravidelnej aktivite.' },
      { q: 'Kedy môžem začať cvičiť po pôrode?', a: 'Začiatok cvičenia je individuálny a záleží od viacerých faktorov — od tvojho fitnes levelu pred a počas tehotenstva, od priebehu tvojho tehotenstva, od typu pôrodu a najmä od toho, kedy sa na to budeš psychicky cítiť. Cviky sú bezpečné a môžeš ich začať robiť už v prvých dňoch po pôrode, ak si mala bezrizikové tehotenstvo a pôrod.' },
      { q: 'Môžem cvičiť po cisárskom reze?', a: 'Po sekcii odporúčam najmenej 3 mesiace na regeneráciu rán a konzultáciu s lekárom alebo fyzio. Postpartum program je vhodný aj na posilnenie vnútorných brušných svalov po sekcii, pokiaľ máš rany zahojené.' },
      { q: 'Prečo je dôležité cvičiť panvové dno?', a: 'Svaly panvového dna sú súčasťou hlbokých brušných svalov — sú priamo prepojené na brušný korzet, chrbtové svaly a bránicu. Dostali zabrať počas 9 mesiacov, kedy váha drobčeka na nich tlačila a oslabovala ich. Bez ohľadu na to, či si rodila prirodzene alebo cisárskym, je veľmi dôležité venovať im pozornosť.' },
      { q: 'Aké výsledky môžem očakávať?', a: 'Pri pravidelnom cvičení posilníš oslabené partie z tehotenstva — hlboké brušné svaly a svaly panvového dna. Odstrániš diastázu a inkontinenciu (ak ňou trpíš). Budeš mať menej bolestí chrbta, lepšie držanie tela. Vďaka strečingu a meditáciám upevníš psychické zdravie.' },
      { q: 'Pomôže mi program schudnúť?', a: 'Postpartum program je vhodný kombinovať s vhodnou stravou, ak chceš vidieť výsledky na svojej hmotnosti. V aplikácii si môžeš pozrieť zdravé recepty v sekcii Strava alebo vyskúšať personalizovaný stravovací plán na mieru.' },
      { q: 'Kde si môžem pomôcky kúpiť?', a: 'Môžeš si ich kúpiť v športových obchodoch alebo online. Pilates ball — <a href="https://www.sharpshape.cz/p/overball-25cm-modry-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">SharpShape Overball 25cm</a>, dlhá rezistenčná guma — <a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Sharp Shape Resistance Band</a>.' },
    ],
  },
  bodyforming: {
    name: 'BodyForming',
    level: 2,
    weeks: 6,
    description: 'Program je vhodný pre ženy, ktoré začínajú so spevňovaním celého tela a netrpia diastázou.',
    features: [
      '18 posilňovacích cvičení s vlastnou váhou',
      '12 strečingov pre relaxáciu a uvoľnenie',
      '12 krátkych meditácií na uvoľnenie mysle',
      'Progresívny 6-týždňový plán',
      'Komplexné cvičenia na všetky svalové skupiny',
      'Techniky pre správne držanie tela a dýchanie',
    ],
    schedule: [
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Streda', type: 'Strečing & meditácia', duration: '15–20 min' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Piatok', type: 'Strečing & meditácia', duration: '15–20 min' },
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Krátka guma</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Dlhá guma</a>',
    ],
    faqs: [
      { q: 'Pre koho je program vhodný?', a: 'BodyForming program má intenzitu level 2 a je vhodný pre ženy, ktoré chcú začať so spevňovaním celého tela. Je skvelým vstupom do cvičenia, ak netrpíš diastázou. Program je ideálny pre začiatočníčky aj ženy, ktoré sa chcú vrátiť k pravidelnému cvičeniu po dlhšej prestávke.' },
      { q: 'Koľko času denne potrebujem na cvičenie?', a: 'Program vyžaduje 15–20 minút denne, 5 dní v týždni. Je navrhnutý tak, aby sa dal ľahko začleniť do každodennej rutiny aj pri obmedzenom čase.' },
      { q: 'Sú v programe relaxačné techniky?', a: 'Program obsahuje krátke meditácie, dychové cvičenia a strečingy, ktoré ti pomôžu uvoľniť napätie a regenerovať telo aj myseľ.' },
      { q: 'Pomôže mi program schudnúť?', a: 'BodyForming program je vhodný kombinovať s vhodnou stravou, ak chceš vidieť výsledky na svojej hmotnosti. V aplikácii si môžeš pozrieť zdravé recepty v sekcii Strava alebo vyskúšať personalizovaný stravovací plán na mieru.' },
    ],
  },
  'elastic-bands': {
    name: 'ElasticBands',
    level: 3,
    weeks: 6,
    description: 'Program je vhodný pre ženy, ktoré chcú vyformovať postavu a zvýšiť intenzitu cvičenia s použitím dynamického odporu elastických gúm.',
    features: [
      '18 posilňovacích cvičení s elastickými gumami',
      '12 strečingov pre relaxáciu a uvoľnenie',
      '12 krátkych meditácií',
      'Progresívny 6-týždňový plán',
      'Cviky na formovanie kritických partií',
      'Uvoľňovacie techniky na odstránenie napätia',
    ],
    schedule: [
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Streda', type: 'Strečing & meditácia', duration: '15–20 min' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Piatok', type: 'Strečing & meditácia', duration: '15–20 min' },
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Krátka guma</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Dlhá guma</a>',
    ],
    faqs: [
      { q: 'Pre koho je program vhodný?', a: 'ElasticBands program má intenzitu level 3. Je ideálny pre formovanie a spevňovanie celého tela pomocou dynamického odporu. Je vhodné mať dobré základy. Ak máš dlhšiu pauzu od cvičenia, pozri si Level 2 BodyForming.' },
      { q: 'Prečo sú gumy skvelou pomôckou?', a: 'Elastické gumy poskytujú progresívny odpor, ktorý rastie spolu s pohybom. Umožňujú ti trénovať všetky svalové skupiny, sú bezpečné, kompaktné a ideálne pre domáce cvičenie.' },
      { q: 'Sú gumy bezpečné?', a: 'Áno, ale dôležité je kontrolovať ich stav pred každým použitím. Poškodené gumy môžu prasknúť a spôsobiť zranenie.' },
    ],
  },
  'strong-sexy': {
    name: 'Strong&Sexy',
    level: 4,
    weeks: 6,
    description: 'Program je vhodný pre ženy, ktoré chcú posunúť svoje hranice, získať silnejšie a vyformovanejšie telo a začať cvičiť s jednoručkami.',
    features: [
      '18 pokročilých posilňovacích cvičení s jednoručkami',
      '12 strečingov pre hlbokú relaxáciu',
      '12 krátkych meditácií na mentálnu regeneráciu',
      'Progresívny 6-týždňový plán',
      'Komplexné cvičenia na celé telo',
      'Uvoľňovacie techniky na odstránenie napätia',
    ],
    schedule: [
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Streda', type: 'Strečing & meditácia', duration: '15–20 min' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min' },
      { day: 'Piatok', type: 'Strečing & meditácia', duration: '15–20 min' },
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-vinyl-set-2-x-4-grey/vinylove-cinky-2-x-4-kg-sede-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Jednoručky 1–2 kg (začiatočníčky)</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-vinyl-set-2-x-4-grey/vinylove-cinky-2-x-4-kg-sede-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Jednoručky 3–5 kg (pokročilé)</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color:#B8864A;text-decoration:underline">Dlhá guma</a>',
    ],
    faqs: [
      { q: 'Pre koho je program vhodný?', a: 'Strong&Sexy program má intenzitu level 4 a je určený pre ženy, ktoré sa venujú cvičeniu, majú dobrú techniku a sú pripravené si sťažiť cvičenia. Tento program je pre pokročilé ženy, ktoré chcú posunúť svoje hranice.' },
      { q: 'Aké jednoručky potrebujem?', a: 'Ak si nikdy s činkami necvičila, odporúčam 1–2 kg. Ak sa cvičeniu s váhami venuješ, vyskúšaj 3–5 kg.' },
      { q: 'Nebudem po cvičení s jednoručkami príliš svalnatá?', a: 'Nie! Ženy majú iný hormonálny profil ako muži a nedosiahnu takú svalovú hmotu. Silový tréning ti pomôže vytvoriť pekné, definované krivky.' },
    ],
  },
};

export default function PostpartumInfo() {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();
  const { hasProgram } = useUserProgram();

  const prog = programsData[programId || 'postpartum'] || programsData.postpartum;

  const LEVEL_LABELS = ['', 'Začiatočník', 'Mierne pokročilá', 'Pokročilá', 'Expert'];

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar
        title={prog.name}
        onBack={() => navigate('/kniznica/telo/programy')}
      />

      <div className="px-5 pt-2 flex flex-col gap-4">
        {/* Header card */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <SerifHeader as="h2" size="h2">{prog.name}</SerifHeader>
              <Eyebrow tone="muted" className="mt-0.5">{prog.weeks} týždňov · 5× týždenne</Eyebrow>
            </div>
            <span className="font-sans text-[10px] px-2.5 py-1 rounded-full bg-terra/[0.10] text-terra font-medium">
              Level {prog.level}
            </span>
          </div>
          <BodyText tone="secondary">{prog.description}</BodyText>
          <button
            onClick={() => navigate(`/program/${programId || 'postpartum'}`)}
            className="mt-4 w-full py-3.5 rounded-full bg-ink text-cream font-sans font-semibold transition-all active:scale-[0.98]"
          >
            Začať program
          </button>
        </div>

        {/* What's included */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-3">Čo obsahuje program</Eyebrow>
          <div className="flex flex-col gap-2.5">
            {prog.features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-terra/[0.10] flex items-center justify-center flex-shrink-0">
                  <Check className="size-3 text-terra" strokeWidth={2.5} />
                </div>
                <BodyText size="sm">{f}</BodyText>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly schedule */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-ink/[0.06]">
            <Eyebrow>Týždňový rozvrh</Eyebrow>
          </div>
          {prog.schedule.map((day, i, arr) => (
            <div
              key={i}
              className={`px-5 py-3 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}
            >
              <BodyText size="sm" className="font-medium w-24 flex-shrink-0">{day.day}</BodyText>
              <BodyText size="sm" tone="secondary" className="flex-1">{day.type}</BodyText>
              <Eyebrow tone="muted">{day.duration}</Eyebrow>
            </div>
          ))}
        </div>

        {/* 8-week phases (postpartum only) */}
        {prog.phases && (
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-ink/[0.06]">
              <Eyebrow>Postup programu</Eyebrow>
            </div>
            {prog.phases.map((phase, i, arr) => (
              <div
                key={i}
                className={`px-5 py-3 flex items-center gap-4 ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}
              >
                <Eyebrow tone="muted" className="w-20 flex-shrink-0">{phase.weeks}</Eyebrow>
                <BodyText size="sm">{phase.title}</BodyText>
              </div>
            ))}
          </div>
        )}

        {/* Equipment */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-3">Čo budeš potrebovať</Eyebrow>
          <div className="flex flex-col gap-2.5">
            {prog.equipment.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-gold/[0.10] flex items-center justify-center flex-shrink-0">
                  <Check className="size-3 text-gold" strokeWidth={2.5} />
                </div>
                <span
                  className="font-sans text-sm text-ink"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <Eyebrow className="mb-3 px-1">Často kladené otázky</Eyebrow>
          <FaqAccordion items={prog.faqs} accent="#C1856A" />
        </div>
      </div>
    </div>
  );
}
