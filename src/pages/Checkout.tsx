import React, { useState } from 'react';
import { ArrowLeft, Check, Shield, Heart, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Checkout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const features = [
    { icon: Lock, text: 'Tvoje údaje sú bezpečne uložené navždy' },
    { icon: TrendingUp, text: 'Sleduj trendy a predpovedaj svoj cyklus' },
    { icon: Sparkles, text: 'AI odporúčania šité na mieru tvojmu telu' },
    { icon: Heart, text: 'Zdieľaj kalendár s partnerom či lekárom' },
  ];

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
  };

  const handlePayment = () => {
    console.log('Payment processing...');
    alert('Platba bola úspešne spracovaná! (Mock)');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--shell))]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[hsl(var(--widget-border))] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#955F6A] hover:text-[#F4415F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Späť</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FEF5F7] text-[#F4415F] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Staň sa členkou Periodka Premium
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#955F6A' }}>
            Pochop svoje telo.<br />Ži v súlade s cyklom.
          </h1>
          <p className="text-base md:text-lg text-[hsl(var(--widget-text-soft))] max-w-2xl mx-auto">
            Pripoj sa k tisíckam žien, ktoré už ovládli svoj menštruačný cyklus a žijú lepší život.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Left Column - Value Props */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[hsl(var(--widget-border))]">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl md:text-5xl font-bold" style={{ color: '#F4415F' }}>4,90 €</span>
                <span className="text-lg text-[hsl(var(--widget-text-soft))]">/mesiac</span>
              </div>
              <p className="text-sm text-[hsl(var(--widget-text-soft))] mb-6">
                Žiadne skryté poplatky. Zruš kedykoľvek.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FEF5F7] flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[#F4415F]" />
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-sm font-medium text-[#955F6A]">{feature.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-br from-[#FEF5F7] to-white rounded-2xl p-6 border border-[#F4415F]/10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-[#F4415F]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#955F6A] mb-1">100% Bezpečné</h3>
                  <p className="text-sm text-[hsl(var(--widget-text-soft))]">
                    Tvoje údaje sú šifrované a chránené najmodernejšími bezpečnostnými štandardmi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[hsl(var(--widget-border))]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#955F6A' }}>Vytvor si účet</h2>
                <p className="text-sm text-[hsl(var(--widget-text-soft))]">
                  Rýchla registrácia. Začni užívať Premium za 2 minúty.
                </p>
              </div>

              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-[hsl(var(--widget-border))] hover:border-[#F4415F]/30 hover:bg-[#FEF5F7]/50 transition-all font-medium text-[#955F6A]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Pokračovať s Google
                </button>
                
                <button 
                  onClick={handleAppleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-[hsl(var(--widget-border))] hover:border-[#F4415F]/30 hover:bg-[#FEF5F7]/50 transition-all font-medium text-[#955F6A]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Pokračovať s Apple ID
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[hsl(var(--widget-border))]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[hsl(var(--widget-text-soft))]">alebo emailom</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-[#955F6A] font-medium mb-2 block">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="tvoj@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl border-2 focus:border-[#F4415F]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-[#955F6A] font-medium mb-2 block">Heslo</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Minimálne 8 znakov" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-2 focus:border-[#F4415F]"
                    minLength={8}
                    required
                  />
                </div>

                {/* Payment Summary */}
                <div className="bg-[#FEF5F7] rounded-2xl p-4 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#955F6A]">Mesačné predplatné</span>
                    <span className="text-sm font-semibold text-[#955F6A]">4,90 €</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#F4415F]/10">
                    <span className="text-sm text-[hsl(var(--widget-text-soft))]">DPH (20%)</span>
                    <span className="text-sm text-[hsl(var(--widget-text-soft))]">0,98 €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#955F6A]">Celkom</span>
                    <span className="text-xl font-bold text-[#F4415F]">5,88 €</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-14 text-lg font-semibold rounded-2xl mt-6"
                  style={{ 
                    backgroundColor: '#F4415F',
                    color: 'white'
                  }}
                >
                  Začať s Premium →
                </Button>

                <p className="text-xs text-center text-[hsl(var(--widget-text-soft))] mt-4 leading-relaxed">
                  Kliknutím súhlasíš s našimi{' '}
                  <a href="#" className="text-[#F4415F] underline hover:no-underline">obchodnými podmienkami</a> a{' '}
                  <a href="#" className="text-[#F4415F] underline hover:no-underline">zásadami ochrany osobných údajov</a>.
                  <br />
                  Predplatné môžeš <strong>zrušiť kedykoľvek bez poplatkov</strong>.
                </p>
              </form>
            </div>

            {/* Social Proof */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-[hsl(var(--widget-text-soft))]">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4415F] to-[#955F6A]"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#955F6A] to-[#F4415F]"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4415F] to-[#955F6A]"></div>
                </div>
                <span>Pripojilo sa už viac ako <strong className="text-[#F4415F]">10 000+ žien</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;