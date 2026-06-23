import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import type { Hotel } from "../types/hotel.types";

export default function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hotelApi
      .getAll()
      .then((res) => {
        setHotels(res.data.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load hotels");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "1.5rem", borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
        All Properties ({hotels.length})
      </h2>

      {loading ? (
        <div>Loading properties...</div>
      ) : error ? (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "1rem", borderRadius: "4px" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : hotels.length === 0 ? (
        <div>No properties available.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                background: "#ffffff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.3rem" }}>
                    <Link to={`/hotels/${hotel._id}`} style={{ textDecoration: "none", color: "#333" }}>
                      {hotel.name}
                    </Link>
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0" }}>
                    📍 {hotel.address}, {hotel.city} &bull; {hotel.distance} from center
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ background: "#0070f3", color: "white", padding: "0.25rem 0.5rem", borderRadius: "4px", fontWeight: "bold", display: "inline-block", fontSize: "0.9rem" }}>
                    Rating: {hotel.rating}/5
                  </div>
                  <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
                    {hotel.type}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1.5rem" }}>
                {hotel.photos && hotel.photos.length > 0 && (
                  <div style={{ width: "150px", height: "100px", flexShrink: 0, overflow: "hidden", borderRadius: "4px", background: "#eee" }}>
                    <img src={hotel.photos[0]} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>{hotel.title}</h4>
                    <p style={{ margin: "0", fontSize: "0.95rem", color: "#555", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {hotel.description}
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "1rem" }}>
                    <div>
                      {hotel.featured && (
                        <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
                          Featured Property
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>Cheapest room</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>${hotel.cheapestPrice}</div>
                      </div>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        style={{
                          background: "#0070f3",
                          color: "white",
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        See Availability
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
