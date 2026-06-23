import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HotelList from "../pages/HotelList";
import HotelDetail from "../pages/HotelDetail";

// Placeholder for future bookings feature
const MyBookingsPlaceholder = () => (
  <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
    <h2>My Bookings</h2>
    <p>This is a protected page. Your booking history will appear here once the booking flow is fully implemented.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // Public Routes
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "hotels", element: <HotelList /> },
      { path: "hotels/:id", element: <HotelDetail /> },

      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "bookings", element: <MyBookingsPlaceholder /> },
        ],
      },

      // Fallback redirect
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
