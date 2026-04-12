import { useState } from 'react';
import { X, CreditCard, Lock, Check, Tag, ExternalLink } from 'lucide-react';

// Set VITE_STRIPE_PAYMENT_LINK in .env to go live (Stripe dashboard → Payment Links).
const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined;

const DISCOUNT_CODE = 'NEOME30';
const FULL_PRICE = 79;
const DISCOUNTED_PRICE = 49;

interface DummyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DummyCheckoutModal({ isOpen, onClose, onSuccess }: DummyCheckoutModalProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [codeApplied, setCodeApplied] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');

  if (!isOpen) return null;

  const price = codeApplied ? DISCOUNTED_PRICE : FULL_PRICE;

  const handleApplyCode = () => {
    if (discountCode.trim().toUpperCase() === DISCOUNT_CODE) {
      setCodeApplied(true);
      setCodeError('');
    } else {
      setCodeError('Neplatný kód');
    }
  };

  const handlePay = () => {
    if (STRIPE_PAYMENT_LINK) {
      // Real Stripe Payment Link — append pre-filled discount if applied
      const url = codeApplied
        ? `${STRIPE_PAYMENT_LINK}?prefilled_promo_code=${DISCOUNT_CODE}`
        : STRIPE_PAYMENT_LINK;
      window.open(url, '_blank', 'noopener');
      return;
    }
    // Demo fallback
    setStep('success');
    setTimeout(() => {
      onSuccess();
    }, 1800);
  };

  const handleClose = () => {
    setStep('checkout');
    setDiscountCode('');
    setCodeApplied(false);
    setCodeError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: '#F0E6DA' }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(122,158,120,0.15)' }}
            >
              <Check className="w-8 h-8" style={{ color: '#7A9E78' }} />
            </div>
            <h2 className="text-lg font-semibold text-center" style={{ color: '#2E2218' }}>
              Platba úspešná!
            </h2>
            <p className="text-sm text-center" style={{ color: '#8B7560' }}>
              Tvoj jedálniček bol aktivovaný. Presmerúvame ťa...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-black/5">
              <div>
                <h2 className="text-base font-semibold" style={{ color: '#2E2218' }}>Dokončiť nákup</h2>
                <p className="text-xs mt-0.5" style={{ color: '#8B7560' }}>6-týždňový personalizovaný jedálniček</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.06)' }}
              >
                <X className="w-4 h-4" style={{ color: '#8B7560' }} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {/* Price summary */}
              <div className="rounded-2xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#8B7560' }}>6-týždňový jedálniček</span>
                  <span style={{ color: '#2E2218' }}>€{FULL_PRICE}</span>
                </div>
                {codeApplied && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#7A9E78' }}>Zľava (NEOME30)</span>
                    <span style={{ color: '#7A9E78' }}>−€{FULL_PRICE - DISCOUNTED_PRICE}</span>
                  </div>
                )}
                <div className="border-t border-black/8 pt-2 flex justify-between font-semibold">
                  <span style={{ color: '#2E2218' }}>Celkom</span>
                  <span style={{ color: '#B8864A' }}>€{price}</span>
                </div>
              </div>

              {/* Discount code */}
              {!codeApplied ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: '#8B7560' }}>Zľavový kód</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#A0907E' }} />
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => { setDiscountCode(e.target.value); setCodeError(''); }}
                        placeholder="napr. NEOME30"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'rgba(255,255,255,0.7)', color: '#2E2218' }}
                      />
                    </div>
                    <button
                      onClick={handleApplyCode}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium"
                      style={{ background: 'rgba(184,134,74,0.12)', color: '#B8864A' }}
                    >
                      Použiť
                    </button>
                  </div>
                  {codeError && <p className="text-xs" style={{ color: '#C27A6E' }}>{codeError}</p>}
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(122,158,120,0.1)' }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: '#7A9E78' }} />
                  <span className="text-xs font-medium" style={{ color: '#7A9E78' }}>Zľava −€{FULL_PRICE - DISCOUNTED_PRICE} uplatnená</span>
                </div>
              )}

              {/* Fake card fields */}
              <div className="space-y-2">
                <label className="text-xs font-medium" style={{ color: '#8B7560' }}>Platobná karta</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#A0907E' }} />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.7)', color: '#2E2218' }}
                    maxLength={19}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/RR"
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.7)', color: '#2E2218' }}
                    maxLength={5}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-20 px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.7)', color: '#2E2218' }}
                    maxLength={3}
                  />
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: '#C27A6E', color: 'white', boxShadow: '0 4px 16px rgba(194,122,110,0.3)' }}
              >
                {STRIPE_PAYMENT_LINK ? (
                  <><ExternalLink className="w-3.5 h-3.5" />Prejsť na platbu €{price}</>
                ) : (
                  <><Lock className="w-3.5 h-3.5" />Zaplatiť €{price}</>
                )}
              </button>

              {!STRIPE_PAYMENT_LINK && (
                <p className="text-center text-[10px]" style={{ color: '#A0907E' }}>
                  Toto je demo platba — žiadna skutočná transakcia neprebehne
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
