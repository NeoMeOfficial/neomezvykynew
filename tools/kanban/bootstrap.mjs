// One-command launcher used by `npm run kanban` at the repo root.
// 1. Installs deps if node_modules is missing.
// 2. Builds the UI if dist/ is missing or older than src/.
// 3. Starts the server.

import { spawnSync, spawn } from 'node:child_process';
import { existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NM = path.join(__dirname, 'node_modules');
const DIST = path.join(__dirname, 'dist');
const SRC = path.join(__dirname, 'src');

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: __dirname, ...opts });
  if (r.status !== 0) process.exit(r.status || 1);
}

function newestMtime(dir) {
  let max = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    const m = entry.isDirectory() ? newestMtime(p) : statSync(p).mtimeMs;
    if (m > max) max = m;
  }
  return max;
}

if (!existsSync(NM)) {
  console.log('[kanban] installing deps (first run)…');
  run('npm', ['install', '--no-audit', '--no-fund']);
}

const needBuild = !existsSync(DIST) || newestMtime(SRC) > newestMtime(DIST);
if (needBuild) {
  console.log('[kanban] building UI…');
  run('npm', ['run', 'build']);
}

console.log('[kanban] starting server…');
const child = spawn('node', ['server.mjs'], { cwd: __dirname, stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
