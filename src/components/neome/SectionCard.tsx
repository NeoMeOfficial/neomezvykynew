import React from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  onClick?: () => void;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  imageUrl,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full h-52 rounded-2xl overflow-hidden shadow-neome group ${className}`}
    >
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
        <h3 className="text-white font-lufga font-semibold text-xl leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/80 font-lufga text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </button>
  );
};

export default SectionCard;
