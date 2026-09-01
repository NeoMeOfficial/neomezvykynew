import { useNavigate } from 'react-router-dom';
import { NM, Eye } from '../../../components/v2/neome';
import { PlusPage, TopBar, HeroHead } from './shared';

/**
 * /onboarding-plus/jedalnicek — meal-plan announcement.
 *
 * Not purchasable at first launch (Gabi 2026-09-02): the €57 Stripe
 * checkout is disabled and the step only announces the plan
 * ("V ponuke čoskoro"), then continues to /onboarding-plus/hotovo.
 * The purchase flow lives in git history for when the plan launches.
 */
export default function PlusNutritionPrompt() {
  const navigate = useNavigate();

  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/onboarding-plus/cyklus')} centerLabel="Jedálniček" />
      <HeroHead
        eyebrow="Výživa"
        title="Chystáme pre teba"
        accentTitle="Jedálniček"
        accentColor={NM.SAGE}
        helper="Personalizovaný jedálniček, ktorý zohľadňuje tvoje preferencie — naplnený Gabikinými receptami tak, aby ti pomohol dosiahnuť tvoje ciele."
        size={30}
      />

      <div style={{ padding: '28px 22px 28px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 22,
            border: `1.5px solid ${NM.SAGE}`,
            boxShadow: '0 14px 34px rgba(139,158,136,0.22)',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
            background:
              `linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 32%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0.55) 80%, rgba(255,255,255,0.35) 100%), ` +
              `url(/images/r9/section-nutrition.jpg) right center / cover no-repeat`,
          }}
        >
          <div style={{ position: 'relative', padding: '22px 22px 22px' }}>
            <Eye color={NM.SAGE} size={10}>Jedálniček</Eye>
            <div style={{ marginTop: 10, fontFamily: NM.SERIF, fontSize: 20, color: NM.DEEP, lineHeight: 1.2 }}>
              6-týždňový plán na mieru
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginTop: 16,
                padding: '10px 18px',
                borderRadius: 999,
                background: 'rgba(139,158,136,0.16)',
                border: `1px solid ${NM.SAGE}`,
                fontFamily: NM.SANS,
                fontSize: 12.5,
                fontWeight: 600,
                color: NM.SAGE,
              }}
            >
              V ponuke čoskoro
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/onboarding-plus/hotovo')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 18,
            padding: '15px 22px',
            background: NM.DEEP,
            color: '#fff',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13.5,
            fontWeight: 500,
            letterSpacing: '0.02em',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          Pokračovať
        </button>
      </div>
    </PlusPage>
  );
}
