// Re-export all API functions for backward compatibility
// Allows: import { getProducts, getCart } from '@/lib/api'

// Client utilities
export { API_BASE_URL, DEFAULT_TIMEOUT, fetchWithTimeout } from './client';

// Products API
export { getProducts, getProduct, getCategories } from './products';

// Cart API
export { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from './cart';

// Orders API
export { createOrder, getOrder, getOrdersByEmail, getUserOrders } from './orders';

// Auth API
export * from './auth';
