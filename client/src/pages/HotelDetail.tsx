import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import type { Hotel } from "../types/hotel.types";

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    hotelApi
      .getById(id)
      .then((res) => {
        setHotel(res.data.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load hotel details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>Loading hotel details...</div>;
  if (error || !hotel) {
    return (
      <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ background: "#ffebee", color: "#c62828", padding: "1rem", borderRadius: "4px", marginBottom: "1rem" }}>
          <strong>Error:</strong> {error || "Hotel not found"}
        </div>
        <Link to="/hotels" style={{ color: "#0070f3", textDecoration: "none" }}>&larr; Back to properties</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/hotels" style={{ color: "#0070f3", textDecoration: "none" }}>&larr; Back to properties</Link>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem" }}>{hotel.name}</h1>
          <p style={{ color: "#666", fontSize: "0.95rem", margin: "0" }}>
            📍 {hotel.address}, {hotel.city} &bull; {hotel.distance} from center
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ background: "#0070f3", color: "white", padding: "0.4rem 0.8rem", borderRadius: "4px", fontWeight: "bold", fontSize: "1.1rem" }}>
            {hotel.rating} / 5
          </span>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
            Category: {hotel.type}
          </div>
        </div>
      </div>

      {hotel.photos && hotel.photos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {hotel.photos.map((photo, idx) => (
            <div key={idx} style={{ height: "150px", overflow: "hidden", borderRadius: "6px", background: "#eee" }}>
              <img src={photo} alt={`${hotel.name} view ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
        <div>
          <h2 style={{ marginTop: 0 }}>{hotel.title}</h2>
          <p style={{ lineHeight: "1.6", color: "#333", whiteSpace: "pre-line" }}>
            {hotel.description}
          </p>
        </div>

        <div>
          <div style={{ background: "#f4f4f4", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ marginTop: 0 }}>Property Summary</h3>
            <ul style={{ paddingLeft: "1.2rem", margin: "0 0 1.5rem 0", lineHeight: "1.6" }}>
              <li>Location City: {hotel.city}</li>
              <li>Price starts at: <strong>${hotel.cheapestPrice}</strong> / night</li>
              <li>Rooms Categories: {hotel.rooms ? hotel.rooms.length : 0}</li>
            </ul>
            <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "0.75rem", borderRadius: "4px", fontSize: "0.85rem", marginBottom: "1rem", fontWeight: "bold", textAlign: "center" }}>
              Book with overlapping check &amp; real-time database locks!
            </div>
            {/* Booking Flow is a non-goal for this phase, so we put a placeholder message */}
            <button
              disabled
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "1rem",
                background: "#ccc",
                color: "#666",
                border: "none",
                borderRadius: "4px",
                cursor: "not-allowed",
                fontWeight: "bold"
              }}
            >
              Reserve (Booking coming soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
