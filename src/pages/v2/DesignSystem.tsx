import { colors, fonts, glassCard, innerGlass, glassButton, primaryButton, iconContainer } from '../../theme/warmDusk';
import { Dumbbell, Leaf, Brain, Heart, Droplets, Star, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Primitives ──────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, rgba(184,134,74,0.4), transparent)` }} />
        <span style={{
          fontFamily: fonts.sans,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: colors.accent,
        }}>
          {title}
        </span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, rgba(184,134,74,0.4), transparent)` }} />
      </div>
      {children}
    </section>
  );
}

function Token({ label, value, preview }: { label: string; value: string; preview?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(184,134,74,0.1)' }}>
      <div>
        <p style={{ fontFamily: fonts.sans, fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>{label}</p>
        <p style={{ fontFamily: '"JetBrains Mono", "Fira Mono", monospace', fontSize: 10, color: colors.textTertiary, marginTop: 2 }}>{value}</p>
      </div>
      {preview}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DesignSystem() {
  const navigate = useNavigate();

  const sectionColors = [
    { name: 'Telo', token: 'colors.telo', hex: colors.telo, Icon: Dumbbell, label: 'Exercise' },
    { name: 'Strava', token: 'colors.strava', hex: colors.strava, Icon: Leaf, label: 'Nutrition' },
    { name: 'Myseľ', token: 'colors.mysel', hex: colors.mysel, Icon: Brain, label: 'Mind' },
    { name: 'Periodka', token: 'colors.periodka', hex: colors.periodka, Icon: Heart, label: 'Cycle' },
    { name: 'Accent', token: 'colors.accent', hex: colors.accent, Icon: Star, label: 'CTA / Highlights' },
  ];

  const textColors = [
    { name: 'Primary', token: 'colors.textPrimary', hex: colors.textPrimary, usage: 'Headings, names' },
    { name: 'Secondary', token: 'colors.textSecondary', hex: colors.textSecondary, usage: 'Body copy, sublines' },
    { name: 'Tertiary', token: 'colors.textTertiary', hex: colors.textTertiary, usage: 'Labels, meta, placeholders' },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: colors.bgGradient }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 px-4 pt-10 pb-4" style={{
        background: 'rgba(250,247,242,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(184,134,74,0.12)',
      }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4"
          style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Späť
        </button>
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: 6,
        }}>
          NeoMe · Design System
        </p>
        <h1 style={{
          fontFamily: fonts.display,
          fontSize: 36,
          fontWeight: 400,
          color: colors.textPrimary,
          lineHeight: 1.1,
        }}>
          Brand & UI Tokens
        </h1>
        <p style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Single source of truth for the NeoMe visual language.
        </p>
      </div>

      <div className="px-4 pt-8 space-y-10">

        {/* ── Identity ───────────────────────────────────────────────────── */}
        <Section title="Brand Identity">
          <div style={{ ...glassCard, padding: 20 }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
                background: `linear-gradient(135deg, ${colors.accent}22, ${colors.periodka}22)`,
                border: `1px solid rgba(184,134,74,0.2)`,
              }}>
                <Heart size={24} style={{ color: colors.accent }} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 400, color: colors.textPrimary, lineHeight: 1.1 }}>NeoMe</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: colors.textSecondary, marginTop: 2 }}>Wellness · Women · Life</p>
              </div>
            </div>
            <p style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
              NeoMe is a premium Slovak wellness platform for women. The visual language is warm, editorial, and intimate — grounded in natural textures and a serif/sans pairing that balances softness with clarity.
            </p>
          </div>
        </Section>

        {/* ── Typography ─────────────────────────────────────────────────── */}
        <Section title="Typography">
          <div style={{ ...glassCard, padding: 20 }} className="space-y-6">

            {/* Display */}
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.accent, marginBottom: 12 }}>
                Display — Bodoni Moda
              </p>
              <div className="space-y-3">
                {[
                  { size: 36, weight: 400, label: 'Hero / Page identity', sample: 'Krásne ráno' },
                  { size: 28, weight: 400, label: 'Page title H1', sample: 'Knižnica' },
                  { size: 22, weight: 400, label: 'Section heading H2', sample: 'Meditácie' },
                ].map(({ size, weight, label, sample }) => (
                  <div key={size} className="flex items-baseline gap-4">
                    <p style={{ fontFamily: fonts.display, fontSize: size, fontWeight: weight, color: colors.textPrimary, lineHeight: 1.1, minWidth: 0, flex: 1 }}>
                      {sample}
                    </p>
                    <div className="shrink-0 text-right">
                      <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.textTertiary }}>{size}px · w{weight}</p>
                      <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.textTertiary, marginTop: 1 }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ background: 'rgba(184,134,74,0.12)' }} />

            {/* Body */}
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.strava, marginBottom: 12 }}>
                Body — DM Sans
              </p>
              <div className="space-y-3">
                {[
                  { size: 15, weight: 500, label: 'Card title / strong UI', sample: 'Recept dňa' },
                  { size: 14, weight: 400, label: 'Body copy', sample: 'Buď každý deň o krok bližšie k svojmu zdraviu.' },
                  { size: 12, weight: 400, label: 'Labels / meta / captions', sample: 'Dnes · 5 min · 320 kcal' },
                  { size: 10, weight: 600, label: 'Micro labels / uppercase caps', sample: 'DNES · POKROKY · KOMUNITA' },
                ].map(({ size, weight, label, sample }) => (
                  <div key={`${size}-${weight}`} className="flex items-start gap-4">
                    <p style={{ fontFamily: fonts.sans, fontSize: size, fontWeight: weight, color: colors.textPrimary, lineHeight: 1.4, flex: 1 }}>
                      {sample}
                    </p>
                    <div className="shrink-0 text-right" style={{ minWidth: 80 }}>
                      <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.textTertiary }}>{size}px · w{weight}</p>
                      <p style={{ fontFamily: fonts.sans, fontSize: 9, color: colors.textTertiary, marginTop: 1 }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ background: 'rgba(184,134,74,0.12)' }} />

            {/* Rule */}
            <div style={{ ...innerGlass, padding: 14 }}>
              <p style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, color: colors.accent, marginBottom: 6 }}>Typography Rule</p>
              <div className="space-y-1.5">
                {[
                  ['≥ 20px — page / section titles', 'Bodoni Moda', colors.textPrimary],
                  ['< 20px — all UI text, labels, body', 'DM Sans', colors.strava],
                  ['Navigation, buttons, chips', 'DM Sans always', colors.mysel],
                ].map(([when, font, clr]) => (
                  <div key={when as string} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: clr as string }} />
                    <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary }}>
                      <span style={{ color: clr as string, fontWeight: 600 }}>{font as string}</span> — {when as string}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Colour Palette ─────────────────────────────────────────────── */}
        <Section title="Colour Palette">
          <div style={{ ...glassCard, padding: 20 }} className="space-y-5">

            {/* Section colors */}
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.textTertiary, marginBottom: 10 }}>
                Section Accents
              </p>
              <div className="grid grid-cols-5 gap-2">
                {sectionColors.map(({ name, hex, Icon, label }) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <div className="w-full aspect-square rounded-2xl flex items-center justify-center" style={{ background: hex }}>
                      <Icon size={18} color="white" strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p style={{ fontFamily: fonts.display, fontSize: 13, fontWeight: 400, color: colors.textPrimary }}>{name}</p>
                      <p style={{ fontFamily: fonts.sans, fontSize: 9, color: colors.textTertiary, marginTop: 1 }}>{hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ background: 'rgba(184,134,74,0.12)' }} />

            {/* Text hierarchy */}
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.textTertiary, marginBottom: 10 }}>
                Text Hierarchy
              </p>
              {textColors.map(({ name, hex, usage }) => (
                <Token
                  key={name}
                  label={name}
                  value={hex}
                  preview={
                    <div className="flex items-center gap-2">
                      <p style={{ fontFamily: fonts.sans, fontSize: 11, color: hex }}>{usage}</p>
                      <div className="w-5 h-5 rounded-full border border-white/40" style={{ background: hex }} />
                    </div>
                  }
                />
              ))}
            </div>

            <div className="h-px" style={{ background: 'rgba(184,134,74,0.12)' }} />

            {/* Background */}
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.textTertiary, marginBottom: 10 }}>
                Background
              </p>
              <Token
                label="App Background"
                value="#FAF7F2 → #F5F1E8 (gradient)"
                preview={
                  <div className="w-12 h-6 rounded-lg border border-white/40" style={{ background: colors.bgGradient }} />
                }
              />
            </div>
          </div>
        </Section>

        {/* ── Glass System ───────────────────────────────────────────────── */}
        <Section title="Glass System">
          <div className="space-y-3">

            {/* glassCard */}
            <div style={{ ...glassCard, padding: 16 }}>
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.accent }}>glassCard</p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Primary container — pages, major cards</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {[
                  ['background', 'rgba(255,255,255,0.22)'],
                  ['backdrop-filter', 'blur(24px)'],
                  ['border', '1px solid rgba(255,255,255,0.30)'],
                  ['border-radius', '20px'],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex gap-2">
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: colors.textTertiary, minWidth: 110 }}>{k as string}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, color: colors.textPrimary }}>{v as string}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* innerGlass */}
            <div style={{ ...glassCard, padding: 16 }}>
              <div style={{ ...innerGlass, padding: 12 }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.strava }}>innerGlass</p>
                <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>Nested element inside a card</p>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: colors.textTertiary, marginTop: 6 }}>bg rgba(255,255,255,0.35) · blur(15px) · r16</p>
              </div>
            </div>

            {/* glassButton */}
            <div style={{ ...glassCard, padding: 16 }}>
              <button style={{ ...glassButton, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontFamily: fonts.sans, fontSize: 13, fontWeight: 500, color: colors.textPrimary }}>glassButton</p>
                <ChevronRight size={14} style={{ color: colors.textSecondary }} />
              </button>
              <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary, marginTop: 8 }}>Secondary actions, navigation triggers</p>
            </div>
          </div>
        </Section>

        {/* ── Buttons ────────────────────────────────────────────────────── */}
        <Section title="Buttons">
          <div style={{ ...glassCard, padding: 20 }} className="space-y-3">

            {/* Primary */}
            <button style={{ ...primaryButton, padding: '14px 24px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 600 }}>Primárne tlačidlo</p>
            </button>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textTertiary, paddingLeft: 4 }}>
              primaryButton — gradient copper, white text, r16
            </p>

            <div className="h-px" style={{ background: 'rgba(184,134,74,0.12)' }} />

            {/* Section-coloured CTAs */}
            <div className="grid grid-cols-2 gap-2">
              {sectionColors.slice(0, 4).map(({ name, hex }) => (
                <button
                  key={name}
                  style={{
                    background: `${hex}18`,
                    border: `1px solid ${hex}30`,
                    borderRadius: 12,
                    padding: '10px 14px',
                    fontFamily: fonts.sans,
                    fontSize: 12,
                    fontWeight: 600,
                    color: hex,
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textTertiary, paddingLeft: 4 }}>
              Section ghost buttons — color at 18% opacity fill, 30% border
            </p>

            <div className="h-px" style={{ background: 'rgba(184,134,74,0.12)' }} />

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              <button style={{
                background: colors.telo,
                color: 'white',
                borderRadius: 20,
                padding: '6px 14px',
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 500,
              }}>Aktívny filter</button>
              <button style={{
                background: 'rgba(255,255,255,0.30)',
                color: colors.textSecondary,
                border: '1px solid rgba(255,255,255,0.40)',
                borderRadius: 20,
                padding: '6px 14px',
                fontFamily: fonts.sans,
                fontSize: 12,
              }}>Neaktívny</button>
            </div>
            <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textTertiary, paddingLeft: 4 }}>
              Filter pills — active: section solid · inactive: glass/30
            </p>
          </div>
        </Section>

        {/* ── Section Icons ─────────────────────────────────────────────── */}
        <Section title="Section Icons">
          <div style={{ ...glassCard, padding: 20 }}>
            <div className="space-y-3">
              {sectionColors.map(({ name, hex, Icon, label }) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={iconContainer(hex)}>
                    <Icon size={18} style={{ color: hex }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 400, color: colors.textPrimary }}>{name}</p>
                    <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textTertiary }}>{label} · iconContainer({'{'}color{'}'}) · r12</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={iconContainer(colors.textSecondary)}>
                  <Droplets size={18} style={{ color: colors.textSecondary }} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontFamily: fonts.display, fontSize: 16, fontWeight: 400, color: colors.textPrimary }}>Utility</p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textTertiary }}>Generic · uses textSecondary color</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Spacing ────────────────────────────────────────────────────── */}
        <Section title="Spacing & Radius">
          <div style={{ ...glassCard, padding: 20 }} className="space-y-4">
            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.textTertiary, marginBottom: 10 }}>
                Border Radius
              </p>
              {[
                ['r8', '8px', 'Inline chips, tags'],
                ['r12', '12px', 'Icon containers, pills'],
                ['r16', '16px', 'Buttons, inner cards'],
                ['r20', '20px', 'Primary cards (glassCard)'],
                ['r24', '24px', 'Full-bleed hero sections'],
              ].map(([token, value, usage]) => (
                <div key={token as string} className="flex items-center gap-3 py-1.5 border-b" style={{ borderColor: 'rgba(184,134,74,0.08)' }}>
                  <div style={{ width: 36, height: 36, background: `rgba(184,134,74,0.15)`, borderRadius: parseInt((value as string), 10) }} />
                  <div className="flex-1">
                    <p style={{ fontFamily: 'monospace', fontSize: 11, color: colors.textPrimary }}>{token as string} · {value as string}</p>
                    <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.textTertiary }}>{usage as string}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px" style={{ background: 'rgba(184,134,74,0.12)' }} />

            <div>
              <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: colors.textTertiary, marginBottom: 10 }}>
                Page Layout
              </p>
              {[
                ['px-3 / px-4', 'Horizontal page padding'],
                ['py-6', 'Top page padding'],
                ['pb-28', 'Bottom padding (nav bar clearance)'],
                ['space-y-4', 'Card gap (standard)'],
                ['space-y-6', 'Section gap (between groups)'],
              ].map(([token, usage]) => (
                <Token key={token as string} label={token as string} value={usage as string} />
              ))}
            </div>
          </div>
        </Section>

        {/* ── Phase Colors ───────────────────────────────────────────────── */}
        <Section title="Cycle Phase Palette">
          <div style={{ ...glassCard, padding: 20 }}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { phase: 'Menštrukcia', color: '#C27A6E', days: 'Dni 1–5', desc: 'Nízka energia, introspekcia' },
                { phase: 'Folikulárna', color: '#7A9E78', days: 'Dni 6–13', desc: 'Rastúca energia, otvorenosť' },
                { phase: 'Ovulácia', color: '#A8848B', days: 'Deň 14', desc: 'Peak energia, komunikácia' },
                { phase: 'Luteálna', color: '#B8864A', days: 'Dni 15–28', desc: 'Intenzita, spomalenie' },
              ].map(({ phase, color, days, desc }) => (
                <div key={phase} style={{ ...innerGlass, padding: 12 }}>
                  <div className="w-6 h-6 rounded-full mb-2" style={{ background: color }} />
                  <p style={{ fontFamily: fonts.display, fontSize: 14, fontWeight: 400, color: colors.textPrimary }}>{phase}</p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 10, fontWeight: 600, color, marginTop: 2 }}>{days}</p>
                  <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.textTertiary, marginTop: 3, lineHeight: 1.4 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="text-center pb-4">
          <p style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 400, color: colors.textTertiary }}>NeoMe Design System</p>
          <p style={{ fontFamily: fonts.sans, fontSize: 10, color: colors.textTertiary, letterSpacing: '0.2em', marginTop: 4 }}>v1.0 · Bodoni Moda + DM Sans · Warm Dusk</p>
        </div>

      </div>
    </div>
  );
}
