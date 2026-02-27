import { useNavigate } from "react-router-dom";
import { Clock, Flame, ArrowLeft, ChefHat } from "lucide-react";
import { useState } from "react";

const categories = ["Všetky", "Raňajky", "Obed", "Večera", "Snack", "Dezert"];

const recipes = [
  { id: "1", title: "Smoothie bowl s ovocím", time: "10 min", cal: "320 kcal", diff: "Ľahká", cat: "Raňajky", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop" },
  { id: "2", title: "Avokádový toast s vajcom", time: "15 min", cal: "380 kcal", diff: "Ľahká", cat: "Raňajky", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop" },
  { id: "3", title: "Buddha bowl s quinoou", time: "25 min", cal: "450 kcal", diff: "Stredná", cat: "Obed", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop" },
  { id: "4", title: "Losos s grilovanou zeleninou", time: "30 min", cal: "520 kcal", diff: "Stredná", cat: "Večera", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop" },
  { id: "5", title: "Proteínové guľôčky", time: "15 min", cal: "180 kcal", diff: "Ľahká", cat: "Snack", image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop" },
  { id: "6", title: "Čokoládový chia puding", time: "5 min + noc", cal: "280 kcal", diff: "Ľahká", cat: "Dezert", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop" },
];

// Nordic Card Component
function NordicCard({ children, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ 
        boxShadow: '0 12px 48px rgba(122, 158, 120, 0.08), 0 6px 24px rgba(122, 158, 120, 0.04), 0 3px 12px rgba(122, 158, 120, 0.02)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {children}
    </div>
  );
}

export default function Recepty() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Všetky");
  const filtered = active === "Všetky" ? recipes : recipes.filter((r) => r.cat === active);

  return (
    <div className="w-full min-h-screen px-3 py-6 pb-28 space-y-6">
      {/* Nordic Header */}
      <NordicCard className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5" style={{ color: '#A89B8C' }} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `rgba(122, 158, 120, 0.14)` }}>
              <ChefHat className="w-4 h-4" style={{ color: '#7A9E78' }} />
            </div>
            <h1 className="text-[16px] font-semibold" style={{ color: '#2E2218' }}>Recepty</h1>
          </div>
        </div>
      </NordicCard>

      {/* Nordic Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-medium whitespace-nowrap transition-all ${
              active === category 
                ? "text-white shadow-md" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            style={{ 
              backgroundColor: active === category ? '#7A9E78' : '',
              boxShadow: active === category ? '0 4px 16px rgba(122, 158, 120, 0.2)' : ''
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Nordic Recipe Cards */}
      <div className="space-y-3">
        {filtered.map((recipe) => (
          <NordicCard key={recipe.id} onClick={() => navigate(`/recept/${recipe.id}`)} className="overflow-hidden">
            <div className="flex">
              {/* Recipe Image */}
              <div className="w-28 h-28 flex-shrink-0">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover rounded-l-3xl"
                />
              </div>
              
              {/* Recipe Content */}
              <div className="flex-1 p-4 flex flex-col justify-center">
                <h3 className="text-[14px] font-semibold mb-2 leading-tight" style={{ color: '#2E2218' }}>
                  {recipe.title}
                </h3>
                
                {/* Recipe Meta */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" style={{ color: '#A89B8C' }} />
                    <span className="text-[11px]" style={{ color: '#A89B8C' }}>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3" style={{ color: '#A89B8C' }} />
                    <span className="text-[11px]" style={{ color: '#A89B8C' }}>{recipe.cal}</span>
                  </div>
                </div>
                
                {/* Difficulty Badge */}
                <div className="inline-flex">
                  <span 
                    className="px-2 py-1 rounded-xl text-[10px] font-medium"
                    style={{ 
                      backgroundColor: 'rgba(122, 158, 120, 0.14)',
                      color: '#7A9E78'
                    }}
                  >
                    {recipe.diff}
                  </span>
                </div>
              </div>
            </div>
          </NordicCard>
        ))}
      </div>
    </div>
  );
}
