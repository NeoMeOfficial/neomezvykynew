import { Step } from 'react-joyride';

// Overview tour - introduces the main navigation
export const getOverviewTourSteps = (): Step[] => [
  {
    target: '[data-tour="welcome"]',
    content: 'Vitaj v Periodke! Ukážeme ti hlavné časti aplikácie a ako ich používať. 💗',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="sidebar"]',
    content: 'Tu nájdeš hlavné sekcie aplikácie. Každá sekcia ti ponúka iné funkcie pre sledovanie tvojho cyklu. 📋',
    placement: 'right',
  },
  {
    target: '[data-tour="estimate-section"]',
    content: 'Odhad na dnes - tu vidíš prehľad aktuálneho dňa cyklu, fázy a môžeš zaznamenávať príznaky. 📅',
    placement: 'right',
  },
  {
    target: '[data-tour="feel-better-section"]',
    content: 'Ako sa cítiť lepšie - tipy a odporúčania pre každú fázu tvojho cyklu. 💡',
    placement: 'right',
  },
  {
    target: '[data-tour="calendar-section"]',
    content: 'Kalendárny prehľad - kompletná história tvojho cyklu s možnosťou upravovať príznaky pre jednotlivé dni. 📆',
    placement: 'right',
  },
];

// Section-specific tour for "Odhad na dnes"
export const getEstimateTourSteps = (): Step[] => [
  {
    target: '[data-tour="current-phase"]',
    content: 'Tu vidíš, v ktorom dni cyklu sa nachádzaš a v akej fáze. Fáza ovplyvňuje tvoje fyzické i emocionálne pocity. 📅',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="wellness-chart"]',
    content: 'Tento graf zobrazuje tvoj celý cyklus. Každý bod predstavuje jeden deň. Graf predpovedá tvoju nasledujúcu periódu a plodné dni. 🔄',
    placement: 'bottom',
  },
  {
    target: '[data-tour="symptom-tracker"]',
    content: 'Tu môžeš zaznamenať príznaky, ktoré práve pociťuješ. Klikni na príznaky, ktoré zažívaš - pomôže ti to lepšie porozumieť svojmu telu! 🏷️',
    placement: 'top',
  },
  {
    target: '[data-tour="custom-symptom"]',
    content: 'Môžeš pridať aj vlastné príznaky! Klikni sem, zadaj vlastný príznak a stlač Enter. Bude uložený pre budúce použitie. ➕',
    placement: 'top',
  },
  {
    target: '[data-tour="notes"]',
    content: 'Sem si môžeš zapísať súkromné poznámky o tom, ako sa cítiš, čo ťa trápi, alebo čo ťa teší. Tieto poznámky sú len pre teba. 📝',
    placement: 'top',
  },
];

// Section-specific tour for "Ako sa cítiť lepšie"
export const getFeelBetterTourSteps = (): Step[] => [
  {
    target: '[data-tour="feel-better-content"]',
    content: 'Táto sekcia ti poskytuje personalizované tipy a rady na základe fázy cyklu, v ktorej sa práve nachádzaš. 🌸',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="phase-tips"]',
    content: 'Každá fáza cyklu má svoje špecifické odporúčania týkajúce sa stravy, cvičenia a starostlivosti o seba. 💪',
    placement: 'bottom',
  },
];

// Section-specific tour for "Kalendárny prehľad"
export const getCalendarTourSteps = (): Step[] => [
  {
    target: '[data-tour="calendar-view"]',
    content: 'V kalendárnom prehľade vidíš históriu celého cyklu. Klikni na ktorýkoľvek deň pre zobrazenie detailov a zadanie prízakov pre ten deň. 📆',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '[data-tour="calendar-actions"]',
    content: 'Tu môžeš upraviť dátum menštruácie, zmeniť nastavenia alebo zdieľať svoj kalendár. ⚙️',
    placement: 'right',
  },
];
