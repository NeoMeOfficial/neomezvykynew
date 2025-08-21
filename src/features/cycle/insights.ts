import { PhaseKey } from './types';

export const PHASE_LABELS: Record<PhaseKey, string> = {
  menstrual: "Menštruácia",
  follicular: "Folikulárna", 
  ovulation: "Ovulácia",
  luteal: "Luteálna",
};

export const PHASE_INSIGHTS: Record<PhaseKey, {
  title: string;
  description: string;
  recommendations: string[];
  energy: string;
  mood: string;
}> = {
  menstrual: {
    title: "Čas na oddych",
    description: "Telo sa regeneruje a pripravuje na nový cyklus.",
    recommendations: [
      "Teraz je čas dopriať si viac odpočinku a byť k sebe jemná",
      "Skúste jemné cvičenie ako jógu alebo precházky",
      "Teplé nápoje a výživná strava vám pomôžu cítiť sa lepšie",
      "Počúvajte svoje telo a nedávajte na seba príliš veľký tlak"
    ],
    energy: "Nižšia energia",
    mood: "Introspektívna nálada"
  },
  follicular: {
    title: "Rastúca energia",
    description: "Hormóny sa zvyšujú, cítite sa čoraz lepšie.",
    recommendations: [
      "Toto je ideálny čas na spustenie nových projektov a výziev",
      "Vaše telo zvládne náročnejšie kardio cvičenie",
      "Využite túto energiu na sociálne aktivity a stretávanie sa s priateľmi",
      "Plánujte si ciele a užívajte si túto pozitívnu fázu"
    ],
    energy: "Rastúca energia",
    mood: "Optimistická nálada"
  },
  ovulation: {
    title: "Vrchol cyklu",
    description: "Najvyššia energia a sebavedomie.",
    recommendations: [
      "Využite túto energiu na najnáročnejšie cvičenie a športové aktivity",
      "Ideálny čas na dôležité stretnutia, prezentácie a rozhodnutia",
      "Vaša kreativita je na vrchole, venujte sa kreatívnym projektom",
      "Komunikujte otvorene s ostatnými, máte prirodzené charisma"
    ],
    energy: "Maximálna energia",
    mood: "Sebavedomá nálada"
  },
  luteal: {
    title: "Príprava na odpočinok",
    description: "Energia postupne klesá, telo sa pripravuje na menštruáciu.",
    recommendations: [
      "Sústreďte sa na dokončovanie rozpracovaných úloh",
      "Zvoľte tempo a prejdite na miernejšie cvičenie ako pilates",
      "Jedzte zdravé a výživné jedlá, ktoré vás nasýtia",
      "Pripravte sa mentálne aj prakticky na nadchádzajúcu menštruáciu"
    ],
    energy: "Klesajúca energia",
    mood: "Pokojnejšia nálada"
  }
};

export const UI_TEXT = {
  welcome: "Vitaj! Začnime nastavením tvojho cyklu",
  energyMood: "Energia a nálada – odhad na dnes",
  lastPeriod: "Posledná menštruácia",
  cycleLength: "Dĺžka cyklu",
  periodLength: "Dĺžka menštruácie", 
  expectedPeriod: "Očakávaná menštruácia",
  newPeriod: "Nová menštruácia",
  todayEstimate: "Odhad na dnes",
  whatToDo: "Čo s tým",
  save: "Uložiť",
  cancel: "Zrušiť",
  edit: "Upraviť",
  day: "deň",
  days: "dni",
  today: "DNES",
  setup: "Nastavenie",
  history: "História",
  settings: "Nastavenia",
  selectDate: "Vybrať dátum"
};