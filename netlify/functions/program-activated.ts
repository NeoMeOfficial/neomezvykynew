// netlify/functions/program-activated.ts
//
// Called by the app right after a user activates a program (Monday
// start picked in ProgramDetail). Two jobs:
//
//   1. Send the activation confirmation email via Resend ("Tvoj program
//      štartuje v pondelok X").
//   2. EMAIL-SEQUENCE HOOK: this is the single place to register the
//      user into the program's email drip once the platform is settled
//      (AC phased out 2026-05; Loops evaluation pending — see memory).
//      The source of truth for "who is on which program since when" is
//      the user_active_programs table, so a daily scheduler can also
//      drive the drip entirely from the DB without any registration.
//
// Fire-and-forget from the client — activation itself never blocks on
// this (the DB upsert in useActiveProgram already succeeded).

import type { Handler } from '@netlify/functions';
import { requireUser } from './_userAuth';
import { sendTransactionalEmail, renderBrandedEmail } from './_resend';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const PROGRAM_NAMES: Record<string, string> = {
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

  let programId = '';
  let startDate = '';
  try {
    const body = JSON.parse(event.body ?? '{}');
    programId = String(body.programId ?? '');
    startDate = String(body.startDate ?? '');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  const name = PROGRAM_NAMES[programId];
  if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown programId or bad startDate' }) };
  }

  if (!auth.email) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, note: 'no email on account' }) };
  }

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
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'send failed';
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: msg }) };
  }
};
