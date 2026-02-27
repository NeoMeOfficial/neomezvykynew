import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple, Cloud, Feather } from 'lucide-react';

// CALM DESIGN 3: Cloud Garden - Dreamy backgrounds, floating elements, subtle depth
export default function CalmDesign3() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ 
      background: 'linear-gradient(180deg, #FDFCFA 0%, #FAF7F3 40%, #F6F1EC 100%)'
    }}>
      
      {/* Floating cloud elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large soft clouds */}
        <div className="absolute -top-32 left-10 w-64 h-32 opacity-20 animate-pulse" style={{ 
          background: 'linear-gradient(90deg, rgba(122, 158, 120, 0.1) 0%, rgba(122, 158, 120, 0.05) 50%, transparent 100%)',
          borderRadius: '50px',
          filter: 'blur(30px)',
          animationDuration: '8s'
        }} />
        <div className="absolute top-20 -right-16 w-48 h-48 opacity-15 animate-pulse" style={{ 
          background: 'radial-gradient(ellipse, rgba(199, 122, 110, 0.08) 0%, transparent 70%)',
          borderRadius: '60%',
          filter: 'blur(40px)',
          animationDuration: '12s',
          animationDelay: '2s'
        }} />
        <div className="absolute top-96 left-4 w-32 h-16 opacity-25 animate-pulse" style={{ 
          background: 'linear-gradient(45deg, rgba(184, 134, 74, 0.06) 0%, transparent 100%)',
          borderRadius: '30px',
          filter: 'blur(25px)',
          animationDuration: '10s',
          animationDelay: '4s'
        }} />
        <div className="absolute bottom-32 right-20 w-40 h-20 opacity-20 animate-pulse" style={{ 
          background: 'radial-gradient(ellipse, rgba(168, 132, 139, 0.08) 0%, transparent 80%)',
          borderRadius: '50px',
          filter: 'blur(35px)',
          animationDuration: '14s',
          animationDelay: '6s'
        }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto p-4 space-y-12">
        
        {/* Header - Floating */}
        <div className="pt-12 pb-8 text-center">
          <div className="inline-block relative">
            <h1 className="text-3xl font-extralight mb-4 leading-tight" style={{ 
              color: '#6B4C3B', 
              letterSpacing: '0.02em'
            }}>
              Krásny deň,<br/>
              <span className="font-light">Sam</span>
            </h1>
            {/* Floating accent */}
            <div className="absolute -top-2 -right-8 w-8 h-8 rounded-full flex items-center justify-center animate-pulse" style={{ 
              background: 'rgba(122, 158, 120, 0.1)',
              backdropFilter: 'blur(10px)',
              animationDuration: '4s'
            }}>
              <span className="text-lg">☀️</span>
            </div>
          </div>
          
          <p style={{ color: '#A89B8C' }} className="text-sm font-light flex items-center justify-center gap-2 mt-2">
            <Cloud className="w-4 h-4 opacity-40" />
            Streda, 25. február • 22°C
          </p>
        </div>

        {/* Calendar Strip - Floating Cloud */}
        <div className="relative">
          {/* Cloud shadow */}
          <div className="absolute inset-0 bg-gray-300 opacity-5 blur-lg rounded-full transform translate-y-2" />
          
          <div className="relative p-8" style={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(40px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 20px 60px rgba(107, 76, 59, 0.04)'
          }}>
            <div className="flex justify-between items-center">
              {days.map((day, i) => (
                <div key={day} className="flex flex-col items-center relative">
                  <span className="text-xs font-light mb-4" style={{ color: '#B5A594' }}>{day}</span>
                  <div className={`relative transition-all duration-700 ${
                    i === selectedDay ? 'transform -translate-y-1' : 'hover:-translate-y-0.5'
                  }`}>
                    {/* Selected day glow */}
                    {i === selectedDay && (
                      <div className="absolute inset-0 rounded-full blur-md" style={{ 
                        background: 'rgba(107, 76, 59, 0.15)',
                        transform: 'scale(1.5)'
                      }} />
                    )}
                    
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm transition-all duration-500`} style={
                      i === selectedDay 
                        ? { 
                            background: 'rgba(255, 255, 255, 0.95)',
                            color: '#6B4C3B',
                            fontWeight: '500',
                            border: '1px solid rgba(107, 76, 59, 0.2)',
                            boxShadow: '0 8px 32px rgba(107, 76, 59, 0.15)'
                          }
                        : { 
                            color: '#A89B8C', 
                            fontWeight: '300',
                            background: 'rgba(255, 255, 255, 0.3)'
                          }
                    }>
                      {i + 23}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today Overview - Floating Cards */}
        <div className="space-y-8">
          <h2 className="text-xl font-extralight text-center mb-12" style={{ 
            color: '#8B7560', 
            letterSpacing: '0.05em' 
          }}>
            Dnešný oblak pokroku
          </h2>
          
          <div className="space-y-6">
            {/* Water - Floating */}
            <div className="relative transform hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-blue-200 opacity-5 blur-2xl rounded-3xl transform translate-y-4 scale-95" />
              
              <div className="relative p-8 text-center" style={{ 
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(30px)',
                borderRadius: '40px',
                border: '1px solid rgba(122, 158, 120, 0.1)',
                boxShadow: '0 20px 60px rgba(122, 158, 120, 0.08)'
              }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto relative" style={{ 
                  background: 'rgba(122, 158, 120, 0.08)',
                  border: '1px solid rgba(122, 158, 120, 0.12)'
                }}>
                  <Droplets className="w-8 h-8 opacity-60" style={{ color: '#7A9E78' }} />
                  {/* Floating droplet */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full animate-bounce" style={{ 
                    background: 'rgba(122, 158, 120, 0.3)',
                    animationDuration: '3s',
                    animationDelay: '1s'
                  }} />
                </div>
                
                <div className="text-3xl font-extralight mb-2" style={{ color: '#7A9E78' }}>6/8</div>
                <p className="text-sm font-light" style={{ color: '#A89B8C' }}>pohárov čistej vody</p>
              </div>
            </div>

            {/* Exercise - Floating */}
            <div className="relative transform hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-orange-200 opacity-5 blur-2xl rounded-3xl transform translate-y-4 scale-95" />
              
              <div className="relative p-8 text-center" style={{ 
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(30px)',
                borderRadius: '40px',
                border: '1px solid rgba(107, 76, 59, 0.1)',
                boxShadow: '0 20px 60px rgba(107, 76, 59, 0.08)'
              }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto relative" style={{ 
                  background: 'rgba(107, 76, 59, 0.08)',
                  border: '1px solid rgba(107, 76, 59, 0.12)'
                }}>
                  <span className="text-3xl opacity-70">✨</span>
                  {/* Success aura */}
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ 
                    background: 'rgba(107, 76, 59, 0.1)',
                    animationDuration: '4s'
                  }} />
                </div>
                
                <div className="text-3xl font-extralight mb-2" style={{ color: '#6B4C3B' }}>Hotovo</div>
                <p className="text-sm font-light" style={{ color: '#A89B8C' }}>ranná joga session</p>
              </div>
            </div>

            {/* Habits - Floating */}
            <div className="relative transform hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-yellow-200 opacity-5 blur-2xl rounded-3xl transform translate-y-4 scale-95" />
              
              <div className="relative p-8 text-center" style={{ 
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(30px)',
                borderRadius: '40px',
                border: '1px solid rgba(184, 134, 74, 0.1)',
                boxShadow: '0 20px 60px rgba(184, 134, 74, 0.08)'
              }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto relative" style={{ 
                  background: 'rgba(184, 134, 74, 0.08)',
                  border: '1px solid rgba(184, 134, 74, 0.12)'
                }}>
                  <span className="text-3xl opacity-70">🎯</span>
                  {/* Progress ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="35" 
                      stroke="rgba(184, 134, 74, 0.2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="35" 
                      stroke="rgba(184, 134, 74, 0.4)" 
                      strokeWidth="2" 
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${220 * 0.6} 220`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
                
                <div className="text-3xl font-extralight mb-2" style={{ color: '#B8864A' }}>3/5</div>
                <p className="text-sm font-light" style={{ color: '#A89B8C' }}>wellness návykov splnených</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Water - Cloud */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 opacity-10 blur-3xl rounded-3xl transform translate-y-8 scale-110" />
          
          <div className="relative p-10" style={{ 
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(50px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 30px 100px rgba(122, 158, 120, 0.1)'
          }}>
            <div className="text-center space-y-8">
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto relative" style={{ 
                  background: 'rgba(122, 158, 120, 0.06)',
                  border: '1px solid rgba(122, 158, 120, 0.1)'
                }}>
                  <Droplets className="w-12 h-12 opacity-50" style={{ color: '#7A9E78' }} />
                  
                  {/* Floating water drops */}
                  <div className="absolute -top-3 left-8 w-3 h-3 rounded-full animate-bounce" style={{ 
                    background: 'rgba(122, 158, 120, 0.4)',
                    animationDelay: '0s',
                    animationDuration: '2s'
                  }} />
                  <div className="absolute top-2 -right-3 w-2 h-2 rounded-full animate-bounce" style={{ 
                    background: 'rgba(122, 158, 120, 0.3)',
                    animationDelay: '0.5s',
                    animationDuration: '2.5s'
                  }} />
                  <div className="absolute -bottom-2 right-8 w-2.5 h-2.5 rounded-full animate-bounce" style={{ 
                    background: 'rgba(122, 158, 120, 0.35)',
                    animationDelay: '1s',
                    animationDuration: '3s'
                  }} />
                </div>
              </div>
              
              <div>
                <h3 className="font-extralight text-2xl mb-4" style={{ color: '#6B4C3B' }}>Hydratácia</h3>
                <p className="text-sm font-light" style={{ color: '#A89B8C' }}>Nádherný pokrok dnes</p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <div className="text-5xl font-thin mb-3" style={{ color: '#7A9E78' }}>75%</div>
                  <div className="text-xs font-light" style={{ color: '#B5A594' }}>1 500ml z 2 000ml</div>
                </div>

                {/* Cloud-like progress */}
                <div className="relative">
                  <div className="flex justify-center gap-4">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className={`transition-all duration-1000 ${
                        i < 6 ? 'transform -translate-y-2' : ''
                      }`}>
                        <div className={`w-4 h-6 rounded-full transition-all duration-700 ${
                          i < 6 ? 'opacity-100' : 'opacity-20'
                        }`} style={{
                          background: i < 6 
                            ? 'linear-gradient(to top, rgba(122, 158, 120, 0.6), rgba(122, 158, 120, 0.3))' 
                            : '#E0D7CC'
                        }}>
                          {/* Bubble effect */}
                          {i < 6 && (
                            <>
                              <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-60" />
                              <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-5 font-light text-sm transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]" style={{ 
                  background: 'rgba(122, 158, 120, 0.08)',
                  color: '#7A9E78',
                  border: '1px solid rgba(122, 158, 120, 0.15)',
                  borderRadius: '30px',
                  backdropFilter: 'blur(20px)'
                }}>
                  Pridať pohár 💧
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mood - Dreamy */}
        <div className="relative">
          <div className="absolute inset-0 bg-pink-100 opacity-10 blur-3xl rounded-3xl transform translate-y-8 scale-110" />
          
          <div className="relative p-10" style={{ 
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(50px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 30px 100px rgba(199, 122, 110, 0.1)'
          }}>
            <div className="text-center space-y-10">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto" style={{ 
                  background: 'rgba(199, 122, 110, 0.06)',
                  border: '1px solid rgba(199, 122, 110, 0.1)'
                }}>
                  <Heart className="w-10 h-10 opacity-50" style={{ color: '#C27A6E' }} />
                </div>
                
                {/* Floating hearts */}
                <div className="absolute -top-4 -left-4 text-lg animate-pulse" style={{ animationDuration: '3s' }}>💕</div>
                <div className="absolute -bottom-2 -right-4 text-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>💖</div>
              </div>
              
              <h3 className="font-extralight text-2xl" style={{ color: '#6B4C3B' }}>Vnútorný svet</h3>
              
              <div className="space-y-12">
                {/* Mood selector */}
                <div>
                  <p className="text-sm font-light mb-8" style={{ color: '#A89B8C' }}>Nálada práve teraz</p>
                  <div className="flex justify-center gap-6">
                    {['😢', '😔', '😐', '😊', '😁'].map((emoji, i) => (
                      <button key={i} className={`w-16 h-16 rounded-full text-2xl transition-all duration-700 relative ${
                        i === 4 ? 'transform -translate-y-2 scale-125' : 'hover:-translate-y-1 hover:scale-110 opacity-50'
                      }`} style={
                        i === 4 
                          ? { 
                              background: 'rgba(199, 122, 110, 0.08)',
                              border: '1px solid rgba(199, 122, 110, 0.2)',
                              boxShadow: '0 10px 30px rgba(199, 122, 110, 0.15)'
                            }
                          : { 
                              background: 'rgba(255, 255, 255, 0.5)',
                              backdropFilter: 'blur(10px)'
                            }
                      }>
                        {emoji}
                        
                        {/* Glow effect for selected */}
                        {i === 4 && (
                          <div className="absolute inset-0 rounded-full animate-ping" style={{ 
                            background: 'rgba(199, 122, 110, 0.1)',
                            animationDuration: '3s'
                          }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy - Cloud bars */}
                <div>
                  <p className="text-sm font-light mb-8" style={{ color: '#A89B8C' }}>Energia dnes</p>
                  <div className="flex justify-center items-end gap-3">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`transition-all duration-1000 ${
                        i <= 4 ? 'transform -translate-y-1' : 'opacity-30'
                      }`} style={{
                        width: '16px',
                        height: i <= 4 ? `${i * 8 + 16}px` : '12px',
                        background: i <= 4 
                          ? `linear-gradient(to top, rgba(199, 122, 110, 0.6), rgba(199, 122, 110, 0.2))` 
                          : '#E0D7CC',
                        borderRadius: '8px',
                        boxShadow: i <= 4 ? '0 4px 12px rgba(199, 122, 110, 0.2)' : 'none'
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement - Ethereal */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-100 opacity-10 blur-3xl rounded-3xl transform translate-y-8 scale-110" />
          
          <div className="relative p-10" style={{ 
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(60px)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 40px 120px rgba(184, 134, 74, 0.12)'
          }}>
            <div className="text-center space-y-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto relative" style={{ 
                  background: 'rgba(184, 134, 74, 0.06)',
                  border: '1px solid rgba(184, 134, 74, 0.1)'
                }}>
                  <Crown className="w-14 h-14 opacity-50" style={{ color: '#B8864A' }} />
                  
                  {/* Floating sparkles */}
                  <div className="absolute -top-6 left-8 text-lg animate-bounce" style={{ animationDuration: '2s', animationDelay: '0s' }}>✨</div>
                  <div className="absolute top-4 -right-6 text-sm animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>⭐</div>
                  <div className="absolute -bottom-4 right-12 text-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>🌟</div>
                  <div className="absolute bottom-8 -left-6 text-xs animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>💫</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-extralight text-3xl mb-4" style={{ color: '#6B4C3B' }}>Wellness Guru</h3>
                <p className="text-sm font-light" style={{ color: '#A89B8C' }}>125 komunitných bodov</p>
              </div>
              
              <div className="space-y-6">
                {/* Dreamy progress */}
                <div className="relative h-8 overflow-hidden" style={{ 
                  background: 'rgba(184, 134, 74, 0.06)',
                  borderRadius: '20px'
                }}>
                  <div 
                    className="absolute left-0 top-0 h-full transition-all duration-2000"
                    style={{ 
                      width: '75%',
                      background: 'linear-gradient(90deg, rgba(184, 134, 74, 0.3) 0%, rgba(184, 134, 74, 0.5) 50%, rgba(184, 134, 74, 0.3) 100%)',
                      borderRadius: '20px',
                      boxShadow: '0 0 20px rgba(184, 134, 74, 0.2)'
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{ 
                      animationDuration: '3s' 
                    }} />
                  </div>
                </div>
                
                <p className="text-xs font-light" style={{ color: '#B5A594' }}>15 bodov do úrovne 3 • Na dobrej ceste</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote - Ethereal End */}
        <div className="text-center py-20 relative">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-12 relative" style={{ 
              background: 'rgba(168, 132, 139, 0.04)',
              border: '1px solid rgba(168, 132, 139, 0.08)'
            }}>
              <Feather className="w-10 h-10 opacity-40" style={{ color: '#A8848B' }} />
              
              {/* Floating elements */}
              <div className="absolute -top-8 left-6 w-3 h-3 rounded-full animate-pulse" style={{ 
                background: 'rgba(168, 132, 139, 0.2)',
                animationDuration: '4s'
              }} />
              <div className="absolute top-0 -right-8 w-2 h-2 rounded-full animate-pulse" style={{ 
                background: 'rgba(199, 122, 110, 0.2)',
                animationDuration: '5s',
                animationDelay: '1s'
              }} />
              <div className="absolute -bottom-6 right-8 w-2.5 h-2.5 rounded-full animate-pulse" style={{ 
                background: 'rgba(122, 158, 120, 0.2)',
                animationDuration: '6s',
                animationDelay: '2s'
              }} />
            </div>
            
            <p className="text-2xl font-thin leading-relaxed mb-8 italic px-8" style={{ color: '#8B7560' }}>
              „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
            </p>
            
            <div className="flex justify-center items-center gap-8">
              {[
                { color: '#C27A6E', size: 'w-2 h-2' },
                { color: '#7A9E78', size: 'w-3 h-3' },
                { color: '#B8864A', size: 'w-2 h-2' }
              ].map((dot, i) => (
                <div key={i} className={`${dot.size} rounded-full opacity-30 animate-pulse`} style={{ 
                  background: dot.color,
                  animationDuration: `${3 + i}s`,
                  animationDelay: `${i * 0.5}s`
                }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}