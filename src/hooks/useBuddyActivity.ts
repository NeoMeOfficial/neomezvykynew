// Activity types that can be logged
export type ActivityType = 'workout' | 'habit' | 'meditation' | 'recipe';

export interface BuddyActivity {
  id: string;
  userId: string;       // who did it
  userName: string;     // display name
  type: ActivityType;
  label: string;        // e.g. "BodyForming - Deň 8" or "Pitný režim"
  completedAt: string;  // ISO timestamp
}

const ACTIVITY_KEY = 'neome-buddy-activity';

export function useBuddyActivity() {
  // Log an activity (called when user completes workout/habit/meditation)
  const logActivity = (type: ActivityType, label: string, userName: string = 'Ty') => {
    const existing = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]') as BuddyActivity[];
    const newActivity: BuddyActivity = {
      id: crypto.randomUUID(),
      userId: 'current-user',
      userName,
      type,
      label,
      completedAt: new Date().toISOString(),
    };
    // Keep last 50 activities
    const updated = [newActivity, ...existing].slice(0, 50);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
  };

  // Get all activities (own + simulated buddy activities for demo)
  const getActivities = (): BuddyActivity[] => {
    const own = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]') as BuddyActivity[];

    // Demo buddy activities so the feed isn't empty for new users
    const demoActivities: BuddyActivity[] = [
      {
        id: 'demo-1',
        userId: 'buddy-1',
        userName: 'Elena S.',
        type: 'workout',
        label: 'BodyForming - Deň 12',
        completedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-2',
        userId: 'buddy-2',
        userName: 'Katka M.',
        type: 'meditation',
        label: 'Ranná meditácia',
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-3',
        userId: 'buddy-1',
        userName: 'Elena S.',
        type: 'habit',
        label: 'Pitný režim',
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-4',
        userId: 'buddy-3',
        userName: 'Zuzka P.',
        type: 'recipe',
        label: 'Buddha Bowl',
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Merge own + demo, sort by time descending
    return [...own, ...demoActivities].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  };

  return { logActivity, getActivities };
}
