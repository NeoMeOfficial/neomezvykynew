// Client side of the points economy. The server (award-points function)
// owns values, dedupe and caps — the client only names what happened.
// Fire-and-forget by design: a failed award must never break the action
// that triggered it.

import { supabase } from './supabase';

export type AwardEvent =
  | 'workout_completed'
  | 'meditation_completed'
  | 'reflection_write'
  | 'cycle_log'
  | 'habit_checkin'
  | 'post_published'
  | 'community_like'
  | 'program_completed';

export const POINTS_AWARDED_EVENT = 'neome:points-awarded';

/**
 * Returns the points actually awarded (0 when deduped, capped, or the
 * user has no session — demo logins simply don't earn).
 */
export async function awardPoints(event: AwardEvent, refId?: string): Promise<number> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return 0;
    const res = await fetch('/.netlify/functions/award-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ event, refId }),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const awarded: number = data?.awarded ?? 0;
    if (awarded > 0) {
      window.dispatchEvent(new CustomEvent(POINTS_AWARDED_EVENT, { detail: { event, points: awarded } }));
    }
    return awarded;
  } catch {
    return 0;
  }
}
