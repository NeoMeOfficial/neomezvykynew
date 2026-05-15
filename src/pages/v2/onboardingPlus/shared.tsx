import { CSSProperties, ReactNode } from 'react';
import { NM, Eye } from '../../../components/v2/neome';

/**
 * Shared atoms for the post-subscription onboarding flow
 * (/onboarding-plus/*). Pure visual primitives — no routing, no data.
 * Round-11 design language re-tokened to the NM palette.
 */

export const ON = {
  CARD: '#FFFFFF',
  HAIR: NM.HAIR,
  HAIR_2: NM.HAIR_2,
  GLOW_GOLD: 'rgba(184,134,74,0.18)',
  GLOW_TERRA: 'rgba(193,133,106,0.12)',
};

export function PlusPage({ children, dark = false, image }: { children: ReactNode; dark?: boolean; image?: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: dark ? '#2A1A14' : NM.BG,
        color: dark ? '#fff' : NM.DEEP,
        fontFamily: NM.SANS,
        overflowY: 'auto',
        backgroundImage: image
          ? `linear-gradient(180deg, rgba(42,26,20,0.5) 0%, rgba(42,26,20,0.85) 60%, #2A1A14 100%), url(${image})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  );
}

export function TopBar({
  onBack,
  centerLabel,
  rightSkipLabel,
  onSkip,
  dark = false,
}: {
  onBack?: () => void;
  centerLabel?: string;
  rightSkipLabel?: string;
  onSkip?: () => void;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        padding: 'calc(env(safe-area-inset-top) + 14px) 20px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Späť"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: dark ? 'rgba(255,255,255,0.08)' : '#fff',
            border: dark ? '1px solid rgba(255,255,255,0.14)' : `1px solid ${NM.HAIR}`,
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? '#fff' : NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
      {centerLabel ? (
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: NM.SANS,
            fontSize: 12,
            color: dark ? 'rgba(255,255,255,0.62)' : NM.MUTED,
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          {centerLabel}
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}
      {rightSkipLabel && onSkip ? (
        <button
          onClick={onSkip}
          style={{
            background: 'transparent',
            border: 0,
            padding: '6px 0',
            cursor: 'pointer',
            fontFamily: NM.SANS,
            fontSize: 12,
            color: dark ? 'rgba(255,255,255,0.62)' : NM.MUTED,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 400,
          }}
        >
          {rightSkipLabel}
        </button>
      ) : (
        <div style={{ width: 60 }} />
      )}
    </div>
  );
}

export function HeroHead({
  eyebrow,
  eyebrowColor,
  title,
  accentTitle,
  accentColor = NM.TERRA,
  helper,
  size = 30,
  dark = false,
}: {
  eyebrow?: string;
  eyebrowColor?: string;
  title: ReactNode;
  accentTitle?: string;
  accentColor?: string;
  helper?: string;
  size?: number;
  dark?: boolean;
}) {
  return (
    <div style={{ padding: '0 22px' }}>
      {eyebrow && (
        <Eye color={eyebrowColor ?? (dark ? 'rgba(255,255,255,0.7)' : NM.EYEBROW)} size={11}>
          {eyebrow}
        </Eye>
      )}
      <div style={{ marginTop: eyebrow ? 10 : 0 }}>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: size,
            fontWeight: 500,
            color: dark ? '#fff' : NM.DEEP,
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
          }}
        >
          {title}
          {accentTitle && (
            <>
              {' '}
              <span style={{ color: accentColor, fontStyle: 'italic', fontWeight: 500 }}>{accentTitle}</span>
            </>
          )}
        </div>
      </div>
      {helper && (
        <div
          style={{
            marginTop: 12,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 300,
            color: dark ? 'rgba(255,255,255,0.72)' : NM.MUTED,
            lineHeight: 1.55,
          }}
        >
          {helper}
        </div>
      )}
    </div>
  );
}

export function BigCard({
  recommended,
  accent,
  title,
  description,
  onClick,
  style,
}: {
  recommended?: boolean;
  accent?: string;
  title: string;
  description: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        padding: '20px 20px',
        borderRadius: 20,
        background: recommended ? '#fff' : 'rgba(255,255,255,0.5)',
        border: recommended ? `1.5px solid ${accent ?? NM.TERRA}` : `1px solid ${NM.HAIR_2}`,
        boxShadow: recommended ? `0 8px 22px ${accent === NM.GOLD ? 'rgba(184,134,74,0.14)' : 'rgba(193,133,106,0.12)'}` : 'none',
        display: 'block',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Eye color={recommended ? (accent ?? NM.TERRA) : NM.EYEBROW} size={10}>
          {recommended ? 'Odporúčané' : 'Neskôr'}
        </Eye>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={recommended ? (accent ?? NM.TERRA) : NM.TERTIARY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: NM.SERIF,
          fontSize: 22,
          fontWeight: 500,
          color: NM.DEEP,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: NM.SANS,
          fontSize: 12.5,
          color: NM.MUTED,
          fontWeight: 300,
          lineHeight: 1.55,
        }}
      >
        {description}
      </div>
    </button>
  );
}

export function StickyCTA({
  label,
  onClick,
  onSkip,
  skipLabel,
  sub,
  disabled,
  accent,
  dark = false,
}: {
  label: string;
  onClick: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  sub?: string;
  disabled?: boolean;
  accent?: string;
  dark?: boolean;
}) {
  const bg = accent ?? (dark ? NM.GOLD : NM.DEEP);
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '18px 22px calc(env(safe-area-inset-bottom) + 22px)',
        background: dark
          ? 'linear-gradient(180deg, rgba(42,26,20,0) 0%, rgba(42,26,20,0.85) 50%, rgba(42,26,20,1) 100%)'
          : 'linear-gradient(180deg, rgba(248,245,240,0) 0%, rgba(248,245,240,0.95) 40%, rgba(248,245,240,1) 100%)',
      }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '16px 16px',
          background: disabled ? NM.HAIR_2 : bg,
          color: disabled ? NM.TERTIARY : '#fff',
          border: 0,
          borderRadius: 999,
          fontFamily: NM.SANS,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.02em',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {label}
      </button>
      {sub && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontFamily: NM.SANS,
            fontSize: 11,
            color: dark ? 'rgba(255,255,255,0.55)' : NM.TERTIARY,
            fontWeight: 400,
          }}
        >
          {sub}
        </div>
      )}
      {onSkip && skipLabel && (
        <button
          onClick={onSkip}
          style={{
            display: 'block',
            margin: '14px auto 0',
            background: 'transparent',
            border: 0,
            padding: '4px 8px',
            cursor: 'pointer',
            fontFamily: NM.SANS,
            fontSize: 12,
            color: dark ? 'rgba(255,255,255,0.6)' : NM.MUTED,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 400,
          }}
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
