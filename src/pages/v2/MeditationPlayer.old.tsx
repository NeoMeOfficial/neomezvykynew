import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

interface Meditation {
  id: string;
  title: string;
  duration: string;
  description: string;
  audioUrl: string;
  image: string;
}

// Skutočné meditácie pre ženy a matky - len pokojné prírodné scenérie
const meditations: Meditation[] = [
  {
    id: 'med-1',
    title: 'Nájdenie vnútorného pokoja uprostred chaosu',
    duration: '5 min',
    description: 'Naučte sa nájsť pokojné miesto vo svojej mysli aj v najrušnejších dňoch',
    audioUrl: '/audio/inner-peace-chaos.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-2', 
    title: 'Učenie sa byť prítomná pri každodenných úlohách',
    duration: '5 min',
    description: 'Transformujte bežné činnosti na príležitosti pre mindfulness',
    audioUrl: '/audio/present-daily-tasks.mp3',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-3',
    title: 'Objavovanie trpezlivosti vo výchovnom procese',
    duration: '5 min', 
    description: 'Kultivujte trpezlivosť a porozumenie v náročných výchovných momentoch',
    audioUrl: '/audio/patience-parenting.mp3',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop'
  },
  {
    id: 'med-4',
    title: 'Nájdenie radosti v malých veciach',
    duration: '5 min',
    description: 'Objavte krásu v jednoduchých, každodenných momentoch',
    audioUrl: '/audio/joy-small-things.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-5',
    title: 'Udržiavanie emocionálnej rovnováhy',
    duration: '5 min',
    description: 'Technika na stabilizovanie emócií a nájdenie vnútornej harmónie',
    audioUrl: '/audio/emotional-balance.mp3',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop'
  },
  {
    id: 'med-6',
    title: 'Vytváranie času pre seba',
    duration: '5 min',
    description: 'Naučte sa prioritizovať svoju pohodu a vytvoriť priestor pre seba',
    audioUrl: '/audio/time-for-self.mp3',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop'
  },
  {
    id: 'med-7',
    title: 'Posilňovanie väzby s dieťaťom',
    duration: '5 min',
    description: 'Meditácia zameraná na prehĺbenie lásky a spojenia s vaším dieťaťom',
    audioUrl: '/audio/bond-with-child.mp3',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop'
  },
  {
    id: 'med-8',
    title: 'Prijímanie nepredvídateľnosti materstva',
    duration: '5 min',
    description: 'Naučte sa flexibilne reagovať na neočakávané situácie v materstve',
    audioUrl: '/audio/accept-unpredictability.mp3',
    image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop'
  },
  {
    id: 'med-9',
    title: 'Naučiť sa odpúšťať sebe a iným',
    duration: '5 min',
    description: 'Oslobodenie sa od viny a rozhorčenia cez praktiku odpúštania',
    audioUrl: '/audio/forgiveness-practice.mp3',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-10',
    title: 'Rozvíjanie empatie a porozumenia',
    duration: '5 min',
    description: 'Prehĺbenie schopnosti porozumieť sebe aj ostatným s láskavosťou',
    audioUrl: '/audio/empathy-understanding.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-11',
    title: 'Prekonávanie stresu a úzkosti',
    duration: '5 min',
    description: 'Efektívne techniky na zvládanie stresu a upokojenie anxióznych myšlienok',
    audioUrl: '/audio/overcome-stress-anxiety.mp3',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-12',
    title: 'Budovanie sebadôvery a sebaúcty',
    duration: '5 min',
    description: 'Posilnenie vnútornej sily a pozitívneho vzťahu k sebe',
    audioUrl: '/audio/self-confidence-esteem.mp3',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop'
  },
  {
    id: 'med-13',
    title: 'Nájdenie rovnováhy medzi kariérou a osobným životom',
    duration: '5 min',
    description: 'Harmonizácia pracovných a osobných priorít s múdrosťou',
    audioUrl: '/audio/work-life-balance.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-14',
    title: 'Učenie sa hovoriť „nie" bez pocitu viny',
    duration: '5 min',
    description: 'Nastavenie zdravých hraníc a sebapéça bez pocitov viny',
    audioUrl: '/audio/saying-no-guilt.mp3',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop'
  },
  {
    id: 'med-15',
    title: 'Rozvíjanie kreativity a hľadanie inšpirácie',
    duration: '5 min',
    description: 'Prebudenie tvorivého ducha a otvorenie sa novým možnostiam',
    audioUrl: '/audio/creativity-inspiration.mp3',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-16',
    title: 'Zvládanie pocitu osamelosti a izolácie',
    duration: '5 min',
    description: 'Nájdenie spojenia a zmyslu aj v momentoch osamelosti',
    audioUrl: '/audio/loneliness-isolation.mp3',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop'
  },
  {
    id: 'med-17',
    title: 'Udržiavanie pozitívneho myslenia',
    duration: '5 min',
    description: 'Kultivovanie optimizmu a vďačnosti v každodennom živote',
    audioUrl: '/audio/positive-thinking.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  }
];

export default function MeditationPlayer() {
  const navigate = useNavigate();
  const { meditationId } = useParams<{ meditationId: string }>();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const meditation = meditations.find(m => m.id === meditationId);

  useEffect(() => {
    if (!meditation) {
      navigate('/kniznica/mysel');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [meditation, navigate]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Audio playback error:', error);
      // Fallback for demo - show message
      if (!isPlaying) {
        setIsPlaying(true);
        // Simulate meditation timer
        setTimeout(() => setIsPlaying(false), 5000);
      }
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!meditation) {
    return null;
  }

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/kniznica/mysel')}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: colors.mysel }} />
        </button>
        <h1 className="text-lg font-semibold" style={{ color: colors.mysel }}>
          Meditácia
        </h1>
      </div>

      {/* Main Player Card */}
      <div 
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={glassCard}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${meditation.image})` }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.mysel}10 0%, ${colors.mysel}20 100%)`
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.mysel }}>
            {meditation.title}
          </h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {meditation.description}
          </p>

          {/* Time Display */}
          <div className="mb-8">
            <div className="text-3xl font-bold mb-2" style={{ color: colors.mysel }}>
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-500">
              z {meditation.duration}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: colors.mysel 
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={restart}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="h-6 w-6" style={{ color: colors.mysel }} />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: colors.mysel }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8 text-white fill-current" />
              ) : (
                <Play className="h-8 w-8 text-white fill-current ml-1" />
              )}
            </button>

            <div className="w-12" /> {/* Spacer for symmetry */}
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div 
        className="rounded-2xl p-4"
        style={{
          ...glassCard,
          backgroundColor: `${colors.mysel}08`
        }}
      >
        <h3 className="font-semibold mb-3" style={{ color: colors.mysel }}>
          Pred začatím meditácie:
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Nájdi si pokojné miesto bez rušenia</li>
          <li>• Sadni si pohodlne a narovnaj chrbticu</li>
          <li>• Zatvor oči a sústreď sa na svojich dych</li>
          <li>• Nech ťa myšlienky nerozptyľujú, len ich pozoruj</li>
        </ul>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={meditation.audioUrl}
        preload="metadata"
        onError={() => {
          console.log('Audio file not found, using demo mode');
          setIsLoading(false);
        }}
      />
    </div>
  );
}