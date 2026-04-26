import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Page, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Profil — R7 variant B (editorial dashboard)
 *
 * Hero photo + avatar, progress card with streak + 3 stats,
 * active programs (Plus) / upgrade hint (Free), subscription card,
 * settings rows, logout.
 *
 * Wired:
 * - User name from useSupabaseAuth
 * - isPremium from useSubscription
 * - signOut() wired
 *
 * TODO data: real streak, exercise/reflection/recipe counts, active
 * programs from existing services. Static placeholders match design.
 *
 * Old version: Profil.old.tsx.
 */

interface IconProps {
  color: string;
}

function IFlame({ color }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ITarget({ color }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IHeart({ color }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IBell({ color }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IShield({ color }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IHelp({ color }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ILogOut({ color }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SectionHead({ children }: { children: string }) {
  return (
    <div style={{ padding: '26px 22px 12px' }}>
      <Eye size={10}>{children}</Eye>
    </div>
  );
}

function Row({ icon, label, value, onClick, last }: { icon: { bg: string; el: React.ReactNode }; label: string; value?: string; onClick?: () => void; last?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        borderBottom: last ? 'none' : `1px solid ${NM.HAIR}`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 10, background: icon.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon.el}
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>{label}</div>
        {value && <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{value}</div>}
      </div>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NM.TERTIARY} strokeWidth="2" strokeLinecap="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

export default function Profil() {
  const navigate = useNavigate();
  const { user, signOut } = useSupabaseAuth();
  const { isPremium } = useSubscription();

  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const fullName = meta.full_name ?? meta.name ?? user?.email?.split('@')[0] ?? 'Eva Nová';

  return (
    <Page>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          paddingTop: 56,
          paddingBottom: 28,
          backgroundImage: `linear-gradient(180deg, rgba(248,245,240,0) 20%, rgba(248,245,240,0.7) 80%, ${NM.BG} 100%), url(/images/r9/lifestyle-yoga-pose.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      >
        <div style={{ padding: '0 22px' }}>
          <Eye color="rgba(61,41,33,0.65)">Môj profil</Eye>
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 999,
                background: 'url(/images/r9/testimonial-lucia.jpg) center/cover',
                border: '3px solid #fff',
                boxShadow: '0 10px 30px rgba(61,41,33,0.18)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Ser size={26}>{fullName}</Ser>
                {isPremium && <PlusTag />}
              </div>
              {/* TODO data: life stage from user_metadata */}
              <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 999, background: NM.SAGE }} />
                Postpartum · 14. týždeň
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress card */}
      <div style={{ margin: '-6px 20px 0' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', border: `1px solid ${NM.HAIR}`, boxShadow: '0 12px 36px rgba(61,41,33,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <Eye size={10}>Tvoj pokrok</Eye>
            <button onClick={() => navigate('/profil/stats')} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERRA, fontWeight: 500 }}>
              Detaily ›
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: `${NM.TERRA}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IFlame color={NM.TERRA} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div>
                <span style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.02em' }}>{isPremium ? 18 : 4}</span>
                <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginLeft: 5, fontWeight: 400 }}>dní v rade</span>
              </div>
              <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, marginTop: 2, fontWeight: 400 }}>
                {isPremium ? 'Rekord: 32 dní' : 'Začiatok cesty'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {[
              { n: isPremium ? 42 : 8, l: 'cvičení', c: NM.SAGE },
              { n: isPremium ? 86 : 12, l: 'reflexií', c: NM.MAUVE },
              { n: isPremium ? 29 : 0, l: 'receptov', c: NM.GOLD },
            ].map((s) => (
              <div key={s.l} style={{ flex: 1, padding: '10px 4px', borderRadius: 12, background: NM.CREAM_2 ?? '#F1ECE3', textAlign: 'center' }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 17, fontWeight: 500, color: s.c, lineHeight: 1, letterSpacing: '-0.01em' }}>{s.n}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: NM.EYEBROW, marginTop: 5, fontWeight: 500 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs */}
      <div style={{ margin: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <Eye size={10}>Moje programy</Eye>
          <button onClick={() => navigate('/kniznica/telo/programy')} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERRA, fontWeight: 500 }}>
            Všetky ›
          </button>
        </div>
        {isPremium ? (
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { t: 'BodyForming', w: 'Týždeň 4', img: 'program-body-forming.jpg' },
              { t: 'Postpartum', w: 'Týždeň 8', img: 'program-postpartum.jpg' },
            ].map((p) => (
              <div
                key={p.t}
                style={{
                  flex: 1,
                  borderRadius: 18,
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  position: 'relative',
                  backgroundImage: `url(/images/r9/${p.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(42,26,20,0.78) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px' }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{p.w}</div>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: '#fff', marginTop: 3, letterSpacing: '-0.005em' }}>{p.t}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ borderRadius: 18, padding: '22px 20px', background: NM.CREAM_2 ?? '#F1ECE3', border: `1px solid ${NM.HAIR}`, textAlign: 'center' }}>
            <Ser size={18} style={{ marginBottom: 6 }}>Bez aktívneho programu</Ser>
            <Body size={12}>
              Vyber si z 4 programov po prechode na <strong style={{ color: NM.GOLD, fontWeight: 500 }}>Plus</strong>.
            </Body>
          </div>
        )}
      </div>

      {/* Subscription */}
      <div style={{ margin: '22px 20px 0' }}>
        {isPremium ? (
          <button
            onClick={() => navigate('/profil/subscription')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              padding: '18px 20px',
              borderRadius: 18,
              background: `linear-gradient(135deg, ${NM.DEEP_2} 0%, ${NM.DEEP} 100%)`,
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}40, transparent 70%)` }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Eye color={NM.GOLD} size={10}>NeoMe Plus · aktívne</Eye>
                <div style={{ fontFamily: NM.SANS, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>Spravovať ›</div>
              </div>
              {/* TODO data: real next-payment date + last 4 from Stripe */}
              <div style={{ fontFamily: NM.SERIF, fontSize: 17, fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.005em', marginBottom: 4 }}>
                Ďalšia platba 21. máj
              </div>
              <div style={{ fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>9,99 € / mes · Visa · 4242</div>
            </div>
          </button>
        ) : (
          <div style={{ padding: '22px 20px', borderRadius: 20, background: `linear-gradient(135deg, ${NM.CREAM_3 ?? '#EAE3D6'} 0%, ${NM.CREAM_2 ?? '#F1ECE3'} 100%)`, border: `1px solid ${NM.HAIR}`, position: 'relative', overflow: 'hidden' }}>
            <Eye color={NM.GOLD} size={10} style={{ marginBottom: 10 }}>NeoMe Plus</Eye>
            <Ser size={22} style={{ lineHeight: 1.2 }}>
              Odomkni <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>celú cestu</em>
            </Ser>
            <Body size={12} style={{ marginTop: 8 }}>Programy Telo, plný cyklus, návyky a reflexia s históriou.</Body>
            <button
              onClick={() => navigate('/paywall')}
              style={{
                marginTop: 14,
                padding: '12px 22px',
                background: NM.DEEP,
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                fontFamily: NM.SANS,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.02em',
                cursor: 'pointer',
              }}
            >
              Prejsť na Plus
            </button>
            <div style={{ marginTop: 8, fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400 }}>Prvý mesiac 4,99 € · potom 9,99 € / mes</div>
          </div>
        )}
      </div>

      {/* Settings */}
      <SectionHead>Nastavenia</SectionHead>
      <div style={{ margin: '0 20px', background: NM.CREAM_2 ?? '#F1ECE3', borderRadius: 18, overflow: 'hidden' }}>
        <Row icon={{ bg: 'rgba(255,255,255,0.7)', el: <ITarget color={NM.SAGE} /> }} label="Ciele a životná fáza" value="Postpartum · 14. týždeň" onClick={() => navigate('/settings/goals')} />
        <Row icon={{ bg: 'rgba(255,255,255,0.7)', el: <IHeart color={NM.TERRA} /> }} label="Uložené" value="12 receptov · 8 meditácií" onClick={() => navigate('/oblubene')} />
        <Row icon={{ bg: 'rgba(255,255,255,0.7)', el: <IBell color={NM.DUSTY} /> }} label="Upozornenia" value="Ráno 7:30 · Reflexia 21:00" onClick={() => navigate('/settings/notifications')} />
        <Row icon={{ bg: 'rgba(255,255,255,0.7)', el: <IShield color={NM.MAUVE} /> }} label="Súkromie a údaje" onClick={() => navigate('/settings/privacy')} />
        <Row icon={{ bg: 'rgba(255,255,255,0.7)', el: <IHelp color={NM.DEEP} /> }} label="Pomoc a spätná väzba" onClick={() => navigate('/settings/help')} last />
      </div>

      {/* Sign out */}
      <div style={{ margin: '22px 20px 0', textAlign: 'center' }}>
        <button
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 26px',
            borderRadius: 999,
            background: 'transparent',
            border: `1px solid ${NM.HAIR_2}`,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: NM.MUTED,
            fontWeight: 400,
          }}
        >
          <ILogOut color={NM.MUTED} />
          <span style={{ marginLeft: 2 }}>Odhlásiť sa</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, padding: '0 20px' }}>
        <Body size={10.5} color={NM.TERTIARY}>NeoMe · v2.4.0</Body>
      </div>
    </Page>
  );
}
