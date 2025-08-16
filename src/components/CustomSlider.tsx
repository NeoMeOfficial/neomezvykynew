import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CustomSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  step: number;
  accentColor: string;
  className?: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({ 
  value, 
  onValueChange, 
  max, 
  step, 
  accentColor, 
  className 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  }, []);

  const updateValue = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round((percentage * max) / step) * step;
    onValueChange([Math.min(max, Math.max(0, newValue))]);
  }, [max, step, onValueChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updateValue(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updateValue]);

  const percentage = (value[0] / max) * 100;

  return (
    <div 
      ref={sliderRef}
      className={`relative flex w-full touch-none select-none items-center py-2 ${className}`}
      onMouseDown={handleMouseDown}
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
        className="block h-6 w-6 rounded-full border-2 bg-background shadow-lg ring-offset-background transition-all hover:scale-110 cursor-pointer" 
        style={{ 
          borderColor: accentColor,
          left: `${percentage}%`,
          marginLeft: '-12px',
          position: 'absolute'
        }}
      />
    </div>
  );
};