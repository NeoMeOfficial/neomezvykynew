import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Checkout = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const features = [
    'Neobmedzené ukladanie údajov',
    'Pokročilé analýzy cyklu',
    'Personalizované odporúčania',
    'Synchronizácia medzi zariadeniami',
    'Predpovede na 6 mesiacov dopredu',
    'Export údajov',
    'Prioritná podpora'
  ];

  const handleGoogleLogin = () => {
    // Mock Google login
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    // Mock Apple login
    console.log('Apple login clicked');
  };

  const handlePayment = () => {
    // Mock payment processing
    console.log('Payment processing...');
    alert('Platba bola úspešne spracovaná! (Mock)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Vytvor si účet</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Plan Details */}
          <div className="space-y-6">
            <Card className="border-2 border-rose-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-rose-500" />
                  Premium predplatné
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">4,90 €</span>
                    <span className="text-sm text-gray-600">/mesiac</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Čo získaš:</h4>
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-rose-50 rounded-lg p-4 mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-rose-600" />
                      <span className="font-medium text-rose-800">Bezpečnosť údajov</span>
                    </div>
                    <p className="text-sm text-rose-700">
                      Všetky tvoje údaje sú šifrované a bezpečne uložené. Môžeš zrušiť predplatné kedykoľvek.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Account Creation & Payment */}
          <div className="space-y-6">
            {/* Social Login */}
            <Card>
              <CardHeader>
                <CardTitle>1. Vytvor si účet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGoogleLogin}
                  variant="outline" 
                  className="w-full flex items-center gap-3 py-3"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Pokračovať s Google
                </Button>
                
                <Button 
                  onClick={handleAppleLogin}
                  variant="outline" 
                  className="w-full flex items-center gap-3 py-3"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Pokračovať s Apple ID
                </Button>

                <div className="text-center text-sm text-gray-500">
                  alebo
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="tvoj@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="password">Heslo</Label>
                    <Input id="password" type="password" placeholder="Minimálne 8 znakov" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Vytvoriť účet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  2. Platobné údaje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Meno</Label>
                    <Input id="firstName" placeholder="Meno" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Priezvisko</Label>
                    <Input id="lastName" placeholder="Priezvisko" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardNumber">Číslo karty</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Platnosť</Label>
                    <Input id="expiry" placeholder="MM/RR" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Mesačné predplatné</span>
                    <span>4,90 €</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>DPH (20%)</span>
                    <span>0,98 €</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Celkom</span>
                    <span>5,88 €</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment}
                  className="w-full py-3 text-lg font-semibold bg-rose-600 hover:bg-rose-700"
                >
                  Zaplatiť a aktivovať účet
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Kliknutím súhlasíš s našimi{' '}
                  <a href="#" className="underline">obchodnými podmienkami</a> a{' '}
                  <a href="#" className="underline">zásadami ochrany osobných údajov</a>.
                  Predplatné môžeš zrušiť kedykoľvek.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;