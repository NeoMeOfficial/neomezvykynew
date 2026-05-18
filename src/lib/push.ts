import { supabase } from './supabase';

/**
 * Web Push client helpers — request permission, subscribe via the
 * service worker's PushManager, save the resulting subscription to
 * Supabase. Used by the SettingsNotifications page to drive the
 * Push toggle.
 *
 * iOS note: web push only works on iOS 16.4+ AND only when the app
 * is installed to the home screen as a PWA. In Safari (browser tab)
 * the permission request will throw or return 'denied'.
 *
 * Env: VITE_VAPID_PUBLIC_KEY (base64-url) — paired with VAPID_PRIVATE_KEY
 * on the server. Generate with scripts/generate-vapid.cjs.
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function currentPermission(): NotificationPermission | 'unsupported' {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

/**
 * Whether the user already has an active push subscription on this
 * device. Useful for showing the right toggle state on load.
 */
export async function isCurrentlySubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  return !!sub;
}

/**
 * Ask the browser for permission + subscribe + persist to Supabase.
 * Must be called from a user gesture (e.g. button click) — browsers
 * throw if permission is requested outside one.
 */
export async function enablePush(userId: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!isPushSupported()) return { ok: false, reason: 'unsupported' };
  if (!VAPID_PUBLIC_KEY) return { ok: false, reason: 'no_vapid_key' };

  // Permission step — only fires the UI prompt on the first call.
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return { ok: false, reason: 'permission_denied' };

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    } catch (err) {
      console.error('[push] subscribe failed', err);
      return { ok: false, reason: 'subscribe_failed' };
    }
  }

  const payload = sub.toJSON();
  const p256dh = payload.keys?.p256dh;
  const auth = payload.keys?.auth;
  if (!payload.endpoint || !p256dh || !auth) {
    return { ok: false, reason: 'invalid_subscription_shape' };
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: userId,
        endpoint: payload.endpoint,
        p256dh,
        auth_secret: auth,
        user_agent: navigator.userAgent.slice(0, 500),
        enabled: true,
      },
      { onConflict: 'user_id,endpoint' },
    );
  if (error) {
    console.error('[push] supabase upsert failed', error);
    return { ok: false, reason: 'db_save_failed' };
  }

  return { ok: true };
}

/**
 * Unsubscribe locally + mark the row disabled in Supabase. We keep
 * the row instead of deleting so a future re-enable can re-use it.
 */
export async function disablePush(userId: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!isPushSupported()) return { ok: false, reason: 'unsupported' };
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  const endpoint = sub?.endpoint;
  try {
    await sub?.unsubscribe();
  } catch (err) {
    console.warn('[push] unsubscribe threw (non-fatal)', err);
  }
  if (endpoint) {
    await supabase
      .from('push_subscriptions')
      .update({ enabled: false })
      .eq('user_id', userId)
      .eq('endpoint', endpoint);
  }
  return { ok: true };
}

// VAPID public key arrives as URL-safe base64; PushManager wants Uint8Array.
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
