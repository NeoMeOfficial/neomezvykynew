import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { HistoricalDataOverview, ExportButton } from '../HistoricalDataOverview';
import { parseISO, isAfter, isBefore, startOfDay } from 'date-fns';

interface HistoricalEntry {
  date: string;
  symptoms: string[];
  notes: string;
}

interface DataOverviewSectionProps {
  accessCode?: string;
}

export function DataOverviewSection({
  accessCode
}: DataOverviewSectionProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Load historical data from localStorage
  useEffect(() => {
    const loadHistoricalData = () => {
      const data: HistoricalEntry[] = [];
      
      // Get all localStorage keys for this access code
      const prefix = accessCode ? `symptoms_${accessCode}_` : 'temp_symptoms_';
      const notesPrefix = accessCode ? `notes_${accessCode}_` : 'temp_notes_';
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          const date = key.replace(prefix, '');
          const symptomsData = localStorage.getItem(key);
          const notesData = localStorage.getItem(`${notesPrefix}${date}`);
          
          if (symptomsData || notesData) {
            const symptoms = symptomsData ? JSON.parse(symptomsData) : [];
            const notes = notesData || '';
            
            // Map symptom IDs to readable names
            const symptomNames = symptoms.map((id: string) => {
              const symptomMap: { [key: string]: string } = {
                'cramps': 'Kŕče',
                'heavy_flow': 'Silné krvácanie',
                'back_pain': 'Bolesti chrbta',
                'headache': 'Bolesti hlavy',
                'fatigue': 'Únava',
                'nausea': 'Nevoľnosť',
                'energy_boost': 'Energia',
                'good_mood': 'Dobrá nálada',
                'clear_skin': 'Čistá pokožka',
                'motivation': 'Motivácia',
                'increased_libido': 'Zvýšené libido',
                'cervical_mucus': 'Cervikálny hlien',
                'ovulation_pain': 'Ovulačná bolesť',
                'breast_tenderness': 'Citlivé prsia',
                'bloating': 'Nadúvanie',
                'mood_swings': 'Zmeny nálady',
                'food_cravings': 'Chute na jedlo',
                'irritability': 'Podráždenie',
                'acne': 'Akné',
                'sleep_issues': 'Problémy so spánkom',
                'anxiety': 'Úzkosť',
                'depression': 'Smútok'
              };
              return symptomMap[id] || id;
            });
            
            data.push({
              date,
              symptoms: symptomNames,
              notes
            });
          }
        }
      }
      
      // Sort by date (newest first)
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHistoricalData(data);
    };

    loadHistoricalData();
  }, [accessCode]);

  // Filter data based on search term, date range, and selected symptoms
  const filteredData = historicalData.filter(entry => {
    const entryDate = parseISO(entry.date);
    
    // Date filter
    if (dateFilter.start && isBefore(entryDate, startOfDay(dateFilter.start))) return false;
    if (dateFilter.end && isAfter(entryDate, startOfDay(dateFilter.end))) return false;
    
    // Selected symptoms filter
    if (selectedSymptoms.length > 0 && !selectedSymptoms.some(symptom => entry.symptoms.includes(symptom))) return false;
    
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSymptoms = entry.symptoms.some(symptom => 
        symptom.toLowerCase().includes(searchLower)
      );
      const matchesNotes = entry.notes.toLowerCase().includes(searchLower);
      return matchesSymptoms || matchesNotes;
    }
    
    return true;
  });
  return (
    <>
      {/* Layered Glass - Multiple glass layers creating depth between header/content */}
      <div className="relative">
        {/* Background layer */}
        <div className="absolute inset-0 rounded-2xl z-0"
             style={{ 
               background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.3) 0%, rgba(253, 242, 248, 0.4) 100%)',
               backdropFilter: 'blur(8px)',
               WebkitBackdropFilter: 'blur(8px)',
               transform: 'translate(2px, 2px)'
             }}></div>
        
        {/* Header with elevated glass layer */}
        <div className="relative p-4 rounded-t-2xl z-10"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 242, 248, 0.95) 100%)',
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(149, 95, 106, 0.1)'
             }}>
          {/* Header glass accent */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" style={{ color: '#FF7782' }} />
              <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
                Prehľad údajov
              </h3>
            </div>
            <ExportButton 
              accessCode={accessCode} 
              filteredData={filteredData}
              selectedSymptoms={selectedSymptoms}
            />
          </div>
        </div>

        {/* Content with recessed glass layer */}
        <div className="p-6 space-y-6 rounded-b-2xl z-10 relative"
             style={{ 
               background: 'linear-gradient(135deg, rgba(251, 248, 249, 0.75) 0%, rgba(253, 242, 248, 0.80) 100%)',
               boxShadow: 'inset 0 2px 8px rgba(149, 95, 106, 0.05)'
             }}>
          <HistoricalDataOverview 
            accessCode={accessCode}
            onFiltersChange={(data, search, symptoms) => {
              setSearchTerm(search);
              setSelectedSymptoms(symptoms);
            }}
          />
        </div>
      </div>
    </>
  );
}