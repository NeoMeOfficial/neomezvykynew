import { useState } from 'react';
import { Play, Clock, Users, Star } from 'lucide-react';
import CompleteWorkoutButton from './CompleteWorkoutButton';
import FavoriteButton from '../favorites/FavoriteButton';

const DEMO_WORKOUTS = [
  {
    id: 'demo_1',
    title: 'Ranné prebudenie',
    type: 'telo' as const,
    duration: 15,
    program: 'BodyForming',
    description: 'Energické cvičenie na začiatok dňa',
    difficulty: 'Začiatočník',
    exercises: 8,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop'
  },
  {
    id: 'demo_2', 
    title: 'Strečing po práci',
    type: 'strava' as const,
    duration: 20,
    program: 'ElasticBands',
    description: 'Uvoľnenie napätia po dlhom dni',
    difficulty: 'Stredne pokročilý',
    exercises: 6,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop'
  },
  {
    id: 'demo_3',
    title: 'Večerné uvoľnenie',
    type: 'mysel' as const,
    duration: 10,
    description: 'Relaxačné cvičenia na lepší spánok',
    difficulty: 'Začiatočník', 
    exercises: 4,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=400&h=250&fit=crop'
  }
];

interface DemoWorkoutCardProps {
  workoutIndex?: number;
}

export default function DemoWorkoutCard({ workoutIndex = 0 }: DemoWorkoutCardProps) {
  const workout = DEMO_WORKOUTS[workoutIndex] || DEMO_WORKOUTS[0];
  const [isPlaying, setIsPlaying] = useState(false);

  const workoutTypeColors = {
    telo: '#6B4C3B',
    strava: '#7A9E78',
    mysel: '#A8848B'
  };

  const workoutTypeLabels = {
    telo: 'Telo',
    strava: 'Strava',
    mysel: 'Myseľ'
  };

  return (
    <div className="bg-white/30 backdrop-blur-[40px] border border-white/20 rounded-2xl overflow-hidden">
      {/* Header Image */}
      <div className="relative h-48">
        <img 
          src={workout.image} 
          alt={workout.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Play Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Play size={24} className="text-[#6B4C3B] ml-1" fill="currentColor" />
          </div>
        </button>

        {/* Workout Type Badge */}
        <div 
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-medium"
          style={{ backgroundColor: workoutTypeColors[workout.type] }}
        >
          {workoutTypeLabels[workout.type]}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton
            itemId={workout.id}
            type="workout"
            title={workout.title}
            image={workout.image}
            duration={`${workout.duration} min`}
            category={workout.type}
            program={workout.program}
            metadata={{ 
              difficulty: workout.difficulty,
              exercises: workout.exercises 
            }}
            size="sm"
          />
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
          <Clock size={14} />
          <span className="text-sm font-medium">{workout.duration} min</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-[#6B4C3B] font-bold text-lg mb-1">{workout.title}</h3>
          <p className="text-[#8B7560] text-sm">{workout.description}</p>
        </div>

        {/* Workout Info */}
        <div className="flex items-center gap-4 text-sm text-[#8B7560]">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{workout.difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} />
            <span>{workout.exercises} cvikov</span>
          </div>
          {workout.program && (
            <div className="px-2 py-1 bg-[#B8864A]/20 rounded-full">
              <span className="text-[#B8864A] text-xs font-medium">{workout.program}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 bg-[#B8864A] text-white rounded-xl py-3 px-4 font-semibold text-sm hover:bg-[#A67B42] transition-colors flex items-center justify-center gap-2"
          >
            <Play size={16} fill="currentColor" />
            {isPlaying ? 'Pokračovať' : 'Začať cvičenie'}
          </button>
        </div>

        {/* Demo Complete Button */}
        {isPlaying && (
          <div className="border-t border-white/20 pt-4">
            <CompleteWorkoutButton
              workoutId={workout.id}
              workoutTitle={workout.title}
              workoutType={workout.type}
              duration={workout.duration}
              program={workout.program}
              metadata={{
                difficulty: workout.difficulty,
                exercises: workout.exercises,
                demo: true
              }}
              variant="primary"
              size="md"
              onComplete={(session) => {
                console.log('Workout completed:', session);
                setIsPlaying(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}