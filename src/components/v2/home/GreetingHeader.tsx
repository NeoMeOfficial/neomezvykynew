import { Bell } from 'lucide-react';
import { colors, glassButton } from '../../../theme/warmDusk';
import { useAuthContext } from '../../../contexts/AuthContext';

function getGreeting(firstName: string = 'tam'): string {
  const h = new Date().getHours();
  if (h < 6) return `Sladké sny, ${firstName}`;
  if (h < 12) return `Krásne ráno, ${firstName}`;
  if (h < 17) return `Ahoj ${firstName}`;
  if (h < 21) return `Krásny večer, ${firstName}`;
  return `Sladké sny, ${firstName}`;
}

const dailyMessages = [
  "Dnes nemusíš všetko – stačí malý krok pre seba",
  "Aj pár minút pre tvoje telo sa počíta",
  "Tvoje telo si zaslúži starostlivosť, nie tlak",
  "Nie dokonalosť. Len návrat k sebe",
  "Dnes budujeme silu, nie výčitky",
  "Každý vedomý pohyb je investícia do tvojej energie",
  "Robíš pre seba viac, než si myslíš",
  "Začni tam, kde práve si – presne to stačí",
  "Toto je tvoja chvíľa pre seba",
  "Silné telo vzniká z malých každodenných rozhodnutí",
  "Aj medzi všetkým ostatným je tu chvíľa pre teba",
  "Nemusíš mať čas navyše – toto je ten tvoj",
  "Starostlivosť o seba je súčasť starostlivosti o rodinu",
];

function getSubline(): string {
  return dailyMessages[new Date().getDate() % dailyMessages.length];
}

export default function GreetingHeader() {
  const { profile, user } = useAuthContext();
  
  // Enhanced name extraction with multiple fallbacks
  const getFirstName = (): string => {
    // For development/demo - check if there's a demo name in localStorage
    const demoName = localStorage.getItem('demo_user_name');
    if (demoName && demoName.trim()) {
      return demoName.trim();
    }
    
    // Try profile.full_name first
    if (profile?.full_name && profile.full_name.trim()) {
      return profile.full_name.trim().split(' ')[0];
    }
    
    // Try user.user_metadata.full_name
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.trim().split(' ')[0];
    }
    
    // Try email prefix as last resort (before 'tam')
    if (profile?.email || user?.email) {
      const email = profile?.email || user?.email;
      const emailPrefix = email?.split('@')[0];
      if (emailPrefix && emailPrefix.length > 0) {
        // Capitalize first letter and remove numbers/dots
        const cleanName = emailPrefix.replace(/[0-9\.]/g, '');
        if (cleanName.length > 0) {
          return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        }
      }
    }
    
    // Development fallback - use a sample name instead of 'tam'
    return process.env.NODE_ENV === 'development' ? 'Gabika' : 'tam';
  };
  
  const firstName = getFirstName();
  const greetingText = getGreeting(firstName);
  
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {greetingText}
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: colors.textSecondary }}>
          {getSubline()}
        </p>
      </div>
      <button
        className="w-10 h-10 flex items-center justify-center transition-all active:scale-95"
        style={glassButton}
      >
        <Bell size={18} style={{ color: colors.textSecondary }} />
      </button>
    </div>
  );
}
