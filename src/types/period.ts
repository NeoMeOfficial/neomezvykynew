export interface PeriodCycle {
  id: string;
  user_id: string;
  cycle_number: number;
  expected_start_date: string; // ISO date
  actual_start_date?: string; // ISO date
  status: 'predicted' | 'on_time' | 'early' | 'late' | 'missed';
  days_late?: number; // positive for late, negative for early
  flow_intensity?: 'light' | 'medium' | 'heavy';
  cycle_length?: number; // days from previous cycle start
  notes?: string;
  symptoms: PeriodSymptom[];
  created_at: string;
  updated_at: string;
}

export interface PeriodSymptom {
  id: string;
  cycle_id: string;
  symptom_type: 'cramps' | 'mood_swings' | 'bloating' | 'headache' | 'fatigue' | 'acne' | 'breast_tenderness' | 'back_pain' | 'nausea' | 'other';
  intensity: 1 | 2 | 3 | 4 | 5; // 1 = mild, 5 = severe
  date: string; // ISO date
  notes?: string;
  created_at: string;
}

export interface PeriodPrediction {
  next_expected_date: string;
  confidence_level: 'low' | 'medium' | 'high';
  average_cycle_length: number;
  cycle_regularity: 'regular' | 'irregular' | 'unknown';
  last_3_cycles: number[]; // cycle lengths
}

export interface PeriodStats {
  total_cycles_tracked: number;
  average_cycle_length: number;
  shortest_cycle: number;
  longest_cycle: number;
  regularity_score: number; // 0-100, higher = more regular
  most_common_symptoms: string[];
  on_time_percentage: number;
  early_percentage: number;
  late_percentage: number;
  average_days_late: number;
}

export interface PeriodConfirmation {
  cycle_id: string;
  confirmation_type: 'on_time' | 'early' | 'late' | 'not_yet';
  days_difference?: number;
  flow_intensity?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
}

export interface PeriodHistoryView {
  cycles: PeriodCycle[];
  stats: PeriodStats;
  prediction: PeriodPrediction;
  irregularity_alerts: string[];
}