import { useEffect } from 'react';
import { Eye, Ser, Body } from './';
import { NM } from './tokens';

/**
 * ConfirmSheet — branded "are you sure?" modal in the NeoMe editorial style.
 *
 * Bottom-sheet on mobile, scrim above. Replaces native `window.confirm()`
 * for any destructive or commit-style action. Mirrors the post-activation
 * sheet used in ProgramDetail.tsx so confirmations across the app share
 * one visual language.
 *
 * <ConfirmSheet
 *   open={open}
 *   eyebrow="Cyklus"
 *   title="Označiť dnešok ako začiatok menštruácie?"
 *   message="Tým sa znovu nastaví tvoj cyklus tak, aby dnešný deň bol deň 1."
 *   confirmLabel="Áno, dnes mi začala"
 *   cancelLabel="Späť"
 *   onConfirm={handleConfirm}
 *   onCancel={() => setOpen(false)}
 *   accent={NM.MAUVE}
 * />
 */
export interface ConfirmSheetProps {
  open: boolean;
  eyebrow?: string;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Pillar accent for the eyebrow + primary CTA. Defaults to terra. */
  accent?: string;
  /** Variant: 'default' for normal action, 'danger' for destructive. */
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  open,
  eyebrow,
  title,
  message,
  confirmLabel = 'Potvrdiť',
  cancelLabel = 'Späť',
  accent = NM.TERRA,
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  // Lock body scroll while the sheet is open and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onCancel]);

  if (!open) return null;

  const primaryBg = tone === 'danger' ? '#B5544A' : accent;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(42,26,20,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: NM.BG,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '28px 24px max(env(safe-area-inset-bottom), 24px)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Drag handle */}
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: NM.HAIR_2,
            margin: '0 auto 18px',
          }}
        />

        {eyebrow && <Eye color={accent} size={10}>{eyebrow}</Eye>}

        <Ser
          size={22}
          style={{
            marginTop: eyebrow ? 10 : 0,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </Ser>

        {message && (
          <Body size={13} color={NM.MUTED} style={{ marginTop: 12, lineHeight: 1.55 }}>
            {message}
          </Body>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              all: 'unset',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '14px 20px',
              borderRadius: 999,
              background: primaryBg,
              color: '#fff',
              fontFamily: NM.SANS,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              all: 'unset',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '12px 20px',
              borderRadius: 999,
              background: 'transparent',
              color: NM.MUTED,
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
