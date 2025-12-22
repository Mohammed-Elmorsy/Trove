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

// Helper for admin fetch with JWT auth header
async function adminFetch(
  url: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  if (!accessToken) {
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
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 403) {
      throw new Error('Access denied. Admin privileges required.');
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

export async function getDashboardStats(accessToken: string): Promise<DashboardStats> {
  const res = await adminFetch(`${API_BASE_URL}/admin/dashboard/stats`, accessToken);
  return res.json();
}

// ==================
// Products
// ==================

export async function getAdminProducts(
  accessToken: string,
  query: ProductQuery = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.search) params.append('search', query.search);
  if (query.categoryId) params.append('categoryId', query.categoryId);

  const res = await adminFetch(
    `${API_BASE_URL}/admin/products${params.toString() ? `?${params}` : ''}`,
    accessToken
  );
  return res.json();
}

export async function getAdminProduct(accessToken: string, id: string): Promise<Product> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products/${id}`, accessToken);
  return res.json();
}

export async function getAdminCategories(accessToken: string): Promise<Category[]> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products/categories`, accessToken);
  return res.json();
}

export async function createProduct(
  accessToken: string,
  data: CreateProductRequest
): Promise<Product> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products`, accessToken, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(
  accessToken: string,
  id: string,
  data: UpdateProductRequest
): Promise<Product> {
  const res = await adminFetch(`${API_BASE_URL}/admin/products/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(accessToken: string, id: string): Promise<void> {
  await adminFetch(`${API_BASE_URL}/admin/products/${id}`, accessToken, {
    method: 'DELETE',
  });
}

// ==================
// Orders
// ==================

export async function getAdminOrders(
  accessToken: string,
  query: AdminOrderQuery = {}
): Promise<AdminOrdersResponse> {
  const params = new URLSearchParams();
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.status) params.append('status', query.status);

  const res = await adminFetch(
    `${API_BASE_URL}/admin/orders${params.toString() ? `?${params}` : ''}`,
    accessToken
  );
  return res.json();
}

export async function getAdminOrder(accessToken: string, id: string): Promise<Order> {
  const res = await adminFetch(`${API_BASE_URL}/admin/orders/${id}`, accessToken);
  return res.json();
}

export async function updateOrderStatus(
  accessToken: string,
  id: string,
  status: OrderStatus
): Promise<Order> {
  const res = await adminFetch(`${API_BASE_URL}/admin/orders/${id}/status`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.json();
}
