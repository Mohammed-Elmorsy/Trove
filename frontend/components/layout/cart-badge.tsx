'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/use-cart';

export function CartBadge() {
  const { itemCount, isLoading } = useCart();

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
        <span className="sr-only">Shopping Cart{itemCount > 0 ? ` (${itemCount} items)` : ''}</span>
      </Link>
    </Button>
  );
}
