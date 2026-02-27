import { useState, useEffect } from 'react';
import { colors } from '../../../theme/warmDusk';

interface SectionGuideProps { id: string; text: string; }

export default function SectionGuide({ id, text }: SectionGuideProps) {
  const key = `neome_guide_dismissed_${id}`;
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(!localStorage.getItem(key)); }, [key]);
  if (!visible) return null;

  return (
    <div className="flex items-start justify-between gap-2 px-1 py-2 mb-2">
      <p className="text-xs leading-relaxed flex-1" style={{ color: colors.textTertiary }}>{text}</p>
      <button
        onClick={() => { localStorage.setItem(key, '1'); setVisible(false); }}
        className="text-[10px] font-medium whitespace-nowrap shrink-0 mt-0.5"
        style={{ color: colors.telo }}
      >
        Už to poznám ✓
      </button>
    </div>
  );
}
