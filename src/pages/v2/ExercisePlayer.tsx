import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, RotateCcw, Heart } from 'lucide-react';
import VideoPlayer from '../../components/v2/VideoPlayer';
import GlassCard from '../../components/v2/GlassCard';
import { colors } from '../../theme/warmDusk';

interface Exercise {
  id: string;
  name: string;
  duration: string;
  type: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  instructions?: string[];
  tips?: string[];
}

export default function ExercisePlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const exercise = location.state?.exercise as Exercise;
  const programName = location.state?.programName as string;
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!exercise) {
      navigate(-1);
      return;
    }
  }, [exercise, navigate]);

  if (!exercise) return null;

  const handleComplete = () => {
    setIsCompleted(true);
    
    // In real app, this would track completion
    console.log('Exercise completed:', exercise.name);
    
    // Show completion message after 2 seconds
    setTimeout(() => {
      setIsCompleted(false);
    }, 3000);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In real app, this would save to user preferences
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return colors.telo;
      case 'cardio': return colors.strava;
      case 'flexibility': return colors.mysel;
      case 'core': return colors.accent;
      default: return colors.primary;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'strength': return 'Sila';
      case 'cardio': return 'Kardio';
      case 'flexibility': return 'Flexibilita';
      case 'core': return 'Core';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: `linear-gradient(135deg, ${colors.background} 0%, #F5EDE4 100%)` }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-5 backdrop-blur-xl" style={{ background: 'rgba(248, 244, 240, 0.8)' }}>
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: colors.textPrimary }} />
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
              {exercise.name}
            </h1>
            {programName && (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {programName}
              </p>
            )}
          </div>

          <button 
            onClick={toggleFavorite}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Heart 
              className="w-6 h-6" 
              style={{ color: isFavorited ? '#E53E3E' : colors.textSecondary }}
              fill={isFavorited ? '#E53E3E' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="px-5 mb-8">
        <VideoPlayer
          videoUrl={exercise.videoUrl}
          title={exercise.name}
          thumbnail={exercise.thumbnail}
          onComplete={handleComplete}
          autoplay={false}
        />
      </div>

      {/* Exercise Info */}
      <div className="px-5 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                {exercise.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getTypeColor(exercise.type) }}
                >
                  {getTypeName(exercise.type)}
                </span>
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {exercise.duration}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
            {exercise.description}
          </p>

          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="font-medium mb-3" style={{ color: colors.textPrimary }}>
                Pokyny na vykonávanie
              </h4>
              <ol className="space-y-2">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="text-sm flex gap-3" style={{ color: colors.textSecondary }}>
                    <span 
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: getTypeColor(exercise.type) }}
                    >
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {exercise.tips && exercise.tips.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="font-medium mb-3" style={{ color: colors.textPrimary }}>
                💡 Tipy
              </h4>
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="text-sm" style={{ color: colors.textSecondary }}>
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="px-5">
        <GlassCard className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
              style={{ 
                background: `linear-gradient(135deg, ${getTypeColor(exercise.type)} 0%, ${colors.accent} 100%)`,
                color: 'white'
              }}
              onClick={() => {
                // Mark as completed
                handleComplete();
              }}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Dokončené</span>
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
              style={{ 
                background: 'rgba(255,255,255,0.5)',
                color: colors.textPrimary,
                backdropFilter: 'blur(10px)'
              }}
              onClick={() => {
                // Restart exercise
                window.location.reload();
              }}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="font-medium">Reštart</span>
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Completion Overlay */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="mx-5 p-8 rounded-3xl text-center"
            style={{ 
              background: `linear-gradient(135deg, ${getTypeColor(exercise.type)} 0%, ${colors.accent} 100%)`,
              color: 'white'
            }}
          >
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-xl font-semibold mb-2">Výborná práca!</h3>
            <p className="text-white/80">
              Dokončili ste cvičenie<br />
              "{exercise.name}"
            </p>
            <div className="mt-6">
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl font-medium hover:bg-white/30 transition-colors"
              >
                Pokračovať
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}