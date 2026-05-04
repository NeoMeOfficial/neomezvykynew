import { useNavigate } from 'react-router-dom';
import { GreetingHero } from '@/components/v2/greeting-hero';
import { PhaseStrip } from '@/components/v2/phase-strip';
import { RitualCard } from '@/components/v2/ritual-card';
import { UpgradeBanner } from '@/components/v2/upgrade-banner';
import { SectionHeader } from '@/components/ui/section-header';
import { BottomNav } from '@/components/v2/bottom-nav';
import { useUser } from '@/hooks/use-user';
import { useTodayRituals } from '@/hooks/use-today-rituals';
import { useCycle } from '@/hooks/use-cycle';

export default function DomovNew() {
  const navigate = useNavigate();
  const user = useUser();
  const rituals = useTodayRituals();
  const cycle = useCycle();

  const greeting = getTimeBasedGreeting();
  const showMealPlanUpsell = user.tier === 'plus' && !user.hasMealPlan;
  const showProgramFallback = user.tier === 'plus' && !user.hasProgram;
  const showFreeUpgrade = user.tier === 'free';

  return (
    <div className="min-h-screen bg-cream pb-28">
      <GreetingHero
        name={user.name}
        greeting={greeting}
        date={formatDateLong(new Date())}
      />

      <div className="mt-6 px-[18px]">
        {cycle ? (
          <PhaseStrip
            day={cycle.dayOfCycle}
            total={cycle.totalDays}
            phaseName={cycle.phaseName}
            phase={cycle.phase}
            note={cycle.note}
            onClick={() => navigate('/kniznica/periodka')}
          />
        ) : (
          <button
            onClick={() => navigate('/kniznica/periodka')}
            className="w-full text-left rounded-card p-4 flex items-center gap-4 border border-ink/[0.08] bg-white shadow-nm-sm"
          >
            <div className="h-12 w-12 rounded-full bg-ink/[0.06] flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-h3 text-ink/40">?</span>
            </div>
            <div className="flex-1">
              <div className="font-sans text-[11px] uppercase tracking-eyebrow text-ink/40 mb-0.5">Cyklus</div>
              <div className="font-serif text-h3 text-ink">Nastav sledovanie cyklu</div>
              <div className="font-sans text-sm text-ink/56 mt-0.5">Klikni sem a nastav prvý deň</div>
            </div>
          </button>
        )}
      </div>

      {showFreeUpgrade && (
        <div className="mt-4 px-[18px]">
          <UpgradeBanner
            headline="Programy, jedálniček a meditácie"
            sub="Odomkni v Plus"
            onClick={() => navigate('/paywall')}
          />
        </div>
      )}

      <SectionHeader eyebrow="DNES" className="mt-6 px-[22px]" />

      <div className="mt-3 px-[18px] flex flex-col gap-3">
        <RitualCard
          pillar="telo"
          eyebrow="POHYB"
          title={rituals.telo.title}
          subtitle={rituals.telo.subtitle}
          status={rituals.telo.status}
          duration={rituals.telo.duration}
          fallback={showProgramFallback ? 'navrhnuty-cvik' : undefined}
          href={rituals.telo.href}
        />

        <RitualCard
          pillar="strava"
          eyebrow="JEDÁLNIČEK"
          title={rituals.strava.title}
          subtitle={rituals.strava.subtitle}
          status={rituals.strava.status}
          upsell={showMealPlanUpsell ? 'sada' : undefined}
          href={rituals.strava.href}
        />

        <RitualCard
          pillar="mysel"
          eyebrow="MEDITÁCIA"
          title={rituals.mysel.title}
          subtitle={rituals.mysel.subtitle}
          status={rituals.mysel.status}
          duration={rituals.mysel.duration}
          locked={user.tier === 'free' && !rituals.mysel.freeAccess}
          href={rituals.mysel.href}
        />

        <RitualCard
          pillar="ink"
          eyebrow="NÁVYKY"
          title="Dnešné návyky"
          subtitle="Sleduj svoje každodenné zvyky"
          status="not-started"
          href="/navyky"
        />

        <RitualCard
          pillar="ink"
          eyebrow="REFLEXIE"
          title="Krátky zápis na večer"
          subtitle="Čo dnes bolo dobré?"
          status="not-started"
          href="/dennik/new"
        />
      </div>

      <BottomNav active="domov" />
    </div>
  );
}

function getTimeBasedGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Krásne ráno';
  if (h < 17) return 'Krásny deň';
  return 'Krásny večer';
}

function formatDateLong(d: Date): string {
  const days = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
  const months = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  return `${days[d.getDay()]} · ${d.getDate()}. ${months[d.getMonth()]}`;
}
