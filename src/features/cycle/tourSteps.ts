import { Step } from 'react-joyride';

// Overview tour - introduces the main sections
export const getOverviewTourSteps = (): Step[] => [
  {
    target: '[data-tour="welcome"]',
    content: 'Vitaj v Periodke! Ukážeme ti hlavné časti aplikácie. 💗',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="estimate-section"]',
    content: '1️⃣ Odhad na dnes - Aktuálny deň cyklu, fáza, príznaky a poznámky. 📅',
    placement: 'auto',
  },
  {
    target: '[data-tour="feel-better-section"]',
    content: '2️⃣ Ako sa cítiť lepšie - AI tipy pre tvoju fázu cyklu. 💡',
    placement: 'auto',
  },
  {
    target: '[data-tour="calendar-section"]',
    content: '3️⃣ Kalendár - História cyklu s možnosťou úprav. 📆',
    placement: 'auto',
  },
  {
    target: '[data-tour="calendar-actions"]',
    content: '4️⃣ Tu môžeš zmeniť dátum menštruácie, nastavenia a zdieľať kalendár. ⚙️',
    placement: 'auto',
  },
  {
    target: 'body',
    content: 'Pokračovať v detailnom návode? Klikni "Ďalej" alebo "Preskočiť" pre okamžité použitie. 🚀',
    placement: 'center',
  },
];

// Detailed tour for "Odhad na dnes"
export const getEstimateDetailedTour = (): Step[] => [
  {
    target: '[data-tour="estimate-section"]',
    content: 'Pozrime sa bližšie na "Odhad na dnes". 📱',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '[data-tour="current-phase"]',
    content: 'Deň cyklu a aktuálna fáza. Každá fáza má iné charakteristiky. 📅',
    placement: 'bottom',
  },
  {
    target: '[data-tour="wellness-chart"]',
    content: 'Graf cyklu - každý bod je deň. Ružová = menštruácia, zelená = plodné dni. 🔄',
    placement: 'bottom',
  },
  {
    target: '[data-tour="symptom-tracker"]',
    content: 'Príznaky v prehľadných boxoch. Klikni na tie, čo pociťuješ - spoznáš vzorce! 🏷️',
    placement: 'bottom',
  },
  {
    target: '[data-tour="custom-symptom"]',
    content: 'Pridaj vlastný príznak - zadaj názov a stlač Enter. 💫',
    placement: 'bottom',
  },
  {
    target: '[data-tour="notes"]',
    content: 'Súkromné poznámky - ako sa cítiš, čo ťa trápi či teší. Zostáva medzi tebou a aplikáciou. 📝',
    placement: 'bottom',
  },
];

// Detailed tour for "Ako sa cítiť lepšie"
export const getFeelBetterDetailedTour = (): Step[] => [
  {
    target: '[data-tour="feel-better-section"]',
    content: 'Pozrime sa na "Ako sa cítiť lepšie". 🌸',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '[data-tour="feel-better-content"]',
    content: 'AI-generované tipy prispôsobené presne tvojej fáze a dňu cyklu. 💪',
    placement: 'bottom',
  },
  {
    target: '[data-tour="phase-tips"]',
    content: 'Tipy pokrývajú energiu, náladu, výživu, aktivitu a starostlivosť. Pre lepší pocit počas celého cyklu! ✨',
    placement: 'bottom',
  },
];

// Detailed tour for "Kalendárny prehľad"
export const getCalendarDetailedTour = (): Step[] => [
  {
    target: '[data-tour="calendar-section"]',
    content: 'Pozrime sa na "Kalendárny prehľad". 📆',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: '[data-tour="calendar-view"]',
    content: 'História cyklu - ružové dni = menštruácia, zelené = plodné dni. Dni s perom 🖊️ majú poznámky. Klikni na deň pre detail! 📅',
    placement: 'bottom',
  },
  {
    target: '[data-tour="calendar-actions"]',
    content: 'Zmeň dátum menštruácie, dĺžku cyklu alebo zdieľaj kalendár. ⚙️',
    placement: 'auto',
  },
];

// Completion message
export const getTourCompletionStep = (): Step[] => [
  {
    target: 'body',
    content: 'Výborne! Teraz vieš všetko o Periodke. Môžeš kedykoľvek spustiť návod znova kliknutím na ikonu "?" v záhlaví. Držíme ti palce! 💗',
    placement: 'center',
    disableBeacon: true,
  },
];
