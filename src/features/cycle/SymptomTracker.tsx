import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { PhaseKey } from './types';
import { format, addDays } from 'date-fns';
import { z } from 'zod';

interface Symptom {
  id: string;
  name: string;
  icon: string;
}

// All symptoms organized by categories
const SYMPTOM_CATEGORIES: Record<string, Symptom[]> = {
  'Energia & Nálada': [
    { id: 'good_energy', name: 'Dobrá energia', icon: '⚡' },
    { id: 'no_energy', name: 'Bez energie', icon: '😴' },
    { id: 'good_mood', name: 'Dobrá nálada', icon: '😊' },
    { id: 'irritability', name: 'Podráždená', icon: '😤' },
    { id: 'mood_swings', name: 'Zmeny nálady', icon: '🎭' },
    { id: 'anxiety', name: 'Úzkosť', icon: '😰' },
    { id: 'sadness', name: 'Smútok', icon: '😔' },
  ],
  'Telo & Fyzické': [
    { id: 'cramps', name: 'Kŕče', icon: '💢' },
    { id: 'bloating', name: 'Nafúknutá', icon: '🎈' },
    { id: 'water_retention', name: 'Zavodnená', icon: '💧' },
    { id: 'breast_tenderness', name: 'Citlivé prsia', icon: '🤱' },
    { id: 'back_pain', name: 'Bolesti chrbta', icon: '🦴' },
    { id: 'headache', name: 'Bolesti hlavy', icon: '🤕' },
    { id: 'nausea', name: 'Nevoľnosť', icon: '🤢' },
    { id: 'ovulation_pain', name: 'Ovulačná bolesť', icon: '⚠️' },
    { id: 'heavy_flow', name: 'Silné krvácanie', icon: '🩸' },
  ],
  'Koža': [
    { id: 'clear_skin', name: 'Čistá pleť', icon: '✨' },
    { id: 'oily_skin_acne', name: 'Mastná pleť, vyrážky', icon: '🔴' },
  ],
  'Tráviace & Iné': [
    { id: 'food_cravings', name: 'Chute na jedlo', icon: '🍫' },
    { id: 'sleep_issues', name: 'Problémy so spánkom', icon: '🌙' },
    { id: 'constipation', name: 'Zápcha', icon: '🚽' },
    { id: 'cervical_mucus', name: 'Cervikálny hlien', icon: '💧' },
  ],
};

// Top 6 most common symptoms shown by default
const TOP_SYMPTOM_IDS = ['good_energy', 'no_energy', 'cramps', 'bloating', 'headache', 'irritability'];

// Get all symptoms as flat array
const getAllSymptoms = (): Symptom[] => {
  return Object.values(SYMPTOM_CATEGORIES).flat();
};

// Get top symptoms
const getTopSymptoms = (): Symptom[] => {
  const allSymptoms = getAllSymptoms();
  return TOP_SYMPTOM_IDS.map(id => allSymptoms.find(s => s.id === id)!).filter(Boolean);
};

// Input validation schema
const customSymptomSchema = z.string()
  .trim()
  .min(1, 'Príznak nemôže byť prázdny')
  .max(50, 'Príznak musí mať menej ako 50 znakov')
  .regex(/^[a-zA-ZáäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ\s\-]+$/, 'Len písmená a pomlčky sú povolené');

interface SymptomUsage {
  [symptomId: string]: number;
}

interface SymptomTrackerProps {
  currentPhase: PhaseKey;
  currentDay: number;
  accessCode?: string;
  lastPeriodStart?: string | null;
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
  const [symptomUsage, setSymptomUsage] = useState<SymptomUsage>({});
  const [validationError, setValidationError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate the actual date for the currentDay
  const getDateForCurrentDay = (): string => {
    if (!lastPeriodStart) {
      return new Date().toISOString().split('T')[0];
    }
    const periodStartDate = new Date(lastPeriodStart);
    const targetDate = addDays(periodStartDate, currentDay - 1);
    return targetDate.toISOString().split('T')[0];
  };
  const currentDate = getDateForCurrentDay();

  // Load custom symptoms and usage data from localStorage
  useEffect(() => {
    const customSymptomsKey = accessCode ? `custom_symptoms_${accessCode}` : 'temp_custom_symptoms';
    const usageKey = accessCode ? `symptom_usage_${accessCode}` : 'temp_symptom_usage';
    
    const savedCustomSymptoms = localStorage.getItem(customSymptomsKey);
    const savedUsage = localStorage.getItem(usageKey);
    
    if (savedCustomSymptoms) {
      setCustomSymptoms(JSON.parse(savedCustomSymptoms));
    }
    if (savedUsage) {
      setSymptomUsage(JSON.parse(savedUsage));
    }
  }, [accessCode]);

  // Load saved symptoms and notes for the current day
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
      const isAdding = !prev.includes(symptomId);
      const newSelected = isAdding ? [...prev, symptomId] : prev.filter(id => id !== symptomId);
      
      if (isAdding) {
        const updatedUsage = {
          ...symptomUsage,
          [symptomId]: (symptomUsage[symptomId] || 0) + 1
        };
        setSymptomUsage(updatedUsage);
        
        const usageKey = accessCode ? `symptom_usage_${accessCode}` : 'temp_symptom_usage';
        localStorage.setItem(usageKey, JSON.stringify(updatedUsage));
      }
      
      setHasChanges(true);
      return newSelected;
    });
  };

  const addCustomSymptom = () => {
    try {
      const validatedInput = customSymptomSchema.parse(customSymptomInput);
      
      const allSymptoms = [...getAllSymptoms(), ...customSymptoms];
      const isDuplicate = allSymptoms.some(
        s => s.name.toLowerCase() === validatedInput.toLowerCase()
      );
      
      if (isDuplicate) {
        setValidationError('Tento príznak už existuje');
        return;
      }
      
      const newSymptom: Symptom = {
        id: `custom_${Date.now()}`,
        name: validatedInput,
        icon: '✏️',
      };
      const updatedCustomSymptoms = [...customSymptoms, newSymptom];
      setCustomSymptoms(updatedCustomSymptoms);

      const customSymptomsKey = accessCode ? `custom_symptoms_${accessCode}` : 'temp_custom_symptoms';
      localStorage.setItem(customSymptomsKey, JSON.stringify(updatedCustomSymptoms));

      setCustomSymptomInput('');
      setIsAddingCustom(false);
      setValidationError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      }
    }
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

  const renderSymptomBadge = (symptom: Symptom) => (
    <Badge
      key={symptom.id}
      variant={selectedSymptoms.includes(symptom.id) ? "default" : "outline"}
      className={`cursor-pointer select-none text-xs py-1 px-2.5 transition-all duration-200 ${
        selectedSymptoms.includes(symptom.id)
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'hover:bg-muted'
      }`}
      onClick={() => toggleSymptom(symptom.id)}
      style={{
        backgroundColor: selectedSymptoms.includes(symptom.id) ? undefined : '#FBF8F9',
        color: selectedSymptoms.includes(symptom.id) ? undefined : '#955F6A'
      }}
    >
      <span className="mr-1.5">{symptom.icon}</span>
      {symptom.name}
    </Badge>
  );

  const topSymptoms = getTopSymptoms();

  return (
    <Card className="border-[#E5D4D7] shadow-sm rounded-xl" style={{ backgroundColor: '#FBF8F9' }}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <h4 className="text-base font-medium" style={{ color: '#955F6A' }}>
          Zaznač si, ako sa dnes naozaj cítiš
        </h4>

        {/* Top Symptoms + Custom Button */}
        <div className="flex flex-wrap gap-2">
          {topSymptoms.map(renderSymptomBadge)}
          {!isAddingCustom && (
            <Badge
              variant="outline"
              className="cursor-pointer select-none text-xs py-1 px-2.5 transition-all duration-200 hover:bg-muted border-dashed"
              onClick={() => setIsAddingCustom(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#955F6A',
                borderColor: '#B8929A'
              }}
              data-tour="custom-symptom"
            >
              <span className="mr-1.5">+</span>
              Zadaj vlastný
            </Badge>
          )}
        </div>

        {/* Custom Symptom Input */}
        {isAddingCustom && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customSymptomInput}
                onChange={e => {
                  setCustomSymptomInput(e.target.value);
                  setValidationError('');
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    addCustomSymptom();
                  } else if (e.key === 'Escape') {
                    setIsAddingCustom(false);
                    setCustomSymptomInput('');
                    setValidationError('');
                  }
                }}
                placeholder="Zadaj príznak..."
                className="text-xs py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-300 flex-1"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#E5D4D7',
                  color: '#955F6A'
                }}
                autoFocus
                maxLength={50}
              />
              <Button size="sm" onClick={addCustomSymptom} className="text-xs">
                Pridať
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingCustom(false);
                  setCustomSymptomInput('');
                  setValidationError('');
                }}
                className="text-xs"
              >
                Zrušiť
              </Button>
            </div>
            {validationError && (
              <p className="text-xs text-red-500">{validationError}</p>
            )}
          </div>
        )}

        {/* Expandable Section */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-xs py-1.5 h-auto"
              style={{ color: '#955F6A' }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Skryť príznaky
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Zobraziť ďalšie príznaky
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 pt-2">
            {/* All Categories */}
            {Object.entries(SYMPTOM_CATEGORIES).map(([category, symptoms]) => (
              <div key={category} className="space-y-1.5">
                <h5 className="text-xs font-medium uppercase tracking-wide" style={{ color: '#B8929A' }}>
                  {category}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(renderSymptomBadge)}
                </div>
              </div>
            ))}

            {/* Custom Symptoms Category */}
            {customSymptoms.length > 0 && (
              <div className="space-y-1.5">
                <h5 className="text-xs font-medium uppercase tracking-wide" style={{ color: '#B8929A' }}>
                  Vlastné príznaky
                </h5>
                <div className="flex flex-wrap gap-2">
                  {customSymptoms.map(renderSymptomBadge)}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Separator before Notes */}
        <Separator className="bg-[#E5D4D7]" />

        {/* Notes Section */}
        <div className="space-y-1.5" data-tour="notes">
          <span className="text-sm font-medium" style={{ color: '#955F6A' }}>
            Poznámky o svojom dni:
          </span>
          <Textarea
            value={notes}
            onChange={e => {
              setNotes(e.target.value);
              setHasChanges(true);
            }}
            placeholder="..."
            className="min-h-[70px] resize-none placeholder:text-[#B8929A] focus:border-rose-300 focus:ring-2 focus:ring-rose-200 text-sm"
            style={{
              backgroundColor: 'white',
              borderColor: '#E5D4D7',
              color: '#955F6A'
            }}
          />
        </div>

        {/* Footer: Actions + Count */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            {hasChanges && (
              <>
                <Button size="sm" onClick={saveSymptoms} className="flex items-center gap-1.5 h-8 text-xs">
                  <Save className="w-3 h-3" />
                  Uložiť
                </Button>
                <Button size="sm" variant="outline" onClick={resetSymptoms} className="flex items-center gap-1.5 h-8 text-xs">
                  <RotateCcw className="w-3 h-3" />
                  Vymazať
                </Button>
              </>
            )}
          </div>
          {(selectedSymptoms.length > 0 || notes.trim()) && (
            <div className="text-xs" style={{ color: '#B8929A' }}>
              {selectedSymptoms.length > 0 && `${selectedSymptoms.length} príznakov`}
              {selectedSymptoms.length > 0 && notes.trim() && ' • '}
              {notes.trim() && 'poznámky'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
