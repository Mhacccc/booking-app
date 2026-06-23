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

      // Fallback redirect
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
