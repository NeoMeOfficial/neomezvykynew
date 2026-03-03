// Partner Discount System
// Users unlock discounts by reaching certain community point levels

export interface PartnerDiscount {
  id: string;
  partner: string;
  logo?: string;
  discount: string;
  description: string;
  code?: string;
  link?: string;
  category: 'fitness' | 'wellness' | 'nutrition' | 'fashion' | 'tech';
  requiredLevel: number;
  requiredPoints: number;
}

export const partnerDiscounts: PartnerDiscount[] = [
  // Level 1 (250+ points)
  {
    id: 'gymbeam-protein',
    partner: 'GymBeam',
    discount: '15% zľava',
    description: 'Na všetky proteíny a doplnky stravy',
    code: 'NEOME15',
    link: 'https://gymbeam.sk',
    category: 'nutrition',
    requiredLevel: 1,
    requiredPoints: 250
  },
  {
    id: 'decathlon-yoga',
    partner: 'Decathlon',
    discount: '10% zľava',
    description: 'Na yoga podložky a fitness vybavenie',
    code: 'NEOME10',
    link: 'https://decathlon.sk',
    category: 'fitness',
    requiredLevel: 1,
    requiredPoints: 250
  },

  // Level 2 (500+ points)
  {
    id: 'zalando-sport',
    partner: 'Zalando',
    discount: '20% zľava',
    description: 'Na športové oblečenie pre ženy',
    code: 'NEOME20',
    link: 'https://zalando.sk',
    category: 'fashion',
    requiredLevel: 2,
    requiredPoints: 500
  },
  {
    id: 'fitbit-tracker',
    partner: 'Fitbit',
    discount: '25% zľava',
    description: 'Na fitness trackery a smart hodinky',
    code: 'NEOMEFIT25',
    link: 'https://fitbit.com',
    category: 'tech',
    requiredLevel: 2,
    requiredPoints: 500
  },

  // Level 3 (750+ points)
  {
    id: 'welness-spa',
    partner: 'Wellness SPA',
    discount: '30% zľava',
    description: 'Na relaxačné a wellness pobyty',
    code: 'NEOME30',
    link: 'https://wellness-spa.sk',
    category: 'wellness',
    requiredLevel: 3,
    requiredPoints: 750
  },
  {
    id: 'myprotein-premium',
    partner: 'MyProtein',
    discount: '35% zľava',
    description: 'Na celý sortiment + doprava zdarma',
    code: 'NEOME35',
    link: 'https://myprotein.sk',
    category: 'nutrition',
    requiredLevel: 3,
    requiredPoints: 750
  },

  // Level 4 (1000+ points)
  {
    id: 'premium-coaching',
    partner: 'Personal Training',
    discount: '40% zľava',
    description: 'Na online personal tréning s certifikovanými trénermi',
    code: 'NEOME40',
    category: 'fitness',
    requiredLevel: 4,
    requiredPoints: 1000
  },
  {
    id: 'nutrition-consult',
    partner: 'Nutričné poradenstvo',
    discount: '50% zľava',
    description: 'Na konzultáciu s certifikovaným nutričným terapeutom',
    code: 'NEOME50',
    category: 'wellness',
    requiredLevel: 4,
    requiredPoints: 1000
  }
];

export const getCategoryIcon = (category: string): string => {
  const icons = {
    fitness: 'Dumbbell',
    wellness: 'Heart', 
    nutrition: 'Leaf',
    fashion: 'Shirt',
    tech: 'Watch'
  };
  return icons[category as keyof typeof icons] || 'Gift';
};

export const getCategoryColor = (category: string): string => {
  const colors = {
    fitness: '#6B4C3B', // Telo brown
    wellness: '#A8848B', // Myseľ muted pink
    nutrition: '#7A9E78', // Strava green
    fashion: '#C27A6E', // Periodka coral
    tech: '#B8864A'    // Accent warm brown
  };
  return colors[category as keyof typeof colors] || '#6B4C3B';
};

// Helper to get available discounts for user level
export const getAvailableDiscounts = (userPoints: number): PartnerDiscount[] => {
  return partnerDiscounts.filter(discount => userPoints >= discount.requiredPoints);
};

// Helper to get next locked discount
export const getNextDiscount = (userPoints: number): PartnerDiscount | null => {
  const locked = partnerDiscounts.filter(discount => userPoints < discount.requiredPoints);
  return locked.sort((a, b) => a.requiredPoints - b.requiredPoints)[0] || null;
};