import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import EmptyStateDiary from '../../components/v2/EmptyStateDiary';
import { colors, glassCard } from '../../theme/warmDusk';

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
        const raw = e.date || e.timestamp || e.createdAt || '';
        const date = raw.length >= 10 ? raw.slice(0, 10) : (raw || 'Neznámy dátum');
        if (!groups[date]) groups[date] = [];
        groups[date].push(e);
      }
      return groups;
    } catch {
      return {};
    }
  }, []);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen px-4 pt-5 pb-8 space-y-4" style={{ background: colors.bgGradient }}>
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center gap-3">
        <button onClick={() => navigate('/kniznica')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
        </button>
        <h1 className="text-[22px] font-medium leading-tight text-[#2E2218]" style={{ fontFamily: '"Bodoni Moda", Georgia, serif' }}>Osobný denník</h1>
      </div>

      {sortedDates.length === 0 ? (
        <EmptyStateDiary onCreateEntry={() => console.log('Creating diary entry...')} />
      ) : (
        sortedDates.map(date => (
          <GlassCard key={date}>
            <p className="text-[15px] font-semibold text-[#2E2218] mb-3">{formatDateLabel(date)}</p>
            <div className="space-y-3">
              {grouped[date].map((entry, i) => (
                <div key={i}>
                  {i > 0 && <div className="border-t border-[#D0BCA8] my-2" />}
                  <p className="text-[12px] text-[#888] mb-1">
                    {(entry.date || entry.timestamp || entry.createdAt)
                      ? new Date(entry.date || entry.timestamp || entry.createdAt!).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </p>
                  <p className="text-[13px] text-[#8B7560] leading-relaxed whitespace-pre-wrap">
                    {entry.text || entry.content || ''}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        ))
      )}
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
