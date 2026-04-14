import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Smartphone, ChevronRight, LogOut, Flame, Dumbbell, User, CreditCard, Globe, HelpCircle, Settings, Gift, UserPlus, Users } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import ProgressRing from '../../components/v2/ProgressRing';
import { useAuthContext } from '../../contexts/AuthContext';
import { colors } from '../../theme/warmDusk';

const settingsItems = [
  { label: 'Osobné údaje', icon: User, action: 'edit-profile' },
  { label: 'Predplatné', icon: CreditCard, action: 'subscription' },
  { label: 'Jazyk', icon: Globe, action: 'language' },
  { label: 'Pomoc a spätná väzba', icon: HelpCircle, action: 'help' },
];

const notifPrefs = [
  { label: 'Správy od Gabi', key: 'gabi' },
  { label: 'Odpovede na otázky', key: 'answers' },
  { label: 'Pripomienky návykov', key: 'habits' },
  { label: 'Komunita', key: 'community' },
  { label: 'Novinky', key: 'news' },
];

export default function Profil() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const [hasProgram] = useState(true);
  const [notifs, setNotifs] = useState<Record<string, boolean>>({ 
    gabi: true, 
    answers: true, 
    habits: true, 
    community: false, 
    news: true 
  });
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleSettingClick = (action: string) => {
    switch(action) {
      case 'edit-profile':
        setShowEditProfile(true);
        break;
      case 'subscription':
        navigate('/profil/predplatne');
        break;
      case 'language':
        alert('Nastavenie jazyka bude dostupné v budúcej verzii');
        break;
      case 'help':
        navigate('/spravy');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Naozaj sa chceš odhlásiť?');
    if (confirmed) {
      try {
        await signOut();
        navigate('/auth');
      } catch (error) {
        console.error('Logout error:', error);
        alert('Chyba pri odhlasovaní');
      }
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleDeviceConnection = () => {
    alert('Pripájanie zariadení bude dostupné v budúcej verzii');
  };

  return (
    <div 
      className="w-full min-h-screen px-3 py-6 pb-28 space-y-6"
      style={{ 
        background: colors.bgGradient, 
        minHeight: '100vh' 
      }}
    >
      {/* Avatar + Info */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#D4B8A0] mb-3 flex items-center justify-center">
            {user?.email && (
              <span className="text-2xl font-semibold" style={{ color: '#6B4C3B' }}>
                {user.email.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-lg font-semibold" style={{ color: '#2E2218' }}>
            {user?.user_metadata?.firstName && user?.user_metadata?.lastName 
              ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
              : user?.user_metadata?.full_name 
              ? user.user_metadata.full_name
              : 'Používateľ'
            }
          </h1>
          <p className="text-xs text-gray-500 mb-4">
            {user?.email || 'email@example.com'}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleEditProfile}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/25 active:scale-95 bg-white/20 text-gray-700"
            >
              <Edit3 className="w-3.5 h-3.5" strokeWidth={1.5} /> 
              Upraviť profil
            </button>
            <button 
              onClick={handleDeviceConnection}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:bg-white/25 active:scale-95 bg-white/20 text-gray-700"
            >
              <Smartphone className="w-3.5 h-3.5" strokeWidth={1.5} /> 
              Pripojiť zariadenie
            </button>
          </div>
        </div>
      </div>

      {/* Active Program or Offer */}
      {hasProgram ? (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/program/bodyforming')}>
          <div className="flex items-center gap-4">
            <ProgressRing progress={29} size={52} stroke={4} color="#6B4C3B">
              <span className="text-[10px] font-semibold text-[#2E2218]">29%</span>
            </ProgressRing>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2E2218]">BodyForming</p>
              <p className="text-xs text-gray-500">Deň 8 / 28</p>
            </div>
            <span className="text-xs font-medium text-[#6B4C3B] flex items-center gap-1">Pokračovať <ChevronRight className="w-3.5 h-3.5" /></span>
          </div>
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30" style={{ background: 'linear-gradient(135deg, rgba(107, 76, 59, 0.05), rgba(255,255,255,1))' }}>
          <p className="text-sm font-semibold text-[#2E2218]">Špeciálna ponuka</p>
          <p className="text-xs text-gray-600 mt-1">Začni svoj prvý program so zľavou 20%!</p>
          <button onClick={() => navigate('/kniznica/telo')} className="mt-3 text-xs font-medium text-[#6B4C3B] flex items-center gap-1">
            Pozrieť programy <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 text-center">
          <Flame className="w-6 h-6 text-[#B8864A] mx-auto mb-1" strokeWidth={1.5} />
          <p className="text-lg font-bold text-[#2E2218]">12</p>
          <p className="text-[10px] text-gray-500">dní v sérii</p>
        </div>
        <div className="flex-1 bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 text-center">
          <Dumbbell className="w-6 h-6 text-[#6B4C3B] mx-auto mb-1" strokeWidth={1.5} />
          <p className="text-lg font-bold text-[#2E2218]">34</p>
          <p className="text-[10px] text-gray-500">tréningov</p>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Settings className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Tento mesiac</h3>
        </div>
        <p className="text-xs text-gray-600">12 cvičení · 8-dňová séria · 5 meditácií</p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Settings className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Notifikácie</h3>
        </div>
        <div className="space-y-3">
          {notifPrefs.map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{n.label}</span>
              <button
                onClick={() => setNotifs({ ...notifs, [n.key]: !notifs[n.key] })}
                className={`w-10 h-6 rounded-full transition-colors relative ${notifs[n.key] ? 'bg-[#6B4C3B]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifs[n.key] ? 'left-5' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Section - Odporúčaj & získaj */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(184, 134, 74, 0.2)' }}>
            <UserPlus className="w-4 h-4" style={{ color: '#B8864A' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Odporúčaj & získaj</h3>
        </div>
        
        <div className="bg-white/40 backdrop-blur-xl rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: '#B8864A' }} />
              <span className="text-sm font-semibold" style={{ color: '#2E2218' }}>
                Pozvi kamarátky
              </span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(184, 134, 74, 0.15)', color: '#6B4C3B' }}>
              Mesiac zdarma
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: '#6B4C3B' }}>
            Za každú novú používateľku získaš mesiac predplatného zdarma
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/buddy-system', { state: { from: '/profil' } })}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium text-white transition-all active:scale-95"
              style={{ backgroundColor: '#B8864A' }}
            >
              Zdieľaj kód
            </button>
            <button 
              onClick={() => navigate('/komunita', { state: { from: '/profil', tab: 'discounts' } })}
              className="py-2 px-3 rounded-lg text-xs font-medium transition-all active:scale-95 bg-white/40 border border-white/40"
              style={{ color: '#6B4C3B' }}
            >
              Zľavy partnerov
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs" style={{ color: '#8B7560' }}>
            Už si pozvala <span className="font-semibold">0 kamarátok</span>
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-0 shadow-sm border border-white/20 overflow-hidden">
        {settingsItems.map((item, i) => (
          <button 
            key={item.label} 
            onClick={() => handleSettingClick(item.action)}
            className={`w-full flex items-center gap-3 px-4 py-4 text-sm transition-all hover:bg-white/20 active:bg-white/25 ${
              i < settingsItems.length - 1 ? 'border-b border-white/30' : ''
            }`}
            style={(item as any).highlight ? { background: 'rgba(184,134,74,0.08)' } : {}}
          >
            <item.icon size={18} className={(item as any).highlight ? '' : 'text-gray-500'} style={(item as any).highlight ? { color: '#B8864A' } : {}} />
            <span className="flex-1 text-left" style={(item as any).highlight ? { color: '#B8864A', fontWeight: 600 } : { color: '#374151' }}>
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} style={(item as any).highlight ? { color: '#B8864A' } : { color: '#9CA3AF' }} />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all active:scale-95 text-red-600"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.5} /> 
        Odhlásiť sa
      </button>
      <p className="text-[10px] text-center pb-4 text-gray-400">
        NeoMe v1.0.0
      </p>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: '#2E2218' }}>
                  Upraviť profil
                </h2>
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/25 hover:bg-gray-200 text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: '#2E2218' }}>
                    Meno
                  </label>
                  <input 
                    type="text" 
                    defaultValue={user?.user_metadata?.firstName || ''}
                    className="w-full p-3 rounded-xl text-sm outline-none bg-white/60 border border-gray-200 focus:border-gray-400 focus:bg-white text-gray-800"
                    placeholder="Tvoje meno"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: '#2E2218' }}>
                    Priezvisko
                  </label>
                  <input 
                    type="text" 
                    defaultValue={user?.user_metadata?.lastName || ''}
                    className="w-full p-3 rounded-xl text-sm outline-none bg-white/60 border border-gray-200 focus:border-gray-400 focus:bg-white text-gray-800"
                    placeholder="Tvoje priezvisko"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 bg-white/60 hover:bg-gray-200 text-gray-700 border border-gray-200"
                >
                  Zrušiť
                </button>
                <button 
                  onClick={() => {
                    // In real app, this would save to database
                    alert('Profil aktualizovaný! (Demo)');
                    setShowEditProfile(false);
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                  style={{ backgroundColor: '#6B4C3B' }}
                >
                  Uložiť
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
