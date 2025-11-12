import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Check, X, RefreshCw, Sparkles, Loader2, Calendar, Edit2, Save, Plus } from 'lucide-react';
import { useCycleData } from '@/features/cycle/useCycleData';
import { format, addDays, parseISO, subDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { getCurrentCycleDay, getPhaseRanges, getPhaseByDay } from '@/features/cycle/utils';

interface CycleTip {
  id: string;
  day: number;
  phase: string;
  subphase?: string;
  expectation_text?: string;
  nutrition_text?: string;
  mind_text?: string;
  movement_text?: string;
  category: string;
  tip_text: string;
  is_approved: boolean;
  created_by: string;
}

const PHASE_LABELS: Record<string, string> = {
  menstrual: 'Menštruačná',
  follicular: 'Folikulárna',
  ovulation: 'Ovulácia',
  luteal: 'Luteálna'
};

const SUBPHASE_LABELS: Record<string, string> = {
  early: 'Včasná',
  mid: 'Stredná',
  late: 'Neskorá'
};

// Lookup tabuľka pre typické rozsahy krvácania podľa dĺžky cyklu
const TYPICAL_BLEEDING_RANGES: Record<number, [number, number]> = {
  21: [2, 4], 22: [2, 4], 23: [2, 5], 24: [3, 5], 25: [3, 5],
  26: [3, 6], 27: [4, 5], 28: [4, 6], 29: [4, 6], 30: [4, 6],
  31: [4, 6], 32: [4, 6], 33: [5, 6], 34: [5, 6], 35: [5, 7],
  36: [5, 7], 37: [5, 7], 38: [5, 7], 39: [5, 7], 40: [5, 8]
};

// Generuje náhodnú hodnotu v typickom rozsahu
const generateTypicalBleedingLength = (cycleLength: number): number => {
  const range = TYPICAL_BLEEDING_RANGES[cycleLength] || [4, 6];
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function AdminCycleTips() {
  const [tips, setTips] = useState<CycleTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTip, setEditingTip] = useState<string | null>(null);
  const [editExpectation, setEditExpectation] = useState('');
  const [editNutrition, setEditNutrition] = useState('');
  const [editMind, setEditMind] = useState('');
  const [editMovement, setEditMovement] = useState('');
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [isEditingTestData, setIsEditingTestData] = useState(false);
  const [editLastPeriodStart, setEditLastPeriodStart] = useState('');
  const [editPeriodLength, setEditPeriodLength] = useState(5);
  const [editCycleLength, setEditCycleLength] = useState(28);
  const [editNextPeriodEstimate, setEditNextPeriodEstimate] = useState('');
  const [isPeriodLengthAuto, setIsPeriodLengthAuto] = useState(false);
  const { toast } = useToast();
  
  // Load cycle data from localStorage
  const { cycleData, setLastPeriodStart, setPeriodLength, setCycleLength: updateCycleLength } = useCycleData();

  // Helper function to parse bullet points from text
  const parseBulletPoints = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => line.replace(/^-\s*/, '').trim());
  };

  useEffect(() => {
    loadTips();
  }, []);

  useEffect(() => {
    loadTips();
  }, [cycleLength]);

  // Synchronize cycleLength with Test Data
  useEffect(() => {
    if (cycleData.cycleLength) {
      setCycleLength(cycleData.cycleLength);
    }
  }, [cycleData.cycleLength]);

  const loadTips = async () => {
    try {
      const { data, error } = await supabase
        .from('cycle_tips')
        .select('*')
        .eq('cycle_length', cycleLength)
        .order('day')
        .order('category');

      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error('Error loading tips:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa načítať tipy',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cycle_tips')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;

      setTips(tips.map(t => t.id === id ? { ...t, is_approved: true } : t));
      toast({
        title: 'Úspech',
        description: 'Tip bol schválený'
      });
    } catch (error) {
      console.error('Error approving tip:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa schváliť tip',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cycle_tips')
        .update({ is_approved: false })
        .eq('id', id);

      if (error) throw error;

      setTips(tips.map(t => t.id === id ? { ...t, is_approved: false } : t));
      toast({
        title: 'Úspech',
        description: 'Schválenie bolo zrušené'
      });
    } catch (error) {
      console.error('Error rejecting tip:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa zrušiť schválenie',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (tip: CycleTip) => {
    setEditingTip(tip.id);
    setEditExpectation(tip.expectation_text || '');
    setEditNutrition(tip.nutrition_text || '');
    setEditMind(tip.mind_text || '');
    setEditMovement(tip.movement_text || '');
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cycle_tips')
        .update({ 
          expectation_text: editExpectation,
          nutrition_text: editNutrition,
          mind_text: editMind,
          movement_text: editMovement,
          created_by: 'manual'
        })
        .eq('id', id);

      if (error) throw error;

      setTips(tips.map(t => t.id === id ? { 
        ...t, 
        expectation_text: editExpectation,
        nutrition_text: editNutrition,
        mind_text: editMind,
        movement_text: editMovement,
        created_by: 'manual' 
      } : t));
      setEditingTip(null);
      toast({
        title: 'Úspech',
        description: 'Plán bol upravený'
      });
    } catch (error) {
      console.error('Error saving edit:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa uložiť úpravu',
        variant: 'destructive'
      });
    }
  };

  const handleRegenerate = async (day: number) => {
    setRegeneratingDay(day);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cycle-tips', {
        body: { day, regenerate: true }
      });

      if (error) throw error;

      toast({
        title: 'Úspech',
        description: `Deň ${day} úspešne vygenerovaný`,
      });

      await loadTips();
    } catch (error) {
      console.error('Error regenerating:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vygenerovať plán',
        variant: 'destructive'
      });
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleBulkGenerate = async () => {
    setBulkGenerating(true);
    try {
      const BATCH_SIZE = 10;
      const batches: { start: number; end: number }[] = [];
      
      // Create batches: [1-10], [11-20], [21-30], [31-cycleLength]
      for (let start = 1; start <= cycleLength; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, cycleLength);
        batches.push({ start, end });
      }
      
      let totalSuccessful = 0;
      let totalFailed = 0;
      
      // Process each batch sequentially with progress toasts
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        
        toast({
          title: `🔄 Batch ${i + 1}/${batches.length}`,
          description: `Generujem dni ${batch.start}-${batch.end}...`,
        });
        
        const { data, error } = await supabase.functions.invoke('bulk-generate-tips', {
          body: { 
            regenerate: true, 
            cycleLength, 
            startDay: batch.start, 
            endDay: batch.end 
          }
        });
        
        if (!error && data?.summary) {
          totalSuccessful += data.summary.successful || 0;
          totalFailed += data.summary.failed || 0;
        } else {
          console.error(`Batch ${i + 1} error:`, error);
          totalFailed += (batch.end - batch.start + 1);
        }
      }

      toast({
        title: '✅ Generovanie hotové!',
        description: `Úspešne vygenerovaných: ${totalSuccessful} / ${cycleLength} dní${totalFailed > 0 ? ` (${totalFailed} chýb)` : ''}`,
      });

      await loadTips();
    } catch (error) {
      console.error('Error bulk generating:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vygenerovať plány',
        variant: 'destructive'
      });
    } finally {
      setBulkGenerating(false);
    }
  };

  // Group tips by day
  const groupedTips = tips.reduce((acc, tip) => {
    const key = tip.day;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(tip);
    return acc;
  }, {} as Record<number, CycleTip[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  // Calculate current cycle day and phase
  const currentDay = cycleData.lastPeriodStart 
    ? getCurrentCycleDay(cycleData.lastPeriodStart, new Date(), cycleData.cycleLength)
    : 1;
  const phaseRanges = getPhaseRanges(cycleData.cycleLength, cycleData.periodLength);
  const currentPhase = getPhaseByDay(currentDay, phaseRanges);

  const handleEditTestData = () => {
    setEditLastPeriodStart(cycleData.lastPeriodStart || format(new Date(), 'yyyy-MM-dd'));
    setEditPeriodLength(cycleData.periodLength);
    setEditCycleLength(cycleData.cycleLength || 0); // 0 ak nie je definované
    setEditNextPeriodEstimate('');
    setIsEditingTestData(true);
  };

  const handleSaveTestData = () => {
    // Validácia: musí byť zadaný aspoň začiatok menštruácie
    if (!editLastPeriodStart) {
      toast({
        title: '⚠️ Chýbajúce údaje',
        description: 'Prosím, zadaj začiatok poslednej menštruácie.',
        variant: 'destructive',
      });
      return;
    }

    // Validácia: musí byť vyplnený cycleLength ALEBO nextPeriodEstimate
    if (!editCycleLength && !editNextPeriodEstimate) {
      toast({
        title: '⚠️ Chýbajúce údaje',
        description: 'Prosím, vyplň buď dĺžku menštruačného cyklu alebo predpokladaný začiatok ďalšej menštruácie.',
        variant: 'destructive',
      });
      return;
    }
    
    let finalPeriodLength = editPeriodLength;
    let finalCycleLength = editCycleLength;
    
    // 1. Vypočítať dĺžku cyklu z "začiatku ďalšej menštruácie" (ak je zadaný)
    if (editNextPeriodEstimate && editLastPeriodStart) {
      const daysDiff = Math.abs(
        Math.floor((parseISO(editNextPeriodEstimate).getTime() - parseISO(editLastPeriodStart).getTime()) / (1000 * 60 * 60 * 24))
      );
      finalCycleLength = daysDiff;
      
      // Validácia rozsahu cyklu
      if (finalCycleLength < 25 || finalCycleLength > 35) {
        toast({
          title: '⚠️ Nezvyčajná dĺžka cyklu',
          description: `Vypočítaná dĺžka ${finalCycleLength} dní je mimo typického rozsahu 25-35 dní.`,
          variant: 'destructive',
        });
      }
    }
    
    // 2. Ak nie je zadaná dĺžka krvácania (alebo je 0) → AUTO
    if (!finalPeriodLength || finalPeriodLength === 0) {
      finalPeriodLength = generateTypicalBleedingLength(finalCycleLength);
      setIsPeriodLengthAuto(true);
      toast({
        title: '✅ Automaticky doplnená dĺžka menštruácie',
        description: `Použitá typická hodnota ${finalPeriodLength} dní pre ${finalCycleLength}-dňový cyklus`,
      });
    } else {
      setIsPeriodLengthAuto(false);
    }
    
    // 3. Validácia: krvácanie >8 dní
    if (finalPeriodLength > 8) {
      toast({
        title: '⚠️ Dlhé krvácanie',
        description: 'Krvácanie dlhšie ako 8 dní môže byť nezvyčajné. Odporúčame konzultáciu s lekárom.',
        variant: 'destructive',
      });
    }
    
    // 4. Obmedzenie na fyziologický rozsah 2-8 dní
    finalPeriodLength = Math.max(2, Math.min(8, finalPeriodLength));
    
    // 5. Uloženie do localStorage
    if (editLastPeriodStart) {
      setLastPeriodStart(parseISO(editLastPeriodStart));
    }
    setPeriodLength(finalPeriodLength);
    updateCycleLength(finalCycleLength);
    
    setIsEditingTestData(false);
    toast({
      title: '✅ Údaje uložené',
      description: 'Testové údaje boli aktualizované',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Test Data Card */}
        {(cycleData.lastPeriodStart || isEditingTestData) ? (
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calendar className="w-5 h-5" />
                  Testové údaje (localStorage)
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={isEditingTestData ? handleSaveTestData : handleEditTestData}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  {isEditingTestData ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Uložiť
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Upraviť
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditingTestData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lastPeriodStart">
                      Začiatok poslednej menštruácie *
                      <span className="text-xs text-muted-foreground ml-2">(povinné)</span>
                    </Label>
                    <Input
                      id="lastPeriodStart"
                      type="date"
                      value={editLastPeriodStart}
                      onChange={(e) => setEditLastPeriodStart(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodLength">
                      Dĺžka menštruácie (dni krvácania) *
                      <span className="text-xs text-muted-foreground ml-2">(povinné, alebo AUTO)</span>
                      {isPeriodLengthAuto && <Badge variant="secondary" className="ml-2">AUTO</Badge>}
                    </Label>
                    <Input
                      id="periodLength"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="Nechaj prázdne pre AUTO výpočet"
                      value={editPeriodLength || ''}
                      onChange={(e) => setEditPeriodLength(Number(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ak je prázdne, použije sa typická hodnota podľa dĺžky cyklu (2-8 dní)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextPeriodEstimate">
                      Predpokladaný začiatok ďalšej menštruácie *
                      <span className="text-xs text-muted-foreground ml-2">(vyplň toto ALEBO dĺžku cyklu nižšie)</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="nextPeriodEstimate"
                        type="date"
                        value={editNextPeriodEstimate}
                        onChange={(e) => setEditNextPeriodEstimate(e.target.value)}
                        min={editLastPeriodStart}
                        disabled={editCycleLength > 0}
                        className="w-full"
                      />
                      {editNextPeriodEstimate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditNextPeriodEstimate('')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ak je zadaný, dĺžka cyklu sa vypočíta automaticky. Alternatívne zadaj dĺžku cyklu nižšie.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength">
                      ALEBO Dĺžka menštruačného cyklu (dni) *
                      <span className="text-xs text-muted-foreground ml-2">(vyplň toto ALEBO predpokladaný začiatok vyššie)</span>
                      {editNextPeriodEstimate && editLastPeriodStart && (
                        <Badge variant="secondary" className="ml-2">
                          AUTO: {Math.abs(Math.floor((parseISO(editNextPeriodEstimate).getTime() - parseISO(editLastPeriodStart).getTime()) / (1000 * 60 * 60 * 24)))} dní
                        </Badge>
                      )}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="cycleLength"
                        type="number"
                        min="25"
                        max="35"
                        value={editCycleLength || ''}
                        onChange={(e) => setEditCycleLength(Number(e.target.value))}
                        disabled={!!editNextPeriodEstimate}
                        className="w-full"
                      />
                      {editCycleLength > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditCycleLength(0)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                (() => {
                  // Vypočítať plodné dni
                  const ovulationDay = cycleData.cycleLength - 14;
                  const fertilityStart = ovulationDay - 5;
                  const fertilityEnd = ovulationDay + 1;
                  const fertilityStartDate = addDays(parseISO(cycleData.lastPeriodStart), fertilityStart);
                  const fertilityEndDate = addDays(parseISO(cycleData.lastPeriodStart), fertilityEnd);
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Začiatok menštruácie</p>
                        <p className="text-lg font-semibold text-foreground">
                          {format(parseISO(cycleData.lastPeriodStart), 'PPP', { locale: sk })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Koniec menštruácie</p>
                        <p className="text-lg font-semibold text-foreground">
                          {format(addDays(parseISO(cycleData.lastPeriodStart), cycleData.periodLength - 1), 'PPP', { locale: sk })}
                          <Badge variant="outline" className="ml-2 text-xs">AUTO</Badge>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Dĺžka menštruácie (krvácania)</p>
                        <p className="text-lg font-semibold text-foreground">
                          {cycleData.periodLength} dní
                          {isPeriodLengthAuto && <Badge variant="secondary" className="ml-2 text-xs">TYPICKÁ</Badge>}
                          {cycleData.periodLength > 8 && (
                            <Badge variant="destructive" className="ml-2 text-xs">⚠️ DLHÉ</Badge>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Dĺžka menštruačného cyklu</p>
                        <p className="text-lg font-semibold text-foreground">
                          {cycleData.cycleLength} dní
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Odhadovaný začiatok ďalšej menštruácie</p>
                        <p className="text-lg font-semibold text-foreground">
                          {format(addDays(parseISO(cycleData.lastPeriodStart), cycleData.cycleLength), 'PPP', { locale: sk })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Plodné dni (fertility window)</p>
                        <p className="text-lg font-semibold text-foreground">
                          {format(fertilityStartDate, 'd.M.', { locale: sk })} - {format(fertilityEndDate, 'd.M.yyyy', { locale: sk })}
                          <Badge variant="outline" className="ml-2 text-xs">AUTO</Badge>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Aktuálny deň cyklu / Fáza</p>
                        <p className="text-lg font-semibold text-foreground">
                          Deň {currentDay} / {PHASE_LABELS[currentPhase.key]}
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Tieto údaje sa načítavajú z localStorage. Môžeš ich tu upraviť pre rýchle testovanie rôznych scenárov.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Calendar className="w-5 h-5" />
                Testové údaje
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Nie sú dostupné žiadne testovacie údaje.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Vlož testovacie údaje tu alebo vyplň dotazník v hlavnej aplikácii (<code>/menstrual-calendar</code>).
              </p>
              <Button
                onClick={() => {
                  setIsEditingTestData(true);
                  // Nastaviť default hodnoty pre pohodlie
                  setEditLastPeriodStart(format(subDays(new Date(), 10), 'yyyy-MM-dd'));
                  setEditCycleLength(28);
                  setEditPeriodLength(0); // 0 = AUTO
                  setEditNextPeriodEstimate('');
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Vložiť údaje
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#955F6A' }}>
                Admin - Dynamický cyklový plán
              </h1>
              <p className="text-sm mt-1" style={{ color: '#955F6A', opacity: 0.7 }}>
                Schvaľuj, upravuj a generuj AI plány pre rôzne dĺžky cyklu (25-35 dní)
              </p>
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="flex flex-col">
                <label className="text-xs font-medium mb-1" style={{ color: '#955F6A' }}>
                  Dĺžka cyklu:
                </label>
                <div className="flex items-center gap-2">
                  <select 
                    value={cycleLength} 
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="border rounded px-3 py-2 text-sm"
                    style={{ borderColor: '#FF7782', color: '#955F6A' }}
                  >
                    {[25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map(len => (
                      <option key={len} value={len}>{len} dní</option>
                    ))}
                  </select>
                  {cycleData.cycleLength && cycleLength === cycleData.cycleLength && (
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      ✅ Synchronizované
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button
                onClick={handleBulkGenerate}
                disabled={bulkGenerating}
                className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white mt-5"
              >
                {bulkGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generujem batch...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Vygenerovať {cycleLength}-dňový plán
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold mb-2" style={{ color: '#955F6A' }}>
              📋 Návod na použitie
            </h3>
            <ol className="text-sm space-y-1" style={{ color: '#955F6A', opacity: 0.9 }}>
              <li>1️⃣ Vyber dĺžku cyklu (25-35 dní) a klikni na "Vygenerovať" pre vytvorenie všetkých denných plánov</li>
              <li>2️⃣ AI dynamicky prispôsobí fázy cyklu a kardio dni podľa zvolenej dĺžky</li>
              <li>3️⃣ Skontroluj každý deň - AI používa softer jazyk a praktické myšlienky</li>
              <li>4️⃣ Upravuj texty podľa potreby (gramatika, plynulosť)</li>
              <li>5️⃣ Schvaľuj denné plány - len schválené sa zobrazia užívateľom</li>
              <li>6️⃣ Použij "Re-generovať" pre nové verzie konkrétneho dňa</li>
            </ol>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold" style={{ color: '#955F6A' }}>
              {tips.length}
            </div>
            <div className="text-sm" style={{ color: '#955F6A', opacity: 0.7 }}>
              Celkový počet tipov
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {tips.filter(t => t.is_approved).length}
            </div>
            <div className="text-sm" style={{ color: '#955F6A', opacity: 0.7 }}>
              Schválené tipy
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {tips.filter(t => !t.is_approved).length}
            </div>
            <div className="text-sm" style={{ color: '#955F6A', opacity: 0.7 }}>
              Neschválené tipy
            </div>
          </Card>
        </div>

        {/* Daily Plans */}
        <div className="space-y-6">
          {Object.entries(groupedTips)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([day, dayTips]) => {
            const isRegenerating = regeneratingDay === Number(day);
            const tip = dayTips[0]; // One tip per day now
            
            return (
              <Card key={day} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#955F6A' }}>
                      Deň {day}
                    </h2>
                    <div className="flex gap-2 mt-1">
                      {tip && (
                        <>
                          <Badge variant="outline" style={{ borderColor: '#FF7782', color: '#955F6A' }}>
                            {PHASE_LABELS[tip.phase]}
                            {tip.subphase && ` - ${SUBPHASE_LABELS[tip.subphase]}`}
                          </Badge>
                          <Badge variant={tip.created_by === 'ai' ? 'secondary' : 'default'}>
                            {tip.created_by === 'ai' ? 'AI' : 'Manuálne'}
                          </Badge>
                          <Badge variant={tip.is_approved ? 'default' : 'outline'} 
                                 className={tip.is_approved ? 'bg-green-500' : 'border-orange-400'}>
                            {tip.is_approved ? 'Schválené' : 'Čaká na schválenie'}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRegenerate(Number(day))}
                    disabled={isRegenerating}
                    className="border-[#FF7782] text-[#955F6A] hover:bg-[#FF7782]/10"
                  >
                    {isRegenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generujem...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-generovať
                      </>
                    )}
                  </Button>
                </div>

                {tip && (
                  <div className={`rounded-lg border-2 transition-all ${
                    tip.is_approved
                      ? 'border-green-200 bg-green-50'
                      : 'border-orange-200 bg-orange-50'
                  }`}>
                    {editingTip === tip.id ? (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block" style={{ color: '#955F6A' }}>
                            Čo môžem dnes očakávať?
                          </label>
                          <Textarea
                            value={editExpectation}
                            onChange={(e) => setEditExpectation(e.target.value)}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block" style={{ color: '#955F6A' }}>
                            Strava
                          </label>
                          <Textarea
                            value={editNutrition}
                            onChange={(e) => setEditNutrition(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block" style={{ color: '#955F6A' }}>
                            Pohyb
                          </label>
                          <Textarea
                            value={editMovement}
                            onChange={(e) => setEditMovement(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block" style={{ color: '#955F6A' }}>
                            Myseľ
                          </label>
                          <Textarea
                            value={editMind}
                            onChange={(e) => setEditMind(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTip(null)}
                          >
                            Zrušiť
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(tip.id)}
                            className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white"
                          >
                            Uložiť
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-sm font-semibold mb-1" style={{ color: '#955F6A' }}>
                              Čo môžem dnes očakávať?
                            </h3>
                            <p className="text-sm whitespace-pre-wrap" style={{ color: '#955F6A', opacity: 0.9 }}>
                              {tip.expectation_text || 'Nie je definované'}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1" style={{ color: '#955F6A' }}>
                              Strava
                            </h3>
                            {tip.nutrition_text ? (
                              <ul className="text-sm space-y-2 list-none" style={{ color: '#955F6A', opacity: 0.9 }}>
                                {parseBulletPoints(tip.nutrition_text).map((item, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-rose-400 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm" style={{ color: '#955F6A', opacity: 0.9 }}>
                                Nie je definované
                              </p>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1" style={{ color: '#955F6A' }}>
                              Pohyb
                            </h3>
                            {tip.movement_text ? (
                              <ul className="text-sm space-y-2 list-none" style={{ color: '#955F6A', opacity: 0.9 }}>
                                {parseBulletPoints(tip.movement_text).map((item, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-rose-400 mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm" style={{ color: '#955F6A', opacity: 0.9 }}>
                                Nie je definované
                              </p>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold mb-1" style={{ color: '#955F6A' }}>
                              Myseľ
                            </h3>
                            {tip.mind_text ? (
                              <div className="text-sm space-y-3" style={{ color: '#955F6A', opacity: 0.9 }}>
                                {tip.mind_text.split('\n\n').map((para, i) => (
                                  <p key={i}>{para}</p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm" style={{ color: '#955F6A', opacity: 0.9 }}>
                                Nie je definované
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(tip)}
                            className="text-xs"
                            style={{ color: '#955F6A' }}
                          >
                            Upraviť
                          </Button>
                          {tip.is_approved ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(tip.id)}
                              className="text-xs text-orange-600"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Zrušiť schválenie
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApprove(tip.id)}
                              className="text-xs text-green-600"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Schváliť
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {Object.keys(groupedTips).length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-lg mb-4" style={{ color: '#955F6A' }}>
                Zatiaľ nie sú vygenerované žiadne denné plány
              </p>
              <Button
                onClick={handleBulkGenerate}
                disabled={bulkGenerating}
                className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Vygenerovať 28-dňový plán s AI
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
