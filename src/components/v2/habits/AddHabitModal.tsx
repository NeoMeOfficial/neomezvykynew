import React, { useState } from 'react';
import { X, Plus, Lock, Heart, Dumbbell, Brain, Utensils, Moon, TrendingUp, type LucideIcon } from 'lucide-react';
import { colors } from '../../../theme/warmDusk';
import { useSubscription } from '../../../contexts/SubscriptionContext';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: any) => void;
}

const HABIT_CATEGORIES: { id: string; name: string; color: string; icon: LucideIcon }[] = [
  { id: 'health', name: 'Zdravie', color: '#7A9E78', icon: Heart },
  { id: 'fitness', name: 'Pohyb', color: '#6B4C3B', icon: Dumbbell },
  { id: 'mindfulness', name: 'Myseľ', color: '#A8848B', icon: Brain },
  { id: 'nutrition', name: 'Výživa', color: '#C27A6E', icon: Utensils },
  { id: 'sleep', name: 'Spánok', color: '#B8864A', icon: Moon },
  { id: 'productivity', name: 'Produktivita', color: '#8B7D6B', icon: TrendingUp },
];

const HABIT_FREQUENCIES = [
  { id: 'daily', name: 'Každý deň' },
  { id: 'weekly', name: 'Týždenne' },
  { id: 'custom', name: 'Vlastné' }
];

export default function AddHabitModal({ isOpen, onClose, onSubmit }: AddHabitModalProps) {
  const { tier } = useSubscription();
  const isPremium = tier !== 'free';

  const [formData, setFormData] = useState({
    name: '',
    category: 'health',
    frequency: 'daily',
    target: '1',
    unit: 'krát'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPaywallMsg, setShowPaywallMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Názov návyku je povinný';
    }
    if (!formData.target || parseInt(formData.target) <= 0) {
      newErrors.target = 'Cieľ musí byť kladné číslo';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!isPremium) {
      setShowPaywallMsg(true);
      return;
    }

    const habit = {
      id: `habit_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      frequency: formData.frequency,
      target: parseInt(formData.target),
      unit: formData.unit,
      createdAt: new Date().toISOString(),
      streak: 0,
      completed: 0
    };

    onSubmit(habit);

    setFormData({ name: '', category: 'health', frequency: 'daily', target: '1', unit: 'krát' });
    setErrors({});
    setShowPaywallMsg(false);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCategory = HABIT_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
      <div
        className="w-full max-h-[90vh] overflow-y-auto pb-safe"
        style={{
          background: colors.bgGradient,
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: selectedCategory?.color || colors.telo }}
            >
              {selectedCategory ? <selectedCategory.icon size={20} color="#fff" /> : <Plus size={20} color="#fff" />}
            </div>
            <div>
              <h2 className="text-[18px] font-semibold" style={{ color: colors.textPrimary, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
                Pridať návyk
              </h2>
              <p className="text-[12px]" style={{ color: colors.textSecondary }}>Nastav si nový každodenný návyk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/30"
          >
            <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-6">
          {/* Habit name */}
          <div>
            <label className="block text-[12px] font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              Názov návyku
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="napr. Piť 2 litre vody, Cvičiť 30 minút..."
              className="w-full px-4 py-3.5 rounded-2xl text-[14px] outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.5)',
                border: errors.name ? '1.5px solid #C27A6E' : '1.5px solid rgba(255,255,255,0.6)',
                color: colors.textPrimary,
              }}
              onFocus={(e) => { e.target.style.borderColor = colors.telo; }}
              onBlur={(e) => { e.target.style.borderColor = errors.name ? '#C27A6E' : 'rgba(255,255,255,0.6)'; }}
            />
            {errors.name && <p className="text-[11px] mt-1.5" style={{ color: colors.periodka }}>{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-[12px] font-medium mb-3 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              Kategória
            </label>
            <div className="grid grid-cols-3 gap-2">
              {HABIT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
                  style={{
                    background: formData.category === cat.id ? `${cat.color}18` : 'rgba(255,255,255,0.35)',
                    border: formData.category === cat.id ? `1.5px solid ${cat.color}` : '1.5px solid transparent',
                  }}
                >
                  <cat.icon size={18} color={formData.category === cat.id ? cat.color : '#8B7560'} />
                  <span className="text-[11px] font-medium" style={{ color: formData.category === cat.id ? cat.color : colors.textSecondary }}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target & Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[12px] font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                Cieľ
              </label>
              <input
                type="number"
                min="1"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl text-[14px] font-semibold outline-none text-center"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  border: errors.target ? '1.5px solid #C27A6E' : '1.5px solid rgba(255,255,255,0.6)',
                  color: colors.textPrimary,
                }}
                onFocus={(e) => { e.target.style.borderColor = colors.telo; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.6)'; }}
              />
              {errors.target && <p className="text-[11px] mt-1" style={{ color: colors.periodka }}>{errors.target}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-medium mb-2 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
                Jednotka
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl text-[14px] outline-none"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  color: colors.textPrimary,
                }}
              >
                <option value="krát">krát</option>
                <option value="minút">minút</option>
                <option value="hodín">hodín</option>
                <option value="pohárov">pohárov</option>
                <option value="strán">strán</option>
                <option value="krokov">krokov</option>
              </select>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-[12px] font-medium mb-3 uppercase tracking-wide" style={{ color: colors.textSecondary }}>
              Frekvencia
            </label>
            <div className="flex gap-2">
              {HABIT_FREQUENCIES.map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: freq.id })}
                  className="flex-1 py-3 rounded-2xl text-[13px] font-medium transition-all"
                  style={{
                    background: formData.frequency === freq.id ? colors.telo : 'rgba(255,255,255,0.35)',
                    color: formData.frequency === freq.id ? '#fff' : colors.textSecondary,
                    border: formData.frequency === freq.id ? `1.5px solid ${colors.telo}` : '1.5px solid transparent',
                  }}
                >
                  {freq.name}
                </button>
              ))}
            </div>
          </div>

          {/* Paywall message */}
          {showPaywallMsg && (
            <div className="rounded-2xl p-4" style={{ background: `${colors.accent}10`, border: `1px solid ${colors.accent}30` }}>
              <div className="flex items-start gap-2">
                <Lock size={15} style={{ color: colors.accent }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold mb-1" style={{ color: colors.accent }}>Návyk sa neuloží</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: colors.textSecondary }}>
                    Štúdie potvrdzujú, že sledovanie návykov zvyšuje úspešnosť ich dodržiavania o 40 %. Aktivuj NeoMe predplatné a každý pokrok si uchovaj.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-2xl text-[14px] font-medium"
              style={{ background: 'rgba(255,255,255,0.35)', color: colors.textSecondary }}
            >
              Zrušiť
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 px-4 rounded-2xl text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-md"
              style={{ background: selectedCategory?.color || colors.telo }}
            >
              <Plus className="w-4 h-4" />
              Vytvoriť návyk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
