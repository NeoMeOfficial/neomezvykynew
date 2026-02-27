export interface BuddyCode {
  id: string;
  userId: string;
  code: string; // 6-digit code like "NM4K7X"
  active: boolean;
  createdAt: string;
}

export interface BuddyRequest {
  id: string;
  requesterId: string;
  targetId: string;
  requesterName: string;
  targetName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
}

export interface BuddyConnection {
  id: string;
  user1Id: string;
  user2Id: string;
  user1Name: string;
  user2Name: string;
  connectedAt: string;
  lastActivityAt: string;
}

export interface BuddyNotification {
  id: string;
  connectionId: string;
  fromUserId: string;
  fromUserName: string;
  type: 'workout_complete' | 'achievement_earned' | 'streak_milestone' | 'water_goal' | 'habit_complete';
  message: string;
  metadata?: any;
  timestamp: string;
  seen: boolean;
}

export interface BuddyActivity {
  id: string;
  userId: string;
  userName: string;
  type: string;
  message: string;
  timestamp: string;
  metadata?: any;
}