import { useNavigate } from 'react-router-dom';
import { useUniversalFavorites, type ContentType } from '../../../hooks/useUniversalFavorites';
import { NM } from '../neome';

/**
 * Unified footer under a recommended exercise / recipe / meditation
 * (Sam 2026-10-13): one compact card, identical on Telo / Strava / Myseľ —
 *   • Pridať do obľúbených (toggles; "✓ V obľúbených" when saved)
 *   • Tvoje obľúbené  → her favourites of this type
 *   • Všetky …        → the library hub
 *
 * `dark` adapts it to the meditation player's immersive dark screen.
 * `showFavToggle=false` drops the toggle where the page already has a
 * prominent "Pridať do obľúbených" (the recipe's sticky CTA bar).
 */
export default function FavoriteLinksBlock({
  item,
  favTab,
  allLabel,
  allPath,
  color = NM.GOLD,
  showFavToggle = true,
  dark = false,
}: {
  item: { id: string | number; type: ContentType; title: string; [k: string]: unknown };
  favTab: 'workout' | 'recipe' | 'meditation';
  allLabel: string;
  allPath: string;
  color?: string;
  showFavToggle?: boolean;
  dark?: boolean;
}) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useUniversalFavorites();
  const fav = isFavorite(item.id, item.type);

  const cardBg = dark ? 'rgba(255,255,255,0.06)' : '#fff';
  const cardBorder = dark ? 'rgba(255,255,255,0.18)' : NM.HAIR;
  const hair = dark ? 'rgba(255,255,255,0.14)' : NM.HAIR;
  const textColor = dark ? '#fff' : NM.DEEP;
  const chevronColor = dark ? 'rgba(255,255,255,0.5)' : NM.TERTIARY;
  const toggleIdleBg = dark ? 'rgba(255,255,255,0.10)' : '#fff';
  const toggleIdleText = dark ? '#fff' : color;

  const linkRow = (label: string, onClick: () => void, first = false) => (
    <button
      onClick={onClick}
      style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderTop: first ? 'none' : `1px solid ${hair}` }}
    >
      <span style={{ fontFamily: NM.SANS, fontSize: 13, color: textColor, fontWeight: 500 }}>{label}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={chevronColor} strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
    </button>
  );

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18, overflow: 'hidden' }}>
      {showFavToggle && (
        <button
          onClick={() => toggleFavorite(item)}
          style={{ all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 16px', background: fav ? color : toggleIdleBg, color: fav ? '#fff' : toggleIdleText }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? '#fff' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span style={{ fontFamily: NM.SANS, fontSize: 13, fontWeight: 600 }}>{fav ? 'V obľúbených' : 'Pridať do obľúbených'}</span>
        </button>
      )}
      {linkRow('Tvoje obľúbené', () => navigate(`/oblubene?tab=${favTab}`), !showFavToggle)}
      {linkRow(allLabel, () => navigate(allPath))}
    </div>
  );
}
