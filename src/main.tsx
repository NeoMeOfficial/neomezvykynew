import { createRoot } from 'react-dom/client'
import AppV2 from './AppV2.tsx'
import './index.css'
import './utils/demoHelpers' // Enable demo utilities for testing

createRoot(document.getElementById("root")!).render(<AppV2 />);
