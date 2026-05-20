/**
 * Entitlement — consumption-aware content gating.
 *
 * Distinct module from SubscriptionContext (which owns tier/billing state).
 * See docs/adr/0001-entitlement-separate-from-subscription.md.
 *
 * Free users get a metered quota per content type. Premium users are
 * never gated and never logged. Re-viewing the same content within
 * the window is free (unique dedup on content_id).
 */

/** Content types that have a metered quota. Anything not listed here is ungated. */
export const QUOTAS = {
  recipe:     { limit: 15, windowDays: 30 },
  exercise:   { limit: 2,  windowDays: 7  },
  meditation: { limit: 2,  windowDays: 7  },
  stretch:    { limit: 2,  windowDays: 7  },
} as const;

export type EntitledContent = keyof typeof QUOTAS;

export interface ViewedRow {
  content_id: string;
  viewed_at: string; // ISO timestamp
}

export interface EntitlementResult {
  /** Can the user view this specific content_id right now? */
  allowed: boolean;
  /**
   * How many fresh views are still available in the current window.
   * If the contentId is already in the window's unique set, this is the
   * remaining budget — viewing it again doesn't cost a credit.
   */
  remaining: number;
  /** Is this contentId already a logged view within the current window? */
  alreadyViewed: boolean;
}

/**
 * Pure quota evaluator. Given the rolling-window view history for one
 * (user, content_type) and a candidate contentId, decide if the user
 * is allowed to view it and how many fresh credits remain.
 *
 * - If contentId is already in the window's unique set → allowed (re-view is free).
 * - Else if unique count < limit → allowed, and viewing will burn a credit.
 * - Else → not allowed.
 *
 * Caller is responsible for windowing the input rows (only pass rows with
 * viewed_at > now - windowDays). This function does not look at clock.
 */
export function evaluateEntitlement(
  contentType: EntitledContent,
  contentId: string,
  viewedRowsInWindow: ViewedRow[],
): EntitlementResult {
  const quota = QUOTAS[contentType];
  const uniqueIds = new Set(viewedRowsInWindow.map((r) => r.content_id));
  const alreadyViewed = uniqueIds.has(contentId);

  if (alreadyViewed) {
    return {
      allowed: true,
      remaining: Math.max(0, quota.limit - uniqueIds.size),
      alreadyViewed: true,
    };
  }

  const wouldBe = uniqueIds.size + 1;
  if (wouldBe <= quota.limit) {
    return {
      allowed: true,
      remaining: quota.limit - wouldBe,
      alreadyViewed: false,
    };
  }

  return {
    allowed: false,
    remaining: 0,
    alreadyViewed: false,
  };
}

/** Cutoff ISO timestamp for the rolling window of the given content type. */
export function windowStart(contentType: EntitledContent, now: Date = new Date()): string {
  const ms = QUOTAS[contentType].windowDays * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() - ms).toISOString();
}
