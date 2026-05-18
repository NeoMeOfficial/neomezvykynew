import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { useFavorites } from '../../hooks/useFavorites';
import { useReferral } from '../../hooks/useReferral';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Settings · Delete account — R10
 *
 * Last-chance copy + a card showing what they'd lose (real counts
 * where available) + softer alternatives + "Napriek tomu zmazať účet"
 * outline button.
 *
 * Wired:
 * - 'dní v rade' from useWorkoutHistory.stats.currentStreak
 * - 'získaných bodov' from useReferral.stats.totalCreditsEarned
 * - 'zápisov v denníku' — FEATURE-NEEDED-PROFIL-REFLECTION-COUNT
 *   (no account-scoped reflection count yet); placeholder dash
 * - 'priateľstiev v komunite' — FEATURE-NEEDED-KOMUNITA-FOLLOW
 *   (no follow table yet); placeholder dash
 *
 * Wired (F-007): "Napriek tomu zmazať účet" calls Netlify fn
 * /delete-account which verifies the user's access token, deletes the
 * Stripe customer (if any), and removes the auth user (cascades
 * profile + user-scoped rows via FK on delete cascade).
 *
 * Mounted at /settings/delete.
 */

export default function SettingsDelete() {
  const navigate = useNavigate();
  const { stats } = useWorkoutHistory() as { stats: { currentStreak: number } };
  const { favoritesCount } = useFavorites();
  const { stats: refStats } = useReferral();
  const { signOut } = useSupabaseAuth();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const onDelete = () => {
    if (deleting) return;
    // Open the proper confirmation sheet — no native window.confirm.
    setConfirmText('');
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const res = await fetch('/.netlify/functions/delete-account', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast({
          title: 'Zmazanie zlyhalo',
          description: body.error ?? 'Skús to neskôr.',
          variant: 'destructive',
        });
        setDeleting(false);
        return;
      }
      await signOut();
      navigate('/');
    } catch {
      toast({ title: 'Sieťová chyba', variant: 'destructive' });
      setDeleting(false);
    }
  };

  const streak = stats?.currentStreak ?? 0;
  const credits = refStats?.totalCreditsEarned ?? 0;

  const losses = [
    { n: '—', l: 'zápisov v denníku', c: NM.MAUVE },
    { n: streak.toString(), l: 'dní v rade', c: NM.TERRA },
    { n: credits.toString(), l: 'získaných bodov', c: NM.GOLD },
    { n: favoritesCount.toString(), l: 'uložených receptov', c: NM.SAGE },
  ];

  const alternatives = [
    { id: 'pause-notifs', t: 'Pauznúť notifikácie na týždeň', d: 'Udržíme ti dáta, žiadne správy' },
    { id: 'pause-sub', t: 'Pauznúť predplatné', d: 'Plus sa vráti, keď budeš pripravená' },
  ];

  return (
    <Page>
      <BackHeader title="Zmazať účet" showSearch={false} />
      <div style={{ padding: '0 18px' }}>
        <Ser size={30}>
          Si si <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>istá</em>?
        </Ser>
        <Body size={14} color={NM.DEEP} weight={400} style={{ marginTop: 14 }}>
          Tento krok je trvalý. Stratíš všetky svoje zápisy, program, body aj rozhovory s komunitou.
        </Body>
      </div>

      <div style={{ margin: '24px 18px 0', background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
        {losses.map((s, i) => (
          <div key={s.l} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < losses.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
            <div style={{ width: 40, textAlign: 'right', fontFamily: NM.SERIF, fontSize: 20, color: s.c, fontWeight: 500, letterSpacing: '-0.01em' }}>{s.n}</div>
            <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 12.5, color: NM.MUTED, fontWeight: 400 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: '24px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Radšej by si…</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {alternatives.map((it, i) => (
            <button
              key={it.id}
              onClick={() => navigate(it.id === 'pause-notifs' ? '/settings/notifications' : '/settings/cancel')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                width: '100%',
                padding: '13px 16px',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: i < alternatives.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
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
          onClick={onDelete}
          disabled={deleting}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: 'transparent',
            color: NM.TERRA,
            border: `1px solid ${NM.TERRA}`,
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 500,
            cursor: deleting ? 'wait' : 'pointer',
            opacity: deleting ? 0.6 : 1,
          }}
        >
          {deleting ? 'Mažem účet…' : 'Napriek tomu zmazať účet'}
        </button>
        <button onClick={() => navigate('/settings')} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', marginTop: 12, fontFamily: NM.SANS, fontSize: 12, color: NM.DEEP, textAlign: 'center', fontWeight: 500 }}>
          Vrátiť sa
        </button>
      </div>

      {/* Hard-confirm sheet — GDPR-friendly explicit checklist of what
          gets deleted, plus a typed confirmation so a misclick can't
          irreversibly wipe a user's account. */}
      {confirmOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !deleting && setConfirmOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(42,26,20,0.55)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480,
              background: NM.BG ?? '#F8F5F0',
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              padding: '24px 22px calc(env(safe-area-inset-bottom) + 28px)',
              boxShadow: '0 -10px 32px rgba(61,41,33,0.25)',
              maxHeight: '85vh', overflowY: 'auto',
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(61,41,33,0.18)', margin: '0 auto 16px' }} />
            <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.01em' }}>
              Toto sa <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>nedá vrátiť</em>.
            </div>
            <div style={{ marginTop: 10, fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, fontWeight: 400, lineHeight: 1.55 }}>
              Po zmazaní stratíš nasledovné údaje bez možnosti obnovenia:
            </div>

            <ul style={{ marginTop: 16, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                'Profil a prihlasovacie údaje',
                'Cyklus, symptómy a fázové záznamy',
                'Denník, reflexie a meditačnú históriu',
                'Návyky, streak a pokrok v programe',
                'Príspevky, komentáre a srdcia v komunite',
                'Uložené recepty, jedálničky a obľúbené',
                'Body, odznaky a referal kredity',
                'Aktívne predplatné (zrušíme aj v Stripe)',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, lineHeight: 1.45 }}>
                  <span style={{ color: NM.TERRA, fontWeight: 700, marginTop: 1 }}>×</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 18, padding: 12, background: 'rgba(193,133,106,0.10)', borderRadius: 12, fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, lineHeight: 1.5 }}>
              Tip: ak chceš mať svoje dáta pred zmazaním, najprv si ich stiahni cez <strong style={{ color: NM.DEEP }}>Nastavenia → Súkromie → Export údajov</strong>.
            </div>

            <div style={{ marginTop: 18 }}>
              <label style={{ fontFamily: NM.SANS, fontSize: 12, fontWeight: 500, color: NM.DEEP, display: 'block', marginBottom: 6 }}>
                Napíš <strong>ZMAZAŤ</strong> pre potvrdenie
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px',
                  background: '#fff', border: `1px solid ${NM.HAIR_2 ?? 'rgba(61,41,33,0.14)'}`, borderRadius: 12,
                  fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP, outline: 'none',
                  letterSpacing: '0.04em',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => !deleting && setConfirmOpen(false)}
                disabled={deleting}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 999,
                  background: 'transparent', color: NM.DEEP,
                  border: `1px solid ${NM.HAIR_2 ?? 'rgba(61,41,33,0.14)'}`,
                  fontFamily: NM.SANS, fontSize: 13, fontWeight: 500,
                  cursor: deleting ? 'default' : 'pointer', opacity: deleting ? 0.6 : 1,
                }}
              >
                Zrušiť
              </button>
              <button
                onClick={doDelete}
                disabled={deleting || confirmText.trim() !== 'ZMAZAŤ'}
                style={{
                  flex: 1, padding: '13px 0', borderRadius: 999,
                  background: NM.TERRA, color: '#fff', border: 0,
                  fontFamily: NM.SANS, fontSize: 13, fontWeight: 500,
                  cursor: (deleting || confirmText.trim() !== 'ZMAZAŤ') ? 'not-allowed' : 'pointer',
                  opacity: (deleting || confirmText.trim() !== 'ZMAZAŤ') ? 0.5 : 1,
                }}
              >
                {deleting ? 'Mažem…' : 'Zmazať natrvalo'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </Page>
  );
}
