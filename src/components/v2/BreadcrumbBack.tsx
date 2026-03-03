import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BreadcrumbBackProps {
  to: string;
  label: string;
  className?: string;
}

export default function BreadcrumbBack({ to, label, className = '' }: BreadcrumbBackProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={`flex items-center gap-2 py-2 px-1 text-sm font-medium transition-colors hover:opacity-70 ${className}`}
      style={{ color: '#6B4C3B' }}
    >
      <ChevronLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}