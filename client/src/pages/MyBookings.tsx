import { useEffect, useState } from "react";
import { bookingApi } from "../api/booking.api";
import type { Booking } from "../types/booking.types";
import { BookingCard } from "../components/booking/BookingCard";
import { Alert } from "../components/ui/Alert";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchBookings = () => {
    setLoading(true);
    bookingApi
      .getMine()
      .then((res) => {
        setBookings(res.data.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load bookings");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      await bookingApi.delete(id);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Bookings</h1>
        <p className="text-sm font-semibold text-gray-500 mt-1">Manage your reservation histories and statuses</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <Skeleton variant="rect" className="h-28" />
          <Skeleton variant="rect" className="h-28" />
          <Skeleton variant="rect" className="h-28" />
        </div>
      ) : error ? (
        <Alert type="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="You haven't made any reservations yet. Explore properties to start planning your next stay!"
          actionLabel="Explore Stays"
          onActionClick={() => navigate("/hotels")}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
              isCancelling={cancellingId === booking._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
