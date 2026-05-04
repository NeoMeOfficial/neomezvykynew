import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';

const INPUT =
  'w-full px-4 py-3.5 rounded-2xl bg-white border border-ink/[0.08] font-sans text-sm text-ink placeholder:text-ink/32 focus:outline-none focus:border-ink/24 transition-colors';
const LABEL =
  'font-sans text-[10px] font-medium text-ink/48 uppercase tracking-[0.14em] mb-1.5 block';

export default function AuthReal() {
  const navigate = useNavigate();
  const { signUp, signIn } = useSupabaseAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '',
    confirmPassword: '', gdprConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) setErrors({ submit: error.message });
        else navigate('/domov-new');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: 'Heslá sa nezhodujú' });
          return;
        }
        if (formData.password.length < 8) {
          setErrors({ password: 'Heslo musí mať aspoň 8 znakov' });
          return;
        }
        if (!formData.firstName || !formData.lastName) {
          setErrors({ name: 'Vyplňte prosím meno a priezvisko' });
          return;
        }
        if (!formData.gdprConsent) {
          setErrors({ gdpr: 'Súhlas so spracovaním údajov je povinný' });
          return;
        }
        const { error } = await signUp(
          formData.email, formData.password,
          formData.firstName, formData.lastName, true
        );
        if (error) setErrors({ submit: error.message });
        else setErrors({ success: 'Registrácia úspešná! Skontrolujte email.' });
      }
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : 'Nastala chyba' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = (field: string, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const switchMode = () => {
    setIsLogin(v => !v);
    setErrors({});
    setFormData({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '', gdprConsent: false });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 px-5 pt-14 pb-10">

        {/* Wordmark */}
        <div className="mb-10">
          <Eyebrow tone="muted">NEOME</Eyebrow>
        </div>

        {/* Headline */}
        <div className="mb-8">
          <SerifHeader as="h1" size="h1" className="mb-2">
            {isLogin ? 'Vitaj späť' : 'Začni svoju cestu'}
          </SerifHeader>
          <BodyText tone="secondary">
            {isLogin ? 'Prihláste sa do svojho účtu.' : 'Vytvorte si bezplatný účet.'}
          </BodyText>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {!isLogin && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={LABEL}>Meno</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  className={INPUT}
                  placeholder="Meno"
                  required={!isLogin}
                  autoComplete="given-name"
                />
              </div>
              <div className="flex-1">
                <label className={LABEL}>Priezvisko</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  className={INPUT}
                  placeholder="Priezvisko"
                  required={!isLogin}
                  autoComplete="family-name"
                />
              </div>
            </div>
          )}
          {errors.name && <BodyText size="sm" className="text-terra -mt-2">{errors.name}</BodyText>}

          <div>
            <label className={LABEL}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => set('email', e.target.value)}
              className={INPUT}
              placeholder="tvoj@email.sk"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className={LABEL}>Heslo</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => set('password', e.target.value)}
                className={`${INPUT} pr-12`}
                placeholder={isLogin ? 'Tvoje heslo' : 'Minimálne 8 znakov'}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-ink/36"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <BodyText size="sm" className="mt-1 text-terra">{errors.password}</BodyText>}
          </div>

          {!isLogin && (
            <div>
              <label className={LABEL}>Potvrdiť heslo</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                className={INPUT}
                placeholder="Zopakuj heslo"
                required={!isLogin}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <BodyText size="sm" className="mt-1 text-terra">{errors.confirmPassword}</BodyText>
              )}
            </div>
          )}

          {!isLogin && (
            <div className="flex items-start gap-3 pt-1">
              <input
                id="gdpr-consent"
                type="checkbox"
                checked={formData.gdprConsent}
                onChange={e => {
                  setFormData(p => ({ ...p, gdprConsent: e.target.checked }));
                  if (errors.gdpr) setErrors(p => ({ ...p, gdpr: '' }));
                }}
                className="mt-0.5 h-4 w-4 rounded border-ink/20 accent-ink flex-shrink-0 cursor-pointer"
              />
              <label htmlFor="gdpr-consent" className="font-sans text-xs text-ink/52 leading-relaxed cursor-pointer">
                Súhlasím so{' '}
                <a href="https://neome.sk/privacy" target="_blank" rel="noreferrer" className="text-ink underline underline-offset-2">
                  spracovaním osobných údajov
                </a>
                {' '}vrátane zdravotných dát (cyklus, symptómy) v súlade s GDPR.{' '}
                <a href="https://neome.sk/privacy" target="_blank" rel="noreferrer" className="text-ink underline underline-offset-2">
                  Zásady ochrany súkromia
                </a>
              </label>
            </div>
          )}
          {errors.gdpr && <BodyText size="sm" className="-mt-2 text-terra">{errors.gdpr}</BodyText>}

          {errors.submit && (
            <div className="px-4 py-3 rounded-2xl bg-white border border-terra/20">
              <BodyText size="sm" className="text-terra">{errors.submit}</BodyText>
            </div>
          )}
          {errors.success && (
            <div className="px-4 py-3 rounded-2xl bg-white border border-ink/[0.08]">
              <BodyText size="sm" tone="secondary">{errors.success}</BodyText>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-2 rounded-full bg-ink text-cream font-sans font-semibold text-[15px] tracking-[-0.01em] transition-all active:scale-[0.98] disabled:opacity-40"
          >
            {isSubmitting ? 'Spracováva sa…' : (isLogin ? 'Prihlásiť sa' : 'Registrovať sa')}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-center font-sans text-xs text-ink/40"
            >
              Zabudnuté heslo?
            </button>
          )}
        </form>

        {/* Switch mode */}
        <div className="mt-8 text-center">
          <BodyText size="sm" tone="muted">
            {isLogin ? 'Nemáš účet? ' : 'Máš účet? '}
            <button onClick={switchMode} className="text-ink font-medium">
              {isLogin ? 'Registruj sa' : 'Prihláš sa'}
            </button>
          </BodyText>
        </div>

        {/* Trust signals */}
        <div className="mt-10 pt-8 border-t border-ink/[0.06] flex justify-around">
          {[['2 400+', 'žien v komunite'], ['105', 'receptov'], ['17', 'meditácií']].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-serif text-2xl font-normal text-ink tracking-tight leading-none mb-1">{n}</div>
              <Eyebrow tone="muted">{l}</Eyebrow>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
