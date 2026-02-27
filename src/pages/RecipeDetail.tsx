import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Users, Flame, Check } from "lucide-react";
import { useState } from "react";

const ingredients = [
  "1 zrelé avokádo",
  "2 plátky kváskového chleba",
  "2 vajcia",
  "Štipka morskej soli",
  "Čerstvý citrón",
  "Chilli vločky",
  "Cherry paradajky",
  "Čerstvá rukola",
];

const steps = [
  "Opečte kváskový chlieb na panvici alebo v toasteri do zlatista.",
  "Avokádo rozdeľte na polovicu, odstráňte kôstku a lyžicou vyberte dužinu.",
  "Vidličkou rozmiažďte avokádo a pridajte soľ, citrón a chilli vločky.",
  "Na druhej panvici pripravte vajcia podľa chuti (volské oko alebo miešané).",
  "Na toast naneste avokádovú zmes, položte vajce a ozdobte paradajkami a rukolou.",
];

export default function RecipeDetail() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-neome-bg">
      <div className="relative h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=500&fit=crop"
          alt="Recipe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neome-bg via-transparent to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-neome"
        >
          <ArrowLeft size={20} className="text-neome-primary" />
        </button>
      </div>

      <div className="px-5 -mt-10 relative z-10 space-y-5">
        <h1 className="text-mobile-2xl font-lufga font-bold text-neome-primary">Avokádový toast s vajcom</h1>

        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-mobile-sm text-neome-primary/50 font-lufga"><Clock size={14} /> 15 min</span>
          <span className="flex items-center gap-1.5 text-mobile-sm text-neome-primary/50 font-lufga"><Users size={14} /> 2 porcie</span>
          <span className="flex items-center gap-1.5 text-mobile-sm text-neome-primary/50 font-lufga"><Flame size={14} /> 380 kcal</span>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-5 shadow-neome space-y-3">
          <h2 className="text-mobile-base font-lufga font-semibold text-neome-primary">Ingrediencie</h2>
          {ingredients.map((ing, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="flex items-center gap-3 w-full text-left"
            >
              <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                checked.has(i) ? "bg-neome-primary border-neome-primary" : "border-neome-primary/20"
              }`}>
                {checked.has(i) && <Check size={12} className="text-white" />}
              </span>
              <span className={`text-mobile-sm font-lufga ${checked.has(i) ? "text-neome-primary/30 line-through" : "text-neome-primary/70"}`}>
                {ing}
              </span>
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <h2 className="text-mobile-base font-lufga font-semibold text-neome-primary">Postup</h2>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 bg-white rounded-2xl p-4 shadow-neome">
              <span className="w-7 h-7 rounded-full bg-neome-peach/30 flex items-center justify-center text-mobile-xs font-lufga font-bold text-neome-primary flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-mobile-sm font-lufga text-neome-primary/70 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        {/* Nutrition */}
        <div className="bg-gradient-to-br from-neome-sage/20 to-neome-bg rounded-2xl p-5 shadow-neome">
          <h2 className="text-mobile-base font-lufga font-semibold text-neome-primary mb-3">Nutričné hodnoty</h2>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { label: "Kalórie", value: "380" },
              { label: "Bielkoviny", value: "18g" },
              { label: "Sacharidy", value: "32g" },
              { label: "Tuky", value: "22g" },
            ].map((n) => (
              <div key={n.label}>
                <p className="text-mobile-lg font-lufga font-bold text-neome-primary">{n.value}</p>
                <p className="text-[10px] font-lufga text-neome-primary/40">{n.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
