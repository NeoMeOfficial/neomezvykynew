import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  Bell, Dumbbell, UtensilsCrossed, Brain, ChevronRight,
  Droplets, BookOpen, Flame,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN SHOWCASE 2 — Warm Earthy Directions
   Noir Luxe structure + Glassmorphism + Frosted cards
   Warm, calming, earthy palette
   ───────────────────────────────────────────── */

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
const TODAY_IDX = 3;
const DATES = [17, 18, 19, 20, 21, 22, 23];

// ════════════════════════════════════════════
// DIRECTION 5: "Pearl Noir" — Pearl/cream background, dark glass cards, warm gold accents
// ════════════════════════════════════════════
function Direction5() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(170deg, #F5F0EA 0%, #EDE6DC 30%, #E8DFD4 60%, #F2EDE6 100%)',
    }}>
      {/* Subtle warm glow */}
      <div className="absolute top-[5%] right-[-5%] w-[350px] h-[350px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #D4A76A 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[15%] left-[-10%] w-[300px] h-[300px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #C4956A 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #C4956A, #A67B5B)', color: '#FFF', boxShadow: '0 4px 15px rgba(196,149,106,0.35)' }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2C2420]">Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] text-[#8B7B6B] mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(44,36,32,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(44,36,32,0.08)' }}>
            <Bell size={18} className="text-[#8B7B6B]" />
          </button>
        </div>

        {/* Calendar — dark glass */}
        <PearlDarkCard>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-[#D4A76A]' : 'text-white/30'}`}>{d}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold`}
                  style={i === TODAY_IDX ? {
                    background: 'linear-gradient(135deg, #D4A76A, #C4956A)',
                    color: '#1A1512',
                    boxShadow: '0 4px 14px rgba(212,167,106,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  } : { color: 'rgba(255,255,255,0.4)' }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-[#C27A6E]/60" />}
              </div>
            ))}
          </div>
        </PearlDarkCard>

        {/* Overview */}
        <PearlDarkCard>
          <p className="text-[10px] font-bold text-[#D4A76A]/50 uppercase tracking-[0.2em] mb-4">Dnešný prehľad</p>
          <div className="space-y-2.5">
            {[
              { icon: Dumbbell, label: 'Tréning', desc: 'Silový tréning & HIIT', accent: '#D4A76A', time: '35 min' },
              { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', accent: '#B8A088', time: '' },
              { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', accent: '#A89080', time: '10 min' },
            ].map(({ icon: Icon, label, desc, accent, time }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:translate-y-[-1px]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}25`, boxShadow: `0 0 15px ${accent}10` }}>
                  <Icon size={20} style={{ color: accent }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white/85">{label}</p>
                  <p className="text-[11px] text-white/35">{desc}</p>
                </div>
                {time && <span className="text-[11px] text-white/25 font-medium">{time}</span>}
                <ChevronRight size={16} className="text-white/15" />
              </div>
            ))}
          </div>
        </PearlDarkCard>

        {/* Periodka */}
        <PearlDarkCard style={{ borderColor: 'rgba(232,139,154,0.12)' }}>
          <p className="text-[10px] font-bold text-[#C27A6E]/50 uppercase tracking-[0.2em] mb-2">Periodka · Deň 8</p>
          <p className="text-[16px] font-bold text-white/90">Folikulárna fáza 🌱</p>
          <p className="text-[13px] text-white/35 mt-1">Energia rastie — skvelý čas na nové výzvy!</p>
          <div className="flex gap-1.5 mt-4">
            {['#C27A6E', '#8BA888', '#A8848B', '#B8864A'].map((c, i) => (
              <div key={i} className="h-1.5 rounded-full flex-1" style={{
                background: i <= 1 ? c : 'rgba(255,255,255,0.06)',
                boxShadow: i <= 1 ? `0 0 12px ${c}25` : 'none',
              }} />
            ))}
          </div>
        </PearlDarkCard>

        {/* Habits */}
        <PearlDarkCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Návyky</p>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(212,167,106,0.1)', border: '1px solid rgba(212,167,106,0.15)' }}>
              <Flame size={12} className="text-[#D4A76A]" />
              <span className="text-[11px] font-bold text-[#D4A76A]">5 dní</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,168,136,0.12)', border: '1px solid rgba(139,168,136,0.15)' }}>
              <Droplets size={18} className="text-[#8BA888]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white/85">Piť vodu</p>
              <p className="text-[11px] text-white/30">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-2 h-7 rounded-full`} style={{
                  background: i < 5 ? '#8BA888' : 'rgba(255,255,255,0.06)',
                  boxShadow: i < 5 ? '0 2px 6px rgba(139,168,136,0.25)' : 'none',
                }} />
              ))}
            </div>
          </div>
        </PearlDarkCard>

        {/* Reflection */}
        <PearlDarkCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-[#D4A76A]/50" />
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Reflexia</p>
          </div>
          <p className="text-[13px] text-white/35 italic">"Za čo som dnes vďačná?"</p>
          <div className="mt-3 h-20 rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-white/15 text-xs">Napíš sem...</span>
          </div>
        </PearlDarkCard>

        <p className="text-[13px] italic text-[#8B7B6B]/40 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function PearlDarkCard({ children, className = '', style = {} }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: 'rgba(28,24,20,0.75)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)',
      ...style,
    }}>
      {children}
    </div>
  );
}


// ════════════════════════════════════════════
// DIRECTION 6: "Terracotta Frost" — Warm frosted cards on earthy gradient, layered depth
// ════════════════════════════════════════════
function Direction6() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(165deg, #E8DDD0 0%, #D4C4B0 35%, #C8B8A4 65%, #DDD2C4 100%)',
    }}>
      {/* Warm decorative glows */}
      <div className="absolute top-[-5%] left-[10%] w-[350px] h-[350px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #C4956A 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="absolute bottom-[10%] right-[-5%] w-[300px] h-[300px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #8BA888 0%, transparent 70%)', filter: 'blur(70px)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #A67B5B, #8B6548)', color: '#FFF', boxShadow: '0 4px 15px rgba(166,123,91,0.3)' }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#3D2E22]">Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] text-[#7D6B5D] mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}>
            <Bell size={18} className="text-[#7D6B5D]" />
          </button>
        </div>

        {/* Calendar */}
        <TerracottaCard>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-[#A67B5B]' : 'text-[#9B8B7B]'}`}>{d}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold`}
                  style={i === TODAY_IDX ? {
                    background: 'linear-gradient(135deg, #A67B5B, #8B6548)',
                    color: '#FFF',
                    boxShadow: '0 4px 14px rgba(166,123,91,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                    transform: 'scale(1.05)',
                  } : { color: '#8B7B6B' }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-[#D4847A]" />}
              </div>
            ))}
          </div>
        </TerracottaCard>

        {/* Overview */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#7D6B5D] uppercase tracking-[0.2em] px-1">Dnešný prehľad</p>
          {[
            { icon: Dumbbell, label: 'Tréning', desc: 'Silový tréning & HIIT', accent: '#A67B5B', bg: 'rgba(166,123,91,0.08)', time: '35 min' },
            { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', accent: '#8BA888', bg: 'rgba(139,168,136,0.08)', time: '' },
            { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', accent: '#B8967A', bg: 'rgba(184,150,122,0.08)', time: '10 min' },
          ].map(({ icon: Icon, label, desc, accent, bg, time }) => (
            <TerracottaCard key={label}>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: bg, border: `1px solid ${accent}20`, boxShadow: `0 4px 12px ${accent}10` }}>
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-[#3D2E22]">{label}</p>
                  <p className="text-[12px] text-[#9B8B7B]">{desc}</p>
                </div>
                {time && <span className="text-[11px] text-[#B8A898] font-medium">{time}</span>}
                <ChevronRight size={16} className="text-[#C8B8A8]" />
              </div>
            </TerracottaCard>
          ))}
        </div>

        {/* Periodka */}
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(212,132,122,0.2)',
            boxShadow: '0 8px 32px rgba(212,132,122,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}>
          <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #D4847A, transparent)', filter: 'blur(25px)' }} />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-[#D4847A] uppercase tracking-[0.2em] mb-2">Periodka · Deň 8</p>
            <p className="text-[16px] font-bold text-[#3D2E22]">Folikulárna fáza 🌱</p>
            <p className="text-[13px] text-[#7D6B5D] mt-1">Energia rastie — skvelý čas na nové výzvy!</p>
            <div className="flex gap-1.5 mt-4">
              {['#D4847A', '#8BA888', '#A889B0', '#B8864A'].map((c, i) => (
                <div key={i} className="h-2 rounded-full flex-1" style={{
                  background: i <= 1 ? c : 'rgba(0,0,0,0.06)',
                  boxShadow: i <= 1 ? `0 2px 8px ${c}30` : 'none',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Habits */}
        <TerracottaCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-[#9B8B7B] uppercase tracking-[0.2em]">Návyky</p>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(196,149,106,0.12)', border: '1px solid rgba(196,149,106,0.2)' }}>
              <Flame size={12} className="text-[#B8864A]" />
              <span className="text-[11px] font-bold text-[#A67B5B]">5 dní</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{ background: 'rgba(139,168,136,0.06)', border: '1px solid rgba(139,168,136,0.12)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,168,136,0.12)' }}>
              <Droplets size={18} className="text-[#7A9E78]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#3D2E22]">Piť vodu</p>
              <p className="text-[11px] text-[#9B8B7B]">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="w-2.5 h-7 rounded-full" style={{
                  background: i < 5 ? '#8BA888' : 'rgba(0,0,0,0.06)',
                  boxShadow: i < 5 ? '0 2px 6px rgba(139,168,136,0.25)' : 'none',
                }} />
              ))}
            </div>
          </div>
        </TerracottaCard>

        {/* Reflection */}
        <TerracottaCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-[#B8967A]" />
            <p className="text-[10px] font-bold text-[#9B8B7B] uppercase tracking-[0.2em]">Reflexia</p>
          </div>
          <p className="text-[13px] text-[#7D6B5D] italic mb-3">"Za čo som dnes vďačná?"</p>
          <div className="h-20 rounded-2xl p-3"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px dashed rgba(0,0,0,0.08)' }}>
            <span className="text-[#B8A898] text-xs">Napíš sem...</span>
          </div>
        </TerracottaCard>

        <p className="text-[13px] italic text-[#9B8B7B]/50 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function TerracottaCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: '1px solid rgba(255,255,255,0.6)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)',
    }}>
      {children}
    </div>
  );
}


// ════════════════════════════════════════════
// DIRECTION 7: "Sage & Sand" — Muted sage green + warm sand, floating glass layers
// ════════════════════════════════════════════
function Direction7() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(170deg, #E8E4D8 0%, #D8D4C4 30%, #CCC8B8 55%, #E0DCD0 100%)',
    }}>
      {/* Sage + sand glows */}
      <div className="absolute top-[0%] right-[5%] w-[300px] h-[300px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #8BA888 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[20%] left-[0%] w-[350px] h-[350px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #C8B090 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #7A9E78, #5F8060)', boxShadow: '0 4px 15px rgba(122,158,120,0.3)' }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E3328]">Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] text-[#7B8574] mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
            <Bell size={18} className="text-[#7B8574]" />
          </button>
        </div>

        {/* Calendar — sage glass */}
        <SageCard elevated>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-[#5F8060]' : 'text-[#9BA894]'}`}>{d}</span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[14px] font-bold transition-all`}
                  style={i === TODAY_IDX ? {
                    background: 'linear-gradient(135deg, #7A9E78, #5F8060)',
                    color: '#FFF',
                    boxShadow: '0 4px 14px rgba(122,158,120,0.35)',
                    transform: 'translateY(-2px)',
                  } : { color: '#7B8574' }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-[#D4847A]/60" />}
              </div>
            ))}
          </div>
        </SageCard>

        {/* Overview — stacked floating cards */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-[#7B8574] uppercase tracking-[0.2em] px-1">Dnešný prehľad</p>
          {[
            { icon: Dumbbell, label: 'Tréning', desc: 'Silový tréning & HIIT', accent: '#7A9E78', accentBg: 'rgba(122,158,120,0.1)', time: '35 min' },
            { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', accent: '#B8864A', accentBg: 'rgba(196,149,106,0.1)', time: '' },
            { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', accent: '#9B8B7B', accentBg: 'rgba(155,139,123,0.1)', time: '10 min' },
          ].map(({ icon: Icon, label, desc, accent, accentBg, time }, idx) => (
            <div key={label} className="rounded-3xl p-4 flex items-center gap-3.5 transition-all hover:translate-y-[-2px]"
              style={{
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: `0 ${4 + idx * 2}px ${16 + idx * 4}px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)`,
                transform: `translateX(${idx * 4}px)`,
              }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: accentBg, boxShadow: `0 4px 12px ${accent}15` }}>
                <Icon size={22} style={{ color: accent }} />
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#2E3328]">{label}</p>
                <p className="text-[12px] text-[#9BA894]">{desc}</p>
              </div>
              {time && <span className="text-[11px] text-[#B0B8A8] font-medium">{time}</span>}
              <ChevronRight size={16} className="text-[#C0C8B8]" />
            </div>
          ))}
        </div>

        {/* Periodka */}
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(212,132,122,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}>
          <div className="absolute top-[-10px] right-[-10px] w-24 h-24 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #D4847A, transparent)', filter: 'blur(20px)' }} />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-[#D4847A]/70 uppercase tracking-[0.2em] mb-2">Periodka · Deň 8</p>
            <p className="text-[16px] font-bold text-[#2E3328]">Folikulárna fáza 🌱</p>
            <p className="text-[13px] text-[#7B8574] mt-1">Energia rastie — skvelý čas na nové výzvy!</p>
            <div className="flex gap-1.5 mt-4">
              {['#D4847A', '#8BA888', '#A889B0', '#B8864A'].map((c, i) => (
                <div key={i} className="h-2 rounded-full flex-1" style={{
                  background: i <= 1 ? c : 'rgba(0,0,0,0.05)',
                  boxShadow: i <= 1 ? `0 2px 8px ${c}25` : 'none',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Habits */}
        <SageCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-[#9BA894] uppercase tracking-[0.2em]">Návyky</p>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #C4956A, #A67B5B)', boxShadow: '0 3px 10px rgba(196,149,106,0.25)' }}>
              <Flame size={12} /> 5 dní
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{ background: 'rgba(122,158,120,0.06)', border: '1px solid rgba(122,158,120,0.1)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(122,158,120,0.12)' }}>
              <Droplets size={18} className="text-[#7A9E78]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2E3328]">Piť vodu</p>
              <p className="text-[11px] text-[#9BA894]">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="w-2.5 h-7 rounded-full" style={{
                  background: i < 5 ? 'linear-gradient(180deg, #7A9E78, #5F8060)' : 'rgba(0,0,0,0.05)',
                  boxShadow: i < 5 ? '0 2px 6px rgba(122,158,120,0.2)' : 'none',
                }} />
              ))}
            </div>
          </div>
        </SageCard>

        {/* Reflection */}
        <SageCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-[#B8864A]" />
            <p className="text-[10px] font-bold text-[#9BA894] uppercase tracking-[0.2em]">Reflexia</p>
          </div>
          <p className="text-[13px] text-[#7B8574] italic mb-3">"Za čo som dnes vďačná?"</p>
          <div className="h-20 rounded-2xl p-3"
            style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.06)' }}>
            <span className="text-[#B0B8A8] text-xs">Napíš sem...</span>
          </div>
        </SageCard>

        <p className="text-[13px] italic text-[#9BA894]/50 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function SageCard({ children, className = '', elevated = false }: { children: ReactNode; className?: string; elevated?: boolean }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: 'rgba(255,255,255,0.45)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      border: '1px solid rgba(255,255,255,0.55)',
      boxShadow: elevated
        ? '0 8px 32px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'
        : '0 4px 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
    }}>
      {children}
    </div>
  );
}


// ════════════════════════════════════════════
// DIRECTION 8: "Warm Dusk" — Warm dusk gradient, deep frosted glass, copper accents
// ════════════════════════════════════════════
function Direction8() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(170deg, #F0E6DA 0%, #E0CFC0 25%, #D0BCA8 50%, #C8B498 70%, #E0D4C4 100%)',
    }}>
      {/* Warm dusk glows */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #D4847A 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-[50%] right-[0%] w-[250px] h-[250px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #B8864A 0%, transparent 70%)', filter: 'blur(70px)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #B8864A, #96703C)',
                color: '#FFF',
                boxShadow: '0 4px 15px rgba(184,134,74,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E2218]">Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] text-[#8B7560] mt-0.5">Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <DuskGlassButton><Bell size={18} className="text-[#8B7560]" /></DuskGlassButton>
        </div>

        {/* Calendar */}
        <DuskCard>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] font-medium ${i === TODAY_IDX ? 'text-[#B8864A]' : 'text-[#A0907E]'}`}>{d}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold"
                  style={i === TODAY_IDX ? {
                    background: 'linear-gradient(135deg, #B8864A, #96703C)',
                    color: '#FFF',
                    boxShadow: '0 4px 14px rgba(184,134,74,0.3), 0 0 0 3px rgba(184,134,74,0.1)',
                  } : { color: '#8B7B6B' }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full bg-[#D4847A]/70" />}
              </div>
            ))}
          </div>
        </DuskCard>

        {/* Overview */}
        <DuskCard>
          <p className="text-[10px] font-bold text-[#B8864A]/50 uppercase tracking-[0.2em] mb-4">Dnešný prehľad</p>
          <div className="space-y-2.5">
            {[
              { icon: Dumbbell, label: 'Tréning', desc: 'Silový tréning & HIIT', time: '35 min' },
              { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', time: '' },
              { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', time: '10 min' },
            ].map(({ icon: Icon, label, desc, time }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:translate-y-[-1px]"
                style={{
                  background: 'rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)',
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(184,134,74,0.08)', border: '1px solid rgba(184,134,74,0.12)' }}>
                  <Icon size={20} className="text-[#B8864A]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#2E2218]">{label}</p>
                  <p className="text-[11px] text-[#A0907E]">{desc}</p>
                </div>
                {time && <span className="text-[11px] text-[#B8A898] font-medium">{time}</span>}
                <ChevronRight size={16} className="text-[#C8B8A8]" />
              </div>
            ))}
          </div>
        </DuskCard>

        {/* Periodka */}
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,132,122,0.12), rgba(196,149,106,0.08))',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(212,132,122,0.15)',
            boxShadow: '0 8px 32px rgba(212,132,122,0.06)',
          }}>
          <div className="absolute top-[-10px] right-[-10px] w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #D4847A, transparent)', filter: 'blur(25px)' }} />
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-[#D4847A]/70 uppercase tracking-[0.2em] mb-2">Periodka · Deň 8</p>
            <p className="text-[16px] font-bold text-[#2E2218]">Folikulárna fáza 🌱</p>
            <p className="text-[13px] text-[#8B7560] mt-1">Energia rastie — skvelý čas na nové výzvy!</p>
            <div className="flex gap-1.5 mt-4">
              {['#D4847A', '#8BA888', '#A889B0', '#B8864A'].map((c, i) => (
                <div key={i} className="h-2 rounded-full flex-1" style={{
                  background: i <= 1 ? `linear-gradient(90deg, ${c}, ${c}BB)` : 'rgba(0,0,0,0.05)',
                  boxShadow: i <= 1 ? `0 2px 8px ${c}25` : 'none',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Habits */}
        <DuskCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold text-[#A0907E] uppercase tracking-[0.2em]">Návyky</p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(184,134,74,0.12), rgba(196,149,106,0.08))',
                border: '1px solid rgba(184,134,74,0.15)',
                boxShadow: '0 2px 8px rgba(184,134,74,0.08)',
              }}>
              <Flame size={12} className="text-[#B8864A]" />
              <span className="text-[11px] font-bold text-[#B8864A]">5 dní</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.35)',
            }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(122,158,120,0.1)' }}>
              <Droplets size={18} className="text-[#7A9E78]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2E2218]">Piť vodu</p>
              <p className="text-[11px] text-[#A0907E]">5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="w-2.5 h-7 rounded-full" style={{
                  background: i < 5 ? 'linear-gradient(180deg, #7A9E78, #5F8060)' : 'rgba(0,0,0,0.05)',
                  boxShadow: i < 5 ? '0 2px 6px rgba(122,158,120,0.2)' : 'none',
                }} />
              ))}
            </div>
          </div>
        </DuskCard>

        {/* Reflection */}
        <DuskCard>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-[#B8864A]/60" />
            <p className="text-[10px] font-bold text-[#A0907E] uppercase tracking-[0.2em]">Reflexia</p>
          </div>
          <p className="text-[13px] text-[#8B7560] italic mb-3">"Za čo som dnes vďačná?"</p>
          <div className="h-20 rounded-2xl p-3"
            style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.06)' }}>
            <span className="text-[#B8A898] text-xs">Napíš sem...</span>
          </div>
        </DuskCard>

        <p className="text-[13px] italic text-[#A0907E]/40 text-center py-4">
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

function DuskCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-5 ${className}`} style={{
      background: 'rgba(255,255,255,0.28)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.35)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.4)',
    }}>
      {children}
    </div>
  );
}

function DuskGlassButton({ children }: { children: ReactNode }) {
  return (
    <button className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95"
      style={{
        background: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}>
      {children}
    </button>
  );
}


// ════════════════════════════════════════════
// MAIN SHOWCASE PAGE — Round 2
// ════════════════════════════════════════════
export default function DesignShowcase2() {
  const [active, setActive] = useState(0);
  const directions = [
    { name: 'Pearl Noir', desc: 'Pearl background + dark glass cards + warm gold', component: Direction5 },
    { name: 'Terracotta Frost', desc: 'Warm earthy gradient + frosted white cards + layered depth', component: Direction6 },
    { name: 'Sage & Sand', desc: 'Muted sage green + sand tones + floating glass layers', component: Direction7 },
    { name: 'Warm Dusk', desc: 'Deep frosted glass + copper accents + warm dusk gradient', component: Direction8 },
  ];

  const ActiveComponent = directions[active].component;

  return (
    <div className="font-lufga">
      {/* Sticky selector */}
      <div className="sticky top-0 z-50 px-4 py-3" style={{
        background: 'rgba(245,240,234,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <p className="text-[10px] font-bold text-[#8B7B6B] uppercase tracking-wider mb-2 text-center">NeoMe — Design Round 2</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {directions.map((d, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                active === i
                  ? 'text-white shadow-lg'
                  : 'text-[#8B7B6B] hover:bg-[#E8DDD0]'
              }`}
              style={active === i ? {
                background: 'linear-gradient(135deg, #A67B5B, #8B6548)',
                boxShadow: '0 4px 12px rgba(166,123,91,0.3)',
              } : {
                background: 'rgba(0,0,0,0.04)',
              }}
            >
              {i + 5}. {d.name}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#9B8B7B] mt-1.5 text-center">{directions[active].desc}</p>
      </div>

      {/* Active direction */}
      <ActiveComponent />
    </div>
  );
}
