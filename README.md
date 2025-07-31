# Pawsitive – A Home for Every Cat

A full-stack cat adoption platform built with Next.js frontend and Express.js backend, now using PostgreSQL for data persistence.

## 🏗️ Architecture

- **Frontend**: Next.js with TypeScript
- **Backend**: Express.js with TypeScript and PostgreSQL
- **Database**: PostgreSQL with proper relationships
- **Containerization**: Docker with environment-specific configurations
- **Reverse Proxy**: Nginx (production)

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (for local development)

### Environment Setup

1. **Copy environment template:**

   ```bash
   cp server/env.example .env
   ```

2. **Configure environment variables** in `.env`:
   ```env
   NODE_ENV=development
   POSTGRES_PASSWORD=your-secure-password
   SESSION_SECRET=your-super-secret-key
   FRONTEND_URL=http://localhost:3000
   ```

| Name                | Role                  |
| ------------------- | --------------------- |
| Malte Szemlics      | Banner & Design       |
| Leticia Halm        | Code & Coordination   |
| Sophia Kawgan Kagan | User Flow & Frontend  |
| Vu Duc Le           | Backend Logic & Magic |

### Development Environment

Start the entire development stack:

```bash
npm run dev
```

This will start:

- PostgreSQL database (port 5432)
- Backend API server (port 3669)
- Frontend application (port 3000)
- Auto-seeding enabled

### Production Environment

Deploy to production:

```bash
npm run prod
```

This includes:

- PostgreSQL database
- Backend API server
- Frontend application
- Nginx reverse proxy (ports 80, 443)
- SSL/TLS support

### Available Commands

```bash
# Development
npm run dev              # Start development environment
npm run dev:down         # Stop development environment
npm run dev:logs         # View development logs

# Production
npm run prod             # Start production environment
npm run prod:down        # Stop production environment
npm run prod:logs        # View production logs

# Database
npm run seed             # Seed database (default environment)
npm run seed:dev         # Seed development database
npm run seed:prod        # Seed production database

# Management
npm run status           # Check service status
npm run clean            # Clean up all containers and volumes
npm run build            # Build all images
npm run logs             # View logs for all services
```

## 🛠️ Local Development

### Backend Development

```bash
cd server

# Install dependencies
npm install

# Set up database
# create a database locally and use the postgres values of the .env.example file (we recommend pgAdmin 4)
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Frontend Development

```bash
cd pawsitiv

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
pawsitiv/
├── docker-compose.yml          # Main Docker Compose file
├── docker-compose.dev.yml      # Development environment
├── docker-compose.prod.yml     # Production environment
├── server/                     # Backend application
│   ├── app.ts                 # Main application file
│   ├── models/                # PostgreSQL models
│   ├── routes/                # API routes
│   ├── db/                    # Database configuration
│   └── Dockerfile             # Backend Docker image
├── pawsitiv/                  # Frontend application
│   ├── src/                   # Next.js source code
│   └── Dockerfile             # Frontend Docker image
└── nginx/                     # Nginx configuration
```

## 🔧 Environment Configuration

### Development Environment

- **Database**: `pawsitiv_dev`
- **Ports**: 3000 (frontend), 3669 (backend), 5432 (database)
- **Features**: Hot reload, detailed logging, auto-seeding
- **Security**: Permissive CORS, HTTP cookies allowed

### Production Environment

- **Database**: `pawsitiv` (configurable)
- **Ports**: 80/443 (nginx), internal services
- **Features**: Nginx reverse proxy, SSL/TLS, rate limiting
- **Security**: Strict CORS, HTTPS only, security headers

## 🗄️ Database Schema

### Users Table

- `id` (SERIAL PRIMARY KEY)
- `name`, `username`, `email` (VARCHAR)
- `password` (VARCHAR - hashed)
- `profile_picture`, `created_at`, `is_admin`

### Cats Table

- `id` (SERIAL PRIMARY KEY)
- `name`, `location`, `breed` (VARCHAR)
- `images`, `personality_tags` (TEXT[])
- `appearance` fields (fur_color, fur_pattern, etc.)

### Notifications Table

- `id` (SERIAL PRIMARY KEY)
- `user_id`, `cat_id` (INTEGER - foreign keys)
- `type`, `timestamp`, `seen`

## 🔒 Security Features

### Production Security

- Helmet middleware with CSP
- Rate limiting (100 req/15min per IP)
- HTTPS-only cookies
- Strict CORS policy
- Input validation and sanitization

### Development Security

- Permissive settings for easier development
- Detailed error information
- HTTP cookies allowed
- Lax CORS policy

## 📊 Monitoring & Health Checks

- **Health Endpoint**: `GET /health`
- **Database Health**: PostgreSQL connection monitoring
- **Application Health**: API endpoint monitoring
- **Container Health**: Docker health checks

## 🚀 Deployment

### Production Deployment

1. **Set environment variables:**

   ```bash
   export POSTGRES_PASSWORD=your-secure-password
   export SESSION_SECRET=your-super-secret-key
   export FRONTEND_URL=https://yourdomain.com
   ```

2. **Deploy:**

   ```bash
   npm run prod
   ```

3. **Seed database (optional):**
   ```bash
   npm run seed:prod
   ```

### SSL/TLS Configuration

1. **Place SSL certificates** in `nginx/ssl/`
2. **Update nginx configuration** in `nginx/nginx.prod.conf`
3. **Restart production stack**

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd pawsitiv
npm test
```

## 📝 API Documentation

### Authentication

- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Cats

- `GET /api/cats` - Get all cats
- `POST /api/cats` - Create cat
- `GET /api/cats/:id` - Get cat by ID
- `PUT /api/cats/:id` - Update cat

### Health

- `GET /health` - System health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

<!-- Add screenshots or mockups here -->
<p align="center">
  <img src="https://placekitten.com/800/300" alt="Sneak Peek of UI" width="70%">
</p>

## Project Status

> This project is a work in progress! Stay tuned for cat-tastic updates.
> If we are sucessful with our idea we can extend our app for other animals :)

## 👥 Team

Developed by Malte Szemlics, Sophia Kawgan Kagan, Leticia Halm and Vu Duc (Minh) Le, Homam Mousa

          /| _ ╱|、
         ( •̀ㅅ •́  )
        ＿ノ ヽ ノ＼＿
     /　`/ ⌒Ｙ⌒ Ｙ　  \
    ( 　(三ヽ人　 /　  |
    |　ﾉ⌒＼ ￣￣ヽ　  ノ
     ヽ＿＿＿＞､＿＿ ／
         ｜( 王 ﾉ〈
         /ﾐ`ー―彡\
       |╰        ╯|
      |     /\     |
      |    /  \    |
      |   /    \   |
