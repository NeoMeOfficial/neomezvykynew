import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Clock, XCircle, Euro, Users, Gift, ChevronDown, Copy } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';
import { supabase } from '../../lib/supabase';

interface ReferralRow {
  id: string;
  referrer_email: string;
  referrer_name: string;
  referred_email: string;
  referred_name: string;
  referral_code: string;
  credit_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  created_at: string;
  approved_at: string | null;
}

interface CodeRow {
  id: string;
  user_id: string;
  code: string;
  email: string;
  name: string;
  created_at: string;
  is_active: boolean;
  referral_count: number;
}

const DEMO_REFERRALS: ReferralRow[] = [
  { id: '1', referrer_email: 'katka@email.sk', referrer_name: 'Katka N.', referred_email: 'zuzka@email.sk', referred_name: 'Zuzka M.', referral_code: 'KATKA123', credit_amount: 1400, status: 'approved', created_at: '2026-02-15T10:30:00Z', approved_at: '2026-02-16T14:00:00Z' },
  { id: '2', referrer_email: 'katka@email.sk', referrer_name: 'Katka N.', referred_email: 'petra@email.sk', referred_name: 'Petra K.', referral_code: 'KATKA123', credit_amount: 1400, status: 'approved', created_at: '2026-02-18T09:15:00Z', approved_at: '2026-02-19T11:00:00Z' },
  { id: '3', referrer_email: 'jana@email.sk', referrer_name: 'Jana V.', referred_email: 'maria@email.sk', referred_name: 'Mária D.', referral_code: 'JANA5678', credit_amount: 1400, status: 'pending', created_at: '2026-02-25T16:45:00Z', approved_at: null },
  { id: '4', referrer_email: 'katka@email.sk', referrer_name: 'Katka N.', referred_email: 'lucia@email.sk', referred_name: 'Lucia B.', referral_code: 'KATKA123', credit_amount: 1400, status: 'pending', created_at: '2026-02-27T08:20:00Z', approved_at: null },
  { id: '5', referrer_email: 'eva@email.sk', referrer_name: 'Eva S.', referred_email: 'nina@email.sk', referred_name: 'Nina R.', referral_code: 'EVAS9012', credit_amount: 1400, status: 'cancelled', created_at: '2026-02-20T12:00:00Z', approved_at: null },
  { id: '6', referrer_email: 'jana@email.sk', referrer_name: 'Jana V.', referred_email: 'simona@email.sk', referred_name: 'Simona H.', referral_code: 'JANA5678', credit_amount: 1400, status: 'approved', created_at: '2026-02-22T14:30:00Z', approved_at: '2026-02-23T10:00:00Z' },
];

const DEMO_CODES: CodeRow[] = [
  { id: '1', user_id: 'u1', code: 'KATKA123', email: 'katka@email.sk', name: 'Katka N.', created_at: '2026-02-10T08:00:00Z', is_active: true, referral_count: 3 },
  { id: '2', user_id: 'u2', code: 'JANA5678', email: 'jana@email.sk', name: 'Jana V.', created_at: '2026-02-12T09:00:00Z', is_active: true, referral_count: 2 },
  { id: '3', user_id: 'u3', code: 'EVAS9012', email: 'eva@email.sk', name: 'Eva S.', created_at: '2026-02-14T10:00:00Z', is_active: true, referral_count: 1 },
  { id: '4', user_id: 'u4', code: 'MONI3456', email: 'monika@email.sk', name: 'Monika L.', created_at: '2026-02-20T11:00:00Z', is_active: true, referral_count: 0 },
];

type Tab = 'overview' | 'referrals' | 'codes';
type StatusFilter = 'all' | 'pending' | 'approved' | 'paid' | 'cancelled';

export default function AdminReferrals() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [referrals, setReferrals] = useState<ReferralRow[]>(DEMO_REFERRALS);
  const [codes, setCodes] = useState<CodeRow[]>(DEMO_CODES);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Try loading from Supabase, fall back to demo
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try Supabase first
      const { data: refData, error: refErr } = await supabase.rpc('admin_get_all_referrals');
      if (!refErr && refData && refData.length > 0) {
        setReferrals(refData);
      }
      // If error or empty, demo data stays
    } catch {
      // Demo mode — data already set
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    setReferrals(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'approved' as const, approved_at: new Date().toISOString() } : r
    ));
    // In production: call supabase to update status + add credits
  };

  const handleCancel = async (id: string) => {
    setReferrals(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'cancelled' as const } : r
    ));
  };

  // Stats
  const totalReferrals = referrals.length;
  const approved = referrals.filter(r => r.status === 'approved').length;
  const pending = referrals.filter(r => r.status === 'pending').length;
  const totalCreditsAwarded = referrals.filter(r => r.status === 'approved').reduce((s, r) => s + r.credit_amount, 0);
  const activeCodes = codes.filter(c => c.is_active).length;

  // Filtered referrals
  const filtered = referrals.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.referrer_email.toLowerCase().includes(q) 
        || r.referred_email.toLowerCase().includes(q)
        || r.referral_code.toLowerCase().includes(q)
        || r.referrer_name.toLowerCase().includes(q)
        || r.referred_name.toLowerCase().includes(q);
    }
    return true;
  });

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return colors.strava;
      case 'pending': return colors.accent;
      case 'cancelled': return colors.periodka;
      case 'paid': return colors.telo;
      default: return colors.textTertiary;
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case 'approved': return 'Schválené';
      case 'pending': return 'Čakajúce';
      case 'cancelled': return 'Zrušené';
      case 'paid': return 'Vyplatené';
      default: return s;
    }
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="p-4 pt-12 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-xl flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Referral Admin</h1>
          <p className="text-xs" style={{ color: colors.textSecondary }}>Správa odporúčacieho programu</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        {([['overview', 'Prehľad'], ['referrals', 'Odporúčania'], ['codes', 'Kódy']] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === t ? colors.telo : 'rgba(255,255,255,0.3)',
              color: tab === t ? '#fff' : colors.textSecondary,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                <Users className="w-6 h-6 mb-2" style={{ color: colors.accent }} />
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{totalReferrals}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>Celkom odporúčaní</div>
              </div>
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                <CheckCircle className="w-6 h-6 mb-2" style={{ color: colors.strava }} />
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{approved}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>Schválených</div>
              </div>
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                <Clock className="w-6 h-6 mb-2" style={{ color: colors.periodka }} />
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{pending}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>Čakajúcich</div>
              </div>
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                <Euro className="w-6 h-6 mb-2" style={{ color: colors.telo }} />
                <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>€{(totalCreditsAwarded / 100).toFixed(0)}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>Kreditov udelených</div>
              </div>
            </div>

            {/* Active Codes Summary */}
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Aktívne kódy</h3>
                <span className="text-xs px-2 py-1 rounded-lg bg-white/40" style={{ color: colors.textSecondary }}>{activeCodes} aktívnych</span>
              </div>
              <div className="space-y-2">
                {codes.slice(0, 3).map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/20 last:border-0">
                    <div>
                      <span className="text-sm font-mono font-bold" style={{ color: colors.accent }}>{c.code}</span>
                      <span className="text-xs ml-2" style={{ color: colors.textSecondary }}>{c.name}</span>
                    </div>
                    <span className="text-xs" style={{ color: colors.textTertiary }}>{c.referral_count} odporúčaní</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('codes')} className="mt-3 text-xs font-medium" style={{ color: colors.accent }}>
                Zobraziť všetky →
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Posledná aktivita</h3>
              <div className="space-y-3">
                {referrals.slice(0, 4).map(r => (
                  <div key={r.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: statusColor(r.status) }} />
                    <div className="flex-1">
                      <p className="text-xs" style={{ color: colors.textPrimary }}>
                        <span className="font-medium">{r.referrer_name}</span> → <span className="font-medium">{r.referred_name}</span>
                      </p>
                      <p className="text-xs" style={{ color: colors.textTertiary }}>{formatDate(r.created_at)} · {statusLabel(r.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* REFERRALS TAB */}
        {tab === 'referrals' && (
          <>
            {/* Search + Filter */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Hľadať podľa mena, emailu, kódu..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/30 backdrop-blur-xl border border-white/30 outline-none"
                  style={{ color: colors.textPrimary }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                className="px-3 py-2.5 rounded-xl text-sm bg-white/30 backdrop-blur-xl border border-white/30 outline-none"
                style={{ color: colors.textPrimary }}
              >
                <option value="all">Všetky</option>
                <option value="pending">Čakajúce</option>
                <option value="approved">Schválené</option>
                <option value="cancelled">Zrušené</option>
              </select>
            </div>

            {/* Referral List */}
            <div className="space-y-3">
              {filtered.map(r => (
                <div key={r.id} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {r.referrer_name} → {r.referred_name}
                      </p>
                      <p className="text-xs" style={{ color: colors.textTertiary }}>
                        {r.referrer_email} → {r.referred_email}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-lg"
                      style={{ backgroundColor: `${statusColor(r.status)}20`, color: statusColor(r.status) }}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs" style={{ color: colors.textSecondary }}>
                    <span>Kód: <span className="font-mono font-bold" style={{ color: colors.accent }}>{r.referral_code}</span></span>
                    <span>€{(r.credit_amount / 100).toFixed(2)}</span>
                    <span>{formatDate(r.created_at)}</span>
                  </div>

                  {r.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="flex-1 py-2 rounded-xl text-xs font-medium text-white"
                        style={{ backgroundColor: colors.strava }}
                      >
                        ✓ Schváliť
                      </button>
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="flex-1 py-2 rounded-xl text-xs font-medium"
                        style={{ backgroundColor: `${colors.periodka}20`, color: colors.periodka }}
                      >
                        ✗ Zrušiť
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: colors.textTertiary }}>Žiadne odporúčania nenájdené</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* CODES TAB */}
        {tab === 'codes' && (
          <div className="space-y-3">
            {codes.map(c => (
              <div key={c.id} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.accent}20` }}>
                      <Gift className="w-5 h-5" style={{ color: colors.accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{c.name}</p>
                      <p className="text-xs" style={{ color: colors.textTertiary }}>{c.email}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${c.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                </div>
                
                <div className="flex items-center justify-between mt-3 p-3 rounded-xl bg-white/20">
                  <span className="text-lg font-mono font-bold" style={{ color: colors.accent }}>{c.code}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: colors.textSecondary }}>{c.referral_count} odporúčaní</span>
                    <span className="text-xs" style={{ color: colors.textTertiary }}>od {formatDate(c.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
