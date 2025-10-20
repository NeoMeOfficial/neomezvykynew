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
  phase: string;
  day_range: string;
  category: string;
  tip_text: string;
  is_approved: boolean;
  created_by: string;
}

const PHASE_LABELS = {
  menstruation: 'Menštruácia',
  follicular: 'Folikulárna',
  ovulation: 'Ovulácia',
  luteal: 'Luteálna'
};

const CATEGORY_LABELS = {
  energy: 'Energia',
  mood: 'Nálada',
  nutrition: 'Výživa',
  activity: 'Aktivita',
  self_care: 'Self-care',
  general: 'Všeobecné'
};

export default function AdminCycleTips() {
  const [tips, setTips] = useState<CycleTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTip, setEditingTip] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [regeneratingPhase, setRegeneratingPhase] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const { data, error } = await supabase
        .from('cycle_tips')
        .select('*')
        .order('phase')
        .order('day_range')
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
    setEditText(tip.tip_text);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cycle_tips')
        .update({ 
          tip_text: editText,
          created_by: 'manual'
        })
        .eq('id', id);

      if (error) throw error;

      setTips(tips.map(t => t.id === id ? { ...t, tip_text: editText, created_by: 'manual' } : t));
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

  const handleRegenerate = async (phase: string, dayRange: string) => {
    setRegeneratingPhase(`${phase}-${dayRange}`);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cycle-tips', {
        body: { phase, dayRange, regenerate: true }
      });

      if (error) throw error;

      toast({
        title: 'Úspech',
        description: `Vygenerované ${data.tips?.length || 0} nových tipov`,
      });

      await loadTips();
    } catch (error) {
      console.error('Error regenerating:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vygenerovať tipy',
        variant: 'destructive'
      });
    } finally {
      setRegeneratingPhase(null);
    }
  };

  const handleBulkGenerate = async () => {
    setBulkGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-generate-tips');

      if (error) throw error;

      toast({
        title: 'Úspech',
        description: `Vygenerované ${data.summary?.totalGenerated || 0} tipov`,
      });

      await loadTips();
    } catch (error) {
      console.error('Error bulk generating:', error);
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vygenerovať tipy',
        variant: 'destructive'
      });
    } finally {
      setBulkGenerating(false);
    }
  };

  // Group tips by phase and day range
  const groupedTips = tips.reduce((acc, tip) => {
    const key = `${tip.phase}-${tip.day_range}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(tip);
    return acc;
  }, {} as Record<string, CycleTip[]>);

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#955F6A' }}>
              Admin - Tipy pre cyklus
            </h1>
            <p className="text-sm mt-1" style={{ color: '#955F6A', opacity: 0.7 }}>
              Schvaľuj, upravuj a generuj AI tipy pre jednotlivé fázy cyklu
            </p>
          </div>
          
          <Button
            onClick={handleBulkGenerate}
            disabled={bulkGenerating}
            className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white"
          >
            {bulkGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generujem...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Vygenerovať všetky AI tipy
              </>
            )}
          </Button>
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

        {/* Tips by Phase and Day */}
        <div className="space-y-6">
          {Object.entries(groupedTips).map(([key, phaseTips]) => {
            const [phase, dayRange] = key.split('-');
            const isRegenerating = regeneratingPhase === key;
            
            return (
              <Card key={key} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold" style={{ color: '#955F6A' }}>
                      {PHASE_LABELS[phase as keyof typeof PHASE_LABELS]} - Deň {dayRange}
                    </h2>
                    <p className="text-sm" style={{ color: '#955F6A', opacity: 0.7 }}>
                      {phaseTips.filter(t => t.is_approved).length} / {phaseTips.length} schválené
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRegenerate(phase, dayRange)}
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
                        Re-generovať AI
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-3">
                  {phaseTips.map((tip) => (
                    <div
                      key={tip.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tip.is_approved
                          ? 'border-green-200 bg-green-50'
                          : 'border-orange-200 bg-orange-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Badge variant="outline" style={{ borderColor: '#FF7782', color: '#955F6A' }}>
                            {CATEGORY_LABELS[tip.category as keyof typeof CATEGORY_LABELS]}
                          </Badge>
                          <Badge variant={tip.created_by === 'ai' ? 'secondary' : 'default'}>
                            {tip.created_by === 'ai' ? 'AI' : 'Manuálne'}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          {tip.is_approved ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReject(tip.id)}
                            >
                              <X className="w-4 h-4 text-orange-600" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApprove(tip.id)}
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {editingTip === tip.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex gap-2 justify-end">
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
                        <div>
                          <p className="text-sm" style={{ color: '#955F6A' }}>
                            {tip.tip_text}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(tip)}
                            className="mt-2 text-xs"
                            style={{ color: '#955F6A' }}
                          >
                            Upraviť
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}

          {Object.keys(groupedTips).length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-lg mb-4" style={{ color: '#955F6A' }}>
                Zatiaľ nie sú vygenerované žiadne tipy
              </p>
              <Button
                onClick={handleBulkGenerate}
                disabled={bulkGenerating}
                className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Vygenerovať prvé tipy
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
