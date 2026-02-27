import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenstrualCycleTracker from "@/features/cycle/MenstrualCycleTracker";

export default function Cyklus() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neome-bg">
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-neome"
        >
          <ArrowLeft size={18} className="text-neome-primary" />
        </button>
        <h1 className="text-mobile-xl font-lufga font-bold text-neome-primary">Menštruačný cyklus</h1>
      </div>
      <div className="px-2">
        <MenstrualCycleTracker />
      </div>
    </div>
  );
}
