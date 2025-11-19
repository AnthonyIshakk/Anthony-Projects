import { Outlet } from "react-router";
import { AppSidebar } from "@components/app_sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex gap-4 p-4">
      <div className="sticky top-4 h-[calc(100vh-2rem)]">
        <AppSidebar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
