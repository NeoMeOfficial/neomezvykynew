import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { useUserBadges, usePointsLedger } from '@/hooks/usePointsLedger';

const TOKEN_COLORS: Record<string, string> = {
  TERRA: '#C1856A',
  SAGE:  '#8B9E88',
  DUSTY: '#89B0BC',
  MAUVE: '#A8848B',
  GOLD:  '#B8864A',
  DEEP:  '#3D2921',
};

const BADGE_ICONS: Record<string, string> = {
  'first-post':  '✍️',
  'week-streak': '🔥',
  'first-month': '🌱',
  '50-comments': '💬',
  'year':        '⭐',
};

function BadgeIcon({ slug, colorToken, earned }: { slug: string; colorToken: string; earned: boolean }) {
  const color = TOKEN_COLORS[colorToken] ?? '#B8864A';
  const emoji = BADGE_ICONS[slug];

  return (
    <div
      className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-2"
      style={{
        background: earned ? `${color}18` : 'rgba(61,41,33,0.04)',
        border: earned ? `1.5px solid ${color}30` : '1.5px solid rgba(61,41,33,0.08)',
      }}
    >
      {earned ? (
        <span className="text-2xl leading-none">{emoji ?? '★'}</span>
      ) : (
        <Lock size={18} style={{ color: 'rgba(61,41,33,0.25)' }} strokeWidth={1.5} />
      )}
    </div>
  );
}

export default function Odznaky() {
  const navigate = useNavigate();
  const { badges, loading } = useUserBadges();
  const { balance } = usePointsLedger();

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <div className="min-h-screen bg-cream pb-28">
      <TopBar title="Odznaky" onBack={() => navigate(-1)} />

      <div className="px-5 pt-2 flex flex-col gap-5">

        {/* Summary strip */}
        <div className="rounded-card bg-white border border-ink/[0.08] p-4">
          <div className="flex justify-around">
            {[
              { value: earned.length.toString(), label: 'Získané' },
              { value: badges.length.toString(), label: 'Celkovo' },
              { value: balance.toString(), label: 'Body' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-h2 text-ink">{value}</div>
                <Eyebrow tone="muted">{label}</Eyebrow>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <BodyText tone="muted" size="sm">Načítavam…</BodyText>
          </div>
        ) : (
          <>
            {/* Earned badges */}
            {earned.length > 0 && (
              <div>
                <Eyebrow className="mb-3">Získané odznaky</Eyebrow>
                <div className="grid grid-cols-3 gap-3">
                  {earned.map((b) => (
                    <div
                      key={b.slug}
                      className="rounded-card bg-white border border-ink/[0.08] p-4 text-center"
                    >
                      <BadgeIcon slug={b.slug} colorToken={b.color_token} earned />
                      <BodyText size="sm" className="font-medium leading-tight">{b.name}</BodyText>
                      {b.description && (
                        <Eyebrow tone="muted" className="mt-1 leading-tight">{b.description}</Eyebrow>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locked badges */}
            {locked.length > 0 && (
              <div>
                <Eyebrow className="mb-3" tone="muted">Ešte nezískané</Eyebrow>
                <div className="grid grid-cols-3 gap-3">
                  {locked.map((b) => (
                    <div
                      key={b.slug}
                      className="rounded-card bg-white border border-ink/[0.08] p-4 text-center opacity-60"
                    >
                      <BadgeIcon slug={b.slug} colorToken={b.color_token} earned={false} />
                      <BodyText size="sm" className="font-medium leading-tight text-ink/60">{b.name}</BodyText>
                      {b.description && (
                        <Eyebrow tone="muted" className="mt-1 leading-tight">{b.description}</Eyebrow>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {badges.length === 0 && (
              <div className="rounded-card bg-white border border-ink/[0.08] p-8 text-center">
                <SerifHeader as="h3" size="h3" className="mb-2">Zatiaľ žiadne odznaky</SerifHeader>
                <BodyText tone="muted" size="sm">
                  Píš príspevky, komentuj a cvič — odznaky sa objavujú za aktivity.
                </BodyText>
              </div>
            )}
          </>
        )}

        {/* Points CTA */}
        <button
          type="button"
          onClick={() => navigate('/body')}
          className="rounded-card bg-white border border-ink/[0.08] p-4 flex items-center justify-between w-full text-left"
        >
          <div>
            <BodyText size="sm" className="font-medium">Tvoje body</BodyText>
            <Eyebrow tone="muted">Pozri históriu bodov a odmeny</Eyebrow>
          </div>
          <div
            className="font-serif text-h3 text-ink"
            style={{ color: '#B8864A' }}
          >
            {balance}
          </div>
        </button>
      </div>
    </div>
  );
}
