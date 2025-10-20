import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Droplets, ChevronLeft, ChevronRight, FileText, Filter, Grid3X3, Calendar as CalendarGrid, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addWeeks, subWeeks, startOfWeek, endOfWeek, addDays, differenceInDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import jsPDF from 'jspdf';
import { DerivedState, CycleData, PeriodIntensity } from './types';
import { isPeriodDate, isFertilityDate } from './utils';
import { PeriodIntensitySelector } from './components/PeriodIntensitySelector';
import { useIsMobile } from '@/hooks/use-mobile';
import { SymptomTracker } from './SymptomTracker';
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
  onOutcomeSelect?: (outcome: OutcomeType | null) => void;
  selectedOutcome?: OutcomeType | null;
  onPeriodIntensityChange?: (date: string, intensity: PeriodIntensity | null) => void;
  getPeriodIntensity?: (date: string) => PeriodIntensity | undefined;
  accessCode?: string;
  readOnly?: boolean;
}
export function CalendarView({
  cycleData,
  derivedState,
  onOutcomeSelect,
  selectedOutcome,
  onPeriodIntensityChange,
  getPeriodIntensity,
  accessCode,
  readOnly = false
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showSymptomFilters, setShowSymptomFilters] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalEntry[]>([]);
  const [selectedDayData, setSelectedDayData] = useState<{
    symptoms: string[];
    notes: string;
    date: Date;
  } | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
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
              const symptomMap: {
                [key: string]: string;
              } = {
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

  // Get available symptoms for filtering - limit to 7 for test view
  const availableSymptoms = [...new Set(historicalData.flatMap(entry => entry.symptoms))].slice(0, 7);

  // Pastel earthy color palette for selected symptoms
  // Define 5 distinctive pastel colors for symptom selection order
  const symptomOrderColors = ['#E8B4C8',
  // Soft pink - 1st selected symptom
  '#B4D4E8',
  // Light blue - 2nd selected symptom  
  '#D4E8B4',
  // Soft green - 3rd selected symptom
  '#E8D4B4',
  // Warm peach - 4th selected symptom
  '#C4B4E8' // Lavender - 5th selected symptom
  ];

  // Generate color variations for symptoms beyond the 5th
  const getColorVariation = (baseColor: string, variation: number): string => {
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Create variations by adjusting brightness
    const factor = 1 - variation * 0.15; // Each variation gets 15% darker
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Get color based on symptom selection order
  const getSymptomColor = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) return undefined;
    const orderIndex = selectedSymptoms.indexOf(symptom);
    if (orderIndex < symptomOrderColors.length) {
      // Use base colors for first 5 symptoms
      return symptomOrderColors[orderIndex];
    } else {
      // Use color variations for symptoms beyond the 5th
      const baseColorIndex = orderIndex % symptomOrderColors.length;
      const variationLevel = Math.floor(orderIndex / symptomOrderColors.length);
      return getColorVariation(symptomOrderColors[baseColorIndex], variationLevel);
    }
  };

  // Handle symptom selection - simplified without color mapping state
  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => {
      const isCurrentlySelected = prev.includes(symptom);
      if (isCurrentlySelected) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // Export PDF functionality - Medical Report Format
  const generatePDF = async () => {
    if (!exportStartMonth || !exportEndMonth) return;
    const startDate = new Date(exportStartMonth);
    const endDate = new Date(exportEndMonth);
    if (startDate > endDate) {
      alert('Začiatočný mesiac musí byť pred koncovým mesiacom');
      return;
    }
    const doc = new jsPDF('p', 'mm', 'a4');

    // Colors from calendar widget - converted from HSL to RGB for PDF
    const periodBg: [number, number, number] = [247, 225, 229];
    const periodText: [number, number, number] = [157, 68, 89];
    const fertilityBg: [number, number, number] = [240, 220, 207];
    const fertilityText: [number, number, number] = [130, 82, 39];
    const brandText: [number, number, number] = [149, 95, 106];
    const grayText: [number, number, number] = [128, 128, 128];
    const lightGray: [number, number, number] = [240, 240, 240];

    // Helper function to calculate cycle statistics
    const calculateCycleStats = () => {
      const cycleLengths: number[] = [];
      const periodLengths: number[] = [];
      const symptomCounts: {
        [key: string]: number;
      } = {};

      // Analyze historical data for patterns
      historicalData.forEach(entry => {
        entry.symptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      });
      return {
        avgCycleLength: cycleData.cycleLength,
        avgPeriodLength: cycleData.periodLength,
        mostCommonSymptoms: Object.entries(symptomCounts).sort(([, a], [, b]) => b - a).slice(0, 5).map(([symptom, count]) => ({
          symptom,
          count
        })),
        totalDataDays: historicalData.length
      };
    };
    const stats = calculateCycleStats();

    // PAGE 1: CLINICAL SUMMARY
    doc.setFillColor(...periodBg);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(...periodText);
    doc.setFontSize(20);
    doc.text('MENSTRUAČNÝ CYKLUS - KLINICKÁ SPRÁVA', 20, 20);
    doc.setFontSize(12);
    doc.text(`Obdobie: ${format(startDate, 'MMMM yyyy', {
      locale: sk
    })} - ${format(endDate, 'MMMM yyyy', {
      locale: sk
    })}`, 20, 30);
    doc.text(`Dátum vytvorenia: ${format(new Date(), 'dd.MM.yyyy', {
      locale: sk
    })}`, 20, 36);
    let currentY = 60;

    // Clinical Overview Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('KLINICKÝ PREHĽAD', 20, currentY);
    currentY += 15;

    // Stats boxes
    doc.setFillColor(...lightGray);
    doc.rect(20, currentY, 80, 40, 'F');
    doc.rect(110, currentY, 80, 40, 'F');
    doc.setTextColor(...brandText);
    doc.setFontSize(12);
    doc.text('PARAMETRE CYKLU', 25, currentY + 10);
    doc.text('SLEDOVANIE SYMPTÓMOV', 115, currentY + 10);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Priemerná dĺžka cyklu: ${stats.avgCycleLength} dní`, 25, currentY + 18);
    doc.text(`Priemerná dĺžka menštruácie: ${stats.avgPeriodLength} dní`, 25, currentY + 25);
    doc.text(`Posledná menštruácia: ${cycleData.lastPeriodStart ? format(new Date(cycleData.lastPeriodStart), 'dd.MM.yyyy', {
      locale: sk
    }) : 'Neurčené'}`, 25, currentY + 32);
    doc.text(`Celkový počet dní so záznamami: ${stats.totalDataDays}`, 115, currentY + 18);
    doc.text(`Najčastejšie symptómy:`, 115, currentY + 25);
    let symptomY = currentY + 32;
    stats.mostCommonSymptoms.slice(0, 3).forEach(({
      symptom,
      count
    }) => {
      if (symptomY < currentY + 38) {
        doc.text(`• ${symptom} (${count}x)`, 115, symptomY);
        symptomY += 6;
      }
    });
    currentY += 55;

    // KEY FINDINGS Section
    doc.setFontSize(16);
    doc.setTextColor(...periodText);
    doc.text('KĽÚČOVÉ ZISTENIA', 20, currentY);
    currentY += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    // Pattern analysis
    const cyclePatterns = [`Sledované obdobie zahŕňa ${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} mesiacov`, `Zaznamenané symptómy v ${historicalData.filter(d => d.symptoms.length > 0).length} dňoch`, `Poznámky zaznamenané v ${historicalData.filter(d => d.notes).length} dňoch`];
    cyclePatterns.forEach(pattern => {
      doc.text(`• ${pattern}`, 25, currentY);
      currentY += 8;
    });
    currentY += 10;

    // RECOMMENDATIONS Section
    doc.setFontSize(16);
    doc.setTextColor(...periodText);
    doc.text('ODPORÚČANIA PRE LEKÁRSKU KONZULTÁCIU', 20, currentY);
    currentY += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const recommendations = ['Diskutujte o vzorcoch symptómov s vaším gynekológom', 'Zvážte sledovanie bazálnej telesnej teploty pre presnejšie určenie ovulácie', 'Poznamenajte si intenzitu menštruácie a bolesti pre lepšiu diagnostiku'];
    recommendations.forEach(rec => {
      doc.text(`• ${rec}`, 25, currentY);
      currentY += 8;
    });

    // PAGE 2: ENHANCED CALENDAR VIEW
    doc.addPage();
    currentY = 20;
    doc.setFillColor(...periodBg);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(...periodText);
    doc.setFontSize(16);
    doc.text('KALENDÁRNY PREHĽAD - MEDICÍNSKY FORMÁT', 20, 15);
    doc.setTextColor(0, 0, 0);
    currentY = 40;

    // Generate enhanced monthly calendars
    let currentMonth = new Date(startDate);
    while (currentMonth <= endDate) {
      if (currentY > 200) {
        doc.addPage();
        currentY = 20;
      }

      // Month header
      doc.setTextColor(...periodText);
      doc.setFontSize(14);
      doc.text(format(currentMonth, 'LLLL yyyy', {
        locale: sk
      }).toUpperCase(), 20, currentY);
      doc.setTextColor(0, 0, 0);
      currentY += 15;

      // Calendar grid
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd
      });

      // Day headers
      doc.setFontSize(9);
      doc.setTextColor(...brandText);
      const dayHeaders = ['Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob', 'Ned'];
      dayHeaders.forEach((day, index) => {
        doc.text(day, 25 + index * 24, currentY);
      });
      doc.setTextColor(0, 0, 0);
      currentY += 10;

      // Calendar days with enhanced medical formatting
      const startDayOfWeek = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
      let currentWeekY = currentY;
      let dayX = 25 + startDayOfWeek * 24;
      daysInMonth.forEach((day, index) => {
        const dayInfo = getDayInfo(day);
        const dayData = getDayData(day);
        const dateText = format(day, 'd');

        // Enhanced day cell background
        doc.setFillColor(255, 255, 255);
        doc.rect(dayX - 3, currentWeekY - 12, 22, 18, 'F');
        doc.setDrawColor(...grayText);
        doc.rect(dayX - 3, currentWeekY - 12, 22, 18);

        // Period and fertility backgrounds
        if (dayInfo.isPeriod) {
          const intensity = getPeriodIntensity(format(day, 'yyyy-MM-dd'));
          const intensityColors: {
            [key: number]: [number, number, number];
          } = {
            1: [252, 240, 242],
            // Light pink
            2: [249, 232, 237],
            // Medium pink  
            3: [247, 225, 229] // Dark pink
          };
          const color = intensityColors[intensity || 1];
          doc.setFillColor(color[0], color[1], color[2]);
          doc.rect(dayX - 3, currentWeekY - 12, 22, 18, 'F');
          doc.setTextColor(...periodText);
        } else if (dayInfo.isFertile) {
          doc.setFillColor(...fertilityBg);
          doc.rect(dayX - 3, currentWeekY - 12, 22, 18, 'F');
          doc.setTextColor(...fertilityText);
        } else {
          doc.setTextColor(0, 0, 0);
        }

        // Day number
        doc.setFontSize(10);
        doc.setFont(undefined, dayInfo.isPeriod ? 'bold' : 'normal');
        doc.text(dateText, dayX, currentWeekY - 4);

        // Medical symbols for symptoms (numbered severity)
        doc.setTextColor(0, 0, 0);
        const filteredSymptoms = selectedSymptoms.length > 0 ? dayData.symptoms.filter(s => selectedSymptoms.includes(s)) : dayData.symptoms;
        if (filteredSymptoms.length > 0) {
          const firstSymptom = filteredSymptoms[0];
          const symptomColor = getSymptomColor(firstSymptom);
          if (symptomColor) {
            const r = parseInt(symptomColor.slice(1, 3), 16);
            const g = parseInt(symptomColor.slice(3, 5), 16);
            const b = parseInt(symptomColor.slice(5, 7), 16);
            doc.setFillColor(r, g, b);
          } else {
            doc.setFillColor(...brandText);
          }

          // Draw severity indicator (1-3 based on number of symptoms)
          const severity = Math.min(filteredSymptoms.length, 3);
          doc.circle(dayX + 8, currentWeekY + 2, 2 + severity, 'F');

          // Add severity number
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(6);
          doc.text(severity.toString(), dayX + 7, currentWeekY + 3);
        }

        // Notes indicator
        if (dayData.notes) {
          doc.setFillColor(...grayText);
          doc.rect(dayX - 2, currentWeekY + 3, 3, 2, 'F');
        }
        dayX += 24;
        if ((index + startDayOfWeek + 1) % 7 === 0) {
          dayX = 25;
          currentWeekY += 20;
        }
      });
      currentY = currentWeekY + 25;
      currentMonth = addMonths(currentMonth, 1);
    }

    // PAGE 3: SYMPTOM TIMELINE AND PATTERN ANALYSIS
    doc.addPage();
    currentY = 20;
    doc.setFillColor(...periodBg);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(...periodText);
    doc.setFontSize(16);
    doc.text('ANALÝZA SYMPTÓMOV A VZORCOV', 20, 15);
    doc.setTextColor(0, 0, 0);
    currentY = 45;

    // Symptom frequency chart
    doc.setFontSize(14);
    doc.text('FREKVENCIA SYMPTÓMOV', 20, currentY);
    currentY += 15;
    stats.mostCommonSymptoms.forEach(({
      symptom,
      count
    }, index) => {
      const barWidth = count / Math.max(...stats.mostCommonSymptoms.map(s => s.count)) * 120;
      doc.setFillColor(...lightGray);
      doc.rect(20, currentY - 3, 120, 8, 'F');
      doc.setFillColor(...brandText);
      doc.rect(20, currentY - 3, barWidth, 8, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.text(`${symptom}: ${count} dní`, 145, currentY + 2);
      currentY += 12;
    });
    currentY += 15;

    // Medical legend
    doc.setFontSize(14);
    doc.setTextColor(...periodText);
    doc.text('MEDICÍNSKA LEGENDA', 20, currentY);
    currentY += 15;

    // Period intensity legend
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('INTENZITA MENŠTRUÁCIE:', 20, currentY);
    currentY += 10;
    [1, 2, 3].forEach((intensity, index) => {
      const colors: {
        [key: number]: [number, number, number];
      } = {
        1: [252, 240, 242],
        2: [249, 232, 237],
        3: [247, 225, 229]
      };
      const color = colors[intensity];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(25, currentY - 3, 15, 8, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text(`${intensity} - ${intensity === 1 ? 'Slabá' : intensity === 2 ? 'Stredná' : 'Silná'}`, 45, currentY + 2);
      currentY += 10;
    });
    currentY += 10;

    // Symptom severity legend
    doc.text('ZÁVAŽNOSŤ SYMPTÓMOV:', 20, currentY);
    currentY += 10;
    [1, 2, 3].forEach(severity => {
      doc.setFillColor(...brandText);
      doc.circle(30, currentY - 1, 2 + severity, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.text(severity.toString(), 29, currentY);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`${severity} - ${severity === 1 ? 'Mierne' : severity === 2 ? 'Stredné' : 'Výrazné'}`, 45, currentY + 2);
      currentY += 12;
    });

    // PAGE 4: DETAILED NOTES FOR MEDICAL REVIEW
    doc.addPage();
    currentY = 20;
    doc.setFillColor(...periodBg);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(...periodText);
    doc.setFontSize(16);
    doc.text('DENNÉ POZNÁMKY A POZOROVANIA', 20, 15);
    doc.setTextColor(0, 0, 0);
    currentY = 45;

    // Collect and organize notes
    const notesInPeriod: Array<{
      date: string;
      notes: string;
      symptoms: string[];
    }> = [];
    let notesMonth = new Date(startDate);
    while (notesMonth <= endDate) {
      const monthStart = startOfMonth(notesMonth);
      const monthEnd = endOfMonth(notesMonth);
      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd
      });
      daysInMonth.forEach(day => {
        const dayData = getDayData(day);
        if (dayData.notes || dayData.symptoms.length > 0) {
          notesInPeriod.push({
            date: format(day, 'dd.MM.yyyy', {
              locale: sk
            }),
            notes: dayData.notes,
            symptoms: dayData.symptoms
          });
        }
      });
      notesMonth = addMonths(notesMonth, 1);
    }
    if (notesInPeriod.length === 0) {
      doc.setFontSize(12);
      doc.text('Žiadne denné poznámky neboli zaznamenané v tomto období.', 20, currentY);
    } else {
      doc.setFontSize(12);
      doc.text(`Celkovo ${notesInPeriod.length} dní so záznamami`, 20, currentY);
      currentY += 15;
      notesInPeriod.forEach(({
        date,
        notes,
        symptoms
      }) => {
        if (currentY > 260) {
          doc.addPage();
          currentY = 20;
        }

        // Date header
        doc.setFillColor(...lightGray);
        doc.rect(20, currentY - 5, 170, 10, 'F');
        doc.setTextColor(...brandText);
        doc.setFontSize(11);
        doc.text(date, 25, currentY);
        doc.setTextColor(0, 0, 0);
        currentY += 12;

        // Symptoms
        if (symptoms.length > 0) {
          doc.setFontSize(9);
          doc.setTextColor(...brandText);
          doc.text('Symptómy:', 25, currentY);
          doc.setTextColor(0, 0, 0);
          doc.text(symptoms.join(', '), 55, currentY);
          currentY += 8;
        }

        // Notes
        if (notes) {
          doc.setFontSize(9);
          doc.setTextColor(...brandText);
          doc.text('Poznámky:', 25, currentY);
          doc.setTextColor(0, 0, 0);
          currentY += 5;
          const lines = doc.splitTextToSize(notes, 160);
          lines.forEach((line: string) => {
            if (currentY > 260) {
              doc.addPage();
              currentY = 20;
            }
            doc.text(line, 30, currentY);
            currentY += 5;
          });
        }
        currentY += 8; // Spacing between entries
      });
    }

    // Professional footer on all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      doc.setTextColor(...grayText);
      doc.setFontSize(8);
      doc.text('Vygenerované aplikáciou Periodka pre medicínske účely', 20, pageHeight - 15);
      doc.text(`Strana ${i} z ${totalPages}`, 180, pageHeight - 15);
      doc.text(`Dátum exportu: ${format(new Date(), 'dd.MM.yyyy HH:mm', {
        locale: sk
      })}`, 20, pageHeight - 10);
    }

    // Save with medical filename
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
      const label = format(month, 'LLLL yyyy', {
        locale: sk
      });
      options.push({
        value,
        label
      });
    }
    return options;
  };

  // Get calendar period for monthly view
  const getCalendarPeriod = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({
      start: monthStart,
      end: monthEnd
    });

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
    return entry || {
      symptoms: [],
      notes: ''
    };
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
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };
  const handleDayClick = (date: Date) => {
    if (readOnly) {
      // In read-only mode, only show the expansion
      const dayData = getDayData(date);
      const dayIndex = calendarPeriod.days.findIndex(d => d && isSameDay(d, date));
      const rowIndex = Math.floor(dayIndex / 7);
      if (selectedDayData && isSameDay(selectedDayData.date, date)) {
        setSelectedDayData(null);
        setExpandedRow(null);
      } else {
        setSelectedDayData({
          ...dayData,
          date
        });
        setExpandedRow(rowIndex);
      }
      return;
    }
    const dayData = getDayData(date);
    const dayIndex = calendarPeriod.days.findIndex(d => d && isSameDay(d, date));
    const rowIndex = Math.floor(dayIndex / 7);

    // Toggle expansion - if same day clicked, collapse; otherwise expand new day
    if (selectedDayData && isSameDay(selectedDayData.date, date)) {
      setSelectedDayData(null);
      setExpandedRow(null);
    } else {
      setSelectedDayData({
        ...dayData,
        date
      });
      setExpandedRow(rowIndex);
    }

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
    return <div className="absolute top-0.5 right-0.5 flex">
        {[...Array(intensity)].map((_, i) => <Droplets key={i} className="w-2.5 h-2.5" style={{
        color: '#FF7782'
      }} fill="currentColor" />)}
      </div>;
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
                  {generateMonthOptions().map(option => <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>)}
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
                  {generateMonthOptions().map(option => <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                Zrušiť
              </Button>
              <Button onClick={generatePDF} disabled={!exportStartMonth || !exportEndMonth} className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white">
                <Download className="w-4 h-4 mr-2" />
                Exportovať
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header with Filters */}
      <div className={isMobile ? "space-y-3" : ""}>
        <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
        {/* Calendar Actions - Filter and Dropdown */}
          <div className="flex gap-2 items-center">
            {/* Filter Toggle Button */}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowSymptomFilters(!showSymptomFilters)} 
              className={`flex items-center gap-1.5 text-xs border transition-all duration-200 ${showSymptomFilters ? 'bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white border-[#FF7782]' : 'border-[#FF7782] bg-transparent hover:bg-[#FF7782]/10 text-[#FF7782]'}`}
            >
              <Filter className="w-3 h-3" />
              Filtrovať
            </Button>

            {/* Calendar Actions Dropdown */}
            <Select
              value=""
              onValueChange={(value) => {
                switch(value) {
                  case 'clear':
                    onOutcomeSelect(null);
                    setShowSymptomFilters(false);
                    break;
                  case 'period':
                    onOutcomeSelect(selectedOutcome === 'next-period' ? null : 'next-period');
                    break;
                  case 'fertile':
                    onOutcomeSelect(selectedOutcome === 'fertile-days' ? null : 'fertile-days');
                    break;
                  case 'today':
                    setCurrentDate(new Date());
                    break;
                  case 'notes':
                    // TODO: Implement notes filter
                    break;
                }
              }}
            >
              <SelectTrigger className="w-[180px] border-[#FF7782] text-[#955F6A] hover:bg-[#FF7782]/10 focus:ring-[#FF7782]">
                <SelectValue placeholder="Vyber si" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#FF7782] z-50">
                <SelectItem value="clear" className="text-[#955F6A] hover:bg-[#FF7782]/10 focus:bg-[#FF7782]/10 font-medium">
                  <div className="flex items-center gap-2">
                    <span>✕ Zrušiť filter</span>
                  </div>
                </SelectItem>
                <SelectItem value="period" className="text-[#955F6A] hover:bg-[#FF7782]/10 focus:bg-[#FF7782]/10">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3 h-3" />
                    <span>Menštruácia</span>
                  </div>
                </SelectItem>
                <SelectItem value="fertile" className="text-[#955F6A] hover:bg-[#FF7782]/10 focus:bg-[#FF7782]/10">
                  <div className="flex items-center gap-2">
                    <Heart className="w-3 h-3" />
                    <span>Plodné dni</span>
                  </div>
                </SelectItem>
                <SelectItem value="today" className="text-[#955F6A] hover:bg-[#FF7782]/10 focus:bg-[#FF7782]/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Dnes</span>
                  </div>
                </SelectItem>
                <SelectItem value="notes" className="text-[#955F6A] hover:bg-[#FF7782]/10 focus:bg-[#FF7782]/10">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>Poznámky</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Legend */}
          
        </div>

        {/* Symptom Filters - Hidden by default */}
        {availableSymptoms.length > 0 && showSymptomFilters && <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#955F6A]" />
              <span className="text-sm font-medium text-[#955F6A]">Filtrovať príznaky:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableSymptoms.map(symptom => {
            const symptomColor = getSymptomColor(symptom);
            return <Badge key={symptom} variant={selectedSymptoms.includes(symptom) ? "default" : "outline"} className={`cursor-pointer text-xs transition-all ${selectedSymptoms.includes(symptom) ? 'text-white border-transparent' : 'border-[#FF7782] text-[#FF7782] hover:bg-[#FF7782]/10'}`} style={symptomColor ? {
              backgroundColor: symptomColor,
              borderColor: symptomColor
            } : {}} onClick={() => handleSymptomToggle(symptom)}>
                    {symptom}
                  </Badge>;
          })}
            </div>
          </div>}
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigatePeriod('prev')} className="flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h4 className="text-lg font-medium" style={{
        color: '#955F6A'
      }}>
          {format(currentDate, 'LLLL yyyy', {
          locale: sk
        })}
        </h4>
        
        <Button variant="ghost" size="sm" onClick={() => navigatePeriod('next')} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map(day => <div key={day} className="text-center text-xs font-medium py-2" style={{
          color: '#955F6A'
        }}>
              {day}
            </div>)}
        </div>

        {/* Calendar Days with Inline Expansion */}
        <div className="space-y-0">
          {Array.from({
          length: Math.ceil(calendarPeriod.days.length / 7)
        }, (_, rowIndex) => {
          const startIndex = rowIndex * 7;
          const endIndex = Math.min(startIndex + 7, calendarPeriod.days.length);
          const rowDays = calendarPeriod.days.slice(startIndex, endIndex);
          return <div key={rowIndex}>
                {/* Calendar Row */}
                <div className="grid gap-1 grid-cols-7">
                  {rowDays.map((date, dayIndex) => {
                const globalIndex = startIndex + dayIndex;
                if (!date) {
                  return <div key={globalIndex} className="aspect-square"></div>;
                }
                const dayInfo = getDayInfo(date);
                const isCurrentDay = isToday(date);
                const hasFilteredSymptoms = dayHasFilteredSymptoms(date);
                const hasNotes = dayHasNotes(date);
                const dayData = getDayData(date);
                const isSelected = selectedDayData && isSameDay(selectedDayData.date, date);

                // Get filtered symptoms for this day to create stroke effects
                const daySymptoms = dayData.symptoms.filter(symptom => selectedSymptoms.includes(symptom));
                const hasSymptoms = daySymptoms.length > 0;
                let dayClasses = `aspect-square flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer relative border border-transparent transition-all duration-300`;
                let dayStyle: React.CSSProperties = {
                  color: '#955F6A'
                };

                // Selected day styling
                if (isSelected) {
                  dayClasses += " ring-2 ring-blue-400 ring-offset-2 shadow-lg scale-105";
                  dayStyle.zIndex = 20;
                }

                // 3D Effect: Days with symptoms are elevated, others are pushed back
                if (hasSymptoms && !isSelected) {
                  dayClasses += " transform translate-z-0 shadow-lg hover:shadow-xl";
                  dayStyle.transform = 'translateZ(8px) scale(1.02)';
                  dayStyle.zIndex = 10;
                  dayStyle.boxShadow = '0 8px 25px -8px rgba(0,0,0,0.2), 0 4px 15px -4px rgba(0,0,0,0.1)';
                } else if (!isSelected) {
                  dayClasses += " transform translate-z-0 opacity-85";
                  dayStyle.transform = 'translateZ(-2px) scale(0.98)';
                  dayStyle.zIndex = 1;
                  dayStyle.boxShadow = '0 2px 8px -2px rgba(0,0,0,0.1)';
                }

                // Create multiple stroke effects for multiple symptoms
                if (hasSymptoms && !isSelected) {
                  const strokeCount = Math.min(daySymptoms.length, 3);
                  let strokeStyles = '';
                  for (let i = 0; i < strokeCount; i++) {
                    const symptom = daySymptoms[i];
                    const color = getSymptomColor(symptom) || '#9CA3AF';
                    const offset = i * 2 + 2;
                    strokeStyles += `0 0 0 ${offset}px ${color}${i === strokeCount - 1 ? '' : ', '}`;
                  }
                  dayStyle.boxShadow = `${dayStyle.boxShadow}, ${strokeStyles}`;
                }

                // Highlight based on selected outcome
                if (selectedOutcome === 'next-period' && dayInfo.isPeriod) {
                  dayClasses += " bg-rose-400 text-white hover:bg-rose-500 border-rose-500";
                  dayStyle = {
                    ...dayStyle,
                    color: 'white'
                  };
                } else if (selectedOutcome === 'fertile-days' && dayInfo.isFertile) {
                  dayClasses += " bg-pink-300 text-white hover:bg-pink-400 border-pink-400";
                  dayStyle = {
                    ...dayStyle,
                    color: 'white'
                  };
                } else if (!selectedOutcome) {
                  // Show normal phase colors when no filter is active
                  if (dayInfo.isPeriod) {
                    dayClasses += " bg-rose-100 border-rose-300";
                  } else if (dayInfo.isFertile) {
                    dayClasses += " bg-pink-50 border-pink-200";
                  } else {
                    dayClasses += " hover:bg-white/80 border-gray-100 bg-white/60";
                  }
                } else {
                  dayClasses += " hover:bg-white/80 border-gray-100 bg-white/60";
                }

                // Today's border - enhanced for 3D effect
                if (isCurrentDay && !isSelected) {
                  dayClasses += " ring-2 ring-rose-400 ring-offset-1";
                  if (hasSymptoms) {
                    dayStyle.boxShadow += ', 0 0 0 3px rgba(244, 63, 94, 0.3)';
                  }
                }
                return <div key={date.getTime()} className={dayClasses} style={dayStyle} onClick={() => handleDayClick(date)}>
                        {/* Day number */}
                        <span className="relative z-10 font-medium">
                          {format(date, 'd')}
                        </span>
                        
                        {/* Indicators container */}
                        <div className="absolute bottom-1 left-1 right-1 flex justify-center gap-1 flex-wrap">
                          {/* Period intensity indicator */}
                          {renderPeriodIntensity(date)}
                          
                          {/* Symptom indicators - only show selected symptoms with their colors */}
                          {dayData.symptoms.filter(symptom => selectedSymptoms.includes(symptom)).slice(0, 4).map((symptom, i) => {
                      const color = getSymptomColor(symptom);
                      return <div key={i} className="w-1.5 h-1.5 rounded-full" style={{
                        backgroundColor: color || '#9CA3AF'
                      }} />;
                    })}
                          
                          {/* Additional symptoms indicator */}
                          {dayData.symptoms.filter(symptom => selectedSymptoms.includes(symptom)).length > 4 && <div className="text-[10px] text-gray-600 font-bold">+</div>}
                          
                          {/* Notes indicator */}
                          {hasNotes && <FileText className="w-4 h-4 text-gray-500" />}
                        </div>
                        
                        {/* Today indicator overlay */}
                        {isCurrentDay && !selectedOutcome && !isSelected && <div className="absolute inset-0 rounded-lg bg-rose-400/10"></div>}
                      </div>;
              })}
                </div>
                
                {/* Inline Expansion Panel */}
                {expandedRow === rowIndex && selectedDayData && <div className="grid grid-cols-1 overflow-hidden animate-accordion-down" style={{
              animation: 'accordion-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                    <div className="mx-1 mt-2 mb-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-rose-200/50 shadow-xl overflow-hidden">
                        {/* Elegant header with glassmorphism */}
                        <div className="bg-gradient-to-r from-rose-50/90 to-pink-50/90 px-6 py-4 border-b border-rose-100/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-rose-600">
                                  {format(selectedDayData.date, 'd')}
                                </span>
                              </div>
                              <h4 className="font-medium text-rose-800">
                                Detaily pre {format(selectedDayData.date, 'd. MMMM', {
                            locale: sk
                          })}
                              </h4>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => {
                        setSelectedDayData(null);
                        setExpandedRow(null);
                      }} className="text-rose-600 hover:text-rose-700 hover:bg-rose-100/50 rounded-full w-8 h-8 p-0">
                              ×
                            </Button>
                          </div>
                        </div>
                        
                        {/* Content with elegant spacing */}
                        <div className="p-6 space-y-5">
                          {selectedDayData.symptoms.length > 0 && <div className="animate-fade-in" style={{
                      animationDelay: '0.1s'
                    }}>
                              <h5 className="text-sm font-medium mb-3 text-rose-700 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                                Príznaky
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {selectedDayData.symptoms.map((symptom, index) => {
                          const color = getSymptomColor(symptom);
                          return <Badge key={symptom} variant="outline" className={`text-xs transition-all duration-200 hover:scale-105 ${color ? 'text-white border-transparent shadow-sm' : 'border-rose-200 text-rose-700 bg-rose-50/50'}`} style={{
                            backgroundColor: color || undefined,
                            borderColor: color || undefined,
                            animationDelay: `${index * 0.05}s`
                          }}>
                                      {symptom}
                                    </Badge>;
                        })}
                              </div>
                            </div>}
                          
                          {selectedDayData.notes && <div className="animate-fade-in" style={{
                      animationDelay: '0.2s'
                    }}>
                              <h5 className="text-sm font-medium mb-3 text-rose-700 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                                Poznámky
                              </h5>
                              <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100/50">
                                <p className="text-sm text-rose-800 leading-relaxed">
                                  {selectedDayData.notes}
                                </p>
                              </div>
                            </div>}
                          
                          {/* Symptom Tracker for current day */}
                          {!readOnly && (() => {
                      const lastPeriodDate = cycleData.lastPeriodStart ? typeof cycleData.lastPeriodStart === 'string' ? new Date(cycleData.lastPeriodStart) : cycleData.lastPeriodStart : null;
                      if (!lastPeriodDate) return null;
                      const daysSinceStart = differenceInDays(selectedDayData.date, lastPeriodDate);
                      const currentDay = daysSinceStart + 1;
                      const currentPhaseInfo = getCurrentDayPhase(selectedDayData.date);
                      if (!currentPhaseInfo) return null;
                      return <div className="animate-fade-in border-t border-rose-100/50 pt-5" style={{
                        animationDelay: '0.3s'
                      }}>
                                <h5 className="text-sm font-medium mb-3 text-rose-700 flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                                  Zaznamenať príznaky
                                </h5>
                                <SymptomTracker currentPhase={currentPhaseInfo.key} currentDay={currentDay} accessCode={accessCode} lastPeriodStart={cycleData.lastPeriodStart} />
                              </div>;
                    })()}
                          
                          {selectedDayData.symptoms.length === 0 && !selectedDayData.notes && readOnly && <div className="text-center py-8 animate-fade-in">
                              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-rose-400" />
                              </div>
                              <p className="text-sm text-rose-600">Žiadne záznamy pre tento deň.</p>
                            </div>}
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>;
        })}
        </div>
      </div>


      {/* Current Selection Info */}
      {selectedOutcome && <div className="mt-4 p-3 bg-white/80 rounded-lg border border-rose-200/50">
          <div className="flex items-center gap-2 mb-2">
            {selectedOutcome === 'next-period' ? <Droplets className="w-4 h-4 text-rose-400" /> : <Heart className="w-4 h-4 text-pink-400" />}
            <span className="font-medium text-sm" style={{
          color: '#955F6A'
        }}>
              {selectedOutcome === 'next-period' ? 'Perioda' : 'Plodné dni'}
            </span>
          </div>
          <p className="text-xs" style={{
        color: '#955F6A'
      }}>
            {selectedOutcome === 'next-period' ? 'Červené dni označujú očakávanú menštruáciu na základe vášho cyklu.' : 'Ružové dni označujú plodné dni, kedy je najväčšia pravdepodobnosť otehotnenia.'}
          </p>
        </div>}

      {/* Period Intensity Selector Modal */}
      {selectedDate && <PeriodIntensitySelector date={selectedDate} currentIntensity={getPeriodIntensity(selectedDate)} onSelect={handlePeriodIntensitySelect} onClose={() => setSelectedDate(null)} />}
    </div>;
}