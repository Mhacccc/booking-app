import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Hotel, Calendar, Users, ArrowLeft } from "lucide-react";

export const AdminLayout: React.FC = () => {
  const navItems = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/hotels", label: "Hotels & Rooms", icon: Hotel, end: false },
    { to: "/admin/bookings", label: "Bookings", icon: Calendar, end: false },
    { to: "/admin/users", label: "Users & Roles", icon: Users, end: false },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full min-h-[calc(100vh-10rem)] py-4">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sticky top-20 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to StayScape</span>
            </Link>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Admin Console</h2>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Manage platform assets
            </p>
          </div>

          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 scrollbar-none border-b border-gray-100 lg:border-b-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20 scale-102"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200 shadow-xs p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};
