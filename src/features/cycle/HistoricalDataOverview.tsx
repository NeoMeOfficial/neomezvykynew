import React, { useState, useEffect } from 'react';
import { Calendar, Download, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isAfter, isBefore, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, getDaysInMonth } from 'date-fns';
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

  // Filter data based on search term, date range, and selected symptom
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

  // Generate symptom colors for calendar view
  const generateSymptomColors = (symptoms: string[]) => {
    const colors = [
      [255, 119, 130], // #FF7782 - rose
      [244, 114, 182], // #F472B6 - pink
      [168, 85, 247],  // #A855F7 - purple
      [59, 130, 246],  // #3B82F6 - blue
      [16, 185, 129],  // #10B981 - emerald
      [245, 158, 11],  // #F59E0B - amber
      [239, 68, 68],   // #EF4444 - red
      [99, 102, 241],  // #6366F1 - indigo
      [139, 69, 19],   // #8B4513 - brown
      [75, 85, 99],    // #4B5563 - gray
    ];
    
    const colorMap: { [key: string]: number[] } = {};
    symptoms.forEach((symptom, index) => {
      colorMap[symptom] = colors[index % colors.length];
    });
    
    return colorMap;
  };

  // Export data as calendar PDF
  const exportData = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Get unique symptoms from filtered data for legend
    const uniqueFilteredSymptoms = [...new Set(filteredData.flatMap(entry => entry.symptoms))].sort();
    const symptomColors = generateSymptomColors(uniqueFilteredSymptoms);
    
    try {
      // Get logo as base64
      const logoBase64 = await getImageBase64(periodkaLogo);
      
      // Create branded header
      const createHeader = (doc: jsPDF, pageNum = 1) => {
        // Header background
        doc.setFillColor(255, 119, 130);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        // Add logo
        doc.addImage(logoBase64, 'PNG', 15, 8, 20, 20);
        
        // Brand name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Periodka', 45, 22);
        
        // Page number
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Strana ${pageNum}`, pageWidth - 30, 15);
        
        // Subtitle
        doc.setFontSize(12);
        doc.text('Kalendárny prehľad', 45, 30);
      };
      
      // Create footer
      const createFooter = (doc: jsPDF) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('Kalendárny prehľad pre lekárske účely', 15, pageHeight - 8);
        doc.text(`Exportované: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: sk })}`, pageWidth - 80, pageHeight - 8);
      };

      // Draw calendar for a month
      const drawCalendar = (doc: jsPDF, date: Date, startY: number, calendarWidth: number, calendarHeight: number, startX: number = 15) => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        // Month header
        doc.setTextColor(255, 119, 130);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const monthName = format(date, 'LLLL yyyy', { locale: sk });
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        doc.text(capitalizedMonth, startX, startY);
        
        const headerHeight = 20;
        const dayHeaderHeight = 15;
        const cellWidth = calendarWidth / 7;
        const cellHeight = (calendarHeight - headerHeight - dayHeaderHeight) / 6;
        
        // Day headers
        const dayHeaders = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        
        dayHeaders.forEach((day, index) => {
          const x = startX + (index * cellWidth) + (cellWidth / 2);
          doc.text(day, x, startY + headerHeight, { align: 'center' });
        });
        
        // Calculate starting position for days
        const firstDayOfWeek = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1; // Convert Sunday = 0 to Monday = 0
        
        // Draw calendar grid and days
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let currentRow = 0;
        let currentCol = firstDayOfWeek;
        
        monthDays.forEach((day) => {
          const x = startX + (currentCol * cellWidth);
          const y = startY + headerHeight + dayHeaderHeight + (currentRow * cellHeight);
          
          // Draw cell border
          doc.setDrawColor(200, 200, 200);
          doc.rect(x, y, cellWidth, cellHeight);
          
          // Draw day number
          doc.text(format(day, 'd'), x + 5, y + 12);
          
          // Find symptoms for this day
          const dayString = format(day, 'yyyy-MM-dd');
          const dayEntry = filteredData.find(entry => entry.date === dayString);
          
          if (dayEntry && dayEntry.symptoms.length > 0) {
            // Draw colored dots for symptoms
            const maxDotsPerRow = Math.floor((cellWidth - 10) / 8);
            let dotX = x + 5;
            let dotY = y + cellHeight - 12;
            let dotCount = 0;
            
            dayEntry.symptoms.forEach((symptom) => {
              if (symptomColors[symptom]) {
                const color = symptomColors[symptom];
                doc.setFillColor(color[0], color[1], color[2]);
                doc.circle(dotX + 3, dotY, 2, 'F');
                
                dotX += 8;
                dotCount++;
                
                // Move to next row if needed
                if (dotCount >= maxDotsPerRow) {
                  dotX = x + 5;
                  dotY -= 6;
                  dotCount = 0;
                }
              }
            });
          }
          
          currentCol++;
          if (currentCol >= 7) {
            currentCol = 0;
            currentRow++;
          }
        });
        
        return startY + calendarHeight;
      };

      // Draw symptom legend
      const drawLegend = (doc: jsPDF, startY: number, symptoms: string[], colors: { [key: string]: number[] }) => {
        doc.setTextColor(149, 95, 106);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Legenda príznakov', 15, startY);
        
        let yPos = startY + 10;
        const itemsPerColumn = Math.ceil(symptoms.length / 2);
        const columnWidth = (pageWidth - 30) / 2;
        
        symptoms.forEach((symptom, index) => {
          const column = Math.floor(index / itemsPerColumn);
          const row = index % itemsPerColumn;
          const x = 15 + (column * columnWidth);
          const y = yPos + (row * 8);
          
          if (colors[symptom]) {
            const color = colors[symptom];
            doc.setFillColor(color[0], color[1], color[2]);
            doc.circle(x + 3, y - 2, 2, 'F');
          }
          
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(symptom, x + 10, y);
        });
        
        return yPos + (itemsPerColumn * 8) + 10;
      };

      // Get date range from filtered data
      const sortedDates = filteredData.map(entry => new Date(entry.date)).sort((a, b) => a.getTime() - b.getTime());
      const startDate = sortedDates.length > 0 ? sortedDates[0] : new Date();
      const endDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : new Date();
      
      // Generate all months between start and end date
      const months: Date[] = [];
      let currentDate = startOfMonth(startDate);
      const finalMonth = startOfMonth(endDate);
      
      while (currentDate <= finalMonth) {
        months.push(new Date(currentDate));
        currentDate = addMonths(currentDate, 1);
      }
      
      let pageNum = 1;
      let monthIndex = 0;
      
      while (monthIndex < months.length) {
        if (pageNum > 1) doc.addPage();
        
        createHeader(doc, pageNum);
        createFooter(doc);
        
        let yPosition = 55;
        
        // Draw legend on first page
        if (pageNum === 1) {
          yPosition = drawLegend(doc, yPosition, uniqueFilteredSymptoms, symptomColors);
          yPosition += 10;
        }
        
        // Calculate available space for calendars
        const availableHeight = pageHeight - yPosition - 30;
        const calendarHeight = Math.min(availableHeight / 2 - 10, 85);
        const calendarWidth = pageWidth - 30;
        
        // Draw first month
        if (monthIndex < months.length) {
          yPosition = drawCalendar(doc, months[monthIndex], yPosition, calendarWidth, calendarHeight);
          monthIndex++;
          yPosition += 15;
        }
        
        // Draw second month if there's space and more months
        if (monthIndex < months.length && yPosition + calendarHeight < pageHeight - 30) {
          drawCalendar(doc, months[monthIndex], yPosition, calendarWidth, calendarHeight);
          monthIndex++;
        }
        
        pageNum++;
      }
      
    } catch (error) {
      console.error('Error creating calendar PDF:', error);
      // Fallback to simple header without logo
      doc.setTextColor(255, 119, 130);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Periodka - Kalendárny prehľad', 20, 25);
    }
    
    // Save the PDF
    doc.save(`periodka-calendar-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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

      {/* Symptom Tags for Filtering */}
      {uniqueSymptoms.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: '#955F6A' }}>
              Filtrovať podľa príznakov:
            </span>
            {selectedSymptoms.length > 0 && (
              <button
                onClick={() => setSelectedSymptoms([])}
                className="text-xs underline hover:no-underline"
                style={{ color: '#955F6A' }}
              >
                Zrušiť filtre ({selectedSymptoms.length})
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {uniqueSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              const symptomCount = historicalData.filter(entry => entry.symptoms.includes(symptom)).length;
              
              return (
                <button
                  key={symptom}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
                    } else {
                      setSelectedSymptoms(prev => [...prev, symptom]);
                    }
                  }}
                  className={`text-xs py-1 px-2.5 rounded-full border transition-all hover:scale-105 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-rose-100 to-pink-100 border-rose-300' 
                      : 'bg-white/80 border-rose-200/50 hover:bg-rose-50/50'
                  }`}
                  style={{ 
                    color: isSelected ? '#FF7782' : '#955F6A',
                    fontWeight: isSelected ? '600' : '500'
                  }}
                >
                  {symptom} ({symptomCount})
                </button>
              );
            })}
          </div>
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
              <span>Filtre: {selectedSymptoms.join(', ')}</span>
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