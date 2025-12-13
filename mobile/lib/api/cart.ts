import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@trove/shared';
import { API_BASE_URL, DEFAULT_TIMEOUT, fetchWithTimeout } from './client';

/**
 * Get cart by session ID
 */
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

/**
 * Add item to cart
 */
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

/**
 * Update cart item quantity
 */
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

/**
 * Remove item from cart
 */
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

/**
 * Clear all items from cart
 */
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
