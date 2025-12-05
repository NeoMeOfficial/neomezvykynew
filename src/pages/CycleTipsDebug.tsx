import React, { useState, useMemo } from 'react';
import { generateNutrition, generateMovement } from '@/lib/cycleTipsGenerator';
import { getSubphase, getPhaseRanges } from '@/features/cycle/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CycleTipsDebug() {
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [testDays, setTestDays] = useState<number[]>([]);
  const [showAllDays, setShowAllDays] = useState(true);
  
  const phaseRanges = getPhaseRanges(cycleLength, periodLength);
  
  const getDayOutput = (day: number) => {
    const { phase, subphase } = getSubphase(day, cycleLength, periodLength);
    const nutrition = generateNutrition(day, phase, subphase);
    const movement = generateMovement(day, phase, subphase, phaseRanges);
    
    return { phase, subphase, nutrition, movement };
  };

  // Analyze food frequency across all days
  const foodAnalysis = useMemo(() => {
    const foodCount: Record<string, number[]> = {};
    const nutrientCount: Record<string, number> = {};
    
    for (let day = 1; day <= cycleLength; day++) {
      const { phase, subphase } = getSubphase(day, cycleLength, periodLength);
      const nutrition = generateNutrition(day, phase, subphase);
      
      // Extract foods from "Nájdeš ich v potravinách ako X, Y, Z."
      const foodMatch = nutrition.match(/potravinách ako ([^.]+)\./);
      if (foodMatch) {
        const foods = foodMatch[1].split(', ').map(f => f.trim());
        foods.forEach(food => {
          if (!foodCount[food]) foodCount[food] = [];
          foodCount[food].push(day);
        });
      }
      
      // Extract nutrients from "potrebuje X, Y, Z —"
      const nutrientMatch = nutrition.match(/potrebuje ([^—]+)—/);
      if (nutrientMatch) {
        const nutrients = nutrientMatch[1].split(', ').map(n => n.trim());
        nutrients.forEach(nutrient => {
          nutrientCount[nutrient] = (nutrientCount[nutrient] || 0) + 1;
        });
      }
    }
    
    // Sort by frequency
    const sortedFoods = Object.entries(foodCount)
      .map(([food, days]) => ({ food, count: days.length, days }))
      .sort((a, b) => b.count - a.count);
    
    const sortedNutrients = Object.entries(nutrientCount)
      .map(([nutrient, count]) => ({ nutrient, count }))
      .sort((a, b) => b.count - a.count);
    
    return { foods: sortedFoods, nutrients: sortedNutrients, totalFoods: sortedFoods.length };
  }, [cycleLength, periodLength]);

  const daysToShow = showAllDays 
    ? Array.from({ length: cycleLength }, (_, i) => i + 1)
    : testDays;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-rose-800">Cycle Tips Debug</h1>
        
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nastavenia cyklu</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 items-end">
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
            <Button 
              variant={showAllDays ? "default" : "outline"}
              onClick={() => setShowAllDays(!showAllDays)}
            >
              {showAllDays ? "Zobraziť všetky dni" : "Zobraziť vybrané dni"}
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">📊 Analýza rotácie</TabsTrigger>
            <TabsTrigger value="foods">🥗 Potraviny ({foodAnalysis.totalFoods})</TabsTrigger>
            <TabsTrigger value="days">📅 Dni ({daysToShow.length})</TabsTrigger>
          </TabsList>

          {/* Food Rotation Analysis */}
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Štatistiky rotácie potravín</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-700">{foodAnalysis.totalFoods}</div>
                    <div className="text-sm text-green-600">Unikátnych potravín</div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-700">
                      {foodAnalysis.foods.filter(f => f.count === 1).length}
                    </div>
                    <div className="text-sm text-blue-600">Potravín len 1x</div>
                  </div>
                  <div className="bg-amber-100 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-amber-700">
                      {foodAnalysis.foods.filter(f => f.count >= 5).length}
                    </div>
                    <div className="text-sm text-amber-600">Potravín 5x a viac</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Najčastejšie potraviny (TOP 15):</h4>
                  <div className="space-y-2">
                    {foodAnalysis.foods.slice(0, 15).map(({ food, count, days }) => (
                      <div key={food} className="flex items-center gap-2">
                        <div 
                          className={`w-20 text-right font-mono text-sm ${
                            count >= 7 ? 'text-red-600 font-bold' : 
                            count >= 5 ? 'text-amber-600' : 
                            'text-gray-600'
                          }`}
                        >
                          {count}x
                        </div>
                        <div 
                          className="flex-1 h-6 rounded"
                          style={{ 
                            background: `linear-gradient(90deg, ${
                              count >= 7 ? '#fca5a5' : count >= 5 ? '#fcd34d' : '#86efac'
                            } ${(count / cycleLength) * 100}%, #f3f4f6 ${(count / cycleLength) * 100}%)`
                          }}
                        />
                        <div className="w-40 text-sm truncate">{food}</div>
                        <div className="text-xs text-gray-400">
                          dni: {days.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Najčastejšie živiny:</h4>
                  <div className="flex flex-wrap gap-2">
                    {foodAnalysis.nutrients.map(({ nutrient, count }) => (
                      <span 
                        key={nutrient}
                        className={`px-3 py-1 rounded-full text-sm ${
                          count >= 10 ? 'bg-rose-200 text-rose-800' :
                          count >= 5 ? 'bg-amber-200 text-amber-800' :
                          'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {nutrient} ({count}x)
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Foods List */}
          <TabsContent value="foods">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Všetky použité potraviny</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                  {foodAnalysis.foods.map(({ food, count }) => (
                    <div 
                      key={food}
                      className={`p-2 rounded ${
                        count >= 7 ? 'bg-red-100 text-red-800' :
                        count >= 5 ? 'bg-amber-100 text-amber-800' :
                        count >= 3 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{food}</span>
                      <span className="text-xs ml-1 opacity-70">({count}x)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Days View */}
          <TabsContent value="days" className="space-y-4">
            {/* Day selector */}
            {!showAllDays && (
              <Card>
                <CardContent className="pt-4">
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
                </CardContent>
              </Card>
            )}

            {/* Days output */}
            <div className="grid gap-4">
              {daysToShow.map(day => {
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
                      <div>
                        <h4 className="font-semibold text-rose-700 mb-2">🍽️ Strava:</h4>
                        <div className="bg-rose-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                          {output.nutrition}
                        </div>
                      </div>
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
          </TabsContent>
        </Tabs>
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
