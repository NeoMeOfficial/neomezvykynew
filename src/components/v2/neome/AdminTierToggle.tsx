import { useEffect, useState } from 'react';
import { useSupabaseAuth } from '../../../contexts/SupabaseAuthContext';
import { useAdmin } from '../../../hooks/useAdmin';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { Eye, Ser, Body } from './';
import { NM } from './tokens';

/**
 * AdminTierToggle — admin-only control inside the Profile screen that
 * lets a tester switch between Free and Plus tier without touching
 * subscription state.
 *
 * Renders nothing for non-admins (gated by `useAdmin().isAdmin` —
 * email-based allow-list in src/hooks/useAdmin.ts).
 *
 * Mechanics: writes `dev_tier_override_${userId}` in localStorage with
 * value 'premium' | 'free'. SubscriptionContext reads it BEFORE its
 * other signals (only when import.meta.env.DEV === true), so the
 * override unconditionally wins until cleared.
 */
export function AdminTierToggle() {
  const { user } = useSupabaseAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { tier, isPremium } = useSubscription();
  const userId = user?.id ?? '';

  const [override, setOverride] = useState<'premium' | 'free' | null>(null);

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`dev_tier_override_${userId}`);
    setOverride(stored === 'premium' || stored === 'free' ? stored : null);
  }, [userId]);

  if (adminLoading || !isAdmin || !userId) return null;

  const apply = (value: 'premium' | 'free' | null) => {
    const key = `dev_tier_override_${userId}`;
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
    setOverride(value);
    window.dispatchEvent(new Event('neome:dev-tier-override'));
  };

  const Btn = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: 'premium' | 'free' | null;
    color: string;
  }) => {
    const active =
      (value === null && override === null) ||
      (value !== null && override === value);
    return (
      <button
        type="button"
        onClick={() => apply(value)}
        disabled={active}
        style={{
          all: 'unset',
          cursor: active ? 'default' : 'pointer',
          flex: 1,
          textAlign: 'center',
          padding: '10px 14px',
          borderRadius: 999,
          fontFamily: NM.SANS,
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.02em',
          background: active ? color : 'transparent',
          color: active ? '#fff' : NM.MUTED,
          border: active ? 'none' : `1px solid ${NM.HAIR_2}`,
          opacity: active ? 1 : 0.85,
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ margin: '20px 20px 0' }}>
      <Eye color={NM.GOLD} size={10} style={{ marginBottom: 10 }}>
        Admin · Test prístup
      </Eye>
      <div
        style={{
          padding: '18px 18px 16px',
          borderRadius: 20,
          background: '#fff',
          border: `1px solid ${NM.HAIR}`,
          boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
        }}
      >
        <Ser size={18} style={{ lineHeight: 1.25 }}>
          Prepínač <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>Free / Plus</em>
        </Ser>
        <Body size={12} style={{ marginTop: 6 }}>
          Vidíš tento panel, lebo si admin. Prepni svoj testovací režim — celá appka sa okamžite prispôsobí.
        </Body>

        <div
          style={{
            marginTop: 14,
            padding: '10px 14px',
            borderRadius: 14,
            background: NM.CREAM_2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: NM.SANS,
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: NM.EYEBROW,
                fontWeight: 500,
              }}
            >
              Aktuálne
            </div>
            <div
              style={{
                marginTop: 2,
                fontFamily: NM.SERIF,
                fontSize: 16,
                fontWeight: 500,
                color: NM.DEEP,
                letterSpacing: '-0.005em',
              }}
            >
              {tier === 'premium' ? 'Plus' : 'Free'}
              {override && (
                <span
                  style={{
                    marginLeft: 8,
                    fontFamily: NM.SANS,
                    fontSize: 10,
                    fontWeight: 500,
                    color: NM.GOLD,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  · override
                </span>
              )}
            </div>
          </div>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              background: isPremium ? `${NM.GOLD}22` : NM.HAIR,
              fontFamily: NM.SANS,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: isPremium ? NM.GOLD : NM.MUTED,
            }}
          >
            {isPremium ? 'Plus' : 'Free'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Btn label="Free" value="free" color={NM.DEEP} />
          <Btn label="Plus" value="premium" color={NM.GOLD} />
          <Btn label="Auto" value={null} color={NM.TERRA} />
        </div>

        <div
          style={{
            marginTop: 10,
            fontFamily: NM.SANS,
            fontSize: 10.5,
            color: NM.TERTIARY,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          Auto = bez override (aktuálne predplatné rozhoduje). Funguje len v dev móde — do produkcie sa nikdy nedostane.
        </div>
      </div>
    </div>
  );
}
