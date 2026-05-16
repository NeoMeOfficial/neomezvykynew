import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { NM } from '../../components/v2/neome';

/**
 * Minimal admin sign-in.
 *
 * Mounted at /admin/login. Used as the redirect target when RequireAdmin
 * finds no session. Intentionally bare — no hero photo, no brand
 * narrative — because this is an internal page for ops, not a
 * marketing surface. Visual style matches the rest of the app (cream
 * BG, serif headline, INK CTA) so it doesn't feel disconnected.
 *
 * On success: navigates to ?next= if set, otherwise /admin. The
 * RequireAdmin guard on /admin will catch non-admin accounts and
 * bounce them to /domov-new.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn, user } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Already signed in? Skip the form, go to /admin (or the requested target).
  if (user) {
    navigate(params.get('next') ?? '/admin', { replace: true });
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!email || !password) {
      setErr('Vyplň e-mail aj heslo.');
      return;
    }
    setBusy(true);
    setErr(null);
    const { error } = await signIn(email, password);
    if (error) {
      setErr(error.message || 'Prihlásenie zlyhalo.');
      setBusy(false);
      return;
    }
    navigate(params.get('next') ?? '/admin', { replace: true });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: NM.BG,
        fontFamily: NM.SANS,
        color: NM.DEEP,
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Wordmark — quiet brand anchor */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 28,
            fontFamily: NM.SANS,
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: NM.MUTED,
            fontWeight: 500,
          }}
        >
          NeoMe · Admin
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          style={{
            background: '#FFFFFF',
            borderRadius: 18,
            border: `1px solid ${NM.HAIR}`,
            padding: '28px 24px',
            boxShadow: '0 14px 40px rgba(61,41,33,0.06)',
          }}
        >
          <div
            style={{
              fontFamily: NM.SERIF,
              fontSize: 24,
              color: NM.DEEP,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              marginBottom: 6,
            }}
          >
            Prihlásenie do admin
          </div>
          <div
            style={{
              fontFamily: NM.SANS,
              fontSize: 12.5,
              color: NM.MUTED,
              fontWeight: 300,
              lineHeight: 1.55,
              marginBottom: 20,
            }}
          >
            Interný panel pre tím NeoMe.
          </div>

          <Field
            label="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            placeholder="ty@neome.com.au"
          />
          <div style={{ height: 14 }} />
          <Field
            label="Heslo"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          {err && (
            <div
              role="alert"
              style={{
                marginTop: 14,
                padding: '10px 12px',
                background: 'rgba(193,133,106,0.10)',
                border: '1px solid rgba(193,133,106,0.30)',
                borderRadius: 10,
                fontFamily: NM.SANS,
                fontSize: 12,
                color: '#A03A3A',
                lineHeight: 1.5,
              }}
            >
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              marginTop: 22,
              padding: '14px',
              borderRadius: 999,
              background: busy ? NM.HAIR_2 : NM.DEEP,
              color: busy ? NM.TERTIARY : '#fff',
              border: 0,
              cursor: busy ? 'not-allowed' : 'pointer',
              fontFamily: NM.SANS,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {busy ? 'Prihlasujem…' : 'Prihlásiť sa'}
          </button>
        </form>

        <div
          style={{
            marginTop: 18,
            textAlign: 'center',
            fontFamily: NM.SANS,
            fontSize: 11,
            color: NM.TERTIARY,
            fontWeight: 400,
          }}
        >
          Prístup len pre administrátorov.
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label style={{ display: 'block' }}>
      <span
        style={{
          display: 'block',
          fontFamily: NM.SANS,
          fontSize: 10.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: NM.EYEBROW,
          fontWeight: 500,
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px 14px',
          background: '#fff',
          border: `1px solid ${NM.HAIR_2}`,
          borderRadius: 12,
          fontFamily: NM.SANS,
          fontSize: 14,
          color: NM.DEEP,
          outline: 'none',
        }}
      />
    </label>
  );
}
