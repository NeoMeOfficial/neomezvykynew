import { Heart } from 'lucide-react';
import { useUniversalFavorites, ContentType } from '../../../hooks/useUniversalFavorites';
import { colors, glassCard } from '../../theme/warmDusk';

interface FavoriteButtonProps {
  itemId: string | number;
  type: ContentType;
  title: string;
  image?: string;
  duration?: string;
  kcal?: number;
  category?: string;
  program?: string;
  metadata?: any;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
  className?: string;
}

export default function FavoriteButton({
  itemId,
  type,
  title,
  image,
  duration,
  kcal,
  category,
  program,
  metadata,
  size = 'md',
  variant = 'default',
  className = ''
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoading } = useUniversalFavorites();
  
  const isLiked = isFavorite(itemId, type);
  
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await toggleFavorite({
      id: itemId,
      type,
      title,
      image,
      duration,
      kcal,
      category,
      program,
      metadata
    });
  };

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`${sizeClasses[size]} flex items-center justify-center transition-all ${className} ${
          isLiked 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500'
        } disabled:opacity-50`}
        aria-label={isLiked ? `Odstrániť ${title} z obľúbených` : `Pridať ${title} do obľúbených`}
      >
        <Heart 
          size={iconSizes[size]} 
          fill={isLiked ? 'currentColor' : 'none'} 
          className="transition-all"
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${sizeClasses[size]} rounded-full backdrop-blur-[20px] border transition-all ${className} ${
        isLiked
          ? 'bg-red-500/20 border-red-500/30 text-red-500 hover:bg-red-500/30'
          : 'bg-white/20 border-white/30 text-gray-600 hover:bg-white/30 hover:text-red-500'
      } disabled:opacity-50`}
      aria-label={isLiked ? `Odstrániť ${title} z obľúbených` : `Pridať ${title} do obľúbených`}
    >
      <Heart 
        size={iconSizes[size]} 
        fill={isLiked ? 'currentColor' : 'none'} 
        className="transition-all"
      />
    </button>
  );
}