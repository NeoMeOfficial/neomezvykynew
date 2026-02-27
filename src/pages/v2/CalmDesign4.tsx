import { useState } from 'react';
import { Droplets, Heart, Target, Users, Crown, TrendingUp, Dumbbell, Apple, Compass, Anchor } from 'lucide-react';

// CALM DESIGN 4: Scandinavian Earth - Nordic minimalism meets warm earth, ultra-clean
export default function CalmDesign4() {
  const [selectedDay] = useState(2);

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

  return (
    <div className="min-h-screen" style={{ background: '#FEFEFE' }}>
      <div className="max-w-sm mx-auto p-6 space-y-16">
        
        {/* Header - Pure Minimalism */}
        <div className="pt-16 pb-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-thin tracking-wide" style={{ 
                color: '#6B4C3B',
                fontVariant: 'all-small-caps'
              }}>
                Sam
              </h1>
              <div className="w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #A89B8C, transparent)' }} />
            </div>
            
            <div className="text-center">
              <p style={{ color: '#A89B8C' }} className="text-sm font-light tracking-wider">
                STREDA • 25. FEBRUÁR
              </p>
            </div>
          </div>
        </div>

        {/* Calendar - Nordic Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: '#B5A594' }}>
              TÝŽDEŇ
            </h2>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={day} className="text-center space-y-3">
                <div className="text-[10px] font-medium tracking-wider" style={{ color: '#B5A594' }}>
                  {day}
                </div>
                <div className={`h-12 flex items-center justify-center text-sm transition-all duration-300 ${
                  i === selectedDay ? '' : 'hover:bg-gray-50'
                }`} style={
                  i === selectedDay 
                    ? { 
                        color: '#FEFEFE',
                        background: '#6B4C3B',
                        fontSize: '13px',
                        fontWeight: '500'
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
          
          <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #E5E1DC, transparent)' }} />
        </div>

        {/* Today Stats - Grid System */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: '#B5A594' }}>
              DNES
            </h2>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="text-2xl font-thin" style={{ color: '#7A9E78' }}>
                6<span className="text-base font-extralight" style={{ color: '#B5A594' }}>/8</span>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-medium tracking-wider uppercase" style={{ color: '#B5A594' }}>
                  VODA
                </div>
                <div className="w-full h-0.5" style={{ background: '#F0EDE8' }}>
                  <div className="h-full transition-all duration-1000" style={{ 
                    width: '75%', 
                    background: '#7A9E78' 
                  }} />
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="text-2xl font-thin" style={{ color: '#6B4C3B' }}>
                ✓
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-medium tracking-wider uppercase" style={{ color: '#B5A594' }}>
                  CVIČENIE
                </div>
                <div className="w-full h-0.5" style={{ background: '#F0EDE8' }}>
                  <div className="h-full" style={{ 
                    width: '100%', 
                    background: '#6B4C3B' 
                  }} />
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="text-2xl font-thin" style={{ color: '#B8864A' }}>
                3<span className="text-base font-extralight" style={{ color: '#B5A594' }}>/5</span>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-medium tracking-wider uppercase" style={{ color: '#B5A594' }}>
                  NÁVYKY
                </div>
                <div className="w-full h-0.5" style={{ background: '#F0EDE8' }}>
                  <div className="h-full transition-all duration-1000" style={{ 
                    width: '60%', 
                    background: '#B8864A' 
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Water Section - Clean */}
        <div className="space-y-12 py-8" style={{ borderTop: '1px solid #F0EDE8', borderBottom: '1px solid #F0EDE8' }}>
          <div className="text-center space-y-6">
            <div>
              <Droplets className="w-8 h-8 mx-auto mb-4 opacity-60" style={{ color: '#7A9E78' }} />
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-2" style={{ color: '#B5A594' }}>
                HYDRATÁCIA
              </h3>
              <div className="text-3xl font-thin" style={{ color: '#7A9E78' }}>75%</div>
              <p className="text-xs font-light mt-1" style={{ color: '#A89B8C' }}>1 500ml z 2 000ml</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className={`w-1 transition-all duration-500 ${
                    i < 6 ? 'h-8 opacity-100' : 'h-4 opacity-30'
                  }`} style={{
                    background: i < 6 ? '#7A9E78' : '#E5E1DC'
                  }} />
                ))}
              </div>

              <button className="px-8 py-3 text-xs font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105" style={{ 
                color: '#7A9E78',
                border: '1px solid #7A9E78'
              }}>
                PRIDAŤ POHÁR
              </button>
            </div>
          </div>
        </div>

        {/* Mood Section - Pure */}
        <div className="space-y-12 py-8" style={{ borderBottom: '1px solid #F0EDE8' }}>
          <div className="text-center space-y-8">
            <div>
              <Heart className="w-8 h-8 mx-auto mb-4 opacity-60" style={{ color: '#C27A6E' }} />
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: '#B5A594' }}>
                VNÚTORNÉ POČASIE
              </h3>
            </div>

            <div className="space-y-12">
              {/* Mood */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-xs font-light tracking-wider uppercase mb-4" style={{ color: '#A89B8C' }}>
                    Nálada
                  </div>
                  <div className="flex justify-center gap-6">
                    {['😢', '😔', '😐', '😊', '😁'].map((emoji, i) => (
                      <button key={i} className={`w-12 h-12 rounded-full text-xl transition-all duration-300 ${
                        i === 4 ? 'scale-110' : 'opacity-40 hover:opacity-80'
                      }`} style={
                        i === 4 
                          ? { background: '#F8F6F3', border: '1px solid #C27A6E' }
                          : { background: '#FBFBFB' }
                      }>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Energy */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-xs font-light tracking-wider uppercase mb-4" style={{ color: '#A89B8C' }}>
                    Energia
                  </div>
                  <div className="flex justify-center items-end gap-2">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={`w-3 transition-all duration-700 ${
                        i <= 4 ? 'opacity-100' : 'opacity-20'
                      }`} style={{
                        height: i <= 4 ? `${i * 6 + 8}px` : '6px',
                        background: i <= 4 ? '#C27A6E' : '#E5E1DC'
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement - Nordic */}
        <div className="space-y-12 py-8" style={{ borderBottom: '1px solid #F0EDE8' }}>
          <div className="text-center space-y-8">
            <div>
              <Crown className="w-8 h-8 mx-auto mb-4 opacity-60" style={{ color: '#B8864A' }} />
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6" style={{ color: '#B5A594' }}>
                ÚROVEŇ
              </h3>
              
              <div className="space-y-4">
                <div className="text-2xl font-thin" style={{ color: '#6B4C3B' }}>WELLNESS GURU</div>
                <div className="text-sm font-light" style={{ color: '#A89B8C' }}>125 komunitných bodov</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-full h-px" style={{ background: '#F0EDE8' }}>
                <div 
                  className="h-full transition-all duration-2000"
                  style={{ 
                    width: '75%',
                    background: '#B8864A'
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-light" style={{ color: '#B5A594' }}>
                <span>ÚROVEŇ 2</span>
                <span>15 BODOV ZOSTÁVA</span>
                <span>ÚROVEŇ 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buddy Section - Social Minimal */}
        <div className="space-y-12 py-8" style={{ borderBottom: '1px solid #F0EDE8' }}>
          <div className="text-center space-y-8">
            <div>
              <Users className="w-8 h-8 mx-auto mb-4 opacity-60" style={{ color: '#7A9E78' }} />
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-6" style={{ color: '#B5A594' }}>
                WELLNESS PARTNERKY
              </h3>
              <div className="text-sm font-light" style={{ color: '#A89B8C' }}>2 pripojenia</div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center gap-8">
                {[
                  { name: 'MONIKA', initial: 'M', color: '#C27A6E' },
                  { name: 'ANNA', initial: 'A', color: '#A8848B' }
                ].map((buddy, i) => (
                  <div key={i} className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-light text-white" style={{ 
                      background: buddy.color
                    }}>
                      {buddy.initial}
                    </div>
                    <div className="text-[10px] font-light tracking-wider" style={{ color: '#A89B8C' }}>
                      {buddy.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6" style={{ background: '#F8F6F3' }}>
                <p className="text-xs font-light text-center leading-relaxed" style={{ color: '#6B4C3B' }}>
                  Monika práve dokončila svoje denné ciele
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habits - Grid */}
        <div className="space-y-12 py-8" style={{ borderBottom: '1px solid #F0EDE8' }}>
          <div className="text-center space-y-6">
            <div>
              <Target className="w-8 h-8 mx-auto mb-4 opacity-60" style={{ color: '#6B4C3B' }} />
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-2" style={{ color: '#B5A594' }}>
                DENNÉ RITUÁLY
              </h3>
              <div className="text-sm font-light" style={{ color: '#A89B8C' }}>3 z 5 splnených</div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {[
                { name: 'HYDRATÁCIA', icon: '💧', progress: 75, color: '#7A9E78' },
                { name: 'POHYB', icon: '🏃‍♀️', progress: 100, color: '#C27A6E' },
                { name: 'MEDITÁCIA', icon: '🧘‍♀️', progress: 100, color: '#A8848B' },
                { name: 'VÝŽIVA', icon: '🥗', progress: 60, color: '#B8864A' }
              ].map((habit, i) => (
                <div key={i} className="text-center space-y-4">
                  <div className="text-3xl mb-3">{habit.icon}</div>
                  <div className="space-y-2">
                    <div className="text-[10px] font-medium tracking-wider uppercase" style={{ color: '#B5A594' }}>
                      {habit.name}
                    </div>
                    <div className="text-lg font-thin" style={{ color: habit.color }}>
                      {habit.progress}%
                    </div>
                    <div className="w-full h-0.5" style={{ background: '#F0EDE8' }}>
                      <div 
                        className="h-full transition-all duration-1000"
                        style={{ 
                          width: `${habit.progress}%`,
                          background: habit.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote - Zen End */}
        <div className="text-center py-16 space-y-8">
          <div>
            <Compass className="w-6 h-6 mx-auto mb-6 opacity-40" style={{ color: '#A8848B' }} />
          </div>
          
          <div className="space-y-6">
            <p className="text-base font-thin leading-loose italic px-4" style={{ color: '#8B7560' }}>
              „Každý malý krok ťa posúva<br/>bližšie k tvojmu cieľu."
            </p>
            
            <div className="flex justify-center items-center gap-6">
              <div className="w-4 h-px" style={{ background: '#C27A6E', opacity: 0.3 }} />
              <div className="w-1 h-1 rounded-full" style={{ background: '#7A9E78', opacity: 0.4 }} />
              <div className="w-4 h-px" style={{ background: '#B8864A', opacity: 0.3 }} />
            </div>
          </div>
        </div>

        {/* Bottom Anchor */}
        <div className="text-center pb-16">
          <Anchor className="w-5 h-5 mx-auto opacity-20" style={{ color: '#A8848B' }} />
        </div>

      </div>
    </div>
  );
}