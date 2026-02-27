import { useState } from "react";
import { Plus, Flame } from "lucide-react";

const days = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

type Meal = { name: string; cal: number; image: string };
type DayMeals = { Raňajky: Meal | null; Obed: Meal | null; Večera: Meal | null; Snack: Meal | null };

const sampleData: Record<string, DayMeals> = {
  Po: {
    Raňajky: { name: "Ovsená kaša s ovocím", cal: 320, image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop" },
    Obed: { name: "Kuracie prsia s ryžou", cal: 480, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop" },
    Večera: { name: "Zeleninová polievka", cal: 220, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=200&fit=crop" },
    Snack: { name: "Grécky jogurt s medom", cal: 150, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop" },
  },
  Ut: {
    Raňajky: { name: "Smoothie bowl", cal: 300, image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200&h=200&fit=crop" },
    Obed: null, Večera: null, Snack: null,
  },
  St: { Raňajky: null, Obed: null, Večera: null, Snack: null },
  Št: { Raňajky: null, Obed: null, Večera: null, Snack: null },
  Pi: { Raňajky: null, Obed: null, Večera: null, Snack: null },
  So: { Raňajky: null, Obed: null, Večera: null, Snack: null },
  Ne: { Raňajky: null, Obed: null, Večera: null, Snack: null },
};

const slots = ["Raňajky", "Obed", "Večera", "Snack"] as const;

export default function JedalnicekPlanner() {
  const [activeDay, setActiveDay] = useState("Po");
  const meals = sampleData[activeDay];
  const totalCal = Object.values(meals).reduce((sum, m) => sum + (m?.cal || 0), 0);

  return (
    <div className="px-5 pt-14 space-y-6">
      <h1 className="text-mobile-2xl font-lufga font-bold text-neome-primary">Jedálniček</h1>

      {/* Day tabs */}
      <div className="flex gap-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`flex-1 py-2.5 rounded-2xl text-mobile-sm font-lufga font-semibold transition-all ${
              activeDay === d ? "bg-neome-primary text-white shadow-neome" : "bg-white text-neome-primary/50"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-neome-peach/20 to-neome-lavender/10 rounded-2xl p-4 shadow-neome flex items-center justify-between">
        <div>
          <p className="text-mobile-sm font-lufga text-neome-primary/50">Celkový príjem</p>
          <p className="text-mobile-xl font-lufga font-bold text-neome-primary">{totalCal} kcal</p>
        </div>
        <div className="flex gap-3 text-center">
          {[
            { label: "B", val: "65g" },
            { label: "S", val: "140g" },
            { label: "T", val: "45g" },
          ].map((m) => (
            <div key={m.label} className="bg-white/60 rounded-xl px-3 py-2">
              <p className="text-mobile-sm font-lufga font-bold text-neome-primary">{m.val}</p>
              <p className="text-[10px] font-lufga text-neome-primary/40">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meal slots */}
      <div className="space-y-3">
        {slots.map((slot) => {
          const meal = meals[slot];
          return (
            <div key={slot} className="bg-white rounded-2xl p-4 shadow-neome">
              <p className="text-mobile-xs font-lufga font-semibold text-neome-primary/40 uppercase tracking-wider mb-2">
                {slot}
              </p>
              {meal ? (
                <div className="flex items-center gap-3">
                  <img src={meal.image} alt={meal.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-mobile-sm font-lufga font-semibold text-neome-primary">{meal.name}</p>
                    <p className="text-[11px] font-lufga text-neome-primary/40 flex items-center gap-1">
                      <Flame size={10} /> {meal.cal} kcal
                    </p>
                  </div>
                </div>
              ) : (
                <button className="flex items-center gap-2 text-neome-primary/30 hover:text-neome-primary/50 transition-colors">
                  <Plus size={18} />
                  <span className="text-mobile-sm font-lufga">Pridať jedlo</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
