import { useEffect, useState } from 'react';

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
// If the app just loaded (within this window) and is already stale, reload silently
// rather than showing the banner — user hasn't done anything yet so it's invisible.
const SILENT_RELOAD_WINDOW_MS = 8 * 1000; // 8 seconds after mount

const mountedAt = Date.now();

function getRunningHash(): string | null {
  const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'));
  for (const s of scripts) {
    const m = s.src.match(/\/assets\/index-([a-f0-9]+)\.js/);
    if (m) return m[1];
  }
  return null;
}

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
    if (!runningHash) return;

    const check = async () => {
      const deployedHash = await fetchDeployedHash();
      if (!deployedHash || deployedHash === runningHash) return;

      // If the mismatch is detected within a few seconds of mount, the user
      // just loaded a stale cached bundle. Reload silently — they won't notice.
      if (Date.now() - mountedAt < SILENT_RELOAD_WINDOW_MS) {
        window.location.reload();
        return;
      }

      // Otherwise show the banner so the user can choose when to reload.
      setUpdateAvailable(true);
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return { updateAvailable };
}
