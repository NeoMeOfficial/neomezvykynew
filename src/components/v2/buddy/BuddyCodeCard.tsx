import { useState } from 'react';
import { Copy, Check, RefreshCw, Users, Share } from 'lucide-react';
import { useBuddySystem } from '../../../hooks/useBuddySystem';
import { colors, glassCard } from '../../theme/warmDusk';

export default function BuddyCodeCard() {
  const { myBuddyCode, getMyBuddyCode, isLoading } = useBuddySystem();
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState<string | null>(myBuddyCode);

  const handleGenerateCode = async () => {
    try {
      const newCode = await getMyBuddyCode();
      setCode(newCode);
    } catch (error) {
      console.error('Failed to generate buddy code:', error);
    }
  };

  const handleCopyCode = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!code) return;

    const shareData = {
      title: 'Staň sa mojím workout buddy!',
      text: `Pripoj sa ku mne v NeoMe app s kódom: ${code}`,
      url: window.location.origin
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copy
        handleCopyCode();
      }
    } else {
      // Fallback to copy
      handleCopyCode();
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
          <Users className="w-4 h-4" style={{ color: '#B8864A' }} />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Tvoj Buddy kód</h3>
          <p className="text-sm" style={{ color: '#6B4C3B' }}>Zdieľaj ho s priateľkami</p>
        </div>
      </div>

      {/* Code Display */}
      {code ? (
        <div className="space-y-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="font-mono font-bold text-3xl letter-spacing-wide mb-2" style={{ color: '#2E2218' }}>
              {code}
            </div>
            <p className="text-sm" style={{ color: '#6B4C3B' }}>
              Zdieľaj tento kód s kamarátkami, aby sa mohli pripojiť
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyCode}
              disabled={copied}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                copied 
                  ? 'bg-green-500 text-white'
                  : 'bg-[#B8864A] text-white hover:bg-[#A67B42]'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Skopírované!' : 'Kopírovať'}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-[#7A9E78] text-white hover:bg-[#6B8B68] transition-all"
            >
              <Share size={16} />
              Zdieľať
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-white/20 rounded-xl p-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
              <Users size={24} style={{ color: '#B8864A' }} />
            </div>
            <p className="font-medium mb-2" style={{ color: '#2E2218' }}>Vytvor si Buddy kód</p>
            <p className="text-sm" style={{ color: '#6B4C3B' }}>
              Získaj jedinečný kód na pripojenie s kamarátkami
            </p>
          </div>
          
          <button
            onClick={handleGenerateCode}
            disabled={isLoading}
            className="w-full bg-[#B8864A] text-white rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2 hover:bg-[#A67B42] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {isLoading ? 'Generujem...' : 'Vytvoriť kód'}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-white/20 rounded-xl p-3">
        <p className="text-sm font-medium mb-1 flex items-center gap-2" style={{ color: '#2E2218' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
            💡
          </div>
          Ako to funguje?
        </p>
        <p className="text-xs" style={{ color: '#6B4C3B' }}>
          Tvoje kamarátky zadajú tento kód v sekcii "Nájdi Buddy" a automaticky sa spoja s tebou. 
          Budete vidieť navzájom svoje úspechy a motivovať sa!
        </p>
      </div>
    </div>
  );
}