import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Gift, BarChart3, Euro, Dumbbell, Utensils, Music, Flag, MessageSquare,
  Calendar, FolderOpen, Bell, Settings, LogOut, Shield, ChevronRight, Plus,
  Eye, Trash2, Edit3, TrendingUp, Activity, Send, ArrowLeft,
  Tag, Percent, Mail, Play, CheckSquare, Square, X, Check, AlertTriangle,
  BookOpen, RefreshCw, ExternalLink
} from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import { supabase } from '../../lib/supabase';
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
  { id: 'users', label: 'Users', icon: Users, description: 'Account Management' },
  { id: 'content', label: 'Content Manager', icon: FolderOpen, description: 'Videos, Photos & Media' },
  { id: 'blog', label: 'Blog', icon: BookOpen, description: 'Blog Posts' },
  { id: 'programs', label: 'Programs', icon: Calendar, description: 'Fitness Programs' },
  { id: 'exercises', label: 'Exercises', icon: Dumbbell, description: 'Exercise Library' },
  { id: 'recipes', label: 'Recipes', icon: Utensils, description: 'Recipe Database' },
  { id: 'meditations', label: 'Meditations', icon: Music, description: 'Audio Content' },
  { id: 'community', label: 'Community', icon: Flag, description: 'Post Moderation' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'User Support' },
  { id: 'referrals', label: 'Referrals', icon: Gift, description: 'Reward Program' },
  { id: 'partner-discounts', label: 'Partner Zľavy', icon: Tag, description: 'Partnerské zľavy' },
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
// PROMO CODES TAB — synced with Stripe
// ═══════════════════════════════════════════
interface PromoCodeExtended extends PromoCode {
  stripePromoId?: string;
  stripeSynced?: boolean;
}

function PromoCodesTab() {
  const [codes, setCodes] = useState<PromoCodeExtended[]>(() => loadLS('neome-admin-promo-codes', INIT_PROMO_CODES));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PromoCodeExtended & { discountValueStr: string; maxUsesStr: string }>>({});
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => { saveLS('neome-admin-promo-codes', codes); }, [codes]);

  const openAdd = () => { setForm({ discountType: 'percent', isActive: true, discountValueStr: '', maxUsesStr: '' }); setEditId(null); setShowForm(true); setSaveError(null); };
  const openEdit = (c: PromoCodeExtended) => { setForm({ ...c, discountValueStr: String(c.discountValue), maxUsesStr: String(c.maxUses) }); setEditId(c.id); setShowForm(true); setSaveError(null); };
  const closeForm = () => { setShowForm(false); setForm({}); setEditId(null); setSaveError(null); };

  const saveCode = async () => {
    if (!form.code) return;
    setSaving(true);
    setSaveError(null);
    const val = parseFloat(form.discountValueStr || '0');
    const maxU = parseInt(form.maxUsesStr || '100', 10);

    if (editId) {
      // Edit: local only (Stripe codes can't be renamed; just update local state)
      setCodes(prev => prev.map(c => c.id === editId ? {
        ...c, code: form.code!, discountType: form.discountType as PromoCode['discountType'] || 'percent',
        discountValue: val, maxUses: maxU, expiryDate: form.expiryDate || c.expiryDate,
        description: form.description || '', isActive: form.isActive ?? c.isActive,
      } : c));
      setSaving(false);
      closeForm();
    } else {
      // New code: sync to Stripe first
      try {
        const res = await fetch('/.netlify/functions/admin-create-promo-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: form.code!.toUpperCase(),
            discountType: form.discountType || 'percent',
            discountValue: val,
            maxUses: maxU,
            expiryDate: form.expiryDate || null,
            description: form.description || form.code,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Stripe error');

        const nc: PromoCodeExtended = {
          id: 'pc-' + Date.now(), code: form.code!.toUpperCase(),
          discountType: (form.discountType as PromoCode['discountType']) || 'percent',
          discountValue: val, maxUses: maxU, usedCount: 0,
          expiryDate: form.expiryDate || '', description: form.description || '',
          isActive: form.isActive ?? true, createdAt: new Date().toISOString().split('T')[0],
          stripePromoId: data.stripePromoId,
          stripeSynced: true,
        };
        setCodes(prev => [nc, ...prev]);
        closeForm();
      } catch (err: any) {
        setSaveError(err.message);
      } finally {
        setSaving(false);
      }
    }
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
          {saveError && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-red-600">{saveError}</span>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeForm} disabled={saving} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>Zrušiť</button>
            <button onClick={saveCode} disabled={saving} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2" style={{ backgroundColor: saving ? `${colors.accent}80` : colors.accent }}>
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {saving ? (editId ? 'Ukladám...' : 'Synchronizujem so Stripe...') : 'Uložiť'}
            </button>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20">
              {['Kód', 'Stripe', 'Zľava', 'Použitia', 'Platnosť', 'Popis', 'Aktívny', 'Akcie'].map(h => (
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
                  <td className="py-3 pr-4">
                    {(c as PromoCodeExtended).stripeSynced ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">✓ Stripe</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">lokálny</span>
                    )}
                  </td>
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

// ═══════════════════════════════════════════
// USERS TAB — real data from Supabase via Netlify function
// ═══════════════════════════════════════════
interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  subscriptions: { tier: string; active: boolean; stripe_subscription_id: string | null; current_period_end: string | null; cancel_at_period_end: boolean } | null;
}

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/admin-get-users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCancelSubscription = async (user: AdminUser) => {
    const subId = user.subscriptions?.stripe_subscription_id;
    if (!subId) return;
    setCancelling(user.id);
    try {
      const res = await fetch('/.netlify/functions/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Update local state
      setUsers(prev => prev.map(u => u.id === user.id ? {
        ...u,
        subscriptions: u.subscriptions ? { ...u.subscriptions, cancel_at_period_end: true } : null,
      } : u));
    } catch (err: any) {
      alert('Chyba pri rušení predplatného: ' + err.message);
    } finally {
      setCancelling(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleting(userId);
    try {
      const res = await fetch('/.netlify/functions/admin-delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setConfirmDelete(null);
    } catch (err: any) {
      alert('Chyba pri mazaní používateľa: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase());
    const tier = u.subscriptions?.tier ?? 'free';
    const matchStatus = statusFilter === 'all' || tier === statusFilter;
    return matchSearch && matchStatus;
  });

  const tierLabel = (tier: string) => ({ free: 'Free', neome_plus: 'Premium', program_bundle: 'Bundle' }[tier] ?? tier);
  const tierColor = (tier: string) => ({ free: '#A0907E', neome_plus: '#7A9E78', program_bundle: '#B8864A' }[tier] ?? '#A0907E');

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
  );

  if (loading) return <div className="flex items-center justify-center py-20 text-sm" style={{ color: colors.textSecondary }}>Načítavam používateľov…</div>;
  if (error) return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        {error}
        {error.includes('SUPABASE_SERVICE_ROLE_KEY') || error.includes('service') ? (
          <span className="ml-2 font-medium">— Add SUPABASE_SERVICE_ROLE_KEY to Netlify environment variables.</span>
        ) : null}
      </div>
      <button onClick={fetchUsers} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2" style={{ backgroundColor: colors.telo }}>
        <RefreshCw className="w-4 h-4" /> Skúsiť znova
      </button>
    </div>
  );

  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.subscriptions?.tier !== 'free' && u.subscriptions?.active).length;
  const freeUsers = users.filter(u => !u.subscriptions || u.subscriptions.tier === 'free').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>User Management</h2>
        <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.4)', color: colors.textSecondary }}>
          <RefreshCw className="w-4 h-4" /> Obnoviť
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><div className="text-center"><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{totalUsers}</div><div className="text-sm" style={{ color: colors.textSecondary }}>Celkovo používateľov</div></div></Card>
        <Card><div className="text-center"><div className="text-2xl font-bold" style={{ color: colors.strava }}>{premiumUsers}</div><div className="text-sm" style={{ color: colors.textSecondary }}>Premium</div></div></Card>
        <Card><div className="text-center"><div className="text-2xl font-bold" style={{ color: colors.textSecondary }}>{freeUsers}</div><div className="text-sm" style={{ color: colors.textSecondary }}>Free</div></div></Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-3 mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hľadaj podľa emailu alebo mena..." className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
            <option value="all">Všetky</option>
            <option value="neome_plus">Premium</option>
            <option value="program_bundle">Bundle</option>
            <option value="free">Free</option>
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && <p className="text-center py-6 text-sm" style={{ color: colors.textSecondary }}>Žiadni používatelia.</p>}
          {filtered.map(user => {
            const sub = user.subscriptions;
            const tier = sub?.tier ?? 'free';
            return (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.accent})` }}>
                    {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm" style={{ color: colors.textPrimary }}>{user.full_name || '—'}</div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>{user.email}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: colors.textTertiary }}>
                      Registrovaný: {new Date(user.created_at).toLocaleDateString('sk-SK')}
                      {sub?.current_period_end && ` · Predplatné do: ${new Date(sub.current_period_end).toLocaleDateString('sk-SK')}`}
                      {sub?.cancel_at_period_end && ' · ⚠️ Ruší sa'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${tierColor(tier)}20`, color: tierColor(tier) }}>
                    {tierLabel(tier)}
                  </span>
                  {sub?.stripe_subscription_id && !sub?.cancel_at_period_end && (
                    <button
                      onClick={() => handleCancelSubscription(user)}
                      disabled={cancelling === user.id}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: `${colors.periodka}15`, color: colors.periodka }}
                    >
                      {cancelling === user.id ? '...' : 'Zrušiť predplatné'}
                    </button>
                  )}
                  {confirmDelete === user.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs" style={{ color: colors.periodka }}>Naozaj?</span>
                      <button onClick={() => handleDeleteUser(user.id)} disabled={deleting === user.id} className="text-xs px-2 py-1 rounded-lg text-white" style={{ backgroundColor: colors.periodka }}>
                        {deleting === user.id ? '...' : 'Áno'}
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.4)', color: colors.textPrimary }}>Nie</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(user.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════
// BLOG POSTS TAB — Supabase-backed CRUD
// ═══════════════════════════════════════════
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

function BlogPostsTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<BlogPost>>({ category: 'general', author: 'Gabi', published: false });

  const fetchPosts = async () => {
    setLoading(true);
    // Use service role via supabase client — will only return published for anon; admin sees all via Netlify or service role
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openAdd = () => { setForm({ category: 'general', author: 'Gabi', published: false }); setEditPost(null); setShowForm(true); };
  const openEdit = (p: BlogPost) => { setForm({ ...p }); setEditPost(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditPost(null); setForm({ category: 'general', author: 'Gabi', published: false }); };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const savePost = async () => {
    if (!form.title) return;
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.title),
    };
    if (editPost) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editPost.id);
      if (!error) { await fetchPosts(); closeForm(); }
      else alert('Chyba: ' + error.message);
    } else {
      const { error } = await supabase.from('blog_posts').insert([payload]);
      if (!error) { await fetchPosts(); closeForm(); }
      else alert('Chyba: ' + error.message);
    }
    setSaving(false);
  };

  const togglePublished = async (post: BlogPost) => {
    const { error } = await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id);
    if (!error) setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
  };

  const deletePost = async (id: string) => {
    if (!confirm('Naozaj chceš vymazať tento príspevok?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) setPosts(prev => prev.filter(p => p.id !== id));
    else alert('Chyba: ' + error.message);
  };

  const CATEGORIES = [
    { value: 'general', label: 'Všeobecné' },
    { value: 'vyziva', label: 'Výživa' },
    { value: 'pohyb', label: 'Pohyb' },
    { value: 'mysel', label: 'Myseľ' },
    { value: 'cyklus', label: 'Cyklus' },
    { value: 'materstvo', label: 'Materstvo' },
  ];

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Blog</h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.mysel }}>
          <Plus className="w-4 h-4" /> Nový príspevok
        </button>
      </div>

      {showForm && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{editPost ? 'Upraviť príspevok' : 'Nový príspevok'}</h3>
            <button onClick={closeForm} className="p-1 rounded-lg hover:bg-white/20"><X className="w-4 h-4" style={{ color: colors.textSecondary }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Nadpis *</label>
              <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Slug (URL)</label>
              <input value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none font-mono" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Kategória</label>
              <select value={form.category || 'general'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Autor</label>
              <input value={form.author || 'Gabi'} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Cover image URL</label>
              <input value={form.cover_image || ''} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Perex (krátky úvod)</label>
              <textarea value={form.excerpt || ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Obsah (Markdown)</label>
              <textarea value={form.content || ''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-y font-mono text-xs" style={{ color: colors.textPrimary }} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setForm(f => ({ ...f, published: !f.published }))} className="p-1">
                {form.published ? <CheckSquare className="w-5 h-5" style={{ color: colors.strava }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
              </button>
              <span className="text-sm" style={{ color: colors.textPrimary }}>Publikovať ihneď</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeForm} disabled={saving} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>Zrušiť</button>
            <button onClick={savePost} disabled={saving} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2" style={{ backgroundColor: saving ? `${colors.mysel}80` : colors.mysel }}>
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {saving ? 'Ukladám...' : 'Uložiť'}
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm" style={{ color: colors.textSecondary }}>Načítavam príspevky…</div>
      ) : (
        <Card className="!p-0">
          {posts.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: colors.textSecondary }} />
              <p className="text-sm" style={{ color: colors.textSecondary }}>Zatiaľ žiadne príspevky. Vytvor prvý!</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  {['Nadpis', 'Kategória', 'Autor', 'Vytvorený', 'Publikovaný', 'Akcie'].map(h => (
                    <th key={h} className="text-left py-3 px-4 font-medium text-xs" style={{ color: colors.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium" style={{ color: colors.textPrimary }}>{post.title}</div>
                      <div className="text-xs font-mono" style={{ color: colors.textTertiary }}>{post.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.mysel}20`, color: colors.mysel }}>
                        {CATEGORIES.find(c => c.value === post.category)?.label ?? post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs" style={{ color: colors.textSecondary }}>{post.author}</td>
                    <td className="py-3 px-4 text-xs" style={{ color: colors.textSecondary }}>{new Date(post.created_at).toLocaleDateString('sk-SK')}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => togglePublished(post)}>
                        {post.published
                          ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Publikovaný</span>
                          : <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Draft</span>
                        }
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><Edit3 className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} /></button>
                        <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"><Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
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

interface AdminAnalytics {
  totalUsers: number;
  activeSubscriptions: number;
  freeUsers: number;
  newUsersMonth: number;
  postsCount: number;
  referralCount: number;
  recentUsers: { email: string; full_name: string | null; created_at: string }[];
}

// ═══════════════════════════════════════════
// SHARED ADMIN CRUD HELPERS
// ═══════════════════════════════════════════
async function adminFetch(type: string) {
  const res = await fetch(`/.netlify/functions/admin-content?type=${type}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.items ?? [];
}
async function adminUpsert(type: string, item: Record<string, unknown>) {
  const res = await fetch('/.netlify/functions/admin-content', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, action: 'upsert', data: item }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.item;
}
async function adminDelete(type: string, id: string) {
  const res = await fetch('/.netlify/functions/admin-content', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, action: 'delete', id }),
  });
  if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
}
async function adminSeed(type: string, items: Record<string, unknown>[]) {
  const res = await fetch('/.netlify/functions/admin-content', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, action: 'seed', items }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.seeded;
}

const AdminCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg ${className}`}>{children}</div>
);

// ═══════════════════════════════════════════
// RECIPES TAB — Supabase CRUD
// ═══════════════════════════════════════════
interface RecipeRow {
  id: string; title: string; category: string; description: string;
  prep_time: number; servings: number; calories: number;
  protein: number; carbs: number; fat: number; fiber: number;
  ingredients: { name: string; amount: string }[];
  steps: string[]; allergens: string[]; dietary: string[]; tags: string[];
  image: string; difficulty: string; pdf_path: string; active: boolean;
}

function RecipesTab() {
  const [items, setItems] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<RecipeRow>>({ category: 'ranajky', difficulty: 'easy', active: true });
  // Multi-line text fields
  const [ingText, setIngText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [allerText, setAllerText] = useState('');
  const [tagsText, setTagsText] = useState('');

  const load = async () => {
    setLoading(true); setError(null);
    try { setItems(await adminFetch('recipes')); } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ category: 'ranajky', difficulty: 'easy', active: true });
    setIngText(''); setStepsText(''); setAllerText(''); setTagsText('');
    setEditId(null); setShowForm(true); setError(null);
  };
  const openEdit = (r: RecipeRow) => {
    setForm({ ...r });
    setIngText((r.ingredients ?? []).map(i => `${i.name}: ${i.amount}`).join('\n'));
    setStepsText((r.steps ?? []).join('\n'));
    setAllerText((r.allergens ?? []).join(', '));
    setTagsText((r.tags ?? []).join(', '));
    setEditId(r.id); setShowForm(true); setError(null);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setError(null); };

  const generateId = (title: string, cat: string) =>
    `${cat}-${title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 40)}-${Date.now()}`;

  const parseIngredients = (text: string) =>
    text.split('\n').filter(Boolean).map(line => {
      const idx = line.indexOf(':');
      return idx > -1 ? { name: line.slice(0, idx).trim(), amount: line.slice(idx + 1).trim() } : { name: line.trim(), amount: '' };
    });

  const save = async () => {
    if (!form.title) return;
    setSaving(true); setError(null);
    try {
      const payload: RecipeRow = {
        id: editId ?? generateId(form.title!, form.category ?? 'ranajky'),
        title: form.title!,
        category: form.category ?? 'ranajky',
        description: form.description ?? '',
        prep_time: Number(form.prep_time) || 15,
        servings: Number(form.servings) || 2,
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
        fiber: Number(form.fiber) || 0,
        ingredients: parseIngredients(ingText),
        steps: stepsText.split('\n').filter(Boolean),
        allergens: allerText.split(',').map(s => s.trim()).filter(Boolean),
        dietary: form.dietary ?? [],
        tags: tagsText.split(',').map(s => s.trim()).filter(Boolean),
        image: form.image ?? '',
        difficulty: form.difficulty ?? 'easy',
        pdf_path: form.pdf_path ?? '',
        active: form.active ?? true,
      };
      await adminUpsert('recipes', payload as unknown as Record<string, unknown>);
      await load(); closeForm();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Naozaj chceš vymazať tento recept?')) return;
    try { await adminDelete('recipes', id); setItems(p => p.filter(r => r.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const toggleActive = async (r: RecipeRow) => {
    try {
      await adminUpsert('recipes', { ...r, active: !r.active } as unknown as Record<string, unknown>);
      setItems(p => p.map(x => x.id === r.id ? { ...x, active: !r.active } : x));
    } catch (e: any) { alert(e.message); }
  };

  // Seed with static data from src/data/recipes.ts
  const seedFromStatic = async () => {
    setSeeding(true); setError(null);
    try {
      const { recipes: staticRecipes } = await import('../../data/recipes');
      const payload = staticRecipes.map((r: any) => ({
        id: r.id, title: r.title, category: r.category, description: r.description ?? '',
        prep_time: r.prepTime, servings: r.servings, calories: r.calories,
        protein: r.protein, carbs: r.carbs, fat: r.fat, fiber: r.fiber,
        ingredients: r.ingredients ?? [], steps: r.steps ?? [],
        allergens: r.allergens ?? [], dietary: r.dietary ?? [], tags: r.tags ?? [],
        image: r.image ?? '', difficulty: r.difficulty ?? 'easy', pdf_path: r.pdfPath ?? '',
        active: true,
      }));
      const count = await adminSeed('recipes', payload);
      alert(`✅ Importovaných ${count} receptov`);
      await load();
    } catch (e: any) { setError(e.message); }
    setSeeding(false);
  };

  const CATS = ['ranajky', 'obed', 'vecera', 'snack', 'smoothie'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Recipe Database</h2>
        <div className="flex gap-2">
          <button onClick={seedFromStatic} disabled={seeding} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.accent }}>
            {seeding ? '⟳ Importujem...' : '⬆ Import statických receptov'}
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.strava }}>
            <Plus className="w-4 h-4" />Nový recept
          </button>
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"><AlertTriangle className="w-4 h-4 inline mr-2" />{error}</div>}

      {showForm && (
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{editId ? 'Upraviť recept' : 'Nový recept'}</h3>
            <button onClick={closeForm}><X className="w-4 h-4" style={{ color: colors.textSecondary }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Názov *</label>
              <input value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Kategória</label>
              <select value={form.category ?? 'ranajky'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Obtiažnosť</label>
              <select value={form.difficulty ?? 'easy'} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                <option value="easy">Jednoduchý</option>
                <option value="medium">Stredný</option>
              </select>
            </div>
            {[['prep_time','Čas prípravy (min)'],['servings','Porcie'],['calories','Kalórie'],['protein','Bielkoviny (g)'],['carbs','Sacharidy (g)'],['fat','Tuky (g)']].map(([field, label]) => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>{label}</label>
                <input type="number" value={(form as any)[field] ?? ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>URL obrázka</label>
              <input value={form.image ?? ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Popis</label>
              <textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Ingrediencie (jeden na riadok, formát "Názov: Množstvo")</label>
              <textarea value={ingText} onChange={e => setIngText(e.target.value)} rows={5} placeholder="Avokádo: 1 ks&#10;Vajíčko: 2 ks" className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none font-mono" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Postup (jeden krok na riadok)</label>
              <textarea value={stepsText} onChange={e => setStepsText(e.target.value)} rows={4} placeholder="Nakrájaj avokádo..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Alergény (čiarkou oddelené)</label>
              <input value={allerText} onChange={e => setAllerText(e.target.value)} placeholder="dairy, gluten" className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Tagy (čiarkou oddelené)</label>
              <input value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="postpartum, proteín" className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                {form.active ? <CheckSquare className="w-5 h-5" style={{ color: colors.strava }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
              </button>
              <span className="text-sm" style={{ color: colors.textPrimary }}>Aktívny</span>
            </div>
          </div>
          {error && <div className="mt-3 text-sm text-red-600"><AlertTriangle className="w-4 h-4 inline mr-1" />{error}</div>}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>Zrušiť</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2" style={{ backgroundColor: saving ? `${colors.strava}80` : colors.strava }}>
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}Uložiť
            </button>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? <div className="py-8 text-center text-sm" style={{ color: colors.textSecondary }}>Načítavam...</div> : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>{items.length} receptov</span>
            </div>
            <div className="space-y-2">
              {items.length === 0 && <p className="py-6 text-center text-sm" style={{ color: colors.textSecondary }}>Žiadne recepty. Pridaj prvý alebo importuj statické.</p>}
              {items.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/20">
                  <div className="flex items-center gap-3">
                    {r.image && <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{r.title}</div>
                      <div className="text-xs flex gap-2" style={{ color: colors.textSecondary }}>
                        <span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors.strava}20`, color: colors.strava }}>{r.category}</span>
                        <span>{r.calories} kcal</span>
                        <span>{r.prep_time} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleActive(r)} title={r.active ? 'Deaktivácia' : 'Aktivácia'}>
                      {r.active ? <CheckSquare className="w-4 h-4" style={{ color: colors.strava }} /> : <Square className="w-4 h-4" style={{ color: colors.textSecondary }} />}
                    </button>
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-white/20"><Edit3 className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} /></button>
                    <button onClick={() => remove(r.id)} className="p-1.5 rounded-lg hover:bg-white/20"><Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════
// EXERCISES TAB — Supabase CRUD
// ═══════════════════════════════════════════
interface ExerciseRow {
  id: string; content_type: 'exercise' | 'stretch'; name: string;
  duration: string; category: string; body: string; equip: string;
  level: number | null; diastasis_safe: boolean; thumb: string;
  description: string; video_url: string; active: boolean;
}

function ExercisesTab() {
  const [items, setItems] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ExerciseRow>>({ content_type: 'exercise', duration: '15 min', active: true, diastasis_safe: true });

  const load = async () => {
    setLoading(true); setError(null);
    try { setItems(await adminFetch('exercises')); } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ content_type: 'exercise', duration: '15 min', active: true, diastasis_safe: true }); setEditId(null); setShowForm(true); setError(null); };
  const openEdit = (r: ExerciseRow) => { setForm({ ...r }); setEditId(r.id); setShowForm(true); setError(null); };
  const closeForm = () => { setShowForm(false); setEditId(null); setError(null); };

  const save = async () => {
    if (!form.name) return;
    setSaving(true); setError(null);
    try {
      const payload: ExerciseRow = {
        id: editId ?? `${form.content_type}-${Date.now()}`,
        content_type: form.content_type ?? 'exercise',
        name: form.name!,
        duration: form.duration ?? '15 min',
        category: form.category ?? '',
        body: form.body ?? '',
        equip: form.equip ?? 'Bez pomôcok',
        level: form.content_type === 'exercise' ? (Number(form.level) || null) : null,
        diastasis_safe: form.content_type === 'exercise' ? (form.diastasis_safe ?? true) : true,
        thumb: form.thumb ?? '',
        description: form.description ?? '',
        video_url: form.video_url ?? '',
        active: form.active ?? true,
      };
      await adminUpsert('exercises', payload as unknown as Record<string, unknown>);
      await load(); closeForm();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Naozaj?')) return;
    try { await adminDelete('exercises', id); setItems(p => p.filter(r => r.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const toggleActive = async (r: ExerciseRow) => {
    try {
      await adminUpsert('exercises', { ...r, active: !r.active } as unknown as Record<string, unknown>);
      setItems(p => p.map(x => x.id === r.id ? { ...x, active: !r.active } : x));
    } catch (e: any) { alert(e.message); }
  };

  const seedFromStatic = async () => {
    setSeeding(true); setError(null);
    try {
      const { TeloExtraStaticData } = await import('../../data/teloExtraData').catch(() => ({ TeloExtraStaticData: [] }));
      const { TeloStrecingStaticData } = await import('../../data/teloStrecingData').catch(() => ({ TeloStrecingStaticData: [] }));
      // If no separate data files exist, note to user they can add manually
      if (TeloExtraStaticData.length === 0 && TeloStrecingStaticData.length === 0) {
        alert('Statické dáta cvičení nie sú v samostatnom súbore. Pridaj cvičenia manuálne.');
        setSeeding(false); return;
      }
      const payload = [
        ...TeloExtraStaticData.map((e: any) => ({ ...e, content_type: 'exercise' })),
        ...TeloStrecingStaticData.map((s: any) => ({ ...s, content_type: 'stretch' })),
      ];
      const count = await adminSeed('exercises', payload);
      alert(`✅ Importovaných ${count} cvičení`);
      await load();
    } catch (e: any) { setError(e.message); }
    setSeeding(false);
  };

  const exercises = items.filter(i => i.content_type === 'exercise');
  const stretches = items.filter(i => i.content_type === 'stretch');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Exercise Library</h2>
        <div className="flex gap-2">
          <button onClick={seedFromStatic} disabled={seeding} className="px-4 py-2 rounded-xl text-sm font-medium border-2 text-white" style={{ backgroundColor: colors.accent, borderColor: colors.accent }}>
            {seeding ? '⟳ ...' : '⬆ Import'}
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
            <Plus className="w-4 h-4" />Nové cvičenie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[['Celkovo', items.length, colors.textPrimary], ['Silové', exercises.length, colors.telo], ['Strečing', stretches.length, colors.mysel]].map(([label, val, col]) => (
          <AdminCard key={label as string}><div className="text-center"><div className="text-2xl font-bold" style={{ color: col as string }}>{val as number}</div><div className="text-sm" style={{ color: colors.textSecondary }}>{label as string}</div></div></AdminCard>
        ))}
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"><AlertTriangle className="w-4 h-4 inline mr-2" />{error}</div>}

      {showForm && (
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{editId ? 'Upraviť cvičenie' : 'Nové cvičenie'}</h3>
            <button onClick={closeForm}><X className="w-4 h-4" style={{ color: colors.textSecondary }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Typ</label>
              <select value={form.content_type ?? 'exercise'} onChange={e => setForm(f => ({ ...f, content_type: e.target.value as 'exercise' | 'stretch' }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                <option value="exercise">Silové cvičenie</option>
                <option value="stretch">Strečing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Názov *</label>
              <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Dĺžka</label>
              <select value={form.duration ?? '15 min'} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                <option value="5 min">5 min</option>
                <option value="15 min">15 min</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Partie tela</label>
              <input value={form.body ?? ''} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Celé telo / Core / Nohy..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Pomôcky</label>
              <select value={form.equip ?? 'Bez pomôcok'} onChange={e => setForm(f => ({ ...f, equip: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                <option>Bez pomôcok</option>
                <option>S gumou</option>
                <option>S činkami</option>
              </select>
            </div>
            {form.content_type === 'exercise' && (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Level (1-4)</label>
                <select value={form.level ?? 1} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                  {[1,2,3,4].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>URL náhľadového obrázka</label>
              <input value={form.thumb ?? ''} onChange={e => setForm(f => ({ ...f, thumb: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Video URL</label>
              <input value={form.video_url ?? ''} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Popis</label>
              <textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                {form.active ? <CheckSquare className="w-5 h-5" style={{ color: colors.strava }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
              </button>
              <span className="text-sm" style={{ color: colors.textPrimary }}>Aktívne</span>
            </div>
            {form.content_type === 'exercise' && (
              <div className="flex items-center gap-2">
                <button onClick={() => setForm(f => ({ ...f, diastasis_safe: !f.diastasis_safe }))}>
                  {form.diastasis_safe ? <CheckSquare className="w-5 h-5" style={{ color: colors.strava }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
                </button>
                <span className="text-sm" style={{ color: colors.textPrimary }}>Bezpečné pri diastáze</span>
              </div>
            )}
          </div>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>Zrušiť</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2" style={{ backgroundColor: colors.telo }}>
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}Uložiť
            </button>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? <div className="py-8 text-center text-sm" style={{ color: colors.textSecondary }}>Načítavam...</div> : (
          <div className="space-y-2">
            {items.length === 0 && <p className="py-6 text-center text-sm" style={{ color: colors.textSecondary }}>Žiadne cvičenia. Pridaj prvé.</p>}
            {items.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-3">
                  {r.thumb && <img src={r.thumb} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div>
                    <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{r.name}</div>
                    <div className="text-xs flex gap-2" style={{ color: colors.textSecondary }}>
                      <span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${r.content_type === 'exercise' ? colors.telo : colors.mysel}20`, color: r.content_type === 'exercise' ? colors.telo : colors.mysel }}>
                        {r.content_type === 'exercise' ? 'Silové' : 'Strečing'}
                      </span>
                      <span>{r.duration}</span>
                      {r.body && <span>{r.body}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(r)}>{r.active ? <CheckSquare className="w-4 h-4" style={{ color: colors.strava }} /> : <Square className="w-4 h-4" style={{ color: colors.textSecondary }} />}</button>
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-white/20"><Edit3 className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} /></button>
                  <button onClick={() => remove(r.id)} className="p-1.5 rounded-lg hover:bg-white/20"><Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════
// MEDITATIONS TAB — Supabase CRUD
// ═══════════════════════════════════════════
interface MeditationRow {
  id: string; title: string; duration: string; description: string;
  audio_url: string; image: string; category: string;
  featured: boolean; active: boolean;
}

function MeditationsTab() {
  const [items, setItems] = useState<MeditationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<MeditationRow>>({ duration: '5 min', category: 'Stres', active: true, featured: false });

  const load = async () => {
    setLoading(true); setError(null);
    try { setItems(await adminFetch('meditations')); } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ duration: '5 min', category: 'Stres', active: true, featured: false }); setEditId(null); setShowForm(true); setError(null); };
  const openEdit = (r: MeditationRow) => { setForm({ ...r }); setEditId(r.id); setShowForm(true); setError(null); };
  const closeForm = () => { setShowForm(false); setEditId(null); setError(null); };

  const save = async () => {
    if (!form.title) return;
    setSaving(true); setError(null);
    try {
      const payload: MeditationRow = {
        id: editId ?? `med-${Date.now()}`,
        title: form.title!,
        duration: form.duration ?? '5 min',
        description: form.description ?? '',
        audio_url: form.audio_url ?? '',
        image: form.image ?? '',
        category: form.category ?? 'Stres',
        featured: form.featured ?? false,
        active: form.active ?? true,
      };
      await adminUpsert('meditations', payload as unknown as Record<string, unknown>);
      await load(); closeForm();
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Naozaj?')) return;
    try { await adminDelete('meditations', id); setItems(p => p.filter(r => r.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const toggleActive = async (r: MeditationRow) => {
    try {
      await adminUpsert('meditations', { ...r, active: !r.active } as unknown as Record<string, unknown>);
      setItems(p => p.map(x => x.id === r.id ? { ...x, active: !r.active } : x));
    } catch (e: any) { alert(e.message); }
  };

  const seedFromStatic = async () => {
    setSeeding(true); setError(null);
    try {
      // Import inline meditations from MyselNew — they're hardcoded there
      // We provide the static seed here directly
      const staticMeds: MeditationRow[] = [
        { id: 'med-1', category: 'Stres', title: 'Nájdenie vnútorného pokoja uprostred chaosu', duration: '5 min', description: 'Naučte sa nájsť pokojné miesto vo svojej mysli aj v najrušnejších dňoch', audio_url: '/audio/inner-peace-chaos.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-2', category: 'Mindfulness', title: 'Učenie sa byť prítomná pri každodenných úlohách', duration: '5 min', description: 'Transformujte bežné činnosti na príležitosti pre mindfulness', audio_url: '/audio/present-daily-tasks.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-3', category: 'Materstvo', title: 'Objavovanie trpezlivosti vo výchovnom procese', duration: '5 min', description: 'Kultivujte trpezlivosť a porozumenie v náročných výchovných momentoch', audio_url: '/audio/patience-parenting.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-4', category: 'Mindfulness', title: 'Nájdenie radosti v malých veciach', duration: '5 min', description: 'Objavte krásu v jednoduchých, každodenných momentoch', audio_url: '/audio/joy-small-things.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-5', category: 'Emócie', title: 'Udržiavanie emocionálnej rovnováhy', duration: '5 min', description: 'Technika na stabilizovanie emócií a nájdenie vnútornej harmónie', audio_url: '/audio/emotional-balance.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-6', category: 'Ja', title: 'Vytváranie času pre seba', duration: '5 min', description: 'Naučte sa prioritizovať svoju pohodu a vytvoriť priestor pre seba', audio_url: '/audio/time-for-self.mp3', image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-7', category: 'Materstvo', title: 'Posilňovanie väzby s dieťaťom', duration: '5 min', description: 'Meditácia zameraná na prehĺbenie lásky a spojenia s vaším dieťaťom', audio_url: '/audio/bond-with-child.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-8', category: 'Materstvo', title: 'Prijímanie nepredvídateľnosti materstva', duration: '5 min', description: 'Naučte sa flexibilne reagovať na neočakávané situácie v materstve', audio_url: '/audio/accept-unpredictability.mp3', image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-9', category: 'Emócie', title: 'Naučiť sa odpúšťať sebe a iným', duration: '5 min', description: 'Oslobodenie sa od viny a rozhorčenia cez praktiku odpúštania', audio_url: '/audio/forgiveness-practice.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-10', category: 'Emócie', title: 'Rozvíjanie empatie a porozumenia', duration: '5 min', description: 'Prehĺbenie schopnosti porozumieť sebe aj ostatným s láskavosťou', audio_url: '/audio/empathy-understanding.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-11', category: 'Stres', title: 'Prekonávanie stresu a úzkosti', duration: '5 min', description: 'Efektívne techniky na zvládanie stresu a upokojenie anxióznych myšlienok', audio_url: '/audio/overcome-stress-anxiety.mp3', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-12', category: 'Ja', title: 'Budovanie sebadôvery a sebaúcty', duration: '5 min', description: 'Posilnenie vnútornej sily a pozitívneho vzťahu k sebe', audio_url: '/audio/self-confidence-esteem.mp3', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-13', category: 'Ja', title: 'Nájdenie rovnováhy medzi kariérou a osobným životom', duration: '5 min', description: 'Harmonizácia pracovných a osobných priorít s múdrosťou', audio_url: '/audio/work-life-balance.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-14', category: 'Ja', title: 'Učenie sa hovoriť „nie" bez pocitu viny', duration: '5 min', description: 'Nastavenie zdravých hraníc a sebapéča bez pocitov viny', audio_url: '/audio/saying-no-guilt.mp3', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-15', category: 'Ja', title: 'Rozvíjanie kreativity a hľadanie inšpirácie', duration: '5 min', description: 'Prebudenie tvorivého ducha a otvorenie sa novým možnostiam', audio_url: '/audio/creativity-inspiration.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-16', category: 'Emócie', title: 'Zvládanie pocitu osamelosti a izolácie', duration: '5 min', description: 'Nájdenie spojenia a zmyslu aj v momentoch osamelosti', audio_url: '/audio/loneliness-isolation.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', featured: false, active: true },
        { id: 'med-17', category: 'Mindfulness', title: 'Udržiavanie pozitívneho myslenia', duration: '5 min', description: 'Kultivovanie optimizmu a vďačnosti v každodennom živote', audio_url: '/audio/positive-thinking.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, active: true },
      ];
      const count = await adminSeed('meditations', staticMeds as unknown as Record<string, unknown>[]);
      alert(`✅ Importovaných ${count} meditácií`);
      await load();
    } catch (e: any) { setError(e.message); }
    setSeeding(false);
  };

  const CATS = ['Stres', 'Mindfulness', 'Materstvo', 'Emócie', 'Ja'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Meditation Content</h2>
        <div className="flex gap-2">
          {items.length === 0 && !loading && (
            <button onClick={seedFromStatic} disabled={seeding} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.accent }}>
              {seeding ? '⟳ Importujem...' : '⬆ Import 17 meditácií'}
            </button>
          )}
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.mysel }}>
            <Plus className="w-4 h-4" />Nová meditácia
          </button>
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600"><AlertTriangle className="w-4 h-4 inline mr-2" />{error}</div>}

      {showForm && (
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>{editId ? 'Upraviť meditáciu' : 'Nová meditácia'}</h3>
            <button onClick={closeForm}><X className="w-4 h-4" style={{ color: colors.textSecondary }} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Názov *</label>
              <input value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Kategória</label>
              <select value={form.category ?? 'Stres'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Dĺžka</label>
              <select value={form.duration ?? '5 min'} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
                <option value="5 min">5 min</option>
                <option value="10 min">10 min</option>
                <option value="15 min">15 min</option>
                <option value="20 min">20 min</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Popis</label>
              <textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Audio URL</label>
              <input value={form.audio_url ?? ''} onChange={e => setForm(f => ({ ...f, audio_url: e.target.value }))} placeholder="/audio/file.mp3 alebo https://..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>URL obrázka</label>
              <input value={form.image ?? ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                {form.active ? <CheckSquare className="w-5 h-5" style={{ color: colors.strava }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
              </button>
              <span className="text-sm" style={{ color: colors.textPrimary }}>Aktívna</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}>
                {form.featured ? <CheckSquare className="w-5 h-5" style={{ color: colors.accent }} /> : <Square className="w-5 h-5" style={{ color: colors.textSecondary }} />}
              </button>
              <span className="text-sm" style={{ color: colors.textPrimary }}>Odporúčaná</span>
            </div>
          </div>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeForm} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary }}>Zrušiť</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl text-sm text-white flex items-center gap-2" style={{ backgroundColor: colors.mysel }}>
              {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}Uložiť
            </button>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? <div className="py-8 text-center text-sm" style={{ color: colors.textSecondary }}>Načítavam...</div> : (
          <div className="space-y-2">
            {items.length === 0 && <p className="py-6 text-center text-sm" style={{ color: colors.textSecondary }}>Žiadne meditácie. Importuj existujúce alebo pridaj novú.</p>}
            {items.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/20">
                <div className="flex items-center gap-3">
                  {r.image && <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                  <div>
                    <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{r.title}</div>
                    <div className="text-xs flex gap-2" style={{ color: colors.textSecondary }}>
                      <span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors.mysel}20`, color: colors.mysel }}>{r.category}</span>
                      <span>{r.duration}</span>
                      {r.featured && <span className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>⭐ Featured</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(r)}>{r.active ? <CheckSquare className="w-4 h-4" style={{ color: colors.strava }} /> : <Square className="w-4 h-4" style={{ color: colors.textSecondary }} />}</button>
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-white/20"><Edit3 className="w-3.5 h-3.5" style={{ color: colors.textSecondary }} /></button>
                  <button onClick={() => remove(r.id)} className="p-1.5 rounded-lg hover:bg-white/20"><Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

// ─── ProgramsTab ─────────────────────────────────────────────────────────────
function ProgramsTab() {
  type ProgItem = { id: string; name: string; level: number; weeks: number; description: string; detailed_description: string; image: string; schedule: any[]; active: boolean };
  const empty: ProgItem = { id: '', name: '', level: 1, weeks: 8, description: '', detailed_description: '', image: '', schedule: [], active: true };
  const [items, setItems] = useState<ProgItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [editing, setEditing] = useState<ProgItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const staticPrograms = [
    { id: 'postpartum', name: 'Postpartum', level: 1, weeks: 8, description: 'Ak potrebuješ spevniť brušný korzet, vyriešiť diastázu či inkontinenciu', detailed_description: '', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop', schedule: [], active: true },
    { id: 'bodyforming', name: 'BodyForming', level: 2, weeks: 6, description: 'Ak chceš začať spevňovať celé telo a cvičiť s vlastnou váhou.', detailed_description: '', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop', schedule: [], active: true },
    { id: 'shapeforming', name: 'ShapeForming', level: 3, weeks: 6, description: 'Ak chceš formovať postavu a cvičiť s gumami.', detailed_description: '', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=500&fit=crop', schedule: [], active: true },
    { id: 'strong-sexy', name: 'Strong&Sexy', level: 4, weeks: 6, description: 'Ak snívaš o silnom, vyformovanom a funkčnom sexy tele.', detailed_description: '', image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&h=500&fit=crop', schedule: [], active: true },
  ];

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('programmes');
      setItems(res.items ?? []);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      await adminUpsert('programmes', editing);
      await load();
      setEditing(null);
    } catch (e: any) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Zmazať program?')) return;
    try {
      await adminDelete('programmes', id);
      setItems(p => p.filter(x => x.id !== id));
    } catch (e: any) { alert(e.message); }
  };

  const seedFromStatic = async () => {
    setSeeding(true); setError(null);
    try {
      const count = await adminSeed('programmes', staticPrograms);
      alert(`✅ Importovaných ${count} programov`);
      await load();
    } catch (e: any) { setError(e.message); }
    setSeeding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Fitness Programy</h2>
        <div className="flex gap-2">
          <button onClick={seedFromStatic} disabled={seeding} className="px-3 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.accent }}>
            {seeding ? 'Importujem…' : '⬆ Import statických dát'}
          </button>
          <button onClick={() => setEditing({ ...empty, id: `prog-${Date.now()}` })} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
            <Plus className="w-4 h-4 mr-2 inline" />Nový program
          </button>
        </div>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

      {/* Edit form */}
      {editing && (
        <AdminCard title={editing.name || 'Nový program'}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block" style={{ color: colors.textSecondary }}>Názov</label>
              <input value={editing.name} onChange={e => setEditing(p => p && ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/40 border border-white/40 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: colors.textSecondary }}>Level (1-4)</label>
              <input type="number" min={1} max={4} value={editing.level} onChange={e => setEditing(p => p && ({ ...p, level: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg bg-white/40 border border-white/40 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: colors.textSecondary }}>Týždne</label>
              <input type="number" min={1} value={editing.weeks} onChange={e => setEditing(p => p && ({ ...p, weeks: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg bg-white/40 border border-white/40 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block" style={{ color: colors.textSecondary }}>Krátky popis</label>
              <textarea rows={2} value={editing.description} onChange={e => setEditing(p => p && ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/40 border border-white/40 text-sm resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block" style={{ color: colors.textSecondary }}>Detailný popis</label>
              <textarea rows={4} value={editing.detailed_description} onChange={e => setEditing(p => p && ({ ...p, detailed_description: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/40 border border-white/40 text-sm resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block" style={{ color: colors.textSecondary }}>Obrázok (URL)</label>
              <input value={editing.image} onChange={e => setEditing(p => p && ({ ...p, image: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/40 border border-white/40 text-sm" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={editing.active} onChange={e => setEditing(p => p && ({ ...p, active: e.target.checked }))} className="w-4 h-4" />
              <label className="text-sm" style={{ color: colors.textSecondary }}>Aktívny (viditeľný v aplikácii)</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
              {saving ? 'Ukladám…' : 'Uložiť'}
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm font-medium border border-white/40 bg-white/20" style={{ color: colors.textSecondary }}>
              Zrušiť
            </button>
          </div>
        </AdminCard>
      )}

      {/* List */}
      <AdminCard title={`Programy (${items.length})`}>
        {loading ? <div className="py-8 text-center text-sm" style={{ color: colors.textSecondary }}>Načítavam…</div>
          : items.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>Žiadne programy. Importuj statické dáta alebo pridaj nový.</p>
              <button onClick={seedFromStatic} disabled={seeding} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
                {seeding ? 'Importujem…' : 'Import statických dát'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/20 border border-white/20">
                  <div className="flex items-center gap-3">
                    {r.image && <img src={r.image} className="w-12 h-12 rounded-lg object-cover" />}
                    <div>
                      <div className="font-medium text-sm" style={{ color: colors.textPrimary }}>{r.name}</div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>Level {r.level} • {r.weeks} týždňov • {r.active ? 'Aktívny' : 'Neaktívny'}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(r)} className="p-1.5 rounded-lg hover:bg-white/20"><Pencil className="w-3.5 h-3.5" style={{ color: colors.accent }} /></button>
                    <button onClick={() => remove(r.id)} className="p-1.5 rounded-lg hover:bg-white/20"><Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </AdminCard>
    </div>
  );
}

export default function AdminNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    if (activeTab !== 'overview') return;
    setAnalyticsLoading(true);
    fetch('/.netlify/functions/admin-get-analytics')
      .then(r => r.json())
      .then(data => { setAnalytics(data); setAnalyticsLoading(false); })
      .catch(() => setAnalyticsLoading(false));
  }, [activeTab]);

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

  const renderOverview = () => {
    const stat = (val: number | undefined) => analyticsLoading ? '…' : (val ?? 0).toString();
    return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Vitaj späť, Admin</h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Aktuálny stav NeoMe</p>
        </div>
        <div className="text-xs flex items-center gap-2" style={{ color: colors.textTertiary }}>
          {analyticsLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
          Aktualizované: {new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Key Metrics — real data */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6" style={{ color: colors.strava }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Celkovo používateľov</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{stat(analytics?.totalUsers)}</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>{stat(analytics?.newUsersMonth)} nových tento mesiac</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" style={{ color: colors.strava }} />
            <span className="text-xs font-medium" style={{ color: colors.strava }}>Live data</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Euro className="w-6 h-6" style={{ color: colors.accent }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Premium predplatitelia</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{stat(analytics?.activeSubscriptions)}</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>{stat(analytics?.freeUsers)} free používateľov</div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Gift className="w-6 h-6" style={{ color: colors.periodka }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Referrals</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{stat(analytics?.referralCount)}</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>celkovo odporúčaní</div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Flag className="w-6 h-6" style={{ color: colors.telo }} />
            <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>Komunita</span>
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>{stat(analytics?.postsCount)}</div>
          <div className="text-sm" style={{ color: colors.textTertiary }}>príspevkov spolu</div>
        </Card>
      </div>

      {/* Quick Actions + Recent signups */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Rýchle akcie</h3>
          <div className="space-y-3">
            {[
              { label: 'Users', desc: 'Spravovať účty', icon: Users, tab: 'users' },
              { label: 'Blog', desc: 'Nový príspevok', icon: BookOpen, tab: 'blog' },
              { label: 'Community', desc: 'Moderovať príspevky', icon: Flag, tab: 'community' },
              { label: 'Promo Kódy', desc: 'Stripe zľavové kódy', icon: Percent, tab: 'promo-codes' },
              { label: 'Content', desc: 'Videá a fotky', icon: FolderOpen, tab: 'content' },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
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
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>Najnovší používatelia</h3>
          {analyticsLoading ? (
            <div className="py-4 text-center text-sm" style={{ color: colors.textSecondary }}>Načítavam…</div>
          ) : (analytics?.recentUsers ?? []).length === 0 ? (
            <div className="py-4 text-center text-sm" style={{ color: colors.textSecondary }}>Žiadni používatelia. Skontroluj SUPABASE_SERVICE_ROLE_KEY v Netlify.</div>
          ) : (
            <div className="space-y-3">
              {(analytics?.recentUsers ?? []).map((u, i) => (
                <div key={i} className="flex items-center gap-3 pb-2 border-b border-white/10 last:border-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.accent})` }}>
                    {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>{u.full_name || u.email}</div>
                    <div className="text-xs" style={{ color: colors.textTertiary }}>{new Date(u.created_at).toLocaleDateString('sk-SK')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
  };


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

  const renderMessages = () => <MessagesTab />;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'content':
        return <ContentManager />;
      case 'programs':
        return <ProgramsTab />;
      case 'exercises':
        return <ExercisesTab />;
      case 'recipes':
        return <RecipesTab />;
      case 'meditations':
        return <MeditationsTab />;
      case 'community':
        return <CommunityModerationTab />;
      case 'messages':
        return renderMessages();
      case 'users':
        return <UsersTab />;
      case 'blog':
        return <BlogPostsTab />;
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
        ✅ v3 — Updated!
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