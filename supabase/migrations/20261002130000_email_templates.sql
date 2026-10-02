-- Editable transactional-email templates (Sam 2026-10-02): Supabase's
-- own dashboard templates only cover auth mails, so app-sent Resend
-- mails get the same workflow via this table — edit subject/html in
-- Supabase → Table Editor → email_templates, takes effect on the next
-- send, no deploy. Functions fall back to their built-in template when
-- a slug is missing, so clearing a row is always safe.
--
-- Placeholders use {{name}} and are replaced server-side; each row's
-- `variables` column documents what the sending function provides.

create table if not exists public.email_templates (
  slug       text primary key,
  subject    text not null,
  html       text not null,
  variables  text,
  updated_at timestamptz not null default now()
);

alter table public.email_templates enable row level security;

-- Service role reads these when sending; admins manage them. No
-- end-user access at all.
drop policy if exists "Admin manages email_templates" on public.email_templates;
create policy "Admin manages email_templates" on public.email_templates
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed: the affiliate welcome mail, identical to the built-in design,
-- ready to be restyled in place.
insert into public.email_templates (slug, subject, html, variables) values (
  'affiliate-welcome',
  'Vitaj v partnerskom programe NeoMe',
  $html$<!doctype html>
<html lang="sk">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Vitaj v partnerskom programe</title>
  </head>
  <body style="margin:0; padding:0; background:#F8F5F0; font-family: 'DM Sans', Helvetica, Arial, sans-serif; color:#3D2921;">
    <div style="display:none; max-height:0; overflow:hidden;">Vyber si svoj kód a začni odporúčať.</div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F8F5F0; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:520px; background:#FFFFFF; border-radius:18px; padding:32px 28px; box-shadow:0 4px 18px rgba(61,41,33,0.06);">
            <tr>
              <td>
                <img src="https://app.neome.com.au/email-wordmark.png" alt="NeoMe" width="80" height="18" style="display:block; margin-bottom:24px;">
                <h1 style="font-family: 'Gilda Display', Georgia, serif; font-size:24px; font-weight:500; line-height:1.2; color:#3D2921; margin:0 0 16px;">Vitaj v partnerskom programe</h1>
                <div style="font-size:14px; line-height:1.6; color:rgba(61,41,33,0.78); margin:0 0 24px;">
                  Zaradili sme ťa do partnerského programu NeoMe. V aplikácii si teraz vyberieš svoj osobný kód a dostaneš odkaz, ktorý môžeš zdieľať — z každej platby odporúčanej používateľky ti patrí provízia. Všetko (odporúčania, zárobky aj žiadosti o vyplatenie) sleduješ priamo v aplikácii v časti <b>Profil → Partnerský program</b>.
                </div>
                <p style="margin:0 0 12px;"><a href="{{partner_url}}" style="display:inline-block; background:#3D2921; color:#fff; text-decoration:none; padding:13px 22px; border-radius:999px; font-size:14px; font-weight:500; letter-spacing:0.02em;">Otvoriť partnerský program</a></p>
                <p style="font-size:12px; color:rgba(61,41,33,0.55); margin:16px 0 0; line-height:1.5;">Provízia sa uvoľňuje 30 dní po platbe; o vyplatenie požiadaš jedným klikom v aplikácii.</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:28px; border-top:1px solid rgba(61,41,33,0.08);">
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
</html>$html$,
  '{{partner_url}} — odkaz na partnerský dashboard'
)
on conflict (slug) do nothing;
