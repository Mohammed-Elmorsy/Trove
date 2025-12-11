import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Cart } from '@trove/shared';
import { useSession } from '@/hooks/useSession';
import * as api from '@/lib/api';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: (showLoading?: boolean) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { sessionId, isLoading: sessionLoading } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(
    async (showLoading = false) => {
      if (!sessionId) return;

      try {
        if (showLoading) {
          setIsLoading(true);
        }
        setError(null);
        const cartData = await api.getCart(sessionId);
        setCart(cartData);
      } catch (err) {
        // If cart not found, create an empty cart state
        if (err instanceof Error && err.message.includes('not found')) {
          setCart({
            id: null,
            sessionId,
            items: [],
            itemCount: 0,
            subtotal: 0,
          });
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load cart');
        }
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [sessionId]
  );

  useEffect(() => {
    if (!sessionLoading && sessionId) {
      refreshCart(true); // Show loading on initial load
    }
  }, [sessionId, sessionLoading, refreshCart]);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      if (!sessionId) return;

      try {
        setError(null);
        await api.addToCart({
          sessionId,
          productId,
          quantity,
        });
        await refreshCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add to cart');
        throw err;
      }
    },
    [sessionId, refreshCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        setError(null);
        await api.updateCartItem(itemId, { quantity });
        await refreshCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update cart');
        throw err;
      }
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        setError(null);
        await api.removeCartItem(itemId);
        await refreshCart();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove item');
        throw err;
      }
    },
    [refreshCart]
  );

  const clearCartItems = useCallback(async () => {
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
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      throw err;
    }
  }, [sessionId]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading: isLoading || sessionLoading,
        error,
        sessionId,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart: clearCartItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
