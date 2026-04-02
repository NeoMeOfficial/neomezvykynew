import React, { useState, useMemo } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';
import { ArrowLeft, Calculator, TestTube2, CheckCircle2, AlertCircle } from 'lucide-react';
import GlassCard from '../GlassCard';
import { getCurrentCycleDay, getPhaseByDay, getPhaseRanges } from '../../../features/cycle/utils';
import { colors } from '../../../theme/warmDusk';

interface TestScenario {
  name: string;
  lastPeriodStart: Date;
  cycleLength: number;
  periodLength: number;
  expectedPhase?: string;
  description: string;
}

const PeriodkaTestingConsole: React.FC = () => {
  const today = new Date();
  
  // Current test inputs
  const [testDate, setTestDate] = useState(subDays(today, 10));
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  // Calculate results based on current inputs
  const testResults = useMemo(() => {
    const currentDay = getCurrentCycleDay(format(testDate, 'yyyy-MM-dd'), today);
    const phaseRanges = getPhaseRanges(cycleLength, periodLength);
    const currentPhase = getPhaseByDay(currentDay, phaseRanges, cycleLength);
    
    // Determine status based on phase
    let status = '';
    let statusColor = '';
    let statusIcon = <CheckCircle2 className="w-4 h-4" />;
    
    if (currentDay <= periodLength) {
      // During menstruation: show "Menštruácia deň X z Y"
      status = `Menštruácia deň ${currentDay} z ${periodLength}`;
      statusColor = colors.periodka;
    } else if (currentDay > cycleLength) {
      // Period is late
      const daysLate = currentDay - cycleLength;
      status = `Menštruácia mešká - ${daysLate} ${daysLate === 1 ? 'deň' : 'dni'} po termíne`;
      statusColor = '#EF4444';
      statusIcon = <AlertCircle className="w-4 h-4" />;
    } else {
      // Normal cycle phases: show "Phase deň X z cycleLength"
      const phaseKey = currentPhase.key;
      switch (phaseKey) {
        case 'follicular':
          status = `Folikulárna fáza deň ${currentDay} z ${cycleLength}`;
          statusColor = '#7A9E78';
          break;
        case 'ovulation':
          status = `Ovulácia deň ${currentDay} z ${cycleLength}`;
          statusColor = '#8B5FBF';
          break;
        case 'luteal':
          if (currentDay >= cycleLength - 2) {
            const daysUntil = cycleLength - currentDay + 1;
            status = `Menštruácia čoskoro - za ${daysUntil} ${daysUntil === 1 ? 'deň' : 'dni'}`;
            statusColor = '#F59E0B';
          } else {
            status = `Luteálna fáza deň ${currentDay} z ${cycleLength}`;
            statusColor = '#B8864A';
          }
          break;
        default:
          status = `${currentPhase.name} deň ${currentDay} z ${cycleLength}`;
          statusColor = '#8B5FBF';
      }
    }

    return {
      currentDay,
      currentPhase,
      status,
      statusColor,
      statusIcon,
      phaseRanges
    };
  }, [testDate, cycleLength, periodLength, today]);

  // Predefined test scenarios
  const testScenarios: TestScenario[] = [
    {
      name: 'Začiatok menštruácie',
      lastPeriodStart: today,
      cycleLength: 28,
      periodLength: 5,
      expectedPhase: 'Menštruácia',
      description: 'Očakávaný výsledok: "Menštruácia deň 1 z 5"'
    },
    {
      name: 'Stred menštruácie',
      lastPeriodStart: subDays(today, 3),
      cycleLength: 28,
      periodLength: 5,
      expectedPhase: 'Menštruácia',
      description: 'Očakávaný výsledok: "Menštruácia deň 4 z 5"'
    },
    {
      name: 'Folikulárna fáza',
      lastPeriodStart: subDays(today, 10),
      cycleLength: 28,
      periodLength: 5,
      expectedPhase: 'Folikulárna',
      description: 'Očakávaný výsledok: "Folikulárna fáza deň 11 z 28"'
    },
    {
      name: 'Ovulácia',
      lastPeriodStart: subDays(today, 13),
      cycleLength: 28,
      periodLength: 5,
      expectedPhase: 'Ovulácia',
      description: 'Očakávaný výsledok: "Ovulácia deň 14 z 28"'
    },
    {
      name: 'Luteálna fáza',
      lastPeriodStart: subDays(today, 20),
      cycleLength: 28,
      periodLength: 5,
      expectedPhase: 'Luteálna',
      description: 'Očakávaný výsledok: "Luteálna fáza deň 21 z 28"'
    },
    {
      name: 'Blíži sa menštruácia',
      lastPeriodStart: subDays(today, 26),
      cycleLength: 28,
      periodLength: 5,
      expectedPhase: 'Luteálna',
      description: 'Očakávaný výsledok: "Menštruácia čoskoro - za 2 dni"'
    },
    {
      name: 'Menštruácia mešká',
      lastPeriodStart: subDays(today, 32),
      cycleLength: 28,
      periodLength: 5,
      expectedPhase: 'Luteálna',
      description: 'Očakávaný výsledok: "Menštruácia mešká - 5 dní po termíne"'
    },
    {
      name: 'Krátky cyklus (21 dní)',
      lastPeriodStart: subDays(today, 10),
      cycleLength: 21,
      periodLength: 4,
      expectedPhase: 'Luteálna',
      description: 'Očakávaný výsledok: "Luteálna fáza deň 11 z 21"'
    },
    {
      name: 'Dlhý cyklus (35 dní)',
      lastPeriodStart: subDays(today, 25),
      cycleLength: 35,
      periodLength: 6,
      expectedPhase: 'Luteálna',
      description: 'Očakávaný výsledok: "Luteálna fáza deň 26 z 35"'
    },
    {
      name: 'Dlhá menštruácia (8 dní)',
      lastPeriodStart: subDays(today, 6),
      cycleLength: 30,
      periodLength: 8,
      expectedPhase: 'Menštruácia',
      description: 'Očakávaný výsledok: "Menštruácia deň 7 z 8"'
    }
  ];

  const applyScenario = (scenario: TestScenario) => {
    setTestDate(scenario.lastPeriodStart);
    setCycleLength(scenario.cycleLength);
    setPeriodLength(scenario.periodLength);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
          <TestTube2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Testing Konzola</h1>
          <p className="text-gray-600">Testovanie výpočtov fáz menštruačného cyklu</p>
        </div>
      </div>

      {/* Current Test Inputs */}
      <GlassCard>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Vstupné Parametre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Last Period Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posledná menštruácia
              </label>
              <input
                type="date"
                value={format(testDate, 'yyyy-MM-dd')}
                onChange={(e) => setTestDate(new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {format(testDate, 'd. MMMM yyyy', { locale: sk })}
              </p>
            </div>

            {/* Cycle Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dĺžka cyklu: {cycleLength} dní
              </label>
              <input
                type="range"
                min="21"
                max="35"
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>21 dní</span>
                <span>35 dní</span>
              </div>
            </div>

            {/* Period Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dĺžka krvácania: {periodLength} dní
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={periodLength}
                onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3 dni</span>
                <span>10 dní</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Test Results */}
      <GlassCard>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Výsledky Výpočtu</h2>
          
          <div className="space-y-4">
            {/* Current Status */}
            <div 
              className="p-4 rounded-lg border-l-4"
              style={{ 
                borderLeftColor: testResults.statusColor,
                backgroundColor: `${testResults.statusColor}15`
              }}
            >
              <div className="flex items-center gap-2">
                <div style={{ color: testResults.statusColor }}>
                  {testResults.statusIcon}
                </div>
                <p className="font-semibold" style={{ color: testResults.statusColor }}>
                  {testResults.status}
                </p>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Aktuálny deň</p>
                <p className="text-lg font-bold">{testResults.currentDay}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Aktuálna fáza</p>
                <p className="text-lg font-bold">{testResults.currentPhase.name}</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Dĺžka cyklu</p>
                <p className="text-lg font-bold">{cycleLength} dní</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Dĺžka menštruácie</p>
                <p className="text-lg font-bold">{periodLength} dní</p>
              </div>
            </div>

            {/* Phase Ranges */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Rozdelenie fáz v cykle:</p>
              <div className="flex flex-wrap gap-2">
                {testResults.phaseRanges.map((phase) => (
                  <div
                    key={phase.key}
                    className={`px-3 py-1 rounded-full text-sm ${
                      phase.key === testResults.currentPhase.key
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {phase.name}: dni {phase.start}-{phase.end}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Quick Test Scenarios */}
      <GlassCard>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Rýchle Testovacie Scenáre</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {testScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => applyScenario(scenario)}
                className="p-3 text-left bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
              >
                <p className="font-medium text-sm">{scenario.name}</p>
                <p className="text-xs text-gray-500 mt-1">{scenario.description}</p>
                <div className="text-xs text-gray-400 mt-1">
                  Cyklus: {scenario.cycleLength}d • Menštruácia: {scenario.periodLength}d
                </div>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default PeriodkaTestingConsole;