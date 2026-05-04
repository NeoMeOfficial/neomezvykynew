import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';

const INPUT_CLASS = 'w-full px-4 py-3 rounded-xl bg-cream-200 border border-ink/[0.10] font-sans text-sm text-ink placeholder:text-ink/36 focus:outline-none focus:border-ink/30 transition-colors';
const LABEL_CLASS = 'font-sans text-xs font-medium text-ink/56 uppercase tracking-[0.1em] mb-1.5 block';

export default function AuthReal() {
  const navigate = useNavigate();
  const { signUp, signIn } = useSupabaseAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '', gdprConsent: false });
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
        const { error } = await signUp(formData.email, formData.password, formData.firstName, formData.lastName, true);
        if (error) setErrors({ submit: error.message });
        else setErrors({ success: 'Registrácia úspešná! Skontrolujte email pre potvrdenie.' });
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
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '', gdprConsent: false });
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="px-5 pt-14 pb-12">
        {/* Back */}
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-1.5 text-ink/48 font-sans text-sm">
          <ArrowLeft className="size-4" />
          Späť
        </button>

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
                <label className={LABEL_CLASS}>Meno</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Meno"
                  required={!isLogin}
                />
              </div>
              <div className="flex-1">
                <label className={LABEL_CLASS}>Priezvisko</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Priezvisko"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {errors.name && <p className="text-[13px] text-red-500">{errors.name}</p>}

          <div>
            <label className={LABEL_CLASS}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => set('email', e.target.value)}
              className={INPUT_CLASS}
              placeholder="tvoj@email.sk"
              required
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Heslo</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => set('password', e.target.value)}
                className={`${INPUT_CLASS} pr-12`}
                placeholder={isLogin ? 'Tvoje heslo' : 'Minimálne 6 znakov'}
                required
                minLength={!isLogin ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink/40"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-[13px] text-red-500">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <label className={LABEL_CLASS}>Potvrdiť heslo</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Zopakuj heslo"
                required={!isLogin}
              />
              {errors.confirmPassword && <p className="mt-1 text-[13px] text-red-500">{errors.confirmPassword}</p>}
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
              <label htmlFor="gdpr-consent" className="font-sans text-xs text-ink/60 leading-relaxed cursor-pointer">
                Súhlasím so{' '}
                <a href="https://neome.sk/privacy" target="_blank" rel="noreferrer" className="text-ink underline">spracovaním osobných údajov</a>
                {' '}vrátane zdravotných dát (cyklus, symptómy) v súlade s GDPR.{' '}
                <a href="https://neome.sk/privacy" target="_blank" rel="noreferrer" className="text-ink underline">Zásady ochrany súkromia</a>
              </label>
            </div>
          )}
          {errors.gdpr && <p className="text-[13px] text-red-500 -mt-2">{errors.gdpr}</p>}

          {errors.submit && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
              <p className="font-sans text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
          {errors.success && (
            <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200">
              <p className="font-sans text-sm text-green-700">{errors.success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-2 rounded-full bg-ink text-cream font-sans font-semibold text-base transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Spracováva sa…' : (isLogin ? 'Prihlásiť sa' : 'Registrovať sa')}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <button onClick={switchMode} className="font-sans text-sm text-ink/56">
            {isLogin ? 'Nemáš účet? ' : 'Máš účet? '}
            <span className="text-ink font-medium">{isLogin ? 'Registruj sa' : 'Prihláš sa'}</span>
          </button>
        </div>

        {/* Trust signals */}
        <div className="mt-10 pt-8 border-t border-ink/[0.06]">
          <div className="flex justify-around">
            {[['2 400+', 'žien v komunite'], ['105', 'receptov'], ['17', 'meditácií']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-serif text-h2 text-ink">{n}</div>
                <BodyText size="sm" tone="muted">{l}</BodyText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
