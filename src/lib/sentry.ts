import * as Sentry from '@sentry/react';

/**
 * Sentry — production error monitoring.
 *
 * Only initialises in production builds; DEV mode skips so local dev
 * doesn't pollute the project quota with errors that don't matter.
 *
 * DSN is hardcoded (it's a public client identifier, not a secret —
 * the Sentry project itself is locked down by allowed-origins). If
 * the DSN ever needs rotation, swap it here.
 */
const SENTRY_DSN = 'https://5e81840385582c28e0d7997aef44497b@o4511409494360064.ingest.de.sentry.io/4511409500454992';

export function initSentry() {
  if (!import.meta.env.PROD) return;
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Performance + replay are off by default to keep the quota for
    // actual errors. Enable later if you need timing data.
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // Drop noisy events that aren't actionable. Tighten or relax as
    // you see what arrives in the dashboard.
    ignoreErrors: [
      // Network blips on PWA install pings
      'Failed to fetch',
      'NetworkError',
      // Browser-extension noise
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
  });
}

export { Sentry };
