import type { Order, OrderResponse, ShippingAddress } from '@trove/shared';
import { API_BASE_URL, DEFAULT_TIMEOUT, fetchWithTimeout } from './client';

/**
 * Create a new order from cart
 */
export async function createOrder(
  sessionId: string,
  shippingAddress: ShippingAddress,
  accessToken?: string
): Promise<OrderResponse> {
  const url = `${API_BASE_URL}/orders`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Include authorization header if user is authenticated
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers,
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

/**
 * Get order by ID
 */
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

/**
 * Get all orders by email address
 */
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

/**
 * Get orders for authenticated user
 */
export async function getUserOrders(accessToken: string): Promise<Order[]> {
  const url = `${API_BASE_URL}/orders/my-orders`;

  try {
    const res = await fetchWithTimeout(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 401
          ? 'Please sign in to view your orders'
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
