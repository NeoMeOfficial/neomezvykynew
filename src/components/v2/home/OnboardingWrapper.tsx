import { useState, useEffect, type ReactNode } from 'react';
import GlassCard from '../GlassCard';
import { ChevronDown } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

const STORAGE_KEY = 'neome-onboarding-done';

interface Section {
  id: string;
  icon: string;
  name: string;
  description: string;
  children: ReactNode;
}

function CollapsibleSection({
  section,
  expanded,
  onToggle,
}: {
  section: Section;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <GlassCard className="!p-0 !mx-0 overflow-hidden !rounded-xl">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="text-lg">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#2E2218]">{section.name}</p>
          <p className="text-xs text-[#A0907E] mt-0.5 leading-relaxed">{section.description}</p>
        </div>
        <ChevronDown
          className="w-4 h-4 text-[#A0907E] shrink-0 transition-transform duration-200 ease-out"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="transition-all duration-200 ease-out"
        style={{
          maxHeight: expanded ? '2000px' : '0px',
          opacity: expanded ? 1 : 0,
          overflow: 'hidden',
        }}
      >
        <div className="px-4 pb-4">{section.children}</div>
      </div>
    </GlassCard>
  );
}

export function useOnboardingDone() {
  const [done, setDone] = useState(true); // default true to avoid flash
  useEffect(() => {
    setDone(!!localStorage.getItem(STORAGE_KEY));
  }, []);
  return done;
}

export default function OnboardingWrapper({ sections }: { sections: Section[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(!!localStorage.getItem(STORAGE_KEY));
  }, []);

  if (dismissed) return null;

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(sections.map((s) => s.id)));
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="space-y-3 -mx-1">
      <div className="space-y-3 px-1">
        <h1 className="text-lg font-semibold text-[#2E2218]">Spoznaj svoju domovskú stránku</h1>
        <button
          onClick={expandAll}
          className="w-full py-3 rounded-2xl bg-[#6B4C3B] text-white text-sm font-medium transition-all active:scale-[0.98]"
        >
          Preskúmať všetko
        </button>
      </div>

      {sections.map((section) => (
        <CollapsibleSection
          key={section.id}
          section={section}
          expanded={expandedIds.has(section.id)}
          onToggle={() => toggle(section.id)}
        />
      ))}

      <button
        onClick={dismiss}
        className="w-full py-3 rounded-2xl bg-[#6B4C3B]/8 text-sm font-medium text-[#6B4C3B] transition-all active:scale-[0.98]"
      >
        Už to poznám ✓
      </button>
    </div>
  );
}
