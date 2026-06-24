# StayScape — Client (Frontend)

A React + TypeScript + Vite frontend for the StayScape hotel booking platform, consuming the MERN REST API backend.

---

## 🚀 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | ^19 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | Static type safety |
| [Vite](https://vite.dev/) | ^8 | Dev server and bundler |
| [React Router v7](https://reactrouter.com/) | ^7 | Client-side routing |
| [Zustand](https://zustand.docs.pmnd.rs/) | ^5 | Global state management |
| [Axios](https://axios-http.com/) | ^1 | HTTP client with interceptors |
| [Tailwind CSS v4](https://tailwindcss.com/) | ^4 | Utility-first styling |
| [Lucide React](https://lucide.dev/) | ^1 | Icon library |

---

## 📂 Project Structure

```text
client/
├── public/                     # Static assets (favicon, robots.txt)
├── src/
│   ├── api/                    # Centralized API service layer
│   │   ├── axios.ts            # Axios instance + response interceptor
│   │   ├── auth.api.ts         # Auth endpoints (login, register, logout, me)
│   │   ├── hotel.api.ts        # Hotel endpoints (list, detail)
│   │   ├── room.api.ts         # Room endpoints (list, detail)
│   │   └── booking.api.ts      # Booking endpoints (create, mine, detail, delete)
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AppLayout.tsx       # Root layout (Navbar + Outlet + Footer + MobileTabBar)
│   │   ├── ProtectedRoute.tsx  # Route guard (auth + optional admin-only check)
│   │   ├── layout/             # Chrome-level layout components
│   │   │   ├── Navbar.tsx      # Top navigation bar (auth-aware, sticky)
│   │   │   ├── Footer.tsx      # Site footer
│   │   │   └── MobileTabBar.tsx # Bottom navigation bar for mobile viewports
│   │   ├── property/           # Hotel/property display components
│   │   │   ├── PropertyCard.tsx    # Single hotel card (image, price, rating)
│   │   │   ├── PropertyGrid.tsx    # Responsive grid wrapper for PropertyCard list
│   │   │   ├── RoomCard.tsx        # Individual room details (price, capacity, book CTA)
│   │   │   └── BookingSidebar.tsx  # Date picker + booking form shown on HotelDetail
│   │   ├── booking/            # Booking display components
│   │   │   ├── BookingCard.tsx     # Summary card used on MyBookings list
│   │   │   └── StatusBadge.tsx     # Color-coded badge for booking status
│   │   ├── search/             # Search input components
│   │   │   ├── SearchBar.tsx       # Full search bar (city, dates, guests)
│   │   │   ├── DatePicker.tsx      # Controlled date input field
│   │   │   └── GuestCounter.tsx    # ± guest count input
│   │   └── ui/                 # Generic, domain-agnostic primitives
│   │       ├── Alert.tsx           # Inline alert (info, success, warning, error)
│   │       ├── Avatar.tsx          # Initials-based user avatar
│   │       ├── Badge.tsx           # Generic text badge
│   │       ├── Button.tsx          # Polymorphic button (primary, ghost, outline, danger)
│   │       ├── EmptyState.tsx      # Empty list placeholder with icon + message
│   │       ├── Input.tsx           # Labeled text input with error state
│   │       ├── Modal.tsx           # Accessible overlay modal
│   │       ├── Rating.tsx          # Star rating display component
│   │       ├── Select.tsx          # Styled native select input
│   │       └── Skeleton.tsx        # Content placeholder while loading
│   │
│   ├── pages/                  # Route-level components (one per page)
│   │   ├── Home.tsx            # Landing page: hero, search, featured hotels, destinations
│   │   ├── HotelList.tsx       # Hotel listing with filters (city, type, date, guests)
│   │   ├── HotelDetail.tsx     # Single hotel details, room list, booking sidebar
│   │   ├── Login.tsx           # Sign-in form
│   │   ├── Register.tsx        # Account registration form
│   │   ├── MyBookings.tsx      # Logged-in user's booking history
│   │   ├── BookingDetail.tsx   # Single booking details + cancel option
│   │   └── BookingSuccess.tsx  # Post-booking confirmation screen
│   │
│   ├── router/
│   │   └── index.tsx           # createBrowserRouter config (layout-based, protected routes)
│   │
│   ├── stores/                 # Zustand global state slices
│   │   └── auth.store.ts       # Auth slice: user, isLoading, error, login/logout/checkAuth
│   │
│   ├── types/                  # TypeScript interfaces mirroring API contracts
│   │   ├── api.types.ts        # ApiSuccessResponse<T>, ApiErrorResponse
│   │   ├── user.types.ts       # User, LoginPayload, RegisterPayload
│   │   ├── hotel.types.ts      # Hotel
│   │   ├── room.types.ts       # Room, RoomNumber
│   │   └── booking.types.ts    # Booking, BookingStatus, CreateBookingPayload
│   │
│   ├── App.tsx                 # Root component — mounts RouterProvider
│   ├── main.tsx                # Entry point — renders App into the DOM
│   ├── index.css               # Global CSS (Tailwind imports, design tokens, base styles)
│   └── App.css                 # App-level CSS overrides
│
├── index.html                  # HTML shell (Vite entry)
├── vite.config.ts              # Vite config (proxy /api → :3000, React plugin)
├── tsconfig.json               # TypeScript project references
├── tsconfig.app.json           # App-specific TS config (strict, JSX)
├── tsconfig.node.json          # Node tool TS config (vite.config.ts)
└── package.json
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js v18+
- The API backend running on `http://localhost:3000` (see `../api/README.md`)

### Install & Run
```bash
cd client
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. All `/api/*` requests are proxied to `http://localhost:3000` (configured in `vite.config.ts`).

---

## 📐 Architecture Decisions

### Routing — React Router v7 Layout Pattern

Routes are defined in a single `router/index.tsx` using **layout-based nesting**.

```
/ (AppLayout)
├── /                  → Home           [public]
├── /login             → Login          [public]
├── /register          → Register       [public]
├── /hotels            → HotelList      [public]
├── /hotels/:id        → HotelDetail    [public]
└── (ProtectedRoute)
    ├── /bookings      → MyBookings     [auth required]
    ├── /bookings/:id  → BookingDetail  [auth required]
    └── /booking/success → BookingSuccess [auth required]
```

`AppLayout` handles the `checkAuth()` call on mount — one-time session rehydration for all routes.

`ProtectedRoute` accepts an optional `adminOnly` prop to guard admin-only routes.

### State Management — Zustand

Only **global auth state** lives in Zustand (`auth.store.ts`). All other data is **local component state** (`useState` / `useEffect`), because:

- Hotel and booking data is per-page with no cross-page sharing
- Local state avoids premature abstraction for a portfolio project
- Zustand is reserved for state that multiple unrelated components need simultaneously

> **Rule**: Create a new Zustand store only when 3+ unrelated components need to share the same state.

### API Layer — Service Objects

All HTTP calls live in `src/api/`. Every file exports a plain object with typed methods:

```ts
// ✅ Correct pattern
export const hotelApi = {
  getAll: () => api.get<ApiSuccessResponse<Hotel[]>>("/hotel"),
  getById: (id: string) => api.get<ApiSuccessResponse<Hotel>>(`/hotel/${id}`),
};

// ❌ Avoid: making raw axios calls inline in components
```

The Axios instance (`axios.ts`) normalizes all error shapes through an interceptor — every rejection gives you `{ message: string, status: number }`.

### TypeScript Types — API Contract Mirrors

Types in `src/types/` mirror the backend Mongoose schemas exactly. They serve as the **shared language between the API response and the UI**, enabling:

- Autocompletion when accessing `hotel.cheapestPrice` or `booking.status`
- Compile-time errors when you try to pass a `string` where `number` is expected
- Self-documenting function signatures (e.g., `getById(id: string): Promise<Hotel>`)

> **Important**: Types are a compile-time tool only. They do NOT validate data at runtime. If the API returns an unexpected shape, TypeScript will not catch it while the app is running.

---

## 📏 Conventions

### File Naming

| Type | Convention | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `PropertyCard.tsx` |
| Stores | `kebab-case.store.ts` | `auth.store.ts` |
| API services | `kebab-case.api.ts` | `hotel.api.ts` |
| Type files | `kebab-case.types.ts` | `booking.types.ts` |
| Config / utility | `camelCase.ts` | `axios.ts` |

### Component Naming

- **Pages** — default exports, named after the route: `export default function HotelList()`
- **Shared components** — named exports: `export const Button: React.FC<ButtonProps> = ...`
- **Layout components** — named exports inside `components/layout/`

### Variable Naming

| Context | Convention | Example |
|---|---|---|
| React state | `camelCase` | `const [hotels, setHotels]` |
| Async handlers | `handle` prefix | `handleSearch`, `handleLogout` |
| Boolean flags | `is` / `has` prefix | `isLoading`, `isAdmin`, `hasError` |
| API response data | Reflect the type | `const hotel: Hotel`, `const bookings: Booking[]` |
| Zustand actions | verb + noun | `login`, `logout`, `checkAuth`, `clearError` |

### Props Interface Naming

Props interfaces are always named `{ComponentName}Props` and defined in the same file:

```ts
interface ButtonProps {
  variant?: "primary" | "ghost" | "outline" | "danger";
  children: React.ReactNode;
}
```

### Import Order

1. React / React-related (`react`, `react-router-dom`)
2. Third-party libraries (`zustand`, `axios`, `lucide-react`)
3. Internal — stores (`../stores/...`)
4. Internal — API (`../api/...`)
5. Internal — components (`../components/...`)
6. Internal — types (`../types/...`)

---

## 🔐 Authentication Flow

```
App mount → AppLayout mounts → checkAuth() called
    ↓
GET /api/auth
    ↓ 200 OK         ↓ 401 Unauthorized
set user = data    set user = null
    ↓
ProtectedRoute reads user from Zustand
    ↓ user exists       ↓ user is null
render <Outlet/>     redirect to /login
```

Auth state is stored in a **session cookie** (`httpOnly`) set by the backend. The frontend never touches the cookie directly — it only calls `GET /api/auth` to check if the session is valid.

---

## 🎨 Styling

Tailwind CSS v4 is used throughout. Key design tokens defined in `index.css`:

- `--color-primary` — brand blue
- `--color-primary-light` — light tint for backgrounds
- `--color-superhost` — gold accent for admin badge
- Utility classes like `scrollbar-none` for cross-browser scrollbar hiding

**Rule**: Never write raw `style={{}}` props for layout. Always use Tailwind utility classes.

---

## ✅ Implemented Features

| Feature | Status | Route |
|---|---|---|
| Landing page with search, featured hotels, destinations | ✅ Done | `/` |
| Hotel listing with URL-synced filters | ✅ Done | `/hotels` |
| Hotel detail with room list | ✅ Done | `/hotels/:id` |
| User registration | ✅ Done | `/register` |
| User login / logout | ✅ Done | `/login` |
| Session persistence (cookie-based) | ✅ Done | — |
| Protected route guard | ✅ Done | — |
| Admin role detection | ✅ Done | — |
| Create a booking | ✅ Done | `/hotels/:id` |
| My bookings list | ✅ Done | `/bookings` |
| Booking detail view | ✅ Done | `/bookings/:id` |
| Cancel a booking | ✅ Done | `/bookings/:id` |
| Post-booking success screen | ✅ Done | `/booking/success` |
| Responsive layout + mobile tab bar | ✅ Done | — |

---

## 🗺️ Planned Features (Not Yet Implemented)

The following features are supported by the backend API but not yet built on the frontend. They are ordered by recommended implementation priority.

### Phase 4 — Admin Dashboard

The backend already has full admin CRUD for hotels, rooms, users, and bookings.

#### 4.1 — Hotel Management (Admin)
> Backend: `POST /api/hotel`, `PUT /api/hotel/:id`, `DELETE /api/hotel/:id`

- Create hotel form with all fields (name, type, city, address, description, photos, price)
- Edit hotel form (pre-populated)
- Delete hotel with confirmation modal
- Route: `/admin/hotels` (list), `/admin/hotels/new`, `/admin/hotels/:id/edit`

#### 4.2 — Room Management (Admin)
> Backend: `POST /api/room/:hotelid`, `PUT /api/room/:id`, `DELETE /api/room/:id/:hotelid`

- Create room form (attached to a hotel)
- Edit room details
- Delete room from hotel
- Route: `/admin/hotels/:id/rooms`

#### 4.3 — All Bookings View (Admin)
> Backend: `GET /api/booking` (admin lists all)

- Platform-wide booking list (filterable by status, date)
- Update booking status (`pending` → `confirmed` → `cancelled`)
> Backend: the status update is partially implemented on the backend; verify `PUT /api/booking/:id` returns updated status

#### 4.4 — User Management (Admin)
> Backend: `GET /api/user`, `PUT /api/user/:id`, `DELETE /api/user/:id`

- List all users
- Edit user roles / profile
- Delete user account
- Route: `/admin/users`

---

### Phase 5 — User Profile

> Backend: `GET /api/user/:id`, `PUT /api/user/:id`

- Profile page (`/profile` or `/settings`)
- View and edit own username, email, country, city, phone
- Avatar upload (requires backend image storage — not yet implemented on API)

---

### Phase 6 — Search & Filter Enhancements

The current search passes params via URL but the backend `GET /api/hotel` does not yet filter by query params — it returns all hotels.

Two options:
1. **Client-side filtering** (quick win): filter the returned list in the browser
2. **Backend filtering** (proper): add `?city=`, `?type=`, `?minPrice=`, `?maxPrice=` query param support to `hotelController.getAll()`

Recommended: implement client-side filtering first, then extend the backend.

---

### Phase 7 — UX Polish

- Toast notification system (success / error) to replace `Alert` inline messages
- Page transitions / route animations
- Image gallery / lightbox on `HotelDetail`
- Booking date range conflict UI (highlight unavailable dates on the calendar)
- Pagination or infinite scroll on `HotelList`

---

## 📦 Scripts

```bash
npm run dev        # Start Vite dev server (hot reload)
npm run build      # Type-check + production bundle
npm run lint       # ESLint
npm run preview    # Preview the production build locally
```
