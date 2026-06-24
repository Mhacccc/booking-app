import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import { roomApi } from "../api/room.api";
import type { Hotel } from "../types/hotel.types";
import type { Room } from "../types/room.types";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Alert } from "../components/ui/Alert";
import { Skeleton } from "../components/ui/Skeleton";
import { Edit2, Trash2, Plus, ArrowLeft } from "lucide-react";

export default function AdminRooms() {
  const { id: hotelId } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [desc, setDesc] = useState("");
  const [roomNumbersInput, setRoomNumbersInput] = useState("");

  // Delete State
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const fetchHotelAndRooms = async () => {
    if (!hotelId) return;
    setLoading(true);
    setError(null);
    try {
      // Get the Hotel first to find which Room IDs belong to it
      const hotelRes = await hotelApi.getById(hotelId);
      const hotelData = hotelRes.data.data;
      setHotel(hotelData);

      // Get all Room Categories
      const roomsRes = await roomApi.getAll();
      const allRooms = roomsRes.data.data;

      // Filter rooms that belong to this hotel's rooms list
      const hotelRoomList = allRooms.filter((r) => hotelData.rooms.includes(r._id));
      setRooms(hotelRoomList);
    } catch (err: any) {
      setError(err.message || "Failed to load hotel or rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelAndRooms();
  }, [hotelId]);

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormError(null);
    setTitle("");
    setPrice("");
    setMaxPeople("2");
    setDesc("");
    setRoomNumbersInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormError(null);
    setTitle(room.title);
    setPrice(room.price.toString());
    setMaxPeople(room.maxPeople.toString());
    setDesc(room.desc);
    setRoomNumbersInput(room.roomNumbers.map((rn) => rn.number).join(", "));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title || !price || !maxPeople || !desc || !roomNumbersInput) {
      setFormError("Please fill in all fields.");
      return;
    }

    const priceNum = parseFloat(price);
    const maxPeopleNum = parseInt(maxPeople);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Price must be a valid positive number.");
      return;
    }
    if (isNaN(maxPeopleNum) || maxPeopleNum <= 0) {
      setFormError("Max people capacity must be a valid integer.");
      return;
    }

    const roomNumbers = roomNumbersInput
      .split(",")
      .map((numStr) => parseInt(numStr.trim()))
      .filter((num) => !isNaN(num))
      .map((num) => ({ number: num, unavailableDates: [] }));

    if (roomNumbers.length === 0) {
      setFormError("You must provide at least one valid room number (e.g. 101, 102).");
      return;
    }

    setFormSubmitting(true);

    const payload = {
      title,
      price: priceNum,
      maxPeople: maxPeopleNum,
      desc,
      roomNumbers,
    };

    try {
      if (editingRoom) {
        await roomApi.update(editingRoom._id, payload);
      } else {
        if (!hotelId) return;
        await roomApi.create(hotelId, payload);
      }
      setIsModalOpen(false);
      fetchHotelAndRooms();
    } catch (err: any) {
      setFormError(err.message || "Failed to save room details");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRoom || !hotelId) return;
    try {
      await roomApi.delete(deletingRoom._id, hotelId);
      setDeletingRoom(null);
      fetchHotelAndRooms();
    } catch (err: any) {
      alert(err.message || "Failed to delete room");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/admin/hotels"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Properties</span>
        </Link>
        {hotel ? (
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Rooms for <span className="text-primary">{hotel.name}</span>
          </h1>
        ) : (
          <Skeleton variant="text" className="h-8 w-64" />
        )}
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Add specific room configurations and record physical room numbers.
        </p>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-20 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Alert type="error">{error}</Alert>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-gray-900">Room Categories</span>
              <span className="text-xs text-gray-500 font-semibold">
                {rooms.length} category types currently active
              </span>
            </div>
            <Button
              variant="primary"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 text-xs h-[38px] font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Room Type</span>
            </Button>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-semibold bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              No room categories registered for this hotel. Click "Add Room Type" to configure.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {room.title}
                      </h3>
                      <span className="text-sm font-semibold text-primary">
                        ${room.price} / night
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(room)}
                        className="h-[32px] w-[32px] p-0 flex items-center justify-center hover:bg-gray-100 rounded-md text-gray-600"
                        title="Edit Room Category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setDeletingRoom(room)}
                        className="h-[32px] w-[32px] p-0 flex items-center justify-center hover:bg-rose-50 rounded-md text-rose-600"
                        title="Delete Room Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {room.desc}
                  </p>

                  <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400">
                      Physical Room Numbers ({room.roomNumbers.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {room.roomNumbers.map((rn) => (
                        <span
                          key={rn._id}
                          className="bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold px-2 py-0.5 rounded-sm"
                          title={`Blocked dates count: ${rn.unavailableDates?.length || 0}`}
                        >
                          {rn.number}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold text-gray-400 pt-1">
                    <span>Capacity: Max {room.maxPeople} People</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? "Edit Room Category" : "Add Room Category"}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={formSubmitting}>
              {editingRoom ? "Save Changes" : "Create Room"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formError && <Alert type="error">{formError}</Alert>}

          <Input
            label="Room Category Title *"
            placeholder="e.g. Deluxe King Suite"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nightly Room Rate ($) *"
              placeholder="e.g. 200"
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Max Occupants (Guests) *"
              placeholder="e.g. 2"
              type="number"
              min="1"
              value={maxPeople}
              onChange={(e) => setMaxPeople(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Room Description *</label>
            <textarea
              className="px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 min-h-[80px]"
              placeholder="e.g. 1 King bed, separate sitting area, dynamic city view, mini-fridge..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>

          <Input
            label="Physical Room Numbers (comma separated) *"
            placeholder="e.g. 101, 102, 103"
            value={roomNumbersInput}
            onChange={(e) => setRoomNumbersInput(e.target.value)}
            required
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingRoom}
        onClose={() => setDeletingRoom(null)}
        title="Remove Room Category?"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setDeletingRoom(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          Are you absolutely sure you want to remove the room category{" "}
          <strong className="text-gray-900">{deletingRoom?.title}</strong>? This category will be
          completely deleted and its ID reference pulled from the parent hotel's rooms list.
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
