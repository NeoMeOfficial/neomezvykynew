import { useState, useEffect } from 'react';
import { BookOpen, Send, Check, Pencil, Lock } from 'lucide-react';
import GlassCard from '../GlassCard';
import { colors, iconContainer, innerGlass } from '../../../theme/warmDusk';
import { useSubscription } from '../../../contexts/SimpleSubscriptionContext';

/* ── Section Header (matches TodayOverview style) ──────────── */
function SectionHeader({ icon: Icon, label, color }: { icon: typeof BookOpen; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={iconContainer(color)}>
        <Icon size={16} style={{ color }} strokeWidth={2} />
      </div>
      <h3 className="text-[14px] font-semibold" style={{ color: colors.textPrimary }}>{label}</h3>
    </div>
  );
}

const PROMPTS = [
  'Za čo som dnes vďačná?',
  'Čo ma dnes potešilo?',
  'Čo by som zajtra zmenila?',
  'Ako sa cítim práve teraz?',
];

const DIARY_KEY = 'neome-diary-entries';

interface DiaryEntry { text: string; date: string; }

function loadTodayEntries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(DIARY_KEY);
    if (!raw) return [];
    const all: DiaryEntry[] = JSON.parse(raw);
    const todayPrefix = new Date().toISOString().slice(0, 10);
    return all.filter((e) => e.date.startsWith(todayPrefix));
  } catch { return []; }
}

function saveEntry(text: string): DiaryEntry {
  const entry: DiaryEntry = { text, date: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(DIARY_KEY);
    const all: DiaryEntry[] = raw ? JSON.parse(raw) : [];
    all.push(entry);
    localStorage.setItem(DIARY_KEY, JSON.stringify(all));
  } catch { localStorage.setItem(DIARY_KEY, JSON.stringify([entry])); }
  return entry;
}

function updateEntries(entries: DiaryEntry[]) {
  try {
    const raw = localStorage.getItem(DIARY_KEY);
    const all: DiaryEntry[] = raw ? JSON.parse(raw) : [];
    const todayPrefix = new Date().toISOString().slice(0, 10);
    const otherDays = all.filter((e) => !e.date.startsWith(todayPrefix));
    localStorage.setItem(DIARY_KEY, JSON.stringify([...otherDays, ...entries]));
  } catch { /* noop */ }
}

export default function ReflectionSection() {
  const { tier } = useSubscription();
  const isPremium = tier !== 'free';
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);
  const [showPaywallMsg, setShowPaywallMsg] = useState(false);
  const [todayEntries, setTodayEntries] = useState<DiaryEntry[]>([]);
  const [editing, setEditing] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => { setTodayEntries(loadTodayEntries()); }, []);

  // Cycle through prompts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isDone = todayEntries.length > 0 && !editing;

  const handleSave = () => {
    if (!reflection.trim()) return;
    if (!isPremium) {
      // Free users: don't save, show paywall message
      setShowPaywallMsg(true);
      setTimeout(() => setShowPaywallMsg(false), 6000);
      return;
    }
    const entry = saveEntry(reflection.trim());
    setTodayEntries((prev) => [...prev, entry]);
    setReflection('');
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <GlassCard className="!p-5" style={isDone ? { opacity: 0.85 } : {}}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isDone ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: colors.strava, boxShadow: `0 2px 8px ${colors.strava}30` }}>
              <Check size={16} color="#fff" strokeWidth={2.5} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={iconContainer(colors.mysel)}>
              <BookOpen size={16} style={{ color: colors.mysel }} strokeWidth={2} />
            </div>
          )}
          <h3 className="text-[14px] font-semibold" style={{
            color: isDone ? colors.textTertiary : colors.textPrimary,
          }}>
            Reflexia
          </h3>
          {isDone && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ color: colors.strava, background: `${colors.strava}14` }}>
              {todayEntries.length}× dnes
            </span>
          )}
        </div>
        {isDone && (
          <button
            onClick={() => { setEditing(true); setReflection(''); }}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: `${colors.mysel}14` }}
          >
            <Pencil size={12} style={{ color: colors.mysel }} />
          </button>
        )}
      </div>

      {/* Done state — read-only entries */}
      {isDone && (
        <div className="space-y-2">
          {todayEntries.map((entry, i) => (
            <div key={i} className="rounded-xl p-3" style={innerGlass}>
              <p className="text-[13px] whitespace-pre-wrap" style={{ color: colors.textSecondary }}>{entry.text}</p>
              <p className="text-[10px] mt-1" style={{ color: colors.textTertiary }}>
                {new Date(entry.date).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Active state — form */}
      {!isDone && (
        <>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder={PROMPTS[currentPromptIndex]}
            className="w-full rounded-2xl p-3 text-[13px] outline-none resize-none h-20 mb-2"
            style={{
              ...innerGlass,
              color: colors.textPrimary,
              border: '1px dashed rgba(0,0,0,0.06)',
            }}
          />

          {/* Prompt pills removed - questions now only in placeholder */}

          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            style={saved
              ? { background: `${colors.strava}18`, color: colors.strava }
              : { background: `${colors.mysel}18`, color: colors.textPrimary, border: `1px solid ${colors.mysel}20` }}
          >
            {saved ? '✓ Uložené' : <><Send size={12} /> Uložiť zápis</>}
          </button>

          {/* Paywall message for free users */}
          {showPaywallMsg && (
            <div className="mt-2 rounded-xl p-3" style={{ background: `${colors.accent}10`, border: `1px solid ${colors.accent}30` }}>
              <div className="flex items-start gap-2">
                <Lock size={14} style={{ color: colors.accent }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold mb-1" style={{ color: colors.accent }}>Reflexia nebola uložená</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                    Pravidelné písanie reflexií preukázateľne znižuje stres a zvyšuje emocionálnu inteligenciu. Aktivuj NeoMe predplatné a každú reflexiu si uchovaj navždy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Show previous entries while editing */}
          {todayEntries.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-[11px] font-medium" style={{ color: colors.textTertiary }}>Predchádzajúce záznamy</p>
              {todayEntries.map((entry, i) => (
                <div key={i} className="rounded-xl p-3" style={innerGlass}>
                  <p className="text-[13px] whitespace-pre-wrap" style={{ color: colors.textSecondary }}>{entry.text}</p>
                  <p className="text-[10px] mt-1" style={{ color: colors.textTertiary }}>
                    {new Date(entry.date).toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
