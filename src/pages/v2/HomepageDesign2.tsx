import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple, Calendar } from 'lucide-react';

// DESIGN 2: Gradient Hierarchy - Each section with unique earthy gradient backgrounds
export default function HomepageDesign2() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(145deg, #F0E6DA 0%, #E8DBC6 50%, #F0E6DA 100%)' }}>
      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Header - Telo Gradient */}
        <div className="rounded-3xl p-6 text-white shadow-xl" style={{ 
          background: 'linear-gradient(135deg, #6B4C3B 0%, #8B6B5C 100%)',
          boxShadow: '0 20px 40px rgba(107, 76, 59, 0.2)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dobrý deň, Sam</h1>
              <p className="text-white/80 text-sm">Streda, 25. február • Slnečno</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <span className="text-2xl">☀️</span>
            </div>
          </div>
        </div>

        {/* Calendar Strip - Strava Gradient */}
        <div className="rounded-2xl p-4 shadow-lg" style={{ 
          background: 'linear-gradient(135deg, #7A9E78 0%, #95B894 100%)'
        }}>
          <div className="flex justify-between">
            {days.map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs text-white/70 mb-2">{day}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  i === selectedDay 
                    ? 'bg-white text-green-700 shadow-lg' 
                    : 'text-white/90 hover:bg-white/20'
                }`}>
                  {i + 23}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today Overview - Myseľ Gradient */}
        <div className="rounded-3xl p-6 shadow-lg text-white" style={{ 
          background: 'linear-gradient(135deg, #A8848B 0%, #C4A3AA 100%)'
        }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Dnes
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-xl">💧</span>
              </div>
              <p className="text-xs font-medium">6/8 pohárov</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-xl">🏃‍♀️</span>
              </div>
              <p className="text-xs font-medium">Cvičenie ✓</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center mb-2 mx-auto">
                <span className="text-xl">🎯</span>
              </div>
              <p className="text-xs font-medium">3/5 návykov</p>
            </div>
          </div>
        </div>

        {/* Water Intake - Accent Gradient */}
        <div className="rounded-3xl p-6 shadow-xl" style={{ 
          background: 'linear-gradient(135deg, #B8864A 0%, #D4A574 100%)'
        }}>
          <div className="flex items-center justify-between mb-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Pitný režim</h3>
                <p className="text-white/80 text-sm">1,5L z 2L dnes</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">75%</div>
              <div className="text-xs text-white/70">hotovo</div>
            </div>
          </div>
          
          {/* Elegant water progress */}
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`flex-1 h-3 rounded-full ${
                  i < 6 ? 'bg-white' : 'bg-white/30'
                }`} />
              ))}
            </div>
            <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-xl py-3 font-semibold transition-colors">
              + Pridať pohár
            </button>
          </div>
        </div>

        {/* Mood & Energy - Periodka Gradient */}
        <div className="rounded-2xl p-5 shadow-lg" style={{ 
          background: 'linear-gradient(135deg, #C27A6E 0%, #DB9B91 100%)'
        }}>
          <h3 className="font-bold text-white text-lg mb-4">Nálada a energia</h3>
          
          <div className="space-y-4">
            {/* Mood */}
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-white/90 text-sm mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Nálada: Výborná 😁
              </p>
              <div className="flex gap-2">
                {['😢', '😔', '😐', '😊', '😁'].map((emoji, i) => (
                  <button key={i} className={`w-10 h-10 rounded-xl text-lg transition-all ${
                    i === 4 ? 'bg-white/40 backdrop-blur scale-110 shadow-lg' : 'bg-white/10 hover:bg-white/20'
                  }`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-white/90 text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Energia: Vysoká ⚡
              </p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`flex-1 h-3 rounded-full ${
                    i <= 4 ? 'bg-white' : 'bg-white/20'
                  }`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements - Luxury Gold Gradient */}
        <div className="rounded-3xl p-6 shadow-2xl text-white" style={{ 
          background: 'linear-gradient(135deg, #B8864A 0%, #E6B887 50%, #B8864A 100%)',
          boxShadow: '0 25px 50px rgba(184, 134, 74, 0.3)'
        }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Wellness Guru</h3>
              <p className="text-white/80 text-sm mb-1">125 komunitných bodov</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '75%' }} />
                </div>
                <span className="text-xs text-white/70">75%</span>
              </div>
              <p className="text-xs text-white/70 mt-1">15 bodov do úrovne 3</p>
            </div>
          </div>
        </div>

        {/* Buddy System - Soft Sage Gradient */}
        <div className="rounded-2xl p-5 shadow-lg text-white" style={{ 
          background: 'linear-gradient(135deg, #7A9E78 0%, #8DB08B 100%)'
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Buddy System</h3>
                <p className="text-white/70 text-sm">2 pripojení aktívnych</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              <div className="w-9 h-9 bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/50">M</div>
              <div className="w-9 h-9 bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/50">A</div>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur rounded-xl p-3">
            <p className="text-white/90 text-sm flex items-center gap-2">
              <span className="text-lg">🎉</span>
              Monika práve dokončila 30-dňovú výzvu!
            </p>
          </div>
        </div>

        {/* Habits Progress - Multi-gradient */}
        <div className="rounded-2xl p-5 shadow-lg" style={{ 
          background: 'linear-gradient(135deg, #6B4C3B 0%, #8B6B5C 50%, #A8848B 100%)'
        }}>
          <div className="flex items-center justify-between mb-4 text-white">
            <h3 className="font-bold text-lg">Denné návyky</h3>
            <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <span className="text-sm font-medium">3/5 ✓</span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Piť vodu', progress: 75, icon: '💧', color: 'bg-blue-400' },
              { name: 'Cvičenie', progress: 100, icon: '🏃‍♀️', color: 'bg-green-400' },
              { name: 'Meditácia', progress: 100, icon: '🧘‍♀️', color: 'bg-purple-400' },
              { name: 'Čítanie', progress: 60, icon: '📚', color: 'bg-orange-400' },
              { name: 'Zdravé jedlo', progress: 40, icon: '🥗', color: 'bg-yellow-400' },
            ].map((habit, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{habit.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{habit.name}</p>
                  </div>
                  <div className="text-white/80 text-xs font-bold">{habit.progress}%</div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${habit.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote - Elegant finish */}
        <div className="rounded-2xl p-6 text-center shadow-lg" style={{ 
          background: 'linear-gradient(135deg, rgba(107, 76, 59, 0.9) 0%, rgba(168, 132, 139, 0.9) 100%)'
        }}>
          <p className="text-white/90 italic text-lg leading-relaxed mb-2">
            "Každý malý krok ťa posúva bližšie k tvojmu cieľu."
          </p>
          <div className="w-12 h-1 bg-white/50 rounded-full mx-auto mt-3" />
        </div>

      </div>
    </div>
  );
}