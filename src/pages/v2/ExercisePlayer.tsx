import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Airplay, Clock } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';
import { exercises } from '../../data/exercises';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';

export default function ExercisePlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Get exercise from route state or find by ID/path
  let exercise = location.state?.exercise;
  
  // If no exercise in state, try to find it by route
  if (!exercise) {
    // Extract exercise index from route (e.g., /stretch/0, /exercise/extra/1)
    const routePath = location.pathname;
    exercise = exercises.find(e => e.route === routePath || routePath.includes(e.id));
  }
  
  // Fallback: get first exercise if still not found
  if (!exercise) {
    exercise = exercises[0];
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate progress for demo
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const handleAirplay = () => {
    alert(`AirPlay aktivovaný pre ${exercise.name}`);
  };

  const formatDuration = (duration: string): string => {
    // Convert "15 min" to "15:00"
    const match = duration.match(/(\d+)\s*min/);
    if (match) {
      const minutes = parseInt(match[1]);
      return `${minutes}:00`;
    }
    return duration;
  };

  const getBackPath = (): string => {
    if (location.state?.fromRecommendation) {
      return '/domov';
    }
    
    if (exercise.category === 'stretch') {
      return '/kniznica/telo/strecing';
    }
    
    return '/kniznica/telo/extra';
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return '#7A9E78';
      case 'medium': return '#B8864A';
      case 'high': return '#C27A6E';
      default: return colors.telo;
    }
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(getBackPath())} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
          </button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>
              {exercise.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-[#8B7560]" strokeWidth={1.5} />
              <span className="text-[12px] text-[#8B7560]">{exercise.duration}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FavoriteButton 
              itemId={exercise.id} 
              itemType="exercise" 
              size="md"
            />
            <button 
              onClick={handleAirplay}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)' }}
            >
              <Airplay size={16} className="text-[#8B7560]" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-white/20">
        <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
          <img 
            src={exercise.thumb} 
            alt={exercise.name} 
            className="w-full h-full object-cover" 
          />
          
          {/* Video overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.9)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" style={{ color: colors.telo }} />
              ) : (
                <Play className="w-7 h-7 ml-1" style={{ color: colors.telo }} fill={colors.telo} strokeWidth={0} />
              )}
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Duration badge */}
          <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2 py-1 rounded-full backdrop-blur-sm">
            {formatDuration(exercise.duration)}
          </div>
        </div>
        
        {/* Controls */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 text-[#8B7560] text-sm font-medium active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
              Reštart
            </button>
            
            <div className="text-center">
              <div className="text-[12px] text-[#8B7560]">
                {Math.round(progress)}% dokončené
              </div>
            </div>
          </div>
          
          {/* Exercise info tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              className="text-[11px] px-2 py-1 rounded-full font-medium"
              style={{ 
                backgroundColor: `${colors.telo}15`,
                color: colors.telo,
              }}
            >
              {exercise.body}
            </span>
            <span 
              className="text-[11px] px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor: `${colors.accent}15`,
                color: colors.accent,
              }}
            >
              {exercise.equip}
            </span>
            <span 
              className="text-[11px] px-2 py-1 rounded-full font-medium"
              style={{
                backgroundColor: `${getIntensityColor(exercise.intensity)}15`,
                color: getIntensityColor(exercise.intensity),
              }}
            >
              {exercise.intensity === 'low' ? 'Nízka intenzita' : 
               exercise.intensity === 'medium' ? 'Stredná intenzita' : 
               'Vysoká intenzita'}
            </span>
          </div>
        </div>
      </div>

      {/* Exercise description */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <h3 className="text-[14px] font-semibold text-[#2E2218] mb-2">O cvičení</h3>
        <p className="text-[13px] leading-relaxed text-[#8B7560]">
          {exercise.category === 'stretch' ? 
            'Jemný strečing pre uvoľnenie napätia a zlepšenie flexibility. Ideálny pre dni, keď potrebuješ zmierniť stres a upokojiť myseľ.' :
            'Posilňovacie cvičenie pre budovanie sily a vytrvalosti. Skvelé pre dni s vyššou energiou, keď sa cítiš pripravená na výzvy.'
          }
        </p>
        
        {location.state?.fromRecommendation && (
          <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: `${colors.mysel}10` }}>
            <p className="text-[12px] font-medium text-[#A8848B]">
              💡 Toto cvičenie bolo odporúčané na základe aktuálnej fázy tvojho cyklu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}