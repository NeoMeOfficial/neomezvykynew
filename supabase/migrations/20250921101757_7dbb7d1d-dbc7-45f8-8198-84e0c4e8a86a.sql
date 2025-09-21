-- Create cycle_data table for storing menstrual cycle information
CREATE TABLE public.cycle_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_code VARCHAR NOT NULL,
  last_period_start DATE,
  cycle_length INTEGER NOT NULL DEFAULT 28,
  period_length INTEGER NOT NULL DEFAULT 5,
  custom_settings JSONB NOT NULL DEFAULT '{"notifications": true, "symptomTracking": false, "moodTracking": true, "notes": ""}'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(access_code)
);

-- Enable Row Level Security
ALTER TABLE public.cycle_data ENABLE ROW LEVEL SECURITY;

-- Create policies for access code based access
CREATE POLICY "Access code holders can view cycle data" 
ON public.cycle_data 
FOR SELECT 
USING (access_code IS NOT NULL);

CREATE POLICY "Access code holders can create cycle data" 
ON public.cycle_data 
FOR INSERT 
WITH CHECK (access_code IS NOT NULL);

CREATE POLICY "Access code holders can update their cycle data" 
ON public.cycle_data 
FOR UPDATE 
USING (access_code IS NOT NULL);

CREATE POLICY "Access code holders can delete their cycle data" 
ON public.cycle_data 
FOR DELETE 
USING (access_code IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cycle_data_updated_at
BEFORE UPDATE ON public.cycle_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for this table
ALTER TABLE public.cycle_data REPLICA IDENTITY FULL;
INSERT INTO supabase_realtime.subscription (subscription_id, entity) VALUES (gen_random_uuid(), 'public.cycle_data') ON CONFLICT DO NOTHING;