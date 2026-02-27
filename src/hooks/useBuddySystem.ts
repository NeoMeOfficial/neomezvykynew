import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { BuddyCode, BuddyRequest, BuddyConnection, BuddyNotification } from '../types/buddy';

// Generate a random 6-character buddy code
const generateBuddyCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'; // Excluding I, O to avoid confusion
  let code = 'NM'; // Prefix with NeoMe
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export function useBuddySystem() {
  const { user } = useAuthContext();
  const [myBuddyCode, setMyBuddyCode] = useState<BuddyCode | null>(null);
  const [buddyConnections, setBuddyConnections] = useState<BuddyConnection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<BuddyRequest[]>([]);
  const [buddyNotifications, setBuddyNotifications] = useState<BuddyNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user's buddy data from localStorage
  useEffect(() => {
    if (!user?.id) {
      // Demo/guest mode - set empty defaults
      setMyBuddyCode(null);
      setBuddyConnections([]);
      setPendingRequests([]);
      setBuddyNotifications([]);
      return;
    }

    const codeKey = `neome_buddy_code_${user.id}`;
    const connectionsKey = `neome_buddy_connections_${user.id}`;
    const requestsKey = `neome_buddy_requests_${user.id}`;
    const notificationsKey = `neome_buddy_notifications_${user.id}`;

    // Load buddy code
    const storedCode = localStorage.getItem(codeKey);
    if (storedCode) {
      try {
        setMyBuddyCode(JSON.parse(storedCode));
      } catch (e) {
        console.error('Failed to parse buddy code', e);
      }
    }

    // Load connections
    const storedConnections = localStorage.getItem(connectionsKey);
    if (storedConnections) {
      try {
        setBuddyConnections(JSON.parse(storedConnections));
      } catch (e) {
        console.error('Failed to parse buddy connections', e);
      }
    }

    // Load requests
    const storedRequests = localStorage.getItem(requestsKey);
    if (storedRequests) {
      try {
        setPendingRequests(JSON.parse(storedRequests));
      } catch (e) {
        console.error('Failed to parse buddy requests', e);
      }
    }

    // Load notifications
    const storedNotifications = localStorage.getItem(notificationsKey);
    if (storedNotifications) {
      try {
        setBuddyNotifications(JSON.parse(storedNotifications));
      } catch (e) {
        console.error('Failed to parse buddy notifications', e);
      }
    }
  }, [user?.id]);

  // Save data to localStorage
  const saveToStorage = useCallback((
    code: BuddyCode | null,
    connections: BuddyConnection[],
    requests: BuddyRequest[],
    notifications: BuddyNotification[]
  ) => {
    if (!user?.id) return;

    const codeKey = `neome_buddy_code_${user.id}`;
    const connectionsKey = `neome_buddy_connections_${user.id}`;
    const requestsKey = `neome_buddy_requests_${user.id}`;
    const notificationsKey = `neome_buddy_notifications_${user.id}`;

    if (code) {
      localStorage.setItem(codeKey, JSON.stringify(code));
    }
    localStorage.setItem(connectionsKey, JSON.stringify(connections));
    localStorage.setItem(requestsKey, JSON.stringify(requests));
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));
  }, [user?.id]);

  // Generate or get user's buddy code
  const getMyBuddyCode = useCallback(async (): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    if (myBuddyCode && myBuddyCode.active) {
      return myBuddyCode.code;
    }

    // Generate new code
    let newCode: string;
    let attempts = 0;
    do {
      newCode = generateBuddyCode();
      attempts++;
    } while (attempts < 10); // Basic collision avoidance

    const buddyCode: BuddyCode = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      code: newCode,
      active: true,
      createdAt: new Date().toISOString()
    };

    setMyBuddyCode(buddyCode);
    saveToStorage(buddyCode, buddyConnections, pendingRequests, buddyNotifications);
    
    return newCode;
  }, [user?.id, myBuddyCode, buddyConnections, pendingRequests, buddyNotifications, saveToStorage]);

  // Send buddy request by code
  const sendBuddyRequest = useCallback(async (buddyCode: string): Promise<boolean> => {
    if (!user?.id || isLoading) return false;

    setIsLoading(true);

    try {
      // In a real app, this would be an API call to find the user by code
      // For demo purposes, we'll simulate finding users
      const mockUsers = [
        { id: 'user_2', name: 'Petra Novotná' },
        { id: 'user_3', name: 'Mária Kováčová' },
        { id: 'user_4', name: 'Anna Svoboda' },
        { id: 'user_5', name: 'Katka Horáková' }
      ];

      // Simulate code lookup (in real app, this would query the backend)
      const targetUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

      // Check if already connected
      const existingConnection = buddyConnections.find(c => 
        c.user1Id === targetUser.id || c.user2Id === targetUser.id
      );

      if (existingConnection) {
        setIsLoading(false);
        throw new Error('Už ste spojení s týmto používateľom');
      }

      // Check if request already exists
      const existingRequest = pendingRequests.find(r => 
        (r.requesterId === user.id && r.targetId === targetUser.id) ||
        (r.requesterId === targetUser.id && r.targetId === user.id)
      );

      if (existingRequest) {
        setIsLoading(false);
        throw new Error('Žiadosť už bola odoslaná');
      }

      // Create buddy request
      const request: BuddyRequest = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        requesterId: user.id,
        targetId: targetUser.id,
        requesterName: user.email?.split('@')[0] || 'Používateľ',
        targetName: targetUser.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // For demo, auto-accept after 2 seconds
      setTimeout(() => {
        acceptBuddyRequest(request.id);
      }, 2000);

      const newRequests = [...pendingRequests, request];
      setPendingRequests(newRequests);
      saveToStorage(myBuddyCode, buddyConnections, newRequests, buddyNotifications);

      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [user?.id, isLoading, buddyConnections, pendingRequests, myBuddyCode, buddyNotifications, saveToStorage]);

  // Accept buddy request
  const acceptBuddyRequest = useCallback(async (requestId: string): Promise<boolean> => {
    if (!user?.id) return false;

    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return false;

    // Create buddy connection
    const connection: BuddyConnection = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user1Id: request.requesterId,
      user2Id: request.targetId,
      user1Name: request.requesterName,
      user2Name: request.targetName,
      connectedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString()
    };

    // Update request status
    const updatedRequests = pendingRequests.map(r =>
      r.id === requestId ? { ...r, status: 'accepted' as const, respondedAt: new Date().toISOString() } : r
    );

    // Remove accepted request from pending
    const newRequests = updatedRequests.filter(r => r.status === 'pending');
    const newConnections = [...buddyConnections, connection];

    setBuddyConnections(newConnections);
    setPendingRequests(newRequests);
    saveToStorage(myBuddyCode, newConnections, newRequests, buddyNotifications);

    return true;
  }, [user?.id, pendingRequests, buddyConnections, myBuddyCode, buddyNotifications, saveToStorage]);

  // Reject buddy request
  const rejectBuddyRequest = useCallback(async (requestId: string): Promise<boolean> => {
    if (!user?.id) return false;

    const updatedRequests = pendingRequests.filter(r => r.id !== requestId);
    setPendingRequests(updatedRequests);
    saveToStorage(myBuddyCode, buddyConnections, updatedRequests, buddyNotifications);

    return true;
  }, [user?.id, pendingRequests, myBuddyCode, buddyConnections, buddyNotifications, saveToStorage]);

  // Send notification to buddy
  const notifyBuddy = useCallback(async (
    type: BuddyNotification['type'],
    message: string,
    metadata?: any
  ) => {
    if (!user?.id || buddyConnections.length === 0) return;

    // Create notifications for all buddies
    const newNotifications: BuddyNotification[] = [];

    buddyConnections.forEach(connection => {
      const notification: BuddyNotification = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        connectionId: connection.id,
        fromUserId: user.id,
        fromUserName: user.email?.split('@')[0] || 'Tvoj buddy',
        type,
        message,
        metadata,
        timestamp: new Date().toISOString(),
        seen: false
      };
      newNotifications.push(notification);
    });

    // In a real app, these would be sent to the buddy's device/account
    // For demo, we'll just log them
    console.log('Buddy notifications sent:', newNotifications);

  }, [user?.id, buddyConnections]);

  // Mark notifications as seen
  const markNotificationsSeen = useCallback((notificationIds: string[]) => {
    const updatedNotifications = buddyNotifications.map(n =>
      notificationIds.includes(n.id) ? { ...n, seen: true } : n
    );
    setBuddyNotifications(updatedNotifications);
    saveToStorage(myBuddyCode, buddyConnections, pendingRequests, updatedNotifications);
  }, [buddyNotifications, myBuddyCode, buddyConnections, pendingRequests, saveToStorage]);

  // Get unread notifications count
  const getUnreadCount = useCallback((): number => {
    return buddyNotifications.filter(n => !n.seen).length;
  }, [buddyNotifications]);

  return {
    // State
    myBuddyCode: myBuddyCode?.code || null,
    buddyConnections,
    pendingRequests: pendingRequests.filter(r => r.status === 'pending'),
    buddyNotifications,
    isLoading,

    // Actions
    getMyBuddyCode,
    sendBuddyRequest,
    acceptBuddyRequest,
    rejectBuddyRequest,
    notifyBuddy,
    markNotificationsSeen,

    // Utils
    getUnreadCount,
    hasBuddies: buddyConnections.length > 0,
    
    // Stats
    stats: {
      totalBuddies: buddyConnections.length,
      pendingRequestsCount: pendingRequests.filter(r => r.status === 'pending').length,
      unreadNotifications: getUnreadCount()
    }
  };
}