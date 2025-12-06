# Milestone 3: Shopping Cart - Progress Report

**Status**: Complete
**Completion Date**: December 6, 2025

## Overview

Implemented a session-based shopping cart system allowing users to add products, manage quantities, view cart totals, and navigate through a cart page.

## Architecture Decision

### Cart State Management

**Approach: Hybrid (localStorage + Backend API)**

- **Frontend**: localStorage for session ID persistence + `useCart` hook + React Context
- **Backend**: Session-based cart storage in PostgreSQL for persistence and validation
- **Sync**: Frontend sends cart operations to backend API for server-side validation

This provides:

- Instant UI feedback (optimistic updates)
- Server-side validation (stock checks, price verification)
- Cart persistence across browser sessions (via session ID)

---

## Backend Implementation

### Database Schema

Added two new models to Prisma schema:

```prisma
model Cart {
  id        String     @id @default(uuid())
  sessionId String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  items     CartItem[]

  @@map("carts")
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
  @@index([cartId])
  @@index([productId])
  @@map("cart_items")
}
```

Also added `cartItems CartItem[]` relation to the Product model.

### Cart Module Structure

```
backend/src/cart/
├── cart.module.ts
├── cart.controller.ts
├── cart.service.ts
└── dto/
    ├── add-to-cart.dto.ts
    ├── update-cart-item.dto.ts
    ├── cart-session.dto.ts
    └── cart-item-id.dto.ts
```

### API Endpoints

| Method | Endpoint              | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| GET    | `/cart/:sessionId`    | Get cart with items and product details   |
| POST   | `/cart/items`         | Add item to cart (creates cart if needed) |
| PATCH  | `/cart/items/:itemId` | Update item quantity                      |
| DELETE | `/cart/items/:itemId` | Remove item from cart                     |
| DELETE | `/cart/:sessionId`    | Clear entire cart                         |

### Service Features

- **getCart()**: Fetch cart with items, includes product data, calculates totals
- **addItem()**: Upserts cart item (increments quantity if exists), validates stock
- **updateQuantity()**: Updates item quantity with stock validation
- **removeItem()**: Deletes cart item
- **clearCart()**: Deletes cart and all items (cascade)

### Validation

DTOs use class-validator for:

- UUID validation for sessionId, productId, itemId
- Quantity validation (min: 1, max: 99)
- Stock validation in service layer

---

## Frontend Implementation

### Types

**File:** `frontend/types/cart.ts`

```typescript
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string | null;
  sessionId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}
```

### Cart Context & Hook

**Files:**

- `frontend/components/providers/cart-provider.tsx` - React Context Provider
- `frontend/lib/hooks/use-cart.ts` - Custom hook

Features:

- `cart`: Current cart state
- `isLoading`: Loading state
- `error`: Error state
- `addItem(productId, quantity)`: Add to cart with stock validation
- `updateQuantity(itemId, quantity)`: Update item quantity
- `removeItem(itemId)`: Remove from cart
- `clearCart()`: Clear all items
- `itemCount`: Total items in cart
- `refreshCart()`: Manual refresh

Session ID is generated using `uuid` and stored in localStorage.

### Components Created

| Component       | Location                                     | Description                          |
| --------------- | -------------------------------------------- | ------------------------------------ |
| CartProvider    | `components/providers/cart-provider.tsx`     | React Context for cart state         |
| AddToCartButton | `components/products/add-to-cart-button.tsx` | Quantity selector + add to cart      |
| CartBadge       | `components/layout/cart-badge.tsx`           | Navbar cart icon with item count     |
| CartItem        | `components/cart/cart-item.tsx`              | Individual cart item with controls   |
| CartSummary     | `components/cart/cart-summary.tsx`           | Order summary with subtotal/shipping |
| EmptyCart       | `components/cart/empty-cart.tsx`             | Empty cart state with CTA            |

### Pages Created

| Page    | Location               | Description                      |
| ------- | ---------------------- | -------------------------------- |
| Cart    | `app/cart/page.tsx`    | Cart page with items and summary |
| Loading | `app/cart/loading.tsx` | Skeleton loader                  |
| Error   | `app/cart/error.tsx`   | Error boundary with retry        |

### UI Features

1. **AddToCartButton**:
   - Simple +/- quantity buttons with number display
   - Loading state during API call
   - **Dual feedback**: Toast notification AND "Added!" button state
   - Disabled when out of stock
   - Shows "Only X left" warning for low stock

2. **Cart Page**:
   - List of cart items with product images and details
   - Quantity controls (+/- buttons) per item
   - Remove item button
   - Clear cart button
   - Order summary (subtotal, shipping, total)
   - Free shipping threshold ($50)
   - Continue Shopping link
   - Proceed to Checkout button (disabled - Milestone 4)

3. **CartBadge**:
   - Cart icon in navbar
   - Badge with item count (shows 99+ for large counts)
   - Links to cart page

### Toast Notifications

Installed `sonner` via Shadcn for toast notifications:

- "Added to cart!" with product name and quantity
- "Item removed from cart"
- "Cart cleared"
- Error messages for failed operations

---

## Files Created/Modified

### Backend (Created)

- `backend/src/cart/cart.module.ts`
- `backend/src/cart/cart.controller.ts`
- `backend/src/cart/cart.service.ts`
- `backend/src/cart/dto/add-to-cart.dto.ts`
- `backend/src/cart/dto/update-cart-item.dto.ts`
- `backend/src/cart/dto/cart-session.dto.ts`
- `backend/src/cart/dto/cart-item-id.dto.ts`

### Backend (Modified)

- `backend/prisma/schema.prisma` - Added Cart, CartItem models
- `backend/src/app.module.ts` - Registered CartModule

### Frontend (Created)

- `frontend/types/cart.ts`
- `frontend/lib/hooks/use-cart.ts`
- `frontend/components/providers/cart-provider.tsx`
- `frontend/components/products/add-to-cart-button.tsx`
- `frontend/components/layout/cart-badge.tsx`
- `frontend/components/cart/cart-item.tsx`
- `frontend/components/cart/cart-summary.tsx`
- `frontend/components/cart/empty-cart.tsx`
- `frontend/app/cart/page.tsx`
- `frontend/app/cart/loading.tsx`
- `frontend/app/cart/error.tsx`

### Frontend (Modified)

- `frontend/lib/api.ts` - Added cart API functions
- `frontend/app/layout.tsx` - Added CartProvider, Toaster
- `frontend/app/products/[id]/page.tsx` - Added AddToCartButton
- `frontend/components/layout/navbar.tsx` - Added CartBadge

### New Dependencies

**Backend:**

- Prisma migration: `20251206111455_add_cart_models`

**Frontend:**

- `uuid` - Session ID generation
- `@types/uuid` - TypeScript types
- `sonner` - Toast notifications (via Shadcn)
- Shadcn components: `alert`

---

## Success Criteria - All Met!

- [x] Can add products to cart from product detail page
- [x] Cart persists across page refreshes (session-based)
- [x] Can view cart with all items and totals
- [x] Can update item quantities (+/- buttons)
- [x] Can remove individual items
- [x] Can clear entire cart
- [x] Cart icon shows item count in navbar
- [x] Empty cart shows friendly message with "Start Shopping" CTA
- [x] Stock validation prevents over-ordering
- [x] Loading and error states work correctly
- [x] Toast notifications provide feedback

---

## Known Limitations

1. **Session-based only**: Cart is tied to browser session, not user account (Milestone 6 will add user authentication)
2. **No optimistic updates**: Currently waits for server response before updating UI
3. **Checkout disabled**: "Proceed to Checkout" button is disabled, coming in Milestone 4

---

## Next Steps (Milestone 4 - Checkout & Orders)

- Design Order & OrderItem schema
- Create order endpoint from cart
- Checkout form with shipping information
- Order confirmation page
- Order lookup by email/order number
