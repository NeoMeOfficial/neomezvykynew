import { useNavigate, useParams } from 'react-router-dom';
import { Page, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Blog article — R7 variant A (magazine long-read)
 *
 * Full-bleed photo hero with title overlay, author byline, pullquote,
 * body w/ drop-cap on first paragraph, hashtag footer, related rail.
 *
 * F-025 status: public.blog_posts schema (migration 20260416) and the
 * useBlogPost(slug) hook are in place. This page still renders from
 * the hardcoded ARTICLES constant. Outstanding work to cut over:
 *   - Add react-markdown for body_md rendering (the editorial layout
 *     here uses sectioned { heading, text } pairs; markdown is flatter)
 *   - Map blog_posts.category (general/vyziva/pohyb/mysel/cyklus/
 *     materstvo) to the existing CAT_COLOR keys
 *   - Schema currently has `author` as plain text; extend with
 *     author_role + author_image before cut-over
 *
 * Mounted at /blog/:id.
 */

interface Article {
  id: number;
  slug: string;
  cat: 'Postpartum' | 'Cyklus' | 'Strava' | 'Myseľ' | 'Telo';
  title: string;
  titleEm?: string;
  excerpt: string;
  pull?: string;
  body: { heading: string; text: string }[];
  author: string;
  authorRole: string;
  authorImg: string;
  read: string;
  date: string;
  img: string;
}

const CAT_COLOR: Record<Article['cat'], string> = {
  Postpartum: NM.SAGE,
  Cyklus: NM.DUSTY,
  Strava: NM.GOLD,
  Myseľ: NM.MAUVE,
  Telo: NM.TERRA,
};

const ARTICLES: Article[] = [
  {
    id: 1,
    slug: 'prvych-40-dni',
    cat: 'Postpartum',
    title: 'Prvých',
    titleEm: '40 dní',
    excerpt: 'Stručný sprievodca jemným návratom k pohybu, spánku a blízkosti.',
    pull: 'Prvých štyridsať dní nie je o návrate. Sú o usadení — v novej verzii seba, s novým malým vedľa.',
    body: [
      { heading: 'Prvý týždeň — pokoj a teplo', text: 'Tvoje telo práve dokončilo veľkú prácu. Nežiadaj od neho teraz rýchlosť — žiadaj o teplo, tekutiny, a odpočinok. V prvých siedmich dňoch sa posúvaš len toľko, koľko potrebuješ: z postele do kúpeľne, z postele ku kojeniu. Panvové dno je oslabené nie kvôli tebe, ale kvôli zázraku, ktorým si prešla. Dýchanie do brucha — dlhé, tiché — je jediné „cvičenie", ktoré teraz potrebuješ.' },
      { heading: 'Týždne 2–4 — jemný návrat', text: 'Krátke prechádzky. Pár minút von. Obidvom vám to pomôže. Aktivácia panvového dna sa začína až teraz — a aj tak ticho, iba kým si v sede alebo ležíš.' },
      { heading: 'Týždne 5–6 — vlastný rytmus', text: 'Začni vnímať, čo ti telo dovoľuje. Žiadne porovnávanie. Čas na prvé jemné funkčné cvičenia — postpartum program v NeoMe je presne pre tento moment.' },
    ],
    author: 'Dr. Veronika Horváth',
    authorRole: 'Gynekologička',
    authorImg: 'testimonial-anna.jpg',
    read: '6 min',
    date: '2. jún 2025',
    img: 'blog-postpartum-recovery.jpg',
  },
  {
    id: 2,
    slug: 'cyklus-trening',
    cat: 'Cyklus',
    title: 'Tréning podľa',
    titleEm: 'fáz cyklu',
    excerpt: 'Folikulárna, ovulačná, luteálna, menštruačná — každá má svoj rytmus.',
    body: [{ heading: 'Folikulárna · sila', text: 'Estrogén stúpa, energia s ním. Toto je obdobie, keď telo najlepšie prijíma silový tréning a nové výzvy.' }],
    author: 'Andrea Vrábelová',
    authorRole: 'Trénerka',
    authorImg: 'testimonial-anna.jpg',
    read: '8 min',
    date: '28. máj 2025',
    img: 'blog-cycle-training.jpg',
  },
];

const RELATED_TITLES = [
  { id: 3, cat: 'Strava' as const, title: 'Železo po pôrode: 7 jedál, ktoré vrátia energiu', img: 'blog-iron-rich-foods.jpg' },
  { id: 4, cat: 'Myseľ' as const, title: 'Keď sa vráti úzkosť — tri jemné kroky', img: 'blog-morning-anxiety.jpg' },
];

export default function BlogArticle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const article = ARTICLES.find((a) => a.id.toString() === id || a.slug === id) ?? ARTICLES[0];

  return (
    <Page paddingBottom={40}>
      <div
        style={{
          position: 'relative',
          height: 400,
          backgroundImage: `url(/images/r9/${article.img})`,
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button aria-label="Uložiť" style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </button>
            <button aria-label="Zdieľať" style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: 999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ padding: '4px 11px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', color: '#fff', fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500 }}>
              {article.cat}
            </span>
            <span style={{ fontFamily: NM.SANS, fontSize: 10.5, color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{article.read} čítania</span>
          </div>
          <Ser size={30} color="#fff" style={{ letterSpacing: '-0.015em' }}>
            {article.title}{' '}
            {article.titleEm && <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>{article.titleEm}</em>}
            {!article.titleEm && ''}
          </Ser>
        </div>
      </div>

      <div style={{ padding: '22px 18px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 999, backgroundImage: `url(/images/r9/${article.authorImg})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, border: `1px solid ${NM.HAIR}` }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, fontWeight: 500 }}>{article.author}</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 1, fontWeight: 400 }}>
            {article.authorRole} · {article.date}
          </div>
        </div>
      </div>

      {article.pull && (
        <div style={{ padding: '22px 18px 0' }}>
          <div style={{ padding: '18px 20px', background: NM.CREAM_2 ?? '#F1ECE3', borderLeft: `3px solid ${CAT_COLOR[article.cat]}`, borderRadius: '0 14px 14px 0' }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 17, fontStyle: 'italic', color: NM.DEEP, lineHeight: 1.5, fontWeight: 400, letterSpacing: '-0.005em' }}>
              „{article.pull}"
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '22px 22px 0' }}>
        {article.body.map((b, i) => (
          <div key={b.heading} style={{ marginBottom: i < article.body.length - 1 ? 24 : 0 }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em', marginBottom: 10 }}>{b.heading}</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP, fontWeight: 300, lineHeight: 1.7, letterSpacing: '0.005em' }}>
              {i === 0 && (
                <span style={{ fontFamily: NM.SERIF, fontSize: 42, fontWeight: 500, color: NM.TERRA, float: 'left', lineHeight: 0.85, marginRight: 8, marginTop: 6, letterSpacing: '-0.04em' }}>
                  {b.text.charAt(0)}
                </span>
              )}
              {i === 0 ? b.text.slice(1) : b.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '28px 22px 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['#postpartum', '#pohyb', '#40dni', '#zotavenie'].map((t) => (
          <span key={t} style={{ padding: '5px 10px', borderRadius: 999, background: NM.CREAM_2 ?? '#F1ECE3', color: NM.MUTED, fontFamily: NM.SANS, fontSize: 11, fontWeight: 400 }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ padding: '28px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Súvisiace</Eye>
        {RELATED_TITLES.map((a) => (
          <button
            key={a.id}
            onClick={() => navigate(`/blog/${a.id}`)}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex', width: '100%', gap: 12, padding: '12px 0', borderBottom: `1px solid ${NM.HAIR}` }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0, backgroundImage: `url(/images/r9/${a.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontFamily: NM.SANS, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: CAT_COLOR[a.cat], fontWeight: 500, marginBottom: 3 }}>{a.cat}</div>
              <div style={{ fontFamily: NM.SERIF, fontSize: 13.5, fontWeight: 500, color: NM.DEEP, lineHeight: 1.25, letterSpacing: '-0.003em' }}>{a.title}</div>
            </div>
          </button>
        ))}
      </div>
    </Page>
  );
}
