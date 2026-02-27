import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Users, Check, ChevronDown, Clock, Dumbbell } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { useState } from 'react';

const programData: Record<string, { name: string; tagline: string; weeks: number; perWeek: number; price: string; gradient: string }> = {
  postpartum: { name: 'Postpartum', tagline: 'Obnov svoju silu po pôrode', weeks: 6, perWeek: 4, price: '39,90 €', gradient: 'from-[#F2C6C2] to-[#E8A0A0]' },
  bodyforming: { name: 'BodyForming', tagline: 'Formuj svoju postavu', weeks: 4, perWeek: 5, price: '29,90 €', gradient: 'from-[#B8864A] to-[#6B4C3B]' },
  'elastic-bands': { name: 'Elastic Bands', tagline: 'Tréning s gumami kdekoľvek', weeks: 4, perWeek: 4, price: '24,90 €', gradient: 'from-[#D5C8E0] to-[#A88BC3]' },
  'strong-sexy': { name: 'Strong&Sexy', tagline: 'Sila a sebavedomie', weeks: 8, perWeek: 5, price: '49,90 €', gradient: 'from-[#D0BCA8] to-[#B8864A]' },
};

export default function ProgramSales() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const p = programData[id || ''] || programData.postpartum;

  const faqs = [
    { q: 'Koľko trvá program?', a: `Program trvá ${p.weeks} týždňov, ${p.perWeek}x týždenne.` },
    { q: 'Potrebujem vybavenie?', a: 'Väčšinu cvičení zvládneš doma s minimálnym vybavením.' },
    { q: 'Môžem program pozastaviť?', a: 'Áno, kedykoľvek môžeš program pozastaviť a pokračovať neskôr.' },
  ];

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className={`-mx-5 -mt-6 px-5 pt-6 pb-8 bg-gradient-to-br ${p.gradient}`}>
        <button onClick={() => navigate(-1)} className="p-1 mb-4"><ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.5} /></button>
        <h1 className="text-2xl font-bold text-white">{p.name}</h1>
        <p className="text-sm text-white/80 mt-1">{p.tagline}</p>
        <div className="flex items-center gap-1.5 mt-3">
          <Users className="w-3.5 h-3.5 text-white/70" strokeWidth={1.5} />
          <span className="text-xs text-white/70">127 žien práve robí tento program</span>
        </div>
      </div>

      {/* Overview */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-[#2E2218] mb-2">O programe</h2>
        <p className="text-sm text-[#8B7560] leading-relaxed">
          Komplexný program navrhnutý špeciálne pre ženy, ktoré chcú dosiahnuť reálne výsledky.
          Kombinácia silového tréningu, flexibility a regenerácie.
        </p>
      </GlassCard>

      {/* Duration */}
      <GlassCard className="!p-4">
        <div className="flex justify-around">
          <div className="text-center">
            <p className="text-lg font-bold text-[#2E2218]">{p.weeks}</p>
            <p className="text-xs text-[#A0907E]">týždňov</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#2E2218]">{p.perWeek}</p>
            <p className="text-xs text-[#A0907E]">tréningov/týždeň</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#2E2218]">30</p>
            <p className="text-xs text-[#A0907E]">min/tréning</p>
          </div>
        </div>
      </GlassCard>

      {/* Sample workouts (locked) */}
      <h2 className="text-sm font-semibold text-[#2E2218]">Ukážka tréningov</h2>
      {['Deň 1 — Celé telo', 'Deň 2 — Core & stabilita'].map((w) => (
        <GlassCard key={w} className="!p-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-[#C8B8A8]" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#2E2218] blur-[2px]">{w}</p>
              <p className="text-xs text-[#A0907E] blur-[2px]">30 min · Stredná intenzita</p>
            </div>
            <Lock className="w-4 h-4 text-[#C8B8A8]" strokeWidth={1.5} />
          </div>
        </GlassCard>
      ))}

      {/* Included */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-[#2E2218] mb-3">Čo je zahrnuté</h2>
        <div className="space-y-2">
          {[
            `${p.weeks * p.perWeek} tréningov`,
            'Personalizovaný plán',
            'Správy od Gabi',
            'Podpora komunity',
            'Prístup k receptom',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#6B9E6B]" strokeWidth={2} />
              <span className="text-sm text-[#8B7560]">{item}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Gabi's message */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#D4B8A0] flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-[#6B4C3B]">Gabi</p>
            <p className="text-sm text-[#8B7560] mt-1 italic leading-relaxed">
              „Tento program som vytvorila s láskou a skúsenosťami. Verím, že ti prinesie výsledky, ktoré si zaslúžiš."
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Pricing */}
      <div className="text-center py-4">
        <p className="text-3xl font-bold text-[#2E2218]">{p.price}</p>
        <p className="text-xs text-[#A0907E] mt-1">Jednorazová platba · Neobmedzený prístup</p>
        <button
          onClick={() => navigate(`/program/${id}`)}
          className="mt-4 rounded-full bg-[#6B4C3B] text-white px-10 py-3.5 text-sm font-medium active:scale-95 transition-transform"
        >
          Kúpiť program
        </button>
      </div>

      {/* FAQ */}
      <h2 className="text-sm font-semibold text-[#2E2218]">Časté otázky</h2>
      {faqs.map((f, i) => (
        <GlassCard key={i} className="!p-4 cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#2E2218]">{f.q}</p>
            <ChevronDown className={`w-4 h-4 text-[#A0907E] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} strokeWidth={1.5} />
          </div>
          {openFaq === i && <p className="text-sm text-[#8B7560] mt-2">{f.a}</p>}
        </GlassCard>
      ))}
    </div>
  );
}
