import { NM } from './neome';

/**
 * THE loading indicator — a frosted-glass surface with three gold
 * breathing dots, no text (Sam 2026-10-06: the "Načítavam…" label +
 * bare spinner felt cheap mid-transition). Because it's translucent
 * and blurred, it reads as one continuous glass surface with the
 * route-change veil (nm-glass-veil) — a page resolves out of frost
 * whether it's the chunk, the data, or both that's loading.
 *
 * `label` is accepted for backwards compatibility but intentionally
 * not shown. `fullScreen={false}` renders the dots inline inside a
 * section (no glass overlay) for in-content spots.
 */
export default function LoadingScreen({ fullScreen = true }: {
  label?: string;
  fullScreen?: boolean;
}) {
  const dots = (
    <div style={{ display: 'flex', gap: 7 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 9, height: 9, borderRadius: 999, background: NM.GOLD,
            animation: 'nmPulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
      <style>{'@keyframes nmPulse { 0%, 100% { opacity: 0.22; transform: scale(0.82); } 50% { opacity: 1; transform: scale(1); } }'}</style>
    </div>
  );

  if (!fullScreen) {
    return <div style={{ padding: '44px 0', display: 'flex', justifyContent: 'center' }}>{dots}</div>;
  }

  // Frosted glass overlay — fades in softly, blurs whatever is behind,
  // and is continuous with the navigation veil.
  return (
    <div
      aria-busy="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(248, 245, 240, 0.55)',
        backdropFilter: 'blur(18px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.1)',
        animation: 'nmFadeIn 0.3s ease-out both',
      }}
    >
      <style>{'@keyframes nmFadeIn { from { opacity: 0 } to { opacity: 1 } }'}</style>
      {dots}
    </div>
  );
}
