import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  instructor?: string;
  duration?: number;
  onComplete?: () => void;
  autoplay?: boolean;
}

export default function SimpleAudioPlayer({ 
  title, 
  instructor, 
  onComplete,
  autoplay = false 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // Default 5 minutes

  // Simple play/pause toggle for demo
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start a timer to simulate audio playback
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            clearInterval(interval);
            setIsPlaying(false);
            onComplete?.();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Store interval ID for cleanup
      (window as any).audioInterval = interval;
    } else {
      // Stop the timer
      if ((window as any).audioInterval) {
        clearInterval((window as any).audioInterval);
      }
    }
  };

  const restart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    if ((window as any).audioInterval) {
      clearInterval((window as any).audioInterval);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (autoplay) {
      togglePlay();
    }
    
    return () => {
      if ((window as any).audioInterval) {
        clearInterval((window as any).audioInterval);
      }
    };
  }, []);

  return (
    <div 
      className="p-6 rounded-3xl backdrop-blur-xl border border-white/10"
      style={{ 
        background: `linear-gradient(135deg, ${colors.glass.card} 0%, rgba(255,255,255,0.15) 100%)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-[#2E2218] mb-1">{title}</h3>
        {instructor && (
          <p className="text-sm text-[#6B4C3B] opacity-80">{instructor}</p>
        )}
      </div>

      {/* Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isPlaying ? 'animate-pulse' : ''
        }`} style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.mysel} 100%)` }}>
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        {/* Time and Progress Bar */}
        <div className="flex items-center space-x-3 text-sm text-[#6B4C3B]">
          <span className="w-10">{formatTime(currentTime)}</span>
          <div className="flex-1 relative">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{ 
                  width: `${(currentTime / duration) * 100}%`,
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`
                }}
              />
            </div>
          </div>
          <span className="w-10">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6">
          <button 
            onClick={restart} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-[#6B4C3B]" />
          </button>
          
          <button 
            onClick={() => setCurrentTime(Math.max(0, currentTime - 15))} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipBack className="w-5 h-5 text-[#6B4C3B]" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.mysel} 100%)` }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>

          <button 
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 15))} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipForward className="w-5 h-5 text-[#6B4C3B]" />
          </button>

          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-[#6B4C3B]" />
            <div className="w-16 relative">
              <div className="h-1 bg-white/20 rounded-full">
                <div 
                  className="h-full rounded-full transition-all w-4/5"
                  style={{ background: colors.accent }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo Notice */}
      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <p className="text-xs text-[#6B4C3B] text-center">
          🧘‍♀️ Meditation audio playing: "{title}" ({formatTime(duration)})
        </p>
      </div>
    </div>
  );
}