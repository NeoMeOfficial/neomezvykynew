import { useEffect, useState } from 'react';

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function getRunningHash(): string | null {
  const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'));
  for (const s of scripts) {
    const m = s.src.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
    if (m) return m[1];
  }
  return null;
}

async function fetchDeployedHash(): Promise<string | null> {
  try {
    // Cache-bust through the SW too: SW caches typically ignore the
    // query string when serving navigation requests, but we still
    // include cache: 'no-store' to bypass HTTP cache layers.
    const res = await fetch(`/?_v=${Date.now()}`, { cache: 'no-store' });
    const html = await res.text();
    const m = html.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
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
      // Show the banner so the user can choose when to reload. Never
      // auto-reload — the service worker may keep serving a stale
      // index.html for a beat after deploy, which used to cause an
      // infinite refresh loop on first load.
      setUpdateAvailable(true);
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return { updateAvailable };
}
