import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

export interface Message {
  id: string;
  user_id: string;
  body: string;
  is_from_admin: boolean;
  sender_name: string | null;
  created_at: string;
  read_at: string | null;
}

// ── Demo mode (no Supabase) ───────────────────────────────────────────────────

const DEMO_KEY = 'neome_messages_demo';

function loadDemoMessages(): Message[] {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  // Default welcome message shown in demo mode
  return [
    {
      id: 'demo-0',
      user_id: 'demo',
      body: 'Vitaj v NeoMe! Som Gabi a som tu pre teba. Ak máš akékoľvek otázky ohľadne programu alebo potrebuješ pomoc, napíš mi. 💌',
      is_from_admin: true,
      sender_name: 'Gabi',
      created_at: new Date(Date.now() - 3_600_000).toISOString(),
      read_at: null,
    },
  ];
}

function saveDemoMessages(msgs: Message[]) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(msgs));
}

// ── User-facing hook ──────────────────────────────────────────────────────────

export function useMessages() {
  const { user } = useSupabaseAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setMessages(loadDemoMessages());
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error && data) setMessages(data as Message[]);
    setLoading(false);
  }, [user?.id]);

  // Initial load + poll every 30 s
  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, 30_000);
    return () => clearInterval(timer);
  }, [fetchMessages]);

  const sendMessage = useCallback(async (body: string) => {
    if (!body.trim() || !user?.id) return;
    setSending(true);

    if (!isSupabaseConfigured()) {
      const msg: Message = {
        id: `demo-${Date.now()}`,
        user_id: 'demo',
        body: body.trim(),
        is_from_admin: false,
        sender_name: null,
        created_at: new Date().toISOString(),
        read_at: null,
      };
      const updated = [...loadDemoMessages(), msg];
      saveDemoMessages(updated);
      setMessages(updated);
      setSending(false);
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({ user_id: user.id, body: body.trim(), is_from_admin: false })
      .select()
      .single();

    if (!error && data) setMessages(prev => [...prev, data as Message]);
    setSending(false);
  }, [user?.id]);

  // Mark admin messages as read when user opens the thread
  const markRead = useCallback(async () => {
    if (!user?.id) return;

    if (!isSupabaseConfigured()) {
      const msgs = loadDemoMessages().map(m =>
        m.is_from_admin && !m.read_at ? { ...m, read_at: new Date().toISOString() } : m
      );
      saveDemoMessages(msgs);
      setMessages(msgs);
      return;
    }

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_from_admin', true)
      .is('read_at', null);
  }, [user?.id]);

  const unreadCount = messages.filter(m => m.is_from_admin && !m.read_at).length;

  return { messages, loading, sending, unreadCount, sendMessage, markRead, refetch: fetchMessages };
}

// ── Admin-facing hook (Gabi's inbox) ─────────────────────────────────────────

export interface Conversation {
  user_id: string;
  last_message: string;
  last_time: string;
  unread: number; // messages from user that admin hasn't read
}

export function useAdminMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [thread, setThread] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load conversation list
  const fetchConversations = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // In demo mode, show the demo thread as a single conversation
      const msgs = loadDemoMessages();
      setConversations([
        {
          user_id: 'demo',
          last_message: msgs[msgs.length - 1]?.body ?? '',
          last_time: msgs[msgs.length - 1]?.created_at ?? new Date().toISOString(),
          unread: msgs.filter(m => !m.is_from_admin && !m.read_at).length,
        },
      ]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('messages')
      .select('user_id, body, created_at, is_from_admin, read_at')
      .order('created_at', { ascending: false });

    if (data) {
      const grouped: Record<string, typeof data> = {};
      for (const m of data) {
        if (!grouped[m.user_id]) grouped[m.user_id] = [];
        grouped[m.user_id].push(m);
      }
      setConversations(
        Object.entries(grouped).map(([user_id, msgs]) => ({
          user_id,
          last_message: msgs[0].body,
          last_time: msgs[0].created_at,
          unread: msgs.filter(m => !m.is_from_admin && !m.read_at).length,
        }))
      );
    }
    setLoading(false);
  }, []);

  // Load messages for a specific user thread
  const fetchThread = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      setThread(loadDemoMessages());
      return;
    }

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (data) setThread(data as Message[]);
  }, []);

  // Send a reply as Gabi
  const sendReply = useCallback(async (userId: string, body: string) => {
    if (!body.trim()) return;
    setSending(true);

    if (!isSupabaseConfigured()) {
      const msg: Message = {
        id: `demo-admin-${Date.now()}`,
        user_id: userId,
        body: body.trim(),
        is_from_admin: true,
        sender_name: 'Gabi',
        created_at: new Date().toISOString(),
        read_at: null,
      };
      const updated = [...loadDemoMessages(), msg];
      saveDemoMessages(updated);
      setThread(updated);
      setSending(false);
      await fetchConversations();
      return;
    }

    const { data } = await supabase
      .from('messages')
      .insert({ user_id: userId, body: body.trim(), is_from_admin: true, sender_name: 'Gabi' })
      .select()
      .single();

    if (data) {
      setThread(prev => [...prev, data as Message]);
      await fetchConversations();
    }
    setSending(false);
  }, [fetchConversations]);

  useEffect(() => {
    fetchConversations();
    const timer = setInterval(fetchConversations, 30_000);
    return () => clearInterval(timer);
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedUserId) fetchThread(selectedUserId);
  }, [selectedUserId, fetchThread]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return {
    conversations,
    loading,
    sending,
    selectedUserId,
    setSelectedUserId,
    thread,
    sendReply,
    totalUnread,
    refetch: fetchConversations,
  };
}
