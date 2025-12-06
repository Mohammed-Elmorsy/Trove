'use client';

import { createContext, useCallback, useEffect, useState, useRef, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cart, CartItem } from '@/types/cart';
import * as api from '@/lib/api';

const SESSION_ID_KEY = 'trove_cart_session_id';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity: number) => Promise<CartItem | null>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const isInitialLoad = useRef(true);

  // Initialize session ID on mount
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
  }, []);

  // Fetch cart - only shows loading state on initial load
  const fetchCart = useCallback(
    async (showLoading = false) => {
      if (!sessionId) return;

      try {
        // Only set loading on initial load, not on background refreshes
        if (showLoading || isInitialLoad.current) {
          setIsLoading(true);
        }
        setError(null);
        const cartData = await api.getCart(sessionId);
        setCart(cartData);
        isInitialLoad.current = false;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cart');
        // Set empty cart on error
        setCart({
          id: null,
          sessionId,
          items: [],
          itemCount: 0,
          subtotal: 0,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId]
  );

  useEffect(() => {
    if (sessionId) {
      fetchCart(true); // Initial load shows loading state
    }
  }, [sessionId, fetchCart]);

  const addItem = useCallback(
    async (productId: string, quantity: number): Promise<CartItem | null> => {
      if (!sessionId) return null;

      try {
        setError(null);
        const newItem = await api.addToCart({
          sessionId,
          productId,
          quantity,
        });

        // Refresh cart to get updated totals
        await fetchCart();

        return newItem;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add item';
        setError(message);
        throw new Error(message);
      }
    },
    [sessionId, fetchCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number): Promise<void> => {
      try {
        setError(null);
        await api.updateCartItem(itemId, { quantity });
        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update quantity';
        setError(message);
        throw new Error(message);
      }
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (itemId: string): Promise<void> => {
      try {
        setError(null);
        await api.removeCartItem(itemId);
        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove item';
        setError(message);
        throw new Error(message);
      }
    },
    [fetchCart]
  );

  const clearCartAction = useCallback(async (): Promise<void> => {
    if (!sessionId) return;

    try {
      setError(null);
      await api.clearCart(sessionId);
      setCart({
        id: null,
        sessionId,
        items: [],
        itemCount: 0,
        subtotal: 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(message);
      throw new Error(message);
    }
  }, [sessionId]);

  const itemCount = cart?.itemCount ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        updateQuantity,
        removeItem,
        clearCart: clearCartAction,
        itemCount,
        refreshCart: () => fetchCart(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
