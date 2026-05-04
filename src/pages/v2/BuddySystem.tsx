import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserPlus, Heart } from 'lucide-react';
import BuddyCodeCard from '../../components/v2/buddy/BuddyCodeCard';
import BuddyFinder from '../../components/v2/buddy/BuddyFinder';
import BuddyDashboard from '../../components/v2/buddy/BuddyDashboard';
import { useBuddySystem } from '../../hooks/useBuddySystem';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';

const TABS = [
  { key: 'dashboard', label: 'Prehľad', Icon: Users },
  { key: 'find', label: 'Nájsť buddy', Icon: UserPlus },
  { key: 'mycode', label: 'Môj kód', Icon: Heart },
] as const;

type Tab = typeof TABS[number]['key'];

export default function BuddySystem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, hasBuddies } = useBuddySystem();
  const [activeTab, setActiveTab] = useState<Tab>(hasBuddies ? 'dashboard' : 'mycode');

  const referrer = location.state?.from || '/domov-new';

  const HOW_IT_WORKS = [
    { num: '1', label: 'Zdieľaj kód', desc: 'Pošli svoj 6-miestny buddy kód kamarátke.', color: 'bg-gold text-white' },
    { num: '2', label: 'Pripojte sa', desc: 'Ona zadá tvoj kód a pošle žiadosť o spojenie.', color: 'bg-pillar-strava text-white' },
    { num: '3', label: 'Motivujte sa', desc: 'Vidíte navzájom úspechy a podporujete sa.', color: 'bg-mauve text-white' },
  ];

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Buddy System" onBack={() => navigate(referrer)} />

      <div className="px-5 pt-2 flex flex-col gap-4">
        {/* Stats strip — visible only if user has buddies/pending */}
        {(stats.totalBuddies > 0 || stats.pendingRequestsCount > 0) && (
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-4">
            <div className="flex justify-around">
              {[
                { value: stats.totalBuddies, label: 'Buddy', color: 'text-pillar-strava' },
                { value: stats.pendingRequestsCount, label: 'Žiadosti', color: 'text-gold' },
                { value: stats.unreadNotifications, label: 'Aktivity', color: 'text-mauve' },
              ].map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <div className={`font-serif text-h2 ${color}`}>{value}</div>
                  <Eyebrow tone="muted">{label}</Eyebrow>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab toggle */}
        <div className="flex gap-1 p-1 bg-cream-200 rounded-xl">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-sans text-xs font-medium transition-all ${
                activeTab === key ? 'bg-white shadow-nm-sm text-ink' : 'text-ink/56'
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'dashboard' && <BuddyDashboard />}
        {activeTab === 'find' && <BuddyFinder />}
        {activeTab === 'mycode' && <BuddyCodeCard />}

        {/* How it works */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <SerifHeader as="h3" size="h3" className="mb-4">Ako funguje Buddy System?</SerifHeader>
          <div className="flex flex-col gap-4">
            {HOW_IT_WORKS.map(({ num, label, desc, color }) => (
              <div key={num} className="flex items-start gap-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center font-sans text-xs font-bold flex-shrink-0 ${color}`}>
                  {num}
                </div>
                <div>
                  <BodyText size="sm" className="font-medium">{label}</BodyText>
                  <BodyText size="sm" tone="muted">{desc}</BodyText>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <Eyebrow className="mb-3">Tipy pre lepšiu motiváciu</Eyebrow>
          <div className="flex flex-col gap-2">
            {[
              'Dohodnte si spoločné cvičenie o rovnakom čase.',
              'Gratulujte si navzájom k úspechom.',
              'Vytvorte si týždenné výzvy.',
              'Zdieľajte pokrok vo svojich obľúbených receptoch.',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-gold mt-0.5 font-sans text-sm">·</span>
                <BodyText size="sm" tone="secondary">{tip}</BodyText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
