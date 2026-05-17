// netlify/functions/_acClient.ts
//
// Tiny ActiveCampaign API helper. Two responsibilities:
//   1. acFetch(path, init) — auth header + JSON body, throws on non-2xx
//   2. syncContact + addTag — the two operations every caller needs
//
// Env vars (set in Netlify):
//   AC_API_URL   e.g. https://neomeofficial.api-us1.com
//   AC_API_KEY   the full API key from AC → Settings → Developer
//
// Tag IDs are looked up by name on first use and cached in module scope,
// which survives across warm invocations of the same function.

const AC_URL = process.env.AC_API_URL;
const AC_KEY = process.env.AC_API_KEY;

if (!AC_URL || !AC_KEY) {
  // Don't throw at module load — the function should return a clean 500
  // with an explanatory message instead of a cold-start crash.
  console.warn('[acClient] AC_API_URL or AC_API_KEY is not set');
}

async function acFetch(path: string, init: RequestInit = {}) {
  if (!AC_URL || !AC_KEY) throw new Error('AC env vars not configured');
  const res = await fetch(`${AC_URL}${path}`, {
    ...init,
    headers: {
      'Api-Token': AC_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`AC ${res.status} ${path}: ${text || res.statusText}`);
  }
  return body;
}

/** Idempotent create-or-update by email. Returns the AC contact id. */
export async function syncContact(input: {
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<string> {
  const body = await acFetch('/api/3/contact/sync', {
    method: 'POST',
    body: JSON.stringify({ contact: input }),
  });
  return body.contact.id as string;
}

const tagIdCache = new Map<string, string>();

/** Look up a tag id by name, cached. Returns null if the tag doesn't exist. */
export async function findTagId(name: string): Promise<string | null> {
  if (tagIdCache.has(name)) return tagIdCache.get(name)!;
  const body = await acFetch(`/api/3/tags?search=${encodeURIComponent(name)}`);
  const match = (body.tags || []).find(
    (t: { tag: string; id: string }) => t.tag === name,
  );
  if (!match) return null;
  tagIdCache.set(name, match.id);
  return match.id;
}

/** Create a tag if it doesn't exist and return its id. */
export async function ensureTagId(name: string): Promise<string> {
  const existing = await findTagId(name);
  if (existing) return existing;
  const body = await acFetch('/api/3/tags', {
    method: 'POST',
    body: JSON.stringify({ tag: { tag: name, tagType: 'contact' } }),
  });
  const id = body.tag.id as string;
  tagIdCache.set(name, id);
  return id;
}

/** Attach a tag to a contact. Safe to call repeatedly (AC dedupes). */
export async function addTag(contactId: string, tagName: string): Promise<void> {
  const tagId = await ensureTagId(tagName);
  await acFetch('/api/3/contactTags', {
    method: 'POST',
    body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
  });
}
