import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Page, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Completion · Program — R10 (bigger moment)
 *
 * Shown when a multi-week program is finished. Larger hero, gold
 * "Gratulujem, <name>" headline, big +50 points + new badge card,
 * "Kam ďalej" recommendation, primary CTA.
 *
 * Wired:
 * - User's first name from useSupabaseAuth → headline
 *
 * FEATURE-NEEDED-COMPLETION-PROGRAM-BADGE: real badge issuance via the
 * achievements service (currently shows "Postpartum · dokončené" hardcoded).
 * FEATURE-NEEDED-COMPLETION-NEXT-PROGRAM: dynamic recommendation based
 * on the program just completed (currently always recommends BodyForming).
 */

function deriveFirstName(user: { email?: string | null; user_metadata?: { full_name?: string; name?: string } } | null): string {
  if (!user) return 'Eva';
  const meta = user.user_metadata;
  if (meta?.full_name) return meta.full_name.split(' ')[0];
  if (meta?.name) return meta.name.split(' ')[0];
  if (user.email) return user.email.split('@')[0].split('.')[0].replace(/^[a-z]/, (c) => c.toUpperCase());
  return 'Eva';
}

export default function CompletionProgram() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const firstName = deriveFirstName(user as never);

  return (
    <Page paddingBottom={40}>
      <div
        style={{
          height: 380,
          position: 'relative',
          backgroundImage: 'url(/images/r9/program-postpartum.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0.1), rgba(248,245,240,1))' }} />
        <div style={{ position: 'absolute', bottom: 30, left: 18, right: 18 }}>
          <Eye color={NM.GOLD}>Program dokončený</Eye>
          <Ser size={44} style={{ marginTop: 10 }}>
            Gratulujem,
            <br />
            <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>{firstName}</em>.
          </Ser>
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        <Body size={15} color={NM.DEEP} weight={400}>
          4 týždne si kráčala pomaly, no pravidelne. 28 cvičení. 18 dní v rade. Toto si ty — a je to len začiatok.
        </Body>
      </div>

      <div style={{ margin: '24px 18px 0', padding: '24px 22px', background: `linear-gradient(135deg, ${NM.DEEP_2}, ${NM.DEEP})`, color: '#fff', borderRadius: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}55, transparent 70%)` }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 64, color: NM.GOLD, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>+50</div>
          <div>
            <div style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.GOLD, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>Získala si</div>
            <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, fontStyle: 'italic', marginTop: 4, letterSpacing: '-0.005em' }}>Nový odznak</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2, fontWeight: 400 }}>„Postpartum · dokončené"</div>
          </div>
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Kam ďalej</Eye>
        <button
          onClick={() => navigate('/program/body-forming')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            background: '#fff',
            borderRadius: 18,
            border: `1px solid ${NM.HAIR}`,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ height: 120, backgroundImage: 'url(/images/r9/program-body-forming.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{ padding: '14px 18px' }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.TERRA, fontWeight: 600 }}>Odporúčame ďalej</div>
            <div style={{ fontFamily: NM.SERIF, fontSize: 20, color: NM.DEEP, fontWeight: 500, marginTop: 5, letterSpacing: '-0.005em' }}>BodyForming</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, marginTop: 4, fontWeight: 400 }}>6 týždňov · stredné · prirodzený ďalší krok</div>
          </div>
        </button>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <button
          onClick={() => navigate('/program/body-forming')}
          style={{
            width: '100%',
            padding: '15px 20px',
            background: NM.TERRA,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Začať BodyForming
        </button>
        <button
          onClick={() => navigate('/domov-new')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            marginTop: 12,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: NM.DEEP,
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Späť na Domov
        </button>
      </div>
    </Page>
  );
}
