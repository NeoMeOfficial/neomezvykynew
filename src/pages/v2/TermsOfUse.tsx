import { CSSProperties, ReactNode } from 'react';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Podmienky používania (Terms of Use) — companion to PrivacyPolicy.
 *
 * Covers: contract formation, eligibility, account terms, subscription &
 * billing (Plus tiers + meal-plan one-off), cancellation & refunds
 * (Slovak distance-contract right to withdraw within 14 days, with the
 * digital-content carve-out), acceptable use, IP, disclaimers about
 * health content, liability cap, governing law, dispute resolution.
 *
 * Mirrors PrivacyPolicy.tsx for visual consistency. Same OPERATOR
 * constant — keep in sync if it changes there.
 *
 * IMPORTANT: This is a starting draft. Have a Slovak/EU consumer
 * lawyer review before launch. Placeholders marked [TODO: ...] need
 * real values.
 */

const EFFECTIVE_DATE = '18. máj 2026';
const LAST_UPDATED = '18. máj 2026';

const OPERATOR = {
  name: 'NeoMe Group Pty Ltd',
  abn: '93690647137',
  address: '4 Maidstone Street, Melbourne 3018, Australia',
  email: 'gabi@neome.com.au',
};

interface SectionProps {
  no: string;
  title: string;
  children: ReactNode;
}

function Section({ no, title, children }: SectionProps) {
  return (
    <section style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
        <Eye size={10} color={NM.GOLD}>{no}</Eye>
        <Ser size={20}>{title}</Ser>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </section>
  );
}

function P({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <Body size={14} style={{ lineHeight: 1.65, ...style }}>
      {children}
    </Body>
  );
}

function Strong({ children }: { children: ReactNode }) {
  return <span style={{ color: NM.DEEP, fontWeight: 500 }}>{children}</span>;
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, paddingLeft: 4 }}>
      <span style={{ color: NM.GOLD, marginTop: 6 }}>•</span>
      <Body size={14} style={{ lineHeight: 1.65, flex: 1 }}>{children}</Body>
    </div>
  );
}

export default function TermsOfUse() {
  return (
    <Page>
      <BackHeader title="Podmienky používania" showSearch={false} />

      <main style={{ padding: '8px 22px 64px' }}>
        <Eye color={NM.GOLD} style={{ marginBottom: 8 }}>NeoMe — Podmienky</Eye>
        <Ser size={34} style={{ marginBottom: 14 }}>
          Podmienky používania
        </Ser>
        <Body size={13} color={NM.TERTIARY}>
          Účinné od: {EFFECTIVE_DATE} &nbsp;·&nbsp; Posledná aktualizácia: {LAST_UPDATED}
        </Body>

        <div style={{ marginTop: 22 }}>
          <P>
            Vitaj v NeoMe. Tieto Podmienky používania upravujú prístup a používanie
            mobilnej a webovej aplikácie NeoMe (ďalej len <Strong>„Služba“</Strong>),
            ktorú prevádzkuje {OPERATOR.name}, IČ: {OPERATOR.abn}, so sídlom{' '}
            {OPERATOR.address} (ďalej len <Strong>„Prevádzkovateľ“</Strong>,{' '}
            <Strong>„my“</Strong>, <Strong>„nás“</Strong>).
          </P>
          <P style={{ marginTop: 8 }}>
            Vytvorením účtu alebo používaním Služby potvrdzuješ, že si si tieto
            Podmienky prečítala, rozumieš im a súhlasíš s nimi. Ak s niektorou časťou
            nesúhlasíš, Službu prosím nepoužívaj.
          </P>
        </div>

        <Section no="1" title="Spôsobilosť a účet">
          <P>
            Službu môžeš používať, ak máš najmenej <Strong>16 rokov</Strong> a si
            spôsobilá na právne úkony. Ak si mladšia, vyžaduje sa súhlas zákonného
            zástupcu v zmysle čl. 8 GDPR.
          </P>
          <P>
            Účet je osobný. Si zodpovedná za uchovanie prihlasovacích údajov
            v tajnosti a za všetky aktivity v rámci svojho účtu. Pri podozrení
            na neoprávnený prístup nás bezodkladne kontaktuj na{' '}
            <a href={`mailto:${OPERATOR.email}`} style={{ color: NM.DEEP, fontWeight: 500 }}>
              {OPERATOR.email}
            </a>.
          </P>
          <P>
            Súhlasíš, že počas registrácie poskytneš pravdivé a aktuálne údaje
            a budeš ich udržiavať aktuálne.
          </P>
        </Section>

        <Section no="2" title="Funkcie Služby">
          <P>
            NeoMe poskytuje vzdelávací a wellness obsah — cvičebné programy,
            recepty, jedálničky, meditácie, sledovanie menštruačného cyklu,
            denník reflexií, návyky a komunitné prostredie pre ženy.
          </P>
          <P>
            <Strong>Bez lekárskej zodpovednosti.</Strong> Obsah Služby má informačný
            a vzdelávací charakter. <Strong>Nenahrádza lekársku radu</Strong>,
            diagnózu ani liečbu. Pred zmenou pohybového alebo nutričného režimu —
            najmä v tehotenstve, dojčení, po pôrode alebo pri zdravotných ťažkostiach —
            sa poraď so svojím lekárom.
          </P>
        </Section>

        <Section no="3" title="Predplatné, ceny a platba">
          <P>
            Vybrané funkcie sú prístupné v rámci platenej úrovne <Strong>NeoMe Plus</Strong>,
            ktorú si predplatíš v jednej z troch periodicít:
          </P>
          <Bullet>
            <Strong>Mesačne</Strong> — 24,90 € s opakovanou platbou každý mesiac.
          </Bullet>
          <Bullet>
            <Strong>Štvrťročne</Strong> — 63 € (≈ 21 €/mesiac) s opakovanou platbou
            každé tri mesiace.
          </Bullet>
          <Bullet>
            <Strong>Ročne</Strong> — 199 € (≈ 16,58 €/mesiac) s opakovanou platbou raz ročne.
          </Bullet>
          <P>
            <Strong>Jednorazové nákupy.</Strong> Personalizovaný 6-týždňový{' '}
            <Strong>Jedálniček</Strong> je samostatný produkt s jednorazovou platbou
            57 €. Po zakúpení zostáva v tvojom profile.
          </P>
          <P>
            <Strong>Spracovanie platby.</Strong> Platby spracúva spoločnosť Stripe.
            Údaje o platobnej karte nikdy neukladáme na našich serveroch.
          </P>
          <P>
            <Strong>Obnovenie.</Strong> Predplatné sa <Strong>automaticky obnovuje</Strong>
            {' '}na konci každého fakturačného obdobia za rovnakú cenu, kým ho nezrušíš.
            Pred zmenou ceny ti dáme vedieť e-mailom najmenej 14 dní vopred.
          </P>
          <P>
            <Strong>Daň.</Strong> Uvedené ceny zahŕňajú DPH, ak sa uplatňuje.
          </P>
        </Section>

        <Section no="4" title="Zrušenie a odstúpenie od zmluvy">
          <P>
            Predplatné môžeš kedykoľvek <Strong>zrušiť</Strong> v sekcii
            <Strong> Profil → Predplatné</Strong>. Zrušenie ukončí ďalšie automatické
            obnovenie; prístup k Plus funkciám zostane do konca už zaplateného obdobia.
            Pomerné vrátenie sa štandardne neposkytuje.
          </P>
          <P>
            <Strong>Právo na odstúpenie od zmluvy (spotrebitelia v EÚ).</Strong> Ako
            spotrebiteľka máš v zmysle § 7 zákona č. 102/2014 Z. z. právo odstúpiť od
            zmluvy uzatvorenej na diaľku <Strong>do 14 dní</Strong> od jej uzavretia,
            a to bez uvedenia dôvodu.
          </P>
          <P>
            <Strong>Výnimka pre digitálny obsah.</Strong> Pri digitálnom obsahu
            (vrátane prístupu k programom, receptom, meditáciám a jedálničku)
            právo na odstúpenie zaniká, ak nám pred uplynutím lehoty výslovne udelíš
            súhlas so začatím poskytovania a potvrdíš, že strácaš právo na odstúpenie
            (§ 7 ods. 6 písm. l) zákona č. 102/2014 Z. z.). Pri kúpe ťa o tomto
            výslovne informujeme a tvoj súhlas vyžiadame.
          </P>
          <P>
            Ak chceš odstúpiť pred začatím poskytovania, napíš nám na{' '}
            <a href={`mailto:${OPERATOR.email}`} style={{ color: NM.DEEP, fontWeight: 500 }}>
              {OPERATOR.email}
            </a>{' '}
            so žiadosťou o vrátenie platby.
          </P>
        </Section>

        <Section no="5" title="Akceptovateľné použitie">
          <P>Pri používaní Služby súhlasíš, že nebudeš:</P>
          <Bullet>vydávať sa za inú osobu alebo zámerne uvádzať nepravdivé údaje;</Bullet>
          <Bullet>zverejňovať obsah, ktorý je nezákonný, urážlivý, nenávistný, sexuálne explicitný, klamlivý alebo spamový;</Bullet>
          <Bullet>obťažovať, zastrašovať alebo šikanovať iné členky komunity;</Bullet>
          <Bullet>publikovať lekárske odporúčania ako odborníčka, ak ňou nie si;</Bullet>
          <Bullet>používať Službu na komerčné účely bez nášho písomného súhlasu;</Bullet>
          <Bullet>pokúšať sa obchádzať platobné mechanizmy, hackovať, scrapovať alebo automatizovane sťahovať obsah;</Bullet>
          <Bullet>nahrávať škodlivý kód, vírusy alebo zaťažovať infraštruktúru.</Bullet>
          <P>
            Vyhradzujeme si právo <Strong>odstrániť príspevky</Strong>, ktoré porušujú
            tieto pravidlá, alebo <Strong>obmedziť/zrušiť účet</Strong> pri závažnom
            alebo opakovanom porušení.
          </P>
        </Section>

        <Section no="6" title="Obsah, ktorý nahrávaš">
          <P>
            Príspevky, komentáre, fotografie, zápisy v denníku a iné texty, ktoré
            v Službe zverejníš (<Strong>„Tvoj obsah“</Strong>), zostávajú tvojím
            vlastníctvom. Udeľuješ nám <Strong>nevýhradnú, bezplatnú a celosvetovú
            licenciu</Strong> na ich zobrazovanie, ukladanie a sprístupňovanie v rámci
            Služby — v rozsahu, ktorý je nevyhnutný na jej fungovanie.
          </P>
          <P>
            Pri zmazaní účtu sa Tvoj obsah odstráni; technické zálohy môžu existovať
            do 30 dní pred trvalou likvidáciou.
          </P>
          <P>
            Potvrdzuješ, že máš právo zverejniť obsah, ktorý nahrávaš, a že neporušuje
            práva tretích osôb.
          </P>
        </Section>

        <Section no="7" title="Náš obsah a duševné vlastníctvo">
          <P>
            Cvičenia, videá, meditácie, recepty, programy, texty, dizajn,
            ochranné známky <Strong>„NeoMe“</Strong> a celá vizuálna identita sú
            chránené autorským právom a inými právami duševného vlastníctva.
            Patria nám alebo našim licenčným partnerom.
          </P>
          <P>
            Udeľujeme ti <Strong>osobnú, nevýhradnú, neprenosnú a odvolateľnú
            licenciu</Strong> na používanie obsahu pre vlastné, nekomerčné účely
            počas trvania tvojho prístupu.
          </P>
          <P>
            Bez nášho výslovného súhlasu nemôžeš obsah kopírovať, redistribuovať,
            verejne prezentovať ani upravovať na publikovanie.
          </P>
        </Section>

        <Section no="8" title="Zdravotné upozornenie">
          <P>
            <Strong>Pred začatím cvičenia sa poraď s lekárom</Strong>, ak si tehotná,
            v šestonedelí, dojčíš, máš diastázu, problémy s panvovým dnom, srdcové
            ochorenie, vysoký krvný tlak, alebo akékoľvek iné zdravotné obmedzenie.
          </P>
          <P>
            Cvič v rozsahu svojich možností. Pri bolesti alebo nevoľnosti prestaň
            a vyhľadaj odbornú pomoc. NeoMe nenesie zodpovednosť za zranenia
            vyplývajúce z nesprávneho prevedenia alebo zo zdravotných okolností,
            o ktorých sme neboli informovaní.
          </P>
        </Section>

        <Section no="9" title="Ochrana osobných údajov">
          <P>
            Spôsob spracúvania osobných údajov vrátane údajov o zdraví (menštruačný
            cyklus, symptómy) je opísaný v dokumente{' '}
            <a href="/privacy" style={{ color: NM.DEEP, fontWeight: 500 }}>
              Zásady ochrany osobných údajov
            </a>
            , ktorý tvorí neoddeliteľnú súčasť týchto Podmienok.
          </P>
        </Section>

        <Section no="10" title="Obmedzenie zodpovednosti">
          <P>
            Služba je poskytovaná <Strong>„tak, ako je“</Strong>. Nezaručujeme, že
            bude vždy dostupná bez prerušenia, bez chýb, alebo že obsah bude
            zodpovedať tvojim konkrétnym potrebám.
          </P>
          <P>
            V rozsahu povolenom právnym poriadkom <Strong>vylučujeme zodpovednosť za
            nepriame, následné, exemplárne alebo náhodné škody</Strong> vrátane ušlého
            zisku, straty údajov alebo straty príležitosti.
          </P>
          <P>
            Naša celková zodpovednosť voči tebe v súvislosti s týmito Podmienkami
            je obmedzená do výšky <Strong>sumy, ktorú si nám zaplatila za predplatné
            v 12 mesiacoch</Strong> predchádzajúcich vzniku nároku.
          </P>
          <P>
            <Strong>Toto obmedzenie sa nevzťahuje</Strong> na zodpovednosť za úmysel,
            hrubú nedbanlivosť, ujmu na zdraví alebo ďalšie nároky, ktoré podľa
            zákona nemožno vylúčiť.
          </P>
        </Section>

        <Section no="11" title="Zmeny Podmienok">
          <P>
            Tieto Podmienky môžeme z času na čas aktualizovať — napr. pri zmene
            funkcií alebo právnych požiadaviek. <Strong>Podstatné zmeny</Strong> ti
            oznámime e-mailom alebo notifikáciou v aplikácii najmenej 14 dní pred
            ich účinnosťou. Pokračovaním v používaní Služby po uplynutí tejto lehoty
            potvrdzuješ súhlas s novou verziou.
          </P>
        </Section>

        <Section no="12" title="Ukončenie">
          <P>
            Účet môžeš kedykoľvek zmazať v sekcii{' '}
            <Strong>Nastavenia → Zmazať účet</Strong>. Pred zmazaním máš možnosť
            stiahnuť si vlastné údaje v sekcii{' '}
            <Strong>Nastavenia → Súkromie → Export údajov</Strong>.
          </P>
          <P>
            Vyhradzujeme si právo <Strong>obmedziť alebo zrušiť tvoj účet</Strong>
            {' '}pri závažnom porušení týchto Podmienok, podvodnom správaní alebo
            ohrození bezpečnosti Služby.
          </P>
          <P>
            Ustanovenia, ktoré majú podľa svojej povahy prežiť ukončenie (najmä
            duševné vlastníctvo, obmedzenie zodpovednosti, rozhodné právo),
            zostávajú v platnosti aj po ukončení.
          </P>
        </Section>

        <Section no="13" title="Rozhodné právo a riešenie sporov">
          <P>
            Tieto Podmienky a vzťahy medzi tebou a Prevádzkovateľom sa riadia právom
            <Strong> Austrálie (Victoria)</Strong>. Ak si však spotrebiteľka s pobytom
            v Slovenskej republike alebo v inom členskom štáte EÚ, máš popri tom
            zachovanú ochranu, ktorú ti poskytujú kogentné ustanovenia právneho
            poriadku štátu tvojho obvyklého pobytu.
          </P>
          <P>
            <Strong>Mimosúdne riešenie sporov.</Strong> Spotrebiteľský spor sa
            môžeš pokúsiť vyriešiť aj prostredníctvom platformy{' '}
            <Strong>RSO (Riešenie sporov online)</Strong> Európskej komisie:{' '}
            <a href="https://ec.europa.eu/consumers/odr" style={{ color: NM.DEEP, fontWeight: 500 }}>
              ec.europa.eu/consumers/odr
            </a>. V Slovenskej republike je príslušnou subjektom alternatívneho
            riešenia sporov <Strong>Slovenská obchodná inšpekcia</Strong>{' '}
            (<a href="https://www.soi.sk" style={{ color: NM.DEEP, fontWeight: 500 }}>www.soi.sk</a>).
          </P>
        </Section>

        <Section no="14" title="Kontakt">
          <P>
            Otázky k týmto Podmienkam, žiadosti o odstúpenie alebo reklamácie smeruj na:
          </P>
          <P>
            {OPERATOR.name}<br />
            {OPERATOR.address}<br />
            E-mail:{' '}
            <a href={`mailto:${OPERATOR.email}`} style={{ color: NM.DEEP, fontWeight: 500 }}>
              {OPERATOR.email}
            </a>
          </P>
        </Section>

        <div style={{ marginTop: 36, paddingTop: 18, borderTop: `1px solid ${NM.HAIR ?? 'rgba(61,41,33,0.08)'}` }}>
          <Body size={11} color={NM.TERTIARY}>
            Verzia z {LAST_UPDATED}. Pri vážnych zmenách ti dáme vedieť e-mailom alebo
            v aplikácii. Predošlé verzie poskytneme na požiadanie.
          </Body>
        </div>
      </main>
    </Page>
  );
}
