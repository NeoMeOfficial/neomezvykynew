import React, { useState, useEffect } from 'react';
import { Video, Upload, Eye, Trash2, Edit3, Play, Pause, ExternalLink, Copy, Check } from 'lucide-react';

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

interface VideoContent {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl?: string;
  duration: string;
  category: 'exercise' | 'meditation' | 'program' | 'tutorial';
  access: 'free' | 'premium';
  published: boolean;
  description: string;
  tags: string[];
  exerciseId?: string;
  programId?: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoManagerProps {
  onVideoSelect?: (video: VideoContent) => void;
  selectedCategory?: string;
  showSelector?: boolean;
}

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: A.CARD, borderRadius: 16, border: `1px solid ${A.HAIR}`, padding: '22px 24px', ...style }}>{children}</div>
);

const Btn = ({ children, onClick, variant = 'default', disabled = false }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'danger' | 'success' | 'default'; disabled?: boolean;
}) => {
  const base: React.CSSProperties = { border: 'none', borderRadius: 10, padding: '10px 16px', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 };
  const variants = {
    primary: { background: A.DEEP, color: '#fff' },
    danger:  { background: A.TERRA, color: '#fff' },
    success: { background: A.SAGE,  color: '#fff' },
    default: { background: A.CREAM2, color: A.DEEP },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

const inputStyle: React.CSSProperties = {
  background: A.CREAM2,
  border: '1px solid rgba(61,41,33,0.10)',
  borderRadius: 10,
  padding: '9px 12px',
  fontFamily: 'DM Sans, system-ui',
  fontSize: 12,
  color: A.DEEP,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

export default function VideoManager({ onVideoSelect, selectedCategory, showSelector = false }: VideoManagerProps) {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoContent | null>(null);
  const [newVideoForm, setNewVideoForm] = useState({
    title: '',
    youtubeUrl: '',
    category: 'exercise',
    description: '',
    tags: '',
    access: 'premium',
    exerciseId: '',
    programId: ''
  });
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  // Load videos from localStorage on mount
  useEffect(() => {
    const savedVideos = localStorage.getItem('neome_admin_videos');
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch {
        setVideos([]);
      }
    } else {
      const sampleVideos: VideoContent[] = [
        {
          id: 'vid-1',
          title: 'Ranný strečing - kompletný návod',
          youtubeId: 'dQw4w9WgXcQ',
          duration: '15:30',
          category: 'exercise',
          access: 'premium',
          published: true,
          description: 'Kompletný ranný strečing pre začiatočníčky',
          tags: ['stretch', 'morning', 'beginner'],
          exerciseId: 'stretch-1',
          createdAt: '2026-03-01T10:00:00Z',
          updatedAt: '2026-03-01T10:00:00Z'
        },
        {
          id: 'vid-2',
          title: 'Meditácia pred spánkom',
          youtubeId: 'ScMzIvxBSi4',
          duration: '10:45',
          category: 'meditation',
          access: 'free',
          published: true,
          description: 'Relaxačná meditácia na dobrú noc',
          tags: ['meditation', 'sleep', 'relaxation'],
          createdAt: '2026-02-28T20:00:00Z',
          updatedAt: '2026-02-28T20:00:00Z'
        }
      ];
      setVideos(sampleVideos);
      localStorage.setItem('neome_admin_videos', JSON.stringify(sampleVideos));
    }
  }, []);

  // Save videos to localStorage when videos change
  useEffect(() => {
    localStorage.setItem('neome_admin_videos', JSON.stringify(videos));
  }, [videos]);

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const generateThumbnailUrl = (youtubeId: string): string => {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  };

  const addVideo = () => {
    const youtubeId = extractYouTubeId(newVideoForm.youtubeUrl);
    if (!youtubeId) {
      alert('Neplatný YouTube link. Použite formát: https://youtube.com/watch?v=ID');
      return;
    }

    const video: VideoContent = {
      id: `vid-${Date.now()}`,
      title: newVideoForm.title || 'Nové video',
      youtubeId,
      thumbnailUrl: generateThumbnailUrl(youtubeId),
      duration: '00:00',
      category: newVideoForm.category as any,
      access: newVideoForm.access as any,
      published: true,
      description: newVideoForm.description,
      tags: newVideoForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      exerciseId: newVideoForm.exerciseId || undefined,
      programId: newVideoForm.programId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setVideos(prev => [video, ...prev]);
    setNewVideoForm({ title: '', youtubeUrl: '', category: 'exercise', description: '', tags: '', access: 'premium', exerciseId: '', programId: '' });
    setEditingVideo(null);
  };

  const deleteVideo = (id: string) => {
    if (confirm('Naozaj vymazať toto video?')) {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  const togglePublished = (id: string) => {
    setVideos(prev => prev.map(v =>
      v.id === id ? { ...v, published: !v.published, updatedAt: new Date().toISOString() } : v
    ));
  };

  const copyEmbedCode = (video: VideoContent) => {
    const embedCode = `<iframe src="https://www.youtube.com/embed/${video.youtubeId}" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopied(video.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredVideos = videos.filter(v => {
    if (filter !== 'all' && v.category !== filter) return false;
    if (selectedCategory && v.category !== selectedCategory) return false;
    return true;
  });

  const categoryColors: Record<string, string> = {
    exercise:  A.TERRA,
    meditation: A.MAUVE,
    program:   A.SAGE,
    tutorial:  A.GOLD,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header Stats */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {['exercise', 'meditation', 'program', 'tutorial'].map(cat => {
            const count = videos.filter(v => v.category === cat).length;
            const published = videos.filter(v => v.category === cat && v.published).length;
            return (
              <div key={cat} style={{ textAlign: 'center' }}>
                <Video size={20} color={categoryColors[cat]} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 18, fontWeight: 700, color: A.DEEP }}>{published}</div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
                {count > published && (
                  <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.TERTIARY }}>
                    +{count - published} draft
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add / Edit Video */}
      <Card>
        <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, letterSpacing: '-0.005em', marginBottom: 16, marginTop: 0 }}>
          {editingVideo ? 'Upraviť video' : 'Pridať nové video'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input
              type="text"
              placeholder="Názov videa"
              value={newVideoForm.title}
              onChange={e => setNewVideoForm(prev => ({ ...prev, title: e.target.value }))}
              style={inputStyle}
            />
            <select
              value={newVideoForm.category}
              onChange={e => setNewVideoForm(prev => ({ ...prev, category: e.target.value }))}
              style={inputStyle}
            >
              <option value="exercise">Cvičenie</option>
              <option value="meditation">Meditácia</option>
              <option value="program">Program</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>

          <input
            type="url"
            placeholder="YouTube link (https://youtube.com/watch?v=...)"
            value={newVideoForm.youtubeUrl}
            onChange={e => setNewVideoForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
            style={inputStyle}
          />

          <textarea
            placeholder="Popis videa"
            value={newVideoForm.description}
            onChange={e => setNewVideoForm(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            style={{ ...inputStyle, resize: 'none' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input
              type="text"
              placeholder="Tagy (oddelené čiarkou)"
              value={newVideoForm.tags}
              onChange={e => setNewVideoForm(prev => ({ ...prev, tags: e.target.value }))}
              style={inputStyle}
            />
            <select
              value={newVideoForm.access}
              onChange={e => setNewVideoForm(prev => ({ ...prev, access: e.target.value }))}
              style={inputStyle}
            >
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={addVideo}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: A.DEEP, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontFamily: 'DM Sans, system-ui', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
            >
              <Upload size={14} />
              {editingVideo ? 'Uložiť zmeny' : 'Pridať video'}
            </button>
            {editingVideo && (
              <Btn onClick={() => { setEditingVideo(null); setNewVideoForm({ title: '', youtubeUrl: '', category: 'exercise', description: '', tags: '', access: 'premium', exerciseId: '', programId: '' }); }}>
                Zrušiť
              </Btn>
            )}
          </div>
        </div>
      </Card>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
        {['all', 'exercise', 'meditation', 'program', 'tutorial'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...(filter === f
                ? { background: A.DEEP, color: '#fff' }
                : { background: A.CREAM2, color: A.MUTED }),
              borderRadius: 999, padding: '6px 14px', fontSize: 11, fontWeight: 500,
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans, system-ui',
            }}
          >
            {f === 'all' ? `Všetky (${videos.length})` :
             f.charAt(0).toUpperCase() + f.slice(1) + ` (${videos.filter(v => v.category === f).length})`}
          </button>
        ))}
      </div>

      {/* Video List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredVideos.map(video => (
          <Card key={video.id} style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {/* Thumbnail */}
              <div style={{ position: 'relative', width: 80, height: 48, borderRadius: 8, overflow: 'hidden', background: 'rgba(0,0,0,0.12)', flexShrink: 0 }}>
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Video size={20} color={A.TERTIARY} />
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
                >
                  <Play size={14} color="#fff" />
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                  <h4 style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: A.DEEP, margin: 0 }}>
                    {video.title}
                  </h4>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0, flexWrap: 'wrap' }}>
                    <span style={{ background: `${categoryColors[video.category]}22`, color: categoryColors[video.category], borderRadius: 999, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px' }}>
                      {video.category}
                    </span>
                    <span style={{ background: video.access === 'premium' ? 'rgba(184,134,74,0.15)' : 'rgba(139,158,136,0.15)', color: video.access === 'premium' ? A.GOLD : A.SAGE, borderRadius: 999, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px' }}>
                      {video.access === 'premium' ? 'Premium' : 'Free'}
                    </span>
                    {!video.published && (
                      <span style={{ background: 'rgba(193,133,106,0.18)', color: A.TERRA, borderRadius: 999, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 8px' }}>
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: '0 0 4px' }}>
                  {video.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.TERTIARY }}>
                  <span>{video.duration}</span>
                  {video.tags.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{video.tags.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => copyEmbedCode(video)}
                  title="Kopírovať embed kód"
                  style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: copied === video.id ? 'rgba(139,158,136,0.15)' : 'rgba(184,134,74,0.12)', display: 'flex', alignItems: 'center' }}
                >
                  {copied === video.id ? <Check size={13} color={A.SAGE} /> : <Copy size={13} color={A.GOLD} />}
                </button>

                <a
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Otvoriť na YouTube"
                  style={{ padding: 6, borderRadius: 8, background: 'rgba(193,133,106,0.12)', display: 'flex', alignItems: 'center' }}
                >
                  <ExternalLink size={13} color={A.TERRA} />
                </a>

                <button
                  onClick={() => togglePublished(video.id)}
                  title={video.published ? 'Skryť' : 'Publikovať'}
                  style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: video.published ? 'rgba(139,158,136,0.12)' : 'rgba(193,133,106,0.12)', display: 'flex', alignItems: 'center' }}
                >
                  {video.published
                    ? <Eye size={13} color={A.SAGE} />
                    : <Pause size={13} color={A.TERRA} />}
                </button>

                <button
                  onClick={() => {
                    setEditingVideo(video);
                    setNewVideoForm({
                      title: video.title,
                      youtubeUrl: `https://youtube.com/watch?v=${video.youtubeId}`,
                      category: video.category,
                      description: video.description,
                      tags: video.tags.join(', '),
                      access: video.access,
                      exerciseId: video.exerciseId || '',
                      programId: video.programId || ''
                    });
                  }}
                  title="Upraviť"
                  style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(168,132,139,0.12)', display: 'flex', alignItems: 'center' }}
                >
                  <Edit3 size={13} color={A.MAUVE} />
                </button>

                <button
                  onClick={() => deleteVideo(video.id)}
                  title="Vymazať"
                  style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(193,133,106,0.10)', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={13} color={A.TERRA} />
                </button>

                {showSelector && onVideoSelect && (
                  <Btn variant="success" onClick={() => onVideoSelect(video)}>
                    Vybrať
                  </Btn>
                )}
              </div>
            </div>
          </Card>
        ))}

        {filteredVideos.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '40px 24px' }}>
            <Video size={40} color={A.TERTIARY} style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: A.DEEP, margin: '0 0 4px' }}>
              Žiadne videá
            </h3>
            <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: 0 }}>
              {filter === 'all' ? 'Pridajte prvé video pomocou formulára vyššie' : `Žiadne videá v kategórii "${filter}"`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
