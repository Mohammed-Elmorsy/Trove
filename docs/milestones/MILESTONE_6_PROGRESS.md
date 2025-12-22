# Milestone 6: User Authentication & Authorization - Progress Report

## Overview

**Status**: ✅ Complete
**Completion Date**: December 14, 2025

Milestone 6 implements a full JWT-based authentication system with access and refresh tokens across web (Next.js) and mobile (React Native/Expo) platforms. The system supports user registration, login, profile management, order history, cart merging on login, and role-based access control.

## Key Features Implemented

### Authentication Flow

- **Access Token**: 15-minute expiry, stored in memory only (more secure)
- **Refresh Token**: 7-day expiry, stored in localStorage (web) or SecureStore (mobile)
- **Token Rotation**: New refresh token issued on each refresh request
- **Auto-refresh**: Tokens refresh automatically 1 minute before expiry
- **Session Restore**: User session restored on app load if valid refresh token exists

### Cart Merge on Login

When a user logs in with an existing guest cart (identified by sessionId):

1. Guest cart items are transferred to the user's cart
2. If user already has items, quantities are combined
3. Guest cart is deleted after merge
4. User is notified of successful merge

### Role-Based Access Control

- **USER**: Default role for registered users
- **ADMIN**: Can access admin panel, manage products and orders
- Admin panel now uses JWT authentication instead of X-Admin-Secret header

## Technical Implementation

### Backend (NestJS)

#### New Dependencies

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### Database Schema Changes

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String
  name          String
  role          Role           @default(USER)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  cart          Cart?
  orders        Order[]
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(...)
}

// Cart - added optional userId
model Cart {
  sessionId String?  @unique
  userId    String?  @unique
  user      User?    @relation(...)
}

// Order - added optional userId
model Order {
  userId String?
  user   User?   @relation(...)
}
```

#### Auth Module Structure

```
backend/src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   └── jwt.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── optional-jwt-auth.guard.ts
├── decorators/
│   ├── roles.decorator.ts
│   ├── current-user.decorator.ts
│   └── public.decorator.ts
└── dto/
    ├── register.dto.ts
    ├── login.dto.ts
    └── refresh-token.dto.ts
```

#### API Endpoints

| Method | Endpoint       | Description               | Auth |
| ------ | -------------- | ------------------------- | ---- |
| POST   | /auth/register | Register new user         | No   |
| POST   | /auth/login    | Login (accepts sessionId) | No   |
| POST   | /auth/refresh  | Refresh tokens            | No   |
| POST   | /auth/logout   | Invalidate refresh token  | Yes  |
| GET    | /auth/profile  | Get current user          | Yes  |
| PATCH  | /auth/profile  | Update profile            | Yes  |
| GET    | /auth/orders   | Get user's order history  | Yes  |

### Frontend (Next.js)

#### New Files

```
frontend/
├── types/auth.ts
├── lib/api/auth.ts
├── lib/validations/auth.ts
├── components/providers/auth-provider.tsx
├── app/auth/
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
└── app/(store)/account/
    ├── layout.tsx
    ├── page.tsx (redirects to profile)
    ├── profile/page.tsx
    └── orders/page.tsx
```

#### AuthProvider Features

- Stores refresh token in localStorage (`trove_refresh_token`)
- Stores access token in React state (memory)
- Auto-refresh 1 minute before expiry
- Restores session on mount
- Exposes: `user`, `isAuthenticated`, `isLoading`, `accessToken`, `login`, `register`, `logout`, `updateUser`

#### Updated Components

- **Navbar**: Shows user dropdown when authenticated, login/register buttons when not
- **AdminProvider**: Uses JWT role check instead of secret-based auth
- **Admin API**: All functions now accept accessToken parameter

### Mobile (React Native/Expo)

#### New Dependencies

```bash
npx expo install expo-secure-store
```

#### New Files

```
mobile/
├── lib/api/auth.ts
├── context/AuthContext.tsx
├── app/auth/
│   ├── login.tsx
│   └── register.tsx
└── app/(tabs)/profile.tsx
```

#### AuthContext Features

- Stores refresh token in expo-secure-store
- Stores access token in React state (memory)
- Same refresh logic as web
- Exposes: `user`, `isAuthenticated`, `isLoading`, `accessToken`, `login`, `register`, `logout`, `updateUser`

#### Profile Tab

- Guest view: Login/Register buttons
- Authenticated view: User info, edit profile, order history link, logout

## Environment Variables

Added to `.env`:

```env
JWT_SECRET="your-jwt-secret-min-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-characters-long"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
```

## Admin User

Seeded admin user for testing:

- **Email**: admin@trove.com
- **Password**: Admin123!
- **Role**: ADMIN

## Security Considerations

- bcrypt password hashing with cost factor 12
- Access tokens short-lived (15 min)
- Refresh tokens stored securely (SecureStore on mobile)
- Token rotation prevents replay attacks
- JWT payload includes only userId and role
- Passwords never returned in API responses

## Testing

1. **Register**: Create new user at /auth/register
2. **Login**: Sign in at /auth/login
3. **Cart Merge**: Add items as guest, then login to see merge
4. **Admin Access**: Login with admin@trove.com to access admin panel
5. **Profile**: View and edit profile at /account/profile
6. **Order History**: View orders at /account/orders
7. **Mobile**: Test all above on mobile app

## Files Changed Summary

### Backend

- `prisma/schema.prisma` - User, RefreshToken models, Cart/Order updates
- `src/config/validation.schema.ts` - JWT env validation
- `src/config/app.config.ts` - JWT config
- `src/auth/*` - New auth module
- `src/cart/*` - User cart support
- `src/orders/*` - User orders support
- `src/admin/admin.controller.ts` - JWT auth guard
- `prisma/seed.ts` - Admin user seed

### Frontend

- `types/auth.ts` - Auth types
- `lib/api/auth.ts` - Auth API functions
- `lib/validations/auth.ts` - Zod schemas
- `components/providers/auth-provider.tsx` - Auth context
- `components/providers/admin-provider.tsx` - JWT role check
- `components/layout/navbar.tsx` - Auth state UI
- `lib/admin-api.ts` - JWT Bearer auth
- `app/auth/*` - Auth pages
- `app/(store)/account/*` - Account pages
- `app/admin/*` - Updated for JWT auth

### Mobile

- `app.config.ts` - expo-secure-store plugin
- `lib/api/auth.ts` - Auth API functions
- `context/AuthContext.tsx` - Auth context
- `app/auth/*` - Auth screens
- `app/(tabs)/profile.tsx` - Profile tab
- `app/(tabs)/_layout.tsx` - Profile tab added
- `app/_layout.tsx` - Auth screens + AuthProvider
- `constants/Colors.ts` - New color properties

## Bug Fixes (December 22, 2025)

### 1. Orders Tab Loading State Bug (Complete Rewrite)

**Issue**: Loading indicator was "continuously shown intersected with the layout" - the loading spinner and content were displaying simultaneously.

**Root Causes**:

1. FlatList with `contentContainerStyle: { flexGrow: 1 }` doesn't work properly - FlatList handles content container differently than ScrollView
2. Complex conditional rendering with `orders === null` checks led to inconsistent states
3. Using refs to prevent duplicate fetches caused issues with component lifecycle
4. `ListEmptyComponent` with flex layouts inside FlatList caused layout problems

**Fix**: Complete rewrite using simpler patterns:

- **Switched from FlatList to ScrollView** with simple `.map()` for rendering orders
- Used simple `LoadingState` type: `'idle' | 'loading' | 'refreshing' | 'searching'`
- Clear boolean flags: `hasSearched`, `hasLoadedUserOrders`
- Simple conditional rendering at the component level (not inside FlatList)
- RefreshControl properly integrated with ScrollView
- Removed complex refs and useCallback patterns

### 2. Keyboard Hiding Input Fields on Checkout (Complete Rewrite)

**Issue**: Multiple problems - inputs hidden behind keyboard, button shifting incorrectly, measureLayout API failures.

**Root Causes**:

1. `behavior='height'` on Android causes view to shrink unpredictably
2. `measureLayout` with `findNodeHandle` is unreliable across React Native versions
3. Complex ref management for inputs added unnecessary complexity
4. Absolute positioned footer conflicted with KeyboardAvoidingView

**Fix**: Simplified approach:

- **Removed all `measureLayout` and `findNodeHandle` code** - unreliable
- **Removed all input refs** - not needed for basic keyboard handling
- Use `behavior='padding'` on iOS only, `undefined` on Android (let Android handle it natively)
- Set `keyboardVerticalOffset={100}` on iOS to account for navigation header
- Button is simply inside ScrollView with proper bottom padding
- Added `paddingBottom: Math.max(insets.bottom, 16) + 16` to ensure content scrolls above keyboard

### 3. Orders Not Showing in Order History

**Issue**: Authenticated users couldn't see their orders in Profile > Order History or Orders tab.

**Root Causes**:

1. `getUserOrders` function was missing from mobile API
2. `createOrder` was not sending the access token, so orders weren't associated with users

**Fixes**:

- Added `getUserOrders(accessToken)` function in `lib/api/orders.ts`
- Updated `createOrder` to accept optional `accessToken` parameter and include Authorization header
- Exported `getUserOrders` from `lib/api/index.ts`

### 4. Refresh Token Unique Constraint Error

**Issue**: Sign-in would fail with "Unique constraint failed on the fields: (`token`)" error.

**Root Cause**: JWT tokens could be identical when signed with the same payload at the same timestamp, causing duplicate token insertion.

**Fix**: Added unique `jti` (JWT ID) claim using `crypto.randomUUID()` to both access and refresh tokens in `auth.service.ts:generateTokens()`:

```typescript
const accessJti = crypto.randomUUID();
const refreshJti = crypto.randomUUID();
```

### 5. Keyboard Handling - Final Solution (react-native-keyboard-aware-scroll-view)

**Issue**: Native `KeyboardAvoidingView` has significant limitations:

- `behavior='height'` on Android causes view to shrink unpredictably
- `behavior='padding'` on Android doesn't work reliably
- Buttons shift down and intersect with mobile navigation buttons
- Input fields still hidden behind keyboard in many cases

**Final Solution**: Installed `react-native-keyboard-aware-scroll-view` library which handles all edge cases automatically.

```bash
npm install react-native-keyboard-aware-scroll-view
```

**Implementation Pattern**:

```tsx
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={[styles.container, { backgroundColor: colors.background }]}>
  <KeyboardAwareScrollView
    contentContainerStyle={[
      styles.scrollContent,
      { paddingBottom: Math.max(insets.bottom, 16) + 16 },
    ]}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
    keyboardOpeningTime={0}
  >
    {/* Form content */}
  </KeyboardAwareScrollView>
</View>;
```

**Key Props**:

- `enableOnAndroid={true}` - Essential for Android keyboard handling
- `enableAutomaticScroll={true}` - Auto-scrolls to focused input
- `keyboardOpeningTime={0}` - Instant scroll (no delay)
- `extraScrollHeight` - Additional padding when keyboard opens (iOS)

**Applied to**:

- `login.tsx` - Login screen
- `register.tsx` - Registration screen
- `checkout.tsx` - Checkout form

### 6. Android Bottom Padding Fix (SafeAreaView with edges)

**Issue**: Buttons at bottom of screens ("Place Order", "Continue Shopping") were cut off or intersecting with Android system navigation buttons. `insets.bottom` from `useSafeAreaInsets` returns 0 on Android/Expo Go.

**Root Cause**: Android handles navigation bars differently than iOS. The `useSafeAreaInsets` hook doesn't properly account for the Android system navigation bar, especially when running in Expo Go.

**Fix**: Use `SafeAreaView` component with explicit `edges={['bottom']}` prop instead of manual padding calculations:

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

// DON'T use useSafeAreaInsets() with manual padding
// DO use SafeAreaView with edges prop:

<SafeAreaView style={[styles.container, { backgroundColor }]} edges={['bottom']}>
  <ScrollView contentContainerStyle={styles.scrollContent}>{/* Content */}</ScrollView>
</SafeAreaView>;
```

**Why this works**:

- `SafeAreaView` with `edges={['bottom']}` properly handles the Android navigation bar
- It only applies safe area padding to the bottom edge (header is handled by Stack navigator)
- Works correctly in Expo Go on Android

**Applied to all screens with bottom buttons**:

- `checkout.tsx` - Wrapped with SafeAreaView edges={['bottom']}
- `order/[id].tsx` - Wrapped with SafeAreaView edges={['bottom']}
- `auth/login.tsx` - Wrapped with SafeAreaView edges={['bottom']}
- `auth/register.tsx` - Wrapped with SafeAreaView edges={['bottom']}

### Key Lessons Learned

1. **FlatList ≠ ScrollView for layout**: Don't use `flexGrow: 1` in FlatList's contentContainerStyle
2. **Avoid `measureLayout`**: It's unreliable - use proper padding instead
3. **Use `react-native-keyboard-aware-scroll-view`**: Native KeyboardAvoidingView has too many edge cases, especially on Android
4. **Simple state > Complex refs**: Boolean flags are more reliable than refs for preventing duplicate fetches
5. **Use SafeAreaView with edges prop, not useSafeAreaInsets**: On Android, `useSafeAreaInsets().bottom` returns 0. Instead, use `<SafeAreaView edges={['bottom']}>` which properly handles the Android navigation bar
6. **Keep buttons inside ScrollView**: Avoid absolute positioning in forms

### Files Changed

- `mobile/package.json` - Added `react-native-keyboard-aware-scroll-view`
- `mobile/app/checkout.tsx` - KeyboardAwareScrollView, safe area insets
- `mobile/app/(tabs)/orders.tsx` - Complete rewrite: ScrollView instead of FlatList, simple state
- `mobile/app/auth/login.tsx` - KeyboardAwareScrollView, safe area insets
- `mobile/app/auth/register.tsx` - KeyboardAwareScrollView, safe area insets
- `mobile/app/order/[id].tsx` - Safe area insets for button position
- `mobile/lib/api/orders.ts` - Added `getUserOrders`, updated `createOrder`
- `mobile/lib/api/index.ts` - Export `getUserOrders`
- `backend/src/auth/auth.service.ts` - Added unique jti to tokens
