'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBreadcrumb } from '@/components/layout/page-breadcrumb';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { useCart } from '@/lib/hooks/use-cart';

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Show loading while cart is loading or order was just placed (redirecting)
  if (isLoading || isOrderPlaced) {
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

  if (isEmpty) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <PageBreadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before checking out.
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onOrderPlaced={() => setIsOrderPlaced(true)} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CheckoutSummary
                items={cart.items}
                subtotal={cart.subtotal}
                itemCount={cart.itemCount}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
