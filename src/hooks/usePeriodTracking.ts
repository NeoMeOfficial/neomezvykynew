import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { PeriodCycle, PeriodSymptom, PeriodPrediction, PeriodStats, PeriodConfirmation } from '../types/period';

export function usePeriodTracking() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cycles, setCycles] = useState<PeriodCycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<PeriodCycle | null>(null);
  const [prediction, setPrediction] = useState<PeriodPrediction | null>(null);
  const [stats, setStats] = useState<PeriodStats | null>(null);

  // Load user's period cycles
  const loadCycles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('period_cycles')
        .select(`
          *,
          period_symptoms(*)
        `)
        .eq('user_id', user.id)
        .order('cycle_number', { ascending: false })
        .limit(12); // Last 12 cycles

      if (error) throw error;

      const cyclesWithSymptoms: PeriodCycle[] = data?.map(cycle => ({
        ...cycle,
        symptoms: cycle.period_symptoms || []
      })) || [];

      setCycles(cyclesWithSymptoms);

      // Find current predicted cycle
      const predicted = cyclesWithSymptoms.find(c => c.status === 'predicted');
      setCurrentCycle(predicted || null);

    } catch (error) {
      console.error('Error loading cycles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load current prediction
  const loadPrediction = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('period_predictions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const predictionData: PeriodPrediction = {
          next_expected_date: data.next_expected_date,
          confidence_level: data.confidence_level,
          average_cycle_length: parseFloat(data.average_cycle_length),
          cycle_regularity: data.cycle_regularity,
          last_3_cycles: [] // Would be populated from cycles data
        };
        setPrediction(predictionData);
      }
    } catch (error) {
      console.error('Error loading prediction:', error);
    }
  };

  // Load period stats
  const loadStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_period_stats', {
        p_user_id: user.id
      });

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Confirm period start
  const confirmPeriodStart = async (confirmation: PeriodConfirmation) => {
    if (!user || !currentCycle) return false;

    try {
      setLoading(true);

      let actualStartDate: string;
      const expectedDate = new Date(currentCycle.expected_start_date);

      switch (confirmation.confirmation_type) {
        case 'on_time':
          actualStartDate = currentCycle.expected_start_date;
          break;
        case 'early':
          actualStartDate = new Date(expectedDate.getTime() - (confirmation.days_difference || 1) * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];
          break;
        case 'late':
          actualStartDate = new Date(expectedDate.getTime() + (confirmation.days_difference || 1) * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];
          break;
        default:
          return false;
      }

      // Use the database function to confirm period start
      const { error } = await supabase.rpc('confirm_period_start', {
        p_user_id: user.id,
        p_cycle_id: currentCycle.id,
        p_actual_start_date: actualStartDate,
        p_flow_intensity: confirmation.flow_intensity,
        p_notes: confirmation.notes
      });

      if (error) throw error;

      // Add symptoms if provided
      if (confirmation.symptoms && confirmation.symptoms.length > 0) {
        const symptomData = confirmation.symptoms.map(symptom => ({
          cycle_id: currentCycle.id,
          user_id: user.id,
          symptom_type: symptom,
          intensity: 3, // Default intensity
          symptom_date: actualStartDate
        }));

        const { error: symptomsError } = await supabase
          .from('period_symptoms')
          .insert(symptomData);

        if (symptomsError) console.warn('Error adding symptoms:', symptomsError);
      }

      // Create next predicted cycle
      const { error: nextCycleError } = await supabase.rpc('create_next_cycle_prediction', {
        p_user_id: user.id
      });

      if (nextCycleError) console.warn('Error creating next cycle:', nextCycleError);

      // Reload data
      await Promise.all([loadCycles(), loadPrediction(), loadStats()]);

      return true;
    } catch (error) {
      console.error('Error confirming period start:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mark as not started yet (for late period tracking)
  const markAsNotStarted = async (notes?: string) => {
    if (!user || !currentCycle) return false;

    try {
      // Just add a note that period hasn't started yet
      const today = new Date().toISOString().split('T')[0];
      const expectedDate = new Date(currentCycle.expected_start_date);
      const daysLate = Math.floor((new Date().getTime() - expectedDate.getTime()) / (24 * 60 * 60 * 1000));

      const { error } = await supabase
        .from('period_cycles')
        .update({
          notes: notes || `Period not started yet, ${daysLate} days after expected date`,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCycle.id);

      if (error) throw error;

      await loadCycles();
      return true;
    } catch (error) {
      console.error('Error marking as not started:', error);
      return false;
    }
  };

  // Add symptom to current cycle
  const addSymptom = async (symptomType: string, intensity: number, notes?: string) => {
    if (!user || !currentCycle) return false;

    try {
      const { error } = await supabase
        .from('period_symptoms')
        .insert({
          cycle_id: currentCycle.id,
          user_id: user.id,
          symptom_type: symptomType,
          intensity: intensity,
          symptom_date: new Date().toISOString().split('T')[0],
          notes: notes
        });

      if (error) throw error;
      await loadCycles();
      return true;
    } catch (error) {
      console.error('Error adding symptom:', error);
      return false;
    }
  };

  // Initialize period tracking for new user
  const initializePeriodTracking = async () => {
    if (!user) return;

    try {
      // Create first predicted cycle
      await supabase.rpc('create_next_cycle_prediction', {
        p_user_id: user.id
      });

      await loadCycles();
    } catch (error) {
      console.error('Error initializing period tracking:', error);
    }
  };

  // Get days until next period
  const getDaysUntilNext = () => {
    if (!prediction) return null;
    
    const today = new Date();
    const nextDate = new Date(prediction.next_expected_date);
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get days late for current cycle
  const getDaysLate = () => {
    if (!currentCycle) return 0;
    
    const today = new Date();
    const expectedDate = new Date(currentCycle.expected_start_date);
    const diffTime = today.getTime() - expectedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  // Check if period is expected today or overdue
  const isPeriodExpectedOrOverdue = () => {
    const daysLate = getDaysLate();
    return daysLate >= 0;
  };

  useEffect(() => {
    if (user) {
      loadCycles();
      loadPrediction();
      loadStats();
    }
  }, [user]);

  return {
    loading,
    cycles,
    currentCycle,
    prediction,
    stats,
    confirmPeriodStart,
    markAsNotStarted,
    addSymptom,
    initializePeriodTracking,
    getDaysUntilNext,
    getDaysLate,
    isPeriodExpectedOrOverdue,
    loadCycles,
    loadPrediction,
    loadStats
  };
}