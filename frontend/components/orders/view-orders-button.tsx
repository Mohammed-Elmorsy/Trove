'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';

export function ViewOrdersButton() {
  const { isAuthenticated } = useAuth();

  return (
    <Button variant="outline" asChild className="w-full">
      <Link href={isAuthenticated ? '/account/orders' : '/orders'}>View All Orders</Link>
    </Button>
  );
}
