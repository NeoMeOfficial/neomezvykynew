import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Dumbbell, UtensilsCrossed, Sparkles, Plus } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { colors, glassCard } from '../../theme/warmDusk';

const tabs = ['Cvičenie', 'Výživa', 'Auto-plán ✨'];
const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

const weekData = [
  { day: 'Po', items: [{ type: 'workout', label: 'Sila' }] },
  { day: 'Ut', items: [{ type: 'meal', label: 'Meal prep' }] },
  { day: 'St', items: [{ type: 'workout', label: 'Kardio' }, { type: 'meal', label: 'Smoothie' }] },
  { day: 'Št', items: [] },
  { day: 'Pi', items: [{ type: 'workout', label: 'Nohy' }] },
  { day: 'So', items: [{ type: 'rest', label: 'Oddych' }] },
  { day: 'Ne', items: [{ type: 'workout', label: 'Joga' }] },
];

const agenda = [
  { icon: Dumbbell, title: 'Horná časť tela — Sila', subtitle: '30 min · Stredná intenzita', time: '08:00' },
  { icon: UtensilsCrossed, title: 'Príprava jedál', subtitle: '5 receptov na týždeň', time: '10:00' },
  { icon: Sparkles, title: 'Meditácia — Fokus', subtitle: '15 min · Vedená', time: '20:00' },
];

export default function Programy() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen space-y-6 p-6" style={{ background: colors.bgGradient }}>
      <h1 className="text-xl font-semibold text-[#2E2218]">Programy</h1>

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`text-sm px-4 py-2 transition-all ${
              activeTab === i
                ? 'text-[#6B4C3B] border-b-2 border-[#6B4C3B] font-semibold'
                : 'text-[#999999]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Date */}
      <div className="flex items-center justify-between">
        <button className="p-2"><ChevronLeft className="w-5 h-5 text-[#999999]" /></button>
        <span className="text-sm font-medium text-[#2E2218]">27. februára 2025</span>
        <button className="p-2"><ChevronRight className="w-5 h-5 text-[#999999]" /></button>
      </div>

      {/* Week Grid */}
      <GlassCard className="!p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekData.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1.5">
              <span className="text-xs text-[#999999]">{d.day}</span>
              <div className="w-full min-h-[60px] rounded-xl p-1 space-y-1" style={{ background: 'rgba(255,255,255,0.5)' }}>
                {d.items.map((item, j) => (
                  <div
                    key={j}
                    className="w-full h-3 rounded-full"
                    style={{
                      background:
                        item.type === 'workout' ? '#6B4C3B' :
                        item.type === 'meal' ? '#B8864A' :
                        '#7A9E78',
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Agenda */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#2E2218]">Agenda</h2>
          <button className="flex items-center gap-1 text-xs font-medium text-[#6B4C3B]">
            <Plus className="w-3.5 h-3.5" /> Pridať
          </button>
        </div>
        <div className="space-y-3">
          {agenda.map((a) => (
            <GlassCard key={a.title} className="!p-4 cursor-pointer" onClick={() => navigate('/program/1')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(95,62,49,0.08)' }}>
                  <a.icon className="w-4 h-4 text-[#6B4C3B]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#2E2218]">{a.title}</p>
                  <p className="text-xs text-[#999999]">{a.subtitle}</p>
                </div>
                <span className="text-xs text-[#999999]">{a.time}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
