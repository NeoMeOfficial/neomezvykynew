import React from 'react';
import { Check } from 'lucide-react';

interface SuccessIndicatorProps {
  show: boolean;
}

export const SuccessIndicator: React.FC<SuccessIndicatorProps> = ({ show }) => {
  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        show 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <div className="bg-green-500 text-white rounded-full p-3 shadow-lg">
        <Check size={24} className="stroke-[3]" />
      </div>
    </div>
  );
};