#!/usr/bin/env node
// neome-task — coordinate tasks across parallel Claude chats.
// Writes directly to .claude/TASKS.json with a file lock; the running server
// (if any) sees the change via fs watch and broadcasts/notifies.

import { readState, addTask, updateTask, addComment, deleteTask, STATUSES, PRIORITIES } from './store.mjs';

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) flags[a.slice(2, eq)] = a.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) { flags[a.slice(2)] = argv[++i]; }
      else flags[a.slice(2)] = true;
    } else positional.push(a);
  }
  return { positional, flags };
}

function usage() {
  console.log(`neome-task — coordinate tasks across Claude chats

USAGE
  neome-task <command> [args] [--flags]

COMMANDS
  add <title>                    Create a task
      --desc=<text>              Description
      --chat=<id>                Assignee (e.g. app-dev, copy-agent, sam)
      --priority=low|medium|high|urgent
      --status=backlog|todo|in_progress|in_review|done   (default: todo)
  list                           List all tasks
      --mine --chat=<id>         Filter to a chat's tasks
      --status=<status>          Filter by status
  show <id>                      Show task detail + activity
  move <id> <status>             Move to a column
  review <id>                    Shortcut: move to in_review (notifies Sam)
      --note=<text>              Add a comment at the same time
  done <id>                      Shortcut: move to done
  comment <id> <text>            Add a comment to a task
      --by=<id>                  Author (defaults to --chat env or "system")
  assign <id> <who>              Reassign
  priority <id> <level>          Set priority
  delete <id>                    Remove task
  agents                         List members + agents
  help                           Show this

ENV
  NEOME_CHAT=<id>                Default --by/--chat for commands

EXAMPLES
  neome-task add "Fix paywall copy" --chat=copy-agent --priority=high
  neome-task review NEO-12 --note="PR #43 ready"
  NEOME_CHAT=app-dev neome-task list --mine
`);
}

const STATUS_LABEL = { backlog: 'Backlog', todo: 'Todo', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' };

function fmtTask(t) {
  const pri = t.priority && t.priority !== 'none' ? ` [${t.priority}]` : '';
  const who = t.assignee ? ` @${t.assignee}` : '';
  return `${t.id.padEnd(7)}  ${STATUS_LABEL[t.status].padEnd(12)}${who.padEnd(18)}${t.title}${pri}`;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') return usage();

  const { positional, flags } = parseArgs(rest);
  const me = flags.chat || flags.by || process.env.NEOME_CHAT || null;

  try {
    if (cmd === 'add') {
      const title = positional.join(' ');
      const t = await addTask({
        title,
        description: flags.desc || flags.description || '',
        status: flags.status || 'todo',
        priority: flags.priority || 'none',
        assignee: flags.chat || flags.assignee || me,
        by: me,
      });
      console.log(`✓ ${t.id}  ${t.title}`);
      return;
    }

    if (cmd === 'list') {
      const state = await readState();
      let tasks = state.tasks;
      if (flags.status) tasks = tasks.filter((t) => t.status === flags.status);
      if (flags.mine || flags.chat) {
        const who = flags.chat || me;
        if (!who) throw new Error('--mine requires NEOME_CHAT env or --chat=<id>');
        tasks = tasks.filter((t) => t.assignee === who);
      }
      if (tasks.length === 0) { console.log('(no tasks)'); return; }
      const order = { backlog: 0, todo: 1, in_progress: 2, in_review: 3, done: 4 };
      tasks.sort((a, b) => (order[a.status] - order[b.status]) || a.id.localeCompare(b.id));
      tasks.forEach((t) => console.log(fmtTask(t)));
      return;
    }

    if (cmd === 'show') {
      const id = positional[0];
      if (!id) throw new Error('usage: neome-task show <id>');
      const state = await readState();
      const t = state.tasks.find((x) => x.id === id);
      if (!t) throw new Error(`task not found: ${id}`);
      console.log(`\n${t.id}  ${t.title}`);
      console.log(`  status:   ${t.status}`);
      console.log(`  priority: ${t.priority}`);
      console.log(`  assignee: ${t.assignee || '(unassigned)'}`);
      console.log(`  updated:  ${t.updated_at}`);
      if (t.description) console.log(`\n  ${t.description}\n`);
      console.log('  activity:');
      for (const e of t.activity) {
        const when = new Date(e.ts).toLocaleString();
        if (e.kind === 'comment') console.log(`    ${when}  ${e.by}: ${e.text}`);
        else if (e.kind === 'status_change') console.log(`    ${when}  ${e.by} moved ${e.from} → ${e.to}`);
        else if (e.kind === 'priority_change') console.log(`    ${when}  ${e.by} priority ${e.from} → ${e.to}`);
        else if (e.kind === 'assignee_change') console.log(`    ${when}  ${e.by} assigned to ${e.to || '(unassigned)'}`);
        else console.log(`    ${when}  ${e.by} ${e.kind}`);
      }
      return;
    }

    if (cmd === 'move') {
      const [id, status] = positional;
      if (!id || !status) throw new Error('usage: neome-task move <id> <status>');
      const t = await updateTask(id, { status }, me);
      console.log(`✓ ${t.id} → ${t.status}`);
      return;
    }

    if (cmd === 'review') {
      const id = positional[0];
      if (!id) throw new Error('usage: neome-task review <id> [--note=...]');
      const t = await updateTask(id, { status: 'in_review' }, me);
      if (flags.note) await addComment(id, flags.note, me);
      console.log(`✓ ${t.id} → In Review${flags.note ? ' (+ note)' : ''}`);
      return;
    }

    if (cmd === 'done') {
      const id = positional[0];
      if (!id) throw new Error('usage: neome-task done <id>');
      const t = await updateTask(id, { status: 'done' }, me);
      console.log(`✓ ${t.id} → Done`);
      return;
    }

    if (cmd === 'comment') {
      const id = positional[0];
      const text = positional.slice(1).join(' ');
      if (!id || !text) throw new Error('usage: neome-task comment <id> <text>');
      await addComment(id, text, me);
      console.log(`✓ comment on ${id}`);
      return;
    }

    if (cmd === 'assign') {
      const [id, who] = positional;
      if (!id || !who) throw new Error('usage: neome-task assign <id> <who>');
      const t = await updateTask(id, { assignee: who }, me);
      console.log(`✓ ${t.id} → @${t.assignee}`);
      return;
    }

    if (cmd === 'priority') {
      const [id, level] = positional;
      if (!id || !level) throw new Error('usage: neome-task priority <id> <low|medium|high|urgent|none>');
      const t = await updateTask(id, { priority: level }, me);
      console.log(`✓ ${t.id} priority ${t.priority}`);
      return;
    }

    if (cmd === 'delete') {
      const id = positional[0];
      if (!id) throw new Error('usage: neome-task delete <id>');
      await deleteTask(id);
      console.log(`✓ deleted ${id}`);
      return;
    }

    if (cmd === 'agents') {
      const state = await readState();
      console.log('MEMBERS:');
      state.members.forEach((m) => console.log(`  ${m.id.padEnd(16)} ${m.name}`));
      console.log('\nAGENTS:');
      state.agents.forEach((a) => console.log(`  ${a.id.padEnd(16)} ${a.name}`));
      return;
    }

    if (cmd === 'statuses') { console.log(STATUSES.join('\n')); return; }
    if (cmd === 'priorities') { console.log(PRIORITIES.join('\n')); return; }

    console.error(`unknown command: ${cmd}`);
    usage();
    process.exit(1);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  }
}

main();
