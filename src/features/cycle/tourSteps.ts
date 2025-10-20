import { Step } from 'react-joyride';

// Overview tour - introduces the main sections
export const getOverviewTourSteps = (): Step[] => [
  {
    target: '[data-tour="welcome"]',
    content: 'Vitaj v Periodke! Spoznaj cyklus, predvídaj zmeny a cíť sa lepšie. 💗',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="estimate-section"]',
    content: '1️⃣ Odhad na dnes - Zisti, v ktorej fáze si a čo môžeš očakávať. 📅',
    placement: 'auto',
  },
  {
    target: '[data-tour="feel-better-section"]',
    content: '2️⃣ Ako sa cítiť lepšie - Praktické tipy pre tvoju aktuálnu fázu. 💡',
    placement: 'auto',
  },
  {
    target: '[data-tour="calendar-section"]',
    content: '3️⃣ Kalendár - Sleduj históriu a plánuj dopredu. 📆',
    placement: 'auto',
  },
  {
    target: '[data-tour="calendar-actions"]',
    content: '4️⃣ Nastav dátum menštruácie a zdieľaj kalendár s blízkymi. ⚙️',
    placement: 'auto',
  },
  {
    target: 'body',
    content: 'Chceš sa dozvedieť viac? Klikni "Ďalej" alebo "Preskočiť" a začni hneď. 🚀',
    placement: 'center',
  },
];

// Detailed tour for "Odhad na dnes"
export const getEstimateDetailedTour = (): Step[] => [
  {
    target: '[data-tour="estimate-section"]',
    content: 'Pochop, kde sa nachádzaš a čo môžeš čakať. 📱',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '[data-tour="current-phase"]',
    content: 'Každá fáza ovplyvňuje tvoju energiu, náladu a telo. Vedieť, kde si, pomáha. 📅',
    placement: 'bottom',
  },
  {
    target: '[data-tour="wellness-chart"]',
    content: 'Vizualizácia cyklu - ľahko vidíš, čo ťa čaká. Ružová = menštruácia, zelená = plodné dni. 🔄',
    placement: 'bottom',
  },
  {
    target: '[data-tour="symptom-tracker"]',
    content: 'Zaznamenávaj príznaky pravidelne - odhalíš vzorce a lepšie pochopíš svoje telo. 🏷️',
    placement: 'bottom',
  },
  {
    target: '[data-tour="custom-symptom"]',
    content: 'Tvoje telo je jedinečné - pridaj vlastné príznaky pre kompletný obraz. ➕',
    placement: 'bottom',
  },
  {
    target: '[data-tour="notes"]',
    content: 'Poznámky ti pomôžu spätne vidieť súvislosti medzi náladou, diétou a fázou cyklu. 📝',
    placement: 'bottom',
  },
];

// Detailed tour for "Ako sa cítiť lepšie"
export const getFeelBetterDetailedTour = (): Step[] => [
  {
    target: '[data-tour="feel-better-section"]',
    content: 'Prispôsob životný štýl svojmu cyklu. 🌸',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '[data-tour="feel-better-content"]',
    content: 'Tipy sú prispôsobené presne tvojej aktuálnej fáze - vieš, čo telu práve prospieva. 💪',
    placement: 'bottom',
  },
  {
    target: '[data-tour="phase-tips"]',
    content: 'Od výživy cez cvičenie po odpočinok - malé zmeny môžu výrazne zlepšiť tvoj pocit. ✨',
    placement: 'bottom',
  },
];

// Detailed tour for "Kalendárny prehľad"
export const getCalendarDetailedTour = (): Step[] => [
  {
    target: '[data-tour="calendar-section"]',
    content: 'História aj budúcnosť na jednom mieste. 📆',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '[data-tour="calendar-view"]',
    content: 'Plánuj dopredu - vedieť, čo ťa čaká, ti dáva kontrolu nad životom. Pero 🖊️ = máš poznámku. 📅',
    placement: 'bottom',
  },
  {
    target: '[data-tour="calendar-actions"]',
    content: 'Uprav nastavenia alebo zdieľaj kalendár s partnerom či lekárom. ⚙️',
    placement: 'auto',
  },
];

// Completion message
export const getTourCompletionStep = (): Step[] => [
  {
    target: 'body',
    content: 'Hotovo! Teraz vieš, ako Periodka pomôže ti lepšie rozumieť svojmu telu. Návod spustíš znova cez ikonu "?". 💗',
    placement: 'center',
    disableBeacon: true,
  },
];
