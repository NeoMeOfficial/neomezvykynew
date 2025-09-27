import React, { useState, useEffect } from 'react';
import { Calendar, Download, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isAfter, isBefore, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, getDaysInMonth, subMonths, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
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
        
        // Month header with background
        doc.setFillColor(255, 119, 130);
        doc.rect(startX, startY - 5, calendarWidth, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const monthName = format(date, 'LLLL yyyy', { locale: sk });
        const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        doc.text(capitalizedMonth, startX + 10, startY + 8);
        
        const headerHeight = 20;
        const dayHeaderHeight = 15;
        const cellWidth = calendarWidth / 7;
        const cellHeight = (calendarHeight - headerHeight - dayHeaderHeight) / 6;
        
        // Day headers background
        doc.setFillColor(253, 242, 248);
        doc.rect(startX, startY + headerHeight - 5, calendarWidth, dayHeaderHeight, 'F');
        
        // Day headers
        const dayHeaders = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];
        const dayHeadersShort = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
        
        doc.setTextColor(149, 95, 106);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        
        dayHeadersShort.forEach((day, index) => {
          const x = startX + (index * cellWidth) + (cellWidth / 2);
          doc.text(day, x, startY + headerHeight + 8, { align: 'center' });
        });
        
        // Calculate starting position for days
        const firstDayOfWeek = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1; // Convert Sunday = 0 to Monday = 0
        
        // Draw calendar grid
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        
        // Draw vertical lines
        for (let i = 0; i <= 7; i++) {
          const x = startX + (i * cellWidth);
          doc.line(x, startY + headerHeight + dayHeaderHeight - 5, x, startY + calendarHeight);
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= 6; i++) {
          const y = startY + headerHeight + dayHeaderHeight - 5 + (i * cellHeight);
          doc.line(startX, y, startX + calendarWidth, y);
        }
        
        // Draw days
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let currentRow = 0;
        let currentCol = firstDayOfWeek;
        
        monthDays.forEach((day) => {
          const x = startX + (currentCol * cellWidth);
          const y = startY + headerHeight + dayHeaderHeight - 5 + (currentRow * cellHeight);
          
          // Highlight weekends
          if (currentCol === 5 || currentCol === 6) { // Saturday or Sunday
            doc.setFillColor(248, 250, 252);
            doc.rect(x, y, cellWidth, cellHeight, 'F');
          }
          
          // Draw day number
          doc.setTextColor(60, 60, 60);
          doc.text(format(day, 'd'), x + 5, y + 15);
          
          // Find symptoms for this day
          const dayString = format(day, 'yyyy-MM-dd');
          const dayEntry = filteredData.find(entry => entry.date === dayString);
          
          if (dayEntry && dayEntry.symptoms.length > 0) {
            // Draw colored dots for symptoms in a grid pattern
            const maxDotsPerRow = 4;
            const dotSize = 2;
            const dotSpacing = 6;
            const startDotX = x + 5;
            const startDotY = y + cellHeight - 15;
            
            dayEntry.symptoms.forEach((symptom, index) => {
              if (symptomColors[symptom]) {
                const color = symptomColors[symptom];
                const row = Math.floor(index / maxDotsPerRow);
                const col = index % maxDotsPerRow;
                
                const dotX = startDotX + (col * dotSpacing) + dotSize;
                const dotY = startDotY - (row * dotSpacing);
                
                doc.setFillColor(color[0], color[1], color[2]);
                doc.circle(dotX, dotY, dotSize, 'F');
              }
            });
          }
          
          currentCol++;
          if (currentCol >= 7) {
            currentCol = 0;
            currentRow++;
          }
        });
        
        return startY + calendarHeight + 10;
      };

      // Draw symptom legend
      const drawLegend = (doc: jsPDF, startY: number, symptoms: string[], colors: { [key: string]: number[] }) => {
        if (symptoms.length === 0) return startY;
        
        // Legend background
        doc.setFillColor(253, 242, 248);
        const legendHeight = Math.max(40, Math.ceil(symptoms.length / 3) * 10 + 20);
        doc.rect(15, startY - 5, pageWidth - 30, legendHeight, 'F');
        
        doc.setTextColor(149, 95, 106);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Legenda príznakov', 20, startY + 8);
        
        let yPos = startY + 18;
        const itemsPerColumn = Math.ceil(symptoms.length / 3);
        const columnWidth = (pageWidth - 50) / 3;
        
        symptoms.forEach((symptom, index) => {
          const column = Math.floor(index / itemsPerColumn);
          const row = index % itemsPerColumn;
          const x = 20 + (column * columnWidth);
          const y = yPos + (row * 8);
          
          if (colors[symptom]) {
            const color = colors[symptom];
            doc.setFillColor(color[0], color[1], color[2]);
            doc.circle(x + 3, y - 2, 2, 'F');
          }
          
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          const truncatedSymptom = symptom.length > 15 ? symptom.substring(0, 12) + '...' : symptom;
          doc.text(truncatedSymptom, x + 10, y);
        });
        
        return startY + legendHeight + 10;
      };

      // Get date range from filtered data
      const sortedDates = filteredData.map(entry => new Date(entry.date)).sort((a, b) => a.getTime() - b.getTime());
      let startDate, endDate;
      
      if (sortedDates.length > 0) {
        startDate = sortedDates[0];
        endDate = sortedDates[sortedDates.length - 1];
      } else {
        // If no data, show current month and previous month
        endDate = new Date();
        startDate = addMonths(endDate, -1);
      }
      
      // Generate all months between start and end date
      const months: Date[] = [];
      let currentDate = startOfMonth(startDate);
      const finalMonth = startOfMonth(endDate);
      
      while (currentDate <= finalMonth) {
        months.push(new Date(currentDate));
        currentDate = addMonths(currentDate, 1);
      }
      
      // Ensure we have at least 2 months to show
      if (months.length < 2) {
        const today = new Date();
        months.length = 0;
        months.push(addMonths(today, -1));
        months.push(today);
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
        }
        
        // Calculate available space for calendars
        const availableHeight = pageHeight - yPosition - 30;
        const calendarHeight = Math.min(availableHeight / 2 - 15, 90);
        const calendarWidth = pageWidth - 30;
        
        // Draw first month
        if (monthIndex < months.length) {
          yPosition = drawCalendar(doc, months[monthIndex], yPosition, calendarWidth, calendarHeight);
          monthIndex++;
        }
        
        // Draw second month if there's space and more months
        if (monthIndex < months.length && yPosition + calendarHeight < pageHeight - 30) {
          yPosition = drawCalendar(doc, months[monthIndex], yPosition, calendarWidth, calendarHeight);
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
    // Use the same calendar export logic as the main component
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Define symptom colors for calendar view
    const symptomColors = {
      'Kŕče': '#ef4444',
      'Silné krvácanie': '#dc2626',
      'Bolesti chrbta': '#f97316',
      'Bolesti hlavy': '#eab308',
      'Únava': '#84cc16',
      'Nevoľnosť': '#22c55e',
      'Energia': '#10b981',
      'Dobrá nálada': '#06b6d4',
      'Čistá pokožka': '#0ea5e9',
      'Motivácia': '#3b82f6',
      'Zvýšené libido': '#6366f1',
      'Cervikálny hlien': '#8b5cf6',
      'Ovulačná bolesť': '#a855f7',
      'Citlivé prsia': '#d946ef',
      'Nadúvanie': '#ec4899',
      'Zmeny nálady': '#f43f5e',
      'Chute na jedlo': '#fb7185',
      'Podráždenie': '#fda4af',
      'Akné': '#fbbf24',
      'Problémy so spánkom': '#94a3b8',
      'Úzkosť': '#64748b',
      'Smútok': '#475569'
    };

    try {
      // Get logo as base64
      const logoBase64 = await getImageBase64(periodkaLogo);
      
      // Create branded header
      const createHeader = (doc: jsPDF, pageNum = 1) => {
        doc.setFillColor(255, 119, 130);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        doc.addImage(logoBase64, 'PNG', 15, 8, 20, 20);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Periodka', 45, 22);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Strana ${pageNum}`, pageWidth - 30, 15);
        
        doc.setFontSize(12);
        doc.text('Menštrpačný kalendár - Kalendárny prehľad', 45, 30);
      };
      
      const createFooter = (doc: jsPDF) => {
        doc.setFillColor(248, 250, 252);
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

      // Get unique symptoms and create legend
      const uniqueSymptoms = [...new Set(historicalData.flatMap(entry => entry.symptoms))];
      
      // Legend section
      let yPosition = 45;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Legenda príznakov:', 20, yPosition);
      yPosition += 8;

      const legendCols = 3;
      const colWidth = (pageWidth - 40) / legendCols;
      let col = 0;

      uniqueSymptoms.forEach((symptom, index) => {
        const color = symptomColors[symptom] || '#6b7280';
        const rgb = hexToRgb(color);
        
        const xPos = 20 + (col * colWidth);
        
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.circle(xPos + 3, yPosition - 1, 2, 'F');
        
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(symptom, xPos + 8, yPosition);
        
        col++;
        if (col >= legendCols) {
          col = 0;
          yPosition += 6;
        }
      });

      if (col !== 0) yPosition += 6;
      yPosition += 15;

      // Calendar generation
      const today = new Date();
      const startDate = historicalData.length > 0 ? 
        startOfMonth(parseISO(historicalData[0].date)) : 
        startOfMonth(subMonths(today, 5));
      const endDate = addMonths(startDate, 12);

      // Helper function for color conversion
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 107, g: 116, b: 128 };
      };

      let currentDate = startDate;
      let monthsOnPage = 0;

      while (currentDate < endDate) {
        if (monthsOnPage >= 2 || yPosition > pageHeight - 120) {
          doc.addPage();
          pageNum++;
          createHeader(doc, pageNum);
          createFooter(doc);
          yPosition = 45;
          monthsOnPage = 0;
        }

        const monthYear = format(currentDate, 'LLLL yyyy', { locale: sk });
        const capitalizedMonth = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

        doc.setTextColor(255, 119, 130);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(capitalizedMonth, 20, yPosition);
        yPosition += 10;

        // Calendar grid
        const cellWidth = 25;
        const cellHeight = 15;
        const startX = 20;
        
        // Day headers
        const dayHeaders = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        
        dayHeaders.forEach((day, index) => {
          doc.text(day, startX + (index * cellWidth) + 10, yPosition);
        });
        yPosition += 8;

        // Calendar days
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endWeek = endOfWeek(monthEnd, { weekStartsOn: 1 });

        let day = startWeek;
        let row = 0;

        while (day <= endWeek && row < 6) {
          for (let col = 0; col < 7; col++) {
            const cellX = startX + (col * cellWidth);
            const cellY = yPosition + (row * cellHeight);
            
            // Cell background
            if (isSameMonth(day, currentDate)) {
              doc.setFillColor(255, 255, 255);
            } else {
              doc.setFillColor(249, 250, 251);
            }
            doc.rect(cellX, cellY, cellWidth, cellHeight, 'F');
            
            // Cell border
            doc.setDrawColor(229, 231, 235);
            doc.rect(cellX, cellY, cellWidth, cellHeight);
            
            // Weekend highlighting
            if (col === 5 || col === 6) {
              doc.setFillColor(254, 242, 242);
              doc.rect(cellX, cellY, cellWidth, cellHeight, 'F');
            }
            
            if (isSameMonth(day, currentDate)) {
              // Day number
              doc.setTextColor(60, 60, 60);
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.text(format(day, 'd'), cellX + 3, cellY + 10);
              
              // Check for symptoms on this day
              const dayData = historicalData.find(entry => 
                isSameDay(parseISO(entry.date), day)
              );
              
              if (dayData && dayData.symptoms.length > 0) {
                // Display symptom dots
                const maxDots = 4;
                const visibleSymptoms = dayData.symptoms.slice(0, maxDots);
                
                visibleSymptoms.forEach((symptom, index) => {
                  const color = symptomColors[symptom] || '#6b7280';
                  const rgb = hexToRgb(color);
                  
                  const dotX = cellX + 12 + (index % 2) * 6;
                  const dotY = cellY + 4 + Math.floor(index / 2) * 4;
                  
                  doc.setFillColor(rgb.r, rgb.g, rgb.b);
                  doc.circle(dotX, dotY, 1.5, 'F');
                });
                
                // More indicator if there are additional symptoms
                if (dayData.symptoms.length > maxDots) {
                  doc.setTextColor(100, 100, 100);
                  doc.setFontSize(7);
                  doc.text(`+${dayData.symptoms.length - maxDots}`, cellX + 18, cellY + 13);
                }
              }
            }
            
            day = addDays(day, 1);
          }
          row++;
        }
        
        yPosition += (row * cellHeight) + 20;
        currentDate = addMonths(currentDate, 1);
        monthsOnPage++;
      }

    } catch (error) {
      console.error('Error generating calendar PDF:', error);
      // Fallback simple export
      doc.setTextColor(255, 119, 130);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Periodka', 20, 25);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(12);
      doc.text('Kalendárny export sa nepodarilo vygenerovať', 20, 50);
    }
    
    doc.save(`periodka-calendar-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <button
      onClick={exportData}
      className="relative z-10 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-3xl bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-300 hover:from-rose-200 hover:to-pink-200 transition-all shadow-sm"
      style={{ color: '#FF7782' }}
    >
      <Download className="w-3 h-3" />
      Exportovať
    </button>
  );
}