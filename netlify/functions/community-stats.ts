// netlify/functions/community-stats.ts
//
// Today's real community activity for the Komunita "Dnes v komunite"
// line (Sam 2026-10-05): distinct women who completed a workout,
// checked a habit, or finished a meditation since Slovak midnight.
// The client adds these on top of a small visual baseline.

import { requireUser, serviceClient } from './_userAuth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: CORS,
  body: JSON.stringify(body),
});

// Start of "today" in Europe/Bratislava, DST-correct.
function skDayStartISO(): string {
  const now = new Date();
  const skDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bratislava' }).format(now);
  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Bratislava',
    timeZoneName: 'longOffset',
  })
    .formatToParts(now)
    .find((p) => p.type === 'timeZoneName')?.value?.replace('GMT', '') || '+01:00';
  return `${skDate}T00:00:00${offset}`;
}

export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  const auth = await requireUser(event.headers?.authorization ?? event.headers?.Authorization);
  if (!auth.ok) return json(auth.status, { error: auth.error });

  const supabase = serviceClient();
  const { data, error } = await supabase
    .from('points_ledger')
    .select('user_id, event_type')
    .in('event_type', ['workout_completed', 'habit_checkin', 'meditation_completed'])
    .gte('created_at', skDayStartISO())
    .limit(10000);

  if (error) return json(500, { error: error.message });

  const distinct = (type: string) =>
    new Set((data ?? []).filter((r) => r.event_type === type).map((r) => r.user_id)).size;

  return json(200, {
    workouts: distinct('workout_completed'),
    habits: distinct('habit_checkin'),
    meditations: distinct('meditation_completed'),
  });
}
