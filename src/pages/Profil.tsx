import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Smartphone, ChevronRight, LogOut, Flame, Dumbbell, User, CreditCard, Globe, HelpCircle, Settings, ArrowLeft } from 'lucide-react';
import ProgressRing from '../../components/v2/ProgressRing';
import { useAuthContext } from '../../contexts/AuthContext';

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

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:scale-[1.01]' : ''} ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(107, 76, 59, 0.08), 0 6px 24px rgba(107, 76, 59, 0.04), 0 3px 12px rgba(107, 76, 59, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

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
        navigate('/profil/pomoc');
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
        background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)', 
        minHeight: '100vh' 
      }}
    >
      {/* Nordic Header */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <User className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Profil</h1>
          </div>
        </div>
      </NordicCard>

      {/* Nordic Avatar + Info */}
      <NordicCard className="p-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold" style={{ background: 'linear-gradient(135deg, #6B4C3B, #8B6A5B)' }}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-[16px] font-semibold mb-1" style={{ color: '#2E2218' }}>
            {user?.user_metadata?.firstName && user?.user_metadata?.lastName 
              ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
              : user?.user_metadata?.full_name 
              ? user.user_metadata.full_name
              : 'Používateľ'
            }
          </h2>
          <p className="text-[12px] mb-4" style={{ color: '#A89B8C' }}>
            {user?.email || 'email@example.com'}
          </p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={handleEditProfile}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl text-[11px] font-medium transition-all"
              style={{ backgroundColor: 'rgba(107, 76, 59, 0.14)', color: '#6B4C3B' }}
            >
              <Edit3 className="w-3 h-3" strokeWidth={1.5} /> 
              Upraviť profil
            </button>
            <button 
              onClick={handleDeviceConnection}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl text-[11px] font-medium transition-all"
              style={{ backgroundColor: 'rgba(107, 76, 59, 0.14)', color: '#6B4C3B' }}
            >
              <Smartphone className="w-3 h-3" strokeWidth={1.5} /> 
              Zariadenie
            </button>
          </div>
        </div>
      </NordicCard>

      {/* Nordic Active Program */}
      {hasProgram ? (
        <NordicCard onClick={() => navigate('/program/bodyforming')} className="p-4">
          <div className="flex items-center gap-4">
            <ProgressRing progress={29} size={44} stroke={3} color="#6B4C3B">
              <span className="text-[9px] font-semibold" style={{ color: '#2E2218' }}>29%</span>
            </ProgressRing>
            <div className="flex-1">
              <p className="text-[13px] font-semibold mb-1" style={{ color: '#2E2218' }}>BodyForming</p>
              <p className="text-[10px]" style={{ color: '#A89B8C' }}>Deň 8 / 28</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium" style={{ color: '#6B4C3B' }}>Pokračovať</span>
              <ChevronRight className="w-3 h-3" style={{ color: '#6B4C3B' }} />
            </div>
          </div>
        </NordicCard>
      ) : (
        <NordicCard className="p-4">
          <div>
            <p className="text-[13px] font-semibold mb-1" style={{ color: '#2E2218' }}>Špeciálna ponuka</p>
            <p className="text-[11px] mb-3" style={{ color: '#A89B8C' }}>Začni svoj prvý program so zľavou 20%!</p>
            <button 
              onClick={() => navigate('/kniznica/telo')} 
              className="flex items-center gap-1 text-[11px] font-medium"
              style={{ color: '#6B4C3B' }}
            >
              Pozrieť programy <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </NordicCard>
      )}

      {/* Nordic Stats */}
      <div className="flex gap-3">
        <NordicCard className="flex-1 p-4 text-center">
          <Flame className="w-5 h-5 mx-auto mb-2" style={{ color: '#B8864A' }} strokeWidth={1.5} />
          <p className="text-[16px] font-bold mb-1" style={{ color: '#2E2218' }}>12</p>
          <p className="text-[9px]" style={{ color: '#A89B8C' }}>dní v sérii</p>
        </NordicCard>
        <NordicCard className="flex-1 p-4 text-center">
          <Dumbbell className="w-5 h-5 mx-auto mb-2" style={{ color: '#6B4C3B' }} strokeWidth={1.5} />
          <p className="text-[16px] font-bold mb-1" style={{ color: '#2E2218' }}>34</p>
          <p className="text-[9px]" style={{ color: '#A89B8C' }}>tréningov</p>
        </NordicCard>
      </div>

      {/* Nordic Monthly Overview */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Settings className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h3 className="text-[13px] font-semibold" style={{ color: '#2E2218' }}>Tento mesiac</h3>
        </div>
        <p className="text-[11px]" style={{ color: '#A89B8C' }}>12 cvičení · 8-dňová séria · 5 meditácií</p>
      </NordicCard>

      {/* Nordic Notification Preferences */}
      <NordicCard className="p-4">
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

      {/* Nordic Settings */}
      <NordicCard className="p-0 overflow-hidden">
        {settingsItems.map((item, i) => (
          <button 
            key={item.label} 
            onClick={() => handleSettingClick(item.action)}
            className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all hover:bg-gray-50 ${
              i < settingsItems.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <item.icon size={16} style={{ color: '#A89B8C' }} />
            <span className="flex-1 text-[13px]" style={{ color: '#2E2218' }}>
              {item.label}
            </span>
            <ChevronRight className="w-4 h-4" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
        ))}
      </NordicCard>

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
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-gray-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: '#2E2218' }}>
                  Upraviť profil
                </h2>
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600"
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
                    className="w-full p-3 rounded-xl text-sm outline-none bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white text-gray-800"
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
                    className="w-full p-3 rounded-xl text-sm outline-none bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white text-gray-800"
                    placeholder="Tvoje priezvisko"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 bg-gray-100 hover:bg-gray-200 text-gray-700"
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
