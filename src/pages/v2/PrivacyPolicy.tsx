import { CSSProperties, ReactNode } from 'react';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Zásady ochrany osobných údajov (Privacy Policy) — GDPR compliant
 *
 * NeoMe processes special-category health data (Art. 9 GDPR) of EU data
 * subjects. Operator is a non-EU entity, so Art. 27 (EU representative)
 * applies. Public route — accessible without authentication.
 *
 * IMPORTANT: Placeholders marked [TODO: ...] MUST be filled with real
 * legal data before this is exposed to live users.
 */

const EFFECTIVE_DATE = '18. máj 2026';
const LAST_UPDATED = '18. máj 2026';

// === REPLACE WITH REAL LEGAL DATA BEFORE GO-LIVE ===
const OPERATOR = {
  name: '[TODO: NeoMe Pty Ltd — presná obchodná firma podľa Austrálskeho registra]',
  abn: '[TODO: ABN]',
  address: '[TODO: registrované sídlo, Austrália]',
  email: '[TODO: privacy@neome.com.au]',
};
const EU_REPRESENTATIVE = {
  name: '[TODO: Meno zástupcu v EÚ podľa čl. 27 GDPR]',
  address: '[TODO: adresa zástupcu v EÚ / EHP]',
  email: '[TODO: eu-rep@neome.com.au]',
};
// ===================================================

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

function Definition({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div style={{ paddingLeft: 4 }}>
      <Body size={14} style={{ lineHeight: 1.65 }}>
        <Strong>{term}.</Strong> {children}
      </Body>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <Page>
      <BackHeader title="Zásady ochrany" showSearch={false} />

      <main style={{ padding: '8px 22px 0' }}>
        <Eye color={NM.GOLD} style={{ marginBottom: 8 }}>NeoMe — GDPR</Eye>
        <Ser size={34} style={{ marginBottom: 14 }}>
          Zásady ochrany osobných údajov
        </Ser>
        <Body size={13} color={NM.TERTIARY}>
          Účinné od: {EFFECTIVE_DATE} &nbsp;·&nbsp; Posledná aktualizácia: {LAST_UPDATED}
        </Body>

        <div
          style={{
            marginTop: 18,
            padding: 14,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            borderRadius: 14,
          }}
        >
          <P>
            Tieto zásady opisujú, ako aplikácia <Strong>NeoMe</Strong> („my", „naša služba",
            „aplikácia") spracúva vaše osobné údaje v súlade s Nariadením Európskeho parlamentu
            a Rady (EÚ) 2016/679 zo dňa 27. apríla 2016 o ochrane fyzických osôb pri spracúvaní
            osobných údajov a o voľnom pohybe takýchto údajov (ďalej len <Strong>„GDPR"</Strong>)
            a so zákonom č. 18/2018 Z. z. o ochrane osobných údajov v platnom znení.
          </P>
          <div style={{ height: 8 }} />
          <P>
            NeoMe spracúva údaje o vašom zdraví (vrátane údajov o menštruačnom cykle, symptómoch,
            nálade a telesnej aktivite). Tieto údaje patria do <Strong>osobitnej kategórie
            osobných údajov</Strong> podľa čl. 9 GDPR a vyžadujú váš <Strong>výslovný súhlas</Strong>.
            Súhlas môžete kedykoľvek odvolať.
          </P>
        </div>

        <Section no="1" title="Prevádzkovateľ a kontaktné údaje">
          <P>
            Prevádzkovateľom v zmysle čl. 4 ods. 7 GDPR je:
          </P>
          <div style={{ paddingLeft: 4 }}>
            <P><Strong>{OPERATOR.name}</Strong></P>
            <P>ABN: {OPERATOR.abn}</P>
            <P>Sídlo: {OPERATOR.address}</P>
            <P>E-mail: {OPERATOR.email}</P>
          </div>

          <div style={{ height: 6 }} />

          <P>
            <Strong>Zástupca v Európskej únii (čl. 27 GDPR).</Strong> Keďže prevádzkovateľ
            nie je usadený v EÚ a ponúka služby dotknutým osobám v EÚ, ustanovil písomne
            zástupcu v Únii, na ktorého sa môžete obrátiť vo všetkých záležitostiach
            súvisiacich so spracúvaním vašich osobných údajov:
          </P>
          <div style={{ paddingLeft: 4 }}>
            <P><Strong>{EU_REPRESENTATIVE.name}</Strong></P>
            <P>Adresa: {EU_REPRESENTATIVE.address}</P>
            <P>E-mail: {EU_REPRESENTATIVE.email}</P>
          </div>
        </Section>

        <Section no="2" title="Aké osobné údaje spracúvame">
          <P>Spracúvame nasledovné kategórie osobných údajov:</P>
          <Definition term="Identifikačné a kontaktné údaje">
            meno, priezvisko, e-mailová adresa, profilová fotografia, dátum narodenia
            (ak ho zadáte), Google ID (ak sa prihlasujete cez Google).
          </Definition>
          <Definition term="Údaje o zdraví (osobitná kategória — čl. 9 GDPR)">
            dátumy menštruácie, dĺžka cyklu, symptómy (bolesť, nálada, energia, libido),
            poznámky k cyklu, údaje o cvičení a stravovaní, ciele v oblasti zdravia
            a telesnej hmotnosti.
          </Definition>
          <Definition term="Údaje o používaní aplikácie">
            navštívené obrazovky, dokončené cvičenia, prehrané meditácie, uložené recepty,
            zvyky (návyky) a štatistiky pokroku.
          </Definition>
          <Definition term="Komunitné údaje">
            obsah, ktorý zverejníte v sekcii Komunita (príspevky, komentáre, „páči sa mi to"),
            správy odoslané iným používateľom.
          </Definition>
          <Definition term="Platobné údaje">
            informácie o predplatnom NeoMe Plus a jednorazových nákupoch.
            <Strong> Údaje platobnej karty nikdy nespracúvame ani neukladáme</Strong> —
            tieto sú spracúvané priamo poskytovateľom platobnej brány (Stripe).
          </Definition>
          <Definition term="Technické údaje">
            IP adresa, typ zariadenia, operačný systém, jazyk prehliadača, identifikátor relácie,
            časové pečiatky prístupu.
          </Definition>
        </Section>

        <Section no="3" title="Účely spracúvania a právne základy">
          <P>
            Vaše údaje spracúvame iba na konkrétne a vopred určené účely a vždy na základe
            jedného z právnych základov podľa čl. 6, prípadne čl. 9 GDPR:
          </P>
          <Bullet>
            <Strong>Poskytovanie služby</Strong> (registrácia, autentifikácia, ukladanie pokroku,
            personalizácia obsahu) — právny základ: <Strong>plnenie zmluvy</Strong> (čl. 6 ods. 1
            písm. b GDPR).
          </Bullet>
          <Bullet>
            <Strong>Sledovanie menštruačného cyklu, symptómov a zdravotných cieľov</Strong>
            — právny základ: <Strong>váš výslovný súhlas</Strong> (čl. 9 ods. 2 písm. a GDPR).
            Bez tohto súhlasu vám nemôžeme poskytnúť tieto funkcie aplikácie.
          </Bullet>
          <Bullet>
            <Strong>Spracovanie platieb a predplatného</Strong> — právny základ: plnenie zmluvy
            a plnenie zákonných povinností (účtovníctvo, dane).
          </Bullet>
          <Bullet>
            <Strong>Komunitné funkcie</Strong> (zverejňovanie príspevkov, komentárov, správ)
            — právny základ: plnenie zmluvy a váš súhlas.
          </Bullet>
          <Bullet>
            <Strong>Bezpečnosť, prevencia podvodov, ladenie chýb</Strong> — právny základ:
            <Strong> oprávnený záujem</Strong> (čl. 6 ods. 1 písm. f GDPR) na zabezpečení
            funkčnosti a integrity služby.
          </Bullet>
          <Bullet>
            <Strong>Marketingová komunikácia</Strong> (newsletter, ponuky NeoMe Plus)
            — právny základ: <Strong>váš súhlas</Strong>, ktorý môžete kedykoľvek odvolať.
          </Bullet>
          <Bullet>
            <Strong>Plnenie zákonných povinností</Strong> (uchovávanie účtovných dokladov,
            odpovedanie orgánom verejnej moci) — čl. 6 ods. 1 písm. c GDPR.
          </Bullet>
        </Section>

        <Section no="4" title="Príjemcovia a sprostredkovatelia">
          <P>
            Vaše údaje sprístupňujeme iba dôveryhodným sprostredkovateľom, ktorí konajú
            výhradne podľa našich pokynov a s ktorými máme uzatvorenú zmluvu o spracúvaní
            podľa čl. 28 GDPR:
          </P>
          <Definition term="Supabase Inc. (USA / EÚ)">
            hosting databázy, autentifikácia, ukladanie údajov o profile, cykle a komunite.
          </Definition>
          <Definition term="Stripe Payments Europe, Ltd. (Írsko)">
            spracovanie platieb a predplatného. Stripe je samostatný prevádzkovateľ pre údaje
            platobnej karty; viď zásady Stripe na <em>stripe.com/privacy</em>.
          </Definition>
          <Definition term="Google LLC (Írsko / USA)">
            iba ak sa rozhodnete prihlásiť cez Google OAuth — Google nám oznámi vašu
            e-mailovú adresu, meno a profilovú fotografiu.
          </Definition>
          <Definition term="Netlify, Inc. (USA)">
            hosting webovej aplikácie a doručovanie obsahu.
          </Definition>
          <Definition term="Spoonacular (USA)">
            poskytovanie receptov a nutričných údajov (iba anonymizované požiadavky;
            neprenášajú sa vaše osobné údaje).
          </Definition>
          <P>
            Vaše údaje <Strong>nepredávame</Strong> tretím stranám a nepoužívame ich
            na reklamné cielenie mimo NeoMe.
          </P>
        </Section>

        <Section no="5" title="Prenos údajov mimo EÚ / EHP">
          <P>
            Prevádzkovateľ má sídlo v Austrálii a niektorí naši sprostredkovatelia
            (Supabase, Netlify, Stripe, Google) majú servery alebo materské spoločnosti
            mimo Európskeho hospodárskeho priestoru. V takom prípade prenos prebieha
            výlučne na základe primeraných záruk podľa kapitoly V GDPR, najmä:
          </P>
          <Bullet>
            <Strong>štandardných zmluvných doložiek</Strong> schválených Európskou komisiou
            (rozhodnutie 2021/914), prípadne
          </Bullet>
          <Bullet>
            rozhodnutia Komisie o primeranej úrovni ochrany (napr. EU-US Data Privacy
            Framework), tam, kde je to relevantné.
          </Bullet>
          <P>
            Kópiu týchto záruk vám na požiadanie poskytneme prostredníctvom kontaktov
            uvedených v bode 1.
          </P>
        </Section>

        <Section no="6" title="Doba uchovávania">
          <Bullet>
            <Strong>Údaje účtu a profilu</Strong> — počas trvania vášho účtu a 30 dní
            po jeho zrušení (pre prípad obnovenia), potom sú trvale vymazané.
          </Bullet>
          <Bullet>
            <Strong>Údaje o cykle a zdraví</Strong> — počas aktívneho používania aplikácie;
            pri zrušení účtu sú vymazané do 30 dní.
          </Bullet>
          <Bullet>
            <Strong>Platobné a fakturačné údaje</Strong> — 10 rokov v zmysle zákona
            č. 431/2002 Z. z. o účtovníctve.
          </Bullet>
          <Bullet>
            <Strong>Komunitné príspevky</Strong> — kým ich nezmažete, alebo nezrušíte účet.
          </Bullet>
          <Bullet>
            <Strong>Logy a bezpečnostné záznamy</Strong> — najviac 12 mesiacov.
          </Bullet>
        </Section>

        <Section no="7" title="Vaše práva ako dotknutej osoby">
          <P>V súvislosti so spracúvaním vašich osobných údajov máte tieto práva:</P>
          <Definition term="Právo na prístup (čl. 15)">
            získať potvrdenie, či spracúvame vaše údaje, a kópiu týchto údajov.
          </Definition>
          <Definition term="Právo na opravu (čl. 16)">
            opraviť nesprávne alebo doplniť neúplné údaje.
          </Definition>
          <Definition term={'Právo na vymazanie (čl. 17 — „právo byť zabudnutý")'}>
            požadovať vymazanie vašich údajov, ak už nie sú potrebné, odvoláte súhlas,
            alebo spracúvanie bolo nezákonné.
          </Definition>
          <Definition term="Právo na obmedzenie spracúvania (čl. 18)">
            obmedziť spracúvanie v stanovených prípadoch.
          </Definition>
          <Definition term="Právo na prenosnosť (čl. 20)">
            získať svoje údaje v štruktúrovanom, bežne používanom strojovo čitateľnom formáte
            a preniesť ich inému prevádzkovateľovi.
          </Definition>
          <Definition term="Právo namietať (čl. 21)">
            namietať proti spracúvaniu založenému na našom oprávnenom záujme alebo
            na priamom marketingu.
          </Definition>
          <Definition term="Právo odvolať súhlas (čl. 7 ods. 3)">
            kedykoľvek odvolať akýkoľvek udelený súhlas; odvolanie nemá spätné účinky.
          </Definition>
          <Definition term="Právo nepodliehať automatizovanému rozhodovaniu (čl. 22)">
            NeoMe nepoužíva automatizované rozhodovanie s právnymi účinkami.
          </Definition>
          <div style={{ height: 6 }} />
          <P>
            Svoje práva si môžete uplatniť priamo v aplikácii (sekcia <Strong>Nastavenia → Súkromie</Strong>:
            export údajov, zrušenie účtu) alebo nás kontaktovať na {OPERATOR.email}.
            Žiadosti vybavíme bezodkladne, najneskôr do <Strong>30 dní</Strong>.
          </P>
          <div style={{ height: 6 }} />
          <P>
            <Strong>Právo podať sťažnosť dozornému orgánu.</Strong> Ak sa domnievate, že
            spracúvanie vašich osobných údajov porušuje GDPR, máte právo podať sťažnosť
            <Strong> Úradu na ochranu osobných údajov Slovenskej republiky</Strong> (Hraničná 12,
            820 07 Bratislava 27, www.dataprotection.gov.sk), prípadne dozornému orgánu
            v inom členskom štáte EÚ.
          </P>
        </Section>

        <Section no="8" title="Cookies a podobné technológie">
          <P>
            Aplikácia používa nevyhnutné technické cookies a obdobné technológie
            (najmä <em>localStorage</em>) na zachovanie vašej relácie, uloženie nastavení
            a fungovanie aplikácie. Tieto cookies nevyžadujú súhlas.
          </P>
          <P>
            Analytické a marketingové cookies (ak budú v budúcnosti zavedené) budú nastavované
            len na základe vášho aktívneho súhlasu prostredníctvom cookie lišty.
          </P>
        </Section>

        <Section no="9" title="Bezpečnosť údajov">
          <P>
            Vaše údaje sú prenášané šifrovane (TLS 1.2+) a v databáze chránené prístupovými
            kontrolami na úrovni riadkov (Row-Level Security). Heslá nikdy neukladáme v
            čitateľnej podobe — používame jednosmerné hashovanie. Prístup k údajom má
            iba úzky okruh oprávnených osôb viazaných mlčanlivosťou.
          </P>
          <P>
            V prípade porušenia ochrany osobných údajov, ktoré pravdepodobne povedie
            k vysokému riziku pre vaše práva a slobody, vás budeme informovať bez
            zbytočného odkladu v súlade s čl. 34 GDPR.
          </P>
        </Section>

        <Section no="10" title="Maloletí používatelia">
          <P>
            Služba NeoMe je určená osobám starším ako <Strong>16 rokov</Strong>. Ak ste mladší,
            službu môžete používať len so súhlasom zákonného zástupcu. Vedome nespracúvame
            osobné údaje detí mladších ako 16 rokov; ak zistíme, že sme tak urobili bez
            súhlasu, údaje bezodkladne vymažeme.
          </P>
        </Section>

        <Section no="11" title="Automatizované rozhodovanie a profilovanie">
          <P>
            Aplikácia vykonáva personalizáciu obsahu (napr. odporúčania receptov, cvičení,
            fáz cyklu) na základe údajov, ktoré nám poskytnete. Toto profilovanie
            <Strong> nemá pre vás právne účinky ani vás podobne významne neovplyvňuje</Strong>
            v zmysle čl. 22 GDPR.
          </P>
        </Section>

        <Section no="12" title="Zmeny týchto zásad">
          <P>
            Tieto zásady môžeme čas od času aktualizovať. O podstatných zmenách vás budeme
            informovať e-mailom alebo notifikáciou v aplikácii minimálne 14 dní vopred.
            Dátum poslednej aktualizácie je vždy uvedený v hornej časti dokumentu.
          </P>
        </Section>

        <Section no="13" title="Kontakt">
          <P>
            V akýchkoľvek otázkach týkajúcich sa ochrany osobných údajov, uplatnenia vašich
            práv alebo sťažností nás kontaktujte na:
          </P>
          <div style={{ paddingLeft: 4 }}>
            <P><Strong>E-mail:</Strong> {OPERATOR.email}</P>
            <P><Strong>Zástupca v EÚ:</Strong> {EU_REPRESENTATIVE.email}</P>
          </div>
        </Section>

        <div style={{ height: 56 }} />
      </main>
    </Page>
  );
}
