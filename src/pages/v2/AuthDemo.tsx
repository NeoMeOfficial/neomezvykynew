import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Star } from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function AuthDemo() {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        alert('Prosím vyplňte email a heslo');
        return;
      }

      setIsSubmitting(true);
      console.log('🎯 Starting demo login process...');

      // Create demo user data
      const demoUser = {
        id: 'demo_' + Date.now(),
        email: formData.email,
        firstName: formData.firstName || 'Demo',
        lastName: formData.lastName || 'User',
        createdAt: new Date().toISOString()
      };

      console.log('🎯 Setting localStorage...');
      
      // Store demo data
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      localStorage.setItem('demo_session', 'active');
      
      // Verify localStorage was set
      const storedSession = localStorage.getItem('demo_session');
      const storedUser = localStorage.getItem('demo_user');
      
      console.log('🎯 Verification:', {
        storedSession,
        storedUser: storedUser ? 'exists' : 'missing',
        demoUser
      });
      
      if (storedSession !== 'active') {
        throw new Error('Failed to set localStorage');
      }
      
      // Wait to ensure all is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🎯 Redirecting to /domov-new...');
      setIsSubmitting(false);
      
      // Force page reload to ensure fresh state
      window.location.href = '/domov-new';
      
    } catch (error) {
      console.error('❌ Error in demo auth:', error);
      setIsSubmitting(false);
      alert('Chyba pri prihlasovaní: ' + error.message);
    }
  };

  return (
    <ErrorBoundary>
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
                {isLogin ? 'Demo Prihlásenie' : 'Demo Registrácia'}
              </h1>
              <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                🎯 Testovací režim - žiadne skutočné údaje nie sú potrebné
              </p>
            </div>
            <Star className="w-6 h-6" style={{ color: colors.accent }} />
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-lg">🎯</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-1">
                Demo Režim
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Používajte akékoľvek email a heslo. Všetky funkcie sú dostupné pre testovanie.
                Žiadne skutočné údaje nie sú uložené.
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
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                    style={{ color: colors.textPrimary }}
                    placeholder="Tvoje meno"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                    Priezvisko
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                    style={{ color: colors.textPrimary }}
                    placeholder="Priezvisko"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                Email (demo)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                style={{ color: colors.textPrimary }}
                placeholder="test@neome.sk"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: colors.textPrimary }}>
                Heslo (demo)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 pr-12 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm focus:border-[#6B4C3B] focus:outline-none transition-colors"
                  style={{ color: colors.textPrimary }}
                  placeholder="akékoľvek heslo"
                  required
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
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.telo }}
            >
              {isSubmitting ? 'Spracováva sa...' : (isLogin ? 'Vstúpiť do Demo' : 'Vytvoriť Demo Účet')}
            </button>
            
            {/* Debug button */}
            <button
              type="button"
              onClick={() => {
                console.log('🔧 Debug access clicked');
                localStorage.setItem('demo_session', 'active');
                localStorage.setItem('demo_user', JSON.stringify({ id: 'debug', email: 'debug@test.com' }));
                console.log('🔧 localStorage set, redirecting...');
                window.location.href = '/domov-new';
              }}
              className="w-full mt-2 py-2 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
            >
              🔧 Debug: Priamy prístup k aplikácii
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium"
              style={{ color: colors.accent }}
            >
              {isLogin 
                ? 'Chcete vytvoriť demo účet?' 
                : 'Už máte demo účet?'
              }
            </button>
          </div>
        </div>

        {/* Inspiring message */}
        <div className="rounded-2xl p-6 shadow-sm border border-white/20" style={{ background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(20px)' }}>
          <p className="text-[10px] tracking-[0.35em] uppercase font-medium mb-4" style={{ color: colors.accent }}>
            Pre ženy, ktoré sa rozhodli
          </p>
          <h3 className="text-[22px] font-medium leading-snug mb-4" style={{ color: colors.textPrimary, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
            Tvoje telo.<br />Tvoj rytmus.<br />Tvoja cesta.
          </h3>
          <p className="text-[13px] leading-relaxed" style={{ color: '#6B4C3B' }}>
            NeoMe ťa sprevádza každým dňom — od rána až po večer. Pohyb prispôsobený tvojmu cyklu, výživa bez kompromisov, a komunita žien, ktoré chápu.
          </p>
          <div className="flex gap-4 mt-5 pt-4 border-t border-white/20">
            <div className="flex-1 text-center">
              <p className="text-[18px] font-semibold" style={{ color: colors.textPrimary }}>2 400+</p>
              <p className="text-[10px] mt-0.5" style={{ color: colors.textSecondary }}>žien v komunite</p>
            </div>
            <div className="w-px" style={{ background: 'rgba(184,134,74,0.2)' }} />
            <div className="flex-1 text-center">
              <p className="text-[18px] font-semibold" style={{ color: colors.textPrimary }}>105</p>
              <p className="text-[10px] mt-0.5" style={{ color: colors.textSecondary }}>receptov</p>
            </div>
            <div className="w-px" style={{ background: 'rgba(184,134,74,0.2)' }} />
            <div className="flex-1 text-center">
              <p className="text-[18px] font-semibold" style={{ color: colors.textPrimary }}>4</p>
              <p className="text-[10px] mt-0.5" style={{ color: colors.textSecondary }}>fázy cyklu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}