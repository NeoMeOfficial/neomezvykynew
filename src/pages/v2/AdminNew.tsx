import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Gift, BarChart3, Euro, Dumbbell, Utensils, Music, Flag, MessageSquare,
  Calendar, FolderOpen, Bell, Settings, LogOut, Shield, ChevronRight, Plus,
  Eye, Trash2, Edit3, TrendingUp, Activity, Send, ArrowLeft,
  Tag, Percent, Mail, Play, CheckSquare, Square, X, Check, AlertTriangle
} from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import ContentManager from '../../components/admin/ContentManager';
import { useAdminMessages } from '../../hooks/useMessages';
import { useCommunityPosts } from '../../hooks/useCommunityPosts';

// Simple Card component
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
);

// Navigation items
const navigationItems = [
  { id: 'overview', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
  { id: 'content', label: 'Content Manager', icon: FolderOpen, description: 'Videos, Photos & Media' },
  { id: 'programs', label: 'Programs', icon: Calendar, description: 'Fitness Programs' },
  { id: 'exercises', label: 'Exercises', icon: Dumbbell, description: 'Exercise Library' },
  { id: 'recipes', label: 'Recipes', icon: Utensils, description: 'Recipe Database' },
  { id: 'meditations', label: 'Meditations', icon: Music, description: 'Audio Content' },
  { id: 'community', label: 'Community', icon: Flag, description: 'Post Moderation' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'User Support' },
  { id: 'users', label: 'Users', icon: Users, description: 'Account Management' },
  { id: 'referrals', label: 'Referrals', icon: Gift, description: 'Reward Program' },
  { id: 'partner-discounts', label: 'Partner Zľavy', icon: Gift, description: 'Partnerské zľavy' },
  { id: 'promo-codes', label: 'Promo Kódy', icon: Percent, description: 'Zľavové kódy' },
] as const;

// ═══════════════════════════════════════════
// TYPES — new sections
// ═══════════════════════════════════════════
interface PartnerDiscount {
  id: string;
  partnerName: string;
  description: string;
  code: string;
  discountValue: string;
  category: 'wellness' | 'food' | 'fitness' | 'other';
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}
interface PromoCode {
  id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

// ─── localStorage helpers ─────────────────
function loadLS<T>(key: string, fallback: T): T {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function saveLS(key: string, data: unknown) { localStorage.setItem(key, JSON.stringify(data)); }

// ─── Demo data ─────────────────────────────
const INIT_PARTNER_DISCOUNTS: PartnerDiscount[] = [
  { id: 'pd-1', partnerName: 'Organica SK', description: '20% zľava na všetky organické produkty', code: 'NEOME20ORG', discountValue: '20%', category: 'food', expiryDate: '2026-12-31', isActive: true, createdAt: '2026-01-01' },
  { id: 'pd-2', partnerName: 'FitLife Studio', description: 'Mesačná permanentka za zvýhodnenú cenu', code: 'NEOMEFITLIFE', discountValue: '€15', category: 'fitness', expiryDate: '2026-06-30', isActive: true, createdAt: '2026-02-01' },
  { id: 'pd-3', partnerName: 'Wellness Spa Bratislava', description: 'Zľava na wellness procedúry', code: 'NEOMESPA10', discountValue: '10%', category: 'wellness', expiryDate: '2026-09-30', isActive: false, createdAt: '2026-03-01' },
];
const INIT_PROMO_CODES: PromoCode[] = [
  { id: 'pc-1', code: 'NEOME20', discountType: 'percent', discountValue: 20, maxUses: 100, usedCount: 34, expiryDate: '2026-12-31', description: '20% zľava pre nových používateľov', isActive: true, createdAt: '2026-01-01' },
  { id: 'pc-2', code: 'VITAJ10', discountType: 'fixed', discountValue: 10, maxUses: 50, usedCount: 12, expiryDate: '2026-09-30', description: 'Uvítacia zľava €10', isActive: true, createdAt: '2026-02-01' },
];

// ═══════════════════════════════════════════
// PARTNER DISCOUNTS TAB
// ═══════════════════════════════════════════
const CATEGORY_LABELS: Record<PartnerDiscount['category'], string> = {
  wellness: 'Wellness', food: 'Jedlo', fitness: 'Fitness', other: 'Iné',
};

function PartnerDiscountsTab() {
  const [discounts, setDiscounts] = useState<PartnerDiscount[]>(() => loadLS('neome-admin-partner-discounts', INIT_PARTNER_DISCOUNTS));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PartnerDiscount>>({});

  useEffect(() => { saveLS('neome-admin-partner-discounts', discounts); }, [discounts]);

  const openAdd = () => { setForm({ category: 'wellness', isActive: true }); setEditId(null); setShowForm(true); };
  const openEdit = (d: PartnerDiscount) => { setForm({ ...d }); setEditId(d.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm({}); setEditId(null); };

  const save = () => {
    if (!form.partnerName || !form.code) return;
    if (editId) {
      setDiscounts(prev => prev.map(d => d.id === editId ? { ...d, ...form } as PartnerDiscount : d));
    } else {
      const nd: PartnerDiscount = {
        id: 'pd-' + Date.now(),
        partnerName: form.partnerName!,
        description: form.description || '',
        code: form.code!,
        discountValue: form.discountValue || '',
        category: (form.category as PartnerDiscount['category']) || 'other',
        expiryDate: form.expiryDate || '',
        isActive: form.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setDiscounts(prev => [nd, ...prev]);
    }
    closeForm();
  };

  const remove = (id: string) => setDiscounts(prev => prev.filter(d => d.id !== id));
  const toggle = (id: string) => setDiscounts(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Partner Zľavy</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
          <Plus className="w-4 h-4" />Pridať partnera
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{editId ? 'Upraviť zľavu' : 'Nová partnerská zľava'}</h3>
            <button onClick={closeForm} className="p-1 rounded-lg hover:bg-white/20"><X className="w-4 h-4" style={{ color: colors.textSecondary }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Meno partnera *</label>
              <input value={form.partnerName || ''} onChange={e => setForm(f => ({ ...f, partnerName: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Kód *</label>
              <input value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none font-mono" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Hodnota zľavy</label>
              <input value={form.discountValue || ''} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder="napr. 20% alebo €10" className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Kategória</label>
              <select value={form.category || 'wellness'} onChange={e => setForm(f => ({ ...f, category: e.target.value as PartnerDiscount['category'] }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                <option value="wellness">Wellness</option>
                <option value="food">Jedlo</option>
                <option value="fitness">Fitness</option>
                <option value="other">Iné</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Platnosť do</label>
              <input type="date" value={form.expiryDate || ''} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))} className="p-1">
                  {form.isActive ? <CheckSquare className="w-5 h-5" style={{ color: colors.strava }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
                </button>
                <span className="text-sm" style={{ color: colors.textPrimary }}>Aktívna</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Popis</label>
              <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>Zrušiť</button>
            <button onClick={save} className="px-4 py-2 rounded-xl text-sm text-white" style={{ backgroundColor: colors.telo }}>Uložiť</button>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              {['Partner', 'Kód', 'Zľava', 'Kategória', 'Platnosť', 'Aktívna', 'Akcie'].map(h => (
                <th key={h} className="text-left py-2 pr-4 font-medium text-xs" style={{ color: colors.textSecondary }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} className="border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors">
                <td className="py-3 pr-4">
                  <div className="font-medium" style={{ color: colors.textPrimary }}>{d.partnerName}</div>
                  {d.description && <div className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>{d.description}</div>}
                </td>
                <td className="py-3 pr-4"><span className="font-mono text-xs px-2 py-1 rounded-lg bg-white/30" style={{ color: colors.textPrimary }}>{d.code}</span></td>
                <td className="py-3 pr-4 font-semibold" style={{ color: colors.accent }}>{d.discountValue}</td>
                <td className="py-3 pr-4"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.telo}15`, color: colors.telo }}>{CATEGORY_LABELS[d.category]}</span></td>
                <td className="py-3 pr-4 text-xs" style={{ color: colors.textSecondary }}>{d.expiryDate}</td>
                <td className="py-3 pr-4">
                  <button onClick={() => toggle(d.id)} className="p-1">
                    {d.isActive ? <CheckSquare className="w-4 h-4" style={{ color: colors.strava }} /> : <Square className="w-4 h-4" style={{ color: colors.textSecondary }} />}
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><Edit3 className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} /></button>
                    <button onClick={() => remove(d.id)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-sm" style={{ color: colors.textSecondary }}>Žiadne partnerské zľavy.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════
// PROMO CODES TAB
// ═══════════════════════════════════════════
function PromoCodesTab() {
  const [codes, setCodes] = useState<PromoCode[]>(() => loadLS('neome-admin-promo-codes', INIT_PROMO_CODES));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PromoCode & { discountValueStr: string; maxUsesStr: string }>>({});
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => { saveLS('neome-admin-promo-codes', codes); }, [codes]);

  const openAdd = () => { setForm({ discountType: 'percent', isActive: true, discountValueStr: '', maxUsesStr: '' }); setEditId(null); setShowForm(true); };
  const openEdit = (c: PromoCode) => { setForm({ ...c, discountValueStr: String(c.discountValue), maxUsesStr: String(c.maxUses) }); setEditId(c.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setForm({}); setEditId(null); };

  const saveCode = () => {
    if (!form.code) return;
    const val = parseFloat(form.discountValueStr || '0');
    const maxU = parseInt(form.maxUsesStr || '100', 10);
    if (editId) {
      setCodes(prev => prev.map(c => c.id === editId ? {
        ...c, code: form.code!, discountType: form.discountType as PromoCode['discountType'] || 'percent',
        discountValue: val, maxUses: maxU, expiryDate: form.expiryDate || c.expiryDate,
        description: form.description || '', isActive: form.isActive ?? c.isActive,
      } : c));
    } else {
      const nc: PromoCode = {
        id: 'pc-' + Date.now(), code: form.code!.toUpperCase(),
        discountType: (form.discountType as PromoCode['discountType']) || 'percent',
        discountValue: val, maxUses: maxU, usedCount: 0,
        expiryDate: form.expiryDate || '', description: form.description || '',
        isActive: form.isActive ?? true, createdAt: new Date().toISOString().split('T')[0],
      };
      setCodes(prev => [nc, ...prev]);
    }
    closeForm();
  };

  const remove = (id: string) => setCodes(prev => prev.filter(c => c.id !== id));
  const toggle = (id: string) => setCodes(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));

  const verify = () => {
    const c = codes.find(c => c.code === verifyInput.trim().toUpperCase());
    if (!c) { setVerifyResult({ ok: false, msg: 'Kód neexistuje.' }); return; }
    if (!c.isActive) { setVerifyResult({ ok: false, msg: 'Kód je neaktívny.' }); return; }
    if (c.expiryDate && new Date(c.expiryDate) < new Date()) { setVerifyResult({ ok: false, msg: 'Kód je po platnosti.' }); return; }
    if (c.usedCount >= c.maxUses) { setVerifyResult({ ok: false, msg: 'Kód bol vyčerpaný.' }); return; }
    const rem = c.maxUses - c.usedCount;
    const discStr = c.discountType === 'percent' ? `${c.discountValue}%` : `€${c.discountValue}`;
    setVerifyResult({ ok: true, msg: `Platný! Zľava: ${discStr}. Zostatok použití: ${rem} z ${c.maxUses}.` });
  };

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Promo Kódy</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.accent }}>
          <Plus className="w-4 h-4" />Nový kód
        </button>
      </div>

      {/* Verify tool */}
      <Card>
        <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Overiť kód</h3>
        <div className="flex gap-3 items-start">
          <input value={verifyInput} onChange={e => { setVerifyInput(e.target.value); setVerifyResult(null); }} placeholder="Zadaj kód..." className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none font-mono" style={{ color: colors.textPrimary }} />
          <button onClick={verify} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>Overiť</button>
        </div>
        {verifyResult && (
          <div className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${verifyResult.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {verifyResult.ok ? <Check className="w-4 h-4 text-green-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            <span style={{ color: verifyResult.ok ? '#16a34a' : '#dc2626' }}>{verifyResult.msg}</span>
          </div>
        )}
      </Card>

      {/* Form */}
      {showForm && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{editId ? 'Upraviť kód' : 'Nový promo kód'}</h3>
            <button onClick={closeForm} className="p-1 rounded-lg hover:bg-white/20"><X className="w-4 h-4" style={{ color: colors.textSecondary }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Kód *</label>
              <input value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none font-mono" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Typ zľavy</label>
              <select value={form.discountType || 'percent'} onChange={e => setForm(f => ({ ...f, discountType: e.target.value as PromoCode['discountType'] }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                <option value="percent">Percentuálna (%)</option>
                <option value="fixed">Fixná (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Hodnota {form.discountType === 'fixed' ? '(€)' : '(%)'}</label>
              <input type="number" value={form.discountValueStr || ''} onChange={e => setForm(f => ({ ...f, discountValueStr: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Max. použití</label>
              <input type="number" value={form.maxUsesStr || ''} onChange={e => setForm(f => ({ ...f, maxUsesStr: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Platnosť do</label>
              <input type="date" value={form.expiryDate || ''} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))} className="p-1">
                  {form.isActive ? <CheckSquare className="w-5 h-5" style={{ color: colors.strava }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
                </button>
                <span className="text-sm" style={{ color: colors.textPrimary }}>Aktívny</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Popis</label>
              <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>Zrušiť</button>
            <button onClick={saveCode} className="px-4 py-2 rounded-xl text-sm text-white" style={{ backgroundColor: colors.accent }}>Uložiť</button>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              {['Kód', 'Zľava', 'Použitia', 'Platnosť', 'Popis', 'Aktívny', 'Akcie'].map(h => (
                <th key={h} className="text-left py-2 pr-4 font-medium text-xs" style={{ color: colors.textSecondary }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {codes.map(c => {
              const remaining = c.maxUses - c.usedCount;
              const pct = Math.min(100, (c.usedCount / c.maxUses) * 100);
              return (
                <tr key={c.id} className="border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors">
                  <td className="py-3 pr-4"><span className="font-mono font-semibold" style={{ color: colors.textPrimary }}>{c.code}</span></td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: colors.accent }}>
                    {c.discountType === 'percent' ? `${c.discountValue}%` : `€${c.discountValue}`}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="text-xs" style={{ color: colors.textPrimary }}>{c.usedCount}/{c.maxUses} ({remaining} zostatok)</div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/30 overflow-hidden w-24">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? colors.periodka : colors.strava }} />
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs" style={{ color: colors.textSecondary }}>{c.expiryDate}</td>
                  <td className="py-3 pr-4 text-xs max-w-[160px] truncate" style={{ color: colors.textSecondary }}>{c.description}</td>
                  <td className="py-3 pr-4">
                    <button onClick={() => toggle(c.id)} className="p-1">
                      {c.isActive ? <CheckSquare className="w-4 h-4" style={{ color: colors.strava }} /> : <Square className="w-4 h-4" style={{ color: colors.textSecondary }} />}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><Edit3 className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} /></button>
                      <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {codes.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-sm" style={{ color: colors.textSecondary }}>Žiadne promo kódy.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════
// COMMUNITY MODERATION TAB (wired to Supabase)
// ═══════════════════════════════════════════
function CommunityModerationTab() {
  const { posts, loading } = useCommunityPosts();
  const [localStatus, setLocalStatus] = useState<Record<string, 'approved' | 'removed'>>({});
  const [filter, setFilter] = useState<'all' | 'flagged'>('all');

  const handleApprove = (id: string) => setLocalStatus(p => ({ ...p, [id]: 'approved' }));
  const handleRemove = (id: string) => setLocalStatus(p => ({ ...p, [id]: 'removed' }));
  // TODO: wire to Supabase community_posts table — update `status` column on approve/remove

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
  );

  const visible = posts.filter(p => {
    if (localStatus[p.id] === 'removed') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Community Moderácia</h2>
        <div className="flex gap-2">
          {(['all', 'flagged'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-sm font-medium" style={filter === f ? { backgroundColor: colors.telo, color: '#fff' } : { backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>
              {f === 'all' ? 'Všetky' : 'Nahlásené'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><div className="text-center"><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{posts.length}</div><div className="text-sm" style={{ color: colors.textSecondary }}>Celkovo príspevkov</div></div></Card>
        <Card><div className="text-center"><div className="text-2xl font-bold" style={{ color: colors.strava }}>{Object.values(localStatus).filter(s => s === 'approved').length}</div><div className="text-sm" style={{ color: colors.textSecondary }}>Schválené (session)</div></div></Card>
        <Card><div className="text-center"><div className="text-2xl font-bold" style={{ color: colors.periodka }}>{Object.values(localStatus).filter(s => s === 'removed').length}</div><div className="text-sm" style={{ color: colors.textSecondary }}>Odstránené (session)</div></div></Card>
      </div>

      <Card className="!p-0">
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: colors.textSecondary }}>Načítavam príspevky…</div>
        ) : (
          <div className="divide-y divide-white/10">
            {visible.map(post => {
              const status = localStatus[post.id];
              return (
                <div key={post.id} className="p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.accent})` }}>
                        {post.author.slice(0, 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-sm" style={{ color: colors.textPrimary }}>{post.author}</span>
                          <span className="text-xs" style={{ color: colors.textTertiary }}>{post.time}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors.mysel}20`, color: colors.mysel }}>{post.type === 'question' ? 'Otázka' : 'Príspevok'}</span>
                        </div>
                        <p className="text-sm" style={{ color: colors.textPrimary }}>{post.text}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: colors.textTertiary }}>
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {status === 'approved' ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Schválené</span>
                      ) : (
                        <>
                          <button onClick={() => handleApprove(post.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${colors.strava}20`, color: colors.strava }}>
                            <Check className="w-3 h-3" />Schváliť
                          </button>
                          <button onClick={() => handleRemove(post.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${colors.periodka}15`, color: colors.periodka }}>
                            <Trash2 className="w-3 h-3" />Odstrániť
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {visible.length === 0 && (
              <div className="p-8 text-center text-sm" style={{ color: colors.textSecondary }}>Žiadne príspevky.</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── MessagesTab: standalone component so hooks are called at the top level ────
function MessagesTab() {
  const {
    conversations, loading, sending,
    selectedUserId, setSelectedUserId,
    thread, sendReply, totalUnread,
  } = useAdminMessages();
  const [reply, setReply] = React.useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 86_400_000);
    if (diff === 0) return d.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
    if (diff === 1) return 'Včera';
    return d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });
  };

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Messages
          {totalUnread > 0 && (
            <span className="ml-3 px-2 py-0.5 text-sm rounded-full text-white" style={{ background: colors.periodka }}>
              {totalUnread} new
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ height: '600px' }}>
        {/* Conversation list */}
        <Card className="overflow-hidden flex flex-col !p-0">
          <div className="px-4 py-3 border-b border-white/20">
            <h3 className="font-semibold text-sm" style={{ color: colors.textPrimary }}>Conversations</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-sm p-4" style={{ color: colors.textSecondary }}>Loading…</p>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                <p className="text-sm" style={{ color: colors.textSecondary }}>No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.user_id}
                  onClick={() => setSelectedUserId(conv.user_id)}
                  className="w-full text-left px-4 py-3 border-b border-white/10 hover:bg-white/20 transition-all"
                  style={selectedUserId === conv.user_id ? { background: 'rgba(184,134,74,0.12)' } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.accent})` }}>
                      U
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate" style={{ color: colors.textPrimary }}>
                          {conv.user_id === 'demo' ? 'Demo User' : conv.user_id.slice(0, 8) + '…'}
                        </span>
                        <span className="text-[10px] flex-shrink-0" style={{ color: colors.textTertiary }}>
                          {formatTime(conv.last_time)}
                        </span>
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: colors.textSecondary }}>
                        {conv.last_message}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.periodka }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Thread + composer */}
        <Card className="col-span-2 overflow-hidden flex flex-col !p-0">
          {!selectedUserId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: colors.textSecondary }} />
                <p className="text-sm" style={{ color: colors.textSecondary }}>Select a conversation to reply</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-5 py-3 border-b border-white/20 flex items-center gap-3">
                <button onClick={() => setSelectedUserId(null)} className="p-1 hover:bg-white/20 rounded-lg">
                  <ArrowLeft className="w-4 h-4" style={{ color: colors.textSecondary }} />
                </button>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.accent})` }}>
                  U
                </div>
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {selectedUserId === 'demo' ? 'Demo User' : selectedUserId.slice(0, 8) + '…'}
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {thread.map((msg) => {
                  const isGabi = msg.is_from_admin;
                  return (
                    <div key={msg.id} className={`flex ${isGabi ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[70%]">
                        <div
                          className="px-4 py-2.5 text-sm leading-relaxed"
                          style={{
                            borderRadius: isGabi ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            background: isGabi ? colors.accent : 'rgba(255,255,255,0.75)',
                            color: isGabi ? '#fff' : colors.textPrimary,
                          }}
                        >
                          {msg.body}
                        </div>
                        <p className={`text-[10px] mt-1 px-1 ${isGabi ? 'text-right' : 'text-left'}`}
                          style={{ color: colors.textTertiary }}>
                          {isGabi ? 'Gabi · ' : 'User · '}{formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply composer */}
              <div className="px-5 py-3 border-t border-white/20 flex items-end gap-2">
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (reply.trim() && !sending) {
                        sendReply(selectedUserId, reply.trim());
                        setReply('');
                      }
                    }
                  }}
                  placeholder="Reply as Gabi…"
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm resize-none rounded-xl outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.50)',
                    border: '1px solid rgba(255,255,255,0.60)',
                    color: colors.textPrimary,
                  }}
                />
                <button
                  onClick={() => {
                    if (reply.trim() && !sending) {
                      sendReply(selectedUserId, reply.trim());
                      setReply('');
                    }
                  }}
                  disabled={!reply.trim() || sending}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-opacity"
                  style={{ background: reply.trim() ? colors.accent : 'rgba(184,134,74,0.35)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function AdminNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const renderSidebar = () => (
    <div className="h-full flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.telo }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg" style={{ color: colors.textPrimary }}>NeoMe</h1>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group ${
                isActive ? 'bg-gradient-to-r shadow-lg' : 'hover:bg-white/20'
              }`}
              style={isActive ? { 
                background: `linear-gradient(135deg, ${colors.telo}, ${colors.strava})`,
                color: '#fff'
              } : {}}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: colors.textSecondary } : {}} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`} style={!isActive ? { color: colors.textPrimary } : {}}>
                    {item.label}
                  </span>
                </div>
                <p className={`text-xs truncate ${isActive ? 'text-white/80' : ''}`} style={!isActive ? { color: colors.textTertiary } : {}}>
                  {item.description}
                </p>
              </div>
              
              <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white/60' : 'text-transparent group-hover:text-gray-400'}`} />
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all">
          <Bell className="w-4 h-4" style={{ color: colors.textSecondary }} />
          <span className="text-sm" style={{ color: colors.textPrimary }}>Notifications</span>
        </button>
        
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all">
          <Settings className="w-4 h-4" style={{ color: colors.textSecondary }} />
          <span className="text-sm" style={{ color: colors.textPrimary }}>Settings</span>
        </button>
        
        <button 
          onClick={() => navigate('/domov')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
        >
          <LogOut className="w-4 h-4" style={{ color: colors.periodka }} />
          <span className="text-sm" style={{ color: colors.periodka }}>Exit Admin</span>
        </button>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg">
          ✅ Desktop Mode Active
        </div>
        <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
          <Bell className="w-5 h-5" style={{ color: colors.textSecondary }} />
        </button>
        <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
          <Settings className="w-5 h-5" style={{ color: colors.textSecondary }} />
        </button>
        <button onClick={() => navigate('/domov')} className="p-2 rounded-lg hover:bg-white/20 transition-all">
          <LogOut className="w-5 h-5" style={{ color: colors.periodka }} />
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Welcome back, Admin</h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Here's what's happening with NeoMe today</p>
        </div>
        <div className="text-xs" style={{ color: colors.textTertiary }}>
          Last updated: {new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6" style={{ color: colors.strava }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Total Users</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>127</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>89 active, 23 trial</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" style={{ color: colors.strava }} />
            <span className="text-xs font-medium" style={{ color: colors.strava }}>+12% this month</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Euro className="w-6 h-6" style={{ color: colors.accent }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Monthly Revenue</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>€1,891</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>MRR from subscriptions</div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-6 h-6" style={{ color: colors.periodka }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Referrals</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>47</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>8 pending approval</div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="w-6 h-6" style={{ color: colors.telo }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Content</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>131</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>23 exercises, 108 recipes</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Content Manager', desc: 'Upload videos & photos', icon: FolderOpen, action: () => setActiveTab('content') },
              { label: 'Add Exercise', desc: 'Create workout content', icon: Plus, action: () => setActiveTab('exercises') },
              { label: 'User Management', desc: 'Manage accounts', icon: Users, action: () => setActiveTab('users') },
              { label: 'Review Posts', desc: 'Moderate community', icon: Flag, action: () => setActiveTab('community') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-left"
              >
                <item.icon className="w-4 h-4" style={{ color: colors.telo }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{item.label}</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: '5 new user registrations', time: '2 hours ago' },
              { text: '3 referrals submitted', time: '4 hours ago' },
              { text: 'New support ticket', time: '6 hours ago' },
              { text: 'Program updated: BodyForming', time: '8 hours ago' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1 pb-2 border-b border-white/10 last:border-0">
                <div className="text-sm" style={{ color: colors.textPrimary }}>{item.text}</div>
                <div className="text-xs" style={{ color: colors.textTertiary }}>{item.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Performance</h3>
          <div className="space-y-3">
            {[
              { label: 'User Retention', value: '78%', color: colors.strava },
              { label: 'Engagement Rate', value: '85%', color: colors.accent },
              { label: 'Conversion Rate', value: '23%', color: colors.telo },
              { label: 'Content Views', value: '2.4k', color: colors.periodka },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/20">
                <span className="text-sm" style={{ color: colors.textPrimary }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Exercise Library</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
          <Plus className="w-4 h-4 mr-2 inline" />Add Exercise
        </button>
      </div>
      
      {/* Exercise Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>23</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Exercises</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>15</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Strengthening</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>8</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Stretching</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.periodka }}>12</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Diastasis Safe</div>
          </div>
        </Card>
      </div>

      {/* Exercise Management */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Exercise Database</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Strengthening</option>
                <option>Stretching</option>
                <option>Cardio</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Levels</option>
                <option>Level 1</option>
                <option>Level 2</option>
                <option>Level 3</option>
                <option>Level 4</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Core Breathing', category: 'Strengthening', level: 1, duration: '5 min', equipment: 'None', diastasisSafe: true },
              { name: 'Pelvic Floor Activation', category: 'Strengthening', level: 1, duration: '10 min', equipment: 'None', diastasisSafe: true },
              { name: 'Modified Plank', category: 'Strengthening', level: 2, duration: '15 min', equipment: 'Mat', diastasisSafe: false },
              { name: 'Hip Flexor Stretch', category: 'Stretching', level: 1, duration: '5 min', equipment: 'None', diastasisSafe: true },
            ].map((exercise, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/30 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6" style={{ color: colors.telo }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{exercise.name}</div>
                    <div className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <span>{exercise.category}</span>
                      <span>•</span>
                      <span>Level {exercise.level}</span>
                      <span>•</span>
                      <span>{exercise.duration}</span>
                      {exercise.diastasisSafe && (
                        <>
                          <span>•</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600">Diastasis Safe</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Trash2 className="w-4 h-4" style={{ color: colors.periodka }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  // Programme Schedule Builder state
  const [schedPrograms, setSchedPrograms] = useState<Array<{
    id: string; name: string; description: string; totalWeeks: number; level: number;
    weeks: Array<{ title: string; days: Array<{ videoUrl: string; message: string; isRest: boolean }> }>;
  }>>(() => loadLS('neome-admin-programs', [
    { id: 'postpartum', name: 'Postpartum Recovery', description: 'Jemné cvičenia po pôrode', totalWeeks: 8, level: 1,
      weeks: Array.from({ length: 8 }, (_, w) => ({ title: `Týždeň ${w + 1}`, days: Array.from({ length: 7 }, (_, d) => ({ videoUrl: '', message: '', isRest: d === 6 })) })) },
    { id: 'bodyforming', name: 'BodyForming', description: 'Formovanie celého tela', totalWeeks: 12, level: 2,
      weeks: Array.from({ length: 12 }, (_, w) => ({ title: `Týždeň ${w + 1}`, days: Array.from({ length: 7 }, (_, d) => ({ videoUrl: '', message: '', isRest: d === 5 || d === 6 })) })) },
    { id: 'elasticbands', name: 'Elastic Bands', description: 'Tréning s odporovými gumami', totalWeeks: 10, level: 3,
      weeks: Array.from({ length: 10 }, (_, w) => ({ title: `Týždeň ${w + 1}`, days: Array.from({ length: 7 }, (_, d) => ({ videoUrl: '', message: '', isRest: d === 6 })) })) },
    { id: 'strongsexy', name: 'Strong & Sexy', description: 'Intenzívny silový program', totalWeeks: 16, level: 4,
      weeks: Array.from({ length: 16 }, (_, w) => ({ title: `Týždeň ${w + 1}`, days: Array.from({ length: 7 }, (_, d) => ({ videoUrl: '', message: '', isRest: d === 6 })) })) },
  ]));
  const [selectedProgId, setSelectedProgId] = useState<string | null>(null);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number | null>(null);

  const DAYS_SHORT = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  const updateDay = (progId: string, weekIdx: number, dayIdx: number, patch: Partial<{ videoUrl: string; message: string; isRest: boolean }>) => {
    setSchedPrograms(prev => prev.map(p => {
      if (p.id !== progId) return p;
      const weeks = p.weeks.map((w, wi) => {
        if (wi !== weekIdx) return w;
        return { ...w, days: w.days.map((d, di) => di === dayIdx ? { ...d, ...patch } : d) };
      });
      return { ...p, weeks };
    }));
  };

  // Persist schedule programs
  useEffect(() => { saveLS('neome-admin-programs', schedPrograms); }, [schedPrograms]);

  const selectedProg = schedPrograms.find(p => p.id === selectedProgId);
  const selectedWeek = selectedProg?.weeks[selectedWeekIdx];
  const selectedDay = selectedWeekIdx !== undefined && selectedDayIdx !== null ? selectedWeek?.days[selectedDayIdx] : null;

  const renderPrograms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Programme Schedule Builder</h2>
      </div>

      {/* Program Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{schedPrograms.length}</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Celkovo programov</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>89</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Aktívne používateľky</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>67%</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Dokončenosť</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>4.8</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Priemerné hodnotenie</div>
          </div>
        </Card>
      </div>

      {/* Program picker */}
      <div className="flex gap-3 flex-wrap">
        {schedPrograms.map(p => (
          <button key={p.id} onClick={() => { setSelectedProgId(p.id); setSelectedWeekIdx(0); setSelectedDayIdx(null); }}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={selectedProgId === p.id ? { backgroundColor: colors.telo, color: '#fff' } : { backgroundColor: 'rgba(255,255,255,0.4)', color: colors.textPrimary, border: '1px solid rgba(255,255,255,0.3)' }}>
            Level {p.level} — {p.name}
          </button>
        ))}
      </div>

      {selectedProg && (
        <div className="grid grid-cols-3 gap-6">
          {/* Week selector + day grid */}
          <div className="col-span-2 space-y-4">
            {/* Week tabs */}
            <Card className="!p-3">
              <div className="flex gap-1 flex-wrap">
                {selectedProg.weeks.map((w, wi) => (
                  <button key={wi} onClick={() => { setSelectedWeekIdx(wi); setSelectedDayIdx(null); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={selectedWeekIdx === wi ? { backgroundColor: colors.accent, color: '#fff' } : { backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>
                    T{wi + 1}
                  </button>
                ))}
              </div>
            </Card>

            {/* Day grid */}
            {selectedWeek && (
              <Card>
                <h3 className="font-semibold mb-4" style={{ color: colors.textPrimary }}>{selectedWeek.title} — {selectedProg.name}</h3>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS_SHORT.map((d, di) => {
                    const day = selectedWeek.days[di];
                    const hasVideo = day?.videoUrl;
                    const hasMsg = day?.message;
                    const isRest = day?.isRest;
                    const isSelected = selectedDayIdx === di;
                    return (
                      <button key={di} onClick={() => setSelectedDayIdx(isSelected ? null : di)}
                        className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-sm font-medium transition-all border-2"
                        style={{
                          backgroundColor: isRest ? 'rgba(160,144,126,0.12)' : isSelected ? `${colors.telo}15` : 'rgba(255,255,255,0.4)',
                          borderColor: isSelected ? colors.telo : 'rgba(255,255,255,0.3)',
                          color: isRest ? colors.textSecondary : colors.textPrimary,
                        }}>
                        <span className="text-xs font-semibold">{d}</span>
                        {isRest && <span className="text-[9px]" style={{ color: colors.textTertiary }}>Odpočinok</span>}
                        <div className="flex gap-1">
                          {hasVideo && <Play className="w-2.5 h-2.5" style={{ color: colors.accent }} />}
                          {hasMsg && <Mail className="w-2.5 h-2.5" style={{ color: colors.strava }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs mt-3" style={{ color: colors.textTertiary }}>
                  Klikni na deň pre úpravu. <Play className="w-3 h-3 inline" style={{ color: colors.accent }} /> = video, <Mail className="w-3 h-3 inline" style={{ color: colors.strava }} /> = správa
                </p>
              </Card>
            )}
          </div>

          {/* Day detail panel */}
          <div>
            {selectedDayIdx !== null && selectedDay && selectedProgId ? (
              <Card>
                <h3 className="font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  {selectedWeek?.title} — {DAYS_SHORT[selectedDayIdx]}
                </h3>
                <div className="space-y-4">
                  {/* Rest day toggle */}
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/20">
                    <button onClick={() => updateDay(selectedProgId, selectedWeekIdx, selectedDayIdx, { isRest: !selectedDay.isRest })} className="p-0.5">
                      {selectedDay.isRest ? <CheckSquare className="w-5 h-5" style={{ color: colors.telo }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
                    </button>
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>Deň odpočinku</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Žiadne cvičenie tento deň</div>
                    </div>
                  </label>

                  {/* Video URL */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Video URL / Cloudflare Stream ID</label>
                    <input
                      value={selectedDay.videoUrl}
                      onChange={e => updateDay(selectedProgId, selectedWeekIdx, selectedDayIdx, { videoUrl: e.target.value })}
                      placeholder="https://... alebo stream ID"
                      className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
                      style={{ color: colors.textPrimary }}
                      disabled={selectedDay.isRest}
                    />
                    {selectedDay.videoUrl && (
                      <div className="mt-1 flex items-center gap-1 text-xs" style={{ color: colors.accent }}>
                        <Play className="w-3 h-3" />Video nastavené
                      </div>
                    )}
                  </div>

                  {/* Day message */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Správa pre tento deň (voliteľné)</label>
                    <textarea
                      value={selectedDay.message}
                      onChange={e => updateDay(selectedProgId, selectedWeekIdx, selectedDayIdx, { message: e.target.value })}
                      placeholder="Motivačná správa pre používateľky..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none"
                      style={{ color: colors.textPrimary }}
                    />
                    {selectedDay.message && (
                      <div className="mt-1 flex items-center gap-1 text-xs" style={{ color: colors.strava }}>
                        <Mail className="w-3 h-3" />Správa nastavená
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedDayIdx(null)}
                    className="w-full py-2 rounded-xl text-sm font-medium text-white"
                    style={{ backgroundColor: colors.telo }}>
                    Uložiť a zavrieť
                  </button>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: colors.textSecondary }} />
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Vyber deň v gride pre úpravu detailov.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {!selectedProg && (
        <Card>
          <div className="text-center py-10">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: colors.textSecondary }} />
            <p className="text-sm" style={{ color: colors.textSecondary }}>Vyber program vyššie na editáciu rozvrhu.</p>
          </div>
        </Card>
      )}
    </div>
  );

  const renderRecipes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Recipe Database</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.strava }}>
          <Plus className="w-4 h-4 mr-2 inline" />Add Recipe
        </button>
      </div>

      {/* Recipe Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>108</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Recipes</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>34</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Breakfast</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>54</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Lunch/Dinner</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>20</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Snacks</div>
          </div>
        </Card>
      </div>

      {/* Recipe Management */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Recipe Management</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snacks</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Allergens</option>
                <option>Dairy-Free</option>
                <option>Gluten-Free</option>
                <option>Nut-Free</option>
                <option>Vegetarian</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Avokádové toasty s vajíčkom', category: 'Breakfast', time: '15 min', calories: 340, allergens: ['Gluten'], rating: 4.8 },
              { name: 'Quinoa šalát s kuracím mäsom', category: 'Lunch', time: '25 min', calories: 420, allergens: [], rating: 4.6 },
              { name: 'Lososové curry s ryžou', category: 'Dinner', time: '30 min', calories: 380, allergens: ['Fish'], rating: 4.9 },
              { name: 'Energetické guľôčky', category: 'Snack', time: '10 min', calories: 120, allergens: ['Nuts'], rating: 4.7 },
            ].map((recipe, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-white/30 flex items-center justify-center">
                    <Utensils className="w-6 h-6" style={{ color: colors.strava }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{recipe.name}</div>
                    <div className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <span>{recipe.category}</span>
                      <span>•</span>
                      <span>{recipe.time}</span>
                      <span>•</span>
                      <span>{recipe.calories} kcal</span>
                      <span>•</span>
                      <span>⭐ {recipe.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {recipe.allergens.map((allergen, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-600">
                          {allergen}
                        </span>
                      ))}
                      {recipe.allergens.length === 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600">Allergen-Free</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Trash2 className="w-4 h-4" style={{ color: colors.periodka }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderMeditations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Meditation Content</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.mysel }}>
          <Plus className="w-4 h-4 mr-2 inline" />Add Meditation
        </button>
      </div>

      {/* Meditation Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>15</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Sessions</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>5</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Stress Relief</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>6</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Sleep</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>4</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Focus</div>
          </div>
        </Card>
      </div>

      {/* Meditation Management */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Audio Library</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Stress Relief</option>
                <option>Sleep</option>
                <option>Focus</option>
                <option>Breathing</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Durations</option>
                <option>5-10 min</option>
                <option>10-20 min</option>
                <option>20+ min</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Evening Wind Down', category: 'Sleep', duration: '15 min', plays: 234, rating: 4.9 },
              { name: 'Morning Mindfulness', category: 'Focus', duration: '10 min', plays: 189, rating: 4.7 },
              { name: 'Stress Release', category: 'Stress Relief', duration: '12 min', plays: 156, rating: 4.8 },
              { name: 'Deep Breathing', category: 'Breathing', duration: '8 min', plays: 298, rating: 4.6 },
            ].map((meditation, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/30 flex items-center justify-center">
                    <Music className="w-6 h-6" style={{ color: colors.mysel }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{meditation.name}</div>
                    <div className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <span>{meditation.category}</span>
                      <span>•</span>
                      <span>{meditation.duration}</span>
                      <span>•</span>
                      <span>{meditation.plays} plays</span>
                      <span>•</span>
                      <span>⭐ {meditation.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Trash2 className="w-4 h-4" style={{ color: colors.periodka }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Community Management</h2>
        <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.periodka }}>
          <Flag className="w-4 h-4 mr-2 inline" />Create Featured Post
        </button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>47</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Pending Posts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.periodka }}>8</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Reported Content</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>127</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Active Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>89%</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Approval Rate</div>
          </div>
        </Card>
      </div>

      {/* Moderation Queue */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>Moderation Queue</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Posts</option>
                <option>Pending Review</option>
                <option>Reported</option>
                <option>Featured</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Categories</option>
                <option>Success Stories</option>
                <option>Questions</option>
                <option>Tips & Advice</option>
                <option>Motivation</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                author: 'Lucia K.', 
                content: 'Práve som dokončila svoj prvý týždeň Postpartum programu a cítim sa úžasne! Ďakujem za túto aplikáciu ❤️',
                category: 'Success Story',
                time: '2 hours ago',
                status: 'pending',
                likes: 0,
                reports: 0
              },
              { 
                author: 'Andrea M.', 
                content: 'Má niekto skúsenosť s Level 3 cvičeniami? Sú naozaj náročné alebo je to len môj pocit?',
                category: 'Question',
                time: '4 hours ago',
                status: 'pending',
                likes: 0,
                reports: 0
              },
              { 
                author: 'Zuzana H.', 
                content: 'Tento recept na avokádové toasty je perfektný na raňajky! Určite odporúčam všetkým 🥑',
                category: 'Tips & Advice',
                time: '6 hours ago',
                status: 'reported',
                likes: 3,
                reports: 1
              },
            ].map((post, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                      <Users className="w-5 h-5" style={{ color: colors.telo }} />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: colors.textPrimary }}>{post.author}</div>
                      <div className="text-xs" style={{ color: colors.textTertiary }}>{post.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-red-500/20 text-red-600'
                    }`}>
                      {post.status === 'pending' ? 'Pending' : 'Reported'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm mb-3" style={{ color: colors.textPrimary }}>{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm" style={{ color: colors.textTertiary }}>
                    <span>❤️ {post.likes}</span>
                    {post.reports > 0 && <span>⚠️ {post.reports} reports</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: `${colors.strava}20`, color: colors.strava }}>
                      Approve
                    </button>
                    <button className="px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: `${colors.periodka}20`, color: colors.periodka }}>
                      Reject
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                      <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>User Management</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: `${colors.strava}20`, color: colors.strava }}>
            Export Users
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
            <Users className="w-4 h-4 mr-2 inline" />Add User
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>127</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Total Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.strava }}>89</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Subscribers</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent }}>23</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Trial Users</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.mysel }}>15</div>
            <div className="text-sm" style={{ color: colors.textSecondary }}>Free Users</div>
          </div>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>User Database</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm placeholder-gray-500"
              />
              <select className="px-3 py-2 rounded-lg bg-white/30 border border-white/30 text-sm">
                <option>All Statuses</option>
                <option>Subscribers</option>
                <option>Trial</option>
                <option>Free</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'Lucia Novakova', email: 'lucia.n@gmail.com', status: 'Subscriber', joined: '2024-01-15', lastActive: '2 hours ago' },
              { name: 'Andrea Svoboda', email: 'andrea.s@email.sk', status: 'Trial', joined: '2024-03-01', lastActive: '1 day ago' },
              { name: 'Zuzana Horak', email: 'zuzana.h@yahoo.com', status: 'Subscriber', joined: '2024-02-20', lastActive: '3 hours ago' },
              { name: 'Petra Kralova', email: 'petra.k@outlook.com', status: 'Free', joined: '2024-03-10', lastActive: '1 week ago' },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <Users className="w-6 h-6" style={{ color: colors.telo }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{user.name}</div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>{user.email}</div>
                    <div className="text-xs flex items-center gap-2" style={{ color: colors.textTertiary }}>
                      <span>Joined {user.joined}</span>
                      <span>•</span>
                      <span>Active {user.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    user.status === 'Subscriber' ? 'bg-green-500/20 text-green-600' :
                    user.status === 'Trial' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-gray-500/20 text-gray-600'
                  }`}>
                    {user.status}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Eye className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/20 transition-all">
                    <Edit3 className="w-4 h-4" style={{ color: colors.textSecondary }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderMessages = () => <MessagesTab />;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'content':
        return <ContentManager />;
      case 'programs':
        return renderPrograms();
      case 'exercises':
        return renderExercises();
      case 'recipes':
        return renderRecipes();
      case 'meditations':
        return renderMeditations();
      case 'community':
        return <CommunityModerationTab />;
      case 'messages':
        return renderMessages();
      case 'users':
        return renderUsers();
      case 'partner-discounts':
        return <PartnerDiscountsTab />;
      case 'promo-codes':
        return <PromoCodesTab />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Success Indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        ✅ New Admin Panel Working!
      </div>

      {/* Desktop Layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex flex-col">
          {renderSidebar()}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 bg-white/30 backdrop-blur-xl border-b border-white/30 flex items-center justify-between px-6">
            {renderHeader()}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}