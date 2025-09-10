import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CustomSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
  accentColor: string;
  emoji?: string;
  className?: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({ 
  value, 
  onValueChange, 
  max, 
  step, 
  accentColor,
  emoji, 
  className 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateValueFromClientX = useCallback((clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round((percentage * max) / step) * step;
    onValueChange([Math.min(max, Math.max(0, newValue))]);
  }, [max, step, onValueChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateValueFromClientX(e.clientX);
  }, [updateValueFromClientX]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    updateValueFromClientX(e.touches[0].clientX);
  }, [updateValueFromClientX]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updateValueFromClientX(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      updateValueFromClientX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as any);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, updateValueFromClientX]);

  const percentage = (value[0] / max) * 100;

  return (
    <div 
      ref={sliderRef}
      className={`relative flex w-full touch-none select-none items-center py-2 ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative h-3 w-full grow overflow-hidden rounded-full bg-muted shadow-sm">
        <div 
          className="absolute h-full rounded-full transition-all duration-200" 
          style={{ 
            backgroundColor: accentColor,
            width: `${percentage}%`
          }}
        />
      </div>
      <div 
        className="flex items-center justify-center h-7 w-7 rounded-full bg-background shadow-lg ring-offset-background transition-all hover:scale-110 cursor-pointer text-lg" 
        style={{ 
          borderColor: accentColor,
          left: `${percentage}%`,
          marginLeft: '-14px',
          position: 'absolute',
          border: emoji ? 'none' : `2px solid ${accentColor}`
        }}
      >
        {emoji || null}
      </div>
    </div>
  );
};