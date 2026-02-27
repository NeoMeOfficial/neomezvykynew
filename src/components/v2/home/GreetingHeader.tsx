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
  const { profile } = useAuthContext();
  
  // Extract first name from full name or profile data
  const firstName = profile?.first_name || 
    (profile?.full_name ? profile.full_name.split(' ')[0] : 'tam');
  
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
