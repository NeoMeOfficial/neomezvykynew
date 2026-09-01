-- The cycle_data table silently dropped the recorded period end and the
-- learned bleed lengths (client-side fields added 2026-08+): saves omitted
-- them and every app restart re-hydrated the stripped remote row over
-- localStorage, reverting Gabi's period-end corrections. Add the columns
-- so the full cycle state round-trips.

alter table public.cycle_data
  add column if not exists current_period_end date,
  add column if not exists bleed_lengths integer[];
