import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Zap, CheckCircle2, Circle, Play } from "lucide-react";
import { useState } from "react";

const lessons = [
  { day: 1, title: "Úvod a rozcvička", duration: "15 min", done: true },
  { day: 2, title: "Základy správneho držania tela", duration: "20 min", done: true },
  { day: 3, title: "Dynamická joga flow", duration: "25 min", done: false },
  { day: 4, title: "Core & stabilita", duration: "20 min", done: false },
  { day: 5, title: "Aktívna regenerácia", duration: "15 min", done: false },
  { day: 6, title: "Spevnenie dolnej časti tela", duration: "30 min", done: false },
  { day: 7, title: "Záverečná relaxácia", duration: "20 min", done: false },
];

export default function ProgramDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const completed = lessons.filter((l) => l.done).length;
  const progress = (completed / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-neome-bg">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop"
          alt="Program"
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

      <div className="px-5 -mt-8 relative z-10 space-y-5">
        <div>
          <h1 className="text-mobile-2xl font-lufga font-bold text-neome-primary">28-dňová výzva</h1>
          <p className="text-mobile-sm text-neome-primary/50 font-lufga mt-1 leading-relaxed">
            Komplexný program navrhnutý pre ženy, ktoré chcú posilniť telo, zlepšiť flexibilitu a nájsť vnútornú rovnováhu.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-mobile-sm text-neome-primary/60">
            <Clock size={16} /> <span className="font-lufga">4 týždne</span>
          </div>
          <div className="flex items-center gap-1.5 text-mobile-sm text-neome-primary/60">
            <Zap size={16} /> <span className="font-lufga">Stredná</span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-neome">
          <div className="flex items-center justify-between mb-2">
            <span className="text-mobile-sm font-lufga font-semibold text-neome-primary">Tvoj progres</span>
            <span className="text-mobile-sm font-lufga text-neome-primary/50">{completed}/{lessons.length}</span>
          </div>
          <div className="h-2 bg-neome-peach/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neome-primary to-neome-blush rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-2">
          {lessons.map((l) => (
            <button
              key={l.day}
              onClick={() => navigate(`/workout/${l.day}`)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                l.done ? "bg-neome-sage/10" : "bg-white shadow-neome hover:shadow-neome-lg"
              }`}
            >
              {l.done ? (
                <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
              ) : (
                <Circle size={22} className="text-neome-primary/20 flex-shrink-0" />
              )}
              <div className="flex-1 text-left">
                <p className={`text-mobile-sm font-lufga font-semibold ${l.done ? "text-neome-primary/40" : "text-neome-primary"}`}>
                  Deň {l.day}: {l.title}
                </p>
                <p className="text-[11px] font-lufga text-neome-primary/40">{l.duration}</p>
              </div>
              {!l.done && <Play size={16} className="text-neome-primary/30" />}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/workout/3")}
          className="w-full py-4 bg-neome-primary text-white rounded-2xl font-lufga font-semibold text-mobile-base shadow-neome-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          Začať cvičenie
        </button>
      </div>
    </div>
  );
}
