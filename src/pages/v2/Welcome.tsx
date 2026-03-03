import { useNavigate } from 'react-router-dom';
import { colors, glassCard } from '../../theme/warmDusk';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen h-screen w-screen fixed inset-0 font-lufga overflow-hidden" style={{ background: colors.bgGradient }}>
      {/* Hero Background Image - Responsive to all screen sizes */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: 'url(/images/welcome-hero.jpg)',
        }}
      />
      
      {/* Content - Button fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-safe">
        {/* CTA Button - Always at bottom of screen */}
        <button
          onClick={() => navigate('/domov-new')}
          className="w-full bg-white/30 backdrop-blur-xl rounded-2xl py-4 text-lg font-semibold text-[#2E2218] transition-all active:scale-95 shadow-xl"
        >
          Vstúpiť
        </button>
      </div>
    </div>
  );
}
