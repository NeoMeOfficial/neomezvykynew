import { NM } from './tokens';

interface Props {
  placeholder?: string;
  onClick?: () => void;
}

/**
 * Pill-shaped search row. Currently a static, click-to-navigate
 * affordance (the active search experience lives on its own screen).
 */
export function SearchBar({ placeholder = 'Hľadaj v knižnici…', onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '0 20px',
        padding: '13px 16px',
        background: '#fff',
        borderRadius: 999,
        border: `1px solid ${NM.HAIR}`,
        boxShadow: '0 2px 12px rgba(61,41,33,0.04)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={NM.MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <span style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.TERTIARY, fontWeight: 400 }}>{placeholder}</span>
    </button>
  );
}
