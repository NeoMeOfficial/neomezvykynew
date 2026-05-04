import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/v2/top-bar';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SectionHeader } from '@/components/ui/section-header';
import { ChevronRight, Play, Check } from 'lucide-react';

const MEDITATIONS = [
  { id: 'upokojenie', name: 'Upokojenie úzkosti', dur: '12 min', cat: 'Emócie', done: true },
  { id: 'spanok',     name: 'Dych pre spánok',    dur: '15 min', cat: 'Večer',  done: false },
  { id: 'prijatie',   name: 'Prijatie tela',       dur: '8 min',  cat: 'Telo',   done: false },
];

export default function MyselNew() {
  const navigate = useNavigate();
  const today = new Date();
  const dateLabel = `${['Nedeľa','Pondelok','Utorok','Streda','Štvrtok','Piatok','Sobota'][today.getDay()]} · ${today.getDate()}. ${today.getMonth() + 1}.`;

  return (
    <div className="min-h-screen bg-cream pb-12">
      <TopBar title="Myseľ" backHref="/kniznica" />

      <div className="px-5 pb-6">
        <SerifHeader as="h1" size="h1">
          Priestor{' '}
          <em className="text-mauve not-italic font-serif italic">pre seba</em>.
        </SerifHeader>
        <BodyText tone="secondary" className="mt-2 max-w-[320px]">
          Meditácie pre ranné stíšenie aj večerný oddych. Reflexie, keď potrebuješ niekoho vypočuť.
        </BodyText>
      </div>

      {/* Daily reflection prompt */}
      <div className="px-5 mb-6">
        <div className="rounded-card p-5 bg-cream-200 border border-ink/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <Eyebrow tone="gold">Dnešné zamyslenie</Eyebrow>
            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink/40">{dateLabel}</span>
          </div>
          <SerifHeader as="div" size="h2" className="leading-snug mb-4">
            Za čo si dnes vďačná — aj keď je to len malý moment?
          </SerifHeader>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dennik/new')}
              className="px-4 py-2 bg-ink text-cream rounded-full font-sans text-sm font-medium transition-all active:scale-95"
            >
              Napísať
            </button>
            <span className="font-sans text-sm text-ink/40">~3 minúty</span>
          </div>
        </div>
      </div>

      {/* Featured meditation hero */}
      <div className="px-5 mb-5">
        <div className="flex items-baseline justify-between mb-3">
          <Eyebrow tone="muted">Meditácie</Eyebrow>
          <button
            onClick={() => navigate('/meditacie')}
            className="font-sans text-[11px] text-ink/40"
          >
            Všetky · 28
          </button>
        </div>
        <button
          onClick={() => navigate('/meditacie')}
          style={{
            display: 'block', width: '100%', border: 'none', cursor: 'pointer',
            borderRadius: 18, overflow: 'hidden', aspectRatio: '16/10', position: 'relative',
            backgroundImage: 'url(/images/r9/section-mind.jpg)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 100%)' }} />
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 18, color: '#fff', textAlign: 'left' }}>
            <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
              Ranná meditácia · 10 min
            </div>
            <div style={{ fontFamily: 'Gilda Display, serif', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.05, marginBottom: 14 }}>
              Ticho pred dňom
            </div>
            <div style={{
              width: 42, height: 42, borderRadius: 999, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="#3D2921">
                <path d="M1 1v12l10-6L1 1z"/>
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Meditation list */}
      <div className="px-5 mb-6">
        <div className="flex flex-col gap-2">
          {MEDITATIONS.map(m => (
            <button
              key={m.id}
              onClick={() => navigate(`/meditacia/${m.id}`)}
              className="w-full text-left rounded-card p-4 bg-white border border-ink/[0.08] shadow-nm-sm flex items-center gap-4 transition-all active:scale-[0.99]"
            >
              <div className="h-10 w-10 rounded-full bg-pillar-mysel/15 flex items-center justify-center flex-shrink-0">
                <Play className="size-4 text-pillar-mysel fill-pillar-mysel" />
              </div>
              <div className="flex-1 min-w-0">
                <Eyebrow tone="muted" className="mb-0.5">{m.cat} · {m.dur}</Eyebrow>
                <div className="font-serif text-h3 text-ink leading-snug">{m.name}</div>
              </div>
              {m.done
                ? <div className="h-6 w-6 rounded-full bg-pillar-strava flex items-center justify-center flex-shrink-0"><Check className="size-3 text-white" /></div>
                : <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
              }
            </button>
          ))}
        </div>
      </div>

      {/* Reflections */}
      <div className="px-5">
        <SectionHeader
          eyebrow="Tvoje reflexie"
          link="História"
          onLinkClick={() => navigate('/kniznica/dennik')}
          className="mb-3"
        />
        <div className="rounded-card bg-white border border-ink/[0.08] shadow-nm-sm overflow-hidden">
          {[
            { date: '11. 3.', preview: 'Dlhá prechádzka s Luciou. Rozhovor o tom, že nemusím mať všetko pod kontrolou…' },
            { date: '10. 3.', preview: 'Pri ranom pilatese. Bolo to len o mne a tele, bez nikoho kto ma pozoruje…' },
          ].map((r, i, arr) => (
            <div key={r.date} className={`px-5 py-4 ${i < arr.length - 1 ? 'border-b border-ink/[0.06]' : ''}`}>
              <Eyebrow tone="muted" className="mb-1">{r.date}</Eyebrow>
              <BodyText size="sm" tone="secondary" className="line-clamp-2">{r.preview}</BodyText>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
