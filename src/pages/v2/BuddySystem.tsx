import { useState } from 'react';
import { ArrowLeft, Users, UserPlus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BuddyCodeCard from '../../components/v2/buddy/BuddyCodeCard';
import BuddyFinder from '../../components/v2/buddy/BuddyFinder';
import BuddyDashboard from '../../components/v2/buddy/BuddyDashboard';
import { useBuddySystem } from '../../hooks/useBuddySystem';

export default function BuddySystem() {
  const navigate = useNavigate();
  const { stats, hasBuddies } = useBuddySystem();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'find' | 'mycode'>(
    hasBuddies ? 'dashboard' : 'mycode'
  );

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/komunita')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <Users className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Buddy System</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Motivuj sa s kamarátkami
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {(stats.totalBuddies > 0 || stats.pendingRequestsCount > 0) && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 text-center hover:shadow-md transition-all">
            <div className="text-[#7A9E78] font-bold text-2xl">{stats.totalBuddies}</div>
            <div className="text-[#6B4C3B] text-sm">Buddy</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 text-center hover:shadow-md transition-all">
            <div className="text-[#B8864A] font-bold text-2xl">{stats.pendingRequestsCount}</div>
            <div className="text-[#6B4C3B] text-sm">Žiadosti</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 text-center hover:shadow-md transition-all">
            <div className="text-[#A8848B] font-bold text-2xl">{stats.unreadNotifications}</div>
            <div className="text-[#6B4C3B] text-sm">Nové aktivity</div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-[#7A9E78] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users size={16} />
            Moje buddy
          </button>
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'find'
                ? 'bg-[#7A9E78] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserPlus size={16} />
            Nájdi buddy
          </button>
          <button
            onClick={() => setActiveTab('mycode')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'mycode'
                ? 'bg-[#7A9E78] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart size={16} />
            Môj kód
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && <BuddyDashboard />}
        {activeTab === 'find' && <BuddyFinder />}
        {activeTab === 'mycode' && <BuddyCodeCard />}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2" style={{ color: '#2E2218' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
            <Heart className="w-4 h-4" style={{ color: '#B8864A' }} />
          </div>
          Ako funguje Buddy System?
        </h3>
        
        <div className="grid gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#B8864A] text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="text-sm font-medium" style={{ color: '#2E2218' }}>Zdieľaj svoj kód</h4>
              <p className="text-xs" style={{ color: '#6B4C3B' }}>Pošli svoj 6-miestny buddy kód kamarátke</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#7A9E78] text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="text-sm font-medium" style={{ color: '#2E2218' }}>Pripojte sa</h4>
              <p className="text-xs" style={{ color: '#6B4C3B' }}>Ona zadá tvoj kód a pošle žiadosť o spojenie</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#A8848B] text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="text-sm font-medium" style={{ color: '#2E2218' }}>Motivujte sa</h4>
              <p className="text-xs" style={{ color: '#6B4C3B' }}>Vidíte navzájom úspechy a podporujete sa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#2E2218' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
            💡
          </div>
          Tipy pre lepšiu motiváciu
        </h4>
        <ul className="text-xs space-y-2" style={{ color: '#6B4C3B' }}>
          <li className="flex items-start gap-2">
            <span className="text-[#B8864A] mt-0.5">•</span>
            <span>Dohodnte si spoločné cvičenie o rovnakom čase</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#B8864A] mt-0.5">•</span>
            <span>Gratulujte si navzájom k úspechom</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#B8864A] mt-0.5">•</span>
            <span>Vytvorte si týždenné výzvy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#B8864A] mt-0.5">•</span>
            <span>Zdieľajte pokrok vo svojich obľúbených receptoch</span>
          </li>
        </ul>
      </div>
    </div>
  );
}