# Trove - E-Commerce Application

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat&logo=react&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=flat&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.0.1-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker&logoColor=white)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?style=flat&logo=conventionalcommits&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A modern, full-stack e-commerce application built with Next.js, Nest.js, PostgreSQL, and Prisma.

## Features

### Implemented

- **Product Catalog** - Browse products with advanced search, category filters, and price range filters
- **Category System** - Products organized by categories (Electronics, Clothing, Home & Garden, Sports)
- **Responsive Design** - Mobile-first UI with responsive grid layouts (1-4 columns)
- **Smart Pagination** - Page numbers with ellipsis for large datasets
- **Shared Navigation** - Responsive navbar with mobile slide-out menu

### Coming Soon

- **Shopping Cart** - Add, update, and remove items (Milestone 3)
- **Checkout & Orders** - Complete purchases and track orders (Milestone 4)
- **Admin Panel** - Manage products and orders (Milestone 5)
- **User Authentication** - Secure user accounts (Milestone 6)

## Tech Stack

### Backend

- **Nest.js** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe development

### Frontend

- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - Latest React with improved performance
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Re-usable component library
- **TypeScript** - Type-safe development

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
trove/
├── backend/              # Nest.js API
│   ├── src/
│   │   ├── prisma/      # Prisma service
│   │   ├── products/    # Products module (Milestone 2)
│   │   ├── cart/        # Cart module (Milestone 3)
│   │   ├── orders/      # Orders module (Milestone 4)
│   │   └── auth/        # Auth module (Milestone 6)
│   └── prisma/
│       └── schema.prisma
│
├── frontend/             # Next.js App
│   ├── app/             # App router pages
│   ├── components/      # React components
│   │   └── ui/          # Shadcn UI components
│   └── lib/             # Utilities
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

### Verify Installation

- Visit `http://localhost:3000` - Frontend should load
- Visit `http://localhost:4000` - Backend should respond
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

- [x] **Milestone 1**: Project Setup & Infrastructure
- [x] **Milestone 2**: Product Catalog (Full-Stack) ✅
- [ ] **Milestone 3**: Shopping Cart (Full-Stack)
- [ ] **Milestone 4**: Checkout & Orders (Full-Stack)
- [ ] **Milestone 5**: Admin Panel Basics (Full-Stack)
- [ ] **Milestone 6**: User Authentication & Authorization (Full-Stack)

See [docs/project/MILESTONES.md](docs/project/MILESTONES.md) for detailed breakdown.

## Documentation

### Project Planning

- [Project Overview](docs/project/PROJECT_OVERVIEW.md) - High-level overview and goals
- [Milestones](docs/project/MILESTONES.md) - Detailed development roadmap

### Technical Architecture

- [Architecture](docs/architecture/ARCHITECTURE.md) - System architecture and design
- [Tech Stack](docs/architecture/TECH_STACK.md) - Technology choices and rationale
- [Configuration](docs/architecture/CONFIGURATION.md) - Advanced configuration system
- [Setup Guide](docs/architecture/SETUP.md) - Detailed setup instructions

### Development Guides

- [Commit Conventions](docs/guides/COMMIT_CONVENTIONS.md) - Git commit message standards
- [Claude Agents](docs/guides/CLAUDE_AGENTS.md) - Custom Claude Code agents

### Milestones

- [Milestone 2 Progress](docs/milestones/MILESTONE_2_PROGRESS.md) - Product Catalog completion report

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

### Cart (Coming in Milestone 3)

- `GET /cart/:sessionId` - Get cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update item quantity
- `DELETE /cart/items/:id` - Remove item

### Orders (Coming in Milestone 4)

- `POST /orders` - Create order
- `GET /orders/:id` - Get order details

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

**Current Status:** Milestone 2 Complete - Product Catalog fully functional with search, filters, and pagination!
