# NÁVRH: VYLEPŠENIE PREKLADOVÉHO SYSTÉMU

## 🎯 CIE Ľ
Získať **kvalitné slovenské recepty** ktoré sa prirodzene čítajú a používajú správne kulinárske termíny.

## ❌ SÚČASNÝ PROBLÉM
- MyMemory API: 2/10 kvalita ⭐⭐
- Doslovné preklady bez kontextu
- Mix angličtiny a slovenčiny
- Žiadne kulinárske znalosti

## ✅ NAVRHOVANÉ RIEŠENIA

### Option 1: DEEPL PRO API (Odporúčané)
**Výhody:**
- 10x lepšia kvalita ako MyMemory
- Rozumie kontextu varovania
- Slovenčina je podporovaná
- API integrácia jednoducha

**Cena:** €5.49/mesiac za 500,000 znakov
**Kvalita:** 7-8/10 ⭐⭐⭐⭐⭐⭐⭐⭐

**Implementácia:**
```javascript
async function translateWithDeepL(text) {
  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 
      'Authorization': 'DeepL-Auth-Key YOUR_KEY',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `text=${encodeURIComponent(text)}&target_lang=SK&source_lang=EN`
  });
  
  const data = await response.json();
  return data.translations[0].text;
}
```

### Option 2: CUSTOM DICTIONARY + MANUÁLNY REVIEW
**Postup:**
1. Rozšíriť slovník na 500+ kulinárskych termínov
2. Automaticky nahradiť známe výrazy  
3. Manuálne review všetkých názvov receptov
4. Postupné vylepšovanie

**Čas:** 2-3 hodiny na batch 50 receptov
**Kvalita:** 9/10 ⭐⭐⭐⭐⭐⭐⭐⭐⭐

### Option 3: HYBRID (Najlepšie)
1. **DeepL API** pre základný preklad
2. **Custom dictionary** pre kulinárske termíny  
3. **Manuálny review** názvov receptov
4. **Quality checks** automatické

**Kvalita:** 9/10 ⭐⭐⭐⭐⭐⭐⭐⭐⭐
**Škálovateľnosť:** Vysoká
**Náklady:** Nízke

## 🚀 IMPLEMENTAČNÝ PLÁN

### Fáza 1: Núdzové opravy (1 hodina)
- Oprav 23 súčasných receptov manuálne
- Aspoň názvy receptov do slovenčiny

### Fáza 2: DeepL integrácia (2 hodiny)  
- Registrácia DeepL API
- Prepísanie translation funkcií
- Testing na malej vzorke

### Fáza 3: Batch translation (3 hodiny)
- Re-translate všetky existujúce recepty
- Quality review
- Deploy nových prekladov

### Fáza 4: Kvalitná expanzia (ongoing)
- Pridávanie nových receptov s DeepL
- Postupné vylepšovanie slovníka
- User feedback integration

## 💰 NÁKLADY

| Riešenie | Mesačné náklady | Kvalita | Čas implementácie |
|----------|----------------|---------|-------------------|
| Status quo (MyMemory) | €0 | 2/10 | 0h |
| DeepL API | €5.49 | 7/10 | 2h |
| Manuálny | €0 | 9/10 | 20h+ |
| **Hybrid** | **€5.49** | **9/10** | **5h** |

## 🎯 ODPORÚČANIE

**Začneme s Hybrid prístupom:**

1. **Tento týždeň:** Manuálne oprav 23 súčasných receptov (1h práce)
2. **Budúci týždeň:** Implementuj DeepL API (2h práce) 
3. **Mesiac:** Quality review a expansion s DeepL

**Výsledok:** Kvalitné slovenské recepty ktoré vaše používateľky budú chcieť skutočne variť! 🍳

---

**Otázka:** Môžem začať s manuálnymi opravami súčasných 23 receptov aby sme hneď zlepšili kvalitu?