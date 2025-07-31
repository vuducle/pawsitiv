# Pawsitiv Backend Server 🐱

A robust Express.js backend server for the Pawsitiv Cat Adoption Platform, built with TypeScript and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Code Structure](#code-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

The Pawsitiv backend server provides a RESTful API for managing cat adoption profiles, user accounts, and notifications. Built with modern TypeScript practices, comprehensive TSDoc documentation, and PostgreSQL for data persistence.

### Key Features

- **TypeScript**: Full type safety and modern JavaScript features
- **PostgreSQL**: Robust relational database with proper relationships
- **Environment Configuration**: Separate configurations for development and production
- **Comprehensive Documentation**: TSDoc comments throughout the codebase
- **Security**: Helmet, rate limiting, and CORS protection
- **Error Handling**: Centralized error handling with environment-specific responses
- **Health Monitoring**: Built-in health check endpoints

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15
- **Authentication**: bcryptjs for password hashing
- **Security**: Helmet, express-rate-limit, CORS
- **File Upload**: Multer with Sharp for image processing
- **Validation**: Express-validator
- **Testing**: Jest with PostgreSQL test database

### Design Patterns

- **Model-View-Controller (MVC)**: Clear separation of concerns
- **Repository Pattern**: Database operations abstracted in model classes
- **Factory Pattern**: Environment-specific configuration objects
- **Middleware Pattern**: Modular request processing
- **Singleton Pattern**: Database connection pooling

## ✨ Features

### Core Functionality

- **User Management**: Registration, authentication, profile management
- **Cat Profiles**: Create, update, and manage cat adoption profiles
- **Image Management**: Upload and manage cat photos
- **Notifications**: Real-time notifications for users
- **Search & Filter**: Find cats by location, breed, and characteristics
- **Subscriptions**: Users can subscribe to cat updates

### Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: Secure session handling
- **Rate Limiting**: Protection against abuse
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries

### Development Features

- **Hot Reload**: Automatic server restart on file changes
- **Environment Detection**: Automatic configuration based on NODE_ENV
- **Comprehensive Logging**: Detailed request/response logging
- **Health Checks**: System monitoring endpoints
- **Error Tracking**: Detailed error information in development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional, for containerized development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Docker Setup

```bash
# Start the entire stack (database + backend)
docker compose -f ../docker-compose.dev.yml up --build

# Or start just the backend
docker compose -f ../docker-compose.dev.yml up backend
```

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:3669`
- **Production**: `https://yourdomain.com`

### Authentication Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| `POST` | `/api/users/register` | Register a new user |
| `POST` | `/api/users/login`    | Authenticate user   |
| `POST` | `/api/users/logout`   | Logout user         |

### User Endpoints

| Method   | Endpoint         | Description    |
| -------- | ---------------- | -------------- |
| `GET`    | `/api/users`     | Get all users  |
| `GET`    | `/api/users/:id` | Get user by ID |
| `PUT`    | `/api/users/:id` | Update user    |
| `DELETE` | `/api/users/:id` | Delete user    |

### Cat Endpoints

| Method   | Endpoint        | Description    |
| -------- | --------------- | -------------- |
| `GET`    | `/api/cats`     | Get all cats   |
| `POST`   | `/api/cats`     | Create new cat |
| `GET`    | `/api/cats/:id` | Get cat by ID  |
| `PUT`    | `/api/cats/:id` | Update cat     |
| `DELETE` | `/api/cats/:id` | Delete cat     |

### Notification Endpoints

| Method   | Endpoint                      | Description           |
| -------- | ----------------------------- | --------------------- |
| `GET`    | `/api/notifications`          | Get all notifications |
| `POST`   | `/api/notifications`          | Create notification   |
| `PUT`    | `/api/notifications/:id/seen` | Mark as seen          |
| `DELETE` | `/api/notifications/:id`      | Delete notification   |

### System Endpoints

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| `GET`  | `/health` | System health check |
| `GET`  | `/`       | API information     |

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  profile_picture VARCHAR(500) DEFAULT '/default.jpg',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_admin BOOLEAN DEFAULT FALSE
);
```

### Cats Table

```sql
CREATE TABLE cats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  images TEXT[] DEFAULT '{}',
  personality_tags TEXT[] DEFAULT '{}',
  fur_color VARCHAR(100),
  fur_pattern VARCHAR(100),
  breed VARCHAR(100),
  hair_length VARCHAR(20) CHECK (hair_length IN ('kurz', 'mittel', 'lang')),
  chonkiness VARCHAR(20) CHECK (chonkiness IN ('schlank', 'normal', 'mollig', 'übergewichtig')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('neue_katze', 'update_katze', 'match', 'nachricht')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  seen BOOLEAN DEFAULT FALSE
);
```

### User-Cat Subscriptions Table

```sql
CREATE TABLE user_cat_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, cat_id)
);
```

## 📁 Code Structure

```
server/
├── app.ts                 # Main application entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── env.example            # Environment variables template
├── Dockerfile             # Production Docker configuration
├── Dockerfile.dev         # Development Docker configuration
├── jest.config.js         # Jest testing configuration
├── jest.setup.js          # Jest setup for PostgreSQL
├── nodemon.json           # Development server configuration
│
├── db/                    # Database related files
│   ├── connection.ts      # PostgreSQL connection management
│   ├── migrate.ts         # Database migration script
│   └── seed.ts            # Database seeding script
│
├── models/                # Data models
│   ├── User.ts           # User model with TSDoc documentation
│   ├── Cat.ts            # Cat model with TSDoc documentation
│   └── Notification.ts   # Notification model with TSDoc documentation
│
├── routes/                # API route handlers
│   ├── index.ts          # Route aggregator
│   ├── users.ts          # User-related routes
│   ├── cats.ts           # Cat-related routes
│   └── notifications.ts  # Notification-related routes
│
├── middleware/            # Custom middleware
│   └── upload.ts         # File upload middleware
│
├── types/                 # TypeScript type definitions
│   └── jest-dom.d.ts     # Jest DOM types
│
├── uploads/               # File upload directory
│   ├── cats/             # Cat images
│   ├── profile/          # Profile pictures
│   └── other/            # Other uploads
│
└── __tests__/            # Test files
    └── postgres.test.ts  # PostgreSQL integration tests
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run dev:watch        # Start with nodemon for file watching
npm run dev:seed         # Start with database seeding

# Building
npm run build            # Compile TypeScript to JavaScript
npm run clean            # Clean build artifacts

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with TypeScript rules
- **TSDoc**: Comprehensive documentation for all public APIs
- **Prettier**: Consistent code formatting

### Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3669

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=pawsitiv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=pawsitiv123

# Security
SESSION_SECRET=your-super-secret-key
FRONTEND_URL=http://localhost:3000

# Development
SEED_DATABASE=true
LOG_LEVEL=debug
```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Individual function testing
- **Integration Tests**: Database operation testing
- **API Tests**: Endpoint testing with supertest

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- postgres.test.ts

# Generate coverage report
npm test -- --coverage
```

### Test Database

Tests use a separate PostgreSQL database (`pawsitiv_test`) to avoid affecting development data. The test database is automatically created and cleaned between test runs.

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build production image
docker build -t pawsitiv-server .

# Run production container
docker run -p 3669:3669 pawsitiv-server
```

### Environment Configuration

For production deployment, ensure the following environment variables are set:

- `NODE_ENV=production`
- `SESSION_SECRET` (strong, unique secret)
- `FRONTEND_URL` (your frontend domain)
- `POSTGRES_*` (production database credentials)

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TSDoc documentation
4. **Run tests**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Review Checklist

- [ ] TSDoc documentation added for new functions
- [ ] TypeScript types properly defined
- [ ] Tests written and passing
- [ ] ESLint rules followed
- [ ] Error handling implemented
- [ ] Security considerations addressed

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

Developed by the Pawsitiv Development Team:

- Malte Szemlics
- Sophia Kawgan Kagan
- Leticia Halm
- Vu Duc (Minh) Le

---

**Happy coding! 🐱✨**
