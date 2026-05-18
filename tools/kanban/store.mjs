// Shared task store. Used by both the server (HTTP API) and the CLI.
// Atomic file writes + advisory lock so concurrent chats don't corrupt the JSON.

import { promises as fs, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lockfile from 'proper-lockfile';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '..', '..');
export const TASKS_FILE = path.join(REPO_ROOT, '.claude', 'TASKS.json');

export const STATUSES = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
export const PRIORITIES = ['none', 'low', 'medium', 'high', 'urgent'];

const DEFAULT_STATE = {
  version: 1,
  next_id: 1,
  members: [
    { id: 'sam', name: 'Sam', kind: 'human', color: '#B8864A' },
    { id: 'gabi', name: 'Gabi', kind: 'human', color: '#A8848B' },
  ],
  agents: [
    { id: 'app-dev', name: 'app-dev', kind: 'agent' },
    { id: 'copy-agent', name: 'copy-agent', kind: 'agent' },
    { id: 'recipe-agent', name: 'recipe-agent', kind: 'agent' },
  ],
  tasks: [],
};

function ensureDir() {
  const dir = path.dirname(TASKS_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export async function readState() {
  ensureDir();
  if (!existsSync(TASKS_FILE)) {
    await fs.writeFile(TASKS_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
    return structuredClone(DEFAULT_STATE);
  }
  const raw = await fs.readFile(TASKS_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch (err) {
    throw new Error(`TASKS.json is corrupt: ${err.message}`);
  }
}

// Acquire lock, run mutator with current state, write result atomically.
export async function mutate(fn) {
  ensureDir();
  if (!existsSync(TASKS_FILE)) {
    await fs.writeFile(TASKS_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
  }
  const release = await lockfile.lock(TASKS_FILE, {
    retries: { retries: 10, minTimeout: 50, maxTimeout: 500 },
    stale: 5000,
  });
  try {
    const state = await readState();
    const result = await fn(state);
    const tmp = TASKS_FILE + '.tmp';
    await fs.writeFile(tmp, JSON.stringify(state, null, 2));
    await fs.rename(tmp, TASKS_FILE);
    return result;
  } finally {
    await release();
  }
}

function nowIso() {
  return new Date().toISOString();
}

export function nextId(state, prefix = 'NEO') {
  const n = state.next_id ?? 1;
  state.next_id = n + 1;
  return `${prefix}-${n}`;
}

export function knownAssignee(state, id) {
  if (!id) return null;
  const m = state.members.find((x) => x.id === id);
  if (m) return m;
  const a = state.agents.find((x) => x.id === id);
  if (a) return a;
  return null;
}

export function ensureAgent(state, id) {
  if (!id) return null;
  if (knownAssignee(state, id)) return knownAssignee(state, id);
  const agent = { id, name: id, kind: 'agent' };
  state.agents.push(agent);
  return agent;
}

// --- High-level mutations ---

export async function addTask({ title, description = '', status = 'backlog', priority = 'none', assignee = null, by = null }) {
  if (!title || !title.trim()) throw new Error('title is required');
  if (!STATUSES.includes(status)) throw new Error(`invalid status: ${status}`);
  if (!PRIORITIES.includes(priority)) throw new Error(`invalid priority: ${priority}`);
  return mutate((state) => {
    if (assignee) ensureAgent(state, assignee);
    if (by) ensureAgent(state, by);
    const id = nextId(state);
    const ts = nowIso();
    const task = {
      id,
      title: title.trim(),
      description,
      status,
      priority,
      assignee,
      created_at: ts,
      updated_at: ts,
      activity: [
        { ts, by: by || assignee || 'system', kind: 'created' },
      ],
    };
    state.tasks.push(task);
    return task;
  });
}

export async function updateTask(id, patch, by = null) {
  return mutate((state) => {
    const t = state.tasks.find((x) => x.id === id);
    if (!t) throw new Error(`task not found: ${id}`);
    if (by) ensureAgent(state, by);
    const ts = nowIso();
    const events = [];
    if (patch.status && patch.status !== t.status) {
      if (!STATUSES.includes(patch.status)) throw new Error(`invalid status: ${patch.status}`);
      events.push({ ts, by: by || 'system', kind: 'status_change', from: t.status, to: patch.status });
      t.status = patch.status;
    }
    if (patch.priority && patch.priority !== t.priority) {
      if (!PRIORITIES.includes(patch.priority)) throw new Error(`invalid priority: ${patch.priority}`);
      events.push({ ts, by: by || 'system', kind: 'priority_change', from: t.priority, to: patch.priority });
      t.priority = patch.priority;
    }
    if (patch.assignee !== undefined && patch.assignee !== t.assignee) {
      if (patch.assignee) ensureAgent(state, patch.assignee);
      events.push({ ts, by: by || 'system', kind: 'assignee_change', from: t.assignee, to: patch.assignee });
      t.assignee = patch.assignee;
    }
    if (patch.title !== undefined && patch.title !== t.title) t.title = patch.title;
    if (patch.description !== undefined && patch.description !== t.description) t.description = patch.description;
    if (events.length > 0) {
      t.activity.push(...events);
      t.updated_at = ts;
    }
    return t;
  });
}

export async function addComment(id, text, by = null) {
  if (!text || !text.trim()) throw new Error('text is required');
  return mutate((state) => {
    const t = state.tasks.find((x) => x.id === id);
    if (!t) throw new Error(`task not found: ${id}`);
    if (by) ensureAgent(state, by);
    const ts = nowIso();
    t.activity.push({ ts, by: by || 'system', kind: 'comment', text: text.trim() });
    t.updated_at = ts;
    return t;
  });
}

export async function deleteTask(id) {
  return mutate((state) => {
    const idx = state.tasks.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error(`task not found: ${id}`);
    const [removed] = state.tasks.splice(idx, 1);
    return removed;
  });
}
