import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footprints, Droplets, Dumbbell, Heart, CalendarDays, UtensilsCrossed, MessageCircle, Database } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

const screens = [
  {
    title: 'Sleduj svoje návyky',
    desc: 'Kroky, voda, cvičenie — všetko na jednom mieste. Nastav si denné ciele a sleduj svoj pokrok.',
    badge: 'Zadarmo',
    icons: [Footprints, Droplets, Dumbbell],
    gradient: 'from-[#D0BCA8] to-[#D4B8A0]',
  },
  {
    title: 'Denné zamyslenia',
    desc: 'Každý deň si nájdi chvíľku na vďačnosť a reflexiu. Tvoj osobný denník pohody.',
    badge: 'Zadarmo',
    icons: [Heart],
    gradient: 'from-[#D5C8E0] to-[#C8B8D4]',
  },
  {
    title: 'Periodka',
    desc: 'Sleduj svoj cyklus, príznaky a nálady. Pochop svoje telo lepšie.',
    badge: 'Zadarmo',
    icons: [CalendarDays],
    gradient: 'from-[#F2C6C2] to-[#E8A0A0]',
  },
  {
    title: 'A ešte viac s predplatným',
    desc: 'Programy, personalizovaný jedálniček, ukladanie dát a správy od Gabi.',
    icons: [Dumbbell, UtensilsCrossed, Database, MessageCircle],
    gradient: 'from-[#B8864A] to-[#6B4C3B]',
    isCTA: true,
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = screens[step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-lufga px-6" style={{ background: colors.bgGradient }}>
      {/* Illustration area */}
      <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${current.gradient} flex items-center justify-center gap-3 mb-10`}>
        {current.icons.map((Icon, i) => (
          <Icon key={i} className="w-8 h-8 text-white/90" strokeWidth={1.5} />
        ))}
      </div>

      {/* Title */}
      <h1 className="text-xl font-semibold text-[#2E2218] text-center">{current.title}</h1>
      <p className="text-sm text-[#8B7560] text-center mt-3 max-w-xs leading-relaxed">{current.desc}</p>

      {/* Badge */}
      {current.badge && (
        <span className="mt-4 text-xs font-medium bg-[#6B9E6B]/15 text-[#6B9E6B] px-3 py-1 rounded-full">
          {current.badge}
        </span>
      )}

      {/* CTA for last screen */}
      {current.isCTA && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => navigate('/domov')}
            className="rounded-full bg-[#6B4C3B] text-white px-10 py-3.5 text-sm font-medium active:scale-95 transition-transform"
          >
            Začni zadarmo
          </button>
          <button onClick={() => navigate('/domov')} className="text-xs text-[#A0907E]">
            Preskočiť
          </button>
        </div>
      )}

      {/* Dots + Navigation */}
      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {screens.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-[#6B4C3B]' : 'w-2 bg-[#D4D4D4]'}`}
            />
          ))}
        </div>
        {!current.isCTA && (
          <button
            onClick={() => setStep(step + 1)}
            className="rounded-full bg-[#6B4C3B] text-white px-10 py-3.5 text-sm font-medium active:scale-95 transition-transform"
          >
            Ďalej
          </button>
        )}
      </div>
    </div>
  );
}
