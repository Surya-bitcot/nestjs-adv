# Bus Booking API

A comprehensive NestJS-based REST API for managing bus bookings, routes, and user authentication.

## 🚀 Features

- **User Authentication**: JWT-based authentication with Google OAuth support
- **Bus Management**: CRUD operations for buses with seat layout management
- **Route Management**: Create and manage bus routes
- **Booking System**: Seat booking with conflict prevention
- **Role-based Access**: User roles and permissions
- **Database**: PostgreSQL with TypeORM
- **Validation**: Comprehensive input validation
- **Security**: JWT tokens, password hashing, CORS protection

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport.js
- **Validation**: class-validator
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

### Booking Endpoints

#### Create Booking
```http
POST /api/v1/bookings
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "busId": "uuid",
  "routeId": "uuid",
  "seatNumber": "A1"
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
│   ├── guards/          # JWT guards
│   ├── strategies/      # Passport strategies
│   └── auth.service.ts  # Auth service
├── users/               # User management
│   ├── dtos/           # Data transfer objects
│   ├── user.entity.ts  # User entity
│   └── users.service.ts
├── buses/               # Bus management
├── routes/              # Route management
├── bookings/            # Booking system
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
