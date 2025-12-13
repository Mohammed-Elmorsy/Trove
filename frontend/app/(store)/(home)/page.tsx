import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/products/product-card';
import { HomePagination } from '@/components/home/home-pagination';
import { Button } from '@/components/ui/button';

interface SearchParams {
  page?: string;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const productsData = await getProducts({ page, limit: 12 });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Trove</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <Link href="/products">
            <Button size="lg" variant="secondary">
              Browse All Products
            </Button>
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">
              Showing {productsData.data.length} of {productsData.meta.total} products
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {/* Products Grid */}
        {productsData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsData.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {productsData.meta.totalPages > 1 && (
          <div className="mt-12">
            <HomePagination
              currentPage={productsData.meta.page}
              totalPages={productsData.meta.totalPages}
            />
          </div>
        )}
      </section>
    </main>
  );
}
