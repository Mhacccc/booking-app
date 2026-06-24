import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HotelList from "../pages/HotelList";
import HotelDetail from "../pages/HotelDetail";
import MyBookings from "../pages/MyBookings";
import BookingDetail from "../pages/BookingDetail";
import BookingSuccess from "../pages/BookingSuccess";

// Admin Imports
import { AdminLayout } from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminHotels from "../pages/AdminHotels";
import AdminRooms from "../pages/AdminRooms";
import AdminBookings from "../pages/AdminBookings";
import AdminUsers from "../pages/AdminUsers";

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
          { path: "bookings", element: <MyBookings /> },
          { path: "bookings/:id", element: <BookingDetail /> },
          { path: "booking/success", element: <BookingSuccess /> },
        ],
      },

      // Admin Protected Routes
      {
        element: <ProtectedRoute adminOnly={true} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "admin", element: <AdminDashboard /> },
              { path: "admin/hotels", element: <AdminHotels /> },
              { path: "admin/hotels/:id/rooms", element: <AdminRooms /> },
              { path: "admin/bookings", element: <AdminBookings /> },
              { path: "admin/users", element: <AdminUsers /> },
            ],
          },
        ],
      },

      // Fallback redirect
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
