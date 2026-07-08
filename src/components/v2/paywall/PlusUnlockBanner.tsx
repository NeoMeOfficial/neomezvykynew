import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { NM } from '../neome';

/**
 * Quiet "how do I unlock +" hint for list pages with Plus-gated items
 * (TeloExtra, TeloStrecing, Recepty…).
 *
 * Deliberately non-invasive: free users see it on every visit, so it's a
 * slim single-line card at the end/edge of content — no gradient hero, no
 * sticky positioning. Hidden entirely for Plus members (self-gating so
 * callers can't forget).
 */
export default function PlusUnlockBanner({
  label,
  to = '/paywall',
  style,
}: {
  label: string;
  to?: string;
  style?: React.CSSProperties;
}) {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  if (isPremium) return null;

  return (
    <div style={{ padding: '4px 18px 14px', ...style }}>
      <button
        onClick={() => navigate(to)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          boxSizing: 'border-box',
          padding: '11px 14px',
          background: '#fff',
          border: `1px solid ${NM.HAIR_2}`,
          borderRadius: 14,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 7,
            background: NM.GOLD,
            color: '#fff',
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          +
        </span>
        <span style={{ flex: 1, fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, lineHeight: 1.4 }}>
          {label}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NM.TERTIARY} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
