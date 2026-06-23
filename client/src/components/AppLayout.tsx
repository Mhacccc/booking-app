import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

export default function AppLayout() {
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid #ccc", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: "bold", textDecoration: "none", color: "inherit", fontSize: "1.2rem" }}>
            🏨 BookingApp
          </Link>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link to="/hotels" style={{ textDecoration: "none", color: "#0070f3" }}>
              Explore Hotels
            </Link>
            {user && (
              <Link to="/bookings" style={{ textDecoration: "none", color: "#0070f3" }}>
                My Bookings
              </Link>
            )}
          </nav>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isLoading ? (
            <span style={{ color: "#666" }}>Checking session...</span>
          ) : user ? (
            <>
              <span style={{ fontSize: "0.9rem" }}>
                Hello, <strong>{user.username}</strong> {user.isAdmin && <span style={{ background: "#ff007f", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem" }}>Admin</span>}
              </span>
              <button onClick={handleLogout} style={{ padding: "0.4rem 0.8rem", cursor: "pointer", background: "#eaeaea", border: "1px solid #ccc", borderRadius: "4px" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none", color: "#0070f3" }}>
                Login
              </Link>
              <Link to="/register" style={{ textDecoration: "none", color: "#0070f3", border: "1px solid #0070f3", padding: "0.4rem 0.8rem", borderRadius: "4px" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main style={{ flex: 1, padding: "2rem" }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: "1px solid #ccc", padding: "1rem", textAlign: "center", fontSize: "0.85rem", color: "#666" }}>
        &copy; {new Date().getFullYear()} BookingApp Frontend (Architecture First)
      </footer>
    </div>
  );
}
