import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDayPlan } from '../../../hooks/useDayPlan';
import { NM, Eye } from '../neome';

/**
 * Bottom-sheet that opens when the user taps a day on the home
 * WeekCalendar. Shows the prescribed exercise and meal plan for the
 * picked date. Each card is tappable and routes into the respective
 * player / recipe page.
 *
 * Read-only in Phase 1 — a follow-up commit adds 'mark as done' for
 * past days.
 */

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'] as const;
const SK_MONTHS = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function relativeDayLabel(date: Date): string {
  const today = startOfDay(new Date());
  const that = startOfDay(date);
  const diff = Math.round((that.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return 'Dnes';
  if (diff === -1) return 'Včera';
  if (diff === 1) return 'Zajtra';
  if (diff < 0) return `Pred ${Math.abs(diff)} dňami`;
  return `O ${diff} dní`;
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  const m = Math.round(seconds / 60);
  return `${m} min`;
}

export function DayPlanSheet({ date, onClose }: { date: Date; onClose: () => void }) {
  const navigate = useNavigate();
  const plan = useDayPlan(date);
  const today = startOfDay(new Date());
  const that = startOfDay(date);
  const isFuture = that.getTime() > today.getTime();
  const isToday = that.getTime() === today.getTime();

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const dayLabel = SK_DAYS[date.getDay()];
  const dateLabel = `${date.getDate()}. ${SK_MONTHS[date.getMonth()]}`;
  const eyebrowLabel = `${relativeDayLabel(date)} · ${dayLabel.toLowerCase()} ${dateLabel}`;

  const exerciseCta = isFuture ? 'Pripravené' : isToday ? 'Spustiť teraz' : 'Pozrieť cvičenie';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
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
          padding: '20px 22px max(env(safe-area-inset-bottom), 24px)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
      >
        <div
          aria-hidden="true"
          style={{ width: 36, height: 4, borderRadius: 999, background: NM.HAIR_2, margin: '0 auto 14px' }}
        />

        <Eye color={NM.GOLD}>{eyebrowLabel}</Eye>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: 26,
            color: NM.DEEP,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            marginTop: 8,
            marginBottom: 18,
          }}
        >
          Tvoj deň
        </div>

        {/* Exercise section */}
        <SectionTitle>Cvičenie</SectionTitle>
        {plan.exerciseLoading ? (
          <Placeholder>Načítavam…</Placeholder>
        ) : plan.exercise ? (
          <button
            type="button"
            onClick={() => navigate('/kniznica/telo')}
            style={cardStyle}
          >
            <div
              style={{
                ...cardImageStyle,
                backgroundImage: `url(${plan.exercise.thumbnail_url ?? '/images/r9/section-body.jpg'})`,
              }}
            >
              <div style={cardImageOverlay} />
              {formatDuration(plan.exercise.duration_seconds) && (
                <div style={cardChipStyle}>{formatDuration(plan.exercise.duration_seconds)}</div>
              )}
            </div>
            <div style={{ padding: 16 }}>
              <Eye size={9}>
                Týž. {plan.exercise.week} · Deň {plan.exercise.day}
              </Eye>
              <div
                style={{
                  fontFamily: NM.SERIF,
                  fontSize: 18,
                  color: NM.DEEP,
                  marginTop: 6,
                  letterSpacing: '-0.005em',
                  lineHeight: 1.2,
                }}
              >
                {plan.exercise.title}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  fontWeight: 500,
                  color: NM.TERRA,
                }}
              >
                {exerciseCta}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NM.TERRA} strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </button>
        ) : plan.hasActiveProgram ? (
          <Placeholder>Pre tento deň nie je naplánované cvičenie.</Placeholder>
        ) : (
          <Placeholder
            ctaLabel="Vyber si program"
            onCta={() => navigate('/kniznica/telo')}
          >
            Aktivuj si tréningový program a uvidíš tu, čo máš na ktorý deň.
          </Placeholder>
        )}

        {/* Nutrition section */}
        <SectionTitle style={{ marginTop: 22 }}>Strava</SectionTitle>
        {plan.meals.length > 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: `1px solid ${NM.HAIR}`,
              overflow: 'hidden',
            }}
          >
            {plan.meals.map((meal, i) => (
              <button
                key={`${meal.slot}-${i}`}
                type="button"
                onClick={() => navigate(`/recept/${meal.recipeId}`)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  gap: 12,
                  padding: '12px 14px',
                  alignItems: 'center',
                  borderBottom: i < plan.meals.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    flexShrink: 0,
                    backgroundImage: meal.recipeImage ? `url(${meal.recipeImage})` : 'none',
                    backgroundColor: NM.CREAM_2 ?? '#F1ECE3',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Eye size={9}>{meal.label}</Eye>
                  <div
                    style={{
                      marginTop: 3,
                      fontFamily: NM.SERIF,
                      fontSize: 14.5,
                      color: NM.DEEP,
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {meal.recipeName}
                  </div>
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NM.TERTIARY} strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            ))}
          </div>
        ) : plan.hasMealPlan ? (
          <Placeholder>Pre tento deň nemáš naplánované jedlá.</Placeholder>
        ) : (
          <Placeholder
            ctaLabel="Vygeneruj stravu"
            onCta={() => navigate('/jedalnicek')}
          >
            Vygeneruj si jedálniček a uvidíš tu, čo máš na ktorý deň jesť.
          </Placeholder>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            textAlign: 'center',
            width: '100%',
            marginTop: 22,
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
          Zavrieť
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: 10, ...style }}>
      <Eye>{children}</Eye>
    </div>
  );
}

function Placeholder({
  children,
  ctaLabel,
  onCta,
}: {
  children: React.ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 18,
        border: `1px dashed ${NM.HAIR_2}`,
        padding: '16px 18px',
        fontFamily: NM.SANS,
        fontSize: 13,
        color: NM.MUTED,
        fontWeight: 300,
        lineHeight: 1.5,
      }}
    >
      {children}
      {ctaLabel && onCta && (
        <button
          type="button"
          onClick={onCta}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-block',
            marginTop: 10,
            fontFamily: NM.SANS,
            fontSize: 12,
            fontWeight: 500,
            color: NM.TERRA,
          }}
        >
          {ctaLabel} →
        </button>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  background: '#FFFFFF',
  borderRadius: 20,
  border: `1px solid ${NM.HAIR}`,
  overflow: 'hidden',
};

const cardImageStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16/10',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const cardImageOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
  pointerEvents: 'none',
};

const cardChipStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 10,
  right: 10,
  padding: '4px 10px',
  borderRadius: 999,
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  fontFamily: 'DM Sans, system-ui',
  fontSize: 10.5,
  fontWeight: 500,
};
