import type { Product, ProductsResponse, ProductQuery, Category } from '@trove/shared';
import { API_BASE_URL, DEFAULT_TIMEOUT, fetchWithTimeout } from './client';

/**
 * Get paginated list of products with optional filters
 */
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

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<Product> {
  const url = `${API_BASE_URL}/products/${id}`;

  try {
    const res = await fetchWithTimeout(url, {
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

/**
 * Get all product categories
 */
export async function getCategories(): Promise<Category[]> {
  const url = `${API_BASE_URL}/products/categories`;

  try {
    const res = await fetchWithTimeout(url, {
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
