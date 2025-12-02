export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="h-12 w-96 mx-auto bg-white/20 rounded animate-pulse mb-4" />
          <div className="h-6 w-64 mx-auto bg-white/20 rounded animate-pulse" />
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-9 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square w-full bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-200 rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
