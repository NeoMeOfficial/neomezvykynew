import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM, Eye } from '../../../components/v2/neome';
import { PlusPage, TopBar, HeroHead, StickyCTA } from './shared';
import { supabase } from '../../../lib/supabase';
import { useSupabaseAuth } from '../../../contexts/SupabaseAuthContext';

/**
 * /onboarding-plus/jedalnicek — meal-plan announcement.
 *
 * Not purchasable at first launch (Gabi 2026-09-02): the €57 Stripe
 * checkout is disabled and the step only announces the plan
 * ("V ponuke čoskoro"), then continues to /onboarding-plus/hotovo.
 * The purchase flow lives in git history for when the plan launches.
 */
export default function PlusNutritionPrompt() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  // Waitlist (Sam 2026-10-05): instead of a dead "coming soon" badge,
  // she can ask to be told when the plan launches — captured in
  // meal_plan_waitlist so the launch audience lives in the database.
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('meal_plan_waitlist').select('user_id').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data) setJoined(true); });
  }, [user?.id]);

  const joinWaitlist = async () => {
    if (!user || joined || joining) return;
    setJoining(true);
    const { error } = await supabase.from('meal_plan_waitlist').insert({ user_id: user.id });
    if (!error || (error as any).code === '23505') setJoined(true);
    setJoining(false);
  };

  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/onboarding-plus/cyklus')} centerLabel="Jedálniček" />
      <HeroHead
        eyebrow="Výživa"
        title="Chystáme pre teba"
        accentTitle="Jedálniček"
        accentColor={NM.SAGE}
        helper="Personalizovaný jedálniček, ktorý zohľadňuje tvoje preferencie — naplnený Gabikinými receptami tak, aby ti pomohol dosiahnuť tvoje ciele."
        size={30}
      />

      <div style={{ padding: '28px 22px 28px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: 22,
            border: `1.5px solid ${NM.SAGE}`,
            boxShadow: '0 14px 34px rgba(139,158,136,0.22)',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
            background:
              `linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 32%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0.55) 80%, rgba(255,255,255,0.35) 100%), ` +
              `url(/images/r9/section-nutrition.jpg) right center / cover no-repeat`,
          }}
        >
          <div style={{ position: 'relative', padding: '22px 22px 22px' }}>
            <Eye color={NM.SAGE} size={10}>Jedálniček</Eye>
            <div style={{ marginTop: 10, fontFamily: NM.SERIF, fontSize: 20, color: NM.DEEP, lineHeight: 1.2 }}>
              6-týždňový plán na mieru
            </div>
            <button
              onClick={joinWaitlist}
              disabled={joined || joining}
              style={{
                all: 'unset',
                boxSizing: 'border-box',
                cursor: joined ? 'default' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                marginTop: 16,
                padding: '11px 18px',
                borderRadius: 999,
                background: joined ? NM.SAGE : 'rgba(139,158,136,0.16)',
                border: `1px solid ${NM.SAGE}`,
                fontFamily: NM.SANS,
                fontSize: 12.5,
                fontWeight: 600,
                color: joined ? '#fff' : NM.SAGE,
              }}
            >
              {joined ? '✓ Dáme ti vedieť' : joining ? 'Moment…' : 'Daj mi vedieť, keď bude dostupný'}
            </button>
          </div>
        </div>

      </div>
      <StickyCTA label="Pokračovať" onClick={() => navigate('/onboarding-plus/hotovo')} />
    </PlusPage>
  );
}
