import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM } from '../../components/v2/neome';
import { supabase } from '../../lib/supabase';

/**
 * Odporuč kamarátke — the universal referral page (Sam 2026-10-05).
 *
 * Every user gets an auto-generated code (server-side, NAME-XXXX; the
 * vanity namespace stays reserved for approved affiliates). A referred
 * friend's FIRST payment earns +150 points; five paying friends make
 * the user eligible for the partner program (money instead of points)
 * — the progress strip makes that funnel visible.
 *
 * Approved affiliates are redirected to /partner.
 */

interface RefData {
  code: string;
  status: string;
  referrals: number;
  paying: number;
  needed_for_partner: number;
}

export default function OdporucPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<RefData | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) { setError(true); return; }
        const res = await fetch('/.netlify/functions/referral-code', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) { setError(true); return; }
        const body: RefData = await res.json();
        if (cancelled) return;
        if (body.status === 'active') { navigate('/partner', { replace: true }); return; }
        setData(body);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  const shareLink = data ? `https://app.neome.com.au/auth?mode=register&ref=${data.code}` : null;

  // Share ONLY the URL: when text+url are both present, iOS's share-sheet
  // "Copy" concatenates them and the pasted link breaks (Sam 2026-10-05).
  const share = async () => {
    if (!shareLink) return;
    try {
      if (navigator.share) {
        await navigator.share({ url: shareLink });
      } else {
        await copyLink();
      }
    } catch { /* user cancelled share sheet */ }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, padding: '18px 16px',
  };

  return (
    <div style={{ minHeight: '100vh', background: NM.BG, padding: '0 18px 60px', fontFamily: NM.SANS }}>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 0 6px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/profil')} aria-label="Späť" style={{ all: 'unset', cursor: 'pointer', width: 40, height: 40, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
      </div>

      <h1 style={{ fontFamily: NM.SERIF, fontSize: 26, fontWeight: 500, color: NM.DEEP, margin: '6px 0 2px' }}>Odporuč kamarátke</h1>
      <div style={{ fontSize: 13.5, color: NM.MUTED, marginBottom: 18, lineHeight: 1.5 }}>
        Za každú kamarátku, ktorá si cez tvoj odkaz predplatí NeoMe, dostaneš <b style={{ color: NM.DEEP }}>+150 bodov</b> — body meníš na zľavy z predplatného.
      </div>

      {error && (
        <div style={{ ...card, borderColor: 'rgba(194,122,110,0.35)' }}>
          <div style={{ fontSize: 13.5, color: '#B4584A' }}>Odkaz sa nepodarilo načítať. Skús to o chvíľu.</div>
        </div>
      )}

      {!data && !error && (
        <div style={{ fontSize: 13.5, color: NM.MUTED }}>Pripravujem tvoj odkaz…</div>
      )}

      {data && (
        <>
          <div style={{ ...card, marginBottom: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: NM.TERTIARY, marginBottom: 6 }}>Tvoj odkaz</div>
            <div style={{ fontSize: 12.5, color: NM.MUTED, wordBreak: 'break-all', background: NM.BG, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
              {shareLink}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={share}
                style={{ all: 'unset', cursor: 'pointer', padding: '11px 20px', borderRadius: 999, background: NM.DEEP, color: '#fff', fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 500 }}
              >
                Zdieľať odkaz
              </button>
              <button
                onClick={copyLink}
                style={{ all: 'unset', cursor: 'pointer', padding: '11px 20px', borderRadius: 999, border: `1px solid ${NM.HAIR_2}`, color: NM.DEEP, fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 500 }}
              >
                {copied ? 'Skopírované ✓' : 'Kopírovať odkaz'}
              </button>
            </div>
          </div>

          <div style={{ ...card, marginBottom: 14 }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, marginBottom: 8 }}>
              Cesta k partnerstvu
            </div>
            <div style={{ fontSize: 13, color: NM.MUTED, lineHeight: 1.55, marginBottom: 12 }}>
              {data.paying} z {data.needed_for_partner} platiacich kamarátok. Po piatej sa môžeš stať <b style={{ color: NM.DEEP }}>partnerkou NeoMe</b> — z každej platby tvojich odporúčaní potom zarábaš peniaze, nie body.
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: data.needed_for_partner }, (_, i) => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 999, background: i < data.paying ? NM.GOLD : NM.HAIR_2 }} />
              ))}
            </div>
            {data.paying >= data.needed_for_partner && (
              <div style={{ marginTop: 12, fontSize: 13, color: NM.GOLD, fontWeight: 500 }}>
                Spĺňaš podmienky! Napíš nám v Správach a dohodneme partnerstvo. 🎉
              </div>
            )}
            {data.referrals > data.paying && (
              <div style={{ marginTop: 10, fontSize: 12, color: NM.TERTIARY }}>
                Registrovaných cez tvoj odkaz: {data.referrals} — počíta sa prvá platba.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
