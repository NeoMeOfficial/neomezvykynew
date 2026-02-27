import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple, Calendar, Zap, Mountain } from 'lucide-react';

// DESIGN 4: Material Elevation - Different elevation levels with bold earthy accents
export default function HomepageDesign4() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="min-h-screen" style={{ background: '#F0E6DA' }}>
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Header - Elevation Level 8 */}
        <div className="bg-white rounded-3xl p-6 relative overflow-hidden" style={{ 
          boxShadow: '0 32px 64px rgba(107, 76, 59, 0.15), 0 16px 32px rgba(107, 76, 59, 0.1), 0 8px 16px rgba(107, 76, 59, 0.05)'
        }}>
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ 
            background: 'linear-gradient(90deg, #C27A6E, #B8864A, #7A9E78, #A8848B)' 
          }} />
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black mb-1" style={{ color: '#6B4C3B' }}>Ahoj Sam! 👋</h1>
              <p style={{ color: '#A0907E' }} className="text-sm font-medium">Streda • 25. február • Krásny deň na wellness</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ 
                background: 'linear-gradient(135deg, #C27A6E 0%, #B8864A 100%)',
                boxShadow: '0 8px 16px rgba(199, 122, 110, 0.3), 0 4px 8px rgba(199, 122, 110, 0.2)'
              }}>
                ☀️
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ 
                background: '#7A9E78',
                boxShadow: '0 4px 8px rgba(122, 158, 120, 0.3)'
              }}>
                3
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Strip - Elevation Level 4 */}
        <div className="bg-white rounded-2xl p-4" style={{ 
          boxShadow: '0 16px 32px rgba(107, 76, 59, 0.1), 0 8px 16px rgba(107, 76, 59, 0.05)'
        }}>
          <div className="flex justify-between">
            {days.map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <span className="text-xs font-semibold mb-2" style={{ color: '#A0907E' }}>{day}</span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                  i === selectedDay ? 'scale-110' : 'hover:scale-105'
                }`} style={
                  i === selectedDay 
                    ? { 
                        background: '#6B4C3B', 
                        color: 'white',
                        boxShadow: '0 12px 24px rgba(107, 76, 59, 0.4), 0 6px 12px rgba(107, 76, 59, 0.2)'
                      }
                    : { color: '#6B4C3B', backgroundColor: '#F5F0EA' }
                }>
                  {i + 23}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today Overview - Elevation Level 12 (Hero) */}
        <div className="relative">
          {/* Bold accent border */}
          <div className="absolute -inset-1 rounded-3xl opacity-75" style={{ 
            background: 'linear-gradient(135deg, #7A9E78, #A8848B, #C27A6E, #B8864A)',
            filter: 'blur(4px)'
          }} />
          
          <div className="relative bg-white rounded-3xl p-6" style={{ 
            boxShadow: '0 48px 96px rgba(107, 76, 59, 0.2), 0 24px 48px rgba(107, 76, 59, 0.15), 0 12px 24px rgba(107, 76, 59, 0.1)'
          }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, #A8848B, #C27A6E)',
                boxShadow: '0 4px 8px rgba(168, 132, 139, 0.3)'
              }}>
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-black" style={{ color: '#6B4C3B' }}>Dnešný summit</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '💧', label: 'Hydratácia', value: '6/8', progress: 75, color: '#7A9E78' },
                { icon: '🔥', label: 'Energia', value: '98%', progress: 98, color: '#C27A6E' },
                { icon: '🎯', label: 'Ciele', value: '3/5', progress: 60, color: '#B8864A' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mx-auto" style={{ 
                    backgroundColor: item.color + '20',
                    boxShadow: '0 8px 16px ' + item.color + '20, 0 4px 8px ' + item.color + '10'
                  }}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="font-black text-lg mb-1" style={{ color: item.color }}>{item.value}</div>
                  <p className="text-xs font-semibold" style={{ color: '#8B7560' }}>{item.label}</p>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${item.progress}%`,
                        backgroundColor: item.color,
                        boxShadow: '0 0 4px ' + item.color + '50'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Water Intake - Elevation Level 6 + Bold Accent */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-2 h-full rounded-l-3xl" style={{ backgroundColor: '#7A9E78' }} />
          <div className="bg-white rounded-3xl p-6 ml-2" style={{ 
            boxShadow: '0 24px 48px rgba(122, 158, 120, 0.12), 0 12px 24px rgba(122, 158, 120, 0.08)'
          }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ 
                  background: 'linear-gradient(135deg, #7A9E78, #95B89A)',
                  boxShadow: '0 8px 16px rgba(122, 158, 120, 0.3)'
                }}>
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-lg" style={{ color: '#6B4C3B' }}>Pitný režim</h3>
                  <p style={{ color: '#7A9E78' }} className="text-sm font-bold">Skvelý pokrok!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black" style={{ color: '#7A9E78' }}>75%</div>
                <div className="text-xs font-semibold" style={{ color: '#8B7560' }}>1500ml</div>
              </div>
            </div>
            
            {/* Water bottles visualization */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="flex justify-center gap-3">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="relative">
                    <div className={`w-8 h-12 rounded-lg border-3 transition-all ${
                      i < 6 ? 'shadow-md' : ''
                    }`} style={{
                      borderColor: '#7A9E78',
                      background: i < 6 ? 'linear-gradient(to top, #7A9E78, #95B89A)' : '#F5F5F5'
                    }}>
                      {i < 6 && (
                        <>
                          <div className="absolute top-1 left-1 right-1 h-1 bg-white/30 rounded-sm" />
                          <div className="absolute bottom-1 left-1 right-1 top-3 bg-white/10 rounded-sm" />
                        </>
                      )}
                    </div>
                    {i < 6 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold" style={{ color: '#7A9E78' }}>
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 rounded-2xl py-4 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]" style={{ 
                background: 'linear-gradient(135deg, #7A9E78, #95B89A)',
                boxShadow: '0 8px 16px rgba(122, 158, 120, 0.3)'
              }}>
                + Pohár
              </button>
              <button className="px-6 rounded-2xl font-bold transition-colors" style={{ 
                backgroundColor: '#F0E6DA',
                color: '#6B4C3B',
                boxShadow: '0 4px 8px rgba(107, 76, 59, 0.1)'
              }}>
                -
              </button>
            </div>
          </div>
        </div>

        {/* Mood & Energy - Elevation Level 5 + Accent */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-2 h-full rounded-l-2xl" style={{ backgroundColor: '#C27A6E' }} />
          <div className="bg-white rounded-2xl p-5 ml-2" style={{ 
            boxShadow: '0 20px 40px rgba(199, 122, 110, 0.1), 0 10px 20px rgba(199, 122, 110, 0.05)'
          }}>
            <h3 className="font-black text-lg mb-4 flex items-center gap-3" style={{ color: '#6B4C3B' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, #C27A6E, #DB9388)',
                boxShadow: '0 4px 8px rgba(199, 122, 110, 0.3)'
              }}>
                <Heart className="w-4 h-4 text-white" />
              </div>
              Wellness meter
            </h3>
            
            <div className="space-y-4">
              {/* Mood */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold" style={{ color: '#8B7560' }}>Nálada</p>
                  <span className="text-2xl">😁</span>
                </div>
                <div className="flex gap-2">
                  {['😢', '😔', '😐', '😊', '😁'].map((emoji, i) => (
                    <button key={i} className={`flex-1 h-12 rounded-xl text-xl font-bold transition-all ${
                      i === 4 ? 'scale-110 shadow-lg' : 'hover:scale-105'
                    }`} style={
                      i === 4 
                        ? { 
                            background: 'linear-gradient(135deg, #C27A6E, #DB9388)',
                            color: 'white',
                            boxShadow: '0 8px 16px rgba(199, 122, 110, 0.3)'
                          }
                        : { backgroundColor: '#F5F0EA', color: '#6B4C3B' }
                    }>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold" style={{ color: '#8B7560' }}>Energia</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold" style={{ color: '#B8864A' }}>Vysoká</span>
                    <Zap className="w-4 h-4" style={{ color: '#B8864A' }} />
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className={`flex-1 h-4 rounded-full transition-all ${
                      i <= 4 ? 'shadow-sm' : ''
                    }`} style={{
                      background: i <= 4 
                        ? 'linear-gradient(90deg, #B8864A, #D4A574)' 
                        : '#E5E5E5'
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements - Elevation Level 10 (Premium) */}
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-3xl opacity-50" style={{ 
            background: 'linear-gradient(135deg, #B8864A, #E6C389)',
            filter: 'blur(2px)'
          }} />
          
          <div className="relative bg-white rounded-3xl p-6" style={{ 
            boxShadow: '0 40px 80px rgba(184, 134, 74, 0.15), 0 20px 40px rgba(184, 134, 74, 0.1), 0 10px 20px rgba(184, 134, 74, 0.05)'
          }}>
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 rounded-2xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, #B8864A 0%, #E6C389 50%, #B8864A 100%)',
                boxShadow: '0 12px 24px rgba(184, 134, 74, 0.4), 0 6px 12px rgba(184, 134, 74, 0.2)'
              }}>
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-2xl mb-1" style={{ color: '#6B4C3B' }}>Wellness Guru</h3>
                <p className="font-bold mb-2" style={{ color: '#B8864A' }}>125 komunitných bodov</p>
                
                {/* Premium progress visualization */}
                <div className="relative mb-2">
                  <div className="h-3 rounded-full" style={{ backgroundColor: '#F0E6DA' }}>
                    <div className="h-full rounded-full relative overflow-hidden" style={{ 
                      width: '75%', 
                      background: 'linear-gradient(90deg, #B8864A, #E6C389, #B8864A)',
                      boxShadow: '0 0 8px rgba(184, 134, 74, 0.4)'
                    }}>
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold" style={{ color: '#8B7560' }}>Úroveň 2 → 3</p>
                  <p className="text-xs font-bold" style={{ color: '#B8864A' }}>15 bodov zostáva</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buddy System - Elevation Level 3 */}
        <div className="bg-white rounded-2xl p-5" style={{ 
          boxShadow: '0 12px 24px rgba(122, 158, 120, 0.08), 0 6px 12px rgba(122, 158, 120, 0.04)',
          borderLeft: '4px solid #7A9E78'
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, #7A9E78, #95B89A)',
                boxShadow: '0 4px 8px rgba(122, 158, 120, 0.2)'
              }}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black" style={{ color: '#6B4C3B' }}>Buddy tím</h3>
                <p style={{ color: '#7A9E78' }} className="text-sm font-bold">2 aktívne členky</p>
              </div>
            </div>
            <div className="flex -space-x-3">
              {[
                { letter: 'M', color: '#C27A6E' },
                { letter: 'A', color: '#A8848B' }
              ].map((buddy, i) => (
                <div key={i} className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black text-white border-3 border-white" style={{ 
                  backgroundColor: buddy.color,
                  boxShadow: '0 4px 8px ' + buddy.color + '30'
                }}>
                  {buddy.letter}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: '#6B4C3B' }}>
              <span className="text-xl">🎉</span>
              Monika práve dosiahla svoj týždenný cieľ!
            </p>
          </div>
        </div>

        {/* Habits Grid - Elevation Level 2 */}
        <div className="bg-white rounded-2xl p-5" style={{ 
          boxShadow: '0 8px 16px rgba(107, 76, 59, 0.06), 0 4px 8px rgba(107, 76, 59, 0.03)'
        }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-lg" style={{ color: '#6B4C3B' }}>Denné návyky</h3>
            <div className="px-4 py-2 rounded-full font-black text-sm" style={{ 
              backgroundColor: '#F0E6DA',
              color: '#6B4C3B',
              boxShadow: '0 2px 4px rgba(107, 76, 59, 0.1)'
            }}>
              3/5 hotovo
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '💧', name: 'Voda', progress: 75, color: '#7A9E78', completed: false },
              { icon: '🏃‍♀️', name: 'Cvičenie', progress: 100, color: '#C27A6E', completed: true },
              { icon: '🧘‍♀️', name: 'Meditácia', progress: 100, color: '#A8848B', completed: true },
              { icon: '📚', name: 'Čítanie', progress: 60, color: '#B8864A', completed: false }
            ].map((habit, i) => (
              <div key={i} className={`rounded-xl p-4 transition-all hover:scale-[1.02] ${
                habit.completed ? 'shadow-md' : 'shadow-sm'
              }`} style={{ 
                backgroundColor: habit.color + '10',
                border: `2px solid ${habit.color}20`,
                boxShadow: habit.completed 
                  ? `0 8px 16px ${habit.color}20, 0 4px 8px ${habit.color}10`
                  : `0 4px 8px ${habit.color}15`
              }}>
                <div className="text-center">
                  <div className="text-3xl mb-3">{habit.icon}</div>
                  <p className="font-black text-sm mb-3" style={{ color: '#6B4C3B' }}>{habit.name}</p>
                  
                  {/* Circular progress */}
                  <div className="relative w-12 h-12 mx-auto">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="18" 
                        stroke="#E5E5E5" 
                        strokeWidth="6" 
                        fill="none"
                      />
                      <circle 
                        cx="24" 
                        cy="24" 
                        r="18" 
                        stroke={habit.color}
                        strokeWidth="6" 
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${113 * (habit.progress / 100)} 113`}
                        className="transition-all duration-1000"
                        style={{ 
                          filter: habit.completed ? `drop-shadow(0 0 4px ${habit.color}50)` : 'none'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {habit.completed ? (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: habit.color }}>
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold" style={{ color: habit.color }}>{habit.progress}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote - Elevation Level 1 */}
        <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100" style={{ 
          boxShadow: '0 4px 8px rgba(107, 76, 59, 0.04), 0 2px 4px rgba(107, 76, 59, 0.02)'
        }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ 
            background: 'linear-gradient(135deg, #A8848B, #C4A3AA)',
            boxShadow: '0 4px 8px rgba(168, 132, 139, 0.2)'
          }}>
            <Target className="w-5 h-5 text-white" />
          </div>
          <p className="text-lg font-medium leading-relaxed mb-3 italic" style={{ color: '#6B4C3B' }}>
            "Každý malý krok ťa posúva bližšie k tvojmu cieľu."
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C27A6E' }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7A9E78' }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B8864A' }} />
          </div>
        </div>

      </div>
    </div>
  );
}