import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Points ledger — F-017
 *
 * Source of truth for the "bodov" balance shown on PointsSummary,
 * PointsRewards and Profil. Distinct from useReferral.credits which
 * tracks EUR-cents monetary credit.
 *
 * Demo fallback: localStorage-backed mock when no auth user, mirroring
 * useReferral's pattern.
 */

export type PointsEvent =
  | 'workout_completed'
  | 'program_completed'
  | 'post_published'
  | 'comment_published'
  | 'heart_received'
  | 'journal_entry'
  | 'referral_approved'
  | 'reward_redeemed';

export interface LedgerEntry {
  id: string;
  user_id: string;
  event_type: PointsEvent | string;
  points: number;
  ref_id: string | null;
  ref_type: string | null;
  created_at: string;
}

export interface Milestone {
  threshold: number;
  reward_name: string;
  reward_slug: string;
}

export interface BadgeRow {
  slug: string;
  name: string;
  description: string | null;
  icon_key: string;
  color_token: string;
  threshold_type: string | null;
  threshold_value: number | null;
  sort_order: number;
}

export interface UserBadgeRow extends BadgeRow {
  awarded_at: string | null;
  earned: boolean;
}

const DEMO_LEDGER_KEY = 'neome_points_ledger';

function loadDemoLedger(): LedgerEntry[] {
  const raw = localStorage.getItem(DEMO_LEDGER_KEY);
  if (raw) return JSON.parse(raw);
  const seed: LedgerEntry[] = [
    { id: 'd1', user_id: 'demo', event_type: 'post_published',     points: 10,  ref_id: null, ref_type: 'post',    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'd2', user_id: 'demo', event_type: 'comment_published',  points: 5,   ref_id: null, ref_type: 'comment', created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
    { id: 'd3', user_id: 'demo', event_type: 'program_completed',  points: 50,  ref_id: null, ref_type: 'program', created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
    { id: 'd4', user_id: 'demo', event_type: 'reward_redeemed',    points: -100, ref_id: 'partner-yoga', ref_type: 'reward', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString() },
  ];
  localStorage.setItem(DEMO_LEDGER_KEY, JSON.stringify(seed));
  return seed;
}

function saveDemoLedger(rows: LedgerEntry[]) {
  localStorage.setItem(DEMO_LEDGER_KEY, JSON.stringify(rows));
}

export function usePointsLedger() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const isRealUser = !!user?.id && user.id !== 'demo-user-id';

  const refresh = useCallback(async () => {
    if (!isRealUser) {
      setEntries(loadDemoLedger());
      setIsDemo(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('points_ledger')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (error || !data) {
      // Fall back to demo so UI never blanks
      setEntries(loadDemoLedger());
      setIsDemo(true);
    } else {
      setEntries(data as LedgerEntry[]);
      setIsDemo(false);
    }
    setLoading(false);
  }, [isRealUser, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEntry = useCallback(
    async (eventType: PointsEvent, points: number, refId?: string, refType?: string) => {
      if (isDemo || !isRealUser) {
        const next: LedgerEntry = {
          id: crypto.randomUUID(),
          user_id: user?.id ?? 'demo',
          event_type: eventType,
          points,
          ref_id: refId ?? null,
          ref_type: refType ?? null,
          created_at: new Date().toISOString(),
        };
        const updated = [next, ...entries];
        setEntries(updated);
        saveDemoLedger(updated);
        return;
      }
      // Idempotency: if ref_id+ref_type already exists for this user+event, skip
      if (refId && refType) {
        const { data: existing } = await supabase
          .from('points_ledger')
          .select('id')
          .eq('user_id', user!.id)
          .eq('event_type', eventType)
          .eq('ref_id', refId)
          .eq('ref_type', refType)
          .limit(1);
        if (existing && existing.length > 0) return;
      }
      const { error } = await supabase.from('points_ledger').insert({
        user_id: user!.id,
        event_type: eventType,
        points,
        ref_id: refId ?? null,
        ref_type: refType ?? null,
      });
      if (!error) refresh();
    },
    [entries, isDemo, isRealUser, refresh, user],
  );

  const balance = entries.reduce((sum, e) => sum + (e.points || 0), 0);

  return { entries, balance, loading, isDemo, addEntry, refresh };
}

/**
 * useNextMilestone — F-018
 *
 * Returns the lowest milestone strictly above the user's balance,
 * or null when the user has surpassed every active milestone.
 */
export function useNextMilestone(balance: number) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('point_milestones')
        .select('threshold, reward_name, reward_slug')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (!cancelled && data) setMilestones(data as Milestone[]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hardcoded fallback — keeps PointsSummary functional pre-migration.
  const fallback: Milestone[] = [
    { threshold: 80,  reward_name: 'Partnerská zľava · recepty',     reward_slug: 'partner-recipes' },
    { threshold: 100, reward_name: 'Partnerská zľava · jóga štúdio', reward_slug: 'partner-yoga' },
    { threshold: 150, reward_name: '15% na ďalšiu platbu Plus',      reward_slug: 'plus-15' },
    { threshold: 250, reward_name: '20% zľava na jedálniček',        reward_slug: 'mealplan-20' },
    { threshold: 500, reward_name: 'Mesiac Plus zdarma',             reward_slug: 'plus-month' },
  ];
  const list = milestones.length > 0 ? milestones : fallback;
  const next = list.find((m) => m.threshold > balance) ?? null;
  if (!next) return null;
  const remaining = Math.max(0, next.threshold - balance);
  const pct = Math.min(100, Math.round((balance / next.threshold) * 100));
  return { name: next.reward_name, cost: next.threshold, slug: next.reward_slug, remaining, pct };
}

/**
 * useUserBadges — F-019
 *
 * Returns the full badge catalog with `earned` resolved against the
 * current user's user_badges rows.
 */
export function useUserBadges() {
  const { user } = useAuth();
  const [rows, setRows] = useState<UserBadgeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const isRealUser = !!user?.id && user.id !== 'demo-user-id';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: badges } = await supabase
        .from('badges')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      let earned = new Map<string, string>();
      if (isRealUser && badges && badges.length > 0) {
        const { data: ub } = await supabase
          .from('user_badges')
          .select('badge_slug, awarded_at')
          .eq('user_id', user!.id);
        if (ub) earned = new Map(ub.map((r) => [r.badge_slug, r.awarded_at]));
      } else {
        // Demo fallback: mark first three as earned
        ['first-post', 'week-streak', 'first-month'].forEach((s) => earned.set(s, new Date().toISOString()));
      }

      const fallbackBadges: BadgeRow[] = [
        { slug: 'first-post',  name: 'Prvý príspevok', description: null, icon_key: 'star', color_token: 'TERRA', threshold_type: null, threshold_value: null, sort_order: 1 },
        { slug: 'week-streak', name: 'Týždeň v rade',  description: null, icon_key: 'star', color_token: 'SAGE',  threshold_type: null, threshold_value: null, sort_order: 2 },
        { slug: 'first-month', name: 'Prvý mesiac',    description: null, icon_key: 'star', color_token: 'DUSTY', threshold_type: null, threshold_value: null, sort_order: 3 },
        { slug: '50-comments', name: '50 komentárov',  description: null, icon_key: 'star', color_token: 'MAUVE', threshold_type: null, threshold_value: null, sort_order: 4 },
        { slug: 'year',        name: 'Rok s NeoMe',    description: null, icon_key: 'star', color_token: 'GOLD',  threshold_type: null, threshold_value: null, sort_order: 5 },
      ];
      const catalog: BadgeRow[] = (badges as BadgeRow[] | null) ?? fallbackBadges;

      const out: UserBadgeRow[] = catalog.map((b) => ({
        ...b,
        awarded_at: earned.get(b.slug) ?? null,
        earned: earned.has(b.slug),
      }));
      if (!cancelled) {
        setRows(out);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isRealUser, user]);

  return { badges: rows, loading };
}
