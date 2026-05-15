import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Eye, NM } from '../../components/v2/neome';
import { useMeditations } from '../../hooks/useMeditations';
import { useReflections } from '../../hooks/useDailyRituals';

/**
 * Myseľ landing — Round 20.
 *
 * Layout (top → bottom):
 *   1. Back-chip top bar
 *   2. Hero "Priestor pre seba." (mauve em)
 *   3. Daily reflection prompt card → /dennik/new
 *   4. "Dnešná meditácia" — featured image card with play CTA
 *   5. "Ďalej skús" — three meditation rows (mauve play disc, sage check)
 *   6. "Všetky meditácie · N" pill → /meditacie
 *   7. "Tvoje reflexie" — last 3 from useReflections, mauve date eyebrow
 */

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'] as const;
const PROMPTS = [
  'Za čo si dnes vďačná — aj keď je to len malý moment?',
  'Čo ti dnes dalo najviac energie?',
  'Kedy si sa dnes cítila najviac sama sebou?',
  'Čo ti dnes bolo najťažšie — a čo si urobila pre seba?',
  'Aký jeden pocit ťa dnes prekvapil?',
];
function dayPromptIndex(d = new Date()): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000) % PROMPTS.length;
}

const MAUVE_100 = '#EFE4E6';

export default function MyselNew() {
  const navigate = useNavigate();
  const { meditations } = useMeditations();
  const { entries } = useReflections();

  const today = new Date();
  const dateLabel = `${SK_DAYS[today.getDay()]} · ${today.getDate()}. ${today.getMonth() + 1}.`;
  const prompt = PROMPTS[dayPromptIndex(today)];

  const featured = meditations[0];
  const featuredTitle = featured?.title ?? 'Ticho pred dňom';
  const featuredDur = featured ? Math.round(featured.duration_sec / 60) : 10;
  const featuredEyebrow = `${featured?.eyebrow ?? 'Ranná meditácia'} · ${featuredDur} min`;
  const featuredImg = featured?.thumb_url || '/images/r9/testimonial-meditation.jpg';

  const list = meditations.slice(1, 4);

  const reflections = useMemo(() => {
    return entries.slice(0, 3).map((e) => {
      const raw = e.created_at || e.date || '';
      const d = raw ? new Date(raw) : new Date();
      return {
        id: e.id,
        d: `${d.getDate()}. ${d.getMonth() + 1}.`,
        body: e.text || '',
      };
    });
  }, [entries]);

  return (
    <Page paddingBottom={120}>
      <TopBar title="Myseľ" onBack={() => navigate('/kniznica')} />

      {/* Hero */}
      <div style={{ padding: '8px 22px 0' }}>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: 40,
            color: NM.DEEP,
            lineHeight: 1.04,
            letterSpacing: '-0.01em',
          }}
        >
          Priestor{' '}
          <em style={{ color: NM.MAUVE, fontWeight: 400 }}>pre seba.</em>
        </div>
        <div
          style={{
            marginTop: 14,
            maxWidth: 320,
            fontFamily: NM.SANS,
            fontSize: 14,
            color: NM.MUTED,
            fontWeight: 300,
            lineHeight: 1.55,
          }}
        >
          Meditácie pre ranné stíšenie aj večerný oddych. Reflexie, keď potrebuješ niekoho vypočuť.
        </div>
      </div>

      {/* Daily reflection prompt */}
      <div style={{ padding: '24px 18px 0' }}>
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '18px 20px',
            border: `1px solid ${NM.HAIR}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Eye color={NM.GOLD} size={10}>Dnešné zamyslenie</Eye>
            <Eye size={10}>{dateLabel}</Eye>
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: NM.SERIF,
              fontSize: 20,
              color: NM.DEEP,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}
          >
            {prompt}
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => navigate('/dennik/new')}
              style={{
                background: NM.DEEP,
                color: '#fff',
                border: 0,
                padding: '11px 20px',
                borderRadius: 999,
                fontFamily: NM.SANS,
                fontSize: 12.5,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Napísať záznam
            </button>
            <span style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, fontWeight: 300 }}>
              ~3 minúty
            </span>
          </div>
        </div>
      </div>

      <SectionHeader>Dnešná meditácia</SectionHeader>

      {/* Featured meditation */}
      <div style={{ padding: '0 18px' }}>
        <button
          onClick={() => featured && navigate(`/meditacia/${featured.id}`)}
          style={{
            position: 'relative',
            borderRadius: 22,
            overflow: 'hidden',
            height: 220,
            width: '100%',
            border: 0,
            cursor: 'pointer',
            padding: 0,
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%), url(${featuredImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'block',
          }}
        >
          <div style={{ position: 'absolute', top: 16, left: 18 }}>
            <Eye color="rgba(255,255,255,0.9)" size={9.5}>{featuredEyebrow}</Eye>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 18,
              right: 18,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: NM.SERIF,
                fontSize: 26,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                maxWidth: 220,
                textAlign: 'left',
              }}
            >
              {featuredTitle}
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: '#fff',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={NM.DEEP}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <SectionHeader right="Knižnica meditácií" onRightClick={() => navigate('/meditacie')}>
        Ďalej skús
      </SectionHeader>

      <div style={{ padding: '0 18px' }}>
        {list.length === 0 ? (
          <FallbackRows />
        ) : (
          list.map((m, i) => (
            <MedRow
              key={m.id}
              eye={`${m.eyebrow ?? m.category} · ${Math.round(m.duration_sec / 60)} min`}
              title={m.title}
              done={false}
              last={i === list.length - 1}
              onClick={() => navigate(`/meditacia/${m.id}`)}
            />
          ))
        )}
      </div>

      {/* Library CTA pill */}
      <div style={{ padding: '16px 18px 0' }}>
        <button
          onClick={() => navigate('/meditacie')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderRadius: 18,
            background: '#FFFFFF',
            border: `1px solid ${NM.HAIR_2}`,
            cursor: 'pointer',
            fontFamily: NM.SANS,
            fontSize: 13,
            color: NM.DEEP,
            fontWeight: 500,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={NM.MAUVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16v16H4z" />
              <path d="M12 4v16" />
            </svg>
            Všetky meditácie{meditations.length ? ` · ${meditations.length}` : ''}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NM.MAUVE} strokeWidth="2" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <SectionHeader right="História" onRightClick={() => navigate('/kniznica/dennik')}>
        Tvoje reflexie
      </SectionHeader>

      {/* Reflection previews */}
      <div style={{ padding: '0 18px' }}>
        {reflections.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${NM.HAIR}`,
              padding: '18px 20px',
              fontFamily: NM.SANS,
              fontSize: 12.5,
              color: NM.MUTED,
              fontWeight: 300,
              lineHeight: 1.55,
            }}
          >
            Tvoje reflexie sa objavia tu, keď napíšeš prvý záznam.
          </div>
        ) : (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${NM.HAIR}`,
              overflow: 'hidden',
            }}
          >
            {reflections.map((r, i) => (
              <div
                key={r.id}
                style={{
                  padding: '14px 18px',
                  borderBottom: i < reflections.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                }}
              >
                <Eye color={NM.MAUVE} size={9.5}>{r.d}</Eye>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: NM.SANS,
                    fontSize: 12.5,
                    color: NM.MUTED,
                    fontWeight: 300,
                    lineHeight: 1.55,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {r.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div
      style={{
        padding: 'calc(env(safe-area-inset-top) + 14px) 20px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button
        onClick={onBack}
        aria-label="Späť"
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: '#FFFFFF',
          border: `1px solid ${NM.HAIR_2}`,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div
        style={{
          fontFamily: NM.SERIF,
          fontSize: 20,
          color: NM.DEEP,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
    </div>
  );
}

function SectionHeader({
  children,
  right,
  onRightClick,
}: {
  children: React.ReactNode;
  right?: string;
  onRightClick?: () => void;
}) {
  return (
    <div
      style={{
        padding: '28px 22px 12px',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}
    >
      <Eye>{children}</Eye>
      {right && (
        <button
          onClick={onRightClick}
          style={{
            background: 'transparent',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: NM.SANS,
            fontSize: 11,
            color: NM.MAUVE,
            fontWeight: 500,
          }}
        >
          {right}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NM.MAUVE} strokeWidth="2" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

function MedRow({
  eye,
  title,
  done,
  last,
  onClick,
}: {
  eye: string;
  title: string;
  done?: boolean;
  last?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        background: '#FFFFFF',
        borderRadius: 18,
        border: `1px solid ${NM.HAIR}`,
        marginBottom: last ? 0 : 10,
        width: '100%',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          background: MAUVE_100,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={NM.MAUVE}>
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Eye size={9.5}>{eye}</Eye>
        <div
          style={{
            marginTop: 4,
            fontFamily: NM.SERIF,
            fontSize: 16,
            color: NM.DEEP,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
      </div>
      {done ? (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: NM.SAGE,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NM.TERTIARY} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}

function FallbackRows() {
  return (
    <>
      <MedRow eye="Emócie · 12 min" title="Upokojenie úzkosti" done />
      <MedRow eye="Večer · 15 min" title="Dych pre spánok" />
      <MedRow eye="Telo · 8 min" title="Prijatie tela" last />
    </>
  );
}
