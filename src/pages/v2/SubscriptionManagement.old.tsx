import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Calendar, AlertCircle, Check, X, Crown, Gift, Settings, ExternalLink, Star } from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS, formatPrice } from '../../lib/stripe';
import DemoBanner from '../../components/v2/DemoBanner';

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const { 
    subscription, 
    isPremium, 
    isTrialing, 
    daysLeft, 
    startCheckout, 
    manageBilling, 
    cancelSubscription,
    isLoading 
  } = useSubscription();
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Format subscription data
  const subscriptionData = subscription ? {
    plan: isTrialing ? 'Skúšobné obdobie' : 'NeoMe Premium',
    status: subscription.status === 'active' ? 'Aktívne' : 
             subscription.status === 'trialing' ? 'Skúšobné' :
             subscription.status === 'past_due' ? 'Neuhradené' : 'Neaktívne',
    price: formatPrice(SUBSCRIPTION_PLANS.premium.price),
    billingPeriod: 'mesačne',
    nextBilling: new Date(subscription.current_period_end * 1000).toLocaleDateString('sk-SK'),
    startDate: new Date(subscription.current_period_start * 1000).toLocaleDateString('sk-SK'),
    paymentMethod: 'Visa •••• 4242',
    willCancelAtPeriodEnd: subscription.cancel_at_period_end,
    trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000).toLocaleDateString('sk-SK') : null
  } : null;

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      await cancelSubscription();
      setShowCancelDialog(false);
      alert('Predplatné bolo zrušené. Môžete pokračovať v používaní aplikácie do ' + (subscriptionData?.nextBilling || 'konca obdobia'));
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Nastala chyba pri zrušení predplatného. Skúste to znova.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      await manageBilling();
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      alert('Nastala chyba pri prístupe k fakturačnému portálu. Skúste to znova.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartSubscription = async () => {
    setActionLoading(true);
    try {
      await startCheckout(SUBSCRIPTION_PLANS.premium.priceId);
    } catch (error) {
      console.error('Error starting subscription:', error);
      alert('Nastala chyba pri spustení predplatného. Skúste to znova.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Show subscription purchase interface if no subscription
  if (!subscription) {
    return (
      <div className="min-h-screen pb-28" style={{ background: colors.bgGradient }}>
        <div className="w-full px-4 py-6 space-y-6">
          {/* Header */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/profil')} className="p-1">
                <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
              </button>
              <div className="flex-1">
                <h1 className="text-[18px] font-bold" style={{ color: colors.textPrimary }}>
                  Predplatné
                </h1>
                <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                  Začnite svoju premium wellness cestu
                </p>
              </div>
              <Star className="w-6 h-6" style={{ color: colors.accent }} />
            </div>
          </div>

          {/* Demo Mode Banner */}
          <DemoBanner 
            message="🎯 Demo Mode: Môžete bezpečne testovať všetky funkcie predplatného. Žiadne skutočné poplatky nebudú účtované."
            type="demo"
          />

          {/* Premium Plan Offer */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl mx-auto flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-orange-800 mb-2">
                  NeoMe Premium
                </h2>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-orange-800">
                    {formatPrice(SUBSCRIPTION_PLANS.premium.price)}
                  </span>
                  <span className="text-sm text-orange-600">/ mesiac</span>
                </div>
                <p className="text-sm text-orange-600">
                  Prvých 7 dní zadarmo
                </p>
              </div>
            </div>

            <div className="space-y-3 my-6">
              {SUBSCRIPTION_PLANS.premium.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleStartSubscription}
              disabled={actionLoading}
              className="w-full py-4 bg-orange-600 text-white rounded-xl text-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Spracováva sa...' : `Začať skúšku zadarmo`}
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-3">
              Môžete kedykoľvek zrušiť. Žiadne poplatky počas skúšobného obdobia.
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20">
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
              Prečo si vybrať Premium?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.telo + '20' }}>
                  <Gift className="w-4 h-4" style={{ color: colors.telo }} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: colors.textPrimary }}>
                    Kompletné fitness programy
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    4 úrovne náročnosti prispôsobené vášmu cyklu
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.strava + '20' }}>
                  <CreditCard className="w-4 h-4" style={{ color: colors.strava }} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: colors.textPrimary }}>
                    Recepty z Tesca
                  </p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    108 receptov s bežnými ingredienciami
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCancelDialog) {
    return (
      <div className="min-h-screen pb-28" style={{ background: colors.bgGradient }}>
        <div className="w-full px-4 py-6 space-y-6">
          {/* Cancel Dialog */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setShowCancelDialog(false)} className="p-1">
                <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
              </button>
              <h2 className="text-[18px] font-bold" style={{ color: colors.textPrimary }}>
                Zrušiť predplatné
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50">
                <AlertCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    Naozaj chcete zrušiť predplatné?
                  </h3>
                  <p className="text-xs text-red-700">
                    Po zrušení stratíte prístup ku všetkým premium funkciám od {formatDate(subscriptionData.nextBilling)}.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Povedzte nám prečo odchádzate (voliteľné)
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm"
                  style={{ color: colors.textPrimary }}
                >
                  <option value="">Vyberte dôvod...</option>
                  <option value="too-expensive">Príliš drahé</option>
                  <option value="not-using">Nevyužívam funkcionalitu</option>
                  <option value="technical-issues">Technické problémy</option>
                  <option value="found-alternative">Našiel som alternatívu</option>
                  <option value="temporary">Dočasná prestávka</option>
                  <option value="other">Iný dôvod</option>
                </select>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Ruší sa...' : 'Potvrdiť zrušenie'}
                </button>
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="w-full py-3 rounded-xl bg-white/40 backdrop-blur-sm font-medium transition-colors"
                  style={{ color: colors.textPrimary }}
                >
                  Zrušiť
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: colors.bgGradient }}>
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/profil')} className="p-1">
              <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
            </button>
            <div className="flex-1">
              <h1 className="text-[18px] font-bold" style={{ color: colors.textPrimary }}>
                Predplatné
              </h1>
              <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                {isTrialing ? `Skúška končí za ${daysLeft} dní` : 'Spravujte vaše predplatné a platby'}
              </p>
            </div>
            <Crown className="w-6 h-6" style={{ color: colors.accent }} />
          </div>
        </div>

        {/* Demo Mode Banner */}
        <DemoBanner 
          message="🎯 Demo Mode: Testujete funkcionalitu predplatného. V produkčnej verzii by tu boli skutočné platby cez Stripe."
          type="demo"
        />

        {/* Trial Warning Banner */}
        {isTrialing && daysLeft <= 3 && (
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-800 mb-1">
                  Skúška končí za {daysLeft} {daysLeft === 1 ? 'deň' : daysLeft <= 4 ? 'dni' : 'dní'}
                </h3>
                <p className="text-sm text-orange-700 mb-3">
                  Pokračujte v používaní všetkých premium funkcií. Môžete kedykoľvek zrušiť.
                </p>
                <button 
                  onClick={handleStartSubscription}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Spracováva sa...' : 'Pokračovať s Premium'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Notice */}
        {subscriptionData?.willCancelAtPeriodEnd && (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <div className="flex items-start gap-3">
              <X className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-1">
                  Predplatné bude zrušené
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  Váš prístup k premium funkciám končí {subscriptionData.nextBilling}. Môžete kedykoľvek obnoviť predplatné.
                </p>
                <button 
                  onClick={handleStartSubscription}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Spracováva sa...' : 'Obnoviť predplatné'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {subscriptionData.plan}
                </h2>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {subscriptionData.status}
                </span>
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {subscriptionData.price}/{subscriptionData.billingPeriod}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                Ďalšie účtovanie
              </p>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {formatDate(subscriptionData.nextBilling)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <span style={{ color: colors.textSecondary }}>
                Predplatné od {formatDate(subscriptionData.startDate)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4" style={{ color: colors.textSecondary }} />
              <span style={{ color: colors.textSecondary }}>
                {subscriptionData.paymentMethod}
              </span>
              <button 
                onClick={handleManageBilling}
                disabled={actionLoading}
                className="ml-auto text-xs px-2 py-1 rounded-lg bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors disabled:opacity-50"
                style={{ color: colors.accent }}
              >
                {actionLoading ? '...' : 'Zmeniť'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20">
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            Rýchle akcie
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5" style={{ color: colors.accent }} />
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Odporučiť kamarátke
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Mesiac zadarmo
                </span>
                <ExternalLink className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" style={{ color: colors.textSecondary }} />
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  Notifikácie
                </span>
              </div>
              <ExternalLink className="w-4 h-4" style={{ color: colors.textSecondary }} />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" style={{ color: colors.textSecondary }} />
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  História platieb
                </span>
              </div>
              <ExternalLink className="w-4 h-4" style={{ color: colors.textSecondary }} />
            </button>
          </div>
        </div>

        {/* Upgrade Offer */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-start gap-3">
            <Crown className="w-6 h-6 text-orange-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-orange-800 mb-1">
                Získajte viac za menej!
              </h3>
              <p className="text-sm text-orange-700 mb-3">
                Prejdite na ročné predplatné a ušetrite 20%. Plus získate exkluzívny prístup k novým funkciám.
              </p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors">
                Prejsť na ročné
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20">
          <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
            Potrebujete pomoc?
          </h3>
          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
            Ak máte otázky alebo problémy s predplatným, kontaktujte našu podporu.
          </p>
          <div className="space-y-2">
            <button className="w-full py-3 rounded-xl bg-white/40 backdrop-blur-sm font-medium hover:bg-white/60 transition-colors">
              <span style={{ color: colors.textPrimary }}>
                Kontaktovať podporu
              </span>
            </button>
            <button 
              onClick={() => setShowCancelDialog(true)}
              className="w-full py-3 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              Zrušiť predplatné
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}