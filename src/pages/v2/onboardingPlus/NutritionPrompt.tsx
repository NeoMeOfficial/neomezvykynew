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
        accentColor={NM.SAGE}
        helper="Plán jedál na týždeň s receptami, makrami a nákupným zoznamom. Vyplníš krátky dotazník a dostaneš svoj prvý plán hneď."
        size={30}
      />

      <div style={{ padding: '28px 22px 28px' }}>
        {/* Featured upsell card — image fades in from the right, explicit
            sage CTA inside the card so the price + purchase action are
            unambiguous. Card itself is no longer the click target. */}
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
            <Eye color={NM.SAGE} size={10}>Odporúčané</Eye>

            <div
              style={{
                marginTop: 10,
                fontFamily: NM.SERIF,
                fontSize: 22,
                fontWeight: 500,
                color: NM.DEEP,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              Pridať Jedálniček
            </div>

            {/* Big sage price */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span
                style={{
                  fontFamily: NM.SERIF,
                  fontSize: 38,
                  fontWeight: 500,
                  color: NM.SAGE,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                57 €
              </span>
              <span
                style={{
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  color: NM.MUTED,
                  fontWeight: 400,
                }}
              >
                jednorazová platba
              </span>
            </div>

            {/* Reassurance subtitle — explicit about what the user gets */}
            <div
              style={{
                marginTop: 6,
                fontFamily: NM.SANS,
                fontSize: 12,
                color: NM.SAGE,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              Jedálniček zostáva tvoj navždy — žiadne ďalšie poplatky.
            </div>

            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280 }}>
              {FEATURES.map((li) => (
                <div key={li} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      background: 'rgba(139,158,136,0.22)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={NM.SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

            {/* Explicit sage CTA inside the card */}
            <button
              onClick={onYes}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                marginTop: 20,
                padding: '14px 22px',
                background: NM.SAGE,
                color: '#fff',
                borderRadius: 999,
                fontFamily: NM.SANS,
                fontSize: 13.5,
                fontWeight: 500,
                letterSpacing: '0.02em',
                textAlign: 'center' as const,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              Áno, pridať Jedálniček · 57 €
            </button>
          </div>
        </div>

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
