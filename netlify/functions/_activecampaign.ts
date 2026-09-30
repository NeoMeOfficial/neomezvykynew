// netlify/functions/_activecampaign.ts
//
// Minimal ActiveCampaign v3 API client for program email automations.
// Sam's model (2026-09-30): AC owns the program email sequences — the
// app only manages tags. An automation starts when the program's tag is
// added to the contact; AC-side rules handle Monday-only sending. Pause/
// cancel/complete removes the active tag (configure the automation to
// exit on tag removal) and adds a status tag for segmentation.
//
// Tag taxonomy (created on demand, find-or-create by name):
//   program-<slug>             — active; the automation trigger
//   program-<slug>-paused      — user paused the program
//   program-<slug>-canceled    — user canceled it
//   program-<slug>-completed   — user finished it
//
// Env: AC_API_URL (https://<account>.api-us1.com), AC_API_KEY.

const AC_API_URL = process.env.AC_API_URL;
const AC_API_KEY = process.env.AC_API_KEY;

export function acConfigured(): boolean {
  return !!AC_API_URL && !!AC_API_KEY;
}

async function ac(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${AC_API_URL}/api/3/${path}`, {
    ...init,
    headers: {
      'Api-Token': AC_API_KEY!,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AC ${res.status} on ${path}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

/** Find a contact by email, creating it when missing. Returns the contact id. */
export async function acEnsureContact(email: string): Promise<string> {
  const found = await ac(`contacts?email=${encodeURIComponent(email)}`);
  const existing = found?.contacts?.[0]?.id;
  if (existing) return existing;
  const created = await ac('contacts', {
    method: 'POST',
    body: JSON.stringify({ contact: { email } }),
  });
  return created.contact.id;
}

/** Find a tag by exact name, creating it when missing. Returns the tag id. */
export async function acEnsureTag(name: string): Promise<string> {
  const found = await ac(`tags?search=${encodeURIComponent(name)}`);
  const exact = (found?.tags ?? []).find((t: { tag: string; id: string }) => t.tag === name);
  if (exact) return exact.id;
  const created = await ac('tags', {
    method: 'POST',
    body: JSON.stringify({ tag: { tag: name, tagType: 'contact', description: 'NeoMe program automation' } }),
  });
  return created.tag.id;
}

export async function acAddTag(contactId: string, tagName: string): Promise<void> {
  const tagId = await acEnsureTag(tagName);
  await ac('contactTags', {
    method: 'POST',
    body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
  });
}

export async function acRemoveTag(contactId: string, tagName: string): Promise<void> {
  const tagId = await acEnsureTag(tagName);
  // The association id is needed for deletion — list the contact's tags.
  const list = await ac(`contacts/${contactId}/contactTags`);
  const assoc = (list?.contactTags ?? []).find((ct: { tag: string; id: string }) => String(ct.tag) === String(tagId));
  if (assoc) await ac(`contactTags/${assoc.id}`, { method: 'DELETE' });
}

export const PROGRAM_SLUGS = ['postpartum', 'bodyforming', 'elastic-bands', 'strong-sexy'] as const;
export type ProgramSlug = (typeof PROGRAM_SLUGS)[number];
export const PROGRAM_TAG = (slug: string) => `program-${slug}`;
export const PROGRAM_STATUS_TAG = (slug: string, status: 'paused' | 'canceled' | 'completed') => `program-${slug}-${status}`;

/**
 * Sync AC to "this program is now the user's ONLY active one":
 * removes every other program's active tag + this program's stale status
 * tags, then adds the active tag (triggers the automation).
 */
export async function acActivateProgram(email: string, slug: ProgramSlug): Promise<void> {
  const contactId = await acEnsureContact(email);
  for (const other of PROGRAM_SLUGS) {
    if (other !== slug) await acRemoveTag(contactId, PROGRAM_TAG(other)).catch(() => {});
  }
  for (const st of ['paused', 'canceled', 'completed'] as const) {
    await acRemoveTag(contactId, PROGRAM_STATUS_TAG(slug, st)).catch(() => {});
  }
  await acAddTag(contactId, PROGRAM_TAG(slug));
}

/** Sync AC to a program end: active tag off (automation exit), status tag on. */
export async function acEndProgram(email: string, slug: ProgramSlug, reason: 'paused' | 'canceled' | 'completed'): Promise<void> {
  const contactId = await acEnsureContact(email);
  await acRemoveTag(contactId, PROGRAM_TAG(slug));
  await acAddTag(contactId, PROGRAM_STATUS_TAG(slug, reason));
}
