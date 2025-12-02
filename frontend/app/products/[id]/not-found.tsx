import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PackageX } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <PackageX className="mx-auto h-24 w-24 text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/products">
          <Button size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    </main>
  );
}
