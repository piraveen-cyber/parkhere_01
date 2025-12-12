# ParkHere Backend

A complete Node.js/Express backend for the ParkHere application, featuring robust validation, booking management, payment processing, and admin capabilities.

## Features

- **Authentication**: User management (assumes Supabase/JWT integration).
- **Parking Management**: 
  - CRUD operations for parking spots.
  - **Availability Search**: Excludes spots booked during requested time.
- **Booking System**:
  - Conflict detection logic.
  - **Universal QR**: Single QR for Check-In, Check-Out, and Overstay Fees.
- **Payments**: Stripe Payment Intents with overstay fee simulation.
- **Admin Dashboard**: Aggregated statistics and data management.
- **Security**: Request validation (Zod), input sanitization.

## Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)
- Stripe Account (for API Key)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure Environment:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/parkhere
   STRIPE_SECRET_KEY=sk_test_... # Your Stripe Secret Key
   ```

## Running the Server

- **Development**:
  ```bash
  npm run dev
  ```
- **Build & Start**:
  ```bash
  npm run build
  npm start
  ```
- **Tests**:
  ```bash
  npm test
  ```

## API Documentation

### Bookings
- `POST /api/bookings`: Create a new booking
- `GET /api/bookings/:userId`: Get user history
- `POST /api/bookings/scan`: **QR Scan Endpoint** (Check-In / Out)

### Parking
- `GET /api/parking?startTime=ISO&endTime=ISO`: Search available spots
- `GET /api/parking/recommend?lat=...&long=...&type=[best|cheapest|nearest]`: **Get Intelligent Recommendations**
- `GET /api/public/parking`: List all spots

### Payments
- `POST /api/payments/create-payment-intent`: Initiate payment

### Admin
- `GET /api/admin/stats`: System statistics
- `GET /api/admin/bookings`: All bookings
- `GET /api/admin/users`: All users

### Emergency Services
- `POST /api/services`: Request a service (mechanic, towing, etc.)
- `GET /api/services/user/:userId`: User history
- `GET /api/services/all`: Staff view
- `PATCH /api/services/:id`: Update status

## Testing

Run `npm test` to execute the test suite (Jest + Supertest).