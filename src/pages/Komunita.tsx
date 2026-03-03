import { useState, useEffect, useCallback } from 'react';
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
  Users,
  ArrowLeft,
} from 'lucide-react';
import BuddyShortcut from '../../components/v2/buddy/BuddyShortcut';
import { useNavigate } from 'react-router-dom';

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

  // Composer state
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [composerType, setComposerType] = useState<'post' | 'question'>('post');

  // Feed state
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [nextId, setNextId] = useState(6);
  
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
    const newPost: Post = {
      id: nextId,
      type: composerType,
      author: 'Katka',
      text: composerText.trim(),
      likes: 0,
      comments: 0,
      time: 'práve teraz',
    };
    setPosts((prev) => [newPost, ...prev]);
    setNextId((n) => n + 1);
    setComposerText('');
    setComposerExpanded(false);
    setComposerType('post');
  }, [composerText, composerType, nextId]);

  const toggleLike = useCallback((id: number) => {
    const isCurrentlyLiked = likedIds.has(id);
    
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, [likedIds]);

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

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:scale-[1.01]' : ''} ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(184, 134, 74, 0.08), 0 6px 24px rgba(184, 134, 74, 0.04), 0 3px 12px rgba(184, 134, 74, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

  return (
    <div 
      className="w-full min-h-screen px-3 py-6 pb-28 space-y-6 relative"
      style={{ 
        background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)', 
        minHeight: '100vh' 
      }}
    >
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-[#6B4C3B] text-white text-xs font-medium px-4 py-3 rounded-2xl text-center shadow-lg">
          Ďakujeme, nahlásenie bolo odoslané administrátorovi ✓
        </div>
      )}

      {/* Nordic Header */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
              <Users className="w-4 h-4" style={{ color: '#B8864A' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Komunita</h1>
          </div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `rgba(184, 134, 74, 0.14)` }}>
            <Heart className="w-6 h-6" style={{ color: '#B8864A' }} />
          </div>
          <h2 className="text-[15px] font-semibold mb-1" style={{ color: '#2E2218' }}>
            Vitaj v komunite 2 400+ žien
          </h2>
          <p className="text-[13px]" style={{ color: '#A89B8C' }}>
            Zdieľaj, motivuj sa a rast spolu s nami
          </p>
        </div>
      </NordicCard>

      {/* Daily Achievements */}
      <NordicCard className="p-4">
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

      {/* Buddy System & Workout Demo */}
      <div className="space-y-4">
        <BuddyShortcut />
        
        {/* Workout Demo Card */}
        <NordicCard className="p-4">
          <button
            onClick={() => navigate('/workout-demo')}
            className="w-full flex items-center gap-3 text-left hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(122, 158, 120, 0.14)' }}>
              <Dumbbell size={18} className="text-[#7A9E78]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium" style={{ color: '#2E2218' }}>Workout Demo</h3>
              <p className="text-xs text-gray-600">
                Skús interaktívne cvičenia a získaj body
              </p>
            </div>

            <div className="text-xs px-2 py-1 rounded-full font-medium text-[#7A9E78]" style={{ background: 'rgba(122, 158, 120, 0.14)' }}>
              Skúsiť
            </div>
          </button>
        </div>
      </div>

      {/* Post Composer */}
      <NordicCard className="p-4">
        {!composerExpanded ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B8864A] to-[#D0BCA8] flex-shrink-0" />
            <button
              onClick={() => setComposerExpanded(true)}
              className="flex-1 text-left text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-3 hover:bg-gray-100 transition-colors"
            >
              Čo máš na srdci, Katka?
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
                placeholder="Čo máš na srdci, Katka?"
                className="flex-1 text-sm bg-gray-50 rounded-2xl px-4 py-3 resize-none outline-none min-h-[80px] placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200 border border-gray-100"
                style={{ color: '#2E2218' }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setComposerType('post')}
                  className={`text-xs font-medium px-3 py-2 rounded-xl transition-colors ${
                    composerType === 'post'
                      ? 'bg-[#6B4C3B] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Príspevok
                </button>
                <button
                  onClick={() => setComposerType('question')}
                  className={`text-xs font-medium px-3 py-2 rounded-xl transition-colors ${
                    composerType === 'question'
                      ? 'bg-[#6B4C3B] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Otázka
                </button>
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
        <NordicCard className="p-4">
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
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
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
                        {post.likes + (likedIds.has(post.id) ? 1 : 0)}
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
        </NordicCard>
      )}

      {/* 6. Feed Section */}
      <h2 className="text-[15px] font-semibold text-[#2E2218] pt-1">Novinky</h2>
      {posts.map((post) => (
        <NordicCard key={post.id} className="p-4">
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
                className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
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
              {post.likes + (likedIds.has(post.id) ? 1 : 0)}
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
            <div className="space-y-3 pt-3 border-t border-gray-100">
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
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
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
        </NordicCard>
      ))}

      {/* Challenges section removed per feedback */}
    </div>
  );
}
