-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Update the handle_new_user function to parse first/last name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  name_parts TEXT[];
  first_name_val TEXT;
  last_name_val TEXT;
BEGIN
  -- Parse full_name into first and last name
  name_parts := string_to_array(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ');
  first_name_val := COALESCE(name_parts[1], split_part(NEW.email, '@', 1));
  last_name_val := CASE WHEN array_length(name_parts, 1) > 1 THEN name_parts[2] ELSE NULL END;

  INSERT INTO public.profiles (id, email, full_name, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    first_name_val,
    last_name_val
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;