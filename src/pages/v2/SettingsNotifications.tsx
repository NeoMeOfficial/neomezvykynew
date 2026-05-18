import { useEffect, useState } from 'react';
import { TopBar } from '@/components/v2/top-bar';
import { SettingsGroup } from '@/components/v2/settings-row';
import { ToggleRow } from '@/components/ui/toggle-row';
import { useNotificationPrefs } from '@/hooks/use-notification-prefs';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import {
  isPushSupported,
  isCurrentlySubscribed,
  enablePush,
  disablePush,
  currentPermission,
} from '@/lib/push';
import { useToast } from '@/hooks/use-toast';

export default function SettingsNotifications() {
  const { prefs, update } = useNotificationPrefs();
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const supported = isPushSupported();
  const [pushOn, setPushOn] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    if (!supported) return;
    isCurrentlySubscribed().then(setPushOn);
  }, [supported]);

  const onTogglePush = async (next: boolean) => {
    if (!user?.id || pushBusy) return;
    setPushBusy(true);
    const result = next
      ? await enablePush(user.id)
      : await disablePush(user.id);
    if (result.ok) {
      setPushOn(next);
      toast({ title: next ? 'Upozornenia zapnuté' : 'Upozornenia vypnuté' });
    } else {
      // Surface a useful reason — permission_denied is the common one
      // (user blocked at OS level; can't recover without their action).
      const reason = (result as { reason: string }).reason;
      const map: Record<string, string> = {
        permission_denied: 'Povolenie zamietnuté v prehliadači. Zapni ho v nastaveniach systému.',
        unsupported: 'Tvoj prehliadač zatiaľ nepodporuje push (iOS vyžaduje PWA na ploche).',
        no_vapid_key: 'Push ešte nie je nakonfigurovaný — kontaktuj podporu.',
        subscribe_failed: 'Pripojenie k push službe zlyhalo. Skús to neskôr.',
        db_save_failed: 'Uloženie zlyhalo. Skús to ešte raz.',
      };
      toast({
        title: 'Nepodarilo sa zmeniť',
        description: map[reason] ?? reason,
        variant: 'destructive',
      });
    }
    setPushBusy(false);
  };

  const perm = currentPermission();

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Upozornenia" backHref="/settings" />

      <div className="mt-4 flex flex-col">
        {/* Master push toggle — must be enabled for any of the
            scheduled reminders to actually deliver. */}
        <SettingsGroup label="Push notifikácie">
          <ToggleRow
            title="Povoliť upozornenia"
            subtitle={
              !supported
                ? 'Nepodporované — iOS vyžaduje pridanie na plochu'
                : perm === 'denied'
                  ? 'Zablokované v prehliadači'
                  : pushOn
                    ? 'Aktívne na tomto zariadení'
                    : 'Zapnúť pre pripomienky'
            }
            checked={pushOn}
            disabled={!supported || perm === 'denied' || pushBusy}
            onChange={onTogglePush}
          />
        </SettingsGroup>

        <SettingsGroup label="Denné">
          <ToggleRow
            title="Ranná zostava"
            subtitle="Krátky prehľad dňa o 8:00"
            checked={prefs.morning}
            onChange={v => update({ morning: v })}
          />
          <ToggleRow
            title="Večerná reflexia"
            subtitle="Pripomenutie na zápis o 21:00"
            checked={prefs.evening}
            onChange={v => update({ evening: v })}
          />
        </SettingsGroup>

        <SettingsGroup label="Cyklus">
          <ToggleRow
            title="Začiatok novej fázy"
            checked={prefs.cyclePhase}
            onChange={v => update({ cyclePhase: v })}
          />
          <ToggleRow
            title="Očakávaná menštruácia"
            subtitle="2 dni vopred"
            checked={prefs.cyclePeriod}
            onChange={v => update({ cyclePeriod: v })}
          />
        </SettingsGroup>

        <SettingsGroup label="Komunita">
          <ToggleRow
            title="Reakcie na moje príspevky"
            checked={prefs.communityReactions}
            onChange={v => update({ communityReactions: v })}
          />
          <ToggleRow
            title="Odpovede na moje komentáre"
            checked={prefs.communityReplies}
            onChange={v => update({ communityReplies: v })}
          />
          <ToggleRow
            title="Týždenný digest"
            subtitle="Pondelok ráno"
            checked={prefs.communityDigest}
            onChange={v => update({ communityDigest: v })}
          />
        </SettingsGroup>
      </div>
    </div>
  );
}
