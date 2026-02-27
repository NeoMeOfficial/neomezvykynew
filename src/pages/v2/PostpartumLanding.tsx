import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Star, Play, Users, Clock, Heart, Shield, Gift, ChevronDown, ChevronUp } from 'lucide-react';
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

const bonuses = [
  { name: 'Súkromná NeoMe komunita', value: '50 Eur', desc: 'Podpora od ostatných mamín' },
  { name: 'Denná motivácia od Gabi', value: '30 Eur', desc: 'Každodenné motivačné videá' },
  { name: 'Zľava na stravovací plán', value: '15 Eur', desc: 'Healthy recepty pre maminy' },
  { name: 'eBook 30 zdravých receptov', value: '19 Eur', desc: 'Nutričné recepty' },
  { name: 'FlexiPass zľava', value: 'Premium', desc: 'Exkluzívne partnerské výhody' },
];

const testimonials = [
  { name: 'Zuzana M.', text: '"Po 6 mesiacoch som konečne cítila, že sa môj život vracia do normálu. Brucho je pevné a nemám už bolesť chrbta."', rating: 5 },
  { name: 'Petra K.', text: '"Program mi pomohol nielen fyzicky, ale aj psychicky. Cítim sa opäť ako ja - silná a sebavedomá mama."', rating: 5 },
  { name: 'Martina L.', text: '"Začala som 2 roky po pôrode a funguje to perfektne. Nikdy nie je neskoro!"', rating: 5 },
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
  },
  {
    q: 'Schudnem?',
    a: 'Ako akékoľvek iné cvičenie aj náš Postpartum program je vhodný kombinovať s vhodnou stravou, ak chceš vidieť výsledky na svojej hmotnosti. Preto aj my ponúkame stravovací plán na mieru, ktorý si môžeš dokúpiť. Pri kontrole hmotnosti platí jednoduchá rovnica - tvoj energetický príjem musí byť menší ako výdaj.'
  }
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

function FAQ({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-[#2E2218] pr-4">{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 bg-white">
          <p className="text-[#8B7560] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function PostpartumLanding() {
  const navigate = useNavigate();
  const { hasProgram, userProgram } = useUserProgram();
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // If user has program, show progress view
  if (hasProgram && userProgram?.id === 'postpartum') {
    return (
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/kniznica/telo')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-semibold text-[#2E2218]">Postpartum Program</h1>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
        {userProgram.todaysExercise && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
              Dnešné cvičenie
            </h3>
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img 
                src={userProgram.todaysExercise.thumbnail} 
                alt={userProgram.todaysExercise.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                  <Play size={24} fill={colors.telo} style={{ color: colors.telo, marginLeft: 4 }} />
                </button>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {userProgram.todaysExercise.duration}
              </div>
            </div>
            <h4 className="font-semibold mb-2" style={{ color: colors.textPrimary }}>
              {userProgram.todaysExercise.title}
            </h4>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              {userProgram.todaysExercise.description}
            </p>
            <button 
              className="w-full py-3 rounded-2xl text-white font-semibold"
              style={{ background: colors.telo }}
            >
              Začať cvičenie
            </button>
          </div>
        )}

        {/* Program Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
            Ovládanie programu
          </h3>
          <div className="space-y-3">
            <button 
              className="w-full py-3 rounded-2xl border-2 border-orange-200 text-orange-600 font-semibold bg-orange-50"
              onClick={() => alert('Program pozastavený')}
            >
              ⏸️ Pozastaviť program
            </button>
            <button 
              className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold"
              onClick={() => navigate('/program/postpartum/schedule')}
            >
              📅 Zobraziť rozpis týždňov
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sales/Landing page for non-enrolled users
  return (
    <div className="space-y-8 pb-20" style={{ background: 'linear-gradient(135deg, #F7F4F0 0%, #F0E6DA 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5">
        <button onClick={() => navigate('/kniznica/telo')} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#2E2218]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Hero Section */}
      <div className="px-5">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded-full mb-4">
            Level 1 • Postpartum
          </span>
          <h1 className="text-3xl font-bold text-[#2E2218] mb-4 leading-tight">
            Cesta za tvojou novou ja, ktorá je silná, zdravá a sebavedomá
          </h1>
          <p className="text-lg text-[#8B7560] mb-6 leading-relaxed">
            15 minútové online cvičenia na posilnenie vnútorných brušných svalov, ktoré ostali oslabené po pôrode
          </p>
          
          {/* Video Preview */}
          <div className="relative rounded-3xl overflow-hidden mb-6 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop"
              alt="Postpartum Program Preview"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <button 
                onClick={() => setShowVideoPlayer(true)}
                className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-lg"
              >
                <Play size={28} fill={colors.telo} style={{ color: colors.telo, marginLeft: 4 }} />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
              ▶️ Pozri si ukážku programu
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
              ))}
              <span className="text-sm font-medium text-[#2E2218] ml-2">4.9/5</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Users size={16} color="#8B7560" />
              <span className="text-sm text-[#8B7560]">500+ spokojných mamín</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Endorsement */}
      <div className="px-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
              <Shield size={24} color="#ec4899" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#8B7560] italic leading-relaxed mb-3">
                "Postpartum program od NeoMe je navrhnutý pre potreby regenerácie panvového dna, brušných svalov a celkového posilnenia tela po pôrode. Pomáha ženám znovu sa spojiť so svojím telom bezpečným a postupným spôsobom."
              </p>
              <div className="font-medium text-[#2E2218] text-sm">
                PhDr. Magdaléna Csolti
                <div className="text-xs text-[#8B7560]">Odborná garantka urogynekologickej fyzioterapie</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Program */}
      <div className="px-5">
        <h2 className="text-2xl font-bold text-[#2E2218] mb-6 text-center">
          Prečo sa iné maminy rozhodli pre Postpartum program
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {[
            '"Chcem posilniť ochabnuté brucho"',
            '"Musím už odstrániť tehotenské bruško"',
            '"Často ma bolieva chrbát"', 
            '"Nemám čas ani prostriedky na fyzio"',
            '"Nebaví ma rozmýšlať, čo cvičiť"',
            '"Musím už niečo so sebou robiť, ale nemám veľa času"',
            '"Potrebujem mať aspoň chvíľku času na seba"',
            '"Som po sekcii a neviem, ako ďalej"'
          ].map((reason, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <Check size={14} color="#ec4899" strokeWidth={3} />
                </div>
                <p className="text-[#2E2218] font-medium">{reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Phases */}
      <div className="px-5">
        <h2 className="text-2xl font-bold text-[#2E2218] mb-6 text-center">
          Na čo sa v programe zameriavame
        </h2>
        <div className="space-y-4">
          {progressPhases.map((phase, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{phase.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white bg-[#6B4C3B] px-2 py-1 rounded-full">
                      Týždeň {phase.weeks}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2E2218] mb-2">{phase.title}</h3>
                  <p className="text-[#8B7560] leading-relaxed">{phase.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="px-5">
        <h2 className="text-2xl font-bold text-[#2E2218] mb-6 text-center">
          Ako vyzerá bežný týždeň?
        </h2>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            {weeklySchedule.map((day, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-[#6B4C3B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {day.day.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[#2E2218] text-sm">{day.type}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#8B7560]">
                      <Clock size={12} />
                      {day.duration}
                    </div>
                  </div>
                  <p className="text-xs text-[#8B7560]">{day.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="px-5">
        <h2 className="text-2xl font-bold text-[#2E2218] mb-6 text-center">
          Čo program obsahuje
        </h2>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            {programFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check size={14} color="#059669" strokeWidth={3} />
                </div>
                <p className="text-[#2E2218] font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bonuses */}
      <div className="px-5">
        <h2 className="text-2xl font-bold text-[#2E2218] mb-6 text-center">
          Bonusy v hodnote skoro 200 EUR
        </h2>
        <div className="space-y-3">
          {bonuses.map((bonus, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gift size={20} color="#ec4899" />
                  <div>
                    <h4 className="font-semibold text-[#2E2218]">{bonus.name}</h4>
                    <p className="text-xs text-[#8B7560]">{bonus.desc}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-pink-600">{bonus.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-5">
        <h2 className="text-2xl font-bold text-[#2E2218] mb-6 text-center">
          Stovky spokojných klientiek už bruško po pôrode odstránili
        </h2>
        <div className="space-y-4">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center text-xl">
                  💕
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} size={14} fill="#FFD700" color="#FFD700" />
                    ))}
                  </div>
                  <p className="text-[#2E2218] italic mb-2 leading-relaxed">{testimonial.text}</p>
                  <p className="text-sm font-medium text-[#8B7560]">— {testimonial.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="px-5">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 text-center shadow-lg border border-pink-200">
          <h2 className="text-2xl font-bold text-[#2E2218] mb-4">
            Začni svoju transformáciu už dnes
          </h2>
          <p className="text-[#8B7560] mb-6">
            Dopraj si aj ty, čo tvoje telo potrebuje
          </p>
          
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="text-center">
              <div className="text-4xl font-black text-[#2E2218] mb-2">€97</div>
              <p className="text-sm text-[#8B7560] mb-4">Jednorazová platba • Prístup na 2 mesiace</p>
              
              <div className="text-left space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} color="#059669" strokeWidth={3} />
                  <span>Prístup do programu na 2 mesiace</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} color="#059669" strokeWidth={3} />
                  <span>24 bezpečných posilňovacích cvičení</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} color="#059669" strokeWidth={3} />
                  <span>16 strečingových cvičení + 16 meditácií</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} color="#059669" strokeWidth={3} />
                  <span>Bonusy v hodnote skoro 200 Eur</span>
                </div>
              </div>
              
              <button 
                className="w-full py-4 bg-[#6B4C3B] text-white font-bold text-lg rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
                onClick={() => navigate('/checkout/postpartum')}
              >
                Pridať do košíka
              </button>
              
              <p className="text-xs text-[#8B7560] mt-3">
                ⭐ 7-dňová garancia vrátenia peňazí
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-5">
        <h2 className="text-2xl font-bold text-[#2E2218] mb-6 text-center">
          Časté otázky iných mamín
        </h2>
        <div className="space-y-3">
          {faqData.map((faq, i) => (
            <FAQ key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-5">
        <div className="bg-[#6B4C3B] rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Každá žena má po tehotenstve oslabené brušné svaly
          </h2>
          <p className="text-pink-100 mb-6 leading-relaxed">
            Posilni ich s 8-týždňovým online programom. Nezáleží či už si po pôrode týždne, mesiace, či roky.
          </p>
          <button 
            className="bg-white text-[#6B4C3B] font-bold py-4 px-8 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
            onClick={() => navigate('/checkout/postpartum')}
          >
            Začať program za €97
          </button>
          <p className="text-xs text-pink-200 mt-3">
            * Program obsahuje iba bezpečné cvičenia s progresívnou záťažou
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoPlayer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5" onClick={() => setShowVideoPlayer(false)}>
          <div className="bg-white rounded-3xl p-4 w-full max-w-lg">
            <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
              <p className="text-white">Demo Video Player</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}