// netlify/functions/program-event.ts
//
// Program lifecycle events from the app → ActiveCampaign tags + the
// activation confirmation email. Replaces program-activated.ts.
//
//   action=activated  → AC: program-<slug> tag added (starts the email
//                       automation; other programs' active tags removed —
//                       one concurrent program), Resend confirmation sent.
//   action=ended      → AC: active tag removed (configure automations to
//                       exit on tag removal) + program-<slug>-<reason>
//                       status tag added. reason: paused|canceled|completed.
//
// AC failures never break the UX — the app's own DB is the source of
// truth; the response carries acSynced so problems are visible in logs.

import type { Handler } from '@netlify/functions';
import { requireUser } from './_userAuth';
import { sendTransactionalEmail, renderBrandedEmail } from './_resend';
import { acConfigured, acActivateProgram, acEndProgram, PROGRAM_SLUGS, type ProgramSlug } from './_activecampaign';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PROGRAM_NAMES: Record<ProgramSlug, string> = {
  postpartum: 'Postpartum',
  bodyforming: 'BodyForming',
  'elastic-bands': 'Elastické gumy',
  'strong-sexy': 'Strong & Sexy',
};

function fmtSk(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}. ${m}. ${y}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

  const auth = await requireUser(event.headers.authorization);
  if (!auth.ok) return { statusCode: auth.status, headers: CORS, body: JSON.stringify({ error: auth.error }) };

  let action = '';
  let programId = '';
  let startDate = '';
  let reason = '';
  try {
    const body = JSON.parse(event.body ?? '{}');
    action = String(body.action ?? '');
    programId = String(body.programId ?? '');
    startDate = String(body.startDate ?? '');
    reason = String(body.reason ?? '');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!(PROGRAM_SLUGS as readonly string[]).includes(programId)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown programId' }) };
  }
  const slug = programId as ProgramSlug;
  const name = PROGRAM_NAMES[slug];

  let acSynced = false;
  let acError: string | null = null;

  if (action === 'activated') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Bad startDate' }) };
    }
    if (auth.email && acConfigured()) {
      try { await acActivateProgram(auth.email, slug); acSynced = true; }
      catch (err) { acError = err instanceof Error ? err.message : 'AC failed'; console.warn('[program-event] AC activate failed:', acError); }
    }
    if (auth.email) {
      try {
        await sendTransactionalEmail({
          to: auth.email,
          subject: `Tvoj program ${name} štartuje ${fmtSk(startDate)}`,
          html: renderBrandedEmail({
            preheader: `Štart v pondelok ${fmtSk(startDate)} — všetko nájdeš na domovskej obrazovke.`,
            headline: `Program ${name} je aktivovaný`,
            body:
              `Skvelé rozhodnutie! Tvoj program <strong>${name}</strong> štartuje v pondelok ` +
              `<strong>${fmtSk(startDate)}</strong>.<br><br>` +
              `Od prvého dňa ti každé ráno na domovskej obrazovke pripravíme cvičenie ` +
              `presne podľa plánu — stačí otvoriť appku a začať. Odkazy od Gabi k jednotlivým ` +
              `dňom nájdeš priamo v appke v Správach.`,
            ctaLabel: 'Otvoriť NeoMe',
            ctaHref: 'https://app.neome.com.au/domov-new',
            footnote: 'Program môžeš kedykoľvek pozastaviť alebo ukončiť v jeho detaile.',
          }),
        });
      } catch (err) {
        console.warn('[program-event] confirmation email failed:', err instanceof Error ? err.message : err);
      }
    }
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, acSynced, acError }) };
  }

  if (action === 'ended') {
    if (!['paused', 'canceled', 'completed'].includes(reason)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Bad reason' }) };
    }
    if (auth.email && acConfigured()) {
      try { await acEndProgram(auth.email, slug, reason as 'paused' | 'canceled' | 'completed'); acSynced = true; }
      catch (err) { acError = err instanceof Error ? err.message : 'AC failed'; console.warn('[program-event] AC end failed:', acError); }
    }
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, acSynced, acError }) };
  }

  return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
};
