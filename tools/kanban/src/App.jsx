import React, { useEffect, useMemo, useRef, useState } from 'react';

const COLUMNS = [
  { id: 'backlog',     label: 'Backlog' },
  { id: 'todo',        label: 'Todo' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review',   label: 'In Review' },
  { id: 'done',        label: 'Done' },
];

const PRIORITIES = [
  { id: 'none',    label: 'No priority', level: 0 },
  { id: 'low',     label: 'Low',         level: 1 },
  { id: 'medium',  label: 'Medium',      level: 2 },
  { id: 'high',    label: 'High',        level: 3 },
  { id: 'urgent',  label: 'Urgent',      level: 4 },
];

function priorityLevel(p) {
  return PRIORITIES.find((x) => x.id === p)?.level ?? 0;
}

function PriorityPill({ value }) {
  const meta = PRIORITIES.find((p) => p.id === value) || PRIORITIES[0];
  return (
    <span className={`pill pri-${value}`}>
      <span className="pri-bars">
        <span className={meta.level >= 1 ? 'on' : ''}></span>
        <span className={meta.level >= 2 ? 'on' : ''}></span>
        <span className={meta.level >= 3 ? 'on' : ''}></span>
      </span>
      {meta.label === 'No priority' ? 'None' : meta.label}
    </span>
  );
}

function Avatar({ id, kind, name, color }) {
  if (!id) {
    return <span className="avatar" style={{ background: '#ccc', color: '#fff' }} title="Unassigned">?</span>;
  }
  if (kind === 'agent') {
    return (
      <span className="avatar bot" title={name}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fff' }}>
          <rect x="4" y="7" width="16" height="12" rx="2"/>
          <path d="M12 7V3"/>
          <circle cx="9" cy="13" r="1.2" fill="currentColor"/>
          <circle cx="15" cy="13" r="1.2" fill="currentColor"/>
        </svg>
      </span>
    );
  }
  const initials = name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase();
  return <span className="avatar" style={{ background: color || '#888' }} title={name}>{initials}</span>;
}

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

function api(path, opts = {}) {
  return fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (r) => {
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    return r.json();
  });
}

export default function App() {
  const [state, setState] = useState(null);
  const [view, setView] = useState('board');
  const [selectedId, setSelectedId] = useState(null);
  const [filterChat, setFilterChat] = useState(null);
  const reviewCountRef = useRef(0);

  // Load initial + subscribe to SSE
  useEffect(() => {
    api('/api/state').then(setState).catch((e) => console.error(e));
    const es = new EventSource('/events');
    es.addEventListener('state', (e) => setState(JSON.parse(e.data)));
    es.onerror = () => { /* auto-reconnects */ };
    return () => es.close();
  }, []);

  const reviewCount = useMemo(() => state?.tasks.filter((t) => t.status === 'in_review').length || 0, [state]);

  // Tab title with unread review count
  useEffect(() => {
    document.title = reviewCount > 0 ? `(${reviewCount}) NeoMe Kanban` : 'NeoMe Kanban';
    reviewCountRef.current = reviewCount;
  }, [reviewCount]);

  // Permission for browser notifications (server also fires native macOS)
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  if (!state) return <div className="center-msg">Loading…</div>;

  const allAssignees = [...state.members, ...state.agents];
  const filteredTasks = filterChat ? state.tasks.filter((t) => t.assignee === filterChat) : state.tasks;
  const selected = selectedId ? state.tasks.find((t) => t.id === selectedId) : null;

  async function patchTask(id, patch) {
    const updated = await api(`/api/tasks/${id}`, { method: 'PATCH', body: { ...patch, by: 'sam' } });
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
  }

  async function createTask(payload) {
    const created = await api('/api/tasks', { method: 'POST', body: { ...payload, by: 'sam' } });
    setState((s) => ({ ...s, tasks: [...s.tasks, created] }));
  }

  async function commentTask(id, text) {
    const updated = await api(`/api/tasks/${id}/comments`, { method: 'POST', body: { text, by: 'sam' } });
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
  }

  async function removeTask(id) {
    await api(`/api/tasks/${id}`, { method: 'DELETE' });
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
    setSelectedId(null);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand"><span className="logo">N</span> NeoMe Kanban</div>
        <button className={`nav-item ${view === 'board' && !filterChat ? 'active' : ''}`} onClick={() => { setView('board'); setFilterChat(null); }}>
          ▦ Board
          {reviewCount > 0 && <span className="badge">{reviewCount}</span>}
        </button>
        <div style={{ height: 12 }} />
        <div style={{ padding: '0 8px', fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>People</div>
        {state.members.map((m) => (
          <button key={m.id} className={`nav-item ${filterChat === m.id ? 'active' : ''}`} onClick={() => setFilterChat(filterChat === m.id ? null : m.id)}>
            <Avatar {...m} /> {m.name}
          </button>
        ))}
        <div style={{ padding: '8px 8px 0', fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Agents</div>
        {state.agents.map((a) => (
          <button key={a.id} className={`nav-item ${filterChat === a.id ? 'active' : ''}`} onClick={() => setFilterChat(filterChat === a.id ? null : a.id)}>
            <Avatar {...a} /> {a.name}
          </button>
        ))}
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="crumbs">NeoMe <strong>›</strong> <strong>{filterChat ? allAssignees.find((x) => x.id === filterChat)?.name : 'Board'}</strong></div>
          <div className="grow" />
          <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>{filteredTasks.length} tasks · {reviewCount} awaiting review</span>
        </div>
        <Board
          state={state}
          tasks={filteredTasks}
          onOpen={setSelectedId}
          onMove={(id, status) => patchTask(id, { status })}
          onCreate={createTask}
        />
      </main>

      {selected && (
        <TaskDetail
          task={selected}
          assignees={allAssignees}
          findAssignee={(id) => allAssignees.find((x) => x.id === id)}
          onClose={() => setSelectedId(null)}
          onPatch={(patch) => patchTask(selected.id, patch)}
          onComment={(text) => commentTask(selected.id, text)}
          onDelete={() => removeTask(selected.id)}
        />
      )}
    </div>
  );
}

function Board({ state, tasks, onOpen, onMove, onCreate }) {
  const [composerCol, setComposerCol] = useState(null);
  return (
    <div className="board">
      {COLUMNS.map((col) => {
        const colTasks = tasks
          .filter((t) => t.status === col.id)
          .sort((a, b) => priorityLevel(b.priority) - priorityLevel(a.priority) || a.id.localeCompare(b.id));
        return (
          <Column
            key={col.id}
            col={col}
            tasks={colTasks}
            state={state}
            onOpen={onOpen}
            onMove={onMove}
            onAdd={() => setComposerCol(col.id)}
            composerOpen={composerCol === col.id}
            onCloseComposer={() => setComposerCol(null)}
            onCreate={onCreate}
          />
        );
      })}
    </div>
  );
}

function Column({ col, tasks, state, onOpen, onMove, onAdd, composerOpen, onCloseComposer, onCreate }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className={`column col-${col.id}`}>
      <div className="column-header">
        <span className="column-dot" />
        <span className="column-title">{col.label}</span>
        <span className="column-count">{tasks.length}</span>
        <button className="btn subtle column-add" onClick={onAdd} title="New task">+</button>
      </div>
      <div
        className={`column-body ${dragOver ? 'drop-target' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          setDragOver(false);
          const id = e.dataTransfer.getData('text/plain');
          if (id) onMove(id, col.id);
        }}
      >
        {tasks.map((t) => <Card key={t.id} task={t} state={state} onOpen={onOpen} />)}
        {composerOpen && <Composer status={col.id} state={state} onCreate={onCreate} onClose={onCloseComposer} />}
      </div>
    </div>
  );
}

function Card({ task, state, onOpen }) {
  const assignee = [...state.members, ...state.agents].find((x) => x.id === task.assignee);
  return (
    <div
      className="card"
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', task.id); e.currentTarget.classList.add('dragging'); }}
      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
      onClick={() => onOpen(task.id)}
    >
      <div className="card-id">{task.id}</div>
      <div className="card-title">{task.title}</div>
      {task.description && <div className="card-desc">{task.description}</div>}
      <div className="card-foot">
        {assignee ? <Avatar {...assignee} /> : <Avatar id={null} />}
        <PriorityPill value={task.priority} />
      </div>
    </div>
  );
}

function Composer({ status, state, onCreate, onClose }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('none');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  async function submit() {
    if (!title.trim()) return onClose();
    await onCreate({ title: title.trim(), status, assignee: assignee || null, priority });
    onClose();
  }
  return (
    <div className="new-card">
      <input
        ref={inputRef}
        placeholder="Task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose(); }}
      />
      <div className="row">
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
          <option value="">Unassigned</option>
          <optgroup label="Members">{state.members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>
          <optgroup label="Agents">{state.agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</optgroup>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <button className="btn primary" onClick={submit}>Add</button>
        <button className="btn subtle" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function TaskDetail({ task, assignees, findAssignee, onClose, onPatch, onComment, onDelete }) {
  const [comment, setComment] = useState('');
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-main">
          <div className="modal-crumbs">NeoMe › <strong>{task.id}</strong></div>
          <h1>{task.title}</h1>
          {task.description && <p className="desc">{task.description}</p>}
          <hr />
          <h2>Activity</h2>
          <div className="activity">
            {task.activity.map((e, i) => {
              const author = findAssignee(e.by);
              if (e.kind === 'comment') {
                return (
                  <div key={i} className="activity-event">
                    {author ? <Avatar {...author} /> : <Avatar id={null} name={e.by} kind="agent" />}
                    <div className="activity-comment">
                      <div className="author">{author?.name || e.by} <span style={{ color: 'var(--text-faint)', fontWeight: 400, fontSize: 11, marginLeft: 6 }}>{timeAgo(e.ts)}</span></div>
                      <div className="text">{e.text}</div>
                    </div>
                  </div>
                );
              }
              let text = '';
              if (e.kind === 'created') text = 'created the task';
              else if (e.kind === 'status_change') text = `moved ${e.from} → ${e.to}`;
              else if (e.kind === 'priority_change') text = `set priority ${e.from} → ${e.to}`;
              else if (e.kind === 'assignee_change') text = e.to ? `assigned to ${findAssignee(e.to)?.name || e.to}` : 'unassigned';
              else text = e.kind;
              return (
                <div key={i} className="activity-event system">
                  {author ? <Avatar {...author} /> : <Avatar id={null} name={e.by} kind="agent" />}
                  <span className="text"><strong>{author?.name || e.by}</strong> {text}</span>
                  <span className="when">{timeAgo(e.ts)}</span>
                </div>
              );
            })}
          </div>
          <div className="comment-box">
            <textarea placeholder="Add a comment…" value={comment} onChange={(e) => setComment(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn primary" disabled={!comment.trim()} onClick={async () => { await onComment(comment); setComment(''); }}>Comment</button>
              <button className="btn subtle" onClick={onClose}>Close</button>
              <div style={{ flex: 1 }} />
              <button className="btn subtle" onClick={() => { if (confirm(`Delete ${task.id}?`)) onDelete(); }} style={{ color: 'var(--pri-urgent)' }}>Delete</button>
            </div>
          </div>
        </div>
        <aside className="modal-side">
          <h2>Properties</h2>
          <div className="prop-row">
            <span className="label">Status</span>
            <select value={task.status} onChange={(e) => onPatch({ status: e.target.value })}>
              {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="prop-row">
            <span className="label">Priority</span>
            <select value={task.priority} onChange={(e) => onPatch({ priority: e.target.value })}>
              {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div className="prop-row">
            <span className="label">Assignee</span>
            <select value={task.assignee || ''} onChange={(e) => onPatch({ assignee: e.target.value || null })}>
              <option value="">Unassigned</option>
              <optgroup label="Members">
                {assignees.filter((a) => a.kind === 'human').map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </optgroup>
              <optgroup label="Agents">
                {assignees.filter((a) => a.kind === 'agent').map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </optgroup>
            </select>
          </div>
          <div style={{ marginTop: 18, fontSize: 12, color: 'var(--text-faint)' }}>
            Updated {timeAgo(task.updated_at)} ago
          </div>
        </aside>
      </div>
    </div>
  );
}
