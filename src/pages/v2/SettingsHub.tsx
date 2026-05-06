import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/v2/top-bar';
import { SettingsGroup, SettingsRow } from '@/components/v2/settings-row';
import { useUser } from '@/hooks/use-user';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function SettingsHub() {
  const navigate = useNavigate();
  const { signOut } = useSupabaseAuth();
  const user = useUser();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Nastavenia" backHref="/profil" />

      <div className="mt-4 flex flex-col">
        <SettingsGroup label="Účet">
          <SettingsRow label="Profil" onClick={() => navigate('/settings/profile')} />
          <SettingsRow
            label="Predplatné"
            value={user.tier === 'plus' ? 'Plus' : 'Free'}
            onClick={() => navigate('/profil/predplatne')}
          />
          <SettingsRow label="Spôsob platby" onClick={() => navigate('/profil/predplatne')} />
        </SettingsGroup>

        <SettingsGroup label="App">
          <SettingsRow label="Upozornenia" onClick={() => navigate('/settings/notifications')} />
          <SettingsRow label="Súkromie" onClick={() => navigate('/settings/privacy')} />
          <SettingsRow label="Jazyk" value="Slovenčina" onClick={() => {}} />
          <SettingsRow label="Stiahnuť moje dáta" onClick={() => {}} />
        </SettingsGroup>

        <SettingsGroup label="Pomoc">
          <SettingsRow label="Podpora" onClick={() => {}} />
          <SettingsRow label="Podmienky" onClick={() => {}} />
          <SettingsRow label="Zásady súkromia" onClick={() => navigate('/settings/privacy')} />
          <SettingsRow label="O aplikácii" value="v1.0" onClick={() => {}} />
        </SettingsGroup>

        <SettingsGroup>
          {user.tier === 'plus' && (
            <SettingsRow
              label="Zrušiť predplatné"
              tone="danger"
              onClick={() => navigate('/settings/cancel')}
            />
          )}
          <SettingsRow label="Odhlásiť sa" tone="danger" onClick={handleSignOut} />
          <SettingsRow
            label="Zmazať účet"
            tone="danger"
            onClick={() => navigate('/settings/delete')}
          />
        </SettingsGroup>

        <p className="text-center text-ink/40 text-xs mt-2">NeoMe · Made in Slovensko</p>
      </div>
    </div>
  );
}
