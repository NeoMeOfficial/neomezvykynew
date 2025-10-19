import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, RotateCcw } from 'lucide-react';
import { PhaseKey } from './types';
import { format, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';
interface Symptom {
  id: string;
  name: string;
  icon: string;
  phases: PhaseKey[];
}
const SYMPTOMS: Symptom[] = [
// Menstrual phase symptoms
{
  id: 'cramps',
  name: 'Kŕče',
  icon: '💢',
  phases: ['menstrual']
}, {
  id: 'heavy_flow',
  name: 'Silné krvácanie',
  icon: '🩸',
  phases: ['menstrual']
}, {
  id: 'back_pain',
  name: 'Bolesti chrbta',
  icon: '🦴',
  phases: ['menstrual']
}, {
  id: 'headache',
  name: 'Bolesti hlavy',
  icon: '🤕',
  phases: ['menstrual', 'luteal']
}, {
  id: 'fatigue',
  name: 'Únava',
  icon: '😴',
  phases: ['menstrual', 'luteal']
}, {
  id: 'nausea',
  name: 'Nevoľnosť',
  icon: '🤢',
  phases: ['menstrual', 'luteal']
},
// Follicular phase symptoms
{
  id: 'energy_boost',
  name: 'Energia',
  icon: '⚡',
  phases: ['follicular']
}, {
  id: 'good_mood',
  name: 'Dobrá nálada',
  icon: '😊',
  phases: ['follicular', 'ovulation']
}, {
  id: 'clear_skin',
  name: 'Čistá pokožka',
  icon: '✨',
  phases: ['follicular']
}, {
  id: 'motivation',
  name: 'Motivácia',
  icon: '🎯',
  phases: ['follicular', 'ovulation']
},
// Ovulation phase symptoms
{
  id: 'increased_libido',
  name: 'Zvýšené libido',
  icon: '💖',
  phases: ['ovulation']
}, {
  id: 'cervical_mucus',
  name: 'Cervikálny hlien',
  icon: '💧',
  phases: ['ovulation']
}, {
  id: 'ovulation_pain',
  name: 'Ovulačná bolesť',
  icon: '⚠️',
  phases: ['ovulation']
}, {
  id: 'breast_tenderness',
  name: 'Citlivé prsia',
  icon: '🤱',
  phases: ['ovulation', 'luteal']
},
// Luteal phase symptoms
{
  id: 'bloating',
  name: 'Nadúvanie',
  icon: '🎈',
  phases: ['luteal']
}, {
  id: 'mood_swings',
  name: 'Zmeny nálady',
  icon: '🎭',
  phases: ['luteal']
}, {
  id: 'food_cravings',
  name: 'Chute na jedlo',
  icon: '🍫',
  phases: ['luteal']
}, {
  id: 'irritability',
  name: 'Podráždenie',
  icon: '😤',
  phases: ['luteal']
}, {
  id: 'acne',
  name: 'Akné',
  icon: '🔴',
  phases: ['luteal']
}, {
  id: 'sleep_issues',
  name: 'Problémy so spánkom',
  icon: '🌙',
  phases: ['luteal']
}, {
  id: 'anxiety',
  name: 'Úzkosť',
  icon: '😰',
  phases: ['luteal']
}, {
  id: 'depression',
  name: 'Smútok',
  icon: '😔',
  phases: ['luteal']
}];
interface SymptomTrackerProps {
  currentPhase: PhaseKey;
  currentDay: number;
  accessCode?: string;
  lastPeriodStart?: string | null; // ISO date string
}
export function SymptomTracker({
  currentPhase,
  currentDay,
  accessCode,
  lastPeriodStart
}: SymptomTrackerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [customSymptoms, setCustomSymptoms] = useState<Symptom[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customSymptomInput, setCustomSymptomInput] = useState('');

  // Calculate the actual date for the currentDay
  const getDateForCurrentDay = (): string => {
    if (!lastPeriodStart) {
      return new Date().toISOString().split('T')[0]; // Fallback to today
    }
    const periodStartDate = new Date(lastPeriodStart);
    const targetDate = addDays(periodStartDate, currentDay - 1); // currentDay is 1-indexed
    return targetDate.toISOString().split('T')[0];
  };
  const currentDate = getDateForCurrentDay();
  const currentDateObject = new Date(currentDate);
  const today = new Date();
  const isToday = format(currentDateObject, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

  // Load custom symptoms from localStorage
  useEffect(() => {
    const customSymptomsKey = accessCode ? `custom_symptoms_${accessCode}` : 'temp_custom_symptoms';
    const savedCustomSymptoms = localStorage.getItem(customSymptomsKey);
    if (savedCustomSymptoms) {
      setCustomSymptoms(JSON.parse(savedCustomSymptoms));
    }
  }, [accessCode]);

  // Filter symptoms relevant to current phase + custom symptoms
  const relevantSymptoms = [...SYMPTOMS.filter(symptom => symptom.phases.includes(currentPhase)), ...customSymptoms];

  // Load saved symptoms and notes for the current day being tracked
  useEffect(() => {
    const symptomsKey = accessCode ? `symptoms_${accessCode}_${currentDate}` : `temp_symptoms_${currentDate}`;
    const notesKey = accessCode ? `notes_${accessCode}_${currentDate}` : `temp_notes_${currentDate}`;
    const savedSymptoms = localStorage.getItem(symptomsKey);
    const savedNotes = localStorage.getItem(notesKey);
    setSelectedSymptoms(savedSymptoms ? JSON.parse(savedSymptoms) : []);
    setNotes(savedNotes || '');
    setHasChanges(false);
  }, [accessCode, currentDate]);
  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      const newSelected = prev.includes(symptomId) ? prev.filter(id => id !== symptomId) : [...prev, symptomId];
      setHasChanges(true);
      return newSelected;
    });
  };
  
  const addCustomSymptom = () => {
    if (!customSymptomInput.trim()) return;
    
    const newSymptom: Symptom = {
      id: `custom_${Date.now()}`,
      name: customSymptomInput.trim(),
      icon: '✏️',
      phases: ['menstrual', 'follicular', 'ovulation', 'luteal']
    };
    
    const updatedCustomSymptoms = [...customSymptoms, newSymptom];
    setCustomSymptoms(updatedCustomSymptoms);
    
    // Save to localStorage
    const customSymptomsKey = accessCode ? `custom_symptoms_${accessCode}` : 'temp_custom_symptoms';
    localStorage.setItem(customSymptomsKey, JSON.stringify(updatedCustomSymptoms));
    
    // Clear input and close
    setCustomSymptomInput('');
    setIsAddingCustom(false);
  };
  
  const saveSymptoms = () => {
    const symptomsKey = accessCode ? `symptoms_${accessCode}_${currentDate}` : `temp_symptoms_${currentDate}`;
    const notesKey = accessCode ? `notes_${accessCode}_${currentDate}` : `temp_notes_${currentDate}`;
    localStorage.setItem(symptomsKey, JSON.stringify(selectedSymptoms));
    localStorage.setItem(notesKey, notes);
    setHasChanges(false);
  };
  const resetSymptoms = () => {
    setSelectedSymptoms([]);
    setNotes('');
    setHasChanges(true);
  };
  const getPhaseDisplayName = (phase: PhaseKey): string => {
    const names = {
      menstrual: 'Menštruačná',
      follicular: 'Folikulárna',
      ovulation: 'Ovulačná',
      luteal: 'Luteálna'
    };
    return names[phase];
  };
  return <div className="space-y-4">
      {/* Date Header */}
      

      {/* Header */}
      <div>
        
        <p className="text-sm mb-3" style={{
        color: '#955F6A'
      }}>
          Zaznamenajte príznaky pre lekársku konzultáciu
        </p>
      </div>

      {/* Symptom Tags */}
      <div className="flex flex-wrap gap-2">
        {relevantSymptoms.map(symptom => <Badge key={symptom.id} variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"} className={`cursor-pointer select-none text-xs py-1 px-2.5 transition-all duration-200 symptom-glass ${selectedSymptoms.includes(symptom.id) ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`} onClick={() => toggleSymptom(symptom.id)} style={{
        backgroundColor: selectedSymptoms.includes(symptom.id) ? undefined : '#FBF8F9',
        color: selectedSymptoms.includes(symptom.id) ? undefined : '#955F6A'
      }}>
            <span className="mr-1.5">{symptom.icon}</span>
            {symptom.name}
          </Badge>)}
        
        {/* Add Custom Symptom */}
        {isAddingCustom ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={customSymptomInput}
              onChange={(e) => setCustomSymptomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCustomSymptom();
                } else if (e.key === 'Escape') {
                  setIsAddingCustom(false);
                  setCustomSymptomInput('');
                }
              }}
              onBlur={() => {
                if (!customSymptomInput.trim()) {
                  setIsAddingCustom(false);
                }
              }}
              placeholder="Zadaj príznak..."
              className="text-xs py-1 px-2.5 border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300"
              style={{
                backgroundColor: '#FBF8F9',
                color: '#955F6A',
                minWidth: '150px'
              }}
              autoFocus
            />
          </div>
        ) : (
          <Badge
            variant="outline"
            className="cursor-pointer select-none text-xs py-1 px-2.5 transition-all duration-200 hover:bg-muted border-dashed"
            onClick={() => setIsAddingCustom(true)}
            style={{
              backgroundColor: '#FBF8F9',
              color: '#955F6A',
              borderColor: '#E5D4D7'
            }}
          >
            <span className="mr-1.5">+</span>
            Zadaj vlastný
          </Badge>
        )}
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium" style={{
          color: '#955F6A'
        }}>Poznámky</span>
        </div>
        
        <Textarea value={notes} onChange={e => {
        setNotes(e.target.value);
        setHasChanges(true);
      }} placeholder="Napíš si poznámky o svojom dni" className="min-h-[80px] resize-none placeholder:text-[#955F6A]" style={{
        backgroundColor: '#FBF8F9',
        borderColor: '#E5D4D7',
        color: '#955F6A'
      }} />
      </div>

      {/* Action Buttons */}
      {hasChanges && <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={saveSymptoms} className="flex items-center gap-1.5">
            <Save className="w-3 h-3" />
            Uložiť
          </Button>
          <Button size="sm" variant="outline" onClick={resetSymptoms} className="flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3" />
            Vymazať
          </Button>
        </div>}

      {/* Selected Count */}
      {(selectedSymptoms.length > 0 || notes.trim()) && <div className="text-xs text-muted-foreground pt-1">
          {selectedSymptoms.length > 0 && `Zaznamenaných: ${selectedSymptoms.length} príznakov`}
          {selectedSymptoms.length > 0 && notes.trim() && ' • '}
          {notes.trim() && 'Poznámky pridané'}
        </div>}
    </div>;
}