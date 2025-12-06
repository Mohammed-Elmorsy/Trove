'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageBreadcrumb } from '@/components/layout/page-breadcrumb';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyCart } from '@/components/cart/empty-cart';
import { useCart } from '@/lib/hooks/use-cart';
import { toast } from 'sonner';
import { useState } from 'react';

export default function CartPage() {
  const { cart, isLoading, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = async () => {
    if (isClearing) return;

    setIsClearing(true);
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb items={[{ label: 'Cart' }]} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {!isEmpty && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Clear Cart
            </Button>
          )}
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Cart Items ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </CardContent>
              </Card>

              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary subtotal={cart.subtotal} itemCount={cart.itemCount} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
