# Milestone 5: Admin Panel Basics - Progress Report

**Status**: Complete
**Completion Date**: December 13, 2025

## Overview

Implemented a web-only admin panel with environment variable authentication for managing products and orders. This is a temporary authentication solution that will be replaced with proper JWT authentication in Milestone 6.

## Features Implemented

### Backend

#### Admin Authentication

- **AdminGuard** (`backend/src/admin/guards/admin.guard.ts`)
  - Checks `X-Admin-Secret` header against `ADMIN_SECRET` environment variable
  - Throws `UnauthorizedException` for invalid credentials
  - Applied to all admin routes via `@UseGuards(AdminGuard)`

#### Admin Endpoints

| Method | Endpoint                     | Description                                  |
| ------ | ---------------------------- | -------------------------------------------- |
| GET    | `/admin/dashboard/stats`     | Dashboard statistics (products, orders, etc) |
| GET    | `/admin/products`            | List products (paginated)                    |
| GET    | `/admin/products/:id`        | Get single product                           |
| GET    | `/admin/products/categories` | Get all categories                           |
| POST   | `/admin/products`            | Create product                               |
| PATCH  | `/admin/products/:id`        | Update product                               |
| DELETE | `/admin/products/:id`        | Delete product                               |
| GET    | `/admin/orders`              | List orders (paginated, filterable)          |
| GET    | `/admin/orders/:id`          | Get order details                            |
| PATCH  | `/admin/orders/:id/status`   | Update order status                          |

#### Dashboard Stats Response

```typescript
{
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  lowStockProducts: number; // Stock <= 5
  recentOrdersCount: number; // Last 24 hours
}
```

### Frontend

#### Admin Authentication

- **AdminProvider** (`components/providers/admin-provider.tsx`)
  - Context for admin authentication state
  - `login(secret)` - Validates secret against backend
  - `logout()` - Clears session and redirects
  - Uses `sessionStorage` for admin secret (clears on tab close)

- **Admin API Client** (`lib/admin-api.ts`)
  - All requests include `X-Admin-Secret` header
  - Automatic logout on 401 response
  - Timeout handling with 10s default

#### Admin Layout

- **Sidebar Navigation** (`components/admin/admin-sidebar.tsx`)
  - Dashboard, Products, Orders links
  - Active state highlighting
  - Logout button

- **Header** (`components/admin/admin-header.tsx`)
  - "View Store" link to main site

- **Auth Guard** (`components/admin/admin-auth-guard.tsx`)
  - Redirects to login if not authenticated
  - Shows loading spinner while checking auth

#### Admin Pages

1. **Login Page** (`/admin/login`)
   - Secret input with validation
   - Error handling for invalid credentials
   - Redirects to dashboard on success

2. **Dashboard** (`/admin/dashboard`)
   - Stats cards: Total Products, Orders, Revenue, Pending Orders, Low Stock, Recent Orders
   - Orders by status breakdown

3. **Products Management** (`/admin/products`)
   - Data table with Name, Category, Price, Stock columns
   - Search functionality
   - Pagination controls
   - Create product dialog (with form validation)
   - Edit product dialog
   - Delete confirmation dialog

4. **Orders Management** (`/admin/orders`)
   - Data table with Order #, Customer, Status, Total, Date columns
   - Status filter dropdown
   - Inline status update via select dropdown
   - Pagination controls

5. **Order Detail** (`/admin/orders/[id]`)
   - Order items table
   - Order totals (subtotal, shipping, total)
   - Customer information card
   - Shipping address card
   - Status update dropdown

### New Shadcn Components Added

- `table.tsx` - Data tables
- `dialog.tsx` - Modal dialogs
- `select.tsx` - Dropdown selects
- `dropdown-menu.tsx` - Dropdown menus
- `textarea.tsx` - Multi-line text input

## File Structure

### Backend

```
backend/src/admin/
├── admin.module.ts
├── admin.controller.ts
├── admin.service.ts
├── guards/
│   └── admin.guard.ts
└── dto/
    └── query-orders.dto.ts
```

### Frontend

```
frontend/
├── app/admin/
│   ├── layout.tsx
│   ├── page.tsx (redirect)
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── orders/
│       ├── page.tsx
│       ├── loading.tsx
│       └── [id]/
│           └── page.tsx
├── components/admin/
│   ├── admin-sidebar.tsx
│   ├── admin-header.tsx
│   └── admin-auth-guard.tsx
├── components/providers/
│   └── admin-provider.tsx
├── lib/
│   ├── admin-api.ts
│   └── validations/
│       └── admin.ts
└── types/
    └── admin.ts
```

## Configuration Changes

### Environment Variables

Added to `.env` and `.env.example`:

```env
# Admin (Simple auth for Milestone 5)
ADMIN_SECRET="your-admin-secret-key-min-32-characters"
```

### Validation Schema

Updated `backend/src/config/validation.schema.ts`:

- Added `ADMIN_SECRET` with 32 character minimum requirement

### App Config

Updated `backend/src/config/app.config.ts`:

- Added `adminSecret` property to `AppConfig` interface

## Security Considerations

1. **Temporary Solution**: This simple auth is intentionally basic and will be replaced with proper JWT authentication in Milestone 6.

2. **Session Storage**: Admin secret is stored in `sessionStorage` (not `localStorage`), so it's cleared when the browser tab closes.

3. **No Indexing**: Admin pages have `robots: { index: false, follow: false }` to prevent search engine indexing.

4. **Rate Limiting**: All admin endpoints inherit the global rate limiting (100 requests/minute per IP).

5. **Header-based Auth**: Using `X-Admin-Secret` header instead of query parameters prevents the secret from appearing in logs or browser history.

## Bug Fixes

### December 13, 2025

Fixed three bugs in the admin products page:

1. **Double Toast on Product Creation**
   - **Issue**: Two toasts appeared in different positions (bottom-left and bottom-right)
   - **Cause**: Admin layout had its own `<Toaster />` component while root layout already had one
   - **Fix**: Removed duplicate Toaster from admin layout (`app/admin/layout.tsx`)

2. **Stock Showing as 0**
   - **Issue**: Stock value entered (e.g., 3) was reflected as 0
   - **Cause**: Form values weren't being explicitly converted to numbers
   - **Fix**: Added explicit `Number()` conversion for price and stock in payload

3. **Product Not Removed After Deletion (Admin List)**
   - **Issue**: Deleted products remained visible in the admin product list
   - **Cause**: Next.js was caching GET requests, returning stale data
   - **Fix**: Added `cache: 'no-store'` to admin API fetch requests

4. **Product Not Removed After Deletion (Public Store)**
   - **Issue**: Deleted products still appeared in the public products page
   - **Cause**: Public products API uses `revalidate: 3600` (1 hour cache)
   - **Fix**: Created server action to revalidate products cache after mutations
   - **Note**: Uses Next.js 16's `revalidateTag(tag, 'max')` for SWR behavior

**Files Modified:**

- `frontend/app/admin/layout.tsx` - Removed duplicate Toaster component
- `frontend/lib/admin-api.ts` - Added `cache: 'no-store'` to prevent caching
- `frontend/app/admin/products/page.tsx` - Added submission refs, number conversion, and cache revalidation
- `frontend/app/actions/revalidate.ts` - New server action for cache revalidation

## Testing

To test the admin panel:

1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3000/admin`
4. Enter the admin secret from your `.env` file
5. Explore Dashboard, Products, and Orders

## Next Steps (Milestone 6)

- Replace simple auth with JWT-based authentication
- Add user registration and login
- Implement role-based access control (User/Admin)
- Associate orders with user accounts
- Add protected routes for user-specific pages
