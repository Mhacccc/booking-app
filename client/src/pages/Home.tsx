import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import type { Hotel } from "../types/hotel.types";
import { SearchBar } from "../components/search/SearchBar";
import { PropertyGrid } from "../components/property/PropertyGrid";
import { Skeleton } from "../components/ui/Skeleton";
import { Alert } from "../components/ui/Alert";

export default function Home() {
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    hotelApi
      .getAll()
      .then((res) => {
        const list = res.data.data;
        // Get featured hotels
        setFeaturedHotels(list.filter((h) => h.featured).slice(0, 4));
      })
      .catch((err) => {
        setError(err.message || "Failed to load featured properties");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = (params: { city: string; checkIn: string; checkOut: string; guests: number }) => {
    const query = new URLSearchParams();
    if (params.city) query.append("city", params.city);
    if (params.checkIn) query.append("startDate", params.checkIn);
    if (params.checkOut) query.append("endDate", params.checkOut);
    if (params.guests) query.append("guests", params.guests.toString());
    navigate(`/hotels?${query.toString()}`);
  };

  const handleCategoryClick = (type: string) => {
    navigate(`/hotels?type=${type}`);
  };

  const categories = [
    { name: "Hotels", type: "hotel", icon: "🏨" },
    { name: "Villas", type: "villa", icon: "🏡" },
    { name: "Apartments", type: "apartment", icon: "🏢" },
    { name: "Resorts", type: "resort", icon: "🏖️" },
    { name: "Cabins", type: "cabin", icon: "🌲" },
  ];

  const destinations = [
    { name: "Manila", image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=400&q=80", count: "12 properties" },
    { name: "Cebu", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80", count: "8 properties" },
    { name: "Boracay", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", count: "15 properties" },
  ];

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-linear-to-r from-primary-light/50 to-blue-50/30 px-6 py-12 md:py-20 flex flex-col items-center text-center gap-6 border border-primary/5">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Find your perfect stay
          </h1>
          <p className="text-base md:text-lg text-gray-500 font-medium">
            Discover hotels, villas, and apartments worldwide with transparent pricing and instant availability.
          </p>
        </div>

        {/* Compact SearchBar */}
        <div className="w-full max-w-4xl mt-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Category Tabs */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900">Browse by Property Type</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none select-none">
          {categories.map((cat) => (
            <button
              key={cat.type}
              onClick={() => handleCategoryClick(cat.type)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold text-sm transition-all shadow-xs cursor-pointer shrink-0"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-bold text-gray-900">Featured Properties</h2>
          <button
            onClick={() => navigate("/hotels")}
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all stays</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton variant="rect" className="aspect-16/10" />
                <Skeleton variant="text" className="h-5 w-2/3" />
                <Skeleton variant="text" className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert type="error">{error}</Alert>
        ) : featuredHotels.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-semibold bg-white border border-gray-100 rounded-xl">
            No featured properties found.
          </div>
        ) : (
          <PropertyGrid hotels={featuredHotels} />
        )}
      </section>

      {/* Popular Destinations */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-900">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/hotels?city=${dest.name}`)}
              className="group relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-extrabold text-xl tracking-tight">{dest.name}</h3>
                <span className="text-xs text-gray-300 font-semibold">{dest.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
