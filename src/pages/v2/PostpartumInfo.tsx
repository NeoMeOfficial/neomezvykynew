import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star, Play, Clock, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import { useUserProgram } from '../../hooks/useUserProgram';

const programFeatures = [
  '24 bezpečných posilňovacích cvičení',
  '16 strečingových cvičení pre uvoľnenie napätia', 
  '16 meditácií pre prinavrátenie si vnútorného balansu',
  'Progresívny 8-týždňový plán',
  'Cvičenia vhodné aj roky po pôrode',
  'Bezpečné cvičenia po sekcii (po 3 mesiacoch)',
];

const weeklySchedule = [
  { day: 'Pondelok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: 'Core aktivácia + panvové dno' },
  { day: 'Utorok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: 'Brušný korzet + stabilita' },
  { day: 'Streda', type: 'Strečing & Meditácia', duration: '20 min', focus: 'Uvoľnenie + mindfulness' },
  { day: 'Štvrtok', type: 'Posilňovacie cvičenie', duration: '15 min', focus: 'Komplexné posilnenie' },
  { day: 'Piatok', type: 'Strečing & Meditácia', duration: '20 min', focus: 'Regenerácia + sebaláska' },
];

const progressPhases = [
  {
    weeks: '1-2',
    title: 'Pevné základy core',
    description: 'Bránicové dýchanie, aktivácia panvového dna, hlboké brušné svaly (TVA)',
    icon: '🌱'
  },
  {
    weeks: '3-5', 
    title: 'Progresívne posilnenie',
    description: 'Cvičenia s pilates ball a elastickými gumami, posilnenie brušného korzetu',
    icon: '💪'
  },
  {
    weeks: '6-8',
    title: 'Komplexné prepojenie',
    description: 'Rotácie, protitlak, strečing a meditácie pre celkový balance',
    icon: '✨'
  }
];

const faqData = [
  {
    q: 'Už som roky po pôrode, je program aj pre mňa?',
    a: 'Každá žena by si mala prejsť cvičeniami, ktoré sa zameriavajú na posilnenie partií, ktoré boli počas tehotenstva a pôrodu namáhané. Je jedno ako dlho si po pôrode. Ak sa chceš začať hýbať, len nevieš ako, aké cvičenia sú pre teba vhodné a bezpečné, Postpartum program je tvoja bezpečná vstupenka do aktívneho života bez ohľadu nato, ako dávno si porodila.'
  },
  {
    q: 'Kedy je vhodné začať cvičiť? (Prirodzený pôrod)',
    a: 'Začiatok cvičenia je individuálny a záleží od viacerých faktorov – od tvojho fitnes levelu pred a počas tehotenstva, od priebehu tvojho tehotenstva, od typu pôrodu a najmä od toho, kedy sa na to budeš psychicky cítiť. Cviky sú bezpečné a môžeš ich začať robiť už v prvých dňoch po pôrode ak si mala bezrizikové tehotenstvo a pôrod.'
  },
  {
    q: 'Kedy je vhodné začať cvičiť? (Sekcia)',
    a: 'Po sekcií odporúčam najmenej 3 mesiace na regeneráciu rán a konzultáciu s lekárom alebo fyzio. Postpartum program je vhodný aj na posilnenie vnutorných brušných svalov po sekcii, pokiaľ už más rany zahojené.'
  },
  {
    q: 'Čo môžem očakávať ako výsledok programu?',
    a: 'Pri pravidelnom cvičení posilníš oslabené partie z tehotenstva a pôrodu – hlboké brušné svaly a svaly panvového dna. Odstrániš diastázu a inkontinenciu. Budeš mať menšie bolesti chrbta, lepšie držanie tela. Postpartum program ti pomôže osvojiť si novú self-care rutinu a naučí ťa vnímať pohyb ako odmenu.'
  }
];

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/35 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between bg-white hover:bg-white/20 transition-colors"
      >
        <span className="font-medium" style={{ color: colors.textPrimary }}>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 bg-white">
          <p style={{ color: colors.textSecondary }} className="leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function PostpartumInfo() {
  const navigate = useNavigate();
  const { hasProgram, userProgram } = useUserProgram();

  // If user has program, show progress view
  if (hasProgram && userProgram?.id === 'postpartum') {
    return (
      <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
        <div className="p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pt-8">
            <button onClick={() => navigate('/kniznica/telo')} className="p-1">
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} strokeWidth={1.5} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Postpartum Program</h1>
          </div>

          {/* Progress Overview */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  Týždeň {userProgram.week}, Deň {userProgram.day}
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Pokračuješ skvele! 💪
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: colors.telo }}>
                  {Math.round((userProgram.week / 8) * 100)}%
                </div>
                <p className="text-xs" style={{ color: colors.textTertiary }}>dokončené</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${(userProgram.week / 8) * 100}%`,
                  background: `linear-gradient(90deg, ${colors.telo}, ${colors.telo}CC)`
                }}
              />
            </div>
          </div>

          {/* Today's Workout */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Dnešné cvičenie</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}>
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold" style={{ color: colors.textPrimary }}>Core aktivácia</h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>15 minút • Brušné svaly + panvové dno</p>
              </div>
              <button 
                className="px-6 py-2 rounded-2xl text-white font-medium shadow-md"
                style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}
              >
                Začať
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Information view for users with NeoMe subscription
  return (
    <div className="min-h-screen pb-20" style={{ background: colors.bgGradient }}>
      <div className="p-5 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pt-8">
          <button onClick={() => navigate('/kniznica/telo')} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textPrimary }} strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>Postpartum Program</h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Zahrnuté v tvojom NeoMe predplatnom</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}>
              <div className="w-full h-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              Návrat k sebe po pôrode
            </h2>
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              8-týždňový program pre bezpečné posilnenie a obnovenie
            </p>
          </div>

          {/* Start Program Button */}
          <button
            onClick={() => navigate('/program/postpartum')}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-md"
            style={{ background: `linear-gradient(135deg, ${colors.telo}, ${colors.telo}CC)` }}
          >
            Začať program
          </button>
        </div>

        {/* Program Features */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Čo obsahuje program
          </h3>
          <div className="space-y-3">
            {programFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.telo }}>
                  <Check className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span style={{ color: colors.textPrimary }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Týždňový rozvrh
          </h3>
          <div className="space-y-3">
            {weeklySchedule.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-2xl" style={{ backgroundColor: `${colors.telo}08` }}>
                <div>
                  <div className="font-medium" style={{ color: colors.textPrimary }}>{day.day}</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>{day.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium" style={{ color: colors.telo }}>{day.duration}</div>
                  <div className="text-xs" style={{ color: colors.textTertiary }}>{day.focus}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Phases */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
            Postup programu
          </h3>
          <div className="space-y-4">
            {progressPhases.map((phase, index) => (
              <div key={index} className="flex gap-4">
                <div className="text-2xl">{phase.icon}</div>
                <div>
                  <div className="font-bold" style={{ color: colors.textPrimary }}>
                    Týždne {phase.weeks}: {phase.title}
                  </div>
                  <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 border border-white/30">
          <h3 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary }}>
            Často kladené otázky
          </h3>
          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <FAQ key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}