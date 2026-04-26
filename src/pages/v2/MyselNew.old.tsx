import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Play, Clock, Heart } from 'lucide-react';
import { colors, glassCard } from '../../theme/warmDusk';
import { usePaywall } from '../../hooks/usePaywall';
import { PaywallModal } from '../../components/v2/paywall/PaywallModal';
import FavoriteButton from '../../components/v2/favorites/FavoriteButton';
import { useUniversalFavorites } from '../../hooks/useUniversalFavorites';
import { supabase } from '../../lib/supabase';

interface Meditation {
  id: string;
  title: string;
  duration: string;
  description: string;
  audioUrl: string;
  image: string;
  category: string;
}

// Skutočné meditácie pre ženy a matky - len pokojné prírodné scenérie
const meditations: Meditation[] = [
  { id: 'med-1', category: 'Stres', title: 'Nájdenie vnútorného pokoja uprostred chaosu', duration: '5 min', description: 'Naučte sa nájsť pokojné miesto vo svojej mysli aj v najrušnejších dňoch', audioUrl: '/audio/inner-peace-chaos.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { id: 'med-2', category: 'Mindfulness', title: 'Učenie sa byť prítomná pri každodenných úlohách', duration: '5 min', description: 'Transformujte bežné činnosti na príležitosti pre mindfulness', audioUrl: '/audio/present-daily-tasks.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
  { id: 'med-3', category: 'Materstvo', title: 'Objavovanie trpezlivosti vo výchovnom procese', duration: '5 min', description: 'Kultivujte trpezlivosť a porozumenie v náročných výchovných momentoch', audioUrl: '/audio/patience-parenting.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop' },
  { id: 'med-4', category: 'Mindfulness', title: 'Nájdenie radosti v malých veciach', duration: '5 min', description: 'Objavte krásu v jednoduchých, každodenných momentoch', audioUrl: '/audio/joy-small-things.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { id: 'med-5', category: 'Emócie', title: 'Udržiavanie emocionálnej rovnováhy', duration: '5 min', description: 'Technika na stabilizovanie emócií a nájdenie vnútornej harmónie', audioUrl: '/audio/emotional-balance.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop' },
  { id: 'med-6', category: 'Ja', title: 'Vytváranie času pre seba', duration: '5 min', description: 'Naučte sa prioritizovať svoju pohodu a vytvoriť priestor pre seba', audioUrl: '/audio/time-for-self.mp3', image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop' },
  { id: 'med-7', category: 'Materstvo', title: 'Posilňovanie väzby s dieťaťom', duration: '5 min', description: 'Meditácia zameraná na prehĺbenie lásky a spojenia s vaším dieťaťom', audioUrl: '/audio/bond-with-child.mp3', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop' },
  { id: 'med-8', category: 'Materstvo', title: 'Prijímanie nepredvídateľnosti materstva', duration: '5 min', description: 'Naučte sa flexibilne reagovať na neočakávané situácie v materstve', audioUrl: '/audio/accept-unpredictability.mp3', image: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop' },
  { id: 'med-9', category: 'Emócie', title: 'Naučiť sa odpúšťať sebe a iným', duration: '5 min', description: 'Oslobodenie sa od viny a rozhorčenia cez praktiku odpúštania', audioUrl: '/audio/forgiveness-practice.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
  { id: 'med-10', category: 'Emócie', title: 'Rozvíjanie empatie a porozumenia', duration: '5 min', description: 'Prehĺbenie schopnosti porozumieť sebe aj ostatným s láskavosťou', audioUrl: '/audio/empathy-understanding.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { id: 'med-11', category: 'Stres', title: 'Prekonávanie stresu a úzkosti', duration: '5 min', description: 'Efektívne techniky na zvládanie stresu a upokojenie anxióznych myšlienok', audioUrl: '/audio/overcome-stress-anxiety.mp3', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop' },
  { id: 'med-12', category: 'Ja', title: 'Budovanie sebadôvery a sebaúcty', duration: '5 min', description: 'Posilnenie vnútornej sily a pozitívneho vzťahu k sebe', audioUrl: '/audio/self-confidence-esteem.mp3', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop' },
  { id: 'med-13', category: 'Ja', title: 'Nájdenie rovnováhy medzi kariérou a osobným životom', duration: '5 min', description: 'Harmonizácia pracovných a osobných priorít s múdrosťou', audioUrl: '/audio/work-life-balance.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { id: 'med-14', category: 'Ja', title: 'Učenie sa hovoriť „nie" bez pocitu viny', duration: '5 min', description: 'Nastavenie zdravých hraníc a sebapéča bez pocitov viny', audioUrl: '/audio/saying-no-guilt.mp3', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop' },
  { id: 'med-15', category: 'Ja', title: 'Rozvíjanie kreativity a hľadanie inšpirácie', duration: '5 min', description: 'Prebudenie tvorivého ducha a otvorenie sa novým možnostiam', audioUrl: '/audio/creativity-inspiration.mp3', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
  { id: 'med-16', category: 'Emócie', title: 'Zvládanie pocitu osamelosti a izolácie', duration: '5 min', description: 'Nájdenie spojenia a zmyslu aj v momentoch osamelosti', audioUrl: '/audio/loneliness-isolation.mp3', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop' },
  { id: 'med-17', category: 'Mindfulness', title: 'Udržiavanie pozitívneho myslenia', duration: '5 min', description: 'Kultivovanie optimizmu a vďačnosti v každodennom živote', audioUrl: '/audio/positive-thinking.mp3', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
];

export default function MyselNew() {
  const navigate = useNavigate();
  const { paywallState, closePaywall, handleUpgrade } = usePaywall();
  const { isFavorite } = useUniversalFavorites();
  const [showFavourites, setShowFavourites] = useState(false);
  const [meditationsList, setMeditationsList] = useState<Meditation[]>(meditations);

  useEffect(() => {
    supabase.from('meditations').select('*').eq('active', true)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setMeditationsList(data.map(m => ({
          id: m.id,
          title: m.title,
          duration: m.duration,
          description: m.description,
          audioUrl: m.audio_url,
          image: m.image,
          category: m.category,
        })));
      });
  }, []);

  const filtered = meditationsList.filter(m =>
    showFavourites ? isFavorite(m.id, 'meditation') : true
  );

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6" style={{ background: colors.bgGradient }}>
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/kniznica')} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5" style={{ color: colors.mysel }} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.mysel}20` }}>
              <Brain className="h-6 w-6" style={{ color: colors.mysel }} />
            </div>
            <h1 className="text-[26px] font-medium leading-tight" style={{ color: '#2E2218', fontFamily: '"Bodoni Moda", Georgia, serif' }}>Myseľ</h1>
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Keď potrebuješ spomaliť, sprítomniť sa alebo si jednoducho dopriať chvíľu pokoja – vyber si 5-minútovú meditáciu.
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.mysel }} />
            <span>17 meditácií</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Všetky 5 min</span>
          </div>
        </div>
      </div>

      {/* Favourites toggle */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <button
          onClick={() => setShowFavourites(!showFavourites)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
            showFavourites ? 'text-white' : 'bg-white/20 text-gray-600'
          }`}
          style={showFavourites ? { background: colors.mysel } : {}}
        >
          <Heart size={10} fill={showFavourites ? 'white' : 'none'} stroke={showFavourites ? 'white' : 'currentColor'} />
          Obľúbené
        </button>
      </div>

      {/* Empty favourites state */}
      {showFavourites && filtered.length === 0 && (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
          <Heart size={28} className="mx-auto mb-2" style={{ color: colors.mysel }} />
          <p className="text-sm font-medium mb-1" style={{ color: '#2E2218' }}>Žiadne obľúbené</p>
          <p className="text-xs" style={{ color: '#8B7560' }}>Ťukni na srdce pri meditácii a uloží sa sem</p>
        </div>
      )}

      {/* Meditation Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(meditation => (
            <div
              key={meditation.id}
              className="relative overflow-hidden rounded-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
              style={{ ...glassCard, minHeight: '160px' }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${meditation.image})` }} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.mysel}15 0%, ${colors.mysel}25 100%)` }} />

              {/* Favourite button — top right */}
              <div className="absolute top-2 right-2 z-20">
                <FavoriteButton
                  itemId={meditation.id}
                  type="meditation"
                  title={meditation.title}
                  image={meditation.image}
                  duration={meditation.duration}
                  category={meditation.category}
                  metadata={{}}
                  size="sm"
                  className="bg-black/40 backdrop-blur-sm"
                />
              </div>

              {/* Tappable content area */}
              <div
                className="relative z-10 p-4 h-full flex flex-col justify-between"
                onClick={() => navigate(`/meditacia/${meditation.id}`)}
              >
                <h3 className="font-semibold text-sm leading-tight pr-7" style={{ color: colors.textPrimary }}>
                  {meditation.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.mysel}20` }}>
                    <Play className="h-4 w-4 fill-current" style={{ color: colors.mysel }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: colors.mysel }}>{meditation.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaywallModal isOpen={paywallState.isOpen} onClose={closePaywall} title={paywallState.title} message={paywallState.message} limitType={paywallState.limitType} onUpgrade={handleUpgrade} />
    </div>
  );
}