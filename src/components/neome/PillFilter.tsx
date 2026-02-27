import React from "react";

interface PillFilterProps {
  options: string[];
  activeOption?: string;
  onSelect?: (option: string) => void;
  className?: string;
}

const PillFilter: React.FC<PillFilterProps> = ({
  options,
  activeOption,
  onSelect,
  className = "",
}) => {
  return (
    <div
      className={`flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1 ${className}`}
    >
      {options.map((option) => {
        const isActive = activeOption === option;
        return (
          <button
            key={option}
            onClick={() => onSelect?.(option)}
            className={`flex-shrink-0 px-5 py-2 rounded-full font-lufga text-sm font-medium transition-all ${
              isActive
                ? "bg-neome-primary text-white shadow-neome"
                : "bg-white text-neome-primary/70 hover:bg-neome-peach/40"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default PillFilter;
