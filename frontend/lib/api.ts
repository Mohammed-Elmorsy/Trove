import { Product, ProductsResponse, ProductQuery, Category } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getProducts(query: ProductQuery = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (query.search) params.append('search', query.search);
  if (query.categoryId) params.append('categoryId', query.categoryId);
  if (query.minPrice !== undefined) params.append('minPrice', query.minPrice.toString());
  if (query.maxPrice !== undefined) params.append('maxPrice', query.maxPrice.toString());
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());

  const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }

  return res.json();
}

export async function getProduct(id: string): Promise<Product> {
  const url = `${API_BASE_URL}/products/${id}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.statusText}`);
  }

  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const url = `${API_BASE_URL}/products/categories`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }

  return res.json();
}
