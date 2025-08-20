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
      "Doprajte si viac odpočinku",
      "Jemné cvičenie ako jóga", 
      "Teplé nápoje a výživná strava",
      "Počúvajte svoje telo"
    ],
    energy: "Nižšia energia",
    mood: "Introspektívna nálada"
  },
  follicular: {
    title: "Rastúca energia",
    description: "Hormóny sa zvyšujú, cítite sa čoraz lepšie.",
    recommendations: [
      "Ideálny čas na nové projekty",
      "Kardio cvičenie",
      "Sociálne aktivity",
      "Plánovanie a ciele"
    ],
    energy: "Rastúca energia",
    mood: "Optimistická nálada"
  },
  ovulation: {
    title: "Vrchol cyklu",
    description: "Najvyššia energia a sebavedomie.",
    recommendations: [
      "Náročné cvičenie",
      "Dôležité stretnutia",
      "Kreatívne projekty",
      "Komunikácia s ostatnými"
    ],
    energy: "Maximálna energia",
    mood: "Sebavedomá nálada"
  },
  luteal: {
    title: "Príprava na odpočinok",
    description: "Energia postupne klesá, telo sa pripravuje na menštruáciu.",
    recommendations: [
      "Dokončovanie úloh",
      "Miernejšie cvičenie", 
      "Zdravé jedlo",
      "Príprava na menštruáciu"
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