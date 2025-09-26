import React from 'react';
import { FileText } from 'lucide-react';
import { HistoricalDataOverview } from '../HistoricalDataOverview';

interface DataOverviewSectionProps {
  accessCode?: string;
}

export function DataOverviewSection({
  accessCode
}: DataOverviewSectionProps) {
  return (
    <div className="w-full space-y-6 rounded-2xl p-6"
         style={{ backgroundColor: '#FBF8F9' }}>

      {/* Section Header: Prehľad údajov */}
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-5 h-5" style={{ color: '#FF7782' }} />
        <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
          Prehľad údajov
        </h3>
      </div>
      
      {/* Historical Data Overview */}
      <HistoricalDataOverview accessCode={accessCode} />
    </div>
  );
}