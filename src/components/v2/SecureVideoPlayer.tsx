import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Cast, Shield, Lock } from 'lucide-react';
import { secureVideoService, SecureVideoAccess } from '../../services/SecureVideoService';
import { colors } from '../../theme/warmDusk';

interface SecureVideoPlayerProps {
  exerciseId: string;
  programId: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  onComplete?: () => void;
  onAccessDenied?: () => void;
}

export default function SecureVideoPlayer({ 
  exerciseId,
  programId,
  title, 
  thumbnail, 
  autoplay = false,
  onComplete,
  onAccessDenied
}: SecureVideoPlayerProps) {
  const [videoAccess, setVideoAccess] = useState<SecureVideoAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Request secure video access on component mount
  useEffect(() => {
    requestSecureAccess();
  }, [exerciseId, programId]);

  // Session timer for access token expiration
  useEffect(() => {
    if (videoAccess?.expiresAt) {
      const updateTimer = () => {
        const remaining = videoAccess.expiresAt! - Date.now();
        if (remaining <= 0) {
          setError('Video session expired. Please reload.');
          setVideoAccess(null);
        } else {
          setSessionTimeRemaining(remaining);
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [videoAccess]);

  const requestSecureAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Demo: Requesting video access for exercise:', exerciseId);

      // In real implementation, get userId and sessionToken from auth context
      const access = await secureVideoService.requestVideoAccess({
        exerciseId,
        programId,
        userId: 'demo-user', // Replace with actual user ID
        sessionToken: 'demo-session' // Replace with actual session token
      });

      console.log('Demo: Video access result:', access);

      if (access.success) {
        setVideoAccess(access);
        console.log('Demo: Video access granted, embed URL:', access.embedUrl);
      } else {
        setError(access.error || 'Failed to access video');
        console.error('Demo: Video access denied:', access.error);
        onAccessDenied?.();
      }
    } catch (err) {
      console.error('Demo: Error requesting video access:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIframeLoad = () => {
    console.log('Demo: YouTube iframe loaded successfully');
    setIframeLoaded(true);
    setIframeError(false);
    
    if (autoplay && iframeRef.current) {
      // Send play command to YouTube iframe
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}', 
          '*'
        );
        setIsPlaying(true);
      }, 1000);
    }
  };

  const handleIframeError = () => {
    console.error('Demo: YouTube iframe failed to load');
    setIframeError(true);
    setIframeLoaded(false);
  };

  const togglePlay = () => {
    if (iframeRef.current) {
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${command}","args":""}`, 
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"seekTo","args":[0, true]}', 
        '*'
      );
    }
  };

  const handleCast = () => {
    // Implement casting functionality
    if ('presentation' in navigator) {
      // Web Presentation API for Chromecast
      alert('Casting feature coming soon!');
    } else if ((navigator as any).userAgent.includes('Safari')) {
      // AirPlay for iOS/macOS
      alert('Use AirPlay from the video controls');
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-0 pb-[56.25%] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-sm">Securing video access...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !videoAccess?.success) {
    return (
      <div className="relative w-full h-0 pb-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6 text-center">
          <Lock className="w-12 h-12 text-red-400" />
          <div>
            <h3 className="text-white font-semibold mb-2">Demo: Video Loading Issue</h3>
            <p className="text-gray-300 text-sm mb-2">{error || 'Video access failed'}</p>
            <p className="text-gray-400 text-xs mb-4">
              Exercise ID: {exerciseId} | Program: {programId}
            </p>
            <button
              onClick={requestSecureAccess}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Retry Video Load
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden group cursor-pointer"
      onMouseMove={showControlsTemporarily}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Secure YouTube iframe */}
      <iframe
        ref={iframeRef}
        className="absolute top-0 left-0 w-full h-full"
        src={videoAccess.embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        loading="eager"
        style={{ pointerEvents: 'auto' }}
      />

      {/* Loading overlay for iframe */}
      {!iframeLoaded && !iframeError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm">Loading secure video...</p>
          </div>
        </div>
      )}

      {/* Iframe error or locked video fallback */}
      {(iframeError || !isPlaying) && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
          <div className="text-white text-center p-6 max-w-sm">
            <h3 className="font-semibold mb-2">🔒 Video Playback Restricted</h3>
            <p className="text-sm text-gray-300 mb-4">
              This video cannot play in embedded mode due to YouTube restrictions.
            </p>
            <div className="space-y-3">
              <a 
                href="https://www.youtube.com/watch?v=VQiGJRBkkSQ&t=66s"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                🎬 Open Your Original Video
              </a>
              <p className="text-xs text-gray-400">
                (This opens the specific breathing exercise video you wanted)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security indicator */}
      <div className="absolute top-4 right-4 bg-green-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
        <Shield className="w-3 h-3" />
        Secure
      </div>

      {/* Session timer */}
      {sessionTimeRemaining && sessionTimeRemaining < 600000 && ( // Show when less than 10 minutes left
        <div className="absolute top-4 left-4 bg-orange-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
          Session: {formatTime(sessionTimeRemaining)}
        </div>
      )}

      {/* Custom Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 group-hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              <button onClick={restart} className="text-white hover:text-gray-300 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={handleCast} className="text-white hover:text-gray-300 transition-colors">
                <Cast className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <div className="flex-1 mx-4">
              <p className="text-white text-sm font-medium text-center truncate">{title}</p>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Access Token Info (Dev Mode) */}
        {process.env.NODE_ENV === 'development' && videoAccess.accessToken && (
          <div className="absolute bottom-20 left-4 bg-gray-800/90 text-white p-2 rounded text-xs max-w-xs">
            <div>Token: {videoAccess.accessToken.substring(0, 20)}...</div>
            <div>Expires: {new Date(videoAccess.expiresAt!).toLocaleTimeString()}</div>
          </div>
        )}
      </div>

      {/* Disable right-click context menu */}
      <div 
        className="absolute inset-0" 
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}