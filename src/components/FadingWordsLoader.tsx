import React, { useState, useEffect } from 'react';

const words = ['Selflove', 'Caring', 'Attention', 'Gratitude'];

interface FadingWordsLoaderProps {
  className?: string;
}

export const FadingWordsLoader: React.FC<FadingWordsLoaderProps> = ({ className = "" }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 700); // Keep the smooth fade out duration
      
    }, 1200); // Much faster word changes - every 1.2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div 
          className={`text-2xl font-semibold transition-opacity duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: '#F4415F' }}
        >
          {words[currentWordIndex]}
        </div>
      </div>
    </div>
  );
};