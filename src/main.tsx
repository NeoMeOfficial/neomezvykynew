import { createRoot } from 'react-dom/client'
import AppV2 from './AppV2.tsx'
import './index.css'
import { initSentry } from './lib/sentry'
import { hasOptionalConsent } from './components/v2/CookieBanner'

// Sentry only runs with the user's optional-cookies consent — the cookie
// banner explicitly presents error tracking as voliteľné, so initialising
// unconditionally would contradict our own consent copy (GDPR/ePrivacy).
// CookieBanner calls initSentry() itself the moment the user accepts.
// No-op in DEV builds.
if (hasOptionalConsent()) {
  initSentry();
}

// Demo utilities expose helpers on window — dev-only so the production
// console can't be used to bypass auth / mint subscriptions.
if (import.meta.env.DEV) {
  import('./utils/demoHelpers');
}

createRoot(document.getElementById("root")!).render(<AppV2 />);
