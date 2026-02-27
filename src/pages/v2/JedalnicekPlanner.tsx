import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import ProgressRing from '../../components/v2/ProgressRing';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';
import { usePaywall } from '../../hooks/usePaywall';
import { MealPlannerBanner } from '../../components/v2/paywall/MealPlannerBanner';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

const meals = [
  {
    type: 'Raňajky',
    filled: true,
    title: 'Proteínová kaša s ovocím',
    kcal: 320,
  },
  {
    type: 'Obed',
    filled: true,
    title: 'Grécky šalát s kuracím',
    kcal: 450,
  },
  {
    type: 'Večera',
    filled: false,
    title: '',
    kcal: 0,
  },
  {
    type: 'Snack',
    filled: true,
    title: 'Proteínová tyčinka',
    kcal: 180,
  },
];

export default function JedalnicekPlanner() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState(2);
  const { canUseMealPlanner } = useSubscription();
  const { paywallState, showMealPlannerPaywall, closePaywall, handleUpgrade } = usePaywall();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <UtensilsCrossed className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Jedálniček</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Personalizované menu pre každý deň
          </p>
        </div>
      </div>

      {/* Show banner and locked interface for free users */}
      {!canUseMealPlanner ? (
        <>
          <MealPlannerBanner onPurchase={showMealPlannerPaywall} />
          
          {/* Preview interface (disabled) */}
          <div className="relative">
            <div className="absolute inset-0 bg-black/10 z-10 rounded-3xl" onClick={showMealPlannerPaywall} />
            
            {/* Day Pills - disabled */}
            <div className="flex gap-2 opacity-50">
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  className={`flex-1 py-2 rounded-2xl text-xs font-medium ${
                    activeDay === i
                      ? 'bg-[#2E2218] text-white'
                      : 'text-[#999999]'
                  }`}
                  style={activeDay !== i ? {
                    background: 'rgba(255,255,255,0.55)',
                  } : undefined}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Meals - disabled */}
            <div className="space-y-3 mt-6 opacity-50">
              {meals.map((m) => (
                <GlassCard key={m.type} className="!p-4">
                  <p className="text-xs text-[#999999] mb-2">{m.type}</p>
                  {m.filled ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#2E2218]">{m.title}</p>
                      <span className="text-xs text-[#999999]">{m.kcal} kcal</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-[#6B4C3B] font-medium border-2 border-dashed border-[#E0E0E0] rounded-2xl w-full py-3 justify-center">
                      <Plus className="w-4 h-4" /> Pridať
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>

            {/* Summary - disabled */}
            <GlassCard className="flex items-center gap-4 mt-6 opacity-50">
              <ProgressRing progress={43} size={64} stroke={5} color="#B8864A">
                <span className="text-xs font-semibold text-[#2E2218]">950</span>
              </ProgressRing>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-semibold text-[#2E2218]">950 / 2 200 kcal</p>
                {[
                  { label: 'Bielkoviny', current: 48, target: 120, color: '#6B4C3B' },
                  { label: 'Sacharidy', current: 95, target: 250, color: '#B8864A' },
                  { label: 'Tuky', current: 22, target: 70, color: '#7A9E78' },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-[#666666]">{m.label}</span>
                      <span className="text-[#999999]">{m.current}g / {m.target}g</span>
                    </div>
                    <div className="h-1 rounded-full bg-black/5">
                      <div className="h-full rounded-full" style={{ width: `${(m.current / m.target) * 100}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      ) : (
        <>
          {/* Full interface for premium users */}
          {/* Day Pills */}
          <div className="flex gap-2">
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setActiveDay(i)}
                className={`flex-1 py-2 rounded-2xl text-xs font-medium transition-all ${
                  activeDay === i
                    ? 'bg-[#2E2218] text-white'
                    : 'text-[#999999]'
                }`}
                style={activeDay !== i ? {
                  background: 'rgba(255,255,255,0.55)',
                } : undefined}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Meals */}
          <div className="space-y-3">
            {meals.map((m) => (
              <GlassCard key={m.type} className="!p-4">
                <p className="text-xs text-[#999999] mb-2">{m.type}</p>
                {m.filled ? (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#2E2218]">{m.title}</p>
                    <span className="text-xs text-[#999999]">{m.kcal} kcal</span>
                  </div>
                ) : (
                  <button 
                    className="flex items-center gap-2 text-sm text-[#6B4C3B] font-medium border-2 border-dashed border-[#E0E0E0] rounded-2xl w-full py-3 justify-center"
                  >
                    <Plus className="w-4 h-4" /> Pridať
                  </button>
                )}
              </GlassCard>
            ))}
          </div>

          {/* Summary */}
          <GlassCard className="flex items-center gap-4">
            <ProgressRing progress={43} size={64} stroke={5} color="#B8864A">
              <span className="text-xs font-semibold text-[#2E2218]">950</span>
            </ProgressRing>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-[#2E2218]">950 / 2 200 kcal</p>
              {[
                { label: 'Bielkoviny', current: 48, target: 120, color: '#6B4C3B' },
                { label: 'Sacharidy', current: 95, target: 250, color: '#B8864A' },
                { label: 'Tuky', current: 22, target: 70, color: '#7A9E78' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-[#666666]">{m.label}</span>
                    <span className="text-[#999999]">{m.current}g / {m.target}g</span>
                  </div>
                  <div className="h-1 rounded-full bg-black/5">
                    <div className="h-full rounded-full" style={{ width: `${(m.current / m.target) * 100}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}

      {/* Paywall modal */}
      <PaywallModal
        isOpen={paywallState.isOpen}
        onClose={closePaywall}
        title={paywallState.title}
        message={paywallState.message}
        limitType={paywallState.limitType}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
