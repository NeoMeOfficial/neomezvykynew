import { useState } from 'react';
import { Share2, Copy, Users, Gift, Euro, CheckCircle, Clock } from 'lucide-react';
import { colors, glassCard } from '../../../theme/warmDusk';
import { useReferral } from '../../../hooks/useReferral';

export default function ReferralCenter() {
  const { referralCode, credits, stats, getShareUrl, getShareText, loading } = useReferral();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (referralCode?.code) {
      navigator.clipboard.writeText(referralCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'NeoMe - Holistická wellness pre ženy',
      text: getShareText(),
      url: getShareUrl()
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const formatCredits = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
        <div className="p-5 pt-16">
          <div className="p-8 text-center" style={glassCard}>
            <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Načítavam...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
      <div className="p-5 space-y-6 pt-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Odporúčaj & získaj
          </h1>
          <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
            Zdieľaj NeoMe s priateľkami a získaj kredity
          </p>
        </div>

        {/* Credits Overview */}
        <div className="p-6" style={glassCard}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)` }}>
              <Euro className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
              €{formatCredits(credits?.total_credits || 0)}
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Dostupné kredity
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: colors.strava }}>
                {stats?.totalReferrals || 0}
              </div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>Celkom odporúčaní</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: colors.periodka }}>
                {stats?.approvedReferrals || 0}
              </div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>Schválené</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: colors.mysel }}>
                €{formatCredits(stats?.totalCreditsEarned || 0)}
              </div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>Celkom získané</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="p-6" style={glassCard}>
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Ako to funguje
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: colors.strava }}>
                1
              </div>
              <div>
                <h4 className="font-medium" style={{ color: colors.textPrimary }}>Zdieľaj svoj kód</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Pošli priateľkám svoj jedinečný kód alebo odkaz
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: colors.periodka }}>
                2
              </div>
              <div>
                <h4 className="font-medium" style={{ color: colors.textPrimary }}>Registrácia a predplatné</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Priateľka sa zaregistruje a objedná si NeoMe predplatné
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: colors.accent }}>
                3
              </div>
              <div>
                <h4 className="font-medium" style={{ color: colors.textPrimary }}>Získaš €14 kredit</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Kredit sa automaticky pripíše a zníži tvoje ďalšie platby
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code & Share */}
        <div className="p-6" style={glassCard}>
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Tvoj odporúčací kód
          </h3>

          {referralCode && (
            <>
              <div className="flex items-center justify-between p-4 rounded-2xl mb-4" style={{ backgroundColor: `${colors.accent}10` }}>
                <div>
                  <div className="text-2xl font-black" style={{ color: colors.accent }}>
                    {referralCode.code}
                  </div>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>Tvoj jedinečný kód</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl transition-colors"
                  style={{ backgroundColor: copied ? colors.strava : colors.accent }}
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Copy className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-white font-medium shadow-md transition-transform active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}DD)` }}
                >
                  <Share2 className="w-5 h-5" />
                  Zdieľať
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-white font-medium shadow-md transition-transform active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${colors.strava}, ${colors.strava}DD)` }}
                >
                  <Copy className="w-5 h-5" />
                  Odkaz
                </button>
              </div>
            </>
          )}
        </div>

        {/* Pending Referrals */}
        {stats && stats.pendingReferrals > 0 && (
          <div className="p-6" style={glassCard}>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Čakajúce odporúčania
            </h3>
            
            <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ backgroundColor: `${colors.mysel}10` }}>
              <Clock className="w-6 h-6" style={{ color: colors.mysel }} />
              <div>
                <div className="font-medium" style={{ color: colors.textPrimary }}>
                  {stats.pendingReferrals} priateľiek sa registrovalo
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Kredity dostaneš po objednaní predplatného
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        <div className="p-6" style={glassCard}>
          <h3 className="text-lg font-bold mb-3" style={{ color: colors.textPrimary }}>
            Podmienky programu
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
            <li>• €14 kredit za každé úspešné odporúčanie</li>
            <li>• Kredit sa pripíše po objednaní predplatného odporučenou osobou</li>
            <li>• Kredity sa automaticky aplikujú na ďalšie platby</li>
            <li>• Kredity nemožno vymeniť za hotovosť</li>
            <li>• Program platí pre všetky aktívne používateľky</li>
          </ul>
        </div>
      </div>
    </div>
  );
}