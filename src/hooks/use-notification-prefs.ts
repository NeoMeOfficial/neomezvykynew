import { useState, useCallback } from 'react';

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

  const update = useCallback((patch: Partial<NotificationPrefs>) => {
    setPrefs(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { prefs, update };
}
