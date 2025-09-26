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
      }, 300); // Half second for fade out
      
    }, 1500); // Change word every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div 
          className={`text-2xl font-semibold transition-opacity duration-300 ${
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