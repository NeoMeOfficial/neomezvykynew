import { createRoot } from 'react-dom/client'
import AppV2 from './AppV2.tsx'
import './index.css'
import { initSentry } from './lib/sentry'

// Initialise Sentry first so it can capture any boot-time errors.
// No-op in DEV builds.
initSentry();

// Demo utilities expose helpers on window — dev-only so the production
// console can't be used to bypass auth / mint subscriptions.
if (import.meta.env.DEV) {
  import('./utils/demoHelpers');
}

createRoot(document.getElementById("root")!).render(<AppV2 />);
