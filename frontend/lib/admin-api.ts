import type {
  DashboardStats,
  AdminOrdersResponse,
  AdminOrderQuery,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/admin';
import type { Product, ProductsResponse, ProductQuery, Category } from '@/types/product';
import type { Order, OrderStatus } from '@/types/order';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const DEFAULT_TIMEOUT = 10000;

// Helper to get admin secret from storage
function getAdminSecret(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('admin_secret');
}

// Helper for admin fetch with auth header
async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const adminSecret = getAdminSecret();
  if (!adminSecret) {
    throw new Error('Not authenticated');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      cache: 'no-store', // Prevent caching to ensure fresh data after mutations
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': adminSecret,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      sessionStorage.removeItem('admin_secret');
      throw new Error('Invalid admin credentials');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// ==================
// Dashboard
// ==================

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await adminFetch(`${API_BASE_URL}/admin/dashboard/stats`);
  return res.json();
}

// ==================
// Products
// ==================

export async function getAdminProducts(query: ProductQuery = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.search) params.append('search', query.search);
  if (query.categoryId) params.append('categoryId', query.categoryId);

  const res = await adminFetch(
    `${API_BASE_URL}/admin/products${params.toString() ? `?${params}` : ''}`
  );
  return res.json();
}

export async function getAdminProduct(id: string): Promise<Product> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products/${id}`);
  return res.json();
}

export async function getAdminCategories(): Promise<Category[]> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products/categories`);
  return res.json();
}

export async function createProduct(data: CreateProductRequest): Promise<Product> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  await adminFetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'DELETE',
  });
}

// ==================
// Orders
// ==================

export async function getAdminOrders(query: AdminOrderQuery = {}): Promise<AdminOrdersResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.status) params.append('status', query.status);

  const res = await adminFetch(
    `${API_BASE_URL}/admin/orders${params.toString() ? `?${params}` : ''}`
  );
  return res.json();
}

export async function getAdminOrder(id: string): Promise<Order> {
  const res = await adminFetch(`${API_BASE_URL}/admin/orders/${id}`);
  return res.json();
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const res = await adminFetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.json();
}

// ==================
// Auth Helpers
// ==================

export async function validateAdminSecret(secret: string): Promise<boolean> {
  try {
    sessionStorage.setItem('admin_secret', secret);
    await getDashboardStats();
    return true;
  } catch {
    sessionStorage.removeItem('admin_secret');
    return false;
  }
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminSecret();
}

export function logoutAdmin(): void {
  sessionStorage.removeItem('admin_secret');
}
