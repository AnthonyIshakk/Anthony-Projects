import { Outlet } from "react-router";
import { AuthProvider } from "@/context/AuthContext.jsx";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </div>
  );
}
