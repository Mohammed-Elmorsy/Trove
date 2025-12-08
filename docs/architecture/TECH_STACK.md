# Technology Stack

## Backend

### Core

- **NestJS v11.0.1** - Progressive Node.js framework
  - TypeScript-first
  - Modular architecture
  - Built-in dependency injection
  - Excellent for scalable APIs

### Database & ORM

- **PostgreSQL** - Relational database
  - ACID compliance
  - Rich data types
  - Great for e-commerce transactions
- **Prisma v7.0.1** - Next-generation ORM
  - Type-safe database client
  - Auto-generated types
  - Migration management
  - PostgreSQL adapter (@prisma/adapter-pg v7.0.1)
  - Excellent developer experience

### Configuration & Validation

- **@nestjs/config v4.0.2** - Configuration management module
  - Type-safe configuration namespaces
  - Environment-specific configurations
  - Dependency injection support
- **Joi v18.0.2** - Schema validation for environment variables
  - Validates configuration at application startup
  - Prevents runtime configuration errors
  - Rich validation API
- **Zod** - TypeScript-first schema validation (Coming in Milestone 3+)
  - Shared validation logic between frontend/backend
  - Type inference

### Security

- **Helmet v8.1.0** - HTTP security headers middleware
- **@nestjs/throttler v6.5.0** - Rate limiting protection
- **class-validator v0.14.3** - Input validation and sanitization

## Frontend

### Core

- **Next.js v16.0.7** - React framework
  - App Router (Server Components)
  - Turbopack bundler (default in Next.js 16)
  - Server-side rendering
  - API routes capability
  - Excellent performance
  - React 19 support
- **React v19.2.1** - UI library
  - Server Components support
  - Patched for CVE-2025-55182

### Styling & UI

- **Tailwind CSS v3.4.1** - Utility-first CSS framework
  - Rapid development
  - Consistent design system
  - Small bundle size
- **Shadcn UI** - Component library
  - Built on Radix UI (accessible)
  - Copy-paste components (you own the code)
  - Tailwind-based
  - TypeScript support
  - Components installed:
    - Button, Card, Badge, Input, Label
    - NavigationMenu, Sheet, Separator
    - Skeleton (for loading states)
  - Custom components:
    - ProductImage (wrapper for Next.js Image with transitions)
- **Lucide React v0.555.0** - Icon library
  - Consistent icon set
  - Tree-shakeable
  - TypeScript support

### State Management (Add Later)

- **Tanstack Query** (Consider for Milestone 3+)
  - Server state management
  - Caching and synchronization
  - Optimistic updates
- Built-in React hooks for now (useState, useContext)

## Development Tools

### Containerization

- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
  - PostgreSQL container
  - Backend container
  - Frontend container

### Language

- **TypeScript v5.7.3** - Typed JavaScript
  - Type safety across entire stack
  - Better developer experience
  - Fewer runtime errors

### Code Quality

- **ESLint v9.18.0** - JavaScript/TypeScript linter
- **Prettier v3.7.3** - Code formatter
- **Husky v9.1.7** - Git hooks
- **lint-staged v16.2.7** - Run linters on staged files
- **Commitlint v20.1.0** - Conventional commits enforcement

### Testing

- **Jest v30.0.0** - Testing framework
- **Supertest v7.0.0** - HTTP assertions

### Version Control

- **Git** - Version control
- **GitHub** - Remote repository hosting

## Why This Stack?

### Type Safety

- TypeScript everywhere
- Prisma generates types from schema
- Zod validates at runtime
- End-to-end type safety

### Developer Experience

- Hot reload (Next.js & Nest.js)
- Auto-generated API types
- Comprehensive tooling
- Great documentation for all tools

### Production Ready

- Battle-tested technologies
- Good performance out of the box
- Easy to scale
- Strong community support

## Mobile App

### Core

- **Expo SDK 54** - React Native development platform
  - Managed workflow
  - Over-the-air updates
  - Cross-platform (iOS, Android, Web)
- **React Native 0.81.5** - Native runtime
- **Expo Router 6.0.17** - File-based navigation
  - Tab navigation
  - Stack navigation
  - Deep linking support

### UI & Styling

- **React Native StyleSheet** - Native styling
- **Platform-specific shadows** - iOS/Android/Web
- **Themed components** - Dark/light mode support
- **Custom ProductCard** - Modern e-commerce styling

### State & Storage

- **React Context** - Cart state management
- **AsyncStorage** - Session persistence
- **Shared types (@trove/shared)** - TypeScript types shared with web

### Development

- **Expo Go** - Development client for physical devices
- **dotenv** - Environment variable management
- **TypeScript** - Full type safety

See [MOBILE_APP.md](./MOBILE_APP.md) for detailed mobile architecture.

## Future Considerations

- **Payment Processing**: Stripe integration
- **File Storage**: AWS S3 or Cloudinary
- **Email**: SendGrid or similar
- **Deployment**: Vercel (frontend), Railway/Render (backend), EAS (mobile)
- **Monitoring**: Sentry for error tracking
