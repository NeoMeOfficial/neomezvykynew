import { useNavigate } from 'react-router-dom';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Myseľ — R3 hub
 *
 * Editorial header, "Dnešné zamyslenie" reflection prompt, featured
 * meditation full-bleed card, short meditation list, recent reflections.
 *
 * TODO data: meditation list from existing media catalog, reflections
 * from diary table.
 *
 * Old version: MyselNew.old.tsx.
 */

const MEDITATIONS = [
  { id: 'upokojenie', name: 'Upokojenie úzkosti', dur: '12 min', cat: 'Emócie', done: true },
  { id: 'spanok', name: 'Dych pre spánok', dur: '15 min', cat: 'Večer', done: false },
  { id: 'prijatie', name: 'Prijatie tela', dur: '8 min', cat: 'Telo', done: false },
];

export default function MyselNew() {
  const navigate = useNavigate();
  const today = new Date();
  const dateLabel = `${['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'][today.getDay()]} · ${today.getDate()}. ${today.getMonth() + 1}.`;

  return (
    <Page>
      <BackHeader title="Myseľ" showSearch={false} />

      <div style={{ padding: '6px 24px 24px' }}>
        <Eye color={NM.SAGE} style={{ marginBottom: 10 }}>Ticho · prítomnosť · slová</Eye>
        <Ser size={32} style={{ lineHeight: 1.04, marginBottom: 12 }}>
          Priestor
          <br />
          pre seba.
        </Ser>
        <Body style={{ maxWidth: 310 }}>Meditácie pre ranné stíšenie aj večerný oddych. Reflexie, keď potrebuješ niekoho vypočuť — aj keď si to ty sama.</Body>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ background: NM.CREAM_2 ?? '#F1ECE3', borderRadius: 18, padding: '22px 22px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <Eye color={NM.GOLD}>Dnešné zamyslenie</Eye>
            <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.TERTIARY }}>{dateLabel}</div>
          </div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 400, color: NM.DEEP, letterSpacing: '-0.008em', lineHeight: 1.25, marginBottom: 20 }}>
            Za čo si dnes vďačná — aj keď je to len malý moment?
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => navigate('/dennik')}
              style={{
                padding: '10px 18px',
                background: NM.DEEP,
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: NM.SANS,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            >
              Napísať
            </button>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED }}>~3 minúty</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <Eye>Meditácie</Eye>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>Všetko · 28</div>
      </div>

      <div style={{ padding: '0 24px 16px' }}>
        <button
          onClick={() => navigate('/meditacie')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            borderRadius: 18,
            overflow: 'hidden',
            aspectRatio: '16/10',
            backgroundImage: 'url(/images/r9/section-mind.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 100%)' }} />
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 18, color: '#fff' }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
              Ranná meditácia · 10 min
            </div>
            <div style={{ fontFamily: NM.SERIF, fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.05, marginBottom: 14 }}>
              Ticho pred dňom
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill={NM.DEEP}>
                <path d="M3 2l9 5-9 5V2z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <div style={{ padding: '8px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {MEDITATIONS.map((m) => (
          <button
            key={m.id}
            onClick={() => navigate(`/meditation-player/${m.id}`)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              width: '100%',
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 14, background: NM.CREAM_3 ?? '#EAE3D6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11v0M7 8v6M10 5v12M13 8v6M16 10v2M19 11v0" stroke={NM.DEEP} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <Eye size={9} style={{ marginBottom: 4 }}>
                {m.cat} · {m.dur}
              </Eye>
              <div style={{ fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{m.name}</div>
            </div>
            {m.done && (
              <div style={{ width: 22, height: 22, borderRadius: 999, background: NM.SAGE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 24px 16px', borderTop: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Eye>Tvoje reflexie</Eye>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>24 zápisov</div>
      </div>

      <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { date: '11. 3.', prompt: 'Čo ti dnes dalo silu?', preview: 'Dlhá prechádzka s Luciou. Rozhovor o tom, že nemusím mať všetko pod kontrolou…' },
          { date: '10. 3.', prompt: 'Kedy si sa dnes cítila najviac sama sebou?', preview: 'Pri ranom pilatese. Bolo to len o mne a tele, bez nikoho kto ma pozoruje…' },
        ].map((r, i, arr) => (
          <div key={r.date} style={{ padding: '16px 0', borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Eye size={10}>{r.date}</Eye>
              <div style={{ width: 3, height: 3, borderRadius: 999, background: NM.TERTIARY }} />
              <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED }}>{r.prompt}</div>
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP, lineHeight: 1.5 }}>{r.preview}</div>
          </div>
        ))}
      </div>
    </Page>
  );
}
