import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Dumbbell } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

interface Program {
  id: string;
  name: string;
  level: number;
  weeks: number;
  description: string;
  detailedDescription?: string;
  image: string;
}

const programs: Program[] = [
  {
    id: 'postpartum',
    name: 'Postpartum',
    level: 1,
    weeks: 8,
    description: 'Program je vhodný pre ženy, ktoré potrebujú spevniť brušný korzet, vyriešiť diastázu či inkontinenciu, mesiace aj roky po pôrode.',
    detailedDescription: `Program je vhodný pre ženy, ktoré potrebujú spevniť brušný korzet, vyriešiť diastázu či inkontinenciu, mesiace aj roky po pôrode.

🎯 **Čo obsahuje:**
• 8 týždňov - 24 posilňovacích cvičení - 16 strečingov
• 15 minútové cvičenia - Level 1
• Bezpečné aj po sekcii (po 3 mesiacoch)

💪 **Na čo sa zameriavame:**
• Bránicové dýchanie a aktivácia panvového dna
• Posilnenie hlbokých brušných svalov (TVA)  
• Odstránenie bolestí chrbta
• Postupné zvyšovanie intenzity

🏠 **Čo budeš potrebovať:**
• Karimatku • Pilates ball • Krátku aj dlhú rezistenčnú gumu

Vhodné pre mamičky bez ohľadu na to, či si po pôrode týždne, mesiace či roky.`,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop',
  },
  {
    id: 'bodyforming',
    name: 'BodyForming',
    level: 2,
    weeks: 8,
    description: 'Formovanie postavy s dôrazom na problémové partie — brucho, stehná, zadok.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop',
  },
  {
    id: 'elastic-bands',
    name: 'ElasticBands',
    level: 3,
    weeks: 6,
    description: 'Intenzívne cvičenia s rezistenčnými gumami pre celé telo.',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=500&fit=crop',
  },
  {
    id: 'strong-sexy',
    name: 'Strong&Sexy',
    level: 4,
    weeks: 8,
    description: 'Pokročilý program pre ženy, ktoré chcú silné a sexy telo.',
    image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&h=500&fit=crop',
  },
];

const filterOptions = ['Všetko', 'Level 1', 'Level 2', 'Level 3', 'Level 4'];
const levelMap = { 'Všetko': null, 'Level 1': [1], 'Level 2': [2], 'Level 3': [3], 'Level 4': [4] };

export default function TeloPrograms() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(0);

  const filteredPrograms = programs.filter(p => {
    const selectedLevels = levelMap[filterOptions[activeFilter] as keyof typeof levelMap];
    if (!selectedLevels) return true;
    return selectedLevels.includes(p.level);
  });

  const handleProgramClick = (programId: string) => {
    // Navigate to dedicated landing pages for specific programs
    if (programId === 'postpartum') {
      navigate('/program/postpartum/info');
    } else {
      navigate(`/program/${programId}`);
    }
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica/telo')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Dumbbell className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Programy</h1>
          </div>
        </div>

      </div>

      {/* Intro text */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <p className="text-[13px] leading-relaxed text-center" style={{ color: '#6B4C3B' }}>
          Vyber si jeden zo 4 programov podľa svojej aktuálnej úrovne a nechaj sa ním viesť až do konca – práve vtedy prichádzajú tie najkrajšie výsledky. <strong>Každý deň jedno 15 minútové cvičenie</strong> na budovanie nielen sily, ale aj nového návyku.
        </p>
      </div>

      {/* Nordic Filter Tabs */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-2 shadow-sm border border-white/20">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {filterOptions.map((filter, i) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(i)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === i 
                  ? 'bg-[#6B4C3B] text-white' 
                  : 'text-[#8B7560] hover:bg-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredPrograms.map((p) => (
          <div
            key={p.id}
            className={`bg-white/30 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md ${
              p.id === 'postpartum' && activeFilter === 1 && filteredPrograms.length === 1 ? 'min-h-[320px]' : ''
            }`}
            onClick={() => handleProgramClick(p.id)}
          >
            <div className="relative h-36">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className={`${p.id === 'postpartum' && activeFilter === 1 && filteredPrograms.length === 1 ? 'p-5' : 'p-4'}`}>
              <p className="text-[15px] font-semibold" style={{ color: '#2E2218' }}>{p.name}</p>
              <div className="flex items-center gap-2 mt-1.5 mb-2">
                <span 
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-stone-100"
                  style={{ color: '#6B4C3B' }}
                >
                  Level {p.level}
                </span>
                <span 
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-orange-100"
                  style={{ color: '#B8864A' }}
                >
                  {p.weeks} týždňov
                </span>
              </div>
              <div className="text-[12px] leading-relaxed" style={{ color: '#6B4C3B' }}>
                {p.id === 'postpartum' && activeFilter === 1 && filteredPrograms.length === 1 ? (
                  <div className="space-y-2 whitespace-pre-line">
                    {p.detailedDescription}
                  </div>
                ) : (
                  <p className="line-clamp-2">{p.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
