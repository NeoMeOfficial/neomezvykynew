import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Target, Flame, Sparkles, ChevronRight, CheckSquare } from 'lucide-react';
import GlassCard from './GlassCard';
import { colors } from '../../theme/warmDusk';

interface EmptyStateHabitsProps {
  onCreateHabit?: () => void;
}

export default function EmptyStateHabits({ onCreateHabit }: EmptyStateHabitsProps) {
  const navigate = useNavigate();
  const [showQuickStart, setShowQuickStart] = useState(false);

  const commonHabits = [
    { name: 'Piť 2L vody denne', icon: '💧', color: colors.strava },
    { name: '10 minút meditácie', icon: '🧘‍♀️', color: colors.mysel },
    { name: '30 minút cvičenia', icon: '💪', color: colors.telo },
    { name: '8 hodín spánku', icon: '😴', color: colors.periodka },
    { name: 'Jesť zdravé raňajky', icon: '🥣', color: colors.accent },
  ];

  const handleQuickAdd = (habitName: string) => {
    // In real implementation, this would add the habit
    console.log('Adding habit:', habitName);
    onCreateHabit?.();
    navigate('/domov-new');
  };

  return (
    <div className="space-y-6">
      {/* Main Empty State */}
      <GlassCard className="text-center py-12 px-6">
        <div className="mb-8">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${colors.telo} 0%, ${colors.accent} 100%)`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <Target className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Vytvor si prvý návyk! 🎯
          </h3>
          
          <p className="text-sm leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
            Malé kroky každý deň vedú k veľkým zmenám. 
            Začni jednoducho a postupne si vytvor rutiny, 
            ktoré ťa posunú k tvojim cieľom.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                Sleduj pokrok
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                Udržuj sériu
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-xs" style={{ color: colors.textTertiary }}>
                Dosiahni cieľ
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/domov-new')}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${colors.telo} 0%, ${colors.accent} 100%)`,
              boxShadow: `0 4px 20px ${colors.telo}40`
            }}
          >
            <Plus className="w-5 h-5" />
            Vytvoriť prvý návyk
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
            Rýchly štart
            <ChevronRight className={`w-4 h-4 transition-transform ${showQuickStart ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </GlassCard>

      {/* Quick Start Section */}
      {showQuickStart && (
        <GlassCard className="p-6">
          <div className="mb-4">
            <h4 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
              ⚡ Obľúbené návyky
            </h4>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Vyber si jeden z týchto osvedčených návykov na začiatok:
            </p>
          </div>

          <div className="space-y-3">
            {commonHabits.map((habit, index) => (
              <button
                key={index}
                onClick={() => handleQuickAdd(habit.name)}
                className="w-full p-4 rounded-xl transition-all active:scale-95 flex items-center gap-3"
                style={{ 
                  background: 'rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  {habit.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium" style={{ color: colors.textPrimary }}>
                    {habit.name}
                  </p>
                </div>
                <Plus 
                  className="w-5 h-5" 
                  style={{ color: habit.color }}
                />
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <p className="text-xs text-center" style={{ color: colors.textTertiary }}>
              💡 <strong>Tip:</strong> Začni s jedným návykom a keď si ho osvojíš (21 dní), pridaj ďalší!
            </p>
          </div>
        </GlassCard>
      )}

      {/* Motivation Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Flame className="w-6 h-6" style={{ color: colors.telo }} />
          <h4 className="font-semibold" style={{ color: colors.textPrimary }}>
            Prečo návyky fungujú?
          </h4>
        </div>

        <div className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
          <div className="flex items-start gap-3">
            <CheckSquare className="w-4 h-4 mt-0.5" style={{ color: colors.strava }} />
            <p><strong>Automatizácia:</strong> Po čase sa stávajú prirodzenými</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckSquare className="w-4 h-4 mt-0.5" style={{ color: colors.mysel }} />
            <p><strong>Postupnosť:</strong> Malé kroky vedú k veľkým zmenám</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckSquare className="w-4 h-4 mt-0.5" style={{ color: colors.accent }} />
            <p><strong>Motivácia:</strong> Vidíš svoj pokrok každý deň</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}