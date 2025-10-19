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
    content: '1️⃣ Odhad na dnes - Tu vidíš aktuálny deň cyklu, fázu a môžeš zaznamenávať príznaky a poznámky. 📅',
    placement: 'right',
  },
  {
    target: '[data-tour="feel-better-section"]',
    content: '2️⃣ Ako sa cítiť lepšie - Personalizované tipy a rady pre každú fázu tvojho cyklu. 💡',
    placement: 'right',
  },
  {
    target: '[data-tour="calendar-section"]',
    content: '3️⃣ Kalendárny prehľad - Kompletná história tvojho cyklu s možnosťou upravovať jednotlivé dni. 📆',
    placement: 'right',
  },
  {
    target: '[data-tour="calendar-actions"]',
    content: '4️⃣ Tu môžeš zmeniť dátum menštruácie, upraviť nastavenia alebo zdieľať kalendár. ⚙️',
    placement: 'right',
  },
  {
    target: 'body',
    content: 'Chceš pokračovať a dozvedieť sa viac o jednotlivých sekciách? Klikni "Ďalej" pre detailný návod, alebo "Preskočiť" ak chceš začať používať aplikáciu. 🚀',
    placement: 'center',
  },
];

// Detailed tour for "Odhad na dnes"
export const getEstimateDetailedTour = (): Step[] => [
  {
    target: '[data-tour="estimate-section"]',
    content: 'Pozrime sa bližšie na sekciu "Odhad na dnes". Ukážeme ti všetky funkcie! 📱',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="current-phase"]',
    content: 'Tu vidíš, v ktorom dni cyklu sa nachádzaš a v akej fáze. Každá fáza má iné charakteristiky a ovplyvňuje tvoje pocity. 📅',
    placement: 'bottom',
  },
  {
    target: '[data-tour="wellness-chart"]',
    content: 'Graf zobrazuje celý tvoj cyklus. Každý bod je jeden deň. Ružová oblasť je menštruácia, zelená sú plodné dni. 🔄',
    placement: 'bottom',
  },
  {
    target: '[data-tour="symptom-tracker"]',
    content: 'Tu zaznamenávaš príznaky. Klikni na tie, ktoré práve pociťuješ - pomôže ti to spoznať vzorce v tvojom cykle! 🏷️',
    placement: 'top',
  },
  {
    target: '[data-tour="custom-symptom"]',
    content: 'Môžeš pridať vlastné príznaky! Klikni sem, zadaj názov príznaku a stlač Enter. Príznak sa uloží pre budúce použitie. ➕',
    placement: 'top',
  },
  {
    target: '[data-tour="notes"]',
    content: 'Sem si môžeš zapísať súkromné poznámky - ako sa cítiš, čo ťa trápi, alebo naopak teší. Všetko zostáva len medzi tebou a aplikáciou. 📝',
    placement: 'top',
  },
];

// Detailed tour for "Ako sa cítiť lepšie"
export const getFeelBetterDetailedTour = (): Step[] => [
  {
    target: '[data-tour="feel-better-section"]',
    content: 'Teraz sa pozrieme na sekciu "Ako sa cítiť lepšie". 🌸',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="feel-better-content"]',
    content: 'Táto sekcia ti poskytuje personalizované rady na základe fázy cyklu, v ktorej sa práve nachádzaš. 💪',
    placement: 'bottom',
  },
  {
    target: '[data-tour="phase-tips"]',
    content: 'Pre každú fázu nájdeš tipy týkajúce sa stravy, cvičenia, odpočinku a celkovej pohody. Využi ich pre lepší pocit počas celého cyklu! ✨',
    placement: 'bottom',
  },
];

// Detailed tour for "Kalendárny prehľad"
export const getCalendarDetailedTour = (): Step[] => [
  {
    target: '[data-tour="calendar-section"]',
    content: 'Poďme sa pozrieť na "Kalendárny prehľad". 📆',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '[data-tour="calendar-view"]',
    content: 'V kalendári vidíš históriu celého cyklu. Ružové dni sú menštruácia, zelené plodné dni. Klikni na ktorýkoľvek deň pre detaily! 📅',
    placement: 'top',
  },
  {
    target: '[data-tour="calendar-actions"]',
    content: 'Tu môžeš zmeniť dátum poslednej menštruácie, upraviť dĺžku cyklu alebo zdieľať kalendár s niekým blízkym. ⚙️',
    placement: 'right',
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
