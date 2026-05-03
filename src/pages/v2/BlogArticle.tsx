import { useNavigate, useParams } from 'react-router-dom';
import { Page, Eye, Ser, NM } from '../../components/v2/neome';
import { useBlogPost } from '../../hooks/useBlog';

const CAT_COLOR: Record<string, string> = {
  Telo: NM.TERRA,
  Strava: NM.GOLD,
  Myseľ: NM.MAUVE,
  Cyklus: NM.DUSTY,
  Postpartum: NM.SAGE,
  Všeobecné: NM.MUTED ?? '#A0907E',
};

const DB_CAT_TO_DISPLAY: Record<string, string> = {
  general: 'Všeobecné',
  vyziva: 'Strava',
  pohyb: 'Telo',
  mysel: 'Myseľ',
  cyklus: 'Cyklus',
  materstvo: 'Postpartum',
};

function readTime(content: string | null): string {
  if (!content) return '3 min';
  return `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });
}


export default function BlogArticle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { post, loading } = useBlogPost(id);

  if (loading) {
    return (
      <Page paddingBottom={40}>
        <div style={{ padding: '40px 22px', textAlign: 'center', fontFamily: NM.SANS, fontSize: 13, color: NM.EYEBROW }}>
          Načítavam…
        </div>
      </Page>
    );
  }

  if (!post) {
    return (
      <Page paddingBottom={40}>
        <div style={{ padding: '40px 22px', textAlign: 'center' }}>
          <button onClick={() => navigate(-1)} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13, color: NM.EYEBROW }}>
            ← Späť
          </button>
          <p style={{ marginTop: 20, fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP }}>Príspevok nebol nájdený.</p>
        </div>
      </Page>
    );
  }

  const cat = DB_CAT_TO_DISPLAY[post.category] ?? post.category;
  const catColor = CAT_COLOR[cat] ?? NM.MUTED;

  return (
    <Page paddingBottom={40}>
      <div
        style={{
          position: 'relative',
          height: 400,
          backgroundImage: post.cover_image ? `url(${post.cover_image})` : undefined,
          backgroundColor: post.cover_image ? undefined : NM.CREAM_2 ?? '#F1ECE3',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0.25) 0%, transparent 35%, rgba(42,26,20,0.78) 100%)' }} />
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 8px)', left: 18, right: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Späť"
            style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ padding: '4px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', color: '#fff', fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              {cat}
            </span>
            <span style={{ fontFamily: NM.SANS, fontSize: 10.5, color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{readTime(post.content)} čítania</span>
          </div>
          <Ser size={30} color="#fff" style={{ letterSpacing: '-0.015em' }}>{post.title}</Ser>
        </div>
      </div>

      <div style={{ padding: '22px 18px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, fontWeight: 500 }}>{post.author}</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 1, fontWeight: 400 }}>
            {formatDate(post.published_at)}
          </div>
        </div>
      </div>

      <div
        className="blog-prose"
        style={{ padding: '22px 22px 0' }}
        dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
      />
    </Page>
  );
}
