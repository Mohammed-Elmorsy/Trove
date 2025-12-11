import {
  Product,
  ProductsResponse,
  ProductQuery,
  Category,
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  Order,
  OrderResponse,
  ShippingAddress,
} from '@trove/shared';
import { API_BASE_URL, DEFAULT_TIMEOUT } from '@/constants/config';

// Helper function to create fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout: The server took too long to respond');
    }
    throw error;
  }
}

// Products API
export async function getProducts(query: ProductQuery = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (query.search) params.append('search', query.search);
  if (query.categoryId) params.append('categoryId', query.categoryId);
  if (query.minPrice !== undefined) params.append('minPrice', query.minPrice.toString());
  if (query.maxPrice !== undefined) params.append('maxPrice', query.maxPrice.toString());
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());

  const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const res = await fetchWithTimeout(url, {
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Products not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch products: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    throw new Error('Failed to fetch products: Unknown error occurred');
  }
}

export async function getProduct(id: string): Promise<Product> {
  const url = `${API_BASE_URL}/products/${id}`;

  try {
    const res = await fetchWithTimeout(url, {
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Product not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch product: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
    throw new Error('Failed to fetch product: Unknown error occurred');
  }
}

export async function getCategories(): Promise<Category[]> {
  const url = `${API_BASE_URL}/products/categories`;

  try {
    const res = await fetchWithTimeout(url, {
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Categories not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch categories: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    throw new Error('Failed to fetch categories: Unknown error occurred');
  }
}

// Cart API
export async function getCart(sessionId: string): Promise<Cart> {
  const url = `${API_BASE_URL}/cart/${sessionId}`;

  try {
    const res = await fetchWithTimeout(url, {
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Cart not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch cart: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch cart: ${error.message}`);
    }
    throw new Error('Failed to fetch cart: Unknown error occurred');
  }
}

export async function addToCart(data: AddToCartRequest): Promise<CartItem> {
  const url = `${API_BASE_URL}/cart/items`;

  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        (res.status === 400
          ? 'Invalid request. Please check your input.'
          : res.status === 404
            ? 'Product not found'
            : res.status >= 500
              ? 'Server error. Please try again later.'
              : `Failed to add to cart: ${res.statusText}`);
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to add to cart: Unknown error occurred');
  }
}

export async function updateCartItem(
  itemId: string,
  data: UpdateCartItemRequest
): Promise<CartItem> {
  const url = `${API_BASE_URL}/cart/items/${itemId}`;

  try {
    const res = await fetchWithTimeout(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        (res.status === 400
          ? 'Invalid quantity'
          : res.status === 404
            ? 'Cart item not found'
            : res.status >= 500
              ? 'Server error. Please try again later.'
              : `Failed to update cart: ${res.statusText}`);
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update cart: Unknown error occurred');
  }
}

export async function removeCartItem(itemId: string): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/cart/items/${itemId}`;

  try {
    const res = await fetchWithTimeout(url, {
      method: 'DELETE',
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Cart item not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to remove item: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove item: ${error.message}`);
    }
    throw new Error('Failed to remove item: Unknown error occurred');
  }
}

export async function clearCart(sessionId: string): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/cart/${sessionId}`;

  try {
    const res = await fetchWithTimeout(url, {
      method: 'DELETE',
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status >= 500
          ? 'Server error. Please try again later.'
          : `Failed to clear cart: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
    throw new Error('Failed to clear cart: Unknown error occurred');
  }
}

// Order API functions
export async function createOrder(
  sessionId: string,
  shippingAddress: ShippingAddress
): Promise<OrderResponse> {
  const url = `${API_BASE_URL}/orders`;

  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, shippingAddress }),
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        (res.status === 400
          ? 'Invalid order data. Please check your input.'
          : res.status === 404
            ? 'Cart is empty or not found'
            : res.status >= 500
              ? 'Server error. Please try again later.'
              : `Failed to create order: ${res.statusText}`);
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create order: Unknown error occurred');
  }
}

export async function getOrder(id: string): Promise<Order> {
  const url = `${API_BASE_URL}/orders/${id}`;

  try {
    const res = await fetchWithTimeout(url, {
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Order not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch order: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
    throw new Error('Failed to fetch order: Unknown error occurred');
  }
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const url = `${API_BASE_URL}/orders?email=${encodeURIComponent(email)}`;

  try {
    const res = await fetchWithTimeout(url, {
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 400
          ? 'Please provide a valid email address'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch orders: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
    throw new Error('Failed to fetch orders: Unknown error occurred');
  }
}
