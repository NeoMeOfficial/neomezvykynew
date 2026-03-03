import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Droplets } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';
import { PeriodConfirmation } from '../../../types/period';

interface PeriodConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmation: PeriodConfirmation) => Promise<boolean>;
  expectedDate: string;
  daysLate: number;
  cycleId: string;
}

const symptomOptions = [
  { id: 'cramps', label: 'Kŕče', emoji: '💢' },
  { id: 'mood_swings', label: 'Náladovosť', emoji: '😤' },
  { id: 'bloating', label: 'Nadúvanie', emoji: '🎈' },
  { id: 'headache', label: 'Bolesti hlavy', emoji: '🤕' },
  { id: 'fatigue', label: 'Únava', emoji: '😴' },
  { id: 'breast_tenderness', label: 'Citlivé prsia', emoji: '🤱' },
  { id: 'back_pain', label: 'Bolesť chrbta', emoji: '🦴' },
];

export default function PeriodConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  expectedDate, 
  daysLate, 
  cycleId 
}: PeriodConfirmationModalProps) {
  const [confirmationType, setConfirmationType] = useState<'on_time' | 'early' | 'late' | 'not_yet' | null>(null);
  const [daysDifference, setDaysDifference] = useState<number>(daysLate || 1);
  const [flowIntensity, setFlowIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleConfirm = async () => {
    if (!confirmationType) return;

    setLoading(true);
    
    const confirmation: PeriodConfirmation = {
      cycle_id: cycleId,
      confirmation_type: confirmationType,
      days_difference: confirmationType === 'on_time' ? 0 : daysDifference,
      flow_intensity: confirmationType === 'not_yet' ? undefined : flowIntensity,
      symptoms: confirmationType === 'not_yet' ? undefined : selectedSymptoms,
      notes: notes || undefined
    };

    try {
      const success = await onConfirm(confirmation);
      if (success) {
        onClose();
        // Reset form
        setConfirmationType(null);
        setDaysDifference(1);
        setFlowIntensity('medium');
        setSelectedSymptoms([]);
        setNotes('');
      }
    } catch (error) {
      console.error('Error confirming period:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sk-SK', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/30 backdrop-blur-xl rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              Potvrdenie menštruácie
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/25 rounded-full">
              <XCircle className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </button>
          </div>
          
          <div className="mt-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: colors.periodka }} />
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              Očakávané: {formatDate(expectedDate)}
              {daysLate > 0 && (
                <span style={{ color: colors.periodka }} className="ml-2 font-medium">
                  ({daysLate} {daysLate === 1 ? 'deň' : daysLate < 5 ? 'dni' : 'dní'} neskôr)
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Confirmation Options */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: colors.textPrimary }}>
              Ako je na tom tvoja menštruácia?
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setConfirmationType('on_time')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  confirmationType === 'on_time' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-white/35 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${
                    confirmationType === 'on_time' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium" style={{ color: colors.textPrimary }}>
                      Začala včas
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Presne podľa očakávania
                    </div>
                  </div>
                </div>
              </button>

              {daysLate === 0 && (
                <button
                  onClick={() => setConfirmationType('early')}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${
                    confirmationType === 'early' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-white/35 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-5 h-5 ${
                      confirmationType === 'early' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium" style={{ color: colors.textPrimary }}>
                        Začala skôr
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        Pred očakávaným dátumom
                      </div>
                    </div>
                  </div>
                </button>
              )}

              <button
                onClick={() => setConfirmationType('late')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  confirmationType === 'late' 
                    ? `border-[${colors.periodka}] bg-[${colors.periodka}]/10` 
                    : 'border-white/35 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${
                    confirmationType === 'late' ? `text-[${colors.periodka}]` : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium" style={{ color: colors.textPrimary }}>
                      Začala neskôr
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Po očakávanom dátume
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setConfirmationType('not_yet')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  confirmationType === 'not_yet' 
                    ? 'border-gray-500 bg-white/20' 
                    : 'border-white/35 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <XCircle className={`w-5 h-5 ${
                    confirmationType === 'not_yet' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium" style={{ color: colors.textPrimary }}>
                      Ešte nezačala
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      Stále čakám
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Days Difference Input */}
          {(confirmationType === 'early' || confirmationType === 'late') && (
            <div>
              <label className="block font-medium mb-2" style={{ color: colors.textPrimary }}>
                Koľko dní {confirmationType === 'early' ? 'skôr' : 'neskôr'}?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map(days => (
                  <button
                    key={days}
                    onClick={() => setDaysDifference(days)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      daysDifference === days
                        ? 'text-white shadow-md'
                        : 'bg-white/25 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: daysDifference === days ? colors.periodka : undefined
                    }}
                  >
                    {days}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flow Intensity */}
          {confirmationType && confirmationType !== 'not_yet' && (
            <div>
              <label className="block font-medium mb-2" style={{ color: colors.textPrimary }}>
                Intenzita toku
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'light', label: 'Slabý', emoji: '💧' },
                  { value: 'medium', label: 'Stredný', emoji: '💧💧' },
                  { value: 'heavy', label: 'Silný', emoji: '💧💧💧' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFlowIntensity(option.value as any)}
                    className={`p-3 rounded-2xl border transition-all ${
                      flowIntensity === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-white/35 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{option.emoji}</div>
                    <div className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms */}
          {confirmationType && confirmationType !== 'not_yet' && (
            <div>
              <label className="block font-medium mb-2" style={{ color: colors.textPrimary }}>
                Príznaky (voliteľné)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {symptomOptions.map(symptom => (
                  <button
                    key={symptom.id}
                    onClick={() => handleSymptomToggle(symptom.id)}
                    className={`p-3 rounded-2xl border transition-all text-left ${
                      selectedSymptoms.includes(symptom.id)
                        ? `border-[${colors.periodka}] bg-[${colors.periodka}]/10`
                        : 'border-white/35 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{symptom.emoji}</span>
                      <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                        {symptom.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-medium mb-2" style={{ color: colors.textPrimary }}>
              Poznámky (voliteľné)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Akékoľvek dodatočné poznámky..."
              className="w-full p-3 rounded-2xl border border-white/35 resize-none focus:outline-none focus:border-blue-500"
              rows={3}
              style={{ color: colors.textPrimary }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/30 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl border border-gray-300 font-medium transition-colors hover:bg-white/20"
            style={{ color: colors.textSecondary }}
          >
            Zrušiť
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmationType || loading}
            className="flex-1 py-3 px-4 rounded-2xl text-white font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            style={{ 
              backgroundColor: confirmationType ? colors.periodka : colors.textTertiary 
            }}
          >
            {loading ? 'Ukladám...' : 'Potvrdiť'}
          </button>
        </div>
      </div>
    </div>
  );
}