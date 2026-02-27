-- =============================================
-- NeoMe Period Tracking System Database Setup
-- =============================================

-- Create period_cycles table
CREATE TABLE IF NOT EXISTS period_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL, -- Sequential cycle number for user
  expected_start_date DATE NOT NULL,
  actual_start_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'predicted' CHECK (status IN ('predicted', 'on_time', 'early', 'late', 'missed')),
  days_late INTEGER, -- positive for late, negative for early
  flow_intensity VARCHAR(10) CHECK (flow_intensity IN ('light', 'medium', 'heavy')),
  cycle_length INTEGER, -- days from previous cycle start
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, cycle_number)
);

-- Create period_symptoms table
CREATE TABLE IF NOT EXISTS period_symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES period_cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptom_type VARCHAR(30) NOT NULL CHECK (symptom_type IN (
    'cramps', 'mood_swings', 'bloating', 'headache', 'fatigue', 
    'acne', 'breast_tenderness', 'back_pain', 'nausea', 'other'
  )),
  intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  symptom_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create period_predictions table (calculated predictions)
CREATE TABLE IF NOT EXISTS period_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  next_expected_date DATE NOT NULL,
  confidence_level VARCHAR(10) NOT NULL CHECK (confidence_level IN ('low', 'medium', 'high')),
  average_cycle_length NUMERIC(5,2) NOT NULL,
  cycle_regularity VARCHAR(10) NOT NULL CHECK (cycle_regularity IN ('regular', 'irregular', 'unknown')),
  calculation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id) -- Only one active prediction per user
);

-- =============================================
-- INDEXES for performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_period_cycles_user_id ON period_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_period_cycles_expected_date ON period_cycles(expected_start_date);
CREATE INDEX IF NOT EXISTS idx_period_cycles_status ON period_cycles(status);
CREATE INDEX IF NOT EXISTS idx_period_symptoms_cycle_id ON period_symptoms(cycle_id);
CREATE INDEX IF NOT EXISTS idx_period_symptoms_user_date ON period_symptoms(user_id, symptom_date);
CREATE INDEX IF NOT EXISTS idx_period_predictions_user_id ON period_predictions(user_id);

-- =============================================
-- RLS POLICIES for security
-- =============================================

-- Enable RLS
ALTER TABLE period_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_predictions ENABLE ROW LEVEL SECURITY;

-- Period cycles policies
CREATE POLICY "Users can manage own period cycles" ON period_cycles
  FOR ALL USING (auth.uid() = user_id);

-- Period symptoms policies  
CREATE POLICY "Users can manage own period symptoms" ON period_symptoms
  FOR ALL USING (auth.uid() = user_id);

-- Period predictions policies
CREATE POLICY "Users can view own period predictions" ON period_predictions
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS for period tracking
-- =============================================

-- Function to confirm period start
CREATE OR REPLACE FUNCTION confirm_period_start(
  p_user_id UUID,
  p_cycle_id UUID,
  p_actual_start_date DATE,
  p_flow_intensity VARCHAR DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_expected_date DATE;
  v_days_difference INTEGER;
  v_status VARCHAR(20);
  v_cycle_number INTEGER;
  v_previous_cycle_start DATE;
  v_cycle_length INTEGER;
BEGIN
  -- Get expected date and cycle info
  SELECT expected_start_date, cycle_number 
  INTO v_expected_date, v_cycle_number
  FROM period_cycles 
  WHERE id = p_cycle_id AND user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cycle not found or access denied';
  END IF;
  
  -- Calculate difference in days
  v_days_difference := p_actual_start_date - v_expected_date;
  
  -- Determine status
  IF v_days_difference = 0 THEN
    v_status := 'on_time';
  ELSIF v_days_difference < 0 THEN
    v_status := 'early';
  ELSE
    v_status := 'late';
  END IF;
  
  -- Get previous cycle start date to calculate cycle length
  SELECT actual_start_date INTO v_previous_cycle_start
  FROM period_cycles 
  WHERE user_id = p_user_id 
    AND cycle_number = v_cycle_number - 1
    AND actual_start_date IS NOT NULL;
  
  IF v_previous_cycle_start IS NOT NULL THEN
    v_cycle_length := p_actual_start_date - v_previous_cycle_start;
  END IF;
  
  -- Update the cycle
  UPDATE period_cycles SET
    actual_start_date = p_actual_start_date,
    status = v_status,
    days_late = v_days_difference,
    flow_intensity = p_flow_intensity,
    cycle_length = v_cycle_length,
    notes = p_notes,
    updated_at = NOW()
  WHERE id = p_cycle_id;
  
  -- Update predictions
  PERFORM update_period_predictions(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update period predictions
CREATE OR REPLACE FUNCTION update_period_predictions(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_cycles_data RECORD;
  v_avg_length NUMERIC;
  v_confidence VARCHAR(10);
  v_regularity VARCHAR(10);
  v_next_date DATE;
  v_latest_start DATE;
  v_cycle_lengths INTEGER[];
  v_length_variance NUMERIC;
BEGIN
  -- Get last 6 cycles with actual start dates
  SELECT 
    array_agg(cycle_length ORDER BY cycle_number DESC) as lengths,
    avg(cycle_length) as avg_length,
    variance(cycle_length) as length_variance,
    max(actual_start_date) as latest_start,
    count(*) as cycle_count
  INTO v_cycles_data
  FROM period_cycles 
  WHERE user_id = p_user_id 
    AND actual_start_date IS NOT NULL 
    AND cycle_length IS NOT NULL
    AND cycle_number > (
      SELECT COALESCE(MAX(cycle_number), 0) - 6 
      FROM period_cycles 
      WHERE user_id = p_user_id
    );
  
  IF v_cycles_data.cycle_count < 2 THEN
    -- Not enough data for prediction
    v_avg_length := 28; -- Default
    v_confidence := 'low';
    v_regularity := 'unknown';
  ELSE
    v_avg_length := v_cycles_data.avg_length;
    v_cycle_lengths := v_cycles_data.lengths;
    v_length_variance := v_cycles_data.length_variance;
    
    -- Determine confidence and regularity
    IF v_length_variance IS NULL OR v_length_variance < 4 THEN
      v_confidence := 'high';
      v_regularity := 'regular';
    ELSIF v_length_variance < 16 THEN
      v_confidence := 'medium';
      v_regularity := 'regular';
    ELSE
      v_confidence := 'low';
      v_regularity := 'irregular';
    END IF;
  END IF;
  
  -- Calculate next expected date
  IF v_cycles_data.latest_start IS NOT NULL THEN
    v_next_date := v_cycles_data.latest_start + INTERVAL '1 day' * v_avg_length;
  ELSE
    -- Fallback to today + average length
    v_next_date := CURRENT_DATE + INTERVAL '1 day' * v_avg_length;
  END IF;
  
  -- Upsert prediction
  INSERT INTO period_predictions (
    user_id, 
    next_expected_date, 
    confidence_level, 
    average_cycle_length, 
    cycle_regularity
  ) VALUES (
    p_user_id, 
    v_next_date::date, 
    v_confidence, 
    v_avg_length, 
    v_regularity
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    next_expected_date = EXCLUDED.next_expected_date,
    confidence_level = EXCLUDED.confidence_level,
    average_cycle_length = EXCLUDED.average_cycle_length,
    cycle_regularity = EXCLUDED.cycle_regularity,
    calculation_date = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create next predicted cycle
CREATE OR REPLACE FUNCTION create_next_cycle_prediction(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_next_cycle_number INTEGER;
  v_prediction RECORD;
  v_new_cycle_id UUID;
BEGIN
  -- Get next cycle number
  SELECT COALESCE(MAX(cycle_number), 0) + 1 
  INTO v_next_cycle_number
  FROM period_cycles 
  WHERE user_id = p_user_id;
  
  -- Get current prediction
  SELECT * INTO v_prediction
  FROM period_predictions 
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Create initial prediction
    PERFORM update_period_predictions(p_user_id);
    SELECT * INTO v_prediction FROM period_predictions WHERE user_id = p_user_id;
  END IF;
  
  -- Create new predicted cycle
  INSERT INTO period_cycles (
    user_id,
    cycle_number,
    expected_start_date,
    status
  ) VALUES (
    p_user_id,
    v_next_cycle_number,
    v_prediction.next_expected_date,
    'predicted'
  ) RETURNING id INTO v_new_cycle_id;
  
  RETURN v_new_cycle_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get period stats
CREATE OR REPLACE FUNCTION get_period_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'total_cycles_tracked', COUNT(*) FILTER (WHERE actual_start_date IS NOT NULL),
    'average_cycle_length', COALESCE(AVG(cycle_length), 28),
    'shortest_cycle', COALESCE(MIN(cycle_length), 0),
    'longest_cycle', COALESCE(MAX(cycle_length), 0),
    'on_time_percentage', 
      ROUND(COUNT(*) FILTER (WHERE status = 'on_time') * 100.0 / 
            NULLIF(COUNT(*) FILTER (WHERE actual_start_date IS NOT NULL), 0), 1),
    'early_percentage',
      ROUND(COUNT(*) FILTER (WHERE status = 'early') * 100.0 / 
            NULLIF(COUNT(*) FILTER (WHERE actual_start_date IS NOT NULL), 0), 1),
    'late_percentage', 
      ROUND(COUNT(*) FILTER (WHERE status = 'late') * 100.0 / 
            NULLIF(COUNT(*) FILTER (WHERE actual_start_date IS NOT NULL), 0), 1),
    'average_days_late',
      COALESCE(AVG(days_late) FILTER (WHERE status = 'late'), 0)
  )
  INTO v_stats
  FROM period_cycles
  WHERE user_id = p_user_id;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Update period_cycles updated_at timestamp
CREATE OR REPLACE FUNCTION update_period_cycles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_period_cycles_updated_at
  BEFORE UPDATE ON period_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_period_cycles_updated_at();