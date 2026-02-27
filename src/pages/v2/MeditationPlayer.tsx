import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Heart } from 'lucide-react';
import SimpleAudioPlayer from '../../components/v2/SimpleAudioPlayer';
import GlassCard from '../../components/v2/GlassCard';
import { colors } from '../../theme/warmDusk';

interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  instructor: string;
  category: string;
  audioUrl: string;
  description: string;
  thumbnail: string;
  featured: boolean;
}

export default function MeditationPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session as MeditationSession;
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/meditacie');
      return;
    }
  }, [session, navigate]);

  if (!session) return null;

  const handleComplete = () => {
    setIsCompleted(true);
    
    // In real app, this would track completion
    console.log('Meditation completed:', session.title);
    
    // Show completion message after 2 seconds
    setTimeout(() => {
      setIsCompleted(false);
    }, 3000);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In real app, this would save to user preferences
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
              {session.title}
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {session.instructor}
            </p>
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

      {/* Session Image */}
      <div className="px-5 mb-8">
        <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img 
            src={session.thumbnail} 
            alt={session.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <div className="text-sm opacity-80">{session.category}</div>
                <div className="font-semibold">{session.duration} minút</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">Meditácia</div>
                <div className="text-sm font-medium">{session.instructor}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="px-5 mb-8">
        <SimpleAudioPlayer
          audioUrl={session.audioUrl}
          title={session.title}
          instructor={session.instructor}
          duration={session.duration * 60} // Convert to seconds
          onComplete={handleComplete}
          autoplay={false}
        />
      </div>

      {/* Session Description */}
      <div className="px-5 mb-8">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
            O tejto meditácii
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
            {session.description}
          </p>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: colors.textTertiary }}>Kategória</span>
              <span style={{ color: colors.textSecondary }} className="font-medium">
                {session.category === 'sleep' ? 'Spánok' :
                 session.category === 'focus' ? 'Fokus' :
                 session.category === 'stress' ? 'Stres' :
                 session.category === 'morning' ? 'Ráno' : session.category}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span style={{ color: colors.textTertiary }}>Dĺžka</span>
              <span style={{ color: colors.textSecondary }} className="font-medium">
                {session.duration} minút
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span style={{ color: colors.textTertiary }}>Inštruktor</span>
              <span style={{ color: colors.textSecondary }} className="font-medium">
                {session.instructor}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="px-5">
        <GlassCard className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
              style={{ 
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.mysel} 100%)`,
                color: 'white'
              }}
              onClick={() => {
                // Restart meditation
                window.location.reload();
              }}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="font-medium">Reštart</span>
            </button>
            
            <button 
              className="flex items-center justify-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
              style={{ 
                background: 'rgba(255,255,255,0.5)',
                color: colors.textPrimary,
                backdropFilter: 'blur(10px)'
              }}
              onClick={toggleFavorite}
            >
              <Heart 
                className="w-5 h-5" 
                fill={isFavorited ? '#E53E3E' : 'none'}
                style={{ color: isFavorited ? '#E53E3E' : colors.textPrimary }}
              />
              <span className="font-medium">
                {isFavorited ? 'Uložené' : 'Uložiť'}
              </span>
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
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.mysel} 100%)`,
              color: 'white'
            }}
          >
            <div className="text-4xl mb-4">🧘‍♀️</div>
            <h3 className="text-xl font-semibold mb-2">Gratulujeme!</h3>
            <p className="text-white/80">
              Dokončili ste meditáciu<br />
              "{session.title}"
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