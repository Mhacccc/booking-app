import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { MobileTabBar } from "./layout/MobileTabBar";

export default function AppLayout() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
      <MobileTabBar />
    </div>
  );
}
