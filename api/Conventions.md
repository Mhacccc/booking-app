# Backend Coding Conventions & Standards

This document outlines the directory structure, naming conventions, and coding guidelines for the API backend of this booking application. Following these practices ensures code quality, consistency, and readability as the project scales.

---

## 📂 1. Directory & File Structure
Our backend uses a standard **MVC/Controller-based architecture** to separate concerns:
- **`api/db/`**: Database configuration and connection setup.
- **`api/model/`**: Mongoose schemas and models.
- **`api/controllers/`**: Core business logic and database queries (route handlers).
- **`api/routes/`**: Express route declarations linking URLs to controllers.
- **`api/middlewares/`**: Custom Express middlewares (e.g., global error handlers, authentication checkers).
- **`api/utils/`**: Shared helper utility functions (e.g., success formatters, custom error generators).

---

## 🏷️ 2. Naming Conventions

### 2.1 Models (Schemas)
- **Convention**: **PascalCase** (Singular noun)
- **Examples**: `Hotel.js`, `Room.js`, `User.js`, `Booking.js`
- **Why**: Mongoose models compile to constructors/classes (e.g., `new Hotel()`). Standard JavaScript conventions dictate that classes and constructors are named in PascalCase.

### 2.2 Controllers
- **Convention**: **camelCase** with suffix `Controller.js`
- **Examples**: `authController.js`, `hotelController.js`, `userController.js`
- **Why**: Keeps the focus of the controller clear. Alternatively, `kebab-case` with dots (e.g., `hotel.controller.js`) is also an industry standard for large enterprise applications, but camelCase is clean and popular for small-to-medium codebases.

### 2.3 Routes
- **Convention**: **camelCase** with suffix `Routes.js`
- **Examples**: `authRoutes.js`, `hotelRoutes.js`, `roomRoutes.js`

### 2.4 Helper Utilities & Middlewares
- **Convention**: **camelCase**
- **Examples**: `success.js`, `error.js` (utilities), `errorHandler.js` (middleware)

---

## 💻 3. Coding Standards & Best Practices

### 3.1 Asynchronous Operations
- Always use **`async/await`** instead of raw `.then()/.catch()` chains for readability.
- Every asynchronous controller handler **must** be wrapped in a `try/catch` block, and pass any caught errors to `next(error)` so they are caught by the global error handler middleware.

### 3.2 Error Handling
- Never send error responses directly from individual controllers (e.g. `res.status(500).json(...)`).
- Instead, format the error using `createError(message, status)` and delegate it to the error handling middleware using `next(err)`.

### 3.3 Success Formatting
- Always return a standardized response format using `createSuccess(data, message)` from `success.js` to ensure the client/frontend gets a consistent JSON format:
  ```json
  {
    "success": true,
    "message": "Hotel retrieved successfully",
    "count": 1, // (only if data is an array)
    "data": { ... }
  }
  ```

---

## 🚀 4. Advanced Production Conventions 

### 4.1 Schema Timestamps
- Always enable the **`timestamps`** option in Mongoose schemas. This automatically adds `createdAt` and `updatedAt` ISO date fields to every document without manual code:
  ```javascript
  const HotelSchema = new mongoose.Schema({
      name: { type: String, required: true }
  }, { timestamps: true }); // 👈 Industry standard for tracking records
  ```

### 4.2 Security & Environment Configuration (`.env`)
- **Git Safety**: Never commit `.env` containing sensitive credentials or passwords to version control. It must always be included in `.gitignore`.
- **Environment Template**: Maintain a `.env.example` file in the repo containing empty keys (e.g., `MONGO_URI=`, `PORT=`) so that team members know what configuration values they need to supply locally.
- **Naming Variables**: Use `UPPER_SNAKE_CASE` for all keys.

### 4.3 Validation of Request Data (Inputs)
- **ID Validation**: Before running database operations like `findById(id)` or `findByIdAndDelete(id)`, always validate that the `id` param is a valid MongoDB ObjectId. If it isn't, throw a `400 Bad Request` immediately to prevent Mongoose cast errors:
  ```javascript
  import mongoose from "mongoose";
  import { createError } from "../utils/error.js";

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(createError("Invalid ID format", 400));
  }
  ```

### 4.4 Data Sanitization (Security & Privacy)
- Never return sensitive data (like password hashes or internal DB metadata like `__v`) in response payloads. 
- Use JavaScript destructuring to exclude sensitive fields or configure Mongoose transform settings:
  ```javascript
  // Exclude password hash when returning user details
  const { password, ...otherDetails } = user._doc;
  res.status(200).json(createSuccess(otherDetails));
  ```

### 4.5 Standard REST API Response Status Codes
Align your HTTP response codes with standard RESTful conventions:
- `200 OK`: Successful `GET`, `PUT`, or `DELETE`.
- `201 Created`: Successful `POST` creating a new resource.
- `400 Bad Request`: Input validation failure, bad formatting, or invalid ID format.
- `401 Unauthorized`: Missing or invalid credentials (e.g., JWT token missing).
- `403 Forbidden`: Authenticated, but lacking permission/role to access resource.
- `404 Not Found`: Resource does not exist (e.g., hotel ID doesn't exist).
- `500 Internal Server Error`: Generic unhandled server crashes (handled by global middleware).

---

## 📜 5. Git Commits
All commit messages should follow the [Conventional Commits standard](file:///c:/Users/user/Desktop/DAILY%20PRACTICE/projects/booking-app/CommitMessage.md) to keep git history readable:
`type(scope): subject` (e.g., `feat(hotels): add createHotel controller`).
