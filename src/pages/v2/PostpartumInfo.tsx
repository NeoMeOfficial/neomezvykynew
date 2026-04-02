import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Star, Play, Clock, Heart, ChevronDown, ChevronUp, Upload, Video } from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import { useUserProgram } from '../../hooks/useUserProgram';

interface ProgramData {
  name: string;
  level: number;
  weeks: number;
  description: string;
  features: string[];
  schedule?: Array<{ day: string; type: string; duration: string; focus: string }>;
  phases?: Array<{ weeks: string; title: string; description: string; icon: string }>;
  equipment: string[];
  faqs: Array<{ q: string; a: string }>;
}

const programsData: Record<string, ProgramData> = {
  'postpartum': {
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
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Streda', type: 'Strečing & Meditácia', duration: '15-20 min', focus: '' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Piatok', type: 'Strečing & Meditácia', duration: '15-20 min', focus: '' },
    ],
    phases: [
      {
        weeks: 'Týždeň 1',
        title: 'Budujeme základy',
        description: '',
        icon: '🌱'
      },
      {
        weeks: 'Týždeň 2',
        title: 'Aktivácia panvového dna',
        description: '',
        icon: '🎯'
      },
      {
        weeks: 'Týždeň 3',
        title: 'Hlboké brušné svaly TVA',
        description: '',
        icon: '💪'
      },
      {
        weeks: 'Týždeň 4',
        title: 'Čo s bolesťou chrbta',
        description: '',
        icon: '🩺'
      },
      {
        weeks: 'Týždeň 5',
        title: 'Posilňovanie s gumou',
        description: '',
        icon: '💯'
      },
      {
        weeks: 'Týždeň 6',
        title: 'Viac než len sixpack',
        description: '',
        icon: '⭐'
      },
      {
        weeks: 'Týždeň 7',
        title: 'Tvoje telo pracuje ako celok',
        description: '',
        icon: '🔗'
      },
      {
        weeks: 'Týždeň 8',
        title: 'Prepojenie komplexnejších cvikov s dychom',
        description: '',
        icon: '✨'
      }
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/overball-25cm-modry-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Pilates ball</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Dlhá rezistenčná guma</a>',
      '<a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Krátka rezistenčná guma</a>'
    ],
    faqs: [
      {
        q: 'Pre koho je program vhodný?',
        a: 'Postpartum program má intenzitu level 1 a je vhodný pre ženy, ktoré potrebujú spevniť brušný korzet, vyriešiť diastázu či inkontinenciu, mesiace aj roky po pôrode. Program je zameraný na obnovu core, posilnenie oslabeného panvového dna a bezpečný návrat k aktívnemu životu.'
      },
      {
        q: 'Ako mi tento program môže pomôcť?',
        a: 'Program ti pomôže obnoviť silu v core oblasti, vyriešiť problémy s diastázou a inkontinenciou. Posilníš oslabené partie z tehotenstva a pôrodu - hlboké brušné svaly a svaly panvového dna. Zlepší sa ti držanie tela, zmiernenia sa bolesti chrbta a získaš sebadôveru pri návrate k pravidelnej aktivite. Relaxačné techniky ti pomôžu zvládnuť mamičkovské hormóny a emócie.'
      },
      {
        q: 'Už som roky po pôrode, je program aj pre mňa?',
        a: 'Každá žena by si mala prejsť cvičeniami, ktoré sa zameriavajú na posilnenie partií, ktoré boli počas tehotenstva a pôrodu namáhané. Je jedno ako dlho si po pôrode. Ak sa chceš začať hýbať, len nevieš ako, aké cvičenia sú pre teba vhodné a bezpečné, Postpartum program je tvoja bezpečná vstupenka do aktívneho života bez ohľadu nato, jak dávno si porodila.'
      },
      {
        q: 'Kedy môžem začať cvičiť po pôrode?',
        a: 'Začiatok cvičenia je individuálny a záleží od viacerých faktorov - od tvojho fitnes levelu pred a počas tehotenstva, od priebehu tvojho tehotenstva, od typu pôrodu a najmä od toho, kedy sa na to budeš psychicky cítiť. Cviky sú bezpečné a môžeš ich začať robiť už v prvých dňoch po pôrode ak si mala bezrizikové tehotenstvo a pôrod. Ak si mala rizikové tehotenstvo, alebo náročný pôrod je vhodné, aby si sa poradila so svojim lekárom alebo fyzio.'
      },
      {
        q: 'Môžem cvičiť po cisárskom reze?',
        a: 'Po sekcii odporúčam najmenej 3 mesiace na regeneráciu rán a konzultáciu s lekárom alebo fyzio. Postpartum program je vhodný aj na posilnenie vnutorných brušných svalov po sekcii, pokiaľ už máš rany zahojené.'
      },
      {
        q: 'Prečo je dôležité cvičiť panvové dno?',
        a: 'Svaly panvového dna sú súčasťou tvojich hlbokých brušných svalov - sú priamo prepojené na tvoj brušný korzet, chrbtové svaly a bránicu. Svaly panvového dna dostali zabrať počas 9 mesiacov, kedy váha tvojho malého drobčeka na nich tlačila a oslabovala ich. Bez ohľadu nato, či si rodila prirodzene alebo cisárskym je veľmi dôležité, aby si im venovala pozornosť a posilnila ich.'
      },
      {
        q: 'Ako vyzerá týždňový rozvrh programu?',
        a: 'Od pondelka do piatka budeš odo mňa dostávať email s informáciami o danom cvičení a s link-om na samotné cvičenie. Pondelok, Utorok a Štvrtok sa venujeme posilňovacím cvičeniam. Stredy a Piatky sa venujeme strečingom a meditáciám. Každý deň budeš odo mňa taktiež dostávať motivačné video, ktoré ťa nakopne a pripomenie ti, prečo si sa rozhodla sa k nám pripojiť.'
      },
      {
        q: 'Aké výsledky môžem očakávať?',
        a: 'Pri pravidelnom cvičení a nasledovaní programu, posilníš oslabené partie z tehotenstva a pôrodu - hlboké brušné svaly a svaly panvového dna. Odstrániš diastázu a inkontinenciu (ak ňou trpíš). Budeš mať menšie bolesti chrbta, lepšie držanie tela. Rozdiely budú viditeľné, ale aj pocitové. Postpartum program ti poslúži ako bezpečná vstupenka k cvičeniu ako takému. Vďaka strečingu a meditáciám upevníš svoje psychické zdravie a dostaneš tak aspoň trochu pod kontrolu mamičkovské hormóny - emócie.'
      },
      {
        q: 'Pomôže mi program schudnúť?',
        a: 'Ako akékoľvek iné cvičenie aj náš Postpartum program je vhodný kombinovať s vhodnou stravou, ak chceš vidieť výsledky na svojej hmotnosti. Pri kontrole hmotnosti a jej redukcii platí jednoduchá rovnica - tvoj energetický príjem musí byť menší ako výdaj. Je ale veľmi dôležité, aby si telu dodala všetky makroživiny, ktoré potrebuje. V aplikácii si môžeš pozrieť naše zdravé receptíky v sekcii Strava, alebo vyskúšať náš personalizovaný stravovací plán na mieru pre optimálne výsledky.'
      },
      {
        q: 'Kde si môžem pomôcky kúpiť?',
        a: 'Môžeš si ich kúpiť v športových obchodoch alebo online. Pilates ball - <a href="https://www.sharpshape.cz/p/overball-25cm-modry-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">SharpShape Overball 25cm</a>, dlhá rezistenčná guma - <a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Sharp Shape Resistance Band</a>, krátka rezistenčná guma - <a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Set posilňovacích gúm Mini</a>.'
      }
    ]
  },
  'bodyforming': {
    name: 'BodyForming',
    level: 2,
    weeks: 6,
    description: 'Program je vhodný pre ženy, ktoré začínajú so spevňovaním celého tela a netrpia diastázou.',
    features: [
      '18 posilňovacích cvičení s vlastnou váhou',
      '12 strečingov pre relaxáciu a uvoľnenie',
      '12 krátkych meditácií na uvoľnenie mysle a sprítomnenie',
      'Progresívny 6-týždňový plán s postupným nárastom intenzity',
      'Komplexné cvičenia na všetky svalové skupiny',
      'Techniky pre správne držanie tela a dýchanie',
    ],
    schedule: [
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Streda', type: 'Strečing & meditácia', duration: '15-20 min', focus: '' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Piatok', type: 'Strečing & meditácia', duration: '15-20 min', focus: '' },
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Krátka guma</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Dlhá guma</a>'
    ],
    faqs: [
      {
        q: 'Pre koho je program vhodný?',
        a: 'BodyForming program má intenzitu level 2 a je vhodný pre ženy, ktoré chcú začať so spevňovaním celého tela a komplexným posilnením. Je skvelým vstupom do cvičenia, ak netrpíš diastázou. Program je ideálny pre začiatočníčky aj ženy, ktoré sa chcú vrátiť k pravidelnému cvičeniu po dlhšej prestávke.'
      },
      {
        q: 'Ako mi tento program môže pomôcť?',
        a: 'Program ti pomôže komplexne posilniť celé telo s dôrazom na problémové partie - brucho, stehná a zadok. Naučíš sa správne techniky pre držanie tela a dýchanie, posilníš svaly celého tela a zlepšíš svoju kondíciu. Relaxačné prvky ti pomôžu uvoľniť napätie a regenerovať po cvičení. Je to bezpečný spôsob, ako začať s pravidelným cvičením.'
      },
      {
        q: 'Koľko času denne potrebujem na cvičenie?',
        a: 'Program vyžaduje 15-20 minút denne, 5 dní v týždni. Je navrhnutý tak, aby sa dal ľahko začleniť do každodennej rutiny aj pri obmedzenom čase.'
      },
      {
        q: 'Aké elastické gumy potrebujem?',
        a: 'Odporúčam set s rôznym odporom - ľahký, stredný a silný. Plus jednu dlhú gumu so stredným odporom. Tieto pomôcky ti umožnia rozmanitejšie a efektívnejšie cvičenie s postupne rastúcim odporom.'
      },
      {
        q: 'Kde si môžem kúpiť vhodné gumy?',
        a: 'Kvalitné elastické gumy nájdeš v športových obchodoch alebo online ako napr na <a href="https://www.sharpshape.cz/" target="_blank" rel="noopener noreferrer" style="color: #6B4C3B; text-decoration: underline;">www.sharpshape.cz</a>. Dlhá guma - <a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color: #6B4C3B; text-decoration: underline;">Sharp Shape Resistance Band</a>, set krátkych gúm - <a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #6B4C3B; text-decoration: underline;">Set posilňovacích gúm Mini</a>'
      },
      {
        q: 'Sú v programe relaxačné techniky?',
        a: 'Určite! Program obsahuje krátke meditácie, dychové cvičenia a strečingy, ktoré ti pomôžu uvoľniť napätie a regenerovať telo aj myseľ.'
      },
      {
        q: 'Pomôže mi program schudnúť?',
        a: 'Ako akékoľvek iné cvičenie aj náš BodyForming program je vhodný kombinovať s vhodnou stravou, ak chceš vidieť výsledky na svojej hmotnosti. Pri kontrole hmotnosti a jej redukcii platí jednoduchá rovnica - tvoj energetický príjem musí byť menší ako výdaj. Je ale veľmi dôležité, aby si telu dodala všetky makroživiny, ktoré potrebuje. V našej NeoMe aplikácii si môžeš pozrieť naše zdravé receptíky v sekcii Strava, alebo vyskúšať náš personalizovaný stravovací plán na mieru pre optimálne výsledky.'
      }
    ]
  },
  'elastic-bands': {
    name: 'ElasticBands',
    level: 3,
    weeks: 6,
    description: 'Program je vhodný pre ženy, ktoré chcú vyformovať postavu a zvýšiť intenzitu cvičenia s použitím dynamického odporu elastických gúm.',
    features: [
      '18 posilňovacích cvičení s elastickými gumami',
      '12 strečingov pre relaxáciu a uvoľnenie',
      '12 krátkych meditácií na uvoľnenie mysle a sprítomnenie',
      'Progresívny 6-týždňový plán s postupným nárastom intenzity',
      'Cviky na formovanie kritických partií',
      'Uvoľňovacie techniky na odstránenie napätia a stuhnutosti',
    ],
    schedule: [
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Streda', type: 'Strečing & meditácia', duration: '15-20 min', focus: '' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Piatok', type: 'Strečing & meditácia', duration: '15-20 min', focus: '' },
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Krátka guma</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Dlhá guma</a>'
    ],
    faqs: [
      {
        q: 'Pre koho je program vhodný?',
        a: 'ElasticBands program má intenzitu level 3. Je ideálny pre formovanie a spevňovanie celého tela pomocou dynamického odporu. Zahŕňa komplexné cvičenia s gumou, takže je vhodné, aby si mala dobré základy. Ak máš dlhšiu pauzu od cvičenia, alebo si sa cvičeniu nevenovala, pozri si Level 2 BodyForming, prípadne Level 1 Postpartum program.'
      },
      {
        q: 'Ako mi tento program môže pomôcť?',
        a: 'Pomôže ti formovať zadok, stehná a paže, posilní tvoj core a zlepší celkovú kondíciu. Elastické gumy zabezpečujú progresívny odpor, ktorý sa prispôsobuje tvojej sile. Program pomáha pri budovaní sily a zlepšuje koordináciu. Okrem toho obsahuje relaxačné prvky, ktoré ti pomôžu uvoľniť napätie a regenerovať po cvičení a odstrániť bolesti a stuhnutosti.'
      },
      {
        q: 'Aké elastické gumy potrebujem?',
        a: 'Odporúčam set s rôznym odporom - ľahký, stredný a silný. Plus jednu dlhú gumu so stredným odporom.'
      },
      {
        q: 'Kde si môžem kúpiť vhodné gumy?',
        a: 'Kvalitné elastické gumy nájdeš v športových obchodoch alebo online ako napr na <a href="https://www.sharpshape.cz/" target="_blank" rel="noopener noreferrer" style="color: #6B4C3B; text-decoration: underline;">www.sharpshape.cz</a>. Dlhá guma - <a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color: #6B4C3B; text-decoration: underline;">Sharp Shape Resistance Band</a>, set krátkych gúm - <a href="https://www.sharpshape.cz/p/set-posilovacich-gum-mini-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #6B4C3B; text-decoration: underline;">Set posilňovacích gúm Mini</a>'
      },
      {
        q: 'Prečo sú gumy skvelou pomôckou na formovanie a spevňovanie tela?',
        a: 'Elastické gumy poskytujú progresívny odpor, ktorý rastie spolu s pohybom. Umožňujú ti trénovať všetky svalové skupiny, sú bezpečné, kompaktné a ideálne pre domáce cvičenie. Elastické gumy sú bezpečným medzikrokom medzi cvičením s vlastnou váhou a cvičením s činkami.'
      },
      {
        q: 'Môžem nahradiť gumy inými pomôckami?',
        a: 'Elastické gumy sú kľúčové pre tento program, pretože poskytujú dynamický odpor. Iné pomôcky neposkytnú rovnaký efekt.'
      },
      {
        q: 'Sú gumy bezpečné?',
        a: 'Áno, ale dôležité je kontrolovať ich stav pred každým použitím. Poškodené gumy môžu prasknúť a spôsobiť zranenie.'
      },
      {
        q: 'Sú v programe relaxačné techniky?',
        a: 'Určite! Program obsahuje krátke meditácie, dychové cvičenia a strečingy, ktoré ti pomôžu uvoľniť napätie a regenerovať telo aj myseľ po intenzívnom cvičení s gumami.'
      },
      {
        q: 'Pomôže mi program schudnúť?',
        a: 'Ako akékoľvek iné cvičenie aj náš ElasticBands program je vhodný kombinovať s vhodnou stravou, ak chceš vidieť výsledky na svojej hmotnosti. Pri kontrole hmotnosti a jej redukcii platí jednoduchá rovnica - tvoj energetický príjem musí byť menší ako výdaj. Je ale veľmi dôležité, aby si telu dodala všetky makroživiny, ktoré potrebuje. V našej NeoMe aplikácii si môžeš pozrieť naše zdravé receptíky v sekcii Strava, alebo vyskúšať náš personalizovaný stravovací plán na mieru pre optimálne výsledky.'
      }
    ]
  },
  'strong-sexy': {
    name: 'Strong&Sexy',
    level: 4, 
    weeks: 6,
    description: 'Program je vhodný pre ženy, ktoré chcú posunúť svoje hranice, získať silnejšie a vyformovanejšie telo a začať cvičiť s jednoručkami.',
    features: [
      '18 pokročilých posilňovacích cvičení s jednoručkami',
      '12 strečingov pre hlbokú relaxáciu a uvoľnenie',
      '12 krátkych meditácií na mentálnu regeneráciu a sprítomnenie',
      'Progresívny 6-týždňový plán s postupným nárastom intenzity',
      'Komplexné cvičenia na získanie silnejšieho, funkčnejšieho a sexy vyformovaného tela',
      'Uvoľňovacie techniky na odstránenie napätia a stuhnutosti'
    ],
    schedule: [
      { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Streda', type: 'Strečing a meditácia', duration: '15-20 min', focus: '' },
      { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: '' },
      { day: 'Piatok', type: 'Strečing a meditácia', duration: '15-20 min', focus: '' },
    ],
    equipment: [
      '<a href="https://www.sharpshape.cz/c/joga-a-prislusenstvi/podlozky-na-jogu/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Karimatka</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-vinyl-set-2-x-4-grey/vinylove-cinky-2-x-4-kg-sede-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Jednoručky 1-2kg (začiatočníčky)</a>',
      '<a href="https://www.sharpshape.cz/p/sharp-shape-vinyl-set-2-x-4-grey/vinylove-cinky-2-x-4-kg-sede-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Jednoručky 3-5kg (pokročilé)</a>', 
      '<a href="https://www.sharpshape.cz/p/sharp-shape-resistance-band-21-mm-e16634htm/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">Dlhá guma</a>'
    ],
    faqs: [
      {
        q: 'Pre koho je program vhodný?',
        a: 'Strong&Sexy program má intenzitu level 4 a je určený pre ženy, ktoré sa venujú cvičeniu, majú dobrú techniku a sú pripravené si sťažiť cvičenia a poskytnúť telu ďalší stimul. Stimul je základ formovania postavy. Tento program je pre pokročilé ženy, ktoré chcú posunúť svoje hranice.'
      },
      {
        q: 'Ako mi tento program môže pomôcť?',
        a: 'Program ti pomôže vybudovať silnejšie a vyformovanejšie telo pomocou pokročilých silových cvičení s jednoručkami. Vytvoríš si sexy, definované krivky a posilníš svalovú silu. Program je navrhnutý na formovanie postavy a budovanie sebavedomia. Získaš silu, ktorá ti dodá sebadôveru nielen v telocvični, ale aj v každodennom živote.'
      },
      {
        q: 'Aké jednoručky potrebujem?',
        a: 'Ak si nikdy s činkami necvičila, odporúčam 1-2kg. Vyskúšaj, uvidíš. Ak si sa cvičeniu s váhami venovala resp. venuješ, vyskúšaj 3-5kg.'
      },
      {
        q: 'Je tento program vhodný pre začiatočníčky?',
        a: 'Tento program je určený pre ženy, ktoré sa cvičeniu venujú a majú dobrú techniku cvičeniu. Ak si začiatočníčka, odporúčam najprv BodyForming program.'
      },
      {
        q: 'Nebudem po cvičení s jednoručkami príliš svalnatá?',
        a: 'Nie! Ženy majú iný hormonálny profil ako muži a nedosiahnu takú svalovú hmotu. Silový tréning ti pomôže vytvoriť pekné, definované krivky.'
      },
      {
        q: 'Ako často si môžem zvýšiť záťaž?',
        a: 'Počúvaj svoje telo. Keď cvičenie s aktuálnou váhou už nie je výzva a dokážeš ho urobiť s dokonalou technikou, je čas zvýšiť záťaž.'
      },
      {
        q: 'Pomôže mi tento program schudnúť?',
        a: 'Ako akékoľvek iné cvičenie aj náš Strong&Sexy program je vhodný kombinovať s vhodnou stravou, ak chceš vidieť výsledky na svojej hmotnosti. Pri kontrole hmotnosti a jej redukcii platí jednoduchá rovnica - tvoj energetický príjem musí byť menší ako výdaj. Je ale veľmi dôležité, aby si telu dodala všetky makroživiny, ktoré potrebuje. V našej NeoMe aplikácii si môžeš pozrieť naše zdravé receptíky v sekcii Strava, alebo vyskúšať náš personalizovaný stravovací plán na mieru pre optimálne výsledky.'
      },
      {
        q: 'Kde si môžem činky kúpiť?',
        a: 'Jednoručky si môžeš kúpiť v rôznych obchodoch so športovými potrebami alebo online. Napríklad na <a href="https://www.sharpshape.cz/p/sharp-shape-vinyl-set-2-x-4-grey/vinylove-cinky-2-x-4-kg-sede-sharp-shape/" target="_blank" rel="noopener noreferrer" style="color: #B8864A; text-decoration: underline;">SharpShape.cz</a> majú kvalitné vinylové činky v rôznych váhach, ktoré sú ideálne pre domáce cvičenie.'
      }
    ]
  }
};

// Video Upload/Player component
function VideoHero({
  introVideo,
  isVideoPlaying,
  setIsVideoPlaying,
  onVideoUpload,
  programName
}: {
  introVideo: string | null;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  programName: string;
}) {
  if (!introVideo) {
    // Upload interface
    return (
      <div className="w-full h-48 rounded-3xl mx-auto mb-6 border-2 border-dashed border-white/40 bg-white/20 backdrop-blur-sm">
        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-white/10 transition-colors rounded-3xl">
          <div className="w-16 h-16 rounded-full mb-3" style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}>
            <div className="w-full h-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold mb-1" style={{ color: colors.textPrimary }}>
              Pridaj úvodné video
            </p>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Osobne predstav {programName} program
            </p>
            <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>
              Klikni pre výber videa
            </p>
          </div>
          <input
            type="file"
            accept="video/*"
            onChange={onVideoUpload}
            className="hidden"
          />
        </label>
      </div>
    );
  }

  // Video player interface
  return (
    <div className="w-full h-48 rounded-3xl mx-auto mb-6 relative overflow-hidden bg-black/20 backdrop-blur-sm">
      {!isVideoPlaying ? (
        <div
          className="absolute inset-0 bg-cover bg-center cursor-pointer group"
          onClick={() => setIsVideoPlaying(true)}
        >
          {/* Video thumbnail/poster */}
          <video
            src={introVideo}
            className="w-full h-full object-cover"
            muted
          />
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Play className="w-8 h-8 ml-1" style={{ color: colors.telo }} />
            </div>
          </div>
          {/* Video info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-white" />
                <p className="text-white font-medium text-sm">
                  Úvodné video - {programName}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <video
          src={introVideo}
          controls
          autoPlay
          className="w-full h-full object-cover"
          onEnded={() => setIsVideoPlaying(false)}
        />
      )}
    </div>
  );
}

// FAQ component for displaying collapsible questions

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/35 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between bg-white hover:bg-white/20 transition-colors"
      >
        <span className="font-medium" style={{ color: colors.textPrimary }}>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 bg-white">
          <p 
            style={{ color: colors.textSecondary }} 
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
}

export default function PostpartumInfo() {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();
  const { hasProgram, userProgram } = useUserProgram();

  // Video upload state
  const [introVideo, setIntroVideo] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Get current program data
  const currentProgram = programsData[programId || 'postpartum'] || programsData['postpartum'];

  // Handle video upload
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      setIntroVideo(videoUrl);
      // In real app, upload to cloud storage here
    }
  };

  // COMPLETELY DISABLED PROGRESS VIEW - Always show detailed info
  if (false) {
    return (
      <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
        <div className="p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pt-8">
            <button onClick={() => navigate('/kniznica/telo/programy')} className="p-1">
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} strokeWidth={1.5} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{currentProgram.name} Program</h1>
          </div>

          {/* Progress Overview */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Týždeň {userProgram.week}, Deň {userProgram.day}
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Pokračuješ skvele! 💪
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: colors.telo }}>
                  {Math.round((userProgram.week / 8) * 100)}%
                </div>
                <p className="text-xs" style={{ color: colors.textTertiary }}>dokončené</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(userProgram.week / 8) * 100}%`,
                  background: `linear-gradient(90deg, ${colors.telo}, ${colors.telo}CC)`
                }}
              />
            </div>
          </div>

          {/* Today's Workout */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Dnešné cvičenie</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}>
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: colors.textPrimary }}>Core aktivácia</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>15 minút • Brušné svaly + panvové dno</p>
              </div>
              <button
                className="px-6 py-2 rounded-2xl text-white font-medium shadow-md"
                style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}
              >
                Začať
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Information view for users with NeoMe subscription
  return (
    <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
      <div className="p-5 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pt-8">
          <button onClick={() => navigate('/kniznica/telo/programy')} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>{currentProgram.name} Program</h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Level {currentProgram.level} • {currentProgram.weeks} týždňov</p>
          </div>
        </div>

        {/* Hero Section with Video */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <div className="text-center mb-6">
            {/* Video Upload/Player */}
            <VideoHero
              introVideo={introVideo}
              isVideoPlaying={isVideoPlaying}
              setIsVideoPlaying={setIsVideoPlaying}
              onVideoUpload={handleVideoUpload}
              programName={currentProgram.name}
            />

            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              {currentProgram.name}
            </h2>
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              {currentProgram.description}
            </p>
          </div>

          {/* Start Program Button */}
          <button
            onClick={() => navigate(`/program/${programId}`)}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-md"
            style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}
          >
            Začať program
          </button>
        </div>

        {/* Program Features */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Čo obsahuje program
          </h3>
          <div className="space-y-3">
            {currentProgram.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.telo }}>
                  <Check className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span style={{ color: colors.textPrimary }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule - only for programs that have schedule */}
        {currentProgram.schedule && (
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Týždňový rozvrh
            </h3>
            <div className="space-y-2">
              {currentProgram.schedule.map((day, index) => (
                <div key={index} className="flex items-center py-2 px-3 rounded-lg" style={{ backgroundColor: `${colors.telo}04` }}>
                  <div className="flex items-center" style={{ width: '240px' }}>
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{day.day}</span>
                    <span className="text-sm ml-2" style={{ color: colors.textSecondary }}>- {day.type}</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.telo }}>{day.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Phases - only for programs that have phases */}
        {currentProgram.phases && (
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Postup programu
            </h3>
            <div className="space-y-2">
              {currentProgram.phases.map((phase, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-lg">{phase.icon}</div>
                  <div className="flex-1">
                    <span className="text-xs" style={{ color: colors.textSecondary }}>{phase.weeks}</span>
                    <span className="font-medium ml-2" style={{ color: colors.textPrimary }}>{phase.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment Section */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Čo budeš potrebovať
          </h3>
          <div className="space-y-3">
            {currentProgram.equipment.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.telo }}>
                  <Check className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span style={{ color: colors.textPrimary }} dangerouslySetInnerHTML={{ __html: item }}></span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary }}>
            Často kladené otázky
          </h3>
          <div className="space-y-3">
            {currentProgram.faqs.map((faq, index) => (
              <FAQ key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}