/**
 * Settings · Notifications — leaf page with toggles
 *
 * Adapted from prototype: neome/round10-app.jsx (R10 — Settings · notifications)
 *
 * Save-on-change pattern: each toggle persists immediately (no Save button).
 * If your stack prefers explicit save, swap the optimistic toggle for a form.
 */

import { TopBar } from "@/components/v2/top-bar";
import { SettingsGroup } from "@/components/v2/settings-row";
import { ToggleRow } from "@/components/ui/toggle-row";
import { useNotificationPrefs } from "@/hooks/use-notification-prefs";

export default function SettingsNotificationsPage() {
  const { prefs, update } = useNotificationPrefs();

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Upozornenia" backHref="/nastavenia" />

      <div className="px-[18px] mt-4 flex flex-col gap-6">
        <SettingsGroup label="Denné">
          <ToggleRow
            title="Ranná zostava"
            subtitle="Krátky prehľad dňa o 8:00"
            checked={prefs.morning}
            onChange={(v) => update({ morning: v })}
          />
          <ToggleRow
            title="Večerná reflexia"
            subtitle="Pripomenutie na zápis o 21:00"
            checked={prefs.evening}
            onChange={(v) => update({ evening: v })}
          />
        </SettingsGroup>

        <SettingsGroup label="Cyklus">
          <ToggleRow
            title="Začiatok novej fázy"
            checked={prefs.cyclePhase}
            onChange={(v) => update({ cyclePhase: v })}
          />
          <ToggleRow
            title="Očakávaná menštruácia"
            subtitle="2 dni vopred"
            checked={prefs.cyclePeriod}
            onChange={(v) => update({ cyclePeriod: v })}
          />
        </SettingsGroup>

        <SettingsGroup label="Komunita">
          <ToggleRow
            title="Reakcie na moje príspevky"
            checked={prefs.communityReactions}
            onChange={(v) => update({ communityReactions: v })}
          />
          <ToggleRow
            title="Odpovede na moje komentáre"
            checked={prefs.communityReplies}
            onChange={(v) => update({ communityReplies: v })}
          />
          <ToggleRow
            title="Týždenný digest"
            subtitle="Pondelok ráno"
            checked={prefs.communityDigest}
            onChange={(v) => update({ communityDigest: v })}
          />
        </SettingsGroup>
      </div>
    </div>
  );
}
