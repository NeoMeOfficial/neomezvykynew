// netlify/functions/send-push-notifications.ts
//
// Scheduled daily — fans out push notifications for two flows:
//   1. period_3d   — predicted period start in ~3 days
//   2. program_monday — Monday morning, user has an active program
//                       and is within program duration
//
// Idempotent: push_notification_log row (user_id, kind, sent_for_date)
// blocks duplicate sends if the cron retries.
//
// Schedule (set in netlify.toml):
//   "30 6 * * *"  — 06:30 UTC daily.
//   In Bratislava that's 07:30 CET (winter) / 08:30 CEST (summer).
//   "Morning" enough either way; users won't notice an hour drift.
//
// Env:
//   VAPID_PUBLIC_KEY     — server-side
//   VAPID_PRIVATE_KEY    — server-side
//   VAPID_SUBJECT        — mailto:klientky@neome.com.au
//   SUPABASE_URL         — already configured
//   SUPABASE_SERVICE_ROLE_KEY — already configured

import { createClient } from '@supabase/supabase-js';
import webpush, { PushSubscription as WebPushSubscription } from 'web-push';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Set VAPID details once at module load. If env is missing, log and
// let the handler short-circuit — cron retries later.
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:klientky@neome.com.au';
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

interface Sub {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth_secret: string;
}

interface CycleRow {
  user_id: string;
  last_period_start: string | null;
  cycle_length: number | null;
}

interface ProgramRow {
  user_id: string;
  program_id: string;
  start_date: string;
}

interface ProgramMeta {
  slug: string;
  name: string;
  weeks: number;
}

// Minimal in-memory program lookup. Mirrors src/data/programs.ts so we
// don't need to ship the SPA bundle into the function. Update when
// programs change.
const PROGRAMS: Record<string, ProgramMeta> = {
  postpartum: { slug: 'postpartum', name: 'Postpartum', weeks: 8 },
  bodyforming: { slug: 'bodyforming', name: 'BodyForming', weeks: 6 },
  'elastic-bands': { slug: 'elastic-bands', name: 'Elastické gumy', weeks: 6 },
  'strong-sexy': { slug: 'strong-sexy', name: 'Strong & Sexy', weeks: 6 },
};

function todayLocal(): { date: Date; iso: string; dow: number } {
  // We treat "today" as the calendar day in Europe/Bratislava regardless
  // of where Netlify runs the function. Cheap conversion via toLocaleString.
  const now = new Date();
  const bratStr = now.toLocaleString('en-CA', { timeZone: 'Europe/Bratislava' });
  // 'en-CA' → 'YYYY-MM-DD, HH:mm:ss'
  const datePart = bratStr.slice(0, 10);
  const [y, m, d] = datePart.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return { date, iso: datePart, dow: date.getUTCDay() }; // 0=Sun..6=Sat
}

function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function daysBetween(aIso: string, bIso: string): number {
  const a = new Date(aIso + 'T00:00:00Z').getTime();
  const b = new Date(bIso + 'T00:00:00Z').getTime();
  return Math.round((b - a) / 86_400_000);
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

async function sendOne(sub: Sub, payload: PushPayload, kind: string, sentForDate: string): Promise<'sent' | string> {
  try {
    const webPushSub: WebPushSubscription = {
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth_secret },
    };
    await webpush.sendNotification(webPushSub, JSON.stringify(payload));
    // Log success — used both for dedupe and analytics.
    await supabase.from('push_notification_log').insert({
      user_id: sub.user_id,
      kind,
      sent_for_date: sentForDate,
      outcome: 'sent',
    }).then(() => {}, () => {});
    await supabase.from('push_subscriptions')
      .update({ last_sent_at: new Date().toISOString() })
      .eq('id', sub.id);
    return 'sent';
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown';
    // 404 / 410 mean the subscription was revoked browser-side; mark
    // disabled so we don't keep retrying.
    const status = (err as { statusCode?: number })?.statusCode;
    if (status === 404 || status === 410) {
      await supabase.from('push_subscriptions')
        .update({ enabled: false })
        .eq('id', sub.id);
    }
    await supabase.from('push_notification_log').insert({
      user_id: sub.user_id,
      kind,
      sent_for_date: sentForDate,
      outcome: `failed:${msg.slice(0, 100)}`,
    }).then(() => {}, () => {});
    return `failed:${msg}`;
  }
}

export async function handler() {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return { statusCode: 500, body: 'VAPID env missing' };
  }

  const today = todayLocal();
  let sentPeriod = 0;
  let sentProgram = 0;
  let skipped = 0;

  // Pull every enabled subscription. Small table — fine to scan.
  const { data: allSubs } = await supabase
    .from('push_subscriptions')
    .select('id,user_id,endpoint,p256dh,auth_secret')
    .eq('enabled', true);
  if (!allSubs?.length) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, note: 'no subscriptions' }) };
  }

  // Group subscriptions by user.
  const subsByUser = new Map<string, Sub[]>();
  for (const s of allSubs as Sub[]) {
    const list = subsByUser.get(s.user_id) ?? [];
    list.push(s);
    subsByUser.set(s.user_id, list);
  }
  const userIds = [...subsByUser.keys()];

  // ── Period prediction (3 days out) ────────────────────────────
  // Pull cycle rows for these users only.
  const { data: cycleRows } = await supabase
    .from('cycle_data')
    .select('user_id,last_period_start,cycle_length')
    .in('user_id', userIds);

  for (const row of (cycleRows ?? []) as CycleRow[]) {
    if (!row.last_period_start || !row.cycle_length) continue;
    // Predicted next period start = last_period_start + cycle_length.
    // Re-roll forward to the next future occurrence.
    let predicted = row.last_period_start;
    while (daysBetween(predicted, today.iso) > 0) {
      predicted = addDays(predicted, row.cycle_length);
    }
    const daysUntil = daysBetween(today.iso, predicted);
    if (daysUntil !== 3) continue;

    // Dedupe: skip if we've already sent today for this user+kind.
    const { data: existingLog } = await supabase
      .from('push_notification_log')
      .select('id')
      .eq('user_id', row.user_id)
      .eq('kind', 'period_3d')
      .eq('sent_for_date', today.iso)
      .maybeSingle();
    if (existingLog) { skipped++; continue; }

    const payload: PushPayload = {
      title: 'Tvoja menštruácia sa blíži',
      body: 'Podľa odhadu príde o 3 dni. Priprav sa, ako ti vyhovuje.',
      url: '/periodka',
      tag: 'period-3d',
    };
    for (const sub of subsByUser.get(row.user_id) ?? []) {
      const result = await sendOne(sub, payload, 'period_3d', today.iso);
      if (result === 'sent') sentPeriod++;
    }
  }

  // ── Program Monday reminder ───────────────────────────────────
  if (today.dow === 1) { // Monday
    const { data: programRows } = await supabase
      .from('user_active_programs')
      .select('user_id,program_id,start_date')
      .in('user_id', userIds);

    for (const row of (programRows ?? []) as ProgramRow[]) {
      const meta = PROGRAMS[row.program_id];
      if (!meta) continue;
      // Week 1 starts on or after start_date. Skip if we haven't
      // reached it yet, or if we're past program length.
      const daysSinceStart = daysBetween(row.start_date, today.iso);
      if (daysSinceStart < 0) continue;
      const weekNumber = Math.floor(daysSinceStart / 7) + 1;
      if (weekNumber > meta.weeks) continue;

      const { data: existingLog } = await supabase
        .from('push_notification_log')
        .select('id')
        .eq('user_id', row.user_id)
        .eq('kind', 'program_monday')
        .eq('sent_for_date', today.iso)
        .maybeSingle();
      if (existingLog) { skipped++; continue; }

      const payload: PushPayload = {
        title: `Týždeň ${weekNumber} — ${meta.name}`,
        body: weekNumber === meta.weeks
          ? `Posledný týždeň ${meta.name}. Dokonči, čo si začala.`
          : `Nový týždeň programu sa začína dnes. Otvor svoj plán.`,
        url: `/program/${meta.slug}`,
        tag: 'program-monday',
      };
      for (const sub of subsByUser.get(row.user_id) ?? []) {
        const result = await sendOne(sub, payload, 'program_monday', today.iso);
        if (result === 'sent') sentProgram++;
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      today: today.iso,
      dow: today.dow,
      sentPeriod,
      sentProgram,
      skipped,
    }),
  };
}

// Netlify scheduled function config — the cron string lives in
// netlify.toml under [functions."send-push-notifications"].
export const config = {
  schedule: '30 6 * * *',
};
