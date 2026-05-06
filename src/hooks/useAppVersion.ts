import { useEffect, useState } from 'react';

// Vite replaces this at build time with the actual build hash
const CURRENT_BUILD = import.meta.env.VITE_BUILD_HASH ?? '__dev__';
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchDeployedHash(): Promise<string | null> {
  try {
    // Fetch index.html with cache-busting query — Netlify serves it uncached
    const res = await fetch(`/?_v=${Date.now()}`, { cache: 'no-store' });
    const html = await res.text();
    // Extract the hashed JS bundle filename — changes on every deploy
    const match = html.match(/\/assets\/index-([a-f0-9]+)\.js/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function useAppVersion() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Skip in dev — hash is always __dev__
    if (CURRENT_BUILD === '__dev__') return;

    let initialHash: string | null = null;

    const check = async () => {
      const deployed = await fetchDeployedHash();
      if (!deployed) return;

      if (initialHash === null) {
        // First check — record baseline
        initialHash = deployed;
        return;
      }

      if (deployed !== initialHash) {
        setUpdateAvailable(true);
      }
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return { updateAvailable };
}
