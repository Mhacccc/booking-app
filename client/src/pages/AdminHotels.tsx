import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import type { Hotel } from "../types/hotel.types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { Alert } from "../components/ui/Alert";
import { Skeleton } from "../components/ui/Skeleton";
import { Edit2, Trash2, Plus, BedDouble, Star } from "lucide-react";

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [type, setType] = useState("hotel");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cheapestPrice, setCheapestPrice] = useState("");
  const [rating, setRating] = useState("4");
  const [featured, setFeatured] = useState(false);
  const [photosInput, setPhotosInput] = useState("");

  // Delete Confirmation Modal State
  const [deletingHotel, setDeletingHotel] = useState<Hotel | null>(null);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hotelApi.getAll();
      setHotels(res.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load hotels list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const openCreateModal = () => {
    setEditingHotel(null);
    setFormError(null);
    setName("");
    setType("hotel");
    setCity("");
    setAddress("");
    setDistance("500m from center");
    setTitle("");
    setDescription("");
    setCheapestPrice("");
    setRating("4");
    setFeatured(false);
    setPhotosInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setFormError(null);
    setName(hotel.name);
    setType(hotel.type);
    setCity(hotel.city);
    setAddress(hotel.address);
    setDistance(hotel.distance);
    setTitle(hotel.title);
    setDescription(hotel.description);
    setCheapestPrice(hotel.cheapestPrice.toString());
    setRating(hotel.rating.toString());
    setFeatured(hotel.featured);
    setPhotosInput(hotel.photos?.join(", ") || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate inputs
    if (!name || !city || !address || !title || !description || !cheapestPrice) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const priceNum = parseFloat(cheapestPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("cheapestPrice must be a valid positive number.");
      return;
    }

    setFormSubmitting(true);

    const photosArray = photosInput
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "");

    if (photosArray.length === 0) {
      photosArray.push(
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
      );
    }

    const payload: Partial<Hotel> = {
      name,
      type,
      city,
      address,
      distance,
      title,
      description,
      cheapestPrice: priceNum,
      rating: parseFloat(rating),
      featured,
      photos: photosArray,
    };

    try {
      if (editingHotel) {
        await hotelApi.update(editingHotel._id, payload);
      } else {
        await hotelApi.create(payload);
      }
      setIsModalOpen(false);
      fetchHotels();
    } catch (err: any) {
      setFormError(err.message || "Failed to save hotel details");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingHotel) return;
    try {
      await hotelApi.delete(deletingHotel._id);
      setDeletingHotel(null);
      fetchHotels();
    } catch (err: any) {
      alert(err.message || "Failed to delete hotel");
    }
  };

  const hotelTypes = [
    { value: "hotel", label: "Hotel" },
    { value: "villa", label: "Villa" },
    { value: "apartment", label: "Apartment" },
    { value: "resort", label: "Resort" },
    { value: "cabin", label: "Cabin" },
  ];

  const ratingOptions = [
    { value: "1", label: "1 Star" },
    { value: "2", label: "2 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "5", label: "5 Stars" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Properties Inventory</h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Register new locations, update pricing, or manage room categories.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 text-xs h-[38px] font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </Button>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-14 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Alert type="error">{error}</Alert>
      ) : hotels.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          No properties found in inventory. Click "Add Property" to begin.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-xs">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="py-4 px-6">Property Name</th>
                <th className="py-4 px-6">Classification</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Starting Rate</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {hotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{hotel.name}</td>
                  <td className="py-4 px-6 capitalize">
                    <span className="bg-primary-light text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                      {hotel.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium">
                    {hotel.city}, {hotel.address}
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">${hotel.cheapestPrice}/night</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                      <span>{hotel.rating}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {hotel.featured ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold">
                        Yes
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full text-xs font-bold">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/hotels/${hotel._id}/rooms`}>
                        <Button
                          variant="secondary"
                          className="h-[32px] px-2 text-xs font-bold inline-flex items-center gap-1 hover:bg-primary-light"
                          title="Manage Rooms"
                        >
                          <BedDouble className="w-3.5 h-3.5" />
                          <span>Rooms</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(hotel)}
                        className="h-[32px] w-[32px] p-0 flex items-center justify-center hover:bg-gray-100 rounded-md text-gray-600"
                        title="Edit Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setDeletingHotel(hotel)}
                        className="h-[32px] w-[32px] p-0 flex items-center justify-center hover:bg-rose-50 rounded-md text-rose-600"
                        title="Delete Property"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHotel ? "Edit Property details" : "Add New Property"}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={formSubmitting}>
              {editingHotel ? "Save Changes" : "Create Property"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <Alert type="error">{formError}</Alert>}

          <Input
            label="Property Name *"
            placeholder="e.g. Grand Stay Resort"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type *"
              options={hotelTypes}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <Input
              label="Starting Nightly Rate ($) *"
              placeholder="e.g. 150"
              type="number"
              min="1"
              value={cheapestPrice}
              onChange={(e) => setCheapestPrice(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City Location *"
              placeholder="e.g. Boracay"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <Input
              label="Distance from Center"
              placeholder="e.g. 500m from center"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>

          <Input
            label="Physical Address *"
            placeholder="e.g. Station 2, Beachfront, Boracay"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <Input
            label="Listing Tagline *"
            placeholder="e.g. Premium beachfront luxury resort with private pools"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Detailed Description *</label>
            <textarea
              className="px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 min-h-[80px]"
              placeholder="Write a descriptive overview of the hotel services, rules, and local amenities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <Select
              label="Default Rating"
              options={ratingOptions}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4.5 h-4.5 text-primary border-gray-300 rounded-sm focus:ring-primary focus:ring-2"
              />
              <label htmlFor="featured" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Highlight on Homepage (Featured)
              </label>
            </div>
          </div>

          <Input
            label="Photo URLs (comma separated list)"
            placeholder="e.g. https://url1.com, https://url2.com"
            value={photosInput}
            onChange={(e) => setPhotosInput(e.target.value)}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingHotel}
        onClose={() => setDeletingHotel(null)}
        title="Remove Property?"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeletingHotel(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          Are you absolutely sure you want to remove{" "}
          <strong className="text-gray-900">{deletingHotel?.name}</strong> from StayScape? All room
          categories associated with this hotel will remain in database but references might be pulled.
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
