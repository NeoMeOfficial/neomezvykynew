-- Insert the test access code that can be used unlimited times
INSERT INTO public.access_codes (code, is_used) 
VALUES ('ABCD12', false)
ON CONFLICT (code) DO NOTHING;