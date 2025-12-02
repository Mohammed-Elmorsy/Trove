import { getProducts } from '@/lib/api';
import { ProductCard } from '@/components/products/product-card';

export default async function Home() {
  const productsData = await getProducts({ page: 1, limit: 12 });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Trove</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">
              Showing {productsData.data.length} of {productsData.meta.total} products
            </p>
          </div>
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
            <p className="text-xl text-gray-500">No products found</p>
          </div>
        )}

        {/* Pagination placeholder - will be implemented next */}
        {productsData.meta.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <p className="text-gray-500">
              Page {productsData.meta.page} of {productsData.meta.totalPages}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
