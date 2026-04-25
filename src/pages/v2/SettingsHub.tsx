/**
 * Settings · Hub — main settings index
 *
 * Adapted from prototype: neome/round10-app.jsx (R10 — Settings · hub)
 *
 * Just navigation. No tweakable values live here — those are in the leaf pages.
 *
 * Last group is destructive: cancel subscription + log out + delete account.
 */

import { Link } from "react-router-dom";
import { TopBar } from "@/components/v2/top-bar";
import { SettingsGroup, SettingsRow } from "@/components/v2/settings-row";
import { useUser } from "@/hooks/use-user";

export default function SettingsHubPage() {
  const user = useUser();

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Nastavenia" backHref="/profil" />

      <div className="px-[18px] mt-4 flex flex-col gap-6">
        <SettingsGroup label="Účet">
          <SettingsRow href="/nastavenia/profil" title="Profil" />
          <SettingsRow href="/nastavenia/predplatne" title="Predplatné" hint={user.tier === "plus" ? "Plus" : "Free"} />
          <SettingsRow href="/nastavenia/platba" title="Spôsob platby" />
        </SettingsGroup>

        <SettingsGroup label="App">
          <SettingsRow href="/nastavenia/upozornenia" title="Upozornenia" />
          <SettingsRow href="/nastavenia/sukromie" title="Súkromie" />
          <SettingsRow href="/nastavenia/jazyk" title="Jazyk" hint="Slovenčina" />
          <SettingsRow href="/nastavenia/data" title="Stiahnuť moje dáta" />
        </SettingsGroup>

        <SettingsGroup label="Pomoc">
          <SettingsRow href="/podpora" title="Podpora" />
          <SettingsRow href="/podmienky" title="Podmienky" />
          <SettingsRow href="/sukromie-info" title="Zásady súkromia" />
          <SettingsRow href="/o-aplikacii" title="O aplikácii" hint="v1.0" />
        </SettingsGroup>

        <SettingsGroup>
          {user.tier === "plus" && (
            <SettingsRow
              href="/nastavenia/zrusit"
              title="Zrušiť predplatné"
              tone="danger"
            />
          )}
          <SettingsRow href="/odhlasit" title="Odhlásiť sa" tone="danger" />
          <SettingsRow href="/zmazat-ucet" title="Zmazať účet" tone="danger" />
        </SettingsGroup>

        <p className="text-center text-fg-3 text-xs mt-2">
          NeoMe · Made in Slovensko
        </p>
      </div>
    </div>
  );
}
