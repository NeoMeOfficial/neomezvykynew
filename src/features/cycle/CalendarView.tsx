import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Droplets, ChevronLeft, ChevronRight, FileText, Filter, Grid3X3, Calendar as CalendarGrid, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addWeeks, subWeeks, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import jsPDF from 'jspdf';
import { DerivedState, CycleData, PeriodIntensity } from './types';
import { isPeriodDate, isFertilityDate } from './utils';
import { PeriodIntensitySelector } from './components/PeriodIntensitySelector';
import { useIsMobile } from '@/hooks/use-mobile';
type OutcomeType = 'next-period' | 'fertile-days';
type ViewType = 'monthly' | 'weekly';

interface HistoricalEntry {
  date: string;
  symptoms: string[];
  notes: string;
}

interface CalendarViewProps {
  cycleData: CycleData;
  derivedState: DerivedState;
  onOutcomeSelect: (outcome: OutcomeType | null) => void;
  selectedOutcome: OutcomeType | null;
  onPeriodIntensityChange: (date: string, intensity: PeriodIntensity | null) => void;
  getPeriodIntensity: (date: string) => PeriodIntensity | undefined;
  accessCode?: string;
}
export function CalendarView({
  cycleData,
  derivedState,
  onOutcomeSelect,
  selectedOutcome,
  onPeriodIntensityChange,
  getPeriodIntensity,
  accessCode
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [selectedDayData, setSelectedDayData] = useState<{ symptoms: string[]; notes: string } | null>(null);
  const [symptomColorMap, setSymptomColorMap] = useState<{ [key: string]: string }>({});
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportStartMonth, setExportStartMonth] = useState<string>('');
  const [exportEndMonth, setExportEndMonth] = useState<string>('');
  const isMobile = useIsMobile();
  
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

  // Listen for export dialog trigger from header
  useEffect(() => {
    const handleExportDialogOpen = () => {
      setExportDialogOpen(true);
    };

    window.addEventListener('openExportDialog', handleExportDialogOpen);
    return () => {
      window.removeEventListener('openExportDialog', handleExportDialogOpen);
    };
  }, []);

  // Get available symptoms for filtering
  const availableSymptoms = [...new Set(historicalData.flatMap(entry => entry.symptoms))];

  // Pastel earthy color palette for selected symptoms
  const pastelEarthyColors = [
    '#D4B5A0', // Soft beige
    '#C8B8A8', // Warm taupe
    '#B8C5A0', // Sage green
    '#A8B5C8', // Dusty blue
    '#C8A8B5', // Muted rose
    '#B5C8A8', // Soft mint
    '#A8C8B5', // Light teal
    '#C8B5A8', // Pale brown
    '#B5A8C8', // Lavender gray
    '#A8C5B8', // Seafoam
    '#C5A8B8', // Dusty pink
    '#A8B8C5', // Powder blue
    '#B8A8C5', // Soft purple
    '#C5B8A8', // Warm gray
    '#A8C5A8', // Soft green
  ];

  // Assign colors to selected symptoms
  const getSymptomColor = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) return undefined;
    return symptomColorMap[symptom];
  };

  // Handle symptom selection with color assignment
  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => {
      const isCurrentlySelected = prev.includes(symptom);
      
      if (isCurrentlySelected) {
        // Remove symptom and its color
        setSymptomColorMap(colorMap => {
          const newMap = { ...colorMap };
          delete newMap[symptom];
          return newMap;
        });
        return prev.filter(s => s !== symptom);
      } else {
        // Add symptom and assign it a new color
        setSymptomColorMap(colorMap => {
          const usedColors = Object.values(colorMap);
          const availableColor = pastelEarthyColors.find(color => !usedColors.includes(color)) || 
                                 pastelEarthyColors[Object.keys(colorMap).length % pastelEarthyColors.length];
          
          return {
            ...colorMap,
            [symptom]: availableColor
          };
        });
        return [...prev, symptom];
      }
    });
  };

  // Export PDF functionality
  const generatePDF = async () => {
    if (!exportStartMonth || !exportEndMonth) return;

    const startDate = new Date(exportStartMonth);
    const endDate = new Date(exportEndMonth);
    
    if (startDate > endDate) {
      alert('Začiatočný mesiac musí byť pred koncovým mesiacom');
      return;
    }

    const doc = new jsPDF();
    let currentY = 20;
    let pageNumber = 1;

    // Exact colors from calendar widget - converted from HSL to RGB for PDF
    const periodBg: [number, number, number] = [247, 225, 229]; // hsl(355 60% 90%) - period day background
    const periodText: [number, number, number] = [157, 68, 89]; // hsl(355 60% 35%) - period day text
    const fertilityBg: [number, number, number] = [240, 220, 207]; // hsl(25 50% 88%) - fertility day background  
    const fertilityText: [number, number, number] = [130, 82, 39]; // hsl(25 70% 30%) - fertility day text
    const brandText: [number, number, number] = [149, 95, 106]; // hsl(348 22% 48%) - cycle-body-text
    const grayText: [number, number, number] = [128, 128, 128];

    // Add branded header with updated colors
    doc.setFillColor(...periodBg);
    doc.rect(0, 0, 210, 30, 'F');
    
    // Add title with brand styling
    doc.setTextColor(...periodText);
    doc.setFontSize(18);
    doc.text('Periodka', 20, 18);
    
    doc.setFontSize(14);
    doc.text('Kalendárny prehľad', 20, 25);
    
    // Reset colors and position
    doc.setTextColor(0, 0, 0);
    currentY = 45;

    // Generate months between start and end date
    let currentMonth = new Date(startDate);
    
    while (currentMonth <= endDate) {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
        pageNumber++;
      }

      // Month header with brand color
      doc.setTextColor(...periodText);
      doc.setFontSize(14);
      doc.text(format(currentMonth, 'LLLL yyyy', { locale: sk }), 20, currentY);
      doc.setTextColor(0, 0, 0);
      currentY += 15;

      // Calendar grid for this month
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      // Day headers with brand styling
      doc.setFontSize(10);
      doc.setTextColor(...brandText);
      const dayHeaders = ['Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob', 'Ned'];
      dayHeaders.forEach((day, index) => {
        doc.text(day, 20 + (index * 25), currentY);
      });
      doc.setTextColor(0, 0, 0);
      currentY += 12;

      // Calendar days
      const startDayOfWeek = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
      let currentWeekY = currentY;
      let dayX = 20 + (startDayOfWeek * 25);

      daysInMonth.forEach((day, index) => {
        const dayInfo = getDayInfo(day);
        const dayData = getDayData(day);
        const dateText = format(day, 'd');
        
        // Draw rounded rectangle backgrounds for period and fertility days (like calendar widget)
        if (dayInfo.isPeriod) {
          doc.setFillColor(...periodBg);
          // Draw rounded rectangle (approximation with small radius)
          doc.roundedRect(dayX - 2, currentWeekY - 8, 20, 12, 2, 2, 'F');
          doc.setTextColor(...periodText);
        } else if (dayInfo.isFertile) {
          doc.setFillColor(...fertilityBg);
          // Draw rounded rectangle (approximation with small radius)
          doc.roundedRect(dayX - 2, currentWeekY - 8, 20, 12, 2, 2, 'F');
          doc.setTextColor(...fertilityText);
        } else {
          doc.setTextColor(0, 0, 0); // Black text on white background
        }
        
        // Draw day number with bold font for period days (like calendar widget)
        doc.setFontSize(8);
        if (dayInfo.isPeriod) {
          doc.setFont(undefined, 'bold');
        } else {
          doc.setFont(undefined, 'normal');
        }
        doc.text(dateText, dayX, currentWeekY);
        
        
        // Reset text color and add indicators below day number
        doc.setTextColor(0, 0, 0);
        let indicatorY = currentWeekY + 4;
        
        // Add symptom indicators with thick vertical lines
        const filteredSymptoms = selectedSymptoms.length > 0 
          ? dayData.symptoms.filter(s => selectedSymptoms.includes(s))
          : dayData.symptoms;
          
        if (filteredSymptoms.length > 0) {
          // Use first symptom's color if available, otherwise brand color
          const firstSymptom = filteredSymptoms[0];
          const symptomColor = getSymptomColor(firstSymptom);
          if (symptomColor) {
            // Convert hex to RGB
            const r = parseInt(symptomColor.slice(1, 3), 16);
            const g = parseInt(symptomColor.slice(3, 5), 16);
            const b = parseInt(symptomColor.slice(5, 7), 16);
            doc.setTextColor(r, g, b);
          } else {
            doc.setTextColor(...brandText);
          }
          doc.text('|', dayX + 10, indicatorY);
          doc.setTextColor(0, 0, 0);
          indicatorY += 4;
        }
        
        if (dayData.notes) {
          doc.setTextColor(...grayText);
          doc.text('P', dayX + 10, indicatorY); // P for Pen
          doc.setTextColor(0, 0, 0);
        }

        // Move to next day position
        dayX += 25;
        
        // New week
        if ((index + startDayOfWeek + 1) % 7 === 0) {
          dayX = 20;
          currentWeekY += 15;
        }
      });
      
      currentY = currentWeekY + 20;
      
      // Move to next month
      currentMonth = addMonths(currentMonth, 1);
    }

    // Add comprehensive legend at the end
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }
    
    // Legend header with brand styling
    doc.setTextColor(...periodText);
    doc.setFontSize(14);
    doc.text('Legenda symbolov', 20, currentY);
    doc.setTextColor(0, 0, 0);
    currentY += 15;
    
    // Period legend with colored background (matching calendar widget)
    doc.setFontSize(10);
    doc.setFillColor(...periodBg);
    doc.roundedRect(20, currentY - 5, 12, 8, 1, 1, 'F');
    doc.setTextColor(...periodText);
    doc.setFont(undefined, 'bold');
    doc.text('31', 21, currentY);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.text('Menstruacia', 40, currentY);
    currentY += 10;
    
    // Fertility legend with colored background (matching calendar widget)
    doc.setFillColor(...fertilityBg);
    doc.roundedRect(20, currentY - 5, 12, 8, 1, 1, 'F');
    doc.setTextColor(...fertilityText);
    doc.text('14', 21, currentY);
    doc.setTextColor(0, 0, 0);
    doc.text('Plodne dni', 40, currentY);
    currentY += 10;
    
    // Symptoms legend with vertical line
    doc.setTextColor(...brandText);
    doc.text('|', 24, currentY);
    doc.setTextColor(0, 0, 0);
    doc.text('Priznaky', 40, currentY);
    currentY += 10;
    
    // Notes legend with pen symbol
    doc.setTextColor(...grayText);
    doc.text('P', 24, currentY);
    doc.setTextColor(0, 0, 0);
    doc.text('Poznamky', 40, currentY);
    currentY += 12;
    
    // Selected symptoms legend
    if (selectedSymptoms.length > 0) {
      doc.setTextColor(...periodText);
      doc.setFontSize(12);
      doc.text('Vybrane priznaky:', 20, currentY);
      doc.setTextColor(0, 0, 0);
      currentY += 10;
      
      selectedSymptoms.forEach((symptom) => {
        const color = getSymptomColor(symptom);
        if (color) {
          // Convert hex to RGB
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          doc.setTextColor(r, g, b);
          doc.setFontSize(10);
          doc.text('|', 24, currentY);
          doc.setTextColor(0, 0, 0);
          doc.text(symptom, 40, currentY);
          currentY += 8;
        }
      });
    }
    
    // Add notes section if there are any notes in the selected period
    const notesInPeriod = [];
    let notesMonth = new Date(startDate);
    while (notesMonth <= endDate) {
      const monthStart = startOfMonth(notesMonth);
      const monthEnd = endOfMonth(notesMonth);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      daysInMonth.forEach(day => {
        const dayData = getDayData(day);
        if (dayData.notes) {
          notesInPeriod.push({
            date: format(day, 'dd.MM.yyyy', { locale: sk }),
            notes: dayData.notes
          });
        }
      });
      
      notesMonth = addMonths(notesMonth, 1);
    }
    
    if (notesInPeriod.length > 0) {
      // Check if we need a new page for notes
      if (currentY > 200) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setTextColor(...periodText);
      doc.setFontSize(12);
      doc.text('Poznamky:', 20, currentY);
      doc.setTextColor(0, 0, 0);
      currentY += 15;
      
      notesInPeriod.forEach(({ date, notes }) => {
        // Check if we need a new page
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(10);
        doc.setTextColor(...brandText);
        doc.text(`${date}:`, 20, currentY);
        doc.setTextColor(0, 0, 0);
        currentY += 5;
        
        // Split long notes into multiple lines
        const lines = doc.splitTextToSize(notes, 170);
        lines.forEach((line: string) => {
          if (currentY > 250) {
            doc.addPage();
            currentY = 20;
          }
          doc.text(line, 25, currentY);
          currentY += 5;
        });
        currentY += 5; // Extra spacing between notes
      });
    }
    
    // Footer with brand info
    const pageHeight = doc.internal.pageSize.height;
    doc.setTextColor(...grayText);
    doc.setFontSize(8);
    doc.text('Vygenerovane pomocou Periodka', 20, pageHeight - 20);
    doc.text(`Datum exportu: ${format(new Date(), 'dd.MM.yyyy', { locale: sk })}`, 20, pageHeight - 15);
    doc.setTextColor(0, 0, 0);

    // Save the PDF with Slovak filename
    const fileName = `Periodka_kalendar_${format(startDate, 'yyyy-MM')}_${format(endDate, 'yyyy-MM')}.pdf`;
    doc.save(fileName);
    setExportDialogOpen(false);
  };

  // Generate month options for select
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Generate 12 months back and 12 months forward
    for (let i = -12; i <= 12; i++) {
      const month = addMonths(currentDate, i);
      const value = format(month, 'yyyy-MM');
      const label = format(month, 'LLLL yyyy', { locale: sk });
      options.push({ value, label });
    }
    
    return options;
  };

  // Get calendar period based on view type
  const getCalendarPeriod = () => {
    if (viewType === 'weekly') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return {
        start: weekStart,
        end: weekEnd,
        days: eachDayOfInterval({ start: weekStart, end: weekEnd })
      };
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      // Add padding for monthly view
      const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
      const paddedDays = [];
      
      for (let i = 0; i < startDay; i++) {
        paddedDays.push(null);
      }
      
      days.forEach(day => paddedDays.push(day));
      
      return {
        start: monthStart,
        end: monthEnd,
        days: paddedDays
      };
    }
  };

  const calendarPeriod = getCalendarPeriod();
  const getDayInfo = (date: Date) => {
    if (!cycleData.lastPeriodStart) return {
      isPeriod: false,
      isFertile: false
    };
    const lastPeriodDate = typeof cycleData.lastPeriodStart === 'string' ? new Date(cycleData.lastPeriodStart) : cycleData.lastPeriodStart;
    const isPeriod = isPeriodDate(date, lastPeriodDate.toISOString().split('T')[0], cycleData.cycleLength, cycleData.periodLength);
    const isFertile = isFertilityDate(date, lastPeriodDate.toISOString().split('T')[0], cycleData.cycleLength);
    return {
      isPeriod,
      isFertile
    };
  };
  const getCurrentDayPhase = (date: Date) => {
    if (!cycleData.lastPeriodStart) return null;
    const lastPeriodDate = typeof cycleData.lastPeriodStart === 'string' ? new Date(cycleData.lastPeriodStart) : cycleData.lastPeriodStart;
    const daysSinceStart = Math.floor((date.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceStart % cycleData.cycleLength + cycleData.cycleLength) % cycleData.cycleLength + 1;

    // Find which phase this day belongs to
    return derivedState.phaseRanges.find(phase => cycleDay >= phase.start && cycleDay <= phase.end);
  };

  // Get day data (symptoms and notes)
  const getDayData = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const entry = historicalData.find(entry => entry.date === dateString);
    return entry || { symptoms: [], notes: '' };
  };

  // Check if day has filtered symptoms
  const dayHasFilteredSymptoms = (date: Date) => {
    if (selectedSymptoms.length === 0) return false;
    const dayData = getDayData(date);
    return selectedSymptoms.some(symptom => dayData.symptoms.includes(symptom));
  };

  // Check if day has notes
  const dayHasNotes = (date: Date) => {
    const dayData = getDayData(date);
    return dayData.notes.length > 0;
  };
  const navigatePeriod = (direction: 'prev' | 'next') => {
    if (viewType === 'weekly') {
      setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    }
  };

  const handleDayClick = (date: Date) => {
    const dayData = getDayData(date);
    setSelectedDayData(dayData);
    
    // Still show period intensity selector if it's a period day
    const dayInfo = getDayInfo(date);
    if (dayInfo.isPeriod) {
      const dateString = format(date, 'yyyy-MM-dd');
      setSelectedDate(dateString);
    }
  };

  const handlePeriodIntensitySelect = (intensity: PeriodIntensity | null) => {
    if (selectedDate) {
      onPeriodIntensityChange(selectedDate, intensity);
      setSelectedDate(null);
    }
  };

  const renderPeriodIntensity = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const intensity = getPeriodIntensity(dateString);
    
    if (!intensity) return null;

    return (
      <div className="absolute top-0.5 right-0.5 flex">
        {[...Array(intensity)].map((_, i) => (
          <Droplets 
            key={i} 
            className="w-2 h-2" 
            style={{ color: '#FF7782' }}
            fill="currentColor"
          />
        ))}
      </div>
    );
  };
  return <div className="space-y-4">
      {/* Export PDF Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export kalendára do PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Od mesiaca:</label>
              <Select value={exportStartMonth} onValueChange={setExportStartMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte začiatočný mesiac" />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Do mesiaca:</label>
              <Select value={exportEndMonth} onValueChange={setExportEndMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte koncový mesiac" />
                </SelectTrigger>
                <SelectContent>
                  {generateMonthOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Zrušiť
              </Button>
              <Button 
                onClick={generatePDF}
                disabled={!exportStartMonth || !exportEndMonth}
                className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportovať
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header with View Toggle and Filters */}
      <div className={isMobile ? "space-y-3" : ""}>
        <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
          {/* View Toggle and Period Filters */}
          <div className="flex gap-2 flex-wrap">
            {/* View Toggle */}
            <div className="flex bg-white/50 rounded-lg p-1 border border-rose-200/50">
              <Button
                size="sm"
                variant={viewType === 'monthly' ? 'default' : 'ghost'}
                onClick={() => setViewType('monthly')}
                className={`flex items-center gap-1.5 text-xs h-7 ${
                  viewType === 'monthly' 
                    ? 'bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white' 
                    : 'text-[#955F6A]'
                }`}
              >
                <CalendarGrid className="w-3 h-3" />
                Mesačne
              </Button>
              <Button
                size="sm"
                variant={viewType === 'weekly' ? 'default' : 'ghost'}
                onClick={() => setViewType('weekly')}
                className={`flex items-center gap-1.5 text-xs h-7 ${
                  viewType === 'weekly' 
                    ? 'bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white' 
                    : 'text-[#955F6A]'
                }`}
              >
                <Grid3X3 className="w-3 h-3" />
                Týždenne
              </Button>
            </div>
            
            {/* Period and Fertility Filters */}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onOutcomeSelect(selectedOutcome === 'next-period' ? null : 'next-period')} 
              className={`flex items-center gap-1.5 text-xs border transition-all duration-200 ${
                selectedOutcome === 'next-period' 
                  ? 'bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white border-[#FF7782]' 
                  : 'border-[#FF7782] bg-transparent hover:bg-[#FF7782]/10 text-[#FF7782]'
              }`}
            >
              <Droplets className="w-3 h-3" />
              Ďalšia perioda
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onOutcomeSelect(selectedOutcome === 'fertile-days' ? null : 'fertile-days')} 
              className={`flex items-center gap-1.5 text-xs border transition-all duration-200 ${
                selectedOutcome === 'fertile-days' 
                  ? 'bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white border-[#FF7782]' 
                  : 'border-[#FF7782] bg-transparent hover:bg-[#FF7782]/10 text-[#FF7782]'
              }`}
            >
              <Heart className="w-3 h-3" />
              Plodné dni
            </Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(355 60% 90%)' }}></div>
              <span className="text-cycle-body-text">Menštruácia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(25 50% 88%)' }}></div>
              <span className="text-cycle-body-text">Plodné dni</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: 'hsl(45 85% 70%)' }}></div>
              <span className="text-cycle-body-text">Dnes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-cycle-body-text" />
              <span className="text-cycle-body-text">Poznámky</span>
            </div>
            {selectedSymptoms.length > 0 && selectedSymptoms.map(symptom => {
              const color = getSymptomColor(symptom);
              return (
                <div key={symptom} className="flex items-center gap-1.5">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color || '#9CA3AF' }}
                  ></div>
                  <span className="text-cycle-body-text">{symptom}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Symptom Filters */}
        {availableSymptoms.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#955F6A]" />
              <span className="text-sm font-medium text-[#955F6A]">Filtrovať príznaky:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSymptoms.map(symptom => {
                const symptomColor = getSymptomColor(symptom);
                return (
                  <Badge
                    key={symptom}
                    variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                    className={`cursor-pointer text-xs transition-all ${
                      selectedSymptoms.includes(symptom)
                        ? 'text-white border-transparent'
                        : 'border-[#FF7782] text-[#FF7782] hover:bg-[#FF7782]/10'
                    }`}
                    style={symptomColor ? {
                      backgroundColor: symptomColor,
                      borderColor: symptomColor
                    } : {}}
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    {symptom}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigatePeriod('prev')} className="flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h4 className="text-lg font-medium" style={{ color: '#955F6A' }}>
          {viewType === 'weekly' 
            ? `${format(calendarPeriod.start, 'd. MMM', { locale: sk })} - ${format(calendarPeriod.end, 'd. MMM yyyy', { locale: sk })}`
            : format(currentDate, 'LLLL yyyy', { locale: sk })
          }
        </h4>
        
        <Button variant="ghost" size="sm" onClick={() => navigatePeriod('next')} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers - only show for monthly view */}
        {viewType === 'monthly' && (
          <div className="grid grid-cols-7 gap-1">
            {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map(day => (
              <div key={day} className="text-center text-xs font-medium py-2" style={{ color: '#955F6A' }}>
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Calendar Days */}
        <div className={`grid gap-1 ${viewType === 'weekly' ? 'grid-cols-7' : 'grid-cols-7'}`}>
          {calendarPeriod.days.map((date, index) => {
            if (!date) {
              return <div key={index} className="aspect-square"></div>;
            }
            
            const dayInfo = getDayInfo(date);
            const isCurrentDay = isToday(date);
            const hasFilteredSymptoms = dayHasFilteredSymptoms(date);
            const hasNotes = dayHasNotes(date);
            const dayData = getDayData(date);
            
            let dayClasses = `${viewType === 'weekly' ? 'min-h-[80px]' : 'aspect-square'} flex flex-col items-center justify-center text-sm rounded-lg transition-all cursor-pointer relative border border-transparent`;
            let dayStyle: React.CSSProperties = { color: '#955F6A' };

            // Highlight based on selected outcome
            if (selectedOutcome === 'next-period' && dayInfo.isPeriod) {
              dayClasses += " bg-rose-400 text-white hover:bg-rose-500 border-rose-500";
              dayStyle = { color: 'white' };
            } else if (selectedOutcome === 'fertile-days' && dayInfo.isFertile) {
              dayClasses += " bg-pink-300 text-white hover:bg-pink-400 border-pink-400";
              dayStyle = { color: 'white' };
            } else if (!selectedOutcome) {
              // Show normal phase colors when no filter is active
              if (dayInfo.isPeriod) {
                dayClasses += " bg-rose-100 border-rose-300";
              } else if (dayInfo.isFertile) {
                dayClasses += " bg-pink-50 border-pink-200";
              } else {
                dayClasses += " hover:bg-white/80 border-gray-100";
              }
            } else {
              dayClasses += " hover:bg-white/80 border-gray-100";
            }

            // Today's border
            if (isCurrentDay) {
              dayClasses += " ring-2 ring-rose-400 ring-offset-1";
            }

            return (
              <div 
                key={date.getTime()} 
                className={dayClasses} 
                style={dayStyle}
                onClick={() => handleDayClick(date)}
              >
                {/* Day number */}
                <span className="relative z-10 font-medium">
                  {format(date, 'd')}
                </span>
                
                {/* Day label for weekly view */}
                {viewType === 'weekly' && (
                  <span className="text-xs opacity-70 mb-1">
                    {format(date, 'EEE', { locale: sk })}
                  </span>
                )}
                
                {/* Indicators container */}
                <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-1 flex-wrap">
                  {/* Period intensity indicator */}
                  {renderPeriodIntensity(date)}
                  
                  {/* Symptom indicators - only show selected symptoms with their colors */}
                  {dayData.symptoms
                    .filter(symptom => selectedSymptoms.includes(symptom))
                    .slice(0, 4)
                    .map((symptom, i) => {
                      const color = getSymptomColor(symptom);
                      return (
                        <div 
                          key={i} 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: color || '#9CA3AF' }}
                        />
                      );
                    })}
                  
                  {/* Additional symptoms indicator */}
                  {dayData.symptoms.filter(symptom => selectedSymptoms.includes(symptom)).length > 4 && (
                    <div className="text-[10px] text-gray-600 font-bold">+</div>
                  )}
                  
                  {/* Notes indicator */}
                  {hasNotes && (
                    <FileText className="w-3 h-3 text-gray-500" />
                  )}
                </div>
                
                {/* Today indicator overlay */}
                {isCurrentDay && !selectedOutcome && (
                  <div className="absolute inset-0 rounded-lg bg-rose-400/10"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDayData && (
        <Card className="mt-4 p-4 bg-white/90 border border-rose-200/50">
          <div className="space-y-3">
            <h4 className="font-medium text-sm" style={{ color: '#955F6A' }}>
              Detaily dňa
            </h4>
            
            {selectedDayData.symptoms.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-2" style={{ color: '#955F6A' }}>Príznaky:</h5>
                <div className="flex flex-wrap gap-1">
                  {selectedDayData.symptoms.map(symptom => {
                    const color = getSymptomColor(symptom);
                    return (
                      <Badge 
                        key={symptom} 
                        variant="outline" 
                        className={`text-xs ${
                          color 
                            ? 'text-white border-transparent' 
                            : 'border-gray-300 text-gray-700'
                        }`}
                        style={color ? {
                          backgroundColor: color,
                          borderColor: color
                        } : {}}
                      >
                        {symptom}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            
            {selectedDayData.notes && (
              <div>
                <h5 className="text-xs font-medium mb-2" style={{ color: '#955F6A' }}>Poznámky:</h5>
                <p className="text-xs bg-gray-50 p-2 rounded" style={{ color: '#955F6A' }}>
                  {selectedDayData.notes}
                </p>
              </div>
            )}
            
            {selectedDayData.symptoms.length === 0 && !selectedDayData.notes && (
              <p className="text-xs text-gray-500">Žiadne záznamy pre tento deň.</p>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSelectedDayData(null)}
              className="w-full text-xs"
            >
              Zavrieť
            </Button>
          </div>
        </Card>
      )}

      {/* Current Selection Info */}
      {selectedOutcome && (
        <div className="mt-4 p-3 bg-white/80 rounded-lg border border-rose-200/50">
          <div className="flex items-center gap-2 mb-2">
            {selectedOutcome === 'next-period' ? <Droplets className="w-4 h-4 text-rose-400" /> : <Heart className="w-4 h-4 text-pink-400" />}
            <span className="font-medium text-sm" style={{ color: '#955F6A' }}>
              {selectedOutcome === 'next-period' ? 'Perioda' : 'Plodné dni'}
            </span>
          </div>
          <p className="text-xs" style={{ color: '#955F6A' }}>
            {selectedOutcome === 'next-period' ? 'Červené dni označujú očakávanú menštruáciu na základe vášho cyklu.' : 'Ružové dni označujú plodné dni, kedy je najväčšia pravdepodobnosť otehotnenia.'}
          </p>
        </div>
      )}

      {/* Period Intensity Selector Modal */}
      {selectedDate && (
        <PeriodIntensitySelector
          date={selectedDate}
          currentIntensity={getPeriodIntensity(selectedDate)}
          onSelect={handlePeriodIntensitySelect}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>;
}