import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/products/product-card';
import { SearchBar } from '@/components/products/search-bar';
import { CategoryFilter } from '@/components/products/category-filter';
import { PriceFilter } from '@/components/products/price-filter';
import { Pagination } from '@/components/products/pagination';

interface SearchParams {
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const limit = 12;

  const query = {
    search: params.search,
    categoryId: params.categoryId,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    page,
    limit,
  };

  const [productsData, categories] = await Promise.all([getProducts(query), getCategories()]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">All Products</h1>

        {/* Filters Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Search</h2>
              <SearchBar
                initialSearch={params.search}
                categoryId={params.categoryId}
                minPrice={params.minPrice}
                maxPrice={params.maxPrice}
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <CategoryFilter
                categories={categories}
                selectedCategoryId={params.categoryId}
                search={params.search}
                minPrice={params.minPrice}
                maxPrice={params.maxPrice}
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Price Range</h2>
              <PriceFilter
                minPrice={params.minPrice}
                maxPrice={params.maxPrice}
                search={params.search}
                categoryId={params.categoryId}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {productsData.data.length} of {productsData.meta.total} products
              </p>
            </div>

            {productsData.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {productsData.meta.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={productsData.meta.page}
                      totalPages={productsData.meta.totalPages}
                      search={params.search}
                      categoryId={params.categoryId}
                      minPrice={params.minPrice}
                      maxPrice={params.maxPrice}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <p className="text-xl text-gray-500 mb-2">No products found</p>
                <p className="text-gray-400">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
