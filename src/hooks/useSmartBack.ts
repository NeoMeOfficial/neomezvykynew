import { useNavigate } from 'react-router-dom';

/**
 * Back arrow that returns the user where she actually came from: pops
 * in-app history when there is any, and only falls back to the screen's
 * natural parent when the page was opened cold (deep link, PWA fresh
 * start) and history-back would leave the app.
 *
 * React Router v6 stamps `idx` into history.state — idx 0 means this is
 * the first in-app entry.
 */
export function useSmartBack(fallback: string): () => void {
  const navigate = useNavigate();
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback);
  };
}
