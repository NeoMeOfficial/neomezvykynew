import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check, X, RefreshCw, Sparkles, Loader2 } from 'lucide-react';

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
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
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
