# MERN Hotel Booking Application - API Backend

A secure, RESTful API backend for a hotel booking application built with the MERN stack (MongoDB, Express, Node.js). This project implements secure authentication, role-based access control (RBAC), and transactional booking logic.

---

## 🚀 Key Features

* **Secure Authentication:** JWT-based authentication stored in secure, `httpOnly` cookies to protect sessions from XSS attacks.
* **Role-Based Access Control (RBAC):** Custom middlewares (`verifyToken`, `verifyUser`, `verifyAdmin`) to restrict resources based on ownership or admin privileges.
* **Mass-Assignment Protection:** Controllers explicitly check and strip restricted parameters (e.g. `isAdmin`) from request payloads.
* **Date Overlap Reservation Logic:** Real-time database checks to prevent double-booking of identical room instances for overlapping calendar ranges.
* **Centralized Error Handler:** Global error interceptor to format clean JSON error payloads and protect server stack traces from exposure.

---

## 📂 Project Structure

```text
api/
├── db/              # Database connection setup
├── model/           # Mongoose schemas (User, Hotel, Room, Booking)
├── controllers/     # Core business logic (route handlers)
├── routes/          # Express route declarations (Auth, User, Hotel, Room, Booking)
├── middlewares/     # Custom Express middlewares (authentication checkers, global error handler)
├── utils/           # Shared helpers (success response formatters, custom error generators)
└── server.js        # Server bootstrapper & Express application entrypoint
```

---

## 🛠️ Quick Start

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16+) and a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster configured.

### 2. Environment Setup
Navigate to this directory and copy the template:
```bash
cp .env.example .env
```
Populate `.env` with your Mongo URI, desired Port, and a secure JWT Secret:
```ini
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_base64_jwt_secret_key
```

### 3. Install & Launch
Install package dependencies and start the hot-reloading development server:
```bash
npm install
npm run dev
```

---

## 🔗 API Documentation (Routes)

### 🔐 Authentication (`/api/auth`)
* `POST /register`: Registers a new user account.
* `POST /login`: Log in to generate a secure JWT token cookie.
* `POST /logout`: Clears the JWT session cookie.

### 👤 User Management (`/api/user`)
*(All routes require a valid token)*
* `GET /`: Lists all users (Admin only).
* `GET /:id`: Retrieves single user details (Account Owner or Admin only).
* `PUT /:id`: Updates user profile fields (Account Owner or Admin only). Protects `isAdmin` from unauthorized updates.
* `DELETE /:id`: Deletes account (Account Owner or Admin only).

### 🏨 Hotel Inventory (`/api/hotel`)
* `GET /`: Lists all hotels (Public).
* `GET /:id`: Retrieves single hotel details (Public).
* `POST /`: Creates a hotel (Admin only).
* `PUT /:id`: Updates hotel details (Admin only).
* `DELETE /:id`: Deletes hotel (Admin only).

### 🔑 Room Management (`/api/room`)
* `GET /`: Lists all rooms (Public).
* `GET /:id`: Retrieves single room details (Public).
* `POST /:hotelid`: Creates a room type and registers its ID to the parent hotel (Admin only).
* `PUT /:id`: Updates room details (Admin only).
* `PUT /availability/:id`: Pushes booked dates into the room number's availability array.
* `DELETE /:id/:hotelid`: Deletes the room and pulls its reference from the parent hotel (Admin only).

### 📅 Booking Reservations (`/api/booking`)
*(All routes require a valid token)*
* `POST /`: Creates a new reservation after validating that selected room numbers do not have date overlaps.
* `GET /mine`: Retrieves booking history of the logged-in user.
* `GET /:id`: Retrieves details of a reservation (Booking Owner or Admin only).
* `GET /`: Lists all bookings across the platform (Admin only).
* `DELETE /:id`: Cancels a reservation (Booking Owner or Admin only).
