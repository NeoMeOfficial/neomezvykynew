import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { useFavorites } from '@/hooks/useFavorites';
import { useReflections } from '@/hooks/useDailyRituals';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { PlusTag } from '@/components/ui/plus-tag';
import { SectionHeader } from '@/components/ui/section-header';
import { SettingsGroup, SettingsRow } from '@/components/v2/settings-row';
import { Flame, ChevronRight, Star } from 'lucide-react';
import { usePointsLedger, useNextMilestone, useUserBadges } from '@/hooks/usePointsLedger';

export default function Profil() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useSupabaseAuth();
  const { isPremium } = useSubscription();
  const { stats } = useWorkoutHistory() as { stats: { totalWorkouts: number; currentStreak: number; longestStreak: number } };
  const { favoritesCount } = useFavorites();
  const { count: reflectionCount } = useReflections();

  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const fullName = profile?.full_name ?? meta.full_name ?? meta.name ?? user?.email?.split('@')[0] ?? 'Eva Nová';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const streak = stats?.currentStreak ?? 0;
  const longest = stats?.longestStreak ?? 0;
  const totalWorkouts = stats?.totalWorkouts ?? 0;

  const { balance } = usePointsLedger();
  const milestone = useNextMilestone(balance);
  const { badges } = useUserBadges();
  const earnedBadges = badges.filter(b => b.earned);

  const BADGE_COLORS: Record<string, string> = {
    TERRA: '#6B4C3B', SAGE: '#7A9E78', DUSTY: '#A8848B',
    MAUVE: '#C27A6E', GOLD: '#B8864A',
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Header */}
      <div className="pt-14 px-5 pb-6">
        <Eyebrow tone="muted" className="mb-3">MÔJ PROFIL</Eyebrow>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-pillar-telo/20 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-nm-sm">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={fullName} className="h-full w-full rounded-full object-cover" />
              : <span className="font-serif text-h2 text-pillar-telo">{initials}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <SerifHeader as="h1" size="h2" className="truncate">{fullName}</SerifHeader>
              {isPremium && <PlusTag />}
            </div>
            <BodyText size="sm" tone="muted" className="mt-0.5">
              {user?.email ?? ''}
            </BodyText>
          </div>
          <button
            onClick={() => navigate('/settings/profile')}
            className="h-9 w-9 rounded-full bg-white border border-ink/[0.08] flex items-center justify-center flex-shrink-0"
          >
            <ChevronRight className="size-4 text-ink/40" />
          </button>
        </div>
      </div>

      {/* Progress card */}
      <div className="px-5 mb-6">
        <div className="rounded-card p-5 bg-white border border-ink/[0.08] shadow-nm-sm">
          <div className="flex items-center justify-between mb-4">
            <Eyebrow tone="muted">Tvoj pokrok</Eyebrow>
            <button
              onClick={() => navigate('/body')}
              className="font-sans text-[11px] text-terra font-medium"
            >
              Detaily ›
            </button>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-terra/10 flex items-center justify-center flex-shrink-0">
              <Flame className="size-5 text-terra" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-h1 text-ink leading-none">{streak}</span>
                <span className="font-sans text-sm text-ink/56">dní v rade</span>
              </div>
              <div className="font-sans text-[11px] text-ink/40 mt-0.5">
                {longest > 0 ? `Rekord: ${longest} dní` : 'Začiatok cesty'}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-2">
            {[
              { n: totalWorkouts, label: 'cvičení',   color: 'text-pillar-strava' },
              { n: reflectionCount ?? 0, label: 'reflexií', color: 'text-pillar-mysel' },
              { n: favoritesCount, label: 'receptov', color: 'text-gold' },
            ].map(s => (
              <div key={s.label} className="flex-1 rounded-xl bg-cream-200 py-3 px-2 text-center">
                <div className={`font-serif text-h2 leading-none ${s.color}`}>{s.n}</div>
                <div className="font-sans text-[9px] uppercase tracking-[0.18em] text-ink/40 mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Points card */}
      <div className="px-5 mb-6">
        <div className="rounded-card p-5 bg-white border border-ink/[0.08] shadow-nm-sm">
          <div className="flex items-center justify-between mb-4">
            <Eyebrow tone="muted">Body a odmeny</Eyebrow>
            <button
              onClick={() => navigate('/body/odmeny')}
              className="font-sans text-[11px] text-terra font-medium"
            >
              Vymeniť ›
            </button>
          </div>

          {/* Balance */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
              <Star className="size-5 text-gold fill-gold/30" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-h1 text-ink leading-none">{balance}</span>
                <span className="font-sans text-sm text-ink/56">bodov</span>
              </div>
              <button
                onClick={() => navigate('/body')}
                className="font-sans text-[11px] text-ink/40 mt-0.5 text-left"
              >
                Zobraziť históriu ›
              </button>
            </div>
          </div>

          {/* Next milestone */}
          {milestone ? (
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-sans text-[11px] text-ink/56 font-medium">{milestone.name}</span>
                <span className="font-sans text-[11px] text-ink/40">{milestone.remaining} bodov</span>
              </div>
              <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-500"
                  style={{ width: `${milestone.pct}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="font-sans text-[12px] text-ink/40 text-center py-1">
              Všetky odmeny splnené
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="mt-4 pt-4 border-t border-ink/[0.06]">
              <div className="flex items-baseline justify-between mb-3">
                <Eyebrow tone="muted" className="text-[10px]">Odznaky</Eyebrow>
                <span className="font-sans text-[11px] text-ink/40">{earnedBadges.length} / {badges.length}</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
                {badges.map((b) => {
                  const color = BADGE_COLORS[b.color_token] ?? '#6B4C3B';
                  return (
                    <div key={b.slug} className="flex-shrink-0 flex flex-col items-center gap-1.5" style={{ width: 52 }}>
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{
                          background: b.earned ? color : '#F1ECE3',
                          border: `1.5px solid ${b.earned ? 'transparent' : '#E8E0D4'}`,
                          opacity: b.earned ? 1 : 0.5,
                        }}
                      >
                        <Star
                          className="size-4"
                          style={{
                            stroke: b.earned ? '#fff' : '#A0907E',
                            fill: b.earned ? 'rgba(255,255,255,0.25)' : 'none',
                          }}
                        />
                      </div>
                      <span className="font-sans text-center leading-tight" style={{ fontSize: 9, color: b.earned ? '#3D2921' : '#A0907E', fontWeight: b.earned ? 500 : 400 }}>
                        {b.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All rewards row */}
          <button
            onClick={() => navigate('/body/odmeny')}
            className="mt-4 pt-4 border-t border-ink/[0.06] w-full flex items-center justify-between"
          >
            <span className="font-sans text-[13px] text-ink font-medium">Všetky odmeny a zľavy</span>
            <ChevronRight className="size-4 text-ink/40" />
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="px-5 mb-6">
        <SectionHeader eyebrow="Predplatné" className="mb-3" />
        <button
          onClick={() => navigate('/profil/predplatne')}
          className="w-full text-left rounded-card p-5 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-4 transition-all active:scale-[0.99]"
        >
          <div className="h-10 w-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
            <span className="font-sans text-sm font-bold text-gold">+</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-h3 text-ink">
              {isPremium ? 'NeoMe Plus' : 'Bezplatný plán'}
            </div>
            <BodyText size="sm" tone="muted" className="mt-0.5">
              {isPremium ? 'Aktívne predplatné' : 'Upgrade na Plus'}
            </BodyText>
          </div>
          <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
        </button>
      </div>

      {/* Settings */}
      <SettingsGroup label="Nastavenia">
        <SettingsRow label="Profil a údaje" onClick={() => navigate('/settings/profile')} />
        <SettingsRow label="Upozornenia" onClick={() => navigate('/settings/notifications')} />
        <SettingsRow label="Súkromie" onClick={() => navigate('/settings/privacy')} />
        <SettingsRow label="Všetky nastavenia" onClick={() => navigate('/settings')} />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow label="Odhlásiť sa" tone="danger" onClick={handleSignOut} />
      </SettingsGroup>

    </div>
  );
}
