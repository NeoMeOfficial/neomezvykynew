import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
import { useAdminMessages, useUnreviewedPostsCount, useUnreadAdminMessagesCount } from '../../hooks/useMessages';
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
  { id: 'blog', label: 'Blog', icon: BookOpen, description: 'Blog Posts' },
  { id: 'programs', label: 'Programs', icon: Calendar, description: 'Fitness Programs' },
  { id: 'exercises', label: 'Exercises', icon: Dumbbell, description: 'Exercise Library' },
  { id: 'recipes', label: 'Recipes', icon: Utensils, description: 'Recipe Database' },
  { id: 'meditations', label: 'Meditations', icon: Music, description: 'Audio Content' },
  { id: 'community', label: 'Community', icon: Flag, description: 'Post Moderation' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'User Support' },
  { id: 'affiliates', label: 'Affiliates', icon: Percent, description: 'Partnerky — provízie' },
  { id: 'referrers', label: 'Refer a friend', icon: Gift, description: 'Kandidátky — body' },
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
  interface PartnerReward {
    slug: string;
    name: string;
    point_cost: number;
    color_token: string;
  }
  interface PoolStats { total: number; served: number; available: number }
  interface PoolRow { id: string; code: string; served_to: string | null; served_at: string | null; claimed_at: string | null; expires_at: string | null; created_at: string }

  const [rewards, setRewards] = useState<PartnerReward[]>([]);
  const [stats, setStats] = useState<Record<string, PoolStats>>({});
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [recent, setRecent] = useState<PoolRow[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  const callApi = async (init: RequestInit) => {
    const { data: { session } } = await supabase.auth.getSession();
    return fetch('/.netlify/functions/admin-partner-codes', {
      ...init,
      headers: {
        ...(init.headers || {}),
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
    });
  };

  const loadAll = async () => {
    setLoading(true);
    setLoadErr(null);
    try {
      const res = await callApi({ method: 'GET' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to load');
      setRewards(body.rewards as PartnerReward[]);
      setStats(body.stats as Record<string, PoolStats>);
    } catch (err: any) {
      setLoadErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSlug = async (slug: string) => {
    setOpenSlug(slug);
    setRecent([]);
    try {
      const res = await callApi({ method: 'GET' });
      // We could include slug in query, but the GET returns recent
      // only when ?slug=… is set — fetch again with slug param.
      const res2 = await callApi({ method: 'GET' });
      void res; void res2;
      // Direct fetch with slug:
      const { data: { session } } = await supabase.auth.getSession();
      const res3 = await fetch(`/.netlify/functions/admin-partner-codes?slug=${encodeURIComponent(slug)}`, {
        headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
      });
      const body = await res3.json();
      if (res3.ok && body.recent) setRecent(body.recent as PoolRow[]);
    } catch { /* silent */ }
  };

  useEffect(() => { loadAll(); }, []);

  const openUpload = (slug: string) => {
    setOpenSlug(slug);
    setUploadOpen(true);
    setUploadText('');
    setUploadMsg(null);
  };

  const submitUpload = async () => {
    if (!openSlug || !uploadText.trim()) return;
    const codes = uploadText.split(/[\n,;\t]+/).map(s => s.trim()).filter(Boolean);
    if (codes.length === 0) {
      setUploadMsg('Žiadne validné kódy.');
      return;
    }
    setUploadBusy(true);
    setUploadMsg(null);
    try {
      const res = await callApi({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: openSlug, codes }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Upload failed');
      setUploadMsg(`Pridaných: ${body.inserted}. Preskočených (duplikáty): ${body.skipped}.`);
      setUploadText('');
      // Refresh stats + recent
      await loadAll();
      if (openSlug) await loadSlug(openSlug);
    } catch (err: any) {
      setUploadMsg('Chyba: ' + err.message);
    } finally {
      setUploadBusy(false);
    }
  };

  const deleteUnclaimed = async (id: string) => {
    if (!confirm('Odstrániť tento kód z poolu?')) return;
    try {
      const res = await callApi({ method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      // Re-do with id query param directly:
      const { data: { session } } = await supabase.auth.getSession();
      const res2 = await fetch(`/.netlify/functions/admin-partner-codes?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
      });
      void res;
      const body = await res2.json();
      if (!res2.ok) throw new Error(body.error);
      await loadAll();
      if (openSlug) await loadSlug(openSlug);
    } catch (err: any) {
      alert('Chyba: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div />
        <button onClick={loadAll} disabled={loading} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Obnoviť
        </button>
      </div>
      <Card>
        <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED, lineHeight: 1.55, margin: 0 }}>
          Partner ti pošle zoznam jednorázových kódov. Pridaj ich do poolu pre daný reward. Keď používateľka vymení body, edge-funkcia <code style={{ fontFamily: 'monospace', fontSize: 11 }}>redeem-reward</code> jeden vytiahne a označí ako vydaný. Vydané kódy už nemožno znova použiť.
        </p>
      </Card>

      {loadErr && (
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA }}>
          {loadErr}
        </div>
      )}

      {/* Per-reward cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rewards.map(r => {
          const s = stats[r.slug] ?? { total: 0, served: 0, available: 0 };
          const isOpen = openSlug === r.slug && !uploadOpen;
          return (
            <div key={r.slug} style={{ background: _A.CARD, borderRadius: 12, border: `1px solid ${_A.HAIR}`, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{r.name}</div>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: _A.TERTIARY }}>{r.slug}</span>
                  </div>
                  <div style={{ marginTop: 4, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>
                    Cena: <strong>{r.point_cost} bodov</strong> · Pool: <strong>{s.available}</strong> dostupných · {s.served} vydaných · {s.total} celkovo
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openUpload(r.slug)} style={{ ...btnPrimary, padding: '7px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus style={{ width: 12, height: 12 }} />
                    Pridať kódy
                  </button>
                  <button onClick={() => isOpen ? setOpenSlug(null) : loadSlug(r.slug)} style={{ ...btnSecondary, padding: '7px 12px', fontSize: 11 }}>
                    {isOpen ? 'Skryť' : 'Zobraziť'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${_A.HAIR}` }}>
                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 8 }}>Posledných 50 kódov</div>
                  {recent.length === 0 ? (
                    <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Pool je prázdny.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: _A.CREAM2 }}>
                          {['Kód', 'Stav', 'Vydaný', 'Akcia'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map(row => {
                          const claimed = !!row.claimed_at;
                          return (
                            <tr key={row.id} style={{ borderBottom: `1px solid ${_A.HAIR}` }}>
                              <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 12, color: _A.DEEP }}>{row.code}</td>
                              <td style={{ padding: '8px 12px' }}>
                                <span style={{
                                  fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                                  padding: '3px 7px', borderRadius: 999,
                                  background: claimed ? 'rgba(193,133,106,0.15)' : 'rgba(139,158,136,0.15)',
                                  color: claimed ? _A.TERRA : _A.SAGE,
                                }}>{claimed ? 'Vydaný' : 'Dostupný'}</span>
                              </td>
                              <td style={{ padding: '8px 12px', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>
                                {claimed && row.claimed_at ? new Date(row.claimed_at).toLocaleString('sk-SK', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                              </td>
                              <td style={{ padding: '8px 12px' }}>
                                {!claimed && (
                                  <button onClick={() => deleteUnclaimed(row.id)} style={{ all: 'unset', cursor: 'pointer', padding: 4 }}>
                                    <Trash2 style={{ width: 12, height: 12, color: _A.TERRA }} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {!loading && rewards.length === 0 && (
          <div style={{ padding: '32px 14px', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>
            Žiadne partner-* rewards v rewards tabuľke.
          </div>
        )}
      </div>

      {/* Upload modal */}
      {uploadOpen && openSlug && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center', zIndex: 200, padding: 24 }}>
          <div style={{ background: _A.CARD, borderRadius: 14, padding: 22, maxWidth: 540, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>Pridať kódy do poolu</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: _A.MUTED, marginTop: 2 }}>{openSlug}</div>
              </div>
              <button onClick={() => { setUploadOpen(false); setUploadMsg(null); }} style={{ all: 'unset', cursor: 'pointer' }}>
                <X style={{ width: 16, height: 16, color: _A.MUTED }} />
              </button>
            </div>
            <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.MUTED, lineHeight: 1.55, marginBottom: 10 }}>
              Vlož kódy — jeden na riadok, alebo oddelené čiarkou. Duplikáty (kódy, ktoré sú už v pooli pre tento reward) sa preskočia.
            </p>
            <textarea
              value={uploadText}
              onChange={e => setUploadText(e.target.value)}
              rows={10}
              placeholder={'GYM-A1B2\nGYM-C3D4\nGYM-E5F6\n…'}
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical', minHeight: 180 }}
            />
            {uploadMsg && (
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: _A.CREAM2, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.DEEP }}>
                {uploadMsg}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button onClick={() => { setUploadOpen(false); setUploadMsg(null); }} disabled={uploadBusy} style={btnSecondary}>Zavrieť</button>
              <button onClick={submitUpload} disabled={uploadBusy || !uploadText.trim()} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                {uploadBusy && <RefreshCw style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />}
                {uploadBusy ? 'Pridávam…' : 'Pridať'}
              </button>
            </div>
          </div>
        </div>
      )}
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
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-create-promo-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
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
        <div />
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
  reviewed_at: string | null;
}

function CommunityModerationTab() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'unreviewed' | 'all' | 'removed'>('unreviewed');
  const [busy, setBusy] = useState<string | null>(null);

  // Admin sees ALL posts including removed ones — so they can restore.
  // Direct query bypasses useCommunityPosts (which hides removed from
  // the public feed).
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, user_id, author_name, type, content, likes_count, comments_count, status, created_at, reviewed_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) {
      setPosts(data.map(r => ({
        ...r,
        status: (r.status as 'visible' | 'removed') ?? 'visible',
        reviewed_at: r.reviewed_at ?? null,
      })));
    }
    setLoading(false);
  };

  const toggleReviewed = async (id: string, current: string | null) => {
    if (busy) return;
    setBusy(id);
    const nextValue = current ? null : new Date().toISOString();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('community_posts')
      .update({ reviewed_at: nextValue, reviewed_by: nextValue ? user?.id : null })
      .eq('id', id);
    if (error) {
      alert('Chyba pri označení: ' + error.message);
    } else {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, reviewed_at: nextValue } : p));
    }
    setBusy(null);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: 'visible' | 'removed') => {
    if (busy) return;
    setBusy(id);
    // Server-side: also reverses points_ledger entries tied to the post
    // when status flips to 'removed' (author 5pts + every liker's 1pt).
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const res = await fetch('/api/admin-set-post-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ postId: id, status }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert('Chyba pri aktualizácii statusu: ' + (body.error || res.statusText));
    } else {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      if (status === 'removed' && body.reversedAuthor) {
        console.log(`[moderation] Reversed ${body.reversedAuthor} author points for post ${id}`);
      }
    }
    setBusy(null);
  };

  const visible = posts.filter(p => {
    if (filter === 'removed') return p.status === 'removed';
    if (filter === 'unreviewed') return p.status !== 'removed' && !p.reviewed_at;
    return true;
  });
  const removedCount = posts.filter(p => p.status === 'removed').length;
  const visibleCount = posts.length - removedCount;
  const unreviewedCount = posts.filter(p => p.status !== 'removed' && !p.reviewed_at).length;

  const statNum = (val: number, color: string) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 28, fontWeight: 500, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{val}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div />
        <div style={{ display: 'flex', gap: 8 }}>
          {(['unreviewed', 'all', 'removed'] as const).map(f => {
            const labels: Record<typeof f, string> = { unreviewed: 'Nepreskúmané', all: 'Všetky', removed: 'Odstránené' };
            const badge = f === 'unreviewed' ? unreviewedCount : 0;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, background: filter === f ? _A.DEEP : _A.CREAM2, color: filter === f ? '#fff' : _A.DEEP }}>
                {labels[f]}
                {badge > 0 && (
                  <span style={{ minWidth: 16, height: 16, padding: '0 5px', borderRadius: 999, background: filter === f ? _A.GOLD : _A.TERRA, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge > 99 ? '99+' : badge}</span>
                )}
              </button>
            );
          })}
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
                          {!isRemoved && !post.reviewed_at && (
                            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(184,134,74,0.15)', color: _A.GOLD }}>Nové</span>
                          )}
                          {!isRemoved && post.reviewed_at && (
                            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(139,158,136,0.15)', color: _A.SAGE }}>Preskúmané</span>
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
                      {!isRemoved && (
                        <button onClick={() => toggleReviewed(post.id, post.reviewed_at)} disabled={isBusy} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, background: post.reviewed_at ? _A.CREAM2 : 'rgba(184,134,74,0.15)', color: post.reviewed_at ? _A.MUTED : _A.GOLD, opacity: isBusy ? 0.5 : 1 }}>
                          <Check style={{ width: 12, height: 12 }} />{post.reviewed_at ? 'Odznačiť' : 'Označiť'}
                        </button>
                      )}
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

function UsersTab({ isFullAdmin }: { isFullAdmin: boolean }) {
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
  const [kebabOpen, setKebabOpen] = useState<{ id: string; el: HTMLElement } | null>(null);
  const [roleEditFor, setRoleEditFor] = useState<string | null>(null);
  const [, setKebabTick] = useState(0);
  useEffect(() => {
    if (!kebabOpen) return;
    const track = () => setKebabTick(t => t + 1);
    window.addEventListener('scroll', track, true);
    window.addEventListener('resize', track);
    return () => {
      window.removeEventListener('scroll', track, true);
      window.removeEventListener('resize', track);
    };
  }, [kebabOpen]);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetail>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [stripeDetails, setStripeDetails] = useState<Record<string, StripeDetail | { error: string }>>({});
  const [loadingStripe, setLoadingStripe] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Server fn with the service-role key: direct client reads returned
      // only the admin's OWN subscriptions row (no admin RLS on that
      // table), so every customer silently displayed as Free.
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-get-users', {
        headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to load users');

      setUsers((body.users ?? []).map((p: any) => {
        // PostgREST returns the joined subscriptions as an array.
        const sub = Array.isArray(p.subscriptions) ? p.subscriptions[0] : p.subscriptions;
        return {
          ...p,
          nutrition_plan_purchased: !!p.nutrition_plan_purchased,
          subscriptions: sub
            ? {
                tier: sub.tier,
                active: sub.active,
                stripe_customer_id: sub.stripe_customer_id,
                stripe_subscription_id: sub.stripe_subscription_id,
                current_period_end: sub.current_period_end,
                cancel_at_period_end: sub.cancel_at_period_end,
              }
            : null,
        };
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
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

  interface UserEmail { id: string; to: string; from: string; subject: string; created_at: string; last_event: string }
  const [emailLogs, setEmailLogs] = useState<Record<string, { emails: UserEmail[] } | { error: string }>>({});
  const [loadingEmails, setLoadingEmails] = useState<string | null>(null);

  const fetchUserEmails = async (user: AdminUser) => {
    if (emailLogs[user.id] || loadingEmails === user.id) return;
    setLoadingEmails(user.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-user-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id }),
      });
      const body = await res.json();
      if (!res.ok) {
        setEmailLogs(prev => ({ ...prev, [user.id]: { error: body.error || 'Failed to load' } }));
      } else {
        setEmailLogs(prev => ({ ...prev, [user.id]: { emails: body.emails as UserEmail[] } }));
      }
    } catch (err: any) {
      setEmailLogs(prev => ({ ...prev, [user.id]: { error: err.message || 'Network error' } }));
    } finally {
      setLoadingEmails(null);
    }
  };

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
      fetchUserDetail(userId);
      loadProgramInfo(userId);
      const u = users.find(x => x.id === userId);
      if (u) {
        fetchStripeDetail(u);
        fetchUserEmails(u);
      }
    }
  };

  const handleCancelSubscription = async (user: AdminUser) => {
    if (!user.subscriptions?.stripe_subscription_id) return;
    if (!window.confirm(`Zrušiť predplatné ${user.email} ku koncu obdobia?`)) return;
    setCancelling(user.id);
    try {
      // Admin-specific fn: the self-service cancel-subscription cancels the
      // CALLER's own subscription — pointing it here would cancel Gabi's.
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id }),
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
      // Server fn: subscriptions has no admin-write RLS, the old direct
      // upsert always failed. The fn preserves the user's Stripe linkage.
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-set-user-tier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ userId, tier }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
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
  const [togglingRole, setTogglingRole] = useState<string | null>(null);

  // Single-program access grants (program_purchases) — "selected basis"
  // access for legacy programme buyers without a subscription.
  const [programsOpenFor, setProgramsOpenFor] = useState<string | null>(null);
  const [userGrants, setUserGrants] = useState<Record<string, string[]>>({});
  const [userActiveProgram, setUserActiveProgram] = useState<Record<string, { program_id: string; start_date: string } | null>>({});
  const [userProgramHistory, setUserProgramHistory] = useState<Record<string, { program_id: string; start_date: string; ended_at: string; status: string; weeks_reached: number | null }[]>>({});
  const [togglingProgram, setTogglingProgram] = useState<string | null>(null);

  // "Pridať používateľku" — invite (create + set-password email) with an
  // optional single-program grant in one step.
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState<{ email: string; name: string; programId: string; role?: string }>({ email: '', name: '', programId: '' });
  const [inviting, setInviting] = useState(false);
  const submitInvite = async () => {
    if (inviting) return;
    setInviting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          email: inviteForm.email,
          name: inviteForm.name || undefined,
          programId: inviteForm.programId || undefined,
          role: inviteForm.role || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Zlyhalo');
      alert(`✅ Pozvánka odoslaná na ${inviteForm.email}${inviteForm.programId ? ` + prístup k programu` : ''}. Používateľka si nastaví heslo cez odkaz v e-maile.`);
      setInviteOpen(false);
      setInviteForm({ email: '', name: '', programId: '' });
      fetchUsers();
    } catch (err: any) {
      alert('Pozvánka zlyhala: ' + err.message);
    } finally {
      setInviting(false);
    }
  };
  const PROGRAM_OPTIONS: [string, string][] = [
    ['postpartum', 'Postpartum'], ['bodyforming', 'BodyForming'],
    ['elastic-bands', 'El. gumy'], ['strong-sexy', 'Strong&Sexy'],
  ];
  const loadProgramInfo = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/.netlify/functions/admin-set-program-access?userId=${encodeURIComponent(userId)}`, {
        headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
      });
      const body = await res.json();
      if (res.ok) {
        setUserGrants(prev => ({ ...prev, [userId]: (body.grants ?? []).map((g: { program_id: string }) => g.program_id) }));
        setUserActiveProgram(prev => ({ ...prev, [userId]: body.active ?? null }));
        setUserProgramHistory(prev => ({ ...prev, [userId]: body.history ?? [] }));
      }
    } catch { /* blocks just show unknown state */ }
  };
  const toggleProgramGrant = async (userId: string, programId: string) => {
    const grant = !(userGrants[userId] ?? []).includes(programId);
    setTogglingProgram(`${userId}:${programId}`);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-set-program-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ userId, programId, grant }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setUserGrants(prev => ({
        ...prev,
        [userId]: grant
          ? [...(prev[userId] ?? []), programId]
          : (prev[userId] ?? []).filter(p => p !== programId),
      }));
    } catch (err: any) {
      alert('Chyba pri zmene prístupu k programu: ' + err.message);
    } finally {
      setTogglingProgram(null);
    }
  };

  const handleSetRole = async (user: AdminUser, next: string) => {
    const current = user.role === 'admin' ? 'admin' : user.role === 'support' ? 'support' : 'user';
    if (next === current) return;
    const LABEL: Record<string, string> = {
      admin: 'ADMIN — plný prístup vrátane financií',
      support: 'SUPPORT — celý panel OKREM financií (tržby, affiliates, Stripe akcie, granty)',
      user: 'bežná používateľka (bez admin panelu)',
    };
    if (!window.confirm(`Zmeniť rolu ${user.email} na ${LABEL[next]}?`)) return;
    setTogglingRole(user.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-set-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id, role: next }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, role: next === 'user' ? null : next } : u)));
      if (next !== 'user') {
        alert(`${user.email} je teraz ${next}. Dôležité: musí sa odhlásiť a znova prihlásiť, aby jej platil nový token.`);
      }
    } catch (err: any) {
      alert('Chyba pri zmene role: ' + err.message);
    } finally {
      setTogglingRole(null);
    }
  };

  const handleToggleMealPlan = async (user: AdminUser) => {
    const next = !user.nutrition_plan_purchased;
    const confirmMsg = next
      ? `Pridelíme ${user.email} prístup k jedálničku (bez platby v Stripe).`
      : `Odoberieme ${user.email} prístup k jedálničku. Toto NEVRACIA peniaze — refund spravíš v Stripe.`;
    if (!window.confirm(confirmMsg)) return;
    setTogglingMeal(user.id);
    try {
      // Server fn required: the profiles trigger (20260707120000) rejects
      // nutrition_plan_purchased changes from any non-service_role caller —
      // the old direct update matched 0 rows and faked success.
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-set-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ userId: user.id, purchased: next }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, nutrition_plan_purchased: next } : u)));
    } catch (err: any) {
      alert('Chyba pri zmene jedálnička: ' + err.message);
    } finally {
      setTogglingMeal(null);
    }
  };

  // ── Auth recovery / magic link generation ─────────────────────
  // Generates a one-time link the admin can send to a user via Slack
  // or another channel — useful when the user can't log in and the
  // transactional email pipeline is unreliable.
  const [authActionBusy, setAuthActionBusy] = useState<string | null>(null);
  const [authActionModal, setAuthActionModal] = useState<
    | null
    | { email: string; type: 'recovery' | 'magiclink' }
    | { error: string }
  >(null);

  const runAuthAction = async (user: AdminUser, type: 'recovery' | 'magiclink') => {
    if (authActionBusy) return;
    setAuthActionBusy(user.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-user-auth-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          userId: user.id,
          type,
          // Land them on Domov after the recovery / magic-link flow.
          redirectTo: `${window.location.origin}/domov-new`,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setAuthActionModal({ error: body.error || 'Nepodarilo sa odoslať e-mail' });
      } else {
        setAuthActionModal({ email: body.email, type: body.type });
      }
    } catch (err: any) {
      setAuthActionModal({ error: err.message || 'Chyba siete' });
    } finally {
      setAuthActionBusy(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeleting(userId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
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
        <div />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setInviteOpen(v => !v)} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus style={{ width: 13, height: 13 }} /> Pridať používateľku
          </button>
          <button onClick={fetchUsers} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw style={{ width: 13, height: 13 }} /> Obnoviť
          </button>
        </div>
      </div>

      {inviteOpen && (
        <Card>
          <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 17, fontWeight: 500, color: _A.DEEP, marginBottom: 14 }}>
            Nová používateľka — pozvánka e-mailom
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, display: 'block', marginBottom: 5 }}>E-mail *</label>
              <input value={inviteForm.email} onChange={e => setInviteForm(fm => ({ ...fm, email: e.target.value }))} placeholder="meno@email.sk"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1px solid ${_A.HAIR2}`, fontFamily: 'DM Sans, system-ui', fontSize: 13 }} />
            </div>
            <div>
              <label style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, display: 'block', marginBottom: 5 }}>Meno (voliteľné)</label>
              <input value={inviteForm.name} onChange={e => setInviteForm(fm => ({ ...fm, name: e.target.value }))} placeholder="Katka"
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1px solid ${_A.HAIR2}`, fontFamily: 'DM Sans, system-ui', fontSize: 13 }} />
            </div>
            {isFullAdmin && (
            <div>
              <label style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, display: 'block', marginBottom: 5 }}>Prístup k programu (voliteľné)</label>
              <select value={inviteForm.programId} onChange={e => setInviteForm(fm => ({ ...fm, programId: e.target.value }))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1px solid ${_A.HAIR2}`, fontFamily: 'DM Sans, system-ui', fontSize: 13, background: '#fff' }}>
                <option value="">— žiadny (len účet) —</option>
                <option value="postpartum">Postpartum</option>
                <option value="bodyforming">BodyForming</option>
                <option value="elastic-bands">Elastické gumy</option>
                <option value="strong-sexy">Strong & Sexy</option>
              </select>
            </div>
            )}
            {isFullAdmin && (
            <div>
              <label style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, display: 'block', marginBottom: 5 }}>Rola (voliteľné)</label>
              <select value={inviteForm.role ?? ''} onChange={e => setInviteForm(fm => ({ ...fm, role: e.target.value }))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 10, border: `1px solid ${_A.HAIR2}`, fontFamily: 'DM Sans, system-ui', fontSize: 13, background: '#fff' }}>
                <option value="">— používateľka —</option>
                <option value="support">Support</option>
                <option value="admin">Admin (plný prístup)</option>
              </select>
            </div>
            )}
            <button onClick={submitInvite} disabled={inviting || !inviteForm.email} style={{ ...btnPrimary, opacity: inviting || !inviteForm.email ? 0.6 : 1, whiteSpace: 'nowrap' }}>
              {inviting ? 'Posielam…' : 'Poslať pozvánku'}
            </button>
          </div>
          <div style={{ marginTop: 10, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.MUTED }}>
            Používateľka dostane e-mail s odkazom, cez ktorý si nastaví heslo. Bez predplatného má prístup len k zvolenému programu.
          </div>
        </Card>
      )}

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
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', cursor: 'pointer', flexWrap: 'wrap', rowGap: 10 }}
                  onClick={() => toggleExpand(user.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', rowGap: 6, justifyContent: 'flex-end', maxWidth: '100%' }} onClick={e => e.stopPropagation()}>
                    <span style={tierBadgeStyle(tier)}>{tierLabel(tier)}</span>

                    {/* Kebab — every per-user action lives here (Sam
                        2026-10-05: rows show only what's necessary). */}
                    <div style={{ position: 'relative' }}>
                      <button
                        aria-label="Akcie"
                        onClick={(e) => {
                          if (kebabOpen?.id === user.id) { setKebabOpen(null); setRoleEditFor(null); return; }
                          setKebabOpen({ id: user.id, el: e.currentTarget as HTMLElement });
                          setRoleEditFor(null);
                          if (isFullAdmin) loadProgramInfo(user.id);
                        }}
                        style={{ all: 'unset', cursor: 'pointer', width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${_A.HAIR}`, color: _A.DEEP, fontSize: 15, letterSpacing: '1px', background: kebabOpen?.id === user.id ? _A.CREAM2 : 'transparent' }}
                      >⋯</button>
                      {kebabOpen?.id === user.id && createPortal((() => {
                        const item = (label: string, onClick: () => void, opts?: { danger?: boolean; active?: boolean; busy?: boolean }) => (
                          <button
                            key={label}
                            disabled={!!opts?.busy}
                            onClick={() => onClick()}
                            style={{ all: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 14px', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: opts?.danger ? _A.TERRA : _A.DEEP, boxSizing: 'border-box', opacity: opts?.busy ? 0.5 : 1 }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = _A.CREAM2; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            <span>{label}</span>
                            {opts?.active && <span style={{ color: _A.SAGE, fontWeight: 600 }}>✓</span>}
                          </button>
                        );
                        const head = (label: string) => (
                          <div key={`h-${label}`} style={{ padding: '8px 14px 3px', fontFamily: 'DM Sans, system-ui', fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 600, borderTop: `1px solid ${_A.HAIR}`, marginTop: 4 }}>{label}</div>
                        );
                        const grants = userGrants[user.id] ?? [];
                        const roleNow = user.role === 'admin' ? 'admin' : user.role === 'support' ? 'support' : 'user';
                        const PROGS: [string, string][] = [['postpartum', 'Postpartum'], ['bodyforming', 'BodyForming'], ['elastic-bands', 'Elastické gumy'], ['strong-sexy', 'Strong & Sexy']];
                        // Re-measured every render; the scroll listener
                        // ticks state so the menu follows its button.
                        const r = kebabOpen!.el.getBoundingClientRect();
                        const menuH = Math.min(420, window.innerHeight - 16);
                        const top = Math.max(8, Math.min(r.bottom + 4, window.innerHeight - menuH));
                        return (
                          <>
                          <div onClick={() => { setKebabOpen(null); setRoleEditFor(null); }} style={{ position: 'fixed', inset: 0, zIndex: 1190 }} />
                          <div style={{ position: 'fixed', left: Math.max(8, r.right - 230), top, background: '#fff', border: `1px solid ${_A.HAIR}`, borderRadius: 12, zIndex: 1200, minWidth: 230, maxHeight: menuH, overflowY: 'auto', boxShadow: '0 10px 30px rgba(31,35,40,0.18)', paddingBottom: 4 }}>
                            {item('✉ Napísať správu', () => {
                              try { sessionStorage.setItem('neome_admin_msg_user', user.id); } catch { /* ignore */ }
                              window.dispatchEvent(new CustomEvent('neome:admin-open-messages'));
                              setKebabOpen(null);
                            })}
                            {item('Magic link na prihlásenie', () => runAuthAction(user, 'magiclink'), { busy: authActionBusy === user.id })}
                            {item('Reset hesla', () => runAuthAction(user, 'recovery'), { busy: authActionBusy === user.id })}
                            {isFullAdmin && (<>
                              {head('Prístup')}
                              {item('Free', () => handleSetTier(user.id, 'free'), { active: tier === 'free', busy: isSettingThis })}
                              {item('Premium', () => handleSetTier(user.id, 'neome_plus'), { active: tier === 'neome_plus', busy: isSettingThis })}
                              {item(user.nutrition_plan_purchased ? 'Odobrať jedálniček' : 'Pridať jedálniček', () => handleToggleMealPlan(user), { busy: togglingMeal === user.id })}
                              {head('Programy (prístup bez Plus)')}
                              {PROGS.map(([pid, pname]) => item(pname, () => {
                                const has = grants.includes(pid);
                                if (!has) {
                                  // Assigning hands out paid value — typed
                                  // confirmation required (Sam 2026-10-05).
                                  const typed = window.prompt(`Naozaj prideliť program ${pname} používateľke ${user.email}?\n\nPre potvrdenie napíš: PRIDAT`);
                                  if ((typed ?? '').trim().toUpperCase() !== 'PRIDAT') return;
                                } else if (!window.confirm(`Odobrať program ${pname} používateľke ${user.email}?`)) {
                                  return;
                                }
                                toggleProgramGrant(user.id, pid);
                              }, { active: grants.includes(pid), busy: togglingProgram === `${user.id}:${pid}` }))}
                              {head('Rola')}
                              {roleEditFor !== user.id ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px' }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.DEEP }}>
                                    {roleNow === 'admin' ? 'Admin' : roleNow === 'support' ? 'Support' : 'Používateľka'}
                                  </span>
                                  <button
                                    onClick={() => setRoleEditFor(user.id)}
                                    style={{ all: 'unset', cursor: 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, color: _A.GOLD, padding: '2px 6px' }}
                                  >Zmeniť</button>
                                </div>
                              ) : (<>
                                {item('Používateľka', () => { setRoleEditFor(null); handleSetRole(user, 'user'); }, { active: roleNow === 'user', busy: togglingRole === user.id })}
                                {item('Support', () => { setRoleEditFor(null); handleSetRole(user, 'support'); }, { active: roleNow === 'support', busy: togglingRole === user.id })}
                                {item('Admin', () => { setRoleEditFor(null); handleSetRole(user, 'admin'); }, { active: roleNow === 'admin', busy: togglingRole === user.id })}
                              </>)}
                              {head('Nebezpečné')}
                              {sub?.stripe_subscription_id && !sub?.cancel_at_period_end &&
                                item('Zrušiť predplatné', () => handleCancelSubscription(user), { danger: true, busy: cancelling === user.id })}
                              {item('Vymazať účet', () => { if (window.confirm(`Naozaj vymazať ${user.email}? Nenávratné.`)) handleDeleteUser(user.id); }, { danger: true, busy: deleting === user.id })}
                            </>)}
                          </div>
                          </>
                        );
                      })(), document.body)}
                    </div>
                                        <ChevronRight style={{ width: 14, height: 14, color: _A.TERTIARY, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${_A.HAIR}`, padding: '16px 14px', background: _A.BG, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {isLoadingDetail ? (
                      <div style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Načítavam…</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 10 }}>

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

                        {/* Program block (Sam 2026-10-05: same treatment
                            as subscription — grants, start, progress,
                            history, read-only; granting lives in ⋯). */}
                        <div style={{ background: _A.CARD, borderRadius: 10, border: `1px solid ${_A.HAIR}`, padding: '12px 14px' }}>
                          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 10 }}>Programy</div>
                          {(() => {
                            const NAMES: Record<string, string> = { postpartum: 'Postpartum', bodyforming: 'BodyForming', 'elastic-bands': 'Elastické gumy', 'strong-sexy': 'Strong & Sexy' };
                            const WEEKS: Record<string, number> = { postpartum: 8, bodyforming: 6, 'elastic-bands': 6, 'strong-sexy': 6 };
                            const grants = userGrants[user.id];
                            const act = userActiveProgram[user.id];
                            const hist = userProgramHistory[user.id] ?? [];
                            const STATUS_SK: Record<string, string> = { completed: 'dokončený', paused: 'pozastavený', canceled: 'zrušený', replaced: 'nahradený' };
                            if (grants === undefined && !act) {
                              return <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Načítavam…</p>;
                            }
                            const rows: React.ReactNode[] = [];
                            if ((grants ?? []).length > 0) {
                              rows.push(
                                <div key="g" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Pridelené</span>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500, textAlign: 'right' }}>{(grants ?? []).map(g => NAMES[g] ?? g).join(', ')}</span>
                                </div>,
                              );
                            }
                            if (act) {
                              const total = WEEKS[act.program_id] ?? 8;
                              const start = new Date(act.start_date + 'T00:00:00');
                              const today = new Date(); today.setHours(0, 0, 0, 0);
                              const daysSince = Math.round((today.getTime() - start.getTime()) / 86400000);
                              const week = Math.floor(daysSince / 7) + 1;
                              rows.push(
                                <div key="a1" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Beží</span>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500 }}>{NAMES[act.program_id] ?? act.program_id}</span>
                                </div>,
                                <div key="a2" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Štart</span>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.DEEP, fontWeight: 500 }}>{start.toLocaleDateString('sk-SK')}</span>
                                </div>,
                                <div key="a3" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>Postup</span>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: daysSince < 0 ? _A.GOLD : week > total ? _A.TERRA : _A.SAGE, fontWeight: 500 }}>
                                    {daysSince < 0 ? 'štartuje v pondelok' : week > total ? `po termíne (${total} týž.)` : `týždeň ${week} z ${total} · deň ${daysSince + 1}`}
                                  </span>
                                </div>,
                              );
                            }
                            for (const h of hist.slice(0, 4)) {
                              rows.push(
                                <div key={`h-${h.program_id}-${h.ended_at}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.EYEBROW }}>{NAMES[h.program_id] ?? h.program_id}</span>
                                  <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.MUTED }}>{STATUS_SK[h.status] ?? h.status} {new Date(h.ended_at).toLocaleDateString('sk-SK')}{h.weeks_reached ? ` · týž. ${h.weeks_reached}` : ''}</span>
                                </div>,
                              );
                            }
                            if (rows.length === 0) {
                              return <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERTIARY }}>Žiadne programy — prístup pridelíš cez ⋯ menu.</p>;
                            }
                            return <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>{rows}</div>;
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

                    {/* Email log — last sends from Resend, filtered to this user's address */}
                    {!isLoadingDetail && (
                      <div style={{ marginTop: 12, background: _A.CARD, borderRadius: 10, border: `1px solid ${_A.HAIR}`, padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>E-mail log (Resend)</div>
                          <button
                            onClick={() => { setEmailLogs(prev => { const n = { ...prev }; delete n[user.id]; return n; }); fetchUserEmails(user); }}
                            disabled={loadingEmails === user.id}
                            style={{ all: 'unset', cursor: loadingEmails === user.id ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, system-ui', fontSize: 10, color: _A.GOLD, fontWeight: 500 }}
                          >
                            Obnoviť
                          </button>
                        </div>
                        {loadingEmails === user.id ? (
                          <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Načítavam…</p>
                        ) : !emailLogs[user.id] ? (
                          <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>—</p>
                        ) : 'error' in emailLogs[user.id] ? (
                          <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.TERRA, lineHeight: 1.5 }}>
                            {(emailLogs[user.id] as { error: string }).error}
                          </p>
                        ) : (() => {
                          const log = emailLogs[user.id] as { emails: UserEmail[] };
                          if (log.emails.length === 0) {
                            return <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>Žiadne e-maily v posledných 100 odoslaných.</p>;
                          }
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {log.emails.slice(0, 10).map(em => {
                                const eventColor = em.last_event === 'delivered'    ? _A.SAGE
                                                  : em.last_event === 'opened'      ? _A.GOLD
                                                  : em.last_event === 'bounced'     ? _A.TERRA
                                                  : em.last_event === 'complained'  ? _A.TERRA
                                                  : _A.MUTED;
                                return (
                                  <div key={em.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.DEEP, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{em.subject}</div>
                                      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: _A.TERTIARY }}>
                                        {new Date(em.created_at).toLocaleString('sk-SK', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                    <span style={{
                                      fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                                      padding: '2px 7px', borderRadius: 999,
                                      background: `${eventColor}18`, color: eventColor, flexShrink: 0,
                                    }}>{em.last_event}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Auth action result — confirms the email was triggered */}
      {authActionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center', zIndex: 200, padding: 24 }} onClick={() => setAuthActionModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: _A.CARD, borderRadius: 14, padding: 22, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: _A.DEEP }}>
                {'error' in authActionModal
                  ? 'Chyba'
                  : authActionModal.type === 'recovery'
                    ? 'E-mail na reset hesla odoslaný'
                    : 'Magic link odoslaný'}
              </div>
              <button onClick={() => setAuthActionModal(null)} style={{ all: 'unset', cursor: 'pointer' }}>
                <X style={{ width: 16, height: 16, color: _A.MUTED }} />
              </button>
            </div>
            {'error' in authActionModal ? (
              <div style={{ padding: '12px 14px', background: 'rgba(193,133,106,0.12)', border: `1px solid ${_A.TERRA}30`, borderRadius: 10, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.TERRA }}>
                {authActionModal.error}
              </div>
            ) : (
              <>
                <div style={{ padding: '12px 14px', background: 'rgba(139,158,136,0.10)', border: `1px solid ${_A.SAGE}30`, borderRadius: 10, fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: _A.DEEP, lineHeight: 1.55 }}>
                  E-mail bol odoslaný na <strong style={{ color: _A.DEEP, fontWeight: 500 }}>{authActionModal.email}</strong>. Mal by doraziť do 1 minúty (skontrolovať aj spam).
                </div>
                <div style={{ marginTop: 12, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.TERTIARY, lineHeight: 1.55 }}>
                  Doručenie môžeš overiť v E-mail logu nižšie alebo priamo v Resend dashbord.
                </div>
              </>
            )}
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setAuthActionModal(null)} style={btnPrimary}>Zavrieť</button>
            </div>
          </div>
        </div>
      )}
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
        <div />
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
    thread, sendReply, totalUnread, setAssignment,
  } = useAdminMessages();
  const [reply, setReply] = React.useState('');
  const [userNames, setUserNames] = React.useState<Record<string, string>>({});
  const [filter, setFilter] = React.useState<'all' | 'gabi' | 'admin' | 'unassigned'>('all');
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredConversations = React.useMemo(() => {
    if (filter === 'all') return conversations;
    if (filter === 'unassigned') return conversations.filter(c => c.assigned_to === null);
    return conversations.filter(c => c.assigned_to === filter);
  }, [conversations, filter]);

  const selectedConv = conversations.find(c => c.user_id === selectedUserId);

  // User search — find ANYONE and open a thread with her, whether or
  // not she ever wrote first (Sam 2026-10-05). Admin RLS allows the
  // profiles read.
  const [userSearch, setUserSearch] = React.useState('');
  const [searchHits, setSearchHits] = React.useState<{ id: string; email: string | null; full_name: string | null }[]>([]);
  React.useEffect(() => {
    const q = userSearch.trim();
    if (q.length < 2) { setSearchHits([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
        .limit(8);
      setSearchHits(data ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [userSearch]);

  // A "Správa" click in the Users tab lands here with the target user
  // stashed — open her thread even if she never messaged first.
  React.useEffect(() => {
    try {
      const uid = sessionStorage.getItem('neome_admin_msg_user');
      if (uid) {
        sessionStorage.removeItem('neome_admin_msg_user');
        setSelectedUserId(uid);
      }
    } catch { /* ignore */ }
  }, [setSelectedUserId]);

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
          <div />
          {totalUnread > 0 && (
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: 'rgba(193,133,106,0.15)', color: _A.TERRA }}>{totalUnread} new</span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14, height: 600 }}>
        {/* Conversation list */}
        <div style={{ background: _A.CARD, borderRadius: 16, border: `1px solid ${_A.HAIR}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${_A.HAIR}`, fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>Conversations</div>
          {/* User search — opens a thread with anyone */}
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${_A.HAIR}`, position: 'relative' }}>
            <input
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Nájsť používateľku (e-mail alebo meno)…"
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: 10, border: `1px solid ${_A.HAIR}`, fontFamily: 'DM Sans, system-ui', fontSize: 12, outline: 'none', background: '#fff', color: _A.DEEP }}
            />
            {searchHits.length > 0 && (
              <div style={{ position: 'absolute', left: 14, right: 14, top: '100%', zIndex: 30, background: '#fff', border: `1px solid ${_A.HAIR}`, borderRadius: 10, boxShadow: '0 8px 24px rgba(31,35,40,0.12)', overflow: 'hidden' }}>
                {searchHits.map(h => (
                  <button
                    key={h.id}
                    onClick={() => { setSelectedUserId(h.id); setUserSearch(''); setSearchHits([]); }}
                    style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', padding: '9px 12px', borderBottom: `1px solid ${_A.HAIR}`, boxSizing: 'border-box' }}
                  >
                    <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 500, color: _A.DEEP }}>{h.full_name || h.email || h.id.slice(0, 8)}</div>
                    {h.email && h.full_name && <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED }}>{h.email}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 14px', borderBottom: `1px solid ${_A.HAIR}`, flexWrap: 'wrap' }}>
            {([
              { id: 'all', label: 'All' },
              { id: 'gabi', label: 'Gabi' },
              { id: 'admin', label: 'Admin' },
              { id: 'unassigned', label: 'Unassigned' },
            ] as const).map(p => {
              const active = filter === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setFilter(p.id)}
                  style={{
                    all: 'unset', cursor: 'pointer',
                    fontFamily: 'DM Sans, system-ui', fontSize: 10, fontWeight: 600,
                    padding: '4px 10px', borderRadius: 999,
                    background: active ? _A.DEEP : 'transparent',
                    color: active ? '#fff' : _A.MUTED,
                    border: `1px solid ${active ? _A.DEEP : _A.HAIR}`,
                  }}
                >{p.label}</button>
              );
            })}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <p style={{ padding: 16, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Loading…</p>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <MessageSquare style={{ width: 28, height: 28, color: _A.MUTED, margin: '0 auto 8px' }} />
                <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>{filter === 'all' ? 'No messages yet' : 'No conversations match this filter'}</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
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
                      {conv.assigned_to && (
                        <span style={{
                          display: 'inline-block', marginTop: 4,
                          fontFamily: 'DM Sans, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '2px 7px', borderRadius: 999,
                          background: conv.assigned_to === 'gabi' ? 'rgba(193,122,110,0.15)' : 'rgba(184,134,74,0.15)',
                          color: conv.assigned_to === 'gabi' ? _A.TERRA : _A.GOLD,
                        }}>{conv.assigned_to === 'gabi' ? 'Gabi' : 'Admin'}</span>
                      )}
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
                <span style={{ flex: 1, fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>
                  {displayName(selectedUserId)}
                </span>
                {/* Assignment dropdown */}
                <label style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: _A.EYEBROW, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Assign</label>
                <select
                  value={selectedConv?.assigned_to ?? ''}
                  onChange={e => setAssignment(selectedUserId, (e.target.value || null) as 'gabi' | 'admin' | null)}
                  style={{
                    fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, color: _A.DEEP,
                    padding: '4px 10px', borderRadius: 8, border: `1px solid ${_A.HAIR}`,
                    background: _A.CARD, cursor: 'pointer',
                  }}
                >
                  <option value="">Unassigned</option>
                  <option value="gabi">Gabi</option>
                  <option value="admin">Admin</option>
                </select>
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
  if (!data || data.length === 0) {
    // RLS matched nothing — without this check the UI reports success
    // while the database is untouched (e.g. stale admin JWT).
    throw new Error('Uloženie neprešlo — žiadny riadok nezmenený (skús sa odhlásiť a prihlásiť).');
  }
  return data?.[0];
}
async function adminDelete(type: string, id: string) {
  const { data, error } = await supabase.from(TABLES[type]).delete().eq('id', id).select('id');
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error('Zmazanie neprešlo — žiadny riadok nezmazaný (chýbajúce oprávnenie alebo neexistujúci záznam).');
  }
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



function BusinessMetrics() {
  const [m, setM] = useState<any | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/.netlify/functions/admin-metrics', {
          headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        });
        if (res.ok) setM(await res.json()); else setErr(true);
      } catch { setErr(true); }
    })();
  }, []);

  if (err) return null;
  const eur = (c: number) => `${(c / 100).toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  const fmtD = (iso: string) => new Date(iso).toLocaleDateString('sk-SK');
  const tile = (label: string, value: string, sub?: string) => (
    <div key={label} style={{ flex: '1 1 150px', background: '#fff', border: `1px solid ${_A.HAIR}`, borderRadius: 14, padding: '14px 16px' }}>
      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 21, color: _A.DEEP, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10.5, color: _A.MUTED, marginTop: 3 }}>{sub}</div>}
    </div>
  );

  if (!m) return null;
  const r = m.revenue; const e = m.engagement; const subs = m.subscriptions;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
      <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500 }}>Biznis</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {tile('Minulý týždeň', eur(r.last_week))}
        {tile('Tento týždeň', eur(r.this_week), 'zatiaľ')}
        {tile('Tento mesiac', eur(r.month_to_date), 'month-to-date')}
        {tile('Očakávané · 30 dní', eur(r.expected_30d), 'obnovy aktívnych predplatných')}
        {tile('Tento rok', eur(r.year_to_date), 'year-to-date')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
        <AdminCard>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 600, color: _A.DEEP, marginBottom: 8 }}>Ročné tržby podľa produktu</div>
          {Object.entries(r.by_plan_ytd as Record<string, number>).sort((a, b) => b[1] - a[1]).map(([plan, cents]) => (
            <div key={plan} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: `1px solid ${_A.HAIR}`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>
              <span>{plan}</span><span style={{ color: _A.DEEP, fontVariantNumeric: 'tabular-nums' }}>{eur(cents as number)}</span>
            </div>
          ))}
          {Object.keys(r.by_plan_ytd).length === 0 && <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Zatiaľ žiadne platby.</div>}
        </AdminCard>

        <AdminCard>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, fontWeight: 600, color: _A.DEEP, marginBottom: 8 }}>Predplatné · aktívnych {subs.active}</div>
          {(subs.upcoming_7d ?? []).map((u: any, i: number) => (
            <div key={`u${i}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: `1px solid ${_A.HAIR}`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>
              <span>obnova · {u.email}</span><span style={{ color: _A.SAGE }}>{fmtD(u.renews)} · {eur(u.cents)}</span>
            </div>
          ))}
          {(subs.expiring ?? []).map((x: any, i: number) => (
            <div key={`x${i}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: `1px solid ${_A.HAIR}`, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>
              <span>končí · {x.email}</span><span style={{ color: _A.TERRA }}>{fmtD(x.ends)}</span>
            </div>
          ))}
          {(subs.upcoming_7d ?? []).length === 0 && (subs.expiring ?? []).length === 0 && (
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Najbližších 7 dní žiadne obnovy ani konce.</div>
          )}
        </AdminCard>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {tile('Príspevky', `${e.posts.week ?? '—'}`, `za 7 dní · spolu ${e.posts.total ?? '—'}`)}
        {tile('Komentáre', `${e.comments.week ?? '—'}`, `za 7 dní · spolu ${e.comments.total ?? '—'}`)}
        {tile('Likes', `${e.likes.week ?? '—'}`, `za 7 dní · spolu ${e.likes.total ?? '—'}`)}
        {tile('Odporúčania', `${e.referrals.week ?? 0}`, `za 7 dní · spolu ${e.referrals.total ?? 0} · platiacich ${e.referrals.paying}`)}
      </div>
    </div>
  );
}

function AdminTodo({ goTab }: { goTab: (id: string) => void }) {
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/.netlify/functions/admin-todo', {
          headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        });
        if (res.ok) setData(await res.json());
      } catch { /* panel is best-effort */ }
    })();
  }, []);

  if (!data) return null;
  const eurc = (c: number) => `${(c / 100).toFixed(2)} €`;
  const fmtD = (iso: string) => new Date(iso).toLocaleDateString('sk-SK');
  const actionCount =
    (data.payouts?.length ?? 0) + (data.ripe_candidates?.length ?? 0) +
    (data.unread_messages?.length ?? 0) + (data.reported_content?.length ?? 0) +
    (data.declined_payments?.length ?? 0) + (data.unconfirmed_signups?.length ?? 0) +
    (data.reversals?.length ?? 0) + ((data.new_posts ?? 0) > 0 ? 1 : 0) +
    (data.cancellations?.length ?? 0);

  const row = (key: string, onClick: (() => void) | null, main: string, sub: string, urgent: boolean) => (
    <div key={key} onClick={onClick ?? undefined} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: `1px solid ${_A.HAIR}`, cursor: onClick ? 'pointer' : 'default' }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: urgent ? _A.TERRA : _A.GOLD, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: _A.DEEP }}>{main}</div>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.MUTED }}>{sub}</div>
      </div>
      {onClick && <ChevronRight style={{ width: 14, height: 14, color: _A.MUTED, flexShrink: 0 }} />}
    </div>
  );

  return (
    <AdminCard className="mb-5">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 600, color: _A.DEEP }}>Čaká na teba</div>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: actionCount ? _A.TERRA : _A.MUTED, fontWeight: 600 }}>
          {actionCount ? `${actionCount} ${actionCount === 1 ? 'položka' : actionCount <= 4 ? 'položky' : 'položiek'}` : 'všetko vybavené ✓'}
        </div>
      </div>
      {(data.payouts ?? []).map((pp: any) =>
        row(`po-${pp.id}`, () => goTab('affiliates'), `Vyplatiť ${eurc(pp.amount_cents)} — ${pp.email}`, `žiadosť z ${fmtD(pp.requested_at)}`, true))}
      {(data.reported_content ?? []).map((rc: any) =>
        row(`rep-${rc.post_id}`, () => goTab('community'), `Nahlásený príspevok (${rc.count}× nahlásenie)`, 'posúď a prípadne skry v moderácii', true))}
      {(data.ripe_candidates ?? []).map((c: any) =>
        row(`rc-${c.email}`, () => goTab('referrers'), `Schváliť ako affiliate: ${c.email}`, `${c.paying} platiacich odporúčaní — splnila podmienky`, true))}
      {(data.unread_messages ?? []).map((m: any) =>
        row(`um-${m.email}`, () => goTab('messages'), `Neprečítané správy: ${m.email}`, `${m.unread} ${m.unread === 1 ? 'správa' : 'správy'}`, true))}
      {(data.declined_payments ?? []).map((d: any) =>
        row(`dp-${d.email}`, () => goTab('users'), `Zamietnutá platba: ${d.email}`, `obnova predplatného zlyhala ${fmtD(d.at)} — hrozí strata prístupu, zváž e-mail`, true))}
      {(data.reversals ?? []).map((rv: any) =>
        row(`rev-${rv.email}`, () => goTab('affiliates'), `Stornovaná provízia ${eurc(rv.amount_cents)} — ${rv.email}`, `refundácia/spor ${fmtD(rv.at)} — over, či nebola už vyplatená`, true))}
      {(data.unconfirmed_signups ?? []).map((u: any) =>
        row(`uc-${u.email}`, () => goTab('users'), `Nepotvrdený e-mail: ${u.email}`, `registrácia ${fmtD(u.created_at)} — pošli magic link alebo potvrď ručne`, false))}
      {(data.cancellations ?? []).map((cn: any) =>
        row(`cn-${cn.email}`, () => goTab('users'), `Zrušila predplatné: ${cn.email}`, `prístup končí ${cn.ends ? fmtD(cn.ends) : 'na konci obdobia'} — priestor na záchranný e-mail`, false))}
      {(data.new_posts ?? 0) > 0 &&
        row('np', () => goTab('community'), `Nové príspevky v komunite: ${data.new_posts}`, 'za posledných 48 h — rýchla kontrola obsahu', false)}
    </AdminCard>
  );
}

function AffiliatesTab({ mode }: { mode: 'partners' | 'candidates' }) {
  const partnersMode = mode === 'partners';
  const [rows, setRows] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grantEmail, setGrantEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const call = async (init?: RequestInit) => {
    const { data: { session } } = await supabase.auth.getSession();
    return fetch('/.netlify/functions/admin-affiliates', {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await call();
      if (!res.ok) throw new Error((await res.json()).error ?? 'load failed');
      const data = await res.json();
      setRows(data.affiliates ?? []);
      setPayouts(data.payouts ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const act = async (body: any, okMsg: string) => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await call({ method: 'POST', body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) setMsg(data.error ?? 'Akcia zlyhala');
      else { setMsg(okMsg); await load(); }
    } catch {
      setMsg('Akcia zlyhala');
    } finally {
      setBusy(false);
    }
  };

  const eurc = (c: number) => `${(c / 100).toFixed(2)} €`;
  const inputS: React.CSSProperties = { padding: '8px 12px', borderRadius: 10, border: `1px solid ${_A.HAIR}`, fontFamily: 'DM Sans, system-ui', fontSize: 13, outline: 'none', background: '#fff' };
  const btnS = (danger = false): React.CSSProperties => ({ all: 'unset', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, background: danger ? 'rgba(194,122,110,0.12)' : _A.DEEP, color: danger ? '#B4584A' : '#fff', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500 });

  const pendingPayouts = payouts.filter((pp) => pp.status === 'requested');

  const shown = rows.filter((r) => (partnersMode ? r.status !== 'candidate' : r.status === 'candidate'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {partnersMode && (
      <AdminCard>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 600, color: _A.DEEP, marginBottom: 10 }}>Pridať partnera</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} placeholder="email existujúceho používateľa" style={{ ...inputS, flex: 1, minWidth: 240 }} />
          <button disabled={busy} onClick={() => act({ action: 'grant', email: grantEmail.trim() }, 'Partner pridaný — kód si vyberie v aplikácii (Profil → Partnerský program).')} style={btnS()}>Pridať</button>
        </div>
        {msg && <div style={{ marginTop: 8, fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>{msg}</div>}
      </AdminCard>
      )}
      {!partnersMode && msg && (
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>{msg}</div>
      )}

      {partnersMode && pendingPayouts.length > 0 && (
        <AdminCard>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 600, color: _A.DEEP, marginBottom: 10 }}>Žiadosti o vyplatenie ({pendingPayouts.length})</div>
          {pendingPayouts.map((pp) => {
            const aff = rows.find((r) => r.user_id === pp.affiliate_user_id);
            return (
              <div key={pp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: `1px solid ${_A.HAIR}`, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 220, fontFamily: 'DM Sans, system-ui', fontSize: 13, color: _A.DEEP }}>
                  <b>{aff?.email ?? pp.affiliate_user_id}</b> · {eurc(pp.amount_cents)}
                  <div style={{ fontSize: 11.5, color: _A.MUTED, marginTop: 2 }}>{new Date(pp.requested_at).toLocaleDateString('sk-SK')} · {pp.payment_detail}</div>
                </div>
                <button disabled={busy} onClick={() => act({ action: 'payout_paid', payoutId: pp.id }, 'Označené ako vyplatené.')} style={btnS()}>Vyplatené ✓</button>
                <button disabled={busy} onClick={() => act({ action: 'payout_rejected', payoutId: pp.id }, 'Žiadosť zamietnutá — suma sa vrátila medzi dostupné.')} style={btnS(true)}>Zamietnuť</button>
              </div>
            );
          })}
        </AdminCard>
      )}

      <AdminCard>
        <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 600, color: _A.DEEP, marginBottom: 10 }}>
          {partnersMode ? `Partnerky (${shown.length})` : `Kandidátky — odporúčajú za body (${shown.length})`}
        </div>
        {!partnersMode && (
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED, marginBottom: 8 }}>
            Každá používateľka s odporúčacím odkazom. Za platiace kamarátky zbiera body (+150). Po 5 platiacich ju schváliš ako affiliate — presunie sa do záložky Affiliates a začne zarábať provízie.
          </div>
        )}
        {loading ? (
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: _A.MUTED }}>Načítavam…</div>
        ) : error ? (
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: '#B4584A' }}>{error} — spustil si už affiliates.sql?</div>
        ) : shown.length === 0 ? (
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: _A.MUTED }}>{partnersMode ? 'Zatiaľ žiadne partnerky.' : 'Zatiaľ žiadne kandidátky.'}</div>
        ) : shown.map((r) => (
          <div key={r.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: `1px solid ${_A.HAIR}`, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, fontWeight: 600, color: _A.DEEP }}>{r.email ?? r.user_id}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED, marginTop: 2 }}>
                kód: <b>{r.code ?? '— ešte nevybraný'}</b> · {r.referral_count} odporúčaní · {r.status === 'active' ? 'aktívny partner' : r.status === 'candidate' ? `kandidátka (${r.paying_referrals ?? 0} z 5 platiacich)` : 'pozastavený'}
              </div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED, marginTop: 2 }}>
                k vyplateniu {eurc(r.totals.available)} · čaká 30 dní {eurc(r.totals.pending)} · v spracovaní {eurc(r.totals.requested)} · vyplatené {eurc(r.totals.paid)}
              </div>
              {(r.referral_list ?? []).length > 0 && (
                <div style={{ marginTop: 6, paddingLeft: 10, borderLeft: `2px solid ${_A.HAIR}` }}>
                  {(r.referral_list ?? []).map((ru: any, i: number) => (
                    <div key={i} style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.MUTED, padding: '2px 0' }}>
                      {ru.email} · od {new Date(ru.joined).toLocaleDateString('sk-SK')} · {ru.paid ? (ru.earned_cents > 0 ? `platí (provízie ${eurc(ru.earned_cents)})` : 'platí ✓') : 'zatiaľ neplatí'}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {partnersMode && (
            <label style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED, display: 'flex', alignItems: 'center', gap: 6 }}>
              provízia
              <input
                type="number" min={0} max={100} defaultValue={r.commission_pct}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v) && v !== r.commission_pct) act({ action: 'set_rate', userId: r.user_id, commission_pct: v }, 'Provízia upravená.');
                }}
                style={{ ...inputS, width: 64, padding: '6px 8px' }}
              /> %
            </label>
            )}
            {r.status === 'candidate' && (
              <button
                disabled={busy}
                onClick={() => act({ action: 'set_status', userId: r.user_id, status: 'active' }, 'Schválená ako affiliate — presunula sa do záložky Affiliates a od teraz zarába provízie namiesto bodov.')}
                style={btnS()}
              >
                Schváliť ako affiliate
              </button>
            )}
            <button
              disabled={busy}
              onClick={() => act({ action: 'set_status', userId: r.user_id, status: r.status === 'disabled' ? 'active' : 'disabled' }, 'Stav zmenený.')}
              style={btnS(r.status !== 'disabled')}
            >
              {r.status === 'disabled' ? 'Aktivovať' : 'Pozastaviť'}
            </button>
          </div>
        ))}
      </AdminCard>
    </div>
  );
}

const AdminCard = ({ children, className = '', title }: { children: React.ReactNode; className?: string; title?: string }) => (
  <div className={className} style={{ background: '#FFFFFF', borderRadius: 16, border: `1px solid rgba(61,41,33,0.08)`, padding: '22px 24px' }}>{children}</div>
);

// ═══════════════════════════════════════════
// RECIPES TAB — recipe library (public.recipes, 20260507 schema)
// ═══════════════════════════════════════════
//
// The library is service-role-write-only (curated content, seeded by the
// recipe-import pipeline), so ALL reads+writes go through the gated
// admin-content Netlify fn — a direct client write silently no-ops.
interface RecipeIngredient { raw: string; name: string; grams: number | null }
interface RecipeLibRow {
  id: string;
  name: string;
  slot: 'ranajky' | 'hlavne' | 'snack';
  prep_minutes: number | null;
  instructions: string | null;
  ingredients: RecipeIngredient[];
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
  active: boolean;
}

const RECIPE_SLOTS: { key: RecipeLibRow['slot']; label: string }[] = [
  { key: 'ranajky', label: 'Raňajky' },
  { key: 'hlavne', label: 'Hlavné jedlá' },
  { key: 'snack', label: 'Snacky' },
];

/** ingredients jsonb ⇆ editable lines: "názov | gramy" */
function ingredientsToText(ings: RecipeIngredient[]): string {
  return (ings ?? []).map((i) => `${i.name} | ${i.grams ?? ''}`).join('\n');
}
function textToIngredients(text: string): RecipeIngredient[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [name, gramsRaw] = l.split('|').map((x) => x.trim());
      const grams = gramsRaw ? parseFloat(gramsRaw.replace(',', '.')) : NaN;
      const g = Number.isFinite(grams) ? grams : null;
      return { name: name ?? l, grams: g, raw: g != null ? `${name} (${g} g)` : (name ?? l) };
    });
}

async function recipeApi(action: 'upsert' | 'delete', payload: Record<string, unknown>) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/.netlify/functions/admin-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ type: 'recipes', action, ...payload }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Server error');
  return body;
}

function RecipesTab() {
  const [items, setItems] = useState<RecipeLibRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slotFilter, setSlotFilter] = useState<'all' | RecipeLibRow['slot']>('all');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<RecipeLibRow>>({ slot: 'ranajky', active: true });
  const [ingText, setIngText] = useState('');

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/.netlify/functions/admin-content?type=recipes', {
        headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to load');
      setItems((body.items ?? []) as RecipeLibRow[]);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ slot: 'ranajky', active: true });
    setIngText('');
    setEditId(null); setShowForm(true); setSaveError(null);
  };
  const openEdit = (r: RecipeLibRow) => {
    setForm({ ...r });
    setIngText(ingredientsToText(r.ingredients ?? []));
    setEditId(r.id); setShowForm(true); setSaveError(null);
  };
  const closeForm = () => { setShowForm(false); setSaveError(null); };

  const save = async () => {
    if (!form.name?.trim()) { setSaveError('Názov je povinný'); return; }
    setSaving(true); setSaveError(null);
    try {
      const data: Record<string, unknown> = {
        ...(editId ? { id: editId } : {}),
        name: form.name.trim(),
        slot: form.slot ?? 'ranajky',
        prep_minutes: form.prep_minutes ?? null,
        instructions: form.instructions ?? null,
        ingredients: textToIngredients(ingText),
        kcal: form.kcal ?? null,
        protein: form.protein ?? null,
        carbs: form.carbs ?? null,
        fat: form.fat ?? null,
        fiber: form.fiber ?? null,
        active: form.active ?? true,
      };
      await recipeApi('upsert', { data });
      closeForm();
      await load();
    } catch (e: any) { setSaveError(e.message); }
    setSaving(false);
  };

  const remove = async (r: RecipeLibRow) => {
    if (!window.confirm(`Zmazať recept „${r.name}"? Táto akcia je nevratná.`)) return;
    try {
      await recipeApi('delete', { id: r.id });
      setItems((prev) => prev.filter((x) => x.id !== r.id));
    } catch (e: any) { alert('Chyba pri mazaní: ' + e.message); }
  };

  const toggleActive = async (r: RecipeLibRow) => {
    try {
      await recipeApi('upsert', { data: { ...r, active: !r.active } });
      setItems((prev) => prev.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)));
    } catch (e: any) { alert('Chyba: ' + e.message); }
  };

  const filtered = items.filter((r) => {
    if (slotFilter !== 'all' && r.slot !== slotFilter) return false;
    if (query.trim() && !r.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const num = (v: number | null | undefined) => (v == null ? '' : String(v));
  const setNum = (key: keyof RecipeLibRow) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    setForm((f) => ({ ...f, [key]: v === '' ? null : parseFloat(v.replace(',', '.')) }));
  };

  const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(61,41,33,0.14)', fontFamily: 'DM Sans, system-ui', fontSize: 13, color: _A.DEEP, background: '#fff' };
  const labelStyle: React.CSSProperties = { fontFamily: 'DM Sans, system-ui', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: _A.EYEBROW, fontWeight: 500, marginBottom: 6, display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div />
        <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 14, height: 14 }} />Nový recept
        </button>
      </div>

      {error && (
        <AdminCard>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#B4533E', marginBottom: 10 }}>{error}</div>
          <button onClick={load} style={btnSecondary}>Skúsiť znova</button>
        </AdminCard>
      )}

      {showForm && (
        <AdminCard>
          <div style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 17, color: _A.DEEP, marginBottom: 16 }}>
            {editId ? 'Upraviť recept' : 'Nový recept'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Názov *</label>
              <input style={inputStyle} value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Kategória</label>
              <select style={inputStyle} value={form.slot ?? 'ranajky'} onChange={(e) => setForm((f) => ({ ...f, slot: e.target.value as RecipeLibRow['slot'] }))}>
                {RECIPE_SLOTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Príprava (min)</label>
              <input style={inputStyle} inputMode="numeric" value={num(form.prep_minutes)} onChange={setNum('prep_minutes')} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Postup prípravy</label>
            <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.instructions ?? ''} onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Suroviny — jeden riadok = „názov | gramy" (napr. „jogurt biely | 360")</label>
            <textarea style={{ ...inputStyle, minHeight: 110, resize: 'vertical', fontFamily: 'ui-monospace, monospace', fontSize: 12 }} value={ingText} onChange={(e) => setIngText(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 14 }}>
            {([['kcal', 'Kcal'], ['protein', 'Bielkoviny (g)'], ['carbs', 'Sacharidy (g)'], ['fat', 'Tuky (g)'], ['fiber', 'Vláknina (g)']] as const).map(([key, label]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input style={inputStyle} inputMode="decimal" value={num(form[key] as number | null)} onChange={setNum(key)} />
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginBottom: 14 }}>
            Pozn.: makrá sa pri úprave surovín neprepočítavajú automaticky — uprav ich ručne, alebo nechaj pôvodné hodnoty.
          </div>
          {saveError && <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12.5, color: '#B4533E', marginBottom: 12 }}>{saveError}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} disabled={saving} style={btnPrimary}>{saving ? 'Ukladám…' : 'Uložiť'}</button>
            <button onClick={closeForm} style={btnSecondary}>Zrušiť</button>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
          <input
            style={{ ...inputStyle, maxWidth: 260 }}
            placeholder="Hľadať recept…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {(['all', 'ranajky', 'hlavne', 'snack'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSlotFilter(k)}
              style={{
                ...btnSecondary,
                padding: '7px 13px',
                background: slotFilter === k ? _A.DEEP : 'transparent',
                color: slotFilter === k ? '#fff' : _A.DEEP,
              }}
            >
              {k === 'all' ? `Všetko (${items.length})` : RECIPE_SLOTS.find((s) => s.key === k)?.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Načítavam…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'DM Sans, system-ui', fontSize: 12, color: _A.MUTED }}>Žiadne recepty.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(61,41,33,0.06)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13.5, fontWeight: 500, color: _A.DEEP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.name}
                  </div>
                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: _A.MUTED, marginTop: 2 }}>
                    {RECIPE_SLOTS.find((s) => s.key === r.slot)?.label ?? r.slot}
                    {r.kcal != null ? ` · ${r.kcal} kcal` : ''}
                    {r.prep_minutes != null ? ` · ${r.prep_minutes} min` : ''}
                    {` · ${(r.ingredients ?? []).length} surovín`}
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(r)}
                  title={r.active ? 'Skryť z appky' : 'Zobraziť v appke'}
                  style={{ ...btnSecondary, padding: '5px 10px', fontSize: 10.5, color: r.active ? '#4E6B4C' : '#B4533E' }}
                >
                  {r.active ? 'Aktívny' : 'Skrytý'}
                </button>
                <button onClick={() => openEdit(r)} style={{ ...btnSecondary, padding: '5px 10px', fontSize: 10.5 }}>Upraviť</button>
                <button onClick={() => remove(r)} style={{ ...btnSecondary, padding: '5px 10px', fontSize: 10.5, color: '#B4533E' }}>Zmazať</button>
              </div>
            ))}
          </div>
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
    const isExercise = (form.content_type ?? 'exercise') === 'exercise';
    // Neither type needs a name — the app generates "Core & brucho č. X" /
    // "Vršok & stred tela č. X" from the taxonomy; the DB name is only an
    // admin-facing fallback.
    setSaving(true); setError(null);
    try {
      const status = form.status ?? 'draft';
      const payload: ExerciseRow = {
        id: editId ?? `${form.content_type}-${Date.now()}`,
        content_type: form.content_type ?? 'exercise',
        name: form.name || form.body || 'Cvičenie',
        duration: form.duration ?? '15 min',
        // Category follows the duration band — no separate input needed.
        category: (form.duration ?? '15 min') === '5 min'
          ? (isExercise ? 'dopalovacka' : 'quickstretch')
          : '15min',
        body: form.body ?? 'Celé telo',
        equip: form.equip ?? 'Bez pomôcok',
        level: form.level ?? null,
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
      // Retire the old demo rows first (everything that isn't the real
      // cv-* exercise / cvs-* stretch catalog) so fakes don't mix into
      // the library, then upsert the recorded catalog. Idempotent.
      const { error: archErr } = await supabase
        .from('exercises')
        .update({ status: 'archived', active: false })
        .not('id', 'like', 'cv-%')
        .not('id', 'like', 'cvs-%');
      if (archErr) throw new Error(archErr.message);
      // NB: PostgREST unifies columns across the whole batch — every row
      // must carry the same keys, or the missing ones are sent as NULL
      // (which violates the NOT NULL status column).
      const payload = [
        ...TeloExtraStaticData.map((e: any) => ({ ...e, content_type: 'exercise', status: 'published', active: true })),
        ...TeloStrecingStaticData.map((s: any) => ({ ...s, content_type: 'stretch', status: 'published', active: true })),
      ];
      const count = await adminSeed('exercises', payload);
      alert(`✅ Importovaných ${count} cvičení — staré demo záznamy zarchivované`);
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
        <div />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={seedFromStatic} disabled={seeding} style={btnSecondary}>
            {seeding ? 'Importujem…' : `Import katalógu (${TeloExtraStaticData.length + TeloStrecingStaticData.length})`}
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
              <label style={labelStyle}>Interný názov (voliteľné)</label>
              <input
                value={form.name ?? ''}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={form.content_type === 'exercise' ? 'V appke sa zobrazí napr. „Core & brucho č. 3“' : 'V appke sa zobrazí napr. „Vršok & stred tela č. 2“'}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Dĺžka</label>
              <select value={form.duration ?? '15 min'} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={inputStyle}>
                <option value="5 min">5 min</option>
                <option value="15 min">15 min</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Zameranie</label>
              {form.content_type === 'exercise' ? (
                <select value={form.body ?? 'Celé telo'} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} style={inputStyle}>
                  <option value="Celé telo">Celé Telo</option>
                  <option value="Core/Abs">Core</option>
                  <option value="Nohy/Zadok">Nohy & Zadok</option>
                </select>
              ) : (
                <select value={form.body ?? 'Celé telo'} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} style={inputStyle}>
                  <option value="Celé telo">Celé Telo</option>
                  <option value="Vršok/Stred tela">Vršok & Stred Tela</option>
                  <option value="Dolná časť tela">Dolná Časť Tela</option>
                </select>
              )}
            </div>
            <div>
              <label style={labelStyle}>Pomôcky</label>
              <select value={form.equip ?? 'Bez pomôcok'} onChange={e => setForm(f => ({ ...f, equip: e.target.value }))} style={inputStyle}>
                <option>Bez pomôcok</option>
                <option value="S gumou">S gumami</option>
                <option>S činkami</option>
                <option>S pilates loptou</option>
              </select>
            </div>
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
              <label style={labelStyle}>Video URL (Vimeo alebo YouTube)</label>
              <input value={form.video_url ?? ''} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="Bunny ID / vimeo.com/… — dá sa doplniť aj neskôr" style={inputStyle} />
              {(() => {
                // Same detection the app player uses — instant feedback that
                // the pasted link will actually play.
                const v = (form.video_url ?? '').trim();
                if (!v) return null;
                const bunny = v.match(/(?:mediadelivery\.net\/(?:embed|play)\/\d+\/|video\.bunnycdn\.com\/play\/\d+\/)?([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/)?.[1] ?? null;
                if (bunny) return (
                  <div style={{ marginTop: 6, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.SAGE }}>
                    ✓ Bunny Stream · {bunny.toLowerCase()} — ulož ako samotné ID (appka podpíše prehrávanie tokenom)
                  </div>
                );
                const vimeo = v.match(/vimeo\.com\/(\d+)/)?.[1] ?? (/^\d+$/.test(v) ? v : null);
                const yt = v.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)?.[1]
                  ?? (/^[\w-]{11}$/.test(v) && !/^\d+$/.test(v) ? v : null);
                if (vimeo) return (
                  <div style={{ marginTop: 6, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.SAGE }}>
                    ✓ Vimeo · ID {vimeo} · <a href={`https://vimeo.com/${vimeo}`} target="_blank" rel="noreferrer" style={{ color: _A.SAGE }}>otvoriť video</a>
                  </div>
                );
                if (yt) return (
                  <div style={{ marginTop: 6, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.SAGE }}>
                    ✓ YouTube · ID {yt} · <a href={`https://youtu.be/${yt}`} target="_blank" rel="noreferrer" style={{ color: _A.SAGE }}>otvoriť video</a>
                  </div>
                );
                return (
                  <div style={{ marginTop: 6, fontFamily: 'DM Sans, system-ui', fontSize: 11.5, color: _A.TERRA }}>
                    ⚠ Toto nevyzerá ako Vimeo ani YouTube link — appka ho neprehrá.
                  </div>
                );
              })()}
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
                      {r.video_url
                        ? <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: 'rgba(139,158,136,0.15)', color: _A.SAGE }}>▶ video</span>
                        : <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: 'rgba(184,134,74,0.15)', color: _A.GOLD }}>bez videa</span>}
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
        { id: 'med-1', category: 'Pre mamičky', title: 'Nájdenie vnútorného pokoja uprostred chaosu', duration: '5 min', description: 'Naučte sa nájsť pokojné miesto vo svojej mysli aj v najrušnejších dňoch', audio_url: '/audio/inner-peace-chaos.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-2', category: 'Pre mamičky', title: 'Učenie sa byť prítomná pri každodenných úlohách', duration: '5 min', description: 'Transformujte bežné činnosti na príležitosti pre mindfulness', audio_url: '/audio/present-daily-tasks.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-3', category: 'Pre mamičky', title: 'Objavovanie trpezlivosti vo výchovnom procese', duration: '5 min', description: 'Kultivujte trpezlivosť a porozumenie v náročných výchovných momentoch', audio_url: '/audio/patience-parenting.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-4', category: 'Pre mamičky', title: 'Nájdenie radosti v malých veciach', duration: '5 min', description: 'Objavte krásu v jednoduchých, každodenných momentoch', audio_url: '/audio/joy-small-things.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-5', category: 'Pre mamičky', title: 'Udržiavanie emocionálnej rovnováhy', duration: '5 min', description: 'Technika na stabilizovanie emócií a nájdenie vnútornej harmónie', audio_url: '/audio/emotional-balance.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-6', category: 'Pre mamičky', title: 'Vytváranie času pre seba', duration: '5 min', description: 'Naučte sa prioritizovať svoju pohodu a vytvoriť priestor pre seba', audio_url: '/audio/time-for-self.mp3', image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-7', category: 'Pre mamičky', title: 'Posilňovanie väzby s dieťaťom', duration: '5 min', description: 'Meditácia zameraná na prehĺbenie lásky a spojenia s vaším dieťaťom', audio_url: '/audio/bond-with-child.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-8', category: 'Pre mamičky', title: 'Prijímanie nepredvídateľnosti materstva', duration: '5 min', description: 'Naučte sa flexibilne reagovať na neočakávané situácie v materstve', audio_url: '/audio/accept-unpredictability.mp3', image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-9', category: 'Pre mamičky', title: 'Naučiť sa odpúšťať sebe a iným', duration: '5 min', description: 'Oslobodenie sa od viny a rozhorčenia cez praktiku odpúštania', audio_url: '/audio/forgiveness-practice.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-10', category: 'Pre mamičky', title: 'Rozvíjanie empatie a porozumenia', duration: '5 min', description: 'Prehĺbenie schopnosti porozumieť sebe aj ostatným s láskavosťou', audio_url: '/audio/empathy-understanding.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-11', category: 'Pre ženy', title: 'Prekonávanie stresu a úzkosti', duration: '5 min', description: 'Efektívne techniky na zvládanie stresu a upokojenie anxióznych myšlienok', audio_url: '/audio/overcome-stress-anxiety.mp3', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-12', category: 'Pre ženy', title: 'Budovanie sebadôvery a sebaúcty', duration: '5 min', description: 'Posilnenie vnútornej sily a pozitívneho vzťahu k sebe', audio_url: '/audio/self-confidence-esteem.mp3', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-13', category: 'Pre ženy', title: 'Nájdenie rovnováhy medzi kariérou a osobným životom', duration: '5 min', description: 'Harmonizácia pracovných a osobných priorít s múdrosťou', audio_url: '/audio/work-life-balance.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-14', category: 'Pre ženy', title: 'Učenie sa hovoriť „nie" bez pocitu viny', duration: '5 min', description: 'Nastavenie zdravých hraníc a sebapéča bez pocitov viny', audio_url: '/audio/saying-no-guilt.mp3', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-15', category: 'Pre ženy', title: 'Rozvíjanie kreativity a hľadanie inšpirácie', duration: '5 min', description: 'Prebudenie tvorivého ducha a otvorenie sa novým možnostiam', audio_url: '/audio/creativity-inspiration.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-16', category: 'Pre ženy', title: 'Zvládanie pocitu osamelosti a izolácie', duration: '5 min', description: 'Nájdenie spojenia a zmyslu aj v momentoch osamelosti', audio_url: '/audio/loneliness-isolation.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
        { id: 'med-17', category: 'Pre ženy', title: 'Udržiavanie pozitívneho myslenia', duration: '5 min', description: 'Kultivovanie optimizmu a vďačnosti v každodennom živote', audio_url: '/audio/positive-thinking.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', featured: false, status: 'published', active: true },
      ];
      // Retire rows outside the canonical med-* set (they stay in admin
      // as 'arch' and can be re-published with one tap).
      const { error: archErr } = await supabase
        .from('meditations')
        .update({ status: 'archived', active: false })
        .not('id', 'like', 'med-%');
      if (archErr) throw new Error(archErr.message);
      const count = await adminSeed('meditations', staticMeds as unknown as Record<string, unknown>[]);
      alert(`✅ Importovaných ${count} meditácií (Pre mamičky 10 · Pre ženy 7) — ostatné zarchivované`);
      await load();
    } catch (e: any) { setError(e.message); }
    setSeeding(false);
  };

  const CATS = ['Pre mamičky', 'Pre ženy'];

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
        <div />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={seedFromStatic} disabled={seeding} style={btnSecondary}>
            {seeding ? 'Importujem...' : 'Import 17 meditácií'}
          </button>
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
      const result = await uploadContentImage(file, 'programs');
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
        <div />
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Seed button intentionally lives only in the empty state below —
              here it sat one misclick away from wiping live programme
              schedules with empty defaults. */}
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
                <button
            onClick={() => {
              // Destructive: overwrites schedule/image/description of the 4
              // live programmes with empty defaults.
              if (window.confirm('POZOR: Seed prepíše rozvrhy, obrázky a popisy všetkých 4 programov prázdnymi hodnotami. Naozaj pokračovať?')) {
                seedFromStatic();
              }
            }}
            disabled={seeding}
            style={btnPrimary}
          >
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
  const [activeTab, setActiveTabState] = useState<string>(() => {
    try { return sessionStorage.getItem('neome_admin_tab') || 'overview'; } catch { return 'overview'; }
  });
  const setActiveTab = (t: string) => {
    setActiveTabState(t);
    try { sessionStorage.setItem('neome_admin_tab', t); } catch { /* ignore */ }
  };
  useEffect(() => {
    const open = () => setActiveTab('messages');
    window.addEventListener('neome:admin-open-messages', open);
    return () => window.removeEventListener('neome:admin-open-messages', open);
  }, []);
  const [myRole, setMyRole] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const jwtRole = (user.app_metadata as Record<string, unknown> | null)?.role;
      if (jwtRole === 'admin' || jwtRole === 'support') { setMyRole(jwtRole as string); return; }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
      setMyRole(data?.role ?? null);
    })();
  }, []);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const unreadMessagesCount = useUnreadAdminMessagesCount();
  const unreviewedPostsCount = useUnreviewedPostsCount();
  const badgeCounts: Record<string, number> = {
    messages: unreadMessagesCount,
    community: unreviewedPostsCount,
  };

  useEffect(() => {
    if (activeTab !== 'overview') return;
    setAnalyticsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) =>
      fetch('/.netlify/functions/admin-get-analytics', {
        headers: { ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
      })
        .then(r => r.json())
        .then(data => { setAnalytics(data); setAnalyticsLoading(false); })
    ).catch(() => setAnalyticsLoading(false));
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
          {navigationItems.filter((item) => myRole === 'admin' || !['affiliates', 'referrers', 'promo-codes', 'partner-discounts'].includes(item.id)).map((item) => {
            const isActive = activeTab === item.id;
            const badge = badgeCounts[item.id] ?? 0;
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
                {badge > 0 && (
                  <span style={{
                    minWidth: 18, height: 18, padding: '0 6px', borderRadius: 999,
                    background: isActive ? A.GOLD : _A.TERRA, color: '#fff',
                    fontFamily: 'DM Sans, system-ui', fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{badge > 99 ? '99+' : badge}</span>
                )}
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
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/admin/login');
          }}
          title="Odhlásiť sa"
          style={{ all: 'unset', cursor: 'pointer', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
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
        <div />
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
        return (<><AdminTodo goTab={setActiveTab} />{myRole === 'admin' && <BusinessMetrics />}{renderOverview()}</>);
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
        return <UsersTab isFullAdmin={myRole === 'admin'} />;
      case 'blog':
        return <BlogPostsTab />;
      case 'partner-discounts':
        return <PartnerDiscountsTab />;
      case 'affiliates':
        return <AffiliatesTab mode="partners" />;
      case 'referrers':
        return <AffiliatesTab mode="candidates" />;
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