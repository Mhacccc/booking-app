import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import { roomApi } from "../api/room.api";
import { bookingApi } from "../api/booking.api";
import { useAuthStore } from "../stores/auth.store";
import type { Hotel } from "../types/hotel.types";
import type { Room } from "../types/room.types";
import { RoomCard } from "../components/property/RoomCard";
import { BookingSidebar } from "../components/property/BookingSidebar";
import { Rating } from "../components/ui/Rating";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { Alert } from "../components/ui/Alert";

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected room state for BookingSidebar
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    hotelApi
      .getById(id)
      .then((res) => {
        setHotel(res.data.data);
        // Once hotel is loaded, fetch rooms
        setRoomsLoading(true);
        roomApi
          .getAll()
          .then((roomRes) => {
            // Filter rooms that belong to this hotel
            const hotelRoomIds = res.data.data.rooms || [];
            const filtered = roomRes.data.data.filter((r) =>
              hotelRoomIds.includes(r._id)
            );
            setRooms(filtered);
          })
          .catch((err) => {
            console.error("Failed to load rooms", err);
          })
          .finally(() => {
            setRoomsLoading(false);
          });
      })
      .catch((err) => {
        setError(err.message || "Failed to load hotel details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleRoomSelect = (roomId: string, price: number, roomNumbers: number[]) => {
    setSelectedRoomId(roomId);
    setSelectedPrice(price);
    setSelectedNumbers(roomNumbers);
  };

  const handleReserve = async (bookingDetails: { checkIn: string; checkOut: string; guests: number }) => {
    if (!hotel || !selectedRoomId || selectedNumbers.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const start = new Date(bookingDetails.checkIn);
      const end = new Date(bookingDetails.checkOut);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      const totalPrice = selectedPrice * nights;

      const payload = {
        hotelId: hotel._id,
        roomId: selectedRoomId,
        roomNumbers: selectedNumbers,
        startDate: bookingDetails.checkIn,
        endDate: bookingDetails.checkOut,
        totalPrice,
      };

      const res = await bookingApi.create(payload);
      if (res.data.success) {
        navigate(`/booking/success`, { state: { booking: res.data.data, hotel } });
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create booking. Please make sure the selected room is available.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto py-8">
        <Skeleton variant="text" className="h-6 w-32" />
        <Skeleton variant="text" className="h-10 w-2/3" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col gap-4">
        <Alert type="error">{error || "Hotel not found"}</Alert>
        <Link to="/hotels" className="text-primary font-bold hover:underline">
          &larr; Back to properties
        </Link>
      </div>
    );
  }

  // Get selected room object
  const selectedRoom = rooms.find((r) => r._id === selectedRoomId);

  const mainImageUrl = hotel.photos && hotel.photos.length > 0 
    ? hotel.photos[0] 
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

  const otherImages = hotel.photos && hotel.photos.length > 1 ? hotel.photos.slice(1, 5) : [];

  return (
    <div className="flex flex-col gap-8 pb-16 max-w-[1140px] mx-auto">
      {/* Breadcrumb */}
      <div>
        <Link to="/hotels" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-primary transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to properties
        </Link>
      </div>

      {/* Hotel Title & Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{hotel.name}</h1>
            <Badge variant="primary" className="capitalize">{hotel.type}</Badge>
            {hotel.featured && <Badge variant="superhost">Featured</Badge>}
          </div>
          <p className="text-sm font-semibold text-gray-500 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{hotel.address}, {hotel.city}</span>
            <span className="text-gray-300">•</span>
            <span>{hotel.distance} from center</span>
          </p>
        </div>
        <div className="flex-shrink-0">
          <Rating value={hotel.rating || 4.5} count={120} showText className="text-base" />
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl overflow-hidden aspect-[2/1] bg-gray-100 shadow-sm border border-gray-100">
        <div className="md:col-span-2 h-full overflow-hidden">
          <img src={mainImageUrl} alt={hotel.name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
        </div>
        {otherImages.length > 0 ? (
          <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-3 h-full">
            {otherImages.map((photo, idx) => (
              <div key={idx} className="overflow-hidden h-full">
                <img src={photo} alt={`${hotel.name} view ${idx + 2}`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden md:flex md:col-span-2 items-center justify-center bg-gray-50 text-gray-400 font-semibold">
            No additional photos
          </div>
        )}
      </section>

      {/* Details columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left main: rooms & description */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-snug">{hotel.title}</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Rooms Area */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-900">Select Available Rooms</h3>
            {roomsLoading ? (
              <div className="flex flex-col gap-4">
                <Skeleton variant="rect" className="h-32" />
                <Skeleton variant="rect" className="h-32" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="p-6 text-center text-gray-500 font-semibold bg-white border border-gray-100 rounded-lg">
                No rooms available for this property.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {rooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onSelect={handleRoomSelect}
                    selectedRoomId={selectedRoomId}
                    selectedNumbers={selectedNumbers}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: sticky BookingSidebar */}
        <div>
          <BookingSidebar
            pricePerNight={selectedRoomId ? selectedPrice : hotel.cheapestPrice}
            selectedRoomTitle={selectedRoom?.title}
            selectedRoomNumbers={selectedNumbers}
            onReserve={handleReserve}
            isLoading={isSubmitting}
            isAuthenticated={!!user}
          />
        </div>
      </div>
    </div>
  );
}
