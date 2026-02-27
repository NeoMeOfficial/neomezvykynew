import { useState } from 'react';
import { Calendar, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';
import { usePeriodTracking } from '../../../hooks/usePeriodTracking';
import PeriodConfirmationModal from './PeriodConfirmationModal';

export default function PeriodOverview() {
  const {
    loading,
    currentCycle,
    prediction,
    stats,
    confirmPeriodStart,
    markAsNotStarted,
    getDaysUntilNext,
    getDaysLate,
    isPeriodExpectedOrOverdue,
    initializePeriodTracking
  } = usePeriodTracking();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const daysUntilNext = getDaysUntilNext();
  const daysLate = getDaysLate();
  const isExpectedOrOverdue = isPeriodExpectedOrOverdue();

  // Initialize tracking if no cycles exist
  if (!loading && !currentCycle && stats?.total_cycles_tracked === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${colors.periodka}20` }}>
            <Calendar className="w-8 h-8" style={{ color: colors.periodka }} />
          </div>
          
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Začni sledovať svoj cyklus
          </h3>
          
          <p className="mb-6" style={{ color: colors.textSecondary }}>
            Sleduj svoju menštruáciu a získaj prehľad o svojej pravidelnosti
          </p>
          
          <button
            onClick={initializePeriodTracking}
            className="px-6 py-3 rounded-2xl text-white font-bold shadow-md transition-transform active:scale-95"
            style={{ background: `linear-gradient(135deg, ${colors.periodka}, ${colors.periodka}CC)` }}
          >
            Začať sledovanie
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sk-SK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = () => {
    if (!isExpectedOrOverdue) return colors.strava; // Future/on track
    if (daysLate === 0) return colors.periodka; // Due today
    if (daysLate > 0) return '#e67e22'; // Late - orange
    return colors.strava;
  };

  const getStatusText = () => {
    if (!currentCycle) return 'Načítavam...';
    
    if (currentCycle.status !== 'predicted') {
      // Period already confirmed
      switch (currentCycle.status) {
        case 'on_time':
          return `Potvrdené včas (${formatDate(currentCycle.actual_start_date!)})`;
        case 'early':
          return `Začala skôr o ${Math.abs(currentCycle.days_late || 0)} ${Math.abs(currentCycle.days_late || 0) === 1 ? 'deň' : 'dni'}`;
        case 'late':
          return `Začala neskôr o ${currentCycle.days_late} ${currentCycle.days_late === 1 ? 'deň' : 'dni'}`;
        default:
          return 'Potvrdené';
      }
    }
    
    if (!isExpectedOrOverdue) {
      return `${Math.abs(daysUntilNext || 0)} ${Math.abs(daysUntilNext || 0) === 1 ? 'deň' : 'dni'} do menštruácie`;
    }
    
    if (daysLate === 0) {
      return 'Menštruácia očakávaná dnes';
    }
    
    if (daysLate > 0) {
      return `${daysLate} ${daysLate === 1 ? 'deň' : daysLate < 5 ? 'dni' : 'dní'} neskoro`;
    }
    
    return 'Sledovanie cyklu';
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Status Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${getStatusColor()}20` }}>
                <Calendar className="w-6 h-6" style={{ color: getStatusColor() }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.textPrimary }}>
                  Menštruačný cyklus
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {getStatusText()}
                </p>
              </div>
            </div>
            
            {/* Confirmation needed indicator */}
            {isExpectedOrOverdue && currentCycle?.status === 'predicted' && (
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            )}
          </div>

          {/* Expected Date & Action */}
          {currentCycle && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  Očakávané:
                </span>
                <span className="font-medium" style={{ color: colors.textPrimary }}>
                  {formatDate(currentCycle.expected_start_date)}
                </span>
              </div>

              {/* Action button */}
              {isExpectedOrOverdue && currentCycle.status === 'predicted' && (
                <button
                  onClick={() => setShowConfirmationModal(true)}
                  className="px-4 py-2 rounded-2xl text-white text-sm font-medium shadow-md transition-transform active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${colors.periodka}, ${colors.periodka}CC)` }}
                >
                  Potvrdiť
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {stats && stats.total_cycles_tracked > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" style={{ color: colors.strava }} />
                <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Priemerný cyklus</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {Math.round(stats.average_cycle_length)} dní
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" style={{ color: colors.periodka }} />
                <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Pravidelnosť</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {Math.round(stats.on_time_percentage || 0)}%
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" style={{ color: colors.accent }} />
                <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Sledovaných</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {stats.total_cycles_tracked}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" style={{ color: colors.mysel }} />
                <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Neskoro %</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {Math.round(stats.late_percentage || 0)}%
              </div>
            </div>
          </div>
        )}

        {/* Prediction Info */}
        {prediction && (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.mysel}20` }}>
                <TrendingUp className="w-4 h-4" style={{ color: colors.mysel }} />
              </div>
              <span className="font-medium" style={{ color: colors.textPrimary }}>
                Predikcia
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: colors.textSecondary }}>Ďalšia menštruácia:</span>
                <div className="font-medium" style={{ color: colors.textPrimary }}>
                  {formatDate(prediction.next_expected_date)}
                </div>
              </div>
              <div>
                <span style={{ color: colors.textSecondary }}>Spoľahlivosť:</span>
                <div className={`font-medium ${
                  prediction.confidence_level === 'high' ? 'text-green-600' :
                  prediction.confidence_level === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {prediction.confidence_level === 'high' ? 'Vysoká' :
                   prediction.confidence_level === 'medium' ? 'Stredná' : 'Nízka'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {currentCycle && (
        <PeriodConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={confirmPeriodStart}
          expectedDate={currentCycle.expected_start_date}
          daysLate={daysLate}
          cycleId={currentCycle.id}
        />
      )}
    </>
  );
}