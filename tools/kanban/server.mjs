// Express server: serves the built UI, exposes a JSON API, broadcasts changes via SSE,
// and fires a macOS notification when a task transitions into "In Review".

import express from 'express';
import chokidar from 'chokidar';
import notifier from 'node-notifier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import {
  TASKS_FILE, REPO_ROOT, readState, addTask, updateTask, addComment, deleteTask,
} from './store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.argv.includes('--dev');
const PORT = Number(process.env.NEOME_KANBAN_PORT || 5174);

const app = express();
app.use(express.json({ limit: '1mb' }));

// --- SSE ---
const clients = new Set();
function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try { res.write(payload); } catch { /* dropped */ }
  }
}

app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write(`event: hello\ndata: {"ok":true}\n\n`);
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

// --- API ---
app.get('/api/state', async (_req, res) => {
  try { res.json(await readState()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/tasks', async (req, res) => {
  try { res.json(await addTask(req.body || {})); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try { res.json(await updateTask(req.params.id, req.body || {}, req.body?.by)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/tasks/:id/comments', async (req, res) => {
  try { res.json(await addComment(req.params.id, req.body?.text, req.body?.by)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try { res.json(await deleteTask(req.params.id)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});

// --- Static UI ---
const distDir = path.join(__dirname, 'dist');
if (!isDev) {
  if (!existsSync(distDir)) {
    console.error('[kanban] dist/ not found. Run `npm run build` first, or use `npm run dev`.');
    process.exit(1);
  }
  app.use(express.static(distDir));
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

// --- Watch TASKS.json for external mutations (from CLI) and broadcast diffs ---
let lastByStatus = new Map();
async function snapshot() {
  try {
    const state = await readState();
    return new Map(state.tasks.map((t) => [t.id, t.status]));
  } catch { return new Map(); }
}
(async () => { lastByStatus = await snapshot(); })();

const watcher = chokidar.watch(TASKS_FILE, { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 30 } });
watcher.on('all', async () => {
  let state;
  try { state = await readState(); } catch { return; }
  const next = new Map(state.tasks.map((t) => [t.id, t.status]));
  for (const [id, status] of next) {
    const prev = lastByStatus.get(id);
    if (prev !== 'in_review' && status === 'in_review') {
      const t = state.tasks.find((x) => x.id === id);
      const assignee = t?.assignee || 'someone';
      notifier.notify({
        title: 'NeoMe Kanban — review requested',
        message: `${id} · ${assignee} → ${t?.title || ''}`.slice(0, 200),
        sound: true,
        timeout: 8,
      });
    }
  }
  lastByStatus = next;
  broadcast('state', state);
});

app.listen(PORT, () => {
  const where = isDev ? `http://localhost:5175 (vite) → api on :${PORT}` : `http://localhost:${PORT}`;
  console.log(`[kanban] watching ${path.relative(REPO_ROOT, TASKS_FILE)}`);
  console.log(`[kanban] open ${where}`);
});
