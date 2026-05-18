# Personal Data Breach — Incident Response Runbook

**Articles 33 & 34 GDPR.** Internal operational runbook.
Keep this short. When something goes wrong, this is the document the on-call person opens first.

---

## 0. The 72-hour clock

The clock **starts when NeoMe becomes aware** of a personal data breach with reasonable confidence — not when the breach happened, not when it's fully understood. "Aware" is when a responsible person concludes that a breach has occurred. Don't sit on suspicions to "be sure" before starting the clock — start it, then investigate.

> **Breach** (Art. 4(12)): "a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored or otherwise processed."

This includes:
- credentials leak (admin or user),
- unauthorised access to Supabase (via key compromise, RLS misconfiguration, etc.),
- accidental disclosure of cycle data (e.g. bug exposing one user's data to another),
- ransomware encrypting our database,
- a lost laptop with downloaded user data,
- a misdirected email containing personal data,
- a third-party processor (Stripe, Supabase, Netlify, ESP) reporting a breach to us.

---

## 1. Detection sources

| Source | What to watch |
|---|---|
| Sentry / error tracking | Spikes in auth errors, RLS denials, unhandled exceptions in /delete-account, /export-user-data |
| Supabase audit logs | Unusual service-role key usage; admin role grants; failed login spikes |
| Stripe webhooks | Unusual refund or dispute volume (could indicate stolen-card fraud against our account) |
| User reports | privacy@neome.com.au, support emails, community DMs |
| Third-party notifications | Processor incident reports (Supabase status, Stripe status, etc.) |
| GitHub Dependabot | High/critical vulnerabilities in production dependencies |
| Manual review | Routine spot-checks of logs and access patterns |

---

## 2. Severity triage

Within **one hour** of awareness, the on-call person makes a preliminary classification:

| Severity | Definition | Examples |
|---|---|---|
| **S0 — Catastrophic** | Large-scale exposure of health data; ransomware; full DB exfiltration | Cycle data of >1,000 users leaked publicly |
| **S1 — High** | Health data of any individual exposed unintentionally to a third party; account compromise enabling read of multiple users' health data | RLS misconfiguration allowing user A to see user B's cycle |
| **S2 — Medium** | Non-health PII disclosure (email lists leaked); single-account compromise without health data | Marketing list emailed to wrong recipient |
| **S3 — Low** | Internal-only exposure; promptly corrected; no third party gained access | Internal team member granted excess access for 10 minutes, no data viewed |

**S0–S1 are notifiable to the Slovak DPA within 72h unless the breach is unlikely to result in risk to data subjects.** When in doubt, notify.
**S0–S1 may also require notification to affected data subjects within "without undue delay"** if the breach is likely to result in *high* risk (Art. 34).
**S2 typically not notifiable** unless the volume or context elevates the risk.
**S3 logged in the internal breach register; not notified.**

---

## 3. Immediate containment (within 1–2 hours)

The first responder's job is to stop the bleeding, in this order:

1. **Acknowledge** the incident in the team channel; do not delete or modify any evidence.
2. **Contain**:
   - If credential/key compromise: rotate the compromised key in the relevant dashboard. Supabase: rotate service role + JWT secret. Stripe: roll restricted keys. Google: revoke OAuth client secret.
   - If RLS misconfiguration: roll back the migration immediately via the Supabase Dashboard; do NOT try to "patch forward" while users are still affected.
   - If unauthorised access via the app: deploy a hotfix that blocks the affected endpoint; consider taking the app temporarily offline (Netlify "site disabled" toggle) if exposure is ongoing.
3. **Preserve evidence**:
   - Export the Supabase audit logs covering the incident window.
   - Snapshot Netlify function logs.
   - Save screenshots of the offending error in Sentry.
4. **Identify scope**: how many users, which data fields, when did it start, when did it stop.
5. **Notify the founder + EU representative**.

---

## 4. The 72-hour DPA notification (Slovak ÚOOÚ)

For S0–S1 (or any S2 where you've concluded there is risk to data subjects):

**Form**: online breach notification at the Slovak Data Protection Authority — https://dataprotection.gov.sk/uoou/sk/main-content/oznamenie-o-poruseni-ochrany-osobnych-udajov

**Minimum content required by Art. 33(3)**:
1. Nature of the breach (what happened, when, types of data affected).
2. Categories and approximate number of data subjects concerned.
3. Categories and approximate number of personal data records concerned.
4. Likely consequences of the breach.
5. Measures taken or proposed to address the breach and mitigate adverse effects.
6. Name and contact of the DPO or other contact point (use the EU representative).

If full information is not available within 72h, **notify with what you have** and supplement later — explicitly permitted by Art. 33(4). Do NOT delay the initial notification waiting for completeness.

Use the boilerplate in `docs/legal/templates/dpa-notification.md` (create as needed; placeholder for now).

---

## 5. Notifying affected users (Art. 34)

If the breach is **likely to result in a high risk** to the rights and freedoms of natural persons (health-data leak almost always qualifies), notify users **without undue delay** in clear, plain language, via:

- in-app banner (highest priority — fastest delivery),
- email to affected addresses,
- public statement on neome.com.au if the volume is large.

Minimum content (Art. 34(2)):
1. The nature of the breach.
2. Name and contact of the EU representative.
3. Likely consequences.
4. Measures taken or proposed.

**Exception** — notification to data subjects is not required if any of:
- the data was rendered unintelligible (e.g. strong encryption + the key was not compromised),
- subsequent measures ensure the high risk is no longer likely to materialise,
- it would involve disproportionate effort — in which case a public statement is used instead.

Slovak-language draft template should be prepared in advance: `docs/legal/templates/user-breach-notification-sk.md` (create as needed).

---

## 6. Breach register (Art. 33(5))

**Every** breach — even those not notified to the DPA — must be logged. Create or append to `docs/legal/breach-register.md` with:

```
## YYYY-MM-DD — short title

- Severity: Sx
- Detected by: [source]
- Detected at: 2026-MM-DD HH:MM UTC
- Awareness at: 2026-MM-DD HH:MM UTC
- Notifiable: yes/no — reasoning
- Affected users: [count or "none"]
- Data categories: [list]
- Containment actions: [list]
- DPA notification: [yes/no, ref number, timestamp]
- User notification: [yes/no, channel, timestamp]
- Root cause: [analysis]
- Permanent fix: [PR link, date]
- Lessons / preventive actions: [list]
```

This register is the single source of truth in any future DPA inspection.

---

## 7. Post-incident review (within 14 days)

For every S0–S2:

1. **Root cause analysis** — what allowed this to happen, in technical and process terms. Blameless.
2. **Permanent fix** — committed and deployed.
3. **Preventive controls** — what new monitoring, code review, or process prevents the same class of incident.
4. **Documentation update** — RoPA, DPIA, this runbook, privacy policy as needed.
5. **Communication closure** — follow-up notification to affected users summarising the fix.

---

## 8. Contacts (keep current)

| Role | Name | Email | Phone |
|---|---|---|---|
| Founder / Incident commander | Sam Grecner | samuelgrecner@gmail.com | [TODO] |
| EU representative | [TODO] | [TODO] | [TODO] |
| Slovak DPA | Úrad na ochranu osobných údajov SR | statny.dozor@pdp.gov.sk | +421 2 3231 3214 |
| Supabase support | — | support@supabase.io | — |
| Stripe support | — | via dashboard | — |
| Netlify support | — | support@netlify.com | — |
| Legal counsel | [TODO] | [TODO] | [TODO] |

---

## 9. Dry-runs

This runbook is only as good as the practice. Schedule a tabletop simulation:
- once before launch,
- annually thereafter,
- after any S0–S2 incident.

Document the simulation in `docs/legal/incident-drills.md`.
