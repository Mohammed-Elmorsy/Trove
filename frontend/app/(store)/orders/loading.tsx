import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function OrdersLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <Skeleton className="h-5 w-32 mb-6" />

        {/* Title skeleton */}
        <Skeleton className="h-9 w-32 mb-6" />

        <div className="max-w-2xl mx-auto">
          {/* Search Form Card skeleton */}
          <Card className="mb-8">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
