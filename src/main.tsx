import { createRoot } from 'react-dom/client'
import AppV2 from './AppV2.tsx'
import './index.css'

// Demo utilities expose helpers on window — dev-only so the production
// console can't be used to bypass auth / mint subscriptions.
if (import.meta.env.DEV) {
  import('./utils/demoHelpers');
}

createRoot(document.getElementById("root")!).render(<AppV2 />);
