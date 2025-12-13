import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct } from '@/lib/api';
import { escapeHtmlForJsonLd } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductImage } from '@/components/ui/product-image';
import { PageBreadcrumb } from '@/components/layout/page-breadcrumb';
import { AddToCartButton } from '@/components/products/add-to-cart-button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProduct(id);

    return {
      title: `${product.name} - Trove`,
      description:
        product.description || `Buy ${product.name} at Trove. In stock and ready to ship.`,
      openGraph: {
        title: product.name,
        description:
          product.description || `Buy ${product.name} at Trove. In stock and ready to ship.`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${id}`,
        images: product.imageUrl
          ? [
              {
                url: product.imageUrl,
                width: 1200,
                height: 1200,
                alt: product.name,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description:
          product.description || `Buy ${product.name} at Trove. In stock and ready to ship.`,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    };
  } catch (_error) {
    return {
      title: 'Product Not Found - Trove',
      description: 'The product you are looking for could not be found.',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch (_error) {
    notFound();
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  // JSON-LD structured data for SEO (sanitized to prevent XSS)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: escapeHtmlForJsonLd(product.name),
    description: escapeHtmlForJsonLd(product.description) || 'No description available',
    image: product.imageUrl || '',
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Trove',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${id}`,
      priceCurrency: 'USD',
      price: typeof product.price === 'number' ? product.price.toFixed(2) : product.price,
      availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    category: escapeHtmlForJsonLd(product.category.name),
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <PageBreadcrumb
            items={[
              { label: 'Products', href: '/products' },
              { label: product.category.name, href: `/products?categoryId=${product.category.id}` },
              { label: product.name },
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted shadow-lg">
              {product.imageUrl ? (
                <ProductImage src={product.imageUrl} alt={product.name} priority />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p className="text-2xl font-semibold">No Image Available</p>
                </div>
              )}

              {isOutOfStock && (
                <Badge className="absolute top-4 right-4 text-lg px-4 py-2" variant="destructive">
                  Out of Stock
                </Badge>
              )}
              {isLowStock && (
                <Badge className="absolute top-4 right-4 text-lg px-4 py-2" variant="secondary">
                  Only {product.stock} Left
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-3">
                  {product.category.name}
                </Badge>
                <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
                <p className="text-5xl font-bold text-blue-600">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || 'No description available for this product.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Product Details</h2>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Stock Status:</dt>
                      <dd className="font-semibold">
                        {isOutOfStock ? (
                          <span className="text-red-600">Out of Stock</span>
                        ) : (
                          <span className="text-green-600">
                            In Stock ({product.stock} available)
                          </span>
                        )}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="font-semibold">{product.category.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="font-mono text-sm">{product.id}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Add to Cart */}
              <div className="space-y-3">
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                  stock={product.stock}
                />
                <p className="text-sm text-gray-500 text-center">
                  {isOutOfStock
                    ? 'This product is currently unavailable'
                    : 'Free shipping on orders over $50'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
