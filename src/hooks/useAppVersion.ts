import { useEffect, useState } from 'react';

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Read the hash of the JS bundle that is currently running in this tab,
// by inspecting the <script src="..."> tags Vite injected into index.html.
function getRunningHash(): string | null {
  const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'));
  for (const s of scripts) {
    const m = s.src.match(/\/assets\/index-([a-f0-9]+)\.js/);
    if (m) return m[1];
  }
  return null;
}

// Fetch a fresh copy of index.html from the server (bypassing cache) and
// extract the bundle hash from the <script> tag inside it.
async function fetchDeployedHash(): Promise<string | null> {
  try {
    const res = await fetch(`/?_v=${Date.now()}`, { cache: 'no-store' });
    const html = await res.text();
    const m = html.match(/\/assets\/index-([a-f0-9]+)\.js/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export function useAppVersion() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const runningHash = getRunningHash();

    // Can't determine running hash (e.g. local dev with no fingerprinting) — skip
    if (!runningHash) return;

    const check = async () => {
      const deployedHash = await fetchDeployedHash();
      if (deployedHash && deployedHash !== runningHash) {
        setUpdateAvailable(true);
      }
    };

    // Check once on mount (catches users who had the tab open during a deploy)
    check();

    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return { updateAvailable };
}
