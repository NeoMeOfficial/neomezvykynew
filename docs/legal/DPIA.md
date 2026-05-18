# Data Protection Impact Assessment (DPIA)

**Subject**: Processing of menstrual cycle, symptom, and mood data (special-category health data) in the NeoMe mobile/web application.

**Article 35 GDPR.** Mandatory because the processing involves:
- (a) data concerning health on a large scale (Art. 35(3)(b)),
- (b) systematic monitoring of natural persons (cycle observation over months/years),
- (c) processing of a vulnerable group (postpartum users explicitly targeted),
- (d) cross-border processing in a non-EU controller context (Art. 27 representative required).

| | |
|---|---|
| **Controller** | [TODO: NeoMe Pty Ltd] |
| **EU representative** | [TODO: Art. 27 representative — see RoPA.md] |
| **DPIA owner** | Sam Grecner (Founder / Product) |
| **Version** | 1.0 — 2026-05-18 |
| **Next review** | On any material change to processing; minimum annually. |
| **Approved by** | [TODO: signature] |

---

## 1. Description of the processing

### 1.1 Nature

NeoMe is a Slovak-language wellness application targeted at adult women (16+). The cycle-tracking feature stores:
- menstrual cycle start dates,
- period flow intensity,
- physical symptoms (cramps, headache, breast tenderness, etc.),
- emotional / mood states,
- energy and sleep self-reports,
- cervical mucus / fertility indicators,
- free-text notes attached to a date.

Data is entered by the user through Periodka (dashboard) and CyklusLog (daily-record) screens. The system computes:
- current cycle day and phase prediction,
- symptom/mood trends over time,
- phase-appropriate content recommendations (e.g. recipes, meditations).

### 1.2 Scope

- **Volumes**: target user base 5,000–50,000 EU residents in the first 12 months post-launch (predominantly Slovakia).
- **Frequency**: daily logs expected; ad-hoc.
- **Duration**: indefinite — data persists for the lifetime of the user account.
- **Geography**: data subjects in EU/EEA, primarily Slovakia. Processing occurs in Supabase EU region (Frankfurt).

### 1.3 Context

- Data subjects are adult women; service is marketed as supportive/educational, not medical.
- No medical-device claims; NeoMe does not diagnose or prescribe.
- A subset of users is postpartum — recognised as a vulnerable group under EDPB Guidelines on DPIA (WP248).
- Disclosure of cycle data carries elevated personal/social risk in certain contexts (employment discrimination, healthcare system interactions, abuse situations).

### 1.4 Purpose

| Purpose | Necessity |
|---|---|
| Inform the user of her own cycle phase | Core utility of the app |
| Identify symptom patterns over time | Secondary insight; valuable for user's self-knowledge |
| Tailor educational/recipe content to phase | Engagement; revenue driver |
| Aggregate, anonymised research (future) | NOT in current scope; would require separate DPIA. |

---

## 2. Necessity and proportionality

### 2.1 Lawful basis

**Art. 9(2)(a) GDPR — explicit consent.** Captured at the point of first save (not at signup), via the `consent_events` table with `consent_type='health_data'`. Each consent event records:
- user ID,
- granted flag,
- policy version,
- source (`app` for in-product capture, `settings` for manual toggle),
- user agent string,
- ISO 8601 timestamp.

Consent is genuinely freely given because:
- The app's other features (Telo programs, Meditácie, recipes) function without health-data consent.
- The consent prompt at first save offers a clear "Teraz nie" decline path; the cycle data is not persisted but the user can continue using other parts of the app.
- Withdrawal is a single toggle in Settings → Súkromie.

### 2.2 Data minimisation

- We collect only what the user voluntarily enters; no auto-collection of cycle data from device sensors or health-kit integrations.
- No location, no contacts, no calendar, no biometrics.
- Free-text notes are bounded and user-controlled.

### 2.3 Storage limitation

- Active for lifetime of account.
- On account deletion: hard-deleted within 30 days via `ON DELETE CASCADE` from `auth.users`.
- No archival copies retained beyond standard short-term DB backups (Supabase retention: 7-day rolling PITR).

### 2.4 Accuracy

User has full read/write access to their own records (Settings → Súkromie → export; CyklusLog allows editing past entries). No automated inferences are treated as authoritative — predictions are advisory.

### 2.5 Transparency

- Privacy policy ([/privacy](https://app.neome.com.au/privacy)) lists health data as a distinct processing activity with explicit consent basis.
- The HEALTH_DATA consent sheet includes the verbatim Art. 9(2)(a) citation and a link to the policy.
- Consent state is visible to the user in Settings → Súkromie → Súhlasy.

---

## 3. Risks to data subjects

| # | Risk | Likelihood | Severity | Score |
|---|---|---|---|---|
| R1 | Unauthorised disclosure of cycle history (data breach, RLS misconfiguration, insider) | Low | High | Medium |
| R2 | Inadvertent disclosure via community posts (user copies cycle data into a public post) | Medium | Medium | Medium |
| R3 | Discriminatory inference by third parties if data leaks (employer, insurer) | Low | High | Medium |
| R4 | Lawful access request from non-EU jurisdiction (especially USA via CLOUD Act on Supabase parent) | Low | Medium-High | Medium |
| R5 | Loss of trust if processing scope expanded without re-consent | Medium | Medium | Medium |
| R6 | Stale consent — user grants in 2026, policy materially changes 2028 | Medium | Low-Medium | Low-Medium |
| R7 | Vulnerable user (postpartum, abuse situation) cannot delete data quickly enough | Low | High | Medium |
| R8 | Recovery of cycle data from backups after deletion | Low | Medium | Low |

Likelihood / severity scale: Low / Medium / High. Score is the qualitative aggregate.

---

## 4. Mitigations in place

| Risk | Mitigation |
|---|---|
| R1 | (a) Row-Level Security policies restrict `SELECT` on cycle tables to `auth.uid() = user_id`. (b) Encrypted at rest (Supabase managed AES-256). (c) TLS 1.2+ in transit. (d) Service-role key never exposed to client. (e) Admin role gated by JWT `app_metadata.role` claim, audit-loggable via Supabase. |
| R2 | (a) Community posts pass through a server-side moderation pipeline before publishing. (b) Community consent is collected separately at first post — user is explicitly informed posts are visible to others. (c) User can delete posts at any time. |
| R3 | (a) Privacy policy commits explicitly that we do not sell or share cycle data with third parties for advertising. (b) No analytics or ad SDKs receive cycle data. (c) Export is JSON only, not pushed anywhere. |
| R4 | (a) Supabase EU region selected (Frankfurt). (b) SCCs in place. (c) DPA includes Schrems II safeguards. (d) Cycle data is per-row encrypted at rest with key in EU. (e) NeoMe will challenge any disproportionate access request via the EU representative. |
| R5 | (a) Consent policy version embedded in `consent_events`. (b) `CONSENT_POLICY_VERSION` bump auto-invalidates prior consent and re-prompts the user via `TosConsentGate` and `useConsents.isGranted` mismatch check. |
| R6 | Same as R5. |
| R7 | (a) Account deletion is a single button in Settings, immediate. (b) Deletion cascades to all user-scoped tables within 30 days. (c) `/delete-account` Netlify function is permissioned to the user's own access token. |
| R8 | (a) Supabase PITR backup window is 7 days — deleted data drops out of backup naturally. (b) No long-term archive backups taken of cycle tables. |

---

## 5. Residual risk

After mitigations, residual risk is assessed as **Low** for all eight identified risks except R4 (cross-border lawful access), which remains **Low-Medium** and cannot be fully eliminated for any cloud-hosted service. The combination of EU region, SCCs, and the controller's commitment to challenge disproportionate requests is the strongest available mitigation absent self-hosting.

### Sign-off

This DPIA does not identify a high residual risk that would require **prior consultation with the Slovak DPA under Art. 36 GDPR**.

Reviewed and approved: [TODO: signature, date]

---

## 6. Stakeholder consultation

- **Data subjects**: not directly consulted on this v1 DPIA; planned via in-app survey post-launch.
- **EU representative**: [TODO: to be consulted on appointment].
- **External legal counsel**: not engaged for v1; recommended before active-user count exceeds 10,000.

---

## 7. Triggers for revision

- Introduction of any new processing of cycle/health data (e.g. ML inference, partner integrations).
- Change of processor location or sub-processor list.
- A reported personal-data breach involving cycle data.
- Annual review (calendar reminder set for 2027-05-18).
- Policy version bump in `src/lib/consents.ts` (`CONSENT_POLICY_VERSION`).
