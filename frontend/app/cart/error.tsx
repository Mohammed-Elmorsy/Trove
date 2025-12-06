'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CartError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Cart error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <Alert variant="destructive" className="max-w-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || 'Failed to load your cart. Please try again.'}
          </AlertDescription>
          <Button variant="outline" onClick={reset} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </Alert>
      </div>
    </main>
  );
}
