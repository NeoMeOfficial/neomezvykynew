import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Play, Clock } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';
import { useSubscription } from '../../contexts/SimpleSubscriptionContext';
import { usePaywall } from '../../hooks/usePaywall';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';

interface Meditation {
  id: string;
  title: string;
  duration: string;
  description: string;
  audioUrl: string;
  image: string;
}

// Skutočné meditácie pre ženy a matky - len pokojné prírodné scenérie
const meditations: Meditation[] = [
  {
    id: 'med-1',
    title: 'Nájdenie vnútorného pokoja uprostred chaosu',
    duration: '5 min',
    description: 'Naučte sa nájsť pokojné miesto vo svojej mysli aj v najrušnejších dňoch',
    audioUrl: '/audio/inner-peace-chaos.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-2', 
    title: 'Učenie sa byť prítomná pri každodenných úlohách',
    duration: '5 min',
    description: 'Transformujte bežné činnosti na príležitosti pre mindfulness',
    audioUrl: '/audio/present-daily-tasks.mp3',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-3',
    title: 'Objavovanie trpezlivosti vo výchovnom procese',
    duration: '5 min', 
    description: 'Kultivujte trpezlivosť a porozumenie v náročných výchovných momentoch',
    audioUrl: '/audio/patience-parenting.mp3',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop'
  },
  {
    id: 'med-4',
    title: 'Nájdenie radosti v malých veciach',
    duration: '5 min',
    description: 'Objavte krásu v jednoduchých, každodenných momentoch',
    audioUrl: '/audio/joy-small-things.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-5',
    title: 'Udržiavanie emocionálnej rovnováhy',
    duration: '5 min',
    description: 'Technika na stabilizovanie emócií a nájdenie vnútornej harmónie',
    audioUrl: '/audio/emotional-balance.mp3',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop'
  },
  {
    id: 'med-6',
    title: 'Vytváranie času pre seba',
    duration: '5 min',
    description: 'Naučte sa prioritizovať svoju pohodu a vytvoriť priestor pre seba',
    audioUrl: '/audio/time-for-self.mp3',
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop'
  },
  {
    id: 'med-7',
    title: 'Posilňovanie väzby s dieťaťom',
    duration: '5 min',
    description: 'Meditácia zameraná na prehĺbenie lásky a spojenia s vaším dieťaťom',
    audioUrl: '/audio/bond-with-child.mp3',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop'
  },
  {
    id: 'med-8',
    title: 'Prijímanie nepredvídateľnosti materstva',
    duration: '5 min',
    description: 'Naučte sa flexibilne reagovať na neočakávané situácie v materstve',
    audioUrl: '/audio/accept-unpredictability.mp3',
    image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop'
  },
  {
    id: 'med-9',
    title: 'Naučiť sa odpúšťať sebe a iným',
    duration: '5 min',
    description: 'Oslobodenie sa od viny a rozhorčenia cez praktiku odpúštania',
    audioUrl: '/audio/forgiveness-practice.mp3',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-10',
    title: 'Rozvíjanie empatie a porozumenia',
    duration: '5 min',
    description: 'Prehĺbenie schopnosti porozumieť sebe aj ostatným s láskavosťou',
    audioUrl: '/audio/empathy-understanding.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-11',
    title: 'Prekonávanie stresu a úzkosti',
    duration: '5 min',
    description: 'Efektívne techniky na zvládanie stresu a upokojenie anxióznych myšlienok',
    audioUrl: '/audio/overcome-stress-anxiety.mp3',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-12',
    title: 'Budovanie sebadôvery a sebaúcty',
    duration: '5 min',
    description: 'Posilnenie vnútornej sily a pozitívneho vzťahu k sebe',
    audioUrl: '/audio/self-confidence-esteem.mp3',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop'
  },
  {
    id: 'med-13',
    title: 'Nájdenie rovnováhy medzi kariérou a osobným životom',
    duration: '5 min',
    description: 'Harmonizácia pracovných a osobných priorít s múdrosťou',
    audioUrl: '/audio/work-life-balance.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: 'med-14',
    title: 'Učenie sa hovoriť „nie" bez pocitu viny',
    duration: '5 min',
    description: 'Nastavenie zdravých hraníc a sebapéča bez pocitov viny',
    audioUrl: '/audio/saying-no-guilt.mp3',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop'
  },
  {
    id: 'med-15',
    title: 'Rozvíjanie kreativity a hľadanie inšpirácie',
    duration: '5 min',
    description: 'Prebudenie tvorivého ducha a otvorenie sa novým možnostiam',
    audioUrl: '/audio/creativity-inspiration.mp3',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
  },
  {
    id: 'med-16',
    title: 'Zvládanie pocitu osamelosti a izolácie',
    duration: '5 min',
    description: 'Nájdenie spojenia a zmyslu aj v momentoch osamelosti',
    audioUrl: '/audio/loneliness-isolation.mp3',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop'
  },
  {
    id: 'med-17',
    title: 'Udržiavanie pozitívneho myslenia',
    duration: '5 min',
    description: 'Kultivovanie optimizmu a vďačnosti v každodennom živote',
    audioUrl: '/audio/positive-thinking.mp3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  }
];

export default function MyselNew() {
  const navigate = useNavigate();
  const { isSubscribed } = useSubscription();
  const { showContentPaywall, paywallState, closePaywall, handleUpgrade } = usePaywall();

  const handleMeditationClick = (meditationId: string) => {
    // All meditations are now free - navigate directly to meditation player
    navigate(`/meditacia/${meditationId}`);
  };

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/kniznica')}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" style={{ color: colors.mysel }} />
          </button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${colors.mysel}20` }}
            >
              <Brain className="h-6 w-6" style={{ color: colors.mysel }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: colors.mysel }}>
              Myseľ
            </h1>
          </div>
        </div>

        {/* Intro Text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Keď potrebuješ spomaliť, sprítomniť sa alebo si jednoducho dopriať chvíľu pokoja – 
          vyber si 5-minútovú meditáciu a nájdi svoj vnútorný pokoj.
        </p>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.mysel }}></div>
            <span>17 meditácií</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Všetky 5 min</span>
          </div>
        </div>
      </div>

      {/* Meditácie Section */}
      <div className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.mysel }}>
            Meditácie
          </h2>
        </div>

        {/* Meditation Grid */}
        <div className="grid grid-cols-2 gap-3">
          {meditations.map((meditation, index) => (
            <div
              key={meditation.id}
              onClick={() => handleMeditationClick(meditation.id)}
              className="relative overflow-hidden rounded-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
              style={{
                ...glassCard,
                minHeight: '160px'
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${meditation.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${colors.mysel}15 0%, ${colors.mysel}25 100%)`
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                {/* All meditations unlocked */}

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm leading-tight" style={{ color: colors.textPrimary }}>
                    {meditation.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${colors.mysel}20` }}
                    >
                      <Play className="h-4 w-4 fill-current" style={{ color: colors.mysel }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: colors.mysel }}>
                      {meditation.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Cards */}
        {meditations.length < 17 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {Array.from({ length: 17 - meditations.length }).map((_, index) => (
              <div
                key={`coming-${index}`}
                className="relative overflow-hidden rounded-xl opacity-60"
                style={{
                  ...glassCard,
                  minHeight: '160px',
                  backgroundColor: `${colors.mysel}10`
                }}
              >
                <div className="p-4 h-full flex flex-col items-center justify-center text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${colors.mysel}20` }}
                  >
                    <Brain className="h-6 w-6" style={{ color: colors.mysel }} />
                  </div>
                  <p className="text-xs text-gray-500">
                    Nová meditácia
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Už čoskoro...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallState.isOpen}
        onClose={closePaywall}
        title={paywallState.title}
        message={paywallState.message}
        limitType={paywallState.limitType}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}