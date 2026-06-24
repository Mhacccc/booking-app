import { useEffect, useState } from "react";
import { bookingApi } from "../api/booking.api";
import { hotelApi } from "../api/hotel.api";
import { userApi } from "../api/user.api";
import type { Booking } from "../types/booking.types";
import type { Hotel } from "../types/hotel.types";
import type { User } from "../types/user.types";
import { StatusBadge } from "../components/booking/StatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Alert } from "../components/ui/Alert";
import { Skeleton } from "../components/ui/Skeleton";
import { Check, X, Trash2, CalendarRange } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Action States
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Delete State
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsRes, hotelsRes, usersRes] = await Promise.all([
        bookingApi.getAll(),
        hotelApi.getAll(),
        userApi.getAll(),
      ]);

      setBookings(bookingsRes.data.data);
      setHotels(hotelsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    setStatusUpdatingId(id);
    try {
      await bookingApi.updateStatus(id, status);
      // Reload bookings to reflect status change
      const res = await bookingApi.getAll();
      setBookings(res.data.data);
    } catch (err: any) {
      alert(err.message || `Failed to update status to ${status}`);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingBooking) return;
    try {
      await bookingApi.delete(deletingBooking._id);
      setDeletingBooking(null);
      // Reload bookings
      const res = await bookingApi.getAll();
      setBookings(res.data.data);
    } catch (err: any) {
      alert(err.message || "Failed to cancel/delete booking");
    }
  };

  // Helper resolvers
  const getHotelName = (hotelId: string) => {
    const hotel = hotels.find((h) => h._id === hotelId);
    return hotel ? hotel.name : `Hotel ID: ${hotelId.substring(0, 8)}...`;
  };

  const getUsername = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.username : `Guest ID: ${userId.substring(0, 8)}...`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Platform Reservations</h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Review, approve, cancel, or delete reservations across the platform.
        </p>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-14 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Alert type="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          No bookings recorded on the platform yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="py-4 px-6">Guest Account</th>
                <th className="py-4 px-6">Property</th>
                <th className="py-4 px-6">Stay Period</th>
                <th className="py-4 px-6">Rooms</th>
                <th className="py-4 px-6">Total Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{getUsername(booking.userId)}</td>
                  <td className="py-4 px-6 font-semibold text-gray-700">{getHotelName(booking.hotelId)}</td>
                  <td className="py-4 px-6 font-medium text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarRange className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-gray-600">
                    {booking.roomNumbers.join(", ")}
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">${booking.totalPrice}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="primary"
                            onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                            isLoading={statusUpdatingId === booking._id}
                            className="h-[28px] px-2 text-[10px] uppercase font-bold inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700"
                            title="Confirm Booking"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                            isLoading={statusUpdatingId === booking._id}
                            className="h-[28px] px-2 text-[10px] uppercase font-bold inline-flex items-center gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                            title="Cancel Booking"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </Button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <Button
                          variant="secondary"
                          onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                          isLoading={statusUpdatingId === booking._id}
                          className="h-[28px] px-2 text-[10px] uppercase font-bold inline-flex items-center gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                          title="Cancel Booking"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => setDeletingBooking(booking)}
                        className="h-[32px] w-[32px] p-0 flex items-center justify-center hover:bg-rose-50 rounded-md text-rose-600"
                        title="Delete Booking Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingBooking}
        onClose={() => setDeletingBooking(null)}
        title="Remove Booking Record?"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeletingBooking(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          Are you absolutely sure you want to remove the booking record for guest{" "}
          <strong className="text-gray-900">{getUsername(deletingBooking?.userId || "")}</strong> at{" "}
          <strong className="text-gray-900">{getHotelName(deletingBooking?.hotelId || "")}</strong>?
          This will completely delete the reservation record from the database. This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
