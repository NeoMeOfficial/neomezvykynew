import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { CustomSlider } from './CustomSlider';
import { Habit } from '@/hooks/useCodeBasedHabits';

interface HabitCardProps {
  habit: Habit;
  progress: number;
  streak: number;
  onProgressChange: (value: number) => void;
  onFirstInteraction?: () => void;
  isAnimating?: boolean;
}

export const HabitCard = memo<HabitCardProps>(({ 
  habit, 
  progress,
  streak,
  onProgressChange,
  onFirstInteraction,
  isAnimating = false
}) => {
  const isCompleted = progress >= habit.target;
  
  return (
    <div 
      className={`transition-all duration-500 ease-out ${
        isAnimating ? 'transform translate-y-2 opacity-50' : ''
      } ${isCompleted ? 'opacity-80' : ''}`}
    >
      <div
        className={`w-full p-2 rounded-xl border ${
          isCompleted 
            ? 'bg-background text-muted-foreground border-border'
            : 'text-foreground border-border'
        }`}
        style={{
          backgroundImage: !isCompleted ? `linear-gradient(to right, white, ${habit.color}20)` : undefined,
          borderColor: !isCompleted ? `${habit.color}23` : undefined
        }}
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-xl">{habit.emoji}</span>
              <div className="text-left flex-1">
                <div className={`font-medium text-mobile-lg md:text-base ${isCompleted ? 'line-through' : ''}`}>
                  {habit.name}
                </div>
                <div className="text-mobile-sm md:text-sm text-muted-foreground">
                  Cieľ: {habit.target} {habit.unit}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-mobile-lg md:text-lg font-bold">
                {habit.name === 'Hydratácia' ? Number(progress).toFixed(1) : Math.round(Number(progress))} {habit.unit}
              </div>
              {isCompleted && streak > 0 && (
                <div className="flex items-center justify-center gap-1 text-amber-700">
                  <span aria-hidden className="text-sm">🏆</span>
                  <span className="font-medium text-mobile-sm md:text-sm">
                    {streak} {streak > 1 ? 'dní' : 'deň'} série!
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full space-y-2">
            <CustomSlider
              value={[progress]}
              onValueChange={(value) => {
                onFirstInteraction?.();
                onProgressChange(value[0]);
              }}
              max={habit.target}
              step={habit.name === 'Pohyb' ? 500 : habit.name === 'Hydratácia' ? 0.1 : 0.5}
              accentColor={habit.color}
              className="w-full"
            />
            
          </div>
        </div>
      </div>
    </div>
  );
});