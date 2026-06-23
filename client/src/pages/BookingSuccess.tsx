
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function BookingSuccess() {
  const { state } = useLocation();

  const booking = state?.booking;
  const hotel = state?.hotel;

  const checkInDate = booking?.startDate ? new Date(booking.startDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';
  
  const checkOutDate = booking?.endDate ? new Date(booking.endDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-gray-200 rounded-xl p-8 shadow-lg text-center flex flex-col items-center gap-6">
      {/* Icon check badge */}
      <div className="w-16 h-16 rounded-full bg-success-light text-success flex items-center justify-center">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Booking Confirmed!</h1>
        <p className="text-sm font-semibold text-gray-500">Your reservation has been locked successfully.</p>
      </div>

      {booking && hotel && (
        <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 w-full text-left flex flex-col gap-2.5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Property</span>
            <span className="text-sm font-bold text-gray-900">{hotel.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dates</span>
            <span className="text-xs font-semibold text-gray-700">{checkInDate} — {checkOutDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Room Number</span>
            <span className="text-xs font-semibold text-gray-700">Room {booking.roomNumbers.join(', ')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Paid</span>
            <span className="text-base font-extrabold text-primary">${booking.totalPrice}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 w-full mt-4">
        <Link to="/bookings" className="w-full">
          <Button variant="primary" className="w-full">
            View My Bookings
          </Button>
        </Link>
        <Link to="/" className="w-full">
          <Button variant="ghost" className="w-full">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
