import { useState, useEffect, useCallback } from 'react';
import { useCommunityPosts } from '../../hooks/useCommunityPosts';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Dumbbell,
  CheckCircle2,
  Brain,
  Send,
  HelpCircle,
  Flag,
  UserPlus,
  Gift,
  ExternalLink,
  Lock,
  Copy,
  Leaf,
  Shirt,
  Watch,
} from 'lucide-react';
import GlassCard from '../../components/v2/GlassCard';
import BreadcrumbBack from '../../components/v2/BreadcrumbBack';
import { colors } from '../../theme/warmDusk';
import { useNavigate, useLocation } from 'react-router-dom';
import { partnerDiscounts, getAvailableDiscounts, getNextDiscount, getCategoryIcon, getCategoryColor } from '../../data/partnerDiscounts';
import { useAchievements } from '../../hooks/useAchievements';

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  likes: number;
}

interface Post {
  id: number;
  type: 'post' | 'question';
  author: string;
  text: string;
  likes: number;
  comments: number;
  time: string;
  commentsData?: Comment[];
}

// Challenges removed per feedback

const initialPosts: Post[] = [
  { 
    id: 1, 
    type: 'post', 
    author: 'Mária K.', 
    text: 'Dokončila som 4. týždeň BodyForming! 💪 Cítim sa silnejšia každým dňom.', 
    likes: 24, 
    comments: 6, 
    time: 'pred 2h',
    commentsData: [
      { id: 11, author: 'Elena S.', text: 'Super progress! Ako sa cítiš po tréningu?', time: 'pred 1h', likes: 3 },
      { id: 12, author: 'Viera P.', text: 'Motivačné! Aj ja začínam tento program budúci týždeň 💪', time: 'pred 1h', likes: 5 },
      { id: 13, author: 'Anna R.', text: 'Gratulujem! Je to naozaj výzva, ale oplatí sa.', time: 'pred 30min', likes: 2 },
    ]
  },
  { 
    id: 2, 
    type: 'question', 
    author: 'Jana V.', 
    text: 'Aký strečing odporúčate po behu? Mám problém s lýtkami.', 
    likes: 8, 
    comments: 5, 
    time: 'pred 3h',
    commentsData: [
      { id: 21, author: 'Trenérka Nina', text: 'Skús calf stretches - opri sa o stenu a natiahni zadnú nohu. Drž 30-60 sekúnd.', time: 'pred 2h', likes: 8 },
      { id: 22, author: 'Zuzka M.', text: 'Ja používam foam roller na lýtka, pomáha fantasticky!', time: 'pred 2h', likes: 4 },
      { id: 23, author: 'Petra K.', text: 'V aplikácii je sekcia stretching po behu, určite sa pozri!', time: 'pred 1h', likes: 6 },
    ]
  },
  { 
    id: 3, 
    type: 'post', 
    author: 'Zuzana P.', 
    text: 'Dnešný recept na Buddha bowl bol úžasný 🥗 Určite vyskúšajte!', 
    likes: 18, 
    comments: 3, 
    time: 'pred 5h',
    commentsData: [
      { id: 31, author: 'Marta V.', text: 'Môžeš zdieľať recept? Vyzerá to lákavo!', time: 'pred 4h', likes: 2 },
      { id: 32, author: 'Simona J.', text: 'Je to z NeoMe receptov alebo tvoj vlastný?', time: 'pred 3h', likes: 1 },
    ]
  },
  { 
    id: 4, 
    type: 'question', 
    author: 'Lucia H.', 
    text: 'Má niekto skúsenosti s Postpartum programom? Zvažujem začať.', 
    likes: 12, 
    comments: 8, 
    time: 'pred 8h',
    commentsData: [
      { id: 41, author: 'Dominika T.', text: 'Absolútne odporúčam! Pomohol mi po dvoch pôrodoch. Začni pomaly a počúvaj svoje telo.', time: 'pred 7h', likes: 12 },
      { id: 42, author: 'Veronika L.', text: 'Ja som začala 6 mesiacov po pôrode, veľká zmena! Core strength sa výrazne zlepšil.', time: 'pred 6h', likes: 8 },
      { id: 43, author: 'Mirka S.', text: 'Ako dlho po pôrode môžem začať? Mám 3-mesačného bábätko.', time: 'pred 5h', likes: 3 },
    ]
  },
  { 
    id: 5, 
    type: 'post', 
    author: 'Katarína M.', 
    text: 'Prvýkrát som zvládla 30 min meditáciu! 🧘‍♀️ Ďakujem NeoMe za guided sessions.', 
    likes: 31, 
    comments: 4, 
    time: 'včera',
    commentsData: [
      { id: 51, author: 'Linda B.', text: 'Wow, 30 minút je super! Ja sa zatiaľ dostávam len na 10 minút 😅', time: 'včera', likes: 4 },
      { id: 52, author: 'Gabika F.', text: 'Ktorú meditáciu si používala? Chcem vyskúšať aj ja.', time: 'včera', likes: 2 },
    ]
  },
];

// Challenges removed per feedback

export default function Komunita() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab state - check if coming from home with discount focus
  const initialTab = location.state?.tab === 'discounts' ? 'discounts' : 'posts';
  const [activeTab, setActiveTab] = useState<'posts' | 'discounts'>(initialTab);

  // Determine back navigation
  const referrer = location.state?.from || '/domov-new';
  const getBackLabel = () => {
    switch (referrer) {
      case '/domov-new':
        return 'Domov';
      case '/profil':
        return 'Profil';
      default:
        return 'Späť';
    }
  };

  // Composer state
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [composerType, setComposerType] = useState<'post' | 'question'>('post');
  const [composerPhoto, setComposerPhoto] = useState<string | null>(null);

  // Feed state — backed by Supabase when configured, localStorage seed otherwise
  const { user } = useSupabaseAuth();
  const { posts, likedIds, submitPost: submitPostToBackend, toggleLike: toggleLikeBackend } = useCommunityPosts();
  const [nextId, setNextId] = useState(6); // kept for legacy comment IDs only
  
  // Comments and following state
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [followedPosts, setFollowedPosts] = useState<Set<number>>(new Set());
  const [replyingTo, setReplyingTo] = useState<{ postId: number, commentId: number } | null>(null);
  const [replyText, setReplyText] = useState('');

  // Report menu state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [toast, setToast] = useState(false);

  // Challenges removed per feedback

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Close menu on outside click
  useEffect(() => {
    if (openMenuId === null) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [openMenuId]);

  const handleSubmitPost = useCallback(() => {
    if (!composerText.trim()) return;
    const authorName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Ty';
    submitPostToBackend(composerText.trim(), composerType, authorName, user?.id);
    setComposerText('');
    setComposerPhoto(null);
    setComposerExpanded(false);
    setComposerType('post');
  }, [composerText, composerType, composerPhoto, user, submitPostToBackend]);

  const toggleLike = useCallback((id: string | number) => {
    toggleLikeBackend(String(id), user?.id);
  }, [user, toggleLikeBackend]);

  const handleReport = useCallback((postId: number) => {
    const existing = JSON.parse(localStorage.getItem('neome-reports') || '[]');
    existing.push({ postId, timestamp: Date.now() });
    localStorage.setItem('neome-reports', JSON.stringify(existing));
    setOpenMenuId(null);
    setToast(true);
  }, []);

  // toggleChallenge removed per feedback

  const toggleComments = useCallback((postId: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }, []);

  const toggleFollow = useCallback((postId: number) => {
    setFollowedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }, []);

  const startReply = useCallback((postId: number, commentId: number) => {
    setReplyingTo({ postId, commentId });
    setReplyText('');
  }, []);

  const submitReply = useCallback(() => {
    if (!replyingTo || !replyText.trim()) return;
    
    const newReply = {
      id: Date.now(), // Simple ID generation
      author: 'Katka',
      text: replyText.trim(),
      time: 'práve teraz',
      likes: 0,
    };

    setPosts(prev => 
      prev.map(post => {
        if (post.id === replyingTo.postId && post.commentsData) {
          return {
            ...post,
            comments: post.comments + 1,
            commentsData: [...post.commentsData, newReply]
          };
        }
        return post;
      })
    );

    setReplyingTo(null);
    setReplyText('');
  }, [replyingTo, replyText]);

  return (
    <div 
      className="w-full min-h-screen px-3 py-6 pb-28 space-y-6 relative"
      style={{ 
        background: colors.bgGradient, 
        minHeight: '100vh' 
      }}
    >
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-[#6B4C3B] text-white text-xs font-medium px-4 py-3 rounded-2xl text-center shadow-lg">
          Ďakujeme, nahlásenie bolo odoslané administrátorovi ✓
        </div>
      )}

      {/* Breadcrumb Back Button - only show if not coming from main nav */}
      {referrer !== '/domov-new' && (
        <BreadcrumbBack to={referrer} label={getBackLabel()} />
      )}

      {/* Nordic Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20 text-center">
        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
          <Heart className="w-6 h-6" style={{ color: '#B8864A' }} />
        </div>
        <h1 className="text-[16px] font-semibold mb-1" style={{ color: '#2E2218' }}>
          Vitaj v komunite 2 400+ žien
        </h1>
        <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
          Zdieľaj, motivuj sa a rast spolu s nami
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-1 shadow-sm border border-white/20">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'posts'
                ? 'bg-white/50 shadow-sm border border-white/30'
                : 'text-[#8B7560] hover:text-[#6B4C3B]'
            }`}
            style={{ color: activeTab === 'posts' ? '#2E2218' : undefined }}
          >
            <Heart className="w-4 h-4" />
            Príspevky
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'discounts'
                ? 'bg-white/50 shadow-sm border border-white/30'
                : 'text-[#8B7560] hover:text-[#6B4C3B]'
            }`}
            style={{ color: activeTab === 'discounts' ? '#2E2218' : undefined }}
          >
            <Gift className="w-4 h-4" />
            Zľavy partnerov
          </button>
        </div>
      </div>

      {/* Posts Tab Content */}
      {activeTab === 'posts' && (
        <>
          {/* Daily Achievements */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: '#B8864A' }} />
          </div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Dnešné úspechy</h3>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-sm font-medium" style={{ color: '#6B4C3B' }}>
            Spolu dnes dosiahnuté v komunite
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(122, 158, 120, 0.1)' }}>
            <div className="text-2xl font-bold text-[#2E2218] mb-1">47</div>
            <div className="text-[10px] text-[#7A9E78] font-medium leading-tight">
              cvičilo
            </div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(184, 134, 74, 0.1)' }}>
            <div className="text-2xl font-bold text-[#2E2218] mb-1">89</div>
            <div className="text-[10px] text-[#B8864A] font-medium leading-tight">
              návykov
            </div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(168, 132, 139, 0.1)' }}>
            <div className="text-2xl font-bold text-[#2E2218] mb-1">23</div>
            <div className="text-[10px] text-[#A8848B] font-medium leading-tight">
              meditácií
            </div>
          </div>
        </div>
      </div>

      {/* Buddy System */}
      <GlassCard className="!p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
              <UserPlus className="w-4 h-4" style={{ color: '#B8864A' }} />
            </div>
            <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>Buddy System</h3>
          </div>

          {/* Description */}
          <p className="text-[12px]" style={{ color: '#A89B8C' }}>
            Pripoj sa s kamarátkami a motivujte sa
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/buddy-system')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-[13px] font-medium transition-all"
            style={{ backgroundColor: 'rgba(184, 134, 74, 0.14)', color: '#B8864A' }}
          >
            Nájsť buddy
          </button>
        </div>
      </GlassCard>

      {/* Post Composer */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        {!composerExpanded ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B8864A] to-[#D0BCA8] flex-shrink-0" />
            <button
              onClick={() => setComposerExpanded(true)}
              className="flex-1 text-left text-sm text-gray-500 bg-white/20 rounded-full px-4 py-3 hover:bg-white/25 transition-colors"
            >
              Priestor na tvoj post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B8864A] to-[#D0BCA8] flex-shrink-0 mt-1" />
              <textarea
                autoFocus
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Priestor na tvoj post"
                className="flex-1 text-sm bg-white/20 rounded-2xl px-4 py-3 resize-none outline-none min-h-[80px] placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200 border border-white/30"
                style={{ color: '#2E2218' }}
              />
            </div>
            <div className="flex items-center justify-between">
              {composerPhoto && (
                <div className="w-full mb-2 relative">
                  <img src={composerPhoto} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                  <button onClick={() => setComposerPhoto(null)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white text-xs">✕</button>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setComposerType('post')}
                  className={`text-xs font-medium px-3 py-2 rounded-xl transition-colors ${
                    composerType === 'post'
                      ? 'bg-[#6B4C3B] text-white'
                      : 'bg-white/25 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Príspevok
                </button>
                <button
                  onClick={() => setComposerType('question')}
                  className={`text-xs font-medium px-3 py-2 rounded-xl transition-colors ${
                    composerType === 'question'
                      ? 'bg-[#6B4C3B] text-white'
                      : 'bg-white/25 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Otázka
                </button>
                <label className="text-xs font-medium px-3 py-2 rounded-xl transition-colors bg-white/25 text-gray-700 hover:bg-gray-200 cursor-pointer flex items-center gap-1">
                  📷 Foto
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setComposerPhoto(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              </div>
              <button
                onClick={handleSubmitPost}
                className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#6B4C3B] px-4 py-2 rounded-xl hover:bg-[#5A3F32] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Zdieľať
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Followed Topics Section */}
      {followedPosts.size > 0 && (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h3 className="text-[14px] font-semibold" style={{ color: '#2E2218' }}>
              Sledované otázky ({followedPosts.size})
            </h3>
          </div>
          <div className="space-y-3">
            {posts
              .filter(post => followedPosts.has(post.id))
              .slice(0, 3)
              .map(post => (
                <div 
                  key={`followed-${post.id}`} 
                  className="flex items-start gap-3 p-3 bg-white/20 rounded-xl border border-white/30 hover:border-white/35 transition-colors cursor-pointer"
                  onClick={() => toggleComments(post.id)}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#D4B8A0] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#2E2218]">{post.author}</span>
                      <span className="text-xs text-[#A0907E]">{post.time}</span>
                      {post.type === 'question' && (
                        <span className="text-[10px] font-medium text-[#6B4C3B] border border-[#6B4C3B]/30 rounded-full px-2 py-0.5">
                          Otázka
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#2E2218] line-clamp-2 leading-relaxed">{post.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[#A0907E]">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(post.id);
                    }}
                    className="text-[10px] text-[#6B4C3B] font-medium hover:text-[#8B4C3B] transition-colors"
                  >
                    Zrušiť
                  </button>
                </div>
              ))}
            
            {followedPosts.size > 3 && (
              <button 
                className="w-full text-xs text-[#A0907E] hover:text-[#6B4C3B] transition-colors py-2 border border-dashed border-gray-300 rounded-xl"
              >
                Zobraziť všetkých {followedPosts.size} sledovaných
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Feed Section */}
      <h2 className="text-[15px] font-semibold text-[#2E2218] pt-1">Novinky</h2>
      {posts.map((post) => (
        <div key={post.id} className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D0BCA8] to-[#D4B8A0] flex-shrink-0" />
            <span className="text-sm font-medium text-[#2E2218] flex-1">{post.author}</span>
            <span className="text-xs text-[#A0907E] mr-1">{post.time}</span>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === post.id ? null : post.id);
                }}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-[#A0907E]" />
              </button>
              {openMenuId === post.id && (
                <div
                  className="absolute right-0 top-9 bg-white rounded-xl shadow-lg border border-[#eee] py-1 z-40 min-w-[160px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleReport(post.id)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-[#2E2218] hover:bg-[#F5F5F5]"
                  >
                    <Flag className="w-3.5 h-3.5 text-[#A0907E]" />
                    Nahlásiť obsah
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Type badge */}
          {post.type === 'question' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B4C3B] border border-[#6B4C3B]/30 rounded-full px-2.5 py-0.5 mb-2">
              <HelpCircle className="w-3 h-3" />
              Otázka
            </span>
          )}

          {/* Content */}
          <p className="text-sm text-[#2E2218] mb-3">{post.text}</p>

          {/* Engagement */}
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => toggleLike(post.id)}
              className="flex items-center gap-1 text-xs text-[#A0907E] hover:text-red-400 transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  likedIds.has(post.id)
                    ? 'fill-red-400 text-red-400'
                    : 'text-[#A0907E]'
                }`}
                strokeWidth={1.5}
              />
              {post.likes}
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center gap-1 text-xs text-[#A0907E] hover:text-[#6B4C3B] transition-colors"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              {post.comments}
              {post.comments > 0 && (
                <span className="ml-1">
                  {expandedComments.has(post.id) ? 'Skryť' : 'Zobraziť'}
                </span>
              )}
            </button>
            
            <button
              onClick={() => toggleFollow(post.id)}
              className={`flex items-center gap-1 text-xs ml-auto transition-colors ${
                followedPosts.has(post.id) 
                  ? 'text-[#6B4C3B] font-medium' 
                  : 'text-[#A0907E] hover:text-[#6B4C3B]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
              {followedPosts.has(post.id) ? 'Sledované' : 'Sledovať'}
            </button>
          </div>

          {/* Expanded Comments */}
          {expandedComments.has(post.id) && post.commentsData && (
            <div className="space-y-3 pt-3 border-t border-white/30">
              {post.commentsData.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 pl-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#B8864A] to-[#D0BCA8] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#2E2218]">{comment.author}</span>
                      <span className="text-xs text-[#A0907E]">{comment.time}</span>
                    </div>
                    <p className="text-xs text-[#2E2218] mb-1">{comment.text}</p>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-[#A0907E] hover:text-red-400 transition-colors">
                        <Heart className="w-3 h-3" strokeWidth={1.5} />
                        {comment.likes}
                      </button>
                      <button 
                        onClick={() => startReply(post.id, comment.id)}
                        className="text-xs text-[#A0907E] hover:text-[#6B4C3B] transition-colors"
                      >
                        Odpovedať
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Reply Input */}
              {replyingTo && replyingTo.postId === post.id && (
                <div className="mt-3 pl-10">
                  <div className="flex items-start gap-3 p-3 bg-white/20 rounded-xl border border-white/35">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#B8864A] to-[#D0BCA8] flex-shrink-0" />
                    <div className="flex-1">
                      <textarea
                        autoFocus
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Napíš svoju odpoveď..."
                        className="w-full text-xs bg-transparent border-none outline-none resize-none min-h-[60px] placeholder:text-[#A0907E]"
                        style={{ color: colors.textPrimary }}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <button 
                          onClick={() => setReplyingTo(null)}
                          className="text-xs text-[#A0907E] hover:text-[#6B4C3B] transition-colors"
                        >
                          Zrušiť
                        </button>
                        <button
                          onClick={submitReply}
                          disabled={!replyText.trim()}
                          className="px-3 py-1.5 bg-[#6B4C3B] text-white text-xs font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                          Odpovedať
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Challenges section removed per feedback */}
        </>
      )}

      {/* Partner Discounts Tab Content */}
      {activeTab === 'discounts' && (
        <PartnerDiscountsSection />
      )}
    </div>
  );
}

// Partner Discounts Section Component
function PartnerDiscountsSection() {
  const { stats } = useAchievements();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const availableDiscounts = getAvailableDiscounts(stats.totalPoints);
  const nextDiscount = getNextDiscount(stats.totalPoints);
  const userLevel = Math.floor(stats.totalPoints / 250);

  const copyDiscountCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 text-center">
        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
          <Gift className="w-6 h-6" style={{ color: '#B8864A' }} />
        </div>
        <h2 className="text-[16px] font-semibold mb-1" style={{ color: '#2E2218' }}>
          Zľavy partnerov Level {userLevel}
        </h2>
        <p className="text-sm" style={{ color: '#6B4C3B' }}>
          {stats.totalPoints} bodov • {availableDiscounts.length} zľav odomknutých
        </p>
      </div>

      {/* Next Unlock Preview */}
      {nextDiscount && (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100">
              <Lock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold" style={{ color: '#2E2218' }}>
                Ďalšia zľava už čoskoro!
              </h3>
              <p className="text-xs" style={{ color: '#6B4C3B' }}>
                {nextDiscount.requiredPoints - stats.totalPoints} bodov do odomknutia
              </p>
            </div>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getCategoryColor(nextDiscount.category)}20` }}>
              {(() => {
                const iconName = getCategoryIcon(nextDiscount.category);
                const iconProps = { className: "w-4 h-4", style: { color: getCategoryColor(nextDiscount.category) } };
                switch (iconName) {
                  case 'Dumbbell':
                    return <Dumbbell {...iconProps} />;
                  case 'Heart':
                    return <Heart {...iconProps} />;
                  case 'Leaf':
                    return <Leaf {...iconProps} />;
                  case 'Shirt':
                    return <Shirt {...iconProps} />;
                  case 'Watch':
                    return <Watch {...iconProps} />;
                  default:
                    return <Gift {...iconProps} />;
                }
              })()}
            </div>
          </div>
          <div className="bg-gray-100/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-gray-700">{nextDiscount.partner}</span>
              <span className="font-bold text-sm" style={{ color: getCategoryColor(nextDiscount.category) }}>
                {nextDiscount.discount}
              </span>
            </div>
            <p className="text-xs text-gray-600">{nextDiscount.description}</p>
          </div>
        </div>
      )}

      {/* Available Discounts */}
      {availableDiscounts.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold px-1" style={{ color: '#2E2218' }}>
            Tvoje zľavy ({availableDiscounts.length})
          </h3>
          {availableDiscounts.map((discount) => (
            <div key={discount.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: getCategoryColor(discount.category) }}
                >
                  {(() => {
                    const iconName = getCategoryIcon(discount.category);
                    switch (iconName) {
                      case 'Dumbbell':
                        return <Dumbbell className="w-6 h-6" />;
                      case 'Heart':
                        return <Heart className="w-6 h-6" />;
                      case 'Leaf':
                        return <Leaf className="w-6 h-6" />;
                      case 'Shirt':
                        return <Shirt className="w-6 h-6" />;
                      case 'Watch':
                        return <Watch className="w-6 h-6" />;
                      default:
                        return <Gift className="w-6 h-6" />;
                    }
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: '#2E2218' }}>
                        {discount.partner}
                      </h4>
                      <p className="text-xs" style={{ color: '#6B4C3B' }}>
                        {discount.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg" style={{ color: getCategoryColor(discount.category) }}>
                        {discount.discount}
                      </div>
                      <div className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Level {discount.requiredLevel}
                      </div>
                    </div>
                  </div>
                  
                  {discount.code && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 bg-white/50 border border-white/40 rounded-lg px-3 py-2 font-mono text-sm font-semibold">
                        {discount.code}
                      </div>
                      <button
                        onClick={() => copyDiscountCode(discount.code!)}
                        className="p-2 bg-[#6B4C3B] text-white rounded-lg hover:bg-[#5A3E2F] transition-colors active:scale-95"
                      >
                        {copiedCode === discount.code ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {discount.link && (
                    <button
                      onClick={() => window.open(discount.link, '_blank')}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-[#6B4C3B] text-white rounded-lg text-sm font-medium hover:bg-[#5A3E2F] transition-colors active:scale-95"
                    >
                      Prejsť na stránku
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center">
          <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gray-100">
            <Gift className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#2E2218' }}>
            Zatiaľ žiadne zľavy
          </h3>
          <p className="text-sm mb-4" style={{ color: '#6B4C3B' }}>
            Získaj 250 bodov a odomkni svoje prvé zľavy od partnerov!
          </p>
          <div className="text-xs" style={{ color: '#8B7560' }}>
            Komentuj príspevky • Lajkuj • Motivuj ostatné • Zdieľaj skúsenosti
          </div>
        </div>
      )}

      {/* How to Earn Points */}
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#2E2218' }}>
          Ako získať body?
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span style={{ color: '#6B4C3B' }}>Lajkni príspevok</span>
            <span className="ml-auto font-semibold text-green-600">+5 bodov</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span style={{ color: '#6B4C3B' }}>Napíš komentár</span>
            <span className="ml-auto font-semibold text-green-600">+10 bodov</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Send className="w-4 h-4 text-purple-500" />
            <span style={{ color: '#6B4C3B' }}>Pridaj príspevok</span>
            <span className="ml-auto font-semibold text-green-600">+25 bodov</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <UserPlus className="w-4 h-4 text-orange-500" />
            <span style={{ color: '#6B4C3B' }}>Pozvi kamarátku</span>
            <span className="ml-auto font-semibold text-green-600">+100 bodov</span>
          </div>
        </div>
      </div>

      {copiedCode && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-green-500 text-white text-sm font-medium px-4 py-3 rounded-2xl text-center shadow-lg">
          Kód skopírovaný! ✓
        </div>
      )}
    </div>
  );
}
