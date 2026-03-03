import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Sparkles, Target, Clock, Leaf, ShieldCheck, Star, Zap } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

const BENEFITS = [
  { icon: Target, title: 'Prispôsobené tvojim cieľom', desc: 'Chudnutie, udržanie váhy alebo budovanie svalov — plán sa prispôsobí.' },
  { icon: Clock, title: '7-dňový plán jedným klikom', desc: 'Raňajky, obedy, večere a snacky na celý týždeň za pár sekúnd.' },
  { icon: Leaf, title: 'Rešpektuje tvoje preferencie', desc: 'Vegetariánske, vegánske, bezlepkové — tvoj plán, tvoje pravidlá.' },
  { icon: ShieldCheck, title: 'Presné makro & kalórie', desc: 'Každý deň je vypočítaný podľa tvojho BMR a úrovne aktivity.' },
];

const TESTIMONIALS = [
  { name: 'Katka N.', text: 'Konečne nemusím premýšľať čo variť. Ušetrím hodiny týždenne!', stars: 5 },
  { name: 'Jana V.', text: 'Po 2 týždňoch s jedálničkom som schudla 2kg bez toho, aby som mala hlad.', stars: 5 },
  { name: 'Eva S.', text: 'Ako vegánka som mala problém s bielkovinami. Jedálniček to vyriešil.', stars: 5 },
];

const STEPS = [
  { num: '1', title: 'Vyplň svoj profil', desc: 'Vek, váha, výška, cieľ a aktivita' },
  { num: '2', title: 'Nastav preferencie', desc: 'Diéta, alergény, počet jedál denne' },
  { num: '3', title: 'Získaj plán', desc: '7-dňový jedálniček ihneď na obrazovke' },
];

export default function JedalnicekPromo() {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleStart = () => {
    navigate('/jedalnicek');
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="p-4 pt-12 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-xl flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 text-center mb-8">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.strava}, #5A8A58)` }}>
          <span className="text-4xl">🥗</span>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          Jedálniček na mieru
        </h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Personalizovaný výživový plán vytvorený presne pre teba.
          <br />Žiadne hádanie, žiadne počítanie — len jedz a dosahuj výsledky.
        </p>
      </div>

      <div className="px-4 space-y-6">
        {/* Social proof */}
        <div className="flex justify-center gap-6">
          {[
            { value: '2,400+', label: 'žien používa' },
            { value: '116', label: 'receptov' },
            { value: '4.9★', label: 'hodnotenie' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>{s.value}</div>
              <div className="text-xs" style={{ color: colors.textTertiary }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Interactive goal selector */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-5 border border-white/30">
          <p className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Aký je tvoj cieľ?</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'lose', emoji: '🔥', label: 'Schudnúť' },
              { id: 'maintain', emoji: '⚖️', label: 'Udržať' },
              { id: 'gain', emoji: '💪', label: 'Nabrať' },
            ].map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className="p-3 rounded-xl text-center transition-all"
                style={{
                  background: selectedGoal === g.id ? `${colors.strava}20` : 'rgba(255,255,255,0.2)',
                  border: selectedGoal === g.id ? `2px solid ${colors.strava}` : '2px solid transparent',
                }}
              >
                <div className="text-xl mb-1">{g.emoji}</div>
                <div className="text-xs font-medium" style={{ color: selectedGoal === g.id ? colors.strava : colors.textSecondary }}>{g.label}</div>
              </button>
            ))}
          </div>
          {selectedGoal && (
            <div className="mt-3 p-3 rounded-xl" style={{ background: `${colors.strava}10` }}>
              <p className="text-xs" style={{ color: colors.strava }}>
                ✓ Tvoj jedálniček bude optimalizovaný na {selectedGoal === 'lose' ? 'chudnutie s -300 kcal deficitom' : selectedGoal === 'gain' ? 'nárast svalov s +250 kcal' : 'udržanie aktuálnej váhy'}
              </p>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-5 border border-white/30">
          <p className="text-sm font-semibold mb-4" style={{ color: colors.textPrimary }}>Ako to funguje</p>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ backgroundColor: colors.strava }}>
                  {s.num}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{s.title}</p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.strava}15` }}>
                <b.icon className="w-5 h-5" style={{ color: colors.strava }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{b.title}</p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sample day preview */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-5 border border-white/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
            <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Ukážka dňa</p>
          </div>
          <div className="space-y-2">
            {[
              { time: '☀️ Raňajky', meal: 'Proteínová kaša s ovocím', cal: '320 kcal' },
              { time: '🥗 Obed', meal: 'Grilovaný losos so zeleninou', cal: '480 kcal' },
              { time: '🍎 Snack', meal: 'Hummus so zeleninou', cal: '185 kcal' },
              { time: '🌙 Večera', meal: 'Quinoa šalát s avokádom', cal: '420 kcal' },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
                <div>
                  <span className="text-xs" style={{ color: colors.textTertiary }}>{m.time}</span>
                  <p className="text-sm" style={{ color: colors.textPrimary }}>{m.meal}</p>
                </div>
                <span className="text-xs font-medium" style={{ color: colors.strava }}>{m.cal}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>Celkom</span>
              <span className="text-sm font-bold" style={{ color: colors.strava }}>1,405 kcal</span>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-center" style={{ color: colors.textPrimary }}>Čo hovoria naše členky</p>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs italic mb-2" style={{ color: colors.textSecondary }}>„{t.text}"</p>
              <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>— {t.name}</p>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center p-4 rounded-2xl" style={{ background: `${colors.strava}10` }}>
          <ShieldCheck className="w-6 h-6 mx-auto mb-2" style={{ color: colors.strava }} />
          <p className="text-xs font-medium" style={{ color: colors.strava }}>
            100% spokojnosť alebo zmena plánu kedykoľvek
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6" style={{ background: 'linear-gradient(to top, rgba(250,247,242,1) 60%, rgba(250,247,242,0))' }}>
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${colors.strava}, #5A8A58)` }}
        >
          <Zap className="w-5 h-5" />
          Vytvoriť môj jedálniček
        </button>
        <p className="text-center text-xs mt-2" style={{ color: colors.textTertiary }}>
          Súčasť NeoMe predplatného · Zrušiť kedykoľvek
        </p>
      </div>
    </div>
  );
}
