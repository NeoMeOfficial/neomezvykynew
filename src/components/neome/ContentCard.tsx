import React from "react";
import { Play, Clock } from "lucide-react";

interface ContentCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  type?: "video" | "article" | "recipe";
  duration?: string;
  onClick?: () => void;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  imageUrl,
  type = "article",
  duration,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-2xl shadow-neome overflow-hidden text-left transition-shadow hover:shadow-neome-lg ${className}`}
    >
      {imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          {type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-neome">
                <Play size={20} className="text-neome-primary ml-0.5" fill="currentColor" />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <h4 className="font-lufga font-semibold text-base text-neome-primary leading-snug">
          {title}
        </h4>
        {description && (
          <p className="font-lufga text-sm text-neome-primary/60 mt-1.5 line-clamp-2">
            {description}
          </p>
        )}
        {duration && (
          <div className="flex items-center gap-1 mt-3 text-neome-primary/50">
            <Clock size={14} />
            <span className="font-lufga text-xs">{duration}</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default ContentCard;
