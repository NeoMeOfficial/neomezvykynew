import { Outlet } from "react-router-dom";
import BottomNav from "@/components/neome/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-neome-bg font-lufga">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
