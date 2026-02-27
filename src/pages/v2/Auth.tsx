import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

type Mode = 'login' | 'register' | 'reset';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuthContext();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/domov');
      } else if (mode === 'register') {
        if (!firstName.trim()) { setError('Zadaj svoje krstné meno'); setLoading(false); return; }
        if (!lastName.trim()) { setError('Zadaj svoje priezvisko'); setLoading(false); return; }
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setSuccess('Registrácia úspešná! Skontroluj email pre overenie.');
      } else {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccess('Email na obnovenie hesla bol odoslaný.');
      }
    } catch (err: any) {
      setError(err.message || 'Niečo sa pokazilo');
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<Mode, string> = {
    login: 'Vitaj späť',
    register: 'Vytvor si účet',
    reset: 'Obnovenie hesla',
  };

  const subtitles: Record<Mode, string> = {
    login: 'Prihlás sa a pokračuj vo svojej ceste',
    register: 'Začni svoju cestu k lepšiemu ja',
    reset: 'Pošleme ti odkaz na obnovenie',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-3 py-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Logo & Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white bg-[#B8864A]">
            N
          </div>
          <h1 className="text-xl font-semibold mb-2" style={{ color: '#2E2218' }}>{titles[mode]}</h1>
          <p className="text-sm" style={{ color: '#6B4C3B' }}>{subtitles[mode]}</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields (register only) */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-[12px] font-medium mb-1.5 block" style={{ color: colors.textSecondary }}>Krstné meno</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textTertiary }} />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Katka"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl text-[14px] outline-none"
                      style={{ ...innerGlass, color: colors.textPrimary }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-medium mb-1.5 block" style={{ color: colors.textSecondary }}>Priezvisko</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textTertiary }} />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nováková"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl text-[14px] outline-none"
                      style={{ ...innerGlass, color: colors.textPrimary }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="text-[12px] font-medium mb-1.5 block" style={{ color: colors.textSecondary }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textTertiary }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="katka@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-[14px] outline-none"
                  style={{ ...innerGlass, color: colors.textPrimary }}
                />
              </div>
            </div>

            {/* Password (not for reset) */}
            {mode !== 'reset' && (
              <div>
                <label className="text-[12px] font-medium mb-1.5 block" style={{ color: colors.textSecondary }}>Heslo</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textTertiary }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 rounded-2xl text-[14px] outline-none"
                    style={{ ...innerGlass, color: colors.textPrimary }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                    {showPassword
                      ? <EyeOff size={16} style={{ color: colors.textTertiary }} />
                      : <Eye size={16} style={{ color: colors.textTertiary }} />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot password link */}
            {mode === 'login' && (
              <button type="button" onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                className="text-[12px] font-medium" style={{ color: colors.accent }}>
                Zabudnuté heslo?
              </button>
            )}

            {/* Error / Success */}
            {error && (
              <div className="p-3 rounded-xl text-[13px] font-medium" style={{ background: `${colors.periodka}14`, color: colors.periodka }}>
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-xl text-[13px] font-medium" style={{ background: `${colors.strava}14`, color: colors.strava }}>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-[15px] font-semibold text-white transition-all active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${colors.telo}, #4A3428)`,
                boxShadow: `0 4px 14px ${colors.telo}40`,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '...' : mode === 'login' ? 'Prihlásiť sa' : mode === 'register' ? 'Registrovať' : 'Odoslať'}
            </button>
          </form>
        </div>

        {/* Toggle login/register */}
        <div className="text-center mt-6">
          {mode === 'login' ? (
            <p className="text-[13px]" style={{ color: colors.textSecondary }}>
              Nemáš účet?{' '}
              <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                className="font-semibold" style={{ color: colors.accent }}>
                Registruj sa
              </button>
            </p>
          ) : (
            <p className="text-[13px]" style={{ color: colors.textSecondary }}>
              Už máš účet?{' '}
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className="font-semibold" style={{ color: colors.accent }}>
                Prihlásiť sa
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
