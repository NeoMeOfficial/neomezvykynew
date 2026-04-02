import React from 'react';
import { colors } from '../../theme/warmDusk';

interface DesktopAdminLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
  stats?: React.ReactNode;
}

export default function DesktopAdminLayout({ sidebar, header, content, stats }: DesktopAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Desktop Layout - Always show when this component is rendered */}
      <div className="flex h-screen">
        {/* Sidebar - narrower for 13" Macs */}
        <div className="w-56 md:w-64 bg-white/40 backdrop-blur-xl border-r border-white/30 flex flex-col flex-shrink-0">
          {sidebar}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 bg-white/30 backdrop-blur-xl border-b border-white/30 flex items-center justify-between px-6">
            {header}
          </div>

          {/* Stats Bar (optional) */}
          {stats && (
            <div className="bg-white/20 backdrop-blur-xl border-b border-white/20 p-4">
              {stats}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}