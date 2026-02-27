import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple, Sun, Leaf } from 'lucide-react';

// CALM DESIGN 1: Zen Minimalist - Ultra-soft earthy tones, lots of whitespace, gentle shadows
export default function CalmDesign1() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const habits = [
    { icon: Droplets, name: 'Piť vodu', progress: 6, target: 8, color: '#7A9E78' },
    { icon: Dumbbell, name: 'Cvičenie', progress: 1, target: 1, color: '#6B4C3B' },
    { icon: Apple, name: 'Zdravé jedlo', progress: 3, target: 5, color: '#B8864A' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#FDFCFA' }}>
      <div className="max-w-md mx-auto p-6 space-y-8">
        
        {/* Header - Ultra Soft */}
        <div className="pt-4 pb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-light mb-2" style={{ color: '#6B4C3B', letterSpacing: '0.01em' }}>
                Dobrý deň,<br/>
                <span className="font-medium">Sam</span>
              </h1>
              <p style={{ color: '#A89B8C' }} className="text-sm font-light flex items-center gap-2">
                <Sun className="w-4 h-4 opacity-60" />
                Streda, 25. február
              </p>
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mt-2" style={{ 
              background: 'linear-gradient(135deg, #F5F1ED 0%, #EAE3D8 100%)',
              border: '1px solid rgba(107, 76, 59, 0.08)'
            }}>
              <span className="text-2xl opacity-80">☀️</span>
            </div>
          </div>
        </div>

        {/* Calendar Strip - Floating Soft */}
        <div className="bg-white rounded-3xl p-6 mb-8" style={{ 
          boxShadow: '0 8px 32px rgba(107, 76, 59, 0.04)',
          border: '1px solid rgba(107, 76, 59, 0.05)'
        }}>
          <div className="flex justify-between">
            {days.map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs font-light mb-3" style={{ color: '#B5A594' }}>{day}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm transition-all duration-300 ${
                  i === selectedDay ? '' : 'hover:scale-105'
                }`} style={
                  i === selectedDay 
                    ? { 
                        background: 'rgba(107, 76, 59, 0.06)',
                        color: '#6B4C3B',
                        fontWeight: '500',
                        border: '1px solid rgba(107, 76, 59, 0.12)'
                      }
                    : { 
                        color: '#A89B8C', 
                        fontWeight: '300'
                      }
                }>
                  {i + 23}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today Overview - Breathing Space */}
        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-light text-center mb-6" style={{ color: '#8B7560', letterSpacing: '0.02em' }}>
            Dnešný pokrok
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ 
                background: 'rgba(122, 158, 120, 0.04)',
                border: '1px solid rgba(122, 158, 120, 0.08)'
              }}>
                <span className="text-2xl opacity-70">💧</span>
              </div>
              <div className="text-lg font-light mb-1" style={{ color: '#7A9E78' }}>6/8</div>
              <p className="text-xs font-light" style={{ color: '#B5A594' }}>pohárov</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ 
                background: 'rgba(107, 76, 59, 0.04)',
                border: '1px solid rgba(107, 76, 59, 0.08)'
              }}>
                <span className="text-2xl opacity-70">✨</span>
              </div>
              <div className="text-lg font-light mb-1" style={{ color: '#6B4C3B' }}>Hotovo</div>
              <p className="text-xs font-light" style={{ color: '#B5A594' }}>cvičenie</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ 
                background: 'rgba(184, 134, 74, 0.04)',
                border: '1px solid rgba(184, 134, 74, 0.08)'
              }}>
                <span className="text-2xl opacity-70">🎯</span>
              </div>
              <div className="text-lg font-light mb-1" style={{ color: '#B8864A' }}>3/5</div>
              <p className="text-xs font-light" style={{ color: '#B5A594' }}>návykov</p>
            </div>
          </div>
        </div>

        {/* Water Intake - Serene */}
        <div className="bg-white rounded-3xl p-8 mb-8" style={{ 
          boxShadow: '0 12px 40px rgba(122, 158, 120, 0.06)',
          border: '1px solid rgba(122, 158, 120, 0.08)'
        }}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ 
              background: 'rgba(122, 158, 120, 0.06)',
              border: '1px solid rgba(122, 158, 120, 0.1)'
            }}>
              <Droplets className="w-8 h-8 opacity-60" style={{ color: '#7A9E78' }} />
            </div>
            <h3 className="font-light text-lg mb-2" style={{ color: '#6B4C3B' }}>Pitný režim</h3>
            <p className="text-sm font-light" style={{ color: '#A89B8C' }}>Krásne pokračuješ</p>
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-light mb-2" style={{ color: '#7A9E78' }}>75%</div>
              <div className="text-xs font-light" style={{ color: '#B5A594' }}>1,5L z 2L</div>
            </div>

            {/* Minimal progress dots */}
            <div className="flex justify-center gap-3">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i < 6 ? 'opacity-100' : 'opacity-30'
                }`} style={{
                  background: i < 6 ? '#7A9E78' : '#E0D7CC'
                }} />
              ))}
            </div>

            <button className="w-full py-4 rounded-2xl font-light text-sm transition-all duration-300 hover:scale-[1.01]" style={{ 
              background: 'rgba(122, 158, 120, 0.06)',
              color: '#7A9E78',
              border: '1px solid rgba(122, 158, 120, 0.12)'
            }}>
              Pridať pohár
            </button>
          </div>
        </div>

        {/* Mood & Energy - Gentle */}
        <div className="bg-white rounded-3xl p-8 mb-8" style={{ 
          boxShadow: '0 12px 40px rgba(199, 122, 110, 0.06)',
          border: '1px solid rgba(199, 122, 110, 0.08)'
        }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ 
              background: 'rgba(199, 122, 110, 0.06)',
              border: '1px solid rgba(199, 122, 110, 0.1)'
            }}>
              <Heart className="w-6 h-6 opacity-60" style={{ color: '#C27A6E' }} />
            </div>
            <h3 className="font-light text-lg" style={{ color: '#6B4C3B' }}>Ako sa cítiš?</h3>
          </div>
          
          <div className="space-y-8">
            {/* Mood */}
            <div>
              <p className="text-sm font-light mb-4 text-center" style={{ color: '#A89B8C' }}>Nálada</p>
              <div className="flex justify-center gap-4">
                {['😢', '😔', '😐', '😊', '😁'].map((emoji, i) => (
                  <button key={i} className={`w-12 h-12 rounded-full text-xl transition-all duration-300 ${
                    i === 4 ? 'scale-110' : 'hover:scale-105 opacity-70'
                  }`} style={
                    i === 4 
                      ? { 
                          background: 'rgba(199, 122, 110, 0.08)',
                          border: '1px solid rgba(199, 122, 110, 0.15)'
                        }
                      : { background: 'rgba(107, 76, 59, 0.03)' }
                  }>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div>
              <p className="text-sm font-light mb-4 text-center" style={{ color: '#A89B8C' }}>Energia</p>
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`w-8 h-2 rounded-full transition-all duration-500 ${
                    i <= 4 ? '' : 'opacity-30'
                  }`} style={{
                    background: i <= 4 ? '#C27A6E' : '#E0D7CC'
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement - Elegant */}
        <div className="bg-white rounded-3xl p-8 mb-8" style={{ 
          boxShadow: '0 12px 40px rgba(184, 134, 74, 0.06)',
          border: '1px solid rgba(184, 134, 74, 0.08)'
        }}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ 
              background: 'rgba(184, 134, 74, 0.06)',
              border: '1px solid rgba(184, 134, 74, 0.1)'
            }}>
              <Crown className="w-8 h-8 opacity-60" style={{ color: '#B8864A' }} />
            </div>
            <h3 className="font-light text-xl mb-2" style={{ color: '#6B4C3B' }}>Wellness Guru</h3>
            <p className="text-sm font-light mb-4" style={{ color: '#A89B8C' }}>125 komunitných bodov</p>
            
            <div className="space-y-3">
              <div className="w-full h-1 rounded-full" style={{ background: 'rgba(184, 134, 74, 0.1)' }}>
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: '75%',
                    background: 'rgba(184, 134, 74, 0.4)'
                  }}
                />
              </div>
              <p className="text-xs font-light" style={{ color: '#B5A594' }}>15 bodov do úrovne 3</p>
            </div>
          </div>
        </div>

        {/* Buddy System - Social Calm */}
        <div className="bg-white rounded-3xl p-8 mb-8" style={{ 
          boxShadow: '0 12px 40px rgba(122, 158, 120, 0.06)',
          border: '1px solid rgba(122, 158, 120, 0.08)'
        }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ 
              background: 'rgba(122, 158, 120, 0.06)',
              border: '1px solid rgba(122, 158, 120, 0.1)'
            }}>
              <Users className="w-6 h-6 opacity-60" style={{ color: '#7A9E78' }} />
            </div>
            <h3 className="font-light text-lg mb-2" style={{ color: '#6B4C3B' }}>Wellness Buddy</h3>
            <p className="text-sm font-light" style={{ color: '#A89B8C' }}>2 pripojenia</p>
          </div>
          
          <div className="flex justify-center -space-x-4 mb-6">
            {['M', 'A'].map((letter, i) => (
              <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-light border-2 border-white" style={{ 
                background: 'rgba(122, 158, 120, 0.08)',
                color: '#7A9E78'
              }}>
                {letter}
              </div>
            ))}
          </div>
          
          <div className="text-center p-4 rounded-2xl" style={{ 
            background: 'rgba(122, 158, 120, 0.04)',
            border: '1px solid rgba(122, 158, 120, 0.08)'
          }}>
            <p className="text-sm font-light flex items-center justify-center gap-2" style={{ color: '#6B4C3B' }}>
              <span className="opacity-70">🌸</span>
              Monika dokončila dnes všetky návyky
            </p>
          </div>
        </div>

        {/* Habits - Zen List */}
        <div className="bg-white rounded-3xl p-8 mb-8" style={{ 
          boxShadow: '0 12px 40px rgba(107, 76, 59, 0.06)',
          border: '1px solid rgba(107, 76, 59, 0.08)'
        }}>
          <div className="text-center mb-8">
            <h3 className="font-light text-lg mb-2" style={{ color: '#6B4C3B' }}>Denné návyky</h3>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ 
              background: 'rgba(107, 76, 59, 0.04)',
              border: '1px solid rgba(107, 76, 59, 0.08)'
            }}>
              <span className="text-sm font-light" style={{ color: '#6B4C3B' }}>3 z 5</span>
            </div>
          </div>

          <div className="space-y-6">
            {habits.map((habit, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ 
                  background: `rgba(${habit.color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.06)`,
                  border: `1px solid rgba(${habit.color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.1)`
                }}>
                  <habit.icon className="w-5 h-5 opacity-60" style={{ color: habit.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-light text-sm mb-2" style={{ color: '#6B4C3B' }}>{habit.name}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(107, 76, 59, 0.08)' }}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${(habit.progress / habit.target) * 100}%`,
                          background: `rgba(${habit.color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.6)`
                        }}
                      />
                    </div>
                    <span className="text-xs font-light" style={{ color: '#B5A594' }}>
                      {habit.progress}/{habit.target}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote - Peaceful */}
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ 
            background: 'rgba(168, 132, 139, 0.06)',
            border: '1px solid rgba(168, 132, 139, 0.1)'
          }}>
            <Leaf className="w-6 h-6 opacity-60" style={{ color: '#A8848B' }} />
          </div>
          <p className="text-lg font-light leading-relaxed mb-4 italic px-4" style={{ color: '#8B7560' }}>
            „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
          </p>
          <div className="flex justify-center gap-2">
            {['#C27A6E', '#7A9E78', '#B8864A'].map((color, i) => (
              <div key={i} className="w-1 h-1 rounded-full opacity-40" style={{ background: color }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}