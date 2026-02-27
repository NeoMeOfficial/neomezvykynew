import type { ReactNode, CSSProperties } from 'react';
import { glassCard } from '../../theme/warmDusk';

export default function GlassCard({
  children,
  className = '',
  onClick,
  style,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`p-5 ${className}`}
      style={{ ...glassCard, ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
