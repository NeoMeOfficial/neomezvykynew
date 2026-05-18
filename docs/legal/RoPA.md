# Records of Processing Activities (RoPA)

**Article 30 GDPR** — internal compliance document.
This is NeoMe's authoritative record of all processing activities. Update on any material change to data flows, processors, or retention periods.

| | |
|---|---|
| **Controller** | [TODO: NeoMe Pty Ltd — registered Australian entity name] |
| **ABN** | [TODO: ABN] |
| **Registered address** | [TODO: registered office, Australia] |
| **Controller contact** | [TODO: privacy@neome.com.au] |
| **EU representative (Art. 27)** | [TODO: name, EU address, email] |
| **DPO** | Not appointed (Art. 37 thresholds not met at current scale). Re-evaluate when active users exceed ~10,000 or when systematic large-scale monitoring is introduced. |
| **Document version** | 1.0 — 2026-05-18 |
| **Last reviewed** | 2026-05-18 |
| **Next review** | 2026-11-18 (every 6 months, or on any material change) |

---

## Processing activities

### 1. User account management

- **Purpose**: Create, authenticate, and maintain user accounts; deliver core app functionality.
- **Categories of data subjects**: NeoMe end-users (adult women in Slovakia primarily, EU residents).
- **Categories of personal data**: Email address, first name, last name, password hash (bcrypt via Supabase Auth), Google ID and avatar URL (if signed in via Google), account creation date, last login timestamp.
- **Special categories**: None in this activity.
- **Legal basis**: Art. 6(1)(b) — performance of a contract (the Terms of Service).
- **Recipients / processors**: Supabase (EU region) — DB + auth.
- **Third-country transfers**: Supabase parent entity in USA; safeguarded by Standard Contractual Clauses (Module 2, Commission Decision 2021/914).
- **Retention**: Lifetime of the account + 30 days grace, then hard-deleted via `auth.users` cascade.
- **Security measures**: TLS 1.2+ in transit; AES-256 at rest (Supabase managed); RLS policies; bcrypt password hashing; admin role gated by JWT app_metadata claim.

### 2. Cycle tracking (health data)

- **Purpose**: Record menstrual cycle, symptoms, mood, energy, sleep, fertility indicators; compute phase predictions and personalised content recommendations.
- **Categories of data subjects**: NeoMe end-users who opt in to cycle tracking.
- **Categories of personal data**: Cycle start dates, period length, flow intensity, symptom selections, mood selections, energy level, sleep quality, mucus/fertility, free-text notes.
- **Special categories (Art. 9)**: Yes — data concerning health.
- **Legal basis**: Art. 9(2)(a) — explicit consent recorded in `consent_events` table (`consent_type = 'health_data'`). Consent surfaces at the moment of first save (CyklusLog or mark-period-start in Periodka).
- **Recipients / processors**: Supabase only.
- **Third-country transfers**: As per §1.
- **Retention**: Lifetime of the account + 30 days; hard-deleted on account deletion.
- **Security**: As §1, plus RLS policies restricting row visibility to `auth.uid() = user_id`.

### 3. Payments and subscriptions

- **Purpose**: Process subscription payments and one-off purchases (NeoMe Plus, meal-plan add-ons); manage billing lifecycle.
- **Categories of data subjects**: Paying users.
- **Categories of personal data**: Email, name, subscription status, Stripe customer ID, payment events log.
- **Special categories**: None.
- **Legal basis**: Art. 6(1)(b) — contract performance; Art. 6(1)(c) — legal obligation (Slovak Accounting Act 431/2002 — 10-year retention of accounting records).
- **Recipients / processors**: Stripe Payments Europe Ltd. (Ireland) — independent controller for card data; processor for the subscription record we hold.
- **Third-country transfers**: Stripe sub-processors in USA; SCCs in place via Stripe DPA.
- **Retention**: Stripe customer record indefinitely (per Stripe ToS); accounting records 10 years; subscription metadata in our DB for active subscription + 7 years.
- **Security**: NeoMe never stores card data — all collection happens directly on Stripe Checkout (PCI-DSS Level 1 attested).

### 4. Community posts and comments

- **Purpose**: Allow users to publish posts/comments/likes in the Komunita section.
- **Categories of data subjects**: Users who opt in to community participation.
- **Categories of personal data**: User-generated text content, author display name, post timestamps, like counts, reply threads.
- **Special categories**: Potentially — users may voluntarily disclose health data in posts. Handled as user-generated disclosure, not solicited by us.
- **Legal basis**: Art. 6(1)(b) — contract performance; Art. 6(1)(a) — consent (`consent_type = 'community'`) for the publication itself, recorded at first post.
- **Recipients**: Other authenticated NeoMe users (public posts), authorised moderators/admins.
- **Retention**: Until user deletes the post or their account.
- **Security**: RLS restricts mutation to author; server-side moderation pipeline blocks content with policy violations before publishing.

### 5. Marketing communications

- **Purpose**: Send newsletters, product announcements, optional tips to subscribed users.
- **Categories of data subjects**: Users who explicitly opt in (typically prompted after first checkout).
- **Categories of personal data**: Email, first name, language preference (`sk`).
- **Special categories**: None.
- **Legal basis**: Art. 6(1)(a) — consent (`consent_type = 'marketing'`), freely revocable.
- **Recipients / processors**: [TODO: ESP — Mailchimp / Brevo / Resend — pick one and update here].
- **Third-country transfers**: Depends on ESP choice; SCCs in place via the ESP's DPA.
- **Retention**: Until consent withdrawn (in-app toggle or email unsubscribe link) + 30 days.
- **Security**: Withdrawal of marketing consent automatically excludes user from future sends within 24h.

### 6. Transactional communications

- **Purpose**: Send purchase confirmations, password resets, email verification, security alerts, account-deletion confirmations.
- **Categories of data subjects**: All users.
- **Categories of personal data**: Email, account-related context.
- **Special categories**: None.
- **Legal basis**: Art. 6(1)(b) — contract performance; Art. 6(1)(c) — legal obligation (proof of delivery for certain transactional emails).
- **Recipients / processors**: Supabase Auth (transactional emails); Stripe (receipts).
- **Retention**: 12 months (delivery logs); receipts indefinite per Stripe ToS.

### 7. Application logs and error tracking

- **Purpose**: Detect and debug application errors; monitor service health.
- **Categories of data subjects**: All users whose sessions encounter an error.
- **Categories of personal data**: User ID (when available), IP address, user agent, error stack traces, request URL.
- **Special categories**: None unless inadvertently captured in error context (we scrub known sensitive fields).
- **Legal basis**: Art. 6(1)(f) — legitimate interest in maintaining service security and reliability. Balancing test: low impact on data subjects, high necessity for service operation.
- **Recipients / processors**: [TODO: Sentry / similar — pick one and update here]; Netlify (function logs).
- **Third-country transfers**: As per processor's DPA.
- **Retention**: 12 months.

### 8. Consent records

- **Purpose**: Evidence Art. 7 GDPR — demonstrate when, how, and what each user consented to.
- **Categories of data subjects**: All users.
- **Categories of personal data**: User ID, consent type, granted/withdrawn, policy version, user agent, IP (optional), timestamp, source.
- **Special categories**: None.
- **Legal basis**: Art. 6(1)(c) — legal obligation to demonstrate compliance (Art. 7(1) GDPR).
- **Recipients**: Internal compliance team only; admins read via JWT role claim.
- **Retention**: Lifetime of the account + 30 days, then cascade-deleted with `auth.users`.
- **Security**: Append-only via `record_consent()` SECURITY DEFINER RPC; direct INSERT/UPDATE/DELETE blocked by RLS.

### 9. Referrals

- **Purpose**: Track invite-driven sign-ups and credit balances.
- **Categories of data subjects**: Referrer + referred users.
- **Categories of personal data**: User IDs, referral codes, credit amounts, approval status.
- **Legal basis**: Art. 6(1)(b) — contract performance.
- **Retention**: Lifetime of account.

---

## Sub-processors (consolidated)

| Sub-processor | Service | Location | Safeguards |
|---|---|---|---|
| Supabase Inc. | DB, auth, storage | EU (Frankfurt), parent in USA | SCCs via Supabase DPA |
| Stripe Payments Europe Ltd. | Payment processing | Ireland | SCCs via Stripe DPA |
| Netlify Inc. | App hosting, serverless functions | USA | SCCs via Netlify DPA |
| Google LLC | OAuth sign-in | USA / IE | SCCs via Google Cloud DPA + EU-US Data Privacy Framework |
| [TODO: ESP] | Marketing emails | TBD | TBD |
| [TODO: Sentry or equivalent] | Error tracking | USA / EU choice | SCCs via vendor DPA |
| Spoonacular | Recipe API (anonymised requests only — no user data sent) | USA | N/A — no personal data transferred |

DPA files retained locally at `legal/dpa/` (gitignored).

---

## Cross-border transfers

All transfers outside the EEA rely on **Standard Contractual Clauses (Module 2 — Controller to Processor)** as adopted by Commission Implementing Decision (EU) 2021/914 of 4 June 2021.

Additional safeguards documented per processor:
- **Stripe**: PCI-DSS Level 1; tokenisation of card data (NeoMe never receives raw PAN).
- **Supabase**: At-rest AES-256; in-transit TLS 1.2+; RLS-enforced row visibility.
- **Google Cloud**: EU-US Data Privacy Framework adequacy (active since July 2023) plus SCCs as belt-and-braces.

---

## Categories of data subjects' rights — fulfilment paths

| Right | In-app self-service | Email path |
|---|---|---|
| Access (Art. 15) | Settings → Súkromie → Stiahnuť moje dáta | privacy@neome.com.au |
| Rectification (Art. 16) | Settings → Profil | privacy@neome.com.au |
| Erasure (Art. 17) | Settings → Súkromie → Zmazať účet | privacy@neome.com.au |
| Restriction (Art. 18) | — | privacy@neome.com.au |
| Portability (Art. 20) | Settings → Súkromie → Stiahnuť moje dáta (JSON) | privacy@neome.com.au |
| Object (Art. 21) | Settings → Súkromie → toggle relevant consent off | privacy@neome.com.au |
| Withdraw consent (Art. 7(3)) | Settings → Súkromie → Súhlasy section | privacy@neome.com.au |

All in-app data export and account deletion is rate-limited to once per 24h to prevent abuse but is otherwise free and fulfilled immediately.

---

## Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-05-18 | Initial RoPA created alongside GDPR consent system rollout. |
