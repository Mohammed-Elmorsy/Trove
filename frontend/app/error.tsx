'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error('Error:', error);

    // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket, etc.)
    // Example for Sentry:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     tags: {
    //       digest: error.digest,
    //       component: 'error-boundary',
    //     },
    //   });
    // }

    // You can also send to a custom error tracking endpoint
    if (process.env.NEXT_PUBLIC_ERROR_TRACKING_ENABLED === 'true') {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch((err) => console.error('Failed to log error:', err));
    }
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Failed to load products. Please try again.'}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </main>
  );
}
