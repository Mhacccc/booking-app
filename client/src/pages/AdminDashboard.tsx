import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import { roomApi } from "../api/room.api";
import { bookingApi } from "../api/booking.api";
import { userApi } from "../api/user.api";
import { Skeleton } from "../components/ui/Skeleton";
import { Alert } from "../components/ui/Alert";
import { Hotel, BedDouble, Calendar, Users, TrendingUp, ShieldAlert, Award } from "lucide-react";

interface DashboardStats {
  hotelsCount: number;
  roomsCount: number;
  bookingsCount: number;
  usersCount: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  adminsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [hotelsRes, roomsRes, bookingsRes, usersRes] = await Promise.all([
          hotelApi.getAll(),
          roomApi.getAll(),
          bookingApi.getAll(),
          userApi.getAll(),
        ]);

        const hotels = hotelsRes.data.data;
        const rooms = roomsRes.data.data;
        const bookings = bookingsRes.data.data;
        const users = usersRes.data.data;

        const pending = bookings.filter((b) => b.status === "pending").length;
        const confirmed = bookings.filter((b) => b.status === "confirmed").length;
        const cancelled = bookings.filter((b) => b.status === "cancelled").length;
        const admins = users.filter((u) => u.isAdmin).length;

        setStats({
          hotelsCount: hotels.length,
          roomsCount: rooms.length,
          bookingsCount: bookings.length,
          usersCount: users.length,
          pendingBookings: pending,
          confirmedBookings: confirmed,
          cancelledBookings: cancelled,
          adminsCount: admins,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="text" className="h-4 w-64 mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton variant="rect" className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

  const statCards = [
    {
      title: "Properties",
      value: stats?.hotelsCount || 0,
      description: "Hotels, Resorts, Villas",
      icon: Hotel,
      link: "/admin/hotels",
      colorClass: "from-blue-500 to-indigo-600 shadow-blue-500/10",
    },
    {
      title: "Room Types",
      value: stats?.roomsCount || 0,
      description: "Across all properties",
      icon: BedDouble,
      link: "/admin/hotels",
      colorClass: "from-purple-500 to-pink-600 shadow-purple-500/10",
    },
    {
      title: "Reservations",
      value: stats?.bookingsCount || 0,
      description: "Total bookings recorded",
      icon: Calendar,
      link: "/admin/bookings",
      colorClass: "from-emerald-500 to-teal-600 shadow-emerald-500/10",
    },
    {
      title: "Accounts",
      value: stats?.usersCount || 0,
      description: `${stats?.adminsCount || 0} administrators active`,
      icon: Users,
      link: "/admin/users",
      colorClass: "from-amber-500 to-orange-600 shadow-amber-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">
          Monitor your platform's operational stats and inventory health.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className={`relative overflow-hidden bg-linear-to-br ${card.colorClass} p-6 rounded-2xl text-white shadow-lg hover:scale-103 hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-white/80 font-bold tracking-wide uppercase">
                    {card.title}
                  </span>
                  <span className="text-4xl font-extrabold tracking-tight">{card.value}</span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-white/70 font-semibold mt-4">{card.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Booking Health & Roles Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Bookings Stats Card */}
        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900">Booking Status Distribution</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <span className="text-2xl font-extrabold text-amber-700">
                {stats?.pendingBookings || 0}
              </span>
              <p className="text-xs text-amber-800 font-bold mt-1">Pending Approval</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <span className="text-2xl font-extrabold text-emerald-700">
                {stats?.confirmedBookings || 0}
              </span>
              <p className="text-xs text-emerald-800 font-bold mt-1">Confirmed</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
              <span className="text-2xl font-extrabold text-rose-700">
                {stats?.cancelledBookings || 0}
              </span>
              <p className="text-xs text-rose-800 font-bold mt-1">Cancelled</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Approval Rate</span>
              <span>
                {stats?.bookingsCount
                  ? Math.round(((stats.confirmedBookings + stats.cancelledBookings) / stats.bookingsCount) * 100)
                  : 0}
                % Resolved
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${
                    stats?.bookingsCount
                      ? ((stats.confirmedBookings) / stats.bookingsCount) * 100
                      : 0
                  }%`,
                }}
              />
              <div
                className="bg-amber-500 h-full"
                style={{
                  width: `${
                    stats?.bookingsCount
                      ? ((stats.pendingBookings) / stats.bookingsCount) * 100
                      : 0
                  }%`,
                }}
              />
              <div
                className="bg-rose-500 h-full"
                style={{
                  width: `${
                    stats?.bookingsCount
                      ? ((stats.cancelledBookings) / stats.bookingsCount) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Platform Security & Roles Card */}
        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900">Security & Roles</h3>
          </div>

          <div className="flex items-start gap-4 bg-primary-light/40 border border-primary/5 rounded-xl p-4">
            <Award className="w-8 h-8 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-gray-900">Administrator Privileges</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Currently, {stats?.adminsCount} accounts hold Administrative permissions. Admins have access to edit inventory properties, add room selections, delete booking data, and change user access levels.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-semibold border-t border-gray-100 pt-4">
            <span className="text-gray-500">Regular Registrants</span>
            <span className="text-gray-900 font-bold">
              {(stats?.usersCount || 0) - (stats?.adminsCount || 0)} Guests
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
