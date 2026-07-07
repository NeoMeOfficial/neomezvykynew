/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

/**
 * NeoMe service worker (injectManifest strategy).
 *
 * Responsibilities:
 *   1. Precache the app shell (Workbox; manifest injected at build)
 *   2. Handle Web Push events — show notification, route click
 *   3. Update via the PROMPT pattern: the new SW waits until the user
 *      taps "Obnoviť" in the update banner (AppLayout), which posts
 *      SKIP_WAITING and reloads. An unconditional skipWaiting() here
 *      used to hijack live sessions mid-deploy — the fresh precache
 *      replaced hashed chunks the running page still needed, so lazy
 *      routes 404'd into the error boundary.
 *
 * Push event payload contract (sent by netlify/functions/send-push-notifications.ts):
 *   {
 *     title: string,
 *     body: string,
 *     url?: string,          // where to open on click; defaults to /domov-new
 *     tag?: string,          // dedupes same-kind notifications
 *     icon?: string,         // defaults to /icon-192.png
 *   }
 */

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Prompt-pattern update: stay in "waiting" until the page tells us to go.
// vite-plugin-pwa's updateServiceWorker(true) posts this message when the
// user accepts the update banner.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

cleanupOutdatedCaches();
// Workbox injects the precache manifest here at build time.
precacheAndRoute(self.__WB_MANIFEST);

// ─── Web Push ──────────────────────────────────────────────────────

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;
  let payload: { title: string; body: string; url?: string; tag?: string; icon?: string };
  try {
    payload = event.data.json();
  } catch {
    // Plain-text fallback so a malformed payload still surfaces.
    payload = { title: 'NeoMe', body: event.data.text() };
  }

  const title = payload.title || 'NeoMe';
  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: payload.tag,
    data: { url: payload.url || '/domov-new' },
    // Re-show even if a notification with the same tag exists, so
    // a fresh delivery never feels silenced.
    renotify: Boolean(payload.tag),
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const targetUrl = (event.notification.data as { url?: string } | null)?.url || '/domov-new';

  event.waitUntil((async () => {
    // If a window for this origin is already open, focus it and
    // navigate. Otherwise open a fresh window.
    const allClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });
    const origin = self.location.origin;
    for (const client of allClients) {
      if (client.url.startsWith(origin)) {
        await (client as WindowClient).focus();
        if ('navigate' in client) {
          try { await (client as WindowClient).navigate(targetUrl); } catch { /* cross-origin / SPA fallback */ }
        }
        return;
      }
    }
    await self.clients.openWindow(targetUrl);
  })());
});

export {};
