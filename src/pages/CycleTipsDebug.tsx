import React, { useState } from 'react';
import { generateNutrition, generateMovement } from '@/lib/cycleTipsGenerator';
import { getSubphase, getPhaseRanges } from '@/features/cycle/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CycleTipsDebug() {
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [testDays, setTestDays] = useState([1, 10, 14, 25]);
  
  const phaseRanges = getPhaseRanges(cycleLength, periodLength);
  
  const getDayOutput = (day: number) => {
    const { phase, subphase } = getSubphase(day, cycleLength, periodLength);
    const nutrition = generateNutrition(day, phase, subphase);
    const movement = generateMovement(day, phase, subphase, phaseRanges);
    
    return { phase, subphase, nutrition, movement };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-rose-800">Cycle Tips Debug</h1>
        
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nastavenia cyklu</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div>
              <Label>Dĺžka cyklu</Label>
              <Input 
                type="number" 
                value={cycleLength} 
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-24"
              />
            </div>
            <div>
              <Label>Dĺžka periódy</Label>
              <Input 
                type="number" 
                value={periodLength} 
                onChange={(e) => setPeriodLength(Number(e.target.value))}
                className="w-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Days Output */}
        <div className="space-y-6">
          {testDays.map(day => {
            const output = getDayOutput(day);
            return (
              <Card key={day} className="border-l-4" style={{ borderLeftColor: getPhaseColor(output.phase) }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-bold">
                      Deň {day}
                    </span>
                    <span className="text-rose-600">
                      {output.phase} {output.subphase ? `(${output.subphase})` : ''}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Strava */}
                  <div>
                    <h4 className="font-semibold text-rose-700 mb-2">🍽️ Strava:</h4>
                    <div className="bg-rose-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                      {output.nutrition}
                    </div>
                  </div>
                  
                  {/* Pohyb */}
                  <div>
                    <h4 className="font-semibold text-rose-700 mb-2">🏃 Pohyb:</h4>
                    <div className="bg-rose-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                      {output.movement}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick test all days button */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Všetky dni cyklu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from({ length: cycleLength }, (_, i) => i + 1).map(day => {
                const { phase } = getSubphase(day, cycleLength, periodLength);
                return (
                  <Button
                    key={day}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10"
                    style={{ 
                      backgroundColor: testDays.includes(day) ? getPhaseColor(phase) : 'transparent',
                      color: testDays.includes(day) ? 'white' : getPhaseColor(phase),
                      borderColor: getPhaseColor(phase)
                    }}
                    onClick={() => {
                      if (testDays.includes(day)) {
                        setTestDays(testDays.filter(d => d !== day));
                      } else {
                        setTestDays([...testDays, day].sort((a, b) => a - b));
                      }
                    }}
                  >
                    {day}
                  </Button>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              Klikni na dni, ktoré chceš zobraziť/skryť
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getPhaseColor(phase: string): string {
  switch (phase) {
    case 'menstrual': return '#ef4444';
    case 'follicular': return '#f97316';
    case 'ovulation': return '#22c55e';
    case 'luteal': return '#8b5cf6';
    default: return '#6b7280';
  }
}
