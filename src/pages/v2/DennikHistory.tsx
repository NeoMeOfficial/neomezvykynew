import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';

interface DiaryEntry {
  id?: string;
  date?: string;
  text?: string;
  content?: string;
  timestamp?: string;
  createdAt?: string;
}

export default function DennikHistory() {
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    try {
      const raw = localStorage.getItem('neome-diary-entries');
      if (!raw) return {};
      const entries: DiaryEntry[] = JSON.parse(raw);
      const groups: Record<string, DiaryEntry[]> = {};
      for (const e of entries) {
        const rawDate = e.date || e.timestamp || e.createdAt || '';
        const key = rawDate.length >= 10 ? rawDate.slice(0, 10) : (rawDate || 'Neznámy dátum');
        if (!groups[key]) groups[key] = [];
        groups[key].push(e);
      }
      return groups;
    } catch {
      return {};
    }
  }, []);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Osobný denník" backHref="/kniznica/dennik" right={
        <button
          onClick={() => navigate('/dennik/new')}
          className="h-9 w-9 rounded-full bg-white border border-ink/[0.08] flex items-center justify-center"
        >
          <PenLine className="size-4 text-ink/60" />
        </button>
      } />

      <div className="px-5 pt-2 pb-6 flex flex-col gap-3">
        {sortedDates.length === 0 ? (
          <div className="mt-12 text-center px-8">
            <div className="h-16 w-16 rounded-full bg-pillar-mysel/10 flex items-center justify-center mx-auto mb-4">
              <PenLine className="size-7 text-pillar-mysel" />
            </div>
            <SerifHeader as="h2" size="h2" className="mb-2">Ešte nič tu nie je</SerifHeader>
            <BodyText tone="secondary" className="mb-6 max-w-xs mx-auto">
              Začni písať — denník je tvoj priestor na reflexiu bez súdenia.
            </BodyText>
            <button
              onClick={() => navigate('/dennik/new')}
              className="px-6 py-3 bg-ink text-cream rounded-full font-sans text-sm font-medium"
            >
              Napísať prvý záznam
            </button>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-ink/[0.06]">
                <Eyebrow tone="muted">{formatDateLabel(date)}</Eyebrow>
              </div>
              {grouped[date].map((entry, i) => (
                <div key={i} className={`px-5 py-4 ${i < grouped[date].length - 1 ? 'border-b border-ink/[0.06]' : ''}`}>
                  {(entry.date || entry.timestamp || entry.createdAt) && (
                    <Eyebrow tone="muted" className="mb-1">
                      {new Date(entry.date || entry.timestamp || entry.createdAt!).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                    </Eyebrow>
                  )}
                  <BodyText size="sm" tone="secondary" className="whitespace-pre-wrap leading-relaxed">
                    {entry.text || entry.content || ''}
                  </BodyText>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatDateLabel(date: string): string {
  try {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('sk-SK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return date;
  }
}
