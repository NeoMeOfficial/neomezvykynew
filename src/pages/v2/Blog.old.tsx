import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme/warmDusk';
import { supabase } from '../../lib/supabase';

type BlogPost = {
  id: number | string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
};

const staticBlogPosts: BlogPost[] = [
  { id: 1, title: '5 najčastejších chýb pri cvičení po pôrode', excerpt: 'Mnoho žien robia tieto chyby, keď sa vracajú k cvičeniu po pôrode. Pozri si, ako sa im vyhnúť.', author: 'Gabi Novakova', date: '15. marec 2026', category: 'Postpartum', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop', readTime: '5 min čítania' },
  { id: 2, title: 'Ako si vytvoriť zdravý jedálniček na celý týždeň', excerpt: 'Praktické tipy pre plánovanie jedla, ktoré ti ušetria čas a pomôžu dosiahnuť tvoje ciele.', author: 'Gabi Novakova', date: '12. marec 2026', category: 'Výživa', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=250&fit=crop', readTime: '7 min čítania' },
  { id: 3, title: 'Diastáza recti: Čo je to a ako ju riešiť', excerpt: 'Kompletný sprievodca rozchodom brušných svalov po pôrode a ako s ním efektívne pracovať.', author: 'Gabi Novakova', date: '10. marec 2026', category: 'Zdravie', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop', readTime: '8 min čítania' },
  { id: 4, title: 'Meditácia pre začiatočníkov: Prvé kroky', excerpt: 'Jednoduchý návod, ako začať s meditáciou a vytvoriť si pravidelný návyk.', author: 'Gabi Novakova', date: '8. marec 2026', category: 'Mindfulness', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', readTime: '4 min čítania' },
];

const categories = ['Všetky', 'Postpartum', 'Výživa', 'Zdravie', 'Mindfulness', 'Cvičenie'];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Postpartum': return colors.periodka;
    case 'Výživa': return colors.strava;
    case 'Zdravie': return colors.telo;
    case 'Mindfulness': return colors.mysel;
    case 'Cvičenie': return colors.accent;
    default: return colors.textSecondary;
  }
};

export default function Blog() {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(staticBlogPosts);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id,title,excerpt,author,published_at,category,image,read_time')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setBlogPosts(data.map(p => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt,
          author: p.author,
          date: new Date(p.published_at).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }),
          category: p.category,
          image: p.image || '',
          readTime: p.read_time || '5 min čítania',
        })));
      });
  }, []);

  return (
    <div className="min-h-screen pb-28" style={{ background: colors.bgGradient }}>
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-5 h-5 text-[#8B7560]" strokeWidth={1.5} />
            </button>
            <div className="flex-1">
              <h1 className="text-[22px] font-medium leading-tight" style={{ color: colors.textPrimary, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
                NeoMe Blog
              </h1>
              <p className="text-[12px]" style={{ color: colors.textSecondary }}>
                Tipy, rady a inšpirácia pre zdravý životný štýl
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className="text-xs px-3 py-2 rounded-xl bg-white/40 text-nowrap hover:bg-white/60 transition-colors"
                style={{ color: colors.textPrimary }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-white/20 cursor-pointer hover:bg-white/40 transition-colors"
            >
              <div className="flex gap-4 p-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: `${getCategoryColor(post.category)}20`, color: getCategoryColor(post.category) }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs" style={{ color: colors.textTertiary }}>
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-2 line-clamp-2" style={{ color: colors.textPrimary }}>
                    {post.title}
                  </h3>
                  <p className="text-xs mb-2 line-clamp-2" style={{ color: colors.textSecondary }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/20 text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
            Čoskoro pridáme viac článkov!
          </h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Gabi pre vás pripravuje užitočné články o cvičení, výžive a zdravom životnom štýle.
            Sledujte túto sekciu pre najnovšie tipy a rady.
          </p>
        </div>
      </div>
    </div>
  );
}
