'use server';

import { updateTag } from 'next/cache';

/**
 * Revalidate products cache
 * Call this after creating, updating, or deleting products in admin
 * Uses updateTag for immediate cache invalidation (Next.js 16)
 */
export async function revalidateProducts() {
  updateTag('products');
  updateTag('products-list');
}

/**
 * Revalidate a specific product cache
 */
export async function revalidateProduct(productId: string) {
  updateTag(`product-${productId}`);
  updateTag('products');
  updateTag('products-list');
}

/**
 * Revalidate categories cache
 */
export async function revalidateCategories() {
  updateTag('categories');
}
