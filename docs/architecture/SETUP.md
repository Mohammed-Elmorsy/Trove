# Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trove
```

### 2. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This will start:

- PostgreSQL on port 5432

### 3. Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run start:dev
```

Backend will run on: `http://localhost:4000`

### 4. Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trove"

# Server
PORT=4000

# JWT (Milestone 6)
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

### Frontend (.env.local)

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Database Management

### Run Migrations

```bash
cd backend
npx prisma migrate dev --name <migration-name>
```

### View Database

```bash
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555`

### Reset Database

```bash
npx prisma migrate reset
```

## Development Workflow

### Quick Start (From Root Directory)

You can now run the project from the root directory using these convenient scripts:

```bash
# Start database
docker-compose up -d

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Start both backend and frontend
npm run dev

# Run tests
npm run test:backend
npm run test:frontend
```

### Manual Start (Alternative)

If you prefer to start services individually:

```bash
# Terminal 1 - Database
docker-compose up

# Terminal 2 - Backend
cd backend && npm run start:dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### 2. Make Changes

- Backend: Changes auto-reload with Nest.js watch mode
- Frontend: Changes auto-reload with Next.js Fast Refresh

### 3. Test Changes

- Visit `http://localhost:3000`
- Test API endpoints at `http://localhost:4000`

## Useful Commands

### Root Directory (Recommended)

```bash
# Development
npm run dev:backend        # Start backend only
npm run dev:frontend       # Start frontend only
npm run dev                # Start both backend and frontend

# Build
npm run build:backend      # Build backend
npm run build:frontend     # Build frontend

# Testing
npm run test:backend       # Run backend tests
npm run test:frontend      # Run frontend lint

# Formatting
npm run format             # Format all files with Prettier
npm run format:check       # Check formatting without making changes
```

### Backend (From backend/ directory)

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:cov

# Prisma commands
npx prisma generate      # Generate Prisma Client
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Run migrations
npx prisma db seed       # Seed database
```

### Frontend (From frontend/ directory)

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint
```

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build
```

## Troubleshooting

### Database Connection Issues

1. Ensure Docker is running
2. Check if PostgreSQL container is up: `docker ps`
3. Verify DATABASE_URL in `.env`

### Port Already in Use

If ports 3000, 4000, or 5432 are already in use:

1. Stop the conflicting process
2. Or change ports in:
   - `docker-compose.yml` (PostgreSQL)
   - `backend/src/main.ts` (Nest.js)
   - `frontend/package.json` dev script (Next.js)

### Prisma Client Issues

```bash
cd backend
npx prisma generate
```

### Clear Node Modules

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
trove/
├── backend/              # Nest.js API
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env
│
├── frontend/             # Next.js App
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.local
│
├── mobile/               # React Native/Expo App
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env
│
├── shared/               # Shared TypeScript types
│   └── index.ts
│
├── docs/                 # Documentation
├── docker-compose.yml    # Docker services
└── README.md
```

## Next Steps

After completing setup:

1. Verify all services are running
2. Check `http://localhost:3000` loads
3. Check `http://localhost:4000` API responds
4. Proceed to Milestone 2: Product Catalog

## Mobile App Setup

### 5. Mobile Setup

```bash
cd mobile
npm install

# Copy environment variables
cp .env.example .env

# For physical device testing, update .env with your local IP:
# API_URL=http://192.168.x.x:4000

# Start Expo development server
npm start
```

Mobile will run on:

- Web: `http://localhost:8081`
- iOS: Expo Go app (scan QR code)
- Android: Expo Go app (scan QR code)

### Backend CORS for Mobile

When testing on physical devices, add your IP to `backend/.env`:

```env
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:8081,http://192.168.x.x:8081"
```

See [MOBILE_APP.md](./MOBILE_APP.md) for detailed mobile setup instructions.

## Additional Resources

- [Nest.js Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
