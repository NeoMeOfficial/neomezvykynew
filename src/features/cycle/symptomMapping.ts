// Mapping between Slovak UI symptom names and English database symptom_type values
// UI has 12 symptoms, DB schema has 10 — we map and extend as needed

export interface SymptomMapping {
  uiLabel: string;
  emoji: string;
  dbKey: string;
}

export const SYMPTOM_MAP: SymptomMapping[] = [
  { uiLabel: 'Nálada', emoji: '😊', dbKey: 'mood_swings' },
  { uiLabel: 'Energia', emoji: '⚡', dbKey: 'fatigue' },
  { uiLabel: 'Kŕče', emoji: '🩸', dbKey: 'cramps' },
  { uiLabel: 'Spánok', emoji: '😴', dbKey: 'fatigue' }, // maps to fatigue (sleep-related)
  { uiLabel: 'Nadúvanie', emoji: '🫄', dbKey: 'bloating' },
  { uiLabel: 'Bolesť hlavy', emoji: '🤕', dbKey: 'headache' },
  { uiLabel: 'Úzkosť', emoji: '😰', dbKey: 'mood_swings' }, // anxiety → mood category
  { uiLabel: 'Chuť na sladké', emoji: '🍫', dbKey: 'other' }, // cravings
  { uiLabel: 'Plačlivosť', emoji: '😢', dbKey: 'mood_swings' },
  { uiLabel: 'Akné', emoji: '🔥', dbKey: 'acne' },
  { uiLabel: 'Opuchy', emoji: '💧', dbKey: 'bloating' }, // swelling → bloating category
  { uiLabel: 'Podráždenosť', emoji: '😤', dbKey: 'mood_swings' },
];

// Convert UI symptom label to database key
export function uiLabelToDbKey(label: string): string {
  const mapping = SYMPTOM_MAP.find(m => m.uiLabel === label);
  return mapping?.dbKey || 'other';
}

// Convert database key to UI label (returns first match)
export function dbKeyToUiLabel(dbKey: string): string {
  const mapping = SYMPTOM_MAP.find(m => m.dbKey === dbKey);
  return mapping?.uiLabel || dbKey;
}

// Get all unique database keys
export function getUniqueDbKeys(): string[] {
  return [...new Set(SYMPTOM_MAP.map(m => m.dbKey))];
}
