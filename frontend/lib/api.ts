import { Product, ProductsResponse, ProductQuery, Category } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

// Helper function to create fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout: The server took too long to respond');
    }
    throw error;
  }
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (query.search) params.append('search', query.search);
  if (query.categoryId) params.append('categoryId', query.categoryId);
  if (query.minPrice !== undefined) params.append('minPrice', query.minPrice.toString());
  if (query.maxPrice !== undefined) params.append('maxPrice', query.maxPrice.toString());
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());

  const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const res = await fetchWithTimeout(url, {
      next: {
        revalidate: 3600, // 1 hour (products don't change frequently)
        tags: ['products', 'products-list'],
      },
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Products not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch products: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    throw new Error('Failed to fetch products: Unknown error occurred');
  }
}

export async function getProduct(id: string): Promise<Product> {
  const url = `${API_BASE_URL}/products/${id}`;

  try {
    const res = await fetchWithTimeout(url, {
      next: {
        revalidate: 3600, // 1 hour
        tags: ['products', `product-${id}`],
      },
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Product not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch product: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
    throw new Error('Failed to fetch product: Unknown error occurred');
  }
}

export async function getCategories(): Promise<Category[]> {
  const url = `${API_BASE_URL}/products/categories`;

  try {
    const res = await fetchWithTimeout(url, {
      next: {
        revalidate: 86400, // 24 hours (categories rarely change)
        tags: ['categories'],
      },
      timeout: DEFAULT_TIMEOUT,
    });

    if (!res.ok) {
      const errorMessage =
        res.status === 404
          ? 'Categories not found'
          : res.status >= 500
            ? 'Server error. Please try again later.'
            : `Failed to fetch categories: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    throw new Error('Failed to fetch categories: Unknown error occurred');
  }
}
