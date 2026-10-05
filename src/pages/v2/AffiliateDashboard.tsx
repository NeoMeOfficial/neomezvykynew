import { useCallback, useEffect, useState } from 'react';
import LoadingScreen from '../../components/v2/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { NM } from '../../components/v2/neome';
import { supabase } from '../../lib/supabase';

/**
 * Partnerský program — affiliate dashboard (Sam 2026-10-02).
 *
 * Mounted at /partner; the Profil row is shown only to accounts with an
 * affiliates row (admin-granted). All data comes from the
 * affiliate-dashboard function; code claiming and payout requests go
 * through their own server functions, which own every rule (code
 * uniqueness, 30-day maturity, €10 minimum, one open request).
 */

interface DashData {
  code: string | null;
  commission_pct: number;
  status: string;
  referrals: { label: string; joined: string; earned_cents: number }[];
  totals: { pending: number; available: number; requested: number; paid: number };
  payouts: { id: string; amount_cents: number; status: string; requested_at: string; processed_at: string | null }[];
}

const eur = (cents: number) => `${(cents / 100).toFixed(2).replace('.', ',')} €`;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('sk-SK');

const PAYOUT_STATUS_SK: Record<string, string> = {
  requested: 'v spracovaní',
  paid: 'vyplatené',
  rejected: 'zamietnuté',
};

async function authedFetch(path: string, init?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('no-session');
  return fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...(init?.headers ?? {}),
    },
  });
}

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAffiliate, setNotAffiliate] = useState(false);

  const [codeInput, setCodeInput] = useState('');
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  const [iban, setIban] = useState('');
  const [payoutBusy, setPayoutBusy] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await authedFetch('/.netlify/functions/affiliate-dashboard');
      if (res.status === 403) { setNotAffiliate(true); return; }
      if (!res.ok) throw new Error('load-failed');
      const body = await res.json();
      if (body.status !== 'active') { navigate('/odporuc', { replace: true }); return; }
      setData(body);
    } catch {
      setNotAffiliate(true);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const claimCode = async () => {
    if (codeBusy) return;
    setCodeBusy(true);
    setCodeError(null);
    try {
      const res = await authedFetch('/.netlify/functions/affiliate-claim-code', {
        method: 'POST',
        body: JSON.stringify({ code: codeInput.trim() }),
      });
      const body = await res.json();
      if (!res.ok) setCodeError(body.error ?? 'Uloženie zlyhalo.');
      else await load();
    } catch {
      setCodeError('Uloženie zlyhalo. Skús to znova.');
    } finally {
      setCodeBusy(false);
    }
  };

  const requestPayout = async () => {
    if (payoutBusy) return;
    setPayoutBusy(true);
    setPayoutMsg(null);
    try {
      const res = await authedFetch('/.netlify/functions/affiliate-request-payout', {
        method: 'POST',
        body: JSON.stringify({ paymentDetail: iban.trim() }),
      });
      const body = await res.json();
      if (!res.ok) setPayoutMsg({ ok: false, text: body.error ?? 'Žiadosť zlyhala.' });
      else {
        setPayoutMsg({ ok: true, text: `Žiadosť o ${eur(body.amount_cents)} odoslaná — ozveme sa po spracovaní.` });
        setIban('');
        await load();
      }
    } catch {
      setPayoutMsg({ ok: false, text: 'Žiadosť zlyhala. Skús to znova.' });
    } finally {
      setPayoutBusy(false);
    }
  };

  const shareLink = data?.code ? `https://app.neome.com.au/auth?mode=register&ref=${data.code}` : null;

  const copyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 18,
    border: `1px solid ${NM.HAIR}`,
    padding: '18px 16px',
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: 12,
    border: `1px solid ${NM.HAIR}`,
    fontFamily: NM.SANS,
    fontSize: 15,
    color: NM.DEEP,
    background: NM.BG,
    outline: 'none',
  };
  const primaryBtn = (disabled: boolean): React.CSSProperties => ({
    all: 'unset',
    cursor: disabled ? 'default' : 'pointer',
    padding: '11px 18px',
    borderRadius: 999,
    background: disabled ? NM.HAIR : NM.DEEP,
    color: disabled ? NM.TERTIARY : '#fff',
    fontFamily: NM.SANS,
    fontSize: 13.5,
    fontWeight: 500,
    textAlign: 'center',
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (notAffiliate || !data) {
    return (
      <div style={{ minHeight: '100vh', background: NM.BG, padding: '0 18px', fontFamily: NM.SANS }}>
        <div style={{ padding: 'calc(env(safe-area-inset-top) + 18px) 0 14px' }}>
          <button onClick={() => navigate('/profil')} style={{ all: 'unset', cursor: 'pointer', fontSize: 14, color: NM.DEEP, padding: 6 }}>← Späť</button>
        </div>
        <div style={card}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 20, color: NM.DEEP, marginBottom: 8 }}>Partnerský program</div>
          <div style={{ fontSize: 14, color: NM.MUTED, lineHeight: 1.55 }}>
            Tvoj účet zatiaľ nie je zaradený do partnerského programu. Ak chceš spolupracovať, napíš nám.
          </div>
        </div>
      </div>
    );
  }

  const t = data.totals;

  return (
    <div style={{ minHeight: '100vh', background: NM.BG, padding: '0 18px 60px', fontFamily: NM.SANS }}>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 18px) 0 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/profil')} style={{ all: 'unset', cursor: 'pointer', fontSize: 14, color: NM.DEEP, padding: 6 }}>← Späť</button>
      </div>

      <h1 style={{ fontFamily: NM.SERIF, fontSize: 26, fontWeight: 500, color: NM.DEEP, margin: '6px 0 2px' }}>Partnerský program</h1>
      <div style={{ fontSize: 13.5, color: NM.MUTED, marginBottom: 18 }}>
        Provízia {data.commission_pct}&nbsp;% z každej platby odporúčanej používateľky.
      </div>

      {!data.code ? (
        <div style={{ ...card, marginBottom: 14 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, marginBottom: 6 }}>Vyber si svoj kód</div>
          <div style={{ fontSize: 13.5, color: NM.MUTED, lineHeight: 1.5, marginBottom: 12 }}>
            3–20 znakov, písmená a číslice. Bude súčasťou tvojho odkazu, tak nech sa dobre pamätá.
          </div>
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="napr. GABI10"
            style={inputStyle}
          />
          {codeError && <div style={{ marginTop: 8, fontSize: 13, color: '#B4584A' }}>{codeError}</div>}
          <div style={{ marginTop: 12 }}>
            <button onClick={claimCode} disabled={codeBusy || codeInput.trim().length < 3} style={primaryBtn(codeBusy || codeInput.trim().length < 3)}>
              {codeBusy ? 'Ukladám…' : 'Uložiť kód'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ ...card, marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: NM.TERTIARY, marginBottom: 6 }}>Tvoj kód</div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 24, color: NM.DEEP, letterSpacing: '0.04em', marginBottom: 12 }}>{data.code}</div>
          <div style={{ fontSize: 12.5, color: NM.MUTED, wordBreak: 'break-all', background: NM.BG, borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
            {shareLink}
          </div>
          <button onClick={copyLink} style={primaryBtn(false)}>
            {copied ? 'Skopírované ✓' : 'Kopírovať odkaz'}
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'K vyplateniu', value: t.available, hint: null },
          { label: 'Čaká 30 dní', value: t.pending, hint: null },
          { label: 'V spracovaní', value: t.requested, hint: null },
          { label: 'Vyplatené spolu', value: t.paid, hint: null },
        ].map((b) => (
          <div key={b.label} style={{ ...card, padding: '14px 14px' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: NM.TERTIARY, marginBottom: 4 }}>{b.label}</div>
            <div style={{ fontFamily: NM.SERIF, fontSize: 21, color: NM.DEEP, fontVariantNumeric: 'tabular-nums' }}>{eur(b.value)}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 14 }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, marginBottom: 6 }}>Vyplatenie</div>
        <div style={{ fontSize: 13, color: NM.MUTED, lineHeight: 1.55, marginBottom: 12 }}>
          Každá provízia sa uvoľní 30 dní po platbe (ochranná lehota na vrátenia). Minimálna suma na vyplatenie je 10&nbsp;€.
        </div>
        <input
          value={iban}
          onChange={(e) => setIban(e.target.value)}
          placeholder="IBAN na vyplatenie"
          style={inputStyle}
        />
        {payoutMsg && (
          <div style={{ marginTop: 8, fontSize: 13, color: payoutMsg.ok ? '#5E7D5C' : '#B4584A' }}>{payoutMsg.text}</div>
        )}
        <div style={{ marginTop: 12 }}>
          <button
            onClick={requestPayout}
            disabled={payoutBusy || t.available < 1000 || iban.trim().length < 8}
            style={primaryBtn(payoutBusy || t.available < 1000 || iban.trim().length < 8)}
          >
            {payoutBusy ? 'Odosielam…' : `Požiadať o vyplatenie ${eur(t.available)}`}
          </button>
        </div>
      </div>

      {data.payouts.length > 0 && (
        <div style={{ ...card, marginBottom: 14 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, marginBottom: 10 }}>História vyplatení</div>
          {data.payouts.map((pm) => (
            <div key={pm.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${NM.HAIR}`, fontSize: 13.5, color: NM.MUTED }}>
              <span>{fmtDate(pm.requested_at)} · {PAYOUT_STATUS_SK[pm.status] ?? pm.status}</span>
              <span style={{ color: NM.DEEP, fontVariantNumeric: 'tabular-nums' }}>{eur(pm.amount_cents)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={card}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, marginBottom: 10 }}>
          Odporúčané používateľky ({data.referrals.length})
        </div>
        {data.referrals.length === 0 ? (
          <div style={{ fontSize: 13.5, color: NM.MUTED, lineHeight: 1.5 }}>
            Zatiaľ nikto — zdieľaj svoj odkaz a každá registrácia sa objaví tu.
          </div>
        ) : (
          data.referrals.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i > 0 ? `1px solid ${NM.HAIR}` : 'none', fontSize: 13.5, color: NM.MUTED }}>
              <span>{r.label} · od {fmtDate(r.joined)}</span>
              <span style={{ color: NM.DEEP, fontVariantNumeric: 'tabular-nums' }}>{eur(r.earned_cents)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
