# Trove - E-Commerce Application

![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat&logo=react&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11.1.9-E0234E?style=flat&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.0.1-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker&logoColor=white)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?style=flat&logo=conventionalcommits&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A modern, full-stack e-commerce application built with Next.js, Nest.js, PostgreSQL, and Prisma.

## Features

- **Product Catalog** - Browse and search products
- **Shopping Cart** - Add, update, and remove items
- **Checkout & Orders** - Complete purchases and track orders
- **Admin Panel** - Manage products and orders
- **User Authentication** - Secure user accounts (coming soon)

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
│   ├── PROJECT_OVERVIEW.md
│   ├── TECH_STACK.md
│   ├── MILESTONES.md
│   ├── ARCHITECTURE.md
│   └── SETUP.md
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

### Running the Application

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
- [ ] **Milestone 2**: Product Catalog (Full-Stack)
- [ ] **Milestone 3**: Shopping Cart (Full-Stack)
- [ ] **Milestone 4**: Checkout & Orders (Full-Stack)
- [ ] **Milestone 5**: Admin Panel Basics (Full-Stack)
- [ ] **Milestone 6**: User Authentication & Authorization (Full-Stack)

See [docs/MILESTONES.md](docs/MILESTONES.md) for detailed breakdown.

## Documentation

- [Project Overview](docs/PROJECT_OVERVIEW.md) - High-level overview and goals
- [Tech Stack](docs/TECH_STACK.md) - Technology choices and rationale
- [Milestones](docs/MILESTONES.md) - Detailed development roadmap
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design
- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Commit Conventions](docs/COMMIT_CONVENTIONS.md) - Git commit message standards

## API Endpoints (Coming in Milestone 2)

### Products

- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

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

See [COMMIT_CONVENTIONS.md](docs/COMMIT_CONVENTIONS.md) for detailed guidelines.

The commit message will be automatically validated by Commitlint before each commit.

## License

MIT

---

**Current Status:** Milestone 1 Complete - Ready for development!
