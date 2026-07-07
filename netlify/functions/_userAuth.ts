// netlify/functions/_userAuth.ts
//
// Shared caller-identity check for user-facing billing functions
// (create-checkout-session, cancel-subscription, create-portal-session).
//
// Unlike _adminAuth this only verifies the JWT is a real signed-in user
// and returns their identity — the caller must NOT be trusted to supply
// userId/email/customerId in the request body, because those functions
// act with the Stripe secret key / service-role client.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;
export function serviceClient(): SupabaseClient {
  if (!cached) {
    cached = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return cached;
}

export type UserAuthResult =
  | { ok: true; userId: string; email: string | null }
  | { ok: false; status: 401; error: string };

export async function requireUser(authHeader: string | undefined): Promise<UserAuthResult> {
  if (!authHeader) return { ok: false, status: 401, error: 'Unauthorized' };
  const { data: { user }, error } = await serviceClient().auth.getUser(
    authHeader.replace('Bearer ', ''),
  );
  if (error || !user) return { ok: false, status: 401, error: 'Unauthorized' };
  return { ok: true, userId: user.id, email: user.email ?? null };
}

/**
 * Trusted app origin for redirect URLs. Client-supplied absolute URLs are
 * an open-redirect vector through Stripe-branded pages, so functions accept
 * only a PATH ("/checkout/success?…") and prepend this origin.
 *
 * Netlify sets URL to the primary site URL; localhost origins are allowed
 * through for dev by matching the request's Origin header.
 */
export function trustedOrigin(requestOrigin: string | undefined): string {
  const site = process.env.URL || 'https://app.neome.com.au';
  if (requestOrigin && /^http:\/\/localhost:\d+$/.test(requestOrigin)) {
    return requestOrigin;
  }
  return site;
}

/** Sanitise a client-supplied redirect path: same-origin paths only. */
export function safePath(path: unknown, fallback: string): string {
  if (typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')) {
    return path;
  }
  return fallback;
}
