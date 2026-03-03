import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gift, Heart, Users, Star, ArrowRight } from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import { useReferral } from '../../hooks/useReferral';

export default function ReferralLanding() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { processReferral } = useReferral();
  const [validCode, setValidCode] = useState<boolean | null>(null);

  useEffect(() => {
    // Store referral code in localStorage for use after registration
    if (code) {
      localStorage.setItem('referralCode', code);
      
      // Validate code exists (you could add an API call here)
      setValidCode(true);
    }
  }, [code]);

  const handleGetStarted = () => {
    navigate('/auth?mode=register&ref=' + code);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
      <div className="p-5 space-y-8 pt-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)` }}>
            <Gift className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Vitaj v NeoMe! 🌟
          </h1>
          
          <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
            Tvoja priateľka ťa pozvala do holistickej wellness komunity pre ženy
          </p>

          {code && validCode && (
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 mx-auto max-w-xs mb-8 border border-white/30">
              <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>Používaš kód:</p>
              <div className="text-2xl font-black" style={{ color: colors.accent }}>
                {code}
              </div>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: colors.textPrimary }}>
            Čo ťa čaká v NeoMe
          </h2>

          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: `${colors.telo}10` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.telo }}>
                <span className="text-white text-xl">💪</span>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>Cvičebné programy</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Postpartum, Body forming, Strong & Sexy</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: `${colors.strava}10` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.strava }}>
                <span className="text-white text-xl">🥗</span>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>Jedálne plány</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>108 receptov prispôsobených tvojim potrebám</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: `${colors.mysel}10` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.mysel }}>
                <span className="text-white text-xl">🧘‍♀️</span>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>Meditácie</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Vnútorný pokoj a sebaláska</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ backgroundColor: `${colors.periodka}10` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.periodka }}>
                <span className="text-white text-xl">📅</span>
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>Tracking cyklu</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>Porozumej svojmu telu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Offer */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white/30 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: colors.periodka }}>
            <Heart className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Špeciálna ponuka
          </h2>
          
          <p className="mb-6" style={{ color: colors.textSecondary }}>
            Začni svoju wellness cestu už dnes za výhodnú cenu
          </p>

          <div className="bg-gradient-to-r rounded-2xl p-6 mb-6 text-white" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}>
            <div className="text-3xl font-black mb-2">€14.90</div>
            <div className="text-sm opacity-90">mesačne • prvý mesiac zdarma</div>
          </div>

          <button
            onClick={handleGetStarted}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.periodka})` }}
          >
            Začať zadarmo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Social Proof */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            Už tisíce žien dôverujú NeoMe
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm" style={{ color: colors.textPrimary }}>Martina K.</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  "Konečne aplikácia, ktorá rozumie ženským potrebám. Postpartum program mi úplne zmenil život!"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm" style={{ color: colors.textPrimary }}>Petra S.</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  "Recepty sú úžasné a cvičenia perfektne prispôsobené. Odporúčam každej maminke!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center items-center gap-6 text-sm" style={{ color: colors.textTertiary }}>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>300+ spokojných klientok</span>
          </div>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.textTertiary }}></div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>Slovenský produkt</span>
          </div>
        </div>
      </div>
    </div>
  );
}