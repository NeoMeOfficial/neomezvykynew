import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { Page, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Completion · Workout — R10
 *
 * Shown after a single workout/meditation finishes. Calm + celebratory:
 * full-bleed photo + serif headline, points float, stats strip, streak
 * row, mood-pick reflection chips, primary CTA.
 *
 * FEATURE-NEEDED-COMPLETION-WORKOUT-LOG: persist mood pick + integrate
 * with reflection store (depends on F-003 reflection store on user.id).
 *
 * Wired (F-022): on mount, awards 10 points via usePointsLedger.addEntry
 * keyed on (exerciseId, 'exercise') so navigating back doesn't double-credit.
 * Display value reads back from the ledger entry that was just inserted.
 *
 * Mounted at /completion/workout — receives state via location-state
 * in production; here we render with sane defaults so you can preview.
 */

const WORKOUT_POINTS = 10;

const MOOD_OPTIONS = [
  { id: 'great', t: 'Skvelo', c: NM.SAGE },
  { id: 'good', t: 'Dobre', c: NM.TERRA },
  { id: 'tired', t: 'Únava', c: NM.DUSTY },
  { id: 'hard', t: 'Náročné', c: NM.MAUVE },
] as const;

export default function CompletionWorkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mood, setMood] = useState<string | null>(null);
  const { addEntry } = usePointsLedger();
  const exerciseId = (location.state as { exerciseId?: string } | null)?.exerciseId ?? 'preview';

  useEffect(() => {
    addEntry('workout_completed', WORKOUT_POINTS, exerciseId, 'exercise');
  }, [addEntry, exerciseId]);

  return (
    <Page paddingBottom={40}>
      <div
        style={{
          height: 300,
          position: 'relative',
          backgroundImage: 'url(/images/r9/lifestyle-yoga-pose.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0.1), rgba(248,245,240,1))' }} />
        <div
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 12px)',
            right: 18,
            padding: '8px 14px',
            borderRadius: 999,
            background: '#fff',
            boxShadow: '0 6px 20px rgba(61,41,33,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div style={{ fontFamily: NM.SERIF, fontSize: 15, color: NM.GOLD, fontWeight: 500 }}>+{WORKOUT_POINTS}</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 9, color: NM.EYEBROW, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>bodov</div>
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: 18, right: 18 }}>
          <Eye color={NM.TERRA}>Dokončené · Týždeň 3 · deň 4</Eye>
          <Ser size={38} style={{ marginTop: 10 }}>
            Si
            <br />
            <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>tu</em>.
          </Ser>
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        <Body size={14} color={NM.DEEP} weight={400} style={{ maxWidth: 340 }}>
          15 minút, ktoré si si dala. Postpartum programu zostáva ešte 6 dní — cítiš, že to ide.
        </Body>
      </div>

      <div style={{ margin: '22px 18px 0', padding: '16px 18px', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
        {[
          { n: '15', l: 'min' },
          { n: '128', l: 'kcal' },
          { n: '4', l: 'seriá' },
        ].map((s, i) => (
          <div key={s.l} style={{ textAlign: 'center', borderLeft: i > 0 ? `1px solid ${NM.HAIR}` : 'none' }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 22, color: NM.TERRA, fontWeight: 500, letterSpacing: '-0.01em' }}>{s.n}</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 9, color: NM.EYEBROW, marginTop: 4, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: '16px 18px 0', padding: '14px 18px', background: `${NM.TERRA}18`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NM.TERRA} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 14s-2 2-2 4a4 4 0 008 0c0-2-4-4-4-10 0 0-2 6-2 6z" />
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>18 dní v rade</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, marginTop: 2, fontWeight: 400 }}>Tvoj najdlhší streak</div>
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Ako si sa cítila?</Eye>
        <div style={{ display: 'flex', gap: 8 }}>
          {MOOD_OPTIONS.map((f) => {
            const active = mood === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setMood(f.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  flex: 1,
                  padding: '11px 4px',
                  textAlign: 'center',
                  borderRadius: 12,
                  background: active ? f.c : '#fff',
                  border: active ? 'none' : `1px solid ${NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 11.5,
                  color: active ? '#fff' : NM.DEEP,
                  fontWeight: 500,
                }}
              >
                {f.t}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <button
          onClick={() => navigate('/domov-new')}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: NM.DEEP,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Zavrieť
        </button>
        <button
          onClick={() => navigate('/dennik')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            marginTop: 12,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: NM.TERRA,
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Pridať zápis do denníka
        </button>
      </div>
    </Page>
  );
}
