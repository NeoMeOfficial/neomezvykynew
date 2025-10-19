import { Step } from 'react-joyride';

export const getTourSteps = (): Step[] => [
  {
    target: '[data-tour="welcome"]',
    content: 'Vitaj v Periodke! Ukážeme ti, ako sledovať svoj menštruačný cyklus a porozumieť svojmu telu. 💗',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="current-phase"]',
    content: 'Tu vidíš, v ktorom dni cyklu sa nachádzaš a v akej fáze. Fáza ovplyvňuje tvoje fyzické i emocionálne pocity. 📅',
    placement: 'bottom',
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
  {
    target: '[data-tour="calendar-view"]',
    content: 'V kalendárnom prehľade vidíš históriu celého cyklu. Klikni na ktorýkoľvek deň pre zobrazenie detailov a zadanie prízakov pre ten deň. 📆',
    placement: 'top',
  },
  {
    target: '[data-tour="settings"]',
    content: 'Tu môžeš upraviť nastavenia svojho cyklu - zmeniť dátum poslednej periódy alebo upraviť dĺžku cyklu. ⚙️',
    placement: 'bottom',
  },
];
