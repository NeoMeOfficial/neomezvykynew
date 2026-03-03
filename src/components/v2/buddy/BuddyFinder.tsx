import { useState } from 'react';
import { Search, UserPlus, Clock, Check, AlertCircle } from 'lucide-react';
import { useBuddySystem } from '../../../hooks/useBuddySystem';
import { colors, glassCard } from '../../theme/warmDusk';

export default function BuddyFinder() {
  const { sendBuddyRequest, isLoading } = useBuddySystem();
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    if (!searchCode.trim() || searchCode.length !== 6) {
      setErrorMessage('Kód musí mať presně 6 znakov');
      setSearchResult('error');
      return;
    }

    const cleanCode = searchCode.trim().toUpperCase();
    
    try {
      setSearchResult('loading');
      setErrorMessage('');
      
      const success = await sendBuddyRequest(cleanCode);
      
      if (success) {
        setSearchResult('success');
        setSearchCode('');
      } else {
        throw new Error('Nepodarilo sa odoslať žiadosť');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Buddy s týmto kódom nebol nájdený');
      setSearchResult('error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchResult('idle');
    setErrorMessage('');
    setSearchCode('');
  };

  const formatCode = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // Limit to 6 characters
    return cleaned.slice(0, 6);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCode(e.target.value);
    setSearchCode(formatted);
    
    // Reset error state when user starts typing
    if (searchResult === 'error') {
      setSearchResult('idle');
      setErrorMessage('');
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
          <Search className="w-4 h-4" style={{ color: '#7A9E78' }} />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Nájdi Buddy</h3>
          <p className="text-sm" style={{ color: '#6B4C3B' }}>Zadaj 6-miestny kód kamarátky</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchCode}
            onChange={handleCodeChange}
            onKeyPress={handleKeyPress}
            placeholder="Napr. NM4K7X"
            disabled={isLoading || searchResult === 'success'}
            className={`
              w-full px-4 py-3 rounded-xl font-mono font-semibold text-lg text-center letter-spacing-wide
              bg-white/20 border transition-all focus:outline-none focus:ring-2
              ${searchResult === 'error' 
                ? 'border-red-300 focus:ring-red-200 text-red-700' 
                : searchResult === 'success'
                  ? 'border-green-300 bg-green-50 text-green-700'
                  : 'border-white/35 focus:border-[#7A9E78] focus:ring-[#7A9E78]/30'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            style={{ 
              color: searchResult === 'error' ? '#dc2626' : searchResult === 'success' ? '#059669' : '#2E2218'
            }}
            maxLength={6}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
          />
          
          {/* Character counter */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className={`text-xs font-medium ${
              searchCode.length === 6 ? 'text-[#7A9E78]' : 'text-[#8B7560]'
            }`}>
              {searchCode.length}/6
            </span>
          </div>
        </div>

        {/* Action Button */}
        {searchResult === 'idle' || searchResult === 'error' ? (
          <button
            onClick={handleSearch}
            disabled={isLoading || searchCode.length !== 6}
            className="w-full bg-[#7A9E78] text-white rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2 hover:bg-[#6B8B68] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Hľadám...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Nájsť a pripojiť
              </>
            )}
          </button>
        ) : searchResult === 'loading' ? (
          <div className="w-full bg-[#B8864A] text-white rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Odosielam žiadosť...
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-full bg-green-500 text-white rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2">
              <Check size={16} />
              Žiadosť odoslaná!
            </div>
            <button
              onClick={resetSearch}
              className="w-full bg-white/30 text-[#6B4C3B] rounded-xl py-2 px-4 font-medium text-sm hover:bg-white/40 transition-all"
            >
              Hľadať ďalšieho buddy
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {searchResult === 'error' && errorMessage && (
        <div className="bg-red-100 border border-red-300 rounded-xl p-3 flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700 text-sm font-medium">Chyba pri hľadaní</p>
            <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {searchResult === 'success' && (
        <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock size={20} className="text-white" />
          </div>
          <p className="text-green-800 font-semibold text-sm mb-1">Žiadosť bola odoslaná!</p>
          <p className="text-green-700 text-xs">
            Kamarátka dostane notifikáciu a môže žiadosť prijať. 
            Po prijatí budete môcť vidieť navzájom svoje úspechy!
          </p>
        </div>
      )}

      {/* Help */}
      <div className="bg-white/20 rounded-xl p-3">
        <p className="text-sm font-medium mb-1 flex items-center gap-2" style={{ color: '#2E2218' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
            ℹ️
          </div>
          Ako získať buddy kód?
        </p>
        <p className="text-xs" style={{ color: '#6B4C3B' }}>
          Požiadaj kamarátku, aby ti pošlala svoj 6-miestny buddy kód z jej profilu. 
          Vyzerá napríklad takto: NM4K7X
        </p>
      </div>
    </div>
  );
}