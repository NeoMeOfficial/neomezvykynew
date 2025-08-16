import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { CustomSlider } from './CustomSlider';
import { Habit } from '@/hooks/useHabits';

interface HabitCardProps {
  habit: Habit;
  progress: number;
  streak: number;
  onProgressChange: (value: number) => void;
  isAnimating?: boolean;
}

export const HabitCard = memo<HabitCardProps>(({ 
  habit, 
  progress,
  streak,
  onProgressChange,
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
        className={`w-full p-2 rounded-xl border-2 ${
          isCompleted 
            ? 'bg-background text-muted-foreground border-border'
            : 'text-foreground shadow-sm border-border'
        }`}
        style={{
          backgroundImage: !isCompleted ? `linear-gradient(to right, white, ${habit.color}20)` : undefined,
          borderColor: !isCompleted ? `${habit.color}30` : undefined
        }}
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-xl">{habit.emoji}</span>
              <div className="text-left flex-1">
                <div className={`font-medium text-sm ${isCompleted ? 'line-through' : ''}`}>
                  {habit.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Cieľ: {habit.target} {habit.unit}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">
                {habit.name === 'Hydratácia' ? Number(progress).toFixed(1) : Math.round(Number(progress))} {habit.unit}
              </div>
              {isCompleted && (
                <div 
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto mt-1"
                  style={{
                    borderColor: habit.color,
                    backgroundColor: habit.color
                  }}
                >
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full space-y-1">
            <CustomSlider
              value={[progress]}
              onValueChange={(value) => onProgressChange(value[0])}
              max={habit.target}
              step={habit.name === 'Pohyb' ? 500 : habit.name === 'Hydratácia' ? 0.1 : 0.5}
              accentColor={habit.color}
              className="w-full"
            />
            
            {streak > 0 && (
              <div className="flex items-center justify-center gap-1 text-amber-700">
                <span aria-hidden className="text-sm">🏆</span>
                <span className="font-medium text-xs">
                  {streak} {streak > 1 ? 'dní' : 'deň'} série!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});