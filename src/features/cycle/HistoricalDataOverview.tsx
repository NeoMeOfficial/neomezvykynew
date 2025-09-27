import React, { useState, useEffect } from 'react';
import { Calendar, Download, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';
import { sk } from 'date-fns/locale';

interface HistoricalEntry {
  date: string;
  symptoms: string[];
  notes: string;
}

interface HistoricalDataOverviewProps {
  accessCode?: string;
}

export function HistoricalDataOverview({ accessCode }: HistoricalDataOverviewProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>({});
  const [loading, setLoading] = useState(true);

  // Load historical data from localStorage
  useEffect(() => {
    const loadHistoricalData = () => {
      setLoading(true);
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
      setLoading(false);
    };

    loadHistoricalData();
  }, [accessCode]);

  // Filter data based on search term and date range
  const filteredData = historicalData.filter(entry => {
    const entryDate = parseISO(entry.date);
    
    // Date filter
    if (dateFilter.start && isBefore(entryDate, startOfDay(dateFilter.start))) return false;
    if (dateFilter.end && isAfter(entryDate, startOfDay(dateFilter.end))) return false;
    
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

  // Export data for medical consultation
  const exportData = () => {
    const exportText = filteredData.map(entry => {
      const date = format(parseISO(entry.date), 'dd.MM.yyyy', { locale: sk });
      const symptoms = entry.symptoms.length > 0 ? entry.symptoms.join(', ') : 'Žiadne príznaky';
      const notes = entry.notes || 'Žiadne poznámky';
      
      return `Dátum: ${date}\nPríznaky: ${symptoms}\nPoznámky: ${notes}\n${'='.repeat(50)}`;
    }).join('\n\n');
    
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `menstrual-data-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-medium" style={{ color: '#955F6A' }}>
            História záznamov
          </h3>
          <p className="text-sm" style={{ color: '#955F6A' }}>
            Pre lekársku konzultáciu
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Hľadať v príznakoch a poznámkach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            style={{
              backgroundColor: 'white',
              borderColor: '#E5D4D7',
              color: '#955F6A'
            }}
          />
        </div>
        
        <div className="flex gap-2 text-xs" style={{ color: '#955F6A' }}>
          <span>Zobrazených záznamov: {filteredData.length}</span>
          <span>•</span>
          <span>Celkom: {historicalData.length}</span>
        </div>
      </div>

      {/* Data List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {filteredData.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" style={{ color: '#955F6A' }} />
            <p className="text-sm" style={{ color: '#955F6A' }}>
              {historicalData.length === 0 
                ? 'Zatiaľ nemáte žiadne záznamy'
                : 'Nenašli sa žiadne záznamy pre zadané kritériá'
              }
            </p>
          </div>
        ) : (
          filteredData.map((entry, index) => (
            <div
              key={index}
              className="bg-white/80 rounded-lg border border-rose-200/50 p-3 space-y-2"
            >
              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: '#955F6A' }} />
                <span className="font-medium text-sm" style={{ color: '#955F6A' }}>
                  {format(parseISO(entry.date), 'EEEE, dd.MM.yyyy', { locale: sk })}
                </span>
              </div>

              {/* Symptoms */}
              {entry.symptoms.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium" style={{ color: '#955F6A' }}>
                    Príznaky:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {entry.symptoms.map((symptom, symptomIndex) => (
                      <Badge
                        key={symptomIndex}
                        variant="outline"
                        className="text-xs py-0.5 px-2"
                        style={{
                          backgroundColor: '#FFF',
                          borderColor: '#E5D4D7',
                          color: '#955F6A'
                        }}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <div className="space-y-1">
                  <span className="text-xs font-medium" style={{ color: '#955F6A' }}>
                    Poznámky:
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: '#955F6A' }}>
                    {entry.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Export button component for use in header
export function ExportButton({ accessCode }: { accessCode?: string }) {
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  
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
      
      setHistoricalData(data);
    };

    loadHistoricalData();
  }, [accessCode]);

  const exportData = () => {
    const exportText = historicalData.map(entry => {
      const date = format(parseISO(entry.date), 'dd.MM.yyyy', { locale: sk });
      const symptoms = entry.symptoms.length > 0 ? entry.symptoms.join(', ') : 'Žiadne príznaky';
      const notes = entry.notes || 'Žiadne poznámky';
      
      return `Dátum: ${date}\nPríznaky: ${symptoms}\nPoznámky: ${notes}\n${'='.repeat(50)}`;
    }).join('\n\n');
    
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `menstrual-data-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportData}
      disabled={historicalData.length === 0}
      className="relative z-10 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-3xl bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-300 hover:from-rose-200 hover:to-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      style={{ color: '#FF7782' }}
    >
      <Download className="w-3 h-3" />
      Exportovať
    </button>
  );
}