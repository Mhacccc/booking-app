import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hotelApi } from "../api/hotel.api";
import type { Hotel } from "../types/hotel.types";

export default function Home() {
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hotelApi
      .getAll()
      .then((res) => {
        // filter featured or just slice first 3
        const list = res.data.data;
        setFeaturedHotels(list.filter((h) => h.featured).slice(0, 3));
      })
      .catch((err) => {
        setError(err.message || "Failed to load hotels");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", padding: "2rem 0", background: "#f8f9fa", borderRadius: "8px", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#333", margin: "0 0 1rem 0" }}>Find Your Next Stay</h1>
        <p style={{ fontSize: "1.1rem", color: "#666", margin: "0 0 1.5rem 0" }}>
          Discover the best deals on hotels, villas, apartments, and more.
        </p>
        <Link
          to="/hotels"
          style={{
            background: "#0070f3",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Browse All Properties
        </Link>
      </div>

      <section>
        <h2 style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
          Featured Properties
        </h2>

        {loading ? (
          <div>Loading featured properties...</div>
        ) : error ? (
          <div style={{ background: "#ffebee", color: "#c62828", padding: "1rem", borderRadius: "4px" }}>
            <strong>Error connecting to API:</strong> {error}
            <br />
            <span style={{ fontSize: "0.9rem" }}>Make sure backend server (port 3000) is running and MongoDB is connected.</span>
          </div>
        ) : featuredHotels.length === 0 ? (
          <div>
            <p>No featured properties found.</p>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Try adding a hotel in the database or marking one as featured.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {featuredHotels.map((hotel) => (
              <div
                key={hotel._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{hotel.name}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>
                    📍 {hotel.city} &bull; {hotel.type}
                  </p>
                  <p style={{ fontSize: "0.9rem", margin: "0 0 1rem 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {hotel.description}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "0.75rem" }}>
                  <span style={{ fontWeight: "bold", color: "#0070f3" }}>From ${hotel.cheapestPrice}/night</span>
                  <Link to={`/hotels/${hotel._id}`} style={{ textDecoration: "none", fontSize: "0.9rem", fontWeight: "bold", color: "#0070f3" }}>
                    View details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
