import React, { useState } from 'react';
import { Video, Image as ImageIcon, Upload, Layers, Link2 } from 'lucide-react';
import VideoManager from './VideoManager';
import PhotoManager from './PhotoManager';

const A = {
  BG:       '#F8F5F0',
  CARD:     '#FFFFFF',
  CREAM2:   '#F1ECE3',
  DEEP:     '#3D2921',
  EYEBROW:  'rgba(61,41,33,0.55)',
  MUTED:    'rgba(61,41,33,0.72)',
  TERTIARY: 'rgba(61,41,33,0.42)',
  HAIR:     'rgba(61,41,33,0.08)',
  HAIR2:    'rgba(61,41,33,0.14)',
  GOLD:     '#B8864A',
  SAGE:     '#8B9E88',
  TERRA:    '#C1856A',
  MAUVE:    '#A8848B',
};

interface ContentManagerProps {
  activeTab?: 'videos' | 'photos' | 'overview';
}

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: A.CARD, borderRadius: 16, border: `1px solid ${A.HAIR}`, padding: '22px 24px', ...style }}>{children}</div>
);

const Btn = ({ children, onClick, variant = 'default' }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'danger' | 'success' | 'default';
}) => {
  const base: React.CSSProperties = { border: 'none', borderRadius: 10, padding: '10px 16px', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer' };
  const variants = {
    primary: { background: A.DEEP, color: '#fff' },
    danger:  { background: A.TERRA, color: '#fff' },
    success: { background: A.SAGE,  color: '#fff' },
    default: { background: A.CREAM2, color: A.DEEP },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

export default function ContentManager({ activeTab = 'overview' }: ContentManagerProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const stats = {
    videos: {
      total: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').length,
      published: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.published).length,
      categories: {
        exercise:  JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'exercise').length,
        meditation: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'meditation').length,
        program:   JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'program').length,
        tutorial:  JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'tutorial').length,
      }
    },
    photos: {
      total: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').length,
      totalSize: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').reduce((sum: number, p: any) => sum + (p.size || 0), 0),
      categories: {
        recipe:   JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'recipe').length,
        exercise: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'exercise').length,
        profile:  JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'profile').length,
        banner:   JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'banner').length,
        general:  JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'general').length,
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Video size={22} color={A.TERRA} />
            <div>
              <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.005em', margin: 0 }}>Videá</h3>
              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: 0 }}>Cvičenia, meditácie, tutoriály</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 20, fontWeight: 700, color: A.DEEP }}>{stats.videos.published}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED }}>Publikované</div>
            </div>
            <div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 20, fontWeight: 700, color: A.TERTIARY }}>{stats.videos.total - stats.videos.published}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED }}>Koncepty</div>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('videos')}
            style={{ background: A.DEEP, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer', width: '100%' }}
          >
            Spravovať videá
          </button>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <ImageIcon size={22} color={A.SAGE} />
            <div>
              <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.005em', margin: 0 }}>Obrázky</h3>
              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: 0 }}>Fotky, ilustrácie, bannery</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, textAlign: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 20, fontWeight: 700, color: A.DEEP }}>{stats.photos.total}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED }}>Súborov</div>
            </div>
            <div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 18, fontWeight: 700, color: A.TERTIARY }}>{formatFileSize(stats.photos.totalSize)}</div>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED }}>Veľkosť</div>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('photos')}
            style={{ background: A.SAGE, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer', width: '100%' }}
          >
            Spravovať obrázky
          </button>
        </Card>
      </div>

      {/* Content Guidelines */}
      <Card>
        <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.005em', marginBottom: 16, marginTop: 0 }}>Content Guidelines</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Video size={14} color={A.TERRA} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, color: A.DEEP, margin: '0 0 2px' }}>Videá</p>
              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: 0, lineHeight: 1.6 }}>
                YouTube linky pre hosting<br/>
                Jasné názvy a popisy<br/>
                Správne tagy a kategórie
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <ImageIcon size={14} color={A.SAGE} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, color: A.DEEP, margin: '0 0 2px' }}>Obrázky</p>
              <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: 0, lineHeight: 1.6 }}>
                Max 5MB per súbor<br/>
                WebP/JPG formáty<br/>
                Alt text pre prístupnosť
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Video Categories Breakdown */}
      <Card>
        <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.005em', marginBottom: 16, marginTop: 0 }}>Kategórie videí</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {Object.entries(stats.videos.categories).map(([category, count]) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: A.CREAM2, borderRadius: 10 }}>
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, color: A.DEEP }}>
                {category === 'exercise' ? 'Cvičenia' :
                 category === 'meditation' ? 'Meditácie' :
                 category === 'program' ? 'Programy' : 'Tutoriály'}
              </span>
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 700, color: A.TERRA }}>{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Photo Categories Breakdown */}
      <Card>
        <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.005em', marginBottom: 16, marginTop: 0 }}>Kategórie obrázkov</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {Object.entries(stats.photos.categories).map(([category, count]) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: A.CREAM2, borderRadius: 10 }}>
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, color: A.DEEP }}>
                {category === 'recipe' ? 'Recepty' :
                 category === 'exercise' ? 'Cvičenia' :
                 category === 'profile' ? 'Profily' :
                 category === 'banner' ? 'Bannery' : 'Všeobecné'}
              </span>
              <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 700, color: A.SAGE }}>{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.005em', marginBottom: 16, marginTop: 0 }}>Rýchle akcie</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => setCurrentTab('videos')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: A.CREAM2, border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = A.HAIR2}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = A.CREAM2}
          >
            <Upload size={14} color={A.TERRA} />
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: A.DEEP }}>Pridať nové video</span>
          </button>

          <button
            onClick={() => setCurrentTab('photos')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: A.CREAM2, border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = A.HAIR2}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = A.CREAM2}
          >
            <Upload size={14} color={A.SAGE} />
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: A.DEEP }}>Nahrať obrázky</span>
          </button>

          <button
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: A.CREAM2, border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = A.HAIR2}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = A.CREAM2}
            onClick={() => {
              const currentDomain = window.location.origin;
              const helpText = `
Content Management - Helpful URLs:

📺 YouTube Studio: https://studio.youtube.com
🖼️ Unsplash (Free Photos): https://unsplash.com
🎨 Canva (Design): https://canva.com
📊 TinyPNG (Compress): https://tinypng.com

📝 Current Content Stats:
• Videos: ${stats.videos.total} (${stats.videos.published} published)
• Photos: ${stats.photos.total} (${formatFileSize(stats.photos.totalSize)})

🔗 Admin URL: ${currentDomain}/admin/dashboard
              `;
              navigator.clipboard.writeText(helpText).then(() => {
                alert('URLs skopírované do schránky!');
              });
            }}
          >
            <Link2 size={14} color={A.GOLD} />
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, color: A.DEEP }}>Užitočné linky & štatistiky</span>
          </button>
        </div>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Prehľad', icon: Layers },
    { id: 'videos',   label: 'Videá',   icon: Video },
    { id: 'photos',   label: 'Obrázky', icon: ImageIcon }
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: A.CREAM2, borderRadius: 12, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, system-ui', fontSize: 13, whiteSpace: 'nowrap',
              ...(currentTab === tab.id
                ? { background: A.CARD, color: A.DEEP, fontWeight: 500 }
                : { background: 'transparent', color: A.MUTED, fontWeight: 400 })
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {currentTab === 'overview' && renderOverview()}
      {currentTab === 'videos'   && <VideoManager />}
      {currentTab === 'photos'   && <PhotoManager />}
    </div>
  );
}
