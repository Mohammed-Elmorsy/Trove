import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderNotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <PackageX className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn&apos;t find the order you&apos;re looking for. It may have been deleted or the
            link is incorrect.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/orders">Lookup Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
