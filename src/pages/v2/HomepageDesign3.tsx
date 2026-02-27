import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple, Sparkles, Sun } from 'lucide-react';

// DESIGN 3: True Glassmorphism - Varied transparency and blur effects with warm earthy tones
export default function HomepageDesign3() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(145deg, #F0E6DA 0%, #E8DBC6 25%, #F0E6DA 50%, #EDE0D3 75%, #F0E6DA 100%)'
    }}>
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20" style={{ 
          background: 'radial-gradient(circle, #C27A6E 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div className="absolute top-60 right-8 w-40 h-40 rounded-full opacity-15" style={{ 
          background: 'radial-gradient(circle, #7A9E78 0%, transparent 70%)',
          filter: 'blur(50px)'
        }} />
        <div className="absolute bottom-40 left-6 w-28 h-28 rounded-full opacity-25" style={{ 
          background: 'radial-gradient(circle, #B8864A 0%, transparent 70%)',
          filter: 'blur(30px)'
        }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto p-4 space-y-5">
        
        {/* Header - Ultra Glass */}
        <div className="backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30" style={{ 
          background: 'rgba(255, 255, 255, 0.25)',
          boxShadow: '0 25px 45px rgba(107, 76, 59, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
        }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#6B4C3B' }}>Dobrý deň, Sam</h1>
              <p style={{ color: '#A0907E' }} className="text-sm flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Streda, 25. február • 22°C
              </p>
            </div>
            <div className="w-14 h-14 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg border border-white/40" style={{ 
              background: 'rgba(199, 122, 110, 0.3)'
            }}>
              <span className="text-2xl">☀️</span>
            </div>
          </div>
        </div>

        {/* Calendar Strip - Soft Glass */}
        <div className="backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20" style={{ 
          background: 'rgba(255, 255, 255, 0.15)'
        }}>
          <div className="flex justify-between">
            {days.map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs mb-2" style={{ color: '#A0907E' }}>{day}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  i === selectedDay ? 'shadow-lg' : 'hover:scale-105'
                }`} style={
                  i === selectedDay 
                    ? { 
                        background: 'rgba(107, 76, 59, 0.8)', 
                        color: 'white',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 25px rgba(107, 76, 59, 0.25)'
                      }
                    : { color: '#6B4C3B', background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)' }
                }>
                  {i + 23}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today Overview - Hero Glass */}
        <div className="backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20" style={{ 
          background: 'rgba(168, 132, 139, 0.15)'
        }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#6B4C3B' }}>
            <Sparkles className="w-5 h-5" />
            Dnešný prehľad
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '💧', label: '6/8 pohárov', value: '75%', color: 'rgba(122, 158, 120, 0.2)' },
              { icon: '🏃‍♀️', label: 'Cvičenie', value: '✓', color: 'rgba(107, 76, 59, 0.2)' },
              { icon: '🎯', label: 'Návyky', value: '3/5', color: 'rgba(184, 134, 74, 0.2)' }
            ].map((item, i) => (
              <div key={i} className="backdrop-blur-lg rounded-2xl p-4 text-center shadow-md border border-white/30" style={{ 
                background: item.color 
              }}>
                <div className="w-12 h-12 backdrop-blur-md rounded-xl flex items-center justify-center mb-2 mx-auto shadow-sm" style={{ 
                  background: 'rgba(255, 255, 255, 0.4)' 
                }}>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="text-lg font-bold mb-1" style={{ color: '#6B4C3B' }}>{item.value}</div>
                <p className="text-xs" style={{ color: '#8B7560' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Water Intake - Flowing Glass */}
        <div className="backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/25" style={{ 
          background: 'rgba(122, 158, 120, 0.12)'
        }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-md border border-white/40" style={{ 
                background: 'rgba(122, 158, 120, 0.3)' 
              }}>
                <Droplets className="w-6 h-6" style={{ color: '#7A9E78' }} />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#6B4C3B' }}>Hydratácia</h3>
                <p style={{ color: '#8B7560' }} className="text-sm">Výborne pokračuješ!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold mb-1" style={{ color: '#7A9E78' }}>75%</div>
              <div className="text-xs" style={{ color: '#A0907E' }}>1,5L / 2L</div>
            </div>
          </div>
          
          {/* Water glasses visualization */}
          <div className="backdrop-blur-md rounded-2xl p-4 shadow-inner border border-white/20" style={{ 
            background: 'rgba(255, 255, 255, 0.15)' 
          }}>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-6 h-8 rounded-lg border-2 relative overflow-hidden transition-all ${
                  i < 6 ? 'shadow-md' : ''
                }`} style={{
                  borderColor: '#7A9E78',
                  background: i < 6 ? 'rgba(122, 158, 120, 0.3)' : 'rgba(255, 255, 255, 0.2)'
                }}>
                  {i < 6 && (
                    <div className="absolute bottom-0 left-0 right-0 rounded-b" style={{ 
                      height: '80%', 
                      background: 'linear-gradient(to top, rgba(122, 158, 120, 0.6), rgba(122, 158, 120, 0.3))'
                    }} />
                  )}
                </div>
              ))}
            </div>
            <button className="w-full backdrop-blur-lg rounded-xl py-3 font-semibold shadow-lg border border-white/30 transition-all hover:scale-[1.02]" style={{ 
              background: 'rgba(122, 158, 120, 0.25)',
              color: '#6B4C3B'
            }}>
              + Pridať pohár
            </button>
          </div>
        </div>

        {/* Mood & Energy - Dreamy Glass */}
        <div className="backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-white/20" style={{ 
          background: 'rgba(199, 122, 110, 0.12)'
        }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#6B4C3B' }}>
            <Heart className="w-5 h-5" />
            Ako sa cítiš?
          </h3>
          
          <div className="space-y-4">
            {/* Mood selector */}
            <div className="backdrop-blur-md rounded-xl p-4 border border-white/30" style={{ 
              background: 'rgba(255, 255, 255, 0.15)' 
            }}>
              <p className="text-sm mb-3" style={{ color: '#8B7560' }}>Nálada</p>
              <div className="flex gap-2">
                {['😢', '😔', '😐', '😊', '😁'].map((emoji, i) => (
                  <button key={i} className={`w-11 h-11 rounded-xl text-xl transition-all backdrop-blur-md border ${
                    i === 4 ? 'scale-110 shadow-lg' : 'hover:scale-105'
                  }`} style={
                    i === 4 
                      ? { 
                          background: 'rgba(199, 122, 110, 0.4)', 
                          borderColor: 'rgba(199, 122, 110, 0.6)',
                          boxShadow: '0 8px 25px rgba(199, 122, 110, 0.25)'
                        }
                      : { background: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.3)' }
                  }>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy level */}
            <div className="backdrop-blur-md rounded-xl p-4 border border-white/30" style={{ 
              background: 'rgba(255, 255, 255, 0.15)' 
            }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm" style={{ color: '#8B7560' }}>Energia</p>
                <span className="text-lg">⚡</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`flex-1 h-3 rounded-full backdrop-blur-sm border ${
                    i <= 4 ? 'shadow-sm' : ''
                  }`} style={{
                    background: i <= 4 
                      ? 'linear-gradient(90deg, rgba(184, 134, 74, 0.6), rgba(184, 134, 74, 0.8))' 
                      : 'rgba(255, 255, 255, 0.2)',
                    borderColor: i <= 4 ? 'rgba(184, 134, 74, 0.3)' : 'rgba(255, 255, 255, 0.2)'
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements - Luxe Glass */}
        <div className="backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30" style={{ 
          background: 'rgba(184, 134, 74, 0.15)',
          boxShadow: '0 25px 50px rgba(184, 134, 74, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
        }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg border border-white/40" style={{ 
              background: 'rgba(184, 134, 74, 0.3)' 
            }}>
              <Crown className="w-8 h-8" style={{ color: '#B8864A' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1" style={{ color: '#6B4C3B' }}>Wellness Guru</h3>
              <p className="text-sm mb-2" style={{ color: '#8B7560' }}>125 komunitných bodov</p>
              
              {/* Progress bar */}
              <div className="backdrop-blur-sm rounded-full p-1 border border-white/30" style={{ 
                background: 'rgba(255, 255, 255, 0.15)' 
              }}>
                <div className="h-2 rounded-full relative overflow-hidden" style={{ 
                  background: 'rgba(255, 255, 255, 0.2)' 
                }}>
                  <div className="absolute inset-0 rounded-full" style={{ 
                    width: '75%', 
                    background: 'linear-gradient(90deg, rgba(184, 134, 74, 0.8), rgba(184, 134, 74, 0.6))',
                    boxShadow: '0 0 10px rgba(184, 134, 74, 0.3)'
                  }} />
                </div>
              </div>
              <p className="text-xs mt-1" style={{ color: '#A0907E' }}>15 bodov do úrovne 3</p>
            </div>
          </div>
        </div>

        {/* Buddy System - Social Glass */}
        <div className="backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/25" style={{ 
          background: 'rgba(122, 158, 120, 0.1)'
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-md border border-white/40" style={{ 
                background: 'rgba(122, 158, 120, 0.25)' 
              }}>
                <Users className="w-5 h-5" style={{ color: '#7A9E78' }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: '#6B4C3B' }}>Wellness Buddy</h3>
                <p style={{ color: '#8B7560' }} className="text-sm">2 aktívne pripojenia</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {['M', 'A'].map((letter, i) => (
                <div key={i} className="w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center text-sm font-bold border-2 shadow-md" style={{ 
                  background: 'rgba(122, 158, 120, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#6B4C3B'
                }}>
                  {letter}
                </div>
              ))}
            </div>
          </div>
          
          <div className="backdrop-blur-md rounded-xl p-3 border border-white/30" style={{ 
            background: 'rgba(255, 255, 255, 0.1)' 
          }}>
            <p className="text-sm flex items-center gap-2" style={{ color: '#6B4C3B' }}>
              <span className="text-lg">🎉</span>
              Monika práve dokončila dnes všetky návyky!
            </p>
          </div>
        </div>

        {/* Habits - Floating Glass Cards */}
        <div className="backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20" style={{ 
          background: 'rgba(107, 76, 59, 0.08)'
        }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg" style={{ color: '#6B4C3B' }}>Denné návyky</h3>
            <div className="backdrop-blur-md px-3 py-1 rounded-full border border-white/30 shadow-sm" style={{ 
              background: 'rgba(255, 255, 255, 0.2)' 
            }}>
              <span className="text-sm font-medium" style={{ color: '#6B4C3B' }}>3/5</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '💧', name: 'Voda', progress: 75, completed: false },
              { icon: '🏃‍♀️', name: 'Cvičenie', progress: 100, completed: true },
              { icon: '🧘‍♀️', name: 'Meditácia', progress: 100, completed: true },
              { icon: '📚', name: 'Čítanie', progress: 60, completed: false },
              { icon: '🥗', name: 'Zdravé jedlo', progress: 40, completed: false }
            ].map((habit, i) => (
              <div key={i} className={`backdrop-blur-lg rounded-xl p-3 border transition-all hover:scale-[1.02] ${
                habit.completed ? 'shadow-md' : 'shadow-sm'
              }`} style={{ 
                background: habit.completed 
                  ? 'rgba(122, 158, 120, 0.15)' 
                  : 'rgba(255, 255, 255, 0.1)',
                borderColor: habit.completed 
                  ? 'rgba(122, 158, 120, 0.3)' 
                  : 'rgba(255, 255, 255, 0.2)'
              }}>
                <div className="text-center">
                  <div className="text-2xl mb-2">{habit.icon}</div>
                  <p className="text-xs font-medium mb-2" style={{ color: '#6B4C3B' }}>{habit.name}</p>
                  <div className="w-full h-1.5 rounded-full backdrop-blur-sm" style={{ 
                    background: 'rgba(255, 255, 255, 0.2)' 
                  }}>
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${habit.progress}%`,
                        background: habit.completed 
                          ? 'linear-gradient(90deg, rgba(122, 158, 120, 0.8), rgba(122, 158, 120, 0.6))' 
                          : 'linear-gradient(90deg, rgba(184, 134, 74, 0.6), rgba(184, 134, 74, 0.4))'
                      }}
                    />
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#8B7560' }}>{habit.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote - Ethereal Glass */}
        <div className="backdrop-blur-xl rounded-3xl p-6 text-center shadow-xl border border-white/30" style={{ 
          background: 'rgba(168, 132, 139, 0.1)'
        }}>
          <div className="w-16 h-16 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/40" style={{ 
            background: 'rgba(168, 132, 139, 0.2)' 
          }}>
            <Sparkles className="w-6 h-6" style={{ color: '#A8848B' }} />
          </div>
          <p className="text-lg leading-relaxed mb-3 italic" style={{ color: '#6B4C3B' }}>
            "Každý malý krok ťa posúva bližšie k tvojmu cieľu."
          </p>
          <div className="w-20 h-0.5 rounded-full mx-auto" style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(168, 132, 139, 0.4), transparent)' 
          }} />
        </div>

      </div>
    </div>
  );
}