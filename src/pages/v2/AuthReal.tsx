import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { colors } from '../../theme/warmDusk';

export default function AuthReal() {
  const navigate = useNavigate();
  const { signUp, signIn, loading } = useSupabaseAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setErrors({ submit: error.message });
        } else {
          navigate('/domov-new');
        }
      } else {
        // Validation for registration
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: 'Heslá sa nezhodujú' });
          return;
        }

        if (formData.password.length < 6) {
          setErrors({ password: 'Heslo musí mať aspoň 6 znakov' });
          return;
        }

        if (!formData.firstName || !formData.lastName) {
          setErrors({ name: 'Vyplňte prosím meno a priezvisko' });
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );

        if (error) {
          setErrors({ submit: error.message });
        } else {
          setErrors({ success: 'Registrácia úspešná! Skontrolujte email pre potvrdenie.' });
        }
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Nastala chyba' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="min-h-screen" style={{ background: colors.bgGradient }}>
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-1">
              <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
            </button>
            <div className="flex-1">
              <h1 className="text-[18px] font-bold" style={{ color: colors.textPrimary }}>
                {isLogin ? 'Prihlásenie' : 'Registrácia'}
              </h1>
              <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                {isLogin ? 'Vitaj späť!' : 'Začni svoju wellness cestu'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                    Meno
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                    style={{ color: colors.textPrimary }}
                    placeholder="Tvoje meno"
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                    Priezvisko
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                    style={{ color: colors.textPrimary }}
                    placeholder="Priezvisko"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                style={{ color: colors.textPrimary }}
                placeholder="tvoj@email.sk"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                Heslo
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full p-3 pr-12 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                  style={{ color: colors.textPrimary }}
                  placeholder={isLogin ? "Tvoje heslo" : "Minimálne 6 znakov"}
                  required
                  minLength={!isLogin ? 6 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                  Potvrdiť heslo
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                  style={{ color: colors.textPrimary }}
                  placeholder="Zopakuj heslo"
                  required={!isLogin}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name}</p>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {errors.success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm">{errors.success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.telo }}
            >
              {isSubmitting ? 'Spracováva sa...' : (isLogin ? 'Prihlásiť sa' : 'Registrovať sa')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({
                  email: '',
                  password: '',
                  firstName: '',
                  lastName: '',
                  confirmPassword: ''
                });
              }}
              className="text-sm font-medium"
              style={{ color: colors.accent }}
            >
              {isLogin 
                ? 'Nemáš účet? Registruj sa' 
                : 'Máš už účet? Prihlás sa'
              }
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20">
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
            Čo ťa čaká v NeoMe
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.telo }}></div>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                15-minútové tréningy prispôsobené tvojmu cyklu
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.strava }}></div>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                Recepty s ingredienciami z Tesca
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.mysel }}></div>
              <span className="text-sm" style={{ color: colors.textSecondary }}>
                Komunita slovenských žien na podobnej ceste
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}