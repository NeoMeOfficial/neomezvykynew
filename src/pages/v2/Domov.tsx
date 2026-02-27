import { useState } from 'react';
import GreetingHeader from '../../components/v2/home/GreetingHeader';
import WeeklyCalendarStrip, { getWeekDays } from '../../components/v2/home/WeeklyCalendarStrip';
import TodayOverview from '../../components/v2/home/TodayOverview';
// PeriodkaSnippet now integrated into TodayOverview
import HabitTracker from '../../components/v2/home/HabitTracker';
import ReflectionSection from '../../components/v2/home/ReflectionSection';
import WaterIntakeWidget from '../../components/v2/tracking/WaterIntakeWidget';
import MoodEnergyTracker from '../../components/v2/tracking/MoodEnergyTracker';
import FavoritesShortcut from '../../components/v2/favorites/FavoritesShortcut';
import CommunityStatusWidget from '../../components/v2/achievements/CommunityStatusWidget';
import WorkoutStatsWidget from '../../components/v2/workouts/WorkoutStatsWidget';
import WorkoutDemoShortcut from '../../components/v2/workouts/WorkoutDemoShortcut';
import BuddyShortcut from '../../components/v2/buddy/BuddyShortcut';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';

export default function Domov() {
  const days = getWeekDays();
  const todayIdx = days.findIndex((d) => d.isToday);
  const [selectedDay, setSelectedDay] = useState(todayIdx >= 0 ? todayIdx : 0);
  const { stats } = useWorkoutHistory();

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      <GreetingHeader />
      <WeeklyCalendarStrip days={days} selectedIdx={selectedDay} onSelect={setSelectedDay} />
      <TodayOverview />
      <WaterIntakeWidget />
      <MoodEnergyTracker />
      <CommunityStatusWidget variant="compact" />
      {stats.totalWorkouts > 0 && <WorkoutStatsWidget variant="compact" />}
      {stats.totalWorkouts < 3 && <WorkoutDemoShortcut />}
      <BuddyShortcut />
      <FavoritesShortcut />
      <HabitTracker />
      <ReflectionSection />
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <p className="text-sm italic text-center" style={{ color: '#6B4C3B' }}>
          „Každý malý krok ťa posúva bližšie k tvojmu cieľu."
        </p>
      </div>
    </div>
  );
}
