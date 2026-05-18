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
        </SettingsGroup>

        <SettingsGroup label="Pomoc">
          <SettingsRow
            label="Kontakt na podporu"
            value="klientky@neome.com.au"
            onClick={() => {
              window.location.href = 'mailto:klientky@neome.com.au?subject=NeoMe%20-%20Podpora';
            }}
          />
          <SettingsRow label="Zásady súkromia" onClick={() => navigate('/settings/privacy')} />
          <SettingsRow label="Podmienky používania" onClick={() => navigate('/terms')} />
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
