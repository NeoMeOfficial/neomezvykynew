import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  Bell, Dumbbell, UtensilsCrossed, Brain, ChevronRight,
  Droplets, BookOpen, Flame, Heart,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN SHOWCASE 3 — Warm Dusk Refined
   Based on Direction 8 with refined color system
   ───────────────────────────────────────────── */

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
const TODAY_IDX = 3;
const DATES = [17, 18, 19, 20, 21, 22, 23];

/* ── Color System ────────────────────────────
   Primary accent:   #B8864A (copper)
   Telo:             #6B4C3B (dark frost brown)
   Strava:           #7A9E78 (sage green)
   Myseľ:            #A8848B (dusty mauve)
   Periodka:         #C27A6E (soft terracotta)
   Text primary:     #2E2218 (warm black)
   Text secondary:   #8B7560 (warm mid — matches subline)
   Text tertiary:    #A0907E (muted)
   Section labels:   #8B7560 (same as subline)
   ──────────────────────────────────────────── */

const COLORS = {
  telo: { main: '#6B4C3B', bg: 'rgba(107,76,59,0.08)', border: 'rgba(107,76,59,0.12)', glow: 'rgba(107,76,59,0.10)' },
  strava: { main: '#7A9E78', bg: 'rgba(122,158,120,0.08)', border: 'rgba(122,158,120,0.12)', glow: 'rgba(122,158,120,0.10)' },
  mysel: { main: '#A8848B', bg: 'rgba(168,132,139,0.08)', border: 'rgba(168,132,139,0.12)', glow: 'rgba(168,132,139,0.10)' },
  periodka: { main: '#C27A6E', bg: 'rgba(194,122,110,0.08)', border: 'rgba(194,122,110,0.12)', glow: 'rgba(194,122,110,0.10)' },
  accent: '#B8864A',
  textPrimary: '#2E2218',
  textSecondary: '#8B7560',
  textTertiary: '#A0907E',
  sectionLabel: '#8B7560',
};

export default function DesignShowcase3() {
  return (
    <div className="font-lufga">
      {/* Header bar */}
      <div className="sticky top-0 z-50 px-4 py-3 text-center" style={{
        background: 'rgba(240,230,218,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <p className="text-[10px] font-bold text-[#8B7560] uppercase tracking-wider">NeoMe — Warm Dusk Refined</p>
        <p className="text-[11px] text-[#A0907E] mt-0.5">Unique icon colors · Unified labels · Periodka matched</p>
      </div>

      {/* The design */}
      <WarmDuskRefined />
    </div>
  );
}

function WarmDuskRefined() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(170deg, #F0E6DA 0%, #E0CFC0 25%, #D0BCA8 50%, #C8B498 70%, #E0D4C4 100%)',
    }}>
      {/* Warm ambient glows */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full opacity-18"
        style={{ background: 'radial-gradient(circle, #C27A6E 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-[50%] right-[0%] w-[250px] h-[250px] rounded-full opacity-12"
        style={{ background: 'radial-gradient(circle, #B8864A 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="absolute bottom-[10%] left-[30%] w-[200px] h-[200px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #7A9E78 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-8 pb-24 space-y-5">

        {/* ── Greeting ──────────────────────── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${COLORS.accent}, #96703C)`,
                color: '#FFF',
                boxShadow: `0 4px 15px rgba(184,134,74,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}>
              K
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>Krásne ráno, Katka ☀️</h1>
              <p className="text-[13px] mt-0.5" style={{ color: COLORS.textSecondary }}>Dnes budujeme silu, nie výčitky 🌿</p>
            </div>
          </div>
          <GlassButton><Bell size={18} style={{ color: COLORS.textSecondary }} /></GlassButton>
        </div>

        {/* ── Calendar ──────────────────────── */}
        <Card>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-medium" style={{ color: i === TODAY_IDX ? COLORS.accent : COLORS.textTertiary }}>{d}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold"
                  style={i === TODAY_IDX ? {
                    background: `linear-gradient(135deg, ${COLORS.accent}, #96703C)`,
                    color: '#FFF',
                    boxShadow: '0 4px 14px rgba(184,134,74,0.3), 0 0 0 3px rgba(184,134,74,0.08)',
                  } : { color: COLORS.textTertiary }}>
                  {DATES[i]}
                </div>
                {[0, 1].includes(i) && <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${COLORS.periodka.main}90` }} />}
              </div>
            ))}
          </div>
        </Card>

        {/* ── Dnešný prehľad ────────────────── */}
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: COLORS.sectionLabel }}>Dnešný prehľad</p>
          <div className="space-y-2.5">
            {[
              { icon: Dumbbell, label: 'Telo', desc: 'Silový tréning & HIIT', c: COLORS.telo, time: '35 min' },
              { icon: UtensilsCrossed, label: 'Strava', desc: 'Acai miska na raňajky', c: COLORS.strava, time: '' },
              { icon: Brain, label: 'Myseľ', desc: 'Ranná meditácia', c: COLORS.mysel, time: '10 min' },
            ].map(({ icon: Icon, label, desc, c, time }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:translate-y-[-1px]"
                style={{
                  background: 'rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)',
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 4px 12px ${c.glow}` }}>
                  <Icon size={20} style={{ color: c.main }} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold" style={{ color: COLORS.textPrimary }}>{label}</p>
                  <p className="text-[12px]" style={{ color: COLORS.textTertiary }}>{desc}</p>
                </div>
                {time && <span className="text-[11px] font-medium" style={{ color: COLORS.textTertiary }}>{time}</span>}
                <ChevronRight size={16} style={{ color: '#C8B8A8' }} />
              </div>
            ))}
          </div>
        </Card>

        {/* ── Periodka (same Card style as overview) ── */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: COLORS.sectionLabel }}>Periodka</p>
            <span className="text-[11px] font-medium" style={{ color: COLORS.textTertiary }}>Deň 8 z 28</span>
          </div>

          {/* Phase highlight */}
          <div className="p-4 rounded-2xl relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}>
            <div className="absolute top-[-15px] right-[-15px] w-24 h-24 rounded-full opacity-12"
              style={{ background: `radial-gradient(circle, ${COLORS.periodka.main}, transparent)`, filter: 'blur(20px)' }} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: COLORS.periodka.bg, border: `1px solid ${COLORS.periodka.border}`, boxShadow: `0 4px 12px ${COLORS.periodka.glow}` }}>
                <Heart size={20} style={{ color: COLORS.periodka.main }} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold" style={{ color: COLORS.textPrimary }}>Folikulárna fáza 🌱</p>
                <p className="text-[12px]" style={{ color: COLORS.textTertiary }}>Energia rastie — skvelý čas na nové výzvy!</p>
              </div>
              <ChevronRight size={16} style={{ color: '#C8B8A8' }} />
            </div>
          </div>

          {/* Phase bar */}
          <div className="flex gap-1.5 mt-4 px-1">
            {[
              { c: COLORS.periodka.main, label: 'Menštruácia' },
              { c: COLORS.strava.main, label: 'Folikulárna' },
              { c: COLORS.mysel.main, label: 'Ovulácia' },
              { c: COLORS.accent, label: 'Luteálna' },
            ].map((phase, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="h-2 w-full rounded-full" style={{
                  background: i <= 1 ? `linear-gradient(90deg, ${phase.c}, ${phase.c}BB)` : 'rgba(0,0,0,0.05)',
                  boxShadow: i <= 1 ? `0 2px 8px ${phase.c}25` : 'none',
                }} />
                <span className="text-[9px] font-medium" style={{ color: i <= 1 ? phase.c : COLORS.textTertiary }}>{phase.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Návyky ────────────────────────── */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: COLORS.sectionLabel }}>Návyky</p>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
                background: `rgba(184,134,74,0.1)`,
                border: `1px solid rgba(184,134,74,0.15)`,
                boxShadow: '0 2px 8px rgba(184,134,74,0.06)',
              }}>
              <Flame size={12} style={{ color: COLORS.accent }} />
              <span className="text-[11px] font-bold" style={{ color: COLORS.accent }}>5 dní</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: COLORS.strava.bg, border: `1px solid ${COLORS.strava.border}` }}>
              <Droplets size={18} style={{ color: COLORS.strava.main }} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold" style={{ color: COLORS.textPrimary }}>Piť vodu</p>
              <p className="text-[11px]" style={{ color: COLORS.textTertiary }}>5 / 8 pohárov</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="w-2.5 h-7 rounded-full" style={{
                  background: i < 5 ? `linear-gradient(180deg, ${COLORS.strava.main}, #5F8060)` : 'rgba(0,0,0,0.05)',
                  boxShadow: i < 5 ? '0 2px 6px rgba(122,158,120,0.2)' : 'none',
                }} />
              ))}
            </div>
          </div>
        </Card>

        {/* ── Reflexia ──────────────────────── */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} style={{ color: COLORS.mysel.main }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: COLORS.sectionLabel }}>Reflexia</p>
          </div>
          <p className="text-[13px] italic mb-3" style={{ color: COLORS.textSecondary }}>"Za čo som dnes vďačná?"</p>
          <div className="h-20 rounded-2xl p-3"
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              border: '1px dashed rgba(0,0,0,0.06)',
            }}>
            <span className="text-xs" style={{ color: COLORS.textTertiary }}>Napíš sem...</span>
          </div>
        </Card>

        {/* ── Footer quote ──────────────────── */}
        <p className="text-[13px] italic text-center py-4" style={{ color: `${COLORS.textTertiary}66` }}>
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}

/* ── Shared Components ────────────────────── */

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
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

function GlassButton({ children }: { children: ReactNode }) {
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
