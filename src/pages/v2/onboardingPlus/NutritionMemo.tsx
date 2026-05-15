import { useNavigate } from 'react-router-dom';
import { NM } from '../../../components/v2/neome';
import { PlusPage, TopBar, StickyCTA } from './shared';

/**
 * /onboarding-plus/jedalnicek-memo — short reassurance screen before
 * launching the 12-step nutrition questionnaire.
 *   • "Začať" → /jedalnicek/onboarding?from=onboarding-plus
 *     (the existing NutritionOnboarding component; on complete it
 *     routes back to /onboarding-plus/hotovo when the from param is set)
 */
const BULLETS = [
  { t: 'Nič netreba pripravovať', d: 'Stačí postupne odpovedať — bez vážení a počítania.' },
  { t: 'Bez zlých odpovedí', d: 'Prispôsobíme sa tomu, čo poznáš o sebe dnes.' },
  { t: 'Vždy vieš zmeniť', d: 'V Profile prepíšeš čokoľvek, kedykoľvek.' },
];

export default function PlusNutritionMemo() {
  const navigate = useNavigate();
  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/onboarding-plus/jedalnicek-cas')} centerLabel="Jedálniček · príprava" />
      <div style={{ padding: '32px 22px 0', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 8,
            padding: '14px 22px',
            background: 'rgba(184,134,74,0.14)',
            borderRadius: 999,
            marginBottom: 26,
          }}
        >
          <span style={{ fontFamily: NM.SERIF, fontSize: 32, fontWeight: 500, color: NM.GOLD, letterSpacing: '-0.02em' }}>2</span>
          <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.GOLD, fontWeight: 500 }}>minúty</span>
        </div>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: 32,
            fontWeight: 500,
            color: NM.DEEP,
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
          }}
        >
          Vyplníme to spolu —<br />
          <span style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>v pokoji.</span>
        </div>
        <div
          style={{
            marginTop: 14,
            padding: '0 14px',
            fontFamily: NM.SANS,
            fontSize: 14,
            color: NM.MUTED,
            fontWeight: 300,
            lineHeight: 1.55,
          }}
        >
          Prejdeme niekoľko krátkych krokov o tvojom cieli, dni a chutiach. Všetko môžeš neskôr upraviť v Profile.
        </div>
      </div>

      <div style={{ padding: '32px 22px 0' }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 18,
            border: `1px solid ${NM.HAIR}`,
            padding: '6px 22px',
          }}
        >
          {BULLETS.map((b, i) => (
            <div
              key={b.t}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                padding: '14px 0',
                borderBottom: i < BULLETS.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 999, background: NM.GOLD, marginTop: 8, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>
                  {b.t}
                </div>
                <div style={{ marginTop: 3, fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, fontWeight: 300, lineHeight: 1.55 }}>
                  {b.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StickyCTA
        label="Začať"
        sub="krátky dotazník · 2 minúty"
        onClick={() => navigate('/jedalnicek/onboarding?from=onboarding-plus')}
      />
    </PlusPage>
  );
}
