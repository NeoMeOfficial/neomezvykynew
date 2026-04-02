import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Upload, Eye, Trash2, Edit3, Download, Copy, Check, X, Search } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface PhotoContent {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  category: 'recipe' | 'exercise' | 'profile' | 'banner' | 'general';
  tags: string[];
  description: string;
  alt: string;
  size: number; // in bytes
  dimensions: { width: number; height: number };
  uploadedAt: string;
  usedIn: string[]; // IDs of content that uses this image
}

interface PhotoManagerProps {
  onPhotoSelect?: (photo: PhotoContent) => void;
  selectedCategory?: string;
  showSelector?: boolean;
  allowMultiple?: boolean;
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
      // Initialize with sample data
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
          size: 245760, // ~240KB
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
          size: 189440, // ~185KB
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

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Súbor je príliš veľký (max 5MB)'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error('Čítanie súboru zlyhalo'));
          return;
        }

        // Create image to get dimensions
        const img = new Image();
        img.onload = () => {
          const photo: PhotoContent = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            filename: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`,
            originalName: file.name,
            url: e.target.result as string, // Base64 data URL
            category: 'general',
            tags: [],
            description: '',
            alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
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

  const categoryColors = {
    recipe: colors.strava,
    exercise: colors.telo,
    profile: colors.accent,
    banner: colors.mysel,
    general: colors.periodka
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <Card>
        <div className="grid grid-cols-5 gap-4">
          {['recipe', 'exercise', 'profile', 'banner', 'general'].map(cat => {
            const count = photos.filter(p => p.category === cat).length;
            const totalSize = photos.filter(p => p.category === cat).reduce((sum, p) => sum + p.size, 0);
            return (
              <div key={cat} className="text-center">
                <ImageIcon className="w-5 h-5 mx-auto mb-1" style={{ color: categoryColors[cat as keyof typeof categoryColors] }} />
                <div className="text-sm font-bold" style={{ color: colors.textPrimary }}>{count}</div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
                <div className="text-xs" style={{ color: colors.textTertiary }}>
                  {formatFileSize(totalSize)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-white/20 text-center">
          <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            Celkom: {photos.length} obrázkov • {formatFileSize(photos.reduce((sum, p) => sum + p.size, 0))}
          </span>
        </div>
      </Card>

      {/* Upload Zone */}
      <Card>
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragOver ? 'border-blue-400 bg-blue-50/20' : 'border-white/30'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textTertiary }} />
          <h3 className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
            Nahrajte obrázky
          </h3>
          <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
            Pretiahnite súbory sem alebo kliknite pre výber
          </p>
          <Btn
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {loading ? 'Nahrávam...' : 'Vybrať súbory'}
          </Btn>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={e => {
              if (e.target.files) {
                handleFileUpload(Array.from(e.target.files));
              }
            }}
          />
          <p className="text-xs mt-2" style={{ color: colors.textTertiary }}>
            Podporované formáty: JPG, PNG, GIF, WebP • Max 5MB
          </p>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
          <input
            type="text"
            placeholder="Hľadať obrázky..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white/30 backdrop-blur-xl border border-white/30 outline-none"
            style={{ color: colors.textPrimary }}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'recipe', 'exercise', 'profile', 'banner', 'general'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
            style={{ 
              background: filter === f ? colors.telo : 'rgba(255,255,255,0.3)', 
              color: filter === f ? '#fff' : colors.textSecondary 
            }}
          >
            {f === 'all' ? `Všetky (${photos.length})` : 
             f.charAt(0).toUpperCase() + f.slice(1) + ` (${photos.filter(p => p.category === f).length})`}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filteredPhotos.map(photo => (
          <Card key={photo.id} className="!p-2">
            <div className="aspect-square rounded-lg overflow-hidden bg-black/10 mb-2 relative group">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <div className="flex gap-1">
                  <button
                    onClick={() => copyUrl(photo)}
                    className="p-1.5 bg-white/20 rounded-lg"
                    title="Kopírovať URL"
                  >
                    {copied === photo.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => downloadPhoto(photo)}
                    className="p-1.5 bg-white/20 rounded-lg"
                    title="Stiahnuť"
                  >
                    <Download className="w-3 h-3 text-white" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditingPhoto(photo);
                      setEditForm({
                        description: photo.description,
                        alt: photo.alt,
                        tags: photo.tags.join(', '),
                        category: photo.category
                      });
                    }}
                    className="p-1.5 bg-white/20 rounded-lg"
                    title="Upraviť"
                  >
                    <Edit3 className="w-3 h-3 text-white" />
                  </button>
                  
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="p-1.5 bg-white/20 rounded-lg"
                    title="Vymazať"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Selection checkbox */}
              {showSelector && (
                <div className="absolute top-2 right-2">
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
                    className="w-4 h-4"
                  />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Badge 
                  text={photo.category} 
                  color={categoryColors[photo.category]} 
                />
              </div>
              
              <h4 className="text-xs font-medium truncate" style={{ color: colors.textPrimary }}>
                {photo.description || photo.originalName}
              </h4>
              
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                {photo.dimensions.width}×{photo.dimensions.height} • {formatFileSize(photo.size)}
              </div>
              
              {photo.tags.length > 0 && (
                <div className="text-xs" style={{ color: colors.textTertiary }}>
                  {photo.tags.slice(0, 2).join(', ')}{photo.tags.length > 2 ? '...' : ''}
                </div>
              )}
              
              {photo.usedIn.length > 0 && (
                <div className="text-xs" style={{ color: colors.accent }}>
                  Použité v {photo.usedIn.length} obsahu
                </div>
              )}
            </div>
            
            {showSelector && onPhotoSelect && (
              <Btn
                variant="success"
                onClick={() => onPhotoSelect(photo)}
                className="w-full mt-2 text-xs"
              >
                Vybrať
              </Btn>
            )}
          </Card>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <Card className="text-center py-8">
          <ImageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textTertiary }} />
          <h3 className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
            Žiadne obrázky
          </h3>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            {searchQuery ? `Žiadne výsledky pre "${searchQuery}"` : 
             filter === 'all' ? 'Nahrajte prvé obrázky' : `Žiadne obrázky v kategórii "${filter}"`}
          </p>
        </Card>
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50" onClick={() => setEditingPhoto(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Upraviť obrázok</h3>
              <button onClick={() => setEditingPhoto(null)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-black/10">
                <img
                  src={editingPhoto.url}
                  alt={editingPhoto.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Popis</label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Stručný popis obrázka"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
                    style={{ color: colors.textPrimary }}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Alt text</label>
                  <input
                    type="text"
                    value={editForm.alt}
                    onChange={e => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Alt text pre prístupnosť"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
                    style={{ color: colors.textPrimary }}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Tagy</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={e => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="yoga, morning, relaxation"
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
                    style={{ color: colors.textPrimary }}
                  />
                  <p className="text-xs mt-1" style={{ color: colors.textTertiary }}>Oddelené čiarkami</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>Kategória</label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/30 outline-none"
                    style={{ color: colors.textPrimary }}
                  >
                    <option value="general">Všeobecné</option>
                    <option value="recipe">Recepty</option>
                    <option value="exercise">Cvičenia</option>
                    <option value="profile">Profily</option>
                    <option value="banner">Bannery</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Btn variant="primary" onClick={updatePhoto} className="flex-1">
                  Uložiť zmeny
                </Btn>
                <Btn onClick={() => setEditingPhoto(null)} className="flex-1">
                  Zrušiť
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Photos Actions */}
      {showSelector && selectedPhotos.size > 0 && (
        <Card className="sticky bottom-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              Vybrané: {selectedPhotos.size} obrázkov
            </span>
            <div className="flex gap-2">
              <Btn onClick={() => setSelectedPhotos(new Set())}>
                Zrušiť výber
              </Btn>
              <Btn 
                variant="primary" 
                onClick={() => {
                  if (onPhotoSelect) {
                    const selectedPhotoObjects = photos.filter(p => selectedPhotos.has(p.id));
                    // For now, just select the first one
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
        </Card>
      )}
    </div>
  );
}