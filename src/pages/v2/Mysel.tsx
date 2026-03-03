import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Check, Clock, Footprints, Droplets, BookOpen, Pause, Heart, Lightbulb, ArrowRight, Brain } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { colors } from '../../theme/warmDusk';

const tabs = ['Mindfulness', 'Meditácie', 'Zamyslenia'] as const;
const categories = ['Stres', 'Vďačnosť', 'Večer'];

const meditations = [
  { id: '1', title: 'Uvoľnenie stresu', duration: '10 min', cat: 'Stres', audioUrl: '/audio/stress-relief.mp3' },
  { id: '2', title: 'Vďačnosť pred spaním', duration: '15 min', cat: 'Vďačnosť', audioUrl: '/audio/gratitude-sleep.mp3' },
  { id: '3', title: 'Pokojná noc', duration: '20 min', cat: 'Večer', audioUrl: '/audio/peaceful-night.mp3' },
  { id: '4', title: 'Dýchanie 4-7-8', duration: '5 min', cat: 'Stres', audioUrl: '/audio/breathing-478.mp3' },
  { id: '5', title: 'Ráno s vďačnosťou', duration: '10 min', cat: 'Vďačnosť', audioUrl: '/audio/morning-gratitude.mp3' },
];

// Mindfulness cards - daily wisdom and prompts
const mindfulnessCards = [
  {
    id: 1,
    type: 'wisdom',
    icon: Lightbulb,
    title: 'Dnešná múdrosť',
    content: 'Buď trpezlivá so sebou. Nič v prírode nespeje cez noc.',
    action: 'Zamysli sa',
    color: colors.mysel,
  },
  {
    id: 2,
    type: 'gratitude',
    icon: Heart,
    title: 'Moment vďačnosti',
    content: 'Za čo si dnes vďačná? Napíš si 3 veci, ktoré ťa potešili.',
    action: 'Zapísať',
    color: colors.periodka,
  },
  {
    id: 3,
    type: 'breathing',
    icon: Play,
    title: '2-minútka pre seba',
    content: 'Zatvor oči, narovnaj sa a urob 10 hlbokých nádychov.',
    action: 'Skúsiť',
    color: colors.strava,
  },
  {
    id: 4,
    type: 'intention',
    icon: BookOpen,
    title: 'Zámer dňa',
    content: 'Aký chceš, aby bol zvyšok tvojho dňa? Nastav si pozitívny zámer.',
    action: 'Nastaviť',
    color: colors.accent,
  },
];

// Journal prompts for self-reflection
const journalPrompts = [
  'Čo ma dnes najviac inšpirovalo?',
  'Aká emócia vo mne dnes prevládala?', 
  'Za čo som dnes vďačná?',
  'Čo by som zajtra urobila inak?',
  'Kde som dnes našla radosť?',
  'Čo som sa dnes naučila o sebe?',
  'Aký bol môj najkrajší moment dňa?',
  'Ako môžem byť k sebe zajtra láskavejšia?',
];

const habits = [
  { icon: Footprints, label: 'Kroky', target: '8 000', color: '#6B4C3B', weekDone: [true, true, true, false, true, false, false] },
  { icon: Droplets, label: 'Voda', target: '8 pohárov', color: '#7A9E78', weekDone: [true, true, false, true, true, false, false] },
  { icon: Clock, label: 'Cvičenie', target: '30 min', color: '#7A9E78', weekDone: [true, false, true, true, false, false, false] },
];

const reflections = [
  { date: '15. feb', preview: 'Dnes som zvládla ranný beh a cítila som sa skvele...' },
  { date: '14. feb', preview: 'Som vďačná za krásny deň s rodinou...' },
  { date: '13. feb', preview: 'Podarilo sa mi dokončiť projekt v práci...' },
];

export default function Mysel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<typeof tabs[number]>('Meditácie');
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

  const handleMindfulnessCardAction = (cardId: number, cardType: string) => {
    switch(cardType) {
      case 'wisdom':
        setCompletedCards(prev => new Set([...prev, cardId]));
        alert('Ďakujem za zamyslenie. Múdrosť sa najlepšie vstrebáva v tichosti. 🌱');
        break;
      case 'gratitude':
        navigate('/zamyslenia', { state: { prompt: 'Za čo si dnes vďačná?' } });
        break;
      case 'breathing':
        setCompletedCards(prev => new Set([...prev, cardId]));
        alert('Skvelé! Hlboké dýchanie je jeden z najrýchlejších spôsobov, ako sa upokojiť. 🌬️');
        break;
      case 'intention':
        navigate('/zamyslenia', { state: { prompt: 'Aký chceš, aby bol zvyšok tvojho dňa?' } });
        break;
      default:
        break;
    }
  };

  const handlePlayMeditation = (meditationId: string) => {
    if (playingId === meditationId) {
      setPlayingId(null);
      alert('Meditácia pozastavená');
    } else {
      setPlayingId(meditationId);
      const meditation = meditations.find(m => m.id === meditationId);
      alert(`Spúšťa sa "${meditation?.title}" - ${meditation?.duration}`);
    }
  };

  const openJournalWithPrompt = () => {
    const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    navigate('/zamyslenia', { state: { prompt: randomPrompt } });
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/kniznica')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(168, 132, 139, 0.14)` }}>
              <Brain className="w-4 h-4" style={{ color: '#A8848B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Myseľ</h1>
          </div>
        </div>
      </div>

      {/* Hero Section Removed */}

      {/* Tabs */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button 
              key={t} 
              onClick={() => setTab(t)}
              className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                t === tab 
                  ? 'bg-[#A8848B] text-white' 
                  : 'bg-white/20 text-gray-600 hover:bg-white/25'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mindfulness Cards */}
      {tab === 'Mindfulness' && (
        <div className="space-y-4">
          {/* Section intro */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 text-center">
            <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
              Malé chvíľky pozornosti môžu zmeniť celý deň
            </p>
          </div>
          
          <div className="grid gap-4">
            {mindfulnessCards.map((card) => {
              const isCompleted = completedCards.has(card.id);
              const IconComponent = card.icon;
              
              return (
                <div
                  key={card.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border border-white/20 cursor-pointer transition-all active:scale-[0.98] ${
                    isCompleted ? 'opacity-75' : 'hover:shadow-md'
                  }`}
                  onClick={() => !isCompleted && handleMindfulnessCardAction(card.id, card.type)}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isCompleted ? '#f3f4f6' : card.color + '14',
                      }}
                    >
                      {isCompleted ? (
                        <Check size={18} className="text-gray-500" />
                      ) : (
                        <IconComponent size={18} style={{ color: card.color }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 
                        className={`text-sm font-semibold mb-1 ${
                          isCompleted ? 'line-through text-gray-500' : ''
                        }`}
                        style={{ color: isCompleted ? '#9ca3af' : '#2E2218' }}
                      >
                        {card.title}
                      </h3>
                      <p 
                        className="text-sm leading-relaxed mb-3"
                        style={{ color: isCompleted ? '#9ca3af' : '#6B4C3B' }}
                      >
                        {card.content}
                      </p>
                      {!isCompleted && (
                        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: card.color }}>
                          {card.action}
                          <ArrowRight size={12} />
                        </div>
                      )}
                      {isCompleted && (
                        <p className="text-xs font-medium text-gray-500">
                          ✓ Dokončené
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Meditácie */}
      {tab === 'Meditácie' && (
        <div className="space-y-4">
          {/* Header section */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
                Nájdi pokoj v tichosti
              </p>
              <button 
                onClick={() => navigate('/meditacie')} 
                className="text-xs font-medium flex items-center gap-1 text-[#A8848B]"
              >
                Všetky meditácie
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((c) => (
                <button 
                  key={c} 
                  onClick={() => setCatFilter(catFilter === c ? null : c)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    catFilter === c 
                      ? 'bg-[#A8848B] text-white' 
                      : 'bg-white/20 text-gray-600 hover:bg-white/25'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          
          {/* Meditations list */}
          <div className="space-y-3">
            {meditations
              .filter((m) => !catFilter || m.cat === catFilter)
              .map((m) => (
                <div
                  key={m.id} 
                  className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
                  onClick={() => handlePlayMeditation(m.id)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(168, 132, 139, 0.14)' }}
                    >
                      {playingId === m.id ? (
                        <Pause size={16} className="text-[#A8848B]" fill="#A8848B" />
                      ) : (
                        <Play size={16} className="text-[#A8848B]" fill="#A8848B" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#2E2218' }}>
                        {m.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B4C3B' }}>
                        {m.duration} · {m.cat}
                      </p>
                    </div>
                    {playingId === m.id && (
                      <div className="w-3 h-3 rounded-full animate-pulse bg-[#A8848B]" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Enhanced Zamyslenia/Journal */}
      {tab === 'Zamyslenia' && (
        <div className="space-y-4">
          {/* Header section */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
                Tvoje myšlienky a zamyslenia
              </p>
              <button 
                onClick={openJournalWithPrompt}
                className="text-xs font-medium flex items-center gap-1 text-[#A8848B]"
              >
                Nový zápis
                <Plus size={12} />
              </button>
            </div>
          </div>

          {reflections.length > 0 ? (
            <div className="space-y-3">
              {reflections.map((r) => (
                <div
                  key={r.date} 
                  className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
                  onClick={() => navigate('/dennik/detail', { state: { entry: r } })}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(168, 132, 139, 0.14)' }}
                    >
                      <BookOpen size={14} className="text-[#A8848B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs mb-1 text-gray-500">
                        {r.date}
                      </p>
                      <p className="text-sm line-clamp-2" style={{ color: '#2E2218' }}>
                        {r.preview}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-white/20 text-center">
              <div 
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(168, 132, 139, 0.14)' }}
              >
                <BookOpen size={24} className="text-[#A8848B]" />
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#2E2218' }}>
                Tvoj denník zamyslení
              </h3>
              <p className="text-sm mb-4" style={{ color: '#6B4C3B' }}>
                Začni písať svoje myšlienky a pocity. Je to cesta k lepšiemu poznaniu seba.
              </p>
              <button
                onClick={openJournalWithPrompt}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 bg-[#A8848B]"
              >
                Prvý zápis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
