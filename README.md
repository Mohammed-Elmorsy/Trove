# Trove - E-Commerce Application

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat&logo=react&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=flat&logo=nestjs&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.0.1-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker&logoColor=white)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?style=flat&logo=conventionalcommits&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A modern, full-stack e-commerce application with web and mobile apps, built with Next.js, React Native/Expo, Nest.js, PostgreSQL, and Prisma.

## Features

### Implemented

- **Product Catalog** - Browse products with advanced search, category filters, and price range filters
- **Shopping Cart** - Session-based cart with add, update, remove items and stock validation
- **Checkout & Orders** - Complete checkout flow with shipping form, order confirmation, and order lookup
- **Admin Panel** - Product CRUD, order management, dashboard with stats
- **Mobile App** - React Native/Expo app for iOS, Android, and web with shared TypeScript types
- **Category System** - Products organized by categories (Electronics, Fashion, Home & Kitchen, Sports)
- **Responsive Design** - Mobile-first UI with responsive grid layouts (1-4 columns)
- **Smart Pagination** - Page numbers with ellipsis for large datasets
- **Shared Navigation** - Responsive navbar with mobile slide-out menu and cart badge
- **Modern UI** - Shadcn UI components, toast notifications, loading skeletons

### Coming Soon

- **User Authentication** - Secure user accounts with JWT (Milestone 6)

## Tech Stack

### Backend

- **Nest.js 11** - Progressive Node.js framework
- **Prisma 7** - Next-generation ORM with PostgreSQL adapter
- **PostgreSQL 15** - Relational database
- **TypeScript** - Type-safe development

### Web Frontend

- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - Latest React with improved performance
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component library
- **TypeScript** - Type-safe development

### Mobile App

- **Expo SDK 54** - React Native development platform
- **React Native 0.81** - Native mobile runtime
- **Expo Router** - File-based navigation
- **TypeScript** - Type-safe development

### Shared

- **@trove/shared** - Shared TypeScript types between web and mobile

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
trove/
├── backend/              # Nest.js API
│   ├── src/
│   │   ├── prisma/      # Prisma service
│   │   ├── products/    # Products module
│   │   ├── cart/        # Cart module
│   │   ├── orders/      # Orders module
│   │   ├── admin/       # Admin module (Milestone 5)
│   │   └── auth/        # Auth module (Milestone 6)
│   └── prisma/
│       └── schema.prisma
│
├── frontend/             # Next.js Web App
│   ├── app/             # App router pages
│   ├── components/      # React components
│   │   └── ui/          # Shadcn UI components
│   └── lib/             # Utilities
│
├── mobile/               # React Native/Expo App
│   ├── app/             # Expo Router pages
│   ├── components/      # React Native components
│   ├── lib/             # API client
│   └── context/         # Cart state management
│
├── shared/               # Shared TypeScript types
│   └── index.ts         # Product, Cart, Category types
│
├── docs/                # Documentation
│   ├── project/         # Project overview and planning
│   ├── milestones/      # Milestone progress reports
│   ├── architecture/    # Technical architecture
│   ├── guides/          # Development guides
│   └── reviews/         # Code reviews
│
├── docker-compose.yml   # Docker services
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Docker & Docker Compose ([Download](https://www.docker.com/products/docker-desktop))
- Git ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Mohammed-Elmorsy/Trove.git
cd trove
```

2. **Start PostgreSQL with Docker**

```bash
docker-compose up -d
```

3. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Backend will run on: `http://localhost:4000`

4. **Setup Frontend** (in a new terminal)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend will run on: `http://localhost:3000`

5. **Setup Mobile App** (optional, in a new terminal)

```bash
cd mobile
npm install
cp .env.example .env
npm start
```

Mobile will run on: `http://localhost:8081` (web) or scan QR code with Expo Go app

### Verify Installation

- Visit `http://localhost:3000` - Web frontend should load
- Visit `http://localhost:4000` - Backend should respond
- Visit `http://localhost:8081` - Mobile web should load
- Run `docker ps` - PostgreSQL container should be running

## Development

### Quick Start (From Root Directory)

```bash
# Start database
docker-compose up -d

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Start both backend and frontend together
npm run dev
```

### Running Services Individually

```bash
# Terminal 1 - Database
docker-compose up

# Terminal 2 - Backend
cd backend && npm run start:dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### Database Management

```bash
# Open Prisma Studio (Database GUI)
cd backend && npx prisma studio

# Run migrations
npx prisma migrate dev --name <migration-name>

# Reset database
npx prisma migrate reset
```

## Project Milestones

- [x] **Milestone 1**: Project Setup & Infrastructure ✅
- [x] **Milestone 2**: Product Catalog (Full-Stack) ✅
- [x] **Milestone 3**: Shopping Cart (Web & Mobile) ✅
- [x] **Milestone 4**: Checkout & Orders (Full-Stack) ✅
- [x] **Milestone 5**: Admin Panel Basics (Full-Stack) ✅
- [ ] **Milestone 6**: User Authentication & Authorization (Full-Stack)

See [docs/project/MILESTONES.md](docs/project/MILESTONES.md) for detailed breakdown.

## Documentation

### Project Planning

- [Project Overview](docs/project/PROJECT_OVERVIEW.md) - High-level overview and goals
- [Milestones](docs/project/MILESTONES.md) - Detailed development roadmap

### Technical Architecture

- [Architecture](docs/architecture/ARCHITECTURE.md) - System architecture and design
- [Tech Stack](docs/architecture/TECH_STACK.md) - Technology choices and rationale
- [Mobile App](docs/architecture/MOBILE_APP.md) - React Native/Expo mobile architecture
- [Configuration](docs/architecture/CONFIGURATION.md) - Advanced configuration system
- [Setup Guide](docs/architecture/SETUP.md) - Detailed setup instructions

### Development Guides

- [Commit Conventions](docs/guides/COMMIT_CONVENTIONS.md) - Git commit message standards
- [Claude Agents](docs/guides/CLAUDE_AGENTS.md) - Custom Claude Code agents

### Milestones

- [Milestone 2 Progress](docs/milestones/MILESTONE_2_PROGRESS.md) - Product Catalog completion report
- [Milestone 3 Progress](docs/milestones/MILESTONE_3_PROGRESS.md) - Shopping Cart completion report
- [Milestone 4 Progress](docs/milestones/MILESTONE_4_PROGRESS.md) - Checkout & Orders completion report
- [Milestone 5 Progress](docs/milestones/MILESTONE_5_PROGRESS.md) - Admin Panel completion report

### Code Reviews

- [Next.js Review Fixes](docs/reviews/NEXTJS_REVIEW_FIXES.md) - Next.js 16 code review improvements
- [UI/UX Improvements](docs/reviews/UIUX_IMPROVEMENTS.md) - UI/UX enhancements and fixes

## API Endpoints

### Products ✅

| Method   | Endpoint               | Description                                    |
| -------- | ---------------------- | ---------------------------------------------- |
| `GET`    | `/products`            | List products with search, filters, pagination |
| `GET`    | `/products/:id`        | Get single product with category               |
| `GET`    | `/products/categories` | Get all categories                             |
| `POST`   | `/products`            | Create product (admin)                         |
| `PATCH`  | `/products/:id`        | Update product (admin)                         |
| `DELETE` | `/products/:id`        | Delete product (admin)                         |

**Query Parameters for `GET /products`:**

- `search` - Search by name or description
- `categoryId` - Filter by category
- `minPrice` / `maxPrice` - Filter by price range
- `page` / `limit` - Pagination (default: page=1, limit=12)

### Cart ✅

| Method   | Endpoint              | Description           |
| -------- | --------------------- | --------------------- |
| `GET`    | `/cart/:sessionId`    | Get cart with items   |
| `POST`   | `/cart/items`         | Add item to cart      |
| `PATCH`  | `/cart/items/:itemId` | Update item quantity  |
| `DELETE` | `/cart/items/:itemId` | Remove item from cart |
| `DELETE` | `/cart/:sessionId`    | Clear entire cart     |

### Orders ✅

| Method  | Endpoint             | Description            |
| ------- | -------------------- | ---------------------- |
| `POST`  | `/orders`            | Create order from cart |
| `GET`   | `/orders/:id`        | Get order by ID        |
| `GET`   | `/orders`            | Get orders by email    |
| `PATCH` | `/orders/:id/status` | Update order status    |

### Admin ✅

All admin endpoints require `X-Admin-Secret` header.

| Method   | Endpoint                     | Description               |
| -------- | ---------------------------- | ------------------------- |
| `GET`    | `/admin/dashboard/stats`     | Dashboard statistics      |
| `GET`    | `/admin/products`            | List products (paginated) |
| `GET`    | `/admin/products/:id`        | Get single product        |
| `GET`    | `/admin/products/categories` | Get all categories        |
| `POST`   | `/admin/products`            | Create product            |
| `PATCH`  | `/admin/products/:id`        | Update product            |
| `DELETE` | `/admin/products/:id`        | Delete product            |
| `GET`    | `/admin/orders`              | List orders (paginated)   |
| `GET`    | `/admin/orders/:id`          | Get order details         |
| `PATCH`  | `/admin/orders/:id/status`   | Update order status       |

## Contributing

This is a learning project. Feel free to fork and experiment!

### Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/). All commits must follow this format:

```bash
<type>: <description>

# Examples:
feat: add product search
fix: correct cart calculation
docs: update setup guide
```

See [COMMIT_CONVENTIONS.md](docs/guides/COMMIT_CONVENTIONS.md) for detailed guidelines.

The commit message will be automatically validated by Commitlint before each commit.

## License

MIT

---

**Current Status:** Milestone 5 Complete - Admin Panel with product & order management!
