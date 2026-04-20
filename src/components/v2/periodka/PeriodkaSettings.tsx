import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit3, ChevronLeft, ChevronRight, TestTube2, History, X, Info } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths, differenceInDays, startOfDay } from 'date-fns';
import { sk } from 'date-fns/locale';
import { toast } from 'sonner';
import GlassCard from '../GlassCard';
import { useCycleData } from '../../../features/cycle/useCycleData';
import { getNextPeriodDate, formatDateSk, getCurrentCycleDay, getPhaseByDay, getPhaseRanges } from '../../../features/cycle/utils';
import { colors } from '../../../theme/warmDusk';

import { PHASE_NAMES } from '../../../features/cycle/constants';

// Period history types
interface PeriodHistoryEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  periodLength: number; // dní krvácania
  cycleLength?: number; // dní celého cyklu (len ak nie je posledný)
  createdAt: string;
}

// Period history functions
const getPeriodHistory = (): PeriodHistoryEntry[] => {
  try {
    const stored = localStorage.getItem('neome-period-history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const savePeriodHistory = (history: PeriodHistoryEntry[]) => {
  try {
    localStorage.setItem('neome-period-history', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save period history:', error);
  }
};

export default function PeriodkaSettings() {
  const navigate = useNavigate();
  const {
    cycleData,
    setLastPeriodStart,
    setCycleLength,
    setPeriodLength,
    updateCycleData,
  } = useCycleData();

  const { lastPeriodStart, cycleLength, periodLength } = cycleData;
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [showPeriodEndPicker, setShowPeriodEndPicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [periodHistory, setPeriodHistory] = useState<PeriodHistoryEntry[]>([]);

  // Check if user has history (past onboarding)  
  const hasHistory = periodHistory.length > 0;
  const [forceManualMode, setForceManualMode] = useState(false);
  const isAutoMode = hasHistory && !forceManualMode; // Auto-update mode when has history and not forced manual
  const [showModeInfo, setShowModeInfo] = useState(false);

  // Load period history on mount
  useEffect(() => {
    setPeriodHistory(getPeriodHistory());
  }, []);

  const today = useMemo(() => new Date(), []);
  const nextPeriod = useMemo(() => {
    if (!lastPeriodStart) return null;
    
    const result = getNextPeriodDate(lastPeriodStart, cycleLength);
    console.log('🔍 NextPeriod Debug:', {
      lastPeriodStart,
      cycleLength,
      calculatedNextPeriod: result,
      expectedDate: `21.3 + 28 days = 18.4`
    });
    
    return result;
  }, [lastPeriodStart, cycleLength]);

  // Calculate current cycle day and phase (same logic as DailyOverview)
  const ranges = useMemo(() => getPhaseRanges(cycleLength, periodLength), [cycleLength, periodLength]);
  
  const currentDay = useMemo(() => {
    try {
      return lastPeriodStart 
        ? getCurrentCycleDay(lastPeriodStart, today, cycleLength) 
        : 1;
    } catch (error) {
      console.error('Error getting current day:', error);
      return 1;
    }
  }, [lastPeriodStart, today, cycleLength]);

  const phase = useMemo(() => {
    try {
      console.log('🚀 PeriodkaSettings calling getPhaseByDay with:', {
        currentDay,
        ranges,
        cycleLength,
        rangesDetails: ranges?.map(r => `${r.key}: ${r.start}-${r.end}`)
      });
      const result = getPhaseByDay(currentDay, ranges, cycleLength);
      console.log('🚀 PeriodkaSettings getPhaseByDay result:', result);
      return result;
    } catch (error) {
      console.error('Error getting phase:', error);
      return { key: 'follicular', name: 'Folikulárna fáza' };
    }
  }, [currentDay, ranges, cycleLength]);

  const fertileWindow = useMemo(() => {
    if (!lastPeriodStart) return null;
    
    // Only calculate fertility if we have reliable data (3+ cycles) OR use conservative estimates
    const hasReliableData = periodHistory.length >= 3;
    
    if (!hasReliableData) {
      // Conservative approach for new users - only show if period is short enough
      if (periodLength >= 7) {
        console.log('🔍 Fertile Window: Not showing - period too long for reliable estimate without history');
        return null; // Don't show fertility for long periods without data
      }
      
      // Conservative estimate: ovulation day 14, but ensure gap after period
      const minGapAfterPeriod = 3; // At least 3 days after period ends
      const ovulationDay = Math.max(periodLength + minGapAfterPeriod + 5, cycleLength - 14);
      
      // Check if this makes sense for the cycle length
      if (ovulationDay >= cycleLength - 3) {
        console.log('🔍 Fertile Window: Not showing - cycle too short for reliable estimate');
        return null;
      }
      
      const fertileStart = new Date(lastPeriodStart + 'T00:00:00');
      fertileStart.setDate(fertileStart.getDate() + ovulationDay - 5);
      const fertileEnd = new Date(lastPeriodStart + 'T00:00:00'); 
      fertileEnd.setDate(fertileEnd.getDate() + ovulationDay + 1);
      
      console.log('🔍 Fertile Window (Conservative):', {
        hasReliableData: false,
        cycleLength,
        periodLength,
        ovulationDay,
        fertileStart: format(fertileStart, 'd.M'),
        fertileEnd: format(fertileEnd, 'd.M'),
        note: 'Conservative estimate - need 3+ cycles for accurate prediction'
      });
      
      return { start: fertileStart, end: fertileEnd };
    }
    
    // Calculate from historical data when available
    const ovulationDay = cycleLength - 14;
    const fertileStart = new Date(lastPeriodStart + 'T00:00:00');
    fertileStart.setDate(fertileStart.getDate() + ovulationDay - 5);
    const fertileEnd = new Date(lastPeriodStart + 'T00:00:00');
    fertileEnd.setDate(fertileEnd.getDate() + ovulationDay + 1);
    
    console.log('🔍 Fertile Window (Data-based):', {
      hasReliableData: true,
      historyCount: periodHistory.length,
      ovulationDay,
      fertileStart: format(fertileStart, 'd.M'),
      fertileEnd: format(fertileEnd, 'd.M')
    });
    
    return { start: fertileStart, end: fertileEnd };
  }, [lastPeriodStart, cycleLength, periodLength, periodHistory.length]);

  // Adaptive learning handlers for the simplified system
  const handlePeriodEnded = useCallback(() => {
    setShowPeriodEndPicker(true);
  }, []);

  const handlePeriodEndedWithDate = useCallback((selectedEndDate: Date) => {
    if (!lastPeriodStart) return;
    
    // Calculate actual period length from start to selected end date
    const periodStartDate = new Date(lastPeriodStart);
    
    // Use date-fns for more accurate calculation (ignores time, counts inclusive days)
    const startDay = startOfDay(periodStartDate);
    const endDay = startOfDay(selectedEndDate);
    const actualPeriodLength = differenceInDays(endDay, startDay) + 1; // +1 for inclusive count
    
    // Ensure realistic period length (1-10 days)
    const safePeriodLength = Math.max(1, Math.min(10, actualPeriodLength));
    
    // Calculate how many days have passed since the end date
    const today = new Date();
    const daysSinceEnd = Math.floor((today.getTime() - selectedEndDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // IMPORTANT: Keep the original period start date unchanged!
    // Only update the period length based on the calculated duration
    updateCycleData({ 
      lastPeriodStart: lastPeriodStart, // Keep original start date
      periodLength: safePeriodLength 
    });
    
    // Add to history for learning (use original start date)
    const newHistoryEntry = {
      id: `${Date.now()}-ended`,
      startDate: lastPeriodStart, // Use original start date, not adjusted
      endDate: format(selectedEndDate, 'yyyy-MM-dd'),
      periodLength: safePeriodLength,
      createdAt: new Date().toISOString()
    };
    
    const currentHistory = getPeriodHistory();
    const updatedHistory = [newHistoryEntry, ...currentHistory].slice(0, 20);
    savePeriodHistory(updatedHistory);
    setPeriodHistory(updatedHistory);
    
    // Success message
    const statusText = daysSinceEnd === 0 
      ? `Menštruácia skončená dnes po ${safePeriodLength} dňoch`
      : `Menštruácia skončená ${daysSinceEnd} ${daysSinceEnd === 1 ? 'deň' : 'dni'} dozadu po ${safePeriodLength} dňoch`;
      
    toast.success(statusText);
  }, [lastPeriodStart, updateCycleData]);

  const handlePeriodStarted = useCallback(() => {
    setShowPeriodPicker(true);
  }, []);

  const handlePeriodStartedWithDate = useCallback((selectedDate: Date) => {
    if (!lastPeriodStart) {
      // First time setup
      setLastPeriodStart(selectedDate);
      updateCycleData({
        lastPeriodStart: format(selectedDate, 'yyyy-MM-dd'),
        periodLength: 5 // Reset to default
      });
      toast.success('Menštruácia začatá - deň 1');
      return;
    }

    // Calculate actual cycle length from previous period to selected date
    const previousPeriodStart = new Date(lastPeriodStart);
    const actualCycleLength = Math.floor((selectedDate.getTime() - previousPeriodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Save previous cycle to history if it makes medical sense (21-45 days)
    if (actualCycleLength >= 21 && actualCycleLength <= 45) {
      const previousPeriodEnd = new Date(previousPeriodStart);
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() + periodLength - 1);
      
      const newHistoryEntry = {
        id: `${previousPeriodStart.getTime()}-${Date.now()}`,
        startDate: format(previousPeriodStart, 'yyyy-MM-dd'),
        endDate: format(previousPeriodEnd, 'yyyy-MM-dd'),
        periodLength: periodLength,
        cycleLength: actualCycleLength,
        createdAt: new Date().toISOString()
      };
      
      const currentHistory = getPeriodHistory();
      const updatedHistory = [newHistoryEntry, ...currentHistory].slice(0, 20);
      savePeriodHistory(updatedHistory);
      setPeriodHistory(updatedHistory);
    }
    
    // Calculate what day we're currently on
    const daysSince = Math.floor((today.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Set period length to ensure we stay in menstrual phase until user decides
    // This prevents automatic phase switching - user controls when period ends
    const safePeriodLength = Math.max(daysSince + 2, 5); // At least current day + buffer
    
    // Start new period with learned data
    updateCycleData({
      lastPeriodStart: format(selectedDate, 'yyyy-MM-dd'),
      cycleLength: Math.max(21, Math.min(45, actualCycleLength)), // Keep within medical range
      periodLength: safePeriodLength // Ensure we stay in menstrual phase
    });
    
    const statusText = `Nová menštruácia nastavená - deň ${daysSince}`;
    toast.success(statusText);
  }, [lastPeriodStart, periodLength, updateCycleData, today]);

  const handlePeriodDateChange = useCallback((date: Date) => {
    handlePeriodStartedWithDate(date);
    setShowPeriodPicker(false);
  }, [handlePeriodStartedWithDate]);

  const handlePeriodEndDateChange = useCallback((date: Date) => {
    handlePeriodEndedWithDate(date);
    setShowPeriodEndPicker(false);
  }, [handlePeriodEndedWithDate]);

  // Simple action handlers for the new 2-button system
  const getSimpleActions = useCallback(() => {
    if (!phase || !currentDay || !lastPeriodStart) return [];

    const actions = [];
    
    console.log('🎯 Simple Actions Debug:', {
      currentDay,
      periodLength, 
      cycleLength,
      phase: phase?.key,
      'is menstrual phase': phase.key === 'menstrual',
      'currentDay <= periodLength': currentDay <= periodLength
    });
    
    // Determine if we're currently in menstruation
    const isCurrentlyMenstruating = phase.key === 'menstrual';
    
    // Show "ZAČALA" button from mid-luteal phase (day 21+) OR when period is late
    const shouldShowStartButton = (currentDay >= 21 && !isCurrentlyMenstruating) || 
                                  (currentDay > cycleLength && !isCurrentlyMenstruating);
    
    if (shouldShowStartButton) {
      actions.push({
        text: '🩸 MENŠTRUÁCIA MI ZAČALA',
        action: handlePeriodStarted, // This now opens calendar
        style: 'primary'
      });
    }
    
    // Show "SKONČILA" button from day 3 of menstruation
    if (isCurrentlyMenstruating && currentDay >= 3) {
      actions.push({
        text: '✅ MENŠTRUÁCIA MI SKONČILA', 
        action: handlePeriodEnded,
        style: 'success'
      });
    }

    console.log('🎯 Actions to show:', actions.map(a => a.text));
    return actions;
  }, [phase, currentDay, lastPeriodStart, periodLength, cycleLength, handlePeriodEnded, handlePeriodStarted]);

  // Delete period history entry
  const handleDeleteHistoryEntry = useCallback((entryId: string) => {
    const currentHistory = getPeriodHistory();
    const updatedHistory = currentHistory.filter(entry => entry.id !== entryId);
    savePeriodHistory(updatedHistory);
    setPeriodHistory(updatedHistory);
    toast.success('Záznam vymazaný z histórie');
  }, []);

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/kniznica/periodka')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" style={{ color: colors.periodka }} />
          </button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.periodka}20` }}
            >
              <Calendar className="h-6 w-6" style={{ color: colors.periodka }} />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg font-medium text-gray-500">Periodka</span>
                <span className="text-lg text-gray-400">•</span>
                <span className="text-lg font-semibold" style={{ color: colors.periodka }}>Nastavenia</span>
              </div>
              <div className="w-12 h-0.5 mx-auto rounded-full opacity-60" style={{ backgroundColor: colors.periodka }}></div>
            </div>
          </div>

          <button
            onClick={() => navigate('/kniznica/periodka/testing')}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Testing konzola"
          >
            <TestTube2 className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Current Status */}
      {lastPeriodStart && phase && (
        <GlassCard>
          <div className="text-center py-4">
            {/* Dynamic icon based on cycle status */}
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${colors.periodka}20` }}
            >
              <div className="text-2xl">
                {phase.key === 'menstrual' 
                  ? '🩸' 
                  : phase.key === 'ovulation' 
                    ? '🥚'
                    : phase.key === 'follicular'
                      ? '🌱'
                      : '🌙'
                }
              </div>
            </div>
            
            {/* Clean phase display with medical accuracy */}
            <h2 className="text-lg font-semibold mb-2" style={{ color: colors.periodka }}>
              {PHASE_NAMES[phase?.key] || 'Folikulárna fáza'}
            </h2>
            
            {/* Main cycle info - unified formatting with matching phase color */}
            <p className="text-sm mb-1" style={{ color: colors.periodka }}>
              {phase.key === 'menstrual'
                ? `${currentDay}. deň`
                : `${currentDay}. deň cyklu${currentDay <= cycleLength ? ` z ${cycleLength}` : ''}`
              }
            </p>

            {/* Prediction text - only when reality differs from plan */}
            {(() => {
              // Late menstruation - improved text
              if (currentDay > cycleLength && phase.key !== 'menstrual') {
                return (
                  <p className="text-xs text-gray-500 mb-3">
                    Podľa plánu ti menštruácia mala už začať
                  </p>
                );
              }
              
              // Extended menstruation  
              if (phase.key === 'menstrual' && currentDay > periodLength) {
                return (
                  <p className="text-xs text-gray-500 mb-3">
                    Predpokladaná folikulárna fáza
                  </p>
                );
              }

              // Last expected day of menstruation
              if (phase.key === 'menstrual' && currentDay === periodLength) {
                return (
                  <p className="text-xs text-gray-500 mb-3">
                    Predpokladaný koniec menštruácie
                  </p>
                );
              }
              
              // No prediction needed - normal flow
              return null;
            })()}
            
            {/* Simple action buttons */}
            <div className="mt-3 space-y-2">
              {getSimpleActions().map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all shadow-sm ${
                    action.style === 'success' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
                    : action.style === 'primary'
                      ? 'text-white border border-red-400 hover:shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                  style={action.style === 'primary' ? { backgroundColor: colors.periodka } : {}}
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Settings List */}
      <div className="space-y-3">
        {/* Last Period */}
        <GlassCard className="p-0">
          <button 
            onClick={() => setShowPeriodPicker(true)}
            className="w-full p-4 text-left hover:bg-white/20 rounded-2xl transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Začiatok poslednej menštruácie</p>
                <p className="font-semibold" style={{ color: colors.periodka }}>
                  {lastPeriodStart ? formatDateSk(lastPeriodStart) : 'Nenastavené'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Zmeniť</span>
                <Edit3 className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </button>
        </GlassCard>

        {/* Simple Cycle & Period Settings */}
        <GlassCard className="p-4 space-y-4">
          {/* Cycle Length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Dĺžka cyklu</p>
                <button
                  onClick={() => setShowModeInfo(true)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title={isAutoMode ? "Automatický mód aktívny" : "Manuálny mód aktívny"}
                >
                  <Info className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold text-gray-800">{cycleLength}</span>
                <span className="text-xs text-gray-500">dní</span>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-1 px-1">
              {Array.from({ length: 15 }, (_, i) => i + 21).map((value) => (
                <button
                  key={value}
                  onClick={() => !isAutoMode && updateCycleData({ cycleLength: value })}
                  disabled={isAutoMode}
                  className={`
                    flex-shrink-0 w-8 h-8 rounded text-xs font-medium transition-all
                    ${isAutoMode 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : value === cycleLength 
                        ? 'text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }
                  `}
                  style={!isAutoMode && value === cycleLength ? { backgroundColor: colors.periodka } : {}}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Period Length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Dĺžka krvácania</p>
                <button
                  onClick={() => setShowModeInfo(true)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title={isAutoMode ? "Automatický mód aktívny" : "Manuálny mód aktívny"}
                >
                  <Info className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold text-gray-800">{periodLength}</span>
                <span className="text-xs text-gray-500">dní</span>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-1 px-1">
              {Array.from({ length: 8 }, (_, i) => i + 3).map((value) => (
                <button
                  key={value}
                  onClick={() => !isAutoMode && updateCycleData({ periodLength: value })}
                  disabled={isAutoMode}
                  className={`
                    flex-shrink-0 w-8 h-8 rounded text-xs font-medium transition-all
                    ${isAutoMode 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : value === periodLength 
                        ? 'text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }
                  `}
                  style={!isAutoMode && value === periodLength ? { backgroundColor: colors.periodka } : {}}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mode info moved to modal pop-up */}
        </GlassCard>

        {/* Next Period Prediction - Always show if we have period data */}
        {lastPeriodStart && (
          <GlassCard className="p-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Plánovaný začiatok ďalšej menštruácie</p>
              <p className="font-semibold" style={{ color: colors.periodka }}>
                {nextPeriod ? formatDateSk(nextPeriod) : 'Prepočítava sa...'}
              </p>
              {periodHistory.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Na základe posledných {Math.min(periodHistory.length, 3)} cyklov
                </p>
              )}
            </div>
          </GlassCard>
        )}

        {/* Fertile Window */}
        {fertileWindow ? (
          <GlassCard className="p-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {periodHistory.length >= 3 ? 'Plodné dni' : 'Odhadované plodné dni'}
              </p>
              <p className="font-semibold text-gray-800">
                {formatDateSk(fertileWindow.start)} - {formatDateSk(fertileWindow.end)}
              </p>
              {periodHistory.length < 3 && (
                <p className="text-xs text-gray-400 mt-1">
                  💡 Pre presnejšie výpočty potrebujeme aspoň 3 cykly v histórii
                </p>
              )}
            </div>
          </GlassCard>
        ) : lastPeriodStart && (
          <GlassCard className="p-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Plodné dni</p>
              <p className="text-sm text-gray-500">
                📊 Zatiaľ nedostupné - potrebujeme viac údajov
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Pre spoľahlivé predpovede plodných dní potrebujeme aspoň 3 úplne cykly v histórii. 
                Zaznamenajte ešte {3 - periodHistory.length} cykl{3 - periodHistory.length === 1 ? 'us' : 'y'}.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Period History - Always show */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Prehľad predchádzajúcich menštruácií</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Obdobie</th>
                  <th className="text-center py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Krvácanie</th>
                  <th className="text-center py-3 text-xs font-medium text-gray-600 uppercase tracking-wide">Cyklus</th>
                  <th className="text-center py-3 text-xs font-medium text-gray-600 uppercase tracking-wide w-16">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {periodHistory.length > 0 ? (
                  periodHistory.slice(0, 5).map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50/50">
                      <td className="py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(entry.startDate), 'd.M.')} - {format(new Date(entry.endDate), 'd.M.yyyy')}
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-sm text-gray-700">{entry.periodLength} dní</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-sm text-gray-700">
                          {entry.cycleLength ? `${entry.cycleLength} dní` : '-'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleDeleteHistoryEntry(entry.id)}
                          className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                          title="Vymazať záznam"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center">
                      <div className="text-gray-500">
                        <div className="text-2xl mb-2">📊</div>
                        <p className="text-sm">Žiadne záznamy ešte</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Záznamy sa automaticky vytvoria po nastavení novej menštruácie
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {periodHistory.length > 5 && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">Zobrazených 5 z {periodHistory.length} záznamov</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Mini Calendar for Period Date Selection */}
      {showPeriodPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5">
          <GlassCard className="w-full max-w-sm">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-center mb-4">
                Kedy ti začala posledná menštruácia?
              </h3>
              
              {/* Visual Calendar */}
              <div className="mb-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h4 className="font-semibold text-gray-800">
                    {format(calendarMonth, 'MMMM yyyy', { locale: sk })}
                  </h4>
                  <button
                    onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    disabled={calendarMonth >= today}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((day) => (
                    <div key={day} className="text-xs text-gray-500 text-center p-2 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const monthStart = startOfMonth(calendarMonth);
                    const monthEnd = endOfMonth(calendarMonth);
                    const calendarStart = subDays(monthStart, (getDay(monthStart) + 6) % 7);
                    const calendarEnd = endOfMonth(addMonths(calendarMonth, 0));
                    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
                    
                    return days.map((day) => {
                      const isCurrentMonth = isSameMonth(day, calendarMonth);
                      const isToday = isSameDay(day, today);
                      const isSelected = lastPeriodStart && isSameDay(day, lastPeriodStart);
                      const isFutureDate = day > today;
                      const isTooOld = day < subDays(today, 90);
                      
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !isFutureDate && !isTooOld && handlePeriodDateChange(day)}
                          disabled={isFutureDate || isTooOld}
                          className={`
                            aspect-square p-1 text-sm rounded-lg transition-colors relative
                            ${!isCurrentMonth 
                              ? 'text-gray-300' 
                              : isFutureDate || isTooOld
                                ? 'text-gray-300 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-red-500 text-white font-bold'
                                  : isToday
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'hover:bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          {format(day, 'd')}
                          {isSelected && (
                            <div className="absolute inset-0 rounded-lg ring-2 ring-red-300"></div>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
                
                {/* Legend */}
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Vybraný dátum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded border"></div>
                    <span>Dnes</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Môžeš vybrať dátum až 90 dní dozadu
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPeriodPicker(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Zrušiť
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Mini Calendar for Period End Date Selection */}
      {showPeriodEndPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5">
          <GlassCard className="w-full max-w-sm">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-center mb-4">
                Kedy ti skončila menštruácia?
              </h3>
              
              {/* Visual Calendar */}
              <div className="mb-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h4 className="font-semibold text-gray-800">
                    {format(calendarMonth, 'MMMM yyyy', { locale: sk })}
                  </h4>
                  <button
                    onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    disabled={calendarMonth >= today}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((day) => (
                    <div key={day} className="text-xs text-gray-500 text-center p-2 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const monthStart = startOfMonth(calendarMonth);
                    const monthEnd = endOfMonth(calendarMonth);
                    const calendarStart = subDays(monthStart, (getDay(monthStart) + 6) % 7);
                    const calendarEnd = endOfMonth(addMonths(calendarMonth, 0));
                    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
                    
                    return days.map((day) => {
                      const isCurrentMonth = isSameMonth(day, calendarMonth);
                      const isToday = isSameDay(day, today);
                      const isFutureDate = day > today;
                      const periodStart = lastPeriodStart ? new Date(lastPeriodStart) : null;
                      const isBeforePeriodStart = periodStart && day < periodStart;
                      const isTooOld = day < subDays(today, 30); // Only 30 days back for end date
                      
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !isFutureDate && !isTooOld && !isBeforePeriodStart && handlePeriodEndDateChange(day)}
                          disabled={isFutureDate || isTooOld || isBeforePeriodStart}
                          className={`
                            aspect-square p-1 text-sm rounded-lg transition-colors relative
                            ${!isCurrentMonth 
                              ? 'text-gray-300' 
                              : isFutureDate || isTooOld || isBeforePeriodStart
                                ? 'text-gray-300 cursor-not-allowed'
                                : isToday
                                  ? 'bg-green-100 text-green-600 font-semibold'
                                  : 'hover:bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          {format(day, 'd')}
                          {isToday && (
                            <div className="absolute inset-0 rounded-lg ring-2 ring-green-300"></div>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
                
                {/* Legend */}
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded border"></div>
                    <span>Dnes</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Vyber dátum od začiatku menštruácie až po dnes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPeriodEndPicker(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Zrušiť
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Mode Info Modal */}
      {showModeInfo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModeInfo(false)}
        >
          <GlassCard 
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Nastavenia režimu</h3>
                <button
                  onClick={() => setShowModeInfo(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                </button>
              </div>

              {/* Mode info */}
              {isAutoMode ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5">✨</span>
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Automatický režim aktivovaný</p>
                      <p className="text-xs text-green-600 leading-relaxed">
                        Dĺžky sa automaticky aktualizujú na základe vašej histórie ({periodHistory.length} cyklov).
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setForceManualMode(true);
                      setShowModeInfo(false);
                    }}
                    className="w-full py-2.5 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                  >
                    Prepnúť na manuálny režim
                  </button>
                  
                  <button
                    onClick={() => setShowModeInfo(false)}
                    className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Zrušiť
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 mt-0.5">🔧</span>
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Manuálny režim aktivovaný</p>
                      <p className="text-xs text-blue-600 leading-relaxed">
                        {hasHistory 
                          ? "Môžete si nastaviť hodnoty sami alebo prepnúť späť na automatické nastavenia."
                          : "Nastavte si hodnoty. Po zaznamenávaní cyklov sa môžu automaticky upresnиť."
                        }
                      </p>
                    </div>
                  </div>
                  
                  {hasHistory && (
                    <button
                      onClick={() => {
                        setForceManualMode(false);
                        setShowModeInfo(false);
                      }}
                      className="w-full py-2.5 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                    >
                      Prepnúť na automatický režim
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowModeInfo(false)}
                    className="w-full py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Zrušiť
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}