import React, { useState } from 'react';
import { X, Plus, Target, Calendar, Clock } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: any) => void;
}

const HABIT_CATEGORIES = [
  { id: 'health', name: 'Zdravie', color: '#7A9E78', icon: '💚' },
  { id: 'fitness', name: 'Pohyb', color: '#6B4C3B', icon: '💪' },
  { id: 'mindfulness', name: 'Myseľ', color: '#A8848B', icon: '🧘' },
  { id: 'nutrition', name: 'Výživa', color: '#C27A6E', icon: '🥗' },
  { id: 'sleep', name: 'Spánok', color: '#B8864A', icon: '😴' },
  { id: 'productivity', name: 'Produktivita', color: '#8B7D6B', icon: '📈' }
];

const HABIT_FREQUENCIES = [
  { id: 'daily', name: 'Každý deň' },
  { id: 'weekly', name: 'Týždenne' },
  { id: 'custom', name: 'Vlastné' }
];

export default function AddHabitModal({ isOpen, onClose, onSubmit }: AddHabitModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'health',
    frequency: 'daily',
    target: '1',
    unit: 'krát'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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

    // Create habit object
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
    
    // Reset form
    setFormData({
      name: '',
      category: 'health',
      frequency: 'daily',
      target: '1',
      unit: 'krát'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const selectedCategory = HABIT_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md max-h-[85vh] overflow-y-auto pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#6B4C3B' }}>
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#2E2218' }}>Pridať návyk</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#6B4C3B' }}>
              Názov návyku *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Napr. Piť viac vody, Cvičiť 30 minút..."
              className="w-full px-4 py-3 rounded-xl border border-white/35 focus:ring-2 focus:border-transparent"
              style={{ 
                focusRingColor: '#6B4C3B',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6B4C3B';
                e.target.style.boxShadow = `0 0 0 2px rgba(107, 76, 59, 0.1)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Target & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6B4C3B' }}>
                Cieľ *
              </label>
              <input
                type="number"
                min="1"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/35 focus:border-transparent"
                style={{ outline: 'none' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6B4C3B';
                  e.target.style.boxShadow = `0 0 0 2px rgba(107, 76, 59, 0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.target && <p className="text-red-500 text-sm mt-1">{errors.target}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#6B4C3B' }}>
                Jednotka
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-white/35 focus:border-transparent"
                style={{ outline: 'none' }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6B4C3B';
                  e.target.style.boxShadow = `0 0 0 2px rgba(107, 76, 59, 0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#6B4C3B' }}>
              Frekvencia
            </label>
            <div className="grid grid-cols-3 gap-2">
              {HABIT_FREQUENCIES.map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: freq.id })}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium`}
                  style={{
                    borderColor: formData.frequency === freq.id ? '#6B4C3B' : '#e5e7eb',
                    backgroundColor: formData.frequency === freq.id ? 'rgba(107, 76, 59, 0.1)' : 'transparent',
                    color: formData.frequency === freq.id ? '#6B4C3B' : '#6b7280'
                  }}
                >
                  {freq.name}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-300 font-medium hover:bg-white/20 transition-colors"
              style={{ color: '#6b7280' }}
            >
              Zrušiť
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-white font-medium hover:opacity-90 transition-all shadow-lg"
              style={{ background: '#6B4C3B' }}
            >
              Vytvoriť návyk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}