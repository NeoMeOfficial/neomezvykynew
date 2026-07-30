import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Eye, NM } from '../../components/v2/neome';
import { useMeditations } from '../../hooks/useMeditations';
import { useReflections } from '../../hooks/useDailyRituals';
import { useUniversalFavorites } from '../../hooks/useUniversalFavorites';
import { useSmartBack } from '../../hooks/useSmartBack';

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
  const smartBack = useSmartBack('/kniznica');
  const { meditations } = useMeditations();
  const { entries } = useReflections();
  const { getFavoriteCounts } = useUniversalFavorites();
  const favMeditations = getFavoriteCounts().meditation;

  const today = new Date();

  // Featured rotates daily — deterministic, same for every woman that day.
  const featured = meditations.length > 0
    ? meditations[Math.floor(Date.now() / 86_400_000) % meditations.length]
    : undefined;
  const [medCat, setMedCat] = useState<string | null>(null);
  const filteredMeds = meditations.filter((m) => medCat === null || m.category === medCat);
  const featuredTitle = featured?.title ?? 'Ticho pred dňom';
  const featuredDur = featured ? Math.round(featured.duration_sec / 60) : 10;
  const featuredEyebrow = `${featured?.eyebrow ?? 'Ranná meditácia'} · ${featuredDur} min`;
  const featuredImg = featured?.thumb_url || '/images/r9/testimonial-meditation.jpg';


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
      <TopBar title="Myseľ" onBack={smartBack} />

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
          Meditácie pre ranné nastavenie dňa aj večerné stíšenie a oddych. Sprítomni sa a skľudni svoju myseľ.
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

      {/* Category tabs + full list right under the featured pick */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '22px 18px 2px' }}>
        {([
          { label: 'Všetko', filter: null },
          { label: 'Pre mamičky', filter: 'Pre mamičky' },
          { label: 'Pre ženy', filter: 'Pre ženy' },
        ] as const).map((c) => {
          const active = medCat === c.filter;
          return (
            <button
              key={c.label}
              onClick={() => setMedCat(c.filter)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: 999,
                background: active ? NM.DEEP : '#fff',
                color: active ? '#fff' : NM.DEEP,
                border: active ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
                fontFamily: NM.SANS,
                fontSize: 12,
                fontWeight: active ? 500 : 400,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '12px 18px 0' }}>
        {filteredMeds.length === 0 ? (
          <FallbackRows />
        ) : (
          filteredMeds.map((m, i) => (
            <MedRow
              key={m.id}
              eye={`${m.category} · ${Math.round(m.duration_sec / 60)} min`}
              title={m.title}
              done={false}
              last={i === filteredMeds.length - 1}
              onClick={() => navigate(`/meditacia/${m.id}`)}
            />
          ))
        )}
      </div>

      {/* Library CTA pill */}
      <div style={{ padding: '16px 18px 0' }}>
        <button
          onClick={() => navigate('/oblubene?tab=meditation')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            marginTop: 10,
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favMeditations > 0 ? NM.MAUVE : 'none'} stroke={NM.MAUVE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            Obľúbené meditácie{favMeditations ? ` · ${favMeditations}` : ''}
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
