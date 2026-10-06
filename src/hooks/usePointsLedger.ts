import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { awardPoints, AwardEvent, POINTS_AWARDED_EVENT } from '../lib/points';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

/**
 * Points ledger — F-017
 *
 * Source of truth for the "bodov" balance shown on PointsSummary,
 * PointsRewards and Profil. Distinct from useReferral.credits which
 * tracks EUR-cents monetary credit.
 *
 * Earning goes through the award-points Netlify function — the server
 * owns values, dedupe and caps (points buy real Stripe coupons, so the
 * client is never trusted with an amount). points_ledger has no INSERT
 * policy for end users; direct inserts bounce off RLS by design.
 */

export type PointsEvent = AwardEvent | 'referral_sub' | 'referral_approved' | 'reward_redeemed' | string;

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

const DEMO_LEDGER_KEY = 'neome_points_ledger_v2';
const LEDGER_CACHE_PREFIX = 'neome_points_cache_';

function loadLedgerCache(userId: string): LedgerEntry[] | null {
  try {
    const raw = localStorage.getItem(LEDGER_CACHE_PREFIX + userId);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveLedgerCache(userId: string, entries: LedgerEntry[]) {
  try { localStorage.setItem(LEDGER_CACHE_PREFIX + userId, JSON.stringify(entries)); } catch { /* ignore */ }
}

function loadDemoLedger(): LedgerEntry[] {
  try {
    const raw = localStorage.getItem(DEMO_LEDGER_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export function usePointsLedger() {
  const { user } = useSupabaseAuth();
  const cachedInit = user?.id ? loadLedgerCache(user.id) : null;
  const [entries, setEntries] = useState<LedgerEntry[]>(cachedInit ?? []);
  const [loading, setLoading] = useState(cachedInit == null);
  const [isDemo, setIsDemo] = useState(false);

  const isRealUser = !!user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);

  const refresh = useCallback(async () => {
    if (!isRealUser) {
      setEntries(loadDemoLedger());
      setIsDemo(true);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('points_ledger')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (error || !data) {
      // Show an honest empty state — the demo ledger must never leak
      // into a real account's balance.
      console.warn('points_ledger fetch failed:', error?.message);
      setEntries([]);
      setIsDemo(false);
    } else {
      setEntries(data as LedgerEntry[]);
      setIsDemo(false);
      if (user?.id) saveLedgerCache(user.id, data as LedgerEntry[]);
    }
    setLoading(false);
  }, [isRealUser, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Ask the server to award points for an event it recognises. Returns
  // the points actually granted (0 = deduped / capped / demo session).
  const award = useCallback(
    async (eventType: AwardEvent, refId?: string): Promise<number> => {
      if (!isRealUser) return 0;
      const got = await awardPoints(eventType, refId);
      if (got > 0) refresh();
      return got;
    },
    [isRealUser, refresh],
  );

  // Awards fired outside this hook instance (lib/points dispatches on
  // every success) refresh the balance everywhere it is displayed.
  useEffect(() => {
    const onAward = () => refresh();
    window.addEventListener(POINTS_AWARDED_EVENT, onAward);
    return () => window.removeEventListener(POINTS_AWARDED_EVENT, onAward);
  }, [refresh]);

  const balance = entries.reduce((sum, e) => sum + (e.points || 0), 0);

  return { entries, balance, loading, isDemo, award, refresh };
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
  const { user } = useSupabaseAuth();
  const [rows, setRows] = useState<UserBadgeRow[]>([]);
  const [loading, setLoading] = useState(true);

  const isRealUser = !!user?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);

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
