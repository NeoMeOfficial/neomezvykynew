import { useNavigate } from 'react-router-dom';
import { NM, Eye } from '../../../components/v2/neome';
import { PlusPage, TopBar, HeroHead } from './shared';
import { useSubscription } from '../../../contexts/SubscriptionContext';

/**
 * /onboarding-plus/jedalnicek — meal-plan upsell (€57). Two options:
 *   • "Áno, pridať Jedálniček" → kicks off Stripe checkout with custom
 *     return URLs into the onboarding flow (success → jedalnicek-cas,
 *     cancel → this screen again).
 *   • "Zatiaľ nie" → /onboarding-plus/hotovo (skips to final)
 *
 * If the user has already purchased the meal plan, we skip straight to
 * the time prompt so we don't double-charge.
 */
const FEATURES = [
  'Týždenné plány s receptami (4–6 jedál denne)',
  'Makrá, nákupný zoznam, rešpekt k alergénom',
  'Plán prispôsobený fáze tvojho života',
  'Aj pre kojiaci režim s upravenými porciami',
];

export default function PlusNutritionPrompt() {
  const navigate = useNavigate();
  const { hasMealPlanner, purchaseMealPlanner } = useSubscription();

  const onYes = async () => {
    if (hasMealPlanner) {
      navigate('/onboarding-plus/jedalnicek-cas');
      return;
    }
    await purchaseMealPlanner({
      successUrl: `${window.location.origin}/onboarding-plus/jedalnicek-cas`,
      cancelUrl: `${window.location.origin}/onboarding-plus/jedalnicek`,
    });
  };

  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/onboarding-plus/cyklus')} centerLabel="Jedálniček (voliteľné)" />
      <HeroHead
        eyebrow="Výživa"
        title="Chceš pridať aj"
        accentTitle="Jedálniček?"
        accentColor={NM.GOLD}
        helper="Plán jedál na týždeň s receptami, makrami a nákupným zoznamom. Vyplníš krátky dotazník a dostaneš svoj prvý plán hneď."
        size={30}
      />

      <div style={{ padding: '28px 22px 28px' }}>
        {/* Featured upsell card */}
        <button
          onClick={onYes}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            padding: '22px 20px',
            background: '#fff',
            borderRadius: 22,
            border: `1.5px solid ${NM.GOLD}`,
            boxShadow: '0 14px 34px rgba(184,134,74,0.18)',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: 999,
              background: 'rgba(184,134,74,0.08)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Eye color={NM.GOLD} size={10}>Odporúčané</Eye>
              <div
                style={{
                  padding: '3px 8px',
                  background: 'rgba(184,134,74,0.14)',
                  borderRadius: 999,
                  fontFamily: NM.SANS,
                  fontSize: 9,
                  color: NM.GOLD,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                +57 €
              </div>
            </div>
            <div
              style={{
                fontFamily: NM.SERIF,
                fontSize: 22,
                fontWeight: 500,
                color: NM.DEEP,
                letterSpacing: '-0.01em',
                marginBottom: 6,
              }}
            >
              Áno, pridať Jedálniček
            </div>
            <div
              style={{
                fontFamily: NM.SANS,
                fontSize: 12.5,
                color: NM.MUTED,
                fontWeight: 300,
                marginBottom: 14,
              }}
            >
              Jednorazový poplatok · navždy tvoj
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FEATURES.map((li) => (
                <div key={li} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      background: 'rgba(184,134,74,0.16)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div
                    style={{
                      fontFamily: NM.SANS,
                      fontSize: 12.5,
                      color: NM.DEEP,
                      fontWeight: 400,
                      lineHeight: 1.55,
                    }}
                  >
                    {li}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </button>

        {/* "Zatiaľ nie" option */}
        <button
          onClick={() => navigate('/onboarding-plus/hotovo')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 12,
            padding: '16px 18px',
            background: 'transparent',
            border: `1px solid ${NM.HAIR_2}`,
            borderRadius: 16,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              border: `1.5px solid ${NM.HAIR_2}`,
              background: '#fff',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, color: NM.DEEP }}>Zatiaľ nie</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 1, fontWeight: 400 }}>
              Môžeš pridať kedykoľvek z Profilu
            </div>
          </div>
        </button>
      </div>
    </PlusPage>
  );
}
