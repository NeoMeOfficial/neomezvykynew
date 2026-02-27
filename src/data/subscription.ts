import { SubscriptionPlan, SubscriptionFeature, Testimonial, FAQ } from '../types/subscription';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Mesačné predplatné',
    description: 'Mesačný prístup k všetkým funkciám',
    price_monthly: 14.90,
    currency: 'EUR',
    trial_days: 7,
    features: [
      'Všetky cvičebné programy',
      'Personalizované jedálne plány', 
      'Sledovanie menštruačného cyklu',
      'Meditácie a mindfulness',
      'Prístup do komunity',
      'Nákupné zoznamy receptov'
    ]
  },
  {
    id: 'yearly',
    name: 'Ročné predplatné',
    description: 'Ušetri 20% s ročným predplatným',
    price_monthly: 11.92, // €143/year ÷ 12 months
    price_yearly: 143,
    currency: 'EUR',
    popular: true,
    trial_days: 14,
    features: [
      'Všetky cvičebné programy',
      'Personalizované jedálne plány',
      'Sledovanie menštruačného cyklu', 
      'Meditácie a mindfulness',
      'Prístup do komunity',
      'Nákupné zoznamy receptov',
      'Prioritná podpora',
      'Exkluzívny obsah'
    ]
  }
];

export const SUBSCRIPTION_FEATURES: SubscriptionFeature[] = [
  {
    id: 'programs',
    category: 'programs',
    title: 'Cvičebné programy',
    description: 'Špeciálne navrhnuté pre ženy v rôznych životných fázach',
    icon: '💪',
    benefits: [
      'Postpartum - bezpečné cvičenie po pôrode',
      'Body Forming - tvarovanie postavy', 
      'Strong & Sexy - silový tréning',
      'Elastic Bands - cvičenie s gumami'
    ],
    included_in: ['monthly', 'yearly']
  },
  {
    id: 'nutrition',
    category: 'nutrition', 
    title: 'Jedálne plány',
    description: 'Personalizované jedálničky prispôsobené tvojim potrebám',
    icon: '🥗',
    benefits: [
      '108 ručne vybraných receptov',
      'Označenie 15 najčastejších alergénov',
      'Vyvážené makronutrienty',
      'Automatické nákupné zoznamy'
    ],
    included_in: ['monthly', 'yearly']
  },
  {
    id: 'tracking',
    category: 'tracking',
    title: 'Sledovanie cyklu',
    description: 'Porozumej svojmu telu a cyklu',
    icon: '📅',
    benefits: [
      'Predikcia menštruácie',
      'Sledovanie príznakov',
      'Analýza pravidelnosti',
      'Prispôsobené odporúčania'
    ],
    included_in: ['monthly', 'yearly']
  },
  {
    id: 'wellness',
    category: 'wellness',
    title: 'Meditácie',
    description: 'Vnútorný pokoj a sebaláska',
    icon: '🧘‍♀️',
    benefits: [
      'Riadené meditácie',
      'Dychové cvičenia',
      'Mindfulness techniky',
      'Stres management'
    ],
    included_in: ['monthly', 'yearly']
  },
  {
    id: 'community',
    category: 'community',
    title: 'Komunita',
    description: 'Spojenie s tisíckami žien',
    icon: '👥',
    benefits: [
      'Súkromná Facebook skupina',
      'Týždňové výzvy',
      'Zdieľanie pokrokov',
      'Motivácia a podpora'
    ],
    included_in: ['monthly', 'yearly']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Martina K.',
    text: 'NeoMe mi úplne zmenil život. Po dvoch rokoch som konečne našla program, ktorý funguje. Postpartum cvičenia sú bezpečné a efektívne.',
    rating: 5,
    verified: true,
    program: 'Postpartum'
  },
  {
    id: '2', 
    name: 'Petra S.',
    text: 'Jedálne plány sú úžasné! Konečne viem čo variť a recepty chutia celej rodine. Ušetrím 3 hodiny týždenne.',
    rating: 5,
    verified: true,
    program: 'Meal Planning'
  },
  {
    id: '3',
    name: 'Jana M.',
    text: 'Sledovanie cyklu mi pomohlo pochopiť moje telo. Viem predpovedať nálady a prispôsobiť tomu cvičenie.',
    rating: 5,
    verified: true,
    program: 'Period Tracking'
  },
  {
    id: '4',
    name: 'Zuzana P.',
    text: 'Body Forming program je perfektný. Za 3 mesiace vidím obrovské zmeny. Cvičenia sú zábavné a motivujúce.',
    rating: 5,
    verified: true,
    program: 'Body Forming'
  },
  {
    id: '5',
    name: 'Lucia T.',
    text: 'Meditácie mi pomohli s úzkosťou. Teraz mám lepší spánok a viac energie. Odporúčam každej mame!',
    rating: 5,
    verified: true,
    program: 'Meditation'
  },
  {
    id: '6',
    name: 'Eva R.',
    text: 'Komunita je úžasná! Našla som si skupinu žien, ktoré ma motivujú. Spoločne sme stratili už 150 kg!',
    rating: 5,
    verified: true,
    program: 'Community'
  }
];

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'Môžem vyskúšať NeoMe zadarmo?',
    answer: 'Áno! Ponúkame 7-dňovú bezplatnú skúšku pre mesačné predplatné a 14-dňovú pre ročné. Môžeš kedykoľvek zrušiť bez poplatkov.',
    category: 'pricing',
    order: 1
  },
  {
    id: '2',
    question: 'Čo obsahuje predplatné?',
    answer: 'Získaš prístup k všetkým cvičebným programom, personalizovaným jedálnym plánom, sledovaniu cyklu, meditáciám a súkromnej komunite.',
    category: 'features',
    order: 2
  },
  {
    id: '3',
    question: 'Sú cvičenia vhodné pre začiatočníčky?',
    answer: 'Určite! Všetky programy majú modifikácie pre rôzne úrovne. Postpartum program je špeciálne navrhnutý ako bezpečný úvod do cvičenia.',
    category: 'features',
    order: 3
  },
  {
    id: '4',
    question: 'Ako fungujú jedálne plány?',
    answer: 'Zadáš svoje preferencie, alergie a počet jedál. Systém ti vytvorí personalizovaný jedálniček s nákupnými zoznamami a receptami.',
    category: 'features',
    order: 4
  },
  {
    id: '5',
    question: 'Môžem zrušiť kedykoľvek?',
    answer: 'Áno, predplatné môžeš zrušiť kedykoľvek bez viazanosti. Po zrušení máš prístup do konca plateného obdobia.',
    category: 'pricing',
    order: 5
  },
  {
    id: '6',
    question: 'Potrebujem špeciálne vybavenie?',
    answer: 'Väčšina cvičení nevyžaduje žiadne vybavenie. Pre niektoré programy odporúčame elastické gumy alebo pilates loptu.',
    category: 'features',
    order: 6
  },
  {
    id: '7',
    question: 'Je aplikácia v slovenčine?',
    answer: 'Áno, celá aplikácia je lokalizovaná do slovenčiny. Všetky recepty, cvičenia a obsah sú v našom jazyku.',
    category: 'technical',
    order: 7
  },
  {
    id: '8',
    question: 'Ako dlho trvajú cvičenia?',
    answer: 'Cvičenia trvajú 15-45 minút v závislosti od programu. Môžeš si vybrať podľa času, ktorý máš k dispozícii.',
    category: 'features',
    order: 8
  },
  {
    id: '9',
    question: 'Môžem používať aplikáciu offline?',
    answer: 'Aplikácia funguje online, ale môžeš si stiahnuť recepty a cvičenia na neskôr. Pracujeme na offline režime.',
    category: 'technical',
    order: 9
  },
  {
    id: '10',
    question: 'Máte zákaznícku podporu?',
    answer: 'Áno, naš tím je k dispozícii cez email a chat. Ročné predplatné má prioritnú podporu s rýchlejšou odozvou.',
    category: 'support',
    order: 10
  }
];

export const FEATURE_COMPARISON = {
  free: {
    name: 'Bezplatný obsah',
    features: [
      'Základné recepty',
      'Komunita (čítanie)',
      'Sledovanie hmotnosti'
    ]
  },
  premium: {
    name: 'Premium predplatné', 
    features: [
      'Všetky cvičebné programy',
      'Personalizované jedálne plány',
      'Sledovanie menštruačného cyklu',
      'Všetky meditácie',
      'Aktívna účasť v komunite',
      'Prioritná podpora',
      'Nové funkcie ako prvá'
    ]
  }
};

export const PRICING_HIGHLIGHTS = [
  'Menej ako 1 káva denne',
  '20% zľava pri ročnom predplatnom',
  'Zrušiteľné kedykoľvek',
  '30-dňová garancia vrátenia peňazí'
];