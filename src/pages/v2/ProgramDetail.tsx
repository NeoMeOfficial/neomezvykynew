import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Calendar, ChevronDown, ChevronUp, AlertTriangle, RotateCcw, Video } from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import { colors } from '../../theme/warmDusk';

interface Exercise {
  id: string;
  name: string;
  duration: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'core';
  videoUrl: string;
  thumbnail: string;
  description: string;
  hasDemo?: boolean;
  instructions?: string[];
  tips?: string[];
}

interface WeekPlan {
  week: number;
  title: string;
  exercises: Exercise[];
}

interface ProgramData {
  id: string;
  name: string;
  description: string;
  totalWeeks: number;
  currentWeek: number;
  currentDay: number;
  startDate: string;
  isPaused: boolean;
  weekPlans: WeekPlan[];
}

// Mock program data - Full program details for landing/sales pages
const programData: Record<string, ProgramData> = {
  'postpartum': {
    id: 'postpartum',
    name: 'Postpartum',
    description: 'Program je vhodný pre ženy, ktoré potrebujú spevniť brušný korzet, vyriešiť diastázu či inkontinenciu, mesiace aj roky po pôrode.',
    totalWeeks: 8,
    currentWeek: 1,
    currentDay: 1,
    startDate: '2026-02-27',
    isPaused: false,
    weekPlans: [
      {
        week: 1,
        title: 'Týždeň 1: Základy a obnova',
        exercises: [
          { 
            id: 'p1-1', 
            name: 'Dychové cvičenia a core aktivácia', 
            duration: '10 min', 
            type: 'core', 
            videoUrl: 'https://www.youtube.com/watch?v=VQiGJRBkkSQ&t=66s', 
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', 
            description: 'Základné dychové techniky pre aktiváciu hlbokého stabilizačného systému',
            hasDemo: true,
            instructions: [
              'Ľahni si na chrbát, nohy zohnú v kolenách',
              'Polož jednu ruku na hruď, druhú na brucho',
              'Nádych cez nos, břicho sa zdvíha',
              'Výdych cez ústa, břicho sa spúšťa',
              'Opakuj 8-10 krát pomaly'
            ],
            tips: [
              'Sústreď sa na pomalý a kontrolovaný dych',
              'Hruď by sa nemala výrazne dvíhať',
              'Pri bolesti prestaň a poraď sa s trénerom'
            ]
          },
          { 
            id: 'p1-2', 
            name: 'Aktivácia panvového dna', 
            duration: '8 min', 
            type: 'core', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', 
            description: 'Jemná aktivácia a posilnenie panvového dna',
            instructions: [
              'Sadni si pohodlne s rovnými chrbtom',
              'Predstav si, že dvíhaš výťah vo svojom panve',
              'Na výdychu jemne napni svaly panvového dna',
              'Na nádychu svaly uvoľni',
              'Opakuj 10-15 krát'
            ],
            tips: [
              'Neprehraj silu, pohyb má byť jemný',
              'Nepridržuj dych počas cvičenia',
              'Ak nevieš aktivovať svaly, skús si predstaviť, že zastavuješ močenie'
            ]
          },
          { 
            id: 'p1-3', 
            name: 'Jemný strečing a mobilita', 
            duration: '12 min', 
            type: 'flexibility', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', 
            description: 'Uvoľnenie napätých svalov',
            instructions: [
              'Začni s krúžením hlavy do oboch strán',
              'Pokračuj s krúžením ramien',
              'Jemne sa natiahni do strán',
              'Urob mačacie vystretie',
              'Skončí s detskou pozíciou'
            ],
            tips: [
              'Všetky pohyby vykonávaj pomaly',
              'Nedržíš polohy príliš dlho',
              'Počúvaj svoje telo a nejdi do bolesti'
            ]
          },
        ]
      },
      {
        week: 2,
        title: 'Týždeň 2: Pokročilé základy',
        exercises: [
          { 
            id: 'p2-1', 
            name: 'Silový tréning - horná časť', 
            duration: '15 min', 
            type: 'strength', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', 
            description: 'Posilnenie rúk, ramien a hornej časti tela',
            instructions: [
              'Začni s rozohratím ramien 2 minúty',
              'Pushup z kolien 3 série po 8 opakovaní',
              'Tricepsové kliky z lavičky 3x6',
              'Plank 3x30 sekúnd',
              'Cool down stretching 3 minúty'
            ],
            tips: [
              'Ak si začiatočník, rób cviky z kolien',
              'Udržuj správnu techniku pred počtom opakovaní',
              'Medzi sériami si odpočiň 30-60 sekúnd'
            ]
          },
          { 
            id: 'p2-2', 
            name: 'Core stability pokročilé', 
            duration: '12 min', 
            type: 'core', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', 
            description: 'Pokročilé cviky pre stabilitu jadra tela',
            instructions: [
              'Dead bug 3 série po 6 na každú stranu',
              'Bird dog 3x6 na každú stranu',
              'Modified plank s dvíhaním končatín',
              'Wall sit s aktiváciou core',
              'Záverečné uvoľnenie'
            ],
            tips: [
              'Kvalita pred kvantitou',
              'Udržuj neutrálny chrbát',
              'Aktivuj hlboký stabilizačný systém'
            ]
          },
          { 
            id: 'p2-3', 
            name: 'Funkčné cvičenia', 
            duration: '10 min', 
            type: 'strength', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', 
            description: 'Každodenné pohyby a funkčná sila',
            instructions: [
              'Squats z stoličky 3x8',
              'Lunges s podporou 3x5 na každú nohu',
              'Step-ups na nízky schod 3x6',
              'Funkčné výpony na špičky',
              'Strečing nohákov'
            ],
            tips: [
              'Používaj podporu pri rovnováhe',
              'Neponáhľaj sa, ide o kontrolu',
              'Počúvaj signály svojho tela'
            ]
          },
        ]
      },
    ]
  },
  'bodyforming': {
    id: 'bodyforming',
    name: 'BodyForming', 
    description: 'Program je vhodný pre ženy, ktoré začínajú so spevňovaním celého tela a netrpia diastázou.',
    totalWeeks: 6,
    currentWeek: 1,
    currentDay: 1,
    startDate: '2026-02-27',
    isPaused: false,
    weekPlans: [
      {
        week: 1,
        title: 'Týždeň 1: Základy posilňovania',
        exercises: [
          { 
            id: 'b1-1', 
            name: 'Celotělové rozhriatie', 
            duration: '8 min', 
            type: 'cardio', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop', 
            description: 'Príprava tela na tréning a aktivácia svalov',
            instructions: [
              'Začni krokom na mieste 2 minúty',
              'Krúženie ramien dopredu a dozadu',
              'Výpady s rotáciou trupu',
              'Drep s natiahnutím rúk nad hlavu',
              'Dokončí jemným strečingom'
            ],
            tips: [
              'Rozcvička je kľúčová pre predchádzanie zranení',
              'Postupne zvyšuj intenzitu',
              'Nezabúdaj na správne dýchanie'
            ]
          },
          { 
            id: 'b1-2', 
            name: 'Posilnenie dolnej časti tela', 
            duration: '15 min', 
            type: 'strength', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop', 
            description: 'Základné cviky pre formovanie zadku a stehien s vlastnou váhou',
            instructions: [
              'Drepov s vlastnou váhou 3x12',
              'Výpadov striedavo 3x10 na nohu',
              'Zdvíhanie panvy vľaku 3x15',
              'Stranové výpady 2x8 na stranu',
              'Wall sit 3x30 sekúnd'
            ],
            tips: [
              'Sústreď sa na správnu techniku',
              'Kolená by nemali presahovať špičky chodidiel',
              'Medzi sériami odpočiň 45-60 sekúnd'
            ]
          },
          { 
            id: 'b1-3', 
            name: 'Core a brušné svaly', 
            duration: '12 min', 
            type: 'core', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop', 
            description: 'Posilnenie brušných svalov a core stability',
            instructions: [
              'Plank 3x30 sekúnd',
              'Dead bug 3x8 na stranu',
              'Modified bicycle crunches 3x12',
              'Side plank 2x20 sekúnd na stranu',
              'Bird dog 3x6 na stranu'
            ],
            tips: [
              'Kvalita pred kvantitou',
              'Aktivuj hlboké brušné svaly',
              'Nepridržuj dych počas cvičenia'
            ]
          },
        ]
      },
    ]
  },
  'elastic-bands': {
    id: 'elastic-bands',
    name: 'ElasticBands',
    description: 'Program je vhodný pre ženy, ktoré chcú vyformovať postavu a zvýšiť intenzitu cvičenia s použitím dynamického odporu elastických gúm.',
    totalWeeks: 6,
    currentWeek: 1,
    currentDay: 1,
    startDate: '2026-02-10',
    isPaused: false,
    weekPlans: [
      {
        week: 1,
        title: 'Týždeň 1: Úvod do elastických gúm',
        exercises: [
          { 
            id: 'e1-1', 
            name: 'Rozcvička s gumami', 
            duration: '10 min', 
            type: 'cardio', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', 
            description: 'Dynamické rozhriatie s použitím ľahkého odporu gúm',
            instructions: [
              'Začni s ľahkou gumou okolo zápästí',
              'Krúženie ramien s odporom 10x',
              'Laterálne zdvíhanie rúk 15x',
              'Gumy okolo stehien - bočné kroky 2x10',
              'Aktivácia core s gumou 8x'
            ],
            tips: [
              'Začni vždy s najľahšou gumou',
              'Pohyby vykonávaj kontrolovane',
              'Guma má byť pod napätím počas celého pohybu'
            ]
          },
          { 
            id: 'e1-2', 
            name: 'Horná časť tela s odporom', 
            duration: '15 min', 
            type: 'strength', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', 
            description: 'Formovanie ramien, rúk a chrbta pomocou elastických gúm',
            instructions: [
              'Rows s gumou (ťahanie k hrudi) 3x12',
              'Chest press s gumou 3x10',
              'Lateral raises 3x12',
              'Biceps curls 3x15',
              'Triceps extensions 3x10'
            ],
            tips: [
              'Guma musí byť správne zakotvená',
              'Udržuj napätie v gume počas celého pohybu',
              'Kontroluj návratný pohyb'
            ]
          },
          { 
            id: 'e1-3', 
            name: 'Dolná časť s dynamickým odporom', 
            duration: '10 min', 
            type: 'strength', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', 
            description: 'Intenzívne formovanie zadku a stehien s gumami',
            instructions: [
              'Squaty s gumou okolo stehien 3x15',
              'Bočné kroky s gumou 3x12 na stranu',
              'Glute bridges s gumou 3x15',
              'Clamshells s gumou 2x12 na stranu',
              'Monster walks 2x10 krokov'
            ],
            tips: [
              'Guma má byť pod napätím aj v spodnej pozícii',
              'Kolená tlač smerom von proti odporu',
              'Aktivuj gluteálne svaly počas každého pohybu'
            ]
          },
        ]
      },
    ]
  },
  'strong-sexy': {
    id: 'strong-sexy',
    name: 'Strong&Sexy',
    description: 'Program je vhodný pre ženy, ktoré chcú posunúť svoje hranice, získať silnejšie a vyformovanejšie telo a začať cvičiť s jednoručkami.',
    totalWeeks: 6,
    currentWeek: 1,
    currentDay: 1,
    startDate: '2026-02-15',
    isPaused: false,
    weekPlans: [
      {
        week: 1,
        title: 'Týždeň 1: Sila a formovanie',
        exercises: [
          { 
            id: 's1-1', 
            name: 'Power warm-up s jednoručkami', 
            duration: '12 min', 
            type: 'cardio', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop', 
            description: 'Dynamické rozcvičenie s ľahkými jednoručkami',
            instructions: [
              'Arm circles s 1-2kg jednoručkami 2x10',
              'Shoulder shrugs s jednoručkami 15x',
              'Walking lunges s jednoručkami 2x8',
              'Overhead press s ľahkými váhami 10x',
              'Deadlifts s jednoručkami pre rozcvičku 8x'
            ],
            tips: [
              'Začni s ľahšími váhami pre rozcvičku',
              'Sústreď sa na aktiváciu celého tela',
              'Priprav kĺby na záťaž s váhami'
            ]
          },
          { 
            id: 's1-2', 
            name: 'Zložené pohyby s jednoručkami', 
            duration: '20 min', 
            type: 'strength', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop', 
            description: 'Hlavné silové cviky s jednoručkami pre celé telo',
            instructions: [
              'Goblet squats s jednoručkou 4x12',
              'Dumbbell rows 4x10 na ruku',
              'Romanian deadlifts 4x10',
              'Overhead press 3x8',
              'Reverse lunges s jednoručkami 3x10 na nohu'
            ],
            tips: [
              'Vyber váhy, s ktorými dokončíš poslednú sériu správne',
              'Medzi sériami odpočiň 60-90 sekúnd',
              'Kontroluj pohyb dole aj hore'
            ]
          },
          { 
            id: 's1-3', 
            name: 'Sexy sculpting finisher', 
            duration: '13 min', 
            type: 'strength', 
            videoUrl: '', 
            thumbnail: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop', 
            description: 'Cielené formovanie pre sexy krivky a definíciu',
            instructions: [
              'Single arm chest press vľaku 3x8 na ruku',
              'Glute bridges s jednoručkou 3x15',
              'Lateral raises super-slow 3x8',
              'Bulgarian split squats s jednoručkou 2x8 na nohu',
              'Plank to downward dog 2x8'
            ],
            tips: [
              'Sústreď sa na kvalitu pohybu',
              'Pomalé tempo pre maximálne napätie',
              'Cíť svaly, na ktoré sa zameriavame'
            ]
          },
        ]
      },
    ]
  }
};

export default function ProgramDetail() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const [program, setProgram] = useState<ProgramData | null>(null);
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  useEffect(() => {
    if (programId && programData[programId]) {
      const prog = programData[programId];
      setProgram(prog);
      setOpenWeek(prog.currentWeek); // Open current week by default
    }
  }, [programId]);

  if (!program) {
    return (
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/kniznica/telo/programy')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl font-semibold text-[#2E2218]">Program nenájdený</h1>
      </div>
    );
  }

  const todaysExercise = program.weekPlans
    .find(w => w.week === program.currentWeek)?.exercises[program.currentDay - 1];

  const handlePauseProgram = () => {
    // In real app, this would call webhook to Active Campaign
    console.log('Pausing program:', program.id);
    
    // Mock: Call webhook
    fetch('/api/webhook/pause-program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        programId: program.id,
        userId: 'current-user-id', // Replace with actual user ID
        action: 'pause'
      })
    }).then(() => {
      setProgram(prev => prev ? { ...prev, isPaused: true } : null);
      setShowPauseConfirm(false);
      alert('Program pozastavený. Active Campaign bola upovedomená.');
    }).catch(() => {
      alert('Program pozastavený lokálne. (Webhook nedostupný)');
      setProgram(prev => prev ? { ...prev, isPaused: true } : null);
      setShowPauseConfirm(false);
    });
  };

  const handleRestartProgram = () => {
    // In real app, this would call webhook to Active Campaign
    console.log('Restarting program:', program.id);
    
    // Mock: Call webhook
    fetch('/api/webhook/restart-program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        programId: program.id,
        userId: 'current-user-id', // Replace with actual user ID
        action: 'restart'
      })
    }).then(() => {
      setProgram(prev => prev ? { ...prev, isPaused: false, currentWeek: 1, currentDay: 1 } : null);
      setShowRestartConfirm(false);
      alert('Program restartovaný. Active Campaign bola upovedomená.');
    }).catch(() => {
      alert('Program restartovaný lokálne. (Webhook nedostupný)');
      setProgram(prev => prev ? { ...prev, isPaused: false, currentWeek: 1, currentDay: 1 } : null);
      setShowRestartConfirm(false);
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sk-SK');
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica/telo/programy')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>{program.name}</h1>
            <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
              Týždeň {program.currentWeek} z {program.totalWeeks}
            </p>
          </div>
        </div>
      </div>

      {/* Program Welcome */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 text-center">
        <h2 className="text-lg font-bold mb-3" style={{ color: '#2E2218' }}>
          Vitaj v programe {program.name}! 
        </h2>
        
        {/* Intro Video Section - Only for Postpartum program */}
        {program.id === 'postpartum' && (
          <div className="mb-6">
            <div className="bg-white/40 rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#2E2218' }}>
                Úvodné video od Gabi
              </h3>
              {/* Video placeholder - will be replaced with actual video upload */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl aspect-video flex items-center justify-center mb-3">
                <div className="text-center">
                  <Video className="w-8 h-8 mx-auto mb-2" style={{ color: colors.telo }} />
                  <p className="text-xs text-gray-600">Video bude nahraté Gabi</p>
                  <p className="text-xs text-gray-500">Úvod do programu a motivácia</p>
                </div>
              </div>
              <p className="text-xs" style={{ color: '#6B4C3B' }}>
                V tomto videu ti Gabi vysvetlí, čo ťa v programe čaká a ako ho správne absolvovať.
              </p>
            </div>
          </div>
        )}
        
        <p className="text-sm mb-4" style={{ color: '#6B4C3B' }}>
          {program.description}
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-[#6B4C3B] bg-opacity-10 text-[#6B4C3B]">
            Týždeň {program.currentWeek} z {program.totalWeeks}
          </span>
          <span className="text-xs px-3 py-1.5 rounded-xl bg-[#B8864A] bg-opacity-10 text-[#B8864A]">
            Deň {program.currentDay}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
            <Calendar className="w-4 h-4" style={{ color: '#6B4C3B' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Pokrok</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Začiatok: {formatDate(program.startDate)}</span>
            <span>{program.isPaused ? 'Pozastavený' : 'Aktívny'}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all bg-[#6B4C3B]"
              style={{ 
                width: `${((program.currentWeek - 1) * 100) / program.totalWeeks}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Today's Workout */}
      {todaysExercise && (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Play className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Dnešné cvičenie</h3>
          </div>
          
          <button
            onClick={() => navigate('/exercise-player', { 
              state: { 
                exercise: todaysExercise, 
                programName: program.name 
              } 
            })}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/20 hover:bg-white/25 active:scale-[0.98] transition-all"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src={todaysExercise.thumbnail} alt={todaysExercise.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play size={16} className="text-white" fill="white" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-800">
                {todaysExercise.name}
              </p>
              <div className="text-xs mt-0.5 text-gray-600 flex items-center gap-1">
                <span>{todaysExercise.duration}</span>
                <span>•</span>
                {todaysExercise.hasDemo && (
                  <>
                    <Video className="w-3 h-3" style={{ color: colors.telo }} />
                    <span>DEMO •</span>
                  </>
                )}
                <span>{todaysExercise.description}</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Exercise Accordion by Weeks */}
      <div className="space-y-4">
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <Calendar className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Všetky cvičenia</h3>
          </div>
          
          <div className="space-y-3">
            {program.weekPlans.map((week) => (
              <div 
                key={week.week}
                className="bg-white/20 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenWeek(openWeek === week.week ? null : week.week)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/25 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {week.title}
                    </p>
                    <p className="text-xs mt-0.5 text-gray-600">
                      {week.exercises.length} cvičení
                    </p>
                  </div>
                  {openWeek === week.week ? (
                    <ChevronUp size={16} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-600" />
                  )}
                </button>
                
                {openWeek === week.week && (
                  <div className="border-t border-white/35 bg-white">
                    {week.exercises.map((exercise, idx) => (
                      <button 
                        key={exercise.id}
                        className="w-full p-3 border-b border-white/30 last:border-b-0 flex items-center gap-3 hover:bg-white/20 active:scale-[0.98] transition-all text-left"
                        onClick={() => navigate('/exercise-player', { 
                          state: { 
                            exercise, 
                            programName: program.name 
                          } 
                        })}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={exercise.thumbnail} alt={exercise.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play size={12} className="text-white" fill="white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-800">
                            {exercise.name}
                          </p>
                          <p className="text-xs mt-0.5 text-gray-600">
                            {exercise.duration}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Actions — always last */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex gap-3">
          <button
            onClick={() => setShowPauseConfirm(true)}
            disabled={program.isPaused}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all active:scale-95 disabled:opacity-50 bg-[#B8864A] bg-opacity-10 text-[#B8864A] hover:bg-opacity-20"
          >
            Pozastaviť
          </button>
          <button
            onClick={() => setShowRestartConfirm(true)}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all active:scale-95 bg-[#6B4C3B] bg-opacity-10 text-[#6B4C3B] hover:bg-opacity-20"
          >
            Nový začiatok
          </button>
        </div>
      </div>

      {/* Pause Confirmation Modal */}
      {showPauseConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-[#B8864A] bg-opacity-15">
                <AlertTriangle size={20} style={{ color: '#B8864A' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Pozastaviť program?</h3>
                <p className="text-sm mt-2 text-gray-600">
                  Tvoj pokrok bude uložený a môžeš pokračovať kedykoľvek.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPauseConfirm(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-white/25 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  onClick={handlePauseProgram}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-[#B8864A] hover:bg-[#A6784A] transition-colors"
                >
                  Pozastaviť
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restart Confirmation Modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-[#6B4C3B] bg-opacity-15">
                <RotateCcw size={20} style={{ color: '#6B4C3B' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Nový začiatok?</h3>
                <p className="text-sm mt-2 text-gray-600">
                  Program sa resetuje na týždeň 1, deň 1. Pokrok bude stratený.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-white/25 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  onClick={handleRestartProgram}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-[#6B4C3B] hover:bg-[#5A3F31] transition-colors"
                >
                  Resetovať
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}