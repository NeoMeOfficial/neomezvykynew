import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Gift, FileText, BarChart3, Euro, TrendingUp,
  CheckCircle, Clock, ShieldCheck, ArrowLeft, Search,
  ChevronRight, Activity, Utensils, Heart, Dumbbell,
  UserPlus, CreditCard, Eye, Ban, Plus, X, Trash2,
  Edit3, Play, Pause, Upload, MessageSquare, Flag,
  Calendar, ChevronDown, ChevronUp, Copy, Send, Music,
  BookOpen, GripVertical, Video, Image as ImageIcon,
  Layers, FolderOpen, Bell, Settings, LogOut
} from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import ContentManager from '../../components/admin/ContentManager';
import DesktopAdminLayout from '../../components/admin/DesktopAdminLayout';
import DesktopSidebar from '../../components/admin/DesktopSidebar';
import DesktopOverview from '../../components/admin/DesktopOverview';
import DesktopDataTable, { UserTable } from '../../components/admin/DesktopDataTable';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════
interface AdminExercise {
  id: string; name: string; duration: string; type: string;
  videoUrl: string; thumbnail: string; description: string;
  instructions: string[]; section: string; access: 'free' | 'premium';
  published: boolean; createdAt: string;
}
interface AdminRecipe {
  id: string; title: string; category: string; calories: number;
  protein: number; carbs: number; fat: number; prepTime: number;
  ingredients: { name: string; amount: string }[];
  steps: string[]; allergens: string[]; dietary: string[];
  published: boolean; createdAt: string;
}
interface AdminMeditation {
  id: string; title: string; duration: string; category: string;
  audioUrl: string; description: string; published: boolean; createdAt: string;
}
interface ProgramDay { exercises: string[]; isRest: boolean; }
interface ProgramWeek { title: string; days: ProgramDay[]; }
interface AdminProgram {
  id: string; name: string; description: string; totalWeeks: number;
  weeks: ProgramWeek[]; startsOnMonday: boolean; access: 'free' | 'premium';
}
interface AdminUser {
  id: string; name: string; email: string; status: 'active' | 'trial' | 'cancelled';
  plan: string; joined: string; lastActive: string; credits: number; referrals: number; program?: string;
}
interface AdminMessage {
  id: string; from: string; fromName: string; to: string; toName: string;
  text: string; date: string; read: boolean;
}
interface CommunityPost {
  id: string; author: string; text: string; date: string;
  status: 'published' | 'flagged' | 'removed'; flags: number;
}
interface AdminReferral {
  id: string; referrer: string; referred: string; code: string;
  amount: number; status: 'pending' | 'approved' | 'cancelled'; date: string;
}

type Tab = 'overview' | 'content' | 'programs' | 'exercises' | 'recipes' | 'meditations' | 'community' | 'messages' | 'users' | 'referrals';
const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
const DAYS_FULL = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];

// ═══════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════
function load<T>(key: string, fallback: T): T {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function save(key: string, data: any) { localStorage.setItem(key, JSON.stringify(data)); }

// ═══════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════
const INIT_USERS: AdminUser[] = [
  { id: '1', name: 'Katka Nováková', email: 'katka@email.sk', status: 'active', plan: 'Premium', joined: '2026-01-15', lastActive: '2026-03-01', credits: 2800, referrals: 3, program: 'BodyForming' },
  { id: '2', name: 'Jana Vlčková', email: 'jana@email.sk', status: 'active', plan: 'Premium', joined: '2026-01-20', lastActive: '2026-02-28', credits: 1400, referrals: 2, program: 'PostPartum' },
  { id: '3', name: 'Eva Sýkorová', email: 'eva@email.sk', status: 'trial', plan: 'Trial', joined: '2026-02-20', lastActive: '2026-02-27', credits: 0, referrals: 1 },
  { id: '4', name: 'Monika Lukáčová', email: 'monika@email.sk', status: 'active', plan: 'Premium', joined: '2026-02-01', lastActive: '2026-03-01', credits: 0, referrals: 0, program: 'ElasticBands' },
  { id: '5', name: 'Zuzka Marková', email: 'zuzka@email.sk', status: 'active', plan: 'Premium', joined: '2026-02-10', lastActive: '2026-03-01', credits: 0, referrals: 0, program: 'BodyForming' },
  { id: '6', name: 'Petra Kováčová', email: 'petra@email.sk', status: 'active', plan: 'Premium', joined: '2026-02-18', lastActive: '2026-02-28', credits: 0, referrals: 0 },
  { id: '7', name: 'Mária Dlhá', email: 'maria@email.sk', status: 'trial', plan: 'Trial', joined: '2026-02-25', lastActive: '2026-02-26', credits: 0, referrals: 0 },
  { id: '8', name: 'Lucia Biela', email: 'lucia@email.sk', status: 'cancelled', plan: 'Zrušené', joined: '2026-01-10', lastActive: '2026-02-15', credits: 0, referrals: 0 },
  { id: '9', name: 'Nina Rybárová', email: 'nina@email.sk', status: 'active', plan: 'Premium', joined: '2026-02-22', lastActive: '2026-03-01', credits: 0, referrals: 0, program: 'StrongSexy' },
  { id: '10', name: 'Simona Horváthová', email: 'simona@email.sk', status: 'active', plan: 'Premium', joined: '2026-02-23', lastActive: '2026-03-01', credits: 0, referrals: 0 },
];

const INIT_PROGRAMS: AdminProgram[] = [
  { id: 'bodyforming', name: 'BodyForming', description: 'Kompletný program na formovanie tela', totalWeeks: 8, startsOnMonday: true, access: 'premium',
    weeks: Array.from({ length: 8 }, (_, w) => ({
      title: `Týždeň ${w + 1}`,
      days: Array.from({ length: 7 }, (_, d) => ({ exercises: d === 5 || d === 6 ? [] : [`ex-${w}-${d}`], isRest: d === 5 || d === 6 })),
    }))
  },
  { id: 'postpartum', name: 'PostPartum Recovery', description: 'Bezpečný návrat po pôrode', totalWeeks: 8, startsOnMonday: true, access: 'premium',
    weeks: Array.from({ length: 8 }, (_, w) => ({
      title: `Týždeň ${w + 1}`,
      days: Array.from({ length: 7 }, (_, d) => ({ exercises: d === 6 ? [] : [], isRest: d === 6 })),
    }))
  },
  { id: 'elasticbands', name: 'Elastic Bands', description: 'Tréning s odporovými gumami', totalWeeks: 6, startsOnMonday: true, access: 'premium',
    weeks: Array.from({ length: 6 }, (_, w) => ({
      title: `Týždeň ${w + 1}`,
      days: Array.from({ length: 7 }, (_, d) => ({ exercises: [], isRest: d === 6 })),
    }))
  },
  { id: 'strongsexy', name: 'Strong & Sexy', description: 'Intenzívny silový program', totalWeeks: 10, startsOnMonday: true, access: 'premium',
    weeks: Array.from({ length: 10 }, (_, w) => ({
      title: `Týždeň ${w + 1}`,
      days: Array.from({ length: 7 }, (_, d) => ({ exercises: [], isRest: d === 6 })),
    }))
  },
];

const INIT_EXERCISES: AdminExercise[] = [
  { id: 'ex-1', name: 'Drep s vlastnou váhou', duration: '10 min', type: 'strength', videoUrl: '', thumbnail: '', description: 'Základný drep', instructions: ['Stoj s nohami na šírku ramien', 'Pokrč kolená', 'Stlač späť hore'], section: 'telo', access: 'free', published: true, createdAt: '2026-01-01' },
  { id: 'ex-2', name: 'Plank', duration: '5 min', type: 'core', videoUrl: '', thumbnail: '', description: 'Core stabilizácia', instructions: ['Opora na predlaktiach', 'Telo v priamke', 'Drž 30-60s'], section: 'telo', access: 'free', published: true, createdAt: '2026-01-01' },
  { id: 'ex-3', name: 'Beh na mieste', duration: '15 min', type: 'cardio', videoUrl: '', thumbnail: '', description: 'Kardio rozcvička', instructions: ['Bežte na mieste', 'Zdvíhajte kolená'], section: 'telo', access: 'free', published: true, createdAt: '2026-01-01' },
  { id: 'ex-4', name: 'Výpady s gumou', duration: '12 min', type: 'strength', videoUrl: '', thumbnail: '', description: 'Posilnenie nôh s gumou', instructions: ['Gumu okolo stehien', 'Krok vpred', 'Pokrčiť obe kolená'], section: 'telo', access: 'premium', published: true, createdAt: '2026-01-05' },
  { id: 'ex-5', name: 'Strečing celého tela', duration: '20 min', type: 'flexibility', videoUrl: '', thumbnail: '', description: 'Kompletný strečing', instructions: ['Začnite od krku', 'Postupne dole'], section: 'telo', access: 'free', published: true, createdAt: '2026-01-10' },
];

const INIT_MEDITATIONS: AdminMeditation[] = [
  { id: 'med-1', title: 'Ranná meditácia', duration: '10 min', category: 'ranná', audioUrl: '', description: 'Pokojný začiatok dňa', published: true, createdAt: '2026-01-01' },
  { id: 'med-2', title: 'Meditácia pred spaním', duration: '15 min', category: 'večerná', audioUrl: '', description: 'Uvoľnenie pred spánkom', published: true, createdAt: '2026-01-01' },
  { id: 'med-3', title: 'Body scan', duration: '20 min', category: 'relaxácia', audioUrl: '', description: 'Postupné uvoľnenie tela', published: true, createdAt: '2026-01-05' },
];

const INIT_POSTS: CommunityPost[] = [
  { id: 'p1', author: 'Katka N.', text: 'Dnes som dokončila 3. týždeň BodyForming! 💪', date: '2026-03-01', status: 'published', flags: 0 },
  { id: 'p2', author: 'Jana V.', text: 'Má niekto tip na zdravú večeru po tréningu?', date: '2026-02-28', status: 'published', flags: 0 },
  { id: 'p3', author: 'Eva S.', text: 'Ten nový recept na smoothie je úžasný!', date: '2026-02-27', status: 'published', flags: 0 },
  { id: 'p4', author: 'Anon123', text: 'Kupte si tieto doplnky na mojom linku...', date: '2026-02-26', status: 'flagged', flags: 3 },
];

const INIT_MESSAGES: AdminMessage[] = [
  { id: 'm1', from: 'user', fromName: 'Katka N.', to: 'admin', toName: 'Admin', text: 'Ahoj, mám otázku k programu BodyForming. Môžem preskočiť 2. týždeň?', date: '2026-03-01T10:30:00', read: false },
  { id: 'm2', from: 'user', fromName: 'Jana V.', to: 'admin', toName: 'Admin', text: 'Chcela by som zmeniť predplatné na ročné. Ako to mám urobiť?', date: '2026-02-28T14:15:00', read: true },
  { id: 'm3', from: 'admin', fromName: 'Admin', to: 'user', toName: 'Jana V.', text: 'Zmenu predplatného urobíte v nastaveniach profilu. Pomôžem vám.', date: '2026-02-28T15:00:00', read: true },
];

const INIT_REFERRALS: AdminReferral[] = [
  { id: 'r1', referrer: 'Katka N.', referred: 'Zuzka M.', code: 'KATKA123', amount: 1400, status: 'approved', date: '2026-02-15' },
  { id: 'r2', referrer: 'Katka N.', referred: 'Petra K.', code: 'KATKA123', amount: 1400, status: 'approved', date: '2026-02-18' },
  { id: 'r3', referrer: 'Jana V.', referred: 'Mária D.', code: 'JANA5678', amount: 1400, status: 'pending', date: '2026-02-25' },
  { id: 'r4', referrer: 'Katka N.', referred: 'Lucia B.', code: 'KATKA123', amount: 1400, status: 'pending', date: '2026-02-27' },
  { id: 'r5', referrer: 'Eva S.', referred: 'Nina R.', code: 'EVAS9012', amount: 1400, status: 'cancelled', date: '2026-02-20' },
];

// ═══════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 ${className}`}>{children}</div>
);
const Badge = ({ text, color }: { text: string; color: string }) => (
  <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>{text}</span>
);
const Btn = ({ children, onClick, variant = 'default', className = '' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'danger' | 'success' | 'default'; className?: string }) => {
  const styles = {
    primary: { backgroundColor: colors.telo, color: '#fff' },
    danger: { backgroundColor: `${colors.periodka}20`, color: colors.periodka },
    success: { backgroundColor: colors.strava, color: '#fff' },
    default: { backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary },
  };
  return <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${className}`} style={styles[variant]}>{children}</button>;
};
const Input = ({ label, value, onChange, placeholder = '', type = 'text', textarea = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; textarea?: boolean }) => (
  <div>
    <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>{label}</label>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
    )}
  </div>
);
const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <div>
    <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SearchBar = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/30 backdrop-blur-xl border border-white/30 outline-none" style={{ color: colors.textPrimary }} />
  </div>
);

// ═══════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{title}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
      </div>
      {children}
    </div>
  </div>
);

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [manualDesktopMode, setManualDesktopMode] = useState(() => {
    try {
      const saved = localStorage.getItem('neome_admin_desktop_mode');
      return saved ? JSON.parse(saved) : null; // null = auto, true = force desktop, false = force mobile
    } catch {
      return null;
    }
  });
  const [showToggle, setShowToggle] = useState(true);

  // Data state
  const [users, setUsers] = useState<AdminUser[]>(() => load('neome_admin_users', INIT_USERS));
  const [programs, setPrograms] = useState<AdminProgram[]>(() => load('neome_admin_programs', INIT_PROGRAMS));
  const [exercises, setExercises] = useState<AdminExercise[]>(() => load('neome_admin_exercises', INIT_EXERCISES));
  const [meditations, setMeditations] = useState<AdminMeditation[]>(() => load('neome_admin_meditations', INIT_MEDITATIONS));
  const [posts, setPosts] = useState<CommunityPost[]>(() => load('neome_admin_posts', INIT_POSTS));
  const [messages, setMessages] = useState<AdminMessage[]>(() => load('neome_admin_messages', INIT_MESSAGES));
  const [referrals, setReferrals] = useState<AdminReferral[]>(() => load('neome_admin_referrals', INIT_REFERRALS));

  // Sub-state
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [userFilter, setUserFilter] = useState('all');
  const [refFilter, setRefFilter] = useState('all');
  const [postFilter, setPostFilter] = useState('all');

  // Form state
  const [form, setForm] = useState<Record<string, string>>({});
  const [bulkEmails, setBulkEmails] = useState('');
  const [bulkProgram, setBulkProgram] = useState('');
  const [composeTo, setComposeTo] = useState('');
  const [composeText, setComposeText] = useState('');

  // Persist on change
  useEffect(() => { save('neome_admin_users', users); }, [users]);
  useEffect(() => { save('neome_admin_programs', programs); }, [programs]);
  useEffect(() => { save('neome_admin_exercises', exercises); }, [exercises]);
  useEffect(() => { save('neome_admin_meditations', meditations); }, [meditations]);
  useEffect(() => { save('neome_admin_posts', posts); }, [posts]);
  useEffect(() => { save('neome_admin_messages', messages); }, [messages]);
  useEffect(() => { save('neome_admin_referrals', referrals); }, [referrals]);
  
  // Desktop/mobile detection with manual override
  useEffect(() => {
    const checkScreenSize = () => {
      const isWideScreen = window.innerWidth >= 768;
      setIsDesktop(isWideScreen);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Toggle manual desktop mode
  const toggleDesktopMode = (mode: boolean | null) => {
    console.log('Toggle desktop mode:', mode);
    setManualDesktopMode(mode);
    localStorage.setItem('neome_admin_desktop_mode', JSON.stringify(mode));
    
    // Force re-render
    window.location.reload();
  };

  // Determine final layout mode
  const getLayoutMode = () => {
    if (manualDesktopMode !== null) {
      return manualDesktopMode; // Manual override
    }
    return isDesktop; // Auto-detect
  };

  const resetForm = () => setForm({});
  const formatDate = (d: string) => new Date(d).toLocaleDateString('sk-SK', { day: 'numeric', month: 'short' });

  // Desktop-specific handlers
  const handleDesktopNavigate = (newTab: string) => {
    setTab(newTab as Tab);
    setSearch('');
  };

  const handleUserEdit = (user: AdminUser) => {
    setModal('edit-user');
    setForm({
      name: user.name,
      email: user.email,
      plan: user.plan,
      program: user.program || ''
    });
  };

  const handleUserView = (user: AdminUser) => {
    alert(`Viewing user: ${user.name} (${user.email})`);
  };

  const handleUserDelete = (user: AdminUser) => {
    if (confirm(`Delete user ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  // Stats
  const activeUsers = users.filter(u => u.status === 'active').length;
  const trialUsers = users.filter(u => u.status === 'trial').length;
  const mrr = activeUsers * 14.90;
  const pendingRefs = referrals.filter(r => r.status === 'pending').length;
  const approvedRefs = referrals.filter(r => r.status === 'approved').length;
  const flaggedPosts = posts.filter(p => p.status === 'flagged').length;
  const unreadMessages = messages.filter(m => m.to === 'admin' && !m.read).length;

  const statusColor = (s: string) => {
    switch (s) { case 'active': case 'approved': case 'published': return colors.strava; case 'trial': case 'pending': return colors.accent; case 'cancelled': case 'removed': return colors.periodka; case 'flagged': return '#e53e3e'; default: return colors.textTertiary; }
  };

  // Prepare desktop stats
  const desktopStats = {
    users: { total: users.length, active: activeUsers, trial: trialUsers },
    revenue: { mrr: mrr.toFixed(0), growth: '+12% this month' },
    referrals: { total: referrals.length, pending: pendingRefs },
    content: { exercises: exercises.length, recipes: 108 }
  };

  const desktopActions = {
    pendingReferrals: pendingRefs,
    flaggedPosts: flaggedPosts,
    unreadMessages: unreadMessages
  };

  const TABS: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: 'overview', label: 'Prehľad', icon: BarChart3 },
    { id: 'content', label: 'Obsah', icon: FolderOpen },
    { id: 'programs', label: 'Programy', icon: Calendar },
    { id: 'exercises', label: 'Cvičenia', icon: Dumbbell },
    { id: 'recipes', label: 'Recepty', icon: Utensils },
    { id: 'meditations', label: 'Meditácie', icon: Music },
    { id: 'community', label: 'Komunita', icon: Flag, badge: flaggedPosts || undefined },
    { id: 'messages', label: 'Správy', icon: MessageSquare, badge: unreadMessages || undefined },
    { id: 'users', label: 'Užívatelia', icon: Users },
    { id: 'referrals', label: 'Odporúčania', icon: Gift, badge: pendingRefs || undefined },
  ];

  // ═══════════════════════════════════════════
  // OVERVIEW
  // ═══════════════════════════════════════════
  const renderOverview = () => (
    <>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Users, label: 'Užívatelia', value: users.length, sub: `${activeUsers} aktívnych`, color: colors.strava },
          { icon: Euro, label: 'MRR', value: `€${mrr.toFixed(0)}`, sub: 'Mesačné príjmy', color: colors.accent },
          { icon: Gift, label: 'Odporúčania', value: referrals.length, sub: `${pendingRefs} čakajúcich`, color: colors.periodka },
          { icon: Dumbbell, label: 'Cvičenia', value: exercises.length, sub: `${exercises.filter(e=>e.published).length} publikovaných`, color: colors.telo },
        ].map((s, i) => (
          <Card key={i}>
            <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
            <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{s.value}</div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>{s.sub}</div>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>Rýchle akcie</h3>
        <div className="space-y-2">
          {[
            { label: `Schváliť ${pendingRefs} odporúčaní`, icon: Clock, color: colors.periodka, action: () => { setTab('referrals'); setRefFilter('pending'); }, show: pendingRefs > 0 },
            { label: `${flaggedPosts} nahlásených príspevkov`, icon: Flag, color: '#e53e3e', action: () => { setTab('community'); setPostFilter('flagged'); }, show: flaggedPosts > 0 },
            { label: `${unreadMessages} neprečítaných správ`, icon: MessageSquare, color: colors.accent, action: () => setTab('messages'), show: unreadMessages > 0 },
            { label: 'Pridať nové cvičenie', icon: Plus, color: colors.strava, action: () => { setTab('exercises'); setModal('add-exercise'); }, show: true },
            { label: 'Upraviť programy', icon: Calendar, color: colors.telo, action: () => setTab('programs'), show: true },
          ].filter(a => a.show).map((a, i) => (
            <button key={i} onClick={a.action} className="w-full flex items-center justify-between p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all">
              <div className="flex items-center gap-2">
                <a.icon className="w-4 h-4" style={{ color: a.color }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>{a.label}</span>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: colors.textTertiary }} />
            </button>
          ))}
        </div>
      </Card>
    </>
  );

  // ═══════════════════════════════════════════
  // PROGRAMS
  // ═══════════════════════════════════════════
  const activeProgram = programs.find(p => p.id === selectedProgram);

  const addExerciseToDay = (programId: string, weekIdx: number, dayIdx: number, exerciseId: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id !== programId) return p;
      const weeks = [...p.weeks];
      const days = [...weeks[weekIdx].days];
      days[dayIdx] = { ...days[dayIdx], exercises: [...days[dayIdx].exercises, exerciseId], isRest: false };
      weeks[weekIdx] = { ...weeks[weekIdx], days };
      return { ...p, weeks };
    }));
  };

  const removeExerciseFromDay = (programId: string, weekIdx: number, dayIdx: number, exIdx: number) => {
    setPrograms(prev => prev.map(p => {
      if (p.id !== programId) return p;
      const weeks = [...p.weeks];
      const days = [...weeks[weekIdx].days];
      const exs = [...days[dayIdx].exercises];
      exs.splice(exIdx, 1);
      days[dayIdx] = { ...days[dayIdx], exercises: exs };
      weeks[weekIdx] = { ...weeks[weekIdx], days };
      return { ...p, weeks };
    }));
  };

  const toggleRestDay = (programId: string, weekIdx: number, dayIdx: number) => {
    setPrograms(prev => prev.map(p => {
      if (p.id !== programId) return p;
      const weeks = [...p.weeks];
      const days = [...weeks[weekIdx].days];
      days[dayIdx] = { ...days[dayIdx], isRest: !days[dayIdx].isRest, exercises: !days[dayIdx].isRest ? [] : days[dayIdx].exercises };
      weeks[weekIdx] = { ...weeks[weekIdx], days };
      return { ...p, weeks };
    }));
  };

  const updateWeekTitle = (programId: string, weekIdx: number, title: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id !== programId) return p;
      const weeks = [...p.weeks];
      weeks[weekIdx] = { ...weeks[weekIdx], title };
      return { ...p, weeks };
    }));
  };

  const renderPrograms = () => {
    if (!selectedProgram || !activeProgram) {
      return (
        <>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Programy</h3>
              <Badge text="Vždy začínajú v pondelok" color={colors.accent} />
            </div>
            <p className="text-xs mb-4" style={{ color: colors.textSecondary }}>Programy začínajú vždy v najbližší pondelok po zakúpení.</p>
          </Card>
          <div className="space-y-3">
            {programs.map(p => (
              <button key={p.id} onClick={() => { setSelectedProgram(p.id); setSelectedWeek(0); }} className="w-full text-left">
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.telo}20` }}>
                        <Dumbbell className="w-5 h-5" style={{ color: colors.telo }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{p.name}</p>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>{p.totalWeeks} týždňov · {p.access === 'premium' ? 'Premium' : 'Free'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: colors.textTertiary }} />
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </>
      );
    }

    const week = activeProgram.weeks[selectedWeek];
    return (
      <>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setSelectedProgram(null)} className="w-8 h-8 rounded-lg bg-white/30 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" style={{ color: colors.textPrimary }} />
          </button>
          <div>
            <h3 className="text-sm font-bold" style={{ color: colors.textPrimary }}>{activeProgram.name}</h3>
            <p className="text-xs" style={{ color: colors.textSecondary }}>{activeProgram.totalWeeks} týždňov · Začiatok vždy v pondelok</p>
          </div>
        </div>

        {/* Week selector */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {activeProgram.weeks.map((w, i) => (
            <button key={i} onClick={() => setSelectedWeek(i)} className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all" style={{ background: selectedWeek === i ? colors.telo : 'rgba(255,255,255,0.3)', color: selectedWeek === i ? '#fff' : colors.textSecondary }}>
              T{i + 1}
            </button>
          ))}
        </div>

        {/* Week title edit */}
        <Card>
          <input value={week.title} onChange={e => updateWeekTitle(activeProgram.id, selectedWeek, e.target.value)} className="text-sm font-semibold bg-transparent outline-none w-full" style={{ color: colors.textPrimary }} />
        </Card>

        {/* Day grid */}
        <div className="space-y-2">
          {week.days.map((day, dayIdx) => (
            <Card key={dayIdx} className={day.isRest ? 'opacity-60' : ''}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>{DAYS_FULL[dayIdx]}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleRestDay(activeProgram.id, selectedWeek, dayIdx)} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: day.isRest ? `${colors.accent}20` : 'rgba(255,255,255,0.3)', color: day.isRest ? colors.accent : colors.textTertiary }}>
                    {day.isRest ? '😴 Voľno' : 'Označiť voľno'}
                  </button>
                  {!day.isRest && (
                    <button onClick={() => setModal(`pick-exercise-${selectedWeek}-${dayIdx}`)} className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.strava}20` }}>
                      <Plus className="w-3 h-3" style={{ color: colors.strava }} />
                    </button>
                  )}
                </div>
              </div>
              {!day.isRest && day.exercises.length > 0 && (
                <div className="space-y-1">
                  {day.exercises.map((exId, exIdx) => {
                    const ex = exercises.find(e => e.id === exId);
                    return (
                      <div key={exIdx} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/20">
                        <span className="text-xs" style={{ color: colors.textPrimary }}>{ex?.name || exId}</span>
                        <button onClick={() => removeExerciseFromDay(activeProgram.id, selectedWeek, dayIdx, exIdx)}>
                          <X className="w-3 h-3" style={{ color: colors.periodka }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {!day.isRest && day.exercises.length === 0 && (
                <p className="text-xs italic" style={{ color: colors.textTertiary }}>Žiadne cvičenia — klikni + pre pridanie</p>
              )}
            </Card>
          ))}
        </div>
      </>
    );
  };

  // ═══════════════════════════════════════════
  // EXERCISES
  // ═══════════════════════════════════════════
  const addExercise = () => {
    const ex: AdminExercise = {
      id: `ex-${Date.now()}`, name: form.name || 'Nové cvičenie', duration: form.duration || '10 min',
      type: form.type || 'strength', videoUrl: form.videoUrl || '', thumbnail: form.thumbnail || '',
      description: form.description || '', instructions: (form.instructions || '').split('\n').filter(Boolean),
      section: form.section || 'telo', access: (form.access as any) || 'premium', published: true, createdAt: new Date().toISOString(),
    };
    setExercises(prev => [ex, ...prev]);
    setModal(null); resetForm();
  };

  const toggleExercisePublish = (id: string) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, published: !e.published } : e));
  };

  const deleteExercise = (id: string) => {
    if (confirm('Naozaj vymazať?')) setExercises(prev => prev.filter(e => e.id !== id));
  };

  const filteredExercises = exercises.filter(e => {
    if (search) return e.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const renderExercises = () => (
    <>
      <div className="flex gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Hľadať cvičenie..." /></div>
        <Btn variant="primary" onClick={() => { resetForm(); setModal('add-exercise'); }}><Plus className="w-4 h-4" /></Btn>
      </div>
      <div className="space-y-2">
        {filteredExercises.map(e => (
          <Card key={e.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{e.name}</span>
                  <Badge text={e.access === 'premium' ? 'Premium' : 'Free'} color={e.access === 'premium' ? colors.accent : colors.strava} />
                </div>
                <div className="flex gap-2 text-xs" style={{ color: colors.textSecondary }}>
                  <span>{e.duration}</span>·<span>{e.type}</span>·<span>{e.section}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleExercisePublish(e.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: e.published ? `${colors.strava}15` : `${colors.periodka}15` }}>
                  {e.published ? <Eye className="w-3.5 h-3.5" style={{ color: colors.strava }} /> : <Pause className="w-3.5 h-3.5" style={{ color: colors.periodka }} />}
                </button>
                <button onClick={() => deleteExercise(e.id)} className="p-1.5 rounded-lg" style={{ backgroundColor: `${colors.periodka}10` }}>
                  <Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  // ═══════════════════════════════════════════
  // RECIPES
  // ═══════════════════════════════════════════
  const addRecipe = () => {
    const r: AdminRecipe = {
      id: `recipe-${Date.now()}`, title: form.title || 'Nový recept', category: form.category || 'obed',
      calories: parseInt(form.calories || '300'), protein: parseInt(form.protein || '20'),
      carbs: parseInt(form.carbs || '30'), fat: parseInt(form.fat || '10'), prepTime: parseInt(form.prepTime || '15'),
      ingredients: (form.ingredients || '').split('\n').filter(Boolean).map(l => {
        const [name, amount] = l.split('|').map(s => s.trim());
        return { name: name || l, amount: amount || '' };
      }),
      steps: (form.steps || '').split('\n').filter(Boolean),
      allergens: (form.allergens || '').split(',').map(s => s.trim()).filter(Boolean),
      dietary: (form.dietary || '').split(',').map(s => s.trim()).filter(Boolean),
      published: true, createdAt: new Date().toISOString(),
    };
    // We store added recipes separately
    const existing: AdminRecipe[] = load('neome_admin_recipes', []);
    save('neome_admin_recipes', [r, ...existing]);
    setModal(null); resetForm();
    alert(`Recept "${r.title}" pridaný! (${existing.length + 1} vlastných receptov)`);
  };

  const renderRecipes = () => {
    const customRecipes: AdminRecipe[] = load('neome_admin_recipes', []);
    return (
      <>
        <div className="flex gap-2">
          <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Hľadať recept..." /></div>
          <Btn variant="primary" onClick={() => { resetForm(); setModal('add-recipe'); }}><Plus className="w-4 h-4" /></Btn>
        </div>
        <Card>
          <h3 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>Knižnica receptov</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { cat: 'Obedy', count: 38, color: colors.strava },
              { cat: 'Raňajky', count: 28, color: colors.accent },
              { cat: 'Snacky', count: 23, color: colors.mysel },
              { cat: 'Večere', count: 20, color: colors.periodka },
              { cat: 'Smoothie', count: 7, color: colors.telo },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/20">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-xs" style={{ color: colors.textPrimary }}>{r.cat}: {r.count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>116 receptov v databáze + {customRecipes.length} vlastných</p>
        </Card>
        {customRecipes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Vlastné recepty</h4>
            {customRecipes.map((r, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{r.title}</span>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>{r.category} · {r.calories} kcal · {r.prepTime} min</div>
                  </div>
                  <Badge text={r.category} color={colors.strava} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </>
    );
  };

  // ═══════════════════════════════════════════
  // MEDITATIONS
  // ═══════════════════════════════════════════
  const addMeditation = () => {
    const m: AdminMeditation = {
      id: `med-${Date.now()}`, title: form.title || 'Nová meditácia', duration: form.duration || '10 min',
      category: form.category || 'relaxácia', audioUrl: form.audioUrl || '', description: form.description || '',
      published: true, createdAt: new Date().toISOString(),
    };
    setMeditations(prev => [m, ...prev]);
    setModal(null); resetForm();
  };

  const renderMeditations = () => (
    <>
      <div className="flex gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Hľadať meditáciu..." /></div>
        <Btn variant="primary" onClick={() => { resetForm(); setModal('add-meditation'); }}><Plus className="w-4 h-4" /></Btn>
      </div>
      <div className="space-y-2">
        {meditations.filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase())).map(m => (
          <Card key={m.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.mysel}20` }}>
                  <Music className="w-5 h-5" style={{ color: colors.mysel }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{m.title}</p>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>{m.duration} · {m.category}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setMeditations(prev => prev.map(x => x.id === m.id ? { ...x, published: !x.published } : x))} className="p-1.5 rounded-lg" style={{ backgroundColor: m.published ? `${colors.strava}15` : `${colors.periodka}15` }}>
                  {m.published ? <Eye className="w-3.5 h-3.5" style={{ color: colors.strava }} /> : <Pause className="w-3.5 h-3.5" style={{ color: colors.periodka }} />}
                </button>
                <button onClick={() => setMeditations(prev => prev.filter(x => x.id !== m.id))} className="p-1.5 rounded-lg" style={{ backgroundColor: `${colors.periodka}10` }}>
                  <Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  // ═══════════════════════════════════════════
  // COMMUNITY
  // ═══════════════════════════════════════════
  const renderCommunity = () => {
    const filtered = posts.filter(p => postFilter === 'all' || p.status === postFilter);
    return (
      <>
        <div className="flex gap-2">
          {['all', 'published', 'flagged', 'removed'].map(f => (
            <button key={f} onClick={() => setPostFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: postFilter === f ? colors.telo : 'rgba(255,255,255,0.3)', color: postFilter === f ? '#fff' : colors.textSecondary }}>
              {f === 'all' ? 'Všetky' : f === 'published' ? 'Aktívne' : f === 'flagged' ? `Nahlásené (${flaggedPosts})` : 'Odstránené'}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map(p => (
            <Card key={p.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{p.author}</span>
                  <span className="text-xs ml-2" style={{ color: colors.textTertiary }}>{formatDate(p.date)}</span>
                </div>
                <Badge text={p.status === 'published' ? 'Aktívny' : p.status === 'flagged' ? `🚩 ${p.flags}x` : 'Odstránený'} color={statusColor(p.status)} />
              </div>
              <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>{p.text}</p>
              {p.status !== 'removed' && (
                <div className="flex gap-2">
                  {p.status === 'flagged' && (
                    <Btn variant="success" onClick={() => setPosts(prev => prev.map(x => x.id === p.id ? { ...x, status: 'published', flags: 0 } : x))} className="flex-1 text-xs">✓ Schváliť</Btn>
                  )}
                  <Btn variant="danger" onClick={() => setPosts(prev => prev.map(x => x.id === p.id ? { ...x, status: 'removed' } : x))} className="flex-1 text-xs">✗ Odstrániť</Btn>
                </div>
              )}
            </Card>
          ))}
        </div>
      </>
    );
  };

  // ═══════════════════════════════════════════
  // MESSAGES
  // ═══════════════════════════════════════════
  const sendMessage = () => {
    if (!composeText.trim() || !composeTo.trim()) return;
    const m: AdminMessage = {
      id: `msg-${Date.now()}`, from: 'admin', fromName: 'Admin', to: 'user', toName: composeTo,
      text: composeText, date: new Date().toISOString(), read: false,
    };
    setMessages(prev => [m, ...prev]);
    setComposeText(''); setComposeTo(''); setModal(null);
  };

  const renderMessages = () => (
    <>
      <div className="flex gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Hľadať v správach..." /></div>
        <Btn variant="primary" onClick={() => setModal('compose-message')}><Send className="w-4 h-4" /></Btn>
      </div>
      <div className="space-y-2">
        {messages.filter(m => !search || m.text.toLowerCase().includes(search.toLowerCase()) || m.fromName.toLowerCase().includes(search.toLowerCase())).map(m => (
          <Card key={m.id}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: m.from === 'admin' ? `${colors.telo}20` : `${colors.strava}20` }}>
                <span className="text-xs font-bold" style={{ color: m.from === 'admin' ? colors.telo : colors.strava }}>{m.fromName.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>{m.fromName} → {m.toName}</span>
                  {!m.read && m.to === 'admin' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{m.text}</p>
                <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>{new Date(m.date).toLocaleString('sk-SK')}</p>
              </div>
              {!m.read && m.to === 'admin' && (
                <button onClick={() => setMessages(prev => prev.map(x => x.id === m.id ? { ...x, read: true } : x))} className="text-xs px-2 py-1 rounded-lg bg-white/20" style={{ color: colors.textSecondary }}>
                  Prečítané
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  // ═══════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════
  const addSingleUser = () => {
    const u: AdminUser = {
      id: `u-${Date.now()}`, name: form.name || 'Nový užívateľ', email: form.email || '',
      status: 'active', plan: 'Premium', joined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0], credits: 0, referrals: 0, program: form.program || undefined,
    };
    setUsers(prev => [u, ...prev]);
    setModal(null); resetForm();
  };

  const bulkImport = () => {
    const emails = bulkEmails.split('\n').map(e => e.trim()).filter(Boolean);
    const newUsers = emails.map((email, i) => ({
      id: `u-bulk-${Date.now()}-${i}`, name: email.split('@')[0], email,
      status: 'active' as const, plan: 'Premium', joined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0], credits: 0, referrals: 0, program: bulkProgram || undefined,
    }));
    setUsers(prev => [...newUsers, ...prev]);
    setBulkEmails(''); setBulkProgram(''); setModal(null);
    alert(`${newUsers.length} užívateľov importovaných${bulkProgram ? ` do programu ${programs.find(p => p.id === bulkProgram)?.name}` : ''}`);
  };

  const filteredUsers = users.filter(u => {
    if (userFilter !== 'all' && u.status !== userFilter) return false;
    if (search) return u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const renderUsers = () => (
    <>
      <div className="flex gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Hľadať užívateľa..." /></div>
        <Btn variant="primary" onClick={() => { resetForm(); setModal('add-user'); }}><UserPlus className="w-4 h-4" /></Btn>
        <Btn onClick={() => setModal('bulk-import')}><Upload className="w-4 h-4" /></Btn>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'active', 'trial', 'cancelled'].map(f => (
          <button key={f} onClick={() => setUserFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap" style={{ background: userFilter === f ? colors.telo : 'rgba(255,255,255,0.3)', color: userFilter === f ? '#fff' : colors.textSecondary }}>
            {f === 'all' ? `Všetky (${users.length})` : f === 'active' ? `Aktívne (${activeUsers})` : f === 'trial' ? `Skúšobné (${trialUsers})` : 'Zrušené'}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filteredUsers.map(u => (
          <Card key={u.id}>
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.telo}20` }}>
                  <span className="text-xs font-bold" style={{ color: colors.telo }}>{u.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{u.name}</p>
                  <p className="text-xs" style={{ color: colors.textTertiary }}>{u.email}</p>
                </div>
              </div>
              <Badge text={u.status === 'active' ? 'Aktívna' : u.status === 'trial' ? 'Skúšobná' : 'Zrušená'} color={statusColor(u.status)} />
            </div>
            <div className="flex gap-3 text-xs mt-2" style={{ color: colors.textSecondary }}>
              <span>{u.plan}</span>
              {u.program && <span style={{ color: colors.telo }}>{programs.find(p => p.id === u.program)?.name || u.program}</span>}
              <span>Od {formatDate(u.joined)}</span>
            </div>
            {u.status !== 'cancelled' && (
              <div className="flex gap-2 mt-2">
                <Btn variant="danger" onClick={() => setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'cancelled', plan: 'Zrušené' } : x))} className="text-xs"><Ban className="w-3 h-3 inline mr-1" />Pozastaviť</Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );

  // ═══════════════════════════════════════════
  // REFERRALS
  // ═══════════════════════════════════════════
  const filteredRefs = referrals.filter(r => {
    if (refFilter !== 'all' && r.status !== refFilter) return false;
    if (search) return r.referrer.toLowerCase().includes(search.toLowerCase()) || r.referred.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const renderReferrals = () => (
    <>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <Card className="text-center !p-3">
          <div className="text-lg font-bold" style={{ color: colors.strava }}>{approvedRefs}</div>
          <div className="text-xs" style={{ color: colors.textTertiary }}>Schválené</div>
        </Card>
        <Card className="text-center !p-3">
          <div className="text-lg font-bold" style={{ color: colors.accent }}>{pendingRefs}</div>
          <div className="text-xs" style={{ color: colors.textTertiary }}>Čakajúce</div>
        </Card>
        <Card className="text-center !p-3">
          <div className="text-lg font-bold" style={{ color: colors.telo }}>€{approvedRefs * 14}</div>
          <div className="text-xs" style={{ color: colors.textTertiary }}>Udelené</div>
        </Card>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Hľadať..." /></div>
        <select value={refFilter} onChange={e => setRefFilter(e.target.value)} className="px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none" style={{ color: colors.textPrimary }}>
          <option value="all">Všetky</option><option value="pending">Čakajúce</option><option value="approved">Schválené</option><option value="cancelled">Zrušené</option>
        </select>
      </div>
      <div className="space-y-2">
        {filteredRefs.map(r => (
          <Card key={r.id}>
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>{r.referrer} → {r.referred}</p>
              <Badge text={r.status === 'approved' ? 'Schválené' : r.status === 'pending' ? 'Čakajúce' : 'Zrušené'} color={statusColor(r.status)} />
            </div>
            <div className="flex gap-3 text-xs" style={{ color: colors.textSecondary }}>
              <span className="font-mono font-bold" style={{ color: colors.accent }}>{r.code}</span>
              <span>€{(r.amount / 100).toFixed(2)}</span>
              <span>{formatDate(r.date)}</span>
            </div>
            {r.status === 'pending' && (
              <div className="flex gap-2 mt-2">
                <Btn variant="success" onClick={() => setReferrals(prev => prev.map(x => x.id === r.id ? { ...x, status: 'approved' } : x))} className="flex-1 text-xs">✓ Schváliť</Btn>
                <Btn variant="danger" onClick={() => setReferrals(prev => prev.map(x => x.id === r.id ? { ...x, status: 'cancelled' } : x))} className="flex-1 text-xs">✗ Zamietnuť</Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );

  // ═══════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════
  const renderModals = () => {
    if (!modal) return null;

    if (modal === 'add-exercise') return (
      <Modal title="Nové cvičenie" onClose={() => setModal(null)}>
        <div className="space-y-3">
          <Input label="Názov" value={form.name || ''} onChange={v => setForm({ ...form, name: v })} placeholder="Napr. Drepy s činkou" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Trvanie" value={form.duration || ''} onChange={v => setForm({ ...form, duration: v })} placeholder="10 min" />
            <Select label="Typ" value={form.type || 'strength'} onChange={v => setForm({ ...form, type: v })} options={[
              { value: 'strength', label: 'Sila' }, { value: 'cardio', label: 'Kardio' }, { value: 'core', label: 'Core' },
              { value: 'flexibility', label: 'Flexibilita' }, { value: 'stretching', label: 'Strečing' },
            ]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Sekcia" value={form.section || 'telo'} onChange={v => setForm({ ...form, section: v })} options={[
              { value: 'telo', label: 'Telo' }, { value: 'strava', label: 'Strava' }, { value: 'mysel', label: 'Myseľ' },
            ]} />
            <Select label="Prístup" value={form.access || 'premium'} onChange={v => setForm({ ...form, access: v })} options={[
              { value: 'free', label: 'Zadarmo' }, { value: 'premium', label: 'Premium' },
            ]} />
          </div>
          <Input label="Video URL" value={form.videoUrl || ''} onChange={v => setForm({ ...form, videoUrl: v })} placeholder="https://youtube.com/..." />
          <Input label="Popis" value={form.description || ''} onChange={v => setForm({ ...form, description: v })} textarea placeholder="Popis cvičenia..." />
          <Input label="Pokyny (jeden na riadok)" value={form.instructions || ''} onChange={v => setForm({ ...form, instructions: v })} textarea placeholder="Krok 1\nKrok 2\nKrok 3" />
          <Btn variant="primary" onClick={addExercise} className="w-full">Pridať cvičenie</Btn>
        </div>
      </Modal>
    );

    if (modal === 'add-recipe') return (
      <Modal title="Nový recept" onClose={() => setModal(null)}>
        <div className="space-y-3">
          <Input label="Názov" value={form.title || ''} onChange={v => setForm({ ...form, title: v })} placeholder="Napr. Quinoa šalát" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Kategória" value={form.category || 'obed'} onChange={v => setForm({ ...form, category: v })} options={[
              { value: 'ranajky', label: 'Raňajky' }, { value: 'obed', label: 'Obed' }, { value: 'vecera', label: 'Večera' },
              { value: 'snack', label: 'Snack' }, { value: 'smoothie', label: 'Smoothie' },
            ]} />
            <Input label="Čas prípravy (min)" value={form.prepTime || ''} onChange={v => setForm({ ...form, prepTime: v })} type="number" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Input label="Kalórie" value={form.calories || ''} onChange={v => setForm({ ...form, calories: v })} type="number" />
            <Input label="Bielk." value={form.protein || ''} onChange={v => setForm({ ...form, protein: v })} type="number" />
            <Input label="Sachar." value={form.carbs || ''} onChange={v => setForm({ ...form, carbs: v })} type="number" />
            <Input label="Tuky" value={form.fat || ''} onChange={v => setForm({ ...form, fat: v })} type="number" />
          </div>
          <Input label="Ingrediencie (názov|množstvo na riadok)" value={form.ingredients || ''} onChange={v => setForm({ ...form, ingredients: v })} textarea placeholder="Quinoa|200g\nUhorka|1ks\nParadajky|3ks" />
          <Input label="Postup (krok na riadok)" value={form.steps || ''} onChange={v => setForm({ ...form, steps: v })} textarea placeholder="Uvariť quinoa...\nNakrájať zeleninu..." />
          <Input label="Alergény (čiarkou)" value={form.allergens || ''} onChange={v => setForm({ ...form, allergens: v })} placeholder="gluten, dairy, nuts" />
          <Input label="Diéta (čiarkou)" value={form.dietary || ''} onChange={v => setForm({ ...form, dietary: v })} placeholder="vegánske, bezlepkové" />
          <Btn variant="primary" onClick={addRecipe} className="w-full">Pridať recept</Btn>
        </div>
      </Modal>
    );

    if (modal === 'add-meditation') return (
      <Modal title="Nová meditácia" onClose={() => setModal(null)}>
        <div className="space-y-3">
          <Input label="Názov" value={form.title || ''} onChange={v => setForm({ ...form, title: v })} placeholder="Napr. Ranná meditácia" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Trvanie" value={form.duration || ''} onChange={v => setForm({ ...form, duration: v })} placeholder="15 min" />
            <Select label="Kategória" value={form.category || 'relaxácia'} onChange={v => setForm({ ...form, category: v })} options={[
              { value: 'ranná', label: 'Ranná' }, { value: 'večerná', label: 'Večerná' },
              { value: 'relaxácia', label: 'Relaxácia' }, { value: 'dýchanie', label: 'Dýchanie' },
            ]} />
          </div>
          <Input label="Audio URL" value={form.audioUrl || ''} onChange={v => setForm({ ...form, audioUrl: v })} placeholder="https://..." />
          <Input label="Popis" value={form.description || ''} onChange={v => setForm({ ...form, description: v })} textarea />
          <Btn variant="primary" onClick={addMeditation} className="w-full">Pridať meditáciu</Btn>
        </div>
      </Modal>
    );

    if (modal === 'add-user') return (
      <Modal title="Pridať užívateľa" onClose={() => setModal(null)}>
        <div className="space-y-3">
          <Input label="Meno" value={form.name || ''} onChange={v => setForm({ ...form, name: v })} placeholder="Meno Priezvisko" />
          <Input label="Email" value={form.email || ''} onChange={v => setForm({ ...form, email: v })} placeholder="email@example.sk" type="email" />
          <Select label="Program (voliteľné)" value={form.program || ''} onChange={v => setForm({ ...form, program: v })} options={[
            { value: '', label: 'Žiadny' }, ...programs.map(p => ({ value: p.id, label: p.name }))
          ]} />
          <Btn variant="primary" onClick={addSingleUser} className="w-full">Pridať užívateľa</Btn>
        </div>
      </Modal>
    );

    if (modal === 'bulk-import') return (
      <Modal title="Hromadný import užívateľov" onClose={() => setModal(null)}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Emaily (jeden na riadok)</label>
            <textarea value={bulkEmails} onChange={e => setBulkEmails(e.target.value)} rows={6} placeholder="katka@email.sk&#10;jana@email.sk&#10;eva@email.sk" className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none font-mono" style={{ color: colors.textPrimary }} />
          </div>
          <Select label="Priradiť k programu" value={bulkProgram} onChange={setBulkProgram} options={[
            { value: '', label: 'Žiadny' }, ...programs.map(p => ({ value: p.id, label: p.name }))
          ]} />
          <p className="text-xs" style={{ color: colors.textSecondary }}>{bulkEmails.split('\n').filter(e => e.trim()).length} emailov pripravených</p>
          <Btn variant="primary" onClick={bulkImport} className="w-full">Importovať užívateľov</Btn>
        </div>
      </Modal>
    );

    if (modal === 'compose-message') return (
      <Modal title="Nová správa" onClose={() => setModal(null)}>
        <div className="space-y-3">
          <Select label="Príjemca" value={composeTo} onChange={setComposeTo} options={[
            { value: '', label: 'Vybrať...' }, ...users.map(u => ({ value: u.name, label: `${u.name} (${u.email})` }))
          ]} />
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Správa</label>
            <textarea value={composeText} onChange={e => setComposeText(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none" style={{ color: colors.textPrimary }} />
          </div>
          <Btn variant="primary" onClick={sendMessage} className="w-full">Odoslať správu</Btn>
        </div>
      </Modal>
    );

    // Exercise picker for program scheduler
    if (modal.startsWith('pick-exercise-')) {
      const [, , weekStr, dayStr] = modal.split('-');
      const weekIdx = parseInt(weekStr); const dayIdx = parseInt(dayStr);
      return (
        <Modal title={`Pridať cvičenie — ${DAYS_FULL[dayIdx]}`} onClose={() => setModal(null)}>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {exercises.filter(e => e.published).map(e => (
              <button key={e.id} onClick={() => { addExerciseToDay(selectedProgram!, weekIdx, dayIdx, e.id); setModal(null); }} className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{e.name}</span>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>{e.duration} · {e.type}</div>
                  </div>
                  <Plus className="w-4 h-4" style={{ color: colors.strava }} />
                </div>
              </button>
            ))}
          </div>
        </Modal>
      );
    }

    return null;
  };

  // ═══════════════════════════════════════════
  // DESKTOP RENDER FUNCTIONS
  // ═══════════════════════════════════════════
  const renderDesktopUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>User Management</h2>
        <button onClick={() => { resetForm(); setModal('add-user'); }} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: colors.telo }}>
          <UserPlus className="w-4 h-4 mr-2 inline" />
          Add User
        </button>
      </div>
      <UserTable 
        users={users}
        onEdit={handleUserEdit}
        onView={handleUserView}
        onDelete={handleUserDelete}
      />
    </div>
  );

  const renderDesktopContent = () => {
    switch (tab) {
      case 'overview':
        return <DesktopOverview stats={desktopStats} actions={desktopActions} onNavigate={handleDesktopNavigate} />;
      case 'content':
        return <ContentManager />;
      case 'users':
        return renderDesktopUsers();
      case 'programs':
        return renderPrograms();
      case 'exercises':
        return renderExercises();
      case 'recipes':
        return renderRecipes();
      case 'meditations':
        return renderMeditations();
      case 'community':
        return renderCommunity();
      case 'messages':
        return renderMessages();
      case 'referrals':
        return renderReferrals();
      default:
        return <div>Content for {tab}</div>;
    }
  };

  const renderDesktopSidebar = () => (
    <DesktopSidebar 
      activeTab={tab}
      onTabChange={setTab}
      badges={{
        community: flaggedPosts || 0,
        messages: unreadMessages || 0,
        referrals: pendingRefs || 0
      }}
    />
  );

  const renderDesktopHeader = () => (
    <>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
          {TABS.find(t => t.id === tab)?.label || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Layout Toggle */}
        <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
          <button
            onClick={() => toggleDesktopMode(false)}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              manualDesktopMode === false ? 'bg-white text-gray-800' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📱 Mobile
          </button>
          <button
            onClick={() => toggleDesktopMode(null)}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              manualDesktopMode === null ? 'bg-white text-gray-800' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🔄 Auto
          </button>
          <button
            onClick={() => toggleDesktopMode(true)}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              manualDesktopMode === true ? 'bg-white text-gray-800' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🖥️ Desktop
          </button>
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
    </>
  );

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  
  // Determine layout mode
  const currentWidth = window.innerWidth;
  const finalLayoutMode = getLayoutMode();
  const shouldUseDesktop = finalLayoutMode;
  
  // Global toggle that's always rendered regardless of mode
  const renderGlobalToggle = () => (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '5px' }}>ADMIN LAYOUT:</div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={() => toggleDesktopMode(false)}
          style={{
            padding: '5px 8px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer',
            backgroundColor: manualDesktopMode === false ? '#f39c12' : '#555',
            color: '#fff'
          }}
        >
          📱 MOBILE
        </button>
        <button
          onClick={() => toggleDesktopMode(null)}
          style={{
            padding: '5px 8px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer',
            backgroundColor: manualDesktopMode === null ? '#3498db' : '#555',
            color: '#fff'
          }}
        >
          🔄 AUTO
        </button>
        <button
          onClick={() => toggleDesktopMode(true)}
          style={{
            padding: '5px 8px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
            cursor: 'pointer',
            backgroundColor: manualDesktopMode === true ? '#27ae60' : '#555',
            color: '#fff'
          }}
        >
          🖥️ DESKTOP
        </button>
      </div>
      <div style={{ fontSize: '10px', marginTop: '5px', color: '#999' }}>
        Width: {currentWidth}px | Mode: {shouldUseDesktop ? 'Desktop' : 'Mobile'}
      </div>
    </div>
  );
  
  // Desktop Layout
  if (shouldUseDesktop) {
    return (
      <div>
        {renderGlobalToggle()}
        <DesktopAdminLayout
          sidebar={renderDesktopSidebar()}
          header={renderDesktopHeader()}
          content={renderDesktopContent()}
        />
        {renderModals()}
      </div>
    );
  }

  // Mobile Layout (original)
  return (
    <div className="min-h-screen pb-24" style={{ background: colors.bgGradient }}>
      {renderGlobalToggle()}

      {/* Header */}
      <div className="p-4 pt-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/domov')} className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-xl flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Admin Panel</h1>
            <p className="text-xs" style={{ color: colors.textSecondary }}>NeoMe CMS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1">
            <button
              onClick={() => toggleDesktopMode(false)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                manualDesktopMode === false ? 'bg-white text-gray-800' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📱
            </button>
            <button
              onClick={() => toggleDesktopMode(null)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                manualDesktopMode === null ? 'bg-white text-gray-800' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🔄
            </button>
            <button
              onClick={() => toggleDesktopMode(true)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                manualDesktopMode === true ? 'bg-white text-gray-800' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🖥️
            </button>
          </div>
          <ShieldCheck className="w-5 h-5" style={{ color: colors.accent }} />
        </div>
      </div>

      {/* Tabs — scrollable */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); }} className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap" style={{ background: tab === t.id ? colors.telo : 'rgba(255,255,255,0.3)', color: tab === t.id ? '#fff' : colors.textSecondary }}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {t.badge && <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {tab === 'overview' && renderOverview()}
        {tab === 'content' && <ContentManager />}
        {tab === 'programs' && renderPrograms()}
        {tab === 'exercises' && renderExercises()}
        {tab === 'recipes' && renderRecipes()}
        {tab === 'meditations' && renderMeditations()}
        {tab === 'community' && renderCommunity()}
        {tab === 'messages' && renderMessages()}
        {tab === 'users' && renderUsers()}
        {tab === 'referrals' && renderReferrals()}
      </div>

      {/* Modals */}
      {renderModals()}
    </div>
  );
}
