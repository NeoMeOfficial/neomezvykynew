import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, AlertCircle, Check, X, Gift, Settings, ExternalLink, ChevronRight } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS, formatPrice } from '../../lib/stripe';
import DemoBanner from '../../components/v2/DemoBanner';
import { TopBar } from '@/components/v2/top-bar';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { SerifHeader } from '@/components/ui/serif-header';
import { SettingsGroup, SettingsRow } from '@/components/v2/settings-row';

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const {
    subscription, isPremium, isTrialing, daysLeft,
    startCheckout, manageBilling, cancelSubscription, isLoading,
  } = useSubscription();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const subData = subscription ? {
    plan: isTrialing ? 'Skúšobné obdobie' : 'NeoMe Plus',
    status: subscription.status === 'active' ? 'Aktívne' :
            subscription.status === 'trialing' ? 'Skúšobné' :
            subscription.status === 'past_due' ? 'Neuhradené' : 'Neaktívne',
    price: formatPrice(SUBSCRIPTION_PLANS.premium.price),
    nextBilling: new Date(subscription.current_period_end * 1000).toLocaleDateString('sk-SK'),
    startDate: new Date(subscription.current_period_start * 1000).toLocaleDateString('sk-SK'),
    willCancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEndsAt: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toLocaleDateString('sk-SK')
      : null,
  } : null;

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await cancelSubscription();
      setShowCancelDialog(false);
    } catch { /* handled by context */ }
    finally { setActionLoading(false); }
  };

  const handleBilling = async () => {
    setActionLoading(true);
    try { await manageBilling(); }
    catch { /* handled by context */ }
    finally { setActionLoading(false); }
  };

  const handleStart = async () => {
    setActionLoading(true);
    try { await startCheckout(SUBSCRIPTION_PLANS.premium.priceId); }
    catch { /* handled by context */ }
    finally { setActionLoading(false); }
  };

  // Cancel confirmation screen
  if (showCancelDialog && subData) {
    return (
      <div className="min-h-screen bg-cream pb-12">
        <TopBar title="Zrušiť predplatné" onBack={() => setShowCancelDialog(false)} />

        <div className="px-5 pt-2 flex flex-col gap-4">
          <div className="rounded-card bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-sans text-sm font-semibold text-red-800 mb-1">Naozaj chcete zrušiť?</div>
              <BodyText size="sm" className="text-red-700">
                Prístup k Plus funkciám stratíte od {subData.nextBilling}.
              </BodyText>
            </div>
          </div>

          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
            <label className="font-sans text-xs font-medium uppercase tracking-[0.1em] text-ink/56 mb-2 block">
              Prečo odchádzate? (voliteľné)
            </label>
            <select
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-cream-200 border border-ink/[0.10] font-sans text-sm text-ink focus:outline-none focus:border-ink/30"
            >
              <option value="">Vyberte dôvod…</option>
              <option value="too-expensive">Príliš drahé</option>
              <option value="not-using">Nevyužívam funkcionalitu</option>
              <option value="technical-issues">Technické problémy</option>
              <option value="found-alternative">Našiel som alternatívu</option>
              <option value="temporary">Dočasná prestávka</option>
              <option value="other">Iný dôvod</option>
            </select>
          </div>

          <button
            onClick={handleCancel}
            disabled={actionLoading}
            className="w-full py-4 rounded-full bg-red-500 text-white font-sans font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {actionLoading ? 'Ruší sa…' : 'Potvrdiť zrušenie'}
          </button>
          <button
            onClick={() => setShowCancelDialog(false)}
            className="w-full py-4 rounded-full bg-white border border-ink/[0.08] text-ink font-sans font-medium"
          >
            Späť
          </button>
        </div>
      </div>
    );
  }

  // No subscription — upgrade screen
  if (!subscription) {
    return (
      <div className="min-h-screen bg-cream pb-12">
        <TopBar title="Predplatné" backHref="/profil" />

        <div className="px-5 pt-2 flex flex-col gap-4">
          <DemoBanner
            message="Demo Mode: Môžete bezpečne testovať všetky funkcie predplatného."
            type="demo"
          />

          {/* Plan card */}
          <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-6 text-center">
            <div className="h-14 w-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <span className="font-sans text-xl font-bold text-gold">+</span>
            </div>
            <SerifHeader as="h2" size="h2" className="mb-1">NeoMe Plus</SerifHeader>
            <div className="flex items-baseline justify-center gap-1 mt-2 mb-1">
              <span className="font-serif text-h1 text-ink">{formatPrice(SUBSCRIPTION_PLANS.premium.price)}</span>
              <span className="font-sans text-sm text-ink/56">/ mesiac</span>
            </div>
            <Eyebrow tone="gold" className="mb-5">Prvých 7 dní zadarmo</Eyebrow>

            <div className="flex flex-col gap-2 mb-6 text-left">
              {SUBSCRIPTION_PLANS.premium.features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="size-4 text-pillar-strava flex-shrink-0" />
                  <BodyText size="sm">{f}</BodyText>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              disabled={actionLoading}
              className="w-full py-4 rounded-full bg-ink text-cream font-sans font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {actionLoading ? 'Spracováva sa…' : 'Začať skúšku zadarmo'}
            </button>
            <BodyText size="sm" tone="muted" className="mt-3">
              Môžete kedykoľvek zrušiť.
            </BodyText>
          </div>
        </div>
      </div>
    );
  }

  // Active subscription
  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Predplatné" backHref="/profil" />

      <div className="px-5 pt-2 flex flex-col gap-4">
        <DemoBanner
          message="Demo Mode: V produkčnej verzii by tu boli skutočné platby cez Stripe."
          type="demo"
        />

        {/* Trial ending warning */}
        {isTrialing && daysLeft <= 3 && (
          <div className="rounded-card bg-gold/[0.08] border border-gold/20 p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-gold mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-sans text-sm font-semibold text-ink mb-1">
                Skúška končí za {daysLeft} {daysLeft === 1 ? 'deň' : daysLeft <= 4 ? 'dni' : 'dní'}
              </div>
              <BodyText size="sm" tone="secondary" className="mb-3">
                Pokračujte v Plus bez prerušenia.
              </BodyText>
              <button onClick={handleStart} disabled={actionLoading}
                className="px-4 py-2 bg-ink text-cream rounded-full font-sans text-sm font-medium disabled:opacity-50">
                {actionLoading ? '…' : 'Aktivovať Plus'}
              </button>
            </div>
          </div>
        )}

        {/* Cancellation notice */}
        {subData?.willCancelAtPeriodEnd && (
          <div className="rounded-card bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <X className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-sans text-sm font-semibold text-red-800 mb-1">Predplatné bude zrušené</div>
              <BodyText size="sm" className="text-red-700 mb-3">Prístup k Plus funkciám končí {subData.nextBilling}.</BodyText>
              <button onClick={handleStart} disabled={actionLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-full font-sans text-sm font-medium disabled:opacity-50">
                {actionLoading ? '…' : 'Obnoviť predplatné'}
              </button>
            </div>
          </div>
        )}

        {/* Current plan */}
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <SerifHeader as="div" size="h3">{subData!.plan}</SerifHeader>
                <span className="font-sans text-[10px] px-2 py-0.5 rounded-full bg-pillar-strava/15 text-pillar-strava font-medium">
                  {subData!.status}
                </span>
              </div>
              <Eyebrow tone="muted">{subData!.price} / mesiac</Eyebrow>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-ink/40 flex-shrink-0" />
              <BodyText size="sm" tone="secondary">Predplatné od {subData!.startDate}</BodyText>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-ink/40 flex-shrink-0" />
              <BodyText size="sm" tone="secondary">Ďalšie účtovanie {subData!.nextBilling}</BodyText>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-ink/40 flex-shrink-0" />
              <BodyText size="sm" tone="secondary" className="flex-1">Visa •••• 4242</BodyText>
              <button onClick={handleBilling} disabled={actionLoading}
                className="font-sans text-xs font-medium text-terra disabled:opacity-50">
                {actionLoading ? '…' : 'Zmeniť'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <SettingsGroup label="Možnosti">
          <SettingsRow label="Odporučiť kamarátke" value="Mesiac zadarmo" onClick={() => navigate('/referral')} />
          <SettingsRow label="Notifikácie" onClick={() => navigate('/settings/notifications')} />
          <SettingsRow label="História platieb" onClick={handleBilling} />
        </SettingsGroup>

        {/* Help + cancel */}
        <SettingsGroup label="Pomoc">
          <SettingsRow label="Kontaktovať podporu" onClick={() => {}} />
          <SettingsRow label="Zrušiť predplatné" tone="danger" onClick={() => setShowCancelDialog(true)} />
        </SettingsGroup>
      </div>
    </div>
  );
}
