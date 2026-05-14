import { useState, useCallback, useEffect, useRef } from 'react';
import { syncToSupabase, loadFromSupabase } from '../features/supabaseSync';

export interface NotificationPrefs {
  morning: boolean;
  evening: boolean;
  cyclePhase: boolean;
  cyclePeriod: boolean;
  communityReactions: boolean;
  communityReplies: boolean;
  communityDigest: boolean;
}

const STORAGE_KEY = 'neome_notification_prefs';
const SUPABASE_KEY = 'notification_prefs';

const DEFAULT_PREFS: NotificationPrefs = {
  morning: true,
  evening: false,
  cyclePhase: true,
  cyclePeriod: true,
  communityReactions: false,
  communityReplies: false,
  communityDigest: false,
};

function loadPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function useNotificationPrefs() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadPrefs);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Hydrate from Supabase in the background — remote wins so toggles set
  // on another device flow back in. Silent no-op in demo / signed-out.
  useEffect(() => {
    loadFromSupabase<NotificationPrefs>(SUPABASE_KEY)
      .then((remote) => {
        if (!remote) return;
        setPrefs((current) => {
          const merged = { ...DEFAULT_PREFS, ...remote };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // ignore quota
          }
          return merged;
        });
      })
      .catch((err) => console.warn('Failed to hydrate notification prefs:', err));
  }, []);

  const update = useCallback((patch: Partial<NotificationPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore quota
      }
      // Debounce Supabase write — toggling several switches in a row
      // should result in a single round-trip.
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        syncToSupabase(SUPABASE_KEY, next);
      }, 500);
      return next;
    });
  }, []);

  return { prefs, update };
}
