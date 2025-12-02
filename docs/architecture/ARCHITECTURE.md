# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Next.js Frontend (Port 3000)                  │ │
│  │  - Server Components (SSR)                            │ │
│  │  - Client Components (Interactive UI)                 │ │
│  │  - Shadcn UI Components                               │ │
│  │  - Tailwind CSS                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Nest.js Backend (Port 4000)                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Products   │  │     Cart     │  │    Orders    │      │
│  │    Module    │  │    Module    │  │    Module    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│          │                 │                 │              │
│          └─────────────────┴─────────────────┘              │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │ Prisma Client  │                       │
│                    └───────┬────────┘                       │
└────────────────────────────┼────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           PostgreSQL Database (Port 5432)                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Products │  │   Cart   │  │  Orders  │  │  Users   │   │
│  │  Table   │  │  Table   │  │  Table   │  │  Table   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Product Browsing Flow

```
User → Next.js (Server Component) → Nest.js API → Prisma → PostgreSQL
                                                              │
PostgreSQL → Prisma → Nest.js → Next.js → Render HTML → User
```

### 2. Add to Cart Flow

```
User clicks "Add to Cart" → Client Component → API call → Nest.js
                                                             │
Nest.js → Prisma → Insert CartItem → PostgreSQL → Response → UI Update
```

### 3. Checkout Flow

```
User fills form → Submit → Nest.js → Create Order → Clear Cart → Confirmation
```

## Module Structure

### Backend (Nest.js)

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   │
│   ├── products/               # Products module
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.module.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   │
│   ├── cart/                   # Cart module
│   │   ├── cart.controller.ts
│   │   ├── cart.service.ts
│   │   └── cart.module.ts
│   │
│   ├── orders/                 # Orders module
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── orders.module.ts
│   │
│   ├── auth/                   # Auth module (Milestone 6)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   │
│   └── prisma/                 # Prisma module
│       ├── prisma.service.ts
│       └── prisma.module.ts
│
├── prisma.config.ts            # Prisma 7 config (CLI)
└── prisma/
    ├── schema.prisma           # Database schema
    ├── migrations/             # Database migrations
    └── seed.ts                 # Seed data
```

## Configuration Management

The application uses an advanced configuration system with NestJS's `ConfigModule`. See [CONFIGURATION.md](./CONFIGURATION.md) for complete details.

### Key Features

- **Type-Safe Namespaces** - Organized configs by domain (app, database)
- **Joi Validation** - Environment variables validated at startup
- **Environment-Specific** - Separate configs for dev/prod/test
- **Dependency Injection** - Configs available via DI throughout the app

### Quick Example

```typescript
// Typed configuration access
constructor(private configService: ConfigService) {
  const appConfig = configService.get<AppConfig>('app');
  console.log(appConfig.port); // Type-safe!
}
```

### Configuration Files

```
backend/
├── .env.development        # Development environment
├── .env.production         # Production environment
├── .env.test              # Test environment
├── .env.example           # Template (committed)
└── src/config/
    ├── app.config.ts      # App configuration namespace
    ├── database.config.ts # Database configuration namespace
    └── validation.schema.ts # Joi validation schema
```

### Environment Priority

1. `.env.local` - Local overrides (not committed)
2. `.env.${NODE_ENV}` - Environment-specific
3. `.env` - Default fallback

### Prisma 7 Configuration

Prisma 7 uses a separate `prisma.config.ts` file for CLI operations (migrations, schema location). The runtime database connection uses NestJS's ConfigModule for consistency and validation.

### Frontend (Next.js)

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   │
│   ├── products/               # Product routes
│   │   ├── page.tsx            # Product listing
│   │   └── [id]/
│   │       └── page.tsx        # Product detail
│   │
│   ├── cart/
│   │   └── page.tsx            # Cart page
│   │
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   │
│   ├── orders/
│   │   ├── page.tsx            # Order lookup
│   │   └── [id]/
│   │       └── page.tsx        # Order confirmation
│   │
│   └── admin/                  # Admin routes
│       ├── layout.tsx          # Admin layout
│       ├── page.tsx            # Dashboard
│       ├── products/
│       │   └── page.tsx        # Product management
│       └── orders/
│           └── page.tsx        # Order management
│
├── components/
│   ├── ui/                     # Shadcn components
│   ├── product-card.tsx
│   ├── cart-item.tsx
│   ├── header.tsx
│   └── footer.tsx
│
├── lib/
│   ├── api.ts                  # API client
│   └── utils.ts
│
└── types/
    └── index.ts                # Shared types
```

## Database Schema (Prisma)

### Initial Schema (Milestones 2-4)

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  imageUrl    String?
  category    String?
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cartItems   CartItem[]
  orderItems  OrderItem[]
}

model Cart {
  id        String     @id @default(uuid())
  sessionId String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  items     CartItem[]
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int

  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
}

model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique
  customerEmail   String
  customerName    String
  shippingAddress String
  total           Decimal     @db.Decimal(10, 2)
  status          OrderStatus @default(PENDING)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items           OrderItem[]
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)

  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Extended Schema (Milestone 6 - Auth)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders    Order[]
  cart      Cart?
}

enum UserRole {
  USER
  ADMIN
}

// Update Cart to have optional userId
model Cart {
  id        String     @id @default(uuid())
  sessionId String?    @unique
  userId    String?    @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  user      User?      @relation(fields: [userId], references: [id])
  items     CartItem[]
}

// Update Order to have optional userId
model Order {
  // ... existing fields
  userId    String?
  user      User?      @relation(fields: [userId], references: [id])
}
```

## API Endpoints

### Products

- `GET /products` - List all products (with pagination)
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Cart

- `GET /cart/:sessionId` - Get cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update item quantity
- `DELETE /cart/items/:id` - Remove item from cart
- `DELETE /cart/:sessionId` - Clear cart

### Orders

- `POST /orders` - Create order
- `GET /orders/:id` - Get order by ID
- `GET /orders/lookup?email=...&orderNumber=...` - Lookup order
- `GET /orders` - List all orders (admin)
- `PUT /orders/:id/status` - Update order status (admin)

### Auth (Milestone 6)

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user
- `POST /auth/logout` - Logout user

## Security Considerations

### Current (No Auth)

- Input validation with Zod
- SQL injection prevention (Prisma handles this)
- CORS configuration
- Rate limiting (consider adding)

### After Auth (Milestone 6)

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Secure session management
- HTTPS in production
- Environment variable security

## Deployment Architecture (Future)

```
Frontend (Next.js) → Vercel
Backend (Nest.js)  → Railway/Render
Database           → Railway/Supabase PostgreSQL
File Storage       → Cloudinary/S3
```
