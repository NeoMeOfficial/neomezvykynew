import { NM } from './neome';

/**
 * THE loading indicator (Sam 2026-10-05: several competing styles
 * showed during app load — this is now the only one). Three gold
 * breathing dots on the app ground, one calm label. Use `label` for
 * context ("Načítavam meditáciu…"); `fullScreen={false}` renders the
 * same dots inline inside a section.
 */
export default function LoadingScreen({ label = 'Načítavam…', fullScreen = true }: {
  label?: string;
  fullScreen?: boolean;
}) {
  const dots = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8, height: 8, borderRadius: 999, background: NM.GOLD,
              animation: 'nmPulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>{label}</span>
      <style>{'@keyframes nmPulse { 0%, 100% { opacity: 0.25; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1); } }'}</style>
    </div>
  );

  if (!fullScreen) return <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>{dots}</div>;

  return (
    <div style={{ minHeight: '100vh', background: NM.BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {dots}
    </div>
  );
}
