import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Gift, BarChart3, Euro, Dumbbell, Utensils, Music, Flag, MessageSquare,
  Calendar, FolderOpen, Bell, Settings, LogOut, Shield, ChevronRight, Plus,
  Eye, Trash2, Edit3, Pencil, TrendingUp, Activity, Send, ArrowLeft,
  Tag, Percent, Mail, Play, CheckSquare, Square, X, Check, AlertTriangle,
  BookOpen, RefreshCw, ExternalLink, Search
} from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import { supabase } from '../../lib/supabase';
import { uploadContentImage } from '../../lib/storage';
import BlogEditor from '../../components/admin/BlogEditor';
import ContentManager from '../../components/admin/ContentManager';
import { useAdminMessages } from '../../hooks/useMessages';
import { recipes as staticRecipesData } from '../../data/recipes';
import { TeloExtraStaticData } from '../../data/teloExtraData';
import { TeloStrecingStaticData } from '../../data/teloStrecingData';

// A14 tokens (forward-declared for use in tab components before the const A block)
const _A = {
  BG:       '#F8F5F0',
  SIDEBAR:  '#FAF7F2',
  CARD:     '#FFFFFF',
  CREAM2:   '#F1ECE3',
  DEEP:     '#3D2921',
  EYEBROW:  'rgba(61,41,33,0.55)',
  MUTED:    'rgba(61,41,33,0.72)',
  TERTIARY: 'rgba(61,41,33,0.42)',
  HAIR:     'rgba(61,41,33,0.08)',
  HAIR2:    'rgba(61,41,33,0.14)',
  GOLD:     '#B8864A',
  SAGE:     '#8B9E88',
  TERRA:    '#C1856A',
  MAUVE:    '#A8848B',
};

// Simple Card component
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className} style={{ background: _A.CARD, borderRadius: 16, border: `1px solid ${_A.HAIR}`, padding: '22px 24px' }}>{children}</div>
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

const inputStyle: React.CSSProperties = { background: _A.CREAM2, border: `1px solid rgba(61,41,33,0.10)`, borderRadius: 10, padding: '9px 12px', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP, width: '100%', outline: 'none', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { display: 'block', fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 6 };
const btnPrimary: React.CSSProperties = { background: _A.DEEP, color: '#fff', borderRadius: 10, padding: '10px 16px', border: 'none', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer' };
const btnSecondary: React.CSSProperties = { background: _A.CREAM2, color: _A.DEEP, borderRadius: 10, padding: '10px 16px', border: 'none', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer' };
const btnDanger: React.CSSProperties = { background: _A.TERRA, color: '#fff', borderRadius: 10, padding: '10px 16px', border: 'none', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer' };

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

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '11px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Partner Zľavy</div>
        <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 14, height: 14 }} />Pridať partnera
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>{editId ? 'Upraviť zľavu' : 'Nová partnerská zľava'}</div>
            <button onClick={closeForm} style={{ all: 'unset', cursor: 'pointer' }}><X style={{ width: 16, height: 16, color: _A.MUTED }} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Meno partnera *</label>
              <input value={form.partnerName || ''} onChange={e => setForm(f => ({ ...f, partnerName: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kód *</label>
              <input value={form.code || ''} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div>
              <label style={labelStyle}>Hodnota zľavy</label>
              <input value={form.discountValue || ''} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder="napr. 20% alebo €10" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kategória</label>
              <select value={form.category || 'wellness'} onChange={e => setForm(f => ({ ...f, category: e.target.value as PartnerDiscount['category'] }))} style={inputStyle}>
                <option value="wellness">Wellness</option>
                <option value="food">Jedlo</option>
                <option value="fitness">Fitness</option>
                <option value="other">Iné</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Platnosť do</label>
              <input type="date" value={form.expiryDate || ''} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <button onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))} style={{ all: 'unset', cursor: 'pointer' }}>
                  {form.isActive ? <CheckSquare style={{ width: 18, height: 18, color: _A.SAGE }} /> : <Square style={{ width: 18, height: 18, color: _A.MUTED }} />}
                </button>
                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP }}>Aktívna</span>
              </label>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Popis</label>
              <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button onClick={closeForm} style={btnSecondary}>Zrušiť</button>
            <button onClick={save} style={btnPrimary}>Uložiť</button>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: _A.CREAM2, borderRadius: 8 }}>
              {['Partner', 'Kód', 'Zľava', 'Kategória', 'Platnosť', 'Aktívna', 'Akcie'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} style={{ borderBottom: `1px solid ${_A.HAIR}` }}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{d.partnerName}</div>
                  {d.description && <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 2 }}>{d.description}</div>}
                </td>
                <td style={{ padding: '12px 14px' }}><span style={{ fontFamily: 'monospace', fontSize: 11, padding: '3px 8px', borderRadius: 6, background: _A.CREAM2, color: _A.DEEP }}>{d.code}</span></td>
                <td style={{ padding: '12px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 600, color: _A.GOLD }}>{d.discountValue}</td>
                <td style={{ padding: '12px 14px' }}><span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: `rgba(193,133,106,0.18)`, color: _A.TERRA }}>{CATEGORY_LABELS[d.category]}</span></td>
                <td style={{ padding: '12px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>{d.expiryDate}</td>
                <td style={{ padding: '12px 14px' }}>
                  <button onClick={() => toggle(d.id)} style={{ all: 'unset', cursor: 'pointer' }}>
                    {d.isActive ? <CheckSquare style={{ width: 16, height: 16, color: _A.SAGE }} /> : <Square style={{ width: 16, height: 16, color: _A.MUTED }} />}
                  </button>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => openEdit(d)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Edit3 style={{ width: 14, height: 14, color: _A.MUTED }} /></button>
                    <button onClick={() => remove(d.id)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Trash2 style={{ width: 14, height: 14, color: _A.TERRA }} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '32px 14px', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadne partnerské zľavy.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════
// PROMO CODES TAB — live Stripe data
// ═══════════════════════════════════════════
interface StripePromoCodeRow {
  id: string;
  code: string;
  active: boolean;
  timesRedeemed: number;
  maxRedemptions: number | null;
  expiresAt: string | null;
  created: string;
  coupon: {
    id: string;
    name: string | null;
    percentOff: number | null;
    amountOff: number | null;
    currency: string | null;
    duration: string;
  };
}

function formatPromoDiscount(c: StripePromoCodeRow['coupon']): string {
  if (c.percentOff != null) return `${c.percentOff}%`;
  if (c.amountOff != null) {
    const amount = (c.amountOff / 100).toFixed(2).replace('.', ',');
    return `${amount} ${(c.currency ?? 'eur').toUpperCase()}`;
  }
  return '—';
}

function PromoCodesTab() {
  const [codes, setCodes] = useState<StripePromoCodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ code: string; discountType: 'percent' | 'fixed'; discountValueStr: string; maxUsesStr: string; expiryDate: string; description: string }>({
    code: '', discountType: 'percent', discountValueStr: '', maxUsesStr: '', expiryDate: '', description: '',
  });
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadErr(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-list-promo-codes', {
        method: 'GET',
        headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to load');
      setCodes(body.codes as StripePromoCodeRow[]);
    } catch (err: any) {
      setLoadErr(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ code: '', discountType: 'percent', discountValueStr: '', maxUsesStr: '', expiryDate: '', description: '' });
    setShowForm(true);
    setSaveError(null);
  };
  const closeForm = () => { setShowForm(false); setSaveError(null); };

  const saveCode = async () => {
    if (!form.code) return;
    setSaving(true);
    setSaveError(null);
    const val = parseFloat(form.discountValueStr || '0');
    const maxU = parseInt(form.maxUsesStr || '100', 10);
    try {
      const res = await fetch('/.netlify/functions/admin-create-promo-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: val,
          maxUses: maxU,
          expiryDate: form.expiryDate || null,
          description: form.description || form.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Stripe error');
      closeForm();
      // Re-fetch so the table reflects what's actually in Stripe.
      await load();
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const verify = () => {
    const c = codes.find(c => c.code.toUpperCase() === verifyInput.trim().toUpperCase());
    if (!c) { setVerifyResult({ ok: false, msg: 'Kód neexistuje.' }); return; }
    if (!c.active) { setVerifyResult({ ok: false, msg: 'Kód je neaktívny.' }); return; }
    if (c.expiresAt && new Date(c.expiresAt) < new Date()) { setVerifyResult({ ok: false, msg: 'Kód je po platnosti.' }); return; }
    if (c.maxRedemptions != null && c.timesRedeemed >= c.maxRedemptions) { setVerifyResult({ ok: false, msg: 'Kód bol vyčerpaný.' }); return; }
    const discStr = formatPromoDiscount(c.coupon);
    const usageStr = c.maxRedemptions != null ? `${c.timesRedeemed}/${c.maxRedemptions}` : `${c.timesRedeemed} (bez limitu)`;
    setVerifyResult({ ok: true, msg: `Platný! Zľava: ${discStr}. Použité: ${usageStr}.` });
  };

  const thStyle: React.CSSProperties = { textAlign: 'left', padding: '11px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Promo Kódy</div>
        <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 14, height: 14 }} />Nový kód
        </button>
      </div>

      {/* Verify tool */}
      <Card>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 16, fontWeight: 500, color: _A.DEEP, marginBottom: 14 }}>Overiť kód</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <input value={verifyInput} onChange={e => { setVerifyInput(e.target.value); setVerifyResult(null); }} placeholder="Zadaj kód..." style={{ ...inputStyle, flex: 1, fontFamily: 'monospace' }} />
          <button onClick={verify} style={btnPrimary}>Overiť</button>
        </div>
        {verifyResult && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: verifyResult.ok ? 'rgba(139,158,136,0.12)' : 'rgba(193,133,106,0.12)', border: `1px solid ${verifyResult.ok ? _A.SAGE : _A.TERRA}30` }}>
            {verifyResult.ok ? <Check style={{ width: 14, height: 14, color: _A.SAGE, flexShrink: 0 }} /> : <AlertTriangle style={{ width: 14, height: 14, color: _A.TERRA, flexShrink: 0 }} />}
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: verifyResult.ok ? _A.SAGE : _A.TERRA }}>{verifyResult.msg}</span>
          </div>
        )}
      </Card>

      {/* Form */}
      {showForm && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>Nový promo kód</div>
            <button onClick={closeForm} style={{ all: 'unset', cursor: 'pointer' }}><X style={{ width: 16, height: 16, color: _A.MUTED }} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Kód *</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div>
              <label style={labelStyle}>Typ zľavy</label>
              <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value as 'percent' | 'fixed' }))} style={inputStyle}>
                <option value="percent">Percentuálna (%)</option>
                <option value="fixed">Fixná (€)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Hodnota {form.discountType === 'fixed' ? '(€)' : '(%)'}</label>
              <input type="number" value={form.discountValueStr} onChange={e => setForm(f => ({ ...f, discountValueStr: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Max. použití</label>
              <input type="number" value={form.maxUsesStr} onChange={e => setForm(f => ({ ...f, maxUsesStr: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Platnosť do</label>
              <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Popis (interne)</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
          </div>
          {saveError && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30` }}>
              <AlertTriangle style={{ width: 14, height: 14, color: _A.TERRA, flexShrink: 0 }} />
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA }}>{saveError}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button onClick={closeForm} disabled={saving} style={btnSecondary}>Zrušiť</button>
            <button onClick={saveCode} disabled={saving} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving && <RefreshCw style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Synchronizujem so Stripe…' : 'Uložiť'}
            </button>
          </div>
        </Card>
      )}

      {/* Table — live from Stripe */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>
            Naživo zo Stripe · {codes.length} kód{codes.length === 1 ? '' : codes.length < 5 ? 'y' : 'ov'}
          </div>
          <button onClick={load} disabled={loading} style={{ ...btnSecondary, padding: '5px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw style={{ width: 11, height: 11, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Obnoviť
          </button>
        </div>
        {loadErr ? (
          <div style={{ padding: '24px 14px', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA }}>{loadErr}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: _A.CREAM2 }}>
                {['Kód', 'Coupon', 'Zľava', 'Použitia', 'Platnosť', 'Stav'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {codes.map(c => {
                const pct = c.maxRedemptions != null ? Math.min(100, (c.timesRedeemed / c.maxRedemptions) * 100) : 0;
                const usageLabel = c.maxRedemptions != null ? `${c.timesRedeemed}/${c.maxRedemptions}` : `${c.timesRedeemed} (bez limitu)`;
                const expiryLabel = c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('sk-SK') : 'bez limitu';
                return (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${_A.HAIR}` }}>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: _A.DEEP }}>{c.code}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 10.5, color: _A.MUTED }}>{c.coupon.id}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 600, color: _A.GOLD }}>
                      {formatPromoDiscount(c.coupon)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP }}>{usageLabel}</div>
                      {c.maxRedemptions != null && (
                        <div style={{ marginTop: 4, height: 4, borderRadius: 999, background: _A.CREAM2, overflow: 'hidden', width: 80 }}>
                          <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: pct > 80 ? _A.TERRA : _A.SAGE }} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>{expiryLabel}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 999,
                        background: c.active ? 'rgba(139,158,136,0.15)' : 'rgba(61,41,33,0.07)',
                        color: c.active ? _A.SAGE : _A.MUTED,
                      }}>
                        {c.active ? 'Aktívny' : 'Neaktívny'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!loading && codes.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '32px 14px', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadne promo kódy v Stripe.</td></tr>
              )}
              {loading && codes.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '32px 14px', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam zo Stripe…</td></tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════
// COMMUNITY MODERATION TAB (wired to Supabase)
// ═══════════════════════════════════════════
interface AdminPost {
  id: string;
  user_id: string;
  author_name: string;
  type: 'post' | 'question';
  content: string;
  likes_count: number;
  comments_count: number;
  status: 'visible' | 'removed';
  created_at: string;
}

function CommunityModerationTab() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'removed'>('all');
  const [busy, setBusy] = useState<string | null>(null);

  // Admin sees ALL posts including removed ones — so they can restore.
  // Direct query bypasses useCommunityPosts (which hides removed from
  // the public feed).
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, user_id, author_name, type, content, likes_count, comments_count, status, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) {
      setPosts(data.map(r => ({
        ...r,
        status: (r.status as 'visible' | 'removed') ?? 'visible',
      })));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: 'visible' | 'removed') => {
    if (busy) return;
    setBusy(id);
    const { error } = await supabase
      .from('community_posts')
      .update({ status })
      .eq('id', id);
    if (error) {
      alert('Chyba pri aktualizácii statusu: ' + error.message);
    } else {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    }
    setBusy(null);
  };

  const visible = posts.filter(p => filter === 'all' ? true : p.status === 'removed');
  const removedCount = posts.filter(p => p.status === 'removed').length;
  const visibleCount = posts.length - removedCount;

  const statNum = (val: number, color: string) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 28, fontWeight: 500, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{val}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Community Moderácia</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'removed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, background: filter === f ? _A.DEEP : _A.CREAM2, color: filter === f ? '#fff' : _A.DEEP }}>
              {f === 'all' ? 'Všetky' : 'Odstránené'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <Card>{statNum(posts.length, _A.DEEP)}<div style={{ textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 6 }}>Celkovo</div></Card>
        <Card>{statNum(visibleCount, _A.SAGE)}<div style={{ textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 6 }}>Viditeľné</div></Card>
        <Card>{statNum(removedCount, _A.TERRA)}<div style={{ textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 6 }}>Odstránené</div></Card>
      </div>

      <div style={{ background: _A.CARD, borderRadius: 16, border: `1px solid ${_A.HAIR}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam príspevky…</div>
        ) : (
          <div>
            {visible.map((post, i) => {
              const isRemoved = post.status === 'removed';
              const isBusy = busy === post.id;
              return (
                <div key={post.id} style={{ padding: '14px 20px', borderBottom: i < visible.length - 1 ? `1px solid ${_A.HAIR}` : 'none', opacity: isRemoved ? 0.55 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 999, background: _A.CREAM2, color: _A.DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Gilda Display, Georgia, serif', fontSize: 14, fontWeight: 500, flexShrink: 0 }}>
                        {(post.author_name || '?').slice(0, 1).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{post.author_name || '—'}</span>
                          <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERTIARY }}>{new Date(post.created_at).toLocaleString('sk-SK', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: `rgba(168,132,139,0.15)`, color: _A.MAUVE }}>{post.type === 'question' ? 'Otázka' : 'Príspevok'}</span>
                          {isRemoved && (
                            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(193,133,106,0.15)', color: _A.TERRA }}>Odstránené</span>
                          )}
                        </div>
                        <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{post.content}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERTIARY }}>
                          <span>{post.likes_count} likes</span>
                          <span>{post.comments_count} komentárov</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {isRemoved ? (
                        <button onClick={() => setStatus(post.id, 'visible')} disabled={isBusy} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, background: 'rgba(139,158,136,0.15)', color: _A.SAGE, opacity: isBusy ? 0.5 : 1 }}>
                          <Check style={{ width: 12, height: 12 }} />Obnoviť
                        </button>
                      ) : (
                        <button onClick={() => setStatus(post.id, 'removed')} disabled={isBusy} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, background: 'rgba(193,133,106,0.15)', color: _A.TERRA, opacity: isBusy ? 0.5 : 1 }}>
                          <Trash2 style={{ width: 12, height: 12 }} />Odstrániť
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {visible.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadne príspevky.</div>
            )}
          </div>
        )}
      </div>
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
  nutrition_plan_purchased: boolean;
  subscriptions: { tier: string; active: boolean; stripe_customer_id?: string | null; stripe_subscription_id: string | null; current_period_end: string | null; cancel_at_period_end: boolean } | null;
}

interface UserDetail {
  purchases: { program_id: string; purchased_at: string; stripe_payment_id: string | null }[];
  /** Net current balance — sum of positive AND negative ledger entries.
   *  Matches what the redeem-reward edge function checks against. */
  balance: number;
  /** Lifetime earned — sum of positive ledger entries only. Useful for
   *  understanding total engagement separately from spending. */
  totalEarned: number;
  lastActivity: string | null;
  activityBreakdown: { event_type: string; count: number; points: number }[];
}

// Live Stripe state fetched on-demand from admin-user-stripe netlify fn.
interface StripeDetail {
  subscription: null | {
    id: string;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    amount: number;
    currency: string;
    discount: null | { coupon: string; percentOff: number | null; amountOff: number | null };
  };
  invoices: { id: string; number: string | null; created: string; total: number; currency: string; paid: boolean; status: string | null; hostedUrl: string | null }[];
  paymentMethod: null | { brand: string; last4: string; exp: string };
}

function fmtCents(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
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
  const [settingTier, setSettingTier] = useState<string | null>(null);
  const [tierMenuOpen, setTierMenuOpen] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetail>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [stripeDetails, setStripeDetails] = useState<Record<string, StripeDetail | { error: string }>>({});
  const [loadingStripe, setLoadingStripe] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Query Supabase directly — works in both local dev and production.
      // Requires the "Admin read all profiles" RLS policy to be applied
      // (migration 20260505_gdpr_consent.sql).
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, nutrition_plan_purchased')
        .order('created_at', { ascending: false });

      if (profilesError) throw new Error(profilesError.message);

      const { data: subs } = await supabase
        .from('subscriptions')
        .select('user_id, tier, active, stripe_customer_id, stripe_subscription_id, current_period_end, cancel_at_period_end');

      const subMap: Record<string, AdminUser['subscriptions']> = {};
      for (const s of subs ?? []) {
        subMap[s.user_id] = {
          tier: s.tier,
          active: s.active,
          stripe_customer_id: s.stripe_customer_id,
          stripe_subscription_id: s.stripe_subscription_id,
          current_period_end: s.current_period_end,
          cancel_at_period_end: s.cancel_at_period_end,
        };
      }

      setUsers((profiles ?? []).map(p => ({
        ...p,
        nutrition_plan_purchased: !!(p as any).nutrition_plan_purchased,
        subscriptions: subMap[p.id] ?? null,
      })));
    } catch (err: any) {
      // Likely cause: admin RLS policy not applied yet.
      // Run migration 20260505_gdpr_consent.sql in Supabase dashboard.
      setError(err.message || 'Failed to load users — check Supabase RLS admin policy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUserDetail = async (userId: string) => {
    if (userDetails[userId] || loadingDetail === userId) return;
    setLoadingDetail(userId);
    try {
      const [pointsRes, lastRes] = await Promise.all([
        supabase.from('points_ledger').select('event_type, points').eq('user_id', userId),
        supabase.from('points_ledger').select('created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1),
      ]);

      const ledger = pointsRes.data ?? [];
      const balance = ledger.reduce((sum, r) => sum + (r.points ?? 0), 0);
      const totalEarned = ledger.reduce((sum, r) => sum + (r.points > 0 ? r.points : 0), 0);
      const lastActivity = lastRes.data?.[0]?.created_at ?? null;

      const breakdown: Record<string, { count: number; points: number }> = {};
      for (const r of ledger) {
        if (!breakdown[r.event_type]) breakdown[r.event_type] = { count: 0, points: 0 };
        breakdown[r.event_type].count++;
        breakdown[r.event_type].points += r.points;
      }

      setUserDetails(prev => ({
        ...prev,
        [userId]: {
          purchases: [],
          balance,
          totalEarned,
          lastActivity,
          activityBreakdown: Object.entries(breakdown)
            .map(([event_type, v]) => ({ event_type, ...v }))
            .sort((a, b) => b.points - a.points),
        },
      }));
    } finally {
      setLoadingDetail(null);
    }
  };

  const fetchStripeDetail = async (user: AdminUser) => {
    const customerId = user.subscriptions?.stripe_customer_id;
    if (!customerId) return; // nothing to fetch
    if (stripeDetails[user.id] || loadingStripe === user.id) return;
    setLoadingStripe(user.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-user-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ customerId }),
      });
      const body = await res.json();
      if (!res.ok) {
        setStripeDetails(prev => ({ ...prev, [user.id]: { error: body.error || 'Failed to load' } }));
      } else {
        setStripeDetails(prev => ({ ...prev, [user.id]: body as StripeDetail }));
      }
    } catch (err: any) {
      setStripeDetails(prev => ({ ...prev, [user.id]: { error: err.message || 'Network error' } }));
    } finally {
      setLoadingStripe(null);
    }
  };

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
      fetchUserDetail(userId);
      const u = users.find(x => x.id === userId);
      if (u) fetchStripeDetail(u);
    }
  };

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

  const handleSetTier = async (userId: string, tier: string) => {
    setSettingTier(userId);
    setTierMenuOpen(null);
    const periodEnd = tier !== 'free' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null;
    try {
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          tier,
          active: tier !== 'free',
          stripe_subscription_id: null,
          current_period_end: periodEnd,
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      if (error) throw new Error(error.message);
      setUsers(prev => prev.map(u => u.id === userId ? {
        ...u,
        subscriptions: {
          tier,
          active: tier !== 'free',
          stripe_customer_id: u.subscriptions?.stripe_customer_id ?? null,
          stripe_subscription_id: null,
          current_period_end: periodEnd,
          cancel_at_period_end: false,
        },
      } : u));
    } catch (err: any) {
      alert('Chyba pri zmene tarifu: ' + err.message);
    } finally {
      setSettingTier(null);
    }
  };

  const [togglingMeal, setTogglingMeal] = useState<string | null>(null);
  const handleToggleMealPlan = async (user: AdminUser) => {
    const next = !user.nutrition_plan_purchased;
    const confirmMsg = next
      ? `Pridelíme ${user.email} prístup k jedálničku (bez platby v Stripe).`
      : `Odoberieme ${user.email} prístup k jedálničku. Toto NEVRACIA peniaze — refund spravíš v Stripe.`;
    if (!window.confirm(confirmMsg)) return;
    setTogglingMeal(user.id);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nutrition_plan_purchased: next })
        .eq('id', user.id);
      if (error) throw new Error(error.message);
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, nutrition_plan_purchased: next } : u)));
    } catch (err: any) {
      alert('Chyba pri zmene jedálnička: ' + err.message);
    } finally {
      setTogglingMeal(null);
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

  const tierBadgeStyle = (t: string): React.CSSProperties => {
    const map: Record<string, { bg: string; col: string }> = {
      neome_plus: { bg: 'rgba(139,158,136,0.15)', col: _A.SAGE },
      program_bundle: { bg: 'rgba(184,134,74,0.15)', col: _A.GOLD },
      free: { bg: `rgba(61,41,33,0.07)`, col: _A.MUTED },
    };
    const s = map[t] ?? map.free;
    return { fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: s.bg, color: s.col, fontFamily: 'DM Sans, system-ui' };
  };

  if (loading) return <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam používateľov…</div>;
  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA, display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />
        {error}
        {error.includes('SUPABASE_SERVICE_ROLE_KEY') || error.includes('service') ? (
          <span style={{ fontWeight: 600 }}>— Add SUPABASE_SERVICE_ROLE_KEY to Netlify environment variables.</span>
        ) : null}
      </div>
      <button onClick={fetchUsers} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
        <RefreshCw style={{ width: 14, height: 14 }} /> Skúsiť znova
      </button>
    </div>
  );

  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.subscriptions?.tier !== 'free' && u.subscriptions?.active).length;
  const freeUsers = users.filter(u => !u.subscriptions || u.subscriptions.tier === 'free').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onClick={() => setTierMenuOpen(null)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>User Management</div>
        <button onClick={fetchUsers} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw style={{ width: 13, height: 13 }} /> Obnoviť
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <Card><div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 28, fontWeight: 500, color: _A.DEEP, letterSpacing: '-0.02em', lineHeight: 1 }}>{totalUsers}</div><div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 6 }}>Celkovo používateľov</div></div></Card>
        <Card><div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 28, fontWeight: 500, color: _A.SAGE, letterSpacing: '-0.02em', lineHeight: 1 }}>{premiumUsers}</div><div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 6 }}>Premium</div></div></Card>
        <Card><div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 28, fontWeight: 500, color: _A.MUTED, letterSpacing: '-0.02em', lineHeight: 1 }}>{freeUsers}</div><div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 6 }}>Free</div></div></Card>
      </div>

      {/* Filters + list */}
      <Card>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hľadaj podľa emailu alebo mena..." style={{ ...inputStyle, flex: 1 }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
            <option value="all">Všetky</option>
            <option value="neome_plus">Premium</option>
            <option value="program_bundle">Bundle</option>
            <option value="free">Free</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.length === 0 && <p style={{ textAlign: 'center', padding: '24px 0', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadni používatelia.</p>}
          {filtered.map(user => {
            const sub = user.subscriptions;
            const tier = sub?.tier ?? 'free';
            const isSettingThis = settingTier === user.id;
            const menuOpen = tierMenuOpen === user.id;
            const isExpanded = expandedUser === user.id;
            const detail = userDetails[user.id];
            const isLoadingDetail = loadingDetail === user.id;

            const EVENT_LABELS: Record<string, string> = {
              workout_completed: 'Tréningy', program_completed: 'Programy',
              post_published: 'Príspevky', comment_published: 'Komentáre',
              journal_entry: 'Denník', referral_approved: 'Odporúčania',
              heart_received: 'Srdcia', reward_redeemed: 'Odmeny',
            };

            return (
              <div key={user.id} style={{ borderRadius: 12, border: `1px solid ${isExpanded ? _A.HAIR2 : _A.HAIR}`, background: isExpanded ? _A.CARD : _A.BG, overflow: 'hidden' }}>
                {/* Row header — click to expand */}
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', cursor: 'pointer' }}
                  onClick={() => toggleExpand(user.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 999, background: _A.CREAM2, color: _A.DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Gilda Display, Georgia, serif', fontSize: 15, fontWeight: 500, flexShrink: 0 }}>
                      {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{user.full_name || '—'}</div>
                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{user.email}</div>
                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: _A.TERTIARY, marginTop: 2 }}>
                        Registrovaná: {new Date(user.created_at).toLocaleDateString('sk-SK')}
                        {sub?.current_period_end && ` · Predplatné do: ${new Date(sub.current_period_end).toLocaleDateString('sk-SK')}`}
                        {sub?.cancel_at_period_end && ' · Ruší sa'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                    <span style={tierBadgeStyle(tier)}>{tierLabel(tier)}</span>

                    {/* Meal-plan add-on chip — click to toggle */}
                    <button
                      onClick={() => handleToggleMealPlan(user)}
                      disabled={togglingMeal === user.id}
                      title={user.nutrition_plan_purchased ? 'Odobrať jedálniček' : 'Pridať jedálniček'}
                      style={{
                        all: 'unset',
                        cursor: togglingMeal === user.id ? 'not-allowed' : 'pointer',
                        padding: '4px 8px',
                        borderRadius: 999,
                        fontFamily: 'DM Sans, system-ui',
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                        background: user.nutrition_plan_purchased ? _A.GOLD : 'transparent',
                        color: user.nutrition_plan_purchased ? '#fff' : _A.MUTED,
                        border: user.nutrition_plan_purchased ? `1px solid ${_A.GOLD}` : `1px solid ${_A.HAIR2}`,
                        opacity: togglingMeal === user.id ? 0.6 : 1,
                      }}
                    >
                      {togglingMeal === user.id ? '…' : (user.nutrition_plan_purchased ? 'Jedálniček ✓' : '+ Jedálniček')}
                    </button>


                    {/* Access picker */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setTierMenuOpen(menuOpen ? null : user.id)}
                        disabled={isSettingThis}
                        style={{ ...btnSecondary, padding: '6px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, opacity: isSettingThis ? 0.5 : 1 }}
                      >
                        {isSettingThis ? <RefreshCw style={{ width: 11, height: 11 }} /> : <Edit3 style={{ width: 11, height: 11 }} />}
                        Prístup
                      </button>
                      {menuOpen && (
                        <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, background: _A.CARD, border: `1px solid ${_A.HAIR}`, borderRadius: 10, zIndex: 100, minWidth: 160, boxShadow: '0 4px 20px rgba(61,41,33,0.10)', overflow: 'hidden' }}>
                          {[
                            { value: 'free',           label: 'Free',    color: _A.MUTED },
                            { value: 'neome_plus',      label: 'Premium', color: _A.SAGE },
                            { value: 'program_bundle',  label: 'Bundle',  color: _A.GOLD },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => handleSetTier(user.id, opt.value)}
                              style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP, background: tier === opt.value ? _A.CREAM2 : 'transparent', boxSizing: 'border-box' }}
                              onMouseEnter={e => { if (tier !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = _A.CREAM2; }}
                              onMouseLeave={e => { if (tier !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                            >
                              <span style={{ width: 8, height: 8, borderRadius: 999, background: opt.color, display: 'inline-block', flexShrink: 0 }} />
                              {opt.label}
                              {tier === opt.value && <Check style={{ width: 12, height: 12, color: _A.SAGE, marginLeft: 'auto' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {sub?.stripe_subscription_id && !sub?.cancel_at_period_end && (
                      <button
                        onClick={() => handleCancelSubscription(user)}
                        disabled={cancelling === user.id}
                        style={{ ...btnDanger, padding: '7px 12px', fontSize: 11, opacity: cancelling === user.id ? 0.6 : 1 }}
                      >
                        {cancelling === user.id ? '...' : 'Zrušiť'}
                      </button>
                    )}
                    {confirmDelete === user.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERRA }}>Naozaj?</span>
                        <button onClick={() => handleDeleteUser(user.id)} disabled={deleting === user.id} style={{ ...btnDanger, padding: '6px 10px', fontSize: 11 }}>
                          {deleting === user.id ? '...' : 'Áno'}
                        </button>
                        <button onClick={() => setConfirmDelete(null)} style={{ ...btnSecondary, padding: '6px 10px', fontSize: 11 }}>Nie</button>
                      </div>
                    ) : (
                      <button onClick={e => { e.stopPropagation(); setConfirmDelete(user.id); }} style={{ all: 'unset', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                        <Trash2 style={{ width: 14, height: 14, color: _A.TERRA }} />
                      </button>
                    )}
                    <ChevronRight style={{ width: 14, height: 14, color: _A.TERTIARY, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${_A.HAIR}`, padding: '16px 14px', background: _A.BG, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {isLoadingDetail ? (
                      <div style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Načítavam…</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>

                        {/* Subscription block */}
                        <div style={{ background: _A.CARD, borderRadius: 10, border: `1px solid ${_A.HAIR}`, padding: '12px 14px' }}>
                          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 10 }}>Predplatné</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                              { label: 'Tarif', value: tierLabel(tier) },
                              { label: 'Stav', value: sub?.active ? 'Aktívne' : 'Neaktívne' },
                              { label: 'Platí do', value: sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString('sk-SK') : '—' },
                              { label: 'Stripe Sub', value: sub?.stripe_subscription_id ? sub.stripe_subscription_id.slice(0, 18) + '…' : '—' },
                              { label: 'Ruší sa', value: sub?.cancel_at_period_end ? 'Áno' : 'Nie' },
                            ].map(({ label, value }) => (
                              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>{label}</span>
                                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500, textAlign: 'right' }}>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Live Stripe block — discount + invoices + payment method */}
                        <div style={{ background: _A.CARD, borderRadius: 10, border: `1px solid ${_A.HAIR}`, padding: '12px 14px' }}>
                          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 10 }}>Stripe (live)</div>
                          {!user.subscriptions?.stripe_customer_id ? (
                            <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERTIARY, lineHeight: 1.5 }}>Bez Stripe customera.</p>
                          ) : loadingStripe === user.id ? (
                            <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Načítavam zo Stripe…</p>
                          ) : !stripeDetails[user.id] ? (
                            <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>—</p>
                          ) : 'error' in stripeDetails[user.id] ? (
                            <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.TERRA, lineHeight: 1.5 }}>
                              {(stripeDetails[user.id] as { error: string }).error}
                            </p>
                          ) : (() => {
                            const sd = stripeDetails[user.id] as StripeDetail;
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {/* Discount — the headline thing */}
                                {sd.subscription?.discount ? (
                                  <div style={{ padding: '8px 10px', background: `${_A.GOLD}14`, border: `1px solid ${_A.GOLD}30`, borderRadius: 8 }}>
                                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.GOLD, fontWeight: 600 }}>Zľava aktívna</div>
                                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.DEEP, marginTop: 4, fontWeight: 500 }}>
                                      {sd.subscription.discount.coupon}
                                      {sd.subscription.discount.percentOff != null && ` — ${sd.subscription.discount.percentOff}% off`}
                                      {sd.subscription.discount.amountOff != null && ` — ${fmtCents(sd.subscription.discount.amountOff, sd.subscription.currency)} off`}
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.TERTIARY }}>Bez aktívnej zľavy</div>
                                )}
                                {/* Default PM */}
                                {sd.paymentMethod && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                    <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Karta</span>
                                    <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500 }}>
                                      {sd.paymentMethod.brand} ···· {sd.paymentMethod.last4} ({sd.paymentMethod.exp})
                                    </span>
                                  </div>
                                )}
                                {/* Last invoices */}
                                {sd.invoices.length > 0 && (
                                  <div>
                                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 6 }}>Posledné faktúry</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                      {sd.invoices.slice(0, 5).map(inv => (
                                        <a key={inv.id} href={inv.hostedUrl ?? '#'} target="_blank" rel="noopener noreferrer"
                                          style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '4px 0', textDecoration: 'none' }}>
                                          <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.MUTED }}>
                                            {new Date(inv.created).toLocaleDateString('sk-SK')}
                                          </span>
                                          <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: inv.paid ? _A.SAGE : _A.TERRA, fontWeight: 500 }}>
                                            {fmtCents(inv.total, inv.currency)} {inv.paid ? '✓' : `(${inv.status})`}
                                          </span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Activity block */}
                        <div style={{ background: _A.CARD, borderRadius: 10, border: `1px solid ${_A.HAIR}`, padding: '12px 14px' }}>
                          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 10 }}>Aktivita</div>
                          {!detail || detail.totalEarned === 0 ? (
                            <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERTIARY }}>Žiadna zaznamenaná aktivita</p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                              {/* Aktuálny zostatok — what the user actually has
                                  available to spend right now. Matches the
                                  edge function's affordability check. */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: `1px solid ${_A.HAIR}`, marginBottom: 2 }}>
                                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Aktuálny zostatok</span>
                                <span style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 16, color: _A.GOLD, fontWeight: 500 }}>{detail.balance}</span>
                              </div>
                              {/* Lifetime earned — shown smaller for context. */}
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Celkovo zarobené</span>
                                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500 }}>{detail.totalEarned}</span>
                              </div>
                              {detail.lastActivity && (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Posledná aktivita</span>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500 }}>{new Date(detail.lastActivity).toLocaleDateString('sk-SK')}</span>
                                </div>
                              )}
                              {detail.activityBreakdown.slice(0, 5).map(ev => (
                                <div key={ev.event_type} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>{EVENT_LABELS[ev.event_type] ?? ev.event_type}</span>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500 }}>{ev.count}×</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                )}
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
  status: 'draft' | 'published' | 'archived';
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>({ category: 'general', author: 'Gabi', status: 'draft' });

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

  const openAdd = () => { setForm({ category: 'general', author: 'Gabi', status: 'draft' }); setEditPost(null); setShowForm(true); };
  const openEdit = (p: BlogPost) => { setForm({ ...p }); setEditPost(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditPost(null); setForm({ category: 'general', author: 'Gabi', status: 'draft' }); };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setImageError(null);
    try {
      const result = await uploadContentImage(file, 'blog');
      setForm(f => ({ ...f, cover_image: result.url }));
    } catch (err: any) {
      setImageError(err.message ?? 'Nahrávanie zlyhalo.');
    } finally {
      setUploadingImage(false);
    }
  };


  const savePost = async () => {
    if (!form.title) return;
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.title),
      published_at: form.status === 'published' ? (form.published_at || new Date().toISOString()) : null,
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

  const cycleStatus = async (post: BlogPost) => {
    const next = post.status === 'draft' ? 'published' : post.status === 'published' ? 'archived' : 'draft';
    const { error } = await supabase.from('blog_posts').update({
      status: next,
      published_at: next === 'published' ? (post.published_at || new Date().toISOString()) : post.published_at,
    }).eq('id', post.id);
    if (!error) setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: next } : p));
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

  const statusBadgeBlog = (status: BlogPost['status']) => {
    const map: Record<string, { bg: string; col: string; label: string }> = {
      published: { bg: 'rgba(139,158,136,0.15)', col: _A.SAGE, label: 'Publikovaný' },
      archived:  { bg: 'rgba(184,134,74,0.15)',  col: _A.GOLD, label: 'Archivovaný' },
      draft:     { bg: `rgba(61,41,33,0.07)`,    col: _A.MUTED, label: 'Draft' },
    };
    const s = map[status] ?? map.draft;
    return <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: s.bg, color: s.col }}>{s.label}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Blog</div>
        <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 14, height: 14 }} /> Nový príspevok
        </button>
      </div>

      {showForm && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>{editPost ? 'Upraviť príspevok' : 'Nový príspevok'}</div>
            <button onClick={closeForm} style={{ all: 'unset', cursor: 'pointer' }}><X style={{ width: 16, height: 16, color: _A.MUTED }} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Nadpis *</label>
              <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div>
              <label style={labelStyle}>Kategória</label>
              <select value={form.category || 'general'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Autor</label>
              <input value={form.author || 'Gabi'} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cover obrázok (JPEG, PNG, WebP)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploadingImage} style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }} />
                {uploadingImage && <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Konvertujem a nahrávam…</p>}
                {imageError && <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERRA }}>{imageError}</p>}
                {form.cover_image && !uploadingImage && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={form.cover_image} alt="" style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                    <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.SAGE, flex: 1 }}>Nahraté</span>
                    <button type="button" onClick={() => setForm(f => ({ ...f, cover_image: undefined }))} style={{ all: 'unset', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERRA }}>Odstrániť</button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Perex (krátky úvod)</label>
              <textarea value={form.excerpt || ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Obsah</label>
              <BlogEditor
                content={form.content || ''}
                onChange={html => setForm(f => ({ ...f, content: html }))}
              />
            </div>
            <div>
              <label style={labelStyle}>Stav</label>
              <select value={form.status || 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as BlogPost['status'] }))} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="published">Publikovaný</option>
                <option value="archived">Archivovaný</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button onClick={closeForm} disabled={saving} style={btnSecondary}>Zrušiť</button>
            <button onClick={savePost} disabled={saving} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving && <RefreshCw style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Ukladám...' : 'Uložiť'}
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam príspevky…</div>
      ) : (
        <div style={{ background: _A.CARD, borderRadius: 16, border: `1px solid ${_A.HAIR}`, overflow: 'hidden' }}>
          {posts.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <BookOpen style={{ width: 36, height: 36, color: _A.MUTED, margin: '0 auto 12px' }} />
              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Zatiaľ žiadne príspevky. Vytvor prvý!</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: _A.CREAM2 }}>
                  {['Nadpis', 'Kategória', 'Autor', 'Vytvorený', 'Stav', 'Akcie'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} style={{ borderBottom: `1px solid ${_A.HAIR}` }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{post.title}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 10, color: _A.TERTIARY, marginTop: 2 }}>{post.slug}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: `rgba(168,132,139,0.15)`, color: _A.MAUVE }}>
                        {CATEGORIES.find(c => c.value === post.category)?.label ?? post.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>{post.author}</td>
                    <td style={{ padding: '12px 14px', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>{new Date(post.created_at).toLocaleDateString('sk-SK')}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => cycleStatus(post)} title="Klikni pre zmenu stavu" style={{ all: 'unset', cursor: 'pointer' }}>
                        {statusBadgeBlog(post.status)}
                      </button>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button onClick={() => openEdit(post)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Edit3 style={{ width: 14, height: 14, color: _A.MUTED }} /></button>
                        <button onClick={() => deletePost(post.id)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Trash2 style={{ width: 14, height: 14, color: _A.TERRA }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
  const [userNames, setUserNames] = React.useState<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch display names for conversation user IDs
  React.useEffect(() => {
    if (conversations.length === 0) return;
    const ids = conversations.map(c => c.user_id).filter(id => id !== 'demo' && !userNames[id]);
    if (ids.length === 0) return;
    supabase.from('profiles').select('id, full_name, email').in('id', ids).then(({ data }) => {
      if (data) {
        setUserNames(prev => {
          const next = { ...prev };
          for (const p of data) next[p.id] = p.full_name || p.email || p.id.slice(0, 8);
          return next;
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const displayName = (userId: string) => {
    if (userId === 'demo') return 'Demo User';
    return userNames[userId] || userId.slice(0, 8) + '…';
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 86_400_000);
    if (diff === 0) return d.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
    if (diff === 1) return 'Včera';
    return d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Messages</div>
          {totalUnread > 0 && (
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(193,133,106,0.15)', color: _A.TERRA }}>{totalUnread} new</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, height: 600 }}>
        {/* Conversation list */}
        <div style={{ background: _A.CARD, borderRadius: 16, border: `1px solid ${_A.HAIR}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${_A.HAIR}`, fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>Conversations</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <p style={{ padding: 16, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Loading…</p>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <MessageSquare style={{ width: 28, height: 28, color: _A.MUTED, margin: '0 auto 8px' }} />
                <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>No messages yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.user_id}
                  onClick={() => setSelectedUserId(conv.user_id)}
                  style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', padding: '12px 16px', borderBottom: `1px solid ${_A.HAIR}`, background: selectedUserId === conv.user_id ? `rgba(184,134,74,0.10)` : 'transparent', boxSizing: 'border-box' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 999, background: _A.CREAM2, color: _A.DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Gilda Display, Georgia, serif', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{displayName(conv.user_id).charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, color: _A.DEEP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {displayName(conv.user_id)}
                        </span>
                        <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: _A.TERTIARY, flexShrink: 0 }}>{formatTime(conv.last_time)}</span>
                      </div>
                      <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{conv.last_message}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span style={{ width: 18, height: 18, borderRadius: 999, background: _A.TERRA, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{conv.unread}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Thread + composer */}
        <div style={{ background: _A.CARD, borderRadius: 16, border: `1px solid ${_A.HAIR}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {!selectedUserId ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <MessageSquare style={{ width: 36, height: 36, color: _A.MUTED, margin: '0 auto 12px' }} />
                <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Select a conversation to reply</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div style={{ padding: '12px 18px', borderBottom: `1px solid ${_A.HAIR}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => setSelectedUserId(null)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}>
                  <ArrowLeft style={{ width: 15, height: 15, color: _A.MUTED }} />
                </button>
                <div style={{ width: 28, height: 28, borderRadius: 999, background: _A.CREAM2, color: _A.DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Gilda Display, Georgia, serif', fontSize: 13, fontWeight: 500 }}>{displayName(selectedUserId!).charAt(0).toUpperCase()}</div>
                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>
                  {displayName(selectedUserId)}
                </span>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {thread.map((msg) => {
                  const isGabi = msg.is_from_admin;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isGabi ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '70%' }}>
                        <div style={{
                          padding: '10px 14px',
                          fontFamily: 'DM Sans, system-ui',
                          fontSize: 13,
                          lineHeight: 1.5,
                          borderRadius: isGabi ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isGabi ? _A.DEEP : _A.CREAM2,
                          color: isGabi ? '#fff' : _A.DEEP,
                        }}>
                          {msg.body}
                        </div>
                        <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, marginTop: 4, paddingLeft: isGabi ? 0 : 4, paddingRight: isGabi ? 4 : 0, textAlign: isGabi ? 'right' : 'left', color: _A.TERTIARY }}>
                          {isGabi ? 'Gabi · ' : 'User · '}{formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Reply composer */}
              <div style={{ padding: '12px 18px', borderTop: `1px solid ${_A.HAIR}`, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
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
                  style={{ flex: 1, ...inputStyle, resize: 'none' }}
                />
                <button
                  onClick={() => {
                    if (reply.trim() && !sending) {
                      sendReply(selectedUserId, reply.trim());
                      setReply('');
                    }
                  }}
                  disabled={!reply.trim() || sending}
                  style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8, opacity: !reply.trim() ? 0.4 : 1 }}
                >
                  <Send style={{ width: 13, height: 13 }} />
                  Send
                </button>
              </div>
            </>
          )}
        </div>
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
// SHARED ADMIN CRUD HELPERS — direct Supabase
// ═══════════════════════════════════════════
const TABLES: Record<string, string> = {
  recipes: 'recipes', exercises: 'exercises',
  meditations: 'meditations', programmes: 'programmes',
};
const ORDER_BY: Record<string, { column: string; ascending: boolean }> = {
  recipes: { column: 'created_at', ascending: false },
  exercises: { column: 'content_type', ascending: true },
  meditations: { column: 'created_at', ascending: false },
  programmes: { column: 'level', ascending: true },
};

async function adminFetch(type: string) {
  const { column, ascending } = ORDER_BY[type];
  const { data, error } = await supabase.from(TABLES[type]).select('*').order(column, { ascending });
  if (error) throw new Error(error.message);
  return data ?? [];
}
async function adminUpsert(type: string, item: Record<string, unknown>) {
  const { data, error } = await supabase.from(TABLES[type]).upsert([item], { onConflict: 'id' }).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
async function adminDelete(type: string, id: string) {
  const { error } = await supabase.from(TABLES[type]).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
async function adminSeed(type: string, items: Record<string, unknown>[]) {
  const chunkSize = 50;
  let inserted = 0;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const { error } = await supabase.from(TABLES[type]).upsert(chunk, { onConflict: 'id' });
    if (error) throw new Error(error.message);
    inserted += chunk.length;
  }
  return inserted;
}

const AdminCard = ({ children, className = '', title }: { children: React.ReactNode; className?: string; title?: string }) => (
  <div className={className} style={{ background: '#FFFFFF', borderRadius: 16, border: `1px solid rgba(61,41,33,0.08)`, padding: '22px 24px' }}>{children}</div>
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
      const payload = staticRecipesData.map((r: any) => ({
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Recipe Database</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={seedFromStatic} disabled={seeding} style={btnSecondary}>
            {seeding ? 'Importujem...' : 'Import statických receptov'}
          </button>
          <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 14, height: 14 }} />Nový recept
          </button>
        </div>
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />{error}</div>}

      {showForm && (
        <AdminCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>{editId ? 'Upraviť recept' : 'Nový recept'}</div>
            <button onClick={closeForm} style={{ all: 'unset', cursor: 'pointer' }}><X style={{ width: 16, height: 16, color: _A.MUTED }} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Názov *</label>
              <input value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kategória</label>
              <select value={form.category ?? 'ranajky'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Obtiažnosť</label>
              <select value={form.difficulty ?? 'easy'} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} style={inputStyle}>
                <option value="easy">Jednoduchý</option>
                <option value="medium">Stredný</option>
              </select>
            </div>
            {[['prep_time','Čas prípravy (min)'],['servings','Porcie'],['calories','Kalórie'],['protein','Bielkoviny (g)'],['carbs','Sacharidy (g)'],['fat','Tuky (g)']].map(([field, label]) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input type="number" value={(form as any)[field] ?? ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>URL obrázka</label>
              <input value={form.image ?? ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Popis</label>
              <textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Ingrediencie (jeden na riadok, formát "Názov: Množstvo")</label>
              <textarea value={ingText} onChange={e => setIngText(e.target.value)} rows={5} placeholder={'Avokádo: 1 ks\nVajíčko: 2 ks'} style={{ ...inputStyle, resize: 'none', fontFamily: 'monospace' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Postup (jeden krok na riadok)</label>
              <textarea value={stepsText} onChange={e => setStepsText(e.target.value)} rows={4} placeholder="Nakrájaj avokádo..." style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div>
              <label style={labelStyle}>Alergény (čiarkou oddelené)</label>
              <input value={allerText} onChange={e => setAllerText(e.target.value)} placeholder="dairy, gluten" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tagy (čiarkou oddelené)</label>
              <input value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="postpartum, proteín" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setForm(f => ({ ...f, active: !f.active }))} style={{ all: 'unset', cursor: 'pointer' }}>
                {form.active ? <CheckSquare style={{ width: 18, height: 18, color: _A.SAGE }} /> : <Square style={{ width: 18, height: 18, color: _A.MUTED }} />}
              </button>
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP }}>Aktívny</span>
            </div>
          </div>
          {error && <div style={{ marginTop: 12, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle style={{ width: 13, height: 13 }} />{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button onClick={closeForm} style={btnSecondary}>Zrušiť</button>
            <button onClick={save} disabled={saving} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving && <RefreshCw style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />}Uložiť
            </button>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam...</div> : (
          <>
            <div style={{ marginBottom: 16, fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>{items.length} receptov</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.length === 0 && <p style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadne recepty. Pridaj prvý alebo importuj statické.</p>}
              {items.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, border: `1px solid ${_A.HAIR}`, background: _A.BG }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {r.image && <img src={r.image} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />}
                    <div>
                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{r.title}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: 'rgba(139,158,136,0.15)', color: _A.SAGE }}>{r.category}</span>
                        <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{r.calories} kcal</span>
                        <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{r.prep_time} min</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => toggleActive(r)} title={r.active ? 'Deaktivácia' : 'Aktivácia'} style={{ all: 'unset', cursor: 'pointer', padding: 4 }}>
                      {r.active ? <CheckSquare style={{ width: 16, height: 16, color: _A.SAGE }} /> : <Square style={{ width: 16, height: 16, color: _A.MUTED }} />}
                    </button>
                    <button onClick={() => openEdit(r)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Edit3 style={{ width: 14, height: 14, color: _A.MUTED }} /></button>
                    <button onClick={() => remove(r.id)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Trash2 style={{ width: 14, height: 14, color: _A.TERRA }} /></button>
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
  description: string; video_url: string;
  status: 'draft' | 'published' | 'archived'; active: boolean;
}

function ExercisesTab() {
  const [items, setItems] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ExerciseRow>>({ content_type: 'exercise', duration: '15 min', status: 'draft', diastasis_safe: true });
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { setItems(await adminFetch('exercises')); } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ content_type: 'exercise', duration: '15 min', status: 'draft', diastasis_safe: true }); setEditId(null); setShowForm(true); setError(null); };
  const openEdit = (r: ExerciseRow) => { setForm({ ...r }); setEditId(r.id); setShowForm(true); setError(null); };
  const closeForm = () => { setShowForm(false); setEditId(null); setError(null); };

  const save = async () => {
    if (!form.name) return;
    setSaving(true); setError(null);
    try {
      const status = form.status ?? 'draft';
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
        status,
        active: status === 'published',
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

  const cycleStatus = async (r: ExerciseRow) => {
    const next: ExerciseRow['status'] = r.status === 'draft' ? 'published' : r.status === 'published' ? 'archived' : 'draft';
    try {
      await adminUpsert('exercises', { ...r, status: next, active: next === 'published' } as unknown as Record<string, unknown>);
      setItems(p => p.map(x => x.id === r.id ? { ...x, status: next, active: next === 'published' } : x));
    } catch (e: any) { alert(e.message); }
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true); setThumbError(null);
    try {
      const result = await uploadContentImage(file, 'exercises');
      setForm(f => ({ ...f, thumb: result.url }));
    } catch (err: any) {
      setThumbError(err.message ?? 'Nahrávanie zlyhalo');
    } finally {
      setUploadingThumb(false);
      e.target.value = '';
    }
  };

  const seedFromStatic = async () => {
    setSeeding(true); setError(null);
    try {
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

  const exStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; col: string; label: string }> = {
      published: { bg: 'rgba(139,158,136,0.15)', col: _A.SAGE, label: 'live' },
      archived:  { bg: `rgba(61,41,33,0.07)`,    col: _A.MUTED, label: 'arch' },
      draft:     { bg: 'rgba(184,134,74,0.15)',   col: _A.GOLD, label: 'draft' },
    };
    const s = map[status] ?? map.draft;
    return <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: s.bg, color: s.col }}>{s.label}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Exercise Library</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={seedFromStatic} disabled={seeding} style={btnSecondary}>
            {seeding ? 'Importujem...' : 'Import'}
          </button>
          <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 14, height: 14 }} />Nové cvičenie
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[['Celkovo', items.length, _A.DEEP], ['Silové', exercises.length, _A.TERRA], ['Strečing', stretches.length, _A.MAUVE]].map(([label, val, col]) => (
          <AdminCard key={label as string}><div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 28, fontWeight: 500, color: col as string, letterSpacing: '-0.02em', lineHeight: 1 }}>{val as number}</div><div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 6 }}>{label as string}</div></div></AdminCard>
        ))}
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />{error}</div>}

      {showForm && (
        <AdminCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>{editId ? 'Upraviť cvičenie' : 'Nové cvičenie'}</div>
            <button onClick={closeForm} style={{ all: 'unset', cursor: 'pointer' }}><X style={{ width: 16, height: 16, color: _A.MUTED }} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Typ</label>
              <select value={form.content_type ?? 'exercise'} onChange={e => setForm(f => ({ ...f, content_type: e.target.value as 'exercise' | 'stretch' }))} style={inputStyle}>
                <option value="exercise">Silové cvičenie</option>
                <option value="stretch">Strečing</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Názov *</label>
              <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Dĺžka</label>
              <select value={form.duration ?? '15 min'} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={inputStyle}>
                <option value="5 min">5 min</option>
                <option value="15 min">15 min</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Partie tela</label>
              <input value={form.body ?? ''} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Celé telo / Core / Nohy..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Pomôcky</label>
              <select value={form.equip ?? 'Bez pomôcok'} onChange={e => setForm(f => ({ ...f, equip: e.target.value }))} style={inputStyle}>
                <option>Bez pomôcok</option>
                <option>S gumou</option>
                <option>S činkami</option>
              </select>
            </div>
            {form.content_type === 'exercise' && (
              <div>
                <label style={labelStyle}>Level (1-4)</label>
                <select value={form.level ?? 1} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))} style={inputStyle}>
                  {[1,2,3,4].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Náhľadový obrázok</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {form.thumb && <img src={form.thumb} alt="" style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', border: `1px solid ${_A.HAIR}` }} />}
                <button
                  type="button"
                  disabled={uploadingThumb}
                  onMouseDown={e => { e.preventDefault(); thumbInputRef.current?.click(); }}
                  style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: 8, opacity: uploadingThumb ? 0.5 : 1 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  {uploadingThumb ? 'Nahrávam…' : form.thumb ? 'Zmeniť' : 'Nahrať obrázok'}
                </button>
                {thumbError && <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERRA }}>{thumbError}</span>}
              </div>
              <input ref={thumbInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleThumbUpload} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Video URL</label>
              <input value={form.video_url ?? ''} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="Doplníš neskôr…" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Popis</label>
              <textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div>
              <label style={labelStyle}>Stav</label>
              <select value={form.status ?? 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as ExerciseRow['status'] }))} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="published">Publikované</option>
                <option value="archived">Archivované</option>
              </select>
            </div>
            {form.content_type === 'exercise' && (
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <button onClick={() => setForm(f => ({ ...f, diastasis_safe: !f.diastasis_safe }))} style={{ all: 'unset', cursor: 'pointer' }}>
                    {form.diastasis_safe ? <CheckSquare style={{ width: 18, height: 18, color: _A.SAGE }} /> : <Square style={{ width: 18, height: 18, color: _A.MUTED }} />}
                  </button>
                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP }}>Bezpečné pri diastáze</span>
                </label>
              </div>
            )}
          </div>
          {error && <div style={{ marginTop: 12, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button onClick={closeForm} style={btnSecondary}>Zrušiť</button>
            <button onClick={save} disabled={saving} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving && <RefreshCw style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />}Uložiť
            </button>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.length === 0 && <p style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadne cvičenia. Pridaj prvé.</p>}
            {items.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, border: `1px solid ${_A.HAIR}`, background: _A.BG }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {r.thumb && <img src={r.thumb} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />}
                  <div>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{r.name}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: r.content_type === 'exercise' ? 'rgba(193,133,106,0.15)' : 'rgba(168,132,139,0.15)', color: r.content_type === 'exercise' ? _A.TERRA : _A.MAUVE }}>
                        {r.content_type === 'exercise' ? 'Silové' : 'Strečing'}
                      </span>
                      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{r.duration}</span>
                      {r.body && <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{r.body}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button title="Kliknúť pre zmenu stavu" onClick={() => cycleStatus(r)} style={{ all: 'unset', cursor: 'pointer' }}>
                    {exStatusBadge(r.status)}
                  </button>
                  <button onClick={() => openEdit(r)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Edit3 style={{ width: 14, height: 14, color: _A.MUTED }} /></button>
                  <button onClick={() => remove(r.id)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Trash2 style={{ width: 14, height: 14, color: _A.TERRA }} /></button>
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
  featured: boolean; status: 'draft' | 'published' | 'archived'; active: boolean;
}

function MeditationsTab() {
  const [items, setItems] = useState<MeditationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<MeditationRow>>({ duration: '5 min', category: 'Stres', status: 'draft', featured: false });

  const load = async () => {
    setLoading(true); setError(null);
    try { setItems(await adminFetch('meditations')); } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm({ duration: '5 min', category: 'Stres', status: 'draft', featured: false }); setEditId(null); setShowForm(true); setError(null); };
  const openEdit = (r: MeditationRow) => { setForm({ ...r }); setEditId(r.id); setShowForm(true); setError(null); };
  const closeForm = () => { setShowForm(false); setEditId(null); setError(null); };

  const save = async () => {
    if (!form.title) return;
    setSaving(true); setError(null);
    try {
      const status = form.status ?? 'draft';
      const payload: MeditationRow = {
        id: editId ?? `med-${Date.now()}`,
        title: form.title!,
        duration: form.duration ?? '5 min',
        description: form.description ?? '',
        audio_url: form.audio_url ?? '',
        image: form.image ?? '',
        category: form.category ?? 'Stres',
        featured: form.featured ?? false,
        status,
        active: status === 'published',
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

  const cycleStatus = async (r: MeditationRow) => {
    const next: MeditationRow['status'] = r.status === 'draft' ? 'published' : r.status === 'published' ? 'archived' : 'draft';
    try {
      await adminUpsert('meditations', { ...r, status: next, active: next === 'published' } as unknown as Record<string, unknown>);
      setItems(p => p.map(x => x.id === r.id ? { ...x, status: next, active: next === 'published' } : x));
    } catch (e: any) { alert(e.message); }
  };

  const seedFromStatic = async () => {
    setSeeding(true); setError(null);
    try {
      // Import inline meditations from MyselNew — they're hardcoded there
      // We provide the static seed here directly
      const staticMeds: MeditationRow[] = [
        { id: 'med-1', category: 'Stres', title: 'Nájdenie vnútorného pokoja uprostred chaosu', duration: '5 min', description: 'Naučte sa nájsť pokojné miesto vo svojej mysli aj v najrušnejších dňoch', audio_url: '/audio/inner-peace-chaos.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-2', category: 'Mindfulness', title: 'Učenie sa byť prítomná pri každodenných úlohách', duration: '5 min', description: 'Transformujte bežné činnosti na príležitosti pre mindfulness', audio_url: '/audio/present-daily-tasks.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-3', category: 'Materstvo', title: 'Objavovanie trpezlivosti vo výchovnom procese', duration: '5 min', description: 'Kultivujte trpezlivosť a porozumenie v náročných výchovných momentoch', audio_url: '/audio/patience-parenting.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-4', category: 'Mindfulness', title: 'Nájdenie radosti v malých veciach', duration: '5 min', description: 'Objavte krásu v jednoduchých, každodenných momentoch', audio_url: '/audio/joy-small-things.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-5', category: 'Emócie', title: 'Udržiavanie emocionálnej rovnováhy', duration: '5 min', description: 'Technika na stabilizovanie emócií a nájdenie vnútornej harmónie', audio_url: '/audio/emotional-balance.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-6', category: 'Ja', title: 'Vytváranie času pre seba', duration: '5 min', description: 'Naučte sa prioritizovať svoju pohodu a vytvoriť priestor pre seba', audio_url: '/audio/time-for-self.mp3', image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-7', category: 'Materstvo', title: 'Posilňovanie väzby s dieťaťom', duration: '5 min', description: 'Meditácia zameraná na prehĺbenie lásky a spojenia s vaším dieťaťom', audio_url: '/audio/bond-with-child.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-8', category: 'Materstvo', title: 'Prijímanie nepredvídateľnosti materstva', duration: '5 min', description: 'Naučte sa flexibilne reagovať na neočakávané situácie v materstve', audio_url: '/audio/accept-unpredictability.mp3', image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-9', category: 'Emócie', title: 'Naučiť sa odpúšťať sebe a iným', duration: '5 min', description: 'Oslobodenie sa od viny a rozhorčenia cez praktiku odpúštania', audio_url: '/audio/forgiveness-practice.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-10', category: 'Emócie', title: 'Rozvíjanie empatie a porozumenia', duration: '5 min', description: 'Prehĺbenie schopnosti porozumieť sebe aj ostatným s láskavosťou', audio_url: '/audio/empathy-understanding.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-11', category: 'Stres', title: 'Prekonávanie stresu a úzkosti', duration: '5 min', description: 'Efektívne techniky na zvládanie stresu a upokojenie anxióznych myšlienok', audio_url: '/audio/overcome-stress-anxiety.mp3', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-12', category: 'Ja', title: 'Budovanie sebadôvery a sebaúcty', duration: '5 min', description: 'Posilnenie vnútornej sily a pozitívneho vzťahu k sebe', audio_url: '/audio/self-confidence-esteem.mp3', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-13', category: 'Ja', title: 'Nájdenie rovnováhy medzi kariérou a osobným životom', duration: '5 min', description: 'Harmonizácia pracovných a osobných priorít s múdrosťou', audio_url: '/audio/work-life-balance.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-14', category: 'Ja', title: 'Učenie sa hovoriť „nie" bez pocitu viny', duration: '5 min', description: 'Nastavenie zdravých hraníc a sebapéča bez pocitov viny', audio_url: '/audio/saying-no-guilt.mp3', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-15', category: 'Ja', title: 'Rozvíjanie kreativity a hľadanie inšpirácie', duration: '5 min', description: 'Prebudenie tvorivého ducha a otvorenie sa novým možnostiam', audio_url: '/audio/creativity-inspiration.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-16', category: 'Emócie', title: 'Zvládanie pocitu osamelosti a izolácie', duration: '5 min', description: 'Nájdenie spojenia a zmyslu aj v momentoch osamelosti', audio_url: '/audio/loneliness-isolation.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-17', category: 'Mindfulness', title: 'Udržiavanie pozitívneho myslenia', duration: '5 min', description: 'Kultivovanie optimizmu a vďačnosti v každodennom živote', audio_url: '/audio/positive-thinking.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
      ];
      const count = await adminSeed('meditations', staticMeds as unknown as Record<string, unknown>[]);
      alert(`✅ Importovaných ${count} meditácií`);
      await load();
    } catch (e: any) { setError(e.message); }
    setSeeding(false);
  };

  const CATS = ['Stres', 'Mindfulness', 'Materstvo', 'Emócie', 'Ja'];

  const medStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; col: string; label: string }> = {
      published: { bg: 'rgba(139,158,136,0.15)', col: _A.SAGE, label: 'live' },
      archived:  { bg: `rgba(61,41,33,0.07)`,    col: _A.MUTED, label: 'arch' },
      draft:     { bg: 'rgba(184,134,74,0.15)',   col: _A.GOLD, label: 'draft' },
    };
    const s = map[status] ?? map.draft;
    return <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: s.bg, color: s.col }}>{s.label}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Meditation Content</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {items.length === 0 && !loading && (
            <button onClick={seedFromStatic} disabled={seeding} style={btnSecondary}>
              {seeding ? 'Importujem...' : 'Import 17 meditácií'}
            </button>
          )}
          <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 14, height: 14 }} />Nová meditácia
          </button>
        </div>
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle style={{ width: 14, height: 14, flexShrink: 0 }} />{error}</div>}

      {showForm && (
        <AdminCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>{editId ? 'Upraviť meditáciu' : 'Nová meditácia'}</div>
            <button onClick={closeForm} style={{ all: 'unset', cursor: 'pointer' }}><X style={{ width: 16, height: 16, color: _A.MUTED }} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Názov *</label>
              <input value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kategória</label>
              <select value={form.category ?? 'Stres'} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Dĺžka</label>
              <select value={form.duration ?? '5 min'} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={inputStyle}>
                <option value="5 min">5 min</option>
                <option value="10 min">10 min</option>
                <option value="15 min">15 min</option>
                <option value="20 min">20 min</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Popis</label>
              <textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Audio URL</label>
              <input value={form.audio_url ?? ''} onChange={e => setForm(f => ({ ...f, audio_url: e.target.value }))} placeholder="/audio/file.mp3 alebo https://..." style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>URL obrázka</label>
              <input value={form.image ?? ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stav</label>
              <select value={form.status ?? 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as MeditationRow['status'] }))} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="published">Publikovaná</option>
                <option value="archived">Archivovaná</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <button onClick={() => setForm(f => ({ ...f, featured: !f.featured }))} style={{ all: 'unset', cursor: 'pointer' }}>
                  {form.featured ? <CheckSquare style={{ width: 18, height: 18, color: _A.GOLD }} /> : <Square style={{ width: 18, height: 18, color: _A.MUTED }} />}
                </button>
                <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP }}>Odporúčaná</span>
              </label>
            </div>
          </div>
          {error && <div style={{ marginTop: 12, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
            <button onClick={closeForm} style={btnSecondary}>Zrušiť</button>
            <button onClick={save} disabled={saving} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}>
              {saving && <RefreshCw style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />}Uložiť
            </button>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.length === 0 && <p style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadne meditácie. Importuj existujúce alebo pridaj novú.</p>}
            {items.map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, border: `1px solid ${_A.HAIR}`, background: _A.BG }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {r.image && <img src={r.image} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />}
                  <div>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{r.title}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: 'rgba(168,132,139,0.15)', color: _A.MAUVE }}>{r.category}</span>
                      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{r.duration}</span>
                      {r.featured && <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: 'rgba(184,134,74,0.15)', color: _A.GOLD }}>Featured</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button title="Kliknúť pre zmenu stavu" onClick={() => cycleStatus(r)} style={{ all: 'unset', cursor: 'pointer' }}>
                    {medStatusBadge(r.status)}
                  </button>
                  <button onClick={() => openEdit(r)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Edit3 style={{ width: 14, height: 14, color: _A.MUTED }} /></button>
                  <button onClick={() => remove(r.id)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Trash2 style={{ width: 14, height: 14, color: _A.TERRA }} /></button>
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
const DAYS_SK = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok'];
type DayType = 'exercise' | 'meditation' | 'rest';
const DEFAULT_WEEK_TEMPLATE: DayType[] = ['exercise', 'exercise', 'meditation', 'exercise', 'meditation'];
interface DaySlot { dayName: string; type: DayType; contentId: string; message: string; }
interface WeekSlot { weekNumber: number; title: string; days: DaySlot[]; }
interface ProgItem {
  id: string; name: string; level: number; weeks: number;
  description: string; detailed_description: string; image: string;
  schedule: WeekSlot[];
  status: 'draft' | 'published' | 'archived'; active: boolean;
}

function makeDefaultSchedule(n: number): WeekSlot[] {
  return Array.from({ length: n }, (_, i) => ({
    weekNumber: i + 1,
    title: `Týždeň ${i + 1}`,
    days: DAYS_SK.map((dayName, di) => ({ dayName, type: DEFAULT_WEEK_TEMPLATE[di], contentId: '', message: '' })),
  }));
}

function mergeSchedule(existing: WeekSlot[], n: number): WeekSlot[] {
  const fresh = makeDefaultSchedule(n);
  return fresh.map(fw => existing.find(w => w.weekNumber === fw.weekNumber) ?? fw);
}

function ProgramsTab() {
  const empty: ProgItem = { id: '', name: '', level: 1, weeks: 8, description: '', detailed_description: '', image: '', schedule: [], status: 'draft', active: false };
  const [items, setItems] = useState<ProgItem[]>([]);
  const [exercises, setExercises] = useState<{ id: string; name: string; status: string }[]>([]);
  const [meditations, setMeditations] = useState<{ id: string; title: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [editing, setEditing] = useState<ProgItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const staticPrograms: ProgItem[] = [
    { id: 'postpartum',    name: 'Postpartum',    level: 1, weeks: 8, description: 'Ak potrebuješ spevniť brušný korzet, vyriešiť diastázu či inkontinenciu', detailed_description: '', image: '', schedule: [], status: 'published', active: true },
    { id: 'bodyforming',   name: 'BodyForming',   level: 2, weeks: 6, description: 'Ak chceš začať spevňovať celé telo a cvičiť s vlastnou váhou.', detailed_description: '', image: '', schedule: [], status: 'published', active: true },
    { id: 'elastic-bands', name: 'ElasticBands',  level: 3, weeks: 6, description: 'Ak chceš formovať postavu a cvičiť s gumami.', detailed_description: '', image: '', schedule: [], status: 'published', active: true },
    { id: 'strong-sexy',   name: 'Strong&Sexy',   level: 4, weeks: 6, description: 'Ak snívaš o silnom, vyformovanom a funkčnom sexy tele.', detailed_description: '', image: '', schedule: [], status: 'published', active: true },
  ];

  const load = async () => {
    setLoading(true);
    try {
      const [progs, exs, meds] = await Promise.all([
        adminFetch('programmes'),
        adminFetch('exercises'),
        adminFetch('meditations'),
      ]);
      setItems(progs ?? []);
      setExercises((exs ?? []).map((e: any) => ({ id: e.id, name: e.name, status: e.status })));
      setMeditations((meds ?? []).map((m: any) => ({ id: m.id, title: m.title, status: m.status })));
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (prog: ProgItem) => {
    setEditing({ ...prog, schedule: mergeSchedule(prog.schedule ?? [], prog.weeks) });
    setExpandedWeek(1); setError(null);
  };
  const openNew = () => {
    setEditing({ ...empty, id: `prog-${Date.now()}`, schedule: makeDefaultSchedule(8) });
    setExpandedWeek(1); setError(null);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      await adminUpsert('programmes', { ...editing, active: editing.status === 'published' } as unknown as Record<string, unknown>);
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

  const cycleStatus = async (prog: ProgItem) => {
    const next: ProgItem['status'] = prog.status === 'draft' ? 'published' : prog.status === 'published' ? 'archived' : 'draft';
    try {
      await adminUpsert('programmes', { ...prog, status: next, active: next === 'published' } as unknown as Record<string, unknown>);
      setItems(p => p.map(x => x.id === prog.id ? { ...x, status: next, active: next === 'published' } : x));
    } catch (e: any) { alert(e.message); }
  };

  const seedFromStatic = async () => {
    setSeeding(true); setError(null);
    try {
      const count = await adminSeed('programmes', staticPrograms as unknown as Record<string, unknown>[]);
      alert(`✅ Importovaných ${count} programov`);
      await load();
    } catch (e: any) { setError(e.message); }
    setSeeding(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingCover(true); setCoverError(null);
    try {
      const result = await uploadContentImage(file, 'programmes');
      setEditing(p => p && ({ ...p, image: result.url }));
    } catch (err: any) { setCoverError(err.message ?? 'Nahrávanie zlyhalo'); }
    setUploadingCover(false);
    e.target.value = '';
  };

  const setWeeksCount = (n: number) => {
    if (!editing) return;
    setEditing(p => p && ({ ...p, weeks: n, schedule: mergeSchedule(p.schedule, n) }));
  };

  const updateDay = (weekNumber: number, di: number, patch: Partial<DaySlot>) => {
    setEditing(p => {
      if (!p) return p;
      return { ...p, schedule: p.schedule.map(w => w.weekNumber !== weekNumber ? w : { ...w, days: w.days.map((d, i) => i !== di ? d : { ...d, ...patch }) }) };
    });
  };

  const updateWeekTitle = (weekNumber: number, title: string) => {
    setEditing(p => p && ({ ...p, schedule: p.schedule.map(w => w.weekNumber === weekNumber ? { ...w, title } : w) }));
  };

  const DAY_TYPE_COLORS: Record<DayType, string> = { exercise: _A.TERRA, meditation: _A.MAUVE, rest: _A.TERTIARY };
  const DAY_TYPE_LABELS: Record<DayType, string> = { exercise: 'Cvičenie', meditation: 'Meditácia', rest: 'Voľno' };

  const progStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; col: string; label: string }> = {
      published: { bg: 'rgba(139,158,136,0.15)', col: _A.SAGE, label: 'live' },
      archived:  { bg: `rgba(61,41,33,0.07)`,    col: _A.MUTED, label: 'arch' },
      draft:     { bg: 'rgba(184,134,74,0.15)',   col: _A.GOLD, label: 'draft' },
    };
    const s = map[status] ?? map.draft;
    return <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: s.bg, color: s.col, cursor: 'pointer' }}>{s.label}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: _A.DEEP }}>Fitness Programy</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={seedFromStatic} disabled={seeding} style={btnSecondary}>
            {seeding ? 'Importujem…' : 'Seed 4 programy'}
          </button>
          <button onClick={openNew} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 14, height: 14 }} />Nový program
          </button>
        </div>
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA }}>{error}</div>}

      {/* Edit / Schedule-builder form */}
      {editing && (
        <AdminCard>
          {/* Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Názov</label>
              <input value={editing.name} onChange={e => setEditing(p => p && ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Level (1–4)</label>
              <input type="number" min={1} max={4} value={editing.level} onChange={e => setEditing(p => p && ({ ...p, level: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Počet týždňov</label>
              <input type="number" min={1} max={16} value={editing.weeks} onChange={e => setWeeksCount(Number(e.target.value))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Status</label>
              <select value={editing.status} onChange={e => setEditing(p => p && ({ ...p, status: e.target.value as ProgItem['status'] }))} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="published">Published (live)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Krátky popis</label>
              <textarea rows={2} value={editing.description} onChange={e => setEditing(p => p && ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Detailný popis</label>
              <textarea rows={4} value={editing.detailed_description} onChange={e => setEditing(p => p && ({ ...p, detailed_description: e.target.value }))} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Cover obrázok</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {editing.image && <img src={editing.image} style={{ width: 64, height: 40, borderRadius: 8, objectFit: 'cover', border: `1px solid ${_A.HAIR}` }} />}
                <button type="button" disabled={uploadingCover} onMouseDown={e => { e.preventDefault(); coverInputRef.current?.click(); }}
                  style={{ ...btnSecondary, opacity: uploadingCover ? 0.5 : 1 }}>
                  {uploadingCover ? 'Nahrávam…' : editing.image ? 'Zmeniť obrázok' : 'Nahrať obrázok'}
                </button>
                <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleCoverUpload} />
              </div>
              {coverError && <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERRA, marginTop: 4 }}>{coverError}</p>}
            </div>
          </div>

          {/* ── Schedule Builder ── */}
          <div style={{ borderTop: `1px solid ${_A.HAIR}`, paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>Rozvrh programu</div>
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{editing.weeks} týž × 5 dní (Po–Pi)</span>
            </div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              {(['exercise', 'meditation', 'rest'] as DayType[]).map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, display: 'inline-block', background: DAY_TYPE_COLORS[t] }} />
                  {DAY_TYPE_LABELS[t]}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {editing.schedule.map(week => (
                <div key={week.weekNumber} style={{ borderRadius: 12, border: `1px solid ${_A.HAIR}`, overflow: 'hidden' }}>
                  {/* Week header — click to expand */}
                  <button type="button"
                    onClick={() => setExpandedWeek(p => p === week.weekNumber ? null : week.weekNumber)}
                    style={{ all: 'unset', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: _A.CREAM2, boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(193,133,106,0.15)', color: _A.TERRA }}>
                        W{week.weekNumber}
                      </span>
                      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{week.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {week.days.map((d, di) => (
                          <span key={di} style={{ width: 8, height: 8, borderRadius: 999, display: 'inline-block', background: DAY_TYPE_COLORS[d.type] }} />
                        ))}
                      </div>
                      <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{expandedWeek === week.weekNumber ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {/* Week body */}
                  {expandedWeek === week.weekNumber && (
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: _A.BG }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <label style={{ ...labelStyle, marginBottom: 0, flexShrink: 0 }}>Názov týždňa:</label>
                        <input value={week.title} onChange={e => updateWeekTitle(week.weekNumber, e.target.value)}
                          style={{ ...inputStyle, flex: 1 }} />
                      </div>
                      {week.days.map((day, di) => (
                        <div key={di} style={{ borderRadius: 10, border: `1px solid ${_A.HAIR}`, background: _A.CARD, padding: 12 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 600, color: _A.DEEP, width: 80, flexShrink: 0 }}>{day.dayName}</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {(['exercise', 'meditation', 'rest'] as DayType[]).map(t => (
                                <button key={t} type="button"
                                  onClick={() => updateDay(week.weekNumber, di, { type: t, contentId: '' })}
                                  style={{ padding: '4px 10px', borderRadius: 999, fontFamily: 'DM Sans, system-ui', fontSize: 10, fontWeight: 500, cursor: 'pointer', border: day.type === t ? `1px solid ${DAY_TYPE_COLORS[t]}` : `1px solid ${_A.HAIR}`, background: day.type === t ? `${DAY_TYPE_COLORS[t]}18` : 'transparent', color: day.type === t ? DAY_TYPE_COLORS[t] : _A.MUTED }}>
                                  {DAY_TYPE_LABELS[t]}
                                </button>
                              ))}
                            </div>
                          </div>
                          {day.type !== 'rest' && (
                            <select value={day.contentId}
                              onChange={e => updateDay(week.weekNumber, di, { contentId: e.target.value })}
                              style={{ ...inputStyle, marginBottom: 8 }}>
                              <option value="">
                                {day.type === 'exercise' ? '— Vyber cvičenie (video doplníš neskôr) —' : '— Vyber meditáciu —'}
                              </option>
                              {day.type === 'exercise'
                                ? exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}{ex.status !== 'published' ? ` (${ex.status})` : ''}</option>)
                                : meditations.map(m => <option key={m.id} value={m.id}>{m.title}{m.status !== 'published' ? ` (${m.status})` : ''}</option>)
                              }
                            </select>
                          )}
                          <input value={day.message} onChange={e => updateDay(week.weekNumber, di, { message: e.target.value })}
                            placeholder="Motivačná správa od Gabi (nepovinné)…"
                            style={inputStyle} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button onClick={save} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Ukladám…' : 'Uložiť program'}
            </button>
            <button onClick={() => setEditing(null)} style={btnSecondary}>
              Zrušiť
            </button>
          </div>
        </AdminCard>
      )}

      {/* Programme list */}
      <AdminCard>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 16 }}>Programy ({items.length})</div>
        {loading
          ? <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam…</div>
          : items.length === 0
            ? (
              <div style={{ padding: '32px 0', textAlign: 'center' }}>
                <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED, marginBottom: 12 }}>Žiadne programy. Seed 4 základné alebo pridaj nový.</p>
                <button onClick={seedFromStatic} disabled={seeding} style={btnPrimary}>
                  {seeding ? 'Importujem…' : 'Seed 4 programy'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(r => {
                  const filled = (r.schedule ?? []).reduce((a, w) => a + w.days.filter(d => d.type !== 'rest' && d.contentId).length, 0);
                  const total = (r.schedule ?? []).reduce((a, w) => a + w.days.filter(d => d.type !== 'rest').length, 0);
                  return (
                    <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, border: `1px solid ${_A.HAIR}`, background: _A.BG }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {r.image && <img src={r.image} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} />}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{r.name}</span>
                            <button onClick={() => cycleStatus(r)} style={{ all: 'unset', cursor: 'pointer' }}>{progStatusBadge(r.status ?? (r.active ? 'published' : 'draft'))}</button>
                          </div>
                          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>
                            Level {r.level} · {r.weeks} týž · {total > 0 ? `${filled}/${total} dní naplnených` : 'Rozvrh prázdny'}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openEdit(r)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Pencil style={{ width: 14, height: 14, color: _A.GOLD }} /></button>
                        <button onClick={() => remove(r.id)} style={{ all: 'unset', cursor: 'pointer', padding: 6, borderRadius: 8 }}><Trash2 style={{ width: 14, height: 14, color: _A.TERRA }} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
      </AdminCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// A14 design tokens (desktop admin — R14 palette) — alias of _A above
// ─────────────────────────────────────────────────────────────────────────
const A = _A;

const cardStyle: React.CSSProperties = {
  background: A.CARD,
  borderRadius: 16,
  border: `1px solid ${A.HAIR}`,
};

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${A.HAIR}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: A.DEEP, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Gilda Display, Georgia, serif', fontSize: 17, fontWeight: 500 }}>N</div>
        <div>
          <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, color: A.DEEP, fontWeight: 500, letterSpacing: '-0.005em', lineHeight: 1.1 }}>NeoMe</div>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: A.EYEBROW, fontWeight: 500, marginTop: 3 }}>Admin panel</div>
        </div>
      </div>

      {/* Primary nav */}
      <nav style={{ padding: '14px 12px 8px', flex: 1, overflowY: 'auto' }}>
        <div style={{ paddingLeft: 8, paddingBottom: 10, fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: A.EYEBROW, fontWeight: 500 }}>Hlavné</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: isActive ? A.DEEP : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 12,
                  position: 'relative',
                  width: '100%', boxSizing: 'border-box',
                }}
              >
                {isActive && <div style={{ position: 'absolute', left: -12, top: 8, bottom: 8, width: 3, borderRadius: 999, background: A.GOLD }} />}
                <item.icon style={{ width: 15, height: 15, color: isActive ? '#fff' : A.MUTED, flexShrink: 0 }} strokeWidth={1.7} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 500, color: isActive ? '#fff' : A.DEEP, lineHeight: 1.2 }}>{item.label}</div>
                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: isActive ? 'rgba(255,255,255,0.6)' : A.TERTIARY, fontWeight: 400, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: A.HAIR, margin: '14px 8px' }} />

        {/* Utility */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[{ label: 'Notifikácie', icon: Bell }, { label: 'Nastavenia', icon: Settings }].map(({ label, icon: Icon }) => (
            <div key={label} style={{ padding: '8px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon style={{ width: 14, height: 14, color: A.MUTED, flexShrink: 0 }} strokeWidth={1.7} />
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 500, color: A.DEEP }}>{label}</div>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom: admin profile */}
      <div style={{ padding: '14px 16px 18px', borderTop: `1px solid ${A.HAIR}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: A.CREAM2, color: A.DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Gilda Display, Georgia, serif', fontSize: 14, fontWeight: 500, flexShrink: 0 }}>G</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: A.DEEP, fontWeight: 500 }}>Gabi</div>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.EYEBROW, fontWeight: 400, marginTop: 1 }}>Owner</div>
        </div>
        <button onClick={() => navigate('/domov-new')} style={{ all: 'unset', cursor: 'pointer', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogOut style={{ width: 14, height: 14, color: A.MUTED }} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );

  const renderHeader = () => {
    const navItem = navigationItems.find(item => item.id === activeTab);
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, width: '100%' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: A.EYEBROW, fontWeight: 500 }}>Admin · NeoMe</div>
            <div style={{ width: 3, height: 3, borderRadius: 999, background: A.HAIR2 }} />
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: A.SAGE, fontWeight: 500 }}>Live</div>
          </div>
          <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 24, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            {navItem?.label || 'Dashboard'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', background: A.CARD, border: `1px solid ${A.HAIR}`, borderRadius: 10, minWidth: 240 }}>
            <Search style={{ width: 14, height: 14, color: A.MUTED, flexShrink: 0 }} strokeWidth={1.7} />
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: A.TERTIARY }}>Hľadať v Admin paneli…</div>
          </div>
          {/* Notifications */}
          <div style={{ width: 38, height: 38, borderRadius: 10, background: A.CARD, border: `1px solid ${A.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Bell style={{ width: 15, height: 15, color: A.DEEP }} strokeWidth={1.7} />
            <div style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 999, background: A.GOLD, border: `1.5px solid ${A.CARD}` }} />
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const stat = (val: number | undefined) => analyticsLoading ? '…' : (val ?? 0).toLocaleString('sk-SK');
    const kpis = [
      { label: 'Celkom používateliek', value: stat(analytics?.totalUsers),          sub: `${stat(analytics?.newUsersMonth)} nových tento mesiac`, color: A.DEEP,  up: true  },
      { label: 'Plus predplatiteľky',  value: stat(analytics?.activeSubscriptions), sub: `${stat(analytics?.freeUsers)} free používateliek`,      color: A.GOLD,  up: true  },
      { label: 'Referrals',            value: stat(analytics?.referralCount),        sub: 'celkovo odporúčaní',                                      color: A.SAGE,  up: true  },
      { label: 'Príspevky',            value: stat(analytics?.postsCount),           sub: 'v komunite',                                              color: A.TERRA, up: true  },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ ...cardStyle, padding: '20px 22px' }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: A.EYEBROW, fontWeight: 500, marginBottom: 14 }}>{k.label}</div>
              <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 34, fontWeight: 500, color: k.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {analyticsLoading ? <RefreshCw style={{ width: 20, height: 20, color: A.MUTED, animation: 'spin 1s linear infinite' }} /> : k.value}
              </div>
              <div style={{ marginTop: 10, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Two-column: quick actions + recent users */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14 }}>
          {/* Quick actions */}
          <div style={{ ...cardStyle, padding: '22px 22px' }}>
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: A.EYEBROW, fontWeight: 500, marginBottom: 16 }}>Rýchle akcie</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'Používateľky',  desc: 'Spravovať účty',          icon: Users,    tab: 'users' },
                { label: 'Blog',           desc: 'Nový príspevok',          icon: BookOpen, tab: 'blog' },
                { label: 'Komunita',       desc: 'Moderovať príspevky',     icon: Flag,     tab: 'community' },
                { label: 'Promo kódy',     desc: 'Stripe zľavové kódy',     icon: Percent,  tab: 'promo-codes' },
                { label: 'Content Manager',desc: 'Videá, fotky, médiá',    icon: FolderOpen, tab: 'content' },
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = A.CREAM2}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                >
                  <item.icon style={{ width: 15, height: 15, color: A.TERRA, flexShrink: 0 }} strokeWidth={1.7} />
                  <div>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, color: A.DEEP }}>{item.label}</div>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: A.EYEBROW }}>{item.desc}</div>
                  </div>
                  <ChevronRight style={{ width: 13, height: 13, color: A.MUTED, marginLeft: 'auto' }} strokeWidth={1.7} />
                </button>
              ))}
            </div>
          </div>

          {/* Recent users */}
          <div style={{ ...cardStyle, padding: '22px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: A.EYEBROW, fontWeight: 500 }}>Najnovšie používateľky</div>
              <button onClick={() => setActiveTab('users')} style={{ all: 'unset', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: A.GOLD, fontWeight: 500 }}>Všetky</button>
            </div>
            {analyticsLoading ? (
              <div style={{ padding: '16px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: A.MUTED }}>Načítavam…</div>
            ) : (analytics?.recentUsers ?? []).length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: A.MUTED }}>Žiadni používatelia. Skontroluj SUPABASE_SERVICE_ROLE_KEY v Netlify.</div>
            ) : (
              (analytics?.recentUsers ?? []).map((u, i, arr) => (
                <div key={i} style={{ padding: '11px 0', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < arr.length - 1 ? `1px solid ${A.HAIR}` : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 999, background: A.CREAM2, color: A.DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Gilda Display, Georgia, serif', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
                    {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: A.DEEP, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name || u.email}</div>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: A.EYEBROW, marginTop: 1 }}>{new Date(u.created_at).toLocaleDateString('sk-SK')}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };


  const renderCommunity = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 22, fontWeight: 500, color: A.DEEP }}>Community Management</div>
        <button style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Flag style={{ width: 14, height: 14 }} />Create Featured Post
        </button>
      </div>

      {/* Community Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { val: 47,   label: 'Pending Posts',    color: A.DEEP  },
          { val: 8,    label: 'Reported Content', color: A.TERRA },
          { val: 127,  label: 'Active Users',     color: A.SAGE  },
          { val: '89%',label: 'Approval Rate',    color: A.MAUVE },
        ].map((s, i) => (
          <div key={i} style={{ background: A.CARD, borderRadius: 16, border: `1px solid ${A.HAIR}`, padding: '20px 22px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 28, fontWeight: 500, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, marginTop: 6 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Moderation Queue */}
      <div style={{ background: A.CARD, borderRadius: 16, border: `1px solid ${A.HAIR}`, padding: '22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP }}>Moderation Queue</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select style={inputStyle}>
              <option>All Posts</option>
              <option>Pending Review</option>
              <option>Reported</option>
              <option>Featured</option>
            </select>
            <select style={inputStyle}>
              <option>All Categories</option>
              <option>Success Stories</option>
              <option>Questions</option>
              <option>Tips &amp; Advice</option>
              <option>Motivation</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { author: 'Lucia K.',  content: 'Práve som dokončila svoj prvý týždeň Postpartum programu a cítim sa úžasne! Ďakujem za túto aplikáciu.', category: 'Success Story', time: '2 hours ago', status: 'pending', likes: 0, reports: 0 },
            { author: 'Andrea M.', content: 'Má niekto skúsenosť s Level 3 cvičeniami? Sú naozaj náročné alebo je to len môj pocit?', category: 'Question', time: '4 hours ago', status: 'pending', likes: 0, reports: 0 },
            { author: 'Zuzana H.', content: 'Tento recept na avokádové toasty je perfektný na raňajky! Určite odporúčam všetkým.', category: 'Tips & Advice', time: '6 hours ago', status: 'reported', likes: 3, reports: 1 },
          ].map((post, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 12, border: `1px solid ${A.HAIR}`, background: A.BG }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 999, background: A.CREAM2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users style={{ width: 16, height: 16, color: A.TERRA }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: A.DEEP }}>{post.author}</div>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.TERTIARY }}>{post.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: post.status === 'pending' ? 'rgba(184,134,74,0.15)' : 'rgba(193,133,106,0.15)', color: post.status === 'pending' ? A.GOLD : A.TERRA }}>{post.status === 'pending' ? 'Pending' : 'Reported'}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(184,134,74,0.12)', color: A.GOLD }}>{post.category}</span>
                </div>
              </div>

              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: A.DEEP, marginBottom: 10, lineHeight: 1.5 }}>{post.content}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.TERTIARY }}>
                  <span>{post.likes} likes</span>
                  {post.reports > 0 && <span>{post.reports} reports</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button style={{ padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, background: 'rgba(139,158,136,0.15)', color: A.SAGE }}>Approve</button>
                  <button style={{ padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, background: 'rgba(193,133,106,0.15)', color: A.TERRA }}>Reject</button>
                  <button style={{ all: 'unset', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                    <Eye style={{ width: 15, height: 15, color: A.MUTED }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: A.BG, fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 248, flexShrink: 0, background: A.SIDEBAR, borderRight: `1px solid ${A.HAIR}`, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        {renderSidebar()}
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{ padding: '18px 36px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, borderBottom: `1px solid ${A.HAIR}`, background: A.BG, flexShrink: 0 }}>
          {renderHeader()}
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 36px 48px' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}