import { useState } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { useWorkoutHistory } from '../../../hooks/useWorkoutHistory';

const MONTHS_SK = [
  'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
  'Júl', 'August', 'September', 'Október', 'November', 'December'
];

const DAYS_SK = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function WorkoutCalendar() {
  const { getCalendarData } = useWorkoutHistory();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const calendarData = getCalendarData(year, month);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWorkoutTypeColor = (type: string) => {
    const colors = {
      telo: '#6B4C3B',
      strava: '#7A9E78', 
      mysel: '#A8848B'
    };
    return colors[type as keyof typeof colors] || '#B8864A';
  };

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl p-6 space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#6B4C3B] font-bold text-lg">Cvičebný kalendár</h3>
          <p className="text-[#8B7560] text-sm">Prehľad tvojich cvičení</p>
        </div>
        
        <button
          onClick={goToToday}
          className="text-[#B8864A] text-sm font-medium px-3 py-1.5 rounded-lg bg-[#B8864A]/10 hover:bg-[#B8864A]/20 transition-colors"
        >
          Dnes
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={20} className="text-[#6B4C3B]" />
        </button>
        
        <div className="text-center">
          <h4 className="text-[#6B4C3B] font-semibold text-base">
            {MONTHS_SK[month]} {year}
          </h4>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={20} className="text-[#6B4C3B]" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="space-y-2">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS_SK.map((day) => (
            <div key={day} className="text-center py-2">
              <span className="text-[#8B7560] text-xs font-medium">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day) => {
            const hasWorkouts = day.workouts.length > 0;
            const dayNumber = new Date(day.date).getDate();
            
            return (
              <div
                key={day.date}
                className={`
                  aspect-square rounded-lg p-1 flex flex-col items-center justify-center relative
                  ${day.isCurrentMonth 
                    ? 'text-[#6B4C3B]' 
                    : 'text-[#C0B3A6]'
                  }
                  ${day.isToday 
                    ? 'bg-[#B8864A]/30 border border-[#B8864A]/50' 
                    : hasWorkouts 
                      ? 'bg-[#7A9E78]/20 hover:bg-[#7A9E78]/30' 
                      : 'hover:bg-white/20'
                  }
                  transition-colors cursor-pointer
                `}
                title={
                  hasWorkouts 
                    ? `${day.workouts.length} cvičení: ${day.workouts.map(w => w.workoutTitle).join(', ')}`
                    : undefined
                }
              >
                <span className="text-xs font-medium">{dayNumber}</span>
                
                {/* Workout indicators */}
                {hasWorkouts && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {day.workouts.slice(0, 3).map((workout, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ 
                          backgroundColor: getWorkoutTypeColor(workout.workoutType)
                        }}
                      />
                    ))}
                    {day.workouts.length > 3 && (
                      <div className="w-1 h-1 rounded-full bg-[#6B4C3B]" />
                    )}
                  </div>
                )}

                {/* Today indicator */}
                {day.isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#B8864A] rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#6B4C3B]" />
          <span className="text-[#8B7560]">Telo</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#7A9E78]" />
          <span className="text-[#8B7560]">Strava</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#A8848B]" />
          <span className="text-[#8B7560]">Myseľ</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#B8864A]" />
          <span className="text-[#8B7560]">Dnes</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-white/20 rounded-xl p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B4C3B] font-medium">Tento mesiac:</span>
          <div className="flex items-center gap-1">
            <Dumbbell size={14} className="text-[#7A9E78]" />
            <span className="text-[#6B4C3B] font-semibold">
              {calendarData.filter(d => d.isCurrentMonth && d.workouts.length > 0).length} dní cvičenia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}