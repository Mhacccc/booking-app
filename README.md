# StayScape — Full-Stack Hotel Booking Application

StayScape is a modern, high-craft MERN stack (MongoDB, Express, React, Node.js) hotel booking platform. The project is split into a robust, secure Express API backend and a dynamic, beautifully crafted React client application.

---

## 📂 Project Overview

This repository is organized as a monorepo containing both the frontend client and the backend API:

```text
booking-app/
├── api/             # Express & Mongoose Backend API
│   └── README.md    # Backend-specific documentation & API routes
├── client/          # Vite & React Frontend Application
│   └── README.md    # Frontend-specific documentation & design systems
├── .antigravityrules# Project conventions and rules for Antigravity AI
├── CONTRIBUTING.md  # Development, branching, and commit workflows
└── README.md        # This file (Complete application overview)
```

---

## ✨ Features (Planned & Implemented)

### 🏨 Guest-Facing Client (Pending/In-Progress)
* **Aurora Drift Design:** Neo-glassmorphism visuals utilizing Indigo, Violet, and Amber accents.
* **Smart Search:** Intuitive city, date-range, and guest quantity selector.
* **Interactive Catalog:** Dynamic featured property queries and filter navigation.
* **Booking Funnel:** Seamless room selection and secure transaction checkout.

### 🔑 Secure REST API Backend (Implemented)
* **Role-Based Access Control:** Strict token authorization for customer and administrator portals.
* **Date Overlap Prevention:** Advanced booking validation protecting room schedules from double-bookings.
* **Database Resilience:** Formatted MongoDB schemas with parameter validation and lean queries.

---

## 🚀 Getting Started

To run the full stack locally, you will need to start both the API server and the Client development server.

### 1. Run the Backend API
Follow the backend setup guides in [api/README.md](file:///c:/Users/user/Desktop/DAILY%20PRACTICE/projects/booking-app/api/README.md):
```bash
cd api
npm install
npm run dev
```

### 2. Run the Frontend Client
Follow the frontend setup guides in `client/README.md` (to be created):
```bash
cd client
npm install
npm run dev
```
By default, the client launches on [http://localhost:5173/](http://localhost:5173/) and proxies requests to the backend API at `http://localhost:3000/api`.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, TailwindCSS v4, Zustand, TanStack Query, Axios
* **Backend:** Node.js, Express, MongoDB + Mongoose, JWT, Cookie-Parser
* **Tooling:** Antigravity AI, Git
