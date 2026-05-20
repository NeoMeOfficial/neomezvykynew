---
status: accepted
date: 2026-05-20
---

# cycle_data table is the canonical store for cycle settings

The push-notification cron (`send-push-notifications.ts`) queried `from('cycle_data')`
for period prediction, but **that table never existed in the database** — only stale
generated types referenced it. The client persisted cycle settings as a JSON blob in
`user_app_data` (`data_key='cycle_data'`). Result: the `period_3d` push could never
fire, because it read an empty/non-existent table while the real data lived in a blob.

We resolved this by **creating a real `cycle_data` table** (one row per user, columnar
`last_period_start` / `cycle_length` / `period_length` / `history`) and making it the
single source of truth for cycle *settings*. Both the client (`useCycleData`) and the
cron read and write this table.

## Scope boundary — settings vs logs

- **Cycle settings** (`last_period_start`, `cycle_length`, `period_length`, `history`)
  → columnar `cycle_data` table. Needs to be queryable by the cron.
- **Per-day symptom logs** (`cycle_logs`: flow/symptoms/moods/energy/sleep/mucus/note
  per date) → stay a JSON blob in `user_app_data`. Genuinely document-shaped; no
  columnar query need. Not migrated.

## Considered alternatives

- **Cron reads the `user_app_data` blob** — rejected. The blob is JSON; the cron would
  fetch and parse every user's blob in JS, with no index on `last_period_start`. Doesn't
  scale and leaves the phantom `cycle_data` reference as dead confusion.
- **Dual-write (blob + table)** — rejected. Keeping two stores in sync is exactly the
  failure mode that produced this bug.

## Consequences

- New migration `20260520120000_cycle_data_table.sql`.
- `useCycleData` retargets persistence from the `user_app_data` blob to the `cycle_data`
  table. Existing users are migrated lazily: on first load after the change, if the
  table has no row but the legacy blob does, the blob is read once and written to the
  table.
- The cron imports the canonical period-prediction calculator instead of duplicating
  `last_period_start + cycle_length` inline.
- The legacy `user_app_data` row with `data_key='cycle_data'` becomes dead after lazy
  migration; it can be cleaned up post-launch but is harmless if left.
