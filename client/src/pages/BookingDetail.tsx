import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { bookingApi } from "../api/booking.api";
import { hotelApi } from "../api/hotel.api";
import type { Booking } from "../types/booking.types";
import type { Hotel } from "../types/hotel.types";
import { StatusBadge } from "../components/booking/StatusBadge";
import { Skeleton } from "../components/ui/Skeleton";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookingApi
      .getById(id)
      .then((res) => {
        setBooking(res.data.data);
        // Load hotel details
        return hotelApi.getById(res.data.data.hotelId);
      })
      .then((hotelRes) => {
        setHotel(hotelRes.data.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load booking details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleCancelBooking = async () => {
    if (!booking || !window.confirm("Are you sure you want to cancel this booking?")) return;
    setIsCancelling(true);
    try {
      await bookingApi.delete(booking._id);
      setBooking({ ...booking, status: "cancelled" });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto py-8">
        <Skeleton variant="text" className="h-6 w-32" />
        <Skeleton variant="rect" className="h-48" />
        <Skeleton variant="rect" className="h-32" />
      </div>
    );
  }

  if (error || !booking || !hotel) {
    return (
      <div className="max-w-2xl mx-auto py-12 flex flex-col gap-4">
        <Alert type="error">{error || "Booking not found"}</Alert>
        <Link to="/bookings" className="text-primary font-bold hover:underline">
          &larr; Back to My Bookings
        </Link>
      </div>
    );
  }

  const checkInDate = new Date(booking.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const checkOutDate = new Date(booking.endDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-16">
      {/* Back navigation */}
      <div>
        <Link to="/bookings" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-primary transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Bookings
        </Link>
      </div>

      {/* Header card with status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Booking ID</span>
          <span className="text-sm font-bold text-gray-900 font-mono">{booking._id}</span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Hotel summary card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row gap-4 p-6">
        <div className="w-full sm:w-[150px] aspect-4/3 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <img
            src={hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-1.5 flex-1">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold self-start uppercase tracking-wider text-[9px]">
            {hotel.type}
          </span>
          <h3 className="font-extrabold text-gray-900 text-xl hover:text-primary transition-colors">
            <Link to={`/hotels/${hotel._id}`}>{hotel.name}</Link>
          </h3>
          <p className="text-xs font-semibold text-gray-500">
            📍 {hotel.address}, {hotel.city}
          </p>
        </div>
      </div>

      {/* Reservation details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <h4 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3 uppercase tracking-wider">
          Reservation Details
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Check-in</span>
            <span className="text-sm font-semibold text-gray-800">{checkInDate}</span>
            <span className="text-xs text-gray-400 mt-0.5">From 2:00 PM</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Check-out</span>
            <span className="text-sm font-semibold text-gray-800">{checkOutDate}</span>
            <span className="text-xs text-gray-400 mt-0.5">Before 12:00 PM</span>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Room Allocation</span>
            <span className="text-sm font-semibold text-gray-800">Room {booking.roomNumbers.join(', ')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Price</span>
            <span className="text-base font-extrabold text-primary">${booking.totalPrice}</span>
          </div>
        </div>

        {booking.status !== 'cancelled' && (
          <div className="border-t border-gray-100 pt-6 mt-2 flex justify-end">
            <Button
              variant="danger"
              className="text-xs h-[38px] px-6 font-bold"
              onClick={handleCancelBooking}
              isLoading={isCancelling}
            >
              Cancel Reservation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
