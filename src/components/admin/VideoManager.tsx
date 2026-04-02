import React, { useState, useEffect } from 'react';
import { Video, Upload, Eye, Trash2, Edit3, Play, Pause, ExternalLink, Copy, Check } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

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

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 ${className}`}>{children}</div>
);

const Badge = ({ text, color }: { text: string; color: string }) => (
  <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>{text}</span>
);

const Btn = ({ children, onClick, variant = 'default', className = '', disabled = false }: { 
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'danger' | 'success' | 'default'; className?: string; disabled?: boolean;
}) => {
  const styles = {
    primary: { backgroundColor: colors.telo, color: '#fff' },
    danger: { backgroundColor: `${colors.periodka}20`, color: colors.periodka },
    success: { backgroundColor: colors.strava, color: '#fff' },
    default: { backgroundColor: 'rgba(255,255,255,0.3)', color: colors.textPrimary },
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} 
      style={styles[variant]}
    >
      {children}
    </button>
  );
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
      // Initialize with sample data
      const sampleVideos: VideoContent[] = [
        {
          id: 'vid-1',
          title: 'Ranný strečing - kompletný návod',
          youtubeId: 'dQw4w9WgXcQ', // Sample YouTube ID
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
      duration: '00:00', // Will be updated manually or via API
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
    setNewVideoForm({
      title: '',
      youtubeUrl: '',
      category: 'exercise',
      description: '',
      tags: '',
      access: 'premium',
      exerciseId: '',
      programId: ''
    });
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

  const categoryColors = {
    exercise: colors.telo,
    meditation: colors.mysel, 
    program: colors.strava,
    tutorial: colors.accent
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <Card>
        <div className="grid grid-cols-4 gap-4">
          {['exercise', 'meditation', 'program', 'tutorial'].map(cat => {
            const count = videos.filter(v => v.category === cat).length;
            const published = videos.filter(v => v.category === cat && v.published).length;
            return (
              <div key={cat} className="text-center">
                <Video className="w-6 h-6 mx-auto mb-1" style={{ color: categoryColors[cat as keyof typeof categoryColors] }} />
                <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>{published}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
                {count > published && (
                  <div className="text-xs" style={{ color: colors.textTertiary }}>
                    +{count - published} draft
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Add New Video */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>
          {editingVideo ? 'Upraviť video' : 'Pridať nové video'}
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Názov videa"
              value={newVideoForm.title}
              onChange={e => setNewVideoForm(prev => ({ ...prev, title: e.target.value }))}
              className="px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
              style={{ color: colors.textPrimary }}
            />
            <select
              value={newVideoForm.category}
              onChange={e => setNewVideoForm(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
              style={{ color: colors.textPrimary }}
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
            className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
            style={{ color: colors.textPrimary }}
          />
          
          <textarea
            placeholder="Popis videa"
            value={newVideoForm.description}
            onChange={e => setNewVideoForm(prev => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none resize-none"
            style={{ color: colors.textPrimary }}
          />
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Tagy (oddelené čiarkou)"
              value={newVideoForm.tags}
              onChange={e => setNewVideoForm(prev => ({ ...prev, tags: e.target.value }))}
              className="px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
              style={{ color: colors.textPrimary }}
            />
            <select
              value={newVideoForm.access}
              onChange={e => setNewVideoForm(prev => ({ ...prev, access: e.target.value }))}
              className="px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
              style={{ color: colors.textPrimary }}
            >
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <Btn variant="primary" onClick={addVideo} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              {editingVideo ? 'Uložiť zmeny' : 'Pridať video'}
            </Btn>
            {editingVideo && (
              <Btn onClick={() => { setEditingVideo(null); setNewVideoForm({ title: '', youtubeUrl: '', category: 'exercise', description: '', tags: '', access: 'premium', exerciseId: '', programId: '' }); }}>
                Zrušiť
              </Btn>
            )}
          </div>
        </div>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'exercise', 'meditation', 'program', 'tutorial'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
            style={{ 
              background: filter === f ? colors.telo : 'rgba(255,255,255,0.3)', 
              color: filter === f ? '#fff' : colors.textSecondary 
            }}
          >
            {f === 'all' ? `Všetky (${videos.length})` : 
             f.charAt(0).toUpperCase() + f.slice(1) + ` (${videos.filter(v => v.category === f).length})`}
          </button>
        ))}
      </div>

      {/* Video List */}
      <div className="space-y-3">
        {filteredVideos.map(video => (
          <Card key={video.id}>
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-black/20">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-6 h-6" style={{ color: colors.textTertiary }} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Badge 
                      text={video.category} 
                      color={categoryColors[video.category]} 
                    />
                    <Badge 
                      text={video.access === 'premium' ? 'Premium' : 'Free'} 
                      color={video.access === 'premium' ? colors.accent : colors.strava} 
                    />
                    {!video.published && <Badge text="Draft" color={colors.textTertiary} />}
                  </div>
                </div>
                
                <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  {video.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.textTertiary }}>
                  <span>{video.duration}</span>
                  {video.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{video.tags.join(', ')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyEmbedCode(video)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ backgroundColor: copied === video.id ? `${colors.strava}20` : `${colors.accent}15` }}
                  title="Kopírovať embed kód"
                >
                  {copied === video.id ? (
                    <Check className="w-3.5 h-3.5" style={{ color: colors.strava }} />
                  ) : (
                    <Copy className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                  )}
                </button>
                
                <a
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: `${colors.telo}15` }}
                  title="Otvoriť na YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: colors.telo }} />
                </a>
                
                <button
                  onClick={() => togglePublished(video.id)}
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: video.published ? `${colors.strava}15` : `${colors.periodka}15` }}
                  title={video.published ? 'Skryť' : 'Publikovať'}
                >
                  {video.published ? (
                    <Eye className="w-3.5 h-3.5" style={{ color: colors.strava }} />
                  ) : (
                    <Pause className="w-3.5 h-3.5" style={{ color: colors.periodka }} />
                  )}
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
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: `${colors.mysel}15` }}
                  title="Upraviť"
                >
                  <Edit3 className="w-3.5 h-3.5" style={{ color: colors.mysel }} />
                </button>
                
                <button
                  onClick={() => deleteVideo(video.id)}
                  className="p-1.5 rounded-lg"
                  style={{ backgroundColor: `${colors.periodka}10` }}
                  title="Vymazať"
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: colors.periodka }} />
                </button>
                
                {showSelector && onVideoSelect && (
                  <Btn
                    variant="success"
                    onClick={() => onVideoSelect(video)}
                    className="text-xs"
                  >
                    Vybrať
                  </Btn>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {filteredVideos.length === 0 && (
          <Card className="text-center py-8">
            <Video className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} />
            <h3 className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
              Žiadne videá
            </h3>
            <p className="text-xs" style={{ color: colors.textSecondary }}>
              {filter === 'all' ? 'Pridajte prvé video pomocou formulára vyššie' : `Žiadne videá v kategórii "${filter}"`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}