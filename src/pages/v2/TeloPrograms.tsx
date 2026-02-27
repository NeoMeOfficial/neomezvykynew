import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Dumbbell } from 'lucide-react';

const programs = [
  {
    id: 'postpartum',
    name: 'Postpartum',
    level: 1,
    weeks: 8,
    description: 'Program je vhodný pre ženy, ktoré potrebujú spevniť brušný korzet, vyriešiť diastázu či inkontinenciu, mesiace aj roky po pôrode.',
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

const filterOptions = ['Všetko', 'Začiatočník', 'Pokročilý', 'Expert'];
const levelMap = { 'Všetko': null, 'Začiatočník': [1, 2], 'Pokročilý': [3], 'Expert': [4] };

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
      navigate('/program/postpartum');
    } else {
      navigate(`/program/${programId}`);
    }
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica/telo')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Dumbbell className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Programy</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Fitness programy pre každú úroveň
          </p>
        </div>
      </div>

      {/* Nordic Filter Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-50">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {filterOptions.map((filter, i) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(i)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === i 
                  ? 'bg-[#6B4C3B] text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
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
            className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform hover:shadow-md"
            onClick={() => handleProgramClick(p.id)}
          >
            <div className="relative h-36">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
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
              <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: '#6B4C3B' }}>
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
