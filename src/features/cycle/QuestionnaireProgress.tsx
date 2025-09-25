import React from 'react';

interface QuestionnaireProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export const QuestionnaireProgress: React.FC<QuestionnaireProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick
}) => {
  return (
    <div className="flex flex-col items-center gap-3 pb-4">
      {/* Dotted progress indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.includes(stepNumber);
          const isActive = stepNumber === currentStep;
          const isPending = stepNumber > currentStep && !isCompleted;
          
          return (
            <div
              key={stepNumber}
              className={`
                w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-pointer
                ${isCompleted 
                  ? 'bg-rose-400 border-rose-400 scale-90' 
                  : isActive 
                    ? 'bg-rose-400 border-rose-400 scale-110 shadow-lg' 
                    : 'bg-transparent border-rose-200 opacity-40'
                }
                ${onStepClick && (isCompleted || isActive) ? 'hover:scale-125' : ''}
              `}
              onClick={() => {
                if (onStepClick && (isCompleted || isActive)) {
                  onStepClick(stepNumber);
                }
              }}
              aria-label={`Step ${stepNumber} ${isCompleted ? 'completed' : isActive ? 'current' : 'pending'}`}
            />
          );
        })}
      </div>
      
      {/* Step counter */}
      <span className="text-sm font-medium" style={{ color: '#955F6A' }}>
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
};