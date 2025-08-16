import HabitTracker from '@/components/HabitTracker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Habit Tracker</h1>
            <p className="text-amber-700">Sleduj svoje denné návyky a buduj lepšie zvyky</p>
          </div>
          <HabitTracker />
        </div>
      </div>
    </div>
  );
};

export default Index;
