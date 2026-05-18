# NeoMe Kanban

Local Kanban board to coordinate parallel Claude Code chats working on this repo.

- **Data**: `.claude/TASKS.json` (gitignored, lives on your machine)
- **UI**: http://localhost:5174 — Linear-style board with drag-and-drop
- **CLI**: `./bin/neome-task ...` — used by every chat to add / move / comment on tasks
- **Notifications**: macOS native + tab-title badge when something lands in "In Review"

## Running

From the repo root:

```bash
npm run kanban          # builds UI on first run, starts server at :5174
```

Opens [http://localhost:5174](http://localhost:5174). Leave it running in a terminal tab.

For UI development on the kanban app itself:

```bash
cd tools/kanban
npm run dev             # vite on :5175, server on :5174
```

## CLI

```bash
./bin/neome-task add "Fix paywall copy" --chat=copy-agent --priority=high
./bin/neome-task list --status=in_review
./bin/neome-task show NEO-7
./bin/neome-task review NEO-7 --note="PR #43 ready, please check the new wording"
./bin/neome-task comment NEO-7 "looks good — shipping"
./bin/neome-task done NEO-7
```

Each chat sets `NEOME_CHAT=<id>` so its actions are attributed in the activity log.

## Columns

`backlog` → `todo` → `in_progress` → `in_review` → `done`

Moving a task into `in_review` triggers a macOS notification and updates the tab-title badge.
