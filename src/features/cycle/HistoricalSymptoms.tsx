import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HistoricalSymptomsProps {
  date: Date;
  accessCode?: string;
}

const SYMPTOMS_MAP: Record<string, { name: string; icon: string }> = {
  'cramps': { name: 'Kŕče', icon: '💢' },
  'heavy_flow': { name: 'Silné krvácanie', icon: '🩸' },
  'back_pain': { name: 'Bolesti chrbta', icon: '🦴' },
  'headache': { name: 'Bolesti hlavy', icon: '🤕' },
  'fatigue': { name: 'Únava', icon: '😴' },
  'nausea': { name: 'Nevoľnosť', icon: '🤢' },
  'energy_boost': { name: 'Energia', icon: '⚡' },
  'good_mood': { name: 'Dobrá nálada', icon: '😊' },
  'clear_skin': { name: 'Čistá pokožka', icon: '✨' },
  'motivation': { name: 'Motivácia', icon: '🎯' },
  'increased_libido': { name: 'Zvýšené libido', icon: '💖' },
  'cervical_mucus': { name: 'Cervikálny hlien', icon: '💧' },
  'ovulation_pain': { name: 'Ovulačná bolesť', icon: '⚠️' },
  'breast_tenderness': { name: 'Citlivé prsia', icon: '🤱' },
  'bloating': { name: 'Nadúvanie', icon: '🎈' },
  'mood_swings': { name: 'Zmeny nálady', icon: '🎭' },
  'food_cravings': { name: 'Chute na jedlo', icon: '🍫' },
  'irritability': { name: 'Podráždenie', icon: '😤' },
  'acne': { name: 'Akné', icon: '🔴' },
  'sleep_issues': { name: 'Problémy so spánkom', icon: '🌙' },
  'anxiety': { name: 'Úzkosť', icon: '😰' },
  'depression': { name: 'Smútok', icon: '😔' }
};

export function HistoricalSymptoms({ date, accessCode }: HistoricalSymptomsProps) {
  const dateStr = date.toISOString().split('T')[0];
  const storageKey = accessCode 
    ? `symptoms_${accessCode}_${dateStr}` 
    : `temp_symptoms_${dateStr}`;
  
  const savedSymptoms = localStorage.getItem(storageKey);
  const symptoms = savedSymptoms ? JSON.parse(savedSymptoms) : [];

  if (symptoms.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Žiadne príznaky neboli zaznamenané
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">
          Zaznamenané príznaky
        </h4>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptomId: string) => {
            const symptom = SYMPTOMS_MAP[symptomId];
            if (!symptom) return null;
            
            return (
              <Badge
                key={symptomId}
                variant="secondary"
                className="text-sm py-1.5 px-3"
              >
                <span className="mr-1.5">{symptom.icon}</span>
                {symptom.name}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}