import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Page, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Referral — R11 main share screen
 *
 * Photo hero, reward breakdown (Pre teba +250 / Pre ňu +100),
 * personalised code card, share CTA (uses Web Share API), tracking
 * teaser, 30-day qualification footnote (BC-3).
 *
 * Behavior rule (BC-3): points credit only after the invitee passes
 * the 30-day money-back window. Visual references this; the actual
 * gate is a separate behavior PR — flagged in REDESIGN_NOTES.
 *
 * TODO data: invited count + active Plus count + earned points from
 * referral tables. Code derived from email when available.
 *
 * Old version: ReferralPage.old.tsx.
 */

function deriveCode(email?: string | null): string {
  if (!email) return 'TVOJ·KOD';
  const stem = email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'NEO';
  return `${stem}·NEO`;
}

export default function ReferralPage() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const code = deriveCode(user?.email);
  const url = `https://neome.sk/p/${code.toLowerCase().replace('·', '-')}`;
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const onShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'NeoMe',
          text: 'Vyskúšaj NeoMe so mnou — a obe dostaneme bonus.',
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      onCopy();
    }
  };

  return (
    <Page>
      <div style={{ height: 320, position: 'relative', backgroundImage: 'url(/images/r9/lifestyle-mother-baby.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0.35) 0%, rgba(42,26,20,0.1) 45%, rgba(248,245,240,1) 100%)' }} />
        <div style={{ position: 'absolute', top: 56, left: 20, right: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Späť"
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <Eye color="rgba(255,255,255,0.85)">Pozvi kamarátku</Eye>
          <div style={{ width: 36, height: 36 }} />
        </div>
        <div style={{ position: 'absolute', bottom: 24, left: 20, right: 20 }}>
          <Eye color={NM.GOLD} style={{ marginBottom: 10 }}>Daruj mesiac · získaj body</Eye>
          <Ser size={40} color={NM.DEEP}>
            Podeľ sa o to,
            <br />
            čo ti <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>pomáha</em>.
          </Ser>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <Body size={14} color={NM.DEEP} weight={400} style={{ maxWidth: 340 }}>
          Pošli kamarátke svoj kód. Keď si aktivuje Plus, obe dostanete odmenu.
        </Body>
      </div>

      <div style={{ margin: '24px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ padding: '18px 16px', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}` }}>
          <Eye size={9} color={NM.GOLD} style={{ marginBottom: 10 }}>Pre teba</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 34, color: NM.GOLD, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>+250</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 4, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>bodov</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, marginTop: 10, fontWeight: 400, lineHeight: 1.45 }}>Za každú kamarátku, ktorá si aktivuje Plus.</div>
        </div>
        <div style={{ padding: '18px 16px', background: NM.CREAM_2 ?? '#F1ECE3', borderRadius: 18, border: `1px solid ${NM.HAIR}` }}>
          <Eye size={9} color={NM.TERRA} style={{ marginBottom: 10 }}>Pre ňu</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 34, color: NM.TERRA, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>+100</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 4, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>uvítacích bodov</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, marginTop: 10, fontWeight: 400, lineHeight: 1.45 }}>Na príchod do odmien, hneď po registrácii.</div>
        </div>
      </div>

      {/* Code card */}
      <div style={{ margin: '22px 20px 0', padding: '22px', background: `linear-gradient(135deg, ${NM.DEEP_2}, ${NM.DEEP})`, color: '#fff', borderRadius: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}44, transparent 70%)` }} />
        <div style={{ position: 'relative' }}>
          <Eye size={9} color={NM.GOLD}>Tvoj kód</Eye>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10, gap: 12 }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 36, fontWeight: 500, letterSpacing: '0.12em' }}>{code}</div>
            <button
              onClick={onCopy}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 10,
                fontFamily: NM.SANS,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.04em',
              }}
            >
              {copied ? 'Skopírované' : 'Kopírovať'}
            </button>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.12)', fontFamily: NM.SANS, fontSize: 11.5, color: 'rgba(255,255,255,0.65)', fontWeight: 400, lineHeight: 1.5 }}>
            {url}
          </div>
        </div>
      </div>

      {/* Share CTA */}
      <div style={{ margin: '20px 20px 0' }}>
        <button
          onClick={onShare}
          style={{
            width: '100%',
            padding: '15px 20px',
            background: NM.TERRA,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" />
          </svg>
          Zdieľať pozvánku
        </button>
        <div style={{ marginTop: 10, textAlign: 'center', fontFamily: NM.SANS, fontSize: 11.5, color: NM.TERTIARY, fontWeight: 400 }}>
          Otvorí sa systémové zdieľanie
        </div>
      </div>

      {/* Tracking teaser */}
      <button
        onClick={() => navigate('/referral/tracking')}
        style={{
          all: 'unset',
          cursor: 'pointer',
          margin: '24px 20px 0',
          padding: '16px 18px',
          background: '#fff',
          borderRadius: 16,
          border: `1px solid ${NM.HAIR}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex' }}>
          {[NM.TERRA, NM.SAGE, NM.MAUVE].map((c, i) => (
            <div
              key={c}
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: c,
                border: '2px solid #fff',
                marginLeft: i ? -10 : 0,
                fontFamily: NM.SERIF,
                fontSize: 13,
                color: '#fff',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {['L', 'Z', 'M'][i]}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {/* TODO data: real invitee + active Plus counts */}
          <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>3 pozvané kamarátky</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 3, fontWeight: 400 }}>2 s aktívnym Plus · 500 bodov získaných</div>
        </div>
        <div style={{ color: NM.TERTIARY, fontSize: 16 }}>›</div>
      </button>

      {/* Legal summary — BC-3 visual reference */}
      <div style={{ margin: '20px 20px 0', fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, lineHeight: 1.55, fontWeight: 400 }}>
        Body sa pripisujú po 30-dňovej lehote záruky vrátenia peňazí. Bez limitu na počet pozvaní.{' '}
        <span style={{ color: NM.DEEP, textDecoration: 'underline', fontWeight: 500 }}>Celé pravidlá</span>
      </div>
    </Page>
  );
}
