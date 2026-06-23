import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import type { Hotel } from "../types/hotel.types";
import { PropertyCard } from "../components/property/PropertyCard";
import { SearchBar } from "../components/search/SearchBar";
import { Skeleton } from "../components/ui/Skeleton";
import { Alert } from "../components/ui/Alert";
import { EmptyState } from "../components/ui/EmptyState";

export default function HotelList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Read URL params
  const urlCity = searchParams.get("city") || "";
  const urlType = searchParams.get("type") || "";

  useEffect(() => {
    hotelApi
      .getAll()
      .then((res) => {
        setHotels(res.data.data);
        // Set max price based on actual prices
        const maxPrice = res.data.data.length > 0 
          ? Math.max(...res.data.data.map((h: Hotel) => h.cheapestPrice), 500)
          : 1000;
        setPriceRange(maxPrice);
      })
      .catch((err) => {
        setError(err.message || "Failed to load hotels");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Sync type from URL if present
  useEffect(() => {
    if (urlType) {
      setSelectedTypes([urlType]);
    } else {
      setSelectedTypes([]);
    }
  }, [urlType]);

  const handleSearch = (params: { city: string; checkIn: string; checkOut: string; guests: number }) => {
    const nextParams = new URLSearchParams(searchParams);
    if (params.city) {
      nextParams.set("city", params.city);
    } else {
      nextParams.delete("city");
    }
    if (params.checkIn) nextParams.set("startDate", params.checkIn);
    if (params.checkOut) nextParams.set("endDate", params.checkOut);
    if (params.guests) nextParams.set("guests", params.guests.toString());
    setSearchParams(nextParams);
  };

  // Filter & Sort computation
  const filteredAndSortedHotels = useMemo(() => {
    let result = [...hotels];

    // Filter by City
    if (urlCity) {
      result = result.filter((hotel) =>
        hotel.city.toLowerCase().includes(urlCity.toLowerCase())
      );
    }

    // Filter by Type
    if (selectedTypes.length > 0) {
      result = result.filter((hotel) => selectedTypes.includes(hotel.type));
    }

    // Filter by Rating
    if (selectedRating !== null) {
      result = result.filter((hotel) => (hotel.rating || 4.5) >= selectedRating);
    }

    // Filter by Price
    result = result.filter((hotel) => hotel.cheapestPrice <= priceRange);

    // Sort
    if (sortBy === "priceAsc") {
      result.sort((a, b) => a.cheapestPrice - b.cheapestPrice);
    } else if (sortBy === "priceDesc") {
      result.sort((a, b) => b.cheapestPrice - a.cheapestPrice);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [hotels, urlCity, selectedTypes, selectedRating, priceRange, sortBy]);

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedRating(null);
    const maxVal = hotels.length > 0 ? Math.max(...hotels.map((h) => h.cheapestPrice), 500) : 1000;
    setPriceRange(maxVal);
    setSearchParams({});
  };

  const propertyTypes = useMemo(() => {
    return Array.from(new Set(hotels.map((h) => h.type)));
  }, [hotels]);

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Search Header */}
      <section className="w-full">
        <SearchBar
          onSearch={handleSearch}
          initialValues={{
            city: urlCity,
          }}
        />
      </section>

      {/* Main Grid: Sidebar + List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="bg-white border border-gray-200 rounded-xl p-6 h-fit flex flex-col gap-6 lg:sticky lg:top-24 shadow-xs">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-gray-900 text-base">Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Price Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Max Price: ${priceRange}
            </label>
            <input
              type="range"
              min="0"
              max={hotels.length > 0 ? Math.max(...hotels.map((h) => h.cheapestPrice), 1000) : 1000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 font-semibold">
              <span>$0</span>
              <span>${hotels.length > 0 ? Math.max(...hotels.map((h) => h.cheapestPrice), 1000) : 1000}</span>
            </div>
          </div>

          {/* Property Type Filter */}
          {propertyTypes.length > 0 && (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Property Type
              </label>
              <div className="flex flex-col gap-2">
                {propertyTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm text-gray-700 font-medium select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="w-4 h-4 rounded-sm border-gray-200 text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Star Rating Filter */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Min Star Rating
            </label>
            <div className="flex flex-wrap gap-2">
              {[3, 4, 4.5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSelectedRating(selectedRating === val ? null : val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedRating === val
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {val}★+
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Column */}
        <section className="lg:col-span-3 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {urlCity ? `Stays in ${urlCity}` : "All Stays"}
              </h2>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Showing {filteredAndSortedHotels.length} {filteredAndSortedHotels.length === 1 ? 'property' : 'properties'}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[38px] pl-3 pr-8 border border-gray-200 rounded-md bg-white text-gray-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Hotel list/grid results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton variant="rect" className="aspect-[16/10]" />
                  <Skeleton variant="text" className="h-5 w-2/3" />
                  <Skeleton variant="text" className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert type="error">{error}</Alert>
          ) : filteredAndSortedHotels.length === 0 ? (
            <EmptyState
              title="No properties match your filters"
              description="Try adjusting your price range, choosing different categories, or searching another destination."
              actionLabel="Reset Filters"
              onActionClick={handleClearFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAndSortedHotels.map((hotel) => (
                <PropertyCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
