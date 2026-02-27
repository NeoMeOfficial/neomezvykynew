import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple, Sun, Wind } from 'lucide-react';

// CALM DESIGN 2: Organic Flow - Curved elements, natural spacing, flowing layouts
export default function CalmDesign2() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FDFCFA 0%, #F8F5F1 100%)' }}>
      
      {/* Organic background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20" style={{ 
          background: 'radial-gradient(circle, rgba(122, 158, 120, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />
        <div className="absolute top-1/2 -left-32 w-80 h-80 opacity-15" style={{ 
          background: 'radial-gradient(ellipse 200px 300px, rgba(199, 122, 110, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          borderRadius: '60% 40% 40% 60%'
        }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 opacity-25" style={{ 
          background: 'radial-gradient(ellipse, rgba(184, 134, 74, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          borderRadius: '30% 70% 70% 30%'
        }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto p-4 space-y-8">
        
        {/* Header - Flowing */}
        <div className="pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-light mb-3" style={{ 
                color: '#6B4C3B', 
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}>
                Ahoj Sam ✨
              </h1>
              <p style={{ color: '#A89B8C' }} className="text-sm font-light flex items-center gap-2">
                <Wind className="w-4 h-4 opacity-50" />
                Krásna streda na wellness
              </p>
            </div>
            <div className="w-20 h-20 flex items-center justify-center mt-1" style={{ 
              background: 'linear-gradient(135deg, rgba(122, 158, 120, 0.08) 0%, rgba(184, 134, 74, 0.06) 100%)',
              borderRadius: '45% 55% 60% 40%',
              border: '1px solid rgba(122, 158, 120, 0.12)',
              transform: 'rotate(-5deg)'
            }}>
              <span className="text-3xl" style={{ transform: 'rotate(5deg)' }}>☀️</span>
            </div>
          </div>
        </div>

        {/* Calendar Strip - Organic Shape */}
        <div className="p-6 mb-6" style={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '40px 40px 60px 20px',
          boxShadow: '0 20px 60px rgba(107, 76, 59, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          <div className="flex justify-between">
            {days.map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs font-light mb-4" style={{ color: '#B5A594' }}>{day}</span>
                <div className={`w-11 h-11 flex items-center justify-center text-sm transition-all duration-500 ${
                  i === selectedDay ? '' : 'hover:scale-110'
                }`} style={
                  i === selectedDay 
                    ? { 
                        background: 'linear-gradient(135deg, rgba(107, 76, 59, 0.1) 0%, rgba(168, 132, 139, 0.08) 100%)',
                        color: '#6B4C3B',
                        fontWeight: '500',
                        borderRadius: '50% 40% 60% 50%',
                        border: '1px solid rgba(107, 76, 59, 0.15)',
                        transform: 'scale(1.1)'
                      }
                    : { 
                        color: '#A89B8C', 
                        fontWeight: '300',
                        borderRadius: '50%'
                      }
                }>
                  {i + 23}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today Overview - Flowing Cards */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-light text-center mb-8" style={{ 
            color: '#8B7560', 
            letterSpacing: '0.02em' 
          }}>
            Dnešná cesta
          </h2>
          
          <div className="space-y-4">
            {/* Water Progress */}
            <div className="p-6" style={{ 
              background: 'rgba(122, 158, 120, 0.04)',
              borderRadius: '30px 60px 30px 60px',
              border: '1px solid rgba(122, 158, 120, 0.08)'
            }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center" style={{ 
                  background: 'rgba(122, 158, 120, 0.08)',
                  borderRadius: '60% 40% 60% 40%'
                }}>
                  <span className="text-2xl opacity-80">💧</span>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-light mb-1" style={{ color: '#7A9E78' }}>6/8</div>
                  <p className="text-sm font-light" style={{ color: '#A89B8C' }}>pohárov vody</p>
                </div>
              </div>
            </div>

            {/* Workout Complete */}
            <div className="p-6" style={{ 
              background: 'rgba(107, 76, 59, 0.04)',
              borderRadius: '60px 30px 60px 30px',
              border: '1px solid rgba(107, 76, 59, 0.08)'
            }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center" style={{ 
                  background: 'rgba(107, 76, 59, 0.08)',
                  borderRadius: '40% 60% 40% 60%'
                }}>
                  <span className="text-2xl opacity-80">✨</span>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-light mb-1" style={{ color: '#6B4C3B' }}>Hotovo</div>
                  <p className="text-sm font-light" style={{ color: '#A89B8C' }}>ranné cvičenie</p>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="p-6" style={{ 
              background: 'rgba(184, 134, 74, 0.04)',
              borderRadius: '40px 40px 60px 40px',
              border: '1px solid rgba(184, 134, 74, 0.08)'
            }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center" style={{ 
                  background: 'rgba(184, 134, 74, 0.08)',
                  borderRadius: '50% 60% 40% 50%'
                }}>
                  <span className="text-2xl opacity-80">🎯</span>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-light mb-1" style={{ color: '#B8864A' }}>3/5</div>
                  <p className="text-sm font-light" style={{ color: '#A89B8C' }}>splnených návykov</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Water Detailed - Organic Shape */}
        <div className="p-8 mb-8" style={{ 
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(30px)',
          borderRadius: '50px 30px 50px 30px',
          boxShadow: '0 30px 80px rgba(122, 158, 120, 0.08)',
          border: '1px solid rgba(122, 158, 120, 0.1)'
        }}>
          <div className="text-center">
            <div className="w-24 h-24 flex items-center justify-center mb-6 mx-auto" style={{ 
              background: 'linear-gradient(135deg, rgba(122, 158, 120, 0.08) 0%, rgba(122, 158, 120, 0.12) 100%)',
              borderRadius: '60% 40% 70% 30%',
              border: '1px solid rgba(122, 158, 120, 0.15)'
            }}>
              <Droplets className="w-10 h-10 opacity-70" style={{ color: '#7A9E78' }} />
            </div>
            
            <h3 className="font-light text-xl mb-2" style={{ color: '#6B4C3B' }}>Hydratácia</h3>
            <p className="text-sm font-light mb-6" style={{ color: '#A89B8C' }}>Úžasný pokrok dnes</p>
            
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-4xl font-extralight mb-2" style={{ color: '#7A9E78' }}>75%</div>
                <div className="text-xs font-light" style={{ color: '#B5A594' }}>1,5L z 2L dnes</div>
              </div>

              {/* Flowing wave progress */}
              <div className="relative h-16 overflow-hidden" style={{ 
                background: 'rgba(122, 158, 120, 0.06)',
                borderRadius: '40px'
              }}>
                <div className="absolute bottom-0 left-0 h-12 transition-all duration-1000" style={{
                  width: '75%',
                  background: 'linear-gradient(90deg, rgba(122, 158, 120, 0.2) 0%, rgba(122, 158, 120, 0.3) 100%)',
                  borderRadius: '40px 20px 20px 40px'
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-2">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className={`w-3 h-3 transition-all duration-500 ${
                        i < 6 ? 'opacity-100 scale-110' : 'opacity-30'
                      }`} style={{
                        background: i < 6 ? '#7A9E78' : '#E0D7CC',
                        borderRadius: '60% 40% 60% 40%'
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              <button className="w-full py-4 font-light text-sm transition-all duration-500 hover:scale-[1.02]" style={{ 
                background: 'rgba(122, 158, 120, 0.08)',
                color: '#7A9E78',
                border: '1px solid rgba(122, 158, 120, 0.15)',
                borderRadius: '30px'
              }}>
                Pridať pohár 💧
              </button>
            </div>
          </div>
        </div>

        {/* Mood Tracker - Curved */}
        <div className="p-8 mb-8" style={{ 
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(30px)',
          borderRadius: '40px 60px 40px 60px',
          boxShadow: '0 30px 80px rgba(199, 122, 110, 0.08)',
          border: '1px solid rgba(199, 122, 110, 0.1)'
        }}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto" style={{ 
              background: 'linear-gradient(135deg, rgba(199, 122, 110, 0.08) 0%, rgba(199, 122, 110, 0.12) 100%)',
              borderRadius: '70% 30% 60% 40%',
              border: '1px solid rgba(199, 122, 110, 0.15)'
            }}>
              <Heart className="w-8 h-8 opacity-70" style={{ color: '#C27A6E' }} />
            </div>
            <h3 className="font-light text-xl" style={{ color: '#6B4C3B' }}>Vnútorné počasie</h3>
          </div>
          
          <div className="space-y-10">
            {/* Mood selector - organic */}
            <div>
              <p className="text-sm font-light mb-6 text-center" style={{ color: '#A89B8C' }}>Nálada dnes</p>
              <div className="flex justify-center gap-3">
                {['😢', '😔', '😐', '😊', '😁'].map((emoji, i) => (
                  <button key={i} className={`w-14 h-14 text-2xl transition-all duration-500 ${
                    i === 4 ? 'scale-125' : 'hover:scale-110 opacity-60'
                  }`} style={
                    i === 4 
                      ? { 
                          background: 'rgba(199, 122, 110, 0.1)',
                          border: '1px solid rgba(199, 122, 110, 0.2)',
                          borderRadius: '60% 40% 60% 40%'
                        }
                      : { 
                          background: 'rgba(107, 76, 59, 0.03)',
                          borderRadius: '50%'
                        }
                  }>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy - flowing bars */}
            <div>
              <p className="text-sm font-light mb-6 text-center" style={{ color: '#A89B8C' }}>Energia</p>
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className={`transition-all duration-700 ${
                    i <= 4 ? 'h-8' : 'h-4 opacity-30'
                  }`} style={{
                    width: '12px',
                    background: i <= 4 
                      ? `linear-gradient(to top, rgba(199, 122, 110, 0.6), rgba(199, 122, 110, 0.3))` 
                      : '#E0D7CC',
                    borderRadius: i <= 4 ? '8px 8px 4px 4px' : '4px'
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement - Floating */}
        <div className="p-8 mb-8" style={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(40px)',
          borderRadius: '60px 40px 60px 40px',
          boxShadow: '0 40px 100px rgba(184, 134, 74, 0.1)',
          border: '1px solid rgba(184, 134, 74, 0.12)'
        }}>
          <div className="text-center">
            <div className="w-28 h-28 flex items-center justify-center mb-8 mx-auto relative" style={{ 
              background: 'linear-gradient(135deg, rgba(184, 134, 74, 0.08) 0%, rgba(184, 134, 74, 0.15) 100%)',
              borderRadius: '60% 40% 70% 30%',
              border: '1px solid rgba(184, 134, 74, 0.2)'
            }}>
              <Crown className="w-12 h-12 opacity-70" style={{ color: '#B8864A' }} />
              {/* Floating accent */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(184, 134, 74, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <span className="text-xs">✨</span>
              </div>
            </div>
            
            <h3 className="font-light text-2xl mb-3" style={{ color: '#6B4C3B' }}>Wellness Guru</h3>
            <p className="text-sm font-light mb-6" style={{ color: '#A89B8C' }}>125 komunitných bodov</p>
            
            <div className="space-y-4">
              {/* Organic progress shape */}
              <div className="relative h-6 overflow-hidden" style={{ 
                background: 'rgba(184, 134, 74, 0.08)',
                borderRadius: '15px'
              }}>
                <div 
                  className="absolute left-0 top-0 h-full transition-all duration-1000"
                  style={{ 
                    width: '75%',
                    background: 'linear-gradient(90deg, rgba(184, 134, 74, 0.4) 0%, rgba(184, 134, 74, 0.6) 100%)',
                    borderRadius: '15px 8px 8px 15px'
                  }}
                />
              </div>
              <p className="text-xs font-light" style={{ color: '#B5A594' }}>15 bodov do úrovne 3</p>
            </div>
          </div>
        </div>

        {/* Buddy System - Organic Social */}
        <div className="p-6 mb-8" style={{ 
          background: 'rgba(122, 158, 120, 0.04)',
          borderRadius: '50px 30px 50px 30px',
          border: '1px solid rgba(122, 158, 120, 0.08)'
        }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center" style={{ 
              background: 'rgba(122, 158, 120, 0.08)',
              borderRadius: '60% 40% 50% 60%'
            }}>
              <Users className="w-7 h-7 opacity-70" style={{ color: '#7A9E78' }} />
            </div>
            <div>
              <h3 className="font-light text-lg" style={{ color: '#6B4C3B' }}>Wellness spolutník</h3>
              <p className="text-sm font-light" style={{ color: '#A89B8C' }}>2 aktívne priateľky</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mb-6">
            {[
              { letter: 'M', color: '#C27A6E', shape: '60% 40% 70% 30%' },
              { letter: 'A', color: '#A8848B', shape: '40% 60% 30% 70%' }
            ].map((buddy, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 flex items-center justify-center text-lg font-light text-white mb-2" style={{ 
                  background: `rgba(${buddy.color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.7)`,
                  borderRadius: buddy.shape,
                  border: '2px solid rgba(255, 255, 255, 0.8)'
                }}>
                  {buddy.letter}
                </div>
                <div className="w-3 h-1 mx-auto rounded-full" style={{ background: buddy.color, opacity: 0.6 }} />
              </div>
            ))}
          </div>
          
          <div className="text-center p-4 rounded-3xl" style={{ 
            background: 'rgba(122, 158, 120, 0.06)',
            border: '1px solid rgba(122, 158, 120, 0.1)'
          }}>
            <p className="text-sm font-light flex items-center justify-center gap-2" style={{ color: '#6B4C3B' }}>
              <span className="opacity-80">🌸</span>
              Monika práve dokončila týždennú výzvu
            </p>
          </div>
        </div>

        {/* Habits - Flowing Grid */}
        <div className="p-8 mb-8" style={{ 
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(30px)',
          borderRadius: '40px 60px 40px 60px',
          boxShadow: '0 30px 80px rgba(107, 76, 59, 0.06)',
          border: '1px solid rgba(107, 76, 59, 0.08)'
        }}>
          <div className="text-center mb-10">
            <h3 className="font-light text-xl mb-4" style={{ color: '#6B4C3B' }}>Denné rituály</h3>
            <div className="inline-flex items-center gap-3 px-6 py-3" style={{ 
              background: 'rgba(107, 76, 59, 0.06)',
              border: '1px solid rgba(107, 76, 59, 0.1)',
              borderRadius: '25px'
            }}>
              <span className="text-sm font-light" style={{ color: '#6B4C3B' }}>3 z 5 splnených</span>
              <div className="w-2 h-2 rounded-full" style={{ background: '#7A9E78' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: '💧', name: 'Hydratácia', progress: 75, color: '#7A9E78', shape: '60% 40% 70% 30%' },
              { icon: '🏃‍♀️', name: 'Pohyb', progress: 100, color: '#C27A6E', shape: '40% 60% 30% 70%' },
              { icon: '🧘‍♀️', name: 'Meditácia', progress: 100, color: '#A8848B', shape: '70% 30% 60% 40%' },
              { icon: '🥗', name: 'Výživa', progress: 60, color: '#B8864A', shape: '30% 70% 40% 60%' }
            ].map((habit, i) => (
              <div key={i} className="text-center p-4">
                <div className={`w-20 h-20 flex items-center justify-center text-3xl mb-4 mx-auto transition-all duration-500 hover:scale-110`} style={{ 
                  background: `rgba(${habit.color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.08)`,
                  border: `1px solid rgba(${habit.color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.15)`,
                  borderRadius: habit.shape
                }}>
                  {habit.icon}
                </div>
                <p className="font-light text-sm mb-3" style={{ color: '#6B4C3B' }}>{habit.name}</p>
                
                {/* Circular organic progress */}
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0" style={{ 
                    background: `conic-gradient(${habit.color} ${habit.progress * 3.6}deg, rgba(107, 76, 59, 0.1) ${habit.progress * 3.6}deg)`,
                    borderRadius: '50%',
                    padding: '4px'
                  }}>
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-light" style={{ color: habit.color }}>
                        {habit.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote - Zen */}
        <div className="text-center py-16">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8" style={{ 
            background: 'linear-gradient(135deg, rgba(168, 132, 139, 0.06) 0%, rgba(168, 132, 139, 0.12) 100%)',
            borderRadius: '60% 40% 70% 30%',
            border: '1px solid rgba(168, 132, 139, 0.15)'
          }}>
            <Wind className="w-8 h-8 opacity-60" style={{ color: '#A8848B' }} />
          </div>
          <p className="text-xl font-extralight leading-relaxed mb-8 italic px-6" style={{ color: '#8B7560' }}>
            „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
          </p>
          <div className="flex justify-center gap-4">
            {[
              { color: '#C27A6E', shape: '60% 40% 70% 30%' },
              { color: '#7A9E78', shape: '40% 60% 30% 70%' },
              { color: '#B8864A', shape: '70% 30% 60% 40%' }
            ].map((dot, i) => (
              <div key={i} className="w-3 h-3 opacity-40" style={{ 
                background: dot.color, 
                borderRadius: dot.shape 
              }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}