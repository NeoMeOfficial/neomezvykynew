import { useState } from 'react';
import { Check, Clock, Trophy } from 'lucide-react';
import { useWorkoutHistory } from '../../../hooks/useWorkoutHistory';
import { useBuddySystem } from '../../../hooks/useBuddySystem';
import { colors, glassCard } from '../../theme/warmDusk';

interface CompleteWorkoutButtonProps {
  workoutId: string | number;
  workoutTitle: string;
  workoutType: 'telo' | 'strava' | 'mysel';
  duration?: number; // in minutes
  program?: string;
  metadata?: any;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onComplete?: (session: any) => void;
}

export default function CompleteWorkoutButton({
  workoutId,
  workoutTitle,
  workoutType,
  duration = 30,
  program,
  metadata,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onComplete
}: CompleteWorkoutButtonProps) {
  const { completeWorkout, isLoading } = useWorkoutHistory();
  const { notifyBuddy } = useBuddySystem();
  const [justCompleted, setJustCompleted] = useState(false);

  const handleComplete = async () => {
    if (isLoading || disabled || justCompleted) return;

    try {
      const session = await completeWorkout(
        workoutId,
        workoutTitle,
        workoutType,
        duration,
        program,
        metadata
      );

      // Notify buddies about the completed workout
      await notifyBuddy(
        'workout_complete',
        `dokončila cvičenie "${workoutTitle}" (${duration} min)`,
        { 
          workoutType, 
          duration, 
          program,
          workoutTitle 
        }
      );

      setJustCompleted(true);
      
      // Reset the completed state after 3 seconds
      setTimeout(() => {
        setJustCompleted(false);
      }, 3000);

      if (onComplete && session) {
        onComplete(session);
      }
    } catch (error) {
      console.error('Failed to complete workout:', error);
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const isMeditation = workoutType === 'mysel';
  const completedBg = isMeditation ? 'rgba(168,132,139,0.15)' : 'rgba(122,158,120,0.15)';
  const completedTextColor = isMeditation ? '#A8848B' : '#7A9E78';

  const variantClasses = {
    primary: justCompleted
      ? 'text-white border-0'
      : 'bg-[#7A9E78] text-white border-[#6B8B68] hover:bg-[#6B8B68]',
    secondary: justCompleted
      ? 'border-0'
      : 'bg-white/30 text-[#6B4C3B] border-white/40 hover:bg-white/50',
    success: 'text-white border-0'
  };

  const currentVariant = justCompleted ? 'success' : variant;

  if (justCompleted) {
    return (
      <button
        disabled={true}
        className={`
          ${sizeClasses[size]}
          rounded-xl font-semibold backdrop-blur-[20px]
          transition-all duration-300 flex items-center justify-center gap-2
          opacity-90 cursor-not-allowed
        `}
        style={{ background: completedBg, color: completedTextColor }}
      >
        <Check size={size === 'lg' ? 24 : size === 'md' ? 20 : 16} />
        <span>Dokončené!</span>
        <Trophy size={size === 'lg' ? 20 : size === 'md' ? 16 : 14} className="animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={disabled || isLoading}
      className={`
        ${sizeClasses[size]} ${variantClasses[currentVariant]}
        rounded-xl font-semibold border backdrop-blur-[20px]
        transition-all duration-300 flex items-center justify-center gap-2
        ${disabled || isLoading 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
        }
      `}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Ukladám...</span>
        </>
      ) : (
        <>
          <Check size={size === 'lg' ? 24 : size === 'md' ? 20 : 16} />
          <span>{isMeditation ? 'Dokončiť meditáciu' : 'Dokončiť cvičenie'}</span>
          <Clock size={size === 'lg' ? 20 : size === 'md' ? 16 : 14} className="opacity-70" />
        </>
      )}
    </button>
  );
}