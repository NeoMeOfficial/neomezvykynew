import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Loader2, Calendar, Edit2, Save, Plus, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCycleData } from '@/features/cycle/useCycleData';
import { format, addDays, parseISO, subDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { getCurrentCycleDay, getPhaseRanges, getPhaseByDay, getSubphase, getDetailedPhaseRanges } from '@/features/cycle/utils';
import { generateNutrition, generateMovement } from '@/lib/cycleTipsGenerator';

interface PhaseTip {
  id: string;
  phase: string;
  subphase: string | null;
  expectation_text: string;
  mind_text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

const PHASE_LABELS: Record<string, string> = {
  menstrual: 'Menštruačná',
  follicular: 'Folikulárna',
  ovulation: 'Ovulácia',
  luteal: 'Luteálna'
};

const SUBPHASE_LABELS: Record<string, string> = {
  early: 'Začiatok',
  mid: 'Stred',
  late: 'Koniec',
  peak: 'Peak'
};

const PHASE_ORDER = [
  { phase: 'menstrual', subphase: 'early' },
  { phase: 'menstrual', subphase: 'mid' },
  { phase: 'menstrual', subphase: 'late' },
  { phase: 'follicular', subphase: 'mid' },
  { phase: 'follicular', subphase: 'late' },
  { phase: 'ovulation', subphase: 'peak' },
  { phase: 'luteal', subphase: 'early' },
  { phase: 'luteal', subphase: 'mid' },
  { phase: 'luteal', subphase: 'late' },
];

const PHASE_EMOJIS: Record<string, string> = {
  menstrual: '🔮',
  follicular: '🌱',
  ovulation: '🌟',
  luteal: '🌙'
};

// Lookup table for typical bleeding ranges
const TYPICAL_BLEEDING_RANGES: Record<number, [number, number]> = {
  21: [2, 4], 22: [2, 4], 23: [2, 5], 24: [3, 5], 25: [3, 5],
  26: [3, 6], 27: [4, 5], 28: [4, 6], 29: [4, 6], 30: [4, 6],
  31: [4, 6], 32: [4, 6], 33: [5, 6], 34: [5, 6], 35: [5, 7],
  36: [5, 7], 37: [5, 7], 38: [5, 7], 39: [5, 7], 40: [5, 8]
};

const generateTypicalBleedingLength = (cycleLength: number): number => {
  const range = TYPICAL_BLEEDING_RANGES[cycleLength] || [4, 6];
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function AdminCycleTips() {
  const [phaseTips, setPhaseTips] = useState<PhaseTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTip, setEditingTip] = useState<string | null>(null);
  const [editExpectation, setEditExpectation] = useState('');
  const [editMind, setEditMind] = useState('');
  const [isEditingTestData, setIsEditingTestData] = useState(false);
  const [editLastPeriodStart, setEditLastPeriodStart] = useState('');
  const [editPeriodLength, setEditPeriodLength] = useState(5);
  const [editCycleLength, setEditCycleLength] = useState(28);
  const [editNextPeriodEstimate, setEditNextPeriodEstimate] = useState('');
  const [isPeriodLengthAuto, setIsPeriodLengthAuto] = useState(false);
  
  // Preview state
  const [previewDay, setPreviewDay] = useState(1);
  const [previewCycleLength, setPreviewCycleLength] = useState(28);
  const [previewPeriodLength, setPreviewPeriodLength] = useState(5);
  
  const { toast } = useToast();
  const { cycleData, setLastPeriodStart, setPeriodLength, setCycleLength: updateCycleLength } = useCycleData();

  useEffect(() => {
    loadPhaseTips();
  }, []);

  // Sync preview settings with test data
  useEffect(() => {
    if (cycleData.cycleLength) setPreviewCycleLength(cycleData.cycleLength);
    if (cycleData.periodLength) setPreviewPeriodLength(cycleData.periodLength);
  }, [cycleData.cycleLength, cycleData.periodLength]);

  const loadPhaseTips = async () => {
    try {
      const { data, error } = await supabase
        .from('phase_tips')
        .select('*')
        .order('phase')
        .order('subphase');

      if (error) throw error;
      setPhaseTips(data || []);
    } catch (error) {
      console.error('Error loading phase tips:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa načítať fázové tipy',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('phase_tips')
        .update({ is_approved: approve })
        .eq('id', id);

      if (error) throw error;

      setPhaseTips(phaseTips.map(t => t.id === id ? { ...t, is_approved: approve } : t));
      toast({
        title: 'Úspech',
        description: approve ? 'Tip bol schválený' : 'Schválenie bolo zrušené'
      });
    } catch (error) {
      console.error('Error updating approval:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa aktualizovať stav schválenia',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (tip: PhaseTip) => {
    setEditingTip(tip.id);
    setEditExpectation(tip.expectation_text || '');
    setEditMind(tip.mind_text || '');
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('phase_tips')
        .update({ 
          expectation_text: editExpectation,
          mind_text: editMind,
        })
        .eq('id', id);

      if (error) throw error;

      setPhaseTips(phaseTips.map(t => t.id === id ? { 
        ...t, 
        expectation_text: editExpectation,
        mind_text: editMind,
      } : t));
      setEditingTip(null);
      toast({
        title: 'Úspech',
        description: 'Tip bol upravený'
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

  // Get tip for current preview
  const previewPhaseInfo = useMemo(() => {
    const result = getSubphase(previewDay, previewCycleLength, previewPeriodLength);
    return result;
  }, [previewDay, previewCycleLength, previewPeriodLength]);

  const previewPhaseTip = useMemo(() => {
    const { phase, subphase } = previewPhaseInfo;
    // Find matching tip - handle ovulation peak mapping
    return phaseTips.find(t => {
      if (phase === 'ovulation') {
        return t.phase === 'ovulation';
      }
      return t.phase === phase && t.subphase === subphase;
    });
  }, [previewPhaseInfo, phaseTips]);

  const previewNutrition = useMemo(() => {
    return generateNutrition(previewDay, previewPhaseInfo.phase, previewPhaseInfo.subphase);
  }, [previewDay, previewPhaseInfo]);

  const previewMovement = useMemo(() => {
    const phaseRanges = getPhaseRanges(previewCycleLength, previewPeriodLength);
    return generateMovement(previewDay, previewPhaseInfo.phase, previewPhaseInfo.subphase, phaseRanges);
  }, [previewDay, previewPhaseInfo, previewCycleLength, previewPeriodLength]);

  // Group tips by main phase
  const groupedTips = useMemo(() => {
    const groups: Record<string, PhaseTip[]> = {
      menstrual: [],
      follicular: [],
      ovulation: [],
      luteal: []
    };
    
    phaseTips.forEach(tip => {
      if (groups[tip.phase]) {
        groups[tip.phase].push(tip);
      }
    });
    
    // Sort subphases within each group
    Object.keys(groups).forEach(phase => {
      groups[phase].sort((a, b) => {
        const order = ['early', 'mid', 'late', 'peak'];
        return order.indexOf(a.subphase || '') - order.indexOf(b.subphase || '');
      });
    });
    
    return groups;
  }, [phaseTips]);

  // Test data handlers
  const currentDay = cycleData.lastPeriodStart 
    ? getCurrentCycleDay(cycleData.lastPeriodStart, new Date(), cycleData.cycleLength)
    : 1;
  const phaseRanges = getPhaseRanges(cycleData.cycleLength, cycleData.periodLength);
  const currentPhase = getPhaseByDay(currentDay, phaseRanges);

  const handleEditTestData = () => {
    setEditLastPeriodStart(cycleData.lastPeriodStart || format(new Date(), 'yyyy-MM-dd'));
    setEditPeriodLength(cycleData.periodLength);
    setEditCycleLength(cycleData.cycleLength || 0);
    setEditNextPeriodEstimate('');
    setIsEditingTestData(true);
  };

  const handleSaveTestData = () => {
    if (!editLastPeriodStart) {
      toast({
        title: '⚠️ Chýbajúce údaje',
        description: 'Prosím, zadaj začiatok poslednej menštruácie.',
        variant: 'destructive',
      });
      return;
    }

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
    
    if (editNextPeriodEstimate && editLastPeriodStart) {
      const daysDiff = Math.abs(
        Math.floor((parseISO(editNextPeriodEstimate).getTime() - parseISO(editLastPeriodStart).getTime()) / (1000 * 60 * 60 * 24))
      );
      finalCycleLength = daysDiff;
      
      if (finalCycleLength < 25 || finalCycleLength > 35) {
        toast({
          title: '⚠️ Nezvyčajná dĺžka cyklu',
          description: `Vypočítaná dĺžka ${finalCycleLength} dní je mimo typického rozsahu 25-35 dní.`,
          variant: 'destructive',
        });
      }
    }
    
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
    
    if (finalPeriodLength > 8) {
      toast({
        title: '⚠️ Dlhé krvácanie',
        description: 'Krvácanie dlhšie ako 8 dní môže byť nezvyčajné. Odporúčame konzultáciu s lekárom.',
        variant: 'destructive',
      });
    }
    
    finalPeriodLength = Math.max(2, Math.min(8, finalPeriodLength));
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  const approvedCount = phaseTips.filter(t => t.is_approved).length;
  const totalCount = phaseTips.length;

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
                    <><Save className="w-4 h-4 mr-2" />Uložiť</>
                  ) : (
                    <><Edit2 className="w-4 h-4 mr-2" />Upraviť</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {isEditingTestData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="lastPeriodStart">Začiatok poslednej menštruácie *</Label>
                    <Input
                      id="lastPeriodStart"
                      type="date"
                      value={editLastPeriodStart}
                      onChange={(e) => setEditLastPeriodStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodLength">Dĺžka menštruácie (dni)</Label>
                    <Input
                      id="periodLength"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="AUTO"
                      value={editPeriodLength || ''}
                      onChange={(e) => setEditPeriodLength(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength">Dĺžka cyklu (dni)</Label>
                    <Input
                      id="cycleLength"
                      type="number"
                      min="25"
                      max="35"
                      value={editCycleLength || ''}
                      onChange={(e) => setEditCycleLength(Number(e.target.value))}
                      disabled={!!editNextPeriodEstimate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextPeriodEstimate">ALEBO začiatok ďalšej menštruácie</Label>
                    <Input
                      id="nextPeriodEstimate"
                      type="date"
                      value={editNextPeriodEstimate}
                      onChange={(e) => setEditNextPeriodEstimate(e.target.value)}
                      min={editLastPeriodStart}
                      disabled={editCycleLength > 0}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Začiatok</p>
                    <p className="font-semibold">{format(parseISO(cycleData.lastPeriodStart), 'd.M.yyyy', { locale: sk })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dĺžka menštruácie</p>
                    <p className="font-semibold">{cycleData.periodLength} dní</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dĺžka cyklu</p>
                    <p className="font-semibold">{cycleData.cycleLength} dní</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aktuálny deň / Fáza</p>
                    <p className="font-semibold">Deň {currentDay} / {PHASE_LABELS[currentPhase.key]}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-primary/20">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Nie sú dostupné žiadne testovacie údaje.</p>
              <Button onClick={() => {
                setIsEditingTestData(true);
                setEditLastPeriodStart(format(subDays(new Date(), 10), 'yyyy-MM-dd'));
                setEditCycleLength(28);
                setEditPeriodLength(0);
              }}>
                <Plus className="w-4 h-4 mr-2" />Vložiť údaje
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#955F6A' }}>
            Admin - Hybridný systém tipov
          </h1>
          <p className="text-sm mt-1" style={{ color: '#955F6A', opacity: 0.7 }}>
            Spravuj fázové tipy (expectation + mind) a prezeraj dynamicky generovaný obsah (strava + pohyb)
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold" style={{ color: '#955F6A' }}>{totalCount}</div>
            <div className="text-sm text-muted-foreground">Celkovo fázových tipov</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-muted-foreground">Schválených</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">{totalCount - approvedCount}</div>
            <div className="text-sm text-muted-foreground">Neschválených</div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="phase-tips" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phase-tips">📝 Fázové tipy ({totalCount})</TabsTrigger>
            <TabsTrigger value="daily-preview">👁️ Denný náhľad</TabsTrigger>
          </TabsList>

          {/* Phase Tips Tab */}
          <TabsContent value="phase-tips" className="space-y-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-2" style={{ color: '#955F6A' }}>📋 Návod</h3>
              <p className="text-sm" style={{ color: '#955F6A', opacity: 0.9 }}>
                Tu upravuješ <strong>expectation_text</strong> (Čo môžem očakávať?) a <strong>mind_text</strong> (Myseľ) pre každú fázu/subfázu. 
                Sekcie Strava a Pohyb sa generujú dynamicky z MASTER dokumentov.
              </p>
            </Card>

            {['menstrual', 'follicular', 'ovulation', 'luteal'].map(phase => (
              <Card key={phase} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 py-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span>{PHASE_EMOJIS[phase]}</span>
                    {PHASE_LABELS[phase]} fáza
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {groupedTips[phase]?.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      Žiadne tipy pre túto fázu
                    </div>
                  ) : (
                    <div className="divide-y">
                      {groupedTips[phase]?.map(tip => (
                        <div key={tip.id} className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {SUBPHASE_LABELS[tip.subphase || ''] || tip.subphase || 'N/A'}
                              </Badge>
                              <Badge variant={tip.is_approved ? 'default' : 'secondary'} 
                                     className={tip.is_approved ? 'bg-green-500' : ''}>
                                {tip.is_approved ? '✓ Schválené' : 'Čaká'}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              {editingTip !== tip.id && (
                                <>
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(tip)}>
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  {tip.is_approved ? (
                                    <Button size="sm" variant="outline" onClick={() => handleApprove(tip.id, false)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  ) : (
                                    <Button size="sm" variant="default" className="bg-green-500 hover:bg-green-600" 
                                            onClick={() => handleApprove(tip.id, true)}>
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {editingTip === tip.id ? (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Čo môžem očakávať?</Label>
                                <Textarea
                                  value={editExpectation}
                                  onChange={(e) => setEditExpectation(e.target.value)}
                                  className="mt-1 min-h-[100px]"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Myseľ</Label>
                                <Textarea
                                  value={editMind}
                                  onChange={(e) => setEditMind(e.target.value)}
                                  className="mt-1 min-h-[100px]"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleSaveEdit(tip.id)}>
                                  <Save className="w-4 h-4 mr-2" />Uložiť
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingTip(null)}>
                                  Zrušiť
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground mb-1">Čo môžem očakávať?</p>
                                <p className="whitespace-pre-wrap">{tip.expectation_text || '—'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground mb-1">Myseľ</p>
                                <p className="whitespace-pre-wrap">{tip.mind_text || '—'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Daily Preview Tab */}
          <TabsContent value="daily-preview" className="space-y-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-2" style={{ color: '#955F6A' }}>👁️ Náhľad denného plánu</h3>
              <p className="text-sm" style={{ color: '#955F6A', opacity: 0.9 }}>
                Vyber deň cyklu a uvidíš kompletný výstup všetkých 4 sekcií tak, ako ich uvidí používateľka.
              </p>
            </Card>

            {/* Preview Controls */}
            <Card className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Deň cyklu:</Label>
                  <Button size="sm" variant="outline" onClick={() => setPreviewDay(d => Math.max(1, d - 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Input 
                    type="number" 
                    value={previewDay} 
                    onChange={e => setPreviewDay(Math.max(1, Math.min(previewCycleLength, Number(e.target.value))))}
                    className="w-16 text-center"
                    min={1}
                    max={previewCycleLength}
                  />
                  <Button size="sm" variant="outline" onClick={() => setPreviewDay(d => Math.min(previewCycleLength, d + 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Cyklus:</Label>
                  <select 
                    value={previewCycleLength} 
                    onChange={e => {
                      const newLen = Number(e.target.value);
                      setPreviewCycleLength(newLen);
                      if (previewDay > newLen) setPreviewDay(newLen);
                    }}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {[25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map(len => (
                      <option key={len} value={len}>{len} dní</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="whitespace-nowrap">Menštruácia:</Label>
                  <select 
                    value={previewPeriodLength} 
                    onChange={e => setPreviewPeriodLength(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {[3, 4, 5, 6, 7].map(len => (
                      <option key={len} value={len}>{len} dní</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Phase Info */}
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PHASE_EMOJIS[previewPhaseInfo.phase]}</span>
                <div>
                  <h3 className="font-semibold" style={{ color: '#955F6A' }}>
                    Deň {previewDay}: {PHASE_LABELS[previewPhaseInfo.phase]} fáza
                    {previewPhaseInfo.subphase && ` (${SUBPHASE_LABELS[previewPhaseInfo.subphase]})`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {previewCycleLength}-dňový cyklus, {previewPeriodLength}-dňová menštruácia
                  </p>
                </div>
              </div>
            </Card>

            {/* Preview Content */}
            <div className="grid gap-4">
              {/* Expectation */}
              <Card>
                <CardHeader className="py-3 bg-rose-50">
                  <CardTitle className="text-base flex items-center gap-2">
                    🌸 Čo môžem očakávať?
                    <Badge variant="outline" className="text-xs">z databázy</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap">
                    {previewPhaseTip?.expectation_text || <span className="text-muted-foreground italic">Tip pre túto fázu neexistuje v databáze</span>}
                  </p>
                </CardContent>
              </Card>

              {/* Nutrition */}
              <Card>
                <CardHeader className="py-3 bg-green-50">
                  <CardTitle className="text-base flex items-center gap-2">
                    🥗 Strava
                    <Badge variant="secondary" className="text-xs">generované dynamicky</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap">{previewNutrition || <span className="text-muted-foreground italic">Nebolo možné vygenerovať</span>}</p>
                </CardContent>
              </Card>

              {/* Movement */}
              <Card>
                <CardHeader className="py-3 bg-blue-50">
                  <CardTitle className="text-base flex items-center gap-2">
                    🏃‍♀️ Pohyb
                    <Badge variant="secondary" className="text-xs">generované dynamicky</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap">{previewMovement || <span className="text-muted-foreground italic">Nebolo možné vygenerovať</span>}</p>
                </CardContent>
              </Card>

              {/* Mind */}
              <Card>
                <CardHeader className="py-3 bg-purple-50">
                  <CardTitle className="text-base flex items-center gap-2">
                    🧠 Myseľ
                    <Badge variant="outline" className="text-xs">z databázy</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap">
                    {previewPhaseTip?.mind_text || <span className="text-muted-foreground italic">Tip pre túto fázu neexistuje v databáze</span>}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
