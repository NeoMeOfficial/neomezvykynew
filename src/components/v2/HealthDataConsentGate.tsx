import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, BackHeader, Eye, Ser, Body, NM } from './neome';
import { useConsents } from '../../hooks/useConsents';
import { CONSENT_TYPES } from '../../lib/consents';

interface Props {
  children: ReactNode;
}

/**
 * Article 9(2)(a) GDPR gate.
 *
 * Wraps any screen that reads or writes special-category health data
 * (menstrual cycle, symptoms, mood, etc.). If the current user has not
 * granted health_data consent under the current policy version, renders
 * a consent prompt instead of the wrapped screen. Grant flips the gate
 * open; decline returns the user to the previous screen.
 *
 * Once granted, the consent is recorded as an immutable consent_events
 * row (see supabase/migrations/20260518120000_consents.sql) and the
 * user can withdraw it any time from Settings → Súkromie a dáta.
 */
export function HealthDataConsentGate({ children }: Props) {
  const navigate = useNavigate();
  const { isGranted, grant, loading } = useConsents();
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <Page>
        <BackHeader title="Cyklus" showSearch={false} />
        <div style={{ padding: '40px 22px', textAlign: 'center' }}>
          <Body color={NM.MUTED}>Načítavam…</Body>
        </div>
      </Page>
    );
  }

  if (isGranted(CONSENT_TYPES.HEALTH_DATA)) {
    return <>{children}</>;
  }

  const onAccept = async () => {
    if (submitting) return;
    setSubmitting(true);
    const { error } = await grant(CONSENT_TYPES.HEALTH_DATA, 'app');
    setSubmitting(false);
    if (error) {
      // Stay on the gate; the user can retry.
      return;
    }
    // Re-render naturally — isGranted will now return true.
  };

  return (
    <Page>
      <BackHeader title="Cyklus" showSearch={false} />
      <div style={{ padding: '8px 22px 0' }}>
        <Eye color={NM.GOLD} style={{ marginBottom: 8 }}>Súhlas so zdravotnými údajmi</Eye>
        <Ser size={28} style={{ marginBottom: 14 }}>
          Údaje o tvojom cykle <em style={{ color: NM.MAUVE, fontWeight: 500 }}>patria iba tebe.</em>
        </Ser>

        <div
          style={{
            marginTop: 8,
            padding: 16,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            borderRadius: 14,
          }}
        >
          <Body size={14} style={{ lineHeight: 1.7 }}>
            Aby sme ti mohli ponúknuť sledovanie cyklu, symptómov a nálady,
            potrebujeme tvoj <strong style={{ color: NM.DEEP }}>výslovný súhlas</strong> so
            spracovaním údajov o zdraví podľa <strong style={{ color: NM.DEEP }}>čl. 9
            ods. 2 písm. a) GDPR</strong>.
          </Body>
          <div style={{ height: 12 }} />
          <Body size={13} color={NM.MUTED} style={{ lineHeight: 1.7 }}>
            • Údaje sa ukladajú šifrovane a sú dostupné iba tebe.<br />
            • Nezdieľame ich s tretími stranami na marketing.<br />
            • Súhlas môžeš kedykoľvek odvolať v Nastaveniach → Súkromie.<br />
            • Pri zrušení účtu sú údaje vymazané do 30 dní.
          </Body>
          <div style={{ height: 12 }} />
          <button
            onClick={() => navigate('/privacy')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontFamily: NM.SANS,
              fontSize: 12.5,
              color: NM.DEEP,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontWeight: 500,
            }}
          >
            Prečítať Zásady ochrany osobných údajov →
          </button>
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onAccept}
            disabled={submitting}
            style={{
              all: 'unset',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.5 : 1,
              textAlign: 'center',
              padding: '15px 22px',
              borderRadius: 999,
              background: NM.DEEP,
              color: '#fff',
              fontFamily: NM.SANS,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            {submitting ? 'Spracovávam…' : 'Súhlasím a pokračovať'}
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '13px 22px',
              borderRadius: 999,
              background: 'transparent',
              color: NM.MUTED,
              border: `1px solid ${NM.HAIR_2}`,
              fontFamily: NM.SANS,
              fontSize: 13.5,
              fontWeight: 400,
            }}
          >
            Teraz nie
          </button>
        </div>
      </div>
    </Page>
  );
}
