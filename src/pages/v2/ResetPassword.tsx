import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { NM } from '../../components/v2/neome';

/**
 * /reset-password — landing page for the Supabase password-recovery email.
 *
 * The reset email (SupabaseAuthContext.resetPassword) redirects here with
 * recovery tokens in the URL hash. The supabase client consumes the hash
 * automatically (detectSessionInUrl) and establishes a temporary session;
 * we then let the user set a new password via auth.updateUser.
 *
 * States: verifying the link → form → saved (redirect) / invalid link.
 */

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<'checking' | 'ok' | 'invalid'>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The recovery hash may still be processing when we mount — listen for
    // the session instead of checking once.
    let settled = false;
    const finish = (ok: boolean) => {
      if (!settled) {
        settled = true;
        setReady(ok ? 'ok' : 'invalid');
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) finish(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) finish(true);
    });

    // If no session materialises, the link is expired/used.
    const timeout = setTimeout(() => finish(false), 6000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Heslo musí mať aspoň ${MIN_PASSWORD_LENGTH} znakov.`);
      return;
    }
    if (password !== confirm) {
      setError('Heslá sa nezhodujú.');
      return;
    }
    setSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (err) {
      setError(err.message === 'New password should be different from the old password.'
        ? 'Nové heslo musí byť iné ako pôvodné.'
        : 'Heslo sa nepodarilo zmeniť. Skús to znova.');
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/domov-new', { replace: true }), 1600);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 16px',
    borderRadius: 14,
    border: `1px solid ${NM.HAIR_2}`,
    background: '#fff',
    fontFamily: NM.SANS,
    fontSize: 15,
    color: NM.DEEP,
    outline: 'none',
  };

  return (
    <div style={{ minHeight: '100dvh', background: NM.BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 28, color: NM.DEEP, letterSpacing: '-0.01em', marginBottom: 8, textAlign: 'center' }}>
          Nové heslo
        </div>

        {ready === 'checking' && (
          <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, textAlign: 'center', padding: '24px 0' }}>
            Overujem odkaz…
          </div>
        )}

        {ready === 'invalid' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.MUTED, lineHeight: 1.55, margin: '10px 0 22px' }}>
              Tento odkaz na obnovenie hesla už nie je platný. Odkazy platia
              obmedzený čas — vyžiadaj si nový.
            </div>
            <button
              onClick={() => navigate('/auth')}
              style={{ all: 'unset', cursor: 'pointer', background: NM.DEEP, color: '#fff', padding: '13px 26px', borderRadius: 999, fontFamily: NM.SANS, fontSize: 14, fontWeight: 600 }}
            >
              Späť na prihlásenie
            </button>
          </div>
        )}

        {ready === 'ok' && !done && (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nové heslo"
              autoComplete="new-password"
              autoFocus
              style={inputStyle}
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Zopakuj nové heslo"
              autoComplete="new-password"
              style={inputStyle}
            />
            {error && (
              <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: '#B4533E', lineHeight: 1.45 }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              style={{
                all: 'unset', cursor: saving ? 'wait' : 'pointer', textAlign: 'center',
                background: NM.DEEP, color: '#fff', padding: '14px 0', borderRadius: 999,
                fontFamily: NM.SANS, fontSize: 14.5, fontWeight: 600, opacity: saving ? 0.6 : 1,
                marginTop: 4,
              }}
            >
              {saving ? 'Ukladám…' : 'Uložiť nové heslo'}
            </button>
          </form>
        )}

        {done && (
          <div style={{ fontFamily: NM.SANS, fontSize: 14, color: NM.SAGE, textAlign: 'center', padding: '24px 0', fontWeight: 500 }}>
            Heslo zmenené ✓ Presmerúvam…
          </div>
        )}
      </div>
    </div>
  );
}
