import React, { useState, useEffect } from 'react';

const words = ['Selflove', 'Caring', 'Attention', 'Gratitude'];

interface FadingWordsLoaderProps {
  className?: string;
}

export const FadingWordsLoader: React.FC<FadingWordsLoaderProps> = ({ className = "" }) => {
  const [visibleWords, setVisibleWords] = useState<boolean[]>(new Array(words.length).fill(false));

  useEffect(() => {
    // Start the sequential animation
    const timeouts: NodeJS.Timeout[] = [];
    
    words.forEach((_, index) => {
      // Stagger the start of each word's animation
      const startDelay = index * 300; // 300ms delay between each word starting
      
      const startTimeout = setTimeout(() => {
        setVisibleWords(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        
        // Each word stays visible for 2 seconds then fades out
        const hideTimeout = setTimeout(() => {
          setVisibleWords(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }, 2000);
        
        timeouts.push(hideTimeout);
      }, startDelay);
      
      timeouts.push(startTimeout);
    });
    
    // Restart the cycle after all words have finished
    const cycleTimeout = setTimeout(() => {
      setVisibleWords(new Array(words.length).fill(false));
      // Restart after a brief pause
      setTimeout(() => {
        words.forEach((_, index) => {
          const startDelay = index * 300;
          const startTimeout = setTimeout(() => {
            setVisibleWords(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            
            const hideTimeout = setTimeout(() => {
              setVisibleWords(prev => {
                const newState = [...prev];
                newState[index] = false;
                return newState;
              });
            }, 2000);
            
            timeouts.push(hideTimeout);
          }, startDelay);
          
          timeouts.push(startTimeout);
        });
      }, 500);
    }, words.length * 300 + 2500); // Wait for all words to complete + extra time
    
    timeouts.push(cycleTimeout);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {words.map((word, index) => (
          <div 
            key={word}
            className={`text-2xl font-semibold transition-opacity duration-700 ${
              visibleWords[index] ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ color: '#F4415F' }}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};