import { useState } from 'react';
import { ArrowLeft, Calendar, BarChart3, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkoutStatsWidget from '../../components/v2/workouts/WorkoutStatsWidget';
import WorkoutCalendar from '../../components/v2/workouts/WorkoutCalendar';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';

export default function WorkoutHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'calendar'>('stats');
  const { stats, streak, workoutHistory } = useWorkoutHistory();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/profil')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <BarChart3 className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Cvičebná história</h1>
          </div>
        </div>

        {/* Sub-header */}
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Sleduj svoj pokrok a úspechy
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'stats'
                ? 'bg-[#7A9E78] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 size={16} />
            Štatistiky
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'calendar'
                ? 'bg-[#7A9E78] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar size={16} />
            Kalendár
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <WorkoutStatsWidget variant="full" />

          {/* Quick Achievement Summary */}
          {(stats.currentStreak > 0 || stats.longestStreak > 0) && (
            <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6">
              <h3 className="text-[#6B4C3B] font-bold text-lg mb-4 flex items-center gap-2">
                <Award size={20} />
                Tvoje úspechy
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#7A9E78]/20 rounded-xl">
                  <div className="text-[#7A9E78] font-bold text-2xl">{stats.currentStreak}</div>
                  <div className="text-[#6B4C3B] text-sm font-medium">Aktuálna séria</div>
                  <div className="text-[#8B7560] text-xs mt-1">
                    {stats.currentStreak === 1 ? 'deň' : stats.currentStreak < 5 ? 'dni' : 'dní'} v rade
                  </div>
                </div>
                
                <div className="text-center p-4 bg-[#B8864A]/20 rounded-xl">
                  <div className="text-[#B8864A] font-bold text-2xl">{stats.longestStreak}</div>
                  <div className="text-[#6B4C3B] text-sm font-medium">Najdlhšia séria</div>
                  <div className="text-[#8B7560] text-xs mt-1">osobný rekord</div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Workouts List */}
          {stats.recentSessions.length > 0 && (
            <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6">
              <h3 className="text-[#6B4C3B] font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Posledné cvičenia
              </h3>
              
              <div className="space-y-3">
                {stats.recentSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center gap-4 p-3 bg-white/20 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-[#7A9E78]/30 flex items-center justify-center">
                      <span className="text-[#6B4C3B] font-bold text-sm">
                        {session.workoutType === 'telo' ? 'T' : session.workoutType === 'strava' ? 'S' : 'M'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#6B4C3B] font-medium text-sm line-clamp-1">
                        {session.workoutTitle}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-[#8B7560]">
                        <span>{new Date(session.completedAt).toLocaleDateString('sk-SK')}</span>
                        <span>•</span>
                        <span>{session.duration} min</span>
                        {session.program && (
                          <>
                            <span>•</span>
                            <span>{session.program}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-[#7A9E78] text-xs font-medium">
                      ✓ Dokončené
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {stats.totalWorkouts === 0 && (
            <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#7A9E78]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={32} className="text-[#7A9E78]" />
              </div>
              <h3 className="text-[#6B4C3B] font-semibold text-lg mb-2">
                Žiadne cvičenia zatiaľ
              </h3>
              <p className="text-[#8B7560] text-sm max-w-sm mx-auto">
                Keď dokončíš svoje prvé cvičenie, tu uvidíš štatistiky a pokrok.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <WorkoutCalendar />
          
          {stats.totalWorkouts === 0 && (
            <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#7A9E78]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-[#7A9E78]" />
              </div>
              <h3 className="text-[#6B4C3B] font-semibold text-lg mb-2">
                Kalendár bude plný po prvom cvičení
              </h3>
              <p className="text-[#8B7560] text-sm max-w-sm mx-auto">
                Každé dokončené cvičenie sa zobrazí v kalendári ako farebnú bodku.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}