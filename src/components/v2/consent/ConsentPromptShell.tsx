/**
 * ConsentPromptShell — shared visual primitive for consent prompts.
 *
 * Used by both:
 *   - TosConsentGate (full-screen blocker at app entry, ToS+Privacy)
 *   - ConsentGuardContext (inline bottom-sheet, per-feature consents)
 *
 * Owns the GDPR-styled inner content: eyebrow, headline, description,
 * optional legal/info slot, privacy-policy link, accept + decline buttons.
 * Outer chrome (full-screen layout vs bottom-sheet + backdrop) lives in
 * each consumer.
 */
import { ReactNode } from 'react';
import { NM } from '../neome';

export interface ConsentPromptShellProps {
  /** Headline (serif) — what the user is being asked to agree to. */
  title: string;
  /** Body copy — what consent covers. */
  description: string;
  /** Optional content shown above the description (e.g. ToS feature card). */
  preDescription?: ReactNode;
  /** Optional content shown below the description (e.g. Art. 9 legal banner). */
  legalNote?: ReactNode;
  /** Accept button label. */
  acceptLabel: string;
  /** Decline button label. */
  declineLabel: string;
  /** Headline size — sheet uses 22px, full-screen 30px. */
  titleSize?: number;
  /** Disable both buttons while a record_consent RPC is in flight. */
  submitting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentPromptShell({
  title,
  description,
  preDescription,
  legalNote,
  acceptLabel,
  declineLabel,
  titleSize = 22,
  submitting,
  onAccept,
  onDecline,
}: ConsentPromptShellProps) {
  return (
    <>
      <div
        style={{
          fontFamily: NM.SANS,
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: NM.GOLD,
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        GDPR · Súhlas
      </div>
      <div
        style={{
          fontFamily: NM.SERIF,
          fontSize: titleSize,
          lineHeight: 1.2,
          letterSpacing: '-0.012em',
          color: NM.DEEP,
          marginBottom: 14,
          fontWeight: 500,
        }}
      >
        {title}
      </div>

      {preDescription}

      <div
        style={{
          fontFamily: NM.SANS,
          fontSize: 14,
          lineHeight: 1.65,
          color: NM.MUTED,
          fontWeight: 300,
          marginBottom: 14,
        }}
      >
        {description}
      </div>

      {legalNote}

      <a
        href="/privacy"
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-block',
          fontFamily: NM.SANS,
          fontSize: 12.5,
          color: NM.DEEP,
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          fontWeight: 500,
          marginBottom: 18,
        }}
      >
        Viac v Zásadách ochrany osobných údajov →
      </a>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          {submitting ? 'Spracovávam…' : acceptLabel}
        </button>
        <button
          onClick={onDecline}
          disabled={submitting}
          style={{
            all: 'unset',
            cursor: submitting ? 'not-allowed' : 'pointer',
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
          {declineLabel}
        </button>
      </div>
    </>
  );
}
