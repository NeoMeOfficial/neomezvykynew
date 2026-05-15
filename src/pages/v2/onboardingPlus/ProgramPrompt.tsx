import { useNavigate } from 'react-router-dom';
import { NM } from '../../../components/v2/neome';
import { PlusPage, TopBar, HeroHead, BigCard } from './shared';

/**
 * /onboarding-plus/program — first screen of the post-subscription flow.
 * Asks whether the user wants to pick a program now or later.
 *   • "Vyberiem si teraz" → /onboarding-plus/program-select
 *   • "Vyberiem si neskôr" → /onboarding-plus/cyklus (skip directly)
 */
export default function PlusProgramPrompt() {
  const navigate = useNavigate();
  return (
    <PlusPage>
      <TopBar onBack={() => navigate('/checkout/success?type=subscription')} centerLabel="Tvoja cesta" />
      <div style={{ marginTop: 8 }}>
        <HeroHead
          eyebrow="Programy NeoMe"
          title="Vyberieš si"
          accentTitle="program teraz?"
          accentColor={NM.TERRA}
          helper="Programy sú 6–8 týždňové sprievodcovia — od jemného postpartum návratu po silový tréning. Môžeš si jeden vybrať teraz alebo neskôr v Knižnici."
          size={30}
        />
      </div>
      <div style={{ padding: '28px 22px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <BigCard
          recommended
          accent={NM.TERRA}
          title="Vyberiem si teraz"
          description="Pomôžeme ti začať s tým, čo ti najviac sedí — od postpartum po silový tréning."
          onClick={() => navigate('/onboarding-plus/program-select')}
        />
        <BigCard
          title="Vyberiem si neskôr"
          description="Pôjdem rovno do appky a zoznámim sa s ňou. Program si pridám neskôr."
          onClick={() => navigate('/onboarding-plus/cyklus')}
        />
      </div>
    </PlusPage>
  );
}
