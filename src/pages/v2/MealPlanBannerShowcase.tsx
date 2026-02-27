import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MealPlanBanners from '../../components/v2/home/MealPlanBanners';
import { colors } from '../../theme/warmDusk';

export default function MealPlanBannerShowcase() {
  const navigate = useNavigate();

  const handleDummyPurchase = () => {
    alert('Demo purchase action - this would navigate to checkout');
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(135deg, #F7F4F0 0%, #F0E6DA 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-5 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <ArrowLeft size={20} className="text-[#2E2218]" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#2E2218]">Meal Plan Banner Designs</h1>
          <p className="text-sm text-[#8B7560]">4 rotating banner variants for homepage</p>
        </div>
      </div>

      <div className="px-5 space-y-8">
        {/* Variant 1: Personalization Focus */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#2E2218] mb-2">Variant 1: Personalization Focus</h2>
            <p className="text-sm text-[#8B7560]">
              Highlights AI personalization, 108 recipes, and allergen-friendly features. 
              Uses gradient header with stats grid layout.
            </p>
          </div>
          <MealPlanBanners variant={1} onPurchase={handleDummyPurchase} />
        </div>

        {/* Variant 2: Time-Saving Focus */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#2E2218] mb-2">Variant 2: Time-Saving Focus</h2>
            <p className="text-sm text-[#8B7560]">
              Emphasizes saving 3 hours weekly with floating animation elements. 
              Horizontal layout with time benefits prominently displayed.
            </p>
          </div>
          <MealPlanBanners variant={2} onPurchase={handleDummyPurchase} />
        </div>

        {/* Variant 3: Health Benefits Focus */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#2E2218] mb-2">Variant 3: Health Benefits Focus</h2>
            <p className="text-sm text-[#8B7560]">
              Green health-focused design with nutritionist approval emphasis. 
              Lists key health benefits with checkmarks.
            </p>
          </div>
          <MealPlanBanners variant={3} onPurchase={handleDummyPurchase} />
        </div>

        {/* Variant 4: Premium Minimalist */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#2E2218] mb-2">Variant 4: Premium Minimalist</h2>
            <p className="text-sm text-[#8B7560]">
              Clean, centered design with premium feel. Features guarantee and 
              simple stats grid. Most elegant and trustworthy look.
            </p>
          </div>
          <MealPlanBanners variant={4} onPurchase={handleDummyPurchase} />
        </div>

        {/* Implementation Notes */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#2E2218] mb-3">Implementation Notes</h3>
          <ul className="space-y-2 text-sm text-[#8B7560]">
            <li>• <strong>Rotation Logic:</strong> Changes daily based on date (Day 1→Variant 1, Day 2→Variant 2, etc.)</li>
            <li>• <strong>Targeting:</strong> Only shown to users without meal planner subscription</li>
            <li>• <strong>Placement:</strong> Appears under Strava section on homepage occasionally</li>
            <li>• <strong>Analytics:</strong> Each variant can be tracked separately for A/B testing</li>
            <li>• <strong>Price:</strong> All variants consistently show €47 pricing</li>
          </ul>
        </div>

        {/* Color Scheme Reference */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-[#2E2218] mb-3">Color Scheme Used</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ background: colors.strava }} />
              <span className="text-sm">Strava Green (Primary)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ background: colors.accent }} />
              <span className="text-sm">Accent Color</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full" style={{ background: colors.periodka }} />
              <span className="text-sm">Periodka Color</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-600" />
              <span className="text-sm">Health Green (Variant 3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}