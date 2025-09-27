import React, { useState, useEffect } from 'react';
import { Calendar, Download, Search, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';
import { sk } from 'date-fns/locale';
import jsPDF from 'jspdf';
import periodkaLogo from '@/assets/periodka-logo.png';

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
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

    // Generate mock data if no data exists
    const generateMockData = () => {
      const prefix = accessCode ? `symptoms_${accessCode}_` : 'temp_symptoms_';
      const notesPrefix = accessCode ? `notes_${accessCode}_` : 'temp_notes_';
      
      // Check if we already have data
      const hasExistingData = Object.keys(localStorage).some(key => key.startsWith(prefix));
      
      if (!hasExistingData) {
        const symptoms = ['cramps', 'heavy_flow', 'back_pain', 'headache', 'fatigue', 'nausea', 'energy_boost', 'good_mood', 'clear_skin', 'motivation', 'increased_libido', 'cervical_mucus', 'ovulation_pain', 'breast_tenderness', 'bloating', 'mood_swings', 'food_cravings', 'irritability', 'acne', 'sleep_issues', 'anxiety', 'depression'];
        
        const sampleNotes = [
          'Dnes som sa cítila veľmi unavene, ale nálada bola stabilná.',
          'Silné kŕče ráno, popoludní sa zlepšilo po horúcej kúpeli.',
          'Veľmi dobrý deň, plná energie a motivácie.',
          'Menšie bolesti hlavy, možno kvôli počasiu.',
          'Cítim sa veľmi dobre, pokožka vyzerá čisto.',
          'Trochu náladová, ale celkovo v poriadku.',
          'Silné krvácanie, potrebujem si dať pozor na železo.',
          'Úžasná nálada, cítim sa sebavedomá.',
          'Trochu nadúvanie po jedle, musím byť opatrnejšia.',
          'Spala som veľmi zle, ráno som bola unavená.',
          'Perfektný deň bez žiadnych problémov!',
          'Citlivé prsia, pravdepodobne pred menštruáciou.',
          ''
        ];
        
        // Generate data for random days in the last 60 days
        for (let i = 0; i < 60; i++) {
          // Skip some days randomly (don't generate data for every day)
          if (Math.random() > 0.6) continue;
          
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          // Generate random symptoms (1-4 symptoms per day)
          const numSymptoms = Math.floor(Math.random() * 4) + 1;
          const selectedSymptoms = [];
          for (let j = 0; j < numSymptoms; j++) {
            const randomSymptom = symptoms[Math.floor(Math.random() * symptoms.length)];
            if (!selectedSymptoms.includes(randomSymptom)) {
              selectedSymptoms.push(randomSymptom);
            }
          }
          
          // Store symptoms
          localStorage.setItem(`${prefix}${dateStr}`, JSON.stringify(selectedSymptoms));
          
          // Add notes randomly (not every day has notes)
          if (Math.random() > 0.4) {
            const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
            if (randomNote) {
              localStorage.setItem(`${notesPrefix}${dateStr}`, randomNote);
            }
          }
        }
      }
    };

    generateMockData();
    loadHistoricalData();
  }, [accessCode]);

  // Get unique symptoms for filtering
  const uniqueSymptoms = [...new Set(historicalData.flatMap(entry => entry.symptoms))].sort();

  // Handle symptom selection
  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const clearAllSymptoms = () => {
    setSelectedSymptoms([]);
  };

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

  // Convert image to base64 for PDF embedding
  const getImageBase64 = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  // Export data for medical consultation as PDF
  const exportData = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    try {
      // Get logo as base64
      const logoBase64 = await getImageBase64(periodkaLogo);
      
      // Create branded header
      const createHeader = (doc: jsPDF, pageNum = 1) => {
        // Header background gradient effect
        doc.setFillColor(255, 119, 130); // #FF7782
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        // Add logo
        doc.addImage(logoBase64, 'PNG', 15, 8, 20, 20);
        
        // Brand name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Periodka', 45, 22);
        
        // Page number (top right)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Strana ${pageNum}`, pageWidth - 30, 15);
        
        // Subtitle
        doc.setFontSize(12);
        doc.text('Menštrpačný kalendár', 45, 30);
      };
      
      // Create footer
      const createFooter = (doc: jsPDF) => {
        doc.setFillColor(248, 250, 252); // Light gray
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Tento dokument bol vytvorený aplikáciou Periodka pre lekárske účely', 15, pageHeight - 8);
        doc.text(`Exportované: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: sk })}`, pageWidth - 80, pageHeight - 8);
      };
      
      let pageNum = 1;
      createHeader(doc, pageNum);
      createFooter(doc);
      
      // Document title
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('História menštrpačného cyklu', 20, 55);
      
      // Document purpose
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Pre lekársku konzultáciu', 20, 65);
      
      // Summary section with background
      doc.setFillColor(253, 242, 248); // Light pink background
      doc.rect(15, 75, pageWidth - 30, 25, 'F');
      
      doc.setTextColor(149, 95, 106);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Súhrn údajov', 20, 85);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`• Celkový počet záznamov: ${filteredData.length}`, 25, 92);
      
      // Get unique symptoms from filtered data
      const uniqueFilteredSymptoms = [...new Set(filteredData.flatMap(entry => entry.symptoms))];
      doc.text(`• Počet rôznych príznakov: ${uniqueFilteredSymptoms.length}`, 25, 97);
      
      let yPosition = 115;
      
      // Data entries section
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Detailné záznamy', 20, yPosition);
      yPosition += 15;
      
      filteredData.forEach((entry, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          pageNum++;
          createHeader(doc, pageNum);
          createFooter(doc);
          yPosition = 55;
        }
        
        const date = format(parseISO(entry.date), 'EEEE, dd.MM.yyyy', { locale: sk });
        const capitalizedDate = date.charAt(0).toUpperCase() + date.slice(1);
        
        // Entry background (alternating colors)
        const bgColor = index % 2 === 0 ? [253, 242, 248] : [255, 255, 255];
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        
        const entryHeight = 15 + (entry.symptoms.length * 5) + (entry.notes ? 15 : 0);
        doc.rect(15, yPosition - 5, pageWidth - 30, entryHeight, 'F');
        
        // Date header with accent
        doc.setFillColor(255, 119, 130);
        doc.rect(15, yPosition - 5, 5, entryHeight, 'F');
        
        doc.setTextColor(255, 119, 130);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(capitalizedDate, 25, yPosition + 5);
        yPosition += 12;
        
        // Symptoms section
        if (entry.symptoms.length > 0) {
          doc.setTextColor(80, 80, 80);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('Príznaky:', 25, yPosition);
          yPosition += 6;
          
          doc.setFont('helvetica', 'normal');
          entry.symptoms.forEach(symptom => {
            doc.setTextColor(100, 100, 100);
            doc.text('•', 30, yPosition);
            doc.setTextColor(60, 60, 60);
            doc.text(symptom, 35, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        }
        
        // Notes section
        if (entry.notes) {
          doc.setTextColor(80, 80, 80);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('Poznámky:', 25, yPosition);
          yPosition += 6;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
          const noteLines = doc.splitTextToSize(entry.notes, 150);
          noteLines.forEach((line: string) => {
            doc.text(line, 30, yPosition);
            yPosition += 5;
          });
        }
        
        yPosition += 8;
      });
      
      // Final page summary if multiple pages
      if (pageNum > 1) {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          pageNum++;
          createHeader(doc, pageNum);
          createFooter(doc);
          yPosition = 55;
        }
        
        // Summary box
        doc.setFillColor(253, 242, 248);
        doc.rect(15, yPosition, pageWidth - 30, 35, 'F');
        
        doc.setTextColor(149, 95, 106);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Záverečný súhrn', 20, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Dokument obsahuje ${filteredData.length} záznamov na ${pageNum} stranách`, 20, yPosition + 18);
        doc.text('Určené pre medicínske konzultácie a diagnostiku', 20, yPosition + 25);
      }
      
    } catch (error) {
      console.error('Error loading logo:', error);
      // Fallback without logo
      doc.setTextColor(255, 119, 130);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Periodka', 20, 25);
    }
    
    // Save the PDF
    doc.save(`periodka-menstrual-data-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium" style={{ color: '#FF7782' }}>
            História záznamov
          </h3>
          <p className="text-sm" style={{ color: '#FF7782' }}>
            Pre lekársku konzultáciu
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Hľadať v príznakoch a poznámkach..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 placeholder:text-[#B0868D]"
            style={{
              backgroundColor: 'white',
              borderColor: '#E5D4D7',
              color: '#955F6A'
            }}
          />
        </div>
      </div>

      {/* Multiselect Dropdown for Symptoms */}
      {uniqueSymptoms.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium" style={{ color: '#FF7782' }}>
            Filtrovať podľa príznakov:
          </label>
          
          {/* Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50 transition-colors"
              style={{ 
                borderColor: '#E5D4D7',
                color: selectedSymptoms.length > 0 ? '#FF7782' : '#955F6A'
              }}
            >
              <span>
                {selectedSymptoms.length === 0 
                  ? 'Vyberte príznaky...' 
                  : `${selectedSymptoms.length} ${selectedSymptoms.length === 1 ? 'príznak' : selectedSymptoms.length < 5 ? 'príznaky' : 'príznakov'}`
                }
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                   style={{ borderColor: '#E5D4D7' }}>
                
                {/* Clear All Button */}
                {selectedSymptoms.length > 0 && (
                  <div className="p-2 border-b" style={{ borderColor: '#E5D4D7' }}>
                    <button
                      onClick={clearAllSymptoms}
                      className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Zrušiť všetky
                    </button>
                  </div>
                )}
                
                {/* Symptom Options */}
                <div className="p-1">
                  {uniqueSymptoms.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    const symptomCount = historicalData.filter(entry => entry.symptoms.includes(symptom)).length;
                    
                    return (
                      <button
                        key={symptom}
                        onClick={() => toggleSymptom(symptom)}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 flex items-center justify-between ${
                          isSelected ? 'bg-rose-50' : ''
                        }`}
                        style={{ color: isSelected ? '#FF7782' : '#955F6A' }}
                      >
                        <span className="flex items-center gap-2">
                          <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${
                            isSelected ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-300' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="text-xs">✓</span>}
                          </div>
                          {symptom}
                        </span>
                        <span className="text-xs text-gray-400">({symptomCount})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Selected Symptoms Display */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="outline"
                  className="text-xs py-1 px-2 flex items-center gap-1"
                  style={{
                    backgroundColor: '#FFF',
                    borderColor: '#FF7782',
                    color: '#FF7782'
                  }}
                >
                  {symptom}
                  <button
                    onClick={() => toggleSymptom(symptom)}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search and Filter Stats */}
      <div className="space-y-3">
        
        <div className="flex gap-2 text-xs" style={{ color: '#955F6A' }}>
          <span>Zobrazených záznamov: {filteredData.length}</span>
          <span>•</span>
          <span>Celkom: {historicalData.length}</span>
          {selectedSymptoms.length > 0 && (
            <>
              <span>•</span>
              <span>Filtrované príznaky: {selectedSymptoms.length}</span>
            </>
          )}
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
                <Calendar className="w-4 h-4" style={{ color: '#FF7782' }} />
                <span className="font-medium text-sm" style={{ color: '#FF7782' }}>
                  {(() => {
                    const formatted = format(parseISO(entry.date), 'EEEE, dd.MM.yyyy', { locale: sk });
                    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
                  })()}
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
  
  // Convert image to base64 for PDF embedding
  const getImageBase64 = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };
  
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

  const exportData = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    try {
      // Get logo as base64
      const logoBase64 = await getImageBase64(periodkaLogo);
      
      // Create branded header
      const createHeader = (doc: jsPDF, pageNum = 1) => {
        // Header background gradient effect
        doc.setFillColor(255, 119, 130); // #FF7782
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        // Add logo
        doc.addImage(logoBase64, 'PNG', 15, 8, 20, 20);
        
        // Brand name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Periodka', 45, 22);
        
        // Page number (top right)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Strana ${pageNum}`, pageWidth - 30, 15);
        
        // Subtitle
        doc.setFontSize(12);
        doc.text('Menštrpačný kalendár', 45, 30);
      };
      
      // Create footer
      const createFooter = (doc: jsPDF) => {
        doc.setFillColor(248, 250, 252); // Light gray
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Tento dokument bol vytvorený aplikáciou Periodka pre lekárske účely', 15, pageHeight - 8);
        doc.text(`Exportované: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: sk })}`, pageWidth - 80, pageHeight - 8);
      };
      
      let pageNum = 1;
      createHeader(doc, pageNum);
      createFooter(doc);
      
      // Document title
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('História menštrpačného cyklu', 20, 55);
      
      // Document purpose
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Pre lekársku konzultáciu', 20, 65);
      
      // Summary section with background
      doc.setFillColor(253, 242, 248); // Light pink background
      doc.rect(15, 75, pageWidth - 30, 25, 'F');
      
      doc.setTextColor(149, 95, 106);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Súhrn údajov', 20, 85);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`• Celkový počet záznamov: ${historicalData.length}`, 25, 92);
      
      // Get unique symptoms from filtered data
      const uniqueFilteredSymptoms = [...new Set(historicalData.flatMap(entry => entry.symptoms))];
      doc.text(`• Počet rôznych príznakov: ${uniqueFilteredSymptoms.length}`, 25, 97);
      
      let yPosition = 115;
      
      // Data entries section
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Detailné záznamy', 20, yPosition);
      yPosition += 15;
      
      historicalData.forEach((entry, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          pageNum++;
          createHeader(doc, pageNum);
          createFooter(doc);
          yPosition = 55;
        }
        
        const date = format(parseISO(entry.date), 'EEEE, dd.MM.yyyy', { locale: sk });
        const capitalizedDate = date.charAt(0).toUpperCase() + date.slice(1);
        
        // Entry background (alternating colors)
        const bgColor = index % 2 === 0 ? [253, 242, 248] : [255, 255, 255];
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        
        const entryHeight = 15 + (entry.symptoms.length * 5) + (entry.notes ? 15 : 0);
        doc.rect(15, yPosition - 5, pageWidth - 30, entryHeight, 'F');
        
        // Date header with accent
        doc.setFillColor(255, 119, 130);
        doc.rect(15, yPosition - 5, 5, entryHeight, 'F');
        
        doc.setTextColor(255, 119, 130);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(capitalizedDate, 25, yPosition + 5);
        yPosition += 12;
        
        // Symptoms section
        if (entry.symptoms.length > 0) {
          doc.setTextColor(80, 80, 80);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('Príznaky:', 25, yPosition);
          yPosition += 6;
          
          doc.setFont('helvetica', 'normal');
          entry.symptoms.forEach(symptom => {
            doc.setTextColor(100, 100, 100);
            doc.text('•', 30, yPosition);
            doc.setTextColor(60, 60, 60);
            doc.text(symptom, 35, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        }
        
        // Notes section
        if (entry.notes) {
          doc.setTextColor(80, 80, 80);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('Poznámky:', 25, yPosition);
          yPosition += 6;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
          const noteLines = doc.splitTextToSize(entry.notes, 150);
          noteLines.forEach((line: string) => {
            doc.text(line, 30, yPosition);
            yPosition += 5;
          });
        }
        
        yPosition += 8;
      });
      
      // Final page summary if multiple pages
      if (pageNum > 1) {
        if (yPosition > pageHeight - 80) {
          doc.addPage();
          pageNum++;
          createHeader(doc, pageNum);
          createFooter(doc);
          yPosition = 55;
        }
        
        // Summary box
        doc.setFillColor(253, 242, 248);
        doc.rect(15, yPosition, pageWidth - 30, 35, 'F');
        
        doc.setTextColor(149, 95, 106);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Záverečný súhrn', 20, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Dokument obsahuje ${historicalData.length} záznamov na ${pageNum} stranách`, 20, yPosition + 18);
        doc.text('Určené pre medicínske konzultácie a diagnostiku', 20, yPosition + 25);
      }
      
    } catch (error) {
      console.error('Error loading logo:', error);
      // Fallback without logo
      doc.setTextColor(255, 119, 130);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Periodka', 20, 25);
    }
    
    // Save the PDF
    doc.save(`periodka-menstrual-data-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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