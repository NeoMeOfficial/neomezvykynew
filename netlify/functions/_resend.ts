// netlify/functions/_resend.ts
//
// Small wrapper around the Resend API for transactional sends from
// other functions. Same template + sender conventions as the rest of
// the app (cream BG, INK text, NeoMe wordmark, klientky@neome.com.au
// support line, "Team NeoMe" signoff).
//
// Env: RESEND_API_KEY (already configured in Netlify for the admin
// email log feature).
//
// Returns the Resend response so callers can inspect status; throws
// on missing env or transport failure.

const RESEND_FROM = 'NeoMe <noreply@app.neome.com.au>';
const RESEND_REPLY_TO = 'klientky@neome.com.au';

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

export async function sendTransactionalEmail({ to, subject, html }: SendArgs): Promise<{ id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured in Netlify env');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to,
      subject,
      reply_to: RESEND_REPLY_TO,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Renders the standard branded transactional shell — cream background,
 * white card, wordmark header, serif headline, body, INK CTA pill,
 * support footer.
 *
 * Use for any new transactional template so visual identity stays
 * consistent with the Supabase auth emails (which share the same
 * design).
 */
export function renderBrandedEmail(opts: {
  preheader?: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  footnote?: string;
}): string {
  const { preheader = '', headline, body, ctaLabel, ctaHref, footnote } = opts;
  return `
<!doctype html>
<html lang="sk">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>${escape(headline)}</title>
  </head>
  <body style="margin:0; padding:0; background:#F8F5F0; font-family: 'DM Sans', Helvetica, Arial, sans-serif; color:#3D2921;">
    <div style="display:none; max-height:0; overflow:hidden;">${escape(preheader)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F8F5F0; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#FFFFFF; border-radius:18px; padding:32px 28px; box-shadow:0 4px 18px rgba(61,41,33,0.06);">
            <tr>
              <td>
                <img src="https://app.neome.com.au/email-wordmark.png" alt="NeoMe" width="80" height="18" style="display:block; margin-bottom:24px;">
                <h1 style="font-family: 'Gilda Display', Georgia, serif; font-size:24px; font-weight:500; line-height:1.2; color:#3D2921; margin:0 0 16px;">${headline}</h1>
                <div style="font-size:14px; line-height:1.6; color:rgba(61,41,33,0.78); margin:0 0 ${ctaHref ? '24px' : '12px'};">${body}</div>
                ${ctaHref && ctaLabel ? `<p style="margin:0 0 12px;"><a href="${ctaHref}" style="display:inline-block; background:#3D2921; color:#fff; text-decoration:none; padding:13px 22px; border-radius:999px; font-size:14px; font-weight:500; letter-spacing:0.02em;">${escape(ctaLabel)}</a></p>` : ''}
                ${footnote ? `<p style="font-size:12px; color:rgba(61,41,33,0.55); margin:16px 0 0; line-height:1.5;">${footnote}</p>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding-top:28px; border-top:1px solid rgba(61,41,33,0.08); margin-top:24px;">
                <p style="font-size:12px; color:rgba(61,41,33,0.55); margin:16px 0 0;">
                  Otázky? Napíš nám na <a href="mailto:klientky@neome.com.au" style="color:#3D2921;">klientky@neome.com.au</a>.
                </p>
                <p style="font-size:12px; color:rgba(61,41,33,0.55); margin:6px 0 0;">Team NeoMe</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
