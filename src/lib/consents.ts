/**
 * GDPR Consents — types, constants, and the canonical policy version.
 *
 * The policy version MUST be bumped every time the privacy policy or
 * TOS materially changes. The current_consents view compares the
 * stored policy_version against this constant in `useConsents()` so
 * the UI can prompt for re-consent on changes.
 *
 * Server-side mirror: supabase/migrations/20260518120000_consents.sql
 */

export const CONSENT_POLICY_VERSION = '2026-05-18';

export const CONSENT_TYPES = {
  /** Acknowledgment of Terms of Service + Privacy Policy. Required to use the app. */
  TOS_PRIVACY: 'tos_privacy',
  /** Art.9(2)(a) GDPR — explicit consent for special-category health data. Required for cycle/symptom features. */
  HEALTH_DATA: 'health_data',
  /** Optional. Marketing communications (newsletter, product news). */
  MARKETING: 'marketing',
  /** Optional. Publishing user-generated content in the Komunita section. */
  COMMUNITY: 'community',
} as const;

export type ConsentType = (typeof CONSENT_TYPES)[keyof typeof CONSENT_TYPES];

export interface ConsentEvent {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  granted: boolean;
  policy_version: string;
  source: 'app' | 'signup' | 'settings' | 'import';
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface CurrentConsent {
  user_id: string;
  consent_type: ConsentType;
  granted: boolean;
  policy_version: string;
  source: string;
  effective_at: string;
}

/** Human-readable Slovak labels for UI surfaces. */
export const CONSENT_LABELS: Record<ConsentType, { title: string; description: string }> = {
  tos_privacy: {
    title: 'Podmienky a Zásady ochrany',
    description: 'Súhlas s podmienkami používania a zásadami spracovania osobných údajov.',
  },
  health_data: {
    title: 'Údaje o zdraví (cyklus, symptómy)',
    description:
      'Výslovný súhlas so spracovaním údajov o zdraví podľa čl. 9 GDPR — potrebný pre sledovanie cyklu, symptómov a nálady.',
  },
  marketing: {
    title: 'Marketingová komunikácia',
    description: 'Občasné e-maily o novinkách, ponukách a tipoch od NeoMe. Môžeš sa kedykoľvek odhlásiť.',
  },
  community: {
    title: 'Zverejňovanie v Komunite',
    description: 'Súhlas s publikovaním tvojich príspevkov, komentárov a reakcií v sekcii Komunita.',
  },
};
