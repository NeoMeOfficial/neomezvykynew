import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { CONSENT_POLICY_VERSION, CONSENT_TYPES, ConsentType } from '../../lib/consents';

// Bridge for capturing consent intent BEFORE the user has an authed
// session (signup-with-email-confirm and OAuth redirects both leave a
// window where auth.uid() is null). SupabaseAuthProvider drains this
// on the first authed session and writes the consent_events rows.
const PENDING_CONSENTS_KEY = 'pending_consents_v1';
function stashPendingConsents(decisions: Partial<Record<ConsentType, boolean>>) {
  try {
    localStorage.setItem(
      PENDING_CONSENTS_KEY,
      JSON.stringify({
        decisions,
        policy_version: CONSENT_POLICY_VERSION,
        source: 'signup',
        stashed_at: new Date().toISOString(),
      })
    );
  } catch {
    // localStorage may be unavailable (private mode) — non-fatal; consent
    // can still be captured in Settings post-signup.
  }
}

// Where to send the user after a successful login or signup. The
// onboarding-plan screen writes this before sending the user here, so
// that picking Plus → checkout, Free → /domov-new survives the
// email-confirmation round-trip.
const POST_SIGNUP_ROUTE_KEY = 'post_signup_route';
function consumePostAuthRoute(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(POST_SIGNUP_ROUTE_KEY);
  if (stored) localStorage.removeItem(POST_SIGNUP_ROUTE_KEY);
  return stored || fallback;
}

/**
 * Auth screen — Round 19 redesign (claude.ai/design).
 *
 * Full-bleed editorial photo with white gradient fade. Brand monogram
 * + serif "Vitaj späť · domov." headline with GOLD italic em. Three
 * stacked buttons (Google · Pokračovať e-mailom). Tapping the
 * email option swaps to email + password fields with a back link.
 *
 * Registration kept on the same component as a third mode — the new
 * design only covers login, so register reuses the same chrome but
 * adds name + confirm-password + GDPR-consent fields and uses signUp.
 *
 * Mounted at /auth and /auth-real.
 */

// ─── Design tokens (mirrors round19-login.jsx) ─────────────────────
const T = {
  BG: '#F8F5F0',
  CARD: '#FFFFFF',
  INK: '#3D2921',
  INK_2: '#2A1A14',
  FG_2: 'rgba(61,41,33,0.72)',
  FG_3: 'rgba(61,41,33,0.56)',
  FG_MUTED: 'rgba(61,41,33,0.40)',
  HAIR: 'rgba(61,41,33,0.08)',
  HAIR_2: 'rgba(61,41,33,0.14)',
  GOLD: '#B8965A',
  TERRA: '#C1856A',
  SERIF: "'Gilda Display', Georgia, serif",
  SANS: "'DM Sans', system-ui, -apple-system, sans-serif",
} as const;

type Mode = 'choose' | 'email' | 'register';

export default function AuthReal() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const { signUp, signIn, resetPassword } = useSupabaseAuth();

  // Login-only on /register and /login — used as the internal sign-in
  // surface after the onboarding flow has captured the plan choice.
  const loginOnly = pathname === '/register' || pathname === '/login';
  // Allow onboarding to deep-link into the register form via
  // /auth?mode=register.
  const initialMode: Mode = !loginOnly && params.get('mode') === 'register' ? 'register' : 'choose';
  const [mode, setMode] = useState<Mode>(initialMode);
  useEffect(() => {
    // If the URL changes (e.g. user clicks an internal link), keep mode
    // in sync with the new query/path.
    setMode(loginOnly ? 'choose' : (params.get('mode') === 'register' ? 'register' : 'choose'));
  }, [params, loginOnly]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '',
    confirmPassword: '',
    // Required — Article 13/14 transparency acknowledgment.
    // Marketing / community consents are NOT collected at signup —
    // they're prompted contextually when the user first triggers the
    // relevant action (Art. 7(4) — consent must be freely given and
    // granular per Recital 32).
    tosPrivacyConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) setErrors({ submit: error.message });
      else navigate(consumePostAuthRoute('/domov-new'));
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Nastala chyba' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Heslá sa nezhodujú' });
      return;
    }
    if (formData.password.length < 8) {
      setErrors({ password: 'Heslo musí mať aspoň 8 znakov' });
      return;
    }
    if (!formData.firstName || !formData.lastName) {
      setErrors({ name: 'Vyplňte meno a priezvisko' });
      return;
    }
    if (!formData.tosPrivacyConsent) {
      setErrors({ gdpr: 'Súhlas s Podmienkami a Zásadami ochrany je povinný' });
      return;
    }
    // Stash chosen consents — drained on first authed session.
    stashPendingConsents({
      [CONSENT_TYPES.TOS_PRIVACY]: true,
    });
    setSubmitting(true);
    try {
      // If another user is already signed in on this device, sign them
      // out first. Otherwise — when email confirmation is enabled —
      // the new signUp succeeds but no session change occurs, so the
      // app keeps showing the previous user. By clearing the session
      // here, the email-confirm click later starts a clean session as
      // the new user.
      const { data: { session: existing } } = await supabase.auth.getSession();
      if (existing) {
        await supabase.auth.signOut();
      }
      const { error } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName, formData.tosPrivacyConsent);
      if (error) {
        setErrors({ submit: error.message });
      } else {
        // If Supabase auto-confirms (email confirmation disabled), the
        // signUp call also signs the user in — go straight to the
        // intended post-signup route. Otherwise show the check-email
        // banner; the consumePostAuthRoute call below survives the
        // round-trip via localStorage.
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate(consumePostAuthRoute('/domov-new'));
        } else {
          setErrors({ success: 'Registrácia úspešná! Skontroluj e-mail.' });
        }
      }
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Nastala chyba' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google') => {
    if (!isSupabaseConfigured()) {
      setErrors({ submit: 'Prihlásenie cez sociálne siete je v príprave.' });
      return;
    }
    // When a user clicks Google from the register form, treat it as
    // signup: require the TOS+Privacy checkbox and stash the consent
    // intent so it's recorded on the post-OAuth session callback.
    // From the choose/login screen we allow Google directly — if the
    // user turns out to be brand-new, the post-auth gate (see TODO in
    // SupabaseAuthProvider) will prompt for TOS consent before granting
    // app access.
    if (mode === 'register') {
      if (!formData.tosPrivacyConsent) {
        setErrors({ gdpr: 'Súhlas s Podmienkami a Zásadami ochrany je povinný' });
        return;
      }
      stashPendingConsents({
        [CONSENT_TYPES.TOS_PRIVACY]: true,
      });
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/domov-new` },
      });
      if (error) setErrors({ submit: error.message });
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Nastala chyba' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ submit: 'Zadaj e-mail pre reset hesla.' });
      return;
    }
    const { error } = await resetPassword(formData.email);
    if (error) setErrors({ submit: error.message });
    else setErrors({ success: 'E-mail na reset hesla bol odoslaný.' });
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: T.BG, overflow: 'hidden', fontFamily: T.SANS, color: T.INK }}>
      {/* Background photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/images/r9/login-hero.webp)',
        backgroundSize: 'cover',
        backgroundPosition: '65% top',
      }} />
      {/* White gradient — photo fades out around 58% from the top */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(248,245,240,0) 0%, rgba(248,245,240,0) 28%, rgba(248,245,240,0.6) 45%, rgba(248,245,240,0.95) 58%, rgba(248,245,240,1) 70%)',
      }} />

      <div style={{ position: 'relative', minHeight: '100vh', padding: 'calc(env(safe-area-inset-top) + 28px) 24px calc(env(safe-area-inset-bottom) + 32px)', display: 'flex', flexDirection: 'column' }}>
        {/* Brand mark */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 999,
            background: T.INK, color: '#fff',
            display: 'grid', placeItems: 'center',
            fontFamily: T.SERIF, fontSize: 14,
          }}>N</div>
          <div style={{
            fontFamily: T.SANS, fontSize: 11.5, letterSpacing: '0.32em',
            textTransform: 'uppercase', color: T.INK, fontWeight: 500,
          }}>NeoMe</div>
        </div>

        {/* Spacer so headline sits below the photo's focal point */}
        <div style={{ height: 'min(380px, 42vh)' }} />

        {/* Headline */}
        <div style={{ fontFamily: T.SERIF, fontSize: 40, lineHeight: 1.04, letterSpacing: '-0.015em', color: T.INK }}>
          {mode === 'register' ? (
            <>Začni svoju<br /><em style={{ color: T.GOLD, fontWeight: 400 }}>cestu.</em></>
          ) : (
            <>Vitaj späť<br /><em style={{ color: T.GOLD, fontWeight: 400 }}>domov.</em></>
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: T.FG_2, fontWeight: 300, maxWidth: 280, lineHeight: 1.55 }}>
          {mode === 'register'
            ? 'Vytvor si bezplatný účet a začni dnes.'
            : 'Pokračuj v ceste, kde si naposledy skončila.'}
        </div>

        {/* === mode: choose === */}
        {mode === 'choose' && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 9 }}>
            <button onClick={() => handleOAuth('google')} disabled={submitting} style={socialBtnLight()}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path d="M22 12.2c0-.8-.1-1.4-.2-2H12v3.8h5.6c-.2 1.4-1 2.6-2.2 3.4l3.5 2.7c2-1.9 3.1-4.6 3.1-7.9z" fill="#4285F4"/>
                <path d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.5-2.7c-1 .7-2.2 1.1-3.4 1.1-2.6 0-4.9-1.8-5.7-4.2L2.7 16.4C4.4 19.7 8 22 12 22z" fill="#34A853"/>
                <path d="M6.3 13.7c-.2-.7-.4-1.4-.4-2.2 0-.8.1-1.5.4-2.2L2.7 6.6C2.2 7.5 2 8.7 2 10s.2 2.5.7 3.4l3.6-2.7z" fill="#FBBC05"/>
                <path d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.8 2.8 14.5 2 12 2 8 2 4.4 4.3 2.7 7.6l3.6 2.7C7.1 7.9 9.4 5.8 12 5.8z" fill="#EA4335"/>
              </svg>
              <span>Pokračovať cez Google</span>
            </button>
            <button onClick={() => setMode('email')} style={socialBtnOutline()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7l9 6 9-6"/>
              </svg>
              <span>Pokračovať e-mailom</span>
            </button>
          </div>
        )}

        {/* === mode: email login === */}
        {mode === 'email' && (
          <form onSubmit={handleEmailLogin}>
            <button type="button" onClick={() => { setMode('choose'); setErrors({}); }} style={backLink()}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.FG_3} strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
              Iné možnosti
            </button>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(v) => set('email', v)}
                placeholder="tvoj@email.sk"
                autoComplete="email"
              />
              <Field
                label="Heslo"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(v) => set('password', v)}
                placeholder="Tvoje heslo"
                autoComplete="current-password"
                trailingButton={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Zobraziť heslo" style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', color: T.FG_3 }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.FG_3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.FG_3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                }
              />
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button type="button" onClick={handleForgotPassword} style={textLink()}>Zabudnuté heslo?</button>
            </div>
            {errors.submit && <Banner tone="error">{errors.submit}</Banner>}
            {errors.success && <Banner tone="info">{errors.success}</Banner>}
            <button type="submit" disabled={submitting} style={primaryPill(submitting)}>
              {submitting ? 'Prihlasujem…' : 'Prihlásiť sa'}
            </button>
          </form>
        )}

        {/* === mode: register === */}
        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <button type="button" onClick={() => { setMode('choose'); setErrors({}); }} style={backLink()}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.FG_3} strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
              Späť
            </button>

            {/* Google OAuth shortcut — same handler as login; OAuth
                creates the account on first click. Placed above the
                email form so the option is impossible to miss. */}
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={submitting}
                style={socialBtnLight()}
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path d="M22 12.2c0-.8-.1-1.4-.2-2H12v3.8h5.6c-.2 1.4-1 2.6-2.2 3.4l3.5 2.7c2-1.9 3.1-4.6 3.1-7.9z" fill="#4285F4"/>
                  <path d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.5-2.7c-1 .7-2.2 1.1-3.4 1.1-2.6 0-4.9-1.8-5.7-4.2L2.7 16.4C4.4 19.7 8 22 12 22z" fill="#34A853"/>
                  <path d="M6.3 13.7c-.2-.7-.4-1.4-.4-2.2 0-.8.1-1.5.4-2.2L2.7 6.6C2.2 7.5 2 8.7 2 10s.2 2.5.7 3.4l3.6-2.7z" fill="#FBBC05"/>
                  <path d="M12 5.8c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.8 2.8 14.5 2 12 2 8 2 4.4 4.3 2.7 7.6l3.6 2.7C7.1 7.9 9.4 5.8 12 5.8z" fill="#EA4335"/>
                </svg>
                <span>Zaregistrovať sa cez Google</span>
              </button>
            </div>

            <div style={{ marginTop: 16, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: T.HAIR }} />
              <div style={{ fontFamily: T.SANS, fontSize: 11, color: T.FG_3, fontWeight: 400 }}>alebo e-mailom</div>
              <div style={{ flex: 1, height: 1, background: T.HAIR }} />
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <Field
                  label="Meno"
                  value={formData.firstName}
                  onChange={(v) => set('firstName', v)}
                  placeholder="Meno"
                  autoComplete="given-name"
                />
                <Field
                  label="Priezvisko"
                  value={formData.lastName}
                  onChange={(v) => set('lastName', v)}
                  placeholder="Priezvisko"
                  autoComplete="family-name"
                />
              </div>
              {errors.name && <FieldError>{errors.name}</FieldError>}
              <Field
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(v) => set('email', v)}
                placeholder="tvoj@email.sk"
                autoComplete="email"
              />
              <Field
                label="Heslo"
                type="password"
                value={formData.password}
                onChange={(v) => set('password', v)}
                placeholder="Min. 8 znakov"
                autoComplete="new-password"
              />
              {errors.password && <FieldError>{errors.password}</FieldError>}
              <Field
                label="Potvrď heslo"
                type="password"
                value={formData.confirmPassword}
                onChange={(v) => set('confirmPassword', v)}
                placeholder="Zopakuj heslo"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
              {/* Required: TOS + Privacy Policy acknowledgment. Splitting
                  health-data consent into a separate prompt on first
                  cycle-screen visit keeps consent "freely given" per
                  Art. 7(4) GDPR (not bundled with sign-up). */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 4, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.tosPrivacyConsent}
                  onChange={(e) => { setFormData((p) => ({ ...p, tosPrivacyConsent: e.target.checked })); if (errors.gdpr) setErrors((p) => ({ ...p, gdpr: '' })); }}
                  style={{ marginTop: 3, width: 16, height: 16, accentColor: T.INK, flexShrink: 0 }}
                />
                <span style={{ fontSize: 11.5, color: T.FG_2, lineHeight: 1.5, fontWeight: 300 }}>
                  Prečítala som si a súhlasím s{' '}
                  <a href="/privacy" target="_blank" rel="noreferrer" style={{ color: T.INK, textDecoration: 'underline', textUnderlineOffset: 2 }}>
                    Zásadami ochrany osobných údajov
                  </a>
                  {' '}a Podmienkami používania. <span style={{ color: T.TERRA }}>*</span>
                </span>
              </label>
              {errors.gdpr && <FieldError>{errors.gdpr}</FieldError>}
            </div>
            {errors.submit && <Banner tone="error">{errors.submit}</Banner>}
            {errors.success && <Banner tone="info">{errors.success}</Banner>}
            <button type="submit" disabled={submitting} style={primaryPill(submitting)}>
              {submitting ? 'Spracovávam…' : 'Vytvoriť účet'}
            </button>
          </form>
        )}

        {/* Bottom row: switch login ↔ register. On /register and /login
            we suppress the switch — those routes are login-only and the
            "create account" path goes through the onboarding flow. */}
        {!loginOnly && (
          <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: T.FG_2, fontWeight: 300 }}>
            {mode === 'register' ? (
              <>Už máš účet?{' '}
                <button type="button" onClick={() => { setMode('choose'); setErrors({}); }} style={inlineLink()}>Prihlás sa</button>
              </>
            ) : (
              <>Nemáš účet?{' '}
                <button type="button" onClick={() => navigate('/onboarding/plan')} style={inlineLink()}>Vytvor si ho</button>
              </>
            )}
          </div>
        )}
        {loginOnly && (
          <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: T.FG_2, fontWeight: 300 }}>
            Nemáš účet?{' '}
            <button type="button" onClick={() => navigate('/onboarding/plan')} style={inlineLink()}>Začni cestu</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Atoms ────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text', autoComplete, trailingButton }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  trailingButton?: React.ReactNode;
}) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.FG_3, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative', borderBottom: `1px solid ${T.HAIR_2}`, paddingBottom: 10 }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          style={{
            width: '100%', border: 0, background: 'transparent',
            fontFamily: T.SANS, fontSize: 15, color: T.INK, fontWeight: 400,
            padding: 0, outline: 'none',
            paddingRight: trailingButton ? 28 : 0,
          }}
        />
        {trailingButton && (
          <div style={{ position: 'absolute', right: 0, top: 0 }}>{trailingButton}</div>
        )}
      </div>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: -8, fontSize: 11.5, color: T.TERRA, fontWeight: 400 }}>{children}</div>;
}

function Banner({ tone, children }: { tone: 'error' | 'info'; children: React.ReactNode }) {
  const isError = tone === 'error';
  return (
    <div role="alert" style={{
      marginTop: 14, padding: '10px 14px', borderRadius: 12,
      background: isError ? 'rgba(224,90,90,0.10)' : 'rgba(184,150,90,0.10)',
      border: `1px solid ${isError ? 'rgba(224,90,90,0.32)' : 'rgba(184,150,90,0.32)'}`,
      fontSize: 13, color: isError ? '#A03A3A' : T.INK,
    }}>{children}</div>
  );
}

function socialBtnLight(): React.CSSProperties {
  return {
    width: '100%', padding: '14px 18px', borderRadius: 999,
    background: T.CARD, color: T.INK, border: `1px solid ${T.HAIR_2}`, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontFamily: T.SANS, fontSize: 13.5, fontWeight: 500, letterSpacing: '0.01em',
  };
}
function socialBtnOutline(): React.CSSProperties {
  return {
    width: '100%', padding: '14px 18px', borderRadius: 999,
    background: 'transparent', color: T.INK, border: `1px solid ${T.HAIR_2}`, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontFamily: T.SANS, fontSize: 13.5, fontWeight: 500, letterSpacing: '0.01em',
  };
}
function primaryPill(submitting: boolean): React.CSSProperties {
  return {
    marginTop: 18, width: '100%', padding: '16px 22px', borderRadius: 999,
    background: T.INK, color: '#fff', border: 0,
    cursor: submitting ? 'not-allowed' : 'pointer',
    opacity: submitting ? 0.5 : 1,
    fontFamily: T.SANS, fontSize: 14, fontWeight: 500, letterSpacing: '0.04em',
  };
}
function backLink(): React.CSSProperties {
  return {
    marginTop: 22, background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: T.SANS, fontSize: 11.5, color: T.FG_3, fontWeight: 500, letterSpacing: '0.04em',
  };
}
function textLink(): React.CSSProperties {
  return {
    background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
    fontFamily: T.SANS, fontSize: 12, color: T.FG_2, fontWeight: 400,
    textDecoration: 'underline', textUnderlineOffset: 3,
  };
}
function inlineLink(): React.CSSProperties {
  return {
    background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
    fontFamily: T.SANS, fontSize: 13, color: T.INK, fontWeight: 500,
    textDecoration: 'underline', textUnderlineOffset: 3,
  };
}
