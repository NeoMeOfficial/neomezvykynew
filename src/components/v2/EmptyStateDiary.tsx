import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, PenTool, Heart, Sparkles, ChevronRight, Send } from 'lucide-react';
import GlassCard from './GlassCard';
import { colors } from '../../theme/warmDusk';

interface EmptyStateDiaryProps {
  onCreateEntry?: () => void;
}

export default function EmptyStateDiary({ onCreateEntry }: EmptyStateDiaryProps) {
  const navigate = useNavigate();
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [quickEntry, setQuickEntry] = useState('');

  const prompts = [
    { text: 'Za čo som dnes vďačná?', icon: '🙏', color: colors.mysel },
    { text: 'Čo ma dnes potešilo?', icon: '😊', color: colors.strava },
    { text: 'Ako sa cítim práve teraz?', icon: '💭', color: colors.periodka },
    { text: 'Čo by som zajtra zmenila?', icon: '✨', color: colors.accent },
    { text: 'Čím som dnes hrdá?', icon: '🏆', color: colors.telo },
  ];

  const handleQuickEntry = (prompt: string) => {
    setQuickEntry(prompt + ' ');
    setShowQuickStart(true);
  };

  const handleSaveQuickEntry = () => {
    if (quickEntry.trim()) {
      // In real implementation, this would save to diary
      console.log('Saving diary entry:', quickEntry);
      
      // Save to localStorage to match existing format
      try {
        const existing = localStorage.getItem('neome-diary-entries');
        const entries = existing ? JSON.parse(existing) : [];
        entries.push({
          text: quickEntry,
          date: new Date().toISOString(),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('neome-diary-entries', JSON.stringify(entries));
        
        onCreateEntry?.();
        // Refresh the current page to show the new entry
        window.location.reload();
      } catch (error) {
        console.error('Error saving diary entry:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Empty State */}
      <GlassCard className="text-center py-12 px-6">
        <div className="mb-8">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${colors.mysel} 0%, ${colors.periodka} 100%)`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Začni písať svoj príbeh 📖
          </h3>
          
          <p className="text-sm leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
            Denník je miesto pre tvoje myšlienky, pocity a zážitky. 
            Písanie pomáha spracovať emócie a sledovať osobný rast.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl mb-2">🧠</div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                Spracuj emócie
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                Sleduj pokrok
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                Nájdi jasnosť
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/domov-new')}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${colors.mysel} 0%, ${colors.periodka} 100%)`,
              boxShadow: `0 4px 20px ${colors.mysel}40`
            }}
          >
            <PenTool className="w-5 h-5" />
            Napísať prvý záznam
          </button>

          <button
            onClick={() => setShowQuickStart(!showQuickStart)}
            className="w-full py-3 px-6 rounded-2xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ 
              background: 'rgba(255,255,255,0.5)',
              color: colors.textPrimary,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Sparkles className="w-4 h-4" />
            Rýchly záznam
            <ChevronRight className={`w-4 h-4 transition-transform ${showQuickStart ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </GlassCard>

      {/* Quick Entry Section */}
      {showQuickStart && (
        <GlassCard className="p-6">
          <div className="mb-4">
            <h4 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
              ⚡ Rýchly záznam
            </h4>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Vyber si otázku alebo napíš čokoľvek, čo máš na srdci:
            </p>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2 mb-4">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickEntry(prompt.text)}
                className="w-full p-3 rounded-xl transition-all active:scale-95 flex items-center gap-3"
                style={{ 
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ backgroundColor: `${prompt.color}20` }}
                >
                  {prompt.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {prompt.text}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <textarea
              value={quickEntry}
              onChange={(e) => setQuickEntry(e.target.value)}
              placeholder="Začni písať..."
              rows={4}
              className="w-full p-4 rounded-xl border-0 text-sm resize-none"
              style={{ 
                background: 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(10px)',
                color: colors.textPrimary,
                outline: 'none'
              }}
            />
            
            {quickEntry.trim() && (
              <button
                onClick={handleSaveQuickEntry}
                className="w-full py-3 px-6 rounded-xl font-medium text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.mysel} 0%, ${colors.periodka} 100%)`,
                  boxShadow: `0 4px 16px ${colors.mysel}30`
                }}
              >
                <Send className="w-4 h-4" />
                Uložiť záznam
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {/* Benefits Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6" style={{ color: colors.mysel }} />
          <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
            Prečo písať denník?
          </h4>
        </div>

        <div className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full mt-0.5" style={{ backgroundColor: colors.mysel }} />
            <p><strong>Mentálne zdravie:</strong> Pomáha spracovať emócie a stres</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full mt-0.5" style={{ backgroundColor: colors.periodka }} />
            <p><strong>Sebapoznanie:</strong> Objavíš svoje vzorce a hodnoty</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 rounded-full mt-0.5" style={{ backgroundColor: colors.accent }} />
            <p><strong>Pamäť:</strong> Uchováš si dôležité momenty života</p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <p className="text-xs text-center" style={{ color: colors.textTertiary }}>
            💡 <strong>Tip:</strong> Nemusíš písať každý deň. Stačí keď zachytíš momenty, ktoré sa ti zdajú dôležité!
          </p>
        </div>
      </GlassCard>
    </div>
  );
}