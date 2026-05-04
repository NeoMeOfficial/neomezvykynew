import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  const enterDemo = () => {
    localStorage.setItem('demo_session', 'active');
    localStorage.setItem('demo_user', JSON.stringify({ id: 'demo', email: 'demo@test.com', firstName: 'Hosť', lastName: '' }));
    navigate('/domov-new');
  };

  return (
    <div className="min-h-screen h-screen w-screen fixed inset-0 overflow-hidden">
      {/* Hero */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/welcome-hero.jpg)' }}
      />
      <div className="absolute inset-0 bg-ink/30" />

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 pt-10 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent">
        <div className="mb-1 font-sans text-[10px] tracking-[0.35em] uppercase text-white/60">NeoMe</div>
        <h1 className="font-serif text-[32px] leading-tight text-white mb-6">
          Tvoje telo.<br />
          <em className="not-italic text-white/72">Tvoj rytmus.</em>
        </h1>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-4 rounded-full bg-white text-ink font-sans font-semibold text-base transition-all active:scale-95"
          >
            Prihlásiť sa
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full py-4 rounded-full bg-white/15 border border-white/30 text-white font-sans font-medium text-base backdrop-blur-sm transition-all active:scale-95"
          >
            Vytvoriť účet
          </button>
        </div>

        <button
          onClick={enterDemo}
          className="w-full mt-4 text-center font-sans text-sm text-white/50"
        >
          Pokračovať bez účtu
        </button>
      </div>
    </div>
  );
}
