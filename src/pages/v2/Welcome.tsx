import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen fixed inset-0 font-lufga overflow-hidden">
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
          className="w-full bg-white rounded-2xl py-4 text-lg font-semibold text-gray-800 transition-all active:scale-95 shadow-xl"
        >
          Vstúpiť
        </button>
      </div>
    </div>
  );
}
