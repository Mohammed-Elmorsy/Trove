# Mobile App Architecture

This document describes the React Native/Expo mobile app architecture for Trove.

## Overview

The mobile app is built with **Expo SDK 54** and **Expo Router** for file-based navigation. It connects to the same NestJS backend API as the web frontend, providing a consistent user experience across platforms.

## Project Structure

```
mobile/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation group
│   │   ├── _layout.tsx      # Tab layout configuration
│   │   ├── index.tsx        # Products screen (Home)
│   │   └── cart.tsx         # Cart screen
│   ├── product/
│   │   └── [id].tsx         # Product detail screen (dynamic route)
│   ├── _layout.tsx          # Root layout with providers
│   └── +not-found.tsx       # 404 screen
├── components/              # Reusable UI components
│   ├── ThemedView.tsx       # Theme-aware View
│   ├── ThemedText.tsx       # Theme-aware Text
│   ├── ProductCard.tsx      # Product grid card
│   ├── CategoryFilter.tsx   # Category filter chips
│   ├── SearchBar.tsx        # Product search input
│   ├── PriceFilter.tsx      # Price range filter (modal)
│   ├── LoadMoreButton.tsx   # Load more products button
│   ├── LoadingSpinner.tsx   # Loading indicator
│   └── ErrorMessage.tsx     # Error display with retry
├── context/
│   └── CartContext.tsx      # Global cart state management
├── hooks/
│   ├── useSession.ts        # Session ID management
│   ├── useColorScheme.ts    # Color scheme detection
│   └── useThemeColor.ts     # Theme color utilities
├── lib/
│   └── api.ts               # API client (shared with web)
├── constants/
│   ├── config.ts            # API configuration
│   └── Colors.ts            # Theme colors
└── assets/                  # Images, fonts, etc.
```

## Technology Stack

### Core

| Package      | Version  | Purpose               |
| ------------ | -------- | --------------------- |
| expo         | ~54.0.27 | Expo SDK              |
| expo-router  | ~6.0.17  | File-based navigation |
| react        | 19.1.0   | UI library            |
| react-native | 0.81.5   | Native runtime        |

### Navigation & UI

| Package                        | Version | Purpose                  |
| ------------------------------ | ------- | ------------------------ |
| @react-navigation/native       | ^7.1.8  | Navigation primitives    |
| react-native-screens           | ~4.16.0 | Native screen components |
| react-native-safe-area-context | ~5.6.0  | Safe area handling       |
| react-native-reanimated        | ~4.1.1  | Animations               |

### Storage & Utilities

| Package                                   | Version  | Purpose                   |
| ----------------------------------------- | -------- | ------------------------- |
| @react-native-async-storage/async-storage | ^2.2.0   | Local storage for session |
| @expo/vector-icons                        | ^15.0.3  | Icon library              |
| expo-font                                 | ~14.0.10 | Custom fonts              |
| expo-splash-screen                        | ~31.0.12 | Splash screen             |

## Shared Types Package

The mobile app uses shared TypeScript types from `@trove/shared`:

```typescript
// Types available from @trove/shared
import {
  Product,
  ProductsResponse,
  ProductQuery,
  Category,
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@trove/shared';
```

### Integration

The shared package is linked in `mobile/package.json`:

```json
{
  "dependencies": {
    "@trove/shared": "file:../shared"
  }
}
```

And configured in `mobile/tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@trove/shared": ["../shared"],
      "@trove/shared/*": ["../shared/*"]
    }
  },
  "include": ["../shared/**/*.ts"]
}
```

## Navigation Structure

The app uses Expo Router with file-based routing:

```
/              → (tabs)/index.tsx     (Products screen)
/cart          → (tabs)/cart.tsx      (Cart screen)
/product/[id]  → product/[id].tsx     (Product detail)
```

### Tab Navigation

- **Products Tab**: Grid view of products with category filtering
- **Cart Tab**: Shopping cart with item management and summary

### Stack Navigation

- Product detail pages are pushed onto the stack from the Products tab

## State Management

### Cart State (CartContext)

Global cart state using React Context:

```typescript
interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}
```

### Session Management

Session ID is stored in AsyncStorage:

```typescript
// useSession hook
const { sessionId, isLoading, clearSession } = useSession();
```

- Generates UUID-like session ID on first launch
- Persists across app restarts
- Used for guest cart functionality

## API Communication

The mobile app shares API patterns with the web frontend:

```typescript
// lib/api.ts
const API_BASE_URL = 'http://localhost:4000'; // Development

// Products
getProducts(query: ProductQuery): Promise<ProductsResponse>
getProduct(id: string): Promise<Product>
getCategories(): Promise<Category[]>

// Cart
getCart(sessionId: string): Promise<Cart>
addToCart(data: AddToCartRequest): Promise<CartItem>
updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<CartItem>
removeCartItem(itemId: string): Promise<{ message: string }>
clearCart(sessionId: string): Promise<{ message: string }>
```

## Theming

### Color System

The app supports light and dark mode with consistent colors:

```typescript
// constants/Colors.ts
export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#fff',
    tint: '#2563eb', // Blue-600
    border: '#e4e4e7',
    // ...
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#151718',
    tint: '#60a5fa', // Blue-400
    border: '#27272a',
    // ...
  },
};
```

### Themed Components

Use themed components for consistent styling:

```tsx
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

function MyComponent() {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView>
      <ThemedText type="title">Hello</ThemedText>
    </ThemedView>
  );
}
```

### Modern UI Styling

The ProductCard component features modern design patterns:

- **Rounded corners**: Card (16px) and inset image container (12px)
- **Platform shadows**: iOS shadowColor/offset, Android elevation, Web boxShadow
- **Press animation**: Scale down to 0.98 on press for tactile feedback
- **Category badges**: Pill-shaped with subtle tinted background
- **Stock overlay badges**: Positioned on image with amber (low stock) or red (out of stock)
- **Responsive grid**: FlatList with flex-based card wrappers for consistent sizing

## Development

### Running the App

```bash
cd mobile

# Start Expo development server
npm start

# Platform-specific
npm run android  # Android emulator
npm run ios      # iOS simulator (macOS only)
npm run web      # Web browser
```

### Connecting to Backend

For physical devices, configure your machine's IP in the `.env` file:

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update `API_URL` with your machine's IP:

   ```env
   API_URL=http://192.168.x.x:4000
   ```

3. Also update the backend's `ALLOWED_ORIGINS` in `backend/.env`:

   ```env
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081,http://192.168.x.x:8081
   ```

4. Restart both the backend and Expo servers:
   ```bash
   # Clear Expo cache to pick up env changes
   npx expo start --clear
   ```

## Features Implemented

### Milestone 1 - Products Display

- [x] Product grid view with 2 columns
- [x] Product cards with image, name, price, category
- [x] Pull-to-refresh functionality
- [x] Loading and error states

### Milestone 2 - UI/UX Polish

- [x] Category filter chips (horizontal scroll)
- [x] Dark/light mode support
- [x] Responsive layouts
- [x] Navigation with back buttons
- [x] Search bar with real-time input
- [x] Price range filter (modal with min/max inputs)
- [x] "Load More" button pattern (mobile-optimized alternative to pagination)

### Milestone 3 - Shopping Cart

- [x] Cart screen with item list
- [x] Add to cart from product detail
- [x] Quantity controls (+/- buttons)
- [x] Remove item with confirmation
- [x] Cart badge on tab icon
- [x] Cart summary with subtotal
- [x] Empty cart state with CTA
- [x] Session-based cart (AsyncStorage)

## Future Milestones

The mobile app will implement upcoming features in parallel with the web frontend:

- **Milestone 4**: Checkout flow with payment integration
- **Milestone 5**: User authentication and profiles
- **Milestone 6**: Order history and tracking
- **Milestone 7**: Push notifications
- **Milestone 8**: Offline support

## Best Practices

### Performance

- Use `FlatList` for product lists with proper `keyExtractor`
- Implement image caching for product images
- Use `React.memo` for expensive components
- Minimize re-renders with proper dependency arrays

### Code Organization

- Keep components small and focused
- Use TypeScript for type safety
- Share types between web and mobile via `@trove/shared`
- Follow Expo Router conventions for navigation

### Error Handling

- Display user-friendly error messages
- Provide retry functionality
- Handle network errors gracefully
- Use loading states for async operations

---

**Last Updated**: December 8, 2025
**Expo SDK Version**: 54
**React Native Version**: 0.81.5
