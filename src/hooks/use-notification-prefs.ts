import { useState, useCallback } from 'react';

/**
 * Adapter for the new Settings · Notifications screen.
 *
 * For the trial batch we ship a localStorage-backed implementation.
 * Subsequent waves wire this to the real backend (POST /api/me/notification-prefs).
 */
export interface NotificationPrefs {
  morning: boolean;
  evening: boolean;
  cyclePhase: boolean;
  cyclePeriod: boolean;
  communityReactions: boolean;
  communityReplies: boolean;
  communityDigest: boolean;
}

const STORAGE_KEY = 'neome-notification-prefs';

const DEFAULTS: NotificationPrefs = {
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
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useNotificationPrefs() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadPrefs);

  const update = useCallback((patch: Partial<NotificationPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* swallow */
      }
      return next;
    });
  }, []);

  return { prefs, update };
}
