import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Copy, Share2, CheckCircle, Users, ChevronRight } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { colors, glassCard, fonts } from '../../theme/warmDusk';

function generateCodeFromUserId(userId: string): string {
  const cleaned = userId.replace(/-/g, '').toUpperCase().slice(0, 8);
  return `NEOME-${cleaned}`;
}

function generateCodeFromEmail(email: string): string {
  const hash = email
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let seed = hash;
  for (let i = 0; i < 8; i++) {
    result += chars[seed % chars.length];
    seed = Math.floor(seed / chars.length) + (seed % 7) * 31 + i * 13;
  }
  return `NEOME-${result}`;
}

export default function ReferralPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.id && user.id !== 'demo-user-id'
    ? generateCodeFromUserId(user.id)
    : user?.email
    ? generateCodeFromEmail(user.email)
    : 'NEOME-DEMO1234';

  const shareText = `Pridaj sa ku mne v NeoMe 🌸 Použi môj kód ${referralCode} pri registrácii a získaj prvý mesiac zdarma! neomeapp.netlify.app`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text visually
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'NeoMe — wellness pre ženy',
      text: shareText,
      url: 'https://neomeapp.netlify.app',
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share cancelled — no-op
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Zdieľaj kód',
      desc: 'Pošli kamarátke svoj jedinečný kód alebo odkaz',
      color: colors.strava,
    },
    {
      number: 2,
      title: 'Kamarátka sa zaregistruje',
      desc: 'Použije tvoj kód pri registrácii a aktivuje predplatné',
      color: colors.periodka,
    },
    {
      number: 3,
      title: 'Ty dostaneš mesiac zdarma',
      desc: 'Po aktivácii predplatného dostaneš 1 mesiac NeoMe zadarmo',
      color: colors.accent,
    },
  ];

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: colors.bgGradient }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors active:scale-95"
          style={{ background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.30)' }}
          aria-label="Späť"
        >
          <ArrowLeft className="w-4 h-4" style={{ color: colors.textPrimary }} />
        </button>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5" style={{ color: colors.accent }} strokeWidth={1.8} />
          <h1
            className="text-xl"
            style={{ fontFamily: fonts.display, color: colors.textPrimary, fontWeight: 600 }}
          >
            Odporúčaj & získaj
          </h1>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Hero */}
        <div
          className="p-5 text-center"
          style={glassCard}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, #96703C)` }}
          >
            <Gift className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h2
            className="text-lg mb-2"
            style={{ fontFamily: fonts.display, color: colors.textPrimary, fontWeight: 600 }}
          >
            Pozvi kamarátku, získaj mesiac zdarma
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
            Za každú kamarátku, ktorá sa zaregistruje a aktivuje predplatné, dostaneš{' '}
            <span className="font-semibold" style={{ color: colors.accent }}>1 mesiac NeoMe zadarmo</span>.
          </p>
        </div>

        {/* Referral code box */}
        <div style={glassCard} className="p-5">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: colors.textTertiary }}
          >
            Tvoj odporúčací kód
          </p>
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98]"
            style={{
              background: `${colors.accent}12`,
              border: `2px dashed ${colors.accent}50`,
            }}
          >
            <span
              className="text-2xl font-black tracking-widest"
              style={{ fontFamily: fonts.display, color: colors.accent }}
            >
              {referralCode}
            </span>
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors"
              style={{ backgroundColor: copied ? colors.strava : colors.accent }}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Skopírované!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Kopírovať
                </>
              )}
            </span>
          </button>
          <p className="text-xs mt-2 text-center" style={{ color: colors.textTertiary }}>
            Klepni na kód pre skopírovanie
          </p>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg, ${colors.accent}, #96703C)` }}
          >
            <Share2 className="w-4 h-4" />
            Zdieľaj s kamarátkou
          </button>
        </div>

        {/* Progress section */}
        <div style={glassCard} className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5" style={{ color: colors.accent }} strokeWidth={1.8} />
            <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
              Tvoje odporúčania
            </h3>
          </div>
          <div
            className="flex items-center justify-between p-4 rounded-2xl mb-3"
            style={{ background: `${colors.accent}10` }}
          >
            <div>
              <p className="text-3xl font-black" style={{ color: colors.accent }}>0</p>
              <p className="text-xs" style={{ color: colors.textTertiary }}>úspešných odporúčaní</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>0 mesiacov</p>
              <p className="text-xs" style={{ color: colors.textTertiary }}>kredity celkom</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: colors.textTertiary }}>
            Za každú potvrdenú registráciu s predplatným ti pripíšeme 1 mesiac NeoMe zadarmo.
          </p>
        </div>

        {/* How it works */}
        <div style={glassCard} className="p-5">
          <h3
            className="text-base mb-4"
            style={{ fontFamily: fonts.display, color: colors.textPrimary, fontWeight: 600 }}
          >
            Ako to funguje
          </h3>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step.number} className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {step.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 mt-2 flex-shrink-0" style={{ color: colors.textTertiary }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
