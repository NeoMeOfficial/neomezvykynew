import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCycleData } from '../../features/cycle/useCycleData';
import { Page, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Cyklus log — R11 sheet (rendered as full-page screen here)
 *
 * Today's record. Sections: Krvácanie / Symptómy / Nálada / Energia
 * / Spánok / Hlien · plodnosť / Poznámka. Each section uses its
 * pillar-locked color (Krvácanie+Symptómy = TERRA, Nálada = MAUVE,
 * Energia = GOLD, Spánok = DUSTY, Mucus/fertility = SAGE).
 *
 * Wired:
 * - Header date + phase from useCycleData.derivedState
 *
 * FEATURE-NEEDED-PERIODKA-SYMPTOMS / -CYKLUS-LOG-PERSIST: full-row
 * persistence (flow / symptoms / mood / energy / sleep / mucus /
 * note / custom fields) into a `cycle_logs` table keyed by date.
 * Currently selections are local state only — Uložiť navigates back
 * but doesn't persist. Listed in FEATURES_TO_BUILD as part of F-004.
 *
 * Behavior rule (BC-2): once persisted, the log feeds into a cross-
 * pillar nudge router (Telo / Strava / Myseľ recommendations).
 *
 * Mounted at /kniznica/periodka/log.
 */

const FLOWS = [
  { id: 'none', t: 'Žiadny', desc: 'bez krvácania', level: 0 },
  { id: 'light', t: 'Slabý', desc: 'prvé dni', level: 1 },
  { id: 'medium', t: 'Stredný', desc: 'obyčajný', level: 2 },
  { id: 'heavy', t: 'Silný', desc: 'vrchol', level: 3 },
] as const;

const SYMPTOMS = ['Kŕče', 'Bolesť hlavy', 'Nafukovanie', 'Bolesť chrbta', 'Citlivé prsia', 'Akné', 'Závraty', 'Nevôľnosť'] as const;
const MOODS = ['Pokoj', 'Radosť', 'Uzemnená', 'Únava', 'Podráždenie', 'Hĺbka', 'Nepokoj', 'Vďaka'] as const;
const SLEEP = ['Zlý', 'Slabý', 'OK', 'Dobrý', 'Výborný'] as const;
const MUCUS = ['Suchý', 'Lepkavý', 'Krémový', 'Vaječný', 'Vodný'] as const;

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'] as const;
const SK_MONTHS = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'] as const;
const PHASE_LABEL: Record<string, string> = {
  menstrual: 'Menštruačná fáza',
  follicular: 'Folikulárna fáza',
  ovulation: 'Ovulácia',
  luteal: 'Luteálna fáza',
};

function energyLabel(v: number): string {
  if (v < 33) return 'Nízka';
  if (v < 66) return 'Stredná';
  return 'Vyššia';
}

export default function CyklusLog() {
  const navigate = useNavigate();
  const { derivedState } = useCycleData();
  const today = derivedState?.today ?? new Date();
  const dateLabel = `${SK_DAYS[today.getDay()]} · ${today.getDate()}. ${SK_MONTHS[today.getMonth()]}`;
  const phaseLabel = derivedState?.currentPhase ? PHASE_LABEL[derivedState.currentPhase.key] : 'Folikulárna fáza';

  const [flow, setFlow] = useState<string>('medium');
  const [symptoms, setSymptoms] = useState<Set<string>>(new Set(['Kŕče', 'Nafukovanie']));
  const [moods, setMoods] = useState<Set<string>>(new Set(['Radosť', 'Únava']));
  const [energy, setEnergy] = useState<number>(68);
  const [sleep, setSleep] = useState<string>('OK');
  const [mucus, setMucus] = useState<string>('Krémový');
  const [note, setNote] = useState<string>('');

  const toggle = (set: Set<string>, fn: (s: Set<string>) => void) => (k: string) => {
    const next = new Set(set);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    fn(next);
  };

  const onSave = () => {
    // FEATURE-NEEDED-PERIODKA-SYMPTOMS — currently navigate back only
    navigate('/kniznica/periodka');
  };

  return (
    <Page paddingBottom={40}>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, fontWeight: 400, padding: 6 }}>
          Zrušiť
        </button>
        <Eye>Dnešný záznam</Eye>
        <button onClick={onSave} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.MAUVE, fontWeight: 500, padding: 6 }}>
          Uložiť
        </button>
      </div>

      <div style={{ padding: '0 18px' }}>
        <Ser size={28}>
          Ako sa dnes
          <br />
          <em style={{ color: NM.MAUVE, fontStyle: 'italic', fontWeight: 500 }}>cítiš</em>?
        </Ser>
        <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.EYEBROW, marginTop: 6, fontWeight: 400 }}>
          {dateLabel} · {phaseLabel}
        </div>
      </div>

      {/* Flow */}
      <div style={{ margin: '24px 18px 0' }}>
        <Eye size={10} color={NM.TERRA} style={{ marginBottom: 10 }}>Krvácanie</Eye>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {FLOWS.map((f) => {
            const sel = flow === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFlow(f.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '12px 6px',
                  borderRadius: 14,
                  background: sel ? NM.TERRA : '#fff',
                  color: sel ? '#fff' : NM.DEEP,
                  border: sel ? 'none' : `1px solid ${NM.HAIR_2}`,
                  textAlign: 'center' as const,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 10,
                        borderRadius: 99,
                        margin: '0 1.5px',
                        background: sel ? (i < f.level + 1 ? '#fff' : 'rgba(255,255,255,0.3)') : i < f.level + 1 ? NM.TERRA : NM.HAIR_2,
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11.5, fontWeight: 500 }}>{f.t}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptoms */}
      <div style={{ margin: '22px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <Eye size={10} color={NM.TERRA}>Symptómy</Eye>
          <div style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.TERTIARY, fontWeight: 400 }}>{symptoms.size} {symptoms.size === 1 ? 'vybraný' : 'vybrané'}</div>
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {SYMPTOMS.map((s) => {
            const sel = symptoms.has(s);
            return (
              <button
                key={s}
                onClick={() => toggle(symptoms, setSymptoms)(s)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '8px 13px',
                  borderRadius: 999,
                  background: sel ? NM.TERRA : '#fff',
                  color: sel ? '#fff' : NM.DEEP,
                  border: sel ? 'none' : `1px solid ${NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood */}
      <div style={{ margin: '22px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <Eye size={10} color={NM.MAUVE}>Nálada</Eye>
          <div style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.TERTIARY, fontWeight: 400 }}>{moods.size} {moods.size === 1 ? 'vybraná' : 'vybrané'}</div>
        </div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {MOODS.map((m) => {
            const sel = moods.has(m);
            return (
              <button
                key={m}
                onClick={() => toggle(moods, setMoods)(m)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '8px 13px',
                  borderRadius: 999,
                  background: sel ? NM.MAUVE : '#fff',
                  color: sel ? '#fff' : NM.DEEP,
                  border: sel ? 'none' : `1px solid ${NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Energy */}
      <div style={{ margin: '22px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <Eye size={10} color={NM.GOLD}>Energia</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 16, color: NM.GOLD, fontWeight: 500, fontStyle: 'italic' }}>{energyLabel(energy)}</div>
        </div>
        <div style={{ padding: '14px 16px', background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}` }}>
          <input
            type="range"
            min={0}
            max={100}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            style={{ width: '100%', accentColor: NM.GOLD }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: NM.SANS, fontSize: 10, color: NM.TERTIARY, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500 }}>
            <span>Nízka</span>
            <span>Stredná</span>
            <span>Vysoká</span>
          </div>
        </div>
      </div>

      {/* Sleep */}
      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} color={NM.DUSTY} style={{ marginBottom: 10 }}>Spánok</Eye>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
          {SLEEP.map((s) => {
            const sel = sleep === s;
            return (
              <button
                key={s}
                onClick={() => setSleep(s)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '10px 4px',
                  borderRadius: 12,
                  textAlign: 'center' as const,
                  background: sel ? NM.DUSTY : '#fff',
                  color: sel ? '#fff' : NM.DEEP,
                  border: sel ? 'none' : `1px solid ${NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mucus / fertility */}
      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} color={NM.SAGE} style={{ marginBottom: 10 }}>Hlien · plodnosť</Eye>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {MUCUS.map((m) => {
            const sel = mucus === m;
            return (
              <button
                key={m}
                onClick={() => setMucus(m)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '8px 13px',
                  borderRadius: 999,
                  background: sel ? NM.SAGE : '#fff',
                  color: sel ? '#fff' : NM.DEEP,
                  border: sel ? 'none' : `1px solid ${NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Poznámka</Eye>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Zaznamenaj čokoľvek čo cítiš…"
          style={{
            width: '100%',
            minHeight: 84,
            padding: '14px 16px',
            background: '#fff',
            borderRadius: 14,
            border: `1px solid ${NM.HAIR}`,
            fontFamily: NM.SANS,
            fontSize: 13,
            color: NM.DEEP,
            fontWeight: 400,
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <button
          onClick={onSave}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: NM.MAUVE,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Uložiť záznam
        </button>
      </div>
    </Page>
  );
}
