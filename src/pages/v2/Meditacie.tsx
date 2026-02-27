import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, ArrowLeft, Pause, Clock, User } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import AudioPlayer from '../../components/v2/AudioPlayer';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import CompleteWorkoutButton from '../../components/v2/workouts/CompleteWorkoutButton';
import { colors } from '../../theme/warmDusk';

const categories = [
  { name: 'Všetko', filter: null },
  { name: 'Spánok', filter: 'sleep' },
  { name: 'Fokus', filter: 'focus' },
  { name: 'Stres', filter: 'stress' },
  { name: 'Ráno', filter: 'morning' }
];

const durations = ['Všetko', '5 min', '10 min', '15 min', '20 min+'];

interface MeditationSession {
  id: string;
  title: string;
  duration: number; // in minutes
  instructor: string;
  category: string;
  audioUrl: string;
  description: string;
  thumbnail: string;
  featured: boolean;
}

const sessions: MeditationSession[] = [
  { 
    id: '1',
    title: 'Ranná meditácia', 
    duration: 10, 
    instructor: 'Eva Kováčová', 
    category: 'morning',
    audioUrl: '/audio/morning-meditation.mp3',
    description: 'Začni deň s jasnou mysľou a pozitívnou energiou',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    featured: true 
  },
  { 
    id: '2',
    title: 'Hlboký spánok', 
    duration: 20, 
    instructor: 'NeoMe', 
    category: 'sleep',
    audioUrl: '/audio/deep-sleep.mp3',
    description: 'Uvoľni sa a priprav sa na regeneračný spánok',
    thumbnail: 'https://images.unsplash.com/photo-1515894203077-9cd36514e75c?w=300&h=200&fit=crop',
    featured: false 
  },
  { 
    id: '3',
    title: 'Zvládanie stresu', 
    duration: 15, 
    instructor: 'Eva Kováčová', 
    category: 'stress',
    audioUrl: '/audio/stress-relief.mp3',
    description: 'Techniky na zvládnutie každodenného stresu',
    thumbnail: 'https://images.unsplash.com/photo-1499728603263-13726abce5ca?w=300&h=200&fit=crop',
    featured: false 
  },
  { 
    id: '4',
    title: 'Fokus a koncentrácia', 
    duration: 12, 
    instructor: 'NeoMe', 
    category: 'focus',
    audioUrl: '/audio/focus-concentration.mp3',
    description: 'Zlepši svoju koncentráciu a produktivitu',
    thumbnail: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=300&h=200&fit=crop',
    featured: false 
  },
  { 
    id: '5',
    title: 'Večerné uvoľnenie', 
    duration: 18, 
    instructor: 'Eva Kováčová', 
    category: 'sleep',
    audioUrl: '/audio/evening-relaxation.mp3',
    description: 'Ukončí deň s pokojom a vďačnosťou',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=200&fit=crop',
    featured: false 
  },
  { 
    id: '6',
    title: 'Dýchanie 4-7-8', 
    duration: 8, 
    instructor: 'NeoMe', 
    category: 'stress',
    audioUrl: '/audio/breathing-4-7-8.mp3',
    description: 'Efektívna technika pre okamžité upokojenie',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
    featured: false 
  },
];

export default function Meditacie() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeDuration, setActiveDuration] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const featured = sessions.find(s => s.featured) || sessions[0];

  // Filter sessions based on selected category and duration
  const filteredSessions = sessions.filter(session => {
    if (!session.featured) { // Don't include featured in main list
      const categoryMatch = categories[activeCategory].filter === null || 
                           session.category === categories[activeCategory].filter;
      
      const durationMatch = activeDuration === 0 || // "Všetko"
        (activeDuration === 1 && session.duration <= 5) ||
        (activeDuration === 2 && session.duration <= 10) ||
        (activeDuration === 3 && session.duration <= 15) ||
        (activeDuration === 4 && session.duration > 15);
      
      return categoryMatch && durationMatch;
    }
    return false;
  });

  const handlePlayMeditation = (meditation: MeditationSession) => {
    // Navigate to full-screen meditation player
    navigate('/meditation-player', { state: { session: meditation } });
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica/mysel')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(168, 132, 139, 0.14)` }}>
              <PlayCircle className="w-4 h-4" style={{ color: '#A8848B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Meditácie</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Relaxácia a mindfulness cvičenia
          </p>
        </div>
      </div>

      {/* Featured Meditation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <button
          onClick={() => handlePlayMeditation(featured)}
          className="relative w-full h-32 block active:scale-[0.98] transition-transform text-left"
        >
          <img 
            src={featured.thumbnail} 
            alt={featured.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
              {playingId === featured.id ? (
                <Pause size={24} style={{ color: '#A8848B' }} fill="#A8848B" />
              ) : (
                <PlayCircle size={24} style={{ color: '#A8848B' }} fill="#A8848B" strokeWidth={0} />
              )}
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            Odporúčané
          </div>
          <div className="absolute top-2 right-2">
            <FavoriteButton
              itemId={featured.id}
              type="meditation"
              title={featured.title}
              image={featured.thumbnail}
              duration={`${featured.duration} min`}
              category={featured.category}
              metadata={{ instructor: featured.instructor }}
              size="sm"
              className="bg-black/60 backdrop-blur-[10px] text-white hover:bg-black/70"
            />
          </div>
        </button>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {featured.title}
          </h3>
          <p className="text-sm mt-1 text-gray-600">
            {featured.description}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs flex items-center gap-1 text-gray-500">
              <Clock size={12} />
              {featured.duration} min
            </span>
            <span className="text-xs flex items-center gap-1 text-gray-500">
              <User size={12} />
              {featured.instructor}
            </span>
          </div>
          
          {/* Complete meditation button */}
          <div className="mt-4">
            <CompleteWorkoutButton
              workoutId={featured.id}
              workoutTitle={featured.title}
              workoutType="mysel"
              duration={featured.duration}
              metadata={{ instructor: featured.instructor, category: featured.category }}
              variant="secondary"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        {/* Category Filter */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-3 text-gray-800">Kategória</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActiveCategory(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === i 
                    ? 'bg-[#A8848B] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800">Dĺžka</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {durations.map((d, i) => (
              <button
                key={d}
                onClick={() => setActiveDuration(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeDuration === i 
                    ? 'bg-[#A8848B] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtered Session List */}
      <div className="space-y-3">
        {filteredSessions.map((session) => (
          <div 
            key={session.id} 
            className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden"
          >
            <button
              onClick={() => handlePlayMeditation(session)}
              className="w-full active:scale-[0.98] transition-transform text-left"
            >
            <div className="flex items-center gap-3 p-4">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                <img 
                  src={session.thumbnail} 
                  alt={session.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  {playingId === session.id ? (
                    <Pause size={16} className="text-white" fill="white" />
                  ) : (
                    <PlayCircle size={16} className="text-white" fill="white" strokeWidth={0} />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800">
                  {session.title}
                </h4>
                <p className="text-xs mt-0.5 text-gray-600 line-clamp-2">
                  {session.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs flex items-center gap-1 text-gray-500">
                    <Clock size={12} />
                    {session.duration} min
                  </span>
                  <span className="text-xs flex items-center gap-1 text-gray-500">
                    <User size={12} />
                    {session.instructor}
                  </span>
                  {playingId === session.id && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#A8848B] text-white">
                      Hrá
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {/* Favorite Button */}
                <FavoriteButton
                  itemId={session.id}
                  type="meditation"
                  title={session.title}
                  image={session.thumbnail}
                  duration={`${session.duration} min`}
                  category={session.category}
                  metadata={{ instructor: session.instructor }}
                  size="sm"
                  variant="minimal"
                />
                
                {/* Complete meditation button */}
                <CompleteWorkoutButton
                  workoutId={session.id}
                  workoutTitle={session.title}
                  workoutType="mysel"
                  duration={session.duration}
                  metadata={{ instructor: session.instructor, category: session.category }}
                  variant="secondary"
                  size="sm"
                />
              </div>
            </div>
            </button>
          </div>
        ))}
      </div>
      
      {filteredSessions.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Žiadne meditácie sa nenašli pre vybrané filtre.
          </p>
        </div>
      )}
    </div>
  );
}
