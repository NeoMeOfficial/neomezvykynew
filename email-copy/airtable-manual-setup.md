# NeoMe — Meta Ads base — Manual setup checklist

Base URL: https://airtable.com/appNGVPHKUJ6uyQ2u

The Airtable MCP doesn't expose view creation or rollup fields. These steps need ~10 minutes in the Airtable UI to finish the base.

## 1. Rollup fields (the MCP can't create these)

### Ad Sets → rollup Spend + avg CTR from linked Performance
- Open Ad Sets table
- New field → **Rollup**
- Linked field: `Ads` (then through Ads.Performance — Airtable will let you pick)
  - Actually, since Performance links to Ads (not Ad Sets), this needs to be 2-step. Simpler: add a `Spend (rollup)` to **Ads** first (rollup from Performance), then a `Spend (rollup)` on **Ad Sets** that rolls up the Ads field.

**Ads table — add these rollups (rolling up from Performance):**
- `Spend (total)` → rollup of `Spend` from Performance, aggregation `SUM(values)`
- `Impressions (total)` → rollup of `Impressions` from Performance, `SUM(values)`
- `Clicks (total)` → rollup of `Clicks` from Performance, `SUM(values)`
- `Purchases (total)` → rollup of `Purchases` from Performance, `SUM(values)`
- `Purchase Value (total)` → rollup of `Purchase Value` from Performance, `SUM(values)`
- `ROAS (avg)` → rollup of `ROAS` from Performance, `AVERAGE(values)` (weight by spend manually via formula below if needed)

**Ads table — add the Winner? formula** (now that rollups exist):
- New field → **Formula**
- Formula: `IF(AND({Spend (total)} > 100, {ROAS (avg)} > 2), "🏆", "")`

**Ad Sets table — add these rollups (rolling up from Ads):**
- `Spend (total)` → rollup of `Spend (total)` from Ads, `SUM(values)`
- `CTR (avg)` → rollup of `CTR` from Performance (multi-hop — alternative: `AVERAGE(values)` on Ads.CTR rollup if you add one)

**Campaigns table — add these rollups (rolling up from Ad Sets):**
- `Spend (total)` → rollup of `Spend (total)` from Ad Sets, `SUM(values)`
- `ROAS (avg)` → rollup of `ROAS (avg)` from Ad Sets, `AVERAGE(values)`

## 2. Five views on the Ads table

Open Ads table, click "+ Create new view" for each:

### All Ads (gallery)
- Type: **Gallery**
- Cover field: `Creative File`
- Group by: `status` (descending: Active first)
- Sort: `ROAS (avg)` desc, then `Spend (total)` desc
- Visible fields: Ad Name, Hook, creative_type, pain_primary, ROAS (avg), Spend (total), Winner?

### Active Tests (grid)
- Type: **Grid**
- Filter: `status = Active`
- Sort: `Spend (total)` desc
- Visible: Ad Name, Ad Set, Hook, Spend (total), Impressions (total), CTR (avg), ROAS (avg)

### Winners (grid)
- Type: **Grid**
- Filter: `Winner?` is not empty
- Sort: `ROAS (avg)` desc
- Visible: Ad Name, Ad Set, Spend (total), Purchases (total), ROAS (avg), pain_primary, framework, archetype

### By Pain (grid)
- Type: **Grid**
- Group by: `pain_primary`
- Sort within group: `ROAS (avg)` desc
- Visible: Ad Name, status, Spend (total), ROAS (avg), Hook, framework

### Wildcards Review (grid)
- Type: **Grid**
- Filter: `is_wildcard = checked`
- Sort: `Spend (total)` desc
- Visible: Ad Name, status, Hook, Spend (total), ROAS (avg), notes
- Purpose: monthly review of out-of-pattern creative experiments

## 3. Optional: display formatting

- Performance.CTR: change field type display to **Percent** (1 decimal)
- Performance.CPM / CPA / ROAS: change display to **Currency** (CPM/CPA in $, ROAS as decimal)
- Performance.Key: hide from default views (it's just a dedup string)

## Done

Once these are in, the base mirrors the handoff spec. The daily Meta sync routine will populate Performance, which makes all rollups + Winner? live.
