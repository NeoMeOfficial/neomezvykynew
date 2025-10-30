import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhaseRange } from './types';
import { useCycleTips } from '@/hooks/useCycleTips';
import { FadingWordsLoader } from '@/components/FadingWordsLoader';
import { getPhaseColor } from './suggestions';

interface DailyPlanViewProps {
  currentDay: number;
  currentPhase: PhaseRange;
}

export function DailyPlanView({ currentDay, currentPhase }: DailyPlanViewProps) {
  const { data: tips, isLoading } = useCycleTips(currentDay, currentPhase.key);
  
  // Helper function to parse bullet points from text
  const parseBulletPoints = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => line.replace(/^-\s*/, '').trim());
  };
  
  if (isLoading) {
    return (
      <div className="py-16">
        <FadingWordsLoader />
      </div>
    );
  }

  if (!tips || (!tips.expectation && !tips.nutrition && !tips.mind && !tips.movement)) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Denný plán pre tento deň nie je ešte dostupný.</p>
        <p className="text-sm mt-2">Pracujeme na jeho vytvorení.</p>
      </div>
    );
  }

  const phaseColor = getPhaseColor(currentPhase.key);

  return (
    <div className="space-y-6">
      {/* Sekcia 1: Čo môžem dnes očakávať? */}
      {tips.expectation && (
        <Card 
          className="border-2 transition-all hover:shadow-lg"
          style={{ borderColor: phaseColor }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="text-3xl">🌸</span>
              <span>Čo môžem dnes očakávať?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed text-foreground/90">
              {tips.expectation}
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Sekcia 2: Ako sa cítiť lepšie? */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <span className="text-3xl">✨</span>
          Ako sa cítiť lepšie?
        </h2>
        
        {/* Strava */}
        {tips.nutrition && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="text-2xl">🍽️</span>
                <span>Strava</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 leading-relaxed text-foreground/90 list-none">
                {parseBulletPoints(tips.nutrition).map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Pohyb */}
        {tips.movement && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="text-2xl">🏃‍♀️</span>
                <span>Pohyb</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 leading-relaxed text-foreground/90 list-none">
                {parseBulletPoints(tips.movement).map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-rose-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Myseľ */}
        {tips.mind && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="text-2xl">🧠</span>
                <span>Myseľ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-3 leading-relaxed text-foreground/90">
                {tips.mind.split('\n\n').map((para, i) => {
                  const isLastPara = i === tips.mind.split('\n\n').length - 1;
                  return (
                    <p 
                      key={i} 
                      className={isLastPara ? 'italic font-medium text-primary' : ''}
                    >
                      {para}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}