# Multi-agent setup

How to run multiple Claude sessions on this repo without them clobbering each other. Replaces the failed SESSIONS.md / TASKS.json honor-system approach.

## Principle

**Mechanical isolation beats documented protocols.** If two agents can't physically touch the same files, you don't need a coordination protocol. Use git worktrees + scope-per-agent.

---

## One-time setup per agent

Pick a stable role name for the agent (e.g. `app-dev`, `copy-agent`, `recipe-agent`, `docs-agent`). For each agent, create a dedicated worktree on its own branch:

```bash
# From the main repo directory
git worktree add ../neome-copy-agent       copy-agent
git worktree add ../neome-recipe-agent     recipe-agent
git worktree add ../neome-docs-agent       docs-agent
```

Each agent's Claude Code session starts in its own worktree. They literally cannot edit each other's working files. Branches merge into `main` via PR (yours to review).

The current `app-dev` agent stays in the main worktree (`~/project_ai/neome-app`) on the `main` branch — it's the primary integrator.

---

## Briefing template

Drop this at the top of each agent's `CLAUDE.md` (in their worktree, not the main repo):

```markdown
# <Role name> Agent

## Scope (read first — non-negotiable)

You are the **<role>** agent for NeoMe.

- **Touch only:** <comma-separated paths the agent owns>
- **Never touch:** <paths owned by other agents>
- **Your goal:** <one-line description of what this agent does>

If a task crosses your scope, stop and tell the user — another agent owns that file.

## Branch

You commit to the `<branch-name>` branch. Push to your branch; main is merged via PR.
- `git pull --rebase origin <branch-name>` before starting work
- `git push origin <branch-name>` when done
- Never push to `main` directly

## Critical rules

<3–7 rules specific to this agent's domain>
```

Keep it under 50 lines. Long briefs get skimmed.

---

## Example scope assignments

| Agent | Scope (touch only) | Never touch |
|---|---|---|
| `app-dev` | `src/`, `netlify/functions/`, `supabase/migrations/`, `public/` | marketing site, `_shared/copy/`, `_shared/recipes/`, `tools/`, `bin/` |
| `copy-agent` | `_shared/copy/`, string literals in `src/pages/v2/*.tsx` (Slovak text only) | hooks, logic, types, migrations, builds |
| `recipe-agent` | `src/data/recipes.ts`, `_shared/recipes/`, recipe import scripts | components, routes, anything outside recipes |
| `docs-agent` | `docs/`, `*.md` outside `src/` | code, configs, migrations |
| `marketing-agent` | separate website repo entirely | this repo |

Adjust to your actual agents. The principle: **each path has exactly one owner**.

---

## When you do need parallel work on the same file

Pull → edit → commit → push immediately. Never sit on a long-running uncommitted change. If two agents really do need to touch the same file in the same day, do it sequentially:
1. Agent A finishes, commits, pushes.
2. You merge A's branch into main.
3. Agent B pulls main and starts.

Worktree-based PR flow makes this natural.

---

## Optional: enforce with a pre-tool hook

For belt-and-braces, you can configure Claude Code's `hooks` to *block* edits outside an agent's scope. In `~/.claude/settings.json` (or per-project `.claude/settings.json`):

```jsonc
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [{ "type": "command", "command": ".claude/hooks/check-scope.sh" }]
    }]
  }
}
```

The script reads the agent's scope from its `CLAUDE.md` (or a sidecar `.scope` file) and exits non-zero on out-of-scope paths. Claude treats non-zero exit as a tool-call denial. This is the only mechanism that genuinely prevents drift if you don't trust the worktree boundary alone.

Not set up here yet — add only if the worktree boundary proves insufficient.
