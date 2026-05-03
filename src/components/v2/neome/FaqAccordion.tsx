import { useState, type CSSProperties } from 'react';
import { NM } from './tokens';

/**
 * FaqAccordion — editorial Q&A list for programme detail screens.
 *
 * Pure cream card, hairline dividers, serif question on the row, ink-bodied
 * answer expands underneath. Answers may contain inline HTML (e.g. SharpShape
 * purchase links from Gabi's copy) so they render via `dangerouslySetInnerHTML`.
 *
 * <FaqAccordion items={program.faqs} />
 */
export interface FaqItem {
  q: string;
  a: string; // may contain HTML
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Pillar accent for the chevron — defaults to ink. */
  accent?: string;
  className?: string;
  style?: CSSProperties;
}

export function FaqAccordion({ items, accent = NM.DEEP, className, style }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 18,
        border: `1px solid ${NM.HAIR}`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        const isLast = i === items.length - 1;
        return (
          <div key={i} style={{ borderBottom: isLast ? 'none' : `1px solid ${NM.HAIR}` }}>
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '16px 18px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontFamily: NM.SERIF,
                  fontSize: 15,
                  fontWeight: 500,
                  color: NM.DEEP,
                  letterSpacing: '-0.005em',
                  lineHeight: 1.4,
                }}
              >
                {item.q}
              </span>
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  marginTop: 4,
                  width: 14,
                  height: 14,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  color: accent,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? 1200 : 0,
                overflow: 'hidden',
                transition: 'max-height 280ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{
                  padding: '0 18px 18px',
                  fontFamily: NM.SANS,
                  fontSize: 13.5,
                  lineHeight: 1.62,
                  color: NM.MUTED,
                  fontWeight: 400,
                }}
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
