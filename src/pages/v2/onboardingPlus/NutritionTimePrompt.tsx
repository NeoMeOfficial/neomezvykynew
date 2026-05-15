import { useNavigate } from 'react-router-dom';
import { NM } from '../../../components/v2/neome';
import { PlusPage, TopBar, HeroHead, BigCard } from './shared';

/**
 * /onboarding-plus/jedalnicek-cas — after the meal-plan payment lands,
 * ask whether the user wants to fill the 12-step questionnaire now or
 * later.
 *   • "Nastavím teraz" → /onboarding-plus/jedalnicek-memo
 *   • "Nastavím neskôr" → /onboarding-plus/hotovo
 */
export default function PlusNutritionTimePrompt() {
  const navigate = useNavigate();
  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/onboarding-plus/jedalnicek')} centerLabel="Jedálniček" />
      <HeroHead
        eyebrow="Výživa"
        title="Nastavíme si jedálniček"
        accentTitle="teraz?"
        accentColor={NM.GOLD}
        helper="Aby sme pripravili tvoj prvý plán, potrebujeme zopár detailov o cieli, životnom štýle a chutiach."
        size={28}
      />
      <div style={{ padding: '28px 22px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <BigCard
          recommended
          accent={NM.GOLD}
          title="Nastavím teraz"
          description="Trvá približne 2 minúty. Po dokončení dostaneš svoj prvý týždenný plán."
          onClick={() => navigate('/onboarding-plus/jedalnicek-memo')}
        />
        <BigCard
          title="Nastavím neskôr"
          description="Pôjdem do appky a Jedálniček si nastavím, keď budem mať čas."
          onClick={() => navigate('/onboarding-plus/hotovo')}
        />
      </div>
    </PlusPage>
  );
}
