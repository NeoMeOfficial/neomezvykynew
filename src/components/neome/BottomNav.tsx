import { NavLink } from "react-router-dom";
import { Home, Dumbbell, BookOpen, Users, User } from "lucide-react";

const tabs = [
  { to: "/domov", label: "Domov", icon: Home },
  { to: "/programy", label: "Programy", icon: Dumbbell },
  { to: "/kniznica", label: "Knižnica", icon: BookOpen },
  { to: "/komunita", label: "Komunita", icon: Users },
  { to: "/profil", label: "Profil", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-t border-neome-primary/10">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto pb-safe">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 transition-all duration-200 ${
                  isActive
                    ? "text-neome-primary"
                    : "text-stone-400 hover:text-stone-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.5} />
                  <span className="text-[10px] font-lufga font-semibold tracking-wide">
                    {t.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0 w-1 h-1 rounded-full bg-neome-primary" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
