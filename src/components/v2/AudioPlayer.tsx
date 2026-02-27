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

export default function AudioPlayer({ 
  audioUrl, 
  title, 
  instructor, 
  duration: expectedDuration, 
  onComplete,
  autoplay = false 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(expectedDuration || 0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Working meditation/relaxation audio URLs (using nature sounds and meditation tracks)
  const getWorkingAudioUrl = (url: string) => {
    if (!url || url.includes('/audio/') || url.includes('placeholder')) {
      const workingAudios = [
        'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        'https://file-examples.com/storage/fe86da71cf8fb53b832c7eb/2017/11/file_example_MP3_700KB.mp3',
        // Fallback to nature sounds
        'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-one/zapsplat_nature_forest_stream_water_over_rocks_gentle_23839.mp3',
      ];
      
      // For demo, we'll use a text-to-speech approach for meditation guidance
      return generateMeditationAudio(title, instructor);
    }
    return url;
  };

  const generateMeditationAudio = (title: string, instructor?: string) => {
    // For demo purposes, we'll create a meditation script and use browser TTS
    const meditationScripts = {
      'Ranná meditácia': `Vitaj v rannej meditácii. Nájdi si pohodlnú polohu a zatvor oči. Zhlboka sa nadýchni... a vydýchni. Predstav si, že s každým nádychom prichádzajú pozitívne energie...`,
      'Hlboký spánok': `Priprav sa na regeneračný spánok. Uvoľni všetky svaly tela, začnime od hlavy... Tvoja myseľ sa postupne upokojuje...`,
      'Zvládanie stresu': `Keď sa cítiš pod tlakom, pamätaj si na svoju silu. Dýchaj pomaly a hlboko. Stres je len dočasný...`,
      'Fokus a koncentrácia': `Sústreď sa na svoj dych. Nechaj všetky myšlienky prejsť bez hodnotenia. Tvoja pozornosť je ako laser...`,
      'Večerné uvoľnenie': `Deň sa končí. Je čas pustiť všetky starosti a napätie. Ďakuj svojmu telu za dnešný deň...`
    };

    const script = meditationScripts[title as keyof typeof meditationScripts] || 
                   'Začnime s relaxačnou meditáciou. Zhlboka sa nadýchni a nechaj svoje telo uvoľniť...';
    
    // Create audio using Web Speech API (for demo)
    return createSpeechAudio(script, instructor);
  };

  const createSpeechAudio = (text: string, instructor?: string) => {
    // Check if running in browser and speech synthesis is supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
        utterance.volume = 0.8;
        
        // Safely get voices
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.includes('sk') || voice.lang.includes('cs') || voice.lang.includes('en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        return utterance;
      } catch (error) {
        console.warn('Speech synthesis not available:', error);
      }
    }
    
    // Fallback: return a working audio URL
    return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // For speech synthesis
        if (typeof audioRef.current.src === 'object' && typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.speak(audioRef.current.src as any);
          setIsPlaying(true);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.warn('Audio playback failed, using fallback method');
      // Fallback to speech synthesis
      const utterance = generateMeditationAudio(title, instructor);
      speechSynthesis.speak(utterance as any);
      setIsPlaying(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
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
  }, [autoplay]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
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
      <audio
        ref={audioRef}
        src={getWorkingAudioUrl(audioUrl)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          onComplete?.();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />

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
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
          ) : (
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
          )}
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
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`
                }}
              />
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
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
            onClick={() => skip(-15)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipBack className="w-5 h-5 text-[#6B4C3B]" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.mysel} 100%)` }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>

          <button 
            onClick={() => skip(15)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipForward className="w-5 h-5 text-[#6B4C3B]" />
          </button>

          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMute} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isMuted ? 
                <VolumeX className="w-5 h-5 text-[#6B4C3B]" /> : 
                <Volume2 className="w-5 h-5 text-[#6B4C3B]" />
              }
            </button>
            <div className="w-16 relative">
              <div className="h-1 bg-white/20 rounded-full">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${(isMuted ? 0 : volume) * 100}%`,
                    background: colors.accent
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}