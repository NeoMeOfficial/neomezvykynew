import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

interface UserProgram {
  id: string;
  name: string;
  week: number;
  day: number;
  totalWeeks: number;
  todaysExercise?: {
    title: string;
    videoUrl: string;
    duration: string;
    thumbnail: string;
  };
}

interface PromotionalOffer {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountValue: number; // percentage
  bannerText: string;
  active: boolean;
}

export function useUserProgram() {
  const { user } = useAuthContext();
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserProgram(null);
      setLoading(false);
      return;
    }

    // Mock data - in real app this would come from database
    // For now, randomly determine if user has a program
    const hasProgram = Math.random() > 0.5; // 50% chance for testing
    
    if (hasProgram) {
      setUserProgram({
        id: 'bodyforming-1',
        name: 'BodyForming',
        week: 2,
        day: 3,
        totalWeeks: 8,
        todaysExercise: {
          title: 'Silový tréning horná časť',
          videoUrl: 'https://example.com/exercise-video',
          duration: '35:00',
          thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=340&fit=crop',
        },
      });
    } else {
      setUserProgram(null);
    }
    
    setLoading(false);
  }, [user]);

  return {
    userProgram,
    hasProgram: !!userProgram,
    loading,
  };
}

export function usePromotionalOffers() {
  const [offers, setOffers] = useState<PromotionalOffer[]>([]);
  
  useEffect(() => {
    // Mock promotional offers - in real app this would be admin-managed
    setOffers([
      {
        id: 'summer-sale',
        title: 'Letná akcia',
        description: 'Zľava na všetky programy',
        discountCode: 'LETO2026',
        discountValue: 30,
        bannerText: 'Získaj 30% zľavu na programy s kódom LETO2026',
        active: true,
      },
    ]);
  }, []);

  const activeOffer = offers.find(offer => offer.active);

  return {
    activeOffer,
    offers,
  };
}

export function useLoginCounter() {
  const [loginCount, setLoginCount] = useState(0);
  
  useEffect(() => {
    // Get current login count from localStorage
    const currentCount = parseInt(localStorage.getItem('neome-login-count') || '0', 10);
    const newCount = currentCount + 1;
    
    setLoginCount(newCount);
    localStorage.setItem('neome-login-count', newCount.toString());
  }, []);

  const shouldShowBanner = (frequency: number = 3): boolean => {
    return loginCount % frequency === 0;
  };

  return {
    loginCount,
    shouldShowBanner,
  };
}