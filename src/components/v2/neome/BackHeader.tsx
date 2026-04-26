import { useNavigate } from 'react-router-dom';
import { Eye } from './Eye';
import { NM } from './tokens';

interface Props {
  title: string;
  onBack?: () => void;
  showSearch?: boolean;
  onSearch?: () => void;
}

/**
 * Header with back chevron + center eyebrow title.
 * Default behavior: back navigates history; search button is optional.
 */
export function BackHeader({ title, onBack, showSearch = true, onSearch }: Props) {
  const navigate = useNavigate();
  const back = onBack ?? (() => navigate(-1));

  return (
    <div style={{ padding: '56px 20px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={back}
          aria-label="Späť"
          style={{
            all: 'unset',
            cursor: 'pointer',
            width: 36,
            height: 36,
            borderRadius: 999,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <Eye>{title}</Eye>
        {showSearch ? (
          <button
            onClick={onSearch}
            aria-label="Hľadať"
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 999,
              background: '#fff',
              border: `1px solid ${NM.HAIR}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
      </div>
    </div>
  );
}
