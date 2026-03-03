import { useNavigate } from 'react-router-dom';
import { Gift, Euro, ArrowRight } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';
import { useReferral } from '../../../hooks/useReferral';

export default function ReferralMenuItem() {
  const navigate = useNavigate();
  const { credits, stats, loading } = useReferral();

  const formatCredits = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/30 opacity-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate('/referral')}
      className="w-full bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/30 transition-all active:scale-95"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)` }}
        >
          <Gift className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 text-left">
          <h3 className="font-bold" style={{ color: colors.textPrimary }}>
            Odporúčaj priateľkám
          </h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {credits?.total_credits ? (
              `€${formatCredits(credits.total_credits)} dostupných kreditov`
            ) : (
              'Získaj €14 za každé odporúčanie'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {stats && stats.totalReferrals > 0 && (
            <div className="flex items-center gap-1">
              <Euro className="w-4 h-4" style={{ color: colors.accent }} />
              <span className="text-sm font-bold" style={{ color: colors.accent }}>
                {stats.totalReferrals}
              </span>
            </div>
          )}
          <ArrowRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
        </div>
      </div>
    </button>
  );
}