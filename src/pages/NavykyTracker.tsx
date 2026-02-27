import { useState } from "react";
import { Plus, Droplets, Dumbbell, Brain, Apple, Moon, Flame, Check } from "lucide-react";

type Habit = { id: number; label: string; icon: typeof Droplets; color: string; done: boolean };

const initialHabits: Habit[] = [
  { id: 1, label: "Piť vodu (2L)", icon: Droplets, color: "bg-blue-50 text-blue-500", done: false },
  { id: 2, label: "Cvičenie 30 min", icon: Dumbbell, color: "bg-neome-peach/30 text-orange-500", done: true },
  { id: 3, label: "Meditácia", icon: Brain, color: "bg-neome-lavender/30 text-purple-500", done: false },
  { id: 4, label: "Zdravé jedlo", icon: Apple, color: "bg-neome-sage/30 text-green-600", done: true },
  { id: 5, label: "Spánok 8 hodín", icon: Moon, color: "bg-indigo-50 text-indigo-500", done: false },
];

const weekDays = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];
const weekData = [true, true, true, true, false, false, false]; // simulated

export default function NavykyTracker() {
  const [habits, setHabits] = useState(initialHabits);
  const streak = 4;
  const completed = habits.filter((h) => h.done).length;

  const toggle = (id: number) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  };

  return (
    <div className="px-5 pt-14 space-y-6">
      <h1 className="text-mobile-2xl font-lufga font-bold text-neome-primary">Návyky</h1>

      {/* Streak card */}
      <div className="bg-gradient-to-br from-neome-peach/30 to-neome-lavender/20 rounded-3xl p-5 shadow-neome text-center">
        <Flame size={28} className="text-orange-400 mx-auto" />
        <p className="text-mobile-3xl font-lufga font-bold text-neome-primary mt-1">{streak}</p>
        <p className="text-mobile-sm font-lufga text-neome-primary/50">dní v rade</p>
        <p className="text-mobile-xs font-lufga text-neome-primary/30 mt-1">
          Skvelá práca! Pokračuj ďalej 💪
        </p>
      </div>

      {/* Weekly dots */}
      <div className="bg-white rounded-2xl p-4 shadow-neome">
        <p className="text-mobile-sm font-lufga font-semibold text-neome-primary mb-3">Tento týždeň</p>
        <div className="flex justify-between">
          {weekDays.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-lufga text-neome-primary/40">{d}</span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  weekData[i]
                    ? "bg-neome-primary text-white"
                    : i < 5
                    ? "bg-neome-primary/10 text-neome-primary/30"
                    : "bg-gray-100 text-gray-300"
                }`}
              >
                {weekData[i] && <Check size={14} />}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-mobile-sm font-lufga text-neome-primary/50">
          Dnes: <span className="font-semibold text-neome-primary">{completed}/{habits.length}</span> splnených
        </p>
      </div>

      {/* Habits */}
      <div className="space-y-2">
        {habits.map((h) => {
          const Icon = h.icon;
          return (
            <button
              key={h.id}
              onClick={() => toggle(h.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                h.done ? "bg-neome-sage/10" : "bg-white shadow-neome hover:shadow-neome-lg"
              }`}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.color}`}>
                <Icon size={20} />
              </span>
              <span className={`flex-1 text-left text-mobile-sm font-lufga font-medium ${
                h.done ? "text-neome-primary/30 line-through" : "text-neome-primary"
              }`}>
                {h.label}
              </span>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                h.done ? "bg-neome-primary border-neome-primary" : "border-neome-primary/20"
              }`}>
                {h.done && <Check size={12} className="text-white" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add button */}
      <button className="w-full py-3.5 border-2 border-dashed border-neome-primary/20 rounded-2xl flex items-center justify-center gap-2 text-neome-primary/40 hover:text-neome-primary/60 hover:border-neome-primary/40 transition-all">
        <Plus size={18} />
        <span className="text-mobile-sm font-lufga font-medium">Pridať návyk</span>
      </button>
    </div>
  );
}
