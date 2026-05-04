import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, Edit3, Download, Copy, Check, X, Search } from 'lucide-react';

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

interface PhotoContent {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  category: 'recipe' | 'exercise' | 'profile' | 'banner' | 'general';
  tags: string[];
  description: string;
  alt: string;
  size: number;
  dimensions: { width: number; height: number };
  uploadedAt: string;
  usedIn: string[];
}

interface PhotoManagerProps {
  onPhotoSelect?: (photo: PhotoContent) => void;
  selectedCategory?: string;
  showSelector?: boolean;
  allowMultiple?: boolean;
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

export default function PhotoManager({ onPhotoSelect, selectedCategory, showSelector = false, allowMultiple = false }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<PhotoContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<PhotoContent | null>(null);
  const [editForm, setEditForm] = useState({
    description: '',
    alt: '',
    tags: '',
    category: 'general'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos from localStorage on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('neome_admin_photos');
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch {
        setPhotos([]);
      }
    } else {
      const samplePhotos: PhotoContent[] = [
        {
          id: 'photo-1',
          filename: 'morning-yoga.jpg',
          originalName: 'morning-yoga-session.jpg',
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop',
          category: 'exercise',
          tags: ['yoga', 'morning', 'stretching'],
          description: 'Ranná joga na balkóne',
          alt: 'Žena cvičí jogu na balkóne pri východe slnka',
          size: 245760,
          dimensions: { width: 400, height: 225 },
          uploadedAt: '2026-03-01T08:00:00Z',
          usedIn: ['stretch-1']
        },
        {
          id: 'photo-2',
          filename: 'healthy-smoothie.jpg',
          originalName: 'green-smoothie-bowl.jpg',
          url: 'https://images.unsplash.com/photo-1553735755-fe7ba465c6d7?w=400&h=300&fit=crop',
          category: 'recipe',
          tags: ['smoothie', 'healthy', 'breakfast'],
          description: 'Zelené smoothie s ovocím',
          alt: 'Zelené smoothie v miske s čerstvým ovocím',
          size: 189440,
          dimensions: { width: 400, height: 300 },
          uploadedAt: '2026-02-28T12:00:00Z',
          usedIn: ['recipe-smoothie-1']
        }
      ];
      setPhotos(samplePhotos);
      localStorage.setItem('neome_admin_photos', JSON.stringify(samplePhotos));
    }
  }, []);

  // Save photos to localStorage when photos change
  useEffect(() => {
    localStorage.setItem('neome_admin_photos', JSON.stringify(photos));
  }, [photos]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (files: File[]) => {
    setLoading(true);
    const uploadPromises = files.map(file => uploadFile(file));

    try {
      const uploadedPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [...uploadedPhotos, ...prev]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Nahrávanie zlyhalo. Skúste znovu.');
    }

    setLoading(false);
  };

  const uploadFile = async (file: File): Promise<PhotoContent> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Podporované sú iba obrázky'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Súbor je príliš veľký (max 5MB)'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('Čítanie súboru zlyhalo'));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const photo: PhotoContent = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            filename: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`,
            originalName: file.name,
            url: e.target.result as string,
            category: 'general',
            tags: [],
            description: '',
            alt: file.name.replace(/\.[^/.]+$/, ''),
            size: file.size,
            dimensions: { width: img.width, height: img.height },
            uploadedAt: new Date().toISOString(),
            usedIn: []
          };
          resolve(photo);
        };
        img.onerror = () => reject(new Error('Nepodarilo sa načítať obrázok'));
        img.src = e.target.result as string;
      };
      reader.onerror = () => reject(new Error('Čítanie súboru zlyhalo'));
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const deletePhoto = (id: string) => {
    if (confirm('Naozaj vymazať tento obrázok?')) {
      setPhotos(prev => prev.filter(p => p.id !== id));
    }
  };

  const copyUrl = (photo: PhotoContent) => {
    navigator.clipboard.writeText(photo.url);
    setCopied(photo.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadPhoto = (photo: PhotoContent) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updatePhoto = () => {
    if (!editingPhoto) return;

    const updatedPhoto: PhotoContent = {
      ...editingPhoto,
      description: editForm.description,
      alt: editForm.alt,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      category: editForm.category as any
    };

    setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? updatedPhoto : p));
    setEditingPhoto(null);
    setEditForm({ description: '', alt: '', tags: '', category: 'general' });
  };

  const filteredPhotos = photos.filter(photo => {
    if (filter !== 'all' && photo.category !== filter) return false;
    if (selectedCategory && photo.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return photo.description.toLowerCase().includes(query) ||
             photo.alt.toLowerCase().includes(query) ||
             photo.tags.some(tag => tag.toLowerCase().includes(query)) ||
             photo.filename.toLowerCase().includes(query);
    }
    return true;
  });

  const categoryColors: Record<string, string> = {
    recipe:   A.SAGE,
    exercise: A.TERRA,
    profile:  A.GOLD,
    banner:   A.MAUVE,
    general:  A.TERRA,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {['recipe', 'exercise', 'profile', 'banner', 'general'].map(cat => {
            const count = photos.filter(p => p.category === cat).length;
            const totalSize = photos.filter(p => p.category === cat).reduce((sum, p) => sum + p.size, 0);
            return (
              <div key={cat} style={{ textAlign: 'center' }}>
                <ImageIcon size={16} color={categoryColors[cat]} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 14, fontWeight: 700, color: A.DEEP }}>{count}</div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.MUTED }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.TERTIARY }}>
                  {formatFileSize(totalSize)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${A.HAIR}`, textAlign: 'center' }}>
          <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: A.DEEP }}>
            Celkom: {photos.length} obrázkov &middot; {formatFileSize(photos.reduce((sum, p) => sum + p.size, 0))}
          </span>
        </div>
      </Card>

      {/* Upload Zone */}
      <Card>
        <div
          style={{
            border: `2px dashed ${dragOver ? A.TERRA : A.HAIR2}`,
            borderRadius: 12,
            padding: 24,
            textAlign: 'center',
            background: dragOver ? 'rgba(193,133,106,0.05)' : 'transparent',
            transition: 'all 0.15s',
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload size={28} color={A.TERTIARY} style={{ margin: '0 auto 8px' }} />
          <h3 style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: A.DEEP, margin: '0 0 4px' }}>
            Nahrajte obrázky
          </h3>
          <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: '0 0 12px' }}>
            Pretiahnite súbory sem alebo kliknite pre výber
          </p>
          <Btn variant="primary" onClick={() => fileInputRef.current?.click()} disabled={loading}>
            {loading ? 'Nahrávam...' : 'Vybrať súbory'}
          </Btn>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => {
              if (e.target.files) {
                handleFileUpload(Array.from(e.target.files));
              }
            }}
          />
          <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.TERTIARY, margin: '8px 0 0' }}>
            Podporované formáty: JPG, PNG, GIF, WebP &middot; Max 5MB
          </p>
        </div>
      </Card>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} color={A.TERTIARY} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Hľadať obrázky..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ ...inputStyle, paddingLeft: 34 }}
        />
      </div>

      {/* Category Filter chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
        {['all', 'recipe', 'exercise', 'profile', 'banner', 'general'].map(f => (
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
            {f === 'all' ? `Všetky (${photos.length})` :
             f.charAt(0).toUpperCase() + f.slice(1) + ` (${photos.filter(p => p.category === f).length})`}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {filteredPhotos.map(photo => (
          <div key={photo.id} style={{ background: A.CARD, borderRadius: 12, border: `1px solid ${A.HAIR}`, padding: 8 }}>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: A.CREAM2, marginBottom: 8 }}
              className="group"
            >
              <img src={photo.url} alt={photo.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              {/* Overlay */}
              <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
              >
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => copyUrl(photo)} title="Kopírovať URL" style={{ padding: 6, background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {copied === photo.id ? <Check size={11} color="#6ee7b7" /> : <Copy size={11} color="#fff" />}
                  </button>
                  <button onClick={() => downloadPhoto(photo)} title="Stiahnuť" style={{ padding: 6, background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Download size={11} color="#fff" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingPhoto(photo);
                      setEditForm({ description: photo.description, alt: photo.alt, tags: photo.tags.join(', '), category: photo.category });
                    }}
                    title="Upraviť"
                    style={{ padding: 6, background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Edit3 size={11} color="#fff" />
                  </button>
                  <button onClick={() => deletePhoto(photo.id)} title="Vymazať" style={{ padding: 6, background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={11} color="#fff" />
                  </button>
                </div>
              </div>

              {/* Selection checkbox */}
              {showSelector && (
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedPhotos.has(photo.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedPhotos);
                      if (e.target.checked) {
                        if (allowMultiple) {
                          newSelected.add(photo.id);
                        } else {
                          newSelected.clear();
                          newSelected.add(photo.id);
                        }
                      } else {
                        newSelected.delete(photo.id);
                      }
                      setSelectedPhotos(newSelected);
                    }}
                    style={{ width: 14, height: 14 }}
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ background: `${categoryColors[photo.category]}22`, color: categoryColors[photo.category], borderRadius: 999, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '2px 7px', display: 'inline-block', alignSelf: 'flex-start' }}>
                {photo.category}
              </span>
              <h4 style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, color: A.DEEP, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {photo.description || photo.originalName}
              </h4>
              <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.MUTED }}>
                {photo.dimensions.width}×{photo.dimensions.height} &middot; {formatFileSize(photo.size)}
              </div>
              {photo.tags.length > 0 && (
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.TERTIARY }}>
                  {photo.tags.slice(0, 2).join(', ')}{photo.tags.length > 2 ? '...' : ''}
                </div>
              )}
              {photo.usedIn.length > 0 && (
                <div style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.GOLD }}>
                  Použité v {photo.usedIn.length} obsahu
                </div>
              )}
            </div>

            {showSelector && onPhotoSelect && (
              <button
                onClick={() => onPhotoSelect(photo)}
                style={{ marginTop: 8, width: '100%', background: A.SAGE, color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
              >
                Vybrať
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px 24px' }}>
          <ImageIcon size={36} color={A.TERTIARY} style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: A.DEEP, margin: '0 0 4px' }}>
            Žiadne obrázky
          </h3>
          <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 11, color: A.MUTED, margin: 0 }}>
            {searchQuery ? `Žiadne výsledky pre "${searchQuery}"` :
             filter === 'all' ? 'Nahrajte prvé obrázky' : `Žiadne obrázky v kategórii "${filter}"`}
          </p>
        </Card>
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}
          onClick={() => setEditingPhoto(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: 24, width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Gilda Display, Georgia, serif', fontSize: 18, fontWeight: 500, color: A.DEEP, margin: 0 }}>Upraviť obrázok</h3>
              <button
                onClick={() => setEditingPhoto(null)}
                style={{ width: 32, height: 32, borderRadius: 10, background: A.CREAM2, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={14} color={A.DEEP} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ aspectRatio: '16/9', borderRadius: 10, overflow: 'hidden', background: A.CREAM2 }}>
                <img src={editingPhoto.url} alt={editingPhoto.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, color: A.MUTED, marginBottom: 4 }}>Popis</label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Stručný popis obrázka"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, color: A.MUTED, marginBottom: 4 }}>Alt text</label>
                  <input
                    type="text"
                    value={editForm.alt}
                    onChange={e => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Alt text pre prístupnosť"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, color: A.MUTED, marginBottom: 4 }}>Tagy</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={e => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="yoga, morning, relaxation"
                    style={inputStyle}
                  />
                  <p style={{ fontFamily: 'DM Sans, system-ui', fontSize: 10, color: A.TERTIARY, margin: '4px 0 0' }}>Oddelené čiarkami</p>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Sans, system-ui', fontSize: 11, fontWeight: 500, color: A.MUTED, marginBottom: 4 }}>Kategória</label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="general">Všeobecné</option>
                    <option value="recipe">Recepty</option>
                    <option value="exercise">Cvičenia</option>
                    <option value="profile">Profily</option>
                    <option value="banner">Bannery</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Btn variant="primary" onClick={updatePhoto}>Uložiť zmeny</Btn>
                <Btn onClick={() => setEditingPhoto(null)}>Zrušiť</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Photos Actions */}
      {showSelector && selectedPhotos.size > 0 && (
        <div style={{ position: 'sticky', bottom: 16, background: A.CARD, borderRadius: 16, border: `1px solid ${A.HAIR}`, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'DM Sans, system-ui', fontSize: 13, fontWeight: 500, color: A.DEEP }}>
              Vybrané: {selectedPhotos.size} obrázkov
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => setSelectedPhotos(new Set())}>Zrušiť výber</Btn>
              <Btn
                variant="primary"
                onClick={() => {
                  if (onPhotoSelect) {
                    const selectedPhotoObjects = photos.filter(p => selectedPhotos.has(p.id));
                    if (selectedPhotoObjects.length > 0) {
                      onPhotoSelect(selectedPhotoObjects[0]);
                    }
                  }
                }}
              >
                Potvrdiť výber
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
