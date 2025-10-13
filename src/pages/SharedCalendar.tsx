import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CalendarView } from "@/features/cycle/CalendarView";
import { useSupabaseCycleData } from "@/features/cycle/useSupabaseCycleData";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Calendar } from "lucide-react";

export default function SharedCalendar() {
  const { shareCode } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const [ownerAccessCode, setOwnerAccessCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { cycleData, derivedState } = useSupabaseCycleData(ownerAccessCode || undefined);

  useEffect(() => {
    const validateShareCode = async () => {
      if (!shareCode) {
        setError("Neplatný zdieľací odkaz");
        setLoading(false);
        return;
      }

      try {
        // Ensure we have an anonymous session for accessing public data
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          await supabase.auth.signInAnonymously();
        }

        // Validate the share code
        const { data, error: fetchError } = await supabase
          .from('shared_access_codes')
          .select('*')
          .eq('code', shareCode.toUpperCase())
          .eq('is_active', true)
          .maybeSingle();

        if (fetchError || !data) {
          setError("Zdieľací kód nebol najdený alebo vypršal");
          setLoading(false);
          return;
        }

        // Check expiration
        if (new Date(data.expires_at) < new Date()) {
          setError("Tento zdieľací odkaz už vypršal");
          setLoading(false);
          return;
        }

        // Update view count
        await supabase
          .from('shared_access_codes')
          .update({ 
            view_count: data.view_count + 1,
            last_viewed_at: new Date().toISOString()
          })
          .eq('id', data.id);

        setOwnerAccessCode(data.owner_access_code);
        setLoading(false);
      } catch (err) {
        console.error('Error validating share code:', err);
        setError("Chyba pri overovaní zdieľacieho kódu");
        setLoading(false);
      }
    };

    validateShareCode();
  }, [shareCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg">Načítava sa kalendár...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full">
          <Alert variant="destructive">
            <AlertDescription className="text-center">
              {error}
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Zdieľaný kalendárny prehľad</h1>
          </div>
          
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Prezeranie v režime iba na čítanie
            </AlertDescription>
          </Alert>
        </div>

        <CalendarView
          cycleData={cycleData}
          derivedState={derivedState}
          readOnly={true}
        />
      </div>
    </div>
  );
}
