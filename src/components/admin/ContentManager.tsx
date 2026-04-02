import React, { useState } from 'react';
import { Video, Image as ImageIcon, FileText, Settings, Upload, Layers, Link2 } from 'lucide-react';
import { colors } from '../../theme/warmDusk';
import VideoManager from './VideoManager';
import PhotoManager from './PhotoManager';

interface ContentManagerProps {
  activeTab?: 'videos' | 'photos' | 'overview';
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/30 backdrop-blur-xl rounded-2xl p-4 border border-white/30 ${className}`}>{children}</div>
);

const Btn = ({ children, onClick, variant = 'default', className = '' }: { 
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'danger' | 'success' | 'default'; className?: string;
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
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${className}`} 
      style={styles[variant]}
    >
      {children}
    </button>
  );
};

export default function ContentManager({ activeTab = 'overview' }: ContentManagerProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  
  // Mock data for overview - in real implementation, this would come from the actual data
  const stats = {
    videos: {
      total: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').length,
      published: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.published).length,
      categories: {
        exercise: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'exercise').length,
        meditation: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'meditation').length,
        program: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'program').length,
        tutorial: JSON.parse(localStorage.getItem('neome_admin_videos') || '[]').filter((v: any) => v.category === 'tutorial').length,
      }
    },
    photos: {
      total: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').length,
      totalSize: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').reduce((sum: number, p: any) => sum + (p.size || 0), 0),
      categories: {
        recipe: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'recipe').length,
        exercise: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'exercise').length,
        profile: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'profile').length,
        banner: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'banner').length,
        general: JSON.parse(localStorage.getItem('neome_admin_photos') || '[]').filter((p: any) => p.category === 'general').length,
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
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Video className="w-6 h-6" style={{ color: colors.telo }} />
            <div>
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Videá</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Cvičenia, meditácie, tutoriály</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>{stats.videos.published}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Publikované</div>
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: colors.textTertiary }}>{stats.videos.total - stats.videos.published}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Koncepty</div>
            </div>
          </div>
          <Btn variant="primary" onClick={() => setCurrentTab('videos')} className="w-full mt-3 text-xs">
            Spravovať videá
          </Btn>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <ImageIcon className="w-6 h-6" style={{ color: colors.strava }} />
            <div>
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Obrázky</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Fotky, ilustrácie, bannery</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-xl font-bold" style={{ color: colors.textPrimary }}>{stats.photos.total}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Súborov</div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: colors.textTertiary }}>{formatFileSize(stats.photos.totalSize)}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>Veľkosť</div>
            </div>
          </div>
          <Btn variant="success" onClick={() => setCurrentTab('photos')} className="w-full mt-3 text-xs">
            Spravovať obrázky
          </Btn>
        </Card>
      </div>

      {/* Content Guidelines */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>📋 Content Guidelines</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Video className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.telo }} />
            <div>
              <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>Videá</p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                • YouTube linky pre hosting<br/>
                • Jasné názvy a popisy<br/>
                • Správne tagy a kategórie
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ImageIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.strava }} />
            <div>
              <p className="text-xs font-medium" style={{ color: colors.textPrimary }}>Obrázky</p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                • Max 5MB per súbor<br/>
                • WebP/JPG formáty<br/>
                • Alt text pre prístupnosť
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Video Categories Breakdown */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>🎥 Kategórie videí</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(stats.videos.categories).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between p-2 rounded-lg bg-white/20">
              <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                {category === 'exercise' ? 'Cvičenia' :
                 category === 'meditation' ? 'Meditácie' :
                 category === 'program' ? 'Programy' : 'Tutoriály'}
              </span>
              <span className="text-sm font-bold" style={{ color: colors.telo }}>{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Photo Categories Breakdown */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>🖼️ Kategórie obrázkov</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(stats.photos.categories).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between p-2 rounded-lg bg-white/20">
              <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                {category === 'recipe' ? 'Recepty' :
                 category === 'exercise' ? 'Cvičenia' :
                 category === 'profile' ? 'Profily' :
                 category === 'banner' ? 'Bannery' : 'Všeobecné'}
              </span>
              <span className="text-sm font-bold" style={{ color: colors.strava }}>{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>⚡ Rýchle akcie</h3>
        <div className="space-y-2">
          <button 
            onClick={() => setCurrentTab('videos')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" style={{ color: colors.telo }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>Pridať nové video</span>
            </div>
          </button>
          
          <button 
            onClick={() => setCurrentTab('photos')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" style={{ color: colors.strava }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>Nahrať obrázky</span>
            </div>
          </button>
          
          <button 
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-left"
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
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4" style={{ color: colors.accent }} />
              <span className="text-sm" style={{ color: colors.textPrimary }}>Užitočné linky & štatistiky</span>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Prehľad', icon: Layers },
    { id: 'videos', label: 'Videá', icon: Video },
    { id: 'photos', label: 'Obrázky', icon: ImageIcon }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto lg:gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
            style={{ 
              background: currentTab === tab.id ? colors.telo : 'rgba(255,255,255,0.3)', 
              color: currentTab === tab.id ? '#fff' : colors.textSecondary 
            }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {currentTab === 'overview' && renderOverview()}
      {currentTab === 'videos' && <VideoManager />}
      {currentTab === 'photos' && <PhotoManager />}
    </div>
  );
}