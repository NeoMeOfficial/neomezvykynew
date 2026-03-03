import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';

// Nordic Card Component
function NordicCard({ children, className = "" }) {
  return (
    <div 
      className={`bg-white rounded-3xl transition-all duration-300 ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(107, 76, 59, 0.08), 0 6px 24px rgba(107, 76, 59, 0.04), 0 3px 12px rgba(107, 76, 59, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function Spravy() {
  const navigate = useNavigate();

  return (
    <div 
      className="w-full min-h-screen px-3 py-6 pb-28 space-y-6"
      style={{ 
        background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)', 
        minHeight: '100vh' 
      }}
    >
      {/* Nordic Header */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(107, 76, 59, 0.14)` }}>
              <MessageCircle className="w-4 h-4" style={{ color: '#6B4C3B' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Správy</h1>
          </div>
        </div>
      </NordicCard>

      {/* Coming Soon */}
      <NordicCard className="p-6 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h2 className="text-[15px] font-semibold mb-2" style={{ color: '#2E2218' }}>
          Už čoskoro
        </h2>
        <p className="text-[12px]" style={{ color: '#A89B8C' }}>
          Správy a notifikácie budú dostupné v budúcej verzii
        </p>
      </NordicCard>
    </div>
  );
}
