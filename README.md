# Bus Booking System (RedBus-like)

A comprehensive NestJS-based REST API for managing bus bookings, routes, and user authentication with advanced features like real-time seat locking, payment processing, and search functionality.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with Google OAuth support
- **Bus Management**: CRUD operations for buses with seat layout management
- **Route Management**: Create and manage bus routes with intermediate stops
- **Trip Management**: Schedule trips with departure times, dates, and fares
- **Advanced Booking System**: Real-time seat locking with conflict prevention
- **Payment Processing**: Complete payment and refund system
- **Search Functionality**: Elasticsearch-like search for trips and routes
- **Role-based Access**: User and admin roles with proper permissions

### Advanced Features
- **Real-time Seat Locking**: Soft lock strategy with configurable timeout
- **Intermediate Stops**: Dynamic stop management for routes
- **Booking Conflict Detection**: Atomic booking operations
- **Cancellation & Refunds**: Automated refund processing with business rules
- **Scheduled Tasks**: Automatic cleanup of expired locks and maintenance
- **Search Index**: In-memory search index (can be replaced with Elasticsearch)
- **Admin Controls**: Dynamic route management and trip status updates

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport.js + Google OAuth
- **Validation**: class-validator
- **Scheduling**: @nestjs/schedule
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-car-value
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Application
   NODE_ENV=development
   PORT=3000
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=bus_booking

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=1d

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/redirect
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb bus_booking
   
   # Run migrations (if any)
   npm run migration:run
   ```

5. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Google OAuth
```http
GET /api/v1/auth/google
GET /api/v1/auth/google/redirect
```

### Bus Endpoints

#### Get All Buses
```http
GET /api/v1/buses
Authorization: Bearer <jwt-token>
```

#### Create Bus
```http
POST /api/v1/buses
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Express Bus 1",
  "capacity": 50,
  "seatLayout": [["A1", "A2", "A3"], ["B1", "B2", "B3"]]
}
```

### Route Endpoints

#### Get All Routes
```http
GET /api/v1/routes
Authorization: Bearer <jwt-token>
```

#### Create Route
```http
POST /api/v1/routes
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "City A to City B",
  "startLocation": "City A",
  "endLocation": "City B",
  "distance": 150.5,
  "duration": 120
}
```

### Trip Management Endpoints

#### Create Trip (Admin Only)
```http
POST /api/v1/trips
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "busId": "bus-uuid",
  "routeId": "route-uuid",
  "departureDate": "2024-01-15",
  "departureTime": "08:00",
  "arrivalTime": "20:00",
  "fare": 1500.00
}
```

#### Search Trips
```http
GET /api/v1/trips/search?from=Mumbai&to=Delhi&date=2024-01-15
```

#### Get Trip Seat Map
```http
GET /api/v1/trips/:id/seat-map
```

#### Lock Seat
```http
POST /api/v1/trips/:id/lock-seat
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "seatNumber": "1A",
  "bookingId": "booking-uuid"
}
```

#### Confirm Seat
```http
POST /api/v1/trips/:id/confirm-seat
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "seatNumber": "1A",
  "bookingId": "booking-uuid"
}
```

### Route & Stop Management Endpoints

#### Create Route
```http
POST /api/v1/routes
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Mumbai to Delhi",
  "startLocation": "Mumbai",
  "endLocation": "Delhi",
  "distance": 1400.5,
  "duration": 1440
}
```

#### Add Intermediate Stop (Admin Only)
```http
POST /api/v1/routes/:routeId/stops
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Pune Station",
  "location": "Pune",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "sequence": 2,
  "arrivalTime": "10:30",
  "departureTime": "10:45"
}
```

#### Reorder Stops (Admin Only)
```http
POST /api/v1/routes/:routeId/stops/reorder
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "stopIds": ["stop1-uuid", "stop2-uuid", "stop3-uuid"]
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/v1/bookings
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "tripId": "trip-uuid",
  "seatNumber": "1A"
}
```

#### Get My Bookings
```http
GET /api/v1/bookings/my-bookings
Authorization: Bearer <jwt-token>
```

#### Cancel Booking
```http
DELETE /api/v1/bookings/:id
Authorization: Bearer <jwt-token>
```

### Payment Endpoints

#### Create Payment
```http
POST /api/v1/payments
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "bookingId": "booking-uuid",
  "amount": 1500.00,
  "paymentMethod": "CREDIT_CARD"
}
```

#### Process Payment (Admin Only)
```http
POST /api/v1/payments/:id/process
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "transactionId": "txn_123456",
  "gatewayResponse": "SUCCESS"
}
```

#### Process Refund (Admin Only)
```http
POST /api/v1/payments/refund
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "paymentId": "payment-uuid",
  "refundReason": "Customer request"
}
```

### Search Endpoints

#### Search Trips
```http
GET /api/v1/search/trips?from=Mumbai&to=Delhi&date=2024-01-15&minFare=1000&maxFare=2000&minSeats=5
```

#### Search Routes
```http
GET /api/v1/search/routes?from=Mumbai&to=Delhi&maxDistance=1500
```

#### Get Search Stats
```http
GET /api/v1/search/stats
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── guards/          # JWT & Role guards
│   ├── strategies/      # Passport strategies
│   ├── decorators/      # Role decorators
│   └── auth.service.ts  # Auth service
├── users/               # User management
│   ├── dtos/           # Data transfer objects
│   ├── user.entity.ts  # User entity
│   └── users.service.ts
├── buses/               # Bus management
├── routes/              # Route management
├── trips/               # Trip & Schedule management
│   ├── dtos/           # Trip DTOs
│   ├── trip.entity.ts  # Trip entity
│   └── trips.service.ts
├── stops/               # Intermediate stops
│   ├── dtos/           # Stop DTOs
│   ├── stop.entity.ts  # Stop entity
│   └── stops.service.ts
├── bookings/            # Booking system
├── payments/            # Payment & Refund system
│   ├── dtos/           # Payment DTOs
│   ├── payment.entity.ts # Payment entity
│   └── payments.service.ts
├── search/              # Search functionality
│   ├── search.service.ts # Search service
│   └── search.controller.ts
├── scheduler/           # Scheduled tasks
│   └── scheduler.service.ts
├── db/                  # Database configuration
└── interceptors/        # Response interceptors
```

## 🔧 Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   DB_HOST=your-production-db-host
   DB_PASSWORD=your-production-db-password
   JWT_SECRET=your-production-jwt-secret
   ```

3. **Start the application**
   ```bash
   npm run start:prod
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.
