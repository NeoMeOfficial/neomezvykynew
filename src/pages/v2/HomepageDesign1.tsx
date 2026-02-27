import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple } from 'lucide-react';

// DESIGN 1: Minimalist Premium - Clean white cards, varied sizes, subtle shadows
export default function HomepageDesign1() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const habits = [
    { icon: Droplets, name: 'Piť vodu', progress: 6, target: 8, color: '#7A9E78' },
    { icon: Dumbbell, name: 'Cvičenie', progress: 1, target: 1, color: '#6B4C3B' },
    { icon: Apple, name: 'Zdravé jedlo', progress: 3, target: 5, color: '#B8864A' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0E6DA 0%, #EDE0D3 100%)' }}>
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Header - Elevated */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl" style={{ boxShadow: '0 20px 40px rgba(107, 76, 59, 0.1)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#6B4C3B' }}>Dobrý deň, Sam</h1>
              <p style={{ color: '#A0907E' }} className="text-sm">Streda, 25. február</p>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #C27A6E, #B8864A)' }}>
              <span className="text-white text-lg">👋</span>
            </div>
          </div>
        </div>

        {/* Calendar Strip - Floating */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg" style={{ boxShadow: '0 8px 32px rgba(107, 76, 59, 0.08)' }}>
          <div className="flex justify-between">
            {days.map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs mb-2" style={{ color: '#A0907E' }}>{day}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                  i === selectedDay 
                    ? 'text-white shadow-lg' 
                    : 'hover:bg-opacity-50'
                }`} style={
                  i === selectedDay 
                    ? { background: 'linear-gradient(135deg, #6B4C3B, #B8864A)', boxShadow: '0 4px 16px rgba(107, 76, 59, 0.25)' }
                    : { color: '#6B4C3B' }
                }>
                  {i + 23}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today Overview - Hero Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100/50">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Dnes</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <span className="text-2xl">💧</span>
              </div>
              <p className="text-xs text-slate-600">6/8 pohárov</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <span className="text-2xl">🏃‍♀️</span>
              </div>
              <p className="text-xs text-slate-600">Cvičenie ✓</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-xs text-slate-600">3/5 návykov</p>
            </div>
          </div>
        </div>

        {/* Water Intake - Prominent */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-500/10 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Pitný režim</h3>
                <p className="text-sm text-slate-500">6 z 8 pohárov</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-500">75%</div>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${
                i < 6 ? 'bg-blue-500' : 'bg-slate-200'
              }`} />
            ))}
          </div>
          <button className="w-full bg-blue-500 text-white rounded-2xl py-3 font-medium shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors">
            +1 pohár
          </button>
        </div>

        {/* Mood Tracking - Soft Card */}
        <div className="bg-white rounded-2xl p-5 shadow-md shadow-slate-200/30">
          <h3 className="font-bold text-slate-800 mb-3">Nálada a energia</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600 mb-2">Nálada: Dobrá 😊</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <button key={i} className={`w-8 h-8 rounded-xl text-lg ${
                    i <= 4 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-slate-100'
                  }`}>
                    {i <= 2 ? '😢' : i <= 3 ? '😐' : i <= 4 ? '😊' : '😁'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-2">Energia: Vysoká ⚡</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`flex-1 h-2 rounded-full ${
                    i <= 4 ? 'bg-green-400' : 'bg-slate-200'
                  }`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement - Premium Badge */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-3xl p-6 text-white shadow-2xl shadow-amber-500/25">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Wellness Guru</h3>
              <p className="text-yellow-100 text-sm">125 bodov • Úroveň 2</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">+15 bodov do ďalšej úrovne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buddy System - Social Card */}
        <div className="bg-white rounded-2xl p-5 shadow-md shadow-slate-200/30 border border-green-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Moje Buddy</h3>
              <p className="text-sm text-slate-500">2 pripojení</p>
            </div>
          </div>
          <div className="flex -space-x-2 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">M</div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">A</div>
          </div>
          <p className="text-xs text-green-600 font-medium">💪 Monika dosiahla dnes všetky návyky!</p>
        </div>

        {/* Habits - Compact List */}
        <div className="bg-white rounded-2xl p-5 shadow-md shadow-slate-200/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Návyky</h3>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">3/5</span>
          </div>
          <div className="space-y-3">
            {habits.map((habit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: habit.color + '20' }}>
                  <habit.icon className="w-5 h-5" style={{ color: habit.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{habit.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(habit.progress / habit.target) * 100}%`,
                          backgroundColor: habit.color 
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{habit.progress}/{habit.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Quote - Elegant */}
        <div className="bg-slate-800 rounded-2xl p-6 text-center">
          <p className="text-white/90 italic mb-2">"Každý malý krok ťa posúva bližšie k tvojmu cieľu."</p>
          <p className="text-slate-400 text-xs">— NeoMe</p>
        </div>

      </div>
    </div>
  );
}