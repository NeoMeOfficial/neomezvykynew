import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';
import { useBlogPosts } from '../../hooks/useBlog';

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
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long' });
}

const CATS = ['Všetko', 'Telo', 'Strava', 'Myseľ', 'Cyklus', 'Postpartum'] as const;

export default function Blog() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<string>('Všetko');
  const { posts, loading } = useBlogPosts();

  const mapped = posts.map(p => ({
    slug: p.slug,
    cat: DB_CAT_TO_DISPLAY[p.category] ?? 'Všeobecné',
    title: p.title,
    excerpt: p.excerpt ?? '',
    author: p.author,
    read: readTime(p.content),
    date: formatDate(p.published_at),
    img: p.cover_image ?? null,
  }));

  const visible = cat === 'Všetko' ? mapped : mapped.filter(a => a.cat === cat);
  const feat = visible[0];
  const rest = visible.slice(1);

  if (loading) {
    return (
      <Page>
        <BackHeader title="Knižnica" />
        <div style={{ padding: '40px 22px', textAlign: 'center', fontFamily: NM.SANS, fontSize: 13, color: NM.EYEBROW }}>
          Načítavam…
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <BackHeader title="Knižnica" />

      <div style={{ padding: '0 22px' }}>
        <Ser size={38} style={{ lineHeight: 1.05 }}>
          Blog
          <br />
          <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>NeoMe</em>
        </Ser>
        <Body style={{ marginTop: 10 }}>Slová, ktoré ťa sprevádzajú. Editoriál, odbornosť, intuícia.</Body>
      </div>

      <div style={{ marginTop: 20, paddingLeft: 22, overflowX: 'auto', display: 'flex', gap: 8 }}>
        {CATS.map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '8px 14px',
                borderRadius: 999,
                background: active ? NM.DEEP : '#fff',
                border: active ? '1px solid transparent' : `1px solid ${NM.HAIR}`,
                fontFamily: NM.SANS,
                fontSize: 12,
                color: active ? '#fff' : NM.DEEP,
                fontWeight: 400,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {c}
            </button>
          );
        })}
        <div style={{ paddingRight: 14 }} />
      </div>

      {visible.length === 0 && (
        <div style={{ padding: '40px 22px', textAlign: 'center', fontFamily: NM.SANS, fontSize: 13, color: NM.EYEBROW }}>
          Žiadne príspevky v tejto kategórii.
        </div>
      )}

      {feat && (
        <div style={{ margin: '20px 22px 0' }}>
          <button
            onClick={() => navigate(`/blog/${feat.slug}`)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              borderRadius: 22,
              overflow: 'hidden',
              background: '#fff',
              border: `1px solid ${NM.HAIR}`,
              boxShadow: '0 12px 30px rgba(61,41,33,0.07)',
            }}
          >
            <div
              style={{
                aspectRatio: '5/3',
                backgroundImage: feat.img ? `url(${feat.img})` : undefined,
                backgroundColor: feat.img ? undefined : NM.CREAM_2 ?? '#F1ECE3',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div style={{ padding: '18px 18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: `${CAT_COLOR[feat.cat] ?? NM.MUTED}18`,
                    color: CAT_COLOR[feat.cat] ?? NM.MUTED,
                    fontFamily: NM.SANS,
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  {feat.cat}
                </span>
                <span style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400 }}>Odporúčané</span>
              </div>
              <Ser size={22} style={{ lineHeight: 1.2 }}>{feat.title}</Ser>
              <Body size={12.5} style={{ marginTop: 8 }}>{feat.excerpt}</Body>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, fontWeight: 400 }}>
                <span>{feat.author}</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: NM.HAIR_2 }} />
                <span>{feat.read}</span>
                {feat.date && (
                  <>
                    <span style={{ width: 3, height: 3, borderRadius: 999, background: NM.HAIR_2 }} />
                    <span>{feat.date}</span>
                  </>
                )}
              </div>
            </div>
          </button>
        </div>
      )}

      {rest.length > 0 && (
        <div style={{ margin: '28px 22px 0' }}>
          <Eye size={10} style={{ marginBottom: 12 }}>Najnovšie</Eye>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rest.map((a) => (
              <button
                key={a.slug}
                onClick={() => navigate(`/blog/${a.slug}`)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 12,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 14,
                    flexShrink: 0,
                    backgroundImage: a.img ? `url(${a.img})` : undefined,
                    backgroundColor: a.img ? undefined : NM.CREAM_2 ?? '#F1ECE3',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontFamily: NM.SANS, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: CAT_COLOR[a.cat] ?? NM.MUTED, fontWeight: 500 }}>{a.cat}</span>
                  </div>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{a.title}</div>
                  <div style={{ marginTop: 6, fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, fontWeight: 400 }}>
                    {a.read}{a.date ? ` · ${a.date}` : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}
