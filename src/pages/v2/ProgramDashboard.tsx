import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CalendarDays, Check } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import ProgressRing from '../../components/v2/ProgressRing';

const scheduleData = [
  { day: 1, name: 'Celé telo — Základ', duration: '30 min', done: true },
  { day: 2, name: 'Core & stabilita', duration: '25 min', done: true },
  { day: 3, name: 'Odpočinok', duration: '—', done: true },
  { day: 4, name: 'Nohy & zadok', duration: '30 min', done: true },
  { day: 5, name: 'Kardio HIIT', duration: '20 min', done: true },
  { day: 6, name: 'Horná časť tela', duration: '30 min', done: true },
  { day: 7, name: 'Strečing & regenerácia', duration: '15 min', done: true },
  { day: 8, name: 'Celé telo — Sila', duration: '30 min', done: false },
  { day: 9, name: 'Core pokročilý', duration: '25 min', done: false },
  { day: 10, name: 'Odpočinok', duration: '—', done: false },
];

export default function ProgramDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentDay = 8;
  const totalDays = 28;
  const progress = Math.round((currentDay / totalDays) * 100);
  const weekDays = scheduleData.slice(Math.floor((currentDay - 1) / 7) * 7, Math.floor((currentDay - 1) / 7) * 7 + 7);

  const programName = id === 'postpartum' ? 'Postpartum' : id === 'bodyforming' ? 'BodyForming' : id === 'elastic-bands' ? 'Elastic Bands' : 'Strong&Sexy';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/kniznica/telo')} className="p-1"><ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} /></button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-[#2E2218]">{programName}</h1>
          <p className="text-xs text-[#A0907E]">Deň {currentDay} / {totalDays}</p>
        </div>
        <ProgressRing progress={progress} size={48} stroke={4} color="#6B4C3B">
          <span className="text-[10px] font-semibold text-[#2E2218]">{progress}%</span>
        </ProgressRing>
      </div>

      {/* Today's Workout */}
      <GlassCard>
        <p className="text-xs text-[#A0907E] mb-1">Dnešný tréning</p>
        <p className="text-sm font-semibold text-[#2E2218]">Celé telo — Sila</p>
        <p className="text-xs text-[#A0907E] mt-0.5">30 min · Stredná intenzita</p>
        <button className="mt-4 flex items-center gap-2 rounded-full bg-[#6B4C3B] text-white px-6 py-2.5 text-sm font-medium active:scale-95 transition-transform">
          <Play className="w-4 h-4" fill="white" /> Začať
        </button>
      </GlassCard>

      {/* Gabi's message */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#D4B8A0] flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-[#6B4C3B]">Gabi</p>
            <p className="text-sm text-[#8B7560] mt-0.5 leading-relaxed">
              Druhý týždeň — si úžasná! 💪 Dnes sa zameraj na správnu techniku, tempo nie je dôležité.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Weekly overview */}
      <GlassCard className="!p-4">
        <p className="text-xs text-[#A0907E] mb-3">Tento týždeň</p>
        <div className="flex justify-between">
          {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((d, i) => {
            const wd = weekDays[i];
            const isCurrent = wd && wd.day === currentDay;
            const isDone = wd?.done;
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#A0907E]">{d}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDone ? 'bg-[#6B9E6B] text-white' : isCurrent ? 'bg-[#6B4C3B] text-white' : 'bg-black/5 text-[#C8B8A8]'
                }`}>
                  {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : <span className="text-xs">{wd?.day || ''}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Schedule */}
      <h2 className="text-sm font-semibold text-[#2E2218]">Program</h2>
      <div className="space-y-2">
        {scheduleData.map((s) => (
          <GlassCard key={s.day} className="!p-3">
            <div className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                s.done ? 'bg-[#6B9E6B] text-white' : s.day === currentDay ? 'bg-[#6B4C3B] text-white' : 'bg-black/5 text-[#A0907E]'
              }`}>
                {s.done ? <Check className="w-3 h-3" strokeWidth={2.5} /> : s.day}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${s.done ? 'text-[#A0907E] line-through' : 'text-[#2E2218]'}`}>{s.name}</p>
              </div>
              <span className="text-xs text-[#A0907E]">{s.duration}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 pt-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium text-[#6B4C3B] border border-[#6B4C3B]/20">
          <Pause className="w-4 h-4" strokeWidth={1.5} /> Pozastaviť
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium text-[#6B4C3B] border border-[#6B4C3B]/20">
          <CalendarDays className="w-4 h-4" strokeWidth={1.5} /> Nový začiatok
        </button>
      </div>
    </div>
  );
}
