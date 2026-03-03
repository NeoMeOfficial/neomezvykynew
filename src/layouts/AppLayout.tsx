import { Outlet } from "react-router-dom";
import BottomNav from "@/components/neome/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen font-lufga">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
