import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  Bell, Dumbbell, UtensilsCrossed, Brain, ChevronRight, Play,
  Sparkles, Droplets, BookOpen, CalendarDays, Moon, Sun, Heart, Flame,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN SHOWCASE — 4 Visual Directions
   Same content, different aesthetics.
   ───────────────────────────────────────────── */

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
const TODAY_IDX = 3; // Thursday for demo
const DATES = [17, 18, 19, 20, 21, 22, 23];

// ════════════════════════════════════════════
// DIRECTION 1: "Aurora Glass" — Deep glassmorphism with vivid aurora gradients
// ════════════════════════════════════════════
function Direction1() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1a1130 0%, #2d1b4e 30%, #1e3a5f 60%, #0f2027 100%)',
    }}>
      {/* Aurora blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #c471f5 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-[30%] right-[-15%] w-[400px] h-[400px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #12c2e9 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #f5af19 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-white/95">Krásne ráno, Katka ☀️</h1>
              <p className="text-sm text-white/50 mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Bell size={18} className="text-white/60" />
          </button>
        </div>

        {/* Calendar */}
        <AuroraCard>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className={`flex flex-col items-center gap-1.5 py-1 px-2 rounded-2xl transition-all ${
                i === TODAY_IDX ? 'bg-gradient-to-b from-purple-500/30 to-pink-500/20 shadow-lg shadow-purple-500/20' : ''
              }`}>
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-purple-300' : 'text-white/40'}`}>{d}</span>
                <span className={`text-[14px] font-bold ${i === TODAY_IDX ? 'text-white' : 'text-white/60'}`}>{DATES[i]}</span>
                {i === TODAY_IDX && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-pink-400/60" />}
              </div>
            ))}
          </div>
        </AuroraCard>

        {/* Today's Overview */}
        <AuroraCard>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Dnešný prehľad</p>
          <div className="space-y-3">
            {[
              { icon: Dumbbell, label: 'Tréning', desc: 'Silový tréning & HIIT', color: '#c471f5', time: '35 min' },
              { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', color: '#12c2e9', time: '' },
              { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', color: '#f5af19', time: '10 min' },
            ].map(({ icon: Icon, label, desc, color, time }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)`, boxShadow: `0 4px 15px ${color}20` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white/90">{label}</p>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
                {time && <span className="text-xs text-white/30 font-medium">{time}</span>}
                <ChevronRight size={16} className="text-white/20" />
              </div>
            ))}
          </div>
        </AuroraCard>

        {/* Period tracker snippet */}
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(232,139,154,0.15), rgba(196,149,106,0.1))', backdropFilter: 'blur(40px)', border: '1px solid rgba(232,139,154,0.2)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #E88B9A, transparent)', filter: 'blur(30px)' }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-pink-300/70 uppercase tracking-wider">Periodka</p>
              <span className="text-xs text-white/30">Deň 8 z 28</span>
            </div>
            <p className="text-[15px] font-bold text-white/90">Folikulárna fáza</p>
            <p className="text-[13px] text-white/50 mt-1">Energia rastie — skvelý čas na nové výzvy! 🌱</p>
            {/* Phase bar */}
            <div className="flex gap-1 mt-4">
              {['#C27A6E', '#7A9E78', '#A8848B', '#B8864A'].map((c, i) => (
                <div key={i} className="h-1.5 rounded-full flex-1" style={{ background: i <= 1 ? c : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Habits */}
        <AuroraCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Návyky</p>
            <div className="flex items-center gap-1">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-bold text-orange-400">5 dní</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Droplets size={20} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white/90">Piť vodu</p>
              <p className="text-xs text-white/40">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-2 h-6 rounded-full ${i < 5 ? 'bg-cyan-400' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </AuroraCard>

        {/* Reflection */}
        <AuroraCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-amber-400/70" />
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Reflexia</p>
          </div>
          <p className="text-[13px] text-white/50 italic">"Za čo som dnes vďačná?"</p>
          <div className="mt-3 h-20 rounded-2xl p-3 text-sm text-white/70 placeholder:text-white/20"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-white/20 text-xs">Napíš sem...</span>
          </div>
        </AuroraCard>

        <p className="text-[13px] italic text-white/25 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function AuroraCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>
      {children}
    </div>
  );
}


// ════════════════════════════════════════════
// DIRECTION 2: "Soft Bloom" — Light, airy, layered depth with soft 3D buttons
// ════════════════════════════════════════════
function Direction2() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #FFF5F0 0%, #FDE8E0 30%, #F5E6F0 60%, #EDE5F5 100%)',
    }}>
      {/* Soft decorative circles */}
      <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #FFD4CC 0%, transparent 70%)' }} />
      <div className="absolute bottom-[20%] left-[-10%] w-[250px] h-[250px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #D4C4F5 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full flex items-center justify-center text-sm font-bold text-pink-700"
              style={{ width: 52, height: 52, background: 'linear-gradient(145deg, #FFE4DE, #FFD0C4)', boxShadow: '6px 6px 12px rgba(200,170,160,0.3), -4px -4px 8px rgba(255,255,255,0.8)' }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <Soft3DButton><Bell size={18} className="text-gray-400" /></Soft3DButton>
        </div>

        {/* Calendar */}
        <SoftCard>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-pink-500' : 'text-gray-400'}`}>{d}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold transition-all ${
                  i === TODAY_IDX
                    ? 'text-white'
                    : 'text-gray-500'
                }`} style={i === TODAY_IDX ? {
                  background: 'linear-gradient(135deg, #FF8A9B, #C77DBA)',
                  boxShadow: '0 4px 14px rgba(255,138,155,0.35)',
                } : {
                  background: 'rgba(0,0,0,0.02)',
                }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-pink-300" />}
              </div>
            ))}
          </div>
        </SoftCard>

        {/* Overview cards — layered */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Dnešný prehľad</p>
          {[
            { icon: Dumbbell, label: 'Tréning', desc: 'Silový tréning & HIIT', gradient: 'from-violet-100 to-purple-50', iconColor: '#8B5CF6', shadow: 'rgba(139,92,246,0.15)' },
            { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', gradient: 'from-orange-50 to-amber-50', iconColor: '#F59E0B', shadow: 'rgba(245,158,11,0.15)' },
            { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', gradient: 'from-rose-50 to-pink-50', iconColor: '#EC4899', shadow: 'rgba(236,72,153,0.15)' },
          ].map(({ icon: Icon, label, desc, gradient, iconColor, shadow }) => (
            <div key={label} className={`flex items-center gap-4 p-4 rounded-3xl bg-gradient-to-r ${gradient} transition-all hover:translate-y-[-2px]`}
              style={{ boxShadow: `0 4px 20px ${shadow}, 0 1px 3px rgba(0,0,0,0.04)`, border: '1px solid rgba(255,255,255,0.7)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${iconColor}15`, boxShadow: `inset 0 -2px 4px ${iconColor}10, 0 2px 8px ${iconColor}15` }}>
                <Icon size={22} style={{ color: iconColor }} />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-gray-700">{label}</p>
                <p className="text-[12px] text-gray-400">{desc}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          ))}
        </div>

        {/* Periodka */}
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #FFE4E8 0%, #F5E0F0 50%, #EDE0F5 100%)',
            boxShadow: '0 8px 30px rgba(232,139,154,0.15), 0 1px 3px rgba(0,0,0,0.03)',
            border: '1px solid rgba(255,255,255,0.6)',
          }}>
          <p className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-2">Periodka · Deň 8</p>
          <p className="text-[16px] font-bold text-gray-800">Folikulárna fáza 🌱</p>
          <p className="text-[13px] text-gray-500 mt-1">Energia rastie — skvelý čas na nové výzvy!</p>
          <div className="flex gap-1.5 mt-4">
            {['#C27A6E', '#7A9E78', '#A8848B', '#B8864A'].map((c, i) => (
              <div key={i} className="h-2 rounded-full flex-1" style={{
                background: i <= 1 ? c : '#F0ECE8',
                boxShadow: i <= 1 ? `0 2px 8px ${c}40` : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* Habits */}
        <SoftCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Návyky</p>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ background: 'linear-gradient(135deg, #FFF0E0, #FFE4CC)', boxShadow: '0 2px 8px rgba(245,158,11,0.15)' }}>
              <Flame size={12} className="text-orange-500" />
              <span className="text-[11px] font-bold text-orange-600">5 dní</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #F0F7FF, #E8F0FE)', border: '1px solid rgba(147,197,253,0.3)', boxShadow: '0 2px 10px rgba(59,130,246,0.08)' }}>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Droplets size={18} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">Piť vodu</p>
              <p className="text-[11px] text-gray-400">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-2.5 h-7 rounded-full transition-all ${i < 5 ? 'bg-blue-400 shadow-sm shadow-blue-400/30' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </SoftCard>

        {/* Reflection */}
        <SoftCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-amber-500" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reflexia</p>
          </div>
          <p className="text-[13px] text-gray-500 italic mb-3">"Za čo som dnes vďačná?"</p>
          <div className="h-20 rounded-2xl p-3"
            style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)' }}>
            <span className="text-gray-300 text-xs">Napíš sem...</span>
          </div>
        </SoftCard>

        <p className="text-[13px] italic text-gray-300 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function SoftCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.8)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
    }}>
      {children}
    </div>
  );
}

function Soft3DButton({ children }: { children: ReactNode }) {
  return (
    <button className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:translate-y-[1px]"
      style={{
        background: 'linear-gradient(145deg, #FFFFFF, #F0ECE8)',
        boxShadow: '4px 4px 10px rgba(200,190,180,0.25), -3px -3px 6px rgba(255,255,255,0.9), inset 0 1px 0 rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.6)',
      }}>
      {children}
    </button>
  );
}


// ════════════════════════════════════════════
// DIRECTION 3: "Noir Luxe" — Dark premium with gold accents, 3D depth
// ════════════════════════════════════════════
function Direction3() {
  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(180deg, #0D0D0D 0%, #161616 50%, #1A1A1A 100%)',
    }}>
      <div className="max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #D4A76A, #C4956A)', color: '#2E2218', boxShadow: '0 4px 15px rgba(212,167,106,0.3)' }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-white/95">Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] text-white/35 mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A', boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
            <Bell size={18} className="text-white/40" />
          </button>
        </div>

        {/* Calendar */}
        <NoirCard>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-amber-400' : 'text-white/25'}`}>{d}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold`}
                  style={i === TODAY_IDX ? {
                    background: 'linear-gradient(135deg, #D4A76A, #B8864A)',
                    color: '#2E2218',
                    boxShadow: '0 4px 15px rgba(212,167,106,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                  } : {
                    color: 'rgba(255,255,255,0.4)',
                  }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C27A6E' }} />}
              </div>
            ))}
          </div>
        </NoirCard>

        {/* Overview */}
        <NoirCard>
          <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em] mb-4">Dnešný prehľad</p>
          <div className="space-y-2.5">
            {[
              { icon: Dumbbell, label: 'Tréning', desc: 'Silový tréning & HIIT', accent: '#D4A76A' },
              { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', accent: '#D4A76A' },
              { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', accent: '#D4A76A' },
            ].map(({ icon: Icon, label, desc, accent }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 rounded-2xl transition-all"
                style={{ background: '#1E1E1E', border: '1px solid #2A2A2A', boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white/85">{label}</p>
                  <p className="text-[11px] text-white/30">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/15" />
              </div>
            ))}
          </div>
        </NoirCard>

        {/* Periodka */}
        <NoirCard style={{ borderColor: 'rgba(232,139,154,0.15)' }}>
          <p className="text-[10px] font-bold text-pink-400/60 uppercase tracking-[0.2em] mb-2">Periodka · Deň 8</p>
          <p className="text-[16px] font-bold text-white/90">Folikulárna fáza 🌱</p>
          <p className="text-[13px] text-white/35 mt-1">Energia rastie — skvelý čas na nové výzvy!</p>
          <div className="flex gap-1.5 mt-4">
            {['#C27A6E', '#7A9E78', '#A8848B', '#B8864A'].map((c, i) => (
              <div key={i} className="h-1.5 rounded-full flex-1" style={{
                background: i <= 1 ? `linear-gradient(90deg, ${c}, ${c}CC)` : '#2A2A2A',
                boxShadow: i <= 1 ? `0 0 10px ${c}30` : 'none',
              }} />
            ))}
          </div>
        </NoirCard>

        {/* Habits */}
        <NoirCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">Návyky</p>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <Flame size={12} className="text-amber-500" />
              <span className="text-[11px] font-bold text-amber-500">5 dní</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.12)' }}>
              <Droplets size={18} className="text-sky-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white/85">Piť vodu</p>
              <p className="text-[11px] text-white/30">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-2 h-7 rounded-full ${i < 5 ? 'bg-sky-500 shadow-sm shadow-sky-500/20' : 'bg-white/5'}`} />
              ))}
            </div>
          </div>
        </NoirCard>

        {/* Reflection */}
        <NoirCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-amber-500/50" />
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">Reflexia</p>
          </div>
          <p className="text-[13px] text-white/35 italic">"Za čo som dnes vďačná?"</p>
          <div className="mt-3 h-20 rounded-2xl p-3" style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}>
            <span className="text-white/15 text-xs">Napíš sem...</span>
          </div>
        </NoirCard>

        <p className="text-[13px] italic text-white/15 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function NoirCard({ children, className = '', style = {} }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: '#161616',
      border: '1px solid #222222',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)',
      ...style,
    }}>
      {children}
    </div>
  );
}


// ════════════════════════════════════════════
// DIRECTION 4: "Fresh Gradient" — Bold colorful gradients, modern cards with depth
// ════════════════════════════════════════════
function Direction4() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(165deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
    }}>
      {/* Floating shapes */}
      <div className="absolute top-[10%] right-[-5%] w-40 h-40 rounded-3xl opacity-20 rotate-12"
        style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)' }} />
      <div className="absolute bottom-[30%] left-[-8%] w-32 h-32 rounded-full opacity-15"
        style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white font-bold text-sm border border-white/30"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] text-white/60 mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
            <Bell size={18} className="text-white/70" />
          </button>
        </div>

        {/* Calendar */}
        <FreshCard>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-purple-600' : 'text-gray-400'}`}>{d}</span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[14px] font-bold transition-all`}
                  style={i === TODAY_IDX ? {
                    background: 'linear-gradient(135deg, #667EEA, #764BA2)',
                    color: 'white',
                    boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
                    transform: 'scale(1.1)',
                  } : { color: '#666' }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
              </div>
            ))}
          </div>
        </FreshCard>

        {/* Overview as horizontal scroll cards */}
        <div>
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 px-1">Dnešný prehľad</p>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x">
            {[
              { icon: Dumbbell, label: 'Tréning', desc: 'Silový & HIIT', gradient: 'linear-gradient(135deg, #667EEA, #764BA2)', time: '35 min' },
              { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska', gradient: 'linear-gradient(135deg, #F093FB, #F5576C)', time: '' },
              { icon: Brain, label: 'Myseľ', desc: 'Meditácia', gradient: 'linear-gradient(135deg, #4FACFE, #00F2FE)', time: '10 min' },
            ].map(({ icon: Icon, label, desc, gradient, time }) => (
              <div key={label} className="flex-shrink-0 w-[140px] p-4 rounded-3xl text-white snap-start"
                style={{ background: gradient, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
                <Icon size={24} className="mb-3 opacity-90" />
                <p className="text-[15px] font-bold">{label}</p>
                <p className="text-[11px] text-white/70 mt-0.5">{desc}</p>
                {time && <p className="text-[11px] text-white/50 mt-2">{time}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Periodka */}
        <FreshCard className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
            style={{ background: 'linear-gradient(135deg, #F093FB, #F5576C)', filter: 'blur(20px)' }} />
          <p className="text-[11px] font-bold text-purple-500 uppercase tracking-wider mb-2">Periodka · Deň 8</p>
          <p className="text-[16px] font-bold text-gray-800">Folikulárna fáza 🌱</p>
          <p className="text-[13px] text-gray-500 mt-1">Energia rastie — skvelý čas na nové výzvy!</p>
          <div className="flex gap-1.5 mt-4">
            {[
              { c: 'linear-gradient(90deg, #E88B9A, #F5576C)', active: true },
              { c: 'linear-gradient(90deg, #6B9E6B, #4FACFE)', active: true },
              { c: '#E8E4E0', active: false },
              { c: '#E8E4E0', active: false },
            ].map((item, i) => (
              <div key={i} className="h-2 rounded-full flex-1" style={{
                background: item.active ? item.c : item.c,
                boxShadow: item.active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }} />
            ))}
          </div>
        </FreshCard>

        {/* Habits */}
        <FreshCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Návyky</p>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-[11px] font-bold"
              style={{ background: 'linear-gradient(135deg, #F5AF19, #F12711)', boxShadow: '0 3px 10px rgba(245,175,25,0.3)' }}>
              <Flame size={12} /> 5 dní
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #F0F4FF, #E8ECFF)', border: '1px solid rgba(102,126,234,0.15)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4FACFE, #00F2FE)', boxShadow: '0 4px 12px rgba(79,172,254,0.3)' }}>
              <Droplets size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">Piť vodu</p>
              <p className="text-[11px] text-gray-400">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-2.5 h-7 rounded-full ${i < 5 ? '' : 'bg-gray-200'}`}
                  style={i < 5 ? { background: 'linear-gradient(180deg, #4FACFE, #667EEA)', boxShadow: '0 2px 6px rgba(79,172,254,0.3)' } : {}} />
              ))}
            </div>
          </div>
        </FreshCard>

        {/* Reflection */}
        <FreshCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-purple-400" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reflexia</p>
          </div>
          <p className="text-[13px] text-gray-500 italic mb-3">"Za čo som dnes vďačná?"</p>
          <div className="h-20 rounded-2xl p-3"
            style={{ background: 'rgba(102,126,234,0.04)', border: '1px dashed rgba(102,126,234,0.15)' }}>
            <span className="text-gray-300 text-xs">Napíš sem...</span>
          </div>
        </FreshCard>

        <p className="text-[13px] italic text-white/30 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function FreshCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    }}>
      {children}
    </div>
  );
}


// ════════════════════════════════════════════
// MAIN SHOWCASE PAGE
// ════════════════════════════════════════════
export default function DesignShowcase() {
  const [active, setActive] = useState(0);
  const directions = [
    { name: 'Aurora Glass', desc: 'Dark glassmorphism + vivid aurora gradients', component: Direction1 },
    { name: 'Soft Bloom', desc: 'Light, airy, layered depth with 3D buttons', component: Direction2 },
    { name: 'Noir Luxe', desc: 'Dark premium with gold accents', component: Direction3 },
    { name: 'Fresh Gradient', desc: 'Bold colorful gradients, modern cards', component: Direction4 },
  ];

  const ActiveComponent = directions[active].component;

  return (
    <div className="font-lufga">
      {/* Sticky selector */}
      <div className="sticky top-0 z-50 px-4 py-3" style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">NeoMe — Design Directions</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {directions.map((d, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                active === i
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {i + 1}. {d.name}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5 text-center">{directions[active].desc}</p>
      </div>

      {/* Active direction */}
      <ActiveComponent />
    </div>
  );
}
