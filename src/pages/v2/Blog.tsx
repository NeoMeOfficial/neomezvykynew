import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Blog — R7 list (variant A: editorial magazine)
 *
 * Available to all users (Free + Plus). Featured article + category
 * chips + latest section. Article detail is handled by an existing
 * route (no canonical detail screen ported yet — that's a follow-up).
 *
 * F-025 status: public.blog_posts schema (migration 20260416) and the
 * useBlogPosts() hook are in place. This list still renders from the
 * static ARTICLES constant below; cut over to `const { posts } =
 * useBlogPosts()` once Gabi has authored real entries via Supabase
 * Studio. The hook ships fallback rows so cutover is one-line.
 *
 * Old version: Blog.old.tsx.
 */

const CAT_COLOR: Record<string, string> = {
  Telo: NM.TERRA,
  Strava: NM.GOLD,
  Myseľ: NM.MAUVE,
  Cyklus: NM.DUSTY,
  Postpartum: NM.SAGE,
};

interface Article {
  id: number;
  cat: keyof typeof CAT_COLOR;
  title: string;
  excerpt: string;
  author: string;
  read: string;
  date: string;
  img: string;
}

const ARTICLES: Article[] = [
  { id: 1, cat: 'Postpartum', title: 'Prvých 40 dní po pôrode — čo potrebuje tvoje telo', excerpt: 'Stručný sprievodca jemným návratom k pohybu, spánku a blízkosti.', author: 'Dr. Veronika Horváth', read: '6 min', date: '2. jún', img: 'blog-postpartum-recovery.jpg' },
  { id: 2, cat: 'Cyklus', title: 'Ako plánovať tréning podľa fáz cyklu', excerpt: 'Folikulárna, ovulačná, luteálna, menštruačná — každá má svoj rytmus.', author: 'Andrea Vrábelová', read: '8 min', date: '28. máj', img: 'blog-cycle-training.jpg' },
  { id: 3, cat: 'Strava', title: 'Železo po pôrode: 7 jedál, ktoré vrátia energiu', excerpt: 'Nie suplement. Skutočné jedlo, ktoré si dáš bez nervov aj s bábätkom na rukách.', author: 'Mária Kučerová', read: '5 min', date: '24. máj', img: 'blog-iron-rich-foods.jpg' },
  { id: 4, cat: 'Myseľ', title: 'Keď sa vráti úzkosť — tri jemné kroky', excerpt: 'Čo pomáha, keď ráno otvoríš oči a hruď sa ti zviera.', author: 'Jana Bartošová', read: '4 min', date: '21. máj', img: 'blog-morning-anxiety.jpg' },
  { id: 5, cat: 'Telo', title: 'Diastáza: ako ju rozpoznať a prvé bezpečné cviky', excerpt: 'Bez strachu. Bez hanby. S telom, ktoré sa lieči.', author: 'Dr. Veronika Horváth', read: '7 min', date: '18. máj', img: 'blog-diastasis.jpg' },
  { id: 6, cat: 'Strava', title: 'Čo jesť v luteálnej fáze, aby si nemala chute', excerpt: 'Magnézium, B6 a pár jednoduchých receptov.', author: 'Mária Kučerová', read: '5 min', date: '14. máj', img: 'blog-luteal-nutrition.jpg' },
];

const CATS = ['Všetko', 'Telo', 'Strava', 'Myseľ', 'Cyklus', 'Postpartum'] as const;

export default function Blog() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<string>('Všetko');
  const visible = cat === 'Všetko' ? ARTICLES : ARTICLES.filter((a) => a.cat === cat);
  const feat = visible[0];
  const rest = visible.slice(1);

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

      {feat && (
        <div style={{ margin: '20px 22px 0' }}>
          <button
            onClick={() => navigate(`/blog/${feat.id}`)}
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
                backgroundImage: `url(/images/r9/${feat.img})`,
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
                    background: `${CAT_COLOR[feat.cat]}18`,
                    color: CAT_COLOR[feat.cat],
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
                <span style={{ width: 3, height: 3, borderRadius: 999, background: NM.HAIR_2 }} />
                <span>{feat.date}</span>
              </div>
            </div>
          </button>
        </div>
      )}

      <div style={{ margin: '28px 22px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Najnovšie</Eye>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {rest.map((a) => (
            <button
              key={a.id}
              onClick={() => navigate(`/blog/${a.id}`)}
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
                  backgroundImage: `url(/images/r9/${a.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: NM.SANS, fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: CAT_COLOR[a.cat], fontWeight: 500 }}>{a.cat}</span>
                </div>
                <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{a.title}</div>
                <div style={{ marginTop: 6, fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, fontWeight: 400 }}>
                  {a.read} · {a.date}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Page>
  );
}
