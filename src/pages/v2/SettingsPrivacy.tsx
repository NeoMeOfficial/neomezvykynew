import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';
import { useConsents } from '../../hooks/useConsents';
import { CONSENT_LABELS, CONSENT_TYPES, ConsentType } from '../../lib/consents';

/**
 * Settings · Privacy & data — R10
 *
 * Visibility segment, permissions toggles, data actions list.
 *
 * Wired (F-029 / F-032):
 * - Visibility + permission toggles persist to profiles.privacy_prefs
 *   jsonb via updateProfile.
 * - "Stiahnuť moje dáta" calls Netlify fn /export-user-data which
 *   aggregates user-scoped tables and returns a JSON download.
 *   Rate-limited to 1/24h via profiles.last_data_export_at.
 *
 * Mounted at /settings/privacy.
 */

const PERMS = [
  { id: 'msgs', t: 'Dovoliť správy od členiek', defaultOn: true },
  { id: 'diary', t: 'Zobrazovať môj denník v profile', defaultOn: false },
  { id: 'stats', t: 'Zdieľať moje štatistiky v komunite', defaultOn: false },
  { id: 'analytics', t: 'Analytika aplikácie', defaultOn: true },
];

const DATA_ACTIONS = [
  { id: 'export', t: 'Stiahnuť moje dáta', d: 'PDF export všetkých zápisov a štatistík' },
  { id: 'rules', t: 'Zásady ochrany osobných údajov', d: 'Ako spracúvame tvoje údaje (GDPR)' },
  { id: 'thirdparty', t: 'Tretie strany', d: 'Stripe, Supabase, Google, Netlify' },
];

// Order in which consents appear in the UI — TOS first (most important),
// health-data second (Article 9 / cycle features), then optional ones.
const CONSENT_DISPLAY_ORDER: ConsentType[] = [
  CONSENT_TYPES.TOS_PRIVACY,
  CONSENT_TYPES.HEALTH_DATA,
  CONSENT_TYPES.MARKETING,
  CONSENT_TYPES.COMMUNITY,
];

export default function SettingsPrivacy() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useSupabaseAuth();
  const { toast } = useToast();
  const { consents, isGranted, grant, withdraw, loading: consentsLoading } = useConsents();
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [perms, setPerms] = useState<Record<string, boolean>>(() => Object.fromEntries(PERMS.map((p) => [p.id, p.defaultOn])));
  const [exporting, setExporting] = useState(false);
  const [consentBusy, setConsentBusy] = useState<ConsentType | null>(null);

  const toggleConsent = async (type: ConsentType, nextValue: boolean) => {
    if (consentBusy) return;
    setConsentBusy(type);
    const { error } = nextValue
      ? await grant(type, 'settings')
      : await withdraw(type, 'settings');
    setConsentBusy(null);
    if (error) {
      toast({ title: 'Nepodarilo sa uložiť', variant: 'destructive' });
    } else {
      toast({
        title: nextValue ? 'Súhlas udelený' : 'Súhlas odvolaný',
        description: nextValue ? undefined : 'Záznam zostáva v audit logu pre účely preukázania.',
      });
    }
  };

  useEffect(() => {
    const prefs = (profile?.privacy_prefs ?? {}) as Record<string, boolean | string>;
    if (Object.keys(prefs).length === 0) return;
    if (prefs.visibility === 'public' || prefs.visibility === 'private') {
      setVisibility(prefs.visibility);
    }
    setPerms((s) => {
      const next = { ...s };
      Object.keys(s).forEach((k) => {
        if (typeof prefs[k] === 'boolean') next[k] = prefs[k] as boolean;
      });
      return next;
    });
  }, [profile?.privacy_prefs]);

  const persist = async (vNext: 'public' | 'private', pNext: Record<string, boolean>) => {
    const { error } = await updateProfile({
      privacy_prefs: { visibility: vNext, ...pNext },
    } as Partial<typeof profile>);
    if (error) toast({ title: 'Nepodarilo sa uložiť', variant: 'destructive' });
  };

  const onVisibility = (v: 'public' | 'private') => {
    setVisibility(v);
    persist(v, perms);
  };

  const onTogglePerm = (id: string) => {
    setPerms((s) => {
      const next = { ...s, [id]: !s[id] };
      persist(visibility, next);
      return next;
    });
  };

  const onExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const res = await fetch('/.netlify/functions/export-user-data', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast({
          title: 'Export zlyhal',
          description: body.error === 'rate_limited' ? 'Skús to o 24 hodín.' : 'Skús to neskôr.',
          variant: 'destructive',
        });
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neome-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Export pripravený' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Page>
      <BackHeader title="Súkromie a dáta" showSearch={false} />
      <div style={{ padding: '0 18px' }}>
        <Ser size={28}>
          Tvoje dáta,
          <br />
          <em style={{ color: NM.DEEP, fontStyle: 'italic', fontWeight: 500 }}>tvoje pravidlá</em>
        </Ser>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Viditeľnosť profilu</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, padding: 4, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {(['public', 'private'] as const).map((v) => {
            const sel = visibility === v;
            return (
              <button
                key={v}
                onClick={() => onVisibility(v)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '9px 4px',
                  textAlign: 'center' as const,
                  borderRadius: 10,
                  background: sel ? NM.DEEP : 'transparent',
                  color: sel ? '#fff' : NM.MUTED,
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  fontWeight: sel ? 500 : 400,
                }}
              >
                {v === 'public' ? 'Verejný' : 'Súkromný'}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Oprávnenia</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {PERMS.map((p, i) => {
            const on = perms[p.id];
            return (
              <div key={p.id} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < PERMS.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400, maxWidth: '75%' }}>{p.t}</div>
                <button
                  onClick={() => onTogglePerm(p.id)}
                  aria-pressed={on}
                  style={{ all: 'unset', cursor: 'pointer', width: 40, height: 24, borderRadius: 999, background: on ? NM.DEEP : NM.HAIR_2, position: 'relative', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'all .2s' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Súhlasy (GDPR)</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {CONSENT_DISPLAY_ORDER.map((type, i) => {
            const label = CONSENT_LABELS[type];
            const granted = isGranted(type);
            const required = type === CONSENT_TYPES.TOS_PRIVACY;
            const row = consents[type];
            const effective = row?.effective_at
              ? new Date(row.effective_at).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' })
              : null;
            const busy = consentBusy === type;
            return (
              <div
                key={type}
                style={{
                  padding: '14px 16px',
                  borderBottom: i < CONSENT_DISPLAY_ORDER.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {label.title}
                    {required && <span style={{ fontSize: 10, color: NM.TERRA, fontWeight: 500 }}>· povinné</span>}
                  </div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, marginTop: 3, fontWeight: 300, lineHeight: 1.5 }}>
                    {label.description}
                  </div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, marginTop: 6, letterSpacing: '0.02em' }}>
                    {consentsLoading
                      ? 'Načítavam…'
                      : granted
                        ? `Udelené${effective ? ` · ${effective}` : ''}`
                        : row && !row.granted
                          ? `Odvolané${effective ? ` · ${effective}` : ''}`
                          : 'Nezaznamenané'}
                  </div>
                </div>
                <button
                  onClick={() => toggleConsent(type, !granted)}
                  disabled={busy || (required && granted)}
                  aria-pressed={granted}
                  title={required && granted ? 'Tento súhlas je povinný na používanie aplikácie. Pre odvolanie zruš účet.' : undefined}
                  style={{
                    all: 'unset',
                    cursor: busy || (required && granted) ? 'not-allowed' : 'pointer',
                    opacity: busy ? 0.5 : 1,
                    width: 40,
                    height: 24,
                    borderRadius: 999,
                    background: granted ? NM.DEEP : NM.HAIR_2,
                    position: 'relative',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <div style={{ position: 'absolute', top: 2, left: granted ? 18 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'all .2s' }} />
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, marginTop: 8, lineHeight: 1.55, padding: '0 4px' }}>
          Tvoje rozhodnutia o súhlasoch sú zaznamenané v nemennom audit logu (čl. 7 GDPR). Odvolanie súhlasu nemá spätné účinky na predchádzajúce spracovanie.
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Dáta</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {DATA_ACTIONS.map((it, i) => (
            <button
              key={it.id}
              onClick={() => {
                if (it.id === 'export') {
                  onExport();
                } else if (it.id === 'rules') {
                  navigate('/privacy');
                } else if (it.id === 'thirdparty') {
                  // Third-party processors are documented in section 4
                  // of the privacy policy itself — point there.
                  navigate('/privacy');
                }
              }}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                width: '100%',
                padding: '13px 16px',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: i < DATA_ACTIONS.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>{it.t}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{it.d}</div>
              </div>
              <div style={{ color: NM.TERTIARY, fontSize: 16 }}>›</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: '28px 18px 0' }}>
        <button
          onClick={() => navigate('/settings/delete')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            padding: '14px 20px',
            background: 'transparent',
            color: NM.TERRA,
            border: `1px solid ${NM.TERRA}`,
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'center' as const,
            boxSizing: 'border-box',
          }}
        >
          Zmazať účet
        </button>
      </div>
    </Page>
  );
}
